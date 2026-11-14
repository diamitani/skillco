/** Keyword categorizer for scraped skills. First category with the highest score wins. */
export const SCRAPED_CATEGORIES = [
  "AI Agents", "Dev Tools", "Frontend & Design", "Data & Analytics", "DevOps & Cloud", "Security",
  "Automation", "Marketing & Sales", "Docs & Writing", "Media & Music", "Productivity", "Finance & Legal", "Other",
] as const;
export type ScrapedCategory = (typeof SCRAPED_CATEGORIES)[number];

const KEYWORDS: Record<Exclude<ScrapedCategory, "Other">, string[]> = {
  "AI Agents": ["agent", "llm", "prompt", "mcp", "subagent", "rag", "embedding", "claude", "gpt", "orchestrat", "memory"],
  "Dev Tools": ["code", "refactor", "test", "debug", "git", "typescript", "python", "rust", "api", "review", "lint", "repo", "cli", "sdk"],
  "Frontend & Design": ["ui", "ux", "design", "css", "tailwind", "react", "frontend", "figma", "component", "animation", "web design"],
  "Data & Analytics": ["data", "sql", "database", "postgres", "analytics", "csv", "excel", "spreadsheet", "etl", "pandas", "chart"],
  "DevOps & Cloud": ["deploy", "docker", "kubernetes", "aws", "azure", "gcp", "terraform", "ci", "cloudflare", "vercel", "infra"],
  Security: ["security", "vulnerab", "pentest", "audit", "threat", "cve", "secret", "auth", "owasp"],
  Automation: ["automat", "workflow", "zapier", "n8n", "schedule", "cron", "scrape", "browser", "playwright"],
  "Marketing & Sales": ["marketing", "seo", "sales", "lead", "crm", "hubspot", "outreach", "ads", "social media", "brand", "copywriting"],
  "Docs & Writing": ["doc", "write", "writing", "markdown", "pdf", "docx", "blog", "report", "readme", "translation"],
  "Media & Music": ["video", "image", "audio", "music", "podcast", "remotion", "photo", "media", "song"],
  Productivity: ["notion", "slack", "email", "calendar", "meeting", "task", "todo", "asana", "jira", "linear", "productivity"],
  "Finance & Legal": ["finance", "invoice", "accounting", "tax", "legal", "contract", "compliance", "stock", "trading"],
};

export function categorize(text: string): ScrapedCategory {
  const t = text.toLowerCase();
  let best: ScrapedCategory = "Other";
  let bestScore = 0;
  for (const [cat, words] of Object.entries(KEYWORDS)) {
    let s = 0;
    for (const w of words) if (new RegExp(`(^|[^a-z])${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`).test(t)) s++;
    if (s > bestScore) { best = cat as ScrapedCategory; bestScore = s; }
  }
  return best;
}
