"use client";

import { motion } from "framer-motion";
import { PROJECT_TYPES } from "@/lib/constants";
import type { ProjectType } from "@/types";

interface QuestionIntroProps {
  projectType: ProjectType;
  questionCount: number;
  onStart: () => void;
}

export function QuestionIntro({
  projectType,
  questionCount,
  onStart,
}: QuestionIntroProps) {
  const projectLabel =
    PROJECT_TYPES.find((p) => p.id === projectType)?.label?.toLowerCase() ?? "space";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-1 flex-col items-center justify-center text-center"
    >
      <div className="max-w-sm space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">
          {questionCount} quick questions about your {projectLabel}
        </h2>
        <p className="text-sm text-muted-foreground">
          Most people finish in under 2 minutes. Your answers help us generate
          accurate, trade-specific scopes.
        </p>
        <button
          onClick={onStart}
          className="mt-4 text-sm font-medium text-primary transition-colors hover:text-primary/80"
        >
          Let&apos;s go &rarr;
        </button>
      </div>
    </motion.div>
  );
}
