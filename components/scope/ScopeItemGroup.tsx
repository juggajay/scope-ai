"use client";

import { ScopeItemToggle } from "./ScopeItemToggle";
import type { ScopeItem } from "@/types";

interface ScopeItemGroupProps {
  category: string;
  items: (ScopeItem & { originalIndex: number })[];
  onToggle: (index: number, included: boolean) => void;
}

export function ScopeItemGroup({
  category,
  items,
  onToggle,
}: ScopeItemGroupProps) {
  return (
    <div>
      <h4 className="px-4 pb-1 pt-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {category}
      </h4>
      <div className="divide-y divide-border/50">
        {items.map((item) => (
          <ScopeItemToggle
            key={item.id}
            item={item}
            index={item.originalIndex}
            onToggle={onToggle}
          />
        ))}
      </div>
    </div>
  );
}
