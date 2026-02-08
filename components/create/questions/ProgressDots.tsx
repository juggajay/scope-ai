"use client";

import { cn } from "@/lib/utils";

interface ProgressDotsProps {
  total: number;
  current: number;
  answeredUpTo: number;
  onNavigate: (index: number) => void;
}

export function ProgressDots({
  total,
  current,
  answeredUpTo,
  onNavigate,
}: ProgressDotsProps) {
  return (
    <div className="flex items-center justify-center gap-1.5" role="navigation" aria-label="Question progress">
      {Array.from({ length: total }).map((_, i) => {
        const isAnswered = i <= answeredUpTo;
        const isCurrent = i === current;

        return (
          <button
            key={i}
            onClick={() => isAnswered && onNavigate(i)}
            disabled={!isAnswered}
            className={cn(
              "h-2 w-2 rounded-full transition-all",
              isCurrent && "h-2.5 w-2.5 bg-primary",
              !isCurrent && isAnswered && "bg-primary/40 hover:bg-primary/60 cursor-pointer",
              !isCurrent && !isAnswered && "bg-muted-foreground/20 cursor-default"
            )}
            aria-label={`Question ${i + 1}${isCurrent ? " (current)" : ""}`}
            aria-current={isCurrent ? "step" : undefined}
          />
        );
      })}
    </div>
  );
}
