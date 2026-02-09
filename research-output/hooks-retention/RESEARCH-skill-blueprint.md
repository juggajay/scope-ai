# Hooks & Retention Skill Blueprint

**Purpose:** Developer reference for building features that strengthen engagement, conversion, and retention in ScopeAI. This is the synthesis of 7 research files covering Nir Eyal's Hook Model and Casey Winters' Retention Loops, adapted for a low-frequency, high-stakes, one-time-purchase product.

**How to use this:** Before building any user-facing feature, check the relevant checklist in Section 2. When implementing, pull from the pattern library in Section 3. When reviewing, scan the anti-patterns in Section 4.

---

## 1. Decision Framework

Before adding any engagement, retention, or growth mechanic, run through these questions in order. If you answer "no" to any gate question, stop and redesign.

### Gate 1: Does This Reduce Anxiety or Add It?

ScopeAI users are anxious homeowners making $15K-$150K decisions. Every feature must reduce anxiety, never create it.

- Does this feature make the user feel MORE confident about their renovation? --> proceed
- Does this feature create pressure, urgency, or FOMO? --> redesign
- Would a stressed homeowner feel helped or manipulated? --> be honest

### Gate 2: Does This Strengthen an Existing Loop?

Map the feature to one of the identified loops. If it does not strengthen any loop, it is complexity without compounding value.

| Loop Category | Loops |
|---------------|-------|
| Acquisition | SEO content, tradie referral (PDF branding), word-of-mouth, social proof |
| Engagement | Progress + sunk cost, curiosity gap, personalisation |
| Retention | Multi-room, renovation lifecycle, update/re-engagement |
| Monetisation | Tier upsell, referral-revenue, content-commerce |

Ask: "Which loop does this feature serve, and what is the feedback mechanism?"

### Gate 3: The Regret Test

> "If the user knew everything about this feature -- the persuasion techniques, the data collected, the intended business outcome -- would they still use it? Would they regret it afterward?"

If the answer is "they'd feel tricked," kill the feature.

### Gate 4: Is This the Simplest Version?

Low-frequency products get one shot per user. Complexity kills conversion. For every feature, ask:
- Can this be one fewer click?
- Can this be one fewer field?
- Can this be removed entirely while still achieving the goal?

### Quick Decision Tree

```
Is this feature user-facing?
  |
  YES --> Does it reduce user anxiety? (Gate 1)
  |         NO  --> STOP. Redesign.
  |         YES --> Does it strengthen a loop? (Gate 2)
  |                   NO  --> STOP. Likely unnecessary complexity.
  |                   YES --> Does it pass the regret test? (Gate 3)
  |                             NO  --> STOP. Dark pattern.
  |                             YES --> Is it the simplest version? (Gate 4)
  |                                       NO  --> Simplify first.
  |                                       YES --> BUILD IT.
  |
  NO (backend/infrastructure) --> Does it enable a loop? --> BUILD IT.
```

---

## 2. Checklists Per Feature Type

### 2.1 Wizard Step Component

Before shipping any wizard step, verify:

| # | Check | Why |
|---|-------|-----|
| 1 | **Trigger is clear.** User knows WHY they are on this step and what they get for completing it. | Conviction Loop: each step must promise a reward for the effort. |
| 2 | **Action is minimal.** Fewest possible taps/fields. Single-select auto-advances. No free-text unless essential. | Fogg model: ability > motivation. Reduce friction. |
| 3 | **Progress is visible.** Progress bar reflects this step's weight. User sees forward momentum. | Endowed progress + goal gradient. Front-load perceived progress. |
| 4 | **Escape hatch exists.** "Not sure yet" on every question. Back button works. Data persists on navigate-away. | Reduces decision regret fear. Anxious users need reversibility. |
| 5 | **Reward is immediate.** Step completion gives visible feedback -- progress bar spring, micro-copy ("Great photos!"), or analysis result. | Progressive reward: each step delivers something, not just takes. |
| 6 | **Investment is captured.** This step's data is saved (localStorage or Convex) and feeds future personalisation. | IKEA effect + sunk cost. Data makes abandonment costly. |
| 7 | **PostHog event fires.** `wizard_step_completed` with `step`, `stepName`, `durationSeconds`, `projectType`. | Funnel measurement. Can't fix what you can't see. |

### 2.2 Email / Notification

Before sending any email, verify:

