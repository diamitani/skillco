import { Nav } from "@/components/Nav";
import { Hero } from "@/components/sections/Hero";
import { SkillsShowcase } from "@/components/sections/SkillsShowcase";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Platforms } from "@/components/sections/Platforms";
import { LibraryStats } from "@/components/sections/LibraryStats";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <Hero />
        <SkillsShowcase />
        <HowItWorks />
        <Platforms />
        <LibraryStats />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
