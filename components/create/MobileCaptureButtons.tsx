"use client";

import { useRef } from "react";
import { Camera, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PHOTO_ACCEPTED_TYPES, PHOTO_MAX_SIZE_MB } from "@/lib/constants";

interface MobileCaptureButtonsProps {
  onFiles: (files: File[]) => void;
  disabled?: boolean;
}

export function MobileCaptureButtons({ onFiles, disabled }: MobileCaptureButtonsProps) {
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  const accept = PHOTO_ACCEPTED_TYPES.join(",");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) onFiles(files);
    e.target.value = "";
  };

  return (
    <div className="flex flex-col gap-3">
      <Button
        variant="outline"
        size="lg"
        onClick={() => cameraRef.current?.click()}
        disabled={disabled}
        className="w-full justify-start gap-3"
      >
        <Camera className="h-5 w-5 text-primary" />
        Take Photos
      </Button>
      <input
        ref={cameraRef}
        type="file"
        accept={accept}
        capture="environment"
        onChange={handleChange}
        className="hidden"
        aria-hidden
      />

      <Button
        variant="outline"
        size="lg"
        onClick={() => galleryRef.current?.click()}
        disabled={disabled}
        className="w-full justify-start gap-3"
      >
        <ImageIcon className="h-5 w-5 text-primary" />
        Choose from Gallery
      </Button>
      <input
        ref={galleryRef}
        type="file"
        accept={accept}
        multiple
        onChange={handleChange}
        className="hidden"
        aria-hidden
      />
    </div>
  );
}
