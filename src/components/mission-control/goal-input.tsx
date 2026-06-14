"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const EXAMPLE_GOALS = [
  "Bring back dormant customers",
  "Reward loyal customers this quarter",
  "Recommend complementary products",
  "Reduce churn among wellness customers",
];

export interface MissionLaunchConfig {
  goal: string;
  audienceStrategy: "AUTO" | "CUSTOM";
  audienceSize?: number;
}

interface GoalInputProps {
  onLaunch: (config: MissionLaunchConfig) => void;
  isLaunching?: boolean;
}

export function GoalInput({ onLaunch, isLaunching = false }: GoalInputProps) {
  const [goal, setGoal] = useState("");
  const [audienceStrategy, setAudienceStrategy] = useState<"AUTO" | "CUSTOM">("AUTO");
  const [audienceSize, setAudienceSize] = useState("300");

  const canLaunch = goal.trim().length > 0 && !isLaunching;

  const handleLaunch = () => {
    if (!canLaunch) return;

    onLaunch({
      goal: goal.trim(),
      audienceStrategy,
      audienceSize:
        audienceStrategy === "CUSTOM" && audienceSize !== ""
          ? Number(audienceSize)
          : undefined,
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      handleLaunch();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex w-full max-w-2xl flex-col items-center gap-10 text-center"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2 w-2" aria-hidden>
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span className="text-xs font-medium uppercase tracking-[0.4em] text-emerald-400/80">
            Aether
          </span>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-100 sm:text-4xl">
          What marketing outcome do you want to achieve today?
        </h1>
      </div>

      <div className="flex w-full flex-col gap-4">
        <div className="relative">
          <textarea
            value={goal}
            onChange={(event) => setGoal(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. Bring back dormant customers"
            rows={4}
            disabled={isLaunching}
            className={cn(
              "w-full resize-none rounded-2xl border border-slate-700/60 bg-slate-900/60",
              "px-5 py-4 text-base text-slate-100 placeholder:text-slate-500",
              "shadow-[0_0_0_1px_rgba(16,185,129,0.05)] outline-none transition",
              "focus:border-emerald-500/60 focus:shadow-[0_0_0_1px_rgba(16,185,129,0.25)]",
              "disabled:cursor-not-allowed disabled:opacity-60"
            )}
          />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {EXAMPLE_GOALS.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => setGoal(example)}
              disabled={isLaunching}
              className={cn(
                "rounded-full border border-slate-700/60 bg-slate-900/40 px-3 py-1.5",
                "text-xs text-slate-400 transition hover:border-emerald-500/40 hover:text-slate-200",
                "disabled:cursor-not-allowed disabled:opacity-50"
              )}
            >
              {example}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-slate-700/60 bg-slate-900/40 p-4 text-left">
          <div className="mb-3">
            <h3 className="text-sm font-medium text-slate-200">
              Audience Strategy
            </h3>
            <p className="text-xs text-slate-500">
              Let Aether recommend an audience size, or override it.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setAudienceStrategy("AUTO")}
              disabled={isLaunching}
              className={cn(
                "rounded-xl border p-4 text-left transition-all",
                audienceStrategy === "AUTO"
                  ? "border-emerald-500/50 bg-emerald-500/10"
                  : "border-slate-700/60 bg-slate-900/40 hover:border-slate-600"
              )}
            >
              <div className="mb-1 text-sm font-medium text-slate-100">
                ✨ Let Aether Recommend
              </div>
              <p className="text-xs text-slate-500">
                Aether selects an audience size based on the mission objective.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setAudienceStrategy("CUSTOM")}
              disabled={isLaunching}
              className={cn(
                "rounded-xl border p-4 text-left transition-all",
                audienceStrategy === "CUSTOM"
                  ? "border-emerald-500/50 bg-emerald-500/10"
                  : "border-slate-700/60 bg-slate-900/40 hover:border-slate-600"
              )}
            >
              <div className="mb-1 text-sm font-medium text-slate-100">
                🎛 Customize Audience
              </div>
              <p className="text-xs text-slate-500">
                Override the recommended audience size.
              </p>

              {audienceStrategy === "CUSTOM" && (
                <input
                  type="number"
                  min={1}
                  value={audienceSize}
                  onChange={(event) => {
                    const value = event.target.value;
                    if (value === "") {
                      setAudienceSize("");
                      return;
                    }
                    if (!Number.isNaN(Number(value))) {
                      setAudienceSize(value);
                    }
                  }}
                  disabled={isLaunching}
                  className="mt-3 w-32 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-emerald-500"
                />
              )}
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLaunch}
          disabled={!canLaunch}
          className={cn(
            "group inline-flex items-center justify-center gap-2 self-center rounded-full",
            "bg-emerald-500 px-8 py-3 text-sm font-semibold text-slate-950 transition",
            "hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
          )}
        >
          {isLaunching ? "Launching..." : "Launch Mission"}
          <ArrowRight
            className={cn(
              "size-4 transition-transform",
              !isLaunching && "group-hover:translate-x-0.5"
            )}
          />
        </button>
      </div>
    </motion.div>
  );
}