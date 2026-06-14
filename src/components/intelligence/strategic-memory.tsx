// src/components/intelligence/strategic-memory.tsx
// Sprint 3B — Strategic Memory
// Replaces strategic-recommendations.tsx with durable pattern learnings.

import { cn } from "@/lib/utils";
import type { IntelligenceSummary, StrategicMemoryEntry } from "@/types/intelligence";

interface StrategicMemoryProps {
  summary: IntelligenceSummary;
}

function formatObjectiveLabel(objective: string): string {
  return objective
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const STRENGTH_STYLES = {
  strong: {
    badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    bar: "bg-emerald-500/60",
    label: "Strong signal",
  },
  moderate: {
    badge: "bg-sky-500/15 text-sky-400 border-sky-500/30",
    bar: "bg-sky-500/60",
    label: "Moderate signal",
  },
  emerging: {
    badge: "bg-slate-700/60 text-slate-400 border-slate-600/40",
    bar: "bg-slate-500/50",
    label: "Emerging",
  },
};

function MemoryEntry({ entry, maxCount }: { entry: StrategicMemoryEntry; maxCount: number }) {
  const styles = STRENGTH_STYLES[entry.strength];
  const widthPct = maxCount > 0 ? Math.max((entry.evidenceCount / maxCount) * 100, 6) : 6;

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/50 px-6 py-5">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <p className="text-[15px] leading-7 text-slate-200">
          "{entry.insight}"
        </p>
        <span
          className={cn(
            "mt-0.5 shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
            styles.badge
          )}
        >
          {styles.label}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-slate-800 pt-3 text-sm text-slate-500">
        <span className="font-medium text-slate-300">
          Observed across {entry.evidenceCount} mission{entry.evidenceCount === 1 ? "" : "s"}
        </span>

        {entry.primaryObjective && (
          <>
            <span className="text-slate-700">•</span>
            <span>
              Most common in {formatObjectiveLabel(entry.primaryObjective)} campaigns
            </span>
          </>
        )}
      </div>
    </div>
  );
}

export function StrategicMemory({ summary }: StrategicMemoryProps) {
  const { strategicMemory } = summary;
  const maxCount = strategicMemory[0]?.evidenceCount ?? 1;

  if (strategicMemory.length === 0) {
    return (
      <section className="flex flex-col gap-6">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-emerald-500/70">
              Strategic Intelligence
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-100">
              Strategic Memory
            </h2>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 px-6 py-8 text-center text-sm text-slate-500">
          Durable patterns emerge only after repeated missions. Run more campaigns to help Aether build strategic convictions.
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-emerald-500/70">
            Strategic Intelligence
          </p>

          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-100">
            Strategic Memory
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-400">
            Durable patterns extracted from repeated campaign outcomes and recommendations.
          </p>
        </div>

        <p className="max-w-[160px] text-right text-xs leading-relaxed text-slate-500">
          Patterns Aether won't forget.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {strategicMemory.map((entry, i) => (
          <MemoryEntry
            key={i}
            entry={entry}
            maxCount={maxCount}
          />
        ))}
      </div>

      <p className="mt-2 text-[10px] leading-relaxed text-slate-600">
        Derived from{" "}
        <code className="text-slate-500">recommendations[]</code> across{" "}
        {summary.totalCampaigns} campaign executions. No fabricated data.
      </p>
    </section>
  );
}