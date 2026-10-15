import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/Button";
import { RevealMark } from "@/components/brand/RevealMark";

export function FinalCTA() {
  return (
    <section className="theme-dark dot-grid border-t border-line bg-bg py-20 text-fg md:py-28">
      <div className="mx-auto flex max-w-3xl flex-col items-center px-4 text-center sm:px-6 lg:px-8">
        <RevealMark size={72} />
        <h2 className="t-display mt-8 text-4xl md:text-6xl">Skills that work.</h2>
        <p className="mt-5 max-w-md text-lg text-fg-2">
          Pick one, add it to your agent, and put it to work.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/marketplace">
              Browse skills
              <ArrowRight weight="bold" className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <a href="/downloads/skill-library-full.zip" download="skill-library-full.zip">
              Download the full library
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
