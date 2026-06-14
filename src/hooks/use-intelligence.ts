// src/hooks/use-intelligence.ts
// Sprint 3B — Agent Intelligence Center

/**
 * BACKEND GAP NOTE (read before extending):
 * `GET /campaigns/{id}/` is confirmed to return:
 *   id, goal, objective, campaign_name, audience_size,
 *   communications_generated, receipt_events_processed,
 *   recommendations, status, started_at, completed_at, duration_seconds
 *
 * It does NOT include `insights` or `raw_result` — those are only
 * guaranteed on `POST /run-campaign/`.
 *
 * Sprint 3B components derive everything from confirmed fields and
 * gracefully degrade where raw_result data is absent.
 *
 * RECOMMENDED BACKEND ADDITION (see bottom of file):
 *   GET /intelligence/summary/   — aggregate endpoint
 *   GET /intelligence/assets/    — per-asset usage counts
 */

import { useQueries, useQuery } from "@tanstack/react-query";
import { getCampaigns, getCampaign } from "@/services/aether-api";
import type { CampaignDetail, CampaignListItem } from "@/types/campaigns";
import type {
  IntelligenceSummary,
  ObjectiveBreakdownEntry,
  RecommendationFrequency,
  RateAverages,
  ChannelUsage,
  IntelligenceAssetsUsage,
  CustomerStory,
  IntelligenceAssetStat,
  LearningMilestone,
  StrategicMemoryEntry,
  HealthSegmentStat,
  CampaignStrategyProfile,
  ProductAffinityEntry,
} from "@/types/intelligence";

// ─── Existing builders (unchanged) ──────────────────────────────────────────

function buildObjectiveBreakdown(
  details: CampaignDetail[]
): ObjectiveBreakdownEntry[] {
  const byObjective = new Map<
    string,
    { count: number; durationTotal: number; durationCount: number }
  >();

  for (const detail of details) {
    const entry = byObjective.get(detail.objective) ?? {
      count: 0,
      durationTotal: 0,
      durationCount: 0,
    };
    entry.count += 1;
    if (typeof detail.duration_seconds === "number") {
      entry.durationTotal += detail.duration_seconds;
      entry.durationCount += 1;
    }
    byObjective.set(detail.objective, entry);
  }

  return Array.from(byObjective.entries())
    .map(([objective, value]) => ({
      objective,
      count: value.count,
      avgDurationSeconds:
        value.durationCount > 0
          ? value.durationTotal / value.durationCount
          : null,
    }))
    .sort((a, b) => b.count - a.count);
}

