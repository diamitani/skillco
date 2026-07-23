# SkillCo Product Requirements Document

## Executive Summary

SkillCo is a platform that transforms individual skills into productized companies. Users develop a skill, design it into a web app, publish it to a marketplace, and get an AI agent team to operate it — all in one integrated process.

**Domain:** skillco.work

**Target Launch:** Q4 2026

---

## Problem Statement

### The Problem
Individual experts (developers, consultants, creators) have valuable skills but face massive friction turning them into products:

1. **Design barrier:** Building a polished product requires design skills most don't have
2. **Development barrier:** Even with code skills, shipping production apps is hard
3. **Operations barrier:** Running a product business requires marketing, support, billing
4. **Scale barrier:** As demand grows, individuals can't keep up

### Current Solutions
- **No-code tools (Bubble, Webflow):** Good for building, bad for running businesses
- **Marketplaces (Gumroad, Lemon Squeezy):** Good for selling, don't help build
- **Agency services:** Expensive, slow, not scalable
- **DIY:** Requires full-stack skills most don't have

### Why Now
- AI can now generate quality UI/UX
- Agent systems can run business operations autonomously
- Creator economy has trained people to think "productize my expertise"
- No-code exhaustion: people want something that actually ships

---

## Solution

### Elevator Pitch
SkillCo is the platform where you turn your skill into a company. Develop it, design it, ship it, run it — one process, handled.

### Core Value Prop
**For skill creators:** Turn your expertise into a working product with an AI team running it, without learning design, devops, or business operations.

**For skill consumers:** The App Store for work — thousands of specialized tools built by experts, not generic SaaS.

---

## Scope

### ✅ IN SCOPE (v1)

**Skill Builder:**
- [ ] Skill definition interface (describe what the skill does)
- [ ] Automatic web app generation from skill definition
- [ ] Design system application (all skills look premium)
- [ ] Preview and iteration workflow
- [ ] One-click deployment to [skill].skillco.work

**Marketplace:**
- [ ] Browse/search published skills
- [ ] Skill detail pages with screenshots, pricing, reviews
- [ ] Purchase flow (one-time or subscription)
- [ ] Creator dashboard (earnings, analytics)

**Agent Teams:**
- [ ] Pre-configured agent team templates (support, marketing, ops)
- [ ] Agent assignment to skill products
- [ ] Basic agent monitoring dashboard

**Auth & Billing:**
- [ ] User accounts (creators and consumers)
- [ ] Creator subscription tiers (Free/Pro/Business)
- [ ] Stripe integration for skill purchases
- [ ] Creator payout system

### ❌ OUT OF SCOPE (v1)

- Mobile apps (web only)
- Custom agent training (use pre-built configs)
- Enterprise SSO/SAML
- White-label deployments
- API for external integrations
- Multi-language support

---

## User Stories

### Epic 1: Skill Creation

**US-1.1: Define a Skill**
> As a skill creator, I want to describe my skill in natural language so that the platform understands what to build.

Acceptance Criteria:
- [ ] Given I'm logged in as a creator, when I click "New Skill", then I see a skill definition wizard
- [ ] Given I describe my skill, when I submit, then the system generates a skill specification
- [ ] Given a skill spec, when I review, then I can edit and refine before generation

**US-1.2: Generate Web App**
> As a skill creator, I want the platform to generate a web app from my skill definition so I don't need design/dev skills.

Acceptance Criteria:
- [ ] Given a skill spec, when I click "Generate", then a web app is created within 60 seconds
- [ ] Given a generated app, when I preview, then it renders with the SkillCo design system
- [ ] Given I don't like the result, when I provide feedback, then the system regenerates

**US-1.3: Deploy Skill**
> As a skill creator, I want to publish my skill with one click so it's immediately available.

Acceptance Criteria:
- [ ] Given a finalized skill app, when I click "Publish", then it deploys to [skill-name].skillco.work
- [ ] Given deployment, when I visit the URL, then the skill is live and functional
- [ ] Given I want to update, when I make changes and republish, then the live version updates

### Epic 2: Marketplace

**US-2.1: Browse Skills**
> As a skill consumer, I want to browse available skills so I can find tools for my needs.

Acceptance Criteria:
- [ ] Given I visit skillco.work, when I click "Marketplace", then I see a grid of available skills
- [ ] Given the marketplace, when I search or filter by category, then results update in real-time
- [ ] Given I click a skill card, when the detail page loads, then I see description, screenshots, pricing, reviews

**US-2.2: Purchase Skill**
> As a skill consumer, I want to purchase access to a skill so I can use it.

Acceptance Criteria:
- [ ] Given a skill detail page, when I click "Get Access", then I see pricing options
- [ ] Given I select a plan, when I complete Stripe checkout, then I have immediate access
- [ ] Given a subscription skill, when my subscription renews, then I retain access

