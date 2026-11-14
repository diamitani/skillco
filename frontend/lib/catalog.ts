import "server-only";
import { readFile } from "fs/promises";
import path from "path";
import JSZip from "jszip";

/** Read the files of a catalog skill straight from its public zip (build time). */
export async function readCatalogSkill(id: string): Promise<Record<string, string>> {
  try {
    const buf = await readFile(path.join(process.cwd(), "public", "downloads", `${id}.zip`));
    const zip = await JSZip.loadAsync(buf);
    const out: Record<string, string> = {};
    const entries = Object.values(zip.files).filter((f) => !f.dir && /\.(md|json|txt|ya?ml|py|sh|js|ts)$/i.test(f.name));
    for (const f of entries.slice(0, 30)) {
      const rel = f.name.replace(/^[^/]+\//, "");
      out[rel || f.name] = (await f.async("string")).slice(0, 60000);
    }
    return out;
  } catch {
    return {};
  }
}
