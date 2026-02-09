# Hook Model Trigger Inventory: ScopeAI

**Date:** February 2026
**Companion to:** `RESEARCH-hook-model-scopeai-mapping.md`
**Purpose:** Complete inventory of all triggers (external and internal), ranked by impact and effort, grouped by implementation phase.

---

## Inventory Structure

Each trigger entry includes:
- **Name and ID** (for cross-referencing)
- **Type:** External (environment pushes user to act) or Internal (emotional state pulls user to act)
- **Description:** What the trigger is and how it works
- **When it fires:** Where in the user journey this trigger operates
- **Expected impact:** High / Medium / Low (on conversion, retention, or revenue)
- **Implementation effort:** Low / Medium / High
- **Impact x Effort score:** H/H = deprioritise, H/L = do first, L/H = skip for MVP
- **Implementation notes:** Specific to ScopeAI's stack (Convex, Next.js, Resend, PostHog)
- **PostHog event:** Event name and properties to track

---

## Priority Matrix

```
                    HIGH IMPACT
                         |
          Do First       |      Do After Launch
         (MVP)           |      (Month 1-3)
                         |
   LOW EFFORT ───────────┼──────────── HIGH EFFORT
                         |
         Nice to Have    |      Defer or Skip
         (Growth)        |      (V2+)
                         |
                    LOW IMPACT
```

---

## Complete Trigger Inventory

### EXTERNAL TRIGGERS

---

#### EXT-01: SEO Organic Search Landing

| Field | Value |
|-------|-------|
| **Type** | External -- Paid/Organic placement |
| **Description** | User searches a renovation planning query ("kitchen renovation scope template australia", "how to compare builder quotes", "renovation budget checklist") and lands on ScopeAI's marketing page or an SEO guide page. The page content validates their problem and presents ScopeAI as the solution. |
| **When it fires** | Pre-funnel. User has not yet interacted with ScopeAI. This is the primary top-of-funnel acquisition trigger. |
| **Expected impact** | **HIGH** -- This is the primary acquisition channel. Targets users with active intent. |
| **Implementation effort** | **Medium** -- Landing page exists. SEO guides require content creation over time. |
| **Priority score** | HIGH impact / MEDIUM effort = **MVP + ongoing** |
| **Implementation notes** | Landing page at `app/(marketing)/page.tsx` already built. SEO guides at `/guides/*` need content. Each guide should end with a project-type-specific CTA: "Ready to create your [kitchen] scope?" UTM parameters on all inbound links for source tracking. Landing page must load <3s on mobile (Core Web Vitals). |
| **PostHog event** | `posthog.capture('landing_page_view', { source: utm_source, medium: utm_medium, keyword: utm_term, page: path })` |

---

#### EXT-02: "Start My Scope -- Free Preview" CTA

| Field | Value |
|-------|-------|
| **Type** | External -- Call to action |
| **Description** | The primary CTA button on the landing page. Copy explicitly removes risk: "Free Preview" means no payment required to see output. Button is high-contrast teal, above the fold on mobile. |
| **When it fires** | Landing page view. User decides whether to begin the wizard. |
| **Expected impact** | **HIGH** -- This is the single most important conversion point. Every user who generates a scope started here. |
| **Implementation effort** | **Low** -- Button exists. Copy and placement refinement only. |
| **Priority score** | HIGH / LOW = **MVP Day 1** |
| **Implementation notes** | Button in hero section of `app/(marketing)/page.tsx`. Use `bg-primary text-primary-foreground` styling. Min 48px touch target. Below button: "No credit card required. See your scope before you pay." Test CTA copy variants: "Start My Scope", "Create Your Scope -- Free", "Get Your Free Scope Preview". |
| **PostHog event** | `posthog.capture('cta_clicked', { location: 'hero' | 'how_it_works' | 'pricing' | 'bottom', cta_text: string })` |

---

#### EXT-03: Social Proof Counter

