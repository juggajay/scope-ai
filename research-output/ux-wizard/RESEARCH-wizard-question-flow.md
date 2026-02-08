# Research: Question Flow Pacing & Interaction Design

**Section 6 of UX Research Series**
**Date:** February 2026
**Context:** ScopeAI question step (8-13 questions, tap-to-select, mobile-first)
**Target User:** Non-technical Australian homeowner, likely anxious about renovation costs

---

## Summary of Key Recommendations

| Decision | Recommendation | Confidence |
|----------|---------------|------------|
| Layout | One question per screen (not scrollable list) | High |
| Grouping | Lightweight section labels, not full-page headers | High |
| Pacing | Typeform-style focus with conversational micro-copy | High |
| Tooltips | Info icon with inline expand (not modal, not hover) | High |
| Skip vs Not Sure | "Not sure" as an answer option within the question | High |
| Review screen | Skip it. Offer clickable progress dots for edits | Medium |
| Tone | Friendly, second-person, short sentences | High |
| Back navigation | Back button + clickable progress dots | High |

---

## 1. One Question Per Screen vs Scrollable List

### The Research

The evidence strongly favours **one question per screen** for ScopeAI's use case, for three reasons:

**Completion quality:** SurveyMonkey research found that respondents were equally likely to complete surveys in both formats, but were **more likely to skip individual questions** in scrollable formats. For ScopeAI, every answer matters for scope accuracy, so skipped questions directly degrade output quality.

**Cognitive load:** Nielsen Norman Group's research on reducing form cognitive load confirms that when there is "less stuff on screen and only one choice to make, friction is reduced to a minimum." Our questions have 3-5 options each. Showing all 8-13 questions simultaneously means 30-60+ options visible at once, which overwhelms a non-technical user already anxious about making the "right" choice.

**Perceived speed:** Typeform's own data shows that the one-question-at-a-time format "feels more like a conversation, keeping users engaged and making it easier to follow." Their average completion rate is 47.3% compared to the industry average of 21.5% -- more than double. While this is not entirely attributable to the one-per-screen pattern, the conversational pacing is a significant factor.

**Mobile performance:** With 60%+ of ScopeAI traffic expected to be mobile, a scrollable list creates awkward interactions: users scroll past questions, lose context, and struggle to see which questions they have answered. One-per-screen fills the viewport naturally and each tap target gets full screen real estate.

**The counterargument:** Some research shows mobile users take *longer* to complete paged surveys due to the repeated tap of "Next." However, this applies to 40+ question surveys. For 8-13 questions, the total number of "Next" taps is negligible -- especially because our primary input is already a tap (selecting an option), not typing.

### Recommendation

**Use one question per screen with auto-advance.** When the user taps a single-select option, wait 400ms (showing a brief selection confirmation animation), then auto-advance to the next question. This eliminates the "Next" button overhead entirely for single-select questions. For multi-select questions, show a "Continue" button since the user needs to select multiple options.

### Component Pattern

```
QuestionFlow (parent)
  |-- ProgressDots (top, clickable for back-nav)
  |-- AnimatePresence (Framer Motion wrapper)
  |     |-- QuestionCard (slides in/out per question)
  |           |-- SectionLabel (lightweight, e.g. "Cooking")
  |           |-- QuestionText
  |           |-- WhyTooltip (expandable)
  |           |-- OptionList
  |           |     |-- OptionButton (single-select: tap = answer + auto-advance)
  |           |     |-- OptionButton (multi-select: tap = toggle, show Continue)
  |           |-- ContinueButton (multi-select only)
  |-- BackButton (bottom-left, visible from question 2 onward)
```

---

## 2. Question Grouping

### The Research

Nielsen Norman Group's research on cognitive load confirms that "grouping related fields into sections makes long forms feel more manageable" and "allows users to focus on one information category at a time." The Gestalt principle of common region applies: visual groupings help users predict what is coming and recall what they have answered.

However, full-page section dividers ("You're now entering the Cooking section") add steps without collecting data. For 8-13 questions, adding 3-4 section interstitials increases perceived length by 25-50% without benefit.

