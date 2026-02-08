import React from "react";
import type {
  ScopeItem,
  PCSum,
  SequencingPhase,
  CoordinationItem,
} from "@/types";

interface TradeData {
  tradeType: string;
  title: string;
  items: ScopeItem[];
  exclusions: string[];
  pcSums?: PCSum[];
  complianceNotes?: string;
  warnings?: string[];
  notes?: string;
}

interface FullScopeProps {
  projectType: string;
  suburb?: string;
  state?: string;
  generatedAt?: number;
  scopes: TradeData[];
  sequencing: { phases: SequencingPhase[]; totalDurationEstimate: string } | null;
  coordination: { items: CoordinationItem[] } | null;
}

interface TradeScopeProps {
  projectType: string;
  suburb?: string;
  state?: string;
  generatedAt?: number;
  tradeType: string;
  title: string;
  items: ScopeItem[];
  exclusions: string[];
  pcSums?: PCSum[];
  complianceNotes?: string;
  warnings?: string[];
  notes?: string;
}

/**
 * Generate a full scope package PDF (all trades + sequencing + coordination).
 * Uses dynamic import to avoid SSR issues — @react-pdf/renderer is browser-only.
 */
export async function generateFullScopePdf(props: FullScopeProps): Promise<Blob> {
  const { pdf } = await import("@react-pdf/renderer");
  const { ScopeDocument } = await import("./ScopeDocument");

  return await pdf(<ScopeDocument {...props} />).toBlob();
}

/**
 * Generate a single trade PDF.
 * Uses dynamic import to avoid SSR issues.
 */
export async function generateTradeScopePdf(props: TradeScopeProps): Promise<Blob> {
  const { pdf } = await import("@react-pdf/renderer");
  const { SingleTradeDocument } = await import("./SingleTradeDocument");

  return await pdf(<SingleTradeDocument {...props} />).toBlob();
}

/**
 * Generate a filename for a scope PDF.
 */
export function getScopeFilename(projectType: string, tradeType?: string): string {
  const base = projectType.toLowerCase().replace(/\s+/g, "-");
  if (tradeType) {
    return `scopeai-${base}-${tradeType}.pdf`;
  }
  return `scopeai-${base}-full-scope.pdf`;
}
