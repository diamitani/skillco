import { Nav } from "@/components/Nav";
import { Hero } from "@/components/sections/Hero";
import { SkillsShowcase } from "@/components/sections/SkillsShowcase";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Platforms } from "@/components/sections/Platforms";
import { FeaturedMakers } from "@/components/sections/FeaturedMakers";
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
        <FeaturedMakers />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
