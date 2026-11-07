import type { LongQA } from "@/lib/prep/long-types";
import { brain, chain, compare, cycle, layers, timeline, tree } from "./visual";

export const PSYCHOPATHOLOGY_L02: LongQA[] = [
  {
    id: "psyp-l02-001",
    subject: "psychopathology",
    topic: "hallucination",
    marks: 10,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance", "ma-semester"],
    question: "Define hallucination. Classify hallucinations and discuss their clinical significance.",
    plan: ["Definitions from Esquirol and Jaspers", "Distinguish from illusion, imagery and pseudohallucination", "Classify by modality and special types", "Link each type to likely conditions", "Explain theories in brief", "Conclude"],
    answer: `## Definition
A hallucination is a perception without an object (Esquirol). Jaspers described it more fully as a false perception that is not a sensory distortion or misinterpretation, occurring at the same time as real perceptions, and having the vivid, concrete, objective quality of a normal perception.

## Distinguishing features
| Experience | Stimulus present? | Location | Voluntary? |
| Hallucination | No | Outer objective space | No |
| Illusion | Yes, misperceived | Outer space | No |
| Pseudohallucination | No | Inner subjective space | No |
| Imagery | No | Inner space | Yes |

## Classification by modality
- Auditory: the commonest in psychiatry. Elementary (noises, bangs) or complex (voices). Second person voices (commanding, abusive) occur in depression and schizophrenia; third person voices, commentary and thought echo are first rank symptoms.
- Visual: suggest an organic cause such as delirium, dementia with Lewy bodies, drug intoxication, epilepsy or eye disease (Charles Bonnet syndrome). Lilliputian hallucinations (small people) are typical of delirium tremens.
- Olfactory and gustatory: temporal lobe epilepsy (uncinate fits), also depression (the smell of one's own rotting body) and schizophrenia.
- Tactile (haptic): formication in cocaine use and alcohol withdrawal ("cocaine bugs"); sexual tactile hallucinations in schizophrenia.
- Somatic and visceral: bodily sensations such as organs moving.
- Kinaesthetic and vestibular: sensations of movement, seen in alcohol withdrawal and drug states.

## Special types
- Hypnagogic (falling asleep) and hypnopompic (waking): common in healthy people and in narcolepsy.
- Functional: a hallucination triggered by a real stimulus in the same modality, both perceived together (voices heard in the running water).
- Reflex: a stimulus in one modality produces a hallucination in another (a form of synaesthesia).
- Extracampine: perceived outside the sensory field (a voice heard from another city).
- Autoscopy: seeing oneself.
- Negative hallucination: failing to perceive something that is present (in hypnosis).

## Clinical significance
- Modality guides diagnosis: visual points to organic causes, third person voices to schizophrenia, mood congruent voices to psychotic depression or mania.
- Command hallucinations raise risk, especially when the person believes the voice is powerful and cannot be resisted.
- Hallucinations also occur in grief, sensory deprivation, sleep deprivation and in about 5 to 10 percent of the general population at some time, so context matters.
- Phenomenology must be recorded in the patient's own words: content, frequency, person, location, response and insight.

## Theories
Leading models see auditory hallucinations as inner speech wrongly attributed to an outside source, due to a failure of self monitoring (corollary discharge). Imaging during voices shows activity in speech areas, including Broca's area and the superior temporal gyrus. Top down expectations overriding weak sensory input (predictive processing) are another current model.

## Conclusion
Hallucinations are classified by modality and special type. Their form tells the clinician more than their content about the likely cause.`,
    keyPoints: ["Esquirol and Jaspers definitions", "Distinction from illusion, imagery and pseudohallucination", "All main modalities with linked conditions", "At least four special types", "Visual hallucinations suggest organic cause", "Risk of command hallucinations", "One theory of mechanism"],
    pitfalls: ["Calling hypnagogic hallucinations pathological", "No link between type and diagnosis", "Missing functional and reflex hallucinations"],
    visuals: [
      brain("Where voices are made", { broca: "Inner speech is generated here and is active during voices", wernicke: "Speech perception; superior temporal gyrus active as if hearing", temporal: "Auditory cortex responds to voices with no outside sound", prefrontal: "Self monitoring fails to tag the speech as one's own" }, "One model: inner speech is not recognised as self generated."),
    ],
    module: "mse-deep",
    ref: "Fish ch 3; Esquirol 1838; Jaspers; Allen et al 2008 imaging of AVH; Frith self monitoring model",
  },
  {
    id: "psyp-l02-002",
    subject: "psychopathology",
    topic: "insight",
    marks: 5,
    difficulty: 1,
    exams: ["md-psychiatry", "mcp-entrance", "ma-semester"],
    question: "Write short notes on insight in psychiatry.",
    plan: ["Define insight", "Grades of insight", "Dimensions and scales", "Clinical importance"],
    answer: `## Definition
Insight is the degree to which a person is aware of and understands that he or she is ill, the nature of the illness, and the need for treatment. It is not all or none.

## Grades of insight
A commonly taught six level scale:
- Grade 1: complete denial of illness.
- Grade 2: slight awareness of being sick and needing help, while denying it at the same time.
- Grade 3: awareness of being sick, but blaming others, outside factors or a physical cause.
- Grade 4: awareness that the illness is due to something unknown in oneself.
- Grade 5: intellectual insight: the person admits the illness and its link to his or her own feelings, but does not apply this to change.
- Grade 6: true emotional insight: understanding that leads to change in behaviour and attitude.

## Dimensions and measurement
Anthony David described three overlapping parts: recognition of illness, the ability to relabel unusual experiences as part of illness, and acceptance of treatment. Scales include the Schedule for Assessment of Insight, the Scale to Assess Unawareness of Mental Disorder, and the Beck Cognitive Insight Scale.

## Clinical importance
- Poor insight predicts non adherence and relapse.
- Insight is not the same as capacity under the MHCA 2017: a person may deny illness yet understand and decide about a specific treatment.
- In anosognosia after right parietal lesions, lack of insight is neurological.
- Rapid gain in insight after psychosis can bring post psychotic depression and suicide risk.
- Cultural explanations (spirit possession, black magic) are not automatically poor insight.

## Conclusion
Insight should be recorded in grades and dimensions, rechecked over time, and used to plan engagement rather than to label a patient.`,
    keyPoints: ["Definition", "Six grades", "David's three dimensions", "A named scale", "Adherence and suicide risk links", "Difference from capacity under MHCA"],
    module: "mse-deep",
    ref: "Kaplan and Sadock MSE insight grades; David 1990; Amador SUMD; MHCA 2017 s4",
  },
  {
    id: "psyp-l02-003",
    subject: "psychopathology",
    topic: "consciousness",
    marks: 5,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "Write short notes on disorders of consciousness.",
    plan: ["Define consciousness and how it is assessed", "Quantitative disorders in order", "Qualitative disorders", "Clinical relevance"],
    answer: `## Meaning
Consciousness is the state of awareness of the self and the environment. Clinically it has two aspects: level (arousal, from alert to coma) and content (clarity and range of awareness). It is assessed by observation, response to stimuli and the Glasgow Coma Scale (eye, verbal and motor responses, total 3 to 15).

## Lowered level of consciousness
- Drowsiness: the person falls asleep without stimulation but can be fully woken.
- Clouding of consciousness: mild impairment of thinking, attention, perception and memory, with drowsiness. Typical of early delirium.
- Stupor: the person is mute and immobile but may respond to painful stimuli; in organic stupor consciousness is reduced, while in depressive or catatonic stupor the person may later recall events.
- Coma: no response even to painful stimuli.

## Altered content of consciousness
- Delirium: fluctuating disturbance of attention and awareness, with disorientation, perceptual disturbance, worse at night.
- Twilight state: narrowing of consciousness with abrupt onset and end, apparently organised behaviour and later amnesia; seen after epileptic seizures and in alcohol intoxication.
- Narrowing of consciousness: attention is fixed on a small range of ideas, as in dissociative states and intense emotion.
- Dream like (oneiroid) states, and heightened consciousness in mania or drug states.

## Clinical relevance
Any fall in consciousness suggests an organic cause and needs urgent medical assessment. It also invalidates cognitive testing at that moment.

## Conclusion
Separate level from content, record the Glasgow Coma Scale, and always look for a physical cause.`,
    keyPoints: ["Level versus content", "Glasgow Coma Scale range", "Drowsiness, clouding, stupor, coma in order", "Delirium and twilight states", "Organic cause must be sought"],
    module: "mse-deep",
    ref: "Fish ch 9 disorders of consciousness; GCS Teasdale and Jennett 1974",
  },
  {
    id: "psyp-l02-004",
    subject: "psychopathology",
    topic: "negative-symptoms",
    marks: 10,
    difficulty: 3,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "Discuss the concept, assessment and clinical significance of negative symptoms in schizophrenia.",
    plan: ["Definition and history", "Five domains with examples", "Primary versus secondary and deficit syndrome", "Assessment scales", "Treatment and outcome", "Conclusion"],
    answer: `## Concept and history
Negative symptoms are a reduction or loss of normal functions, in contrast to positive symptoms which are an excess or distortion. The idea goes back to Hughlings Jackson. Tim Crow proposed Type I schizophrenia (positive symptoms, acute, good drug response, dopamine related) and Type II (negative symptoms, chronic, poor response, enlarged ventricles). Andreasen developed the Scale for the Assessment of Negative Symptoms.

## Five domains
Current consensus groups them into two factors:
- Diminished expression: blunted affect (reduced facial expression, gestures and vocal tone) and alogia (poverty of speech).
- Reduced motivation and pleasure: avolition (little initiative for goal directed activity), anhedonia (reduced pleasure, especially anticipatory), and asociality (withdrawal from relationships).
Studies show patients often enjoy pleasant events in the moment (consummatory pleasure) but fail to anticipate pleasure and to act on it.

## Primary and secondary negative symptoms
Secondary negative symptoms arise from other causes:
- Positive symptoms (withdrawal because of paranoia).
- Depression.
- Antipsychotic side effects, especially parkinsonism and sedation.
- Institutionalisation and lack of stimulation.
- Substance use.
Primary negative symptoms are part of the illness itself. William Carpenter's deficit syndrome describes enduring primary negative symptoms present for at least 12 months, including during stable periods.

## Assessment
| Scale | Note |
| Scale for the Assessment of Negative Symptoms | Andreasen, older, includes attention |
| Positive and Negative Syndrome Scale (negative subscale) | Widely used in trials |
| Brief Negative Symptom Scale | Covers all five domains |
| Clinical Assessment Interview for Negative Symptoms | Separates expression and experience |
Assessment includes behaviour in the interview, reports from family and a review of daily activities.

## Clinical significance
- Strongly linked to poor social and occupational functioning, more than positive symptoms.
- Predict poor long term outcome and are less responsive to antipsychotics.
- Overlap with depression and drug side effects, so careful differential diagnosis matters.

## Management
- Treat secondary causes first: reduce dose, treat depression and parkinsonism, treat substance use.
- Medicines: evidence is modest. Some benefit is reported for adding an antidepressant, and cariprazine showed benefit over risperidone in one trial of predominant negative symptoms. Clozapine helps overall in treatment resistance.
- Psychosocial: social skills training, cognitive behaviour therapy, cognitive remediation, exercise, supported employment and family work are the mainstay.
- In India, family involvement and community based rehabilitation programmes help sustain gains.

## Conclusion
Negative symptoms are the main barrier to recovery in schizophrenia. They should be assessed in all five domains, separated from secondary causes, and treated mainly with psychosocial methods.`,
    keyPoints: ["Definition and Crow's Type I and II", "Five domains and two factors", "Primary versus secondary with causes", "Deficit syndrome (Carpenter)", "At least two scales", "Link to functional outcome", "Management including psychosocial methods"],
    pitfalls: ["Not separating secondary causes", "Listing only alogia and flat affect", "Claiming antipsychotics reliably treat them"],
    visuals: [
      tree("Negative symptoms", [
        ["Negative symptoms", "Loss of normal function", -1],
        ["Diminished expression", "", 0],
        ["Blunted affect", "Less face, gesture, tone", 1],
        ["Alogia", "Poverty of speech", 1],
        ["Motivation and pleasure", "", 0],
        ["Avolition", "Little initiative", 4],
        ["Anhedonia", "Anticipatory pleasure lost", 4],
        ["Asociality", "Withdrawal", 4],
      ]),
      compare("Primary or secondary?", ["Primary", ["Part of the illness", "Present when stable", "Lasts 12 months or more (deficit)", "Little response to medicines"], "Treat with psychosocial methods"], ["Secondary", ["From depression, side effects, paranoia", "Fluctuate with the cause", "Often improve when cause treated", "Common in the clinic"], "Find and treat the cause"]),
    ],
    module: "psychosis",
    ref: "Kirkpatrick et al 2006 NIMH consensus; Carpenter 1988 deficit syndrome; Crow 1980; Nemeth 2017 cariprazine trial",
  },
  {
    id: "psyp-l02-005",
    subject: "psychopathology",
    topic: "depersonalisation",
    marks: 5,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance", "ma-semester"],
    question: "Write short notes on depersonalisation and derealisation.",
    plan: ["Define each", "Phenomenology and descriptions", "Where they occur", "Disorder, theory and treatment"],
    answer: `## Definitions
- Depersonalisation: a change in the awareness of one's own self, so that the person feels unreal, detached or an outside observer of his or her own thoughts, feelings, body or actions.
- Derealisation: the surroundings feel unreal, flat, dreamlike, foggy or lifeless.

## Phenomenology
The experience is unpleasant and hard to describe, so patients say "as if" ("as if I am a robot", "as if behind glass"). Reality testing is intact: the person knows the change is subjective, which separates it from nihilistic delusions. Emotional numbing is common.

## Occurrence
- In healthy people with fatigue, sleep loss, intense stress, and at times of danger.
- As a symptom in panic attacks, depression, PTSD, schizophrenia (early), temporal lobe epilepsy, and after cannabis or hallucinogens.
- As depersonalisation-derealisation disorder when persistent or recurrent and distressing, not better explained by another condition. Lifetime prevalence of the disorder is around 1 to 2 percent.

## Mechanism and treatment
One model sees it as a protective inhibition of emotional processing: prefrontal regions dampen limbic (amygdala and insula) responses during overwhelming threat. Treatment is mainly psychological: psychoeducation, cognitive behavioural therapy that reduces checking and catastrophic interpretation ("I am going mad"), and treatment of anxiety or depression. Medicines have limited evidence; lamotrigine and SSRIs have been tried.

## Conclusion
Depersonalisation and derealisation are common, frightening, but insight preserving experiences. They need reassurance and treatment of the underlying condition.`,
    keyPoints: ["Clear definition of both", "As if quality and intact reality testing", "Normal and pathological settings", "Disorder criteria and prevalence", "Corticolimbic inhibition model", "CBT based treatment"],
    module: "trauma",
    ref: "DSM-5-TR depersonalization/derealization disorder; Sierra and Berrios corticolimbic model; Fish ch 7",
  },
  {
    id: "psyp-l02-006",
    subject: "psychopathology",
    topic: "affect",
    marks: 10,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance", "ma-semester"],
    question: "Describe the disorders of emotion (affect and mood) with clinical examples.",
    plan: ["Define emotion, mood and affect", "Abnormal mood states", "Abnormal affect: range, reactivity and appropriateness", "Special disorders of emotion", "How to record them in the MSE", "Conclusion"],
    answer: `## Terms
- Emotion: a short lived feeling with bodily changes, linked to an event.
- Mood: a sustained, pervasive emotional state over days; the "climate", reported by the patient.
- Affect: the moment to moment expression of emotion as seen by the observer; the "weather".
In the mental status examination mood is subjective (in the patient's words) and affect is objective.

## Abnormal mood states
- Depressed mood: sadness, emptiness, hopelessness; in severe depression "a feeling of loss of feeling".
- Elated and euphoric mood: excessive cheerfulness in mania; ecstasy in some religious and psychotic states.
- Irritable mood: common in mania, depression in the young, and organic states.
- Anxiety: apprehension with autonomic arousal; free floating or attached to situations.
- Dysphoria: unpleasant mixture of irritability and low mood, as in mixed states or withdrawal.
- Apathy: lack of feeling and interest, as in frontal lobe lesions and negative schizophrenia.

## Abnormal affect
| Term | Meaning | Example |
| Restricted or constricted | Reduced range | Depression, anxiety |
| Blunted | Severe reduction in intensity | Chronic schizophrenia |
| Flat | Almost no expression | Severe negative symptoms, parkinsonism |
| Labile | Rapid changes without cause | Mania, organic brain disease |
| Incongruent or inappropriate | Affect does not fit the content | Laughing while describing a death in schizophrenia |
| Shallow | Little depth, quickly changing | Histrionic and frontal states |

## Special disorders of emotion
- Anhedonia: loss of pleasure, in depression and schizophrenia.
- Alexithymia: difficulty identifying and describing feelings, linked to somatic presentations.
- La belle indifference: lack of concern about a disability, once linked to conversion disorder; now known to be non specific.
- Emotional incontinence or pseudobulbar affect: sudden uncontrollable laughing or crying out of keeping with mood, after strokes, multiple sclerosis or motor neurone disease.
- Morbid fear and panic, and morbid jealousy as an emotional state.
- Ambivalence: opposite feelings towards the same object at the same time, one of Bleuler's four As.

## Recording in the MSE
Write mood in quotes ("I feel dead inside"), then rate affect for quality, range, intensity, stability, reactivity and congruence with thought content. In India many patients describe mood in bodily terms ("ghabrahat", heaviness in the chest, "man nahi lagta"), so the interviewer should ask in the patient's language.

## Conclusion
Mood and affect are separate observations. Their type, range and congruence help diagnose mood, psychotic and organic disorders.`,
    keyPoints: ["Emotion, mood and affect distinguished", "At least five abnormal mood states", "Range, intensity, lability and congruence of affect", "Anhedonia and alexithymia", "Pseudobulbar affect", "How to record in the MSE", "Cultural idioms"],
    pitfalls: ["Using mood and affect as synonyms", "Calling labile affect only a sign of mania", "No examples"],
    visuals: [compare("Mood and affect in the MSE", ["Mood", ["Reported by the patient", "Sustained over days", "Written in the patient's words", "Like the climate"], "Subjective"], ["Affect", ["Observed by the clinician", "Moment to moment", "Rated for range, reactivity, congruence", "Like the weather"], "Objective"])],
    module: "mse-deep",
    ref: "Fish ch 8 disorders of emotion; Kaplan MSE chapter",
  },
  {
    id: "psyp-l02-007",
    subject: "psychopathology",
    topic: "mse-overview",
    marks: 20,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance", "ma-semester"],
    question: "Describe the mental status examination. How would you assess cognitive functions at the bedside?",
    plan: ["Define the MSE and its role beside the history", "Go through each heading with what to observe and how to ask", "Give bedside cognitive tests with norms", "Mention structured tools and Indian adaptations", "Common errors and how to write it up", "Conclude"],
    answer: `## Introduction
The mental status examination (MSE) is a systematic description of the patient's appearance, behaviour, experiences and mental functions at the time of the interview. The history tells the story over time; the MSE is a cross section, like a physical examination of the mind. It must be descriptive, use the patient's own words, and avoid jargon without examples.

## General appearance and behaviour
- Appearance: build, grooming, dress, hygiene, signs of self harm, apparent age.
- Attitude: cooperative, guarded, hostile, suspicious, seductive.
- Rapport: whether it could be established and maintained.
- Eye contact and facial expression.
- Psychomotor activity: retardation, agitation, restlessness, tremor, tics, abnormal movements, catatonic signs (posturing, waxy flexibility, negativism, echopraxia).

## Speech
Rate, volume, tone, quantity (poverty, pressure), reaction time, spontaneity, coherence, relevance, and abnormalities such as stuttering, dysarthria or aphasia. Record a sample.

## Mood and affect
Mood in the patient's words ("I feel empty"), and affect as observed: quality, range, intensity, stability, reactivity and congruence with thought. Always assess suicidal and homicidal ideas here or under thought content.

## Thought
- Stream: pressure, poverty, flight of ideas, thought block.
- Form: derailment, tangentiality, circumstantiality, neologisms, incoherence.
- Possession: obsessions, compulsions, thought insertion, withdrawal and broadcasting.
- Content: preoccupations, worries, phobias, overvalued ideas, delusions (type, conviction, systematisation, action taken), suicidal ideas with plan and intent.

## Perception
Illusions, hallucinations (modality, person, content, location, frequency, response), pseudohallucinations, depersonalisation and derealisation. Ask gently: "Do you ever hear people talking when no one is around?"

## Cognitive functions
| Function | Bedside test | Normal response |
| Consciousness | Observation, Glasgow Coma Scale | Alert, GCS 15 |
| Orientation | Time, place, person | Full; time is lost first |
| Attention | Digit span forward | 7 plus or minus 2 |
| Concentration | Serial sevens from 100, months backwards, days backwards | Five steps with up to one error |
| Immediate memory | Repeat three words or an address | Immediate correct repetition |
| Recent memory | Recall the three words after five minutes; recent events | All three |
| Remote memory | Personal history checked with family, past events | Accurate |
| General knowledge | Recent national events, prime minister | Fits education |
| Abstraction | Similarities (apple and banana), proverbs | Abstract rather than concrete |
| Intelligence | Simple arithmetic, vocabulary, educational estimate | Fits background |
| Visuospatial and language | Copying intersecting pentagons, clock drawing, naming, writing a sentence | Correct |

Structured screens add precision: the Mini Mental State Examination (30 points, usual cut off 23 or 24, affected by education), the Hindi Mental State Examination for elderly people with little schooling, the Montreal Cognitive Assessment (30 points, cut off 26, better for mild impairment and executive problems) and the Addenbrooke's Cognitive Examination III.

## Insight
Graded from complete denial to true emotional insight, and examined in its parts: awareness of illness, attribution of symptoms, and attitude to treatment.

## Judgement
- Personal judgement: plans about his or her own life.
- Social judgement: behaviour with others in the ward or at home.
- Test judgement: response to a hypothetical situation ("If you find a stamped addressed envelope on the road"), which is weak evidence and influenced by intelligence.

## Writing it up
- Describe, then name: "He said a machine in the hospital put thoughts in his head (thought insertion)".
- Record what is absent but important (no suicidal ideas, no hallucinations).
- Note limits: if the patient is mute or uncooperative, record observations and use family reports; a mute patient still has an MSE.
- In India, interviews may be in several languages; translate literally, note idioms, and consider an interpreter rather than a family member for sensitive topics.

## Common errors
- Confusing history with MSE (writing "patient had hallucinations last month" in the MSE).
- Using labels without examples.
- Skipping cognitive testing in a young patient: delirium and substance states are missed.
- Judging literal proverb answers as concrete thinking when the patient does not know the proverb.

## Conclusion
A careful MSE, linked to the history and physical examination, is the core of psychiatric diagnosis. Its value lies in exact description, systematic coverage, and repeated examination over time.`,
    keyPoints: ["Definition and difference from the history", "All headings in order with what to observe", "Mood versus affect", "Thought stream, form, possession and content", "Bedside cognitive tests with normal values", "MMSE, HMSE, MoCA cut offs", "Insight grades and judgement types", "Writing conventions and cultural points"],
    pitfalls: ["Writing past events into the MSE", "Omitting suicide assessment", "Labels without examples", "Ignoring education when scoring cognition"],
    visuals: [
      chain("The order of the MSE", [["Appearance and behaviour", "Grooming, rapport, psychomotor"], ["Speech", "Rate, volume, quantity"], ["Mood and affect", "Subjective and objective"], ["Thought", "Stream, form, possession, content"], ["Perception", "Hallucinations, illusions"], ["Cognition", "Orientation, attention, memory, abstraction"], ["Insight and judgement", "Grades, personal and social judgement"]]),
      layers("Cognition: build from the bottom", "stack", [["Abstraction and judgement", "Need all lower levels"], ["Memory", "Registration, recall, remote"], ["Concentration", "Serial sevens, months backwards"], ["Attention", "Digit span"], ["Consciousness", "Must be clear for any test to be valid"]], "If a lower level fails, tests above it cannot be interpreted."),
    ],
    module: "mse-deep",
    ref: "Interview-MSE notes; Kaplan MSE; Folstein 1975 MMSE; Ganguli 1995 HMSE; Nasreddine 2005 MoCA",
  },
  {
    id: "psyp-l02-008",
    subject: "psychopathology",
    topic: "formulation",
    marks: 10,
    difficulty: 3,
    exams: ["md-psychiatry", "mcp-entrance", "ma-semester"],
    question: "What is a case formulation? Describe the biopsychosocial and 5 Ps approaches with a clinical example.",
    plan: ["Define formulation and how it differs from diagnosis", "Explain the biopsychosocial model", "Explain the 5 Ps grid", "Worked example", "Uses and limits", "Conclusion"],
    answer: `## Definition
A case formulation is a brief, explanatory account of why this person developed this problem at this time, what keeps it going, and what can help. A diagnosis names a pattern shared by many people; a formulation is individual and guides treatment.

## Biopsychosocial model
George Engel proposed that illness should be understood through interacting biological, psychological and social factors, not biology alone. Each level is considered for vulnerability and for strengths.

## The 5 Ps
| P | Question | Biological | Psychological | Social |
| Presenting | What is the problem now? | | | |
| Predisposing | What made the person vulnerable? | Family history, early illness | Temperament, early loss, beliefs | Poverty, adversity |
| Precipitating | Why now? | Drug use, physical illness | A loss or humiliation | Exams, migration, conflict |
| Perpetuating | What keeps it going? | Poor adherence, side effects | Avoidance, rumination, low insight | High expressed emotion, stigma |
| Protective | What helps? | Good response to past treatment | Coping skills, faith | Supportive family, job |

## Worked example
Ms R, 24, a postgraduate student from a small town in Gujarat, presents with three months of low mood, early waking, guilt and passive death wishes.
- Predisposing: mother had depression; perfectionistic and self critical style; father was strict and distant.
- Precipitating: failed an important entrance examination and a breakup in the same month.
- Perpetuating: withdrawal from friends, rumination at night, belief that seeking help shows weakness, and her family's view that she should "just focus".
- Protective: close younger brother, good past academic record, religious faith, willingness to attend.
Plan derived from formulation: assess suicide risk; an SSRI such as sertraline; cognitive behavioural therapy targeting self criticism and rumination; behavioural activation; psychoeducation for parents; follow up with the college counsellor.

## Other formulation styles
Cognitive behavioural (longitudinal: early experience, core beliefs, rules; and cross sectional: situation, thought, emotion, behaviour, body), psychodynamic (conflicts, defences, relationship patterns) and systemic (family patterns).

## Uses and limits
Uses: links assessment to treatment, explains the illness to patient and family, predicts problems in therapy, and helps teams agree. Limits: formulations are hypotheses, can be biased by the clinician's theory, and their reliability between clinicians is modest. They should be shared with and checked by the patient and revised over time.

## Conclusion
A good formulation combines the biopsychosocial levels with the 5 Ps, is brief, individual and testable, and leads directly to the management plan.`,
    keyPoints: ["Definition and difference from diagnosis", "Engel's biopsychosocial model", "All five Ps defined", "Grid with biological, psychological and social columns", "A coherent clinical example", "Plan derived from the formulation", "Limits including reliability and bias"],
    visuals: [cycle("A perpetuating loop in Ms R", [["Low mood", "After exam failure"], ["Withdrawal", "Stops meeting friends"], ["Rumination", "I am a failure, at night"], ["Poor sleep", "Early waking"], ["Lower mood", "Confirms the belief"]], "Perpetuating factors are where treatment can break in.")],
    module: "case-sheet",
    ref: "Engel 1977; Weerasekera 1996 4P grid; Macneil et al 2012 formulation",
  },
  {
    id: "psyp-l02-009",
    subject: "psychopathology",
    topic: "psychopathology-memory",
    marks: 10,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance", "ma-semester"],
    question: "Describe the disorders of memory, with their causes.",
    plan: ["Stages of memory", "Amnesia: anterograde, retrograde, organic and psychogenic", "Distortions of memory: paramnesias", "Named syndromes", "Assessment", "Conclusion"],
    answer: `## Stages of memory
Memory involves registration (encoding), retention (storage) and recall (retrieval). It is divided into immediate, recent and remote memory, and into explicit (episodic and semantic) and implicit (procedural, priming) memory. Disorders may be quantitative (amnesia, hypermnesia) or qualitative (distortions).

## Amnesia
- Anterograde amnesia: inability to form new memories after an event, as in Korsakoff syndrome, bilateral hippocampal damage, and benzodiazepines or alcohol (blackouts).
- Retrograde amnesia: loss of memories from before an event, typically with a temporal gradient: recent memories are lost and old ones kept (Ribot's law), as after head injury or ECT.
- Transient global amnesia: sudden anterograde amnesia for hours in a middle aged person, with repetitive questioning and full recovery.
- Psychogenic or dissociative amnesia: loss of personal identity or memories of a stressful period, often with intact new learning; may be localised, selective, generalised, or with fugue.

| Feature | Organic amnesia | Dissociative amnesia |
| Onset | Gradual or after injury | Sudden after stress |
| New learning | Poor | Usually intact |
| Personal identity | Kept until late | May be lost |
| Gradient | Recent worse than remote | Often a block of time |
| Recovery | Slow, often partial | Often sudden |

## Hypermnesia
Excessively vivid recall, as in PTSD flashbacks, mania and some hypnotic states.

## Distortions of memory (paramnesias)
- Confabulation: filling memory gaps with false memories, without intent to deceive; seen in Korsakoff syndrome and frontal lesions. "Spontaneous" confabulation is fantastic; "provoked" confabulation occurs on questioning.
- Retrospective falsification: unconscious distortion of past memories to fit present mood, as in depression.
- Deja vu (a sense of having seen something before) and jamais vu (the familiar feels unknown): normal at times, frequent in temporal lobe epilepsy.
- Cryptomnesia: a memory recalled as a new idea.
- False memories: memories of events that did not happen, shown in research on suggestion.
- Delusional memory: a memory given a new delusional meaning.

## Named syndromes
- Korsakoff syndrome: thiamine deficiency, often after Wernicke encephalopathy in alcohol dependence; marked anterograde amnesia with confabulation and preserved intellect.
- Dementias: Alzheimer disease begins with recent memory loss.
- Ganser syndrome: approximate answers with clouding, in custody settings.

## Assessment
Registration and recall of three words, recall of an address, recent personal events checked with relatives, and formal tests such as the Wechsler Memory Scale and the PGI Memory Scale in India.

## Conclusion
Memory disorders are classified by stage and type. The pattern of loss, especially new learning and the temporal gradient, separates organic from dissociative causes.`,
    keyPoints: ["Registration, retention, recall", "Anterograde and retrograde with examples", "Ribot's law", "Table comparing organic and dissociative amnesia", "Confabulation and retrospective falsification", "Deja vu and jamais vu", "Korsakoff syndrome", "Indian memory test named"],
    visuals: [timeline("Order the parts of a memory, from first to last", [["Registration", "Encoding"], ["Retention", "Storage"], ["Recall", "Retrieval"]], "Amnesia can break any stage; Korsakoff mainly breaks storage of new memories.")],
    module: "neurocognitive",
    ref: "Fish ch 10 disorders of memory; Kopelman on confabulation; PGI Memory Scale Pershad and Wig",
  },
  {
    id: "psyp-l02-010",
    subject: "psychopathology",
    topic: "illusions",
    marks: 5,
    difficulty: 1,
    exams: ["md-psychiatry", "mcp-entrance", "ma-semester"],
    question: "Write short notes on illusions and sensory distortions.",
    plan: ["Define illusion and how it differs from hallucination", "Types of illusion", "Sensory distortions", "Clinical significance"],
    answer: `## Illusions
An illusion is a misperception of a real external stimulus. Unlike a hallucination, an object is present but perceived wrongly (a coat on a hook seen as a man).

Types:
- Completion illusions: filling in missing parts of a pattern, through inattention (a misprinted word read as correct).
- Affect illusions: the perception is shaped by strong emotion (a frightened person walking at night sees a bush as an attacker).
- Pareidolia: vivid images formed from vague stimuli, such as faces in clouds; the person knows they are not real and can see them on purpose.

Illusions are common in health, and frequent in delirium, where poor attention and fear combine.

## Sensory distortions
Here a real object is perceived with changed intensity, quality or form:
- Changes in intensity: hyperacusis and vivid colours in mania, migraine or drug states; dulled perception in depression.
- Changes in quality: everything looks yellow (xanthopsia) in digoxin toxicity.
- Changes in form or size: dysmegalopsia, including micropsia (objects look smaller) and macropsia (larger), seen in temporal and parietal lesions, retinal disease and epilepsy; "Alice in Wonderland" syndrome in migraine and infections.
- Changes in spatial form: metamorphopsia (objects look distorted).
- Splitting of perception, in which the link between sight and sound is lost.

## Clinical significance
Illusions and distortions point to arousal changes, delirium, eye disease, migraine, epilepsy and drug effects rather than to primary psychosis. They should prompt a physical examination.

## Conclusion
Illusions and sensory distortions both start from a real stimulus. Their presence, especially with clouding, suggests an organic cause.`,
    keyPoints: ["Definition and distinction from hallucination", "Completion, affect and pareidolia", "Changes in intensity, quality and form", "Micropsia and macropsia", "Organic significance"],
    module: "mse-deep",
    ref: "Fish ch 3 sensory distortions and illusions",
  },
];
