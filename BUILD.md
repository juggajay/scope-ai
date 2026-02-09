# Build Plan — ScopeAI

**Last Updated:** 9 February 2026
**Status:** Phases 0-10 complete + Week 1 hooks/retention complete

> This is the step-by-step implementation plan. Each phase has tasks with acceptance criteria.
> An AI dev instance should work through phases in order. Some tasks within a phase can be parallelised.

**Reference docs:**
- `ARCHITECTURE.md` — System design, schema, data flow, design system
- `PRD.md` — Product requirements, user flows, feature specs
- `CLAUDE.md` — Agent rules, tech stack, what exists

---

## Phase 0: Project Initialisation

**Goal:** Runnable Next.js app with Convex, Tailwind, shadcn/ui, dark mode, and correct fonts.
**Tools:** Look up latest docs via Context7 for: Next.js, Convex, shadcn/ui, next-themes, Tailwind CSS v4

### 0.1 Create Next.js App
- `npx create-next-app@latest scope-ai` with: App Router, TypeScript, Tailwind CSS, ESLint, `src/` directory OFF, import alias `@/`
- Verify `npm run dev` serves the default page
- **Files:** `package.json`, `next.config.ts`, `tsconfig.json`, `tailwind.config.ts`

### 0.2 Install Core Dependencies
```
npm install convex next-themes lucide-react
npm install -D @types/node
```

### 0.3 Set Up Geist Font
- Install via `next/font/google` or `geist` package
- Configure in `app/layout.tsx` as the default font
- **Acceptance:** All text renders in Geist Sans

### 0.4 Initialise shadcn/ui
- `npx shadcn@latest init` — select New York style, Tailwind CSS
- Override primary colour to teal (`187 72% 45%`) per ARCHITECTURE.md Section 10.2
- Install initial components: `button`, `card`, `tabs`, `input`, `label`, `checkbox`, `select`, `dialog`, `progress`, `badge`, `separator`, `tooltip`
- **Files:** `components/ui/*.tsx`, `lib/utils.ts`

### 0.5 Configure Colour System & Dark Mode
- Set up CSS custom properties in `styles/globals.css` exactly matching ARCHITECTURE.md Section 10.2
- Install and configure `next-themes` for dark mode toggle
- **Acceptance:** Light mode = white bg + dark text + teal accents. Dark mode = near-black bg + light text + same teal. Toggle switches cleanly.

### 0.6 Initialise Convex
- `npx convex init` — creates `convex/` directory
- Deploy schema from ARCHITECTURE.md Section 3 to `convex/schema.ts`
- Add `ConvexProvider` to `app/layout.tsx`
- Set Convex URL in `.env.local`
- **Acceptance:** `npx convex dev` runs without errors, schema deploys successfully

### 0.7 Move Existing Files Into Place
- The following already exist and should be integrated (not rewritten):
  - `types/index.ts` — TypeScript types
  - `lib/trades.ts` — Trade determination logic
  - `lib/constants.ts` — Pricing, project types, states
  - `lib/questions/*.ts` — Question sets (5 files + index)
  - `lib/ai/validation.ts` — Post-generation validation
  - `lib/ai/prompts/master-system.md` — Master AI prompt
  - `lib/ai/prompts/photo-analysis.md` — Photo analysis prompt
  - `lib/sequencing/templates.ts` — Sequencing templates
- Ensure all imports resolve correctly with the `@/` alias
- Fix any TypeScript errors from integration
- **Acceptance:** `npm run build` compiles without type errors

**Phase 0 complete when:** `npm run dev` shows a blank app with correct fonts, working dark mode toggle, and Convex connected.

**Status: COMPLETE** (February 2026)

---

## Phase 1: Layout Shell

**Goal:** Shared layout with header, footer, theme toggle — the app shell that wraps all pages.
**Tools:** shadcn/ui (`Button`, `Sheet` for mobile nav), Lucide React icons, next-themes
**Design:** Read `CLAUDE.md` "Design Standards" before building. The layout sets the tone for the entire app. No generic headers.

### 1.1 Root Layout (`app/layout.tsx`)
- Wraps children in: `ConvexProvider` → `ThemeProvider` (next-themes) → font class
- HTML `lang="en-AU"`
- Metadata: title "ScopeAI — Professional Renovation Scopes", description for SEO
- **Acceptance:** All routes inherit layout, theme persists across navigation

### 1.2 Header (`components/layout/Header.tsx`)
- Logo text "ScopeAI" (or simple wordmark) linking to `/`
- Nav: "Start My Scope" CTA button (links to `/create`)
- Theme toggle (dark/light) using `next-themes`
- Mobile: hamburger menu or simplified header
- **Acceptance:** Header visible on all pages, CTA prominent, responsive

### 1.3 Footer (`components/layout/Footer.tsx`)
- Links: How It Works, Pricing, Privacy, Terms
- Copyright line
- Minimal — not a distraction
- **Acceptance:** Footer renders on all pages, links work

### 1.4 Theme Toggle (`components/layout/ThemeToggle.tsx`)
- Sun/moon icon toggle using Lucide icons
- Uses `next-themes` `useTheme()` hook
- Smooth transition between modes
- **Acceptance:** Toggle switches correctly, icon reflects current mode

**Phase 1 complete when:** Every route has header + footer, dark mode toggles correctly, teal accents look right in both modes.

