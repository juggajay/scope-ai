// =============================================================================
// Trade Determination Logic — Convex-compatible copy of lib/trades.ts
// =============================================================================
// Types inlined to avoid importing from lib/ or types/

export type TradeType =
  | "demolition"
  | "structural"
  | "plumbing"
  | "electrical"
  | "waterproofing"
  | "carpentry"
  | "tiling"
  | "stone"
  | "painting";

export type ProjectType = "kitchen" | "bathroom" | "laundry" | "living" | "outdoor";

export type QualityTier = "budget" | "midrange" | "premium" | "luxury";

export type QuestionAnswers = Record<string, string | string[]>;

export const TRADE_META: Record<TradeType, { title: string; icon: string; sortOrder: number }> = {
  demolition:     { title: "Demolition & Strip-Out",  icon: "\u{1F528}", sortOrder: 1 },
  structural:     { title: "Structural",              icon: "\u{1F3D7}\uFE0F", sortOrder: 2 },
  plumbing:       { title: "Plumbing",                icon: "\u{1F527}", sortOrder: 3 },
  electrical:     { title: "Electrical",              icon: "\u26A1",    sortOrder: 4 },
  waterproofing:  { title: "Waterproofing",           icon: "\u{1F4A7}", sortOrder: 5 },
  carpentry:      { title: "Carpentry & Joinery",     icon: "\u{1FA9A}", sortOrder: 6 },
  tiling:         { title: "Tiling",                  icon: "\u{1F532}", sortOrder: 7 },
  stone:          { title: "Stone Benchtop",          icon: "\u{1FAA8}", sortOrder: 8 },
  painting:       { title: "Painting",                icon: "\u{1F3A8}", sortOrder: 9 },
};

const BASE_TRADES: Record<ProjectType, TradeType[]> = {
  kitchen: ["demolition", "plumbing", "electrical", "carpentry", "tiling", "stone", "painting"],
  bathroom: ["demolition", "plumbing", "electrical", "waterproofing", "carpentry", "tiling", "painting"],
  laundry: ["demolition", "plumbing", "electrical", "waterproofing", "carpentry", "tiling", "painting"],
  living: ["demolition", "electrical", "carpentry", "painting"],
  outdoor: ["demolition", "electrical", "carpentry", "painting"],
};

interface ConditionalTradeRule {
  trade: TradeType;
  projectTypes: ProjectType[];
  condition: (answers: QuestionAnswers) => boolean;
  reason: string;
}

const CONDITIONAL_RULES: ConditionalTradeRule[] = [
  {
    trade: "structural",
    projectTypes: ["kitchen", "living"],
    condition: (answers) => {
      const wallAnswer = answers["wall_removal"];
      if (typeof wallAnswer === "string") {
        const lower = wallAnswer.toLowerCase();
        return !lower.includes("no walls") && !lower.includes("non-load-bearing") && lower !== "";
      }
      return false;
    },
    reason: "Wall removal indicated — structural assessment required",
  },
  {
    trade: "tiling",
    projectTypes: ["living"],
    condition: (answers) => {
      const flooringAnswer = answers["flooring_type"];
      if (typeof flooringAnswer === "string") {
        return flooringAnswer.toLowerCase().includes("tile") || flooringAnswer.toLowerCase().includes("porcelain");
      }
      return false;
    },
    reason: "Tile flooring selected for living area",
  },
  {
    trade: "tiling",
    projectTypes: ["outdoor"],
    condition: (answers) => {
      const outdoorType = answers["outdoor_type"];
      if (typeof outdoorType === "string" && outdoorType.toLowerCase().includes("patio")) return true;
      const deckingMaterial = answers["decking_material"];
      if (typeof deckingMaterial === "string" && deckingMaterial.toLowerCase().includes("concrete")) return true;
      return false;
    },
    reason: "Patio or concrete outdoor area — tiling likely required",
  },
  {
    trade: "plumbing",
    projectTypes: ["outdoor"],
    condition: (answers) => {
      const features = answers["outdoor_features"];
      if (typeof features === "string") {
        return features.toLowerCase().includes("kitchen") || features.toLowerCase().includes("sink") || features.toLowerCase().includes("shower") || features.toLowerCase().includes("bbq");
      }
      if (Array.isArray(features)) {
        return features.some((f) => f.toLowerCase().includes("kitchen") || f.toLowerCase().includes("sink") || f.toLowerCase().includes("shower") || f.toLowerCase().includes("bbq"));
      }
      return false;
    },
    reason: "Outdoor plumbing required (kitchen/sink/shower/BBQ)",
  },
  {
    trade: "plumbing",
    projectTypes: ["living"],
    condition: (answers) => {
      const features = answers["living_features"];
      if (typeof features === "string") {
        return features.toLowerCase().includes("wet bar") || features.toLowerCase().includes("kitchenette");
      }
      if (Array.isArray(features)) {
        return features.some((f) => f.toLowerCase().includes("wet bar") || f.toLowerCase().includes("kitchenette"));
      }
      return false;
    },
    reason: "Wet bar or kitchenette in living area requires plumbing",
  },
];

interface ExclusionRule {
  trade: TradeType;
  projectTypes: ProjectType[];
  condition: (answers: QuestionAnswers) => boolean;
  reason: string;
}

const EXCLUSION_RULES: ExclusionRule[] = [
  {
    trade: "stone",
    projectTypes: ["kitchen"],
    condition: (answers) => {
      const benchtopAnswer = answers["benchtop_material"];
      if (typeof benchtopAnswer === "string") {
        return benchtopAnswer.toLowerCase().includes("laminate") || benchtopAnswer.toLowerCase().includes("timber");
      }
      return false;
    },
    reason: "Laminate/timber benchtop selected — stone mason not required",
  },
];

export interface TradeSelection {
  trades: TradeType[];
  reasons: { trade: TradeType; reason: string }[];
}

export function determineRequiredTrades(
  projectType: ProjectType,
  answers: QuestionAnswers
): TradeSelection {
  const trades = new Set<TradeType>(BASE_TRADES[projectType]);
  const reasons: { trade: TradeType; reason: string }[] = [];

  for (const rule of CONDITIONAL_RULES) {
    if (rule.projectTypes.includes(projectType) && rule.condition(answers)) {
      if (!trades.has(rule.trade)) {
        trades.add(rule.trade);
        reasons.push({ trade: rule.trade, reason: rule.reason });
      }
    }
  }

  for (const rule of EXCLUSION_RULES) {
    if (rule.projectTypes.includes(projectType) && rule.condition(answers)) {
      if (trades.has(rule.trade)) {
        trades.delete(rule.trade);
        reasons.push({ trade: rule.trade, reason: `EXCLUDED: ${rule.reason}` });
      }
    }
  }

  const sorted = Array.from(trades).sort(
    (a, b) => TRADE_META[a].sortOrder - TRADE_META[b].sortOrder
  );

  return { trades: sorted, reasons };
}

/**
 * Map quality_tier answer display string to QualityTier type.
 */
export function parseQualityTier(answer: string | string[] | undefined): QualityTier {
  if (!answer) return "midrange";
  const str = (typeof answer === "string" ? answer : answer[0] || "").toLowerCase();
  if (str.includes("budget") || str.includes("entry")) return "budget";
  if (str.includes("premium") || str.includes("high")) return "premium";
  if (str.includes("luxury") || str.includes("top")) return "luxury";
  return "midrange";
}
