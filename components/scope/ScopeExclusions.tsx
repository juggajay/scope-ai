"use client";

import { X } from "lucide-react";

interface ScopeExclusionsProps {
  exclusions: string[];
}

export function ScopeExclusions({ exclusions }: ScopeExclusionsProps) {
  if (exclusions.length === 0) return null;

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Exclusions
      </h4>
      <ul className="space-y-1.5">
        {exclusions.map((exclusion, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <X className="mt-0.5 h-3.5 w-3.5 shrink-0 text-destructive" />
            <span className="text-muted-foreground">{exclusion}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