**Status: COMPLETE** (8 February 2026)
- `components/layout/ThemeToggle.tsx` — Sun/Moon toggle with hydration guard
- `components/layout/Header.tsx` — Sticky header, logo, nav links, teal CTA, mobile Sheet drawer
- `components/layout/Footer.tsx` — Centered links + copyright
- `app/layout.tsx` — Providers only (Header/Footer moved to marketing layout in Phase 3)
- `app/(marketing)/layout.tsx` — Header + Footer wrapping children (moved from root layout)
- `app/(marketing)/page.tsx` — Minimal placeholder (moved from `app/page.tsx` in Phase 3)

---

## Phase 2: Landing Page

**Goal:** SEO-optimised landing page that converts visitors to scope creation starts.
**Tools:** shadcn/ui (`Card`, `Accordion`, `Button`, `Badge`), Framer Motion (scroll animations, stagger reveals)
**Design:** This is the first thing users see. Read `CLAUDE.md` "Design Standards" carefully. NO generic SaaS template. Copy must be specific to Australian homeowners. Reference `PRD.md` Section 7.1 for requirements and Section 8 for UX principles.

### 2.1 Landing Page (`app/page.tsx`)
- Server-rendered (default in App Router)
- Sections (top to bottom):
  1. **Hero** — Headline, subtext, "Start My Scope — Free Preview" CTA
  2. **Problem** — "Sound familiar?" pain point cards
  3. **How It Works** — 3-step visual (Photos → Questions → Scopes)
  4. **Sample Output** — Screenshot/mockup of a generated scope
  5. **Pricing** — 3 tiers from `lib/constants.ts` PRICING_TIERS
  6. **FAQ** — Accordion with common questions
  7. **Final CTA** — Repeat "Start My Scope" button
- Mobile-first responsive design
- **SEO:** meta title, description, OG tags targeting "renovation scope of works template australia"

### 2.2 Pricing Section Component
- Reads from `PRICING_TIERS` in `lib/constants.ts`
- 3-column card layout (highlight "Professional" as recommended)
- Feature lists per tier
- "Start My Scope" CTA on each card (all link to `/create`)
- **Acceptance:** Prices display correctly, recommended tier is visually emphasised

**Phase 2 complete when:** Landing page renders all sections, is responsive on mobile, and "Start My Scope" links to `/create`.

---

## Phase 3: Creation Flow — UI Shell

**Goal:** Multi-step wizard with navigation, progress indicator, and client-side state management. Steps render placeholder content initially.
**Tools:** Framer Motion (`AnimatePresence` for step transitions, `motion.div` for cards), shadcn/ui (`Card`, `Button`, `Progress`, `Checkbox`, `Select`, `Input`, `Tooltip`)
**Design:** The wizard IS the product. **Read `research-output/ux-wizard/RESEARCH-wizard-implementation-spec.md` BEFORE writing any wizard code.** It contains exact animation configs, component file structure, card state classes, progress weights, per-step UX specs, and accessibility requirements. Follow it as the wizard blueprint. Also read `CLAUDE.md` "Design Standards" — no generic form UX.

### 3.0 Animation Constants (`lib/animation-constants.ts`)
- Create shared animation config file with all durations, easings, and spring configs
- Exact values specified in `research-output/ux-wizard/RESEARCH-wizard-implementation-spec.md` Section 3.3
- **Acceptance:** Single source of truth for all animation timings, imported by all wizard components

### 3.0b Wizard Context (`lib/wizard/WizardContext.tsx`)
- React Context + useReducer for wizard state management
- localStorage persistence per-step (save on each step completion)
- Resume detection on return visit (show "Welcome back" prompt)
- Exact spec in implementation-spec Section 7
- **Acceptance:** State persists across browser refresh, resume prompt works

### 3.0c Selectable Card (`components/create/SelectableCard.tsx`)
- Core reusable card component used across all wizard steps (mode, project type, questions)
- Supports radio mode (single-select) and checkbox mode (multi-select)
- States: default, hover, focus-visible, selected, disabled, "not sure" (dashed border)
- Exact Tailwind classes in implementation-spec Section 4.2
- Framer Motion: `whileTap` scale 0.97, selection checkmark SVG draw-on animation
- ARIA: `role="radio"` / `role="checkbox"` with `aria-checked`
- **Acceptance:** Card feels physical on tap, selection is instant and clear, works with keyboard

### 3.1 Wizard Container (`components/create/WizardContainer.tsx`)
- Orchestrates steps, URL sync (`/create?step=N` via pushState), navigation, footer bar
- Uses `AnimatePresence` for step transitions (hybrid slide+fade, 250ms, specs in implementation-spec Section 3)
- 4 semantic phases: "Your Project", "Your Space", "Your Plans", "Your Scope"
- Weighted progress bar (front-loaded — 50% reached by mid-questions, spec Section 2.2)
- Airbnb-style persistent footer: Back (ghost) + Continue (teal primary), hidden during auto-advance steps
- Navigation guard: `beforeunload` + AlertDialog for in-app nav when step ≥ 2
- Reduced motion support: wrap in `<MotionConfig reducedMotion="user">`
- **Acceptance:** Steps transition smoothly, progress feels fast, back button works, browser back navigates steps

### 3.2 Mode Selection (`components/create/ModeSelection.tsx`)
- Two large `SelectableCard` components, stacked on mobile, side-by-side on desktop
  - "I'll coordinate trades myself" (Trade Manager) — icon, description, "76% choose this"
  - "I'll hire a builder" (Builder Mode) — icon, description
- **Auto-advance:** Selecting a card auto-advances to Step 1 after 600ms delay (no "Next" button)
- Footer hidden on this step (auto-advance replaces it)
- See implementation-spec Section 8: Step 0
- **Acceptance:** Tap card → checkmark draws on → auto-advances smoothly