### Analysis of ScopeAI Question Sets

Looking at the actual kitchen question set (12 questions), a natural grouping emerges:

| Group | Questions | Label |
|-------|-----------|-------|
| Layout & Structure | layout_change, wall_removal | "Your Layout" |
| Cooking & Appliances | cooktop_type, oven_type, island_bench, rangehood, dishwasher | "Appliances" |
| Surfaces | benchtop_material | "Finishes" |
| Electrical | lighting, power_needs | "Lighting & Power" |
| Budget & Preferences | quality_tier, diy_interest | "Budget" |

For bathroom (13 questions):

| Group | Questions | Label |
|-------|-----------|-------|
| Layout & Structure | layout_change | "Your Layout" |
| Wet Area Fixtures | shower_type, shower_drain, bath, toilet_type, shower_niche | "Fixtures" |
| Vanity & Surfaces | vanity_type, tiling_extent | "Finishes" |
| Climate & Ventilation | heated_features, ventilation | "Comfort" |
| Electrical | lighting | "Lighting" |
| Budget & Preferences | quality_tier, diy_interest | "Budget" |

### Recommendation

**Use lightweight inline section labels, not full-page section dividers.** Display a small label above the question text when the user enters a new group. This creates a sense of structured progress without adding extra taps.

Implementation:
- Add a `group` field to each question in the question set data
- When the group changes between questions, show a subtle label transition
- The label sits above the question text: small, muted colour, medium weight
- Label transitions in with the question card -- not a separate screen

```tsx
// Example: lightweight section label
<motion.div className="text-sm font-medium text-muted-foreground mb-2">
  Appliances
</motion.div>
<h2 className="text-xl font-semibold">
  What type of cooktop will you have?
</h2>
```

The progress dots at the top should also reflect groups with subtle spacing between dot clusters, giving users a visual sense of sections without explicit navigation.

---

## 3. Pacing Tricks -- Making 12 Questions Feel Like 5

### Psychological Principles at Work

Typeform makes long forms feel short by exploiting several cognitive biases. These are directly applicable to ScopeAI:

**3.1 The Foot-in-the-Door Effect**

Start with the easiest, least threatening question. For kitchen, "Are you changing the kitchen layout?" is a good opener -- it is a straightforward question about what the user already knows. People who commit to answering one easy question are significantly more likely to complete the remaining questions (Freedman & Fraser, 1966; confirmed by multi-step form A/B testing showing 86% completion after step 1).

**Recommendation:** The question sets already do this well. Ensure the first question in every set is the broadest, least technical question.

**3.2 Completion Momentum (Zeigarnik Effect)**

People feel compelled to finish what they start. Progress indicators exploit this: once users see "3 of 12 answered," abandoning feels like wasted effort. Typeform's data shows that progress indicators can boost completion by 20-30%.

**Recommendation:** Use progress dots (not a percentage bar). Dots feel less intimidating than "25% complete" when you have 12 questions. Each filled dot provides a micro-reward. Consider using Framer Motion to animate the dot fill with a satisfying pop.

**3.3 Variable Speed Perception**

Questions that take 1 second to answer (single tap) feel like they "don't count" toward the total. Stack several fast questions in a row before a more considered one.

**Recommendation:** The question order should alternate: 2-3 fast single-select questions, then 1 multi-select or more considered question. The existing question sets already follow this pattern naturally.

**3.4 Auto-Advance Eliminates Dead Taps**

For single-select questions (which are 10 of 12 in the kitchen set), the user taps an option and the flow immediately advances. This means the user's action IS the navigation. Twelve single-select questions answered this way feel like 12 taps -- far faster than 12 questions + 12 "Next" button taps.

**Recommendation:** Implement auto-advance with a brief (300-400ms) selection confirmation animation:
1. User taps option
2. Option highlights with a scale + checkmark animation
3. Card slides out left, next card slides in from right
4. Total time: ~500ms from tap to next question visible

**3.5 Typeform's "6 Questions" Sweet Spot**

