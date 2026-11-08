import { act } from "@/lib/study/activities";
import type { ModuleMeta } from "@/lib/study/types";
import { advanced } from "./pharmacokinetics-2";
import { examZone } from "./pharmacokinetics-3";

export const meta: ModuleMeta = {
  id: "pharmacokinetics",
  num: 52,
  title: "How medicines move and act",
  emoji: "🧪",
  tagline: "From a tablet's journey and a receptor's lock, to half-life maths, the liver's enzymes, levels and loading doses, to receptor theory and the genes that change every dose",
  when: "Psychopharmacology",
  outcomes: [
    "Explain in plain words how a medicine is absorbed, carried, changed and removed, and how it acts on a receptor",
    "Use bioavailability, first pass, protein binding, the blood-brain barrier and CYP enzymes to predict levels and interactions",
    "Calculate half-life, steady state, loading and maintenance doses, and interpret therapeutic drug monitoring",
    "Adjust thinking for children, older adults, pregnancy, liver and kidney disease, smoking and obesity",
    "Explain receptor theory (affinity, efficacy, potency, partial and inverse agonism, allosteric modulation, spare receptors), non-linear kinetics and pharmacogenomics at postgraduate depth",
  ],
  writeTask:
    "On paper, from memory: the four ADME stages with one psychiatric example each; the half-life formula and the steady-state rule with a worked example; a table of the main CYP enzymes with two substrates, one inhibitor and one inducer each; how pregnancy, old age, liver disease and kidney disease change kinetics; the definitions of affinity, efficacy, potency and therapeutic index with a sketched dose-response curve; and the four metaboliser types with one clinical consequence each. Then check and correct in red.",
  activities: [
    act.coach("pharmacology", "Coach: pharmacology", "The medicines and effects you confuse."),
    act.lesson("ad-1", "Quiz: classes and timing", "Apply half-life and onset to real medicines."),
    act.detective("Clinic detective", "Guess the medicine from its clues."),
  ],
};

