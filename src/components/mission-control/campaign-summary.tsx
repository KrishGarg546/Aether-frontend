// src/components/mission-control/campaign-summary.tsx

import { motion } from "framer-motion";
import { Mail, MessageSquare, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { MetricsGrid } from "@/components/mission-control/metrics-grid";
import { RecommendationPanel } from "@/components/mission-control/recommendation-panel";
import { IntelligenceAssets } from "@/components/mission-control/intelligence-assets";
import type { RunCampaignResponse, ReceiptChannel } from "@/types/campaigns";

interface CampaignSummaryProps {
  result: RunCampaignResponse;
}

const CHANNEL_DISPLAY: Record<
  ReceiptChannel,
  { label: string; icon: typeof Mail }
> = {
  email: { label: "Email", icon: Mail },
  sms: { label: "SMS", icon: MessageSquare },
  push: { label: "Push", icon: Bell },
  whatsapp: { label: "WhatsApp", icon: MessageSquare },
};

interface StatItemProps {
  label: string;
  value: string | number;
}

function StatItem({ label, value }: StatItemProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs uppercase tracking-wide text-slate-500">
        {label}
      </span>
      <span className="text-lg font-semibold text-slate-100">{value}</span>
    </div>
  );
}

export function CampaignSummary({ result }: CampaignSummaryProps) {
  const { raw_result, insights, receipts, communications_generated } = result;

  const channelsUsed = Array.from(
    new Set(receipts.map((receipt) => receipt.channel))
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex w-full max-w-2xl flex-col gap-8"
    >
      <div className="flex flex-col gap-2 text-center">
        <span
          className={cn(
            "inline-flex w-fit self-center rounded-full border px-3 py-1 text-xs font-medium",
            result.status.toLowerCase() === "completed" ||
              result.status.toLowerCase() === "success"
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
              : "border-amber-500/40 bg-amber-500/10 text-amber-400"
          )}
        >
          {result.status}
        </span>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-100 sm:text-3xl">
          {result.campaign_name}
        </h1>
        <p className="text-sm text-slate-400">{result.objective}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 rounded-2xl border border-slate-800 bg-slate-900/50 px-5 py-4 sm:grid-cols-3">
        <StatItem label="Audience Size" value={result.audience_size} />
        <StatItem
          label="Communications"
          value={communications_generated}
        />
        <StatItem
          label="Receipt Events"
          value={result.receipt_events_processed}
        />
      </div>

      <MetricsGrid
        deliveryRate={
          insights?.campaign_metrics?.delivery_rate ??
          raw_result.delivery_rate ??
          0
        }
        openRate={
          insights?.campaign_metrics?.open_rate ??
          raw_result.open_rate ??
          0
        }
        clickRate={
          insights?.campaign_metrics?.click_rate ??
          raw_result.click_rate ??
          0
        }
        failureRate={
          insights?.campaign_metrics?.failure_rate ??
          raw_result.failure_rate ??
          0
        }
      />

      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-medium text-slate-300">Channels Used</h3>
        <div className="flex flex-wrap gap-2">
          {channelsUsed.length === 0 && (
            <span className="text-sm text-slate-500">
              No channel receipts recorded.
            </span>
          )}
          {channelsUsed.map((channel) => {
            const display = CHANNEL_DISPLAY[channel];
            const Icon = display?.icon ?? Mail;
            return (
              <span
                key={channel}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-900/50 px-3 py-1 text-xs font-medium text-slate-300"
              >
                <Icon className="size-3.5" />
                {display?.label ?? channel}
              </span>
            );
          })}
        </div>
      </div>

      <RecommendationPanel
        recommendations={insights?.recommendations ?? raw_result.recommendations ?? []}
      />

      <IntelligenceAssets assets={raw_result.intelligence_assets_loaded} />
    </motion.div>
  );
}