| # | Check | Why |
|---|-------|-----|
| 1 | **Trigger type is identified.** Is this re-engagement (abandoned funnel), transactional (scope ready), lifecycle (check-in), or cross-sell (second room)? | Different trigger types require different tone and timing. |
| 2 | **Timing is respectful.** No email within 24h of another. Max 7 emails across entire user lifecycle. | Low-frequency product. Over-emailing = instant unsubscribe. |
| 3 | **Content is personalised.** References their project type, suburb, photo count, or specific scope details. | Generic emails feel like spam. Personal details prove you know their project. |
| 4 | **Action path is one click.** Deep link to exact page they need (`/create?step=N&resume=PROJECT_ID`). | Every click between email and value is a drop-off point. |
| 5 | **Tone is helpful, not pushy.** "Your scope is saved and ready" not "Don't miss out!" or "Complete your purchase!" | Anxious homeowners making expensive decisions. Pressure destroys trust. |
| 6 | **Stop condition is defined.** Under what condition do you stop sending? (User converts, 7 days pass, user unsubscribes.) | Prevents carpet-bombing. Every email cadence needs an off-switch. |
| 7 | **PostHog events track send, open, click.** `{type}_email_sent`, `{type}_email_clicked`. | Measure effectiveness. Kill underperforming emails. |

### 2.3 Preview / Paywall Component

Before building or modifying the scope preview, verify:

| # | Check | Why |
|---|-------|-----|
| 1 | **Curiosity gap exists.** User sees ENOUGH to know the scope is real and personalised, NOT enough to get the value. | Information Gap Theory: partial knowledge creates maximum curiosity. |
| 2 | **Value is demonstrated, not described.** Show a real sample item with specific technical detail, not "You'll get professional scope items." | Quality signal. The sample item is the most important element on the page. |
| 3 | **Numbers do the selling.** "53 scope items across 7 trades" creates natural "what are the other 51?" drive. | Quantitative curiosity. Item count is more persuasive than adjectives. |
| 4 | **No content blurring.** Content is either shown or not shown. No blur, no partial reveal with overlay. | PRD explicit rule. Blurring feels manipulative. Clean paywall. |
| 5 | **No artificial urgency.** No countdown timers, no "limited time" pricing, no "X people viewing." | Erodes trust. Anxious homeowners see through it and leave. |
| 6 | **Trust signals at payment moment.** Money-back guarantee, Stripe badge, AU Standards reference -- adjacent to CTA. | Reduces payment anxiety at the highest-friction point. |
| 7 | **Sample item is the most impressive one.** Not "Remove existing fixtures" but "Install 8x IC-4 rated dimmable downlights, 3000K, IP44 in wet areas." | The sample must make them think "I didn't know I needed that." |

### 2.4 Post-Purchase Feature

Before building any post-purchase feature, verify:

| # | Check | Why |
|---|-------|-----|
| 1 | **Stored value increases.** This feature adds data, customisation, or history the user would lose by switching. | Investment phase. More stored value = higher switching cost. |
| 2 | **Re-engagement path exists.** Feature gives user a reason to return (reference scope, update toggles, start second room). | Low-frequency product needs manufactured return triggers. |
| 3 | **Social investment is enabled.** Can the user share, send, or reference this feature with tradies/partner/friends? | Social commitment (Cialdini) creates external accountability + referral surface. |
| 4 | **Next purchase is seeded.** Feature naturally surfaces the multi-room opportunity without hard selling. | Multi-room is the primary revenue multiplier. Seed subtly. |
| 5 | **PDF branding is present.** Any downloadable output includes "Generated by ScopeAI.com.au" footer with URL. | Every PDF sent to a tradie is a passive acquisition channel. |
| 6 | **PostHog event tracks engagement depth.** `scope_item_toggled`, `scope_pdf_downloaded`, `scope_viewed` with `daysSincePurchase`. | Lifecycle engagement measurement. |

### 2.5 Growth Feature

Before building any growth or acquisition feature, verify:

| # | Check | Why |
|---|-------|-----|
| 1 | **Loop is identified.** This feature feeds which acquisition/referral loop specifically? | If it doesn't strengthen a loop, it doesn't compound. |
| 2 | **Feedback mechanism exists.** Output of this feature feeds back as input to the same or another loop. | Loops without feedback are just funnels. |
| 3 | **Metric proves it works.** Specific PostHog event + expected direction defined before building. | Build measurement into the feature, not after it. |
| 4 | **Cold-start viability assessed.** Does this feature work at current user count, or does it need critical mass? | Building features for 10,000 users when you have 50 is wasted effort. |
| 5 | **Capital efficiency considered.** Is this the cheapest way to achieve this growth outcome? | Bootstrapped product. SEO content > paid ads for long-term growth. |

---

## 3. Implementation Patterns

### Engagement Patterns (Wizard / Funnel)

---

#### P-01: Endowed Progress Bar

**Hook/Loop:** Progress + sunk cost loop (engagement)
**What:** Progress bar starts at 5% when user enters wizard, front-loaded so they hit 50% by mid-questions.
**Implementation:** `PROGRESS_WEIGHTS` in `lib/wizard/progress.ts` already implements this. Each step has a weight. Steps 0-2 (mode, setup, photos) consume 45% of the bar. Questions consume 30%. Auth + generation consume 20%. Payment is the final 5%.
**Metric:** `posthog.capture('wizard_step_completed', { step, progressPercent })` -- track correlation between perceived progress and drop-off rate.

