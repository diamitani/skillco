import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DownloadSimple, Lightning } from "@phosphor-icons/react/dist/ssr";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/sections/Footer";
import { SkillGlyph } from "@/components/brand/SkillGlyph";
import { Button, buttonVariants } from "@/components/ui/Button";
import { InstallSnippets } from "@/components/marketplace/InstallSnippets";
import { SkillTabs } from "@/components/marketplace/SkillTabs";
import { SKILLS, CATEGORY_META } from "@/lib/skills";
import { readCatalogSkill } from "@/lib/catalog";
import { parseSkillMd } from "@/lib/builder/skillmd";
import { cn } from "@/lib/utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return SKILLS.map((s) => ({ id: s.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const s = SKILLS.find((x) => x.id === id);
  return s ? { title: s.name, description: s.description } : {};
}

/** Skill detail page, modelled on Replicate's model page: owner/name header, tabs, sticky action rail. */
export default async function SkillDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const skill = SKILLS.find((s) => s.id === id);
  if (!skill) notFound();
  const files = await readCatalogSkill(skill.id);
  const { body } = parseSkillMd(files["SKILL.md"] ?? "");
  const Icon = (CATEGORY_META[skill.category] ?? CATEGORY_META.Other).icon;
  const related = SKILLS.filter((s) => s.category === skill.category && s.id !== skill.id).slice(0, 4);
  const zipUrl = `/downloads/${skill.id}.zip`;

  return (
    <>
      <Nav theme="light" />
      <main className="flex-1">
        <section className="border-b border-line">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <nav className="t-mono text-xs text-fg-3" aria-label="Breadcrumb">
              <Link href="/marketplace" className="hover:text-fg">skills</Link> / <span>skillco</span> / <span className="text-fg">{skill.id}</span>
            </nav>
            <div className="mt-4 flex flex-wrap items-start gap-5">
              <SkillGlyph id={skill.id} size={64} />
              <div className="min-w-0 flex-1">
                <h1 className="t-display text-3xl md:text-4xl">{skill.name}</h1>
                <p className="mt-2 max-w-3xl text-fg-2">{skill.description}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-fg-2"><Icon weight="bold" className="h-3.5 w-3.5" />{skill.category}</span>
                  <span className="rounded-full border border-line px-2.5 py-1 text-fg-2">v{skill.version}</span>
                  <span className="rounded-full border border-line px-2.5 py-1 text-fg-2">{skill.platform}</span>
                  <span className="rounded-full bg-ok/10 px-2.5 py-1 font-semibold text-ok">{skill.price}</span>
                  <span className="rounded-full border border-line px-2.5 py-1 text-fg-2">Agent Skills spec</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-8">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_300px] lg:px-8">
            <div className="min-w-0">
              <SkillTabs
                readme={body || skill.description}
                files={files}
                install={<InstallSnippets slug={skill.id} downloadUrl={`${skill.id}.zip`} />}
              />
            </div>
            <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
              <div className="rounded-xl border border-line bg-surface p-4">
                <a href={zipUrl} download={`${skill.id}.zip`} className={cn(buttonVariants(), "w-full")}>
                  <DownloadSimple weight="bold" className="h-4 w-4" />Download (.zip)
                </a>
                <Button asChild variant="secondary" className="mt-2 w-full">
                  <Link href={`/dashboard/new?from=${skill.id}`}><Lightning weight="bold" className="h-4 w-4" />Remix in builder</Link>
                </Button>
                <dl className="mt-4 space-y-2 text-xs">
                  <div className="flex justify-between"><dt className="text-fg-3">Publisher</dt><dd className="font-semibold">SkillCo</dd></div>
                  <div className="flex justify-between"><dt className="text-fg-3">Files</dt><dd>{Object.keys(files).length}</dd></div>
                  <div className="flex justify-between"><dt className="text-fg-3">License</dt><dd>Free</dd></div>
                </dl>
              </div>
              {related.length > 0 && (
                <div className="rounded-xl border border-line bg-surface p-4">
                  <h2 className="text-xs font-bold uppercase tracking-wide text-fg-3">More in {skill.category}</h2>
                  <ul className="mt-3 space-y-3">
                    {related.map((r) => (
                      <li key={r.id}>
                        <Link href={`/marketplace/${r.id}`} className="flex items-center gap-3 hover:text-link">
                          <SkillGlyph id={r.id} size={28} />
                          <span className="truncate text-sm font-semibold">{r.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
