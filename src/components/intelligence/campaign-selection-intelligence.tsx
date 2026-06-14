// src/components/intelligence/campaign-selection-intelligence.tsx
// "How does Aether choose strategies?"
//
// Presented as a set of reasoning cards (decision engine read), not a table.
// One card per objective, expandable to reveal strengths/weaknesses/
// real usage data.

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { IntelligenceSummary, CampaignStrategyProfile } from "@/types/intelligence";

interface CampaignSelectionIntelligenceProps {
  summary: IntelligenceSummary;
}

function formatObjectiveLabel(objective: string): string {
  return objective
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatDuration(seconds: number | null): string | null {
  if (seconds == null) return null;
  if (seconds < 60) return `${seconds.toFixed(1)}s avg`;
  return `${(seconds / 60).toFixed(1)}m avg`;
}

const OBJECTIVE_ACCENT: Record<string, string> = {
  reactivation: "text-sky-400 border-sky-500/30",
  loyalty: "text-emerald-400 border-emerald-500/30",
  cross_sell: "text-violet-400 border-violet-500/30",
  manual_review: "text-amber-400 border-amber-500/30",
};

function StrategyCard({
  profile,
  isOpen,
  onToggle,
}: {
  profile: CampaignStrategyProfile;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const accent = OBJECTIVE_ACCENT[profile.objective] ?? "text-slate-400 border-slate-700";

  return (
    <div className="flex flex-col rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-slate-900/80"
      >
        <div className="flex items-center gap-3">
          <span className={cn("rounded-full border px-3 py-1.5 text-sm font-medium", accent)}>
            {formatObjectiveLabel(profile.objective)}
          </span>
          <span className="text-sm text-slate-400">
            {profile.usageCount} {profile.usageCount === 1 ? "mission" : "missions"} ·{" "}
            {profile.usageShare}% of all activity
          </span>
        </div>
        <ChevronDown
          className={cn("size-4 shrink-0 text-slate-500 transition-transform", isOpen && "rotate-180")}
        />
      </button>

      {isOpen && (
        <div className="flex flex-col gap-5 border-t border-slate-800 px-5 py-5">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-medium uppercase tracking-widest text-slate-500">
              When Aether reaches for this
            </span>
            <p className="text-[15px] leading-relaxed text-slate-300">{profile.whenPreferred}</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {profile.strengths.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-medium uppercase tracking-widest text-emerald-500/70">
                  Strengths
                </span>
                <ul className="flex flex-col gap-1">
                  {profile.strengths.map((s, i) => (
                    <li key={i} className="text-sm leading-relaxed text-slate-400">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {profile.weaknesses.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-medium uppercase tracking-widest text-amber-500/70">
                  Tradeoffs
                </span>
                <ul className="flex flex-col gap-1">
                  {profile.weaknesses.map((w, i) => (
                    <li key={i} className="text-sm leading-relaxed text-slate-400">
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 border-t border-slate-800 pt-4 text-sm text-slate-500">
            {formatDuration(profile.avgDurationSeconds) && (
              <span>{formatDuration(profile.avgDurationSeconds)} execution time</span>
            )}
            {profile.topRecommendation && (
              <>
                <span className="text-slate-700">·</span>
                <span>
                  <span className="text-slate-400">Recurring signal: </span>
                  {profile.topRecommendation}
                </span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function CampaignSelectionIntelligence({ summary }: CampaignSelectionIntelligenceProps) {
  const { campaignStrategies } = summary;
  const [openObjective, setOpenObjective] = useState<string | null>(
    campaignStrategies[0]?.objective ?? null
  );

  if (campaignStrategies.length === 0) {
    return (
      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-medium text-slate-300">Campaign Selection Intelligence</h2>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 px-5 py-8 text-center text-sm text-slate-500">
          Strategy profiles build up as Aether runs missions across objectives.
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-emerald-500/70">
            Decision Intelligence
          </p>

          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-100">
            Campaign Selection Intelligence
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-400">
            Explore how Aether prioritizes strategies across different campaign objectives.
          </p>
        </div>

        <p className="max-w-[160px] text-right text-xs leading-relaxed text-slate-500">
          How Aether reasons about strategy.
        </p>
      </div>

      <div className="mt-2 flex flex-col gap-3">
        {[...campaignStrategies]
          .sort((a, b) => b.usageCount - a.usageCount)
          .map((profile) => (
            <StrategyCard
              key={profile.objective}
              profile={profile}
              isOpen={openObjective === profile.objective}
              onToggle={() => {
                if (openObjective !== profile.objective) {
                  setOpenObjective(profile.objective);
                }
              }}
            />
          ))}
      </div>

      <p className="mt-6 text-[10px] leading-relaxed text-slate-600">
        Usage and timing figures are measured from campaign history. Strategy
        framing reflects Aether's design-time decision criteria for each
        objective, not outcome guarantees.
      </p>
    </section>
  );
}