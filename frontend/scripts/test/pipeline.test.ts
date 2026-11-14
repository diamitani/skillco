/**
 * Offline smoke test for the builder pipeline with mock models (no API keys needed).
 * Run: npx tsx scripts/test/pipeline.test.ts
 */
import { MockLanguageModelV4 } from "ai/test";
import { simulateReadableStream } from "ai";
import { runPipeline } from "../../lib/builder/pipeline";
import type { BuildEvent } from "../../lib/builder/schemas";

const usage = { inputTokens: { total: 1000, noCache: 1000, cacheRead: undefined, cacheWrite: undefined }, outputTokens: { total: 500, text: 500, reasoning: undefined } };
const responses: unknown[] = [
  { slug: "Weekly Deal Thanks", title: "Weekly deal thank-yous", description: "Drafts thank-you emails for closed-won HubSpot deals and posts a Slack summary. Use when the user wants weekly customer thank-yous.", jobToBeDone: "thank customers", inputs: ["date range"], outputs: ["Gmail drafts", "Slack summary"], successCriteria: ["one draft per contact"], risks: ["sending email"], assumptions: ["HubSpot is the CRM"], category: "Automation" },
  { tools: [{ name: "HubSpot", purpose: "read deals", required: true, connectors: [{ kind: "mcp-remote", name: "HubSpot MCP", auth: "oauth" }], searchQueries: ["hubspot mcp server"] }] },
  { steps: [{ title: "Fetch deals", action: "list closed-won deals", tool: "HubSpot", approvalGate: false, onFailure: "stop" }, { title: "Send", action: "send drafts", approvalGate: true, onFailure: "keep drafts" }], example: { request: "do it", result: "3 drafts" } },
  { references: [{ path: "references/email-templates.md", content: "# Templates\n" }] },
  { score: 88, triggerability: 9, clarity: 8, issues: [] },
];
let i = 0;
const draft = new MockLanguageModelV4({
  doGenerate: async () => ({ content: [{ type: "text", text: JSON.stringify(responses[i++]) }], finishReason: { unified: "stop", raw: undefined }, usage, warnings: [] }),
});
const body = "# Weekly deal thank-yous\n\nOverview.\n\n## Workflow\n1. Fetch deals\n2. **Approval required** send\n\nSee [references/tools.md](references/tools.md).\n";
const final = new MockLanguageModelV4({
  doStream: async () => ({
    stream: simulateReadableStream({
      chunks: [
        { type: "text-start", id: "t" },
        ...body.match(/[\s\S]{1,20}/g)!.map((d) => ({ type: "text-delta" as const, id: "t", delta: d })),
        { type: "text-end", id: "t" },
        { type: "finish", finishReason: { unified: "stop", raw: undefined }, usage },
      ],
    }),
  }),
});

const events: BuildEvent[] = [];
runPipeline({ input: { goal: "Thank closed-won customers every week", targets: ["agent-skills", "cursor"] }, useStrongModel: true, emit: (e) => events.push(e), models: { draft, final } })
  .then((r) => {
    const stages = events.filter((e) => e.type === "stage" && e.status === "done").map((e) => (e as { stage: string }).stage);
    console.log("slug:", r.slug);
    console.log("stages:", stages.join(" > "));
    console.log("files:", Object.keys(r.files).join(", "));
    console.log("qa:", JSON.stringify(r.qa));
    console.log("deltas:", events.filter((e) => e.type === "delta").length, "cost:", r.costUsd.toFixed(4));
    if (r.slug !== "weekly-deal-thanks" || !r.qa.passed || stages.length !== 5) { console.error("FAIL"); process.exit(1); }
    console.log("PASS");
  })
  .catch((e) => { console.error(e); process.exit(1); });
