import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "@phosphor-icons/react/dist/ssr";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/sections/Footer";
import { Button } from "@/components/ui/Button";
import { PlanButton } from "@/components/pricing/PlanButton";
import { PLANS, STORAGE_ADDON, formatBytes } from "@/lib/billing/plans";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Free to browse. $5.99/month to build, version, and export your own agent skills.",
};

const order = ["free", "builder", "pro"] as const;

export default function Pricing() {
  return (
    <>
      <Nav theme="light" />
      <main className="flex-1">
        <section className="border-b border-line">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-20 lg:px-8">
            <p className="t-mono mb-4 text-xs text-link">skillco.work/pricing</p>
            <h1 className="t-display text-4xl md:text-6xl">Pricing</h1>
            <p className="mt-4 max-w-xl text-lg text-fg-2">
              The catalog stays free. Pay only to build your own skills. One generation is one complete skill:
              research, tools, step plan, SKILL.md, references and a quality check.
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
            {order.map((id) => {
              const p = PLANS[id];
              const featured = id === "builder";
              return (
                <div key={id} className={cn("flex flex-col rounded-xl border bg-surface p-6", featured ? "border-ultra ring-2 ring-ultra/20" : "border-line")}>
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">{p.name}</h2>
                    {featured && <span className="rounded-full bg-lime px-2 py-0.5 text-xs font-bold text-ink">Most popular</span>}
                  </div>
                  <p className="mt-4">
                    <span className="text-4xl font-extrabold tracking-tight">${p.priceMonthly}</span>
                    <span className="text-fg-3">/mo</span>
                  </p>
                  <p className="t-mono mt-1 text-xs text-fg-3">
                    {p.credits} generations · {formatBytes(p.storageBytes)}
                  </p>
                  <ul className="mt-6 flex-1 space-y-2 text-sm text-fg-2">
                    {p.features.map((f) => (
                      <li key={f} className="flex gap-2">
                        <Check weight="bold" className="mt-0.5 h-4 w-4 shrink-0 text-ok" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6">
                    {id === "free" ? (
                      <Button asChild variant="secondary" className="w-full">
                        <Link href="/sign-in">Start free</Link>
                      </Button>
                    ) : (
                      <PlanButton plan={id} label={`Get ${p.name}`} variant={featured ? "primary" : "secondary"} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mx-auto mt-10 max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-5 rounded-xl border border-line bg-surface p-6 text-sm text-fg-2 md:grid-cols-3">
              <div>
                <h3 className="font-bold text-fg">Overage, capped</h3>
                <p className="mt-1">Past your monthly generations, Builder is $0.49 and Pro $0.39 per generation. Off by default, with a monthly cap you set ($10 default).</p>
              </div>
              <div>
                <h3 className="font-bold text-fg">Storage add-on</h3>
                <p className="mt-1">+{formatBytes(STORAGE_ADDON.bytes)} for ${STORAGE_ADDON.priceMonthly}/mo on any paid plan.</p>
              </div>
              <div>
                <h3 className="font-bold text-fg">Teams</h3>
                <p className="mt-1">${PLANS.team.priceMonthly}/mo for 3 seats, {PLANS.team.credits} shared generations and a shared library.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
