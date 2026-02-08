"use client";

import { useCallback, useRef } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { EmptyDropzone } from "./EmptyDropzone";
import { MobileCaptureButtons } from "./MobileCaptureButtons";
import { ThumbnailGrid } from "./ThumbnailGrid";
import {
  PHOTO_ACCEPTED_TYPES,
  PHOTO_MAX_SIZE_MB,
  PHOTO_MAX_COUNT,
} from "@/lib/constants";
import type { PhotoMeta } from "@/lib/wizard/WizardContext";

interface PhotoUploadZoneProps {
  photos: PhotoMeta[];
  onAddFiles: (files: File[]) => void;
  onRemove: (id: string) => void;
  onError: (message: string) => void;
}

export function PhotoUploadZone({
  photos,
  onAddFiles,
  onRemove,
  onError,
}: PhotoUploadZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasPhotos = photos.length > 0;
  const canAdd = photos.length < PHOTO_MAX_COUNT;

  const onDrop = useCallback(
    (accepted: File[], rejected: readonly FileRejection[]) => {
      if (rejected.length > 0) {
        const sizeErr = rejected.some((r) =>
          r.errors.some((e) => e.message.includes("larger"))
        );
        const typeErr = rejected.some((r) =>
          r.errors.some((e) => e.message.includes("type"))
        );
        if (sizeErr) onError(`Files must be under ${PHOTO_MAX_SIZE_MB}MB`);
        else if (typeErr) onError("Only JPEG, PNG, HEIC, and WebP files are accepted");
      }

      const remaining = PHOTO_MAX_COUNT - photos.length;
      let filesToAdd = accepted;
      if (filesToAdd.length > remaining) {
        onError(`You can add up to ${remaining} more photo${remaining !== 1 ? "s" : ""}`);
        filesToAdd = filesToAdd.slice(0, remaining);
      }

      if (filesToAdd.length > 0) onAddFiles(filesToAdd);
    },
    [photos.length, onAddFiles, onError]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject, open } =
    useDropzone({
      onDrop,
      accept: { "image/*": PHOTO_ACCEPTED_TYPES.map((t) => `.${t.split("/")[1]}`) },
      maxSize: PHOTO_MAX_SIZE_MB * 1024 * 1024,
      noClick: true,
      noKeyboard: true,
      disabled: !canAdd,
    });

  const handleAddMore = () => {
    fileInputRef.current?.click();
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) onAddFiles(files);
    e.target.value = "";
  };

  return (
    <div className="space-y-4">
      {/* Desktop dropzone or mobile buttons */}
      {!hasPhotos && (
        <>
          {/* Desktop */}
          <div className="hidden md:block">
            <EmptyDropzone
              isDragActive={isDragActive}
              isDragReject={isDragReject}
              getRootProps={getRootProps}
              getInputProps={getInputProps}
              open={open}
            />
          </div>

          {/* Mobile */}
          <div className="md:hidden">
            <MobileCaptureButtons onFiles={onAddFiles} disabled={!canAdd} />
          </div>
        </>
      )}

      {/* Thumbnail grid */}
      {hasPhotos && (
        <ThumbnailGrid
          photos={photos}
          onRemove={onRemove}
          onAddMore={handleAddMore}
        />
      )}

      {/* Hidden file input for "Add More" */}
      <input
        ref={fileInputRef}
        type="file"
        accept={PHOTO_ACCEPTED_TYPES.join(",")}
        multiple
        onChange={handleFileInput}
        className="hidden"
      />
    </div>
  );
}
