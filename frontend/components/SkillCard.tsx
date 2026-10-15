import { DownloadSimple } from "@phosphor-icons/react/dist/ssr";
import { SkillGlyph } from "@/components/brand/SkillGlyph";
import { buttonVariants } from "@/components/ui/Button";
import { CATEGORY_META, type Skill } from "@/lib/skills";
import { cn } from "@/lib/utils";

/** One skill in the index. The download is a real file served from /downloads. */
export function SkillCard({ skill }: { skill: Skill }) {
  const meta = CATEGORY_META[skill.category] ?? CATEGORY_META["Other"];
  const CategoryIcon = meta.icon;

  return (
    <article className="flex h-full flex-col rounded-lg border border-line bg-surface p-5 transition-colors duration-200 hover:border-line-strong">
      <div className="flex items-start gap-4">
        <SkillGlyph id={skill.id} size={48} />
        <div className="min-w-0">
          <h3 className="text-lg font-bold leading-snug tracking-tight">
            {skill.name}
          </h3>
          <p className="t-mono truncate text-xs text-fg-3">{skill.id}</p>
        </div>
      </div>

      <div className="mt-4 flex-grow">
        <p className="line-clamp-3 text-sm leading-relaxed text-fg-2">
          {skill.description}
        </p>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-line pt-4 text-xs">
        <span className="inline-flex items-center gap-1.5 text-fg-2">
          <CategoryIcon weight="bold" className="h-4 w-4" />
          {skill.category}
        </span>
        <span className="font-semibold text-ok">{skill.price}</span>
      </div>

      <a
        href={`/downloads/${skill.id}.zip`}
        download={`${skill.id}.zip`}
        className={cn(
          buttonVariants({ variant: "secondary" }),
          "mt-4 w-full"
        )}
      >
        <DownloadSimple weight="bold" className="h-4 w-4" />
        Download skill (.zip)
      </a>
    </article>
  );
}
