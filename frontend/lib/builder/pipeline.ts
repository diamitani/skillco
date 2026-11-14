import { generateText, streamText, Output, type LanguageModel } from "ai";
import { env } from "@/lib/env";
import { seedCardsFor, type KbCard } from "@/lib/kb/seed";
import {
  IntakeSchema, JudgeSchema, PlanSchema, ReferencesSchema, ToolsSchema,
  type BuildEvent, type BuildInput, type Intake, type QaReport, type SkillFiles, type Tools,
} from "@/lib/builder/schemas";
import { SYSTEM, intakePrompt, judgePrompt, kbBlock, planPrompt, referencesPrompt, toolsPrompt, writePrompt } from "@/lib/builder/prompts";
import { buildFrontmatter, lintSkill, toSlug } from "@/lib/builder/skillmd";

/** USD per 1M tokens [input, output]; from https://ai-gateway.vercel.sh/v1/models (Nov 2026). */
const PRICES: Record<string, [number, number]> = {
  "openai/gpt-5-mini": [0.25, 2],
  "openai/gpt-5.4-mini": [0.75, 4.5],
  "google/gemini-3-flash": [0.5, 3],
  "anthropic/claude-haiku-4.5": [1, 5],
  "anthropic/claude-sonnet-5.5": [2, 10],
  "anthropic/claude-sonnet-4.6": [3, 15],
  "openai/gpt-5.4": [2.5, 15],
};

export interface PipelineOptions {
  input: BuildInput;
  kbCards?: KbCard[];
  useStrongModel: boolean;
  author?: string;
  emit: (e: BuildEvent) => void;
  /** Test hook: inject models instead of AI Gateway ids. */
  models?: { draft: LanguageModel; final: LanguageModel };
}

export interface PipelineResult {
  slug: string;
  intake: Intake;
  tools: Tools;
  files: SkillFiles;
  qa: QaReport;
  manifest: Record<string, unknown>;
  inputTokens: number;
  outputTokens: number;
  costUsd: number;
  models: { draft: string; final: string };
}

