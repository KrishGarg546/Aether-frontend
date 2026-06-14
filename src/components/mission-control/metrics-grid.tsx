// src/components/mission-control/metrics-grid.tsx

import { cn } from "@/lib/utils";

interface MetricsGridProps {
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  failureRate: number;
}

interface MetricDefinition {
  label: string;
  value: number;
  tone: "positive" | "neutral" | "negative";
}

function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function MetricsGrid({
  deliveryRate,
  openRate,
  clickRate,
  failureRate,
}: MetricsGridProps) {
  const metrics: MetricDefinition[] = [
    { label: "Delivery Rate", value: deliveryRate, tone: "positive" },
    { label: "Open Rate", value: openRate, tone: "neutral" },
    { label: "Click Rate", value: clickRate, tone: "neutral" },
    { label: "Failure Rate", value: failureRate, tone: "negative" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="flex flex-col gap-1 rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3"
        >
          <span className="text-xs text-slate-500">{metric.label}</span>
          <span
            className={cn(
              "text-2xl font-semibold tabular-nums",
              metric.tone === "positive" && "text-emerald-400",
              metric.tone === "negative" && "text-rose-400",
              metric.tone === "neutral" && "text-slate-100"
            )}
          >
            {formatPercent(metric.value)}
          </span>
        </div>
      ))}
    </div>
  );
}