---

#### P-02: Auto-Advance on Single Select

**Hook/Loop:** Action friction reduction (Fogg ability)
**What:** When user taps a single-select answer, auto-advance to next question after 300ms delay. No "Next" button for single-select questions.
**Implementation:** In `QuestionFlow.tsx`, on single-select answer selection, trigger `setTimeout(() => advanceToNext(), 300)`. Multi-select questions still show explicit "Continue." Delay gives visual feedback (selected state shows) without requiring extra tap.
**Metric:** `posthog.capture('question_answered', { questionId, autoAdvanced: true, durationMs })` -- compare completion rates with/without auto-advance.

---

#### P-03: Photo Upload Micro-Validation

**Hook/Loop:** Progressive reward (conviction building)
**What:** After user uploads 3+ photos, show a micro-celebration: "Nice photos! We can clearly see your kitchen layout." When photo analysis completes in background, subtly show: "We detected 6 items including [top fixture]."
**Implementation:** In `PhotoUpload.tsx`, conditionally render validation copy when `photos.length >= MIN_PHOTOS`. When `photoAnalysisStatus === "complete"`, show detected item count from `photoAnalysis.fixtures` array length. Keep it subtle -- a small text line below the upload grid, not a modal or toast.
**Metric:** `posthog.capture('photo_validation_shown', { photoCount, detectedItems })` -- track whether showing validation reduces step 2-to-3 drop-off.

---

#### P-04: "Not Sure" as Default Safety Net

**Hook/Loop:** Decision regret anxiety reduction
**What:** Every question has a "Not sure yet" option. Selecting it uses a sensible default in scope generation and flags the item as "TBC" in output. Never blocks progress.
**Implementation:** Already built into question sets (`lib/questions/*.ts`). Ensure every question definition includes a "not_sure" option. In generation prompts, "Not sure" answers should produce the most common/standard choice with a note: "Homeowner has not confirmed -- verify on site."
**Metric:** `posthog.capture('question_answered', { questionId, isNotSure: true })` -- high "Not sure" rates on specific questions indicate confusing question copy. Target: <20% "Not sure" overall.

---

#### P-05: Wizard State Persistence

**Hook/Loop:** Investment capture (sunk cost preservation)
**What:** All wizard state (steps 0-3) persists in localStorage. Steps 4+ persist in Convex. If user navigates away and returns, show resume prompt: "Welcome back! Your [kitchen] scope is 65% ready. Continue where you left off?"
**Implementation:** `WizardContext.tsx` manages state with `useLocalStorage` for anonymous steps. On return visit, detect existing state and render `ResumePrompt` component. Deep link from re-engagement emails should include `?resume=SESSION_ID`.
**Metric:** `posthog.capture('wizard_resumed', { fromStep, daysSinceLastVisit })` and `posthog.capture('wizard_resume_declined')` -- track resume vs start-fresh ratio.

---

### Conversion Patterns (Preview / Payment)

---

#### P-06: Item Count as Curiosity Anchor

**Hook/Loop:** Curiosity gap loop (engagement)
**What:** Display total scope item count prominently in preview: "Your kitchen renovation requires **53 scope items** across **7 trades**." The number itself creates curiosity -- "what are 53 items?"
**Implementation:** In `ScopePreview.tsx`, compute total item count from generated scope data. Show as a headline stat above the trade list. Each trade card shows its individual count (e.g., "Electrical: 11 items"). These numbers are the primary conversion driver.
**Metric:** `posthog.capture('preview_viewed', { tradeCount, totalItemCount })` -- track correlation between item count and payment conversion rate. Higher counts should correlate with higher conversion.

---

#### P-07: Best Sample Item Selection

**Hook/Loop:** Variable reward (quality demonstration)
**What:** The single sample item shown per trade must be the most specific, surprising, and technical item -- not a generic one. Choose items that reference the user's specific choices or photo analysis findings.
**Implementation:** In scope generation, flag each item with a `showcasePriority` score based on: (a) references user-specific answer, (b) references photo analysis finding, (c) includes AU standard reference, (d) includes specification detail. `ScopePreviewTrade` component selects the highest-priority item as the sample.
**Metric:** `posthog.capture('preview_sample_read', { tradeType, itemText, timeVisibleMs })` -- track which sample items correlate with highest conversion.

---

#### P-08: "Based on Your Inputs" Connection Line

**Hook/Loop:** Personalisation loop (perceived value)
**What:** In preview, show one "connection" line per trade linking their input to the scope output. Example: "Because you're switching from gas to induction, we've included a dedicated 32A circuit and gas disconnection."
**Implementation:** Generate these connection lines during scope generation (add to scope metadata). Each line references a specific answer or photo finding and its scope consequence. Show as italic text below the trade card header in `ScopePreview.tsx`.
**Metric:** `posthog.capture('connection_line_viewed', { tradeType })` -- track whether seeing explicit input-to-output connections increases conversion.

