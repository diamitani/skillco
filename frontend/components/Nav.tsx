"use client";

import Link from "next/link";
import { useState } from "react";
import { List, X } from "@phosphor-icons/react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Skills", href: "/marketplace", description: "Browse the index" },
  {
    name: "Full library",
    href: "/downloads/skill-library-full.zip",
    description: "Download every skill as one zip",
  },
  {
    name: "GitHub",
    href: "https://github.com/diamitani/skillco",
    description: "Source code",
  },
];

/**
 * Top bar. `theme` is the surface it sits on: the home page opens on a dark hero,
 * the catalog is light. Colours come from tokens, so only the logo variant changes.
 */
export function Nav({ theme = "light" }: { theme?: "light" | "dark" }) {
  const [open, setOpen] = useState(false);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-line bg-bg text-fg",
        theme === "dark" && "theme-dark"
      )}
    >
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
      >
        <Link href="/" aria-label="SkillCo home" className="flex items-center">
          <Logo tone={theme} height={32} />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-fg-2 transition-colors duration-200 hover:text-fg"
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="hidden md:block">
          <Button asChild>
            <Link href="/marketplace">Browse skills</Link>
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="-mr-2 flex h-11 w-11 items-center justify-center text-fg-2 hover:text-fg md:hidden"
        >
          {open ? (
            <X weight="bold" className="h-6 w-6" />
          ) : (
            <List weight="bold" className="h-6 w-6" />
          )}
        </button>
      </nav>

      {open && (
        <div id="mobile-menu" className="border-t border-line bg-bg md:hidden">
          <div className="mx-auto max-w-7xl space-y-1 px-4 py-4 sm:px-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-md px-3 py-3 hover:bg-surface-2"
              >
                <div className="font-semibold">{link.name}</div>
                <div className="text-sm text-fg-3">{link.description}</div>
              </Link>
            ))}
            <Button asChild className="mt-3 w-full">
              <Link href="/marketplace" onClick={() => setOpen(false)}>
                Browse skills
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
