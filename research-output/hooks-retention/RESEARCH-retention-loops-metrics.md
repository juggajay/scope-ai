# Retention Loops -- Metrics Framework

**Date:** February 2026
**Purpose:** For every loop identified in the ScopeAI mapping, define the key metric, leading/lagging indicators, PostHog events, dashboard structure, health thresholds, alerting rules, cohort recommendations, and attribution logic.

---

## 1. Metrics Per Loop

### 1.1 SEO Content Loop

| Dimension | Value |
|-----------|-------|
| **Key Metric** | Organic wizard starts per month |
| **Leading Indicator** | Organic impressions in Search Console (appears 2-4 weeks before clicks) |
| **Lagging Indicator** | Organic-attributed revenue (appears 1-2 weeks after wizard start) |
| **Health Threshold** | Healthy: organic wizard starts growing >10% month-over-month. Decaying: flat or declining for 2 consecutive months. |

**PostHog Events:**

| Event Name | Properties | When to Fire |
|------------|-----------|-------------|
| `page_viewed` | `path`, `referrer`, `utm_source`, `utm_content` | Every page load (auto-tracked by PostHog) |
| `wizard_started` | `source` (organic/direct/referral/paid), `landingPage`, `utm_content` | User clicks "Start My Scope" on any page |
| `guide_cta_clicked` | `guideSlug`, `ctaPosition` (inline/bottom/sidebar) | User clicks CTA within a guide page |

**Attribution Logic:** If `utm_source === "guide"` or `referrer` contains `/guides/`, attribute to SEO Content Loop. Store `initialSource` on the project document (add `source: v.optional(v.string())` to `projects` schema).

---

### 1.2 Tradie Referral Loop

| Dimension | Value |
|-----------|-------|
| **Key Metric** | Wizard starts from tradie referral source |
| **Leading Indicator** | PDF downloads per paid user (more downloads = more tradie exposure) |
| **Lagging Indicator** | Users who report "tradie recommended" as acquisition source |
| **Health Threshold** | Healthy: >3 PDF downloads per paid user. Decaying: <2 downloads per user. |

**PostHog Events:**

| Event Name | Properties | When to Fire |
|------------|-----------|-------------|
| `scope_pdf_downloaded` | `projectId`, `tradeType` (or "all"), `format` (pdf/zip), `daysSincePurchase` | User downloads any PDF |
| `scope_emailed` | `projectId`, `recipientType` (self/tradie), `tradeCount` | User sends scope via email |
| `tradie_referral_landing` | `tradieId` (if tracked), `utm_source` | User lands on `/tradie-referral` page |
| `signup_source` | `source` (friend/tradie/google/direct/ad) | Captured at signup via dropdown or first-visit attribution |

**Attribution Logic:** If `utm_source === "tradie"` or `landingPage === "/tradie-referral"`, attribute to Tradie Referral Loop. Add "How did you hear about us?" dropdown to signup flow (optional field, not blocking).

---

### 1.3 Word-of-Mouth Loop

| Dimension | Value |
|-----------|-------|
| **Key Metric** | Percentage of new users attributed to word-of-mouth |
| **Leading Indicator** | NPS score (promoters are future referrers) |
| **Lagging Indicator** | Branded search volume ("ScopeAI" queries in Search Console) |
| **Health Threshold** | Healthy: NPS > 60 AND >15% of new users from referral. Decaying: NPS < 40 OR referral share declining. |

**PostHog Events:**

| Event Name | Properties | When to Fire |
|------------|-----------|-------------|
| `nps_survey_shown` | `projectId`, `daysSincePurchase` | NPS survey appears (7 days post-payment) |
| `nps_score_submitted` | `score` (0-10), `projectId`, `projectType` | User submits NPS score |
| `nps_comment_submitted` | `comment`, `score`, `projectId` | User adds optional text feedback |
| `referral_link_shared` | `channel` (sms/email/copy/whatsapp), `projectId` | User shares referral link |
| `referral_link_clicked` | `referrerId`, `channel` | Someone clicks a shared referral link |

**Attribution Logic:** If user arrived via referral link, attribute to Word-of-Mouth Loop. If `signup_source === "friend"`, also attribute here. Track `referrerId` to connect referrer to referee.

