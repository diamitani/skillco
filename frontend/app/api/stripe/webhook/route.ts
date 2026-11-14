import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { env } from "@/lib/env";
import { createServiceClient } from "@/lib/supabase/server";
import { PLANS, type PlanId } from "@/lib/billing/plans";

export const runtime = "nodejs";

/** Stripe webhook. Signature verification is always required. */
export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");
  if (!signature || !env.stripeWebhookSecret)
    return NextResponse.json({ error: "Missing stripe-signature or webhook secret" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, env.stripeWebhookSecret);
  } catch (err) {
    return NextResponse.json({ error: `Signature verification failed: ${err instanceof Error ? err.message : err}` }, { status: 400 });
  }

  const admin = createServiceClient();
  if (!admin) return NextResponse.json({ error: "Supabase service key missing" }, { status: 500 });

  try {
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await syncSubscription(admin, sub, event.type === "customer.subscription.deleted");
        break;
      }
      case "invoice.paid": {
        // New billing period: reset monthly credits and overage counters.
        const inv = event.data.object as Stripe.Invoice;
        const customer = typeof inv.customer === "string" ? inv.customer : inv.customer?.id;
        if (customer && inv.billing_reason !== "subscription_create") {
          await admin
            .from("profiles")
            .update({ credits_used: 0, overage_cents_this_period: 0, period_start: new Date().toISOString() })
            .eq("stripe_customer_id", customer);
        }
        break;
      }
      default:
        break;
    }
    return NextResponse.json({ received: true });
  } catch (e) {
    console.error("[stripe webhook]", e);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}

async function syncSubscription(admin: NonNullable<ReturnType<typeof createServiceClient>>, sub: Stripe.Subscription, deleted: boolean) {
  const customer = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
  const { data: profile } = await admin.from("profiles").select("id").eq("stripe_customer_id", customer).single();
  const userId = profile?.id ?? sub.metadata?.supabase_user_id;
  if (!userId) return;

  const items = sub.items.data;
  const base = items.find((i) => i.price.id === env.priceBuilder || i.price.id === env.pricePro);
  const metered = items.find((i) => i.price.id === env.priceOverage);
  const storageAddons = items.filter((i) => i.price.id === env.priceStorage10).reduce((n, i) => n + (i.quantity ?? 1), 0);
  const plan: PlanId = base?.price.id === env.pricePro ? "pro" : "builder";
  const active = !deleted && ["active", "trialing", "past_due"].includes(sub.status);
  const effective: PlanId = active ? plan : "free";
  const first = items[0];

  await admin.from("subscriptions").upsert({
    id: sub.id,
    user_id: userId,
    status: deleted ? "canceled" : sub.status,
    plan,
    price_id: base?.price.id ?? null,
    metered_item_id: metered?.id ?? null,
    current_period_start: first?.current_period_start ? new Date(first.current_period_start * 1000).toISOString() : null,
    current_period_end: first?.current_period_end ? new Date(first.current_period_end * 1000).toISOString() : null,
    cancel_at_period_end: sub.cancel_at_period_end,
  });

  await admin
    .from("profiles")
    .update({
      plan: effective,
      credits_included: PLANS[effective].credits,
      storage_quota_bytes: PLANS[effective].storageBytes + storageAddons * 10 * 1024 ** 3,
      stripe_customer_id: customer,
    })
    .eq("id", userId);
}
