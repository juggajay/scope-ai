"use client";

import { motion } from "framer-motion";
import { Check, Shield } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";

const sampleItems = [
  {
    id: "elec-001",
    category: "Circuits",
    item: "New dedicated circuit for wall oven",
    spec: "32A circuit, 6mm² cable, isolator at appliance",
    compliance: "AS/NZS 3000",
  },
  {
    id: "elec-002",
    category: "Circuits",
    item: "New dedicated circuit for induction cooktop",
    spec: "32A circuit, 6mm² cable, dedicated RCD protection",
    compliance: "AS/NZS 3000",
  },
  {
    id: "elec-003",
    category: "Lighting",
    item: "LED downlight installation",
    spec: "6x IC-4 rated LED downlights, dimmable, 3000K warm white",
  },
  {
    id: "elec-004",
    category: "Power",
    item: "Relocated and additional power points",
    spec: "4x double GPOs above benchtop at 300mm centres, 1x double GPO at island",
    compliance: "AS/NZS 3000",
  },
];

export function SampleOutput() {
  return (
    <section className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left — Description */}
          <ScrollReveal>
            <div className="lg:sticky lg:top-24">
              <p className="text-xs font-medium uppercase tracking-widest text-primary">
                What you get
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                Professional scope documents, not generic checklists
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                Each trade receives its own scope with line-item specifications,
                Australian Standards references, and provisional cost sums.
                Tradies quote against the same spec — so every quote is
                comparable.
              </p>

              <ul className="mt-6 space-y-3">
                {[
                  "Detailed specifications for every item",
                  "Australian Standards compliance notes",
                  "Sequencing plan with trade coordination",
                  "PDF downloads for each trade",
                ].map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2.5 text-sm text-muted-foreground"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          {/* Right — Scope mockup */}
          <ScrollReveal delay={0.15}>
            <div className="overflow-hidden rounded-lg border border-border bg-background shadow-sm">
              {/* Document header */}
              <div className="border-b border-border px-5 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Scope of Works
                    </p>
                    <p className="mt-0.5 text-sm font-semibold">Electrical</p>
                  </div>
                  <span className="flex items-center gap-1.5 rounded-md bg-muted px-2.5 py-1 text-[10px] font-medium text-muted-foreground">
                    <Shield className="h-3 w-3" />4 items
                  </span>
                </div>
              </div>

              {/* Scope items */}
              <div className="divide-y divide-border">
                {sampleItems.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.08 }}
                    className="px-5 py-3.5 sm:px-6"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] text-muted-foreground">
                            {item.id}
                          </span>
                          <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                            {item.category}
                          </span>
                        </div>
                        <p className="mt-1 text-sm font-medium">{item.item}</p>
                        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                          {item.spec}
                        </p>
                      </div>
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded border border-primary bg-primary/10">
                        <Check className="h-3 w-3 text-primary" />
                      </div>
                    </div>
                    {item.compliance && (
                      <p className="mt-1.5 flex items-center gap-1 text-[10px] text-primary/80">
                        <Shield className="h-2.5 w-2.5" />
                        {item.compliance}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Document footer hint */}
              <div className="border-t border-border bg-muted/30 px-5 py-3 sm:px-6">
                <p className="text-center text-[10px] text-muted-foreground">
                  Sample excerpt — full scopes include exclusions, PC sums, and
                  notes
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
