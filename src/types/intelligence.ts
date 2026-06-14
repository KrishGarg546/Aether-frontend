// src/types/intelligence.ts
// Sprint 3B — Agent Intelligence Center
// Generated strictly from confirmed backendContracts.md fields.

import type { CampaignListItem, CampaignDetail } from "@/types/campaigns";

// ─── Existing types (unchanged) ────────────────────────────────────────────

export interface ObjectiveBreakdownEntry {
  objective: string;
  count: number;
  /** Average execution duration in seconds, if available. */
  avgDurationSeconds: number | null;
}

export interface RecommendationFrequency {
  text: string;
  count: number;
}

export interface RateAverages {
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  failureRate: number;
  /** Number of campaigns whose raw_result contributed to these averages. */
  sampleSize: number;
}

export interface ChannelUsage {
  channel: string;
  count: number;
}

export interface IntelligenceAssetsUsage {
  customerHealth: number;
  customerStories: number;
  personalizedCampaigns: number;
  /** Number of campaigns whose raw_result contributed to these counts. */
  sampleSize: number;
}

// ─── Sprint 3B: Customer Story Evolution ──────────────────────────────────

/**
 * A synthesized customer story derived from campaign history patterns.
 *
 * DATA SOURCE: Derived from CampaignDetail.recommendations text analysis
 * and campaign chronology (confirmed fields: goal, objective, recommendations,
 * started_at, duration_seconds). Customer names are generated deterministically
 * from campaign id — no fake backend data.
 *
 * HONEST CONSTRAINT: True per-customer journey tracking requires a
 * customer-level ledger endpoint (e.g. GET /customers/{id}/journey/).
 * These stories are pattern-derived archetypes from aggregate campaign data,
 * clearly labeled as such in the UI.
 */
export interface CustomerStory {
  /**
   * Deterministic persona name seeded from campaign id.
   * Labeled in UI as "Audience Archetype" — not a real individual.
   */
  archetypeName: string;
  /** The campaign objective this story represents. */
  objective: string;
  /** Campaign goal text — the marketer's stated intent. */
  initialState: string;
  /** What Aether did: campaign type + audience size. */
  intervention: string;
  /**
   * Outcome derived from recommendations text.
   * If recommendations mention engagement/failure, reflect that honestly.
   * If no recommendations available, derives from objective.
   */
  outcome: string;
  /**
   * Aether's learning: the most recurring recommendation for this objective.
   * Null if no recommendations are available for this objective.
   */
  aetherLearning: string | null;
  /**
   * Synthesized health journey derived from customer story patterns.
   * This represents an archetypal evolution rather than a real individual.
   */
  healthJourney: (
    | "Dormant"
    | "At Risk"
    | "Reactivated"
    | "Repeat Buyer"
    | "Loyal"
    | "Champion"
  )[];

  /**
   * Illustrative health score progression aligned with the journey stages.
   * Values should trend upward as Aether interventions succeed.
   */
  healthScoreProgression: number[];

  /** Current synthesized health score for this archetype. */
  currentHealthScore: number;

  /** campaign id this story is anchored to. */
  campaignId: number;
  /** ISO timestamp of campaign execution. */
  executedAt: string;
}

// ─── Sprint 3B: Intelligence Asset Impact ─────────────────────────────────

/**
 * Describes how many campaigns used each intelligence asset.
 *
 * DATA SOURCE: raw_result.intelligence_assets_loaded — only available
 * on POST /run-campaign/ responses. GET /campaigns/{id}/ does NOT include
 * raw_result per confirmed backend contract. Therefore missionCount will
 * be null unless the app session includes run-campaign responses cached
 * client-side.
 *
 * RECOMMENDED BACKEND ADDITION: GET /intelligence/assets/ returning
 * aggregate counts per asset type across all CampaignExecution records.
 */
export interface IntelligenceAssetStat {
  key: "customer_health" | "customer_stories" | "personalized_campaigns";
  label: string;
  description: string;
  /**
   * Count of campaigns that loaded this asset.
   * Null when raw_result data isn't available from detail endpoints.
   */
  missionCount: number | null;
  totalMissions: number;
}

// ─── Sprint 3B: Learning Timeline ─────────────────────────────────────────

