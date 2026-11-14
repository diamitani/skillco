import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/sections/Footer";
import { GithubCatalogClient } from "@/components/marketplace/GithubCatalogClient";
import { loadGithubCatalog } from "@/lib/github-catalog";

export const metadata: Metadata = {
  title: "GitHub skills library",
  description: "Agent skills from GitHub repos with 4+ stars, sorted by category and security-screened.",
};

export default async function GithubLibrary() {
  const { summary, skills } = await loadGithubCatalog();
  const categories = Object.entries(summary?.byCategory ?? {}).sort((a, b) => b[1] - a[1]);
  // trim payload sent to the client
  const items = skills.map(({ id, name, description, category, repo, stars, license, url, grade, findings }) => ({
    id, name, description: description.slice(0, 280), category, repo, stars, license, url, grade, findings: findings.map((f) => ({ rule: f.rule })),
  }));
  return (
    <>
      <Nav theme="light" />
      <main className="flex-1">
        <section className="border-b border-line">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <p className="t-mono mb-3 text-xs text-link"><Link href="/marketplace">skills</Link> / github</p>
            <h1 className="t-display text-4xl md:text-5xl">GitHub skills library</h1>
            <p className="mt-3 max-w-2xl text-fg-2">
              {skills.length.toLocaleString()} open-source Agent Skills from repos with {summary?.minStars ?? 4}+ stars, sorted by category
              and screened for secrets, remote-code execution, destructive commands, exfiltration and prompt injection.
              {summary && <> Last scan {new Date(summary.generatedAt).toLocaleDateString("en-US")} across {summary.reposScanned.toLocaleString()} repos; {summary.rejected} skills failed and are excluded.</>}
            </p>
            <p className="mt-2 text-xs text-fg-3">Static screening is a first filter, not a guarantee. Read a skill before you run it.</p>
          </div>
        </section>
        {skills.length ? <GithubCatalogClient skills={items} categories={categories} /> : (
          <p className="mx-auto max-w-7xl px-4 py-16 text-fg-2 sm:px-6 lg:px-8">The library is being built. Check back soon.</p>
        )}
      </main>
      <Footer />
    </>
  );
}
