# SkillCo web app

Next.js 16 app for skillco.work: landing page and the skill catalog.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm run lint
```

- Design system and brand wiring: [`DESIGN-SYSTEM.md`](./DESIGN-SYSTEM.md)
- Skill data is generated into `lib/skills.ts` by `scripts/generate-skills-lib.py`. Do not edit that file by hand.
- Downloads are static zips in `public/downloads/`.
