// src/components/intelligence/customer-health-map.tsx
// "Can Aether estimate customer well-being?"
//
// Avoids pie/bar charts per brief. Segments are presented as a horizontal
// spectrum of states with weight (count) shown via size/opacity, plus
// expandable detail cards — a state-machine read, not a chart.

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { IntelligenceSummary, HealthSegmentStat } from "@/types/intelligence";

interface CustomerHealthMapProps {
  summary: IntelligenceSummary;
}

const SEGMENT_STYLES: Record<
  HealthSegmentStat["segment"],
  { dot: string; text: string; border: string; bg: string }
> = {
  Champion: { dot: "bg-emerald-400", text: "text-emerald-400", border: "border-emerald-500/30", bg: "bg-emerald-500/5" },
  Loyal: { dot: "bg-sky-400", text: "text-sky-400", border: "border-sky-500/30", bg: "bg-sky-500/5" },
  Engaged: { dot: "bg-violet-400", text: "text-violet-400", border: "border-violet-500/30", bg: "bg-violet-500/5" },
  "At Risk": { dot: "bg-amber-400", text: "text-amber-400", border: "border-amber-500/30", bg: "bg-amber-500/5" },
  Dormant: { dot: "bg-slate-500", text: "text-slate-400", border: "border-slate-700", bg: "bg-slate-800/30" },
};

export function CustomerHealthMap({ summary }: CustomerHealthMapProps) {
  const { healthSegments } = summary;
  const [activeSegment, setActiveSegment] = useState<HealthSegmentStat["segment"]>(
    healthSegments.find((s) => s.count > 0)?.segment ?? "Champion"
  );

  const orderedSegments = [
    "Dormant",
    "At Risk",
    "Engaged",
    "Loyal",
    "Champion",
  ].map(
    (segment) =>
      healthSegments.find(
        (s) => s.segment === segment
      ) as HealthSegmentStat
  );

  const totalRepresented = healthSegments.reduce((sum, s) => sum + s.count, 0);
  const active = healthSegments.find((s) => s.segment === activeSegment) ?? null;

  if (totalRepresented === 0) {
    return (
      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-medium text-slate-300">Customer Health</h2>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 px-5 py-8 text-center text-sm text-slate-500">
          Health segments populate once Aether has archetypes to evaluate.
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-emerald-500/70">
            Audience Intelligence
          </p>

          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-100">
            Customer Health
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-400">
            Understand how customers are distributed across health segments and where Aether should focus attention.
          </p>
        </div>

        <p className="max-w-[160px] text-right text-xs leading-relaxed text-slate-500">
          Aether identifies which audiences need intervention.
        </p>
      </div>

      {/* Spectrum bar — ordered Dormant → Champion, left to right */}
      <div className="mt-2 flex flex-col gap-5 rounded-2xl border border-slate-800 bg-slate-900/50 p-8">
        <div className="flex h-2 w-full overflow-hidden rounded-full bg-slate-800">
          {orderedSegments.map((seg) => {
            const widthPct = totalRepresented > 0 ? (seg.count / totalRepresented) * 100 : 0;
            if (widthPct === 0) return null;
            const styles = SEGMENT_STYLES[seg.segment];
            return (
              <div
                key={seg.segment}
                className={cn("h-full transition-all", styles.dot)}
                style={{ width: `${widthPct}%` }}
                title={`${seg.segment}: ${seg.count}`}
              />
            );
          })}
        </div>

        {/* Segment chips */}
        <div className="flex flex-wrap items-center gap-3">
          {healthSegments.map((seg) => {
            const styles = SEGMENT_STYLES[seg.segment];
            const isActive = activeSegment === seg.segment;
            return (
              <button
                key={seg.segment}
                onClick={() => {
                  if (!isActive) {
                    setActiveSegment(seg.segment);
                  }
                }}
                disabled={seg.count === 0}
                className={cn(
                  "flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  seg.count === 0
                    ? "border-slate-800 text-slate-600 cursor-default"
                    : isActive
                    ? styles.border + " " + styles.bg + " " + styles.text
                    : "border-slate-800 text-slate-400 hover:border-slate-700"
                )}
              >
                <span className={cn("h-1.5 w-1.5 rounded-full", seg.count === 0 ? "bg-slate-700" : styles.dot)} />
                {seg.segment}
                <span className="tabular-nums text-slate-500">{seg.count}</span>
              </button>
            );
          })}
        </div>

        {/* Detail panel */}
        {active ? (
          <div className={cn("mt-2 flex flex-col gap-3 rounded-xl border p-6", SEGMENT_STYLES[active.segment].border, SEGMENT_STYLES[active.segment].bg)}>
            <div className="flex items-baseline justify-between gap-3">
              <span className={cn("text-sm font-semibold", SEGMENT_STYLES[active.segment].text)}>
                {active.segment}
              </span>
              <span className="text-xs text-slate-500">
                Score range {active.scoreRange}
                {active.avgScore !== null && ` · avg ${Math.round(active.avgScore)}`}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-300">{active.description}</p>
            <p className="text-xs leading-relaxed text-slate-500">
              <span className="text-slate-400">Aether's response: </span>
              {active.strategicImplication}
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}