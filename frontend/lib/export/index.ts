import JSZip from "jszip";
import { parseSkillMd, toSlug, yamlQuote } from "@/lib/builder/skillmd";
import type { SkillFiles } from "@/lib/builder/schemas";

import { EXPORT_FORMATS, type ExportFormat } from "@/lib/export/formats";
export { EXPORT_FORMATS, type ExportFormat };

interface SkillMeta {
  slug: string;
  name: string;
  description: string;
  version: string;
  author: string;
}

function meta(files: SkillFiles, slug: string, version = 1, author = "SkillCo"): SkillMeta & { body: string } {
  const { meta: m, body } = parseSkillMd(files["SKILL.md"] || "");
  const title = body.match(/^#\s+(.+)$/m)?.[1]?.trim() || m.name || slug;
  return { slug: toSlug(m.name || slug), name: title, description: m.description || "", version: `${version}.0.0`, author, body };
}

function addSkillDir(zip: JSZip, base: string, files: SkillFiles) {
  for (const [p, c] of Object.entries(files)) zip.file(`${base}/${p}`, c);
}

export async function buildExport(format: ExportFormat, files: SkillFiles, slug: string, version = 1, author = "SkillCo") {
  const m = meta(files, slug, version, author);
  const zip = new JSZip();
  const root = `${m.slug}-${format}`;

  switch (format) {
    case "agent-skills":
      addSkillDir(zip, m.slug, files);
      break;

    case "cursor": {
      const plugin = {
        name: `skillco-${m.slug}`.slice(0, 64),
        displayName: m.name,
        version: m.version,
        description: m.description.slice(0, 300),
        author: { name: m.author },
        homepage: "https://www.skillco.work",
        license: "MIT",
        keywords: ["skillco", "agent-skills"],
        skills: "skills/",
        rules: "rules/",
      };
      zip.file(`${root}/.cursor-plugin/plugin.json`, JSON.stringify(plugin, null, 2) + "\n");
      addSkillDir(zip, `${root}/skills/${m.slug}`, files);
      zip.file(
        `${root}/rules/${m.slug}.mdc`,
        `---\ndescription: ${yamlQuote(m.description)}\nglobs:\nalwaysApply: false\n---\n\nWhen this applies, follow the \`${m.slug}\` skill in skills/${m.slug}/SKILL.md.\n`
      );
      zip.file(`${root}/README.md`, `# ${m.name}\n\n${m.description}\n\nInstall: Cursor → Settings → Plugins → add local plugin folder, or publish this folder in a plugin marketplace repo.\n\nBuilt with https://www.skillco.work\n`);
      break;
    }

    case "claude": {
      const pluginName = `skillco-${m.slug}`.slice(0, 64);
      zip.file(
        `${root}/.claude-plugin/marketplace.json`,
        JSON.stringify(
          { name: "skillco", owner: { name: m.author }, plugins: [{ name: pluginName, source: `./plugins/${pluginName}`, description: m.description.slice(0, 300), version: m.version }] },
          null, 2
        ) + "\n"
      );
      zip.file(
        `${root}/plugins/${pluginName}/.claude-plugin/plugin.json`,
        JSON.stringify({ name: pluginName, description: m.description.slice(0, 300), version: m.version, author: { name: m.author }, homepage: "https://www.skillco.work" }, null, 2) + "\n"
      );
      addSkillDir(zip, `${root}/plugins/${pluginName}/skills/${m.slug}`, files);
      zip.file(`${root}/README.md`, `# ${m.name}\n\nPush this folder to a GitHub repo, then in Claude Code:\n\n\`\`\`\n/plugin marketplace add <owner>/<repo>\n/plugin install ${pluginName}@skillco\n\`\`\`\n`);
      break;
    }

    case "codex":
      zip.file(`${root}/AGENTS.md`, `# ${m.name}\n\n${m.description}\n\n${stripTitle(m.body)}`);
      addRefs(zip, root, files);
      break;

    case "gemini":
      zip.file(`${root}/gemini-extension.json`, JSON.stringify({ name: m.slug, version: m.version, contextFileName: "GEMINI.md" }, null, 2) + "\n");
      zip.file(`${root}/GEMINI.md`, `# ${m.name}\n\n${m.description}\n\n${stripTitle(m.body)}`);
      addRefs(zip, root, files);
      break;

    case "openai": {
      zip.file(`${root}/AGENTS.md`, `# ${m.name}\n\n${m.description}\n\n${stripTitle(m.body)}`);
      let instructions = `You are running the '${m.name}' skill.\n\nWhen to use: ${m.description}\n\n${stripTitle(m.body)}`;
      if (instructions.length > 8000) instructions = instructions.slice(0, 7997).trimEnd() + "...";
      zip.file(`${root}/instructions.md`, instructions);
      addRefs(zip, root, files);
      break;
    }
  }

  const data = await zip.generateAsync({ type: "uint8array", compression: "DEFLATE" });
  return { data, filename: `${format === "agent-skills" ? m.slug : root}.zip` };
}

function stripTitle(body: string) {
  return body.replace(/^#\s+.+\n+/, "");
}
function addRefs(zip: JSZip, root: string, files: SkillFiles) {
  for (const [p, c] of Object.entries(files)) if (p !== "SKILL.md") zip.file(`${root}/${p}`, c);
}
