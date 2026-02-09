"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useWizard } from "@/lib/wizard/WizardContext";
import { useWizardAnalytics } from "@/lib/analytics";
import { getQuestionsForProject } from "@/lib/questions";
import { questionVariants, ANIMATION } from "@/lib/animation-constants";
import { QuestionIntro } from "./QuestionIntro";
import { QuestionCard } from "./QuestionCard";
import { ProgressDots } from "./ProgressDots";
import { GeneratePrompt } from "./GeneratePrompt";

type Phase = "intro" | "questions" | "confirm";

export function QuestionFlow() {
  const { state, dispatch, goNext, setFooterOnNext } = useWizard();
  const { trackWizardEvent } = useWizardAnalytics();
  const { projectType, answers, photos, mode } = state;

  const allQuestions = projectType ? getQuestionsForProject(projectType) : [];
  // Filter out mode-only questions that don't match
  const questions = allQuestions.filter(
    (q) => !q.modeOnly || q.modeOnly === mode
  );
  const total = questions.length;

  const [phase, setPhase] = useState<Phase>("intro");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentQuestion = questions[questionIndex];
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;

  // Track highest answered question for dot navigation
  const [highestAnswered, setHighestAnswered] = useState(-1);

  // Update question index in wizard context for progress bar
  useEffect(() => {
    if (phase === "questions") {
      dispatch({
        type: "SET_QUESTION_INDEX",
        index: questionIndex,
        total,
      });
    }
  }, [phase, questionIndex, total, dispatch]);

  // Configure footer based on current state
  useEffect(() => {
    if (phase === "intro") {
      dispatch({ type: "SET_FOOTER", hidden: true });
    } else if (phase === "confirm") {
      dispatch({
        type: "SET_FOOTER",
        hidden: false,
        label: "Generate My Scope",
        disabled: false,
      });
    } else if (phase === "questions" && currentQuestion) {
      if (currentQuestion.multiSelect) {
        const hasAnswer =
          Array.isArray(currentAnswer) && currentAnswer.length > 0;
        dispatch({
          type: "SET_FOOTER",
          hidden: false,
          label: "Continue",
          disabled: !hasAnswer,
        });
      } else {
        // Single-select: auto-advance, hide footer (back-only)
        dispatch({ type: "SET_FOOTER", hidden: true });
      }
    }
  }, [phase, questionIndex, currentQuestion, currentAnswer, dispatch]);

  // Auto-advance on single-select
  const handleAnswer = useCallback(
    (answer: string | string[]) => {
      if (!currentQuestion) return;
      dispatch({
        type: "SET_ANSWER",
        questionId: currentQuestion.id,
        answer,
      });

      trackWizardEvent("question_answered", {
        questionId: currentQuestion.id,
        answer,
        isNotSure: answer === "Not sure" || answer === "not_sure",
        autoAdvanced: !currentQuestion.multiSelect && typeof answer === "string",
        questionIndex: questionIndex,
        totalQuestions: total,
      });

      if (!currentQuestion.multiSelect && typeof answer === "string") {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          advanceToNext();
        }, ANIMATION.autoAdvance.delay);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentQuestion, questionIndex, total, dispatch]
  );

  const advanceToNext = useCallback(() => {
    setHighestAnswered((prev) => Math.max(prev, questionIndex));
    if (questionIndex < total - 1) {
      setDirection(1);
      setQuestionIndex((i) => i + 1);
    } else {
      setPhase("confirm");
    }
  }, [questionIndex, total]);

  const goToPrev = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (questionIndex > 0) {
      setDirection(-1);
      setQuestionIndex((i) => i - 1);
    }
  }, [questionIndex]);

  const navigateToQuestion = useCallback(
    (index: number) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      setDirection(index > questionIndex ? 1 : -1);
      setQuestionIndex(index);
    },
    [questionIndex]
  );

  // Override footer "Continue" to advance within questions (not wizard step)
  useEffect(() => {
    if (phase === "questions" && currentQuestion?.multiSelect) {
      setFooterOnNext(advanceToNext);
    } else {
      setFooterOnNext(null);
    }
  }, [phase, currentQuestion?.multiSelect, advanceToNext, setFooterOnNext]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      setFooterOnNext(null);
    };
  }, [setFooterOnNext]);

  // Handle footer Continue for multi-select questions
  // We intercept the wizard's goNext by managing our own flow
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (phase !== "questions") return;
      if (e.key === "ArrowLeft" || e.key === "Backspace") {
        goToPrev();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [phase, goToPrev]);

  if (!projectType) return null;

  if (phase === "intro") {
    return (
      <QuestionIntro
        projectType={projectType}
        questionCount={total}
        onStart={() => setPhase("questions")}
      />
    );
  }

  if (phase === "confirm") {
    return (
      <GeneratePrompt
        projectType={projectType}
        photoCount={photos.filter((p) => p.status === "complete").length}
        answeredCount={Object.keys(answers).length}
        answers={answers}
      />
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      {/* Progress dots */}
      <div className="mb-6">
        <ProgressDots
          total={total}
          current={questionIndex}
          answeredUpTo={highestAnswered}
          onNavigate={navigateToQuestion}
        />
      </div>

      {/* Question with slide transition */}
      <div className="flex-1">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={questionIndex}
            custom={direction}
            variants={questionVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={ANIMATION.question.springConfig}
          >
            {currentQuestion && (
              <QuestionCard
                question={currentQuestion}
                currentAnswer={currentAnswer}
                onAnswer={handleAnswer}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Back button for questions (visible when not first question) */}
      {questionIndex > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur-sm md:hidden">
          <div className="mx-auto flex max-w-2xl px-4 py-3">
            <button
              onClick={goToPrev}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              &larr; Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