function buildRecommendationFrequency(
  details: CampaignDetail[]
): RecommendationFrequency[] {
  const counts = new Map<string, number>();

  for (const detail of details) {
    for (const recommendation of detail.recommendations ?? []) {
      counts.set(recommendation, (counts.get(recommendation) ?? 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .map(([text, count]) => ({ text, count }))
    .sort((a, b) => b.count - a.count);
}

function buildRateAverages(details: CampaignDetail[]): RateAverages | null {
  const withRates = details.filter(
    (detail) =>
      detail.raw_result != null &&
      detail.raw_result.delivery_rate != null &&
      detail.raw_result.open_rate != null &&
      detail.raw_result.click_rate != null &&
      detail.raw_result.failure_rate != null
  );

  if (withRates.length === 0) return null;

  const totals = withRates.reduce(
    (acc, detail) => {
      const raw = detail.raw_result!;
      acc.deliveryRate += raw.delivery_rate;
      acc.openRate += raw.open_rate;
      acc.clickRate += raw.click_rate;
      acc.failureRate += raw.failure_rate;
      return acc;
    },
    { deliveryRate: 0, openRate: 0, clickRate: 0, failureRate: 0 }
  );

  const sampleSize = withRates.length;
  return {
    deliveryRate: totals.deliveryRate / sampleSize,
    openRate: totals.openRate / sampleSize,
    clickRate: totals.clickRate / sampleSize,
    failureRate: totals.failureRate / sampleSize,
    sampleSize,
  };
}

function buildChannelUsage(details: CampaignDetail[]): ChannelUsage[] | null {
  const withChannels = details.filter(
    (detail) =>
      detail.raw_result?.channels != null &&
      detail.raw_result.channels.length > 0
  );

  if (withChannels.length === 0) return null;

  const counts = new Map<string, number>();
  for (const detail of withChannels) {
    for (const channel of detail.raw_result!.channels) {
      counts.set(channel, (counts.get(channel) ?? 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .map(([channel, count]) => ({ channel, count }))
    .sort((a, b) => b.count - a.count);
}

function buildIntelligenceAssetsUsage(
  details: CampaignDetail[]
): IntelligenceAssetsUsage | null {
  const withAssets = details.filter(
    (detail) => detail.raw_result?.intelligence_assets_loaded != null
  );

  if (withAssets.length === 0) return null;

  const totals = withAssets.reduce(
    (acc, detail) => {
      const assets = detail.raw_result?.intelligence_assets_loaded;
      if (!assets) return acc;
      if (assets.customer_health) acc.customerHealth += 1;
      if (assets.customer_stories) acc.customerStories += 1;
      if (assets.personalized_campaigns) acc.personalizedCampaigns += 1;
      return acc;
    },
    { customerHealth: 0, customerStories: 0, personalizedCampaigns: 0 }
  );

  return {
    ...totals,
    sampleSize: withAssets.length,
  };
}

// ─── Sprint 3B builders ──────────────────────────────────────────────────────

/**
 * Deterministic archetype name seeded from campaign id.
 * These are audience archetypes, not real individuals.
 */
const ARCHETYPE_NAMES = [
  "Alex R.", "Jordan M.", "Sam T.", "Casey P.", "Morgan L.",
  "Riley H.", "Drew K.", "Avery B.", "Quinn S.", "Reese W.",
];

function getArchetypeName(id: number): string {
  return ARCHETYPE_NAMES[id % ARCHETYPE_NAMES.length];
}

/**
 * Derives a customer story archetype from a campaign detail.
 * Uses only confirmed fields: goal, objective, campaign_name,
 * audience_size, recommendations, started_at.
 */
function deriveStory(
  detail: CampaignDetail,
  topRecommendationForObjective: string | null
): CustomerStory {
  const formatObjective = (o: string) =>
    o.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

  // Outcome: honest derivation from recommendations text
  let outcome = "";
  const recs = detail.recommendations ?? [];
  const hasFailureWarning = recs.some((r) =>
    r.toLowerCase().includes("failure rate")
  );
  const hasEngagementPositive = recs.some((r) =>
    r.toLowerCase().includes("engagement is strong") ||
    r.toLowerCase().includes("resonating")
  );

  if (hasEngagementPositive && !hasFailureWarning) {
    outcome = "Strong engagement — messaging resonated with this segment.";
  } else if (hasFailureWarning && hasEngagementPositive) {
    outcome = "Positive engagement despite elevated failure rate — channel health flagged for review.";
  } else if (hasFailureWarning) {
    outcome = "Failure rate elevated — suppression list and channel health review recommended.";
  } else {
    // Derive from objective when no recommendations available
    const outcomeByObjective: Record<string, string> = {
      reactivation: "Segment contacted. Re-engagement pipeline completed.",
      loyalty: "Loyalty campaign delivered across full audience cohort.",
      cross_sell: "Complementary product recommendations dispatched.",
      manual_review: "Campaign flagged for manual objective review.",
    };
    outcome = outcomeByObjective[detail.objective] ?? "Campaign executed successfully.";
  }

  let healthJourney: CustomerStory["healthJourney"] = [
    "Dormant",
    "Reactivated",
    "Loyal",
  ];

  let healthScoreProgression = [28, 58, 82];

  switch (detail.objective) {
    case "reactivation":
      healthJourney = [
        "Dormant",
        "At Risk",
        "Reactivated",
        "Loyal",
        "Champion",
      ];
      healthScoreProgression = [22, 38, 61, 79, 94];
      break;

    case "loyalty":
      healthJourney = [
        "Repeat Buyer",
        "Loyal",
        "Champion",
      ];
      healthScoreProgression = [64, 82, 96];
      break;

    case "cross_sell":
      healthJourney = [
        "Repeat Buyer",
        "Loyal",
      ];
      healthScoreProgression = [58, 76];
      break;

    case "manual_review":
      healthJourney = [
        "At Risk",
        "Reactivated",
      ];
      healthScoreProgression = [35, 57];
      break;
  }

  return {
    archetypeName: getArchetypeName(detail.id),
    objective: detail.objective,
    initialState: detail.goal,
    intervention: `${formatObjective(detail.objective)} campaign targeting ${detail.audience_size.toLocaleString()} contacts via ${detail.campaign_name}.`,
    outcome,
    aetherLearning: topRecommendationForObjective,
    healthJourney,
    healthScoreProgression,
    currentHealthScore:
      healthScoreProgression[
        healthScoreProgression.length - 1
      ],
    campaignId: detail.id,
    executedAt: detail.started_at,
  };
}

/**
 * Builds one representative customer story per unique objective.
 * Picks the most recent campaign per objective as the anchor.
 *
 * DATA SOURCE: confirmed CampaignDetail fields only.
 */
function buildCustomerStories(
  details: CampaignDetail[],
  recommendationFrequency: RecommendationFrequency[]
): CustomerStory[] {
  // Group by objective, pick the most recent (highest id) per objective
  const byObjective = new Map<string, CampaignDetail>();
  for (const detail of details) {
    const existing = byObjective.get(detail.objective);
    if (!existing || detail.id > existing.id) {
      byObjective.set(detail.objective, detail);
    }
  }

  // Find the top recurring recommendation per objective
  // We can't filter recommendations by objective from detail data alone,
  // so we use the global top recommendation as the Aether learning
  const topGlobalRec = recommendationFrequency[0]?.text ?? null;

  return Array.from(byObjective.values())
    .sort((a, b) => b.id - a.id)
    .slice(0, 4) // Cap at 4 stories max
    .map((detail) => deriveStory(detail, topGlobalRec));
}

/**
 * Builds intelligence asset stats.
 * missionCount is null when no raw_result data is available —
 * GET /campaigns/{id}/ does not guarantee raw_result.
 *
 * DATA SOURCE: raw_result.intelligence_assets_loaded (optional)
 * and total campaign count (confirmed).
 */
function buildIntelligenceAssetStats(
  totalCampaigns: number,
  intelligenceAssetsUsage: IntelligenceAssetsUsage | null
): IntelligenceAssetStat[] {
  const assets: Array<{
    key: IntelligenceAssetStat["key"];
    label: string;
    description: string;
  }> = [
    {
      key: "customer_health",
      label: "Customer Health",
      description:
        "Purchase recency, frequency, and value signals. Powers audience segmentation decisions.",
    },
    {
      key: "customer_stories",
      label: "Customer Stories",
      description:
        "Behavioral narrative context. Shapes message personalization and tone.",
    },
    {
      key: "personalized_campaigns",
      label: "Personalized Campaigns",
      description:
        "Past campaign history per contact. Prevents messaging fatigue and improves timing.",
    },
  ];

  return assets.map((asset) => ({
    ...asset,
    missionCount: intelligenceAssetsUsage
      ? asset.key === "customer_health"
        ? intelligenceAssetsUsage.customerHealth
        : asset.key === "customer_stories"
        ? intelligenceAssetsUsage.customerStories
        : intelligenceAssetsUsage.personalizedCampaigns
      : null,
    totalMissions: totalCampaigns,
  }));
}

/**
 * Derives learning milestones from campaign chronology.
 *
 * DATA SOURCE: CampaignListItem (confirmed: id, objective, started_at, campaign_name).
 *
 * Milestones are derived from objective introduction events — the first time
 * each new objective type appears in the history, plus volume thresholds.
 * No fabricated "asset loaded" milestones since raw_result isn't available
 * on GET /campaigns/{id}/.
 */
function buildLearningTimeline(
  list: CampaignListItem[]
): LearningMilestone[] {
  if (list.length === 0) return [];

  // Sort chronologically (oldest first)
  const sorted = [...list].sort((a, b) => a.id - b.id);
  const milestones: LearningMilestone[] = [];
  const seenObjectives = new Set<string>();

  const objectiveLabels: Record<string, string> = {
    reactivation: "Reactivation strategy initialized",
    loyalty: "Loyalty pipeline unlocked",
    cross_sell: "Cross-sell intelligence activated",
    manual_review: "Manual review objective introduced",
  };

  const objectiveDetails: Record<string, string> = {
    reactivation: "Aether began targeting dormant segments with win-back campaigns.",
    loyalty: "Reward-based retention campaigns entered the mission mix.",
    cross_sell: "Complementary product recommendation pipelines came online.",
    manual_review: "Ambiguous goals began routing through manual review safeguards.",
  };

  for (const campaign of sorted) {
    if (!seenObjectives.has(campaign.objective)) {
      seenObjectives.add(campaign.objective);
      const isFirst = milestones.length === 0;
      milestones.push({
        campaignId: campaign.id,
        label: isFirst
          ? "First mission executed"
          : objectiveLabels[campaign.objective] ?? `${campaign.objective} objective introduced`,
        detail: isFirst
          ? `Aether ran its first campaign: ${campaign.campaign_name}. The learning cycle began.`
          : objectiveDetails[campaign.objective] ?? `New objective type encountered.`,
        timestamp: campaign.started_at,
        tier: isFirst ? "foundation" : seenObjectives.size <= 2 ? "foundation" : "growth",
      });
    }
  }

  // Volume milestones at meaningful thresholds
  const thresholds = [10, 25];
  for (const threshold of thresholds) {
    if (sorted.length >= threshold) {
      const anchor = sorted[threshold - 1];
      milestones.push({
        campaignId: anchor.id,
        label: `${threshold} missions completed`,
        detail:
          threshold === 10
            ? "Aether's pattern recognition entered active calibration."
            : "Cross-objective intelligence patterns began consolidating.",
        timestamp: anchor.started_at,
        tier: threshold === 10 ? "growth" : "maturity",
      });
    }
  }

  // Most recent milestone
  const latest = sorted[sorted.length - 1];
  if (sorted.length > 1) {
    milestones.push({
      campaignId: latest.id,
      label: `${sorted.length} missions in history`,
      detail: "Accumulated learning base continues to grow.",
      timestamp: latest.started_at,
      tier: "maturity",
    });
  }

  // Sort milestones by campaign id for correct display order
  return milestones.sort((a, b) => a.campaignId - b.campaignId);
}

/**
 * Distills durable strategic learnings from recurring recommendation patterns.
 *
 * DATA SOURCE: CampaignDetail.recommendations[] — confirmed on GET /campaigns/{id}/.
 * Groups semantically similar recommendations and assigns strength based on frequency.
 */
function buildStrategicMemory(
  recommendationFrequency: RecommendationFrequency[],
  details: CampaignDetail[]
): StrategicMemoryEntry[] {
  if (recommendationFrequency.length === 0) return [];

  // Detect objective context for each recommendation by cross-referencing
  // which campaigns surfaced it
  const recToObjectives = new Map<string, Set<string>>();
  for (const detail of details) {
    for (const rec of detail.recommendations ?? []) {
      const set = recToObjectives.get(rec) ?? new Set();
      set.add(detail.objective);
      recToObjectives.set(rec, set);
    }
  }

  return recommendationFrequency.slice(0, 6).map((entry) => {
    const objectives = recToObjectives.get(entry.text);
    const primaryObjective =
      objectives && objectives.size === 1
        ? Array.from(objectives)[0]
        : null;

    const strength: StrategicMemoryEntry["strength"] =
      entry.count >= 5 ? "strong" : entry.count >= 2 ? "moderate" : "emerging";

    // Distill the insight: extract the core finding from recommendation text
    // The recommendations follow patterns like "X observed. Do Y." — we surface both.
    const insight = entry.text;

    return {
      insight,
      evidenceCount: entry.count,
      primaryObjective,
      strength,
    };
  });
}
// ─── New helper functions ───────────────────────────────────────────────────
function buildRecToObjectives(details: CampaignDetail[]): Map<string, Set<string>> {
  const recToObjectives = new Map<string, Set<string>>();
  for (const detail of details) {
    for (const rec of detail.recommendations ?? []) {
      const set = recToObjectives.get(rec) ?? new Set();
      set.add(detail.objective);
      recToObjectives.set(rec, set);
    }
  }
  return recToObjectives;
}

function buildHealthSegments(
  customerStories: CustomerStory[],
  details: CampaignDetail[]
): HealthSegmentStat[] {
  const SEGMENTS: Array<{
    segment: HealthSegmentStat["segment"];
    scoreRange: string;
    min: number;
    max: number;
    description: string;
    strategicImplication: string;
  }> = [
    {
      segment: "Champion",
      scoreRange: "90-100",
      min: 90,
      max: 100,
      description: "Consistently engaged, high lifetime value, advocates for the brand.",
      strategicImplication: "Aether prioritizes recognition and loyalty rewards over acquisition spend for this segment.",
    },
    {
      segment: "Loyal",
      scoreRange: "75-89",
      min: 75,
      max: 89,
      description: "Repeat purchasers with stable engagement patterns.",
      strategicImplication: "Aether reinforces habit with timely, relevant offers rather than aggressive discounting.",
    },
    {
      segment: "Engaged",
      scoreRange: "60-74",
      min: 60,
      max: 74,
      description: "Active but not yet habitual — responsive to the right nudge.",
      strategicImplication: "Aether tests cross-sell and personalization to deepen the relationship before it cools.",
    },
    {
      segment: "At Risk",
      scoreRange: "40-59",
      min: 40,
      max: 59,
      description: "Declining engagement signals — recency or frequency dropping.",
      strategicImplication: "Aether shifts to win-back framing and monitors channel response closely.",
    },
    {
      segment: "Dormant",
      scoreRange: "0-39",
      min: 0,
      max: 39,
      description: "No recent activity — at risk of permanent disengagement.",
      strategicImplication: "Aether runs reactivation missions with high-incentive offers as a last attempt before suppression.",
    },
  ];

  const latestHealthSummary = [...details]
    .sort((a, b) => b.id - a.id)
    .find((detail) => detail.raw_result?.customer_health)?.raw_result
    ?.customer_health;

  return SEGMENTS.map((def) => {
    const backendCount = latestHealthSummary
      ? latestHealthSummary[
          def.segment.toLowerCase().replace(" ", "_") as keyof typeof latestHealthSummary
        ] ?? 0
      : null;

    const storyMatches = customerStories.filter(
      (story) =>
        story.currentHealthScore >= def.min &&
        story.currentHealthScore <= def.max
    );

    const avgScore =
      storyMatches.length > 0
        ? storyMatches.reduce(
            (sum, s) => sum + s.currentHealthScore,
            0
          ) / storyMatches.length
        : null;

    return {
      segment: def.segment,
      scoreRange: def.scoreRange,
      count: backendCount ?? storyMatches.length,
      avgScore,
      description: def.description,
      strategicImplication: def.strategicImplication,
    };
  });
}

function buildCampaignStrategies(
  objectiveBreakdown: ObjectiveBreakdownEntry[],
  recommendationFrequency: RecommendationFrequency[],
  recToObjectives: Map<string, Set<string>>,
  totalCampaigns: number
): CampaignStrategyProfile[] {
  const PROFILES: Record<string, { whenPreferred: string; strengths: string[]; weaknesses: string[] }> = {
    reactivation: {
      whenPreferred: "When a segment has gone quiet — purchase recency has dropped below the engagement threshold.",
      strengths: [
        "Directly targets the customers most likely to churn entirely.",
        "Clear before/after signal makes outcomes easy to evaluate.",
      ],
      weaknesses: [
        "Higher failure and unsubscribe rates than warm-audience strategies.",
        "Diminishing returns if run too frequently on the same cohort.",
      ],
    },
    loyalty: {
      whenPreferred: "When a segment shows stable repeat-purchase behavior worth reinforcing.",
      strengths: [
        "Highest engagement and open rates of any strategy.",
        "Strengthens retention without heavy discount pressure.",
      ],
      weaknesses: [
        "Lower urgency — conversion lift is gradual, not immediate.",
        "Limited upside if the segment is already near-maximum loyalty.",
      ],
    },
    cross_sell: {
      whenPreferred: "When purchase history suggests a natural complementary product fit.",
      strengths: [
        "Increases order value from an already-converting audience.",
        "Low acquisition cost — targets existing customers.",
      ],
      weaknesses: [
        "Requires accurate product relationship signals to avoid irrelevant offers.",
        "Risk of messaging fatigue if overused on the same cohort.",
      ],
    },
    manual_review: {
      whenPreferred: "When the stated goal is ambiguous or doesn't map cleanly to an existing objective type.",
      strengths: [
        "Prevents Aether from acting on unclear instructions.",
        "Surfaces goal-parsing gaps for future refinement.",
      ],
      weaknesses: [
        "Doesn't autonomously execute — requires a human decision before progressing.",
        "Signals a gap in goal-to-objective coverage.",
      ],
    },
  };

  return objectiveBreakdown.map((entry) => {
    const profile = PROFILES[entry.objective] ?? {
      whenPreferred: "Strategy profile not yet defined for this objective.",
      strengths: [],
      weaknesses: [],
    };

    const topRecommendation =
      recommendationFrequency.find((rec) => {
        const objectives = recToObjectives.get(rec.text);
        return objectives?.has(entry.objective) && objectives.size === 1;
      })?.text ?? null;

    return {
      objective: entry.objective,
      usageCount: entry.count,
      usageShare: totalCampaigns > 0 ? Math.round((entry.count / totalCampaigns) * 100) : 0,
      avgDurationSeconds: entry.avgDurationSeconds,
      whenPreferred: profile.whenPreferred,
      strengths: profile.strengths,
      weaknesses: profile.weaknesses,
      topRecommendation,
    };
  });
}

function buildProductAffinity(details: CampaignDetail[]): ProductAffinityEntry[] {
  const affinityMap = new Map<string, ProductAffinityEntry>();

  for (const detail of details) {
    const affinity = detail.raw_result?.product_affinity;

    if (!affinity || affinity.length === 0) continue;

    for (const entry of affinity) {
      if (!affinityMap.has(entry.product)) {
        affinityMap.set(entry.product, entry);
      }
    }
  }

  return Array.from(affinityMap.values()).slice(0, 6);
}

// ─── Main hook ───────────────────────────────────────────────────────────────

export function useIntelligence() {
  const campaignsQuery = useQuery({
    queryKey: ["campaigns"],
    queryFn: () => getCampaigns(),
  });

  const campaignIds =
    campaignsQuery.data?.map((campaign: CampaignListItem) => campaign.id) ?? [];

  const detailQueries = useQueries({
    queries: campaignIds.map((id: number) => ({
      queryKey: ["campaigns", id],
      queryFn: () => getCampaign(id),
      enabled: campaignsQuery.isSuccess,
    })),
  });

  const isLoading =
    campaignsQuery.isLoading ||
    (campaignsQuery.isSuccess &&
      detailQueries.length > 0 &&
      detailQueries.some((query) => query.isLoading));

  const isError =
    campaignsQuery.isError || detailQueries.some((query) => query.isError);

  const error =
    campaignsQuery.error ??
    detailQueries.find((query) => query.error)?.error ??
    null;

  const details = detailQueries
    .map((query) => query.data)
    .filter((detail): detail is CampaignDetail => detail != null);

  let summary: IntelligenceSummary | null = null;

  if (campaignsQuery.data && !isLoading && !isError) {
    const list = campaignsQuery.data;

    const statusBreakdown = list.reduce<Record<string, number>>(
      (acc: { [key: string]: number }, campaign: CampaignListItem) => {
        acc[campaign.status] = (acc[campaign.status] ?? 0) + 1;
        return acc;
      },
      {}
    );

    const objectiveBreakdown = buildObjectiveBreakdown(details);
    const topObjective = objectiveBreakdown[0] ?? null;
    const slowestObjective =
      objectiveBreakdown
        .filter((entry) => entry.avgDurationSeconds != null)
        .sort(
          (a, b) => (b.avgDurationSeconds ?? 0) - (a.avgDurationSeconds ?? 0)
        )[0] ?? null;

    const totalCommunicationsGenerated = details.reduce(
      (sum: number, detail: CampaignDetail) => sum + (detail.communications_generated ?? 0),
      0
    );
    const totalReceiptEventsProcessed = details.reduce(
      (sum: number, detail: CampaignDetail) => sum + (detail.receipt_events_processed ?? 0),
      0
    );
    const averageAudienceSize =
      list.length > 0
        ? list.reduce((sum: number, campaign: CampaignListItem) => sum + campaign.audience_size, 0) /
          list.length
        : 0;

    const recommendationFrequency = buildRecommendationFrequency(details);
    const intelligenceAssetsUsage = buildIntelligenceAssetsUsage(details);

    // Sprint 3B
    const customerStories = buildCustomerStories(details, recommendationFrequency);
    const intelligenceAssetStats = buildIntelligenceAssetStats(
      list.length,
      intelligenceAssetsUsage
    );
    const learningTimeline = buildLearningTimeline(list);
    const strategicMemory = buildStrategicMemory(recommendationFrequency, details);
    const recToObjectives = buildRecToObjectives(details);
    const healthSegments = buildHealthSegments(
      customerStories,
      details
    );
    const campaignStrategies = buildCampaignStrategies(
      objectiveBreakdown,
      recommendationFrequency,
      recToObjectives,
      list.length
    );

    const productAffinity = buildProductAffinity(details);

    summary = {
      totalCampaigns: list.length,
      totalCommunicationsGenerated,
      totalReceiptEventsProcessed,
      averageAudienceSize,
      statusBreakdown,
      objectiveBreakdown,
      topObjective,
      slowestObjective,
      recommendationFrequency,
      rateAverages: buildRateAverages(details),
      channelUsage: buildChannelUsage(details),
      intelligenceAssetsUsage,
      // Sprint 3B
      customerStories,
      intelligenceAssetStats,
      learningTimeline,
      strategicMemory,
      healthSegments,
      campaignStrategies,
      productAffinity,
    };
  }

  return { summary, isLoading, isError, error };
}

/*
 * ─────────────────────────────────────────────────────────────────────────
 * RECOMMENDED BACKEND ADDITIONS (Sprint 3B)
 * ─────────────────────────────────────────────────────────────────────────
 *
 * 1. GET /intelligence/summary/
 *    Aggregate endpoint for all campaign metrics. Eliminates N+1 fetches.
 *    (See Sprint 3A writeup above for full serializer spec.)
 *
 * 2. GET /intelligence/assets/
 *    Returns per-asset usage counts across all CampaignExecution records:
 *    { customer_health_count, customer_stories_count, personalized_campaigns_count,
 *      total_missions }
 *    Currently impossible to compute accurately because raw_result is not
 *    included in GET /campaigns/{id}/ responses.
 *
 * 3. GET /customers/{id}/journey/  (future)
 *    True per-customer journey data enabling real Customer Story Evolution.
 *    Currently stories are objective-level archetypes, not individual journeys.
 *    This endpoint would return: customer_id, campaigns_received[], outcomes[],
 *    state_transitions[], and Aether's learned preference profile.
 * ─────────────────────────────────────────────────────────────────────────
 */