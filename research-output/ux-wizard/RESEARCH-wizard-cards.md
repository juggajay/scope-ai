# Research: Tap-to-Select Card Patterns

**Section:** 4 of UX Wizard Research
**Date:** February 2026
**Status:** Complete
**Applies to:** ModeSelection, ProjectSetup, SmartQuestions components

---

## Table of Contents

1. [Card Sizing and Layout](#1-card-sizing-and-layout)
2. [Selection Feedback](#2-selection-feedback)
3. [Single-Select vs Multi-Select Visual Difference](#3-single-select-vs-multi-select-visual-difference)
4. [Icon + Text Layout Within Cards](#4-icon--text-layout-within-cards)
5. ["Not Sure" / Escape Option](#5-not-sure--escape-option)
6. [Auto-Advance Behaviour](#6-auto-advance-behaviour)
7. [Keyboard and Accessibility](#7-keyboard-and-accessibility)
8. [Mobile-Specific Considerations](#8-mobile-specific-considerations)
9. [Complete Component Implementation](#9-complete-component-implementation)
10. [Card State Reference Table](#10-card-state-reference-table)

---

## 1. Card Sizing and Layout

### Research Findings

Selectable cards work best when they are large enough to be a comfortable touch target but not so large that only 1-2 options are visible per screen. The Salt Design System recommends using selectable cards "when options are the primary focus of your UI with adequate space" and "when mobile users need large touch targets for swift interaction."

For ScopeAI, where questions have 3-5 options on average (with a max of 5 based on the kitchen and bathroom question sets), the layout must accommodate both short labels ("No island") and long labels ("Budget ($15-25K) -- functional, basic finishes").

### Recommendations

**Minimum card height:** 56px (aligns with Apple's 44pt minimum touch target plus 6px padding top and bottom).

**Preferred card height:** 64-72px for single-line labels, auto-expanding for multi-line content.

**Grid strategy:** Use a single-column stack layout on all screen sizes. Do not use 2-column or 3-column grids for selection cards. Rationale:

1. ScopeAI's option labels are text-heavy (not icon-only), ranging from 15 to 50+ characters.
2. Uneven text lengths in a grid create ragged, inconsistent cards that look unprofessional.
3. Single-column gives the entire screen width for touch targets on mobile.
4. Typeform, Tally, and other high-converting form tools all use single-column for text options.
5. Vertical stacking makes it obvious which option your thumb is tapping.

**Exception -- Mode Selection and Project Type:** These two screens have short labels with prominent icons. Use a 2-column grid on tablet/desktop (640px+) and single-column on mobile. These are the only screens where cards are "visual-first" rather than "text-first."

### Tailwind Layout Classes

```
/* Question option cards -- always single column */
Container: "flex flex-col gap-3"

/* Mode selection / Project type cards -- responsive grid */
Container: "grid grid-cols-1 sm:grid-cols-2 gap-3"

/* Individual card sizing */
Card: "min-h-[56px] px-4 py-3"

/* Card with description text */
Card: "min-h-[72px] px-4 py-3.5"
```

### Spacing Between Cards

The gap between selectable cards should be 12px (`gap-3`). This provides enough separation to prevent mis-taps on mobile (Apple recommends 8dp minimum between touch targets) while keeping the option group visually cohesive. Do not use `gap-2` (8px) -- too tight for touch. Do not use `gap-4` (16px) -- too spread out, makes options feel disconnected.

---

## 2. Selection Feedback

### Research Findings

Selection feedback must be immediate, unambiguous, and multi-signal. Users need to instantly know: (a) which option they tapped, and (b) that the system registered their tap. The best selection patterns combine multiple visual cues rather than relying on a single change.

The Salt Design System notes that "the state is visual feedback that appears on the specific user's interactions" and that cards should be styled according to the applied state for each interaction.

Framer Motion spring animations with `stiffness: 300, damping: 20` provide natural, non-jarring feedback that feels physical without being distracting.

### Recommended Selection Feedback (Combined Signals)

Apply ALL of the following simultaneously on selection:

| Signal | Change | Purpose |
|--------|--------|---------|
| Border colour | `border-border` to `border-primary` (teal) | Primary visual indicator |
| Border width | `border` (1px) to `border-2` (2px) | Reinforces colour change |
| Background fill | `bg-card` to `bg-primary/5` | Subtle wash signals "this area is active" |
| Checkmark icon | Hidden to visible (teal circle with white check) | Unambiguous "selected" affordance |
| Scale pulse | Brief `scale(1.02)` on tap, settling to `scale(1)` | Tactile feel via Framer Motion |
| Ring/shadow | None to `ring-1 ring-primary/20` | Subtle glow reinforces selection |

**Why multiple signals:** Users scan quickly. A border-only change is too subtle on a white background. A background-only change is invisible in dark mode if poorly calibrated. The checkmark alone could be missed on small screens. Combining 3-4 signals guarantees the selection state is obvious at any glance.

### Tailwind State Classes

```
/* DEFAULT state */
"border border-border bg-card text-card-foreground
 hover:border-primary/50 hover:bg-accent/5
 cursor-pointer transition-all duration-150"

/* HOVER state (desktop only, via hover:) */
"hover:border-primary/50 hover:bg-accent/5"

/* FOCUS-VISIBLE state (keyboard navigation) */
"focus-visible:outline-none focus-visible:ring-2
 focus-visible:ring-ring focus-visible:ring-offset-2"

/* SELECTED state */
"border-2 border-primary bg-primary/5
 ring-1 ring-primary/20 shadow-sm"

/* DISABLED state */
"opacity-50 cursor-not-allowed pointer-events-none"
```

### Border Width Compensation

When toggling from `border` (1px) to `border-2` (2px), the extra pixel causes a 1px layout shift. Prevent this with a negative margin or by always using `border-2` and changing only the colour:

**Option A -- Always border-2 (recommended):**
```
Default:  "border-2 border-transparent ..."
          (transparent border reserves space)
Selected: "border-2 border-primary ..."
```

This avoids any layout shift entirely. The transparent border occupies the same space as the teal border.

**Option B -- Ring instead of border-2:**
```
Default:  "border border-border ..."
Selected: "border border-primary ring-2 ring-primary/20 ..."
```

Ring renders outside the element and does not cause layout shift.

**Recommendation:** Use Option A (always `border-2` with transparent default). It is the cleanest approach.

### Framer Motion Animation Config

```tsx
const cardVariants = {
  idle: { scale: 1 },
  tap: { scale: 0.98 },
  selected: { scale: 1 },
};

const springConfig = {
  type: "spring" as const,
  stiffness: 500,
  damping: 30,
  mass: 0.8,
};

// Usage on the card:
// <motion.button
//   variants={cardVariants}
//   whileTap="tap"
//   animate={isSelected ? "selected" : "idle"}
//   transition={springConfig}
// >
```

The `whileTap` scale-down (0.98) gives a "button press" feel. The spring config is intentionally stiff with high damping to prevent any bouncing -- the card should feel crisp, not wobbly.

---

## 3. Single-Select vs Multi-Select Visual Difference

### Research Findings

The Salt Design System explicitly separates single-select (radio buttons) from multi-select (checkboxes) and recommends "displaying form controls for ADA compliance to help visually impaired users." Material Design similarly uses radio buttons for single selection and checkboxes for multi-select.

This is not just a visual nicety -- it is a WCAG requirement. Users who rely on screen readers expect `role="radio"` for single-select and `role="checkbox"` for multi-select. Sighted users also rely on the visual shape difference (circle vs square) as a learned pattern.

### Recommendations

**Rule:** Every selectable card must show either a radio indicator or a checkbox indicator, positioned consistently. This makes the selection mode immediately obvious before the user interacts.

#### Single-Select Cards

- Show a **radio circle** in the top-right corner of the card.
- Default: empty circle with border (`border-2 border-muted-foreground/30 rounded-full w-5 h-5`).
- Selected: filled teal circle with white dot centre, or teal circle with white checkmark.
- Label above options: the question text only (no additional "Select one" label needed because the radio circles make it obvious).
- ARIA role: `radiogroup` on container, `radio` on each card.

#### Multi-Select Cards

- Show a **checkbox square** in the top-right corner of the card.
- Default: empty square with border and rounded corners (`border-2 border-muted-foreground/30 rounded-sm w-5 h-5`).
- Selected: teal-filled square with white checkmark icon.
- Label above options: add **"Select all that apply"** subtext below the question. This explicit instruction is essential -- do not rely on checkbox shape alone.
- ARIA role: `group` on container, `checkbox` on each card.

#### Indicator Placement

Place the indicator in the **top-right corner** of the card, not inline with text. This keeps the text left-aligned and scannable while the indicator sits in a predictable position. The indicator should be vertically centred within the card when the card has a single line of text, and top-aligned when the card has multiple lines.

### Tailwind Classes for Indicators

```
/* Radio indicator -- default */
"flex items-center justify-center w-5 h-5
 rounded-full border-2 border-muted-foreground/30
 transition-colors duration-150"

/* Radio indicator -- selected */
"flex items-center justify-center w-5 h-5
 rounded-full border-2 border-primary bg-primary"
/* Inner dot: "w-2 h-2 rounded-full bg-white" */

/* Checkbox indicator -- default */
"flex items-center justify-center w-5 h-5
 rounded-sm border-2 border-muted-foreground/30
 transition-colors duration-150"

/* Checkbox indicator -- selected */
"flex items-center justify-center w-5 h-5
 rounded-sm border-2 border-primary bg-primary"
/* Inner icon: <Check className="w-3.5 h-3.5 text-white" /> */
```

### "Select All That Apply" Subtext

```
/* Below question text, only for multi-select */
"text-sm text-muted-foreground mt-1"
```

Content: "Select all that apply" -- always this exact phrasing. It is universally understood.

---

## 4. Icon + Text Layout Within Cards

### Research Findings

ScopeAI's cards will appear in three contexts:

1. **Mode Selection** -- 2 cards, icon-heavy, with title + description. ("I'll coordinate trades myself" vs "I'll hire a builder")
2. **Project Type** -- 5 cards, each with an icon + short label. (Kitchen, Bathroom, Laundry, Living, Outdoor)
3. **Smart Questions** -- 3-5 cards per question, text-primary, minimal or no icons.

Each context requires a different internal card layout.

### Card Layout Patterns

#### Pattern A: Icon-Prominent Card (Mode Selection, Project Type)

Used when the icon is the primary visual anchor and the text is secondary.

```
┌─────────────────────────────────────────┐
│  [Icon 28px]                      [o]   │
│                                         │
│  Title text (font-medium)               │
│  Description text (text-sm muted)       │
└─────────────────────────────────────────┘
```

- Icon: 28px (`w-7 h-7`), rendered in teal on default, white on teal circle when selected.
- Title: `text-base font-medium text-foreground`
- Description: `text-sm text-muted-foreground mt-1`
- Radio/checkbox indicator: top-right corner.
- Internal padding: `px-4 py-4`

```tsx
// Tailwind structure
<div className="flex items-start gap-3 px-4 py-4">
  <div className="flex-shrink-0 mt-0.5">
    <Icon className="w-7 h-7 text-primary" />
  </div>
  <div className="flex-1 min-w-0">
    <p className="text-base font-medium text-foreground">
      {title}
    </p>
    {description && (
      <p className="text-sm text-muted-foreground mt-1">
        {description}
      </p>
    )}
  </div>
  <div className="flex-shrink-0">
    {/* Radio or checkbox indicator */}
  </div>
</div>
```

#### Pattern B: Text-Primary Card (Smart Questions)

Used for most wizard questions where the option is a text label with no icon.

```
┌─────────────────────────────────────────┐
│  Label text                        [o]  │
└─────────────────────────────────────────┘
```

- No icon.
- Label: `text-sm font-medium text-foreground` (not `text-base` -- slightly smaller for option lists to differentiate from the question heading).
- Radio/checkbox indicator: right side, vertically centred.
- Internal padding: `px-4 py-3`

```tsx
// Tailwind structure
<div className="flex items-center gap-3 px-4 py-3">
  <p className="flex-1 text-sm font-medium text-foreground">
    {label}
  </p>
  <div className="flex-shrink-0">
    {/* Radio or checkbox indicator */}
  </div>
</div>
```

#### Pattern C: Text Card with Description (Quality Tier, some questions)

Used when the option label needs clarification text.

```
┌─────────────────────────────────────────┐
│  Label text                        [o]  │
│  Description / helper text              │
└─────────────────────────────────────────┘
```

- Label: `text-sm font-medium text-foreground`
- Description: `text-xs text-muted-foreground mt-0.5`
- Internal padding: `px-4 py-3`

```tsx
// Tailwind structure
<div className="flex items-start gap-3 px-4 py-3">
  <div className="flex-1 min-w-0">
    <p className="text-sm font-medium text-foreground">
      {label}
    </p>
    {description && (
      <p className="text-xs text-muted-foreground mt-0.5">
        {description}
      </p>
    )}
  </div>
  <div className="flex-shrink-0 mt-0.5">
    {/* Radio or checkbox indicator */}
  </div>
</div>
```

### Typography Hierarchy Within Cards

| Element | Tailwind Class | Size | Weight |
|---------|---------------|------|--------|
| Question heading | `text-lg font-semibold` | 18px | 600 |
| "Select all that apply" | `text-sm text-muted-foreground` | 14px | 400 |
| Card label (icon-prominent) | `text-base font-medium` | 16px | 500 |
| Card label (text-primary) | `text-sm font-medium` | 14px | 500 |
| Card description | `text-sm text-muted-foreground` | 14px | 400 |
| Card helper text | `text-xs text-muted-foreground` | 12px | 400 |
| "Why we ask" tooltip | `text-xs text-muted-foreground` | 12px | 400 |

---

## 5. "Not Sure" / Escape Option

### Research Findings

ScopeAI's question sets include "Not sure," "Not sure yet," "Not decided yet," and "Not sure -- open to suggestions" as options on most questions. This is a critical UX pattern for the target audience (first-time renovators who genuinely do not know the answers). The PRD explicitly states: "Always include 'Not sure' or 'Decide later' -- reduces anxiety."

The challenge is two-fold:

1. **It must not look like the default or recommended choice.** If styled identically to other options, anxious users might select it for everything, producing a low-quality scope.
2. **It must not feel like failure.** If visually diminished or isolated, users feel judged for not knowing.

### Recommendations

**Visual treatment:** Style "Not sure" cards identically to other option cards but with two subtle differences:

1. Use a **dashed border** instead of a solid border in the default state: `border-dashed` instead of `border-solid`. This creates a visual hierarchy where solid-bordered options feel "confident" and the dashed option feels "placeholder-like" without being diminished.

2. When selected, the "Not sure" card uses the **same teal selection styling** as every other card (solid border, teal fill, checkmark). This communicates: "choosing Not sure is a valid choice, and we registered it."

**Positioning:** Always place the "Not sure" option **last** in the option list. Never first, never middle. This follows the convention that escape hatches appear at the end of a set, after the user has reviewed the real options.

**Label phrasing:** Prefer "Not sure yet" over "Not sure." The word "yet" implies the user might decide later (which is true -- the scope will use a sensible default). It reduces finality.

**No separator:** Do not visually separate the "Not sure" card from other cards with a divider or extra spacing. This would stigmatise the choice. The dashed border alone is enough differentiation.

### Tailwind Classes

```
/* "Not sure" card -- default state */
"border-2 border-dashed border-border bg-card
 text-muted-foreground
 hover:border-primary/50 hover:bg-accent/5
 cursor-pointer transition-all duration-150"

/* "Not sure" card -- selected state (same as normal selected) */
"border-2 border-primary bg-primary/5
 text-foreground
 ring-1 ring-primary/20 shadow-sm"
```

Note: The default text colour is `text-muted-foreground` (grey) rather than `text-foreground` (black/white). This further deprioritises the option visually. When selected, it becomes `text-foreground` to match other selected cards.

### Implementation Detection

Detect "Not sure" options programmatically by checking if the label starts with "Not sure" or "Not decided." Do not rely on option index, as not all questions have this option.

```tsx
const isEscapeOption = (label: string): boolean => {
  const normalised = label.toLowerCase();
  return (
    normalised.startsWith("not sure") ||
    normalised.startsWith("not decided") ||
    normalised.startsWith("decide later") ||
    normalised.startsWith("standard is fine") ||
    normalised.includes("open to suggestions")
  );
};
```

---

## 6. Auto-Advance Behaviour

### Research Findings

**What auto-advance means:** When a user taps a single-select option, the wizard automatically advances to the next question after a brief delay, without requiring a separate "Next" button press.

**Typeform's approach:** Typeform auto-advances on single-select and requires explicit "Next" on multi-select. This produces completion rates of 40-60% versus 15-20% for traditional forms.

**ScopeAI context:** The wizard has 7-13 questions depending on project type. At 2-3 seconds per question with auto-advance, the entire question step would take 20-40 seconds versus 60-90 seconds with manual "Next" buttons.

### Recommendation: Use Auto-Advance for Single-Select, Require Confirm for Multi-Select

| Selection Type | Behaviour | Reasoning |
|---------------|-----------|-----------|
| Single-select | Auto-advance after 600ms delay | Reduces taps by 50%. The brief delay lets users see their selection register before moving on. |
| Multi-select | Show "Continue" button; no auto-advance | Users need time to select multiple options and review their selections. Auto-advance would cut them off. |

### Auto-Advance Implementation Details

**Delay:** 600ms after selection. This is long enough for the user to see the selection feedback animation (border change, checkmark appear, brief scale) and register that their choice was accepted, but short enough to feel snappy. Do not use delays shorter than 400ms (feels rushed, users think they mis-tapped) or longer than 1000ms (feels sluggish).

**Cancellation:** If the user taps a different option during the 600ms delay, cancel the pending advance and restart the timer. This lets users change their mind.

**Animation:** During the 600ms delay, the selected card should hold its selected state. When the advance triggers, slide the current question out to the left and the next question in from the right using Framer Motion:

```tsx
const questionVariants = {
  enter: { x: 40, opacity: 0 },
  centre: { x: 0, opacity: 1 },
  exit: { x: -40, opacity: 0 },
};

const questionTransition = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
};
```

**Progress indicator update:** The step counter or progress bar should animate during the transition, not before. This gives the user a sense of "moving forward" that is synchronised with the visual transition.

**Back navigation:** Users must be able to go back. Provide a "Back" button or left-swipe gesture. Going back should restore their previous selection (stored in state).

### "Continue" Button for Multi-Select

When the question is multi-select, show a sticky bottom button:

```
/* Continue button -- multi-select only */
"fixed bottom-0 left-0 right-0 p-4 bg-background/95
 backdrop-blur-sm border-t border-border"
```

The button label should be "Continue" (not "Next" -- "Continue" implies progress, "Next" implies sequence). The button should be disabled (`opacity-50 pointer-events-none`) until at least one option is selected.

### Auto-Advance Opt-Out

Some users may find auto-advance disorienting, particularly those with motor impairments or cognitive disabilities. However, for MVP, auto-advance is acceptable because:

1. The 600ms delay is generous.
2. Users can go back to change answers.
3. The selection feedback is unambiguous.

If user testing reveals issues, add a "Don't auto-advance" preference in a later release.

---

## 7. Keyboard and Accessibility

### Research Findings

The W3C WAI-ARIA Authoring Practices Guide (APG) defines the definitive keyboard interaction pattern for radio groups:

- **Tab:** Moves focus into the group. Focus lands on the checked item, or the first item if none are checked.
- **Arrow keys (Up/Down, Left/Right):** Move focus to adjacent items and select them. Wraps from last to first.
- **Space:** Checks the focused radio button if not already checked.
- **Shift+Tab:** Moves focus out of the group.

For checkbox groups (multi-select), the pattern differs:
- **Tab/Shift+Tab:** Moves between individual checkboxes.
- **Space:** Toggles the focused checkbox.
- Arrow keys are not expected (each checkbox is independently focusable).

### Recommendations

#### ARIA Roles and Attributes

**Single-select container:**
```tsx
<div
  role="radiogroup"
  aria-labelledby={questionId}
  aria-required="true"
>
  {options.map((option) => (
    <button
      role="radio"
      aria-checked={isSelected}
      tabIndex={isSelected || (noSelection && isFirst) ? 0 : -1}
    >
      {/* card content */}
    </button>
  ))}
</div>
```

**Multi-select container:**
```tsx
<div
  role="group"
  aria-labelledby={questionId}
  aria-describedby={`${questionId}-hint`}
>
  <p id={`${questionId}-hint`} className="sr-only">
    Select all that apply
  </p>
  {options.map((option) => (
    <button
      role="checkbox"
      aria-checked={isSelected}
      tabIndex={0}
    >
      {/* card content */}
    </button>
  ))}
</div>
```

#### Roving Tabindex (Single-Select)

Single-select groups must use roving tabindex: only the selected item (or first item if none selected) has `tabIndex={0}`. All other items have `tabIndex={-1}`. This means Tab enters the group at the selected item, and arrow keys move between items.

Multi-select groups do NOT use roving tabindex. Every checkbox is independently focusable with `tabIndex={0}`.

#### Keyboard Handler

```tsx
function handleKeyDown(
  e: React.KeyboardEvent,
  currentIndex: number,
  totalOptions: number,
  isMultiSelect: boolean
) {
  if (isMultiSelect) {
    // Multi-select: Space toggles, arrows not handled
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      toggleOption(currentIndex);
    }
    return;
  }

  // Single-select: Arrow keys navigate and select
  switch (e.key) {
    case "ArrowDown":
    case "ArrowRight": {
      e.preventDefault();
      const next = (currentIndex + 1) % totalOptions;
      selectAndFocus(next);
      break;
    }
    case "ArrowUp":
    case "ArrowLeft": {
      e.preventDefault();
      const prev =
        (currentIndex - 1 + totalOptions) % totalOptions;
      selectAndFocus(prev);
      break;
    }
    case " ":
    case "Enter": {
      e.preventDefault();
      selectOption(currentIndex);
      break;
    }
  }
}
```

#### Focus Ring Styling

The focus ring must be visible on keyboard navigation but not on mouse/touch interaction. Use `focus-visible` (not `focus`):

```
"focus-visible:outline-none focus-visible:ring-2
 focus-visible:ring-ring focus-visible:ring-offset-2
 focus-visible:ring-offset-background"
```

The `ring-ring` colour maps to teal in ScopeAI's design system. The `ring-offset-2` creates a 2px gap between the card border and the focus ring, making it visible against both light and dark backgrounds.

#### Screen Reader Announcements

When auto-advance triggers, announce the transition to screen readers:

```tsx
// After auto-advance completes
const announceTransition = (questionText: string) => {
  const liveRegion = document.getElementById("sr-announcer");
  if (liveRegion) {
    liveRegion.textContent = `Next question: ${questionText}`;
  }
};
```

Include a visually hidden live region in the page:

```tsx
<div
  id="sr-announcer"
  role="status"
  aria-live="polite"
  aria-atomic="true"
  className="sr-only"
/>
```

#### "Why We Ask" Tooltip Accessibility

The `why` field on each question should be accessible via an info button next to the question heading:

```tsx
<button
  aria-label={`Why we ask: ${question.question}`}
  className="inline-flex items-center justify-center
             w-5 h-5 rounded-full text-muted-foreground
             hover:text-foreground hover:bg-muted
             focus-visible:outline-none focus-visible:ring-2
             focus-visible:ring-ring"
>
  <Info className="w-3.5 h-3.5" />
</button>
```

---

## 8. Mobile-Specific Considerations

### Touch Target Sizes

**Apple Human Interface Guidelines:** Minimum 44x44 points.
**Google Material Design:** Minimum 48x48 dp.
**WCAG 2.5.8 (AAA):** 44x44 CSS pixels.

ScopeAI's minimum card height of 56px with full-width cards exceeds all three standards. No additional sizing adjustments are needed.

### Spacing to Prevent Mis-Taps

The 12px gap (`gap-3`) between cards provides adequate separation. With 56px minimum card height, the effective "dead zone" between touch targets is 12px, which exceeds the 8dp minimum recommended by Material Design.

### Thumb Zone Considerations

On mobile, the primary interaction zone is the bottom two-thirds of the screen ("natural thumb zone"). The wizard should:

1. Place the question text at the **top** of the viewport (read zone).
2. Place the option cards in the **middle-to-bottom** area (action zone).
3. Place navigation controls (Back, Continue) at the **very bottom** (easy thumb reach).

This layout works naturally with a single-column card stack because the cards fill the middle of the screen and the user's thumb naturally falls on them.

### Scroll Behaviour

If a question has 5+ options, the list may extend below the fold on smaller devices (iPhone SE, 375x667 viewport). Handle this with:

1. The question heading should be sticky at the top of the scroll area (but do not use `position: sticky` on the heading itself -- instead, ensure the container scrolls naturally with the heading remaining visible).
2. A subtle scroll indicator (bottom shadow/gradient) should appear when options extend below the fold.
3. The "Continue" button (multi-select) should be `fixed` at the bottom so it is always reachable.

```
/* Bottom fade indicator when content overflows */
"after:content-[''] after:absolute after:bottom-0
 after:left-0 after:right-0 after:h-8
 after:bg-gradient-to-t after:from-background
 after:to-transparent after:pointer-events-none"
```

### Haptic Feedback

On supported devices (iOS Safari, Chrome on Android with Vibration API), trigger a brief haptic tap when an option is selected. This is a progressive enhancement, not a requirement.

```tsx
const triggerHaptic = () => {
  if ("vibrate" in navigator) {
    navigator.vibrate(10); // 10ms micro-tap
  }
};
```

### No Hover States on Touch

All `hover:` classes in Tailwind are applied via `@media (hover: hover)` by default in Tailwind v4. This means hover states will not activate on touch devices. No additional work is needed -- Tailwind handles this correctly.

### Fast Tap (No 300ms Delay)

Modern mobile browsers have eliminated the 300ms tap delay when the viewport meta tag includes `width=device-width`. Next.js includes this by default. No additional work is needed.

---

## 9. Complete Component Implementation

### SelectableCard Component

This is the core reusable component used across Mode Selection, Project Type, and Smart Questions.

```tsx
// components/create/SelectableCard.tsx

"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface SelectableCardProps {
  label: string;
  description?: string;
  icon?: React.ReactNode;
  isSelected: boolean;
  isMultiSelect: boolean;
  isEscapeOption?: boolean;
  disabled?: boolean;
  onSelect: () => void;
  // a11y
  role: "radio" | "checkbox";
  tabIndex: number;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}

const springConfig = {
  type: "spring" as const,
  stiffness: 500,
  damping: 30,
  mass: 0.8,
};

export function SelectableCard({
  label,
  description,
  icon,
  isSelected,
  isMultiSelect,
  isEscapeOption = false,
  disabled = false,
  onSelect,
  role,
  tabIndex,
  onKeyDown,
}: SelectableCardProps) {
  const triggerHaptic = () => {
    if ("vibrate" in navigator) {
      navigator.vibrate(10);
    }
  };

  return (
    <motion.button
      type="button"
      role={role}
      aria-checked={isSelected}
      tabIndex={tabIndex}
      disabled={disabled}
      onClick={() => {
        if (!disabled) {
          triggerHaptic();
          onSelect();
        }
      }}
      onKeyDown={onKeyDown}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      transition={springConfig}
      className={cn(
        // Base styles
        "relative w-full rounded-lg text-left",
        "transition-all duration-150",
        "focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-ring focus-visible:ring-offset-2",
        "focus-visible:ring-offset-background",

        // Default state
        !isSelected && [
          "border-2 bg-card text-card-foreground cursor-pointer",
          isEscapeOption
            ? "border-dashed border-border"
            : "border-transparent",
          // Hover (desktop only)
          "hover:border-primary/50 hover:bg-accent/5",
        ],

        // Selected state
        isSelected && [
          "border-2 border-primary bg-primary/5",
          "ring-1 ring-primary/20 shadow-sm",
        ],

        // Disabled state
        disabled && "opacity-50 cursor-not-allowed pointer-events-none"
      )}
    >
      <div
        className={cn(
          "flex items-center gap-3",
          icon ? "items-start px-4 py-4" : "px-4 py-3"
        )}
      >
        {/* Optional icon */}
        {icon && (
          <div className="flex-shrink-0 mt-0.5">{icon}</div>
        )}

        {/* Text content */}
        <div className="flex-1 min-w-0">
          <p
            className={cn(
              "font-medium",
              icon ? "text-base" : "text-sm",
              isEscapeOption && !isSelected
                ? "text-muted-foreground"
                : "text-foreground"
            )}
          >
            {label}
          </p>
          {description && (
            <p
              className={cn(
                "mt-0.5",
                icon
                  ? "text-sm text-muted-foreground"
                  : "text-xs text-muted-foreground"
              )}
            >
              {description}
            </p>
          )}
        </div>

        {/* Selection indicator */}
        <div className="flex-shrink-0">
          {isMultiSelect ? (
            <CheckboxIndicator checked={isSelected} />
          ) : (
            <RadioIndicator checked={isSelected} />
          )}
        </div>
      </div>
    </motion.button>
  );
}

function RadioIndicator({ checked }: { checked: boolean }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center w-5 h-5 rounded-full",
        "border-2 transition-colors duration-150",
        checked
          ? "border-primary bg-primary"
          : "border-muted-foreground/30"
      )}
    >
      {checked && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
          }}
          className="w-2 h-2 rounded-full bg-primary-foreground"
        />
      )}
    </div>
  );
}

function CheckboxIndicator({ checked }: { checked: boolean }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center w-5 h-5 rounded-sm",
        "border-2 transition-colors duration-150",
        checked
          ? "border-primary bg-primary"
          : "border-muted-foreground/30"
      )}
    >
      {checked && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
          }}
        >
          <Check className="w-3.5 h-3.5 text-primary-foreground" />
        </motion.div>
      )}
    </div>
  );
}
```

### QuestionCard Container Component

This wraps `SelectableCard` with the question heading, "Why we ask" tooltip, multi-select label, and auto-advance logic.

```tsx
// components/create/QuestionCard.tsx

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { SelectableCard } from "./SelectableCard";
import type { Question, QuestionOption } from "@/types";

const AUTO_ADVANCE_DELAY = 600; // ms

const isEscapeOption = (label: string): boolean => {
  const normalised = label.toLowerCase();
  return (
    normalised.startsWith("not sure") ||
    normalised.startsWith("not decided") ||
    normalised.startsWith("decide later") ||
    normalised.startsWith("standard is fine") ||
    normalised.includes("open to suggestions")
  );
};

interface QuestionCardProps {
  question: Question;
  value: string | string[] | undefined;
  onAnswer: (value: string | string[]) => void;
  onAdvance: () => void;
  direction: number; // 1 = forward, -1 = backward
}

const questionVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 40 : -40,
    opacity: 0,
  }),
  centre: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -40 : 40,
    opacity: 0,
  }),
};

const questionTransition = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
};

export function QuestionCard({
  question,
  value,
  onAnswer,
  onAdvance,
  direction,
}: QuestionCardProps) {
  const [showWhy, setShowWhy] = useState(false);
  const autoAdvanceTimer = useRef<ReturnType<typeof setTimeout>>();
  const focusedIndex = useRef(0);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Determine current selection state
  const selectedValues: string[] = Array.isArray(value)
    ? value
    : value
      ? [value]
      : [];

  const isOptionSelected = (label: string) =>
    selectedValues.includes(label);

  // Single-select handler with auto-advance
  const handleSingleSelect = useCallback(
    (label: string) => {
      // Cancel any pending auto-advance
      if (autoAdvanceTimer.current) {
        clearTimeout(autoAdvanceTimer.current);
      }

      onAnswer(label);

      // Schedule auto-advance
      autoAdvanceTimer.current = setTimeout(() => {
        onAdvance();
      }, AUTO_ADVANCE_DELAY);
    },
    [onAnswer, onAdvance]
  );

  // Multi-select handler (no auto-advance)
  const handleMultiSelect = useCallback(
    (label: string) => {
      const current = Array.isArray(value) ? value : [];
      const updated = current.includes(label)
        ? current.filter((v) => v !== label)
        : [...current, label];
      onAnswer(updated);
    },
    [value, onAnswer]
  );

  // Cleanup auto-advance timer on unmount
  useEffect(() => {
    return () => {
      if (autoAdvanceTimer.current) {
        clearTimeout(autoAdvanceTimer.current);
      }
    };
  }, []);

  // Keyboard navigation for single-select (roving tabindex)
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      const total = question.options.length;

      if (!question.multiSelect) {
        switch (e.key) {
          case "ArrowDown":
          case "ArrowRight": {
            e.preventDefault();
            const next = (index + 1) % total;
            focusedIndex.current = next;
            optionRefs.current[next]?.focus();
            handleSingleSelect(question.options[next].label);
            break;
          }
          case "ArrowUp":
          case "ArrowLeft": {
            e.preventDefault();
            const prev = (index - 1 + total) % total;
            focusedIndex.current = prev;
            optionRefs.current[prev]?.focus();
            handleSingleSelect(question.options[prev].label);
            break;
          }
          case " ":
          case "Enter": {
            e.preventDefault();
            handleSingleSelect(question.options[index].label);
            break;
          }
        }
      } else {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          handleMultiSelect(question.options[index].label);
        }
      }
    },
    [question, handleSingleSelect, handleMultiSelect]
  );

  // Determine tabIndex for roving tabindex (single-select)
  const getTabIndex = (index: number): number => {
    if (question.multiSelect) return 0;

    const selectedIndex = question.options.findIndex((o) =>
      isOptionSelected(o.label)
    );
    if (selectedIndex >= 0) {
      return index === selectedIndex ? 0 : -1;
    }
    return index === 0 ? 0 : -1;
  };

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={question.id}
        custom={direction}
        variants={questionVariants}
        initial="enter"
        animate="centre"
        exit="exit"
        transition={questionTransition}
        className="w-full"
      >
        {/* Question heading */}
        <div className="mb-4">
          <div className="flex items-start gap-2">
            <h2
              id={question.id}
              className="text-lg font-semibold text-foreground"
            >
              {question.question}
            </h2>
            {question.why && (
              <button
                type="button"
                onClick={() => setShowWhy(!showWhy)}
                aria-label={`Why we ask: ${question.question}`}
                aria-expanded={showWhy}
                className={cn(
                  "inline-flex items-center justify-center",
                  "w-5 h-5 mt-0.5 rounded-full flex-shrink-0",
                  "text-muted-foreground",
                  "hover:text-foreground hover:bg-muted",
                  "focus-visible:outline-none focus-visible:ring-2",
                  "focus-visible:ring-ring",
                  "transition-colors duration-150"
                )}
              >
                <Info className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* "Why we ask" expanded content */}
          <AnimatePresence>
            {showWhy && question.why && (
              <motion.p
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="text-sm text-muted-foreground mt-2
                           overflow-hidden"
              >
                {question.why}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Multi-select hint */}
          {question.multiSelect && (
            <p
              id={`${question.id}-hint`}
              className="text-sm text-muted-foreground mt-1"
            >
              Select all that apply
            </p>
          )}
        </div>

        {/* Option cards */}
        <div
          role={question.multiSelect ? "group" : "radiogroup"}
          aria-labelledby={question.id}
          aria-describedby={
            question.multiSelect
              ? `${question.id}-hint`
              : undefined
          }
          className="flex flex-col gap-3"
        >
          {question.options.map(
            (option: QuestionOption, index: number) => (
              <SelectableCard
                key={option.label}
                ref={(el) => {
                  optionRefs.current[index] = el;
                }}
                label={option.label}
                description={option.description}
                isSelected={isOptionSelected(option.label)}
                isMultiSelect={question.multiSelect}
                isEscapeOption={isEscapeOption(option.label)}
                onSelect={() =>
                  question.multiSelect
                    ? handleMultiSelect(option.label)
                    : handleSingleSelect(option.label)
                }
                role={
                  question.multiSelect ? "checkbox" : "radio"
                }
                tabIndex={getTabIndex(index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            )
          )}
        </div>

        {/* Continue button for multi-select */}
        {question.multiSelect && (
          <div
            className="fixed bottom-0 left-0 right-0 p-4
                        bg-background/95 backdrop-blur-sm
                        border-t border-border z-10"
          >
            <button
              type="button"
              onClick={onAdvance}
              disabled={selectedValues.length === 0}
              className={cn(
                "w-full py-3 rounded-md font-medium text-sm",
                "transition-colors duration-150",
                "focus-visible:outline-none focus-visible:ring-2",
                "focus-visible:ring-ring focus-visible:ring-offset-2",
                selectedValues.length > 0
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
            >
              Continue
            </button>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
```

**Note on forwardRef:** The `SelectableCard` component above needs to accept a `ref` to support the roving tabindex pattern. In production, wrap it with `React.forwardRef` or use the React 19 ref-as-prop pattern. The ref is passed to the inner `motion.button` element.

---

## 10. Card State Reference Table

Quick reference for all card visual states with exact Tailwind classes.

### Single Source of Truth: Card State Classes

| State | Border | Background | Text | Shadow/Ring | Cursor | Extra |
|-------|--------|------------|------|-------------|--------|-------|
| **Default** | `border-2 border-transparent` | `bg-card` | `text-card-foreground` | none | `cursor-pointer` | -- |
| **Default (escape)** | `border-2 border-dashed border-border` | `bg-card` | `text-muted-foreground` | none | `cursor-pointer` | dashed border |
| **Hover** | `border-primary/50` | `bg-accent/5` | unchanged | none | `cursor-pointer` | desktop only |
| **Focus-visible** | unchanged | unchanged | unchanged | `ring-2 ring-ring ring-offset-2` | -- | keyboard only |
| **Selected** | `border-2 border-primary` | `bg-primary/5` | `text-foreground` | `ring-1 ring-primary/20 shadow-sm` | `cursor-pointer` | checkmark visible |
| **Disabled** | unchanged | unchanged | unchanged | none | `cursor-not-allowed` | `opacity-50 pointer-events-none` |

### Dark Mode Behaviour

All classes above use CSS custom properties (`--primary`, `--background`, etc.) which are redefined in `.dark`. The teal accent (`#14B8A6`) stays constant across light and dark mode. Borders, backgrounds, and text colours invert automatically. No additional dark mode classes are needed on the card component.

### Animation Summary

| Trigger | Property | Value | Duration | Easing |
|---------|----------|-------|----------|--------|
| Tap / press | scale | 0.98 | spring (500/30) | spring |
| Selection | checkmark appear | scale 0 to 1 | spring (500/30) | spring |
| Question transition | x position | +/-40px to 0 | spring (300/30) | spring |
| Question transition | opacity | 0 to 1 | spring (300/30) | spring |
| Border/bg change | colour | -- | 150ms | ease (CSS) |
| "Why we ask" expand | height | 0 to auto | 200ms | ease (CSS) |

---

## Appendix A: Checklist for Implementation

Use this checklist when building the `SelectableCard` and `QuestionCard` components:

- [ ] Cards use `border-2 border-transparent` in default state (prevents layout shift on selection)
- [ ] Selected cards show teal border + teal background wash + checkmark indicator
- [ ] Single-select cards show radio circle indicator (top-right)
- [ ] Multi-select cards show checkbox square indicator (top-right)
- [ ] Multi-select questions display "Select all that apply" subtext
- [ ] "Not sure" options use dashed border + muted text colour in default state
- [ ] "Not sure" options use identical teal selection styling when selected
- [ ] "Not sure" options are always last in the option list
- [ ] Single-select auto-advances after 600ms delay
- [ ] Multi-select shows fixed-bottom "Continue" button
- [ ] "Continue" button is disabled until at least one option is selected
- [ ] Keyboard: Tab enters group at selected/first item
- [ ] Keyboard: Arrow keys navigate + select in single-select groups
- [ ] Keyboard: Space/Enter toggle in multi-select groups
- [ ] Focus ring uses `focus-visible` (not `focus`)
- [ ] Focus ring colour is teal (via `ring-ring`)
- [ ] ARIA: `role="radiogroup"` on single-select container
- [ ] ARIA: `role="radio"` + `aria-checked` on single-select cards
- [ ] ARIA: `role="group"` on multi-select container
- [ ] ARIA: `role="checkbox"` + `aria-checked` on multi-select cards
- [ ] Screen reader live region announces question transitions
- [ ] `whileTap={{ scale: 0.98 }}` on all cards via Framer Motion
- [ ] Minimum card height: 56px
- [ ] Card gap: 12px (`gap-3`)
- [ ] Touch targets exceed 44px minimum
- [ ] Haptic feedback on selection (progressive enhancement)
- [ ] Question slide animation: x +/-40px with spring easing
- [ ] All colours use CSS custom properties (automatic dark mode)

---

## Appendix B: Research Sources

- [Salt Design System: Selectable Card](https://www.saltdesignsystem.com/salt/patterns/selectable-card) -- Pattern definition, single vs multi-select, layout guidance
- [W3C WAI-ARIA APG: Radio Group Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/radio/) -- Definitive keyboard interaction specification
- [shadcn/ui: Radio Group](https://ui.shadcn.com/docs/components/radio-group) -- Component API and Tailwind integration
- [shadcn/ui: Toggle Group](https://ui.shadcn.com/docs/components/radix/toggle-group) -- Multi-state toggle patterns
- [Framer Motion: Transitions](https://www.framer.com/motion/transition/) -- Spring configuration parameters
- [Framer Motion: Component API](https://www.framer.com/motion/component/) -- whileTap, variants, AnimatePresence
- [Material Design: Selection](https://m2.material.io/design/interaction/selection.html) -- Single vs multi-select control patterns
- [MDN: ARIA radio role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/radio_role) -- ARIA implementation reference
- [UX Collective: 8 Best Practices for Card Design](https://uxdesign.cc/8-best-practices-for-ui-card-design-898f45bb60cc) -- General card design principles
- [NN/g: Listboxes vs Dropdown Lists](https://www.nngroup.com/articles/listbox-dropdown/) -- Selection control comparison
- [Eleken: Wizard UI Pattern](https://www.eleken.co/blog-posts/wizard-ui-pattern-explained) -- Wizard design best practices
- [UXmatters: Wizards Versus Forms](https://www.uxmatters.com/mt/archives/2011/09/wizards-versus-forms.php) -- When to use wizard patterns
- [Apple HIG: Touch Targets](https://developer.apple.com/design/human-interface-guidelines/) -- 44pt minimum
- [Google Material Design: Touch Targets](https://m2.material.io/design/usability/accessibility.html) -- 48dp minimum

---

*This research document provides implementation-ready specifications. All Tailwind classes, ARIA attributes, and component structures are designed to work with ScopeAI's existing design system (teal primary, Geist font, shadcn/ui, Tailwind v4, Framer Motion).*
