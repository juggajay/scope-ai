# ScopeAI Wizard — Implementation Specification

**Date:** February 2026
**Status:** Ready for development
**Synthesised from:** Sections 1-7 of UX Wizard Research
**Stack:** Next.js 14+ (App Router) + Tailwind CSS v4 + shadcn/ui + Framer Motion + Convex

---

## 1. Wizard Structure

### 1.1 Phase-Based Architecture

The wizard is grouped into **4 semantic phases** containing **7 steps**. Phase labels replace step numbers to reduce perceived complexity (Miller's chunking, Section 2).

```
Phase 1: "Your Project"          Phase 2: "Your Space"         Phase 3: "Your Plans"         Phase 4: "Your Scope"
  Step 0: Mode Selection           Step 2: Photo Upload          Step 3: Smart Questions        Step 4: Auth Gate
  Step 1: Project Setup                                                                         Step 5: Generation
                                                                                                Step 6: Preview
```

### 1.2 URL Pattern

Single route: `/create?step=N` (N = 0-6). Updated via `window.history.pushState` — not `router.push` — to avoid Next.js navigation overhead (Section 7).

### 1.3 State Management

**React Context + useReducer + localStorage** (Section 7).

- Steps 0-3: Client-side (React Context as source of truth, localStorage as backup, saved per-step)
- Step 4+: Server-side (Convex project created at auth gate, reactive queries)

---

## 2. Progress Indicator Spec

### 2.1 Architecture: Three Layers

| Layer | Component | Visible When | Position |
|-------|-----------|-------------|----------|
| **1. Weighted progress bar** | `WizardProgress` | Always | Top of content, full-width |
| **2. Phase label** | Text below bar | Always | Centered below bar |
| **3. Question counter** | `"Question 5 of 12"` | Step 3 only | Below phase label |

### 2.2 Progress Weight Map

Front-loaded weights so users hit 50% by mid-questions (endowed progress + goal gradient effects, Section 2).

```typescript
const PROGRESS_WEIGHTS = {
  initial: 5,              // Endowed progress on load
  modeSelection: 15,       // +10%
  projectSetup: 30,        // +15%
  photoUpload: 45,         // +15%
  questionsStart: 45,      // Each question adds (75-45)/N per question
  questionsEnd: 75,        // +30% total across all questions
  authGate: 80,            // +5%
  generationStart: 80,     // Per-trade: adds (95-80)/tradeCount per trade
  generationEnd: 95,       // +15% total across generation
  preview: 100,            // +5%
} as const;
```

### 2.3 Visual Spec

```
Bar height:     4px mobile, 6px desktop
Bar colour:     bg-primary (teal #14B8A6)
Bar background: bg-muted
Bar radius:     rounded-full
Transition:     600ms ease-out (Framer Motion spring: stiffness 50, damping 15)
Position:       Full-width, top of content area

Phase label:    text-sm font-medium text-foreground, centered
                Fades on phase change (200ms opacity)

Question count: text-xs text-muted-foreground, centered
                Appears/disappears with 150ms opacity transition
```

### 2.4 Generation Step Enhancement

Add backwards-moving stripe animation during generation to reduce perceived wait time (Carnegie Mellon research, Section 2).

```css
/* Animated stripe overlay on progress bar during generation */
background: repeating-linear-gradient(
  -45deg,
  transparent, transparent 8px,
  rgba(255,255,255,0.1) 8px, rgba(255,255,255,0.1) 16px
);
animation: stripe-slide 2s linear infinite;

@keyframes stripe-slide {
  from { background-position: 0 0; }
  to { background-position: -32px 0; }
}
```

---

## 3. Step Transition Spec

### 3.1 Transition Type

**Hybrid slide + fade** — fastest perceived speed with premium feel (Section 3, backed by NNGroup + ScienceDirect 2024 research).

### 3.2 Direction

| Action | Content enters from | Content exits to |
|--------|-------------------|-----------------|
| Forward (Next) | Right | Left |
| Backward (Back) | Left | Right |

### 3.3 Animation Constants

```typescript
// lib/animation-constants.ts

export const ANIMATION = {
  step: {
    duration: 0.25,                          // 250ms
    slideDistance: 60,                        // px (subtle, not full-width)
    ease: [0.4, 0.0, 0.2, 1.0] as const,   // Material ease-in-out
  },
  card: {
    tapScale: 0.97,
    hoverScale: 1.02,
    borderDuration: 0.15,                    // 150ms
    springConfig: { type: "spring" as const, stiffness: 500, damping: 30, mass: 0.8 },
  },
  stagger: {
    delayChildren: 0.05,                     // 50ms
    staggerChildren: 0.04,                   // 40ms per child
  },
  progress: {
    springConfig: { type: "spring" as const, stiffness: 50, damping: 15 },
  },
  exit: {
    duration: 0.2,                           // 200ms (faster than enter)
    ease: [0.4, 0.0, 1.0, 1.0] as const,   // ease-in (accelerate away)
  },
  autoAdvance: {
    delay: 600,                              // ms before advancing after single-select
  },
} as const;
```

### 3.4 Step Transition Variants

```typescript
const stepVariants = {
  enter: (direction: number) => ({
    x: direction * ANIMATION.step.slideDistance,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: -direction * ANIMATION.step.slideDistance,
    opacity: 0,
  }),
};

// Usage:
// <AnimatePresence mode="wait" custom={direction} initial={false}>
//   <motion.div key={step} custom={direction} variants={stepVariants}
//     initial="enter" animate="center" exit="exit"
//     transition={{ x: { duration: 0.25, ease: ANIMATION.step.ease },
//                   opacity: { duration: 0.2, ease: "easeInOut" } }}
//   />
// </AnimatePresence>
```

### 3.5 Reduced Motion

Wrap wizard in `<MotionConfig reducedMotion="user">`. This automatically disables x/y/scale animations while preserving opacity and colour transitions. No per-component checks needed (Section 3).

---

## 4. Tap-to-Select Card Spec

### 4.1 Layout Rules

| Context | Layout | Rationale |
|---------|--------|-----------|
| Question options (3-5 text options) | Single column stack (`flex flex-col gap-3`) | Text-heavy options need full width (Section 4) |
| Mode selection (2 cards) | Single column mobile, 2-col desktop (`grid grid-cols-1 sm:grid-cols-2 gap-3`) | Icon-prominent, short labels |
| Project type (5 cards) | Single column mobile, 2-col desktop | Icon-prominent, short labels |

### 4.2 Card States

Always use `border-2 border-transparent` in default state to prevent layout shift on selection (Section 4).

| State | Classes |
|-------|---------|
| **Default** | `border-2 border-transparent bg-card text-card-foreground cursor-pointer` |
| **Default (escape/"Not sure")** | `border-2 border-dashed border-border bg-card text-muted-foreground cursor-pointer` |
| **Hover (desktop)** | `hover:border-primary/50 hover:bg-accent/5` |
| **Focus-visible** | `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2` |
| **Selected** | `border-2 border-primary bg-primary/5 ring-1 ring-primary/20 shadow-sm text-foreground` |
| **Disabled** | `opacity-50 cursor-not-allowed pointer-events-none` |

### 4.3 Selection Indicators

| Type | Indicator | Position | ARIA |
|------|-----------|----------|------|
| Single-select | Radio circle (empty → filled teal with white dot) | Right side, vertically centred | `role="radiogroup"` / `role="radio"` + `aria-checked` |
| Multi-select | Checkbox square (empty → filled teal with white check) | Right side, vertically centred | `role="group"` / `role="checkbox"` + `aria-checked` |

Multi-select questions always show `"Select all that apply"` subtext below the question heading.

### 4.4 "Not Sure" Options

- Dashed border in default state, muted text colour
- Same teal selection styling when selected (validates the choice)
- Always last in the option list
- Word "yet" recommended: "Not sure yet" reduces finality

### 4.5 Auto-Advance

| Selection Type | Behaviour |
|---------------|-----------|
| Single-select | Auto-advance after 600ms. Cancellable (re-tapping different option resets timer). |
| Multi-select | "Continue" button at bottom (fixed, `bg-background/95 backdrop-blur-sm`). Disabled until ≥1 selected. |

### 4.6 Sizing

- Minimum card height: 56px (`min-h-[56px]`)
- Card padding: `px-4 py-3` (text-primary), `px-4 py-4` (icon-prominent)
- Gap between cards: 12px (`gap-3`)
- All cards exceed 44px touch target minimum

---

## 5. Question Flow Spec

### 5.1 Format

**One question per screen** with auto-advance on single-select (Typeform model). Drives 2x completion vs scrollable lists (Section 6).

### 5.2 Pacing

- Start with the easiest question (foot-in-the-door effect)
- Auto-advance eliminates "Next" tap overhead → 12 questions feel like 12 taps
- Lightweight section labels between groups ("Appliances", "Finishes") — NOT full-page dividers
- Progress dots at top, clickable for back-navigation to any answered question
- Welcome screen before first question: "12 quick questions about your kitchen. Most people finish in under 2 minutes."

### 5.3 Tooltips

**Info icon with inline expand** — not hover, not modal (Section 6).

```
[Question text]  [ℹ]
                 ↓ (on tap)
[Why text expands inline, 200ms height animation]
```

Collapses automatically on question advance. `AnimatePresence` with height 0→auto.

### 5.4 No Summary Screen

Instead: clickable progress dots for jumping back + brief confirmation before generation showing photo/answer count and identified trades. Secondary "Review Answers" text link for users who want the full review.

### 5.5 Question Transition

Same horizontal slide as step transitions but with smaller distance (40px vs 60px), using spring easing (`stiffness: 300, damping: 30`).

---

## 6. Photo Upload Spec

### 6.1 Primary Pattern

**Camera-first, tap-to-add** — NOT drag-and-drop-first (Section 5).

| Viewport | Primary UI |
|----------|-----------|
| Mobile (`<md`) | Two stacked buttons: "Take Photos" (camera icon, triggers `capture="environment"` input) + "Choose from Gallery" (image icon, standard file input) |
| Desktop (`≥md`) | Drag-and-drop zone via `react-dropzone` with click-to-browse fallback |

### 6.2 Dropzone States

| State | Classes |
|-------|---------|
| Default | `border-2 border-dashed border-border bg-muted/30 rounded-lg` |
| Drag active (valid) | `border-2 border-solid border-primary bg-primary/5 scale-[1.01] ring-2 ring-primary/20` |
| Drag active (invalid) | `border-2 border-solid border-destructive bg-destructive/5` |

### 6.3 Thumbnail Grid

```
Grid:          grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4
Thumbnail:     aspect-square overflow-hidden rounded-lg border border-border bg-muted
Image:         h-full w-full object-cover
Remove button: top-right, always visible on mobile, hover on desktop
               h-6 w-6 rounded-full bg-black/60 text-white backdrop-blur-sm
"Add More":    Same aspect-square as thumbnails, border-2 border-dashed
```

### 6.4 Upload Progress

Per-file circular progress rings overlaid on thumbnails (not linear bars, not overall progress). Three states: uploading (ring + percentage), complete (brief checkmark, then clean), failed (red overlay + retry).

### 6.5 Minimum Count

Progress framing, NOT error framing: dot indicators + text shifting from `text-muted-foreground` ("2 of 3 minimum") to `text-primary` ("3 photos added — nice!"). Continue button disabled until minimum met.

### 6.6 No Drag-to-Reorder

Photo order has zero impact on Gemini Vision analysis. Mobile drag is "inefficient, imprecise, and physically challenging" (NNGroup). Skip for MVP entirely (Section 5).

### 6.7 Error Handling

Inline dismissable banners below upload zone (not modals). Auto-dismiss after 8 seconds for validation errors. Network failures show retry overlay on the specific thumbnail.

### 6.8 Coaching

Collapsible tips panel with project-type-specific suggestions. Starts expanded, auto-collapses after first photo upload.

---

## 7. Wizard State & Recovery Spec

### 7.1 Persistence Model

```
Steps 0-3:  React Context (source of truth) + localStorage (backup, saved per step)
Step 4+:    Convex DB (project created at auth gate, reactive queries via useQuery)
```

### 7.2 Resume Flow

On return with saved localStorage state: show resume prompt ("Welcome back! Continue where I left off?" / "Start a new scope"). Never auto-resume silently.

Stale threshold: 48 hours. After that, modified prompt: "You started a kitchen renovation scope 3 days ago. Would you like to continue or start fresh?"

### 7.3 Browser Back Button

Each step pushes a history entry via `pushState`. Back button navigates to previous step (Steps 0-3). Steps 4+ use `replaceState` to block back navigation (can't go back during generation).

Forward-skip guard: `validateStepAccess()` prevents manually typing `/create?step=5` without completing prior steps.

### 7.4 Navigation Guard

- `beforeunload` for tab/browser close (triggered when step ≥ 2 and not yet server-persisted)
- shadcn/ui `AlertDialog` for in-app navigation (logo click, etc.)
- Copy: "Your progress has been saved. You can resume where you left off when you come back." (reassuring, not alarming)

### 7.5 Mobile Interruptions

- Save state to localStorage before opening file picker for photo capture
- Upload photos immediately on selection (don't wait for "Next")
- Retry with exponential backoff for failed uploads (max 3 attempts)
- Convex WebSocket auto-reconnects after tab backgrounding — no custom code needed

---

## 8. Per-Step UX Specifications

### Step 0: Mode Selection

- **Layout:** Two large cards, stacked mobile, side-by-side desktop
- **Interaction:** Tap card → auto-advance after 600ms delay
- **Cards:** Icon-prominent pattern (28px icon, title + description)
- **No "Next" button** — auto-advance on selection
- **Transition to Step 1:** Horizontal slide-right

### Step 1: Project Setup

- **Layout:** Project type cards (2-col grid on desktop) + property details form
- **Cards:** Icon + label, same hover/select pattern as mode
- **Form:** Suburb autocomplete, State auto-fill from suburb, Property type radio, Year built
- **Validation:** Inline. Green checkmark on valid fields. Amber note for pre-1990 properties.
- **"Continue" button** in persistent footer, disabled until valid

### Step 2: Photo Upload

- **Layout:** Tips panel (collapsible) + upload zone (mobile buttons / desktop dropzone) + thumbnail grid
- **Counter:** Dot indicators + text, progress-framed
- **"Continue" triggers background photo analysis** (Convex action, runs during Step 3)

### Step 3: Smart Questions

- **Layout:** One question per screen, question text `text-lg font-semibold`, options as cards below
- **Sub-progress:** Thin teal bar (no question numbers shown in bar)
- **Auto-advance:** 600ms after single-select tap
- **Back nav:** Back button bottom-left + clickable progress dots + browser back
- **Transition:** Horizontal slide, 40px distance, spring easing

### Step 4: Auth Gate

- **Layout:** Clean, centred card, no distractions
- **Interstitial copy:** "We have everything we need. Create a free account to generate your scope."
- **Options:** Google OAuth (prominent, top) + email/password below
- **Auto-advance to Step 5** after successful auth

### Step 5: Generation (30-60s)

- **Layout:** Centred, no navigation buttons, only "Cancel" text link
- **Progress phases:**
  1. 0-3s: Animated processing indicator + "Starting your scope generation..."
  2. 3-60s: Per-trade card stack. Each card starts as skeleton, animates in (fade + slide up 20px) as trade completes. Currently-generating trade pulses.
  3. Complete: All cards visible with checkmarks → "Your scope is ready!" scale-in → "View Your Scope" button fade-in
- **Educational tips** rotating below progress: new tip every 8-10s with crossfade
- **Error:** Amber warning on failed trade card with "[Retry]" — other trades continue

### Step 6: Scope Preview

- **Layout:** Summary card with all trades (icon + name + item count + sample item)
- **Paywall:** Pricing tier cards below, "Professional" highlighted as "Most Popular"
- **"Unlock Full Scope" button:** Full-width teal
- **Trust signals:** Money-back guarantee, Australian Standards badge, Stripe badge

---

## 9. Persistent Footer Bar

Airbnb-style footer visible on all steps (Section 1).

```tsx
<div className="fixed bottom-0 inset-x-0 border-t bg-background/95 backdrop-blur-sm
                px-4 py-3 flex items-center justify-between z-50">
  <Button variant="ghost" onClick={handleBack}
          disabled={isFirstStep || isGenerating}
          className="text-muted-foreground">
    {isFirstStep ? "Exit" : "Back"}
  </Button>
  <Button onClick={handleNext}
          disabled={!isStepValid || isGenerating}
          className="bg-primary text-primary-foreground px-8">
    {isGenerateStep ? "Generate My Scope" : "Continue"}
  </Button>
</div>
```

**Rules:**
- Steps with auto-advance (Mode, single-select questions): footer hidden or "Back" only
- Multi-select questions: "Continue" replaces "Next" in footer
- Generation step: footer hidden entirely
- Preview step: "Unlock Full Scope" replaces footer content

---

## 10. Key Micro-Interactions (The Polish)

These 10 interactions elevate the wizard from functional to premium (synthesised from all sections):

| # | Interaction | Duration | Trigger | Implementation |
|---|-------------|----------|---------|----------------|
| 1 | Card tap scale-down | 80ms | `whileTap` | `scale: 0.97`, spring stiffness 500 |
| 2 | Selection checkmark draw-on | 250ms | On select | SVG `pathLength` 0→1, delayed 100ms after border |
| 3 | Option list stagger entrance | 40ms/item | Question change | `staggerChildren: 0.04` on container variant |
| 4 | Progress bar smooth fill | 600ms | Step/question change | Spring `stiffness: 50, damping: 15` |
| 5 | Phase label crossfade | 200ms | Phase change | `AnimatePresence mode="wait"` with opacity |
| 6 | "Why we ask" inline expand | 200ms | Tap info icon | `height: 0→auto` with `AnimatePresence` |
| 7 | Trade card appear during generation | 300ms | Trade completes | `opacity: 0→1, y: 20→0`, ease-out |
| 8 | Generation checkmark draw-on | 400ms | Trade completes | SVG circle draws on, then check stroke |
| 9 | "Scope ready!" scale-in | 400ms | All trades done | Spring `stiffness: 300, damping: 20` |
| 10 | Haptic tap on card selection | Instant | Touch event | `navigator.vibrate(10)`, progressive enhancement |

---

## 11. Animation Timing Reference

Complete reference table for all wizard animations:

| Animation | Duration | Easing | Notes |
|-----------|----------|--------|-------|
| Step transition (slide + fade) | 250ms | `[0.4, 0.0, 0.2, 1.0]` | Between major wizard steps |
| Question transition (slide) | 250ms | Spring (300/30) | Between questions in Step 3 |
| Card hover scale | 200ms | ease-out | Desktop only (`@media (hover: hover)`) |
| Card tap scale | 80ms | Spring (500/30) | `whileTap` — fires on first frame |
| Card selection border | 150ms | ease | Border colour + bg transition |
| Auto-advance delay | 600ms | n/a (timer) | After single-select answer |
| Checkmark appear | 250ms | Spring (500/30) | SVG pathLength animation |
| Stagger per item | 40ms | n/a (delay) | Option list entrance |
| Progress bar fill | 600ms | Spring (50/15) | Smooth, slight overshoot |
| Phase label fade | 200ms | ease | On phase change |
| Question counter appear | 150ms | ease | Opacity + height |
| Tooltip expand | 200ms | ease | Height 0→auto |
| Error shake | 300ms | Custom keyframes | `[x: 0, -8, 8, -4, 4, 0]` |
| Generation trade card | 300ms | ease-out | Fade + slide up 20px |
| Generation checkmark | 400ms | ease | Circle then check stroke |
| "Scope ready" text | 400ms | Spring (300/20) | Scale-in with slight overshoot |
| Skeleton pulse | 1800ms | ease-in-out, infinite | Wave animation on loading placeholders |
| Generation stripe | 2000ms | linear, infinite | Backwards-moving stripe |
| Educational tip rotation | 200ms | ease | Crossfade every 8-10s |

---

## 12. Mobile Adaptations

| Concern | Mobile | Desktop |
|---------|--------|---------|
| Card layout (mode/project type) | Single column stack | 2-column grid |
| Photo upload | "Take Photos" + "Choose Gallery" buttons | Drag-and-drop zone |
| Question options | Single column always | Single column (same) |
| Footer (Back/Next) | Full-width touch targets, min 44px height | Text buttons with padding |
| Tooltips | Tap-triggered inline expand | Same (hover not reliable) |
| Progress bar | Full-width 4px, edge-to-edge | Padded 6px within max-width |
| Remove button on photos | Always visible | Visible on hover |
| Step slide distance | 60px (same — subtle) | 60px |
| Haptics | `navigator.vibrate(10)` on supported devices | Not applicable |
| Viewport height | `100dvh` (dynamic) | `100vh` |

---

## 13. Accessibility Checklist

Derived from all 7 research sections:

- [ ] All interactive elements focusable with visible focus rings (teal `ring-ring`)
- [ ] `focus-visible` (not `focus`) to avoid showing ring on mouse click
- [ ] Single-select: `role="radiogroup"` container, `role="radio"` cards, roving tabindex
- [ ] Multi-select: `role="group"` container, `role="checkbox"` cards, independent tab stops
- [ ] Arrow keys navigate + select in radio groups (with wrap)
- [ ] Space/Enter toggle checkboxes
- [ ] Progress bar has `role="progressbar"` with `aria-valuenow/min/max`
- [ ] Screen reader live region (`aria-live="polite"`) announces question transitions
- [ ] "Why we ask" tooltips accessible via keyboard (not hover-only)
- [ ] Photo upload zone keyboard-activatable (Enter/Space)
- [ ] Error messages via `role="alert"` for screen reader announcement
- [ ] Colour is never the only state indicator (icons + colour for valid/invalid/selected)
- [ ] All animations respect `prefers-reduced-motion` via `<MotionConfig reducedMotion="user">`
- [ ] Touch targets minimum 44x44px on mobile
- [ ] Card gap 12px exceeds 8dp minimum for mis-tap prevention
- [ ] `100dvh` used instead of `100vh` for mobile viewport

---

## 14. Component File Structure

```
lib/
  animation-constants.ts              — All animation durations, easings, spring configs
  wizard/
    WizardContext.tsx                  — React Context + useReducer + localStorage persistence
    progress.ts                       — calculateProgress(), getPhaseLabel() functions

hooks/
  useUnsavedChangesWarning.ts         — beforeunload hook

components/create/
  WizardContainer.tsx                 — Orchestrator: URL sync, navigation, progress bar, footer
  WizardProgress.tsx                  — Progress bar + phase label + question counter
  WizardStepTransition.tsx            — AnimatePresence wrapper for step slide/fade
  NavigationGuard.tsx                 — AlertDialog for in-app navigation
  ResumePrompt.tsx                    — "Welcome back" card with Continue/Start Fresh
  SelectableCard.tsx                  — Core card component (radio + checkbox modes)

  ModeSelection.tsx                   — Step 0
  ProjectSetup.tsx                    — Step 1

  PhotoUpload.tsx                     — Step 2 container
  PhotoTips.tsx                       — Collapsible coaching panel
  PhotoUploadZone.tsx                 — Empty/populated state management
  EmptyDropzone.tsx                   — Desktop dropzone
  MobileCaptureButtons.tsx            — Camera + Gallery buttons
  ThumbnailGrid.tsx                   — Grid of PhotoThumbnail components
  PhotoThumbnail.tsx                  — Individual thumbnail with progress/remove
  PhotoCounter.tsx                    — Dot indicators + count text

  questions/
    QuestionFlow.tsx                  — Step 3 orchestrator (state, nav, auto-advance)
    ProgressDots.tsx                  — Clickable dots with group spacing
    QuestionCard.tsx                  — Single question + options + tooltip
    OptionButton.tsx                  — Individual option (wraps SelectableCard)
    WhyTooltip.tsx                    — Expandable "why do we ask"
    SectionLabel.tsx                  — Lightweight group label
    QuestionIntro.tsx                 — Welcome screen ("12 quick questions...")
    GeneratePrompt.tsx                — Pre-generation confirmation

  AuthGate.tsx                        — Step 4
  GeneratingState.tsx                 — Step 5
  ScopePreview.tsx                    — Step 6

app/create/
  layout.tsx                          — noindex metadata + MotionConfig
  page.tsx                            — WizardProvider + Suspense + WizardContainer
```

---

## 15. Research Sources Summary

All recommendations trace back to evidence documented in the individual research files:

| Decision | Primary Source | File |
|----------|---------------|------|
| Hybrid slide+fade transitions | NNGroup + ScienceDirect 2024 | `RESEARCH-wizard-animations.md` |
| 250ms transition sweet spot | NNGroup + analytics data | `RESEARCH-wizard-animations.md` |
| Front-loaded progress weighting | Irrational Labs (32 experiments) | `RESEARCH-wizard-progress.md` |
| Endowed progress (start at 5%) | Nunes & Dreze 2006 | `RESEARCH-wizard-progress.md` |
| 4 semantic phases | Miller 1956 (chunking) | `RESEARCH-wizard-progress.md` |
| One question per screen | SurveyMonkey + NNGroup | `RESEARCH-wizard-question-flow.md` |
| Auto-advance on single-select | Typeform (47.3% vs 21.5% completion) | `RESEARCH-wizard-question-flow.md` |
| "Not sure" as option, not Skip | SurveyMonkey + data quality analysis | `RESEARCH-wizard-question-flow.md` |
| Camera-first on mobile | Cross-platform `capture` attribute analysis | `RESEARCH-wizard-photo-upload.md` |
| No drag-to-reorder | NNGroup (mobile drag research) | `RESEARCH-wizard-photo-upload.md` |
| React Context (not Zustand/Redux) | Simplicity analysis | `RESEARCH-wizard-state.md` |
| localStorage + per-step save | Persistence requirements analysis | `RESEARCH-wizard-state.md` |
| Airbnb-style footer nav | Cross-product analysis | `RESEARCH-wizard-examples.md` |
| Phase interstitials | TurboTax + Airbnb patterns | `RESEARCH-wizard-examples.md` |
| Backwards-moving stripe on generation | Carnegie Mellon (Harrison et al. 2007) | `RESEARCH-wizard-progress.md` |

---

*This specification is ready for implementation. All values, patterns, and component structures are designed for ScopeAI's exact tech stack (Next.js 14+ App Router, Tailwind CSS v4, shadcn/ui, Framer Motion, Convex). Cross-reference with `ARCHITECTURE.md` for data schema and `BUILD.md` for phased implementation sequence.*
