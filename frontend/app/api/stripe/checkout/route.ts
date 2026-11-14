import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { env, isStripeConfigured } from "@/lib/env";
import { getUser, createServiceClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

/**
 * POST /api/stripe/checkout { plan: "builder" | "pro" }
 * Creates a subscription Checkout Session with the flat monthly price plus the
 * metered overage price (billed only when the user opts into overage and exceeds credits).
 */
export async function POST(req: NextRequest) {
  if (!isStripeConfigured()) return NextResponse.json({ error: "Stripe is not configured yet." }, { status: 503 });
  const { user } = await getUser();
  if (!user) return NextResponse.json({ error: "Sign in first." }, { status: 401 });

  const { plan = "builder" } = await req.json().catch(() => ({}));
  const price = plan === "pro" ? env.pricePro : env.priceBuilder;
  if (!price) return NextResponse.json({ error: `Missing price ID for plan ${plan}` }, { status: 500 });

  const admin = createServiceClient();
  const { data: profile } = admin
    ? await admin.from("profiles").select("stripe_customer_id").eq("id", user.id).single()
    : { data: null };

  let customer = profile?.stripe_customer_id ?? undefined;
  if (!customer) {
    const c = await stripe.customers.create({ email: user.email, metadata: { supabase_user_id: user.id } });
    customer = c.id;
    await admin?.from("profiles").update({ stripe_customer_id: customer }).eq("id", user.id);
  }

  const origin = req.nextUrl.origin || env.siteUrl;
  const lineItems: { price: string; quantity?: number }[] = [{ price, quantity: 1 }];
  if (env.priceOverage) lineItems.push({ price: env.priceOverage }); // metered: no quantity

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer,
    client_reference_id: user.id,
    line_items: lineItems,
    allow_promotion_codes: true,
    subscription_data: { metadata: { supabase_user_id: user.id, plan } },
    metadata: { supabase_user_id: user.id, plan },
    success_url: `${origin}/dashboard/billing?checkout=success`,
    cancel_url: `${origin}/pricing?checkout=cancelled`,
  });
  return NextResponse.json({ url: session.url });
}
