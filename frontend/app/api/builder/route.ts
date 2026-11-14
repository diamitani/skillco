import { NextRequest } from "next/server";
import { BuildInput, type BuildEvent } from "@/lib/builder/schemas";
import { runPipeline } from "@/lib/builder/pipeline";
import { getUser, createServiceClient } from "@/lib/supabase/server";
import { decideCredit, loadProfile, recordGeneration } from "@/lib/billing/usage";
import { PLANS } from "@/lib/billing/plans";
import { isAiConfigured, isSupabaseConfigured } from "@/lib/env";
import { filesSize } from "@/lib/builder/skillmd";
import type { KbCard } from "@/lib/kb/seed";

export const runtime = "nodejs";
export const maxDuration = 300;

/**
 * POST /api/builder  → NDJSON stream of BuildEvent lines.
 * goal → intake → tool & connector discovery → step plan → SKILL.md + references → QA.
 */
export async function POST(req: NextRequest) {
  const parsed = BuildInput.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  if (!isAiConfigured()) return Response.json({ error: "AI Gateway is not configured (AI_GATEWAY_API_KEY or Vercel OIDC)." }, { status: 503 });

  const demo = !isSupabaseConfigured() && process.env.NODE_ENV !== "production";
  const { user } = await getUser();
  if (!user && !demo) return Response.json({ error: "Sign in to build skills." }, { status: 401 });

  const admin = createServiceClient();
  const profile = user && admin ? await loadProfile(admin, user.id) : null;
  if (user && !profile) return Response.json({ error: "Profile not found or service key missing." }, { status: 500 });
  const decision = profile ? decideCredit(profile) : { allowed: true, overage: false, remaining: 1 };
  if (!decision.allowed) return Response.json({ error: decision.reason, code: "usage_cap" }, { status: 402 });

  const plan = PLANS[profile?.plan ?? "free"];
  const input = parsed.data;

  // KB retrieval: freshest cards for the chosen targets (falls back to seed cards in code)
  let kbCards: KbCard[] | undefined;
  if (admin) {
    const platforms = [...input.targets.map((t) => (t === "claude-code" ? "claude-code" : t)), "agent-skills", "mcp", "claude"];
    const { data } = await admin
      .from("kb_cards")
      .select("platform, title, content, kb_sources(url)")
      .in("platform", platforms)
      .order("created_at", { ascending: false })
      .limit(14);
    if (data?.length)
      kbCards = data.map((c) => ({
        platform: c.platform,
        title: c.title ?? "",
        content: String(c.content).slice(0, 1200),
        url: (c.kb_sources as unknown as { url: string } | null)?.url ?? "",
      }));
  }

  let runId: string | null = null;
  if (user && admin) {
    const { data } = await admin.from("generation_runs").insert({ owner_id: user.id, input }).select("id").single();
    runId = data?.id ?? null;
  }

  const enc = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const emit = (e: BuildEvent) => controller.enqueue(enc.encode(JSON.stringify(e) + "\n"));
      try {
        const res = await runPipeline({
          input,
          kbCards,
          useStrongModel: plan.finalModel === "strong",
          author: user?.email ?? "SkillCo user",
          emit,
        });

        let skillId: string | undefined;
        if (user && admin && profile && runId) {
          // upsert skill (bump slug on collision) and save version 1
          let slug = res.slug;
          const { data: existing } = await admin.from("skills").select("id").eq("owner_id", user.id).eq("slug", slug).maybeSingle();
          if (existing) slug = `${slug}-${Date.now().toString(36).slice(-4)}`.slice(0, 64);
          if (slug !== res.slug) {
            res.files["SKILL.md"] = res.files["SKILL.md"].replace(/^name: .+$/m, `name: ${slug}`);
          }
          const { data: skill } = await admin
            .from("skills")
            .insert({ owner_id: user.id, slug, name: res.intake.title, description: res.intake.description.slice(0, 1024), category: res.intake.category, platforms: input.targets, source: "generated" })
            .select("id")
            .single();
          if (skill) {
            const size = filesSize(res.files);
            const { data: ver } = await admin
              .from("skill_versions")
              .insert({ skill_id: skill.id, version: 1, files: res.files, manifest: res.manifest, qa_report: res.qa, change_note: "Generated", size_bytes: size, run_id: runId })
              .select("id")
              .single();
            await admin.from("skills").update({ current_version_id: ver?.id }).eq("id", skill.id);
            const { data: p } = await admin.from("profiles").select("storage_bytes").eq("id", user.id).single();
            await admin.from("profiles").update({ storage_bytes: (p?.storage_bytes ?? 0) + size }).eq("id", user.id);
            skillId = skill.id;
          }
          await admin
            .from("generation_runs")
            .update({ status: "succeeded", skill_id: skillId, input_tokens: res.inputTokens, output_tokens: res.outputTokens, cost_usd: res.costUsd, model_draft: res.models.draft, model_final: res.models.final, finished_at: new Date().toISOString() })
            .eq("id", runId);
          await recordGeneration(admin, profile, decision, runId);
          res.slug = slug;
        }
        emit({ type: "result", skillId, slug: res.slug, files: res.files, qa: res.qa });
      } catch (e) {
        const message = e instanceof Error ? e.message : "Generation failed";
        console.error("[builder]", e);
        if (admin && runId) await admin.from("generation_runs").update({ status: "failed", error: message, finished_at: new Date().toISOString() }).eq("id", runId);
        emit({ type: "error", message });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-store", "X-Accel-Buffering": "no" },
  });
}
