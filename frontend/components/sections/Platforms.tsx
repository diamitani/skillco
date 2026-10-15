const platforms = [
  { name: "Claude", description: "Reasoning and analysis" },
  { name: "Codex", description: "Code generation" },
  { name: "Hermes", description: "Open-source flexibility" },
  { name: "OpenClaw", description: "Local-first agent framework" },
];

export function Platforms() {
  return (
    <section className="bg-bg py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-2xl">
          <h2 className="t-display text-3xl md:text-4xl">Works with your agents</h2>
          <p className="mt-3 text-fg-2">
            One index, any agent that reads a SKILL.md.
          </p>
        </div>

        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {platforms.map((p) => (
            <li
              key={p.name}
              className="rounded-lg border border-line bg-surface p-6"
            >
              <p className="t-mono text-base text-link">{p.name}</p>
              <p className="mt-2 text-sm text-fg-2">{p.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
