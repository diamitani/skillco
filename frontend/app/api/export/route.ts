import { NextRequest } from "next/server";
import { z } from "zod";
import { buildExport, EXPORT_FORMATS, type ExportFormat } from "@/lib/export";

export const runtime = "nodejs";

const Body = z.object({
  format: z.enum(Object.keys(EXPORT_FORMATS) as [ExportFormat, ...ExportFormat[]]),
  slug: z.string().min(1).max(64),
  files: z.record(z.string(), z.string().max(200_000)),
});

/** Zip an in-memory skill (builder result before/after save). Stateless; no data stored. */
export async function POST(req: NextRequest) {
  const parsed = Body.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return Response.json({ error: "Invalid export request" }, { status: 400 });
  const { format, slug, files } = parsed.data;
  if (!files["SKILL.md"]) return Response.json({ error: "SKILL.md missing" }, { status: 400 });
  const { data, filename } = await buildExport(format, files, slug);
  return new Response(Buffer.from(data), {
    headers: { "Content-Type": "application/zip", "Content-Disposition": `attachment; filename="${filename}"` },
  });
}
