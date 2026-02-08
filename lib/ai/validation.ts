// =============================================================================
// Post-Generation Validation Rules
// =============================================================================
// Runs after each AI-generated trade scope to catch mistakes.
// The AI is good but not perfect — these rules enforce hard requirements.
// =============================================================================

import type { TradeScope, ScopeItem, PropertyDetails, QuestionAnswers, ProjectType } from "@/types";

export interface ValidationIssue {
  severity: "error" | "warning"; // errors = scope invalid, warnings = informational
  message: string;
}

export interface ValidationResult {
  valid: boolean; // true if no errors (warnings alone don't invalidate)
  issues: ValidationIssue[];
  additions: ScopeItem[]; // items to inject if AI missed them
  removals: string[]; // item IDs to flag for review
}

// -----------------------------------------------------------------------------
// Master validation — runs on every scope regardless of trade
// -----------------------------------------------------------------------------

function validateStructure(scope: TradeScope): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  const items = scope.items ?? [];

  if (items.length === 0) {
    issues.push({ severity: "error", message: `${scope.title}: No scope items generated` });
  }
  if (!scope.exclusions || scope.exclusions.length === 0) {
    issues.push({ severity: "warning", message: `${scope.title}: No exclusions listed — every scope should have exclusions` });
  }
  if (!scope.complianceNotes) {
    issues.push({ severity: "warning", message: `${scope.title}: No compliance notes — AU standards reference missing` });
  }

  // Check all items have required fields
  for (const item of items) {
    if (!item.item || !item.specification) {
      issues.push({ severity: "error", message: `${scope.title}: Item missing description or specification` });
    }
    if (!item.id) {
      issues.push({ severity: "error", message: `${scope.title}: Item missing ID — needed for toggle tracking` });
    }
  }

  return issues;
}

// -----------------------------------------------------------------------------
// Asbestos validation — property age < 1990
// -----------------------------------------------------------------------------

function validateAsbestos(
  scope: TradeScope,
  property: PropertyDetails
): { issues: ValidationIssue[]; additions: ScopeItem[] } {
  const issues: ValidationIssue[] = [];
  const additions: ScopeItem[] = [];

  if (!property.yearBuilt || property.yearBuilt >= 1990) {
    return { issues, additions };
  }

  // Property is pre-1990 — asbestos note should be present somewhere
  if (scope.tradeType === "demolition") {
    const hasAsbestosItem = scope.items.some(
      (i) => i.item.toLowerCase().includes("asbestos")
    );
    if (!hasAsbestosItem) {
      additions.push({
        id: `${scope.tradeType}-asbestos-inject`,
        category: "safety",
        item: "Asbestos inspection prior to demolition",
        specification:
          "Property built approx. " +
          property.yearBuilt +
          " — asbestos-containing materials likely present. Inspection by licensed assessor required before any demolition commences. Budget $500-800.",
        included: true,
        complianceNote: "Required under state WHS regulations for pre-1990 properties",
      });
      issues.push({ severity: "error", message: "Asbestos inspection item was missing from demolition scope — injected automatically" });
    }
  }

  // For ALL trades on pre-1990 properties, check for asbestos warning in notes
  if (!scope.notes?.toLowerCase().includes("asbestos") && !scope.warnings?.some(w => w.toLowerCase().includes("asbestos"))) {
    issues.push({
      severity: "warning",
      message: `${scope.title}: Pre-1990 property but no asbestos mention in notes/warnings — AI should flag this`,
    });
  }

  return { issues, additions };
}

// -----------------------------------------------------------------------------
// Wet area validation — bathroom & laundry
// -----------------------------------------------------------------------------

function validateWetArea(
  scope: TradeScope,
  projectType: ProjectType
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (!["bathroom", "laundry"].includes(projectType)) return issues;

  // Waterproofing trade scope must exist (handled at trade determination level)
  // But within plumbing scope, check for waterproofing coordination note
  if (scope.tradeType === "plumbing") {
    const hasWaterproofNote = scope.notes?.toLowerCase().includes("waterproof") ||
      scope.items.some(i => i.note?.toLowerCase().includes("waterproof") || i.specification.toLowerCase().includes("waterproof"));
    if (!hasWaterproofNote) {
      issues.push({ severity: "warning", message: "Plumbing scope for wet area should reference waterproofing coordination" });
    }
  }

  // Tiling scope should reference waterproofing
  if (scope.tradeType === "tiling") {
    const hasWaterproofRef = scope.notes?.toLowerCase().includes("waterproof") ||
      scope.complianceNotes?.toLowerCase().includes("waterproof") ||
      scope.items.some(i => i.specification.toLowerCase().includes("waterproof"));
    if (!hasWaterproofRef) {
      issues.push({ severity: "warning", message: "Tiling scope for wet area should reference waterproofing — tiling cannot commence until waterproofing is inspected and certified" });
    }
  }

  return issues;
}