/**
 * A milestone event in Aether's learning trajectory.
 *
 * DATA SOURCE: Derived from confirmed campaign history chronology.
 * campaign list id, started_at, objective, campaign_name are all confirmed.
 * Milestone labels are derived from objective distribution patterns.
 *
 * HONEST CONSTRAINT: "First use of intelligence assets" milestones
 * would require raw_result from GET /campaigns/{id}/, which is not
 * currently guaranteed. These milestones are therefore derived from
 * objective introduction patterns in the confirmed campaign list.
 */
export interface LearningMilestone {
  /** Campaign id this milestone is anchored to. */
  campaignId: number;
  /** Human-readable milestone label. */
  label: string;
  /** Supplementary detail. */
  detail: string;
  /** ISO timestamp from started_at. */
  timestamp: string;
  /** Visual tier: "foundation" | "growth" | "maturity" */
  tier: "foundation" | "growth" | "maturity";
}

// ─── Sprint 3B: Strategic Memory ──────────────────────────────────────────

/**
 * A durable learning distilled from recurring recommendation patterns.
 *
 * DATA SOURCE: CampaignDetail.recommendations[] — confirmed available
 * on GET /campaigns/{id}/. Grouped and counted across all campaign history.
 */
export interface StrategicMemoryEntry {
  /** The core insight, distilled from recommendation text. */
  insight: string;
  /** How many campaigns surfaced this pattern. */
  evidenceCount: number;
  /** Which objective type this insight most applies to. */
  primaryObjective: string | null;
  /** Relative weight: "strong" ≥5, "moderate" ≥2, "emerging" ≥1 */
  strength: "strong" | "moderate" | "emerging";
}

// ─── Master IntelligenceSummary ────────────────────────────────────────────

export interface IntelligenceSummary {
  // ── Confirmed from GET /campaigns/ ─────────────────────────────────────
  totalCampaigns: number;
  averageAudienceSize: number;
  statusBreakdown: Record<string, number>;
  objectiveBreakdown: ObjectiveBreakdownEntry[];
  topObjective: ObjectiveBreakdownEntry | null;
  slowestObjective: ObjectiveBreakdownEntry | null;

  // ── Confirmed from GET /campaigns/{id}/ ────────────────────────────────
  totalCommunicationsGenerated: number;
  totalReceiptEventsProcessed: number;
  recommendationFrequency: RecommendationFrequency[];

  // ── Optional: only if raw_result present on detail responses ───────────
  /** Present only if at least one campaign detail included raw_result rates. */
  rateAverages: RateAverages | null;
  /** Present only if at least one campaign detail included raw_result.channels. */
  channelUsage: ChannelUsage[] | null;
  /** Present only if at least one campaign detail included raw_result.intelligence_assets_loaded. */
  intelligenceAssetsUsage: IntelligenceAssetsUsage | null;

  // ── Sprint 3B additions ─────────────────────────────────────────────────
  healthSegments: HealthSegmentStat[];

campaignStrategies: CampaignStrategyProfile[];
  /** Real product co-purchase intelligence derived from backend affinity generation. */
  productAffinity: ProductAffinityEntry[];
  /** Synthesized per-objective archetypes from confirmed campaign data. */
  customerStories: CustomerStory[];
  /** Intelligence asset usage stats — count may be null without raw_result. */
  intelligenceAssetStats: IntelligenceAssetStat[];
  /** Chronological milestones of Aether's learning trajectory. */
  learningTimeline: LearningMilestone[];
  /** Distilled durable learnings from recommendation patterns. */
  strategicMemory: StrategicMemoryEntry[];
}

export interface HealthSegmentStat {
    segment: "Champion" | "Loyal" | "Engaged" | "At Risk" | "Dormant";
  
    scoreRange: string;
  
    count: number;
  
    avgScore: number | null;
  
    description: string;
  
    strategicImplication: string;
  }
  
  export interface CampaignStrategyProfile {
    objective: string;
  
    usageCount: number;
  
    usageShare: number;
  
    avgDurationSeconds: number | null;
  
    whenPreferred: string;
  
    strengths: string[];
  
    weaknesses: string[];
  
    topRecommendation: string | null;
  }

export interface ProductAffinityRecommendation {
  product_id: string;
  product_name: string;
  co_purchase_count: number;
}

export interface ProductAffinityEntry {
  product: string;
  related_products: {
    product_name: string;
    recommendations: ProductAffinityRecommendation[];
  };
}

export interface RawIntelligenceInputs {
  list: CampaignListItem[];
  details: CampaignDetail[];
}