| Field | Value |
|-------|-------|
| **Type** | External -- Social proof |
| **Description** | Display total scopes generated or users served: "Join 1,200+ Australian homeowners who've created professional scopes." Updates as real count grows. |
| **When it fires** | Landing page view, paywall/preview page. Reinforces that others trust ScopeAI. |
| **Expected impact** | **Medium** -- Social proof increases conversion 5-15% in consumer products. Critical at scale, limited value at launch with low numbers. |
| **Implementation effort** | **Low** -- Convex query to count projects with `status: "paid"`. |
| **Priority score** | MEDIUM / LOW = **Post-launch (when count is credible)** |
| **Implementation notes** | Add a Convex query `getPaidProjectCount` that returns `projects.filter(status === "paid").length`. Display on landing page and preview step. Don't show until count exceeds 100 (low numbers hurt more than help). Use round numbers: "1,200+" not "1,247". Consider showing per-project-type: "850+ kitchen scopes generated." |
| **PostHog event** | `posthog.capture('social_proof_viewed', { count: number, location: string })` |

---

#### EXT-04: Friend/Family Word-of-Mouth Recommendation

| Field | Value |
|-------|-------|
| **Type** | External -- Relationship trigger |
| **Description** | A friend or family member who used ScopeAI recommends it: "I used this thing called ScopeAI for my kitchen reno. It showed me all the trades I needed and my quotes finally made sense." The new user arrives with pre-built trust. |
| **When it fires** | Pre-funnel. New user visits based on personal recommendation. Often arrives via direct URL or referral link. |
| **Expected impact** | **HIGH** -- Referred users convert at 2-5x organic. Trust is pre-established. This is the target growth engine (20%+ organic referrals per PRD). |
| **Implementation effort** | **Medium** -- Requires referral link system and share prompts. |
| **Priority score** | HIGH / MEDIUM = **Post-launch Month 1** |
| **Implementation notes** | Add referral link generation to `ScopeHeader.tsx` post-purchase: "Know someone renovating? Share your recommendation." Link format: `scopeai.com.au?ref=USER_ID`. Track referral attribution in `projects` table (optional `referredBy` field). Post-purchase email includes: "Share ScopeAI with friends who are renovating." Keep it simple -- no complex referral reward system in MVP. |
| **PostHog event** | `posthog.capture('referral_link_generated')`, `posthog.capture('referral_link_shared', { method: 'copy' | 'email' | 'sms' })`, `posthog.capture('referral_landing', { ref_user_id })` |

---

#### EXT-05: PDF Branding / Tradie Referral

| Field | Value |
|-------|-------|
| **Type** | External -- Product-embedded trigger |
| **Description** | Every PDF generated by ScopeAI includes branding on every page footer: "Generated by ScopeAI.com.au -- Get comparable renovation quotes in under 10 minutes." When a tradie receives this PDF, they see the branding. If impressed by scope quality, they recommend ScopeAI to other clients. |
| **When it fires** | Post-purchase, when homeowner sends scope to tradies. The trigger fires for the TRADIE, who then becomes a referral channel to other homeowners. |
| **Expected impact** | **HIGH** -- Passive, viral distribution. Every scope sent to 3 tradies means 3 impressions. If 5% of tradies recommend ScopeAI, that's a compounding referral loop. |
| **Implementation effort** | **Low** -- PDF footer text in `@react-pdf/renderer` templates. |
| **Priority score** | HIGH / LOW = **MVP Day 1** |
| **Implementation notes** | In PDF template components, add footer to every page: `<Text style={styles.footer}>Generated by ScopeAI.com.au | Get comparable renovation quotes in under 10 minutes</Text>`. Cover page includes: "This scope was created so you can provide an accurate, comparable quote." Consider adding a QR code linking to `scopeai.com.au/for-tradies` (V2). |
| **PostHog event** | `posthog.capture('pdf_downloaded', { trade_type, includes_branding: true })` -- indirect. Direct tradie tracking requires V2 tradie landing page with UTM. |

---

#### EXT-06: "Your Scope is Waiting" Abandoned Wizard Email

