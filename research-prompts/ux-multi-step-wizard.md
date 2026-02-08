# UX Research Brief: Multi-Step Wizard Patterns

## Context

We're building ScopeAI — an AI-powered renovation scope generator. The core user flow is a multi-step wizard where Australian homeowners:

1. Choose a mode (2 options — tap to select)
2. Set up their project (select project type + enter property details)
3. Upload 3-10 photos of their space
4. Answer 8-13 tap-to-answer questions about their renovation plans
5. Sign up / log in (auth gate)
6. Wait for AI generation (~30-60 seconds)
7. See a scope preview (paywall)

**Total steps: 7** (steps 3-4 are the longest — photos take effort, questions take 2-3 minutes)

**Target user:** Non-technical homeowner, likely on mobile (60%+), potentially anxious about renovation costs. Has never used a tool like this before. They found us via Google search.

**Tech stack:** Next.js + shadcn/ui + Tailwind CSS v4 + Framer Motion (if needed)

**Goal of this research:** Produce concrete, implementable patterns for making this wizard feel fast, effortless, and premium — not like a government form.

---

## Section 1: Best-in-Class Wizard Examples

Research and analyse the UX patterns of these multi-step flows:

- **Typeform** — How they make long forms feel conversational. Step pacing, animation between questions, progress indication.
- **Linear onboarding** — Minimal, fast-feeling wizard. How they handle multiple steps without feeling heavy.
- **Stripe onboarding / Stripe Checkout** — Trust-building through clean design. Form validation patterns.
- **Vercel's v0.dev** — How they handle AI input + generation flows.
- **Airbnb listing creation** — Photo upload + multi-step with save/resume.
- **TurboTax / online tax software** — Long wizard (many steps) that doesn't feel overwhelming. Guided questions.
- **Canva template selection** — Visual card selection patterns.

For each, document:
1. How they indicate progress (bar, steps, fraction, nothing?)
2. How they transition between steps (slide, fade, instant?)
3. How they handle "back" navigation
4. How they keep momentum (what makes you want to keep going?)
5. How they handle the longest/hardest step
6. Any micro-interactions that add polish

**Output file:** `RESEARCH-wizard-examples.md`

---

## Section 2: Progress Indication Patterns

Research the psychology and best practices for progress indicators in multi-step flows:

1. **Progress bar vs step dots vs fraction (3/7) vs nothing** — When is each appropriate? What drives completion?
2. **The "progress illusion"** — Techniques to make progress feel faster (e.g., weighted progress where early steps count more)
3. **Grouped vs flat steps** — Is it better to show "Step 2 of 7" or group into phases like "Project Details" → "Your Space" → "Your Plans"?
4. **Should the number of remaining steps be visible?** — Research on whether showing "5 more steps" helps or hurts completion
5. **Smart progress** — Showing progress within a step (e.g., "Question 3 of 12" inside the questions step)
6. **Mobile considerations** — How progress indicators should adapt for small screens

**Key question to answer:** For a 7-step wizard where step 4 (questions) has 8-13 sub-steps, what's the optimal progress pattern?

**Output file:** `RESEARCH-wizard-progress.md`

---

## Section 3: Step Transitions & Animation

Research animation patterns that make step transitions feel premium and fast:

1. **Slide vs fade vs morph** — Which transition type feels fastest? Most premium? Evidence from UX studies.
2. **Direction of animation** — Left-to-right for forward, right-to-left for back? Or something else?
3. **Duration sweet spots** — What's the optimal transition duration in ms? Too fast feels jarring, too slow feels sluggish.
4. **Content loading** — How to handle steps where content needs to load (e.g., loading question set). Skeleton vs spinner vs instant.
5. **Framer Motion patterns** — Specific Framer Motion (or CSS) code patterns for:
   - Page/step transitions (AnimatePresence + variants)
   - Card selection animations (scale on tap, border highlight)
   - Progress bar animation (smooth fill)
   - Stagger animations for option lists
6. **Reduced motion** — How to respect `prefers-reduced-motion` while keeping the flow feeling good
7. **Mobile touch feedback** — How to make tap-to-select cards feel responsive (haptic, scale, color change timing)

**Provide specific implementation recommendations:** transition durations, easing functions, Framer Motion variant objects.

**Output file:** `RESEARCH-wizard-animations.md`

---

## Section 4: Tap-to-Select Card Patterns

Our wizard uses "tap to select" cards heavily — mode selection, project type, question options. Research the best patterns:

1. **Card sizing and layout** — How big should selectable cards be? Grid vs list? 2-column vs 3-column?
2. **Selection feedback** — What happens visually when you tap a card? Border change? Background fill? Checkmark? Scale? Combination?
3. **Single-select vs multi-select visual difference** — How to make it obvious which questions allow multiple selections
4. **Icon + text layout within cards** — Icon size, text hierarchy, description text
5. **"Not sure" / escape option** — How to present the "Not sure" option so it doesn't feel like failure but also doesn't look like the default choice
6. **Auto-advance** — Should selecting a single-select option automatically advance to the next question? (Typeform does this). Pros/cons.
7. **Keyboard/accessibility** — Tab navigation, space to select, arrow keys between options
8. **Mobile-specific** — Touch target sizes (44px minimum), spacing between cards to prevent mis-taps

