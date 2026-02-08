# Architecture — ScopeAI

**Last Updated:** 8 February 2026
**Status:** Phase 9 complete — PDF generation (client-side), ZIP bundle, email delivery (Resend)

---

## 1. Stack Overview

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | Next.js 14+ (App Router) | SSR for SEO landing pages, React for interactive flows |
| Styling | Tailwind CSS v4 + shadcn/ui | Utility CSS + pre-built accessible components |
| Backend | Convex | Reactive database, server functions, file storage, auth |
| AI | Google Gemini 3 API | Vision (photo analysis) + text (scope generation) |
| Payments | Stripe | Checkout sessions, webhooks, receipt emails |
| PDF | @react-pdf/renderer | Generate downloadable trade scope PDFs |
| Email | Resend | Scope delivery, receipts, transactional emails |
| Hosting | Vercel | Optimised for Next.js, edge functions |
| Analytics | PostHog | Funnel tracking, feature flags |

---

## 2. Architecture Diagram

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

---

## 3. Data Model (Convex Schema)

Convex uses a document-based schema defined in TypeScript. No SQL.

### 3.1 Tables

```typescript
// convex/schema.ts

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // User profiles (extends Convex Auth user)
  profiles: defineTable({
    userId: v.string(),        // Convex Auth user ID
    email: v.string(),
    fullName: v.optional(v.string()),
  }).index("by_userId", ["userId"]),

  // Renovation projects
  projects: defineTable({
    userId: v.string(),

    // Mode and type
    mode: v.union(v.literal("trades"), v.literal("builder")),
    projectType: v.string(),   // "kitchen", "bathroom", etc.

    // Property details
    propertySuburb: v.optional(v.string()),
    propertyState: v.string(), // "NSW", "VIC", etc.
    propertyType: v.string(),  // "house", "apartment", etc.
    propertyAge: v.optional(v.number()), // year built

    // User inputs
    description: v.optional(v.string()),
    answers: v.optional(v.any()), // question responses as JSON object

    // AI analysis result (stored after photo analysis)
    photoAnalysis: v.optional(v.any()),

    // Photo analysis status
    photoAnalysisStatus: v.optional(v.union(
      v.literal("pending"),
      v.literal("running"),
      v.literal("complete"),
      v.literal("failed")
    )),

    // Status
    status: v.union(
      v.literal("draft"),
      v.literal("generating"),
      v.literal("generated"),
      v.literal("paid")
    ),

    // Generation progress (updated per-trade during generation)
    generationProgress: v.optional(v.object({
      total: v.number(),
      completed: v.number(),
      current: v.optional(v.string()),  // trade currently being generated
      failed: v.array(v.string()),      // trades that failed after retry
    })),

    // Payment
    paymentTier: v.optional(v.union(
      v.literal("starter"),
      v.literal("professional"),
      v.literal("premium")
    )),
    paymentAmountCents: v.optional(v.number()),
    stripeSessionId: v.optional(v.string()),
    stripePaymentId: v.optional(v.string()),
    paidAt: v.optional(v.number()), // timestamp
  })
    .index("by_userId", ["userId"])
    .index("by_status", ["status"])
    .index("by_stripeSessionId", ["stripeSessionId"]),

  // Uploaded photos per project (photos uploaded pre-auth use sessionId, linked to projectId after auth)
  projectPhotos: defineTable({
    projectId: v.optional(v.id("projects")),
    sessionId: v.optional(v.string()),  // temporary ID before auth/project creation
    storageId: v.string(),     // Convex file storage ID
    originalFilename: v.string(),
    fileSize: v.number(),
    mimeType: v.string(),
    analysisResult: v.optional(v.any()), // per-photo AI analysis
  })
    .index("by_projectId", ["projectId"])
    .index("by_sessionId", ["sessionId"]),

  // Generated trade scopes (one document per trade per project)
  scopes: defineTable({
    projectId: v.id("projects"),

    tradeType: v.string(),     // "electrical", "plumbing", etc.
    title: v.string(),         // "Electrical Scope of Works"

    // Scope content — stored as structured JSON
    items: v.any(),            // array of { item, specification, included, category }
    exclusions: v.any(),       // array of strings
    pcSums: v.optional(v.any()),        // provisional cost sums
    complianceNotes: v.optional(v.string()),
    notes: v.optional(v.string()),
    warnings: v.optional(v.any()),      // array of strings
    diyOption: v.optional(v.string()),

    sortOrder: v.number(),
  })
    .index("by_projectId", ["projectId"])
    .index("by_projectId_tradeType", ["projectId", "tradeType"]),

  // Sequencing plan (one per project, Trade Manager mode)
  sequencingPlans: defineTable({
    projectId: v.id("projects"),
    phases: v.any(),           // ordered array of phase objects
    totalDurationEstimate: v.string(),
  }).index("by_projectId", ["projectId"]),

  // Coordination checklist (one per project, Trade Manager mode)
  coordinationChecklists: defineTable({
    projectId: v.id("projects"),
    items: v.any(),            // array of checklist items
  }).index("by_projectId", ["projectId"]),

  // Generated PDF documents
  documents: defineTable({
    projectId: v.id("projects"),
    documentType: v.string(),  // "scope_electrical", "sequencing_plan", "full_package"
    storageId: v.string(),     // Convex file storage ID
    filename: v.string(),
  }).index("by_projectId", ["projectId"]),
});
```

---

## 4. AI Pipeline

### Overview

The AI system runs as a **two-stage pipeline** inside Convex actions (async server functions that can call external APIs).

