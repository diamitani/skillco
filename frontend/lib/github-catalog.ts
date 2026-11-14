import "server-only";
import { readFile } from "fs/promises";
import path from "path";

export interface GithubSkill {
  id: string; name: string; description: string; category: string;
  repo: string; owner: string; stars: number; license: string | null; pushedAt: string;
  path: string; url: string; rawUrl: string; files: number;
  grade: "A" | "B" | "C" | "F"; findings: { rule: string; severity: string; file: string }[];
}
export interface GithubCatalog {
  summary: { generatedAt: string; minStars: number; reposScanned: number; verified: number; rejected: number; grades: Record<string, number>; byCategory: Record<string, number> } | null;
  skills: GithubSkill[];
}

/** Verified GitHub skills produced by scripts/scraper/github-skills.ts (data/github-skills.json). */
export async function loadGithubCatalog(): Promise<GithubCatalog> {
  try {
    const txt = await readFile(path.join(process.cwd(), "data", "github-skills.json"), "utf8");
    return JSON.parse(txt) as GithubCatalog;
  } catch {
    return { summary: null, skills: [] };
  }
}
