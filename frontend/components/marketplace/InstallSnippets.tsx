"use client";

import { useState } from "react";
import { Check, Copy } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/** Per-harness install instructions, modelled on Replicate's per-language API tabs. */
export function InstallSnippets({ slug, downloadUrl }: { slug: string; downloadUrl?: string }) {
  const zip = downloadUrl ?? `${slug}.zip`;
  const HARNESSES: { id: string; label: string; code: string; note: string }[] = [
    { id: "claude", label: "Claude Code", note: "Personal skills live in ~/.claude/skills; project skills in .claude/skills.", code: `mkdir -p ~/.claude/skills\nunzip ${zip} -d ~/.claude/skills\n# then ask Claude: "use the ${slug} skill"` },
    { id: "cursor", label: "Cursor", note: "Cursor reads skills from .cursor/skills (project) or ~/.cursor/skills. Or export the Cursor plugin.", code: `mkdir -p .cursor/skills\nunzip ${zip} -d .cursor/skills` },
    { id: "codex", label: "Codex", note: "Codex reads skills from ~/.codex/skills; AGENTS.md export also works.", code: `mkdir -p ~/.codex/skills\nunzip ${zip} -d ~/.codex/skills` },
    { id: "gemini", label: "Gemini CLI", note: "Export the Gemini extension, then link it.", code: `gemini extensions link ./${slug}-gemini` },
    { id: "openclaw", label: "OpenClaw", note: "Drop the folder into your workspace skills directory.", code: `unzip ${zip} -d ~/.openclaw/workspace/skills` },
    { id: "any", label: "Any agent", note: "Every skill is a plain SKILL.md folder (Agent Skills spec).", code: `unzip ${zip} -d ./skills\ncat ./skills/${slug}/SKILL.md` },
  ];
  const [active, setActive] = useState(HARNESSES[0].id);
  const [copied, setCopied] = useState(false);
  const h = HARNESSES.find((x) => x.id === active)!;

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface">
      <div className="flex gap-1 overflow-x-auto border-b border-line bg-surface-2 px-2" role="tablist" aria-label="Install for">
        {HARNESSES.map((x) => (
          <button key={x.id} role="tab" aria-selected={x.id === active} type="button" onClick={() => setActive(x.id)}
            className={cn("-mb-px shrink-0 border-b-2 px-3 py-2.5 text-xs font-semibold", x.id === active ? "border-ultra text-fg" : "border-transparent text-fg-3 hover:text-fg")}>
            {x.label}
          </button>
        ))}
      </div>
      <div className="p-4">
        <p className="text-sm text-fg-2">{h.note}</p>
        <div className="relative mt-3">
          <pre className="t-mono overflow-x-auto rounded-lg bg-navy p-4 pr-12 text-xs leading-relaxed text-tint">{h.code}</pre>
          <button type="button" aria-label="Copy" onClick={() => { navigator.clipboard.writeText(h.code); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
            className="absolute right-2 top-2 rounded-md p-2 text-tint/70 hover:text-tint">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
