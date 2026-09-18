---
name: skillco
description: >
  A marketplace of skills for every area of work and platform. Skills scraped from GitHub, Clawdbot, and other sources, with advanced AWS-powered security screening to flag risky code and vulnerabilities. - **Universal Skill Discovery**: Browse skills for any platform, tool, or workflow Use this skill when working with skillco tasks or workflows.
---

# SkillCo

## The World's Greatest Skill Library

A marketplace of skills for every area of work and platform. Skills scraped from GitHub, Clawdbot, and other sources, with advanced AWS-powered security screening to flag risky code and vulnerabilities.

## 🚀 Features

- **Universal Skill Discovery**: Browse skills for any platform, tool, or workflow
- **Security-First**: Every skill automatically scanned for vulnerabilities
- **Creator Economy**: Build and sell skills with 70% revenue share
- **PAL Skill Builder**: AI-powered skill generation for Pro users
- **Stripe Marketplace**: Secure payments and creator payouts

## 📁 Repository Structure

```
skillco/
│
├── Product/                  # Product & Engineering
│   ├── web-app/            # Next.js 15 web application
│   ├── marketplace/        # Skills repository & catalog
│   ├── pal/                  # PAL skill builder engine
│   ├── infrastructure/       # AWS CDK, Terraform
│   └── docs/                 # Product documentation
│
├── Strategy/                 # Business strategy
│   ├── vision/
│   ├── positioning/
│   ├── roadmap/
│   └── competitive/
│
├── Operations/               # Business operations
│   ├── processes/
│   ├── playbooks/
│   ├── legal/
│   └── compliance/
│
├── Finance/                  # Financial planning
│   ├── models/
│   ├── projections/
│   └── fundraising/
│
├── Marketing/                # Marketing & growth
│   ├── brand/
│   ├── content/
│   ├── campaigns/
│   └── partnerships/
│
├── Agents/                   # ROSTR Agent teams
│   ├── AGENT-TEAMS.md
│   └── configs/
│
├── ARCHITECTURE.md           # Full system architecture
└── README.md                 # This file
```

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 15, React 19, TypeScript, Tailwind CSS 4 |
| **Auth** | Supabase Auth |
| **Database** | Supabase PostgreSQL |
| **Payments** | Stripe (Checkout + Connect) |
| **Storage** | AWS S3 |
| **Security Scanning** | AWS Lambda + CodeGuru |
| **AI/LLM** | OpenAI/Anthropic for PAL |
| **Hosting** | Vercel |

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- npm or pnpm
- Supabase account
- Stripe account
- AWS account (for security scanning)

### Installation

```bash
# Clone repository
git clone https://github.com/skillco/skillco.git
cd skillco

# Install dependencies
cd Product/web-app
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Run dev server
npm run dev
```

Visit http://localhost:3000

## 🔐 Security Scanning

Every skill uploaded to SkillCo undergoes automated security scanning:

1. **Dependency Analysis**: Checks for known vulnerabilities
2. **Static Analysis**: CodeGuru-powered code review
3. **Secret Detection**: Scans for API keys, tokens, passwords
4. **AI Pattern Analysis**: Detects hallucinated or unsafe code

See `Product/infrastructure/cdk/scan-service/` for implementation details.

## 💳 Payments

- **Free Skills**: Require sign-in to download
- **Paid Skills**: Stripe Checkout integration
- **Creator Payouts**: Stripe Connect (70% to creator, 30% platform)

## 🤖 PAL Skill Builder

Pro users ($19/month) get access to PAL (Prompt-Augmented Library):

- Natural language skill generation
- Automatic documentation
- Built-in security scanning
- One-click marketplace publishing

## 📊 Database Schema

See `Product/infrastructure/supabase-schema.sql` for complete schema.

Key tables:
- `users` - User accounts and subscriptions
- `skills` - Skill listings with metadata
- `security_scans` - Scan results and findings
- `purchases` - Transaction records
- `reviews` - User reviews and ratings

## 🏗️ Architecture

See `ARCHITECTURE.md` for comprehensive system design including:

- Directory structure
- Data models
- API design
- Security scanning pipeline
- PAL skill builder flow
- Revenue model

## 👥 Team

SkillCo is built by a distributed team using ROSTR agent teams. See `Agents/AGENT-TEAMS.md` for team structure.

## 📄 License

Proprietary — SkillCo Inc.

## 🔗 Links

- **Live**: https://skillco.work
- **Docs**: https://docs.skillco.work
- **Blog**: https://blog.skillco.work
- **Twitter**: https://twitter.com/skillco

---

Built with ❤️ by the SkillCo team
