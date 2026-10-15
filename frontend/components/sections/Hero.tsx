import Link from "next/link";
import { ArrowRight, MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/Button";
import { DomainChip } from "@/components/ui/DomainChip";
import { SkillGlyph } from "@/components/brand/SkillGlyph";
import { FEATURED_SKILLS, SKILLS } from "@/lib/skills";

const AGENTS = ["Claude", "Codex", "Hermes", "OpenClaw"];

export function Hero() {
  const preview = FEATURED_SKILLS.slice(0, 4);

  return (
    <section className="theme-dark dot-grid relative overflow-hidden bg-bg text-fg">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:px-8 lg:py-32">
        <div>
          <div className="mb-8 flex flex-wrap items-center gap-3">
            <DomainChip className="bg-transparent" />
            <span className="text-sm text-fg-2">The skill index for AI agents</span>
          </div>

          <h1 className="t-display text-[2.75rem] sm:text-6xl lg:text-7xl">
            Say what you need. Get the skill that does it.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-fg-2 md:text-xl">
            {SKILLS.length} ready-to-install skills for your AI agent, each one
            packaged and ready to run.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/marketplace">
                Browse skills
                <ArrowRight weight="bold" className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/marketplace#search">Find my skill</Link>
            </Button>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line pt-6">
            <span className="text-sm text-fg-3">Works with</span>
            {AGENTS.map((a) => (
              <span key={a} className="t-mono text-sm text-fg-2">
                {a}
              </span>
            ))}
          </div>
        </div>

        {/* Live preview of the index: real skills, real search */}
        <div
          aria-label="Skill index preview"
          className="rounded-xl border border-line bg-surface"
        >
          <form
            action="/marketplace"
            method="get"
            role="search"
            className="flex items-center gap-3 border-b border-line px-4 py-3"
          >
            <MagnifyingGlass className="h-5 w-5 shrink-0 text-fg-3" />
            <label htmlFor="hero-search" className="sr-only">
              Describe what you need done
            </label>
            <input
              id="hero-search"
              name="q"
              type="search"
              placeholder="Describe what you need done"
              className="h-10 min-w-0 flex-1 bg-transparent text-fg placeholder:text-fg-3 focus:outline-none"
            />
            <button
              type="submit"
              className="h-9 shrink-0 rounded-md bg-btn px-3 text-sm font-semibold text-btn-fg transition-colors hover:bg-btn-hover"
            >
              Search
            </button>
          </form>

          <ul className="divide-y divide-line">
            {preview.map((skill) => (
              <li key={skill.id}>
                <Link
                  href="/marketplace"
                  className="flex items-center gap-4 px-4 py-4 transition-colors hover:bg-surface-2"
                >
                  <SkillGlyph id={skill.id} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">{skill.name}</span>
                    <span className="t-mono block truncate text-xs text-fg-3">
                      {skill.id}
                    </span>
                  </span>
                  <span className="hidden shrink-0 text-xs text-fg-2 sm:block">
                    {skill.category}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-between border-t border-line px-4 py-3">
            <span className="t-mono text-xs text-link">skillco.work/skills</span>
            <Link
              href="/marketplace"
              className="text-sm font-medium text-link hover:underline underline-offset-4"
            >
              All {SKILLS.length} skills
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
