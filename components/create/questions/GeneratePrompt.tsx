"use client";

import { motion } from "framer-motion";
import { Camera, MessageSquare, Wrench } from "lucide-react";
import type { ProjectType, QuestionAnswers } from "@/types";
import { determineRequiredTrades, TRADE_META } from "@/lib/trades";

interface GeneratePromptProps {
  projectType: ProjectType;
  photoCount: number;
  answeredCount: number;
  answers: QuestionAnswers;
}

export function GeneratePrompt({
  projectType,
  photoCount,
  answeredCount,
  answers,
}: GeneratePromptProps) {
  const { trades } = determineRequiredTrades(projectType, answers);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-1 flex-col items-center justify-center"
    >
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h2 className="text-xl font-semibold tracking-tight">
            Ready to generate your scope
          </h2>
          <p className="text-sm text-muted-foreground">
            Here&apos;s what we&apos;ll use to build your scope documents.
          </p>
        </div>

        <div className="space-y-3 rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-3 text-sm">
            <Camera className="h-4 w-4 text-primary" />
            <span>
              {photoCount} photo{photoCount !== 1 ? "s" : ""} uploaded
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <MessageSquare className="h-4 w-4 text-primary" />
            <span>{answeredCount} questions answered</span>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <Wrench className="mt-0.5 h-4 w-4 text-primary" />
            <div>
              <span>{trades.length} trades identified:</span>
              <p className="mt-0.5 text-muted-foreground">
                {trades.map((t) => TRADE_META[t].title).join(", ")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