---

### 1.4 Social Proof Loop

| Dimension | Value |
|-----------|-------|
| **Key Metric** | Landing page conversion rate (visitor to wizard start) |
| **Leading Indicator** | Total paid scope count (feeds the counter display) |
| **Lagging Indicator** | Conversion rate trend with social proof enabled vs disabled |
| **Health Threshold** | Healthy: conversion rate >3%. Decaying: <2% for 2 consecutive weeks. |

**PostHog Events:**

| Event Name | Properties | When to Fire |
|------------|-----------|-------------|
| `landing_page_viewed` | `socialProofCount` (number displayed), `variant` (A/B test) | Landing page loads |
| `landing_cta_clicked` | `ctaLocation` (hero/pricing/bottom), `socialProofVisible` (boolean) | User clicks any "Start My Scope" CTA |

**Attribution Logic:** Use PostHog feature flags to A/B test social proof counter (show vs hide). Compare conversion rates between variants. This directly measures the loop's impact.

---

### 1.5 Progress + Sunk Cost Loop

| Dimension | Value |
|-----------|-------|
| **Key Metric** | Wizard completion rate (wizard start to generation triggered) |
| **Leading Indicator** | Step-to-step continuation rate (each step individually) |
| **Lagging Indicator** | Payment conversion rate (generation to payment) |
| **Health Threshold** | Healthy: >60% of wizard starts reach generation. Decaying: <40%. Per-step: any step with >20% drop-off needs investigation. |

**PostHog Events:**

| Event Name | Properties | When to Fire |
|------------|-----------|-------------|
| `wizard_step_entered` | `step` (0-6), `stepName`, `projectType`, `mode` | User enters any wizard step |
| `wizard_step_completed` | `step`, `stepName`, `durationSeconds`, `projectType` | User completes a step (advances to next) |
| `wizard_step_abandoned` | `step`, `stepName`, `timeOnStepSeconds`, `projectType` | User leaves wizard (tab close, navigate away, or 30min inactivity) |
| `wizard_back_clicked` | `fromStep`, `toStep` | User clicks Back button |
| `wizard_resumed` | `fromStep`, `daysSinceLastVisit`, `projectType` | User resumes from localStorage state |
| `wizard_resume_declined` | `step`, `daysSinceLastVisit` | User chooses "Start Fresh" instead of resuming |

**Funnel Definition in PostHog:**

```
Funnel: "Wizard Completion"
Steps:
  1. wizard_step_entered (step=0)  -- Mode selection
  2. wizard_step_completed (step=0) -- Mode selected
  3. wizard_step_completed (step=1) -- Project setup done
  4. wizard_step_completed (step=2) -- Photos uploaded
  5. wizard_step_completed (step=3) -- Questions answered
  6. wizard_step_completed (step=4) -- Auth completed
  7. wizard_step_completed (step=5) -- Generation complete
  8. payment_completed              -- Paid

Conversion window: 7 days
Breakdown by: projectType, mode, device
```

---

### 1.6 Curiosity Gap Loop

| Dimension | Value |
|-----------|-------|
| **Key Metric** | Preview-to-payment conversion rate |
| **Leading Indicator** | Time spent on preview page (longer = more engaged with sample items) |
| **Lagging Indicator** | Tier selection distribution (higher tiers = stronger curiosity/value perception) |
| **Health Threshold** | Healthy: >35% preview-to-payment. Decaying: <25%. |

**PostHog Events:**

| Event Name | Properties | When to Fire |
|------------|-----------|-------------|
| `preview_viewed` | `projectId`, `tradeCount`, `totalItemCount`, `projectType`, `mode` | Preview/paywall page loads |
| `preview_sample_read` | `tradeType`, `timeVisibleMs` | Sample item in view for >2 seconds (visibility tracking) |
| `pricing_tier_viewed` | `projectId`, `previousTier` (if returning user) | Pricing section scrolls into view |
| `pricing_tier_selected` | `tier`, `price`, `isReturningUser`, `projectNumber` | User clicks a tier's CTA |
| `checkout_started` | `projectId`, `tier`, `price` | Stripe Checkout session created |
| `payment_completed` | `projectId`, `tier`, `price`, `source` | Stripe webhook confirms payment |
| `payment_abandoned` | `projectId`, `tier` | User returns from Stripe without completing (cancel URL hit) |