---

#### P-09: Trust Signal Adjacency

**Hook/Loop:** Action friction reduction (payment confidence)
**What:** Place trust signals directly adjacent to the payment CTA, not in a separate section. Show: money-back guarantee, Stripe secure badge, "Based on AS/NZS 3000" standards reference.
**Implementation:** In `PaywallGate.tsx` or pricing tier component, render trust signals in a row directly below the CTA button. Use small text, muted colour, and recognisable badge icons. The proximity to the payment action is what matters -- trust signals in the header don't reduce payment anxiety.
**Metric:** A/B test via PostHog feature flag: trust signals adjacent vs separate section. Track `payment_completed` rate between variants.

---

#### P-10: Tier Anchoring for Returning Users

**Hook/Loop:** Tier upsell loop (monetisation)
**What:** For users buying a second room, show their previous tier with a subtle note: "You chose Starter for your kitchen. Professional includes a coordination checklist -- useful when managing multiple rooms."
**Implementation:** In pricing UI, query `getProjectsByUser`. If previous projects exist, display previous tier selection. Add contextual copy explaining what the next tier adds specifically for multi-room scenarios. Never shame the lower tier -- present the upgrade as newly relevant context.
**Metric:** `posthog.capture('pricing_tier_selected', { tier, previousTier, projectNumber, isUpgrade })` -- track whether tier increases on subsequent purchases.

---

### Post-Purchase Patterns

---

#### P-11: PDF Branding Footer

**Hook/Loop:** Tradie referral loop (acquisition)
**What:** Every PDF page includes footer: "Generated by ScopeAI.com.au -- Get comparable renovation quotes in under 10 minutes." Cover page includes: "This scope was created so you can provide an accurate, comparable quote."
**Implementation:** In `@react-pdf/renderer` templates (`lib/pdf/styles.ts`), add `<Text>` element at bottom of every page. Include URL. Cover page gets tradie-facing copy explaining scope purpose. Consider QR code to `scopeai.com.au/for-tradies` in V2.
**Metric:** `posthog.capture('scope_pdf_downloaded', { tradeType, includesBranding: true })` -- indirect. Track tradie referral landings via UTM on PDF URL.

---

#### P-12: Scope Item Toggles as Investment

**Hook/Loop:** IKEA effect (investment + stored value)
**What:** Every scope item has a toggle (include/exclude). Toggled state persists and affects PDF output. Customised scope feels more "theirs" than raw AI output.
**Implementation:** Already built -- `updateScopeItem` Convex mutation, `ScopeItemToggle.tsx`. Ensure PDF regenerates from current toggle state. Show customisation summary: "3 items excluded, 2 custom items added."
**Metric:** `posthog.capture('scope_customised', { itemsExcluded, customItemsAdded })` -- hypothesis: users who customise have higher NPS and referral rate.

---

#### P-13: "What To Do Next" Guide Card

**Hook/Loop:** Overwhelm reduction + social investment seeding
**What:** After first scope view, show a brief action card: "1. Review each trade scope. 2. Toggle off items you don't need. 3. Download and send to 3 tradies. 4. Compare their quotes line by line."
**Implementation:** In scope view header, conditionally render guide card on first visit (track via `scope_viewed` count in PostHog or local flag). Card should be dismissible. The "send to 3 tradies" instruction sets up the social investment and tradie referral loop.
**Metric:** `posthog.capture('next_steps_card_shown')`, `posthog.capture('next_steps_card_dismissed')` -- track whether users who see the card download more PDFs.

---

#### P-14: Pre-filled Property Details for Second Room

**Hook/Loop:** Multi-room loop (retention + action friction reduction)
**What:** When a returning user starts a new project, pre-fill `propertySuburb`, `propertyState`, `propertyType`, `propertyAge` from their most recent project. Skip or auto-complete Step 1.
**Implementation:** In `WizardContext.tsx`, on mount check for existing projects via `getProjectsByUser` query. If found, pre-populate property fields. Show: "We've used your saved property details. [Edit]" to maintain user control. This reduces Step 1 from 4 fields to 0 fields for returning users.
**Metric:** `posthog.capture('property_prefilled', { fieldsReused })` and `posthog.capture('second_room_started', { daysSinceFirstPurchase })` -- track whether pre-fill increases second-room completion rate.

---

#### P-15: Post-Purchase Share Prompt

**Hook/Loop:** Word-of-mouth loop (acquisition)
**What:** After first PDF download, show: "Know someone renovating? Share ScopeAI." Provide copy-link, email, and SMS share options with pre-filled message.
**Implementation:** In scope view, after `scope_pdf_downloaded` fires for first time on a project, render share card. Pre-filled message: "I used ScopeAI to get professional renovation scopes for my [kitchen]. My quotes finally matched. Check it out: [referral link]." Include `?ref=USER_ID` for attribution.
**Metric:** `posthog.capture('referral_link_shared', { channel })` -- target 20%+ of paid users interact with share prompt.

