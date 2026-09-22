import { NextRequest, NextResponse } from "next/server";
import { createIdentityVerificationSession } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, userEmail, returnUrl } = body;

    if (!userId || !userEmail) {
      return NextResponse.json(
        { error: "Missing required fields: userId and userEmail" },
        { status: 400 }
      );
    }

    const origin = req.nextUrl.origin || process.env.NEXT_PUBLIC_SITE_URL || "https://skillco.work";
    const verificationSession = await createIdentityVerificationSession({
      userId,
      userEmail,
      returnUrl: returnUrl || `${origin}/creator/verification-complete`,
    });

    return NextResponse.json({
      url: verificationSession.url,
      clientSecret: verificationSession.client_secret,
      sessionId: verificationSession.id,
    });
  } catch (error: unknown) {
    console.error("[Stripe Identity Error]:", error);
    const message = error instanceof Error ? error.message : "Failed to create identity verification session";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
