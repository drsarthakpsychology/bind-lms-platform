import type { LongQA } from "@/lib/prep/long-types";
import { anchored, chain, compare, timeline, vis } from "./visual";

export const PSYCHOPATHOLOGY_L03: LongQA[] = anchored([
  {
    id: "psyp-l03-001",
    subject: "psychopathology",
    topic: "aetiology-schizophrenia",
    marks: 20,
    difficulty: 3,
    exams: ["md-psychiatry", "mcp-entrance", "ma-semester"],
    question: "Discuss the aetiology of schizophrenia. How do genetic, neurodevelopmental, neurochemical and psychosocial factors interact?",
    plan: ["Open with prevalence and the multifactorial model", "Genetics: family, twin, adoption, molecular", "Neurodevelopmental and environmental risks", "Neurochemistry: dopamine, glutamate, others; immune factors", "Psychosocial: stress, expressed emotion, social defeat", "Integrate with stress vulnerability and conclude"],
    answer: `## Introduction
Schizophrenia is a severe psychotic disorder with a lifetime prevalence of about 0.3 to 0.7 percent; in India the National Mental Health Survey 2015 to 16 found a lifetime prevalence of about 1.4 percent for schizophrenia and other psychoses. No single cause has been found. The best supported view is that many small genetic and early environmental risks produce a vulnerable developing brain, and later stressors and drugs push the system into psychosis.

## Genetic factors
- Family studies: risk rises with genetic closeness. Lifetime risk is about 1 percent in the general population, about 10 percent in a first degree relative, about 13 percent in the child of one affected parent and about 45 percent if both parents are affected.
- Twin studies: concordance is about 40 to 50 percent in identical twins and 10 to 15 percent in non identical twins; heritability is estimated at about 80 percent. The fact that identical twin concordance is not 100 percent proves an environmental role.
- Adoption studies (Heston; the Danish studies of Kety) showed raised risk in adopted children of affected biological mothers, separating genes from rearing.
- Molecular genetics: genome wide studies have found nearly 300 common risk loci, each of small effect, including the major histocompatibility region (the complement C4 gene, linked to excessive synaptic pruning) and genes for dopamine D2 receptors and glutamate signalling. Rare copy number variants have larger effects: the 22q11.2 deletion carries a risk of about 25 percent. Polygenic risk scores explain only a modest part of the variance.

## Neurodevelopmental factors
The neurodevelopmental hypothesis (Weinberger; Murray and Lewis) holds that the illness starts with abnormal brain development long before symptoms. Evidence:
- Obstetric complications (hypoxia, low birth weight, pre eclampsia) roughly double the risk.
- Maternal infection or famine in pregnancy (the Dutch hunger winter) and winter or spring birth.
- Advanced paternal age.
- Childhood motor delays, lower IQ and social oddness before onset.
- Structural findings present at first episode: enlarged ventricles, reduced grey matter in the temporal and frontal lobes and hippocampus, without gliosis, which points to an early developmental process rather than later degeneration.
- Adolescent synaptic pruning may unmask the earlier lesion, explaining onset in late teens and twenties.

## Environmental risks later in life
- Cannabis: heavy and high potency use raises risk in a dose related way, shown in the Swedish conscript and Dunedin cohort studies.
- Urban upbringing and migration, both about doubling risk, perhaps through social adversity and discrimination.
- Childhood trauma and bullying.

## Neurochemical factors
- Dopamine: the original hypothesis came from two facts: antipsychotic potency correlates with D2 blockade, and amphetamines cause psychosis. The current version, linked to Howes and Kapur, says the final common pathway is increased presynaptic dopamine synthesis and release in the associative striatum. Excess dopamine assigns "aberrant salience" to ordinary events, so the person searches for meaning and forms delusions. Low dopamine in prefrontal pathways may explain negative and cognitive symptoms.
- Glutamate: NMDA receptor antagonists such as ketamine and phencyclidine produce positive, negative and cognitive symptoms in healthy people. Hypofunction of NMDA receptors on GABA interneurons disinhibits glutamate output, which drives the dopamine excess.
- Serotonin: hallucinogens act at 5 HT2A receptors, and many second generation antipsychotics block them.
- GABA interneuron changes and acetylcholine (muscarinic) systems are also involved; the muscarinic agonist xanomeline with trospium was approved in the USA in 2024 as the first antipsychotic without direct D2 blockade.

## Immune and inflammatory factors
Raised inflammatory markers, prenatal infection, autoimmune disease and the C4 finding suggest an immune contribution.

## Psychosocial factors
- Stressful life events often precede onset and relapse.
- Expressed emotion: critical, hostile or over involved family attitudes predict relapse, though they are a response to illness as well as a cause.
- Social defeat: chronic experiences of exclusion (migration, discrimination) may sensitise the dopamine system.
- Cognitive factors: jumping to conclusions, attributional biases and reduced theory of mind maintain delusions.
- Older family theories such as the "schizophrenogenic mother" and the double bind have no support and blamed families wrongly.

## Integration
The stress vulnerability model of Zubin and Spring links these levels: genes and early insults create vulnerability; adolescent brain changes, cannabis, trauma and social stress add load; when the threshold is crossed, dopamine dysregulation produces psychosis; and expressed emotion, drug use and non adherence affect relapse.

| Level | Key evidence |
| Genes | Heritability about 80 percent; about 300 loci; 22q11.2 deletion |
| Early development | Obstetric complications, prenatal infection, premorbid deficits |
| Adolescence | Pruning, cannabis, trauma |
| Brain chemistry | Striatal dopamine excess, NMDA hypofunction |
| Social | Urbanicity, migration, expressed emotion |

## Conclusion
Schizophrenia arises from an interaction of many genes of small effect with early neurodevelopmental and later environmental risks, expressed through dopamine and glutamate dysfunction. This multifactorial view supports early intervention, cannabis prevention, family work and better prenatal care.`,
    keyPoints: ["Prevalence including Indian NMHS figure", "Family, twin and adoption figures", "Molecular findings: polygenic loci, C4, 22q11.2", "Neurodevelopmental evidence including absence of gliosis", "Cannabis, urbanicity and migration", "Dopamine hypothesis with aberrant salience", "Glutamate NMDA hypofunction", "Integration with stress vulnerability"],
    pitfalls: ["Saying a single gene causes schizophrenia", "Presenting the schizophrenogenic mother as current theory", "No integration at the end"],
    visuals: [
      chain("From risk to psychosis", [["Genes", "Many loci of small effect"], ["Early brain development", "Obstetric and prenatal insults"], ["Adolescence", "Pruning, cannabis, trauma, social stress"], ["Dopamine dysregulation", "Excess striatal release"], ["Aberrant salience", "Ordinary events feel meaningful"], ["Psychosis", "Delusions and hallucinations"]]),
      vis("pathways", { system: "dopamine" }, "The four dopamine pathways: mesolimbic excess, mesocortical deficit, and what D2 blockade does to each."),
    ],
    module: "psychosis",
    ref: "Kaplan schizophrenia chapter; Maudsley; Trubetskoy 2022 PGC3; Howes and Kapur 2009; NMHS 2016 report; Murray and Lewis 1987",
  },
  {
    id: "psyp-l03-002",
    subject: "psychopathology",
    topic: "neurodevelopmental-hypothesis",
    marks: 10,
    difficulty: 3,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "Critically evaluate the neurodevelopmental hypothesis of schizophrenia.",
    plan: ["State the hypothesis and its originators", "Evidence for", "Evidence against or complicating", "Modern synthesis with neuroprogression", "Implications"],
    answer: `## The hypothesis
In 1987, Daniel Weinberger and, separately, Robin Murray and Shon Lewis proposed that schizophrenia results from a disturbance of brain development that begins in foetal or early life, remains largely silent through childhood, and shows itself as psychosis when the brain matures in late adolescence.

## Evidence for
- Early risk factors: obstetric complications, maternal infection and malnutrition in pregnancy, winter and spring birth, and older paternal age.
- Premorbid signs: birth cohort studies (the British 1946 cohort, Dunedin) found delayed motor milestones, speech problems, lower IQ and social withdrawal in children who later developed schizophrenia.
- Minor physical anomalies (high arched palate, low set ears) and neurological soft signs, which reflect early development.
- Brain changes at first episode: ventricular enlargement and reduced volume without gliosis, suggesting an early lesion rather than degeneration; abnormal neuronal migration in some post mortem studies.
- Genetic overlap with autism and intellectual disability, and high risk with copy number variants such as the 22q11.2 deletion.
- Timing explained by adolescent synaptic pruning: excessive pruning, perhaps linked to the complement C4 gene, unmasks an earlier vulnerability.

## Evidence against or complicating
- Most people with obstetric complications or premorbid deficits never develop schizophrenia; effect sizes are small.
- Some brain volume loss continues after onset, at least in some patients, which suggests a progressive element. Part of this may be due to antipsychotics, alcohol, smoking and illness factors.
- The hypothesis explains vulnerability, but not the timing of relapses or the role of stress and drugs.
- Good outcomes in many patients (including the better outcomes in some Indian cohorts) fit poorly with a fixed lesion.

## Modern synthesis
Most researchers now accept a "two hit" or developmental risk factor model: an early hit sets up vulnerability, a second set of hits in adolescence (cannabis, trauma, stress, abnormal pruning) triggers dopamine dysregulation, and some patients show later neuroprogression. Murray himself later argued that the dopamine dysregulation is the final step and that social adversity matters more than once thought.

## Implications
- Prevention through better antenatal and obstetric care.
- Identification of high risk young people.
- Reducing adolescent cannabis use.

## Conclusion
The neurodevelopmental hypothesis is well supported as an account of vulnerability. It is incomplete on its own and is best combined with later environmental and dopaminergic factors and with evidence of progression in a subgroup.`,
    keyPoints: ["Originators and year", "Obstetric and prenatal evidence", "Premorbid deficits from cohort studies", "No gliosis at first episode", "Synaptic pruning and timing", "Criticisms including progression", "Two hit model"],
    visuals: [timeline("Put the neurodevelopmental story in order", [["Genetic risk", "Conception"], ["Prenatal and birth insults", "Pregnancy and delivery"], ["Subtle motor and social delays", "Childhood"], ["Excess synaptic pruning", "Adolescence"], ["First psychotic episode", "Late teens to twenties"]])],
    module: "psychosis",
    ref: "Weinberger 1987; Murray and Lewis 1987; Jones et al 1994 British 1946 cohort; Sekar 2016 C4",
  },
  {
    id: "psyp-l03-003",
    subject: "psychopathology",
    topic: "expressed-emotion",
    marks: 5,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance", "ma-semester"],
    question: "Write short notes on expressed emotion.",
    plan: ["Origin of the concept", "Components and measurement", "Evidence on relapse including India", "Clinical use"],
    answer: `## Origin
George Brown and colleagues in London noticed that men with schizophrenia discharged to parents or wives relapsed more than those discharged to lodgings. Expressed emotion (EE) was developed to measure the emotional climate of the family.

## Components and measurement
EE is rated from an audio recorded semi structured interview with a relative, the Camberwell Family Interview. Components:
- Critical comments.
- Hostility.
- Emotional over involvement (over protection, self sacrifice, dramatic distress).
- Warmth and positive remarks (protective).
A family is rated "high EE" mainly on critical comments, hostility or over involvement above set cut offs. A shorter method is the Five Minute Speech Sample.

## Evidence
- Vaughn and Leff found that about half of patients in high EE homes relapsed within nine months, compared with about one in eight in low EE homes; the risk was highest with long face to face contact and no medication.
- The link has been replicated across cultures and in depression, bipolar disorder and eating disorders.
- In the WHO study in Chandigarh, fewer Indian families were high EE, which may partly explain better outcomes in India; where EE was high, hostility still predicted relapse.
- EE is bidirectional: difficult symptoms provoke criticism, and criticism raises stress.

## Clinical use
Family psychoeducation and behavioural family therapy lower EE and reduce relapse rates by about half. In India, family involvement in care is the norm, so family interventions are practical and valuable.

## Conclusion
EE is a robust predictor of relapse and a modifiable target. It should be explained to families without blame.`,
    keyPoints: ["Brown and the origin", "Five components", "Camberwell Family Interview", "Vaughn and Leff relapse figures", "Indian findings", "Bidirectional nature", "Family intervention reduces relapse"],
    module: "psychosis",
    ref: "Brown, Birley and Wing 1972; Vaughn and Leff 1976; Wig et al 1987 Chandigarh EE; Butzlaff and Hooley 1998",
  },
  {
    id: "psyp-l03-004",
    subject: "psychopathology",
    topic: "outcome-india",
    marks: 10,
    difficulty: 3,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "Discuss the course and outcome of schizophrenia, with special reference to the WHO cross-cultural studies and Indian research.",
    plan: ["Course patterns", "Outcome figures and predictors", "WHO IPSS and DOSMeD findings", "Indian long term studies", "Critiques of the better outcome view", "Conclusion"],
    answer: `## Course
Schizophrenia usually has a prodrome of months to years (withdrawal, decline in functioning, odd ideas), followed by an acute episode. Later course varies:
- A single episode with full recovery.
- Several episodes with full or partial recovery between them.
- A continuous course with persistent symptoms and disability.
Manfred Bleuler's and Ciompi's long follow ups showed that about a quarter to a third recover well, and that late improvement is common.

## Outcome and predictors
Recent meta analyses find that only about one in seven meet strict criteria for recovery, but many more have good periods. Life expectancy is shortened by 10 to 20 years, mainly due to cardiovascular disease, smoking, metabolic effects and suicide (about 5 percent).

| Good prognosis | Poor prognosis |
| Acute onset with clear precipitant | Insidious onset |
| Later onset, female sex, married | Early onset, male, single |
| Good premorbid adjustment | Poor premorbid functioning |
| Mood symptoms, confusion | Negative symptoms, cognitive deficits |
| Short duration of untreated psychosis | Long untreated psychosis |
| Supportive family, low expressed emotion | High expressed emotion, substance use |

## WHO cross-cultural studies
- The International Pilot Study of Schizophrenia (IPSS), started in 1967 in nine countries including India (Agra), showed that schizophrenia could be diagnosed reliably across cultures and that patients in developing countries had better two and five year outcomes.
- The Determinants of Outcome of Severe Mental Disorders study (DOSMeD) used first contact cases in ten countries (Indian centres at Chandigarh and Agra). It confirmed better outcomes in developing countries, with more acute onset and more complete remissions.
- The International Study of Schizophrenia followed these cohorts for 15 to 25 years and found the difference persisted, although it narrowed.

## Indian research
- The Madras Longitudinal Study by the Schizophrenia Research Foundation (Chennai) followed first episode patients for over 20 years: most showed improvement, many were working and married, but mortality and some homelessness were also seen.
- Rural studies (such as in Tamil Nadu) found that many untreated patients still lived with families and had some work.
- Chandigarh studies of acute psychoses and expressed emotion fit the better outcome pattern.

## Possible reasons
Stronger family involvement, lower expressed emotion, flexible work roles in agriculture and family business, less stigma in some communities, and more acute, stress related illnesses.

## Critiques
Alex Cohen and others argued the "better outcome" picture is oversimplified: centres were not representative, follow up was uneven, many patients in low income countries have poor outcomes, homelessness, chaining and early death, and modernisation is eroding family supports.

## Conclusion
Outcome in schizophrenia is far more variable and hopeful than Kraepelin's "dementia praecox" suggested. Cross cultural and Indian research show that social context shapes outcome, though the advantage should not be romanticised.`,
    keyPoints: ["Course patterns with prodrome", "Recovery and mortality figures", "Good and poor prognostic factors", "IPSS and DOSMeD with Indian centres", "Madras Longitudinal Study", "Reasons for better outcome", "Critique of the better outcome view"],
    visuals: [compare("Prognosis at a glance", ["Better outcome", ["Acute onset with stressor", "Good premorbid life", "Mood features", "Short untreated period", "Low expressed emotion"], "More likely to recover"], ["Worse outcome", ["Insidious onset", "Poor premorbid life", "Negative and cognitive symptoms", "Long untreated psychosis", "Substance use"], "More likely to have a continuous course"])],
    module: "psychosis",
    ref: "WHO IPSS 1973; Jablensky 1992 DOSMeD; Harrison 2001 ISoS; Thara 2004 Madras longitudinal; Cohen 2008; Jaaskelainen 2013 recovery",
  },
  {
    id: "psyp-l03-005",
    subject: "psychopathology",
    topic: "delusional-disorder",
    marks: 5,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance", "ma-semester"],
    question: "Write short notes on delusional disorder.",
    plan: ["Definition and criteria", "Subtypes", "Epidemiology and features", "Differential and treatment"],
    answer: `## Definition
Delusional disorder is a psychotic disorder in which one or more delusions persist, without the other features of schizophrenia, and functioning outside the delusion is relatively preserved. It corresponds to the older concept of paranoia.

## Criteria
- DSM-5-TR: one or more delusions lasting at least one month; schizophrenia criterion A never met (hallucinations, if present, are not prominent and fit the theme); functioning not markedly impaired; mood episodes, if any, are brief relative to the delusions; not due to a substance or medical condition.
- ICD-11 requires the delusion to persist for at least three months.

## Subtypes
Persecutory (most common), jealous (Othello syndrome), erotomanic (de Clerambault), grandiose, somatic (for example delusional parasitosis or the belief of emitting a bad smell), mixed and unspecified. DSM-5-TR adds a "with bizarre content" specifier.

## Features
Onset is usually in middle or late life, with a prevalence of about 0.2 percent. Delusions are systematised, plausible in content and held with full conviction. Patients often seek lawyers, police or skin doctors rather than psychiatrists. Jealous and persecutory types carry risk of violence to the partner or supposed persecutor.

## Differential diagnosis
Schizophrenia, psychotic depression, obsessive compulsive and body dysmorphic disorders with absent insight, paranoid personality disorder, and organic causes (dementia, substance use).

## Treatment
Engagement is difficult; focus on distress and sleep rather than arguing. Antipsychotics (with pimozide or other agents for delusional parasitosis) help some patients; cognitive behavioural therapy reduces conviction. Risk assessment is essential in jealousy.

## Conclusion
Delusional disorder is uncommon, chronic, and often hidden; careful engagement and risk assessment are the key.`,
    keyPoints: ["Definition and link to paranoia", "Duration in DSM-5-TR and ICD-11", "Preserved functioning", "Subtypes", "Risk in jealous and persecutory types", "Differential and treatment"],
    module: "psychosis",
    ref: "DSM-5-TR delusional disorder; ICD-11 6A24; Munro on delusional disorder",
  },
  {
    id: "psyp-l03-006",
    subject: "psychopathology",
    topic: "brief-psychotic",
    marks: 5,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "Write short notes on acute and transient psychotic disorder (ICD-11) and brief psychotic disorder (DSM-5-TR).",
    plan: ["Define each with duration", "Clinical features", "Indian research", "Course and management"],
    answer: `## Definitions
- ICD-11 acute and transient psychotic disorder (ATPD): acute onset of psychotic symptoms, going from a non psychotic state to a clearly psychotic state within two weeks, with symptoms that change rapidly in nature and intensity, and that do not last more than three months (usually days to a month).
- DSM-5-TR brief psychotic disorder: delusions, hallucinations, disorganised speech or grossly disorganised or catatonic behaviour lasting at least one day but less than one month, with full return to the previous level of functioning. Specifiers include with marked stressors, without marked stressors, and with postpartum onset.

## Clinical features
Sudden onset, emotional turmoil, perplexity, confusion without clouding, rapidly shifting delusions and hallucinations. A stressor often precedes the episode. The older ICD-10 subtypes (polymorphic, schizophrenia like) were removed in ICD-11, which keeps the polymorphic, changing picture as the core.

## Indian research
Acute psychoses are much more common in India and other developing countries than in the West, especially in women. Studies from Chandigarh and elsewhere described "acute non affective remitting psychoses", sometimes after fever, with good recovery. These findings shaped the ICD category.

## Course and management
Most patients recover fully within weeks; a proportion relapse and some later show bipolar disorder or schizophrenia, so follow up is needed. Management includes ruling out organic causes (infection, delirium, substances, epilepsy), a short course of antipsychotic, sleep restoration, and family support. Medicines are usually tapered after a few months of remission.

## Conclusion
ATPD and brief psychotic disorder describe sudden, short and often stress related psychoses with good prognosis, especially relevant in India.`,
    keyPoints: ["ICD-11 onset within two weeks and duration up to three months", "DSM-5-TR one day to one month", "Polymorphic changing features", "Higher frequency in India and in women", "Organic causes excluded", "Good prognosis with follow up"],
    module: "psychosis",
    ref: "ICD-11 6A23; DSM-5-TR brief psychotic disorder; Malhotra and Varma on ATPD; Susser and Wanderling 1994 NARP",
  },
  {
    id: "psyp-l03-007",
    subject: "psychopathology",
    topic: "schizoaffective",
    marks: 5,
    difficulty: 3,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "Write short notes on schizoaffective disorder.",
    plan: ["History and definition", "DSM-5-TR and ICD-11 criteria", "Subtypes and reliability", "Prognosis and treatment"],
    answer: `## History and definition
Kasanin coined the term in 1933 for young patients with sudden psychoses combining schizophrenic and mood symptoms. Today it describes an illness in which schizophrenia symptoms and a major mood episode occur together, and which sits between schizophrenia and mood disorders.

## Criteria
- DSM-5-TR: an uninterrupted period of illness in which a major depressive or manic episode occurs together with criterion A of schizophrenia; delusions or hallucinations for two weeks or more without a major mood episode at some point in the lifetime illness; mood episodes present for the majority of the total duration of the illness.
- ICD-11: both schizophrenia and mood episode criteria are met in the same episode, either at the same time or within a few days of each other. ICD-11 diagnoses the episode rather than the lifetime course.

## Subtypes
Bipolar type (with mania) and depressive type.

## Reliability and validity
The diagnosis has low reliability (DSM-5 field trial kappa about 0.5) because clinicians must judge the share of illness time with mood symptoms. Family studies show risk for both schizophrenia and mood disorders in relatives, supporting a continuum view.

## Prognosis and treatment
Outcome is generally intermediate: better than schizophrenia, worse than mood disorders. Treatment combines an antipsychotic (paliperidone has a specific approval) with a mood stabiliser for the bipolar type or an antidepressant for the depressive type, plus psychosocial care. Clozapine helps in resistant cases.

## Conclusion
Schizoaffective disorder is a clinically useful but unstable category; careful longitudinal history is the key to the diagnosis.`,
    keyPoints: ["Kasanin 1933", "DSM-5-TR two weeks of psychosis without mood episode", "Mood episodes for majority of illness", "ICD-11 episode based approach", "Low reliability", "Intermediate prognosis and treatment"],
    module: "psychosis",
    ref: "DSM-5-TR schizoaffective disorder; ICD-11 6A21; Kasanin 1933; Regier 2013 field trials",
  },
  {
    id: "psyp-l03-008",
    subject: "psychopathology",
    topic: "first-episode",
    marks: 10,
    difficulty: 3,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "Discuss the concept of duration of untreated psychosis and the clinical high risk state. What is the case for early intervention?",
    plan: ["Define DUP and its effects", "Clinical high risk criteria and tools", "Transition rates and outcomes", "Early intervention services and evidence", "Indian context", "Critique and conclusion"],
    answer: `## Duration of untreated psychosis
Duration of untreated psychosis (DUP) is the time from the onset of psychotic symptoms to the start of adequate treatment. Longer DUP is linked to poorer symptom response, more negative symptoms, worse social functioning and more relapse. Whether DUP is a cause or a marker of a more insidious illness is debated, but the link remains after adjusting for onset type.

## Clinical high risk state
Also called the at risk mental state or prodrome, it identifies young people with a raised short term risk of psychosis. Criteria, as in the Comprehensive Assessment of At Risk Mental States and the Structured Interview for Psychosis Risk Syndromes:
- Attenuated psychotic symptoms: subthreshold unusual beliefs or perceptions.
- Brief limited intermittent psychotic symptoms that resolve within a week.
- Genetic risk with functional decline: a first degree relative with psychosis or schizotypal personality, plus a fall in functioning.
DSM-5-TR lists attenuated psychosis syndrome in the section of conditions for further study.

## Transition and outcome
Early studies found that about a third developed psychosis in a year, but rates have fallen to about 15 to 25 percent over two to three years, partly because referral pathways widened. Many who do not convert still have depression, anxiety and poor functioning, so help is needed regardless.

## Early intervention services
Specialist teams, first set up in Melbourne (Patrick McGorry), offer:
- Rapid assessment and low threshold access, including in schools and colleges.
- Low dose antipsychotics for first episode, with attention to weight and side effects.
- Cognitive behavioural therapy, family intervention, vocational support and physical health care.
- Assertive engagement for two to five years.
Evidence: trials such as OPUS in Denmark and the RAISE programme in the USA show better engagement, fewer admissions and better functioning while the service is provided, though some gains fade if care stops. For high risk youth, CBT may delay or reduce transition; antipsychotics are not recommended for prevention.

## Indian context
DUP is often long in India because families first visit faith healers and general physicians, and because of stigma and distance from services. The Schizophrenia Research Foundation in Chennai, NIMHANS and the District Mental Health Programme have worked on early detection, and Tele MANAS (since 2022) offers a free route to advice.

## Critique
- Labelling risk may cause stigma and unnecessary treatment.
- Most at risk youth do not convert.
- Benefits may not last without continued care.

## Conclusion
Shortening DUP and offering phase specific care in the first years is the best supported way to improve outcomes in psychosis, but it needs sustained services and careful use of the risk label.`,
    keyPoints: ["Definition of DUP and its outcome links", "Three clinical high risk groups", "CAARMS or SIPS named", "Transition rates and their decline", "Components of early intervention services", "Evidence from OPUS or RAISE", "Indian pathways to care and services", "Critique of labelling"],
    visuals: [chain("Pathway to care in India", [["First symptoms", "Withdrawal, suspiciousness"], ["Faith healer or family remedies", "Often the first stop"], ["General physician", "Sleep or vitamin tablets"], ["Psychiatrist", "Often after a crisis"], ["Treatment begins", "DUP ends here"]], "Each step adds months to untreated psychosis.")],
    module: "psychosis",
    ref: "McGorry; Yung CAARMS; Fusar-Poli 2012 transition; OPUS Petersen 2005; Kane 2016 RAISE; Tele MANAS 2022",
  },
  {
    id: "psyp-l03-009",
    subject: "psychopathology",
    topic: "schizophrenia-case",
    marks: 15,
    difficulty: 3,
    exams: ["md-psychiatry", "mcp-entrance", "ma-semester"],
    question: "A 22-year-old unmarried engineering graduate from Ahmedabad has, for four months, stayed in his room, believed that his neighbours have placed cameras to watch him, and talked to himself. He smokes cannabis daily. His parents took him to a faith healer first. Formulate the case and plan the management.",
    plan: ["Summarise and give a provisional diagnosis with differentials", "List assessments needed", "Write a 5 Ps formulation", "Plan management in phases: acute, continuation, long term", "Address cannabis, family and legal points", "Prognosis"],
    answer: `## Summary and provisional diagnosis
A young man with four months of social withdrawal, persecutory delusions and probable auditory hallucinations, with daily cannabis use. The provisional diagnosis is a first episode psychosis, most likely schizophrenia (DSM-5-TR schizophreniform disorder until six months have passed; ICD-11 schizophrenia, first episode, since symptoms exceed one month).

Differential diagnosis:
- Substance or medication induced psychotic disorder (cannabis).
- Bipolar disorder or depression with psychotic features.
- Delusional disorder.
- Psychosis due to a medical condition (epilepsy, thyroid disease, autoimmune encephalitis, head injury).

## Assessment
- History from patient and parents: onset, prodrome, mood symptoms, timeline of cannabis use relative to symptoms, other drugs, suicide and violence risk, family history, premorbid personality, academic record.
- Mental status examination: delusion details, hallucinations (third person, commentary), thought disorder, negative symptoms, insight.
- Physical examination and tests: blood counts, glucose, lipids, thyroid, renal and liver function, urine drug screen, ECG, weight and waist; EEG or MRI if atypical features.
- Rating scales: PANSS or BPRS at baseline.

## Formulation (5 Ps)
- Presenting: persecutory delusions, hallucinations, withdrawal, impaired functioning.
- Predisposing: possible family history (to be checked), young male, cannabis use since college.
- Precipitating: unemployment after graduation, increase in cannabis use.
- Perpetuating: ongoing daily cannabis, lack of insight, delay in care through a faith healer, family distress and possible criticism.
- Protective: educated, supportive parents who sought help, no forensic history.

## Management
Acute phase:
- Engage gently, avoid arguing with the delusion, focus on his distress and sleep.
- Setting: outpatient if safe; if risk is high and he refuses, consider supported admission under section 89 of the MHCA 2017, with his nominated representative.
- Medicine: a second generation antipsychotic at a low starting dose, for example risperidone 1 to 2 mg rising to 2 to 4 mg, or aripiprazole 10 mg, chosen with him after discussing weight and side effects. Short term lorazepam for agitation if needed.
- Monitor response over four to six weeks before judging failure.

Cannabis:
- Psychoeducation that cannabis worsens and prolongs psychosis.
- Motivational interviewing; relapse prevention; involve friends.

Psychosocial:
- Psychoeducation for patient and family: nature of illness, early warning signs, medicines.
- Family intervention to reduce expressed emotion and share problem solving.
- CBT for psychosis to work with distress and conviction.
- Vocational rehabilitation towards a job matched to his skills.

Continuation and long term:
- Continue the antipsychotic for at least one to two years after remission of a first episode; discuss slow tapering afterwards.
- Physical health: weight, glucose and lipids at baseline, 12 weeks and yearly; smoking cessation.
- If two adequate antipsychotic trials fail, consider clozapine.
- Relapse plan, possibly an advance directive under the MHCA once he has capacity.

## Risk and safety
Ask directly about suicidal ideas, command hallucinations and intent to act against the neighbours he believes are watching him. Remove access to means at home, agree a crisis plan with the parents, and give the Tele MANAS number (14416) for urgent advice. Review risk at every visit in the first weeks, because suicide risk is highest early in the illness and after discharge.

## Prognosis
Good factors: education, family support, possibly acute stressor. Poor factors: male, insidious onset, ongoing cannabis, long untreated period. With continued treatment and abstinence, prognosis is fair.

## Conclusion
This is a first episode psychosis needing phased, combined care. Stopping cannabis, involving the family and continuing medicines for at least a year are the keys to recovery.`,
    keyPoints: ["Provisional diagnosis with DSM and ICD duration logic", "At least four differentials including cannabis induced psychosis", "Focused investigations including urine drug screen", "Complete 5 Ps formulation", "Antipsychotic choice with dose and monitoring", "Cannabis intervention", "Family intervention and rehabilitation", "MHCA supported admission if needed and duration of treatment"],
    pitfalls: ["Diagnosing schizophrenia under DSM before six months without comment", "Ignoring cannabis", "No physical health monitoring", "Arguing with the delusion"],
    visuals: [timeline("Phases of care in first episode psychosis", [["Engage and assess", "Week 1"], ["Start low dose antipsychotic", "Weeks 1 to 2"], ["Review response", "Weeks 4 to 6"], ["Family work, CBT, cannabis help", "Months 1 to 6"], ["Continue treatment after remission", "At least 1 to 2 years"]])],
    module: "psychosis",
    ref: "Maudsley first episode guidance; NICE CG178; MHCA 2017 s89; DSM-5-TR schizophreniform",
  },
  {
    id: "psyp-l03-010",
    subject: "psychopathology",
    topic: "schizophrenia-clinical",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "mcp-entrance", "md-psychiatry"],
    question: "Describe the clinical features of schizophrenia and the DSM-5-TR diagnostic criteria.",
    plan: ["Definition and historical concepts (Kraepelin, Bleuler, Schneider)", "Symptom groups with examples", "DSM-5-TR criteria in order", "ICD-11 key differences", "Conclusion"],
    answer: `## Introduction
Schizophrenia is a chronic psychotic disorder affecting perception, thinking, emotion, motivation and behaviour. Emil Kraepelin called it dementia praecox, stressing early onset and deteriorating course. Eugen Bleuler coined the term schizophrenia and described the four As: loosening of associations, affective blunting, ambivalence and autism. Kurt Schneider emphasised first rank symptoms.

## Clinical features
- Positive symptoms: delusions (persecutory, reference, control), hallucinations (mostly auditory, third person, commentary), and passivity experiences.
- Disorganisation: formal thought disorder (derailment, incoherence), bizarre behaviour and inappropriate affect.
- Negative symptoms: blunted affect, alogia, avolition, anhedonia and asociality.
- Cognitive symptoms: poor attention, working memory, processing speed and executive function; these are present at onset and predict function.
- Affective symptoms: depression and suicidality (lifetime suicide risk about 5 percent).
- Psychomotor: catatonic features in some.
- Insight is often poor.
Onset is usually in the late teens to early twenties in men and a few years later in women, with a second peak in women after 40.

## DSM-5-TR criteria
- A: two or more of the following for a significant time during one month (less if treated), at least one of which is from the first three: delusions, hallucinations, disorganised speech, grossly disorganised or catatonic behaviour, negative symptoms.
- B: functioning in work, relationships or self care is markedly below the earlier level.
- C: continuous signs for at least six months, including at least one month of active symptoms; the rest may be prodromal or residual.
- D: schizoaffective and mood disorders with psychotic features are excluded.
- E: not due to a substance or medical condition.
- F: if there is a history of autism or a childhood communication disorder, prominent delusions or hallucinations must be present for at least one month.
Specifiers describe the course (first episode, multiple episodes, in acute episode, partial or full remission, continuous) and catatonia, and severity can be rated dimensionally.

## ICD-11 differences
Duration of one month only; core symptoms include persistent delusions, hallucinations, thought disorder, experiences of influence or passivity, negative symptoms, disorganised behaviour and psychomotor disturbances; symptom specifiers rate positive, negative, depressive, manic, psychomotor and cognitive domains.

| Feature | DSM-5-TR | ICD-11 |
| Total duration | Six months | One month |
| Functional decline | Required | Not required |
| Subtypes | None | None; symptom specifiers |

## Conclusion
Schizophrenia is diagnosed by a pattern of positive, negative and disorganised symptoms with functional decline over time. The DSM-5-TR six month rule and functional criterion differ from ICD-11, which a student must know.`,
    keyPoints: ["Kraepelin, Bleuler and Schneider contributions", "Five symptom groups with examples", "Cognitive symptoms included", "Criterion A with one of first three", "Six months with one month active", "Functional decline and exclusions", "ICD-11 differences"],
    visuals: [timeline("The six month rule in DSM-5-TR", [["Prodrome", "Withdrawal, odd ideas"], ["Active phase", "At least one month of criterion A"], ["Residual phase", "Negative or attenuated symptoms"], ["Six months total", "Diagnosis of schizophrenia possible"]], "Under six months the diagnosis is schizophreniform disorder.")],
    module: "psychosis",
    ref: "DSM-5-TR schizophrenia criteria; ICD-11 6A20; Kaplan schizophrenia chapter",
  },
]);
