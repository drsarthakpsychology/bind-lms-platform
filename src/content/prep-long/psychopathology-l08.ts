import type { LongQA } from "@/lib/prep/long-types";
import { anchored, brain, chain, compare, layers, tree } from "./visual";

export const PSYCHOPATHOLOGY_L08: LongQA[] = anchored([
  {
    id: "psyp-l08-001",
    subject: "psychopathology",
    topic: "alcohol-dependence",
    marks: 10,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance", "ma-semester"],
    question: "Describe the alcohol dependence syndrome and compare it with the DSM-5-TR and ICD-11 approaches to alcohol use disorders.",
    plan: ["Edwards and Gross' seven elements", "DSM-5-TR alcohol use disorder criteria and severity", "ICD-11 dependence and harmful pattern", "Comparison table", "Indian epidemiology and conclusion"],
    answer: `## The alcohol dependence syndrome
Griffith Edwards and Milton Gross described in 1976 a syndrome, rather than a single "addiction", with seven elements:
- Narrowing of the drinking repertoire: drinking becomes stereotyped, the same drink at the same times.
- Salience of drink seeking: drinking takes priority over family, work and health.
- Increased tolerance to alcohol.
- Repeated withdrawal symptoms: tremor, sweating, nausea, anxiety, and in severe cases seizures and delirium tremens.
- Relief or avoidance of withdrawal by further drinking, often early in the morning.
- Subjective awareness of a compulsion to drink, with craving and impaired control.
- Rapid reinstatement of the syndrome after a period of abstinence.
The concept separated dependence (a biopsychological syndrome of graded severity) from alcohol related problems, which can occur without dependence.

## DSM-5-TR alcohol use disorder
A problematic pattern leading to significant impairment or distress, with two or more of eleven criteria within twelve months:
- Taking more or for longer than intended; persistent wish or failed efforts to cut down; much time spent; craving.
- Failure to fulfil major roles; continued use despite social problems; giving up activities; use in hazardous situations; continued use despite physical or psychological problems.
- Tolerance and withdrawal.
Severity: mild 2 to 3, moderate 4 to 5, severe 6 or more. DSM-5 merged the old abuse and dependence categories, dropped "legal problems" and added craving. Specifiers include early or sustained remission and in a controlled environment.

## ICD-11
- Alcohol dependence: a disorder of regulation of use, with two or more of three features: impaired control; increasing priority given to drinking over other interests and responsibilities; and physiological features (tolerance, withdrawal, repeated use to avoid withdrawal). Usually present over at least twelve months, or one month if use is continuous.
- Harmful pattern of use of alcohol: damage to physical or mental health, or behaviour causing harm to others, without dependence.
- Episode of harmful use, and hazardous alcohol use (a risk state) are also coded.

| Feature | Edwards and Gross | DSM-5-TR | ICD-11 |
| Concept | Clinical syndrome | Single disorder on a continuum | Dependence separate from harmful use |
| Threshold | Clinical judgement | Two of eleven | Two of three |
| Severity | Graded | Mild, moderate, severe | Dependence versus harmful pattern |
| Craving | Compulsion | Criterion | Part of impaired control |

## Indian context
The 2019 national survey on the magnitude of substance use found that about 14.6 percent of Indians aged 10 to 75 currently use alcohol, and about 5 percent need help for harmful use or dependence. Use is far more common among men; country liquor and illicit brews cause outbreaks of methanol poisoning. Screening tools include the AUDIT (ten items; 8 or more suggests hazardous use) and CAGE.

## Conclusion
Edwards and Gross' syndrome remains the clinical foundation of modern definitions. DSM-5-TR treats alcohol use disorder as one continuum with severity levels, while ICD-11 keeps a compact definition of dependence and separate categories of harm, which suits public health use.`,
    keyPoints: ["All seven elements of the syndrome", "Separation of dependence from problems", "DSM-5-TR eleven criteria with two needed and severity bands", "Changes from DSM-IV", "ICD-11 three features with two needed and harmful pattern", "Comparison table", "Indian prevalence and AUDIT"],
    visuals: [compare("Two ways to define the disorder", ["DSM-5-TR", ["Eleven criteria", "Two or more in a year", "Severity: mild, moderate, severe", "Abuse and dependence merged"], "One continuum"], ["ICD-11", ["Three features", "Two or more needed", "Harmful pattern coded separately", "Hazardous use as a risk state"], "Dependence versus harm"])],
    module: "substance",
    ref: "Edwards and Gross 1976 BMJ; DSM-5-TR AUD; ICD-11 6C40; Ambekar 2019 Magnitude of Substance Use in India",
  },
  {
    id: "psyp-l08-002",
    subject: "psychopathology",
    topic: "wernicke",
    marks: 5,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "Write short notes on Wernicke-Korsakoff syndrome.",
    plan: ["Cause and pathology", "Wernicke encephalopathy features and Caine criteria", "Korsakoff syndrome", "Treatment"],
    answer: `## Cause and pathology
Wernicke encephalopathy and Korsakoff syndrome are acute and chronic stages of brain damage due to thiamine (vitamin B1) deficiency, most often in alcohol dependence because of poor diet, poor absorption and storage. Other causes include hyperemesis gravidarum, bariatric surgery, malnutrition and cancer. Lesions affect the mammillary bodies, medial thalamus, periaqueductal grey and the floor of the fourth ventricle.

## Wernicke encephalopathy
The classic triad:
- Confusion (global confusional state).
- Eye signs: nystagmus, lateral rectus palsy, gaze palsies.
- Ataxia of gait.
All three are present in only a minority of patients, so the diagnosis is often missed. Caine's criteria need two of four: dietary deficiency, eye signs, cerebellar dysfunction, and altered mental state or mild memory impairment. It is a medical emergency with significant mortality.

## Korsakoff syndrome
A chronic amnesic syndrome that follows in many untreated or late treated cases:
- Severe anterograde amnesia and variable retrograde amnesia.
- Confabulation, especially early.
- Relatively preserved attention, intelligence and procedural memory.
- Apathy and lack of insight.

## Treatment
- Give parenteral thiamine at high doses at the first suspicion, before glucose, because glucose without thiamine can precipitate Wernicke encephalopathy. A common regimen is intravenous thiamine 500 mg three times daily for three days, then 250 mg daily for several days, followed by oral thiamine.
- Prophylactic parenteral thiamine for high risk patients during alcohol detoxification.
- Correct magnesium, which is needed for thiamine to work.
- Abstinence, nutrition and cognitive rehabilitation; about a quarter recover significantly, and many need long term support.

## Conclusion
Wernicke Korsakoff syndrome is preventable. Every person with alcohol dependence admitted to hospital should receive thiamine.`,
    keyPoints: ["Thiamine deficiency and lesion sites", "Classic triad and its rarity", "Caine's two of four criteria", "Korsakoff amnesia and confabulation", "High dose parenteral thiamine before glucose", "Prophylaxis in detox"],
    module: "substance",
    ref: "Maudsley alcohol withdrawal and thiamine; Caine 1997; Kopelman 2009",
  },
  {
    id: "psyp-l08-003",
    subject: "psychopathology",
    topic: "personality-classification",
    marks: 15,
    difficulty: 3,
    exams: ["md-psychiatry", "mcp-entrance", "ma-semester"],
    question: "Discuss the concept and classification of personality disorders. Compare the DSM-5-TR categorical model, its alternative model and the ICD-11 dimensional model.",
    plan: ["Define personality and personality disorder", "General criteria and the ten DSM categories in clusters", "Problems with categories", "AMPD: criterion A and B", "ICD-11 severity and trait domains", "Comparison, Indian context and conclusion"],
    answer: `## Concept
Personality is a person's characteristic pattern of thinking, feeling and relating to others. A personality disorder is an enduring pattern that deviates markedly from cultural expectations, is pervasive and inflexible, starts in adolescence or early adulthood, is stable over time, and causes distress or impairment. Historical roots include Pinel's "manie sans delire", Prichard's "moral insanity", Kurt Schneider's psychopathic personalities and Cleckley's description of psychopathy.

## DSM-5-TR Section II: general criteria
An enduring pattern of inner experience and behaviour, deviating from cultural expectations, in two or more of: cognition (ways of seeing self, others and events), affectivity, interpersonal functioning and impulse control. Not better explained by another mental disorder, substances or medical conditions.

## The ten categories
| Cluster | Disorders | Common theme |
| A: odd, eccentric | Paranoid, schizoid, schizotypal | Suspicion, detachment, odd beliefs |
| B: dramatic, emotional, erratic | Antisocial, borderline, histrionic, narcissistic | Impulsivity, emotional instability, disregard for others |
| C: anxious, fearful | Avoidant, dependent, obsessive compulsive | Anxiety, need for control or approval |
Prevalence of any personality disorder is about 10 percent in community surveys and much higher in clinical and forensic settings. Indian community surveys report lower rates, which may reflect methods, family roles that contain difficulties, and stigma.

## Problems with the categorical model
- Heavy overlap: most patients meet criteria for more than one disorder.
- Arbitrary thresholds (five of nine for borderline), so two people with the same diagnosis can share only one criterion.
- The most used diagnosis is "other specified".
- Poor stability over time: many patients no longer meet criteria years later, which contradicts "enduring".
- Weak links to treatment and limited research for most categories other than borderline and antisocial.

## DSM-5-TR alternative model (Section III)
- Criterion A: level of personality functioning, rated on a five point scale from little or no impairment to extreme impairment, in four areas:
- Self: identity and self direction.
- Interpersonal: empathy and intimacy.
- Criterion B: pathological traits in five domains with 25 facets: negative affectivity, detachment, antagonism, disinhibition and psychoticism.
- Six specific disorders are retained (antisocial, avoidant, borderline, narcissistic, obsessive compulsive, schizotypal), plus personality disorder trait specified for others.

## ICD-11
ICD-11 abolished the named types:
- First decide if there is personality disorder, based on problems in functioning of self (identity, self worth, self direction) and interpersonal functioning, lasting two years or more.
- Rate severity: mild, moderate or severe. A milder level, personality difficulty, is coded outside the disorders.
- Optionally add trait domain qualifiers: negative affectivity, detachment, dissociality, disinhibition and anankastia.
- An optional borderline pattern qualifier was kept to support clinical services and research on borderline treatments.
- Diagnosis can be made at any age, though caution is needed before adulthood.

## Comparison
| Feature | DSM-5-TR Section II | DSM-5-TR AMPD | ICD-11 |
| Model | Categorical | Hybrid | Dimensional |
| Core | Ten types | Functioning plus traits | Severity plus traits |
| Trait domains | None | Five, with 25 facets | Five |
| Unique domain | | Psychoticism | Anankastia |
| Borderline | Category | One of six types | Optional pattern qualifier |

The five factor model of normal personality maps onto these domains: negative affectivity on neuroticism, detachment on low extraversion, antagonism and dissociality on low agreeableness, disinhibition on low conscientiousness and anankastia on very high conscientiousness.

## Assessment
Structured interviews such as the SCID-5-PD and the International Personality Disorder Examination; trait measures such as the Personality Inventory for DSM-5 (PID-5) and the Standardised Assessment of Severity of Personality Disorder. History from informants is essential.

## Conclusion
Personality disorders are real, common and impairing, but the ten category model is poorly supported. The field is moving to a dimensional approach, already adopted in ICD-11, that rates severity of impairment and describes traits, which better reflects how personality varies and guides treatment.`,
    keyPoints: ["Definition with general criteria", "Ten categories in three clusters", "At least four problems with categories", "AMPD criterion A four areas and criterion B five domains", "ICD-11 severity levels and five domains with anankastia", "Borderline pattern qualifier", "Comparison table and FFM mapping"],
    pitfalls: ["Saying ICD-11 still has ten types", "Confusing antagonism with dissociality without explanation", "No critique of categories"],
    visuals: [
      layers("ICD-11 personality diagnosis in steps", "stack", [["Trait domains (optional)", "Negative affectivity, detachment, dissociality, disinhibition, anankastia; borderline pattern"], ["Severity", "Mild, moderate or severe"], ["Is there a personality disorder?", "Problems in self and interpersonal functioning for two years or more"]], "Start at the bottom and work up."),
    ],
    module: "personality",
    ref: "DSM-5-TR personality disorders and AMPD; ICD-11 6D10 and 6D11; Tyrer 2019; Skodol; SCID-5-PD",
  },
  {
    id: "psyp-l08-004",
    subject: "psychopathology",
    topic: "bpd",
    marks: 10,
    difficulty: 3,
    exams: ["md-psychiatry", "mcp-entrance", "ma-semester"],
    question: "Describe borderline personality disorder: clinical features, aetiology and treatment.",
    plan: ["Definition and DSM-5-TR criteria", "Epidemiology and course", "Aetiology: biosocial, mentalisation, attachment, trauma, biology", "Treatment: psychological therapies, medicines, crisis care", "Conclusion"],
    answer: `## Definition and criteria
Borderline personality disorder (BPD) is a pervasive pattern of instability in relationships, self image and emotions, with marked impulsivity, beginning by early adulthood. DSM-5-TR requires five or more of nine:
- Frantic efforts to avoid real or imagined abandonment.
- Unstable, intense relationships alternating between idealisation and devaluation.
- Identity disturbance: unstable self image or sense of self.
- Impulsivity in at least two self damaging areas (spending, sex, substances, reckless driving, binge eating).
- Recurrent suicidal behaviour, gestures, threats or self harm.
- Affective instability with marked reactivity of mood (episodes lasting hours to a few days).
- Chronic feelings of emptiness.
- Inappropriate, intense anger or difficulty controlling anger.
- Transient, stress related paranoid ideas or severe dissociative symptoms.

## Epidemiology and course
Community prevalence is about 1 to 2 percent, rising to about 10 percent of psychiatric outpatients and 20 percent of inpatients. It is diagnosed more in women in clinics but is about equal in the community. Suicide occurs in about 5 to 10 percent. Long term studies (the McLean Study of Adult Development) show that most patients remit from the diagnosis within ten years and relapses are less common than expected, though social functioning often lags.

## Aetiology
- Biosocial theory (Marsha Linehan): a biological vulnerability to emotional sensitivity, intensity and slow return to baseline, combined with an invalidating environment in which emotional expression is ignored, punished or trivialised. The child does not learn to name or regulate emotions.
- Mentalisation (Peter Fonagy and Anthony Bateman): insecure, often disorganised attachment impairs the capacity to understand one's own and others' mental states, especially under stress.
- Psychodynamic (Otto Kernberg): borderline personality organisation with identity diffusion and primitive defences such as splitting and projective identification.
- Trauma: childhood sexual and physical abuse and neglect are common, but not universal.
- Biological: heritability about 40 to 50 percent; amygdala hyper reactivity with reduced prefrontal regulation; serotonin related impulsivity.

## Treatment
Psychological therapy is the main treatment:
- Dialectical behaviour therapy (DBT): individual therapy, skills groups (mindfulness, distress tolerance, emotion regulation, interpersonal effectiveness), phone coaching and therapist consultation. Reduces self harm and admissions.
- Mentalisation based treatment (MBT), transference focused psychotherapy (TFP), schema therapy and structured clinical management (good psychiatric management) also have evidence.
Medicines:
- No medicine is approved for BPD. Guidelines advise against using them for core features; short term use may be considered in crises, and comorbid depression or psychosis should be treated. Avoid large supplies because of overdose risk.
Crisis care:
- Clear crisis plans, consistent team, brief admissions only when needed. In India, structured DBT and MBT programmes are growing in larger centres, and family psychoeducation is important.

## Conclusion
BPD is a serious but treatable disorder with a better long term course than once believed. Specialist psychotherapies built on biosocial and mentalisation theories are the treatments of choice.`,
    keyPoints: ["Five of nine criteria correctly listed", "Prevalence and suicide rate", "Good long term remission rates", "Linehan's biosocial theory", "Mentalisation and Kernberg", "DBT components", "Medicines not for core features"],
    visuals: [chain("Linehan's biosocial theory", [["Emotional vulnerability", "High sensitivity, intensity, slow return"], ["Invalidating environment", "Feelings dismissed or punished"], ["No regulation skills learned", "Cannot name or soothe emotions"], ["Emotion dysregulation", "Self harm and impulsive acts as escape"]])],
    module: "personality",
    ref: "DSM-5-TR BPD; Linehan 1993; Bateman and Fonagy; Zanarini 2010 McLean Study; NICE CG78",
  },
  {
    id: "psyp-l08-005",
    subject: "psychopathology",
    topic: "psychopathy",
    marks: 5,
    difficulty: 3,
    exams: ["md-psychiatry", "mcp-entrance", "ma-semester"],
    question: "Write short notes on psychopathy and how it differs from antisocial personality disorder.",
    plan: ["Cleckley and Hare", "PCL-R structure", "Difference from ASPD", "Biology and treatment"],
    answer: `## Concept
Hervey Cleckley, in "The Mask of Sanity", described psychopaths as superficially charming and intelligent but lacking remorse, empathy, shame and insight, with poor judgement and failure to learn from experience. Robert Hare developed the Psychopathy Checklist Revised (PCL-R) to measure it.

## PCL-R
- Twenty items scored 0, 1 or 2 from interview and file review, total 0 to 40.
- A cut off of 30 is used in North America and 25 in some European studies.
- Factor 1 (interpersonal and affective): glibness, grandiosity, lying, manipulation, lack of remorse, shallow affect, callousness, failure to accept responsibility.
- Factor 2 (lifestyle and antisocial): need for stimulation, parasitic lifestyle, poor behavioural control, early behaviour problems, impulsivity, irresponsibility, juvenile delinquency, criminal versatility.

## Difference from antisocial personality disorder
| Feature | Antisocial personality disorder | Psychopathy |
| Basis | Mainly behaviour (law breaking, deceit, aggression) | Personality traits plus behaviour |
| Requirement | Age 18 or over, conduct disorder before 15 | No formal age rule in PCL-R |
| Prevalence in prisons | About half or more | About 15 to 25 percent |
| Affective deficits | Not required | Core feature |
Most psychopaths meet criteria for ASPD, but most people with ASPD are not psychopaths.

## Biology and outcome
Studies show reduced fear conditioning, low skin conductance responses to threat, reduced amygdala responses to others' distress, and altered ventromedial prefrontal function. High PCL-R scores predict violent reoffending. Treatment is difficult; some studies suggested certain group programmes made psychopaths better at manipulation, though newer structured programmes for youth with callous unemotional traits show promise.

## Conclusion
Psychopathy is a narrower, trait based construct than ASPD, important in forensic risk assessment.`,
    keyPoints: ["Cleckley's description", "PCL-R 20 items and cut offs", "Two factors with examples", "Table of differences from ASPD", "Biological findings", "Risk prediction and treatment difficulty"],
    module: "personality",
    ref: "Cleckley 1941; Hare PCL-R 2003; Blair amygdala studies",
  },
  {
    id: "psyp-l08-006",
    subject: "psychopathology",
    topic: "delirium",
    marks: 10,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance", "ma-semester"],
    question: "Describe the clinical features, causes, assessment and management of delirium.",
    plan: ["Definition and criteria", "Subtypes and epidemiology", "Causes and risk factors", "Assessment tools and investigations", "Management and prevention", "Prognosis and conclusion"],
    answer: `## Definition
Delirium is an acute, fluctuating disturbance of attention and awareness with other cognitive changes, caused by a medical condition, substance, or withdrawal. DSM-5-TR criteria:
- Disturbance in attention (directing, focusing, sustaining, shifting) and awareness.
- Develops over a short period (hours to days), is a change from baseline, and fluctuates during the day.
- An additional cognitive disturbance: memory, orientation, language, visuospatial ability or perception.
- Not better explained by a pre existing neurocognitive disorder and not in severe reduction of arousal such as coma.
- Evidence of a physiological cause.

## Clinical features and subtypes
Inattention, disorientation, disorganised thinking, illusions and visual hallucinations, fear, disturbed sleep wake cycle (worse at night, "sundowning"), and labile mood.
- Hyperactive: agitation, restlessness, hallucinations (for example alcohol withdrawal).
- Hypoactive: quiet, drowsy, withdrawn; the most common in older people and the most often missed, often mistaken for depression.
- Mixed: alternating.

## Epidemiology
Delirium affects 10 to 30 percent of medical inpatients, up to half of older patients after hip surgery and up to 80 percent of ventilated ICU patients.

## Causes and risk factors
Predisposing factors: old age, dementia, sensory impairment, frailty, multiple illnesses, alcohol use.
Precipitating causes:
- Infections (urinary, chest), sepsis.
- Drugs: anticholinergics, opioids, benzodiazepines, steroids, polypharmacy.
- Withdrawal of alcohol or benzodiazepines.
- Metabolic: hyponatraemia, hypoglycaemia, hypoxia, uraemia, liver failure, dehydration.
- Neurological: stroke, seizures, head injury.
- Pain, urinary retention, constipation, surgery, sleep loss.

## Assessment
- Confusion Assessment Method (CAM): acute onset and fluctuating course plus inattention, plus either disorganised thinking or altered level of consciousness.
- The 4AT: alertness, abbreviated mental test, attention (months backwards) and acute change; quick and needs no training.
- Investigations: blood count, electrolytes, glucose, renal and liver function, calcium, thyroid, cultures, oxygen saturation, chest x ray, ECG; brain imaging, EEG (diffuse slowing) or lumbar puncture when indicated.
- Collateral history to establish baseline.

## Management
- Find and treat the cause; review and stop deliriogenic drugs.
- Non drug measures: orientation (clock, calendar, familiar faces), glasses and hearing aids, hydration, nutrition, mobility, sleep routine, a calm and well lit room, continuity of staff, involving family (very practical in Indian hospitals).
- Medicines only for severe distress or danger: low dose haloperidol (0.5 to 1 mg) or another antipsychotic, avoiding them in Parkinson disease and Lewy body dementia. Benzodiazepines only for alcohol or benzodiazepine withdrawal.
- Prevention: multicomponent programmes such as the Hospital Elder Life Program reduce incidence by about a third.

## Prognosis
Delirium increases mortality, length of stay, institutional care and later dementia. It should be treated as a medical emergency.

## Conclusion
Delirium is common, serious and preventable. Screening with CAM or 4AT, treating the cause, and non drug measures are the core of care.`,
    keyPoints: ["DSM-5-TR criteria with attention and fluctuation", "Three subtypes; hypoactive missed", "Prevalence in medical, surgical and ICU settings", "Predisposing and precipitating causes", "CAM algorithm and 4AT", "Non drug management and cautious antipsychotic use", "Benzodiazepines only for withdrawal", "Prognosis and prevention"],
    visuals: [chain("CAM: deciding if it is delirium", [["1. Acute onset and fluctuating course", "Required"], ["2. Inattention", "Required"], ["3. Disorganised thinking", "Either 3 or 4"], ["4. Altered level of consciousness", "Either 3 or 4"]], "Features 1 and 2 plus 3 or 4 make CAM positive.")],
    module: "neurocognitive",
    ref: "DSM-5-TR delirium; Inouye 1990 CAM; 4AT Bellelli 2014; Inouye HELP 1999; NICE CG103",
  },
  {
    id: "psyp-l08-007",
    subject: "psychopathology",
    topic: "major-mild-ncd",
    marks: 15,
    difficulty: 3,
    exams: ["md-psychiatry", "mcp-entrance", "ma-semester"],
    question: "Compare and contrast Alzheimer disease, vascular dementia, dementia with Lewy bodies and frontotemporal dementia.",
    plan: ["Define major and mild neurocognitive disorder", "Epidemiology including India", "Describe each type: pathology, onset, features, investigations", "Comparison table", "Management principles", "Conclusion"],
    answer: `## Definitions
DSM-5-TR uses the term major neurocognitive disorder for dementia: significant decline from a previous level in one or more cognitive domains (complex attention, executive function, learning and memory, language, perceptual motor, social cognition), interfering with independence in everyday activities. Mild neurocognitive disorder is modest decline that does not interfere with independence. The cause is specified as a subtype.

## Epidemiology
Dementia affects about 55 million people worldwide. In India, a recent national study of older adults found dementia in about 7 to 8 percent of people aged 60 and over, more in women, rural areas and those with little schooling, which suggests about 9 million people affected. Alzheimer disease accounts for about 60 to 70 percent of cases worldwide.

## Alzheimer disease
- Pathology: extracellular amyloid beta plaques and intracellular tau neurofibrillary tangles, starting in the entorhinal cortex and hippocampus, with loss of cholinergic neurons in the nucleus basalis of Meynert.
- Genetics: early onset familial forms with APP, PSEN1 and PSEN2 mutations; APOE e4 raises risk in late onset disease; Down syndrome carries high risk.
- Clinical: insidious onset and gradual progression; early loss of recent episodic memory, then word finding difficulty, disorientation, apraxia and agnosia; behaviour and personality preserved early.
- Investigations: hippocampal and medial temporal atrophy on MRI, temporoparietal hypometabolism on PET, amyloid and tau biomarkers in CSF or blood.

## Vascular dementia
- Pathology: multiple infarcts, strategic infarcts (thalamus) or small vessel disease with white matter changes.
- Risk factors: hypertension, diabetes, smoking, atrial fibrillation.
- Clinical: onset may be abrupt after a stroke with stepwise deterioration, or gradual with small vessel disease; early executive dysfunction, slowing, gait problems, emotional lability and focal neurological signs; memory less affected early.
- Investigations: infarcts and white matter hyperintensities on MRI. Mixed Alzheimer and vascular disease is very common.

## Dementia with Lewy bodies
- Pathology: alpha synuclein Lewy bodies in the cortex and brainstem.
- Core clinical features: fluctuating cognition with variations in attention and alertness; recurrent, well formed visual hallucinations; REM sleep behaviour disorder; and parkinsonism.
- Supportive features: severe sensitivity to antipsychotics, falls, autonomic dysfunction.
- Dementia occurs before or within a year of parkinsonism; if parkinsonism precedes dementia by more than a year, the term Parkinson disease dementia is used.
- Investigations: reduced dopamine transporter uptake in the basal ganglia on DaT scan; reduced uptake on cardiac MIBG scintigraphy.

## Frontotemporal dementia
- Pathology: degeneration of frontal and temporal lobes with tau or TDP 43 inclusions; often familial (C9orf72, MAPT, GRN).
- Onset usually between 45 and 65 years.
- Behavioural variant: early disinhibition, apathy, loss of empathy, compulsive or ritualistic behaviour, hyperorality and dietary changes, and executive dysfunction, with relatively spared memory.
- Language variants: semantic variant (loss of word meaning) and non fluent agrammatic variant.
- Often misdiagnosed as mania, depression or a midlife crisis.
- Investigations: frontal and anterior temporal atrophy on MRI.

## Comparison
| Feature | Alzheimer | Vascular | Lewy body | Frontotemporal |
| Onset | Insidious | Abrupt or gradual | Insidious | Insidious, younger |
| Course | Steady decline | Stepwise or gradual | Fluctuating | Steady |
| Early sign | Recent memory loss | Executive slowing, focal signs | Fluctuations, visual hallucinations | Behaviour or language change |
| Motor | Late | Gait, focal deficits | Parkinsonism | Late, sometimes motor neurone disease |
| Imaging | Hippocampal atrophy | Infarcts, white matter disease | DaT scan reduced | Frontal and temporal atrophy |
| Antipsychotic risk | Moderate | Moderate, stroke risk | Severe sensitivity | Moderate |
| Cholinesterase inhibitors | Helpful | Limited | Very helpful | Not helpful |

## Management principles
- Diagnosis and disclosure, with assessment of capacity and planning while the person can decide (advance directives under the MHCA 2017).
- Cholinesterase inhibitors (donepezil, rivastigmine, galantamine) for mild to moderate Alzheimer disease and for Lewy body and Parkinson dementia; memantine for moderate to severe Alzheimer disease.
- Anti amyloid antibodies (lecanemab, donanemab) are approved in some countries for early Alzheimer disease with confirmed amyloid, with risks of brain swelling and bleeding; they are not in routine use in India.
- Vascular risk factor control.
- Behavioural and psychological symptoms: non drug approaches first; antipsychotics cautiously because of stroke and death risk, and avoided in Lewy body dementia.
- Carer support, which is central in India where families provide most care; support from organisations such as the Alzheimer's and Related Disorders Society of India.

## Conclusion
The four main dementias differ in pathology, onset, early features and drug response. Recognising the type matters: Lewy body dementia can be fatally worsened by antipsychotics, frontotemporal dementia is often mistaken for psychiatric illness, and vascular dementia is partly preventable.`,
    keyPoints: ["Major and mild NCD definitions", "Global and Indian prevalence", "Alzheimer pathology, genetics and early memory loss", "Vascular dementia stepwise course and risk factors", "Lewy body core features and antipsychotic sensitivity", "Frontotemporal behavioural variant and younger onset", "Comparison table with imaging", "Management including cholinesterase inhibitors and carers"],
    pitfalls: ["Using antipsychotics freely in Lewy body dementia", "Missing frontotemporal dementia as a psychiatric illness", "No comparison table"],
    visuals: [
      brain("Where each dementia begins", { hippocampus: "Alzheimer disease: memory loss first", temporal: "Alzheimer and semantic frontotemporal dementia", frontal: "Behavioural variant frontotemporal dementia: disinhibition, apathy", "basal-ganglia": "Lewy body dementia: parkinsonism, low dopamine uptake", occipital: "Lewy body dementia: visual hallucinations, reduced occipital activity" }),
    ],
    module: "neurocognitive",
    ref: "DSM-5-TR NCD; McKeith 2017 DLB criteria; Rascovsky 2011 bvFTD; Lee 2023 LASI-DAD India dementia prevalence; Lancet Commission 2024",
  },
  {
    id: "psyp-l08-008",
    subject: "psychopathology",
    topic: "adhd",
    marks: 10,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance", "ma-semester"],
    question: "Describe the clinical features, aetiology and management of attention deficit hyperactivity disorder.",
    plan: ["Definition and DSM-5-TR criteria", "Epidemiology and course into adulthood", "Aetiology: genetic, environmental, neuropsychological models", "Assessment", "Management by age with evidence", "Conclusion"],
    answer: `## Definition and criteria
ADHD is a neurodevelopmental disorder of persistent inattention and or hyperactivity and impulsivity that interferes with functioning. DSM-5-TR requires:
- Six or more of nine inattention symptoms and or six or more of nine hyperactivity impulsivity symptoms (five for people aged 17 and over), for at least six months, inconsistent with developmental level.
- Inattention examples: careless mistakes, difficulty sustaining attention, not seeming to listen, not following through, poor organisation, avoiding mental effort, losing things, distractibility and forgetfulness.
- Hyperactivity and impulsivity examples: fidgeting, leaving the seat, running about, inability to play quietly, being "on the go", talking excessively, blurting out answers, difficulty waiting a turn, interrupting.
- Several symptoms present before age 12.
- Present in two or more settings (home, school, work).
- Clear impairment, not better explained by another disorder.
Presentations: combined, predominantly inattentive, predominantly hyperactive impulsive.

## Epidemiology and course
About 5 percent of children and 2.5 percent of adults worldwide; Indian school studies report similar or higher figures. Boys are diagnosed more often, while girls more often have the inattentive presentation and are missed. Symptoms of hyperactivity reduce with age, but inattention and impairment often persist into adulthood. Comorbidity includes oppositional defiant and conduct disorders, learning disorders, anxiety, tics, autism and later substance use.

## Aetiology
- Genetic: heritability about 70 to 80 percent, with many genes of small effect, including dopamine related genes.
- Environmental: prematurity and low birth weight, prenatal tobacco and alcohol exposure, lead, severe early deprivation (as in the Romanian orphan studies).
- Brain: delayed cortical maturation (by about three years in prefrontal regions), smaller basal ganglia, and altered fronto striatal and default mode networks; dopamine and noradrenaline dysregulation, which stimulants correct.
- Neuropsychological models: Russell Barkley's model sees deficient behavioural inhibition as primary, disrupting working memory, self regulation of emotion and internalised speech. Sonuga-Barke's dual pathway model adds delay aversion: a preference for small immediate rewards.
- Parenting does not cause ADHD, but harsh, inconsistent parenting can worsen it.

## Assessment
History from parents and teachers, rating scales (Conners, Vanderbilt, ADHD Rating Scale; ASRS for adults), observation, and checks for hearing, vision, sleep problems, learning disorder, thyroid disease, epilepsy and adversity. In India, intelligence and learning disorder assessment are often needed for school accommodations.

## Management
- Preschool children: parent training in behaviour management is first line.
- School age children and adolescents: medication plus behavioural and school interventions. The large MTA study found carefully managed medication more effective than behavioural treatment alone for core symptoms, with combined treatment giving extra benefit for some outcomes.
- Medicines: methylphenidate (stimulant, first line in many guidelines), atomoxetine (non stimulant, noradrenaline reuptake inhibitor, useful with tics or substance risk), and in some countries lisdexamfetamine, guanfacine and clonidine. Monitor height, weight, pulse, blood pressure, sleep and appetite.
- School: seating near the teacher, short tasks, extra time in examinations (allowed by Indian boards for certified students).
- Adults: medication, CBT for organisation skills, and coaching.

## Conclusion
ADHD is a common, highly heritable neurodevelopmental disorder that often continues into adulthood. Combined medical, behavioural and educational management improves outcomes.`,
    keyPoints: ["Six of nine symptoms with five for 17 and over", "Before age 12, two settings, six months", "Three presentations", "Prevalence and persistence into adulthood", "Heritability and environmental risks", "Barkley inhibition model and delay aversion", "Parent training first in preschool; MTA study", "Methylphenidate, atomoxetine and monitoring"],
    visuals: [brain("ADHD: circuits involved", { prefrontal: "Matures later; weak inhibition and planning", "basal-ganglia": "Fronto striatal reward and timing loop", cerebellum: "Timing of actions" }, "Stimulants raise dopamine and noradrenaline in these loops.")],
    module: "child",
    ref: "DSM-5-TR ADHD; MTA Cooperative Group 1999; Barkley 1997; Sonuga-Barke 2002; Shaw 2007 cortical maturation",
  },
  {
    id: "psyp-l08-009",
    subject: "psychopathology",
    topic: "asd",
    marks: 10,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance", "ma-semester"],
    question: "Describe autism spectrum disorder: diagnostic criteria, psychological theories and management, with reference to India.",
    plan: ["DSM-5-TR criteria and changes from DSM-IV", "Epidemiology and associated conditions", "Psychological theories: theory of mind, central coherence, executive function, others", "Assessment including Indian tools", "Management and conclusion"],
    answer: `## Criteria
Autism spectrum disorder (ASD) is a neurodevelopmental disorder of social communication with restricted, repetitive patterns. DSM-5-TR requires:
- A: persistent deficits in social communication and interaction across contexts, in all three of: social emotional reciprocity, non verbal communication (eye contact, gestures, facial expression), and developing, maintaining and understanding relationships.
- B: restricted, repetitive patterns of behaviour, interests or activities, in at least two of four: stereotyped or repetitive movements, use of objects or speech (echolalia, lining up toys); insistence on sameness and rigid routines; highly restricted, fixated interests; and hyper or hypo reactivity to sensory input.
- C: present in early development (may become fully clear later).
- D: clinically significant impairment.
- E: not better explained by intellectual disability alone.
Severity is rated for each domain (level 1, requiring support; level 2, substantial support; level 3, very substantial support). Specifiers: with or without intellectual impairment, with or without language impairment, and association with known genetic or medical conditions. DSM-5 merged autistic disorder, Asperger disorder and pervasive developmental disorder not otherwise specified into one spectrum.

## Epidemiology and associations
About 1 to 3 percent of children in recent studies (in the USA about 1 in 36 or more); Indian studies estimate around 1 percent, with many undiagnosed. Boys are diagnosed about four times more often. Associated conditions: intellectual disability (about a third), epilepsy, ADHD, anxiety, sleep and feeding problems, and genetic syndromes (fragile X, tuberous sclerosis). Heritability is about 80 percent. Vaccines do not cause autism.

## Psychological theories
- Theory of mind (Simon Baron-Cohen, Alan Leslie, Uta Frith): difficulty attributing beliefs and intentions to others, shown by failure on the Sally Anne false belief task. Explains social and communication problems, but not repetitive behaviour or sensory issues, and some autistic people pass the tasks.
- Weak central coherence (Uta Frith): a processing style focused on detail rather than global meaning, explaining strengths on the embedded figures and block design tasks.
- Executive dysfunction: difficulty with planning, flexibility and inhibition, explaining rigidity and repetitive behaviour; not specific to autism.
- Empathising systemising theory (Baron-Cohen): lower empathising with intact or high systemising.
- Enhanced perceptual functioning and predictive coding accounts explain sensory sensitivities.
- The neurodiversity view sees autism as a different way of being, which shapes support and language.

## Assessment
Early signs include no response to name, limited eye contact, no pointing to share interest, and loss of words. Tools: M-CHAT for screening, ADOS-2 and ADI-R for diagnosis. In India, the Indian Scale for Assessment of Autism (ISAA) is used for disability certification under the RPwD Act 2016, and the INCLEN diagnostic tool (INDT-ASD) was developed for Indian settings. Hearing tests, developmental assessment and genetic testing complete the evaluation.

## Management
- Early, intensive developmental and behavioural interventions: applied behaviour analysis, the Early Start Denver Model, and parent mediated programmes such as PASS (adapted in India), improve communication and adaptive skills.
- Speech and language therapy, occupational therapy for sensory and motor issues, social skills training, and inclusive education with support.
- Medicines do not treat core features; risperidone and aripiprazole are approved for irritability and aggression; melatonin for sleep; treat ADHD and anxiety.
- Family support, respite, and access to disability benefits under the RPwD Act.

## Conclusion
ASD is a lifelong neurodevelopmental spectrum defined by social communication differences and restricted, repetitive patterns. Early diagnosis, family centred intervention and inclusion give the best outcomes.`,
    keyPoints: ["Criterion A all three and B two of four", "Severity levels and specifiers", "Merger of earlier categories", "Prevalence, sex ratio and heritability", "Theory of mind with Sally Anne and its limits", "Weak central coherence and executive dysfunction", "ISAA and INDT-ASD in India", "Early intervention and medicines for irritability only"],
    visuals: [tree("DSM-5-TR autism criteria", [["Autism spectrum disorder", "", -1], ["A: Social communication", "All three needed", 0], ["Reciprocity", "", 1], ["Non verbal communication", "", 1], ["Relationships", "", 1], ["B: Restricted, repetitive", "Two of four", 0], ["Stereotyped behaviour", "", 5], ["Sameness and routines", "", 5], ["Fixated interests", "", 5], ["Sensory reactivity", "", 5]])],
    module: "child",
    ref: "DSM-5-TR ASD; Baron-Cohen Leslie Frith 1985 Sally Anne; Frith central coherence; CDC ADDM 2023; ISAA; INCLEN INDT-ASD; Divan PASS Plus 2019",
  },
  {
    id: "psyp-l08-010",
    subject: "psychopathology",
    topic: "epidemiology-suicide",
    marks: 10,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance", "ma-semester", "ugc-net"],
    question: "Discuss the epidemiology of suicide in India and the risk and protective factors for suicide. Add a note on prevention.",
    plan: ["Definitions", "Indian epidemiology with NCRB data and its limits", "Risk factors by level", "Protective factors and theories", "Prevention including national strategy and MHCA section 115", "Conclusion"],
    answer: `## Definitions
Suicide is death caused by self directed injurious behaviour with intent to die. A suicide attempt is a non fatal self directed act with intent to die. Suicidal ideation ranges from passive wishes to be dead to active plans. Self harm is a broader term that includes acts without clear intent.

## Epidemiology in India
- The National Crime Records Bureau reported about 1.7 lakh suicides in 2022, a rate of about 12.4 per lakh population, the highest recorded.
- Common reasons recorded are family problems and illness, followed by marriage related issues, drug and alcohol use, debt, unemployment and examination failure.
- The most common methods are hanging, followed by poisoning (including pesticides) and other means.
- Young adults (18 to 30) and middle aged adults (30 to 45) account for most deaths. Men die by suicide more often, but the female rate in India is high by world standards, especially among young married women.
- Groups of concern include daily wage earners, farmers and agricultural workers, homemakers and students.
- Limits: police records underreport suicide because of stigma, legal fears and misclassification; studies such as the Million Death Study suggest the true number is higher.
Globally, about 7 lakh people die by suicide each year, and suicide is a leading cause of death in people aged 15 to 29.

## Risk factors
| Level | Risk factors |
| Individual | Previous attempt (the strongest predictor), mental disorders (depression, bipolar, schizophrenia, alcohol use disorder, borderline personality), hopelessness, impulsivity, chronic pain and illness, family history of suicide |
| Relationship | Family conflict, domestic violence, dowry harassment, bereavement, isolation, relationship breakup |
| Community | Debt and farm distress, unemployment, academic pressure, discrimination, stigma about help seeking |
| Society | Easy access to means (pesticides, medicines), irresponsible media reporting, alcohol availability |
Warning signs include talking about death, giving away possessions, saying goodbye, sudden calm after depression, and searching for means.

## Protective factors
Strong family and social bonds, responsibility for children, religious and cultural beliefs that discourage suicide, problem solving skills, access to care, and restricted access to means.

## Theories in brief
Durkheim described egoistic, altruistic, anomic and fatalistic suicide in relation to social integration and regulation. Joiner's interpersonal theory proposes that desire for suicide arises from thwarted belongingness and perceived burdensomeness, while the capability for suicide is acquired through repeated pain and fear exposure. The stress diathesis model links vulnerability (genetic, serotonergic, cognitive) with crises.

## Prevention
- Means restriction: banning highly hazardous pesticides is one of the most effective measures; Sri Lanka's bans sharply reduced suicides. India has banned several hazardous pesticides.
- The National Suicide Prevention Strategy, launched in 2022, aims to reduce suicide mortality by 10 percent by 2030 through mental health services in all districts, school based wellbeing programmes, and responsible media reporting.
- Section 115 of the MHCA 2017 presumes severe stress in a person who attempts suicide, who shall not be tried or punished; the government must provide care and rehabilitation. The Bharatiya Nyaya Sanhita 2023 dropped the general offence of attempted suicide.
- Gatekeeper training (teachers, police, health workers), helplines such as Tele MANAS (14416), follow up contact after an attempt, safety planning, and treatment of depression and alcohol use.
- Media guidelines from the Press Council of India discourage detailed reporting of methods.

## Conclusion
India carries a large share of the world's suicides, driven by both mental illness and social distress. Prevention needs a public health approach combining means restriction, service access, social support and legal reform.`,
    keyPoints: ["Definitions", "NCRB 2022 figures and rate", "Common reasons and methods", "Underreporting", "Risk factors at several levels with previous attempt as strongest", "Protective factors and Joiner's theory", "Pesticide restriction and National Suicide Prevention Strategy 2022", "MHCA section 115 and Tele MANAS"],
    visuals: [layers("Suicide risk across levels", "rings", [["Individual", "Previous attempt, depression, alcohol, hopelessness"], ["Relationships", "Conflict, violence, loss"], ["Community", "Debt, exam pressure, stigma"], ["Society", "Access to pesticides, media, alcohol"]], "Prevention works at every ring.")],
    module: "suicide",
    ref: "NCRB ADSI 2022; Patel 2012 Million Death Study; National Suicide Prevention Strategy 2022; MHCA 2017 s115; WHO suicide fact sheet 2024; Joiner 2005; Gunnell Sri Lanka pesticides",
  },
]);
