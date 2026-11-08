import type { LongQA } from "@/lib/prep/long-types";
import { anchored, brain, compare } from "./visual";

export const PSYCHOPHARMACOLOGY_L05: LongQA[] = anchored([
  {
    id: "phar-l05-001",
    subject: "psychopharmacology",
    topic: "adhd-medicines",
    marks: 10,
    difficulty: 2,
    exams: ["md-psychiatry"],
    question: "Discuss the pharmacological treatment of ADHD.",
    plan: ["Rationale and place of medicines", "Stimulants: mechanism, preparations, dosing", "Non stimulants", "Adverse effects and monitoring", "Special issues and conclusion"],
    answer: `## Rationale
ADHD involves under activity of dopamine and noradrenaline signalling in fronto striatal circuits. Medicines that enhance these transmitters improve attention, impulse control and hyperactivity. They are first line for school age children and adults with moderate to severe impairment, combined with behavioural and educational help; for preschool children, parent training comes first.

## Stimulants
- Methylphenidate blocks dopamine and noradrenaline transporters. Immediate release forms act for about four hours; extended release forms (such as OROS methylphenidate) last 8 to 12 hours, avoiding doses at school. Usual dose about 0.3 to 1 mg per kg a day, titrated weekly.
- Amphetamines (dexamfetamine, lisdexamfetamine, a prodrug) block reuptake and also release dopamine and noradrenaline through VMAT2 and transporter reversal. Lisdexamfetamine is not available in India.
- Response rates are about 70 percent; the MTA study showed carefully managed medication was more effective than behavioural treatment alone for core symptoms.

## Non stimulants
- Atomoxetine: selective noradrenaline reuptake inhibitor, which also raises dopamine in the prefrontal cortex; takes four to six weeks for full effect; useful with tics, anxiety or substance misuse risk; warnings for suicidal thinking and rare liver injury.
- Alpha 2A agonists: guanfacine extended release and clonidine; useful with tics, sleep problems and aggression; cause sedation and hypotension, and must be tapered to avoid rebound hypertension.
- Viloxazine, a newer noradrenergic drug, is approved in the USA.
- Bupropion and modafinil are second line options in adults.

## Adverse effects
- Stimulants: reduced appetite and weight loss, insomnia, headache, abdominal pain, irritability and "rebound" in the evening, raised pulse and blood pressure, slowed growth in height (small), tics may be unmasked, and rarely psychosis or mania.
- Misuse and diversion, especially of immediate release stimulants among students.

## Monitoring
Baseline height, weight, pulse, blood pressure and cardiac history (ECG if heart disease or family history of sudden death); then height and weight every six months on growth charts, pulse and blood pressure at each dose change and every six months; review need annually, with planned breaks if appropriate.

## Special issues
- Methylphenidate is a scheduled drug in India; supply and cost can limit access.
- Adults: extended release preparations and attention to substance use.
- Comorbid autism or intellectual disability: lower doses, more side effects.
- Pregnancy: discuss risks and benefits.

## Conclusion
Stimulants are the most effective treatment for ADHD, with non stimulants as alternatives. Careful titration, monitoring of growth and cardiovascular measures, and combination with behavioural support give the best results.`,
    keyPoints: ["Dopamine and noradrenaline rationale", "Place of medicines by age", "Methylphenidate mechanism and preparations", "Amphetamine release mechanism", "Atomoxetine and alpha 2A agonists", "Adverse effects including growth and blood pressure", "Monitoring schedule", "Indian availability and misuse"],
    visuals: [brain("Rationale", { prefrontal: "Stimulants raise dopamine and noradrenaline: better attention and inhibition", "basal-ganglia": "Striatal dopamine: motor activity and reward timing" })],
    module: "child",
    ref: "Cortese 2018 Lancet Psychiatry ADHD NMA; MTA 1999; NICE NG87; Maudsley ADHD; Stahl ch 11",
  },
  {
    id: "phar-l05-002",
    subject: "psychopharmacology",
    topic: "dementia-medicines",
    marks: 10,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "Describe the drugs used to treat cognitive symptoms in dementia.",
    plan: ["Cholinergic hypothesis", "Cholinesterase inhibitors: drugs, uses, side effects", "Memantine", "Anti amyloid antibodies", "Practical points and conclusion"],
    answer: `## Cholinergic hypothesis
In Alzheimer disease, cholinergic neurons of the nucleus basalis of Meynert are lost early, and acetylcholine deficiency correlates with memory impairment. Increasing acetylcholine improves cognition modestly. Glutamate excitotoxicity and amyloid and tau pathology are other targets.

## Cholinesterase inhibitors
| Drug | Features | Dose |
| Donepezil | Reversible acetylcholinesterase inhibitor, once daily, long half life | 5 mg, then 10 mg |
| Rivastigmine | Inhibits acetylcholinesterase and butyrylcholinesterase; oral or skin patch | 1.5 mg twice daily rising to 6 mg twice daily; patch 4.6 to 9.5 mg per 24 hours |
| Galantamine | Acetylcholinesterase inhibitor and nicotinic modulator | 8 to 24 mg |
Uses: mild to moderate Alzheimer disease (donepezil also in severe); dementia with Lewy bodies and Parkinson disease dementia, where benefit for cognition, hallucinations and fluctuations is often marked; possibly mixed dementia. Not effective in frontotemporal dementia or mild cognitive impairment.
Effects: small improvements or slower decline in cognition, daily function and behaviour, seen in a proportion of patients.
Side effects: nausea, vomiting, diarrhoea, weight loss, insomnia and vivid dreams, muscle cramps, bradycardia, heart block and syncope (check pulse and ECG if there is heart disease), urinary incontinence; caution in asthma and peptic ulcer.

## Memantine
- Uncompetitive NMDA receptor antagonist that blocks excessive glutamate signalling while allowing normal transmission.
- For moderate to severe Alzheimer disease, alone or with a cholinesterase inhibitor.
- Dose: 5 mg, increasing weekly to 20 mg; reduce in renal impairment.
- Side effects: dizziness, headache, constipation, confusion; generally well tolerated.

## Anti amyloid antibodies
Lecanemab and donanemab are monoclonal antibodies that remove amyloid plaques. They are approved in the USA and some other countries for early Alzheimer disease (mild cognitive impairment or mild dementia) with confirmed amyloid. In trials they slowed decline by about a quarter to a third over 18 months, a modest effect. Risks include amyloid related imaging abnormalities (brain swelling and microbleeds), higher in APOE e4 carriers, so MRI monitoring is needed. Cost and infrastructure limit use, and they are not in routine use in India.

## Practical points
Set realistic expectations, review benefit after three to six months using cognitive tests and carer reports, stop if no benefit or poor tolerance, avoid anticholinergic drugs that work against cholinesterase inhibitors, and combine with non drug care and carer support.

## Conclusion
Cholinesterase inhibitors and memantine give modest symptomatic benefit in dementia, particularly in Alzheimer and Lewy body disease. Anti amyloid antibodies are the first disease modifying drugs but have small effects and important risks.`,
    keyPoints: ["Cholinergic hypothesis", "Table of three cholinesterase inhibitors with doses", "Uses including Lewy body dementia; not FTD", "Side effects including bradycardia", "Memantine mechanism and use", "Lecanemab and donanemab effect size and ARIA", "Review and avoid anticholinergics"],
    visuals: [compare("Cholinesterase inhibitors and memantine", ["Cholinesterase inhibitors", ["Raise acetylcholine", "Mild to moderate Alzheimer and Lewy body dementia", "Nausea, bradycardia"], "Cholinergic boost"], ["Memantine", ["Blocks excess glutamate at NMDA", "Moderate to severe Alzheimer", "Dizziness, constipation"], "Glutamate brake"])],
    module: "neurocognitive",
    ref: "Maudsley dementia; Birks Cochrane donepezil; van Dyck 2023 NEJM lecanemab; Sims 2023 JAMA donanemab; NICE NG97",
  },
  {
    id: "phar-l05-003",
    subject: "psychopharmacology",
    topic: "atomoxetine-guanfacine",
    marks: 5,
    difficulty: 2,
    exams: ["md-psychiatry"],
    question: "Write short notes on non stimulant medicines for ADHD.",
    plan: ["Why non stimulants", "Atomoxetine", "Alpha 2A agonists", "Choosing"],
    answer: `## Why non stimulants
Non stimulants are used when stimulants are ineffective or poorly tolerated, when there is a risk of misuse or diversion, with comorbid tics or anxiety, or when families prefer them.

## Atomoxetine
- A selective noradrenaline reuptake inhibitor. Because the prefrontal cortex has few dopamine transporters, dopamine there is cleared by the noradrenaline transporter, so atomoxetine also raises prefrontal dopamine without affecting the striatum (hence no misuse potential).
- Dose about 0.5 mg per kg rising to 1.2 mg per kg a day; full effect after four to six weeks or more.
- Side effects: nausea, reduced appetite, sleepiness or insomnia, raised pulse and blood pressure; warnings for suicidal thinking in young people and rare liver injury. CYP2D6 substrate (levels rise with fluoxetine or paroxetine).
- Available in India.

## Alpha 2A agonists
- Guanfacine (extended release) and clonidine act on postsynaptic alpha 2A receptors in the prefrontal cortex, strengthening signals in working memory networks.
- Useful for hyperactivity, impulsivity, aggression, tics and sleep problems; can be combined with stimulants.
- Side effects: sedation, fatigue, low blood pressure and bradycardia; stop gradually to avoid rebound hypertension.

## Choosing
Atomoxetine suits comorbid anxiety, tics or substance risk; guanfacine or clonidine suits tics, sleep difficulty and aggression. Both are less effective on average than stimulants.

## Conclusion
Non stimulants widen ADHD treatment choices, especially when misuse, tics or anxiety are concerns.`,
    keyPoints: ["Indications for non stimulants", "Atomoxetine mechanism and prefrontal dopamine", "Slow onset and warnings", "CYP2D6 interaction", "Alpha 2A mechanism", "Rebound hypertension; choosing"],
    module: "child",
    ref: "Stahl prescriber's guide; Maudsley ADHD non-stimulants; Arnsten alpha-2A prefrontal",
  },
  {
    id: "phar-l05-004",
    subject: "psychopharmacology",
    topic: "anti-amyloid",
    marks: 5,
    difficulty: 3,
    exams: ["md-psychiatry"],
    question: "Write short notes on anti-amyloid monoclonal antibodies in Alzheimer disease.",
    plan: ["Amyloid hypothesis", "Drugs and approvals", "Effect size and risks", "Critique and Indian relevance"],
    answer: `## Amyloid hypothesis
The amyloid cascade hypothesis proposes that accumulation of amyloid beta peptides into plaques starts a chain of tau tangles, inflammation, synaptic loss and neuronal death in Alzheimer disease.

## Drugs and approvals
- Aducanumab received accelerated approval in the USA in 2021 amid controversy over mixed trial results and was later withdrawn by the manufacturer.
- Lecanemab (approved in the USA in 2023) targets soluble amyloid protofibrils; given intravenously every two weeks.
- Donanemab (approved in the USA in 2024) targets deposited plaque; given monthly and can be stopped once plaque is cleared.
Both are for early symptomatic Alzheimer disease with amyloid confirmed by PET or cerebrospinal fluid.

## Effect size and risks
- In phase 3 trials, decline on clinical scales was slowed by about 27 percent (lecanemab) to about 35 percent (donanemab in a subgroup) over 18 months, which is a few months of delay; whether this is meaningful for patients is debated.
- Amyloid related imaging abnormalities: brain oedema (ARIA E) and microbleeds or haemosiderin (ARIA H), usually silent but sometimes causing headache, confusion, seizures and rarely death; risk is higher in APOE e4 carriers, especially homozygotes, and with anticoagulants. Regular MRI monitoring is required.
- Infusion reactions.

## Critique and Indian relevance
They are the first drugs to modify the disease process, supporting the amyloid hypothesis, but benefits are modest, costs are very high, and they need specialist diagnosis, biomarkers and MRI. They are not in routine use in India, where most dementia is diagnosed late. Prevention of risk factors (hypertension, diabetes, hearing loss, inactivity, low education) remains a larger public health priority.

## Conclusion
Anti amyloid antibodies slow early Alzheimer disease modestly at the cost of real risks and resources; careful patient selection is essential.`,
    keyPoints: ["Amyloid cascade hypothesis", "Lecanemab 2023 and donanemab 2024", "Early disease with confirmed amyloid", "Effect size about a quarter to a third", "ARIA risks and APOE e4", "Cost and Indian relevance"],
    module: "neurocognitive",
    ref: "van Dyck 2023 NEJM CLARITY AD; Sims 2023 JAMA TRAILBLAZER-ALZ 2; Livingston 2024 Lancet Commission",
  },
  {
    id: "phar-l05-005",
    subject: "psychopharmacology",
    topic: "modafinil",
    marks: 5,
    difficulty: 2,
    exams: ["md-psychiatry"],
    question: "Write short notes on modafinil.",
    plan: ["Mechanism", "Uses", "Side effects and interactions", "Misuse"],
    answer: `## Mechanism
Modafinil (and its R enantiomer armodafinil) is a wake promoting drug. It weakly blocks the dopamine transporter and increases activity of histamine, orexin, noradrenaline and glutamate systems while reducing GABA, without the strong dopamine release of amphetamines.

## Uses
- Excessive daytime sleepiness in narcolepsy.
- Obstructive sleep apnoea with persisting sleepiness despite CPAP.
- Shift work sleep disorder.
- Off label: fatigue in multiple sclerosis or depression, augmentation in depression, and ADHD in adults; evidence is modest.
Usual dose 100 to 200 mg in the morning.

## Side effects and interactions
- Headache, insomnia, anxiety, nausea, reduced appetite, raised blood pressure.
- Rare serious skin reactions (Stevens Johnson syndrome), especially in children, and psychiatric reactions such as mania or psychosis.
- It induces CYP3A4, reducing the effect of hormonal contraceptives (additional contraception is needed during and for two months after use) and other drugs; it inhibits CYP2C19.
- Possible risk of birth defects; avoid in pregnancy.

## Misuse
Modafinil is used as a "smart drug" by students and professionals, including in India, to stay awake for examinations. Its misuse potential is lower than amphetamines but real; healthy people gain little lasting cognitive benefit.

## Conclusion
Modafinil is useful for pathological sleepiness; prescribers should note contraceptive interactions, skin reactions and non medical use.`,
    keyPoints: ["Wake promoting mechanism", "Narcolepsy, OSA and shift work uses", "Dose", "Headache, insomnia, rare SJS", "CYP3A4 induction and contraception", "Student misuse"],
    module: "more-disorders",
    ref: "Stahl prescriber's guide modafinil; Maudsley; Battleday 2015 healthy users review",
  },
  {
    id: "phar-l05-006",
    subject: "psychopharmacology",
    topic: "melatonin",
    marks: 5,
    difficulty: 1,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "Write short notes on melatonin and melatonin receptor agonists in psychiatry.",
    plan: ["Physiology of melatonin", "Uses and evidence", "Related drugs", "Safety"],
    answer: `## Physiology
Melatonin is a hormone made from serotonin in the pineal gland, released at night in darkness under control of the suprachiasmatic nucleus. It signals "biological night" and helps shift the body clock (a chronobiotic effect) more than it sedates. Bright light at night suppresses it.

## Uses and evidence
- Insomnia in older adults: prolonged release melatonin (2 mg) for people aged 55 and over, for short courses, with modest effects.
- Sleep problems in children with autism spectrum disorder and ADHD: good evidence for faster sleep onset and longer sleep.
- Circadian rhythm disorders: delayed sleep phase disorder, jet lag and shift work, when timed correctly (a small dose several hours before the desired bedtime to advance the clock).
- Delirium prevention in some hospital studies (mixed evidence).
- Insomnia caused by beta blockers, which reduce melatonin.

## Related drugs
- Ramelteon and tasimelteon (MT1 and MT2 agonists) for insomnia and non 24 hour sleep wake disorder in blind people.
- Agomelatine, an antidepressant with MT1 and MT2 agonism and 5 HT2C antagonism.

## Safety
Generally safe: headache, dizziness, morning drowsiness, vivid dreams. Over the counter products vary widely in content. CYP1A2 metabolism means fluvoxamine raises levels markedly. Long term effects in children are less studied.

## Conclusion
Melatonin is a safe, mild hypnotic and an effective body clock regulator, most useful for circadian problems, older adults and children with neurodevelopmental disorders.`,
    keyPoints: ["Pineal synthesis from serotonin under SCN control", "Chronobiotic rather than sedative", "Uses in older adults and autism or ADHD", "Timing for circadian disorders", "Ramelteon and agomelatine", "Safety and fluvoxamine interaction"],
    module: "more-disorders",
    ref: "Maudsley melatonin; Gringras 2017 paediatric PR melatonin; Auld 2017 review",
  },
  {
    id: "phar-l05-007",
    subject: "psychopharmacology",
    topic: "naloxone-opioid",
    marks: 5,
    difficulty: 2,
    exams: ["md-psychiatry"],
    question: "Write short notes on naloxone and naltrexone.",
    plan: ["Shared mechanism", "Naloxone uses and dosing", "Naltrexone uses", "Precautions"],
    answer: `## Shared mechanism
Both are competitive opioid receptor antagonists, mainly at mu receptors, that block or reverse the effects of opioids. They differ in duration and oral availability.

## Naloxone
- Short acting (30 to 90 minutes), poor oral bioavailability, given intravenously, intramuscularly or intranasally.
- Use: emergency reversal of opioid overdose (coma, small pupils, slow breathing). Typical doses are 0.4 mg intravenously or intramuscularly, repeated every two to three minutes, or a nasal spray.
- Because its effect is shorter than that of many opioids (methadone, long acting morphine), patients must be observed for re-sedation, and repeated doses or an infusion may be needed.
- Take home naloxone for people who use opioids and their families reduces overdose deaths.
- It can precipitate acute withdrawal in dependent people; aim to restore breathing, not full alertness.

## Naltrexone
- Long acting, orally active (50 mg daily); a monthly injection exists in some countries.
- Uses: relapse prevention in opioid dependence after detoxification (blocks euphoria if opioids are used), and reduction of heavy drinking in alcohol use disorder (reduces reward from alcohol).
- Also used for self injury and impulse control problems with limited evidence.

## Precautions
- Naltrexone must start only after an opioid free period (usually 7 to 10 days) to avoid precipitated withdrawal.
- Loss of tolerance increases overdose risk if the person stops naltrexone and uses opioids again.
- It blocks opioid pain relief.
- Monitor liver function.

## Conclusion
Naloxone saves lives in overdose; naltrexone helps motivated people prevent relapse to opioids and reduce heavy drinking.`,
    keyPoints: ["Competitive mu antagonists", "Naloxone short action and routes", "Re-sedation risk", "Take home naloxone", "Naltrexone for opioid and alcohol relapse prevention", "Opioid free period and overdose risk after stopping"],
    module: "substance",
    ref: "WHO 2014 community naloxone guidelines; Maudsley opioid antagonists; Stahl prescriber's guide naltrexone",
  },
  {
    id: "phar-l05-008",
    subject: "psychopharmacology",
    topic: "anticholinergic-burden",
    marks: 5,
    difficulty: 2,
    exams: ["md-psychiatry"],
    question: "Write short notes on anticholinergic burden in older adults.",
    plan: ["Definition", "Drugs that contribute", "Harms", "How to reduce it"],
    answer: `## Definition
Anticholinergic burden is the cumulative effect of all medicines a person takes that block muscarinic acetylcholine receptors. Scales such as the Anticholinergic Cognitive Burden scale score each drug from 1 (possible) to 3 (strong); a total of 3 or more is clinically important.

## Drugs that contribute
- Strong: tricyclic antidepressants (amitriptyline), paroxetine, low potency antipsychotics (chlorpromazine), clozapine, olanzapine (moderate), trihexyphenidyl and procyclidine, first generation antihistamines (chlorphenamine, promethazine, hydroxyzine, diphenhydramine), bladder drugs (oxybutynin), some antispasmodics.
- Weaker: many cardiac and gastrointestinal drugs, which add up.

## Harms
- Peripheral: dry mouth, constipation, urinary retention, blurred vision, tachycardia, reduced sweating with heat stroke risk.
- Central: confusion, delirium, memory impairment, falls; long term high burden is associated with higher dementia risk in large studies.
- Reduced benefit from cholinesterase inhibitors in dementia.
- In older people these effects are stronger because of reduced cholinergic reserve.

## How to reduce it
- Review all medicines, including over the counter sleeping and cold remedies.
- Replace high burden drugs with alternatives (sertraline instead of amitriptyline or paroxetine; melatonin or CBT-I instead of antihistamines for sleep; mirabegron instead of oxybutynin).
- Avoid routine anticholinergics with antipsychotics.
- Deprescribe gradually and monitor.

## Conclusion
Anticholinergic burden is a hidden, modifiable cause of confusion and falls in older people; regular medication review reduces it.`,
    keyPoints: ["Definition and scoring scales", "Strong anticholinergic drugs", "Peripheral and central harms", "Dementia association", "Interference with cholinesterase inhibitors", "Medication review and alternatives"],
    module: "neurocognitive",
    ref: "Boustani ACB scale 2008; Coupland 2019 JAMA Intern Med anticholinergic dementia; Maudsley older adults",
  },
  {
    id: "phar-l05-009",
    subject: "psychopharmacology",
    topic: "disulfiram",
    marks: 5,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "Write short notes on disulfiram.",
    plan: ["Mechanism and the reaction", "Use and evidence", "Adverse effects and contraindications", "Practice in India"],
    answer: `## Mechanism and the reaction
Disulfiram irreversibly inhibits aldehyde dehydrogenase, the enzyme that converts acetaldehyde to acetate. If alcohol is taken, acetaldehyde builds up within minutes, causing the disulfiram ethanol reaction: flushing, throbbing headache, palpitations, tachycardia, nausea, vomiting, sweating, breathlessness and hypotension; severe reactions can cause arrhythmias, collapse and rarely death. The effect lasts up to about two weeks after the last dose because new enzyme must be made.

## Use and evidence
- An aversive (deterrent) treatment for people with alcohol dependence who choose abstinence.
- Usual dose 250 mg daily (sometimes 100 to 500 mg), started at least 24 hours after the last drink.
- Trials show it works mainly when taken under supervision, for example by a spouse or relative; unsupervised, adherence is poor and effects are weak.

## Adverse effects and contraindications
- Drowsiness, metallic taste, halitosis, headache, impotence.
- Hepatitis (rare but serious), peripheral neuropathy, optic neuritis, and psychosis at higher doses (it also inhibits dopamine beta hydroxylase, raising dopamine).
- Contraindications: heart disease, uncontrolled hypertension, psychosis, severe liver disease, pregnancy, and patients who cannot understand the reaction.
- Avoid hidden alcohol in foods, mouthwashes, syrups and aftershave.
- Never give without the patient's knowledge and informed consent.

## Practice in India
Disulfiram is widely used in India because families often supervise medication. Covert administration by relatives, without the patient's knowledge, still occurs and is unethical and dangerous.

## Conclusion
Disulfiram is an effective deterrent when taken with consent and supervision; liver disease, heart disease and psychosis are key contraindications.`,
    keyPoints: ["ALDH inhibition and acetaldehyde build up", "Features of the reaction", "Two week duration", "Supervision makes it effective", "Adverse effects including hepatitis and psychosis", "Contraindications and hidden alcohol", "Informed consent; covert use unethical"],
    module: "substance",
    ref: "Maudsley alcohol relapse prevention; Skinner 2014 meta-analysis disulfiram supervised",
  },
  {
    id: "phar-l05-010",
    subject: "psychopharmacology",
    topic: "glp1-new-drug",
    marks: 5,
    difficulty: 3,
    exams: ["md-psychiatry"],
    question: "Write short notes on GLP 1 receptor agonists in psychiatry.",
    plan: ["What they are", "Use for antipsychotic weight gain", "Possible effects on addiction and mood", "Safety questions"],
    answer: `## What they are
Glucagon like peptide 1 (GLP 1) receptor agonists, such as liraglutide and semaglutide, were developed for type 2 diabetes and obesity. They enhance glucose dependent insulin release, slow gastric emptying and act on hypothalamic and brainstem centres to reduce appetite. Tirzepatide also acts on GIP receptors.

## Antipsychotic weight gain
People with severe mental illness have high rates of obesity and diabetes. Trials show that liraglutide and exenatide reduce weight and improve glucose control in people taking clozapine or olanzapine, and semaglutide is being studied. They are now considered when lifestyle measures and metformin are not enough.

## Possible effects on addiction and mood
GLP 1 receptors are found in the ventral tegmental area and nucleus accumbens. Animal studies and early human studies suggest reduced alcohol intake and possibly reduced craving for other substances; large observational studies link semaglutide with lower rates of alcohol problems. Trials are ongoing. Effects on depression are uncertain.

## Safety questions
- Gastrointestinal effects (nausea, vomiting, constipation), gallstones, pancreatitis.
- Reports of suicidal thoughts led to regulatory reviews; analyses so far have not shown a clear causal link, but monitoring is advised in people with mental illness.
- Risk of dehydration (relevant for lithium levels) and malnutrition if intake drops a lot.
- Cost and supply.

## Conclusion
GLP 1 agonists are a promising tool against antipsychotic induced weight gain and may have roles in addiction, but psychiatric safety and long term data are still being gathered.`,
    keyPoints: ["Mechanism on insulin and appetite", "Evidence with clozapine and olanzapine weight gain", "Reward pathway receptors and alcohol findings", "Suicidality review without clear link", "GI and lithium dehydration cautions"],
    module: "frontiers",
    ref: "Larsen 2017 JAMA Psychiatry liraglutide clozapine; Wang 2024 Nat Med semaglutide alcohol; EMA 2024 PRAC review suicidality",
  },
]);
