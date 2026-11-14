"use client";

import { useState } from "react";
import { DownloadSimple } from "@phosphor-icons/react";
import { EXPORT_FORMATS, type ExportFormat } from "@/lib/export/formats";

/**
 * Install-to-platform buttons. Saved skills download from /api/skills/:id/export,
 * unsaved builder output is zipped statelessly via POST /api/export.
 */
export function ExportMenu({ skillId, slug, files, version }: { skillId?: string; slug: string; files?: Record<string, string>; version?: number }) {
  const [busy, setBusy] = useState<string | null>(null);

  async function download(format: ExportFormat) {
    setBusy(format);
    try {
      let res: Response;
      if (skillId) res = await fetch(`/api/skills/${skillId}/export?format=${format}${version ? `&version=${version}` : ""}`);
      else res = await fetch("/api/export", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ format, slug, files }) });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Export failed");
      const blob = await res.blob();
      const name = res.headers.get("Content-Disposition")?.match(/filename="(.+)"/)?.[1] ?? `${slug}.zip`;
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = name;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Export failed");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {(Object.keys(EXPORT_FORMATS) as ExportFormat[]).map((f) => (
        <button
          key={f}
          type="button"
          onClick={() => download(f)}
          disabled={!!busy}
          className="flex items-start gap-3 rounded-lg border border-line bg-surface p-3 text-left hover:border-line-strong disabled:opacity-50"
        >
          <DownloadSimple weight="bold" className="mt-0.5 h-4 w-4 shrink-0 text-link" />
          <span>
            <span className="block text-sm font-semibold">{busy === f ? "Packaging…" : EXPORT_FORMATS[f].label}</span>
            <span className="block text-xs text-fg-3">{EXPORT_FORMATS[f].hint}</span>
          </span>
        </button>
      ))}
    </div>
  );
}
