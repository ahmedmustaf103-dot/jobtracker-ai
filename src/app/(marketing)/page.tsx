import { CtaSection } from "@/components/marketing/cta-section";
import { FeaturesSection } from "@/components/marketing/features-section";
import { HeroSection } from "@/components/marketing/hero-section";
import { ShowcaseSection } from "@/components/marketing/showcase-section";
import { StatsSection } from "@/components/marketing/stats-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <ShowcaseSection />
      <CtaSection />
    </>
  );
}