---

#### P-16: Email Scope to Tradie Flow

**Hook/Loop:** Social investment + tradie referral loop
**What:** One-click "Email this scope" sends PDF to a tradie's email. Subject pre-filled: "[Kitchen] Scope of Works -- Please Quote Against These Items." Email includes brief ScopeAI explainer for the tradie.
**Implementation:** In scope view, "Email Scope" button triggers `emailScopeToTradie` Convex action (Resend). User enters tradie's email. The email body includes the PDF attachment plus a 2-line footer: "This scope was generated by ScopeAI to help homeowners get comparable quotes. Learn more: scopeai.com.au"
**Metric:** `posthog.capture('scope_emailed_to_tradie', { tradeType, tradieCount })` -- target 40%+ of paid users email at least one scope.

---

### Retention Patterns (Return + Referral)

---

#### P-17: Abandoned Wizard Re-engagement Email

**Hook/Loop:** Re-engagement trigger (owned, external)
**What:** 24h after wizard abandonment at Step 2+, email: "Your [kitchen] scope is 70% ready. Pick up where you left off." Max 3 emails: 24h, 72h, 7d. Then stop.
**Implementation:** Convex scheduled function (cron, daily). Query `projects WHERE status = "draft" AND _creationTime between 24h-72h ago`. Send via Resend. Include project type, suburb, photo count. Deep link to `/create?step=N&resume=PROJECT_ID`. No urgency language. Helpful tone only.
**Metric:** `posthog.capture('reengagement_email_clicked')` -- target 15%+ CTR, 5%+ complete-to-payment.

---

#### P-18: "Second Room" Prompt (Dashboard + Email)

**Hook/Loop:** Multi-room loop (retention)
**What:** Dashboard shows completed projects with "+ Add Another Room" card. Email 14 days post-purchase: "How's the [kitchen] going? When you're ready, your bathroom scope starts with your details saved."
**Implementation:** Account dashboard (`app/account/page.tsx`) renders project cards + "Add Another Room" CTA that links to `/create` with pre-fill flag. Convex scheduled function sends single email 14 days after `paidAt` timestamp. Exclude users who already started a second project.
**Metric:** `posthog.capture('second_room_started', { firstProjectType, daysSinceFirstPurchase })` -- target 10%+ of paid users start a second room within 60 days.

---

#### P-19: NPS Survey at Day 7

**Hook/Loop:** Word-of-mouth loop (measurement + testimonial capture)
**What:** 7 days after payment, show in-app NPS survey (1-10 scale). Scores 9-10 get a follow-up: "Would you mind sharing a sentence about your experience?" Captured testimonials feed the social proof loop.
**Implementation:** PostHog feature flag `nps_survey_enabled` controls display. Survey component renders on scope view when `daysSincePurchase >= 7` and `npsSubmitted === false`. Score 9-10 triggers testimonial request. Store in Convex for landing page display.
**Metric:** `posthog.capture('nps_score_submitted', { score })` -- target NPS > 60. Track correlation between NPS and referral behaviour.

---

#### P-20: Social Proof Counter (Conditional)

**Hook/Loop:** Social proof loop (acquisition)
**What:** Landing page shows "X+ renovation scopes generated" -- but only when count exceeds 50. Below 50, show standards-based trust instead: "Based on Australian Standards AS/NZS 3000, AS 3740, NCC 2022."
**Implementation:** Convex query `getPaidProjectCount`. Cached hourly via scheduled function. Landing page conditionally renders: if count < 50, show standards badges; if count >= 50, show rounded count. Rounding: 50-99 shows "50+", 100-499 shows "100+", 500+ shows "X00+".
**Metric:** `posthog.capture('landing_page_viewed', { socialProofCount })` -- A/B test via PostHog feature flag to measure conversion lift from social proof.

---

#### P-21: 30-Day Check-in Email

**Hook/Loop:** Renovation lifecycle loop + referral seeding
**What:** 30 days after purchase: "How's the [kitchen] renovation going? Your scope is always in your account." No upsell. Include quick 1-click satisfaction rating and a soft referral nudge.
**Implementation:** Single email, single send. Include dashboard deep link + 1-click rating (1-5 stars via URL parameter). Rating feeds into product quality monitoring. Footer: "Know someone else renovating? Share ScopeAI: [referral link]."
**Metric:** `posthog.capture('checkin_email_clicked')`, `posthog.capture('checkin_rating_submitted', { rating })` -- use ratings as a scope quality canary.

---

#### P-22: Seasonal Renovation Email

**Hook/Loop:** Re-engagement loop (long-cycle)
**What:** Once per year, in September-October (AU spring, peak renovation season), email all paid users: "Renovation season is here. Planning another room?" Max frequency: once per year.
**Implementation:** Annual campaign via Resend. Segment: users with 1 project (second room CTA) vs users with multiple projects (check-in + referral ask). Respect unsubscribe list. Include previous project summary.
**Metric:** `posthog.capture('seasonal_email_clicked')` + subsequent `wizard_started` events.

