"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, AlertTriangle, Loader2, RotateCcw } from "lucide-react";
import { useWizard } from "@/lib/wizard/WizardContext";
import { determineRequiredTrades, TRADE_META } from "@/lib/trades";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useQuery, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import type { TradeType } from "@/types";

type TradeStatus = "pending" | "generating" | "complete" | "failed";

interface TradeProgress {
  tradeType: TradeType;
  title: string;
  icon: string;
  status: TradeStatus;
}

const TIPS = [
  "Your scope includes Australian Standards compliance notes for each trade.",
  "PC (Provisional Cost) sums help you compare quotes like-for-like.",
  "The sequencing plan shows which trades need to work in what order.",
  "Each scope item includes detailed specifications tradies can quote against.",
  "Coordination checklists prevent expensive mistakes between trades.",
];

export function GeneratingState() {
  const { state, dispatch, goNext } = useWizard();
  const { projectType, answers, projectId } = state;

  const [currentTip, setCurrentTip] = useState(0);
  const generateFiredRef = useRef(false);

  const generateScopes = useAction(api.ai.generateScopes);
  const retryTradeScope = useAction(api.ai.retryTradeScope);

  // Subscribe to project for real-time progress
  const project = useQuery(
    api.projects.getProject,
    projectId ? { projectId: projectId as Id<"projects"> } : "skip"
  );

  // Hide footer during generation
  useEffect(() => {
    dispatch({ type: "SET_FOOTER", hidden: true });
  }, [dispatch]);

  // Fire generateScopes once when component mounts with a projectId
  useEffect(() => {
    if (!projectId || generateFiredRef.current) return;
    generateFiredRef.current = true;

    generateScopes({ projectId: projectId as Id<"projects"> }).catch((err) =>
      console.error("Scope generation failed:", err)
    );
  }, [projectId, generateScopes]);

  // Determine expected trades from local state
  const expectedTrades = projectType
    ? determineRequiredTrades(projectType, answers).trades
    : [];

  // Derive trade card statuses from real project data
  const progress = project?.generationProgress;
  const isGenerated = project?.status === "generated";

  const trades: TradeProgress[] = expectedTrades.map((t, index) => {
    const meta = TRADE_META[t];
    let status: TradeStatus = "pending";

    if (progress) {
      if (progress.failed.includes(t)) {
        status = "failed";
      } else if (progress.completed > index) {
        status = "complete";
      } else if (
        progress.completed === index &&
        progress.current === meta.title
      ) {
        status = "generating";
      }
    }

    // If project is fully generated, all non-failed are complete
    if (isGenerated && status !== "failed") {
      status = "complete";
    }

    return {
      tradeType: t,
      title: meta.title,
      icon: meta.icon,
      status,
    };
  });

  const allDone = isGenerated;
  const failedCount = progress?.failed.length ?? 0;

  // Handle retry
  const handleRetry = async (tradeType: TradeType) => {
    if (!projectId) return;
    try {
      await retryTradeScope({
        projectId: projectId as Id<"projects">,
        tradeType,
      });
    } catch (err) {
      console.error(`Retry failed for ${tradeType}:`, err);
    }
  };

  // Rotate tips
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % TIPS.length);
    }, 9000);
    return () => clearInterval(interval);
  }, []);

  // When generation completes, mark in wizard state
  useEffect(() => {
    if (allDone) {
      dispatch({ type: "SET_GENERATION_COMPLETE", complete: true });
    }
  }, [allDone, dispatch]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="space-y-2 text-center">
          <AnimatePresence mode="wait">
            {allDone ? (
              <motion.h2
                key="done"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="text-xl font-semibold tracking-tight"
              >
                Your scope is ready!
              </motion.h2>
            ) : (
              <motion.h2
                key="generating"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xl font-semibold tracking-tight"
              >
                Generating your scope...
              </motion.h2>
            )}
          </AnimatePresence>
          {!allDone && (
            <p className="text-sm text-muted-foreground">
              Building detailed, trade-specific scope documents.
            </p>
          )}
          {allDone && failedCount > 0 && (
            <p className="text-sm text-destructive">
              {failedCount} trade{failedCount > 1 ? "s" : ""} failed to
              generate. You can retry below.
            </p>
          )}
        </div>

        {/* Trade card stack */}
        <div className="space-y-3">
          {trades.map((trade, i) => (
            <motion.div
              key={trade.tradeType}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.3 }}
              className={cn(
                "flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3",
                trade.status === "generating" && "animate-pulse"
              )}
            >
              <span className="text-lg" role="img" aria-hidden>
                {trade.icon}
              </span>
              <span className="flex-1 text-sm font-medium">{trade.title}</span>
              {trade.status === "failed" ? (
                <button
                  onClick={() => handleRetry(trade.tradeType)}
                  className="flex items-center gap-1 text-xs text-destructive hover:text-destructive/80"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Retry
                </button>
              ) : (
                <TradeStatusIcon status={trade.status} />
              )}
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        {allDone && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Button onClick={goNext} className="w-full" size="lg">
              View Your Scope
            </Button>
          </motion.div>
        )}

        {/* Educational tips */}
        {!allDone && (
          <div className="h-12">
            <AnimatePresence mode="wait">
              <motion.p
                key={currentTip}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="text-center text-xs text-muted-foreground"
              >
                {TIPS[currentTip]}
              </motion.p>
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

function TradeStatusIcon({ status }: { status: TradeStatus }) {
  switch (status) {
    case "pending":
      return <div className="h-5 w-5 rounded-full bg-muted" />;
    case "generating":
      return (
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
      );
    case "complete":
      return (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="flex h-5 w-5 items-center justify-center rounded-full bg-primary"
        >
          <Check className="h-3 w-3 text-primary-foreground" strokeWidth={3} />
        </motion.div>
      );
    case "failed":
      return <AlertTriangle className="h-5 w-5 text-destructive" />;
  }
}
