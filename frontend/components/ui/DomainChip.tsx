import { cn } from "@/lib/utils";

/** The address, always small, lowercase, mono. Never written as "SkillCo.Work". */
export function DomainChip({
  children = "skillco.work",
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "t-mono inline-flex items-center rounded-full border border-line bg-surface px-3 py-1 text-xs text-link",
        className
      )}
    >
      {children}
    </span>
  );
}
