import { MagnifyingGlass, DownloadSimple, Play } from "@phosphor-icons/react/dist/ssr";

const steps = [
  {
    number: "01",
    title: "Find",
    description:
      "Describe the job or filter by category. You get the skills that mention what you asked for.",
    icon: MagnifyingGlass,
  },
  {
    number: "02",
    title: "Download",
    description:
      "Each skill is a zip with a SKILL.md inside. It is plain instructions, so it works with any model.",
    icon: DownloadSimple,
  },
  {
    number: "03",
    title: "Run",
    description:
      "Drop it into your agent's skills folder and ask for the job. Edit the SKILL.md to make it yours.",
    icon: Play,
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-y border-line bg-surface-2 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 max-w-2xl">
          <p className="t-mono mb-3 text-xs text-link">ask · match · run</p>
          <h2 className="t-display text-3xl md:text-4xl">Pick a skill. Add it to your agent.</h2>
          <p className="mt-3 text-fg-2">
            A skill is a packaged set of instructions your agent follows.
          </p>
        </div>

        <ol className="grid gap-5 md:grid-cols-3">
          {steps.map((step) => (
            <li
              key={step.number}
              className="rounded-lg border border-line bg-surface p-7"
            >
              <div className="mb-8 flex items-center justify-between">
                <span className="t-mono text-sm text-fg-3">{step.number}</span>
                <span className="flex h-11 w-11 items-center justify-center rounded-md bg-ultra text-white">
                  <step.icon weight="bold" className="h-5 w-5" />
                </span>
              </div>
              <h3 className="text-xl font-bold tracking-tight">{step.title}</h3>
              <p className="mt-2 leading-relaxed text-fg-2">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
