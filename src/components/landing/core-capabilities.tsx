import { Target, Users, Send, TrendingUp } from "lucide-react";

const CAPABILITIES = [
  {
    icon: Target,
    title: "Goal Understanding",
    description:
      "Marketers express objectives in natural language. Aether interprets intent, maps goals into executable strategies, and ensures ambiguous requests degrade gracefully rather than interrupting execution.",
    detail: "rule-based NLP · synonym expansion · graceful fallback",
  },
  {
    icon: Users,
    title: "Audience Intelligence",
    description:
      "Audience selection combines customer health, lifecycle signals, purchasing behaviour, and historical context to identify who matters most for a given objective. Selection reasoning remains transparent and inspectable.",
    detail: "customer_health · customer_stories · cohort reasoning",
  },
  {
    icon: Send,
    title: "Campaign Orchestration",
    description:
      "Planning, personalisation, and execution occur within a unified orchestration pipeline. Communications are coordinated across channels while outcomes are systematically captured for downstream intelligence.",
    detail: "email · SMS · push · immutable receipt ledger",
  },
  {
    icon: TrendingUp,
    title: "Continuous Learning",
    description:
      "Every mission contributes new evidence. Outcomes are translated into recommendations, recurring observations, and accumulated lessons that strengthen future decision-making.",
    detail: "insights_engine · internalized lessons · observed patterns",
  },
] as const;

export function CoreCapabilities() {
  return (
    <section className="w-full bg-[#020617] py-24">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6">

        {/* Section header */}
        <div className="flex flex-col gap-4">
          <span className="text-xs font-medium uppercase tracking-[0.35em] text-emerald-400/80">
            Core capabilities
          </span>
          <h2 className="max-w-xl text-3xl font-semibold tracking-tight text-slate-100 sm:text-4xl">
            Intelligence woven throughout the entire mission lifecycle.
          </h2>
        </div>

        {/* Capability grid */}
        <div className="grid grid-cols-1 gap-px bg-slate-800/60 sm:grid-cols-2">
          {CAPABILITIES.map((cap, idx) => {
            const Icon = cap.icon;
            // Alternate subtle background tints for the quadrant layout
            const isEven = idx % 2 === 0;

            return (
              <div
                key={cap.title}
                className={[
                  "flex flex-col gap-5 p-8 transition-transform duration-300 hover:-translate-y-1",
                  isEven ? "bg-[#020617]" : "bg-slate-950/60",
                ].join(" ")}
              >
                {/* Icon */}
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700/60 bg-slate-900">
                  <Icon className="size-4 text-emerald-400/80" />
                </div>

                {/* Copy */}
                <div className="flex flex-col gap-2">
                  <h3 className="text-base font-semibold text-slate-100">
                    {cap.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-400">
                    {cap.description}
                  </p>
                </div>

                {/* Technical detail strip */}
                <p className="font-mono text-[11px] text-slate-600">
                  {cap.detail}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}