// src/components/mission-control/intelligence-assets.tsx

import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { IntelligenceAssetsLoaded } from "@/types/campaigns";

interface IntelligenceAssetsProps {
  assets: IntelligenceAssetsLoaded;
}

const ASSET_LABELS: { key: keyof IntelligenceAssetsLoaded; label: string }[] = [
  { key: "customer_health", label: "Customer Health" },
  { key: "customer_stories", label: "Customer Stories" },
  { key: "personalized_campaigns", label: "Personalized Campaigns" },
];

export function IntelligenceAssets({ assets }: IntelligenceAssetsProps) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-medium text-slate-300">
        Intelligence Assets
      </h3>
      <div className="flex flex-wrap gap-2">
        {ASSET_LABELS.map(({ key, label }) => {
          const loaded = assets[key];
          return (
            <span
              key={key}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium",
                loaded
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                  : "border-slate-700 bg-slate-900/50 text-slate-500"
              )}
            >
              {loaded ? (
                <Check className="size-3.5" />
              ) : (
                <X className="size-3.5" />
              )}
              {label}
            </span>
          );
        })}
      </div>
    </div>
  );
}