# Hook Model Framework for Low-Frequency, High-Stakes Products

**Research for:** ScopeAI -- AI-powered renovation scope generator
**Context:** One-time purchase product ($49/$99/$149), 1-5 total visits, anxiety-driven users
**Date:** 2026-02-09

---

## Table of Contents

1. [The Hook Model: Core Framework](#1-the-hook-model-core-framework)
2. [Why the Standard Model Doesn't Fit](#2-why-the-standard-model-doesnt-fit)
3. [Adapting the Model for Low-Frequency, High-Stakes Products](#3-adapting-the-model-for-low-frequency-high-stakes-products)
4. [The ScopeAI Hook Map](#4-the-scopeai-hook-map)
5. [Anti-Patterns: What Not to Do](#5-anti-patterns-what-not-to-do)
6. [Ethical Framework](#6-ethical-framework)
7. [Sources](#7-sources)

---

## 1. The Hook Model: Core Framework

The Hook Model was introduced by Nir Eyal in his 2014 book *Hooked: How to Build Habit-Forming Products*. It describes a four-phase cycle that, when repeated, creates habit-forming products. The loop is: **Trigger -> Action -> Variable Reward -> Investment**.

Each pass through the cycle strengthens the association between the user's internal state and the product, until using the product becomes automatic -- a habit.

### Phase 1: Trigger

The trigger is the actuator of behaviour -- the spark plug. There are two categories:

**External Triggers** place information in the user's environment. Eyal identifies four sub-types:

| Type | Definition | Example | Characteristic |
|------|-----------|---------|----------------|
| **Paid** | Advertising, SEM, paid placements | Google Ads for "renovation quotes" | Expensive, not self-sustaining |
| **Earned** | Press, viral content, SEO, app store rankings | Blog post ranking for "how to get renovation quotes" | Free but hard to replicate |
| **Relationship** | Word-of-mouth, social sharing, referrals | Friend texts "I used this app for my reno" | Highest trust, highest conversion |
| **Owned** | Persistent real estate in user's environment | App icon, email subscription, push notification | The bridge from external to internal triggers |

**Internal Triggers** are emotional states the user seeks to resolve. These are the engine of habit. Eyal's core insight: *"The brain gets us to do anything and everything for one reason -- to escape discomfort."*

The most powerful internal triggers are negative emotions:
- **Boredom** (drives social media checking)
- **Loneliness** (drives messaging)
- **Uncertainty** (drives search/research)
- **Anxiety** (drives information-seeking and reassurance)
- **Fear** (drives protective action)
- **Indecisiveness** (drives comparison tools)

The goal of the Hook cycle is to create an automatic association between the internal trigger (the emotion) and the product (the solution). When the user feels X, they think of the product without needing an external prompt.

### Phase 2: Action

The action is the simplest behaviour a user performs in anticipation of a reward. Eyal builds on B.J. Fogg's Behavior Model: **B = MAT** (Behaviour = Motivation + Ability + Trigger). All three must be present simultaneously.

**Motivation** -- Fogg identifies three core motivators:
- Seek pleasure / avoid pain
- Seek hope / avoid fear
- Seek social acceptance / avoid rejection

**Ability** -- Fogg's six elements of simplicity (reducing any one increases ability):
1. Time (how long it takes)
2. Money (financial cost)
3. Physical effort (exertion required)
4. Brain cycles (cognitive load)
5. Social deviance (how much it breaks social norms)
6. Non-routine (how much it deviates from existing habits)

Eyal's critical insight: **Always start with ability, not motivation.** Reducing friction is more effective than trying to increase desire. Make the action as easy as possible.

### Phase 3: Variable Reward

Standard feedback loops (press button, light turns on) don't create desire because they're predictable. Variable reward -- where the outcome is uncertain -- triggers a dopamine surge in *anticipation*, not in the reward itself. This is what makes slot machines compelling despite negative expected value.

Eyal identifies three types of variable reward, drawn from research by B.F. Skinner (operant conditioning) and adapted from work by social psychologist Olds and Milner:

**Rewards of the Tribe** -- social rewards driven by connectedness:
- Likes, comments, validation from others
- Status within a community
- Cooperation and social belonging
- Variable because you never know exactly how others will respond

**Rewards of the Hunt** -- the search for material resources and information:
- Finding a deal, discovering useful information
- The "aha" moment of uncovering something valuable
- Variable because the specific find is unpredictable
- Shopping, comparison sites, news feeds

**Rewards of the Self** -- intrinsic rewards of mastery, competence, and completion:
- Completing a level, clearing an inbox, finishing a task
- The satisfaction of personal achievement
- Variable because the difficulty and nature of the challenge changes
- Learning apps, puzzle games, productivity tools

These three types frequently overlap. A product can deliver all three simultaneously.

### Phase 4: Investment

The investment phase is where the user puts something into the product -- time, data, effort, social capital, or money -- that improves the product for future use. This is the most overlooked phase.

Investment serves two functions:
1. **Stored value** -- The product gets better with use. Examples: data (preferences), content (playlists), followers (social graph), reputation (ratings), skill (learned interface). Unlike physical goods that depreciate, habit-forming products appreciate through stored value.
2. **Loading the next trigger** -- Investment primes the next cycle. Sending a message (investment) loads the trigger (notification of reply). Following an account (investment) loads the trigger (new content in feed).

The **IKEA effect** is central here: people overvalue things they helped create. Participants in studies valued their own origami creations 5x higher than bystanders did. Investment creates ownership, and ownership creates attachment.

Key distinction from a sales funnel: the investment phase is NOT about getting users to pay. It's about getting them to do work that makes the product more valuable to them, increasing switching costs and priming the next hook cycle.

---

## 2. Why the Standard Model Doesn't Fit

The Hook Model was popularised through examples of high-frequency, low-stakes products: Facebook, Twitter, Instagram, Pinterest, Slack, Snapchat. These products share characteristics that ScopeAI does not:

| Characteristic | Hook Model Archetype | ScopeAI Reality |
|----------------|---------------------|-----------------|
| Usage frequency | Multiple times daily | 1-5 times total |
| Session duration | Seconds to minutes | 5-15 minutes |
| Emotional driver | Boredom, loneliness | Anxiety, uncertainty, fear |
| Purchase model | Free / subscription | One-time payment ($49-$149) |
| Habit goal | Daily automatic use | Funnel completion, then referral |
| Decision stakes | Low (scrolling is cheap) | High (spending real money, real renovation) |
| Decision mode | Impulsive, System 1 | Deliberate, System 2 |
| Reward timing | Immediate | Delayed (scope delivered after payment) |
| User state | Casual, bored | Stressed, cognitively loaded |

### Specific Problems with Direct Application

**1. The frequency problem.** Eyal states habits form through repeated cycles. If a user visits 3 times total, there aren't enough cycles to create an automatic internal trigger association. You can't make someone "habitually" use a renovation tool.

**2. The variability problem.** Variable reward works when you don't know what you'll get (scrolling a feed). But a homeowner paying $99 for a scope document wants *predictable*, *reliable* output. Variability in a high-stakes deliverable is a *bug*, not a feature. As one critique notes: "A grocery delivery app that inconsistently stocks items performs worse than one with reliable inventory."
(Source: [The Behavioral Scientist](https://www.thebehavioralscientist.com/articles/hooked-how-to-build-habit-forming-products-is-wrong))

**3. The emotional driver mismatch.** The standard model assumes the internal trigger is a mild negative emotion (boredom) that the product resolves with a quick dopamine hit. ScopeAI's internal trigger is *anxiety about a major financial decision*. This is a fundamentally different emotional register. Dopamine-hit mechanics feel trivialising and untrustworthy to someone making a $20K-$100K renovation decision.

**4. The investment-reward ordering problem.** Standard Hook: small action -> immediate reward -> then investment. ScopeAI: significant investment (upload photos, answer 12+ questions, create account) -> then payment -> then reward. The user invests heavily before receiving any variable reward. This inverts the model.

**5. The circular logic critique.** Multiple behavioural scientists have noted the model's core logic is tautological: "A person doing something repeatedly is the basic definition of a habit, so it's not very useful to say that people form habits by doing something repeatedly." For a 1-5 visit product, this criticism is especially sharp.
(Source: [The Behavioral Scientist](https://www.thebehavioralscientist.com/articles/hooked-how-to-build-habit-forming-products-is-wrong))

### What IS Useful from the Model

Despite these limitations, several Hook Model concepts are directly applicable:

- **Internal triggers as design drivers.** Understanding the user's emotional state (anxiety, uncertainty) and designing the product to resolve it is universally valuable.
- **The Fogg behaviour model (B=MAT).** Reducing friction and increasing ability is critical for funnel completion.
- **Stored value and the IKEA effect.** Users who upload their own photos and answer questions about *their* renovation create personal investment that increases perceived value.
- **Loading the next trigger.** Even in a short lifecycle, each step can prime the next action.
- **External trigger taxonomy.** Paid/earned/owned/relationship triggers are useful categories for acquisition and re-engagement strategy.

---

## 3. Adapting the Model for Low-Frequency, High-Stakes Products

### The Modified Hook: "Conviction Loop"

For products where frequency is low and stakes are high, the Hook Model must be reframed. Instead of building a *habit* (automatic, unconscious behaviour), we're building *conviction* (deliberate, confident decision-making).

The adapted model has the same four phases, but different goals:

```
Standard Hook:    Trigger -> Action -> Variable Reward -> Investment -> (repeat daily)
Conviction Loop:  Trigger -> Action -> Progressive Reward -> Investment -> (advance to next stage)
```

The loop repeats not across days/weeks, but across *stages within a single session or short journey*. Each stage is a micro-hook that builds momentum toward the purchase decision.

### Phase 1 (Adapted): Trigger -- Anxiety Resolution, Not Boredom Relief

**Internal trigger:** The homeowner's anxiety has specific, identifiable components:
- "Am I going to get ripped off?" (price uncertainty)
- "How do I even compare quotes when they all describe different things?" (comparability anxiety)
- "I don't know what I don't know about renovations" (knowledge gap fear)
- "What if I forget something and it costs me later?" (scope completeness anxiety)

**Design implication:** The product's messaging and UX must directly address these specific anxieties, not generic "renovation stress." Every screen should reduce a specific fear.

**External triggers for low-frequency products:**

| Trigger Type | Standard Hook Example | Conviction Loop Example |
|-------------|----------------------|------------------------|
| Paid | Facebook ad -> open app | Google ad: "Kitchen reno? Get a scope tradies can't argue with" |
| Earned | App Store ranking | SEO: "How to compare renovation quotes in Australia" |
| Relationship | Friend's tweet | "My mate used this for his bathroom reno -- saved him $8K" |
| Owned | App icon on home screen | Email: "Your scope is ready to download" |

**Key difference:** Owned triggers serve a different purpose. You're not trying to create daily check-in habits. You're trying to pull users back into an incomplete funnel, or trigger a second purchase for a different room, or prompt a referral after a successful renovation.

### Phase 2 (Adapted): Action -- Reduce Cognitive Load, Not Just Friction

For anxious users making high-stakes decisions, the Fogg model's "ability" component shifts from *physical ease* to *cognitive ease*:

**Standard Hook simplicity factors (Fogg):**
- Time, money, physical effort, brain cycles, social deviance, non-routine

**Additional factors for high-stakes products:**
- **Decision confidence** -- Does the user feel certain they're making the right choice at each step?
- **Reversibility** -- Can the user change their mind without penalty? (reduces anxiety)
- **Comprehension** -- Does the user understand what they're agreeing to?
- **Social proof** -- Are other people like them doing this?
- **Authority** -- Is the tool credible enough to trust with a $50K decision?

**Practical applications for ScopeAI:**
- Never ask a question without explaining why it matters for their scope
- Show progress clearly -- the wizard progress bar reduces uncertainty about how much is left
- Allow going back to previous steps without losing data
- Use language a homeowner understands, not trade jargon
- Show "X homeowners generated a scope this week" -- social proof for an unfamiliar tool

**The commitment and consistency principle** (Cialdini) is the mechanism here, not habit formation. Once someone has uploaded photos and answered 5 questions, they've made small commitments. Consistency bias drives them to complete the funnel. This is documented by NN/g: "Once users have made an initial commitment, they're more likely to follow through with larger ones."
(Source: [NN/g](https://www.nngroup.com/articles/commitment-consistency-ux/))

### Phase 3 (Adapted): Progressive Reward, Not Variable Reward

**This is the biggest departure from the standard model.**

For high-stakes products, unpredictability is the enemy. The user needs to feel *increasing certainty* that the product will deliver value, not the dopamine rush of not knowing what comes next.

Replace "variable reward" with **progressive reward** -- a series of escalating value confirmations that build conviction:

| Stage | Progressive Reward | Anxiety Addressed |
|-------|-------------------|-------------------|
| Photo upload | "We detected 6 items in your kitchen -- granite benchtops, gas cooktop..." | "Does this tool actually work?" |
| Question flow | Questions adapt to their specific situation | "Is this generic or personalised?" |
| Pre-paywall summary | "Your scope covers 4 trades, 47 line items" | "Will this be comprehensive enough?" |
| Post-payment scope | Full trade-specific scope-of-works with quantities | "Was it worth the money?" |
| PDF download | Professional, printable document | "Can I actually send this to tradies?" |

Each reward is *more* valuable than the last, creating a **value escalator** rather than a slot machine.

**Where variability DOES apply (carefully):**

Rewards of the Hunt still work in a constrained way:
- Photo analysis reveals things the homeowner *didn't know* about their space ("We detected copper piping that may need replacement" -- the "aha" discovery)
- Scope items surface requirements the homeowner wouldn't have thought of ("Your council requires DA approval for this modification")
- These discoveries are variable (every kitchen is different) but they feel like *expertise*, not randomness

Rewards of the Self work for completion:
- The satisfaction of finishing the wizard and seeing a complete scope
- The competence feeling of "now I know exactly what to ask tradies for"
- The mastery of understanding trade breakdowns for the first time

Rewards of the Tribe are post-purchase:
- Sharing the scope with a partner for validation
- Sending to tradies and getting taken seriously
- Recommending to a friend doing their own reno

### Phase 4 (Adapted): Investment as Value Lock-In

In the standard model, investment loads the next daily trigger. For ScopeAI, investment serves different purposes across different timeframes:

**Within-session investment (funnel completion):**

Every step the user completes is an investment that makes abandonment more costly:
1. Upload photos (effort + personal data)
2. Answer questions (time + specificity to their situation)
3. Create account (identity commitment)
4. Enter payment (financial commitment)

The IKEA effect is powerful here. The user has built *their* scope through *their* photos and *their* answers. It's not a generic document -- it's a personalised artefact they co-created. This stored value makes the output feel more valuable than an equivalent document someone else prepared.

**Cross-session investment (return and referral):**

- **Stored project data.** If the user returns for a second room, their account, preferences, and previous scopes are there. The second purchase is easier (ability increases).
- **Scope history.** Having a scope for the kitchen makes the bathroom scope more valuable (they can see the full renovation picture).
- **Referral identity.** After a successful renovation, the user has social capital to share. They're not just recommending a tool -- they're recommending *their* process.

**Loading the next trigger (adapted for low frequency):**

| Standard Hook | Conviction Loop |
|--------------|----------------|
| Sending a message loads reply notification | Completing a scope loads "download PDF" email |
| Following someone loads new content trigger | Purchasing one room loads "add another room" prompt |
| Building a playlist loads "new releases" notification | Successful renovation loads referral prompt (30-60 days later) |

### Real-World Analogues: Hook Model in Low-Frequency Products

While the Hook Model literature focuses on social apps, the adapted framework maps to how effective low-frequency, high-stakes products already work:

**Real estate platforms (Domain, REA Group):**
- Trigger: Anxiety about finding the right property / getting a fair price
- Action: Save a listing (low friction)
- Progressive reward: Price estimate, suburb report, auction results (escalating value)
- Investment: Saved searches, shortlists, inspection bookings (stored value)
- Habit target: Not daily use, but funnel completion + referral ("you should check Domain")

**Insurance comparison (Compare the Market, iSelect):**
- Trigger: Fear of overpaying / being underinsured
- Action: Enter postcode (minimal first step)
- Progressive reward: "We found 37 policies, you could save $420/year" (immediate value signal)
- Investment: Personal details, preferences (stored value locks you in)
- Habit target: Not daily use, but annual renewal + telling friends

**Legal document generators (LegalZoom, LawDepot):**
- Trigger: Anxiety about legal exposure / "do I need a lawyer for this?"
- Action: Select document type (simple choice)
- Progressive reward: Preview of document, "95% of users don't need a lawyer for this" (anxiety reduction)
- Investment: Personal details, specific situation data (IKEA effect)
- Habit target: Not daily use, but second document purchase + referral

**Healthcare booking (Hotdoc, HealthEngine):**
- Trigger: Health anxiety / "I should get this checked"
- Action: Search for GP (familiar action)
- Progressive reward: Available appointments, doctor ratings (information hunt)
- Investment: Medical history, preferred doctor (stored value)
- Habit target: Not daily use, but "I always book through Hotdoc"

The pattern across all of these: the "habit" isn't daily use. It's the *default choice* when the need arises again, plus word-of-mouth when someone else has the same need.

---

## 4. The ScopeAI Hook Map

Mapping the full Conviction Loop to ScopeAI's user journey:

### Micro-Hook 1: Landing -> Upload

```
Trigger:     "I need renovation quotes but don't know what to ask for" (internal: uncertainty)
             Google search / friend recommendation / social ad (external: earned/relationship/paid)
Action:      Upload 3-5 photos of kitchen (low effort, familiar action -- everyone takes phone photos)
Reward:      AI analysis appears: "We identified 14 items including Caesarstone benchtops,
             undermount sink, and gas cooktop" (hunt reward: discovery of what AI sees)
Investment:  Photos are stored. User's specific kitchen is now "in the system."
             Next trigger loaded: "Now answer a few questions to customise your scope"
```

### Micro-Hook 2: Upload -> Questions

```
Trigger:     "Answer 12 questions to get your personalised scope" (external: owned/in-product)
             Curiosity about what the scope will contain (internal: anticipation)
Action:      Answer first question (simple selection, not free-text)
Reward:      Progress bar advances. Questions feel relevant to their specific situation.
             (self reward: completion progress + competence of understanding their renovation)
Investment:  Each answer customises the scope further. Going back means losing specificity.
             Commitment consistency: "I've answered 8/12, might as well finish."
             Next trigger loaded: progress bar at 80% pulls toward completion
```

### Micro-Hook 3: Questions -> Auth -> Payment

```
Trigger:     "Your scope is ready -- 4 trades, 47 items" (external: in-product summary)
             "I need to see what's in this" (internal: curiosity + sunk cost of effort invested)
Action:      Create account (email/Google -- one click). View pricing. Select tier.
Reward:      Summary preview: trade names, item counts, 1-2 sample items per trade.
             Enough to confirm value, not enough to satisfy need.
             (hunt reward: partial reveal creates informed buying decision)
Investment:  Account created (identity). Tier selected (commitment).
             Financial investment (payment) creates strong IKEA effect on the output.
             Next trigger loaded: "Your scope is being generated..." progress screen
```

### Micro-Hook 4: Payment -> Scope Delivery

```
Trigger:     "Your scope is ready" email / in-app notification (external: owned)
             "I paid for this, I need to see it" (internal: investment recovery)
Action:      Open scope viewer
Reward:      Full scope-of-works: trade-by-trade breakdown, line items, quantities,
             professional formatting. The comprehensive answer to their anxiety.
             (self reward: completion + mastery -- "now I understand my renovation")
             (hunt reward: discovering scope items they didn't know they needed)
Investment:  Time spent reviewing and understanding the scope.
             Toggling items on/off (customisation = ownership).
             Downloading PDF (artefact in their possession).
             Next trigger loaded: "Share with your partner" / "Send to 3 tradies for quotes"
```

### Post-Purchase Hooks (Referral + Second Purchase)

```
Trigger 1:   30-60 days post-purchase: "How's your renovation going?" email (external: owned)
             Satisfaction with quotes received using the scope (internal: positive association)
Action:      Open email, see "Refer a friend, get $10 off your next room"
Reward:      Social capital ("I helped my friend") + financial incentive
             (tribe reward: being the knowledgeable friend who helps)
Investment:  Sharing the referral link (social commitment to the product)

Trigger 2:   "Planning another room?" prompt after scope download (external: owned)
             "The kitchen scope was good, bathroom needs work too" (internal: positive experience)
Action:      Click "Add another room" (frictionless -- account exists, flow is familiar)
Reward:      Second scope faster (stored preferences) and feels like completing the full picture
             (self reward: comprehensive renovation planning mastery)
Investment:  Multi-room scope portfolio = significant stored value. High switching cost.
```

---

## 5. Anti-Patterns: What Not to Do

### For Anxious Users Making Expensive Decisions

**Anti-Pattern 1: Artificial Urgency**
- "Only 3 scopes left at this price!" -- fake scarcity
- "This offer expires in 10:00 minutes" -- countdown timers
- Why it's wrong: Anxious users making $50K decisions recognise urgency tactics as manipulation. It *increases* anxiety rather than resolving it, and destroys trust in the tool's credibility. They'll leave rather than be pressured.
- What to do instead: Honest framing. "Pricing is simple -- pick the tier that matches your project."

**Anti-Pattern 2: Information Hostage-Taking**
- Requiring email/signup before showing ANY value
- Hiding all scope details behind a paywall with zero preview
- Why it's wrong: The user has given effort (photos + questions). Showing zero result feels like a bait-and-switch. Anxiety users need *evidence* the product works before they trust it with money.
- What to do instead: Show a meaningful summary (trade names, item counts, 1-2 sample items). Enough to confirm value and competence. Not enough to replace the full scope.

**Anti-Pattern 3: Dark Pattern Upsells**
- Pre-checked "Premium" tier on the pricing page
- "Are you sure you want Basic? Most homeowners choose Pro" (shaming)
- Burying the cheapest option visually
- Why it's wrong: Anxious users are already second-guessing their decision. Adding upsell pressure compounds their cognitive load. They may abandon entirely.
- What to do instead: Present tiers clearly with honest differentiators. Let the value speak. Highlight the most popular tier with social proof ("Most chosen"), not manipulation.

**Anti-Pattern 4: Guilt-Based Re-engagement**
- "You left your renovation scope unfinished! Don't let your dream kitchen wait!"
- "Your photos are getting lonely..."
- Why it's wrong: The user may have abandoned because they're genuinely reconsidering a $50K renovation. Guilt emails feel tone-deaf and trivialising.
- What to do instead: Helpful, low-pressure re-engagement. "Your kitchen scope is saved and ready when you are. Here's what's included." Focus on the value waiting for them, not what they're "missing."

**Anti-Pattern 5: Notification Carpet-Bombing**
- Push notification + email + SMS for the same event
- "You haven't logged in for 3 days!" (for a product used 3 times total)
- Why it's wrong: Low-frequency products that behave like high-frequency ones feel broken. The user isn't ignoring you -- they're living their life between renovation decisions.
- What to do instead: Minimal, high-value touchpoints. One email when the scope is ready. One follow-up 30 days later. One referral prompt after 60 days. That's it.

**Anti-Pattern 6: Fake Social Proof**
- "John S. from Sydney saved $15,000!" (unverifiable)
- Fabricated review counts or testimonials
- Why it's wrong: Home renovation is a trust industry. Australians are particularly sceptical of American-style hype marketing. Fake proof is worse than no proof.
- What to do instead: Real metrics. "2,847 scopes generated" (actual number from your database). Real testimonials with full names and suburbs (with permission). Specificity builds trust.

**Anti-Pattern 7: Weaponising Sunk Cost**
- "You've already answered 10 questions -- don't waste your effort!"
- Making it impossible to export or retrieve data without completing payment
- Why it's wrong: Sunk cost awareness is not the same as sunk cost exploitation. Users who feel trapped become hostile, not loyal. They'll complete the funnel resentfully and never refer anyone.
- What to do instead: Let commitment consistency work naturally. A progress bar at 80% creates its own pull without needing to verbalise it. Show what they've built ("Your scope includes plumbing, electrical, tiling, and demolition") rather than what they'll lose.

**Anti-Pattern 8: Gamification of Serious Decisions**
- Achievement badges for completing the wizard
- "Level up your renovation!" language
- Confetti animations on purchase
- Why it's wrong: Gamification signals frivolity. A homeowner about to spend $50K on a kitchen renovation does not want to feel like they're playing a game. It undermines the professional credibility that justifies the price.
- What to do instead: Professional satisfaction cues. Clean transitions, a well-designed scope viewer, a PDF that looks like it came from a quantity surveyor. The reward is competence, not entertainment.

---

## 6. Ethical Framework

### Nir Eyal's Own Ethics Tests

Eyal addresses the manipulation concern directly with two tests:

**The Manipulation Matrix** -- asks two questions:
1. Does this product materially improve people's lives?
2. Would I use this product myself?

Four quadrants:
- **Facilitator** (yes/yes): You use it and it helps people. Ethical and sustainable.
- **Peddler** (no/yes): You believe in it but it doesn't actually help. Self-deceiving.
- **Entertainer** (yes/no): It helps people but you wouldn't use it yourself. Acceptable but disengaged.
- **Dealer** (no/no): You don't use it and it doesn't help. Exploitative.

ScopeAI should aim for **Facilitator**: a tool the team would genuinely use if renovating, that materially helps homeowners get better outcomes.

**The Regret Test** -- a single question:
*"If users knew everything the designer knows -- including all the persuasion techniques being used, all the data being collected, and the intended outcome -- would they still choose to use the product? Would they regret it afterward?"*

If users would regret the action after full transparency, the technique is coercion, not persuasion, and should not be implemented.
(Source: [Nir Eyal - Regret Test](https://www.nirandfar.com/regret-test/))

### Applying the Regret Test to ScopeAI

| Technique | Regret Test Result | Verdict |
|-----------|-------------------|---------|
| Progress bar showing wizard completion | User would not regret seeing their progress | Pass |
| Photo analysis preview before payment | User would not regret seeing AI detected items correctly | Pass |
| Summary-only paywall (no full scope free) | User would understand -- this is the business model | Pass |
| Countdown timer on pricing page | User would feel pressured and resentful | Fail |
| "Your photos are being deleted in 24 hours" | User would feel manipulated | Fail |
| Referral discount 60 days after purchase | User would appreciate saving money | Pass |
| Pre-checked premium tier | User would feel tricked | Fail |
| Email: "Your scope is ready to download" | User would want to know this | Pass |
| Email: "You haven't finished your scope!" (day 1) | User might appreciate the reminder | Borderline -- once is ok |
| Email: "You haven't finished!" (day 1, 3, 5, 7) | User would feel harassed | Fail |

### The Ethical Engagement Principles for High-Stakes Products

1. **Reduce anxiety, never create it.** Every interaction should leave the user feeling more confident, not more pressured. If a design choice increases user anxiety to drive conversion, it fails the regret test.

2. **Earn trust through competence, not persuasion.** The photo analysis preview isn't a manipulation technique -- it's a competence demonstration. When the AI correctly identifies their Caesarstone benchtops and undermount sink, trust is earned through demonstrated capability.

3. **Align incentives transparently.** The user's goal (comprehensive renovation scope) and the product's goal (paid scope generation) are naturally aligned. Don't obscure this alignment with manipulative tactics. "We generate detailed scopes for $49-$149" is honest and sufficient.

4. **Respect the decision timeline.** A homeowner may need to discuss with their partner, check their finances, or get a second opinion before committing. Designing for immediate conversion at the expense of informed decision-making is short-sighted. Allow saves, allow return visits, allow thinking time.

5. **Make the value obvious, not the persuasion.** If you need dark patterns to convert, the value proposition is too weak. Fix the value, not the funnel. A scope document that genuinely helps homeowners get comparable quotes is inherently valuable -- it doesn't need artificial urgency to sell.

---

## 7. Sources

### Primary Sources

- [Nir Eyal - How to Manufacture Desire (Hook Model overview)](https://www.nirandfar.com/how-to-manufacture-desire/)
- [Nir Eyal - Variable Rewards: Want to Hook Users? Drive Them Crazy](https://www.nirandfar.com/want-to-hook-your-users-drive-them-crazy/)
- [Nir Eyal - User Investment: Make Your Users Do the Work](https://www.nirandfar.com/makeyourusersdothework/)
- [Nir Eyal - The Regret Test](https://www.nirandfar.com/regret-test/)
- [Nir Eyal - Getting Traction: How to Hook New Users (external trigger types)](https://www.nirandfar.com/traction/)

### Analysis and Criticism

- [The Behavioral Scientist - Hooked: How to Build Habit Forming Products Is Wrong](https://www.thebehavioralscientist.com/articles/hooked-how-to-build-habit-forming-products-is-wrong)
- [Shaheen Saboor - The Hook Model: Redefined (ethical adaptation)](https://shaheensaboor.substack.com/p/beyond-the-hook-model)
- [Amplitude - The Hook Model: Retain Users by Creating Habit-Forming Products](https://amplitude.com/blog/the-hook-model)
- [ProductPlan - What is the Hook Model?](https://www.productplan.com/glossary/hook-model/)
- [LogRocket - What is the Hook Model?](https://blog.logrocket.com/product-management/what-is-the-hook-model-how-to-build-habit-forming-products/)

### Behavioral Psychology

- [NN/g - The Principle of Commitment and Behavioral Consistency](https://www.nngroup.com/articles/commitment-consistency-ux/)
- [The Decision Lab - IKEA Effect](https://thedecisionlab.com/biases/ikea-effect)
- [The Decision Lab - Choice Overload](https://thedecisionlab.com/biases/choice-overload-bias)

### Ethics and Dark Patterns

- [ACM DIS 2023 - Ethical Tensions in UX Design Practice](https://dl.acm.org/doi/fullHtml/10.1145/3563657.3596013)
- [Medium/Bootcamp - Dark Patterns in 2025: Predictions and Practices for Ethical Design](https://medium.com/design-bootcamp/dark-patterns-in-2025-predictions-and-practices-for-ethical-design-cbd1a5db8d80)
- [Adobe Blog - The Morality of Manipulation: Nir Eyal on Habit-Forming Products](https://blog.adobe.com/en/publish/2017/03/01/the-morality-of-manipulation-nir-eyal-on-creating-habit-forming-products-that-do-good)
- [Behavioral Scientist - Nir Eyal on the Regret Test](https://behavioralscientist.org/ask-behavioral-scientist-nir-eyal-regret-test-makes-good-ethics-good-business/)

### Decision Fatigue and Cognitive Load

- [Wizart - Reducing Decision Fatigue in Home Improvement Sales](https://wizart.ai/blog/how-wizart-reduces-decision-fatigue)
- [Psychology Today - Avoiding Consumer Decision Fatigue](https://www.psychologytoday.com/us/blog/consumer-psychology/202411/avoiding-consumer-brain-fatigue)
- [Global Council for Behavioral Science - The Impact of Cognitive Load on Decision-Making Efficiency](https://gc-bs.org/articles/the-impact-of-cognitive-load-on-decision-making-efficiency/)

### Post-Purchase Engagement

- [Retail Dive - The Power of Post-Purchase Engagement](https://www.retaildive.com/spons/the-power-of-post-purchase-engagement-strategies-for-lasting-customer-loya/712434/)
- [Irrational Labs - Is Designing for Habits Harmful?](https://irrationallabs.com/blog/why-designing-for-habits-may-be-harmful-and-the-underused-alternative-to-try/)
