"use client";

import { Camera, MessageCircleQuestion, FileText } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";

const steps = [
  {
    step: "1",
    icon: Camera,
    title: "Upload photos",
    description:
      "Snap a few photos of the space you want to renovate. Our AI analyses the existing layout, fixtures, and condition.",
  },
  {
    step: "2",
    icon: MessageCircleQuestion,
    title: "Answer guided questions",
    description:
      "Tell us what you want — layout changes, materials, finishes. Plain language, no jargon required.",
  },
  {
    step: "3",
    icon: FileText,
    title: "Get your scopes",
    description:
      "Receive professional, trade-specific scope documents with detailed specifications, compliance notes, and a sequencing plan.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
        <ScrollReveal>
          <div className="text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-primary">
              How it works
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
              Three steps to comparable quotes
            </h2>
          </div>
        </ScrollReveal>

        <div className="relative mt-12 grid grid-cols-1 gap-8 sm:mt-16 md:grid-cols-3 md:gap-12">
          {/* Connector line (desktop only) */}
          <div className="absolute left-0 right-0 top-10 hidden h-px bg-border md:block" />

          {steps.map((step, i) => (
            <ScrollReveal key={step.step} delay={i * 0.12}>
              <div className="relative flex flex-col items-center text-center">
                {/* Step number + icon */}
                <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-lg border border-border bg-background">
                  <step.icon className="h-7 w-7 text-foreground" strokeWidth={1.5} />
                </div>
                <span className="mt-1 font-mono text-[10px] text-muted-foreground">
                  Step {step.step}
                </span>

                <h3 className="mt-4 text-base font-semibold tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
