"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

/** Starts Stripe Checkout for a paid plan; sends signed-out users to sign-in first. */
export function PlanButton({ plan, label, variant = "primary" }: { plan: "builder" | "pro"; label: string; variant?: "primary" | "secondary" }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function go() {
    setBusy(true);
    setMsg(null);
    const res = await fetch("/api/stripe/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ plan }) });
    if (res.status === 401) return router.push(`/sign-in?next=/pricing`);
    const data = await res.json().catch(() => ({}));
    if (data.url) return (window.location.href = data.url);
    setMsg(data.error || "Checkout isn't available yet.");
    setBusy(false);
  }

  return (
    <div>
      <Button className="w-full" variant={variant} onClick={go} disabled={busy}>
        {busy ? "Opening checkout…" : label}
      </Button>
      {msg && <p className="mt-2 text-xs text-fg-3">{msg}</p>}
    </div>
  );
}