Typeform's data shows that forms with fewer than 10 questions get the highest completion, with 6 being the sweet spot. ScopeAI's range of 7-13 is within the acceptable zone, but the laundry set (7) will feel much lighter than the bathroom set (13).

**Recommendation:** For longer sets (bathroom at 13, kitchen at 12), consider whether any questions can be conditionally skipped. The existing `conditionalOn` field supports this. For example, if the user says "No bath," skip `bath_type` entirely. Also consider whether `diy_interest` (which only applies to Trade Manager mode) is already conditional -- it is, via `modeOnly`.

**3.6 Visual Richness (Future Enhancement)**

Typeform's data shows that forms with images or video see a **120.6% increase in completion rates**. The `QuestionOption` type already has an `imageUrl` field (marked as V2). When implemented, adding small icons or images to options (e.g., a photo of a freestanding vs built-in oven) will dramatically increase engagement.

**Recommendation for MVP:** Even without full images, use emoji or Lucide icons inline with option text. Example:
- "Gas -- keeping existing" with a flame icon
- "Induction" with a lightning bolt icon
- "Walk-in shower (frameless screen)" with a shower icon

These micro-visuals break the text monotony and speed up scanning.

---

## 4. Tooltip Patterns -- "Why Are We Asking This?"

### The Problem

Every question in ScopeAI has a `why` field explaining why the information matters for the scope. This is critical for building trust with anxious homeowners who want to understand the process. However, tooltips must not interrupt the flow.

### Pattern Comparison

| Pattern | Pros | Cons | Mobile-Friendly |
|---------|------|------|-----------------|
| Hover popover | Discoverable, non-intrusive | Does not work on mobile (no hover) | No |
| Info icon + modal | Works on mobile, clear | Breaks flow, feels heavy for simple text | Partial |
| Info icon + inline expand | Works on mobile, keeps context, lightweight | Uses vertical space | Yes |
| Always visible | No extra interaction needed | Adds visual noise, makes questions feel longer | Partial |
| Bottom sheet (mobile) | Native mobile feel | Inconsistent across platforms | Mobile only |

### Analysis for ScopeAI

The `why` text is typically 1-2 sentences long (e.g., "Layout changes affect plumbing, electrical, and potentially structural work. Same-layout renovations are significantly simpler and cheaper."). This is too long for a hover tooltip but too short for a full modal.

Smashing Magazine's research on mobile tooltips recommends against hover-based patterns entirely on mobile, and suggests that "essential information should be visible, not hidden behind interactions." However, showing all `why` text always would make each question card significantly taller and more intimidating.

### Recommendation

**Use an info icon with inline expand, positioned below the question text.** The pattern:

1. Small info icon (Lucide `HelpCircle` or `Info`) + text link "Why do we ask?" appears below the question text
2. On tap, the `why` text smoothly expands inline (Framer Motion `AnimatePresence` with height animation)
3. Text appears in a muted, slightly smaller font
4. Tapping again (or tapping elsewhere) collapses it
5. The expanded state does NOT persist between questions -- each question starts collapsed

```tsx
// Component: WhyTooltip
<button
  onClick={() => setExpanded(!expanded)}
  className="flex items-center gap-1.5 text-sm text-muted-foreground
             hover:text-foreground transition-colors mt-2"
>
  <Info className="h-4 w-4" />
  <span>{expanded ? "Got it" : "Why do we ask?"}</span>
</button>

<AnimatePresence>
  {expanded && (
    <motion.p
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="text-sm text-muted-foreground mt-2 leading-relaxed"
    >
      {question.why}
    </motion.p>
  )}
</AnimatePresence>
```

**Why not a modal?** Modals break flow. The user has to dismiss them, which requires cognitive effort and introduces a pattern (tap icon, read, tap close) that is heavier than (tap text, read inline, continue). Given that our primary action is tapping an answer option, the tooltip should not compete for attention.

**Why not always visible?** Testing the kitchen set: showing the `why` text for every question would add approximately 20-30% more vertical content. On mobile, this means more scrolling within each card, which undermines the "one question per screen" principle.

---

## 5. Skip vs "Not Sure"

### The Core Question

