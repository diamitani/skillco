"use client"

import { useState } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { 
  Download, 
  Shield, 
  Star, 
  Github, 
  ExternalLink, 
  AlertTriangle,
  CheckCircle,
  ChevronLeft,
  Lock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

// Mock data
const mockSkill = {
  id: "2",
  name: "API Security Scanner",
  slug: "api-security-scanner",
  description: "Automated security scanning for REST and GraphQL APIs. Detects common vulnerabilities including SQL injection, XSS, and broken authentication.",
  category: ["Security", "Development"],
  tags: ["security", "api", "scanning", "graphql", "rest"],
  source: "manual",
  source_url: "https://github.com/example/api-security-scanner",
  author_id: "user-123",
  vendor: "security-experts",
  risk_level: "safe",
  price: 4900,
  currency: "usd",
  rating: 4.9,
  review_count: 89,
  download_count: 1250,
  readme_url: "# API Security Scanner\n\nA comprehensive security scanning tool...",
  created_at: "2024-01-15",
  updated_at: "2024-07-20",
  security_scan: {
    id: "scan-123",
    status: "completed",
    findings: [],
    summary: { critical: 0, high: 0, medium: 0, low: 0, info: 2 },
    scanned_at: "2024-07-20",
  }
}

const riskConfig = {
  safe: { color: "text-success", bg: "bg-success/10", icon: CheckCircle, label: "Security Verified" },
  low: { color: "text-success", bg: "bg-success/10", icon: CheckCircle, label: "Low Risk" },
  medium: { color: "text-warning", bg: "bg-warning/10", icon: AlertTriangle, label: "Medium Risk" },
  high: { color: "text-error", bg: "bg-error/10", icon: AlertTriangle, label: "High Risk" },
  critical: { color: "text-error", bg: "bg-error/10", icon: AlertTriangle, label: "Critical Issues" },
}

interface SkillDetailPageProps {
  params: { id: string }
}

export default function SkillDetailPage({ params }: SkillDetailPageProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  
  // In real implementation, fetch skill by slug
  const skill = mockSkill
  const risk = riskConfig[skill.risk_level as keyof typeof riskConfig]
  const RiskIcon = risk.icon

  const handleDownload = () => {
    // Check if user is authenticated
    // For now, show login prompt
    setShowLoginPrompt(true)
  }

  const handlePurchase = () => {
    // Redirect to Stripe checkout
    console.log("Redirecting to Stripe checkout...")
  }

  return (
    <div className="container py-10">
      {/* Back Link */}
      <Link 
        href="/marketplace" 
        className="inline-flex items-center text-sm text-mist hover:text-snow mb-6"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to Marketplace
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        {/* Main Content */}
        <div className="space-y-8">
          {/* Header */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="font-display text-3xl font-bold text-snow mb-2">
                  {skill.name}
                </h1>
                <div className="flex items-center gap-3 text-sm text-mist">
                  <span>by {skill.vendor}</span>
                  <span>•</span>
                  <span>Updated {skill.updated_at}</span>
                </div>
              </div>
              <Badge
                className={cn(
                  "text-sm px-3 py-1",
                  risk.bg,
                  risk.color
                )}
              >
                <RiskIcon className="h-4 w-4 mr-1" />
                {risk.label}
              </Badge>
            </div>

            <p className="text-lg text-mist leading-relaxed">
              {skill.description}
            </p>
          </div>

          {/* Stats */}
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 fill-vivid text-vivid" />
              <span className="font-medium text-snow">{skill.rating}</span>
              <span className="text-mist">({skill.review_count} reviews)</span>
            </div>
            <div className="flex items-center gap-2">
              <Download className="h-5 w-5 text-mist" />
              <span className="text-snow">{skill.download_count.toLocaleString()}</span>
              <span className="text-mist">downloads</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {skill.category.map((cat) => (
              <Badge key={cat} variant="outline" className="text-sm">
                {cat}
              </Badge>
            ))}
            {skill.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-sm">
                {tag}
              </Badge>
            ))}
          </div>

          <Separator className="bg-graphite" />

          {/* README Preview */}
          <div>
            <h2 className="font-display text-xl font-semibold text-snow mb-4">
              Documentation
            </h2>
            <div className="prose prose-invert max-w-none">
              <div className="bg-slate rounded-lg p-6 border border-graphite">
                <pre className="whitespace-pre-wrap text-sm text-mist font-mono">
                  {skill.readme_url}
                </pre>
              </div>
            </div>
          </div>

          {/* Security Scan Results */}
          <Card className="border-graphite">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-violet" />
                Security Scan Results
              </CardTitle>
              <CardDescription>
                Last scanned on {skill.security_scan.scanned_at}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-4 text-center">
                <div className="p-3 rounded-lg bg-slate">
                  <div className="text-2xl font-bold text-error">
                    {skill.security_scan.summary.critical}
                  </div>
                  <div className="text-xs text-mist">Critical</div>
                </div>
                <div className="p-3 rounded-lg bg-slate">
                  <div className="text-2xl font-bold text-error">
                    {skill.security_scan.summary.high}
                  </div>
                  <div className="text-xs text-mist">High</div>
                </div>
                <div className="p-3 rounded-lg bg-slate">
                  <div className="text-2xl font-bold text-warning">
                    {skill.security_scan.summary.medium}
                  </div>
                  <div className="text-xs text-mist">Medium</div>
                </div>
                <div className="p-3 rounded-lg bg-slate">
                  <div className="text-2xl font-bold text-success">
                    {skill.security_scan.summary.low}
                  </div>
                  <div className="text-xs text-mist">Low</div>
                </div>
                <div className="p-3 rounded-lg bg-slate">
                  <div className="text-2xl font-bold text-mist">
                    {skill.security_scan.summary.info}
                  </div>
                  <div className="text-xs text-mist">Info</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Download Card */}
          <Card className="border-graphite sticky top-24">
            <CardHeader>
              <CardTitle>Get this skill</CardTitle>
              <CardDescription>
                {skill.price === 0 
                  ? "Free to download" 
                  : `One-time purchase of $${(skill.price / 100).toFixed(2)}`
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {showLoginPrompt ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-slate rounded-lg">
                    <Lock className="h-5 w-5 text-violet" />
                    <div>
                      <p className="font-medium text-snow">Sign in required</p>
                      <p className="text-sm text-mist">
                        Create an account to download skills
                      </p>
                    </div>
                  </div>
                  <Link href="/login">
                    <Button className="w-full">Sign In to Download</Button>
                  </Link>
                </div>
              ) : skill.price === 0 ? (
                <Button 
                  className="w-full gap-2" 
                  size="lg"
                  onClick={handleDownload}
                >
                  <Download className="h-4 w-4" />
                  Download Free
                </Button>
              ) : (
                <Button 
                  className="w-full gap-2" 
                  size="lg"
                  onClick={handlePurchase}
                >
                  Buy Now - ${(skill.price / 100).toFixed(2)}
                </Button>
              )}
              
              <p className="text-xs text-center text-mist">
                Secure payment via Stripe
              </p>
            </CardContent>
          </Card>

          {/* Source Link */}
          {skill.source_url && (
            <Card className="border-graphite">
              <CardHeader>
                <CardTitle className="text-sm">Source Code</CardTitle>
              </CardHeader>
              <CardContent>
                <Link 
                  href={skill.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-violet hover:text-vivid"
                >
                  <Github className="h-4 w-4" />
                  View on GitHub
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
