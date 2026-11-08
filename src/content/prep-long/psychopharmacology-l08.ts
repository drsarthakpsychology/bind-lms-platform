import type { LongQA } from "@/lib/prep/long-types";
import { anchored, chain, compare, tree, vis } from "./visual";

export const PSYCHOPHARMACOLOGY_L08: LongQA[] = anchored([
  {
    id: "phar-l08-001",
    subject: "psychopharmacology",
    topic: "antipsychotic-switching",
    marks: 5,
    difficulty: 2,
    exams: ["md-psychiatry"],
    question: "Write short notes on how to switch antipsychotics.",
    plan: ["Reasons to switch", "Methods", "Pitfalls", "Practical rules"],
    answer: `## Reasons to switch
Lack of response after an adequate trial, intolerable side effects (weight gain, prolactin, extrapyramidal effects, sedation), patient preference, or a need for a long acting injection.

## Methods
- Abrupt switch: stop one drug and start the other at full dose; simple but risks rebound and relapse; used mainly for serious side effects.
- Cross taper: reduce the first drug gradually while increasing the second over one to four weeks; the most common method.
- Plateau cross taper: keep the first drug at full dose until the second reaches an effective dose, then taper the first; safest against relapse but causes a period of combined side effects.

## Pitfalls
- Rebound or withdrawal effects from the drug being stopped: cholinergic rebound (sweating, nausea, insomnia, agitation) when stopping drugs with strong anticholinergic action such as clozapine or olanzapine; histamine rebound (insomnia, anxiety) when stopping quetiapine or olanzapine; withdrawal dyskinesias and rebound psychosis.
- Switching to aripiprazole or other partial agonists from strong D2 blockers can cause agitation or worsening if the first drug is stopped too fast; use a plateau approach.
- Pharmacokinetic differences: long half life drugs (aripiprazole, cariprazine) and depots take weeks to reach steady state.
- Clozapine should never be stopped abruptly except for a medical emergency.

## Practical rules
Explain the plan to the patient and family, change one drug at a time, monitor symptoms and side effects closely, keep a crisis plan, and allow enough time on the new drug before judging it.

## Conclusion
Most switches are best done by gradual cross tapering, with attention to rebound effects and the pharmacology of both drugs.`,
    keyPoints: ["Reasons to switch", "Abrupt, cross taper and plateau methods", "Cholinergic and histamine rebound", "Partial agonist switching caution", "Long half life and depots", "Never stop clozapine abruptly"],
    visuals: [compare("Methods", ["Cross taper", ["Down with drug A, up with drug B together", "Over one to four weeks", "Most common"], "Balanced"], ["Plateau cross taper", ["Keep drug A until drug B works", "Then taper A", "Safest against relapse"], "Cautious"])],
    module: "antipsychotics",
    ref: "Maudsley switching antipsychotics; Cerovecki 2013 switching guidance",
  },
  {
    id: "phar-l08-002",
    subject: "psychopharmacology",
    topic: "antidepressant-medical-comorbidity",
    marks: 10,
    difficulty: 3,
    exams: ["md-psychiatry"],
    question: "How would you choose an antidepressant for a patient with physical illness? Discuss with examples.",
    plan: ["Principles", "Condition by condition choices", "Drug interactions to watch", "Conclusion"],
    answer: `## Principles
Depression is common in physical illness and worsens outcomes. The choice of antidepressant depends on the illness, other medicines, organ function, side effects that may help or harm, and overdose risk. Start low, increase slowly, and monitor.

## Choices by condition
| Condition | Preferred | Avoid or use cautiously |
| Coronary heart disease, after myocardial infarction | Sertraline (best trial evidence), mirtazapine | Tricyclics; high dose citalopram and escitalopram (QTc); venlafaxine at high dose (blood pressure) |
| Heart failure | Sertraline | Tricyclics |
| Stroke | Sertraline, citalopram, escitalopram | Watch bleeding with antiplatelets |
| Epilepsy | SSRIs (sertraline, citalopram) | Bupropion, clomipramine and high dose tricyclics (seizures) |
| Parkinson disease | SSRIs, SNRIs, nortriptyline | MAOIs with selegiline combinations |
| Diabetes | SSRIs, duloxetine (also for painful neuropathy) | Mirtazapine and tricyclics (weight gain) |
| Chronic pain, neuropathy | Duloxetine, amitriptyline, nortriptyline | |
| Liver disease | Sertraline or citalopram at low dose | Duloxetine, agomelatine, tricyclics |
| Renal disease | Sertraline, citalopram, mirtazapine (lower dose) | Venlafaxine and desvenlafaxine at full dose |
| Gastrointestinal bleeding risk, on NSAIDs or anticoagulants | Mirtazapine, or SSRI with proton pump inhibitor | SSRIs alone |
| Cancer with poor appetite and sleep | Mirtazapine | Paroxetine and fluoxetine with tamoxifen |
| HIV | Sertraline, escitalopram | Drugs with major CYP3A4 interactions |
| Older adults with falls or low sodium | Mirtazapine | SSRIs need sodium checks; tricyclics |
| Sexual dysfunction concerns | Bupropion, mirtazapine, vortioxetine | Paroxetine |
| Obesity | Bupropion, fluoxetine | Mirtazapine, paroxetine, tricyclics |

## Interactions to watch
- Warfarin and other anticoagulants with SSRIs (bleeding) and with fluvoxamine (raised warfarin levels).
- Tamoxifen with CYP2D6 inhibitors.
- Linezolid, tramadol and triptans with serotonergic drugs.
- QTc prolonging antibiotics, antimalarials and antiarrhythmics.
- Antiretrovirals with CYP3A4 substrates.

## Conclusion
In physical illness, sertraline is a good general choice, mirtazapine helps with poor appetite and sleep and bleeding risk, duloxetine and tricyclics help pain, and tricyclics are avoided in heart disease. Matching the drug to the illness and other medicines makes treatment safer and more effective.`,
    keyPoints: ["Principles of choice", "Sertraline after myocardial infarction", "SSRIs in epilepsy and avoid bupropion", "Duloxetine for pain and diabetes", "Liver and renal choices", "Bleeding risk and mirtazapine", "Tamoxifen interaction", "Comorbidity table"],
    visuals: [tree("Choices by condition: quick guide", [["Depression with physical illness", "", -1], ["Heart disease", "Sertraline", 0], ["Pain or neuropathy", "Duloxetine, amitriptyline", 0], ["Poor appetite and sleep, cancer", "Mirtazapine", 0], ["Epilepsy", "SSRIs, avoid bupropion", 0], ["Bleeding risk", "Mirtazapine or SSRI with PPI", 0]])],
    module: "antidepressants",
    ref: "Maudsley depression in physical illness; Glassman 2002 SADHART; NICE CG91 depression with chronic physical health problem",
  },
  {
    id: "phar-l08-003",
    subject: "psychopharmacology",
    topic: "ptsd-medicines",
    marks: 5,
    difficulty: 2,
    exams: ["md-psychiatry"],
    question: "Write short notes on the pharmacological treatment of PTSD.",
    plan: ["Place of medicines", "First line drugs", "Other options", "What to avoid"],
    answer: `## Place of medicines
Trauma focused psychological therapies (prolonged exposure, cognitive processing therapy, cognitive therapy for PTSD, EMDR) are first line. Medicines are used when therapy is unavailable, declined or not enough, or when depression or other comorbidity is severe.

## First line drugs
- SSRIs: sertraline and paroxetine are approved for PTSD in the USA; fluoxetine is also used.
- SNRI: venlafaxine has good evidence.
- Effects are modest; treatment for at least 8 to 12 weeks, and if effective, continue for at least a year.

## Other options
- Prazosin, an alpha 1 blocker, for trauma related nightmares and sleep disturbance; early trials were positive, a large later trial in veterans was negative, so it is used selectively.
- Second generation antipsychotics (quetiapine, risperidone, olanzapine) as augmentation for severe, resistant symptoms or psychotic features.
- Mirtazapine, and trazodone for sleep.
- Topiramate and other agents have limited evidence.
- Propranolol shortly after trauma to prevent PTSD has not been reliably effective.
- MDMA assisted therapy was not approved in the USA in 2024.

## What to avoid
Benzodiazepines are not recommended: they do not treat PTSD, may worsen outcomes and carry dependence risk, especially given the high rates of substance use in PTSD.

## Conclusion
Medicines play a supporting role in PTSD; SSRIs and venlafaxine are first line, prazosin may help nightmares, and benzodiazepines should be avoided.`,
    keyPoints: ["Psychological therapy first", "Sertraline, paroxetine, venlafaxine", "Duration of treatment", "Prazosin evidence including negative trial", "Antipsychotic augmentation", "Avoid benzodiazepines"],
    module: "trauma",
    ref: "NICE NG116; Raskind 2018 NEJM prazosin; Hoskins 2015 meta-analysis; Maudsley PTSD",
  },
  {
    id: "phar-l08-004",
    subject: "psychopharmacology",
    topic: "eating-disorder-medicines",
    marks: 5,
    difficulty: 2,
    exams: ["md-psychiatry"],
    question: "Write short notes on the role of medicines in eating disorders.",
    plan: ["General principle", "Anorexia nervosa", "Bulimia nervosa", "Binge eating disorder and safety"],
    answer: `## General principle
Psychological treatments and nutritional rehabilitation are the core of treatment; medicines are adjuncts.

## Anorexia nervosa
- No medicine treats the core illness or reliably restores weight.
- Low dose olanzapine (2.5 to 10 mg) produced modest weight gain in a randomised trial and can reduce anxiety and obsessional thinking about food; monitor glucose and lipids.
- Antidepressants work poorly at low weight, partly because of reduced tryptophan; treat comorbid depression or OCD after some weight restoration.
- Supplements: calcium, vitamin D, and phosphate and thiamine during refeeding.
- Avoid drugs that prolong QTc, as bradycardia and electrolyte problems increase risk.

## Bulimia nervosa
- Fluoxetine at 60 mg a day reduces bingeing and purging, even without depression; it is the only approved drug in the USA.
- Other SSRIs and topiramate have some evidence.
- Bupropion is contraindicated because of seizure risk in people who purge.

## Binge eating disorder
- Lisdexamfetamine is approved in the USA for moderate to severe binge eating disorder; it reduces binge days.
- SSRIs, topiramate and GLP 1 agonists may help with bingeing and weight.

## Safety
Check electrolytes (low potassium from vomiting), ECG and drug interactions; be cautious about overdose and misuse of stimulants.

## Conclusion
Medicines have a limited, specific role: low dose olanzapine in anorexia, high dose fluoxetine in bulimia, and lisdexamfetamine in binge eating disorder, always alongside psychological treatment.`,
    keyPoints: ["Psychological treatment is core", "Olanzapine modest effect in anorexia", "Antidepressants weak at low weight", "Fluoxetine 60 mg in bulimia", "Bupropion contraindicated", "Lisdexamfetamine for BED; electrolyte and ECG checks"],
    module: "more-disorders",
    ref: "Attia 2019 Am J Psychiatry olanzapine AN; Fluoxetine Bulimia Collaborative Study 1992; McElroy 2015 lisdexamfetamine BED",
  },
  {
    id: "phar-l08-005",
    subject: "psychopharmacology",
    topic: "aggression-medicines",
    marks: 5,
    difficulty: 3,
    exams: ["md-psychiatry"],
    question: "Write short notes on the pharmacological management of chronic aggression.",
    plan: ["Assessment first", "Drugs by context", "Evidence and cautions", "Non drug measures"],
    answer: `## Assessment first
Aggression is a behaviour, not a diagnosis. Identify the underlying cause: psychosis, mania, intoxication or withdrawal, delirium, dementia, intellectual disability or autism, brain injury, personality disorder, pain or environmental triggers. Treat the cause where possible.

## Drugs by context
| Context | Options |
| Psychosis | Antipsychotics; clozapine has specific anti aggressive effects in schizophrenia |
| Mania | Antipsychotics, lithium, valproate |
| Autism and intellectual disability | Risperidone and aripiprazole for irritability, at low doses; review regularly |
| Brain injury and dementia | Low dose SSRIs, propranolol, carefully used antipsychotics; avoid benzodiazepines |
| ADHD and conduct disorder | Treat ADHD with stimulants; risperidone short term for severe aggression |
| Personality disorder | Psychological treatment first; limited evidence for mood stabilisers (topiramate, valproate, lamotrigine) for impulsive aggression |
| Impulsive aggression generally | SSRIs, lithium |

## Evidence and cautions
Evidence is limited for many uses; drugs reduce irritability and outbursts but rarely solve the problem alone. Antipsychotics carry metabolic, extrapyramidal and mortality risks (especially in dementia). Benzodiazepines may cause disinhibition. Over use of antipsychotics in people with intellectual disability is a recognised problem; the English STOMP programme aims to reduce it.

## Non drug measures
Behavioural analysis of triggers, positive behaviour support, de-escalation, structured routines, treatment of pain and sleep problems, and carer support.

## Conclusion
Treat the cause of aggression, use the medicine that fits the context at the lowest effective dose, and combine it with behavioural support and regular review.`,
    keyPoints: ["Aggression is a behaviour; find the cause", "Clozapine in schizophrenia", "Risperidone and aripiprazole in autism", "Propranolol and SSRIs in brain injury", "Lithium and mood stabilisers for impulsive aggression", "Over use in intellectual disability and STOMP"],
    module: "medicine-profiles",
    ref: "Maudsley aggression; Volavka clozapine hostility; NICE NG11 challenging behaviour; STOMP 2016",
  },
  {
    id: "phar-l08-006",
    subject: "psychopharmacology",
    topic: "nnt-nnh-data",
    marks: 10,
    difficulty: 3,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "In an eight week trial, 50 percent of patients on an antidepressant and 35 percent on placebo responded. Weight gain of more than 7 percent occurred in 12 percent on the drug and 2 percent on placebo. Calculate and interpret the absolute risk difference, relative risk, number needed to treat and number needed to harm.",
    plan: ["Define the measures", "Calculate for response", "Calculate for weight gain", "Interpret together", "Limitations"],
    answer: `## Definitions
- Absolute risk difference (ARD): the difference between event rates in the two groups.
- Relative risk (RR): the event rate in the treated group divided by the rate in the control group.
- Number needed to treat (NNT): the number of patients who must be treated for one extra patient to benefit, equal to 1 divided by the absolute benefit increase.
- Number needed to harm (NNH): the number treated for one extra patient to have a harm, equal to 1 divided by the absolute risk increase.

## Response
- Drug 50 percent, placebo 35 percent.
- Absolute benefit increase = 50 minus 35 = 15 percent (0.15).
- Relative "risk" of response = 0.50 divided by 0.35 = about 1.43, so patients are about 43 percent more likely to respond on the drug.
- NNT = 1 divided by 0.15 = about 6.7, rounded up to 7. Seven patients need treatment for one extra response.

## Weight gain
- Drug 12 percent, placebo 2 percent.
- Absolute risk increase = 10 percent (0.10).
- Relative risk = 0.12 divided by 0.02 = 6, a six fold increase.
- NNH = 1 divided by 0.10 = 10. One in every ten patients treated has extra clinically significant weight gain.

## Interpretation
| Measure | Response | Weight gain |
| Absolute difference | 15 percent | 10 percent |
| Relative risk | 1.43 | 6.0 |
| NNT or NNH | 7 | 10 |
- An NNT of 7 is typical of antidepressants and is clinically worthwhile (many accepted treatments in medicine have NNTs of 10 to 50).
- The relative risk for weight gain (6) sounds alarming, but the absolute increase (10 percent) gives a clearer picture; relative measures exaggerate effects when baseline rates are low.
- Benefit and harm can be weighed together: for every 70 patients treated, about 10 extra respond and about 7 extra gain significant weight. The likelihood of being helped versus harmed (NNH divided by NNT, here about 1.4) is modest, so choice of drug and monitoring matter.

## Limitations
Trial patients are selected; eight weeks is short; response is a cut off on a continuous scale; confidence intervals are needed to judge precision; NNT depends on baseline rates and duration and is specific to that comparison.

## Conclusion
Absolute measures, NNT and NNH translate trial results into clinical terms. Here, about seven patients need treatment for one extra response and ten for one extra case of weight gain, a balance that should be discussed with patients.`,
    keyPoints: ["Correct definitions", "ARD 15 percent and NNT 7 rounded up", "RR 1.43 for response", "ARD 10 percent, RR 6 and NNH 10 for weight", "Relative versus absolute interpretation", "Benefit harm balance", "Limitations including confidence intervals"],
    pitfalls: ["Rounding NNT down", "Using relative risk to judge clinical importance", "Forgetting time frame"],
    visuals: [vis("experiment", { title: "Interpretation: response and weight gain", question: "What share of patients responded or gained weight in each group?", unit: "%", conditions: [{ label: "Response on drug", value: 50 }, { label: "Response on placebo", value: 35 }, { label: "Weight gain on drug", value: 12 }, { label: "Weight gain on placebo", value: 2 }], why: "A 15 point gain in response (NNT 7) against a 10 point rise in weight gain (NNH 10)." })],
    module: "statistics",
    ref: "Citrome 2008 NNT NNH LHH; Laupacis 1988 NEJM NNT",
  },
  {
    id: "phar-l08-007",
    subject: "psychopharmacology",
    topic: "substance-medicines",
    marks: 20,
    difficulty: 3,
    exams: ["md-psychiatry"],
    question: "Discuss the pharmacology of drugs used in the treatment of alcohol, opioid and tobacco use disorders.",
    plan: ["Principles: detoxification, substitution, antagonism, aversion, anti craving", "Alcohol medicines", "Opioid medicines", "Tobacco medicines", "Comparison and practical issues in India", "Conclusion"],
    answer: `## Principles
Medicines in addiction work in several ways:
- Managing withdrawal (detoxification) with cross tolerant drugs or symptomatic agents.
- Substitution with a longer acting, safer drug of the same class (opioid substitution, nicotine replacement).
- Blocking the reward of the drug (opioid antagonists).
- Aversion (disulfiram).
- Reducing craving and relapse (acamprosate, naltrexone, varenicline).
Medicines work best combined with psychosocial treatment.

## Alcohol
Withdrawal:
- Benzodiazepines (chlordiazepoxide, diazepam; lorazepam or oxazepam in liver disease) substitute for alcohol at GABA A receptors, preventing seizures and delirium tremens; given in fixed or symptom triggered schedules using CIWA-Ar.
- Thiamine (parenteral in high risk patients) prevents and treats Wernicke encephalopathy.
Relapse prevention:
- Disulfiram blocks aldehyde dehydrogenase, causing an unpleasant reaction with alcohol; effective with supervision; avoid in heart and liver disease and psychosis.
- Naltrexone (50 mg) blocks mu opioid receptors, reducing the dopamine reward from alcohol and heavy drinking days; avoid in opioid users and liver failure.
- Acamprosate (666 mg three times a day) modulates glutamate NMDA activity and restores the balance disturbed by chronic drinking; reduces return to drinking after abstinence; renally excreted, so safe in liver disease but not renal failure.
- Baclofen (GABA B agonist) and topiramate are used off label; nalmefene for reduced drinking in some countries.

## Opioids
Withdrawal:
- Buprenorphine taper, or clonidine and lofexidine (alpha 2 agonists that reduce noradrenergic hyperactivity), with symptomatic drugs.
Substitution:
- Methadone: full mu agonist with a long half life (about 24 to 36 hours), oral once daily, 60 to 120 mg; risks of overdose in early treatment, QTc prolongation and interactions.
- Buprenorphine: partial mu agonist and kappa antagonist with high affinity and slow dissociation; ceiling on respiratory depression; sublingual 8 to 24 mg; can precipitate withdrawal if started too early; combined with naloxone to deter injection; long acting injections and implants exist in some countries.
Antagonist:
- Naltrexone blocks opioid effects; for detoxified, motivated patients; overdose risk if stopped.
Overdose:
- Naloxone, a short acting antagonist, by injection or nasal spray.

## Tobacco
- Nicotine replacement therapy (patches, gum, lozenges, inhalers): substitutes nicotine without tar and carbon monoxide; combining a patch with a short acting form is most effective.
- Bupropion: inhibits dopamine and noradrenaline reuptake and blocks nicotinic receptors; reduces craving and withdrawal; seizure risk.
- Varenicline: partial agonist at alpha 4 beta 2 nicotinic receptors; provides some dopamine release to ease craving and blocks nicotine's reward if the person smokes; the most effective single drug.
- Cytisine: a plant derived partial agonist similar to varenicline, inexpensive.

## Comparison
| Mechanism | Alcohol | Opioids | Tobacco |
| Withdrawal | Benzodiazepines, thiamine | Buprenorphine, clonidine, lofexidine | NRT |
| Substitution | Not used routinely | Methadone, buprenorphine | NRT |
| Partial agonism | | Buprenorphine | Varenicline, cytisine |
| Antagonism | Naltrexone | Naltrexone, naloxone | |
| Aversion | Disulfiram | | |
| Anti craving | Acamprosate, naltrexone, baclofen | | Bupropion, varenicline |

## Practical issues in India
- Disulfiram is widely used because families supervise medicines; covert use without consent is unethical.
- Buprenorphine substitution is available through NACO OST centres and the Drug Treatment Clinic scheme; methadone at selected centres.
- Varenicline, bupropion and NRT are available, though cost limits use; smokeless tobacco needs particular attention.
- Over the counter misuse of codeine syrups, tramadol and benzodiazepines complicates care.
- The NDPS Act controls buprenorphine and methadone; section 64A supports treatment over punishment.

## Conclusion
Addiction medicines act by managing withdrawal, substituting safer drugs, blocking reward, causing aversion or reducing craving. Knowing their pharmacology lets the clinician match the medicine to the substance, the patient's goals and their physical health, always alongside psychosocial treatment.`,
    keyPoints: ["Five mechanisms of addiction medicines", "Benzodiazepines and thiamine in alcohol withdrawal", "Disulfiram, naltrexone, acamprosate mechanisms and cautions", "Methadone versus buprenorphine pharmacology", "Naltrexone and naloxone", "NRT, bupropion, varenicline mechanisms", "Comparison table", "Indian practice issues"],
    visuals: [
      vis("receptor", { receptor: "mu opioid" }, "Opioids: compare methadone (full agonist), buprenorphine (partial agonist) and naltrexone (antagonist)."),
      chain("Tobacco: how varenicline helps", [["Partial agonist at nicotinic receptor", ""], ["Some dopamine release", "Eases craving and withdrawal"], ["Blocks nicotine binding", "Smoking feels less rewarding"], ["Higher quit rates", ""]]),
    ],
    module: "substance",
    ref: "Stahl ch 13 addiction; Maudsley substance chapter; Jonas 2014 JAMA; Mattick Cochrane OST; Cahill Cochrane varenicline; Anthenelli 2016 EAGLES",
  },
  {
    id: "phar-l08-008",
    subject: "psychopharmacology",
    topic: "adrenergic-drugs",
    marks: 5,
    difficulty: 2,
    exams: ["md-psychiatry"],
    question: "Write short notes on the uses of adrenergic drugs (propranolol, prazosin, clonidine) in psychiatry.",
    plan: ["Propranolol", "Prazosin", "Clonidine and related drugs", "Cautions"],
    answer: `## Propranolol
A non selective beta blocker that crosses the blood brain barrier.
- Akathisia: 10 to 40 mg two or three times a day.
- Performance anxiety: 10 to 40 mg about an hour before a talk or exam, reducing tremor and palpitations; not effective for generalised social anxiety.
- Lithium induced tremor.
- Aggression after brain injury (higher doses).
- Under research: blocking reconsolidation of traumatic memories.
Cautions: asthma, heart block, diabetes (masks hypoglycaemia); highly toxic in overdose (bradycardia, hypotension, seizures), so avoid large supplies in people at suicide risk.

## Prazosin
An alpha 1 adrenergic antagonist.
- Trauma related nightmares and sleep disturbance in PTSD, starting at 1 mg at night and increasing slowly; evidence is mixed after a large negative trial.
Cautions: first dose hypotension and dizziness; take at bedtime.

## Clonidine and related drugs
Alpha 2 agonists that reduce noradrenaline release from the locus coeruleus.
- Opioid withdrawal (clonidine, lofexidine).
- ADHD, tics and Tourette's disorder (clonidine, guanfacine).
- Sleep problems and aggression in children with neurodevelopmental disorders.
- Hyperarousal in PTSD (limited evidence).
Cautions: sedation, hypotension, bradycardia, and rebound hypertension on abrupt stopping; taper gradually.

## Conclusion
Adrenergic drugs treat specific symptoms such as akathisia, performance anxiety, nightmares, opioid withdrawal and tics; their cardiovascular effects need monitoring.`,
    keyPoints: ["Propranolol for akathisia, performance anxiety, lithium tremor", "Propranolol overdose and asthma cautions", "Prazosin for nightmares with mixed evidence", "First dose hypotension", "Clonidine for opioid withdrawal, ADHD, tics", "Rebound hypertension"],
    module: "medicine-profiles",
    ref: "Maudsley; Stahl prescriber's guide; Raskind 2018 prazosin NEJM",
  },
  {
    id: "phar-l08-009",
    subject: "psychopharmacology",
    topic: "generics-bioequivalence",
    marks: 5,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "Write short notes on generic medicines and bioequivalence in psychiatry.",
    plan: ["Definitions", "Bioequivalence testing", "Concerns in psychiatry", "Indian context"],
    answer: `## Definitions
A generic medicine contains the same active ingredient, strength, dosage form and route as the original (innovator) brand and is expected to have the same effect. It may differ in inactive ingredients, shape and colour. Branded generics, sold under company brand names, are the norm in India.

## Bioequivalence
Generics are approved by showing bioequivalence: in healthy volunteers, the 90 percent confidence interval for the ratio of the generic to the reference product's area under the curve (AUC, total exposure) and peak concentration (Cmax) must fall within 80 to 125 percent. Narrow therapeutic index drugs may need tighter limits.

## Concerns in psychiatry
- Narrow therapeutic index drugs (lithium, carbamazepine, clozapine) may show clinically important changes when switching between products; check levels after a switch.
- Modified release formulations (lithium, venlafaxine, methylphenidate, bupropion, paliperidone) may differ in release profile.
- Changes in tablet appearance can confuse patients and reduce adherence, and may lead to duplication.
- Reports of reduced efficacy or more side effects after switching are often difficult to separate from nocebo effects, but real problems occur, especially with poor quality manufacturing.

## Indian context
India is a major producer of generic medicines worldwide. Quality varies between manufacturers; the Central Drugs Standard Control Organisation regulates approval and quality. The National Medical Commission encourages prescribing by generic name, and Janaushadhi stores sell low cost generics. Consistency of supply (staying on the same product) helps for lithium and clozapine.

## Conclusion
Generic psychotropics make treatment affordable and are usually equivalent; extra care is needed for narrow therapeutic index and modified release drugs.`,
    keyPoints: ["Definition of generic and branded generic", "80 to 125 percent bioequivalence range for AUC and Cmax", "Narrow therapeutic index drugs", "Modified release differences", "Adherence and confusion", "Indian production, CDSCO, NMC generic prescribing"],
    module: "medicine-profiles",
    ref: "CDSCO bioequivalence guidelines; NMC 2023 generic prescribing regulation; Maudsley generics",
  },
  {
    id: "phar-l08-010",
    subject: "psychopharmacology",
    topic: "clozapine-smoking-viva",
    marks: 5,
    difficulty: 3,
    exams: ["md-psychiatry"],
    question: "Viva: A patient stable on clozapine 400 mg a day, who smokes 20 cigarettes a day, is admitted to a smoke free ward. What will you do?",
    plan: ["Explain the interaction", "Predict the effect", "Act on dose and monitoring", "Plan for discharge"],
    answer: `## The interaction
Polycyclic aromatic hydrocarbons in tobacco smoke induce the liver enzyme CYP1A2, which metabolises clozapine (and olanzapine). Smokers therefore need higher doses. Nicotine itself does not cause the induction, so nicotine replacement does not prevent the effect.

## Predicted effect
When the patient stops smoking, enzyme induction wears off over about one to two weeks, and clozapine levels can rise by about 50 percent or more. This can cause sedation, hypersalivation, hypotension, constipation and ileus, confusion and seizures.

## What to do
- Measure a baseline clozapine level on admission if possible.
- Offer nicotine replacement for withdrawal and craving.
- Reduce the clozapine dose gradually, for example by about a quarter over the first week (to about 300 mg), guided by levels and side effects.
- Repeat clozapine and norclozapine levels about a week after stopping smoking, and again after dose changes.
- Monitor for sedation, constipation, seizures and changes in mental state.
- Check for other interacting factors such as infection, which also raises levels, and new drugs such as fluvoxamine or ciprofloxacin.

## Discharge
If the patient restarts smoking after discharge, levels will fall and relapse may follow; plan dose adjustment and an early level, and encourage continued abstinence with support.

## Conclusion
Stopping smoking can make clozapine levels rise dangerously; anticipate it, reduce the dose, check levels and reverse the plan if smoking restarts.`,
    keyPoints: ["CYP1A2 induction by smoke hydrocarbons", "NRT does not induce", "Levels rise by about half over one to two weeks", "Toxicity features", "Baseline and repeat levels", "Dose reduction plan", "Re-adjust if smoking restarts"],
    module: "antipsychotics",
    ref: "Maudsley smoking and psychotropics; de Leon clozapine smoking pharmacokinetics",
  },
]);
