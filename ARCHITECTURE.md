# SkillCo Architecture

## Vision
The world's greatest skill library — a marketplace of skills for every area of work and platform. Skills scraped from GitHub, Clawdbot, and other sources, with advanced screening on codebases using AWS protections to flag risky skills and point out vulnerabilities.

## Core Value Propositions
1. **Universal Skill Access** — Discover skills for any platform, tool, or workflow
2. **Security-First** — Every skill screened for vulnerabilities before listing
3. **Creator Economy** — Build and sell skills using PAL (Premium skill builder)
4. **Marketplace Model** — Stripe-powered checkout for skill purchases

---

## Directory Structure

```
skillco/
│
├── Product/                          # Product & Engineering
│   ├── web-app/                      # Next.js 15 web application
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── (public)/         # Public-facing routes
│   │   │   │   │   ├── page.tsx      # Landing/home
│   │   │   │   │   ├── skills/
│   │   │   │   │   │   └── page.tsx  # Skill catalog (browse all)
│   │   │   │   │   ├── pricing/
│   │   │   │   │   │   └── page.tsx  # Pricing tiers
│   │   │   │   │   └── about/
│   │   │   │   │       └── page.tsx  # About SkillCo
│   │   │   │   ├── (auth)/           # Authentication routes
│   │   │   │   │   ├── login/
│   │   │   │   │   ├── signup/
│   │   │   │   │   └── reset-password/
│   │   │   │   ├── (dashboard)/      # Protected user routes
│   │   │   │   │   ├── dashboard/
│   │   │   │   │   ├── settings/
│   │   │   │   │   └── billing/
│   │   │   │   ├── (marketplace)/    # Marketplace features
│   │   │   │   │   ├── marketplace/
│   │   │   │   │   │   └── page.tsx  # Browse marketplace
│   │   │   │   │   ├── skill/[id]/
│   │   │   │   │   │   └── page.tsx  # Skill detail page
│   │   │   │   │   └── download/[id]/
│   │   │   │   │       └── page.tsx  # Download/view gated
│   │   │   │   ├── (creator)/        # PAL skill builder (paid)
│   │   │   │   │   ├── pal/
│   │   │   │   │   │   └── page.tsx  # PAL builder interface
│   │   │   │   │   ├── studio/
│   │   │   │   │   │   └── page.tsx  # Skill creator studio
│   │   │   │   │   └── sales/
│   │   │   │   │       └── page.tsx  # Sales dashboard
│   │   │   │   └── api/              # API routes
│   │   │   │       ├── auth/
│   │   │   │       ├── stripe/
│   │   │   │       ├── skills/
│   │   │   │       └── scan/
│   │   │   ├── components/
│   │   │   │   ├── ui/               # shadcn/ui components
│   │   │   │   ├── marketplace/      # Marketplace-specific
│   │   │   │   ├── pal/              # PAL builder components
│   │   │   │   └── auth/
│   │   │   ├── lib/
│   │   │   │   ├── db/               # Database (Supabase)
│   │   │   │   ├── auth/             # Auth helpers
│   │   │   │   ├── stripe/           # Stripe integration
│   │   │   │   ├── scan/             # Security scanning
│   │   │   │   └── utils/
│   │   │   └── types/
│   │   ├── public/
│   │   ├── next.config.js
│   │   ├── package.json
│   │   └── tailwind.config.ts
│   │
│   ├── marketplace/                    # Skills Repository
│   │   ├── catalog/                  # Curated skill listings
│   │   │   ├── index.json            # Master catalog
│   │   │   └── categories/           # By category
│   │   ├── skills/                   # Actual skill files
│   │   │   ├── [vendor]/
│   │   │   │   └── [skill-name]/
│   │   │   │       ├── skill.json    # Metadata
│   │   │   │       ├── README.md
│   │   │   │       └── src/          # Skill source
│   │   ├── security/                 # Security scan results
│   │   │   └── reports/
│   │   └── sources/                  # Scraping sources
│   │       ├── github/
│   │       ├── clawdbot/
│   │       └── manual/
│   │
│   ├── pal/                          # PAL Skill Builder
│   │   ├── engine/                   # PAL generation engine
│   │   ├── templates/                # Skill templates
│   │   └── validators/               # Output validation
│   │
│   ├── infrastructure/               # AWS / Infra
│   │   ├── cdk/                      # AWS CDK stacks
│   │   │   ├── scan-service/         # Code security scanning
│   │   │   ├── scraper-service/      # GitHub/scraper workers
│   │   │   └── storage/              # S3, RDS, etc.
│   │   └── terraform/
│   │
│   └── docs/                         # Product documentation
│
├── Strategy/                         # Business Strategy
│   ├── vision/
│   ├── positioning/
│   ├── roadmap/
│   └── competitive/
│
├── Operations/                       # Business Operations
│   ├── processes/
│   ├── playbooks/
│   ├── legal/
│   └── compliance/
│
├── Finance/                          # Financial Planning
│   ├── models/
│   ├── projections/
│   └── fundraising/
│
├── Marketing/                        # Marketing & Growth
│   ├── brand/
│   ├── content/
│   ├── campaigns/
│   └── partnerships/
│
├── Agents/                           # ROSTR Agent Teams
│   ├── AGENT-TEAMS.md
│   └── configs/
│
└── README.md                         # Root readme
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 15 (App Router), React 19, TypeScript |
| **Styling** | Tailwind CSS 4, shadcn/ui |
| **Auth** | Supabase Auth (magic link + OAuth) |
| **Database** | Supabase PostgreSQL |
| **Payments** | Stripe (Checkout + Connect for marketplace) |
| **Storage** | AWS S3 (skill files), Vercel Edge (assets) |
| **Security Scanning** | AWS Lambda + CodeGuru + Custom rules |
| **Scraping** | AWS Lambda + EventBridge (scheduled) |
| **Search** | Algolia or Meilisearch |
| **AI/LLM** | OpenAI/Anthropic for PAL skill builder |
| **Hosting** | Vercel |
| **Monitoring** | Vercel Analytics, Sentry |

---

## Data Models

### User
```typescript
interface User {
  id: string;
  email: string;
  role: 'visitor' | 'member' | 'creator' | 'admin';
  subscription_tier: 'free' | 'pro' | 'enterprise';
  stripe_customer_id?: string;
  created_at: Date;
  last_active: Date;
}
```

### Skill
```typescript
interface Skill {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string[];
  tags: string[];
  
