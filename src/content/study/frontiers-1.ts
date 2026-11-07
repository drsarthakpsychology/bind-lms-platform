/* Module · What's new in psychiatry, Parts I and II (Starting and Beginner). Status checked November 2026. Original text written for VIBHA School of Psychology. */
export const part1 = String.raw`
# Part I · Starting: how to read "new"

## 1.1 How a new treatment becomes real [core][starting]
Every few months a headline announces a "breakthrough" for depression or schizophrenia. Most never reach patients. This module looks at what is genuinely new in psychiatry, **with an honest status label for each**, as of **November 2026**. First you need the map that every new treatment travels.

### The pipeline
| Stage | What happens | The question it answers |
|---|---|---|
| **Preclinical** | Cells and animals | Could it work? Is it obviously toxic? |
| **Phase 1** | A small number of healthy volunteers or patients | Is it safe? What dose? |
| **Phase 2** | A few hundred patients, often against placebo | Is there a signal that it works? |
| **Phase 3** | Large trials, usually two or more | Does it work reliably, and is it safe enough? |
| **Regulatory review** | A regulator weighs the whole file | Do benefits outweigh risks? |
| **Phase 4 (after approval)** | Real-world use, safety monitoring | Are there rare harms? Who benefits most? |

:::widget flow
{
  "title": "The road every new medicine travels",
  "layout": "chain",
  "nodes": [
    { "id": "pre", "label": "Preclinical", "detail": "Cells and animals. Most candidates stop here: they do not work, or they are toxic." },
    { "id": "p1", "label": "Phase 1", "detail": "Tens of people. Safety, dose, how the body handles the drug." },
    { "id": "p2", "label": "Phase 2", "detail": "A few hundred patients, often against placebo. Is there a signal? The biggest drop-out point in psychiatry." },
    { "id": "p3", "label": "Phase 3", "detail": "Large confirmatory trials, usually two or more. Reliable benefit and enough safety data." },
    { "id": "rev", "label": "Regulatory review", "detail": "FDA, EMA, MHRA or, in India, the CDSCO weighs benefits against risks. It can approve, restrict or say 'not yet'." },
    { "id": "p4", "label": "Phase 4", "detail": "After approval: real-world use, rare harms, who benefits most. Some drugs gain warnings here; a few are withdrawn." }
  ],
  "edgeLabels": { "p2>p3": "most fail here", "p3>rev": "file submitted" },
  "caption": "Press Play. Each step answers a different question, and a headline can come from any of them."
}
:::

The regulators you will hear about: the **FDA** (United States), the **EMA** (European Union), the **MHRA** (United Kingdom), and in India the **CDSCO**, headed by the Drugs Controller General of India. A drug approved in the USA is **not automatically available in India**.

:::define Words that sound like approval but are not
- **Breakthrough therapy designation**: the FDA agrees to give extra guidance because early results look promising. It is not approval.
- **Fast track, priority review, rolling submission**: ways to speed up the paperwork. Not approval.
- **Topline results**: the company's first summary of a trial, before full peer-reviewed publication.
- **Complete response letter**: the FDA's formal "not yet", explaining what is missing.
:::

:::widget guess
{
  "prompt": "Of all drugs for psychiatric conditions that enter phase 1 testing in humans, roughly what percentage eventually win approval?",
  "min": 0,
  "max": 60,
  "unit": "%",
  "answer": [4, 10],
  "reveal": "Only about one in fifteen. Psychiatry has one of the lowest success rates of any field, partly because placebo responses are large and our measures are noisy.",
  "clinician": "Industry analyses of clinical development success rates (for example a large analysis of development programmes from 2011 to 2020) put the likelihood of approval from phase 1 for psychiatric indications at roughly 6 to 8%, below the all-indication average of about 8%, with the largest attrition at phase 2."
}
:::

:::widget sort
{
  "prompt": "Which phrases mean the treatment is actually approved, and which do not?",
  "buckets": ["Approved for use", "Not approval"],
  "items": [
    { "text": "“Granted breakthrough therapy designation”", "bucket": 1 },
    { "text": "“The FDA approved the drug for adults with schizophrenia”", "bucket": 0 },
    { "text": "“Positive topline results from a phase 3 trial”", "bucket": 1, "why": "Positive results are a step towards approval, not approval." },
    { "text": "“The regulator issued a complete response letter”", "bucket": 1, "why": "That is a rejection with reasons." },
    { "text": "“Rolling submission accepted”", "bucket": 1 },
    { "text": "“Marketing authorisation granted by the EMA”", "bucket": 0 }
  ]
}
:::

:::clinician
When reading a new-treatment claim, check five things: (1) the registry entry (ClinicalTrials.gov or CTRI for Indian trials) and whether the primary outcome matches the publication; (2) the comparator (placebo, active drug, waitlist); (3) blinding integrity, especially for drugs with obvious subjective effects; (4) absolute effect sizes and confidence intervals rather than p-values; (5) independence: sponsor-run versus independent replication. In India, new drugs approved abroad may be granted a waiver of local clinical trials under the New Drugs and Clinical Trials Rules, 2019, for certain categories, but marketing still requires CDSCO approval.
:::

:::recall
1. Name the phases of drug development and the question each answers. || Phase 1 safety and dose; phase 2 signal of efficacy; phase 3 reliable efficacy and safety; phase 4 real-world and rare harms.
2. Which body approves new drugs in India? || The CDSCO, headed by the Drugs Controller General of India.
3. Give three phrases that sound like approval but are not. || Breakthrough therapy designation, fast track or priority review, positive topline results (also rolling submission).
:::

:::mcq
Q: A news report says a new depression drug "received breakthrough therapy designation". This means:
- It is now available in pharmacies
- *The regulator will give extra guidance because early results look promising; it is not approved
- It has passed phase 3
- It is approved in India
> Designation speeds development but is not approval.
:::

## 1.2 Reading the evidence: effect sizes, placebo and blinding [core][starting]
To judge any new treatment you need four ideas.

### 1. Effect size: how big is the difference?
A trial can be "statistically significant" and still show a **tiny** difference. Look for:
- **Mean difference** on a rating scale (for depression, the MADRS runs from 0 to 60; a difference of 2 points is small; 6 points is large for psychiatry).
- **Standardised effect size** (Cohen's d): about 0.2 is small, 0.5 medium, 0.8 large. Most antidepressants versus placebo are around 0.3.
- **Number needed to treat (NNT)**: how many people must be treated for one extra person to benefit.

### 2. Placebo response is large in psychiatry
In depression trials, many people on placebo improve substantially, through hope, attention, natural recovery and regression to the mean. A new drug must beat that.

### 3. Blinding can break
If a drug has **obvious effects** (a psychedelic experience, dissociation, sedation), patients and raters can **guess** who got the real thing. This "**functional unblinding**" inflates expectations and can make the drug look better than it is.

### 4. Publication bias and the file drawer
Positive studies are published more often and faster. Negative studies may sit in a drawer. Pre-registration and trial registries help us find them.

:::widget decide
{
  "scene": "A headline reads: “New pill cures depression in days! 70% of patients improved.” The trial had 40 people, no placebo group, and was run by the company.",
  "ask": "What is the most accurate response?",
  "choices": [
    { "label": "Start recommending it; 70% is very high", "verdict": "harm", "outcome": "People pay for an unproven pill and delay treatments that work.", "why": "Without a placebo group, you cannot tell drug effect from placebo response and natural recovery, which can be as high in depression." },
    { "label": "Note it as an early, uncontrolled signal; wait for randomised, placebo-controlled trials and independent replication", "verdict": "best", "outcome": "Two years later the controlled trial shows a small difference. The early hype was mostly placebo.", "why": "Small, open, sponsor-run studies are where ideas start, not where they are proven." },
    { "label": "Dismiss it completely because a company ran it", "verdict": "ok", "outcome": "You are right to be cautious, but company trials are how most medicines reach patients.", "why": "Sponsorship is a reason for scrutiny, not automatic rejection. Judge the design." }
  ]
}
:::

:::widget guess
{
  "prompt": "In typical antidepressant trials, roughly what percentage of people on placebo meet the 'response' threshold (about a halving of symptoms)?",
  "min": 0,
  "max": 80,
  "unit": "%",
  "answer": [30, 45],
  "reveal": "Roughly a third or more. That is why a single uncontrolled study claiming that most people improved tells you very little.",
  "clinician": "Placebo response rates in modern antidepressant RCTs commonly fall in the 30 to 40% range and have risen over decades; drug-placebo differences in response are usually around 10 to 15 percentage points (NNT roughly 6 to 9). A large 2018 network meta-analysis of 21 antidepressants found every one more effective than placebo, with modest differences between them."
}
:::

:::student
A simple habit: whenever you hear "X% improved", ask "**compared with what?**" If there is no comparison group, the number is almost meaningless.
:::

:::clinician
Additional pitfalls for frontier claims: surrogate outcomes (biomarker change without clinical change), outcome switching, enrichment designs that pre-select responders, short follow-up for chronic conditions, and the "decline effect", in which effect sizes shrink as studies get larger and more rigorous. Expectancy is a special problem for psychedelics, because many participants have strong prior beliefs and media exposure; guess-the-arm questionnaires and active placebos (low-dose psilocybin, niacin, methylphenidate) are partial solutions.
:::

:::recall
1. What is an NNT? || Number needed to treat: how many people must be treated for one extra person to benefit.
2. Give rough cut-offs for small, medium and large Cohen's d. || About 0.2, 0.5 and 0.8.
3. What is functional unblinding? || When obvious drug effects let participants or raters guess the treatment arm, inflating apparent benefit.
4. What is publication bias? || Positive studies are more likely to be published than negative ones, distorting the evidence.
:::

:::mcq
Q: A psilocybin trial reports that almost all participants correctly guessed whether they had received psilocybin or placebo. The main concern is:
- The dose was too low
- *Functional unblinding, which may inflate the measured benefit through expectancy
- The trial was too large
- Psilocybin is illegal
> When people know their arm, expectancy can drive results.

Q: A drug lowers depression scores by 1.5 points more than placebo on a 60-point scale, with a p-value well below 0.05 in a huge trial. The best summary is:
- A large, important effect
- *Statistically significant but clinically small
- Not significant
- Proof of a cure
> Large samples can make tiny differences significant.
:::

## 1.3 The frontier at a glance: a status board [core][starting]
Here is the whole module on one board. Each item gets one of five honest labels.

| Label | Meaning |
|---|---|
| **Approved** | Licensed by a major regulator for a specific use |
| **Promising, in late trials** | Positive large trials, not yet approved |
| **Mixed** | Some good evidence, some failures, or approved but limited |
| **Research only** | Interesting science, no routine clinical use yet |
| **Not established** | Claims exceed evidence; should not be used or believed |

:::widget layers
{
  "title": "The five status labels, from strongest to weakest",
  "shape": "stack",
  "layers": [
    { "label": "Approved", "detail": "Licensed by a major regulator for a named use. Example: esketamine nasal spray for treatment-resistant depression. Approval in one country does not mean approval in India." },
    { "label": "Promising, in late trials", "detail": "Positive large trials, not yet licensed. Example: psilocybin (COMP360) for treatment-resistant depression." },
    { "label": "Mixed", "detail": "Some good evidence, some failures, or licensed but with limits. Example: pharmacogenomic panels; GLP-1 medicines for addiction." },
    { "label": "Research only", "detail": "Interesting science, no routine use. Example: anti-inflammatory treatment for depression; computational tests." },
    { "label": "Not established", "detail": "The claim runs ahead of the evidence. Example: psychokinesis." }
  ],
  "caption": "Tap each level. Every claim in this module is given one of these labels, with a date."
}
:::

| Topic | Status (as of Nov 2026) |
|---|---|
| Esketamine nasal spray for treatment-resistant depression | **Approved** (USA, Europe and others) |
| Ketamine infusions for depression | **Mixed**: evidence of rapid effect, used off-label, not licensed for depression |
| MDMA-assisted therapy for PTSD | **Not approved**: FDA declined in August 2024; more trials needed |
| Psilocybin for treatment-resistant depression (COMP360) | **Promising, in late trials**: two positive phase 3 trials; US application being filed |
| Xanomeline-trospium (Cobenfy) for schizophrenia | **Approved** in the USA in September 2024; failed as an add-on trial |
| Zuranolone for postpartum depression | **Approved** in the USA for postpartum depression only |
| GLP-1 medicines and mental health | **Mixed**: no suicide signal found; early trials for alcohol use are promising |
| Inflammation-targeted treatments for depression | **Research only**, except autoimmune encephalitis |
| Pharmacogenomic testing | **Mixed**: a few gene tests are essential; broad panels are oversold |
| HiTOP and RDoC | **Research frameworks**, influencing the next DSM |
| AI chatbots for therapy | **Mixed to unproven**: one promising trial, real safety concerns |
| Psychokinesis | **Not established** |

:::widget sort
{
  "prompt": "Without looking back at the board, give each treatment its status.",
  "buckets": ["Approved", "Promising or mixed", "Not established"],
  "items": [
    { "text": "Esketamine nasal spray for treatment-resistant depression", "bucket": 0 },
    { "text": "Psilocybin (COMP360) for treatment-resistant depression", "bucket": 1 },
    { "text": "Moving objects with the mind (psychokinesis)", "bucket": 2 },
    { "text": "Xanomeline-trospium for schizophrenia (USA)", "bucket": 0 },
    { "text": "MDMA-assisted therapy for PTSD", "bucket": 1, "why": "Positive trials, but rejected by the FDA for now; more evidence needed. Not approved." },
    { "text": "Semaglutide for alcohol use disorder", "bucket": 1 },
    { "text": "Zuranolone for postpartum depression (USA)", "bucket": 0 }
  ]
}
:::

:::note Dates matter
Everything in this module is dated. Treatments get approved, withdrawn and re-evaluated. If you read this after **late 2026**, check the latest status with the regulator's website, not a news site.
:::

:::recall
1. Name the five status labels used in this module. || Approved; promising in late trials; mixed; research only; not established.
2. Which two newer treatments in this module are approved in the USA for psychiatric conditions? || Esketamine nasal spray (TRD), xanomeline-trospium (schizophrenia); also zuranolone for postpartum depression.
3. What is the status of psychokinesis? || Not established.
:::

:::mcq
Q: As of November 2026, which statement about MDMA-assisted therapy for PTSD is correct?
- It is approved by the FDA
- *The FDA declined approval in August 2024 and asked for more evidence
- It was never tested in phase 3 trials
- It is approved in India
> Two phase 3 trials were positive, but the FDA issued a complete response letter.
:::

## 1.4 Level check · Starting [core][starting]
Score 80% or more to open the Beginner level.

:::mcq
Q: Which trial phase first tests whether a drug works in a large number of patients reliably enough for approval?
- Phase 1
- Phase 2
- *Phase 3
- Phase 4
> Phase 3 trials are the large confirmatory studies.

Q: Phase 4 studies mainly look for:
- The first safe dose
- *Real-world effects and rare harms after approval
- Animal toxicity
- Breakthrough designation
> Post-marketing surveillance.

Q: In India, the body that approves new drugs is:
- The FDA
- The EMA
- *The CDSCO
- The Medical Council of India
> Central Drugs Standard Control Organisation.

Q: A "complete response letter" from the FDA means:
- Final approval
- *The application is not approved yet, with reasons
- The drug is banned worldwide
- Phase 1 can begin
> The FDA's formal "not yet".

Q: "Topline results" are:
- Final peer-reviewed results
- *A company's first summary of trial results, before full publication
- Results from animals
- Regulator's decision
> Early, sponsor-reported headline numbers.

Q: A Cohen's d of about 0.3 is:
- Large
- *Small to modest
- Zero
- Impossible in psychiatry
> Typical of antidepressants versus placebo.

Q: An NNT of 8 means:
- 8% of people improve
- *Eight people must be treated for one extra person to benefit
- The drug works in 8 days
- Eight trials were done
> Number needed to treat.

Q: Why must new depression treatments be compared with placebo?
- Placebo is always harmful
- *Many people improve on placebo through hope, attention and natural recovery
- Regulators dislike active comparators
- Placebo is a standard treatment
> Placebo response is large in depression.

Q: Functional unblinding is a particular problem for drugs that:
- Have no side effects
- *Produce obvious subjective effects, such as psychedelics or ketamine
- Are given as injections
- Are cheap
> People can tell which arm they are in.

Q: Publication bias makes treatments look:
- Worse than they are
- *Better than they are
- Exactly as they are
- More dangerous
> Positive studies get published more.

Q: Which of these is approved in the USA for treatment-resistant depression?
- Psilocybin
- MDMA
- *Esketamine nasal spray
- Psychokinesis
> Esketamine has been approved since 2019.

Q: A small, open-label, company-run study with no control group reports that 80% of patients improved. The best conclusion is:
- The drug is proven
- *It is an early signal that needs controlled, independent trials
- The drug is certainly useless
- It should be approved in India
> Uncontrolled studies cannot separate drug effect from placebo and natural recovery.

Q: The status of psychokinesis in this module is:
- Approved
- Promising
- *Not established
- Research only with strong evidence
> Claims exceed evidence.
:::

# Part II · Beginner: the new treatments

## 2.1 Ketamine and esketamine: fast-acting antidepressants [core][beginner]
Almost every antidepressant works on serotonin or noradrenaline and takes a long time to help. **Ketamine**, an anaesthetic, works on a different system, **glutamate**, and can lift depression and suicidal thinking **within hours** in some people.

### How it is thought to work
- Ketamine **blocks the NMDA receptor**, a gate for glutamate.
- This seems to cause a brief **surge of glutamate** at other receptors (AMPA), which switches on signals (including BDNF) that help **rebuild connections** between neurons.
- **Esketamine** is one half (one mirror-image form) of the ketamine molecule, given as a **nasal spray**.

:::widget flow
{
  "title": "How ketamine is thought to lift mood fast",
  "layout": "chain",
  "nodes": [
    { "id": "block", "label": "NMDA receptors blocked", "detail": "Ketamine plugs the NMDA channel. One leading idea is that it acts first on NMDA receptors of calming (GABA) interneurons." },
    { "id": "dis", "label": "Brakes released", "detail": "With the interneurons quieter, the main glutamate neurons fire more: disinhibition." },
    { "id": "surge", "label": "Glutamate surge", "detail": "A brief burst of glutamate in the prefrontal cortex." },
    { "id": "ampa", "label": "AMPA receptors activated", "detail": "The glutamate acts on AMPA receptors, which are not blocked." },
    { "id": "bdnf", "label": "BDNF and mTOR signalling", "detail": "Growth signals switch on inside the neuron." },
    { "id": "syn", "label": "New synapses within hours", "detail": "Dendritic spines and connections lost in chronic stress begin to regrow. This may be why mood can lift in hours, and why the effect fades unless repeated." }
  ],
  "caption": "Press Play. This is the leading hypothesis, not settled fact; other routes (including the opioid system) have been proposed."
}
:::

:::widget receptor
{
  "receptor": "NMDA",
  "title": "Ketamine at the NMDA receptor",
  "caption": "Ketamine acts as an antagonist here: it blocks the channel so glutamate cannot switch it on. Try the antagonist, then compare with glutamate itself (full agonist)."
}
:::

:::widget journey
{
  "drug": "esketamine and ketamine",
  "target": "NMDA receptors on neurons in the prefrontal cortex and hippocampus",
  "routes": ["nasal", "iv"],
  "notes": {
    "nose": "Esketamine is sprayed into each nostril, under supervision in a clinic. It is absorbed through the nasal lining, skipping the gut and much of the liver's first pass.",
    "vein": "Racemic ketamine for depression is usually infused into a vein slowly over about 40 minutes, off-label, in a monitored setting.",
    "blood": "Levels rise within minutes. Blood pressure rises too, which is why it is checked before and after each dose.",
    "out": "Ketamine is broken down by the liver (mainly CYP3A4 and CYP2B6) to norketamine and other metabolites. Levels fall within hours, though the mood effect can outlast the drug for days."
  },
  "caption": "Switch between nasal and IV. Fast arrival explains both the quick effect and the need to observe the patient after each dose."
}
:::

:::widget guess
{
  "prompt": "In trials of a single dose of ketamine for depression, how soon after the dose do symptoms start to improve in people who respond?",
  "min": 1,
  "max": 72,
  "unit": "hours",
  "answer": [2, 24],
  "reveal": "Within hours to a day. That speed is what made ketamine exciting. The catch: the effect of one dose usually fades within days, so repeated treatment is needed.",
  "clinician": "Antidepressant effects emerge within about 2 to 24 hours after an infusion (0.5 mg/kg over 40 minutes in most trials), peak around 24 hours, and commonly wane within about a week. Esketamine is given twice weekly during induction for the first month, then weekly or every other week."
}
:::

### Where it stands (as of Nov 2026)
| Product | Status |
|---|---|
| **Esketamine nasal spray** (Spravato) | FDA approved in 2019 for treatment-resistant depression with an oral antidepressant; in 2020 for depression with acute suicidal thoughts; in January 2025 as a **stand-alone** treatment for treatment-resistant depression. Approved in Europe and elsewhere. Availability in India has been limited; check the current situation |
| **Racemic ketamine infusion** | Not licensed for depression anywhere major; used **off-label** in specialist centres worldwide, including some Indian hospitals |
| **Oral or "home" ketamine** from online clinics | Poorly regulated; risks of misuse and unsupervised dissociation |

:::widget decide
{
  "scene": "Mr Rao, 52, from Visakhapatnam, has failed three antidepressants. He has read about ketamine and asks for an infusion “today, to fix it once and for all”. He drinks heavily most nights and has uncontrolled high blood pressure.",
  "ask": "What is the most appropriate response?",
  "choices": [
    { "label": "Arrange an infusion today; he has treatment-resistant depression", "verdict": "harm", "outcome": "His blood pressure spikes during the infusion, and the session has to be stopped.", "why": "Ketamine raises blood pressure and has misuse potential. Uncontrolled hypertension and heavy alcohol use need addressing first." },
    { "label": "Explain that ketamine can work fast but its effect fades without repeated sessions; treat the blood pressure and alcohol use, review the past trials, and consider all options including ECT", "verdict": "best", "outcome": "He agrees to start with alcohol treatment and blood pressure control; a ketamine or ECT referral stays on the table.", "why": "Rapid-acting does not mean 'one and done'. Safety screening and a full plan come first." },
    { "label": "Tell him ketamine is a street drug and never used in medicine", "verdict": "ok", "outcome": "He looks it up, finds that you are wrong, and loses trust.", "why": "Ketamine is a medical drug with a real evidence base; dismissing it is inaccurate." }
  ]
}
:::

### Side effects you must know
- **Dissociation** (feeling detached, unreal), dizziness, nausea, sedation, usually settling within hours.
- **Raised blood pressure** during treatment.
- **Misuse potential**: ketamine is used recreationally; long-term heavy use damages the **bladder** (ketamine cystitis).
- For esketamine, patients are **watched in the clinic after each dose** and must not drive that day.

:::clinician
Evidence: a small 2006 placebo-controlled trial showed rapid response to a single infusion; meta-analyses confirm large short-term effects against saline and smaller effects against active placebo (midazolam). Esketamine's phase 3 programme (TRANSFORM-1 to -3, SUSTAIN-1) had mixed individual results; approval rested on TRANSFORM-2 plus a relapse-prevention trial, a point of criticism raised in 2019. ESCAPE-TRD (2023) found esketamine superior to quetiapine augmentation on remission at the 8-week assessment. ELEKT-D (2023) found IV ketamine non-inferior to ECT for non-psychotic TRD in outpatients, though ECT may be better for severe and psychotic depression and inpatients. US prescribing requires a REMS programme with at least two hours of post-dose observation. Mechanism remains debated: NMDA blockade, AMPA throughput, mTOR and BDNF signalling, and possibly opioid-system involvement (an early naltrexone-blockade study suggested this; later studies conflicted).
:::

:::recall
1. Which receptor does ketamine block? || The NMDA glutamate receptor.
2. What is esketamine? || One mirror-image form of ketamine, given as a nasal spray.
3. Give three key side effects of ketamine or esketamine. || Dissociation, raised blood pressure, misuse potential (also sedation, nausea, bladder damage with heavy use).
4. What changed for esketamine in the USA in January 2025? || It was approved as a stand-alone treatment for treatment-resistant depression.
:::

:::mcq
Q: Which statement about ketamine for depression is correct?
- It acts on serotonin reuptake
- *It can act within hours, but the effect of one dose usually fades, so repeated treatment is needed
- It is licensed in India as an oral daily antidepressant
- It has no misuse potential
> Rapid but transient; abuse liability is real.

Q: Why must patients be observed after an esketamine dose?
- To check for weight gain
- *Because of dissociation, sedation and raised blood pressure
- To take a blood level
- Because it causes immediate mania in everyone
> Short-term dissociative and cardiovascular effects.
:::

## 2.2 Psychedelic-assisted therapy: MDMA and psilocybin [core][beginner]
"Psychedelic-assisted therapy" means a medicine that changes perception and emotion, given **once or a few times**, under supervision, **with psychological support before, during and after**. The drug and the therapy are tested together.

### MDMA-assisted therapy for PTSD
- **MDMA** releases serotonin, noradrenaline and dopamine and increases oxytocin. People feel safer and more open, which may help them revisit trauma without being overwhelmed.
- Two phase 3 trials (known as MAPP1 and MAPP2) reported larger improvements in PTSD than therapy with placebo.
- **What happened next** (the honest status):
  - In **June 2024**, an FDA advisory panel voted strongly against, citing unblinding, missing safety data, and concerns about how the trials were run.
  - On **9 August 2024**, the FDA **declined** to approve it and asked for **another phase 3 trial**.
  - Soon after, a journal retracted three earlier papers from the programme over undisclosed ethics problems, and a case of therapist misconduct in an earlier trial was widely discussed.
  - The developer (Lykos Therapeutics) cut most of its staff, changed leadership and was **renamed Resilient Pharmaceuticals** in 2025.
  - **As of November 2026, MDMA-assisted therapy is not approved in the USA.** Australia has allowed specially authorised psychiatrists to prescribe it for PTSD since July 2023.

### Psilocybin for treatment-resistant depression
- **Psilocybin** comes from "magic mushrooms" and acts mainly on the **serotonin 2A receptor**.

:::widget journey
{
  "drug": "psilocybin",
  "target": "serotonin 2A receptors on cortical neurons, especially in the prefrontal and visual cortex",
  "route": "oral",
  "notes": {
    "gut": "Psilocybin is a prodrug. In the gut and liver its phosphate group is removed, turning it into psilocin, the active form.",
    "liver": "Psilocin is broken down partly by liver enzymes (MAO and glucuronidation). Doses in trials were fixed, for example 25 mg of manufactured psilocybin.",
    "bbb": "Psilocin is small and fat-soluble enough to cross into the brain quickly. Effects start within about half an hour.",
    "out": "Psilocin is cleared within hours, so the acute experience ends the same day. Any lasting benefit is thought to come from what changes in the brain and in the person afterwards."
  },
  "caption": "Tap each stage. The drug is gone within a day; the open question is why some effects last months."
}
:::

:::widget receptor
{
  "receptor": "5-HT2A",
  "title": "Psilocin at the serotonin 2A receptor",
  "caption": "Psilocin is an agonist at 5-HT2A (partial or full, depending on the system measured). Pick the agonists and watch the signal. Antagonists here, such as some antipsychotics, block the psychedelic effect."
}
:::
- **COMP360** is a manufactured psilocybin developed by Compass Pathways.
- A 2022 phase 2 trial found a single 25 mg dose beat a 1 mg dose for treatment-resistant depression at the main time point, with more side effects including headache, nausea and some suicidal behaviour in all groups.
- **Two phase 3 trials** have since met their main goal: COMP005 (a single dose, results June 2025) and COMP006 (two doses, with six-month data in July 2026).
- **As of November 2026**: the company is completing a **rolling application** to the FDA, expected to be finished by the end of 2026. It is **not yet approved** anywhere as a medicine except under Australia's authorised-prescriber scheme.

:::widget guess
{
  "prompt": "A psilocybin dosing session in these trials is long. How long does the main drug experience typically last?",
  "min": 1,
  "max": 24,
  "unit": "hours",
  "answer": [4, 8],
  "reveal": "Around six hours, so a session takes most of a day, with trained staff present the whole time. That cost and staffing is a big practical barrier, especially in India.",
  "clinician": "Psilocybin effects begin within about 20 to 40 minutes, peak at 1 to 2 hours and resolve over about 6 hours; sessions are scheduled for a full day with two monitors in many protocols. MDMA sessions run about 8 hours, with a supplemental half-dose often given about 1.5 to 2 hours in."
}
:::

:::widget sort
{
  "prompt": "Strength or weakness of the psychedelic evidence so far?",
  "buckets": ["Strength", "Weakness or open question"],
  "items": [
    { "text": "Randomised, placebo-controlled phase 3 trials exist for both MDMA and psilocybin", "bucket": 0 },
    { "text": "Most participants can guess whether they got the active drug", "bucket": 1 },
    { "text": "Effects after one or two sessions can last months for some people", "bucket": 0 },
    { "text": "It is hard to separate the effect of the drug from the effect of the intensive therapy and expectation", "bucket": 1 },
    { "text": "Trials mostly exclude people with psychosis, bipolar disorder or high suicide risk", "bucket": 1, "why": "So results may not apply to many real patients." },
    { "text": "In the psilocybin phase 3 trials the difference from control was modest, not dramatic", "bucket": 1, "why": "COMP005 showed a difference of about 3.6 points on the MADRS: real but modest." }
  ]
}
:::

:::safety Psychedelics in India: the law and the risks
In India, psilocybin mushrooms and MDMA are controlled under the **NDPS Act**; possession and supply are criminal offences. "Retreats" offering mushroom ceremonies operate outside any medical or legal framework. Risks include panic, dangerous behaviour while intoxicated, triggering psychosis or mania in vulnerable people, and exploitation of vulnerable people by untrained "facilitators". This lesson is about research, not a recommendation.
:::

:::clinician
The phase 3 trials MAPP1 (2021) and MAPP2 (2023) reported large between-group effect sizes on CAPS-5. The FDA Psychopharmacologic Drugs Advisory Committee (4 June 2024) voted 2 to 9 on effectiveness and 1 to 10 on whether benefits outweighed risks, citing functional unblinding, expectation bias, incomplete abuse-liability and cardiovascular data, and concerns about therapy conduct and data collection. Psilocybin: a 2022 phase 2b trial of 233 participants showed a MADRS difference of about 6.6 points for 25 mg versus 1 mg at the primary time point, with response not significantly different at later follow-up. COMP005 (n about 258) showed a placebo-adjusted MADRS difference of minus 3.6 at the primary time point; COMP006 (nearly 600 participants, two doses) reported maintained response through 26 weeks in the company's July 2026 release. Peer-reviewed full results and the FDA's assessment are still awaited, and DEA rescheduling would be needed for US launch. Key safety issues: transient blood pressure rises, headache, anxiety, rare prolonged psychosis or hallucinogen persisting perception disorder, and the vulnerability of patients during altered states (requiring two-therapist and recording policies).
:::

:::recall
1. What does "psychedelic-assisted therapy" mean? || A drug given once or a few times under supervision, together with structured psychological support.
2. What did the FDA decide about MDMA for PTSD in August 2024? || It declined to approve and asked for another phase 3 trial.
3. Which receptor does psilocybin mainly act on? || The serotonin 2A receptor.
4. What is the status of COMP360 psilocybin as of November 2026? || Two positive phase 3 trials; a rolling FDA application due to be completed by end-2026; not yet approved.
5. What is the legal status of psilocybin and MDMA in India? || Controlled under the NDPS Act; illegal outside licensed research.
:::

:::mcq
Q: The main reason regulators worry about "functional unblinding" in psychedelic trials is that:
- The drugs are too cheap
- *Participants who know they got the drug may report more benefit because they expect it
- The trials were too large
- Psychedelics have no subjective effects
> Expectancy can inflate results when blinding fails.

Q: A student says, "Psilocybin is proven and approved; I'm going to a mushroom retreat in Himachal." The most accurate reply is:
- Correct, it is approved in India
- *It is not approved in India, it is illegal under the NDPS Act, and trial results come from screened patients with medical supervision
- Retreats are safer than trials
- It is approved for anxiety in all countries
> Research findings are not a licence for unsupervised use.
:::

## 2.3 New medicines: xanomeline-trospium and zuranolone [core][beginner]
### Xanomeline-trospium (Cobenfy) for schizophrenia
For seventy years, every antipsychotic worked mainly by **blocking dopamine D2 receptors**. **Xanomeline-trospium** is the first approved antipsychotic with a **different main mechanism**.
- **Xanomeline** stimulates **muscarinic M1 and M4 receptors** in the brain, which indirectly calms overactive dopamine signalling in the circuits linked to psychosis.
- Alone, xanomeline caused many side effects in the body (nausea, vomiting, sweating). **Trospium** blocks muscarinic receptors **only outside the brain**, because it cannot cross into it, which reduces those side effects.
- **Approved by the FDA on 26 September 2024** for adults with schizophrenia, after positive trials (EMERGENT-2 and EMERGENT-3).

:::widget pathways
{
  "system": "dopamine",
  "title": "Old route versus new route to the same pathways",
  "caption": "Toggle the D2 blocker to see the usual trade-off: the mesolimbic pathway calms (fewer delusions and hallucinations) but nigrostriatal and tuberoinfundibular block cause movement problems and high prolactin. Xanomeline works upstream instead: by stimulating M4 receptors it reduces dopamine release in the overactive circuit, without blocking D2 in the movement and hormone pathways. That is why trials showed few movement side effects and no prolactin rise."
}
:::

:::widget receptor
{
  "receptor": "M4",
  "title": "Xanomeline at the muscarinic M4 receptor",
  "caption": "Xanomeline acts as an agonist at M4 (and M1). Pick the agonist types. Trospium does the opposite (an antagonist) but only outside the brain."
}
:::

:::widget journey
{
  "drug": "xanomeline-trospium",
  "target": "muscarinic M4 and M1 receptors in the midbrain, striatum and cortex",
  "route": "oral",
  "notes": {
    "mouth": "One capsule holds two drugs. It is taken twice daily, at least an hour before or two hours after food, because food lowers absorption.",
    "gut": "Both drugs are absorbed. In the gut wall, the trospium starts blocking muscarinic receptors, which limits nausea, cramps and diarrhoea from xanomeline.",
    "blood": "In the body, xanomeline alone would stimulate muscarinic receptors in the gut, sweat glands, heart and salivary glands. Trospium blocks these peripheral receptors.",
    "bbb": "Here the two part ways. Xanomeline crosses into the brain. Trospium is a charged molecule and cannot cross, so it does not block xanomeline's effect in the brain.",
    "out": "Trospium is cleared mainly by the kidneys, so doses are adjusted in kidney disease; xanomeline is broken down by the liver."
  },
  "caption": "Tap the blood-brain barrier stage: the whole design depends on one drug crossing and the other staying out."
}
:::

What it does and does not do:
| Advantage | Limitation |
|---|---|
| Little weight gain, few movement side effects, no prolactin rise in trials | Nausea, vomiting, constipation, indigestion, dry mouth, fast heart rate |
| A genuinely new mechanism | Must be taken twice daily, away from food |
| | Avoid in urinary retention, moderate or severe liver disease, untreated narrow-angle glaucoma |
| | As an **add-on** to existing antipsychotics, the ARISE trial **missed its main goal** (April 2025) |
| | Trials in Alzheimer's disease psychosis have been delayed; results now expected in 2027 |

:::note A lesson in honesty
A rival muscarinic drug, emraclidine, **failed** two phase 2 trials in November 2024. New mechanisms are exciting, but a mechanism is not a guarantee.
:::

### Zuranolone for postpartum depression
- **Zuranolone** is a **neuroactive steroid** that boosts GABA-A receptors (the brain's main "calming" system), related to the hormone allopregnanolone, which falls sharply after childbirth.
- It is taken as a **short course of tablets**, not daily for months.
- **FDA approved in August 2023 for postpartum depression.** The FDA **did not approve** it for general major depression, where the effect was smaller and less consistent.
- It carries a warning about **driving impairment** and sleepiness: patients must not drive for some hours after each dose and should take it in the evening.

:::widget guess
{
  "prompt": "Unlike usual antidepressants, zuranolone for postpartum depression is given as a short course. How many days?",
  "min": 1,
  "max": 90,
  "unit": "days",
  "answer": [14, 14],
  "reveal": "Fourteen days, once each evening. Benefit appeared within days in trials, which matters for a new mother. But it is a short course, and some women need further treatment afterwards.",
  "clinician": "Zuranolone 50 mg once daily in the evening with fat-containing food for 14 days (the regimen tested in the 2023 SKYLARK trial). Boxed warning for impaired ability to drive; avoid driving or hazardous activity for at least 12 hours after dosing. Its intravenous predecessor, brexanolone, required a continuous infusion of about 60 hours in a monitored setting. Breastfeeding data are limited; discuss with the patient."
}
:::

:::widget decide
{
  "scene": "Dr Kapoor, a young psychiatrist in Delhi, reads that xanomeline-trospium has “no weight gain”. A 24-year-old patient with schizophrenia, well controlled on olanzapine but distressed by a 15 kg weight gain, asks to switch to it.",
  "ask": "What is the best response?",
  "choices": [
    { "label": "Stop olanzapine today and import the new drug", "verdict": "harm", "outcome": "Abrupt switch triggers relapse; the new drug's gut side effects make him stop it too.", "why": "Abrupt switching risks relapse and rebound, and an unlicensed import raises supply, cost and legal issues." },
    { "label": "Discuss evidence and availability honestly; first try proven weight strategies (lifestyle support, metformin, or switching to a lower-weight-gain licensed antipsychotic) while monitoring", "verdict": "best", "outcome": "He switches gradually to aripiprazole with metformin support, loses some weight and stays well.", "why": "Licensed, accessible options with good evidence come first. The new drug is promising but not the only answer." },
    { "label": "Tell him weight gain is the price of staying well", "verdict": "ok", "outcome": "He stops his medicine on his own a month later.", "why": "Ignoring a distressing side effect harms adherence. There are good options to try." }
  ]
}
:::

:::clinician
EMERGENT-2 (2024) and EMERGENT-3 showed PANSS total reductions of roughly 8 to 10 points versus placebo at five weeks in acutely exacerbated inpatients. Long-term open-label data suggest sustained effect and weight neutrality; head-to-head trials against established antipsychotics are lacking. Its availability and CDSCO status in India should be checked; as of late 2026 it is not a standard option in Indian practice. Other approved or emerging agents to watch include the TAAR1 agonists (ulotaront failed phase 3 in 2023) and further muscarinic modulators. For zuranolone, the MDD programme (WATERFALL, CORAL, SHORELINE) gave modest and inconsistent effects, and the FDA issued a complete response letter for MDD in August 2023 while approving PPD.
:::

:::recall
1. What is new about xanomeline-trospium's mechanism? || It stimulates muscarinic M1 and M4 receptors instead of blocking dopamine D2 receptors.
2. Why is trospium added? || It blocks muscarinic receptors outside the brain only, reducing peripheral side effects.
3. When did the FDA approve xanomeline-trospium? || 26 September 2024.
4. What happened in the ARISE trial? || As an add-on to other antipsychotics it missed its primary endpoint.
5. For what condition is zuranolone approved, and what was it not approved for? || Postpartum depression; not approved for major depressive disorder.
:::

:::mcq
Q: Which side effects are most typical of xanomeline-trospium?
- Weight gain and high prolactin
- Parkinsonism and tardive dyskinesia
- *Nausea, vomiting, constipation and dry mouth
- Agranulocytosis
> Cholinergic and anticholinergic gut effects dominate.

Q: Zuranolone works mainly by:
- Blocking serotonin reuptake
- *Enhancing GABA-A receptor activity as a neuroactive steroid
- Blocking NMDA receptors
- Stimulating dopamine
> It is related to allopregnanolone.
:::

## 2.4 GLP-1 medicines and mental health [core][beginner]
**GLP-1 receptor agonists** (semaglutide, liraglutide, and the dual agonist tirzepatide) were developed for diabetes and are now widely used for obesity. Because they act on **appetite and reward circuits** in the brain, psychiatry has three questions about them.

:::widget brainmap
{
  "title": "Where GLP-1 signals act in the brain",
  "focus": ["hypothalamus", "brainstem", "basal-ganglia", "amygdala"],
  "notes": {
    "hypothalamus": "Appetite and fullness centres. GLP-1 medicines increase the feeling of being full, which drives weight loss.",
    "brainstem": "The area that receives signals from the gut and controls nausea. GLP-1 receptors here explain both reduced eating and the common nausea.",
    "basal-ganglia": "Reward circuits (including the ventral striatum). In animals, GLP-1 agonists dampen the dopamine 'reward' from alcohol and drugs, the basis of the addiction trials.",
    "amygdala": "Emotion and stress circuits have GLP-1 receptors too, one reason researchers study effects on mood and anxiety."
  },
  "caption": "Tap each region. The same receptors that reduce appetite may reduce cravings, which is why psychiatry is interested."
}
:::

### Question 1: do they increase suicidal thoughts?
- In **2023**, reports from Iceland and elsewhere raised concern about suicidal thoughts in people using these medicines.
- In **April 2024**, the European Medicines Agency's safety committee found **no evidence of a causal link**.
- On **13 January 2026**, after a very large analysis of trials and health records, the FDA asked manufacturers to **remove** suicidal-behaviour warnings from the labels of the weight-loss products (Wegovy, Zepbound, Saxenda), finding **no increased risk**.
- Good practice is unchanged: **ask about mood and suicidal thoughts** in anyone on any weight-loss treatment, especially with a psychiatric history.

### Question 2: can they treat addiction?
The idea: GLP-1 signals may dampen the **reward** from alcohol and other substances.
- A small 2025 randomised trial of low-dose semaglutide (48 people) reduced alcohol craving and drinking in a laboratory setting.
- A randomised trial of **108 people**, published in **April 2026**, found that semaglutide reduced **heavy-drinking days** more than placebo in people with **both** obesity and alcohol use disorder.
- An earlier trial of exenatide found no overall benefit, but a possible benefit in people with obesity.
- **Status: promising, not yet a recommended treatment for alcohol use disorder.** Larger trials, people without obesity, and longer follow-up are needed.

### Question 3: what about mood and antipsychotic weight gain?
- Weight loss can improve self-esteem and mood, but some people have more anxiety or low mood with gut side effects or rapid body change.
- Liraglutide helped weight in people with schizophrenia on clozapine or olanzapine (a Danish trial, 2017), and GLP-1 medicines are increasingly used for **antipsychotic-induced weight gain**.

:::widget sort
{
  "prompt": "Sort these GLP-1 claims by how well the evidence supports them (as of Nov 2026).",
  "buckets": ["Supported", "Promising, not proven", "Not supported"],
  "items": [
    { "text": "GLP-1 medicines help weight loss in people on antipsychotics", "bucket": 0 },
    { "text": "Semaglutide reduces heavy drinking in people with obesity and alcohol use disorder", "bucket": 1, "why": "One positive randomised trial; replication needed." },
    { "text": "GLP-1 medicines cause suicidal behaviour", "bucket": 2, "why": "Large analyses found no increased risk; the FDA removed the warning in January 2026." },
    { "text": "Semaglutide cures depression", "bucket": 2 },
    { "text": "GLP-1 medicines might reduce cravings for other substances", "bucket": 1 }
  ]
}
:::

:::safety Eating disorders and misuse
GLP-1 medicines are being misused for weight loss by people who are not overweight, including people with **anorexia nervosa or bulimia**. Ask about eating-disorder history before anyone starts them, and be alert to young people obtaining them without supervision.
:::

:::widget decide
{
  "scene": "Ms D'Souza, 34, in Bengaluru, has bipolar disorder (stable on lithium) and obesity. Her physician wants to start semaglutide. She asks you, “I read it causes suicidal thoughts. Should I refuse?”",
  "ask": "What do you advise?",
  "choices": [
    { "label": "Refuse; it is too risky for anyone with a mental illness", "verdict": "ok", "outcome": "She stays at high cardiometabolic risk, which is a leading cause of early death in bipolar disorder.", "why": "Over-caution has costs. Current evidence does not show increased suicide risk." },
    { "label": "Explain that large reviews found no increased suicide risk; agree to monitor mood together, check fluid intake and lithium levels if vomiting or diarrhoea occur", "verdict": "best", "outcome": "She starts semaglutide, loses weight, and her lithium level is checked during a bout of nausea.", "why": "Balanced information plus practical safety: dehydration from gut side effects can raise lithium levels." },
    { "label": "Tell her mood will definitely improve with weight loss", "verdict": "ok", "outcome": "When her mood dips in winter she feels the medicine has failed.", "why": "Overpromising sets up disappointment; effects on mood are uncertain." }
  ]
}
:::

:::clinician
Key regulatory decisions: the EMA safety committee conclusion (April 2024) of no causal association with suicidal thoughts; FDA Drug Safety Communication (13 January 2026) requesting removal of suicidal behaviour and ideation warnings, based on a meta-analysis of 91 placebo-controlled trials (about 108,000 patients) and a Sentinel cohort of more than 2 million new users with type 2 diabetes compared with SGLT2 inhibitor users. Observational work (for example a large 2024 health-records study) suggested lower rates of suicidal ideation with semaglutide versus non-GLP-1 weight or diabetes drugs, subject to confounding. Alcohol: a 2025 trial (n=48; low-dose semaglutide reduced laboratory alcohol self-administration and some drinking measures); an April 2026 trial (n=108 with AUD and BMI of 30 or more; heavy-drinking days fell by about 41 versus 26 percentage points); a 2022 exenatide trial (negative overall, post hoc benefit with obesity). Practical points: GI losses can raise lithium levels; delayed gastric emptying may alter absorption of oral drugs; rapid weight loss reduces muscle mass; cost and supply constrain use, although cheaper versions are becoming available in India as patents lapse. Check current local regulation.
:::

:::recall
1. Name three GLP-1 medicines. || Semaglutide, liraglutide, tirzepatide (dual agonist), also exenatide.
2. What did the FDA conclude in January 2026 about suicidality? || No increased risk; it asked for suicidality warnings to be removed from weight-loss product labels.
3. What did the April 2026 semaglutide trial in alcohol use disorder find? || Semaglutide reduced heavy-drinking days more than placebo in people with obesity and alcohol use disorder.
4. Why check lithium levels in a patient starting semaglutide? || Vomiting, diarrhoea or poor intake can cause dehydration and raise lithium levels.
:::

:::mcq
Q: Which statement best summarises GLP-1 medicines and alcohol use disorder as of November 2026?
- Approved first-line treatment
- *Promising early randomised evidence, especially in people with obesity; not yet a standard treatment
- Proven to worsen drinking
- Never studied
> Early positive trials; more needed.
:::

## 2.5 Level check · Beginner [core][beginner]
Score 80% or more to open the Advanced level.

:::mcq
Q: Ketamine's antidepressant action is thought to start by blocking:
- Serotonin transporters
- Dopamine D2 receptors
- *NMDA glutamate receptors
- GABA-A receptors
> Glutamate is the key system.

Q: A practical problem with single-dose ketamine for depression is that:
- It takes months to work
- *The benefit usually fades within days
- It causes weight gain
- It is unsafe in all adults
> Rapid but short-lived.

Q: Esketamine is:
- A new SSRI
- *One mirror-image form of ketamine, given as a nasal spray
- A psychedelic mushroom extract
- A long-acting injection
> The S-enantiomer of ketamine.

Q: Which is a recognised harm of long-term heavy recreational ketamine use?
- Hair loss
- *Bladder damage (ketamine cystitis)
- Hypothyroidism
- Kidney stones only
> Ketamine uropathy.

Q: The FDA advisory panel on MDMA for PTSD in June 2024 raised concerns mainly about:
- The drug being too cheap
- *Unblinding, incomplete safety data and how the trials were run
- Lack of any phase 3 trials
- Interactions with lithium
> These concerns led to the August 2024 complete response letter.

Q: Psilocybin acts mainly on:
- Dopamine D2 receptors
- *Serotonin 2A receptors
- Opioid receptors
- Muscarinic receptors
> 5-HT2A agonism.

Q: As of November 2026, COMP360 psilocybin is:
- Approved in the USA
- Approved in India
- *Supported by two positive phase 3 trials, with an FDA application being completed
- Abandoned after failure
> Promising, not yet approved.

Q: Xanomeline is combined with trospium because trospium:
- Increases xanomeline's brain levels
- *Blocks muscarinic side effects outside the brain without entering it
- Blocks dopamine
- Prevents weight gain
> Peripheral anticholinergic.

Q: Which is NOT typical of xanomeline-trospium in trials?
- Nausea
- Constipation
- *Marked weight gain and prolactin rise
- Dry mouth
> It was largely weight- and prolactin-neutral.

Q: The ARISE trial tested xanomeline-trospium as:
- A treatment for Alzheimer's disease
- *An add-on to existing antipsychotics, and it missed its main goal
- A treatment for depression
- A long-acting injection
> April 2025 topline.

Q: Zuranolone is approved by the FDA for:
- Major depressive disorder
- Schizophrenia
- *Postpartum depression
- PTSD
> Not approved for MDD.

Q: A warning attached to zuranolone concerns:
- Weight gain
- *Driving impairment and sleepiness
- Agranulocytosis
- Hair loss
> Do not drive for several hours after dosing.

Q: In January 2026 the FDA concluded that GLP-1 weight-loss medicines:
- Clearly increase suicide
- *Do not increase suicidal behaviour, and asked for the warnings to be removed
- Should be banned
- Cure depression
> Based on large trial and real-world analyses.

Q: Before starting a GLP-1 medicine, a psychologically important history to take is:
- Handedness
- *Eating disorders
- Blood group
- Colour vision
> Risk of misuse in eating disorders.

Q: Semaglutide's effect on alcohol use disorder is best described as:
- Proven and first line
- *Promising in early randomised trials
- Harmful
- Never studied
> Early positive results; more trials needed.
:::
`;
