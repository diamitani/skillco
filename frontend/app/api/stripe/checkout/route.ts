import { NextRequest, NextResponse } from "next/server";
import { createCheckoutSession, stripeConfig } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { priceId, mode = "subscription", userId, userEmail, returnUrl } = body;

    const origin = req.nextUrl.origin || process.env.NEXT_PUBLIC_SITE_URL || "https://skillco.work";
    const targetPrice = priceId || stripeConfig.proSubscriptionPriceId;

    if (!targetPrice) {
      return NextResponse.json(
        { error: "Missing priceId configuration" },
        { status: 400 }
      );
    }

    const session = await createCheckoutSession({
      userId,
      userEmail,
      priceId: targetPrice,
      mode: mode as "subscription" | "payment",
      successUrl: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: returnUrl || `${origin}/pricing`,
      metadata: {
        source: "skillco_web",
      },
    });

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (error: unknown) {
    console.error("[Stripe Checkout Error]:", error);
    const message = error instanceof Error ? error.message : "Failed to create checkout session";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
