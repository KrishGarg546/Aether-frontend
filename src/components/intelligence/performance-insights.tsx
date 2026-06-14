// src/components/intelligence/performance-insights.tsx
// Sprint 3B — Executive Intelligence
// Enhanced presentation: "What Aether has accomplished."

import type { IntelligenceSummary } from "@/types/intelligence";

interface PerformanceInsightsProps {
  summary: IntelligenceSummary;
}

interface ExecutiveStat {
  label: string;
  value: string | number;
  context?: string;
  accentClass?: string;
  valueClass?: string;
}

function StatItem({ label, value, context, valueClass }: ExecutiveStat) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">
        {label}
      </span>

      <span className={`text-3xl font-semibold tabular-nums tracking-tight ${valueClass ?? "text-slate-100"}`}>
        {value}
      </span>

      {context && (
        <span className="text-xs leading-relaxed text-slate-500">
          {context}
        </span>
      )}
    </div>
  );
}

export function PerformanceInsights({ summary }: PerformanceInsightsProps) {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-emerald-500/70">
            Executive Intelligence
          </p>

          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-100">
            Aether at a Glance
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-400">
            A cumulative view of the missions Aether has executed and the scale of its impact.
          </p>
        </div>

        <p className="max-w-[160px] text-right text-xs leading-relaxed text-slate-500">
          What Aether has accomplished.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6 rounded-3xl border border-slate-800/80 bg-gradient-to-b from-slate-900/70 to-slate-950/70 px-6 py-6 shadow-[0_0_0_1px_rgba(15,23,42,0.5)] sm:grid-cols-4 sm:px-8 sm:py-7">
        <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.03] px-4 py-3">
          <StatItem
            label="Missions Run"
            value={summary.totalCampaigns}
            context={`${Object.keys(summary.statusBreakdown).length} status types`}
            valueClass="text-emerald-300"
          />
        </div>
        <div className="rounded-2xl border border-cyan-500/15 bg-cyan-500/[0.03] px-4 py-3">
          <StatItem
            label="Avg Audience"
            value={Math.round(summary.averageAudienceSize).toLocaleString()}
            context="contacts per mission"
            valueClass="text-cyan-300"
          />
        </div>
        <div className="rounded-2xl border border-violet-500/15 bg-violet-500/[0.03] px-4 py-3">
          <StatItem
            label="Messages Sent"
            value={summary.totalCommunicationsGenerated.toLocaleString()}
            context="across all campaigns"
            valueClass="text-violet-300"
          />
        </div>
        <div className="rounded-2xl border border-amber-500/15 bg-amber-500/[0.03] px-4 py-3">
          <StatItem
            label="Events Tracked"
            value={summary.totalReceiptEventsProcessed.toLocaleString()}
            context="receipt events processed"
            valueClass="text-amber-300"
          />
        </div>
      </div>

      <div className="rounded-3xl border border-slate-800/80 bg-slate-900/40 px-6 py-6 backdrop-blur-sm">
        <p className="text-[15px] leading-8 text-slate-300">
          Aether has executed <span className="font-medium text-slate-100">{summary.totalCampaigns}</span>{" "}
          missions, generated <span className="font-medium text-slate-100">{summary.totalCommunicationsGenerated.toLocaleString()}</span>{" "}
          communications, and processed <span className="font-medium text-slate-100">{summary.totalReceiptEventsProcessed.toLocaleString()}</span>{" "}
          customer interactions. Each mission contributes to Aether's growing understanding of audience behavior and strategic effectiveness.
        </p>
      </div>
    </section>
  );
}