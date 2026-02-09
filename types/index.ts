// =============================================================================
// ScopeAI — Core Type Definitions
// =============================================================================
// These types define the contract between the AI output, database, and frontend.
// Any change here affects prompt templates, validation, and UI rendering.
// =============================================================================

// -----------------------------------------------------------------------------
// Project Types
// -----------------------------------------------------------------------------

export type ProjectType = "kitchen" | "bathroom" | "laundry" | "living" | "outdoor";

export type ProjectMode = "trades" | "builder";

export type PropertyType = "house" | "townhouse" | "apartment" | "heritage";

export type AustralianState = "NSW" | "VIC" | "QLD" | "SA" | "WA" | "TAS" | "ACT" | "NT";

export type QualityTier = "budget" | "midrange" | "premium" | "luxury";

export type ProjectStatus = "draft" | "generating" | "generated" | "paid";

export type PhotoAnalysisStatus = "pending" | "running" | "complete" | "failed";

// -----------------------------------------------------------------------------
// Trade Types
// -----------------------------------------------------------------------------

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

// -----------------------------------------------------------------------------
// Property Details (user input)
// -----------------------------------------------------------------------------

export interface PropertyDetails {
  suburb: string;
  state: AustralianState;
  type: PropertyType;
  yearBuilt?: number; // approximate
}

// -----------------------------------------------------------------------------
// Question System
// -----------------------------------------------------------------------------

export interface QuestionOption {
  label: string;
  description?: string; // tooltip / why this matters
  imageUrl?: string; // optional visual (V2)
}

export interface Question {
  id: string;
  question: string; // the question text shown to user
  why?: string; // "Why we ask this" tooltip
  options: QuestionOption[];
  multiSelect: boolean;
  defaultIfSkipped?: string; // sensible default if user skips
  conditionalOn?: { // only show this question if... (V2 — wizard will filter)
    questionId: string;
    answerIncludes: string[]; // show if answer matches any of these
  };
  modeOnly?: ProjectMode; // only show in this mode (null = both)
}

export interface QuestionSet {
  projectType: ProjectType;
  questions: Question[];
}

export interface QuestionAnswers {
  [questionId: string]: string | string[]; // single or multi-select
}

// -----------------------------------------------------------------------------
// Photo Analysis (AI output — Stage 1)
// -----------------------------------------------------------------------------

export interface PhotoAnalysis {
  roomType: string;
  approximateSize: "small" | "medium" | "large";
  existingFixtures: {
    type: string; // "cooktop", "oven", "sink", "toilet", "shower", etc.
    fuel?: string; // "gas", "electric", "induction"
    style?: string; // "freestanding", "built-in", "wall-hung"
    condition: "good" | "fair" | "poor" | "unknown";
  }[];
  existingMaterials: {
    benchtop?: string;
    flooring?: string;
    splashback?: string;
    cabinets?: string;
    walls?: string;
    ceiling?: string;
  };
  visibleServices: {
    powerPoints?: { count: number; locations: string };
    plumbing?: { sinkLocation: string; visiblePipes: boolean };
    gas?: { visibleConnection: boolean };
    ventilation?: { type: string }; // "rangehood", "exhaust fan", "window only", etc.
  };
  structuralObservations: {
    potentialLoadBearingWalls: boolean;
    windowLocations?: string;
    ceilingType?: string;
  };
  conditionFlags: string[]; // ["water_damage", "outdated_electrical", "asbestos_era_materials"]
  estimatedAge: "pre-1960" | "1960-1990" | "1990-2010" | "post-2010" | "unknown";
  summary: string; // plain-language summary for context injection
}

// -----------------------------------------------------------------------------
// Scope Item (AI output — Stage 2, per-trade)
// -----------------------------------------------------------------------------