| Field | Value |
|-------|-------|
| **Type** | External -- Re-engagement notification |
| **Description** | User started the wizard (uploaded photos, answered questions) but didn't complete payment. 24 hours later: "Your [kitchen] scope is 70% ready. Pick up where you left off." Reminds them of invested effort. |
| **When it fires** | 24 hours after wizard abandonment at Step 2+ (photos uploaded). Only fires if user has an account (Step 4+ reached) OR provided email during partial signup. |
| **Expected impact** | **HIGH** -- Re-engagement emails for abandoned funnels typically recover 5-15% of drop-offs. ScopeAI's high investment (photos + questions) makes sunk cost particularly strong. |
| **Implementation effort** | **Medium** -- Requires Convex scheduled function + Resend integration + email template. |
| **Priority score** | HIGH / MEDIUM = **Post-launch Month 1** |
| **Implementation notes** | Convex scheduled function (cron) runs daily. Query: `projects WHERE status = "draft" AND _creationTime > 24h ago AND _creationTime < 72h ago`. For each, send via Resend: subject "Your [projectType] renovation scope is almost ready", body includes project type, suburb, photo count, deep link to `/create?step=N&resume=PROJECT_ID`. Send max 3 emails: 24h, 72h, 7 days. Then stop. No urgency language. Tone: helpful reminder, not pushy sales. |
| **PostHog event** | `posthog.capture('reengagement_email_sent', { step_abandoned, project_type, email_sequence: 1|2|3 })`, `posthog.capture('reengagement_email_opened')`, `posthog.capture('reengagement_email_clicked')` |

---

#### EXT-07: "Your Scope is Ready -- Complete Payment" Email

| Field | Value |
|-------|-------|
| **Type** | External -- Re-engagement notification |
| **Description** | User completed generation and saw the preview (Step 6) but didn't pay. 24 hours later: "Your [kitchen] scope with 7 trades and 53 items is waiting. Unlock it for $99." They've already seen the preview -- this reminds them of specific value. |
| **When it fires** | 24 hours after preview view without payment. Only for projects with `status: "generated"`. |
| **Expected impact** | **HIGH** -- These users are the warmest leads. They've seen exactly what they'd get. Recovery rate should be higher than general abandonment. |
| **Implementation effort** | **Medium** -- Same infrastructure as EXT-06 but different query and template. |
| **Priority score** | HIGH / MEDIUM = **Post-launch Month 1** |
| **Implementation notes** | Query: `projects WHERE status = "generated" AND _creationTime > 24h ago`. Email includes: trade count, total item count, 1 sample item from their specific scope, deep link to `/create?step=6&project=PROJECT_ID`. Include money-back guarantee mention. Single email only (no sequence -- if they don't convert after seeing the preview AND getting a reminder, more emails won't help). |
| **PostHog event** | `posthog.capture('payment_reminder_email_sent', { trade_count, item_count })`, `posthog.capture('payment_reminder_email_clicked')` |

---

#### EXT-08: "Second Room" Post-Purchase Email

| Field | Value |
|-------|-------|
| **Type** | External -- Cross-sell notification |
| **Description** | 7 days after scope purchase: "How's the [kitchen] renovation planning going? When you're ready, your bathroom scope starts with your details already filled in." |
| **When it fires** | 7 days post-payment. Gives user time to act on their first scope before suggesting the next. |
| **Expected impact** | **Medium** -- Multi-room conversion is the primary revenue multiplier. Even 5-10% take rate on second room is significant. |
| **Implementation effort** | **Low** -- Simple time-delayed email via Convex scheduled function. |
| **Priority score** | MEDIUM / LOW = **Post-launch Month 1** |
| **Implementation notes** | Query: `projects WHERE status = "paid" AND paidAt > 7 days ago`. Exclude users who already have a second project. Email includes: previous project summary, list of other room types, "Start in under 5 minutes" CTA to `/create` (where property details will pre-fill). Subject: "Planning to renovate another room, [name]?" One email only. |
| **PostHog event** | `posthog.capture('second_room_email_sent', { first_project_type })`, `posthog.capture('second_room_email_clicked')`, `posthog.capture('second_room_started', { first_project_type, second_project_type })` |

---

#### EXT-09: Renovation Progress Check-in Email