Should users be able to skip questions entirely (a UI-level "Skip" button), or should "Not sure" / "Not decided yet" be one of the answer options within the question?

### Analysis

| Approach | UX Implication | Data Implication |
|----------|---------------|-----------------|
| Skip button | Suggests the question is optional. User feels no obligation. Fast to proceed. | No data captured. AI must use `defaultIfSkipped` or infer. |
| "Not sure" option | Question feels required but has a safe exit. User still engages with the question. | Captures explicit "not sure" signal. AI knows user is undecided vs simply didn't care. |
| Both | Maximum flexibility but visual clutter. Two ways to do the same thing. | Confusing data: is "skipped" different from "not sure"? |

### Research Insights

SurveyMonkey research confirms that "people answer questions more quickly, provide more accurate information, and are less frustrated if they see a response option that matches their answer." For a homeowner who genuinely does not know what cooktop type they want, "Not sure yet" IS their answer. It is not a skip -- it is meaningful data that tells the AI to use sensible defaults and flag the item as TBC in the scope.

Making questions optional (via a Skip button) correlates with higher completion rates but lower data quality. For ScopeAI, data quality directly affects scope quality, which affects customer satisfaction and revenue.

### Current State of ScopeAI Questions

The existing question sets already handle this well:
- 8 of 12 kitchen questions include a "Not sure" / "Not decided yet" / "Not sure yet" option
- All questions have a `defaultIfSkipped` value for fallback
- Only `quality_tier` and some fixture questions lack a "Not sure" option (because a decision is needed for budget calibration)

### Recommendation

**"Not sure" as an answer option. No separate Skip button.**

Rationale:
1. **It is truthful data.** "Not sure" tells the AI something different from a skipped question. The AI can flag this item as "to be confirmed" in the scope, which is useful information for the homeowner.
2. **It respects the user.** "Not sure" says "your uncertainty is valid." A Skip button says "this question is not important," which contradicts the tooltip that just explained *why* it is important.
3. **It maintains pacing.** A "Not sure" tap triggers the same auto-advance as any other option. A Skip button is a different UI element in a different location, breaking the rhythm.
4. **It simplifies the UI.** One set of option buttons per question. No secondary action. Clean.

**Implementation detail:** For questions that currently lack a "Not sure" option (like `quality_tier`), consider whether one should be added. For budget questions, "Not sure" is acceptable -- the AI can default to mid-range. For DIY interest, "Maybe -- tell me what's safe to DIY" already serves this role.

**Exception:** If a question is conditional (`conditionalOn`) and the condition is not met, the question should be silently skipped -- not shown with a "Not sure" option. This is already handled by the data model.

---

## 6. Review/Summary Screen

### The Question

After the user answers all 8-13 questions, should there be a summary screen showing all their answers with the ability to change them before proceeding?

### Arguments For

- **Builds confidence.** Anxious users can verify their choices before committing.
- **Catches mistakes.** A user who accidentally tapped the wrong cooktop type can correct it.
- **Wizard best practice.** NNGroup recommends presenting "a summary of the choices they made throughout the wizard near the end of the process."

### Arguments Against

- **Adds friction.** One more screen between the user and their scope.
- **Low edit rate.** For tap-to-select questions (not free text), errors are rare. Users see their options and choose deliberately. Summary screens in form wizards typically see less than 5% of users making changes.
- **Undermines pacing.** The psychological momentum built by 12 quick taps dissipates when the user is asked to review a wall of text.
- **Our questions have safe defaults.** Even if a user made a suboptimal choice, the `defaultIfSkipped` values are sensible. The scope will not be wildly wrong.
- **Answers are not irreversible.** ScopeAI is not a checkout. The user is not spending money at this step. They are generating a scope. If the scope feels wrong, the problem is self-evident.

### Recommendation

**Do not show a summary screen.** Instead, use two lighter mechanisms:

1. **Clickable progress dots** allow the user to tap any previous dot to jump back to that question, review their answer (shown as the selected option), and either change it or tap forward again. This is available at any time during the flow, not just at the end.

