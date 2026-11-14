/**
 * GitHub skills scraper.
 * Finds Agent Skills (SKILL.md folders) in public GitHub repos with >= MIN_STARS stars,
 * categorizes them, screens every skill for security issues, and writes the verified
 * library to data/github-skills.json (grade F skills are excluded and listed in the report).
 *
 * Usage:
 *   GITHUB_TOKEN=$(gh auth token) npx -y tsx scripts/scraper/github-skills.ts [--max-repos 800] [--min-stars 4]
 * Optional: SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY to upsert into public.catalog_skills.
 */
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { categorize } from "./categorize";
import { grade, scanFile, type Finding } from "./security";

const args = process.argv.slice(2);
const arg = (k: string, d: number) => { const i = args.indexOf(k); return i >= 0 ? Number(args[i + 1]) : d; };
const MIN_STARS = arg("--min-stars", 4);
const MAX_REPOS = arg("--max-repos", 800);
const MAX_SKILLS_PER_REPO = arg("--max-skills-per-repo", 60);
const CONCURRENCY = 8;
const TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
if (!TOKEN) { console.error("Set GITHUB_TOKEN (e.g. GITHUB_TOKEN=$(gh auth token))"); process.exit(1); }

const ROOT = path.resolve(__dirname, "../..");
const OUT_DIR = path.join(__dirname, "out");
const DATA_FILE = path.join(ROOT, "data", "github-skills.json");

const REPO_QUERIES = [
  "topic:agent-skills", "topic:claude-skills", "topic:claude-code-skills", "topic:agent-skill",
  "topic:skills-md", "topic:claude-code-plugin", "topic:codex-skills", "topic:cursor-skills",
  "\"SKILL.md\" in:readme", "\"agent skills\" in:name,description", "\"claude skills\" in:name,description",
  "skills in:name topic:claude-code", "\"skills\" in:name topic:ai-agents",
];
const CODE_QUERIES = ["filename:SKILL.md path:skills", "filename:SKILL.md path:.claude/skills", "filename:SKILL.md"];

