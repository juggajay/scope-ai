import React from "react";
import type {
  ScopeItem,
  PCSum,
  SequencingPhase,
  CoordinationItem,
} from "@/types";
import { generateFullScopePdf, generateTradeScopePdf, getScopeFilename } from "./generate";

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

interface ZipProps {
  projectType: string;
  suburb?: string;
  state?: string;
  generatedAt?: number;
  scopes: TradeData[];
  sequencing: { phases: SequencingPhase[]; totalDurationEstimate: string } | null;
  coordination: { items: CoordinationItem[] } | null;
}

/**
 * Generate a ZIP containing the full package PDF + individual trade PDFs.
 * Uses dynamic import for jszip (browser-only).
 */
export async function generateScopeZip(props: ZipProps): Promise<Blob> {
  const JSZip = (await import("jszip")).default;
  const zip = new JSZip();

  // Full package PDF
  const fullPdf = await generateFullScopePdf(props);
  zip.file(getScopeFilename(props.projectType), fullPdf);

  // Individual trade PDFs
  const tradePdfs = await Promise.all(
    props.scopes.map(async (scope) => {
      const blob = await generateTradeScopePdf({
        projectType: props.projectType,
        suburb: props.suburb,
        state: props.state,
        generatedAt: props.generatedAt,
        tradeType: scope.tradeType,
        title: scope.title,
        items: scope.items,
        exclusions: scope.exclusions,
        pcSums: scope.pcSums,
        complianceNotes: scope.complianceNotes,
        warnings: scope.warnings,
        notes: scope.notes,
      });
      return { filename: getScopeFilename(props.projectType, scope.tradeType), blob };
    })
  );

  for (const { filename, blob } of tradePdfs) {
    zip.file(filename, blob);
  }

  return await zip.generateAsync({ type: "blob" });
}
