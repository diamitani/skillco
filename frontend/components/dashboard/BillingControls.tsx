"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

export function BillingControls({ userId, paid, overageEnabled, capCents }: { userId: string; paid: boolean; overageEnabled: boolean; capCents: number }) {
  const router = useRouter();
  const [enabled, setEnabled] = useState(overageEnabled);
  const [cap, setCap] = useState(String(capCents / 100));
  const [msg, setMsg] = useState<string | null>(null);

  async function portal() {
    const res = await fetch("/api/stripe/portal", { method: "POST" });
    const data = await res.json().catch(() => ({}));
    if (data.url) window.location.href = data.url;
    else setMsg(data.error || "Billing portal unavailable");
  }

  async function saveOverage() {
    const supabase = createClient();
    if (!supabase) return;
    const cents = Math.max(0, Math.min(50000, Math.round(Number(cap) * 100) || 0));
    const { error } = await supabase.from("profiles").update({ overage_enabled: enabled, overage_cap_cents: cents }).eq("id", userId);
    setMsg(error ? error.message : "Saved");
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-line bg-surface p-5">
        <h2 className="font-bold">Overage</h2>
        <p className="mt-1 text-sm text-fg-2">When your monthly generations run out, keep building at the per-generation rate. Builds stop when the cap is reached.</p>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={enabled} disabled={!paid} onChange={(e) => setEnabled(e.target.checked)} />
            Allow overage {paid ? "" : "(paid plans only)"}
          </label>
          <label className="flex items-center gap-2 text-sm">
            Monthly cap $
            <input value={cap} onChange={(e) => setCap(e.target.value)} inputMode="decimal" className="h-9 w-24 rounded-md border border-line-strong bg-surface px-2" disabled={!paid} />
          </label>
          <Button variant="secondary" onClick={saveOverage} disabled={!paid}>Save</Button>
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        {paid && <Button onClick={portal}>Manage billing</Button>}
      </div>
      {msg && <p className="text-sm text-fg-2" role="status">{msg}</p>}
    </div>
  );
}
