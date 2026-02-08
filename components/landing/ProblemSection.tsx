"use client";

import { motion } from "framer-motion";
import { ScrollReveal } from "./ScrollReveal";

const problems = [
  {
    number: "01",
    title: "Quotes vary wildly",
    description:
      "Three tradies, three completely different line items. Without a standard scope, you're comparing apples to orangutans.",
  },
  {
    number: "02",
    title: "Hidden costs surface late",
    description:
      "Waterproofing, electrical compliance, asbestos checks — costs that aren't in the quote until they're in the invoice.",
  },
  {
    number: "03",
    title: "Trade jargon is a barrier",
    description:
      "PC sums, provisional allowances, AS/NZS references. You shouldn't need a construction degree to renovate your kitchen.",
  },
];

export function ProblemSection() {
  return (
    <section className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
        <ScrollReveal>
          <p className="text-xs font-medium uppercase tracking-widest text-primary">
            The problem
          </p>
          <h2 className="mt-3 max-w-lg text-2xl font-semibold tracking-tight sm:text-3xl">
            Renovation quoting is broken
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
            Most homeowners get quotes that can&apos;t be compared, hide
            critical costs, and use language designed for builders — not you.
          </p>
        </ScrollReveal>

        <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border bg-border sm:mt-16 md:grid-cols-3">
          {problems.map((problem, i) => (
            <ScrollReveal key={problem.number} delay={i * 0.1}>
              <motion.div
                whileHover={{ backgroundColor: "var(--muted)" }}
                transition={{ duration: 0.2 }}
                className="flex h-full flex-col bg-background p-6 sm:p-8"
              >
                <span className="font-mono text-xs text-muted-foreground">
                  {problem.number}
                </span>
                <h3 className="mt-3 text-base font-semibold tracking-tight sm:text-lg">
                  {problem.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {problem.description}
                </p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
