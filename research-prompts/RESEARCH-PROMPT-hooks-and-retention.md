# Research Prompt: Hook Model & Retention Loops for ScopeAI

**Assigned to:** Research Team
**Output location:** `research-output/hooks-retention/`
**End goal:** Findings will be codified into a Claude Code skill that guides implementation of engagement, retention, and growth mechanics across the ScopeAI codebase.

---

## Context: What ScopeAI Is

ScopeAI is a paid web app for Australian homeowners planning renovations. Users upload photos of their space, answer guided questions, and receive AI-generated trade-specific scope-of-works documents they send to tradies for comparable quotes.

**The user journey:**
1. Land on marketing page (SEO traffic — "kitchen renovation scope template australia")
2. Enter wizard: choose mode (Trade Manager vs Builder) → select project type (kitchen, bathroom, etc.) → upload 3-10 photos → answer 8-12 tap-to-select questions → sign up → AI generates scopes
3. See preview (trade names, item counts, 1-2 sample items per trade)
4. Pay ($49 / $99 / $149) via Stripe Checkout
5. Access full scope view — toggle items, download PDFs, email to tradies
6. (Hopefully) return for another room, refer friends

**Critical product characteristics the research must account for:**
- **One-time purchase, not subscription.** Each scope package is a single payment. There is no MRR from the same user unless they buy additional rooms.
- **Low purchase frequency.** Most homeowners renovate 1-3 rooms per project, spaced weeks/months apart. This is not a daily-use product.
- **High-stakes decision.** Renovations cost $15K-$150K+. Users are anxious, not casual.
- **The funnel IS the product.** Unlike SaaS where onboarding leads to ongoing use, ScopeAI's entire value is delivered in one session (wizard → payment → download). There is no "daily active use."
- **Word-of-mouth is the growth engine.** Target: 20%+ organic referrals. Homeowners talk to other homeowners.
- **Two user modes:** Trade Manager (76% — coordinates individual tradies) and Builder Mode (24% — hires one builder).

---

## Research Task 1: The Hook Model (Nir Eyal)

### What to research

Nir Eyal's Hook Model from "Hooked: How to Build Habit-Forming Products." The four phases: **Trigger → Action → Variable Reward → Investment.**

### What we need to understand

1. **The framework itself** — Explain each phase clearly with the original definitions. What makes a trigger external vs internal? What makes a reward "variable"? What counts as "investment"?

2. **How it applies to low-frequency, high-stakes products** — The Hook Model was popularised through examples like social media and games (high-frequency, low-stakes). ScopeAI is the opposite. Research how the model adapts to products where:
   - Users might only visit 1-5 times total
   - The purchase decision takes 5-15 minutes, not seconds
   - Anxiety (not boredom) is the emotional driver
   - The "habit" we want isn't daily use — it's funnel completion, second purchase, and referral

3. **Mapping Hook phases to ScopeAI's actual user journey:**

   **Triggers — what brings them in and what brings them back:**
   - External: SEO landing, social proof, friend recommendation, tradie telling them "you need a scope"
   - Internal: Anxiety about budget blowouts, fear of being ripped off, overwhelm about where to start
   - Re-engagement triggers: "Your scope is waiting" email, "renovation season" reminders, "second room" prompts
   - What triggers would drive a completed-scope user to return for another room?

   **Action — what's the minimum behaviour we need:**
   - First visit: Start the wizard (click "Start My Scope")
   - Mid-funnel: Complete photos + questions (the investment before payoff)
   - Conversion: Pay for the scope
   - Post-purchase: Download PDF, email to tradies, toggle scope items
   - Return: Start a second room scope
   - How do we reduce friction at each action point? What's the "simplest action in anticipation of reward"?

   **Variable Reward — what's unpredictable and satisfying:**
   - The AI-generated scope itself IS the variable reward — users don't know exactly what trades they'll need or what items will appear
   - The "aha moment": seeing professional scope items they didn't know existed ("oh, I need RCD compliance?")
   - Photo analysis surfacing unexpected findings ("water damage detected", "load-bearing wall identified")
   - The item count reveal at preview ("Your kitchen needs 7 trades and 53 scope items")
   - How do we make the preview compelling enough to convert WITHOUT giving away the full value?
   - What makes the reward feel personalised and unique to THEIR renovation (not generic)?

   **Investment — what do users put in that makes them more likely to return:**
   - Data investment: photos, answers, property details, account creation
   - Customisation investment: toggling scope items on/off, curating their scope
   - Social investment: emailing scope to tradies (creates external accountability)
   - What "stored value" accumulates that makes starting a second room easier?
   - How does the account dashboard create a sense of ongoing value from past purchases?

