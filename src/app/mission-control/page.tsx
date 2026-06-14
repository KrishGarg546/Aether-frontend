"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, RotateCcw } from "lucide-react";
import {
  GoalInput,
  type MissionLaunchConfig,
} from "@/components/mission-control/goal-input";
import { ExecutionTimeline } from "@/components/mission-control/execution-timeline";
import { CampaignSummary } from "@/components/mission-control/campaign-summary";
import { useRunCampaign } from "@/hooks/use-run-campaign";

type MissionState = "idle" | "execution" | "outcome";

export default function MissionControlPage() {
  const [missionState, setMissionState] = useState<MissionState>("idle");
  const [goal, setGoal] = useState("");
  const [timelineComplete, setTimelineComplete] = useState(false);

  const runCampaign = useRunCampaign();

  const handleLaunch = (config: MissionLaunchConfig) => {
    setGoal(config.goal);
    setTimelineComplete(false);
    setMissionState("execution");

    runCampaign.mutate(
      {
        goal: config.goal,
        audience_strategy: config.audienceStrategy,
        audience_size: config.audienceSize,
      },
      {
        onSuccess: () => {
          // Transition to outcome only once the cinematic timeline
          // has finished revealing every stage.
        },
      }
    );
  };

  const handleReset = () => {
    runCampaign.reset();
    setGoal("");
    setTimelineComplete(false);
    setMissionState("idle");
  };

  const showOutcome =
    missionState === "outcome" && runCampaign.isSuccess && runCampaign.data;

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-slate-950 px-6 py-16">
      <AnimatePresence mode="wait">
        {missionState === "idle" && (
          <motion.div
            key="idle"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex w-full justify-center"
          >
            <GoalInput onLaunch={handleLaunch} />
          </motion.div>
        )}

        {missionState === "execution" && !showOutcome && (
          <motion.div
            key="execution"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex w-full flex-col items-center justify-center gap-8"
          >
            {runCampaign.isError ? (
              <div className="flex w-full max-w-xl flex-col items-center gap-4 rounded-2xl border border-rose-500/30 bg-rose-500/5 px-6 py-8 text-center">
                <AlertTriangle className="size-8 text-rose-400" />
                <div className="flex flex-col gap-1">
                  <h2 className="text-lg font-semibold text-slate-100">
                    Mission failed to launch
                  </h2>
                  <p className="text-sm text-slate-400">
                    {runCampaign.error?.message ??
                      "The pipeline could not be reached. Try again."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-emerald-500/40 hover:text-slate-100"
                >
                  <RotateCcw className="size-4" />
                  Try again
                </button>
              </div>
            ) : (
              <ExecutionTimeline
                goal={goal}
                pipeline={
                  runCampaign.data?.pipeline ?? {
                    "Goal Parser": "PENDING",
                    "Audience Selector": "PENDING",
                    "Campaign Planner": "PENDING",
                    "Communication Manager": "PENDING",
                    "Channel Service": "PENDING",
                    "Insights Engine": "PENDING",
                    "Receipt API": "PENDING",
                  }
                }
                loading={!runCampaign.data}
                onComplete={() => {
                  if (timelineComplete) return;

                  setTimelineComplete(true);

                  setTimeout(() => {
                    setMissionState("outcome");
                  }, 1000);
                }}
              />
            )}
          </motion.div>
        )}

        {showOutcome && runCampaign.data && (
          <motion.div
            key="outcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex w-full flex-col items-center gap-8"
          >
            <CampaignSummary result={runCampaign.data} />
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:border-emerald-500/40 hover:text-slate-100"
            >
              <RotateCcw className="size-4" />
              Launch another mission
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}