---

#### P-23: Scope Quality as the Growth Engine

**Hook/Loop:** All loops. This is the foundation.
**What:** The single most important variable across all hooks and loops is scope quality. If the scope is genuinely useful, every loop strengthens. If it is mediocre, every loop decays. No amount of engagement mechanics compensates for a scope tradies dismiss as "AI garbage."
**Implementation:** This is not a feature -- it is a principle. Every AI prompt, every scope template, every validation rule in `lib/ai/validation.ts` must be evaluated against: "Would a tradie take this seriously? Would a homeowner feel confident handing this to their electrician?"
**Metric:** NPS score, refund rate, "Not sure" answer rate, PDF download count per user, scope email-to-tradie rate.

---

### Acquisition Patterns

---

#### P-24: SEO Guide CTA Pipeline

**Hook/Loop:** Content SEO loop (acquisition)
**What:** Each SEO guide at `/guides/{slug}` ends with a project-type-specific CTA: "Ready to create your [kitchen] scope? It takes under 10 minutes." CTA links to `/create?utm_source=guide&utm_content={slug}`.
**Implementation:** Guide pages as MDX in `app/(marketing)/guides/`. Each guide 1500-2500 words of genuine value. 2-3 CTAs per guide (after intro, mid-content, conclusion). CTA component: teal-bordered card with project-type icon and "Start My Scope" button. Server-rendered for SEO.
**Metric:** `posthog.capture('guide_cta_clicked', { guideSlug, ctaPosition })` -- track which guides and positions drive conversions.

---

#### P-25: "Start My Scope -- Free Preview" CTA Copy

**Hook/Loop:** Action trigger (landing page conversion)
**What:** Landing page hero CTA explicitly removes risk: "Start My Scope -- Free Preview." Below button: "No credit card required. See your scope before you pay." The word "free" and "no credit card" eliminate payment anxiety at the top of funnel.
**Implementation:** Hero section of `app/(marketing)/page.tsx`. Button uses `bg-primary text-primary-foreground`. Min 48px touch target. Above the fold on mobile. Test CTA variants: "Start My Scope", "Create Your Scope -- Free", "Get Your Free Scope Preview."
**Metric:** `posthog.capture('cta_clicked', { location: 'hero', ctaText })` -- target 25%+ of landing visitors click.

---

#### P-26: Tradie Landing Page

**Hook/Loop:** Tradie referral loop (B2B2C acquisition)
**What:** Dedicated `/for-tradies` page: "Your clients arrive with a professional scope. You quote accurately. No more 'but I thought that was included.'" Converts passive PDF impressions into active tradie recommendations.
**Implementation:** Static page at `app/(marketing)/for-tradies/page.tsx`. Copy targets tradies specifically. Include: sample scope preview (redacted), how it helps tradies quote accurately, "Recommend ScopeAI to your clients" shareable link. No signup required.
**Metric:** `posthog.capture('tradie_page_viewed', { source: utm_source })` -- track tradie-sourced wizard starts.

---

## 4. Anti-Patterns

These are things the skill should actively warn developers against. Each is a trust-destroyer for anxious homeowners.

### AP-01: Artificial Urgency

**Do not build:** Countdown timers, "Only X scopes left," "Price increases at midnight," "X people viewing this scope."
**Why:** ScopeAI users are making $15K-$150K decisions. Fake urgency insults their intelligence and increases anxiety rather than resolving it. They will leave. Australian homeowners are particularly sceptical of American-style hype marketing.
**Do instead:** Real urgency only. "Renovation season starts in September -- start planning now." Honest, seasonal, relevant.

### AP-02: Dark Paywall Patterns

**Do not build:** Blurred scope content, fake "processing" delays to build anticipation, progress bars that artificially slow, "other users are viewing" notifications.
**Why:** PRD explicitly states "no blur tease." Blurring feels like information hostage-taking. The user invested effort (photos + questions). Showing zero result or teasing with blurred content feels like a bait-and-switch.
**Do instead:** Clean paywall. Content is shown (summary) or not shown (full scope). The quality of the sample items does the selling.

### AP-03: Over-Notification

**Do not build:** Daily emails, push + email + SMS for the same event, "You haven't logged in for 3 days" messages.
**Why:** This is a product used 1-5 times total. Low-frequency products that behave like high-frequency ones feel broken. Every unnecessary notification degrades the brand.
**Max email cadence across entire lifecycle:** 3 abandoned wizard (24h, 72h, 7d) + 1 payment reminder + 1 second room prompt + 1 check-in + 1 seasonal = **7 emails maximum.**

### AP-04: Exploiting Anxiety