  // Source
  source: 'github' | 'clawdbot' | 'manual' | 'pal';
  source_url?: string;
  
  // Ownership
  author_id?: string;  // null for scraped, set for PAL-created
  vendor: string;
  
  // Security
  security_scan_id: string;
  risk_level: 'safe' | 'low' | 'medium' | 'high' | 'critical';
  vulnerabilities: Vulnerability[];
  
  // Marketplace
  price: number;  // 0 for free
  currency: string;
  is_published: boolean;
  download_count: number;
  rating: number;
  review_count: number;
  
  // Files
  download_url: string;
  readme_url: string;
  
  created_at: Date;
  updated_at: Date;
}
```

### Security Scan
```typescript
interface SecurityScan {
  id: string;
  skill_id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  
  // Findings
  findings: {
    severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
    rule: string;
    message: string;
    file?: string;
    line?: number;
  }[];
  
  // Summary
  summary: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    info: number;
  };
  
  // AWS specific
  codeguru_arn?: string;
  inspector_arn?: string;
  
  scanned_at: Date;
}
```

### Purchase
```typescript
interface Purchase {
  id: string;
  user_id: string;
  skill_id: string;
  
  // Payment
  stripe_payment_intent_id: string;
  amount: number;
  currency: string;
  
  // Marketplace split
  platform_fee: number;
  creator_payout: number;
  
