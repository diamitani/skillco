"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, Check, Zap, Shield, Download, Star, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"

const features = [
  "Access to 10,000+ curated skills",
  "Security scanning on every skill",
  "Basic search and filters",
  "Community support",
]

const proFeatures = [
  "Unlimited skill downloads",
  "PAL skill builder access",
  "Priority security scanning",
  "Sell skills on marketplace (70% revenue share)",
  "Advanced search with AI",
  "Private skill repositories",
  "Priority support",
  "API access",
]

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")

  return (
    <div className="container py-20">
      {/* Header */}
      <div className="text-center mb-16">
        <Badge variant="secondary" className="mb-4">
          Simple Pricing
        </Badge>
        <h1 className="font-display text-4xl font-bold text-snow mb-4">
          Choose your plan
        </h1>
        <p className="text-lg text-mist max-w-2xl mx-auto">
          Start free and upgrade when you're ready to build and sell skills
        </p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`text-sm font-medium transition-colors ${
              billingCycle === "monthly" ? "text-snow" : "text-mist"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle("yearly")}
            className={`text-sm font-medium transition-colors ${
              billingCycle === "yearly" ? "text-snow" : "text-mist"
            }`}
          >
            Yearly
            <Badge variant="success" className="ml-2 text-xs">
              Save 20%
            </Badge>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Free Plan */}
        <Card className="border-graphite">
          <CardHeader>
            <CardTitle className="font-display text-2xl">Free</CardTitle>
            <CardDescription>For individual explorers</CardDescription>
            <div className="mt-4">
              <span className="font-display text-4xl font-bold text-snow">$0</span>
              <span className="text-mist ml-2">/forever</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3">
              {features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-success shrink-0 mt-0.5" />
                  <span className="text-sm text-snow">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Link href="/signup" className="w-full">
              <Button variant="outline" className="w-full">
                Get Started Free
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Pro Plan */}
        <Card className="border-violet relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-violet text-white text-xs font-medium px-3 py-1 rounded-bl-lg">
            Most Popular
          </div>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle className="font-display text-2xl">Pro</CardTitle>
              <Zap className="h-5 w-5 text-violet" />
            </div>
            <CardDescription>For builders and creators</CardDescription>
            <div className="mt-4">
              <span className="font-display text-4xl font-bold text-snow">
                ${billingCycle === "monthly" ? "19" : "15"}
              </span>
              <span className="text-mist ml-2">/month</span>
              {billingCycle === "yearly" && (
                <div className="text-sm text-mist mt-1">
                  Billed annually (${15 * 12}/year)
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3">
              {proFeatures.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-violet shrink-0 mt-0.5" />
                  <span className="text-sm text-snow">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Link href="/signup" className="w-full">
              <Button className="w-full gap-2">
                Upgrade to Pro
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      {/* Trust Badges */}
      <div className="mt-20 text-center">
        <p className="text-sm text-mist mb-6">Trusted by developers worldwide</p>
        <div className="flex flex-wrap justify-center gap-8">
          <div className="flex items-center gap-2 text-mist">
            <Shield className="h-5 w-5" />
            <span className="text-sm">SOC 2 Compliant</span>
          </div>
          <div className="flex items-center gap-2 text-mist">
            <Download className="h-5 w-5" />
            <span className="text-sm">100K+ Downloads</span>
          </div>
          <div className="flex items-center gap-2 text-mist">
            <Star className="h-5 w-5" />
            <span className="text-sm">4.9/5 Rating</span>
          </div>
          <div className="flex items-center gap-2 text-mist">
            <Lock className="h-5 w-5" />
            <span className="text-sm">Enterprise Security</span>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-20 max-w-2xl mx-auto">
        <h2 className="font-display text-2xl font-bold text-snow text-center mb-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-medium text-snow mb-2">What's included in the Free plan?</h3>
            <p className="text-sm text-mist">
              Browse and download free skills, view skill details and security reports, 
              and access basic search functionality. Perfect for getting started.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-snow mb-2">How does the revenue share work?</h3>
            <p className="text-sm text-mist">
              Pro users can sell skills on the marketplace. You keep 70% of every sale, 
              and SkillCo takes 30% to cover platform costs, security scanning, and payment processing.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-snow mb-2">What is PAL?</h3>
            <p className="text-sm text-mist">
              PAL (Prompt-Augmented Library) is our AI-powered skill builder. Describe what you need 
              in natural language, and PAL generates production-ready skills with documentation.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-snow mb-2">Can I cancel anytime?</h3>
            <p className="text-sm text-mist">
              Yes, you can cancel your Pro subscription at any time. You'll continue to have access 
              until the end of your billing period.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
