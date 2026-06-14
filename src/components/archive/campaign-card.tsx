// src/components/archive/campaign-card.tsx

"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/archive/status-badge";
import { CampaignDetailPanel } from "@/components/archive/campaign-detail-panel";
import type { CampaignListItem } from "@/types/campaigns";

interface CampaignCardProps {
  campaign: CampaignListItem;
}

function formatStartedAt(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getObjectiveStyles(objective: string): string {
  switch (objective.toLowerCase()) {
    case "loyalty":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
    case "reactivation":
      return "border-cyan-500/20 bg-cyan-500/10 text-cyan-300";
    case "cross_sell":
    case "cross sell":
      return "border-violet-500/20 bg-violet-500/10 text-violet-300";
    case "manual_review":
    case "manual review":
      return "border-amber-500/20 bg-amber-500/10 text-amber-300";
    default:
      return "border-slate-700 bg-slate-800 text-slate-300";
  }
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 transition-all duration-300 hover:-translate-y-1 hover:border-slate-700 hover:bg-slate-900/60">
      <button
        type="button"
        onClick={() => setIsExpanded((value) => !value)}
        aria-expanded={isExpanded}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-500">
            Mission #{campaign.id}
          </span>

          <span className="text-sm font-semibold text-slate-100">
            {campaign.campaign_name}
          </span>

          <span
            className={cn(
              "w-fit rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em]",
              getObjectiveStyles(campaign.objective)
            )}
          >
            {campaign.objective.replace(/_/g, " ")}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden flex-col items-end gap-1 sm:flex">
            <span className="text-xs text-slate-500">
              Audience: {campaign.audience_size}
            </span>
            <span className="text-xs text-slate-500">
              {formatStartedAt(campaign.started_at)}
            </span>
          </div>
          <StatusBadge status={campaign.status} />
          <ChevronDown
            className={cn(
              "size-4 shrink-0 text-slate-500 transition-transform",
              isExpanded && "rotate-180"
            )}
          />
        </div>
      </button>

      <div className="flex flex-col gap-1 px-5 pb-4 sm:hidden">
        <span className="text-xs text-slate-500">
          Audience: {campaign.audience_size}
        </span>
        <span className="text-xs text-slate-500">
          {formatStartedAt(campaign.started_at)}
        </span>
      </div>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key="detail"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="border-t border-slate-800 px-5 pb-5">
              <CampaignDetailPanel campaignId={campaign.id} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}