export async function runPipeline(opts: PipelineOptions): Promise<PipelineResult> {
  const { input, emit } = opts;
  const draftId = env.draftModel;
  const finalId = opts.useStrongModel ? env.finalModel : env.draftModel;
  const draft: LanguageModel = opts.models?.draft ?? draftId;
  const final: LanguageModel = opts.models?.final ?? finalId;
  let inTok = 0, outTok = 0, cost = 0;
  const meter = (model: string, u: { inputTokens?: number; outputTokens?: number }) => {
    const i = u.inputTokens ?? 0, o = u.outputTokens ?? 0;
    inTok += i; outTok += o;
    const p = PRICES[model] ?? [2, 10];
    cost += (i * p[0] + o * p[1]) / 1e6;
    emit({ type: "usage", inputTokens: inTok, outputTokens: outTok, costUsd: Number(cost.toFixed(5)) });
  };

  const cards = opts.kbCards?.length ? opts.kbCards : seedCardsFor(input.targets);
  const kb = kbBlock(cards);

  // 1. Intake
  emit({ type: "stage", stage: "intake", status: "start" });
  const r1 = await generateText({ model: draft, system: SYSTEM, output: Output.object({ schema: IntakeSchema }), prompt: intakePrompt(input.goal, input.context) });
  meter(draftId, r1.usage);
  const intake = r1.output;
  intake.slug = toSlug(intake.slug || intake.title);
  emit({ type: "stage", stage: "intake", status: "done", data: intake });

  // 2. Tool & connector discovery
  emit({ type: "stage", stage: "tools", status: "start" });
  const r2 = await generateText({ model: draft, system: SYSTEM, output: Output.object({ schema: ToolsSchema }), prompt: toolsPrompt(intake, kb) });
  meter(draftId, r2.usage);
  const tools = r2.output;
  emit({ type: "stage", stage: "tools", status: "done", data: tools });

  // 3. Step plan
  emit({ type: "stage", stage: "plan", status: "start" });
  const r3 = await generateText({ model: draft, system: SYSTEM, output: Output.object({ schema: PlanSchema }), prompt: planPrompt(intake, tools, kb) });
  meter(draftId, r3.usage);
  const plan = r3.output;
  emit({ type: "stage", stage: "plan", status: "done", data: plan });

  // 4. Write SKILL.md (streamed) + references
  emit({ type: "stage", stage: "write", status: "start" });
  const s4 = streamText({ model: final, system: SYSTEM, prompt: writePrompt(intake, tools, plan, kb) });
  let body = "";
  for await (const chunk of s4.textStream) {
    body += chunk;
    emit({ type: "delta", stage: "write", text: chunk });
  }
  meter(finalId, await s4.usage);
  body = body.replace(/^```(?:markdown|md)?\s*\n/, "").replace(/\n```\s*$/, "");

  const r4b = await generateText({ model: draft, system: SYSTEM, output: Output.object({ schema: ReferencesSchema }), prompt: referencesPrompt(intake, body) });
  meter(draftId, r4b.usage);

  const files: SkillFiles = {};
  files["SKILL.md"] = buildFrontmatter({ name: intake.slug, description: intake.description, author: opts.author }) + body.trim() + "\n";
  files["references/tools.md"] = toolsMarkdown(tools);
  files["references/sources.md"] = sourcesMarkdown(cards);
  for (const ref of r4b.output.references) {
    const p = ref.path.startsWith("references/") ? ref.path : `references/${ref.path.replace(/^\/+/, "")}`;
    if (!files[p] && /^references\/[a-z0-9._/-]+\.md$/i.test(p)) files[p] = ref.content;
  }
  const manifest = {
    $schema: "https://skillco.work/schemas/skillco.json",
    name: intake.slug,
    title: intake.title,
    category: intake.category,
    targets: input.targets,
    steps: plan.steps,
    tools: tools.tools,
    sources: cards.map((c) => c.url),
    generator: { draft: draftId, final: finalId },
  };
  files["skillco.json"] = JSON.stringify(manifest, null, 2) + "\n";
  emit({ type: "stage", stage: "write", status: "done" });

  // 5. QA: deterministic lint + LLM judge
  emit({ type: "stage", stage: "qa", status: "start" });
  const lint = lintSkill(files, intake.slug);
  let judge: QaReport["judge"];
  try {
    const r5 = await generateText({ model: draft, output: Output.object({ schema: JudgeSchema }), prompt: judgePrompt(files["SKILL.md"]) });
    meter(draftId, r5.usage);
    judge = r5.output;
  } catch (e) {
    console.warn("[qa] judge failed", e);
  }
  const qa: QaReport = { lint, judge, passed: !lint.some((l) => l.level === "error") };
  emit({ type: "stage", stage: "qa", status: "done", data: qa });

  return { slug: intake.slug, intake, tools, files, qa, manifest, inputTokens: inTok, outputTokens: outTok, costUsd: cost, models: { draft: draftId, final: finalId } };
}

function toolsMarkdown(t: Tools) {
  const rows = t.tools.map((x) =>
    `| ${x.name} | ${x.purpose} | ${x.required ? "yes" : "optional"} | ${x.connectors.map((c) => (c.url ? `[${c.kind}: ${c.name}](${c.url})` : `${c.kind}: ${c.name}`) + ` (${c.auth})`).join("<br>")} | ${x.docsUrl ? `[docs](${x.docsUrl})` : ""} |`
  );
  const searches = t.tools.flatMap((x) => x.searchQueries.map((q) => `- ${x.name}: \`${q}\``));
  return `# Tools and connectors

Install or connect these before running the skill. Prefer an official remote MCP server, then a plugin, then an API with a scoped token. Never paste long-lived secrets into chat.

| Tool | Purpose | Required | Connector options (auth) | Docs |
|---|---|---|---|---|
${rows.join("\n")}

## Verify online
These searches confirm the current connector and docs for each tool:
${searches.join("\n")}
`;
}

function sourcesMarkdown(cards: KbCard[]) {
  const uniq = [...new Map(cards.map((c) => [c.url, c])).values()];
  return `# Sources

Best-practice sources this skill was built against (SkillCo knowledge base):

${uniq.map((c) => `- [${c.title}](${c.url}) (${c.platform})`).join("\n")}
`;
}
