// src/components/intelligence/customer-story-evolution.tsx
// Sprint 3B — "Aether remembers customers."

import { useState } from "react";
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";
import type { IntelligenceSummary, CustomerStory } from "@/types/intelligence";

interface CustomerStoryEvolutionProps {
  summary: IntelligenceSummary;
}

function formatObjectiveLabel(objective: string): string {
  return objective
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getHealthSegment(score: number): string {
  if (score >= 90) return "Champion";
  if (score >= 75) return "Loyal";
  if (score >= 60) return "Engaged";
  if (score >= 40) return "At Risk";
  return "Dormant";
}

const OBJECTIVE_ACCENT: Record<string, string> = {
  reactivation: "text-sky-400 border-sky-500/30 bg-sky-500/5",
  loyalty: "text-emerald-400 border-emerald-500/30 bg-emerald-500/5",
  cross_sell: "text-violet-400 border-violet-500/30 bg-violet-500/5",
  manual_review: "text-amber-400 border-amber-500/30 bg-amber-500/5",
};

const OBJECTIVE_DOT: Record<string, string> = {
  reactivation: "bg-sky-400",
  loyalty: "bg-emerald-400",
  cross_sell: "bg-violet-400",
  manual_review: "bg-amber-400",
};

function StoryCard({
  story,
  isActive,
  onClick,
}: {
  story: CustomerStory;
  isActive: boolean;
  onClick: () => void;
}) {
  const accent = OBJECTIVE_ACCENT[story.objective] ?? "text-slate-400 border-slate-700 bg-slate-800/40";
  const dot = OBJECTIVE_DOT[story.objective] ?? "bg-slate-400";

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full rounded-xl border px-4 py-3 text-left transition-all duration-200",
        isActive
          ? accent + " ring-1 ring-inset ring-white/10"
          : "border-slate-800 bg-slate-900/50 hover:border-slate-700"
      )}
    >
      <div className="flex items-center gap-2.5">
        <span className={cn("h-2 w-2 shrink-0 rounded-full", dot)} />
        <span className="text-sm font-medium text-slate-200">
          {story.archetypeName}
        </span>
        <span
          className={cn(
            "ml-auto rounded-full border px-2 py-0.5 text-xs font-medium",
            accent
          )}
        >
          {formatObjectiveLabel(story.objective)}
        </span>
      </div>
      <p className="mt-1.5 line-clamp-1 pl-4 text-xs text-slate-500">
        {story.initialState}
      </p>
    </button>
  );
}

