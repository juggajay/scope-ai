# Research: Progress Indication Patterns for Multi-Step Wizard

**Project:** ScopeAI
**Date:** February 2026
**Scope:** Section 2 -- Progress Indication Patterns
**Context:** 7-step creation wizard where Step 4 (questions) contains 7-13 sub-steps depending on project type

---

## Table of Contents

1. [ScopeAI Flow Summary](#1-scopeai-flow-summary)
2. [Progress Indicator Types: When to Use Each](#2-progress-indicator-types-when-to-use-each)
3. [The Progress Illusion: Making Progress Feel Faster](#3-the-progress-illusion-making-progress-feel-faster)
4. [Grouped vs Flat Steps](#4-grouped-vs-flat-steps)
5. [Should Remaining Steps Be Visible?](#5-should-remaining-steps-be-visible)
6. [Smart Progress: Sub-Step Indication](#6-smart-progress-sub-step-indication)
7. [Mobile Considerations](#7-mobile-considerations)
8. [Recommendation: Optimal Pattern for ScopeAI](#8-recommendation-optimal-pattern-for-scopeai)
9. [Implementation Specification](#9-implementation-specification)

---

## 1. ScopeAI Flow Summary

Before analysing progress patterns, here is the exact structure the progress system must represent:

| Step | Label | Sub-steps | User Effort | Time |
|------|-------|-----------|-------------|------|
| 1 | Mode Selection | 0 | Single tap | ~5s |
| 2 | Project Setup | 0 | 4-5 form fields | ~30-60s |
| 3 | Photo Upload | 0 | Upload 3-10 photos | ~60-120s |
| 4 | Questions | 7-13 (varies by project type) | Tap-to-answer per question | ~90-180s |
| 5 | Auth Gate | 0 | Signup/login | ~20-40s |
| 6 | Generation | 0 (passive wait) | None -- user watches | ~30-60s |
| 7 | Preview + Paywall | 0 | Review + purchase decision | Variable |

**Question counts by project type:**
- Kitchen: 12 questions
- Bathroom: 13 questions
- Laundry: 7 questions
- Living Area: 8 questions
- Outdoor: 9 questions

**Key structural challenge:** Steps 1-3 are fast (single actions), Step 4 is a long engagement with many sub-steps, Steps 5-7 are short but involve different mental modes (auth, waiting, purchasing). This asymmetry is the central design problem.

---

## 2. Progress Indicator Types: When to Use Each

### 2.1 Progress Bar (Continuous Fill)

**What it is:** A horizontal bar that fills from left to right, representing percentage completion.

**Best for:**
- Flows with many steps (>7) where showing individual step dots would be cluttered
- Flows with variable step counts (e.g., branching logic, conditional questions)
- Mobile interfaces where horizontal space is limited
- Processes where steps are roughly equal in effort

**Psychology:** Progress bars activate the goal gradient effect -- users accelerate their effort as the bar approaches full. Research by Clark Hull (1932, replicated in digital contexts) demonstrates that motivation increases exponentially as perceived distance to the goal decreases.

**Risk:** A progress bar that fills slowly at the start (due to many steps) can trigger early abandonment. A meta-analysis of 32 experiments found that progress bars "negatively impacted completion when users felt the survey required high early investment" (Irrational Labs).

**Verdict for ScopeAI:** Strong candidate for the overall flow, but requires weighting (see Section 3) to avoid the slow-start problem.

### 2.2 Step Dots / Stepper

**What it is:** A series of discrete dots or numbered circles, each representing one step. The current step is highlighted.

**Best for:**
- Flows with 3-7 clearly defined steps
- Flows where step labels provide meaningful context (e.g., "Photos" > "Questions" > "Results")
- Desktop interfaces with adequate horizontal space
- Linear, non-branching flows

**Psychology:** Step dots leverage the Zeigarnik Effect -- users remember incomplete tasks and feel cognitive tension until the sequence is finished. Seeing 5/7 dots filled creates a strong "almost there" signal.

**Risk:** On mobile, 7 dots with labels require significant horizontal space. Without labels, dots become meaningless. Beyond 7 steps, dot patterns become visually noisy and lose effectiveness. Material Design documentation recommends dots "when the number of steps is small."

**Verdict for ScopeAI:** Viable for desktop but breaks down on mobile with 7 steps. Step labels add essential context but consume too much horizontal space on small screens.

### 2.3 Fraction Text (3/7)

**What it is:** Simple text showing current step out of total (e.g., "Step 3 of 7").

**Best for:**
- Minimal designs where visual chrome should be reduced
- Supplementary indicator alongside another primary indicator
- Contexts where exact position matters more than visual momentum
- Very long flows where a bar would move imperceptibly

**Psychology:** Fraction text provides precise spatial information but lacks the motivational "pull" of a visual bar. It appeals to rational processing rather than emotional/perceptual processing. Research on the goal gradient effect suggests that visual representations (bars, paths) are more motivating than numerical ones because they engage spatial cognition.

**Risk:** "Step 4 of 7" provides no information about the sub-steps within Step 4. Also, seeing "Step 1 of 7" can trigger what Irrational Labs calls the "long road" effect -- the total number can feel daunting before any progress is made.

**Verdict for ScopeAI:** Useful as a secondary indicator (inside the questions step to show "Question 3 of 12") but insufficient as the primary progress mechanism.

### 2.4 No Progress Indicator

**What it is:** Deliberately omitting progress indication and relying on content flow and momentum.

**Best for:**
- Very short flows (2-3 steps) where progress is obvious
- Conversational interfaces (chatbot-style) where a progress bar would break immersion
- Flows where showing length would deter users (very long surveys)

**Psychology:** Removing progress indicators can work when the content itself creates momentum (e.g., Typeform's one-question-at-a-time format). However, without any progress signal, users in longer flows experience uncertainty and anxiety. For anxious users (ScopeAI's demographic -- homeowners worried about renovation costs), uncertainty compounds existing stress.

**Risk:** High abandonment risk for ScopeAI. The target user is already anxious. Removing progress signals removes the feeling of control that reduces anxiety.

**Verdict for ScopeAI:** Not appropriate. The 7-step flow with 7-13 sub-steps is too long to go without progress indication, and the target user profile demands reassurance.

### 2.5 Summary: Type Selection Matrix

| Indicator Type | Steps < 5 | Steps 5-7 | Steps > 7 | Variable Sub-steps | Mobile | Anxious Users |
|---------------|-----------|-----------|-----------|-------------------|--------|---------------|
| Progress Bar | OK | Good | Best | Best | Best | Good |
| Step Dots | Best | Good | Poor | Poor | Poor (>5) | Good |
| Fraction Text | OK | OK | OK | Good (as secondary) | Best | Neutral |
| No Indicator | Risky | Bad | Bad | Bad | Bad | Bad |

**For ScopeAI:** A progress bar (primary) + fraction text (secondary, within Step 4) is the optimal combination.

---

## 3. The Progress Illusion: Making Progress Feel Faster

### 3.1 The Endowed Progress Effect

**The research:** Nunes and Dreze (2006) gave car wash customers loyalty cards. Group A received a blank 8-stamp card. Group B received a 10-stamp card with 2 stamps pre-filled. Both groups needed 8 more purchases. Result: Group B completed at a significantly higher rate and faster.

**Application to ScopeAI:** The wizard should start with visible pre-progress. When a user lands on Step 1 (Mode Selection), the progress bar should not show 0%. Instead, it should show approximately 5-8% -- acknowledging that they have already made the decision to start. This creates the psychological sensation of being "already on the way."

**Implementation:**
```
Step 0 (landing CTA clicked): bar starts at ~5%
Step 1 completed (mode): bar at ~20%
```

The user has done almost nothing, but perceives meaningful progress. This is the endowed progress effect in action.

### 3.2 Front-Loaded Weighting

**The research:** A meta-analysis of 32 experiments (cited by Irrational Labs) found that progress bars improve completion when "the speed of progress decelerates across the task -- i.e., users move fast during the first screens and slow down toward the end." The mechanism is sunk cost bias -- users who see early fast progress feel they have already invested enough to justify finishing.

**The problem with equal weighting in ScopeAI:**

If each of the 7 steps is weighted equally at ~14.3%, here is what the user sees:

```
After Step 1 (5 seconds of work):  14%
After Step 2 (60 seconds of work): 29%
After Step 3 (120 seconds of work): 43%
Midway through Step 4 questions:   ~50%  <-- user has been working for 3+ minutes
After Step 4 (all questions done):  57%
After Step 5 (auth):               71%
After Step 6 (generation, passive): 86%
After Step 7 (preview):           100%
```

This is problematic because the user reaches only 43% after doing the hardest work (uploading photos), and the progress bar barely moves during the long question step. The "slow middle" is exactly where abandonment peaks.

**Recommended weighted progress:**

The key insight is to decouple perceived progress from step count. Weight early, easy steps more heavily so the bar jumps forward quickly. Weight the long question step so that progress moves visibly with each question answered.

```
Starting state:                     5%   (endowed progress)
After Step 1 (mode selection):     15%   (+10%)
After Step 2 (project setup):     30%   (+15%)
After Step 3 (photo upload):      45%   (+15%)
During Step 4 (each question):    45% -> 75%  (+30% total, divided across questions)
After Step 5 (auth gate):         80%   (+5%)
During Step 6 (generation):       80% -> 95%  (+15%, tied to real generation progress)
Step 7 (preview):                 100%  (+5%)
```

**Why this works:**
- By the time users finish uploading photos (the first significant effort), they see 45% -- nearly half done. This triggers the goal gradient effect.
- The questions step (the longest by far) shows continuous progress. With a kitchen renovation (12 questions), each question moves the bar by ~2.5 percentage points. The user sees forward motion with every tap.
- Auth and preview are weighted lightly because they are not perceived as "work toward the goal" -- they are administrative hurdles.
- Generation is weighted to reflect the real backend milestone updates.

### 3.3 Visual Acceleration Techniques

Research from Carnegie Mellon (Harrison, Amento, Kuznetsov, Bell, 2007) demonstrated several visual techniques that make progress bars *feel* faster:

**Backwards-moving ribbing pattern:** Adding diagonal stripes that animate in the reverse direction of progress creates an induced motion effect. Users perceive the bar as moving faster than it actually is. This is because "motion perception is not absolute, but rather relative to the surrounding visual context."

**Increasing pulsation rate:** A progress bar that pulses (opacity oscillation) at an increasing rate is perceived as completing faster. Think of it like a heartbeat quickening with excitement -- it creates urgency and forward momentum.

**Fast-to-slow deceleration curve:** A bar that starts fast and gradually slows is perceived as faster overall than one moving at constant speed. This is counterintuitive but is well-supported. The explanation is that the rapid initial fill creates a strong first impression ("this is moving quickly"), and humans anchor to first impressions.

**For ScopeAI's implementation:**
- Use a CSS transition with an `ease-out` timing function on the progress bar width. This naturally creates the fast-start, slow-finish perception.
- During the generation step (Step 6), add a subtle animated stripe pattern moving backwards (a `translateX` animation on a repeating gradient). This makes the 30-60 second wait feel shorter.
- The Tailwind/Framer Motion implementation is straightforward:

```tsx
// Weighted progress bar with ease-out transition
<motion.div
  className="h-1.5 bg-primary rounded-full"
  initial={{ width: "5%" }}
  animate={{ width: `${currentProgress}%` }}
  transition={{ duration: 0.6, ease: "easeOut" }}
/>
```

### 3.4 The Sunk Cost Lever

Once users pass 50% (which happens early in Step 4 with the recommended weighting), abandonment rates drop significantly. Users think: "I've already done more than half -- might as well finish." This is the sunk cost bias, and it is the primary reason for front-loading progress.

The Irrational Labs study specifically calls this out: "Starting fast and ending at a slower pace will reduce drop-off rates as satisfaction levels spike quickly. The perception is that most of the work has already been done."

---

## 4. Grouped vs Flat Steps

### 4.1 The Question

Should ScopeAI show "Step 4 of 7" (flat) or group into phases like:

```
Phase 1: "Tell Us About Your Project"  (Steps 1-2)
Phase 2: "Show Us Your Space"          (Step 3)
Phase 3: "Refine Your Requirements"    (Step 4)
Phase 4: "Generate Your Scope"         (Steps 5-7)
```

### 4.2 Evidence For Grouped Steps

**Reduced perceived complexity:** Seven steps feels like a long journey. Four phases feels manageable. Research on chunking (Miller, 1956) shows that humans process information better when grouped into 3-5 meaningful categories.

**Semantic context:** Phase labels ("Tell Us About Your Project") provide meaning that step numbers ("Step 2") do not. Users know *why* they are doing what they are doing, which increases trust and reduces anxiety. This is particularly relevant for ScopeAI's anxious homeowner demographic.

**Google's Material Design stepper guidelines** recommend grouping related steps under labels, particularly for complex wizards where sub-steps exist within major steps.

### 4.3 Evidence For Flat Steps

**Simplicity:** Flat steps are immediately understood. "Step 3 of 7" requires no interpretation. Grouped phases introduce a two-level hierarchy that can confuse users if not visually clear.

**Accurate expectations:** Flat steps tell users exactly how many actions remain. Grouped phases can hide complexity -- a user might think "Phase 3" is one step, then discover it contains 12 questions.

**Baymard Institute's e-commerce checkout research** found that the specific structure of the progress indicator matters less than "what the customer had to do at each step." Users had "relatively few problems navigating between multiple steps as long as a few simple guidelines are adhered to."

### 4.4 The Hybrid Approach (Recommended)

The optimal pattern for ScopeAI is a **hybrid** that uses grouped phases for the overall progress bar, but exposes flat sub-step counting within phases that have sub-steps.

**Why hybrid works best:**
1. Four phases feel achievable (vs 7 steps)
2. Phase labels give semantic context ("Your Space" > "Step 3")
3. Sub-step counting within the questions phase prevents the "is this ever going to end?" feeling
4. The progress bar fills non-linearly across phases (front-loaded, per Section 3)

**Proposed phase grouping:**

| Phase | Label | Contains | Progress Range |
|-------|-------|----------|---------------|
| 1 | Your Project | Mode + Setup | 5% - 30% |
| 2 | Your Space | Photo Upload | 30% - 45% |
| 3 | Your Plans | Questions | 45% - 75% |
| 4 | Your Scope | Auth + Generate + Preview | 75% - 100% |

**Visual treatment:**
- The progress bar is the primary indicator. It fills continuously (no discrete jumps between phases).
- Above the bar, a text label shows the current phase name (e.g., "Your Plans").
- Within the questions phase, a secondary fraction counter appears: "Question 5 of 12".
- Phase labels only -- no phase numbers. "Your Plans" is better than "Phase 3 -- Your Plans" because numbering reintroduces the "long road" problem.

---

## 5. Should Remaining Steps Be Visible?

### 5.1 The Case For Visibility

**Setting expectations reduces anxiety.** Research consistently shows that users prefer knowing the length of a process upfront. SurveyMonkey's internal testing found that progress indicators improve completion for multi-page surveys. The mechanism is expectation management -- users can mentally budget their time and attention.

**The Zeigarnik Effect operates on visibility.** Users can only feel cognitive tension about incomplete tasks when they know the tasks exist. A progress bar that shows 70% complete implicitly communicates "30% remaining," leveraging this effect.

**Practical evidence:** The U.S. Web Design System (USWDS) explicitly recommends showing the total number of steps in multi-step wizards, noting that "showing the steps in advance provides visibility to what's coming next."

### 5.2 The Case Against Visibility

**Irrational Labs experiment:** When users were told a process would take 10 minutes, fewer people completed it than when no time estimate was given. The explanation: "People became too focused on the time cost versus the upside benefit." This is a cost-benefit framing effect -- revealing effort can make the "cost" salient when users might otherwise proceed on momentum.

**SurveyMonkey placement research:** Counterintuitively, SurveyMonkey found that progress bars positioned at the top of the page (more visible, constantly showing remaining work) increased drop-off rates, while bars at the bottom (less visible, seen after content engagement) improved completion.

**Long-bar deterrence:** Research on the goal gradient effect shows that a long empty progress bar (showing mostly remaining work) can be demotivating. Seeing "Step 1 of 13" when answering questions is significantly more daunting than seeing "Question 1 of 13" within a phase that is already 45% overall.

### 5.3 Resolution for ScopeAI

The evidence suggests a nuanced position:

**Show remaining progress visually (via the bar), but do not emphasise the total step count numerically at the start.**

Specifically:
- **DO** show the progress bar from Step 1. Users see it filling, which implies a finite process.
- **DO** show question counts within the questions step ("Question 3 of 12"). By this point, the user is committed (45%+ progress) and the goal gradient effect works in their favour.
- **DO NOT** show "Step X of 7" at the top of the flow. Instead, show the phase label ("Your Project").
- **DO NOT** show estimated time remaining. ScopeAI's flow is fast enough (~5-8 minutes) that time estimates would make it feel longer than it is.

**Why this works for ScopeAI's demographic:** The anxious homeowner does not want to see "7 steps to go" when they have just started. They want to see forward motion (the bar filling) and contextual labels (phase names). The feeling should be "I'm making progress" not "I have a long way to go."

---

## 6. Smart Progress: Sub-Step Indication

### 6.1 The Sub-Step Problem

Step 4 (Questions) is the longest step by far. With 13 questions for a bathroom renovation, this single "step" contains more user interactions than all other steps combined. If the progress bar stalls at 45% for 2-3 minutes while the user answers questions, the psychological effect is devastating:

- The bar appears "stuck"
- Users wonder "is this broken?"
- The goal gradient effect reverses -- the goal appears to have moved further away
- Abandonment spikes

### 6.2 The Solution: Continuous Micro-Progress

Every question answered should advance the progress bar. This creates continuous forward motion and leverages two effects simultaneously:

1. **Goal gradient effect:** The bar is always moving forward, creating acceleration toward the goal.
2. **Operant conditioning:** Each tap (answering a question) is immediately rewarded with visible progress. This creates a positive reinforcement loop -- tap, see progress, tap again.

**The math:**
- Step 4's total progress range: 45% to 75% = 30 percentage points
- Kitchen (12 questions): each question advances bar by 2.5%
- Bathroom (13 questions): each question advances bar by ~2.3%
- Laundry (7 questions): each question advances bar by ~4.3%

Note: Laundry questions move the bar more per question. This is acceptable -- fewer questions mean each one carries more weight, and the faster progress reinforces the "this is going quickly" perception.

### 6.3 Secondary Question Counter

In addition to the progress bar advancing, display a fraction counter specific to the questions step:

```
"Question 5 of 12"
```

This serves a different purpose from the progress bar:
- The **progress bar** shows overall flow progress (motivational, emotional)
- The **question counter** shows local progress within the step (informational, rational)

Users need both. The bar says "you're nearly done with everything." The counter says "you have 7 more questions in this section."

**Critical design note:** The question counter should appear *only* within the questions step. Showing it during photo upload or mode selection would be confusing and irrelevant. It appears when the first question loads and disappears when the last question is answered.

### 6.4 Question Grouping (Optional Enhancement)

ScopeAI's question sets have natural thematic groups. For example, the kitchen questions cluster as:

- **Layout & Structure:** layout_change, wall_removal (Questions 1-2)
- **Appliances & Cooking:** cooktop_type, oven_type, rangehood, dishwasher (Questions 3-6)
- **Surfaces & Materials:** island_bench, benchtop_material (Questions 7-8)
- **Electrical:** lighting, power_needs (Questions 9-10)
- **Budget & Preferences:** quality_tier, diy_interest (Questions 11-12)

Showing these group labels ("Appliances & Cooking") as the user progresses provides contextual meaning. However, this adds visual complexity. **Recommendation for MVP: skip question grouping.** The question counter ("Question 5 of 12") plus the continuous progress bar is sufficient. Grouping can be tested as a V2 enhancement.

---

## 7. Mobile Considerations

### 7.1 The Mobile Reality

ScopeAI expects 60%+ mobile traffic. The progress indicator must be designed mobile-first and adapted upward to desktop.

### 7.2 Space Constraints

A typical mobile viewport is 375px wide. The progress indicator must share the top of the screen with:
- Navigation (back button)
- Phase label
- Close/save button (optional)

**Available horizontal space for progress:** ~280px after accounting for margins and navigation elements.

### 7.3 Mobile Progress Indicator Recommendations

**Use a thin, full-width progress bar.** A 4px (mobile) or 6px (desktop) bar that spans the full screen width (edge to edge, not padded) is the most space-efficient option. This pattern is used by Instagram Stories, YouTube (video load), and many onboarding flows. It occupies minimal vertical space while being clearly visible.

**Place the bar at the very top of the content area**, below any fixed header. Research from SurveyMonkey found that top-positioned bars can increase drop-off when they are the first thing users see (before content). The bar should be at the top but visually de-emphasised -- thin, muted colour that transitions to the primary teal colour as it fills.

**The phase label should be centered text below the bar:**
```
[========================            ] (thin bar)
         Your Plans
       Question 5 of 12
```

**On mobile, do NOT use step dots.** Seven dots with labels cannot fit in 375px. Even without labels, 7 dots create a visual cluster that communicates complexity rather than progress. The progress bar with phase text label achieves the same goal in less space.

### 7.4 Touch Considerations

- The progress indicator is **not interactive** on mobile. Users cannot tap a phase to jump to it. Navigation is linear (forward/back buttons only). This simplifies the component and avoids accidental taps.
- On desktop, phases in the progress indicator *could* be clickable to allow jumping back (not forward). This is a V2 consideration.

### 7.5 Responsive Adaptation

| Viewport | Progress Indicator | Phase Label | Question Counter |
|----------|-------------------|-------------|-----------------|
| Mobile (<640px) | Full-width thin bar (4px), edge-to-edge | Centered text below bar, `text-sm` | Below phase label, `text-xs text-muted-foreground` |
| Tablet (640-1024px) | Padded bar (6px), within content max-width | Centered text below bar, `text-sm` | Below phase label, `text-xs text-muted-foreground` |
| Desktop (>1024px) | Padded bar (6px) with optional phase dots overlaid | Phase labels above dots, `text-sm` | Below phase label, `text-sm text-muted-foreground` |

On desktop, there is enough space to overlay phase markers (small dots or ticks) on the progress bar at the phase boundaries. This gives desktop users the benefit of seeing phase structure without the clutter of a full stepper. On mobile, the bar is clean and unadorned.

---

## 8. Recommendation: Optimal Pattern for ScopeAI

### 8.1 The Architecture

```
LAYER 1 (always visible): Weighted progress bar
  - Thin, full-width bar
  - Animated with ease-out transitions
  - Front-loaded weighting (early steps worth more)
  - Moves with every user action (no stalls)

LAYER 2 (always visible): Phase label
  - Text below the bar
  - Shows current phase name (not number)
  - "Your Project" > "Your Space" > "Your Plans" > "Your Scope"

LAYER 3 (questions step only): Question counter
  - "Question 5 of 12"
  - Appears only during Step 4
  - Styled as muted secondary text
```

### 8.2 Progress Weight Map

```typescript
// Progress weights for ScopeAI wizard
// Total: 100, with 5% endowed progress at start

const PROGRESS_CONFIG = {
  // Endowed progress -- user sees 5% just for starting
  initial: 5,

  // Phase 1: Your Project
  modeSelection: 15,     // +10% (cumulative: 15%)
  projectSetup: 30,      // +15% (cumulative: 30%)

  // Phase 2: Your Space
  photoUpload: 45,       // +15% (cumulative: 45%)

  // Phase 3: Your Plans (dynamic based on question count)
  // Each question adds (75 - 45) / questionCount = 30 / N percent
  questionsStart: 45,
  questionsEnd: 75,

  // Phase 4: Your Scope
  authGate: 80,          // +5% (cumulative: 80%)
  generationStart: 80,
  generationEnd: 95,     // +15% during generation (tied to real milestones)
  preview: 100,          // +5% (cumulative: 100%)
};

// Calculate progress within questions step
function getQuestionProgress(
  currentQuestion: number,  // 1-indexed
  totalQuestions: number
): number {
  const range = PROGRESS_CONFIG.questionsEnd - PROGRESS_CONFIG.questionsStart;
  const perQuestion = range / totalQuestions;
  return PROGRESS_CONFIG.questionsStart + (currentQuestion * perQuestion);
}

// Calculate progress during generation step
function getGenerationProgress(
  completedTrades: number,
  totalTrades: number
): number {
  const range = PROGRESS_CONFIG.generationEnd - PROGRESS_CONFIG.generationStart;
  const perTrade = range / totalTrades;
  return PROGRESS_CONFIG.generationStart + (completedTrades * perTrade);
}
```

### 8.3 Phase Labels

```typescript
const PHASE_CONFIG = {
  phases: [
    {
      id: "project",
      label: "Your Project",
      steps: ["modeSelection", "projectSetup"],
      progressRange: [5, 30],
    },
    {
      id: "space",
      label: "Your Space",
      steps: ["photoUpload"],
      progressRange: [30, 45],
    },
    {
      id: "plans",
      label: "Your Plans",
      steps: ["questions"],
      progressRange: [45, 75],
    },
    {
      id: "scope",
      label: "Your Scope",
      steps: ["authGate", "generation", "preview"],
      progressRange: [75, 100],
    },
  ],
};
```

### 8.4 Visual Design Specification

```
Progress Bar:
  - Height: 4px (mobile), 6px (desktop)
  - Background: var(--muted) / hsl(0 0% 96.1%)
  - Fill: var(--primary) / hsl(187 72% 45%) -- teal
  - Border radius: rounded-full (999px)
  - Position: top of content area, full-width on mobile, padded on desktop
  - Transition: width 600ms ease-out (Framer Motion or CSS)

Phase Label:
  - Font: Geist Sans, 14px (text-sm), font-medium (500)
  - Colour: var(--foreground)
  - Position: centered, 8px below progress bar
  - Transition: opacity fade 200ms on phase change

Question Counter:
  - Font: Geist Sans, 12px (text-xs), font-normal (400)
  - Colour: var(--muted-foreground)
  - Format: "Question {n} of {total}"
  - Position: centered, 4px below phase label
  - Appears/disappears with 150ms opacity transition
```

---

## 9. Implementation Specification

### 9.1 Component Structure

```tsx
// components/create/WizardProgress.tsx

interface WizardProgressProps {
  currentStep: WizardStep;
  questionProgress?: {
    current: number;     // 1-indexed current question
    total: number;       // total questions for this project type
  };
  generationProgress?: {
    completed: number;
    total: number;
  };
}

type WizardStep =
  | "modeSelection"
  | "projectSetup"
  | "photoUpload"
  | "questions"
  | "authGate"
  | "generation"
  | "preview";
```

### 9.2 Progress Calculation Logic

```typescript
function calculateProgress(
  step: WizardStep,
  questionProgress?: { current: number; total: number },
  generationProgress?: { completed: number; total: number }
): number {
  switch (step) {
    case "modeSelection":
      return 15;
    case "projectSetup":
      return 30;
    case "photoUpload":
      return 45;
    case "questions":
      if (!questionProgress) return 45;
      const qRange = 75 - 45; // 30 percentage points
      const perQ = qRange / questionProgress.total;
      return 45 + questionProgress.current * perQ;
    case "authGate":
      return 80;
    case "generation":
      if (!generationProgress) return 80;
      const gRange = 95 - 80; // 15 percentage points
      const perTrade = gRange / generationProgress.total;
      return 80 + generationProgress.completed * perTrade;
    case "preview":
      return 100;
    default:
      return 5; // endowed progress
  }
}

function getPhaseLabel(step: WizardStep): string {
  switch (step) {
    case "modeSelection":
    case "projectSetup":
      return "Your Project";
    case "photoUpload":
      return "Your Space";
    case "questions":
      return "Your Plans";
    case "authGate":
    case "generation":
    case "preview":
      return "Your Scope";
  }
}
```

### 9.3 Framer Motion Implementation

```tsx
import { motion, AnimatePresence } from "framer-motion";

function WizardProgress({
  currentStep,
  questionProgress,
  generationProgress,
}: WizardProgressProps) {
  const progress = calculateProgress(
    currentStep,
    questionProgress,
    generationProgress
  );
  const phaseLabel = getPhaseLabel(currentStep);
  const showQuestionCounter = currentStep === "questions" && questionProgress;

  return (
    <div className="w-full space-y-2">
      {/* Progress Bar */}
      <div className="w-full h-1 sm:h-1.5 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full"
          initial={{ width: "5%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>

      {/* Phase Label + Question Counter */}
      <div className="text-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={phaseLabel}
            className="text-sm font-medium text-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {phaseLabel}
          </motion.p>
        </AnimatePresence>

        <AnimatePresence>
          {showQuestionCounter && (
            <motion.p
              className="text-xs text-muted-foreground"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.15 }}
            >
              Question {questionProgress.current} of {questionProgress.total}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
```

### 9.4 Generation Step Enhancement

During the generation step (Step 6), the progress bar should include a subtle animated stripe pattern to make the wait feel shorter. This leverages the backwards-moving ribbing research from Carnegie Mellon.

```tsx
// During generation step, add animated stripes
{currentStep === "generation" && (
  <motion.div
    className="absolute inset-0 rounded-full overflow-hidden"
    style={{
      background: `repeating-linear-gradient(
        -45deg,
        transparent,
        transparent 8px,
        rgba(255,255,255,0.1) 8px,
        rgba(255,255,255,0.1) 16px
      )`,
      backgroundSize: "200% 100%",
    }}
    animate={{
      backgroundPosition: ["0% 0%", "-200% 0%"],
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      ease: "linear",
    }}
  />
)}
```

### 9.5 What Each Step Looks Like

```
STEP 1 -- Mode Selection:
  [===                              ] 15%
              Your Project

STEP 2 -- Project Setup:
  [=========                        ] 30%
              Your Project

STEP 3 -- Photo Upload:
  [==============                   ] 45%
               Your Space

STEP 4 -- Questions (Q5 of 12, kitchen):
  [===================              ] 57.5%
               Your Plans
            Question 5 of 12

STEP 4 -- Questions (Q12 of 12, kitchen):
  [========================         ] 75%
               Your Plans
           Question 12 of 12

STEP 5 -- Auth Gate:
  [==========================       ] 80%
               Your Scope

STEP 6 -- Generating (3 of 7 trades done):
  [============================     ] 86.4%
               Your Scope
       Generating electrical scope...

STEP 7 -- Preview:
  [=================================] 100%
               Your Scope
```

---

## Key Research Sources

| Source | Finding | Application |
|--------|---------|-------------|
| Nunes & Dreze (2006) | Endowed progress effect -- pre-filled stamps increase completion rate | Start progress bar at 5% |
| Clark Hull (1932) / Kivetz et al. (2006) | Goal gradient effect -- motivation increases as goal nears | Front-load progress so users reach 50%+ early |
| Zeigarnik (1927) | Incomplete tasks create cognitive tension driving completion | Always show progress to leverage this tension |
| Irrational Labs (meta-analysis, 32 experiments) | Progress bars backfire when early progress is slow | Weight early steps heavily so bar jumps forward fast |
| Irrational Labs (time estimate experiment) | Showing "10 minutes" deterred completion | Do not show estimated time |
| Harrison et al. (Carnegie Mellon, 2007) | Backwards-moving ribbings make bars feel faster | Add animated stripe during generation wait |
| Research on progress bar pulsation | Increasing pulsation rate reduces perceived duration | Use ease-out transitions on bar fill |
| SurveyMonkey (internal testing) | Top-positioned bars increased drop-off vs bottom | Position bar at top but keep it thin and subtle |
| Material Design guidelines | Use dots for <5 steps, bars for many steps | Use bar (not dots) for 7-step flow |
| Baymard Institute (checkout research) | Step structure matters less than per-step content | Focus on reducing friction within each step |
| Miller (1956) | Humans chunk information into 3-5 groups | Group 7 steps into 4 phases |
| USWDS (U.S. Web Design System) | Show step totals for transparency | Show question count within questions step |

---

## Summary of Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Primary indicator | Weighted progress bar | Best for mobile, handles sub-steps, supports illusion techniques |
| Secondary indicator | Phase label (text) | Provides semantic context without numbers |
| Tertiary indicator | Question counter (within Step 4 only) | Prevents "stuck" feeling during longest step |
| Step grouping | 4 phases, no phase numbers | Reduces perceived complexity, provides meaning |
| Progress weighting | Front-loaded (early steps worth more) | Leverages sunk cost bias, prevents slow-start abandonment |
| Endowed progress | Start at 5% | Leverages endowed progress effect research |
| Remaining steps visible | Via bar (visual), NOT via step count text | Avoids "long road" deterrence while still showing progress |
| Time estimate | Not shown | Irrational Labs research shows this deters completion |
| Mobile treatment | Full-width thin bar, no dots | Space-efficient, touch-friendly, clear |
| Generation step | Animated stripes + real milestone updates | Reduces perceived wait time, shows real progress |

---

*This research document is ready for direct implementation by a developer. The component specification in Section 9 can be used as-is with the ScopeAI tech stack (Next.js + Tailwind CSS v4 + shadcn/ui + Framer Motion).*
