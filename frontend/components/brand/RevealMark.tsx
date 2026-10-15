"use client";

import { useEffect, useRef, useState } from "react";
import { Mark } from "@/components/brand/Logo";

/**
 * The intro animation, played once when the mark scrolls into view.
 * Server-rendered state is already the finished mark (so no-JS and
 * reduced-motion users see the real logo); the animation only arms after hydration.
 */
export function RevealMark({ size = 72 }: { size?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setArmed(true);
          io.disconnect();
        }
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref}>
      <Mark tone="dark" size={size} animated={armed} />
    </div>
  );
}
