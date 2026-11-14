"use client";

import { useState } from "react";
import { FileText } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/** File tree + viewer/editor for a skill's files. */
export function FileViewer({
  files,
  editable = false,
  onChange,
}: {
  files: Record<string, string>;
  editable?: boolean;
  onChange?: (files: Record<string, string>) => void;
}) {
  const paths = Object.keys(files).sort((a, b) => (a === "SKILL.md" ? -1 : b === "SKILL.md" ? 1 : a.localeCompare(b)));
  const [active, setActive] = useState(paths[0] ?? "SKILL.md");
  const current = files[active] ?? "";

  return (
    <div className="grid overflow-hidden rounded-xl border border-line bg-surface md:grid-cols-[220px_1fr]">
      <ul className="border-b border-line bg-surface-2 p-2 md:border-b-0 md:border-r" aria-label="Files">
        {paths.map((p) => (
          <li key={p}>
            <button
              type="button"
              onClick={() => setActive(p)}
              className={cn("t-mono flex w-full items-center gap-2 truncate rounded-md px-2 py-1.5 text-left text-xs", p === active ? "bg-surface text-fg" : "text-fg-2 hover:text-fg")}
            >
              <FileText className="h-3.5 w-3.5 shrink-0" />
              {p}
            </button>
          </li>
        ))}
      </ul>
      {editable ? (
        <textarea
          aria-label={`Edit ${active}`}
          value={current}
          onChange={(e) => onChange?.({ ...files, [active]: e.target.value })}
          spellCheck={false}
          className="t-mono min-h-[480px] w-full resize-y bg-surface p-4 text-xs leading-relaxed text-fg focus:outline-none"
        />
      ) : (
        <pre className="t-mono max-h-[560px] min-h-[320px] overflow-auto whitespace-pre-wrap p-4 text-xs leading-relaxed text-fg">{current}</pre>
      )}
    </div>
  );
}
