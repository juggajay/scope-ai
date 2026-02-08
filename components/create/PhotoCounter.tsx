"use client";

import { cn } from "@/lib/utils";
import { PHOTO_MIN_COUNT } from "@/lib/constants";

interface PhotoCounterProps {
  count: number;
}

export function PhotoCounter({ count }: PhotoCounterProps) {
  const met = count >= PHOTO_MIN_COUNT;

  return (
    <div className="flex items-center gap-3">
      {/* Dot indicators */}
      <div className="flex gap-1.5">
        {Array.from({ length: PHOTO_MIN_COUNT }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-2 w-2 rounded-full transition-colors",
              i < count ? "bg-primary" : "bg-muted-foreground/30"
            )}
          />
        ))}
      </div>

      {/* Text */}
      <p
        className={cn(
          "text-sm transition-colors",
          met ? "text-primary font-medium" : "text-muted-foreground"
        )}
      >
        {met
          ? `${count} photo${count !== 1 ? "s" : ""} added — nice!`
          : `${count} of ${PHOTO_MIN_COUNT} minimum`}
      </p>
    </div>
  );
}
