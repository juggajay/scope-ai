# Wizard Step Transitions & Animation Research

> **Research Date:** February 2026
> **Purpose:** Animation patterns and implementation guide for ScopeAI's multi-step wizard
> **Stack:** Next.js 14+ (App Router) + Tailwind CSS v4 + shadcn/ui + Framer Motion (Motion v11)
> **Confidence Note:** Recommendations synthesised from Nielsen Norman Group research, Google Material Design guidelines, peer-reviewed UX studies, and official Motion library documentation. Specific duration/easing values are backed by cited research; code patterns are tested against Motion v11 API.

---

## TABLE OF CONTENTS

1. [Slide vs Fade vs Morph — Which Transition Wins?](#1-slide-vs-fade-vs-morph)
2. [Direction of Animation](#2-direction-of-animation)
3. [Duration Sweet Spots](#3-duration-sweet-spots)
4. [Content Loading Strategy](#4-content-loading-strategy)
5. [Framer Motion Implementation Patterns](#5-framer-motion-implementation-patterns)
6. [Reduced Motion Accessibility](#6-reduced-motion-accessibility)
7. [Mobile Touch Feedback](#7-mobile-touch-feedback)
8. [Complete Implementation Reference](#8-complete-implementation-reference)

---

## 1. Slide vs Fade vs Morph

### Research Summary

| Transition | Perceived Speed | Premium Feel | Best For |
|-----------|----------------|-------------|----------|
| **Slide** | Fastest perceived | Medium-High | Linear wizards with clear forward/back progression |
| **Fade** | Medium | High (when subtle) | Content swaps where spatial metaphor is not needed |
| **Morph (layout)** | Slowest perceived | Highest | Shared elements between steps (e.g. a card expanding into a detail view) |
| **Slide + Fade (hybrid)** | Fastest perceived + polished | Highest for wizards | Multi-step forms, onboarding flows |

### Evidence

- **NNGroup research** found that elements which slide in or display a shift in position at any degree of speed attract attention faster than elements that slowly fade into place. This makes slide transitions inherently better at signalling "something happened" in a wizard context. ([NNGroup: Animation Duration](https://www.nngroup.com/articles/animation-duration/))

- A **peer-reviewed user study** (ScienceDirect 2024) on animated UI transitions found that the Split-M pattern (fade combined with slide) in the Slide group best satisfied users, with an optimal interval of 150ms to enhance visual perception. ([ScienceDirect: User perception of animation fluency](https://www.sciencedirect.com/science/article/abs/pii/S1071581924000417))

- **Slide-over animations** establish spatial metaphor in wizard flows — the user mentally models "moving forward through pages." This reduces cognitive load because it maps to real-world page-turning. ([CXL: Animation Improve User Experience](https://cxl.com/blog/animation-improve-user-experience/))

### Recommendation for ScopeAI

**Use a hybrid slide + fade transition.** The entering step slides in from the direction of travel (left-to-right for forward) while fading from 0 to 1 opacity. The exiting step slides out in the opposite direction while fading to 0. This delivers the fastest perceived speed with the most polished feel.

**Do NOT use morph/layout transitions** for step-to-step navigation. Reserve layout animations for micro-interactions within a step (e.g. a selected card morphing its border).

---

## 2. Direction of Animation

### The Spatial Model

Wizard step transitions should follow a **horizontal spatial metaphor** consistent with LTR reading direction:

| Action | Enter From | Exit To |
|--------|-----------|---------|
| **Next step (forward)** | Right side | Left side |
| **Previous step (back)** | Left side | Right side |

### Why Horizontal, Not Vertical

- Horizontal sliding maps to page-turning and carousel mental models, which users already understand from mobile app onboarding flows.
- Vertical transitions (slide up/down) imply hierarchy changes (e.g. modal appearing, drill-down navigation), not sequential progression.
- Material Design and Apple HIG both use horizontal sliding for sequential flows and vertical for hierarchical navigation.

### Implementation: Direction State

Track direction as a simple integer: `1` for forward, `-1` for backward. Multiply by the slide distance to flip direction dynamically.

```typescript
// Direction: 1 = forward (enter from right), -1 = backward (enter from left)
const [direction, setDirection] = useState(1);

const handleNext = () => {
  setDirection(1);
  setStep((prev) => prev + 1);
};

const handleBack = () => {
  setDirection(-1);
  setStep((prev) => prev - 1);
};
```

---

## 3. Duration Sweet Spots

### Research-Backed Duration Table

| Animation Type | Duration | Source |
|---------------|----------|--------|
| **Micro-feedback** (checkbox, toggle, tap scale) | 80-120ms | NNGroup |
| **Step transition** (slide + fade between wizard steps) | 200-300ms | NNGroup, Material Design, ScienceDirect 2024 |
| **Card selection** (border highlight, scale) | 150-200ms | Material Design |
| **Stagger delay** (between list items) | 30-60ms per item | Industry standard |
| **Progress bar fill** | 300-500ms | Spring-based (continuous) |
| **Content fade-in** (after loading) | 150-200ms | NNGroup |
| **Exit animations** | 150-250ms (faster than entry) | NNGroup |

### Key Research Findings

1. **200-300ms is the sweet spot** for substantial screen changes. Shorter feels abrupt; longer feels sluggish. Analytics show 200-250ms yields 16% improvement in click-through metrics compared to slower transitions. ([NNGroup](https://www.nngroup.com/articles/animation-duration/))

2. **Entry should be slightly longer than exit.** A popup taking 300ms to appear but 200-250ms to disappear feels natural. The user wants to see what's coming in but wants what's leaving to get out of the way quickly. ([NNGroup](https://www.nngroup.com/articles/animation-duration/))

3. **500ms is the ceiling.** At 500ms, animations start to feel like "a real drag" for users. Never exceed this for any wizard transition. ([NNGroup](https://www.nngroup.com/articles/animation-duration/))

4. **Sub-100ms is imperceptible.** Animations under 100ms are instantaneous to the human eye and provide no visual feedback. ([NNGroup](https://www.nngroup.com/articles/animation-duration/))

5. **Mobile vs web:** Material Design recommends 200-300ms for mobile. Web-specific UI animations perform best at 150-200ms since users expect faster responses on desktop. Tablets should add ~30% duration (around 400ms). ([UX Collective](https://uxdesign.cc/the-ultimate-guide-to-proper-use-of-animation-in-ux-10bd98614fa9))

### Recommended Easing Functions

| Context | Easing | CSS/Motion Equivalent | Why |
|---------|--------|----------------------|-----|
| **Elements entering** | Ease-out (decelerate) | `[0.0, 0.0, 0.2, 1.0]` | Starts fast, settles gently. Feels responsive. |
| **Elements exiting** | Ease-in (accelerate) | `[0.4, 0.0, 1.0, 1.0]` | Starts slow, accelerates away. Feels natural. |
| **Step transition** | Ease-in-out | `[0.4, 0.0, 0.2, 1.0]` | Smooth in both directions. Best for paired enter/exit. |
| **Micro-interactions** | Spring | `{ type: "spring", stiffness: 300, damping: 25 }` | Physical, responsive feel for taps and selections. |
| **Never use** | Linear | `linear` | Looks robotic and unnatural. ([NNGroup](https://www.nngroup.com/articles/animation-duration/)) |

### ScopeAI Constants File

```typescript
// lib/animation-constants.ts

export const ANIMATION = {
  /** Step transition (slide + fade between wizard steps) */
  step: {
    duration: 0.25,           // 250ms — sweet spot for web wizard
    slideDistance: 60,         // pixels to slide (not full-width — subtle is better)
    ease: [0.4, 0.0, 0.2, 1.0] as const,  // Material ease-in-out
  },

  /** Card selection feedback */
  card: {
    tapScale: 0.97,           // Scale down on tap
    hoverScale: 1.02,         // Scale up on hover
    borderDuration: 0.15,     // 150ms for border highlight
    springConfig: { type: "spring" as const, stiffness: 300, damping: 25 },
  },

  /** Stagger for option lists */
  stagger: {
    delayChildren: 0.05,      // 50ms initial delay
    staggerChildren: 0.04,    // 40ms between each child
  },

  /** Progress bar */
  progress: {
    springConfig: { type: "spring" as const, stiffness: 50, damping: 15 },
  },

  /** Content loading fade-in */
  fadeIn: {
    duration: 0.15,           // 150ms
    ease: "easeOut" as const,
  },

  /** Exit (always faster than enter) */
  exit: {
    duration: 0.2,            // 200ms
    ease: [0.4, 0.0, 1.0, 1.0] as const,  // ease-in (accelerate away)
  },
} as const;
```

---

## 4. Content Loading Strategy

### Research: Skeletons vs Spinners

| Method | Perceived Wait Time | User Satisfaction | Best For |
|--------|-------------------|-------------------|----------|
| **Skeleton screen** | Shortest perceived | Highest | Full page loads, data-heavy screens |
| **Spinner** | Longest perceived | Lowest | Background tasks (uploading, processing) |
| **Instant + stagger** | Near-zero perceived | Highest | Lists where data is already available |
| **No indicator (< 1s)** | Zero | Highest | When content loads in under 1 second |

### Key Findings

- **Skeleton screens reduce perceived load time** because they shift users from passive waiting (watching a spinner) to active waiting (processing the layout preview). ([LogRocket: Skeleton Loading](https://blog.logrocket.com/ux-design/skeleton-loading-screen-design/))

- **Do NOT show a skeleton for loads under 1 second.** The quick flash of a skeleton is more annoying than a brief blank state. ([NNGroup: Skeleton Screens 101](https://www.nngroup.com/articles/skeleton-screens/))

- **Slow left-to-right wave animation** on skeleton blocks provides the best perceived duration among users. ([NNGroup](https://www.nngroup.com/articles/skeleton-screens/))

### Recommendation for ScopeAI Wizard

The wizard question sets are static TypeScript files loaded at build time (see `lib/questions/kitchen.ts` etc.), so **questions load instantly — no loading state is needed for step transitions.**

For the rare cases where content needs loading:

1. **Photo upload feedback:** Show a progress bar (not a spinner) with percentage. Spinners are passive; progress bars are active.
2. **AI generation (photo analysis, scope generation):** Show a skeleton layout of the expected output with a wave animation, plus real milestone text (e.g. "Analysing plumbing requirements...").
3. **Quick data fetches (< 1s):** Show nothing. Let the content appear instantly. A skeleton that flashes for 200ms is worse than no indicator.

### Skeleton Component Pattern

```tsx
// components/ui/skeleton-card.tsx

import { cn } from "@/lib/utils";

interface SkeletonCardProps {
  lines?: number;
  className?: string;
}

export function SkeletonCard({ lines = 3, className }: SkeletonCardProps) {
  return (
    <div className={cn("space-y-3 p-4", className)}>
      {/* Title skeleton */}
      <div className="h-5 w-2/3 animate-skeleton rounded-md bg-muted" />
      {/* Content line skeletons */}
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-4 animate-skeleton rounded-md bg-muted",
            i === lines - 1 ? "w-1/2" : "w-full"
          )}
          style={{ animationDelay: `${i * 100}ms` }}
        />
      ))}
    </div>
  );
}
```

```css
/* Add to globals.css */
@keyframes skeleton-wave {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.animate-skeleton {
  background: linear-gradient(
    90deg,
    hsl(var(--muted)) 25%,
    hsl(var(--muted-foreground) / 0.08) 50%,
    hsl(var(--muted)) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-wave 1.8s ease-in-out infinite;
}
```

---

## 5. Framer Motion Implementation Patterns

### 5.1 Step Transition (AnimatePresence + Variants)

This is the core wizard animation. Uses `AnimatePresence` with `mode="wait"` to ensure the exiting step completes before the entering step begins.

```tsx
// components/wizard/wizard-step-transition.tsx

"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ANIMATION } from "@/lib/animation-constants";

// ─── Variant Definitions ────────────────────────────────────────────────────

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

const stepTransition = {
  x: {
    type: "tween" as const,
    duration: ANIMATION.step.duration,
    ease: ANIMATION.step.ease,
  },
  opacity: {
    duration: ANIMATION.exit.duration,
    ease: "easeInOut" as const,
  },
};

// ─── Component ──────────────────────────────────────────────────────────────

interface WizardStepTransitionProps {
  /** Current step index — used as the AnimatePresence key */
  stepIndex: number;
  /** 1 for forward, -1 for backward */
  direction: number;
  children: React.ReactNode;
}

export function WizardStepTransition({
  stepIndex,
  direction,
  children,
}: WizardStepTransitionProps) {
  return (
    <AnimatePresence mode="wait" custom={direction} initial={false}>
      <motion.div
        key={stepIndex}
        custom={direction}
        variants={stepVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={stepTransition}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
```

**Why `mode="wait"`:** In a wizard, only one step should be visible at a time. `mode="wait"` ensures the exiting step finishes its exit animation before the entering step begins its enter animation. This prevents two steps from overlapping.

**Why `initial={false}`:** Prevents the first step from animating in on page load. The user should see step 1 immediately without a slide effect.

**Why `custom={direction}`:** Passes the direction value (1 or -1) into the variant functions so they can calculate the correct slide direction. The `custom` prop on `AnimatePresence` is required because exit animations read from the parent's custom value (the component is already unmounting, so its own props are stale).

### 5.2 Card Selection Animation

For question cards (e.g. selecting project type, answering multiple-choice questions). Combines tap feedback, hover feedback, and selection state.

```tsx
// components/wizard/selectable-card.tsx

"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ANIMATION } from "@/lib/animation-constants";

interface SelectableCardProps {
  selected: boolean;
  onSelect: () => void;
  children: React.ReactNode;
  className?: string;
}

export function SelectableCard({
  selected,
  onSelect,
  children,
  className,
}: SelectableCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      // ── Gesture animations ──
      whileHover={{ scale: ANIMATION.card.hoverScale }}
      whileTap={{ scale: ANIMATION.card.tapScale }}
      // ── Selection state animation ──
      animate={{
        borderColor: selected
          ? "var(--color-teal-500)"
          : "var(--color-border)",
        backgroundColor: selected
          ? "var(--color-teal-500-10)"   // teal at 10% opacity
          : "var(--color-card)",
        boxShadow: selected
          ? "0 0 0 2px var(--color-teal-500)"
          : "0 0 0 0px transparent",
      }}
      transition={ANIMATION.card.springConfig}
      // ── Base styles ──
      className={cn(
        "relative w-full rounded-lg border p-4 text-left",
        "outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2",
        "cursor-pointer",
        className
      )}
    >
      {/* Selection checkmark indicator */}
      <AnimatedCheckmark visible={selected} />
      {children}
    </motion.button>
  );
}

// ─── Checkmark SVG ──────────────────────────────────────────────────────────

function AnimatedCheckmark({ visible }: { visible: boolean }) {
  return (
    <motion.div
      className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-teal-500"
      initial={false}
      animate={{
        scale: visible ? 1 : 0,
        opacity: visible ? 1 : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 20,
      }}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <motion.path
          d="M5 13l4 4L19 7"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: visible ? 1 : 0 }}
          transition={{
            delay: 0.1,
            type: "tween",
            ease: "easeOut",
            duration: 0.25,
          }}
        />
      </svg>
    </motion.div>
  );
}
```

### 5.3 Progress Bar Animation

Smooth, spring-based progress bar that animates between steps.

```tsx
// components/wizard/wizard-progress-bar.tsx

"use client";

import { motion } from "framer-motion";
import { ANIMATION } from "@/lib/animation-constants";

interface WizardProgressBarProps {
  /** Current step (0-indexed) */
  currentStep: number;
  /** Total number of steps */
  totalSteps: number;
}

export function WizardProgressBar({
  currentStep,
  totalSteps,
}: WizardProgressBarProps) {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
      <motion.div
        className="h-full rounded-full bg-teal-500"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={ANIMATION.progress.springConfig}
      />
    </div>
  );
}
```

**Why spring for progress:** A spring-based transition overshoots slightly and settles, which gives the progress bar a satisfying, physical feel. A tween would feel mechanical. The low stiffness (50) and moderate damping (15) create a smooth, non-bouncy fill that takes approximately 400ms to settle.

### 5.4 Stagger Animation for Option Lists

For rendering a list of selectable options (e.g. question answers) with a cascading entrance.

```tsx
// components/wizard/staggered-options.tsx

"use client";

import { motion } from "framer-motion";
import { ANIMATION } from "@/lib/animation-constants";

// ─── Container variant (controls stagger timing) ────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: ANIMATION.stagger.delayChildren,
      staggerChildren: ANIMATION.stagger.staggerChildren,
    },
  },
};

// ─── Individual item variant ────────────────────────────────────────────────

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 12,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: "easeOut" as const,
    },
  },
};

// ─── Component ──────────────────────────────────────────────────────────────

interface StaggeredOptionsProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  /** Unique key for AnimatePresence to re-trigger stagger on step change */
  groupKey?: string | number;
}

export function StaggeredOptions<T>({
  items,
  renderItem,
  className,
  groupKey,
}: StaggeredOptionsProps<T>) {
  return (
    <motion.div
      key={groupKey}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {items.map((item, index) => (
        <motion.div key={index} variants={itemVariants}>
          {renderItem(item, index)}
        </motion.div>
      ))}
    </motion.div>
  );
}
```

**Usage example:**

```tsx
<StaggeredOptions
  groupKey={currentStep} // re-triggers stagger when step changes
  items={currentQuestion.options}
  className="grid gap-3"
  renderItem={(option) => (
    <SelectableCard
      selected={selectedAnswer === option.value}
      onSelect={() => setSelectedAnswer(option.value)}
    >
      <span className="font-medium">{option.label}</span>
      {option.description && (
        <span className="text-sm text-muted-foreground">
          {option.description}
        </span>
      )}
    </SelectableCard>
  )}
/>
```

### 5.5 Step Counter / Step Indicator Animation

Animated step indicators that change state (inactive -> active -> complete).

```tsx
// components/wizard/step-indicator.tsx

"use client";

import { motion } from "framer-motion";

type StepStatus = "inactive" | "active" | "complete";

const statusVariants = {
  inactive: {
    backgroundColor: "var(--color-muted)",
    borderColor: "var(--color-border)",
    color: "var(--color-muted-foreground)",
    scale: 1,
  },
  active: {
    backgroundColor: "var(--color-background)",
    borderColor: "var(--color-teal-500)",
    color: "var(--color-teal-500)",
    scale: 1.1,
  },
  complete: {
    backgroundColor: "var(--color-teal-500)",
    borderColor: "var(--color-teal-500)",
    color: "var(--color-white)",
    scale: 1,
  },
};

interface StepIndicatorProps {
  stepNumber: number;
  status: StepStatus;
  label?: string;
}

export function StepIndicator({ stepNumber, status, label }: StepIndicatorProps) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <motion.div
        className="flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-semibold"
        initial={false}
        animate={status}
        variants={statusVariants}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 25,
        }}
      >
        {status === "complete" ? (
          <motion.svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <motion.path
              d="M5 13l4 4L19 7"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.15, duration: 0.25, ease: "easeOut" }}
            />
          </motion.svg>
        ) : (
          stepNumber
        )}
      </motion.div>
      {label && (
        <span className="text-xs text-muted-foreground">{label}</span>
      )}
    </div>
  );
}
```

---

## 6. Reduced Motion Accessibility

### Why This Matters

- Approximately 1 in 3 people experience motion sensitivity at some level.
- `prefers-reduced-motion: reduce` is a system-level setting on macOS, iOS, Windows, and Android.
- Motion (Framer Motion) provides built-in support through the `useReducedMotion` hook and global `MotionConfig`.

### Strategy: Replace Transform with Opacity

When reduced motion is enabled:
- **Keep:** Opacity transitions, color changes, border changes (these are not motion-triggering).
- **Remove:** x/y slides, scale changes, spring-based bouncing, stagger delays.
- **Preserve:** The flow should still feel intentional and polished, just without spatial movement.

### Implementation: Global MotionConfig

The simplest approach is to wrap the wizard in a `MotionConfig` with `reducedMotion="user"`. This automatically disables transform and layout animations while preserving opacity and color animations.

```tsx
// app/create/layout.tsx

"use client";

import { MotionConfig } from "framer-motion";

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MotionConfig reducedMotion="user">
      {children}
    </MotionConfig>
  );
}
```

With `reducedMotion="user"`, Motion automatically:
- Disables `x`, `y`, `scale`, `rotate` animations when the user prefers reduced motion
- Preserves `opacity`, `backgroundColor`, `borderColor`, `color` animations
- No manual `useReducedMotion` checks needed in every component

### Per-Component Override (for custom behaviour)

For components where you want custom reduced-motion behaviour instead of the global default:

```tsx
// Example: Step transition with reduced motion fallback

"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ANIMATION } from "@/lib/animation-constants";

export function WizardStepTransition({
  stepIndex,
  direction,
  children,
}: WizardStepTransitionProps) {
  const shouldReduceMotion = useReducedMotion();

  const variants = {
    enter: (dir: number) => ({
      // No slide when reduced motion; just fade
      x: shouldReduceMotion ? 0 : dir * ANIMATION.step.slideDistance,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: shouldReduceMotion ? 0 : -dir * ANIMATION.step.slideDistance,
      opacity: 0,
    }),
  };

  return (
    <AnimatePresence mode="wait" custom={direction} initial={false}>
      <motion.div
        key={stepIndex}
        custom={direction}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{
          // Faster transition when reduced motion
          duration: shouldReduceMotion ? 0.15 : ANIMATION.step.duration,
          ease: shouldReduceMotion ? "easeInOut" : ANIMATION.step.ease,
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
```

### Tailwind CSS Fallback for Non-Motion Animations

For any CSS-driven animations (like the skeleton wave), respect the system preference:

```css
/* globals.css */
@media (prefers-reduced-motion: reduce) {
  .animate-skeleton {
    animation: none;
    /* Still show the background colour, just no wave */
    background: hsl(var(--muted));
  }
}
```

### Testing Reduced Motion

| Platform | How to Enable |
|----------|--------------|
| macOS | System Settings -> Accessibility -> Display -> Reduce motion |
| iOS | Settings -> Accessibility -> Motion -> Reduce Motion |
| Windows | Settings -> Ease of Access -> Display -> Show animations in Windows (off) |
| Chrome DevTools | Rendering tab -> Emulate CSS media feature -> prefers-reduced-motion: reduce |

---

## 7. Mobile Touch Feedback

### The 100ms Rule

Users expect feedback within 100ms of a touch event. Any delay beyond this feels broken. ([NNGroup](https://www.nngroup.com/articles/animation-duration/))

On mobile:
- **Visual feedback** (scale, colour change) must begin within one frame (~16ms).
- **Haptic feedback** (if available) should fire simultaneously.
- **State change** (e.g. marking an answer as selected) can happen on the next frame.

### Tap Feedback: Scale + Colour

Framer Motion's `whileTap` triggers on the first frame of a press, providing sub-16ms visual feedback:

```tsx
<motion.button
  whileTap={{ scale: 0.97 }}
  transition={{ type: "spring", stiffness: 400, damping: 25 }}
  // ...
>
```

**Why 0.97 and not 0.9?** A 3% scale-down is subtle enough to feel responsive without being distracting. Larger scale changes (0.85-0.9) look cartoonish on cards with text content. Reserve aggressive scaling for icon-only buttons.

### Haptic Feedback (Optional Enhancement)

The Web Vibration API provides basic haptic feedback on Android. iOS Safari does not support it, but iOS handles tap feedback natively through UIKit.

```typescript
// lib/haptics.ts

/**
 * Trigger a light haptic tap on supported devices.
 * Falls back silently on unsupported browsers (Safari, Firefox).
 */
export function hapticTap() {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(10); // 10ms pulse — light tap
  }
}

/**
 * Trigger a medium haptic for confirmations (e.g. step complete).
 */
export function hapticConfirm() {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate([10, 30, 10]); // tap-pause-tap pattern
  }
}
```

**Usage in card selection:**

```tsx
import { hapticTap } from "@/lib/haptics";

function handleSelect(value: string) {
  hapticTap();
  setSelectedAnswer(value);
}
```

### Touch Target Sizing

Per Apple HIG and Material Design guidelines:

- **Minimum touch target:** 44x44px (Apple) / 48x48dp (Material)
- **Minimum spacing between targets:** 8px
- **Card options in the wizard** should be at minimum 56px tall with 12px gap between them

```tsx
// Tailwind classes for touch-friendly cards
className="min-h-[56px] p-4 gap-3"
// Grid gap for option lists
className="grid gap-3"
```

### Active State Color Timing

When a card is tapped, the background colour change should happen:
1. **Immediately on tap** (within `whileTap`) — use a slightly darker shade
2. **On selection confirmation** — animate to the selected teal state over 150ms
3. **On deselection** — animate back to the default state over 150ms

This two-phase approach (instant darker shade + animated teal) makes the interaction feel both responsive and polished.

```tsx
<motion.button
  // Phase 1: Instant feedback
  whileTap={{
    scale: 0.97,
    backgroundColor: "var(--color-muted)",
  }}
  // Phase 2: Selection state (animated)
  animate={{
    backgroundColor: selected
      ? "var(--color-teal-500-10)"
      : "var(--color-card)",
  }}
  transition={ANIMATION.card.springConfig}
/>
```

---

## 8. Complete Implementation Reference

### 8.1 Full Wizard Page Component

This shows how all the patterns combine into a single wizard page:

```tsx
// app/create/[projectId]/questions/page.tsx

"use client";

import { useState, useCallback } from "react";
import { MotionConfig } from "framer-motion";
import { WizardStepTransition } from "@/components/wizard/wizard-step-transition";
import { WizardProgressBar } from "@/components/wizard/wizard-progress-bar";
import { StaggeredOptions } from "@/components/wizard/staggered-options";
import { SelectableCard } from "@/components/wizard/selectable-card";
import { ANIMATION } from "@/lib/animation-constants";
import { hapticTap } from "@/lib/haptics";
import type { QuestionSet } from "@/types";

interface QuestionsWizardProps {
  questions: QuestionSet;
}

export function QuestionsWizard({ questions }: QuestionsWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const currentQuestion = questions[currentStep];
  const totalSteps = questions.length;

  const handleNext = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
    }
  }, [currentStep, totalSteps]);

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const handleAnswer = useCallback(
    (questionId: string, value: string) => {
      hapticTap();
      setAnswers((prev) => ({ ...prev, [questionId]: value }));
    },
    []
  );

  return (
    <MotionConfig reducedMotion="user">
      <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-8">
        {/* Progress bar */}
        <WizardProgressBar
          currentStep={currentStep}
          totalSteps={totalSteps}
        />

        {/* Step counter */}
        <p className="text-sm text-muted-foreground">
          Question {currentStep + 1} of {totalSteps}
        </p>

        {/* Animated step content */}
        <WizardStepTransition
          stepIndex={currentStep}
          direction={direction}
        >
          <div className="space-y-6">
            {/* Question title */}
            <h2 className="text-xl font-semibold tracking-tight">
              {currentQuestion.title}
            </h2>

            {/* Options with stagger */}
            <StaggeredOptions
              groupKey={currentStep}
              items={currentQuestion.options}
              className="grid gap-3"
              renderItem={(option) => (
                <SelectableCard
                  selected={answers[currentQuestion.id] === option.value}
                  onSelect={() =>
                    handleAnswer(currentQuestion.id, option.value)
                  }
                >
                  <span className="font-medium">{option.label}</span>
                </SelectableCard>
              )}
            />
          </div>
        </WizardStepTransition>

        {/* Navigation buttons */}
        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="rounded-md px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-0"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={!answers[currentQuestion.id]}
            className="rounded-md bg-teal-500 px-6 py-2 text-sm font-medium text-white hover:bg-teal-600 disabled:opacity-50"
          >
            {currentStep === totalSteps - 1 ? "Continue" : "Next"}
          </button>
        </div>
      </div>
    </MotionConfig>
  );
}
```

### 8.2 Quick-Reference: All Variant Objects

Copy-paste-ready variant definitions:

```typescript
// ─── Step Transition Variants ───────────────────────────────────────────────

export const stepVariants = {
  enter: (direction: number) => ({
    x: direction * 60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: -direction * 60,
    opacity: 0,
  }),
};

export const stepTransition = {
  x: { type: "tween", duration: 0.25, ease: [0.4, 0.0, 0.2, 1.0] },
  opacity: { duration: 0.2, ease: "easeInOut" },
};

// ─── Stagger Container Variants ─────────────────────────────────────────────

export const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.05,
      staggerChildren: 0.04,
    },
  },
};

export const staggerItemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: "easeOut" },
  },
};

// ─── Card Selection Variants ────────────────────────────────────────────────

export const cardGestureProps = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.97 },
  transition: { type: "spring", stiffness: 300, damping: 25 },
};

// ─── Step Indicator Variants ────────────────────────────────────────────────

export const stepIndicatorVariants = {
  inactive: {
    backgroundColor: "var(--color-muted)",
    borderColor: "var(--color-border)",
    color: "var(--color-muted-foreground)",
    scale: 1,
  },
  active: {
    backgroundColor: "var(--color-background)",
    borderColor: "var(--color-teal-500)",
    color: "var(--color-teal-500)",
    scale: 1.1,
  },
  complete: {
    backgroundColor: "var(--color-teal-500)",
    borderColor: "var(--color-teal-500)",
    color: "var(--color-white)",
    scale: 1,
  },
};

// ─── Fade-In Variant (for content loading) ──────────────────────────────────

export const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.15, ease: "easeOut" },
  },
};

// ─── Checkmark Animation ────────────────────────────────────────────────────

export const checkmarkCircleVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring", stiffness: 400, damping: 20 },
  },
};

export const checkmarkPathTransition = {
  delay: 0.1,
  type: "tween",
  ease: "easeOut",
  duration: 0.25,
};
```

### 8.3 Spring Configuration Reference

| Preset | stiffness | damping | mass | Feel | Use Case |
|--------|-----------|---------|------|------|----------|
| **Snappy** | 400 | 25 | 1 | Quick, no bounce | Tap feedback, checkmarks |
| **Smooth** | 300 | 25 | 1 | Controlled, slight settle | Card selection, border highlight |
| **Gentle** | 200 | 20 | 1 | Soft, natural | Scale on hover |
| **Progress** | 50 | 15 | 1 | Slow fill, slight overshoot | Progress bar, gauges |
| **Bouncy** | 300 | 10 | 1 | Playful, visible bounce | Celebration states (avoid in wizard) |

**Default Motion values** (for reference): stiffness: 100, damping: 10, mass: 1. These default values produce a noticeably bouncy animation — too playful for a professional tool like ScopeAI. The "Snappy" and "Smooth" presets above are recommended.

---

## Sources

- [NNGroup: Executing UX Animations — Duration and Motion Characteristics](https://www.nngroup.com/articles/animation-duration/)
- [NNGroup: Skeleton Screens 101](https://www.nngroup.com/articles/skeleton-screens/)
- [NNGroup: The Role of Animation and Motion in UX](https://www.nngroup.com/articles/animation-purpose-ux/)
- [ScienceDirect: User perception of animation fluency (2024)](https://www.sciencedirect.com/science/article/abs/pii/S1071581924000417)
- [UX Collective: The Ultimate Guide to Proper Use of Animation in UX](https://uxdesign.cc/the-ultimate-guide-to-proper-use-of-animation-in-ux-10bd98614fa9)
- [CXL: 4 Ways Animation Can Actually Improve User Experience](https://cxl.com/blog/animation-improve-user-experience/)
- [LogRocket: Skeleton Loading Screen Design](https://blog.logrocket.com/ux-design/skeleton-loading-screen-design/)
- [Motion Docs: AnimatePresence](https://motion.dev/docs/react-animate-presence)
- [Motion Docs: Accessibility](https://motion.dev/docs/react-accessibility)
- [Motion Docs: useReducedMotion](https://motion.dev/docs/react-use-reduced-motion)
- [Motion Docs: Transitions](https://motion.dev/docs/react-transitions)
- [Motion Docs: Spring](https://motion.dev/docs/spring)
- [BuildUI: Multistep Wizard — Framer Motion Recipes](https://buildui.com/courses/framer-motion-recipes/multistep-wizard)
- [Maxime Heckel: Advanced Animation Patterns with Framer Motion](https://blog.maximeheckel.com/posts/advanced-animation-patterns-with-framer-motion/)
- [Josh W. Comeau: Accessible Animations with prefers-reduced-motion](https://www.joshwcomeau.com/react/prefers-reduced-motion/)
- [Android Developers: Haptics Design Principles](https://developer.android.com/develop/ui/views/haptics/haptics-principles)
- [Saropa: 2025 Guide to Haptics](https://saropa-contacts.medium.com/2025-guide-to-haptics-enhancing-mobile-ux-with-tactile-feedback-676dd5937774)
