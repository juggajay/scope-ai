# Australian Residential Electrical Standards & Compliance Research

> **Research Date:** February 2026
> **Purpose:** Reference data for AI scope-of-works generator for homeowners
> **Confidence Note:** Information sourced from government websites, industry bodies, and reputable trade publications. Where a specific standard clause is cited, confidence is HIGH. Where industry practice is described without a direct standard reference, confidence is MEDIUM.

---

## TABLE OF CONTENTS

1. [AS/NZS 3000 (Wiring Rules)](#1-asnzs-3000-wiring-rules)
2. [AS/NZS 3008 (Cable Selection & Sizing)](#2-asnzs-3008-cable-selection--sizing)
3. [AS/NZS 60669 (Switches & Accessories)](#3-asnzs-60669-switches--accessories)
4. [State-by-State Licensing Requirements](#4-state-by-state-licensing-requirements)
5. [Certificate of Compliance (by State)](#5-certificate-of-compliance-by-state)
6. [Electrical Safety Inspection Requirements](#6-electrical-safety-inspection-requirements)
7. [Switchboard Requirements](#7-switchboard-requirements)
8. [Smoke Alarm Regulations](#8-smoke-alarm-regulations)
9. [Energy Efficiency Requirements](#9-energy-efficiency-requirements)
10. [Solar & EV Considerations](#10-solar--ev-considerations)
11. [Switchboard & Circuit Planning](#11-switchboard--circuit-planning)
12. [Typical Switchboard Costs](#12-typical-switchboard-costs)

---

## 1. AS/NZS 3000 (Wiring Rules)

**Current version:** AS/NZS 3000:2018 (with Amendment 2:2021 and Ruling 1:2024)
**Confidence:** HIGH (direct standard references)

### 1.1 RCD (Safety Switch) Requirements

| Requirement | Detail |
|---|---|
| **New installations** | ALL final sub-circuits must be protected by 30mA RCDs (since Jan 2019) |
| **Renovations/alterations** | All new final sub-circuits must be RCD protected. Socket outlets added to existing circuits must also have RCD protection |
| **Exception** | Additional new work to existing lighting circuits (no RCD retrofit required on the existing lighting circuit itself, only on the new work) |
| **Minimum RCDs** | Minimum of 2 RCDs for any residential installation with more than one final sub-circuit |
| **Maximum circuits per RCD** | Maximum 3 final sub-circuits per RCD |
| **RCD rating** | 30mA for circuits up to 32A (increased from 20A in 2018 edition) |

**Scope impact:** Any renovation adding circuits or socket outlets triggers mandatory RCD installation. Budget for minimum 2x RCDs in every scope.

### 1.2 Circuit Points & Separation

| Rule | Detail |
|---|---|
| **GPO circuits** | No fixed maximum number of socket outlets per circuit in AS/NZS 3000, BUT must not exceed the circuit protection device rating. Practical limit: ~12 double GPOs on a 20A circuit (industry practice) |
| **Lighting circuits** | No fixed maximum number of points. Limited by load calculation and protection device rating. Industry practice: ~20 light points per 10A or 16A lighting circuit |
| **Mixed circuits** | Allowed under Appendix C, Table C1. Must be RCD protected. A circuit can contain both lighting and power points |
| **Dedicated circuits required for** | Cooktop/oven (each), hot water system, air conditioning units, pool/spa equipment, EV charger. Each must have individual overcurrent protection |

### 1.3 Minimum GPO Quantities Per Room

AS/NZS 3000 does **NOT** mandate a minimum number of GPOs per room. However, industry guidelines and builder practice recommend:

| Room | Recommended Minimum GPOs | Notes |
|---|---|---|
| Kitchen | 6 double GPOs | Above bench. Must be min 150mm above benchtop (~1050mm AFL). 150mm exclusion zone horizontally from cooktop edge (Clause 4.7.3) |
| Bedroom | 4 double GPOs | At least 2 locations for bedside, 1 for desk, 1 spare |
| Living room | 4-6 double GPOs | Distributed around walls |
| Bathroom | 1-2 GPOs | Min 150mm horizontal from basin edge, min 400mm above basin top. Must be outside Zone 1 and Zone 2 |
| Laundry | 2 double GPOs | Dedicated circuit for washing machine recommended |
| Garage | 2 double GPOs | Consider 15A and 10A combination |
| Outdoor | 1-2 GPOs | Must be weatherproof (IP54 minimum), RCD protected |
| Hallway | 1 double GPO per hallway | For vacuum cleaning |

**Confidence:** MEDIUM (industry practice, not mandated by standard)

### 1.4 GPO Height & Placement Rules

| Location | Height/Rule |
|---|---|
| General rooms | 300mm above finished floor level (AFL) typical |
| Kitchen bench | 150mm above benchtop (~1050mm AFL) |
| Bathroom | Outside Zone 1 and Zone 2. Min 150mm horizontal from basin <45L, min 400mm above basin top |
| Outdoor | Weatherproof enclosure, RCD protected |
| Cooktop exclusion zone | No GPOs or switches within 150mm horizontally of cooktop edge |

### 1.5 Voltage Drop Limits

| Segment | Maximum Voltage Drop |
|---|---|
| Consumer mains (supply to main switchboard) | 2% |
| Final sub-circuits (supply to any point in installation) | 5% total |

### 1.6 Cable Mechanical Protection

AS/NZS 3000:2018 removed the previous dispensation from mechanical protection for cables within walls/ceilings. The 150mm exclusion zone from ceiling/wall edges has been deleted. Cables not installed with RCD protection now require a suitable barrier or enclosure.

**Scope impact:** Renovation work involving concealed cables in walls/ceilings will need either RCD protection or mechanical protection (e.g., cable covers, conduit).

---

## 2. AS/NZS 3008 (Cable Selection & Sizing)

**Current version:** AS/NZS 3008.1.1 (Australian conditions)
**Confidence:** HIGH

### 2.1 Common Residential Cable Sizes

| Circuit Type | Typical Cable Size | Protection Device | Notes |
|---|---|---|---|
| Lighting | 1.5mm² TPS | 10A or 16A MCB | Most common for residential lighting |
| General power (GPO) | 2.5mm² TPS | 16A or 20A MCB | Standard for power circuits |
| High-load GPO / Laundry / Garage | 4mm² TPS | 25A or 32A MCB | For longer runs or higher loads |
| Cooktop | 6mm² TPS | 32A MCB | Dedicated circuit |
| Oven | 2.5mm² or 4mm² TPS | 20A MCB | Depends on oven rating |
| Hot water system | 2.5mm² or 4mm² TPS | 20A MCB | Dedicated circuit, off-peak may differ |
| Air conditioning (split) | 2.5mm² or 4mm² TPS | 16A-25A MCB | Depends on unit capacity |
| EV charger (7kW) | 6mm² TPS | 32A MCB | Dedicated circuit, minimum |

### 2.2 Key Sizing Criteria

Cable size must satisfy THREE criteria simultaneously:
1. **Current carrying capacity** - Must handle the load plus derating factors
2. **Voltage drop** - Must stay within 5% total limit
3. **Fault current withstand** - Must handle prospective fault current

### 2.3 Derating Factors

Cables must be derated for:
- **Ambient temperature** (Australian base: 40°C air, 25°C ground)
- **Cable grouping** (multiple cables in same conduit/bundle)
- **Thermal insulation** (cables touching or covered by insulation)
- **Burial depth** (underground cables)

### 2.4 Minimum Earth Sizes

Specified in AS/NZS 3000:2018, Section 5.3.3, Table 5.1. Minimum earth conductor must be proportional to the active conductor size.

### 2.5 Parallel Cables

Minimum 4mm² for cables run in parallel (AS/NZS 3000:2018).

---

## 3. AS/NZS 60669 (Switches & Accessories)

**Current version:** AS/NZS 60669.1 and AS/NZS 60669.2 series
**Confidence:** MEDIUM (limited public detail available)

This standard covers general requirements for switches and accessories for fixed electrical installations. Key points for residential renovation scopes:

- All switches and socket outlets must comply with the relevant part of AS/NZS 60669
- Switch ratings must match circuit ratings (e.g., 10A switch on 10A lighting circuit)
- Outdoor switches must have appropriate IP ratings
- Dimmer switches must be compatible with LED loads if used with LED lighting
- Standard switch mounting height: ~1000-1200mm AFL (not mandated but conventional)

**Scope impact:** When specifying switches in a scope, ensure compliance with this standard. Particularly relevant for smart switches and dimmers which must still meet the standard.

---

## 4. State-by-State Licensing Requirements

**Confidence:** HIGH (sourced from government licensing bodies)

| State/Territory | Licence Required for Residential Work | Issuing Body | Key Notes |
|---|---|---|---|
| **NSW** | Electrical Contractor Licence + Qualified Supervisor Certificate | NSW Fair Trading | Must hold Cert III in Electrotechnology + 12 months experience. Contractor licence required for business. |
| **VIC** | Electrician's Licence (A Grade) + Electrical Contractor Registration (REC) | Energy Safe Victoria | Must pass Licensed Electrical Assessment (LEA) and Safe Working Practice Exam. REC needed to contract. |
| **QLD** | Electrical Mechanic Licence + Electrical Contractor Licence | Electrical Safety Office (QLD) | Cert III + 12 months supervised experience. Contractor licence for business. |
| **SA** | Electrical Worker Licence + Electrical Contractor Licence | Consumer and Business Services (CBS) | Governed by Plumbers, Gas Fitters and Electricians Act 1995. |
| **WA** | Electrical Installing Licence (EI) + Electrical Contractor Licence (EC) | Building and Energy (DMIRS) | EI for individual, EC for business. |
| **TAS** | Electrical Practitioner Licence + Electrical Contractor Licence | Consumer, Building and Occupational Services (CBOS) | |
| **NT** | Electrical Worker Licence + Electrical Contractor Licence | NT WorkSafe | |
| **ACT** | Electrician Licence + Electrical Contractor Licence | Access Canberra | |

**Interstate recognition:** All states except QLD participate in Automatic Mutual Recognition (AMR) allowing licensed electricians from other participating states to work without obtaining a local licence.

**Restricted licences** exist in all states for specific work types (e.g., air conditioning installation, data cabling, appliance repair) but these do NOT cover general residential electrical work.

---

## 5. Certificate of Compliance (by State)

**Confidence:** HIGH (sourced from state government websites)

| State | Certificate Name | Abbreviation | Timeframe to Issue | Copies To | Mandatory? |
|---|---|---|---|---|---|
| **NSW** | Certificate of Compliance for Electrical Work | CCEW | Within 7 days | Customer + distributor + BCNSW (from Dec 2025: eCert portal only from Mar 2026) | YES |
| **VIC** | Certificate of Electrical Safety | COES | Within 28 days | Two types: **Prescribed** (high-risk, requires independent inspector) and **Non-prescribed** (low-risk, self-certified by REC) | YES |
| **QLD** | Electrical Safety Certificate | ESC | Within 28 days | Customer + Electrical Safety Office | YES |
| **SA** | Certificate of Compliance (eCoC) | eCoC | Within 30 days | Customer. Electrician retains copy for 5+ years | YES |
| **WA** | Electrical Safety Certificate | ESC | Within 28 days | Customer + Notice of Completion to network operator within 3 days | YES |
| **TAS** | Certificate of Electrical Compliance | CEC | Reasonable timeframe | Customer | YES |
| **NT** | Certificate of Compliance | CoC | Reasonable timeframe | Customer | YES |
| **ACT** | Certificate of Electrical Safety | CES | Reasonable timeframe | Customer. Low-risk work may not require CES unless customer requests it | YES (with exceptions) |

### What the Certificate Covers
- Confirms work complies with AS/NZS 3000 and relevant state legislation
- Confirms work has been tested (insulation resistance, polarity, earth continuity, RCD trip testing)
- Required for ALL electrical installation work including new circuits, alterations, switchboard upgrades
- NOT required for: changing light globes, plugging in appliances (genuinely minor maintenance)

### NSW-Specific Change (Important)
From **1 December 2025**: CCEWs can be submitted via the BCNSW eCert portal.
From **1 March 2026**: CCEWs can ONLY be submitted via the eCert portal (no more PDF/paper/NECA books).

**Penalties:** Up to $1,000 on-the-spot fine per instance of not providing a CCEW in NSW.

---

## 6. Electrical Safety Inspection Requirements

**Confidence:** HIGH (sourced from state regulatory bodies)

### When is a Separate Inspection Required (vs. Just a Certificate)?

| State | Separate Independent Inspection Required? | Details |
|---|---|---|
| **VIC** | YES - for Prescribed work | Prescribed work MUST be inspected by a Licensed Electrical Inspector (LEI) BEFORE power can be connected. Inspection within 8 business days. Non-prescribed work: self-certified by the electrician/REC. |
| **NSW** | Only if defect notice issued | No routine independent inspection. Network distributors (e.g., Ausgrid) inspect connections and can issue defect notices. Defects must be repaired within 21 days or supply may be disconnected. |
| **QLD** | Risk-based system | Electrical Safety Office conducts audits/inspections. Not every job is inspected but random audits occur. |
| **SA** | Audited system | Office of the Technical Regulator (OTR) audits a percentage of compliance certificates. |
| **WA** | Audited system | Building and Energy conducts audits. Network operator receives Notice of Completion and may inspect. |
| **TAS** | Audited system | Similar to SA/WA model. |
| **NT** | Audited system | NT WorkSafe may inspect. |
| **ACT** | Audited system | Access Canberra may audit. |

### Victoria Prescribed Work List (Requires Independent Inspector)

The following work types are "prescribed" in Victoria and MUST be inspected by a licensed electrical inspector before energisation:

1. Consumer mains, main earthing systems, consumer terminals
2. Main switchboards (including replacements/upgrades)
3. Tenancy mains and distribution boards in multi-occupancy buildings
4. Electrical equipment in hazardous areas
5. High voltage installations
6. Generation systems (solar PV, wind, battery storage, standby generators)
7. Electric security fences
8. Remote area power supplies (>500VA)
9. Medical patient areas
10. Safety services (fire protection, smoke control, emergency lifts)

**All other electrical work** (e.g., adding GPOs, running new lighting circuits, installing appliances) is **non-prescribed** and does not require independent inspection -- the electrician/REC self-certifies.

**Scope impact:** In VIC, any renovation involving switchboard work or solar/battery installation will require an independent inspection, adding time and cost to the scope.

---

## 7. Switchboard Requirements

**Confidence:** HIGH

### 7.1 RCD (Safety Switch) Requirements by State

| State | New Builds | Renovations/Alterations | Sale of Property | Rental Properties |
|---|---|---|---|---|
| **NSW** | All circuits RCD protected (since 2000 for lighting, 1991 for power) | New circuits/GPOs must be RCD protected | No specific sale trigger (but new work triggers compliance) | No specific RCD mandate for existing rentals (legislation pending) |
| **VIC** | All circuits RCD protected | New circuits must be RCD protected | No specific sale trigger | Safety switches on all power and lighting circuits. Inspection every 2 years (Residential Tenancies Regulations 2021) |
| **QLD** | All power and lighting circuits RCD protected (since 2000) | New/altered circuits must be RCD protected. RCDs must be retrofitted if any electrical work is done on older building | Must have safety switch. Install within 3 months of sale if missing | All GPO circuits must have safety switch. Must be installed within 90 days of tenancy start |
| **SA** | All circuits RCD protected | New circuits must comply | No specific sale trigger | Similar to new build requirements for new tenancies |
| **WA** | All circuits RCD protected | New circuits must comply | Must have minimum 2 RCDs (power + lighting) before sale | Must have minimum 2 RCDs before lease |
| **TAS** | All circuits RCD protected | New circuits must comply | No specific sale trigger | Must comply with current standards |
| **NT** | All circuits RCD protected | New circuits must comply | No specific sale trigger | Must comply with current standards |
| **ACT** | All circuits RCD protected | New circuits must comply | No specific sale trigger | Must comply with current standards |

### 7.2 AFDD (Arc Fault Detection Devices)

| Aspect | Status |
|---|---|
| **Mandatory in Australia?** | NO - not yet mandatory |
| **AS/NZS 3000 position** | Recommended (not required) for final sub-circuits in premises with sleeping accommodation, fire-risk locations, heritage buildings, and buildings with valuable assets |
| **AS/NZS standard** | Must comply with AS/NZS 62606:2022 if installed |
| **Mandatory in New Zealand?** | YES - for final sub-circuits up to 20A in fire-risk locations, irreplaceable items locations, heritage buildings, school dormitories |
| **Industry recommendation** | Electricians should offer AFDDs to customers and explain enhanced protection. Particularly suited for older installations, heritage properties, and high-value properties |
| **Cost impact** | AFDDs add significant cost ($100-200+ per device per circuit). Not yet common in standard residential scopes |

**Scope impact:** AFDDs should be offered as an option/upgrade in scopes, not included as mandatory. Flag for heritage properties, timber-framed homes, or high-value properties.

### 7.3 When Switchboard Upgrade is Mandatory

Triggers requiring switchboard upgrade:

1. **Outdated fuse systems** - Ceramic/porcelain fuses must be replaced with circuit breakers
2. **Insufficient capacity** - Cannot handle modern electrical loads (frequent tripping)
3. **No RCD/safety switches** - Adding circuits requires RCD protection; if board has no space, upgrade needed
4. **Electrical defect notice** - Issued by network distributor or inspector
5. **Adding solar PV or battery** - Requires DC isolators, possibly additional RCDs, spare breaker ways
6. **Adding EV charger** - Requires dedicated circuit, possibly main switch upgrade
7. **Major renovation** - In VIC, homes undergoing renovations with significant electrical work must upgrade to current standards
8. **Age** - Industry recommends upgrade after ~20 years
9. **No spare breaker ways** - Cannot add new circuits without physical space
10. **Undersized main switch** - Old 40A or 60A mains may be insufficient for modern loads

### 7.4 Main Switch Requirements

| Requirement | Detail |
|---|---|
| **Standard** | AS/NZS 3000:2018 Clause 2.3.3 |
| **Purpose** | Complete isolation of installation |
| **Type** | Single-pole (disconnects active only) or double-pole (disconnects active + neutral). Double-pole most common for residential |
| **Typical ratings** | 63A or 80A single-phase residential |
| **Location** | Main switchboard, readily accessible, clearly identified |
| **Locking** | Must be capable of being locked OFF where required |
| **Operation** | Must be manually operated, not controlled by electronic devices |
| **VIC-specific** | Some areas require 63A MCB as main switch with 16mm supply cable (smart metering requirement) |

---

## 8. Smoke Alarm Regulations

**Confidence:** HIGH (sourced from state fire departments and legislation)

### 8.1 State-by-State Smoke Alarm Requirements

| State | Type Required | Hardwired? | Interconnected? | Placement | Sale/Rental Triggers |
|---|---|---|---|---|---|
| **NSW** | AS 3786:2014 compliant. Photoelectric recommended | Hardwired for homes built/renovated after May 2006 | Required for homes built/renovated after 1 May 2014 where >1 alarm needed | Every storey; between bedrooms and rest of dwelling | Must have at least 1 working alarm on each level |
| **VIC** | AS 3786:2014 compliant | Mains-powered mandatory for builds after Aug 1997 | Required for builds/major renos after 1 May 2014 | Every storey; between bedrooms and rest of dwelling | Rentals: landlord must ensure working alarms on every level |
| **QLD** | **Photoelectric ONLY** (since 2017). AS 3786:2014 | Hardwired (240V) with battery backup, OR 10-year non-removable battery | **Mandatory for ALL properties by 1 Jan 2027** | Every storey, every bedroom, hallways connecting bedrooms | Rentals: full compliance since 1 Jan 2022. Sales: compliance at contract signing. ALL homes by 2027 |
| **SA** | AS 3786:2014 compliant | Hardwired mandatory for new homes since 1995 | Required for new dwellings since 1 May 2014 | Every storey; associated with bedrooms | Property transfers post-1998: 240V or 10-year battery within 6 months |
| **WA** | AS 3786:2014 compliant | Hardwired mandatory for new builds/extensions since 1997 | Required for new construction since 1 May 2015 | Every storey; between bedrooms and rest of dwelling | Required for rentals and sales since 1997 |
| **TAS** | AS 3786:2014 compliant | Mains-powered since 1997 | Not specifically mandated for existing homes | Every level | Rentals since 2016: alarms on every level (mains or 10-year battery) |
| **NT** | **Photoelectric ONLY** (since 2011) | Hardwired since 7 Jan 1998 | Not specifically mandated for existing homes | Every storey | Older properties: 10-year non-removable battery acceptable |
| **ACT** | AS 3786:2014 compliant | Per NCC requirements | Per NCC requirements (post-2014 interconnection) | Every level (since 2006). Includes caravans/movable dwellings | Must comply with NCC |

### 8.2 QLD Smoke Alarm Timeline (Most Stringent State)

| Date | Requirement |
|---|---|
| 1 Jan 2017 | New builds: photoelectric, interconnected, in every bedroom + hallways |
| 1 Jan 2022 | **Rental properties**: must retrofit to full compliance (every bedroom, interconnected, photoelectric) |
| Contract signing date | **Properties being sold**: must comply at contract signing |
| **1 Jan 2027** | **ALL Queensland homes** must have compliant smoke alarms (owner-occupied included) |

**Scope impact:** For QLD renovations, ALWAYS include smoke alarm compliance in scope. For other states, flag if home pre-dates relevant hardwired/interconnection thresholds. Hardwired smoke alarms require a licensed electrician and should be included in electrical scope.

---

## 9. Energy Efficiency Requirements

**Confidence:** MEDIUM-HIGH (NCC 2022 references)

### 9.1 NCC 2022 / BCA Requirements Affecting Electrical Design

| Requirement | Detail |
|---|---|
| **Lighting power density** | Maximum 4 W/m² for all internal spaces with fixed artificial lighting (NCC 2022, Volume Two, Part H6 for Class 1 buildings) |
| **Previous option removed** | QLD removed the "80% LED" shortcut. Now must demonstrate lighting power density compliance with a calculation |
| **Practical effect** | Effectively mandates LED lighting throughout. Halogen and incandescent cannot meet 4 W/m² in most rooms |
| **Commencement** | Energy efficiency requirements commenced 1 May 2024 in QLD and other jurisdictions |

### 9.2 When NCC Applies to Renovations

| Trigger | NCC Compliance Required? |
|---|---|
| Minor renovation (cosmetic, no structural change) | Generally NO |
| Adding rooms / extensions | YES - new work must comply with NCC |
| **Substantial alteration** (>50% of building volume OR extension >25% of floor area within 3 years) | YES - entire building may need to comply |
| Change of building classification | YES |

**Scope impact:** For renovations exceeding the 50% volume threshold, the entire electrical design may need to meet current NCC standards including lighting power density. For smaller renovations, only the new work needs to comply. Always check with the building surveyor.

### 9.3 NCC 2022 EV/Solar Readiness

NCC 2022 Section J9D5 requires:
- Main electrical switchboard to have at least **2 empty three-phase circuit breaker slots**
- **4 DIN rail spaces** reserved for solar PV and battery systems

**Scope impact:** New switchboards should be specified with spare capacity for future solar/EV even if not being installed now.

---

## 10. Solar & EV Considerations

**Confidence:** HIGH

### 10.1 Solar PV Impact on Switchboard

| Consideration | Detail |
|---|---|
| **Dedicated circuit** | Solar inverter requires dedicated circuit with individual MCB |
| **DC isolator** | Must be installed near inverter and at switchboard |
| **RCD protection** | Required on solar circuit per AS/NZS 3000 |
| **Surge protection** | Type 2 SPD recommended at switchboard |
| **Export capacity** | Up to 6kW (~25A) back-feed. Older 60-80A mains may not handle this plus household loads |
| **Spare ways** | Minimum 2 spare three-phase breaker ways required (NCC 2022) |
| **Switchboard upgrade trigger** | If no spare ways, no DC isolator space, or undersized mains, upgrade required |
| **VIC prescribed work** | Solar PV installation is prescribed work -- requires independent inspection |
| **Standard** | Must comply with AS/NZS 5033 (PV installations) and AS/NZS 4777 (grid connection) |

### 10.2 EV Charger Impact on Switchboard

| Consideration | Detail |
|---|---|
| **Dedicated circuit** | MANDATORY by Australian law. No other appliances on same circuit |
| **Typical load** | 7.2kW single-phase (32A) or 22kW three-phase |
| **Cable sizing** | Minimum 6mm² TPS for 32A single-phase charger. Longer runs may need 10mm² |
| **RCD protection** | Mandatory. Type A RCD for standard; Type B for DC leakage detection |
| **MCB** | Individual overcurrent protection per charger |
| **Surge protection** | Type 2 SPD recommended |
| **Main switch capacity** | 7.2kW charger alone approaches limit of older 60-80A mains when combined with household loads |
| **Three-phase consideration** | 22kW charger requires three-phase supply. May trigger supply upgrade |
| **Standard** | AS/NZS 3000:2018 + Electric Vehicle Council EVSE Installation Guideline (Feb 2024) |

### 10.3 When Renovation Triggers Supply Upgrade

| Scenario | Likely Upgrade Needed |
|---|---|
| Adding EV charger (7kW) to home with 60A supply | YES - main switch / supply upgrade |
| Adding solar (6kW) to home with 80A supply | MAYBE - depends on total load |
| Adding solar + EV + air conditioning | VERY LIKELY - consider three-phase |
| Typical renovation adding 1-2 circuits | Usually NO |
| Major renovation (full rewire, new kitchen, bathrooms) | ASSESS - depends on total load and existing supply |

---

## 11. Switchboard & Circuit Planning

### 11.1 Typical Switchboard Configuration for Renovated Australian Home

**Standard single-phase residential switchboard (post-renovation):**

```
MAIN SWITCH (63A or 80A double-pole)
│
├── RCD 1 (30mA, 40A or 63A) — Power circuits
│   ├── MCB 20A — Kitchen GPOs (dedicated)
│   ├── MCB 20A — General GPOs — Living/Dining
│   ├── MCB 20A — General GPOs — Bedrooms/Study
│   └── MCB 20A — Laundry + Outdoor GPOs
│
├── RCD 2 (30mA, 40A or 63A) — Lighting + other
│   ├── MCB 10A — Lighting — Ground floor
│   ├── MCB 10A — Lighting — First floor
│   ├── MCB 20A — Bathroom GPOs + exhaust fans
│   └── MCB 16A — Garage GPOs
│
├── RCD 3 (30mA) — Dedicated circuits
│   ├── MCB 32A — Cooktop (dedicated)
│   ├── MCB 20A — Oven (dedicated)
│   └── MCB 20A — Dishwasher (dedicated)
│
├── RCD 4 (30mA) — HVAC + Hot Water
│   ├── MCB 20A — Hot water system (dedicated)
│   ├── MCB 25A — Air conditioning unit 1 (dedicated)
│   └── MCB 20A — Air conditioning unit 2 (dedicated)
│
├── [FUTURE] RCD 5 — Solar / EV
│   ├── MCB 25A — Solar inverter (dedicated)
│   ├── MCB 32A — EV charger (dedicated)
│   └── SPARE
│
├── Smoke alarm circuit (may be on lighting RCD)
├── Surge Protection Device (Type 2 SPD)
└── SPARE WAYS (minimum 4 DIN spaces for future)
```

### 11.2 Circuit Layout Best Practices

| Practice | Rationale |
|---|---|
| **Kitchen GPOs on dedicated circuit** | High load from kettles, toasters, microwaves. Prevents nuisance tripping |
| **Bathroom GPOs separate from bedroom GPOs** | Moisture risk. Hair dryers + heaters = high load |
| **Each air conditioner on dedicated circuit** | High startup current. Prevents nuisance tripping of other circuits |
| **Cooktop and oven on separate dedicated circuits** | High load, different ratings. Cooktop typically 32A, oven typically 20A |
| **Hot water on dedicated circuit** | High load, especially during heating cycle. Off-peak tariff may require separate metering |
| **Lighting split by floor/zone** | If one lighting circuit trips, other zones still have light |
| **Outdoor GPOs on separate RCD** | Higher exposure to moisture and fault risk. Prevents indoor circuits tripping |
| **Maximum 3 circuits per RCD** | AS/NZS 3000 requirement. Prevents too many circuits losing power on single RCD trip |
| **Smoke alarms on dedicated or lighting circuit** | Must maintain power. Some electricians prefer separate circuit |
| **Spare ways** | Always spec 4+ spare ways for future additions |

### 11.3 Dedicated Circuits Required

The following MUST have individual dedicated circuits with their own MCB:

| Appliance | Typical MCB | Typical Cable |
|---|---|---|
| Cooktop/hotplate | 32A | 6mm² |
| Wall oven | 20A | 2.5mm² or 4mm² |
| Hot water system | 20A | 2.5mm² |
| Air conditioner (each unit) | 16-25A | 2.5mm² or 4mm² |
| Pool/spa pump | 20A | 2.5mm² |
| EV charger | 32A | 6mm² |
| Solar inverter | 20-25A | 4mm² |
| Dishwasher (recommended) | 20A | 2.5mm² |

### 11.4 Metering Considerations

| Scenario | Metering Impact |
|---|---|
| **Single phase adequate** | Most residential renovations. Up to ~20kW total load |
| **Three-phase needed** | 3+ air conditioners + EV charger + solar >5kW, or any three-phase appliance (e.g., some large cooktops, EV chargers >7kW) |
| **Off-peak hot water** | May require separate meter/tariff. Dedicated circuit with time-of-use relay |
| **Solar PV** | Requires bi-directional (smart) meter. Usually arranged by solar installer with retailer |
| **Supply upgrade cost** | Overhead single-to-three-phase: $2,000-$5,000. Underground: $7,000-$12,000 |
| **Level 2 ASP required** | Any work on consumer mains or metering requires a Level 2 Accredited Service Provider (NSW) or equivalent in other states |

---

## 12. Typical Switchboard Costs

**Confidence:** MEDIUM (sourced from trade publications, prices will vary)
**Prices:** Approximate, inclusive of GST, as of 2025

### 12.1 Switchboard Upgrade Cost Ranges

| Upgrade Type | Price Range | Notes |
|---|---|---|
| **Basic upgrade** (replace fuses with MCBs, add RCDs) | $800 - $1,500 | No new circuits, existing board adequate |
| **Standard upgrade** (new switchboard, RCDs, rewire internal board) | $1,200 - $2,500 | Most common for renovation. 4-8 hours work |
| **Full replacement + new circuits** | $2,000 - $4,000 | Complete board replacement with multiple new circuits |
| **Complex upgrade** (three-phase, solar-ready, EV-ready) | $3,000 - $7,000 | Includes main switch upgrade, future-proofing |

### 12.2 Cost by Capital City

| City | Typical Range (Standard Upgrade) | Notes |
|---|---|---|
| **Sydney** | $900 - $2,500 | Higher labour rates |
| **Melbourne** | $1,000 - $2,500 | Prescribed work inspection adds ~$150-300 |
| **Brisbane** | $800 - $2,200 | Generally more affordable labour |
| **Perth** | $1,500 - $3,000 | Higher material/logistics costs |
| **Adelaide** | $1,500 - $2,500 | |
| **Hobart** | $1,200 - $2,500 | Smaller market |
| **Darwin** | $1,500 - $3,000 | Remote location premium |
| **Canberra** | $1,200 - $2,500 | |

### 12.3 Cost Breakdown Components

| Component | Typical Cost |
|---|---|
| Switchboard enclosure | $200 - $600 |
| Circuit breakers (each) | $5 - $50 |
| RCDs (each) | $50 - $150 |
| Main switch | $80 - $200 |
| Surge protection device | $100 - $300 |
| Busbar system | $50 - $150 |
| Labour (per hour) | $70 - $150 |
| Permits and inspections | $100 - $500 |
| Network connection fee (if mains work) | $200 - $800 |

---

## KEY SCOPE-WRITING IMPLICATIONS

### Always Include in Electrical Renovation Scope:

1. **RCD compliance** -- minimum 2x RCDs, max 3 circuits per RCD
2. **Certificate of compliance** -- name it correctly for the state
3. **Dedicated circuits** for cooktop, oven, hot water, A/C, EV (if applicable)
4. **Switchboard assessment** -- note if upgrade is likely/required
5. **Smoke alarm compliance** -- check state requirements, especially QLD
6. **Cable sizing statement** -- per AS/NZS 3008
7. **Spare capacity** -- spec spare ways for future (solar, EV, battery)
8. **Testing and commissioning** -- insulation resistance, polarity, earth, RCD testing
9. **State-specific inspection** -- flag if VIC prescribed work applies
10. **Lighting power density** -- if NCC trigger applies (>50% volume alteration)

### Common Scope Omissions to Avoid:

- Forgetting smoke alarm upgrade (especially QLD)
- Not specifying dedicated circuits for major appliances
- Not allowing for switchboard upgrade cost when adding circuits
- Ignoring solar/EV future-proofing
- Not accounting for VIC prescribed work inspection costs
- Omitting surge protection device
- Not specifying cable mechanical protection requirements in walls

---

## SOURCES

### Government & Regulatory
- [NSW Government - Electrical compliance requirements](https://www.nsw.gov.au/housing-and-construction/compliance-and-regulation/electricians/electrical-compliance-requirements)
- [Energy Safe Victoria - Prescribed and non-prescribed work](https://www.energysafe.vic.gov.au/certificates-electrical-safety/obligations-and-guidelines/prescribed-and-non-prescribed-work)
- [Energy Safe Victoria - COES](https://www.energysafe.vic.gov.au/coes)
- [QLD Electrical Safety Office](https://www.electricalsafety.qld.gov.au/)
- [QLD Fire Department - Smoke Alarms](https://www.fire.qld.gov.au/prepare/fire/smoke-alarms)
- [NT WorkSafe - RCDs](https://worksafe.nt.gov.au/forms-and-resources/bulletins/residual-current-devices-rcd-or-safety-switches)
- [NCC Part H6 - Energy Efficiency](https://ncc.abcb.gov.au/editions/ncc-2022/adopted/volume-two/h-class-1-and-10-buildings/part-h6-energy-efficiency)
- [NCC Part J7 - Artificial Lighting](https://ncc.abcb.gov.au/editions/ncc-2022/adopted/volume-one/j-energy-efficiency/part-j7-artificial-lighting-and-power)
- [ABCB Handbook - Upgrading Existing Buildings](https://www.abcb.gov.au/sites/default/files/resources/2022/Handbook-upgrading-existing-buildings.pdf)

### Standards
- [AS/NZS 3000:2018 (Standards Australia)](https://store.standards.org.au/product/as-nzs-3000-2018)
- [AS/NZS 3000:2018 Ruling 1:2024](https://store.standards.org.au/product/as-nzs-3000-2018-rul-1-2024)
- [AS/NZS 3008.1.2:2017 (Cable sizing)](https://store.standards.org.au/product/as-nzs-3008-1-2-2017)

### Industry & Trade
- [HIA - Changes to AS/NZS 3000-2018](https://hia.com.au/resources-and-advice/building-it-right/australian-standards/articles/changes-to-as-nzs-3000-2018-wiring-rules-standard)
- [Hager - Guide to Wiring Rules Changes](https://assets1.sc.hager.com/australia/files/Guide_to_the_Wiring_Rules_Changes.pdf)
- [GSES - Wiring Rules AS/NZS 3000:2018 Key Updates](https://www.gses.com.au/wiringrulesasnzs3000/)
- [Gemcell/Master Electricians - AFDD Guide](https://gemcell.com.au/master-electricians-australia/the-lowdown-on-arc-fault-detection-devices-afdds/)
- [Gemcell - Smoke Alarm Requirements by State](https://gemcell.com.au/industry/smoke-alarm-requirements-by-state/)
- [Electric Vehicle Council - EVSE Installation Guideline Feb 2024](https://electricvehiclecouncil.com.au/wp-content/uploads/2024/02/EVSE-installation-guideline.pdf)
- [BUILD.com.au - Safety Switch Laws](https://build.com.au/safety-switch-laws-and-requirements/)
- [Electrician Near Me - Certificate Requirements](https://electrician-nearme.com.au/blog/when-is-an-certificate-of-electrical-safety-required-in-australia/)
- [EA Electrics - Switchboard Upgrade Costs 2024](https://www.eaelectrics.com.au/post/electrical-switchboard-upgrade-costs-2024-price-guide)
- [H.Irwin Electrical - Switchboard Upgrade Costs 2025](https://hirwinelectrical.com.au/blog/how-much-are-switchboard-upgrades-in-australia/)
- [KM Electric - Switchboard Upgrade Guide](https://kmelectric.com.au/switchboard-upgrade-guide/)
- [All Round Electrical - Solar/EV Switchboard Requirements](https://www.allroundelectrical.com.au/resources/do-you-need-a-switchboard-upgrade-before-installing-solar-or-ev-charging)
- [ELEK Software - AS/NZS 3008 Cable Sizing Guide](https://elek.com/articles/as-nzs-3008-cable-sizing-calculations-step-by-step-guide/)
- [Smoke Alarm Solutions - QLD Legislation](https://smokealarmsolutions.com.au/legislation-qld/)
- [Detector Inspector - Interconnection Requirements](https://www.detectorinspector.com.au/interconnection-of-smoke-alarms/)
