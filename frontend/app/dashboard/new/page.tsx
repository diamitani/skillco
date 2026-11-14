import { Builder } from "@/components/dashboard/Builder";
import { SKILLS } from "@/lib/skills";

export const metadata = { title: "New skill" };

export default async function NewSkill({ searchParams }: { searchParams: Promise<{ from?: string; goal?: string }> }) {
  const { from, goal } = await searchParams;
  const base = from ? SKILLS.find((s) => s.id === from) : undefined;
  const initial = goal ?? (base ? `Remix the "${base.name}" skill for my workflow: ${base.description}` : "");
  return (
    <>
      <p className="t-mono text-xs text-link">dashboard/new</p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight">Build a skill</h1>
      <p className="mb-8 mt-1 text-sm text-fg-2">
        Describe the job. SkillCo researches the tools and connectors, plans the steps against current platform best practices, and writes a ready-to-install skill.
      </p>
      <Builder initialGoal={initial} />
    </>
  );
}
