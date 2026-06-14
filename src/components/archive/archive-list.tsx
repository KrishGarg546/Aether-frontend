"use client";

import { Loader2, AlertTriangle, Inbox } from "lucide-react";
import { CampaignCard } from "@/components/archive/campaign-card";
import { useCampaigns } from "@/hooks/use-campaigns";

export function ArchiveList() {
  const { data, isLoading, isError, error } = useCampaigns();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 py-12 text-sm text-slate-400">
        <Loader2 className="size-4 animate-spin" />
        Loading campaign history...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-2xl border border-rose-500/30 bg-rose-500/5 px-6 py-10 text-center text-sm text-rose-400">
        <AlertTriangle className="size-6" />
        {error?.message ?? "Failed to load campaign history."}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/50 px-6 py-10 text-center text-sm text-slate-500">
        <Inbox className="size-6" />
        No missions have been launched yet.
      </div>
    );
  }

  const totalMissions = data.length;
  const successfulMissions = data.filter(
    (campaign) => campaign.status === "SUCCESS"
  ).length;

  const successRate = Math.round(
    (successfulMissions / totalMissions) * 100
  );

  const averageAudience = Math.round(
    data.reduce((sum, campaign) => sum + campaign.audience_size, 0) /
      totalMissions
  );

  const averageDuration = (
    data.reduce(
      (sum, campaign) =>
        sum + ((campaign.duration_seconds ?? 0) as number),
      0
    ) / Math.max(totalMissions, 1)
  ).toFixed(1);

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          {
            label: "MISSIONS",
            value: totalMissions,
          },
          {
            label: "SUCCESS RATE",
            value: `${successRate}%`,
          },
          {
            label: "AVG AUDIENCE",
            value: averageAudience,
          },
          {
            label: "AVG DURATION",
            value: `${averageDuration}s`,
          },
        ].map((stat, index) => {
          const cardStyles = [
            "border-emerald-500/20 bg-emerald-500/[0.03] hover:border-emerald-500/40",
            "border-cyan-500/20 bg-cyan-500/[0.03] hover:border-cyan-500/40",
            "border-violet-500/20 bg-violet-500/[0.03] hover:border-violet-500/40",
            "border-amber-500/20 bg-amber-500/[0.03] hover:border-amber-500/40",
          ];

          return (
            <div
              key={stat.label}
              className={`rounded-2xl border px-5 py-5 transition-all duration-300 hover:-translate-y-1 ${cardStyles[index]}`}
            >
              <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">
                {stat.label}
              </p>

              <p className="mt-3 font-serif text-4xl text-white">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-3">
        {data.map((campaign) => (
          <CampaignCard key={campaign.id} campaign={campaign} />
        ))}
      </div>
    </div>
  );
}