/** Plan catalogue. Mirrors PRICING.md; Stripe price IDs come from env. */
export type PlanId = "free" | "builder" | "pro" | "team";

export interface Plan {
  id: PlanId;
  name: string;
  priceMonthly: number; // USD
  credits: number; // standard skill generations per month
  storageBytes: number;
  overage: boolean; // can buy metered overage
  finalModel: "draft" | "strong";
  features: string[];
}

const MB = 1024 * 1024;
const GB = 1024 * MB;

export const PLANS: Record<PlanId, Plan> = {
  free: {
    id: "free",
    name: "Free",
    priceMonthly: 0,
    credits: 3,
    storageBytes: 100 * MB,
    overage: false,
    finalModel: "draft",
    features: [
      "3 skill generations / month (draft model)",
      "Unlimited catalog downloads",
      "Agent Skills zip export",
      "100 MB storage",
    ],
  },
  builder: {
    id: "builder",
    name: "Builder",
    priceMonthly: 5.99,
    credits: 10,
    storageBytes: 1 * GB,
    overage: true,
    finalModel: "strong",
    features: [
      "10 skill generations / month (strong model for final write)",
      "Export to Agent Skills, Cursor plugin, Claude Code plugin",
      "Unlimited private skills + version history",
      "1 GB storage",
      "Overage $0.49 / generation, hard cap you control",
    ],
  },
  pro: {
    id: "pro",
    name: "Pro",
    priceMonthly: 19.99,
    credits: 50,
    storageBytes: 10 * GB,
    overage: true,
    finalModel: "strong",
    features: [
      "50 skill generations / month",
      "Job description → skill set (when released)",
      "Personal MCP endpoint + GitHub sync (when released)",
      "10 GB storage",
      "Overage $0.39 / generation",
    ],
  },
  team: {
    id: "team",
    name: "Team",
    priceMonthly: 49,
    credits: 120,
    storageBytes: 50 * GB,
    overage: true,
    finalModel: "strong",
    features: ["3 seats, 120 shared generations", "50 GB storage", "Shared library", "Priority support"],
  },
};

export const OVERAGE_CENTS: Record<PlanId, number> = { free: 0, builder: 49, pro: 39, team: 35 };
export const STORAGE_ADDON = { bytes: 10 * GB, priceMonthly: 1.99 };

export function formatBytes(n: number) {
  if (n >= GB) return `${(n / GB).toFixed(1)} GB`;
  if (n >= MB) return `${(n / MB).toFixed(1)} MB`;
  return `${Math.round(n / 1024)} KB`;
}
