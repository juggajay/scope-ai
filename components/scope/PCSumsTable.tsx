"use client";

import { Badge } from "@/components/ui/badge";
import type { PCSum } from "@/types";

interface PCSumsTableProps {
  pcSums: PCSum[];
}

export function PCSumsTable({ pcSums }: PCSumsTableProps) {
  if (pcSums.length === 0) return null;

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h4 className="text-sm font-medium">Provisional Cost Sums</h4>
        <Badge variant="outline" className="text-xs">
          Estimates Only
        </Badge>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-muted-foreground">
              <th className="px-4 py-2 text-left font-medium">Item</th>
              <th className="px-4 py-2 text-left font-medium">Unit</th>
              <th className="px-4 py-2 text-right font-medium">Qty</th>
              <th className="px-4 py-2 text-right font-medium">Rate Range</th>
              <th className="px-4 py-2 text-right font-medium">Budget Range</th>
            </tr>
          </thead>
          <tbody>
            {pcSums.map((pc, i) => (
              <tr
                key={i}
                className="border-b border-border/50 last:border-0"
              >
                <td className="px-4 py-2.5 text-foreground">{pc.item}</td>
                <td className="px-4 py-2.5 text-muted-foreground">
                  {pc.unit}
                </td>
                <td className="px-4 py-2.5 text-right text-muted-foreground">
                  {pc.quantity ?? "—"}
                </td>
                <td className="px-4 py-2.5 text-right tabular-nums">
                  {pc.rangeLow} – {pc.rangeHigh}
                </td>
                <td className="px-4 py-2.5 text-right font-medium tabular-nums">
                  {pc.budgetLow} – {pc.budgetHigh}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
