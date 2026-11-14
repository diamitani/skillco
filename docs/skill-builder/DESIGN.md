# SkillCo marketplace + dashboard redesign: reference research
Prepared Nov 13, 2026. We copy layout and UX patterns only. No branding, copy, or assets are taken from any of these sites.

## Products compared

| Product | URL | Browse / search | Detail page | Install-to-platform | Creator / owner | Trust signals | Verdict |
|---|---|---|---|---|---|---|---|
| **Replicate Explore** | https://replicate.com/explore | Search-first header, "Featured" row, collections, dense "Popular" grid | `owner/name` header, tabs (Playground · API · Examples · README · Versions), sticky run panel | **API tab: per-language copy-paste snippets** | Every item namespaced `owner/name`, owner pages | Run counts, "Official" badge | **Primary reference** |
| skills.sh | https://skills.sh | Leaderboard ranked by installs, 8-week activity | Minimal | One-line CLI install | Grouped by repo/owner ("+3 more from …") | Install counts | Borrow: leaderboard / one-line install |
| ClawHub | https://clawhub.ai | Hero + "Official creators" + "Skills for the apps you already use" | Plugin pages | `clawhub skill publish` CLI | Strong creator section | Install counts | Borrow: official-creators row, publish CLI idea |
| Smithery (now part of Arcade) | https://smithery.ai | Card grid of MCP servers | Connection config per client | Per-client config JSON | Org badges | "Auth handled" | Borrow: per-client config blocks |
| Glama MCP registry | https://glama.ai/mcp/servers | Long list with filters | Server pages | Config snippets | Author | **A/B/C grades for license, quality, maintenance** | Borrow: letter-grade quality badges |
| cursor.directory | https://cursor.directory | Category rail + card grid | Rule text inline | Copy button | Author | Likes | Borrow: copy-to-clipboard on content |

(cursor.directory timed out from the fetcher. That row is based on its known public layout, not re-verified this session.)

## Chosen reference: **Replicate**, plus three borrowed patterns
Patrick asked for Replicate, and it also has the most complete "catalog plus detail plus per-platform install" UX of the set:
1. **Explore page.** Search-first header, a Featured row, then a filter rail with a dense grid (Replicate). Every item is namespaced `owner/slug` (we use `skillco/<id>` now; creator namespaces come later).
2. **Skill detail page.** Breadcrumb `skills / owner / slug`, a title-and-badges header, tabs **README · Install · Files**, and a sticky right rail with the primary action (Download), a secondary action (**Remix in builder**), metadata, and "More in category" (Replicate model page).
3. **Install tab.** Replicate's per-language API snippets become **per-harness snippets** (Claude Code, Cursor, Codex, Gemini CLI, OpenClaw, Any agent) with a copy button (Replicate + Smithery).
4. **Quality badge.** A Glama-style **A/B/C grade** from our QA pass (spec lint plus reviewer score), shown on builder results and saved skills. It goes on catalog cards once the GitHub scraper adds security grading.
5. **Dashboard.** A Replicate-style account shell: left rail (New skill, My skills, Catalog, Billing & usage) with a **usage meter** (generations and storage) at the bottom, a table library, and skill pages with tabs **Files · Install · Versions**.
6. **Leaderboard / installs** (skills.sh) and **official creators** (ClawHub) are planned. They need install tracking and the creator namespace, which come with the GitHub scraper phase.

## Implemented in branch `mvp/skill-builder`
- `components/marketplace/MarketplaceClient.tsx`: Explore layout (search header, Featured row, category rail, sort, grid, "Build it instead" empty state)
- `app/marketplace/[id]/page.tsx` + `components/marketplace/SkillTabs.tsx`: 369 static detail pages. The README is read from each skill's real SKILL.md inside its zip.
- `components/marketplace/InstallSnippets.tsx`: per-harness install tabs
- `app/dashboard/*`: account shell with usage meter, library table, skill tabs, builder with step tracker
- Existing brand tokens (ultramarine / ink / lime, Plus Jakarta + JetBrains Mono) are unchanged.
