"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useWizard } from "@/lib/wizard/WizardContext";
import { calculateProgress, getPhaseLabel, getPhaseIndex } from "@/lib/wizard/progress";
import { ANIMATION } from "@/lib/animation-constants";
import { cn } from "@/lib/utils";

export function WizardProgress() {
  const { state } = useWizard();
  const { step, currentQuestionIndex, totalQuestions } = state;

  const progress = calculateProgress(step, currentQuestionIndex, totalQuestions);
  const phaseLabel = getPhaseLabel(step);
  const phaseIndex = getPhaseIndex(step);
  const isGenerating = step === 5 && !state.generationComplete;

  return (
    <div className="w-full space-y-2 px-4 pt-3 sm:px-0">
      {/* Progress bar */}
      <div className="relative h-1 w-full overflow-hidden rounded-full bg-muted sm:h-1.5">
        <motion.div
          className={cn(
            "absolute inset-y-0 left-0 rounded-full bg-primary",
            isGenerating && "stripe-animation"
          )}
          initial={{ width: "5%" }}
          animate={{ width: `${progress}%` }}
          transition={ANIMATION.progress.springConfig}
        />
      </div>

      {/* Phase label + question counter */}
      <div className="flex flex-col items-center gap-0.5">
        <AnimatePresence mode="wait">
          <motion.p
            key={phaseIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="text-sm font-medium text-foreground"
          >
            {phaseLabel}
          </motion.p>
        </AnimatePresence>

        <AnimatePresence>
          {step === 3 && totalQuestions > 0 && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.15 }}
              className="text-xs text-muted-foreground"
            >
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