2. **A brief confirmation before generation.** After the last question, show a single transition screen: "Ready to generate your scope?" with a summary count ("Based on your 12 answers and 5 photos, we'll create scopes for electrical, plumbing, carpentry, tiling, painting, and demolition"). This is NOT a full answer review -- it is a confidence-building moment that transitions into the generation step.

```
[Last question answered, auto-advance to:]

"We're ready to build your scope."

Kitchen renovation -- Paddington, NSW
Based on 5 photos and 12 answers

Trades we'll cover:
  Electrical | Plumbing | Carpentry | Tiling | Painting | Demolition

[Generate My Scope]       [Review Answers (link)]
```

The "Review Answers" link is secondary (text link, not a button). Users who want the full review can access it. Most users will tap "Generate My Scope" immediately.

---

## 7. Conversational Tone

### The Problem

Questions can feel like an interrogation: cold, clinical, demanding. For an anxious homeowner, this amplifies stress. But questions also need to be clear and concise -- we are not building a chatbot.

### Typeform's Conversational Data

Typeform's research shows that forms using "exclusive" and personal language see 25% higher completion rates. Their data also shows that using a number in the welcome content ("Answer 12 quick questions") boosts completion by 7% because it sets expectations.

### Tone Analysis of Current ScopeAI Questions

The existing questions are well-written. Most are short and conversational:
- "What type of cooktop will you have?" (natural, future-tense, assumes positive outcome)
- "Dishwasher included?" (very short, casual)
- "Rangehood type?" (efficient, no fluff)

However, some are more clinical:
- "What quality level are you targeting?" (the word "targeting" is slightly corporate)
- "Any specific power point needs?" (functional but flat)

### Recommendations for Conversational Tone

**7.1 Use second-person, future tense.** Frame questions as if describing their future kitchen, not interrogating their current plans.

| Before | After |
|--------|-------|
| "What quality level are you targeting?" | "What quality level suits your budget?" |
| "Any specific power point needs?" | "What power points do you want?" |

**7.2 Add micro-copy between sections.** When the group label changes (e.g., from "Layout" to "Appliances"), add a one-line transitional sentence:

```
[Section: Appliances]
"Now let's talk about what goes in your kitchen."
```

```
[Section: Budget]
"Nearly done. Last couple of questions."
```

These transitional phrases are NOT questions. They are brief, friendly moments that break up the flow and create conversational rhythm.

**7.3 Use the welcome screen to set expectations.**

Typeform data shows that telling users the question count upfront improves completion by 7%. Before the first question, show:

```
"12 quick questions about your kitchen."
Most people finish in under 2 minutes.
Your answers help us build accurate trade scopes.

[Let's go]
```

**7.4 Affirm choices with micro-feedback.** When a user selects an option, before auto-advancing, briefly show a micro-affirmation:

- Tap "Induction" -> checkmark animation + brief "Got it" text (200ms)
- Tap "Not sure yet" -> checkmark animation + "No worries, we'll use a smart default" (300ms)

This is subtle and fast. It should not slow the flow -- the affirmation appears simultaneously with the selection animation, not sequentially.

**7.5 Keep the "why" tooltips warm and practical.**

The current `why` text is excellent. It is specific, practical, and explains the cost/scope impact. Maintain this standard. The tone should be "helpful friend who happens to know construction" -- not "building inspector" and not "chatbot."

Good examples from the current data:
- "Layout changes affect plumbing, electrical, and potentially structural work. Same-layout renovations are significantly simpler and cheaper."
- "Planning power points now avoids the frustration of not having enough outlets where you need them. It's cheap to add during renovation but expensive to retrofit later."

These read like advice from someone experienced, not like a disclaimer.

---

## 8. Back Navigation Within Questions

### The Research

Baymard Institute found that **59% of sites get back-button UX wrong** in multi-step forms. Users expect the browser back button AND an in-page back button to return them to the previous question -- not to the previous page entirely (which would lose all their answers).

NNGroup recommends that wizards should "allow users to see an overview of steps and select any completed steps to revisit them," particularly when forms are more than 5 steps.

### Recommendation

Implement three navigation mechanisms:

