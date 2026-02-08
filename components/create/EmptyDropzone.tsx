"use client";

import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { PHOTO_MAX_SIZE_MB } from "@/lib/constants";

interface EmptyDropzoneProps {
  isDragActive: boolean;
  isDragReject: boolean;
  getRootProps: () => Record<string, unknown>;
  getInputProps: () => Record<string, unknown>;
  open: () => void;
}

export function EmptyDropzone({
  isDragActive,
  isDragReject,
  getRootProps,
  getInputProps,
  open,
}: EmptyDropzoneProps) {
  return (
    <div
      {...getRootProps()}
      onClick={open}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-12 transition-all",
        isDragReject && "border-destructive bg-destructive/5",
        isDragActive && !isDragReject && "border-primary bg-primary/5 scale-[1.01] ring-2 ring-primary/20",
        !isDragActive && !isDragReject && "border-border bg-muted/30 hover:border-primary/50"
      )}
    >
      <input {...getInputProps()} />
      <Upload className="mb-3 h-8 w-8 text-muted-foreground" />
      <p className="text-sm font-medium text-foreground">
        {isDragActive
          ? isDragReject
            ? "This file type isn't supported"
            : "Drop your photos here"
          : "Drag photos here, or click to browse"}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        JPEG, PNG, HEIC, or WebP — up to {PHOTO_MAX_SIZE_MB}MB each
      </p>
    </div>
  );
}
