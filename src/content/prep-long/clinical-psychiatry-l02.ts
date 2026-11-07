import type { LongQA } from "@/lib/prep/long-types";
import { chain, compare, timeline, tree, vis } from "./visual";

export const CLINICAL_PSYCHIATRY_L02: LongQA[] = [
  {
    id: "cpsy-l02-001",
    subject: "clinical-psychiatry",
    topic: "treatment-resistant-schizophrenia",
    marks: 15,
    difficulty: 3,
    exams: ["md-psychiatry"],
    question: "Define treatment-resistant schizophrenia. Discuss its assessment and management, with emphasis on clozapine.",
    plan: ["Definition with consensus criteria and prevalence", "Rule out pseudo-resistance", "Clozapine: evidence, initiation, monitoring, adverse effects", "Clozapine resistance and other options", "Indian practice points", "Conclusion"],
    answer: `## Definition
Treatment-resistant schizophrenia (TRS) is persistence of at least moderate symptoms and functional impairment despite adequate treatment with at least two different antipsychotics. The international TRRIP consensus requires:
- Two adequate trials, each of at least six weeks at a therapeutic dose (at least 600 mg chlorpromazine equivalents a day).
- Adherence of at least 80 percent of prescribed doses, confirmed by more than one source, ideally with plasma levels or a long acting injection for one trial.
- Symptoms rated on a standard scale (PANSS or BPRS) as at least moderate, with functional impairment.
About 20 to 30 percent of people with schizophrenia are treatment resistant, many from the first episode.

## Ruling out pseudo-resistance
- Poor adherence (the most common reason).
- Inadequate dose or duration, or low levels due to smoking (which induces CYP1A2) or rapid metabolism.
- Substance use, especially cannabis and alcohol.
- Wrong diagnosis: organic psychosis, mood disorder, autism.
- Side effects mistaken for symptoms (akathisia for agitation, parkinsonism for negative symptoms).
- Ongoing stressors and high expressed emotion.

## Clozapine
Evidence: in the landmark 1988 trial by John Kane, about 30 percent of resistant patients responded to clozapine compared with 4 percent on chlorpromazine. Overall, 40 to 60 percent of resistant patients improve. Clozapine also reduces suicidal behaviour (the InterSePT trial), violence and mortality, and is the only medicine approved for TRS.

Initiation:
- Baseline blood count with neutrophils, ECG, weight, glucose, lipids, liver function, troponin and C reactive protein.
- Start at 12.5 mg once or twice a day, increasing gradually (by about 25 mg a day) to 300 to 450 mg a day over two to three weeks; slower in older adults and outpatients.
- Monitor pulse, temperature and blood pressure during titration.
- Aim for a plasma level of at least 350 ng per ml before judging response; allow at least eight weeks at that level.

Monitoring:
- Neutrophil counts weekly for the first 18 weeks, then every two weeks to one year, then monthly, as in many national schemes (local rules vary; in the USA the mandatory monitoring programme was removed in 2025).
- Troponin and CRP weekly for the first four weeks for myocarditis.
- Metabolic monitoring at three months and then yearly.

Adverse effects:
| Effect | Key point |
| Neutropenia and agranulocytosis | About 0.8 percent; most in first 18 weeks; stop if severe |
| Myocarditis and cardiomyopathy | Usually in first 4 to 8 weeks; fever, tachycardia, chest pain, raised troponin |
| Seizures | Dose related, above about 600 mg; valproate or lamotrigine cover |
| Constipation and ileus | Can be fatal; prophylactic laxatives |
| Hypersalivation | Night time; hyoscine or glycopyrrolate |
| Metabolic | Weight gain, diabetes, dyslipidaemia; metformin can help |
| Others | Sedation, orthostatic hypotension, tachycardia, fever in the first weeks, enuresis |
If clozapine is stopped for more than 48 hours, it must be re-titrated from the starting dose. Smoking cessation raises levels sharply.

## Clozapine resistance
About 40 percent do not respond adequately. Options:
- Check adherence and plasma levels.
- Augment with a second antipsychotic (amisulpride or aripiprazole have the best evidence; aripiprazole also lowers weight and prolactin).
- ECT augmentation, which showed benefit in a randomised trial.
- CBT for psychosis, family intervention and rehabilitation.
- Treat comorbid depression and substance use.

## If clozapine cannot be used
High dose olanzapine, combination antipsychotics, ECT, and psychosocial treatment. Long acting injections help when adherence is the problem.

## Indian practice
Clozapine is widely available and inexpensive in India (common brands include Sizopin and Skizoril), and many patients take it, but monitoring is often irregular because of cost and distance. Clear plans for blood tests, patient education about fever, sore throat and constipation, and involving family improve safety. Clozapine is often started late; guidelines encourage offering it as soon as two trials have failed.

## Conclusion
TRS is common and should be defined strictly after excluding pseudo-resistance. Clozapine is the treatment of choice, with careful titration and monitoring; augmentation and ECT help those who still do not respond.`,
    keyPoints: ["TRRIP criteria: two trials, six weeks, dose, adherence, ratings", "Prevalence 20 to 30 percent", "Pseudo-resistance causes", "Kane 1988 evidence and anti suicide effect", "Titration schedule and target level 350", "Neutrophil and myocarditis monitoring", "Major adverse effects including ileus and re-titration after 48 hours", "Clozapine resistance options"],
    pitfalls: ["Calling a patient resistant without checking adherence", "No mention of myocarditis or constipation", "Delaying clozapine for years"],
    visuals: [
      chain("Pathway in treatment resistance", [["Antipsychotic 1", "Six weeks, adequate dose"], ["Antipsychotic 2", "Different drug, check adherence"], ["Exclude pseudo-resistance", "Levels, substances, diagnosis"], ["Clozapine", "Level of at least 350 ng per ml"], ["Augment if needed", "Amisulpride, aripiprazole, ECT"]]),
      vis("receptor", { receptor: "D2", caption: "Clozapine binds D2 weakly and leaves quickly, unlike most antipsychotics." }),
    ],
    module: "antipsychotics",
    ref: "Howes 2017 TRRIP consensus; Kane 1988; Meltzer InterSePT 2003; Maudsley Prescribing Guidelines clozapine chapter; Petrides 2015 ECT augmentation; FDA REMS removal 2025",
  },
  {
    id: "cpsy-l02-002",
    subject: "clinical-psychiatry",
    topic: "mania-management",
    marks: 10,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "Discuss the management of an acute manic episode.",
    plan: ["Assessment and setting", "Remove triggers", "Medicines: antipsychotics, lithium, valproate, combinations, benzodiazepines", "ECT and special situations", "Psychosocial care and transition to maintenance"],
    answer: `## Assessment and setting
- Confirm the diagnosis and exclude organic and substance causes (steroids, stimulants, cannabis, thyroid disease, head injury).
- Assess risk: violence, reckless spending, sexual risk, driving, dehydration and exhaustion, and suicide in mixed states.
- Choose the setting: many patients need admission. Under the MHCA 2017, independent admission (section 85) if the patient has capacity and agrees; supported admission (section 89) if the patient lacks capacity and criteria are met.
- Baseline tests: blood count, renal and liver function, thyroid, glucose, lipids, pregnancy test, ECG, urine drug screen.

## Remove triggers
Stop antidepressants and stimulants; reduce caffeine and alcohol; protect sleep; reduce stimulation in a calm, low stimulus environment.

## Medicines
Antipsychotics:
- Fastest acting and most effective in network meta-analyses; haloperidol, olanzapine and risperidone rank highly, with quetiapine, aripiprazole, asenapine and cariprazine also effective.
- Olanzapine 10 to 20 mg or risperidone 2 to 6 mg are common choices.

Mood stabilisers:
- Lithium: effective, especially in classical euphoric mania; slower onset (one to two weeks); target levels about 0.8 to 1.0 mmol per litre in acute treatment, checked 12 hours after the last dose.
- Valproate: useful in mixed and rapid cycling states; can be given as a loading dose of about 20 to 30 mg per kg; avoid in women who could become pregnant because of birth defects and developmental effects.
- Carbamazepine as an alternative.

Combinations:
- An antipsychotic plus lithium or valproate is more effective than monotherapy in severe mania.

Benzodiazepines:
- Lorazepam or clonazepam short term for agitation and sleep.

Rapid tranquillisation:
- For severe agitation, oral first; then intramuscular lorazepam, olanzapine, or haloperidol with promethazine, with monitoring of vital signs.

## ECT
For severe or treatment resistant mania, mania in pregnancy, catatonia or delirious mania. It is highly effective.

## Psychosocial care
Simple, clear communication, avoiding confrontation; involving the family; protecting finances and dignity; psychoeducation once insight improves.

## Transition to maintenance
Continue the effective treatment after remission. Most patients need long term maintenance; lithium is preferred for its relapse prevention and anti suicide effects. Plan follow up, blood level monitoring, early warning signs and a relapse plan, and discuss an advance directive.

## Conclusion
Acute mania is managed by ensuring safety, removing triggers and using an antipsychotic, often with lithium or valproate, while planning long term prevention from the start.`,
    keyPoints: ["Organic and substance causes excluded", "Risk assessment and MHCA admission routes", "Stop antidepressants", "Antipsychotics as fastest; named drugs", "Lithium and valproate with key cautions", "Combination for severe mania", "ECT indications", "Plan maintenance from the start"],
    visuals: [compare("Lithium or valproate?", ["Lithium", ["Best for classical euphoric mania", "Strong relapse and suicide prevention", "Narrow therapeutic range", "Needs renal and thyroid monitoring"], "First choice for long term"], ["Valproate", ["Useful in mixed and rapid cycling", "Can be loaded quickly", "Avoid in women who may become pregnant", "Liver, weight, hair loss"], "Second line, never in pregnancy"])],
    module: "bipolar",
    ref: "Cipriani 2011 Lancet mania NMA; Maudsley mania guideline; BAP bipolar guideline 2016; MHCA 2017 s85, s89",
  },
  {
    id: "cpsy-l02-003",
    subject: "clinical-psychiatry",
    topic: "bipolar-maintenance",
    marks: 10,
    difficulty: 3,
    exams: ["md-psychiatry"],
    question: "Discuss the long-term (maintenance) treatment of bipolar disorder.",
    plan: ["Why maintenance is needed", "Lithium as first choice with monitoring", "Other medicines by polarity", "Psychological treatments", "Special groups and conclusion"],
    answer: `## Why maintenance is needed
More than 90 percent of people with bipolar I disorder have further episodes after a first mania. Each episode carries risk of suicide, job loss, debts and relationship breakdown, and repeated episodes may worsen the course. Maintenance treatment is usually recommended after a first manic episode, or after a hypomanic episode with significant impairment or risk.

## Lithium
- The first choice for most patients. It reduces relapse into both mania and depression, and reduces suicide.
- In the BALANCE trial, lithium alone or with valproate was better than valproate alone.
- Usual maintenance level is 0.6 to 0.8 mmol per litre (higher, up to 1.0, if relapse occurs at lower levels).
- Monitoring: levels every three months in the first year and then every six months; renal function, thyroid function and calcium every six months; weight.
- Patients must know the signs of toxicity (vomiting, diarrhoea, coarse tremor, ataxia, confusion) and avoid dehydration and interacting drugs (NSAIDs, ACE inhibitors, thiazides).
- Abrupt stopping increases the risk of rebound mania; taper over at least four weeks.

## Other medicines
| Medicine | Main strength |
| Quetiapine | Prevents both poles, useful when depression dominates |
| Lamotrigine | Prevents depression more than mania; slow titration to avoid rash |
| Aripiprazole, olanzapine, risperidone long acting injection | Prevent mania |
| Valproate | Prevents mania; avoid in women of childbearing potential |
| Carbamazepine | Second line; many interactions |
Choice depends on the polarity of past episodes, past response, side effects, physical health, pregnancy plans and adherence. Antidepressants should not be used alone and are generally avoided long term in bipolar I disorder.

## Psychological treatments
- Group psychoeducation (as in the Barcelona programme) reduces relapse and admissions.
- Interpersonal and social rhythm therapy stabilises daily routines and sleep.
- Family focused therapy improves communication and lowers relapse.
- CBT helps with depressive symptoms and adherence.
- Self management: mood charting, regular sleep, avoiding alcohol and drugs, recognising early warning signs (reduced sleep is often the first sign of mania).

## Special groups
- Women: plan pregnancy; switch from valproate; lithium may be continued with careful monitoring; high risk of postpartum relapse.
- Older adults: lower lithium levels and closer renal monitoring.
- Physical health: higher rates of obesity, diabetes and cardiovascular disease; annual checks.

## Indian context
Lithium is inexpensive and widely available (for example Lithosun), but access to level monitoring can be limited; family support helps with adherence, and advance directives under the MHCA 2017 can record treatment wishes during relapse.

## Conclusion
Maintenance treatment of bipolar disorder combines a mood stabiliser, preferably lithium, with psychoeducation and routine stability. Monitoring, a relapse plan and shared decisions keep people well.`,
    keyPoints: ["Recurrence rate and when to start maintenance", "Lithium as first choice with anti suicide effect", "BALANCE trial", "Levels and monitoring schedule", "Toxicity signs and interacting drugs", "Other agents by polarity", "Psychoeducation, IPSRT and family therapy", "Special groups including pregnancy"],
    visuals: [vis("curve", { kind: "half-life", title: "Lithium: steady state and why levels are checked" }, "Levels settle after about five half lives; check 12 hours after the last dose.")],
    module: "stabilisers",
    ref: "BALANCE 2010 Lancet; Colom 2003 psychoeducation; BAP 2016; Maudsley lithium monitoring; NICE CG185",
  },
  {
    id: "cpsy-l02-004",
    subject: "clinical-psychiatry",
    topic: "treatment-resistant-depression",
    marks: 15,
    difficulty: 3,
    exams: ["md-psychiatry"],
    question: "Define treatment-resistant depression. Discuss its assessment and management, including the lessons of the STAR*D study.",
    plan: ["Definition and prevalence", "Assessment and pseudo-resistance", "STAR*D findings", "Pharmacological strategies: optimise, switch, combine, augment", "Neuromodulation, ketamine and psychotherapy", "Conclusion"],
    answer: `## Definition
Treatment-resistant depression (TRD) is usually defined as failure to respond to at least two adequate trials of antidepressants (adequate dose for at least four to six weeks, with good adherence) in the current episode. Response means at least a 50 percent reduction in a depression scale; remission means minimal symptoms (for example HAM-D 7 or less). About a third of people with depression do not remit after two treatments.

## Assessment
Check for pseudo-resistance and contributing factors:
- Diagnosis: bipolar depression, psychotic features, personality disorder, dementia.
- Adherence, dose and duration; drug interactions and rapid metabolism.
- Medical causes: hypothyroidism, anaemia, vitamin deficiencies, chronic pain, sleep apnoea, medicines (steroids, beta blockers, isotretinoin).
- Substance and alcohol use.
- Ongoing stressors: domestic violence, debt, caregiving.
- Comorbid anxiety, OCD or PTSD.
Staging models (such as the Thase and Rush stages) and structured ratings help track response.

## Lessons from STAR*D
The Sequenced Treatment Alternatives to Relieve Depression study treated about 4000 outpatients in four steps:
| Step | Treatment | Remission |
| 1 | Citalopram | About 37 percent |
| 2 | Switch (sertraline, bupropion, venlafaxine) or augment (bupropion, buspirone) or CBT | About 31 percent |
| 3 | Switch (mirtazapine, nortriptyline) or augment (lithium, T3) | About 14 percent |
| 4 | Tranylcypromine or venlafaxine plus mirtazapine | About 13 percent |
Lessons:
- Cumulative remission was about two thirds, so persistence pays.
- Each later step had lower remission and higher relapse.
- No single switch or augmentation strategy was clearly superior.
- Many responses took longer than eight weeks.
- Later reanalyses suggested remission rates were lower than first reported, adding caution.

## Pharmacological strategies
- Optimise: increase the dose within the licensed range; allow enough time.
- Switch: to a different class (SSRI to SNRI, mirtazapine, bupropion, vortioxetine), or to a tricyclic or MAOI in specialist care.
- Combine: SSRI or SNRI plus mirtazapine (with mixed trial evidence).
- Augment:
- Lithium (levels 0.4 to 0.8), with the best long standing evidence and anti suicide benefit.
- Second generation antipsychotics: aripiprazole, quetiapine, brexpiprazole and cariprazine have approvals or strong evidence.
- Liothyronine (T3).
- Esketamine nasal spray (approved in the USA in 2019) with an oral antidepressant; intravenous ketamine used off label. Both act rapidly through NMDA receptor blockade but need monitoring for dissociation, blood pressure and misuse.

## Neuromodulation
- ECT: the most effective treatment for severe and resistant depression, with remission rates of about 60 to 80 percent in many studies, especially with psychotic features, catatonia, food refusal or high suicide risk. Under the MHCA 2017 it must be given with anaesthesia and muscle relaxants.
- rTMS over the left dorsolateral prefrontal cortex: modest to moderate effect with few side effects; accelerated protocols are newer.
- Vagus nerve stimulation and deep brain stimulation are experimental or specialist options.

## Psychological and other treatments
CBT added to medicines helped people with TRD in a large UK trial (CoBalT). Behavioural activation, interpersonal therapy and CBASP for chronic depression are options. Exercise, sleep management and social support help. Psilocybin assisted therapy is under research.

## Indian context
TCAs and lithium are inexpensive and still useful; ECT is widely available in teaching hospitals; rTMS is increasingly available in cities. Cost, follow up and family involvement shape choices.

## Conclusion
TRD is common. Careful reassessment comes first, then a stepwise approach of optimising, switching, combining and augmenting, with early consideration of ECT and psychotherapy. STAR*D shows that persistence helps but each step brings smaller gains.`,
    keyPoints: ["Definition with two adequate trials", "Response versus remission", "Pseudo-resistance and medical causes", "STAR*D four steps with remission rates", "Lessons including cumulative remission and diminishing returns", "Augmentation with lithium, antipsychotics, T3", "Esketamine and ketamine with cautions", "ECT and rTMS; CBT evidence"],
    pitfalls: ["Calling depression resistant after one trial", "Missing bipolar depression", "Forgetting ECT"],
    visuals: [
      vis("experiment", { title: "STAR*D: remission at each step", question: "What share of patients still in the study remitted at each step?", unit: "%", conditions: [{ label: "Step 1 (citalopram)", value: 37 }, { label: "Step 2", value: 31 }, { label: "Step 3", value: 14 }, { label: "Step 4", value: 13 }], why: "Persistence helps, but each later step brings smaller gains." }),
      vis("brainslicer", { title: "Where ECT and rTMS act", start: "tms", caption: "The rTMS coil sits over the left dorsolateral prefrontal cortex." }),
    ],
    module: "antidepressants",
    ref: "Rush 2006 STAR*D; Pigott 2023 reanalysis; Wiles 2013 CoBalT; Maudsley TRD; FDA esketamine 2019; UK ECT Review Group 2003",
  },
  {
    id: "cpsy-l02-005",
    subject: "clinical-psychiatry",
    topic: "postpartum-psychosis",
    marks: 10,
    difficulty: 3,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "Discuss the clinical features, risk factors and management of postpartum psychosis.",
    plan: ["Definition and epidemiology", "Clinical features", "Risk factors and relation to bipolar disorder", "Assessment and management including mother baby unit", "Prevention in high risk women and conclusion"],
    answer: `## Definition and epidemiology
Postpartum psychosis is a severe psychiatric emergency with rapid onset of psychotic and mood symptoms after childbirth. It occurs in about 1 to 2 per 1000 deliveries, usually in the first two weeks, often within the first few days.

## Clinical features
- Rapidly changing, fluctuating picture: elation or depression, mixed states, irritability.
- Delusions, often about the baby (that the baby is evil, possessed, ill or swapped) or about the mother's own body.
- Hallucinations and confusion, perplexity and disorientation that can resemble delirium.
- Severe insomnia and agitation.
- Risks of suicide and infanticide are serious; neglect of the baby and of the mother's own care.
Most cases are bipolar spectrum illnesses, and many women later have episodes outside the postpartum period.

## Risk factors
- Bipolar disorder: about one in five women with bipolar I disorder have a postpartum episode.
- Previous postpartum psychosis: recurrence risk in later pregnancies of about 50 percent.
- Family history of bipolar disorder or postpartum psychosis.
- First pregnancy, sleep loss, stopping mood stabilisers in pregnancy, and obstetric complications.

## Assessment
- Treat as an emergency; assess risk to mother and baby.
- Exclude organic causes: infection and sepsis, eclampsia, thyroid disease, anaemia, electrolyte imbalance, drug effects, Sheehan syndrome, cerebral venous thrombosis, and autoimmune encephalitis.
- Investigations: blood count, electrolytes, calcium, glucose, thyroid, liver and renal function, urine, cultures; imaging if neurological signs.

## Management
Setting:
- Admission, ideally to a mother baby unit so bonding and breastfeeding can continue under supervision. NIMHANS in Bengaluru runs a well known mother baby unit; elsewhere, admission with a family member caring for the baby is common in India.
Medicines:
- Antipsychotics (olanzapine, quetiapine, haloperidol) and benzodiazepines for sleep and agitation.
- Lithium is effective for acute treatment and prevention; breastfeeding on lithium needs careful monitoring of the infant or may be avoided.
- ECT is highly effective and fast, and is preferred in severe cases, catatonia, refusal of food or high risk.
Breastfeeding:
- Discuss risks and benefits for each medicine; many antipsychotics are compatible with monitoring.
Psychosocial:
- Psychoeducation for family, support with baby care, sleep protection (others do night feeds), and follow up for later depression.

## Prevention
For women with bipolar disorder or previous postpartum psychosis: plan before pregnancy, consider continuing a mood stabiliser or starting lithium or an antipsychotic immediately after delivery, protect sleep, arrange early postnatal review, and record a plan in the obstetric notes. An advance directive under the MHCA 2017 can be helpful.

## Conclusion
Postpartum psychosis is rare but dangerous and closely linked to bipolar disorder. Early recognition, exclusion of medical causes, admission and effective treatment, often with ECT or lithium, give good recovery, and prevention planning is essential for women at risk.`,
    keyPoints: ["Incidence 1 to 2 per 1000, onset in first two weeks", "Fluctuating mood and psychotic features with confusion", "Infanticide and suicide risk", "Bipolar link and recurrence risk", "Organic exclusion list", "Mother baby unit and NIMHANS", "Antipsychotics, lithium and ECT", "Prevention with postpartum prophylaxis"],
    visuals: [timeline("After delivery: when each condition starts", [["Baby blues", "Days 3 to 5"], ["Postpartum psychosis", "Usually within two weeks"], ["Postpartum depression", "Weeks to months"]], "Psychosis is early and rapid; treat it as an emergency.")],
    module: "bipolar",
    ref: "Jones 2014 Lancet perinatal; Wesseloo 2016 recurrence meta-analysis; Chandra NIMHANS mother baby unit; Maudsley perinatal",
  },
  {
    id: "cpsy-l02-006",
    subject: "clinical-psychiatry",
    topic: "psychotic-depression",
    marks: 5,
    difficulty: 2,
    exams: ["md-psychiatry"],
    question: "Write short notes on the management of psychotic depression.",
    plan: ["Features and why it matters", "Medicines with evidence", "ECT", "Continuation"],
    answer: `## Features and importance
Psychotic depression is a major depressive episode with delusions or hallucinations. Delusions are usually mood congruent (guilt, sin, poverty, nihilism, illness, deserved punishment); hallucinations may be accusing voices. It is often severe, with psychomotor change, high suicide risk and food refusal, and it is easily missed because patients hide their beliefs. It is more common in older adults and may signal later bipolar disorder.

## Medicines
- Combined antidepressant and antipsychotic is more effective than either alone. The STOP-PD trials used sertraline with olanzapine and showed better remission, and continuing the combination reduced relapse.
- Other combinations (venlafaxine with quetiapine, or a tricyclic with an antipsychotic) are also used.
- Monitor for side effects, especially falls and metabolic effects in older people.

## ECT
ECT is a first line option, often preferred, with remission rates of about 80 percent or more in some studies. It is especially indicated with high suicide risk, refusal of food and fluids, catatonia, or failure of medicines. Under the MHCA 2017 it is given with anaesthesia and muscle relaxant and with informed consent or, where capacity is lacking, through the legal safeguards.

## Continuation
Continue the combination for at least four months after remission before considering a slow taper of the antipsychotic, and continue the antidepressant longer. After ECT, maintenance medicines (often with lithium) or continuation ECT prevent relapse.

## Conclusion
Psychotic depression needs active, combined treatment or ECT, close risk monitoring and long continuation.`,
    keyPoints: ["Mood congruent delusions and severity", "High suicide risk", "Combination better than monotherapy", "STOP-PD", "ECT as first line", "Continuation strategy"],
    module: "depression",
    ref: "Meyers 2009 STOP-PD; Flint 2019 STOP-PD II; Maudsley psychotic depression",
  },
  {
    id: "cpsy-l02-007",
    subject: "clinical-psychiatry",
    topic: "late-life-depression",
    marks: 10,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "Discuss the clinical features and management of depression in older adults.",
    plan: ["Epidemiology and importance", "Clinical features that differ from younger adults", "Vascular depression and the link with dementia", "Assessment tools and differential", "Management with safety points", "Conclusion"],
    answer: `## Epidemiology and importance
Depression affects about 10 to 15 percent of older adults in the community, more in hospitals, nursing homes and people with chronic illness. It is under recognised because symptoms are blamed on age or physical illness. Older men have the highest suicide rates in many countries.

## Clinical features
- Less reported sadness; more somatic complaints, fatigue, pain and sleep problems.
- Anxiety, agitation and irritability.
- Cognitive complaints and slowing (depression related cognitive impairment, previously called pseudodementia).
- Loss of interest, withdrawal, poor self care, weight loss.
- Hypochondriacal and nihilistic delusions in severe cases.
- Higher rates of psychotic depression and melancholia.
Indian elderly may present with "weakness", body aches and loss of appetite, often in the context of loneliness after children migrate.

## Vascular depression and dementia
- Vascular depression (Alexopoulos) describes late onset depression with cerebrovascular risk factors and white matter changes, executive dysfunction, apathy, psychomotor slowing and poorer response to antidepressants.
- Late life depression is both a risk factor for and an early sign of dementia.

## Assessment
- Geriatric Depression Scale (15 item version, which avoids somatic items) and PHQ 9.
- Cognitive screening (MMSE, MoCA), physical examination and tests: thyroid, B12, folate, sodium, calcium, glucose, renal function, ECG; imaging if focal signs or late onset with cognitive change.
- Medication review: steroids, beta blockers, benzodiazepines, levodopa.
- Suicide risk, including access to medicines and pesticides.

## Management
- Medicines: SSRIs such as sertraline or escitalopram (watch QTc with higher citalopram and escitalopram doses), or mirtazapine for poor sleep and appetite. Start low, go slow, but reach an adequate dose and allow longer trials (up to 8 to 12 weeks).
- Safety: hyponatraemia (SIADH) with SSRIs and SNRIs in the first weeks, falls, gastrointestinal bleeding with antiplatelets, drug interactions. Avoid tricyclics where possible because of anticholinergic, cardiac and fall risks.
- ECT is effective and well tolerated in older adults, particularly for psychotic depression, food refusal and high suicide risk.
- Psychological: CBT, problem solving therapy, interpersonal therapy, reminiscence therapy and behavioural activation.
- Social: reduce isolation, day centres, family involvement, pension and elder care support; the National Programme for Health Care of the Elderly in India provides geriatric clinics.
- Treat vascular risk factors and encourage exercise.
- Continue treatment for at least 12 months after remission, often longer, because relapse rates are high.

## Conclusion
Depression in older adults is common, often presents with somatic and cognitive features, and is linked with vascular disease and dementia. It responds to treatment, but prescribing needs care, and ECT and psychological therapies are important options.`,
    keyPoints: ["Prevalence and suicide in older men", "Somatic and cognitive presentation", "Vascular depression features", "Link with dementia", "GDS 15 and medical work up", "SSRIs with hyponatraemia and fall cautions", "ECT and psychotherapies", "Longer continuation"],
    visuals: [compare("Depression in a younger and an older adult", ["Younger adult", ["Reports sadness readily", "Fewer physical illnesses", "Shorter trial of medicine often enough"], "Classic picture"], ["Older adult", ["Body complaints, fatigue, poor memory", "Medical illness and many medicines", "Hyponatraemia and falls with treatment", "Highest suicide risk in older men"], "Easily missed"])],
    module: "depression",
    ref: "Alexopoulos 1997 vascular depression; Yesavage GDS; Maudsley older adults; NPHCE",
  },
  {
    id: "cpsy-l02-008",
    subject: "clinical-psychiatry",
    topic: "late-onset-psychosis",
    marks: 5,
    difficulty: 3,
    exams: ["md-psychiatry"],
    question: "Write short notes on late-onset schizophrenia and very-late-onset schizophrenia-like psychosis.",
    plan: ["Definitions and history", "Clinical features and risk factors", "Differential diagnosis", "Treatment"],
    answer: `## Definitions and history
Martin Roth described "late paraphrenia" in older people with persecutory delusions and preserved personality. An international consensus in 2000 proposed two groups:
- Late onset schizophrenia: onset after 40.
- Very late onset schizophrenia like psychosis: onset after 60.

## Clinical features
- Much more common in women.
- Persecutory delusions, often "partition delusions" (people or substances passing through walls or ceilings into the home).
- Prominent auditory, sometimes visual or tactile, hallucinations.
- Fewer negative symptoms and less formal thought disorder than early onset schizophrenia.
- Relatively preserved personality and functioning.

## Risk factors
Sensory impairment (especially deafness), social isolation, living alone, being unmarried or widowed, premorbid paranoid or schizoid traits, and migration. Family history is less important than in early onset cases.

## Differential diagnosis
Delirium, dementia (especially Lewy body and Alzheimer disease with psychosis), psychotic depression, delusional disorder, substance or medication induced psychosis, and focal brain lesions. Brain imaging and cognitive testing are needed, and follow up because a proportion later develop dementia.

## Treatment
- Low dose antipsychotics (for example risperidone 0.5 to 2 mg or amisulpride at low doses), with attention to falls, stroke risk, metabolic and anticholinergic effects.
- Correct hearing and vision.
- Reduce isolation through social support and day care.
- Engage gently; many patients lack insight and live alone, so community follow up is needed.

## Conclusion
Psychosis beginning in later life has distinct features and risk factors, needs exclusion of organic causes, and responds to low dose antipsychotics and sensory and social support.`,
    keyPoints: ["Roth's late paraphrenia", "Cut offs of 40 and 60", "Female predominance and partition delusions", "Sensory impairment and isolation", "Organic differential and dementia risk", "Low dose antipsychotics and hearing aids"],
    module: "psychosis",
    ref: "Howard 2000 consensus Am J Psychiatry; Roth 1955",
  },
  {
    id: "cpsy-l02-009",
    subject: "clinical-psychiatry",
    topic: "bipolar-depression",
    marks: 10,
    difficulty: 3,
    exams: ["md-psychiatry"],
    question: "Discuss the management of bipolar depression. Why are antidepressants controversial?",
    plan: ["Burden and differences from unipolar depression", "Medicines with evidence", "The antidepressant debate", "ECT, psychotherapy and special issues", "Conclusion"],
    answer: `## Burden
People with bipolar disorder spend about three times as much time depressed as manic. Bipolar depression carries most of the disability and suicide risk. It often presents first, so many patients are misdiagnosed with unipolar depression for years.

Clues that a depression is bipolar: early onset, many brief episodes, postpartum onset, atypical features (hypersomnia, overeating), psychotic features, mixed features, family history of bipolar disorder, and antidepressant induced hypomania.

## Medicines with evidence
| Medicine | Notes |
| Quetiapine (300 mg) | Effective for acute depression and prevention; sedation, weight |
| Lurasidone | Effective, weight neutral; take with food |
| Cariprazine | Effective in bipolar I depression |
| Lumateperone | Approved in the USA |
| Olanzapine with fluoxetine | Effective; metabolic effects |
| Lithium | Modest acute effect, strong prevention and anti suicide effect |
| Lamotrigine | More for prevention of depression; slow titration |
Valproate has limited evidence for bipolar depression.

## The antidepressant debate
- Risks: switching into mania or hypomania (higher with tricyclics and venlafaxine than with SSRIs or bupropion), induction of mixed states and possibly rapid cycling.
- Evidence: the large STEP-BD trial found that adding an antidepressant to a mood stabiliser gave no extra benefit over placebo.
- Current guidance: avoid antidepressant monotherapy in bipolar I disorder. If an antidepressant is used, combine it with a mood stabiliser or antipsychotic, prefer an SSRI or bupropion, use it for a limited time and stop if mixed features appear. Some patients, particularly with bipolar II and a clear past response, do benefit.

## ECT and other treatments
- ECT is effective in severe, psychotic or treatment resistant bipolar depression and in pregnancy.
- Ketamine and rTMS have emerging evidence.
- Psychological therapies (psychoeducation, CBT, interpersonal and social rhythm therapy, family focused therapy) speed recovery and reduce relapse.
- Sleep regularity, avoiding alcohol and treating thyroid problems also help.

## Special issues
Suicide risk assessment at every visit; lithium's anti suicide benefit; care in women planning pregnancy (avoid valproate); monitoring for metabolic effects with antipsychotics.

## Conclusion
Bipolar depression is the main burden of bipolar disorder. First line treatments are quetiapine, lurasidone, cariprazine, lithium and lamotrigine, with psychotherapy. Antidepressants are controversial because of switching risk and weak evidence, and are best avoided alone.`,
    keyPoints: ["Time spent depressed and suicide burden", "Clues to bipolarity", "Named effective medicines", "Lithium and lamotrigine roles", "Switch risk varies by antidepressant", "STEP-BD finding", "Avoid antidepressant monotherapy", "ECT and psychotherapy"],
    visuals: [tree("Treating bipolar depression", [["Bipolar depression", "", -1], ["First line", "", 0], ["Quetiapine, lurasidone, cariprazine", "", 1], ["Lithium, lamotrigine", "Especially for prevention", 1], ["Severe or resistant", "", 0], ["ECT", "", 4], ["Antidepressant with a mood stabiliser", "Limited time, watch for switch", 4], ["Always", "", 0], ["Psychoeducation, sleep routine, suicide checks", "", 7]])],
    module: "bipolar",
    ref: "Judd 2002 symptom burden; Sachs 2007 STEP-BD; Pacchiarotti 2013 ISBD antidepressant task force; Maudsley bipolar depression",
  },
  {
    id: "cpsy-l02-010",
    subject: "clinical-psychiatry",
    topic: "star-d",
    marks: 5,
    difficulty: 3,
    exams: ["md-psychiatry"],
    question: "Viva: What is the difference between response, remission, recovery, relapse and recurrence in depression?",
    plan: ["Define each term", "Give operational cut offs", "Link to treatment phases", "Why the distinction matters"],
    answer: `## Definitions
These terms come from the Frank and colleagues consensus and are used in trials and clinical practice.
- Response: a meaningful improvement, usually at least a 50 percent reduction from the baseline score on a scale such as the HAM-D or MADRS.
- Remission: symptoms reduced to a minimal level, for example HAM-D 7 or less or MADRS 10 or less, so the person no longer meets criteria and is nearly symptom free.
- Recovery: remission that has lasted long enough (usually at least four to six months) to mean the episode has ended.
- Relapse: return of symptoms during remission, before recovery, meaning the same episode has returned.
- Recurrence: a new episode after recovery.

## Treatment phases
| Phase | Aim | Usual duration |
| Acute | Response, then remission | 6 to 12 weeks |
| Continuation | Prevent relapse | 6 to 12 months after remission |
| Maintenance | Prevent recurrence | Years, in recurrent depression |

## Why it matters
- Remission, not just response, is the goal: residual symptoms predict relapse and poor functioning.
- Stopping medicines in the continuation phase doubles the risk of relapse.
- People with three or more episodes, or two with risk factors, are offered maintenance treatment.
- STAR*D used remission as its main outcome.

## Conclusion
Clear definitions guide how long to treat: aim for remission, continue to prevent relapse, and maintain to prevent recurrence.`,
    keyPoints: ["Response 50 percent reduction", "Remission cut offs on HAM-D or MADRS", "Recovery as sustained remission", "Relapse versus recurrence", "Three phases with durations", "Residual symptoms predict relapse"],
    visuals: [timeline("Treatment phases of depression", [["Acute phase", "Aim for remission"], ["Continuation phase", "Prevent relapse"], ["Recovery", "Episode ended"], ["Maintenance phase", "Prevent recurrence"]])],
    module: "depression",
    ref: "Frank 1991 consensus definitions; Rush 2006 ACNP task force; NICE NG222",
  },
];
