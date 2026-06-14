// src/hooks/use-run-campaign.ts

import { useMutation } from "@tanstack/react-query";
import { aetherApi } from "@/services/aether-api";
import type { RunCampaignResponse } from "@/types/campaigns";

interface RunCampaignRequest {
  goal: string;
  audience_strategy?: "AUTO" | "CUSTOM";
  audience_size?: number;
}

/**
 * Drives the Mission Control execution flow: submits a marketer goal
 * to the Aether pipeline and returns the full execution response
 * (pipeline status, insights, receipts, raw_result) used to render
 * the execution timeline and outcome view.
 */
export function useRunCampaign() {
  return useMutation<RunCampaignResponse, Error, RunCampaignRequest>({
    mutationFn: (payload) => aetherApi.runCampaign(payload),
  });
}