```
Stage 1: PHOTO ANALYSIS
  Input:  3-10 user photos
  API:    Gemini 3 Vision (multimodal)
  Output: Structured JSON — layout, fixtures, materials, condition, flags
  Store:  project.photoAnalysis + projectPhotos[].analysisResult

Stage 2: SCOPE GENERATION
  Input:  photoAnalysis + answers + propertyDetails + mode + qualityTier
  API:    Gemini 3 Text (with structured output)
  Output: Per-trade scope JSON + sequencing plan + coordination checklist
  Store:  scopes[] + sequencingPlans + coordinationChecklists
```

### 4.1 Stage 1 — Photo Analysis

Runs when user completes photo upload and hits "Continue".

```
Convex Action: analysePhotos(projectId)

1. Fetch all photos from Convex file storage
2. Send ALL photos to Gemini 3 in a single multimodal request
3. System prompt instructs extraction of:
   - Room layout and approximate dimensions
   - Existing fixtures (cooktop type, oven, sink, etc.)
   - Current materials (benchtop, flooring, splashback, cabinets)
   - Visible services (GPOs, plumbing, gas connections)
   - Structural observations (load-bearing walls, windows, ceiling)
   - Condition flags (water damage, outdated electrical, asbestos-era materials)
   - Estimated property age from visual cues
4. Response: structured JSON
5. Store result in project.photoAnalysis
6. Update project.photoAnalysisStatus → "running" → "complete" (or "failed") when done
```

### 4.2 Stage 2 — Scope Generation

Runs when user hits "Generate My Scope" (after questions answered).

```
Convex Action: generateScopes(projectId)

1. Load project (photoAnalysis, answers, propertyDetails, mode)
2. Determine required trades from projectType + answers:
   Kitchen → [demolition, plumbing, electrical, carpentry, tiling, stone, painting]
   + structural (if wall removal answer = yes)
3. Build master context object (shared across all trade prompts)
4. For EACH required trade (sequential — each ~3-5 seconds):
   a. Load trade-specific prompt template
   b. Inject master context
   c. Call Gemini 3 API → structured JSON output
   d. Run validation layer (asbestos flags, compliance, required fields)
   e. Store as scopes document in Convex
5. Generate sequencing plan (if mode === "trades")
   - Single Gemini call with all generated scopes as context
   - Output: ordered phases with durations and dependencies
   - Store as sequencingPlans document
6. Generate coordination checklist (if mode === "trades")
   - Derived from sequencing plan + scope cross-references
   - Store as coordinationChecklists document
7. Update project.status → "generated"
```

### 4.3 Prompt Architecture

```
lib/ai/prompts/
├── master-system.md          # Shared context: AU standards, output format, quality rules
├── photo-analysis.md         # Vision analysis prompt
├── trades/
│   ├── demolition.md
│   ├── plumbing.md
│   ├── electrical.md
│   ├── carpentry.md
│   ├── tiling.md
│   ├── stone.md
│   ├── painting.md
│   ├── structural.md
│   └── waterproofing.md      # Bathroom/laundry only
├── sequencing.md             # Sequencing plan generation
└── coordination.md           # Coordination checklist generation
```

Each trade prompt follows the same structure:
1. Role definition (expert AU renovation project manager)
2. Context injection (property, photos, answers, quality tier)
3. Specific requirements for that trade
4. Required output JSON schema
5. Validation rules (must include exclusions, compliance refs, etc.)

### 4.4 Validation Layer

After each AI response, a programmatic check runs:

```
- Property age < 1990 → ensure asbestos note present
- Wet areas (bathroom/laundry) → ensure waterproofing items present
- Every scope MUST have: items[], exclusions[], compliance notes
- State-specific compliance references applied
- PC sums adjusted to quality tier ranges
- Empty/null fields filled with sensible defaults
```

---

## 5. Data Flow — Full User Journey

### 5.1 Step-by-Step Flow

