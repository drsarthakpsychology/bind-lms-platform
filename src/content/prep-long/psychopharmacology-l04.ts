import type { LongQA } from "@/lib/prep/long-types";
import { anchored, chain, compare, curve, timeline, tree } from "./visual";

export const PSYCHOPHARMACOLOGY_L04: LongQA[] = anchored([
  {
    id: "phar-l04-001",
    subject: "psychopharmacology",
    topic: "lithium",
    marks: 15,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "Discuss lithium: mechanism of action, indications, pharmacokinetics, adverse effects, monitoring and toxicity.",
    plan: ["History", "Mechanisms", "Indications", "Pharmacokinetics and interactions", "Adverse effects and monitoring", "Toxicity and conclusion"],
    answer: `## History
John Cade, an Australian psychiatrist, reported in 1949 that lithium calmed manic patients. Mogens Schou's trials in Denmark established its prophylactic effect. It remains the gold standard mood stabiliser.

## Mechanisms
The exact mechanism is unknown; several actions are proposed:
- Inhibition of inositol monophosphatase, depleting inositol and dampening the phosphoinositide second messenger system in overactive neurons (the inositol depletion hypothesis).
- Inhibition of glycogen synthase kinase 3 beta, which influences gene expression, circadian rhythms and cell survival.
- Increased neuroprotective proteins (BCL 2, BDNF) and preserved grey matter volume.
- Reduced dopamine and glutamate signalling and increased serotonin function.
- Effects on circadian clock genes.

## Indications
- Acute mania (often with an antipsychotic).
- Maintenance treatment of bipolar disorder, preventing both mania and depression.
- Bipolar depression (modest acute effect).
- Augmentation in treatment resistant unipolar depression.
- Prevention of recurrent unipolar depression.
- Reduction of suicide and suicidal behaviour in mood disorders.
- Schizoaffective disorder; aggression in some settings.

## Pharmacokinetics
- Completely absorbed; peak levels in two to four hours (later with slow release forms such as Lithosun SR in India).
- Not protein bound or metabolised; distributed in body water; excreted almost entirely by the kidneys, reabsorbed with sodium in the proximal tubule.
- Half life about 18 to 36 hours; longer in older adults.
- Narrow therapeutic range: 0.6 to 0.8 mmol per litre for maintenance (up to 1.0 for acute mania or if relapsing); toxicity is likely above 1.5.
- Levels rise with dehydration, sodium restriction, fever, vomiting and diarrhoea, and with NSAIDs, ACE inhibitors, angiotensin receptor blockers and thiazide diuretics. Theophylline and caffeine lower levels.

## Adverse effects
| System | Effects |
| Neurological | Fine tremor, cognitive dulling, fatigue; coarse tremor and ataxia in toxicity |
| Renal | Polyuria and polydipsia (nephrogenic diabetes insipidus), reduced eGFR with long term use, rarely chronic kidney disease |
| Thyroid | Hypothyroidism (more in women), goitre |
| Parathyroid | Hyperparathyroidism with high calcium |
| Cardiac | T wave flattening, sinus node dysfunction |
| Skin | Acne, psoriasis worsening, hair loss |
| Metabolic | Weight gain, oedema |
| Gastrointestinal | Nausea, diarrhoea, especially early |
| Pregnancy | Small increased risk of cardiac malformations (Ebstein anomaly), lower than once thought |

## Monitoring
- Baseline: renal function and eGFR, thyroid function, calcium, weight, ECG if heart disease or older age, pregnancy test.
- Levels 12 hours after the last dose, five to seven days after starting or changing the dose, then every three months in the first year and every six months after that (more often in older people or with interacting drugs).
- Renal and thyroid function and calcium every six months; weight yearly.
- Patient education: a lithium card, signs of toxicity, staying hydrated, avoiding over the counter NSAIDs, and what to do during illness with vomiting or diarrhoea.

## Toxicity
- Features: vomiting, diarrhoea, coarse tremor, ataxia, slurred speech, confusion, myoclonus, seizures, arrhythmias, coma; can cause permanent cerebellar damage (SILENT syndrome).
- Causes: overdose, dehydration, interacting drugs, renal impairment.
- Management: stop lithium, check levels, renal function and electrolytes; intravenous fluids; avoid nephrotoxic drugs; haemodialysis for severe toxicity (high levels with neurological features or renal failure). Activated charcoal does not bind lithium; whole bowel irrigation can help with slow release overdose.

## Conclusion
Lithium is the most effective long term treatment for bipolar disorder and uniquely reduces suicide, but its narrow therapeutic range, renal excretion and organ effects demand careful monitoring and education.`,
    keyPoints: ["Cade 1949 and Schou", "Inositol and GSK 3 beta mechanisms", "Indications including anti suicide effect", "Renal excretion and half life", "Target levels and toxic level", "Interactions raising levels", "Adverse effects including renal, thyroid, parathyroid", "Monitoring schedule and toxicity management with dialysis"],
    pitfalls: ["Checking levels at the wrong time", "Forgetting calcium and parathyroid", "Using activated charcoal for lithium"],
    visuals: [
      curve("half-life", "Pharmacokinetics", "Levels reach steady state in about five days; check 12 hours after the last dose."),
      tree("Adverse effects", [["Lithium", "", -1], ["Kidney", "Polyuria, reduced eGFR", 0], ["Thyroid", "Hypothyroidism", 0], ["Parathyroid", "High calcium", 0], ["Brain", "Tremor, cognitive dulling", 0], ["Skin and weight", "Acne, psoriasis, weight gain", 0]]),
    ],
    module: "stabilisers",
    ref: "Cade 1949; Maudsley lithium; Stahl ch 8 mood stabilisers; Cipriani 2013 BMJ lithium suicide; NICE CG185 monitoring; Munk-Olsen 2018 Ebstein risk",
  },
  {
    id: "phar-l04-002",
    subject: "psychopharmacology",
    topic: "lithium-toxicity",
    marks: 5,
    difficulty: 2,
    exams: ["md-psychiatry"],
    question: "A 60-year-old woman on lithium for bipolar disorder presents with vomiting, coarse tremor and confusion after starting ibuprofen for knee pain. Write short notes on your management.",
    plan: ["Recognise toxicity and causes", "Immediate assessment", "Treatment", "Prevention and restarting"],
    answer: `## Recognition
Vomiting, coarse tremor and confusion in a patient on lithium suggest lithium toxicity. Ibuprofen, an NSAID, reduces renal lithium clearance; vomiting causes dehydration, which raises levels further. Older age and lower renal function add risk.

## Immediate assessment
- Vital signs, hydration, consciousness, neurological signs (ataxia, myoclonus, hyperreflexia, seizures).
- Urgent serum lithium (noting time of last dose), renal function, electrolytes, calcium, thyroid function, glucose and ECG (bradycardia, QT changes, conduction block).
- Look for other causes of confusion such as infection or hyponatraemia.

## Treatment
- Stop lithium and ibuprofen.
- Intravenous fluids (normal saline) to restore volume and promote excretion, with careful monitoring of fluid balance and sodium.
- Repeat lithium levels every few hours, because levels may rise again as lithium leaves tissues.
- Haemodialysis for severe toxicity: high levels (for example above about 4 mmol per litre, or above 2.5 with renal impairment or severe neurological features), seizures, reduced consciousness or arrhythmias.
- Treat seizures with benzodiazepines; cardiac monitoring.
- Activated charcoal is not useful for lithium.

## Prevention and restarting
- After recovery, decide with her whether to restart lithium at a lower dose with closer monitoring or to change to another mood stabiliser.
- Advise avoiding NSAIDs; use paracetamol for pain; inform her physician and pharmacist.
- Teach her to stop lithium and seek help during vomiting, diarrhoea or fever ("sick day rules").
- Check that she has a lithium card and knows the symptoms of toxicity.

## Conclusion
Lithium toxicity is a preventable emergency; stopping the drug, fluids, repeated levels and dialysis when severe are the core of management.`,
    keyPoints: ["Recognition and NSAID interaction", "Urgent levels, renal function, ECG", "Stop lithium and NSAID", "Intravenous fluids and repeated levels", "Dialysis indications", "No activated charcoal", "Sick day rules and avoiding NSAIDs"],
    visuals: [chain("Treatment", [["Stop lithium and NSAID", ""], ["Bloods and ECG", "Level, renal function, sodium"], ["IV fluids", "Restore volume"], ["Repeat levels", "Every few hours"], ["Dialysis if severe", "Neurological signs or very high level"]])],
    module: "stabilisers",
    ref: "Maudsley lithium toxicity; EXTRIP 2015 lithium dialysis recommendations",
  },
  {
    id: "phar-l04-003",
    subject: "psychopharmacology",
    topic: "valproate",
    marks: 10,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "Discuss valproate: mechanism, indications, adverse effects and its special risks in women of childbearing potential.",
    plan: ["Mechanism", "Indications and dosing", "Adverse effects", "Pregnancy and women: teratogenicity and regulation", "Monitoring and conclusion"],
    answer: `## Mechanism
Valproate (sodium valproate, divalproex) blocks voltage gated sodium channels, increases GABA levels by inhibiting its breakdown, reduces T type calcium currents, and inhibits histone deacetylase, which affects gene expression. Its mood stabilising action may involve reduced glutamate signalling and effects on intracellular signalling similar to lithium.

## Indications and dosing
- Acute mania, especially mixed and rapid cycling presentations; can be loaded at 20 to 30 mg per kg for faster effect.
- Maintenance treatment of bipolar disorder (less effective than lithium in the BALANCE trial).
- Epilepsy (generalised and focal seizures).
- Migraine prophylaxis.
- Target blood levels about 50 to 100 mg per litre.
It is widely used in India (brands include Valparin and Encorate).

## Adverse effects
- Common: nausea, tremor, sedation, weight gain, hair loss (with curly regrowth), increased appetite.
- Hepatotoxicity: rare but serious, highest in young children and with polytherapy; check liver tests.
- Pancreatitis: rare; abdominal pain needs urgent assessment.
- Thrombocytopenia and platelet dysfunction.
- Hyperammonaemic encephalopathy, even with normal liver tests.
- Polycystic ovary syndrome and menstrual irregularities.
- Interactions: inhibits lamotrigine metabolism (halve the lamotrigine dose), raises free phenytoin; carbamazepine lowers valproate levels.

## Pregnancy and women
- Valproate is the most teratogenic common mood stabiliser. Exposure in pregnancy carries about a 10 percent risk of major malformations (neural tube defects such as spina bifida, heart defects, cleft palate, hypospadias) and a risk of neurodevelopmental problems (lower IQ, autism and ADHD) in up to 30 to 40 percent of exposed children.
- Regulatory bodies in many countries (including the UK and the European Union) say valproate must not be started in women and girls who could become pregnant unless no other treatment works and a pregnancy prevention programme is in place, with effective contraception and annual review; similar caution now applies to starting it in men in some countries because of possible risks to children.
- For bipolar disorder, valproate should generally be avoided in women of childbearing potential; lithium, lamotrigine (for depressive relapse prevention) or antipsychotics are preferred.
- If a woman on valproate plans pregnancy or becomes pregnant, seek specialist advice promptly; do not stop abruptly in epilepsy. Folic acid (high dose) is recommended but does not remove the risk.

## Monitoring
Baseline and periodic liver tests, blood count and platelets, weight; blood levels when needed for adherence or toxicity; pregnancy test and contraception discussion.

## Conclusion
Valproate is an effective antimanic and antiepileptic drug, but its serious risks in pregnancy mean it should be avoided in women and girls who might become pregnant unless there is no alternative and strict precautions are taken.`,
    keyPoints: ["Sodium channel and GABA mechanisms", "Indications with loading dose and levels", "Common side effects and hair loss", "Hepatotoxicity, pancreatitis, thrombocytopenia, hyperammonaemia", "PCOS", "Lamotrigine interaction", "Teratogenic and neurodevelopmental risk figures", "Pregnancy prevention requirements and alternatives"],
    visuals: [compare("Pregnancy and women", ["Valproate in pregnancy", ["About 10 percent major malformations", "Neurodevelopmental problems in up to a third", "Neural tube and heart defects"], "Avoid in women who could become pregnant"], ["Safer alternatives in bipolar disorder", ["Lithium with monitoring", "Lamotrigine for depressive relapse", "Some antipsychotics"], "Discuss and plan before pregnancy"])],
    module: "stabilisers",
    ref: "Maudsley valproate; MHRA valproate Pregnancy Prevention Programme 2018, 2023 update; Tomson 2018 EURAP; Bromley 2014 Cochrane; BALANCE 2010",
  },
  {
    id: "phar-l04-004",
    subject: "psychopharmacology",
    topic: "carbamazepine-lamotrigine",
    marks: 10,
    difficulty: 3,
    exams: ["md-psychiatry"],
    question: "Compare carbamazepine and lamotrigine as mood stabilisers.",
    plan: ["Mechanisms", "Indications and evidence", "Adverse effects including skin reactions", "Interactions and titration", "Comparison table and conclusion"],
    answer: `## Mechanisms
Both block voltage gated sodium channels and reduce glutamate release. Lamotrigine's effect on glutamate is thought to underlie its antidepressant action in bipolar disorder.

## Indications and evidence
- Carbamazepine: acute mania and maintenance (second line, after lithium), trigeminal neuralgia, epilepsy; extended release carbamazepine is approved for mania in the USA. Oxcarbazepine has weaker evidence in mania.
- Lamotrigine: prevention of depressive relapse in bipolar disorder (especially bipolar II and depressive predominant illness); weak or no effect in acute mania; modest effect in acute bipolar depression; epilepsy.

## Adverse effects
Carbamazepine:
- Dizziness, diplopia, ataxia, sedation, nausea.
- Hyponatraemia (SIADH), especially with oxcarbazepine.
- Leucopenia (usually mild) and rarely agranulocytosis and aplastic anaemia; liver enzyme rise.
- Rash in up to 10 percent; Stevens Johnson syndrome and toxic epidermal necrolysis, strongly linked to HLA-B*15:02 in people of South and East Asian ancestry; testing before starting is advised in at risk groups.
- Teratogenic: neural tube defects (lower risk than valproate).
Lamotrigine:
- Generally well tolerated: headache, dizziness, nausea, insomnia, no weight gain, little sedation or sexual dysfunction.
- Rash in about 5 to 10 percent; serious rash (Stevens Johnson syndrome) in about 1 in 1000 adults, more with fast titration, valproate co-prescription and in children.
- Relatively safer in pregnancy among mood stabilisers, though levels fall in pregnancy.

## Interactions and titration
- Carbamazepine induces CYP3A4 and other enzymes and its own metabolism (autoinduction), lowering levels of antipsychotics (quetiapine, lurasidone, haloperidol), antidepressants, benzodiazepines, oral contraceptives, warfarin and ART drugs. It is often avoided for this reason.
- Lamotrigine must be titrated slowly: typically 25 mg daily for two weeks, 50 mg for two weeks, then increases to 100 to 200 mg. With valproate, use half these doses; with carbamazepine or other inducers, roughly double. If more than five half lives (about five days) are missed, restart titration from the beginning. Oral contraceptives lower lamotrigine levels.

## Comparison
| Feature | Carbamazepine | Lamotrigine |
| Best use | Mania, second line maintenance | Prevention of bipolar depression |
| Acute mania | Effective | Not effective |
| Weight and sedation | Some sedation | Little |
| Serious skin risk | HLA-B*15:02 linked SJS | SJS with fast titration |
| Interactions | Strong inducer, many | Few, but valproate doubles levels |
| Blood monitoring | Blood count, sodium, liver | Not routinely needed |
| Pregnancy | Teratogenic | Relatively safer |

## Conclusion
Carbamazepine is an antimanic drug with many interactions and blood risks; lamotrigine is a well tolerated drug for preventing bipolar depression that needs slow titration to avoid serious rash.`,
    keyPoints: ["Sodium channel and glutamate mechanisms", "Carbamazepine for mania and lamotrigine for depressive relapse", "Carbamazepine hyponatraemia, blood dyscrasias, HLA-B*15:02", "Lamotrigine rash risk with fast titration and valproate", "Carbamazepine enzyme induction examples", "Lamotrigine titration and restart rule", "Comparison table"],
    visuals: [timeline("Interactions and titration: lamotrigine steps", [["25 mg daily", "Weeks 1 and 2"], ["50 mg daily", "Weeks 3 and 4"], ["100 mg daily", "Week 5"], ["100 to 200 mg maintenance", "Week 6 onward"]], "Halve the doses with valproate; restart from the beginning after a gap of more than five days.")],
    module: "stabilisers",
    ref: "Maudsley carbamazepine and lamotrigine; Stahl prescriber's guide; Calabrese 2003 lamotrigine maintenance; Chung 2004 HLA-B*1502",
  },
  {
    id: "phar-l04-005",
    subject: "psychopharmacology",
    topic: "benzodiazepines",
    marks: 10,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "Discuss the pharmacology, uses and problems of benzodiazepines.",
    plan: ["Mechanism at the GABA A receptor", "Classification by half life", "Uses", "Adverse effects and dependence", "Prescribing in India and conclusion"],
    answer: `## Mechanism
Benzodiazepines are positive allosteric modulators of the GABA A receptor, a chloride channel made of five subunits. They bind at the junction of alpha and gamma subunits and increase the frequency of chloride channel opening when GABA binds, causing neuronal inhibition. Receptors with alpha 1 subunits mediate sedation and amnesia; alpha 2 and 3 mediate anxiolysis and muscle relaxation. Flumazenil is a benzodiazepine antagonist.

## Classification
| Duration | Examples | Notes |
| Short | Midazolam, triazolam | Sedation for procedures |
| Intermediate | Lorazepam, alprazolam, oxazepam, temazepam | Lorazepam and oxazepam safer in liver disease (conjugation only) |
| Long | Diazepam, chlordiazepoxide, clonazepam, nitrazepam | Active metabolites; used for alcohol withdrawal and tapering |

## Uses
- Short term relief of severe anxiety and insomnia (two to four weeks).
- Panic disorder (clonazepam, alprazolam), usually as a bridge while SSRIs take effect.
- Alcohol withdrawal (chlordiazepoxide, diazepam, lorazepam).
- Acute agitation and rapid tranquillisation (lorazepam).
- Catatonia (lorazepam).
- Status epilepticus and seizure clusters (lorazepam, diazepam, midazolam).
- Akathisia, premedication and procedural sedation; muscle spasm.

## Adverse effects
- Sedation, drowsiness, poor concentration, psychomotor slowing (road accidents), anterograde amnesia.
- Falls and hip fractures in older people; possible link with dementia risk.
- Paradoxical disinhibition and aggression, especially in children, older adults and people with brain injury.
- Respiratory depression, particularly with opioids, alcohol, or in sleep apnoea and lung disease; most benzodiazepine deaths involve combinations.
- Tolerance to hypnotic effects within weeks; less to anxiolytic effects.
- Dependence: physical dependence after a few weeks of regular use; misuse and addiction in some, especially with alprazolam.
- Withdrawal: anxiety, insomnia, irritability, tremor, sweating, perceptual disturbances, depersonalisation, seizures and delirium after high doses.
- In pregnancy: neonatal sedation and withdrawal ("floppy infant").

## Prescribing in India
Benzodiazepines (especially alprazolam and clonazepam) are among the most widely prescribed psychotropics in India, often long term and without review, and are available without prescription in some places. Good practice is to use them for short periods, prefer SSRIs and psychological treatments for anxiety disorders and CBT-I for insomnia, avoid them in older adults and people with substance use, and taper long term users gradually.

## Conclusion
Benzodiazepines are rapid and effective for short term anxiety, insomnia, withdrawal, agitation and seizures, but tolerance, dependence, falls and respiratory risks limit long term use.`,
    keyPoints: ["Positive allosteric modulation increasing opening frequency", "Alpha subunit roles", "Classification by duration with examples", "Lorazepam and oxazepam in liver disease", "Uses including catatonia and alcohol withdrawal", "Adverse effects including falls and respiratory depression with opioids", "Tolerance, dependence and withdrawal", "Indian prescribing patterns"],
    visuals: [compare("Short term or long term use?", ["Short term (2 to 4 weeks)", ["Rapid relief of anxiety or insomnia", "Bridge until SSRIs work", "Alcohol withdrawal, agitation, catatonia"], "Helpful"], ["Long term", ["Tolerance and dependence", "Falls, memory problems, accidents", "Withdrawal on stopping"], "Usually harmful"], "Uses")],
    module: "stabilisers",
    ref: "Stahl ch 9 anxiolytics; Maudsley benzodiazepines; Ashton manual; Billioti de Gage 2014 BMJ dementia link",
  },
  {
    id: "phar-l04-006",
    subject: "psychopharmacology",
    topic: "benzodiazepine-withdrawal",
    marks: 5,
    difficulty: 2,
    exams: ["md-psychiatry"],
    question: "Write short notes on how to withdraw a patient from long term benzodiazepines.",
    plan: ["Who and why", "Preparation", "Tapering method", "Support and difficulties"],
    answer: `## Who and why
Many patients have taken benzodiazepines (often alprazolam or clonazepam) for months or years, with tolerance, cognitive effects, falls or dependence. Withdrawal improves alertness, memory and safety, and most people can stop with a planned taper.

## Preparation
- Discuss benefits and possible symptoms; agree on a voluntary, flexible plan.
- Assess for alcohol or other substance use, depression, anxiety disorders and insomnia that need treatment in their own right.
- Note the total daily dose and pattern of use.

## Tapering method
- Switch short acting drugs (alprazolam, lorazepam) to an equivalent dose of a long acting drug, usually diazepam (approximately 10 mg diazepam is equivalent to 0.5 to 1 mg alprazolam, 1 mg lorazepam or 0.5 mg clonazepam), to smooth levels; clonazepam can also be used.
- Reduce the dose by about 5 to 10 percent every one to two weeks, or by small fixed steps such as 1 to 2 mg of diazepam, slowing down at lower doses.
- Total duration is commonly 2 to 6 months, sometimes longer; the patient may pause but should not go back up.
- Abrupt withdrawal of high doses can cause seizures and delirium; inpatient detoxification is needed for very high doses or polysubstance use.

## Support
- CBT for anxiety and insomnia, relaxation and sleep hygiene.
- Regular review and reassurance that symptoms are usually temporary.
- Treat underlying anxiety or depression with an SSRI if indicated.
- Avoid substituting another sedative such as a Z drug.

## Conclusion
Slow, flexible tapering using a long acting benzodiazepine, with psychological support, allows most long term users to stop safely.`,
    keyPoints: ["Reasons to withdraw", "Assessment of comorbidity and other substances", "Switch to diazepam with equivalent doses", "Reductions of 5 to 10 percent every one to two weeks", "Duration of months; slower at low doses", "Seizure risk with abrupt stopping", "CBT support"],
    module: "stabilisers",
    ref: "Ashton manual benzodiazepine withdrawal; Maudsley benzodiazepine equivalent doses and withdrawal",
  },
  {
    id: "phar-l04-007",
    subject: "psychopharmacology",
    topic: "z-drugs-orexin",
    marks: 5,
    difficulty: 2,
    exams: ["md-psychiatry"],
    question: "Write short notes on Z drugs and orexin receptor antagonists as hypnotics.",
    plan: ["Z drugs: mechanism and use", "Problems with Z drugs", "Orexin antagonists: mechanism and use", "Place in insomnia treatment"],
    answer: `## Z drugs
- Zolpidem, zopiclone (and eszopiclone) and zaleplon are non benzodiazepine hypnotics that act at the benzodiazepine site of GABA A receptors, with zolpidem being relatively selective for alpha 1 subunits (sedation).
- Short half lives (zolpidem about 2 to 3 hours, zopiclone about 5 hours) give sleep onset with less hangover.
- Used for short term treatment of insomnia, usually for up to two to four weeks.

## Problems
- Tolerance, dependence and rebound insomnia, as with benzodiazepines.
- Complex sleep behaviours (sleep walking, sleep driving, eating) with amnesia, which led to a boxed warning in the USA.
- Next day impairment, especially in women with zolpidem (lower doses recommended), and falls in older adults.
- Misuse and combination with alcohol or opioids.
- Bitter taste with zopiclone.

## Orexin receptor antagonists
- Suvorexant, lemborexant and daridorexant are dual orexin receptor antagonists. Orexin (hypocretin) from the lateral hypothalamus maintains wakefulness; blocking it allows sleep rather than sedating the brain broadly.
- Approved for insomnia with difficulty falling or staying asleep.
- Advantages: little rebound insomnia or withdrawal, low misuse potential, little effect on breathing; suitable for older adults.
- Side effects: somnolence, headache, abnormal dreams, sleep paralysis or hypnagogic hallucinations; contraindicated in narcolepsy.
- CYP3A4 substrates; avoid strong inhibitors.
- Availability in India is limited.

## Place in treatment
CBT for insomnia is first line. Hypnotics are for short term use or when CBT-I is not available or not enough; orexin antagonists may suit people needing longer treatment.

## Conclusion
Z drugs are effective short term hypnotics with benzodiazepine like risks; orexin antagonists offer a different mechanism with lower dependence risk.`,
    keyPoints: ["Z drugs act at GABA A benzodiazepine site", "Short half lives and short term use", "Complex sleep behaviours warning", "Orexin role in wakefulness", "Named orexin antagonists", "Lower rebound and misuse; contraindicated in narcolepsy", "CBT-I first line"],
    module: "stabilisers",
    ref: "Maudsley hypnotics; FDA 2019 boxed warning; Herring 2016 suvorexant; Mignot 2022 daridorexant",
  },
  {
    id: "phar-l04-008",
    subject: "psychopharmacology",
    topic: "buspirone-pregabalin",
    marks: 5,
    difficulty: 2,
    exams: ["md-psychiatry"],
    question: "Write short notes on buspirone and pregabalin as anxiolytics.",
    plan: ["Buspirone mechanism and use", "Buspirone limits", "Pregabalin mechanism and use", "Pregabalin misuse and cautions"],
    answer: `## Buspirone
- Mechanism: partial agonist at 5 HT1A receptors (presynaptic autoreceptors in the raphe and postsynaptic receptors in limbic areas); weak D2 antagonist.
- Use: generalised anxiety disorder; augmentation in depression (as in STAR*D); sometimes for SSRI induced sexual dysfunction.
- Dose: 5 mg two or three times a day, increasing to 30 to 60 mg a day in divided doses.
- Advantages: no sedation, no dependence or withdrawal, no interaction with alcohol, no respiratory depression.
- Limits: delayed onset of two to four weeks; less helpful for people already used to benzodiazepines; not effective for panic disorder; dizziness, nausea and headache; CYP3A4 interactions.

## Pregabalin
- Mechanism: binds the alpha 2 delta subunit of voltage gated calcium channels, reducing calcium entry and release of glutamate, noradrenaline and substance P. It does not act on GABA receptors despite its structure.
- Use: licensed for GAD in Europe (150 to 600 mg a day); also for neuropathic pain, fibromyalgia and epilepsy; sometimes in alcohol and benzodiazepine withdrawal.
- Advantages: rapid onset within the first week; few drug interactions (renally excreted, not metabolised).
- Side effects: dizziness, sedation, weight gain, peripheral oedema, blurred vision.
- Cautions: misuse and dependence, especially in people with opioid use, and dangerous respiratory depression when combined with opioids; it is a controlled drug in some countries. Dose reduction in renal impairment. Withdrawal symptoms on abrupt stopping.

## Conclusion
Buspirone is a non sedating, non addictive but slow anxiolytic; pregabalin acts quickly and broadly but needs caution about misuse and opioid combinations.`,
    keyPoints: ["Buspirone 5 HT1A partial agonist", "Delayed onset and no dependence", "Not for panic", "Pregabalin alpha 2 delta mechanism", "Rapid onset and renal excretion", "Misuse and opioid respiratory risk"],
    module: "stabilisers",
    ref: "Stahl prescriber's guide; Maudsley anxiety; Evoy 2017 gabapentinoid misuse review",
  },
  {
    id: "phar-l04-009",
    subject: "psychopharmacology",
    topic: "mood-stabiliser-concept",
    marks: 5,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "Viva: What is a mood stabiliser? Which drugs meet the definition?",
    plan: ["The problem of definition", "Proposed definitions", "Drugs judged against them", "Clinical meaning"],
    answer: `## The problem of definition
"Mood stabiliser" is a clinical, not a regulatory, term. It is used loosely for drugs used in bipolar disorder, which makes it unclear.

## Proposed definitions
- Strict (Bauer and Mitchner): a drug that is effective in treating acute mania and acute bipolar depression, and in preventing both mania and depression, without worsening either pole (the "two by two" model).
- Broader: a drug that reduces the frequency or severity of any type of episode without worsening other aspects of the illness.

## Drugs judged against them
| Drug | Acute mania | Acute depression | Prevents mania | Prevents depression |
| Lithium | Yes | Modest | Yes | Yes |
| Valproate | Yes | Limited | Yes | Limited |
| Carbamazepine | Yes | Limited | Yes | Limited |
| Lamotrigine | No | Modest | Weak | Yes |
| Quetiapine | Yes | Yes | Yes | Yes |
Lithium comes closest to the classical concept and also reduces suicide. Quetiapine has evidence in all four areas. Other antipsychotics (olanzapine, aripiprazole) are effective mainly against mania, and lurasidone and cariprazine for bipolar depression.

## Clinical meaning
In practice, no single drug suits every patient. Choice depends on the dominant polarity of past episodes, past response, side effects and plans for pregnancy. Antidepressants are not mood stabilisers and can destabilise mood when used alone.

## Conclusion
A mood stabiliser ideally treats and prevents both poles without causing a switch; lithium is the prototype, and quetiapine meets most criteria.`,
    keyPoints: ["Clinical rather than regulatory term", "Two by two definition", "Broader definition", "Table of drugs against criteria", "Lithium as prototype and quetiapine", "Choice by polarity"],
    visuals: [tree("Proposed definitions: the two by two model", [["Mood stabiliser", "", -1], ["Treats acute episodes", "", 0], ["Mania", "", 1], ["Depression", "", 1], ["Prevents episodes", "", 0], ["Mania", "", 4], ["Depression", "", 4]])],
    module: "stabilisers",
    ref: "Bauer and Mitchner 2004; Goodwin BAP 2016 bipolar guideline",
  },
  {
    id: "phar-l04-010",
    subject: "psychopharmacology",
    topic: "lithium-suicide",
    marks: 5,
    difficulty: 3,
    exams: ["md-psychiatry"],
    question: "Write short notes on the anti-suicidal and neuroprotective effects of lithium.",
    plan: ["Evidence on suicide", "Possible mechanisms", "Neuroprotection evidence", "Clinical implications"],
    answer: `## Evidence on suicide
- Meta analyses of randomised trials in mood disorders show that lithium reduces suicide and deaths from all causes compared with placebo; one widely cited analysis found the risk of suicide was reduced by more than half.
- Large cohort studies find lower suicide and self harm rates in people taking lithium than in those on valproate or other mood stabilisers.
- Ecological studies suggest that areas with higher natural lithium levels in drinking water have slightly lower suicide rates, though this is weaker evidence.
- The effect is seen in both bipolar disorder and recurrent unipolar depression.
- Stopping lithium abruptly is followed by a rise in suicidal behaviour.

## Possible mechanisms
Reduction of impulsivity and aggression (through serotonin effects), prevention of mood episodes, reduction of mixed states, and possibly direct effects on brain circuits involved in suicidal behaviour.

## Neuroprotective effects
- Lithium inhibits GSK 3 beta and increases BCL 2 and BDNF, which protect neurons.
- Imaging studies show larger grey matter volume, especially in the hippocampus and prefrontal cortex, in people with bipolar disorder taking lithium.
- Observational studies link long term lithium use to lower dementia risk, and small trials suggest benefit in mild cognitive impairment; evidence is not yet strong enough to recommend it for prevention.

## Clinical implications
Lithium should be considered for patients with mood disorders and high suicide risk, continued long term with monitoring, and stopped only gradually. Overdose risk means limited quantities and family supervision where risk is high.

## Conclusion
Lithium is the only mood stabiliser with strong evidence of reducing suicide, and it may protect the brain, adding to its value despite its monitoring needs.`,
    keyPoints: ["Meta analysis showing reduced suicide and deaths", "Cohort comparisons with valproate", "Drinking water studies as weaker evidence", "Rise after abrupt stopping", "Impulsivity mechanism", "GSK 3 beta, BCL 2, BDNF and grey matter", "Dementia link is observational"],
    module: "stabilisers",
    ref: "Cipriani 2013 BMJ; Baldessarini 2006; Song 2017 Swedish cohort; Kessing 2017 lithium water dementia; Forlenza 2011 MCI trial",
  },
]);
