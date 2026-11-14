"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { DownloadSimple, Lightning, MagnifyingGlass } from "@phosphor-icons/react";
import { SkillCard } from "@/components/SkillCard";
import { SkillGlyph } from "@/components/brand/SkillGlyph";
import { Button, buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { searchSkills } from "@/lib/search";
import { SKILLS, CATEGORIES, CATEGORY_META, FEATURED_SKILLS, type Skill } from "@/lib/skills";

const PAGE_SIZE = 36;
const HARNESSES = ["Claude Code", "Cursor", "Codex", "Gemini CLI", "OpenClaw", "Grok Bot"];
type Sort = "relevance" | "az" | "za";

/**
 * Catalog layout modelled on Replicate's Explore (search-first header, featured row,
 * filter rail + dense grid) with skills.sh-style one-line install and Glama-style badges.
 * See /DESIGN.md at the repo root of the redesign notes.
 */
export function MarketplaceClient({ initialQuery }: { initialQuery: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState<Sort>("relevance");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const results = useMemo(() => {
    const r = searchSkills(query, category);
    if (sort === "az") return [...r].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "za") return [...r].sort((a, b) => b.name.localeCompare(a.name));
    return r;
  }, [query, category, sort]);
  const shown = results.slice(0, visible);
  const hasQuery = query.trim().length > 0;
  const countFor = (c: string) => (c === "All" ? SKILLS.length : SKILLS.filter((s) => s.category === c).length);

  return (
    <>
      <section className="border-b border-line bg-bg">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="t-mono mb-3 text-xs text-link">skillco.work/skills</p>
              <h1 className="t-display text-4xl md:text-5xl">Explore skills</h1>
              <p className="mt-3 max-w-xl text-fg-2">
                {SKILLS.length} skills that install into any agent harness. Free to download.
              </p>
            </div>
            <div className="flex gap-3">
              <Button asChild>
                <Link href="/dashboard/new"><Lightning weight="bold" className="h-4 w-4" />Build your own</Link>
              </Button>
              <Link href="/marketplace/github" className={cn(buttonVariants({ variant: "secondary" }))}>GitHub library</Link>
              <a href="/downloads/skill-library-full.zip" download="skill-library-full.zip" className={cn(buttonVariants({ variant: "secondary" }))}>
                <DownloadSimple weight="bold" className="h-4 w-4" />Full library
              </a>
            </div>
          </div>

          <div id="search" className="relative mt-8 scroll-mt-24">
            <MagnifyingGlass className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-fg-3" />
            <label htmlFor="skill-search" className="sr-only">Describe what you need done</label>
            <input
              id="skill-search"
              type="search"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setVisible(PAGE_SIZE); }}
              placeholder="Search skills, or describe the job: “clean up a lead list”"
              className="h-14 w-full rounded-lg border border-line-strong bg-surface pl-12 pr-4 text-base text-fg placeholder:text-fg-3 focus:border-focus focus:outline-none focus:ring-[3px] focus:ring-focus/30"
            />
          </div>
        </div>
      </section>

      {!hasQuery && category === "All" && (
        <section aria-label="Featured" className="border-b border-line bg-surface">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <h2 className="text-sm font-bold uppercase tracking-wide text-fg-3">Featured</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURED_SKILLS.slice(0, 4).map((s) => <FeaturedCard key={s.id} skill={s} />)}
            </div>
          </div>
        </section>
      )}

      <section className="bg-bg py-8 md:py-10">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[220px_1fr] lg:px-8">
          <aside aria-label="Filters" className="lg:sticky lg:top-20 lg:self-start">
            <h2 className="text-xs font-bold uppercase tracking-wide text-fg-3">Category</h2>
            <ul className="-mx-1 mt-2 flex gap-1 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
              {["All", ...CATEGORIES].map((c) => {
                const active = category === c;
                const Icon = c === "All" ? MagnifyingGlass : (CATEGORY_META[c]?.icon ?? MagnifyingGlass);
                return (
                  <li key={c} className="shrink-0">
                    <button
                      type="button"
                      aria-pressed={active}
                      onClick={() => { setCategory(c); setVisible(PAGE_SIZE); }}
                      className={cn("flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-sm font-semibold", active ? "bg-ink text-tint" : "text-fg-2 hover:bg-surface-2 hover:text-fg")}
                    >
                      <span className="flex items-center gap-2"><Icon weight="bold" className="h-4 w-4" />{c}</span>
                      <span className={cn("t-mono text-xs", active ? "text-lift" : "text-fg-3")}>{countFor(c)}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <h2 className="mt-6 hidden text-xs font-bold uppercase tracking-wide text-fg-3 lg:block">Works with</h2>
            <ul className="mt-2 hidden flex-wrap gap-1.5 lg:flex">
              {HARNESSES.map((h) => (
                <li key={h} className="rounded-full border border-line px-2.5 py-1 text-xs text-fg-2">{h}</li>
              ))}
            </ul>
          </aside>

          <div className="min-w-0">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-fg-2" aria-live="polite">
                {results.length} skill{results.length !== 1 ? "s" : ""}
                {hasQuery && <> for <span className="t-mono text-fg">&ldquo;{query.trim()}&rdquo;</span></>}
                {category !== "All" && <> in {category}</>}
              </p>
              <label className="flex items-center gap-2 text-sm text-fg-2">
                Sort
                <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="h-9 rounded-md border border-line-strong bg-surface px-2 text-sm">
                  <option value="relevance">{hasQuery ? "Best match" : "Default"}</option>
                  <option value="az">Name A–Z</option>
                  <option value="za">Name Z–A</option>
                </select>
              </label>
            </div>

            {results.length > 0 ? (
              <>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {shown.map((skill) => <SkillCard key={skill.id} skill={skill} />)}
                </div>
                {shown.length < results.length && (
                  <div className="mt-10 flex justify-center">
                    <Button variant="secondary" size="lg" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
                      Show {Math.min(PAGE_SIZE, results.length - shown.length)} more
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="mx-auto max-w-md rounded-lg border border-line bg-surface px-6 py-14 text-center">
                <h2 className="text-xl font-bold tracking-tight">No skill for that yet</h2>
                <p className="mt-2 text-fg-2">Build it instead. Describe the job and SkillCo writes the skill.</p>
                <div className="mt-6 flex justify-center gap-3">
                  <Button asChild><Link href={`/dashboard/new?goal=${encodeURIComponent(query)}`}>Build “{query.trim().slice(0, 24)}”</Link></Button>
                  <Button variant="secondary" onClick={() => { setQuery(""); setCategory("All"); }}>Browse all</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function FeaturedCard({ skill }: { skill: Skill }) {
  return (
    <Link href={`/marketplace/${skill.id}`} className="group flex flex-col rounded-lg border border-line bg-bg p-4 hover:border-line-strong">
      <div className="flex items-center gap-3">
        <SkillGlyph id={skill.id} size={40} />
        <div className="min-w-0">
          <p className="t-mono truncate text-xs text-fg-3">skillco/{skill.id}</p>
          <p className="truncate font-bold group-hover:text-link">{skill.name}</p>
        </div>
      </div>
      <p className="mt-3 line-clamp-2 text-sm text-fg-2">{skill.description}</p>
    </Link>
  );
}
