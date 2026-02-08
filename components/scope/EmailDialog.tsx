"use client";

import { useState } from "react";
import { useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import { Mail, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type {
  ScopeItem,
  PCSum,
  SequencingPhase,
  CoordinationItem,
} from "@/types";

interface TradeData {
  tradeType: string;
  title: string;
  items: ScopeItem[];
  exclusions: string[];
  pcSums?: PCSum[];
  complianceNotes?: string;
  warnings?: string[];
  notes?: string;
}

interface DocumentProps {
  projectType: string;
  suburb?: string;
  state?: string;
  generatedAt?: number;
  scopes: TradeData[];
  sequencing: { phases: SequencingPhase[]; totalDurationEstimate: string } | null;
  coordination: { items: CoordinationItem[] } | null;
}

interface EmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  documentProps: DocumentProps;
}

type Step = "form" | "sending" | "success";

export function EmailDialog({
  open,
  onOpenChange,
  projectId,
  documentProps,
}: EmailDialogProps) {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<Step>("form");
  const [error, setError] = useState<string | null>(null);

  const generateUploadUrl = useMutation(api.photos.generateUploadUrl);
  const saveDocument = useMutation(api.documents.saveDocument);
  const sendScopeEmail = useAction(api.email.sendScopeEmail);

  function handleClose(open: boolean) {
    if (!open) {
      // Reset state on close
      setTimeout(() => {
        setStep("form");
        setError(null);
      }, 200);
    }
    onOpenChange(open);
  }

  async function handleSend() {
    if (!email.trim()) return;

    setError(null);
    setStep("sending");

    try {
      // 1. Generate PDF blob client-side
      const { generateFullScopePdf, getScopeFilename } = await import(
        "@/lib/pdf/generate"
      );
      const blob = await generateFullScopePdf(documentProps);
      const filename = getScopeFilename(documentProps.projectType);

      // 2. Upload to Convex storage
      const uploadUrl = await generateUploadUrl();
      const uploadRes = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": "application/pdf" },
        body: blob,
      });
      if (!uploadRes.ok) throw new Error("Failed to upload PDF");
      const { storageId } = await uploadRes.json();

      // 3. Send email via Convex action
      await sendScopeEmail({
        projectId: projectId as Id<"projects">,
        storageId,
        recipientEmail: email.trim(),
        filename,
      });

      // 4. Save document record
      await saveDocument({
        projectId: projectId as Id<"projects">,
        documentType: "email",
        storageId,
        filename,
      });

      setStep("success");
      toast.success("Scope emailed successfully");
    } catch (err) {
      console.error("Email send failed:", err);
      setError(
        err instanceof Error ? err.message : "Failed to send email. Please try again."
      );
      setStep("form");
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            Email Scope
          </DialogTitle>
          <DialogDescription>
            Send the full scope of works as a PDF attachment.
          </DialogDescription>
        </DialogHeader>

        {step === "form" && (
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="email">Recipient email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tradie@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSend();
                }}
              />
            </div>
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => handleClose(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSend}
                disabled={!email.trim() || !email.includes("@")}
              >
                <Mail className="mr-1.5 h-4 w-4" />
                Send Scope
              </Button>
            </div>
          </div>
        )}

        {step === "sending" && (
          <div className="flex flex-col items-center gap-3 py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              Generating PDF and sending email...
            </p>
          </div>
        )}

        {step === "success" && (
          <div className="flex flex-col items-center gap-3 py-8">
            <CheckCircle2 className="h-10 w-10 text-primary" />
            <p className="text-sm font-medium">Scope sent to {email}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleClose(false)}
            >
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
