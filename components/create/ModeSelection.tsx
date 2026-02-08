"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Users, HardHat } from "lucide-react";
import { useWizard } from "@/lib/wizard/WizardContext";
import { SelectableCard } from "./SelectableCard";
import { staggerContainer, staggerItem, ANIMATION } from "@/lib/animation-constants";
import type { ProjectMode } from "@/types";

const MODES: {
  id: ProjectMode;
  title: string;
  description: string;
  icon: typeof Users;
  badge?: string;
}[] = [
  {
    id: "trades",
    title: "I'll coordinate trades myself",
    description: "Get individual trade scopes to hire and manage your own tradies. Best value for hands-on homeowners.",
    icon: Users,
    badge: "76% choose this",
  },
  {
    id: "builder",
    title: "I'll hire a builder",
    description: "Get a consolidated scope for a builder to quote on. Simpler, but typically more expensive.",
    icon: HardHat,
  },
];

export function ModeSelection() {
  const { state, dispatch, goNext } = useWizard();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hide footer (auto-advance step)
  useEffect(() => {
    dispatch({ type: "SET_FOOTER", hidden: true });
  }, [dispatch]);

  const handleSelect = useCallback(
    (mode: ProjectMode) => {
      // Clear any existing timer
      if (timerRef.current) clearTimeout(timerRef.current);

      dispatch({ type: "SET_MODE", mode });

      // Auto-advance after delay
      timerRef.current = setTimeout(() => {
        goNext();
      }, ANIMATION.autoAdvance.delay);
    },
    [dispatch, goNext]
  );

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <div className="w-full max-w-lg space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            How will you manage your renovation?
          </h1>
          <p className="text-sm text-muted-foreground">
            This determines how we structure your scope documents.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 gap-3 sm:grid-cols-2"
          role="radiogroup"
          aria-label="Renovation management mode"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          {MODES.map((mode) => (
            <motion.div key={mode.id} variants={staggerItem}>
              <SelectableCard
                selected={state.mode === mode.id}
                onSelect={() => handleSelect(mode.id)}
                mode="radio"
                className="px-4 py-4"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <mode.icon className="h-7 w-7 shrink-0 text-primary" />
                    <span className="font-medium">{mode.title}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {mode.description}
                  </p>
                  {mode.badge && (
                    <span className="mt-1 inline-flex w-fit items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                      {mode.badge}
                    </span>
                  )}
                </div>
              </SelectableCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
