// =============================================================================
// Sequencing Templates — Base Phase Order per Project Type
// =============================================================================
// These templates define the STRUCTURE of the sequencing plan.
// The AI fills in project-specific durations, notes, and warnings.
// Phases for trades not in the project are automatically removed.
// =============================================================================

import type { TradeType, ProjectType, SequencingPhase } from "@/types";

// -----------------------------------------------------------------------------
// Template phase (before AI enrichment)
// -----------------------------------------------------------------------------

export interface SequencingTemplatePhase {
  phase: string;
  trade: string;
  tradeType?: TradeType; // links to scope — if trade not required, phase is removed
  baseDuration: string; // default duration — AI adjusts based on scope complexity
  baseDependencies: string; // default dependencies
  isParallel?: boolean; // can run alongside adjacent phase with same phase number
  isHoldPoint?: boolean; // inspection/certification required before proceeding
  color: string;
  alwaysInclude?: boolean; // include even if tradeType not in required trades (e.g. "Final clean")
}

export interface SequencingTemplate {
  projectType: ProjectType;
  phases: SequencingTemplatePhase[];
  baseEstimate: string; // "8-10 weeks"
}

// -----------------------------------------------------------------------------
// Kitchen sequencing template
// -----------------------------------------------------------------------------

export const kitchenTemplate: SequencingTemplate = {
  projectType: "kitchen",
  baseEstimate: "8-10 weeks",
  phases: [
    {
      phase: "1",
      trade: "Demolition & Strip-Out",
      tradeType: "demolition",
      baseDuration: "3-5 days",
      baseDependencies: "Asbestos clearance (if required), service disconnection by electrician + plumber",
      color: "#ef4444",
    },
    {
      phase: "2",
      trade: "Structural (wall removal + beam)",
      tradeType: "structural",
      baseDuration: "2-3 days",
      baseDependencies: "Engineer sign-off required. Council approval if applicable.",
      isHoldPoint: true,
      color: "#f97316",
    },
    {
      phase: "3a",
      trade: "Plumber — rough-in",
      tradeType: "plumbing",
      baseDuration: "1-2 days",
      baseDependencies: "After structural complete, before wall close-up",
      isParallel: true,
      color: "#3b82f6",
    },
    {
      phase: "3b",
      trade: "Electrician — rough-in",
      tradeType: "electrical",
      baseDuration: "1-2 days",
      baseDependencies: "Can run parallel with plumber — coordinate access",
      isParallel: true,
      color: "#eab308",
    },
    {
      phase: "4",
      trade: "Plastering / wall close-up",
      baseDuration: "2-3 days",
      baseDependencies: "After all rough-in inspected and approved",
      color: "#8b5cf6",
      alwaysInclude: true,
    },
    {
      phase: "5",
      trade: "Floor tiling (if before cabinets)",
      tradeType: "tiling",
      baseDuration: "2-3 days",
      baseDependencies: "Optional timing — can tile after cabinets instead. Confirm with homeowner.",
      color: "#06b6d4",
    },
    {
      phase: "6",
      trade: "Cabinet installation",
      tradeType: "carpentry",
      baseDuration: "3-4 days",
      baseDependencies: "Cabinets must be delivered and inspected. Walls painted (primer coat minimum).",
      color: "#22c55e",
    },
    {
      phase: "7",
      trade: "Benchtop template",
      tradeType: "stone",
      baseDuration: "1 day",
      baseDependencies: "ALL cabinets installed and level. Sink, cooktop, and tapware models confirmed.",
      color: "#64748b",
    },
    {
      phase: "—",
      trade: "Benchtop fabrication (wait period)",
      tradeType: "stone",
      baseDuration: "10-14 working days",
      baseDependencies: "No site work during fabrication. Use this window for splashback tiling.",
      color: "#94a3b8",
    },
    {
      phase: "8",
      trade: "Splashback tiling",
      tradeType: "tiling",
      baseDuration: "1-2 days",
      baseDependencies: "After cabinets installed. BEFORE benchtop installation.",
      color: "#06b6d4",
    },
    {
      phase: "9",
      trade: "Benchtop installation",
      tradeType: "stone",
      baseDuration: "1 day",
      baseDependencies: "Splashback complete. Sink and tapware on site.",
      color: "#64748b",
    },
    {
      phase: "10a",
      trade: "Plumber — final fix",
      tradeType: "plumbing",
      baseDuration: "1 day",
      baseDependencies: "Benchtop installed. Sink, taps, dishwasher, gas connection.",
      isParallel: true,
      color: "#3b82f6",
    },
    {
      phase: "10b",
      trade: "Electrician — final fix",
      tradeType: "electrical",
      baseDuration: "1 day",
      baseDependencies: "GPO covers, downlights, pendants, appliance connections, testing.",
      isParallel: true,
      color: "#eab308",
    },
    {
      phase: "11",
      trade: "Painting",
      tradeType: "painting",
      baseDuration: "2-3 days",
      baseDependencies: "ALL other work complete. Last trade before final clean.",
      color: "#ec4899",
    },
    {
      phase: "12",
      trade: "Final clean + appliance install",
      baseDuration: "1 day",
      baseDependencies: "All trades complete. Appliances on site. Builder's clean.",
      color: "#10b981",
      alwaysInclude: true,
    },
  ],
};

