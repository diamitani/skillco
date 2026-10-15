import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/sections/Footer";
import { MarketplaceClient } from "@/components/marketplace/MarketplaceClient";

export const metadata: Metadata = {
  title: "Browse skills",
  description:
    "The SkillCo index: ready-to-install skills for AI agents. Search by the job you need done, filter by category, and download a skill as a zip.",
};

export default async function Marketplace({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const { q } = await searchParams;
  const initialQuery = Array.isArray(q) ? q[0] : (q ?? "");

  return (
    <>
      <Nav theme="light" />
      <main className="flex-1">
        <MarketplaceClient initialQuery={initialQuery} />
      </main>
      <Footer />
    </>
  );
}
