# SkillCo Brand Identity v2.0 (October 2026)

Replaces the violet and gear-S brand in `BRAND.md`. Live guidelines page: https://claude.ai/artifact/FyF1zJiF9YXMUHvr1UHveC

## Decisions

| Question | Decision | Reason |
|---|---|---|
| Blue | Ultramarine `#2F3CFF`, with navy and ink surfaces | Of ~20 brands checked, none sits at hue ~236 and this brightness. Navy stays a surface color. |
| Light or dark | Both. Dark for hero, video, social. Light for catalog and docs. | Ultramarine fails contrast on near-black (2.94:1), so dark mode uses Lift `#7C8BFF` (6.41:1) or Tint `#E8EDFF` (16.49:1). |
| Symbol or wordmark | Symbol + wordmark lockup at launch. Symbol earns solo use over time. | Amazon's smile-only icon came ~20 years after the smile. |
| Name | **SkillCo**. `skillco.work` is the address, small, lowercase, mono. | A funded edtech company named SkillCo exists (skillco.net), so the domain chip does real work. |
| Tagline | **Skills that work.** Proof line: Same prompt, same skill, every time. | Plays on the .work domain. Hold the proof line until the matching behaves that way. |

## Logo: the Trace

An S drawn as one continuous path with four 45 degree turns, from top right to a lit end node.

- 96 unit box, 16 unit grid. Path: `M80 16 H32 L16 32 L32 48 H64 L80 64 L64 80 H24`, stroke 14, mitered joins.
- Lit node: 22 unit square, 3 unit corners, lime `#C6FF3D`. On light backgrounds add a 3 unit navy `#0B1230` outline (lime on white is 1.18:1).
- Variants: blue (light), reversed (tint on ink), mono ink, mono white, app icon (blue and ink), favicon.
- Wordmark: Plus Jakarta Sans ExtraBold, outlined, tracking -2.5%.
- Lockups: horizontal, horizontal with domain, stacked. Use the domain version wherever a stranger first meets the brand.
- Clear space: half the mark height. Minimums: mark 16 px, horizontal lockup 24 px, stacked 56 px, lockup with domain 64 px.
- Do not: stretch, rotate, mirror, recolor the node, add effects, square off the turns (reads as 5), write the name as "SkillCo.Work".
- Secondary system: a 3x3 grid of cells with one lit cell, used as the glyph and pattern on each skill page.

## Color

| Name | Hex | Use |
|---|---|---|
| Ultramarine | `#2F3CFF` | Buttons, large fields, text on light |
| Lift | `#7C8BFF` | Brand blue on dark |
| Tint | `#E8EDFF` | Mark and text on dark |
| Navy | `#0B1230` | Dark surfaces, node outline |
| Ink | `#0A0E1A` | Dark page, text on light |
| Signal lime | `#C6FF3D` | The lit node. One highlight per screen |

Blue scale: 50 `#F2F4FF`, 100 `#E8EDFF`, 200 `#CBD3FF`, 300 `#A6B2FF`, 400 `#7C8BFF`, 500 `#5163FF`, 600 `#2F3CFF`, 700 `#2430D9`, 800 `#1B24A8`, 900 `#141B78`, 950 `#0B1230`.
Proportions: about 50% ink/navy, 30% white/tint, 17% ultramarine, 3% lime.

| Pairing | Ratio | Result |
|---|---|---|
| Ultramarine on white | 6.54 | Pass |
| Lift on ink | 6.41 | Pass |
| Tint on ink | 16.49 | Pass |
| Lime on ink | 16.30 | Pass |
| Lime on ultramarine | 5.53 | Pass |
| Ultramarine on ink | 2.94 | Fail, never use thin marks this way |
| Lime on white | 1.18 | Fail, never alone on light |

## Type

Plus Jakarta Sans (display 800, headings 700, body 400/500) and JetBrains Mono (domains, skill IDs, code). Clash Display is retired. Both families are free on Google Fonts.

## Components, motion, skill pages

See the live page and `tokens.css`. Key rules: 44 px buttons, 3 px focus ring, 4 px spacing base, radii 6/10/14/20. Intro motion: path draws in 700 ms, node pops at 620 ms, ease `cubic-bezier(.32,.72,0,1)`, still end frame equals the static logo, reduced motion shows the finished mark. Skill pages: skill name is the headline, "on SkillCo" is the endorsement, full subdomain as a mono chip, canonical content at `skillco.work/skills/<slug>` with the subdomain redirecting.

## Domain pattern

Primary `skillco.work`. Skill pages `[skill].skillco.work`. As of 2026-10-15: skillco.com and skillco.ai are taken, skillco.dev and skillco.io were available. Ownership of skillco.work is unconfirmed.

## Not yet done

Trademark search (a funded edtech SkillCo exists), look-alike sweep against skillco.net and competitor favicons, five-second redraw test, confirmation that "same prompt, same skill" matches JEV behavior, hand-finishing the wordmark.

## Files

`logo/` holds SVGs and PNGs. `tokens.css` holds the design tokens. Tagline options and voice are in `TAGLINE-AND-VOICE.md`. Evidence is in `logo-research-report.md`.