### 3.3 Project Setup (`components/create/ProjectSetup.tsx`)
- Project type selector: 5 visual cards from `PROJECT_TYPES` in `lib/constants.ts`
- Property details form:
  - Suburb (text input)
  - State (select from `AUSTRALIAN_STATES`)
  - Property type (select from `PROPERTY_TYPES`)
  - Year built (number input)
- Validation: project type and state required
- If year < 1990: show inline asbestos note ("Properties built before 1990 may contain asbestos materials. We'll include inspection recommendations.")
- **Acceptance:** All fields capture correctly, asbestos warning appears for pre-1990

### 3.4 Photo Upload (`components/create/PhotoUpload.tsx`)
- **Mobile-first: camera buttons, NOT drag-and-drop** (implementation-spec Section 6.1)
  - Mobile: "Take Photos" + "Choose from Gallery" stacked buttons
  - Desktop: Drag-and-drop zone via `react-dropzone` with click fallback
- Accepted types: JPEG, PNG, HEIC, WebP (from `PHOTO_ACCEPTED_TYPES`)
- Min 3, max 10 photos (from constants)
- Max 10MB per file
- Thumbnail grid: `grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4`, aspect-square
- Per-file circular progress rings on thumbnails (not linear bars)
- Remove button: always visible on mobile, hover on desktop
- **Minimum count: progress-framed** ("2 of 3 minimum" in muted text, shifts to "3 photos added — nice!" in teal)
- Collapsible tips panel with project-type-specific guidance (auto-collapses after first photo)
- No drag-to-reorder (implementation-spec Section 6.6 — no impact on AI analysis)
- **Phase 3:** Upload to Convex file storage (or mock if backend not ready)
- See implementation-spec Section 6 for full spec
- **Acceptance:** Photos display as thumbnails, circular progress visible during upload, count framing works

### 3.5 Smart Questions (`components/create/questions/QuestionFlow.tsx`)
- **One question per screen** with auto-advance on single-select (Typeform model — implementation-spec Section 5)
- Loads question set from `lib/questions/` based on `projectType`
- Each question: `text-lg font-semibold` heading, `SelectableCard` options below, optional "why" tooltip (inline expand on tap, not hover/modal)
- Single-select: auto-advance after 600ms. Multi-select: "Continue" button in footer
- Lightweight section labels between groups ("Appliances", "Finishes") — not full-page dividers
- Welcome intro screen: "12 quick questions about your kitchen. Most people finish in under 2 minutes."
- Clickable progress dots for back-navigation to any answered question
- Question transitions: horizontal slide 40px distance, spring easing (spec Section 5.5)
- "Not sure yet" options: dashed border, muted text, always last (spec Section 4.4)
- No summary screen — brief confirmation before generation showing photo count + identified trades
- Answers stored in wizard state as `QuestionAnswers` type
- See implementation-spec Sections 4 and 5 for full card and question specs
- **Acceptance:** Questions feel like conversation not interrogation, auto-advance eliminates friction, back-nav works via dots

### 3.6 Auth Gate (`components/create/AuthGate.tsx`)
- Shows signup/login form before generation
- Message: "Create a free account to generate your scope"
- Options: Email + password, Google OAuth (if configured)
- On success: creates project in Convex with all wizard state data
- Placeholder implementation OK — full auth in Phase 5
- **Acceptance:** Auth gate blocks generation, captures user intent

### 3.7 Generating State (`components/create/GeneratingState.tsx`)
- **Per-trade card stack** (implementation-spec Section 8: Step 5):
  - 0-3s: Animated processing indicator + "Starting your scope generation..."
  - 3-60s: Each trade appears as a card. Starts as skeleton, animates in (fade+slide up 20px) as trade completes. Currently-generating trade pulses
  - Complete: All cards show checkmarks → "Your scope is ready!" scale-in → "View Your Scope" button fade-in
- Backwards-moving stripe animation on progress bar during generation (reduces perceived wait — spec Section 2.4)
- Educational tips rotating below progress: new tip every 8-10s with crossfade
- Subscribes to `project.generationProgress` via Convex reactive query
- Error: amber warning on failed trade card with "[Retry]" button — other trades continue
- Footer hidden during generation
- **Phase 3:** Mock with static progress animation using setTimeout
- See implementation-spec Sections 2.4 and 8: Step 5
- **Acceptance:** Generation feels engaging not anxious, failed trades show clearly with retry option

### 3.8 Scope Preview (`components/create/ScopePreview.tsx`)
- Shows summary only (paywall):
  - Package title ("Kitchen Renovation — Paddington, NSW")
  - List of trades with icons + item counts
  - 1-2 sample items per trade (first item shown in full)
  - "Your package contains: X trade scopes + sequencing plan + coordination checklist"
- Pricing tier selector (3 cards from constants)
- "Unlock Full Scope" CTA button
- **Phase 3:** Static mockup with placeholder data
- **Acceptance:** Preview looks professional, pricing tiers display correctly, CTA prominent

**Phase 3 complete when:** Full multi-step wizard navigates correctly, all step components render with appropriate content (can use mock data), responsive on mobile.

