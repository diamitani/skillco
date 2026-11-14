import { PlanButton } from "@/components/pricing/PlanButton";
import { BillingControls } from "@/components/dashboard/BillingControls";
import { getUser } from "@/lib/supabase/server";
import { OVERAGE_CENTS, PLANS, formatBytes, type PlanId } from "@/lib/billing/plans";

export const metadata = { title: "Billing & usage" };

export default async function Billing({ searchParams }: { searchParams: Promise<{ checkout?: string }> }) {
  const { checkout } = await searchParams;
  const { supabase, user } = await getUser();
  if (!supabase || !user) return null;
  const { data: p } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  const { data: events } = await supabase.from("usage_events").select("id, kind, quantity, unit, overage, created_at").eq("owner_id", user.id).order("created_at", { ascending: false }).limit(20);
  const planId = (p?.plan as PlanId) ?? "free";
  const plan = PLANS[planId];
  const paid = planId !== "free";

  return (
    <>
      <p className="t-mono text-xs text-link">dashboard/billing</p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight">Billing & usage</h1>
      {checkout === "success" && <p className="mt-4 rounded-md border border-ok/30 bg-ok/5 p-3 text-sm text-ok">Thanks! Your plan updates as soon as Stripe confirms the payment.</p>}

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Stat label="Plan" value={`${plan.name}${paid ? ` · $${plan.priceMonthly}/mo` : ""}`} />
        <Stat label="Generations this period" value={`${p?.credits_used ?? 0} / ${p?.credits_included ?? plan.credits}`} />
        <Stat label="Storage" value={`${formatBytes(p?.storage_bytes ?? 0)} / ${formatBytes(p?.storage_quota_bytes ?? plan.storageBytes)}`} />
      </div>
      {paid && (
        <p className="mt-3 text-sm text-fg-2">
          Overage this period: ${((p?.overage_cents_this_period ?? 0) / 100).toFixed(2)} of ${((p?.overage_cap_cents ?? 0) / 100).toFixed(2)} cap at ${(OVERAGE_CENTS[planId] / 100).toFixed(2)}/generation.
        </p>
      )}

      {!paid && (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-ultra bg-surface p-5">
            <h2 className="font-bold">Builder · $5.99/mo</h2>
            <p className="mt-1 text-sm text-fg-2">{PLANS.builder.credits} generations, strong model, plugin exports, {formatBytes(PLANS.builder.storageBytes)}.</p>
            <div className="mt-4"><PlanButton plan="builder" label="Upgrade to Builder" /></div>
          </div>
          <div className="rounded-xl border border-line bg-surface p-5">
            <h2 className="font-bold">Pro · $19.99/mo</h2>
            <p className="mt-1 text-sm text-fg-2">{PLANS.pro.credits} generations, {formatBytes(PLANS.pro.storageBytes)}, lower overage.</p>
            <div className="mt-4"><PlanButton plan="pro" label="Upgrade to Pro" variant="secondary" /></div>
          </div>
        </div>
      )}

      <div className="mt-6">
        <BillingControls userId={user.id} paid={paid} overageEnabled={!!p?.overage_enabled} capCents={p?.overage_cap_cents ?? 1000} />
      </div>

      <h2 className="mt-10 text-lg font-bold">Recent usage</h2>
      <ul className="mt-3 divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface text-sm">
        {(events ?? []).length === 0 && <li className="px-4 py-3 text-fg-3">No usage yet.</li>}
        {events?.map((e) => (
          <li key={e.id} className="flex justify-between px-4 py-3">
            <span>{e.kind} · {e.quantity} {e.unit}{e.overage && <span className="ml-2 text-xs text-warn">overage</span>}</span>
            <span className="text-fg-3">{new Date(e.created_at).toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-line bg-surface p-4">
      <div className="text-xs text-fg-3">{label}</div>
      <div className="mt-1 text-lg font-bold">{value}</div>
    </div>
  );
}
