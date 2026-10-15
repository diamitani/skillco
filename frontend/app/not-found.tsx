import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/sections/Footer";
import { Mark } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <>
      <Nav theme="light" />
      <main className="flex flex-1 items-center bg-bg">
        <div className="mx-auto max-w-xl px-4 py-24 text-center">
          <Mark tone="light" size={64} className="mx-auto" />
          <p className="t-mono mt-8 text-sm text-fg-3">404</p>
          <h1 className="t-display mt-2 text-4xl md:text-5xl">
            That skill isn&apos;t in the index.
          </h1>
          <p className="mt-4 text-fg-2">
            The page may have moved, or it never existed.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/marketplace">Browse all skills</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </>
  );
}
