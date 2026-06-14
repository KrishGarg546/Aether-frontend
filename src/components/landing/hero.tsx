import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import { PipelineViz } from "./pipeline-viz";

export function Hero() {
  return (
    <section className="relative flex min-h-[calc(100vh-3.5rem)] w-full items-center overflow-hidden bg-slate-950">
      {/* ── Background treatment ─────────────────────────────────────────── */}
      {/* Single radial glow — placed top-right to bleed behind the viz panel */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 h-[600px] w-[600px] -translate-y-1/4 translate-x-1/4 rounded-full bg-emerald-500/[0.04] blur-3xl"
      />
      {/* Bottom-left counter-glow — keeps the left column from feeling flat */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 h-[400px] w-[400px] translate-y-1/3 -translate-x-1/3 rounded-full bg-emerald-500/[0.03] blur-3xl"
      />
      {/* Hairline top border — matches GlobalNav bottom border on scroll */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent"
      />

      {/* ── Content grid ─────────────────────────────────────────────────── */}
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-16 px-6 py-24 lg:flex-row lg:items-center lg:gap-12 lg:py-0">

        {/* Left — copy block */}
        <div className="flex flex-1 flex-col items-start gap-8">

          {/* Eyebrow */}
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2" aria-hidden>
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="text-xs font-medium uppercase tracking-[0.35em] text-emerald-400/80">
              Goal-Driven Marketing Orchestration
            </span>
          </div>

          {/* Headline */}
          <div className="flex flex-col gap-3">
            <h1 className="text-5xl font-semibold tracking-tight text-slate-100 sm:text-6xl">
              State the goal.
              <br />
              <span className="text-slate-400">Aether runs the mission.</span>
            </h1>
          </div>

          {/* Supporting copy */}
          <p className="max-w-lg text-base leading-relaxed text-slate-400">
            Aether interprets a business objective, identifies the right audience,
            plans coordinated outreach across channels, executes the campaign,
            and transforms every outcome into institutional knowledge that informs
            future missions.
          </p>

          <div className="flex flex-wrap gap-2">
            {[
              "reactivation",
              "loyalty",
              "cross_sell",
              "manual_review",
            ].map((objective) => (
              <span
                key={objective}
                className="rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-slate-400"
              >
                {objective.replace("_", " ")}
              </span>
            ))}
          </div>

          {/* Stat strip — factual system specs, not hyperbole */}
          <dl className="flex flex-wrap gap-x-8 gap-y-3">
            {[
              { value: "7-stage", label: "orchestration pipeline" },
              { value: "3 channels", label: "email · SMS · push" },
              { value: "Persistent", label: "learning accumulation" },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-col gap-0.5">
                <dt className="text-sm font-semibold text-slate-100">
                  {value}
                </dt>
                <dd className="text-xs text-slate-500">{label}</dd>
              </div>
            ))}
          </dl>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/mission-control"
              className={[
                "inline-flex items-center gap-2 rounded-full",
                "bg-emerald-500 px-5 py-2.5",
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
                "border border-slate-700 px-5 py-2.5",
                "text-sm font-medium text-slate-300",
                "transition hover:border-slate-500 hover:text-slate-100",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
              ].join(" ")}
            >
              Explore Intelligence
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>

        {/* Right — animated pipeline viz */}
        <div className="flex w-full justify-center lg:w-auto lg:justify-end">
          <PipelineViz />
        </div>
      </div>

      {/* ── Bottom fade — blends hero into the next section ──────────────── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950 to-transparent"
      />
    </section>
  );
}