interface Repo { full_name: string; stargazers_count: number; default_branch: string; fork: boolean; archived: boolean; license: { spdx_id: string } | null; pushed_at: string; description: string | null; html_url: string; owner: { login: string; avatar_url: string } }
export interface ScrapedSkill {
  id: string; name: string; description: string; category: string;
  repo: string; owner: string; stars: number; license: string | null; pushedAt: string;
  path: string; url: string; rawUrl: string; files: number;
  grade: "A" | "B" | "C" | "F"; findings: { rule: string; severity: string; file: string }[];
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
async function gh<T>(url: string, attempt = 0): Promise<T> {
  const res = await fetch(url.startsWith("http") ? url : `https://api.github.com${url}`, {
    headers: { Authorization: `Bearer ${TOKEN}`, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28", "User-Agent": "skillco-scraper" },
  });
  if (res.status === 403 || res.status === 429) {
    const reset = Number(res.headers.get("x-ratelimit-reset") || 0) * 1000;
    const retryAfter = Number(res.headers.get("retry-after") || 0) * 1000;
    const wait = Math.min(Math.max(retryAfter, reset - Date.now(), 15000), 120000);
    if (attempt > 6) throw new Error(`rate limited: ${url}`);
    console.warn(`  rate limit, waiting ${Math.round(wait / 1000)}s`);
    await sleep(wait);
    return gh<T>(url, attempt + 1);
  }
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return (await res.json()) as T;
}
async function raw(repo: string, branch: string, p: string) {
  const res = await fetch(`https://raw.githubusercontent.com/${repo}/${branch}/${p.split("/").map(encodeURIComponent).join("/")}`);
  return res.ok ? res.text() : null;
}
async function pool<T, R>(items: T[], n: number, fn: (t: T, i: number) => Promise<R>) {
  const out: R[] = []; let i = 0;
  await Promise.all(Array.from({ length: n }, async () => { while (i < items.length) { const k = i++; out[k] = await fn(items[k], k); } }));
  return out;
}

function parseFrontmatter(text: string) {
  const m = text.match(/^\uFEFF?---\s*\r?\n([\s\S]*?)\r?\n---/);
  const meta: Record<string, string> = {};
  if (!m) return meta;
  let key: string | null = null; let buf: string[] = [];
  const flush = () => { if (key) meta[key] = buf.join(" ").replace(/^[>|]-?\s*/, "").trim().replace(/^["']|["']$/g, ""); };
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (kv && !line.startsWith(" ")) { flush(); key = kv[1]; buf = [kv[2]]; } else buf.push(line.trim());
  }
  flush();
  return meta;
}

async function discoverRepos(): Promise<Map<string, Repo>> {
  const repos = new Map<string, Repo>();
  for (const q of REPO_QUERIES) {
    for (let page = 1; page <= 10; page++) {
      try {
        const r = await gh<{ items: Repo[] }>(`/search/repositories?q=${encodeURIComponent(`${q} stars:>=${MIN_STARS}`)}&sort=stars&order=desc&per_page=100&page=${page}`);
        r.items.forEach((x) => repos.set(x.full_name, x));
        if (r.items.length < 100) break;
        await sleep(2200); // search API: 30 req/min
      } catch (e) { console.warn("  repo search failed", q, (e as Error).message); break; }
    }
    console.log(`repo query "${q}" → ${repos.size} repos total`);
  }
  // code search finds repos that hold SKILL.md files without topics
  const codeRepos = new Set<string>();
  for (const q of CODE_QUERIES) {
    for (let page = 1; page <= 10; page++) {
      try {
        const r = await gh<{ items: { repository: { full_name: string } }[] }>(`/search/code?q=${encodeURIComponent(q)}&per_page=100&page=${page}`);
        r.items.forEach((x) => { if (!repos.has(x.repository.full_name)) codeRepos.add(x.repository.full_name); });
        if (r.items.length < 100) break;
        await sleep(6500); // code search: 10 req/min
      } catch (e) { console.warn("  code search failed", q, (e as Error).message); break; }
    }
    console.log(`code query "${q}" → ${codeRepos.size} extra candidate repos`);
  }
  await pool([...codeRepos].slice(0, MAX_REPOS * 2), CONCURRENCY, async (name) => {
    try { const r = await gh<Repo>(`/repos/${name}`); repos.set(r.full_name, r); } catch { /* deleted / private */ }
  });
  return repos;
}

async function scrapeRepo(repo: Repo): Promise<ScrapedSkill[]> {
  let tree: { tree: { path: string; type: string; size?: number }[]; truncated: boolean };
  try { tree = await gh(`/repos/${repo.full_name}/git/trees/${encodeURIComponent(repo.default_branch)}?recursive=1`); } catch { return []; }
  const skillMds = tree.tree.filter((t) => t.type === "blob" && /(^|\/)SKILL\.md$/.test(t.path) && !/node_modules|\/dist\/|\/\.git\//.test(t.path)).slice(0, MAX_SKILLS_PER_REPO);
  const out: ScrapedSkill[] = [];
  for (const md of skillMds) {
    const dir = md.path.includes("/") ? md.path.slice(0, md.path.lastIndexOf("/")) : "";
    const text = await raw(repo.full_name, repo.default_branch, md.path);
    if (!text) continue;
    const meta = parseFrontmatter(text);
    const name = meta.name || dir.split("/").pop() || repo.full_name.split("/")[1];
    const description = (meta.description || "").slice(0, 1024);
    if (!description) continue; // not a spec-valid skill
    const siblings = tree.tree.filter((t) => t.type === "blob" && (dir ? t.path.startsWith(dir + "/") : !t.path.includes("/")));
    const codeFiles = siblings.filter((t) => /\.(sh|bash|zsh|py|js|mjs|cjs|ts|ps1|rb|json|ya?ml)$/i.test(t.path) && (t.size ?? 0) < 120_000).slice(0, 10);
    const findings: Finding[] = scanFile(md.path, text);
    for (const f of codeFiles) {
      const c = await raw(repo.full_name, repo.default_branch, f.path);
      if (c) findings.push(...scanFile(f.path, c));
    }
    const g = grade(findings);
    out.push({
      id: `${repo.full_name}/${dir || "."}`.toLowerCase(),
      name: name.slice(0, 80), description, category: categorize(`${name} ${description} ${dir}`),
      repo: repo.full_name, owner: repo.owner.login, stars: repo.stargazers_count, license: repo.license?.spdx_id ?? null,
      pushedAt: repo.pushed_at, path: dir, files: siblings.length,
      url: `${repo.html_url}/tree/${repo.default_branch}/${dir}`,
      rawUrl: `https://raw.githubusercontent.com/${repo.full_name}/${repo.default_branch}/${md.path}`,
      grade: g, findings: findings.map((f) => ({ rule: f.rule, severity: f.severity, file: f.file })),
    });
  }
  return out;
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  await mkdir(path.dirname(DATA_FILE), { recursive: true });
  console.log(`Discovering repos (stars >= ${MIN_STARS}, max ${MAX_REPOS})…`);
  const all = await discoverRepos();
  const repos = [...all.values()]
    .filter((r) => r.stargazers_count >= MIN_STARS && !r.fork && !r.archived)
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, MAX_REPOS);
  console.log(`Scraping ${repos.length} repos…`);
  let done = 0;
  const results = (await pool(repos, CONCURRENCY, async (r) => {
    const s = await scrapeRepo(r).catch(() => []);
    if (++done % 25 === 0) console.log(`  ${done}/${repos.length} repos`);
    return s;
  })).flat();

  // de-duplicate identical skills mirrored across repos: keep the most-starred copy
  const byKey = new Map<string, ScrapedSkill>();
  for (const s of results) {
    const k = `${s.name.toLowerCase()}::${s.description.slice(0, 120).toLowerCase()}`;
    const cur = byKey.get(k);
    if (!cur || s.stars > cur.stars) byKey.set(k, s);
  }
  const unique = [...byKey.values()];
  const verified = unique.filter((s) => s.grade !== "F").sort((a, b) => b.stars - a.stars);
  const rejected = unique.filter((s) => s.grade === "F");
  const byCategory: Record<string, number> = {};
  verified.forEach((s) => (byCategory[s.category] = (byCategory[s.category] ?? 0) + 1));

  const summary = {
    generatedAt: new Date().toISOString(), minStars: MIN_STARS, reposScanned: repos.length,
    skillsFound: results.length, unique: unique.length, verified: verified.length, rejected: rejected.length,
    grades: { A: verified.filter((s) => s.grade === "A").length, B: verified.filter((s) => s.grade === "B").length, C: verified.filter((s) => s.grade === "C").length, F: rejected.length },
    byCategory,
  };
  await writeFile(DATA_FILE, JSON.stringify({ summary, skills: verified }, null, 1) + "\n");
  await writeFile(path.join(OUT_DIR, "report.json"), JSON.stringify({ summary, rejected }, null, 2));
  console.log(JSON.stringify(summary, null, 2));

  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (url && key) {
    const { createClient } = await import("@supabase/supabase-js");
    const db = createClient(url, key, { auth: { persistSession: false } });
    for (let i = 0; i < unique.length; i += 500) {
      const rows = unique.slice(i, i + 500).map((s) => ({
        id: s.id, name: s.name, description: s.description, category: s.category, repo: s.repo, owner: s.owner,
        stars: s.stars, license: s.license, path: s.path, url: s.url, raw_url: s.rawUrl, files: s.files,
        grade: s.grade, findings: s.findings, verified: s.grade !== "F", pushed_at: s.pushedAt, scanned_at: new Date().toISOString(),
      }));
      const { error } = await db.from("catalog_skills").upsert(rows);
      if (error) console.warn("supabase upsert failed", error.message);
    }
    console.log("Upserted to Supabase catalog_skills");
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
