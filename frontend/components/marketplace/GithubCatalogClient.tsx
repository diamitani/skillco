"use client";

import { useMemo, useState } from "react";
import { GithubLogo, MagnifyingGlass, ShieldCheck, Star } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface Item { id: string; name: string; description: string; category: string; repo: string; stars: number; license: string | null; url: string; grade: "A" | "B" | "C" | "F"; findings: { rule: string }[] }

const PAGE = 48;
const GRADE_STYLE: Record<string, string> = { A: "bg-ok/15 text-ok", B: "bg-blue-100 text-ultra", C: "bg-warn/15 text-warn" };
const GRADE_HINT: Record<string, string> = { A: "No findings", B: "Low-risk findings only (e.g. sudo)", C: "Review before use (medium findings)" };

export function GithubCatalogClient({ skills, categories }: { skills: Item[]; categories: [string, number][] }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [grades, setGrades] = useState<string[]>(["A", "B", "C"]);
  const [n, setN] = useState(PAGE);

  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    return skills.filter((s) =>
      (cat === "All" || s.category === cat) && grades.includes(s.grade) &&
      (!t || s.name.toLowerCase().includes(t) || s.description.toLowerCase().includes(t) || s.repo.toLowerCase().includes(t)));
  }, [skills, q, cat, grades]);

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[220px_1fr] lg:px-8">
      <aside className="space-y-6 lg:sticky lg:top-20 lg:self-start">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wide text-fg-3">Category</h2>
          <ul className="mt-2 flex gap-1 overflow-x-auto lg:flex-col">
            {[["All", skills.length] as [string, number], ...categories].map(([c, count]) => (
              <li key={c} className="shrink-0">
                <button type="button" aria-pressed={cat === c} onClick={() => { setCat(c); setN(PAGE); }}
                  className={cn("flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-sm font-semibold", cat === c ? "bg-ink text-tint" : "text-fg-2 hover:bg-surface-2")}>
                  {c}<span className="t-mono text-xs opacity-70">{count}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wide text-fg-3">Security grade</h2>
          <div className="mt-2 flex gap-2">
            {["A", "B", "C"].map((g) => (
              <button key={g} type="button" aria-pressed={grades.includes(g)} title={GRADE_HINT[g]}
                onClick={() => setGrades((cur) => (cur.includes(g) ? cur.filter((x) => x !== g) : [...cur, g]))}
                className={cn("h-9 w-9 rounded-md text-sm font-extrabold", grades.includes(g) ? GRADE_STYLE[g] : "border border-line text-fg-3")}>
                {g}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-fg-3">Grade F (secrets, pipe-to-shell, destructive commands, exfiltration) is excluded.</p>
        </div>
      </aside>
      <div className="min-w-0">
        <div className="relative">
          <MagnifyingGlass className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-fg-3" />
          <input type="search" value={q} onChange={(e) => { setQ(e.target.value); setN(PAGE); }} aria-label="Search GitHub skills"
            placeholder="Search skills, repos, or what you need done"
            className="h-12 w-full rounded-lg border border-line-strong bg-surface pl-12 pr-4 focus:border-focus focus:outline-none focus:ring-[3px] focus:ring-focus/30" />
        </div>
        <p className="mt-4 text-sm text-fg-2" aria-live="polite">{results.length.toLocaleString()} skills</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {results.slice(0, n).map((s) => (
            <article key={s.id} className="flex flex-col rounded-lg border border-line bg-surface p-4 hover:border-line-strong">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="t-mono truncate text-xs text-fg-3">{s.repo}</p>
                  <h3 className="truncate font-bold">{s.name}</h3>
                </div>
                <span title={GRADE_HINT[s.grade]} className={cn("inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs font-extrabold", GRADE_STYLE[s.grade])}>{s.grade}</span>
              </div>
              <p className="mt-2 line-clamp-3 flex-1 text-sm text-fg-2">{s.description}</p>
              <div className="mt-3 flex items-center justify-between border-t border-line pt-3 text-xs text-fg-3">
                <span className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1"><Star weight="fill" className="h-3.5 w-3.5" />{s.stars.toLocaleString()}</span>
                  <span>{s.category}</span>
                  {s.license && <span>{s.license}</span>}
                </span>
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-link"><GithubLogo className="h-3.5 w-3.5" />Source</a>
              </div>
              {s.findings.length > 0 && (
                <p className="mt-2 flex items-center gap-1 text-[11px] text-fg-3"><ShieldCheck className="h-3.5 w-3.5" />{[...new Set(s.findings.map((f) => f.rule))].join(", ")}</p>
              )}
            </article>
          ))}
        </div>
        {n < results.length && (
          <div className="mt-8 flex justify-center"><Button variant="secondary" onClick={() => setN(n + PAGE)}>Show more</Button></div>
        )}
      </div>
    </div>
  );
}
