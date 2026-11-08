import type { LongQA } from "@/lib/prep/long-types";
import { anchored, brain, chain, compare, tree, vis } from "./visual";

export const CLINICAL_PSYCHIATRY_L01: LongQA[] = anchored([
  {
    id: "cpsy-l01-001",
    subject: "clinical-psychiatry",
    topic: "history-taking",
    marks: 15,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance", "ma-semester"],
    question: "Describe the scheme of psychiatric history taking. What special points apply when interviewing patients and families in India?",
    plan: ["Purpose of the history and the setting", "Go heading by heading with what to ask", "Premorbid personality and family history in detail", "Ending the case: summary, diagnosis, formulation, plan", "Indian interview points", "Conclusion"],
    answer: `## Purpose and setting
The psychiatric history builds a picture of the person, the illness and its context over time. It guides the mental status examination, diagnosis, risk assessment and management. A quiet, private setting, an unhurried start, open questions followed by focused ones, and attention to rapport are essential. Information is gathered from the patient and at least one informant, whose relationship to the patient, duration of contact and reliability are noted.

## Identifying data
Name, age, sex, marital status, education, occupation, religion, language, socioeconomic status, address (rural or urban), source of referral and informants.

## Chief complaints
Listed in chronological order, in the patient's words and in the informant's words, each with duration ("not sleeping for two months", "talking to himself for three weeks").

## History of present illness
- Onset (acute, subacute, insidious), mode and any precipitating factor.
- Course (continuous, episodic, fluctuating) and progression.
- Detailed description of each symptom with its evolution.
- Associated features and a negative history to exclude other diagnoses (mania, psychosis, substance use, organic features).
- Biological functions: sleep, appetite, weight, bowel and bladder, libido, menstrual changes.
- Effect on work, family and self care.
- Risk: suicidal ideas, self harm, violence, wandering, vulnerability.
- Treatment history: medicines with dose, duration, adherence and response; faith healing and traditional treatment.

## Past history
Past psychiatric episodes with dates, diagnosis, treatment and recovery; past medical and surgical illness, head injury, seizures, allergies.

## Family history
- A three generation genogram with ages, health and deaths.
- Psychiatric illness, suicide, substance use and epilepsy in relatives.
- Consanguinity.
- Family structure (nuclear or joint), relationships, communication, decision making, expressed emotion, and recent family events.

## Personal history
- Birth and early development: pregnancy, delivery, birth weight, milestones, childhood illnesses, neurotic traits (nail biting, bed wetting), temper tantrums.
- Education: age at schooling, performance, relationships with teachers and peers, reason for stopping.
- Occupation: jobs, reasons for changes, satisfaction.
- Menstrual, sexual and marital history: menarche, sexual knowledge and experience, marriage (arranged or by choice), relationship with spouse, children.
- Substance use: alcohol, tobacco, cannabis, opioids, sedatives, with pattern and dependence features.
- Forensic history.

## Premorbid personality
The person's usual self before the illness, preferably from an informant:
- Social relations: friends, family, work relationships.
- Intellectual activities, interests and hobbies.
- Mood: usual mood and stability.
- Character: attitudes to self and others, standards, moral and religious beliefs, response to stress.
- Habits: eating, sleep, substances.
- Fantasy life.

## Concluding the case
Mental status examination, physical and neurological examination, a summary, provisional diagnosis with differentials, a biopsychosocial formulation, investigations and a management plan, followed by a risk statement.

## Special points in India
- Family members usually accompany the patient and give much of the history; interview the patient alone as well, especially about sexual matters, substance use, abuse and suicidal ideas.
- Explanatory models: ask what the family thinks is the cause (black magic, stress, "weakness", past karma) and what treatments have been tried; do not dismiss them.
- Distress is often expressed in bodily idioms ("ghabrahat", burning, gas, weakness).
- Gender roles may limit what women can say in front of in laws; offer privacy.
- Language: record key phrases verbatim; use trained interpreters, not children, for sensitive topics.
- Confidentiality must be explained; under the MHCA 2017 the patient has a right to confidentiality, and sharing with family needs consent except where the law allows.
- Literacy and education affect questions on time, dates and cognitive tests.

## Conclusion
A complete, chronological and well organised history, checked against informants and culturally sensitive, is the foundation of psychiatric diagnosis and of a formulation that leads to good care.`,
    keyPoints: ["Informants and their reliability", "Chief complaints chronological with duration", "HOPI components including negative history and biological functions", "Treatment history including faith healing", "Family history with genogram and consanguinity", "Personal history headings", "Premorbid personality headings", "Indian specific interview points including privacy and confidentiality"],
    pitfalls: ["Missing risk assessment", "No premorbid personality", "Interviewing only the family"],
    visuals: [
      chain("The case sheet in order", [["Identifying data and informants", ""], ["Chief complaints", "Chronological, with duration"], ["History of present illness", "Onset, course, symptoms, risk, treatment"], ["Past, family and personal history", "Genogram, development, substances"], ["Premorbid personality", "From an informant"], ["MSE and physical examination", ""], ["Summary, diagnosis, formulation, plan", ""]]),
      vis("genogram", { title: "Draw a three generation family", condition: "a psychiatric illness", caption: "Explore the example, then draw a family from your own case." }),
    ],
    module: "case-sheet",
    ref: "Interview-MSE notes history scheme; Kaplan psychiatric interview; Maudsley Handbook of Practical Psychiatry case structure",
  },
  {
    id: "cpsy-l01-002",
    subject: "clinical-psychiatry",
    topic: "premorbid-personality",
    marks: 5,
    difficulty: 1,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "Write short notes on the assessment of premorbid personality.",
    plan: ["Definition and why it matters", "Headings to assess", "Sources and pitfalls", "Clinical uses"],
    answer: `## Definition
Premorbid personality is the person's enduring pattern of thinking, feeling and behaving before the onset of the present illness. It provides the baseline against which change is judged.

## Why it matters
- Shows whether symptoms are a change from the usual self (a quiet person becoming loud and spending in mania) or long standing traits.
- Suggests vulnerability (anxious, perfectionistic, impulsive traits) and coping style.
- Predicts outcome: good premorbid adjustment predicts better recovery in schizophrenia.
- Helps diagnose personality disorder separately from illness.
- Sets realistic treatment goals.

## Headings
- Social relationships: friends, family, colleagues; sociable or reserved.
- Use of leisure, interests and hobbies; intellectual activities.
- Predominant mood: cheerful, gloomy, anxious, stable or changeable.
- Character: confident or shy, dependent, obsessional, suspicious, impulsive; standards, moral and religious attitudes.
- Response to stress and frustration.
- Habits: food, sleep, alcohol, tobacco, other substances.
- Fantasy life and daydreams.

## Sources and pitfalls
Ask a relative or friend who knew the person well before the illness, as well as the patient. Current illness distorts self description: a depressed patient remembers herself as always useless (retrospective falsification). Ask for examples rather than labels. Structured tools (the Standardised Assessment of Personality, or personality inventories after recovery) can help.

## Clinical uses
Premorbid personality shapes formulation, choice of therapy, rehabilitation goals and prognosis.

## Conclusion
Premorbid personality is the "before" picture of the patient; it should be gathered from informants and recorded under clear headings with examples.`,
    keyPoints: ["Definition", "At least four reasons it matters", "Seven headings", "Informant as source", "Retrospective falsification pitfall", "Use in prognosis and planning"],
    module: "case-sheet",
    ref: "Interview-MSE notes premorbid personality; Mann SAP",
  },
  {
    id: "cpsy-l01-003",
    subject: "clinical-psychiatry",
    topic: "rapport-difficult-interview",
    marks: 5,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "Write short notes on interviewing an uncooperative or hostile patient.",
    plan: ["Common reasons for non cooperation", "Safety first", "Techniques of engagement", "What to record"],
    answer: `## Reasons for non cooperation
Paranoid ideas, manic irritability, intoxication or withdrawal, delirium, fear or humiliation at being brought against one's will, previous bad experiences, language barriers, and personality factors.

## Safety first
- Read the referral and ask staff about risk before entering.
- Interview in a space with a clear exit for both, with staff nearby; do not block the patient's exit and keep a safe distance.
- Remove objects that could be used as weapons; know the alarm system.
- Watch warning signs: raised voice, pacing, clenched fists, staring, threats.
- Stop and leave if the risk rises.

## Engagement techniques
- Introduce yourself, explain your role and the purpose of the meeting.
- Acknowledge feelings ("You seem angry about being brought here; that makes sense").
- Use a calm, low voice, short sentences and an open posture; avoid arguing or challenging delusions.
- Start with neutral or practical topics (sleep, food, what he wants now), offer choices and something to drink.
- Allow pauses; shorten the interview and return later if needed.
- Ask about specific complaints the patient has, which builds rapport.
- Be honest about what will happen next; do not make promises you cannot keep.
- If the patient is intoxicated or delirious, defer detailed interview and treat medically.

## What to record
Observations of behaviour, speech, affect and any threats; what was attempted; collateral information from family and police; and the risk assessment. Even a short interview yields a useful mental status examination.

## Conclusion
With attention to safety, respect and patience, most hostile patients can be engaged; the aim of the first meeting is safety and rapport, not completeness.`,
    keyPoints: ["Reasons for hostility", "Safety measures and warning signs", "De-escalation and validation", "Avoid arguing with delusions", "Short, repeated interviews", "Record observations and collateral"],
    module: "interview-mse",
    ref: "Interview-MSE notes difficult interviews; NICE NG10 de-escalation",
  },
  {
    id: "cpsy-l01-004",
    subject: "clinical-psychiatry",
    topic: "stupor-examination",
    marks: 10,
    difficulty: 3,
    exams: ["md-psychiatry"],
    question: "How will you examine a mute and immobile patient? Discuss the differential diagnosis of stupor.",
    plan: ["Define stupor and why it is an emergency", "Approach: history, observation, physical and neurological examination", "Specific bedside tests", "Differential diagnosis with distinguishing features", "Investigations and initial management"],
    answer: `## Definition
Stupor is a state of mutism and akinesia (absence of speech and movement) with apparently preserved or partly preserved consciousness. It is a medical and psychiatric emergency because of risks of dehydration, malnutrition, venous thrombosis, aspiration and an underlying serious illness.

## Approach
History from informants:
- Onset (sudden or gradual), preceding events and symptoms (fever, headache, seizures, drug or alcohol use, new medicines such as antipsychotics), past psychiatric history (depression, bipolar, schizophrenia, dissociative episodes), medical illness.

Observation:
- Level of consciousness: eye opening, eye tracking of moving objects, blink to threat, response to voice and pain; Glasgow Coma Scale.
- Posture, spontaneous movements, response to the environment, intake of food and fluids, continence.
- Facial expression (perplexed, sad, vacant), and whether the patient resists attention.

Physical examination:
- Vital signs (temperature for neuroleptic malignant syndrome or malignant catatonia, autonomic instability), hydration, signs of injury, needle marks.
- Neurological: pupils, fundi (papilloedema), neck stiffness, tone (rigidity, waxy flexibility, gegenhalten), reflexes, plantar responses, focal signs.

Bedside tests for catatonic and other signs:
- Passive movement for catalepsy and waxy flexibility; raise the arm for posturing.
- Test for negativism, automatic obedience, mitgehen, echopraxia.
- Grasp reflex and other frontal release signs.
- Resistance to eye opening, and the arm drop test (a dropped arm that avoids the face suggests dissociation).
- Offer paper and pen: some mute patients will write.
- Observe at night and at meals, when behaviour may change.
- Lorazepam challenge (1 to 2 mg) with re-rating on the Bush-Francis scale.

## Differential diagnosis
| Cause | Pointers |
| Catatonic stupor (mood disorder, schizophrenia) | Catatonic signs, history of mood or psychotic illness, response to lorazepam |
| Depressive stupor | Severe depression before, sad facies, later recalls events |
| Manic stupor | Rare; history of mania, later report of racing thoughts |
| Organic stupor | Clouding, abnormal neurological signs, EEG slowing; encephalitis, metabolic causes, non convulsive status, tumours, drugs |
| Neuroleptic malignant syndrome | Recent antipsychotic, fever, rigidity, autonomic instability, raised CK |
| Dissociative stupor | Recent stress, resistance to eye opening, normal neurology, EEG normal |
| Akinetic mutism | Medial frontal or thalamic lesions; eyes follow but no initiation |
| Locked in syndrome | Pontine lesion; vertical eye movements and blinking preserved, full awareness |
| Malingering | Inconsistent findings, external gain |

## Investigations
Blood count, electrolytes, glucose, renal and liver tests, calcium, CK, thyroid, drug screen, blood cultures if febrile; EEG (to exclude non convulsive status and confirm encephalopathy); CT or MRI brain; lumbar puncture, including NMDA receptor antibodies, when encephalitis is suspected.

## Initial management
Admit, monitor vital signs, maintain hydration and nutrition (intravenous fluids, nasogastric feeding), prevent pressure sores and thrombosis, stop antipsychotics if catatonia or NMS is possible, give lorazepam for catatonia, treat the cause, and consider ECT for malignant catatonia or depressive stupor.

## Conclusion
A mute patient still has a mental status examination. Systematic observation, neurological examination and focused investigations separate psychiatric from organic stupor, and early treatment saves lives.`,
    keyPoints: ["Definition and medical risks", "Informant history including drugs", "Observation of consciousness and eye tracking", "Neurological examination and vital signs", "Catatonic sign testing and lorazepam challenge", "Differential table with at least six causes", "Investigations including EEG and NMDA antibodies", "Supportive and specific management"],
    visuals: [tree("Causes of stupor", [["Stupor", "Mute and akinetic", -1], ["Psychiatric", "", 0], ["Catatonic", "Mood disorder, schizophrenia", 1], ["Depressive", "", 1], ["Dissociative", "", 1], ["Organic", "", 0], ["Encephalitis, metabolic", "", 5], ["Non convulsive status", "", 5], ["Drug related, NMS", "", 5], ["Neurological mimics", "", 0], ["Akinetic mutism, locked in", "", 9]])],
    module: "mse-deep",
    ref: "Fish disorders of motor behaviour; Kaplan catatonia; Maudsley catatonia; Interview-MSE notes examination of the uncooperative patient",
  },
  {
    id: "cpsy-l01-005",
    subject: "clinical-psychiatry",
    topic: "frontal-lobe",
    marks: 10,
    difficulty: 3,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "Describe the frontal lobe syndromes and the bedside assessment of frontal lobe function.",
    plan: ["Functional anatomy of the prefrontal cortex", "Three classical syndromes", "Causes", "Bedside tests with what they show", "Formal neuropsychological tests and conclusion"],
    answer: `## Functional anatomy
The frontal lobes include the motor and premotor cortex, Broca's area and the prefrontal cortex. The prefrontal cortex governs executive function: planning, sequencing, flexibility, inhibition, working memory, judgement, motivation and social behaviour. It connects with the basal ganglia and thalamus through parallel frontal subcortical circuits, so lesions in these structures can mimic frontal damage.

## Classical syndromes
| Syndrome | Region | Features |
| Dysexecutive | Dorsolateral prefrontal cortex | Poor planning and organisation, perseveration, reduced verbal fluency, concrete thinking, poor set shifting, apathy ("pseudo depressed") |
| Disinhibited | Orbitofrontal cortex | Impulsivity, tactlessness, inappropriate jokes (witzelsucht), sexual disinhibition, poor judgement, emotional lability ("pseudo psychopathic") |
| Apathetic | Medial frontal and anterior cingulate | Severe apathy, reduced spontaneous speech and movement, in severe cases akinetic mutism |
Phineas Gage, who survived an iron rod through his frontal lobes in 1848 and became impulsive and unreliable, is the classic case of orbitofrontal change.

## Causes
Traumatic brain injury, frontotemporal dementia, tumours (meningioma), strokes of the anterior cerebral artery, normal pressure hydrocephalus, multiple sclerosis, alcohol related damage, Huntington disease, and infections such as neurosyphilis.

## Bedside tests
- Verbal fluency: name as many words beginning with F (or animals) in one minute; fewer than about 10 to 12 letter words suggests impairment, depending on education.
- Luria's motor sequence (fist, edge, palm): inability to learn or maintain the sequence.
- Go no go test: tap once when the examiner taps once, do not tap when the examiner taps twice; tests inhibition.
- Alternating patterns and copying a sequence of loops: perseveration.
- Similarities and proverb interpretation: abstraction.
- Cognitive estimates ("How tall is the average Indian woman?"): bizarre estimates suggest frontal damage.
- Trail making test part B and serial sevens: set shifting and working memory.
- Frontal release signs: grasp, palmomental, pout and glabellar tap reflexes; present in some normal elderly, so interpret cautiously.
- Observation of behaviour, social conduct and utilisation behaviour (picking up and using objects without being asked).
- The Frontal Assessment Battery (six subtests, 18 points) brings several of these together.

## Formal neuropsychological tests
Wisconsin Card Sorting Test (set shifting, perseverative errors), Stroop test (inhibition), Tower of London (planning), and the Iowa Gambling Task (orbitofrontal decision making). Standard cognitive screens like the MMSE are poor at detecting frontal impairment; the MoCA and ACE III include executive items.

## Conclusion
Frontal lobe damage changes personality, judgement and executive control while memory and IQ may look normal. Bedside tests of fluency, sequencing, inhibition and abstraction, together with informant reports of behaviour, are essential for detection.`,
    keyPoints: ["Executive functions of the prefrontal cortex", "Three syndromes with regions", "Phineas Gage", "Causes", "At least six bedside tests with what they assess", "Frontal release signs with caution", "Formal tests including WCST and Stroop", "Limitation of MMSE"],
    visuals: [
      brain("Three frontal syndromes", { prefrontal: "Dorsolateral: planning, flexibility; damage gives apathy and perseveration", frontal: "Orbitofrontal: social control; damage gives disinhibition", "basal-ganglia": "Frontal subcortical loops: lesions here mimic frontal damage" }),
      vis("brainexplorer", { title: "Phineas Gage and the frontal lobe", focus: ["frontal", "prefrontal"], caption: "Tap the frontal lobe and switch on damage to see what changed in Gage." }),
    ],
    module: "neurocognitive",
    ref: "Kaplan neuropsychiatry frontal syndromes; Cummings frontal subcortical circuits 1993; Dubois 2000 FAB",
  },
  {
    id: "cpsy-l01-006",
    subject: "clinical-psychiatry",
    topic: "gerstmann",
    marks: 5,
    difficulty: 2,
    exams: ["md-psychiatry"],
    question: "Write short notes on parietal lobe signs, including Gerstmann syndrome.",
    plan: ["Functions of the parietal lobes", "Dominant hemisphere signs and Gerstmann syndrome", "Non dominant hemisphere signs", "Bedside tests and psychiatric relevance"],
    answer: `## Functions
The parietal lobes integrate sensory information, body image, spatial attention, calculation, reading and writing, and the planning of skilled movements.

## Dominant (usually left) parietal lobe
- Gerstmann syndrome, from a lesion of the dominant angular gyrus, has four features: finger agnosia (cannot name or identify fingers), acalculia, agraphia, and right left disorientation.
- Other signs: ideomotor and ideational apraxia, alexia, and receptive language problems when the lesion extends to Wernicke's area.

## Non dominant (usually right) parietal lobe
- Hemispatial neglect of the left side (ignoring the left side of the body or space).
- Anosognosia: unawareness of illness or of a paralysed limb (described by Babinski).
- Dressing apraxia and constructional apraxia.
- Prosopagnosia (with occipitotemporal involvement) and topographical disorientation.
- Somatoparaphrenia: the belief that a limb belongs to someone else.

## Signs of either side
Cortical sensory loss: astereognosis (cannot identify objects by touch), agraphaesthesia (cannot recognise numbers written on the skin), loss of two point discrimination and sensory inattention on double simultaneous stimulation; lower quadrant visual field defects.

## Bedside tests
Name fingers, simple arithmetic, writing a sentence, "touch your left ear with your right hand", line bisection, clock drawing, copying intersecting pentagons or a cube, putting on a shirt, and objects placed in the hand with eyes closed.

## Psychiatric relevance
Parietal signs can be mistaken for psychiatric illness: anosognosia and somatoparaphrenia resemble delusions, and dressing apraxia may look like dementia or conversion. They also appear early in Alzheimer disease and corticobasal degeneration.

## Conclusion
Parietal lobe signs differ by hemisphere; Gerstmann syndrome is the classic dominant sign and neglect with anosognosia the classic non dominant signs.`,
    keyPoints: ["Functions of the parietal lobe", "Four features of Gerstmann syndrome and angular gyrus", "Neglect and anosognosia in non dominant lesions", "Cortical sensory signs", "Bedside tests", "Psychiatric mimics"],
    module: "neurocognitive",
    ref: "Kaplan neuropsychiatric examination; Fish disorders of body image",
  },
  {
    id: "cpsy-l01-007",
    subject: "clinical-psychiatry",
    topic: "charles-bonnet",
    marks: 5,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "Write short notes on Charles Bonnet syndrome.",
    plan: ["Definition and history", "Features", "Mechanism", "Assessment and management"],
    answer: `## Definition and history
Charles Bonnet syndrome is the experience of complex visual hallucinations in a person with visual impairment, with preserved insight and no psychiatric or neurological disorder to explain them. The Swiss naturalist Charles Bonnet described it in 1760 in his grandfather, who had cataracts.

## Features
- Usually older people with macular degeneration, glaucoma, cataract, diabetic retinopathy or other causes of visual loss.
- Vivid, well formed images: people (often small, in costume), faces, animals, buildings, patterns or landscapes; they may be silent and can last seconds to hours.
- The person knows the images are not real, though they can be unsettling.
- No other hallucinations or delusions, and no cognitive decline to explain them.
- Common but under reported, because people fear being thought "mad".

## Mechanism
Deafferentation (release) theory: loss of input to the visual cortex makes it hyperexcitable, so it generates images spontaneously, like a phantom limb of vision.

## Assessment
Ophthalmic assessment, cognitive screening to rule out dementia (especially Lewy body dementia), review of medicines, and exclusion of delirium, psychosis and occipital lesions or seizures.

## Management
- Explanation and reassurance are the most important steps; many people are greatly relieved.
- Improve vision where possible (cataract surgery, better lighting).
- Simple techniques: blinking, looking away, moving the eyes, changing lighting.
- Medicines are rarely needed; small studies have tried anticonvulsants and antipsychotics.

## Conclusion
Charles Bonnet syndrome is a benign, insight preserved visual phenomenon in visual loss that should not be mistaken for psychosis.`,
    keyPoints: ["Definition with insight and visual impairment", "Bonnet 1760", "Typical content", "Deafferentation theory", "Exclude dementia, delirium and psychosis", "Reassurance and visual improvement"],
    module: "mse-deep",
    ref: "Fish perception; Menon 2003 CBS review; Teunisse 1996",
  },
  {
    id: "cpsy-l01-008",
    subject: "clinical-psychiatry",
    topic: "cotard",
    marks: 5,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "Write short notes on Cotard syndrome.",
    plan: ["Definition and history", "Clinical features", "Associated conditions and mechanism", "Management"],
    answer: `## Definition and history
Cotard syndrome is the presence of nihilistic delusions, in which the person denies the existence of parts of the body, the self or the world. Jules Cotard described "le delire des negations" in 1880 in a woman who believed she had no brain, nerves or entrails and could not die.

## Clinical features
- Delusions that organs are missing or rotting ("my intestines have stopped, there is no blood in me").
- Belief of being dead, a corpse, or not existing.
- Paradoxically, delusions of immortality: being condemned to live forever in suffering.
- Severe depressed mood, anxiety, agitation, guilt and hypochondriacal ideas.
- Refusal of food and fluids ("why eat if I have no stomach") and risk of suicide or self harm.

## Associated conditions
Most often severe psychotic depression in older people, particularly with melancholic features. Also bipolar disorder, schizophrenia and organic conditions: right hemisphere and parietal lesions, dementia, epilepsy, migraine, encephalitis, and drugs (rarely aciclovir toxicity in renal failure).

## Mechanism
Cognitive neuropsychological accounts suggest a loss of emotional response to the self and world (similar to severe depersonalisation), combined with an attributional style that concludes "I must be dead". It is sometimes linked to Capgras delusion as part of the delusional misidentification group.

## Management
- Treat the underlying condition: antidepressant plus antipsychotic for psychotic depression.
- ECT is often the treatment of choice, especially with food refusal or high suicide risk, and response is usually good.
- Ensure nutrition and hydration and investigate for organic causes.

## Conclusion
Cotard syndrome is a striking nihilistic presentation, usually of severe depression; it carries high risk and responds well to ECT.`,
    keyPoints: ["Definition and Cotard 1880", "Delusions of absent organs, death and immortality", "Severe psychotic depression in elderly", "Organic causes", "Mechanism", "ECT and nutrition"],
    module: "mse-deep",
    ref: "Fish delusions; Berrios and Luque 1995 Cotard review",
  },
  {
    id: "cpsy-l01-009",
    subject: "clinical-psychiatry",
    topic: "misidentification",
    marks: 5,
    difficulty: 3,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "Write short notes on delusional misidentification syndromes.",
    plan: ["Definition", "Types", "Associated conditions", "Mechanism and management"],
    answer: `## Definition
Delusional misidentification syndromes are delusions in which the person consistently misidentifies people, places or objects, usually believing that a familiar person has been replaced or that strangers are familiar people in disguise.

## Types
| Syndrome | Belief |
| Capgras | A familiar person (spouse, parent) has been replaced by an identical looking impostor |
| Fregoli | A familiar person, often a persecutor, takes the form of different strangers |
| Intermetamorphosis | People change into one another, in appearance and identity |
| Subjective doubles | The patient has a double who acts independently |
| Reduplicative paramnesia | A place exists in two locations or has been duplicated |
Capgras and Reboul-Lachaux described the first in 1923; Courbon and Fail described Fregoli syndrome in 1927.

## Associated conditions
Schizophrenia and other psychoses; mood disorders; and organic conditions in a large proportion, including dementia (especially Lewy body dementia), stroke and right hemisphere lesions, head injury and epilepsy.

## Mechanism
Ellis and Young proposed that in Capgras syndrome the face is recognised, but the automatic emotional response (shown by skin conductance) is lost. The mismatch between "looks like my wife" and "does not feel like my wife" is explained by the delusion of an impostor. A second factor, a failure of belief evaluation linked to right frontal dysfunction, keeps the delusion from being rejected. In Fregoli syndrome, excessive familiarity is attached to strangers.

## Management and risk
Investigate for organic causes, treat the underlying disorder with antipsychotics, and assess risk: patients may attack the supposed impostor.

## Conclusion
Misidentification syndromes are rare but important; they often point to organic disease and carry risk of violence.`,
    keyPoints: ["Definition", "Capgras and Fregoli with dates", "Other types", "High organic association", "Ellis and Young two factor explanation", "Risk of violence"],
    module: "mse-deep",
    ref: "Ellis and Young 1990; Capgras 1923; Courbon and Fail 1927; Fish delusions",
  },
  {
    id: "cpsy-l01-010",
    subject: "clinical-psychiatry",
    topic: "investigations",
    marks: 10,
    difficulty: 2,
    exams: ["md-psychiatry"],
    question: "What investigations would you order in a patient with a first episode of psychosis or a new onset psychiatric illness? Justify each.",
    plan: ["Principle: rule out organic causes and get baselines", "Routine blood and urine tests with reasons", "Infection and specific tests", "ECG and imaging, EEG and special tests with indications", "Red flags for organic causes and conclusion"],
    answer: `## Principles
Investigations aim to find medical causes of psychiatric symptoms (secondary psychoses, mood disorders due to medical illness), detect comorbid physical illness, and obtain baselines before treatment with medicines that affect weight, metabolism, heart rhythm and blood. Tests should be guided by history and examination rather than sent as a fixed panel.

## Routine baseline tests
| Test | Reason |
| Complete blood count | Anaemia, infection, baseline before clozapine or carbamazepine |
| Blood glucose or HbA1c, lipid profile | Baseline for antipsychotic metabolic effects; diabetes is common in schizophrenia |
| Renal function and electrolytes | Hyponatraemia and uraemia can cause psychosis or delirium; baseline for lithium |
| Liver function | Alcohol use, hepatic encephalopathy, baseline for valproate |
| Calcium | Hypercalcaemia causes depression and confusion |
| Thyroid function (TSH) | Hypo and hyperthyroidism mimic depression, mania or anxiety |
| Vitamin B12 and folate | Deficiency causes depression, psychosis and cognitive decline |
| Urine drug screen | Cannabis, amphetamines, opioids, benzodiazepines |
| Pregnancy test in women of childbearing age | Affects choice of medicine and investigations |
| Weight, BMI, waist, blood pressure | Physical health baseline |

## Infection screening when indicated
HIV, syphilis serology (VDRL and TPHA), and hepatitis B and C in people with risk factors; HIV can present with psychosis or mania, and neurosyphilis remains a treatable cause.

## ECG
Baseline QTc before antipsychotics that prolong it (for example haloperidol at higher doses, ziprasidone) and in people with cardiac risk, and before lithium in older adults.

## Prolactin
Baseline before antipsychotics that raise prolactin (risperidone, amisulpride), especially with sexual or menstrual complaints.

## Brain imaging
MRI (or CT if MRI is unavailable) is indicated in atypical presentations: onset after 40 or 50, focal neurological signs, headache, seizures, cognitive decline, head injury, catatonia, rapid progression, or poor response to treatment. Routine imaging in every typical first episode has a low yield, though many Indian centres do it once.

## EEG
In suspected seizures, fluctuating consciousness, delirium, catatonia, or episodic symptoms suggesting temporal lobe epilepsy.

## Special tests
- Autoimmune encephalitis panel (NMDA receptor antibodies in serum and CSF) with lumbar puncture: rapid onset psychosis with seizures, dyskinesias, autonomic instability or catatonia, especially in young women.
- Serum ceruloplasmin and slit lamp examination for Kayser Fleischer rings: Wilson disease in young people with movement disorder or liver disease.
- Antinuclear antibodies: lupus.
- Porphyrins, heavy metals and genetic tests (22q11.2 deletion) in specific situations.

## Red flags for an organic cause
Acute onset, older age at onset, disturbed consciousness or disorientation, visual or tactile hallucinations, focal signs, seizures, fever, headache, recent head injury, catatonia, and poor response to standard treatment.

## Conclusion
A focused set of baseline tests is needed in every new patient, while imaging, EEG and special tests are guided by red flags. This protects against missing a treatable medical cause and prepares for safe prescribing.`,
    keyPoints: ["Two aims: organic causes and treatment baselines", "Blood count, glucose, lipids, renal, liver, calcium, thyroid, B12", "Urine drug screen and pregnancy test", "Infection screen with HIV and syphilis", "ECG and prolactin indications", "Imaging and EEG indications", "Autoimmune and Wilson disease tests", "Red flags"],
    visuals: [compare("When to suspect an organic cause", ["Typical primary psychosis", ["Onset in late teens or twenties", "Clear consciousness", "Auditory hallucinations", "Normal neurological examination"], "Baseline tests are enough"], ["Red flags", ["Onset after 40 or very sudden", "Confusion or fluctuating alertness", "Visual hallucinations, seizures, focal signs", "Catatonia, fever, headache"], "Image, EEG and look further"])],
    module: "case-sheet",
    ref: "Maudsley physical health monitoring; NICE CG178; Kaplan laboratory testing in psychiatry; Graus 2016 autoimmune encephalitis criteria",
  },
]);
