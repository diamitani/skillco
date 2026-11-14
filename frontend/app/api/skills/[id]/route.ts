import { NextRequest } from "next/server";
import { z } from "zod";
import { getUser } from "@/lib/supabase/server";
import { lintSkill, parseSkillMd, filesSize } from "@/lib/builder/skillmd";

export const runtime = "nodejs";

const Patch = z.object({
  files: z.record(z.string(), z.string().max(200_000)),
  changeNote: z.string().max(200).optional(),
  visibility: z.enum(["private", "unlisted", "public"]).optional(),
});

/** Save an edit as a new version (versions are immutable). */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, user } = await getUser();
  if (!supabase || !user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = Patch.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return Response.json({ error: "Invalid body" }, { status: 400 });

  const { data: skill } = await supabase.from("skills").select("id, slug, owner_id").eq("id", id).single();
  if (!skill || skill.owner_id !== user.id) return Response.json({ error: "Not found" }, { status: 404 });

  const files = parsed.data.files;
  const lint = lintSkill(files, skill.slug);
  if (lint.some((l) => l.level === "error")) return Response.json({ error: "Lint failed", lint }, { status: 422 });

  const { data: last } = await supabase.from("skill_versions").select("version").eq("skill_id", id).order("version", { ascending: false }).limit(1).single();
  const version = (last?.version ?? 0) + 1;
  const { data: ver, error } = await supabase
    .from("skill_versions")
    .insert({ skill_id: id, version, files, qa_report: { lint, passed: true }, change_note: parsed.data.changeNote ?? "Edited", size_bytes: filesSize(files) })
    .select("id, version")
    .single();
  if (error || !ver) return Response.json({ error: error?.message ?? "Save failed" }, { status: 500 });

  const { meta } = parseSkillMd(files["SKILL.md"]);
  await supabase
    .from("skills")
    .update({ current_version_id: ver.id, description: (meta.description || "").slice(0, 1024) || undefined, ...(parsed.data.visibility ? { visibility: parsed.data.visibility } : {}) })
    .eq("id", id);
  return Response.json({ version: ver.version, lint });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, user } = await getUser();
  if (!supabase || !user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { error } = await supabase.from("skills").delete().eq("id", id).eq("owner_id", user.id);
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ ok: true });
}