**8.1 In-page Back Button**

A left-arrow button in the bottom-left corner, visible from question 2 onward. Tapping it slides the current question out to the right and the previous question in from the left (reverse of the forward animation). The previous answer is preserved and shown as selected.

```tsx
<button
  onClick={goToPrevious}
  className="flex items-center gap-1 text-sm text-muted-foreground"
>
  <ArrowLeft className="h-4 w-4" />
  Back
</button>
```

**8.2 Clickable Progress Dots**

The progress indicator at the top consists of dots representing each question. Answered questions are filled (teal). The current question pulses subtly. Future questions are outlined/grey.

Users can tap any filled dot to jump directly to that question. This is particularly useful if they want to change question 3 while on question 10 -- they do not need to tap "Back" seven times.

When a user jumps to a previous question:
- Their existing answer is shown as selected
- They can change it by tapping a different option
- After changing (or deciding not to), they can either tap forward through subsequent questions or tap the furthest filled dot to jump back to where they were

```tsx
// ProgressDots component
<div className="flex items-center gap-2 px-4 py-3">
  {questions.map((q, i) => (
    <button
      key={q.id}
      onClick={() => i <= currentIndex && goToQuestion(i)}
      className={cn(
        "h-2.5 w-2.5 rounded-full transition-all duration-200",
        i < currentIndex && "bg-primary cursor-pointer hover:scale-125",
        i === currentIndex && "bg-primary scale-125 animate-pulse",
        i > currentIndex && "bg-border cursor-default"
      )}
      disabled={i > currentIndex}
      aria-label={`Question ${i + 1}: ${q.question}`}
    />
  ))}
</div>
```

**Design refinement:** Group the dots with subtle spacing to reflect question groups (see Section 2). This gives the progress bar a visual rhythm: three dots, small gap, five dots, small gap, two dots, small gap, two dots.

**8.3 Browser Back Button Interception**

Use `history.pushState` to add each question as a history entry. When the user presses the browser back button, they go to the previous question -- not back to the photo upload step. This is critical for mobile users who instinctively use the device back button.

```tsx
useEffect(() => {
  // Push a new history state for each question
  window.history.pushState({ questionIndex: currentIndex }, "");

  const handlePopState = (e: PopStateEvent) => {
    if (e.state?.questionIndex !== undefined) {
      goToQuestion(e.state.questionIndex);
    }
  };

  window.addEventListener("popstate", handlePopState);
  return () => window.removeEventListener("popstate", handlePopState);
}, [currentIndex]);
```

---

## 9. Animation & Transition Specifications

### Framer Motion Implementation

The transitions between questions should feel smooth and quick. Based on Framer Motion best practices for multi-step wizards:

**9.1 Forward Transition (next question)**
```tsx
const variants = {
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

<AnimatePresence mode="wait" custom={direction}>
  <motion.div
    key={currentIndex}
    custom={direction}
    variants={variants}
    initial="enter"
    animate="center"
    exit="exit"
    transition={{ duration: 0.25, ease: "easeInOut" }}
  >
    <QuestionCard question={questions[currentIndex]} />
  </motion.div>
</AnimatePresence>
```

**9.2 Option Selection Animation**
```tsx
// When user taps an option
<motion.button
  whileTap={{ scale: 0.97 }}
  animate={isSelected ? {
    scale: [1, 1.02, 1],
    borderColor: "var(--primary)",
  } : {}}
  transition={{ duration: 0.2 }}
  className={cn(
    "w-full text-left p-4 rounded-lg border-2 transition-colors",
    isSelected
      ? "border-primary bg-primary/5"
      : "border-border hover:border-primary/50"
  )}
>
  <div className="flex items-center justify-between">
    <span>{option.label}</span>
    {isSelected && (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 25 }}
      >
        <Check className="h-5 w-5 text-primary" />
      </motion.div>
    )}
  </div>
</motion.button>
```

**9.3 Timing**
- Option selection highlight: 200ms
- Auto-advance delay (after single-select): 400ms
- Slide transition between questions: 250ms
- Total perceived time per question: ~650ms + user think time
- For 12 questions with ~3 seconds average think time: ~44 seconds total interaction time

