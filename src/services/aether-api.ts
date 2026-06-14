// src/services/aether-api.ts

import type {
    RunCampaignRequest,
    RunCampaignResponse,
    CampaignListItem,
    CampaignDetail,
  } from "@/types/campaigns";
  
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_AETHER_API_BASE_URL ?? "/api";
  
  export class AetherApiError extends Error {
    status: number;
  
    constructor(message: string, status: number) {
      super(message);
      this.name = "AetherApiError";
      this.status = status;
    }
  }
  
  /**
   * Triggers the Aether pipeline end-to-end for a given marketer goal.
   *
   * POST /run-campaign/
   */
  export async function runCampaign(
    payload: RunCampaignRequest
  ): Promise<RunCampaignResponse> {
    const response = await fetch(`${API_BASE_URL}/run-campaign/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  
    if (!response.ok) {
      let message = `Run campaign failed with status ${response.status}`;
      try {
        const body = await response.json();
        if (body?.detail) {
          message = body.detail;
        }
      } catch {
        // response body wasn't JSON — fall back to default message
      }
      throw new AetherApiError(message, response.status);
    }
  
    return response.json() as Promise<RunCampaignResponse>;
  }
  
  /**
   * Fetches the full campaign execution history.
   *
   * GET /campaigns/
   */
  export async function getCampaigns(): Promise<CampaignListItem[]> {
    const response = await fetch(`${API_BASE_URL}/campaigns/`, {
      method: "GET",
    });
  
    if (!response.ok) {
      throw new AetherApiError(
        `Failed to load campaign history (status ${response.status})`,
        response.status
      );
    }
  
    return response.json() as Promise<CampaignListItem[]>;
  }
  
  /**
   * Fetches full detail for a single campaign execution.
   *
   * GET /campaigns/{id}/
   */
  export async function getCampaign(id: number): Promise<CampaignDetail> {
    const response = await fetch(`${API_BASE_URL}/campaigns/${id}/`, {
      method: "GET",
    });
  
    if (!response.ok) {
      throw new AetherApiError(
        `Failed to load campaign ${id} (status ${response.status})`,
        response.status
      );
    }
  
    return response.json() as Promise<CampaignDetail>;
  }
  
  export const aetherApi = {
    runCampaign,
    getCampaigns,
    getCampaign,
  };