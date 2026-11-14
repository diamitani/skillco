# SkillCo Skill Builder: Discovery + Build Plan
Prepared Fri Nov 13, 2026 (America/Chicago). Read-only discovery. Nothing was pushed, deployed, bought, or changed.

Source request (Patrick, t0u): a skill-builder agent for skillco.work, backed by a best-practices knowledge base that keeps itself current (platform docs plus vetted X and Reddit posts). It should generate full skills (SKILL.md, references, orchestration steps, a tools/connectors discovery prompt), host them in a dashboard that connects to any platform, turn uploaded job descriptions into skill sets, and ship an MCP server and plugin skill set for Harness upload. It should run inside the current site with OAuth sign-in. Pricing: $5.99/mo plus storage, upgrades, and token usage.

---

## 1. Current state (findings)

### Live site
- https://skillco.work returns a 308 redirect to https://www.skillco.work (served by Vercel, `server: Vercel`, `x-vercel-id: iad1::…`).
- The page is "SkillCo | Skills that work.", a static marketing page plus a catalog: "369 ready-to-install skills", 7 categories (AI Agents 94, Dev Tools 60, Music 37, Automation 31, Prospecting 24, Data 13, Other 110). Each skill downloads as a zip containing a SKILL.md. It has a "Works with" section (Claude, Codex, Hermes, OpenClaw) and a `/marketplace` page.
- **No sign-in, no auth, no account area, no pricing page live.** The page is prerendered (`x-nextjs-prerender: 1`) and served from the CDN cache.

### Hosting / DNS
- Registrar/DNS: **GoDaddy** (NS `ns11/ns12.domaincontrol.com`). Apex A record is `216.198.79.1` (Vercel). `www` is a CNAME to `719b621847dc8ecf.vercel-dns-017.com`.
- **Not a Cloudflare zone.** The Cloudflare connector is signed in as patrick.diamitani@gmail.com, and a `/zones?name=skillco.work` lookup returned nothing.
- Vercel: team **GPTPAT** (`gptpat`, team_oapewDYu0AulFXlrwKCX9ggY), project **`skillco`** (prj_Yn5o8c2SaAhWeA9zXpN95AEvr0eM), Node 24.x. Domains: skillco.work (308 to www), www.skillco.work, skillco-mu.vercel.app, skillco-gptpat.vercel.app, skillco-git-main-gptpat.vercel.app (so it is Git-connected to `main`). The latest production deployment, dpl_5kyNJuJi1WSvUJ7AqP6tSTx7jc6X, is READY (~Oct 15, 2026). Vercel SSO protection covers preview URLs only, not the custom domains.
- **The project has zero environment variables.** Stripe and Supabase are not configured in production.
- The `user-Vercel-xai` connector sees no teams. Use `user-Vercel`. Domain-level `get_domain` returned 403 because the domain is registered at GoDaddy, not in Vercel.

### Source
- Repo: **https://github.com/diamitani/skillco** (single commit on main, 23f5a8e, "Redesign site and design system on SkillCo brand v2.0 (#1)", Oct 15, 2026).
  - `frontend/` is **the live app**. It runs **Next.js 16.2.12 (App Router, Turbopack), React 19.2, Tailwind v4**, Phosphor icons, and motion. Its `vercel.json` sets framework nextjs, so the Vercel root directory is presumably `frontend`.
    - `lib/skills.ts` is auto-generated from `skill-library/dist/manifest.json` by `scripts/generate-skills-lib.py` (369 skills). The skill zips are in `public/downloads/*.zip` (377 files).
    - `app/api/stripe/{checkout,portal,webhook,identity}/route.ts` and `lib/stripe.ts` are scaffolded. The Stripe account referenced is acct_1UIHuI4DUgvDhOs8, the price ID is a placeholder, and there are no keys in Vercel. `scripts/sync-skills-to-supabase.ts` uploads zips to a Supabase Storage bucket `skills`, but it is not wired up.
    - **No auth code** in `frontend/`.
  - `Product/web-app/` is an older **Next 15** scaffold, not deployed. It has **Supabase SSR auth** (`@supabase/ssr` client/server/middleware), route groups (public)/(marketplace)/(creator: pal, sales), and shadcn UI. `Product/infrastructure/supabase-schema.sql` defines tables users, skills, security_scans, purchases, user_skills, reviews, categories, and skill_sources. `infrastructure/cdk/scan-service` is an AWS scan service stub.
  - `ARCHITECTURE.md` describes the vision (marketplace, security scanning, "PAL" premium skill builder). `docs/16-stripe-integration-plan.md` lists Pro at $19/mo; this conflicts with the new $5.99 target. `site-spec.md` and `frontend/DESIGN-SYSTEM.md` define the brand.
