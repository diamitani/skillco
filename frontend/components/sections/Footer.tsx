import Link from "next/link";
import { GithubLogo } from "@phosphor-icons/react/dist/ssr";
import { Logo } from "@/components/brand/Logo";

const footerLinks = {
  Product: [
    { name: "Browse skills", href: "/marketplace" },
    { name: "Full library (.zip)", href: "/downloads/skill-library-full.zip" },
  ],
  Resources: [
    { name: "Source on GitHub", href: "https://github.com/diamitani/skillco" },
  ],
};

export function Footer({ theme = "dark" }: { theme?: "light" | "dark" }) {
  return (
    <footer
      className={`border-t border-line bg-bg text-fg ${theme === "dark" ? "theme-dark" : ""}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 py-14 md:grid-cols-4">
          <div className="col-span-2">
            <Link href="/" aria-label="SkillCo home" className="inline-block">
              <Logo tone={theme} variant="h-domain" height={64} />
            </Link>
            <p className="mt-4 max-w-xs text-sm text-fg-2">
              The skill index for AI agents.
            </p>
            <a
              href="https://github.com/diamitani/skillco"
              aria-label="SkillCo on GitHub"
              className="mt-6 inline-flex h-11 w-11 items-center justify-center rounded-md border border-line text-fg-2 transition-colors hover:border-line-strong hover:text-fg"
            >
              <GithubLogo weight="fill" className="h-5 w-5" />
            </a>
          </div>

          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h3 className="mb-4 text-sm font-bold">{group}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-fg-2 transition-colors hover:text-fg"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-start justify-between gap-3 border-t border-line py-6 text-sm text-fg-3 sm:flex-row sm:items-center">
          <p>
            SkillCo · <span className="t-mono">skillco.work</span> · Skills that work.
          </p>
          <p>Early access. All downloads free.</p>
        </div>
      </div>
    </footer>
  );
}
