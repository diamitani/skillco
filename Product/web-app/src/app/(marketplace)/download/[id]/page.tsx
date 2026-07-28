"use client"

import { useState } from "react"
import Link from "next/link"
import { CheckCircle, Download, FileCode, Lock, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

// Mock download data
const mockDownload = {
  skill: {
    id: "2",
    name: "API Security Scanner",
    slug: "api-security-scanner",
    vendor: "security-experts",
    version: "1.2.0",
    risk_level: "safe",
    files: [
      { name: "README.md", size: "2.4 KB" },
      { name: "package.json", size: "1.1 KB" },
      { name: "src/scanner.ts", size: "15.2 KB" },
      { name: "src/rules.ts", size: "8.7 KB" },
      { name: "tests/scanner.test.ts", size: "4.3 KB" },
    ],
  },
  download_url: "https://cdn.skillco.work/skills/api-security-scanner-v1.2.0.zip",
}

interface DownloadPageProps {
  params: { id: string }
}

export default function DownloadPage({ params }: DownloadPageProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadComplete, setDownloadComplete] = useState(false)
  const [isAuthenticated] = useState(false) // Would check auth in real implementation

  const handleDownload = async () => {
    setIsDownloading(true)
    // Simulate download
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsDownloading(false)
    setDownloadComplete(true)
  }

  if (!isAuthenticated) {
    return (
      <div className="container py-20">
        <div className="max-w-md mx-auto text-center">
          <Lock className="h-12 w-12 text-violet mx-auto mb-6" />
          <h1 className="font-display text-2xl font-bold text-snow mb-4">
            Sign in to Download
          </h1>
          <p className="text-mist mb-8">
            Create a free account to download skills from the marketplace.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/login">
              <Button size="lg">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button variant="outline" size="lg">Create Account</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <Shield className="h-12 w-12 text-success mx-auto mb-4" />
          <h1 className="font-display text-3xl font-bold text-snow mb-2">
            Ready to Download
          </h1>
          <p className="text-mist">
            Your skill has been verified and is ready for download
          </p>
        </div>

        {/* Skill Info */}
        <Card className="border-graphite mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{mockDownload.skill.name}</CardTitle>
                <CardDescription>
                  v{mockDownload.skill.version} • by {mockDownload.skill.vendor}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2 text-success">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm font-medium">Verified</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Separator className="bg-graphite" />
            
            <div>
              <h3 className="text-sm font-medium text-snow mb-3">
                Included Files
              </h3>
              <div className="space-y-2">
                {mockDownload.skill.files.map((file) => (
                  <div 
                    key={file.name}
                    className="flex items-center justify-between p-2 rounded bg-slate"
                  >
                    <div className="flex items-center gap-2">
                      <FileCode className="h-4 w-4 text-mist" />
                      <span className="text-sm text-snow">{file.name}</span>
                    </div>
                    <span className="text-xs text-mist">{file.size}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Download Action */}
        <Card className="border-graphite">
          <CardContent className="pt-6">
            {downloadComplete ? (
              <div className="text-center py-4">
                <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
                <h3 className="font-display text-xl font-semibold text-snow mb-2">
                  Download Complete!
                </h3>
                <p className="text-mist mb-6">
                  Your skill has been downloaded. Check your downloads folder.
                </p>
                <div className="flex gap-4 justify-center">
                  <Link href="/marketplace">
                    <Button variant="outline">Browse More Skills</Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button>Go to Dashboard</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <Button
                  size="lg"
                  className="w-full gap-2"
                  onClick={handleDownload}
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      Download Now
                    </>
                  )}
                </Button>
                <p className="text-xs text-mist mt-4">
                  Download includes all source files and documentation
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="mt-8 p-4 bg-success/5 rounded-lg border border-success/20">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-success shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-snow mb-1">Security Verified</h4>
              <p className="text-sm text-mist">
                This skill has passed our automated security scanning. 
                No critical or high-severity vulnerabilities were detected.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
