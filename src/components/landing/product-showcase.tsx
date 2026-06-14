import Link from "next/link";
import { ArrowRight, Zap, BarChart2, BookOpen, Archive } from "lucide-react";

const PAGES = [
  {
    href: "/mission-control",
    icon: Zap,
    label: "Mission Control",
    tag: "Execute",
    description:
      "Begin with a business objective. Aether selects the audience, orchestrates the campaign, executes communications, and surfaces outcomes through a transparent mission workflow.",
    detail: "run-campaign · live pipeline status · outcome summary",
  },
  {
    href: "/intelligence",
    icon: BarChart2,
    label: "Intelligence",
    tag: "Analyse",
    description:
      "Aether's current read on the customer base: health distribution, lifecycle stage breakdown, product affinity clusters, churn risk segments, and next-best-action recommendations. Grounded in the same signals that drive audience selection.",
    detail: "customer_health · product_affinity · churn signals",
  },
  {
    href: "/learnings",
    icon: BookOpen,
    label: "Learnings",
    tag: "Accumulate",
    description:
      "Aether's accumulated experience. Internalized lessons, recurring observations, and meaningful milestones emerge as missions compound over time.",
    detail: "internalized lessons · observed patterns · evolution feed",
  },
  {
    href: "/archive",
    icon: Archive,
    label: "Archives",
    tag: "Audit",
    description:
      "The institutional memory of Aether. Review historical missions, execution metadata, outcomes, and recommendations through a complete audit trail.",
    detail: "campaign history · execution metadata · all objectives",
  },
] as const;

export function ProductShowcase() {
  return (
    <section className="w-full bg-slate-950 py-24">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6">

        {/* Section header */}
        <div className="flex flex-col gap-4">
          <span className="text-xs font-medium uppercase tracking-[0.35em] text-emerald-400/80">
            The product
          </span>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-100 sm:text-4xl">
              Four views into one running system.
            </h2>
            <p className="max-w-xs text-sm leading-relaxed text-slate-500 sm:text-right">
              Together, these views reveal how Aether plans, observes, remembers, and improves over time.
            </p>
          </div>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {PAGES.map((page) => {
            const Icon = page.icon;

            return (
              <Link
                key={page.href}
                href={page.href}
                className={[
                  "group relative flex flex-col gap-5 rounded-2xl",
                  "border border-slate-800 bg-slate-900/40 p-6",
                  "transition-all duration-300 hover:-translate-y-1",
                  "hover:border-slate-700 hover:bg-slate-900/80",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60",
                ].join(" ")}
              >
                {/* Top row — icon + tag */}
                <div className="flex items-start justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700/60 bg-slate-900 transition-colors group-hover:border-emerald-500/30 group-hover:bg-emerald-500/10">
                    <Icon className="size-4 text-slate-400 transition-colors group-hover:text-emerald-400" />
                  </div>
                  <span className="rounded-full border border-slate-700 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500 transition-colors group-hover:border-slate-600 group-hover:text-slate-400">
                    {page.tag}
                  </span>
                </div>

                {/* Copy */}
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-base font-semibold text-slate-100">
                    {page.label}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-400">
                    {page.description}
                  </p>
                </div>

                {/* Footer row */}
                <div className="mt-auto flex items-center justify-between border-t border-slate-800 pt-4">
                  <span className="font-mono text-[11px] text-slate-600">
                    {page.detail}
                  </span>
                  <ArrowRight className="size-3.5 text-slate-600 transition-all duration-150 group-hover:translate-x-0.5 group-hover:text-emerald-400" />
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}