// -----------------------------------------------------------------------------
// Bathroom sequencing template
// -----------------------------------------------------------------------------

export const bathroomTemplate: SequencingTemplate = {
  projectType: "bathroom",
  baseEstimate: "4-6 weeks",
  phases: [
    {
      phase: "1",
      trade: "Demolition & Strip-Out",
      tradeType: "demolition",
      baseDuration: "2-3 days",
      baseDependencies: "Asbestos clearance (if required). Service disconnection by electrician + plumber.",
      color: "#ef4444",
    },
    {
      phase: "2a",
      trade: "Plumber — rough-in",
      tradeType: "plumbing",
      baseDuration: "1-2 days",
      baseDependencies: "After demolition. All waste and water positions confirmed from layout plan.",
      isParallel: true,
      color: "#3b82f6",
    },
    {
      phase: "2b",
      trade: "Electrician — rough-in",
      tradeType: "electrical",
      baseDuration: "1 day",
      baseDependencies: "After demolition. In-floor heating mat if applicable.",
      isParallel: true,
      color: "#eab308",
    },
    {
      phase: "3",
      trade: "Shower hob / niche framing / plastering",
      baseDuration: "1-2 days",
      baseDependencies: "After rough-in complete. Niche position confirmed.",
      color: "#8b5cf6",
      alwaysInclude: true,
    },
    {
      phase: "4",
      trade: "Screed to falls (shower floor)",
      baseDuration: "1 day",
      baseDependencies: "Floor waste position confirmed and installed by plumber.",
      color: "#64748b",
      alwaysInclude: true,
    },
    {
      phase: "5",
      trade: "Waterproofing",
      tradeType: "waterproofing",
      baseDuration: "2-3 days",
      baseDependencies: "ALL rough-in complete. Screed cured. Nothing can penetrate membrane after this.",
      isHoldPoint: true,
      color: "#0ea5e9",
    },
    {
      phase: "6",
      trade: "Tiling (floor + walls)",
      tradeType: "tiling",
      baseDuration: "3-5 days",
      baseDependencies: "Waterproofing inspected and certified. Cannot start without certificate.",
      color: "#06b6d4",
    },
    {
      phase: "7",
      trade: "Vanity / cabinetry installation",
      tradeType: "carpentry",
      baseDuration: "1 day",
      baseDependencies: "Tiling complete. Vanity on site.",
      color: "#22c55e",
    },
    {
      phase: "8a",
      trade: "Plumber — final fix",
      tradeType: "plumbing",
      baseDuration: "1 day",
      baseDependencies: "Tiling and vanity complete. Tapware, toilet, shower screen bracket on site.",
      isParallel: true,
      color: "#3b82f6",
    },
    {
      phase: "8b",
      trade: "Electrician — final fix",
      tradeType: "electrical",
      baseDuration: "0.5 day",
      baseDependencies: "Downlights, exhaust fan, mirror light, heated towel rail connection.",
      isParallel: true,
      color: "#eab308",
    },
    {
      phase: "9",
      trade: "Painting",
      tradeType: "painting",
      baseDuration: "1 day",
      baseDependencies: "All trades complete. Ceiling and any painted walls above tile line.",
      color: "#ec4899",
    },
    {
      phase: "10",
      trade: "Shower screen + accessories + final clean",
      baseDuration: "1 day",
      baseDependencies: "Shower screen, mirror, towel rails, toilet roll holder. Final silicon and clean.",
      color: "#10b981",
      alwaysInclude: true,
    },
  ],
};

