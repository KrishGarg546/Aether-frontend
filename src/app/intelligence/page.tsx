// src/app/intelligence/page.tsx
// Redesign — "Observing the mind of an autonomous marketing agent."

"use client";

import { Loader2, AlertTriangle } from "lucide-react";
import { IntelligenceHeader } from "@/components/intelligence/intelligence-header";
import { CustomerStoryEvolution } from "@/components/intelligence/customer-story-evolution";
import { CustomerHealthMap } from "@/components/intelligence/customer-health-map";
import { CampaignSelectionIntelligence } from "@/components/intelligence/campaign-selection-intelligence";
import { ProductAffinity } from "@/components/intelligence/product-affinity";
import { LearningLoop } from "@/components/intelligence/learning-loop";
import { StrategicMemory } from "@/components/intelligence/strategic-memory";
import { PerformanceInsights } from "@/components/intelligence/performance-insights";
import { useIntelligence } from "@/hooks/use-intelligence";

export default function IntelligencePage() {
  const { summary, isLoading, isError, error } = useIntelligence();

  return (
    <main className="flex min-h-screen w-full justify-center bg-slate-950 px-6 py-16">
      <div className="flex w-full max-w-5xl flex-col gap-16">
        <IntelligenceHeader totalCampaigns={summary?.totalCampaigns ?? 0} />

        {summary && !isLoading && !isError && (
          <div className="flex flex-col gap-24">
            {/* 0. Executive Intelligence — what Aether has accomplished */}
            <div id="executive-intelligence">
              <PerformanceInsights summary={summary} />
            </div>

            {/* 1. Customer Story Evolution — narrative intelligence */}
            <div id="customer-memory">
              <CustomerStoryEvolution summary={summary} />
            </div>

            {/* 2. Customer Health — state-awareness intelligence */}
            <div id="customer-health">
              <CustomerHealthMap summary={summary} />
            </div>

            {/* 3. Campaign Selection — decision intelligence */}
            <div id="decision-intelligence">
              <CampaignSelectionIntelligence summary={summary} />
            </div>

            {/* 4. Product Affinity — real co-purchase intelligence */}
            <div id="product-affinity">
              <ProductAffinity summary={summary} />
            </div>

            {/* 5. Learning Loop — observation → recommendation → adjustment → outcome */}
            <div id="adaptive-intelligence">
              <LearningLoop summary={summary} />
            </div>

            {/* 6. Strategic Memory — durable patterns from repeated missions */}
            <div id="strategic-memory">
              <StrategicMemory summary={summary} />
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex items-center justify-center gap-2 py-12 text-sm text-slate-400">
            <Loader2 className="size-4 animate-spin" />
            Analyzing mission history...
          </div>
        )}

        {isError && (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-rose-500/30 bg-rose-500/5 px-6 py-10 text-center text-sm text-rose-400">
            <AlertTriangle className="size-6" />
            {error instanceof Error
              ? error.message
              : typeof error === "string"
                ? error
                : error && typeof error === "object" && "message" in error
                  ? String((error as { message?: unknown }).message)
                  : "Failed to load campaign intelligence."}
          </div>
        )}
      </div>
    </main>
  );
}