---

## 10. Complete Component Architecture

### File Structure

```
components/create/questions/
  |-- QuestionFlow.tsx          # Parent orchestrator (state, navigation, animations)
  |-- ProgressDots.tsx          # Clickable progress indicator with group spacing
  |-- QuestionCard.tsx          # Single question display (text, tooltip, options)
  |-- OptionButton.tsx          # Individual option (handles select state, animations)
  |-- WhyTooltip.tsx            # Expandable "why do we ask" section
  |-- SectionLabel.tsx          # Lightweight group transition label
  |-- QuestionIntro.tsx         # Welcome screen ("12 quick questions...")
  |-- GeneratePrompt.tsx        # Final screen ("Ready to generate?")
```

### State Management

```tsx
// QuestionFlow state
interface QuestionFlowState {
  currentIndex: number;
  direction: 1 | -1;              // 1 = forward, -1 = backward
  answers: Record<string, string | string[]>;
  expandedTooltip: boolean;
}
```

### Data Flow

```
QuestionFlow
  |-- Receives: questions[] (filtered by mode, conditionalOn)
  |-- Manages: currentIndex, answers, direction
  |-- Renders: AnimatePresence > QuestionCard
  |-- On answer: updates answers state, triggers auto-advance (single) or waits (multi)
  |-- On complete: calls parent callback with all answers
  |-- Navigation: ProgressDots click, Back button, browser back
```

---

## 11. Answering the Key Question

> **For 8-13 tap-to-answer questions, what format drives the highest completion with the least fatigue?**

The answer is a **one-question-per-screen format with auto-advance on single-select, lightweight section labels, clickable progress dots for navigation, inline expandable tooltips, and "Not sure" as an answer option rather than a separate skip button.**

This format works because:

1. **8-13 questions is within the engagement sweet spot.** Typeform data shows highest completion under 10, acceptable up to 15. Our range sits in the productive zone.

2. **Tap-to-answer with auto-advance makes each question feel instantaneous.** The user's primary action (choosing an option) doubles as navigation. No redundant "Next" taps.

3. **One-per-screen maximises mobile viewport.** Options get full-width tap targets. No scrolling confusion. Each question gets full attention.

4. **Lightweight section labels create progress perception without adding steps.** The user unconsciously tracks "I'm in Appliances now, so I'm past Layout."

5. **"Not sure" preserves data quality without creating anxiety.** The user never feels forced to guess -- but they also never feel like they are being unhelpful.

6. **The 400ms auto-advance delay creates rhythm.** Tap, brief confirmation, slide. Tap, brief confirmation, slide. This rhythm is satisfying and fast.

7. **Clickable progress dots eliminate the need for a review screen.** Users can jump back any time, which means they never need to see all answers at once.

**Expected completion time:** Under 90 seconds for most users. Under 2 minutes for users who expand tooltips.

**Expected completion rate:** Based on Typeform benchmarks (47% average) and our format advantages (shorter than average, all tap-to-select, high motivation since user has already uploaded photos), we should target 70-80% completion from users who reach the question step.

---

## Sources