**Status: COMPLETE** (8 February 2026)
- Route groups: `(marketing)` for landing page, `(create)` for wizard
- Root layout (`app/layout.tsx`) now Providers-only (no Header/Footer)
- Marketing layout wraps Header + Footer; wizard layout is bare with noindex
- `lib/animation-constants.ts` — step transitions, card springs, stagger, progress spring
- `lib/wizard/WizardContext.tsx` — React Context + useReducer + localStorage persistence
- `lib/wizard/progress.ts` — weighted progress calculation + phase labels
- `hooks/useUnsavedChangesWarning.ts` — beforeunload hook
- `components/create/SelectableCard.tsx` — radio/checkbox card, Framer Motion, ARIA, haptics
- `components/create/WizardContainer.tsx` — orchestrator with URL sync, footer bar, navigation guard
- `components/create/WizardProgress.tsx` — weighted progress bar + phase label + question counter
- `components/create/WizardStepTransition.tsx` — AnimatePresence slide+fade
- `components/create/NavigationGuard.tsx` — AlertDialog for in-app navigation
- `components/create/ResumePrompt.tsx` — session resume with stale detection
- `components/create/ModeSelection.tsx` — Step 0 with auto-advance
- `components/create/ProjectSetup.tsx` — Step 1 with project type + property form + asbestos warning
- `components/create/PhotoUpload.tsx` + 6 sub-components — Step 2 with mock upload, dropzone, thumbnails
- `components/create/questions/QuestionFlow.tsx` + 5 sub-components — Step 3 with auto-advance, progress dots
- `components/create/AuthGate.tsx` — Step 4 placeholder
- `components/create/GeneratingState.tsx` — Step 5 mock with per-trade card stack + tips
- `components/create/ScopePreview.tsx` — Step 6 with trade summary + pricing tiers
- `react-dropzone` + `alert-dialog` (shadcn) installed
- Stripe animation CSS added to globals.css
- Build passes with zero TypeScript errors

---

## Phase 4: Convex Backend — Core Functions

**Goal:** Working backend — project CRUD, photo storage, scope queries with paywall logic.
**Tools:** Look up latest Convex docs via Context7 for: schema deployment, queries, mutations, file storage, indexes

### 4.1 Schema Deployment (`convex/schema.ts`)
- If not done in Phase 0, deploy the full schema from ARCHITECTURE.md Section 3
- All 7 tables: profiles, projects, projectPhotos, scopes, sequencingPlans, coordinationChecklists, documents
- All indexes defined
- **Acceptance:** `npx convex dev` deploys without errors

### 4.2 Project Functions (`convex/projects.ts`)
- **Query:** `getProject(projectId)` — returns full project document
- **Query:** `getProjectsByUser(userId)` — returns list of user's projects
- **Mutation:** `createProjectFromSession({ sessionId, userId, mode, projectType, propertyDetails, answers })` — creates project, links pre-auth photos by sessionId
- **Mutation:** `updateProject(projectId, fields)` — updates project details/answers
- **Mutation:** `updateGenerationProgress(projectId, progress)` — updates progress during generation
- **Mutation:** `markProjectPaid(projectId, stripeData)` — sets status=paid, stores payment info
- All mutations verify `userId === project.userId` for security
- **Acceptance:** Can create, read, update projects via Convex dashboard or test client

### 4.3 Photo Functions (`convex/photos.ts`)
- **Mutation:** `generateUploadUrl()` — returns Convex upload URL
- **Mutation:** `savePhoto({ sessionId, projectId, storageId, originalFilename, fileSize, mimeType })` — creates projectPhotos record (uses `sessionId` before auth, `projectId` after)
- **Query:** `getProjectPhotos(projectId)` — returns all photos for project
- **Mutation:** `deletePhoto(photoId)` — removes photo record and storage
- **Acceptance:** Can upload photos via client, photos appear in project query

### 4.4 Scope Functions (`convex/scopes.ts`)
- **Query:** `getScopes(projectId)` — returns all scopes for project
  - **PAYWALL LOGIC:** If `project.status !== "paid"`, return summary only: `{ tradeType, title, itemCount, sampleItems: items.slice(0, 1) }`
  - If paid: return full scope data
- **Query:** `getScope(scopeId)` — single scope (full data, access-checked)
- **Mutation:** `updateScopeItem(scopeId, itemId, included)` — toggle item include/exclude
- **Query:** `getSequencingPlan(projectId)` — returns sequencing plan (paid only)
- **Query:** `getCoordinationChecklist(projectId)` — returns checklist (paid only)
- **Acceptance:** Paywall logic works — unpaid returns summary, paid returns full data

### 4.5 Wire Up Frontend to Backend
- Connect PhotoUpload component to Convex file storage
- Connect Auth Gate to create project from wizard state
- Connect ScopePreview to `getScopes()` query (summary data)
- GeneratingState subscribes to `project.generationProgress`
- **Acceptance:** End-to-end: upload photos, create project, see project in Convex dashboard

**Phase 4 complete when:** Can create a project with photos, query scopes with paywall logic, toggle scope items. All data persists in Convex.

---

## Phase 5: Authentication

**Goal:** Working auth flow — email/password + Google OAuth, guest-to-authenticated handoff.
**Tools:** Look up latest Convex Auth docs via Context7. Do NOT use NextAuth or Auth.js.

### 5.1 Convex Auth Setup (`convex/auth.ts`)
- Configure Convex Auth with email/password provider
- Configure Google OAuth provider (requires Google Cloud Console setup)
- **Acceptance:** Can create account and login via Convex Auth

### 5.2 Login Page (`app/auth/login/page.tsx`)
- Email + password form
- Google OAuth button
- Link to signup
- Error handling (wrong password, user not found)
- **Acceptance:** Can log in with email/password, redirects to account or previous page

