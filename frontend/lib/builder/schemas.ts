import { z } from "zod";

export const TARGETS = ["agent-skills", "cursor", "claude-code", "codex", "gemini", "openai"] as const;
export type Target = (typeof TARGETS)[number];

export const BuildInput = z.object({
  goal: z.string().min(10).max(4000),
  context: z.string().max(20000).optional(),
  targets: z.array(z.enum(TARGETS)).min(1).default(["agent-skills", "cursor", "claude-code"]),
});
export type BuildInput = z.infer<typeof BuildInput>;

export const IntakeSchema = z.object({
  slug: z.string().describe("kebab-case skill name, <=64 chars, lowercase letters, digits, single hyphens"),
  title: z.string().describe("Human readable title"),
  description: z.string().describe("<=1024 chars, third person: what it does AND when to use it, with trigger phrases"),
  jobToBeDone: z.string(),
  inputs: z.array(z.string()),
  outputs: z.array(z.string()),
  successCriteria: z.array(z.string()),
  risks: z.array(z.string()).describe("irreversible or sensitive actions the skill may take"),
  assumptions: z.array(z.string()).describe("assumptions made instead of asking clarifying questions"),
  category: z.enum(["AI Agents", "Dev Tools", "Music", "Automation", "Prospecting", "Data", "Other"]),
});
export type Intake = z.infer<typeof IntakeSchema>;

export const ToolsSchema = z.object({
  tools: z.array(
    z.object({
      name: z.string(),
      purpose: z.string(),
      required: z.boolean(),
      connectors: z.array(
        z.object({
          kind: z.enum(["mcp-remote", "mcp-local", "plugin", "api", "cli", "builtin"]),
          name: z.string(),
          url: z.string().optional().describe("docs or endpoint URL if known; omit rather than invent"),
          auth: z.string().describe("oauth | api-key | none | ..."),
        })
      ),
      docsUrl: z.string().optional(),
      searchQueries: z.array(z.string()).describe("what to search online to confirm the connector/docs"),
    })
  ),
});
export type Tools = z.infer<typeof ToolsSchema>;

export const PlanSchema = z.object({
  steps: z.array(
    z.object({
      title: z.string(),
      action: z.string(),
      tool: z.string().optional(),
      approvalGate: z.boolean().describe("true when the step sends, deletes, pays, publishes or writes externally"),
      onFailure: z.string(),
    })
  ),
  example: z.object({ request: z.string(), result: z.string() }),
});
export type Plan = z.infer<typeof PlanSchema>;

export const ReferencesSchema = z.object({
  references: z.array(
    z.object({
      path: z.string().describe("relative path under references/, e.g. references/domain.md"),
      content: z.string(),
    })
  ).max(4),
});

export const JudgeSchema = z.object({
  score: z.number().min(0).max(100),
  triggerability: z.number().min(0).max(10),
  clarity: z.number().min(0).max(10),
  issues: z.array(z.string()),
});

export interface QaReport {
  lint: { level: "error" | "warn"; message: string }[];
  judge?: z.infer<typeof JudgeSchema>;
  passed: boolean;
}

export type SkillFiles = Record<string, string>;

export type BuildEvent =
  | { type: "stage"; stage: string; status: "start" | "done"; data?: unknown }
  | { type: "delta"; stage: string; text: string }
  | { type: "usage"; inputTokens: number; outputTokens: number; costUsd: number }
  | { type: "result"; skillId?: string; slug: string; files: SkillFiles; qa: QaReport }
  | { type: "error"; message: string };