| Field | Value |
|-------|-------|
| **Type** | External -- Retention / goodwill |
| **Description** | 30 days after purchase: "How's the [kitchen] renovation going? Your scope is always available in your account." No upsell. Just helpful reminder + feedback prompt. |
| **When it fires** | 30 days post-payment. |
| **Expected impact** | **Low** -- Doesn't directly drive revenue. Builds brand goodwill and keeps ScopeAI in mind for referrals. |
| **Implementation effort** | **Low** -- Simple scheduled email. |
| **Priority score** | LOW / LOW = **Post-launch Month 2** |
| **Implementation notes** | Simple email: "Your scope is here: [dashboard link]. Was it helpful? [Quick 1-click rating]." Include: "If you're planning another room, your details are saved." Collect qualitative feedback for testimonials and product improvement. |
| **PostHog event** | `posthog.capture('checkin_email_sent')`, `posthog.capture('checkin_email_clicked')`, `posthog.capture('checkin_feedback_submitted', { rating: 1-5 })` |

---

#### EXT-10: Seasonal Renovation Email

| Field | Value |
|-------|-------|
| **Type** | External -- Timed re-engagement |
| **Description** | Annual email in September-October (AU spring, peak renovation season): "Renovation season is here. Planning another room? Your property details are saved." |
| **When it fires** | Once per year, to all users with at least one paid project. |
| **Expected impact** | **Low** -- Very long cycle. May recover some users planning next renovation phase. |
| **Implementation effort** | **Low** -- One-off scheduled campaign. |
| **Priority score** | LOW / LOW = **Growth (Month 6+)** |
| **Implementation notes** | Annual campaign via Resend. Segment by: users with 1 project (upsell second room), users with multiple projects (check-in + referral ask). Include seasonal content: "Spring is the most popular time to start renovations in Australia." Respect unsubscribe preferences. |
| **PostHog event** | `posthog.capture('seasonal_email_sent', { segment })`, `posthog.capture('seasonal_email_clicked')` |

---

#### EXT-11: SEO Guide Contextual CTA

| Field | Value |
|-------|-------|
| **Type** | External -- Content-embedded trigger |
| **Description** | Each SEO guide page (e.g., `/guides/kitchen-renovation-scope`) contains contextual CTAs throughout the content: "Want a professional kitchen scope? Generate yours in under 10 minutes." |
| **When it fires** | During content consumption. User is reading about renovation planning and encounters a natural transition to the product. |
| **Expected impact** | **Medium** -- SEO guides build authority and drive organic traffic. Contextual CTAs convert warm readers. |
| **Implementation effort** | **Medium** -- Requires creating SEO guide content. CTA components are simple. |
| **Priority score** | MEDIUM / MEDIUM = **Post-launch Month 2-3** |
| **Implementation notes** | Guide pages at `app/(marketing)/guides/[slug]/page.tsx`. Each guide addresses a specific keyword. CTA component: teal-bordered card with project-type icon, headline, and "Start My Scope" button. Place 2-3 CTAs per guide (after intro, mid-content, conclusion). Server-rendered for SEO. |
| **PostHog event** | `posthog.capture('guide_cta_clicked', { guide_slug, cta_position: 'intro' | 'mid' | 'conclusion' })` |

---

#### EXT-12: "Generated by ScopeAI" Shareable Link

| Field | Value |
|-------|-------|
| **Type** | External -- Product-embedded viral trigger |
| **Description** | V2 feature: user can share a read-only scope link with tradies instead of / in addition to PDF. Link shows ScopeAI branding prominently. Tradie clicks around, sees quality, considers recommending to other clients. |
| **When it fires** | Post-purchase, when user shares scope with tradies via link. |
| **Expected impact** | **Medium** -- More interactive than PDF branding. Tradie can explore the full scope online. |
| **Implementation effort** | **High** -- Requires public scope view route, access control (link-based auth), and read-only scope rendering. |
| **Priority score** | MEDIUM / HIGH = **Growth (V2)** |
| **Implementation notes** | Route: `/scope/[projectId]/shared?token=SHARE_TOKEN`. Generates a unique share token stored on the project. Shared view is read-only (no toggles, no download). Shows ScopeAI branding header and footer. Tradie sees a "Create a scope for your next project" CTA. |
| **PostHog event** | `posthog.capture('scope_shared_link_created')`, `posthog.capture('scope_shared_link_viewed', { viewer_type: 'homeowner' | 'tradie' | 'unknown' })` |

---