### Form Design & Completion Research
- [SurveyMonkey: Pros and Cons of Scrolling and Multiple Pages in Surveys](https://www.surveymonkey.com/curiosity/pros-cons-of-scrolling-and-multiple-pages-in-surveys/)
- [Smashing Magazine: Better Form Design -- One Thing Per Page](https://www.smashingmagazine.com/2017/05/better-form-design-one-thing-per-page/)
- [Smashing Magazine: Creating An Effective Multistep Form for Better UX](https://www.smashingmagazine.com/2024/12/creating-effective-multistep-form-better-user-experience/)
- [NNGroup: Scrolling and Attention](https://www.nngroup.com/articles/scrolling-and-attention/)
- [NNGroup: 4 Principles to Reduce Cognitive Load in Forms](https://www.nngroup.com/articles/4-principles-reduce-cognitive-load/)
- [NNGroup: Wizards -- Definition and Design Recommendations](https://www.nngroup.com/articles/wizards/)
- [Tinyform: 2025 Mobile Form Statistics & UX Trends](https://tinyform.com/post/mobile-form-statistics-ux-trends)

### Multi-Step Form Patterns
- [Growform: Must-Follow UX Best Practices for Multi Step Forms](https://www.growform.co/must-follow-ux-best-practices-when-designing-a-multi-step-form/)
- [Zuko: Single Page or Multi-Step Form](https://www.zuko.io/blog/single-page-or-multi-step-form)
- [Heyflow: Multi-step vs Single-step Forms](https://heyflow.com/blog/multi-step-vs-single-step-forms/)
- [Designlab: How to Design Multi-Step Forms](https://designlab.com/blog/design-multi-step-forms-enhance-user-experience)
- [Reform: 7 Tips for Reducing Cognitive Load in Forms](https://www.reform.app/blog/7-tips-for-reducing-cognitive-load-in-forms)

### Typeform Data & Statistics
- [Typeform: Average Completion Rate](https://help.typeform.com/hc/en-us/articles/360029615911-What-s-the-average-completion-rate-of-a-typeform)
- [Typeform Data Report on Completion Rates](https://www.prnewswire.com/news-releases/new-typeform-report-reveals-how-marketers-can-drive-higher-form-completion-rates-302041979.html)
- [Typeform: Transform Quiz Engagement with Effective Question Design](https://www.typeform.com/blog/response-rates-effective-question-phrasing)
- [Typeform: Create Forms That Click](https://www.typeform.com/blog/create-better-online-forms)
- [Feathery: 150 Online Form Statistics](https://www.feathery.io/blog/online-form-statistics)

### Tooltip Design
- [Smashing Magazine: Designing Better Tooltips for Mobile User Interfaces](https://www.smashingmagazine.com/2021/02/designing-tooltips-mobile-user-interfaces/)
- [LogRocket: Designing Better Tooltips for Improved UX](https://blog.logrocket.com/ux-design/designing-better-tooltips-improved-ux/)
- [Formsort: Designing Effective Tooltips for Signup Flows](https://formsort.com/article/tooltips-design-signup-flows/)
- [Cieden: Tooltip UX Issues and When to Avoid](https://cieden.com/book/atoms/tooltip/tooltip-ux-issues)

### Wizard & Navigation Patterns
- [Baymard Institute: 4 Design Patterns That Violate Back Button Expectations](https://baymard.com/blog/back-button-expectations)
- [Smashing Magazine: Designing A Better Back Button UX](https://www.smashingmagazine.com/2022/08/back-button-ux-design/)
- [Eleken: Wizard UI Pattern -- When to Use and How to Get It Right](https://www.eleken.co/blog-posts/wizard-ui-pattern-explained)
- [PatternFly: Wizard Design Guidelines](https://www.patternfly.org/components/wizard/design-guidelines/)

### Conversational UX & Tone
- [8 Principles for Conversational UX Design](https://www.bryanlarson.ca/blog/2025/7/20/8-principles-for-conversational-ux-design)
- [Conversational UX Handbook 2025](https://medium.com/@avigoldfinger/the-conversational-ux-handbook-2025-98d811bb6fcb)
- [Raw Studio: Conversational UX -- From Chatbots to UX Design](https://raw.studio/blog/conversational-ux-from-chatbots-to-ux-design/)

### Conversion & Friction
- [CXL: Adding Friction to Lead Gen Form Increased Conversion by 20%](https://cxl.com/blog/increase-conversions-lead-gen-forms/)
- [Venture Harbour: 5 Studies on Form Length and Conversion Rates](https://ventureharbour.com/how-form-length-impacts-conversion-rates/)
- [Laws of UX: Cognitive Load](https://lawsofux.com/cognitive-load/)

### Animation Implementation
- [BuildUI: Framer Motion Multistep Wizard Recipe](https://buildui.com/courses/framer-motion-recipes/multistep-wizard)
- [OpenReplay: Multi-step Forms with Transition Effects in React](https://blog.openreplay.com/multi-step-forms-with-transition-effects-in-react/)
