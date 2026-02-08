"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { ANIMATION } from "@/lib/animation-constants";

interface SelectableCardProps {
  selected: boolean;
  onSelect: () => void;
  mode: "radio" | "checkbox";
  disabled?: boolean;
  isEscape?: boolean;
  children: React.ReactNode;
  className?: string;
  role?: string;
}

export function SelectableCard({
  selected,
  onSelect,
  mode,
  disabled = false,
  isEscape = false,
  children,
  className,
  ...props
}: SelectableCardProps) {
  const handleClick = () => {
    if (disabled) return;
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(10);
    }
    onSelect();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect();
    }
  };

  return (
    <motion.div
      role={mode === "radio" ? "radio" : "checkbox"}
      aria-checked={selected}
      tabIndex={disabled ? -1 : 0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      whileTap={disabled ? undefined : { scale: ANIMATION.card.tapScale }}
      transition={ANIMATION.card.springConfig}
      className={cn(
        "relative flex cursor-pointer items-center gap-3 rounded-lg px-4 py-3 transition-colors",
        "min-h-[56px]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        // Default state
        !selected && !isEscape && "border-2 border-transparent bg-card text-card-foreground",
        !selected && isEscape && "border-2 border-dashed border-border bg-card text-muted-foreground",
        // Hover
        !selected && !disabled && "hover:border-primary/50 hover:bg-accent/5",
        // Selected
        selected && "border-2 border-primary bg-primary/5 ring-1 ring-primary/20 shadow-sm text-foreground",
        // Disabled
        disabled && "opacity-50 cursor-not-allowed pointer-events-none",
        className
      )}
      {...props}
    >
      <div className="flex-1">{children}</div>
      <SelectionIndicator mode={mode} selected={selected} />
    </motion.div>
  );
}

function SelectionIndicator({
  mode,
  selected,
}: {
  mode: "radio" | "checkbox";
  selected: boolean;
}) {
  if (mode === "radio") {
    return (
      <div
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
          selected ? "border-primary bg-primary" : "border-muted-foreground/40"
        )}
      >
        {selected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={ANIMATION.card.springConfig}
            className="h-2 w-2 rounded-full bg-primary-foreground"
          />
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors",
        selected ? "border-primary bg-primary" : "border-muted-foreground/40"
      )}
    >
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={ANIMATION.card.springConfig}
        >
          <Check className="h-3.5 w-3.5 text-primary-foreground" strokeWidth={3} />
        </motion.div>
      )}
    </div>
  );
}
