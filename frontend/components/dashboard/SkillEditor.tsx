"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { FileViewer } from "@/components/dashboard/FileViewer";

export function SkillEditor({ skillId, files: initial, readOnly }: { skillId: string; files: Record<string, string>; readOnly?: boolean }) {
  const router = useRouter();
  const [files, setFiles] = useState(initial);
  const [note, setNote] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const dirty = JSON.stringify(files) !== JSON.stringify(initial);

  async function save() {
    setBusy(true);
    setMsg(null);
    const res = await fetch(`/api/skills/${skillId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ files, changeNote: note || undefined }) });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setMsg(data.lint ? data.lint.map((l: { message: string }) => l.message).join("; ") : data.error || "Save failed");
      return;
    }
    setMsg(`Saved as version ${data.version}`);
    setNote("");
    router.refresh();
  }

  async function addFile() {
    const p = prompt("New file path (e.g. references/examples.md)");
    if (!p || !/^(references|scripts|assets)\/[A-Za-z0-9._/-]+$/.test(p)) return;
    setFiles({ ...files, [p]: "" });
  }

  return (
    <div className="space-y-3">
      <FileViewer files={files} editable={!readOnly} onChange={setFiles} />
      {!readOnly && (
        <div className="flex flex-wrap items-center gap-3">
          <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Change note (optional)" className="h-11 flex-1 rounded-md border border-line-strong bg-surface px-3 text-sm" />
          <Button variant="secondary" onClick={addFile}>Add file</Button>
          <Button onClick={save} disabled={!dirty || busy}>{busy ? "Saving…" : "Save new version"}</Button>
        </div>
      )}
      {msg && <p className="text-sm text-fg-2" role="status">{msg}</p>}
    </div>
  );
}
