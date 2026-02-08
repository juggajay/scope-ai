"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProjectType } from "@/types";

const TIPS: Record<ProjectType, string[]> = {
  kitchen: [
    "Capture the full kitchen from the doorway",
    "Close-ups of benchtops, splashback, and cabinetry",
    "Photo of the cooktop and rangehood area",
    "Show any walls you might remove or modify",
  ],
  bathroom: [
    "Full bathroom shot from the doorway",
    "Close-ups of shower, vanity, and toilet areas",
    "Show the flooring and any existing tiling",
    "Capture the ceiling (for exhaust fan location)",
  ],
  laundry: [
    "Full room shot showing layout",
    "Close-up of plumbing connections",
    "Show existing cabinetry and bench space",
  ],
  living: [
    "Wide shot of the full living area",
    "Show any walls being removed or modified",
    "Close-ups of flooring, skirting, and cornices",
    "Capture lighting and power point locations",
  ],
  outdoor: [
    "Overview of the full outdoor area",
    "Close-ups of existing decking or paving",
    "Show the connection point to the house",
    "Capture any drainage or slope issues",
  ],
};

interface PhotoTipsProps {
  projectType: ProjectType;
  hasPhotos: boolean;
}

export function PhotoTips({ projectType, hasPhotos }: PhotoTipsProps) {
  const [open, setOpen] = useState(!hasPhotos);
  const tips = TIPS[projectType] || TIPS.kitchen;

  return (
    <div className="rounded-lg border border-border bg-card">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <div className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">Photo tips</span>
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <ul className="space-y-1.5 px-4 pb-3 text-sm text-muted-foreground">
              {tips.map((tip) => (
                <li key={tip} className="flex gap-2">
                  <span className="text-primary">·</span>
                  {tip}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
