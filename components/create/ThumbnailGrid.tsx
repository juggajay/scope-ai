"use client";

import { Plus } from "lucide-react";
import { PhotoThumbnail } from "./PhotoThumbnail";
import { PHOTO_MAX_COUNT } from "@/lib/constants";
import type { PhotoMeta } from "@/lib/wizard/WizardContext";

interface ThumbnailGridProps {
  photos: PhotoMeta[];
  onRemove: (id: string) => void;
  onAddMore: () => void;
}

export function ThumbnailGrid({ photos, onRemove, onAddMore }: ThumbnailGridProps) {
  const canAdd = photos.length < PHOTO_MAX_COUNT;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {photos.map((photo, i) => (
        <PhotoThumbnail
          key={photo.id}
          photo={photo}
          index={i}
          onRemove={onRemove}
        />
      ))}

      {canAdd && (
        <button
          onClick={onAddMore}
          className="flex aspect-square items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30 transition-colors hover:border-primary/50 hover:bg-accent/5"
          aria-label="Add more photos"
        >
          <Plus className="h-6 w-6 text-muted-foreground" />
        </button>
      )}
    </div>
  );
}
