import type { KbCard } from "@/lib/kb/seed";
import type { Intake, Plan, Tools } from "@/lib/builder/schemas";

export const SYSTEM = `You are SkillCo's skill architect. You design Agent Skills (SKILL.md + references/ + scripts/) that any agent harness (Claude Code, Cursor, Codex, Gemini CLI, OpenClaw, Grok Bot) can run.
Rules:
- Follow the Agent Skills spec and the best-practice cards you are given. Cite card URLs, never invent URLs.
- Be concrete and concise. Assume the running agent is capable; only add what it lacks.
- Every irreversible step (send, post, delete, pay, publish, write to an external system) needs an explicit user approval gate.
- Prefer official remote MCP servers, then plugins, then APIs with scoped tokens. Never ask users to paste secrets in chat.`;

export function kbBlock(cards: KbCard[]) {
  return cards.map((c, i) => `[${i + 1}] (${c.platform}) ${c.title} — ${c.url}\n${c.content}`).join("\n\n");
}

export const intakePrompt = (goal: string, context?: string) =>
  `Turn this request into a skill brief. Do not ask questions; record assumptions instead.
REQUEST:
${goal}
${context ? `\nEXTRA CONTEXT (job description / process doc):\n${context.slice(0, 12000)}` : ""}`;

export const toolsPrompt = (intake: Intake, kb: string) =>
  `List every tool, system, or data source the agent will need to do this job, and for each the connector options a user could install (official MCP server, plugin, API, CLI, or built-in agent capability), its auth method, the docs URL if you are confident it exists, and search queries to confirm it online.
SKILL BRIEF:
${JSON.stringify(intake, null, 2)}

BEST-PRACTICE CARDS:
${kb}`;

export const planPrompt = (intake: Intake, tools: Tools, kb: string) =>
  `Design the orchestration: numbered steps the agent follows, with the tool used, approval gates, and failure handling, plus one worked example.
BRIEF:
${JSON.stringify(intake, null, 2)}
TOOLS:
${JSON.stringify(tools.tools.map((t) => ({ name: t.name, purpose: t.purpose, required: t.required })), null, 2)}
CARDS:
${kb}`;

export const writePrompt = (intake: Intake, tools: Tools, plan: Plan, kb: string) =>
  `Write the Markdown BODY of SKILL.md (no frontmatter; it is added for you). Structure:
# ${intake.title}
One-paragraph overview.
## When to use
## Inputs
## Tools and connectors  (short table; link to [references/tools.md](references/tools.md) for setup)
## Workflow  (numbered steps from the plan; mark approval gates with **Approval required**)
## Output and definition of done
## Failure handling
## Example
## References  (link [references/sources.md](references/sources.md) and any other reference files you create)
Keep it under 300 lines. Output only Markdown.

BRIEF: ${JSON.stringify(intake)}
TOOLS: ${JSON.stringify(tools.tools.map((t) => ({ name: t.name, purpose: t.purpose, required: t.required, connectors: t.connectors.map((c) => c.kind + ":" + c.name) })))}
PLAN: ${JSON.stringify(plan)}
CARDS:
${kb}`;

export const referencesPrompt = (intake: Intake, skillBody: string) =>
  `Write up to 2 focused reference files that the SKILL.md below would load on demand (for example references/domain.md with domain rules, or references/templates.md with output templates). Do not duplicate tools.md or sources.md; those are generated for you. Return an empty list if none are useful.
BRIEF: ${JSON.stringify({ title: intake.title, job: intake.jobToBeDone, outputs: intake.outputs })}
SKILL.md BODY:
${skillBody.slice(0, 12000)}`;

export const judgePrompt = (skillMd: string) =>
  `Review this SKILL.md as a strict reviewer. Score triggerability of the description (would an agent pick it at the right time?), clarity of steps, and overall quality. List concrete issues (missing tools, vague steps, missing approval gates).
${skillMd.slice(0, 16000)}`;