### Epic 3: Agent Teams

**US-3.1: Assign Agent Team**
> As a skill creator, I want to assign an agent team to my skill so operations run automatically.

Acceptance Criteria:
- [ ] Given I have a published skill, when I click "Add Agent Team", then I see available team templates
- [ ] Given I select a template (e.g., "Support Team"), when I confirm, then agents are assigned
- [ ] Given agents are assigned, when a user contacts support, then the agent responds

**US-3.2: Monitor Agents**
> As a skill creator, I want to see what my agent team is doing so I maintain oversight.

Acceptance Criteria:
- [ ] Given agents are active, when I view the dashboard, then I see recent agent actions
- [ ] Given an agent action, when I click it, then I see full details and can override if needed

---

## Technical Requirements

### Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 15 (App Router), React 19, Tailwind CSS 4 |
| **Backend** | Next.js API Routes + FastAPI for agent orchestration |
| **Database** | Supabase (Postgres + Auth + Storage) |
| **Hosting** | Vercel (main) + dynamic subdomain routing |
| **AI** | OpenAI GPT-4o / Anthropic Claude for generation |
| **Agents** | ROSTR framework (PAL, NPAO, RAG DAL) |
| **Payments** | Stripe (subscriptions + marketplace) |

### Performance Requirements

- Page load: < 2s (LCP)
- Skill generation: < 60s
- Deployment: < 30s
- API response: < 500ms p95

### Security Requirements

- Auth: Supabase Auth with email/password + social
- Creator verification for payouts
- Rate limiting on generation APIs
- Content moderation on skill descriptions

---

## Design Requirements

### Design System
Apply the SkillCo brand (see `/business/branding/BRAND.md`):
- Dark theme default (Midnight background)
- Electric Violet accent
- Plus Jakarta Sans + Clash Display typography
- Phosphor Light icons
- Double-bezel card architecture
- Custom cubic-bezier animations

### Key Pages

1. **Landing (/):** Hero, features, marketplace preview, CTAs
2. **Marketplace (/marketplace):** Grid of skills, search, filters
3. **Skill Detail (/skill/[slug]):** Description, screenshots, pricing, reviews
4. **Creator Dashboard (/dashboard):** My skills, earnings, agent teams
5. **Skill Builder (/build):** Wizard for creating skills
6. **Pricing (/pricing):** Creator subscription tiers

### Key Flows

1. **Skill Creation Flow:** Define → Generate → Preview → Iterate → Publish
2. **Purchase Flow:** Browse → Detail → Checkout → Access
3. **Agent Setup Flow:** Select Template → Configure → Activate → Monitor

---

## Success Metrics

### North Star Metric
**Skills Published per Month** — measures both creator engagement and product value

### Supporting Metrics

| Metric | Baseline | Target (6mo) |
|--------|----------|--------------|
| Monthly Active Creators | 0 | 500 |
| Skills Published | 0 | 200 |
| Marketplace GMV | $0 | $50k/mo |
| Creator NPS | - | 50+ |
| Skill Generation Success Rate | - | 85% |

---

## Roadmap

### Phase 1: Foundation (Weeks 1-3)
- [ ] Core app structure (Next.js + Supabase)
- [ ] Auth system (signup, login, dashboard shell)
- [ ] Design system implementation
- [ ] Landing page live at skillco.work

### Phase 2: Builder (Weeks 4-6)
- [ ] Skill definition wizard
- [ ] AI generation pipeline
- [ ] Preview system
- [ ] Deployment to subdomains

### Phase 3: Marketplace (Weeks 7-8)
- [ ] Skill listing pages
- [ ] Search and filters
- [ ] Stripe integration for purchases
- [ ] Creator payout system

### Phase 4: Agents (Weeks 9-10)
- [ ] Agent team templates
- [ ] Assignment system
- [ ] Monitoring dashboard

### Phase 5: Polish & Launch (Weeks 11-12)
- [ ] Performance optimization
- [ ] Bug fixes
- [ ] Documentation
- [ ] Product Hunt launch

---

## Appendix

### Glossary

- **Skill:** A defined capability that can be turned into a product
- **Skill Product:** The deployed web app generated from a skill
- **Agent Team:** A configured group of AI agents assigned to run operations
- **Creator:** A user who builds and publishes skills
- **Consumer:** A user who purchases and uses skills

### Competitors

| Competitor | Positioning | SkillCo Differentiator |
|------------|-------------|----------------------|
| Gumroad | Sell digital products | We also build them |
| Bubble | Build no-code apps | We generate, they're manual |
| Vercel | Deploy apps | We create the app to deploy |
| Relevance AI | Build AI agents | We're full-stack including product |

---

**Document Version:** 1.0  
**Last Updated:** 2026-07-23  
**Owner:** Pat Diamitani