- Related repos to reuse:
  - https://github.com/diamitani/agent-skills is a **platform-agnostic skills monorepo**. `skills/<slug>/SKILL.md` is canonical, and `scripts/build.py` emits `dist/{grokbot,claude,openai,cursor,codex,gemini}`. **This is the export engine the dashboard needs**; port it to TypeScript or call it.
  - https://github.com/diamitani/web-app-skill-support uses the Vercel AI Gateway skill/agent system.
  - https://github.com/diamitani/artispreneur-claude-plugin is a working Claude plugin marketplace plus MCP server pattern.
  - https://github.com/diamitani/diamitani-skills and https://github.com/diamitani/skills-marketplace hold older registries and catalog sources.

### CLIs on the box
- `gh` is installed (`/usr/local/bin/gh`) and **authenticated** as `diamitani` with scopes gist, read:org, repo, workflow.
- `vercel` CLI 60.1.3 is installed (`~/.local/bin/vercel`) but **logged out**. The Vercel MCP connector (`user-Vercel`) is authenticated against team GPTPAT and is enough for reads, env vars, and deploy inspection.
- No `dig` on the box. Public DNS was resolved via dns.google.

---

## 2. "Harness": what to upload, and in what format

"Harness" means two different things. **Patrick needs to say which one he means (decision D1).**

