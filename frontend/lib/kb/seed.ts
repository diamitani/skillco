/**
 * Seed best-practices knowledge base. Each card is a short, cited rule distilled from
 * official docs. The weekly cron (/api/cron/kb-refresh) re-fetches the sources and
 * stores fresh chunks in Supabase; these cards are the offline fallback.
 */
export interface KbCard {
  platform: string;
  title: string;
  content: string;
  url: string;
}

export const KB_SOURCES = [
  { kind: "doc", platform: "agent-skills", title: "Agent Skills specification", url: "https://agentskills.io/specification" },
  { kind: "llms_txt", platform: "agent-skills", title: "Agent Skills llms.txt", url: "https://agentskills.io/llms.txt" },
  { kind: "doc", platform: "claude-code", title: "Claude Code: Agent Skills", url: "https://code.claude.com/docs/en/skills" },
  { kind: "doc", platform: "claude-code", title: "Claude Code: Plugins", url: "https://code.claude.com/docs/en/plugins" },
  { kind: "doc", platform: "claude-code", title: "Claude Code: Plugin marketplaces", url: "https://code.claude.com/docs/en/plugin-marketplaces" },
  { kind: "doc", platform: "claude", title: "Skill authoring best practices", url: "https://docs.claude.com/en/docs/agents-and-tools/agent-skills/best-practices" },
  { kind: "doc", platform: "cursor", title: "Cursor: Plugins", url: "https://cursor.com/docs/plugins" },
  { kind: "doc", platform: "cursor", title: "Cursor: Plugins reference", url: "https://cursor.com/docs/reference/plugins" },
  { kind: "doc", platform: "cursor", title: "Cursor: Rules", url: "https://cursor.com/docs/context/rules" },
  { kind: "doc", platform: "mcp", title: "MCP specification", url: "https://modelcontextprotocol.io/specification/latest" },
  { kind: "llms_txt", platform: "mcp", title: "MCP llms.txt", url: "https://modelcontextprotocol.io/llms.txt" },
  { kind: "doc", platform: "openai", title: "AGENTS.md", url: "https://agents.md" },
] as const;

const SPEC = "https://agentskills.io/specification";
const CURSOR = "https://cursor.com/docs/reference/plugins";
const CLAUDE = "https://code.claude.com/docs/en/plugins";
const MCP = "https://modelcontextprotocol.io/specification/latest";

export const SEED_CARDS: KbCard[] = [
  { platform: "agent-skills", url: SPEC, title: "Required frontmatter",
    content: "SKILL.md starts with YAML frontmatter. `name` is required: 1-64 chars, lowercase a-z, 0-9 and single hyphens, no leading/trailing hyphen, and must equal the folder name. `description` is required: 1-1024 chars, says what the skill does AND when to use it, with trigger keywords." },
  { platform: "agent-skills", url: SPEC, title: "Optional frontmatter",
    content: "Optional fields: `license`, `compatibility` (≤500 chars, only when there are real environment requirements), `metadata` (string→string map, e.g. author, version), `allowed-tools` (experimental, space-separated)." },
  { platform: "agent-skills", url: SPEC, title: "Progressive disclosure",
    content: "Agents load name+description (~100 tokens) for every skill, the SKILL.md body (<5000 tokens recommended, <500 lines) only on activation, and files in references/, scripts/, assets/ only when needed. Keep SKILL.md lean and push detail into focused reference files referenced one level deep with relative paths." },
  { platform: "agent-skills", url: SPEC, title: "Directory layout",
    content: "skill-name/SKILL.md (required), scripts/ (self-contained executable helpers with clear errors), references/ (REFERENCE.md and focused domain docs), assets/ (templates, schemas, data). Validate with `skills-ref validate ./skill`." },
  { platform: "claude", url: "https://docs.claude.com/en/docs/agents-and-tools/agent-skills/best-practices", title: "Write for the agent",
    content: "Be concise: assume the model is smart and only add context it lacks. Write descriptions in third person with concrete triggers. Give numbered workflows with checklists for multi-step tasks, a feedback loop (validate → fix → re-run), and one default approach instead of many options. Avoid time-sensitive statements." },
  { platform: "claude-code", url: CLAUDE, title: "Claude Code plugin layout",
    content: "A Claude Code plugin has .claude-plugin/plugin.json (name, description, version, author), skills/<name>/SKILL.md, optional commands/, agents/, hooks/hooks.json and .mcp.json. Distribute via a marketplace repo with .claude-plugin/marketplace.json; users run `/plugin marketplace add <owner/repo>` then `/plugin install <name>@<marketplace>`." },
  { platform: "cursor", url: CURSOR, title: "Cursor plugin layout",
    content: "A Cursor plugin has .cursor-plugin/plugin.json (required `name` in kebab-case; displayName, version, author, description, keywords, logo), skills/<name>/SKILL.md, rules/*.mdc, agents/, commands/, hooks/hooks.json and mcp.json at the plugin root. Paths in plugin.json are relative to the plugin root. Secrets are declared as `variables` and set by the user, never stored in the plugin." },
  { platform: "cursor", url: "https://cursor.com/docs/context/rules", title: "Cursor rules",
    content: "Rules are .mdc files with frontmatter `description`, `globs`, `alwaysApply`. Use alwaysApply:false plus a precise description for agent-requested rules; keep each rule focused and under ~500 lines." },
  { platform: "mcp", url: MCP, title: "MCP connectors",
    content: "Prefer an official remote MCP server (Streamable HTTP + OAuth 2.1) for each external system; fall back to a local stdio server, then a plain REST API with a scoped token. Name the exact tools the skill calls and require user confirmation before writes, deletes, sends or payments." },
  { platform: "mcp", url: "https://modelcontextprotocol.io/specification/latest/basic/authorization", title: "MCP auth",
    content: "Remote MCP servers authorize with OAuth 2.1 (PKCE, protected resource metadata, dynamic client registration). Skills must never ask users to paste long-lived secrets into chat; reference env variables or connector sign-in instead." },
  { platform: "openai", url: "https://agents.md", title: "AGENTS.md",
    content: "AGENTS.md is a plain Markdown file of agent instructions read by Codex, Cursor, Gemini CLI and others. Put setup commands, conventions and the workflow in it; nearest file in the tree wins." },
  { platform: "general", url: SPEC, title: "Orchestration quality bar",
    content: "Good skills define inputs, outputs and a definition of done; list the tools/connectors with auth needs; give numbered steps with explicit approval gates for irreversible actions; specify failure handling; and include one worked example." },
];

export function seedCardsFor(platforms: string[]): KbCard[] {
  const set = new Set([...platforms, "agent-skills", "general", "claude", "mcp"]);
  return SEED_CARDS.filter((c) => set.has(c.platform));
}
