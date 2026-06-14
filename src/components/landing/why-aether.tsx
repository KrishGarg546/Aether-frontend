import { X, Check } from "lucide-react";

const COMPARISONS = [
  {
    dimension: "Starting point",
    traditional:
      "Marketer manually defines audience criteria in a segmentation tool, exports a list, and imports it elsewhere.",
    aether:
      "Marketer states a goal in plain English. Audience is selected automatically from health scores, lifecycle stage, and recency signals.",
  },
  {
    dimension: "Tooling",
    traditional:
      "Segmentation, messaging, scheduling, delivery, and analytics live in separate systems. Each handoff is a manual step with a delay.",
    aether:
      "One system orchestrates the entire lifecycle. Objectives become missions, outcomes generate intelligence, and learnings persist across future executions.",
  },
  {
    dimension: "Explainability",
    traditional:
      "Automation exists, but rarely explains decisions. Marketers can't audit why a customer was included or excluded from a campaign.",
    aether:
      "Every audience selection includes a recorded reason. Every recommendation is derived from observable input values, not opaque model weights.",
  },
  {
    dimension: "Outcome tracking",
    traditional:
      "Reports are produced after the fact, in a separate analytics tool, disconnected from the execution that generated the data.",
    aether:
      "The Insights Engine reads the receipt ledger immediately after execution. Delivery rate, open rate, click rate, and recommendations are available the moment the campaign completes.",
  },
  {
    dimension: "Institutional knowledge",
    traditional:
      "Lessons live in someone's memory or a spreadsheet. When the campaign manager changes, the knowledge is gone.",
    aether:
      "Learnings accumulate in a persistent layer across every mission. Observed patterns, internalized lessons, and experience profiles grow with each run.",
  },
  {
    dimension: "Infrastructure cost",
    traditional:
      "Most automation platforms require paid subscriptions, cloud infrastructure, or API credits that accumulate over time.",
    aether:
      "Designed to remain accessible and practical to deploy. Aether demonstrates that sophisticated orchestration systems do not inherently require expensive infrastructure or proprietary services.",
  },
] as const;

export function WhyAether() {
  return (
    <section className="w-full bg-[#020617] py-24">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6">

        {/* Section header */}
        <div className="flex flex-col gap-4">
          <span className="text-xs font-medium uppercase tracking-[0.35em] text-emerald-400/80">
            Why Aether
          </span>
          <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-slate-100 sm:text-4xl">
            Most marketing tooling is fragmented by design.
            <br />
            <span className="text-slate-500">Aether treats execution, intelligence, and learning as one continuous system.</span>
          </h2>
        </div>

        {/* Column headers */}
        <div className="grid grid-cols-[1fr_1fr_1fr] gap-4 border-b border-slate-800 pb-4 max-sm:hidden">
          <span className="text-xs font-medium uppercase tracking-[0.25em] text-slate-600" />
          <div className="flex items-center gap-2">
            <X className="size-3 text-rose-500/70" />
            <span className="text-xs font-medium uppercase tracking-[0.25em] text-slate-500">
              Traditional workflow
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            <span className="text-xs font-medium uppercase tracking-[0.25em] text-emerald-400/80">
              Aether
            </span>
          </div>
        </div>

        {/* Comparison rows */}
        <div className="flex flex-col divide-y divide-slate-800/60">
          {COMPARISONS.map((row) => (
            <div
              key={row.dimension}
              className="grid grid-cols-1 gap-4 py-5 sm:grid-cols-[1fr_1fr_1fr] sm:gap-6"
            >
              {/* Dimension label */}
              <div className="flex items-start">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  {row.dimension}
                </span>
              </div>

              {/* Traditional */}
              <div className="flex gap-3 rounded-xl bg-rose-500/[0.04] p-4 sm:rounded-none sm:bg-transparent sm:p-0">
                {/* Mobile label */}
                <div className="flex shrink-0 flex-col items-start gap-1 sm:hidden">
                  <X className="mt-0.5 size-3 text-rose-500/60" />
                </div>
                <p className="text-sm leading-relaxed text-slate-500">
                  {row.traditional}
                </p>
              </div>

              {/* Aether */}
              <div className="flex gap-3 rounded-xl bg-emerald-500/[0.04] p-4 sm:rounded-none sm:bg-transparent sm:p-0">
                <div className="flex shrink-0 flex-col items-start gap-1 sm:hidden">
                  <Check className="mt-0.5 size-3 text-emerald-500/80" />
                </div>
                <p className="text-sm leading-relaxed text-slate-300">
                  {row.aether}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Closing principle — direct quote from README philosophy */}
        <blockquote className="border-l-2 border-emerald-500/40 pl-5">
          <p className="text-base leading-relaxed text-slate-400">
            "Aether demonstrates how goal-driven systems can transform business objectives into coordinated action while preserving transparency, institutional memory, and accumulated learning."
          </p>
          <cite className="mt-2 block text-xs font-medium uppercase tracking-[0.25em] text-slate-600 not-italic">
            Aether — Design Principle
          </cite>
        </blockquote>

      </div>
    </section>
  );
}