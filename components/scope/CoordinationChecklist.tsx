"use client";

import { motion } from "framer-motion";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { staggerContainer, staggerItem } from "@/lib/animation-constants";
import { cn } from "@/lib/utils";
import type { CoordinationItem } from "@/types";

interface CoordinationChecklistProps {
  items: CoordinationItem[];
}

export function CoordinationChecklist({ items }: CoordinationChecklistProps) {
  // Sort: critical items first
  const sorted = [...items].sort((a, b) => {
    if (a.critical && !b.critical) return -1;
    if (!a.critical && b.critical) return 1;
    return 0;
  });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Coordination Checklist</h3>
        <p className="text-sm text-muted-foreground">
          {items.filter((it) => it.critical).length} critical coordination
          point{items.filter((it) => it.critical).length !== 1 ? "s" : ""}
        </p>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="space-y-3"
      >
        {sorted.map((item, i) => (
          <motion.div
            key={i}
            variants={staggerItem}
            className={cn(
              "rounded-lg border p-4",
              item.critical
                ? "border-l-4 border-destructive/20 border-l-destructive bg-destructive/5"
                : "border-l-4 border-border border-l-border bg-card"
            )}
          >
            <div className="flex items-start gap-3">
              {item.critical && (
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
              )}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge variant="outline" className="text-xs">
                    {item.beforeTrade}
                  </Badge>
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  <Badge variant="outline" className="text-xs">
                    {item.afterTrade}
                  </Badge>
                  {item.critical && (
                    <Badge variant="destructive" className="text-xs">
                      CRITICAL
                    </Badge>
                  )}
                </div>
                <p className="mt-2 text-sm">{item.check}</p>
                {item.note && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.note}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
