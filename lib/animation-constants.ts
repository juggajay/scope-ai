// =============================================================================
// ScopeAI — Animation Constants
// =============================================================================
// Single source of truth for all wizard animation timings, easings, and springs.
// Derived from RESEARCH-wizard-implementation-spec.md Section 3.3.
// =============================================================================

export const ANIMATION = {
  step: {
    duration: 0.25,
    slideDistance: 60,
    ease: [0.4, 0.0, 0.2, 1.0] as const,
  },
  card: {
    tapScale: 0.97,
    hoverScale: 1.02,
    borderDuration: 0.15,
    springConfig: { type: "spring" as const, stiffness: 500, damping: 30, mass: 0.8 },
  },
  stagger: {
    delayChildren: 0.05,
    staggerChildren: 0.04,
  },
  progress: {
    springConfig: { type: "spring" as const, stiffness: 50, damping: 15 },
  },
  exit: {
    duration: 0.2,
    ease: [0.4, 0.0, 1.0, 1.0] as const,
  },
  autoAdvance: {
    delay: 600,
  },
  question: {
    slideDistance: 40,
    springConfig: { type: "spring" as const, stiffness: 300, damping: 30 },
  },
} as const;

export const stepVariants = {
  enter: (direction: number) => ({
    x: direction * ANIMATION.step.slideDistance,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: -direction * ANIMATION.step.slideDistance,
    opacity: 0,
  }),
};

export const questionVariants = {
  enter: (direction: number) => ({
    x: direction * ANIMATION.question.slideDistance,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: -direction * ANIMATION.question.slideDistance,
    opacity: 0,
  }),
};

export const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      delayChildren: ANIMATION.stagger.delayChildren,
      staggerChildren: ANIMATION.stagger.staggerChildren,
    },
  },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};
