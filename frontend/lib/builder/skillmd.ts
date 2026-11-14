import type { QaReport, SkillFiles } from "@/lib/builder/schemas";

export const NAME_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export function toSlug(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64)
    .replace(/-$/, "") || "untitled-skill";
}

export function yamlQuote(v: string) {
  return `"${v.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, " ")}"`;
}

export function buildFrontmatter(meta: {
  name: string;
  description: string;
  version?: string;
  author?: string;
  compatibility?: string;
}) {
  const lines = [
    "---",
    `name: ${meta.name}`,
    `description: ${yamlQuote(meta.description.slice(0, 1024))}`,
  ];
  if (meta.compatibility) lines.push(`compatibility: ${yamlQuote(meta.compatibility.slice(0, 500))}`);
  lines.push("metadata:");
  lines.push(`  author: ${yamlQuote(meta.author || "skillco.work")}`);
  lines.push(`  version: "${meta.version || "1.0.0"}"`);
  lines.push(`  generator: "skillco-builder"`);
  lines.push("---", "");
  return lines.join("\n");
}

/** Minimal frontmatter parser (flat keys + one nested metadata map). */
export function parseSkillMd(text: string): { meta: Record<string, string>; body: string } {
  const m = text.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
  if (!m) return { meta: {}, body: text };
  const meta: Record<string, string> = {};
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (kv) meta[kv[1]] = kv[2].trim().replace(/^["']|["']$/g, "");
  }
  return { meta, body: m[2] };
}

/** Deterministic Agent Skills spec lint. */
export function lintSkill(files: SkillFiles, folderName: string): QaReport["lint"] {
  const out: QaReport["lint"] = [];
  const md = files["SKILL.md"];
  if (!md) return [{ level: "error", message: "SKILL.md is missing" }];
  const { meta, body } = parseSkillMd(md);
  if (!meta.name) out.push({ level: "error", message: "frontmatter `name` is missing" });
  else {
    if (meta.name.length > 64) out.push({ level: "error", message: "`name` is longer than 64 characters" });
    if (!NAME_RE.test(meta.name)) out.push({ level: "error", message: "`name` must be lowercase letters, digits and single hyphens" });
    if (meta.name !== folderName) out.push({ level: "error", message: `\`name\` (${meta.name}) must match the folder name (${folderName})` });
  }
  if (!meta.description) out.push({ level: "error", message: "frontmatter `description` is missing" });
  else {
    if (meta.description.length > 1024) out.push({ level: "error", message: "`description` is longer than 1024 characters" });
    if (!/\buse (it )?(when|for|this)\b|\bwhen\b/i.test(meta.description))
      out.push({ level: "warn", message: "`description` should say when to use the skill" });
  }
  const lines = body.split("\n").length;
  if (lines > 500) out.push({ level: "warn", message: `SKILL.md body is ${lines} lines; keep it under 500 and move detail to references/` });
  if (!/^\s*1\.\s/m.test(body)) out.push({ level: "warn", message: "No numbered steps found in SKILL.md" });
  // references must resolve
  for (const ref of body.matchAll(/\]\(((?:references|scripts|assets)\/[^)\s]+)\)/g)) {
    if (!files[ref[1]]) out.push({ level: "warn", message: `Linked file ${ref[1]} does not exist` });
  }
  // naive secret scan
  const secretRe = /(sk_live_[0-9a-zA-Z]{10,}|sk-[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|xox[baprs]-[A-Za-z0-9-]{10,})/;
  for (const [path, content] of Object.entries(files)) {
    if (secretRe.test(content)) out.push({ level: "error", message: `Possible secret in ${path}` });
  }
  return out;
}

export function filesSize(files: SkillFiles) {
  return Object.values(files).reduce((n, c) => n + new TextEncoder().encode(c).length, 0);
}