const p1 = String.raw`

# Part 0 · Starting: a medicine's journey and its lock

## 0.1 Two questions: what the body does to a medicine, and what the medicine does to the body [core][starting]
Every medicine raises two separate questions.
- **Pharmacokinetics** asks: what does the body do to the medicine? How does it get in, where does it go, how is it changed, and how does it leave?
- **Pharmacodynamics** asks: what does the medicine do to the body? Which target does it fit, what happens when it does, and how much is needed?

A short way to remember pharmacokinetics is **ADME**: Absorption, Distribution, Metabolism, Excretion.

:::widget journey
{"drug": "fluoxetine", "target": "serotonin transporters (SERT) on serotonin nerve endings and raphe cell bodies", "routes": ["oral"], "notes": {"mouth": "Absorption begins: a fluoxetine capsule is swallowed.", "gut": "The capsule dissolves and fluoxetine passes through the gut wall. Food slows this a little but does not reduce the total amount absorbed.", "liver": "Metabolism begins on the first pass. The liver enzyme CYP2D6 turns fluoxetine into norfluoxetine, which also blocks SERT and lasts even longer. Fluoxetine also blocks CYP2D6 itself, so it slows the clearance of other medicines.", "blood": "Distribution: fluoxetine is very fat-soluble and spreads widely into body tissues. Only a small part stays free in the blood.", "bbb": "It crosses the blood-brain barrier easily because it is small and fat-soluble.", "out": "Excretion: the kidneys remove the water-soluble leftovers. Because fluoxetine and norfluoxetine leave so slowly, a single missed dose barely matters and the drug lingers for weeks after stopping."}, "caption": "Press Play and name the ADME stage at each stop. Which stops explain why fluoxetine causes so few withdrawal symptoms?"}
:::

| | Pharmacokinetics | Pharmacodynamics |
|---|---|---|
| Question | What the body does to the drug | What the drug does to the body |
| Key ideas | Absorption, distribution, metabolism, excretion, half-life, levels | Receptors, affinity, efficacy, potency, side effects |
| Typical problem | Level too low or too high | Right level, wrong or unwanted effect |
| Typical fix | Change the dose, timing or a second medicine | Change the medicine or add one with an opposing effect |

:::widget sort
{"prompt": "Pharmacokinetics or pharmacodynamics?", "buckets": ["Pharmacokinetics (the body acts on the drug)", "Pharmacodynamics (the drug acts on the body)"], "items": [{"text": "Smoking lowers olanzapine levels", "bucket": 0}, {"text": "Mirtazapine blocks histamine receptors and causes sleepiness", "bucket": 1}, {"text": "Lithium is removed by the kidneys", "bucket": 0}, {"text": "Aripiprazole turns D2 receptors partly on", "bucket": 1}, {"text": "Lorazepam is preferred in liver disease", "bucket": 0, "why": "Its simple route out does not need the liver's CYP enzymes."}, {"text": "Higher doses of an SSRI add more side effects than benefit", "bucket": 1}, {"text": "A depot injection releases drug slowly for weeks", "bucket": 0}]}
:::

:::recall
1. What does pharmacokinetics study? || What the body does to a medicine: absorption, distribution, metabolism, excretion.
2. What does pharmacodynamics study? || What the medicine does to the body: its targets and effects.
3. Expand ADME. || Absorption, distribution, metabolism, excretion.
:::

:::mcq
Q: A patient's olanzapine level falls after she starts smoking again. This is a problem of:
- Pharmacodynamics
- *Pharmacokinetics
- Receptor theory
- Placebo response
> Smoke speeds up the enzyme that clears olanzapine.
:::

## 0.2 Getting in: routes and absorption [core][starting]
How a medicine is given changes how fast it acts, how much reaches the blood, and how steady the level is.

:::widget journey
{"drug": "haloperidol", "target": "dopamine D2 receptors in the striatum", "routes": ["oral", "iv", "depot"], "notes": {"mouth": "Haloperidol tablets or liquid are swallowed.", "gut": "Most of the dose is absorbed over a few hours.", "liver": "On the first pass the liver removes about a third, so tablets need a higher dose than an injection for the same blood level.", "vein": "Into a vein (used only with heart monitoring, because of QT risk): the whole dose reaches the blood at once and acts within minutes.", "muscle": "Haloperidol decanoate, an oily depot, is injected deep into the buttock muscle once a month.", "slow": "The oil releases haloperidol slowly over weeks: no daily peaks and troughs.", "blood": "Haloperidol is mostly bound to blood proteins; only the free part moves on.", "out": "The liver (CYP2D6 and CYP3A4) changes it, and the kidneys and bile remove the products."}, "caption": "Switch between Tablet, Into a vein and Depot injection. Which route would you choose for a night of severe agitation, and which for someone who forgets tablets?"}
:::

### Common routes
| Route | Speed | First pass by the liver | Example |
|---|---|---|---|
| Tablet or capsule | Slow to moderate | Yes | Most medicines |
| Melt tablet on the tongue | Similar to a tablet (mostly swallowed) | Yes | Olanzapine melt |
| Under the tongue or inside the cheek | Fast | Mostly avoided | Asenapine, buprenorphine, buccal midazolam |
| Nasal spray | Fast | Mostly avoided | Esketamine, intranasal midazolam |
| Skin patch | Slow and steady | Avoided | Rivastigmine patch, nicotine patch |
| Into a muscle (short-acting) | Fast | Avoided | Lorazepam, haloperidol with promethazine |
| Into a vein | Fastest | Avoided | Lorazepam in status epilepticus, ketamine |
| Depot injection | Very slow and steady | Avoided | Paliperidone palmitate |

:::widget compare
{"title": "One medicine, two routes", "a": {"label": "Swallowed tablet", "points": ["Absorbed through the gut over hours", "Passes the liver first, losing part of the dose", "Peak level after some hours", "Easy to take at home", "Easy to stop if side effects appear"], "summary": "Slower and less complete, but simple and reversible."}, "b": {"label": "Injection into a vein", "points": ["Straight into the blood", "No first-pass loss: the whole dose arrives", "Peak level within minutes", "Needs trained staff and monitoring", "Cannot be taken back once given"], "summary": "Fast and complete, for emergencies, with closer watching."}, "caption": "Slide between the two routes. The medicine is the same; only the journey differs."}
:::

:::recall
1. Name four routes that avoid the liver's first pass. || Under the tongue, nasal, skin patch, injection (muscle, vein, depot).
2. Why are oral doses often higher than injected doses? || Part of an oral dose is lost on the first pass through the liver.
3. Which route acts fastest? || Into a vein.
:::

:::mcq
Q: Why is esketamine given as a nasal spray rather than a tablet?
- It tastes bad
- *Swallowed, much of it would be destroyed on its first pass through the liver; the nose route avoids this and acts fast
- Nasal sprays have no side effects
- It cannot cross the blood-brain barrier
> Route changes how much reaches the brain.
:::

## 0.3 Half-life in plain words [core][starting]
The **half-life** is the time it takes for the amount of medicine in the blood to fall by half. It tells us how often to dose, how long until the level settles, and how long until the medicine leaves.

:::widget curve
{"kind": "half-life", "title": "Watch doses stack up to a steady level", "caption": "Slide the half-life. With a dose every day, the level climbs and settles after about 4 to 5 half-lives. A short half-life gives spiky levels; a long one gives smooth levels that take longer to settle and longer to leave."}
:::

:::widget guess
{"prompt": "After stopping a medicine, about how many half-lives until it has nearly all gone (about 97% removed)?", "min": 1, "max": 10, "unit": "half-lives", "answer": [5, 5], "reveal": "About 5. After 1 half-life half is left, then a quarter, an eighth, a sixteenth, and after 5 about a thirty-second (3%). The same rule says a regularly taken medicine reaches a steady level after about 4 to 5 half-lives.", "clinician": "Fraction remaining after n half-lives = 0.5 to the power n. Steady state reached to about 97% after 5 half-lives. This holds for first-order (linear) kinetics only."}
:::

| Medicine | Approximate half-life | What it means |
|---|---|---|
| Alprazolam | Hours | Effect wears off between doses; withdrawal starts quickly |
| Venlafaxine | Hours | Missed doses felt within a day |
| Sertraline, escitalopram | About a day | Once daily; settles in about a week |
| Lithium | About a day (longer in older adults) | Level checked about 5 to 7 days after a change |
| Aripiprazole | About 3 days | Settles over about two weeks |
| Fluoxetine with norfluoxetine | Days to weeks | Almost tapers itself; long washout |

:::widget worked
{"title": "Half-life in your head", "steps": [{"q": "A medicine has a half-life of 12 hours. Starting from 100 units, how much is left after one day?", "a": "One day is two half-lives: 100, then 50, then **25 units**."}, {"q": "Taken every day, about how long until it reaches steady level?", "a": "4 to 5 half-lives: about **2 to 2.5 days**."}, {"q": "If a medicine's half-life is 7 days, how long until it is steady?", "a": "4 to 5 half-lives: about a month. This is why changes to slow medicines take a long time to show."}], "yourTurn": [{"q": "A medicine with a half-life of 2 days is stopped. Roughly when is it washed out?", "a": "About 5 half-lives: around 10 days."}]}
:::

:::recall
1. Define half-life. || The time for the blood level to fall by half.
2. How many half-lives to reach steady state, or to wash out? || About 4 to 5.
3. Why do short half-life medicines cause more withdrawal? || Levels fall quickly after a missed or stopped dose.
:::

:::mcq
Q: Medicine A has a half-life of 6 hours, medicine B of 6 days. Which is TRUE?
- A takes longer to reach steady state
- *B takes longer to reach steady state and to wash out
- Both settle after one dose
- Half-life affects only side effects
> 4 to 5 half-lives either way.
:::

## 0.4 Receptors, doses and the shape of a response [core][starting]
Most medicines act by fitting a **target**: a receptor, a pump (transporter), an enzyme or an ion channel. A receptor is a lock; the body's own messenger is the key.

:::widget figure
{"id": "synapse", "focus": ["receptor"]}
:::

:::widget receptor
{"receptor": "a receptor", "title": "Four ways a medicine can sit in a lock", "caption": "Try each one. A full agonist turns the lock fully. A partial agonist turns it part way. An antagonist sits in the lock and turns nothing, but blocks the real key. An inverse agonist turns it backwards, below its resting activity. Every psychiatric medicine you will meet fits one of these, at one or more receptors."}
:::

### Two words for "how good is this medicine"
- **Potency**: how much medicine you need for an effect. Haloperidol is potent: a few milligrams. Chlorpromazine is less potent: hundreds of milligrams. Potency is about dose, not about how good the medicine is.
- **Efficacy**: the biggest effect the medicine can produce, however much you give. A partial agonist has lower efficacy than a full agonist, at any dose.

:::widget curve
{"kind": "dose-response", "title": "Potency moves the curve; efficacy sets its height", "caption": "Move the potency slider: the curve slides left or right, but its top stays the same. Move the efficacy slider: the top rises or falls. Two medicines can be equally effective but very different in milligrams."}
:::

:::widget sort
{"prompt": "Potency or efficacy?", "buckets": ["About potency (how much is needed)", "About efficacy (how big the maximum effect is)"], "items": [{"text": "Haloperidol 5 mg works like chlorpromazine 250 mg", "bucket": 0}, {"text": "Buprenorphine, a partial agonist, cannot produce as much opioid effect as morphine however much is given", "bucket": 1}, {"text": "Clozapine helps people when other antipsychotics fail", "bucket": 1, "why": "That is greater clinical efficacy in a particular group."}, {"text": "Lorazepam 1 mg is about diazepam 10 mg", "bucket": 0}, {"text": "Aripiprazole turns D2 only part way on", "bucket": 1}]}
:::

:::recall
1. Name four kinds of drug target. || Receptors, transporters (pumps), enzymes, ion channels.
2. Define potency. || How much drug is needed for a given effect.
3. Define efficacy. || The maximum effect a drug can produce.
4. Which has lower efficacy: a full or a partial agonist? || A partial agonist.
:::

:::mcq
Q: Drug X needs 2 mg and drug Y needs 200 mg for the same antipsychotic effect, and both reach the same maximum benefit. Which is TRUE?
- X is more effective
- *X is more potent; their efficacy is similar
- Y is more potent
- Y is more effective
> Potency is about milligrams; efficacy is about the ceiling.
:::

## 0.5 Level check · Starting [starting]
Twelve or more right out of fifteen (80%) opens the Beginner level. If you already know this, take it now to skip ahead.

:::mcq
Q: Pharmacokinetics is the study of:
- What a drug does to the body
- *What the body does to a drug
- How drugs are invented
- Drug prices
> ADME.

Q: The "M" in ADME stands for:
- Movement
- *Metabolism
- Mood
- Membrane
> Mostly in the liver.

Q: Which route gives the fastest effect?
- Tablet
- Skin patch
- *Into a vein
- Depot injection
> Straight into the blood.

Q: The first-pass effect means:
- A drug works on the first day
- *Part of a swallowed dose is broken down by the liver before reaching the body
- The first dose is always the biggest
- The kidneys remove the drug first
> Why oral doses are higher.

Q: Which route avoids the first pass?
- Tablet
- *Nasal spray
- Capsule
- Syrup
> Absorbed straight into the blood through the nose lining.

Q: A medicine has a half-life of 1 day. After 3 days without a dose, what fraction is left?
- Half
- A quarter
- *An eighth
- None
> Half, half again, half again.

Q: Steady state is reached after about:
- 1 half-life
- *4 to 5 half-lives
- 20 half-lives
- One week always
> The same rule for washout.

Q: Short half-life medicines tend to cause:
- No withdrawal
- *Faster and stronger withdrawal when stopped
- Longer build-up
- More weight gain
> Levels fall quickly.

Q: A full agonist:
- Blocks a receptor
- *Switches a receptor fully on
- Switches it part way on
- Lowers it below resting
> Like the body's own messenger.

Q: An inverse agonist:
- Turns the receptor fully on
- Blocks it without effect
- *Pushes the receptor below its resting activity
- Destroys the receptor
> Opposite to an agonist.

Q: Potency describes:
- The maximum possible effect
- *How much drug is needed for an effect
- How long the drug lasts
- How safe it is
> A dose idea.

Q: Efficacy describes:
- The milligram dose
- *The maximum effect a drug can produce
- The half-life
- The price
> The ceiling of the curve.

Q: Which drug is mainly removed by the kidneys without liver metabolism?
- Fluoxetine
- *Lithium
- Diazepam
- Olanzapine
> An ion, handled like sodium.

Q: Why is a depot injection useful?
- It acts in seconds
- *It releases drug slowly for weeks, covering missed tablets
- It has no side effects
- It avoids the brain
> Steady, long-lasting levels.

Q: Which is a pharmacodynamic statement?
- Smoking lowers clozapine levels
- Lithium is removed by the kidneys
- *Mirtazapine blocks histamine receptors, causing sleepiness
- Fluoxetine has a long half-life
> What the drug does to the body.
:::

# Part I · Beginner: the numbers behind the journey

## 1.1 Absorption, bioavailability and the first pass [core][beginner]
**Bioavailability** (written F) is the fraction of a dose that reaches the general circulation unchanged. An IV dose has F of 100% by definition.

Bioavailability is reduced by:
- Incomplete dissolution or absorption in the gut.
- Breakdown in the gut wall (gut CYP3A4 and P-glycoprotein pumps push some drug back out).
- **First-pass metabolism** in the liver.

| Medicine | Approximate oral bioavailability | Practical point |
|---|---|---|
| Lithium, escitalopram | High | Little first-pass loss |
| Olanzapine, haloperidol | Moderate (about 60%) | Oral doses higher than injected |
| Ketamine (swallowed) | Low (about 20%) | Nasal or IV routes used |
| Asenapine (swallowed) | Very low | Must dissolve under the tongue, with no food or drink for 10 minutes |
| Buprenorphine (swallowed) | Very low | Given under the tongue |


:::widget journey
{"drug": "ketamine and esketamine", "target": "NMDA receptors in the prefrontal cortex", "routes": ["oral", "nasal", "iv"], "notes": {"mouth": "Swallowed ketamine is cheap and easy, but watch what happens next.", "gut": "It is absorbed well from the gut.", "liver": "Then the first pass: the liver turns most of it into norketamine before it reaches the body. Only about a fifth arrives unchanged, which is why ketamine is not usually given as a tablet.", "nose": "Nasal esketamine is absorbed through the lining of the nose, skipping most of the first pass: about half the dose reaches the blood, within minutes.", "vein": "An IV infusion delivers the whole dose, and the rate can be controlled minute by minute.", "blood": "Levels peak quickly by the nasal and IV routes, which is why blood pressure and dissociation are monitored soon after a dose.", "out": "Cleared by the liver over hours."}, "caption": "Switch between Tablet, Nasal spray and Into a vein. Same molecule, three very different fractions reaching the brain: that fraction is bioavailability."}
:::
### Food and formulation
- **With food**: lurasidone (at least 350 kcal) and ziprasidone are absorbed much better with a meal; zuranolone needs fat-containing food.
- **Away from food**: xanomeline with trospium (absorption falls with food).
- **Slow-release** tablets (lithium SR, venlafaxine XR, quetiapine XR) flatten peaks, reduce some side effects and allow once-daily dosing. They must not be crushed.
- **Grapefruit juice** blocks gut CYP3A4, raising levels of some medicines (lurasidone, buspirone, some benzodiazepines).

:::widget sort
{"prompt": "Take it with food, or away from food?", "buckets": ["Take with a meal", "Take away from food", "Food makes little difference"], "items": [{"text": "Lurasidone", "bucket": 0, "why": "Absorption roughly doubles with a meal of at least 350 kcal."}, {"text": "Xanomeline with trospium", "bucket": 1, "why": "At least an hour before or two hours after a meal."}, {"text": "Ziprasidone", "bucket": 0}, {"text": "Sertraline", "bucket": 2, "why": "Food may ease nausea, but absorption is similar."}, {"text": "Zuranolone", "bucket": 0, "why": "A fat-containing meal increases absorption."}, {"text": "Escitalopram", "bucket": 2}]}
:::

:::recall
1. Define bioavailability. || The fraction of a dose reaching the circulation unchanged.
2. Name three causes of low bioavailability. || Poor absorption, gut wall metabolism and pumps, first-pass liver metabolism.
3. Which antipsychotic must be taken with a meal? || Lurasidone (also ziprasidone).
4. Why must asenapine dissolve under the tongue? || Swallowed, almost all is lost on the first pass.
:::

:::mcq
Q: A man on lurasidone takes it at bedtime on an empty stomach and his psychosis returns. The best explanation is:
- Lurasidone does not work
- *Absorption is much lower without food, so his levels are too low
- He is a CYP2D6 poor metaboliser
- He has tolerance
> Lurasidone needs a meal.
:::

## 1.2 Distribution, protein binding and the blood-brain barrier [core][beginner]

:::widget figure
{"id": "glia", "focus": ["endfeet", "capillary"]}
:::

### Volume of distribution
The **volume of distribution** (Vd) is an imaginary volume that links the amount of drug in the body to its blood level. A drug that stays in the blood has a small Vd; a drug that spreads into fat and tissues has a large Vd, sometimes many times the body's real volume.

| Medicine | Vd | What it means |
|---|---|---|
| Lithium | Small (body water) | Dehydration concentrates it; dialysis removes it well |
| Most antidepressants and antipsychotics | Large | Mostly in tissues; dialysis removes little in overdose |
| Diazepam | Large, grows with body fat | Longer half-life in older and heavier people |

### Protein binding
Many psychiatric medicines are bound to blood proteins (albumin for acidic drugs such as valproate; alpha-1 acid glycoprotein for many basic drugs). Only the **free** drug crosses into tissues, acts and is cleared. Binding matters most when:
- Albumin is low (malnutrition, liver disease, pregnancy, old age): more free valproate or phenytoin.
- Binding sites saturate at high doses (valproate).
- A lab measures only total levels.

### The blood-brain barrier
Brain capillaries are sealed by tight junctions and lined with pumps. Drugs cross if they are **small, fat-soluble, not charged**, or carried by a transporter. **P-glycoprotein** pumps push some drugs back out: it limits brain entry of paliperidone, risperidone and loperamide. A few brain areas lie **outside** the barrier: the pituitary and the vomiting centre (area postrema), which is why amisulpride (poor brain entry) still raises prolactin strongly, and why many drugs cause nausea.


:::widget journey
{
 "drug": "Domperidone",
 "target": "dopamine D2 receptors in the gut and in the vomiting trigger zone, which sits outside the barrier",
 "route": "oral",
 "notes": {
  "bbb": "Pumped straight back out by P-glycoprotein, so very little enters the brain. That is the whole point of the drug.",
  "target": "Blocks D2 in the gut and the trigger zone: less nausea and faster stomach emptying, with almost no stiffness or tremor, because the movement circuits are behind the barrier.",
  "blood": "The pituitary also sits outside the barrier, so prolactin can still rise. At high doses it can also lengthen QT."
 },
 "caption": "Compare this journey with haloperidol's earlier in the module. Same receptor, but the barrier decides where it acts and so which side effects follow."
}
:::

:::widget brainmap
{"title": "Inside and outside the barrier", "focus": ["hypothalamus", "brainstem", "prefrontal", "basal-ganglia"], "notes": {"hypothalamus": "The pituitary below it sits outside the blood-brain barrier. Drugs that enter the brain poorly can still block dopamine here and raise prolactin.", "brainstem": "The area postrema (the vomiting centre) is also outside the barrier, so it 'tastes' the blood: many drugs cause early nausea through it.", "prefrontal": "Protected by the barrier. Only drugs that cross reach the targets for mood and thinking.", "basal-ganglia": "Protected too: movement side effects need the drug to have crossed the barrier."}, "caption": "Tap each region. The barrier is not everywhere, and those gaps explain some surprising side effects."}
:::

:::recall
1. What does a large volume of distribution mean? || The drug spreads widely into tissues and fat, not just blood.
2. Which part of a drug in the blood is active? || The free (unbound) part.
3. What makes a drug cross the blood-brain barrier? || Small size, fat solubility, no charge, or a carrier.
4. Why does amisulpride raise prolactin so much? || The pituitary lies outside the barrier, so it sees more drug than the brain.
:::

:::mcq
Q: Haemodialysis removes lithium well but removes little sertraline in overdose. Why?
- Sertraline is more toxic
- *Lithium has a small volume of distribution and no protein binding; sertraline is highly bound and mostly in tissues
- Lithium is metabolised by the liver
- Sertraline is not absorbed
> Dialysis can only clear what is in the blood and free.
:::

## 1.3 Metabolism: the CYP family, inhibitors and inducers [core][beginner]
The liver makes drugs easier to remove in two broad phases:
- **Phase I**: changing the molecule, mostly by **cytochrome P450 (CYP)** enzymes (oxidation).
- **Phase II**: attaching a water-soluble group (glucuronidation by UGT enzymes, sulfation). Lorazepam, oxazepam and lamotrigine are cleared mainly this way.


:::widget compare
{
 "title": "An inhibitor and an inducer",
 "a": {
  "label": "Enzyme inhibitor (fluvoxamine on CYP1A2)",
  "points": [
   "Works within a day or two, as soon as levels build",
   "Partner drug levels rise: clozapine can climb several-fold",
   "Risk: toxicity, such as sedation, seizures, low blood pressure",
   "Reverses quickly once the inhibitor is stopped"
  ],
  "summary": "Fast on, fast off; the danger is too much."
 },
 "b": {
  "label": "Enzyme inducer (carbamazepine, tobacco smoke)",
  "points": [
   "Builds over one to two weeks as new enzyme is made",
   "Partner drug levels fall: the pill, quetiapine, haloperidol",
   "Risk: loss of effect, relapse, an unplanned pregnancy",
   "Takes about as long to wear off after stopping"
  ],
  "summary": "Slow on, slow off; the danger is too little."
 },
 "caption": "Slide between the two. The timing explains why an inhibitor problem shows up in days, while an inducer problem often appears, or reverses, weeks later."
}
:::

### The enzymes to know
| Enzyme | Psychiatric substrates | Strong inhibitors | Inducers |
|---|---|---|---|
| CYP1A2 | Clozapine, olanzapine, duloxetine, agomelatine, caffeine | Fluvoxamine, ciprofloxacin | Tobacco smoke, charred meat |
| CYP2D6 | Paroxetine, fluoxetine, vortioxetine, tricyclics, aripiprazole, risperidone, haloperidol, atomoxetine | Fluoxetine, paroxetine, bupropion, quinidine | None important |
| CYP2C19 | Citalopram, escitalopram, sertraline (part), diazepam, clobazam | Fluvoxamine, omeprazole, fluconazole | Rifampicin, carbamazepine |
| CYP3A4 | Quetiapine, lurasidone, cariprazine, aripiprazole (part), carbamazepine, alprazolam, midazolam, zuranolone | Clarithromycin, ketoconazole, ritonavir, grapefruit | Carbamazepine, rifampicin, phenytoin, St John's wort |

:::widget guess
{"prompt": "When a strong enzyme inducer such as carbamazepine is started, about how many weeks does its full effect on other drugs take to develop?", "min": 0, "max": 8, "unit": "weeks", "answer": [2, 3], "reveal": "About 2 to 3 weeks, because the liver must build new enzyme. The effect also takes a couple of weeks to wear off after the inducer is stopped. Inhibition, by contrast, starts within a day or two of the inhibitor reaching its level.", "clinician": "Induction requires gene transcription (via nuclear receptors such as PXR for CYP3A4, AhR for CYP1A2) and new protein synthesis: onset and offset of 1 to 3 weeks. Reversible inhibition follows the inhibitor's own kinetics; mechanism-based inhibition (paroxetine at CYP2D6, clarithromycin at CYP3A4) lasts until new enzyme is made."}
:::

:::widget decide
{"scene": "Mr Bose, 41, in Kolkata, is well on quetiapine 400 mg for bipolar disorder. A chest physician starts clarithromycin for pneumonia. Two days later his wife finds him very drowsy, dizzy on standing and hard to wake. His blood pressure is low.", "ask": "What happened, and what should be done?", "choices": [{"label": "The pneumonia has made him tired; continue everything", "verdict": "harm", "outcome": "He falls in the night and breaks his wrist.", "why": "Clarithromycin is a strong CYP3A4 inhibitor. Quetiapine levels can rise several times, causing heavy sedation and low blood pressure."}, {"label": "Recognise a CYP3A4 interaction: hold or sharply reduce quetiapine while on clarithromycin, or ask for a non-interacting antibiotic, monitor blood pressure, and restore the usual dose afterwards", "verdict": "best", "outcome": "On a different antibiotic and his usual quetiapine dose, he recovers from pneumonia without further problems.", "why": "Knowing which enzyme clears a drug lets you predict and prevent the interaction."}, {"label": "Stop quetiapine permanently", "verdict": "ok", "outcome": "The sedation settles, but he becomes hypomanic a month later.", "why": "The interaction was temporary; stopping a stabilising medicine has its own risk."}]}
:::

:::widget sort
{"prompt": "Inhibitor or inducer?", "buckets": ["Inhibitor (raises other drugs)", "Inducer (lowers other drugs)"], "items": [{"text": "Fluvoxamine", "bucket": 0}, {"text": "Tobacco smoke", "bucket": 1}, {"text": "Carbamazepine", "bucket": 1}, {"text": "Paroxetine", "bucket": 0}, {"text": "Rifampicin", "bucket": 1, "why": "Very important in India, where tuberculosis treatment is common."}, {"text": "Clarithromycin", "bucket": 0}, {"text": "Bupropion", "bucket": 0}, {"text": "St John's wort", "bucket": 1}]}
:::

:::recall
1. What do Phase I and Phase II metabolism do? || Phase I changes the molecule (mostly CYP); Phase II attaches a water-soluble group (such as glucuronide).
2. Name the enzyme induced by smoking and two drugs affected. || CYP1A2; clozapine and olanzapine.
3. Name three strong CYP2D6 inhibitors. || Fluoxetine, paroxetine, bupropion.
4. How long does enzyme induction take to develop? || Weeks, because new enzyme must be made.
:::

:::mcq
Q: A woman on clozapine starts fluvoxamine for OCD. The most likely result is:
- Clozapine levels fall
- *Clozapine levels rise several-fold
- No change
- Fluvoxamine levels fall
> Fluvoxamine strongly inhibits CYP1A2.
:::

## 1.4 Excretion, clearance and half-life maths [core][beginner]
### Clearance
**Clearance** (CL) is the volume of blood cleared of drug per unit time. The kidneys clear water-soluble drugs and metabolites; the liver clears fat-soluble ones by metabolism and bile.

### The three formulas worth knowing
| Formula | What it tells you |
|---|---|
| Half-life = 0.693 × Vd ÷ CL | Half-life rises when Vd grows or clearance falls |
| Steady-state level = dosing rate ÷ CL | Halve the clearance and the steady level doubles |
| Time to steady state = about 4 to 5 half-lives | Independent of the dose |

:::widget worked
{"title": "Using clearance and half-life", "steps": [{"q": "Lithium's clearance in a young adult is normal and her level is 0.6 mmol/L. At 75 her kidney function has halved and the dose is unchanged. What happens to her level?", "a": "Steady level = dosing rate ÷ clearance. Halving clearance **doubles** the level to about 1.2 mmol/L: near toxicity."}, {"q": "What happens to the half-life?", "a": "Half-life = 0.693 × Vd ÷ CL. With clearance halved, the half-life roughly **doubles**, so she also takes twice as long to reach the new steady level."}, {"q": "An older man has more body fat. How does that change diazepam's half-life?", "a": "Diazepam is fat-soluble, so Vd rises; with similar clearance, the **half-life lengthens**, so it builds up and its effects last longer."}], "yourTurn": [{"q": "A drug's half-life is 24 hours. A CYP inhibitor halves its clearance. What is the new half-life, and how long until the new steady level?", "a": "About 48 hours; 4 to 5 half-lives is about 8 to 10 days."}]}
:::

:::widget curve
{"kind": "half-life", "title": "Change the half-life, change the wait", "caption": "Double the half-life and the steady level is reached later, and the peaks and troughs flatten. Picture this for an older adult whose kidneys or liver have slowed."}
:::

:::recall
1. Write the half-life formula. || Half-life = 0.693 × volume of distribution ÷ clearance.
2. What happens to the steady-state level if clearance halves? || It doubles.
3. Does the dose change the time to steady state? || No; only the half-life does.
:::

:::mcq
Q: A patient's dose is doubled. With linear kinetics, the time to reach the new steady state is:
- Halved
- *Unchanged, about 4 to 5 half-lives
- Doubled
- Instant
> Time to steady state depends only on half-life.
:::

## 1.5 Loading doses and therapeutic drug monitoring [core][beginner]
### Loading doses
For a drug with a long half-life, waiting 4 to 5 half-lives for steady state may be too slow. A **loading dose** fills the volume of distribution quickly:
- Loading dose = target level × Vd ÷ F.
- Maintenance dose rate = target level × CL ÷ F.

Examples: valproate loading (about 20 mg/kg) in acute mania; paliperidone palmitate's two deltoid injections a week apart; aripiprazole monthly's two-injection start.


:::widget curve
{
 "kind": "half-life",
 "title": "Why a loading dose saves time",
 "caption": "Set a long half-life and give the same dose each day: the level creeps up and takes four to five half-lives to settle. A loading dose is the shortcut: one larger first dose fills the body's volume straight to the target, and ordinary doses then simply keep it there."
}
:::

### Therapeutic drug monitoring (TDM)
TDM means measuring a drug level to guide the dose. It is most useful when:
- The therapeutic range is narrow (lithium).
- Levels vary a lot between people for the same dose (clozapine, tricyclics).
- Toxicity is hard to tell from illness.
- Adherence is in doubt.

| Drug | When to sample | Approximate useful range |
|---|---|---|
| Lithium | 12 hours after the last dose, 5 to 7 days after a change | 0.6 to 0.8 mmol/L maintenance |
| Clozapine | Trough, at steady state | At least 350 ng/mL |
| Valproate | Trough | 50 to 100 mg/L (rough guide) |
| Carbamazepine | Trough, after auto-induction | 4 to 12 mg/L |
| Nortriptyline | Trough | A therapeutic window: too high can be less effective |

:::widget decide
{"scene": "Mr Rao, 48, in Hyderabad, takes clozapine 400 mg and is still hearing voices after many months. The team plans to add a second antipsychotic. No one has checked a clozapine level. He smokes 30 cigarettes a day and drinks a lot of coffee.", "ask": "What is the best next step?", "choices": [{"label": "Add amisulpride straight away", "verdict": "ok", "outcome": "It helps a little, but he becomes stiff and his prolactin rises.", "why": "Augmentation is a reasonable later step, but the commonest cause of clozapine non-response is a low level."}, {"label": "Check a trough clozapine level first; if low (as is likely in a heavy smoker), raise the dose in steps and recheck before adding anything", "verdict": "best", "outcome": "His level is 180 ng/mL. At 550 mg his level is 410 and the voices fade over the following months.", "why": "Smoking induces CYP1A2. TDM showed the problem was kinetic, not clozapine failure."}, {"label": "Stop clozapine: it has failed", "verdict": "harm", "outcome": "He relapses badly.", "why": "Clozapine had not been given a fair trial at an adequate level."}]}
:::

:::recall
1. What does a loading dose do? || Fills the volume of distribution quickly so the target level is reached early.
2. Give the loading dose formula. || Target level × Vd ÷ F.
3. Name four drugs where TDM is useful. || Lithium, clozapine, valproate, carbamazepine (also nortriptyline).
4. When is a lithium level taken? || 12 hours after the last dose, 5 to 7 days after a change.
:::

:::mcq
Q: Why is a level drawn 2 hours after a dose misleading for most drugs?
- The lab cannot measure it
- *It catches the peak, not the trough the reference range is based on
- It is always too low
- Drugs are not absorbed in 2 hours
> Ranges are set for trough samples.
:::

## 1.6 Special populations [core][beginner]
| Group | What changes | Practical consequences |
|---|---|---|
| Children | Faster liver metabolism per kg; different body water | May need relatively higher doses per kg; more activation with SSRIs |
| Older adults | Lower kidney clearance, more body fat, less albumin, more sensitive brain | Start low, go slow; lithium and benzodiazepines build up; anticholinergic sensitivity |
| Pregnancy | Larger blood volume, faster kidney clearance, CYP2D6 and 3A4 up, CYP1A2 down, UGT up | Lithium and lamotrigine levels fall, then rise sharply after delivery; clozapine levels can rise |
| Liver disease | Less CYP metabolism and protein; portal blood bypasses the liver | Lower doses; prefer lorazepam or oxazepam; avoid duloxetine and agomelatine |
| Kidney disease | Lower clearance of renally cleared drugs | Reduce lithium, paliperidone, amisulpride, pregabalin, gabapentin, desvenlafaxine |
| Smoking | CYP1A2 induced | Higher clozapine and olanzapine doses; watch when stopping |
| Obesity | Larger Vd for fat-soluble drugs | Longer half-life of diazepam; loading doses by weight |

:::widget compare
{
 "title": "The same tablet at 25 and at 80",
 "a": {
  "label": "Aged 25",
  "points": [
   "Kidneys clear lithium and paliperidone briskly",
   "Liver enzymes work at full speed",
   "More water and muscle, less fat",
   "Brain tolerates sedation and anticholinergic load"
  ],
  "summary": "Usual adult doses usually fit."
 },
 "b": {
  "label": "Aged 80",
  "points": [
   "Kidney clearance often halved: lithium builds up",
   "Some liver pathways slow, especially for diazepam",
   "More fat: fat-soluble drugs linger longer",
   "Brain more sensitive: falls, confusion and delirium"
  ],
  "summary": "Start low, go slow, review often."
 },
 "caption": "Slide from young to old. Each change on its own is modest, but together they explain why older adults need lower doses and fewer medicines."
}
:::


:::widget decide
{"scene": "Mrs Krishnan, 82, in Chennai, has depression and poor sleep. She has mild kidney impairment. Her current list: amitriptyline 25 mg at night, diazepam 5 mg at night, chlorpheniramine for an itchy rash, and a bladder tablet (oxybutynin). She has become forgetful, unsteady and constipated.", "ask": "How do you apply pharmacokinetics and pharmacodynamics here?", "choices": [{"label": "Add a memory medicine for dementia", "verdict": "harm", "outcome": "Her confusion continues and she falls.", "why": "The likely cause is drug burden in an older body, not dementia."}, {"label": "Recognise high anticholinergic and sedative burden plus slower clearance with age: taper diazepam slowly, stop chlorpheniramine and oxybutynin where possible, switch amitriptyline to sertraline or mirtazapine at a low dose, and review again", "verdict": "best", "outcome": "Over six weeks her memory, balance and bowels improve, and her mood lifts.", "why": "Older people clear diazepam slowly (more fat, longer half-life) and are very sensitive to anticholinergic drugs; removing the burden treats the problem."}, {"label": "Stop every medicine today", "verdict": "harm", "outcome": "She has rebound insomnia, anxiety and a withdrawal seizure from the diazepam.", "why": "Benzodiazepines must be tapered, even when they are part of the problem."}]}
:::

:::widget decide
{"scene": "Fatima, 28, in Bhopal, has bipolar II disorder well controlled on lamotrigine 200 mg. She is now in the third trimester and over the past month her low mood has returned. No one has changed her dose.", "ask": "What is the likely reason, and what should be planned?", "choices": [{"label": "Lamotrigine has stopped working; switch to valproate", "verdict": "harm", "outcome": "Valproate exposes the baby to serious risks, and the switch itself destabilises her.", "why": "Valproate is avoided in pregnancy, and the problem is kinetic."}, {"label": "Pregnancy speeds up lamotrigine clearance, so her level has fallen. Check a level if available, raise the dose step by step, and plan to reduce it promptly after delivery, when clearance falls back", "verdict": "best", "outcome": "On a higher dose her mood recovers. Her dose is reduced in the days after delivery and she avoids toxicity.", "why": "Glucuronidation rises in pregnancy and falls quickly after birth. Planning both changes protects her."}, {"label": "Do nothing until the baby is born", "verdict": "harm", "outcome": "Her depression deepens in the last weeks of pregnancy.", "why": "Untreated depression in late pregnancy harms mother and baby."}]}
:::

:::recall
1. Name three kinetic changes in older adults. || Lower kidney clearance, more body fat, less albumin (also more sensitive brain).
2. What happens to lamotrigine levels in pregnancy and after delivery? || They fall in pregnancy and rise quickly after delivery.
3. Which benzodiazepines are preferred in liver disease? || Lorazepam and oxazepam.
4. Name three drugs to reduce in kidney disease. || Lithium, paliperidone, amisulpride (also pregabalin, gabapentin, desvenlafaxine).
:::

:::mcq
Q: Which change in pregnancy can raise clozapine levels?
- Faster kidney clearance
- *Reduced CYP1A2 activity
- More albumin
- Induced CYP2D6
> CYP1A2 activity falls in pregnancy.
:::

## 1.7 Level check · Beginner [beginner]
Twelve or more right out of fifteen (80%) opens the Advanced level.

:::mcq
Q: Bioavailability is:
- The time to peak level
- *The fraction of a dose reaching the circulation unchanged
- The half-life
- The protein-bound fraction
> IV is 100% by definition.

Q: Which drug must be taken with a meal for good absorption?
- Escitalopram
- *Lurasidone
- Lithium
- Sertraline
> At least 350 kcal.

Q: A large volume of distribution means a drug:
- Stays in the blood
- *Spreads widely into tissues
- Is quickly excreted
- Cannot cross into the brain
> Dialysis removes little.

Q: Only this part of a drug in the blood is active:
- The protein-bound part
- *The free part
- The metabolite only
- The red cell part
> Free drug crosses and acts.

Q: Which brain area lies outside the blood-brain barrier?
- Prefrontal cortex
- Hippocampus
- *Pituitary
- Striatum
> Explains prolactin rise with amisulpride.

Q: Tobacco smoke induces:
- CYP2D6
- *CYP1A2
- CYP2C19
- UGT only
> Clozapine and olanzapine levels fall.

Q: Which is a strong CYP2D6 inhibitor?
- Sertraline at low dose
- *Paroxetine
- Mirtazapine
- Lithium
> Also fluoxetine and bupropion.

Q: Rifampicin added to quetiapine will:
- Raise quetiapine levels
- *Lower quetiapine levels sharply
- Not affect it
- Cause serotonin syndrome
> Strong CYP3A4 induction.

Q: Induction of liver enzymes typically takes:
- Minutes
- Hours
- *Weeks
- Years
> New enzyme must be made.

Q: If clearance halves and the dose stays the same, the steady-state level:
- Halves
- Stays the same
- *Doubles
- Falls to zero
> Steady level = dose rate ÷ clearance.

Q: Half-life equals 0.693 multiplied by:
- Dose ÷ clearance
- *Volume of distribution ÷ clearance
- Clearance ÷ volume
- Bioavailability ÷ dose
> Larger Vd or lower clearance lengthens half-life.

Q: A loading dose is used to:
- Reduce side effects
- *Reach the target level quickly
- Lengthen the half-life
- Avoid TDM
> Fills the volume of distribution.

Q: A clozapine level is most useful when:
- The patient is well with no concerns
- *Response is poor, toxicity is suspected, or smoking changes
- Every day
- Never
> TDM targets specific questions.

Q: In liver disease, the preferred benzodiazepine is:
- Diazepam
- Chlordiazepoxide
- *Lorazepam
- Alprazolam
> Glucuronidation is preserved.

Q: Which drug needs dose reduction in kidney disease?
- Olanzapine
- *Paliperidone
- Sertraline
- Mirtazapine at low dose
> Mostly excreted unchanged by the kidneys.
:::
`;

export const text = p1 + advanced + examZone;
