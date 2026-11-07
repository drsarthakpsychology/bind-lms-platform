/* Module · What's new in psychiatry, Part V (Q&A bank: Starting and Beginner). Status as described in this module, November 2026. Original text written for VIBHA School of Psychology. */
export const part3 = String.raw`
# Part V · Exam zone: Q&A bank

## 5.1 Q&A bank · Starting [core][starting]
Think each question through before you open the answer. These questions build on Part I: how a new treatment becomes real and how to read the evidence.

:::qa Why do so many new psychiatric medicines fail in trials, even when they looked promising in animals? [starting]
### Short answer
Because psychiatry has **no reliable biological tests**, **large placebo responses**, **diagnoses that group very different people together**, **animal models that capture only fragments** of human illness, and **outcomes measured by rating scales** that are noisy.

### Five reasons, explained
| Reason | What it means | Example |
|---|---|---|
| No biomarkers | We cannot pick the patients most likely to respond, or check that the drug hit its target in the brain | Two people with "depression" may have very different biology |
| Large placebo response | A big share of people improve on placebo, leaving little room to show a difference | Placebo response in depression trials is often a third or more |
| Heterogeneity | One diagnosis covers many routes to illness | A drug that helps an inflammatory subgroup looks weak in an unselected trial |
| Weak animal models | A mouse cannot report hopelessness or voices | A "forced swim test" measures struggling, not human depression |
| Noisy outcomes | Rating scales depend on interviews and mood on the day | Small rater differences can swamp a small drug effect |

### Add the regression problem
Phase 2 trials are small. A drug that does unusually well by chance in a small trial is the one that goes forward. In the larger phase 3 trial, its result usually **shrinks back towards the true effect**. This "winner's curse" is one reason many drugs that looked good in phase 2 fail in phase 3.

### What this means for you
When you read about a promising early result, expect it to **shrink** with more data. That is normal science, not a scandal.
:::

:::qa A new drug cuts relapse in schizophrenia from 40% to 25% over a year. Work out the absolute risk reduction, relative risk reduction and NNT, and say which number a headline would choose. [starting]
### The numbers, step by step
1. **Control event rate** (relapse on the old treatment) = 40% = 0.40.
2. **Experimental event rate** (relapse on the new drug) = 25% = 0.25.
3. **Absolute risk reduction (ARR)** = 0.40 minus 0.25 = **0.15**, that is 15 percentage points.
4. **Relative risk (RR)** = 0.25 divided by 0.40 = **0.625**.
5. **Relative risk reduction (RRR)** = 1 minus 0.625 = **0.375**, that is about **38%**.
6. **Number needed to treat (NNT)** = 1 divided by ARR = 1 divided by 0.15 = **6.7**, rounded up to **7**.

### What each number tells you
| Measure | Value | Plain meaning |
|---|---|---|
| ARR | 15 points | Out of 100 people, 15 fewer relapse |
| RRR | 38% | The risk of relapse is cut by about a third |
| NNT | 7 | Treat 7 people for a year to prevent one extra relapse |

### Which number would a headline choose?
The **relative** figure: "New drug cuts relapse by nearly 40%!" It sounds bigger. Relative figures can mislead when the starting risk is low: cutting a 2% risk to 1% is also a "50% reduction", but the NNT is 100.

### Add the harm side
If 1 in 20 people on the new drug gets a serious side effect that the old one does not cause, the **number needed to harm (NNH)** is 20. Good decisions compare NNT with NNH.
:::

:::qa What exactly is the placebo response made of? Is it all "in the mind"? [starting]
### Short answer
No. What we see in the placebo arm of a trial is a **mixture**: true placebo effects driven by expectation and conditioning, plus improvement that would have happened anyway (natural recovery and regression to the mean), plus measurement effects.

### The parts of the placebo arm
| Component | What happens | Is it a true placebo effect? |
|---|---|---|
| **Natural history** | Many episodes of depression improve on their own over time | No |
| **Regression to the mean** | People enter trials when at their worst, so they tend to score better later | No |
| **Expectation** | Belief that treatment will help reduces distress and changes behaviour | Yes |
| **Conditioning** | Past experience of feeling better after pills or doctors' visits | Yes |
| **Attention and care** | Regular contact, assessment and a hopeful setting | Partly |
| **Rater and reporting bias** | Raters and patients expect improvement | No (a measurement effect) |

### The nocebo effect
Expecting harm can produce real symptoms. In many trials, people on placebo report headache, nausea and tiredness, sometimes enough to stop "treatment".

### Why it matters
1. A new drug must beat **all** of these together.
2. A study with **no control group** cannot separate the drug's effect from this mixture.
3. Expectation effects are especially large when a treatment is **new, exciting and talked about**, as with psychedelics and ketamine.
:::

:::qa The FDA has approved a drug. Why might it still not be available to a patient in Ahmedabad? [starting]
### Short answer
Each country has its own regulator. In India, a drug needs **CDSCO approval** and a company willing to **market** it at a price people can pay, and it must fit Indian law on controlled substances.

### The steps a foreign-approved drug must pass
1. **Application to the CDSCO** (headed by the Drugs Controller General of India) under the New Drugs and Clinical Trials Rules, 2019.
2. **Local clinical data**: the CDSCO may ask for trials in Indian patients, or may waive them for some categories of drugs already approved in certain countries.
3. **Subject Expert Committee review** and a decision.
4. **Manufacturing or import licences**, pricing and supply chains.
5. **Controlled substance rules**: medicines with misuse potential face extra restrictions under the NDPS Act.
6. **Company decision**: a company may simply not launch in India if it expects low sales or high cost.

### Examples from this module
| Medicine | Status in USA (as described here) | What a student in India should check |
|---|---|---|
| Esketamine nasal spray | Approved | Current CDSCO status and availability; very limited so far |
| Xanomeline-trospium | Approved for schizophrenia | Not a standard option in India as of late 2026 |
| Psilocybin, MDMA | Not approved | Illegal under the NDPS Act outside licensed research |

### The lesson
"Approved" always needs two more words: **"by whom"** and **"for what"**.
:::

:::qa Walk through how you would check a news story that says "Scientists find breakthrough cure for depression". [starting]
### Step by step
1. **Find the original source.** Is it a peer-reviewed paper, a conference abstract, a company press release or a university news page?
2. **Who was studied?** Mice, healthy volunteers or patients? How many?
3. **Was there a comparison group?** Placebo, an existing treatment, or nothing?
4. **Was it randomised and blinded?** Could people tell which treatment they got?
5. **What was measured, and how big was the change?** Look for the difference between groups, not just "improved".
6. **How long did people stay better?** A day? Months?
7. **Who paid, and has anyone else repeated it?**
8. **What is the status?** Early signal, late trial, or approved?

### A worked example
Headline: "Breakthrough: single dose cures depression."

| Question | Answer from the paper | What it means |
|---|---|---|
| Source | University press release about a phase 2 trial | Early, not yet replicated |
| Who | 30 adults with depression | Small sample |
| Comparison | A low dose of the same drug | Some control, but not inert placebo |
| Blinding | Most participants guessed their group | Expectation may have inflated the effect |
| Size | 6 points better on a 60-point scale at one time point | Meaningful but modest |
| Duration | Difference gone by the later follow-up | Not a "cure" |
| Funding | The manufacturer | Needs independent replication |

### Verdict
"Promising early signal that needs larger, independent, well-blinded trials." That is a long way from "cure".
:::

:::qa What do "response" and "remission" mean in depression trials, and why should students care about the difference? [starting]
### Short answer
**Response** usually means at least a **halving** of the symptom score from baseline. **Remission** means the score falls **below a low cut-off**, so that the person has few or no symptoms left. A person can respond and still be quite unwell.

### An example on the MADRS (0 to 60)
| Patient | Baseline | End of trial | Change | Response? | Remission? (a common cut-off is 10 or below) |
|---|---|---|---|---|---|
| Asha | 36 | 16 | Down by 56% | Yes | No |
| Bilal | 30 | 8 | Down by 73% | Yes | Yes |
| Chitra | 28 | 18 | Down by 36% | No | No |

### Why the difference matters
1. **Residual symptoms predict relapse.** People who respond without remitting are more likely to become depressed again.
2. **Headlines prefer response rates**, which are higher.
3. **Remission is the real goal** in clinical care.
4. **Comparisons must use the same definitions**: a 60% "response" in one study and a 35% "remission" in another are not comparable.

### Other outcome words to know
- **Relapse**: return of symptoms during the same episode, soon after improvement.
- **Recurrence**: a new episode after full recovery.
- **Time to relapse**: the key outcome in maintenance trials, such as those for esketamine.
:::

:::qa What is the difference between efficacy and effectiveness, and why does it matter for new treatments in India? [starting]
### Short answer
**Efficacy** is how well a treatment works **under ideal trial conditions**. **Effectiveness** is how well it works in **ordinary practice**, with real patients, real clinicians and real constraints.

### Comparison
| Feature | Efficacy trial (explanatory) | Effectiveness trial (pragmatic) |
|---|---|---|
| Patients | Carefully selected; many exclusions (other illnesses, suicide risk, substance use) | Broad, like the clinic's patients |
| Setting | Specialist research centres | District hospitals, primary care, community |
| Delivery | Highly trained staff, close monitoring | Usual staff, usual workload |
| Question | Can it work? | Does it work here? |

### Why new treatments are especially affected
- Psychedelic trials excluded people with bipolar disorder, psychosis risk and high suicide risk, and gave many hours of therapist time per patient. Real-world patients and services differ.
- Esketamine requires clinic observation for each dose. In a busy Indian outpatient department, staff time, space and cost may limit it.
- Patients in India may have more physical comorbidity, travel long distances, and pay out of pocket.

### What a careful clinician asks
"Would **my** patient have been allowed into this trial? Could **my** service deliver what the trial delivered?"
:::

:::qa What is a randomised controlled trial, and why is random allocation so important? [starting]
### Short answer
In a **randomised controlled trial (RCT)**, participants are assigned **by chance** to the new treatment or a comparison. Randomisation makes the groups **alike on average**, including on things nobody measured, so that a difference at the end can be put down to the treatment.

### Step by step
1. **Recruit** eligible participants and get informed consent.
2. **Randomise**: a computer-generated sequence decides each person's group.
3. **Conceal allocation**: the person enrolling cannot know or change the next assignment.
4. **Treat**: one group gets the new treatment, the other a placebo or standard care.
5. **Blind** where possible: patients, clinicians and raters do not know who got what.
6. **Measure outcomes** the same way in both groups.
7. **Analyse by intention to treat**: everyone is analysed in the group they were assigned to, even if they stopped.

### What randomisation protects against
| Without it | Example of the bias |
|---|---|
| Doctors choose who gets the new drug | They give it to people with better prognosis, so it looks better |
| Patients choose | Motivated patients pick the new option and would have done better anyway |
| Groups differ on unmeasured factors | Social support, genetics, severity |

### What randomisation does not fix
Unblinding, drop-out that differs between groups, poor measures and a trial population unlike real patients.
:::

:::qa A treatment has a convincing mechanism. Why is that not enough to call it effective? [starting]
### Short answer
Because the brain is complex, a drug can **hit its target and still fail** to help patients, and a drug can **help for reasons we did not expect**. Only outcome trials in patients tell us whether a treatment works.

### Examples from this module and beyond
| Case | The mechanism | What happened |
|---|---|---|
| Emraclidine | Targets the M4 muscarinic receptor, the same idea behind xanomeline-trospium | Failed two phase 2 trials in November 2024 |
| Ulotaront | A TAAR1 agonist with a new, non-D2 mechanism | Failed phase 3 in 2023 |
| Anti-inflammatory add-ons | Inflammation is raised in some depression | Mixed results; help, if at all, only a subgroup |
| Lithium | Mechanism still debated | One of the most effective medicines in psychiatry |

### Why mechanisms mislead
1. **Animal models** may not capture the human illness.
2. **Dose and brain penetration** may be wrong.
3. **Wrong patients**: the mechanism may matter only for a subgroup.
4. **Side effects** may limit the dose.
5. **Compensation**: the brain adapts to the change.

### The rule
Mechanism tells you **why to test** a treatment. Outcomes tell you **whether to use** it.
:::

:::qa What is a systematic review and meta-analysis, and why can a meta-analysis still be wrong? [starting]
### Short answer
A **systematic review** finds, appraises and summarises **all** the studies on a question using a pre-set, transparent method. A **meta-analysis** combines their results statistically into one overall estimate. It is usually the strongest form of evidence, but only as good as the studies it includes.

### How a good one is done
1. A clear question (population, intervention, comparison, outcome).
2. A protocol registered in advance.
3. A full search of databases and trial registries, including unpublished data.
4. Two reviewers screen studies and extract data independently.
5. Risk of bias is rated for each study.
6. Results are pooled, and **heterogeneity** (how much studies disagree) is measured.
7. **Publication bias** is checked, for example with a funnel plot.
8. Certainty of the evidence is graded.

### Why it can still mislead
| Problem | Effect |
|---|---|
| Many small, biased trials | A precise but inflated estimate ("garbage in, garbage out") |
| Missing negative studies | Overestimates benefit |
| Combining very different studies | An average that fits nobody |
| Choices made after seeing data | Results tilted towards the reviewers' expectations |

### Example from this module
The 2006 meta-analysis of 380 psychokinesis studies found a tiny overall effect, but the pattern (big effects only in small studies) showed that publication bias could explain it. The method worked because the authors looked for bias.
:::

:::qa How should you judge a trial that was paid for and run by the drug's manufacturer? [starting]
### Short answer
With **scrutiny, not automatic rejection**. Most new medicines are tested in company-funded trials. Look at the design features that protect against bias, and give more weight to **independent replication**.

### Where bias can enter in sponsored trials
1. **Choice of comparator**: a low dose of the old drug, or a comparator known to cause side effects.
2. **Choice of outcome** and time point: picking the one that shows the best result.
3. **Short duration**: long-term harms are not seen.
4. **Selective publication**: negative trials published late or not at all.
5. **Spin**: abstracts and press releases that overstate findings.

### Protective features to check
| Feature | What to look for |
|---|---|
| Registration | Was the trial registered before it started, with the same primary outcome? |
| Comparator | Is it a fair dose of a relevant alternative? |
| Data access | Did independent statisticians analyse the data? |
| Full reporting | Are all outcomes and all side effects reported? |
| Replication | Have independent groups found the same? |

### The balanced view
Industry funding is a reason to **check harder**. The same checks apply to academic trials, where researcher allegiance and career pressure also create bias.
:::

:::qa How are rare side effects found after a drug is approved? Explain pharmacovigilance with an Indian example. [starting]
### Short answer
Rare side effects are often invisible in trials of a few thousand people. They are found after approval through **pharmacovigilance**: collecting and analysing reports of suspected harms, and studying large health-record databases.

### Why trials miss rare harms
A harm that affects 1 in 10,000 people is unlikely to appear even once in a trial of 3,000. It shows up only when hundreds of thousands use the drug.

### The methods
1. **Spontaneous reporting**: doctors, pharmacists and patients report suspected reactions. In India this is through the **Pharmacovigilance Programme of India (PvPI)**, run from the Indian Pharmacopoeia Commission, with adverse drug reaction monitoring centres in medical colleges.
2. **Signal detection**: statisticians look for reactions reported more often than expected.
3. **Health-record studies**: comparing large groups of users and non-users.
4. **Regulatory action**: label changes, warnings, restricted use, or withdrawal.

### Examples
| Signal | What happened |
|---|---|
| Carbamazepine and severe skin reactions in people with HLA-B*15:02 | Led to gene testing advice in Asian populations |
| GLP-1 medicines and suicidal thoughts | Reports in 2023 prompted reviews; large analyses found no increased risk, and the FDA removed the warning in January 2026 |
| Clozapine and agranulocytosis | Led to mandatory blood monitoring |

### Your role
Any clinician who suspects a drug reaction can report it. Reporting is how the system learns.
:::

:::qa What does "off-label" prescribing mean? Use ketamine for depression to discuss when it is acceptable. [starting]
### Short answer
**Off-label** means using a licensed medicine for a purpose, dose, age group or route **not included in its approved label**. It is legal and common, but needs a **reasonable evidence base**, **informed consent** and **careful monitoring**.

### Ketamine as an example
- Ketamine is licensed as an **anaesthetic**.
- Using IV ketamine for **treatment-resistant depression** is off-label in most countries, including India.
- There is randomised evidence for short-term benefit, and specialist centres use it with protocols.

### When off-label use is reasonable
| Condition | Ketamine example |
|---|---|
| A real evidence base | Randomised trials and meta-analyses support short-term benefit |
| Licensed options tried or unsuitable | Several antidepressants and augmentation failed |
| Informed consent about off-label status | The patient is told it is not licensed for depression and what that means |
| Safety monitoring | Blood pressure, dissociation, observation after each dose, misuse screening |
| Documentation | The reasoning, consent and monitoring recorded |
| A specialist setting | Not a home prescription from an online clinic |

### When it is not
- Weak or no evidence.
- No informed consent.
- Commercial clinics offering "one-session cures".
- When licensed, proven options have not been tried.
:::

## 5.2 Q&A bank · Beginner [core][beginner]
These questions build on Part II: the new treatments themselves.

:::qa Compare ketamine, esketamine and arketamine. [beginner]
### Short answer
Ketamine is a **racemic** mixture: equal parts of two mirror-image molecules, **S-ketamine (esketamine)** and **R-ketamine (arketamine)**. Esketamine binds NMDA receptors more strongly and is the licensed nasal spray. Arketamine is being studied because animal work suggested lasting antidepressant effects with less dissociation, but early human trials have been disappointing so far.

### Comparison
| Feature | Racemic ketamine | Esketamine | Arketamine |
|---|---|---|---|
| What it is | Both mirror forms | S form only | R form only |
| NMDA affinity | Intermediate | Higher (about three to four times R) | Lower |
| Usual route for depression | IV infusion, off-label | Nasal spray, licensed in many countries | Experimental |
| Dissociation | Common, short-lived | Common, short-lived | Less in animal and early human studies |
| Status (as described in this module) | Off-label; evidence of rapid effect | Approved for TRD and depression with acute suicidal thoughts; stand-alone use approved in the USA in January 2025 | Research only |
| Evidence | Many small RCTs and meta-analyses; large non-inferiority trial against ECT | Phase 3 programme with mixed individual results; positive comparisons with quetiapine augmentation | Small trials |

### Why enantiomers matter
Mirror-image molecules can have different potency, side effects and even different mechanisms. The licensed product is not "the same as ketamine", and results with one do not automatically transfer to the others.
:::

:::qa A patient with severe treatment-resistant depression asks whether ketamine is "as good as ECT". What does the evidence say? [beginner]
### Short answer
For **outpatients with non-psychotic** treatment-resistant depression, a large 2023 trial found IV ketamine **not inferior** to ECT. For **severe, psychotic or catatonic depression**, inpatients and people at very high suicide risk, **ECT remains the stronger choice**.

### The key trial in plain words
- About 400 adults with treatment-resistant, non-psychotic depression were randomised to ketamine infusions or ECT over a short course.
- Response was at least as good with ketamine (roughly half responded with ketamine, around four in ten with ECT).
- ECT caused more **memory complaints** and muscle aches; ketamine caused **dissociation** during infusions.
- Many ECT patients in the trial stopped early, which may have lowered ECT's results.

### Clinical comparison
| Feature | Ketamine | ECT |
|---|---|---|
| Speed | Hours to days | Days to a few treatments |
| Best evidence for | Outpatient, non-psychotic TRD; acute suicidal thinking | Severe, psychotic, catatonic, life-threatening depression |
| Main side effects | Dissociation, blood pressure rise, misuse potential | Anaesthesia risks, transient memory problems |
| Durability | Effects fade without repeated sessions | Relapse common without maintenance |
| Licence | Off-label (racemic) | Established, regulated under the MHCA 2017 (modified ECT only) |
| Access in India | Few centres | Widely available in psychiatric hospitals |

### How to answer the patient
Explain both options honestly, match them to the type and severity of their depression, and include other evidence-based steps (augmentation, rTMS, psychotherapy). Neither is a "one-time fix".
:::

:::qa Describe, step by step, what happens before, during and after an esketamine session. [beginner]
### Before starting treatment
1. **Confirm the indication**: treatment-resistant depression (or depression with acute suicidal thoughts), after adequate trials of other antidepressants.
2. **Screen for contraindications**:
   - aneurysmal vascular disease, arteriovenous malformation or recent brain bleed;
   - uncontrolled high blood pressure;
   - history of substance misuse (relative caution);
   - pregnancy (avoid), and psychosis.
3. **Explain** dissociation, sedation, blood pressure rise, the need to stay in the clinic and not to drive that day.
4. **Consent** in writing.

### On the day of each session
1. **Measure blood pressure** before the dose. If it is high, delay.
2. **Self-administration** of the nasal spray under direct supervision, with gaps between devices.
3. **Observe**: blood pressure checks after dosing; watch for dissociation and sedation.
4. **Stay at least two hours** (the US REMS requirement) until the patient is clinically stable.
5. **Go home with an adult**, no driving or machinery until the next day after a night's sleep.

### Treatment course
- **Induction**: twice weekly in the first month.
- **Maintenance**: weekly, then every other week, adjusted to response.
- Continue an oral antidepressant where used in combination.

### Monitoring over time
| What | Why |
|---|---|
| Mood and suicidality | Response, and early warning of worsening |
| Blood pressure trend | Cardiovascular safety |
| Misuse behaviour | Requests for extra doses, use of street ketamine |
| Urinary symptoms | Bladder toxicity with heavy use |
| Cognition | Long-term effects not fully known |
:::

:::qa How do psychedelics like psilocybin act in the brain? Evaluate the main theories. [beginner]
### Short answer
Psilocybin's active form, **psilocin**, stimulates **serotonin 2A receptors**, especially on cortical pyramidal neurons. This disrupts usual patterns of brain network activity and may open a window of **increased flexibility and neuroplasticity**. How this leads to lasting benefit is still debated.

### The levels of explanation
| Level | Finding | Status |
|---|---|---|
| Receptor | 5-HT2A agonism; blocking 5-HT2A (for example with ketanserin) abolishes the psychedelic experience | Strong |
| Cells | Increased glutamate release in cortex; growth of dendritic spines in animals | Strong in animals |
| Networks | Reduced integrity of the default mode network; increased communication between normally separate networks | Replicated in imaging, interpretation debated |
| Mind | "Relaxed beliefs": higher-level expectations loosen, allowing rigid patterns (ruminative self-criticism) to be revised | A theory, not yet tested decisively |
| Psychology | Mystical-type experiences, emotional breakthrough and insight predict benefit in some studies | Correlational |

### Critical points
1. **Is the experience necessary?** Some researchers are developing non-hallucinogenic analogues that keep the plasticity effects. If they work, the subjective experience may not be essential.
2. **Expectancy**: people with strong beliefs about psychedelics may report more mystical experiences and more benefit.
3. **The therapy component**: preparation and integration sessions may contribute much of the effect.
4. **Reverse causation**: those who improve may describe their experiences more positively.

### Exam tip
State the receptor mechanism confidently; describe network and "relaxed beliefs" accounts as **hypotheses**.
:::

:::qa Compare MDMA and psilocybin as treatments under study. [beginner]
### Comparison
| Feature | MDMA | Psilocybin |
|---|---|---|
| Drug class | Entactogen ("empathogen") | Classic psychedelic |
| Main mechanism | Reverses the serotonin transporter, releasing serotonin; also noradrenaline, dopamine; raises oxytocin | Psilocin stimulates 5-HT2A receptors |
| Subjective effect | Closeness, safety, openness; perception mostly unchanged | Altered perception, sense of self and meaning; can be intense |
| Session length | About 8 hours | About 6 hours |
| Studied for | PTSD | Treatment-resistant depression; also alcohol use, end-of-life distress |
| Rationale | Lowers fear so trauma memories can be revisited in therapy | Loosens rigid patterns of thought and feeling |
| Main risks | Raised blood pressure and heart rate, overheating, low sodium, misuse; neurotoxicity concerns at high recreational doses | Anxiety, frightening experiences, raised blood pressure, headache; rare prolonged psychosis or perceptual disturbance |
| Status (as described in this module) | FDA declined in August 2024; not approved in the USA; authorised prescribing in Australia | Two positive phase 3 trials; FDA application being completed; not approved |
| India | Controlled under the NDPS Act | Controlled under the NDPS Act |

### Shared problems
- **Functional unblinding**: most participants can tell which arm they are in.
- **Drug plus therapy**: hard to know which part does the work.
- **Selected participants**: people with psychosis risk, bipolar disorder and high suicide risk were excluded.
- **Vulnerability during sessions**: the need for two-therapist and recording policies after misconduct in an earlier trial.
:::

:::qa Explain how xanomeline-trospium treats psychosis without blocking dopamine D2 receptors. [beginner]
### Short answer
Xanomeline stimulates **muscarinic M4 and M1 receptors** in the brain. M4 stimulation **reduces dopamine release** in the circuits that are overactive in psychosis, so the effect on dopamine happens **upstream**, rather than by blocking the receptor at the end. Trospium blocks muscarinic receptors in the body (not the brain) to cut side effects.

### The mechanism, step by step
1. In psychosis, too much dopamine is released in the **associative striatum** (part of the mesolimbic and mesostriatal system).
2. Acetylcholine neurons in the brainstem drive the dopamine neurons of the midbrain. **M4 receptors** on these cholinergic neurons act as brakes: stimulating them reduces the drive.
3. M4 receptors in the **striatum** also reduce dopamine release locally.
4. Result: **less dopamine release** where it is excessive, without D2 blockade in the nigrostriatal (movement) and tuberoinfundibular (prolactin) pathways.
5. **M1 receptors** in the cortex and hippocampus may help **cognition**, which D2 blockers do not improve.
6. In the body, xanomeline would cause nausea, vomiting, sweating, salivation and diarrhoea (cholinergic effects). **Trospium**, which cannot cross the blood-brain barrier, blocks these.

### Consequences
| Effect | Because |
|---|---|
| Few movement side effects | No D2 block in the nigrostriatal pathway |
| No prolactin rise | No D2 block in the tuberoinfundibular pathway |
| Little weight gain | No strong histamine or serotonin 2C block |
| Nausea, constipation, dry mouth, fast pulse | Leftover cholinergic and anticholinergic effects |
| Avoid in urinary retention and narrow-angle glaucoma | Trospium's anticholinergic action |
:::

:::qa A 28-year-old with schizophrenia has troublesome parkinsonism and high prolactin on risperidone. How would xanomeline-trospium compare with switching to another antipsychotic? [beginner]
### Step 1: confirm the problem
Parkinsonism and raised prolactin (with possible menstrual changes, galactorrhoea, sexual problems) are D2-related side effects of risperidone.

### Step 2: list the evidence-based options
| Option | Expected effect on parkinsonism and prolactin | Other trade-offs | Evidence level |
|---|---|---|---|
| Lower the risperidone dose | May improve both | Risk of relapse | Established |
| Switch to aripiprazole | Prolactin usually falls; less parkinsonism | Akathisia, restlessness | Established |
| Switch to quetiapine or olanzapine | Less parkinsonism and prolactin | Weight gain, sedation, metabolic risk | Established |
| Switch to xanomeline-trospium | Trials show few movement effects and no prolactin rise | Nausea, constipation, twice-daily dosing away from food; no head-to-head trials against established drugs; limited availability in India | Newer; acute trials and open-label extension data |

### Step 3: decide with the patient
1. Licensed, accessible, well-studied options usually come first in India.
2. Xanomeline-trospium is a reasonable consideration where available and affordable, especially if D2-related side effects persist on several drugs.
3. Any switch should be **gradual** (cross-taper), with close follow-up for relapse.

### Monitoring after any switch
Mental state, side effects (including bowel and bladder for xanomeline-trospium), heart rate, liver tests where advised, and adherence.
:::

:::qa How do neuroactive steroids such as zuranolone work, and why were they tested first in postpartum depression? [beginner]
### Short answer
Zuranolone is a **positive allosteric modulator of GABA-A receptors**: it does not switch the receptor on by itself but makes it respond more strongly to GABA, the brain's main calming transmitter. It is related to **allopregnanolone**, a natural steroid made from progesterone. Levels of these steroids rise greatly in pregnancy and **fall abruptly after childbirth**, which made postpartum depression the obvious first target.

### Step by step
1. In pregnancy, progesterone and allopregnanolone levels climb very high.
2. GABA-A receptors adapt to this high level.
3. After birth, the levels crash within days.
4. In some women, the receptors do not readjust quickly, which may contribute to anxiety and depression.
5. A neuroactive steroid **restores the calming signal**, acting on both synaptic receptors and extrasynaptic receptors (which carry a steady, "tonic" inhibitory current).

### The products
| Product | Route | Status (USA, as described here) |
|---|---|---|
| Brexanolone | Continuous IV infusion over about 60 hours in a monitored setting | Approved for postpartum depression in 2019 |
| Zuranolone | Tablets each evening for a short course | Approved for postpartum depression in August 2023; not approved for major depressive disorder |

### Why it is different from usual antidepressants
- Works through GABA rather than serotonin or noradrenaline.
- A **short course** rather than months of daily treatment.
- Benefit appeared within days in trials.

### Cautions
Sleepiness and impaired driving; combined effects with alcohol and other sedatives; limited data on breastfeeding.
:::

:::qa A man with schizophrenia on clozapine has gained 18 kg and developed prediabetes. Outline a step-by-step plan, and say where a GLP-1 medicine fits. [beginner]
### Step 1: assess
- Weight, BMI, waist, blood pressure, fasting glucose or HbA1c, lipids, liver tests.
- Diet, activity, smoking, sleep, other medicines.
- His priorities and his mental state: clozapine may be the only medicine that has controlled his psychosis.

### Step 2: do not stop clozapine without good reason
Clozapine is the treatment of choice for treatment-resistant schizophrenia. The aim is to **manage the weight**, not lose the benefit.

### Step 3: lifestyle support first and throughout
- Structured diet and activity programmes, ideally with family involvement.
- Address sugary drinks and snacking driven by sedation and hunger.

### Step 4: medicines for weight and glucose
| Option | Evidence | Notes |
|---|---|---|
| Metformin | Good evidence for modest weight loss in people on antipsychotics | Cheap, widely available in India; gut side effects |
| GLP-1 receptor agonists (for example liraglutide, semaglutide) | Randomised evidence of weight loss in people on clozapine or olanzapine; widely used for antipsychotic weight gain | Nausea; check effects on oral medicine absorption; cost falling as cheaper versions appear |
| Aripiprazole add-on | Some weight benefit | May also reduce clozapine-related problems |

### Step 5: specific cautions
- **Constipation**: clozapine slows the gut, and GLP-1 medicines slow gastric emptying. Together they increase the risk of serious bowel problems. Monitor bowel habits closely and treat constipation early.
- **Mood**: ask about mood and suicidal thoughts routinely, as for any patient.
- **Eating behaviour**: check for disordered eating before starting.

### Step 6: review
Repeat weight and metabolic measures regularly and adjust the plan.
:::

:::qa Using the GLP-1 suicidality story, explain the difference between "no evidence of harm" and "evidence of no harm". [beginner]
### Short answer
**No evidence of harm** means nobody has found a problem, perhaps because nobody has looked well. **Evidence of no harm** means **good studies have looked carefully** and found that the risk is not raised, within a narrow margin of uncertainty.

### The story in stages
| Stage | What was known | Which kind of statement |
|---|---|---|
| Before 2023 | Few reports of suicidal thoughts; trials not designed to detect them | Little evidence either way |
| 2023 | Case reports from Iceland and elsewhere raised concern | A **signal**, not proof of harm |
| April 2024 | EMA safety review found no evidence of a causal link | Moving towards evidence of no harm |
| January 2026 | FDA analysis of 91 placebo-controlled trials (about 108,000 patients) and a cohort of over 2 million users found no increased risk; warnings removed | **Evidence of no harm**, with confidence limits |

### What makes it "evidence of no harm"
1. **Large numbers**: enough to detect a small increase if one existed.
2. **Comparison groups**: placebo in trials, a similar active drug in record studies.
3. **Narrow confidence intervals** around a risk ratio close to 1.
4. **Consistency** across different methods.

### What still holds
- No study can rule out a very rare effect in a small subgroup.
- Individual monitoring is still good practice: ask about mood in anyone on a weight-loss treatment, especially with a psychiatric history.
:::

:::qa What is treatment-resistant depression, and what must be checked before calling a patient "resistant"? [beginner]
### Short answer
Treatment-resistant depression (TRD) is usually defined as depression that has **not responded to at least two adequate trials of antidepressants** of adequate dose and duration in the current episode. Before using the label, **pseudo-resistance** must be ruled out.

### The checklist before saying "resistant"
| Check | Questions |
|---|---|
| Diagnosis | Is it really unipolar depression? Could it be bipolar depression, a psychotic depression or a personality-related pattern? |
| Adequate dose | Was the dose in the effective range? |
| Adequate duration | Was each medicine given long enough at that dose? |
| Adherence | Did the patient actually take it? Side effects, cost, beliefs? |
| Medical causes | Hypothyroidism, anaemia, vitamin B12 or D deficiency, sleep apnoea, chronic pain, medicines such as steroids |
| Substances | Alcohol, cannabis, sedatives |
| Psychosocial maintaining factors | Domestic violence, debt, caring burden, ongoing conflict |
| Comorbidity | Anxiety disorders, OCD, PTSD, personality difficulties |
| Psychotherapy | Has an evidence-based therapy been offered? |

### Staging
Resistance is a **continuum**: from failure of one adequate trial, through several, to failure of augmentation, combination and ECT. Some models score the number of failed trials, duration and severity.

### Why it matters for new treatments
Esketamine and psilocybin trials enrolled people with TRD. Applying these results needs the same definition: a patient who has had only a low dose of one drug for a short time is not the population studied.
:::

:::qa A new mother in Bhopal is tearful and not sleeping. How would you tell baby blues from postpartum depression, and what are the treatment options including the new ones? [beginner]
### Step 1: distinguish the conditions
| Feature | Baby blues | Postpartum depression | Postpartum psychosis |
|---|---|---|---|
| How common | Very common; affects many new mothers | Common, about one in seven to ten | Rare, about 1 to 2 per 1,000 |
| Onset | Within days of birth | Any time in the first months (may start in pregnancy) | Usually soon after birth, often within days |
| Duration | Settles on its own within days | Persists, often months | Acute emergency |
| Symptoms | Tearfulness, mood swings, feeling overwhelmed | Low mood, loss of interest, guilt, anxiety, sleep problems beyond the baby's waking, thoughts of harm | Confusion, mania, delusions, hallucinations |
| Function | Coping overall | Impaired | Severely impaired |
| Action | Reassurance, support, watchful waiting | Assessment and treatment | Urgent admission |

### Step 2: assess
- A screening tool such as the **Edinburgh Postnatal Depression Scale** (validated in several Indian languages), followed by a clinical interview.
- **Risk**: thoughts of self-harm or of harming the baby must be asked directly.
- Thyroid function, anaemia, support at home, family conflict, gender of the baby and family reaction, domestic violence.

### Step 3: treatment options
1. **Psychological**: counselling, CBT, IPT, peer support; family involvement.
2. **Medicines**: SSRIs such as sertraline are widely used, including with breastfeeding.
3. **Newer options (where available)**: zuranolone, a short course of tablets approved in the USA for postpartum depression; brexanolone infusion. Not standard in India; check availability and breastfeeding data.
4. **Severe or psychotic cases**: admission, sometimes ECT.

:::safety Ask about harm
In every new mother with low mood, ask about thoughts of self-harm and of harming the baby. Postpartum psychosis is a psychiatric emergency.
:::
:::

:::qa What do the failures of emraclidine and ulotaront teach us about new schizophrenia drugs? [beginner]
### Short answer
They show that **a new mechanism is not a guarantee**, that **placebo response in schizophrenia trials has grown**, and that results from one drug in a class do not automatically transfer to others.

### The cases
| Drug | Mechanism | What happened | Lessons |
|---|---|---|---|
| Ulotaront | TAAR1 agonist (with 5-HT1A activity); no D2 block | Phase 3 trials in 2023 did not separate from placebo; placebo responses were high | Strong early signals can vanish; trial conduct and placebo response matter |
| Emraclidine | Selective M4 positive allosteric modulator | Two phase 2 trials failed in November 2024 | Even a validated target (M4) can fail with a different molecule, dose or design |
| Xanomeline-trospium | M1/M4 agonist with peripheral blocker | Positive trials; approved in the USA in September 2024; add-on trial ARISE failed | One success in a class; limits in combination use |

### Why placebo response has risen in schizophrenia trials
1. More trial sites, sometimes with less experienced raters.
2. Patients recruited from commercial sites who may be less severely ill or who exaggerate at baseline.
3. Hospital admission for the trial itself improves symptoms (structure, food, medication supervision).

### What to say in an exam
"New mechanisms offer genuine hope for patients who cannot tolerate D2 blockers, but drug development in schizophrenia has a high failure rate. Each drug must be judged on its own trials, not on the reputation of its mechanism."
:::

:::qa How can researchers protect blinding in psychedelic and ketamine trials? [beginner]
### Short answer
Perfect blinding is impossible when a drug has obvious effects, but trials can reduce the problem with **active placebos**, **dose comparisons**, **blinded independent raters**, **measuring expectancy** and **checking how well blinding worked**.

### The tools
| Method | How it works | Limits |
|---|---|---|
| Active placebo | A comparator with noticeable effects, for example midazolam (sedation) in ketamine trials, niacin (flushing) or a low dose of the drug in psychedelic trials | Effects still differ from the real drug |
| Dose comparison | Compare a high dose with a very low dose of the same drug | Low doses may have some effect, shrinking the difference |
| Blinded remote raters | Outcome assessors, who are not present at sessions, interview by video | Patients may reveal their group |
| Measure expectancy | Ask about expected benefit before treatment and adjust for it | Measures are crude |
| Blinding index | Ask patients and raters to guess the group, and report the results | Shows the problem; does not fix it |
| Masking the purpose | Tell participants they may receive one of several drugs with different effects | Ethical limits on deception |
| Long follow-up | Effects driven by expectation may fade faster | Costly |

### Why it matters
In the MDMA and psilocybin programmes, most participants correctly guessed their group. Regulators treat this as a serious source of bias, which is one reason the FDA declined MDMA in 2024.
:::
`;