---

### 1.7 Personalisation Loop

| Dimension | Value |
|-----------|-------|
| **Key Metric** | Answer completion rate (questions answered vs "Not sure") |
| **Leading Indicator** | Photos uploaded beyond minimum (signals engagement with personalisation) |
| **Lagging Indicator** | Scope quality satisfaction (NPS, refund rate) |
| **Health Threshold** | Healthy: <20% "Not sure" answers, average 5+ photos. Decaying: >30% "Not sure", average <4 photos. |

**PostHog Events:**

| Event Name | Properties | When to Fire |
|------------|-----------|-------------|
| `photo_uploaded` | `photoNumber` (1st, 2nd...), `projectType`, `fileSizeMb`, `device` | Each photo upload completes |
| `photo_removed` | `photoNumber`, `projectType` | User removes a photo |
| `question_answered` | `questionId`, `answer`, `isNotSure` (boolean), `isMultiSelect`, `projectType` | User selects an answer |
| `question_skipped` | `questionId`, `projectType` | User explicitly skips (if skip is available) |
| `description_entered` | `characterCount`, `projectType` | User enters vision description |
| `asbestos_warning_shown` | `yearBuilt`, `projectType` | Pre-1990 property detected |

---

### 1.8 Multi-Room Loop

| Dimension | Value |
|-----------|-------|
| **Key Metric** | Percentage of paid users who start a second project |
| **Leading Indicator** | Dashboard visits after payment (user returning = considering next room) |
| **Lagging Indicator** | Second project payment rate |
| **Health Threshold** | Healthy: >10% of paid users start second project within 60 days. Decaying: <5%. |

**PostHog Events:**

| Event Name | Properties | When to Fire |
|------------|-----------|-------------|
| `dashboard_viewed` | `projectCount`, `daysSinceLastPurchase`, `device` | User visits account dashboard |
| `second_room_prompt_shown` | `firstProjectType`, `daysSinceFirstPurchase` | "Start another room" CTA shown |
| `second_room_prompt_clicked` | `firstProjectType`, `daysSinceFirstPurchase` | User clicks "Start another room" |
| `second_room_started` | `firstProjectType`, `secondProjectType`, `daysSinceFirstPurchase` | User reaches step 1 of second project |
| `property_prefilled` | `fieldsReused` (count of pre-filled fields) | Property details auto-filled from previous project |
| `second_room_paid` | `firstTier`, `secondTier`, `daysSinceFirstPurchase` | Second project payment completed |

---

### 1.9 Renovation Lifecycle Loop

| Dimension | Value |
|-----------|-------|
| **Key Metric** | Return visits to scope view (post-payment, >7 days after purchase) |
| **Leading Indicator** | Item toggles per user (user is actively using scope as a checklist) |
| **Lagging Indicator** | Scope PDF re-downloads (user is sharing updated scope with tradies) |
| **Health Threshold** | Healthy: >50% of paid users return at least once after 7 days. Decaying: <30%. |

**PostHog Events:**

| Event Name | Properties | When to Fire |
|------------|-----------|-------------|
| `scope_viewed` | `projectId`, `daysSincePurchase`, `device`, `tabViewed` (trade type) | User opens scope view |
| `scope_item_toggled` | `projectId`, `tradeType`, `itemId`, `newState` (included/excluded), `daysSincePurchase` | User toggles any item |
| `scope_pdf_redownloaded` | `projectId`, `format`, `daysSincePurchase` | User downloads PDF >24 hours after first download |

---

### 1.10 Tier Upsell Loop

| Dimension | Value |
|-----------|-------|
| **Key Metric** | Average tier per purchase number (does tier increase on repeat purchases?) |
| **Leading Indicator** | Previous tier displayed to returning users (are they seeing the upsell context?) |
| **Lagging Indicator** | Revenue per user trending up over time |
| **Health Threshold** | Healthy: 2nd purchase average tier > 1st purchase average tier. Decaying: no difference or downgrade. |

