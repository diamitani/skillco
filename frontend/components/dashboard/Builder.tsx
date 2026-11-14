"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { CheckCircle, CircleNotch, Circle, Warning, XCircle } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { FileViewer } from "@/components/dashboard/FileViewer";
import { ExportMenu } from "@/components/dashboard/ExportMenu";
import { TARGETS, type BuildEvent, type QaReport, type Target } from "@/lib/builder/schemas";
import { cn } from "@/lib/utils";

const STAGES = [
  { id: "intake", label: "Understand the job", hint: "Inputs, outputs, success criteria, risks" },
  { id: "tools", label: "Find tools & connectors", hint: "MCP servers, plugins, APIs, auth, docs to check" },
  { id: "plan", label: "Plan the steps", hint: "Orchestration with approval gates and failure handling" },
  { id: "write", label: "Write SKILL.md + references", hint: "Spec-valid frontmatter, references/, skillco.json" },
  { id: "qa", label: "Quality check", hint: "Spec lint, link check, secret scan, reviewer score" },
] as const;

const TARGET_LABEL: Record<Target, string> = {
  "agent-skills": "Agent Skills (any harness)",
  cursor: "Cursor",
  "claude-code": "Claude Code",
  codex: "Codex",
  gemini: "Gemini CLI",
  openai: "OpenAI / GPTs",
};

type StageState = "idle" | "running" | "done";

