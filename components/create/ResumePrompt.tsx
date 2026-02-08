"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useWizard, isSessionStale, clearWizardStorage } from "@/lib/wizard/WizardContext";
import { PROJECT_TYPES } from "@/lib/constants";
import { getPhaseLabel } from "@/lib/wizard/progress";

export function ResumePrompt() {
  const { state, dispatch, goToStep } = useWizard();
  const stale = isSessionStale(state.savedAt);

  const projectLabel =
    PROJECT_TYPES.find((p) => p.id === state.projectType)?.label ?? "your";
  const stepLabel = getPhaseLabel(state.step);

  const timeAgo = state.savedAt
    ? formatTimeAgo(Date.now() - state.savedAt)
    : null;

  const handleContinue = () => {
    dispatch({
      type: "SET_STEP",
      step: state.step,
      direction: 1,
    });
    // Mark as no longer a restored session by going to the saved step
  };

  const handleStartFresh = () => {
    clearWizardStorage();
    dispatch({ type: "RESET" });
  };

  return (
    <div className="flex min-h-[80dvh] items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md space-y-6 rounded-lg border border-border bg-card p-6 shadow-sm"
      >
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">
            {stale ? "Welcome back!" : "Welcome back!"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {stale && timeAgo
              ? `You started a ${projectLabel.toLowerCase()} renovation scope ${timeAgo}. Would you like to continue or start fresh?`
              : `You were working on a ${projectLabel.toLowerCase()} renovation scope — "${stepLabel}".`}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Button onClick={handleContinue} className="w-full">
            Continue where I left off
          </Button>
          <Button
            variant="ghost"
            onClick={handleStartFresh}
            className="w-full text-muted-foreground"
          >
            Start a new scope
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

function formatTimeAgo(ms: number): string {
  const hours = Math.floor(ms / (1000 * 60 * 60));
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days !== 1 ? "s" : ""} ago`;
}
