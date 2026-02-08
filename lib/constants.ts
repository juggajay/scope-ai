// =============================================================================
// ScopeAI — Constants & Configuration
// =============================================================================

import type {
  ProjectType,
  AustralianState,
  PropertyType,
  PricingTier,
  PricingTierConfig,
} from "@/types";

// -----------------------------------------------------------------------------
// Project Types (MVP — single room only)
// -----------------------------------------------------------------------------

export const PROJECT_TYPES: {
  id: ProjectType;
  label: string;
  icon: string;
  description: string;
}[] = [
  { id: "kitchen",   label: "Kitchen",     icon: "🍳", description: "Cabinets, benchtops, appliances" },
  { id: "bathroom",  label: "Bathroom",    icon: "🚿", description: "Wet area renovation" },
  { id: "laundry",   label: "Laundry",     icon: "🧺", description: "Cabinetry & utilities" },
  { id: "living",    label: "Living Area",  icon: "🛋️", description: "Open plan, flooring, lighting" },
  { id: "outdoor",   label: "Outdoor/Deck", icon: "🌿", description: "Alfresco, deck, landscaping" },
];

// -----------------------------------------------------------------------------
// Property Types
// -----------------------------------------------------------------------------

export const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
  { value: "house",     label: "House" },
  { value: "townhouse", label: "Townhouse" },
  { value: "apartment", label: "Apartment" },
  { value: "heritage",  label: "Heritage Listed" },
];

// -----------------------------------------------------------------------------
// Australian States
// -----------------------------------------------------------------------------

export const AUSTRALIAN_STATES: { value: AustralianState; label: string }[] = [
  { value: "NSW", label: "New South Wales" },
  { value: "VIC", label: "Victoria" },
  { value: "QLD", label: "Queensland" },
  { value: "SA",  label: "South Australia" },
  { value: "WA",  label: "Western Australia" },
  { value: "TAS", label: "Tasmania" },
  { value: "ACT", label: "Australian Capital Territory" },
  { value: "NT",  label: "Northern Territory" },
];

// -----------------------------------------------------------------------------
// Pricing Tiers
// -----------------------------------------------------------------------------

export const PRICING_TIERS: PricingTierConfig[] = [
  {
    id: "starter",
    name: "Starter",
    price: 4900, // cents
    displayPrice: "$49",
    description: "Single room, simple renovation",
    features: [
      "Up to 4 trade scopes",
      "Basic specifications",
      "Sequencing guide",
      "Comparison sheets",
      "PDF downloads",
    ],
    recommended: false,
  },
  {
    id: "professional",
    name: "Professional",
    price: 9900,
    displayPrice: "$99",
    description: "Full renovation — most popular",
    features: [
      "Up to 7 trade scopes",
      "Detailed specifications + PC sums",
      "Full sequencing plan",
      "Coordination checklist",
      "Quote comparison sheets",
      "PDF downloads (individual + ZIP)",
      "1 revision",
    ],
    recommended: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: 14900,
    displayPrice: "$149",
    description: "Complex renovation or heritage property",
    features: [
      "Unlimited trade scopes",
      "Full specifications + detailed PC sums",
      "Full sequencing plan",
      "Coordination checklist",
      "Quote comparison sheets",
      "PDF downloads (individual + ZIP)",
      "Heritage/asbestos flags",
      "Budget calibration notes",
      "3 revisions",
    ],
    recommended: false,
  },
];

// -----------------------------------------------------------------------------
// Asbestos threshold
// -----------------------------------------------------------------------------

export const ASBESTOS_YEAR_THRESHOLD = 1990;

// -----------------------------------------------------------------------------
// Photo upload limits
// -----------------------------------------------------------------------------

export const PHOTO_MIN_COUNT = 3;
export const PHOTO_MAX_COUNT = 10;
export const PHOTO_MAX_SIZE_MB = 10;
export const PHOTO_ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/heic", "image/webp"];

// -----------------------------------------------------------------------------
// Generation limits
// -----------------------------------------------------------------------------

export const GENERATION_MAX_RETRY_ATTEMPTS = 1;
export const GENERATION_RETRY_DELAY_MS = 2000;
export const PHOTO_ANALYSIS_TIMEOUT_MS = 30000;
