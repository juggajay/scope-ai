# Research: Best-in-Class Wizard UX Examples

**For:** ScopeAI Multi-Step Scope Creation Wizard
**Date:** February 2026
**Purpose:** Evidence-based analysis of 7 best-in-class wizard/multi-step flows, with concrete implementation recommendations for a Next.js + shadcn/ui + Framer Motion build.

---

## Table of Contents

1. [Typeform](#1-typeform)
2. [Linear Onboarding](#2-linear-onboarding)
3. [Stripe Checkout / Stripe Onboarding](#3-stripe-checkout--stripe-onboarding)
4. [Vercel v0.dev](#4-vercel-v0dev)
5. [Airbnb Listing Creation](#5-airbnb-listing-creation)
6. [TurboTax](#6-turbotax)
7. [Canva Template Selection](#7-canva-template-selection)
8. [Cross-Cutting Patterns & Synthesis](#8-cross-cutting-patterns--synthesis)
9. [Implementation Recommendations for ScopeAI](#9-implementation-recommendations-for-scopeai)

---

## 1. Typeform

**What it is:** Conversational form builder. The gold standard for making long forms feel short.

### 1.1 Progress Indication

- **Thin progress bar** at the very top of the viewport. Fills left-to-right as a percentage of questions answered. No step numbers, no fractions visible by default.
- The bar uses the form's brand accent colour (customisable), so it feels native to the experience rather than a system overlay.
- No step counter is shown (e.g. no "3 of 12"). This is deliberate: showing a fraction like "3 of 12" signals "you have 9 more to go," which creates dread. Typeform's thin bar gives a sense of progress without quantifying remaining effort.
- **Implication for ScopeAI:** For the questions step (Step 4), consider a thin progress bar rather than "Question 5 of 12." For the overall wizard (Steps 1-7), a segmented bar or step indicator is appropriate because the segments are qualitatively different (photos vs questions vs generation), but within the questions sub-step, Typeform's approach is better.

### 1.2 Step Transitions

- **Full-screen vertical slide.** Each question occupies 100% of the viewport. When answered, the current question slides up and out while the next question slides up from below. The animation takes approximately 400-500ms.
- The transition is eased with a deceleration curve (ease-out), so it feels like natural physical momentum -- fast start, gentle stop.
- On desktop, questions auto-advance when a single-select option is tapped. No "Next" button needed for single-select. Multi-select and text inputs show a "Next" button (or respond to Enter key).
- On mobile, the same vertical slide pattern applies. The auto-advance on single-select is particularly effective on mobile because it eliminates a tap.
- **Framer Motion implementation:**
  ```tsx
  // Direction-aware slide with AnimatePresence
  <AnimatePresence mode="wait" custom={direction}>
    <motion.div
      key={currentQuestion}
      custom={direction}
      initial={{ y: direction > 0 ? 100 : -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: direction > 0 ? -100 : 100, opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* Question content */}
    </motion.div>
  </AnimatePresence>
  ```

### 1.3 Back Navigation

- **Up arrow button** fixed in the bottom-right corner (alongside the down arrow / "Next" button). Clicking it reverses the slide animation -- current question slides down, previous question slides down into view from above.
- The back button is always visible but subtly styled (outline, not filled). It does not compete with the primary "Next" action.
- Keyboard shortcut: Up arrow key navigates back, Down arrow or Enter advances.
- Previous answers are preserved. Returning to a question shows it pre-filled.
- **Implication for ScopeAI:** Within the questions step, provide a back arrow. For the overall wizard, a "Back" text button in the header or footer is more appropriate than an arrow.

### 1.4 Momentum & Motivation

- **One question per screen** is the core mechanism. It eliminates visual overwhelm. Users never see a wall of form fields. Each screen feels achievable -- "I just need to answer this one thing."
- **Auto-advance on single-select** removes friction. Tap an option and you immediately move forward. No cognitive pause to find a "Next" button.
- **Welcome screen** with a friendly message and clear "Start" button. Sets expectations without showing the full scope of questions.
- **Closing screen** with a thank-you message. Provides closure.
- **Keyboard-friendly:** Enter to advance, arrow keys for navigation, letter keys to select options (A, B, C, D). Power users can fly through.

### 1.5 Handling the Longest/Hardest Step

- Typeform handles long forms by making them not feel long. The core technique is one-question-per-screen.
- For complex questions (multi-select, text input, file upload), Typeform gives them their own full screen with extra helper text, placeholder examples, and sometimes images or videos.
- **Logic jumps** skip irrelevant questions. If a user answers "No" to question 3, questions 4-6 (which depend on "Yes") are skipped entirely. The progress bar jumps forward, which feels rewarding.
- This is directly applicable to ScopeAI: if the user selects "No island bench," skip the island-related follow-up questions.

### 1.6 Micro-Interactions

- **Option hover/focus:** Options highlight with a subtle background colour change and left border accent on hover. On mobile, tap states use the same highlight.
- **Checkmark animation:** When an option is selected, a small checkmark icon animates in (scale from 0 to 1 with slight overshoot/bounce).
- **Text input focus:** The input field has a bottom-border that transitions from grey to the brand accent colour on focus.
- **Loading indicator:** For file uploads, a circular progress spinner appears within the upload zone.
- **Error shake:** If validation fails (e.g. required field skipped), the question container does a brief horizontal shake animation (2-3 oscillations over 300ms).
- **Sound effects (optional, off by default):** Typeform offers subtle click/transition sounds.

### 1.7 Key Takeaways for ScopeAI

| Pattern | Apply to ScopeAI? | Where |
|---------|--------------------|-------|
| One-question-per-screen | Yes | Step 4 (Smart Questions) |
| Auto-advance on single-select | Yes | Step 4 |
| Full-screen vertical slide | Yes | Step 4 transitions |
| Thin progress bar (no fractions) | Yes | Step 4 sub-progress |
| Logic jumps | Yes | Skip irrelevant questions |
| Error shake animation | Yes | All form validation |
| Keyboard navigation | Yes, but secondary | Desktop enhancement |

---

## 2. Linear Onboarding

**What it is:** Project management tool for software teams. Known for craft, speed, and opinionated design.

### 2.1 Progress Indication

- **No visible progress bar.** No step numbers. No fractions. Nothing tells you "you are on step 3 of 6."
- Instead, Linear uses a **sequential reveal** approach. Each step flows naturally into the next with calm, minimal copy. Users don't know how many steps remain, and they don't care because each step is fast.
- The absence of a progress indicator is a deliberate design choice. Linear's onboarding has approximately 5-6 steps, each taking 5-15 seconds. Total time: under 2 minutes. When the total time is this short, a progress indicator adds unnecessary UI complexity.
- **Implication for ScopeAI:** This approach would NOT work for ScopeAI. The wizard has 7 major steps spanning 5-10 minutes. Users need orientation. However, Linear's lesson is that for very quick sub-steps (like mode selection or project type), progress indication within the sub-step is unnecessary.

### 2.2 Step Transitions

- **Clean crossfade** with minimal duration (approximately 200-300ms). Content fades out, new content fades in. No sliding, no bouncing, no dramatic effects.
- The transitions are fast enough to feel instant but smooth enough to avoid jarring cuts. This communicates speed and efficiency.
- Linear avoids any transition that draws attention to itself. The philosophy: transitions should be invisible infrastructure, not a feature.
- **Framer Motion implementation:**
  ```tsx
  <AnimatePresence mode="wait">
    <motion.div
      key={step}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Step content */}
    </motion.div>
  </AnimatePresence>
  ```

### 2.3 Back Navigation

- **Not explicitly provided** in the standard flow. The onboarding is designed so forward-only feels natural. Each step is a small commitment (select theme, try a shortcut, name workspace) that doesn't warrant second-guessing.
- If a user needs to change something, they do it in settings after onboarding completes.
- **Implication for ScopeAI:** This approach does NOT work for ScopeAI. Users uploading photos and answering questions absolutely need back navigation. However, Linear's lesson applies to the generation step (Step 6): once generation starts, there is no "back" -- only "cancel" or "wait."

### 2.4 Momentum & Motivation

- **Immediate interaction on step 1:** Instead of asking "What's your name?", Linear asks "Do you prefer dark or light mode?" This is fun, low-stakes, and instantly makes the user feel ownership. It communicates: "we care about your preferences."
- **Keyboard shortcut tutorial:** Step 2 asks you to press Cmd+K. A visual keyboard-key component shows the exact keys. When you press them, you get a congratulations message. This is teaching-by-doing, not teaching-by-reading.
- **Short, confident copy:** Linear uses phrases like "You're good to go. Go ahead and explore the app." No exclamation marks, no confetti, no excessive enthusiasm. The tone is calm confidence.
- **Speed is the feature:** The entire onboarding takes under 2 minutes. The fastest way to build momentum is to finish quickly.

### 2.5 Handling the Longest/Hardest Step

- Linear's hardest onboarding step is workspace configuration (team creation, member invites). They handle this by making it **skippable.** You can explore the app immediately and set up your team later.
- The invite step uses frictionless domain-matching: if your email is @company.com, other @company.com users are auto-suggested.
- **Implication for ScopeAI:** The auth gate (Step 5) is ScopeAI's hardest step because it interrupts flow. Linear's lesson: make hard steps feel optional or fast. For auth, this means offering Google OAuth (one click) prominently alongside email/password.

### 2.6 Micro-Interactions

- **Keyboard key visuals:** Rendered as stylised key-cap components that look like physical keyboard keys. Tactile, familiar, delightful.
- **Theme toggle:** The dark/light mode switch has an immediate, full-screen colour transition. The entire interface shifts in real-time, which is satisfying.
- **Minimalist hover states:** Buttons and links change opacity (0.6-0.8) on hover rather than changing background colour. Subtle and fast.
- **No confetti, no celebrations:** This is a conscious anti-pattern choice. Linear trusts that the product's quality speaks for itself.

### 2.7 Key Takeaways for ScopeAI

| Pattern | Apply to ScopeAI? | Where |
|---------|--------------------|-------|
| No progress bar for very short steps | Partially | Mode selection step can skip progress sub-indicator |
| Fast crossfade transitions | Yes | Between major wizard steps |
| Calm, confident copy | Yes | All wizard copy |
| Fun, low-stakes first interaction | Yes | Mode selection should feel casual and quick |
| Skip-ability for hard steps | Partially | "Not sure" options on questions |
| Dark/light immediate toggle | No | Not relevant to wizard flow |

---

## 3. Stripe Checkout / Stripe Onboarding

**What it is:** Payment processing. Known for obsessive attention to design detail that builds trust and reduces abandonment.

### 3.1 Progress Indication

- **Stripe Checkout (hosted page):** No visible progress indicator because the entire flow is a single page/screen. The form is compact enough that scrolling is minimal. The single-page approach eliminates the need for step tracking.
- **Stripe Connect Onboarding (multi-step):** Uses a numbered step indicator at the top. Steps are labelled with descriptive names ("Business details", "Bank account", "Review"). Current step is highlighted with the brand colour. Completed steps show a checkmark.
- The numbered step indicator uses a horizontal layout with connecting lines between steps. Each step node is a circle (number or checkmark) with a label below.
- **Implication for ScopeAI:** Stripe's hosted checkout proves that single-screen simplicity builds trust. For ScopeAI, the paywall/preview step (Step 7) should aim to be a single screen -- no sub-steps within payment. Stripe Connect's numbered steps with labels are a good model for ScopeAI's overall wizard navigation.

### 3.2 Step Transitions

- **Stripe Checkout:** No transitions because it's a single page. Validation errors animate in-place with a subtle fade and slide-down.
- **Stripe Connect Onboarding:** Clean, instant transitions between steps. Content swaps without animation. The focus is on content, not motion. Where animation appears, it's reserved for micro-interactions within a step (validation feedback, loading states).
- **Stripe Elements (embedded forms):** Card brand icon transitions smoothly when the card number is typed. As the user enters "4242", the generic card icon crossfades into the Visa logo. This is a trust-building micro-interaction.

### 3.3 Back Navigation

- **Stripe Connect:** Clear "Back" button in the top-left corner of each step. Styled as a text link with a left arrow, not a full button. Previous data is always preserved.
- **Stripe Checkout:** No back button needed (single page). The browser back button returns to the merchant site.
- **Critical rule:** Stripe never discards user input. If you navigate back and forward, everything is preserved exactly as entered.

### 3.4 Momentum & Motivation

- **Minimal fields:** Stripe asks for only what's absolutely necessary. The checkout form has 3-4 fields maximum (card, expiry, CVC, postal code). Every unnecessary field increases abandonment.
- **Smart defaults:** Country is auto-detected from the user's IP. Card brand is auto-detected from the first digits. Expiry auto-formats with the / separator.
- **Instant visual feedback:** Valid inputs get a green checkmark. Invalid inputs get a red outline. The card number formats itself with spaces as you type (4242 4242 4242 4242). This formatting provides constant positive feedback: "what you're typing is being understood."
- **Trust signals through design:** Clean white background, ample whitespace, Stripe branding, padlock icon, "Powered by Stripe" badge. The visual message is: this is safe, professional, and legitimate.
- **No distractions:** During checkout, there are no navigation menus, no footer links, no advertisements. The entire viewport is devoted to completing the transaction.

### 3.5 Handling the Longest/Hardest Step

- Stripe's hardest UX challenge is the card number entry -- it's the moment of highest anxiety and highest abandonment risk. They handle it with:
  - **Auto-formatting** (spaces between groups of 4 digits)
  - **Card brand detection** (Visa/Mastercard icon appears after first 2-4 digits)
  - **Luhn algorithm validation** in real-time (but errors shown only after field blur, not mid-type)
  - **Inline error messages** that are specific and actionable ("Your card number is incomplete" not "Invalid input")
  - **Placeholder text** showing expected format ("1234 1234 1234 1234")

### 3.6 Micro-Interactions

- **Card brand icon transition:** Crossfade from generic card icon to specific brand (Visa, Mastercard, Amex). Takes approximately 200ms. Subtle but confidence-building.
- **Field validation colouring:** Border transitions from neutral grey to green (valid) or red (invalid). Uses `transition: border-color 150ms ease`.
- **Checkmark appearance:** Small checkmark icon scales in (from 0 to 1) next to valid fields. Slight overshoot (scale to 1.1 then back to 1).
- **Error message slide-in:** Error text slides down from the field with opacity fade-in. Duration approximately 200ms.
- **Loading spinner on submit:** Button text changes to a spinner animation while processing. Button becomes disabled. The spinner uses Stripe's signature gradient animation.
- **Success redirect:** After payment completes, there's a brief checkmark animation (circle draws on, then checkmark draws on inside it) before redirecting to the merchant's success page.
- **Skeleton loading:** Stripe Elements use skeleton placeholders (grey pulsing rectangles) while the form loads, preventing layout shift.

### 3.7 Key Takeaways for ScopeAI

| Pattern | Apply to ScopeAI? | Where |
|---------|--------------------|-------|
| Minimal required fields | Yes | Property details, auth gate |
| Auto-detection/smart defaults | Yes | State detection from suburb, property type defaults |
| Inline validation with specific messages | Yes | All form fields |
| Trust through clean design + whitespace | Yes | Entire wizard, especially preview/paywall |
| No distractions during critical steps | Yes | Auth gate and generation screen |
| Skeleton loading | Yes | While photo analysis runs, generation screen |
| Success checkmark animation | Yes | After generation completes |
| Green checkmark on valid fields | Yes | Property details form |

---

## 4. Vercel v0.dev

**What it is:** AI-powered UI code generation tool. Relevant to ScopeAI because it handles the same core UX challenge: user provides input, AI processes it (with a wait), output is delivered.

### 4.1 Progress Indication

- **No traditional progress bar.** Instead, v0 uses a **streaming output display.** As the AI generates code, the output appears in real-time -- character by character, line by line. This streaming serves as its own progress indicator: "something is happening, and it's producing results."
- A **typing indicator** (blinking cursor or animated dots) appears before the first token streams in, signalling that the AI has received the request and is working.
- The code preview panel updates live as tokens arrive. Users can see the UI being built in real-time in a preview iframe alongside the streaming code.
- **Implication for ScopeAI:** During scope generation (Step 6), streaming output isn't practical because the output is structured JSON, not readable text. However, the principle of **showing work-in-progress** is critical. ScopeAI should show each trade scope appearing as it completes (e.g. a card flips from "Generating..." to "Electrical -- 11 items" as each trade finishes).

### 4.2 Step Transitions

- **No traditional step transitions.** v0 uses a chat interface paradigm. User messages and AI responses stack vertically in a scrolling conversation. New content pushes in from the bottom.
- The chat interface auto-scrolls to keep the latest content visible.
- When a new generation starts, the input area is disabled and greyed out. A "Stop" button appears to cancel generation.
- **Framer Motion implementation for ScopeAI's generation step:**
  ```tsx
  // Trade scope cards appearing one by one as generation completes
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
  >
    <TradeCard trade="electrical" status="complete" itemCount={11} />
  </motion.div>
  ```

### 4.3 Back Navigation

- **Not applicable in traditional sense.** In a chat interface, you scroll up to see previous messages. You can start a new generation by sending a new message. There is no "undo last generation" -- you iterate forward.
- **Implication for ScopeAI:** Once generation starts (Step 6), there should be no back button. Only "Cancel" (to stop generation) or "Wait" (to let it finish). After generation completes, "Back" should not regenerate -- it should return to questions, which would then require a fresh generation if answers change.

### 4.4 Momentum & Motivation

- **Immediate feedback:** The moment you submit a prompt, the UI responds. A typing indicator appears within 200ms. Streaming starts within 1-2 seconds. Users never stare at a blank screen.
- **Visible progress through streaming:** Watching code appear line by line creates a sense of momentum and anticipation. It's more engaging than a progress bar because the output is tangible.
- **Preview alongside code:** Users see the rendered UI update in real-time as code streams in. This is deeply satisfying -- you see your description turning into a real interface.
- **Iteration is easy:** Don't like the result? Type "make the button bigger" and a new version generates. Low commitment per iteration.

### 4.5 Handling the Longest/Hardest Step

- The generation itself (10-30 seconds typically) is the hardest moment. v0 handles it with:
  - **Streaming output** so the wait never feels empty
  - **Input disabling** so users can't accidentally queue multiple requests
  - **Cancel button** so users feel in control
  - **Preview panel** showing the result taking shape
- For ScopeAI, the generation wait (30-60 seconds) is significantly longer. v0's streaming approach cannot be directly replicated (scope JSON is not human-readable during generation). Instead, ScopeAI should use:
  - **Per-trade progress updates** from the backend (real milestones)
  - **Smooth animation between milestones** (CSS transition on progress bar width)
  - **Descriptive status messages** ("Generating your electrical scope...")
  - **Educational content** during the wait (tips about the renovation process, what to expect from tradies, etc.)

### 4.6 Micro-Interactions

- **Typing indicator:** Three animated dots that pulse in sequence (each dot scales up/down with a 200ms delay offset).
- **Code syntax highlighting:** As tokens stream in, syntax colours apply immediately. This adds visual richness to the streaming output.
- **Copy button:** Appears on hover over code blocks. Clicking it triggers a brief "Copied!" tooltip with a checkmark replacing the copy icon for 2 seconds.
- **Preview resize:** The code/preview split can be dragged. The divider has a subtle hover effect (colour change to accent).
- **Submit button animation:** The submit button pulses subtly while processing, then returns to static when generation completes.

### 4.7 Key Takeaways for ScopeAI

| Pattern | Apply to ScopeAI? | Where |
|---------|--------------------|-------|
| Show work-in-progress, not just a spinner | Yes | Step 6 -- trade cards appearing as they complete |
| Disable input during processing | Yes | Step 6 -- no back button during generation |
| Cancel button during long operations | Yes | Step 6 -- "Cancel Generation" option |
| Educational content during wait | Yes | Step 6 -- renovation tips during 30-60s wait |
| Immediate response to user action (<200ms) | Yes | All steps -- instant visual feedback on every interaction |
| Typing/processing indicator | Yes | Step 6 -- animated indicator before first trade completes |

---

## 5. Airbnb Listing Creation

**What it is:** Multi-step wizard for hosts to list their property. Closest analogy to ScopeAI's flow: photos + details + multiple configuration steps.

### 5.1 Progress Indication

- **Horizontal segmented progress bar** at the top of the page. The wizard is divided into 3 major phases, each containing multiple sub-steps:
  1. "Tell us about your place" (property type, location, basics)
  2. "Make it stand out" (photos, title, description, highlights)
  3. "Finish up and publish" (pricing, availability, settings)
- Each phase is labelled, and the progress bar fills within each segment. The current phase label is bold/highlighted.
- A **fractional indicator** ("Step 2 of 3") appears below the phase name, but this refers to the phase, not the individual sub-step. Within each phase, individual sub-steps are not numbered -- they flow naturally.
- **Implication for ScopeAI:** This three-phase structure maps well to ScopeAI's flow:
  - Phase 1: "Tell us about your project" (mode, project setup)
  - Phase 2: "Show us your space" (photos, questions)
  - Phase 3: "Get your scope" (auth, generation, preview)

### 5.2 Step Transitions

- **Horizontal slide (left/right).** When advancing, the current step slides left and the next step slides in from the right. When going back, the reverse. The animation takes approximately 300-400ms.
- The transition is gentle -- content fades slightly during the slide, so the old content disappears at around 30% opacity before the new content reaches full opacity. This prevents a jarring "two screens fighting for space" moment.
- On mobile, the slide is a full-screen transition. On desktop, the content area transitions while the header (with progress bar) remains static.
- **Framer Motion implementation:**
  ```tsx
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  <AnimatePresence mode="wait" custom={direction}>
    <motion.div
      key={step}
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.35, ease: "easeInOut" }}
    >
      {/* Step content */}
    </motion.div>
  </AnimatePresence>
  ```

### 5.3 Back Navigation

- **"Back" text button** in the bottom-left corner, paired with a "Next" button in the bottom-right. Both are always visible in a fixed footer bar.
- The footer bar is persistent across all steps. It contains only "Back" and "Next" (or "Publish" on the final step). This creates a consistent, predictable navigation anchor.
- Tapping "Back" reverses the slide animation and restores all previous inputs.
- On the very first step, the "Back" button is replaced with an "Exit" button (or is hidden), which prompts a confirmation dialog: "Your progress has been saved. You can finish later."
- **Save & resume:** Airbnb auto-saves progress at every step. If you close the browser and return, you can resume from where you left off. A card on the hosting dashboard shows "Continue your listing" with a progress indicator.

### 5.4 Momentum & Motivation

- **Phase completion celebrations:** When you complete a phase (e.g. finishing "Tell us about your place"), a brief interstitial screen appears with a large illustration and text like "Great! Next, let's make your listing stand out." This provides a psychological break and a sense of accomplishment.
- **Contextual guidance:** Each step includes helper text explaining why the information matters. Example: beneath the photo upload area, "Listings with 5+ photos get 2x more bookings."
- **Smart suggestions:** Airbnb pre-fills information where possible (location from your IP, suggested pricing from comparable listings, suggested title from property details).
- **Visual preview:** Throughout Phase 2, a live preview of the listing appears alongside the form. Users can see their listing taking shape, which is motivating.

### 5.5 Handling the Longest/Hardest Step

- **Photo upload** is the longest step. Airbnb handles it with:
  - **Drag-and-drop zone** prominently displayed with clear "Upload" and "Take photo" options
  - **Batch upload:** Upload multiple photos at once. Each shows an individual upload progress indicator.
  - **Thumbnail grid:** Uploaded photos appear as thumbnails in a reorderable grid. Drag to reorder. The first photo becomes the "cover photo" (indicated by a label).
  - **Quality guidance:** Helper text says "Use landscape photos with natural lighting" with example images.
  - **Minimum requirement:** "Upload at least 5 photos" with a counter showing "3 of 5 minimum." The "Next" button is disabled until the minimum is met.
  - **Photo categorisation:** After upload, Airbnb prompts you to tag photos by room (bedroom, bathroom, kitchen). This is optional and done via dropdown overlays on each thumbnail.
- **Implication for ScopeAI:** ScopeAI's photo upload (Step 3) should directly adopt this pattern. Show thumbnails in a grid, display "3 of 3 minimum" counter, show individual upload progress, and allow removal. Guidance text like "Take photos of your current layout, appliances, and any problem areas" mirrors Airbnb's approach.

### 5.6 Micro-Interactions

- **Photo upload progress:** Each photo shows a circular progress indicator overlaying the thumbnail during upload. On completion, the circle fills and transitions to a checkmark.
- **Drag-to-reorder:** Photos in the grid can be dragged to reorder. During drag, other photos shift positions with a smooth animation (approximately 200ms ease). The dragged photo has a slight scale-up (1.05) and drop-shadow.
- **Delete photo:** Hovering over a photo reveals an "X" button in the top-right corner. Clicking it triggers a brief shrink + fade-out animation, then the remaining photos reflow.
- **Character counter:** Text inputs (title, description) show a live character counter that turns from grey to amber as you approach the limit, and red when exceeded.
- **Toggle switches:** Various settings use toggle switches with smooth slide animations (the knob slides left/right with a colour transition from grey to brand colour).
- **Next button state:** The "Next" button transitions from disabled (grey, no hover effect) to enabled (filled brand colour, slight scale-up on hover) as validation passes.

### 5.7 Key Takeaways for ScopeAI

| Pattern | Apply to ScopeAI? | Where |
|---------|--------------------|-------|
| Three-phase progress bar with labels | Yes | Overall wizard structure |
| Phase completion interstitials | Yes | Between phases (e.g. after questions, before generation) |
| Persistent footer with Back/Next | Yes | All steps |
| Save & resume | Yes (V2) | MVP can use client state; V2 adds server persistence |
| Photo thumbnail grid with reorder | Yes | Step 3 (Photo Upload) |
| Individual upload progress per photo | Yes | Step 3 |
| Minimum photo counter ("3 of 3") | Yes | Step 3 |
| Helper text with specific guidance | Yes | All steps |
| Smart suggestions / pre-fill | Yes | Suburb -> auto-fill state, property age detection |
| Next button disabled until valid | Yes | All steps |

---

## 6. TurboTax

**What it is:** Online tax filing software. The definitive example of making a dreaded, long, complex process feel manageable and even enjoyable.

### 6.1 Progress Indication

- **Three layers of progress indication running simultaneously:**
  1. **Top-level section tabs:** Horizontal navigation showing major sections (Personal Info, Income, Deductions, Review). Current section is underlined/highlighted. Completed sections show a checkmark.
  2. **Sidebar progress tracker:** A vertical list of sub-sections within the current major section. Shows which sub-sections are complete (checkmark), in-progress (highlighted), and remaining (greyed).
  3. **Running refund estimate:** A persistent display showing "Federal refund: $3,247 | State refund: $812." This number updates in real-time as users enter deductions and income. It serves as a motivational progress indicator -- the number gets bigger as you go, which is inherently rewarding.
- The running refund number is the most powerful motivational tool. It reframes progress from "how much form do I have left?" to "how much money am I getting?" This is goal-oriented progress.
- **Implication for ScopeAI:** ScopeAI doesn't have a financial reward to display during the flow. However, the principle of showing a growing "output preview" is applicable. During questions (Step 4), consider showing a sidebar that accumulates: "Trades identified so far: Electrical, Plumbing, Carpentry..." This gives users a tangible sense that their answers are producing something.

### 6.2 Step Transitions

- **No dramatic transitions between questions.** The content area updates in-place with a simple fade or instant swap. TurboTax prioritises speed and clarity over animation polish.
- Between major sections (e.g. moving from "Income" to "Deductions"), an **interstitial milestone screen** appears. This screen has:
  - A large illustration (e.g. a stylised government building, a dollar sign)
  - Celebratory copy: "Nice work! You've finished your income section."
  - An updated refund estimate
  - A "Continue to Deductions" button
  - This screen serves as a psychological rest stop. It marks progress, celebrates it, and resets the user's mental energy for the next section.
- **Implication for ScopeAI:** Adopt milestone interstitials between wizard phases. After photo upload and questions are complete (before generation), show an interstitial: "Nice one. We have everything we need. Ready to generate your scope?" This creates a sense of completion and a fresh start.

### 6.3 Back Navigation

- **"Back" link** at the top-left of each question screen. Simple text link, not a button. Clicking it returns to the previous question with all data preserved.
- **Section navigation (sidebar):** Users can click on any completed section in the sidebar to jump back to it. This is non-linear navigation within the wizard -- powerful for review and correction.
- **"Review" section:** At the end of the flow, a review section shows all entered data organised by section. Users can click "Edit" next to any section to jump back.
- **Implication for ScopeAI:** The review pattern is directly applicable to the generation step. Before hitting "Generate," show a summary: "Kitchen renovation in Paddington, NSW | 8 photos uploaded | 12 questions answered | Mode: Trade Manager." With an "Edit" link for each section.

### 6.4 Momentum & Motivation

- **Celebratory milestones:** Full-screen modals appear when users discover tax benefits: "Congrats! You qualify for the home office deduction." These celebrations are genuinely surprising and rewarding.
- **Humanised copy:** Instead of "Enter your W-2 data," TurboTax says "Let's take a quick look at the story of your year." Instead of "Proceed to next section," it says "Great start on your refund!"
- **Progressive disclosure:** Only relevant questions are shown. If you say "I'm not self-employed," all self-employment questions are skipped. Users only answer what's relevant to them.
- **Gamification without game aesthetics:** TurboTax doesn't use badges, points, or leaderboards. Instead, the refund number going up IS the game. The milestone celebrations ARE the achievements. It's gamification through the intrinsic reward of the task itself.
- **Pre-population:** W-2 data can be imported by photographing the form or importing from an employer. This eliminates the most tedious data entry step.
- **Early trust building:** TurboTax front-loads its guarantee: "Maximum refund, guaranteed." This reduces anxiety before users invest time.

### 6.5 Handling the Longest/Hardest Step

- The income section (entering W-2s, 1099s, investment income) is the longest step. TurboTax handles it with:
  - **Import automation:** Photo capture of W-2, direct import from financial institutions, employer database lookup.
  - **Form field mirroring:** The on-screen form visually matches the physical W-2 layout. Users look at their paper and see the same boxes on screen. This reduces cognitive mapping effort.
  - **Chunking:** The income section is broken into sub-sections (employment, freelance, investments, other). Users can complete them independently.
  - **Early gratification:** Even before completing all income, the refund estimate starts updating. Users see immediate value.
- **Implication for ScopeAI:** The photo upload step is ScopeAI's equivalent of "enter your W-2." Make it as fast as possible: batch upload, direct camera access on mobile, immediate thumbnail preview. The questions step should use chunking (group by topic: cooking, lighting, layout) with visible sub-progress.

### 6.6 Micro-Interactions

- **Refund number animation:** When the estimated refund changes, the number animates (counts up/down) rather than snapping to the new value. This draws attention to the change and makes it feel real.
- **Checkmark animations:** When a section is completed, a green checkmark draws on (circle first, then the check stroke) next to the section name.
- **Contextual help popover:** A "?" icon next to complex fields triggers a slide-in panel with plain-English explanation and a "learn more" link. The panel slides in from the right with a subtle shadow.
- **W-2 photo capture:** Camera viewfinder with an overlay showing where to position the W-2. Real-time edge detection highlights the document boundary.
- **Celebration modals:** Full-screen modal with a colourful illustration, large text, and a "Continue" button. The modal fades in with a slight scale-up (from 0.95 to 1.0).
- **Smart auto-fill:** When importing data, fields populate one by one with a brief highlight flash (background briefly turns yellow/accent, then fades to white). This gives the impression of the system "working."

### 6.7 Key Takeaways for ScopeAI

| Pattern | Apply to ScopeAI? | Where |
|---------|--------------------|-------|
| Running "output preview" counter | Yes | Step 4 -- show trades identified so far |
| Milestone interstitials between phases | Yes | Between Phase 2 and Phase 3 |
| Celebratory moments for discoveries | Adapted | "We detected your property may have asbestos-era materials" (informative, not celebratory, but visually distinct) |
| Humanised, conversational copy | Yes | All wizard copy |
| Progressive disclosure / skip irrelevant | Yes | Step 4 -- logic jumps |
| Pre-generation review summary | Yes | Before Step 6 |
| Number count-up animation | Yes | Step 6 -- trade count, item count appearing |
| Checkmark draw-on animation | Yes | Step 6 -- per-trade completion |
| Contextual help "?" popovers | Yes | Step 4 -- technical term tooltips |

---

## 7. Canva Template Selection

**What it is:** Design platform with a massive template gallery. Relevant to ScopeAI for its visual card selection patterns (mode selection, project type selection).

### 7.1 Progress Indication

- **No traditional progress indicator** for the template selection flow. Canva's template selection is a single-step interaction: browse, filter, select, customise. There is no multi-step wizard.
- The design type selector (the initial "What would you like to design?" screen) uses a short list of frequently used types with a "More" button that expands to show all options. This is a progressive disclosure pattern, not a progress pattern.
- **Implication for ScopeAI:** Canva's template selection is a reference for ScopeAI's mode selection (Step 1) and project type selection (Step 2), not for the overall wizard progress.

### 7.2 Step Transitions

- **"More" button expansion:** When users click "More" to see all design types, the button animates into a close button (135-degree rotation transforms the "+" into an "X"), the view expands to full-screen with a smooth height/opacity transition, and the close button anchors to the top-right corner.
- **Template hover-to-preview:** Hovering over a template card shows a brief preview animation (if the template is animated) or a subtle scale-up (1.02-1.05) with a shadow increase. This preview is instant -- no delay.
- **Category tab switching:** Horizontal scrollable category tabs (Social Media, Presentations, Videos, etc.) filter the template grid. Switching tabs triggers a fade-and-reflow of the grid content. An animated underline slides to the active tab.

### 7.3 Back Navigation

- Not applicable in the traditional wizard sense. Canva's template flow is a single-decision: pick a template. The browser back button returns you to the dashboard.

### 7.4 Momentum & Motivation

- **Visual richness:** The template gallery is a grid of visually appealing, colourful thumbnails. The visual density creates a sense of abundance and possibility. Users think "I can make something that looks like THAT?" which is inherently motivating.
- **Low commitment:** Clicking a template immediately opens the editor with that template loaded. There is no confirmation step, no "Are you sure?" dialog. This removes friction between decision and action.
- **Instant gratification:** Within seconds of arriving, users see dozens of professional templates. The time from "I need a presentation" to "I'm editing a beautiful presentation" is under 10 seconds.

### 7.5 Handling the Longest/Hardest Step

- The hardest moment is choice paralysis -- too many templates to choose from. Canva handles this with:
  - **Category filtering:** Narrow by type (Presentation, Instagram Post, etc.)
  - **Search:** Free-text search with instant results
  - **Recommended/trending:** "Recommended for you" section at the top based on past usage
  - **Visual hierarchy:** Featured/premium templates are larger in the grid, drawing attention first
  - **Lazy loading:** Templates load as you scroll (infinite scroll with skeleton placeholders), so the initial page load is fast

### 7.6 Micro-Interactions

- **Card hover effect:** Templates scale up slightly (1.02-1.05) with a subtle shadow increase on hover. The transition takes approximately 200ms with an ease-out curve. This is the most important interaction for card-based selection patterns.
- **Cursor trail on login:** A reveal effect on the login/signup page where moving the cursor "reveals" a background image, described as "like rubbing steam off a mirror." This uses canvas masking with blur effects. (Not applicable to ScopeAI but demonstrates Canva's commitment to delight.)
- **More/Close button morphing:** The "More" button transitions through multiple states: border from dashed to solid, border-radius transforms from rounded-rect to circle, size shrinks (84px to 36px), a 135-degree rotation converts the plus to an X, and the position shifts from inline to fixed top-right.
- **Upload progress indicator (Porthole):** During file uploads, a circular "porthole" animation shows water level rising based on upload percentage. An SVG wave pattern repeats horizontally. Randomly, a rubber duck appears as an easter egg. This transforms a boring wait into a delightful moment.
- **Bubble progress indicator:** A circular loading animation with small circles that scale from 0 to 1 with staggered timing, followed by a larger circle with fading background colour.
- **Skeleton loading:** Template thumbnails use pulsing grey rectangles while loading, preventing layout shift and communicating that content is coming.

### 7.7 Key Takeaways for ScopeAI

| Pattern | Apply to ScopeAI? | Where |
|---------|--------------------|-------|
| Visual card selection with hover scale+shadow | Yes | Step 1 (Mode), Step 2 (Project Type) |
| Low-commitment selection (tap = select = advance) | Yes | Step 1 |
| Category filtering with animated tab underline | Partially | Step 4 -- question categories |
| Skeleton loading placeholders | Yes | Photo analysis, generation screen |
| Delightful upload progress animation | Yes (simplified) | Step 3 -- photo upload progress |
| Lazy loading for performance | Yes | Photo thumbnails if many |
| Grid layout for visual browsing | Yes | Step 2 -- project type cards in 2-column grid on mobile |

---

## 8. Cross-Cutting Patterns & Synthesis

### 8.1 Progress Indication Spectrum

| Product | Technique | When to Use |
|---------|-----------|-------------|
| Typeform | Thin bar, no numbers | Sub-step sequences (questions within a step) |
| Linear | No indicator at all | Steps under 15 seconds each |
| Stripe Connect | Numbered steps with labels | Multi-step processes with distinct named stages |
| Airbnb | Phased bar with segment labels | Long wizards (5+ steps) with natural groupings |
| TurboTax | Multi-layer (tabs + sidebar + value counter) | Very long processes with section/sub-section hierarchy |
| Canva | None (single-step selection) | One-shot interactions |
| v0.dev | Streaming output as implicit progress | AI generation waits |

**ScopeAI recommendation:** Use a hybrid approach:
- **Overall wizard:** Phased progress bar (3 phases, Airbnb-style) with descriptive labels
- **Within questions step:** Thin bar (Typeform-style) without question numbers
- **During generation:** Per-trade milestone progress (v0-style work-in-progress + TurboTax-style growing output)

### 8.2 Transition Patterns Spectrum

| Product | Transition | Duration | Direction |
|---------|-----------|----------|-----------|
| Typeform | Vertical slide | 400-500ms | Up/down |
| Linear | Crossfade | 200-300ms | None |
| Stripe | Instant / none | 0ms | None |
| Airbnb | Horizontal slide | 300-400ms | Left/right |
| TurboTax | Fade / instant | 0-200ms | None |
| Canva | Scale + opacity | 200ms | In/out |
| v0.dev | Scroll + append | N/A | Downward |

**ScopeAI recommendation:** Use directional transitions that reinforce mental model:
- **Between major wizard steps:** Horizontal slide (left/right, like Airbnb) -- communicates forward/backward spatial movement
- **Between questions within Step 4:** Vertical slide (up/down, like Typeform) -- different axis avoids confusion with step transitions
- **During generation:** Vertical stack with fade-in (items appearing like v0's streaming)
- **Duration:** 300ms for step transitions, 200ms for micro-interactions

### 8.3 Back Navigation Patterns

| Product | Mechanism | Data Preservation |
|---------|-----------|-------------------|
| Typeform | Arrow button, keyboard shortcut | Full preservation |
| Linear | Not provided | N/A |
| Stripe | Text link with left arrow | Full preservation |
| Airbnb | Persistent footer "Back" button | Full preservation + auto-save |
| TurboTax | Text link + sidebar section jumps | Full preservation |
| Canva | Browser back button | N/A |
| v0.dev | Scroll up to view history | N/A |

**ScopeAI recommendation:** Persistent footer navigation (Airbnb model):
- "Back" button on the left, "Continue" / "Next" button on the right
- Always visible at the bottom of the viewport
- Data preserved on all backward navigation
- Disabled during generation (Step 6)
- "Exit" on Step 1 instead of "Back"

### 8.4 Momentum Techniques Ranked by Relevance to ScopeAI

| Rank | Technique | Source | ScopeAI Application |
|------|-----------|--------|---------------------|
| 1 | Auto-advance on single-select | Typeform | Questions step -- tap answer, immediately slide to next |
| 2 | Phase completion interstitials | Airbnb, TurboTax | Between photo upload and generation |
| 3 | Running output preview | TurboTax | Show trades being identified during questions |
| 4 | Helper text explaining "why we ask" | TurboTax, Airbnb | Every question has a "why" tooltip |
| 5 | Smart defaults / pre-fill | Stripe, TurboTax | State from suburb, property type defaults |
| 6 | Visible work-in-progress | v0.dev | Trade cards appearing during generation |
| 7 | Low-stakes first step | Linear | Mode selection -- fun, no form fields |
| 8 | Educational content during wait | v0.dev (adapted) | Renovation tips during generation |
| 9 | Visual richness in selections | Canva | Project type cards with illustrations |
| 10 | Celebration moments | TurboTax | Generation complete animation |

---

## 9. Implementation Recommendations for ScopeAI

### 9.1 Overall Wizard Architecture

```
Phase 1: "About Your Project"     Phase 2: "Your Space"         Phase 3: "Your Scope"
  Step 1: Mode Selection            Step 3: Photo Upload          Step 5: Auth Gate
  Step 2: Project Setup             Step 4: Smart Questions       Step 6: Generation
                                                                  Step 7: Preview
```

**Progress bar:** Three-segment horizontal bar at the top of the viewport. Each segment labelled with the phase name. The bar fills within each segment as sub-steps complete. Current phase label is bold/teal. Completed segments show a checkmark.

```tsx
// Progress bar component
<div className="flex items-center gap-1 px-4 py-3 border-b">
  {phases.map((phase, i) => (
    <div key={phase.id} className="flex-1 flex items-center gap-2">
      <div className={cn(
        "h-1 rounded-full flex-1 transition-all duration-500",
        i < currentPhase ? "bg-primary" :           // completed
        i === currentPhase ? "bg-primary" :          // current (partially filled via width%)
        "bg-muted"                                   // future
      )} style={i === currentPhase ? { width: `${phaseProgress}%` } : undefined} />
      <span className={cn(
        "text-xs whitespace-nowrap",
        i <= currentPhase ? "text-foreground font-medium" : "text-muted-foreground"
      )}>
        {i < currentPhase ? <CheckIcon className="h-3 w-3 text-primary" /> : phase.label}
      </span>
    </div>
  ))}
</div>
```

### 9.2 Step Transition Configuration

```tsx
// Shared transition variants for wizard steps
const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 200 : -200,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -200 : 200,
    opacity: 0,
  }),
};

// Question-specific variants (vertical slide, Typeform-style)
const questionVariants = {
  enter: (direction: number) => ({
    y: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: {
    y: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    y: direction > 0 ? -80 : 80,
    opacity: 0,
  }),
};

// Recommended easing and duration
const stepTransition = {
  duration: 0.3,
  ease: [0.25, 0.1, 0.25, 1.0], // cubic-bezier for smooth deceleration
};
```

### 9.3 Per-Step UX Specifications

#### Step 1: Mode Selection
- **Layout:** Two large cards, vertically stacked on mobile, side-by-side on desktop
- **Interaction:** Tap card to select. Auto-advance after 300ms delay (let the selection state register visually).
- **Card hover (desktop):** `scale(1.02)` + `shadow-md`, 200ms ease-out
- **Card selected state:** Teal border, teal checkmark icon, slight scale-up
- **No "Next" button needed** -- auto-advance on selection (like Typeform single-select)
- **Transition to Step 2:** Horizontal slide-right

#### Step 2: Project Setup
- **Layout:** Project type cards (2-column grid on mobile, 3-column on desktop) + property details form below
- **Project type cards:** Icons + labels (Kitchen, Bathroom, etc.). Same hover/select pattern as mode cards.
- **Property form:** Suburb input with autocomplete, State dropdown (auto-filled from suburb), Property type radio buttons, Year built input
- **Validation:** Inline. State field border goes green with checkmark when valid. Year built shows amber note "Pre-1990 -- we'll check for asbestos considerations" when applicable.
- **"Continue" button:** In persistent footer bar. Disabled until project type selected + required fields filled.

#### Step 3: Photo Upload
- **Layout:** Large drop zone (top half) + thumbnail grid (bottom half)
- **Drop zone:** Dashed border, camera icon, "Drag photos or tap to upload" text. On mobile: "Take a photo" button alongside "Choose from library"
- **Upload progress:** Each photo shows Canva-inspired circular progress overlay. On completion: checkmark replaces spinner.
- **Thumbnail grid:** 3-column grid. Each thumbnail has an "X" button (visible on hover/always on mobile). Thumbnails can be drag-reordered.
- **Counter:** "3 of 3 minimum uploaded" (teal text when met, amber when under). "Maximum 10 photos."
- **Guidance text:** "Take photos of: current layout, appliances, fixtures, problem areas, any angles showing the full room."
- **"Continue" triggers background photo analysis** (Convex action). No loading state shown to user -- analysis runs during Step 4.

#### Step 4: Smart Questions
- **Layout:** One question per screen (Typeform model). Question text large (text-xl), options as tappable cards below.
- **Sub-progress:** Thin teal bar at top of question area. No "Question 5 of 12" text.
- **Auto-advance:** On single-select questions, advance 400ms after selection.
- **Multi-select questions:** Show a "Continue" button below options (only for multi-select).
- **"Not sure" option:** Styled differently -- lighter card, italic text. Always last option.
- **"Why we ask" tooltip:** Small "?" icon next to question text. Tapping opens a popover with plain-English explanation.
- **Transition between questions:** Vertical slide (up on advance, down on back). 350ms.
- **Back navigation:** Up arrow button in bottom-left, within the footer bar.
- **Logic jumps:** If an answer makes subsequent questions irrelevant, skip them. Progress bar jumps forward (satisfying).
- **Running trade counter (optional, high-impact):** Small badge in the corner: "4 trades identified" that updates as answers trigger new trade requirements.

#### Step 5: Auth Gate
- **Layout:** Clean, centered card. No distractions.
- **Interstitial before auth:** "We have everything we need. Create a free account to generate your scope." This frames auth as the gateway to the reward, not a hurdle.
- **Options:** Google OAuth button (prominent, top position -- one tap), then email/password form below.
- **Copy:** "Your photos and answers are saved and ready. We just need to know who to send the scope to."
- **Design:** Follow Stripe's trust principles -- clean whitespace, minimal fields, no clutter.
- **After auth:** Auto-advance to Step 6. No "Continue" button needed post-login.

#### Step 6: Generation (30-60 seconds)
- **Layout:** Centered content area. No navigation buttons (no back, no next). Only a "Cancel" text link.
- **Phase 1 (0-3s):** Animated processing indicator (pulsing teal circle or Lottie animation). Text: "Starting your scope generation..."
- **Phase 2 (3-60s):** Per-trade progress display:
  - Vertical stack of trade cards
  - Each card starts as a skeleton/placeholder
  - As each trade completes (backend pushes real-time update via Convex reactive query), the card animates in:
    - Fade in + slide up (20px)
    - Shows trade icon + name + item count
    - Green checkmark draws on (circle then check stroke, 400ms)
  - Currently-generating trade shows a pulsing indicator: "Generating electrical scope..."
  - Overall progress bar below: smooth transition filling as trades complete
- **Phase 3 (generation complete):** All cards visible with checkmarks. Brief celebration:
  - All cards do a subtle stagger animation (each slides up 2px in sequence)
  - Central text changes to "Your scope is ready!" with a scale-in animation
  - "View Your Scope" button appears with a fade-in
- **Educational content:** Below the progress area, show rotating tips: "Did you know? 76% of Australian homeowners coordinate their own trades." / "Tip: Send your scope to at least 3 tradies for comparable quotes." New tip every 8-10 seconds with a crossfade.
- **Error handling:** If a trade fails, its card shows an amber warning icon instead of green checkmark. Text: "Electrical scope encountered an issue. [Retry]". Other trades continue generating.

#### Step 7: Scope Preview
- **Layout:** Summary card showing all generated trades. Each trade is a row: icon + name + item count + "1 sample item" snippet.
- **Paywall:** Below the summary, pricing tiers as cards (Canva-style visual cards). "Professional" tier highlighted as "Most Popular" with a teal badge.
- **"Unlock" button:** Full-width teal button. "Unlock Full Scope -- $99"
- **Trust signals:** "Money-back guarantee" badge, "Based on Australian Standards" note, Stripe badge.

### 9.4 Persistent Footer Bar Specification

```tsx
// Footer navigation bar (Airbnb-style, persistent across all steps)
<div className="fixed bottom-0 inset-x-0 border-t bg-background px-4 py-3 flex items-center justify-between z-50">
  <Button
    variant="ghost"
    onClick={handleBack}
    disabled={isFirstStep || isGenerating}
    className="text-muted-foreground"
  >
    {isFirstStep ? "Exit" : "Back"}
  </Button>

  <Button
    onClick={handleNext}
    disabled={!isStepValid || isGenerating}
    className="bg-primary text-primary-foreground px-8"
  >
    {isLastStep ? "Generate My Scope" : "Continue"}
  </Button>
</div>
```

### 9.5 Animation Timing Reference

| Interaction | Duration | Easing | Notes |
|-------------|----------|--------|-------|
| Step transition (horizontal slide) | 300ms | `[0.25, 0.1, 0.25, 1.0]` | Between major wizard steps |
| Question transition (vertical slide) | 350ms | `[0.25, 0.1, 0.25, 1.0]` | Between questions in Step 4 |
| Card hover scale | 200ms | `ease-out` | Mode/project type selection cards |
| Card selection feedback | 150ms | `ease-out` | Border colour + checkmark appear |
| Auto-advance delay | 400ms | Linear (delay, not animation) | After single-select question answer |
| Validation feedback (border colour) | 150ms | `ease` | Green/red border transition |
| Error shake | 300ms | Custom (2 oscillations) | `[x: 0, -8, 8, -4, 4, 0]` keyframes |
| Progress bar fill | 500ms | `ease-out` | Smooth width transition |
| Trade card appear (generation) | 300ms | `[0.25, 0.1, 0.25, 1.0]` | Fade in + slide up 20px |
| Checkmark draw-on | 400ms | `ease` | SVG stroke animation |
| Celebration scale-in | 400ms | Spring `{ stiffness: 300, damping: 20 }` | "Scope ready!" text |
| Tooltip/popover open | 200ms | `ease-out` | "Why we ask" tooltips |
| Skeleton pulse | 1500ms | Infinite loop, `ease-in-out` | Loading placeholders |

### 9.6 Mobile-Specific Adaptations

| Concern | Desktop | Mobile |
|---------|---------|--------|
| Card layout (mode/project) | Side-by-side / 3-col grid | Stacked / 2-col grid |
| Photo upload | Drag-and-drop zone | "Take photo" + "Choose from library" buttons |
| Question options | Horizontal option row if 2-3 items | Vertical stack always |
| Back/Next footer | Text buttons with padding | Full-width touch targets (min 44px height) |
| Tooltips | Hover-triggered popover | Tap-triggered bottom sheet |
| Step transitions | Horizontal slide 200px | Horizontal slide 100% viewport width |
| Question transitions | Vertical slide 80px | Vertical slide 60px |
| Progress bar | Full width, 4px height | Full width, 3px height |

### 9.7 Accessibility Checklist

Derived from patterns observed across all analysed products:

- [ ] All interactive elements are focusable and have visible focus rings (teal, matching Stripe pattern)
- [ ] Keyboard navigation: Tab through options, Enter to select, Arrow keys for option lists
- [ ] Progress bar has `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- [ ] Step transitions use `aria-live="polite"` regions to announce new content
- [ ] "Why we ask" tooltips are accessible via keyboard (not hover-only)
- [ ] Photo upload zone accepts keyboard activation (Enter/Space)
- [ ] Error messages are announced via `aria-live="assertive"`
- [ ] Colour is not the only indicator of state (icons + colour for valid/invalid)
- [ ] All animations respect `prefers-reduced-motion` (swap to instant transitions)
- [ ] Touch targets are minimum 44x44px on mobile

---

## Sources

- [Smashing Magazine: The Typeform Story](https://www.smashingmagazine.com/2014/09/sci-fi-frustrations-flash-and-forms-the-typeform-story/)
- [Typeform Community: Transition Animations](https://community.typeform.com/build-your-typeform-7/transition-animations-in-forms-3850)
- [Fillout: One-question-at-a-time vs Single-page Forms](https://www.fillout.com/blog/one-question-at-a-time-form)
- [GrowthDives: The Onboarding Linear Built Without AB Testing](https://www.growthdives.com/p/the-onboarding-linear-built-without)
- [Mobbin: Linear Web Onboarding Flow](https://mobbin.com/explore/flows/64ae582c-747c-4c77-8629-812abcbef186)
- [Linear: How We Redesigned the Linear UI](https://linear.app/now/how-we-redesigned-the-linear-ui)
- [Stripe: Checkout UI Design Strategies](https://stripe.com/resources/more/checkout-ui-strategies-for-faster-and-more-intuitive-transactions)
- [Stripe: Credit Card Checkout UI Design](https://stripe.com/resources/more/credit-card-checkout-ui-design)
- [Stripe: Payment HTML Forms Best Practices](https://stripe.com/resources/more/payment-html-forms)
- [Patterns.dev: AI UI Patterns](https://www.patterns.dev/react/ai-ui-patterns/)
- [Vercel: Announcing v0 Generative UI](https://vercel.com/blog/announcing-v0-generative-ui)
- [Vercel: AI SDK 3.0 with Generative UI Support](https://vercel.com/blog/ai-sdk-3-generative-ui)
- [Eleken: Wizard UI Pattern Explained](https://www.eleken.co/blog-posts/wizard-ui-pattern-explained)
- [Mobbin: Airbnb Web Listing Flow](https://mobbin.com/explore/flows/b5ea8e47-40c6-4adf-bcea-d07703bebcdf)
- [PageFlows: Airbnb User Flow](https://pageflows.com/web/products/airbnb/)
- [Appcues: How TurboTax Turns a Dreadful UX Into a Delightful One](https://www.appcues.com/blog/how-turbotax-makes-a-dreadful-user-experience-a-delightful-one)
- [OnRamp: Customer Onboarding Experience -- TurboTax](https://onramp.us/blog/customer-onboarding-experience-turbotax)
- [Canva Engineering: 5 Visual Effects Canva Uses to Thrill Users](https://www.canva.dev/blog/engineering/5-visual-effects-canva-uses-to-thrill-users/)
- [Canva: Design Guidelines Layout](https://www.canva.dev/docs/apps/design-guidelines/layout/)
- [NNGroup: Wizards Definition and Design Recommendations](https://www.nngroup.com/articles/wizards/)
- [Eleken: Fintech Design Guide with Patterns That Build Trust](https://www.eleken.co/blog-posts/modern-fintech-design-guide)
- [Appcues: User Onboarding UI/UX Patterns](https://www.appcues.com/blog/user-onboarding-ui-ux-patterns)

---

*This document is ready for implementation. All Framer Motion code snippets, timing values, and component specifications are designed for the ScopeAI tech stack (Next.js 14+ App Router, shadcn/ui, Tailwind CSS v4, Framer Motion).*
