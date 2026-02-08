"use client";

import { AlertTriangle, FileText } from "lucide-react";

interface ScopeWarningsProps {
  warnings?: string[];
  complianceNotes?: string;
}

export function ScopeWarnings({ warnings, complianceNotes }: ScopeWarningsProps) {
  const hasWarnings = warnings && warnings.length > 0;
  const hasCompliance = complianceNotes && complianceNotes.trim().length > 0;

  if (!hasWarnings && !hasCompliance) return null;

  return (
    <div className="space-y-3">
      {hasWarnings && (
        <div className="space-y-2">
          <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Warnings
          </h4>
          <div className="space-y-2">
            {warnings.map((warning, i) => (
              <div
                key={i}
                className="flex items-start gap-2.5 rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-3 dark:border-yellow-400/20 dark:bg-yellow-400/10"
              >
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-yellow-600 dark:text-yellow-400" />
                <p className="text-sm text-foreground">{warning}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {hasCompliance && (
        <div className="space-y-2">
          <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Compliance Notes
          </h4>
          <div className="flex items-start gap-2.5 rounded-lg border border-border bg-muted/50 p-3">
            <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">{complianceNotes}</p>
          </div>
        </div>
      )}
    </div>
  );
}
