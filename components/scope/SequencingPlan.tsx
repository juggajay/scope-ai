"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { staggerContainer, staggerItem } from "@/lib/animation-constants";
import { cn } from "@/lib/utils";
import type { SequencingPhase } from "@/types";

interface SequencingPlanProps {
  phases: SequencingPhase[];
  totalDuration: string;
}

export function SequencingPlan({ phases, totalDuration }: SequencingPlanProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Sequencing Plan</h3>
        <p className="text-sm text-muted-foreground">
          Estimated total duration: {totalDuration}
        </p>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="relative"
      >
        {/* Vertical timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

        <div className="space-y-0">
          {phases.map((phase, i) => {
            const isHold = phase.isHoldPoint;
            const isParallel = phase.isParallel;

            return (
              <motion.div
                key={`${phase.phase}-${i}`}
                variants={staggerItem}
                className="relative pl-12 pb-6 last:pb-0"
              >
                {/* Phase circle */}
                <div
                  className={cn(
                    "absolute left-0 flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-semibold",
                    isHold
                      ? "border-yellow-500 bg-yellow-500 text-yellow-950 dark:border-yellow-400 dark:bg-yellow-400 dark:text-yellow-950"
                      : "border-border bg-background text-foreground"
                  )}
                >
                  {phase.phase}
                </div>

                {/* Phase card */}
                <div
                  className={cn(
                    "rounded-lg border p-4",
                    isHold
                      ? "border-l-4 border-yellow-500/30 border-l-yellow-500 bg-yellow-500/5 dark:border-yellow-400/30 dark:border-l-yellow-400 dark:bg-yellow-400/5"
                      : "border-border bg-card"
                  )}
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium">{phase.trade}</p>
                      {phase.dependencies && (
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          After: {phase.dependencies}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-1.5">
                      <Badge variant="outline" className="text-xs">
                        {phase.duration}
                      </Badge>
                      {isParallel && (
                        <Badge variant="secondary" className="text-xs">
                          Parallel
                        </Badge>
                      )}
                      {isHold && (
                        <Badge
                          className="border-yellow-500/30 bg-yellow-500/20 text-yellow-700 dark:border-yellow-400/30 dark:bg-yellow-400/20 dark:text-yellow-300"
                        >
                          Hold Point
                        </Badge>
                      )}
                    </div>
                  </div>
                  {phase.notes && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      {phase.notes}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