**Do not build:** "Without a scope, your renovation WILL go over budget!", "Don't let tradies rip you off -- buy now!", fear-based copy that amplifies rather than resolves anxiety.
**Why:** The user is already anxious. Amplifying fear to drive conversion is manipulative and contradicts ScopeAI's mission to build confidence. It fails the regret test.
**Do instead:** Acknowledge anxiety, provide the antidote. "Renovation budgets blow out when tradies quote different things. A detailed scope fixes that."

### AP-05: Gamification of Serious Decisions

**Do not build:** Achievement badges ("Scope Master!"), streak counters, leaderboards, confetti on purchase, "Level up your renovation!" copy.
**Why:** Gamification signals frivolity. A homeowner spending $50K on a kitchen does not want to feel like they are playing a game. It undermines the professional credibility that justifies the price.
**Do instead:** Professional satisfaction cues. Clean transitions, well-designed scope viewer, PDF that looks like it came from a quantity surveyor. The reward is competence, not entertainment.

### AP-06: Guilt-Based Re-engagement

**Do not build:** "You left your renovation scope unfinished! Don't let your dream kitchen wait!", "Your photos are getting lonely...", emotional manipulation in re-engagement emails.
**Why:** The user may have abandoned because they are genuinely reconsidering a $50K decision. Guilt emails feel tone-deaf and trivialising.
**Do instead:** Helpful, factual, low-pressure. "Your kitchen scope is saved and ready when you are. Here's what's included: 7 trades, 53 items."

### AP-07: Weaponising Sunk Cost

**Do not build:** "You've already answered 10 questions -- don't waste your effort!", making it impossible to leave without losing data, explicit sunk-cost language.
**Why:** Sunk cost awareness and sunk cost exploitation are different. Users who feel trapped become hostile. They complete the funnel resentfully and never refer anyone.
**Do instead:** Let commitment consistency work naturally. A progress bar at 80% creates its own pull. Show what they've built ("Your scope includes plumbing, electrical, tiling, and demolition") rather than what they will lose.

### AP-08: Fake Social Proof

**Do not build:** "John S. from Sydney saved $15,000!" (unverifiable), fabricated review counts, invented user counts, "As seen in..." logos you have not been featured in.
**Why:** Home renovation is a trust industry. Fake proof is worse than no proof. If discovered, it destroys all credibility permanently.
**Do instead:** Real metrics from your database (once credible). Real testimonials with permission. Specific, verifiable claims.

### AP-09: Pre-Checked Premium Tier

**Do not build:** Pre-selected "Professional" tier on pricing page, "Are you sure you want Basic? Most homeowners choose Pro" (shaming), visually burying the cheapest option.
**Why:** Anxious users already second-guess every decision. Adding upsell pressure compounds cognitive load. They may abandon entirely.
**Do instead:** Present tiers clearly with honest differentiators. Highlight most popular tier with "Most chosen" label (social proof, not manipulation). Let value speak.

### AP-10: Infinite Email Cadences

**Do not build:** Open-ended drip campaigns that keep emailing until the user buys or unsubscribes. "Day 1, Day 3, Day 5, Day 7, Day 14, Day 30..." sequences.
**Why:** ScopeAI is not an e-commerce shop selling $20 t-shirts. It serves people making $50K+ decisions. Persistent email pressure is corrosive.
**Do instead:** Finite cadences with explicit stop conditions. Abandoned wizard: 3 emails max. Everything else: 1 email per trigger, ever.

---

## 5. Implementation Phasing

### MVP (Launch Day)

These patterns must be active for the first user. They are the core engagement and conversion mechanics.

| Pattern | ID | Effort | Why MVP |
|---------|----|--------|---------|
| Endowed progress bar | P-01 | Already built | Core wizard engagement |
| Auto-advance on single select | P-02 | Low | Reduces question friction |
| "Not sure" safety net | P-04 | Already built | Prevents question-step abandonment |
| Wizard state persistence | P-05 | Already built | Preserves investment |
| Item count as curiosity anchor | P-06 | Low | Primary conversion driver |
| Best sample item selection | P-07 | Medium | Quality signal at paywall |
| Trust signal adjacency | P-09 | Low | Payment confidence |
| PDF branding footer | P-11 | Low | Passive tradie referral loop |
| Scope item toggles | P-12 | Already built | Investment + IKEA effect |
| "Start My Scope -- Free Preview" CTA | P-25 | Low | Landing page conversion |
| PostHog funnel events | All | Medium | Measurement foundation |
| Standards-based trust signals | P-20 (sub-50 variant) | Low | Social proof when count is low |

**MVP effort summary:** Most patterns are already built or require copy/positioning changes only. New engineering: PostHog event instrumentation, sample item selection logic, trust signal placement.

---

### Post-Launch (Month 1-3)

These require real users to test, backend scheduled functions, and email infrastructure.

