"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { ScopeSkeleton } from "@/components/scope/ScopeSkeleton";
import { ScopeViewShell } from "@/components/scope/ScopeViewShell";
import { PaywallGate } from "@/components/scope/PaywallGate";
import { Loader2 } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export default function ScopeViewPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const projectId = params.projectId as string;
  const sessionId = searchParams.get("session_id");

  const project = useQuery(
    api.projects.getProject,
    isAuthenticated ? { projectId: projectId as Id<"projects"> } : "skip"
  );

  const scopeData = useQuery(
    api.scopes.getScopes,
    isAuthenticated ? { projectId: projectId as Id<"projects"> } : "skip"
  );

  const sequencing = useQuery(
    api.scopes.getSequencingPlan,
    isAuthenticated ? { projectId: projectId as Id<"projects"> } : "skip"
  );

  const coordination = useQuery(
    api.scopes.getCoordinationChecklist,
    isAuthenticated ? { projectId: projectId as Id<"projects"> } : "skip"
  );

  // Redirect if project not found or not owned
  useEffect(() => {
    if (!authLoading && isAuthenticated && project === null) {
      router.replace("/");
    }
  }, [authLoading, isAuthenticated, project, router]);

  // payment_completed — fire once per project when paid
  useEffect(() => {
    if (project?.status !== "paid") return;
    const key = `scopeai_payment_tracked_${projectId}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    trackEvent("payment_completed", {
      projectId,
      projectType: project.projectType,
    });
  }, [project?.status, project?.projectType, projectId]);

  // Loading state
  if (authLoading || project === undefined || scopeData === undefined) {
    return <ScopeSkeleton />;
  }

  // Project not found — already redirecting
  if (project === null) {
    return <ScopeSkeleton />;
  }

  const isPaid = project.status === "paid";
  const scopes = scopeData?.scopes ?? [];

  // Returning from Stripe but webhook hasn't fired yet
  if (sessionId && !isPaid) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">
          Confirming your payment...
        </p>
      </div>
    );
  }

  // Unpaid — show paywall gate
  if (!isPaid) {
    const summaryScopes = scopes.map((s) => ({
      tradeType: "tradeType" in s ? (s.tradeType as string) : "",
      title: "title" in s ? (s.title as string) : "",
      itemCount: "itemCount" in s ? (s.itemCount as number) : 0,
      sampleItems:
        "sampleItems" in s
          ? (s.sampleItems as { item: string; specification: string }[])
          : [],
    }));

    return (
      <PaywallGate
        projectId={projectId}
        projectType={project.projectType ?? ""}
        suburb={project.propertySuburb}
        state={project.propertyState}
        scopes={summaryScopes}
      />
    );
  }

  // Paid — full scope view
  return (
    <ScopeViewShell
      projectId={projectId}
      projectType={project.projectType ?? ""}
      mode={project.mode ?? "trades"}
      suburb={project.propertySuburb}
      state={project.propertyState}
      generatedAt={project._creationTime}
      scopes={scopes as any}
      sequencing={sequencing ?? null}
      coordination={coordination ?? null}
    />
  );
}
