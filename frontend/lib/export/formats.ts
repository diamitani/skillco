/** Export formats. Ported from diamitani/agent-skills scripts/build.py, plus plugin packaging. */
export const EXPORT_FORMATS = {
  "agent-skills": { label: "Agent Skills (.zip)", hint: "Any harness that reads SKILL.md" },
  cursor: { label: "Cursor plugin", hint: ".cursor-plugin/plugin.json + skills/ + rules/" },
  claude: { label: "Claude Code plugin", hint: ".claude-plugin marketplace + plugin" },
  codex: { label: "Codex (AGENTS.md)", hint: "Drop into repo root" },
  gemini: { label: "Gemini CLI extension", hint: "gemini-extension.json + GEMINI.md" },
  openai: { label: "OpenAI / Custom GPT", hint: "AGENTS.md + instructions.md (≤8000 chars)" },
} as const;
export type ExportFormat = keyof typeof EXPORT_FORMATS;
