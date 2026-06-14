// src/app/learnings/page.tsx
// "How has Aether evolved through experience?"
//
// Aether's accumulated field journal: experience profiles, internalized
// lessons, meaningful milestones, and observations derived from repeated
// mission execution — all grounded in useIntelligence().summary.

"use client";

import { useIntelligence } from "@/hooks/use-intelligence";
import { LearningProfile } from "@/components/learnings/learning-profile";
import { EvolutionFeed } from "@/components/learnings/evolution-feed";
import { InternalizedLessons } from "@/components/learnings/internalized-lessons";
import { ObservedPatterns } from "@/components/learnings/accumulated-observations";

export default function LearningsPage() {
  const { summary, isLoading, isError } = useIntelligence();

  return (
    <div className="min-h-screen w-full bg-[#020617]">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-16 px-6 py-16 text-slate-100">
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span className="text-xs font-medium uppercase tracking-[0.35em] text-emerald-400/80">
            Aether — Learnings
          </span>
        </div>

        <h1 className="text-3xl font-semibold tracking-tight text-slate-100 sm:text-4xl">
          What Aether has learned
        </h1>

        <p className="max-w-3xl text-base leading-relaxed text-slate-400">
          A record of how Aether's understanding has evolved through repeated missions —
          capturing accumulated experience, meaningful milestones, lessons internalized,
          and observations derived from historical execution.
        </p>
      </div>

      {isLoading && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 px-5 py-8 text-center text-sm text-slate-500">
          Reading Aether's notebook…
        </div>
      )}

      {isError && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 px-5 py-8 text-center text-sm text-slate-500">
          Aether's history couldn't be loaded right now.
        </div>
      )}

      {summary && !isLoading && !isError && (
        <div className="flex flex-col gap-24">
          <LearningProfile summary={summary} />
          <InternalizedLessons summary={summary} />
          <EvolutionFeed summary={summary} />
          <ObservedPatterns summary={summary} />
        </div>
      )}
      </div>
    </div>
  );
}