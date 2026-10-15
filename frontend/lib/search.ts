import { SKILLS, type Skill } from "@/lib/skills";

// Words that say nothing about which skill is wanted ("describe what you need done")
const STOPWORDS = new Set([
  "a", "an", "and", "the", "to", "for", "of", "on", "in", "with", "my", "me", "i",
  "it", "is", "do", "does", "that", "this", "what", "need", "needs", "want",
  "wants", "done", "get", "make", "help", "can", "you", "how", "up", "out",
  "into", "from", "about", "some", "all", "any",
]);

function tokenize(query: string): string[] {
  return query
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 2 && !STOPWORDS.has(t));
}

/**
 * Plain keyword match, honestly named: it is not semantic routing.
 * Every skill that mentions at least one word of the request is returned,
 * best match first (more words matched, then name hits over description hits). No query returns the whole
 * index A to Z.
 */
export function searchSkills(query: string, category = "All"): Skill[] {
  const pool =
    category === "All" ? SKILLS : SKILLS.filter((s) => s.category === category);
  const tokens = tokenize(query);

  if (tokens.length === 0) {
    // A query made only of stopwords falls back to a plain substring check
    const raw = query.trim().toLowerCase();
    const base = raw
      ? pool.filter(
          (s) =>
            s.name.toLowerCase().includes(raw) ||
            s.description.toLowerCase().includes(raw)
        )
      : pool;
    return [...base].sort((a, b) => a.name.localeCompare(b.name));
  }

  return pool
    .map((skill) => {
      const name = skill.name.toLowerCase();
      const desc = skill.description.toLowerCase();
      let score = 0;
      let matched = 0;
      for (const t of tokens) {
        // match at the start of a word, so "list" does not hit "playlist"
        const re = new RegExp(`(^|[^a-z0-9])${t}`);
        const hit = (re.test(name) ? 3 : 0) + (re.test(desc) ? 1 : 0);
        if (hit > 0) matched += 1;
        score += hit;
      }
      return { skill, score, matched };
    })
    .filter((r) => r.score > 0)
    // most distinct words matched first, then weighted score, then A to Z
    .sort(
      (a, b) =>
        b.matched - a.matched ||
        b.score - a.score ||
        a.skill.name.localeCompare(b.skill.name)
    )
    .map((r) => r.skill);
}
