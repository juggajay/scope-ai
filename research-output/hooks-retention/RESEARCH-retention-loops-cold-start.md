# Retention Loops -- Cold Start Strategy

**Date:** February 2026
**Purpose:** ScopeAI launches with zero users, zero social proof, zero referrals. This document defines which loops work at zero scale, how to bootstrap each one, and the sequencing to go from 0 to 100 to 1,000 users.

---

## 1. Which Loops Work at Zero Scale (Day 1)?

Not all loops require existing users. Here is every loop from the mapping document rated by its day-1 viability.

| Loop | Works at Zero? | Why / Why Not |
|------|---------------|---------------|
| SEO Content | YES | Content ranks regardless of user count. Google doesn't care how many users you have. |
| Progress + Sunk Cost | YES | Built into wizard UX. Works for the very first user. |
| Curiosity Gap | YES | Preview mechanics work for any individual user. |
| Personalisation | YES | AI generates personalised scope for every user independently. |
| Social Proof | NO | "Join 0 homeowners" is worse than nothing. |
| Tradie Referral | PARTIALLY | Works as soon as first PDF is emailed. But volume too low to compound. |
| Word-of-Mouth | PARTIALLY | First user can tell friends. But renovation cycles are long -- months before this kicks in. |
| Multi-Room | NO | Need repeat users. Won't happen until weeks after launch. |
| Renovation Lifecycle | NO | Need users who have started renovating. Weeks/months lag. |
| Update/Re-engagement | NO | Need a user base to re-engage. Nothing to update yet. |
| Tier Upsell | NO | Need returning users. |
| Referral-Revenue | NO | Need transaction volume to make economics work. |
| Content-Commerce | YES | Same as SEO Content -- content converts independently. |

**Day 1 Playbook:** Focus entirely on SEO Content + Engagement Loops (Progress, Curiosity, Personalisation). These work at any scale.

---

## 2. Bootstrap Tactics Per Loop Type

### 2.1 SEO Content -- Pre-Launch Preparation

**What:** Publish 5-8 guides BEFORE launch day. Let them start indexing.

**Specific guides to write (mapped to target keywords):**

| Guide Title | Target Keyword | Project Type |
|-------------|---------------|-------------|
| "Kitchen Renovation Scope of Works Template (Australia 2026)" | kitchen renovation scope template australia | kitchen |
| "Bathroom Renovation Checklist -- What Your Tradie Needs" | bathroom renovation checklist australia | bathroom |
| "How to Compare Builder Quotes: The Apples-to-Apples Method" | how to compare builder quotes | general |
| "What Trades Do You Need for a Kitchen Renovation?" | kitchen renovation trades needed | kitchen |
| "Renovation Sequencing Guide: Which Trade Comes First?" | renovation trade sequencing order | general |
| "What to Include in a Renovation Scope of Works" | what to include renovation scope | general |
| "How to Brief a Builder (So Your Quote Is Accurate)" | how to brief a builder | general |
| "Laundry Renovation Guide: Costs, Trades, and Scope" | laundry renovation guide australia | laundry |

**Where:** `/guides/{slug}` route, server-rendered for SEO. Each guide is 1500-2500 words of genuine value.

**Implementation:**
- Write guides as MDX files in `app/(marketing)/guides/`
- Each guide includes a "Generate Your Personalised Scope" CTA linking to `/create?utm_source=guide&utm_content={slug}`
- Internal links between guides (helps Google understand site structure)
- Schema.org `HowTo` or `Article` structured data
- Submit sitemap to Google Search Console on launch day

**Timeline:**
- Week -2: Write all 8 guides
- Week -1: Publish, submit sitemap, request indexing
- Launch day: Guides are live and crawlable
- Week 2+: Check Search Console, iterate titles/descriptions based on impressions

**Why this works at zero scale:** Google ranks content based on quality, relevance, and technical SEO -- not user count. A well-written guide about kitchen renovation scopes will rank whether you have 0 or 10,000 users.

---

### 2.2 Social Proof -- Minimum Viable Credibility

**The problem:** "Join 5,000+ homeowners" is a lie when you have 3 users. "Join 3 homeowners" is counterproductive.

**Ethical approaches (ranked by recommendation):**

#### Approach A: Standards-Based Trust (Recommended for Day 1)

Show authority signals that are TRUE and don't depend on user count.

```
"Scopes based on Australian Standards AS/NZS 3000, AS 3740, NCC 2022"
"Trade-specific scope documents for 9 construction trades"
"Covering 5 renovation types: Kitchen, Bathroom, Laundry, Living, Outdoor"
```

**Where:** Landing page trust section (LP-05 from PRD). Replace "Join X homeowners" with capabilities-based proof.

