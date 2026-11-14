import Link from "next/link";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import { SkillGlyph } from "@/components/brand/SkillGlyph";
import { Button } from "@/components/ui/Button";
import { getUser } from "@/lib/supabase/server";

export const metadata = { title: "My skills" };

export default async function Library() {
  const { supabase, user } = await getUser();
  const { data: skills } = supabase && user
    ? await supabase
        .from("skills")
        .select("id, slug, name, description, category, visibility, updated_at, platforms, skill_versions(count)")
        .eq("owner_id", user.id)
        .order("updated_at", { ascending: false })
    : { data: [] };

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="t-mono text-xs text-link">dashboard</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">My skills</h1>
          <p className="mt-1 text-sm text-fg-2">Every skill you build is versioned and exportable to any harness.</p>
        </div>
        <Button asChild><Link href="/dashboard/new"><Plus weight="bold" className="h-4 w-4" />New skill</Link></Button>
      </div>

      {skills && skills.length > 0 ? (
        <div className="mt-8 overflow-hidden rounded-xl border border-line bg-surface">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-surface-2 text-xs uppercase tracking-wide text-fg-3">
              <tr><th className="px-4 py-3">Skill</th><th className="hidden px-4 py-3 md:table-cell">Category</th><th className="hidden px-4 py-3 md:table-cell">Versions</th><th className="px-4 py-3">Visibility</th><th className="hidden px-4 py-3 sm:table-cell">Updated</th></tr>
            </thead>
            <tbody>
              {skills.map((s) => (
                <tr key={s.id} className="border-b border-line last:border-0 hover:bg-surface-2">
                  <td className="px-4 py-3">
                    <Link href={`/dashboard/skills/${s.id}`} className="flex items-center gap-3">
                      <SkillGlyph id={s.slug} size={32} />
                      <span className="min-w-0">
                        <span className="block font-semibold text-fg">{s.name}</span>
                        <span className="t-mono block truncate text-xs text-fg-3">{s.slug}</span>
                      </span>
                    </Link>
                  </td>
                  <td className="hidden px-4 py-3 text-fg-2 md:table-cell">{s.category}</td>
                  <td className="hidden px-4 py-3 text-fg-2 md:table-cell">{(s.skill_versions as unknown as { count: number }[])?.[0]?.count ?? 1}</td>
                  <td className="px-4 py-3"><span className="rounded-full border border-line px-2 py-0.5 text-xs text-fg-2">{s.visibility}</span></td>
                  <td className="hidden px-4 py-3 text-fg-3 sm:table-cell">{new Date(s.updated_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-10 rounded-xl border border-dashed border-line-strong bg-surface px-6 py-16 text-center">
          <h2 className="text-xl font-bold">No skills yet</h2>
          <p className="mx-auto mt-2 max-w-md text-fg-2">Describe a job you want an agent to do. The builder researches the tools, plans the steps and writes the SKILL.md for you.</p>
          <Button asChild className="mt-6"><Link href="/dashboard/new">Build your first skill</Link></Button>
        </div>
      )}
    </>
  );
}
