import Link from "next/link";
import { Zap, ArrowRight } from "lucide-react";

// Compact pipeline label strip — grounds the CTA in system reality
const STAGES = [
  "Goal Parser",
  "Audience Selector",
  "Campaign Planner",
  "Communication Manager",
  "Channel Service",
  "Insights Engine",
  "Learnings",
] as const;

export function FinalCta() {
  return (
    <section className="w-full bg-slate-950 py-24">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-12 px-6 text-center">

        {/* Pipeline stage strip — decorative but semantically real */}
        <div
          aria-hidden
          className="flex flex-wrap items-center justify-center gap-2"
        >
          {STAGES.map((stage, idx) => (
            <div key={stage} className="flex items-center gap-2">
              <span className="rounded bg-slate-900 px-2.5 py-1 font-mono text-[10px] text-slate-600">
                {stage}
              </span>
              {idx < STAGES.length - 1 && (
                <span className="text-slate-700">→</span>
              )}
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px w-24 bg-gradient-to-r from-transparent via-slate-700 to-transparent" />

        {/* Headline */}
        <div className="flex flex-col items-center gap-5">
          {/* Live indicator */}
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2" aria-hidden>
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="text-xs font-medium uppercase tracking-[0.35em] text-emerald-400/80">
              System ready
            </span>
          </div>

          <h2 className="max-w-2xl text-4xl font-semibold tracking-tight text-slate-100 sm:text-5xl">
            Your next mission is one goal away.
          </h2>

          <p className="max-w-lg text-base leading-relaxed text-slate-400">
            State what you want to achieve. Aether transforms objectives into
            coordinated action, surfaces intelligence from every mission,
            and preserves the lessons that strengthen future execution.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/mission-control"
            className={[
              "inline-flex items-center gap-2 rounded-full",
              "bg-emerald-500 px-6 py-3",
              "text-sm font-medium text-slate-950",
              "transition hover:bg-emerald-400",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
            ].join(" ")}
          >
            <Zap className="size-4" />
            Launch a mission
          </Link>

          <Link
            href="/intelligence"
            className={[
              "inline-flex items-center gap-2 rounded-full",
              "border border-slate-700 px-6 py-3",
              "text-sm font-medium text-slate-300",
              "transition hover:border-slate-500 hover:text-slate-100",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
            ].join(" ")}
          >
            Explore Intelligence
            <ArrowRight className="size-4" />
          </Link>
        </div>

        {/* Footer note */}
        <p className="text-xs text-slate-600">
          Transparent execution · Persistent learning · Free-tier deployable
        </p>

      </div>
    </section>
  );
}