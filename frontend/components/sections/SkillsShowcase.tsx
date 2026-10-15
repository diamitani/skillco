import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { SkillCard } from "@/components/SkillCard";
import { FEATURED_SKILLS, SKILLS } from "@/lib/skills";

export function SkillsShowcase() {
  return (
    <section className="bg-bg py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="t-mono mb-3 text-xs text-link">skillco.work/skills</p>
            <h2 className="t-display text-3xl md:text-4xl">Featured skills</h2>
            <p className="mt-3 max-w-lg text-fg-2">
              A taste of the index. Every skill is a SKILL.md file you can drop
              into your agent.
            </p>
          </div>
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 font-semibold text-link hover:underline underline-offset-4"
          >
            All {SKILLS.length} skills
            <ArrowRight weight="bold" className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {FEATURED_SKILLS.slice(0, 8).map((skill) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      </div>
    </section>
  );
}