```
STEP 0 — LANDING PAGE (/)
│  Server-rendered, SEO-optimised
│  User clicks "Start My Scope — Free Preview"
│
▼
STEP 1 — MODE SELECTION (/create — step 0)
│  User picks "I'll coordinate trades myself" or "I'll hire a builder"
│  NO backend call yet — stored in client state only
│  No account required
│
▼
STEP 2 — PROJECT SETUP (/create — step 1)
│  User selects project type (kitchen, bathroom, laundry, living, outdoor)
│  Enters property details: suburb, state, property type, year built
│  NO backend call yet — stored in client state only
│  MVP: single room per project (no "Full Home" or "Extension")
│
▼
STEP 3 — PHOTO UPLOAD (/create — step 2)
│  User uploads 3-10 photos of their current space
│  Each photo: uploaded to Convex file storage immediately
│  Photos stored with temporary session ID (no auth yet)
│
│  On "Continue":
│  ┌─────────────────────────────────────────────┐
│  │ BACKGROUND: Convex action analysePhotos()   │
│  │ Sends all photos to Gemini 3 Vision API     │
│  │ Stores result in photoAnalysis field         │
│  │ Runs ~10-15 seconds while user does Step 4  │
│  └─────────────────────────────────────────────┘
│
▼
STEP 4 — SMART QUESTIONS (/create — step 3)
│  Static question set loaded based on projectType
│  NO adaptation from photo analysis in MVP
│  User taps to answer 8-12 multiple-choice questions
│  Answers stored in client state
│  Photo analysis completes in background (user doesn't notice)
│
▼
STEP 5 — AUTH GATE (/create — step 3.5)
│  ┌──────────────────────────────────────────────────────┐
│  │ SIGNUP/LOGIN REQUIRED before generation               │
│  │                                                       │
│  │ "Create a free account to generate your scope"        │
│  │ Options: Email+password / Google OAuth                 │
│  │                                                       │
│  │ On signup:                                            │
│  │ → Create project in Convex with all client state      │
│  │ → Link uploaded photos to new project                 │
│  │ → Save mode, projectType, property, answers           │
│  │ → Attach photoAnalysis result if already complete     │
│  └──────────────────────────────────────────────────────┘
│
▼
STEP 6 — GENERATION (/create — step 4)
│  User clicks "Generate My Scope"
│  → Convex action: generateScopes(projectId)
│
│  ┌──────────────────────────────────────────────────────┐
│  │ GENERATION PIPELINE (~30-60 seconds)                  │
│  │                                                       │
│  │ Backend updates generationProgress after each trade:  │
│  │                                                       │
│  │  { total: 7, completed: 0, current: "demolition" }   │
│  │  → Gemini call: demolition scope → save to DB         │
│  │  { total: 7, completed: 1, current: "plumbing" }     │
│  │  → Gemini call: plumbing scope → save to DB           │
│  │  { total: 7, completed: 2, current: "electrical" }   │
│  │  → Gemini call: electrical scope → save to DB         │
│  │  ... continues for each trade ...                     │
│  │  { total: 7, completed: 7, current: null }            │
│  │                                                       │
│  │  → Gemini call: sequencing plan (hybrid template+AI)  │
│  │  → Gemini call: coordination checklist                │
│  │  → project.status = "generated"                       │
│  └──────────────────────────────────────────────────────┘
│
│  CLIENT-SIDE PROGRESS UX (hybrid):
│  → Subscribes to project.generationProgress via Convex reactive query
│  → Real milestones: "Generating electrical scope..." updates live
│  → Smooth animation between milestones (CSS transition on progress bar)
│  → If trade fails: auto-retry once (2s delay)
│  → If retry fails: mark trade as failed, continue remaining trades
│
▼
STEP 7 — PREVIEW + PAYWALL (/create — step 5)
│  Shows SUMMARY ONLY (not full scopes):
│  ┌──────────────────────────────────────────────────────┐
│  │ ✓ SCOPE PACKAGE READY                                │
│  │ Kitchen Renovation — Paddington, NSW                  │
│  │                                                       │
│  │ Your package contains:                                │
│  │ ⚡ Electrical — 11 scope items                        │
│  │ 🔧 Plumbing — 7 scope items                          │
│  │ 🔨 Demolition — 8 scope items                        │
│  │ 🪚 Carpentry — 8 scope items                         │
│  │ 🔲 Tiling — 6 scope items                            │
│  │ 🪨 Stone Benchtop — 7 scope items                    │
│  │ 🎨 Painting — 6 scope items                          │
│  │ 📅 Sequencing Plan — 15 phases                       │
│  │ ✅ Coordination Checklist                             │
│  │                                                       │
│  │ Sample: "New dedicated circuit for wall oven —        │
│  │         32A circuit, 6mm² cable from switchboard..."  │
│  │                                                       │
│  │ [Unlock Full Scope — $49 / $99 / $149]               │
│  └──────────────────────────────────────────────────────┘
│
│  → User selects tier and clicks "Unlock"
│  → Convex action: createStripeSession(projectId, tier)
│  → Redirect to Stripe Checkout
│
▼
STEP 8 — PAYMENT (Stripe Checkout — hosted)
│
│  ├── SUCCESS → Redirect to /scope/{projectId}
│  │   → Webhook fires async → markProjectPaid mutation
│  │   → Page polls project.status until "paid"
│  │
│  └── CANCEL → Redirect back to paywall step
│
▼
STEP 9 — FULL SCOPE VIEW (/scope/[projectId])
│  Only accessible if project.status === "paid"
│  → Convex query: getScopes(projectId) — all trade scope JSON
│  → Tabbed interface: one tab per trade + sequencing + checklist
│  → Each scope item has a checkbox (toggle include/exclude)
│  → Toggles saved via Convex mutation: updateScopeItem()
│  → Toggles persist and affect PDF output
│
▼
STEP 10 — DOWNLOAD & DELIVERY
   → "Download All" button → Convex action: generatePdf(projectId)
   → PDF built from stored JSON (respects item toggles)
   → Individual trade PDFs or full ZIP bundle
   → "Email to me" → Convex action: sendScopeEmail()
   → Scope saved to account dashboard for re-access anytime
```

### 5.2 Error Handling — Generation Failures

Each trade scope is generated and saved independently. If a Gemini call fails:

```
TRADE GENERATION FAILURE FLOW:

1. Trade N call fails (timeout, rate limit, bad JSON)
   │
   ▼
2. Auto-retry once after 2-second delay
   │
   ├── Retry succeeds → continue to trade N+1, no user impact
   │
   └── Retry fails →
       │
       ▼
3. Mark trade as "failed" in generationProgress
   Save all previously successful trades
   Continue generating remaining trades
   │
   ▼
4. Generation completes with partial results
   generationProgress: { total: 7, completed: 6, failed: ["plumbing"] }
   project.status still → "generated"
   │
   ▼
5. Preview shows:
   "6 of 7 scopes generated successfully"
   "⚠️ Plumbing scope encountered an issue"
   [Retry Plumbing Scope] button
   │
   ▼
6. User clicks Retry → Convex action: retryTradeScope(projectId, "plumbing")
   → Single Gemini call for just that trade
   → On success: save scope, update generationProgress
```

