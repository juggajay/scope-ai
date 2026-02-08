"use client";

import { motion } from "framer-motion";
import { SelectableCard } from "../SelectableCard";
import { WhyTooltip } from "./WhyTooltip";
import { staggerContainer, staggerItem } from "@/lib/animation-constants";
import type { Question } from "@/types";

interface QuestionCardProps {
  question: Question;
  currentAnswer: string | string[] | undefined;
  onAnswer: (answer: string | string[]) => void;
}

export function QuestionCard({
  question,
  currentAnswer,
  onAnswer,
}: QuestionCardProps) {
  const isMulti = question.multiSelect;

  const handleSelect = (label: string) => {
    if (isMulti) {
      const current = Array.isArray(currentAnswer) ? currentAnswer : [];
      const next = current.includes(label)
        ? current.filter((a) => a !== label)
        : [...current, label];
      onAnswer(next);
    } else {
      onAnswer(label);
    }
  };

  const isSelected = (label: string) => {
    if (isMulti) {
      return Array.isArray(currentAnswer) && currentAnswer.includes(label);
    }
    return currentAnswer === label;
  };

  const isEscape = (label: string) => {
    const lower = label.toLowerCase();
    return lower.includes("not sure") || lower.includes("not decided");
  };

  return (
    <div className="space-y-4">
      {/* Question heading + why tooltip */}
      <div className="flex items-start gap-2">
        <h3 className="text-lg font-semibold">{question.question}</h3>
        {question.why && <WhyTooltip text={question.why} />}
      </div>

      {isMulti && (
        <p className="text-sm text-muted-foreground">Select all that apply</p>
      )}

      {/* Options */}
      <motion.div
        className="flex flex-col gap-3"
        role={isMulti ? "group" : "radiogroup"}
        aria-label={question.question}
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        {question.options.map((option) => (
          <motion.div key={option.label} variants={staggerItem}>
            <SelectableCard
              selected={isSelected(option.label)}
              onSelect={() => handleSelect(option.label)}
              mode={isMulti ? "checkbox" : "radio"}
              isEscape={isEscape(option.label)}
            >
              <div>
                <p className="text-sm font-medium">{option.label}</p>
                {option.description && (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {option.description}
                  </p>
                )}
              </div>
            </SelectableCard>
          </motion.div>
        ))}
      </motion.div>

      {/* Screen reader announcement */}
      <div aria-live="polite" className="sr-only">
        {question.question}
      </div>
    </div>
  );
}
