# SkillCo design system (brand v2.0)

Source of truth for the brand itself: `Marketing/brand/v2/BRAND-v2.md`. This file explains how that brand is wired into the code, so you can change the site without breaking it.

## The one rule that makes everything work

**Never type a colour in a component. Use the token names.** Every colour below is defined once in `app/globals.css`. Change a token there and the whole site updates.

## Colour tokens

Brand constants (same in light and dark):

| Tailwind class | Hex | Use |
|---|---|---|
| `bg-ultra` `text-ultra` | `#2F3CFF` | Buttons, large fields, text on light |
| `text-lift` | `#7C8BFF` | Brand blue on dark surfaces |
| `text-tint` | `#E8EDFF` | Mark and text on dark |
| `bg-navy` | `#0B1230` | Dark surfaces, node outline |
| `bg-ink` | `#0A0E1A` | Dark page, text on light |
| `bg-lime` | `#C6FF3D` | The lit node in the logo. One highlight per screen |

Semantic tokens (these flip between light and dark, so use these in components):

`bg-bg` page · `bg-surface` cards · `bg-surface-2` panels and hover · `border-line` / `border-line-strong` · `text-fg` main text · `text-fg-2` secondary · `text-fg-3` tertiary and labels · `text-link` · `bg-btn` / `bg-btn-hover` · `text-ok` `text-warn` `text-bad`

**Light is the default** (catalog, docs). **Add the class `theme-dark` to any element** to make everything inside it dark (hero, stats band, footer). That is how a section changes theme without touching its contents.

Lime rule: lime appears only as the logo's lit node. Do not use it for buttons, badges or highlights. Skill glyphs use brand blue instead.

## Type

- Plus Jakarta Sans (display 800, headings 700, body 400/500). Loaded in `app/layout.tsx`.
- JetBrains Mono for domains, skill IDs and code.
- Helpers: `.t-display` (800, tight tracking, for headlines) and `.t-mono`.
- The address is always small, lowercase, mono: `skillco.work`. Never "SkillCo.Work".

## Shape and spacing

Radii 6 / 10 / 14 / 20 (`rounded-sm` `rounded-md` `rounded-lg` `rounded-xl`). 4px spacing base (Tailwind default). Buttons are 44px tall. Focus ring is 3px and applied globally.

## Components

| File | What it is |
|---|---|
| `components/brand/Logo.tsx` | `Logo` (official lockups: `h`, `h-domain`, `stack`; `tone` light or dark) and `Mark` (the symbol, optional intro animation) |
| `components/brand/RevealMark.tsx` | Mark that plays the draw-in animation when scrolled into view |
| `components/brand/SkillGlyph.tsx` | The 3x3 grid with one lit cell. Lit cell is derived from the skill id, so it is stable |
| `components/ui/Button.tsx` | `primary`, `secondary`, `ghost`; sizes `md`, `lg`; `asChild` to wrap a link |
| `components/ui/DomainChip.tsx` | The `skillco.work` chip |
| `components/SkillCard.tsx` | One skill: glyph, name, id, description, category, download |
| `components/Nav.tsx`, `components/sections/*` | Page chrome and home sections |

Logo minimum sizes: mark 16px, horizontal lockup 24px, stacked 56px, lockup with domain 64px. Do not stretch, rotate, recolour the node or add effects.

## Motion

Path draws in 700 ms, the node pops at 620 ms, ease `cubic-bezier(.32,.72,0,1)`. Reduced-motion users see the finished mark (handled in `globals.css`). No gradients, glows, blurs or floating orbs.

## Voice

Calm, precise, plain. Copy lives in `Marketing/brand/v2/TAGLINE-AND-VOICE.md`. Use: skill, index, match, install, run, agent. Avoid: revolutionary, supercharge, unlock, magic, seamless. Do not put the "Same prompt, same skill, every time" proof line on a public page until the matching behaves that way.

## Assets

- Web copies: `public/brand/` (SVG lockups and marks, domain lockup PNGs)
- Favicons and share images use Next's file convention: `app/icon.svg`, `app/favicon.ico`, `app/apple-icon.png`, `app/opengraph-image.png`, `app/twitter-image.png`
- Full kit (including concepts that are *not* to be used): `Marketing/brand/v2/`

## Search

`lib/search.ts` is keyword matching (word-start match, best match first). It is not semantic routing, and the site copy should not claim it is.
