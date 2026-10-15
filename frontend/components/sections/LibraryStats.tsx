import { SKILLS, CATEGORIES, CATEGORY_META } from "@/lib/skills";

export function LibraryStats() {
  const counts = CATEGORIES.map((category) => ({
    category,
    count: SKILLS.filter((s) => s.category === category).length,
  }));

  return (
    <section className="theme-dark bg-bg py-20 text-fg md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 max-w-2xl">
          <h2 className="t-display text-3xl md:text-4xl">The index at a glance</h2>
          <p className="mt-3 text-fg-2">
            <span className="t-mono text-fg">{SKILLS.length}</span> skills in{" "}
            <span className="t-mono text-fg">{CATEGORIES.length}</span>{" "}
            categories. Every one is a real, downloadable SKILL.md.
          </p>
        </div>

        <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-3 lg:grid-cols-4">
          <li className="bg-surface-2 p-6">
            <div className="t-mono mb-6 text-sm text-lift">skillco.work</div>
            <div className="t-display text-4xl">{SKILLS.length}</div>
            <div className="mt-1 text-sm text-fg-2">Skills in the index</div>
          </li>
          {counts.map((item) => {
            const Icon = (CATEGORY_META[item.category] ?? CATEGORY_META["Other"]).icon;
            return (
              <li key={item.category} className="bg-surface p-6">
                <Icon weight="bold" className="mb-6 h-6 w-6 text-lift" />
                <div className="t-display text-4xl">{item.count}</div>
                <div className="mt-1 text-sm text-fg-2">{item.category}</div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
