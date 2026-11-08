import type { LongQA } from "@/lib/prep/long-types";
import { anchored, brain, chain, timeline, tree } from "./visual";

export const CLINICAL_PSYCHIATRY_L05: LongQA[] = anchored([
  {
    id: "cpsy-l05-001",
    subject: "clinical-psychiatry",
    topic: "bpsd",
    marks: 10,
    difficulty: 3,
    exams: ["md-psychiatry"],
    question: "Discuss the assessment and management of behavioural and psychological symptoms of dementia (BPSD).",
    plan: ["Definition and frequency", "Common symptoms and causes", "Assessment with a structured approach", "Non drug management", "Drug management with risks", "Carers and conclusion"],
    answer: `## Definition and frequency
BPSD are the non cognitive symptoms of dementia: agitation, aggression, wandering, apathy, depression, anxiety, psychosis, disinhibition, sleep disturbance and calling out. Nearly all people with dementia have some BPSD during the illness. They cause carer stress, admission to care, and the inappropriate use of sedatives.

## Causes to consider
- Unmet needs: pain, hunger, thirst, constipation, urinary retention, need for the toilet, being too hot or cold, boredom, loneliness.
- Delirium from infection, dehydration or medicines.
- Environment: noise, unfamiliar surroundings, poor lighting, changes in routine or carers.
- Communication: the person cannot express needs or understand instructions.
- Psychiatric: depression, anxiety, psychosis (visual hallucinations in Lewy body dementia), sleep disorders.
- Carer stress and interaction style.

## Assessment
The DICE approach is practical:
- Describe the behaviour: what, when, where, with whom, how often, and what happens before and after.
- Investigate causes: pain, infection, medicines (especially anticholinergics), sensory loss, environment, carer factors.
- Create a plan with carers.
- Evaluate whether it worked.
Rating scales such as the Neuropsychiatric Inventory and the Cohen Mansfield Agitation Inventory help track change; a pain scale for non verbal patients (such as PAINAD) is useful.

## Non drug management
- Treat pain: in a care home trial, regular paracetamol for pain significantly reduced agitation.
- Person centred care, structured daily activities, music, reminiscence, exercise, outdoor time.
- Simplify communication; distract and redirect rather than confront.
- Sleep hygiene and daylight exposure.
- Carer training and support; respite.

## Drug management
Used only when symptoms are severe, cause marked distress or risk, and non drug measures have failed.
- Antipsychotics: risperidone has the most evidence for aggression and psychosis in Alzheimer disease, used at low dose (0.25 to 1 mg) for a short period (about six to twelve weeks) with regular review and planned withdrawal. Antipsychotics increase the risk of stroke and death (about 1.6 to 1.7 times), sedation, falls and parkinsonism. Brexpiprazole was approved in the USA in 2023 for agitation in Alzheimer dementia. In Lewy body and Parkinson dementia, typical antipsychotics are dangerous; quetiapine or clozapine at very low doses are preferred if needed.
- Cholinesterase inhibitors help apathy and hallucinations in Lewy body dementia and may modestly help BPSD in Alzheimer disease.
- Antidepressants: citalopram reduced agitation in one trial but prolongs QTc; SSRIs for depression and anxiety.
- Sleep: melatonin or trazodone; avoid benzodiazepines (falls, confusion, paradoxical agitation).
- Avoid anticholinergic drugs.

## Carers and ethics
In India most people with dementia live at home and are cared for by family, often women, with little training or respite. Support groups, the Alzheimer's and Related Disorders Society of India, day care centres and home visits help. Capacity, consent and the least restrictive option apply under the MHCA 2017; physical restraint should be avoided.

## Conclusion
BPSD are best managed by finding and treating causes, especially pain and delirium, with non drug methods and carer support. Antipsychotics are a last resort, at low dose for short periods, because of serious risks.`,
    keyPoints: ["Definition and near universal frequency", "Unmet needs and delirium as causes", "DICE approach and rating scales", "Pain treatment reduces agitation", "Non drug measures", "Antipsychotic indication, dose, duration and mortality risk", "Lewy body caution and cholinesterase inhibitors", "Carer support and MHCA least restrictive care"],
    visuals: [chain("The DICE approach", [["Describe", "What, when, where, with whom"], ["Investigate", "Pain, infection, medicines, environment"], ["Create", "A plan with carers"], ["Evaluate", "Did it help? Adjust"]])],
    module: "neurocognitive",
    ref: "Kales 2014 DICE; Husebo 2011 BMJ pain and agitation; Schneider 2005 antipsychotic mortality; FDA brexpiprazole 2023; Porsteinsson 2014 CitAD; Maudsley BPSD",
  },
  {
    id: "cpsy-l05-002",
    subject: "clinical-psychiatry",
    topic: "reversible-dementia",
    marks: 10,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "What are the potentially reversible causes of dementia? Describe the investigation of a patient presenting with cognitive decline.",
    plan: ["Concept and how often dementia is reversible", "List causes by group", "Normal pressure hydrocephalus as an example", "Investigation scheme", "Conclusion"],
    answer: `## Concept
Some conditions cause cognitive decline that can stop or improve with treatment. Truly reversible dementia is uncommon (a small percentage of cases in memory clinics), but treatable contributors are frequent, especially in older people with several illnesses, so every patient deserves a careful work up.

## Potentially reversible causes
| Group | Examples |
| Psychiatric | Depression (depression related cognitive impairment) |
| Drugs | Anticholinergics, benzodiazepines, opioids, antiepileptics, alcohol |
| Metabolic and endocrine | Hypothyroidism, hypercalcaemia, hyponatraemia, hypoglycaemia, liver and kidney failure |
| Nutritional | Vitamin B12, folate and thiamine deficiency |
| Structural | Normal pressure hydrocephalus, chronic subdural haematoma, benign tumours (meningioma) |
| Infective | Neurosyphilis, HIV, chronic meningitis (tuberculous, cryptococcal) |
| Inflammatory | Autoimmune encephalitis, lupus, vasculitis |
| Others | Obstructive sleep apnoea, Wilson disease, heavy metal poisoning, uncontrolled epilepsy |

## Normal pressure hydrocephalus
Classically a triad of gait disturbance (magnetic, broad based, shuffling gait), urinary incontinence and cognitive slowing ("wet, wobbly and wacky"). Imaging shows enlarged ventricles out of proportion to atrophy. A lumbar tap test with gait improvement predicts benefit from a ventriculoperitoneal shunt. Gait responds best; cognition less.

## Investigation of cognitive decline
History:
- Onset, course, first symptoms, functional decline, from patient and informant.
- Mood, psychotic symptoms, sleep (snoring, apnoea), alcohol and drug use, full medication list including over the counter drugs.
- Vascular risk factors, head injury, falls, family history.
Examination:
- Cognitive tests: MMSE or the Hindi Mental State Examination for people with little schooling, MoCA, ACE III; clock drawing.
- Neurological examination: gait, parkinsonism, focal signs, frontal release signs.
- General: thyroid signs, liver disease, nutrition, hearing and vision.
Blood tests:
- Blood count, ESR or CRP, electrolytes and calcium, glucose, renal and liver function, thyroid function, vitamin B12 and folate.
- Syphilis serology and HIV when indicated.
Imaging:
- MRI (or CT) of the brain for structural causes, vascular disease and atrophy pattern.
Selected further tests:
- EEG for fluctuating cognition, seizures, Creutzfeldt Jakob disease or encephalopathy.
- Lumbar puncture: infection, autoimmune encephalitis, and amyloid and tau biomarkers.
- PET or SPECT, DaT scan in suspected Lewy body dementia.
- Sleep study, ceruloplasmin, heavy metals, autoimmune antibodies as indicated.
- Neuropsychological testing for mild or atypical cases.

## Conclusion
Although few dementias are fully reversible, many treatable contributors exist. A structured history, examination, basic blood tests and brain imaging should be done in every patient, with further tests guided by clinical clues.`,
    keyPoints: ["Reversible dementia is uncommon but contributors are common", "Causes in at least six groups", "Depression and drugs as common causes", "NPH triad, imaging and tap test", "Informant history and medicine review", "Standard blood panel including B12 and thyroid", "Imaging for all", "Selected tests with indications"],
    visuals: [tree("Reversible contributors to cognitive decline", [["Cognitive decline", "", -1], ["Mind", "Depression", 0], ["Medicines", "Anticholinergics, benzodiazepines, alcohol", 0], ["Metabolic", "Thyroid, calcium, sodium, B12", 0], ["Structural", "NPH, subdural, tumour", 0], ["Infection and inflammation", "Syphilis, HIV, autoimmune", 0]])],
    module: "neurocognitive",
    ref: "Clarfield 2003 reversible dementia meta-analysis; NICE NG97 dementia; Kaplan neurocognitive; Relkin 2005 iNPH guidelines",
  },
  {
    id: "cpsy-l05-003",
    subject: "clinical-psychiatry",
    topic: "epilepsy-psychiatry",
    marks: 15,
    difficulty: 3,
    exams: ["md-psychiatry"],
    question: "Discuss the psychiatric aspects of epilepsy, including the psychoses of epilepsy and the psychiatric effects of antiepileptic drugs.",
    plan: ["Size of the problem and classification by timing", "Mood and anxiety disorders and suicide", "Psychoses: ictal, postictal, interictal, forced normalisation", "Personality, cognition and functional seizures", "Drugs: antiepileptic effects and psychotropic choice", "Social and Indian context; conclusion"],
    answer: `## Size of the problem
About a third of people with epilepsy have a psychiatric disorder at some point, more in temporal lobe epilepsy and drug resistant epilepsy. The relationship is bidirectional: depression and suicide attempts increase the risk of later epilepsy, and epilepsy increases the risk of psychiatric illness. Symptoms are classified by their timing:
- Pre ictal: irritability, low mood hours to days before a seizure.
- Ictal: fear, deja vu, hallucinations as part of a focal seizure.
- Postictal: confusion, psychosis, depression after seizures.
- Interictal: conditions between seizures.

## Mood and anxiety disorders
- Depression affects about 20 to 30 percent, more than in other chronic illnesses; it worsens quality of life more than seizure frequency.
- Interictal dysphoric disorder: intermittent irritability, low mood, anxiety, pain and insomnia lasting hours to days.
- Anxiety, including fear of seizures in public.
- Suicide risk is about three times higher than in the general population.
- Screening with the Neurological Disorders Depression Inventory for Epilepsy (NDDI-E).

## Psychoses of epilepsy
| Type | Features |
| Ictal psychosis | Part of non convulsive status or a focal seizure; EEG abnormal during symptoms |
| Postictal psychosis | Most common type; after a cluster of seizures, a lucid interval of 12 to 72 hours, then psychosis with mood and religious themes lasting days to two weeks; recurs |
| Interictal psychosis | Chronic schizophrenia like psychosis after years of epilepsy, often temporal lobe (Slater's description); more preserved affect and fewer negative symptoms than schizophrenia |
| Alternative psychosis (forced normalisation) | Psychosis appears when seizures are controlled and the EEG becomes more normal (Landolt); seizures and psychosis alternate |
| Drug induced psychosis | After starting certain drugs (vigabatrin, levetiracetam, topiramate, high dose ethosuximide) |
Management: treat postictal psychosis by preventing seizure clusters and with short term benzodiazepines or antipsychotics; use antipsychotics with lower seizure risk (risperidone, aripiprazole, haloperidol) at modest doses.

## Personality and behaviour
Geschwind (Gastaut Geschwind) syndrome, described in temporal lobe epilepsy, includes hypergraphia, hyperreligiosity, altered (usually reduced) sexuality and interpersonal viscosity (stickiness in conversation). It is controversial and uncommon. Aggression is usually not ictal; directed violence during seizures is rare.

## Cognition and development
Memory problems in temporal lobe epilepsy, effects of frequent seizures and drugs, and higher rates of ADHD, autism and intellectual disability in childhood epilepsy.

## Functional seizures
About 10 to 20 percent of people with functional (dissociative) seizures also have epilepsy; video EEG helps separate them.

## Drugs and their psychiatric effects
Antiepileptics:
- Negative effects: levetiracetam (irritability, aggression, depression, psychosis), topiramate (cognitive slowing, word finding difficulty, depression), perampanel (aggression), vigabatrin (depression, psychosis), phenobarbital (depression, hyperactivity in children).
- Positive effects: lamotrigine (antidepressant, mood stabiliser), valproate and carbamazepine (mood stabilisers), pregabalin and gabapentin (anxiolytic).
- Interactions: carbamazepine, phenytoin and phenobarbital induce liver enzymes and lower levels of many psychotropics and contraceptives; valproate doubles lamotrigine levels.
Psychotropics:
- Seizure risk is highest with clozapine (dose related), bupropion, tricyclics (especially clomipramine) and chlorpromazine; lower with SSRIs, risperidone, aripiprazole and haloperidol.
- SSRIs are safe and first line for depression in epilepsy.
- ECT is not contraindicated and can be used.

## Social and Indian context
Epilepsy carries heavy stigma in India; it was once a ground for divorce under the Hindu Marriage Act until the law was amended in 1999. Myths of possession and fear of marriage prevent disclosure and treatment. The treatment gap is large in rural areas. Driving rules, employment and pregnancy planning (valproate risks) need discussion.

## Conclusion
Psychiatric disorders in epilepsy are common, varied and often linked to the timing of seizures and to drugs. Recognising the type of psychosis, choosing drugs with seizure and mood effects in mind, and treating depression and suicide risk are essential parts of epilepsy care.`,
    keyPoints: ["Prevalence and bidirectional link", "Classification by timing", "Depression, interictal dysphoric disorder and suicide", "Postictal psychosis with lucid interval", "Interictal psychosis and forced normalisation", "Geschwind syndrome with caution", "Antiepileptic psychiatric effects and interactions", "Psychotropic seizure risks and SSRIs safe; Indian stigma"],
    pitfalls: ["Calling all psychosis in epilepsy schizophrenia", "Missing drug induced effects of levetiracetam", "Avoiding SSRIs out of misplaced fear"],
    visuals: [
      timeline("Postictal psychosis: put the events in order", [["Cluster of seizures", "Day 0"], ["Lucid interval", "12 to 72 hours"], ["Psychosis with mood and religious themes", "Days"], ["Recovery", "Usually within two weeks"]]),
      brain("Temporal lobe epilepsy and behaviour", { temporal: "Seizure focus: deja vu, fear, smells", hippocampus: "Memory problems, sclerosis", amygdala: "Ictal fear and mood changes" }),
    ],
    module: "neurocognitive",
    ref: "Kaplan neuropsychiatry of epilepsy; Maudsley epilepsy prescribing; Kanner 2016; Slater 1963; Landolt forced normalisation; Hindu Marriage (Amendment) Act 1999",
  },
  {
    id: "cpsy-l05-004",
    subject: "clinical-psychiatry",
    topic: "post-stroke",
    marks: 5,
    difficulty: 2,
    exams: ["md-psychiatry"],
    question: "Write short notes on post-stroke depression and other neuropsychiatric consequences of stroke.",
    plan: ["Frequency and impact", "Risk factors and the lesion location debate", "Other syndromes", "Treatment"],
    answer: `## Frequency and impact
About a third of stroke survivors develop depression in the first year. It slows rehabilitation, worsens cognitive and functional recovery, and increases mortality. It is often missed because of aphasia and because low mood is thought "understandable".

## Risk factors and lesion location
Severity of disability, previous depression, cognitive impairment, social isolation and female sex. Robert Robinson proposed that left frontal lesions carry the highest risk; later meta analyses did not confirm a strong location effect, so all stroke patients should be screened.

## Other syndromes
- Post-stroke anxiety and PTSD.
- Apathy (common with frontal and subcortical lesions), easily confused with depression.
- Pseudobulbar affect (emotionalism): sudden crying or laughing out of proportion to mood.
- Catastrophic reaction: sudden distress and anger when faced with tasks the person can no longer do, often in left hemisphere lesions with aphasia.
- Anosognosia and neglect in right hemisphere strokes.
- Vascular cognitive impairment and dementia, and post-stroke psychosis (rare).

## Treatment
- Screening with tools usable in aphasia (observational scales).
- SSRIs (sertraline, citalopram, escitalopram) are effective for depression; watch for bleeding with antiplatelets and anticoagulants and for hyponatraemia. Fluoxetine did not improve motor recovery in large trials, though it reduced depression.
- Psychological support, problem solving, behavioural activation and rehabilitation; family involvement.
- Pseudobulbar affect responds to SSRIs and, where available, dextromethorphan with quinidine.

## Conclusion
Depression and related syndromes are common after stroke and treatable; routine screening improves recovery.`,
    keyPoints: ["About one third affected", "Impact on recovery and mortality", "Robinson's left frontal hypothesis and its limits", "Apathy, pseudobulbar affect, catastrophic reaction", "SSRIs with bleeding caution", "Large trials on fluoxetine"],
    module: "neurocognitive",
    ref: "Hackett 2014 meta-analysis; Robinson 1984; FOCUS 2019, AFFINITY 2020, EFFECTS 2020 fluoxetine trials",
  },
  {
    id: "cpsy-l05-005",
    subject: "clinical-psychiatry",
    topic: "tbi",
    marks: 10,
    difficulty: 3,
    exams: ["md-psychiatry"],
    question: "Discuss the psychiatric sequelae of traumatic brain injury and their management.",
    plan: ["Size of the problem and mechanisms", "Acute and post concussion syndromes", "Mood, anxiety, psychosis, personality change and behaviour", "Cognition and substance use", "Assessment and management", "Medico legal points and conclusion"],
    answer: `## Size of the problem
Traumatic brain injury (TBI) is common in young men; in India road traffic accidents are the leading cause, followed by falls and assault. Psychiatric problems are frequent and often outlast physical recovery.

## Mechanisms
Frontal and anterior temporal lobes are most vulnerable because of their position against the skull, and diffuse axonal injury disrupts connections. Injury severity is graded by the Glasgow Coma Scale and the duration of post traumatic amnesia, which is the best predictor of outcome.

## Acute and early syndromes
- Delirium and post traumatic amnesia with agitation in the early phase.
- Post concussion syndrome after mild injury: headache, dizziness, fatigue, irritability, poor concentration, memory complaints, sleep problems and sensitivity to noise and light. Most improve within weeks to months; persistence is linked to pre injury vulnerability, anxiety, expectations and litigation.

## Later syndromes
- Depression in up to a third or more, with raised suicide risk.
- Anxiety disorders and PTSD (even when the person has amnesia for the event).
- Mania, less common, often with right hemisphere lesions.
- Psychosis, sometimes years after injury, more often with temporal lobe damage and post traumatic epilepsy.
- Personality change due to TBI: apathy and loss of drive (dorsolateral damage), or disinhibition, irritability, impulsivity and aggression (orbitofrontal damage). Families often say "he is not the same person".
- Cognitive impairment: attention, processing speed, memory and executive function.
- Substance use, both before and after injury.
- Repeated head injuries in contact sports can lead to chronic traumatic encephalopathy.

## Assessment
History from family, injury details (GCS, post traumatic amnesia, imaging), pre injury personality and substance use, neuropsychological testing, and screening for depression, PTSD and epilepsy.

## Management
- Rehabilitation by a multidisciplinary team: cognitive rehabilitation, occupational therapy, vocational support.
- Psychoeducation for patient and family; structured routines and reduced stimulation.
- Psychological therapy: CBT adapted for cognitive deficits, behaviour management for aggression.
- Medicines at low doses with slow titration ("start low, go slow"):
- SSRIs (sertraline, citalopram) for depression and irritability.
- Methylphenidate for attention and processing speed; amantadine to improve arousal in early recovery.
- Propranolol for aggression and agitation.
- Avoid benzodiazepines and high dose typical antipsychotics, which can slow recovery and worsen cognition; use low dose atypicals if needed.
- Lower seizure risk drugs where possible.

## Medico legal points
Compensation claims, fitness to work and drive, and capacity assessments are common. Malingering and exaggeration must be considered fairly.

## Conclusion
TBI causes a wide range of psychiatric and cognitive problems, especially frontal personality change. Multidisciplinary rehabilitation and careful low dose prescribing give the best outcomes.`,
    keyPoints: ["Road traffic accidents in India", "Frontal and temporal vulnerability and diffuse axonal injury", "Post traumatic amnesia as predictor", "Post concussion syndrome", "Depression, PTSD, mania, psychosis", "Personality change with frontal patterns", "Rehabilitation and low dose prescribing", "Avoid benzodiazepines; medico legal issues"],
    visuals: [brain("Why frontal and temporal lobes suffer", { prefrontal: "Dorsolateral damage: apathy, poor planning", frontal: "Orbitofrontal damage: disinhibition, irritability", temporal: "Memory, psychosis, epilepsy", "corpus-callosum": "Diffuse axonal injury cuts connections" })],
    module: "neurocognitive",
    ref: "Kaplan TBI chapter; Fleminger 2005; Maudsley TBI prescribing; Gururaj Indian TBI epidemiology",
  },
  {
    id: "cpsy-l05-006",
    subject: "clinical-psychiatry",
    topic: "hiv",
    marks: 10,
    difficulty: 3,
    exams: ["md-psychiatry"],
    question: "Discuss the psychiatric aspects of HIV infection.",
    plan: ["Indian context and links between HIV and mental illness", "HIV associated neurocognitive disorders", "Mood, psychosis and other syndromes", "Drug interactions and ART neuropsychiatric effects", "Counselling, law and management", "Conclusion"],
    answer: `## Indian context and links
India has about 25 lakh people living with HIV. Mental illness increases the risk of HIV (through substance use, injecting, unsafe sex, sexual exploitation) and HIV increases the risk of mental illness (through brain infection, stigma, stress and treatment effects). Mental illness also reduces adherence to antiretroviral therapy (ART).

## HIV associated neurocognitive disorders (HAND)
The Frascati criteria describe three levels:
- Asymptomatic neurocognitive impairment: test deficits without daily impact.
- Mild neurocognitive disorder: mild interference with daily life.
- HIV associated dementia: marked impairment, now uncommon with effective ART.
The typical pattern is subcortical: slowing, poor attention and concentration, apathy, psychomotor slowing and motor problems. The International HIV Dementia Scale is a quick screen.

## Mood, psychosis and other syndromes
- Depression in about a third; suicide risk is raised, especially soon after diagnosis.
- Anxiety and adjustment disorders after diagnosis.
- Mania: either primary bipolar disorder or secondary "AIDS mania" in advanced disease with cognitive impairment.
- New onset psychosis, usually in advanced disease.
- Delirium from opportunistic infections (toxoplasmosis, cryptococcal meningitis, tuberculosis), progressive multifocal leucoencephalopathy and lymphoma.
- Substance use disorders, especially among people who inject drugs.

## ART and interactions
- Efavirenz causes vivid dreams, insomnia, anxiety, depression and occasionally psychosis; dolutegravir can cause insomnia and mood changes.
- Ritonavir and cobicistat strongly inhibit CYP3A4, raising levels of some benzodiazepines (avoid midazolam and triazolam), quetiapine and others.
- Carbamazepine and other inducers lower ART levels and can cause treatment failure; avoid them.
- Methadone levels may fall with some ART drugs.
- Check interactions with an HIV drug interaction resource before prescribing.

## Counselling, law and management
- Pre test and post test counselling, with consent and confidentiality.
- The HIV and AIDS (Prevention and Control) Act 2017 forbids discrimination in employment, education, health care and housing, and protects confidentiality; the MHCA 2017 also protects confidentiality of mental health information.
- Treat depression with SSRIs (sertraline, escitalopram) and psychotherapy; mood stabilisers and low dose atypical antipsychotics for mania and psychosis, watching for extrapyramidal sensitivity.
- Support adherence through counselling, peer support and treating substance use (OST improves ART adherence).
- Address stigma, disclosure to partners and family, and social support.

## Conclusion
HIV and mental illness are closely intertwined. Psychiatrists should screen for cognitive and mood disorders, prescribe with attention to interactions, and support adherence and rights.`,
    keyPoints: ["Indian numbers and bidirectional link", "HAND three levels with subcortical pattern", "Depression, mania and psychosis", "Opportunistic infections causing delirium", "Efavirenz effects", "CYP3A4 interactions with ritonavir and carbamazepine", "HIV and AIDS Act 2017", "Adherence support"],
    visuals: [tree("HIV associated neurocognitive disorders", [["HAND", "Frascati criteria", -1], ["Asymptomatic impairment", "Test deficits only", 0], ["Mild neurocognitive disorder", "Mild daily impact", 0], ["HIV associated dementia", "Marked impairment, now rare", 0]])],
    module: "neurocognitive",
    ref: "Antinori 2007 Frascati criteria; NACO HIV estimates 2023; HIV and AIDS (Prevention and Control) Act 2017; Maudsley HIV prescribing",
  },
  {
    id: "cpsy-l05-007",
    subject: "clinical-psychiatry",
    topic: "psycho-oncology",
    marks: 10,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "Discuss the psychiatric problems of patients with cancer and describe how bad news should be broken.",
    plan: ["Distress and its screening", "Specific psychiatric disorders and causes", "Treatment: psychological and medicines with interactions", "Breaking bad news: SPIKES", "Indian issues: collusion and family", "Conclusion"],
    answer: `## Distress in cancer
About a third of people with cancer have significant distress. It peaks at diagnosis, recurrence, treatment failure and transition to palliative care. Screening with the Distress Thermometer (0 to 10, with a score of 4 or more prompting further assessment) is widely used.

## Psychiatric problems
- Adjustment disorders, the most common.
- Depression in about 15 to 20 percent, often missed because fatigue, poor appetite and weight loss are blamed on cancer; focus on psychological symptoms (hopelessness, guilt, loss of interest).
- Anxiety, including fear of recurrence and procedure related anxiety.
- Delirium, very common in advanced cancer.
- Demoralisation: hopelessness and loss of meaning with a sense of being trapped, described by David Kissane, distinct from depression.
- Suicide risk is raised, especially soon after diagnosis and in head and neck cancers.
Organic causes include brain metastases, steroids (mania, depression), chemotherapy (cognitive changes), hormonal treatments, hypercalcaemia, paraneoplastic syndromes and opioids.

## Treatment
Psychological:
- Supportive psychotherapy and psychoeducation.
- CBT for depression, anxiety and insomnia.
- Meaning centred psychotherapy (Breitbart), dignity therapy (Chochinov) and CALM (managing cancer and living meaningfully) for existential distress.
- Family and couple sessions.
Medicines:
- SSRIs (sertraline, escitalopram) or mirtazapine, which also helps appetite, sleep and nausea.
- In women on tamoxifen, avoid paroxetine and fluoxetine, which block CYP2D6 and reduce tamoxifen activation.
- Psychostimulants for fatigue and depression in advanced disease.
- Low dose antipsychotics for delirium; benzodiazepines for procedural anxiety.

## Breaking bad news: SPIKES
- Setting: private room, sit down, involve family as the patient wishes, allow time, switch off phones.
- Perception: ask what the patient already knows or suspects.
- Invitation: ask how much the patient wants to know.
- Knowledge: give a warning shot ("I am afraid the results are not good"), then information in small, clear pieces, without jargon.
- Emotions: respond to feelings with empathy; allow silence and tears.
- Strategy and summary: plan the next steps, check understanding, offer hope that is honest (control of symptoms, support), and arrange follow up.

## Indian issues
Families often ask doctors not to tell the patient the diagnosis ("collusion"), to protect them. A respectful approach explores the family's fears, explains the patient's right to information and its benefits for planning, and then asks the patient how much they wish to know. Cost of treatment, long travel to cancer centres, and stigma add distress. Palliative care services are growing but uneven.

## Conclusion
Psychiatric problems are common in cancer and treatable. Routine distress screening, careful treatment with attention to interactions, and skilled communication using SPIKES improve quality of life.`,
    keyPoints: ["Distress prevalence and Distress Thermometer", "Adjustment, depression, anxiety, delirium", "Demoralisation", "Organic causes including steroids", "Meaning centred and dignity therapy", "Tamoxifen and CYP2D6 interaction", "All six SPIKES steps", "Collusion in Indian families"],
    visuals: [chain("SPIKES", [["Setting", "Private, seated, time"], ["Perception", "What do you know so far?"], ["Invitation", "How much do you want to know?"], ["Knowledge", "Warning shot, small clear pieces"], ["Emotions", "Respond with empathy"], ["Strategy and summary", "Plan and follow up"]])],
    module: "therapies",
    ref: "Baile 2000 SPIKES; Mitchell 2011 meta-analysis depression in cancer; Kissane demoralisation; Breitbart meaning-centred; NCCN distress guideline",
  },
  {
    id: "cpsy-l05-008",
    subject: "clinical-psychiatry",
    topic: "nmdar-encephalitis",
    marks: 10,
    difficulty: 3,
    exams: ["md-psychiatry"],
    question: "Describe anti-NMDA receptor encephalitis. When should a psychiatrist suspect autoimmune encephalitis?",
    plan: ["Definition and discovery", "Who is affected and the tumour link", "Clinical stages", "Red flags for psychiatrists", "Investigations and treatment", "Outcome and conclusion"],
    answer: `## Definition and discovery
Anti NMDA receptor encephalitis is an autoimmune encephalitis caused by antibodies against the GluN1 subunit of the NMDA glutamate receptor. Josep Dalmau and colleagues described it in 2007. It is the commonest autoimmune encephalitis and an important cause of new onset psychosis in young people.

## Who is affected
Mostly young women and children. Ovarian teratoma is found in a significant proportion of adult women; the tumour contains nerve tissue that triggers the immune response. It can also follow herpes simplex encephalitis.

## Clinical stages
- Prodrome: fever, headache, flu like illness.
- Psychiatric stage: anxiety, insomnia, agitation, bizarre behaviour, mood changes, mania, delusions, hallucinations, catatonia, and short term memory loss. Many patients first reach psychiatric services.
- Neurological stage: seizures, decreased consciousness, mutism, orofacial and limb dyskinesias, autonomic instability (fluctuating blood pressure and heart rate, hyperthermia) and central hypoventilation needing ventilation.

## Red flags for psychiatrists
Suspect autoimmune encephalitis when psychosis or mania is:
- Of acute onset (days to weeks) without previous psychiatric history.
- Accompanied by seizures, dyskinesias, catatonia, decreased consciousness or autonomic instability.
- Associated with fever, headache or a viral prodrome.
- Unusually sensitive to antipsychotics (severe extrapyramidal effects or features like neuroleptic malignant syndrome).
- Associated with speech problems, confusion or memory loss.
- With abnormal CSF, EEG or MRI.

## Investigations
- CSF: lymphocytic pleocytosis, oligoclonal bands, and NMDA receptor antibodies (CSF testing is more sensitive than serum).
- EEG: abnormal in most patients; diffuse slowing, and the "extreme delta brush" pattern in some.
- MRI: often normal or with non specific changes.
- Search for teratoma: pelvic ultrasound, MRI or CT.
- Graus criteria allow a probable diagnosis before antibody results are back, so treatment is not delayed.

## Treatment
- First line immunotherapy: high dose steroids, intravenous immunoglobulin and or plasma exchange.
- Remove the tumour if present.
- Second line: rituximab and cyclophosphamide if no response.
- Supportive care in intensive care; benzodiazepines for catatonia and agitation; avoid high doses of antipsychotics; ECT has been used in refractory catatonia.

## Outcome
About 80 percent recover well, though recovery may take months to years, with residual cognitive and behavioural problems in some. About one in ten relapse. Early treatment predicts a better outcome.

## Conclusion
Anti NMDA receptor encephalitis is a treatable cause of acute psychosis. Psychiatrists should know the red flags and request CSF, EEG and antibody tests early.`,
    keyPoints: ["Antibodies to GluN1 subunit; Dalmau 2007", "Young women and ovarian teratoma", "Prodrome, psychiatric and neurological stages", "Red flags for psychiatrists", "CSF antibodies, EEG extreme delta brush, normal MRI", "Graus criteria", "Immunotherapy and tumour removal", "Outcome and relapse"],
    visuals: [timeline("Order the stages of anti NMDA receptor encephalitis", [["Flu like prodrome", "Days"], ["Psychiatric stage", "Anxiety, psychosis, catatonia"], ["Neurological stage", "Seizures, dyskinesias, autonomic instability"], ["Recovery with immunotherapy", "Months"]])],
    module: "neurocognitive",
    ref: "Dalmau 2007 Ann Neurol; Titulaer 2013 Lancet Neurol outcome; Graus 2016 criteria; Pollak 2020 autoimmune psychosis consensus",
  },
  {
    id: "cpsy-l05-009",
    subject: "clinical-psychiatry",
    topic: "wilson",
    marks: 5,
    difficulty: 2,
    exams: ["md-psychiatry"],
    question: "Write short notes on the psychiatric aspects of Wilson disease.",
    plan: ["Definition and genetics", "Clinical features with psychiatric presentations", "Investigations", "Treatment and psychiatric care"],
    answer: `## Definition and genetics
Wilson disease (hepatolenticular degeneration) is an autosomal recessive disorder of copper metabolism caused by mutations in the ATP7B gene on chromosome 13. Copper accumulates in the liver, brain (especially the basal ganglia) and cornea. It is relatively common in India, partly because of consanguineous marriages.

## Clinical features
- Usually presents between 5 and 35 years.
- Liver disease: hepatitis, cirrhosis, acute liver failure.
- Neurological: tremor (wing beating), dystonia, rigidity, dysarthria, drooling, ataxia.
- Psychiatric features occur in a large proportion and may be the first sign: personality change, irritability, impulsivity, disinhibition, declining school performance, depression, mania, psychosis and cognitive impairment.
- Kayser Fleischer rings (copper deposits in Descemet's membrane of the cornea), present in almost all with neurological disease.

## When to suspect it
Any young person with psychiatric symptoms plus movement disorder, liver disease, unexplained haemolysis, or unusual sensitivity to antipsychotics.

## Investigations
Low serum ceruloplasmin, raised 24 hour urinary copper, slit lamp examination for Kayser Fleischer rings, liver tests, MRI brain (basal ganglia changes, the "face of the giant panda" in the midbrain), genetic testing, and liver biopsy for copper content when needed.

## Treatment
- Chelation with penicillamine or trientine, and zinc to reduce absorption; lifelong treatment and a low copper diet.
- Neurological and psychiatric symptoms may worsen early in chelation.
- Liver transplantation for liver failure.
- Psychiatric symptoms: SSRIs for depression, mood stabilisers, and low dose atypical antipsychotics with caution because of extrapyramidal sensitivity and liver disease.
- Screen siblings.

## Conclusion
Wilson disease is a treatable cause of psychiatric illness in the young; a ceruloplasmin and slit lamp examination can save a life.`,
    keyPoints: ["Autosomal recessive ATP7B on chromosome 13", "Liver, neurological and psychiatric features", "Psychiatric features may come first", "Kayser Fleischer rings", "Ceruloplasmin and urinary copper", "Chelation and zinc; screen siblings"],
    module: "neurocognitive",
    ref: "Kaplan Wilson disease; Dening and Berrios 1989 psychiatric features; Indian Wilson disease series",
  },
  {
    id: "cpsy-l05-010",
    subject: "clinical-psychiatry",
    topic: "steroid-psychiatry",
    marks: 5,
    difficulty: 2,
    exams: ["md-psychiatry"],
    question: "Write short notes on corticosteroid induced psychiatric disorders.",
    plan: ["Frequency and dose relationship", "Clinical syndromes and timing", "Risk factors", "Prevention and management"],
    answer: `## Frequency and dose
Psychiatric effects are common with systemic corticosteroids. Mild changes (insomnia, restlessness, euphoria, irritability) affect many patients. Severe reactions are dose related: in a classic hospital study, they occurred in about 1 percent of patients on less than 40 mg of prednisolone a day, about 5 percent on 41 to 80 mg, and about 18 percent on more than 80 mg.

## Clinical syndromes and timing
- Mania or hypomania, the most common severe reaction, often in the first week or two of high dose treatment.
- Depression, more often with long term treatment and on withdrawal of steroids.
- Mixed states, psychosis, anxiety and panic.
- Delirium, especially in older people.
- Cognitive impairment (memory) with long term use.
- Withdrawal syndrome after stopping: fatigue, low mood, joint pains.

## Risk factors
High dose, female sex, previous steroid reaction, and medical conditions such as lupus. Previous psychiatric history is not a reliable predictor. Topical and inhaled steroids rarely cause problems.

## Prevention and management
- Use the lowest effective dose; ask about past reactions.
- Warn patients and families about sleep and mood changes.
- Reduce or stop the steroid where possible, in discussion with the treating doctor; never stop suddenly because of adrenal insufficiency.
- Mania and psychosis: low dose antipsychotics (olanzapine, quetiapine, risperidone); mood stabilisers; lithium has been used for prevention in people with previous reactions.
- Depression: SSRIs.
- Delirium: treat as delirium of any cause.

## Conclusion
Steroid induced psychiatric disorders are common, dose related and mostly reversible; a drug history should be part of every psychiatric assessment in medical patients.`,
    keyPoints: ["Common and dose related", "Dose bands and percentages", "Mania early, depression with long use and withdrawal", "Delirium and cognition", "Risk factors", "Dose reduction, antipsychotics and prevention"],
    module: "neurocognitive",
    ref: "Boston Collaborative Drug Surveillance Program 1972; Warrington and Bostwick 2006 review; Maudsley steroid psychiatric effects",
  },
]);
