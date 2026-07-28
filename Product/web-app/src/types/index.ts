import { z } from 'zod'

// User roles and subscription tiers
export const UserRole = z.enum(['visitor', 'member', 'creator', 'admin'])
export const SubscriptionTier = z.enum(['free', 'pro', 'enterprise'])

// Risk levels for security scanning
export const RiskLevel = z.enum(['safe', 'low', 'medium', 'high', 'critical'])

// Skill source types
export const SkillSource = z.enum(['github', 'clawdbot', 'manual', 'pal'])

// User schema
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  role: UserRole,
  subscription_tier: SubscriptionTier,
  stripe_customer_id: z.string().optional(),
  created_at: z.date(),
  last_active: z.date(),
})

// Security finding schema
export const SecurityFindingSchema = z.object({
  severity: z.enum(['critical', 'high', 'medium', 'low', 'info']),
  rule: z.string(),
  message: z.string(),
  file: z.string().optional(),
  line: z.number().optional(),
})

// Security scan schema
export const SecurityScanSchema = z.object({
  id: z.string(),
  skill_id: z.string(),
  status: z.enum(['pending', 'running', 'completed', 'failed']),
  findings: z.array(SecurityFindingSchema),
  summary: z.object({
    critical: z.number(),
    high: z.number(),
    medium: z.number(),
    low: z.number(),
    info: z.number(),
  }),
  codeguru_arn: z.string().optional(),
  inspector_arn: z.string().optional(),
  scanned_at: z.date(),
})

// Skill schema
export const SkillSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  category: z.array(z.string()),
  tags: z.array(z.string()),
  source: SkillSource,
  source_url: z.string().url().optional(),
  author_id: z.string().optional(),
  vendor: z.string(),
  security_scan_id: z.string(),
  risk_level: RiskLevel,
  vulnerabilities: z.array(SecurityFindingSchema),
  price: z.number().min(0),
  currency: z.string().default('usd'),
  is_published: z.boolean().default(false),
  download_count: z.number().default(0),
  rating: z.number().min(0).max(5).default(0),
  review_count: z.number().default(0),
  download_url: z.string(),
  readme_url: z.string(),
  created_at: z.date(),
  updated_at: z.date(),
})

// Purchase schema
export const PurchaseSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  skill_id: z.string(),
  stripe_payment_intent_id: z.string(),
  amount: z.number(),
  currency: z.string(),
  platform_fee: z.number(),
  creator_payout: z.number(),
  status: z.enum(['pending', 'completed', 'refunded']),
  purchased_at: z.date(),
})

// Export types
export type User = z.infer<typeof UserSchema>
export type SecurityFinding = z.infer<typeof SecurityFindingSchema>
export type SecurityScan = z.infer<typeof SecurityScanSchema>
export type Skill = z.infer<typeof SkillSchema>
export type Purchase = z.infer<typeof PurchaseSchema>
export type UserRole = z.infer<typeof UserRole>
export type SubscriptionTier = z.infer<typeof SubscriptionTier>
export type RiskLevel = z.infer<typeof RiskLevel>
export type SkillSource = z.infer<typeof SkillSource>
