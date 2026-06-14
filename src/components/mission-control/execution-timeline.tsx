"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { PIPELINE_STAGES, type PipelineStatus } from "@/types/campaigns";

interface ExecutionTimelineProps {
  goal: string;
  pipeline: PipelineStatus;
  /** Whether the backend is still preparing pipeline data. */
  loading?: boolean;
  /** Called once every stage has been revealed. */
  onComplete?: () => void;
  /** Milliseconds between revealing each stage. */
  stepDelayMs?: number;
}

const STAGE_DESCRIPTIONS: Record<string, string> = {
  goal_parser: "Objective interpreted and classified.",
  audience_selector: "Target audience identified for this mission.",
  campaign_planner: "Campaign strategy and channels prepared.",
  communication_manager: "Communications generated for delivery.",
  channel_service: "Dispatch events processed through delivery channels.",
  insights_engine: "Mission outcomes translated into intelligence.",
  learnings: "Observations recorded for future missions.",
};

export function ExecutionTimeline({
  goal,
  pipeline,
  loading = false,
  onComplete,
  stepDelayMs = 450,
}: ExecutionTimelineProps) {
  const [revealedCount, setRevealedCount] = useState(0);

  useEffect(() => {
    if (loading) {
      setRevealedCount(1);
      return;
    }

    if (revealedCount === 0) {
      setRevealedCount(1);
      return;
    }

    if (revealedCount >= PIPELINE_STAGES.length) {
      onComplete?.();
      return;
    }

    const timeout = setTimeout(() => {
      setRevealedCount((count) => count + 1);
    }, stepDelayMs);

    return () => clearTimeout(timeout);
  }, [loading, revealedCount, stepDelayMs, onComplete]);

  return (
    <div className="flex w-full max-w-xl flex-col gap-8">
      <div className="flex flex-col gap-2 text-center">
        <span className="text-xs font-medium uppercase tracking-[0.4em] text-emerald-400/80">
          Executing mission
        </span>
        <p className="text-sm text-slate-400">
          “{goal}”
        </p>
        <span className="text-xs text-slate-500">
          {loading
            ? "Initializing orchestration pipeline..."
            : `${Math.min(revealedCount, PIPELINE_STAGES.length)}/${PIPELINE_STAGES.length} stages complete`}
        </span>
      </div>

      <ol className="relative flex flex-col gap-6 pl-2">
        <div
          aria-hidden
          className="absolute left-[15px] top-2 bottom-2 w-px bg-slate-800"
        />

        {PIPELINE_STAGES.map((stage, index) => {
          const isRevealed = index < revealedCount;
          const isActive =
            loading
              ? index === 0
              : index === revealedCount - 1 && revealedCount < PIPELINE_STAGES.length;

          const status = loading
            ? "PENDING"
            : pipeline[stage.key] === "FAILED"
              ? "FAILED"
              : index < revealedCount - 1
                ? "OK"
                : index === revealedCount - 1 && revealedCount < PIPELINE_STAGES.length
                  ? "PENDING"
                  : pipeline[stage.key];

          return (
            <motion.li
              key={stage.key}
              initial={{ opacity: 0, y: 6 }}
              animate={isRevealed ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative flex items-start gap-4"
            >
              <span
                className={cn(
                  "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border",
                  "bg-slate-950 transition-colors",
                  !isRevealed && "border-slate-800 text-slate-700",
                  isRevealed &&
                    status === "OK" &&
                    "border-emerald-500/60 text-emerald-400",
                  isRevealed &&
                    status === "FAILED" &&
                    "border-rose-500/60 text-rose-400",
                  isRevealed &&
                    status === "PENDING" &&
                    "border-slate-600 text-slate-400"
                )}
              >
                {!isRevealed && (
                  <span className="size-1.5 rounded-full bg-slate-700" />
                )}
                {isActive && status === "PENDING" && (
                  <Loader2 className="size-4 animate-spin" />
                )}
                {isRevealed && status === "OK" && (
                  <Check className="size-4" />
                )}
                {isRevealed && status === "FAILED" && <X className="size-4" />}
              </span>

              <div className="flex flex-1 flex-col gap-0.5 pt-1">
                <span
                  className={cn(
                    "text-sm font-medium transition-colors",
                    isRevealed ? "text-slate-100" : "text-slate-600"
                  )}
                >
                  {stage.label}
                </span>
                {isRevealed && (
                  <span className="text-xs text-slate-500">
                    {STAGE_DESCRIPTIONS[stage.key]}
                  </span>
                )}
                {isRevealed && (
                  <span
                    className={cn(
                      "text-xs transition-colors",
                      status === "OK" && "text-emerald-400/70",
                      status === "FAILED" && "text-rose-400/70",
                      status === "PENDING" && "text-slate-500",
                      isActive && "text-slate-400"
                    )}
                  >
                    {status === "OK" && "Stage completed"}
                    {status === "FAILED" && "Stage failed"}
                    {status === "PENDING" && "Currently processing"}
                  </span>
                )}
              </div>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}