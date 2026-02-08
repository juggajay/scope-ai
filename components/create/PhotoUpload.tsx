"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useWizard, type PhotoMeta } from "@/lib/wizard/WizardContext";
import { PhotoUploadZone } from "./PhotoUploadZone";
import { PhotoCounter } from "./PhotoCounter";
import { PhotoTips } from "./PhotoTips";
import { PHOTO_MIN_COUNT } from "@/lib/constants";

export function PhotoUpload() {
  const { state, dispatch } = useWizard();
  const { photos, projectType, sessionId } = state;
  const [error, setError] = useState<string | null>(null);

  const generateUploadUrl = useMutation(api.photos.generateUploadUrl);
  const savePhoto = useMutation(api.photos.savePhoto);
  const deletePhotoMutation = useMutation(api.photos.deletePhoto);

  const hasMin = photos.filter((p) => p.status !== "failed").length >= PHOTO_MIN_COUNT;
  const hasUploading = photos.some((p) => p.status === "uploading");

  // Configure footer
  useEffect(() => {
    dispatch({
      type: "SET_FOOTER",
      hidden: false,
      label: "Continue",
      disabled: !hasMin || hasUploading,
    });
  }, [dispatch, hasMin, hasUploading]);

  // Auto-dismiss errors
  useEffect(() => {
    if (!error) return;
    const t = setTimeout(() => setError(null), 8000);
    return () => clearTimeout(t);
  }, [error]);

  const handleAddFiles = useCallback(
    (files: File[]) => {
      const newPhotos: PhotoMeta[] = files.map((file) => ({
        id: `photo_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        file,
        previewUrl: URL.createObjectURL(file),
        status: "uploading" as const,
        progress: 0,
      }));

      dispatch({ type: "ADD_PHOTOS", photos: newPhotos });

      // Upload each photo to Convex
      newPhotos.forEach((photo) => {
        uploadToConvex(photo, sessionId, dispatch, generateUploadUrl, savePhoto);
      });
    },
    [dispatch, sessionId, generateUploadUrl, savePhoto]
  );

  const handleRemove = useCallback(
    async (id: string) => {
      const photo = photos.find((p) => p.id === id);
      // Delete from Convex if it was saved
      if (photo?.convexId) {
        try {
          await deletePhotoMutation({ photoId: photo.convexId as any });
        } catch {
          // Best-effort — still remove locally
        }
      }
      dispatch({ type: "REMOVE_PHOTO", id });
    },
    [dispatch, photos, deletePhotoMutation]
  );

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight">
          Add photos of your space
        </h2>
        <p className="text-sm text-muted-foreground">
          We&apos;ll analyse your photos to understand the existing layout, fixtures, and
          condition. More photos = more accurate scope.
        </p>
      </div>

      {/* Tips */}
      {projectType && (
        <PhotoTips projectType={projectType} hasPhotos={photos.length > 0} />
      )}

      {/* Upload zone */}
      <PhotoUploadZone
        photos={photos}
        onAddFiles={handleAddFiles}
        onRemove={handleRemove}
        onError={setError}
      />

      {/* Counter */}
      <PhotoCounter count={photos.filter((p) => p.status !== "failed").length} />

      {/* Error banner */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center justify-between rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3"
            role="alert"
          >
            <p className="text-sm text-destructive">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-destructive/70 hover:text-destructive"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Real Convex upload with simulated progress
async function uploadToConvex(
  photo: PhotoMeta,
  sessionId: string,
  dispatch: React.Dispatch<{
    type: "UPDATE_PHOTO";
    id: string;
    updates: Partial<PhotoMeta>;
  }>,
  generateUploadUrl: () => Promise<string>,
  savePhotoMutation: (args: {
    storageId: string;
    originalFilename: string;
    fileSize: number;
    mimeType: string;
    sessionId?: string;
  }) => Promise<any>
) {
  // Simulate progress while uploading (uploads are fast for <10MB)
  let progress = 0;
  const interval = setInterval(() => {
    progress = Math.min(progress + 0.1 + Math.random() * 0.1, 0.9);
    dispatch({
      type: "UPDATE_PHOTO",
      id: photo.id,
      updates: { progress },
    });
  }, 150);

  try {
    // 1. Get upload URL
    const uploadUrl = await generateUploadUrl();

    // 2. Upload file to Convex storage
    const result = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": photo.file.type },
      body: photo.file,
    });

    if (!result.ok) throw new Error("Upload failed");

    const { storageId } = await result.json();

    // 3. Save photo record with sessionId
    const convexId = await savePhotoMutation({
      storageId,
      originalFilename: photo.file.name,
      fileSize: photo.file.size,
      mimeType: photo.file.type,
      sessionId,
    });

    clearInterval(interval);
    dispatch({
      type: "UPDATE_PHOTO",
      id: photo.id,
      updates: { progress: 1, status: "complete", storageId, convexId },
    });
  } catch {
    clearInterval(interval);
    dispatch({
      type: "UPDATE_PHOTO",
      id: photo.id,
      updates: { progress: 0, status: "failed" },
    });
  }
}
