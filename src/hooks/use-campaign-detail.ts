// src/hooks/use-campaign-detail.ts

import { useQuery } from "@tanstack/react-query";
import { aetherApi } from "@/services/aether-api";

/**
 * Fetches full detail for a single campaign execution, used when a
 * campaign in the Archive is expanded.
 *
 * Disabled until `enabled` is true, so detail is only fetched once
 * a campaign card is actually expanded.
 */
export function useCampaignDetail(id: number, enabled: boolean) {
  return useQuery({
    queryKey: ["campaigns", id],
    queryFn: () => aetherApi.getCampaign(id),
    enabled,
  });
}