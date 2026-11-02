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
:::
`;
