# Research Prompt: Structural Trade — Australian Residential Renovations

## Context for the Researcher

I'm building an AI-powered Scope of Works Generator for Australian homeowners planning renovations. Structural work isn't always required, but when it is (typically wall removal or floor modifications), it's one of the most critical and regulated parts of a renovation. The scope generator needs to identify WHEN structural work is needed and what the scope items are.

This is a narrower trade — it only applies when the renovation involves wall removal, floor openings, or load redistribution. But when it does apply, getting it wrong is dangerous and expensive.

---

## SECTION 1: When Is Structural Work Required?

Research the common triggers for structural work in Australian residential renovations:

- **Load-bearing wall removal** — How do you identify a load-bearing wall? (direction of joists/rafters, position in the house, stacked walls in two-storey)
- **Load-bearing wall modification** — Creating openings, widening doorways in load-bearing walls
- **Non-load-bearing wall removal** — Does this ever require structural input? (bracing walls, racking resistance)
- **Floor modifications** — Removing floor sections, changing levels, new openings in concrete slab
- **Roof modifications** — Removing ceiling for raked ceiling, adding skylights
- **Second storey additions** — When footings/existing structure need assessment (for extension project type)
- **Underpinning** — When required? (differential settlement, deepening footings for basement)
- **Retaining walls** — When do they need engineering? (height thresholds)
- **Deck/pergola connections** — When does attaching to the house need engineering?

---

## SECTION 2: The Structural Engineer

Research:
- **What is a structural engineer (vs building designer, vs architect)?** — Qualifications, what they're licensed to do
- **When must a structural engineer be engaged?** — Is it legally required? Or just best practice?
- **What does a structural engineer provide?** — Structural drawings, beam schedules, connection details, load calculations
- **Typical deliverables** — What documents does the engineer produce that the builder/carpenter uses?
- **Cost** — Typical structural engineer fees for common residential scenarios (single wall removal, multiple openings, full renovation)
- **Timeline** — How long does structural engineering take? (initial assessment, design, documentation)
- **How to find one** — Engineers Australia, state registration requirements
- **Council requirements** — When does structural work need council approval (DA, CDC, CC)? What documentation is needed?
- **Building certifier/inspector** — When are structural inspections required during the build? What gets inspected?

---

## SECTION 3: Scope Items for Structural Work

For each common structural scenario, list the scope items:

**A. Load-Bearing Wall Removal (Most Common)**
- Structural engineer engagement (assessment + design + documentation)
- Temporary propping/shoring (before wall removal — who does this? builder/carpenter)
- Wall demolition (see demolition scope — coordination)
- Steel beam supply (UB, PFC, SHS — what types are common in residential?)
- Steel beam installation (lifting, positioning, fixing)
- Post/column installation (what supports the beam at each end?)
- Connection details (post-to-beam, beam-to-existing structure)
- Packing and shimming
- Bearer modifications (if beam bears onto existing structure)
- Footing modifications (if new posts need new footings — concrete pad, pier)
- Making good (patching ceiling, walls around new beam)
- Beam wrapping/cladding (if beam is to be concealed in ceiling — plasterboard bulkhead)
- Fireproofing (is this required in residential? when?)
- Certification and inspection (building certifier sign-off)

**B. Door/Window Opening Widening**
- Structural engineer assessment (is the wall load-bearing?)
- Lintel supply and install (steel or timber, sizing per engineer)
- Jamb studs (trimmer studs)
- Making good around new opening

**C. Floor Modifications**
- Slab penetrations for plumbing (core drilling — who does this?)
- Step-downs/level changes (bathroom, laundry)
- New concrete pour/screed

**D. Roof/Ceiling Modifications**
- Removing ceiling for raked/cathedral ceiling
- Skylight opening (structural trimming)
- Collar tie removal/modification

---

## SECTION 4: Steel Beam Basics

Homeowners hear "you need a steel beam" but don't understand what's involved. Research:

- **Common beam types in Australian residential:**
  - Universal Beam (UB) — sizes commonly used (150UB, 200UB, 250UB, 310UB)
  - Parallel Flange Channel (PFC)
  - Square/Rectangular Hollow Section (SHS/RHS)
  - Lintels
- **How are beams sized?** (engineer calculates based on span, load, deflection limits)
- **Beam delivery** — Can beams go through doorways? When do you need a crane?
- **Surface treatment** — Primer, galvanising, painting. What's typical for internal?
- **Flitch beam** — Timber + steel composite. When is this used instead of full steel?
- **LVL (Laminated Veneer Lumber)** — When can engineered timber replace steel?
- **Typical beam costs** — Ballpark per metre for common sizes (supply only)

---

## SECTION 5: Sequencing & Coordination

- **When does structural work happen?** — After demolition, before any framing/lining work
- **What must happen before structural work?**
  - Engineer has provided certified drawings
  - Council approval (if required)
  - Demolition complete
  - Temporary propping in place
- **What happens during structural work?**
  - Beam delivery and lifting into position
  - Post installation
  - Connection and fixing
  - Inspection by building certifier (HOLD POINT — work cannot continue until passed)
- **What happens after structural work?**
  - Remove temporary propping (once beam is certified)
  - Framing around beam (bulkhead)
  - Other trades can proceed

---

## SECTION 6: Common Exclusions

- Structural engineer fees (usually separate engagement)
- Council/certification fees
- Demolition of the wall (demolition scope)
- Temporary propping (sometimes builder scope, sometimes structural)
- Making good / plastering around beam (plastering scope)
- Painting (painting scope)
- Crane hire (if beam can't be hand-carried in)
- Footing work (if new post requires new footing — may be separate concrete scope)

---

## SECTION 7: Pricing Guidance (For PC Sums)

Ballpark ranges:
- Structural engineer fees (residential wall removal assessment + drawings)
- Steel beam supply per metre (common sizes)
- Steel beam installation (typical single-span wall removal, including posts)
- Building certifier inspection fee
- Temporary propping hire
- Complete wall removal package (engineer + demo + steel + install + make good — typical range)

---

## SECTION 8: Homeowner Mistakes

- Assuming a wall is non-load-bearing without engineering assessment
- Not engaging a structural engineer early enough (delays the project)
- Not understanding that beam size affects ceiling height (beam depth means lower bulkhead)
- Not budgeting for the full structural package (engineer + steel + install + certification)
- Assuming the builder will "figure it out" without engineering drawings
- Not getting council approval when required (illegal building work)
- Removing propping before certification

---

## Output Format

Organise under each section heading. Note sources and confidence. This is a critical-safety trade — accuracy of regulatory requirements is paramount.

---

## Save Instructions

Save all research output as markdown files into the following directory:

```
C:\Users\jayso\scope-ai\research-output\structural\
```

Split your output into multiple files by section grouping, using this naming convention:

```
RESEARCH-structural-when-required.md             → Section 1
RESEARCH-structural-engineer-role.md             → Section 2
RESEARCH-structural-scope-items.md               → Section 3
RESEARCH-structural-steel-beams.md               → Section 4
RESEARCH-structural-sequencing-coordination.md   → Section 5
RESEARCH-structural-exclusions.md                → Section 6
RESEARCH-structural-pricing-guidance.md          → Section 7
RESEARCH-structural-mistakes-red-flags.md        → Section 8
```

Each file should include a sources list at the bottom. Create the directory if it doesn't exist. These files will be used to build AI system prompts for a scope-of-works generator.