**Provide specific CSS/Tailwind patterns** for card states: default, hover, focus, selected, disabled.

**Output file:** `RESEARCH-wizard-cards.md`

---

## Section 5: Photo Upload UX

The photo upload step is critical — it's the most effort-intensive step and the primary AI input.

1. **Drag-and-drop patterns** — How do the best upload UIs work? Dropzone styling, hover states, file landing animation.
2. **Mobile camera capture** — How to trigger native camera vs gallery picker. `capture="environment"` attribute behaviour across iOS/Android.
3. **Upload progress** — Per-file progress bars vs overall progress. Where to show progress relative to thumbnails.
4. **Thumbnail preview layout** — Grid layout for 3-10 photos. How to handle different aspect ratios. Remove button placement.
5. **Reordering** — Is drag-to-reorder valuable? Or unnecessary complexity?
6. **Error handling** — How to show "file too large", "wrong format", "upload failed" inline without disrupting the flow.
7. **Guidance/coaching** — How to tell users what photos to take without being preachy. Example: Airbnb's photo tips.
8. **Empty state → populated state** — Transition from "drop photos here" to showing uploaded thumbnails.
9. **Minimum count enforcement** — How to show "3 photos required, you have 1" without feeling like an error.

**Key question to answer:** What's the best photo upload pattern for mobile-first users who are taking photos of their kitchen right now?

**Output file:** `RESEARCH-wizard-photo-upload.md`

---

## Section 6: Question Flow Pacing

Our question step has 8-13 questions depending on project type. Each question has 3-5 options plus optional tooltips. Research:

1. **One question per screen vs scrollable list** — Which drives higher completion? Which feels faster? Evidence from form UX research.
2. **Question grouping** — Should we group questions into categories (e.g., "Cooking", "Lighting", "Quality") with section headers? Or flat sequence?
3. **Pacing tricks** — How Typeform makes 20 questions feel like 5. What psychological techniques can we apply?
4. **Tooltip patterns** — Our questions have "why are we asking this?" tooltips. Best patterns: inline expand, hover popover, info icon + modal, always visible?
5. **Skip vs "Not sure"** — Is "skip" a button or is "Not sure" an option within the question? UX implications of each.
6. **Review/summary** — Should there be a summary screen at the end of questions showing all answers? Or is that unnecessary friction?
7. **Conversational tone** — How to make questions feel like a conversation, not an interrogation. Tone, phrasing, personality.
8. **Back navigation within questions** — How to let users change a previous answer. Back button? Clickable progress? Scroll up?

**Key question to answer:** For 8-13 tap-to-answer questions, what format drives the highest completion with the least fatigue?

**Output file:** `RESEARCH-wizard-question-flow.md`

---

## Section 7: Wizard State & Recovery

Research patterns for handling wizard state, interruptions, and recovery:

1. **Save and resume** — Should progress be saved automatically? What granularity? Per-step or per-field?
2. **Browser back button** — How should the wizard handle the browser back button? Navigate to previous step? Leave wizard?
3. **URL state** — Should each step have its own URL (`/create?step=3`) or is it all client-side state? SEO implications, deep-linking.
4. **Accidental navigation** — How to handle "are you sure you want to leave?" without being annoying. When is this appropriate?
5. **Session timeout** — If user leaves and comes back 2 hours later, what should they see?
6. **Mobile interruptions** — Phone call mid-upload, app switch, low battery warning. How to handle gracefully.

**Output file:** `RESEARCH-wizard-state.md`

---

## Section 8: Implementation Recommendations

Based on all the above research, provide a concrete implementation spec:

1. **Recommended wizard structure** — Flat steps or grouped phases? Exact step flow.
2. **Progress indicator spec** — Exact type (bar, dots, fraction, grouped), position (top, fixed), styling.
3. **Transition spec** — Exact animation type, duration (ms), easing function, Framer Motion config.
4. **Card component spec** — Exact states, colours (using teal primary), border radius, shadow, sizes.
5. **Question flow spec** — One-per-screen or scrollable? Auto-advance? Grouping?
6. **Photo upload spec** — Layout, mobile behaviour, progress display.
7. **Key micro-interactions** — The 5-10 small touches that make the wizard feel premium.

**Format this as a developer-ready specification** with Tailwind class examples and Framer Motion config objects.

**Output file:** `RESEARCH-wizard-implementation-spec.md`

---

## Save Instructions

Save all research output files to:
```
C:\Users\jayso\scope-ai\research-output\ux-wizard\
```

File naming convention:
```
RESEARCH-wizard-examples.md
RESEARCH-wizard-progress.md
RESEARCH-wizard-animations.md
RESEARCH-wizard-cards.md
RESEARCH-wizard-photo-upload.md
RESEARCH-wizard-question-flow.md
RESEARCH-wizard-state.md
RESEARCH-wizard-implementation-spec.md
```

Each file should be comprehensive, evidence-based where possible, and include concrete implementation recommendations — not abstract UX theory. The output will be used directly by an AI developer building the wizard in Next.js + shadcn/ui + Tailwind CSS + Framer Motion.
