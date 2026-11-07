/* Module · Exam prep, Parts III and IV (Advanced and exam zone). Original text written for VIBHA School of Psychology. */
export const part2 = String.raw`
# Part III · Advanced: entrance-level questions and descriptive answers

## 3.1 Practice set D: psychopathology and diagnosis [core][advanced]
These questions are at the level of clinical psychology entrances. Many test **discrimination** between look-alikes.

:::note How this set works
Read the high-yield summary and do the activity here. The exam-style questions for this set are saved for your **checkpoint**, after you have moved on, because answering after a gap is what makes it stick.
:::

| Eponym or syndrome | The core belief or feature |
|---|---|
| Capgras | A familiar person replaced by an impostor |
| Fregoli | Strangers are a familiar person in disguise |
| Cotard | Nihilistic: "I am dead, my organs have rotted" |
| De Clérambault (erotomania) | A person, often of higher status, is in love with the patient |
| Othello syndrome | Delusional jealousy about a partner's infidelity |
| Ekbom (delusional parasitosis) | Infested with insects or parasites |
| Ganser syndrome | Approximate answers ("2 plus 2 is 5") |
| Dhat syndrome | Anxiety and somatic complaints attributed to semen loss |

:::widget flow
{
  "title": "Psychosis: a differential diagnosis tree",
  "layout": "tree",
  "nodes": [
    { "id": "p", "label": "Psychotic symptoms", "detail": "Delusions, hallucinations, disorganisation. First rule out causes that need urgent medical treatment." },
    { "id": "org", "label": "Medical or substance cause?", "parent": "p", "detail": "Delirium, epilepsy, encephalitis, thyroid disease, steroids, cannabis, stimulants, alcohol withdrawal. Clues: sudden onset, fluctuating awareness, visual hallucinations, abnormal signs." },
    { "id": "mood", "label": "Only during mood episodes?", "parent": "p", "detail": "Bipolar disorder or depression with psychotic features." },
    { "id": "sa", "label": "Mood episodes plus psychosis outside them", "parent": "mood", "detail": "Schizoaffective disorder: psychosis also occurs without a mood episode, and mood episodes are present for much of the illness." },
    { "id": "prim", "label": "Primary psychotic disorder", "parent": "p", "detail": "Decided mainly by duration and by the type of symptoms." },
    { "id": "brief", "label": "Short duration", "parent": "prim", "detail": "Brief psychotic disorder (DSM-5-TR) or acute and transient psychotic disorder (ICD-11)." },
    { "id": "scz", "label": "Longer duration, decline", "parent": "prim", "detail": "Schizophreniform or schizophrenia, by the DSM duration rules; ICD-11 uses a shorter duration for schizophrenia." },
    { "id": "del", "label": "Delusions only, functioning preserved", "parent": "prim", "detail": "Delusional disorder: non-bizarre or bizarre delusions without prominent hallucinations or decline." }
  ],
  "caption": "Tap each branch. Entrance questions often test the duration rules and the difference between DSM-5-TR and ICD-11."
}
:::

:::widget sort
{
  "prompt": "First-rank symptom (Schneider) or not?",
  "buckets": ["First-rank symptom", "Not a first-rank symptom"],
  "items": [
    { "text": "Thought insertion", "bucket": 0 },
    { "text": "Voices arguing about the patient in the third person", "bucket": 0 },
    { "text": "Grandiose delusion", "bucket": 1 },
    { "text": "Delusional perception", "bucket": 0 },
    { "text": "Visual hallucinations", "bucket": 1 },
    { "text": "Made actions (passivity of will)", "bucket": 0 },
    { "text": "Flat affect", "bucket": 1, "why": "A negative symptom, important but not first-rank." }
  ]
}
:::


:::widget timeline
{
 "prompt": "Arrange these milestones in psychiatric classification in order.",
 "events": [
  {
   "label": "Kraepelin separates dementia praecox from manic-depressive illness",
   "when": "1899"
  },
  {
   "label": "The ICD first includes a chapter on mental disorders",
   "when": "1949"
  },
  {
   "label": "The first DSM is published",
   "when": "1952"
  },
  {
   "label": "DSM-III brings explicit criteria and multiple axes",
   "when": "1980"
  },
  {
   "label": "ICD-10 is approved",
   "when": "1992"
  },
  {
   "label": "DSM-IV",
   "when": "1994"
  },
  {
   "label": "DSM-5 drops the multiaxial system",
   "when": "2013"
  },
  {
   "label": "ICD-11 comes into effect",
   "when": "2022"
  }
 ],
 "why": "The big turning point for exams is DSM-III in 1980, the shift to explicit, reliable criteria. ICD-11 is the version now in force; India's records and insurance still use ICD-10 codes in many places."
}
:::

:::mcq
Q: Which of the following is a Schneiderian first-rank symptom?
- Persecutory delusion
- Flat affect
- *Voices giving a running commentary on the person's actions
- Visual hallucinations
> Running commentary, voices arguing, audible thoughts, thought insertion, withdrawal and broadcasting, passivity experiences and delusional perception.

Q: Delusional perception is characterised by:
- A hallucination followed by a delusion
- *A normal perception given a sudden, unrelated delusional meaning
- A misperception of a real object
- A belief arising from low mood
> Two-membered: real perception, then an unrelated delusional significance.

Q: A woman believes a famous film actor is secretly in love with her and sends coded messages through his films. This is:
- Othello syndrome
- *Erotomania (de Clérambault's syndrome)
- Capgras syndrome
- Fregoli syndrome
> Delusion that a person, often of higher status, is in love with the patient.

Q: Belief that a familiar person has been replaced by an identical impostor is:
- *Capgras delusion
- Fregoli delusion
- Cotard's syndrome
- Ekbom's syndrome
> Fregoli is the reverse: strangers are a familiar person in disguise.

Q: According to DSM-5-TR, bipolar II disorder requires:
- At least one manic episode
- *At least one hypomanic episode and at least one major depressive episode, and never a manic episode
- Only hypomanic episodes
- Mixed episodes only
> A manic episode would make it bipolar I.

Q: Dhat syndrome is best described as:
- A form of psychosis
- *A culture-related syndrome of anxiety and somatic complaints attributed to loss of semen
- A neurological disorder
- A personality disorder
> Common in South Asia; often with depression or anxiety.

Q: In ICD-11, personality disorder is classified by:
- Ten categorical types
- *Severity (mild, moderate, severe) with optional trait domain qualifiers and a borderline pattern specifier
- Clusters A, B and C only
- Age of onset
> A dimensional approach.

Q: Which is NOT a trait domain in ICD-11 personality disorder?
- Negative affectivity
- Detachment
- Anankastia
- *Psychoticism
> ICD-11 domains: negative affectivity, detachment, dissociality, disinhibition, anankastia. Psychoticism is in the DSM-5-TR alternative model.

Q: La belle indifférence is classically associated with:
- Generalised anxiety disorder
- *Functional neurological symptom (conversion) disorder
- Schizophrenia
- Delirium
> Though it is not diagnostic and is seen in organic illness too.

Q: Assertion (A): Obsessions are ego-dystonic. Reason (R): The person recognises the thoughts as products of their own mind and tries to resist them.
- A is false, R is true
- *Both A and R are true, and R explains A
- Both A and R are true, but R does not explain A
- Both are false
> Recognition as one's own plus resistance defines ego-dystonic obsessions.

Q: The most common inherited (single-gene) cause of intellectual disability is:
- Down syndrome
- *Fragile X syndrome
- Phenylketonuria
- Rett syndrome
> Down syndrome is commoner overall but usually not inherited.

Q: Which feature best distinguishes delirium from dementia?
- Memory impairment
- *Acute onset with fluctuating attention and consciousness
- Older age
- Visual hallucinations
> Inattention and fluctuation.
:::

## 3.2 Practice set E: assessment, therapies, ethics and law [core][advanced]
Founders, tests and law sections are pure recall: learn them as pairs.

:::note How this set works
Read the high-yield summary and do the activity here. The exam-style questions for this set are saved for your **checkpoint**, after you have moved on, because answering after a gap is what makes it stick.
:::

| Item | Key pair |
|---|---|
| Systematic desensitisation | Wolpe |
| REBT, ABC(DE) | Ellis |
| Cognitive therapy, cognitive triad | Beck |
| DBT | Linehan |
| ACT | Hayes |
| Stress inoculation training | Meichenbaum |
| Token economy | Ayllon and Azrin |
| IPT | Klerman and Weissman |
| Motivational interviewing | Miller and Rollnick |
| MHCA 2017 | Advance directive (section 5), nominated representative (section 14), attempted suicide (section 115) |
| RCI Act 1992 | Central Rehabilitation Register for professionals including clinical psychologists |
| RPwD Act 2016 | 21 specified disabilities |

:::widget flow
{
  "title": "The therapy family tree",
  "layout": "tree",
  "nodes": [
    { "id": "t", "label": "Psychological therapies", "detail": "Most exam questions pair a therapy with its founder and one key technique." },
    { "id": "beh", "label": "Behaviour therapy", "parent": "t", "detail": "Learning principles: systematic desensitisation (Wolpe), token economy (Ayllon and Azrin), exposure and response prevention." },
    { "id": "cog", "label": "Cognitive therapies", "parent": "t", "detail": "Thoughts shape feelings: cognitive therapy (Beck), REBT (Ellis), stress inoculation (Meichenbaum)." },
    { "id": "third", "label": "Third-wave therapies", "parent": "cog", "detail": "Changing the relationship to thoughts: DBT (Linehan), ACT (Hayes), mindfulness-based cognitive therapy." },
    { "id": "dyn", "label": "Psychodynamic", "parent": "t", "detail": "Unconscious conflict and relationships: psychoanalysis, brief dynamic therapies, MBT, TFP." },
    { "id": "hum", "label": "Humanistic and existential", "parent": "t", "detail": "Person-centred (Rogers), Gestalt (Perls), logotherapy (Frankl)." },
    { "id": "ipt", "label": "Interpersonal and systemic", "parent": "t", "detail": "IPT (Klerman and Weissman), family and couple therapies (Minuchin, Bowen), group therapy (Yalom's therapeutic factors)." },
    { "id": "mi", "label": "Motivational interviewing", "parent": "t", "detail": "Miller and Rollnick: resolving ambivalence about change." }
  ],
  "caption": "Tap each branch. Then cover the details and recall the founder for each."
}
:::

:::widget decide
{
  "scene": "An entrance question asks: “Under the Mental Healthcare Act 2017, which of these is a prohibited treatment?” You narrow it to two options: ‘ECT under anaesthesia with muscle relaxants for an adult’ and ‘ECT without anaesthesia and muscle relaxants’.",
  "ask": "Which do you choose?",
  "choices": [
    { "label": "ECT under anaesthesia with muscle relaxants for an adult", "verdict": "harm", "outcome": "Wrong: modified ECT is permitted with consent and safeguards.", "why": "The Act prohibits unmodified ECT, not ECT itself." },
    { "label": "ECT without anaesthesia and muscle relaxants", "verdict": "best", "outcome": "Correct.", "why": "Unmodified ECT is prohibited; ECT for minors is also restricted, as are sterilisation as treatment and chaining." }
  ]
}
:::

:::widget sort
{
 "prompt": "Which law is it? Sort each provision.",
 "buckets": [
  "Mental Healthcare Act 2017",
  "Rights of Persons with Disabilities Act 2016",
  "Rehabilitation Council of India Act 1992"
 ],
 "items": [
  {
   "text": "A person can make an advance directive about future mental health treatment",
   "bucket": 0
  },
  {
   "text": "A nominated representative supports decisions during treatment",
   "bucket": 0
  },
  {
   "text": "A person who attempts suicide is presumed to be under severe stress, unless shown otherwise",
   "bucket": 0,
   "why": "Section 115."
  },
  {
   "text": "Mental illness is listed among the specified disabilities, with a certificate and reserved posts",
   "bucket": 1
  },
  {
   "text": "Clinical psychologists must be registered on the Central Rehabilitation Register",
   "bucket": 2
  },
  {
   "text": "Practising as a rehabilitation professional without registration is an offence",
   "bucket": 2
  },
  {
   "text": "The state must provide community-based mental health services close to home",
   "bucket": 0,
   "why": "Part of the right to access mental healthcare."
  }
 ]
}
:::

:::mcq
Q: On the MMPI-2, the F scale mainly detects:
- Defensiveness
- *Infrequent responding, which may indicate over-reporting of symptoms or random answering
- Lying in a socially desirable direction
- Masculinity-femininity
> L and K detect defensiveness; F detects infrequency.

Q: The Thematic Apperception Test was developed by:
- Rorschach
- *Murray and Morgan
- Wechsler
- Binet
> Based on Murray's theory of needs and press.

Q: Which scale is used to rate obsessive-compulsive symptoms?
- HAM-D
- *Y-BOCS
- PANSS
- YMRS
> Yale-Brown Obsessive Compulsive Scale.

Q: Systematic desensitisation was developed by:
- Skinner
- *Joseph Wolpe
- Aaron Beck
- Albert Ellis
> Reciprocal inhibition with relaxation and a fear hierarchy.

Q: In Ellis's ABC model, "B" stands for:
- Behaviour
- *Beliefs
- Barriers
- Body
> Activating event, Beliefs, Consequences; then Disputing and Effective new beliefs.

Q: Dialectical behaviour therapy has four skills modules: mindfulness, distress tolerance, emotion regulation and:
- Cognitive restructuring
- *Interpersonal effectiveness
- Exposure
- Problem solving
> The four DBT skills modules.

Q: Which is a core process of Acceptance and Commitment Therapy?
- Free association
- *Cognitive defusion
- Token economy
- Flooding
> Six processes: acceptance, defusion, present moment, self-as-context, values, committed action.

Q: Interpersonal therapy focuses on four problem areas: grief, role disputes, role transitions and:
- Childhood trauma
- *Interpersonal deficits
- Cognitive distortions
- Family history
> The four IPT areas.

Q: Under the Mental Healthcare Act 2017, a person can appoint someone to support decisions about their mental health care. This person is the:
- Guardian
- *Nominated representative
- Mental Health Review Board member
- Psychiatric social worker
> Section 14.

Q: Which section of the Mental Healthcare Act 2017 effectively decriminalised attempted suicide by presuming severe stress?
- Section 89
- Section 18
- *Section 115
- Section 102
> The person shall not be tried and punished; the government must provide care.

Q: Under the MHCA 2017, which treatment is prohibited?
- Modified ECT
- *ECT without muscle relaxants and anaesthesia (unmodified ECT)
- Lithium
- Psychotherapy
> Also prohibited: ECT for minors (with limited exceptions), sterilisation as treatment, chaining.

Q: The RCI Act 1992 makes it mandatory for practising clinical psychologists to be:
- Members of the APA
- *Registered in the Central Rehabilitation Register
- Licensed by the state medical council
- Holders of a PhD
> Registration with RCI.

Q: The Rights of Persons with Disabilities Act 2016 recognises how many specified disabilities?
- 7
- 14
- *21
- 30
> Including mental illness, intellectual disability, autism and specific learning disabilities.
:::

## 3.3 Answer-writing frameworks for descriptive papers [core][advanced]
University semester exams, and some entrances, ask for written answers. Marks go to **structure, accuracy, examples and evaluation**, not length.

### Read the command word
| Command word | What the examiner wants |
|---|---|
| **Define** | A precise one- or two-line definition, ideally the standard one |
| **Describe** | What it is, its parts, how it works; no judgement needed |
| **Explain** | Why and how: causes, mechanisms |
| **Discuss** | Several sides, with evidence, and a reasoned conclusion |
| **Critically evaluate** | Strengths, weaknesses, evidence quality and your judgement |
| **Compare and contrast** | Similarities **and** differences, point by point (a table helps) |
| **Short note** | Definition, key features, one example, one line of significance |

:::widget sort
{
  "prompt": "What does each question require? Sort by the main task.",
  "buckets": ["Describe or explain", "Discuss or evaluate", "Compare and contrast"],
  "items": [
    { "text": "“Describe Piaget's stages of cognitive development.”", "bucket": 0 },
    { "text": "“Critically evaluate Freud's contribution to modern psychology.”", "bucket": 1 },
    { "text": "“Differentiate between classical and operant conditioning.”", "bucket": 2 },
    { "text": "“Explain the biological basis of depression.”", "bucket": 0 },
    { "text": "“Discuss the role of culture in the expression of psychological distress in India.”", "bucket": 1 },
    { "text": "“Distinguish between reliability and validity with examples.”", "bucket": 2 }
  ]
}
:::

### The long answer frame (10 to 15 marks)
Press Play to step through the frame.

:::widget flow
{
  "title": "The long answer frame",
  "layout": "chain",
  "nodes": [
    { "id": "in", "label": "Introduction", "detail": "Define the key term in its standard form; one line on why it matters." },
    { "id": "body", "label": "Headed body sections", "detail": "One idea per paragraph: a point, the evidence or theory, and an example. An Indian example scores well." },
    { "id": "fig", "label": "Diagram or table", "detail": "A flow chart of a model or a comparison table where it fits. Examiners find points faster." },
    { "id": "eval", "label": "Evaluation", "detail": "Strengths, limitations, research support, cultural relevance. For 'critically evaluate', this is most of the answer." },
    { "id": "conc", "label": "Conclusion", "detail": "Answer the question directly in two or three lines. No new material." }
  ],
  "caption": "The command word decides how long each box is, not whether it appears."
}
:::

### The short note frame (5 marks)
Definition, three or four key features, one example, one line on significance or a criticism.

### The case vignette frame

:::widget flow
{
  "title": "The case vignette frame",
  "layout": "chain",
  "nodes": [
    { "id": "s", "label": "Summarise", "detail": "The key features in clinical terms: age, sex, duration, main symptoms, function, risk." },
    { "id": "dx", "label": "Provisional diagnosis and differentials", "detail": "The criteria met, then two or three differentials with the reason each is less likely or how you would exclude it." },
    { "id": "f", "label": "Formulation", "detail": "The 5 Ps: presenting, predisposing, precipitating, perpetuating, protective." },
    { "id": "a", "label": "Assessment plan", "detail": "History, MSE, named tests or scales and why, investigations, risk assessment." },
    { "id": "m", "label": "Management", "detail": "Psychological, social and, if relevant, medical, with a risk and relapse plan." }
  ],
  "caption": "Press Play. Examiners award marks for reasoning, so show why you rule things in and out."
}
:::

### Time per mark
Divide the exam time by the total marks to get **minutes per mark**, keeping ten minutes for reading and review. A 15-mark answer in a three-hour, 100-mark paper deserves about **25 minutes**, not an hour.

:::widget decide
{
  "scene": "In a semester exam, Aman gets the question: “Critically evaluate the cognitive model of depression. (15 marks)” He writes four pages describing Beck's cognitive triad, schemas and distortions in detail, and ends without any evaluation.",
  "ask": "How will this likely be marked, and what should he have done?",
  "choices": [
    { "label": "Full marks: the description was detailed and accurate", "verdict": "harm", "outcome": "He scores about half. The examiner writes: “No evaluation.”", "why": "“Critically evaluate” requires strengths, weaknesses and evidence. Description alone earns only part of the marks." },
    { "label": "He should have described the model briefly, then evaluated it: research support, limitations (causation versus correlation), effectiveness of CBT, cultural fit in India, and a conclusion", "verdict": "best", "outcome": "A balanced answer of the same length scores much higher.", "why": "The command word decides the structure. Spend about a third describing and two thirds evaluating." },
    { "label": "Write more pages next time", "verdict": "ok", "outcome": "Longer answers without the right structure still lose the evaluation marks.", "why": "Length is not the issue; matching the command word is." }
  ]
}
:::

:::clinician
Examiners commonly use analytic rubrics: knowledge and accuracy, organisation, application and examples, critical analysis, and expression. Flagging structure with headings helps markers find points quickly, which matters when a marker has many scripts. For psychology, naming key studies with author and year, and giving a brief critique, signals depth. For Indian university papers, linking to Indian research (for example the National Mental Health Survey 2015 to 2016 for epidemiology, or Indian test adaptations) earns credit for application.
:::

:::recall
1. What is the difference between "describe" and "critically evaluate"? || Describe: what it is and how it works. Critically evaluate: strengths, weaknesses, evidence and a judgement.
2. Give the five parts of a long answer. || Introduction, headed body with point-evidence-example, diagram or table, evaluation, conclusion.
3. Give the five steps for a case vignette answer. || Summary, provisional diagnosis with differentials, 5P formulation, assessment plan, management.
4. How do you decide how long to spend on an answer? || Minutes per mark: total time (minus review time) divided by total marks, times the marks for the question.
:::

:::mcq
Q: A question says "Compare and contrast the psychoanalytic and humanistic approaches." The best structure is:
- Describe psychoanalysis fully, then humanism fully
- *Point-by-point comparison of similarities and differences, ideally with a table, and a conclusion
- Only list differences
- Write about whichever approach you know better
> Compare and contrast needs both similarities and differences, side by side.
:::

## 3.4 Model answers, worked [core][advanced]
:::widget worked
{
  "title": "Short note (5 marks): Reliability",
  "steps": [
    { "q": "Definition?", "a": "Reliability is the consistency of a measure: the extent to which a test gives the same results under consistent conditions." },
    { "q": "Key types (three or four)?", "a": "Test-retest (stability over time); parallel or alternate forms (equivalence); split-half and internal consistency (Cronbach's alpha, Kuder-Richardson); inter-rater (agreement between scorers, for example Cohen's kappa)." },
    { "q": "One example?", "a": "A depression questionnaire given to the same patients twice, a few days apart, with no treatment change, correlates 0.85: good test-retest reliability." },
    { "q": "Significance or criticism?", "a": "Reliability is necessary but not sufficient for validity; a test can be consistent yet measure the wrong thing. Standard error of measurement follows from reliability." }
  ]
}
:::

:::widget worked
{
  "title": "Long answer (15 marks): Discuss the role of culture in the expression of psychological distress, with reference to India",
  "steps": [
    { "q": "Introduction: define the key ideas.", "a": "Culture is the shared beliefs, values and practices of a group. It shapes how distress is felt, named, expressed and treated. Idioms of distress are culturally shared ways of expressing suffering." },
    { "q": "Section 1: somatic expression. Point, evidence, example?", "a": "Distress is often expressed through the body. Studies in primary care in India and elsewhere find that many people with depression present mainly with physical complaints. Example: “sir mein bhaari pan, haath-pair mein dard” (heaviness in the head, aches in the limbs) in a woman with depression." },
    { "q": "Section 2: culture-related syndromes and idioms.", "a": "Dhat syndrome (anxiety about semen loss), possession and trance states, “tension” as a common idiom. DSM-5-TR's cultural concepts of distress and the Cultural Formulation Interview help clinicians." },
    { "q": "Section 3: explanatory models and help-seeking.", "a": "Families may attribute illness to sorcery, karma or the evil eye and seek help from healers first; many use both healers and doctors. Kleinman's explanatory model questions help." },
    { "q": "Section 4: family and stigma.", "a": "The joint family can be a strong support and an important part of care, while stigma can delay help, especially for women. The National Mental Health Survey (2015 to 2016) reported large treatment gaps." },
    { "q": "Evaluation.", "a": "Strengths: culture-sensitive assessment improves engagement and accuracy. Limitations: the risk of stereotyping, since India is diverse; most measures were developed in the West and need adaptation and validation." },
    { "q": "Conclusion.", "a": "Culture shapes every stage of distress, from experience to recovery. Good practice in India asks about the person's own explanatory model and adapts assessment and treatment, without assuming that any one culture is uniform." }
  ],
  "yourTurn": [
    { "q": "Write an introduction and an evaluation paragraph for: “Critically evaluate Maslow's hierarchy of needs.” (10 marks)", "a": "Introduction: Maslow proposed that human motives form a hierarchy, from physiological and safety needs to belonging, esteem and self-actualisation, with higher needs becoming important as lower ones are reasonably met. Evaluation: it is intuitive and influential in education, counselling and management, and draws attention to growth needs. However, research gives limited support for a strict order (people pursue belonging or meaning even when basic needs are unmet), self-actualisation is hard to define and measure, and the model reflects individualistic Western values; in collectivist settings such as many Indian families, belonging and duty may rank differently. A large 2011 survey across many countries found the needs broadly universal but not strictly ordered." }
  ]
}
:::

:::widget worked
{
  "title": "Case vignette (10 marks): A 24-year-old man in Lucknow for six months has believed his neighbours are poisoning his food, hears voices discussing him, and has stopped working. No substance use.",
  "steps": [
    { "q": "Summary in clinical terms?", "a": "A young man with persecutory delusions, third-person auditory hallucinations and social and occupational decline over six months, without substance use." },
    { "q": "Provisional diagnosis and differentials?", "a": "Provisional: schizophrenia (delusions and hallucinations with functional decline; duration criteria met). Differentials: schizoaffective disorder (ask about mood episodes), delusional disorder (less likely given hallucinations), substance or medication-induced psychosis (excluded by history, confirm with urine screen), psychosis due to a medical condition (check neurological signs, investigations)." },
    { "q": "5P formulation?", "a": "Presenting: persecutory delusions, voices, decline. Predisposing: family history to be asked, possible childhood adversity. Precipitating: possibly a job loss or stress before onset. Perpetuating: lack of insight, stigma, no treatment so far. Protective: supportive family, no substance use." },
    { "q": "Assessment plan?", "a": "Full history and MSE, PANSS or BPRS for severity, cognitive screen, physical examination and investigations, risk assessment (to self and to neighbours)." },
    { "q": "Management?", "a": "Antipsychotic medication (psychiatrist), psychoeducation for patient and family, family intervention, CBT for psychosis when engaged, social and vocational rehabilitation, and a crisis and relapse plan." }
  ]
}
:::

:::recall
1. What four parts make a 5-mark short note? || Definition, key features, an example, significance or criticism.
2. In a case vignette, why list differentials? || To show reasoning and that you have excluded alternatives such as substance-induced or medical causes.
:::

:::mcq
Q: In a 15-mark "discuss" answer, the section most often missing in weak scripts is:
- The introduction
- *Evaluation of evidence and a reasoned conclusion
- Headings
- Definitions
> Discussion requires weighing evidence.
:::

## 3.5 Interviews, and the final stretch [core][advanced]
### Clinical psychology interviews: what to expect
- **Why clinical psychology?** Be specific and honest; a clinical placement, a person you helped, a question you want to answer.
- **Case discussion**: a short vignette; you may be asked for a diagnosis, differentials, assessment and a plan. Think aloud.
- **Research**: your dissertation or a study you know well; be ready to explain its design, sample, analysis and one limitation.
- **Ethics**: confidentiality and its limits, dual relationships, consent with minors, the duty to warn.
- **Current topics**: the Mental Healthcare Act, the RCI training changes, telehealth, AI in mental health.

:::widget decide
{
  "scene": "In a clinical psychology interview, a panel member asks: “A 16-year-old client tells you she is self-harming and makes you promise not to tell her parents. What do you do?”",
  "ask": "Which answer shows the best understanding?",
  "choices": [
    { "label": "“I would keep the promise; confidentiality is absolute.”", "verdict": "harm", "outcome": "The panel probes and finds you have not considered safety or the law on minors.", "why": "Confidentiality has limits when there is serious risk of harm, and with minors the legal framework (including guardians' role) matters." },
    { "label": "“I'd explain the limits of confidentiality (ideally before this point), assess the risk carefully, involve her in deciding how and what to share with her parents, follow supervision and the law, and keep her safe.”", "verdict": "best", "outcome": "The panel nods; they ask a follow-up on how you would assess the risk.", "why": "This balances safety, autonomy, the therapeutic alliance, supervision and legal duties." },
    { "label": "“I'd call her parents immediately without telling her.”", "verdict": "ok", "outcome": "Safety is addressed, but you may lose her trust and miss the chance to involve her.", "why": "Disclosure may be needed, but doing it with her, where possible, protects the relationship." }
  ]
}
:::

### The final stretch, phase by phase

:::widget flow
{
  "title": "The final stretch",
  "layout": "chain",
  "nodes": [
    { "id": "log", "label": "Error log only", "detail": "Revisit every recorded mistake and redo those questions. No new topics." },
    { "id": "mock", "label": "Two or three timed mocks", "detail": "Full papers in exam conditions, each reviewed fully. Check pacing and guessing decisions." },
    { "id": "lists", "label": "High-yield lists", "detail": "Confusable pairs, theorists and concepts, test names and authors, law sections." },
    { "id": "log2", "label": "Logistics", "detail": "Admit card, ID, centre route, reporting time, the official instructions." },
    { "id": "rest", "label": "Rest", "detail": "Sleep, food, short breaks. Anxiety is normal; slow breathing before you start." }
  ],
  "caption": "Press Play. The last phase is about consolidating what you know, not adding more."
}
:::

:::note Look after yourself
Exam pressure can become overwhelming. If stress is affecting sleep, eating or mood for a long time, or you have thoughts of harming yourself, talk to someone you trust or a counsellor. In India, Tele-MANAS (14416) offers free support.
:::

:::recall
1. Name five areas commonly asked in clinical psychology interviews. || Motivation for clinical psychology, case discussion, your research, ethics, current topics.
2. What should you do in the final stretch before an exam? || Revisit the error log, take timed mocks, review high-yield lists, sort logistics, and rest.
:::

:::mcq
Q: In an interview case discussion, the best approach is to:
- Give a single diagnosis quickly
- *Think aloud: summarise, give a provisional diagnosis with differentials, and outline assessment and management
- Refuse to answer without a full history
- Recite DSM criteria only
> Panels assess clinical reasoning.
:::

# Part IV · Exam zone

## 4.1 High-yield rapid-fire [core]
:::viva
Who gave the PASS model of intelligence? :: J. P. Das and colleagues.
Who proposed the attenuation model of attention? :: Anne Treisman.
What does the episodic buffer do? :: Links working memory components with long-term memory (added by Baddeley in 2000).
Mean and SD of T-scores? :: 50 and 10.
Kruskal-Wallis is the non-parametric version of? :: One-way ANOVA.
Which MMPI-2 scale detects infrequent responding? :: The F scale.
Who developed systematic desensitisation? :: Joseph Wolpe.
Six core processes of ACT? :: Acceptance, defusion, present moment, self-as-context, values, committed action.
Four IPT problem areas? :: Grief, role disputes, role transitions, interpersonal deficits.
MHCA 2017 section on attempted suicide? :: Section 115.
Number of disabilities in the RPwD Act 2016? :: 21.
What is the fundamental attribution error? :: Over-attributing others' behaviour to personality rather than the situation.
:::

## 4.2 Module test [core]
A mixed mock in entrance style. Try it under time: about one minute per question.

:::mcq
Q: Which school of psychology is most associated with Wundt and introspection?
- Functionalism
- *Structuralism
- Gestalt
- Behaviourism
> Wundt's laboratory in Leipzig, Titchener's structuralism.

Q: The Gestalt principle by which we see a broken circle as complete is:
- Proximity
- Similarity
- *Closure
- Continuity
> Filling in gaps.

Q: A child who learns to fear all white furry objects after being frightened by a white rat shows:
- Discrimination
- *Stimulus generalisation
- Extinction
- Spontaneous recovery
> Watson and Rayner's Little Albert.

Q: Which reinforcement schedule produces behaviour most resistant to extinction?
- Fixed ratio
- Fixed interval
- *Variable ratio
- Continuous
> Gambling-like schedules.

Q: Tulving distinguished episodic memory from:
- Procedural memory
- *Semantic memory
- Sensory memory
- Working memory
> Personal events versus general knowledge.

Q: Ebbinghaus is best known for his work on:
- Attention
- *Forgetting curves using nonsense syllables
- Intelligence testing
- Emotion
> Rapid early forgetting, then levelling off.

Q: Guilford's structure-of-intellect model distinguished convergent thinking from:
- Fluid thinking
- *Divergent thinking
- Crystallised thinking
- Practical thinking
> Divergent thinking is linked to creativity.

Q: Maslow placed which need at the top of his hierarchy?
- Esteem
- Belonging
- *Self-actualisation
- Safety
> Fulfilling one's potential.

Q: Lazarus's model holds that stress depends mainly on:
- The number of life events
- *Cognitive appraisal of demands and resources
- Hormone levels alone
- Personality type A
> Primary and secondary appraisal.

Q: Erikson's crisis of adolescence is:
- Industry versus inferiority
- *Identity versus role confusion
- Intimacy versus isolation
- Generativity versus stagnation
> The fifth stage.

Q: In Kohlberg's theory, morality based on universal ethical principles belongs to the:
- Pre-conventional level
- Conventional level
- *Post-conventional level
- Concrete operational stage
> The highest level.

Q: Asch's line-judgement studies demonstrated:
- Obedience
- *Conformity to a unanimous majority
- Social loafing
- Bystander apathy
> Many conformed at least once.

Q: The correlation between two variables is minus 0.80. This means:
- No relationship
- A weak positive relationship
- *A strong negative relationship
- Causation
> Strong inverse association; correlation is not causation.

Q: Which test is appropriate for the association between two categorical variables?
- t-test
- ANOVA
- *Chi-square
- Pearson's r
> Counts in categories.

Q: Content validity refers to:
- Prediction of future behaviour
- *How well test items represent the domain to be measured
- Agreement between raters
- Stability over time
> Expert judgement of coverage.

Q: A projective test using inkblots is the:
- TAT
- *Rorschach
- MMPI
- 16PF
> Exner's Comprehensive System is a common scoring system.

Q: Which is a Schneiderian first-rank symptom?
- Grandiose delusion
- *Thought broadcasting
- Poverty of speech
- Catatonia
> A passivity-type experience of thought.

Q: A man believes strangers are his persecutor in disguise. This is:
- Capgras delusion
- *Fregoli delusion
- Cotard's syndrome
- Erotomania
> Strangers are a familiar person in disguise.

Q: Bipolar I disorder requires at least one:
- Hypomanic episode
- Major depressive episode
- *Manic episode
- Mixed episode with psychosis
> A single manic episode is enough.

Q: Which therapy uses a "cognitive triad" of negative views of self, world and future?
- REBT
- *Beck's cognitive therapy
- ACT
- Psychoanalysis
> Beck.

Q: The token economy in psychiatric wards was pioneered by:
- Wolpe
- *Ayllon and Azrin
- Ellis
- Meichenbaum
> An operant conditioning programme.

Q: Motivational interviewing was developed by:
- Beck and Ellis
- *Miller and Rollnick
- Linehan
- Klerman and Weissman
> For ambivalence about change.

Q: Under the MHCA 2017, a document in which a person states how they wish to be treated if they lose capacity is an:
- Affidavit
- *Advance directive
- Nomination form
- Discharge plan
> Section 5.

Q: The Rehabilitation Council of India was set up under the:
- Mental Healthcare Act 2017
- *RCI Act 1992
- RPwD Act 2016
- Indian Medical Council Act
> It regulates rehabilitation professionals, including clinical psychologists.

Q: A student must choose between guessing and skipping in CUET PG (+4, minus 1, four options) after eliminating one option. The expected value of guessing is about:
- Minus 0.5
- Zero
- *+0.67
- +4
> (1/3 times 4) minus (2/3 times 1).

Q: The most effective preparation strategy supported by learning research is:
- Rereading all notes
- *Spaced self-testing with mixed questions and review of errors
- Highlighting key lines
- Cramming the night before
> Testing, spacing and interleaving.
:::
`;