### 5.3 Photo Analysis Timing

```
TIMELINE: What happens when

  STEP 3 (Photos)          STEP 4 (Questions)          STEP 5 (Auth)
  ─────────────────────────────────────────────────────────────────
  User uploads photos       User answers questions       User signs up
  Photos go to storage      ~2-3 minutes                 ~30 seconds
  ──┬──────────────────────────────────────────
    │
    └─► analysePhotos() starts in background
        Takes ~10-15 seconds
        Completes during question step ✓
        Result stored, ready for generation

  IF photo analysis hasn't completed by generation time:
  → generateScopes() waits for it (polls photoAnalysis field)
  → Max wait: 30 seconds, then generate without photo context
  → Scopes will still work (answers + property details are sufficient)
  → Photo analysis adds richness, not critical path dependency
```

### 5.4 Auth Handoff — Guest to Authenticated

```
BEFORE AUTH (Steps 0-4):
  Client state holds: { mode, projectType, propertyDetails, answers }
  Photos uploaded to Convex storage with a temporary sessionId (UUID)
  No project document in DB yet

AUTH GATE (Step 5):
  User signs up / logs in
  → Convex mutation: createProjectFromSession({
      userId: authenticatedUser.id,
      sessionId: tempSessionId,
      mode, projectType, propertyDetails, answers
    })
  → This mutation:
    1. Creates project document with all collected data
    2. Finds photos with matching sessionId → updates them with projectId
    3. Attaches photoAnalysis if already complete
    4. Returns projectId
  → Client stores projectId, proceeds to generation

AFTER AUTH (Steps 6+):
  All operations use projectId + authenticated userId
  Convex queries/mutations verify userId === project.userId
```

### 5.5 Scope Preview — What's Free vs Paid

```
FREE (before payment):
  ✓ Trade names and icons
  ✓ Item COUNT per trade (e.g. "11 scope items")
  ✓ 1-2 SAMPLE items per trade (first item, shown in full)
  ✓ Total number of trades identified
  ✓ Sequencing plan exists (but not viewable)
  ✓ Coordination checklist exists (but not viewable)
  ✗ Full scope items — HIDDEN
  ✗ Exclusions — HIDDEN
  ✗ PC Sums — HIDDEN
  ✗ Compliance notes — HIDDEN
  ✗ Sequencing detail — HIDDEN
  ✗ PDF download — LOCKED
  ✗ Item editing/toggles — LOCKED

PAID (after payment):
  ✓ Everything above, fully visible
  ✓ All scope items with specifications
  ✓ Exclusions, PC Sums, compliance, warnings, DIY options
  ✓ Full sequencing plan with durations and dependencies
  ✓ Coordination checklist
  ✓ Item toggles (customise before download)
  ✓ PDF download (individual + ZIP)
  ✓ Email delivery
  ✓ Saved to account dashboard

HOW THIS WORKS IN CODE:
  → getScopes() query checks project.status
  → If status !== "paid": returns summary only
    { tradeType, title, itemCount, sampleItems: items.slice(0, 1) }
  → If status === "paid": returns full scope data
```

### 5.6 Sequencing Plan — Hybrid Approach

```
TEMPLATE LAYER (deterministic):
  Each project type has a pre-defined phase order:

  Kitchen → [
    { phase: 1, trade: "Demolition" },
    { phase: 2, trade: "Structural" },      // only if wall removal
    { phase: 3, trade: "Plumber rough-in" },
    { phase: 3, trade: "Electrician rough-in" }, // parallel
    { phase: 4, trade: "Plastering" },
    { phase: 5, trade: "Floor tiling" },     // optional timing
    { phase: 6, trade: "Cabinet install" },
    { phase: 7, trade: "Benchtop template" },
    { phase: 8, trade: "Splashback tiling" },
    { phase: 9, trade: "Benchtop install" },
    { phase: 10, trade: "Plumber final fix" },
    { phase: 10, trade: "Electrician final fix" }, // parallel
    { phase: 11, trade: "Painting" },
    { phase: 12, trade: "Clean + appliances" },
  ]

AI LAYER (project-specific):
  Single Gemini call after all scopes generated.
  Input: template phases + generated scope summaries + property details
  AI fills in:
  → Duration estimates based on scope complexity
  → Dependency notes (e.g. "Asbestos clearance required first — property is 1985")
  → Hold points (e.g. "Waterproofing inspection before tiling")
  → Warnings (e.g. "Benchtop lead time: 10-14 days — order early")
  → Removes phases for trades not in scope (e.g. no structural if no wall removal)
  → Adds project-specific coordination notes

STORED RESULT:
  Merge of template structure + AI-generated details
  Saved as sequencingPlans document in Convex
```

### 5.7 PDF Generation — Reflects User Edits

```
USER EDITS SCOPE:
  → Toggles item checkbox off (e.g. unchecks "under-cabinet LED strip lighting")
  → Convex mutation: updateScopeItem(scopeId, itemIndex, included: false)
  → Stored in scope.items[itemIndex].included = false
  → UI immediately reflects change (reactive query)

USER DOWNLOADS PDF:
  → Convex action: generatePdf(projectId)
  → Fetches all scopes for project
  → Filters: only items where included === true
  → Builds PDF with @react-pdf/renderer
  → PDF shows ONLY included items
  → Exclusions, compliance, notes always included regardless
  → PDF header: "Customised Scope — items marked as excluded are not shown"
  → Stores PDF in Convex file storage
  → Returns download URL

RE-DOWNLOAD:
  → If user changes toggles after downloading → old PDF is stale
  → "Download" button always generates fresh PDF from current state
  → Previous PDFs are overwritten (not versioned in MVP)
```

