# Product Requirements Document (PRD)
# AI Scope of Works Generator — "ScopeAI"

**Version:** 1.0  
**Date:** February 2026  
**Author:** Jayson  
**Status:** Ready for Development

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Target Users](#3-target-users)
4. [Pain Points & Research Insights](#4-pain-points--research-insights)
5. [Product Vision & Goals](#5-product-vision--goals)
6. [Core User Flows](#6-core-user-flows)
7. [Feature Requirements](#7-feature-requirements)
8. [UX Principles for Non-Construction Users](#8-ux-principles-for-non-construction-users)
9. [Information Architecture](#9-information-architecture)
10. [Technical Architecture](#10-technical-architecture)
11. [Database Schema](#11-database-schema)
12. [AI System Design](#12-ai-system-design)
13. [MVP Scope](#13-mvp-scope)
14. [Success Metrics](#14-success-metrics)
15. [Future Roadmap](#15-future-roadmap)

---

## 1. Executive Summary

### What We're Building

ScopeAI is an AI-powered web application that helps Australian homeowners create professional renovation scope documents. Users upload photos of their space, describe what they want, answer guided questions, and receive trade-specific scope documents they can send to contractors for accurate, comparable quotes.

### Why It Matters

- **78% of homeowners exceed their renovation budget** — primarily due to poor planning and vague scopes
- **76% of renovating homeowners hire individual trades** (not builders) and struggle to coordinate them
- **No existing tool serves homeowners** — all competitors target professionals/investors
- **$48B+ Australian renovation market** with zero direct competition in the homeowner segment

### Core Value Proposition

> "Upload photos, describe your vision, get professional scope documents that make every tradie quote the same thing — so you can compare apples to apples and avoid budget blowouts."

---

## 2. Problem Statement

### The Current Homeowner Experience

**Scenario:** Sarah wants to renovate her kitchen. She's never done a major renovation before.

1. She calls 3 builders/tradies and says "I want to renovate my kitchen"
2. Each tradie visits, looks around, asks different questions
3. She receives 3 quotes: $28,000 / $45,000 / $62,000
4. She has NO IDEA why they're different — what's included? What's excluded?
5. She picks the cheapest one
6. Halfway through, the tradie says "oh, you wanted the splashback tiled? That's extra"
7. Final cost: $58,000 (107% over the original quote)
8. Sarah regrets the entire experience

### Why This Happens

1. **No standardised scope** — each tradie prices what THEY think is included
2. **Homeowners don't know what to specify** — they don't know what "rough-in" means
3. **Verbal briefs are vague** — "I want a modern kitchen" means different things to different people
4. **No comparison framework** — impossible to compare quotes when they cover different things
5. **Information asymmetry** — tradies know what's missing from their quote; homeowners don't

### The Gap in the Market

| Existing Tools | Who They Serve | Why They Don't Help Homeowners |
|----------------|----------------|--------------------------------|
| Kai Estimate | Professional builders | Requires construction knowledge, subscription model |
| ScopeGenie | Property investors | Assumes renovation experience, investment focus |
| Handoff | Contractors | Built for professionals, complex interface |
| ChatGPT | Anyone | Generic outputs, no AU standards, no photo analysis, no trade-specific formatting |
| Spreadsheet templates | DIYers | Still requires knowing what to include |

**Nobody helps the first-time renovator who doesn't know construction terminology.**

---

## 3. Target Users

### Primary Persona: "First-Time Renovator Sarah"

**Demographics:**
- Age: 32-55
- Homeowner (not renter)
- Household income: $100K-$250K
- Location: Australian metro (Sydney, Melbourne, Brisbane primarily)
- Tech comfort: Uses smartphone apps daily, comfortable with online forms

**Psychographics:**
- Has never done a major renovation (or did one 10+ years ago)
- Watches renovation shows but knows TV isn't reality
- Anxious about being ripped off or making expensive mistakes
- Values transparency and feeling in control
- Will research extensively before committing

**Behaviours:**
- Googles "how much does a kitchen renovation cost Sydney"
- Reads Houzz and hipages forums
- Asks friends/family for tradie recommendations
- Gets 3 quotes (because that's what everyone says to do)
- Struggles to compare quotes and often chooses based on "gut feel"

**Pain Points:**
- "I don't know what I don't know"
- "Every quote looks different — how do I compare?"
- "I'm scared of hidden costs"
- "I don't understand half the terminology"
- "I don't want to look stupid in front of the tradie"

**Goals:**
- Get accurate quotes that don't blow out
- Feel confident and in control of the process
- Understand what they're paying for
- Avoid regrets and "I wish I'd known" moments

### Secondary Persona: "DIY Project Manager Dave"

**Demographics:**
- Age: 35-50
- Has done 1-2 renovations before
- Prefers to hire individual trades (not a builder) to save money
- Comfortable with some construction concepts but not an expert

**Psychographics:**
- Likes to be hands-on and involved
- Believes builders charge too much margin
- Willing to put in effort to save money
- Values detailed planning

**Pain Points:**
- "I know I need a plumber, electrician, tiler, carpenter... but what order?"
- "How do I make sure the plumber and electrician coordinate?"
- "I've been burned before by trades who blame each other"
- "I want to do some work myself — what's safe to DIY?"

**Goals:**
- Get individual trade scopes he can send to specific tradies
- Understand the sequencing and dependencies
- Identify what he can DIY vs must hire out
- Coordinate multiple trades without things falling through cracks

### Tertiary Persona: "Hands-Off Hannah"

**Demographics:**
- Age: 40-60
- Time-poor professional or older couple
- Higher budget, values convenience over cost savings

**Psychographics:**
- Wants to hire a builder to manage everything
- Doesn't want to think about the details
- Just wants to know it's being done right

**Pain Points:**
- "I just want one person to handle it all"
- "How do I know if the builder's quote is fair?"
- "I don't have time to manage multiple tradies"

**Goals:**
- Get a single comprehensive scope to give to builders
- Have a checklist to compare builder quotes
- Feel confident the scope covers everything

---

## 4. Pain Points & Research Insights

### Validated Pain Points (from market research)

| Pain Point | Data Source | Impact |
|------------|-------------|--------|
| 78% of homeowners exceed budget | Houzz 2025 | Primary driver of product need |
| 60%+ go 20-30% over budget | Industry studies | Quantifies the problem |
| 1 in 4 homeowners regret their renovation | 2025 survey | Emotional validation |
| 35% of DIYers had to hire pro to fix mistakes | Houzz | Validates need for professional guidance |
| 40% say finding right contractor is biggest challenge | Houzz 2023 | Validates comparison problem |
| 76% hire individual trades, not builders | Houzz AU | Validates Trade Manager mode |
| Only 24% hire builders for full project | Houzz AU | Minority path, still needs support |

### Root Causes We're Solving

1. **Knowledge Gap**
   - Homeowners don't know construction terminology
   - They don't know what scope items are needed for their project
   - They don't know relevant Australian Standards
   - They don't know what questions to ask

2. **Communication Gap**
   - Homeowners describe wants ("modern kitchen") not specs ("40mm stone benchtop with waterfall end")
   - Tradies interpret vague briefs differently
   - No shared document means no shared understanding

3. **Comparison Gap**
   - Quotes structured differently
   - Different inclusions/exclusions
   - No line-item matching possible
   - Price variance makes decision impossible

4. **Coordination Gap** (Trade Manager users)
   - Don't know sequencing dependencies
   - Trades blame each other when things go wrong
   - No handoff documentation
   - Critical hold points missed (e.g., waterproofing inspection)

5. **Confidence Gap**
   - Fear of looking stupid
   - Fear of being ripped off
   - Analysis paralysis
   - Decision regret

### Insights That Shape the Product

**Insight 1: Photos are the unlock**
> Homeowners can take photos but can't describe their space in construction terms. AI vision analysis bridges this gap — we see the existing layout, materials, and fixtures without requiring technical input.

**Insight 2: Questions > Free text**
> Don't ask "describe your electrical needs." Instead ask "Will you have an induction cooktop?" The right questions surface the right scope items without requiring construction knowledge.

**Insight 3: Jargon must be explained, not avoided**
> The scope needs to use correct terminology (tradies expect it), but every term should be explainable. "IC-4 rated downlights" with a tooltip: "These are safe to install where the ceiling has insulation touching them."

**Insight 4: Exclusions are as important as inclusions**
> Most budget blowouts come from assumptions about what's included. Explicit exclusions ("Excludes: appliance supply, council fees, asbestos removal") prevent surprise costs.

**Insight 5: Sequencing is a hidden gem**
> For Trade Manager users, knowing "tiler comes AFTER waterproofing is inspected" is worth the entire product price. Getting sequence wrong is extremely expensive.

**Insight 6: Trust signals matter**
> Australian Standards references, compliance notes, licensing requirements — these make the document look professional and build homeowner confidence.

---

## 5. Product Vision & Goals

### Vision Statement

> ScopeAI makes professional renovation planning accessible to every Australian homeowner — turning anxiety into confidence, vague ideas into detailed specifications, and confusing quotes into clear comparisons.

### Product Goals

| Goal | Metric | Target (Year 1) |
|------|--------|-----------------|
| Help homeowners get comparable quotes | User feedback / NPS | 70+ NPS |
| Reduce budget blowouts | Self-reported post-project | <20% over budget (vs 60% baseline) |
| Generate revenue | MRR | $10K/month by month 6 |
| Acquire customers efficiently | CAC | <$30 (SEO-driven) |
| Build word-of-mouth | Referral rate | 20%+ organic referrals |

### Success Criteria for MVP

1. User can complete full flow (mode → project → photos → questions → scope) in under 10 minutes
2. Generated scopes are "tradie-ready" — an electrician reads it and can price it accurately
3. 3%+ of landing page visitors convert to paid scope
4. <5% refund request rate (indicates quality satisfaction)
5. Positive qualitative feedback: "I feel more confident" / "I can actually compare quotes now"

---

## 6. Core User Flows

### Flow 1: Trade Manager Mode (76% of users)

```
START
  │
  ▼
[Landing Page] ─── SEO entry: "kitchen renovation scope template australia"
  │
  ▼
[Mode Selection] ─── "How are you managing this renovation?"
  │                   ├── 🔧 "I'll coordinate trades myself" ← SELECTED
  │                   └── 🏗️ "I'll hire a builder"
  ▼
[Project Setup]
  │ ├── Select project type (Kitchen, Bathroom, etc.)
  │ ├── Property details (suburb, state, age, type)
  │ └── Validation: property age triggers asbestos flag if pre-1990
  ▼
[Photo Upload]
  │ ├── Upload 3-10 photos of existing space
  │ ├── AI analyses: layout, materials, fixtures, condition
  │ ├── Optional: inspiration images
  │ └── Free-text description of desired outcome
  ▼
[Smart Questions]
  │ ├── 8-12 tap-to-answer questions based on project type
  │ ├── Questions adapt based on photo analysis
  │ ├── Trade Manager mode gets more granular questions
  │ └── Progress indicator shows completion
  ▼
[Scope Generation] ─── Loading state with progress updates
  │ ├── "Analysing photos..."
  │ ├── "Identifying trades needed..."
  │ ├── "Generating electrical scope..."
  │ └── etc.
  ▼
[Preview & Paywall]
  │ ├── Show summary only: trade names, item counts, 1-2 sample items per trade (no blur)
  │ ├── Display package contents: "trade scopes + sequencing guide + ..."
  │ └── Pricing tiers: $49 / $99 / $149
  ▼
[Payment] ─── Stripe Checkout
  │
  ▼
[Full Scope Access]
  │ ├── View all trade scopes (tabbed interface)
  │ ├── View sequencing plan
  │ ├── View coordination checklist
  │ ├── Edit/customise scopes (toggle items)
  │ └── Download all as PDF / ZIP
  ▼
[Delivery]
  │ ├── Download PDFs
  │ ├── Email delivery
  │ ├── Shareable links (optional)
  │ └── Save to account
  ▼
END
```

### Flow 2: Builder Mode (24% of users)

Same flow but:
- Questions are higher-level (quality tier, timeline, preferences)
- Output is single combined scope (not separate trade scopes)
- Includes builder comparison checklist
- Includes "questions to ask each builder"

### Key Decision Points

| Decision Point | Options | Default | Rationale |
|----------------|---------|---------|-----------|
| Mode selection | Trades / Builder | None (must choose) | Fundamental output difference |
| Project type | 5 options (MVP) | None (must choose) | Drives question set |
| Property age | Free text | Empty | Asbestos flag trigger |
| Photo upload | 0-10 photos | Require minimum 3 | Core AI input |
| Quality tier | Budget/Mid/Premium/Luxury | Mid-range | Sets PC sum ranges |
| Pricing tier | $49/$99/$149 | Highlight $99 | Revenue optimisation |

---

## 7. Feature Requirements

### 7.1 Landing Page

**Purpose:** Convert organic search traffic to scope generation starts

**Requirements:**

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| LP-01 | Hero section with clear value prop | P0 | "Get comparable renovation quotes in under 10 minutes" |
| LP-02 | Problem/solution explanation | P0 | Address the "quotes are all different" pain |
| LP-03 | How it works (3-step visual) | P0 | Photos → Questions → Scopes |
| LP-04 | Sample scope preview | P1 | Show what output looks like |
| LP-05 | Trust signals | P1 | "Based on Australian Standards", user count |
| LP-06 | Pricing preview | P1 | Show tiers before they start |
| LP-07 | FAQ section | P1 | SEO value + objection handling |
| LP-08 | CTA: "Start My Scope — Free Preview" | P0 | Low-commitment entry |
| LP-09 | SEO-optimised content sections | P1 | Target long-tail keywords |
| LP-10 | Mobile responsive | P0 | 60%+ traffic will be mobile |

**SEO Target Keywords:**
- "renovation scope of works template australia"
- "how to get comparable builder quotes"
- "kitchen renovation checklist australia"
- "what to include in renovation scope"
- "how to brief a builder"

### 7.2 Mode Selection

**Purpose:** Route user to appropriate output format

**Requirements:**

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| MS-01 | Two clear mode options | P0 | Visual cards, not dropdown |
| MS-02 | Mode descriptions | P0 | Explain what each mode produces |
| MS-03 | "Not sure?" helper | P1 | Guide based on project complexity |
| MS-04 | Stat callouts | P2 | "76% of renovators choose this" |
| MS-05 | Mode selection persists | P0 | Stored in session/state |

**UX Note:** Use icons + short descriptions. Avoid construction jargon. Frame as "how involved do you want to be?"

### 7.3 Project Setup

**Purpose:** Capture project type and property details for context

**Requirements:**

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| PS-01 | Project type selector | P0 | Visual cards with icons |
| PS-02 | Property suburb + state | P0 | For compliance variations |
| PS-03 | Property type | P0 | House/Townhouse/Apartment/Heritage |
| PS-04 | Property age (approx) | P0 | Pre-1990 triggers asbestos flag |
| PS-05 | Form validation | P0 | Required fields marked |
| PS-06 | Progress indicator | P1 | Step X of Y |

**Project Types (MVP — single room only):**
1. Kitchen
2. Bathroom
3. Laundry
4. Living Area / Open Plan
5. Outdoor / Deck / Alfresco

> Extension and Full Home are V2 features.

**Property Age Logic:**
```
if property_age < 1990:
  flag: "asbestos_inspection_recommended"
  add to all scopes: asbestos inspection note
  add to demo scope: asbestos testing item
```

### 7.4 Photo Upload

**Purpose:** Provide AI with visual context of existing space

**Requirements:**

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| PU-01 | Drag-drop upload zone | P0 | Standard UX pattern |
| PU-02 | Click to browse | P0 | Fallback for mobile |
| PU-03 | Mobile camera capture | P0 | Direct from device camera |
| PU-04 | Photo preview thumbnails | P0 | Show uploaded images |
| PU-05 | Remove individual photos | P0 | X button on thumbnail |
| PU-06 | Minimum 3 photos required | P0 | Validation before continue |
| PU-07 | Maximum 10 photos | P0 | API cost control |
| PU-08 | Accepted formats | P0 | JPG, PNG, HEIC, WebP |
| PU-09 | Max file size: 10MB each | P0 | Reasonable limit |
| PU-10 | Upload progress indicator | P0 | Per-file progress |
| PU-11 | Guidance text | P1 | "Take photos of: current layout, appliances, problem areas" |
| PU-12 | Inspiration image upload (optional) | P2 | "Upload Pinterest/Houzz screenshots" |

**Photo Analysis (AI):**
The AI will analyse uploaded photos to identify:
- Room layout and dimensions (approximate)
- Existing fixtures and their condition
- Current materials (flooring type, benchtop material, etc.)
- Visible services (GPO locations, plumbing fixtures)
- Structural elements (load-bearing wall indicators)
- Age/condition indicators
- Potential issues (water damage, outdated electrical)

### 7.5 Vision Description

**Purpose:** Capture user's desired outcome in their own words

**Requirements:**

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| VD-01 | Large text area | P0 | Min 4 lines visible |
| VD-02 | Placeholder with examples | P0 | Guide what to write |
| VD-03 | Character count | P2 | Encourage detail |
| VD-04 | Voice input option | P2 | V2 feature |
| VD-05 | Optional (can skip) | P0 | Photos + questions are primary |

**Placeholder Text:**
> "Describe what you want to achieve... For example: 'I want to open up the kitchen to the living area, add an island bench with stone benchtops, replace all cabinets with modern soft-close drawers, switch from gas to induction cooktop, and add more lighting...'"

### 7.6 Smart Questions

**Purpose:** Gather specific requirements through guided choices (not construction knowledge)

**Requirements:**

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| SQ-01 | Question cards, one at a time or scrollable list | P0 | Test both approaches |
| SQ-02 | Tap-to-select options (not free text) | P0 | Reduce cognitive load |
| SQ-03 | Multi-select where appropriate | P0 | "Select all that apply" |
| SQ-04 | "Not sure" option on every question | P0 | Always provide escape hatch |
| SQ-05 | Questions adapt to project type | P0 | Kitchen ≠ Bathroom questions |
| SQ-06 | Questions adapt to mode | P0 | Trade Manager = more granular |
| SQ-07 | Questions adapt to photo analysis | V2 | Deferred — MVP uses static question sets per project type |
| SQ-08 | Progress indicator | P0 | Question X of Y |
| SQ-09 | Tooltips on technical terms | P0 | "What's an induction cooktop?" |
| SQ-10 | Skip question option | P1 | Uses sensible default |

**Question Design Principles:**

1. **Ask about outcomes, not specifications**
   - ❌ "What amp circuit for your oven?"
   - ✅ "What type of oven are you installing?"

2. **Provide visual options where possible**
   - ❌ "Describe your preferred benchtop"
   - ✅ [Images] "Engineered stone / Natural stone / Laminate / Timber"

3. **Always include "Not sure" or "Decide later"**
   - Reduces anxiety
   - AI uses sensible default or flags as TBC

4. **Explain why we're asking (on hover/tap)**
   - "We ask this because induction cooktops need a dedicated high-amp circuit"

5. **Group related questions**
   - Cooking questions together
   - Lighting questions together
   - Creates sense of progress

**Sample Question Set: Kitchen (Trade Manager Mode)**

```yaml
questions:
  - id: layout_change
    question: "Are you changing the kitchen layout?"
    why: "Layout changes affect plumbing, electrical, and potentially structural work"
    options:
      - "No - keeping same layout"
      - "Minor tweaks - moving a few things"
      - "Major redesign - completely different layout"
      - "Not sure yet"
    default_if_skipped: "Minor tweaks"

  - id: wall_removal
    question: "Are any walls being removed or modified?"
    why: "Wall removal may require structural engineering and council approval"
    options:
      - "No walls being touched"
      - "Removing a non-load-bearing wall"
      - "Removing a load-bearing wall (or not sure)"
      - "Creating a servery window/pass-through"
    follow_up_if: "load-bearing"
    follow_up: "You'll need a structural engineer's assessment. We'll include this in your scope."

  - id: cooktop_type
    question: "What type of cooktop will you have?"
    why: "Different cooktops have different electrical and gas requirements"
    options:
      - "Gas (keeping existing)"
      - "Gas (new or relocated)"
      - "Induction"
      - "Electric ceramic"
      - "Not sure yet"
    image_options: true

  - id: oven_type
    question: "What type of oven?"
    options:
      - "Built-in wall oven"
      - "Built-in wall oven + microwave tower"
      - "Freestanding oven/stove"
      - "Keeping existing"

  - id: island_bench
    question: "Will you have an island bench?"
    options:
      - "Yes - with sink"
      - "Yes - with cooktop"
      - "Yes - prep/seating only (no plumbing/gas)"
      - "No island"
    why: "Islands with sinks or cooktops need services run through the floor"

  - id: benchtop_material
    question: "Benchtop material preference?"
    options:
      - "Engineered stone (Caesarstone, etc.)"
      - "Natural stone (marble, granite)"
      - "Laminate"
      - "Timber"
      - "Not decided yet"
    image_options: true
    affects: "pc_sum_range"

  - id: dishwasher
    question: "Dishwasher included?"
    options:
      - "Yes - new dishwasher"
      - "Yes - relocating existing"
      - "No dishwasher"

  - id: rangehood
    question: "Rangehood type?"
    options:
      - "Ducted to outside (recommended)"
      - "Recirculating (no external duct)"
      - "Integrated in cooktop (downdraft)"
      - "Not sure"
    tooltip: "Ducted rangehoods are more effective but need a duct run to an external wall or roof"

  - id: lighting
    question: "What lighting do you want?"
    multi_select: true
    options:
      - "Downlights (recessed ceiling lights)"
      - "Pendant lights over island/bench"
      - "Under-cabinet task lighting"
      - "In-cabinet lighting"
      - "Not sure - open to suggestions"

  - id: powerpoints
    question: "Any specific power point needs?"
    multi_select: true
    options:
      - "Plenty of benchtop outlets"
      - "USB charging points"
      - "Outlet inside pantry (for appliances)"
      - "Pop-up power in island"
      - "Standard is fine"

  - id: quality_tier
    question: "What quality level are you targeting?"
    why: "This helps us set realistic budget allowances for materials"
    options:
      - "Budget ($15-25K) - functional, basic finishes"
      - "Mid-range ($25-45K) - good quality, popular brands"
      - "Premium ($45-70K) - high-end finishes, quality brands"
      - "Luxury ($70K+) - top-tier everything"
    affects: "pc_sum_range"

  - id: timeline
    question: "Do you have a deadline?"
    options:
      - "No rush"
      - "Within 3 months"
      - "Within 6 months"
      - "Specific date (e.g., before Christmas)"

  - id: diy_interest
    question: "Are you interested in doing any work yourself to save money?"
    mode: "trade_manager_only"
    options:
      - "Yes - happy to do demo/painting myself"
      - "Maybe - tell me what's safe to DIY"
      - "No - I want tradies to do everything"
```

### 7.7 Scope Generation

**Purpose:** Transform inputs into professional scope documents

**Requirements:**

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| SG-01 | Loading state with progress steps | P0 | Show what AI is doing |
| SG-02 | Generate all required trade scopes | P0 | Based on project type + answers |
| SG-03 | Generate sequencing plan | P0 | Trade Manager mode |
| SG-04 | Generate coordination checklist | P0 | Trade Manager mode |
| SG-05 | Generate comparison sheets | P0 | Both modes |
| SG-06 | Apply property-specific flags | P0 | Asbestos, heritage, etc. |
| SG-07 | Include compliance references | P0 | AS/NZS standards |
| SG-08 | Include PC sums based on quality tier | P0 | Realistic ranges |
| SG-09 | Timeout handling (>60 seconds) | P0 | Graceful error |
| SG-10 | Retry on failure | P0 | Auto-retry once |
| SG-11 | Save generated scope to database | P0 | For retrieval |

**Loading State Messages (in sequence):**
1. "Analysing your photos..."
2. "Understanding your requirements..."
3. "Identifying trades needed..."
4. "Generating demolition scope..."
5. "Generating plumbing scope..."
6. "Generating electrical scope..."
7. "Generating carpentry scope..."
8. "Generating tiling scope..."
9. "Generating painting scope..."
10. "Building your sequencing plan..."
11. "Creating coordination checklist..."
12. "Finalising your scope package..."

### 7.8 Scope Preview & Paywall

**Purpose:** Show enough value to convert to payment

**Requirements:**

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| PW-01 | Show summary only: trade names, item counts, 1-2 sample items per trade | P0 | Enough to validate quality without giving away full value |
| PW-02 | Full scopes hidden — no blur, just locked | P0 | Clean paywall — not a "blur tease" |
| PW-03 | List all included documents | P0 | "7 trade scopes + sequencing + ..." |
| PW-04 | Show pricing tiers clearly | P0 | $49 / $99 / $149 |
| PW-05 | Highlight recommended tier | P0 | $99 "Most Popular" |
| PW-06 | Feature comparison table | P1 | What's in each tier |
| PW-07 | Money-back guarantee note | P1 | Reduce risk perception |
| PW-08 | "Unlock Full Scope" CTA | P0 | Clear action |

### 7.9 Payment

**Purpose:** Collect payment via Stripe

**Requirements:**

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| PM-01 | Stripe Checkout integration | P0 | Redirect to Stripe |
| PM-02 | Three pricing tiers | P0 | $49 / $99 / $149 |
| PM-03 | Success redirect to full scope | P0 | Immediate access |
| PM-04 | Failure handling | P0 | Return to paywall with message |
| PM-05 | Receipt email (Stripe default) | P0 | Automatic |
| PM-06 | Webhook for payment confirmation | P0 | Update database |
| PM-07 | Store transaction ID | P0 | For support/refunds |

**Pricing Tiers:**

| Tier | Price | Best For | Includes |
|------|-------|----------|----------|
| Starter | $49 | Single room, simple reno | 1 room, up to 4 trade scopes, basic specs, sequencing guide, comparison sheets |
| Professional | $99 | Full renovation (recommended) | 1-2 rooms, up to 6 trade scopes, detailed specs + PC sums, full sequencing, coordination checklist, 1 revision |
| Premium | $149 | Multi-room or complex | Unlimited rooms/trades, full specs, all documents, 3 revisions, heritage/asbestos flags, budget calibration |

### 7.10 Full Scope View

**Purpose:** Present and allow customisation of generated scopes

**Requirements:**

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| SV-01 | Tabbed interface for trade scopes | P0 | One tab per trade |
| SV-02 | Sequencing plan tab | P0 | Visual timeline |
| SV-03 | Coordination checklist tab | P0 | Trade Manager mode |
| SV-04 | Item toggle (include/exclude) | P0 | Checkbox per item |
| SV-05 | Expandable explanations | P1 | "Why is this included?" |
| SV-06 | Edit item text | P2 | For advanced users |
| SV-07 | Add custom item | P2 | Free text |
| SV-08 | Mobile-responsive view | P0 | Scrollable, readable |
| SV-09 | Print-friendly view | P1 | Clean print CSS |

### 7.11 Download & Delivery

**Purpose:** Get scope documents to the user

**Requirements:**

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| DL-01 | Download individual PDFs | P0 | Per trade scope |
| DL-02 | Download all as ZIP | P0 | One-click bundle |
| DL-03 | Email delivery | P0 | Send to user's email |
| DL-04 | Shareable link | P1 | Send link to tradie |
| DL-05 | PDF formatting | P0 | Professional, branded |
| DL-06 | Scope saved to account | P0 | Access later |
| DL-07 | Re-download anytime | P0 | From account |

### 7.12 User Accounts

**Purpose:** Save scopes and enable return visits

**Requirements:**

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| UA-01 | Email/password signup | P0 | During or after payment |
| UA-02 | Google OAuth | P1 | Faster signup |
| UA-03 | Magic link login | P1 | Passwordless option |
| UA-04 | Account dashboard | P0 | List of past scopes |
| UA-05 | Access saved scopes | P0 | View and download |
| UA-06 | Edit account details | P1 | Email, password |
| UA-07 | Delete account | P2 | GDPR compliance |

---

## 8. UX Principles for Non-Construction Users

### Principle 1: Translate, Don't Intimidate

**Problem:** Construction terminology scares users.

**Solution:**
- Use plain language in UI and questions
- Technical terms appear only in output (where tradies need them)
- Every technical term has a tooltip explanation
- Tone is friendly and supportive, not formal

**Examples:**
| Construction Term | Plain Language |
|-------------------|----------------|
| GPO (general purpose outlet) | "power point" |
| Rough-in | "first stage of plumbing/electrical before walls close" |
| IC-rated | "safe for ceilings with insulation" |
| Second fix | "final installation after painting" |
| PC Sum | "allowance for items you'll choose (like tiles)" |
| AS/NZS 3000 | "Australian electrical safety standards" |

### Principle 2: Guide, Don't Ask

**Problem:** Users don't know what they don't know.

**Solution:**
- Tap-to-select options instead of free text
- Pre-populate sensible defaults
- "Not sure" is always an option
- AI makes intelligent assumptions from photos
- Progressive disclosure (don't overwhelm upfront)

### Principle 3: Show the Value Early

**Problem:** Users don't know what they're paying for until they see it.

**Solution:**
- Free preview of output before payment
- Clear "what's included" list
- Sample scope visible on landing page
- Loading state shows each document being generated

### Principle 4: Build Confidence

**Problem:** Users feel anxious about making expensive mistakes.

**Solution:**
- Compliance references (Australian Standards) build trust
- "Why is this included?" explanations
- Exclusions are explicitly stated
- Red flags and warnings surface potential issues
- Sequencing guide reduces "what if I get it wrong" anxiety

### Principle 5: Respect Their Time

**Problem:** Users are busy; they just want comparable quotes.

**Solution:**
- Full flow completable in under 10 minutes
- Photos + tap questions = minimal typing
- Save progress (can return later)
- One-click downloads and email delivery

### Principle 6: Design for Mobile First

**Problem:** 60%+ of traffic will be mobile; users take photos on phone.

**Solution:**
- Touch-friendly tap targets
- Camera integration for photo upload
- Readable text without zooming
- Simplified navigation on mobile
- No hover-only interactions

---

## 9. Information Architecture

### Site Map

```
ScopeAI
├── Landing Page (/)
│   ├── Hero + CTA
│   ├── How It Works
│   ├── Sample Output Preview
│   ├── Pricing
│   └── FAQ
│
├── Scope Generator (/create)
│   ├── Step 1: Mode Selection
│   ├── Step 2: Project Setup
│   ├── Step 3: Photo Upload
│   ├── Step 4: Questions
│   ├── Step 5: Generation (loading)
│   ├── Step 6: Preview + Payment
│   └── Step 7: Full Scope View
│
├── My Account (/account)
│   ├── Dashboard (saved scopes)
│   ├── Scope Detail View
│   ├── Account Settings
│   └── Logout
│
├── Content Pages (SEO)
│   ├── /guides/kitchen-renovation-scope
│   ├── /guides/bathroom-renovation-scope
│   ├── /guides/how-to-compare-builder-quotes
│   └── etc.
│
├── Legal
│   ├── /privacy
│   └── /terms
│
└── Auth
    ├── /login
    ├── /signup
    └── /forgot-password
```

### Navigation

**Header (all pages):**
- Logo (links to home)
- "Start My Scope" CTA button
- Login / Account dropdown

**Footer:**
- About
- How It Works
- Pricing
- Contact
- Privacy Policy
- Terms of Service

---

## 10. Technical Architecture

### Stack

> **Note:** The canonical technical architecture is in `ARCHITECTURE.md`. This section is a summary.

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Frontend | Next.js 14+ (App Router) | SSR for SEO, React for interactivity |
| Styling | Tailwind CSS v4 + shadcn/ui | Utility CSS + accessible component library |
| Backend | Convex | Reactive database, server functions, file storage, auth — all-in-one |
| AI | Google Gemini 3 API | Vision (photo analysis) + text (scope generation) in one provider |
| Payments | Stripe | Checkout sessions + webhooks |
| Email | Resend | Developer-friendly, good deliverability |
| PDF Generation | @react-pdf/renderer | React-based, customisable |
| Hosting | Vercel | Optimised for Next.js |
| Analytics | PostHog | Funnel tracking, feature flags |

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                      FRONTEND                           │
│                 Next.js on Vercel                        │
│                                                         │
│  Landing Page (SSR)  │  /create Flow  │  /account       │
│  SEO-optimised       │  Client-side   │  Dashboard      │
└──────────────────────┼────────────────┼─────────────────┘
                       │                │
                       ▼                ▼
┌─────────────────────────────────────────────────────────┐
│                      CONVEX                             │
│              (Backend-as-a-Service)                      │
│                                                         │
│  Queries       │ Mutations     │ Actions (async)        │
│  - getProject  │ - createProj  │ - analysePhotos        │
│  - getScopes   │ - saveAnswers │ - generateScopes       │
│  - getUser     │ - markPaid    │ - createStripeSession   │
│                │               │ - sendEmail             │
│                                                         │
│  File Storage         │  Auth (Convex Auth)             │
│  - User photos        │  - Email/password               │
│  - Generated PDFs     │  - Google OAuth                 │
└─────────────────────────────────────────────────────────┘
         │                    │                │
         ▼                    ▼                ▼
┌──────────────┐  ┌───────────────┐  ┌──────────────┐
│  Gemini 3    │  │    Stripe     │  │   Resend     │
│  Vision API  │  │    API        │  │   Email API  │
│  + Text API  │  │               │  │              │
└──────────────┘  └───────────────┘  └──────────────┘
```

### API Design (Convex Functions)

Convex replaces traditional REST API routes. Backend logic runs as Convex queries, mutations, and actions. See `ARCHITECTURE.md` Section 6 for the complete function list.

| Type | Examples | Purpose |
|------|----------|---------|
| Queries | `getProject`, `getScopes`, `getProjectsByUser` | Read data (reactive, real-time) |
| Mutations | `createProjectFromSession`, `updateScopeItem`, `markProjectPaid` | Write data (transactional) |
| Actions | `analysePhotos`, `generateScopes`, `createStripeSession` | Async work, external API calls |
| HTTP | `/api/stripe-webhook` | Stripe webhook endpoint |

---

## 11. Database Schema

> **Note:** The canonical schema is defined as a Convex TypeScript schema in `ARCHITECTURE.md` Section 3. This section provides a summary of the data model.

### Tables (Convex Document DB)

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `profiles` | User profiles (extends Convex Auth) | userId, email, fullName |
| `projects` | Renovation projects | userId, mode, projectType, propertyDetails, answers, photoAnalysis, status, generationProgress, payment fields |
| `projectPhotos` | Uploaded photos per project | projectId, storageId, originalFilename, mimeType, analysisResult |
| `scopes` | Generated trade scopes (one per trade per project) | projectId, tradeType, title, items[], exclusions[], pcSums[], complianceNotes, warnings |
| `sequencingPlans` | Trade sequencing (Trade Manager mode) | projectId, phases[], totalDurationEstimate |
| `coordinationChecklists` | Trade coordination (Trade Manager mode) | projectId, items[] |
| `documents` | Generated PDFs | projectId, documentType, storageId, filename |

### Key Data Structures

**Scope Item** (within `scopes.items[]`):
```json
{
  "id": "elec-001",
  "category": "lighting",
  "item": "Install LED downlights",
  "specification": "8× IC-4 rated, dimmable, 3000K warm white, IP44 in wet areas",
  "included": true,
  "complianceNote": "Per AS/NZS 3000"
}
```

**Project Status Flow:** `draft` → `generating` → `generated` → `paid`

**Generation Progress** (real-time updates during scope generation):
```json
{ "total": 7, "completed": 3, "current": "carpentry", "failed": [] }
```

---

## 12. AI System Design

### Overview

The AI system has three main functions:
1. **Photo Analysis** — Understand the existing space
2. **Question Adaptation** — Tailor questions based on context
3. **Scope Generation** — Produce professional trade scopes

### 12.1 Photo Analysis Pipeline

**Input:** 3-10 photos uploaded by user

**Process:**
```
For each photo:
  → Send to Gemini 3 API (multimodal)
  → Extract structured data:
    - Room identification
    - Existing fixtures/materials
    - Visible services (GPOs, plumbing)
    - Condition assessment
    - Potential issues
  
Aggregate results:
  → Merge findings across photos
  → Identify conflicts/uncertainties
  → Generate summary for scope generation
```

**Prompt Structure (Photo Analysis):**
```
You are analysing photos of a residential space for an Australian renovation project.

Analyse this image and extract the following information in JSON format:

{
  "room_type": "kitchen/bathroom/etc",
  "approximate_size": "small/medium/large",
  "existing_fixtures": [
    {"type": "cooktop", "fuel": "gas/electric/induction", "condition": "good/fair/poor"},
    {"type": "oven", "style": "freestanding/built-in", "condition": "..."},
    ...
  ],
  "existing_materials": {
    "benchtop": "laminate/stone/timber/unknown",
    "flooring": "tiles/timber/vinyl/unknown",
    "splashback": "tiles/glass/paint/none",
    "cabinets": "laminate/2pac/timber/unknown"
  },
  "visible_services": {
    "power_points": {"count": N, "locations": "benchtop/kickboard/none visible"},
    "plumbing": {"sink_location": "under window/island/etc", "visible_pipes": true/false},
    "gas": {"visible_connection": true/false}
  },
  "structural_observations": {
    "potential_load_bearing_walls": true/false,
    "window_locations": "description",
    "ceiling_type": "flat/bulkhead/raked"
  },
  "condition_flags": [
    "water_damage_visible",
    "outdated_electrical",
    "asbestos_era_materials",
    ...
  ],
  "approximate_age": "pre-1960/1960-1990/1990-2010/post-2010/unknown"
}

Be conservative in assessments. If unsure, mark as "unknown".
Focus on details relevant to renovation scoping.
```

### 12.2 Scope Generation Pipeline

**Input:**
- Photo analysis results
- User answers to questions
- Project type and property details
- Selected mode (trades/builder)
- Quality tier

**Process:**
```
1. Determine required trades based on project type + answers
   Kitchen → [demolition, structural?, plumbing, electrical, carpentry, tiling, stone, painting]

2. For each required trade:
   a. Load trade-specific system prompt
   b. Inject project context (photos, answers, property details)
   c. Generate scope items as structured JSON
   d. Apply validation rules (compliance, asbestos flags, etc.)
   e. Add PC sums based on quality tier

3. Generate sequencing plan (Trade Manager mode)
   - Order trades by dependency
   - Calculate durations
   - Identify hold points

4. Generate coordination checklist (Trade Manager mode)
   - Extract handoff requirements from scope items
   - Flag critical dependencies

5. Assemble final output package
```

### 12.3 Prompt Architecture

**Master System Prompt** (loaded for all scope generation):

```markdown
You are an expert Australian renovation project manager with 20+ years of experience. Your role is to generate professional scope of works documents that:

1. Use correct Australian construction terminology
2. Reference relevant Australian Standards (AS/NZS)
3. Include appropriate level of detail for tradies to price accurately
4. Are organised by trade/phase
5. Include realistic PC (Provisional Cost) sums where homeowner selection is needed
6. Explicitly state exclusions
7. Flag compliance requirements and certifications needed

You are generating scopes for homeowners who will send them to tradies for quotes. The scope must be detailed enough that three different tradies would interpret it the same way and provide comparable quotes.

Always consider:
- Property age (asbestos risk if pre-1990)
- State-specific regulations (licensing, compliance certificates)
- Sequencing dependencies between trades
- Common items homeowners forget
- Items that typically cause variations (unexpected costs)

Output must be in structured JSON format for parsing.
```

**Trade-Specific Prompts** (one per trade, e.g., electrical):

```markdown
# Electrical Scope Generation Prompt

You are generating an electrical scope of works for an Australian residential renovation.

## Context Provided
- Property location: {state}
- Property age: {year_built}
- Project type: {project_type}
- Photo analysis: {photo_analysis_summary}
- User requirements: {relevant_answers}
- Quality tier: {quality_tier}

## Requirements

Generate a complete electrical scope including:

### Circuits
- Identify all dedicated circuits needed (oven, cooktop, dishwasher, AC, etc.)
- Specify circuit rating (20A, 32A, etc.)
- Note cable sizing requirements

### Power Points (GPOs)
- Quantity and locations
- Special types (USB, weatherproof, etc.)
- Positioning requirements (height, distance from water)

### Lighting
- Downlight specifications (IC rating, IP rating, colour temperature)
- Pendant rough-ins
- Under-cabinet lighting
- Outdoor lighting (if applicable)

### Switchboard
- Assessment of existing switchboard capacity
- RCD (safety switch) requirements
- Potential upgrade requirements

### Compliance
- Reference AS/NZS 3000 Wiring Rules
- Certificate of Compliance (CCEW) requirement
- NSW/VIC/QLD specific requirements

### Exclusions
List typical exclusions:
- Light fitting supply (unless specified)
- Appliance supply
- Switchboard upgrade (quote separately)
- Data cabling
- Smart home systems (unless specified)

## Output Format

Return JSON:
{
  "trade": "electrical",
  "title": "Electrical Scope of Works",
  "items": [
    {
      "id": "elec-001",
      "category": "circuits",
      "item": "New dedicated circuit for wall oven",
      "specification": "32A circuit, 6mm² cable from switchboard, isolator switch at appliance",
      "included": true,
      "complianceNote": "Per AS/NZS 3000"
    },
    ...
  ],
  "exclusions": [
    "Light fitting supply (owner to select)",
    "Switchboard upgrade (if required - quote separately)",
    ...
  ],
  "compliance": "All work to comply with AS/NZS 3000 Wiring Rules. Certificate of Compliance (CCEW) required on completion. Licensed electrician required.",
  "notes": "Switchboard assessment included. If upgrade required, allow $1,200-2,500 additional.",
  "warnings": [
    "Property age 1985 - original switchboard likely requires upgrade for RCD compliance"
  ]
}
```

### 12.4 Quality Assurance Layer

After AI generation, apply programmatic validation:

```javascript
function validateScope(scope, projectContext) {
  const warnings = [];
  const additions = [];

  // Property age checks
  if (projectContext.propertyAge < 1990) {
    if (!scope.items.some(i => i.item.toLowerCase().includes('asbestos'))) {
      additions.push({
        item: "Asbestos inspection prior to demolition",
        specification: "Inspection by licensed assessor. Budget $500-800.",
        category: "safety",
        critical: true
      });
    }
  }

  // Wet area checks
  if (['bathroom', 'laundry'].includes(projectContext.projectType)) {
    if (!scope.items.some(i => i.item.toLowerCase().includes('waterproof'))) {
      warnings.push("Waterproofing scope item may be missing");
    }
  }

  // State-specific compliance
  if (projectContext.state === 'QLD') {
    if (scope.trade === 'electrical') {
      // QLD specific requirements
    }
  }

  // Every trade scope must have...
  const requiredElements = ['exclusions', 'compliance'];
  requiredElements.forEach(el => {
    if (!scope[el] || scope[el].length === 0) {
      warnings.push(`Missing required element: ${el}`);
    }
  });

  return { warnings, additions };
}
```

---

## 13. MVP Scope

### In Scope for MVP (v1.0)

| Feature | Priority | Notes |
|---------|----------|-------|
| Landing page | P0 | SEO-optimised, clear value prop |
| Mode selection (Trades/Builder) | P0 | Core differentiator |
| Project type selection | P0 | Kitchen, Bathroom, Laundry, Living, Outdoor initially |
| Property details form | P0 | Suburb, state, age, type |
| Photo upload (3-10) | P0 | Core AI input |
| AI photo analysis | P0 | Gemini 3 Vision |
| Vision description (text) | P0 | Optional freeform input |
| Smart questions (tap-to-answer) | P0 | Project-type specific |
| Scope generation (all trades) | P0 | Core output |
| Sequencing plan (Trade Manager) | P0 | Key differentiator |
| Coordination checklist | P0 | Trade Manager mode |
| Quote comparison sheets | P0 | Both modes |
| Scope preview (partial) | P0 | Before payment |
| Stripe payment | P0 | Three tiers |
| Full scope view | P0 | After payment |
| Scope editing (toggle items) | P0 | Customisation |
| PDF generation | P0 | Professional output |
| PDF download (individual + ZIP) | P0 | Core delivery |
| Email delivery | P0 | Alternative delivery |
| Basic user accounts | P0 | Save/retrieve scopes |
| Mobile responsive | P0 | 60%+ traffic |

### Out of Scope for MVP

| Feature | Reason | Version |
|---------|--------|---------|
| Voice input | Nice to have, not critical | V2 |
| Inspiration image analysis | Adds complexity | V2 |
| Shareable links | Can add post-launch | V2 |
| Quote gap analysis | Requires more AI work | V2 |
| Tradie directory | Different business model | V3 |
| Cost estimation | Liability concerns | V3+ |
| 3D visualisation | Not core value | Never |
| Mobile app | Web is sufficient | V3 |

### MVP Timeline (4-6 weeks)

| Week | Focus |
|------|-------|
| 1 | Project setup, database schema, auth, basic routing |
| 2 | Photo upload, AI integration (analysis + generation) |
| 3 | Question flow, scope generation, preview |
| 4 | Payment integration, full scope view, PDF generation |
| 5 | Account dashboard, email delivery, polish |
| 6 | Testing, bug fixes, SEO content, launch prep |

---

## 14. Success Metrics

### Primary Metrics

| Metric | Definition | Target (Month 1) | Target (Month 6) |
|--------|------------|------------------|------------------|
| Scope Generations | Completed scope packages | 100 | 1,000 |
| Conversion Rate | Visitors → Paid | 2% | 4% |
| Revenue | Monthly recurring | $2,000 | $10,000 |
| NPS | Net Promoter Score | 50 | 70 |

### Secondary Metrics

| Metric | Definition | Target |
|--------|------------|--------|
| Flow Completion | Start → Payment | 15%+ |
| Time to Complete | Mode → Payment | <10 min |
| Refund Rate | Refund requests | <5% |
| Return Users | Users with 2+ projects | 10%+ |

### Tracking Implementation

- **Plausible/PostHog:** Page views, funnel progression
- **Stripe:** Revenue, conversion, refunds
- **Custom events:** Generation success/failure, PDF downloads
- **Feedback widget:** In-app NPS and comments

---

## 15. Future Roadmap

### V2 (Months 2-4)

- Voice input for description
- Inspiration image analysis
- Shareable scope links
- View tracking (has tradie opened link?)
- Upload existing quote → AI finds gaps
- NZ localisation
- Budget calibration mode

### V3 (Months 4-8)

- Investor/flipper subscription (unlimited scopes)
- White-label for real estate agents
- Tradie directory / referral marketplace
- UK market expansion
- Cost estimation (beta, with disclaimers)

### Long-term Vision

- Full project lifecycle (scope → quotes → select → track → complete)
- Material ordering integration (Bunnings, Reece API)
- AR visualisation (camera overlay of design)
- AI project manager (ongoing advice during renovation)

---

## Appendix A: Glossary for Development

| Term | Meaning |
|------|---------|
| Trade | A specific construction discipline (electrical, plumbing, etc.) |
| Scope | A document listing work items and specifications |
| PC Sum | Provisional Cost Sum - an allowance for items the owner will select |
| Rough-in | First stage of services (plumbing/electrical) before walls close |
| Second fix | Final installation after painting |
| RCD | Residual Current Device (safety switch) |
| GPO | General Purpose Outlet (power point) |
| IC-rated | Insulation Contact rated (safe for insulated ceilings) |
| AS/NZS | Australian/New Zealand Standard |

---

## Appendix B: File/Folder Structure

> **Note:** See `ARCHITECTURE.md` Section 11 for the canonical folder structure. Summary below.

```
scope-ai/
├── app/                              # Next.js App Router
│   ├── page.tsx                      # Landing page (SSR)
│   ├── layout.tsx                    # Root layout (ConvexProvider, theme, fonts)
│   ├── create/page.tsx               # Scope creation flow (multi-step, client-side)
│   ├── scope/[projectId]/page.tsx    # Full scope view (post-payment)
│   ├── account/page.tsx              # User dashboard
│   ├── auth/login/page.tsx
│   └── auth/signup/page.tsx
├── components/
│   ├── ui/                           # shadcn/ui components
│   ├── create/                       # Creation flow step components
│   ├── scope/                        # Scope display components
│   └── layout/                       # Header, Footer, ThemeToggle
├── convex/                           # Convex backend
│   ├── schema.ts                     # Database schema
│   ├── projects.ts                   # Project queries + mutations
│   ├── scopes.ts                     # Scope queries + mutations
│   ├── photos.ts                     # Photo upload mutations
│   ├── ai.ts                         # AI actions (analysePhotos, generateScopes)
│   ├── stripe.ts                     # Stripe actions
│   ├── pdf.ts                        # PDF generation action
│   ├── email.ts                      # Email delivery action
│   ├── http.ts                       # HTTP endpoints (Stripe webhook)
│   └── auth.ts                       # Auth config
├── lib/
│   ├── ai/prompts/                   # AI prompt templates
│   │   ├── master-system.md
│   │   ├── photo-analysis.md
│   │   └── trades/*.md               # Per-trade prompts
│   ├── ai/validation.ts              # Post-generation validation
│   ├── questions/*.ts                # Question sets per project type
│   ├── sequencing/templates.ts       # Sequencing templates
│   ├── trades.ts                     # Trade determination logic
│   └── constants.ts                  # Pricing, project types, states
├── types/index.ts                    # Shared TypeScript types
├── styles/globals.css                # Tailwind base + CSS variables
└── public/images/                    # Static assets
```

---

**End of PRD**

*This document should be used as the primary reference for building ScopeAI. Update as requirements evolve.*