#### EXT-13: Tradie Landing Page (`/for-tradies`)

| Field | Value |
|-------|-------|
| **Type** | External -- B2B2C acquisition page |
| **Description** | Dedicated page explaining why tradies should recommend ScopeAI to their clients. Benefits: faster quoting, fewer disputes, clients who know what they want. |
| **When it fires** | When a tradie lands on ScopeAI (via PDF branding, shareable link, or direct search). |
| **Expected impact** | **Medium** -- Creates a formal tradie referral channel. Converts passive PDF impressions into active recommendations. |
| **Implementation effort** | **Medium** -- New page with tradie-specific copy. No backend changes. |
| **Priority score** | MEDIUM / MEDIUM = **Growth (Month 3+)** |
| **Implementation notes** | Static page at `app/(marketing)/for-tradies/page.tsx`. Copy targets tradies: "Your clients arrive with a professional scope. You quote accurately. No more 'but I thought that was included.'" Include: sample scope preview, testimonials from tradies (when available), "Recommend ScopeAI to your clients" shareable link. No signup required for tradies. |
| **PostHog event** | `posthog.capture('tradie_page_viewed', { source: utm_source })` |

---

### INTERNAL TRIGGERS

---

#### INT-01: Budget Anxiety ("I'm going to get ripped off")

| Field | Value |
|-------|-------|
| **Type** | Internal -- Fear/anxiety |
| **Description** | The dominant emotional driver. Homeowner fears hidden costs, surprise variations, and quotes they can't compare. This anxiety is triggered by: getting wildly different quotes, reading about budget blowouts, hearing friends' renovation horror stories, or simply contemplating the financial commitment. |
| **When it fires** | Pre-funnel (drives initial search) and mid-funnel (drives payment conversion). Resurfaces whenever the homeowner thinks about their renovation budget. |
| **Expected impact** | **HIGH** -- This is THE emotional trigger that makes ScopeAI necessary. Every piece of copy and every product feature either alleviates or amplifies this anxiety. |
| **Implementation effort** | **Low** -- Copy and positioning, not engineering. |
| **Priority score** | HIGH / LOW = **MVP Day 1** |
| **Implementation notes** | Landing page hero must name this anxiety directly: "78% of renovations go over budget because tradies quote different things." Position ScopeAI as the anxiety-reliever, not the anxiety-amplifier. Preview step: show trade count and item count ("7 trades, 53 items") to communicate thoroughness. Post-purchase: compliance notes and exclusion lists reinforce "we caught everything." CRITICAL: never use fear-based urgency tactics ("act now before prices rise!"). Acknowledge the fear, provide the antidote. |
| **PostHog event** | Indirect. Track landing page conversion by keyword category: `posthog.capture('wizard_started', { keyword_intent: 'budget' | 'comparison' | 'planning' | 'general' })`. Post-purchase NPS: "How confident are you that your renovation will stay on budget?" |

---

#### INT-02: Overwhelm ("I don't know where to start")

| Field | Value |
|-------|-------|
| **Type** | Internal -- Cognitive overload |
| **Description** | First-time renovator feels paralysed by the complexity. Which trades do I need? What order? What's a rough-in? What's an IC-4 rated downlight? The knowledge gap feels insurmountable. |
| **When it fires** | Pre-funnel (drives search for guidance) and early funnel (drives wizard engagement -- each question resolves a knowledge gap). |
| **Expected impact** | **HIGH** -- The wizard's structure is the direct antidote to overwhelm. Tap-to-answer questions replace the need to "figure it out." |
| **Implementation effort** | **Low** -- Already built into wizard design. Refinement only. |
| **Priority score** | HIGH / LOW = **MVP Day 1** |
| **Implementation notes** | Question intro screen: "12 quick questions about your kitchen. Most people finish in under 2 minutes." Progress bar with phase labels chunks the journey. "Not sure yet" on every question removes decision paralysis. Tooltips explain jargon ("Why we ask this: Induction cooktops need a dedicated 32A circuit"). Post-purchase sequencing plan is the ultimate overwhelm-resolver. |
| **PostHog event** | `posthog.capture('not_sure_selected', { question_id })` -- high "Not sure" rates indicate overwhelm points that may need better question copy. Track `posthog.capture('tooltip_expanded', { question_id })` for knowledge gap signals. |

