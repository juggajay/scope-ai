"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "./ScrollReveal";

export function FinalCTA() {
  return (
    <section>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
        <ScrollReveal>
          <div className="relative overflow-hidden rounded-lg border border-border bg-muted/30 px-6 py-14 text-center sm:px-12 sm:py-20">
            {/* Subtle radial gradient accent */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.04]"
              style={{
                background:
                  "radial-gradient(ellipse at center, var(--primary) 0%, transparent 70%)",
              }}
            />

            <div className="relative">
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Ready to get comparable quotes?
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
                Upload a few photos, answer some questions, and get professional
                scope documents in under 10 minutes.
              </p>

              <div className="mt-8 flex flex-col items-center gap-3">
                <Button
                  asChild
                  size="lg"
                  className="h-11 px-8 text-sm font-medium"
                >
                  <Link href="/create">
                    Start My Scope
                    <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Link>
                </Button>
                <span className="text-xs text-muted-foreground">
                  No credit card required. Free preview included.
                </span>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
