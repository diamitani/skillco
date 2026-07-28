"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  Sparkles, 
  Wand2, 
  Code2, 
  FileText, 
  Shield, 
  ChevronRight,
  Loader2,
  CheckCircle,
  AlertCircle,
  Lock,
  Zap
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

// Mock PAL templates
const templates = [
  {
    id: "api-client",
    name: "API Client",
    description: "Generate a TypeScript API client with error handling and typed responses",
    icon: Code2,
    category: "Development",
  },
  {
    id: "data-pipeline",
    name: "Data Pipeline",
    description: "ETL pipeline with monitoring, retries, and alerting",
    icon: Zap,
    category: "Data",
  },
  {
    id: "security-scanner",
    name: "Security Scanner",
    description: "Automated security scanning for codebases",
    icon: Shield,
    category: "Security",
  },
  {
    id: "automation-bot",
    name: "Automation Bot",
    description: "Workflow automation bot with multiple integrations",
    icon: Sparkles,
    category: "Automation",
  },
]

interface GeneratedSkill {
  name: string
  description: string
  code: string
  readme: string
  files: { name: string; content: string }[]
}

export default function PALPage() {
  const [isPro] = useState(false) // Would check subscription in real implementation
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [prompt, setPrompt] = useState("")
  const [generatedSkill, setGeneratedSkill] = useState<GeneratedSkill | null>(null)
  const [activeTab, setActiveTab] = useState("code")

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    
    setIsGenerating(true)
    // Simulate PAL generation
    await new Promise((resolve) => setTimeout(resolve, 3000))
    
    setGeneratedSkill({
      name: "Stripe Payment Handler",
      description: "A complete Stripe payment integration with webhook handling",
      code: `import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function createPaymentIntent(
  amount: number,
  currency: string = 'usd'
) {
  return stripe.paymentIntents.create({
    amount,
    currency,
    automatic_payment_methods: { enabled: true }
  })
}

export async function handleWebhook(payload: unknown, signature: string) {
  return stripe.webhooks.constructEvent(
    payload,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  )
}`,
      readme: `# Stripe Payment Handler

A complete Stripe payment integration with webhook handling.

## Features
- Payment intent creation
- Webhook signature verification
- Automatic payment methods
- TypeScript support

## Installation
\`\`\`bash
npm install stripe
\`\`\`

## Usage
See the source code for implementation details.`,
      files: [
        { name: "stripe.ts", content: "// Stripe integration code" },
        { name: "webhooks.ts", content: "// Webhook handler" },
        { name: "README.md", content: "# Documentation" },
      ],
    })
    setIsGenerating(false)
  }

  const handlePublish = () => {
    // Redirect to publish flow
    console.log("Publishing skill...")
  }

  if (!isPro) {
    return (
      <div className="container py-20">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-violet/10 mb-6">
            <Wand2 className="h-8 w-8 text-violet" />
          </div>
          <h1 className="font-display text-3xl font-bold text-snow mb-4">
            PAL Skill Builder
          </h1>
          <p className="text-lg text-mist mb-8">
            Build skills with natural language. Our AI generates production-ready code, 
            documentation, and security scanning — all in minutes.
          </p>
          
          <Card className="border-graphite mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-violet" />
                Pro Feature
              </CardTitle>
              <CardDescription>
                PAL is available on Pro plans and above
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3 text-left">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-violet shrink-0 mt-0.5" />
                  <span className="text-snow">Generate skills from natural language</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-violet shrink-0 mt-0.5" />
                  <span className="text-snow">Automatic documentation generation</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-violet shrink-0 mt-0.5" />
                  <span className="text-snow">Built-in security scanning</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-violet shrink-0 mt-0.5" />
                  <span className="text-snow">Sell skills on the marketplace (70% revenue share)</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Link href="/pricing" className="w-full">
                <Button className="w-full gap-2">
                  Upgrade to Pro
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <div className="grid md:grid-cols-2 gap-4 text-left">
            <Card className="border-graphite">
              <CardHeader>
                <CardTitle className="text-sm">Example Prompts</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-mist">
                  <li>"Create a Slack bot that summarizes daily standups"</li>
                  <li>"Build an Airtable to HubSpot sync with conflict resolution"</li>
                  <li>"Generate a Python script that monitors website uptime"</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="border-graphite">
              <CardHeader>
                <CardTitle className="text-sm">How It Works</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2 text-sm text-mist list-decimal list-inside">
                  <li>Describe what you need in plain English</li>
                  <li>PAL generates complete code + docs</li>
                  <li>Review and iterate if needed</li>
                  <li>Publish to marketplace and earn</li>
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Wand2 className="h-6 w-6 text-violet" />
          <Badge variant="secondary" className="text-xs">BETA</Badge>
        </div>
        <h1 className="font-display text-3xl font-bold text-snow">
          PAL Skill Builder
        </h1>
        <p className="text-mist mt-1">
          Describe what you need. Our AI generates production-ready skills.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_1.5fr] gap-8">
        {/* Left Panel - Input */}
        <div className="space-y-6">
          {/* Templates */}
          <Card className="border-graphite">
            <CardHeader>
              <CardTitle className="text-sm">Start with a Template</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => {
                      setSelectedTemplate(template.id)
                      setPrompt(`Create a ${template.name.toLowerCase()} that...`)
                    }}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-lg border text-left transition-colors",
                      selectedTemplate === template.id
                        ? "border-violet bg-violet/5"
                        : "border-graphite hover:border-violet/50"
                    )}
                  >
                    <div className="w-8 h-8 rounded bg-slate flex items-center justify-center shrink-0">
                      <template.icon className="h-4 w-4 text-violet" />
                    </div>
                    <div>
                      <div className="font-medium text-snow text-sm">{template.name}</div>
                      <div className="text-xs text-mist">{template.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Prompt Input */}
          <Card className="border-graphite">
            <CardHeader>
              <CardTitle className="text-sm">Describe Your Skill</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Describe what you need... For example: 'Create a Slack bot that sends daily standup reminders and collects responses'"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[120px] resize-none"
              />
              <Button 
                className="w-full gap-2" 
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate Skill
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Tips */}
          <div className="p-4 rounded-lg bg-slate border border-graphite">
            <h4 className="text-sm font-medium text-snow mb-2 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-warning" />
              Tips for better results
            </h4>
            <ul className="text-xs text-mist space-y-1">
              <li>• Be specific about inputs and outputs</li>
              <li>• Mention integrations (e.g., "connect to HubSpot")</li>
              <li>• Specify error handling requirements</li>
              <li>• Include platform preferences (e.g., "TypeScript", "Python")</li>
            </ul>
          </div>
        </div>

        {/* Right Panel - Output */}
        <div>
          {generatedSkill ? (
            <Card className="border-graphite">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{generatedSkill.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {generatedSkill.description}
                    </CardDescription>
                  </div>
                  <Badge variant="success" className="shrink-0">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Generated
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3 mb-4">
                    <TabsTrigger value="code">Code</TabsTrigger>
                    <TabsTrigger value="readme">Docs</TabsTrigger>
                    <TabsTrigger value="files">Files</TabsTrigger>
                  </TabsList>
                  <TabsContent value="code" className="mt-0">
                    <div className="relative">
                      <pre className="bg-slate rounded-lg p-4 overflow-x-auto text-sm font-mono">
                        <code className="text-snow">{generatedSkill.code}</code>
                      </pre>
                    </div>
                  </TabsContent>
                  <TabsContent value="readme" className="mt-0">
                    <div className="prose prose-invert max-w-none">
                      <div className="bg-slate rounded-lg p-4">
                        <pre className="whitespace-pre-wrap text-sm text-mist font-mono">
                          {generatedSkill.readme}
                        </pre>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="files" className="mt-0">
                    <div className="space-y-2">
                      {generatedSkill.files.map((file) => (
                        <div 
                          key={file.name}
                          className="flex items-center justify-between p-3 rounded-lg bg-slate"
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-mist" />
                            <span className="text-sm text-snow">{file.name}</span>
                          </div>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setGeneratedSkill(null)}
                >
                  Regenerate
                </Button>
                <Button 
                  className="flex-1 gap-2"
                  onClick={handlePublish}
                >
                  <Sparkles className="h-4 w-4" />
                  Publish to Marketplace
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card className="border-graphite border-dashed">
              <CardContent className="py-20 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate mb-4">
                  <Wand2 className="h-8 w-8 text-mist" />
                </div>
                <h3 className="text-lg font-medium text-snow mb-2">
                  Ready to build
                </h3>
                <p className="text-mist max-w-sm mx-auto">
                  Enter a prompt on the left to generate your first skill with PAL
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
