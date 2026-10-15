import { cn } from "@/lib/utils";

/**
 * The secondary brand system: a 3x3 grid of cells with one lit cell.
 * Every skill gets its own glyph. The lit cell is derived from the skill id,
 * so a skill always shows the same pattern. The lit cell uses brand blue
 * (--glyph-lit), never lime: lime is reserved for the logo node.
 */
function hash(id: string) {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function SkillGlyph({
  id,
  size = 44,
  className,
}: {
  id: string;
  size?: number;
  className?: string;
}) {
  const lit = hash(id) % 9;
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-grid shrink-0 grid-cols-3 gap-[3px] rounded-md border border-line bg-surface-2 p-[5px]",
        className
      )}
      style={{ width: size, height: size }}
    >
      {Array.from({ length: 9 }, (_, i) => (
        <span
          key={i}
          className={cn(
            "rounded-[2px]",
            i === lit ? "bg-glyph-lit" : "bg-line-strong/60"
          )}
        />
      ))}
    </span>
  );
}
