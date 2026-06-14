import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { CoreCapabilities } from "@/components/landing/core-capabilities";
import { ProductShowcase } from "@/components/landing/product-showcase";
import { WhyAether } from "@/components/landing/why-aether";
import { FinalCta } from "@/components/landing/final-cta";

export default function Home() {
  return (
    <main className="w-full bg-slate-950">
      {/* 1. Hero — client island (PipelineViz owns animation state) */}
      <Hero />

      {/* 2. How It Works — pipeline stages explained sequentially */}
      <HowItWorks />

      {/* 3. Core Capabilities — four intelligence pillars */}
      <CoreCapabilities />

      {/* 4. Product Showcase — linked cards to each app section */}
      <ProductShowcase />

      {/* 5. Why Aether — comparison against traditional workflow */}
      <WhyAether />

      {/* 6. Final CTA — close with the mission prompt */}
      <FinalCta />
    </main>
  );
}