---

## 6. API Design (Convex Functions)

### 6.1 Queries (read, reactive, real-time)

| Function | Input | Returns |
|----------|-------|---------|
| `getProject` | projectId | Full project document |
| `getProjectsByUser` | userId | List of user's projects |
| `getScopes` | projectId | All scope documents for project |
| `getScope` | scopeId | Single scope document |
| `getSequencingPlan` | projectId | Sequencing plan document |
| `getCoordinationChecklist` | projectId | Checklist document |
| `getProjectPhotos` | projectId | All photo documents |
| `getDocuments` | projectId | All generated PDFs |

### 6.2 Mutations (write, transactional)

| Function | Input | Effect |
|----------|-------|--------|
| `createProjectFromSession` | sessionId, userId, mode, projectType, propertyDetails, answers | Creates project from anonymous session, links photos |
| `updateProject` | projectId, fields | Updates project details/answers |
| `updateScopeItem` | scopeId, itemIndex, included | Toggle scope item include/exclude |
| `updateGenerationProgress` | projectId, progress | Updates generationProgress field (called by AI action) |
| `markProjectPaid` | projectId, stripeData | Sets status=paid, stores payment info |
| `deleteProject` | projectId | Removes project + cascading data |
| `savePhoto` | sessionId or projectId, storageId, metadata | Creates projectPhotos record |

### 6.3 Actions (async, can call external APIs)

| Function | Input | External Calls | Effect |
|----------|-------|---------------|--------|
| `analysePhotos` | projectId | Gemini 3 Vision | Stores photoAnalysis, updates photoAnalysisStatus |
| `generateScopes` | projectId | Gemini 3 Text (×N trades) | Stores scopes per-trade, updates generationProgress after each |
| `generateSequencing` | projectId | Gemini 3 Text | Stores sequencing plan (hybrid template + AI) |
| `retryTradeScope` | projectId, tradeType | Gemini 3 Text (×1) | Regenerates single failed trade scope |
| `createStripeSession` | projectId, tier | Stripe API | Returns checkout URL |
| `handleStripeWebhook` | stripe event | — | Calls markProjectPaid mutation |
| `generatePdf` | projectId | — | Builds PDF from current scope state (respects toggles), stores in file storage |
| `sendScopeEmail` | projectId, email | Resend API | Sends email with scope download links |

