import Stripe from "stripe";

// Initialize the Stripe server client with secret key and apiVersion
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-02-24.acacia" as Stripe.LatestApiVersion,
  appInfo: {
    name: "SkillCo Platform",
    version: "1.0.0",
    url: "https://skillco.work",
  },
});

export const stripeConfig = {
  currency: "usd",
  accountId: process.env.STRIPE_ACCOUNT_ID || "acct_1UIHuI4DUgvDhOs8",
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
  proSubscriptionPriceId: process.env.STRIPE_PRO_PRICE_ID || "price_pro_monthly",
  platformFeePercent: 30, // 30% platform fee, 70% creator share
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
};

/**
 * 1. PAYMENTS & BILLING: Create a Stripe Checkout Session for Subscriptions or 1-off purchases
 */
export async function createCheckoutSession({
  userId,
  userEmail,
  priceId,
  mode = "subscription",
  successUrl,
  cancelUrl,
  metadata = {},
}: {
  userId?: string;
  userEmail?: string;
  priceId: string;
  mode?: "subscription" | "payment";
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}) {
  return await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode,
    customer_email: userEmail,
    client_reference_id: userId,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      userId: userId || "",
      ...metadata,
    },
    subscription_data:
      mode === "subscription"
        ? {
            metadata: {
              userId: userId || "",
              ...metadata,
            },
          }
        : undefined,
  });
}

/**
 * 2. BILLING: Create a Customer Portal Session for self-service billing management
 */
export async function createCustomerPortalSession({
  customerId,
  returnUrl,
}: {
  customerId: string;
  returnUrl: string;
}) {
  return await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
}

/**
 * 3. INVOICING: Create a custom invoice for B2B Enterprise Skill licensing
 */
export async function createEnterpriseInvoice({
  customerId,
  amountInCents,
  description,
  daysUntilDue = 30,
}: {
  customerId: string;
  amountInCents: number;
  description: string;
  daysUntilDue?: number;
}) {
  // Create an invoice item
  await stripe.invoiceItems.create({
    customer: customerId,
    amount: amountInCents,
    currency: stripeConfig.currency,
    description,
  });

  // Create and finalize the invoice
  const invoice = await stripe.invoices.create({
    customer: customerId,
    collection_method: "send_invoice",
    days_until_due: daysUntilDue,
    auto_advance: true,
    metadata: {
      platform: "SkillCo Enterprise",
    },
  });

  return await stripe.invoices.sendInvoice(invoice.id);
}

/**
 * 4. IDENTITY: Create a verification session for creator KYC & publisher identity
 */
export async function createIdentityVerificationSession({
  userId,
  userEmail,
  returnUrl,
}: {
  userId: string;
  userEmail: string;
  returnUrl: string;
}) {
  return await stripe.identity.verificationSessions.create({
    type: "document",
    metadata: {
      userId,
      userEmail,
    },
    options: {
      document: {
        require_matching_selfie: true,
      },
    },
    return_url: returnUrl,
  });
}

/**
 * 5. TERMINAL: Create a connection token for on-site reader / hardware terminal POS
 */
export async function createTerminalConnectionToken() {
  return await stripe.terminal.connectionTokens.create();
}
