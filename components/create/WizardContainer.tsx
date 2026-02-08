"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useWizard } from "@/lib/wizard/WizardContext";
import { useUnsavedChangesWarning } from "@/hooks/useUnsavedChangesWarning";
import { WizardProgress } from "./WizardProgress";
import { WizardStepTransition } from "./WizardStepTransition";
import { NavigationGuard } from "./NavigationGuard";
import { ResumePrompt } from "./ResumePrompt";
import { ModeSelection } from "./ModeSelection";
import { ProjectSetup } from "./ProjectSetup";
import { PhotoUpload } from "./PhotoUpload";
import { QuestionFlow } from "./questions/QuestionFlow";
import { AuthGate } from "./AuthGate";
import { GeneratingState } from "./GeneratingState";
import { ScopePreview } from "./ScopePreview";

export function WizardContainer() {
  const { state, dispatch, goBack } = useWizard();
  const { step, direction, isRestoredSession } = state;
  const router = useRouter();
  const [showNavGuard, setShowNavGuard] = useState(false);
  const [showResume, setShowResume] = useState(false);

  // Show resume prompt on mount if session was restored
  useEffect(() => {
    if (isRestoredSession && step > 0) {
      setShowResume(true);
    }
  }, [isRestoredSession, step]);

  // URL sync via pushState
  useEffect(() => {
    const url = step > 0 ? `/create?step=${step}` : "/create";
    if (step >= 4) {
      window.history.replaceState({}, "", url);
    } else {
      window.history.pushState({ step }, "", url);
    }
  }, [step]);

  // Browser back button
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      const prevStep = e.state?.step;
      if (typeof prevStep === "number" && prevStep >= 0 && prevStep < step) {
        dispatch({ type: "SET_STEP", step: prevStep, direction: -1 });
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [step, dispatch]);

  // Warn on tab close
  useUnsavedChangesWarning(step >= 2 && !state.projectId);

  // Navigation guard for logo click
  const handleLogoClick = useCallback(
    (e: React.MouseEvent) => {
      if (step >= 2) {
        e.preventDefault();
        setShowNavGuard(true);
      }
    },
    [step]
  );

  const handleNavConfirm = () => {
    setShowNavGuard(false);
    router.push("/");
  };

  // Footer handlers
  const handleNext = () => {
    dispatch({ type: "SET_STEP", step: step + 1, direction: 1 });
  };

  const handleBack = () => {
    if (step === 0) {
      router.push("/");
    } else {
      goBack();
    }
  };

  if (showResume) {
    return (
      <div className="min-h-dvh bg-background">
        <ResumePrompt />
      </div>
    );
  }

  const stepComponent = getStepComponent(step);

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      {/* Minimal wizard header */}
      <div className="flex items-center justify-between px-4 pt-4 sm:px-6">
        <Link
          href="/"
          onClick={handleLogoClick}
          className="text-lg font-semibold tracking-tight transition-opacity hover:opacity-80"
        >
          Scope<span className="text-primary">AI</span>
          <span className="text-primary">.</span>
        </Link>
      </div>

      {/* Progress bar */}
      <div className="mx-auto w-full max-w-2xl">
        <WizardProgress />
      </div>

      {/* Step content */}
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 pb-24 pt-6 sm:px-6">
        <WizardStepTransition stepKey={step} direction={direction}>
          {stepComponent}
        </WizardStepTransition>
      </div>

      {/* Persistent footer bar */}
      {!state.footerHidden && (
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur-sm">
          <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
            <Button
              variant="ghost"
              onClick={handleBack}
              className="text-muted-foreground"
            >
              {step === 0 ? "Exit" : "Back"}
            </Button>
            <Button
              onClick={handleNext}
              disabled={state.footerDisabled}
              className="px-8"
            >
              {state.footerLabel}
            </Button>
          </div>
        </div>
      )}

      {/* Navigation guard dialog */}
      <NavigationGuard
        open={showNavGuard}
        onCancel={() => setShowNavGuard(false)}
        onConfirm={handleNavConfirm}
      />
    </div>
  );
}

function getStepComponent(step: number) {
  switch (step) {
    case 0:
      return <ModeSelection />;
    case 1:
      return <ProjectSetup />;
    case 2:
      return <PhotoUpload />;
    case 3:
      return <QuestionFlow />;
    case 4:
      return <AuthGate />;
    case 5:
      return <GeneratingState />;
    case 6:
      return <ScopePreview />;
    default:
      return <ModeSelection />;
  }
}