function StoryDetail({ story }: { story: CustomerStory }) {
  const dot = OBJECTIVE_DOT[story.objective] ?? "bg-slate-400";

  const rows = [
    {
      label: "Initial State",
      content: story.initialState,
      sublabel: `Mission #${story.campaignId} · ${formatDate(story.executedAt)}`,
    },
    {
      label: "Intervention",
      content: story.intervention,
      sublabel: null,
    },
    {
      label: "Outcome",
      content: story.outcome,
      sublabel: null,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Story header */}
      <div className="flex items-center gap-3">
        <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full", dot)} />
        <div>
          <span className="text-base font-semibold text-slate-100">
            {story.archetypeName}
          </span>
          <span className="ml-2 text-xs text-slate-500">
            Audience archetype · {formatObjectiveLabel(story.objective)}
          </span>
        </div>
      </div>

      {/* Journey rows */}
      <div className="relative flex flex-col gap-0">
        {/* Vertical connector line */}
        <div className="absolute left-[11px] top-5 h-[calc(100%-2.5rem)] w-px bg-slate-800" />

        {rows.map((row, i) => (
          <div key={row.label} className="flex gap-3">
            {/* Step dot */}
            <div className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center">
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  i === 0 ? dot : "bg-slate-600"
                )}
              />
            </div>
            <div className="mb-5 flex flex-col gap-0.5">
              <span className="text-[10px] font-medium uppercase tracking-widest text-slate-500">
                {row.label}
              </span>
              <p className="text-sm leading-relaxed text-slate-300">
                {row.content}
              </p>
              {row.sublabel && (
                <span className="text-xs text-slate-600">{row.sublabel}</span>
              )}
            </div>
          </div>
        ))}

        {/* Aether Learning row — styled differently */}
        {story.aetherLearning ? (
          <div className="flex gap-3">
            <div className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-medium uppercase tracking-widest text-emerald-500/70">
                Aether Learned
              </span>
              <p className="text-sm leading-relaxed text-emerald-300/80">
                {story.aetherLearning}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex gap-3">
            <div className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-700" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-medium uppercase tracking-widest text-slate-600">
                Aether Learned
              </span>
              <p className="text-xs text-slate-600">
                Patterns still accumulating for this archetype.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Customer health evolution */}
      <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-widest text-slate-500">
              Health Evolution
            </p>
            <p className="mt-1 text-sm text-slate-400">
              How this audience archetype improved over time.
            </p>
          </div>

          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest text-slate-500">
              Current Health
            </p>
            <p className="text-lg font-semibold text-emerald-400">
              {story.currentHealthScore}/100
            </p>
            <p className="text-xs text-slate-500">
              {getHealthSegment(story.currentHealthScore)} segment
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          {story.healthJourney.map((stage, index) => (
            <div key={`${stage}-${index}`} className="flex items-center gap-2">
              <div className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-300">
                {stage}
              </div>

              {index < story.healthJourney.length - 1 && (
                <span className="text-slate-600">→</span>
              )}
            </div>
          ))}
        </div>

        <div className="mt-5">
          <p className="mb-2 text-[10px] font-medium uppercase tracking-widest text-slate-500">
            Health Score Progression
          </p>

          <div className="flex flex-wrap items-center gap-2">
            {story.healthScoreProgression.map((score, index) => (
              <div key={`${score}-${index}`} className="flex items-center gap-2">
                <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-300">
                  {score}
                </div>

                {index < story.healthScoreProgression.length - 1 && (
                  <span className="text-slate-600">→</span>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-emerald-400 transition-all"
              style={{ width: `${story.currentHealthScore}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Aether estimates this archetype is currently operating at {story.currentHealthScore}% health.
          </p>
        </div>
      </div>

      {/* Honest data note */}
      <p className="text-[10px] leading-relaxed text-slate-600">
        Audience archetypes are derived from objective-level campaign patterns,
        not individual customer records. True per-customer journeys require a{" "}
        <code className="text-slate-500">GET /customers/&#123;id&#125;/journey/</code>{" "}
        endpoint.
      </p>
    </div>
  );
}

export function CustomerStoryEvolution({
  summary,
}: CustomerStoryEvolutionProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (summary.customerStories.length === 0) {
    return (
      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-medium text-slate-300">
          Customer Story Evolution
        </h2>
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/50 px-5 py-10 text-center">
          <Users className="size-6 text-slate-600" />
          <p className="text-sm text-slate-500">
            Run a few campaigns to build audience archetypes.
          </p>
        </div>
      </section>
    );
  }

  const activeStory = summary.customerStories[activeIndex];

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-emerald-500/80">
            Customer Memory
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-100">
            Customer Story Evolution
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
            Aether doesn't just execute campaigns. It remembers what happened, how audiences responded, and what future missions should learn from those outcomes.
          </p>
        </div>

        <span className="text-sm text-slate-500 lg:text-right">
          Aether remembers customers.
        </span>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/50 px-5 py-5">
        {/* Story selector tabs */}
        <div className="flex flex-col gap-1.5">
          {summary.customerStories.map((story, i) => (
            <StoryCard
              key={story.campaignId}
              story={story}
              isActive={i === activeIndex}
              onClick={() => setActiveIndex(i)}
            />
          ))}
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-slate-800" />

        {/* Active story detail */}
        {activeStory && <StoryDetail story={activeStory} />}
      </div>
    </section>
  );
}