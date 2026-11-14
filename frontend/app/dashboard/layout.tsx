import Link from "next/link";
import { redirect } from "next/navigation";
import { Books, CreditCard, Lightning, MagnifyingGlass, SignOut } from "@phosphor-icons/react/dist/ssr";
import { Logo } from "@/components/brand/Logo";
import { getUser } from "@/lib/supabase/server";
import { PLANS, formatBytes, type PlanId } from "@/lib/billing/plans";

export const dynamic = "force-dynamic";

const nav = [
  { href: "/dashboard/new", label: "New skill", icon: Lightning },
  { href: "/dashboard", label: "My skills", icon: Books },
  { href: "/marketplace", label: "Catalog", icon: MagnifyingGlass },
  { href: "/dashboard/billing", label: "Billing & usage", icon: CreditCard },
];

/** Dashboard shell: left rail with nav + usage meter (Replicate-style account sidebar). */
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { supabase, user } = await getUser();
  if (!supabase || !user) redirect("/sign-in?next=/dashboard");

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan, credits_included, credits_used, storage_bytes, storage_quota_bytes, full_name, avatar_url")
    .eq("id", user.id)
    .single();
  const plan = PLANS[(profile?.plan as PlanId) ?? "free"];
  const used = profile?.credits_used ?? 0;
  const included = profile?.credits_included ?? plan.credits;
  const pct = Math.min(100, Math.round((used / Math.max(1, included)) * 100));

  return (
    <div className="flex min-h-screen flex-1 bg-bg">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-line bg-surface md:flex">
        <div className="flex h-16 items-center border-b border-line px-5">
          <Link href="/" aria-label="SkillCo home"><Logo tone="light" height={28} /></Link>
        </div>
        <nav className="flex-1 space-y-1 p-3" aria-label="Dashboard">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold text-fg-2 hover:bg-surface-2 hover:text-fg">
              <n.icon weight="bold" className="h-4 w-4" />
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-line p-4 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-fg">{plan.name} plan</span>
            <Link href="/pricing" className="text-link hover:underline">Upgrade</Link>
          </div>
          <div className="mt-3 text-fg-3">Generations {used} / {included}</div>
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
            <div className="h-full bg-ultra" style={{ width: `${pct}%` }} />
          </div>
          <div className="mt-2 text-fg-3">
            Storage {formatBytes(profile?.storage_bytes ?? 0)} / {formatBytes(profile?.storage_quota_bytes ?? plan.storageBytes)}
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="truncate text-fg-2">{user.email}</span>
            <form action="/auth/sign-out" method="post">
              <button type="submit" aria-label="Sign out" className="text-fg-3 hover:text-fg"><SignOut className="h-4 w-4" /></button>
            </form>
          </div>
        </div>
      </aside>
      <div className="min-w-0 flex-1">
        <header className="flex h-16 items-center justify-between border-b border-line bg-surface px-4 md:hidden">
          <Link href="/"><Logo tone="light" height={26} /></Link>
          <div className="flex gap-4 text-sm font-semibold">
            <Link href="/dashboard">Skills</Link>
            <Link href="/dashboard/new">New</Link>
            <Link href="/dashboard/billing">Billing</Link>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
