"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TRADE_META } from "@/lib/trades";
import { staggerContainer, staggerItem } from "@/lib/animation-constants";
import { ScopeItemGroup } from "./ScopeItemGroup";
import { ScopeExclusions } from "./ScopeExclusions";
import { PCSumsTable } from "./PCSumsTable";
import { ScopeWarnings } from "./ScopeWarnings";
import { ScopeNotes } from "./ScopeNotes";
import type { TradeType, ScopeItem, PCSum } from "@/types";

interface TradeScopeProps {
  scope: {
    _id: string;
    tradeType: string;
    title: string;
    items: ScopeItem[];
    exclusions: string[];
    pcSums?: PCSum[];
    complianceNotes?: string;
    warnings?: string[];
    notes?: string;
    diyOption?: string;
  };
  onToggle: (scopeId: string, itemIndex: number, included: boolean) => void;
  onDownloadTrade?: (tradeType: string) => void;
  isDownloading?: boolean;
}

export function TradeScope({ scope, onToggle, onDownloadTrade, isDownloading }: TradeScopeProps) {
  const tradeType = scope.tradeType as TradeType;
  const meta = TRADE_META[tradeType];
  const items = scope.items ?? [];

  const includedCount = items.filter((it) => it.included).length;

  // Group items by category
  const groups = useMemo(() => {
    const map = new Map<string, (ScopeItem & { originalIndex: number })[]>();
    items.forEach((item, i) => {
      const cat = item.category || "General";
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push({ ...item, originalIndex: i });
    });
    return Array.from(map.entries());
  }, [items]);

  const handleToggle = (itemIndex: number, included: boolean) => {
    onToggle(scope._id, itemIndex, included);
  };

  return (
    <div className="space-y-6">
      {/* Trade header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {meta && (
            <span className="text-2xl" role="img" aria-hidden>
              {meta.icon}
            </span>
          )}
          <div>
            <h3 className="text-lg font-semibold">{scope.title}</h3>
            <p className="text-sm text-muted-foreground">
              {items.length} item{items.length !== 1 ? "s" : ""},{" "}
              {includedCount} included
            </p>
          </div>
        </div>
        {onDownloadTrade && (
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
            onClick={() => onDownloadTrade(scope.tradeType)}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
            ) : (
              <Download className="mr-1.5 h-3.5 w-3.5" />
            )}
            Download
          </Button>
        )}
      </div>

      {/* Item groups */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="rounded-lg border border-border bg-card"
      >
        {groups.map(([category, categoryItems], i) => (
          <motion.div
            key={category}
            variants={staggerItem}
            className={i > 0 ? "border-t border-border" : ""}
          >
            <ScopeItemGroup
              category={category}
              items={categoryItems}
              onToggle={handleToggle}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Exclusions */}
      <ScopeExclusions exclusions={scope.exclusions ?? []} />

      {/* PC Sums */}
      {scope.pcSums && scope.pcSums.length > 0 && (
        <>
          <Separator />
          <PCSumsTable pcSums={scope.pcSums} />
        </>
      )}

      {/* Warnings + Compliance */}
      <ScopeWarnings
        warnings={scope.warnings}
        complianceNotes={scope.complianceNotes}
      />

      {/* Notes + DIY */}
      <ScopeNotes notes={scope.notes} diyOption={scope.diyOption} />
    </div>
  );
}
