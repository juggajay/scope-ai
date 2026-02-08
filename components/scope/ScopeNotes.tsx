"use client";

import { Wrench } from "lucide-react";

interface ScopeNotesProps {
  notes?: string;
  diyOption?: string;
}

export function ScopeNotes({ notes, diyOption }: ScopeNotesProps) {
  const hasNotes = notes && notes.trim().length > 0;
  const hasDiy = diyOption && diyOption.trim().length > 0;

  if (!hasNotes && !hasDiy) return null;

  return (
    <div className="space-y-3">
      {hasNotes && (
        <div className="space-y-2">
          <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Notes
          </h4>
          <p className="text-sm text-muted-foreground">{notes}</p>
        </div>
      )}

      {hasDiy && (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
          <div className="flex items-start gap-2.5">
            <Wrench className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <div>
              <h4 className="text-sm font-medium text-primary">
                DIY Option
              </h4>
              <p className="mt-1 text-sm text-muted-foreground">{diyOption}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
