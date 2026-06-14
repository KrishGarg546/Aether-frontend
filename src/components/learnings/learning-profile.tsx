// src/components/learnings/learning-profile.tsx
// "How much experience has Aether accumulated?"
//
// A narrative summary of accumulated experience — no scores, no
// confidence percentages, no fabricated evolution metrics.

import type { IntelligenceSummary } from "@/types/intelligence";

interface LearningProfileProps {
  summary: IntelligenceSummary;
}

function formatObjectiveLabel(objective: string): string {
  return objective
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function maturityLabel(totalCampaigns: number): string {
  if (totalCampaigns === 0) return "No mission history yet.";
  if (totalCampaigns < 5) return "Early — limited mission history recorded so far.";
  if (totalCampaigns < 15) return "Developing — recurring patterns are starting to surface.";
  if (totalCampaigns < 30) return "Established — a substantial mission history has been recorded.";
  return "Extensive — a large mission history has been recorded.";
}

export function LearningProfile({ summary }: LearningProfileProps) {
  const { totalCampaigns, strategicMemory, objectiveBreakdown, topObjective } = summary;

  const strongCount = strategicMemory.filter((m) => m.strength === "strong").length;
  const moderateCount = strategicMemory.filter((m) => m.strength === "moderate").length;
  const emergingCount = strategicMemory.filter((m) => m.strength === "emerging").length;

  const cards: { title: string; body: string; accent: string }[] = [];

  cards.push({
    title: "Experience profile",
    body: maturityLabel(totalCampaigns),
    accent: "border-emerald-900/50",
  });

  cards.push({
    title: "Mission history",
    body:
      totalCampaigns > 0
        ? `${totalCampaigns} ${totalCampaigns === 1 ? "mission has" : "missions have"} been executed and recorded so far.`
        : "No missions have been executed yet.",
    accent: "border-cyan-900/50",
  });

  if (objectiveBreakdown.length > 0) {
    cards.push({
      title: "Objective diversity",
      body:
        objectiveBreakdown.length === 1
          ? `Mission history currently spans a single objective type: ${formatObjectiveLabel(objectiveBreakdown[0].objective)}.`
          : `Mission history spans ${objectiveBreakdown.length} distinct objective types${
              topObjective ? `, most frequently ${formatObjectiveLabel(topObjective.objective)}` : ""
            }.`,
      accent: "border-violet-900/50",
    });
  }

  if (strategicMemory.length > 0) {
    cards.push({
      title: "Lessons internalized",
      body: `${strongCount} strong, ${moderateCount} moderate, and ${emergingCount} emerging pattern${
        strongCount + moderateCount + emergingCount === 1 ? "" : "s"
      } have been identified across recorded recommendations.`,
      accent: "border-amber-900/50",
    });
  } else {
    cards.push({
      title: "Lessons internalized",
      body: "No recurring patterns have been identified yet.",
      accent: "border-amber-900/50",
    });
  }

  return (
    <section className="flex flex-col gap-10">
      <div className="flex items-end justify-between gap-8">
        <div>
          <p className="text-[11px] uppercase tracking-[0.35em] text-emerald-400">
            EXPERIENCE SYNTHESIS
          </p>

          <h2 className="mt-3 font-serif text-4xl text-white">
            Learning Profile
          </h2>
        </div>

        <p className="max-w-[220px] text-right text-sm leading-relaxed text-slate-500">
          How Aether's experience has evolved through repeated missions.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {cards.map((card) => (
          <div
            key={card.title}
            className={`flex flex-col gap-3 rounded-3xl border bg-slate-900/50 px-6 py-6 transition-all duration-300 hover:-translate-y-1 hover:bg-slate-900/70 hover:shadow-[0_0_30px_rgba(15,23,42,0.35)] ${card.accent} hover:border-slate-700`}
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500">
              {card.title}
            </span>
            <p className="text-[15px] leading-8 text-slate-300">{card.body}</p>
          </div>
        ))}
      </div>
      <p className="text-[10px] leading-relaxed text-slate-600">
        Experience labels reflect accumulated mission volume and recurring patterns,
        not predictive capability or model confidence.
      </p>
    </section>
  );
}