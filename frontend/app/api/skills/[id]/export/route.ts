import { NextRequest } from "next/server";
import { getUser } from "@/lib/supabase/server";
import { buildExport, EXPORT_FORMATS, type ExportFormat } from "@/lib/export";

export const runtime = "nodejs";

/** GET /api/skills/:id/export?format=cursor&version=3 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const format = (req.nextUrl.searchParams.get("format") || "agent-skills") as ExportFormat;
  if (!(format in EXPORT_FORMATS)) return Response.json({ error: "Unknown format" }, { status: 400 });
  const { supabase, user } = await getUser();
  if (!supabase) return Response.json({ error: "Auth not configured" }, { status: 503 });

  const { data: skill } = await supabase.from("skills").select("id, slug, owner_id, visibility, current_version_id").eq("id", id).single();
  if (!skill || (skill.owner_id !== user?.id && skill.visibility === "private")) return Response.json({ error: "Not found" }, { status: 404 });

  const v = req.nextUrl.searchParams.get("version");
  const q = supabase.from("skill_versions").select("version, files").eq("skill_id", id);
  const { data: ver } = v ? await q.eq("version", Number(v)).single() : await q.eq("id", skill.current_version_id).single();
  if (!ver) return Response.json({ error: "Version not found" }, { status: 404 });

  const { data, filename } = await buildExport(format, ver.files as Record<string, string>, skill.slug, ver.version, user?.email ?? "SkillCo");
  return new Response(Buffer.from(data), {
    headers: { "Content-Type": "application/zip", "Content-Disposition": `attachment; filename="${filename}"` },
  });
}