// -----------------------------------------------------------------------------
// Laundry sequencing template
// -----------------------------------------------------------------------------

export const laundryTemplate: SequencingTemplate = {
  projectType: "laundry",
  baseEstimate: "2-3 weeks",
  phases: [
    {
      phase: "1",
      trade: "Demolition & Strip-Out",
      tradeType: "demolition",
      baseDuration: "1-2 days",
      baseDependencies: "Asbestos clearance if required. Disconnect washing machine, tub, dryer.",
      color: "#ef4444",
    },
    {
      phase: "2a",
      trade: "Plumber — rough-in",
      tradeType: "plumbing",
      baseDuration: "1 day",
      baseDependencies: "After demolition.",
      isParallel: true,
      color: "#3b82f6",
    },
    {
      phase: "2b",
      trade: "Electrician — rough-in",
      tradeType: "electrical",
      baseDuration: "0.5 day",
      baseDependencies: "After demolition.",
      isParallel: true,
      color: "#eab308",
    },
    {
      phase: "3",
      trade: "Plastering / wall close-up",
      baseDuration: "1 day",
      baseDependencies: "After rough-in.",
      color: "#8b5cf6",
      alwaysInclude: true,
    },
    {
      phase: "4",
      trade: "Waterproofing",
      tradeType: "waterproofing",
      baseDuration: "1-2 days",
      baseDependencies: "After plastering. Floor area waterproofed per AS 3740.",
      isHoldPoint: true,
      color: "#0ea5e9",
    },
    {
      phase: "5",
      trade: "Floor tiling",
      tradeType: "tiling",
      baseDuration: "1-2 days",
      baseDependencies: "Waterproofing certified.",
      color: "#06b6d4",
    },
    {
      phase: "6",
      trade: "Cabinet installation",
      tradeType: "carpentry",
      baseDuration: "1-2 days",
      baseDependencies: "Floor tiling complete.",
      color: "#22c55e",
    },
    {
      phase: "7",
      trade: "Plumber + electrician final fix",
      baseDuration: "1 day",
      baseDependencies: "Cabinets installed. Connect tub, taps, washing machine taps, dryer. GPOs, lights.",
      color: "#3b82f6",
      alwaysInclude: true,
    },
    {
      phase: "8",
      trade: "Painting + final clean",
      tradeType: "painting",
      baseDuration: "1 day",
      baseDependencies: "All trades complete.",
      color: "#ec4899",
    },
  ],
};

// -----------------------------------------------------------------------------
// Living area sequencing template
// -----------------------------------------------------------------------------

export const livingTemplate: SequencingTemplate = {
  projectType: "living",
  baseEstimate: "3-5 weeks",
  phases: [
    {
      phase: "1",
      trade: "Demolition",
      tradeType: "demolition",
      baseDuration: "2-4 days",
      baseDependencies: "Service disconnection. Wall removal preparation.",
      color: "#ef4444",
    },
    {
      phase: "2",
      trade: "Structural (wall removal + beam)",
      tradeType: "structural",
      baseDuration: "2-3 days",
      baseDependencies: "Engineer sign-off. Temporary propping in place.",
      isHoldPoint: true,
      color: "#f97316",
    },
    {
      phase: "3",
      trade: "Electrician — rough-in",
      tradeType: "electrical",
      baseDuration: "1-2 days",
      baseDependencies: "After structural work. New lighting, power, data positions.",
      color: "#eab308",
    },
    {
      phase: "4",
      trade: "Plastering / wall close-up",
      baseDuration: "2-3 days",
      baseDependencies: "After rough-in complete.",
      color: "#8b5cf6",
      alwaysInclude: true,
    },
    {
      phase: "5",
      trade: "Flooring",
      tradeType: "tiling",
      baseDuration: "2-4 days",
      baseDependencies: "Walls complete. Subfloor prepared.",
      color: "#06b6d4",
    },
    {
      phase: "6",
      trade: "Carpentry — joinery, doors, trim",
      tradeType: "carpentry",
      baseDuration: "2-3 days",
      baseDependencies: "Built-ins, architraves, skirting, doors.",
      color: "#22c55e",
    },
    {
      phase: "7",
      trade: "Electrician — final fix",
      tradeType: "electrical",
      baseDuration: "1 day",
      baseDependencies: "Lights, switches, GPO covers, TV points.",
      color: "#eab308",
    },
    {
      phase: "8",
      trade: "Painting",
      tradeType: "painting",
      baseDuration: "2-3 days",
      baseDependencies: "All trades complete.",
      color: "#ec4899",
    },
    {
      phase: "9",
      trade: "Final clean + furnishing",
      baseDuration: "1 day",
      baseDependencies: "All work complete.",
      color: "#10b981",
      alwaysInclude: true,
    },
  ],
};

