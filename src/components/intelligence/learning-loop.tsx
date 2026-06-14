// src/components/intelligence/learning-loop.tsx
// "Does Aether improve?"
//
// Redesigned around an explicit feedback-loop structure:
// Observation → Recommendation → Behavior Adjustment → Outcome
// Uses the same real aggregates as before (objective breakdown, rate
// averages, channel usage, recommendation frequency) but frames them
// as stages of one loop rather than a flat list.

import { cn } from "@/lib/utils";
import type { IntelligenceSummary } from "@/types/intelligence";

interface LearningLoopProps {
  summary: IntelligenceSummary;
}

function formatObjectiveLabel(objective: string): string {
  return objective
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

interface LoopStage {
  label: string;
  accent: string;
  items: string[];
}

function buildStages(summary: IntelligenceSummary): LoopStage[] {
  const observations: string[] = [];
  const recommendations: string[] = [];
  const adjustments: string[] = [];
  const outcomes: string[] = [];

  // Observation: what Aether measured
  if (summary.rateAverages) {
    observations.push(
      `Across ${summary.rateAverages.sampleSize} of ${summary.totalCampaigns} executions, average open rate is ${summary.rateAverages.openRate.toFixed(1)}% and failure rate is ${summary.rateAverages.failureRate.toFixed(1)}%.`
    );
  }
  if (summary.topObjective) {
    const share = Math.round((summary.topObjective.count / summary.totalCampaigns) * 100);
    observations.push(
      `${formatObjectiveLabel(summary.topObjective.objective)} accounts for ${share}% of all missions run so far.`
    );
  }
  if (summary.channelUsage && summary.channelUsage.length >= 2) {
    const [first, second] = summary.channelUsage;
    observations.push(
      `${first.channel} sees more activity (${first.count}) than ${second.channel} (${second.count}).`
    );
  }

  // Recommendation: what the Insights Engine surfaced
  for (const rec of summary.recommendationFrequency.slice(0, 2)) {
    recommendations.push(
      rec.count > 1 ? `${rec.text} (seen ${rec.count}×)` : rec.text
    );
  }

  // Behavior adjustment: derived from strategic memory + strategy mix

  const dominantStrategy = summary.campaignStrategies?.[0];

  if (
    dominantStrategy?.topRecommendation &&
    dominantStrategy.usageCount > 0
  ) {
    adjustments.push(
      `${formatObjectiveLabel(
        dominantStrategy.objective
      )} missions frequently surface the recommendation "${dominantStrategy.topRecommendation}". Aether incorporates this signal when planning similar future missions.`
    );
  }

  if (summary.slowestObjective && summary.objectiveBreakdown.length > 1) {
    const others = summary.objectiveBreakdown.filter(
      (e) => e.objective !== summary.slowestObjective!.objective && e.avgDurationSeconds != null
    );
    if (others.length > 0) {
      const otherAvg = others.reduce((s, e) => s + (e.avgDurationSeconds ?? 0), 0) / others.length;
      const slowestAvg = summary.slowestObjective.avgDurationSeconds ?? 0;
      if (otherAvg > 0 && slowestAvg > otherAvg) {
        adjustments.push(
          `${formatObjectiveLabel(summary.slowestObjective.objective)} missions run slower than average — Aether's planner can prioritize accordingly when sequencing future runs.`
        );
      }
    }
  }
  if (adjustments.length === 0) {
    adjustments.push("Patterns are still accumulating before they're durable enough to act on.");
  }

  // Outcome: what this means for the next mission
  if (summary.totalCampaigns > 0) {
    outcomes.push(
      `The next mission Aether plans will draw on ${summary.totalCampaigns} prior ${summary.totalCampaigns === 1 ? "execution" : "executions"} — including the recommendations and memory above.`
    );
  }

  return [
    { label: "Observation", accent: "border-sky-500/30 text-sky-400", items: observations.length ? observations : ["No measurements available yet."] },
    { label: "Recommendation", accent: "border-violet-500/30 text-violet-400", items: recommendations.length ? recommendations : ["No recommendations surfaced yet."] },
    { label: "Behavior Adjustment", accent: "border-amber-500/30 text-amber-400", items: adjustments },
    { label: "Outcome", accent: "border-emerald-500/30 text-emerald-400", items: outcomes.length ? outcomes : ["Awaiting the next mission."] },
  ];
}

export function LearningLoop({ summary }: LearningLoopProps) {
  const stages = buildStages(summary);

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-end justify-between gap-8">
        <div className="flex flex-col gap-3">
          <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-emerald-400/80">
            Adaptive Intelligence
          </span>
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-100">
              Learning Loop
            </h2>
            <p className="max-w-2xl text-base leading-relaxed text-slate-400">
              Observe patterns, extract recommendations, adapt behavior, and carry those lessons into future missions.
            </p>
          </div>
        </div>

        <p className="max-w-[180px] text-right text-sm leading-relaxed text-slate-500">
          How experience changes future decisions.
        </p>
      </div>

      <div className="flex flex-col rounded-3xl border border-slate-800/80 bg-slate-900/50 px-6 py-4 backdrop-blur-sm divide-y divide-slate-800/60">
        {stages.map((stage, i) => (
          <div key={stage.label} className="flex gap-5 px-4 py-5 first:pt-4 last:pb-4">
            {/* Connector */}
            <div className="flex flex-col items-center">
              <span className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-full border bg-slate-950/60 text-[11px] font-semibold tabular-nums", stage.accent)}>
                {i + 1}
              </span>
              {i < stages.length - 1 && <div className="mt-2 w-px flex-1 bg-slate-800/80" />}
            </div>

            {/* Content */}
            <div className="flex flex-col gap-3">
              <span className={cn("text-[10px] font-semibold uppercase tracking-widest", stage.accent.split(" ")[1])}>
                {stage.label}
              </span>
              {stage.items.map((item, j) => (
                <p key={j} className="text-sm leading-7 text-slate-300">
                  {item}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}