**PostHog Events:**

| Event Name | Properties | When to Fire |
|------------|-----------|-------------|
| `pricing_tier_selected` | `tier`, `previousTier` (if exists), `projectNumber`, `isUpgrade` (boolean) | Already defined in 1.6 -- add `previousTier` property |

---

### 1.11 Referral-Revenue Loop (V2)

| Dimension | Value |
|-----------|-------|
| **Key Metric** | Referral-driven revenue as percentage of total |
| **Leading Indicator** | Referral links generated per paid user |
| **Lagging Indicator** | Credit redemption rate (referrers returning to use earned credits) |
| **Health Threshold** | Healthy: >10% of revenue from referrals. Decaying: <5% after 3 months of program running. |

**PostHog Events:**

| Event Name | Properties | When to Fire |
|------------|-----------|-------------|
| `referral_code_generated` | `userId`, `projectId` | Referral code first generated |
| `referral_link_shared` | `channel`, `userId` | Already defined in 1.3 |
| `referral_credit_earned` | `referrerId`, `refereeId`, `amount` | Referred user completes payment |
| `referral_credit_redeemed` | `userId`, `amount`, `projectId` | User applies credit at checkout |

---

## 2. Dashboard Structure

### 2.1 Daily Dashboard (Check Every Morning)

| Widget | Metric | Source | Alert If |
|--------|--------|--------|----------|
| **Revenue today** | Sum of payments | Stripe | Below daily average by >50% |
| **Wizard starts today** | Count of `wizard_started` | PostHog | Below daily average by >40% |
| **Payments today** | Count of `payment_completed` | PostHog | Zero by 2pm |
| **Wizard completion rate (24h)** | `wizard_step_completed(step=5)` / `wizard_started` | PostHog | Below 50% |
| **Preview-to-payment (24h)** | `payment_completed` / `preview_viewed` | PostHog | Below 25% |
| **Generation failures (24h)** | Count of `generation_failed` | PostHog | Any occurrence |

### 2.2 Weekly Dashboard (Monday Review)

| Widget | Metric | Source | Alert If |
|--------|--------|--------|----------|
| **Revenue this week** | Sum | Stripe | Below previous week by >20% |
| **New users this week** | Signups | Convex | Below previous week by >20% |
| **Funnel by step** | Step-by-step drop-off chart | PostHog | Any step >20% drop-off |
| **Tier distribution** | Starter/Professional/Premium split | PostHog | Starter >60% (upsell not working) |
| **Avg photos per project** | Mean of `photo_uploaded` count | PostHog | Below 4 |
| **"Not sure" answer rate** | `question_answered` where `isNotSure=true` / total | PostHog | Above 25% |
| **PDF downloads per user** | Mean downloads per paid user | PostHog | Below 2 |
| **NPS score (rolling 30d)** | Mean of `nps_score_submitted` | PostHog | Below 50 |
| **Top traffic sources** | Grouped by `source` | PostHog | Organic declining |

### 2.3 Monthly Dashboard (Strategic Review)

| Widget | Metric | Source | Alert If |
|--------|--------|--------|----------|
| **Monthly revenue** | Sum | Stripe | Below target |
| **Revenue by source** | Organic / Referral / Direct / Paid | PostHog + Stripe | Over-reliance on one source (>70%) |
| **Multi-room rate** | Users with 2+ projects / total paid | Convex | Below 8% |
| **Referral rate** | `signup_source=friend` / total new users | PostHog | Below 10% after month 3 |
| **CAC by channel** | Cost / conversions per channel | Manual calc | Above $30 for any channel |
| **Scope quality metrics** | NPS + refund rate + "Not sure" rate | PostHog + Stripe | NPS declining, refunds increasing |
| **SEO traffic trend** | Organic sessions month-over-month | Search Console | Flat or declining for 2 months |
| **Content performance** | Conversions per guide | PostHog | Any guide with 0 conversions in 30 days |
| **Cohort retention** | % of Month N users who return in Month N+1 | PostHog | Below 10% |

---

## 3. Health Thresholds Summary

