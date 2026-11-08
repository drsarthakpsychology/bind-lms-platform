import type { LongQA } from "@/lib/prep/long-types";
import { anchored, chain, compare, tree, vis } from "./visual";

export const PSYCHOPHARMACOLOGY_L03: LongQA[] = anchored([
  {
    id: "phar-l03-001",
    subject: "psychopharmacology",
    topic: "antipsychotic-classes",
    marks: 15,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "Classify antipsychotic drugs. Explain their mechanisms of action with reference to the dopamine pathways, and compare first and second generation antipsychotics.",
    plan: ["History and classification", "Dopamine pathways and D2 blockade", "Serotonin 2A and other receptor actions", "Comparison of generations", "Newer mechanisms and conclusion"],
    answer: `## History
Chlorpromazine was introduced in 1952 by Delay and Deniker after Laborit noticed its calming effect in surgery. It transformed psychiatric care. Clozapine (1960s, reintroduced in 1990 for resistant schizophrenia) showed that antipsychotic effect was possible without extrapyramidal side effects, leading to the "atypical" or second generation drugs.

## Classification
| Group | Examples |
| First generation, low potency | Chlorpromazine, thioridazine |
| First generation, high potency | Haloperidol, fluphenazine, trifluoperazine, flupentixol, zuclopenthixol, pimozide |
| Second generation | Clozapine, olanzapine, quetiapine, risperidone, paliperidone, ziprasidone, amisulpride, lurasidone, asenapine, iloperidone |
| Partial agonists (sometimes called third generation) | Aripiprazole, brexpiprazole, cariprazine |
| Muscarinic agents | Xanomeline with trospium |
Chemical classes (phenothiazines, butyrophenones, thioxanthenes, benzamides) are older ways of grouping.

## Dopamine pathways and D2 blockade
All currently used antipsychotics except muscarinic agents block or partially stimulate D2 receptors. The effect depends on the pathway:
- Mesolimbic (ventral tegmental area to nucleus accumbens): overactive in psychosis; D2 blockade reduces positive symptoms.
- Mesocortical (ventral tegmental area to prefrontal cortex): underactive, linked to negative and cognitive symptoms; D2 blockade may worsen them.
- Nigrostriatal (substantia nigra to striatum): D2 blockade causes extrapyramidal side effects (dystonia, parkinsonism, akathisia) and, with long term use, tardive dyskinesia.
- Tuberoinfundibular (hypothalamus to pituitary): dopamine normally inhibits prolactin; D2 blockade raises prolactin.
About 65 to 80 percent D2 occupancy gives antipsychotic effect; above about 80 percent, extrapyramidal effects increase.

## Serotonin 2A and other receptors
- Second generation drugs block 5 HT2A receptors more strongly than D2 (the serotonin dopamine antagonist idea of Meltzer). 5 HT2A blockade increases dopamine release in the nigrostriatal and mesocortical pathways, reducing extrapyramidal effects and perhaps helping negative symptoms.
- Fast dissociation from D2 (clozapine, quetiapine) may also explain low extrapyramidal risk.
- Other receptors explain side effects: H1 (sedation, weight gain), M1 (dry mouth, constipation, confusion), alpha 1 (postural hypotension), 5 HT2C (weight gain), and 5 HT1A partial agonism and 5 HT7 blockade (possible antidepressant effects with aripiprazole, lurasidone and quetiapine's metabolite norquetiapine).

## Comparison of generations
| Feature | First generation | Second generation |
| Main action | D2 blockade | D2 and 5 HT2A blockade, or D2 partial agonism |
| Positive symptoms | Effective | Effective; clozapine superior in resistance |
| Negative symptoms | Little effect, may worsen secondary negative symptoms | Modest benefit, mostly by fewer side effects |
| Extrapyramidal effects | High, especially high potency | Lower (except risperidone at high doses) |
| Tardive dyskinesia | Higher risk | Lower risk |
| Prolactin | Raised | Raised with risperidone, paliperidone, amisulpride; low with aripiprazole, quetiapine, clozapine |
| Metabolic effects | Low with high potency drugs | High with clozapine and olanzapine, moderate with quetiapine and risperidone, low with aripiprazole, lurasidone, ziprasidone |
| Cost | Low | Mostly low in India as generics |
Large pragmatic trials (CATIE in the USA, CUtLASS in the UK) found the generations differ less than once believed; the important differences are between individual drugs, and clozapine stands apart. Network meta analyses show small efficacy differences (clozapine, amisulpride, olanzapine and risperidone rank highest) and large differences in side effects.

## Newer mechanisms
Partial agonists (aripiprazole, brexpiprazole, cariprazine) stabilise dopamine signalling; xanomeline with trospium acts on M1 and M4 muscarinic receptors to reduce psychosis without D2 blockade; pimavanserin, a 5 HT2A inverse agonist, treats psychosis in Parkinson disease.

## Conclusion
Antipsychotics act mainly by reducing dopamine signalling in the mesolimbic pathway, with effects on other pathways and receptors causing side effects. The first and second generation labels are less useful than knowing each drug's receptor profile, side effects and the special role of clozapine.`,
    keyPoints: ["History: chlorpromazine and clozapine", "Classification table including partial agonists and muscarinic agents", "Four dopamine pathways with effects of D2 block", "D2 occupancy window", "5 HT2A blockade and fast off theories", "Receptor basis of side effects", "Comparison table and CATIE, CUtLASS", "Newer mechanisms"],
    pitfalls: ["Saying second generation drugs are clearly more effective", "Forgetting the tuberoinfundibular pathway", "No receptor explanation for side effects"],
    visuals: [
      vis("pathways", { system: "dopamine" }, "Dopamine pathways and D2 blockade: toggle the D2 blocker, then add 5 HT2A block."),
      compare("Comparison of generations", ["First generation", ["Strong D2 block", "More extrapyramidal effects", "More tardive dyskinesia", "Fewer metabolic effects (high potency)"], "Motor side effects"], ["Second generation", ["D2 and 5 HT2A block or partial agonism", "Fewer extrapyramidal effects", "More metabolic effects for some", "Clozapine best in resistance"], "Metabolic side effects"]),
    ],
    module: "antipsychotics",
    ref: "Stahl ch 5 antipsychotics; Leucht 2013 and Huhn 2019 Lancet NMA; Lieberman 2005 CATIE; Jones 2006 CUtLASS; Meltzer 1989",
  },
  {
    id: "phar-l03-002",
    subject: "psychopharmacology",
    topic: "metabolic-syndrome",
    marks: 10,
    difficulty: 2,
    exams: ["md-psychiatry"],
    question: "Discuss antipsychotic induced metabolic side effects and how they should be monitored and managed.",
    plan: ["Why it matters: mortality gap", "Metabolic effects and drug ranking", "Mechanisms", "Monitoring schedule", "Management: prevention, switching, lifestyle, metformin and others", "Conclusion"],
    answer: `## Why it matters
People with severe mental illness die 10 to 20 years earlier than the general population, mainly from cardiovascular disease. Antipsychotic induced weight gain, diabetes and dyslipidaemia add to risks from smoking, poor diet and inactivity. South Asians have a higher baseline risk of diabetes and central obesity.

## Metabolic effects
- Weight gain, especially central (abdominal), often rapid in the first months and greatest in young, drug naive patients.
- Insulin resistance, impaired glucose tolerance, type 2 diabetes, and rarely diabetic ketoacidosis.
- Raised triglycerides and LDL cholesterol, low HDL.
- Metabolic syndrome: central obesity with raised triglycerides, low HDL, raised blood pressure and raised fasting glucose.
Risk ranking: clozapine and olanzapine highest; quetiapine and risperidone or paliperidone moderate; aripiprazole, brexpiprazole, cariprazine, lurasidone, ziprasidone and haloperidol lower.

## Mechanisms
Blockade of H1 and 5 HT2C receptors increases appetite; M3 blockade affects insulin release from the pancreas; direct effects on insulin sensitivity in liver and muscle occur even before weight gain.

## Monitoring
| Measure | Baseline | Then |
| Weight and BMI | Yes | Weekly for 6 weeks, then at 12 weeks, then at least yearly (more often in first year) |
| Waist circumference | Yes | At 12 weeks, then yearly |
| Blood pressure | Yes | At 12 weeks, then yearly |
| Fasting glucose or HbA1c | Yes | At 12 weeks, then yearly |
| Lipids | Yes | At 12 weeks, then yearly |
Asian cut offs for obesity and waist are lower (BMI 23 for overweight and 25 for obesity in Indian guidelines; waist above 90 cm in men and 80 cm in women).

## Management
- Prevention: choose a lower risk drug where clinically suitable, use the lowest effective dose, and discuss the risks at the start.
- Lifestyle: diet advice (reduce sugary drinks, fried foods and portion sizes), physical activity, smoking cessation; structured programmes work best when started early.
- Switching to a lower risk antipsychotic (for example aripiprazole or lurasidone) if the illness allows.
- Adding aripiprazole to clozapine can reduce weight and improve lipids.
- Metformin (500 mg rising to 1 to 2 g a day) has the best evidence for limiting and reversing antipsychotic weight gain and improving insulin resistance.
- GLP 1 receptor agonists (liraglutide, semaglutide) are effective for weight loss, including with clozapine, and are being used increasingly.
- Treat diabetes, hypertension and dyslipidaemia with physicians (statins as indicated).
- Topiramate has smaller effects with cognitive side effects.

## Conclusion
Metabolic effects of antipsychotics contribute to the large mortality gap in severe mental illness. Choosing drugs wisely, regular monitoring with Asian cut offs, early lifestyle intervention and metformin or GLP 1 agonists can reduce this harm.`,
    keyPoints: ["Mortality gap and South Asian risk", "Weight, glucose and lipid effects and metabolic syndrome", "Drug ranking from clozapine and olanzapine to aripiprazole and lurasidone", "Receptor mechanisms H1, 5 HT2C, M3", "Monitoring table with timings", "Asian BMI and waist cut offs", "Metformin and GLP 1 agonists", "Switching and aripiprazole augmentation"],
    visuals: [tree("Metabolic risk by drug", [["Antipsychotics", "", -1], ["High risk", "Clozapine, olanzapine", 0], ["Moderate risk", "Quetiapine, risperidone, paliperidone", 0], ["Lower risk", "Aripiprazole, lurasidone, ziprasidone, haloperidol", 0]], "Metabolic effects")],
    module: "antipsychotics",
    ref: "Maudsley weight gain and diabetes; Pillinger 2020 Lancet Psychiatry metabolic NMA; de Silva 2016 metformin meta-analysis; Indian consensus obesity guidelines 2009",
  },
  {
    id: "phar-l03-003",
    subject: "psychopharmacology",
    topic: "tardive-dyskinesia",
    marks: 10,
    difficulty: 3,
    exams: ["md-psychiatry"],
    question: "Describe tardive dyskinesia: clinical features, risk factors, pathophysiology, assessment and management.",
    plan: ["Definition and features", "Epidemiology and risk factors", "Pathophysiology", "Assessment with AIMS", "Prevention and treatment including VMAT2 inhibitors", "Conclusion"],
    answer: `## Definition and features
Tardive dyskinesia (TD) is a late onset, often persistent, involuntary movement disorder caused by long term exposure to dopamine blocking drugs (antipsychotics and also metoclopramide). DSM-5-TR requires exposure for at least a few months (one month in people over 60). Features:
- Orofacial dyskinesia: lip smacking, chewing, puckering, tongue protrusion and writhing ("fly catcher tongue"), grimacing, blinking.
- Choreoathetoid movements of fingers, hands, arms and legs, rocking of the trunk, and abnormal breathing movements.
- Movements worsen with stress and distraction and disappear in sleep.
- Related tardive syndromes: tardive dystonia, tardive akathisia, tardive tics.

## Epidemiology and risk factors
Annual incidence is about 5 percent with first generation antipsychotics and lower (about 2 to 3 percent) with second generation drugs; prevalence in long term patients is about 20 to 30 percent. Risk factors:
- Older age (the strongest risk), female sex (especially after menopause).
- Long duration and high cumulative dose; first generation and high potency drugs.
- Early acute extrapyramidal side effects or parkinsonism.
- Mood disorders, diabetes, substance use, brain damage, and anticholinergic use.

## Pathophysiology
- Dopamine receptor supersensitivity: chronic D2 blockade causes up regulation and supersensitivity of postsynaptic D2 receptors in the striatum.
- Damage to GABA neurons in the striatum and oxidative stress from increased dopamine turnover.
- Maladaptive plasticity in basal ganglia circuits.
Reducing or stopping the antipsychotic can first worsen the movements (withdrawal dyskinesia) because supersensitive receptors are unmasked; increasing the dose can mask them temporarily.

## Assessment
The Abnormal Involuntary Movement Scale (AIMS) rates movements of seven body areas from 0 to 4 and should be done at baseline and at least yearly (every six months in high risk people). Exclude other causes: Huntington disease, Wilson disease, stereotypies of schizophrenia, dental problems, and spontaneous dyskinesias in older people.

## Prevention
Use antipsychotics only when indicated, at the lowest effective dose, prefer drugs with lower risk, avoid unnecessary anticholinergics, monitor regularly, and inform patients.

## Management
- Review the need for the antipsychotic; if possible, gradually reduce the dose or switch to clozapine (lowest TD risk and may improve it) or quetiapine.
- Stop anticholinergic drugs, which can worsen TD.
- VMAT2 inhibitors (valbenazine and deutetrabenazine) are approved in the USA for TD and reduce AIMS scores; tetrabenazine is an older option. They deplete presynaptic dopamine; side effects include sedation, and depression with tetrabenazine.
- Other options with limited evidence: Ginkgo biloba extract, vitamin E, clonazepam, amantadine; botulinum toxin for focal tardive dystonia; deep brain stimulation in severe cases.
- Psychological support, as TD can be disfiguring and stigmatising.

## Conclusion
Tardive dyskinesia is a common, potentially irreversible complication of long term antipsychotic use. Prevention through careful prescribing and regular AIMS monitoring is essential, and VMAT2 inhibitors and clozapine offer treatment options.`,
    keyPoints: ["Definition with exposure time", "Orofacial and limb features, absent in sleep", "Incidence by generation and prevalence", "Risk factors with older age strongest", "Dopamine supersensitivity and withdrawal dyskinesia", "AIMS at baseline and yearly", "Stop anticholinergics, switch to clozapine", "VMAT2 inhibitors"],
    visuals: [chain("Pathophysiology", [["Long term D2 blockade", ""], ["Up regulation of D2 receptors", "Supersensitivity"], ["Striatal GABA neurons damaged", "Oxidative stress"], ["Involuntary movements", "Mouth, tongue, limbs"]])],
    module: "antipsychotics",
    ref: "DSM-5-TR tardive dyskinesia; Carbon 2017 TD incidence meta-analysis; Maudsley TD; Hauser 2017 KINECT 3 valbenazine; Guy 1976 AIMS",
  },
  {
    id: "phar-l03-004",
    subject: "psychopharmacology",
    topic: "prolactin",
    marks: 5,
    difficulty: 2,
    exams: ["md-psychiatry"],
    question: "Write short notes on antipsychotic induced hyperprolactinaemia.",
    plan: ["Mechanism", "Drugs and risk", "Clinical effects", "Assessment and management"],
    answer: `## Mechanism
Dopamine from the tuberoinfundibular pathway inhibits prolactin release from the anterior pituitary through D2 receptors. Blocking these receptors raises prolactin. Drugs that cross the blood brain barrier poorly (amisulpride, risperidone's metabolite paliperidone) act strongly on the pituitary, which lies outside the barrier.

## Drugs and risk
- High: amisulpride, sulpiride, risperidone, paliperidone, haloperidol and other first generation drugs.
- Low: aripiprazole (may lower prolactin), brexpiprazole, cariprazine, quetiapine, clozapine, olanzapine (dose related, modest).

## Clinical effects
- Women: menstrual disturbance, amenorrhoea, galactorrhoea, breast enlargement, infertility, reduced libido.
- Men: erectile dysfunction, reduced libido, gynaecomastia, galactorrhoea (rare).
- Both: reduced bone mineral density (through low sex hormones), possibly increased breast cancer risk with long term high prolactin.
Patients rarely report these effects spontaneously; ask directly.

## Assessment
- Measure prolactin at baseline and if symptoms appear; a level more than about three times normal or rising on a low risk drug suggests another cause.
- Exclude pregnancy, hypothyroidism, renal failure, other drugs (metoclopramide) and a pituitary tumour (MRI if very high or with headache or visual field loss).

## Management
- If asymptomatic and mildly raised, monitor.
- Reduce the dose, or switch to a prolactin sparing drug (aripiprazole, quetiapine).
- Add aripiprazole (5 mg) to the current antipsychotic, which lowers prolactin effectively.
- Dopamine agonists (cabergoline, bromocriptine) only with specialist advice because of psychosis risk.
- Consider bone health and contraception (fertility may return after switching).

## Conclusion
Hyperprolactinaemia is common with several antipsychotics, distressing and often hidden; ask, measure and switch or add aripiprazole when needed.`,
    keyPoints: ["Tuberoinfundibular D2 mechanism", "Pituitary outside blood brain barrier", "High and low risk drugs", "Effects in women, men and bone", "Exclude other causes including tumour", "Switch or add aripiprazole"],
    module: "antipsychotics",
    ref: "Maudsley hyperprolactinaemia; Peuskens 2014 review; Shim 2007 aripiprazole adjunct trial",
  },
  {
    id: "phar-l03-005",
    subject: "psychopharmacology",
    topic: "qtc",
    marks: 5,
    difficulty: 3,
    exams: ["md-psychiatry"],
    question: "Write short notes on QTc prolongation with psychotropic drugs.",
    plan: ["What the QTc is and why it matters", "Psychotropics that prolong QTc", "Risk factors", "Monitoring and management"],
    answer: `## What it is
The QT interval on the ECG reflects ventricular depolarisation and repolarisation. Corrected for heart rate (QTc, often by Bazett's formula), normal values are below about 440 milliseconds in men and 470 in women. Drugs that block cardiac hERG potassium channels lengthen repolarisation; a QTc above 500 milliseconds, or an increase of more than 60, raises the risk of torsades de pointes, a ventricular arrhythmia that can cause sudden death.

## Psychotropics that prolong QTc
- Antipsychotics: higher risk with intravenous haloperidol, thioridazine, pimozide, sertindole and ziprasidone; moderate with quetiapine, chlorpromazine, iloperidone; low with aripiprazole, brexpiprazole, cariprazine and lurasidone.
- Antidepressants: tricyclics, citalopram and escitalopram (dose related); low with sertraline and mirtazapine.
- Others: methadone (dose related), lithium (minor), hydroxyzine, some antibiotics (macrolides, fluoroquinolones), antiarrhythmics, antimalarials and ondansetron.

## Risk factors
Female sex, older age, heart disease (heart failure, recent infarction, bradycardia), congenital long QT syndrome, family history of sudden death, low potassium or magnesium (vomiting, diuretics, eating disorders), high doses, intravenous use, and combinations of QTc prolonging drugs or CYP inhibitors that raise levels.

## Monitoring and management
- Take a baseline ECG before high risk drugs and in patients with risk factors, and repeat after dose increases.
- Correct potassium and magnesium.
- If QTc is 450 to 500 milliseconds, review drugs and consider a lower risk alternative; if above 500, stop the drug and seek cardiology advice.
- Avoid combining QTc prolonging drugs where possible.

## Conclusion
QTc prolongation is a rare but potentially fatal risk; knowing high risk drugs and patients, checking electrolytes and ECGs, and choosing safer drugs prevents most problems.`,
    keyPoints: ["QTc definition and normal values", "500 milliseconds and torsades risk", "hERG mechanism", "High and low risk antipsychotics and antidepressants", "Risk factors including electrolytes", "ECG monitoring and action thresholds"],
    module: "antipsychotics",
    ref: "Maudsley QT chapter; CredibleMeds; Beach 2013 QTc review",
  },
  {
    id: "phar-l03-006",
    subject: "psychopharmacology",
    topic: "partial-agonist-antipsychotics",
    marks: 10,
    difficulty: 3,
    exams: ["md-psychiatry"],
    question: "Compare aripiprazole, brexpiprazole and cariprazine.",
    plan: ["Concept of dopamine partial agonism", "Each drug: profile, indications, dose, side effects", "Comparison table", "Clinical uses and conclusion"],
    answer: `## Concept
These drugs are partial agonists at D2 and D3 receptors. They lower dopamine signalling where it is excessive (mesolimbic pathway) and maintain some signalling where it is low, giving antipsychotic effect with less prolactin rise and fewer extrapyramidal effects. They also act at 5 HT1A (partial agonism) and 5 HT2A (antagonism).

## Aripiprazole
- Highest intrinsic activity of the three at D2, so more activating and more akathisia.
- Indications: schizophrenia, mania, maintenance in bipolar disorder, adjunct in depression, irritability in autism, Tourette's disorder (in the USA).
- Dose: 10 to 30 mg; long acting injections available.
- Side effects: akathisia, restlessness, insomnia, nausea; low weight gain, low prolactin (can lower it), little QTc effect; impulse control problems (gambling) reported.
- Long half life (about 75 hours); CYP2D6 and 3A4 substrate.

## Brexpiprazole
- Lower intrinsic activity at D2 than aripiprazole and stronger 5 HT1A and 5 HT2A actions, so less akathisia.
- Indications: schizophrenia, adjunct in depression, and (in the USA, from 2023) agitation associated with Alzheimer dementia.
- Dose: 2 to 4 mg.
- Side effects: weight gain somewhat more than aripiprazole; akathisia less common.

## Cariprazine
- Strongest preference for D3 receptors, which may help negative symptoms and cognition.
- Indications: schizophrenia, mania, bipolar depression, and adjunct in depression.
- Dose: 1.5 to 6 mg.
- A trial in patients with predominant negative symptoms found cariprazine better than risperidone.
- Very long acting metabolites (desmethyl and didesmethyl cariprazine), so effects and side effects build up over weeks and persist after stopping.
- Side effects: akathisia, restlessness, insomnia; low metabolic and prolactin effects.

## Comparison
| Feature | Aripiprazole | Brexpiprazole | Cariprazine |
| D2 intrinsic activity | Highest | Lower | Intermediate |
| Special receptor feature | Broad use | Strong 5 HT1A and 5 HT2A | Strong D3 preference |
| Akathisia | Common | Less | Common |
| Weight gain | Low | Low to moderate | Low |
| Prolactin | Lowered or neutral | Neutral | Neutral |
| Special indications | Autism irritability, Tourette, LAIs | Dementia agitation | Negative symptoms, bipolar depression |

## Clinical uses
Useful in patients who have problems with weight, prolactin or sedation on other antipsychotics; aripiprazole is also used to lower prolactin or weight when added to other drugs. Switching from a full antagonist should be gradual to avoid rebound effects.

## Conclusion
The three partial agonists share a stabilising action at dopamine receptors and favourable metabolic and prolactin profiles, but differ in intrinsic activity, receptor preference, akathisia risk and approved uses.`,
    keyPoints: ["Partial agonism concept", "Aripiprazole intrinsic activity, indications, akathisia, long half life", "Brexpiprazole lower activity and dementia agitation approval", "Cariprazine D3 preference and negative symptom trial", "Cariprazine long acting metabolites", "Comparison table", "Clinical uses"],
    visuals: [vis("receptor", { receptor: "D2", caption: "Concept: try the partial agonist with high and then low dopamine." })],
    module: "antipsychotics",
    ref: "Stahl prescriber's guide monographs; Nemeth 2017 Lancet cariprazine negative symptoms; FDA brexpiprazole AD agitation 2023",
  },
  {
    id: "phar-l03-007",
    subject: "psychopharmacology",
    topic: "xanomeline",
    marks: 5,
    difficulty: 3,
    exams: ["md-psychiatry"],
    question: "Write short notes on xanomeline-trospium.",
    plan: ["What it is and approval", "Mechanism", "Evidence and side effects", "Significance"],
    answer: `## What it is
Xanomeline with trospium is an oral antipsychotic approved in the USA in September 2024 for schizophrenia in adults. It is the first antipsychotic in decades that does not act by blocking dopamine D2 receptors.

## Mechanism
- Xanomeline is an agonist at muscarinic M1 and M4 receptors in the brain. M4 activation in the striatum and midbrain reduces dopamine release in the associative striatum (the pathway linked to psychosis), and M1 activation may help cognition.
- Xanomeline alone caused troublesome peripheral cholinergic effects (nausea, vomiting, sweating, salivation). Trospium is a peripherally acting muscarinic antagonist that does not cross the blood brain barrier, so it blocks these peripheral effects while leaving the central action.

## Evidence and side effects
- Five week randomised trials (the EMERGENT programme) showed reductions in PANSS scores compared with placebo.
- Side effects: nausea, vomiting, constipation, dyspepsia, dry mouth, raised heart rate and urinary retention; little weight gain, sedation, prolactin rise or extrapyramidal effects.
- Cautions: urinary retention, narrow angle glaucoma, liver impairment; taken twice daily on an empty stomach.
- Long term comparative data with established antipsychotics are limited.

## Significance
It supports the idea that psychosis can be treated by modulating dopamine indirectly through cholinergic systems, opening a new class of treatments. It is not yet available in India.

## Conclusion
Xanomeline with trospium is a new muscarinic antipsychotic without D2 blockade and with a different side effect profile; its place in treatment will depend on longer term evidence.`,
    keyPoints: ["Approval in 2024 in the USA", "No D2 blockade", "M1 and M4 agonism reduces striatal dopamine", "Trospium blocks peripheral effects", "EMERGENT trials", "Cholinergic and anticholinergic side effects, few motor or metabolic effects"],
    module: "frontiers",
    ref: "Kaul 2024 Lancet EMERGENT-2; FDA approval Cobenfy Sept 2024; Brannan 2021 NEJM",
  },
  {
    id: "phar-l03-008",
    subject: "psychopharmacology",
    topic: "dose-equivalents",
    marks: 5,
    difficulty: 2,
    exams: ["md-psychiatry"],
    question: "Write short notes on chlorpromazine equivalents and antipsychotic dosing in first episode psychosis.",
    plan: ["What chlorpromazine equivalents are", "Examples", "Dosing principles in first episodes", "High dose and polypharmacy cautions"],
    answer: `## Chlorpromazine equivalents
Chlorpromazine equivalents express the dose of any antipsychotic as the dose of chlorpromazine with a similar antipsychotic effect, based on trials and expert consensus. They are used to compare doses, define adequate trials (for example at least 600 mg chlorpromazine equivalents in treatment resistance), and calculate total load when drugs are combined. Different methods give different values, so they are approximate.

## Approximate equivalents to 100 mg chlorpromazine
| Drug | Dose |
| Haloperidol | 2 mg |
| Risperidone | 1 to 2 mg |
| Olanzapine | 5 mg |
| Quetiapine | 150 mg |
| Aripiprazole | 7.5 mg |
| Trifluoperazine | 5 mg |
Another approach uses the percentage of the maximum licensed dose (for example olanzapine 20 mg as 100 percent).

## Dosing in first episode psychosis
- People in their first episode respond at lower doses and are more sensitive to side effects.
- Start low (for example risperidone 1 to 2 mg, olanzapine 5 mg, aripiprazole 5 to 10 mg) and increase slowly.
- Allow two to six weeks at a moderate dose before judging response.
- Most respond at doses near the lower end of the licensed range, matching D2 occupancy of about 65 to 80 percent.

## Cautions
High dose (above the licensed maximum or 100 percent of maximum when combined) and antipsychotic polypharmacy increase side effects and sudden cardiac death without clear benefit; they require documented reasons, ECG and physical monitoring and regular review.

## Conclusion
Chlorpromazine equivalents are a rough but useful way to compare doses; first episode patients need low doses and patience.`,
    keyPoints: ["Definition and uses", "At least four approximate equivalents", "Percentage of maximum dose method", "Low starting doses in first episode", "Allow time before judging", "High dose and polypharmacy cautions"],
    module: "antipsychotics",
    ref: "Leucht 2016 dose equivalents; Gardner 2010; Maudsley equivalent doses and high dose guidance",
  },
  {
    id: "phar-l03-009",
    subject: "psychopharmacology",
    topic: "antipsychotic-polypharmacy",
    marks: 5,
    difficulty: 3,
    exams: ["md-psychiatry"],
    question: "Write short notes on antipsychotic polypharmacy.",
    plan: ["Definition and frequency", "Reasons it happens", "Evidence for and against", "Good practice"],
    answer: `## Definition and frequency
Antipsychotic polypharmacy is the use of two or more antipsychotics at the same time, beyond brief cross tapering during a switch. It is common worldwide, including in Indian inpatient and outpatient services, in a third or more of patients in some surveys.

## Reasons
Incomplete response, a switch that was never completed, adding a sedating drug for agitation or sleep, combining a depot with oral drugs, adding a drug to offset side effects (aripiprazole for prolactin or weight with clozapine), and clinical inertia.

## Evidence
- Against: increased side effects (extrapyramidal, metabolic, sedation, QTc), drug interactions, higher total doses, poorer adherence and higher cost; limited trial evidence of benefit.
- For: clozapine augmentation with amisulpride or aripiprazole helps some resistant patients; aripiprazole added to other drugs reduces prolactin and weight. Large Finnish cohort studies found that some combinations (especially clozapine with aripiprazole) were linked to lower rehospitalisation than monotherapy, though this is observational.

## Good practice
- Use monotherapy first, at an adequate dose and duration, then clozapine for treatment resistance.
- If combining, have a clear reason, use evidence based combinations, monitor for side effects and QTc, and review benefit after a set time.
- Avoid combining two drugs with similar receptor profiles (two high potency D2 blockers).
- Gradually reduce to monotherapy when possible.

## Conclusion
Antipsychotic polypharmacy is common but mostly unsupported; it should be a deliberate, monitored and reviewed choice.`,
    keyPoints: ["Definition excluding cross taper", "Common in practice", "Reasons", "Risks", "Evidence based combinations such as clozapine with aripiprazole", "Monitoring and review"],
    module: "antipsychotics",
    ref: "Tiihonen 2019 JAMA Psychiatry Finnish cohort; Correll 2009 meta-analysis; Maudsley combined antipsychotics",
  },
  {
    id: "phar-l03-010",
    subject: "psychopharmacology",
    topic: "anticholinergic-eps",
    marks: 5,
    difficulty: 2,
    exams: ["md-psychiatry"],
    question: "Write short notes on the use of anticholinergic drugs with antipsychotics.",
    plan: ["Why they are used", "Indications", "Harms", "Good practice"],
    answer: `## Why they are used
Dopamine and acetylcholine are in balance in the striatum. D2 blockade by antipsychotics leaves relative cholinergic excess, causing extrapyramidal side effects. Anticholinergic drugs such as trihexyphenidyl (benzhexol), procyclidine and benztropine restore the balance.

## Indications
- Acute dystonia: intramuscular or intravenous anticholinergic gives rapid relief.
- Drug induced parkinsonism (tremor, rigidity, bradykinesia) when dose reduction or switching is not possible.
- Short term prophylaxis in young men started on high potency antipsychotics, especially by injection.
They are not effective for akathisia and worsen tardive dyskinesia.

## Harms
- Peripheral: dry mouth, constipation, urinary retention, blurred vision, tachycardia.
- Central: impaired memory and attention, confusion and delirium, especially in older adults; they worsen cognitive symptoms of schizophrenia.
- Worsening of tardive dyskinesia.
- Misuse: trihexyphenidyl is misused for its euphoric effect, which is commonly seen in Indian psychiatric practice.
- Anticholinergic burden from several drugs increases falls and dementia risk in older people.

## Good practice
- Do not prescribe routinely with every antipsychotic.
- Prefer lowering the dose or switching to a drug with lower extrapyramidal risk.
- Use the lowest dose for the shortest time and review regularly; taper gradually to avoid cholinergic rebound.
- Avoid in older adults and people with dementia or glaucoma.

## Conclusion
Anticholinergics are useful for acute dystonia and short term parkinsonism, but routine long term use causes cognitive harm and misuse.`,
    keyPoints: ["Dopamine acetylcholine balance", "Indications: dystonia, parkinsonism, short prophylaxis", "Not for akathisia, worsens TD", "Cognitive harms and delirium", "Trihexyphenidyl misuse", "Avoid routine use; taper"],
    module: "antipsychotics",
    ref: "Maudsley anticholinergic use; Desmarais 2012 review; Ogino 2014 anticholinergics in schizophrenia",
  },
]);