---

#### INT-03: Comparison Frustration ("These quotes are all different")

| Field | Value |
|-------|-------|
| **Type** | Internal -- Problem-aware seeking solution |
| **Description** | User has received 2-3 quotes that cover different items, include different exclusions, and range from $28K to $62K. They cannot make a rational comparison. This frustration drives them to search for a standardisation tool. |
| **When it fires** | Pre-funnel (highest purchase intent trigger -- user has already committed to renovating). |
| **Expected impact** | **HIGH** -- Users with this trigger have the shortest path to payment. They already understand the problem and want the solution. |
| **Implementation effort** | **Low** -- Copy targeting + SEO content. |
| **Priority score** | HIGH / LOW = **MVP Day 1** |
| **Implementation notes** | SEO target: "how to compare renovation quotes australia", "builder quote comparison template". Landing page should have a visual showing 3 different quotes side by side (messy) vs ScopeAI scope (clean, line-itemised). The exclusions section in every trade scope directly addresses this trigger. Quote comparison sheets (Trade Manager mode output) are the product feature that resolves this trigger. |
| **PostHog event** | `posthog.capture('landing_page_view', { intent: 'comparison' })` based on UTM/keyword tracking. |

---

#### INT-04: Social Anxiety ("I don't want to look stupid in front of the tradie")

| Field | Value |
|-------|-------|
| **Type** | Internal -- Social fear |
| **Description** | Homeowner feels intimidated by construction professionals. They worry about mispronouncing terms, asking obvious questions, or being taken advantage of because they clearly don't know what they're talking about. |
| **When it fires** | Pre-funnel (drives desire for professional-looking document) and post-purchase (scope in hand gives confidence for tradie conversations). |
| **Expected impact** | **Medium** -- Secondary to budget anxiety but reinforces it. The scope is both a planning tool and a confidence prop. |
| **Implementation effort** | **Low** -- PDF formatting and scope language. |
| **Priority score** | MEDIUM / LOW = **MVP Day 1** |
| **Implementation notes** | PDF must look professional -- clean typography, consistent formatting, ScopeAI branding (not clip-art or templates). Include on the scope cover page: "How to use this scope: Hand this to each tradie and ask them to quote against every line item." This scripted instruction removes the "what do I say?" anxiety. Scope uses correct industry terminology (tradies take it seriously) but the web view has tooltip explanations (homeowner understands it). |
| **PostHog event** | NPS survey: "How confident do you feel showing this scope to tradies?" (1-10). |

---

#### INT-05: Decision Regret Fear ("What if I choose wrong?")

| Field | Value |
|-------|-------|
| **Type** | Internal -- Anticipatory regret |
| **Description** | The fear of making an irreversible expensive mistake. "What if I pick the wrong benchtop?" "What if I should have kept the wall?" Renovation decisions feel permanent and costly to reverse. |
| **When it fires** | During wizard questions (each answer feels consequential) and post-purchase (toggle decisions). |
| **Expected impact** | **Medium** -- Can cause wizard abandonment if questions feel too permanent. Addressed by "Not sure yet" options and scope editability. |
| **Implementation effort** | **Low** -- Already addressed in wizard design. |
| **Priority score** | MEDIUM / LOW = **MVP Day 1** |
| **Implementation notes** | Every question has "Not sure yet" (uses sensible default, flagged as TBC in scope). Scope items are toggleable post-purchase (nothing is permanent). Include reassurance copy: "You can customise your scope after it's generated. Nothing is final." The scope itself lists alternatives when appropriate ("If you're considering natural stone vs engineered stone, here's how the scope changes"). |
| **PostHog event** | `posthog.capture('scope_item_toggled', { action, trade_type })` -- high toggle rates may indicate users felt locked into wrong decisions. |

---

#### INT-06: Control Desire ("I want to be in charge of my renovation")