### 5.3 Signup Page (`app/auth/signup/page.tsx`)
- Email + password + optional name
- Google OAuth button
- Link to login
- Creates profile in Convex on signup
- **Acceptance:** Can create account, profile created in DB

### 5.4 Auth Gate Integration
- Connect `AuthGate` component to real Convex Auth
- On signup: call `createProjectFromSession` mutation with all wizard state
- Handle: user already logged in → skip auth gate
- Handle: user logs in (existing account) → still creates new project
- **Acceptance:** Anonymous user signs up in wizard, project created with all their data, photos linked

### 5.5 Protected Routes
- Scope view (`/scope/[projectId]`) — requires auth + ownership check
- Account page (`/account`) — requires auth
- Redirect to login if unauthenticated
- **Acceptance:** Unauthenticated users redirected, can't access other users' projects

**Phase 5 complete when:** Full auth flow works — signup, login, logout. Auth gate in wizard creates project. Protected routes enforce access.

**Status: COMPLETE** (8 February 2026)
- `@convex-dev/auth` + `@auth/core` installed; `npx @convex-dev/auth` ran (JWT keys + SITE_URL set on deployment)
- `convex/auth.ts` — Password provider (named import: `{ Password }`)
- `convex/auth.config.ts` — auto-generated by setup command
- `convex/http.ts` — HTTP router with `auth.addHttpRoutes(http)`
- `convex/schema.ts` — `...authTables` added (users, authAccounts, authSessions, authRateLimits, authRefreshTokens, authVerificationCodes, authVerifiers — 10 new indexes)
- `convex/projects.ts` — `createProjectFromSession` auth-guarded (no `userId` arg, uses `getAuthUserId`), `getProjectsByUser` derives userId from auth, `getProject` has ownership check, new `currentUser` query, new `ensureProfile` mutation
- `components/providers.tsx` — `ConvexProvider` → `ConvexAuthNextjsProvider`
- `app/layout.tsx` — wrapped in `ConvexAuthNextjsServerProvider`, function made `async`
- `components/create/AuthGate.tsx` — full rewrite: real sign-up/sign-in form, auto-skip for authenticated users, inline error handling, profile creation
- `app/(marketing)/auth/login/page.tsx` — standalone login with returnTo redirect
- `app/(marketing)/auth/signup/page.tsx` — standalone signup with ensureProfile + returnTo redirect
- `components/layout/Header.tsx` — auth-conditional: "Sign In" link when logged out, "Account" + "Sign Out" when logged in (desktop + mobile)
- `middleware.ts` — `convexAuthNextjsMiddleware` protects `/scope/*` and `/account/*` → redirects to `/auth/login`
- Google OAuth deferred (needs Google Cloud Console credentials)
- Email verification / password reset deferred (needs Resend — Phase 9)
- `npm run build` passes with zero TypeScript errors

---

## Phase 6: AI Integration

**Goal:** Working photo analysis and scope generation via Gemini 3 API.
**Tools:** `@google/generative-ai` SDK. Look up latest Gemini API docs via Context7. All AI calls run in Convex actions (server-side).

**Status: COMPLETE** — All 9 trade prompts written and deployed. No blocked trades remaining.

### 6.1 Gemini API Setup
- Store Gemini API key as Convex environment variable
- Create helper function for Gemini API calls (vision + text)
- Handle: rate limits, timeouts, malformed responses
- **Files:** `convex/ai.ts` (or `convex/lib/gemini.ts` for the helper)

### 6.2 Photo Analysis Action (`convex/ai.ts` — `analysePhotos`)
- Fetches all project photos from Convex storage
- Sends to Gemini 3 Vision API with `photo-analysis.md` prompt
- Injects property context (state, type, year built)
- Parses structured JSON response
- Stores in `project.photoAnalysis`
- Updates `project.photoAnalysisStatus`
- **Acceptance:** Upload photos → analysis runs → structured JSON stored in project

### 6.3 Scope Generation Action (`convex/ai.ts` — `generateScopes`)
- Loads project data (photoAnalysis, answers, propertyDetails)
- Calls `determineRequiredTrades()` from `lib/trades.ts`
- Builds master context object
- For each trade (sequential):
  1. Loads trade-specific prompt from `lib/ai/prompts/trades/{trade}.md`
  2. Combines with `master-system.md` + project context
  3. Calls Gemini 3 API
  4. Parses JSON response
  5. Runs `validateScope()` from `lib/ai/validation.ts`
  6. Applies validation additions (e.g., injected asbestos items)
  7. Saves as `scopes` document in Convex
  8. Updates `generationProgress`
- On failure: auto-retry once (2s delay), then mark as failed and continue
- **Acceptance:** Can generate scopes for project, each saved independently, progress updates in real-time

### 6.4 Sequencing Generation
- After all trade scopes generated
- Loads sequencing template from `lib/sequencing/templates.ts`
- Filters template for included trades
- Sends to Gemini with scope summaries for AI-specific details (durations, warnings)
- Stores as `sequencingPlans` document
- **Acceptance:** Sequencing plan generated with correct phase order and project-specific notes

### 6.5 Retry Action (`convex/ai.ts` — `retryTradeScope`)
- Regenerates a single failed trade scope
- Same logic as 6.3 but for one trade only
- Updates `generationProgress.failed` on success
- **Acceptance:** Retry button on UI triggers single trade regeneration

### 6.6 Trade-Specific Prompts
- Write `lib/ai/prompts/trades/{trade}.md` for each trade using completed research
- **Currently available:** electrical, carpentry (research complete)
- **All trade research complete** — no blockers remaining
- Each prompt follows structure: role + context injection + trade requirements + output schema
- **Acceptance:** Prompts produce scope JSON matching `TradeScope` type