export interface ScopeItem {
  id: string; // unique within scope, e.g. "elec-001"
  category: string; // grouping within trade, e.g. "circuits", "lighting", "power"
  item: string; // what it is, e.g. "New dedicated circuit for wall oven"
  specification: string; // technical detail, e.g. "32A circuit, 6mm² cable, isolator at appliance"
  included: boolean; // default true — user can toggle off
  complianceNote?: string; // e.g. "Per AS/NZS 3000"
  note?: string; // additional context
  isCustom?: boolean; // true for user-added items — shows badge, enables delete
  isEdited?: boolean; // true when user modified item/spec text
}

// -----------------------------------------------------------------------------
// Provisional Cost Sum (PC Sum)
// -----------------------------------------------------------------------------

export interface PCSum {
  item: string; // e.g. "Splashback tiles"
  unit: string; // e.g. "per m²"
  quantity?: string; // e.g. "4.5m²"
  rangeLow: string; // e.g. "$80"
  rangeHigh: string; // e.g. "$150"
  budgetLow: string; // quantity × rangeLow, e.g. "$360"
  budgetHigh: string; // quantity × rangeHigh, e.g. "$675"
}

// -----------------------------------------------------------------------------
// Trade Scope (AI output — one per trade)
// -----------------------------------------------------------------------------

export interface TradeScope {
  tradeType: TradeType;
  title: string; // e.g. "Electrical Scope of Works"
  icon: string; // emoji for UI

  // Core content
  items: ScopeItem[];
  exclusions: string[];
  pcSums?: PCSum[];

  // Compliance and notes
  complianceNotes?: string; // standards references, certification requirements
  warnings?: string[]; // red flags, things to watch out for
  notes?: string; // general notes
  diyOption?: string; // DIY alternative description (Trade Manager mode)

  // Metadata
  sortOrder: number; // display order in tabs
  itemCount: number; // total items (for preview summary)
}

// -----------------------------------------------------------------------------
// Sequencing Plan Phase
// -----------------------------------------------------------------------------

export interface SequencingPhase {
  phase: string; // "1", "2", "3a", "3b" etc.
  trade: string; // display name
  tradeType?: TradeType; // links to scope
  duration: string; // "3-5 days"
  dependencies: string; // what must be done first
  notes?: string; // project-specific notes (AI-generated)
  isParallel?: boolean; // can run at same time as adjacent phase
  isHoldPoint?: boolean; // inspection required before proceeding
  color?: string; // UI colour for timeline
}

export interface SequencingPlan {
  phases: SequencingPhase[];
  totalDurationEstimate: string; // "8-10 weeks"
  notes?: string; // overall timeline notes
}

// -----------------------------------------------------------------------------
// Coordination Checklist Item
// -----------------------------------------------------------------------------

export interface CoordinationItem {
  beforeTrade: string;
  afterTrade: string;
  check: string; // what to verify
  critical: boolean; // if true, missing this causes expensive problems
  note?: string;
}

export interface CoordinationChecklist {
  items: CoordinationItem[];
}

// -----------------------------------------------------------------------------
// Generation Progress (reactive — client subscribes)
// -----------------------------------------------------------------------------

export interface GenerationProgress {
  total: number; // total trades to generate
  completed: number; // trades completed so far
  current: string | null; // trade currently being generated (display name)
  failed: string[]; // trade types that failed after retry
}

// -----------------------------------------------------------------------------
// Scope Preview (free — before payment)
// -----------------------------------------------------------------------------

export interface ScopePreviewTrade {
  tradeType: TradeType;
  title: string;
  icon: string;
  itemCount: number;
  sampleItems: Pick<ScopeItem, "item" | "specification">[]; // first 1-2 items only
}

export interface ScopePreview {
  projectType: ProjectType;
  propertyLocation: string; // "Paddington, NSW"
  mode: ProjectMode;
  trades: ScopePreviewTrade[];
  hasSequencingPlan: boolean;
  hasCoordinationChecklist: boolean;
  totalTradeCount: number;
}

// -----------------------------------------------------------------------------
// Payment
// -----------------------------------------------------------------------------

export type PricingTier = "starter" | "professional" | "premium";

export interface PricingTierConfig {
  id: PricingTier;
  name: string;
  price: number; // AUD cents
  displayPrice: string; // "$49"
  description: string;
  features: string[];
  recommended: boolean;
}
