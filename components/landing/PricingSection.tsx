"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PRICING_TIERS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ScrollReveal } from "./ScrollReveal";

export function PricingSection() {
  return (
    <section id="pricing">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
        <ScrollReveal>
          <div className="text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-primary">
              Pricing
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
              One scope, one price. No subscriptions.
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
              Generate your scope for free. Only pay when you&apos;re ready to
              unlock the full specifications.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:mt-16 md:grid-cols-3">
          {PRICING_TIERS.map((tier, i) => (
            <ScrollReveal key={tier.id} delay={i * 0.1}>
              <div
                className={cn(
                  "relative flex h-full flex-col rounded-lg border p-6 sm:p-7",
                  tier.recommended
                    ? "border-primary/40 bg-primary/[0.03] shadow-sm ring-1 ring-primary/10"
                    : "border-border bg-background"
                )}
              >
                {tier.recommended && (
                  <span className="absolute -top-3 left-5 rounded-full bg-primary px-3 py-0.5 text-[10px] font-semibold text-primary-foreground">
                    Most Popular
                  </span>
                )}

                <div>
                  <p className="text-sm font-semibold">{tier.name}</p>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-3xl font-bold tracking-tight">
                      {tier.displayPrice}
                    </span>
                    <span className="text-xs text-muted-foreground">AUD</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {tier.description}
                  </p>
                </div>

                <div className="my-5 h-px bg-border" />

                <ul className="flex-1 space-y-2.5">
                  {tier.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-xs text-muted-foreground"
                    >
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  className="mt-6 w-full"
                  variant={tier.recommended ? "default" : "outline"}
                  size="sm"
                >
                  <Link href="/create">Start My Scope</Link>
                </Button>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
