import { NextRequest, NextResponse } from "next/server";
import { stripe, stripeConfig } from "@/lib/stripe";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature || !stripeConfig.webhookSecret) {
    // If webhook secret isn't configured in dev, parse without signature verification for inspection
    if (process.env.NODE_ENV === "development" && !stripeConfig.webhookSecret) {
      console.warn("[Stripe Webhook]: Running without STRIPE_WEBHOOK_SECRET verification in development.");
      const event = JSON.parse(body) as Stripe.Event;
      await handleEvent(event);
      return NextResponse.json({ received: true });
    }

    return NextResponse.json(
      { error: "Missing stripe-signature or webhook secret" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      stripeConfig.webhookSecret
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    console.error(`[Stripe Webhook Signature Error]: ${message}`);
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${message}` },
      { status: 400 }
    );
  }

  try {
    await handleEvent(event);
    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`[Stripe Webhook Processing Error]: ${message}`);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

async function handleEvent(event: Stripe.Event) {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log(`[Stripe] Checkout Session completed: ${session.id}, Customer: ${session.customer}`);
      // In production: Upsert entitlement / subscription in database
      break;
    }

    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      console.log(`[Stripe] Subscription ${subscription.id} status: ${subscription.status}`);
      // In production: Update user subscription tier (pro, enterprise)
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      console.log(`[Stripe] Subscription ${subscription.id} cancelled`);
      // In production: Revert user to free tier
      break;
    }

    case "invoice.payment_succeeded": {
      const invoice = event.data.object as Stripe.Invoice;
      console.log(`[Stripe] Invoice paid: ${invoice.id}, amount: ${invoice.amount_paid}`);
      break;
    }

    case "identity.verification_session.verified": {
      const session = event.data.object as Stripe.Identity.VerificationSession;
      console.log(`[Stripe Identity] Creator verified: ${session.id}, Metadata:`, session.metadata);
      // In production: Grant creator verified badge and enable payout capabilities
      break;
    }

    default:
      console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
  }
}
