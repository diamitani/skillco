import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * SkillCo logo (brand v2.0, "the Trace").
 * Lockups are the official outlined SVGs in /public/brand. Pick the tone for
 * the surface the logo sits on: "light" = for light backgrounds, "dark" = for ink/navy.
 * Minimum sizes: horizontal lockup 24px tall, with domain 64px, stacked 56px.
 */

type Tone = "light" | "dark";
type LockupVariant = "h" | "h-domain" | "stack";

const LOCKUP_SRC: Record<LockupVariant, Record<Tone, string>> = {
  h: {
    light: "/brand/skillco-lockup-h-light.svg",
    dark: "/brand/skillco-lockup-h-dark.svg",
  },
  "h-domain": {
    light: "/brand/skillco-lockup-h-domain-light.svg",
    dark: "/brand/skillco-lockup-h-domain-dark.svg",
  },
  stack: {
    light: "/brand/skillco-lockup-stack-light.svg",
    dark: "/brand/skillco-lockup-stack-dark.svg",
  },
};

// Intrinsic viewBox of each lockup file
const LOCKUP_SIZE: Record<LockupVariant, { w: number; h: number }> = {
  h: { w: 300, h: 96 },
  "h-domain": { w: 300, h: 96 },
  stack: { w: 184, h: 198 },
};

export function Logo({
  tone = "light",
  variant = "h",
  height = 32,
  className,
}: {
  tone?: Tone;
  variant?: LockupVariant;
  /** rendered height in px */
  height?: number;
  className?: string;
}) {
  const { w, h } = LOCKUP_SIZE[variant];
  return (
    <Image
      src={LOCKUP_SRC[variant][tone]}
      alt="SkillCo"
      width={Math.round((height * w) / h)}
      height={height}
      unoptimized
      priority
      className={cn("block w-auto select-none", className)}
      style={{ height }}
    />
  );
}

const TRACE = "M80 16 H32 L16 32 L32 48 H64 L80 64 L64 80 H24";

/**
 * The symbol on its own. Use for avatars, loaders and moments where the name is
 * already on screen. `animated` plays the intro: path draws in, node pops.
 */
export function Mark({
  tone = "light",
  animated = false,
  size = 40,
  className,
  title = "SkillCo",
}: {
  tone?: Tone;
  animated?: boolean;
  size?: number;
  className?: string;
  title?: string;
}) {
  const stroke = tone === "light" ? "#2F3CFF" : "#E8EDFF";
  return (
    <svg
      viewBox="0 0 96 96"
      width={size}
      height={size}
      role="img"
      aria-label={title}
      className={cn(animated && "trace-animate", className)}
    >
      <title>{title}</title>
      <path
        className="trace-path"
        d={TRACE}
        pathLength={1}
        fill="none"
        stroke={stroke}
        strokeWidth={14}
        strokeLinejoin="miter"
        strokeMiterlimit={4}
      />
      <rect
        className="trace-node"
        x={5}
        y={69}
        width={22}
        height={22}
        rx={3}
        fill="#C6FF3D"
        stroke={tone === "light" ? "#0B1230" : undefined}
        strokeWidth={tone === "light" ? 3 : undefined}
      />
    </svg>
  );
}
