"use client";

import { useEffect, useState } from "react";
import {
  Target,
  Users,
  LayoutList,
  Send,
  BarChart2,
  BookOpen,
} from "lucide-react";

// Real objective labels from backendContracts.md — no invented copy
const EXAMPLE_GOALS = [
  "Bring back dormant customers",
  "Reduce churn among wellness customers",
  "Reward loyal customers this quarter",
  "Recommend complementary products",
  "Promote childproofing products to new parents",
] as const;

const PIPELINE_STAGES = [
  { id: "goal_parser", label: "Goal understood", icon: Target },
  { id: "audience_selector", label: "Audience selected", icon: Users },
  { id: "campaign_planner", label: "Campaign planned", icon: LayoutList },
  { id: "communication_manager", label: "Communications prepared", icon: Send },
  { id: "channel_service", label: "Channels activated", icon: Send },
  { id: "insights_engine", label: "Insights generated", icon: BarChart2 },
  { id: "learnings", label: "Learnings recorded", icon: BookOpen },
] as const;

// How long each stage stays "active" before the next fires (ms)
const STAGE_INTERVAL = 520;
// Pause at end of a full cycle before cycling the goal (ms)
const CYCLE_PAUSE = 2200;
// Typing speed (ms per character)
const TYPE_SPEED = 38;

export function PipelineViz() {
  const [goalIndex, setGoalIndex] = useState(0);
  const [displayedGoal, setDisplayedGoal] = useState("");
  const [activeStage, setActiveStage] = useState<number>(-1);
  const [completedStages, setCompletedStages] = useState<Set<number>>(
    new Set()
  );

  // Sequence: type goal → light up stages one by one → pause → reset → next goal
  useEffect(() => {
    let cancelled = false;

    const runCycle = async (gIdx: number) => {
      const goal = EXAMPLE_GOALS[gIdx % EXAMPLE_GOALS.length];

      // 1. Type out the goal string
      for (let i = 0; i <= goal.length; i++) {
        if (cancelled) return;
        setDisplayedGoal(goal.slice(0, i));
        await delay(TYPE_SPEED);
      }

      // Brief pause before pipeline fires
      await delay(400);

      // 2. Light up each stage sequentially
      for (let s = 0; s < PIPELINE_STAGES.length; s++) {
        if (cancelled) return;
        setActiveStage(s);
        setCompletedStages((prev) => {
          const next = new Set(prev);
          next.add(s);
          return next;
        });
        await delay(STAGE_INTERVAL);
      }

      // 3. All stages complete — pause, then reset for next goal
      await delay(CYCLE_PAUSE);
      if (cancelled) return;

      setActiveStage(-1);
      setCompletedStages(new Set());
      setDisplayedGoal("");

      await delay(300);
      if (cancelled) return;

      setGoalIndex((prev) => (prev + 1) % EXAMPLE_GOALS.length);
    };

    runCycle(goalIndex);

    return () => {
      cancelled = true;
    };
    // goalIndex is the only dep — re-runs whenever index advances
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goalIndex]);

  return (
    <div
      aria-hidden // decorative animation; not essential content
      className="relative flex w-full max-w-sm flex-col gap-0 select-none"
    >
      {/* Ambient glow behind the panel */}
      <div className="pointer-events-none absolute -inset-8 -z-10 rounded-3xl bg-emerald-500/5 blur-2xl" />

      {/* Goal input card */}
      <div className="rounded-t-2xl border border-slate-700/60 bg-slate-900/80 px-5 py-4 backdrop-blur-sm">
        <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.3em] text-slate-500">
          Mission goal
        </p>
        <div className="flex items-start gap-2">
          <span className="mt-0.5 text-emerald-400/60">›</span>
          <p className="min-h-[2.5rem] text-sm leading-relaxed text-slate-200">
            {displayedGoal}
            {/* Blinking cursor */}
            <span className="ml-0.5 inline-block h-3.5 w-px animate-[blink_1s_step-end_infinite] bg-emerald-400 align-middle" />
          </p>
        </div>
      </div>

      {/* Divider connector */}
      <div className="mx-6 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />

      {/* Pipeline stages */}
      <div className="rounded-b-2xl border border-t-0 border-slate-700/60 bg-slate-900/60 px-5 py-4 backdrop-blur-sm">
        <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.3em] text-slate-500">
          Pipeline
        </p>
        <ul className="flex flex-col gap-2.5">
          {PIPELINE_STAGES.map((stage, idx) => {
            const isComplete = completedStages.has(idx);
            const isActive = activeStage === idx;
            const Icon = stage.icon;

            return (
              <li
                key={stage.id}
                className={[
                  "flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-300",
                  isActive
                    ? "bg-emerald-500/10 border border-emerald-500/20"
                    : isComplete
                    ? "bg-slate-800/40 border border-slate-700/30"
                    : "border border-transparent",
                ].join(" ")}
              >
                {/* Stage icon */}
                <span
                  className={[
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-md transition-colors duration-300",
                    isComplete || isActive
                      ? "bg-emerald-500/15 text-emerald-400"
                      : "bg-slate-800 text-slate-600",
                  ].join(" ")}
                >
                  <Icon className="size-3" />
                </span>

                {/* Stage label */}
                <span
                  className={[
                    "text-xs font-medium transition-colors duration-300",
                    isActive
                      ? "text-emerald-300"
                      : isComplete
                      ? "text-slate-300"
                      : "text-slate-600",
                  ].join(" ")}
                >
                  {stage.label}
                </span>

                {/* Completion dot — far right */}
                <span className="ml-auto flex h-1.5 w-1.5 shrink-0">
                  {isActive && (
                    <>
                      <span className="absolute inline-flex h-1.5 w-1.5 animate-ping rounded-full bg-emerald-400/60" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    </>
                  )}
                  {isComplete && !isActive && (
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500/60" />
                  )}
                </span>
              </li>
            );
          })}
        </ul>

        {/* Completion bar */}
        <div className="mt-4 h-px w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full bg-emerald-500/50 transition-all duration-500 ease-out"
            style={{
              width: `${(completedStages.size / PIPELINE_STAGES.length) * 100}%`,
            }}
          />
        </div>
        <p className="mt-1.5 text-right text-[10px] text-slate-600">
          {completedStages.size}/{PIPELINE_STAGES.length} stages
        </p>
      </div>
    </div>
  );
}

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}