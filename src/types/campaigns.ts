// src/types/campaigns.ts
// Generated strictly from backendContracts.md — do not invent fields.

import type { ProductAffinityEntry } from "./intelligence";

export interface RunCampaignRequest {
    goal: string;
  }
  
  export type PipelineStageStatus = "OK" | "FAILED" | "PENDING";
  
export interface PipelineStatus {
  "Goal Parser": PipelineStageStatus;
  "Audience Selector": PipelineStageStatus;
  "Campaign Planner": PipelineStageStatus;
  "Communication Manager": PipelineStageStatus;
  "Channel Service": PipelineStageStatus;
  "Receipt API": PipelineStageStatus;
  "Insights Engine": PipelineStageStatus;
  "Learnings"?: string;
}
  
export interface CampaignMetrics {
  delivery_rate: number;
  open_rate: number;
  click_rate: number;
  failure_rate: number;
}
  
export interface CampaignInsights {
  campaign_metrics: CampaignMetrics;
  intelligence_assets_loaded: IntelligenceAssetsLoaded;
  recommendations?: string[];
}
  
  export type ReceiptChannel = "email" | "sms" | "push" | "whatsapp";
  
  export interface CampaignReceipt {
    channel: ReceiptChannel;
  }
  
  export interface IntelligenceAssetsLoaded {
    customer_health: boolean;
    customer_stories: boolean;
    personalized_campaigns: boolean;
  }
  
  export interface RawResult {
    goal: string;
    customer_health?: {
      champion: number;
      loyal: number;
      engaged: number;
      at_risk: number;
      dormant: number;
    };
    objective: string;
    audience_size: number;
    cohort_size: number;
    campaign_name: string;
    channels: string[];
    communications_generated: number;
    receipt_events_processed: number;
    delivery_rate: number;
    open_rate: number;
    click_rate: number;
    failure_rate: number;
    recommendations: string[];
    product_affinity?: ProductAffinityEntry[];
    intelligence_assets_loaded: IntelligenceAssetsLoaded;
    stage_status: Record<string, PipelineStageStatus>;
  }
  
  export interface RunCampaignResponse {
    goal: string;
    objective: string;
    campaign_name: string;
    audience_size: number;
    communications_generated: number;
    receipt_events_processed: number;
    status: string;
    insights: CampaignInsights;
    receipts: CampaignReceipt[];
    pipeline: PipelineStatus;
    raw_result: RawResult;
  }
  
  /**
   * A single entry returned by `GET /campaigns/` — the campaign history list.
   */
  export interface CampaignListItem {
    duration_seconds: number;
    id: number;
    goal: string;
    objective: string;
    campaign_name: string;
    status: string;
    audience_size: number;
    started_at: string;
  }
  
  /**
   * Full record returned by `GET /campaigns/{id}/` — the campaign detail view.
   *
   * `insights` and `raw_result` mirror the shapes already defined for
   * `RunCampaignResponse`, but are marked optional here since older or
   * still-processing executions may not carry the full payload.
   */
export interface CampaignDetail {
  id: number;
  goal: string;
  objective: string;
  campaign_name: string;
  status: string;
  audience_size: number;
  communications_generated: number;
  receipt_events_processed: number;
  started_at: string;
  completed_at?: string;
  duration_seconds?: number;
  recommendations: string[];
  pipeline?: PipelineStatus;
  insights?: CampaignInsights;
  raw_result?: RawResult;
}
  
  /**
   * The ordered list of pipeline stages as presented in Mission Control's
   * execution timeline. Keys map to `pipeline` / `raw_result.stage_status`.
   */
export const PIPELINE_STAGES: {
  key: keyof PipelineStatus;
  label: string;
}[] = [
  { key: "Goal Parser", label: "Goal Parser" },
  { key: "Audience Selector", label: "Audience Selector" },
  { key: "Campaign Planner", label: "Campaign Planner" },
  { key: "Communication Manager", label: "Communication Manager" },
  { key: "Channel Service", label: "Channel Service" },
  { key: "Receipt API", label: "Receipt API" },
  { key: "Insights Engine", label: "Insights Engine" },
];