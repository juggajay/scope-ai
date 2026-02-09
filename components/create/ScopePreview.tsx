"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, AlertTriangle, RotateCcw, Loader2 } from "lucide-react";
import { useWizard } from "@/lib/wizard/WizardContext";
import { useWizardAnalytics } from "@/lib/analytics";
import { TRADE_META } from "@/lib/trades";
import { PRICING_TIERS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TrustSignals } from "@/components/scope/TrustSignals";
import { useQuery, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import type { TradeType } from "@/types";

export function ScopePreview() {
  const { state, dispatch } = useWizard();
  const { trackWizardEvent } = useWizardAnalytics();
  const { projectType, propertyDetails, projectId } = state;

  const retryTradeScope = useAction(api.ai.retryTradeScope);
  const createCheckoutSession = useAction(api.stripe.createCheckoutSession);
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const [tierError, setTierError] = useState<string | null>(null);

  // Load real scope data from Convex
  const scopeData = useQuery(
    api.scopes.getScopes,
    projectId ? { projectId: projectId as Id<"projects"> } : "skip"
  );

  // Load project for generation progress (failed trades)
  const project = useQuery(
    api.projects.getProject,
    projectId ? { projectId: projectId as Id<"projects"> } : "skip"
  );

  // Configure footer
  useEffect(() => {
    dispatch({
      type: "SET_FOOTER",
      hidden: false,
      label: "Unlock Full Scope",
      disabled: false,
    });
  }, [dispatch]);

  // preview_viewed — fire when scopes load
  const loadedScopes = scopeData?.scopes ?? [];
  useEffect(() => {
    if (loadedScopes.length > 0 && projectId) {
      const totalItemCount = loadedScopes.reduce((sum, s) => {
        const count = "itemCount" in s ? (s as { itemCount: number }).itemCount : 0;
        return sum + count;
      }, 0);
      trackWizardEvent("preview_viewed", {
        tradeCount: loadedScopes.length,
        totalItemCount,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadedScopes.length, projectId]);

  if (!projectType) return null;

  const projectLabel = projectType.charAt(0).toUpperCase() + projectType.slice(1);
  const location = [propertyDetails.suburb, propertyDetails.state]
    .filter(Boolean)
    .join(", ");

  const scopes = scopeData?.scopes ?? [];
  const failedTrades = (project?.generationProgress?.failed ?? []) as string[];

  const handleRetry = async (tradeType: string) => {
    if (!projectId) return;
    try {
      await retryTradeScope({
        projectId: projectId as Id<"projects">,
        tradeType,
      });
    } catch (err) {
      console.error(`Retry failed for ${tradeType}:`, err);
    }
  };

  const handleSelectTier = async (tierId: string) => {
    if (!projectId) return;
    trackWizardEvent("pricing_tier_selected", { tierId, projectType });
    setLoadingTier(tierId);
    setTierError(null);
    try {
      const url = await createCheckoutSession({
        projectId: projectId as Id<"projects">,
        tier: tierId as "starter" | "professional" | "premium",
      });
      if (url) {
        trackWizardEvent("checkout_started", { tierId, projectType });
        window.location.href = url;
      }
    } catch (err) {
      setTierError(err instanceof Error ? err.message : "Something went wrong");
      setLoadingTier(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight">
          {projectLabel} Renovation{location ? ` — ${location}` : ""}
        </h2>
        <p className="text-sm text-muted-foreground">
          {scopes.length} trade scope{scopes.length !== 1 ? "s" : ""} generated.
          {failedTrades.length > 0 && (
            <> {failedTrades.length} failed — retry below.</>
          )}{" "}
          Unlock to access full specifications, sequencing, and PDF downloads.
        </p>
      </div>

      {/* Total item count headline */}
      {scopes.length > 0 && (
        <p className="text-center text-base font-medium">
          Your {projectLabel.toLowerCase()} renovation requires{" "}
          <span className="font-semibold text-primary">
            {scopes.reduce((sum, s) => {
              const count = "itemCount" in s ? (s as { itemCount: number }).itemCount : 0;
              return sum + count;
            }, 0)} scope items
          </span>{" "}
          across {scopes.length} trades
        </p>
      )}

      {/* Trade summary cards — real data */}
      <div className="space-y-3">
        {scopes.map((scope, i) => {
          const tradeType = scope.tradeType as TradeType;
          const meta = TRADE_META[tradeType] ?? {
            title: scope.title,
            icon: "",
          };
          // For unpaid projects, scopeData returns summary with itemCount + sampleItems
          const itemCount =
            "itemCount" in scope
              ? (scope as { itemCount: number }).itemCount
              : Array.isArray(scope.items)
                ? scope.items.length
                : 0;
          const sampleItems =
            "sampleItems" in scope
              ? (scope as { sampleItems: { item: string; specification: string }[] })
                  .sampleItems
              : [];

          return (
            <motion.div
              key={scope._id ?? tradeType}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-lg border border-border bg-card p-4"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg" role="img" aria-hidden>
                  {meta.icon}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium">{scope.title ?? meta.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {itemCount} scope item{itemCount !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              {sampleItems.length > 0 && (
                <ul className="mt-2 space-y-1 border-t border-border pt-2">
                  {sampleItems.slice(0, 2).map((item, j) => (
                    <li key={j} className="text-xs text-muted-foreground">
                      <span>· {item.item}</span>
                      {item.specification && (
                        <p className="ml-3 mt-0.5 text-[11px] text-muted-foreground/60 italic">
                          {item.specification}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          );
        })}

        {/* Show failed trades with retry */}
        {failedTrades.map((tradeType) => {
          const meta = TRADE_META[tradeType as TradeType];
          if (!meta) return null;
          return (
            <motion.div
              key={`failed-${tradeType}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4"
            >
              <span className="text-lg" role="img" aria-hidden>
                {meta.icon}
              </span>
              <div className="flex-1">
                <p className="text-sm font-medium">{meta.title}</p>
                <p className="text-xs text-destructive">
                  Failed to generate
                </p>
              </div>
              <button
                onClick={() => handleRetry(tradeType)}
                className="flex items-center gap-1 rounded-md border border-destructive/30 px-2 py-1 text-xs text-destructive hover:bg-destructive/10"
              >
                <RotateCcw className="h-3 w-3" />
                Retry
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Pricing tiers */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold tracking-tight">
          Choose your package
        </h3>

        {tierError && (
          <p className="text-sm text-destructive">{tierError}</p>
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
                    ? "border-primary bg-primary/5 ring-1 ring-primary/20 shadow-sm"
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
