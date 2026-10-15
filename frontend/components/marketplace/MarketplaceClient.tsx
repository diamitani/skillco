"use client";

import { useMemo, useState } from "react";
import { DownloadSimple, MagnifyingGlass } from "@phosphor-icons/react";
import { SkillCard } from "@/components/SkillCard";
import { Button, buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { searchSkills } from "@/lib/search";
import { SKILLS, CATEGORIES } from "@/lib/skills";

const PAGE_SIZE = 36;
const categories = ["All", ...CATEGORIES];

export function MarketplaceClient({ initialQuery }: { initialQuery: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState("All");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const results = useMemo(() => searchSkills(query, category), [query, category]);
  const shown = results.slice(0, visible);
  const hasQuery = query.trim().length > 0;

  const countFor = (c: string) =>
    c === "All" ? SKILLS.length : SKILLS.filter((s) => s.category === c).length;

  return (
    <>
      <section className="border-b border-line bg-bg">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-20 lg:px-8">
          <p className="t-mono mb-4 text-xs text-link">skillco.work/skills</p>
          <h1 className="t-display text-4xl md:text-6xl">Browse skills</h1>
          <p className="mt-4 max-w-xl text-lg text-fg-2">
            {SKILLS.length} skills, each one packaged and ready to run. Early
            access, so every download is free.
          </p>

          <div id="search" className="mt-8 flex max-w-2xl scroll-mt-24 flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <MagnifyingGlass className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-fg-3" />
              <label htmlFor="skill-search" className="sr-only">
                Describe what you need done
              </label>
              <input
                id="skill-search"
                type="search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setVisible(PAGE_SIZE);
                }}
                placeholder="Describe what you need done"
                className="h-12 w-full rounded-md border border-line-strong bg-surface pl-12 pr-4 text-fg placeholder:text-fg-3 focus:border-focus focus:outline-none focus:ring-[3px] focus:ring-focus/30"
              />
            </div>
            <a
              href="/downloads/skill-library-full.zip"
              download="skill-library-full.zip"
              className={cn(buttonVariants({ variant: "secondary", size: "lg" }))}
            >
              <DownloadSimple weight="bold" className="h-4 w-4" />
              Full library (.zip)
            </a>
          </div>
        </div>
      </section>

      <section
        aria-label="Categories"
        className="sticky top-16 z-40 border-b border-line bg-bg"
      >
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
            {categories.map((c) => {
              const active = category === c;
              return (
                <button
                  key={c}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    setCategory(c);
                    setVisible(PAGE_SIZE);
                  }}
                  className={cn(
                    "inline-flex h-11 shrink-0 items-center gap-2 rounded-md border px-4 text-sm font-semibold transition-colors duration-200",
                    active
                      ? "border-ink bg-ink text-tint"
                      : "border-line-strong text-fg-2 hover:bg-surface-2 hover:text-fg"
                  )}
                >
                  {c}
                  <span
                    className={cn(
                      "t-mono text-xs",
                      active ? "text-lift" : "text-fg-3"
                    )}
                  >
                    {countFor(c)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-bg py-10 md:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="mb-6 text-sm text-fg-2" aria-live="polite">
            {results.length} skill{results.length !== 1 ? "s" : ""}
            {hasQuery && (
              <>
                {" "}
                for <span className="t-mono text-fg">&ldquo;{query.trim()}&rdquo;</span>
              </>
            )}
            {category !== "All" && <> in {category}</>}
          </p>

          {results.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {shown.map((skill) => (
                  <SkillCard key={skill.id} skill={skill} />
                ))}
              </div>

              {shown.length < results.length && (
                <div className="mt-10 flex justify-center">
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={() => setVisible((v) => v + PAGE_SIZE)}
                  >
                    Show {Math.min(PAGE_SIZE, results.length - shown.length)} more
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="mx-auto max-w-md rounded-lg border border-line bg-surface px-6 py-14 text-center">
              <h2 className="text-xl font-bold tracking-tight">
                We couldn&apos;t find a skill for that
              </h2>
              <p className="mt-2 text-fg-2">
                Try describing the outcome you want, like &ldquo;clean up a lead
                list&rdquo;.
              </p>
              <Button
                className="mt-6"
                onClick={() => {
                  setQuery("");
                  setCategory("All");
                }}
              >
                Browse all skills
              </Button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
