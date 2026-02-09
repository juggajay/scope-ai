"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddItemFormProps {
  existingCategories: string[];
  onAdd: (category: string, item: string, specification: string) => void;
  onCancel: () => void;
}

const OTHER_VALUE = "__other__";

export function AddItemForm({
  existingCategories,
  onAdd,
  onCancel,
}: AddItemFormProps) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [item, setItem] = useState("");
  const [specification, setSpecification] = useState("");

  const isOther = selectedCategory === OTHER_VALUE;
  const category = isOther ? customCategory.trim() : selectedCategory;
  const isValid =
    category.length > 0 && item.trim().length > 0 && specification.trim().length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    onAdd(category, item.trim(), specification.trim());
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 rounded-lg border border-dashed border-border bg-muted/30 p-4"
    >
      <div className="space-y-1.5">
        <Label htmlFor="add-category" className="text-xs">
          Category
        </Label>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger id="add-category" className="h-8 text-sm">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {existingCategories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
            <SelectItem value={OTHER_VALUE}>Other...</SelectItem>
          </SelectContent>
        </Select>
        {isOther && (
          <Input
            placeholder="New category name"
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            className="mt-1.5 h-8 text-sm"
            autoFocus
          />
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="add-item" className="text-xs">
          Item name
        </Label>
        <Input
          id="add-item"
          placeholder="e.g. Additional power point behind island"
          value={item}
          onChange={(e) => setItem(e.target.value)}
          className="h-8 text-sm"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="add-spec" className="text-xs">
          Specification
        </Label>
        <Input
          id="add-spec"
          placeholder="e.g. Double GPO, surface-mounted"
          value={specification}
          onChange={(e) => setSpecification(e.target.value)}
          className="h-8 text-sm"
        />
      </div>

      <div className="flex items-center gap-2 pt-1">
        <Button type="submit" size="sm" disabled={!isValid}>
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Add
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
