"use client";

import { useState } from "react";
import { toast } from "sonner";
import { trackEvent } from "@/lib/analytics";
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

interface DocumentProps {
  projectType: string;
  suburb?: string;
  state?: string;
  generatedAt?: number;
  scopes: TradeData[];
  sequencing: { phases: SequencingPhase[]; totalDurationEstimate: string } | null;
  coordination: { items: CoordinationItem[] } | null;
}

export function useScopeDownload() {
  const [downloading, setDownloading] = useState<string | null>(null);

  async function saveBlob(blob: Blob, filename: string) {
    const { saveAs } = await import("file-saver");
    saveAs(blob, filename);
  }

  async function downloadFullPdf(props: DocumentProps) {
    setDownloading("full-pdf");
    try {
      const { generateFullScopePdf, getScopeFilename } = await import("@/lib/pdf/generate");
      const blob = await generateFullScopePdf(props);
      await saveBlob(blob, getScopeFilename(props.projectType));
      trackEvent("scope_pdf_downloaded", { downloadType: "full", projectType: props.projectType });
      toast.success("PDF downloaded");
    } catch (err) {
      console.error("PDF generation failed:", err);
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setDownloading(null);
    }
  }

  async function downloadTradePdf(
    props: DocumentProps,
    tradeType: string
  ) {
    setDownloading(tradeType);
    try {
      const { generateTradeScopePdf, getScopeFilename } = await import("@/lib/pdf/generate");
      const scope = props.scopes.find((s) => s.tradeType === tradeType);
      if (!scope) throw new Error("Trade not found");

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
      await saveBlob(blob, getScopeFilename(props.projectType, tradeType));
      trackEvent("scope_pdf_downloaded", { downloadType: "trade", tradeType, projectType: props.projectType });
      toast.success("PDF downloaded");
    } catch (err) {
      console.error("Trade PDF generation failed:", err);
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setDownloading(null);
    }
  }

  async function downloadZip(props: DocumentProps) {
    setDownloading("zip");
    try {
      const { generateScopeZip } = await import("@/lib/pdf/zip");
      const blob = await generateScopeZip(props);
      const base = props.projectType.toLowerCase().replace(/\s+/g, "-");
      await saveBlob(blob, `scopeai-${base}-all-scopes.zip`);
      trackEvent("scope_pdf_downloaded", { downloadType: "zip", projectType: props.projectType });
      toast.success("ZIP downloaded");
    } catch (err) {
      console.error("ZIP generation failed:", err);
      toast.error("Failed to generate ZIP. Please try again.");
    } finally {
      setDownloading(null);
    }
  }

  return { downloading, downloadFullPdf, downloadTradePdf, downloadZip };
}
