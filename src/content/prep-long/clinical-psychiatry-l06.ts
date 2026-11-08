import type { LongQA } from "@/lib/prep/long-types";
import { chain, compare, cycle, layers, vis } from "./visual";

export const CLINICAL_PSYCHIATRY_L06: LongQA[] = [
  {
    id: "cpsy-l06-001",
    subject: "clinical-psychiatry",
    topic: "suicide-risk-assessment",
    marks: 20,
    difficulty: 3,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "A 26-year-old woman is brought to the emergency department after swallowing 30 tablets of paracetamol following a quarrel with her husband. Describe how you would assess her and plan management, and discuss the principles of suicide risk assessment.",
    plan: ["Medical priority first", "Psychiatric assessment: the act, intent, current state, history, risk and protective factors", "Principles and limits of risk assessment and scales", "Formulation of risk and needs", "Management: setting, safety plan, means, treatment, family, follow up", "Legal points in India and conclusion"],
    answer: `## Medical priority first
Paracetamol overdose can cause delayed, fatal liver failure even when the patient looks well. The emergency team should check the time of ingestion, measure paracetamol levels at four hours or later, check liver function, INR, renal function and glucose, and start acetylcysteine according to the treatment nomogram or immediately if the time or dose is uncertain. Psychiatric assessment proceeds alongside but does not delay treatment; if she refuses treatment, assess capacity urgently, and in an emergency treat under section 94 of the MHCA 2017 (emergency treatment for up to 72 hours) or under common law duty of care.

## Psychiatric assessment
Build rapport in a private space; interview her alone and then with family.

The act:
- Circumstances: the quarrel, what she hoped would happen, precipitants and recent stressors.
- Planning: impulsive or planned, how long she thought about it, whether she obtained tablets specially.
- Precautions against discovery (acting alone, choosing a time when no one would come) versus seeking help.
- Final acts: notes, messages, giving away possessions.
- Her belief about lethality (she may think paracetamol is harmless or very dangerous).
- Feelings now: relief at survival or regret that she survived.
The Beck Suicide Intent Scale structures these questions.

Current state:
- Ongoing suicidal ideas, plans, intent, and access to means at home.
- Hopelessness (the strongest psychological predictor), entrapment, guilt, shame.
- Mental status: depression, psychosis, intoxication, cognitive impairment.

Background:
- Past self harm and suicide attempts (the strongest predictor of future suicide).
- Psychiatric history: depression, bipolar disorder, alcohol or drug use, personality difficulties, trauma.
- Physical illness and chronic pain.
- Family history of suicide.
- Social: marital conflict, domestic violence (ask directly and privately), dowry harassment, in law relationships, finances, children, isolation, recent losses.
- Protective factors: children, family support, religious beliefs, future plans, engagement with care.

## Principles and limits of risk assessment
- Suicide is rare even in high risk groups, so prediction of individual suicide is poor. Risk scales and checklists (such as SAD PERSONS) have low positive predictive value; current guidance advises against using them to predict suicide or to decide who gets care.
- The purpose of assessment is to understand the person's needs and the factors that can be changed, and to plan care.
- Risk factors are static (sex, past attempts, family history) or dynamic (hopelessness, intoxication, access to means, conflict); management targets dynamic factors.
- Risk changes over time; reassess at transitions such as discharge.
- Every act of self harm should be taken seriously, whatever its apparent lethality.
- The Columbia Suicide Severity Rating Scale can document ideation and behaviour consistently.

| Domain | Questions |
| Ideation | Thoughts of death or suicide, frequency, intensity |
| Plan | Method, place, time, preparations |
| Intent | How much she means to act |
| Means | Access to medicines, pesticides, ropes |
| Protective factors | Children, beliefs, support, reasons for living |

## Formulation
For example: "A young woman with an impulsive overdose in the context of marital conflict, possible depressive symptoms and no previous attempts. She now regrets the act, has supportive parents and young children, but faces continuing conflict and possible domestic violence. Risk is raised in the short term and depends on the home situation, mood and access to medicines."

## Management
Setting:
- Admit if there is ongoing intent, severe depression or psychosis, no safe place to go, or domestic violence with danger. Independent admission (section 85) if she agrees; supported admission (section 89) if she lacks capacity and criteria are met.
- Otherwise discharge with a plan, a safe person and early follow up.

Safety plan (Stanley and Brown):
- Warning signs and triggers.
- Internal coping strategies.
- People and places that distract and support.
- People to ask for help.
- Professional and crisis contacts, including Tele MANAS (14416).
- Making the environment safe: remove stored medicines, pesticides and other means; family to hold medicines.

Treatment:
- Treat depression (an SSRI, dispensed in limited quantities), alcohol use or other disorders.
- Brief psychological interventions: problem solving, CBT for suicidal behaviour, and couple or family sessions once safe.
- Address domestic violence: safety planning, information about the Protection of Women from Domestic Violence Act 2005, protection officers and helplines.
- Medicines with anti suicide evidence in specific conditions: lithium in mood disorders, clozapine in schizophrenia; ECT in severe depression with high risk.

Follow up:
- Contact within 48 to 72 hours of discharge; the first weeks after discharge are the highest risk period.
- Brief contact interventions (phone calls, letters, messages) reduce repeat attempts.

## Legal points in India
- Attempted suicide is treated as a medico legal case in emergency departments, but section 115 of the MHCA 2017 presumes severe stress and bars prosecution, and directs the government to provide care, treatment and rehabilitation. The Bharatiya Nyaya Sanhita 2023 does not include the old general offence of attempted suicide.
- Confidentiality must be respected, with sharing limited to what is needed for safety.

## Conclusion
A suicide attempt needs urgent medical treatment, a careful, compassionate assessment of intent, mental state and circumstances, and a needs based plan that includes safety planning, means restriction, treatment of mental illness, support for social problems such as domestic violence, and early follow up. Risk cannot be predicted precisely, so the aim is to understand and reduce it.`,
    keyPoints: ["Medical priority with paracetamol levels and acetylcysteine", "Capacity and MHCA section 94 if refusing", "Assessment of the act with intent features", "Past attempts and hopelessness as key factors", "Limits of risk scales and needs based approach", "Static versus dynamic factors", "Safety plan components and means restriction", "Follow up within 48 to 72 hours; MHCA section 115 and domestic violence law"],
    pitfalls: ["Delaying medical treatment for psychiatric assessment", "Relying on a risk score", "Not asking about domestic violence", "No follow up plan"],
    visuals: [
      chain("Safety plan steps", [["Warning signs", "What tells me a crisis is starting"], ["My own coping", "What I can do alone"], ["People and places", "Distraction and company"], ["People to ask for help", "Named family or friends"], ["Professionals and helplines", "Clinic, Tele MANAS 14416"], ["Make the home safe", "Medicines and pesticides away"]]),
      layers("Risk factors over time", "stack", [["Dynamic: changeable now", "Hopelessness, intoxication, conflict, access to means"], ["Static: fixed", "Past attempts, sex, family history"]], "Management targets the dynamic layer."),
    ],
    module: "suicide",
    ref: "NICE NG225 self-harm 2022; Stanley and Brown 2012 safety planning; Beck Suicide Intent Scale; MHCA 2017 s85, s89, s94, s115; PWDVA 2005; Fleischmann 2008 WHO SUPRE-MISS brief contact",
  },
  {
    id: "cpsy-l06-002",
    subject: "clinical-psychiatry",
    topic: "rapid-tranquillisation",
    marks: 10,
    difficulty: 2,
    exams: ["md-psychiatry"],
    question: "How would you manage an acutely agitated and violent patient? Discuss rapid tranquillisation and the legal safeguards on restraint in India.",
    plan: ["Assess causes and risk", "De-escalation", "Rapid tranquillisation: oral then intramuscular options with doses", "Monitoring and complications", "Restraint under MHCA section 97", "Conclusion"],
    answer: `## Assess causes and risk
Agitation may be due to psychosis, mania, intoxication or withdrawal, delirium, hypoglycaemia, head injury, hypoxia, pain, dementia, personality factors or situational anger. A quick history from staff and family, a look for medical red flags, and blood glucose should come early. Ensure the safety of the patient, staff and others; summon help.

## De-escalation
- Approach calmly with enough staff, keeping a safe distance and an exit.
- One person speaks, using a low voice, short sentences, the patient's name, and open posture.
- Listen, acknowledge feelings, offer choices and something to eat or drink.
- Reduce stimulation: move to a quiet room, ask onlookers to leave.
- Address the immediate cause (for example a refused phone call or pain).
Most agitated patients can be calmed without medicines or force.

## Rapid tranquillisation
The aim is calm, not sedation to sleep.
Oral first:
- Lorazepam 1 to 2 mg, or promethazine 25 to 50 mg.
- Olanzapine 10 mg or risperidone 2 mg if psychosis is known.
- Haloperidol 5 mg with promethazine 25 to 50 mg.
Intramuscular if oral is refused or ineffective:
- Lorazepam 1 to 2 mg (or midazolam where used).
- Haloperidol 5 mg with promethazine 50 mg: this combination was effective and safe in the TREC trials in Brazil and India.
- Olanzapine 10 mg intramuscularly; do not give within an hour of intramuscular lorazepam because of respiratory and cardiovascular depression.
- Repeat after 30 to 60 minutes if needed, within maximum daily doses.
Choose according to cause: benzodiazepines for stimulant intoxication and alcohol withdrawal, avoid antipsychotics where neuroleptic malignant syndrome or Lewy body dementia is possible, and take an ECG before haloperidol when possible.

## Monitoring and complications
- Vital signs (pulse, blood pressure, temperature, respiratory rate, oxygen saturation, level of consciousness) every 15 minutes for the first hour, then hourly until the patient is ambulant.
- Complications: respiratory depression (flumazenil for benzodiazepines), hypotension, acute dystonia (procyclidine or promethazine), QTc prolongation and arrhythmia, neuroleptic malignant syndrome, aspiration.
- Review afterwards with patient and staff.

## Restraint under the MHCA 2017 (section 97)
- Physical restraint may be used only when it is the only means to prevent imminent and immediate harm to the person or others.
- It must be authorised by the psychiatrist in charge, for no longer than necessary, and not as punishment or because of staff shortage.
- The person must be kept in a place where they can be seen and cared for, and the nominated representative informed within 24 hours.
- Each instance must be recorded in the medical notes, and the establishment must report restraint to the Mental Health Review Board every month.
- Seclusion and solitary confinement are not permitted.
Chaining, which still occurs at some faith healing sites, is illegal.

## Conclusion
Acute agitation is managed by finding the cause, de-escalation, and, when needed, rapid tranquillisation with careful monitoring. Restraint is a last resort governed by strict legal safeguards in India.`,
    keyPoints: ["Medical causes and glucose check", "De-escalation techniques", "Oral before intramuscular", "Named regimens with doses including haloperidol with promethazine", "Olanzapine and lorazepam IM interval", "Monitoring every 15 minutes and complications", "MHCA section 97 safeguards", "Seclusion and chaining prohibited"],
    visuals: [chain("Stepwise response to agitation", [["Assess cause and safety", "Glucose, intoxication, delirium"], ["De-escalate", "Calm talk, choices, quiet room"], ["Oral medicine", "Lorazepam, promethazine or antipsychotic"], ["Intramuscular medicine", "Lorazepam or haloperidol with promethazine"], ["Monitor", "Every 15 minutes for the first hour"]])],
    module: "suicide",
    ref: "NICE NG10 violence and aggression; TREC Collaborative Group 2003 BMJ, Alexander 2004 TREC-India; Maudsley rapid tranquillisation; MHCA 2017 s97",
  },
  {
    id: "cpsy-l06-003",
    subject: "clinical-psychiatry",
    topic: "nms",
    marks: 10,
    difficulty: 2,
    exams: ["md-psychiatry"],
    question: "Discuss neuroleptic malignant syndrome: clinical features, risk factors, differential diagnosis and management.",
    plan: ["Definition and incidence", "Clinical features and laboratory findings", "Risk factors and mechanism", "Differential diagnosis including serotonin syndrome", "Management and rechallenge", "Conclusion"],
    answer: `## Definition and incidence
Neuroleptic malignant syndrome (NMS) is a rare, potentially fatal reaction to dopamine blocking drugs (and to sudden withdrawal of dopamine agonists such as levodopa). It occurs in roughly 0.01 to 0.02 percent of patients on antipsychotics, usually within the first two weeks of starting or increasing a drug, though it can occur at any time. Mortality is now about 5 to 10 percent.

## Clinical features
- Hyperthermia (fever above 38 degrees, often much higher).
- Severe "lead pipe" muscle rigidity, sometimes tremor.
- Altered consciousness: confusion, stupor, mutism.
- Autonomic instability: tachycardia, labile blood pressure, sweating, incontinence.
Features usually develop over one to three days.

Laboratory findings:
- Raised creatine kinase (often above 1000 units per litre).
- Raised white cell count.
- Myoglobinuria with risk of acute kidney injury.
- Low serum iron, raised liver enzymes, electrolyte disturbance, metabolic acidosis.

## Risk factors and mechanism
- High potency typical antipsychotics, high doses, rapid dose increases, intramuscular and depot preparations; but all antipsychotics, including clozapine and atypicals, can cause it.
- Dehydration, exhaustion, agitation, catatonia, physical restraint, hot weather.
- Previous NMS, organic brain disease, lithium combination, iron deficiency.
- Mechanism: sudden blockade of D2 receptors in the hypothalamus (thermoregulation), nigrostriatal pathway (rigidity) and spinal cord, with muscle breakdown. Many regard it as a drug induced form of malignant catatonia.

## Differential diagnosis
| Condition | Distinguishing points |
| Serotonin syndrome | Serotonergic drugs, onset within hours, clonus and hyperreflexia, dilated pupils, diarrhoea |
| Malignant catatonia | Catatonic signs before antipsychotics; overlapping features |
| Infection (meningitis, encephalitis, sepsis) | Neck stiffness, CSF findings, source of infection |
| Heat stroke | Dry skin, no rigidity, high environmental heat |
| Anticholinergic toxicity | Dry hot skin, dilated pupils, urinary retention, no rigidity |
| Malignant hyperthermia | During anaesthesia with volatile agents or suxamethonium |
| Stimulant intoxication, alcohol or benzodiazepine withdrawal | History, different signs |

## Management
- Stop all antipsychotics and other dopamine blocking drugs (including metoclopramide); restart dopamine agonists if withdrawn.
- Transfer to a medical or intensive care unit.
- Supportive care: cooling, intravenous fluids, electrolyte correction, prevention of renal failure, deep vein thrombosis prophylaxis, airway protection.
- Benzodiazepines (lorazepam) for agitation and rigidity, particularly with catatonic features.
- Bromocriptine (a dopamine agonist) and dantrolene (a muscle relaxant) in moderate to severe cases, although trial evidence is limited.
- ECT for cases not responding, or when catatonia or psychosis continues.

## Rechallenge
Wait at least two weeks after full recovery. Use a low potency or atypical antipsychotic (not the drug that caused it), start at a low dose, increase slowly, keep the patient well hydrated, and monitor temperature, CK and vital signs. Most patients can be safely restarted.

## Conclusion
NMS is a rare emergency marked by fever, rigidity, confusion and autonomic instability with raised CK. Early recognition, stopping the antipsychotic and intensive supportive care save lives.`,
    keyPoints: ["Incidence and timing", "Four core clinical features", "Raised CK, leucocytosis, myoglobinuria, low iron", "Risk factors including dehydration and rapid escalation", "Differential table with serotonin syndrome", "Stop antipsychotic and supportive care in ICU", "Benzodiazepines, bromocriptine, dantrolene, ECT", "Rechallenge after two weeks"],
    visuals: [vis("pathways", { system: "dopamine", caption: "Block D2 in the nigrostriatal and hypothalamic pathways: rigidity and loss of temperature control are the core of NMS." })],
    module: "antipsychotics",
    ref: "Maudsley NMS; Strawn 2007 NMS review; DSM-5-TR medication induced movement disorders; Gurrera 2011 diagnostic criteria",
  },
  {
    id: "cpsy-l06-004",
    subject: "clinical-psychiatry",
    topic: "serotonin-syndrome",
    marks: 10,
    difficulty: 2,
    exams: ["md-psychiatry"],
    question: "Describe the causes, clinical features, diagnosis and management of serotonin syndrome, and how it differs from neuroleptic malignant syndrome.",
    plan: ["Definition and causes", "Clinical triad and Hunter criteria", "Contrast with NMS", "Management"],
    answer: `## Definition and causes
Serotonin syndrome (serotonin toxicity) is a potentially life threatening condition caused by excess serotonin activity in the central and peripheral nervous system. It usually follows a combination of serotonergic drugs, a dose increase or an overdose. Dangerous combinations include MAOIs with SSRIs, SNRIs, clomipramine, tramadol, pethidine or dextromethorphan; SSRIs with linezolid or methylene blue (which are MAO inhibitors); and drugs of misuse such as MDMA.

## Clinical features
The triad:
- Neuromuscular excitation: tremor, clonus (inducible, spontaneous, ocular), hyperreflexia, hypertonia, worst in the legs.
- Autonomic instability: tachycardia, sweating, fever, dilated pupils, diarrhoea, flushing.
- Mental state changes: agitation, anxiety, confusion.
Onset is usually within hours (most within 24 hours) of the change in medicines.

The Hunter criteria (in a person taking a serotonergic agent) need one of: spontaneous clonus; inducible clonus with agitation or sweating; ocular clonus with agitation or sweating; tremor with hyperreflexia; or hypertonia with temperature above 38 degrees and ocular or inducible clonus.

## Contrast with NMS
| Feature | Serotonin syndrome | NMS |
| Drug | Serotonergic | Dopamine blocker |
| Onset | Hours | Days |
| Muscles | Clonus, hyperreflexia | Lead pipe rigidity, slow reflexes |
| Pupils | Dilated | Normal |
| Gut | Diarrhoea, increased bowel sounds | Normal or reduced |
| Resolution | Usually within 24 to 72 hours | Days to two weeks |

## Management
- Stop all serotonergic drugs.
- Supportive care, intravenous fluids, cooling, monitoring.
- Benzodiazepines for agitation and muscle activity.
- Cyproheptadine, a 5 HT2A antagonist (12 mg initially, then 2 mg every two hours as needed), in moderate cases.
- Severe cases with high fever need intensive care, sedation, paralysis and ventilation; antipyretics do not help because the heat comes from muscle activity. Avoid physical restraint.
- Respect washout periods when switching (for example, five weeks after fluoxetine before starting an MAOI).

## Conclusion
Serotonin syndrome is a predictable, preventable toxicity of serotonergic drug combinations; clonus is its hallmark and stopping the drugs with supportive care usually leads to rapid recovery.`,
    keyPoints: ["Causes and dangerous combinations including linezolid and tramadol", "Triad of features", "Hunter criteria", "Onset within hours", "Contrast table with NMS", "Cyproheptadine and benzodiazepines; washout periods"],
    module: "antidepressants",
    ref: "Boyer and Shannon 2005 NEJM; Dunkley 2003 Hunter criteria; Maudsley serotonin syndrome",
  },
  {
    id: "cpsy-l06-005",
    subject: "clinical-psychiatry",
    topic: "aluminium-phosphide",
    marks: 10,
    difficulty: 2,
    exams: ["md-psychiatry"],
    question: "Discuss pesticide poisoning as a method of suicide in India and the role of the psychiatrist in its management and prevention.",
    plan: ["Size of the problem", "Organophosphates and aluminium phosphide", "Psychiatrist's role", "Prevention through means restriction"],
    answer: `## Size of the problem
Pesticide ingestion is one of the most common methods of suicide in rural India and much of Asia, and causes a large share of deaths because many pesticides are highly toxic and medical care is far away. Most acts are impulsive, often after a quarrel, using pesticides kept at home.

## Common poisons
- Organophosphates (and carbamates): inhibit acetylcholinesterase, causing a cholinergic crisis: small pupils, sweating, salivation, bronchorrhoea, bradycardia, vomiting, diarrhoea, muscle twitching and weakness, and coma. Treated with atropine titrated to dry chest and pulse, oxygen and intensive care; pralidoxime has uncertain benefit. An "intermediate syndrome" of muscle weakness can appear one to four days later.
- Aluminium phosphide (rice or grain tablets such as "celphos"): releases phosphine gas, causing severe shock, heart damage and acidosis, with very high mortality and no specific antidote. It is especially common in Punjab, Haryana and Uttar Pradesh.
- Paraquat: lung fibrosis, nearly always fatal; now banned or restricted in many countries.

## The psychiatrist's role
- Assess once medically stable: intent, mental state, alcohol use, conflict and stressors, and capacity to consent to treatment.
- Recognise that many survivors had no long standing mental illness but an acute crisis; others have depression or alcohol dependence.
- Safety planning with the family, especially removal and locked storage of pesticides.
- Treatment of mental illness and follow up; family therapy where conflict is central.
- Train medical staff in non judgemental care; note that under section 115 of the MHCA 2017 the person is presumed to be under severe stress and is not to be punished.

## Prevention through means restriction
Banning the most hazardous pesticides is among the most effective suicide prevention measures: in Sri Lanka, bans cut suicide rates sharply without hurting farm output. India has banned several highly hazardous pesticides, and locked storage boxes and community storage have been tried. The National Suicide Prevention Strategy includes means restriction.

## Conclusion
Pesticide poisoning is a major cause of suicide in India; good medical care, psychiatric follow up and restriction of access to hazardous pesticides save lives.`,
    keyPoints: ["Common, impulsive, rural method", "Organophosphate features and atropine", "Aluminium phosphide with no antidote and high mortality", "Assessment after stabilisation and capacity", "Locked storage and family safety plan", "Pesticide bans as prevention; Sri Lanka example"],
    module: "suicide",
    ref: "Gunnell 2017 Lancet Glob Health pesticide bans; Eddleston 2008 organophosphate management; National Suicide Prevention Strategy 2022",
  },
  {
    id: "cpsy-l06-006",
    subject: "clinical-psychiatry",
    topic: "violence-risk",
    marks: 5,
    difficulty: 3,
    exams: ["md-psychiatry"],
    question: "Write short notes on structured assessment of violence risk, with reference to the HCR-20.",
    plan: ["Three approaches to risk assessment", "HCR-20 structure", "Other tools", "Uses and limits"],
    answer: `## Approaches
- Unstructured clinical judgement: flexible but inconsistent and prone to bias.
- Actuarial tools (such as the Violence Risk Appraisal Guide): statistical formulas based on mostly static factors; consistent, but they say little about how to reduce risk and may not apply to a given person or culture.
- Structured professional judgement (SPJ): the clinician considers a set list of evidence based factors and then makes a judgement and a management plan. The HCR-20 is the most widely used SPJ tool.

## HCR-20 (version 3)
Twenty items in three scales:
- Historical (10): history of violence, other antisocial behaviour, relationship problems, employment problems, substance use, major mental disorder, personality disorder, traumatic experiences, violent attitudes, and treatment or supervision response.
- Clinical (5, recent): lack of insight, violent ideation or intent, symptoms of major mental disorder, instability, and poor treatment response.
- Risk management (5, future): professional services and plans, living situation, personal support, treatment or supervision response, and stress or coping.
The assessor then writes risk scenarios (what violence might happen, to whom, when) and a management plan, and rates risk as low, moderate or high.

## Other tools
The Psychopathy Checklist Revised (often used alongside), START (strengths and vulnerabilities), and the Brøset Violence Checklist for short term ward risk.

## Uses and limits
Useful in forensic services, discharge planning and court reports. Accuracy is moderate at best; tools need training, should support rather than replace judgement, and have limited validation in India. Risk must be reviewed as circumstances change, and it should not be used to justify restrictions beyond what the law allows.

## Conclusion
The HCR-20 structures violence risk assessment around historical, clinical and risk management factors and leads to a management plan, which is its main value.`,
    keyPoints: ["Clinical, actuarial and SPJ approaches", "HCR-20 has 20 items in three scales", "Examples of H, C and R items", "Scenario planning and management plan", "Other tools", "Moderate accuracy and limited Indian validation"],
    module: "ethics-law",
    ref: "Douglas 2013 HCR-20 V3; Fazel 2012 BMJ risk tools meta-analysis",
  },
  {
    id: "cpsy-l06-007",
    subject: "clinical-psychiatry",
    topic: "adolescent-self-harm",
    marks: 10,
    difficulty: 3,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "Discuss the assessment and management of self-harm in adolescents.",
    plan: ["Definitions and size of the problem including Indian students", "Causes and functions of self harm", "Assessment of the adolescent and family", "Management: safety, therapy, medicines, school, protection", "Conclusion"],
    answer: `## Definitions and size of the problem
Self harm in adolescents includes non suicidal self injury (NSSI), such as cutting or burning without intent to die, and suicide attempts. DSM-5-TR lists NSSI as a condition for further study (self injury on five or more days in the past year). About one in six adolescents worldwide report NSSI at some time. In India, suicide is a leading cause of death among young people, and student suicides number over 13,000 a year in national crime records, with examination pressure, family conflict and relationship problems commonly cited.

## Causes and functions
- Emotion regulation: relief from overwhelming feelings, numbness or anger; this is the most common function.
- Self punishment, communication of distress, influence on others, and escape from situations.
- Risk factors: depression, anxiety, eating disorders, substance use, ADHD, emerging borderline traits; bullying and cyberbullying; abuse (including sexual abuse); family conflict, harsh parenting, parental mental illness; academic pressure; LGBTQ identity with rejection; social media exposure to self harm content; exposure to suicide of others.
- NSSI is a strong predictor of later suicide attempts, so it is not "just attention seeking".

## Assessment
- Medical assessment of wounds and overdoses first.
- Interview the adolescent alone, with clear limits of confidentiality explained, and then with parents.
- The HEADSS framework covers home, education, activities, drugs, sexuality and suicide.
- Characteristics of the self harm: method, frequency, intent, functions, triggers, concealment.
- Mental state and diagnoses, risk and protective factors, family functioning, school, online life.
- Ask about abuse; under the POCSO Act 2012, sexual offences against children must be reported to the police or the Special Juvenile Police Unit.

## Management
- Safety planning with the adolescent and family; removal of means (medicines, sharp objects); supervision during crises.
- Psychoeducation for parents: respond calmly, avoid punishment and shaming, keep communication open.
- Psychological therapies: DBT for adolescents (DBT-A), which has the best evidence for reducing repeated self harm, mentalisation based treatment for adolescents, family therapy and CBT for depression.
- Medicines: treat depression with fluoxetine (or escitalopram), with close monitoring for increased suicidal thinking in the first weeks; dispense small amounts.
- School: work with teachers and counsellors on bullying and academic stress; school mental health programmes under the Ayushman Bharat school health initiative.
- Follow up closely, especially after an attempt.
- Online safety: discuss harmful content and support healthy use.

## Conclusion
Self harm in adolescents is common, serious and often a way of coping with intense emotion. Careful, confidential assessment, family involvement, safety planning and evidence based therapies such as DBT-A reduce repetition and risk.`,
    keyPoints: ["NSSI versus suicide attempt", "Prevalence and Indian student suicides", "Emotion regulation function", "Risk factors including abuse and bullying", "Confidential assessment with HEADSS", "POCSO reporting duty", "DBT-A and family work", "Fluoxetine with monitoring and school collaboration"],
    visuals: [cycle("Why self harm continues", [["Overwhelming emotion", ""], ["Self harm", "Cutting, burning"], ["Quick relief", "Negative reinforcement"], ["Shame and secrecy", "No new coping learned"], ["Next crisis", "Urge returns"]])],
    module: "suicide",
    ref: "Gillies 2018 NSSI prevalence; McCauley 2018 DBT-A trial; NCRB ADSI 2022 student suicides; POCSO Act 2012 s19; NICE NG225",
  },
  {
    id: "cpsy-l06-008",
    subject: "clinical-psychiatry",
    topic: "psychological-autopsy",
    marks: 5,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "Write short notes on the psychological autopsy method.",
    plan: ["Definition and origin", "Method", "Main findings including India", "Strengths and limits"],
    answer: `## Definition and origin
A psychological autopsy is a retrospective investigation of a person who died by suicide (or an uncertain death), reconstructing their psychological, social and medical circumstances to understand why the death occurred. Edwin Shneidman and colleagues at the Los Angeles Suicide Prevention Center developed it in the 1950s to help coroners decide the mode of death.

## Method
- Structured or semi structured interviews with relatives, friends and others who knew the person, usually two to six months after death.
- Review of medical, psychiatric, police, school or work records and suicide notes.
- Assessment of mental disorders using diagnostic interviews adapted for informants, life events, substance use, physical illness and help seeking.
- Comparison with living or deceased controls in case control designs.

## Main findings
Western studies found that about 90 percent of people who died by suicide had a diagnosable mental disorder, most often depression, substance use and personality disorders. A case control study from Chennai also found a high rate of mental disorder, but Indian and other Asian studies generally report lower rates and give more weight to interpersonal conflict, marital problems, financial stress and impulsive acts, especially in rural areas and among young women.

## Strengths and limits
- Strengths: the only way to study people who died; identifies risk factors and missed opportunities for prevention.
- Limits: recall bias and grief of informants, hindsight bias, informants may not know about hidden symptoms, diagnoses are made by proxy, and cultural stigma may lead to concealment.

## Conclusion
The psychological autopsy is a key method in suicide research and prevention planning; its findings must be interpreted with care and in cultural context.`,
    keyPoints: ["Definition", "Shneidman and the 1950s origin", "Informant interviews and records", "About 90 percent with mental disorder in Western studies", "Indian studies emphasise social factors", "Recall and hindsight bias"],
    module: "suicide",
    ref: "Shneidman 1981; Cavanagh 2003 systematic review; Vijayakumar and Rajkumar 1999 Chennai psychological autopsy",
  },
  {
    id: "cpsy-l06-009",
    subject: "clinical-psychiatry",
    topic: "acute-dystonia",
    marks: 5,
    difficulty: 1,
    exams: ["md-psychiatry"],
    question: "Write short notes on acute dystonia and akathisia.",
    plan: ["Acute dystonia features, risk and treatment", "Akathisia features, assessment and treatment", "Prevention", "Conclusion"],
    answer: `## Acute dystonia
- Sudden, sustained, often painful muscle spasms caused by dopamine blocking drugs, usually within hours to a few days of starting or increasing the dose.
- Forms: oculogyric crisis (eyes rolled up), torticollis, tongue protrusion, trismus, opisthotonus, and laryngeal dystonia, which can obstruct breathing.
- Risk factors: young men, high potency antipsychotics (haloperidol), intramuscular use, antiemetics (metoclopramide), cocaine use.
- Treatment: intramuscular or intravenous anticholinergic (procyclidine 5 to 10 mg, benztropine) or promethazine; relief within minutes. Continue an oral anticholinergic for a few days, and review the antipsychotic dose or choice. Laryngeal dystonia is an emergency.

## Akathisia
- An unpleasant inner restlessness with an urge to move: shifting from foot to foot, pacing, being unable to sit still.
- Occurs within days to weeks of starting or increasing antipsychotics (also with SSRIs).
- Often mistaken for anxiety or worsening psychosis, which leads to dose increases that make it worse.
- Linked to distress, poor adherence, aggression and suicidal behaviour.
- Assessment: the Barnes Akathisia Rating Scale rates objective and subjective features.
- Treatment: reduce the dose or switch to a drug with lower risk (quetiapine, olanzapine, clozapine); propranolol (10 to 40 mg two or three times a day) or low dose mirtazapine (15 mg); short term benzodiazepines. Anticholinergics are less useful.

## Prevention
Start low and increase slowly, avoid high potency drugs in high risk patients, and consider short term prophylactic anticholinergics when giving intramuscular haloperidol to young men.

## Conclusion
Acute dystonia and akathisia are common, distressing early side effects; prompt recognition and treatment protect safety and adherence.`,
    keyPoints: ["Dystonia timing and forms", "Laryngeal dystonia emergency", "Risk factors", "Anticholinergic treatment", "Akathisia features and misdiagnosis", "Barnes scale and propranolol or mirtazapine"],
    module: "antipsychotics",
    ref: "Maudsley extrapyramidal side effects; Barnes 1989 BARS; Stahl prescriber's guide propranolol for akathisia",
  },
  {
    id: "cpsy-l06-010",
    subject: "clinical-psychiatry",
    topic: "bpd-crisis",
    marks: 10,
    difficulty: 3,
    exams: ["md-psychiatry"],
    question: "A 22-year-old woman with borderline personality disorder presents to the emergency department for the fourth time this month after cutting her forearm. How would you manage her?",
    plan: ["Initial priorities and attitude", "Assessment in the crisis", "Crisis management and admission decisions", "Longer term plan", "Team and staff issues; conclusion"],
    answer: `## Initial priorities and attitude
- Treat the wounds respectfully, with adequate pain relief, without moralising. Negative staff attitudes ("attention seeking", "manipulative") increase shame and repeat self harm.
- Offer a calm, private space and a consistent clinician.

## Assessment in the crisis
- What triggered this episode (often perceived rejection, conflict, abandonment), what she felt, and what the cutting did for her (relief, punishment, communication).
- Current suicidal ideas, intent and plans; whether this episode differs from her usual pattern (a change in method or lethality is a warning sign).
- Comorbid depression, substance use, eating disorder, PTSD, psychosis like experiences under stress.
- Social situation: relationships, housing, work, recent losses, abuse.
- Her existing care plan and crisis plan, if any; contact with her regular team.

## Crisis management
- Validate her emotional pain while focusing on solutions: "That sounds unbearable. What has helped even a little before?"
- Help her use coping skills (DBT distress tolerance: cold water, intense exercise, paced breathing, distraction).
- Collaborative safety plan, with means reduction and people to contact.
- Admission: brief, planned, goal directed admissions (a few days) can help in a severe crisis or when suicide risk is clearly raised; long or repeated admissions often worsen self harm and dependence on the ward. Decide with her, document the reasons, and agree goals and duration.
- Medicines: avoid starting new drugs in a crisis; if needed for severe distress, short term sedating antihistamines (promethazine) rather than benzodiazepines; avoid large prescriptions because of overdose risk.

## Longer term plan
- Ensure follow up with a community team and a named care coordinator.
- Offer a structured specialist psychotherapy: dialectical behaviour therapy, mentalisation based treatment, schema therapy or good psychiatric management, which reduce self harm and emergency visits.
- A written crisis plan shared with her, her family and the emergency department, setting out what helps and what to expect.
- Treat comorbid conditions; review medicines, aiming to reduce polypharmacy.
- Psychoeducation for family on BPD and on validating responses.

## Team and staff issues
Repeated presentations can cause frustration, splitting (some staff idealised, others devalued) and burnout. Regular team meetings, supervision and a consistent shared plan help staff respond with warmth and boundaries.

## Conclusion
Repeated self harm in BPD needs compassionate emergency care, careful assessment of changing risk, brief and purposeful crisis interventions, and a clear pathway to specialist psychotherapy, supported by a consistent team.`,
    keyPoints: ["Non judgemental wound care with pain relief", "Assess triggers, functions and change in pattern", "Validation and distress tolerance skills", "Brief planned admission only when needed", "Avoid new medicines and benzodiazepines in crisis", "Specialist psychotherapy referral", "Shared written crisis plan", "Staff splitting and supervision"],
    visuals: [compare("Helpful and unhelpful crisis responses", ["Helpful", ["Calm validation", "Brief, goal directed admission if needed", "Shared crisis plan", "Referral to DBT or MBT"], "Reduces repeat self harm"], ["Unhelpful", ["Labelling as attention seeking", "Long, unplanned admissions", "New sedatives in every crisis", "No follow up"], "Increases shame and repetition"])],
    module: "personality",
    ref: "NICE CG78 BPD; Gunderson good psychiatric management; Linehan DBT; NICE NG225 self-harm",
  },
];