### 6.7 Wire Up Frontend
- Photo upload triggers `analysePhotos` action in background
- "Generate My Scope" button calls `generateScopes` action
- GeneratingState component subscribes to live `generationProgress`
- ScopePreview loads summary data from `getScopes` query
- **Acceptance:** Full flow: photos → analysis → questions → generate → progress → preview

**Phase 6 complete when:** End-to-end AI pipeline works — photos analysed, scopes generated per trade, sequencing plan created, progress updates show in real-time.

**Status: COMPLETE** (8 February 2026)

**Notes:**
- All 9 trade prompts written and deployed: electrical, plumbing, demolition, structural, carpentry, stone, painting, tiling, waterproofing
- No blocked trades remaining — `BLOCKED_TRADES` set is empty
- Model: `gemini-2.5-pro-preview-05-06` (vision + text)
- Security fix: public `updateProject` mutation now has auth check and restricted fields
- Convex import isolation solved: all shared logic duplicated into `convex/lib/` with inlined types

---

## Phase 7: Scope View & Editing ✅

**Status:** COMPLETE (8 February 2026)
**Goal:** Full scope view (post-payment) with tabbed interface, item toggles, and all scope details.

### What was built

**Security fix:** Added `getAuthUserId` ownership checks to all 5 public functions in `convex/scopes.ts` — `getScopes`, `getScope`, `getSequencingPlan`, `getCoordinationChecklist`, `updateScopeItem`.

**Route & layout (3 files):**
- `app/(scope)/scope/[projectId]/layout.tsx` — Header (no Footer), `max-w-4xl`, noindex
- `app/(scope)/scope/[projectId]/page.tsx` — Client component, data loading, auth/payment gating, redirect on null
- `app/(scope)/scope/[projectId]/loading.tsx` — Re-exports ScopeSkeleton

**Components (14 files in `components/scope/`):**
- `ScopeViewShell.tsx` — Orchestrator: tab state, AnimatePresence, optimistic updates
- `ScopeHeader.tsx` — Title, mode badge, trade count, date, disabled PDF/Email buttons
- `ScopeTabs.tsx` — shadcn Tabs `variant="line"`, horizontal scroll on mobile, trade icons
- `TradeScope.tsx` — Groups items by category, stagger animation, composes leaf components
- `ScopeItemGroup.tsx` — Category header + item list
- `ScopeItemToggle.tsx` — Checkbox + item + specification + compliance note, 44px touch targets
- `PCSumsTable.tsx` — Semantic table, right-aligned numbers, "Estimates Only" badge
- `ScopeExclusions.tsx` — Red X icon per exclusion
- `ScopeWarnings.tsx` — Yellow warning cards + compliance notes
- `ScopeNotes.tsx` — General notes + teal DIY card
- `SequencingPlan.tsx` — Vertical timeline, hold points in yellow, parallel badges
- `CoordinationChecklist.tsx` — Critical items sorted first, red emphasis, trade badges
- `ScopeSkeleton.tsx` — Pulse skeleton loading state
- `PaywallGate.tsx` — Trade summary cards + pricing tiers (buttons disabled until Phase 8)

**Key patterns:**
- Optimistic updates via `useMutation().withOptimisticUpdate()` for instant checkbox toggles
- Tab transitions: 150ms opacity fade via AnimatePresence
- Unpaid projects see PaywallGate (summary cards + pricing); paid see full ScopeViewShell

---

## Phase 8: Payment (Stripe)

**Goal:** Working Stripe integration — checkout, webhook, access unlocking.
**Tools:** `stripe` npm package (server-side only). Look up latest Stripe Checkout + Webhooks docs via Context7. Use Stripe Checkout (hosted page) — do NOT build custom payment forms.

### 8.1 Stripe Setup
- Create Stripe account + products/prices for 3 tiers
- Store Stripe secret key + webhook signing secret as Convex env vars
- Store Stripe publishable key in `.env.local`

### 8.2 Create Checkout Session (`convex/stripe.ts`)
- Action: `createStripeSession(projectId, tier)`
- Creates Stripe Checkout Session with:
  - Correct price ID for selected tier
  - `success_url: /scope/{projectId}?session_id={CHECKOUT_SESSION_ID}`
  - `cancel_url: /create` (back to paywall)
  - `metadata: { projectId }`
- Returns checkout URL
- **Acceptance:** Clicking "Unlock" redirects to Stripe Checkout with correct price

### 8.3 Stripe Webhook (`convex/http.ts`)
- HTTP endpoint: `POST /api/stripe-webhook`
- Verifies Stripe signature
- On `checkout.session.completed`:
  - Extracts `projectId` from metadata
  - Calls `markProjectPaid` mutation
- **Acceptance:** After successful Stripe payment, project.status = "paid"

### 8.4 Payment Success Flow
- After Stripe redirect to `/scope/{projectId}`:
  - Page checks `project.status`
  - If not yet "paid" (webhook pending): poll/subscribe until status changes
  - Once "paid": show full scope view
- **Acceptance:** User pays → redirected → sees full scope (even if webhook takes a moment)

### 8.5 Wire Up Paywall
- ScopePreview's "Unlock" button calls `createStripeSession`
- Redirects to Stripe
- Success → full access
- Cancel → back to preview
- **Acceptance:** Full payment flow works end-to-end in Stripe test mode

