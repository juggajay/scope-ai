// =============================================================================
// Wizard Progress Calculation
// =============================================================================

import type { ProjectType } from "@/types";

const PROGRESS_WEIGHTS = {
  initial: 5,
  modeSelection: 15,
  projectSetup: 30,
  photoUpload: 45,
  questionsStart: 45,
  questionsEnd: 75,
  authGate: 80,
  generationStart: 80,
  generationEnd: 95,
  preview: 100,
} as const;

const PHASE_LABELS = ["Your Project", "Your Space", "Your Plans", "Your Scope"] as const;

const STEP_TO_PHASE: Record<number, number> = {
  0: 0,
  1: 0,
  2: 1,
  3: 2,
  4: 3,
  5: 3,
  6: 3,
};

export function getPhaseLabel(step: number): string {
  const phaseIndex = STEP_TO_PHASE[step] ?? 0;
  return PHASE_LABELS[phaseIndex];
}

export function getPhaseIndex(step: number): number {
  return STEP_TO_PHASE[step] ?? 0;
}

export function calculateProgress(
  step: number,
  questionIndex?: number,
  totalQuestions?: number,
  completedTrades?: number,
  totalTrades?: number,
): number {
  switch (step) {
    case 0:
      return PROGRESS_WEIGHTS.initial;
    case 1:
      return PROGRESS_WEIGHTS.modeSelection;
    case 2:
      return PROGRESS_WEIGHTS.projectSetup;
    case 3: {
      if (totalQuestions && totalQuestions > 0 && questionIndex !== undefined) {
        const range = PROGRESS_WEIGHTS.questionsEnd - PROGRESS_WEIGHTS.questionsStart;
        const perQuestion = range / totalQuestions;
        return PROGRESS_WEIGHTS.questionsStart + perQuestion * (questionIndex + 1);
      }
      return PROGRESS_WEIGHTS.photoUpload;
    }
    case 4:
      return PROGRESS_WEIGHTS.authGate;
    case 5: {
      if (totalTrades && totalTrades > 0 && completedTrades !== undefined) {
        const range = PROGRESS_WEIGHTS.generationEnd - PROGRESS_WEIGHTS.generationStart;
        const perTrade = range / totalTrades;
        return PROGRESS_WEIGHTS.generationStart + perTrade * completedTrades;
      }
      return PROGRESS_WEIGHTS.generationStart;
    }
    case 6:
      return PROGRESS_WEIGHTS.preview;
    default:
      return PROGRESS_WEIGHTS.initial;
  }
}
