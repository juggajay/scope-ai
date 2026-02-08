# Research Prompt: Stone Benchtop Trade — Australian Residential Renovations

## Context for the Researcher

I'm building an AI-powered Scope of Works Generator for Australian homeowners planning renovations. The tool generates stone benchtop scope documents. Stone/benchtop work is a distinct trade from cabinetry — the stone mason measures, fabricates, and installs benchtops AFTER cabinets are installed. This is a shorter, more focused scope than electrical or plumbing, but getting the specifications right is critical because stone is expensive and mistakes are permanent.

---

## SECTION 1: Stone Types & Materials

Research all benchtop material options available in Australia:

**Engineered Stone (Quartz):**
- Major brands available in Australia (Caesarstone, Silestone, Smartstone, Essastone, Quantum Quartz, Dekton)
- Thickness options (20mm, 30mm, 40mm — or laminated to appear thicker)
- Edge profile options (square, pencil round, bullnose, bevelled, waterfall mitre, laminated edge)
- Colour ranges and pricing tiers within each brand
- Silica content concerns — are there any current Australian regulations or health considerations around engineered stone fabrication? (this became a big issue recently)
- Warranty details (typically 10-15 years?)

**Natural Stone:**
- Marble (Carrara, Calacatta, etc.) — maintenance requirements, sealing, staining risk
- Granite — durability, maintenance, availability in Australia
- Quartzite — vs quartz (engineered), durability
- Limestone, travertine — suitable for benchtops?
- Sealing requirements and ongoing maintenance (how does this affect scope?)

**Other Materials (for reference/comparison):**
- Porcelain slab (Dekton, Neolith, Laminam) — growing in popularity?
- Concrete benchtops — who makes these? Specialist trade?
- Timber benchtops — not stone mason scope, but note for completeness
- Laminate benchtops — typically supplied by cabinet maker, not stone mason
- Solid surface (Corian) — separate trade?
- Stainless steel — commercial/specialist

---

## SECTION 2: Scope Items — Stone Benchtop

Comprehensive list of everything in a stone benchtop scope:

**Template and Measure:**
- When can templating happen? (AFTER all cabinets installed and level, BEFORE splashback tiling in most cases)
- What does the template involve? (laser template vs physical template)
- How long does it take?
- What needs to be confirmed before template? (sink, cooktop, tap — exact models and dimensions)

**Fabrication:**
- Lead time (typical in Australian market — 10-14 days?)
- What affects fabrication complexity/cost? (cut-outs, curves, waterfall joins, book-matching)
- CNC fabrication vs hand fabrication

**Standard Scope Items:**
- Benchtop supply (material, thickness, colour)
- Sink cut-out (undermount vs top-mount vs integrated — different requirements)
- Cooktop cut-out (to manufacturer template)
- Tap hole drilling (number and position)
- Edge profiles (specify which edges get which profile)
- Waterfall ends (mitred join — what's involved? is the vein matching perfect?)
- Island benchtop (separate piece? joined to main run?)
- Breakfast bar overhang (support bracket requirements — who supplies? carpenter or stone mason?)
- Splashback in stone (if applicable — instead of tiles)
- Window sill in stone
- Installation (silicone bedded, levelled, shimmed)
- Join/seam placement (where joins go — cosmetic consideration, owner should approve)
- Polishing/finishing on site

**Additional Items:**
- Drainer grooves (routed into stone near sink)
- Pop-up power cut-outs
- Soap dispenser hole
- Water filter tap hole
- Recessed draining board
- Hob cut-out (if stone wraps up behind cooktop)

---

## SECTION 3: Sequencing & Coordination

This is critical — stone benchtop is one of the most sequencing-dependent trades:

- **What must be complete BEFORE stone template?**
  - All cabinetry installed, level, and secured
  - Sink model confirmed and ideally on site
  - Cooktop model confirmed (dimensions needed for cut-out)
  - Tap model confirmed (hole sizes and positions)
  - Any stone splashback height confirmed
- **What happens BETWEEN template and installation?**
  - Fabrication: 10-14 working days typically
  - Splashback tiling should happen during this window (after cabinets, before benchtop)
  - Plumber should NOT do final fix until benchtop is installed
- **What must happen AFTER stone installation?**
  - Plumber: install sink, connect waste, install taps
  - Electrician: cooktop connection (if hardwired)
  - Silicone cure time before use
- **Common sequencing mistakes:**
  - Tiling splashback AFTER benchtop (creates ugly gap/silicone line)
  - Templating before cabinets are final (template will be wrong)
  - Not having sink on site at template (delays everything)
  - Changing tap model after template (hole positions may be wrong)

---

## SECTION 4: Common Exclusions

- Sink supply (owner-selected)
- Tapware supply (owner-selected)
- Cooktop supply
- Plumbing connection (licensed plumber)
- Electrical connection (licensed electrician)
- Cabinet modifications (if cabinets aren't level — carpenter's responsibility)
- Splashback if in different material (tiler's scope)
- Stone splashback (sometimes included, sometimes separate quote)
- Additional cut-outs beyond standard (e.g., soap dispenser — may be additional cost)
- Sealing (engineered stone generally doesn't need it, natural stone does — clarify)
- Support brackets for overhangs (carpenter provides, or stone mason?)

---

## SECTION 5: Pricing Guidance (For PC Sums)

Ballpark ranges for Australian capital cities:
- Engineered stone per linear metre (20mm thickness, supply and install, by price tier)
- Natural stone per linear metre (marble, granite — supply and install)
- Porcelain slab per linear metre
- Waterfall end (additional cost)
- Undermount sink cut-out
- Cooktop cut-out
- Standard edge profile vs premium profile
- Laminated (thicker) edge premium
- Stone splashback per linear metre
- Template and install (is this separate from material cost or bundled?)

---

## SECTION 6: Homeowner Mistakes

- Not selecting sink/cooktop/taps before template (delays the entire project)
- Choosing natural stone without understanding maintenance requirements
- Not understanding join placement (expecting seamless when joins are necessary)
- Assuming waterfall ends are included in base price
- Not understanding the difference between 20mm and 40mm (laminated) thickness pricing
- Choosing the cheapest stone without considering durability (some lighter colours stain)
- Not budgeting for the full benchtop (stone is one of the biggest single costs in a kitchen reno)

---

## Output Format

Organise under each section heading. Note sources and confidence. This is a more focused trade — the research should be comprehensive but doesn't need the same depth as electrical or plumbing.

---

## Save Instructions

Save all research output as markdown files into the following directory:

```
C:\Users\jayso\scope-ai\research-output\stone-benchtop\
```

Split your output into multiple files by section grouping, using this naming convention:

```
RESEARCH-stone-materials-types.md                → Section 1
RESEARCH-stone-scope-items.md                    → Section 2
RESEARCH-stone-sequencing-coordination.md        → Section 3
RESEARCH-stone-exclusions.md                     → Section 4
RESEARCH-stone-pricing-guidance.md               → Section 5
RESEARCH-stone-mistakes-red-flags.md             → Section 6
```

Each file should include a sources list at the bottom. Create the directory if it doesn't exist. These files will be used to build AI system prompts for a scope-of-works generator.
