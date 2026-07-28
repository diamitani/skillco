"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Filter, Download, Shield, Star, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

// Mock data - will be replaced with real data from Supabase
const categories = [
  "All",
  "Development",
  "Design",
  "Marketing",
  "Sales",
  "Productivity",
  "Data",
  "Security",
]

const riskLevels = {
  safe: { color: "bg-success/10 text-success", label: "Safe" },
  low: { color: "bg-success/10 text-success", label: "Low Risk" },
  medium: { color: "bg-warning/10 text-warning", label: "Medium Risk" },
  high: { color: "bg-error/10 text-error", label: "High Risk" },
  critical: { color: "bg-error/10 text-error", label: "Critical" },
}

const mockSkills = [
  {
    id: "1",
    name: "React Component Generator",
    slug: "react-component-generator",
    description: "Generate production-ready React components with TypeScript, Tailwind, and best practices.",
    category: ["Development"],
    tags: ["react", "typescript", "ui"],
    risk_level: "safe",
    price: 0,
    rating: 4.8,
    review_count: 124,
    download_count: 3420,
    vendor: "skillco-official",
  },
  {
    id: "2",
    name: "API Security Scanner",
    slug: "api-security-scanner",
    description: "Automated security scanning for REST and GraphQL APIs. Detects common vulnerabilities.",
    category: ["Security"],
    tags: ["security", "api", "scanning"],
    risk_level: "safe",
    price: 4900,
    rating: 4.9,
    review_count: 89,
    download_count: 1250,
    vendor: "security-experts",
  },
  {
    id: "3",
    name: "Email Marketing Automation",
    slug: "email-marketing-automation",
    description: "Full email marketing workflow with segmentation, A/B testing, and analytics.",
    category: ["Marketing"],
    tags: ["email", "automation", "marketing"],
    risk_level: "low",
    price: 2900,
    rating: 4.6,
    review_count: 56,
    download_count: 890,
    vendor: "growth-tools",
  },
  {
    id: "4",
    name: "Sales Prospecting Bot",
    slug: "sales-prospecting-bot",
    description: "AI-powered prospecting with Clay, HubSpot, and Apollo integrations.",
    category: ["Sales"],
    tags: ["sales", "prospecting", "automation"],
    risk_level: "medium",
    price: 9900,
    rating: 4.7,
    review_count: 203,
    download_count: 1560,
    vendor: "sales-stack",
  },
  {
    id: "5",
    name: "Data Pipeline Builder",
    slug: "data-pipeline-builder",
    description: "ETL pipeline templates for common data sources. Includes monitoring and alerting.",
    category: ["Data"],
    tags: ["data", "etl", "pipeline"],
    risk_level: "safe",
    price: 0,
    rating: 4.5,
    review_count: 78,
    download_count: 2100,
    vendor: "data-ops",
  },
  {
    id: "6",
    name: "Design System Generator",
    slug: "design-system-generator",
    description: "Generate complete design systems with tokens, components, and documentation.",
    category: ["Design"],
    tags: ["design", "tokens", "system"],
    risk_level: "safe",
    price: 14900,
    rating: 4.9,
    review_count: 145,
    download_count: 2340,
    vendor: "design-pro",
  },
]

function formatPrice(price: number): string {
  if (price === 0) return "Free"
  return `$${(price / 100).toFixed(2)}`
}

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filteredSkills = mockSkills.filter((skill) => {
    const matchesSearch =
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory =
      selectedCategory === "All" || skill.category.includes(selectedCategory)
    
    return matchesSearch && matchesCategory
  })

  return (
    <div className="container py-10">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="font-display text-4xl font-bold text-snow mb-4">
          Skill Marketplace
        </h1>
        <p className="text-lg text-mist max-w-2xl mx-auto">
          Discover and download production-ready skills for every platform. 
          All skills are security-scanned and community-rated.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-mist" />
          <Input
            placeholder="Search skills by name, description, or tags..."
            className="pl-10 h-12 text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-mist">
          Showing {filteredSkills.length} skills
        </p>
        <div className="flex items-center gap-2 text-sm text-mist">
          <Shield className="h-4 w-4" />
          <span>All skills security-scanned</span>
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredSkills.map((skill) => (
          <Link key={skill.id} href={`/skill/${skill.slug}`}>
            <Card className="h-full cursor-pointer transition-colors hover:border-violet/50">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{skill.name}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {skill.description}
                    </CardDescription>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      "shrink-0 ml-2",
                      riskLevels[skill.risk_level as keyof typeof riskLevels]?.color
                    )}
                  >
                    <Shield className="h-3 w-3 mr-1" />
                    {riskLevels[skill.risk_level as keyof typeof riskLevels]?.label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="flex flex-wrap gap-2">
                  {skill.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-between pt-4 border-t border-graphite/50">
                <div className="flex items-center gap-4 text-sm text-mist">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-vivid text-vivid" />
                    <span className="font-medium text-snow">{skill.rating}</span>
                    <span>({skill.review_count})</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Download className="h-4 w-4" />
                    <span>{skill.download_count.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-snow">
                    {formatPrice(skill.price)}
                  </span>
                </div>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {filteredSkills.length === 0 && (
        <div className="text-center py-20">
          <Zap className="h-12 w-12 text-mist mx-auto mb-4" />
          <h3 className="text-lg font-medium text-snow mb-2">
            No skills found
          </h3>
          <p className="text-mist">
            Try adjusting your search or filters
          </p>
        </div>
      )}

      {/* CTA */}
      <div className="mt-16 text-center">
        <p className="text-mist mb-4">
          Want to build and sell your own skills?
        </p>
        <Link href="/pal">
          <Button size="lg" className="gap-2">
            <Zap className="h-4 w-4" />
            Open PAL Studio
          </Button>
        </Link>
      </div>
    </div>
  )
}
