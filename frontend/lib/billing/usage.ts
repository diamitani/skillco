import type { SupabaseClient } from "@supabase/supabase-js";
import { OVERAGE_CENTS, type PlanId } from "@/lib/billing/plans";
import { stripe } from "@/lib/stripe";
import { env, isStripeConfigured } from "@/lib/env";

export interface CreditDecision {
  allowed: boolean;
  overage: boolean;
  reason?: string;
  remaining: number;
}

interface ProfileRow {
  id: string;
  plan: PlanId;
  stripe_customer_id: string | null;
  credits_included: number;
  credits_used: number;
  overage_enabled: boolean;
  overage_cap_cents: number;
  overage_cents_this_period: number;
}

/**
 * Hard usage cap. A generation is allowed when the user has included credits left,
 * or when they opted into overage, are on a paid plan, and the next charge stays under their cap.
 */
export function decideCredit(p: ProfileRow): CreditDecision {
  const remaining = Math.max(0, p.credits_included - p.credits_used);
  if (remaining > 0) return { allowed: true, overage: false, remaining };
  const unit = OVERAGE_CENTS[p.plan] ?? 0;
  if (p.plan === "free" || unit === 0)
    return { allowed: false, overage: false, remaining, reason: "Free plan limit reached. Upgrade to Builder for 10 generations a month." };
  if (!p.overage_enabled)
    return { allowed: false, overage: false, remaining, reason: "Monthly credits used. Turn on overage in Billing to keep building." };
  if (p.overage_cents_this_period + unit > p.overage_cap_cents)
    return { allowed: false, overage: true, remaining, reason: "Overage cap reached for this period. Raise the cap in Billing." };
  return { allowed: true, overage: true, remaining };
}

export async function loadProfile(admin: SupabaseClient, userId: string) {
  const { data } = await admin
    .from("profiles")
    .select("id, plan, stripe_customer_id, credits_included, credits_used, overage_enabled, overage_cap_cents, overage_cents_this_period")
    .eq("id", userId)
    .single();
  return data as ProfileRow | null;
}

/** Record one consumed credit and, for overage, report a Stripe meter event. */
export async function recordGeneration(
  admin: SupabaseClient,
  p: ProfileRow,
  decision: CreditDecision,
  runId: string
) {
  let meterEventId: string | null = null;
  if (decision.overage && p.stripe_customer_id && isStripeConfigured()) {
    try {
      const ev = await stripe.billing.meterEvents.create({
        event_name: env.meterEventName,
        payload: { stripe_customer_id: p.stripe_customer_id, value: "1" },
        identifier: `run_${runId}`,
      });
      meterEventId = ev.identifier;
    } catch (e) {
      console.error("[meter] failed", e);
    }
  }
  await admin
    .from("profiles")
    .update({
      credits_used: p.credits_used + 1,
      overage_cents_this_period:
        p.overage_cents_this_period + (decision.overage ? OVERAGE_CENTS[p.plan] : 0),
    })
    .eq("id", p.id);
  await admin.from("usage_events").insert({
    owner_id: p.id,
    kind: "generation",
    quantity: 1,
    unit: "credit",
    overage: decision.overage,
    run_id: runId,
    stripe_meter_event_id: meterEventId,
  });
}