| Loop | Healthy | Warning | Critical |
|------|---------|---------|----------|
| SEO Content | Organic starts growing >10% MoM | Flat for 1 month | Declining for 2 months |
| Tradie Referral | >3 PDFs downloaded per user | 2-3 PDFs per user | <2 PDFs per user |
| Word-of-Mouth | NPS >60, referral share >15% | NPS 40-60, referral 10-15% | NPS <40, referral <10% |
| Social Proof | Landing conversion >3% | 2-3% | <2% |
| Progress | >60% wizard completion | 40-60% | <40% |
| Curiosity Gap | >35% preview-to-payment | 25-35% | <25% |
| Personalisation | <20% "Not sure", 5+ photos avg | 20-30% "Not sure", 4 photos | >30% "Not sure", <4 photos |
| Multi-Room | >10% start second project | 5-10% | <5% |
| Lifecycle | >50% return after 7 days | 30-50% | <30% |
| Tier Upsell | 2nd purchase tier > 1st | Same tier | Tier downgrade |
| Referral-Revenue | >10% of revenue from referrals | 5-10% | <5% after 3 months |

---

## 4. Alerting Rules

### Immediate Alerts (Slack/Email Within 1 Hour)

| Condition | Action |
|-----------|--------|
| Zero payments in 24 hours (after first month) | Check Stripe, check wizard funnel |
| Generation failure rate >20% in 1 hour | Check Gemini API status, check prompts |
| Wizard start-to-step-1 drop-off >50% (rolling 24h) | Check landing page, check mode selection step |
| Stripe webhook failures | Check Convex HTTP endpoint, check Stripe dashboard |
| Refund requested | Review scope quality, contact user |

### Daily Alerts (Morning Summary Email)

| Condition | Action |
|-----------|--------|
| Revenue below previous day by >50% | Investigate traffic + conversion |
| Any wizard step with >25% drop-off (rolling 7 days) | Investigate that step specifically |
| Average generation time >90 seconds | Check Gemini response times |
| New NPS score below 5 | Read feedback, assess scope quality |

### Weekly Alerts (Monday Report)

| Condition | Action |
|-----------|--------|
| Organic traffic flat or declining for 2 weeks | Review SEO guides, check Search Console |
| "Not sure" rate >25% for any question | Consider rewriting question or adding "why" tooltip |
| PDF downloads per user below 2 | Check download UX, check email delivery |
| Zero multi-room starts this week (after month 2) | Check dashboard CTAs, check email reminders |

---

## 5. Cohort Analysis Recommendations

### Cohort Definitions

| Cohort | Definition | Purpose |
|--------|-----------|---------|
| **Weekly signup cohort** | Users who signed up in the same week | Track funnel completion by cohort |
| **Project type cohort** | All users with same `projectType` | Compare conversion across room types |
| **Tier cohort** | Users who purchased same `paymentTier` | Track satisfaction by tier |
| **Source cohort** | Users with same `source` (organic/referral/direct) | Compare LTV by acquisition channel |
| **Mode cohort** | `trades` vs `builder` mode | Compare engagement by user type |

### Cohort Metrics to Track

**Cohort Metric 1: Time to Payment**
- Definition: Time from `wizard_started` to `payment_completed`
- Segmented by: project type, mode, source
- Expected: <15 minutes for most users
- Red flag: Increasing over time (wizard is getting harder, not easier)

**Cohort Metric 2: Multi-Room Conversion by Cohort**
- Definition: % of Week N cohort that starts a second project within 60 days
- Expected: Increases as product improves
- Red flag: Declining (early users were more engaged due to novelty)

**Cohort Metric 3: NPS by Cohort**
- Definition: Average NPS for each weekly cohort
- Expected: Stable or increasing (product improving)
- Red flag: Declining (scope quality degrading, or expectations increasing faster than product)

**Cohort Metric 4: Revenue per Cohort**
- Definition: Total revenue from each weekly signup cohort (including future purchases)
- Expected: Increases as multi-room + upsell loops activate
- Red flag: Cohort revenue plateaus at first purchase (no return business)

### PostHog Cohort Setup

