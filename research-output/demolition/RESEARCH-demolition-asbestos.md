# SECTION 3: Asbestos -- The Critical Knowledge

> **Purpose:** This document provides the foundational asbestos knowledge required by the Scope AI scope-of-works generator for Australian residential renovation demolition. Asbestos is the single highest risk factor in Australian residential demolition and renovation work.
>
> **Confidence Level:** HIGH -- based on Australian government sources, Safe Work Australia Codes of Practice, and state-level WHS regulator guidance.
>
> **Last Updated:** 2026-02-08

---

## Table of Contents

1. [Asbestos in Australian Homes by Era](#1-asbestos-in-australian-homes-by-era)
2. [Common Asbestos-Containing Materials by Room](#2-common-asbestos-containing-materials-acms-by-room)
3. [Asbestos Testing Process](#3-asbestos-testing-process)
4. [Asbestos Removal Process](#4-asbestos-removal-process)
5. [Cost Ranges for Asbestos Removal](#5-cost-ranges-for-asbestos-removal)
6. [Asbestos Found During Demolition](#6-what-happens-if-asbestos-is-found-during-demolition)
7. [Key Regulatory Framework](#7-key-regulatory-framework)
8. [Decision Logic for Scope AI](#8-decision-logic-for-scope-ai)
9. [Sources](#9-sources)

---

## 1. Asbestos in Australian Homes by Era

Australia banned all asbestos use, sale, and import on 31 December 2003. However, the vast majority of asbestos-containing materials (ACMs) were installed well before the ban. The construction era of the home is the single strongest indicator of asbestos risk.

### Risk Summary by Era

| Era | Risk Level | Summary |
|-----|-----------|---------|
| **Pre-1960** | **VERY HIGH** | Asbestos used extensively from the 1920s onward. Post-WWII housing boom drove mass adoption of asbestos cement products. Tile/asbestos-cement sheet roofing was standard. |
| **1960--1980** | **HIGHEST** | Peak asbestos use in Australia. Over 70% of homes from this era contain ACMs. Australia was one of the highest per-capita consumers of asbestos globally. Wittenoom was the largest supplier of crocidolite (blue asbestos). |
| **1980--1990** | **HIGH** | First regulations introduced in 1978. Gradual phase-out began, but asbestos products were still widely available and commonly installed. Contractors continued using old stock through mid-1980s. |
| **Post-1990** | **LOW (but not zero)** | Unlikely to contain ACMs, but NOT guaranteed safe. Some asbestos products remained on shelves and in contractor stockpiles after manufacturing ceased. Renovations on post-1990 homes may have reused older materials. |

### Detailed Breakdown

#### Pre-1960 Homes

- Asbestos import into Australia began around 1920, accelerated by the post-WWI housing boom.
- By the 1930s, James Hardie and other manufacturers were producing asbestos cement ("fibro") products at scale.
- Post-WWII (1945+): Second major housing boom. Fibro homes became ubiquitous, particularly in outer suburbs of Sydney, Melbourne, Brisbane, and Newcastle.
- **Common ACMs:** Fibro wall cladding, roof sheeting (corrugated and flat), eave linings, internal wall linings, pipe lagging, electrical backing boards.
- **Key risk:** Homes of this age may have had multiple renovations, adding layers of ACMs from different eras.

#### 1960--1980 Homes (Peak Asbestos Use)

- This is the peak period. Australia consumed more asbestos per capita than almost any other country.
- The 1960s--1970s saw asbestos incorporated into over 3,000 different products.
- Spray-on asbestos coatings became popular for textured decorative ceilings and walls during the 1950s--1960s.
- Vinyl floor tiles containing asbestos were the standard flooring product.
- **Common ACMs:** Everything from the pre-1960 list PLUS vinyl floor tiles, vinyl sheet flooring, tile adhesives (black mastic), textured/stipple ceilings, bathroom and kitchen tile substrates (Tilux, Villaboard), carpet underlay, window putty.
- **Key risk:** Virtually every room in the home may contain multiple ACMs. A bathroom renovation from this era could involve fibro wall linings, asbestos tile substrate, vinyl flooring, and pipe lagging -- all in one small room.

#### 1980--1990 Homes

- First asbestos regulations introduced in Australia in 1978 (ban on crocidolite/blue asbestos).
- Amosite (brown asbestos) banned in 1985.
- Chrysotile (white asbestos) phase-out began but was not completed until 2003.
- Asbestos cement products were gradually replaced with cellulose-fibre cement (e.g., Hardiplank) from the mid-1980s.
- **Common ACMs:** Eave linings, electrical meter boards, vinyl flooring (still common), some wall cladding, some roof materials. Less likely in interior wall linings.
- **Key risk:** Contractors frequently used remaining asbestos stockpiles through 1984--1985. Products that visually look identical to modern fibre cement may still contain asbestos.

#### Post-1990 Homes

- Unlikely to contain purpose-built ACMs, but exceptions exist.
- Some asbestos-containing products were legally available until the 2003 ban.
- Imported products (especially from Asia) occasionally contained asbestos even after regulations tightened.
- Renovations may have incorporated salvaged or old-stock asbestos materials.
- **Key risk:** Do not assume a post-1990 home is asbestos-free if it has been renovated, extended, or if it incorporates materials from an older structure.

### Decision Rule for Scope AI

```
IF home_built_year < 1990:
    asbestos_risk = "ASSUMED PRESENT"
    action = "Asbestos inspection REQUIRED before any demolition"
ELIF home_built_year >= 1990 AND home_built_year < 2003:
    asbestos_risk = "POSSIBLE"
    action = "Visual assessment recommended; testing if suspect materials found"
ELIF home_built_year >= 2003:
    asbestos_risk = "UNLIKELY"
    action = "Note in scope; flag if renovation history is unknown"
```

---

## 2. Common Asbestos-Containing Materials (ACMs) by Room

### Master Reference Table

| Material | Common Locations | Visual Clues | Asbestos Type | Risk When Disturbed | Friability |
|----------|-----------------|--------------|---------------|---------------------|------------|
| **Fibro sheeting (flat)** | Eaves, soffits, internal walls, wet area linings, ceilings, fences | White-grey, smooth or dimpled ("golf ball" texture), may be painted. Galvanised shear-point nails with flat heads. | Chrysotile (white) | HIGH if cut/drilled/broken | Non-friable (bonded) |
| **Fibro sheeting (corrugated)** | Roofing ("Super Six"), fencing, shed walls | Corrugated profile, white-grey, hard and brittle | Chrysotile | HIGH if cut/drilled/broken | Non-friable (bonded) |
| **Vinyl floor tiles** | Kitchen, bathroom, laundry, hallways | Often 9-inch (225mm) or 12-inch (305mm) squares. Marbled, speckled, or plain finish. | Chrysotile | MODERATE-HIGH | Non-friable |
| **Vinyl floor tile adhesive (black mastic)** | Under vinyl tiles, under sheet vinyl | Black, tar-like adhesive residue under tiles | Chrysotile (1--5% content typical) | MODERATE | Non-friable |
| **Vinyl sheet flooring** | Kitchen, bathroom, laundry | Sheet vinyl with felt or hessian backing | Chrysotile | MODERATE | Non-friable |
| **Textured/stipple ceilings (vermiculite)** | Living areas, bedrooms, hallways | Rough "popcorn" or "cottage cheese" texture, silver-gold to grey-brown granules | Varies (contamination source) | HIGH (friable when disturbed) | Can be friable |
| **Asbestos cement tile substrate** | Behind bathroom tiles, behind kitchen splashback tiles | Hidden behind ceramic tiles. Products: Tilux, Villaboard, Coverline, Hardiflex, Harditherm | Chrysotile | HIGH during tile removal | Non-friable (bonded) |
| **Pipe lagging/insulation** | Roof void, sub-floor, around hot water pipes, heating ducts | Rope-like or tape wrapping, plaster-like "hard lagging" at joints, any colour | Chrysotile, amosite, or crocidolite | VERY HIGH | Often friable |
| **Electrical backing boards** | Meter boxes, switchboards, fuse boards | Dark brown/black boards, rough fibrous surface, tar smell. Brand names: Lebah, Zelemite, Miscolite, Ausbestos | Chrysotile or amosite | MODERATE | Non-friable |
| **Roof materials** | Roof sheeting, ridge capping, gutters, downpipes | White-grey corrugated or flat sheets | Chrysotile | HIGH if cut/broken | Non-friable |
| **Carpet underlay** | Under carpets in any room | Felt-like underlay, often dark coloured | Chrysotile | MODERATE | Non-friable |
| **Window putty/sealants** | Around window frames, expansion joints | Hardened putty, caulking compounds | Chrysotile | LOW-MODERATE | Non-friable |
| **Loose-fill insulation ("Mr Fluffy")** | Roof cavity (ACT and some NSW homes) | Loose, fluffy material in roof cavity | Amosite (brown) | EXTREMELY HIGH | Friable |

### Room-by-Room Guide

#### Bathroom

The bathroom is the highest-risk room in a renovation demolition due to the concentration of ACMs.

| Item to Check | What to Look For | Likelihood (pre-1980 home) |
|---------------|-----------------|---------------------------|
| Wall linings behind tiles | Asbestos cement sheet (Tilux, Villaboard) used as tile substrate. Hidden until tiles are removed. | VERY HIGH |
| Floor tiles (vinyl) | 9-inch or 12-inch square vinyl tiles. Check adhesive underneath. | HIGH |
| Sheet vinyl flooring | Vinyl sheet with felt backing on floor | HIGH |
| Ceiling | Fibro sheet ceiling, especially in wet areas | HIGH |
| Pipe insulation | Lagging on hot/cold water pipes, especially at joints | MODERATE-HIGH |
| Window putty | Putty around louvre or casement windows | MODERATE |

#### Kitchen

| Item to Check | What to Look For | Likelihood (pre-1980 home) |
|---------------|-----------------|---------------------------|
| Splashback substrate | Asbestos cement behind ceramic tiles | HIGH |
| Floor tiles/sheet vinyl | Vinyl tiles or sheet vinyl flooring | HIGH |
| Under-sink lining | Fibro sheeting lining under bench/sink | MODERATE |
| Ceiling | Textured or flat fibro ceiling | MODERATE-HIGH |

#### Living Areas and Bedrooms

| Item to Check | What to Look For | Likelihood (pre-1980 home) |
|---------------|-----------------|---------------------------|
| Textured/stipple ceiling | Vermiculite or "popcorn" textured coating | MODERATE-HIGH |
| Wall linings | Internal fibro sheet walls (common in fibro homes) | HIGH (in fibro homes) |
| Carpet underlay | Felt underlay under carpet | MODERATE |
| Electrical switchboard | Backing board behind switchboard/fuse box | HIGH |

#### Exterior/Eaves

| Item to Check | What to Look For | Likelihood (pre-1980 home) |
|---------------|-----------------|---------------------------|
| Eave/soffit linings | Flat fibro sheets under roof overhang | VERY HIGH |
| Wall cladding | External fibro weatherboard cladding | HIGH (in fibro homes) |
| Fencing | Flat or corrugated fibro fence panels | HIGH |
| Roof sheeting | Corrugated "Super Six" asbestos cement | HIGH |

#### Laundry

| Item to Check | What to Look For | Likelihood (pre-1980 home) |
|---------------|-----------------|---------------------------|
| Wall linings | Fibro sheet, especially around trough/tub area | HIGH |
| Floor covering | Vinyl tiles or sheet vinyl | HIGH |
| Ceiling | Fibro sheet or textured ceiling | MODERATE-HIGH |

### Textured/Stipple Ceilings -- How to Tell if They Contain Asbestos

This is a common question. The answer is: **you cannot tell visually**.

- "Popcorn," "vermiculite," "stipple," and "cottage cheese" ceilings are all terms for similar textured finishes popular from the 1950s through the 1980s.
- Not all textured ceilings contain asbestos. Many used vermiculite alone, plaster compounds, or polystyrene.
- However, vermiculite was occasionally contaminated with asbestos during mining/processing.
- **The ONLY way to confirm asbestos content is laboratory testing.**
- If installed pre-1990: assume it may contain asbestos and test before disturbing.
- Testing involves scraping a small sample and sending to a NATA-accredited laboratory.

---

## 3. Asbestos Testing Process

### Types of Asbestos Inspections

| Type | Name | What It Involves | When to Use | Typical Cost |
|------|------|-----------------|-------------|-------------|
| **Type 1** | Presumptive Inspection | Visual inspection only. All suspect materials are *presumed* to contain asbestos without sampling. An asbestos register is produced. | Pre-purchase assessments, ongoing management of buildings | $200--$400 |
| **Type 2** | Sampling Inspection | Visual inspection PLUS representative samples collected from suspect materials and sent to NATA-accredited lab for testing. | Pre-renovation assessment. Confirms which materials actually contain asbestos. | $300--$600 (plus $40--$140 per sample) |
| **Type 3** | Demolition Inspection | Comprehensive inspection including wall cavities, concealed spaces, and areas not accessible during normal occupation. Destructive investigation may be required. | **Required before any demolition work.** Most thorough assessment. | $400--$900+ |

### Who Performs Testing?

- **Occupational hygienists** -- qualified professionals who assess workplace health hazards including asbestos.
- **Licensed asbestos assessors** -- hold a specific asbestos assessor licence issued by the relevant state WHS regulator.
- **NATA-accredited laboratories** -- the National Association of Testing Authorities accredits labs to perform asbestos fibre identification. Samples must be tested at a NATA-accredited lab.

### The Testing Process Step-by-Step

1. **Engage a licensed assessor or occupational hygienist** -- they visit the property and conduct a visual survey.
2. **Sample collection** -- the assessor safely takes small samples from each suspect material (typically a piece of sheeting, scraping of ceiling texture, section of vinyl tile, etc.). Proper PPE and wetting techniques are used.
3. **Laboratory analysis** -- samples are sent to a NATA-accredited lab. Analysis methods include Polarised Light Microscopy (PLM) and, if required, more advanced techniques.
4. **Report and register** -- the assessor produces:
   - An asbestos register listing all identified/suspected ACMs with locations and condition ratings
   - Recommendations for management or removal
   - Risk assessments for each identified ACM
5. **Turnaround time** -- standard lab analysis: 3--5 business days. Urgent/express: 24--48 hours (at additional cost).

### Testing Cost Summary

| Item | Cost Range (AUD, ex-GST) |
|------|--------------------------|
| Visual inspection (Type 1 presumptive) | $200--$400 |
| Sampling inspection (Type 2) | $300--$600 |
| Demolition inspection (Type 3) | $400--$900+ |
| Individual sample lab testing | $40--$140 per sample |
| Express/urgent lab testing | $80--$200 per sample |
| Full residential report with 5--10 samples | $500--$1,200 |

### Key Point for Scope AI

> **For any renovation demolition on a pre-1990 home, a minimum Type 2 asbestos inspection should be included in the scope. For full demolition, a Type 3 demolition inspection is MANDATORY.**

---

## 4. Asbestos Removal Process

### Licence Classes

| Licence | Can Remove | Required For |
|---------|-----------|-------------|
| **Class A** | All asbestos (friable and non-friable) | Any friable asbestos removal (pipe lagging, loose-fill insulation, spray-on coatings, severely degraded bonded materials) |
| **Class B** | Non-friable (bonded) asbestos only | Bonded asbestos over 10m2 (fibro sheets, vinyl tiles, cement roofing, etc.) |
| **Unlicensed** | Non-friable asbestos up to 10m2 | Small quantities of bonded asbestos in good condition (strict conditions apply) |

**Important exception:** In the ACT, ALL asbestos must be removed by a licensed removalist regardless of quantity.

### The 10 Square Metre Rule

A homeowner or unlicensed person may remove up to 10m2 of non-friable asbestos-containing material without a licence, subject to conditions:

- The material must be non-friable (bonded, in reasonable condition, not crumbly).
- Total removal time must not exceed one hour in any seven-day period.
- Safe work procedures must still be followed (wetting, PPE, wrapping, licensed disposal).
- This does NOT apply to friable asbestos under any circumstances.
- **Recommendation for Scope AI:** Always recommend licensed removal for any quantity. The health risks are severe and the cost difference for small amounts is minimal.

### Licensed Removal Process -- Step by Step

#### Phase 1: Pre-Removal

1. **Asbestos inspection and identification** -- confirm ACM locations, types, and condition.
2. **Removal control plan** -- the licensed removalist prepares a detailed plan covering scope, methods, containment, PPE, waste handling, and emergency procedures.
3. **Notification to regulator** -- the removalist must notify the relevant state WHS regulator:
   - At least 5 business days before work commences (standard notification)
   - 24 hours for emergency/unexpected removal
   - Notification forms vary by state (e.g., Form 65 in QLD)
4. **Engage licensed asbestos assessor** -- for air monitoring and clearance (must be independent of the removalist).

#### Phase 2: Setup and Containment

5. **Exclusion zone established** -- area cordoned off, warning signs erected compliant with AS 1319.
6. **Containment erected** (for friable removal / Class A work):
   - Full enclosure constructed using 200-micron polyethylene sheeting.
   - Decontamination unit installed at entry/exit point.
   - Negative pressure unit (NPU) with HEPA filtration installed -- maintains negative pressure inside enclosure.
   - Air must exchange at least 8 times per hour.
   - NPU positioned opposite decontamination unit for laminar airflow.
7. **For non-friable (bonded) removal / Class B work:**
   - Mini-enclosure or barricaded area with signage.
   - Full enclosure not always required, but work area must be isolated.
   - Drop sheets of 200-micron poly laid to catch debris.
8. **Pre-removal air monitoring** -- baseline fibre level recorded by licensed assessor.

#### Phase 3: Removal

9. **Wetting** -- all ACMs kept wet throughout removal to suppress fibre release. PVA glue solution often used.
10. **Careful removal** -- materials removed intact where possible (unscrew rather than break, pry rather than smash).
11. **Continuous air monitoring** -- fibre levels monitored throughout by the independent assessor.
12. **Double-wrapping** -- removed ACMs immediately double-bagged in 200-micron poly, sealed with duct tape, and labelled with asbestos warning.
13. **HEPA vacuuming** -- all surfaces in removal area HEPA-vacuumed during and after removal.

#### Phase 4: Clearance and Disposal

14. **Visual inspection** -- removal area inspected for any visible asbestos contamination (dust, debris, fragments).
15. **Clearance air monitoring** (required for Class A / friable work):
    - Air samples taken and analysed.
    - Respirable fibre level must be below **0.01 fibres/mL**.
16. **Clearance certificate issued** -- by the independent licensed asbestos assessor (Class A) or independent competent person (Class B).
    - Certificate confirms the area is safe for reoccupation or further construction work.
17. **Transport and disposal**:
    - Asbestos waste transported in sealed, labelled containers/vehicles to a licensed waste facility.
    - Waste tracking documentation completed (varies by state).
    - Disposal at an EPA-licensed landfill that accepts asbestos waste.

### Clearance Certificate

The clearance certificate is a critical document. It states that:

- The removal area and immediately surrounding areas are free from visible asbestos contamination.
- Air monitoring results (where required) are below the safe threshold.
- The area is safe for normal occupation or further construction work.

**For Scope AI:** A clearance certificate must be obtained BEFORE any subsequent demolition or construction work proceeds in the affected area.

---

## 5. Cost Ranges for Asbestos Removal

### General Pricing

| Removal Type | Cost per m2 (AUD) | Notes |
|-------------|-------------------|-------|
| Non-friable (bonded) removal | $50--$150/m2 | Fibro sheets, vinyl tiles, cement products |
| Friable removal | $150--$300/m2 | Pipe lagging, spray coatings, loose-fill, degraded materials |
| Minimum call-out / setup fee | $1,500--$2,500 | Most removalists have a minimum charge regardless of quantity |

### Common Renovation Scenarios

| Scenario | Typical Scope | Estimated Cost Range (AUD) | Includes |
|----------|--------------|---------------------------|----------|
| **Fibro bathroom walls** | 15--25m2 of fibro sheet behind/around tiles | $2,000--$5,000 | Removal, wrapping, disposal, clearance |
| **Vinyl floor tiles (single room)** | 10--20m2 of vinyl tiles + black mastic | $1,500--$3,000 | Tile removal, mastic scraping/encapsulation, disposal |
| **Vinyl floor tiles (whole house)** | 60--100m2 | $4,000--$9,000 | As above, larger scale |
| **Small quantity bonded removal** (<10m2) | Eave panels, small section of sheeting, meter board | $1,500--$2,500 | Often minimum charge applies |
| **Textured ceiling removal (single room)** | 12--20m2 of vermiculite/stipple ceiling | $2,500--$5,000 | May require Class A if friable |
| **Electrical meter board** | Single board | $800--$1,500 | Includes electrician to disconnect/reconnect |
| **Pipe lagging (sub-floor)** | Variable -- per linear metre | $100--$250/linear metre | Class A removal required (friable) |
| **Full fibro house strip-out** | 100--200m2+ interior linings | $10,000--$25,000+ | Major scope, multiple rooms |
| **Roof replacement (asbestos roof)** | 100--200m2 roof area | $10,000--$40,000 | Removal + new roof installation |

### Additional Costs to Factor In

| Item | Cost Range (AUD) |
|------|-----------------|
| Asbestos inspection (Type 2) | $300--$600 |
| Demolition inspection (Type 3) | $400--$900+ |
| Lab testing per sample | $40--$140 |
| Air monitoring (during removal) | $500--$1,500 per day |
| Clearance certificate | $150--$500 |
| Tip/disposal fees | $300--$1,000+ (volume dependent) |
| Skip bin for asbestos waste | $500--$1,200 (lined, licensed) |

### Key Pricing Notes

1. **Minimum charges apply** -- most licensed removalists have a minimum call-out/job charge of $1,500--$2,500 regardless of how small the job is.
2. **Access difficulty increases cost** -- confined spaces, multi-storey buildings, and hard-to-reach areas (e.g., sub-floor pipe lagging) attract premium pricing.
3. **Friable vs. non-friable** -- friable asbestos removal is significantly more expensive due to the enclosure, negative pressure, and air monitoring requirements.
4. **Regional variation** -- metro areas (Sydney, Melbourne, Brisbane) tend to be more competitive. Regional and remote areas may attract travel surcharges.
5. **Combined scoping** -- if asbestos removal is part of a larger demolition project, some cost efficiencies can be achieved by coordinating with the demolition contractor.

---

## 6. What Happens if Asbestos is Found DURING Demolition?

This is a common scenario, particularly when:
- No pre-demolition asbestos inspection was conducted (a compliance failure).
- Concealed ACMs are discovered in wall cavities, under flooring layers, or behind other materials.
- Materials not initially suspected turn out to contain asbestos.

### Immediate Stop Work Procedure

| Step | Action | Who is Responsible |
|------|--------|-------------------|
| 1 | **STOP all work immediately** in the affected area. | Site supervisor / principal contractor |
| 2 | **Do not disturb** the suspected material further. Do not attempt to clean up. | All workers |
| 3 | **Evacuate workers** from the immediate area. | Site supervisor |
| 4 | **Barricade the area** and erect warning signage. | Site supervisor |
| 5 | **Assess exposure** -- were any workers potentially exposed to airborne fibres? | Site supervisor / WHS officer |
| 6 | **Notify the principal contractor and client** immediately. | Site supervisor |
| 7 | **Engage a licensed asbestos assessor** to inspect the material and collect samples for testing. | Principal contractor / client |
| 8 | **Notify the WHS regulator** (if exposure has occurred or if the material is confirmed as asbestos). | PCBU (person conducting a business or undertaking) |

### Notification Requirements by State

| State/Territory | Regulator | Phone | Notification Deadline |
|----------------|-----------|-------|----------------------|
| **NSW** | SafeWork NSW | 13 10 50 | Phone immediately; lodge online within 24 hours |
| **QLD** | Workplace Health and Safety QLD | 1300 362 128 | Form 65 submitted; immediate if fibre levels exceed 0.02 f/mL |
| **VIC** | WorkSafe Victoria | 1800 136 089 | Within 24 hours of starting emergency removal |
| **WA** | WorkSafe WA | 1300 307 877 | Phone during business hours; submit notification within 24 hours |
| **SA** | SafeWork SA | 1300 365 255 | As soon as practicable |
| **TAS** | WorkSafe Tasmania | 1300 366 322 | As soon as practicable |
| **ACT** | WorkSafe ACT | (02) 6207 3000 | As soon as practicable |
| **NT** | NT WorkSafe | 1800 019 115 | As soon as practicable |

### Remediation Process After Discovery

1. **Testing** -- samples sent to lab for urgent analysis (24--48 hour turnaround).
2. **If confirmed asbestos:**
   - A licensed asbestos removalist (Class A or B as appropriate) must be engaged.
   - Emergency asbestos removal notification lodged with the state regulator.
   - The removalist prepares an asbestos removal control plan.
   - Removal proceeds following standard licensed removal process (see Section 4).
   - Clearance certificate must be obtained before work resumes.
3. **If NOT confirmed as asbestos:**
   - Lab results documented and filed.
   - Work may resume with the assessor's written confirmation.
4. **Exposure assessment:**
   - If workers were potentially exposed, health monitoring must be provided and paid for by the PCBU.
   - Exposure records must be maintained for 40 years.
   - Workers must be informed of the exposure and health monitoring options.

### Legal and Financial Consequences

| Failure | Potential Consequence |
|---------|----------------------|
| No pre-demolition asbestos inspection | Fines up to $50,000+ (individual) / $500,000+ (body corporate). Prosecution possible. |
| Failure to stop work when asbestos discovered | Fines, prosecution, prohibition notices |
| Unlicensed removal of asbestos over 10m2 | Criminal penalties, fines, licence cancellation |
| Failure to notify regulator | Fines, prosecution |
| Improper disposal of asbestos waste | EPA fines, prosecution, clean-up orders |

### Impact on Project Timeline

Unexpected asbestos discovery typically adds:

| Impact | Duration |
|--------|----------|
| Stop work + testing | 2--5 business days |
| Engage removalist + notification period | 5--10 business days |
| Removal work | 1--5 days (depending on scope) |
| Clearance and resumption | 1--2 days |
| **Total typical delay** | **2--4 weeks** |

---

## 7. Key Regulatory Framework

### National Legislation

- **Work Health and Safety Act 2011** (model legislation adopted by most states/territories)
- **Work Health and Safety Regulations 2011** -- Chapter 8: Asbestos
- **Safe Work Australia Codes of Practice:**
  - *How to Manage and Control Asbestos in the Workplace*
  - *How to Safely Remove Asbestos*

### Key Regulatory Requirements for Demolition

1. **Asbestos must be identified and removed BEFORE demolition** -- this is a legal requirement under the WHS Regulations.
2. **An asbestos register must be maintained** for any workplace (including construction sites) where asbestos has been identified.
3. **Demolition notification** -- the demolition contractor must notify the relevant WHS regulator before demolition commences. This notification must include details of any identified asbestos.
4. **Licensed removal** -- asbestos over 10m2 (non-friable) or any quantity of friable asbestos must be removed by a licensed removalist.
5. **Clearance certificates** -- must be obtained after all asbestos removal before demolition proceeds.
6. **Health monitoring** -- must be provided to any worker who carries out asbestos-related work or who is at risk of exposure.
7. **Records** -- asbestos-related records (registers, air monitoring, health monitoring, disposal) must be kept for defined periods (up to 40 years for health monitoring).

### State-Specific Variations

While the WHS framework is largely harmonised across Australia, some state-specific variations exist:

- **ACT:** ALL asbestos removal (any quantity) must be done by a licensed removalist. The ACT also has the unique "Mr Fluffy" loose-fill asbestos insulation program.
- **Victoria:** Has its own OHS Act and Regulations (not the model WHS Act), but asbestos requirements are substantively similar.
- **Western Australia:** Has its own OSH framework with similar asbestos requirements.

---

## 8. Decision Logic for Scope AI

The following decision tree should be embedded in the scope-of-works generator.

### Pre-Demolition Asbestos Decision Tree

```
START: What year was the home built/last renovated?

IF year < 1990:
    -> MANDATORY: Include Type 2 or Type 3 asbestos inspection in scope
    -> MANDATORY: Budget for potential asbestos removal
    -> FLAG: "High probability of asbestos-containing materials"

    IF full_demolition == true:
        -> MANDATORY: Type 3 demolition asbestos inspection
        -> Include asbestos removal line item (estimate based on era + rooms)

    IF renovation_only == true:
        -> MANDATORY: Type 2 sampling inspection of affected areas
        -> Include asbestos removal contingency (15-25% of demo budget)

IF year >= 1990 AND year < 2003:
    -> RECOMMENDED: Visual assessment at minimum
    -> IF suspect_materials_found: Test before proceeding
    -> Include asbestos testing contingency in budget

IF year >= 2003:
    -> NOTE: "Home built after asbestos ban, low risk"
    -> IF renovation_history_unknown: Recommend visual check
    -> No asbestos budget required unless flagged
```

### Per-Room Asbestos Line Items (for pre-1990 homes)

| Room Being Demolished | Default Asbestos Items to Include in Scope |
|----------------------|-------------------------------------------|
| Bathroom | Fibro wall linings, tile substrate, vinyl flooring, pipe lagging |
| Kitchen | Splashback substrate, vinyl flooring, ceiling |
| Laundry | Wall linings, vinyl flooring, ceiling |
| Bedroom | Textured ceiling, carpet underlay, wall linings (if fibro home) |
| Living area | Textured ceiling, carpet underlay, wall linings (if fibro home) |
| Exterior/eaves | Eave linings, wall cladding, fencing |
| Electrical | Meter board/switchboard backing |
| Roof space | Pipe lagging, loose-fill insulation (check for Mr Fluffy in ACT/NSW) |

---

## 9. Sources

### Australian Government Sources

- [Asbestos Safety and Eradication Agency -- Finding Asbestos in the Home](https://www.asbestossafety.gov.au/about-asbestos/finding-asbestos/home)
- [Asbestos Safety and Eradication Agency -- DIY Removal Requirements](https://www.asbestossafety.gov.au/node/41/diy-removal-requirements)
- [Asbestos Safety and Eradication Agency -- Where Could I Find Asbestos?](https://www.asbestossafety.gov.au/node/16/where-could-i-find-asbestos)
- [Safe Work Australia -- Asbestos WHS Duties](https://www.safeworkaustralia.gov.au/safety-topic/hazards/asbestos/whs-duties)
- [Safe Work Australia -- How to Safely Remove Asbestos Code of Practice (2020)](https://www.safeworkaustralia.gov.au/sites/default/files/2020-07/model_code_of_practice_how_to_safely_remove_asbestos.pdf)
- [Safe Work Australia -- How to Manage and Control Asbestos Code of Practice](https://www.safeworkaustralia.gov.au/sites/default/files/2020-07/model_code_of_practice_how_to_manage_and_control_asbestos_in_the_workplace.pdf)

### State Government Sources

- [Asbestos NSW -- When Was Asbestos Banned in Australia](https://www.asbestos.nsw.gov.au/safety/safety-in-the-home/when-was-asbestos-banned-in-australia)
- [Asbestos NSW -- Asbestos in the Home](https://www.asbestos.nsw.gov.au/safety/safety-in-the-home/asbestos-in-the-home)
- [Asbestos NSW -- Eaves and Asbestos](https://www.asbestos.nsw.gov.au/eaves-and-asbestos)
- [Asbestos NSW -- Cement Sheeting and Asbestos](https://www.asbestos.nsw.gov.au/cement-sheeting-and-asbestos)
- [Asbestos NSW -- Corrugated Cement Sheet (Super Six)](https://www.asbestos.nsw.gov.au/corrugated-cement-sheet-and-asbestos-super-six)
- [Asbestos NSW -- Bituminous Electrical Backing Board](https://www.asbestos.nsw.gov.au/bituminous-electrical-backing-board-and-asbestos)
- [Asbestos NSW -- Lagging Thermal Insulation](https://www.asbestos.nsw.gov.au/lagging-thermal-insulation-and-asbestos)
- [Asbestos NSW -- Vermiculite and Asbestos](https://www.asbestos.nsw.gov.au/vermiculite-and-asbestos)
- [Asbestos NSW -- Floors and Floor Coverings](https://www.asbestos.nsw.gov.au/floors-and-floor-coverings)
- [Asbestos NSW -- Bathroom](https://www.asbestos.nsw.gov.au/bathroom)
- [Asbestos NSW -- Electrical and Powerboxes](https://www.asbestos.nsw.gov.au/electrical-and-powerboxes)
- [Asbestos NSW -- Getting an Asbestos Sample Tested](https://www.asbestos.nsw.gov.au/who-to-contact/getting-an-asbestos-sample-tested)
- [Asbestos QLD -- Common Locations of Asbestos](https://www.asbestos.qld.gov.au/know-where-asbestos/common-locations-asbestos-domestic-and-commercial-buildings)
- [Asbestos QLD -- Clearance Inspections](https://www.asbestos.qld.gov.au/removing-or-disturbing-asbestos/clearance-inspections)
- [Asbestos QLD -- Homeowner's Certificate to Remove Asbestos](https://www.asbestos.qld.gov.au/removing-or-disturbing-asbestos/homeowners-certificate-remove-asbestos)
- [Asbestos QLD -- Electrical Switchboards and Meters](https://www.asbestos.qld.gov.au/know-where-asbestos/electrical-switchboards-and-meters)
- [Asbestos QLD -- Asbestos and Demolition](https://www.worksafe.qld.gov.au/licensing-and-registrations/asbestos-removal-and-licensing/asbestos-and-demolition)
- [Asbestos VIC -- Finding and Identifying](https://www.asbestos.vic.gov.au/in-the-home/find-manage-remove-dispose/finding-and-identifying)
- [Asbestos VIC -- Unlicensed Removal](https://www.asbestos.vic.gov.au/builders-and-trades/asbestos-removalists/unlicensed-asbestos-removal)
- [Asbestos VIC -- Asbestos Removal Notification](https://www.worksafe.vic.gov.au/asbestos-removal-notification)
- [Asbestos SA -- Find and Identify Asbestos in the Home](https://www.asbestos.sa.gov.au/in-your-home/find-and-identify-asbestos-in-the-home)
- [Asbestos SA -- Removing Asbestos](https://www.asbestos.sa.gov.au/in-your-workplace/asbestos-removal)
- [WorkSafe WA -- Air Monitoring and Clearance](https://www.worksafe.wa.gov.au/air-monitoring-and-clearance)
- [WorkSafe WA -- Asbestos Removal Notifications](https://www.worksafe.wa.gov.au/asbestos-removal-notifications)
- [SafeWork NSW -- Asbestos Notifications](https://www.safework.nsw.gov.au/notify-safework/asbestos-notifications)
- [WorkSafe ACT -- Asbestos](https://www.worksafe.act.gov.au/health-and-safety-portal/safety-topics/dangerous-goods-and-hazardous-substances/asbestos)

### Asbestos Product Database

- [Asbestos Product Guide -- Pipe Insulation (Lagging)](https://products.asbestossafety.gov.au/insulation/pipe-insulation-lagging/)
- [Asbestos Product Guide -- Electrical Fuse/Meter Board Backing](https://products.asbestossafety.gov.au/electrical/electrical-fuse-meter-board-backing/)
- [Asbestos Product Guide -- Asbestos Cement Flat Sheeting Interior](https://products.asbestossafety.gov.au/buildings/walls/asbestos-cement-flat-sheeting-interior/)
- [Asbestos Product Guide -- Asbestos Cement Soffit Panelling (Eaves)](https://products.asbestossafety.gov.au/buildings/roofing/asbestos-cement-soffit-panelling-eaves/)
- [Asbestos Product Guide -- Sprayed Coatings of Asbestos Contaminated Vermiculite](https://products.asbestossafety.gov.au/insulation/sprayed-coatings-of-asbestos-contaminated-vermiculite/)
- [Asbestos Awareness -- Tilux Wet-Area Fibrous Asbestos Cement Sheet](https://asbestosawareness.com.au/asbestos-products-database/?product_id=62&exportpdf=1)

### Industry Sources

- [Asbestos Victoria -- Asbestos Used in Homes Built After 1990](https://asbestosvictoria.com.au/was-asbestos-used-in-australian-homes-built-after-1990/)
- [Asbestos Awareness Australia -- Asbestos in the Home](https://asbestosawareness.com.au/asbestos-in-the-home/)
- [GBAR Group -- History of Asbestos in Australia](https://gbargroup.com.au/history-of-asbestos-australia/)
- [Envirohealth Consulting -- Asbestos Inspection Price](https://envirohealth.com.au/asbestos-inspction-price/)
- [Envirohealth Consulting -- Asbestos Remediation Cost 2025](https://envirohealth.com.au/asbestos-remediation-cost/)
- [South City Asbestos -- Asbestos Removal Cost Australia 2025](https://southcityasbestos.com.au/how-much-is-asbestos-removal-in-australia/)
- [Asbestaway -- Asbestos Removal Cost Australia 2025](https://asbestaway.com.au/how-much-does-asbestos-removal-cost-in-australia/)
- [Service.com.au -- Asbestos Removal Cost Guide 2025](https://www.service.com.au/articles/general/how-much-does-asbestos-removal-cost)
- [Oracle Asbestos -- Asbestos Floor Tile Removal Cost Guide 2026](https://www.oracleasbestos.com/blog/asbestos-floor-tile-removal-cost/)
- [Rapid Asbestos -- Asbestos Floor Removal Cost](https://rapidasbestos.com.au/pricing/asbestos-floor/)
- [Fortified -- Asbestos Removal Costs Australia](https://fortified.com.au/what-should-homeowners-expect/)
- [Coastal Asbestos -- The 10 Square Meter Rule](https://www.coastalasbestosremoval.com.au/the-10-square-meter-rule-and-asbestos-removal/)
- [Coastal Asbestos -- Asbestos Testing Cost](http://www.coastalasbestosremoval.com.au/how-much-does-asbestos-testing-cost/)
- [Dingo Services -- Are My Vinyl Floor Tiles Asbestos?](https://dingoservices.com.au/are-my-vinyl-floor-tiles-asbestos/)
- [Ceiling Resurfacing Australia -- Asbestos Popcorn Ceilings](https://ceilingresurfacing.com.au/asbestos/)
- [Ausgrid -- Asbestos in Electrical Meter Boards Factsheet](https://www.ausgrid.com.au/-/media/Documents/Safety/Asbestos-in-Electrical-Meter-Boards-Factsheet-2018.pdf)
- [Detector Inspector -- Hidden Danger: Asbestos in Switchboards](https://www.detectorinspector.com.au/the-hidden-danger-asbestos-in-switchboards/)
- [Sydney Asbestos -- Cost of Asbestos Inspections](https://sydneyasbestos.com/blog/cost-of-asbestos-inspections/)
- [Bernie Banton Foundation -- Asbestos in the Home](https://www.berniebanton.com.au/asbestos-awareness/asbestos-in-the-built-environment/asbestos-in-the-home/)
- [ADDRI -- About Asbestos](https://addri.org.au/about-the-diseases/about-asbestos/)

---

> **Document Status:** COMPLETE -- Ready for integration into Scope AI engine.
>
> **Confidence Assessment:**
> - Era-based risk levels: HIGH confidence (well-documented by government sources)
> - Material identification by room: HIGH confidence (government product databases + industry guides)
> - Testing process and costs: MODERATE-HIGH confidence (costs are indicative and vary by region/provider)
> - Removal process: HIGH confidence (based on Safe Work Australia Codes of Practice)
> - Removal costs: MODERATE confidence (costs are ballpark estimates, subject to significant variation by location, access, and market conditions)
> - Stop work procedures: HIGH confidence (based on WHS Regulations and state regulator guidance)
