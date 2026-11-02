import { act } from "@/lib/study/activities";
import type { ModuleMeta } from "@/lib/study/types";

export const meta: ModuleMeta = {
  id: "case-sheet",
  num: 22,
  title: "Writing the case sheet and formulation",
  emoji: "📝",
  tagline: "Turn an interview into a clear, clinical, defensible record, with a full worked example",
  when: "Weeks 15 to 16",
  outcomes: [
    "Write each part of a psychiatric case sheet in clinical language",
    "Turn patients' words into precise terms without losing their voice",
    "Write a 5P formulation and a differential diagnosis",
    "Write a biopsychosocial management plan and progress notes",
    "Document risk, consent and confidentiality properly",
  ],
  writeTask:
    "Pick a patient you've seen (or the worked example) and write the whole case sheet on paper: chief complaints with durations, HPI, past, family, personal, premorbid personality, MSE in eight headings, a 5P formulation, differential diagnosis and a biopsychosocial plan. Then compare with the worked example and correct in red.",
  activities: [
    act.terms("Say it clinically", "Everyday words into case-sheet language."),
    act.scenarios("casesheet", "Patient case: writing it up", "Choosing the right words for the record."),
    act.lesson("cs-1", "Case files: clinic morning", "Short cases to formulate."),
    act.lesson("mse-2", "Quiz: describe it right", "Descriptions, not labels."),
  ],
  noteId: "casesheet",
};

