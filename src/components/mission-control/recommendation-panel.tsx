// src/components/mission-control/recommendation-panel.tsx

import { Lightbulb } from "lucide-react";

interface RecommendationPanelProps {
  recommendations: string[];
}

export function RecommendationPanel({
  recommendations,
}: RecommendationPanelProps) {
  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-medium text-slate-300">Recommendations</h3>
      <div className="flex flex-col gap-2">
        {recommendations.map((recommendation, index) => (
          <div
            key={index}
            className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3"
          >
            <Lightbulb className="mt-0.5 size-4 shrink-0 text-amber-400" />
            <p className="text-sm leading-relaxed text-slate-300">
              {recommendation}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}