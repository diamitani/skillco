# SkillCo Agent Team Architecture

## Overview

Every skill product on SkillCo can be assigned an AI agent team to handle operations. This is the "startup team skill" applied to every skill creator — giving them a full team without hiring.

---

## Agent Team Templates

### 1. Support Team

**Purpose:** Handle customer inquiries, troubleshoot issues, gather feedback.

**Agents:**
| Agent | Role | Capabilities |
|-------|------|--------------|
| **Triage Agent** | First responder | Classify inquiries, route to specialist, handle FAQs |
| **Technical Agent** | Problem solver | Debug issues, provide workarounds, escalate bugs |
| **Feedback Agent** | Voice of customer | Collect feedback, identify patterns, report insights |

**Triggers:**
- New support ticket → Triage Agent
- Technical keyword detected → Technical Agent
- "Feature request" or "suggestion" → Feedback Agent

---

### 2. Marketing Team

**Purpose:** Drive awareness, create content, manage social presence.

**Agents:**
| Agent | Role | Capabilities |
|-------|------|--------------|
| **Content Agent** | Writer | Create blog posts, social content, email campaigns |
| **Distribution Agent** | Amplifier | Post to channels, schedule content, engage responses |
| **Analytics Agent** | Measurer | Track metrics, report performance, suggest optimizations |

**Triggers:**
- Weekly schedule → Content Agent creates batch
- Content approved → Distribution Agent publishes
- End of week → Analytics Agent reports

---

### 3. Ops Team

**Purpose:** Keep the skill product running smoothly.

**Agents:**
| Agent | Role | Capabilities |
|-------|------|--------------|
| **Monitor Agent** | Watchdog | Check uptime, alert on issues, track performance |
| **Billing Agent** | Money handler | Process payments, handle refunds, revenue reports |
| **Admin Agent** | Coordinator | User management, settings, general operations |

**Triggers:**
- Every 5 min → Monitor Agent health check
- Payment event → Billing Agent processes
- Admin request → Admin Agent handles

---

### 4. Full Startup Team (Premium)

**Purpose:** Complete team for serious skill businesses.

**Includes:**
- All Support Team agents
- All Marketing Team agents
- All Ops Team agents
- **Strategy Agent:** Weekly business review, growth recommendations
- **Development Agent:** Feature prioritization, bug triage, roadmap

---

## Agent Framework: ROSTR

All agents run on the ROSTR (Runtime, Orchestration, State, Tools, Reference) framework.

### Key Components

**PAL (Prompt Abstraction Layer):**
Every agent action starts with intent compilation:
```yaml
intent: "User asked about pricing"
domain: support
phase: triage
priority: 4D score calculated
agent_type: triage
```

**NPAO (Navigate, Prioritize, Allocate, Orchestrate):**
Phase-aware routing ensures right agent handles right task:
- PreD phase → Research agents
- Support phase → Support team
- Marketing phase → Marketing team

**RAG DAL (Dynamic Acquisition Layer):**
Agents retrieve knowledge before acting:
- Product documentation
- Previous support tickets
- Creator-provided FAQs
- General knowledge (tiered credibility)

**Rostr Hub (Persistent State):**
Every action persists for continuity:
```
rostr-hub/
├── skills/{skill-id}/
│   ├── support-tickets/
│   ├── customer-feedback/
│   ├── marketing-content/
│   ├── performance-metrics/
│   └── agent-learnings/
```

---

## Agent Configuration

### Per-Skill Settings

```yaml
# Example skill agent config
skill_id: artist-vault-xyz
agent_team: full-startup

support:
  response_time_target: 1h
  escalation_email: creator@example.com
  auto_responses: true

marketing:
  channels:
    - twitter
    - email
  posting_frequency: 3x/week
  tone: professional-friendly

ops:
  uptime_target: 99.9%
  alert_email: creator@example.com
  auto_refund_threshold: $50
```

### Agent Permissions

| Agent | Can Read | Can Write | Can External |
|-------|----------|-----------|--------------|
| Support | Tickets, Docs | Responses, Internal notes | Email customer |
| Marketing | Analytics, Content | Social posts, Emails | Post to channels |
| Ops | Metrics, Users | Alerts, Admin actions | Send alerts |

---

## Monitoring Dashboard

### Real-Time View

```
┌─────────────────────────────────────────────────────────────┐
│ Agent Team: Full Startup       Status: ● All Healthy        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Support (3 agents)     Marketing (3 agents)    Ops (3)    │
│  ├─ Triage: Idle        ├─ Content: Writing     ├─ Mon: ✓  │
│  ├─ Tech: Handling #47  ├─ Dist: Scheduled      ├─ Bill: ✓ │
│  └─ Feedback: Idle      └─ Analytics: Idle      └─ Admin: ✓│
│                                                             │
│  Recent Actions:                                            │
│  14:32 - Triage resolved ticket #46 (FAQ match)            │
│  14:28 - Content drafted weekly newsletter                  │
│  14:15 - Monitor confirmed 100% uptime                      │
│  14:00 - Billing processed 3 subscriptions ($87)           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Weekly Report (Auto-Generated)

```markdown
## Agent Team Weekly Report: Artist Vault

### Support
- Tickets received: 12
- Resolved automatically: 9 (75%)
- Escalated to creator: 3
- Avg response time: 23 minutes

### Marketing
- Posts published: 6
- Total impressions: 2,340
- Engagement rate: 4.2%
- New signups from social: 8

### Ops
- Uptime: 99.97%
- Revenue processed: $1,247
- Refunds: 0
- Active users: 89

### Strategy Agent Recommendations
1. FAQ gap: 3 tickets asked about "bulk export" - consider adding feature
2. Marketing: Twitter posts outperforming email 3:1 - shift allocation
3. Pricing: 2 users abandoned at checkout - consider adding monthly option
```

---

## Pricing

| Team | Monthly | Included |
|------|---------|----------|
| Support | $99 | 3 agents, 100 tickets/mo |
| Marketing | $149 | 3 agents, 50 posts/mo |
| Ops | $99 | 3 agents, monitoring |
| Full Startup | $299 | 11 agents, all features |

Overages billed at:
- $0.50/ticket over limit
- $2/post over limit
- Custom pricing for enterprise

---

## Future Roadmap

### v1.1
- Custom agent training (fine-tune on creator's voice)
- Slack/Discord integration for support
- A/B testing for marketing content

### v1.2
- Voice agents for phone support
- Video content creation agent
- Integration with external tools (Notion, Linear, etc.)

### v2.0
- Creator can build custom agents
- Agent marketplace (buy/sell agent configs)
- Multi-skill agent teams (one team, many products)
