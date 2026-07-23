# SkillCo

Turn skills into companies. Develop it, design it, ship it, run it — one platform.

## Directory Structure

```
skillco/
├── app/                    # Next.js 15 web application
│   ├── src/
│   │   ├── app/           # App router pages
│   │   ├── components/    # React components
│   │   └── lib/           # Utilities and hooks
│   └── public/            # Static assets
│
├── business/              # Business documentation
│   ├── branding/          # Brand identity, design tokens
│   ├── prd/               # Product requirements
│   └── canvas/            # Business model canvas
│
├── agents/                # Agent team architecture
│   └── AGENT-TEAMS.md     # Team templates and config
│
└── docs/                  # Additional documentation
```

## Quick Start

```bash
cd app
npm install
npm run dev
```

Visit http://localhost:3000

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS 4
- **UI:** Radix UI + custom components
- **Auth:** Supabase
- **Payments:** Stripe
- **Agents:** ROSTR Framework
- **Hosting:** Vercel

## Links

- **Live:** https://skillco.work
- **Docs:** /docs
- **Brand:** /business/branding/BRAND.md
- **PRD:** /business/prd/PRD.md

## License

Proprietary — SkillCo Inc.
