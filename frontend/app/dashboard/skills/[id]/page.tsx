import Link from "next/link";
import { notFound } from "next/navigation";
import { SkillGlyph } from "@/components/brand/SkillGlyph";
import { SkillEditor } from "@/components/dashboard/SkillEditor";
import { ExportMenu } from "@/components/dashboard/ExportMenu";
import { QaPanel } from "@/components/dashboard/Builder";
import { InstallSnippets } from "@/components/marketplace/InstallSnippets";
import { getUser } from "@/lib/supabase/server";
import type { QaReport } from "@/lib/builder/schemas";
import { cn } from "@/lib/utils";

const TABS = ["files", "install", "versions"] as const;

export default async function SkillPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ tab?: string; v?: string }> }) {
  const { id } = await params;
  const { tab = "files", v } = await searchParams;
  const { supabase, user } = await getUser();
  if (!supabase || !user) notFound();

  const { data: skill } = await supabase.from("skills").select("*").eq("id", id).eq("owner_id", user.id).single();
  if (!skill) notFound();
  const { data: versions } = await supabase
    .from("skill_versions")
    .select("id, version, change_note, created_at, size_bytes, files, qa_report")
    .eq("skill_id", id)
    .order("version", { ascending: false });
  const current = (v ? versions?.find((x) => x.version === Number(v)) : versions?.find((x) => x.id === skill.current_version_id)) ?? versions?.[0];
  const isLatest = current?.id === skill.current_version_id || current?.version === versions?.[0]?.version;
  const files = (current?.files ?? {}) as Record<string, string>;

  return (
    <>
      <div className="flex flex-wrap items-start gap-4">
        <SkillGlyph id={skill.slug} size={56} />
        <div className="min-w-0 flex-1">
          <p className="t-mono text-xs text-fg-3">{user.email?.split("@")[0]}/{skill.slug}</p>
          <h1 className="text-2xl font-bold tracking-tight">{skill.name}</h1>
          <p className="mt-1 max-w-3xl text-sm text-fg-2">{skill.description}</p>
          <p className="t-mono mt-2 text-xs text-fg-3">v{current?.version} · {skill.category} · {skill.visibility}</p>
        </div>
      </div>

      <nav className="mt-6 flex gap-1 border-b border-line" aria-label="Skill tabs">
        {TABS.map((t) => (
          <Link key={t} href={`?tab=${t}${v ? `&v=${v}` : ""}`} className={cn("-mb-px border-b-2 px-4 py-2 text-sm font-semibold capitalize", tab === t ? "border-ultra text-fg" : "border-transparent text-fg-3 hover:text-fg")}>
            {t}
          </Link>
        ))}
      </nav>

      <div className="mt-6 space-y-6">
        {tab === "files" && current && (
          <>
            {current.qa_report && <QaPanel qa={current.qa_report as QaReport} />}
            {!isLatest && <p className="rounded-md border border-line bg-surface-2 p-3 text-sm">Viewing version {current.version} (read-only). <Link href="?tab=files" className="text-link underline">Go to latest</Link></p>}
            <SkillEditor key={current.id} skillId={skill.id} files={files} readOnly={!isLatest} />
          </>
        )}
        {tab === "install" && (
          <>
            <ExportMenu skillId={skill.id} slug={skill.slug} version={current?.version} />
            <InstallSnippets slug={skill.slug} />
          </>
        )}
        {tab === "versions" && (
          <ol className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
            {versions?.map((ver) => (
              <li key={ver.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm">
                <span>
                  <span className="t-mono font-bold">v{ver.version}</span>
                  <span className="ml-3 text-fg-2">{ver.change_note}</span>
                </span>
                <span className="flex items-center gap-4 text-xs text-fg-3">
                  {new Date(ver.created_at).toLocaleString()} · {Math.round(ver.size_bytes / 1024)} KB
                  <Link href={`?tab=files&v=${ver.version}`} className="font-semibold text-link">View</Link>
                </span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </>
  );
}