**Why it works:** Homeowners don't know how many users you have. They care whether the tool is legitimate. AU Standards references signal legitimacy.

#### Approach B: Scope-Count Framing (After 50+ Scopes)

Once you have 50+ paid scopes, switch to quantity framing but round aggressively:

| Actual Count | Display |
|-------------|---------|
| 0-49 | Don't show a number |
| 50-99 | "50+ renovation scopes generated" |
| 100-499 | "100+ renovation scopes generated" |
| 500-999 | "500+ Australian homeowners" |
| 1,000+ | "X,000+ Australian homeowners" (round to nearest 1,000) |

**Implementation:** Convex scheduled function runs hourly, counts `projects` where `status === "paid"`. Stores count in a `stats` table or environment variable. Landing page reads this value and applies rounding.

#### Approach C: Qualitative Proof (After 10+ Scopes)

Before you have volume, use quality signals:

- "Scope reviewed by licensed trades" (if you get a tradie to review early scopes)
- Real quotes from beta users (even 2-3 is enough if they're genuine)
- Screenshot of a real generated scope (redacted) -- shows the output quality

**When is "curated" data OK vs deceptive?**

| Tactic | Verdict | Reasoning |
|--------|---------|-----------|
| Rounding up user count | OK (standard practice) | "100+" when you have 112 is fine |
| Showing capabilities instead of users | OK | True statements about the product |
| Fake testimonials | NOT OK | Deceptive, violates ACL |
| Invented user count | NOT OK | Deceptive, erodes trust if discovered |
| Beta user quotes with permission | OK | Real feedback, even if small sample |
| "As seen in..." logos you haven't been featured in | NOT OK | Trademark + deception issues |
| "Based on X years of renovation industry data" | CAREFUL | Only if you can substantiate it |

---

### 2.3 Engagement Loops -- Day 1 Optimisation

These loops are baked into the wizard UX. No user base needed. But they need tuning.

**Progress Loop Tuning:**
- Verify PostHog funnel events fire correctly for each step
- Watch first 10 users' funnels closely -- where do they drop?
- Key metric: step-to-step drop-off. Target <15% at each transition.

**Curiosity Loop Tuning:**
- The sample items in preview are CRITICAL. Run 5-10 test generations and evaluate sample quality.
- If sample items are generic ("Install new light switch"), the curiosity gap is too weak. Tune `master-system.md` prompt to produce more specific, surprising items.
- Test with non-technical people: "After seeing this preview, would you pay $99 for the full scope?"

**Personalisation Loop Tuning:**
- Verify that the preview header shows property location ("Kitchen Renovation -- Paddington, NSW")
- Verify that asbestos warnings appear for pre-1990 properties
- Verify that sample items reference user-specific choices (induction cooktop, stone benchtops, etc.)
- If any of these are missing, the scope feels templated and conversion drops.

---

### 2.4 Tradie Referral -- Seeding Strategy

The tradie referral loop needs tradies to see the scope. At launch, this happens organically but slowly. You can accelerate it.

**Tradie-Side Seeding Strategy:**

**Step 1: Identify Target Tradies (Week -1 to Launch)**
- Find 20-30 tradies in Sydney/Melbourne who are active on:
  - hipages (most popular tradie platform in AU)
  - Oneflare
  - Google Business profiles
  - Local Facebook groups ("Sydney Renovations", "Melbourne Home Reno")
- Focus on electricians and plumbers first -- they're on every kitchen/bathroom job and see the most diverse project types.

**Step 2: Cold Outreach (Launch Week)**
- Email/DM template:

> "Hi [Name], I've built a tool that generates scope-of-works docs for homeowners planning renovations. It produces trade-specific scopes (electrical, plumbing, etc.) that homeowners send to tradies like you for quoting.
>
> I'd love your feedback on whether the scopes are detailed enough to actually quote from. Could I send you a sample electrical scope for a kitchen renovation? Takes 2 minutes to review.
>
> If the quality is there, I think your clients would get better briefs -- which means better quotes from you."

- **Key angle:** This helps THEM (better briefs = more accurate quotes = fewer disputes). Not "promote our tool."

**Step 3: Feedback Loop (Week 1-2)**
- Send sample scopes to interested tradies
- Ask: "Could you quote from this? What's missing? What's wrong?"
- This serves two purposes:
  1. Product validation (are scopes actually useful?)
  2. Relationship building (tradies who review become advocates)

**Step 4: Advocate Activation (Week 3-4)**
- Tradies who gave positive feedback get:
  - A simple referral link: `scopeai.com.au/tradie-referral?ref={tradieId}`
  - Business card-sized handout they can give clients: "Get a professional scope before you call for quotes -- scopeai.com.au"
  - If possible, a reciprocal listing: "Recommended tradies in your area" (V3 feature, but plant the seed now)

**Volume expectations:**
- 30 tradies contacted --> 10 respond --> 5 give feedback --> 2-3 become active referrers
- Each active referrer might send 1-2 clients per month
- That's 4-6 referred users per month from this channel alone
- Small but high-quality (pre-qualified, high intent, high trust)

---

## 3. First 100 Users Acquisition Strategy

### Phase 1: Pre-Launch (Week -2 to -1)

| Action | Expected Users | Cost |
|--------|---------------|------|
| Publish 8 SEO guides | 0 (indexing takes weeks) | $0 (time only) |
| Submit to Google Search Console | 0 (prep) | $0 |
| Set up PostHog tracking | 0 (prep) | $0 |
| Contact 30 tradies for feedback | 0 (relationship building) | $0 |

### Phase 2: Launch Week (Week 1)

| Action | Expected Users | Cost |
|--------|---------------|------|
| Post on r/AusRenovation, r/AusProperty | 10-20 visitors, 1-3 conversions | $0 |
| Post in Facebook groups (Sydney/Melbourne reno groups) | 20-40 visitors, 2-5 conversions | $0 |
| Direct outreach to 10 people you know who are renovating | 5-8 visitors, 2-4 conversions | $0 |
| Product Hunt launch | 50-100 visitors, 3-5 conversions | $0 |

**Reddit/Facebook post template:**

> "I built a tool that generates professional scope-of-works documents for renovations. Upload photos of your kitchen/bathroom, answer a few questions, and get trade-specific scopes (electrical, plumbing, carpentry, etc.) you can send to tradies for comparable quotes.
>
> Been working on this for a few months. Would love feedback from anyone planning a reno. First 20 users get 50% off: [link]
>
> Happy to answer questions about the scope quality -- I had licensed tradies review the output."

**Launch discount:** Create a Stripe coupon code for 50% off. Give to first 20-50 users. This does two things:
1. Reduces risk for early adopters (they're testing an unproven product)
2. Creates urgency without fake scarcity ("first 20 users" is a real constraint)

### Phase 3: Weeks 2-4

| Action | Expected Users | Cost |
|--------|---------------|------|
| SEO guides start getting impressions | 20-50 visitors, 2-5 conversions | $0 |
| Tradie referrals start trickling | 5-10 visitors, 2-4 conversions | $0 |
| Word-of-mouth from launch users | 5-10 visitors, 1-3 conversions | $0 |
| Targeted Google Ads test ($5/day) | 100-200 clicks, 3-6 conversions | $150/month |

**Google Ads test:** Run a small test on exact-match keywords: "kitchen renovation scope template", "renovation scope of works". $5/day budget. Purpose: validate keyword intent and conversion rate, not scale. If CPA < $30, double down. If CPA > $50, stop and focus on SEO.

### Phase 4: Month 2-3

| Action | Expected Users | Cost |
|--------|---------------|------|
| SEO traffic compounding | 100-300 visitors/month, 5-15 conversions | $0 |
| Activate social proof counter (50+ scopes) | Conversion rate improvement | $0 |
| Publish 4 more guides | Incremental SEO traffic | $0 |
| NPS survey --> testimonials | Qualitative proof for landing page | $0 |
| Multi-room prompts activated | 5-10% of paid users return | $0 |

### Cumulative Projections

| End of... | Total Paid Users | Monthly Revenue (at $90 avg) | Primary Source |
|-----------|-----------------|------------------------------|---------------|
| Week 1 | 5-12 | $450-1,080 | Direct outreach + communities |
| Month 1 | 20-40 | $1,800-3,600 | Communities + early SEO |
| Month 2 | 50-80 | $2,500-4,000 | SEO + referrals starting |
| Month 3 | 80-150 | $3,500-6,000 | SEO compounding + referrals |
| Month 6 | 200-500 | $6,000-15,000 | SEO + referrals + multi-room |

These are conservative estimates. The key variable is scope quality -- if it's genuinely useful, word-of-mouth accelerates everything.

---

## 4. Loop Activation Sequencing

### Sequence 1: Before Launch

```
1. SEO Content Loop: Publish guides, submit sitemap
2. Engagement Loops: Verify wizard UX, tune sample items, set up PostHog
3. Trust Signals: Australian Standards references on landing page
```

### Sequence 2: Launch Day to Week 2

```
4. Community Seeding: Reddit, Facebook, direct outreach
5. Tradie Seeding: Contact tradies for feedback
6. Curiosity Gap: Monitor preview-to-payment conversion, tune if <30%
7. Progress Loop: Monitor step drop-off, fix any >20% drops
```

### Sequence 3: Week 2 to Month 1

```
8. Social Proof: Switch to scope count display (when >50)
9. Tradie Referral: Activate tradie referral flow
10. Word-of-Mouth: Add share mechanism post-payment
11. NPS Survey: Trigger 7 days after payment
```

### Sequence 4: Month 1 to Month 3

```
12. Multi-Room Loop: Add pre-fill + "start another room" CTA
13. Renovation Lifecycle: Launch email cadence
14. Content-Commerce: Publish 4 more guides
15. Tier Upsell: Track tier selection patterns
```

### Sequence 5: Month 3+

```
16. Referral-Revenue: Launch credit system
17. Update/Re-engagement: Standards update emails
18. Google Ads: Scale if CPA is acceptable
```

---

## 5. Minimum Viable Social Proof by Stage

| Stage | User Count | What to Show | What NOT to Show |
|-------|-----------|--------------|------------------|
| Pre-launch | 0 | "Based on Australian Standards" + "9 trade-specific scopes" + "Professional renovation planning" | Any user count |
| Beta | 1-20 | "Beta: Help us improve" badge + real user quote if available | "Join X users" |
| Early | 20-50 | 1-2 testimonials (real, with permission) + standards badges | User count (too small) |
| Growing | 50-200 | "X+ renovation scopes generated" (rounded) + testimonials | Exact counts |
| Established | 200+ | "X,000+ Australian homeowners trust ScopeAI" + testimonials + case studies | Nothing -- show everything |

**Testimonial capture process:**
1. NPS survey fires 7 days after payment (PostHog feature flag)
2. If NPS >= 9: Follow-up email asking for a 1-2 sentence testimonial
3. If NPS >= 9 and they respond: Ask permission to use on website
4. Display on landing page with first name + suburb + project type
5. Example: "Sarah M. -- Kitchen, Paddington NSW: 'I finally got three comparable quotes. First time ever.'"

---

## 6. What to Do When a Loop Isn't Working

Each loop has a failure mode. Here's the diagnostic flow:

### SEO Loop Not Working (No organic traffic after 4 weeks)

1. Check Search Console: Are pages indexed? Any crawl errors?
2. Check keyword difficulty: Are targets too competitive?
3. Check content quality: Is there enough depth (1500+ words)?
4. Pivot: Try long-tail keywords ("kitchen renovation scope template sydney" instead of "kitchen renovation")

### Engagement Loop Not Working (High wizard drop-off)

1. Check PostHog funnel: Which step has >20% drop-off?
2. Step 0 (mode): Cards unclear? Add "not sure" helper
3. Step 2 (photos): Upload failing? Mobile camera not working? Check error logs
4. Step 3 (questions): Too many questions? Check completion time vs drop-off
5. Step 4 (auth): Sign-up friction? Simplify form, consider delaying auth to post-payment
6. Step 5-6 (generation/preview): Scope quality issue? Review sample items manually

### Conversion Loop Not Working (Wizard completions but low payment)

1. Check preview quality: Are sample items specific and surprising?
2. Check pricing: Is $99 too high for the perceived value? Test $79.
3. Check tier presentation: Is Professional clearly the best value?
4. Check trust signals: Money-back guarantee visible? Stripe badges present?
5. A/B test: Show 2 sample items instead of 1. Does conversion improve?

### Referral Loop Not Working (No organic referrals after 3 months)

1. Check NPS: If < 50, it's a product quality problem, not a referral problem
2. Check PDF branding: Is "Generated by ScopeAI" visible and clickable?
3. Check sharing UX: Is there an easy share button post-payment?
4. Talk to users: Do they mention ScopeAI to friends? If not, why not?

---

## 7. Budget Allocation (First 6 Months)

ScopeAI is bootstrapped. Every dollar matters.

| Category | Monthly Budget | Purpose |
|----------|---------------|---------|
| Google Ads (test) | $150 | Keyword validation, CPA benchmarking |
| PostHog | $0 (free tier) | Analytics, funnels, feature flags (free up to 1M events/month) |
| Resend | $0 (free tier) | Email delivery (free up to 3,000 emails/month) |
| Gemini API | ~$50-100 | Scope generation costs (per usage) |
| Stripe | 2.9% + $0.30 per transaction | Payment processing |
| Vercel | $0 (Hobby) or $20 (Pro) | Hosting |
| Content production | $0-200 | Guides (self-written or AI-assisted) |
| **Total** | **$200-470/month** | |

**Revenue needed to be self-sustaining:** ~5-6 scopes/month at $90 avg = $450-540/month. Achievable within Month 1-2 based on projections above.

---

*This document defines the cold-start strategy for each retention loop. Cross-reference with `RESEARCH-retention-loops-scopeai-mapping.md` for full loop mechanics and `RESEARCH-retention-loops-metrics.md` for measurement framework.*
