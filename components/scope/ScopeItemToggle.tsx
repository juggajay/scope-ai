"use client";

import { useState, useRef, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ScopeItem } from "@/types";

interface ScopeItemToggleProps {
  item: ScopeItem;
  index: number;
  onToggle: (index: number, included: boolean) => void;
  onEdit: (index: number, item: string, specification: string) => void;
  onDelete?: (index: number) => void;
}

export function ScopeItemToggle({
  item,
  index,
  onToggle,
  onEdit,
  onDelete,
}: ScopeItemToggleProps) {
  const [editing, setEditing] = useState<null | "item" | "specification">(null);
  const [editItem, setEditItem] = useState(item.item);
  const [editSpec, setEditSpec] = useState(item.specification);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  // Sync local state if item changes externally
  useEffect(() => {
    if (!editing) {
      setEditItem(item.item);
      setEditSpec(item.specification);
    }
  }, [item.item, item.specification, editing]);

  const save = () => {
    const trimmedItem = editItem.trim() || item.item;
    const trimmedSpec = editSpec.trim() || item.specification;
    if (trimmedItem !== item.item || trimmedSpec !== item.specification) {
      onEdit(index, trimmedItem, trimmedSpec);
    }
    setEditing(null);
  };

  const cancel = () => {
    setEditItem(item.item);
    setEditSpec(item.specification);
    setEditing(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      save();
    } else if (e.key === "Escape") {
      e.preventDefault();
      cancel();
    }
  };

  return (
    <div
      className={cn(
        "group flex items-start gap-3 rounded-md px-4 py-3 transition-colors hover:bg-muted/50",
        !item.included && "opacity-50"
      )}
    >
      <Checkbox
        checked={item.included}
        onCheckedChange={(checked) => onToggle(index, checked === true)}
        className="mt-0.5 shrink-0"
      />
      <div className="min-w-0 flex-1">
        {/* Item name */}
        {editing === "item" ? (
          <Input
            ref={inputRef}
            value={editItem}
            onChange={(e) => setEditItem(e.target.value)}
            onBlur={save}
            onKeyDown={handleKeyDown}
            className="h-7 text-sm font-medium"
          />
        ) : (
          <div className="flex items-center gap-2">
            <p
              className={cn(
                "cursor-text text-sm font-medium hover:underline hover:decoration-muted-foreground/40",
                !item.included && "line-through"
              )}
              onClick={() => setEditing("item")}
            >
              {item.item}
            </p>
            {item.isCustom && (
              <Badge
                variant="secondary"
                className="bg-primary/10 text-primary hover:bg-primary/10 px-1.5 py-0 text-[10px] font-medium"
              >
                Custom
              </Badge>
            )}
          </div>
        )}

        {/* Specification */}
        {editing === "specification" ? (
          <Input
            ref={inputRef}
            value={editSpec}
            onChange={(e) => setEditSpec(e.target.value)}
            onBlur={save}
            onKeyDown={handleKeyDown}
            className="mt-1 h-6 text-xs"
          />
        ) : item.specification ? (
          <p
            className="mt-0.5 cursor-text text-xs text-muted-foreground hover:underline hover:decoration-muted-foreground/40"
            onClick={() => setEditing("specification")}
          >
            {item.specification}
          </p>
        ) : null}

        {item.complianceNote && (
          <p className="mt-1 text-xs text-primary">
            {item.complianceNote}
          </p>
        )}
      </div>

      {/* Delete button — only for custom items */}
      {item.isCustom && onDelete && (
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 shrink-0 text-muted-foreground opacity-100 transition-opacity hover:text-destructive sm:opacity-0 sm:group-hover:opacity-100"
          onClick={() => onDelete(index)}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
}
