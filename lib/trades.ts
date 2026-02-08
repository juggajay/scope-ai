// =============================================================================
// Trade Determination Logic
// =============================================================================
// Given a project type + user answers, determine which trades are required.
// This drives how many scopes get generated.
// =============================================================================

import type { TradeType, ProjectType, QuestionAnswers } from "@/types";

// -----------------------------------------------------------------------------
// Trade metadata (display info)
// -----------------------------------------------------------------------------

export const TRADE_META: Record<TradeType, { title: string; icon: string; sortOrder: number }> = {
  demolition:     { title: "Demolition & Strip-Out",  icon: "🔨", sortOrder: 1 },
  structural:     { title: "Structural",              icon: "🏗️", sortOrder: 2 },
  plumbing:       { title: "Plumbing",                icon: "🔧", sortOrder: 3 },
  electrical:     { title: "Electrical",              icon: "⚡", sortOrder: 4 },
  waterproofing:  { title: "Waterproofing",           icon: "💧", sortOrder: 5 },
  carpentry:      { title: "Carpentry & Joinery",     icon: "🪚", sortOrder: 6 },
  tiling:         { title: "Tiling",                  icon: "🔲", sortOrder: 7 },
  stone:          { title: "Stone Benchtop",          icon: "🪨", sortOrder: 8 },
  painting:       { title: "Painting",                icon: "🎨", sortOrder: 9 },
};

// -----------------------------------------------------------------------------
// Base trades per project type (always included unless explicitly excluded)
// -----------------------------------------------------------------------------

const BASE_TRADES: Record<ProjectType, TradeType[]> = {
  kitchen: [
    "demolition",
    "plumbing",
    "electrical",
    "carpentry",
    "tiling",
    "stone",
    "painting",
  ],
  bathroom: [
    "demolition",
    "plumbing",
    "electrical",
    "waterproofing",
    "carpentry",
    "tiling",
    "painting",
  ],
  laundry: [
    "demolition",
    "plumbing",
    "electrical",
    "waterproofing",
    "carpentry",
    "tiling",
    "painting",
  ],
  living: [
    "demolition",
    "electrical",
    "carpentry",
    "painting",
  ],
  outdoor: [
    "demolition",
    "electrical",
    "carpentry",
    "painting",
  ],
};

// -----------------------------------------------------------------------------
// Conditional trade rules (added based on user answers)
// -----------------------------------------------------------------------------

interface ConditionalTradeRule {
  trade: TradeType;
  projectTypes: ProjectType[]; // applies to these project types
  condition: (answers: QuestionAnswers) => boolean;
  reason: string; // why this trade was added (for debugging/logging)
}

const CONDITIONAL_RULES: ConditionalTradeRule[] = [
  // STRUCTURAL — add if wall removal that might be load-bearing
  {
    trade: "structural",
    projectTypes: ["kitchen", "living"],
    condition: (answers) => {
      const wallAnswer = answers["wall_removal"];
      if (typeof wallAnswer === "string") {
        const lower = wallAnswer.toLowerCase();
        // Include structural for any wall work EXCEPT explicitly non-load-bearing or no work
        return !lower.includes("no walls") &&
               !lower.includes("non-load-bearing") &&
               lower !== "";
      }
      return false;
    },
    reason: "Wall removal indicated — structural assessment required",
  },

  // STONE BENCHTOP — remove from kitchen if benchtop is laminate or timber
  // (handled as exclusion rather than addition — see excludeStone below)

  // TILING — add to living if flooring answer includes tiles
  {
    trade: "tiling",
    projectTypes: ["living"],
    condition: (answers) => {
      const flooringAnswer = answers["flooring_type"];
      if (typeof flooringAnswer === "string") {
        return flooringAnswer.toLowerCase().includes("tile") ||
               flooringAnswer.toLowerCase().includes("porcelain");
      }
      return false;
    },
    reason: "Tile flooring selected for living area",
  },

  // TILING — add to outdoor if patio/concrete type or concrete decking material
  {
    trade: "tiling",
    projectTypes: ["outdoor"],
    condition: (answers) => {
      const outdoorType = answers["outdoor_type"];
      if (typeof outdoorType === "string" && outdoorType.toLowerCase().includes("patio")) {
        return true;
      }
      const deckingMaterial = answers["decking_material"];
      if (typeof deckingMaterial === "string" && deckingMaterial.toLowerCase().includes("concrete")) {
        return true;
      }
      return false;
    },
    reason: "Patio or concrete outdoor area — tiling likely required",
  },

  // PLUMBING — add to outdoor if outdoor kitchen or outdoor shower
  {
    trade: "plumbing",
    projectTypes: ["outdoor"],
    condition: (answers) => {
      const features = answers["outdoor_features"];
      if (typeof features === "string") {
        return features.toLowerCase().includes("kitchen") ||
               features.toLowerCase().includes("sink") ||
               features.toLowerCase().includes("shower") ||
               features.toLowerCase().includes("bbq");
      }
      if (Array.isArray(features)) {
        return features.some(f =>
          f.toLowerCase().includes("kitchen") ||
          f.toLowerCase().includes("sink") ||
          f.toLowerCase().includes("shower") ||
          f.toLowerCase().includes("bbq")
        );
      }
      return false;
    },
    reason: "Outdoor plumbing required (kitchen/sink/shower/BBQ)",
  },

  // PLUMBING — add to living if wet bar or kitchenette
  {
    trade: "plumbing",
    projectTypes: ["living"],
    condition: (answers) => {
      const features = answers["living_features"];
      if (typeof features === "string") {
        return features.toLowerCase().includes("wet bar") ||
               features.toLowerCase().includes("kitchenette");
      }
      if (Array.isArray(features)) {
        return features.some(f =>
          f.toLowerCase().includes("wet bar") || f.toLowerCase().includes("kitchenette")
        );
      }
      return false;
    },
    reason: "Wet bar or kitchenette in living area requires plumbing",
  },
];

