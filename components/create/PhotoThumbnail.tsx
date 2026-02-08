"use client";

import { useState } from "react";
import { X, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PhotoMeta } from "@/lib/wizard/WizardContext";

interface PhotoThumbnailProps {
  photo: PhotoMeta;
  index: number;
  onRemove: (id: string) => void;
}

export function PhotoThumbnail({ photo, index, onRemove }: PhotoThumbnailProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-muted">
      {/* Image or fallback */}
      {imgError ? (
        <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
          Preview unavailable
        </div>
      ) : (
        <img
          src={photo.previewUrl}
          alt={`Photo ${index + 1}`}
          className="h-full w-full object-cover"
          onError={() => setImgError(true)}
        />
      )}

      {/* Upload progress ring */}
      {photo.status === "uploading" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <svg className="h-10 w-10" viewBox="0 0 36 36">
            <circle
              className="text-white/20"
              cx="18"
              cy="18"
              r="15"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            />
            <circle
              className="text-primary"
              cx="18"
              cy="18"
              r="15"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray={`${photo.progress * 94.2} 94.2`}
              strokeLinecap="round"
              transform="rotate(-90 18 18)"
            />
          </svg>
        </div>
      )}

      {/* Failed overlay */}
      {photo.status === "failed" && (
        <div className="absolute inset-0 flex items-center justify-center bg-destructive/20">
          <RotateCcw className="h-5 w-5 text-destructive" />
        </div>
      )}

      {/* File number badge */}
      <span className="absolute bottom-1.5 left-1.5 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
        {index + 1}
      </span>

      {/* Remove button */}
      <button
        onClick={() => onRemove(photo.id)}
        className={cn(
          "absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full",
          "bg-black/60 text-white backdrop-blur-sm transition-opacity",
          "md:opacity-0 md:group-hover:opacity-100"
        )}
        aria-label={`Remove photo ${index + 1}`}
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
