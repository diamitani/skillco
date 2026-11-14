# SkillCo pricing proposal (for Patrick's approval)
Prepared Nov 13, 2026 (America/Chicago). Prices below are proposals and are not live anywhere.

## Inputs (current published prices)
- **Model prices (Vercel AI Gateway).** AI Gateway passes through provider list prices with no token markup: https://vercel.com/docs/ai-gateway/pricing. Live per-model rates come from https://vercel.com/ai-gateway/models and the API at https://ai-gateway.vercel.sh/v1/models (pulled Nov 13, 2026):
  - Draft model **openai/gpt-5-mini**: $0.25 / 1M input, $2.00 / 1M output
  - Strong model **anthropic/claude-sonnet-5.5**: $2.00 / 1M input, $10.00 / 1M output
  - Alternatives: google/gemini-3-flash ($0.50 / $3.00), anthropic/claude-haiku-4.5 ($1 / $5), openai/gpt-5.4 ($2.50 / $15)
- **Stripe:** 2.9% + $0.30 per successful card charge (https://stripe.com/pricing). Billing usage-based meters: https://docs.stripe.com/billing/subscriptions/usage-based
- **Supabase Pro:** $25/mo org base, 100 GB file storage included, then $0.0213/GB-month. Egress: 250 GB included, then $0.09/GB. Source: https://supabase.com/pricing and https://supabase.com/docs/guides/storage/pricing

## Cost of one skill generation (the unit we sell as 1 "generation credit")
The pipeline in `frontend/lib/builder/pipeline.ts` runs these stages:

| Stage | Model | Input tok | Output tok | Cost |
|---|---|---|---|---|
| Intake (brief) | gpt-5-mini | 1.5k | 0.6k | $0.0016 |
| Tool & connector discovery (+KB cards) | gpt-5-mini | 4.5k | 1.5k | $0.0041 |
| Step plan | gpt-5-mini | 5k | 1.5k | $0.0043 |
| Write SKILL.md (streamed) | claude-sonnet-5.5 | 6k | 4k | $0.052 |
| References files | gpt-5-mini | 4.5k | 2.5k | $0.0061 |
| QA reviewer | gpt-5-mini | 4.5k | 0.4k | $0.0019 |
| **Typical total** | | ~26k | ~10.5k | **≈ $0.07** |
| Heavy run (long job description, retries, reasoning tokens ×2) | | ~45k | ~20k | **≈ $0.15–0.25** |

I plan on **$0.15 per generation** as the conservative cost basis. A free-tier generation (draft model only) costs about **$0.03**. Embeddings for the KB refresh cost cents per month in total.

## Proposed plans

| Plan | Price | Included generations | Storage | Overage | Gross margin at full use (cost $0.15/gen) | GM at typical use (≈$0.07/gen) |
|---|---|---|---|---|---|---|
| **Free** | $0 | 3 / mo (draft model only) | 100 MB | none, hard stop | cost ≈ $0.09 per user/mo | n/a |
| **Builder** | **$5.99/mo** | **10 / mo** (strong model writes) | **1 GB** | **$0.49 / gen**, opt-in, user cap (default $10) | **63%** | 76% |
| **Pro** | $19.99/mo | 50 / mo | 10 GB | $0.39 / gen | 55% | 74% |
| **Team** | $49/mo (3 seats) | 120 shared | 50 GB | $0.35 / gen | 57% | 73% |
| **Storage add-on** | +$1.99/mo | n/a | +10 GB | n/a | ~85% | n/a |

Builder math at full use: $1.50 tokens + $0.47 Stripe fee + about $0.25 infra (storage, DB, compute amortised) = $2.22 cost against $5.99 revenue, a 63% gross margin. That meets the ≥60% target at base usage. Most users won't use all 10 generations, so realistic margin is about 75%.

Overage: $0.49 against a $0.15 cost is about a 66% margin, still above 60% after the Stripe percentage fee because overage rides on the same monthly invoice.

## Guardrails (already in the code)
- **Hard usage cap.** `decideCredit()` in `lib/billing/usage.ts` blocks a build when included credits are gone, unless the user turned overage on and the next charge stays under their own cap.
- Overage is reported to Stripe as a **Billing Meter event** (`skillco_credits`, one unit per generation) with an idempotency identifier per run.
- Credits reset on `invoice.paid` for each new period.
- Free-tier builds use the draft model only.
- Recommend also setting an AI Gateway **team budget** (for example $50/mo to start) as a platform-wide backstop.

## Free tier recommendation
Keep a free tier: 3 draft-model generations a month, 100 MB of storage, unlimited catalog downloads, and Agent Skills zip export only. Plugin exports need Builder (gating not yet enforced in the MVP). It costs about $0.09 per active free user per month, and the "remix in builder" button on every catalog page funnels users into it.

## Stripe objects Patrick needs to create (test mode first)
1. Product "SkillCo Builder" with recurring price $5.99/month, set as `STRIPE_PRICE_BUILDER_MONTHLY`
2. Product "SkillCo Pro" with recurring price $19.99/month, set as `STRIPE_PRICE_PRO_MONTHLY`
3. Billing Meter with event name `skillco_credits`, aggregation sum, customer mapping `stripe_customer_id`
4. Metered price $0.49 per unit on that meter, set as `STRIPE_PRICE_CREDIT_OVERAGE`. Pro's $0.39 rate needs a second metered price; the MVP currently uses one.
5. Optional: recurring price $1.99/month "Storage +10 GB", set as `STRIPE_PRICE_STORAGE_10GB`
6. Webhook endpoint `https://<preview-or-prod>/api/stripe/webhook` for events `customer.subscription.created|updated|deleted` and `invoice.paid`