export const text = String.raw`
# Part I · Principles

## 1.1 What a good case sheet does [core]
A case sheet is a **clinical record and a legal document**. It should let another clinician understand the patient, see how you reached your conclusions, and continue care safely.

| Principle | In practice |
|---|---|
| **Describe, don't label** | “Spends 3 hours washing hands daily” not “OCD +” |
| **Quote the patient** | Chief complaints, mood and delusions in their words (with translation) |
| **Record negatives** | “No history of substance use, head injury or seizures” |
| **Separate sources** | Patient's account vs informant's account; note reliability |
| **Be specific** | Durations, frequencies, doses, dates, test results |
| **Be respectful** | No judgemental words (“manipulative”, “attention-seeking”, “non-compliant” → “has not been taking the medicine because of side effects”) |
| **Document risk and consent** | Every assessment |
| **Sign, date, time** | Legible, with your name and role |

### Lay words to clinical terms
| Patient or family says | Write |
|---|---|
| “Mann nahi lagta” | Anhedonia; reduced interest |
| “Neend nahi aati, 3 baje uth jaata hoon” | Insomnia with early morning awakening |
| “Bhookh nahi lagti, 5 kilo kam ho gaya” | Reduced appetite with weight loss of 5 kg over 2 months |
| “Ghabrahat, dil zor se dhadakta hai” | Episodic anxiety with palpitations |
| “Akele mein baatein karta hai” | Muttering to self (hallucinatory behaviour) |
| “Sab use maarna chahte hain” | Persecutory ideas (assess for delusion) |
| “Bahut gussa karta hai, cheezein todta hai” | Irritability with aggression towards objects |
| “Pagal ho gaya hai” | (Don't write this.) Describe the behaviour observed |

:::recall
1. Name six principles of a good case sheet. || Describe not label, quote, negatives, separate sources, specific, respectful (also risk, consent, sign).
2. Rewrite “non-compliant” respectfully. || Has not been taking the medicine because of side effects (or the actual reason).
:::

## 1.2 Structure at a glance [core]
1. Identification data
2. Informants and reliability
3. Chief complaints (patient's words, duration, chronological)
4. History of present illness (onset, course, biological functions, risk, negatives, treatment so far)
5. Past psychiatric and medical history; treatment history (drug allergies highlighted)
6. Family history (family tree)
7. Personal and social history
8. Premorbid personality
9. Substance history
10. Physical examination
11. Mental status examination (eight headings)
12. Summary and formulation
13. Differential and provisional diagnosis
14. Investigations
15. Management plan
16. Risk assessment and safety plan

Module 1 covers each heading in depth; this module is about **writing** them.

## 1.3 Writing the MSE for common presentations [core]
The MSE is a **snapshot of now**, written so another clinician could picture the patient. Below are short model MSEs. Notice: observations, the patient's own words in quotes, and no diagnosis inside the MSE.

:::example Depression
**Appearance and behaviour**: 34-year-old woman, looks older than her age, unkempt hair, crumpled clothes. Sits slumped, little eye contact, few spontaneous movements. Rapport established with difficulty.
**Speech**: low volume, slow, long pauses before answers, monosyllabic.
**Mood**: "Kuch achha nahi lagta, sab bekaar hai" (nothing feels good, everything is useless). **Affect**: depressed, restricted range, non-reactive, congruent.
**Thought**: hopelessness, worthlessness, guilt about being a burden; passive death wishes, no active plans (see risk). No delusions.
**Perception**: no abnormalities.
**Cognition**: oriented; attention reduced (serial 7s slow with errors); memory grossly intact.
**Insight**: grade 4 (aware of illness, attributes it partly to "weakness").
**Judgement**: personal judgement impaired (stopped eating regularly); test judgement intact.
:::

:::example Mania
**Appearance and behaviour**: 26-year-old man in a bright shirt with several necklaces, heavy perfume. Overfamiliar, stands up and walks about, distractible by noises outside. Rapport easy but difficult to direct.
**Speech**: loud, rapid, pressured, difficult to interrupt; puns and rhymes.
**Mood**: "Main duniya ka sabse khush insaan hoon" (I'm the happiest person in the world). **Affect**: elated, irritable when interrupted, labile.
**Thought**: flight of ideas with clang associations; grandiose delusions that he has been chosen to become Chief Minister.
**Perception**: no hallucinations elicited.
**Cognition**: oriented; attention poor (distractible).
**Insight**: grade 1 (complete denial of illness).
**Judgement**: impaired (spent savings on gifts for strangers).
:::

:::example Schizophrenia
**Appearance and behaviour**: 22-year-old man, poorly groomed, smiles to himself without obvious reason, occasionally looks at the corner of the room as if listening. Guarded.
**Speech**: normal rate, answers relevant at times but drifts; occasional new words ("thought-wires").
**Mood**: "Theek hai" (fine). **Affect**: blunted, incongruent at times (smiles while describing being harmed).
**Thought**: loosening of associations; persecutory delusion that neighbours have placed a chip in his head; **thought broadcasting**.
**Perception**: **third-person auditory hallucinations** discussing him ("woh pagal hai"); running commentary.
**Cognition**: oriented; attention fair.
**Insight**: grade 1. **Judgement**: impaired.
:::

:::trap Common errors in the MSE
- Writing interpretations instead of observations ("patient was manipulative").
- Putting history (two weeks of poor sleep) in the MSE.
- Missing the patient's own words for mood and abnormal beliefs.
- Writing "no abnormality" for headings you did not examine.
- Forgetting **risk** and **insight** grading.
:::

:::recall
1. Is the MSE about the past or the present? || The present, at the time of the interview.
2. Give three common errors in writing the MSE. || Interpretations instead of observations, history inside the MSE, missing the patient's words, not examining a heading.
3. Which MSE findings would you expect in mania? || Pressured speech, elated or irritable affect, flight of ideas, grandiose delusions, distractibility, poor insight.
:::

# Part II · Formulation, diagnosis and plan

## 2.1 The 5P formulation [core]
| P | Question | Example |
|---|---|---|
| **Presenting problem** | What is happening now? | Three months of low mood, anhedonia, insomnia and passive death wishes |
| **Predisposing** | What made them vulnerable? | Mother had depression; critical father; perfectionistic traits |
| **Precipitating** | Why now? | Failed promotion exam; break-up |
| **Perpetuating** | What keeps it going? | Withdrawal from friends; rumination; alcohol to sleep; financial stress |
| **Protective** | What helps? | Supportive sister; faith; good work record; motivated for help |

:::define Summary paragraph (one breath)
“Mr A, a 29-year-old unmarried software engineer from a middle-class nuclear family in Ahmedabad, with a perfectionistic premorbid personality and a family history of depression in his mother, presents with three months of low mood, anhedonia, early morning waking, reduced appetite with 5 kg weight loss, poor concentration, guilt and passive death wishes, following failure in a promotion exam and a break-up, maintained by social withdrawal and nightly alcohol use. No past episodes of elevated mood, psychosis or substance dependence. MSE shows depressed, non-reactive affect, slowed speech and thought, ideas of worthlessness, and passive death wishes without plan; insight grade 4.”
:::

## 2.2 Diagnosis and differential [core]
- Write the **provisional diagnosis** in standard terms with specifiers, and the classification used (ICD-11 or DSM-5-TR).
- List **differentials** with evidence for and against each:

:::word Differential diagnosis
1. **Major depressive disorder, single episode, moderate, with anxious distress** (provisional): five or more symptoms for over 2 weeks; clear impairment.
2. Bipolar depression: against, no past hypomania (confirmed with sister); keep under review.
3. Alcohol-induced depressive disorder: against, low mood began before drinking increased; reassess after abstinence.
4. Adjustment disorder: against, full criteria for a depressive episode are met.
5. Hypothyroidism: to exclude with TSH.
:::

## 2.3 The biopsychosocial plan [core]
| | Short term | Longer term |
|---|---|---|
| **Biological** | Investigations (blood count, TSH, LFT, glucose); start an SSRI with explanation; sleep advice; stop alcohol with support | Continue antidepressant 6 to 12 months after remission; review physical health |
| **Psychological** | Psychoeducation; safety plan; behavioural activation | CBT for depression; relapse prevention |
| **Social** | Involve sister (with consent); leave from work if needed | Return-to-work plan; rebuild social contact; financial counselling |
| **Risk** | Means safety; crisis numbers (Tele-MANAS 14416); review in 1 week | Review risk at every visit |

## 2.4 Progress notes and other records [core]
:::mnemonic SOAP notes
**S**ubjective (what the patient reports) · **O**bjective (observations, MSE, tests) · **A**ssessment (your clinical judgement, change since last time, risk) · **P**lan (what will happen, by whom, when).
:::
- **Discharge summary**: dates, diagnosis, key findings, treatment given and response, condition at discharge, medicines with doses, risk and safety plan, follow-up date, who to contact.
- **Referral letter**: the question you want answered, key history, current medicines, risk, urgency.
- **Consent and confidentiality**: record what was explained and agreed, and any information shared with whom and why.

:::recall
1. Name the 5Ps. || Presenting, predisposing, precipitating, perpetuating, protective.
2. Expand SOAP. || Subjective, objective, assessment, plan.
3. What must a discharge summary include? || Dates, diagnosis, findings, treatment and response, condition, medicines, risk and safety plan, follow-up, contacts.
:::

## 2.5 Risk, discharge and referral writing [core]
### The risk section
| Heading | Write |
|---|---|
| **Risk to self** | Suicidal thoughts, intent, plans, past attempts, self-neglect, vulnerability (exploitation) |
| **Risk to others** | Thoughts, threats, past violence, command hallucinations, access to weapons, victims |
| **Risk from others** | Abuse, exploitation, domestic violence |
| **Other** | Absconding, driving, children at home, medicines in overdose |
| **Formulation and plan** | Why now, what increases or reduces risk, what will be done and by whom |

### Discharge summary: the essentials
1. Identifying details, dates of admission and discharge, legal status (independent or supported admission).
2. Reason for admission (brief history and presenting problems).
3. Mental state at admission and at discharge.
4. Investigations and important results.
5. **Diagnosis** (ICD-11 or DSM-5-TR, with code).
6. Treatment given, response, side effects.
7. **Medicines at discharge**, with changes and why.
8. **Risk at discharge** and the crisis plan.
9. Follow-up: date, place, person; what the general practitioner or family should watch for.

### A referral letter
- **Who and why**: "I am referring Mr S, 45, for assessment of possible early-onset dementia."
- **The question you want answered.**
- Brief relevant history, mental state, investigations, current medicines, allergies.
- Urgency and how to contact you.

:::word One-line referral opening
"Thank you for seeing Ms P, a 29-year-old teacher with recurrent depression, who has not responded to two adequate antidepressant trials; I would value your opinion on further treatment, including suitability for ECT or rTMS."
:::

:::recall
1. Name the four areas of risk in the risk section. || Risk to self, to others, from others, and other risks.
2. List five essentials of a discharge summary. || Reason for admission, mental state at admission and discharge, diagnosis, medicines with changes, risk and crisis plan, follow-up.
3. What should the first lines of a referral letter state? || Who, why, and the question to be answered.
:::

## 2.6 Presenting a case in an exam [core]
### The structure (about 10 minutes)
1. **One-line summary**: "Mr A, a 32-year-old married farmer from Haryana, was brought by his wife with complaints of reduced sleep, increased talk and spending for 2 weeks."
2. **Chief complaints** with duration (in the informant's or patient's words).
3. **History of present illness**: onset, course, progression, key positives and **important negatives**, treatment so far.
4. Past, family, personal (with premorbid personality), and substance history: only what matters.
5. **MSE**: highlight abnormal findings.
6. **Physical examination**: relevant findings.
7. **Summary and formulation** (5 Ps).
8. **Diagnosis and differentials**, with reasons for and against.
9. **Investigations** and **management**: biopsychosocial, short and long term.

### Questions examiners often ask
- "Why not schizophrenia?" (Defend your differential with features for and against.)
- "What would you do if he refuses medicines?" (Capacity, MHCA, supported admission.)
- "How would you counsel the family?" (Psychoeducation, early signs, adherence, stigma.)
- "What is the prognosis and why?" (Good and poor prognostic factors in this patient.)

:::trap Don't hide what you don't know
If you didn't ask about something, say "I did not elicit that; I would like to ask about it." Examiners forgive gaps; they don't forgive made-up findings.
:::

:::recall
1. What does a one-line summary contain? || Age, sex, background, who brought them, main complaints and duration.
2. Why include important negatives? || They support your diagnosis and rule out differentials.
3. How should you respond to a question about something you didn't ask? || Admit it and say you would ask.
:::

# Part III · A complete worked example

## 3.1 Worked case sheet [core]
:::example Identification and informants
Mr A, 29, male, unmarried, Hindu, graduate (B.Tech), software engineer, middle socioeconomic status, from Ahmedabad; self-referred on his sister's advice. **Informants**: patient (reliable, adequate) and elder sister, 33, lives nearby, meets him twice a week (reliable: close relationship, good observation, concerned).
:::

:::example Chief complaints
Patient: (1) “Kuch bhi achha nahi lagta” (nothing feels good), 3 months. (2) “Raat ko 3 baje neend khul jaati hai” (wakes at 3 a.m.), 3 months. (3) “Lagta hai main kisi kaam ka nahi” (feels worthless), 2 months. (4) “Kabhi lagta hai so jaaun aur na uthun” (wishes not to wake up), 3 weeks.
Sister: he has stopped meeting friends, stays in his room, and drinks alone every night for 1 month.
:::

:::example History of present illness
Last well 4 months ago. Insidious onset following failure in an internal promotion exam (March), followed by a break-up (April). Gradually progressive. Low mood most of the day, worse in the mornings; loss of interest in cricket and friends; early morning waking at 3 a.m. with inability to sleep again; reduced appetite with 5 kg weight loss in 2 months; fatigue; poor concentration (errors at work, warning from manager); guilt about “wasting parents' money”; passive death wishes for 3 weeks without plan or intent; no self-harm. Began drinking 3 to 4 pegs of whisky nightly a month ago “to sleep”; no morning drinking or withdrawal. No history suggestive of hypomania, psychosis, obsessions or panic. **Negatives**: no head injury, seizures, other substance use or medical illness. No treatment so far.
:::

:::example Past, family, personal and premorbid
**Past**: no psychiatric or major medical illness; no drug allergies. **Family**: nuclear family; father 62, retired clerk, described as critical; mother 58, treated for depression 10 years ago (responded to an antidepressant); sister 33, married. No family history of bipolar disorder, suicide or substance dependence. **Personal**: full-term normal delivery; milestones normal; consistently good student; engineering degree, first job at 22, current company 5 years, good record until recently. Heterosexual; 2-year relationship ended in April. **Premorbid personality** (per sister): conscientious, perfectionistic (re-checked work often), sociable with a small close group, played cricket weekly, even-tempered, occasional social drinking, no tobacco.
:::

:::example Mental status examination
**Appearance and behaviour**: thin, appears stated age, mildly unkempt, appropriately dressed; cooperative; reduced spontaneous movements; poor eye contact; rapport established with some effort. **Speech**: decreased in amount, slow, low volume, increased latency, relevant and coherent. **Mood and affect**: subjectively “bilkul khaali lagta hai” (feel completely empty); objectively depressed; affect restricted, reduced intensity, non-reactive, congruent. **Thought**: slowed; ideas of worthlessness and guilt; passive death wishes for 3 weeks, no plan or intent; no delusions; no obsessions. **Perception**: no abnormalities. **Cognition**: conscious, oriented; attention aroused but poorly sustained (digit span 5 forward, 3 backward); 100 minus 7 slow with one error in 70 seconds; memory intact; abstraction intact. **Insight**: grade 4 (aware he is ill, attributes it to “something wrong inside me”). **Judgement**: personal judgement impaired (nightly drinking), social and test judgement intact.
:::

:::example Risk
Passive death wishes without plan, intent or preparation; no past attempts. Risk factors: male, depression with hopelessness, recent losses, alcohol use, living alone. Protective: close sister, help-seeking, job, religious belief that suicide is wrong. **Overall: moderate risk**; safety plan made; sister will stay with him this week; no stockpiled medicines at home; review in 1 week; crisis line given.
:::

:::example Diagnosis and plan
**Provisional diagnosis**: major depressive disorder, single episode, moderate, with anxious distress (DSM-5-TR); alcohol use (hazardous pattern, not dependent). **Plan**: blood count, TSH, LFT, glucose; sertraline started at a low dose with explanation of timing and side effects; stop alcohol (brief intervention, sister's support); behavioural activation and CBT referral; sleep routine; medical leave for 2 weeks with return-to-work plan; review in 1 week for side effects and risk.
:::

:::recall
1. In the example, what clues argue against bipolar depression? || No past hypomania confirmed by the sister, no family history of bipolar disorder.
2. Why is the alcohol use important in the formulation? || A perpetuating factor and a risk factor; may also mimic or worsen depression.
3. What are the protective factors? || Sister, help-seeking, job, religious belief.
:::

# Part IV · Exam zone

## 4.1 Short notes [core]
:::word Short note: biopsychosocial formulation
A formulation summarises a patient's difficulties and explains them through biological, psychological and social factors, organised as predisposing (vulnerabilities), precipitating (why now), perpetuating (what maintains them) and protective (strengths) factors, alongside the presenting problem. It links the history and MSE to a provisional diagnosis and differentials, guides a management plan on the same three levels, and includes risk. It is a working hypothesis, developed collaboratively, and revised as new information emerges.
:::

## 4.2 Viva rapid-fire [core]
:::viva
Why quote the patient in chief complaints? :: To preserve their meaning and avoid premature labels.
What is an important negative? :: An absent finding that matters for the differential, such as no substance use in first psychosis.
5Ps? :: Presenting, predisposing, precipitating, perpetuating, protective.
SOAP? :: Subjective, objective, assessment, plan.
Where are drug allergies recorded? :: Treatment history, prominently flagged.
Write “pagal ho gaya hai” clinically. :: Don't; describe the behaviour actually observed.
Three levels of a management plan? :: Biological, psychological, social (plus risk).
What does the summary paragraph include? :: Who, what, why now, key positives and negatives, MSE highlights, insight.
Is the MSE a record of the past? :: No, the present.
Where do the patient's own words go in the MSE? :: Mood and abnormal beliefs, in quotes.
Four headings of a risk section? :: Risk to self, to others, from others, other.
Legal status on a discharge summary? :: Independent or supported admission under the MHCA.
First line of a case presentation? :: A one-line summary.
What to say if you didn't elicit something? :: "I did not elicit that; I would ask."
:::

## 4.3 Module test [core]
:::mcq
Q: Which is the best way to record a delusion?
- “Delusion +”
- *The type of delusion with the patient's own words, conviction and response to reasoning
- “Patient is paranoid”
- “Pagal”
> Describe, quote, qualify.

Q: In a 5P formulation, a recent break-up that triggered the episode is:
- Predisposing
- *Precipitating
- Perpetuating
- Protective
> The “why now”.

Q: Nightly drinking that keeps the depression going is:
- Predisposing
- Precipitating
- *Perpetuating
- Protective
> A maintaining factor.

Q: A supportive sister is a:
- Perpetuating factor
- *Protective factor
- Precipitating factor
- Predisposing factor
> A strength.

Q: In SOAP notes, the clinician's judgement about change and risk goes under:
- Subjective
- Objective
- *Assessment
- Plan
> Assessment.

Q: Which phrase is most appropriate in a case sheet?
- “Attention-seeking patient”
- “Non-compliant”
- *“Stopped medicine after 2 weeks because of nausea”
- “Manipulative”
> Specific and non-judgemental.

Q: Which is an important negative in a first episode of psychosis?
- Normal appetite
- *No history of substance use
- Liking cricket
- Being unmarried
> It narrows the differential.

Q: Drug allergies should be:
- Left out if minor
- *Recorded and prominently flagged
- Only told verbally
- Recorded in the family history
> Patient safety.

Q: Which belongs in the MSE rather than the history?
- Poor sleep for two weeks
- Past episode at age 20
- *Pressured speech during the interview
- Father had depression
> The MSE is what you observe now.

Q: "Patient was attention-seeking" in an MSE is a problem because:
- It is too short
- *It is an interpretation, not an observation
- It belongs in the family history
- It should be in capital letters
> Describe what was seen and heard.

Q: In an exam, asked "why not schizophrenia?" for your mania case, the best answer:
- Says the examiner is wrong
- *Lists features for and against each diagnosis from this patient
- Changes the diagnosis to schizophrenia
- Says investigations will decide
> Defend the differential with evidence.
:::
`;