| Pattern | ID | Effort | Why Post-Launch |
|---------|----|--------|-----------------|
| Photo upload micro-validation | P-03 | Low | Needs real photo analysis data to tune |
| "Based on your inputs" connection line | P-08 | Medium | Needs real scope generation output to evaluate |
| Tier anchoring for returning users | P-10 | Low | Needs returning users to trigger |
| "What to do next" guide card | P-13 | Low | Needs post-purchase user flow to validate |
| Pre-filled property details | P-14 | Medium | Needs multi-room users |
| Post-purchase share prompt | P-15 | Low | Needs paid users to show to |
| Email scope to tradie flow | P-16 | Medium | Requires Resend integration |
| Abandoned wizard email | P-17 | Medium | Requires scheduled function + email template |
| "Second room" prompt | P-18 | Medium | Requires repeat users |
| NPS survey | P-19 | Medium | Needs 7+ days of paid users |
| Social proof counter (>50 scopes) | P-20 | Low | Needs sufficient volume |
| 30-day check-in email | P-21 | Low | Needs 30+ day old paid users |
| SEO guide CTA pipeline | P-24 | Medium | Content creation + SEO setup |

**Post-launch effort summary:** Primary new work is Convex scheduled functions for email cadences, Resend email templates, and SEO content creation. Most feature work is incremental UI additions.

---

### Growth (Month 3+)

These require critical mass, data insights, or significant new features.

| Pattern | ID | Effort | Why Growth Phase |
|---------|----|--------|------------------|
| Seasonal renovation email | P-22 | Low | Once-per-year campaign, needs user base |
| Tradie landing page | P-26 | Medium | Needs tradies receiving scopes regularly |
| Referral credit system | (V2) | High | Needs transaction volume for economics |
| Shareable scope links | (V2) | High | Requires access control + new route |
| Programmatic SEO pages | (V2) | High | Needs data to populate suburb-level pages |
| "During Construction" checklist mode | (V2) | Medium | Lifecycle engagement enhancement |
| Scope refresh (updated standards) | (V2) | High | Requires versioning in data model |

---

## 6. PostHog Event Quick Reference

Standard properties on ALL events:

```typescript
{
  projectType?: string,    // "kitchen", "bathroom", etc.
  projectId?: string,
  mode?: string,           // "trades" | "builder"
  pricingTier?: string,    // "starter" | "professional" | "premium"
  isReturningUser: boolean,
  daysSinceSignup?: number,
  source?: string          // "organic" | "referral" | "paid" | "direct"
}
```

### Priority 1 Events (Before Launch)

| Event | When |
|-------|------|
| `wizard_started` | User enters step 0 |
| `wizard_step_completed` | Step advances |
| `wizard_step_abandoned` | User leaves (beforeunload) |
| `photo_uploaded` | Upload completes |
| `question_answered` | Answer selected (include `isNotSure`) |
| `preview_viewed` | Preview loads (include `tradeCount`, `totalItemCount`) |
| `pricing_tier_selected` | Tier CTA clicked |
| `checkout_started` | Stripe session created |
| `payment_completed` | Stripe webhook confirms |
| `scope_pdf_downloaded` | PDF download triggered |

### Priority 2 Events (First Week)

| Event | When |
|-------|------|
| `wizard_resumed` | User resumes from saved state |
| `scope_viewed` | Scope view loads (include `daysSincePurchase`) |
| `scope_item_toggled` | Checkbox toggled |
| `scope_emailed_to_tradie` | Email sent to tradie |
| `nps_score_submitted` | NPS survey submitted |
| `landing_cta_clicked` | Any CTA on landing page |

### Priority 3 Events (First Month)

| Event | When |
|-------|------|
| `referral_link_shared` | Share button used (include `channel`) |
| `second_room_started` | Returning user starts new project |
| `dashboard_viewed` | Account dashboard loads |
| `guide_cta_clicked` | CTA in SEO guide clicked |
| `reengagement_email_clicked` | Re-engagement email link clicked |

---

## 7. Summary: The Three Things That Matter Most

Everything in this document ladders up to three principles:

**1. The scope quality is the growth engine.** If the output is genuinely useful -- if tradies take it seriously, if homeowners feel confident handing it over -- every loop self-reinforces. If the scope is mediocre, no amount of engagement mechanics will save the product. Scope quality is not a feature; it is the foundation all loops stand on.

**2. Reduce anxiety at every touchpoint.** ScopeAI exists because homeowners are anxious about renovation costs. Every screen, every email, every interaction should leave the user feeling more confident, not more pressured. This is the ethical and commercial imperative. Anxious-but-helped users become promoters. Anxious-and-pressured users become detractors.

**3. The PDF is the marketing department.** Every scope document sent to a tradie is a passive acquisition channel. Every PDF shown to a partner or friend is a referral trigger. The quality, professionalism, and branding of the PDF output is the most capital-efficient growth lever ScopeAI has. Invest in making it the most impressive document a tradie receives all week.

---

*This document synthesises findings from all 7 hooks and retention research files. For deep dives, see the companion documents in `research-output/hooks-retention/`.*