4. **Anti-patterns to avoid** — What Hook Model implementations feel manipulative or dark-pattern-ish, especially for anxious homeowners making expensive decisions? We want to build trust, not exploit anxiety.

### Deliverables for Task 1

- `RESEARCH-hook-model-framework.md` — The framework explained, with adaptations for low-frequency/high-stakes products
- `RESEARCH-hook-model-scopeai-mapping.md` — Specific mapping of all four phases to ScopeAI's user journey, with concrete implementation recommendations
- `RESEARCH-hook-model-trigger-inventory.md` — Complete inventory of external and internal triggers, ranked by impact and implementation effort

---

## Research Task 2: Retention Loops (Casey Winters)

### What to research

Casey Winters' framework on retention loops (from his writing at Greylock, Eventbrite, Pinterest work, and his Reforge teaching). Focus on how products create self-reinforcing cycles where usage begets more usage.

### What we need to understand

1. **The framework itself** — What are retention loops vs growth loops vs viral loops? How do they differ from linear funnels? What makes a loop self-reinforcing vs decaying?

2. **Loop types relevant to ScopeAI:**

   **Acquisition loops (how new users find us):**
   - SEO content loop: User searches → finds guide → starts scope → scope references guide content → more SEO authority → more searches
   - Referral loop: User gets scope → sends to tradies → tradies see "Generated by ScopeAI" branding → tradies recommend to other clients → new users
   - Word-of-mouth loop: User gets scope → tells friends renovating → friends sign up
   - Social proof loop: More scopes generated → "Join 5,000+ homeowners" → higher conversion → more scopes
   - What's the most capital-efficient acquisition loop for a bootstrapped product targeting AU homeowners?

   **Engagement loops (how users complete the funnel):**
   - Progress loop: Each wizard step completed → progress bar advances → sunk cost + momentum → next step
   - Curiosity loop: Photo analysis reveals findings → user wants to see full scope → completes questions → generation preview shows item counts → user wants full detail → pays
   - Personalisation loop: More photos/answers → more tailored scope → higher perceived value → more willingness to pay
   - What loops prevent the ~85% of users who start but don't pay from dropping off?

   **Retention loops (how users come back):**
   - Multi-room loop: Kitchen scope done → "Your bathroom could be next" → starts second scope → property details pre-filled → faster completion
   - Renovation lifecycle loop: Scope generated → renovation happens over months → user returns to reference scope during construction → ScopeAI stays relevant
   - Update loop: "Prices have changed since your scope was generated" / "New Australian Standards affect your project" → reason to return
   - What creates a reason to return when the core product is a one-time deliverable?

   **Monetisation loops (how revenue compounds):**
   - Upsell loop: Starter ($49) user sees value → next room purchases Professional ($99) → higher ARPU
   - Referral-revenue loop: User refers friend → friend buys scope → original user gets credit toward next room
   - Content-commerce loop: SEO guide attracts user → guide references scope tool → user converts → more revenue funds more content → more SEO traffic

3. **Loop health metrics** — For each loop identified, what are the key metrics that tell us if the loop is healthy, growing, or decaying? What leading indicators predict loop strength before revenue shows up?

4. **Cold-start problem** — ScopeAI launches with zero users, zero social proof, zero referrals. How do you bootstrap each loop? What's the minimum viable loop that works at launch vs what scales at 1,000+ users?

5. **Loop killers** — What breaks retention loops in products like ScopeAI? Slow generation times? Poor scope quality? Complicated PDF download flow? Tradies ignoring the scope? Research common failure modes.

### Deliverables for Task 2

