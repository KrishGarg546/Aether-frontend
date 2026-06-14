// src/components/archive/campaign-detail-panel.tsx

import { Loader2, AlertTriangle } from "lucide-react";
import { MetricsGrid } from "@/components/mission-control/metrics-grid";
import { RecommendationPanel } from "@/components/mission-control/recommendation-panel";
import { IntelligenceAssets } from "@/components/mission-control/intelligence-assets";
import { useCampaignDetail } from "@/hooks/use-campaign-detail";

interface CampaignDetailPanelProps {
  campaignId: number;
}

interface StatItemProps {
  label: string;
  value: string | number;
  accentClass?: string;
}

function StatItem({ label, value, accentClass }: StatItemProps) {
  return (
    <div
      className={`flex flex-col gap-2 rounded-2xl border px-5 py-5 transition-all duration-300 hover:-translate-y-1 ${accentClass ?? "border-slate-800 bg-slate-900/50"}`}
    >
      <span className="text-[10px] uppercase tracking-[0.25em] text-slate-500">
        {label}
      </span>

      <span className="font-serif text-3xl text-slate-100">
        {value}
      </span>
    </div>
  );
}

export function CampaignDetailPanel({ campaignId }: CampaignDetailPanelProps) {
  const { data, isLoading, isError, error } = useCampaignDetail(
    campaignId,
    true
  );

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-1 py-6 text-sm text-slate-400">
        <Loader2 className="size-4 animate-spin" />
        Loading campaign detail...
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex items-center gap-2 px-1 py-6 text-sm text-rose-400">
        <AlertTriangle className="size-4" />
        {error?.message ?? "Failed to load campaign detail."}
      </div>
    );
  }

  const rawResult = data.raw_result;
  const insights = data.insights;
  const recommendations =
    insights?.recommendations ?? rawResult?.recommendations ?? data.recommendations;

  return (
    <div className="flex flex-col gap-6 pt-2">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatItem
          label="Communications"
          value={data.communications_generated}
          accentClass="border-emerald-500/20 bg-emerald-500/[0.03] hover:border-emerald-500/40"
        />
        <StatItem
          label="Receipt Events"
          value={data.receipt_events_processed}
          accentClass="border-violet-500/20 bg-violet-500/[0.03] hover:border-violet-500/40"
        />
        {data.duration_seconds !== undefined && (
          <StatItem
            label="Duration"
            value={`${data.duration_seconds.toFixed(1)}s`}
            accentClass="border-amber-500/20 bg-amber-500/[0.03] hover:border-amber-500/40"
          />
        )}
      </div>

      {rawResult ? (
        <MetricsGrid
          deliveryRate={rawResult.delivery_rate}
          openRate={rawResult.open_rate}
          clickRate={rawResult.click_rate}
          failureRate={rawResult.failure_rate}
        />
      ) : (
        <p className="text-sm text-slate-500">
          Detailed metrics are not available for this execution.
        </p>
      )}

      <RecommendationPanel recommendations={recommendations} />

      {rawResult?.intelligence_assets_loaded && (
        <IntelligenceAssets assets={rawResult.intelligence_assets_loaded} />
      )}
    </div>
  );
}