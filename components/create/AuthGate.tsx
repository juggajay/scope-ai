"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronLeft } from "lucide-react";
import { useMutation, useAction } from "convex/react";
import { useConvexAuth } from "convex/react";
import { identifyUser } from "@/lib/analytics";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "@/convex/_generated/api";
import { useWizard } from "@/lib/wizard/WizardContext";

export function AuthGate() {
  const { state, dispatch, goNext, goBack } = useWizard();
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const { signIn } = useAuthActions();

  const [flow, setFlow] = useState<"signUp" | "signIn">("signUp");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreatingProject, setIsCreatingProject] = useState(false);

  const createProjectFromSession = useMutation(api.projects.createProjectFromSession);
  const ensureProfile = useMutation(api.projects.ensureProfile);
  const triggerAnalysePhotos = useAction(api.ai.triggerAnalysePhotos);

  // Hide footer (this step has its own CTA)
  useEffect(() => {
    dispatch({ type: "SET_FOOTER", hidden: true });
  }, [dispatch]);

  // Create project and advance — called after auth succeeds
  const createAndAdvance = useCallback(async () => {
    // Guard: don't create duplicate project
    if (state.projectId) {
      goNext();
      return;
    }

    setIsCreatingProject(true);
    try {
      const projectId = await createProjectFromSession({
        mode: state.mode ?? "trades",
        projectType: state.projectType ?? "kitchen",
        propertySuburb: state.propertyDetails.suburb,
        propertyState: state.propertyDetails.state ?? "NSW",
        propertyType: state.propertyDetails.type ?? "house",
        propertyAge: state.propertyDetails.yearBuilt,
        description: state.description || undefined,
        answers: Object.keys(state.answers).length > 0 ? state.answers : undefined,
        sessionId: state.sessionId,
      });

      // Create profile (fire and forget — non-blocking)
      ensureProfile({
        email,
        fullName: name || undefined,
      }).catch(() => {});

      // Fire photo analysis in background (non-blocking)
      triggerAnalysePhotos({ projectId }).catch((err) =>
        console.error("Photo analysis trigger failed:", err)
      );

      dispatch({ type: "SET_PROJECT_ID", projectId });
      goNext();
    } catch (err) {
      console.error("Failed to create project:", err);
      setError("Something went wrong creating your project. Please try again.");
      setIsCreatingProject(false);
    }
  }, [
    state.projectId, state.mode, state.projectType, state.propertyDetails,
    state.description, state.answers, state.sessionId,
    createProjectFromSession, ensureProfile, triggerAnalysePhotos, dispatch, goNext, email, name,
  ]);

  // Auto-skip for already-authenticated users
  useEffect(() => {
    if (!authLoading && isAuthenticated && !isCreatingProject) {
      createAndAdvance();
    }
  }, [isAuthenticated, authLoading, isCreatingProject, createAndAdvance]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Client-side validation
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setIsSubmitting(true);
    try {
      await signIn("password", { email, password, flow });
      identifyUser(email, { email, name: name || undefined });
      // Auth state will update → useEffect triggers createAndAdvance
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      if (message.includes("already exists") || message.includes("existing")) {
        setError("An account with this email already exists. Try signing in.");
      } else if (message.includes("invalid") || message.includes("credentials") || message.includes("password")) {
        setError("Invalid email or password.");
      } else {
        setError("Something went wrong. Please try again.");
      }
      setIsSubmitting(false);
    }
  };

  // Show loading while checking auth state
  if (authLoading || (isAuthenticated && !error)) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            {isAuthenticated ? "Setting up your project..." : "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-sm space-y-6"
      >
        <button
          onClick={goBack}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to questions
        </button>

        <div className="space-y-2 text-center">
          <h2 className="text-xl font-semibold tracking-tight">
            {flow === "signUp" ? "Create a free account" : "Welcome back"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {flow === "signUp"
              ? "Sign up to generate your scope document."
              : "Sign in to continue."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {flow === "signUp" && (
            <div className="space-y-2">
              <Label htmlFor="auth-name">Name (optional)</Label>
              <Input
                id="auth-name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="auth-email">Email</Label>
            <Input
              id="auth-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="auth-password">Password</Label>
            <Input
              id="auth-password"
              type="password"
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={flow === "signUp" ? "new-password" : "current-password"}
              required
              minLength={8}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || isCreatingProject}
          >
            {isSubmitting || isCreatingProject ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isCreatingProject ? "Setting up..." : flow === "signUp" ? "Creating account..." : "Signing in..."}
              </>
            ) : (
              flow === "signUp" ? "Create Account" : "Sign In"
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          {flow === "signUp" ? (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => { setFlow("signIn"); setError(""); }}
                className="text-primary underline-offset-4 hover:underline"
              >
                Sign in
              </button>
            </>
          ) : (
            <>
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => { setFlow("signUp"); setError(""); }}
                className="text-primary underline-offset-4 hover:underline"
              >
                Sign up
              </button>
            </>
          )}
        </p>
      </motion.div>
    </div>
  );
}
