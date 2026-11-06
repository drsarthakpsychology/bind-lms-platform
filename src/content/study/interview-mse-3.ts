/* Module 1 · Part IV: Advanced level. Original text written for VIBHA School of Psychology. */
export const part3 = String.raw`
# Part IV · Advanced: phenomenology, reliability and the frontier

## 4.1 Phenomenology: how we try to understand another mind [core][advanced]
Every MSE term you have learned rests on a method called **descriptive phenomenology**: describing a person's experience as closely as possible to how they live it, before any theory about its cause. Its founder in psychiatry was Karl Jaspers, a psychiatrist and philosopher working in Heidelberg in the early twentieth century. Knowing the method lets you handle cases that do not fit the textbook boxes.

### Form and content
Jaspers separated the **form** of an experience (what kind of experience it is) from its **content** (what it is about).
- A voice saying "You are a sinner" and a voice saying "You will win the lottery" have different contents but the same form: an auditory hallucination.
- The form usually carries the diagnostic weight. The content carries the personal and cultural meaning, and tells you about risk and distress.

:::example Same form, different content
A rickshaw driver in Patna and a banker in London both describe a voice outside their head commenting on everything they do. The driver's voice speaks Bhojpuri about his debts; the banker's speaks English about his emails. The content is shaped by their lives. The form, a third-person running commentary in clear consciousness, is what the clinician classifies.
:::

### Understanding and explaining
Jaspers distinguished two ways of making sense of mental life:
- **Understanding (empathic, meaningful connection).** You grasp from the inside why a feeling follows from a situation. A man betrayed by his partner becomes jealous: you can follow it.
- **Explaining (causal).** You link events by cause from the outside, as in natural science. A thyroid storm causes anxiety; you do not need to "understand" it.

He used this to separate a **development** of personality (understandable growth from life events) from a **process** (a new, un-understandable change imposed by illness). The primary delusion was his central example of something that cannot be understood from the person's prior mood, personality and situation.

:::trap Ununderstandability depends on the observer
Whether something is "understandable" depends on how hard the clinician tries, and on whether they share the patient's language and culture. A belief that seems ununderstandable to a clinician from another background may be quite understandable inside the patient's world. Use the concept with humility; record what you tried.
:::

### Three practical skills from phenomenology
1. **Ask for the experience, not the label.** "What is it like when that happens?" rather than "Is it a voice?"
2. **Bracket your assumptions.** Hold back your first interpretation until you have the person's full description.
3. **Check form with contrast questions.** "Is it like hearing me now, or like thinking in words?" "Do you know the thought is yours?" "Could someone in the room hear it too?"

:::widget sort
{"prompt": "Form or content? Place each finding.", "buckets": ["Form", "Content"], "items": [{"text": "The experience is a third-person auditory hallucination", "bucket": 0}, {"text": "The voices accuse her of witchcraft", "bucket": 1}, {"text": "The belief arose suddenly, fully formed, out of nowhere", "bucket": 0, "why": "How it arose is part of its form (a sudden delusional idea)."}, {"text": "He believes he is the tenth avatar of Vishnu", "bucket": 1}, {"text": "The thought is felt as inserted from outside", "bucket": 0, "why": "The loss of ownership is the form; what the thought says is the content."}, {"text": "The intrusive thought is about harming her baby", "bucket": 1}]}
:::

:::widget decide
{"scene": "Ama, 30, a nurse from Ghana working in Mumbai, says that since her brother died, she has felt that 'my village people are working against me spiritually'. A trainee writes 'persecutory delusion'.", "ask": "What should happen before that label is accepted?", "choices": [{"label": "Accept it: the belief is clearly false", "verdict": "harm", "outcome": "She is started on an antipsychotic. Her pastor later explains this is a common way of speaking about misfortune in her community; she stops attending.", "why": "Falsity is not the test. The belief must be judged against her own culture, and its form and conviction explored."}, {"label": "Explore its form and context: how she reached the belief, how certain she is, whether others in her community share this way of speaking, whether there are other psychotic features, and its effect on her life; seek a cultural informant", "verdict": "best", "outcome": "The belief is shared and held with some flexibility; there are no other psychotic features. Grief and a low mood emerge as the real problems.", "why": "Phenomenology plus a cultural informant separates a shared explanatory belief from a delusion."}, {"label": "Ignore it as 'just culture'", "verdict": "ok", "outcome": "Nothing harmful today, but a real delusion could be missed in another patient.", "why": "Culture does not rule out a delusion either. Explore, don't assume, in either direction."}]}
:::

:::clinician
### Depth: phenomenology in modern instruments
- The Present State Examination (and its successor SCAN) built Jaspers' method into a semi-structured interview: the clinician asks, then decides whether the described experience meets a defined glossary meaning.
- Phenomenological psychiatry has revived interest in **disturbances of the minimal self** in schizophrenia: a diminished sense of being the subject of one's own experience, hyper-reflexivity, and loss of natural self-evidence (Blankenburg). The **Examination of Anomalous Self-Experience (EASE)** rates these and they appear to cluster in the schizophrenia spectrum more than in other psychoses.
- **Basic symptoms** (Huber): subtle, self-perceived disturbances of thinking, speech and perception (thought interference, pressure, blocking, disturbance of receptive speech). The COGDIS and COPER criteria built from them are used, with ultra-high-risk criteria, to identify people at clinical high risk of psychosis.
:::

:::recall
1. What did Jaspers mean by the form and the content of an experience? || Form is what kind of experience it is (for example a hallucination); content is what it is about. Form carries diagnostic weight; content carries meaning and risk.
2. Distinguish understanding from explaining. || Understanding grasps meaningful connections from the inside; explaining links events by cause from the outside.
3. Why must "ununderstandable" be used with caution? || It depends on the observer's effort, language and culture.
4. Name two phenomenological instruments or concepts used today. || SCAN/PSE; EASE (anomalous self-experience); basic symptoms (COGDIS/COPER).
:::

:::mcq
Q: Two patients hear voices: one hears God praising him, the other hears neighbours insulting him. Both are external, third-person and heard in clear consciousness. Phenomenologically:
- They are different phenomena because the content differs
- *They share the same form; the content differs and carries meaning and risk
- Only the insulting voices are hallucinations
- Neither can be classified without a brain scan
> Form is classified; content is explored for meaning, culture and danger.
:::

## 4.2 Passivity, the self and first-rank symptoms: what the evidence says [core][advanced]
Kurt Schneider listed **first-rank symptoms** (FRS) as experiences that, in the absence of organic disease, he considered strongly suggestive of schizophrenia. They are still taught everywhere. Here is how far that claim holds.

### The first-rank symptoms
- Audible thoughts (thought echo)
- Voices arguing or discussing the patient (third person)
- Voices commenting on the patient's actions (running commentary)
- Somatic passivity
- Thought insertion, thought withdrawal, thought broadcasting
- Delusional perception
- Made feelings, made impulses and made actions (passivity of affect, drive and volition)

What they share is a **breakdown of the boundary between self and world**: something that should belong to the self (a thought, a movement, a feeling) is experienced as coming from outside.

:::widget guess
{"prompt": "In a large review of diagnostic studies, first-rank symptoms correctly identified what share of people who truly had schizophrenia?", "min": 0, "max": 100, "unit": "%", "answer": [55, 62], "reveal": "Only about 57 to 60 in 100. Many people with schizophrenia never show a first-rank symptom. And some people with other psychoses, especially mania and psychotic depression, do show them. So FRS help you suspect schizophrenia and refer, but cannot make the diagnosis alone.", "clinician": "A large 2015 systematic review of FRS against all other diagnoses found sensitivity about 57% and specificity about 81%; against other psychoses, sensitivity about 58% and specificity about 75%. The authors concluded FRS should not be used alone to diagnose schizophrenia."}
:::

### Where the rulebooks now stand
- **DSM-5** removed the special rule that one bizarre delusion or one FRS-type voice was enough for criterion A of schizophrenia. All psychotic symptoms now count equally.
- **ICD-11** keeps passivity, influence and control experiences, and thought insertion, withdrawal and broadcasting, among the core symptoms of schizophrenia, but no single symptom is enough, and FRS no longer carry special weight.

### Eliciting passivity without leading
:::word Questions that work
- "Do you ever feel your thoughts are not your own, as if they were put there from outside?"
- "Do your thoughts ever stop suddenly, as if taken away?"
- "Do you feel other people can know or hear what you are thinking, without you speaking?"
- "Do you feel your movements or feelings are controlled by someone or something else?"
Then always check the "as if": "Does it feel as if, or are you sure it really happens?" A thought that only feels alien in a figure of speech is not thought insertion.
:::

:::trap Look-alikes of thought insertion
- **Obsessions**: unwanted but recognised as one's own thoughts.
- **Intrusive memories in PTSD**: unwanted, but known to be one's own memories.
- **Religious inspiration or "the voice of conscience"**: often culturally shared, felt as guidance, ownership preserved.
- **Dissociative and possession states**: may include speech or actions felt as another's, but usually with other dissociative features and in a culturally framed context.
:::

:::widget decide
{"scene": "Dr Rao is assessing Priyanka, 24, a postgraduate student in Hyderabad, with a three-week history of no sleep, rapid speech and spending. She says, 'My thoughts are being broadcast to the whole campus.' A colleague says, 'That's a first-rank symptom: schizophrenia.'", "ask": "What is the best response?", "choices": [{"label": "Agree; first-rank symptoms confirm schizophrenia", "verdict": "harm", "outcome": "She is labelled with schizophrenia; mood stabilisation is delayed, and the next manic relapse is not anticipated.", "why": "FRS occur in mania and psychotic depression. The overall pattern (sleep, speech, spending) points to mania with psychotic features."}, {"label": "Record the symptom precisely, weigh it in the whole picture, and consider bipolar disorder (manic episode with psychotic features) as the leading diagnosis", "verdict": "best", "outcome": "She is treated for mania and recovers; a family history of bipolar disorder later emerges.", "why": "FRS are neither necessary nor sufficient. Diagnosis rests on the full pattern over time."}, {"label": "Ignore the symptom because she is manic", "verdict": "ok", "outcome": "The note is incomplete; the next clinician cannot see that she had passivity experiences.", "why": "Record every finding exactly. Its diagnostic weight is a separate judgement."}]}
:::

:::recall
1. List Schneider's first-rank symptoms. || Thought echo; third-person discussing voices; running commentary; somatic passivity; thought insertion, withdrawal and broadcasting; delusional perception; made feelings, impulses and actions.
2. What do FRS have in common? || A breakdown of the self–world boundary: something of the self is experienced as coming from outside.
3. What did the large 2015 systematic review conclude? || Sensitivity about 57–58%; specificity about 75–81%; FRS should not be used alone to diagnose schizophrenia.
4. Name three look-alikes of thought insertion. || Obsessions, PTSD intrusions, religious inspiration (also dissociative states).
:::

:::mcq
Q: Which statement about first-rank symptoms is best supported by evidence?
- They are present in nearly all people with schizophrenia
- They never occur in mania
- *They are moderately specific but miss many cases, so they cannot diagnose schizophrenia alone
- DSM-5-TR still lets one FRS meet criterion A on its own
> FRS occur in mood disorders with psychosis and are absent in many with schizophrenia.
:::

## 4.3 Structured interviews and the problem of reliability [core][advanced]
Before the 1970s, two psychiatrists seeing the same patient often gave different diagnoses. The famous US–UK Diagnostic Project found that New York psychiatrists diagnosed schizophrenia far more often than London psychiatrists in similar patients. Much of the difference came from how they interviewed and what they counted. This drove the move to explicit criteria (DSM-III, 1980) and to structured interviews.

### Kinds of interview
| Type | What it is | Examples |
|---|---|---|
| Unstructured | The ordinary clinical interview; content and order chosen by the clinician | Routine OPD assessment |
| Semi-structured | Set questions and probes, but the clinician judges whether a symptom is present | SCID-5, SCAN, K-SADS-PL |
| Fully structured | Questions read exactly as written; answers coded without clinical judgement; lay interviewers can use it | CIDI (World Mental Health surveys), MINI (short, often used in trials) |
| Rating scales | Measure severity once the diagnosis is known | HAM-D, MADRS, YMRS, PANSS, Y-BOCS, CAPS-5 |

:::define Inter-rater reliability and kappa
Inter-rater reliability is the degree to which two raters agree. **Cohen's kappa** corrects simple agreement for agreement expected by chance: 1 means perfect agreement, 0 means no better than chance. Rough guide: above 0.8 excellent, 0.6 to 0.8 good, 0.4 to 0.6 fair to moderate, below 0.4 poor.
:::

:::widget guess
{"prompt": "In the DSM-5 field trials, real clinicians in ordinary clinics each interviewed the same patients. What was the agreement (kappa) for major depressive disorder? (0 means chance, 1 means perfect)", "min": 0, "max": 1, "step": 0.05, "unit": "kappa", "answer": [0.25, 0.35], "reveal": "Only about 0.3, which counts as poor. Generalised anxiety disorder was even lower, about 0.2. Some diagnoses did much better: PTSD about 0.67, autism about 0.69. Even common diagnoses can be unreliable when clinicians interview in their own way.", "clinician": "The 2013 DSM-5 field trials (test–retest, separate clinicians, routine settings) reported kappas of about 0.28 for MDD, 0.20 for GAD, 0.46 for schizophrenia, 0.56 for bipolar I and 0.67 for PTSD. Methods differed from earlier trials, which used joint interviews and inflated agreement."}
:::

### Why agreement fails
- **Information variance**: the clinicians obtained different information (one asked about past highs; one did not).
- **Observation variance**: they saw the same thing but judged it differently (is this blunting or depression?).
- **Criterion variance**: they used different rules to reach a diagnosis.
- **Patient variance**: the patient really changed between interviews.

Structured interviews mainly reduce information variance. They do not remove judgement.

:::clinician
### Choosing an instrument
- **SCID-5-CV** (clinician version): DSM-5 diagnoses in clinical settings; 1 to 2 hours; needs training. The research version adds subtypes and specifiers.
- **MINI 7.x**: about 15 to 30 minutes; screening and trials; less nuanced and tends to over-include.
- **SCAN** (WHO): phenomenologically rich, glossary-based, used in cross-national research including India.
- **K-SADS-PL**: children and adolescents, interviewing parent and child separately.
- **Severity scales**: HAM-D 17 (clinician), MADRS (sensitive to change), PHQ-9 (self-report screen; 10 or more suggests moderate depression), YMRS for mania, PANSS (30 items: positive, negative and general psychopathology), Y-BOCS, CAPS-5 for PTSD, C-SSRS for suicidal ideation and behaviour.
- **Validation in India.** Check that the translation, cut-offs and norms suit the population. A cut-off validated in one language or setting does not transfer automatically.
:::

:::widget decide
{"scene": "A district mental health programme in Odisha wants to find out how many villagers have depression. The team has lay health workers with two days of training and no clinicians.", "ask": "Which approach fits best?", "choices": [{"label": "Train them to use the SCID-5-CV", "verdict": "harm", "outcome": "Workers struggle with clinical judgements; results vary wildly between villages.", "why": "Semi-structured interviews need clinical training to judge whether a symptom is present."}, {"label": "Use a validated, fully structured interview or a validated screen in the local language, with a clinician confirming a sample of positives", "verdict": "best", "outcome": "The survey is consistent across workers, and clinician checks show how accurate the screen is locally.", "why": "Fully structured tools suit lay interviewers; local validation and clinical confirmation guard accuracy."}, {"label": "Ask the workers to judge 'who looks depressed'", "verdict": "harm", "outcome": "Women who cry openly are over-counted; quiet men are missed.", "why": "Unstructured lay judgement brings large observation and criterion variance."}]}
:::

:::recall
1. Distinguish semi-structured from fully structured interviews, with an example of each. || Semi-structured: set questions, clinician judges (SCID-5, SCAN). Fully structured: read verbatim, no judgement, lay use (CIDI, MINI).
2. What does kappa correct for, and what do 0 and 1 mean? || Chance agreement; 0 = chance, 1 = perfect.
3. Give approximate DSM-5 field-trial kappas for MDD, GAD and PTSD. || About 0.28, 0.20 and 0.67.
4. Name the four sources of diagnostic disagreement. || Information, observation, criterion and patient variance.
:::

:::mcq
Q: Two psychiatrists disagree on a diagnosis because one asked about past manic episodes and the other did not. This is:
- Observation variance
- *Information variance
- Criterion variance
- Patient variance
> They had different information. Structured interviews mainly reduce this.
:::

## 4.4 Capacity and consent inside the interview [core][advanced]
Every interview that ends in a treatment decision quietly includes a question: **can this person make this decision?** In India the Mental Healthcare Act 2017 puts capacity at the centre.

### The legal test
Under section 4 of the Act, every person, including a person with mental illness, is presumed to have capacity to make mental healthcare and treatment decisions if they can:
1. **Understand** the information relevant to the decision;
2. **Appreciate** any reasonably foreseeable consequence of making, or not making, the decision; and
3. **Communicate** the decision, by speech, writing, signs or any other means.

Information must be given in simple language the person understands, using sign language or visual aids where needed. A decision others consider unwise does not, by itself, show a lack of capacity.

:::analogy A bridge with three planks
Capacity is a bridge across to a decision. The planks are understanding, appreciating and communicating. Missing any plank means the person cannot cross for **this** decision **today**; it says nothing about other decisions or other days.
:::

### Four principles of capacity assessment
- **Decision-specific.** Capacity to agree to a blood test is not capacity to refuse ECT.
- **Time-specific.** It can change with delirium, intoxication or recovery. Reassess.
- **Supported first.** Give the information in the best way for this person (language, time, a trusted person, pictures) before concluding they lack capacity.
- **Not the diagnosis.** A person with schizophrenia may have full capacity; a person with no diagnosis may lack it when intoxicated.

### Related provisions to know
- **Advance directive** (section 5): a person with capacity can state how they wish, or do not wish, to be cared for, and who should be their nominated representative, if they later lose capacity.
- **Nominated representative** (section 14): chosen by the person; supports decisions and receives information when the person lacks capacity.
- **Admissions**: independent admission (the person consents), supported admission (when criteria are met, with a nominated representative), and emergency treatment for a short, defined period to prevent death or serious harm.

:::widget decide
{"scene": "Mr Thomas, 58, with schizophrenia and diabetes, is advised to have a toe amputated for gangrene. He refuses. He explains, accurately, what gangrene is and that the infection could spread and kill him. He says he would rather die with his body whole, as his faith teaches. His MSE shows stable, long-standing delusions about his neighbours, unrelated to the decision.", "ask": "Does he have capacity to refuse surgery?", "choices": [{"label": "No: he has schizophrenia, so he cannot decide", "verdict": "harm", "outcome": "The team tries to override his refusal; an ethics complaint follows and his trust in all treatment collapses.", "why": "A diagnosis does not remove capacity. The test is decision-specific."}, {"label": "Yes, most likely: he understands, appreciates the consequences and communicates clearly, and his delusions do not touch this decision. Document the assessment, keep offering treatment and involve him and his family", "verdict": "best", "outcome": "He continues wound care and antibiotics. A week later, after talks with his priest, he agrees to a smaller procedure.", "why": "Capacity is judged on the three abilities for this decision. An unwise choice is not proof of incapacity. Respect plus continued engagement often finds a way."}, {"label": "Ask his wife to consent instead", "verdict": "harm", "outcome": "The surgeon refuses; the delay worsens the infection.", "why": "A relative cannot simply replace a capacitous adult's decision."}]}
:::

:::clinician
### Documenting a capacity assessment
State the specific decision; the information given, in what language and format; the person's own words showing understanding and appreciation (or their absence); how the decision was communicated; the steps taken to support the decision; whether the finding is likely to change and when you will reassess; and who else was consulted (nominated representative, family with consent). Appelbaum's four-ability model (express a choice, understand, appreciate, reason) is a useful structure and maps closely onto the Act's test.
:::

:::recall
1. State the three abilities in section 4 of the Mental Healthcare Act. || Understand relevant information; appreciate foreseeable consequences; communicate the decision.
2. Give four principles of capacity assessment. || Decision-specific; time-specific; supported first; not determined by diagnosis.
3. What is an advance directive under the Act? || A statement made with capacity about how one wishes (or does not wish) to be treated, and who should be the nominated representative, if capacity is later lost.
:::

:::mcq
Q: A man with bipolar disorder in remission refuses lithium. He understands the risks, weighs them, and explains he prefers to accept the risk of relapse. Under the Mental Healthcare Act:
- He lacks capacity because the choice is unwise
- His family's view decides
- *He has capacity for this decision; an unwise choice alone does not show incapacity
- Capacity cannot be judged in bipolar disorder
> Section 4(3) is explicit on this point.
:::

## 4.5 The MSE through new lenses: ICD-11, HiTOP and RDoC [core][advanced]
The MSE was built for categories: is the symptom present or absent? Newer systems ask a different question: **how much, and along which dimensions?**

### ICD-11: rating dimensions inside the categories
- For primary psychotic disorders, ICD-11 offers **symptom specifiers** rated as not present, mild, moderate or severe: positive symptoms, negative symptoms, depressive mood symptoms, manic mood symptoms, psychomotor symptoms and cognitive symptoms. Your MSE findings feed straight into these ratings.
- ICD-11 dropped the old **subtypes of schizophrenia** (paranoid, hebephrenic, catatonic and others), because they were unstable over time and predicted little.
- **Catatonia** is a syndrome in its own right that can occur with many disorders.
- **Personality disorder** is now one diagnosis graded by **severity** (mild, moderate, severe), with optional **trait domains**: negative affectivity, detachment, dissociality, disinhibition and anankastia, plus a borderline pattern specifier. The interview therefore asks how badly self and relationships are affected, not which of ten boxes fits.

### HiTOP: symptoms arranged like a family tree
The Hierarchical Taxonomy of Psychopathology groups symptoms by how they actually co-occur in data. Narrow symptoms combine into syndromes, syndromes into subfactors, and subfactors into broad **spectra**:
- Internalising (distress and fear: depression, generalised anxiety, PTSD, panic, phobias)
- Thought disorder (psychosis, and the cognitive end of mania)
- Detachment (social withdrawal, restricted affect)
- Disinhibited externalising (impulsivity, substance use)
- Antagonistic externalising (hostility, manipulativeness)
- Somatoform (bodily distress)
Above these sits a general factor (often called "p"), reflecting a person's overall liability to psychopathology.

### RDoC: from symptoms to systems
The US National Institute of Mental Health's Research Domain Criteria study mental functions from genes to behaviour across six domains: negative valence systems (fear, loss), positive valence systems (reward), cognitive systems, systems for social processes, arousal and regulatory systems (including sleep), and sensorimotor systems. RDoC is a research framework, not a clinical diagnosis.

:::widget sort
{"prompt": "Map each MSE finding to the HiTOP spectrum it most belongs to.", "buckets": ["Internalising", "Thought disorder", "Detachment", "Disinhibited externalising"], "items": [{"text": "Persistent low mood and worthlessness", "bucket": 0}, {"text": "Third-person auditory hallucinations", "bucket": 1}, {"text": "Prefers being alone; restricted range of affect for years", "bucket": 2}, {"text": "Daily alcohol, impulsive spending, acts without thinking", "bucket": 3}, {"text": "Panic attacks with fear of dying", "bucket": 0}, {"text": "Loosening of associations", "bucket": 1}]}
:::

:::widget reveal
{"prompt": "How would a HiTOP-minded clinician write the summary of a patient who has depression, panic and PTSD all at once?", "answer": "Instead of listing three separate disorders as if they were unrelated, they would note high internalising severity, with prominent distress (depression, PTSD) and fear (panic) components, and rate each dimension. This explains why the three so often come together and why one treatment (for example CBT or an SSRI) often helps all three."}
:::

:::clinician
### What this changes at the bedside
- Rate severity on every MSE domain, not only presence. A short dimensional rating (0 to 3) per domain is quick and tracks change.
- Record transdiagnostic features that predict outcome across diagnoses: anhedonia, sleep disruption, cognitive impairment, suicidal ideation and functioning.
- HiTOP-informed measures (for example the HiTOP self-report inventories) are entering research and some clinics, but routine Indian practice and examinations still use DSM-5-TR and ICD-11 categories. Use both: categories for communication and law; dimensions for formulation and monitoring.
:::

:::recall
1. Name the six ICD-11 symptom specifiers for primary psychotic disorders. || Positive, negative, depressive mood, manic mood, psychomotor and cognitive symptoms.
2. What did ICD-11 do with schizophrenia subtypes? || Removed them.
3. List the six HiTOP spectra. || Internalising, thought disorder, detachment, disinhibited externalising, antagonistic externalising, somatoform.
4. Name the six RDoC domains. || Negative valence, positive valence, cognitive, social processes, arousal and regulatory, sensorimotor.
:::

:::mcq
Q: Under ICD-11, a patient with personality difficulties is described by:
- One of ten specific personality disorder types
- *A severity level, with optional trait domains and a borderline pattern specifier
- A single yes/no label
- RDoC domains
> ICD-11 moved personality disorder to a severity-plus-traits model.
:::

## 4.6 The interview's frontier: speech analysis, phones and AI [core][advanced]
The interview is changing faster now than at any time since structured interviews arrived. As of November 2026, here is what has evidence, what is promising and what is still hype.

### Automated speech and language analysis
Computer analysis of speech can measure things a clinician perceives only roughly: how closely each sentence links to the last (semantic coherence), sentence complexity, pauses, and use of pronouns. In small studies of young people at clinical high risk, lower coherence and simpler syntax predicted later transition to psychosis better than chance, and similar markers track negative symptoms and thought disorder.

The limits are real: small samples, mostly English speakers, results that often weaken in new groups, and no validated clinical tool. Whether such measures work in Hindi, Tamil or code-switched Hinglish speech is largely untested.

### Digital phenotyping
Smartphones and wearables can passively record sleep, movement, phone use and social activity. Changes in these signals sometimes precede relapse in bipolar disorder and psychosis. Questions of consent, privacy, data ownership and false alarms are unsolved, and very few tools are used in routine care.

### AI documentation and "AI patients"
- **Ambient AI scribes** listen to a consultation and draft the note. They save typing time, but they can miss non-verbal findings that are central to the MSE, and can invent details. A large observational study published in January 2026 found that notes from primary-care visits using an AI scribe recorded more psychiatric symptoms, yet those visits were slightly less likely to lead to a depression diagnosis, antidepressant or referral (about 14% versus 17%). More documentation did not mean more action. Causation is not proven.
- **Simulated patients built on large language models** are increasingly used to let trainees practise interviews and receive feedback. They can rehearse wording and structure; they cannot yet reproduce the subtle non-verbal and relational texture of a real interview.

:::widget decide
{"scene": "Your hospital in Bengaluru pilots an AI scribe in the psychiatry OPD. After a consultation with a quiet, withdrawn young man, the draft note reads: 'Mood good. No psychotic symptoms. Plan: continue.' You noticed him glancing at an empty corner and muttering twice.", "ask": "What do you do?", "choices": [{"label": "Sign the note; the AI recorded what was said", "verdict": "harm", "outcome": "Six weeks later he is admitted with severe psychosis; the record shows no warning signs.", "why": "The scribe can only record speech. Observed behaviour (hallucinatory behaviour, affect, psychomotor change) is the clinician's responsibility."}, {"label": "Edit the note to add the observed hallucinatory behaviour and affect, ask him directly about voices, and record his answer", "verdict": "best", "outcome": "He admits hearing a voice for a week. Early treatment begins.", "why": "AI drafts are drafts. The MSE depends on observation, and the clinician signs for every line."}, {"label": "Stop using any notes and rely on memory", "verdict": "ok", "outcome": "Your notes become patchy and late.", "why": "Rejecting the tool entirely loses its benefits; the answer is careful review, not abandonment."}]}
:::

:::clinician
### Using AI tools responsibly
- Get explicit consent before any recording; explain where audio and text are stored and who can access them, in line with India's Digital Personal Data Protection Act 2023 and institutional policy.
- Read every AI-drafted note in full; add the observed MSE; delete anything not said or seen.
- Do not paste identifiable patient information into public chatbots.
- Treat language-analysis and digital-phenotyping outputs as research signals until validated in your population.
:::

:::recall
1. What do automated speech measures in psychosis risk research capture? || Semantic coherence, syntactic complexity, pauses, pronoun use and similar markers.
2. Give three limits of this research as of late 2026. || Small samples, poor replication in new groups, mostly English, no validated clinical tool.
3. What did the 2026 AI-scribe study find? || More psychiatric symptoms documented but slightly fewer depression diagnoses, prescriptions or referrals; observational, not causal.
:::

:::mcq
Q: Which MSE content is an audio-only AI scribe most likely to miss?
- The patient's stated mood
- *Observed hallucinatory behaviour, facial affect and psychomotor change
- The chief complaint
- The list of current medicines
> Observation is the core of the MSE and cannot be heard.
:::

## 4.7 Hard interviews: deception, interpreters, trauma and conflict [core][advanced]
Some interviews test everything you know. This section gathers the hardest.

### When the account may not be true
People may exaggerate, minimise or invent symptoms for many reasons. Know the terms precisely.
| Term | Symptoms are | Motive |
|---|---|---|
| Malingering | Intentionally produced or exaggerated | External gain (money, avoiding prison or duty, drugs) |
| Factitious disorder | Intentionally produced or falsified | To be seen as ill, with no obvious external reward |
| Functional (conversion) disorder | Not intentionally produced | Not a choice; a real disorder of nervous system function |

Clues that raise the question of feigned psychosis: dramatic, over-endorsed symptoms; voices that are continuous and vague; claiming obvious "textbook" symptoms but not subtle ones; symptoms that change when the person thinks they are not observed; a clear external incentive. None is proof. Record what you saw; avoid the word "malingering" without a full assessment.

:::clinician
### Tools for suspected feigning
The Structured Interview of Reported Symptoms (SIRS-2) and the shorter M-FAST screen for feigned psychiatric symptoms; performance-validity tests (for example the Test of Memory Malingering) check effort on cognitive testing. Results are interpreted alongside collateral information, records and longitudinal observation. In Indian forensic practice, most of these instruments lack local norms, so caution and documentation matter even more.
:::

### Working with interpreters
- Use a trained interpreter, not a family member or child, especially for sensitive topics.
- Brief them before: confidentiality, word-for-word interpretation, no summarising, and tell you when a word has no direct equivalent.
- Speak to the patient, not to the interpreter. Short sentences.
- Thought disorder can be hidden or invented by interpretation; ask the interpreter afterwards whether speech seemed odd **in the patient's language**.

### Trauma-informed interviewing
- Explain why you are asking, and that the person can decline or pause.
- Ask about what happened only as much as is needed now; detail can wait.
- Watch for dissociation (glazed look, delayed responses); ground gently (name, place, the room).
- Never interview a survivor of violence in front of the person who may be harming them.

:::widget decide
{"scene": "Fatima, 26, brought by her husband to an OPD in Delhi for 'fits and weakness', speaks only Urdu-accented Hindi and looks at her husband before every answer. He offers to interpret 'because she gets confused'. You notice faded bruises on her forearms.", "ask": "What is your next step?", "choices": [{"label": "Let the husband interpret to save time", "verdict": "harm", "outcome": "He answers for her. The bruises are explained as 'falls during fits'. She leaves without disclosing anything.", "why": "A possible abuser cannot be her interpreter or her informant for sensitive topics."}, {"label": "Thank him and, using routine clinic practice, see her alone with a female staff member (and a trained interpreter if needed); ask open, then gentle direct questions about safety at home", "verdict": "best", "outcome": "Alone, she says he hits her when he drinks. The team assesses risk, documents injuries and links her with support services, with her consent.", "why": "Routine private time protects disclosure without singling anyone out. Safety enquiry is part of every assessment."}, {"label": "Confront the husband about the bruises in front of her", "verdict": "harm", "outcome": "He takes her home immediately; she misses follow-up and her risk rises.", "why": "Confrontation in front of a possible abuser increases danger to the victim."}]}
:::

### When accounts conflict
When patient and family disagree, resist choosing a side. Record each account with its source; look for independent evidence (records, school or work reports); consider why each may see things differently (fear, stigma, inheritance disputes, protecting someone). The discrepancy is often the most useful finding of the day.

:::recall
1. Distinguish malingering, factitious disorder and functional disorder. || Intentional for external gain; intentional to be seen as ill; not intentional.
2. Give three clues that raise the question of feigned psychosis. || Dramatic over-endorsement; vague continuous voices; obvious but not subtle symptoms; change when unobserved; clear incentive.
3. Give four rules for working with interpreters. || Trained, not family; brief beforehand; speak to the patient; ask afterwards about speech oddities in the patient's language.
4. Who should never interpret for a possible victim of abuse? || The suspected abuser (or other family members for sensitive topics).
:::

:::mcq
Q: A man facing a court case reports "constant voices telling me everything" and all classic symptoms on a checklist, but none of the subtle features of psychosis. The best course is:
- Diagnose schizophrenia
- Write "malingering" in the notes
- *Record exactly what was reported and observed, gather collateral and records, observe over time, and consider structured tests for feigning
- Refuse to assess him
> Feigning is a hypothesis to test, not a label to apply after one interview.
:::
`;