### 6.4 HTTP Endpoints

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/stripe-webhook` | POST | Convex HTTP endpoint for Stripe webhooks |

---

## 7. Authentication

**Convex Auth** (`@convex-dev/auth`) with the following providers:

| Method | Priority | Status | Notes |
|--------|----------|--------|-------|
| Email + password | P0 | **LIVE** | `{ Password }` from `@convex-dev/auth/providers/Password` |
| Google OAuth | P1 | Deferred | Code ready — add provider + set env vars when credentials available |
| Magic link | P2 | Deferred | Needs Resend (Phase 9) |

**Implementation:**
- `convex/auth.ts` — Password provider config, exports `auth`, `signIn`, `signOut`, `store`, `isAuthenticated`
- `convex/auth.config.ts` — auto-generated by `npx @convex-dev/auth` setup
- `convex/http.ts` — HTTP router with `auth.addHttpRoutes(http)` for JWT/JWKS/OAuth routes + `POST /stripe-webhook` for Stripe
- `convex/stripe.ts` — `createCheckoutSession` action (Stripe Checkout Session creation)
- `convex/schema.ts` — `...authTables` adds: `users`, `authAccounts`, `authSessions`, `authRateLimits`, `authRefreshTokens`, `authVerificationCodes`, `authVerifiers`
- `components/providers.tsx` — `ConvexAuthNextjsProvider` (replaces `ConvexProvider`)
- `app/layout.tsx` — wrapped in `ConvexAuthNextjsServerProvider`
- `middleware.ts` — `convexAuthNextjsMiddleware` protects `/scope/*` and `/account/*`

**Auth flow:**
- Auth is **not required** to start the scope creation flow (Steps 0-3 are anonymous)
- Auth is **required before generation** — user must sign up/login at Step 4 (AuthGate)
- Guest state: mode, project type, property details, answers held in client state; photos uploaded with temporary sessionId
- On signup/login: `createProjectFromSession` mutation (auth-guarded, derives userId from `getAuthUserId`) creates project, links photos
- `ensureProfile` mutation creates a `profiles` entry after sign-up
- Already-authenticated users auto-skip AuthGate (useEffect detects `isAuthenticated` → creates project → advances)
- Standalone auth pages at `/auth/login` and `/auth/signup` (in marketing layout with Header/Footer)
- Header shows "Sign In" when logged out, "Account" + "Sign Out" when logged in
- Convex Auth handles JWT tokens, session management, and user table automatically

---

## 8. Payment Flow (Stripe)

```
User clicks "Unlock Full Scope — $99"
  │
  ▼
Convex action: createStripeSession(projectId, tier)
  → Creates Stripe Checkout Session
  → Includes: price, success_url=/scope/{projectId}, cancel_url=/create
  → Returns: checkout URL
  │
  ▼
Redirect to Stripe Checkout (hosted page)
  → User enters card details
  │
  ├── SUCCESS → Redirect to /scope/{projectId}?session_id=xxx
  │              → Page loads, Convex query checks project.status
  │              → Webhook may arrive before or after redirect
  │
  └── CANCEL → Redirect back to /create paywall step

Stripe Webhook (async):
  → POST /api/stripe-webhook
  → Convex HTTP endpoint verifies signature
  → Calls mutation: markProjectPaid(projectId, { tier, amount, stripePaymentId })
  → project.status = "paid"
```

**Pricing:**

| Tier | Price | Stripe Price ID |
|------|-------|-----------------|
| Starter | $49 AUD | Set in Stripe dashboard |
| Professional | $99 AUD | Set in Stripe dashboard |
| Premium | $149 AUD | Set in Stripe dashboard |

---

## 9. File Storage

Convex file storage handles two types:

| Type | Upload Method | Access |
|------|-------------- |--------|
| User photos | Client upload via `uploadFile()` | Private — only accessible by owning user |
| Generated PDFs | Server-side creation via action | Private — only accessible by owning user after payment |

**Photo upload flow:**
1. Client calls `generateUploadUrl()` mutation
2. Client uploads file directly to Convex storage (no server middleman)
3. Client calls mutation with returned `storageId` to create projectPhotos record
4. Action reads photos via `storage.getUrl(storageId)` for Gemini API calls

---

## 10. Design System

### 10.1 Foundation

| Property | Value |
|----------|-------|
| Font | Geist (via `next/font/google` or Vercel's `@vercel/font`) |
| Component Library | shadcn/ui (Tailwind-based, copy-paste components) |
| CSS Framework | Tailwind CSS v4 |
| Icon Set | Lucide React (default with shadcn/ui) |
| Dark Mode | Full support — CSS variables invert cleanly |

### 10.2 Colour System

Built on CSS custom properties so light/dark mode inverts perfectly.

```css
/* Light mode (default) */
:root {
  --background: 0 0% 100%;           /* #FFFFFF — white */
  --foreground: 0 0% 3.9%;           /* #0A0A0A — near-black */

  --card: 0 0% 100%;                 /* white */
  --card-foreground: 0 0% 3.9%;      /* near-black */

  --muted: 0 0% 96.1%;              /* #F5F5F5 — light grey */
  --muted-foreground: 0 0% 45.1%;   /* #737373 — mid grey */

  --border: 0 0% 89.8%;             /* #E5E5E5 */
  --input: 0 0% 89.8%;              /* #E5E5E5 */
  --ring: 187 72% 45%;              /* teal focus ring */

  --primary: 187 72% 45%;           /* #14B8A6 — teal-500 */
  --primary-foreground: 0 0% 100%;  /* white text on teal */

  --secondary: 0 0% 96.1%;          /* light grey */
  --secondary-foreground: 0 0% 9%;  /* dark text */

  --accent: 187 72% 45%;            /* teal */
  --accent-foreground: 0 0% 100%;   /* white */

  --destructive: 0 84% 60%;         /* red */
  --destructive-foreground: 0 0% 98%;

  --success: 160 84% 39%;           /* green for checkmarks/confirms */
  --warning: 38 92% 50%;            /* amber for warnings */
}

/* Dark mode — clean inversion */
.dark {
  --background: 0 0% 3.9%;          /* #0A0A0A — near-black */
  --foreground: 0 0% 98%;           /* #FAFAFA — near-white */

  --card: 0 0% 7%;                  /* #121212 */
  --card-foreground: 0 0% 98%;

  --muted: 0 0% 14.9%;             /* #262626 */
  --muted-foreground: 0 0% 63.9%;  /* #A3A3A3 */

  --border: 0 0% 14.9%;            /* #262626 */
  --input: 0 0% 14.9%;
  --ring: 187 72% 45%;

  --primary: 187 72% 45%;          /* teal stays consistent */
  --primary-foreground: 0 0% 3.9%; /* dark text on teal in dark mode */

  --secondary: 0 0% 14.9%;
  --secondary-foreground: 0 0% 98%;

  --accent: 187 72% 45%;
  --accent-foreground: 0 0% 3.9%;

  --destructive: 0 62% 50%;
  --destructive-foreground: 0 0% 98%;

  --success: 160 84% 39%;
  --warning: 38 92% 50%;
}
```

**Key principle:** Teal is the constant brand anchor. Black ↔ white swap for backgrounds and text. No colour shifts — just clean inversion.

### 10.3 Typography Scale

```
Font: Geist Sans
Weights: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

