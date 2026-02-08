"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info } from "lucide-react";

interface WhyTooltipProps {
  text: string;
}

export function WhyTooltip({ text }: WhyTooltipProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="inline-flex flex-col">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
        aria-expanded={open}
        aria-label="Why we ask this"
      >
        <Info className="h-4 w-4" />
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
            <p className="mt-2 text-sm text-muted-foreground">{text}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
