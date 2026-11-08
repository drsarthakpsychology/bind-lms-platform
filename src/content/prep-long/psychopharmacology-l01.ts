import type { LongQA } from "@/lib/prep/long-types";
import { anchored, chain, compare, curve, vis } from "./visual";

export const PSYCHOPHARMACOLOGY_L01: LongQA[] = anchored([
  {
    id: "phar-l01-001",
    subject: "psychopharmacology",
    topic: "pharmacokinetics",
    marks: 15,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "Discuss the principles of pharmacokinetics relevant to psychiatric practice, with clinical examples.",
    plan: ["Define pharmacokinetics and pharmacodynamics", "Absorption and bioavailability", "Distribution, protein binding and the blood brain barrier", "Metabolism: phases, enzymes, first pass", "Elimination, half life, steady state and kinetics order", "Special populations and conclusion"],
    answer: `## Definitions
Pharmacokinetics is what the body does to a drug: absorption, distribution, metabolism and elimination. Pharmacodynamics is what the drug does to the body: its actions at receptors, transporters and enzymes. Understanding pharmacokinetics explains dosing schedules, interactions, toxicity and differences between patients.

## Absorption and bioavailability
- Most psychotropics are taken orally and absorbed in the small intestine.
- Bioavailability is the fraction of a dose that reaches the systemic circulation unchanged. It is reduced by incomplete absorption and by first pass metabolism in the gut wall and liver.
- Food can change absorption: lurasidone and ziprasidone need food for adequate absorption; lithium and many others do not.
- Routes that avoid first pass: intravenous, intramuscular, sublingual (buprenorphine, asenapine), intranasal (esketamine) and transdermal.
- Long acting injections release drug slowly, so absorption, not elimination, controls the time course ("flip flop" kinetics).

## Distribution
- Most psychotropics are lipophilic, so they cross the blood brain barrier and have large volumes of distribution, being stored in fat. This explains the long washout of fluoxetine and the persistence of some drugs after overdose; dialysis does not remove them.
- Lithium is water soluble with a small volume of distribution; it is not protein bound and is removed by dialysis.
- Protein binding: valproate, diazepam and many antidepressants are highly protein bound; displacement interactions (valproate and phenytoin) matter mainly when free levels are measured.
- The blood brain barrier and the P glycoprotein efflux pump limit entry of some drugs (risperidone and paliperidone are P glycoprotein substrates).

## Metabolism
- Phase 1 reactions (oxidation, reduction, hydrolysis) mainly by cytochrome P450 enzymes in the liver: CYP1A2, 2C9, 2C19, 2D6 and 3A4 handle most psychotropics.
- Phase 2 reactions (conjugation such as glucuronidation): lorazepam, oxazepam and temazepam are only conjugated, so they are safer in liver disease and old age; lamotrigine is glucuronidated, which is inhibited by valproate.
- Active metabolites prolong action: fluoxetine to norfluoxetine, diazepam to desmethyldiazepam, risperidone to paliperidone (9 hydroxyrisperidone), amitriptyline to nortriptyline.
- Enzyme induction (carbamazepine, smoking for CYP1A2, rifampicin) lowers levels over one to two weeks; inhibition (fluvoxamine, fluoxetine, paroxetine) raises levels within days. Carbamazepine induces its own metabolism (autoinduction) over the first few weeks, so doses often need increasing.

## Elimination and half life
- Most drugs are eliminated by the kidneys after liver metabolism. Lithium, gabapentin, pregabalin, amisulpride and sulpiride are excreted mainly unchanged by the kidneys, so renal impairment and dehydration raise their levels.
- Half life is the time for the plasma concentration to fall by half. It guides dosing interval and the time to steady state.
- Steady state is reached after about four to five half lives of regular dosing; levels should be measured only at steady state (for lithium, about five days after a dose change, 12 hours after the last dose).
- After stopping, about 97 percent is cleared after five half lives, which guides washout before switching (for example from an SSRI to an MAOI; five weeks after fluoxetine because of norfluoxetine).

## Order of kinetics
- First order: a constant fraction is eliminated per unit time; most drugs.
- Zero order: a constant amount is eliminated per unit time because enzymes are saturated: alcohol, and phenytoin at higher doses; small dose increases cause large level rises.

## Special populations
- Older adults: less renal and hepatic clearance, more body fat, more sensitivity; "start low, go slow".
- Children: faster metabolism in some cases, different side effect profiles.
- Pregnancy: increased volume and renal clearance; lithium and lamotrigine levels fall and need monitoring, then rise after delivery.
- Liver disease: prefer drugs with conjugation only or renal elimination; reduce doses.
- Renal disease: avoid or reduce lithium, gabapentin, pregabalin, amisulpride, paliperidone.
- Genetic variation in CYP2D6 and CYP2C19 creates poor and ultrarapid metabolisers.

## Conclusion
Pharmacokinetic principles explain why doses, schedules, monitoring and drug choice differ between drugs and patients. They are essential for safe prescribing in psychiatry, especially with interacting drugs and vulnerable groups.`,
    keyPoints: ["Pharmacokinetics versus pharmacodynamics", "Bioavailability and first pass, with food examples", "Lipophilic distribution and lithium contrast", "CYP enzymes and phase 2 drugs for liver disease", "Active metabolites and autoinduction", "Half life, steady state after five half lives, washout", "Zero order kinetics examples", "Special populations"],
    visuals: [
      vis("journey", { drug: "sertraline", target: "serotonin transporters in the raphe and cortex", routes: ["oral", "iv"], notes: { liver: "First pass metabolism by CYP enzymes" } }, "Absorption and bioavailability: follow a tablet from gut to brain."),
      curve("half-life", "Elimination and half life", "Regular doses reach a steady state after about five half lives."),
    ],
    module: "pharmacokinetics",
    ref: "Stahl Essential Psychopharmacology ch 2; Maudsley pharmacokinetic sections; Kaplan psychopharmacology principles",
  },
  {
    id: "phar-l01-002",
    subject: "psychopharmacology",
    topic: "cyp-interactions",
    marks: 10,
    difficulty: 3,
    exams: ["md-psychiatry"],
    question: "Discuss clinically important drug interactions in psychiatry, with emphasis on cytochrome P450 enzymes.",
    plan: ["Types of interaction", "Main CYP enzymes with substrates, inhibitors and inducers", "Other pharmacokinetic interactions", "Pharmacodynamic interactions", "How to prevent harm"],
    answer: `## Types of interaction
- Pharmacokinetic: one drug changes the absorption, distribution, metabolism or excretion of another.
- Pharmacodynamic: two drugs act on the same system, adding or opposing effects.

## Cytochrome P450 enzymes
| Enzyme | Psychotropic substrates | Inhibitors | Inducers |
| CYP1A2 | Clozapine, olanzapine, duloxetine, agomelatine | Fluvoxamine (strong), ciprofloxacin | Tobacco smoke, carbamazepine, omeprazole |
| CYP2D6 | Tricyclics, risperidone, aripiprazole, haloperidol, atomoxetine, vortioxetine, codeine, tamoxifen | Fluoxetine, paroxetine, bupropion (strong), duloxetine (moderate) | Not inducible |
| CYP3A4 | Quetiapine, lurasidone, cariprazine, alprazolam, midazolam, buprenorphine, methadone | Clarithromycin, ketoconazole, ritonavir, grapefruit juice, fluvoxamine | Carbamazepine, phenytoin, rifampicin, St John's wort, modafinil |
| CYP2C19 | Citalopram, escitalopram, sertraline (partly), diazepam, clomipramine | Fluvoxamine, omeprazole, fluoxetine | Rifampicin, carbamazepine |

## Clinical examples
- Fluvoxamine with clozapine: clozapine levels can rise several fold, causing sedation and seizures.
- Stopping smoking during admission: clozapine and olanzapine levels can rise by up to about half, with toxicity; nicotine replacement does not prevent this because the inducers are hydrocarbons in smoke.
- Carbamazepine with quetiapine or lurasidone: levels fall markedly, causing loss of effect; carbamazepine also lowers the oral contraceptive's effect.
- Fluoxetine or paroxetine with tamoxifen: reduced conversion to endoxifen, with possible reduced cancer protection; prefer sertraline or escitalopram.
- Paroxetine or fluoxetine with codeine or tramadol: reduced analgesia (less conversion to morphine) plus serotonin risk with tramadol.
- Ritonavir with midazolam or alprazolam: prolonged sedation and respiratory depression.

## Other pharmacokinetic interactions
- Valproate inhibits lamotrigine glucuronidation, doubling its levels; the lamotrigine dose must be halved and titrated slowly to reduce the risk of Stevens Johnson syndrome.
- Oral contraceptives (oestrogen) reduce lamotrigine levels.
- Lithium levels rise with NSAIDs, ACE inhibitors, angiotensin receptor blockers and thiazide diuretics, and with dehydration.

## Pharmacodynamic interactions
- Serotonin syndrome: MAOIs with SSRIs, SNRIs, clomipramine, tramadol, pethidine, linezolid, methylene blue.
- QTc prolongation: combining citalopram or escitalopram at high dose, tricyclics, haloperidol, ziprasidone, methadone, some antibiotics and antiarrhythmics; worse with low potassium or magnesium.
- Sedation and respiratory depression: benzodiazepines with opioids, alcohol or gabapentinoids.
- Anticholinergic burden: tricyclics, low potency antipsychotics, antihistamines, trihexyphenidyl, oxybutynin; delirium and falls in older people.
- Bleeding: SSRIs with NSAIDs, aspirin or anticoagulants.
- Hypertensive crisis: MAOIs with tyramine rich foods or sympathomimetics.

## Preventing harm
Take a full medication history including over the counter, herbal and traditional medicines; check an interaction resource; prefer drugs with few interactions (sertraline, escitalopram); adjust doses and monitor levels where possible (lithium, clozapine); inform other prescribers; review lists regularly.

## Conclusion
Drug interactions in psychiatry are common and predictable. Knowing the main CYP enzymes, their inhibitors and inducers, and key pharmacodynamic risks prevents serious harm.`,
    keyPoints: ["Pharmacokinetic versus pharmacodynamic", "CYP table with substrates, inhibitors, inducers", "Fluvoxamine and smoking with clozapine", "Carbamazepine induction examples", "Tamoxifen and CYP2D6", "Valproate and lamotrigine", "Lithium with NSAIDs, ACE inhibitors, thiazides", "Serotonin, QTc, sedation, anticholinergic and bleeding interactions"],
    visuals: [compare("Inhibitor or inducer?", ["Enzyme inhibitor (fluvoxamine)", ["Acts within days", "Raises levels of the other drug", "Risk of toxicity"], "Reduce the dose of the affected drug"], ["Enzyme inducer (carbamazepine, smoking)", ["Takes one to two weeks", "Lowers levels of the other drug", "Risk of loss of effect"], "Raise the dose or choose another drug"])],
    module: "pharmacokinetics",
    ref: "Maudsley interactions chapter; Stahl prescriber's guide interaction tables; Spina and de Leon CYP reviews",
  },
  {
    id: "phar-l01-003",
    subject: "psychopharmacology",
    topic: "receptor-pharmacology",
    marks: 10,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "Explain the concepts of agonist, antagonist, partial agonist and inverse agonist, with examples from psychiatry. Add a note on potency and efficacy.",
    plan: ["Receptor basics: affinity and intrinsic activity", "Define each ligand type with examples", "Partial agonists as stabilisers", "Potency versus efficacy with dose response curves", "Clinical relevance and conclusion"],
    answer: `## Receptor basics
A receptor is a protein that a transmitter or drug binds to, producing a signal. Two properties describe a drug:
- Affinity: how strongly it binds (reflected in the dissociation constant, Ki; lower Ki means higher affinity).
- Intrinsic activity (efficacy): how much signal it produces once bound.
Many receptors have some constitutive (baseline) activity even with no transmitter present.

## Types of ligands
| Type | Intrinsic activity | Effect | Examples |
| Full agonist | Maximal | Produces the full response | Morphine and methadone at mu receptors; benzodiazepines as positive modulators at GABA A |
| Partial agonist | Between zero and full | Partial response; with high transmitter, acts as a functional antagonist | Aripiprazole, brexpiprazole, cariprazine at D2; buprenorphine at mu; buspirone at 5 HT1A; varenicline at nicotinic receptors |
| Antagonist (neutral) | Zero | Blocks the agonist, returns activity to baseline | Haloperidol at D2; naloxone and naltrexone at mu |
| Inverse agonist | Negative | Reduces constitutive activity below baseline | Pimavanserin at 5 HT2A; many "antagonists" are in fact inverse agonists, such as some antihistamines |

## Partial agonists as stabilisers
A partial agonist adjusts to its environment. Where transmitter is high (mesolimbic dopamine excess in psychosis), it competes with dopamine and lowers the signal; where transmitter is low (mesocortical deficit), it adds some signal. This explains why aripiprazole causes fewer extrapyramidal effects and less prolactin rise than haloperidol, and why buprenorphine causes less respiratory depression than methadone (a ceiling effect) and can precipitate withdrawal in people on full agonists.

## Potency and efficacy
On a dose response curve:
- Potency is the dose needed to produce a given effect (the position of the curve on the dose axis). Haloperidol is more potent than chlorpromazine (fewer milligrams needed), but not more effective.
- Efficacy is the maximum effect a drug can produce (the height of the curve). A partial agonist has lower efficacy than a full agonist however high the dose.
- The therapeutic index is the ratio of toxic dose to effective dose; lithium and tricyclics have narrow indices, SSRIs wide ones.

## Clinical relevance
- Switching from a full agonist to a partial agonist (methadone or heroin to buprenorphine) can precipitate withdrawal if the patient is not already in mild withdrawal.
- Combining an antagonist with an agonist (naltrexone with opioid analgesics) blocks pain relief.
- Allosteric modulators (benzodiazepines, zuranolone at GABA A) change the receptor's response to the natural transmitter rather than binding at its site.

## Conclusion
Affinity, intrinsic activity, potency and efficacy explain why drugs at the same receptor have different clinical effects. Partial agonism is especially important in modern antipsychotics and opioid treatment.`,
    keyPoints: ["Affinity and intrinsic activity", "Full agonist, partial agonist, antagonist and inverse agonist defined", "Psychiatric examples for each", "Partial agonist acting as functional antagonist in high transmitter states", "Precipitated withdrawal with buprenorphine", "Potency versus efficacy on curves", "Therapeutic index", "Allosteric modulators"],
    visuals: [
      vis("receptor", { receptor: "D2" }, "Types of ligands: compare full agonist, partial agonist, antagonist and inverse agonist at one receptor."),
      curve("dose-response", "Potency and efficacy", "Shift the curve left for more potency; raise its ceiling for more efficacy."),
    ],
    module: "brain",
    ref: "Stahl Essential Psychopharmacology ch 5 receptors; Kaplan basic pharmacology",
  },
  {
    id: "phar-l01-004",
    subject: "psychopharmacology",
    topic: "tdm",
    marks: 5,
    difficulty: 2,
    exams: ["md-psychiatry"],
    question: "Write short notes on therapeutic drug monitoring in psychiatry.",
    plan: ["Definition and when it is useful", "Drugs and target ranges", "Sampling rules", "Limits"],
    answer: `## Definition and uses
Therapeutic drug monitoring (TDM) is the measurement of drug levels in blood to guide dosing. It is most useful for drugs with a narrow therapeutic range, a clear link between level and effect or toxicity, and wide differences in metabolism between people. Uses: checking adherence, explaining lack of response or side effects, managing interactions (smoking, enzyme inducers), special groups (pregnancy, older age, renal or liver disease) and suspected toxicity.

## Drugs and usual target ranges
| Drug | Usual range |
| Lithium | 0.6 to 0.8 mmol per litre for maintenance; up to 1.0 in acute mania; toxicity likely above 1.5 |
| Clozapine | At least 350 ng per ml for response; risk of seizures rises above about 1000 |
| Valproate | About 50 to 100 mg per litre |
| Carbamazepine | About 4 to 12 mg per litre |
| Nortriptyline | 50 to 150 ng per ml (a therapeutic window) |
| Olanzapine | About 20 to 40 ng per ml |

## Sampling rules
- Sample at steady state, usually after five half lives (about five days for lithium after a dose change).
- Take trough levels, just before the next dose; for lithium, 12 hours after the last dose.
- Note the time of the last dose, other drugs and smoking status.

## Limits
Many psychotropics, including most SSRIs, have no clear level response relationship, so routine levels are not useful. Results must be interpreted with the clinical picture: treat the patient, not the number.

## Conclusion
TDM is essential for lithium and clozapine and helpful for several other drugs when used at the right time and for clear reasons.`,
    keyPoints: ["Definition", "When TDM is useful", "Lithium ranges and toxicity level", "Clozapine 350 threshold", "Other drugs with ranges", "Steady state trough sampling and 12 hour lithium rule", "Limits for SSRIs"],
    visuals: [curve("half-life", "Sampling rules: wait for steady state")],
    module: "pharmacokinetics",
    ref: "Hiemke 2018 AGNP consensus guidelines for TDM; Maudsley plasma levels table",
  },
  {
    id: "phar-l01-005",
    subject: "psychopharmacology",
    topic: "pharmacogenomics",
    marks: 5,
    difficulty: 3,
    exams: ["md-psychiatry"],
    question: "Write short notes on pharmacogenomics in psychiatry.",
    plan: ["Definition", "Metaboliser types and key enzymes", "HLA alleles and adverse reactions", "Evidence and practical use"],
    answer: `## Definition
Pharmacogenomics is the study of how genetic variation affects response to drugs, both in drug handling (pharmacokinetics) and drug targets or adverse reactions (pharmacodynamics).

## Metaboliser types
Variants in CYP2D6 and CYP2C19 create:
- Poor metabolisers: little or no enzyme activity; higher levels and more side effects (for example with tricyclics, atomoxetine or aripiprazole for CYP2D6, and citalopram or escitalopram for CYP2C19).
- Intermediate metabolisers.
- Normal (extensive) metabolisers.
- Ultrarapid metabolisers (gene duplication): low levels and non response to standard doses, and for codeine, dangerous conversion to morphine.
The frequency of variants differs between populations; CYP2C19 poor metabolism is more common in South and East Asian people than in Europeans.

## HLA alleles and adverse reactions
- HLA-B*15:02 strongly predicts Stevens Johnson syndrome and toxic epidermal necrolysis with carbamazepine (and possibly oxcarbazepine and phenytoin) in people of Han Chinese, Thai and other South East Asian ancestry, and it is present in some Indian populations; testing before starting carbamazepine is recommended in at risk groups.
- HLA-A*31:01 is linked to carbamazepine hypersensitivity in several populations.
- Clozapine induced agranulocytosis has HLA associations but no useful clinical test yet.

## Evidence and practical use
- Expert groups (such as the Clinical Pharmacogenetics Implementation Consortium) give dosing guidance for SSRIs, tricyclics and some antipsychotics according to CYP2D6 and CYP2C19 status.
- Trials of pharmacogenomic guided antidepressant choice show modest benefits at best; commercial panels are often oversold.
- Genetic tests do not predict which drug will work best for an individual.

## Conclusion
Pharmacogenomics is useful for safety (HLA-B*15:02 with carbamazepine) and for explaining unusual responses, but it is a supplement to, not a substitute for, careful clinical prescribing.`,
    keyPoints: ["Definition", "Poor, intermediate, normal and ultrarapid metabolisers", "CYP2D6 and CYP2C19 examples", "Population differences", "HLA-B*15:02 and carbamazepine", "CPIC guidance and modest trial evidence"],
    module: "pharmacokinetics",
    ref: "CPIC guidelines SSRIs 2023, TCAs 2016; Chung 2004 HLA-B*1502; Greden 2019 GUIDED; Oslin 2022 PRIME Care",
  },
  {
    id: "phar-l01-006",
    subject: "psychopharmacology",
    topic: "placebo-principles",
    marks: 5,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance", "ma-semester"],
    question: "Write short notes on placebo and nocebo effects in psychopharmacology.",
    plan: ["Definitions", "Size of placebo response in psychiatric trials", "Mechanisms", "Clinical and ethical implications"],
    answer: `## Definitions
- A placebo is an inert treatment; the placebo response is the improvement seen after it, which includes natural recovery, regression to the mean and non specific effects of care, as well as the true placebo effect from expectation.
- The nocebo effect is the experience of harmful effects (side effects) because of negative expectations.

## Size in psychiatric trials
Placebo response rates are high in depression and anxiety trials, often 30 to 40 percent, and have risen over decades. They are lower in severe depression, psychosis and OCD. High placebo response makes it harder for trials to show a drug effect and partly explains small drug placebo differences in mild depression. In trials, many patients on placebo report side effects similar to those listed on the consent form (nocebo).

## Mechanisms
- Expectation and conditioning: past experience of improvement after treatment.
- Neurobiology: placebo analgesia releases endogenous opioids (blocked by naloxone) and dopamine; imaging shows changes in prefrontal and cingulate regions similar to drug effects in depression.
- The relationship with the clinician, the ritual of treatment, and hope.

## Implications
- Clinically, the "placebo component" of any treatment can be strengthened ethically: warmth, clear explanation, realistic optimism and follow up.
- Explaining side effects in a balanced way reduces nocebo effects and dropouts.
- Deceptive use of placebos in practice is unethical; "open label placebo" studies (telling patients it is a placebo) show some benefit and are being researched.
- Trial design uses placebo controls, but placebo is ethically problematic when effective treatment exists for severe illness; the Declaration of Helsinki and Indian ICMR guidelines limit its use.

## Conclusion
Placebo and nocebo effects are powerful in psychiatry; good prescribing uses their positive side honestly and limits their negative side.`,
    keyPoints: ["Placebo response versus placebo effect", "Nocebo definition", "Rates of 30 to 40 percent in depression trials", "Opioid and dopamine mechanisms", "Ethical use of the clinician relationship", "Placebo controlled trial ethics"],
    module: "therapies",
    ref: "Walsh 2002 rising placebo response; Benedetti placebo neurobiology; Kaptchuk open-label placebo 2010; ICMR 2017 guidelines",
  },
  {
    id: "phar-l01-007",
    subject: "psychopharmacology",
    topic: "drug-development-basics",
    marks: 10,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "Describe the phases of drug development and clinical trials. How are new drugs and clinical trials regulated in India?",
    plan: ["Preclinical stage", "Phases 1 to 4 with aims", "Special issues in psychiatric trials", "Indian regulation: CDSCO, rules, ethics committees, CTRI", "Conclusion"],
    answer: `## Preclinical stage
Laboratory and animal studies test a compound's mechanism, pharmacokinetics, toxicity, and effects in animal models (for example the forced swim test for antidepressants). Promising compounds then enter human trials.

## Clinical trial phases
| Phase | Participants | Main aims |
| Phase 1 | Small numbers of healthy volunteers (sometimes patients) | Safety, tolerability, pharmacokinetics, dose range |
| Phase 2 | A few hundred patients | Early evidence of efficacy, dose finding, side effects |
| Phase 3 | Hundreds to thousands of patients in randomised controlled trials | Confirm efficacy against placebo or comparator, safety; basis for approval |
| Phase 4 | Patients in routine practice after approval | Long term safety, rare adverse effects, new uses, comparisons |
Some programmes also include phase 0 (microdosing) studies.

## Special issues in psychiatric trials
- High placebo response and outcome measures based on rating scales.
- Consent and capacity, especially in acute psychosis or severe depression.
- Suicide risk monitoring and exclusion of high risk patients, which limits generalisability.
- Short trial durations compared with chronic illness.
- Publication bias, which overestimated antidepressant effects until trial registration became mandatory.

## Regulation in India
- New drugs and clinical trials are regulated by the Central Drugs Standard Control Organisation (CDSCO), headed by the Drugs Controller General of India, under the Drugs and Cosmetics Act 1940.
- The New Drugs and Clinical Trials Rules 2019 set timelines for approval, requirements for local trials, rules for academic trials, and compensation for trial related injury or death.
- Every trial needs approval from a registered ethics committee, following the ICMR National Ethical Guidelines for Biomedical and Health Research Involving Human Participants in 2017.
- Registration in the Clinical Trials Registry of India (CTRI) before enrolling the first participant has been mandatory since 2009.
- Audio visual recording of informed consent is required in certain trials involving vulnerable participants.
- For people with mental illness, section 99 of the MHCA 2017 adds safeguards: free and informed consent, or, when capacity is lacking, consent from the nominated representative and permission from the State Mental Health Authority, with the research being necessary and of minimal risk.

## Conclusion
Drugs pass through preclinical work and four clinical phases before and after approval. In India, CDSCO, the 2019 rules, ethics committees, CTRI registration and the MHCA protect participants, especially vulnerable people with mental illness.`,
    keyPoints: ["Preclinical stage", "Four phases with participants and aims", "Placebo response, consent and suicide issues", "Publication bias and registration", "CDSCO and DCGI under Drugs and Cosmetics Act", "New Drugs and Clinical Trials Rules 2019", "Ethics committee, ICMR 2017, CTRI since 2009", "MHCA section 99 safeguards"],
    visuals: [chain("From molecule to medicine", [["Preclinical", "Lab and animal studies"], ["Phase 1", "Safety in small groups"], ["Phase 2", "Dose finding and early efficacy"], ["Phase 3", "Large randomised trials"], ["Approval", "CDSCO in India"], ["Phase 4", "Post marketing safety"]])],
    module: "ethics-law",
    ref: "New Drugs and Clinical Trials Rules 2019; ICMR 2017 guidelines; CTRI; MHCA 2017 s99; Turner 2008 NEJM publication bias",
  },
  {
    id: "phar-l01-008",
    subject: "psychopharmacology",
    topic: "receptor-occupancy",
    marks: 5,
    difficulty: 3,
    exams: ["md-psychiatry"],
    question: "Write short notes on receptor occupancy and its relevance to antipsychotic and antidepressant dosing.",
    plan: ["Definition and how it is measured", "D2 occupancy thresholds", "Exceptions: clozapine, quetiapine, aripiprazole", "SERT occupancy and SSRI dosing"],
    answer: `## Definition
Receptor occupancy is the percentage of target receptors bound by a drug at a given dose or plasma level. It is measured in living people with PET or SPECT imaging using radioactive ligands that compete for the receptor.

## D2 occupancy and antipsychotics
PET studies by Shitij Kapur and colleagues showed a therapeutic window for D2 antagonists:
- About 65 percent striatal D2 occupancy is needed for antipsychotic effect.
- Above about 72 percent, prolactin rises.
- Above about 78 to 80 percent, extrapyramidal side effects become likely.
This explains why low doses of haloperidol (about 2 to 5 mg a day) are often enough and higher doses mainly add side effects.

## Exceptions
- Clozapine and quetiapine work at lower D2 occupancy and dissociate rapidly from the receptor (the "fast off" hypothesis), which may explain few extrapyramidal effects and little prolactin rise.
- Aripiprazole occupies more than 90 percent of D2 receptors yet causes few extrapyramidal effects, because as a partial agonist it still provides some signal.
- Long acting injections give steadier occupancy with fewer peaks and troughs.

## SERT occupancy and SSRIs
Standard starting doses of SSRIs (citalopram 20 mg, sertraline 50 mg, paroxetine 20 mg, fluoxetine 20 mg) already occupy about 80 percent of serotonin transporters. This helps explain the flat dose response curve of SSRIs in depression: higher doses add side effects more than benefit, though OCD often needs higher doses.

## Conclusion
Receptor occupancy studies give a scientific basis for using the lowest effective dose and explain differences in side effects between drugs.`,
    keyPoints: ["Definition and PET measurement", "65, 72 and 78 to 80 percent thresholds", "Low dose haloperidol enough", "Clozapine and quetiapine fast off", "Aripiprazole high occupancy partial agonist", "80 percent SERT occupancy at starting SSRI doses"],
    visuals: [vis("guess", { prompt: "What striatal D2 occupancy is usually needed for an antipsychotic effect?", min: 0, max: 100, step: 5, unit: "%", answer: [60, 70], reveal: "About 65 percent. Above about 78 to 80 percent, extrapyramidal side effects become likely." }, "D2 occupancy and antipsychotics")],
    module: "antipsychotics",
    ref: "Kapur 2000 Am J Psychiatry D2 occupancy; Kapur and Seeman 2001 fast-off; Meyer 2004 SERT occupancy",
  },
  {
    id: "phar-l01-009",
    subject: "psychopharmacology",
    topic: "discontinuation-principles",
    marks: 5,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "Write short notes on tolerance, dependence and discontinuation syndromes with psychotropic drugs.",
    plan: ["Define tolerance and its types", "Physical dependence versus addiction", "Discontinuation syndromes with examples", "Tapering principles"],
    answer: `## Tolerance
Tolerance is a reduced response to a drug after repeated use, so higher doses are needed for the same effect.
- Pharmacokinetic tolerance: increased metabolism (carbamazepine autoinduction, alcohol).
- Pharmacodynamic tolerance: receptor changes such as down regulation or reduced sensitivity (benzodiazepines at GABA A receptors, opioids at mu receptors).
- Cross tolerance between drugs of the same class (alcohol and benzodiazepines), which is the basis of benzodiazepine detoxification for alcohol.

## Dependence versus addiction
Physical dependence means that stopping the drug causes withdrawal symptoms; it can occur with antidepressants, benzodiazepines, opioids and others. Addiction (a substance use disorder) involves craving, loss of control, and continued use despite harm. Antidepressants cause discontinuation symptoms but not addiction; benzodiazepines can cause both.

## Discontinuation syndromes
- Antidepressants: dizziness, "electric shock" sensations, flu like symptoms, insomnia and vivid dreams, nausea, irritability and anxiety (remembered as FINISH: flu like, insomnia, nausea, imbalance, sensory disturbance, hyperarousal). Most common with short half life drugs (paroxetine, venlafaxine); least with fluoxetine. Usually within days of stopping and lasting one to two weeks, though some people have longer symptoms.
- Benzodiazepines: anxiety, insomnia, perceptual disturbances, and seizures after high dose use.
- Lithium: abrupt stopping raises the risk of rebound mania.
- Clozapine: abrupt stopping can cause cholinergic rebound and rapid relapse of psychosis.
- Antipsychotics generally: rebound insomnia, withdrawal dyskinesias, and relapse.

## Tapering principles
Reduce gradually over weeks to months, with smaller steps at lower doses (hyperbolic tapering), switch to a longer acting drug where useful (diazepam for benzodiazepines, fluoxetine for SSRIs), educate patients and review symptoms to separate discontinuation from relapse.

## Conclusion
Tolerance and physical dependence are expected effects of many psychotropics and are different from addiction; planned, gradual tapering prevents most discontinuation problems.`,
    keyPoints: ["Pharmacokinetic and pharmacodynamic tolerance", "Cross tolerance", "Dependence versus addiction", "Antidepressant discontinuation features and FINISH", "Paroxetine and venlafaxine worst, fluoxetine least", "Lithium and clozapine abrupt stopping risks", "Gradual hyperbolic tapering"],
    module: "antidepressants",
    ref: "Maudsley antidepressant discontinuation; Horowitz and Taylor 2019 hyperbolic tapering; Berber FINISH mnemonic",
  },
  {
    id: "phar-l01-010",
    subject: "psychopharmacology",
    topic: "depot-lai",
    marks: 5,
    difficulty: 2,
    exams: ["md-psychiatry"],
    question: "Write short notes on long acting injectable antipsychotics.",
    plan: ["Indications and advantages", "Types and examples", "Pharmacokinetic points", "Disadvantages and safety"],
    answer: `## Indications and advantages
Long acting injectable (LAI) antipsychotics release drug over weeks to months. They are used for people with schizophrenia or bipolar disorder who have relapsed because of poor or uncertain adherence, and increasingly as an early option, including in first episodes, by patient preference. Advantages: assured delivery, early detection of non adherence (missed appointments), steady levels, and lower relapse and rehospitalisation in real world studies.

## Types and examples
| Type | Examples | Interval |
| First generation oily esters | Haloperidol decanoate, fluphenazine decanoate, flupentixol decanoate, zuclopenthixol decanoate | Every 2 to 4 weeks |
| Microspheres | Risperidone long acting injection | Every 2 weeks |
| Nanocrystal suspensions | Paliperidone palmitate | Monthly, three monthly or six monthly |
| Aripiprazole long acting forms | Aripiprazole monohydrate and related forms | Monthly or two monthly |
| Olanzapine pamoate | Olanzapine long acting injection | Every 2 to 4 weeks |

## Pharmacokinetic points
- Release from the injection site controls the time course ("flip flop" kinetics), so time to steady state can be several months.
- Oily depots may need a test dose; risperidone microspheres need oral cover for about three weeks; paliperidone palmitate uses loading doses in the deltoid and needs no oral cover.
- Missed doses and changes take a long time to show effects.

## Disadvantages and safety
Injection site pain and nodules, side effects that cannot be stopped quickly, perceived coercion, cost of second generation LAIs, and for olanzapine pamoate the post injection delirium and sedation syndrome, requiring three hours of observation after each injection. First generation depots carry extrapyramidal and tardive dyskinesia risks.

## Conclusion
LAIs are an effective option for preventing relapse and should be offered as a shared decision, not only as a last resort.`,
    keyPoints: ["Indications including first episode by preference", "Advantages", "Table of types and intervals", "Flip flop kinetics and long time to steady state", "Oral cover and loading rules", "Olanzapine pamoate observation for three hours"],
    module: "antipsychotics",
    ref: "Maudsley depot chapter; Kishimoto 2021 LAI meta-analysis; Tiihonen 2017 Swedish cohort",
  },
]);
