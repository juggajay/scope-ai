// =============================================================================
// Post-Generation Validation — Convex-compatible copy of lib/ai/validation.ts
// =============================================================================
// Types inlined to avoid importing from lib/ or types/

import type { ProjectType, TradeType, QuestionAnswers } from "./trades";

interface ScopeItem {
  id: string;
  category: string;
  item: string;
  specification: string;
  included: boolean;
  complianceNote?: string;
  note?: string;
}

interface TradeScope {
  tradeType: TradeType;
  title: string;
  items: ScopeItem[];
  exclusions: string[];
  pcSums?: unknown[];
  complianceNotes?: string;
  warnings?: string[];
  notes?: string;
}

interface PropertyDetails {
  suburb?: string;
  state?: string;
  type?: string;
  yearBuilt?: number;
}

export interface ValidationIssue {
  severity: "error" | "warning";
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
  additions: ScopeItem[];
  removals: string[];
}

function validateStructure(scope: TradeScope): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const items = scope.items ?? [];

  if (items.length === 0) {
    issues.push({ severity: "error", message: `${scope.title}: No scope items generated` });
  }
  if (!scope.exclusions || scope.exclusions.length === 0) {
    issues.push({ severity: "warning", message: `${scope.title}: No exclusions listed` });
  }
  if (!scope.complianceNotes) {
    issues.push({ severity: "warning", message: `${scope.title}: No compliance notes` });
  }

  for (const item of items) {
    if (!item.item || !item.specification) {
      issues.push({ severity: "error", message: `${scope.title}: Item missing description or specification` });
    }
    if (!item.id) {
      issues.push({ severity: "error", message: `${scope.title}: Item missing ID` });
    }
  }

  return issues;
}

function validateAsbestos(
  scope: TradeScope,
  property: PropertyDetails
): { issues: ValidationIssue[]; additions: ScopeItem[] } {
  const issues: ValidationIssue[] = [];
  const additions: ScopeItem[] = [];

  if (!property.yearBuilt || property.yearBuilt >= 1990) {
    return { issues, additions };
  }

  if (scope.tradeType === "demolition") {
    const hasAsbestosItem = scope.items.some((i) => i.item.toLowerCase().includes("asbestos"));
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

  if (!scope.notes?.toLowerCase().includes("asbestos") && !scope.warnings?.some((w) => w.toLowerCase().includes("asbestos"))) {
    issues.push({
      severity: "warning",
      message: `${scope.title}: Pre-1990 property but no asbestos mention in notes/warnings`,
    });
  }

  return { issues, additions };
}

function validateWetArea(scope: TradeScope, projectType: ProjectType): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (!["bathroom", "laundry"].includes(projectType)) return issues;

  if (scope.tradeType === "plumbing") {
    const hasWaterproofNote =
      scope.notes?.toLowerCase().includes("waterproof") ||
      scope.items.some(
        (i) => i.note?.toLowerCase().includes("waterproof") || i.specification.toLowerCase().includes("waterproof")
      );
    if (!hasWaterproofNote) {
      issues.push({ severity: "warning", message: "Plumbing scope for wet area should reference waterproofing coordination" });
    }
  }

  if (scope.tradeType === "tiling") {
    const hasWaterproofRef =
      scope.notes?.toLowerCase().includes("waterproof") ||
      scope.complianceNotes?.toLowerCase().includes("waterproof") ||
      scope.items.some((i) => i.specification.toLowerCase().includes("waterproof"));
    if (!hasWaterproofRef) {
      issues.push({ severity: "warning", message: "Tiling scope for wet area should reference waterproofing" });
    }
  }

  return issues;
}

function validateElectrical(scope: TradeScope, answers: QuestionAnswers, property: PropertyDetails): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (scope.tradeType !== "electrical") return issues;

  const cooktopAnswer = answers["cooktop_type"];
  if (typeof cooktopAnswer === "string" && cooktopAnswer.toLowerCase().includes("induction")) {
    const hasInductionCircuit = scope.items.some(
      (i) => i.item.toLowerCase().includes("cooktop") && i.specification.toLowerCase().includes("32a")
    );
    if (!hasInductionCircuit) {
      issues.push({ severity: "error", message: "Induction cooktop selected but no dedicated 32A circuit in electrical scope" });
    }
  }

  const hasSwitchboard = scope.items.some((i) => i.item.toLowerCase().includes("switchboard"));
  if (!hasSwitchboard) {
    issues.push({ severity: "warning", message: "Electrical scope should include switchboard assessment item" });
  }

  if (!scope.complianceNotes?.toLowerCase().includes("rcd")) {
    issues.push({ severity: "warning", message: "Electrical compliance notes should reference RCD requirements" });
  }

  if (property.state === "QLD" && !scope.items.some((i) => i.item.toLowerCase().includes("smoke"))) {
    issues.push({ severity: "warning", message: "QLD property — smoke alarm upgrade should be considered" });
  }

  return issues;
}

function validatePlumbing(scope: TradeScope, answers: QuestionAnswers): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (scope.tradeType !== "plumbing") return issues;

  const islandAnswer = answers["island_bench"];
  if (typeof islandAnswer === "string" && islandAnswer.toLowerCase().includes("sink")) {
    const hasIslandPlumbing = scope.items.some(
      (i) => i.item.toLowerCase().includes("island") || i.item.toLowerCase().includes("floor")
    );
    if (!hasIslandPlumbing) {
      issues.push({ severity: "error", message: "Island bench with sink selected but no island plumbing item" });
    }
  }

  if (!scope.complianceNotes?.toLowerCase().includes("3500") && !scope.complianceNotes?.toLowerCase().includes("compliance")) {
    issues.push({ severity: "warning", message: "Plumbing scope should reference AS/NZS 3500" });
  }

  return issues;
}

function validatePCSums(scope: TradeScope): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (["tiling", "stone", "carpentry"].includes(scope.tradeType)) {
    if (!scope.pcSums || (scope.pcSums as unknown[]).length === 0) {
      issues.push({ severity: "warning", message: `${scope.title}: Should include PC sums for owner-selected materials` });
    }
  }
  return issues;
}

export function validateScope(
  scope: TradeScope,
  projectType: ProjectType,
  property: PropertyDetails,
  answers: QuestionAnswers
): ValidationResult {
  const issues: ValidationIssue[] = [];
  const additions: ScopeItem[] = [];

  issues.push(...validateStructure(scope));

  const asbestos = validateAsbestos(scope, property);
  issues.push(...asbestos.issues);
  additions.push(...asbestos.additions);

  issues.push(...validateWetArea(scope, projectType));
  issues.push(...validateElectrical(scope, answers, property));
  issues.push(...validatePlumbing(scope, answers));
  issues.push(...validatePCSums(scope));

  const hasErrors = issues.some((i) => i.severity === "error");

  return {
    valid: !hasErrors && additions.length === 0,
    issues,
    additions,
    removals: [],
  };
}
