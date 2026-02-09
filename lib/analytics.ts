import posthog from "posthog-js";
import { useWizard } from "@/lib/wizard/WizardContext";
import { useCallback } from "react";

// ---------------------------------------------------------------------------
// Standalone event tracker — safe to call anywhere
// ---------------------------------------------------------------------------

export function trackEvent(
  name: string,
  props?: Record<string, unknown>
): void {
  try {
    if (typeof window === "undefined") return;
    if (!posthog.__loaded) return;
    posthog.capture(name, props);
  } catch {
    // Graceful no-op: ad-blockers, missing env vars, SSR
  }
}

// ---------------------------------------------------------------------------
// Identify user (call once after auth)
// ---------------------------------------------------------------------------

export function identifyUser(userId: string, traits?: Record<string, unknown>): void {
  try {
    if (typeof window === "undefined") return;
    if (!posthog.__loaded) return;
    posthog.identify(userId, traits);
  } catch {
    // Graceful no-op
  }
}

// ---------------------------------------------------------------------------
// Wizard-scoped analytics hook — auto-merges wizard context
// Only use inside components wrapped by WizardProvider
// ---------------------------------------------------------------------------

export function useWizardAnalytics() {
  const { state } = useWizard();

  const trackWizardEvent = useCallback(
    (name: string, extraProps?: Record<string, unknown>) => {
      trackEvent(name, {
        sessionId: state.sessionId,
        step: state.step,
        mode: state.mode,
        projectType: state.projectType,
        projectId: state.projectId,
        ...extraProps,
      });
    },
    [state.sessionId, state.step, state.mode, state.projectType, state.projectId]
  );

  return { trackWizardEvent };
}