// -----------------------------------------------------------------------------
// Electrical-specific validation
// -----------------------------------------------------------------------------

function validateElectrical(
  scope: TradeScope,
  answers: QuestionAnswers,
  property: PropertyDetails
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (scope.tradeType !== "electrical") return issues;

  // If induction cooktop selected, must have dedicated circuit
  const cooktopAnswer = answers["cooktop_type"];
  if (typeof cooktopAnswer === "string" && cooktopAnswer.toLowerCase().includes("induction")) {
    const hasInductionCircuit = scope.items.some(
      (i) => i.item.toLowerCase().includes("cooktop") && i.specification.toLowerCase().includes("32a")
    );
    if (!hasInductionCircuit) {
      issues.push({ severity: "error", message: "Induction cooktop selected but no dedicated 32A circuit in electrical scope" });
    }
  }

  // Switchboard assessment should always be included
  const hasSwitchboard = scope.items.some(
    (i) => i.item.toLowerCase().includes("switchboard")
  );
  if (!hasSwitchboard) {
    issues.push({ severity: "warning", message: "Electrical scope should include switchboard assessment item" });
  }

  // RCD compliance note
  if (!scope.complianceNotes?.toLowerCase().includes("rcd")) {
    issues.push({ severity: "warning", message: "Electrical compliance notes should reference RCD (safety switch) requirements" });
  }

  return issues;
}

// -----------------------------------------------------------------------------
// Plumbing-specific validation
// -----------------------------------------------------------------------------

function validatePlumbing(
  scope: TradeScope,
  answers: QuestionAnswers
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (scope.tradeType !== "plumbing") return issues;

  // If island bench with sink, must have floor penetration item
  const islandAnswer = answers["island_bench"];
  if (typeof islandAnswer === "string" && islandAnswer.toLowerCase().includes("sink")) {
    const hasIslandPlumbing = scope.items.some(
      (i) => i.item.toLowerCase().includes("island") || i.item.toLowerCase().includes("floor")
    );
    if (!hasIslandPlumbing) {
      issues.push({ severity: "error", message: "Island bench with sink selected but no island plumbing / floor penetration item" });
    }
  }

  // Compliance certificate reference
  if (!scope.complianceNotes?.toLowerCase().includes("3500") && !scope.complianceNotes?.toLowerCase().includes("compliance")) {
    issues.push({ severity: "warning", message: "Plumbing scope should reference AS/NZS 3500 and Certificate of Compliance" });
  }

  return issues;
}

// -----------------------------------------------------------------------------
// State-specific compliance validation
// -----------------------------------------------------------------------------

function validateStateCompliance(
  scope: TradeScope,
  property: PropertyDetails
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // Smoke alarm requirements vary by state
  if (scope.tradeType === "electrical") {
    // QLD has strict interconnected smoke alarm requirements since 2022
    if (property.state === "QLD" && !scope.items.some(i => i.item.toLowerCase().includes("smoke"))) {
      issues.push({ severity: "warning", message: "QLD property — smoke alarm upgrade to interconnected photoelectric alarms should be considered" });
    }
  }

  return issues;
}

// -----------------------------------------------------------------------------
// PC Sum validation — check ranges match quality tier
// -----------------------------------------------------------------------------

function validatePCSums(
  scope: TradeScope,
  answers: QuestionAnswers
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // If scope has PC sums, they should exist
  if (scope.tradeType === "tiling" || scope.tradeType === "stone" || scope.tradeType === "carpentry") {
    if (!scope.pcSums || scope.pcSums.length === 0) {
      issues.push({ severity: "warning", message: `${scope.title}: Should include PC sums for owner-selected materials` });
    }
  }

  return issues;
}

// =============================================================================
// Main validation function — call this after each scope is generated
// =============================================================================

export function validateScope(
  scope: TradeScope,
  projectType: ProjectType,
  property: PropertyDetails,
  answers: QuestionAnswers
): ValidationResult {
  const issues: ValidationIssue[] = [];
  const additions: ScopeItem[] = [];

  // Structure checks
  issues.push(...validateStructure(scope));

  // Asbestos checks
  const asbestos = validateAsbestos(scope, property);
  issues.push(...asbestos.issues);
  additions.push(...asbestos.additions);

  // Wet area checks
  issues.push(...validateWetArea(scope, projectType));

  // Trade-specific checks
  issues.push(...validateElectrical(scope, answers, property));
  issues.push(...validatePlumbing(scope, answers));

  // State compliance
  issues.push(...validateStateCompliance(scope, property));

  // PC Sum checks
  issues.push(...validatePCSums(scope, answers));

  // Only errors invalidate — warnings are informational
  const hasErrors = issues.some(i => i.severity === "error");

  return {
    valid: !hasErrors && additions.length === 0,
    issues,
    additions,
    removals: [],
  };
}
