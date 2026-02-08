# Photo Upload UX Research — ScopeAI Wizard Step 3

> **Research Date:** February 2026
> **Purpose:** Comprehensive UX patterns and implementation guidance for the photo upload step of the ScopeAI renovation scope generator
> **Target User:** Non-technical Australian homeowner, 60%+ on mobile, likely standing in their kitchen taking photos right now
> **Tech Stack:** Next.js 14+ (App Router) + shadcn/ui + Tailwind CSS v4 + Framer Motion + Convex file storage + react-dropzone
> **Constraints:** 3-10 photos, max 10MB each, JPG/PNG/HEIC/WebP accepted

---

## TABLE OF CONTENTS

1. [Key Recommendation](#1-key-recommendation)
2. [Drag-and-Drop Patterns](#2-drag-and-drop-patterns)
3. [Mobile Camera Capture](#3-mobile-camera-capture)
4. [Upload Progress](#4-upload-progress)
5. [Thumbnail Preview Layout](#5-thumbnail-preview-layout)
6. [Reordering](#6-reordering)
7. [Error Handling](#7-error-handling)
8. [Guidance and Coaching](#8-guidance-and-coaching)
9. [Empty State to Populated State Transition](#9-empty-state-to-populated-state-transition)
10. [Minimum Count Enforcement](#10-minimum-count-enforcement)
11. [HEIC Handling](#11-heic-handling)
12. [Recommended Component Architecture](#12-recommended-component-architecture)
13. [Complete Implementation Reference](#13-complete-implementation-reference)

---

## 1. Key Recommendation

**The best photo upload pattern for mobile-first users who are taking photos right now is a camera-first, tap-to-add interface -- not a drag-and-drop zone.**

The primary interaction on mobile is tapping a large button that opens the native camera or gallery picker. Drag-and-drop is a desktop enhancement layered on top of this primary flow, not the core pattern. The upload zone should be designed as a "tap target first, drop zone second" -- a large, inviting area that on mobile reads as "tap here to take/choose photos" and on desktop also accepts dragged files.

### Design Priorities (ordered)

1. **Large tap target** for camera/gallery access on mobile
2. **Immediate thumbnail feedback** after each photo is selected
3. **Gentle coaching** about what photos to take (not preachy, not blocking)
4. **Clear count progress** showing "2 of 3 minimum" without feeling like an error
5. **Per-file upload progress** overlaid on thumbnails
6. **Inline error handling** that does not disrupt the flow
7. **Drag-and-drop** as a progressive enhancement for desktop users

---

## 2. Drag-and-Drop Patterns

### 2.1 Core Library: react-dropzone

react-dropzone provides the `useDropzone` hook which handles both drag-and-drop and click-to-browse. It returns `isDragActive`, `isDragAccept`, and `isDragReject` states for visual feedback.

**Configuration for ScopeAI:**

```typescript
const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
  accept: {
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'image/heic': ['.heic'],
    'image/webp': ['.webp'],
  },
  maxFiles: PHOTO_MAX_COUNT, // 10
  maxSize: PHOTO_MAX_SIZE_MB * 1024 * 1024, // 10MB in bytes
  onDrop: handleDrop,
  onDropRejected: handleRejection,
});
```

### 2.2 Dropzone Visual States

The dropzone needs four distinct visual states. Use Tailwind classes with `data-*` attributes or conditional classnames.

| State | Visual Treatment | Tailwind Classes |
|---|---|---|
| **Default** | Dashed border, muted background, upload icon + text | `border-2 border-dashed border-border bg-muted/30 rounded-lg` |
| **Drag active (valid files)** | Solid teal border, teal tint background, scale up slightly | `border-2 border-solid border-primary bg-primary/5 scale-[1.01] ring-2 ring-primary/20` |
| **Drag active (invalid files)** | Red/destructive border, subtle shake | `border-2 border-solid border-destructive bg-destructive/5` |
| **Has files (populated)** | Transforms into thumbnail grid, dropzone shrinks to "add more" button | Grid replaces dropzone; see Section 9 |

### 2.3 Hover/Drag Feedback

```
Default state:
  ┌─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┐
  │                                      │
  │         [Camera icon]                │
  │                                      │
  │    Tap to take photos or browse      │
  │    or drag and drop here             │
  │                                      │
  │         JPG, PNG, HEIC, WebP         │
  │         up to 10MB each              │
  └─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┘

Drag active state:
  ┌──────────────────────────────────────┐
  │                                      │
  │    [Animated pulse teal border]      │
  │                                      │
  │         Drop photos here             │
  │                                      │
  └──────────────────────────────────────┘
```

### 2.4 File Landing Animation

When files land on the dropzone:

1. Brief scale pulse on the dropzone border (100ms scale to 1.02, then back)
2. Thumbnails appear with a staggered `opacity: 0 -> 1` and `scale: 0.8 -> 1` animation
3. Each thumbnail enters with a 50ms stagger delay from the previous one

Use Framer Motion's `AnimatePresence` and `motion.div` with `layout` prop for smooth grid rearrangement.

---

## 3. Mobile Camera Capture

### 3.1 The `capture` Attribute -- Cross-Platform Behaviour

This is the most critical mobile consideration. The HTML `capture` attribute on `<input type="file">` behaves differently across platforms:

| Platform | `capture` absent | `capture="environment"` | `capture` (no value) |
|---|---|---|---|
| **iOS Safari** | Shows action sheet: "Take Photo", "Photo Library", "Browse" | Shows same action sheet (iOS always gives the choice) | Shows same action sheet |
| **Android Chrome** | Opens file picker (may include camera option) | Opens rear camera directly (skips gallery) | Opens camera directly |
| **Desktop** | Opens file dialog | Ignored -- opens file dialog | Ignored |

### 3.2 Recommended Approach for ScopeAI

**Do NOT use `capture="environment"` on the main upload input.** On Android, this would skip the gallery entirely and force users to take a new photo every time. Many users will want to upload photos they already took.

**Instead, provide two distinct actions on mobile:**

1. **Primary button: "Take or Choose Photos"** -- standard file input without `capture` attribute. On iOS this always shows the action sheet. On Android this opens the file picker which includes camera as an option.

2. **Secondary button: "Open Camera"** -- a separate file input WITH `capture="environment"`. This is a shortcut for users who want to snap a photo right now.

```tsx
// Primary input (inside react-dropzone)
<input {...getInputProps()} />

// Secondary camera button (separate hidden input)
<input
  type="file"
  accept="image/*"
  capture="environment"
  multiple
  ref={cameraInputRef}
  className="hidden"
  onChange={handleCameraCapture}
/>
```

### 3.3 Mobile Layout

On mobile (below `md` breakpoint), the dropzone should be replaced with two large tap buttons stacked vertically:

```
┌──────────────────────────────────┐
│                                  │
│     [Camera icon]                │
│     Take Photos                  │
│     Use your camera now          │
│                                  │
├──────────────────────────────────┤
│                                  │
│     [Image icon]                 │
│     Choose from Gallery          │
│     Upload existing photos       │
│                                  │
└──────────────────────────────────┘
```

Tailwind implementation:

```tsx
{/* Mobile: two buttons */}
<div className="flex flex-col gap-3 md:hidden">
  <button
    onClick={() => cameraInputRef.current?.click()}
    className="flex items-center gap-3 rounded-lg border-2 border-dashed border-border
               bg-muted/30 p-6 text-left transition-colors hover:border-primary
               hover:bg-primary/5 active:scale-[0.98]"
  >
    <Camera className="h-8 w-8 text-primary" />
    <div>
      <p className="text-base font-medium text-foreground">Take Photos</p>
      <p className="text-sm text-muted-foreground">Use your camera now</p>
    </div>
  </button>

  <button
    onClick={() => galleryInputRef.current?.click()}
    className="flex items-center gap-3 rounded-lg border-2 border-dashed border-border
               bg-muted/30 p-6 text-left transition-colors hover:border-primary
               hover:bg-primary/5 active:scale-[0.98]"
  >
    <ImageIcon className="h-8 w-8 text-muted-foreground" />
    <div>
      <p className="text-base font-medium text-foreground">Choose from Gallery</p>
      <p className="text-sm text-muted-foreground">Upload existing photos</p>
    </div>
  </button>
</div>

{/* Desktop: drag-and-drop zone */}
<div className="hidden md:block" {...getRootProps()}>
  {/* dropzone content */}
</div>
```

### 3.4 Multiple File Selection

The `multiple` attribute on the file input is essential. On iOS, users can select multiple photos from their gallery in one action. On Android, multi-select behaviour varies by device manufacturer but is generally supported.

```tsx
<input {...getInputProps({ multiple: true })} />
```

### 3.5 EXIF Orientation

Mobile photos often have EXIF orientation metadata rather than actually rotated pixel data. When generating thumbnails with `URL.createObjectURL()`, modern browsers (Chrome 81+, Safari 13.1+, Firefox 79+) automatically apply EXIF orientation. No manual rotation is needed for previews in 2026.

---

## 4. Upload Progress

### 4.1 Per-File vs Overall Progress

**Use per-file progress, not overall progress.** Research consistently shows that per-file progress eliminates uncertainty about individual file status. For 3-10 photo uploads, each file is a discrete thing the user cares about -- they want to know "did THAT photo upload?"

### 4.2 Progress Display Pattern

Overlay a progress indicator directly on each thumbnail. This keeps progress contextually linked to the file it represents.

**Three states per file:**

| State | Visual |
|---|---|
| **Uploading** | Semi-transparent overlay on thumbnail + circular progress ring (not bar) + percentage text |
| **Complete** | Brief green checkmark animation, then clean thumbnail (no persistent indicator) |
| **Failed** | Red overlay with retry icon and "Tap to retry" text |

### 4.3 Why Circular Progress Over Linear Bar

For thumbnails in a grid, circular progress rings work better than linear bars because:

- They do not require extra vertical space below the thumbnail
- They are visible overlaid on the image without obstructing too much
- They feel more polished on small touch targets
- They match the shape language of the remove button (also circular)

### 4.4 Thumbnail Progress Implementation

```tsx
{/* Upload progress overlay */}
{file.status === "uploading" && (
  <div className="absolute inset-0 flex items-center justify-center
                  rounded-lg bg-black/40">
    {/* Circular progress ring using SVG */}
    <svg className="h-10 w-10" viewBox="0 0 36 36">
      <circle
        cx="18" cy="18" r="15"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="text-white/30"
      />
      <circle
        cx="18" cy="18" r="15"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray={`${file.progress * 94.2} 94.2`}
        strokeLinecap="round"
        className="text-primary transition-all duration-300"
        transform="rotate(-90 18 18)"
      />
    </svg>
    <span className="absolute text-xs font-medium text-white">
      {Math.round(file.progress * 100)}%
    </span>
  </div>
)}
```

### 4.5 Convex Upload Flow

With Convex file storage, the upload flow is:

1. Call `generateUploadUrl()` mutation to get a signed upload URL
2. Upload the file directly to Convex storage via `fetch()`
3. On completion, call `savePhoto()` mutation with the returned `storageId`

Progress tracking during step 2 uses `XMLHttpRequest` with `upload.onprogress` event (since `fetch()` does not natively support upload progress). Alternatively, for simplicity in MVP, use an indeterminate spinner since individual photo uploads to Convex are typically fast (1-3 seconds per photo on a decent connection).

```typescript
async function uploadToConvex(file: File, uploadUrl: string, onProgress: (p: number) => void) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(e.loaded / e.total);
    };
    xhr.onload = () => (xhr.status === 200 ? resolve() : reject());
    xhr.onerror = () => reject();
    xhr.open("POST", uploadUrl);
    xhr.send(file);
  });
}
```

---

## 5. Thumbnail Preview Layout

### 5.1 Grid Layout

Use a responsive CSS Grid that adapts from 2 columns on mobile to 3-4 columns on desktop. All thumbnails should be **square with `object-fit: cover`** to handle different aspect ratios uniformly.

**Rationale for square thumbnails:** Users upload photos in landscape, portrait, and various aspect ratios from different phone cameras. Forcing a uniform aspect ratio via `object-cover` creates a clean, consistent grid. The AI receives the original full-resolution image regardless of thumbnail cropping.

```tsx
<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
  {files.map((file) => (
    <PhotoThumbnail key={file.id} file={file} onRemove={handleRemove} />
  ))}
  {files.length < PHOTO_MAX_COUNT && (
    <AddMoreButton onClick={openFilePicker} />
  )}
</div>
```

### 5.2 Thumbnail Component

Each thumbnail is a square with `aspect-ratio: 1/1`, a rounded border, and a floating remove button.

```tsx
function PhotoThumbnail({ file, onRemove }: { file: UploadedFile; onRemove: () => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.2 }}
      className="group relative aspect-square overflow-hidden rounded-lg
                 border border-border bg-muted"
    >
      <img
        src={file.preview}
        alt={file.name}
        className="h-full w-full object-cover"
        onLoad={() => URL.revokeObjectURL(file.preview)}
      />

      {/* Remove button -- always visible on mobile, hover on desktop */}
      <button
        onClick={(e) => { e.stopPropagation(); onRemove(); }}
        className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center
                   rounded-full bg-black/60 text-white backdrop-blur-sm
                   transition-opacity md:opacity-0 md:group-hover:opacity-100"
        aria-label={`Remove ${file.name}`}
      >
        <X className="h-3.5 w-3.5" />
      </button>

      {/* File number badge */}
      <span className="absolute bottom-1.5 left-1.5 flex h-5 min-w-5 items-center
                       justify-center rounded-full bg-black/60 px-1.5 text-[10px]
                       font-medium text-white backdrop-blur-sm">
        {file.index + 1}
      </span>

      {/* Upload progress overlay (see Section 4.4) */}
      {file.status === "uploading" && <ProgressOverlay progress={file.progress} />}
      {file.status === "failed" && <RetryOverlay onRetry={file.retry} />}
    </motion.div>
  );
}
```

### 5.3 Remove Button Placement

**Top-right corner of the thumbnail.** This is the universally understood pattern (iOS Photos, Google Photos, Airbnb, Instagram).

- Always visible on mobile (no hover state on touch devices)
- Visible on hover on desktop (`md:opacity-0 md:group-hover:opacity-100`)
- Semi-transparent dark circle with white X icon
- Size: `h-6 w-6` (24px) -- large enough to tap comfortably on mobile (44px minimum recommended by Apple; the circle is 24px but the tap target via padding should be 44px)

Increase tap target without increasing visual size:

```tsx
<button
  className="absolute -right-1 -top-1 flex h-8 w-8 items-center justify-center"
  aria-label={`Remove ${file.name}`}
>
  <span className="flex h-6 w-6 items-center justify-center rounded-full
                   bg-black/60 text-white backdrop-blur-sm">
    <X className="h-3.5 w-3.5" />
  </span>
</button>
```

### 5.4 "Add More" Button

When files exist but the maximum hasn't been reached, show an "Add More" button as the last item in the grid. It should match the aspect ratio and size of thumbnails.

```tsx
function AddMoreButton({ onClick, count, max }: { onClick: () => void; count: number; max: number }) {
  return (
    <button
      onClick={onClick}
      className="flex aspect-square flex-col items-center justify-center gap-2
                 rounded-lg border-2 border-dashed border-border bg-muted/30
                 text-muted-foreground transition-colors hover:border-primary
                 hover:bg-primary/5 hover:text-primary active:scale-[0.97]"
    >
      <Plus className="h-6 w-6" />
      <span className="text-xs font-medium">
        Add More
      </span>
      <span className="text-[10px]">
        {count}/{max}
      </span>
    </button>
  );
}
```

### 5.5 Handling Different Aspect Ratios

All thumbnails use `object-fit: cover` within a fixed `aspect-square` container. This means:

- Portrait photos: cropped equally from top and bottom
- Landscape photos: cropped equally from left and right
- Square photos: displayed as-is

The user does not need to see the full photo in the thumbnail -- it's just for identification. The AI receives the original uncropped file.

---

## 6. Reordering

### 6.1 Recommendation: Do NOT implement drag-to-reorder

**Verdict: Unnecessary complexity for ScopeAI. Do not build this for MVP.**

**Reasons:**

1. **Photo order does not affect AI output.** The Gemini Vision API receives all photos as a batch and analyses them collectively. The AI does not care about photo order -- it is analysing spatial relationships within individual images and cross-referencing across the set. Reordering provides zero functional value.

2. **Mobile drag-to-reorder is notoriously frustrating.** Research from Nielsen Norman Group confirms that on touchscreens, drag interactions are "inefficient, imprecise, and physically challenging." Users must maintain finger contact while aiming for a moving target -- elements shift under the cursor as drag positions change, creating confusion and errors.

3. **Implementation cost is high.** Building accessible, performant drag-to-reorder in a responsive grid with touch support requires either `@dnd-kit/sortable` or similar libraries, plus careful animation work. This is 1-2 days of development for zero user value.

4. **There is no user expectation.** This is a tool for uploading renovation photos, not curating a portfolio. Users expect to add photos and remove bad ones. They do not expect to arrange them in a specific order.

### 6.2 What to Offer Instead

If a user uploaded a bad photo, they should **remove it and re-upload**. The remove button on each thumbnail handles this case cleanly. Photos are displayed in upload order (chronological), which is the natural mental model.

### 6.3 If Reordering Is Ever Needed (V2+)

If user research later reveals a need for reordering (e.g., "first photo is the hero photo for PDF cover"), implement numbered move buttons (up/down arrows) instead of drag-and-drop. This is more accessible, works on mobile, and avoids the complexity of drag interactions.

---

## 7. Error Handling

### 7.1 Principles

Errors in photo upload should be:

1. **Inline** -- shown at the point of failure, not in a modal or toast
2. **Specific** -- tell the user exactly what went wrong and what to do
3. **Non-blocking** -- other photos continue uploading even if one fails
4. **Dismissable** -- user can remove a failed file and move on
5. **Recoverable** -- offer a retry action on network failures

### 7.2 Error Types and Display

| Error Type | When Detected | Display Location | Message | Action |
|---|---|---|---|---|
| **File too large** | On file selection (client-side) | Below the dropzone as inline alert | "kitchen-photo.jpg is too large (12.3 MB). Maximum size is 10 MB." | "Remove" button |
| **Wrong format** | On file selection (client-side) | Below the dropzone as inline alert | "document.pdf is not a supported format. Please upload JPG, PNG, HEIC, or WebP images." | "Remove" button |
| **Too many files** | On file selection (client-side) | Below the dropzone as inline alert | "You can upload up to 10 photos. 3 files were not added." | None needed |
| **Upload failed** | During upload (network) | Overlaid on the thumbnail | Red overlay with retry icon | "Tap to retry" on thumbnail |
| **Server error** | After upload | Overlaid on the thumbnail | Red overlay with error icon | "Tap to retry" on thumbnail |

### 7.3 Inline Error Component

Errors from file selection (type, size, count) appear as a dismissable banner below the upload zone, NOT as a modal or toast. This keeps the error contextually relevant and does not block the user from continuing.

```tsx
function UploadError({ error, onDismiss }: { error: FileError; onDismiss: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="flex items-start gap-3 rounded-md border border-destructive/20
                 bg-destructive/5 p-3 text-sm"
    >
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
      <div className="flex-1">
        <p className="font-medium text-destructive">{error.title}</p>
        <p className="text-muted-foreground">{error.message}</p>
      </div>
      <button
        onClick={onDismiss}
        className="shrink-0 text-muted-foreground hover:text-foreground"
        aria-label="Dismiss error"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
}
```

### 7.4 react-dropzone Error Codes

react-dropzone provides structured rejection data via `onDropRejected`:

```typescript
function handleRejection(fileRejections: FileRejection[]) {
  const errors = fileRejections.map(({ file, errors }) => {
    const errorCode = errors[0]?.code;
    switch (errorCode) {
      case "file-too-large":
        return {
          title: `${file.name} is too large`,
          message: `${formatFileSize(file.size)} exceeds the 10 MB limit. Try a smaller photo.`,
        };
      case "file-invalid-type":
        return {
          title: `${file.name} is not a supported format`,
          message: "Please upload JPG, PNG, HEIC, or WebP images.",
        };
      case "too-many-files":
        return {
          title: "Too many files",
          message: `You can upload up to ${PHOTO_MAX_COUNT} photos. Some files were not added.`,
        };
      default:
        return {
          title: `Problem with ${file.name}`,
          message: "This file could not be added. Please try again.",
        };
    }
  });
  setUploadErrors(errors);
}
```

### 7.5 Auto-Dismiss Errors

Validation errors (type, size) should auto-dismiss after 8 seconds or when the user adds new files successfully. Network errors on thumbnails should persist until the user retries or removes the file.

---

## 8. Guidance and Coaching

### 8.1 Coaching Philosophy

The user is standing in their kitchen right now. They want to know: "What should I photograph?" But they don't want to read a manual. The coaching should be:

- **Visible but not blocking** -- shown alongside the upload area, not before it
- **Scannable** -- short bullet points with icons, not paragraphs
- **Helpful not preachy** -- "Better photos = better scope" not "YOU MUST PHOTOGRAPH THE FOLLOWING"
- **Contextual to project type** -- kitchen photos differ from bathroom photos

### 8.2 Coaching Display Pattern: Collapsible Tips Panel

Show a lightweight tips section above or beside the upload zone. On mobile, it starts expanded (since the dropzone hasn't been used yet). After the first photo is added, it collapses to a single-line summary that can be expanded.

```
┌──────────────────────────────────────────┐
│  [Camera icon] Tips for better photos    │
│                                          │
│  Include photos of:                      │
│  * Full room overview (stand in doorway) │
│  * Benchtops and cabinets up close       │
│  * Existing appliances                   │
│  * Any problem areas (damage, wear)      │
│  * Power points and light switches       │
│                                          │
│  The more you show us, the more          │
│  accurate your scope will be.            │
└──────────────────────────────────────────┘
```

### 8.3 Project-Type Specific Tips

Store tips per project type. These should load dynamically based on the project type selected in Step 2.

```typescript
const PHOTO_TIPS: Record<ProjectType, { icon: string; text: string }[]> = {
  kitchen: [
    { icon: "layout", text: "Full room from the doorway" },
    { icon: "cabinet", text: "Cabinets and benchtops" },
    { icon: "stove", text: "Cooktop, oven, and rangehood" },
    { icon: "plug", text: "Power points and switches" },
    { icon: "alert", text: "Any damage or problem areas" },
  ],
  bathroom: [
    { icon: "layout", text: "Full room from the doorway" },
    { icon: "shower", text: "Shower, bath, and tapware" },
    { icon: "sink", text: "Vanity and basin area" },
    { icon: "tiles", text: "Floor and wall tiles" },
    { icon: "alert", text: "Any water damage or mould" },
  ],
  laundry: [
    { icon: "layout", text: "Full room overview" },
    { icon: "cabinet", text: "Existing cabinetry and tub" },
    { icon: "plug", text: "Power and water connections" },
    { icon: "alert", text: "Any damage or problem areas" },
  ],
  living: [
    { icon: "layout", text: "Full room from multiple angles" },
    { icon: "floor", text: "Current flooring" },
    { icon: "wall", text: "Walls and any features to keep or remove" },
    { icon: "plug", text: "Power points and light switches" },
  ],
  outdoor: [
    { icon: "layout", text: "Full area overview" },
    { icon: "ground", text: "Current ground surface / deck" },
    { icon: "structure", text: "Any existing structures or roofing" },
    { icon: "boundary", text: "Connection to the house" },
  ],
};
```

### 8.4 Coaching Component

```tsx
function PhotoTips({ projectType, isCollapsed, onToggle }: PhotoTipsProps) {
  const tips = PHOTO_TIPS[projectType];

  return (
    <div className="rounded-lg border border-border bg-muted/30 p-4">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between text-left"
      >
        <div className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">
            Tips for better photos
          </span>
        </div>
        <ChevronDown className={cn(
          "h-4 w-4 text-muted-foreground transition-transform",
          isCollapsed && "-rotate-90"
        )} />
      </button>

      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <ul className="mt-3 space-y-1.5">
              {tips.map((tip) => (
                <li key={tip.text} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="h-1 w-1 shrink-0 rounded-full bg-primary" />
                  {tip.text}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-muted-foreground/70">
              The more detail you capture, the more accurate your scope will be.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

### 8.5 Post-Upload Micro-Coaching

After the user uploads 3+ photos, optionally show a brief suggestion if they are missing common angles. This is NOT a validation error -- it is a soft suggestion.

Example: After 3 kitchen photos, if no close-up of power points/switches is detected (V2 -- requires photo content analysis), show:

> "Tip: A close-up of your power points helps us scope your electrical work accurately."

For MVP, skip this -- it requires photo analysis integration. Just show the static tips.

---

## 9. Empty State to Populated State Transition

### 9.1 The Transition Problem

The upload zone starts as a large empty dropzone and needs to transform into a thumbnail grid as photos are added. A jarring switch between these two states feels broken. The transition should be smooth and obvious.

### 9.2 Recommended Pattern: Shrink-and-Grid

**Phase 1: Empty State (0 photos)**

Full-height dropzone with prominent call-to-action.

```
┌────────────────────────────────────────────┐
│                                            │
│              [Camera icon]                 │
│                                            │
│       Take or choose photos                │
│       of your current space                │
│                                            │
│   ─────────────────────────────────        │
│   JPG, PNG, HEIC, WebP   |   Up to 10MB   │
│                                            │
│                 3-10 photos required        │
│                                            │
└────────────────────────────────────────────┘
```

**Phase 2: First Photos Added (1-2 photos)**

Dropzone shrinks. Thumbnails appear in a grid. "Add More" tile fills the remaining space.

```
┌───────┐  ┌───────┐  ┌─ ─ ─ ─┐
│       │  │       │  │        │
│ Photo │  │ Photo │  │  Add   │
│   1   │  │   2   │  │  More  │
│       │  │       │  │  2/10  │
└───────┘  └───────┘  └─ ─ ─ ─┘

   2 of 3 minimum photos added
```

**Phase 3: Minimum Met (3+ photos)**

Same grid. Counter turns green/teal. "Continue" button becomes active.

```
┌───────┐  ┌───────┐  ┌───────┐
│ Photo │  │ Photo │  │ Photo │
│   1   │  │   2   │  │   3   │
└───────┘  └───────┘  └───────┘
┌─ ─ ─ ─┐
│  Add   │
│  More  │
│  3/10  │
└─ ─ ─ ─┘

   3 photos added -- looking good!
```

### 9.3 Animation Implementation

Use Framer Motion's `layout` prop on the grid container and `AnimatePresence` for entering/exiting thumbnails.

```tsx
function PhotoUploadZone({ files, projectType }: PhotoUploadZoneProps) {
  const hasFiles = files.length > 0;

  return (
    <div className="space-y-4">
      <PhotoTips
        projectType={projectType}
        isCollapsed={hasFiles}
        onToggle={toggleTips}
      />

      <AnimatePresence mode="wait">
        {!hasFiles ? (
          {/* Empty state dropzone */}
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <EmptyDropzone />
          </motion.div>
        ) : (
          {/* Populated thumbnail grid */}
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              <AnimatePresence>
                {files.map((file, i) => (
                  <PhotoThumbnail key={file.id} file={file} index={i} />
                ))}
              </AnimatePresence>

              {files.length < PHOTO_MAX_COUNT && (
                <AddMoreButton count={files.length} max={PHOTO_MAX_COUNT} />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Photo count and errors */}
      <PhotoCounter count={files.length} min={PHOTO_MIN_COUNT} max={PHOTO_MAX_COUNT} />

      <AnimatePresence>
        {uploadErrors.map((error, i) => (
          <UploadError key={i} error={error} onDismiss={() => dismissError(i)} />
        ))}
      </AnimatePresence>
    </div>
  );
}
```

### 9.4 Staggered Thumbnail Entry

When multiple photos are added at once (e.g., selecting 5 from gallery), stagger their appearance:

```tsx
<motion.div
  layout
  initial={{ opacity: 0, scale: 0.8 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.8 }}
  transition={{
    duration: 0.2,
    delay: index * 0.05, // 50ms stagger between each thumbnail
  }}
>
```

---

## 10. Minimum Count Enforcement

### 10.1 Principle: Progress, Not Error

Showing "3 photos required, you have 1" as a red error is hostile. The user just started. Instead, frame it as **progress toward a goal** -- like a completion indicator, not a validation error.

### 10.2 Visual Design: Counter Strip

Display a counter below the upload zone that shifts from neutral to positive as the minimum is reached.

| Photos Uploaded | Display | Colour | Tone |
|---|---|---|---|
| 0 | "Upload at least 3 photos to continue" | `text-muted-foreground` | Neutral instruction |
| 1 | "1 of 3 minimum photos added" | `text-muted-foreground` | Progress |
| 2 | "2 of 3 minimum photos added" | `text-muted-foreground` | Progress |
| 3 | "3 photos added -- nice!" | `text-primary` | Positive reinforcement |
| 4-9 | "4 photos added (up to 10)" | `text-primary` | Informational |
| 10 | "10 photos added (maximum)" | `text-primary` | Complete |

### 10.3 Counter Component

```tsx
function PhotoCounter({ count, min, max }: { count: number; min: number; max: number }) {
  const meetsMinimum = count >= min;

  return (
    <div className="flex items-center gap-2">
      {/* Dot indicators for minimum */}
      <div className="flex gap-1">
        {Array.from({ length: min }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1.5 w-1.5 rounded-full transition-colors duration-300",
              i < count ? "bg-primary" : "bg-border"
            )}
          />
        ))}
      </div>

      {/* Text */}
      <p className={cn(
        "text-sm transition-colors duration-300",
        meetsMinimum ? "text-primary" : "text-muted-foreground"
      )}>
        {count === 0 && "Upload at least 3 photos to continue"}
        {count > 0 && count < min && `${count} of ${min} minimum photos added`}
        {count === min && `${count} photos added -- nice!`}
        {count > min && count < max && `${count} photos added (up to ${max})`}
        {count === max && `${count} photos added (maximum)`}
      </p>
    </div>
  );
}
```

### 10.4 Continue Button State

The "Continue" button at the bottom of the step should be:

- **Disabled** when `count < 3` -- greyed out with `cursor-not-allowed`
- **Enabled** when `count >= 3` -- teal primary colour
- **No tooltip on disabled** -- the counter text above already explains why

Do NOT show a toast or modal when the user taps a disabled Continue button. The visual state is sufficient.

```tsx
<Button
  onClick={handleContinue}
  disabled={files.length < PHOTO_MIN_COUNT || hasUploadingFiles}
  className="w-full"
  size="lg"
>
  {hasUploadingFiles ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Uploading...
    </>
  ) : (
    "Continue"
  )}
</Button>
```

### 10.5 Do Not Block the Continue Until Uploads Complete

If the user has selected 5 files and 3 have finished uploading while 2 are still in progress, the Continue button should show "Uploading..." and remain disabled. It enables only when ALL selected files have completed (or been explicitly removed).

---

## 11. HEIC Handling

### 11.1 The Problem

iPhones default to HEIC format for photos. HEIC is NOT supported by any browser for rendering except Safari. If a user uploads a HEIC file from their iOS gallery, `URL.createObjectURL()` will fail to produce a displayable image in Chrome or Firefox.

### 11.2 When It Matters for ScopeAI

- **User on iPhone Safari:** HEIC files render in thumbnails natively. No issue.
- **User on iPhone Chrome:** HEIC files cannot be rendered as thumbnails. However, iPhone Chrome uses the native iOS file picker which may automatically convert to JPEG. Testing required.
- **User on desktop (any browser):** User may AirDrop or transfer HEIC files from iPhone. These will not render as thumbnails in Chrome/Firefox.

### 11.3 Recommended Approach

**For MVP: Accept HEIC files, show a placeholder thumbnail when the preview fails.**

The AI (Gemini Vision) can process HEIC files. The upload to Convex succeeds regardless of format. The only issue is the client-side thumbnail preview.

```tsx
function SafeImage({ src, alt, className }: { src: string; alt: string; className: string }) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className={cn("flex items-center justify-center bg-muted", className)}>
        <ImageIcon className="h-6 w-6 text-muted-foreground" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      onLoad={() => URL.revokeObjectURL(src)}
    />
  );
}
```

**For V2:** Use the `heic2any` library for client-side conversion to JPEG for preview only. The original HEIC file is still uploaded to Convex. Note: `heic2any` is 2.7 MB -- consider lazy-loading it only when a HEIC file is detected.

```typescript
// V2: Lazy-load HEIC conversion
async function generatePreview(file: File): Promise<string> {
  if (file.type === "image/heic") {
    const heic2any = (await import("heic2any")).default;
    const blob = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.5 });
    return URL.createObjectURL(blob as Blob);
  }
  return URL.createObjectURL(file);
}
```

---

## 12. Recommended Component Architecture

### 12.1 Component Tree

```
PhotoUpload.tsx (Step 3 container)
├── PhotoTips.tsx (collapsible coaching panel)
├── PhotoUploadZone.tsx (manages empty/populated state)
│   ├── EmptyDropzone.tsx (full dropzone for desktop)
│   ├── MobileCaptureButtons.tsx (camera + gallery buttons for mobile)
│   ├── ThumbnailGrid.tsx (grid of uploaded photos)
│   │   ├── PhotoThumbnail.tsx (individual thumbnail with progress/remove)
│   │   │   ├── ProgressOverlay.tsx (circular upload progress)
│   │   │   └── RetryOverlay.tsx (failed upload with retry)
│   │   └── AddMoreButton.tsx (dashed "+" tile)
│   └── UploadError.tsx (inline error banner)
├── PhotoCounter.tsx (progress dots + count text)
└── ContinueButton (enabled when min reached + all uploads complete)
```

### 12.2 State Management

```typescript
interface UploadedFile {
  id: string;             // unique client-side ID (crypto.randomUUID())
  file: File;             // original File object
  name: string;           // display name
  size: number;           // bytes
  preview: string;        // object URL for thumbnail
  status: "pending" | "uploading" | "complete" | "failed";
  progress: number;       // 0-1 upload progress
  storageId?: string;     // Convex storage ID (set on completion)
  error?: string;         // error message if failed
}

interface PhotoUploadState {
  files: UploadedFile[];
  errors: FileError[];    // validation errors (type, size, count)
  tipsCollapsed: boolean;
}
```

### 12.3 Custom Hook: usePhotoUpload

Encapsulate all upload logic in a single hook:

```typescript
function usePhotoUpload(sessionId: string) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [errors, setErrors] = useState<FileError[]>([]);
  const generateUploadUrl = useMutation(api.photos.generateUploadUrl);
  const savePhoto = useMutation(api.photos.savePhoto);

  const addFiles = useCallback(async (acceptedFiles: File[]) => {
    // Create UploadedFile objects with previews
    // Start uploading each file to Convex
    // Update progress state as uploads progress
    // On completion, call savePhoto mutation
  }, []);

  const removeFile = useCallback((fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  }, []);

  const retryFile = useCallback(async (fileId: string) => {
    // Reset status to "uploading" and re-attempt upload
  }, []);

  return {
    files,
    errors,
    addFiles,
    removeFile,
    retryFile,
    isUploading: files.some((f) => f.status === "uploading"),
    meetsMinimum: files.filter((f) => f.status === "complete").length >= PHOTO_MIN_COUNT,
    clearErrors: () => setErrors([]),
  };
}
```

---

## 13. Complete Implementation Reference

### 13.1 Full PhotoUpload Step Component

```tsx
"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, ImageIcon, Lightbulb, Plus, X, Loader2, AlertCircle } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PHOTO_MIN_COUNT, PHOTO_MAX_COUNT, PHOTO_MAX_SIZE_MB, PHOTO_ACCEPTED_TYPES } from "@/lib/constants";

export function PhotoUpload({
  projectType,
  sessionId,
  onContinue,
}: {
  projectType: ProjectType;
  sessionId: string;
  onContinue: () => void;
}) {
  const {
    files,
    errors,
    addFiles,
    removeFile,
    retryFile,
    isUploading,
    meetsMinimum,
    clearErrors,
  } = usePhotoUpload(sessionId);

  const [tipsCollapsed, setTipsCollapsed] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/heic": [".heic"],
      "image/webp": [".webp"],
    },
    maxFiles: PHOTO_MAX_COUNT - files.length,
    maxSize: PHOTO_MAX_SIZE_MB * 1024 * 1024,
    onDrop: (accepted) => {
      clearErrors();
      addFiles(accepted);
    },
    onDropRejected: handleRejection,
    disabled: files.length >= PHOTO_MAX_COUNT,
  });

  const hasFiles = files.length > 0;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Coaching tips */}
      <PhotoTips
        projectType={projectType}
        isCollapsed={hasFiles && tipsCollapsed}
        onToggle={() => setTipsCollapsed(!tipsCollapsed)}
      />

      {/* Upload zone: empty state or thumbnail grid */}
      <AnimatePresence mode="wait">
        {!hasFiles ? (
          <motion.div
            key="empty"
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {/* Desktop: dropzone */}
            <div
              {...getRootProps()}
              className={cn(
                "hidden cursor-pointer flex-col items-center justify-center gap-4 rounded-lg",
                "border-2 border-dashed p-12 text-center transition-all duration-150",
                "md:flex",
                isDragActive
                  ? "border-primary bg-primary/5 scale-[1.01]"
                  : "border-border bg-muted/30 hover:border-primary/50 hover:bg-muted/50"
              )}
            >
              <input {...getInputProps()} />
              <Camera className="h-10 w-10 text-muted-foreground" />
              <div>
                <p className="text-base font-medium">
                  Drag photos here or click to browse
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  JPG, PNG, HEIC, WebP -- up to {PHOTO_MAX_SIZE_MB}MB each
                </p>
              </div>
            </div>

            {/* Mobile: camera + gallery buttons */}
            <MobileCaptureButtons onFilesSelected={addFiles} />
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              <AnimatePresence>
                {files.map((file, i) => (
                  <PhotoThumbnail
                    key={file.id}
                    file={file}
                    index={i}
                    onRemove={() => removeFile(file.id)}
                    onRetry={() => retryFile(file.id)}
                  />
                ))}
              </AnimatePresence>
              {files.length < PHOTO_MAX_COUNT && (
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  <AddMoreButton count={files.length} max={PHOTO_MAX_COUNT} />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Errors */}
      <AnimatePresence>
        {errors.map((error, i) => (
          <UploadError
            key={`error-${i}`}
            error={error}
            onDismiss={() => dismissError(i)}
          />
        ))}
      </AnimatePresence>

      {/* Counter */}
      <PhotoCounter
        count={files.filter((f) => f.status === "complete").length}
        min={PHOTO_MIN_COUNT}
        max={PHOTO_MAX_COUNT}
      />

      {/* Continue */}
      <Button
        onClick={onContinue}
        disabled={!meetsMinimum || isUploading}
        className="w-full"
        size="lg"
      >
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          "Continue"
        )}
      </Button>
    </div>
  );
}
```

### 13.2 Key Tailwind Classes Summary

| Element | Classes |
|---|---|
| Dropzone (default) | `border-2 border-dashed border-border bg-muted/30 rounded-lg p-12` |
| Dropzone (drag active) | `border-primary bg-primary/5 scale-[1.01]` |
| Dropzone (drag reject) | `border-destructive bg-destructive/5` |
| Thumbnail grid | `grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4` |
| Thumbnail container | `relative aspect-square overflow-hidden rounded-lg border border-border bg-muted` |
| Thumbnail image | `h-full w-full object-cover` |
| Remove button (visual) | `h-6 w-6 rounded-full bg-black/60 text-white backdrop-blur-sm` |
| Remove button (tap target) | `absolute -right-1 -top-1 h-8 w-8` (larger invisible hit area) |
| Add more tile | `aspect-square border-2 border-dashed border-border bg-muted/30 rounded-lg` |
| Error banner | `rounded-md border border-destructive/20 bg-destructive/5 p-3` |
| Counter text (progress) | `text-sm text-muted-foreground` |
| Counter text (met) | `text-sm text-primary` |
| Counter dot (filled) | `h-1.5 w-1.5 rounded-full bg-primary` |
| Counter dot (empty) | `h-1.5 w-1.5 rounded-full bg-border` |
| Progress overlay | `absolute inset-0 bg-black/40 rounded-lg` |
| Mobile button | `rounded-lg border-2 border-dashed border-border bg-muted/30 p-6` |

### 13.3 Framer Motion Variants Summary

| Animation | Properties |
|---|---|
| Thumbnail enter | `initial={{ opacity: 0, scale: 0.8 }}` `animate={{ opacity: 1, scale: 1 }}` `transition={{ duration: 0.2, delay: index * 0.05 }}` |
| Thumbnail exit | `exit={{ opacity: 0, scale: 0.8 }}` `transition={{ duration: 0.15 }}` |
| Grid rearrangement | `layout` prop on each thumbnail `motion.div` |
| Error enter | `initial={{ opacity: 0, y: -8 }}` `animate={{ opacity: 1, y: 0 }}` |
| Error exit | `exit={{ opacity: 0, y: -8 }}` |
| Dropzone to grid | `AnimatePresence mode="wait"` on parent, `exit={{ opacity: 0, scale: 0.95 }}` on dropzone |
| Tips collapse | `initial={{ height: 0, opacity: 0 }}` `animate={{ height: "auto", opacity: 1 }}` |

### 13.4 Accessibility Checklist

| Requirement | Implementation |
|---|---|
| Keyboard navigable dropzone | react-dropzone handles this via `getRootProps()` which adds `tabIndex`, `role`, `onKeyDown` |
| Screen reader labels | `aria-label` on remove buttons, dropzone has descriptive text |
| Focus ring on interactive elements | `ring-primary` via shadcn/ui defaults |
| Error announcements | Use `role="alert"` on error banners for screen reader announcement |
| Reduced motion support | Wrap Framer Motion in `useReducedMotion()` check; fall back to instant transitions |
| Touch target size | Minimum 44x44px for all tappable elements on mobile |
| Colour contrast | All text meets WCAG AA; teal on white passes at the selected hue |

---

## Sources

- [UX Best Practices for File Uploaders -- Uploadcare](https://uploadcare.com/blog/file-uploader-ux-best-practices/)
- [File Upload Validation Guide -- Uploadcare](https://uploadcare.com/blog/file-validators/)
- [Drag-and-Drop UX: Ease of Use -- Nielsen Norman Group](https://www.nngroup.com/articles/drag-drop/)
- [Drag-and-Drop UX Guidelines -- Smart Interface Design Patterns](https://smart-interface-design-patterns.com/articles/drag-and-drop-ux/)
- [Drag & Drop: Think Twice -- Dave Feldman](https://blog.dfeldman.co/drag-drop-think-twice-49e7bf3e6b31)
- [Camera Capture on Mobile -- DEV Community](https://dev.to/626tech/how-to-capture-a-cameras-input-on-a-mobile-device-using-element-2c5m)
- [File Picker and Camera on Android -- GitHub Gist](https://gist.github.com/danawoodman/4788404bc620d5392d111dba98c73873)
- [react-dropzone Documentation](https://react-dropzone.js.org/)
- [shadcn-dropzone -- GitHub](https://github.com/diragb/shadcn-dropzone)
- [sadmann7/file-uploader -- GitHub](https://github.com/sadmann7/file-uploader)
- [Handling HEIC on the Web -- Upside Lab](https://upsidelab.io/blog/handling-heic-on-the-web)
- [heic2any -- Client-side HEIC Conversion](https://alexcorvi.github.io/heic2any/)
- [Framer Motion Layout Animations](https://motion.dev/docs/react-layout-animations)
- [Framer Motion Stagger](https://www.framer.com/motion/stagger/)
- [FilePond -- File Upload Library](https://pqina.nl/filepond/)
- [Building Modern Drag-and-Drop Upload UI -- Filestack](https://blog.filestack.com/building-modern-drag-and-drop-upload-ui/)