```
Cohort: "Paid Users - Week of [Date]"
Filter: payment_completed event
Group by: week of event timestamp

Cohort: "Kitchen Users"
Filter: wizard_step_completed where projectType = "kitchen"

Cohort: "Trade Manager Users"
Filter: wizard_step_completed where mode = "trades"

Cohort: "Organic Users"
Filter: wizard_started where source = "organic"
```

---

## 6. Attribution Framework

### First-Touch Attribution

Store the user's initial acquisition source at first visit. This never changes.

**Implementation:**
1. On first page load, check for `utm_source`, `utm_medium`, `utm_content` query parameters
2. If present, store in localStorage as `initialSource`
3. When user signs up, save `initialSource` to `profiles` table (add `acquisitionSource: v.optional(v.string())`, `acquisitionMedium: v.optional(v.string())`, `acquisitionContent: v.optional(v.string())`)
4. All PostHog events for this user inherit the `acquisitionSource` property

**Source Classification:**

| Source | Classification | Detection |
|--------|---------------|-----------|
| Direct (no referrer, no UTM) | `direct` | No referrer + no UTM |
| Google organic | `organic` | Referrer contains google.com + no utm_medium=cpc |
| Google paid | `paid` | utm_medium=cpc |
| Reddit | `community` | Referrer contains reddit.com |
| Facebook group | `community` | Referrer contains facebook.com |
| Guide page internal | `content` | utm_source=guide |
| Referral link | `referral` | utm_source=referral or has referralCode param |
| Tradie referral | `tradie` | utm_source=tradie or landing page = /tradie-referral |

### Multi-Touch Attribution (V2)

For now, first-touch is sufficient. At scale (>500 users/month), implement:
- Session-based attribution: track source per session, not just first visit
- Touchpoint log: record every source interaction before payment
- Weighted attribution: first + last touch get 40% each, middle touches split 20%

### Loop Attribution

To determine which loop drove a conversion, map the `acquisitionSource` to loops:

| Source | Primary Loop |
|--------|-------------|
| `organic` | SEO Content Loop |
| `referral` | Word-of-Mouth Loop |
| `tradie` | Tradie Referral Loop |
| `paid` | (Paid acquisition -- not a loop) |
| `community` | (Community seeding -- not a loop) |
| `direct` | Social Proof or Brand awareness |
| `content` | Content-Commerce Loop |

For monetisation loops (upsell, multi-room), attribution is simpler: any user with `projectNumber > 1` is attributed to Multi-Room Loop. Any user with `tier(project N) > tier(project N-1)` is attributed to Tier Upsell Loop.

---

## 7. PostHog Implementation Checklist

### Events to Implement (Priority Order)

**Priority 1: Before Launch (Must Have)**

| Event | Component/File | Trigger |
|-------|---------------|---------|
| `wizard_started` | `WizardContainer.tsx` | User enters step 0 |
| `wizard_step_entered` | `WizardContainer.tsx` | Step changes |
| `wizard_step_completed` | `WizardContainer.tsx` | Step validation passes, advance |
| `photo_uploaded` | `PhotoUpload.tsx` | Upload completes |
| `question_answered` | `QuestionFlow.tsx` | Answer selected |
| `preview_viewed` | `ScopePreview.tsx` or `PaywallGate.tsx` | Component mounts |
| `pricing_tier_selected` | `ScopePreview.tsx` or `PaywallGate.tsx` | Tier CTA clicked |
| `checkout_started` | `convex/stripe.ts` | Checkout session created |
| `payment_completed` | `convex/stripe.ts` (webhook handler) | Stripe webhook received |
| `scope_pdf_downloaded` | `useScopeDownload.ts` | PDF download triggered |

**Priority 2: First Week Post-Launch**

| Event | Component/File | Trigger |
|-------|---------------|---------|
| `wizard_step_abandoned` | `WizardContainer.tsx` | Tab close / navigate away (beforeunload) |
| `wizard_resumed` | `ResumePrompt.tsx` | User chooses "Continue" |
| `scope_viewed` | `ScopeViewShell.tsx` | Scope view loads |
| `scope_item_toggled` | `ScopeItemToggle.tsx` | Checkbox toggled |
| `scope_emailed` | `EmailDialog.tsx` | Email sent successfully |
| `nps_survey_shown` | New component | Survey appears |
| `nps_score_submitted` | New component | Score submitted |
| `landing_cta_clicked` | Landing page | CTA clicked |

