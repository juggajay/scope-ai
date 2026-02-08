"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { ScopeItem } from "@/types";

interface ScopeItemToggleProps {
  item: ScopeItem;
  index: number;
  onToggle: (index: number, included: boolean) => void;
}

export function ScopeItemToggle({
  item,
  index,
  onToggle,
}: ScopeItemToggleProps) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-md px-4 py-3 transition-colors hover:bg-muted/50",
        !item.included && "opacity-50"
      )}
    >
      <Checkbox
        checked={item.included}
        onCheckedChange={(checked) => onToggle(index, checked === true)}
        className="mt-0.5"
      />
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "text-sm font-medium",
            !item.included && "line-through"
          )}
        >
          {item.item}
        </p>
        {item.specification && (
          <p className="mt-0.5 text-xs text-muted-foreground">
            {item.specification}
          </p>
        )}
        {item.complianceNote && (
          <p className="mt-1 text-xs text-primary">
            {item.complianceNote}
          </p>
        )}
      </div>
    </label>
  );
}
