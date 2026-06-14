// src/hooks/use-campaigns.ts

import { useQuery } from "@tanstack/react-query";
import { aetherApi } from "@/services/aether-api";

/**
 * Fetches the full campaign execution history for the Archive view.
 */
export function useCampaigns() {
  return useQuery({
    queryKey: ["campaigns"],
    queryFn: () => aetherApi.getCampaigns(),
  });
}