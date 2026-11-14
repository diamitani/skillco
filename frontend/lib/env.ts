/** Central env access. Every value is optional at build time so the static site still builds. */
export const env = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://www.skillco.work",
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  draftModel: process.env.SKILLCO_DRAFT_MODEL || "openai/gpt-5-mini",
  finalModel: process.env.SKILLCO_FINAL_MODEL || "anthropic/claude-sonnet-5.5",
  embedModel: process.env.SKILLCO_EMBED_MODEL || "openai/text-embedding-3-small",
  stripeSecret: process.env.STRIPE_SECRET_KEY || "",
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
  priceBuilder: process.env.STRIPE_PRICE_BUILDER_MONTHLY || "",
  pricePro: process.env.STRIPE_PRICE_PRO_MONTHLY || "",
  priceOverage: process.env.STRIPE_PRICE_CREDIT_OVERAGE || "",
  priceStorage10: process.env.STRIPE_PRICE_STORAGE_10GB || "",
  meterEventName: process.env.STRIPE_METER_EVENT_NAME || "skillco_credits",
  cronSecret: process.env.CRON_SECRET || "",
};

export const isSupabaseConfigured = () =>
  Boolean(env.supabaseUrl && env.supabaseAnonKey && !env.supabaseUrl.includes("your-project"));
export const isStripeConfigured = () =>
  Boolean(env.stripeSecret && env.stripeSecret.length > 12);
export const isAiConfigured = () =>
  Boolean(process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN);
