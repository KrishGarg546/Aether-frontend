import {
    Target,
    Users,
    LayoutList,
    Send,
    Radio,
    BarChart2,
    BookOpen,
  } from "lucide-react";
  
  const STAGES = [
    {
      icon: Target,
      label: "Goal Parser",
      description:
        "A plain-English objective — 'Reward loyal customers' or 'Reduce churn' — is normalised, matched against known intents, and resolved into a structured execution strategy. Unrecognised input falls back to manual review without raising an error.",
      tag: "goal_parser",
    },
    {
      icon: Users,
      label: "Audience Selector",
      description:
        "Customers are filtered and ranked using health scores, recency signals, CLV tier, and lifecycle stage. The output is a prioritised cohort with a selection reason recorded for every customer included.",
      tag: "audience_selector",
    },
    {
      icon: LayoutList,
      label: "Campaign Planner",
      description:
        "A campaign name, channel strategy, offer logic, and messaging tone are derived from the resolved objective and cohort profile. Planning decisions are deterministic and fully auditable.",
      tag: "campaign_planner",
    },
    {
      icon: Send,
      label: "Communication Manager",
      description:
        "One personalised communication record is generated per customer. Identifiers are deterministic within a run and unique across runs — enabling reproducible demonstrations without receipt collisions.",
      tag: "communication_manager",
    },
    {
      icon: Radio,
      label: "Channel Service",
      description:
        "Communications are routed through the appropriate delivery channels and simulated receipts are generated. Every dispatch contributes to the execution ledger used by downstream intelligence.",
      tag: "channel_service",
    },
    {
      icon: BarChart2,
      label: "Insights Engine",
      description:
        "Delivery rate, open rate, click rate, and failure rate are computed from the receipt ledger. Each metric produces a natural-language recommendation a non-technical marketer can read and act on.",
      tag: "insights_engine",
    },
    {
      icon: BookOpen,
      label: "Learnings",
      description:
        "Execution outcomes, internalized lessons, and observed patterns accumulate across missions. Aether's understanding of what works deepens with every run — without requiring manual analysis.",
      tag: "learnings",
    },
  ] as const;
  
  export function HowItWorks() {
    return (
      <section className="w-full bg-slate-950 py-24">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6">
  
          {/* Section header */}
          <div className="flex flex-col gap-4">
            <span className="text-xs font-medium uppercase tracking-[0.35em] text-emerald-400/80">
              How it works
            </span>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <h2 className="text-3xl font-semibold tracking-tight text-slate-100 sm:text-4xl">
                One goal. Seven stages.
                <br />
                A complete campaign.
              </h2>
              <p className="max-w-sm text-sm leading-relaxed text-slate-500 sm:text-right">
                Every stage owns a single responsibility and contributes to a transparent execution trail. Decisions remain inspectable from the initial objective through accumulated learnings.
              </p>
            </div>
          </div>
  
          {/* Pipeline — vertical on mobile, horizontal connector on desktop */}
          <div className="relative">
  
            {/* Horizontal connector line — desktop only */}
            <div
              aria-hidden
              className="absolute left-0 right-0 top-[2.125rem] hidden h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent lg:block"
            />
  
            <ol className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-7 lg:gap-4">
              {STAGES.map((stage, idx) => {
                const Icon = stage.icon;
                const isLast = idx === STAGES.length - 1;
  
                return (
                  <li key={stage.tag} className="relative flex flex-col gap-4">
  
                    {/* Vertical connector — mobile only */}
                    {!isLast && (
                      <div
                        aria-hidden
                        className="absolute left-[1.0625rem] top-[4.5rem] h-[calc(100%+1.5rem)] w-px bg-gradient-to-b from-slate-700 to-transparent lg:hidden"
                      />
                    )}
  
                    {/* Icon node */}
                    <div className="relative z-10 flex h-[2.25rem] w-[2.25rem] shrink-0 items-center justify-center rounded-full border border-slate-700 bg-slate-900">
                      <Icon className="size-3.5 text-emerald-400/80" />
                    </div>
  
                    {/* Stage content */}
                    <div className="flex flex-col gap-1.5 pl-0 lg:pl-0">
                      {/* Stage number pill */}
                      <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-slate-600">
                        Stage {idx + 1}
                      </span>
                      <h3 className="text-sm font-semibold text-slate-100">
                        {stage.label}
                      </h3>
                      <p className="text-xs leading-relaxed text-slate-500">
                        {stage.description}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
  
          {/* Pipeline code label — grounds the design in system reality */}
          <div className="flex items-center gap-3 border-t border-slate-800 pt-6">
            <span className="font-mono text-[11px] text-slate-600">
              Pipeline status on completion:
            </span>
            <div className="flex flex-wrap gap-2">
              {STAGES.map((s) => (
                <span
                  key={s.tag}
                  className="rounded bg-slate-900 px-2 py-0.5 font-mono text-[10px] text-slate-500"
                >
                  {s.tag}:{" "}
                  <span className="text-emerald-500/80">OK</span>
                </span>
              ))}
            </div>
          </div>
  
        </div>
      </section>
    );
  }