| Field | Value |
|-------|-------|
| **Type** | Internal -- Autonomy need |
| **Description** | Particularly strong in Trade Manager users (76%). They don't want a builder making all decisions. They want to understand, plan, and coordinate themselves. ScopeAI gives them the tools to do this competently. |
| **When it fires** | Mode selection (choosing Trade Manager), question flow (making specific choices), post-purchase (customising scope, choosing which tradies to engage). |
| **Expected impact** | **Medium** -- Drives engagement with the detailed features (sequencing plan, coordination checklist, item toggles). Users who feel in control are more satisfied and more likely to refer. |
| **Implementation effort** | **Low** -- Product design already supports this. Reinforce in copy. |
| **Priority score** | MEDIUM / LOW = **MVP Day 1** |
| **Implementation notes** | Mode selection card for Trade Manager: "Take control of your renovation. Get individual trade scopes, a sequencing plan, and a coordination checklist." Post-purchase, emphasise user agency: "Your scope, your way. Toggle items, add notes, download when you're ready." The coordination checklist particularly serves this trigger -- it's a professional tool that puts the homeowner in the project manager seat. |
| **PostHog event** | `posthog.capture('mode_selected', { mode })`. Track Trade Manager engagement depth: `posthog.capture('sequencing_plan_viewed')`, `posthog.capture('coordination_checklist_viewed')`. |

---

#### INT-07: Curiosity ("What does my renovation actually involve?")

| Field | Value |
|-------|-------|
| **Type** | Internal -- Information seeking |
| **Description** | Lighter than anxiety. Some users are in early research mode -- they want to understand what their renovation entails before committing. "How many trades does a kitchen reno need? What does a plumbing scope look like?" |
| **When it fires** | Pre-funnel (SEO research queries), scope preview (curiosity gap drives conversion). |
| **Expected impact** | **Medium** -- These users are earlier in the purchase cycle. They may not convert immediately but the preview creates a powerful information gap. |
| **Implementation effort** | **Low** -- Preview design already creates the curiosity gap. |
| **Priority score** | MEDIUM / LOW = **MVP Day 1** |
| **Implementation notes** | Preview is the curiosity engine: "Your kitchen renovation requires 7 trades and 53 scope items." Showing 2 items and locking 51 creates maximum information gap. SEO guides serve the research phase: "What trades do you need for a kitchen renovation?" with a natural handoff to the tool. Free value (education) builds trust for eventual paid conversion. |
| **PostHog event** | `posthog.capture('preview_viewed', { trade_count, item_count, time_on_preview_seconds })`. Long dwell time + no payment suggests curiosity-stage user who may return later. |

---

#### INT-08: Excitement ("I'm actually doing this renovation!")

| Field | Value |
|-------|-------|
| **Type** | Internal -- Positive anticipation |
| **Description** | Not all emotional triggers are negative. Some users are genuinely excited about their renovation and want to plan it properly. Creating a scope feels like making progress on their dream kitchen/bathroom. |
| **When it fires** | During wizard (each step feels like tangible progress), generation (watching trades appear), post-purchase (holding a professional document). |
| **Expected impact** | **Low-Medium** -- Positive emotion improves completion rates and satisfaction, but it's secondary to the anxiety/overwhelm triggers that drive acquisition. |
| **Implementation effort** | **Low** -- Subtle copy and micro-interaction choices. |
| **Priority score** | LOW / LOW = **Nice to have** |
| **Implementation notes** | Progress bar completion moments should feel satisfying (spring animation with slight overshoot). Generation state shows trades appearing one by one (builds anticipation). Scope header: "Your Kitchen Renovation Scope -- Paddington, NSW" personalised to feel like THEIR project. Don't over-celebrate (no confetti, no "Congratulations!") but do acknowledge: "Your scope is ready. Here's what your renovation involves." |
| **PostHog event** | Indirect. Track wizard completion speed -- excited users complete faster. `posthog.capture('wizard_completed', { total_time_seconds })`. |

---

## Ranked Trigger Summary by Priority

### Tier 1: MVP (Launch Day)

These triggers must be active on day one. They are the core acquisition and conversion mechanics.

