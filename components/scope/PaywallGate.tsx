"use client";

import { useState, useEffect } from "react";
import { Check, Lock, Loader2 } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { TrustSignals } from "@/components/scope/TrustSignals";
import { PRICING_TIERS } from "@/lib/constants";
import { TRADE_META } from "@/lib/trades";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import type { TradeType } from "@/types";

interface ScopeSummary {
  tradeType: string;
  title: string;
  itemCount: number;
  sampleItems: { item: string; specification: string }[];
}

interface PaywallGateProps {
  projectId: string;
  projectType: string;
  suburb?: string;
  state?: string;
  scopes: ScopeSummary[];
}

export function PaywallGate({
  projectId,
  projectType,
  suburb,
  state,
  scopes,
}: PaywallGateProps) {
  const createCheckoutSession = useAction(api.stripe.createCheckoutSession);
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const label = projectType.charAt(0).toUpperCase() + projectType.slice(1);
  const location = [suburb, state].filter(Boolean).join(", ");

  // preview_viewed
  useEffect(() => {
    if (scopes.length > 0) {
      trackEvent("preview_viewed", {
        projectId,
        projectType,
        tradeCount: scopes.length,
        totalItemCount: scopes.reduce((sum, s) => sum + s.itemCount, 0),
      });
    }
  }, [projectId, projectType, scopes]);

  const handleSelectTier = async (tierId: string) => {
    trackEvent("pricing_tier_selected", { tierId, projectType, projectId });
    setLoadingTier(tierId);
    setError(null);
    try {
      const url = await createCheckoutSession({
        projectId: projectId as Id<"projects">,
        tier: tierId as "starter" | "professional" | "premium",
      });
      if (url) {
        trackEvent("checkout_started", { tierId, projectType, projectId });
        window.location.href = url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoadingTier(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          {label} Renovation Scope
        </h1>
        {location && (
          <p className="text-sm text-muted-foreground">{location}</p>
        )}
        <p className="text-sm text-muted-foreground">
          {scopes.length} trade scope{scopes.length !== 1 ? "s" : ""} ready.
          Unlock to access full specifications, toggle items, and download PDFs.
        </p>
      </div>

      {/* Total item count headline */}
      {scopes.length > 0 && (
        <p className="text-center text-base font-medium">
          Your {label.toLowerCase()} renovation requires{" "}
          <span className="font-semibold text-primary">
            {scopes.reduce((sum, s) => sum + s.itemCount, 0)} scope items
          </span>{" "}
          across {scopes.length} trades
        </p>
      )}

      {/* Trade summary cards */}
      <div className="space-y-3">
        {scopes.map((scope) => {
          const meta = TRADE_META[scope.tradeType as TradeType];
          return (
            <div
              key={scope.tradeType}
              className="rounded-lg border border-border bg-card p-4"
            >
              <div className="flex items-center gap-3">
                {meta && (
                  <span className="text-lg" role="img" aria-hidden>
                    {meta.icon}
                  </span>
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {scope.title || meta?.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {scope.itemCount} scope item
                    {scope.itemCount !== 1 ? "s" : ""}
                  </p>
                </div>
                <Lock className="h-4 w-4 text-muted-foreground" />
              </div>
              {scope.sampleItems.length > 0 && (
                <ul className="mt-2 space-y-1 border-t border-border pt-2">
                  {scope.sampleItems.slice(0, 1).map((item, j) => (
                    <li key={j} className="text-xs text-muted-foreground">
                      <span>&middot; {item.item}</span>
                      {item.specification && (
                        <p className="ml-3 mt-0.5 text-[11px] text-muted-foreground/60 italic">
                          {item.specification}
                        </p>
                      )}
                    </li>
                  ))}
                  <li className="text-xs text-muted-foreground/60 italic">
                    + {scope.itemCount - 1} more items
                  </li>
                </ul>
              )}
            </div>
          );
        })}
      </div>

      {/* Pricing tiers */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">
          Choose your package
        </h2>

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {PRICING_TIERS.map((tier) => {
            const isLoading = loadingTier === tier.id;
            return (
              <div
                key={tier.id}
                className={cn(
                  "relative flex flex-col rounded-lg border p-5",
                  tier.recommended
                    ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/20"
                    : "border-border bg-card"
                )}
              >
                {tier.recommended && (
                  <span className="absolute -top-3 left-4 rounded-full bg-primary px-3 py-0.5 text-xs font-medium text-primary-foreground">
                    Most Popular
                  </span>
                )}

                <div className="space-y-1">
                  <p className="font-semibold">{tier.name}</p>
                  <p className="text-2xl font-bold">{tier.displayPrice}</p>
                  <p className="text-xs text-muted-foreground">
                    {tier.description}
                  </p>
                </div>

                <ul className="mt-4 flex-1 space-y-2">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-xs">
                      <Check className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="mt-4 w-full"
                  variant={tier.recommended ? "default" : "outline"}
                  size="sm"
                  disabled={!!loadingTier}
                  onClick={() => handleSelectTier(tier.id)}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    `Select ${tier.name}`
                  )}
                </Button>
              </div>
            );
          })}
        </div>
        <TrustSignals />
      </div>
    </div>
  );
}
