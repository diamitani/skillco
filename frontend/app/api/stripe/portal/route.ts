import { NextRequest, NextResponse } from "next/server";
import { createCustomerPortalSession } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerId, returnUrl } = body;

    if (!customerId) {
      return NextResponse.json(
        { error: "Missing customerId" },
        { status: 400 }
      );
    }

    const origin = req.nextUrl.origin || process.env.NEXT_PUBLIC_SITE_URL || "https://skillco.work";
    const session = await createCustomerPortalSession({
      customerId,
      returnUrl: returnUrl || `${origin}/dashboard/billing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    console.error("[Stripe Portal Error]:", error);
    const message = error instanceof Error ? error.message : "Failed to create portal session";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