- `RESEARCH-retention-loops-framework.md` — The framework explained, with focus on low-frequency transactional products (not SaaS)
- `RESEARCH-retention-loops-scopeai-mapping.md` — All identified loops mapped to ScopeAI, with specific mechanics, metrics, and implementation notes
- `RESEARCH-retention-loops-cold-start.md` — Cold-start strategy: which loops to activate first, bootstrap tactics, minimum viable social proof
- `RESEARCH-retention-loops-metrics.md` — Metrics framework: what to measure for each loop, leading vs lagging indicators, PostHog event recommendations

---

## Research Task 3: Synthesis — The Skill Blueprint

### Purpose

This deliverable bridges the gap between research and implementation. It will be the direct input for creating a Claude Code skill that developers use when building features.

### What to produce

`RESEARCH-skill-blueprint.md` — A single document that:

1. **Defines a decision framework** — When a developer is building a feature (e.g., "add email reminder for abandoned wizards"), what questions should they ask to ensure the feature strengthens hooks and loops rather than just adding complexity?

2. **Creates a checklist per feature type:**
   - Wizard step component → Hook checklist (trigger clarity, action simplicity, reward variability, investment capture)
   - Email/notification → Trigger checklist (external trigger type, timing, personalisation, clear action path)
   - Preview/paywall component → Variable reward checklist (curiosity gap, value demonstration, urgency without manipulation)
   - Post-purchase feature → Investment checklist (stored value, switching cost, re-engagement path)
   - Growth feature → Loop checklist (which loop does this strengthen, what's the feedback mechanism, what metric proves it works)

3. **Lists concrete implementation patterns** — Not abstract theory, but specific patterns like:
   - "When showing scope preview, reveal item COUNT first (curiosity), then 1 sample item (quality signal), then lock the rest (variable reward)"
   - "Pre-fill property details for returning users starting a second room (reduce action friction via prior investment)"
   - "Add 'Generated by ScopeAI' watermark to PDF footer with link (acquisition loop: tradie sees branding → recommends to clients)"
   - Format: Pattern name → Which hook/loop it serves → Implementation notes → Metric to track

4. **Identifies anti-patterns** — Things the skill should actively warn against:
   - Artificial urgency ("Only 3 scopes left today!") — erodes trust with anxious homeowners
   - Dark patterns in the paywall (blurring content, fake countdown timers)
   - Over-notifying (email every day when user bought one scope)
   - Gamification that trivialises a serious financial decision
   - Any pattern that exploits the anxiety that drives users to ScopeAI in the first place

5. **Prioritises by implementation phase** — Which patterns should be built into MVP vs added post-launch? What's the minimum engagement/retention layer for launch day?

---

## Output Format Requirements

All files should be markdown (`.md`) in `research-output/hooks-retention/`.

For each recommendation, include:
- **What:** The specific recommendation
- **Why:** The theory/evidence behind it
- **Where:** Which part of ScopeAI it applies to (wizard step, component, backend function, email, etc.)
- **How:** Implementation sketch (not code, but specific enough that a developer knows what to build)
- **Measure:** What metric proves this works (PostHog event name + expected direction)

Keep language direct and practical. No filler. Write for a senior developer who will turn this into code, not a business audience reading a strategy deck.

---

## Reference Materials

Before starting, read these project files for full context:
- `PRD.md` — Full product requirements, user personas, pain points, feature specs
- `ARCHITECTURE.md` — Technical architecture, data flow, schema, design system
- `BUILD.md` — Implementation phases and current status
- `CLAUDE.md` — Design standards (anti-slop rules, the aesthetic we're going for)
- `types/index.ts` — The TypeScript type contract (understand the data model)
- `lib/constants.ts` — Pricing tiers, project types, configuration
- `research-output/ux-wizard/RESEARCH-wizard-implementation-spec.md` — The wizard UX blueprint (understand the existing flow)

---

## Expected Output Files

```
research-output/hooks-retention/
├── RESEARCH-hook-model-framework.md
├── RESEARCH-hook-model-scopeai-mapping.md
├── RESEARCH-hook-model-trigger-inventory.md
├── RESEARCH-retention-loops-framework.md
├── RESEARCH-retention-loops-scopeai-mapping.md
├── RESEARCH-retention-loops-cold-start.md
├── RESEARCH-retention-loops-metrics.md
└── RESEARCH-skill-blueprint.md
```

8 files total. Quality over volume. Every recommendation must be actionable and specific to ScopeAI.