// -----------------------------------------------------------------------------
// Exclusion rules (remove a base trade based on answers)
// -----------------------------------------------------------------------------

interface ExclusionRule {
  trade: TradeType;
  projectTypes: ProjectType[];
  condition: (answers: QuestionAnswers) => boolean;
  reason: string;
}

const EXCLUSION_RULES: ExclusionRule[] = [
  // Remove stone benchtop if user selects laminate or timber benchtop
  {
    trade: "stone",
    projectTypes: ["kitchen"],
    condition: (answers) => {
      const benchtopAnswer = answers["benchtop_material"];
      if (typeof benchtopAnswer === "string") {
        return benchtopAnswer.toLowerCase().includes("laminate") ||
               benchtopAnswer.toLowerCase().includes("timber");
      }
      return false;
    },
    reason: "Laminate/timber benchtop selected — stone mason not required",
  },

  // Remove waterproofing from laundry if no floor waste / no tiling
  // Actually, waterproofing is code-required for laundry in most states.
  // Don't add this exclusion — keep waterproofing for laundry always.
];

// -----------------------------------------------------------------------------
// Main function: determine required trades
// -----------------------------------------------------------------------------

export interface TradeSelection {
  trades: TradeType[];
  reasons: { trade: TradeType; reason: string }[]; // why each conditional trade was added/removed
}

export function determineRequiredTrades(
  projectType: ProjectType,
  answers: QuestionAnswers
): TradeSelection {
  // Start with base trades for this project type
  const trades = new Set<TradeType>(BASE_TRADES[projectType]);
  const reasons: { trade: TradeType; reason: string }[] = [];

  // Apply conditional additions
  for (const rule of CONDITIONAL_RULES) {
    if (rule.projectTypes.includes(projectType) && rule.condition(answers)) {
      if (!trades.has(rule.trade)) {
        trades.add(rule.trade);
        reasons.push({ trade: rule.trade, reason: rule.reason });
      }
    }
  }

  // Apply exclusions
  for (const rule of EXCLUSION_RULES) {
    if (rule.projectTypes.includes(projectType) && rule.condition(answers)) {
      if (trades.has(rule.trade)) {
        trades.delete(rule.trade);
        reasons.push({ trade: rule.trade, reason: `EXCLUDED: ${rule.reason}` });
      }
    }
  }

  // Sort by defined order
  const sorted = Array.from(trades).sort(
    (a, b) => TRADE_META[a].sortOrder - TRADE_META[b].sortOrder
  );

  return { trades: sorted, reasons };
}

// -----------------------------------------------------------------------------
// Helper: get trade display info
// -----------------------------------------------------------------------------

export function getTradeInfo(tradeType: TradeType) {
  return TRADE_META[tradeType];
}
