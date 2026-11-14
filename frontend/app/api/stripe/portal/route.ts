import { NextRequest, NextResponse } from "next/server";
import { createCustomerPortalSession } from "@/lib/stripe";
import { isStripeConfigured } from "@/lib/env";
import { getUser } from "@/lib/supabase/server";

export const runtime = "nodejs";

/** Opens the Stripe Customer Portal for the signed-in user's own customer record. */
export async function POST(req: NextRequest) {
  if (!isStripeConfigured()) return NextResponse.json({ error: "Stripe is not configured yet." }, { status: 503 });
  const { supabase, user } = await getUser();
  if (!supabase || !user) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  const { data: profile } = await supabase.from("profiles").select("stripe_customer_id").eq("id", user.id).single();
  if (!profile?.stripe_customer_id) return NextResponse.json({ error: "No billing account yet. Subscribe first." }, { status: 400 });
  const session = await createCustomerPortalSession({
    customerId: profile.stripe_customer_id,
    returnUrl: `${req.nextUrl.origin}/dashboard/billing`,
  });
  return NextResponse.json({ url: session.url });
}