**A. Harness.io (the DevOps platform).** Harness ships its AI as a plugin: Harness Skills plus a Harness MCP server.
- Repo layout (https://github.com/harness/harness-ai):
  - `.cursor-plugin/marketplace.json` and `.claude-plugin/marketplace.json` at the root are marketplace manifests listing plugins with `source` paths.
  - `plugins/cursor/` contains `.cursor-plugin/plugin.json`, `skills/<name>/SKILL.md` (+ `references/`, `scripts/`), `rules/*.mdc`, `hooks/hooks.json`, `mcp.json`, `scripts/*.mjs`, and `assets/logo.svg`.
  - `plugins/claude/` contains `.claude-plugin/plugin.json`, `.mcp.json` (`{"mcpServers":{"harness":{"type":"http","url":"https://mcp.harness.io/mcp"}}}`), and `skills/`.
  - `extensions/gemini/` contains `gemini-extension.json`, `GEMINI.md`, and `commands/*.toml`.
- Harness's MCP server is remote over HTTP with OAuth (`https://mcp.harness.io/mcp`), or local via `npx harness-mcp-v2` with `HARNESS_API_KEY`. It exposes 11 consolidated tools (`harness_list/get/create/update/delete/execute/search/describe/schema/diagnose/status`).
- Harness's own AI agents accept MCP servers and "Agent Templates" (`metadata.json` + `pipeline.yaml` v1 + `wiki.MD`), per its `create-agent` and `create-agent-template` skills.
- Docs:
  - https://developer.harness.io/harness-platform/use-harness-ai/core-capabilities/in-your-ide/cursor-plugin
  - https://developer.harness.io/harness-ai/use-harness-ai/connect-with-ai/index (MCP server)
  - https://developer.harness.io/harness-platform/use-harness-ai/connect-with-ai/index/configure-ai-clients
  - https://cursor.com/marketplace/harness (catalog plugin id 8006)
- **If Patrick means Harness.io:** there is no public "upload a third-party skill set into Harness" marketplace. There are two paths. (a) Publish a Cursor/Claude plugin with the same layout Harness uses. (b) Register the SkillCo MCP server inside a Harness AI Agent (the create-agent flow supports MCP server integration) and/or ship Harness Agent Templates.

**B. "Agent harness" in general (Claude Code, Cursor, Codex, Hermes, OpenClaw, Grok Bot…).** The site's "Works with" list suggests this is what he means. The portable format is:
1. **Agent Skills spec** (https://agentskills.io/specification): `skill-name/SKILL.md` with frontmatter `name` (≤64 chars, kebab-case, matching the directory name), `description` (≤1024 chars), and optional `license`, `compatibility`, `metadata`, `allowed-tools`. Optional `scripts/`, `references/`, `assets/`. Keep the body under 500 lines with progressive disclosure. Validate with `skills-ref validate`.
2. **Cursor plugin** (https://cursor.com/docs/reference/plugins, template at https://github.com/cursor/plugin-template, schema at https://raw.githubusercontent.com/cursor/plugins/main/schemas/plugin.schema.json): `.cursor-plugin/plugin.json` (requires `name`; add `displayName`, `version`, `author`, `logo`, `variables`) plus `skills/`, `rules/*.mdc`, `agents/`, `commands/`, `hooks/hooks.json`, `mcp.json`. The open "Agent Plugins" format (root `plugin.json`, skills + MCP only) also loads.
3. **Claude Code plugin** (https://code.claude.com/docs/en/plugins): `.claude-plugin/plugin.json`, `skills/`, `.mcp.json`, and a `.claude-plugin/marketplace.json` for distribution.
4. **MCP server** over Streamable HTTP with OAuth 2.1 (https://modelcontextprotocol.io/specification, authorization section). Every harness can mount it.

**Recommended deliverable that covers both A and B: one repo, `skillco-plugin`, built the way harness-ai is built.**
```
skillco-plugin/
├── .cursor-plugin/marketplace.json      # lists plugins/cursor
├── .claude-plugin/marketplace.json      # lists plugins/claude
├── plugins/
│   ├── cursor/  (.cursor-plugin/plugin.json, skills/, rules/skillco.mdc, mcp.json → https://mcp.skillco.work/mcp)
│   └── claude/  (.claude-plugin/plugin.json, skills/, .mcp.json → same URL)
├── extensions/gemini/ (gemini-extension.json, GEMINI.md)
├── harness/agent-templates/<skill>/ (metadata.json, pipeline.yaml, wiki.MD)   # only if D1 = Harness.io
└── skills/<slug>/SKILL.md (+references/, scripts/, assets/)                 # canonical, Agent Skills spec
```
The dashboard's "Export" button generates this same tree, per user, from their skill library.

---

## 3. Recommended architecture

### Stack (fits what already exists)
| Concern | Choice | Why |
|---|---|---|
| App | Existing `frontend/` **Next.js 16** App Router on Vercel project `skillco` | Already live, branded, and Git-deployed. Add `/sign-in`, `/dashboard/**`, `/api/**` routes. |
| Auth | **Supabase Auth** (Google + GitHub OAuth, plus email magic link) via `@supabase/ssr` | Scaffold already exists in `Product/web-app/src/lib/auth`, and one vendor covers auth + DB + storage + RLS. Alternative: Clerk (nicer UI, extra $). |
| DB | **Supabase Postgres + pgvector** | The schema file exists. Vectors serve the knowledge base. RLS isolates users. |
| File storage | **Supabase Storage** (bucket `skills` for public catalog, `user-skills` private) | The sync script already targets it. Storage quota per plan drives storage add-ons. |
| LLM | **Vercel AI Gateway** + **AI SDK v5/6** (`generateObject` / `streamText`, tool calling) | One key, many models, per-request cost reporting, which feeds token metering. |
| Long jobs | **Vercel Workflow** (durable steps) or Vercel Queues; **Vercel Cron** for refresh | Skill generation and ingest take minutes and must be resumable. |
| Billing | **Stripe Billing**: Checkout + Customer Portal + **Billing Meters** (usage-based) | $5.99 base + metered tokens + storage add-ons in one subscription. |
| MCP server | `mcp.skillco.work`: a Next route using `mcp-handler` (Vercel) or a Cloudflare Worker (Agents SDK `McpAgent`), with OAuth 2.1 via Supabase as the auth server | Lets any harness mount a user's library. |
| Observability | Vercel Observability + a `usage_events` table | Feeds billing reconciliation. |

### Data model (additions to the existing schema)
- `profiles(id → auth.users, plan, stripe_customer_id, storage_bytes, token_balance)`
- `skills(id, owner_id, slug, name, description, visibility[private|public|marketplace], current_version_id, source[generated|imported|catalog], category, tags[])`
- `skill_versions(id, skill_id, semver, manifest jsonb, files jsonb {path→storage key}, lint_report jsonb, created_by_run)`
- `skill_sets(id, owner_id, name, kind[role|process], source_jd_id)` and `skill_set_items`
- `job_descriptions(id, owner_id, file_key, parsed jsonb {responsibilities, tools, kpis})`
- `generation_runs(id, owner_id, input, status, steps jsonb, tokens_in, tokens_out, cost_usd, model)`
- `kb_sources(id, type[doc|x|reddit|blog|github], url, platform, author_handle, vetted bool, trust_score, last_fetched)`
- `kb_chunks(id, source_id, content, embedding vector(1536), platform, topic, published_at, hash)`
- `kb_practices(id, platform, rule, rationale, evidence_chunk_ids[], confidence, superseded_by)`: distilled "best practice" cards
- `vetted_authors(handle, platform, reason, added_by)`
- `connections(id, owner_id, target[claude|cursor|harness|openai|mcp|github], config jsonb)`
- `usage_events(id, owner_id, kind[tokens|storage|export], qty, stripe_meter_event_id, at)`

### Research / ingest pipeline (the "self-updating" brain)
1. **Sources registry.** Per platform (Claude/Anthropic, Cursor, OpenAI/Codex, Gemini, Harness, MCP spec, Vercel, Supabase…), seed the official doc URLs, `llms.txt`, and changelogs. Harness and agentskills.io both publish `llms.txt`.
2. **Doc crawler** (cron, daily). Fetch `llms.txt` and doc pages, diff by content hash, chunk, embed, and upsert into `kb_chunks`.
3. **X ingest** (cron, every 6h). Search recent posts on topics like "agent skills", "SKILL.md", "MCP server", "claude code plugin", and "cursor rules", restricted to the `vetted_authors` list plus engagement thresholds. Production needs Patrick's own **X API key** (the box's `x` connector is fine for prototyping but is not a server backend).
4. **Reddit ingest** (cron, daily). Pull r/ClaudeAI, r/cursor, r/LocalLLaMA, r/AI_Agents, r/mcp, and similar via the **Reddit Data API (OAuth app)**. Commercial use needs Reddit's approval or a paid tier (blocker B4). The fallback is links and summaries only.
5. **Distill step** (LLM). Cluster new chunks by platform and topic, then propose `kb_practices` with evidence links. Anything that contradicts an existing practice gets flagged for admin review. Nothing auto-publishes without passing a confidence threshold.
6. **Admin review queue** in the dashboard: approve or reject practices and add or remove vetted authors.
7. Generation retrieves the top practices plus doc chunks for the target platforms (RAG), and every generated skill cites them in `references/sources.md`.

### Skill generation agent (the core product)
Input: a free-text goal, a job description, or a process doc, plus target platforms. The pipeline is a durable workflow, and each step is visible in the UI:
1. **Intake/clarify.** Extract the job-to-be-done, inputs, outputs, success criteria, and risk level, and ask at most 3 clarifying questions.
2. **Tool and connector discovery.** List every system touched (e.g. HubSpot, Asana, Gmail). For each, look up official MCP servers, plugins, APIs, and auth methods via the KB, the web, and the MCP registry. Output a `references/tools.md` table: tool, purpose, connector options (MCP URL / plugin / API), auth, required scopes, and docs URL.
3. **Plan orchestration.** Produce numbered steps with decision points, tool calls, approval gates for irreversible actions, and failure handling. This becomes the SKILL.md body.
4. **Write the files** (`generateObject` against a strict schema):
   - `SKILL.md` (spec-valid frontmatter + body under 500 lines)
   - `references/*.md` (tools, domain knowledge, sources/citations, examples)
   - `scripts/*` (optional helpers)
   - `assets/*` (templates)
   - `skillco.json` (SkillCo metadata: platforms, connectors, version, KB practice IDs used)
5. **Lint/eval.** Validate the spec (name regex, lengths), check links, run a secret scan, and do a "dry-run" read-through: an LLM judge scores triggerability of the description, step clarity, and missing tools. Auto-fix once.
6. **Package.** Use the export adapters (port of `agent-skills/scripts/build.py`): Agent Skills zip, Cursor plugin, Claude plugin, OpenAI (AGENTS.md / instructions ≤8000 chars), Codex AGENTS.md, Gemini extension, Harness agent template, and an MCP resource.
7. Save a new `skill_version` and meter the tokens.

**Job description → skill set.** Upload a PDF, DOCX, or text file. Parse it into responsibilities, the tools and stack it mentions, KPIs, and recurring processes. Cluster those into 4–10 skills and let the user pick, then run the generator per skill. Output is a `skill_set` with an optional "agent profile" (AGENTS.md / system prompt that routes among the skills).

### Dashboard features
- Library: my skills, versions, diffs, an editor (Monaco) for SKILL.md and references, and visibility toggles.
- Builder: a chat-style wizard with a live step tracker and a file tree preview.
- JD → Skill set upload.
- Connect / Export:
  - one-click zip per platform
  - "Install in Cursor" deeplink and "Add marketplace" for Claude Code (`/plugin marketplace add <repo>`)
  - push to the user's GitHub repo (GitHub OAuth)
  - personal MCP endpoint URL + token
- Catalog: the existing 369 skills become importable into a user's library.
- Billing: plan, usage meter (tokens, storage), add-ons, and the Stripe portal.
- Admin: KB sources, vetted authors, the practice review queue, and a run ledger.

### SkillCo MCP server (`https://mcp.skillco.work/mcp`)
- Tools: `search_skills`, `get_skill` (returns SKILL.md + file list), `get_skill_file`, `list_my_skills`, `generate_skill` (async; returns a run ID), `get_run`, `best_practices(platform, topic)`.
- Resources: `skill://{owner}/{slug}/{path}`.
- Prompts: `build-skill`, `skill-from-jd`.
- Auth: OAuth 2.1 (dynamic client registration) via Supabase, with per-user scoping. Public catalog reads are anonymous.
- This server is what the Harness, Cursor, and Claude plugin `mcp.json` files point at.

### Pricing → Stripe mapping (proposal, needs Patrick's OK)
| Item | Stripe object | Proposal |
|---|---|---|
| Builder plan | Recurring price, $5.99/mo | Includes N generation credits (e.g. 1M tokens ≈ cost basis), 500 MB storage, unlimited private skills, MCP endpoint |
| Token overage | Billing Meter `skillco_tokens` + metered price | e.g. $X per 1M tokens, set at AI Gateway cost × 2–3. Report usage from `generation_runs`. |
| Storage add-on | Recurring add-on, or metered `skillco_storage_gb` | e.g. +5 GB for $2/mo |
| Upgrades | Pro / Team tiers | e.g. Pro $19 (from existing doc; private GitHub sync, more credits), Team per seat |
| Token packs (optional) | One-time Checkout | Prepaid credits |
Docs: https://docs.stripe.com/billing/subscriptions/usage-based, https://docs.stripe.com/billing/subscriptions/usage-based/meters. Webhooks (`checkout.session.completed`, `customer.subscription.*`, `invoice.paid`) update `profiles.plan`. Hard-cap generation when the user has no payment method or a prepaid balance hits 0.

Unit economics warning: at $5.99/mo, a few large generations with a frontier model can exceed the plan's margin. Default to a cheaper model for drafting and a stronger one only for the final write and lint, then meter everything above the included credits.

---

## 4. Phased build plan

### Phase 0: Setup (Patrick + ~0.5 day)
- Decisions D1–D8 below. Create the Supabase project. Create Stripe products and prices, plus API keys (test mode first). Create the Google and GitHub OAuth apps. Enable AI Gateway on team GPTPAT. Run `vercel login` on the box, or keep using the Vercel connector.
- Repo: branch `feat/builder` in diamitani/skillco. Move `Product/web-app` auth helpers into `frontend/lib/auth`. Add env vars in Vercel (Preview first).

### Phase 1: MVP (≈2–3 weeks): "sign in, build a skill, download it, pay $5.99"
1. Supabase Auth with Google + GitHub on the existing site: `/sign-in`, middleware-protected `/dashboard`, and a nav "Sign in" button. Marketing pages stay static and fast.
2. Schema migration for profiles, skills, skill_versions, generation_runs, usage_events, plus RLS.
3. Builder v1: goal in, then the workflow (intake → tool discovery via web search + a static curated platform-docs pack → plan → write → lint), then a SKILL.md + references/tools.md + references/sources.md zip.
4. Exports: Agent Skills zip, Cursor plugin zip, Claude plugin zip (port of `build.py`).
5. Library: list, view, edit SKILL.md, and version history.
6. Stripe: $5.99 Checkout, the Portal, webhooks, a token meter, and an included-credit cap. Storage is quota-enforced only (no add-on purchase yet).
7. KB v0: curated doc snapshots for 6 platforms (Agent Skills spec, Claude Code plugins/skills, Cursor plugins/rules, OpenAI Agents/AGENTS.md, Gemini extensions, MCP spec, Harness plugin) stored as chunks with pgvector, refreshed by a weekly Vercel Cron.

### Phase 2 (≈2 weeks): JD → skill sets + MCP server + plugin
- JD upload (PDF/DOCX parse) → skill-set proposal → batch generation → agent profile.
- `mcp.skillco.work` with OAuth. Publish the `skillco-plugin` repo (Cursor + Claude marketplaces; Harness agent template if D1 = Harness.io). Submit to the Cursor marketplace.
- GitHub push export. Import from the 369-skill catalog.
- Storage add-on and upgrade tiers in Stripe.

### Phase 3 (≈2–3 weeks): self-updating knowledge base
- Daily doc crawler (llms.txt diffing), the X ingest (vetted authors), and the Reddit ingest (once API access is approved).
- Distill step → practice cards → admin review queue. Generation cites practice IDs. A "skill refresh" job flags user skills whose practices changed.

### Phase 4: Marketplace and teams
- Public listing of user-built skills, creator payouts (Stripe Connect, per the existing 70/30 plan), security scanning (existing AWS scan-service stub), and team workspaces.

---

## 5. Decisions / inputs needed from Patrick
- **D1. "Harness":** does he mean Harness.io (the DevOps platform) or agent harnesses in general (Claude Code, Cursor, Codex, Hermes, OpenClaw)? This changes the export targets.
- **D2. Auth vendor:** Supabase Auth (recommended, scaffold exists) or Clerk. OAuth providers: Google + GitHub? Also X?
- **D3. Pricing details:** what does $5.99 include (token credits, storage GB)? Overage rate per 1M tokens, storage add-on price, and upgrade tier names and prices. Note that `docs/16-stripe-integration-plan.md` says Pro is $19/mo.
- **D4. Stripe:** is acct_1UIHuI4DUgvDhOs8 the right account? Patrick needs to provide test and live keys plus a webhook secret (set directly in Vercel; not pasted into chat).
- **D5. Supabase:** use an existing project or create a new one? Its URL, anon key, and service role key go into Vercel env.
- **D6. LLM:** enable Vercel AI Gateway on team GPTPAT, set the default models, and set a monthly spend cap.
- **D7. Data sources:** an X API plan/key for server-side ingest; a Reddit Data API app (commercial-use approval); and the seed list of vetted entrepreneurs and AI engineers.
- **D8. Subdomain:** DNS is at **GoDaddy**. Either add a CNAME for `mcp.skillco.work` (and optionally `app.`) or keep everything under www paths. Patrick needs GoDaddy access, or should move DNS to Vercel or Cloudflare.
- **D9. Which app to build on:** `frontend/` (live, Next 16) is recommended; `Product/web-app` (Next 15) would be retired after its auth code is ported. Also confirm the Vercel project's root directory is `frontend`.

## 6. Blockers / risks
- No env vars on the Vercel project yet, so Stripe and Supabase are fully unconfigured.
- The `vercel` CLI on the box is logged out. The Vercel MCP connector works for team GPTPAT; `user-Vercel-xai` sees no teams.
- The Reddit commercial API terms and the X API cost could limit the "self-updating" feature. The plan degrades to official docs plus manually curated posts.
- Token cost vs the $5.99 price point needs metering and caps from day one.
- Content licensing: store summaries and links for X and Reddit posts, not full reposts.
