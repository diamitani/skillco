"use client";

import { useState, type ReactNode } from "react";
import { FileViewer } from "@/components/dashboard/FileViewer";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "readme", label: "README" },
  { id: "install", label: "Install" },
  { id: "files", label: "Files" },
] as const;

export function SkillTabs({ readme, files, install }: { readme: string; files: Record<string, string>; install: ReactNode }) {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("readme");
  return (
    <div>
      <div className="flex gap-1 border-b border-line" role="tablist">
        {TABS.map((t) => (
          <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)}
            className={cn("-mb-px border-b-2 px-4 py-2 text-sm font-semibold", tab === t.id ? "border-ultra text-fg" : "border-transparent text-fg-3 hover:text-fg")}>
            {t.label}
          </button>
        ))}
      </div>
      <div className="mt-6">
        {tab === "readme" && (
          <article className="rounded-xl border border-line bg-surface p-6">
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-fg-2">{readme}</pre>
          </article>
        )}
        {tab === "install" && install}
        {tab === "files" && (Object.keys(files).length ? <FileViewer files={files} /> : <p className="text-sm text-fg-3">Files are inside the zip download.</p>)}
      </div>
    </div>
  );
}