**Phase 8 complete when:** Payment flow works — select tier, pay via Stripe (test mode), project unlocks, full scope accessible.

**PHASE 8 COMPLETE** (8 February 2026)

**Files created/modified:**
- **Created:** `convex/stripe.ts` — `createCheckoutSession` action (auth, ownership check, tier→price mapping, Stripe Checkout Session)
- **Modified:** `convex/http.ts` — Added `POST /stripe-webhook` route with signature verification, handles `checkout.session.completed`
- **Modified:** `convex/projects.ts` — Converted `markProjectPaid` → `markProjectPaidInternal` (internal mutation, idempotency guard)
- **Modified:** `components/scope/PaywallGate.tsx` — Wired tier buttons to `createCheckoutSession`, loading states, error display
- **Modified:** `components/create/ScopePreview.tsx` — Same Stripe checkout wiring for wizard preview
- **Modified:** `app/(scope)/scope/[projectId]/page.tsx` — Payment confirmation UX (spinner while webhook pending), passes `projectId` to PaywallGate

---

## Phase 9: PDF Generation & Delivery

**Goal:** Professional PDF downloads that respect user's item toggles.
**Tools:** `@react-pdf/renderer` for PDF generation, `resend` for email delivery. Look up latest docs via Context7 for both. Do NOT use html-to-pdf or puppeteer.

### 9.1 PDF Template (`lib/pdf/templates.tsx` or `convex/pdf.ts`)
- Use `@react-pdf/renderer` to build PDF from scope JSON
- Template includes:
  - Header: "ScopeAI" branding, project details (type, suburb, date)
  - Trade scope section per trade (only included items)
  - Specifications, exclusions, compliance notes
  - PC Sums table
  - Warnings section
  - Footer: "Generated by ScopeAI — scopeai.com.au"
- **Acceptance:** PDF looks professional, clean typography, all data present

### 9.2 PDF Generation Action (`convex/pdf.ts`)
- Action: `generatePdf(projectId, options)`
- Options: single trade or full package
- Fetches scopes, filters to `included === true` items
- Generates PDF, stores in Convex file storage
- Returns download URL
- **Acceptance:** Can generate and download individual trade PDFs and full package

### 9.3 ZIP Bundle
- Action: `generateZipBundle(projectId)`
- Generates all trade PDFs + sequencing plan PDF
- Bundles into ZIP
- Stores and returns download URL
- **Acceptance:** "Download All" button downloads ZIP with all PDFs

### 9.4 Download UI
- "Download" button per trade tab
- "Download All (ZIP)" button on scope view
- Loading state while PDF generates
- **Acceptance:** Downloads work, loading state shown during generation

### 9.5 Email Delivery (`convex/email.ts`)
- Action: `sendScopeEmail(projectId, email)`
- Uses Resend API
- Email contains: project summary + download links (or attached PDFs if small)
- **Acceptance:** "Email to me" sends email with scope access

**Phase 9 complete when:** PDFs generate correctly reflecting item toggles, downloads work, email delivery works.

### Phase 9 Completion — 8 February 2026

**Approach:** Client-side PDF generation (not Convex actions) using `@react-pdf/renderer` with dynamic imports to avoid SSR issues. Email delivery via Resend in a `"use node"` Convex action.

**New files (9):**
- `lib/pdf/styles.ts` — Shared PDF stylesheet (teal brand, tables, sections)
- `lib/pdf/ScopeDocument.tsx` — Full scope package PDF (all trades + sequencing + coordination)
- `lib/pdf/SingleTradeDocument.tsx` — Individual trade PDF
- `lib/pdf/generate.tsx` — PDF blob generation (dynamic imports for code-splitting)
- `lib/pdf/zip.tsx` — ZIP bundle with jszip
- `hooks/useScopeDownload.ts` — Download state management + file-saver
- `convex/documents.ts` — Document record CRUD (auth + ownership)
- `convex/email.ts` — Resend email action (`"use node"`, PDF attachment via storage URL)
- `components/scope/EmailDialog.tsx` — Email send flow (generate → upload → send → save)

**Modified files (4):**
- `components/scope/ScopeHeader.tsx` — DropdownMenu for PDF/ZIP, email button
- `components/scope/TradeScope.tsx` — Per-trade download button
- `components/scope/ScopeViewShell.tsx` — Wired useScopeDownload hook + EmailDialog
- `components/providers.tsx` — Added Toaster (sonner)

**Dependencies added:** `@react-pdf/renderer`, `jszip`, `file-saver`, `resend`, `@types/file-saver`, shadcn `dropdown-menu` + `sonner`

---

## Phase 10: Account Dashboard & Polish

**Goal:** User can access past scopes, and the app is polished for launch.

### 10.1 Account Dashboard (`app/account/page.tsx`)
- Lists user's projects with: project type, suburb, date, status
- Click through to scope view
- "Start New Scope" button
- **Acceptance:** User sees all their projects, can navigate to each

### 10.2 Account Settings (`app/account/settings/page.tsx`)
- Update email, name
- Change password
- Delete account (with confirmation)
- **Acceptance:** Settings save correctly

### 10.3 Mobile Polish Pass
- Test all flows on mobile viewport (375px)
- Touch targets ≥ 44px
- No horizontal scroll
- Readable without zoom
- Photo upload works on mobile (camera capture)
- **Acceptance:** Full flow completable on mobile

### 10.4 Error States
- Network error handling (Convex disconnects)
- Empty states (no projects, no photos)
- 404 pages (invalid project ID)
- Loading states (skeletons, not spinners) for all data-dependent views
- **Acceptance:** No unhandled errors, graceful degradation

