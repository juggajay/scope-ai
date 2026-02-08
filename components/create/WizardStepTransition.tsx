"use client";

import { AnimatePresence, motion } from "framer-motion";
import { stepVariants, ANIMATION } from "@/lib/animation-constants";

interface WizardStepTransitionProps {
  stepKey: number;
  direction: number;
  children: React.ReactNode;
}

export function WizardStepTransition({
  stepKey,
  direction,
  children,
}: WizardStepTransitionProps) {
  return (
    <AnimatePresence mode="wait" custom={direction} initial={false}>
      <motion.div
        key={stepKey}
        custom={direction}
        variants={stepVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{
          x: { duration: ANIMATION.step.duration, ease: ANIMATION.step.ease },
          opacity: { duration: ANIMATION.exit.duration, ease: "easeInOut" },
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