export function Builder({ initialGoal = "" }: { initialGoal?: string }) {
  const [goal, setGoal] = useState(initialGoal);
  const [context, setContext] = useState("");
  const [targets, setTargets] = useState<Target[]>(["agent-skills", "cursor", "claude-code"]);
  const [stages, setStages] = useState<Record<string, StageState>>({});
  const [stageData, setStageData] = useState<Record<string, unknown>>({});
  const [draft, setDraft] = useState("");
  const [usage, setUsage] = useState<{ inputTokens: number; outputTokens: number; costUsd: number } | null>(null);
  const [result, setResult] = useState<{ skillId?: string; slug: string; files: Record<string, string>; qa: QaReport } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  function toggle(t: Target) {
    setTargets((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]));
  }

  async function build() {
    setRunning(true);
    setError(null);
    setResult(null);
    setDraft("");
    setStages({});
    setStageData({});
    setUsage(null);
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    try {
      const res = await fetch("/api/builder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal, context: context || undefined, targets }),
        signal: ctrl.signal,
      });
      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        throw new Error(typeof data.error === "string" ? data.error : "Build failed to start");
      }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buf = "";
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        let nl: number;
        while ((nl = buf.indexOf("\n")) >= 0) {
          const line = buf.slice(0, nl).trim();
          buf = buf.slice(nl + 1);
          if (line) handle(JSON.parse(line) as BuildEvent);
        }
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError") setError(e instanceof Error ? e.message : "Build failed");
    } finally {
      setRunning(false);
    }
  }

  function handle(e: BuildEvent) {
    switch (e.type) {
      case "stage":
        setStages((s) => ({ ...s, [e.stage]: e.status === "start" ? "running" : "done" }));
        if (e.data) setStageData((d) => ({ ...d, [e.stage]: e.data }));
        break;
      case "delta":
        setDraft((d) => d + e.text);
        break;
      case "usage":
        setUsage(e);
        break;
      case "result":
        setResult(e);
        break;
      case "error":
        setError(e.message);
        break;
    }
  }

  const intake = stageData.intake as { title?: string; description?: string; assumptions?: string[] } | undefined;
  const tools = stageData.tools as { tools: { name: string; purpose: string; required: boolean; connectors: { kind: string; name: string; auth: string }[] }[] } | undefined;
  const plan = stageData.plan as { steps: { title: string; approvalGate: boolean }[] } | undefined;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
      <div className="min-w-0 space-y-6">
        <section className="rounded-xl border border-line bg-surface p-5">
          <label htmlFor="goal" className="text-sm font-bold">What should the agent be able to do?</label>
          <textarea
            id="goal"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            rows={4}
            placeholder="e.g. Every Monday, pull last week's closed-won deals from HubSpot, draft a thank-you email per contact in Gmail, and post a summary to Slack for approval."
            className="mt-2 w-full rounded-md border border-line-strong bg-surface p-3 text-sm focus:border-focus focus:outline-none focus:ring-[3px] focus:ring-focus/30"
          />
          <details className="mt-3">
            <summary className="cursor-pointer text-sm font-semibold text-link">Add context: paste a job description or process doc</summary>
            <textarea
              aria-label="Extra context"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              rows={6}
              placeholder="Paste a job description, SOP, or notes. The builder will scope the skill to it."
              className="mt-2 w-full rounded-md border border-line-strong bg-surface p-3 text-sm focus:border-focus focus:outline-none"
            />
          </details>
          <fieldset className="mt-4">
            <legend className="text-sm font-bold">Target harnesses</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {TARGETS.map((t) => (
                <button
                  key={t}
                  type="button"
                  aria-pressed={targets.includes(t)}
                  onClick={() => toggle(t)}
                  className={cn("rounded-md border px-3 py-1.5 text-xs font-semibold", targets.includes(t) ? "border-ink bg-ink text-tint" : "border-line-strong text-fg-2 hover:bg-surface-2")}
                >
                  {TARGET_LABEL[t]}
                </button>
              ))}
            </div>
          </fieldset>
          <div className="mt-5 flex items-center gap-3">
            <Button onClick={build} disabled={running || goal.trim().length < 10 || targets.length === 0}>
              {running ? "Building…" : "Build skill"}
            </Button>
            {running && (
              <Button variant="ghost" onClick={() => abortRef.current?.abort()}>Cancel</Button>
            )}
            <span className="text-xs text-fg-3">Uses 1 generation credit.</span>
          </div>
          {error && (
            <p role="alert" className="mt-4 flex items-start gap-2 rounded-md border border-bad/30 bg-bad/5 p-3 text-sm text-bad">
              <XCircle weight="bold" className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error} {/credits|cap|limit/i.test(error) && <Link href="/dashboard/billing" className="underline">Billing</Link>}</span>
            </p>
          )}
        </section>

        {(intake || tools || plan) && (
          <section className="grid gap-4 md:grid-cols-2">
            {intake && (
              <div className="rounded-xl border border-line bg-surface p-4 text-sm">
                <h3 className="font-bold">{intake.title}</h3>
                <p className="mt-1 text-fg-2">{intake.description}</p>
                {!!intake.assumptions?.length && (
                  <ul className="mt-2 list-disc pl-5 text-xs text-fg-3">{intake.assumptions.map((a) => <li key={a}>{a}</li>)}</ul>
                )}
              </div>
            )}
            {tools && (
              <div className="rounded-xl border border-line bg-surface p-4 text-sm">
                <h3 className="font-bold">Tools & connectors</h3>
                <ul className="mt-2 space-y-2">
                  {tools.tools.map((t) => (
                    <li key={t.name}>
                      <span className="font-semibold">{t.name}</span>{" "}
                      <span className="text-xs text-fg-3">{t.required ? "required" : "optional"}</span>
                      <div className="t-mono text-xs text-fg-3">{t.connectors.map((c) => `${c.kind}:${c.name}`).join(" · ")}</div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {plan && (
              <div className="rounded-xl border border-line bg-surface p-4 text-sm md:col-span-2">
                <h3 className="font-bold">Step plan</h3>
                <ol className="mt-2 list-decimal space-y-1 pl-5 text-fg-2">
                  {plan.steps.map((s, i) => (
                    <li key={i}>{s.title}{s.approvalGate && <span className="ml-2 rounded bg-lime px-1.5 py-0.5 text-[10px] font-bold text-ink">approval</span>}</li>
                  ))}
                </ol>
              </div>
            )}
          </section>
        )}

        {result ? (
          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-bold">
                <span className="t-mono text-fg-3">skills/</span>{result.slug}
              </h2>
              {result.skillId && (
                <Button asChild variant="secondary"><Link href={`/dashboard/skills/${result.skillId}`}>Open in library</Link></Button>
              )}
            </div>
            <QaPanel qa={result.qa} />
            <FileViewer files={result.files} />
            <h3 className="pt-2 text-sm font-bold">Install to a platform</h3>
            <ExportMenu skillId={result.skillId} slug={result.slug} files={result.files} />
          </section>
        ) : (
          draft && (
            <section>
              <h3 className="mb-2 text-sm font-bold">Writing SKILL.md…</h3>
              <pre className="t-mono max-h-[480px] overflow-auto whitespace-pre-wrap rounded-xl border border-line bg-surface p-4 text-xs">{draft}</pre>
            </section>
          )
        )}
      </div>

      <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
        <div className="rounded-xl border border-line bg-surface p-4">
          <h2 className="text-sm font-bold">Build steps</h2>
          <ol className="mt-3 space-y-3">
            {STAGES.map((s) => {
              const st = stages[s.id] ?? "idle";
              return (
                <li key={s.id} className="flex gap-3">
                  {st === "done" ? <CheckCircle weight="fill" className="h-5 w-5 shrink-0 text-ok" /> : st === "running" ? <CircleNotch weight="bold" className="h-5 w-5 shrink-0 animate-spin text-link" /> : <Circle className="h-5 w-5 shrink-0 text-fg-3" />}
                  <span>
                    <span className={cn("block text-sm font-semibold", st === "idle" && "text-fg-3")}>{s.label}</span>
                    <span className="block text-xs text-fg-3">{s.hint}</span>
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
        {usage && (
          <div className="t-mono rounded-xl border border-line bg-surface p-4 text-xs text-fg-2">
            <div>tokens in {usage.inputTokens.toLocaleString()}</div>
            <div>tokens out {usage.outputTokens.toLocaleString()}</div>
            <div>model cost ${usage.costUsd.toFixed(4)}</div>
          </div>
        )}
      </aside>
    </div>
  );
}

export function QaPanel({ qa }: { qa: QaReport }) {
  const grade = qa.judge ? (qa.judge.score >= 85 ? "A" : qa.judge.score >= 70 ? "B" : "C") : qa.passed ? "B" : "C";
  return (
    <div className="rounded-xl border border-line bg-surface p-4 text-sm">
      <div className="flex flex-wrap items-center gap-3">
        <span className={cn("inline-flex h-8 w-8 items-center justify-center rounded-md text-sm font-extrabold", grade === "A" ? "bg-ok/15 text-ok" : grade === "B" ? "bg-warn/15 text-warn" : "bg-bad/15 text-bad")}>{grade}</span>
        <span className="font-bold">{qa.passed ? "Passes the Agent Skills spec" : "Spec errors found"}</span>
        {qa.judge && <span className="t-mono text-xs text-fg-3">score {qa.judge.score} · trigger {qa.judge.triggerability}/10 · clarity {qa.judge.clarity}/10</span>}
      </div>
      {(qa.lint.length > 0 || (qa.judge?.issues.length ?? 0) > 0) && (
        <ul className="mt-3 space-y-1 text-xs text-fg-2">
          {qa.lint.map((l, i) => (
            <li key={`l${i}`} className="flex gap-2">
              {l.level === "error" ? <XCircle className="h-4 w-4 shrink-0 text-bad" /> : <Warning className="h-4 w-4 shrink-0 text-warn" />}
              {l.message}
            </li>
          ))}
          {qa.judge?.issues.map((m, i) => (
            <li key={`j${i}`} className="flex gap-2"><Warning className="h-4 w-4 shrink-0 text-fg-3" />{m}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