**Priority 3: First Month Post-Launch**

| Event | Component/File | Trigger |
|-------|---------------|---------|
| `referral_link_shared` | New component | Share button clicked |
| `second_room_prompt_shown` | Scope view / dashboard | CTA rendered |
| `second_room_started` | `WizardContainer.tsx` | Returning user reaches step 1 |
| `dashboard_viewed` | `app/account/page.tsx` | Dashboard loads |
| `guide_cta_clicked` | Guide pages | CTA clicked |
| `signup_source` | Auth pages | Source dropdown selected |

### PostHog Configuration

**Project Setup:**
- Create PostHog project (free tier -- 1M events/month)
- Install: `npm install posthog-js`
- Initialize in `components/providers.tsx` alongside Convex provider
- Set `api_host` to PostHog cloud endpoint
- Enable autocapture for page views

**User Identification:**
- Call `posthog.identify(userId)` after signup/login
- Set user properties: `email`, `projectCount`, `acquisitionSource`
- Before auth: use anonymous ID (PostHog generates automatically)
- PostHog merges anonymous + identified sessions automatically

**Feature Flags to Create:**
- `social_proof_counter` -- show/hide scope count on landing page
- `nps_survey_enabled` -- enable/disable NPS survey
- `multi_room_prompt` -- show/hide "start another room" CTA
- `email_cadence_enabled` -- enable/disable lifecycle emails

---

## 8. Metric-to-Action Mapping

When a metric triggers an alert, here is the decision tree.

### Wizard Drop-Off Too High

```
Which step has >20% drop-off?
  |
  +--> Step 0 (Mode Selection)
  |     --> Are cards clear? Test copy changes.
  |     --> Is the page loading slowly? Check bundle size.
  |
  +--> Step 1 (Project Setup)
  |     --> Too many form fields? Consider making suburb optional.
  |     --> Year built confusing? Add "approximate is fine" helper text.
  |
  +--> Step 2 (Photo Upload)
  |     --> Upload failing? Check Convex file storage logs.
  |     --> Mobile camera not triggering? Test on iOS + Android.
  |     --> 3-photo minimum too high? Test with 1-photo minimum.
  |
  +--> Step 3 (Questions)
  |     --> Which question has highest skip/abandon rate? Consider removing it.
  |     --> Are users spending >3 min on questions? Too many questions.
  |     --> High "Not sure" rate on specific question? Rewrite options.
  |
  +--> Step 4 (Auth Gate)
  |     --> Users don't want to sign up? Test post-payment auth instead.
  |     --> Sign-up errors? Check Convex Auth logs.
  |     --> Too much friction? Add Google OAuth.
  |
  +--> Step 5 (Generation)
  |     --> Generation timeout? Check Gemini API latency.
  |     --> Users leaving during wait? Is educational content engaging enough?
  |     --> Trade failures? Check specific trade prompt quality.
  |
  +--> Step 6 (Preview/Payment)
        --> Sample items not compelling? Tune AI prompts.
        --> Price too high? Test lower price point.
        --> Trust signals missing? Add money-back guarantee.
```

### Conversion Rate Declining

```
Is traffic changing? (same visitors, lower conversion)
  |
  +--> YES: Traffic source shift
  |     --> New traffic from lower-intent source (e.g., generic blog posts)
  |     --> Fix: Ensure high-intent pages (guides) have strong CTAs
  |
  +--> NO: Same traffic, lower conversion
        |
        +--> Check funnel: WHERE is the new drop-off?
        |     --> Fix the specific step (see above)
        |
        +--> Check scope quality: Is NPS declining?
        |     --> Fix: Review recent scope generations manually
        |
        +--> Check competition: Has a competitor launched?
              --> Fix: Differentiate on quality + AU-specific content
```

---

*This document defines the complete metrics framework for ScopeAI's retention loops. Cross-reference with `RESEARCH-retention-loops-scopeai-mapping.md` for loop mechanics and `RESEARCH-retention-loops-cold-start.md` for bootstrapping strategy.*