// -----------------------------------------------------------------------------
// Outdoor sequencing template
// -----------------------------------------------------------------------------

export const outdoorTemplate: SequencingTemplate = {
  projectType: "outdoor",
  baseEstimate: "3-6 weeks",
  phases: [
    {
      phase: "1",
      trade: "Demolition / site preparation",
      tradeType: "demolition",
      baseDuration: "2-3 days",
      baseDependencies: "Remove existing deck/patio. Clear site. Access for materials.",
      color: "#ef4444",
    },
    {
      phase: "2",
      trade: "Footings / concrete / stumps",
      baseDuration: "2-3 days",
      baseDependencies: "Site prepared. Set-out confirmed.",
      color: "#f97316",
      alwaysInclude: true,
    },
    {
      phase: "3",
      trade: "Electrical — underground/rough-in",
      tradeType: "electrical",
      baseDuration: "1 day",
      baseDependencies: "Before deck framing covers cable runs. Underground conduit if required.",
      color: "#eab308",
    },
    {
      phase: "4",
      trade: "Plumbing — rough-in (if outdoor kitchen)",
      tradeType: "plumbing",
      baseDuration: "1 day",
      baseDependencies: "Water, waste, gas if BBQ connection needed.",
      color: "#3b82f6",
    },
    {
      phase: "5",
      trade: "Deck framing / structure",
      tradeType: "carpentry",
      baseDuration: "3-5 days",
      baseDependencies: "Footings set. Bearers, joists, posts. Pergola/roof structure if applicable.",
      color: "#22c55e",
    },
    {
      phase: "6",
      trade: "Decking / tiling",
      baseDuration: "2-3 days",
      baseDependencies: "Framing complete. Decking boards or outdoor tiles.",
      color: "#06b6d4",
      alwaysInclude: true,
    },
    {
      phase: "7",
      trade: "Balustrade / screening",
      tradeType: "carpentry",
      baseDuration: "1-2 days",
      baseDependencies: "Deck complete. Balustrade materials on site.",
      color: "#22c55e",
    },
    {
      phase: "8",
      trade: "Electrical — final fix",
      tradeType: "electrical",
      baseDuration: "1 day",
      baseDependencies: "Lights, GPOs, fan, BBQ connection if applicable.",
      color: "#eab308",
    },
    {
      phase: "9",
      trade: "Painting / oiling / staining",
      tradeType: "painting",
      baseDuration: "1-2 days",
      baseDependencies: "All construction complete. Timber treatment/finishing.",
      color: "#ec4899",
    },
    {
      phase: "10",
      trade: "Final clean + landscaping",
      baseDuration: "1 day",
      baseDependencies: "All work complete. Site clean-up. Landscaping reinstatement.",
      color: "#10b981",
      alwaysInclude: true,
    },
  ],
};

// -----------------------------------------------------------------------------
// Template lookup
// -----------------------------------------------------------------------------

const TEMPLATES: Record<ProjectType, SequencingTemplate> = {
  kitchen: kitchenTemplate,
  bathroom: bathroomTemplate,
  laundry: laundryTemplate,
  living: livingTemplate,
  outdoor: outdoorTemplate,
};

export function getSequencingTemplate(projectType: ProjectType): SequencingTemplate {
  return TEMPLATES[projectType];
}

// -----------------------------------------------------------------------------
// Filter template phases by required trades
// -----------------------------------------------------------------------------

export function filterTemplatePhasesForTrades(
  template: SequencingTemplate,
  requiredTrades: TradeType[]
): SequencingTemplatePhase[] {
  return template.phases.filter((phase) => {
    // Always include phases marked as alwaysInclude
    if (phase.alwaysInclude) return true;
    // Include if trade is in required trades
    if (phase.tradeType && requiredTrades.includes(phase.tradeType)) return true;
    return false;
  });
}
