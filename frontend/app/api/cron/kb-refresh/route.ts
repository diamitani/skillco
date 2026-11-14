import { NextRequest } from "next/server";
import { createHash } from "crypto";
import { embedMany } from "ai";
import { createServiceClient } from "@/lib/supabase/server";
import { env, isAiConfigured } from "@/lib/env";
import { KB_SOURCES } from "@/lib/kb/seed";

export const runtime = "nodejs";
export const maxDuration = 300;

/**
 * Weekly knowledge-base refresh (see vercel.json crons).
 * Fetches each official doc source, skips unchanged pages by content hash,
 * chunks the text, embeds it through AI Gateway, and stores kb_cards.
 * X / Reddit ingest is Phase 3 and plugs in here as more source kinds.
 */
export async function GET(req: NextRequest) {
  if (!env.cronSecret || req.headers.get("authorization") !== `Bearer ${env.cronSecret}`)
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  const admin = createServiceClient();
  if (!admin) return Response.json({ error: "Supabase service key missing" }, { status: 503 });

  // make sure seed sources exist
  await admin.from("kb_sources").upsert(KB_SOURCES.map((s) => ({ ...s })), { onConflict: "url", ignoreDuplicates: true });
  const { data: sources } = await admin.from("kb_sources").select("id, url, platform, title, content_hash, kind").in("kind", ["doc", "llms_txt", "changelog"]);

  const report: { url: string; status: string; chunks?: number }[] = [];
  for (const s of sources ?? []) {
    try {
      const res = await fetch(mdUrl(s.url), { headers: { "User-Agent": "SkillCoKB/1.0 (+https://www.skillco.work)" }, signal: AbortSignal.timeout(20000) });
      const raw = await res.text();
      const text = res.headers.get("content-type")?.includes("html") ? htmlToText(raw) : raw;
      const hash = createHash("sha256").update(text).digest("hex");
      await admin.from("kb_sources").update({ last_fetched: new Date().toISOString(), last_status: res.status }).eq("id", s.id);
      if (!res.ok) { report.push({ url: s.url, status: `http ${res.status}` }); continue; }
      if (hash === s.content_hash) { report.push({ url: s.url, status: "unchanged" }); continue; }

      const chunks = chunk(text).slice(0, 60);
      let embeddings: number[][] | undefined;
      if (isAiConfigured()) {
        const out = await embedMany({ model: env.embedModel, values: chunks });
        embeddings = out.embeddings;
      }
      await admin.from("kb_cards").delete().eq("source_id", s.id);
      await admin.from("kb_cards").insert(
        chunks.map((c, i) => ({
          source_id: s.id,
          platform: s.platform,
          title: `${s.title} (${i + 1}/${chunks.length})`,
          content: c,
          content_hash: createHash("sha256").update(c).digest("hex"),
          embedding: embeddings ? (embeddings[i] as unknown as string) : null,
        }))
      );
      await admin.from("kb_sources").update({ content_hash: hash }).eq("id", s.id);
      report.push({ url: s.url, status: "updated", chunks: chunks.length });
    } catch (e) {
      report.push({ url: s.url, status: `error: ${e instanceof Error ? e.message : e}` });
    }
  }
  return Response.json({ refreshed: report.length, report });
}

/** Many doc sites serve Markdown when ".md" is appended; try that first for cleaner text. */
function mdUrl(u: string) {
  if (u.endsWith(".txt") || u.endsWith(".md")) return u;
  return u;
}

function htmlToText(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<(nav|footer|header)[\s\S]*?<\/\1>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|h[1-6]|li|pre|tr|div)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#39;/g, "'").replace(/&quot;/g, '"')
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function chunk(text: string, size = 1800, overlap = 200) {
  const out: string[] = [];
  for (let i = 0; i < text.length; i += size - overlap) {
    const c = text.slice(i, i + size).trim();
    if (c.length > 80) out.push(c);
  }
  return out;
}
