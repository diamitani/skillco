# Skillco — Site Spec
> Compiled by site-builder skill — 2026-07-28

## 1. Intent

```yaml
product: |
  Skillco is a marketplace and agent platform for building, discovering, and deploying AI skills. 
  Users can browse pre-built skills for Claude, Codex, Hermes, and OpenClaw agents, 
  or create custom skills using the skill-builder framework.
audience: |
  Developers, AI engineers, product teams, and knowledge workers who want to incorporate 
  AI capabilities into their workflows without building from scratch. Both technical (building skills) 
  and non-technical (consuming skills) users.
primary_action: Browse the marketplace
tier: marketing | hybrid (marketplace + builder tool)
revenue_model: freemium | paid skill tiers | enterprise licensing
brand: [BRAND TBD - needs full identity system]
references: 
  - https://linear.app (dark-tech minimalism)
  - https://vercel.com (developer-focused clarity)
  - https://claude.ai (premium AI aesthetic)
constraints: 
  - Modern React + Tailwind stack
  - Must work in both light/dark modes
  - Emphasis on browsing and discovery
```

## 2. Archetype

**Marketplace + Tool Hybrid**

Skillco sits at the intersection of a SaaS marketing site and a functional marketplace. The primary flow is discovery (browse skills) but the underlying product includes a builder tool for creating custom skills.

**Page Set:**
- Home (discovery landing)
- Marketplace (browse/filter skills catalog)
- Skill Detail (individual skill page)
- Builder (create custom skills)
- Pricing
- Docs
- About

## 3. Sitemap

| Page | Primary CTA | Secondary Actions |
|------|-------------|-------------------|
| **Home** | Browse skills | Create custom skill, View docs |
| **Marketplace** | Install skill | Preview skill, View source |
| **Skill Detail** | Install/Activate | View docs, See related skills |
| **Builder** | Start building | Browse templates, Import existing |
| **Pricing** | Choose tier | Contact sales (enterprise) |

## 4. Page Specs

### Homepage

```yaml
page: Homepage
sections:
  - id: nav
    purpose: brand + primary nav + CTA
    components: [logo, nav-links, primary-cta]
    
  - id: hero
    purpose: State value prop in ≤8 words, drive to marketplace
    components: 
      - eyebrow: "AI SKILLS MARKETPLACE"
      - headline: "Skills for every agent"
      - subheadline: "Browse, build, and deploy AI skills for Claude, Codex, Hermes, and OpenClaw. From code generation to data analysis—get more from your agents."
      - primary-cta: "Browse marketplace"
      - secondary-cta: "Create a skill"
      - hero-visual: marketplace preview / skills grid
      
  - id: skills-showcase
    purpose: Immediate proof of value—show real skills
    components: 
      - section-heading: "Popular skills"
      - skill-cards: 6 featured skills with icons, descriptions, install counts
      - filter-tabs: By platform (All | Claude | Codex | Hermes | OpenClaw)
      
  - id: how-it-works
    purpose: Simple 3-step process explanation
    components:
      - section-heading: "How it works"
      - step-cards:
          1. "Browse" - Search skills by category, platform, or use case
          2. "Install" - One-click add to your agent workspace
          3. "Deploy" - Use instantly or customize for your needs
          
  - id: platforms
    purpose: Show supported agent platforms
    components:
      - section-heading: "Works with your agents"
      - platform-logos: Claude, Codex, Hermes, OpenClaw
      - platform-cards: Brief description per platform
      
  - id: featured-makers
    purpose: Social proof—show community/verified creators
    components:
      - section-heading: "Made by builders"
      - maker-profiles: 3-4 featured skill creators
      - stats: "X skills • Y creators • Z installs"
      
  - id: cta
    purpose: Final conversion push
    components:
      - headline: "Start building smarter"
      - subheadline: "Join developers using skills to ship faster"
      - primary-cta: "Browse free skills"
      - secondary-cta: "Read docs"
      
  - id: footer
    purpose: Nav + legal + community links
    components: [footer-nav, social-links, legal-links, newsletter]
```

### Marketplace Page

```yaml
page: Marketplace
sections:
  - id: nav (same as homepage)
  
  - id: marketplace-header
    purpose: Clear search + filter interface
    components:
      - headline: "Browse skills"
      - subheadline: "Find the perfect skill for your agent"
      - search-bar: Full-text search
      - filter-chips: Platform, Category, Sort, Price
      
  - id: skills-grid
    purpose: Main browseable catalog
    components:
      - skill-cards-grid: Responsive grid of skill cards
      - card-components:
          - skill-icon
          - skill-name
          - description (2 lines max)
          - platform-badge
          - install-count
          - rating
          - price (free/paid)
      - pagination/infinite-scroll
      
  - id: categories-sidebar
    purpose: Browse by category
    components:
      - category-list: Code, Writing, Data, Design, Research, etc.
      - trending-tags: Popular search terms
```

## 5. Brand Application

### Color Tokens (Dark Mode Default)

```yaml
background: 
  primary: "#0a0a0a"      # near-black
  secondary: "#111111"   # card backgrounds
  tertiary: "#1a1a1a"    # elevated surfaces
  
surface:
  default: "#111111"
  elevated: "#1a1a1a"
  hover: "#222222"
  
text:
  primary: "#fafafa"     # off-white
  secondary: "#a1a1aa"   # muted gray
  tertiary: "#71717a"    # very muted
  
accent:
  primary: "#6366f1"     # indigo-500 (vibrant but not neon)
  hover: "#4f46e5"       # indigo-600
  muted: "#312e81"       # indigo-900
  
border:
  default: "#27272a"     # zinc-800
  hover: "#3f3f46"       # zinc-700
```

