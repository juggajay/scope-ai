# Research: Wizard State & Recovery

**Section:** 7 of UX Research Series
**Date:** February 2026
**Scope:** ScopeAI 7-step creation wizard (`/create`)
**Stack:** Next.js 14+ (App Router) + Convex + shadcn/ui + Tailwind CSS v4

---

## Table of Contents

1. [Save and Resume](#1-save-and-resume)
2. [Browser Back Button](#2-browser-back-button)
3. [URL State](#3-url-state)
4. [Accidental Navigation](#4-accidental-navigation)
5. [Session Timeout](#5-session-timeout)
6. [Mobile Interruptions](#6-mobile-interruptions)
7. [Implementation Recommendations](#7-implementation-recommendations)

---

## 1. Save and Resume

### 1.1 The Core Question

ScopeAI's wizard collects data across 7 steps before generating scopes. Users invest 5-10 minutes completing this flow. The question is: what happens if they leave mid-flow?

The architecture (ARCHITECTURE.md Section 5.4) establishes that Steps 0-4 are anonymous (no Convex project exists yet), and a project is only created in Convex at the auth gate (Step 5). This creates a split persistence model:

```
Steps 0-4: Client-side only (no project in DB)
Step 5:    Auth gate -- project created in Convex
Steps 6+:  Server-persisted (project exists, Convex reactive queries)
```

### 1.2 Persistence Strategy by Phase

#### Phase A: Pre-Auth (Steps 0-4) -- Client-Side Persistence

Since no Convex project exists yet, data must be saved client-side. The options are:

| Storage Method | Survives Refresh | Survives Tab Close | Capacity | Recommended |
|----------------|------------------|--------------------|----------|-------------|
| React state (useState/context) | No | No | Unlimited | For active session only |
| sessionStorage | Yes | No | ~5MB | For tab recovery |
| localStorage | Yes | Yes | ~5MB | For cross-session resume |
| IndexedDB | Yes | Yes | Large | Overkill for this data |

**Recommendation: Dual-layer -- React Context + localStorage.**

- React Context holds the canonical state during the active session (fast reads, no serialisation overhead).
- localStorage mirrors the state on each step transition as a backup. This lets users close the tab, come back hours later, and resume.
- Photos are the exception -- they are uploaded to Convex file storage immediately (already decided in ARCHITECTURE.md), linked to a temporary `sessionId`. The localStorage backup stores the `sessionId` and photo metadata (filenames, storageIds), not the photo bytes.

**Granularity: Per-step, not per-field.** Save to localStorage when the user completes a step and advances. Per-field saving (debounced on every keystroke) adds complexity and is unnecessary -- the longest text input is the optional description field. If a user loses one step of progress, they can redo it in under 30 seconds.

Exception: The Project Setup step (Step 1) has a form with 4+ fields. Save this step's form state to localStorage on `beforeunload` as a safety net.

#### Phase B: Post-Auth (Steps 5+) -- Convex Persistence

Once the project is created in Convex at the auth gate, all state is server-persisted and reactive. No additional client-side persistence is needed for these steps.

- The generation step (Step 6) is a background Convex action -- progress is tracked in `project.generationProgress` and the client subscribes via `useQuery`. If the user leaves and returns, they can reconnect to the live progress.
- The preview step (Step 7) reads from `getScopes()` -- data is already in Convex.

### 1.3 Implementation: Wizard State Provider

```tsx
// lib/wizard/WizardContext.tsx
"use client";

import { createContext, useContext, useReducer, useEffect, useCallback } from "react";
import type { ProjectMode, ProjectType, PropertyDetails, QuestionAnswers } from "@/types";

// ---- State Shape ----

interface WizardState {
  step: number;
  sessionId: string;           // UUID for anonymous photo linking
  mode: ProjectMode | null;
  projectType: ProjectType | null;
  propertyDetails: Partial<PropertyDetails>;
  description: string;
  photoIds: string[];          // Convex storageIds
  photoMeta: { storageId: string; filename: string }[];
  answers: QuestionAnswers;
  projectId: string | null;    // set after auth gate
}

const STORAGE_KEY = "scopeai_wizard_state";

// ---- Initial State ----

function getInitialState(): WizardState {
  // Attempt to restore from localStorage on mount
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Validate the saved state has expected shape
        if (parsed && typeof parsed.step === "number" && parsed.sessionId) {
          return parsed;
        }
      }
    } catch {
      // Corrupted storage -- ignore
    }
  }

  return {
    step: 0,
    sessionId: crypto.randomUUID(),
    mode: null,
    projectType: null,
    propertyDetails: {},
    description: "",
    photoIds: [],
    photoMeta: [],
    answers: {},
    projectId: null,
  };
}

// ---- Reducer ----

type WizardAction =
  | { type: "SET_STEP"; step: number }
  | { type: "SET_MODE"; mode: ProjectMode }
  | { type: "SET_PROJECT_TYPE"; projectType: ProjectType }
  | { type: "SET_PROPERTY_DETAILS"; details: Partial<PropertyDetails> }
  | { type: "SET_DESCRIPTION"; description: string }
  | { type: "ADD_PHOTO"; storageId: string; filename: string }
  | { type: "REMOVE_PHOTO"; storageId: string }
  | { type: "SET_ANSWER"; questionId: string; answer: string | string[] }
  | { type: "SET_PROJECT_ID"; projectId: string }
  | { type: "RESET" };

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, step: action.step };
    case "SET_MODE":
      return { ...state, mode: action.mode };
    case "SET_PROJECT_TYPE":
      return { ...state, projectType: action.projectType };
    case "SET_PROPERTY_DETAILS":
      return { ...state, propertyDetails: { ...state.propertyDetails, ...action.details } };
    case "SET_DESCRIPTION":
      return { ...state, description: action.description };
    case "ADD_PHOTO":
      return {
        ...state,
        photoIds: [...state.photoIds, action.storageId],
        photoMeta: [...state.photoMeta, { storageId: action.storageId, filename: action.filename }],
      };
    case "REMOVE_PHOTO":
      return {
        ...state,
        photoIds: state.photoIds.filter(id => id !== action.storageId),
        photoMeta: state.photoMeta.filter(p => p.storageId !== action.storageId),
      };
    case "SET_ANSWER":
      return { ...state, answers: { ...state.answers, [action.questionId]: action.answer } };
    case "SET_PROJECT_ID":
      return { ...state, projectId: action.projectId };
    case "RESET":
      return { ...getInitialState(), sessionId: crypto.randomUUID() };
    default:
      return state;
  }
}

// ---- Context ----

interface WizardContextValue {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
  saveToStorage: () => void;
  clearStorage: () => void;
  isRestoredSession: boolean;
}

const WizardContext = createContext<WizardContextValue | null>(null);

export function WizardProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(wizardReducer, undefined, getInitialState);
  const isRestoredSession = state.step > 0 && state.projectId === null;

  const saveToStorage = useCallback(() => {
    try {
      // Only save pre-auth state. Post-auth state lives in Convex.
      if (!state.projectId) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      }
    } catch {
      // Storage full or unavailable -- fail silently
    }
  }, [state]);

  const clearStorage = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Save to localStorage on step changes (per-step granularity)
  useEffect(() => {
    saveToStorage();
  }, [state.step, saveToStorage]);

  // Save on beforeunload as safety net
  useEffect(() => {
    const handleBeforeUnload = () => saveToStorage();
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [saveToStorage]);

  return (
    <WizardContext.Provider value={{ state, dispatch, saveToStorage, clearStorage, isRestoredSession }}>
      {children}
    </WizardContext.Provider>
  );
}

export function useWizard() {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error("useWizard must be used within WizardProvider");
  return ctx;
}
```

### 1.4 Resume Experience

When a user returns and `isRestoredSession` is `true`, show a toast or inline banner:

```
"Welcome back! You were working on a kitchen renovation scope. Pick up where you left off?"
[Continue]  [Start Fresh]
```

- **Continue** -- navigates to the saved step.
- **Start Fresh** -- calls `clearStorage()` and `dispatch({ type: "RESET" })`.

Do NOT auto-resume silently. The user may have intended to abandon and start a new project. Always give them the choice.

### 1.5 Convex Integration for Post-Auth State

After the auth gate creates a project, the wizard state transitions from client-managed to server-managed:

```tsx
// After auth gate -- creating the project in Convex
const createProject = useMutation(api.projects.createProjectFromSession);

async function handleAuthComplete(userId: string) {
  const projectId = await createProject({
    userId,
    sessionId: state.sessionId,
    mode: state.mode!,
    projectType: state.projectType!,
    propertyDetails: state.propertyDetails as PropertyDetails,
    answers: state.answers,
    description: state.description,
  });

  dispatch({ type: "SET_PROJECT_ID", projectId });
  clearStorage(); // No longer need localStorage -- data is in Convex
  dispatch({ type: "SET_STEP", step: 5 }); // Advance to generation
}
```

For Steps 6-7, the wizard reads directly from Convex:

```tsx
// GeneratingState component
const project = useQuery(api.projects.getProject, { projectId: state.projectId! });
// project.generationProgress updates in real-time via Convex reactive subscription
```

---

## 2. Browser Back Button

### 2.1 The Problem

Multi-step wizards and the browser back button are a well-known UX conflict. Users have three mental models:

1. **"Back means previous step"** -- most common expectation inside a wizard.
2. **"Back means leave the wizard"** -- if they arrived from the landing page, back should go there.
3. **"Back does nothing"** -- some users use back as "undo" and are confused when the page changes.

Research consistently shows that users in a multi-step form expect the back button to go to the previous step, not leave the form entirely. This is especially true on mobile where the back button/gesture is a primary navigation mechanism.

### 2.2 Recommended Approach: History Stack Integration

Each wizard step should push a history entry so the browser back button navigates to the previous step. This is the approach used by major multi-step flows (Google Checkout, TurboTax, Typeform).

**Implementation using `window.history.pushState`:**

The Next.js App Router provides `useSearchParams` and `useRouter` for URL manipulation. For the wizard, use `window.history.pushState` to manage the step in the URL without triggering a full Next.js navigation:

```tsx
// app/create/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";
import { useWizard } from "@/lib/wizard/WizardContext";

export default function CreatePage() {
  const searchParams = useSearchParams();
  const { state, dispatch } = useWizard();

  // Read step from URL on mount
  useEffect(() => {
    const urlStep = searchParams.get("step");
    if (urlStep !== null) {
      const stepNum = parseInt(urlStep, 10);
      if (!isNaN(stepNum) && stepNum >= 0 && stepNum <= 6) {
        dispatch({ type: "SET_STEP", step: stepNum });
      }
    }
  }, []); // Only on mount

  // Push step to URL when step changes (via Next/Back buttons)
  const goToStep = useCallback((newStep: number) => {
    dispatch({ type: "SET_STEP", step: newStep });
    window.history.pushState(
      { step: newStep },
      "",
      `/create?step=${newStep}`
    );
  }, [dispatch]);

  // Handle browser back/forward
  useEffect(() => {
    function handlePopState(event: PopStateEvent) {
      if (event.state && typeof event.state.step === "number") {
        dispatch({ type: "SET_STEP", step: event.state.step });
      }
    }
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [dispatch]);

  return <WizardStepRenderer step={state.step} goToStep={goToStep} />;
}
```

### 2.3 Back Button Rules by Step

Not all back navigation should be allowed equally. Define rules:

| From Step | Back Goes To | Notes |
|-----------|-------------|-------|
| 0 (Mode) | Landing page (`/`) | Normal browser back -- leaves wizard |
| 1 (Project Setup) | Step 0 (Mode) | Previous step |
| 2 (Photos) | Step 1 (Project Setup) | Previous step |
| 3 (Questions) | Step 2 (Photos) | Previous step. Answers preserved. |
| 4 (Auth Gate) | Step 3 (Questions) | Previous step |
| 5 (Generating) | BLOCKED | Cannot go back during generation -- see below |
| 6 (Preview) | BLOCKED | Scope already generated -- going back makes no sense |

**Generation step (Step 5): Block back navigation.** Once scope generation starts, going back would abandon the generation. Replace the history entry instead of pushing:

```tsx
// When entering the generation step
window.history.replaceState(
  { step: 5 },
  "",
  "/create?step=5"
);
```

This replaces the current entry rather than adding one, so the back button skips over the generation step.

### 2.4 Step 0 Back Navigation -- Landing Page

When the user is on Step 0 (Mode Selection) and hits the browser back button, they should return to wherever they came from (usually the landing page). Since Step 0 is the first history entry pushed by the wizard, the browser's native back behaviour handles this correctly -- no special code needed.

### 2.5 Forward Navigation Guards

The browser forward button should also work. If a user goes back from Step 3 to Step 2, then clicks forward, they should return to Step 3 with their answers intact. This works automatically with the `pushState` approach because the state is preserved in the React context.

However, guard against forward-skipping:

```tsx
// Prevent user from manually navigating to /create?step=5 without completing prior steps
function validateStepAccess(step: number, state: WizardState): boolean {
  if (step >= 1 && !state.mode) return false;          // Need mode
  if (step >= 2 && !state.projectType) return false;   // Need project type
  if (step >= 3 && state.photoIds.length < 3) return false; // Need photos
  if (step >= 4 && Object.keys(state.answers).length === 0) return false; // Need answers
  if (step >= 5 && !state.projectId) return false;     // Need auth
  return true;
}
```

---

## 3. URL State

### 3.1 Should Each Step Have Its Own URL?

**Yes. Use `/create?step=N` pattern.**

The decision factors:

| Factor | Separate URLs (`?step=N`) | Client-only state | Verdict |
|--------|--------------------------|-------------------|---------|
| Browser back button | Works naturally with pushState | Requires custom handling | URL wins |
| Deep linking | Can share `/create?step=2` | Cannot link to a specific step | URL wins |
| Analytics | Track funnel per step via URL | Need custom events | URL wins |
| SEO | No benefit (wizard is noindex) | Same | Tie |
| Complexity | Slightly more setup | Simpler | Client wins |
| Shareability | Users can bookmark mid-flow | Cannot bookmark | URL wins |
| State restoration | URL indicates where user was | Must infer from stored state | URL wins |

**URL format:** `/create?step=0` through `/create?step=6`

**Do NOT use separate routes** (e.g., `/create/mode`, `/create/photos`). Reasons:

1. The wizard is a single client component -- splitting into routes would cause layout shifts, loading states, and component remounting on each step.
2. The Next.js App Router would treat each as a separate page, losing React state between navigations unless lifted to a layout.
3. A query parameter on a single route is simpler and aligns with how the architecture describes it: "/create Flow -- Client-side" (ARCHITECTURE.md Section 2).

### 3.2 SEO Implications

The `/create` route should be `noindex` (already specified in BUILD.md Phase 10.5). The step query parameter has zero SEO impact since search engines will not index this page. No canonical URL concerns.

```tsx
// app/create/page.tsx -- metadata
export const metadata = {
  robots: "noindex, nofollow",
};
```

Note: Since this is a client component (`"use client"`), metadata must be set in a parent layout or via a `generateMetadata` function in a server component wrapper.

### 3.3 URL State Implementation with Next.js App Router

Next.js App Router provides `useSearchParams()` for reading query parameters. For writing, use `window.history.pushState` (not `router.push`) to avoid triggering a full navigation:

```tsx
import { useSearchParams } from "next/navigation";

function useWizardStep() {
  const searchParams = useSearchParams();
  const currentStep = parseInt(searchParams.get("step") ?? "0", 10);

  function setStep(step: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("step", String(step));
    window.history.pushState({ step }, "", `/create?${params.toString()}`);
  }

  return { currentStep, setStep };
}
```

**Why `window.history.pushState` instead of `router.push`?**

- `router.push` triggers a Next.js navigation which can cause re-renders, Suspense boundaries, and loading states.
- `window.history.pushState` updates the URL and history stack without any navigation side effects.
- The React state (via context) is the source of truth -- the URL is a mirror for browser integration.
- Next.js explicitly documents this as a valid pattern for URL state management.

### 3.4 What Belongs in the URL vs. Context

| Data | URL | Context | localStorage |
|------|-----|---------|-------------|
| Current step | Yes (`?step=3`) | Yes (source of truth) | Yes (backup) |
| Mode | No | Yes | Yes |
| Project type | No | Yes | Yes |
| Property details | No | Yes | Yes |
| Photo references | No | Yes | Yes |
| Answers | No | Yes | Yes |
| Project ID (post-auth) | No | Yes | No (in Convex) |

Only the step number belongs in the URL. Everything else is too large, too sensitive, or unnecessary for URL representation. The URL serves two purposes: browser history integration and analytics tracking.

### 3.5 Initial URL on Wizard Entry

When a user clicks "Start My Scope" from the landing page, they navigate to `/create`. The wizard should immediately replace the URL with `/create?step=0`:

```tsx
useEffect(() => {
  const urlStep = searchParams.get("step");
  if (urlStep === null) {
    // No step in URL -- set it
    window.history.replaceState({ step: 0 }, "", "/create?step=0");
  }
}, []);
```

Use `replaceState` (not `pushState`) here so the back button from Step 0 goes to the landing page, not to `/create` without a step param.

---

## 4. Accidental Navigation

### 4.1 When to Show "Are You Sure?"

The `beforeunload` event is the browser mechanism for preventing accidental navigation away. It shows a system-level dialog: "Changes you made may not be saved. Leave site?"

**Rules for when to trigger this:**

| Scenario | Show Warning? | Reason |
|----------|-------------|--------|
| User is on Step 0 (Mode), hasn't selected anything | No | Nothing to lose |
| User is on Step 0, has selected a mode | No | Trivial to redo |
| User is on Step 1, has filled property details | No | Saved to localStorage, can resume |
| User is on Step 2, has uploaded photos | **Yes** | Photos are uploaded but flow is incomplete |
| User is on Step 3, answering questions | **Yes** | 2-3 minutes of work at risk |
| User is on Step 4 (Auth Gate) | **Yes** | All pre-auth work at risk if not saved |
| User is on Step 5 (Generating) | **Yes** | Generation in progress |
| User is on Step 6 (Preview) | No | Data is saved in Convex |

**Principle: Only warn when meaningful work would be lost AND the work is not yet persisted to a recoverable location.**

Since our implementation saves to localStorage on step transitions, the actual data loss risk is low. The warning is most important during photo upload (photos are in Convex storage, but the wizard state linking them to a future project may be lost if localStorage write hasn't happened yet) and during active form filling within a step.

### 4.2 Implementation

```tsx
// hooks/useUnsavedChangesWarning.ts
"use client";

import { useEffect } from "react";

export function useUnsavedChangesWarning(shouldWarn: boolean) {
  useEffect(() => {
    if (!shouldWarn) return;

    function handleBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault();
      // Modern browsers ignore custom messages -- they show a generic prompt
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [shouldWarn]);
}
```

Usage in the wizard:

```tsx
function CreatePage() {
  const { state } = useWizard();

  // Warn if user has meaningful progress and hasn't reached server-persisted state
  const hasProgress = state.step >= 2 && !state.projectId;
  useUnsavedChangesWarning(hasProgress);

  // ... rest of wizard
}
```

### 4.3 In-App Navigation Guards

For in-app navigation (clicking "ScopeAI" logo, "Start My Scope" in header, etc.), do NOT use `beforeunload`. Instead, use a custom confirmation dialog via shadcn/ui's `AlertDialog`:

```tsx
// components/create/NavigationGuard.tsx
"use client";

import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState, useCallback } from "react";
import { useWizard } from "@/lib/wizard/WizardContext";

export function useNavigationGuard() {
  const { state, saveToStorage } = useWizard();
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  const router = useRouter();

  const hasUnsavedProgress = state.step >= 2 && !state.projectId;

  const navigateTo = useCallback((url: string) => {
    if (hasUnsavedProgress) {
      setPendingUrl(url);  // Show dialog
    } else {
      router.push(url);
    }
  }, [hasUnsavedProgress, router]);

  const confirmLeave = useCallback(() => {
    saveToStorage(); // Save current state before leaving
    if (pendingUrl) {
      router.push(pendingUrl);
      setPendingUrl(null);
    }
  }, [pendingUrl, router, saveToStorage]);

  const cancelLeave = useCallback(() => {
    setPendingUrl(null);
  }, []);

  return { navigateTo, pendingUrl, confirmLeave, cancelLeave };
}

export function NavigationGuardDialog({
  pendingUrl,
  onConfirm,
  onCancel,
}: {
  pendingUrl: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <AlertDialog open={pendingUrl !== null}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Leave scope creation?</AlertDialogTitle>
          <AlertDialogDescription>
            Your progress has been saved. You can resume where you left off
            when you come back.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Stay</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Leave</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
```

### 4.4 Tone and Copy

The confirmation message should be reassuring, not scary:

- **Bad:** "Warning! You will lose all your progress!"
- **Good:** "Your progress has been saved. You can resume where you left off when you come back."

The message acknowledges that we save their data and frames leaving as a choice, not a loss. This reduces anxiety (PRD UX Principle 4: Build Confidence).

---

## 5. Session Timeout

### 5.1 Scenario Analysis

What happens when a user leaves the wizard and comes back later?

| Return Timing | State Location | User Experience |
|--------------|---------------|-----------------|
| Same tab, seconds later | React context | Seamless -- exactly where they left off |
| Same tab, hours later (no refresh) | React context | Seamless -- React state survives |
| New tab, minutes later | localStorage | Resume prompt: "Welcome back!" |
| New tab, hours later | localStorage | Resume prompt: "Welcome back!" |
| New tab, days later | localStorage | Resume prompt with stale data warning |
| Different device | Nothing saved | Fresh start (no cross-device sync pre-auth) |

### 5.2 Stale Session Handling

LocalStorage has no built-in TTL. We need to handle the case where saved data is very old:

```tsx
interface WizardState {
  // ... existing fields ...
  savedAt: number; // timestamp when state was last saved
}

const STALE_THRESHOLD_HOURS = 48; // 2 days

function isSessionStale(state: WizardState): boolean {
  if (!state.savedAt) return false;
  const hoursElapsed = (Date.now() - state.savedAt) / (1000 * 60 * 60);
  return hoursElapsed > STALE_THRESHOLD_HOURS;
}
```

If the session is stale:

```
"You started a kitchen renovation scope 3 days ago. Would you like to continue or start fresh?"
[Continue Where I Left Off]  [Start New Scope]
```

### 5.3 Photo Expiry Consideration

Convex file storage URLs do not expire, but orphaned files (uploaded but never linked to a project) should be cleaned up. If a user uploaded photos 48+ hours ago but never completed the flow:

- The photos exist in Convex storage linked to the `sessionId`.
- The localStorage state has the `sessionId` and `storageIds`.
- When the user resumes, verify the photos still exist by querying Convex.

```tsx
// On resume: verify photos are still available
async function verifyPhotos(photoIds: string[]): Promise<string[]> {
  // Query Convex to check which storageIds are still valid
  const valid = await Promise.all(
    photoIds.map(async (id) => {
      try {
        const url = await getFileUrl(id);
        return url ? id : null;
      } catch {
        return null;
      }
    })
  );
  return valid.filter(Boolean) as string[];
}
```

If photos have been cleaned up (e.g., a server-side job removed orphaned files after 7 days), the resume flow should inform the user:

```
"Your photos from a previous session have expired. Please re-upload them."
```

And navigate them to Step 2 (Photo Upload) instead of their last saved step.

### 5.4 Post-Auth Session Recovery

Once a user has authenticated and a Convex project exists (Steps 5+), session recovery is straightforward:

- The project is in Convex with `status: "draft"`, `"generating"`, or `"generated"`.
- If `status === "generating"` and user returns: reconnect to `generationProgress` via `useQuery`. The backend generation action runs independently of the client.
- If `status === "generated"`: show the preview/paywall step directly.
- If `status === "draft"` and generation hasn't started: rare edge case (user authenticated but didn't click Generate). Show the generation step with the "Generate My Scope" button.

```tsx
// app/create/page.tsx -- handle authenticated user with existing project
function CreatePage() {
  const { state } = useWizard();
  const project = useQuery(
    api.projects.getProject,
    state.projectId ? { projectId: state.projectId } : "skip"
  );

  // If project exists in Convex, derive step from project status
  if (project) {
    switch (project.status) {
      case "draft":
        return <GeneratingState />; // Show "Generate" button
      case "generating":
        return <GeneratingState />; // Show live progress
      case "generated":
        return <ScopePreview />;    // Show paywall
      case "paid":
        // Redirect to full scope view
        redirect(`/scope/${state.projectId}`);
    }
  }

  // Pre-auth: render wizard steps
  return <WizardStepRenderer step={state.step} />;
}
```

### 5.5 Returning Authenticated Users with Existing Projects

If a user who already has projects visits `/create`:

- Check if they have any `draft` or `generating` projects.
- If yes, offer to continue that project instead of starting new.
- Use the account dashboard (`/account`) as the primary re-entry point for existing projects.

This is a V2 concern -- for MVP, `/create` always starts a new flow.

---

## 6. Mobile Interruptions

### 6.1 Common Mobile Interruptions

| Interruption | What Happens | Risk Level |
|-------------|-------------|------------|
| Incoming phone call | App/browser backgrounded | Medium -- state survives in memory |
| SMS/notification tap | App switch | Low -- browser stays in background |
| Low battery warning | System dialog overlays | None -- page stays active |
| Camera opens (for photo upload) | Browser may be purged on low-memory devices | High for photos being captured |
| App switch + extended time | Browser tab may be killed | High -- React state lost |
| OS update / restart | Browser killed | High -- React state lost |
| Screen lock + unlock | Nothing | None -- page stays active |

### 6.2 Critical Scenario: Photo Upload on Mobile

The most vulnerable moment on mobile is during photo capture/upload. The user:

1. Taps "Take Photo" or "Choose from Library"
2. The system camera/gallery app opens
3. The browser tab may be suspended or killed (especially on low-memory Android devices)
4. User returns to the browser

**Mitigation strategy:**

1. **Upload immediately on selection.** Each photo should begin uploading to Convex storage the instant it's selected, not when the user clicks "Next". This is already the planned architecture (ARCHITECTURE.md: "Each photo: uploaded to Convex file storage immediately").

2. **Track upload state in localStorage.** Before opening the file picker, save current state:

```tsx
function handlePhotoCapture() {
  // Save state before potentially losing the tab
  saveToStorage();

  // Open file input
  fileInputRef.current?.click();
}
```

3. **Resume incomplete uploads.** If the tab is killed and restored, check for photos that were selected but not uploaded:

```tsx
// On component mount, check for pending uploads
useEffect(() => {
  const pendingUploads = state.photoMeta.filter(
    p => !state.photoIds.includes(p.storageId)
  );
  if (pendingUploads.length > 0) {
    // Photos were selected but upload may not have completed
    // Verify with Convex which ones actually made it
  }
}, []);
```

### 6.3 Service Worker Consideration (V2)

For MVP, do not implement a service worker. The complexity is not justified. In V2, a service worker could:

- Queue photo uploads for offline/background completion
- Cache the wizard UI shell for instant load
- Sync localStorage state to Convex periodically

For MVP, the localStorage + immediate upload strategy provides sufficient resilience.

### 6.4 Network Interruption During Photo Upload

Mobile users frequently experience network drops during upload. Handle this gracefully:

```tsx
// components/create/PhotoUpload.tsx

interface PhotoUploadState {
  storageId: string | null;
  filename: string;
  status: "uploading" | "complete" | "error";
  progress: number; // 0-100
  retryCount: number;
}

function usePhotoUpload() {
  const generateUploadUrl = useMutation(api.photos.generateUploadUrl);

  async function uploadPhoto(file: File): Promise<string> {
    const maxRetries = 3;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const uploadUrl = await generateUploadUrl();

        const response = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });

        if (!response.ok) throw new Error(`Upload failed: ${response.status}`);

        const { storageId } = await response.json();
        return storageId;
      } catch (error) {
        lastError = error as Error;
        // Wait before retrying (exponential backoff)
        await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt)));
      }
    }

    throw lastError;
  }

  return { uploadPhoto };
}
```

**UX for upload failures:**

```
Photo: kitchen-overview.jpg
[========-----] 65%  Upload failed. [Retry]
```

Show the failure inline with a retry button. Do NOT block the entire wizard -- the user can retry individual photos or skip and re-upload later.

### 6.5 Viewport Resize / Keyboard Appearance

Mobile keyboards push the viewport up. During the questions step (Step 3), if any text inputs are used:

```css
/* Prevent layout shift when mobile keyboard appears */
.wizard-container {
  min-height: 100dvh; /* dynamic viewport height */
}

/* Ensure active input is always visible */
input:focus,
textarea:focus {
  scroll-margin-bottom: 120px;
}
```

Use `100dvh` (dynamic viewport height) instead of `100vh` to account for the mobile browser chrome and keyboard.

### 6.6 Battery Saver / Background Throttling

On mobile, browsers aggressively throttle background tabs. This affects:

- **Timers** -- `setTimeout`/`setInterval` are paused or slowed.
- **WebSocket connections** -- May be dropped (affects Convex real-time subscriptions).
- **Fetch requests** -- May be queued.

For the generation step (Step 5), where the user is waiting for Convex generation progress updates, the real-time subscription may disconnect when the tab is backgrounded. Handle reconnection:

```tsx
// Convex handles WebSocket reconnection automatically.
// The useQuery hook will re-subscribe when the component is visible again.
// No additional code needed for this -- Convex's client library handles it.

// However, show a "Reconnecting..." indicator if the connection is lost:
function GeneratingState() {
  const project = useQuery(api.projects.getProject, { projectId });

  // If project is undefined, Convex is still loading/reconnecting
  if (project === undefined) {
    return <ReconnectingIndicator />;
  }

  return <ProgressDisplay progress={project.generationProgress} />;
}
```

Convex's client library maintains a persistent WebSocket connection and automatically reconnects with exponential backoff. The `useQuery` hook returns `undefined` while reconnecting, then the latest data once connected. This means the generation progress will "jump" to the current state when the user returns -- they won't miss any progress, they'll just see it catch up instantly.

---

## 7. Implementation Recommendations

### 7.1 Architecture Summary

```
                          WIZARD STATE ARCHITECTURE

  Steps 0-4 (Pre-Auth)                    Steps 5-7 (Post-Auth)
  =====================                    =====================

  Source of truth:                         Source of truth:
  React Context (useReducer)               Convex DB (useQuery)
       |                                        |
       |-- mirrors to -->                       |-- reactive subscription
       |                                        |
  localStorage (backup)                    Real-time via WebSocket
       |
       |-- restores from -->
       |
  On next visit (if tab closed)
```

### 7.2 State Management Decision: React Context vs. Zustand vs. URL State

| Approach | Pros | Cons | Recommendation |
|----------|------|------|----------------|
| React Context + useReducer | Built-in, no deps, type-safe, matches React patterns | Prop drilling if deeply nested (mitigated by context) | **Use this** |
| Zustand | Simple API, built-in persistence middleware, no provider needed | Additional dependency, team must learn new API | Good alternative, but adds complexity for this use case |
| URL State (all in query params) | Shareable, debuggable, browser-native | Too much data for URL, encoding issues, ugly URLs | Only for step number |
| React Hook Form | Built for forms, validation, error handling | Wizard is not one big form -- it's multiple distinct steps | Not appropriate for the wizard container (fine for individual step forms) |
| Redux | Robust, dev tools, middleware | Massive overkill for a single wizard flow | No |

**Verdict: React Context + useReducer + localStorage persistence.**

This is the simplest solution that meets all requirements. The wizard is a single flow with linear state accumulation. There are no complex derived states, no cross-component communication issues, and no need for middleware or dev tools. React Context is the right level of abstraction.

If Zustand is already in the project for other reasons, its `persist` middleware would be convenient:

```tsx
// Alternative: Zustand with persist (only if already using Zustand elsewhere)
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useWizardStore = create(
  persist(
    (set) => ({
      step: 0,
      mode: null,
      // ... other fields
      setStep: (step) => set({ step }),
      setMode: (mode) => set({ mode }),
    }),
    {
      name: "scopeai_wizard_state",
    }
  )
);
```

But since no other part of the ScopeAI architecture requires Zustand, adding it just for the wizard is unnecessary.

### 7.3 Complete Wizard Container Implementation

```tsx
// app/create/page.tsx
"use client";

import { Suspense } from "react";
import { WizardProvider } from "@/lib/wizard/WizardContext";
import { WizardContainer } from "@/components/create/WizardContainer";

// Metadata must be in a separate layout.tsx for client components
// app/create/layout.tsx handles noindex

export default function CreatePage() {
  return (
    <WizardProvider>
      <Suspense fallback={<WizardSkeleton />}>
        <WizardContainer />
      </Suspense>
    </WizardProvider>
  );
}

function WizardSkeleton() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="h-2 w-full rounded-full bg-muted" />
      <div className="mt-8 space-y-4">
        <div className="h-8 w-48 rounded bg-muted" />
        <div className="h-32 w-full rounded-lg bg-muted" />
      </div>
    </div>
  );
}
```

```tsx
// components/create/WizardContainer.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useCallback, useState } from "react";
import { useWizard } from "@/lib/wizard/WizardContext";
import { useUnsavedChangesWarning } from "@/hooks/useUnsavedChangesWarning";
import { NavigationGuardDialog, useNavigationGuard } from "@/components/create/NavigationGuard";

// Step components
import { ModeSelection } from "@/components/create/ModeSelection";
import { ProjectSetup } from "@/components/create/ProjectSetup";
import { PhotoUpload } from "@/components/create/PhotoUpload";
import { SmartQuestions } from "@/components/create/SmartQuestions";
import { AuthGate } from "@/components/create/AuthGate";
import { GeneratingState } from "@/components/create/GeneratingState";
import { ScopePreview } from "@/components/create/ScopePreview";
import { ResumePrompt } from "@/components/create/ResumePrompt";

const STEP_COMPONENTS = [
  ModeSelection,     // 0
  ProjectSetup,      // 1
  PhotoUpload,       // 2
  SmartQuestions,     // 3
  AuthGate,          // 4
  GeneratingState,   // 5
  ScopePreview,      // 6
];

const STEP_TITLES = [
  "How are you managing this?",
  "Tell us about your project",
  "Show us your space",
  "A few quick questions",
  "Create your account",
  "Generating your scope",
  "Your scope is ready",
];

export function WizardContainer() {
  const searchParams = useSearchParams();
  const { state, dispatch, isRestoredSession, clearStorage } = useWizard();
  const [showResumePrompt, setShowResumePrompt] = useState(false);

  // ---- URL Sync ----

  // Sync step from URL on mount
  useEffect(() => {
    const urlStep = searchParams.get("step");
    if (urlStep === null) {
      // First visit -- set URL to step 0
      window.history.replaceState({ step: state.step }, "", `/create?step=${state.step}`);
    } else {
      const stepNum = parseInt(urlStep, 10);
      if (!isNaN(stepNum) && stepNum !== state.step) {
        if (validateStepAccess(stepNum, state)) {
          dispatch({ type: "SET_STEP", step: stepNum });
        } else {
          // User tried to skip ahead -- redirect to their actual step
          window.history.replaceState({ step: state.step }, "", `/create?step=${state.step}`);
        }
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle browser back/forward
  useEffect(() => {
    function handlePopState(event: PopStateEvent) {
      if (event.state && typeof event.state.step === "number") {
        const step = event.state.step;
        if (validateStepAccess(step, state)) {
          dispatch({ type: "SET_STEP", step });
        }
      }
    }
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [dispatch, state]);

  // Show resume prompt if restored from localStorage
  useEffect(() => {
    if (isRestoredSession && state.step > 0) {
      setShowResumePrompt(true);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ---- Navigation ----

  const goToStep = useCallback((newStep: number) => {
    dispatch({ type: "SET_STEP", step: newStep });

    // For generation step: replace instead of push (no back navigation)
    if (newStep >= 5) {
      window.history.replaceState({ step: newStep }, "", `/create?step=${newStep}`);
    } else {
      window.history.pushState({ step: newStep }, "", `/create?step=${newStep}`);
    }
  }, [dispatch]);

  const goNext = useCallback(() => {
    if (state.step < STEP_COMPONENTS.length - 1) {
      goToStep(state.step + 1);
    }
  }, [state.step, goToStep]);

  const goBack = useCallback(() => {
    if (state.step > 0) {
      goToStep(state.step - 1);
    }
  }, [state.step, goToStep]);

  // ---- Unsaved Changes Warning ----

  const hasUnsavedProgress = state.step >= 2 && !state.projectId;
  useUnsavedChangesWarning(hasUnsavedProgress);

  // ---- Navigation Guard (in-app links) ----

  const { navigateTo, pendingUrl, confirmLeave, cancelLeave } = useNavigationGuard();

  // ---- Resume Prompt ----

  if (showResumePrompt) {
    return (
      <ResumePrompt
        projectType={state.projectType}
        step={state.step}
        onContinue={() => setShowResumePrompt(false)}
        onStartFresh={() => {
          clearStorage();
          dispatch({ type: "RESET" });
          setShowResumePrompt(false);
          window.history.replaceState({ step: 0 }, "", "/create?step=0");
        }}
      />
    );
  }

  // ---- Render ----

  const StepComponent = STEP_COMPONENTS[state.step];
  const progress = ((state.step + 1) / STEP_COMPONENTS.length) * 100;
  const canGoBack = state.step > 0 && state.step < 5; // No back during/after generation

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {/* Progress bar */}
      <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
        <span>Step {state.step + 1} of {STEP_COMPONENTS.length}</span>
        <span>{STEP_TITLES[state.step]}</span>
      </div>
      <div className="mb-8 h-2 w-full rounded-full bg-muted">
        <div
          className="h-2 rounded-full bg-primary transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Step content */}
      <StepComponent
        onNext={goNext}
        onBack={goBack}
        canGoBack={canGoBack}
      />

      {/* Navigation guard dialog */}
      <NavigationGuardDialog
        pendingUrl={pendingUrl}
        onConfirm={confirmLeave}
        onCancel={cancelLeave}
      />
    </div>
  );
}

// ---- Validation ----

function validateStepAccess(step: number, state: WizardState): boolean {
  if (step <= 0) return true;
  if (step >= 1 && !state.mode) return false;
  if (step >= 2 && !state.projectType) return false;
  if (step >= 3 && state.photoIds.length < 3) return false;
  // Questions can be partially answered -- don't block
  if (step >= 5 && !state.projectId) return false;
  return true;
}
```

### 7.4 Resume Prompt Component

```tsx
// components/create/ResumePrompt.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { ProjectType } from "@/types";
import { PROJECT_TYPES } from "@/lib/constants";

interface ResumePromptProps {
  projectType: ProjectType | null;
  step: number;
  onContinue: () => void;
  onStartFresh: () => void;
}

const STEP_LABELS: Record<number, string> = {
  0: "mode selection",
  1: "project setup",
  2: "photo upload",
  3: "questions",
  4: "account creation",
};

export function ResumePrompt({ projectType, step, onContinue, onStartFresh }: ResumePromptProps) {
  const projectLabel = projectType
    ? PROJECT_TYPES.find(p => p.id === projectType)?.label ?? projectType
    : "renovation";

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <Card>
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>
            You were working on a {projectLabel.toLowerCase()} scope.
            You were up to {STEP_LABELS[step] ?? `step ${step + 1}`}.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Button onClick={onContinue} className="w-full">
            Continue where I left off
          </Button>
          <Button variant="outline" onClick={onStartFresh} className="w-full">
            Start a new scope
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
```

### 7.5 Layout for /create Route (noindex + metadata)

Since the wizard page uses `"use client"`, metadata must be in a server-side layout:

```tsx
// app/create/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Your Scope | ScopeAI",
  robots: "noindex, nofollow",
};

export default function CreateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
```

### 7.6 Key Technical Decisions Summary

| Decision | Choice | Rationale |
|----------|--------|-----------|
| State management | React Context + useReducer | Simplest solution, no extra dependencies, matches React patterns |
| Persistence (pre-auth) | localStorage with per-step saving | Survives tab close, 5MB is plenty for wizard data |
| Persistence (post-auth) | Convex (reactive queries) | Project exists in DB, real-time sync built in |
| URL state | `/create?step=N` via pushState | Browser back button works, analytics-friendly |
| URL update method | `window.history.pushState` (not `router.push`) | Avoids Next.js navigation overhead, no re-renders |
| Back button handling | pushState per step, popstate listener | Steps 0-4 navigable, Steps 5+ blocked |
| Navigation guard | `beforeunload` + custom AlertDialog | System dialog for tab close, custom dialog for in-app nav |
| Session timeout | localStorage TTL check (48hr) | Show resume prompt, not auto-resume |
| Mobile photo upload | Immediate upload + save-before-picker | Minimises data loss if tab is killed |
| Reconnection (post-auth) | Convex automatic WebSocket reconnection | No custom code needed, useQuery handles it |

### 7.7 Edge Cases Checklist

Before shipping, verify these scenarios:

- [ ] User closes tab on Step 3, reopens `/create` -- sees resume prompt
- [ ] User completes Step 2, hits browser back -- returns to Step 1 with data intact
- [ ] User on Step 5 (generating), hits browser back -- nothing happens (replaced state)
- [ ] User on Step 0, hits browser back -- returns to landing page
- [ ] User manually types `/create?step=5` without completing prior steps -- redirected to current valid step
- [ ] User resumes after 3 days -- stale session prompt, option to start fresh
- [ ] User resumes but photos have been cleaned up -- prompted to re-upload
- [ ] Mobile: user opens camera, takes photo, returns to browser -- upload resumes
- [ ] Mobile: user backgrounds tab for 5 minutes during generation -- progress catches up on return
- [ ] Network drops during photo upload -- retry with exponential backoff, inline error per photo
- [ ] localStorage is full or unavailable (private browsing) -- wizard still works, just no persistence
- [ ] User has an existing project from a previous session and visits `/create` -- starts new flow (MVP)
- [ ] Two tabs open on `/create` -- each tab has its own React state; localStorage reflects last-saved tab

### 7.8 What NOT to Build (MVP Scope)

These are deliberate exclusions for MVP to keep complexity manageable:

1. **Cross-device sync for anonymous users.** Pre-auth state is device-local only. Cross-device would require server-side session storage, adding significant complexity for a rare use case.

2. **Service worker / offline support.** The wizard requires network for photo uploads and Convex operations. Offline support adds major complexity with minimal benefit.

3. **Real-time collaboration.** Only one user works on a wizard at a time. No need for conflict resolution or multi-cursor.

4. **Undo/redo stack.** The wizard is linear with simple data. Browser back/forward is sufficient.

5. **Draft saving to Convex (pre-auth).** Creating "anonymous projects" in Convex before auth adds schema complexity, cleanup jobs, and security considerations. localStorage is sufficient for the pre-auth phase.

6. **Sophisticated session fingerprinting.** Do not try to match users across devices using IP, user agent, or cookies. If a user starts on their phone and wants to continue on desktop, they need to reach the auth gate first.

---

## Appendix A: State Shape Reference

```typescript
// Complete wizard state shape for implementation reference

interface WizardState {
  // Meta
  step: number;                  // 0-6
  sessionId: string;             // UUID for anonymous photo linking
  savedAt: number;               // timestamp for stale detection

  // Step 0: Mode Selection
  mode: ProjectMode | null;      // "trades" | "builder"

  // Step 1: Project Setup
  projectType: ProjectType | null;
  propertyDetails: Partial<PropertyDetails>;
  description: string;

  // Step 2: Photo Upload
  photoIds: string[];            // Convex storageIds
  photoMeta: {
    storageId: string;
    filename: string;
    uploadStatus: "uploading" | "complete" | "error";
  }[];

  // Step 3: Smart Questions
  answers: QuestionAnswers;      // { [questionId]: string | string[] }

  // Step 4+: Post-Auth
  projectId: string | null;      // Convex project ID (set after auth)
}
```

## Appendix B: localStorage Key Namespace

Use a single key to avoid conflicts:

```
scopeai_wizard_state    -- serialised WizardState JSON
```

If future features need more keys, use the `scopeai_` prefix:

```
scopeai_wizard_state    -- wizard progress
scopeai_theme           -- dark/light preference (handled by next-themes)
scopeai_dismissed_tips  -- dismissed UI tips (V2)
```

## Appendix C: Analytics Events for Wizard State

Track these events to understand drop-off and recovery:

| Event | When | Properties |
|-------|------|-----------|
| `wizard_started` | User enters Step 0 | `source` (landing, direct, etc.) |
| `wizard_step_completed` | User advances a step | `step`, `projectType`, `mode` |
| `wizard_step_back` | User goes back a step | `from_step`, `to_step` |
| `wizard_resumed` | User resumes from localStorage | `step`, `hours_elapsed` |
| `wizard_resume_rejected` | User clicks "Start Fresh" | `step`, `hours_elapsed` |
| `wizard_abandoned` | `beforeunload` fires with progress | `step`, `projectType` |
| `wizard_photo_upload_retry` | Photo upload retried after failure | `attempt_number` |
| `wizard_generation_reconnect` | User returns to generating step | `completed_count`, `total_count` |

---

*This document covers the state management, persistence, and recovery patterns for ScopeAI's creation wizard. It should be read alongside ARCHITECTURE.md (for data flow) and BUILD.md Phase 3 (for implementation sequence).*