### 10.5 SEO & Metadata
- Landing page: full meta tags, OG image, structured data
- Create page: noindex (don't index wizard)
- Scope page: noindex (private content)
- `robots.txt` and `sitemap.xml`
- **Acceptance:** Lighthouse SEO score > 90

### 10.6 Legal Pages
- Privacy policy (`app/privacy/page.tsx`)
- Terms of service (`app/terms/page.tsx`)
- Content can be placeholder initially
- **Acceptance:** Pages exist and are linked from footer

**Phase 10 complete when:** Dashboard works, app is polished on mobile, error states handled, SEO configured.

**Status: COMPLETE** (8 February 2026)

---

## Week 1: Measurement + Conversion (Hooks & Retention)

**Goal:** PostHog analytics foundation + highest-impact conversion fixes from hooks-and-retention research audit.

**Research input:** `research-output/hooks-retention/` (8 files — Hook Model, Retention Loops, Skill Blueprint)

### W1.1 PostHog Analytics
- Installed `posthog-js`, created `lib/analytics.ts` (trackEvent, identifyUser, useWizardAnalytics)
- Created `components/posthog-provider.tsx` — graceful no-op when env vars missing
- Wired into `components/providers.tsx`
- **10 Priority 1 events:** wizard_started, wizard_step_completed, wizard_step_abandoned, photo_uploaded, question_answered, preview_viewed, pricing_tier_selected, checkout_started, payment_completed, scope_pdf_downloaded
- `posthog.identify()` in AuthGate after sign-in
- **Files:** `lib/analytics.ts` (NEW), `components/posthog-provider.tsx` (NEW), `components/providers.tsx`, `WizardContainer.tsx`, `PhotoUpload.tsx`, `QuestionFlow.tsx`, `ScopePreview.tsx`, `PaywallGate.tsx`, `AuthGate.tsx`, `useScopeDownload.ts`, `scope/[projectId]/page.tsx`

### W1.2 Trust Signals at Paywall
- Created `components/scope/TrustSignals.tsx` — Stripe badge, 14-day guarantee, AS/NZS 3000
- Inserted in both ScopePreview and PaywallGate after pricing grid

### W1.3 Sample Item Scoring
- `convex/scopes.ts` — replaced `slice(0, 1)` with `pickBestSampleItem()` scoring function
- Scores: compliance notes +3, detailed spec +2, numbers in spec +1, generic removal items -2

### W1.4 Total Item Count Headline
- Added "Your {type} renovation requires **X scope items** across Y trades" to ScopePreview and PaywallGate

### W1.5 Specification Display in Sample Items
- Sample items now show specification text (italic, smaller) below the item name

### W1.6 AuthGate Back Button
- Added "Back to questions" link with ChevronLeft above auth form — users no longer trapped at step 4

### W1.7 Hero + FinalCTA Refinement
- CTA text: "Start My Scope" → "Start My Scope — Free Preview"
- Button: h-11 → h-12 (48px), text-sm → text-base

**Week 1 complete when:** All events fire in dev (verify via network tab), trust signals/headlines/specs visible, AuthGate has back button, CTA updated, `npm run build` passes, E2E tests pass.

**Status: COMPLETE** (9 February 2026)

---

## Phase Dependencies

```
Phase 0 (Init)
  └─► Phase 1 (Layout)
       ├─► Phase 2 (Landing Page)
       └─► Phase 3 (Creation Flow UI)
            └─► Phase 4 (Convex Backend)
                 ├─► Phase 5 (Auth)
                 │    └─► Phase 6 (AI Integration) ✅
                 │         └─► Phase 7 (Scope View)
                 │              └─► Phase 8 (Payment)
                 │                   └─► Phase 9 (PDF & Delivery)
                 │                        └─► Phase 10 (Polish)
                 │
                 └─► Phase 7 can start in parallel with Phase 5
                     (use mock scope data while auth builds)
```

**Parallelisation opportunities:**
- Phase 2 (Landing) and Phase 3 (Creation Flow) can run in parallel
- Phase 5 (Auth) and Phase 7 (Scope View) can partially overlap using mock data
- Trade-specific prompts (Phase 6.6) — ALL COMPLETE, all 9 trades have prompts deployed

---

## Research → Prompt Pipeline

As trade research completes, write the corresponding prompt:

| Trade | Research Status | Prompt File | Prompt Status |
|-------|----------------|-------------|---------------|
| Electrical | COMPLETE | `lib/ai/prompts/trades/electrical.md` | DONE |
| Carpentry | COMPLETE | `lib/ai/prompts/trades/carpentry.md` | DONE |
| Plumbing | COMPLETE | `lib/ai/prompts/trades/plumbing.md` | DONE |
| Demolition | COMPLETE | `lib/ai/prompts/trades/demolition.md` | DONE |
| Tiling | COMPLETE | `lib/ai/prompts/trades/tiling.md` | DONE |
| Stone | COMPLETE | `lib/ai/prompts/trades/stone.md` | DONE |
| Painting | COMPLETE | `lib/ai/prompts/trades/painting.md` | DONE |
| Structural | COMPLETE | `lib/ai/prompts/trades/structural.md` | DONE |
| Waterproofing | COMPLETE | `lib/ai/prompts/trades/waterproofing.md` | DONE |

All 9 trade prompts are embedded in `convex/lib/prompts.ts` as string constants.
Sequencing and coordination prompts also embedded in the same file.

---

*This document is the implementation roadmap. Update task statuses as phases complete.*