text-xs:   12px / 1.5   — captions, helper text
text-sm:   14px / 1.5   — body small, form labels
text-base: 16px / 1.6   — body default
text-lg:   18px / 1.6   — body large, card titles
text-xl:   20px / 1.5   — section headers
text-2xl:  24px / 1.4   — page sub-headers
text-3xl:  30px / 1.3   — page headers
text-4xl:  36px / 1.2   — hero headers (landing page)
```

### 10.4 Component Styling Conventions

- **Border radius:** `rounded-lg` (8px) for cards/containers, `rounded-md` (6px) for inputs/buttons
- **Shadows:** Minimal — `shadow-sm` for elevated cards only, no heavy drop shadows
- **Spacing:** 4px base grid. Padding: `p-4` (16px) for cards, `p-6` (24px) for sections
- **Transitions:** `transition-colors duration-150` on interactive elements
- **Focus:** Teal ring (`ring-primary`) on all focusable elements for accessibility

---

## 11. Folder Structure

```
scope-ai/
├── app/                              # Next.js App Router
│   ├── layout.tsx                    # Root layout (Providers only — no Header/Footer)
│   ├── globals.css                   # Tailwind base + CSS variables (colour system)
│   ├── (marketing)/                  # Route group — marketing pages with Header/Footer
│   │   ├── layout.tsx                # Marketing layout (Header + Footer)
│   │   └── page.tsx                  # Landing page (SSR)
│   ├── (create)/                     # Route group — immersive wizard (no Header/Footer)
│   │   └── create/
│   │       ├── layout.tsx            # Wizard layout (noindex metadata, bare)
│   │       └── page.tsx              # WizardProvider + MotionConfig + WizardContainer
│   ├── (scope)/                       # Route group — scope view (Header, no Footer)
│   │   └── scope/
│   │       └── [projectId]/
│   │           ├── layout.tsx        # Scope layout (Header, max-w-4xl, noindex)
│   │           ├── page.tsx          # Client component — auth/payment gating, data loading
│   │           └── loading.tsx       # Re-exports ScopeSkeleton
│   ├── account/
│   │   ├── page.tsx                  # User dashboard
│   │   └── settings/page.tsx         # Account settings
│   ├── (marketing)/auth/             # Auth pages (in marketing layout with Header/Footer)
│   │   ├── login/page.tsx            # Standalone login (returnTo redirect)
│   │   └── signup/page.tsx           # Standalone signup (ensureProfile + returnTo)
│   ├── privacy/page.tsx
│   └── terms/page.tsx
│
├── components/
│   ├── ui/                           # shadcn/ui components (button, card, tabs, etc.)
│   ├── create/                       # Creation flow step components
│   │   ├── WizardContainer.tsx       # Orchestrator: URL sync, navigation, footer bar
│   │   ├── WizardProgress.tsx        # Weighted progress bar + phase label + question counter
│   │   ├── WizardStepTransition.tsx  # AnimatePresence step slide/fade wrapper
│   │   ├── NavigationGuard.tsx       # AlertDialog for in-app nav when step >= 2
│   │   ├── ResumePrompt.tsx          # "Welcome back" card with Continue/Start Fresh
│   │   ├── SelectableCard.tsx        # Core card component (radio + checkbox modes)
│   │   ├── ModeSelection.tsx         # Step 0: Trade Manager vs Builder
│   │   ├── ProjectSetup.tsx          # Step 1: Project type + property details
│   │   ├── PhotoUpload.tsx           # Step 2: Container
│   │   ├── PhotoTips.tsx             # Collapsible coaching panel
│   │   ├── PhotoUploadZone.tsx       # Dropzone/mobile button switcher
│   │   ├── EmptyDropzone.tsx         # Desktop drag-and-drop zone
│   │   ├── MobileCaptureButtons.tsx  # Camera + Gallery buttons
│   │   ├── ThumbnailGrid.tsx         # Grid of PhotoThumbnail components
│   │   ├── PhotoThumbnail.tsx        # Individual thumbnail with progress/remove
│   │   ├── PhotoCounter.tsx          # Dot indicators + count text
│   │   ├── AuthGate.tsx              # Step 4: Placeholder auth
│   │   ├── GeneratingState.tsx       # Step 5: Mock per-trade card stack
│   │   ├── ScopePreview.tsx          # Step 6: Trade summary + pricing tiers
│   │   └── questions/
│   │       ├── QuestionFlow.tsx      # Step 3 orchestrator
│   │       ├── QuestionCard.tsx      # Single question + options + tooltip
│   │       ├── ProgressDots.tsx      # Clickable dots with navigation
│   │       ├── WhyTooltip.tsx        # Expandable "why we ask" info
│   │       ├── SectionLabel.tsx      # Lightweight group label
│   │       ├── QuestionIntro.tsx     # Welcome screen
│   │       └── GeneratePrompt.tsx    # Pre-generation confirmation
│   ├── scope/                        # Scope display components (Phase 7)
│   │   ├── ScopeViewShell.tsx       # Orchestrator: tabs, AnimatePresence, optimistic updates
│   │   ├── ScopeHeader.tsx          # Title, mode badge, trade count, action buttons
│   │   ├── ScopeTabs.tsx            # Tabs variant="line", horizontal scroll, trade icons
│   │   ├── TradeScope.tsx           # Full trade scope (groups + leaf components)
│   │   ├── ScopeItemGroup.tsx       # Category header + items
│   │   ├── ScopeItemToggle.tsx      # Checkbox + item text + specification
│   │   ├── PCSumsTable.tsx          # Provisional cost sums table
│   │   ├── ScopeExclusions.tsx      # Exclusion list with X icons
│   │   ├── ScopeWarnings.tsx        # Warnings + compliance notes
│   │   ├── ScopeNotes.tsx           # Notes + DIY option card
│   │   ├── SequencingPlan.tsx       # Vertical timeline with hold points
│   │   ├── CoordinationChecklist.tsx # Trade coordination with critical flags
│   │   ├── ScopeSkeleton.tsx        # Pulse skeleton loading state
│   │   └── PaywallGate.tsx          # Unpaid view: trade summaries + pricing tiers
│   └── layout/                       # Shared layout components
│       ├── Header.tsx
│       ├── Footer.tsx
│       └── ThemeToggle.tsx
│
├── hooks/
│   └── useUnsavedChangesWarning.ts   # beforeunload when wizard in progress
│
├── convex/                           # Convex backend
│   ├── schema.ts                     # Database schema (see section 3)
│   ├── projects.ts                   # Project queries + mutations
│   ├── scopes.ts                     # Scope queries + mutations
│   ├── photos.ts                     # Photo upload mutations
│   ├── ai.ts                         # AI actions (analysePhotos, generateScopes)
│   ├── stripe.ts                     # Stripe actions (createSession)
│   ├── pdf.ts                        # PDF generation action
│   ├── email.ts                      # Email delivery action
│   ├── http.ts                       # HTTP endpoints (auth routes + Stripe webhook)
│   ├── auth.ts                       # Auth config (Password provider)
│   └── auth.config.ts                # Auth config (auto-generated by @convex-dev/auth)
│
├── lib/
│   ├── animation-constants.ts        # All animation durations, easings, spring configs
│   ├── wizard/
│   │   ├── WizardContext.tsx          # React Context + useReducer + localStorage
│   │   └── progress.ts               # calculateProgress(), getPhaseLabel()
│   ├── ai/
│   │   ├── prompts/                  # All AI prompt templates (see section 4.3)
│   │   │   ├── master-system.md
│   │   │   ├── photo-analysis.md
│   │   │   ├── trades/
│   │   │   │   ├── demolition.md
│   │   │   │   ├── plumbing.md
│   │   │   │   ├── electrical.md
│   │   │   │   ├── carpentry.md
│   │   │   │   ├── tiling.md
│   │   │   │   ├── stone.md
│   │   │   │   ├── painting.md
│   │   │   │   ├── structural.md
│   │   │   │   └── waterproofing.md
│   │   │   ├── sequencing.md
│   │   │   └── coordination.md
│   │   └── validation.ts             # Post-generation validation rules
│   ├── questions/                    # Question sets per project type
│   │   ├── index.ts                 # Question set loader (getQuestionsForProject)
│   │   ├── kitchen.ts
│   │   ├── bathroom.ts
│   │   ├── laundry.ts
│   │   ├── living.ts
│   │   └── outdoor.ts
│   ├── sequencing/
│   │   └── templates.ts             # Base phase-order templates per project type
│   ├── trades.ts                     # Trade determination logic (project type → required trades)
│   ├── utils.ts                      # cn() utility
│   └── constants.ts                  # Pricing tiers, project types, states, etc.
│
├── types/
│   └── index.ts                      # Shared TypeScript types
│
├── public/
│   └── images/                       # Static assets
│
├── middleware.ts                      # Route protection (convexAuthNextjsMiddleware)
├── CLAUDE.md                         # Agent instructions
├── PRD.md                            # Product requirements
├── ARCHITECTURE.md                   # This file
├── BUILD.md                          # Phased implementation plan
├── package.json
├── next.config.ts
├── tsconfig.json
└── convex.json                       # Convex project config
```

---

## 12. Key Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Database | Convex (not Supabase) | Reactive queries, TypeScript-first, built-in file storage, simpler DX |
| AI Provider | Gemini 3 (not Claude) | Vision + text in one provider, competitive pricing |
| Auth timing | Required before generation | Captures email early. Steps 0-4 are anonymous (low friction), signup gate before expensive AI calls |
| Scope storage | Generate once, store JSON | Predictable costs (no re-generation), instant load on repeat views |
| PDF generation | On-demand from stored JSON | No upfront PDF cost for unpaid users, always reflects user's item toggles |
| Scope generation | Sequential per-trade | Better quality than one mega-prompt, enables real-time progress updates |
| Photo analysis | Immediate on upload, background | Runs during question step — by generation time, analysis is ready. Not a hard dependency |
| Question sets | Static per project type | Simple, predictable. AI adaptation of questions is a V2 feature |
| Sequencing plan | Hybrid (template + AI) | Template provides correct trade order. AI fills project-specific durations, notes, warnings |
| Paywall content | Summary only (not full scopes) | Trade names + item counts + 1 sample item. Maximises conversion while showing quality |
| Error recovery | Save partial + auto-retry + manual retry | Each trade saved independently. Auto-retry once on failure. Manual retry button for persistent failures |
| Scope editing | Toggles affect PDF | Users customise scope before downloading. PDF only includes items where included === true |
| MVP project scope | Single room only | Kitchen, Bathroom, Laundry, Living, Outdoor. No multi-room or Extension until V2 |
| Dark mode | CSS variables inversion | Clean swap, no component-level logic needed |

---

## 13. External Service Dependencies

| Service | Purpose | Failure Impact | Fallback |
|---------|---------|---------------|----------|
| Convex | Everything backend | App non-functional | None — core dependency |
| Gemini 3 API | Photo analysis + scope generation | Cannot generate scopes | Queue and retry, show "try again" |
| Stripe | Payments | Cannot collect payment | Show "temporarily unavailable" |
| Resend | Email delivery | Emails don't send | User can still download PDFs |
| Vercel | Hosting | Site down | None — core dependency |

---

## 14. Security Considerations

| Concern | Mitigation |
|---------|-----------|
| Photo privacy | Convex file storage is private by default. Only authenticated owner can access. |
| Payment integrity | Stripe webhook signature verification. Never trust client-side payment confirmation alone. |
| Scope access | All scope queries (`getScopes`, `getScope`, `getSequencingPlan`, `getCoordinationChecklist`) and mutations (`updateScopeItem`) verify `getAuthUserId` ownership. Paid content only returned if `status === "paid"`. |
| API keys | Stored as Convex environment variables. Never exposed to client. |
| Input sanitisation | Convex validators enforce types. AI prompts use template injection, not string concatenation. |
| Rate limiting | Convex has built-in rate limiting. Additional limits on AI actions to prevent abuse. |

---

*This document is the single source of truth for how ScopeAI is built. Update it as decisions change.*