  status: 'pending' | 'completed' | 'refunded';
  purchased_at: Date;
}
```

---

## Key Features

### 1. Skill Discovery (Public)
- Browse all skills without login
- Category/filter navigation
- Search with autocomplete
- Preview skill README and metadata
- See security ratings

### 2. Access Control (Gated)
- **Free skills**: Sign in to download
- **Paid skills**: Purchase via Stripe Checkout
- **View source**: Always visible for transparency
- **Download**: Requires auth + purchase (if paid)

### 3. Security Scanning (AWS)
- Automated scan on skill ingestion
- Static analysis with CodeGuru
- Dependency vulnerability checks
- Custom rule engine for AI-generated code
- Clear risk badges on listings

### 4. PAL Skill Builder (Paid Feature)
- Natural language skill generation
- Template library for common patterns
- Built-in validation and testing
- One-click publish to marketplace
- Revenue share for creators (70/30 split)

### 5. Creator Dashboard
- Sales analytics
- Payout management (Stripe Connect)
- Skill management (edit, deprecate)
- Review responses

---

## Authentication Flow

1. **Visitors**: Browse catalog, view skill details, see previews
2. **Sign Up**: Magic link or OAuth (GitHub, Google)
3. **Free Tier**: Download free skills, save favorites
4. **Pro Tier** ($19/mo): Unlimited downloads, PAL access, priority support
5. **Enterprise** (custom): SSO, private skill repos, custom scanning

---

## Security Scanning Architecture

```
Skill Uploaded
    ↓
S3 Trigger → Lambda
    ↓
┌─────────────────────────────────────┐
│  Security Pipeline                  │
│  1. Dependency check (Snyk/OWASP)   │
│  2. Static analysis (CodeGuru)        │
│  3. Secret detection (custom)       │
│  4. AI code patterns (custom rules) │
└─────────────────────────────────────┘
    ↓
Scan Report → Database
    ↓
Risk Score Calculated
    ↓
Skill Published (or quarantined)
```

---

## PAL Skill Builder Flow

```
User Input (natural language)
    ↓
PAL Engine (LLM + templates)
    ↓
┌─────────────────────────────────────┐
│  Generation Pipeline                │
│  1. Intent parsing                  │
│  2. Template selection              │
│  3. Code generation                 │
│  4. Documentation generation        │
└─────────────────────────────────────┘
    ↓
Auto-validate
    ↓
Security Scan
    ↓
Preview → Publish → Marketplace
```

---

## Revenue Model

| Component | Model |
|-----------|-------|
| **Pro Subscription** | $19/month (unlimited downloads, PAL access) |
| **Skill Sales** | 70% to creator, 30% platform |
| **Enterprise** | Custom (private marketplace, SSO, custom scanning) |
| **Free Tier** | Limited downloads, no PAL, public skills only |

---

## Development Phases

### Phase 1: Foundation (Week 1-2)
- [ ] Directory structure setup
- [ ] Next.js scaffold with auth
- [ ] Supabase schema
- [ ] Basic skill catalog

### Phase 2: Marketplace Core (Week 3-4)
- [ ] Skill detail pages
- [ ] Stripe checkout integration
- [ ] Download gating
- [ ] Search/filter

### Phase 3: Security (Week 5-6)
- [ ] AWS scanning infrastructure
- [ ] Risk scoring UI
- [ ] Vulnerability reporting

### Phase 4: PAL Builder (Week 7-8)
- [ ] LLM integration
- [ ] Template system
- [ ] Creator dashboard
- [ ] Stripe Connect

### Phase 5: Scale (Week 9+)
- [ ] Scraping automation
- [ ] Advanced search
- [ ] Analytics
- [ ] Enterprise features

---

## Success Metrics

- **MAU**: Monthly active users
- **Skill Count**: Total skills in marketplace
- **Security Coverage**: % of skills scanned
- **Creator Revenue**: Monthly payouts
- **PAL Usage**: Skills generated per week
- **Conversion Rate**: Free → Paid

---

*Last updated: 2026-07-28*
