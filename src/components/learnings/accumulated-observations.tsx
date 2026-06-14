// src/components/learnings/observed-patterns.tsx
// "What patterns has Aether repeatedly observed through mission execution?"
//
// Each statement type below is generated ONLY when its required fields
// are present, and is phrased as a pure observation of historical data —
// never as a claim about Aether's own behavior, planning, or reasoning.

import type { IntelligenceSummary } from "@/types/intelligence";

interface ObservedPatternsProps {
  summary: IntelligenceSummary;
}

interface Observation {
  source: string;
  statement: string;
}

function formatObjectiveLabel(objective: string): string {
  return objective
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function buildObservations(summary: IntelligenceSummary): Observation[] {
  const observations: Observation[] = [];
  const { campaignStrategies, productAffinity, healthSegments, customerStories } = summary;

  // ── A) Dominant objective mix ────────────────────────────────────────────
  if (campaignStrategies.length > 0) {
    const top = [...campaignStrategies].sort((a, b) => b.usageShare - a.usageShare)[0];
    if (top.usageShare > 0) {
      observations.push({
        source: "Objective Mix",
        statement: `${formatObjectiveLabel(top.objective)} missions account for ${top.usageShare}% of historical executions, making them the most commonly observed objective.`,
      });
    }
  }

  // ── B) Execution timing ──────────────────────────────────────────────────
  const withDuration = campaignStrategies.filter((s) => s.avgDurationSeconds != null);
  if (withDuration.length > 1) {
    const slowest = [...withDuration].sort(
      (a, b) => (b.avgDurationSeconds ?? 0) - (a.avgDurationSeconds ?? 0)
    )[0];
    const fastest = [...withDuration].sort(
      (a, b) => (a.avgDurationSeconds ?? 0) - (b.avgDurationSeconds ?? 0)
    )[0];

    if (slowest.objective !== fastest.objective) {
      observations.push({
        source: "Execution Timing",
        statement: `${formatObjectiveLabel(slowest.objective)} campaigns exhibit the longest average execution duration among tracked objectives, while ${formatObjectiveLabel(fastest.objective)} campaigns exhibit the shortest.`,
      });
    }
  }

  // ── C) Product affinity insights ─────────────────────────────────────────
  const affinityWithRecs = productAffinity.filter(
    (entry) => entry.related_products?.recommendations?.length > 0
  );
  for (const entry of affinityWithRecs.slice(0, 3)) {
    const topRec = entry.related_products.recommendations[0];
    observations.push({
      source: "Product Affinity",
      statement: `${entry.related_products.product_name} was most frequently paired with ${topRec.product_name} (${topRec.co_purchase_count} observed co-purchases).`,
    });
  }

  // ── D) Audience health distribution ──────────────────────────────────────
  const populated = healthSegments.filter((seg) => seg.count > 0);
  if (populated.length > 0) {
    const sorted = [...populated].sort((a, b) => b.count - a.count);
    const total = populated.reduce((sum, seg) => sum + seg.count, 0);

    if (sorted.length === 1) {
      observations.push({
        source: "Audience Health",
        statement: `Synthesized audience archetypes are currently concentrated entirely in the ${sorted[0].segment} segment.`,
      });
    } else {
      const top = sorted[0];
      const second = sorted[1];
      const topShare = (top.count + second.count) / total;

      if (topShare >= 0.5) {
        observations.push({
          source: "Audience Health",
          statement: `${top.segment} and ${second.segment} segments currently dominate synthesized audience archetypes, together accounting for ${top.count + second.count} of ${total} archetypes.`,
        });
      } else {
        observations.push({
          source: "Audience Health",
          statement: `Synthesized audience archetypes are currently spread across ${sorted.length} health segments, led by ${top.segment} (${top.count} of ${total}).`,
        });
      }
    }
  }

  // ── E) Customer story themes ─────────────────────────────────────────────
  for (const story of customerStories) {
    if (story.healthJourney.length < 2) continue;
    const first = story.healthJourney[0];
    const last = story.healthJourney[story.healthJourney.length - 1];

    observations.push({
      source: "Customer Story Themes",
      statement: `${formatObjectiveLabel(story.objective)} narratives frequently involve ${first.toLowerCase()} audiences progressing toward ${last.toLowerCase()} states.`,
    });
  }

  return observations;
}

export function ObservedPatterns({ summary }: ObservedPatternsProps) {
  const observations = buildObservations(summary);

  if (observations.length === 0) {
    return (
      <section className="flex flex-col gap-12">
        <div className="flex items-start justify-between gap-8">
          <div className="max-w-2xl">
            <p className="text-[11px] uppercase tracking-[0.35em] text-emerald-400">
              EMERGENT PATTERNS
            </p>

            <h2 className="mt-3 font-serif text-4xl tracking-tight text-white">
              Observed Patterns
            </h2>

            <p className="mt-4 text-lg leading-9 text-slate-400">
              Cross-domain insights surfaced from audience health, campaign history, product affinity, and customer narratives.
            </p>
          </div>

          <p className="max-w-[240px] pt-6 text-right text-sm leading-relaxed text-slate-500">
            Signals that repeatedly emerge across historical missions.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/50 px-6 py-10 text-center text-sm text-slate-500">
          No notable patterns have been identified in mission history yet.
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-12">
      <div className="flex items-start justify-between gap-8">
        <div className="max-w-2xl">
          <p className="text-[11px] uppercase tracking-[0.35em] text-emerald-400">
            EMERGENT PATTERNS
          </p>

          <h2 className="mt-3 font-serif text-4xl tracking-tight text-white">
            Observed Patterns
          </h2>

          <p className="mt-4 text-lg leading-9 text-slate-400">
            Cross-domain insights surfaced from audience health, campaign history, product affinity, and customer narratives.
          </p>
        </div>

        <p className="max-w-[240px] pt-6 text-right text-sm leading-relaxed text-slate-500">
          Signals that repeatedly emerge across historical missions.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {observations.map((obs, i) => (
          <div
            key={i}
            className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/50 px-6 py-5 transition-all duration-300 hover:-translate-y-1 hover:border-slate-700 hover:bg-slate-900/70 hover:shadow-[0_0_30px_rgba(15,23,42,0.35)]"
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-500">
              {obs.source}
            </span>
            <p className="text-[15px] leading-8 text-slate-300">{obs.statement}</p>
          </div>
        ))}
      </div>

      <p className="mt-2 text-sm leading-relaxed text-slate-500">
        Derived directly from objective mix, execution timing, product affinity, audience health
        distribution, and customer story data. No fabricated fields.
      </p>
    </section>
  );
}