### Typography

```yaml
font-family:
  display: "Geist" or "Inter" (fallback)
  mono: "Geist Mono" or "JetBrains Mono" (for code snippets)
  
scale:
  display: "text-5xl md:text-6xl lg:text-7xl"
  h1: "text-4xl md:text-5xl"
  h2: "text-3xl md:text-4xl"
  h3: "text-xl md:text-2xl"
  body: "text-base"
  small: "text-sm"
  xs: "text-xs"
  
weights:
  display: 600
  heading: 500
  body: 400
  
line-height:
  display: 1.1
  heading: 1.2
  body: 1.6
```

### Spacing

```yaml
section-padding: "py-24 md:py-32"
container: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
component-gap: "gap-6"
card-padding: "p-6"
```

## 6. Build Plan

### Stack
- **Framework:** Next.js 14+ App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui (Radix-based)
- **Animation:** Motion (Framer Motion successor)
- **Icons:** Phosphor Icons
- **Fonts:** Geist (Vercel font)

### Project Structure

```
skillco/
├── app/
│   ├── page.tsx              # Homepage
│   ├── marketplace/
│   │   └── page.tsx          # Marketplace browse
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Tailwind + custom tokens
│   └── sections/
│       ├── Hero.tsx
│       ├── SkillsShowcase.tsx
│       ├── HowItWorks.tsx
│       ├── Platforms.tsx
│       ├── FeaturedMakers.tsx
│       ├── FinalCTA.tsx
│       └── Footer.tsx
├── components/
│   ├── ui/                   # shadcn components
│   ├── SkillCard.tsx
│   ├── Nav.tsx
│   ├── FilterBar.tsx
│   └── PlatformBadge.tsx
├── lib/
│   ├── utils.ts
│   └── data.ts               # Mock skills data
└── public/
    └── images/               # Generated assets
```

### Component List

**shadcn/ui to install:**
- button
- card
- badge
- input
- tabs
- dropdown-menu
- separator
- skeleton (for loading states)

### 3-Day Sprint

**Day 1: Foundation**
- [ ] Initialize Next.js project with Tailwind
- [ ] Install shadcn/ui components
- [ ] Set up dark mode tokens
- [ ] Generate hero and section images
- [ ] Build Nav component
-
**Day 2: Homepage**
- [ ] Hero section
- [ ] Skills showcase section
- [ ] How it works section
- [ ] Platforms section
- [ ] Featured makers section
- [ ] Footer

**Day 3: Marketplace + Polish**
- [ ] Marketplace page layout
- [ ] Skills grid with filtering
- [ ] Skill card components
- [ ] Mobile responsiveness
- [ ] Animation polish
- [ ] Performance optimization

## 7. Open Questions

1. **Logo:** Need to design/create a Skillco logo or use wordmark
2. **Skill Data:** Mock data is fine for MVP, but structure should support real API
3. **Auth:** Defer to Phase 2, use placeholder buttons for now
4. **Search:** Client-side filtering for MVP, algolia/elastic for scale
5. **Payment:** Stripe integration deferred, show "coming soon" for paid skills

## 8. Copy Document

### Homepage Copy

**Hero:**
- Eyebrow: "AI SKILLS MARKETPLACE"
- Headline: "Skills for every agent"
- Subheadline: "Browse, build, and deploy AI skills for Claude, Codex, Hermes, and OpenClaw. From code generation to data analysis—get more from your agents."
- CTA Primary: "Browse marketplace"
- CTA Secondary: "Create a skill"

**Skills Showcase:**
- Heading: "Popular skills"
- Filter tabs: "All", "Claude", "Codex", "Hermes", "OpenClaw"

**How It Works:**
- Heading: "How it works"
- Step 1: "Browse" — "Search skills by category, platform, or use case. Filter by what matters to you."
- Step 2: "Install" — "One-click add to your agent workspace. No setup required."
- Step 3: "Deploy" — "Use instantly or customize for your specific needs."

**Platforms:**
- Heading: "Works with your agents"
- Claude: "Anthropic's Claude—advanced reasoning and analysis"
- Codex: "OpenAI Codex—powerful code generation"
- Hermes: "Nous Research Hermes—open-source flexibility"
- OpenClaw: "OpenClaw—local-first agent framework"

**Featured Makers:**
- Heading: "Made by builders"
- Stats: "100+ skills • 50+ creators • 10K+ installs"

**Final CTA:**
- Heading: "Start building smarter"
- Subheadline: "Join developers using skills to ship faster"
- CTA: "Browse free skills"

### Marketplace Page Copy

**Header:**
- Headline: "Browse skills"
- Subheadline: "Find the perfect skill for your agent"
- Placeholder: "Search skills..."

**Filters:**
- Platform: "All platforms", "Claude", "Codex", "Hermes", "OpenClaw"
- Category: "Code", "Writing", "Data", "Design", "Research", "Integration"
- Sort: "Popular", "Newest", "Rating"
- Price: "All", "Free", "Paid"

---

*End of spec. Ready for build phase.*