| ID | Trigger | Type | Impact | Effort |
|----|---------|------|--------|--------|
| EXT-02 | "Start My Scope -- Free Preview" CTA | External | High | Low |
| EXT-05 | PDF branding / tradie referral | External | High | Low |
| INT-01 | Budget anxiety (copy + positioning) | Internal | High | Low |
| INT-02 | Overwhelm (wizard structure) | Internal | High | Low |
| INT-03 | Comparison frustration (copy + SEO) | Internal | High | Low |
| INT-04 | Social anxiety (PDF professionalism) | Internal | Medium | Low |
| INT-05 | Decision regret (Not sure + toggles) | Internal | Medium | Low |
| INT-06 | Control desire (Trade Manager copy) | Internal | Medium | Low |
| INT-07 | Curiosity (preview info gap) | Internal | Medium | Low |
| EXT-01 | SEO organic search | External | High | Medium |

**Total items:** 10
**Dev effort:** Mostly copy, positioning, and design decisions. PDF footer is the only net-new feature.

---

### Tier 2: Post-Launch (Month 1-3)

These triggers require backend work (scheduled functions, email templates) but have high ROI.

| ID | Trigger | Type | Impact | Effort |
|----|---------|------|--------|--------|
| EXT-06 | "Your scope is waiting" abandoned wizard email | External | High | Medium |
| EXT-07 | "Complete payment" preview abandonment email | External | High | Medium |
| EXT-04 | Word-of-mouth referral link system | External | High | Medium |
| EXT-08 | "Second room" post-purchase email | External | Medium | Low |
| EXT-03 | Social proof counter | External | Medium | Low |
| EXT-11 | SEO guide contextual CTAs | External | Medium | Medium |
| EXT-09 | 30-day renovation check-in email | External | Low | Low |

**Total items:** 7
**Dev effort:** Convex scheduled functions, Resend email templates, referral link system.

---

### Tier 3: Growth (Month 3+)

These triggers scale with user base and require more substantial features.

| ID | Trigger | Type | Impact | Effort |
|----|---------|------|--------|--------|
| EXT-13 | Tradie landing page `/for-tradies` | External | Medium | Medium |
| EXT-12 | Shareable scope links | External | Medium | High |
| EXT-10 | Seasonal renovation email | External | Low | Low |
| INT-08 | Excitement (micro-interactions) | Internal | Low | Low |

**Total items:** 4
**Dev effort:** Tradie page is a new marketing page. Shareable links require access control and a new route.

---

## Email Trigger Cadence (Anti-Spam Rules)

To prevent over-notification (Anti-Pattern AP-3 from the mapping doc), enforce these rules:

| Scenario | Max Emails | Timing | Stop Condition |
|----------|-----------|--------|---------------|
| Abandoned wizard (EXT-06) | 3 | 24h, 72h, 7d | User returns OR 7 days elapsed |
| Abandoned preview (EXT-07) | 1 | 24h | User pays OR 24h elapsed |
| Second room prompt (EXT-08) | 1 | 7 days post-purchase | User starts second project |
| Check-in (EXT-09) | 1 | 30 days post-purchase | Always single send |
| Seasonal (EXT-10) | 1 | Once per year (September) | Unsubscribed users excluded |

**Total maximum emails per user lifecycle:** 7 emails across the entire relationship (3 abandoned + 1 payment reminder + 1 second room + 1 check-in + 1 seasonal). This is deliberately conservative.

---

## PostHog Event Naming Convention

All trigger-related events follow this pattern:

```
{trigger_category}_{specific_action}

Categories:
- landing_*       — Landing page interactions
- wizard_*        — Wizard progression
- preview_*       — Scope preview interactions
- payment_*       — Payment flow
- scope_*         — Post-purchase scope interactions
- email_*         — Email triggers (sent, opened, clicked)
- referral_*      — Referral system
- guide_*         — SEO guide interactions
```

Standard properties on all events:
```typescript
{
  project_type?: string,    // "kitchen", "bathroom", etc.
  project_id?: string,
  mode?: string,            // "trades" | "builder"
  pricing_tier?: string,    // "starter" | "professional" | "premium"
  is_returning_user: boolean,
  days_since_signup?: number
}
```

---

*This inventory should be cross-referenced with `RESEARCH-hook-model-scopeai-mapping.md` for the full context on how each trigger fits into the Hook Model's four phases. Implementation should follow the tier ordering: MVP triggers first, then post-launch, then growth.*
