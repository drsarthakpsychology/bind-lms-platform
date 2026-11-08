/* Module · The MSE in depth, Parts I and II (Starting and Beginner). Original text written for VIBHA School of Psychology. */
export const part1 = String.raw`
# Part I · Starting: learning to look and listen

## 1.1 What you are really doing in an MSE [core][starting]
The full list of MSE headings, definitions and the insight grades is in **Module 1, The psychiatric interview and MSE** (sections 2.0 to 2.13). This module does not repeat that list. It trains the **skill**: noticing, telling look-alike signs apart **while the patient is talking**, and writing it down so another clinician can see the patient through your words.

:::widget flow
{"title": "The MSE sequence", "layout": "chain", "nodes": [{"id": "a", "label": "Appearance", "detail": "Dress, grooming, build, scars, eye contact, expression. Starts at the door."}, {"id": "b", "label": "Behaviour", "detail": "Psychomotor activity, rapport, attitude, abnormal movements."}, {"id": "c", "label": "Speech", "detail": "Rate, volume, quantity, flow, articulation."}, {"id": "d", "label": "Mood", "detail": "What the patient tells you, in their words."}, {"id": "e", "label": "Affect", "detail": "What you see: quality, range, reactivity, congruence, appropriateness."}, {"id": "f", "label": "Thought form", "detail": "How ideas connect, judged from speech."}, {"id": "g", "label": "Thought content", "detail": "Preoccupations, delusions, obsessions, suicidal and homicidal ideas."}, {"id": "h", "label": "Perception", "detail": "Hallucinations, illusions, other perceptual changes."}, {"id": "i", "label": "Cognition", "detail": "Consciousness, orientation, attention, memory, abstraction."}, {"id": "j", "label": "Insight", "detail": "Awareness, attribution, treatment acceptance, relabelling."}, {"id": "k", "label": "Judgement", "detail": "What the person is actually doing about risks and responsibilities."}], "caption": "The order moves from what anyone can see towards what you must infer. Use the same order every time so readers know where to look."}
:::

### Three habits that make a good examiner
1. **Start at the door.** The MSE begins before the first question: how the person walks in, sits, looks at you, who comes with them, who answers first.
2. **Describe, then name.** Write what you saw and heard in plain words, with a quote. Add the technical term only if you are sure.
3. **Separate what you observed from what you concluded.** "Sat with head down, answered in two-word replies after long pauses" is an observation. "Depressed" is a conclusion. Both may be right; keep them apart.

:::widget sort
{
  "prompt": "Sort each line from a student's notes: is it an observation, an interpretation, or a bare label?",
  "buckets": ["Observation (what was seen or heard)", "Interpretation (a reasoned inference)", "Bare label (no evidence given)"],
  "items": [
    { "text": "Shirt buttoned wrongly, unshaven, smell of stale sweat", "bucket": 0 },
    { "text": "Appears to have neglected self-care over some days", "bucket": 1 },
    { "text": "Schizophrenic", "bucket": 2, "why": "A diagnosis is not an MSE finding, and gives the reader nothing to check." },
    { "text": "Looked repeatedly at the empty corner, paused mid-sentence, then nodded", "bucket": 0 },
    { "text": "Possibly responding to unseen stimuli", "bucket": 1 },
    { "text": "Weird", "bucket": 2 },
    { "text": "Said: “Mera dimaag koi aur chala raha hai” (Someone else is running my mind)", "bucket": 0 }
  ]
}
:::

:::student
A useful test for every line you write: **could another clinician picture the patient from this line alone?** "Anxious" fails. "Sat on the edge of the chair, wringing her dupatta, voice shaky, asked twice whether she would be admitted" passes.
:::

:::widget flow
{"title": "From what you see to the technical word", "layout": "chain", "nodes": [{"id": "a", "label": "Observe", "detail": "Watch and listen: posture, pauses, glances, exact words."}, {"id": "b", "label": "Describe", "detail": "Plain words another clinician can picture: 'sat on the edge of the chair, wringing her dupatta'."}, {"id": "c", "label": "Quote", "detail": "The patient's own words, in their language, with a translation."}, {"id": "d", "label": "Name", "detail": "Add the term only now, if you are sure: 'agitation'."}, {"id": "e", "label": "Check the alternative", "detail": "Could it be culture, a side effect, fear of the setting, or something else?"}], "caption": "Never jump straight from Observe to Name. The middle steps are what make your note checkable."}
:::

### The MSE is a snapshot
The history tells the story across months. The MSE describes **this person, in this room, now**. A man who was manic last week and is calm today has a calm MSE today. That is why the MSE is repeated at every review and why you date and time it.

:::widget decide
{
  "scene": "Mr Shaikh, 45, was admitted three days ago with mania. Today, on your ward round in Pune, he is calm, speaks at a normal pace and laughs appropriately. A colleague writes in today's MSE: “Pressure of speech, grandiose delusions.”",
  "ask": "What is wrong, and what should the note say?",
  "choices": [
    { "label": "Nothing; the admission findings still apply", "verdict": "harm", "outcome": "The team keeps him on a high dose, and he becomes over-sedated.", "why": "Copying old findings into today's MSE misleads everyone. The MSE records what is present now." },
    { "label": "Record today's findings as observed (normal rate, no grandiosity elicited today) and note the change from admission in the progress notes", "verdict": "best", "outcome": "The team sees the improvement and adjusts the plan.", "why": "The MSE is cross-sectional; change over time belongs in the progress note or history." },
    { "label": "Leave the MSE blank because he looks better", "verdict": "ok", "outcome": "There is now no record of his mental state today.", "why": "A normal MSE still needs writing; normal findings are evidence too." }
  ]
}
:::

:::clinician
Reliability: inter-rater agreement for many MSE items is modest when unstructured, and improves when examiners anchor each item in observable behaviour and verbatim speech. Structured instruments that formalise parts of the MSE include the Present State Examination (PSE, now within SCAN), the Comprehensive Psychopathological Rating Scale, and for specific domains the Thought, Language and Communication scale (Andreasen), the Bush-Francis Catatonia Rating Scale and the Confusion Assessment Method. Even when you do not use them, borrowing their anchors improves your notes. In medico-legal settings (MHCA 2017 assessments of capacity, admissions under supported or independent provisions) a contemporaneous, dated, descriptive MSE is often the key document.
:::

:::widget layers
{"title": "What you see and what you infer", "shape": "iceberg", "layers": [{"label": "Seen and heard directly", "detail": "Appearance, behaviour, speech, facial expression: anyone in the room could record these."}, {"label": "Told to you", "detail": "Mood, thoughts, perceptions: you depend on what the patient chooses to say."}, {"label": "Inferred carefully", "detail": "Thought form from how speech connects; hallucinations from glances and pauses; insight from how they explain things."}, {"label": "Hidden until asked", "detail": "Suicidal plans, shameful thoughts, abuse. These often stay below the surface unless you ask directly and privately."}], "caption": "The deeper the layer, the more your note should show where the evidence came from."}
:::

:::recall
1. Name three habits of a good MSE examiner. || Start at the door; describe, then name; separate observation from conclusion.
2. Why is the MSE repeated at every review? || It is a cross-sectional snapshot of the present state, which changes.
3. What test can you apply to every line you write? || Could another clinician picture the patient from this line alone?
:::

:::mcq
Q: Which line is the best MSE entry for appearance?
- Looks schizophrenic
- Poor hygiene
- *Hair matted, clothes stained with food, strong body odour, barefoot in a cold ward
- Unkempt
> Specific, observable detail that another clinician can picture.
:::

## 1.2 Appearance, behaviour and rapport, in the room [core][starting]
### What to notice in the first minute
| Look at | Why it matters | Example |
|---|---|---|
| Dress and grooming | Self-care, judgement, mood, culture | Bright, mismatched layers and heavy make-up in a hot clinic (possible mania) |
| Build and health | Eating, substances, physical illness | Thin with sunken cheeks; tremor; jaundice |
| Scars, marks, tattoos | Self-harm, injection use, identity | Healed horizontal cuts on the forearm |
| Eye contact | Mood, anxiety, psychosis, culture | Avoids eye contact; or stares fixedly |
| Facial expression | Affect | Mask-like face (depression, parkinsonism) |
| Posture and movement | Psychomotor state, side effects | Slumped and still; or pacing; or a shuffling gait |
| Who speaks first | Family dynamics, insight | Mother answers every question for her 28-year-old son |

### Psychomotor activity: the spectrum
- **Retardation**: slow movements, long pauses before answering, little gesture.
- **Agitation**: restless, pacing, wringing hands, unable to sit.
- **Akathisia**: an inner restlessness with a need to move, often from antipsychotics; the patient often says it feels "inside" ("I can't keep my legs still, it's like ants inside").
- **Catatonic signs**: posturing, waxy flexibility, mutism, staring, negativism, echo phenomena.

:::widget sort
{
  "prompt": "Sort each observation by the most likely psychomotor pattern.",
  "buckets": ["Retardation", "Agitation", "Akathisia (drug-induced)", "Catatonic sign"],
  "items": [
    { "text": "Takes 15 seconds to answer each question, voice flat, barely moves", "bucket": 0 },
    { "text": "Paces the room, wrings her hands, keeps asking, “What will happen to me?”", "bucket": 1 },
    { "text": "Shifts from foot to foot while standing, says his legs “won't stay still”, started after a new injection", "bucket": 2 },
    { "text": "Holds his arm raised above his head for minutes after the examiner lifts it", "bucket": 3, "why": "Maintaining an imposed posture is catalepsy or waxy flexibility." },
    { "text": "Repeats the examiner's gestures exactly", "bucket": 3, "why": "Echopraxia." },
    { "text": "Rocks rapidly, picks at her skin, cannot settle in the chair, says she has not slept for two nights from worry", "bucket": 1 }
  ]
}
:::

:::widget layers
{"title": "The psychomotor spectrum", "shape": "stack", "layers": [{"label": "Excitement", "detail": "Purposeless, extreme overactivity, as in catatonic excitement or severe mania."}, {"label": "Agitation", "detail": "Restless, pacing, hand-wringing, driven by anxiety or mood."}, {"label": "Normal", "detail": "Movements fit the conversation."}, {"label": "Retardation", "detail": "Slow movements, long pauses, few gestures."}, {"label": "Stupor", "detail": "Mute and nearly motionless, often with eyes open and following you."}], "caption": "Akathisia sits apart from this scale: an inner urge to move, usually from a medicine."}
:::

:::widget flow
{"title": "A restless patient: which kind?", "layout": "tree", "nodes": [{"id": "r", "label": "The patient cannot stay still", "detail": "Ask what it feels like, and check medicines and timing."}, {"id": "ak", "parent": "r", "label": "Inner urge, legs 'won't stay still', after a new antipsychotic", "detail": "Akathisia. Rate it, review the medicine; it can drive distress and even suicidal thoughts."}, {"id": "ag", "parent": "r", "label": "Worry, fear, hand-wringing", "detail": "Agitation from anxiety or depression."}, {"id": "ma", "parent": "r", "label": "Goal-directed, cheerful or irritable, little sleep", "detail": "Manic overactivity."}, {"id": "ca", "parent": "r", "label": "Purposeless, odd, with posturing or echo signs", "detail": "Catatonic excitement: screen for catatonia."}, {"id": "de", "parent": "r", "label": "Fluctuating confusion, worse at night", "detail": "Delirium: look for a medical cause."}], "caption": "Restlessness is a description, not a diagnosis. The tree helps you choose the right word."}
:::

:::widget compare
{"title": "Slowed down or wound up?", "a": {"label": "Psychomotor retardation", "points": ["Slow to start moving and to answer", "Long pauses before replies", "Few gestures, a fixed gaze", "Quiet, flat voice", "Typical of severe, melancholic depression"], "summary": "Retardation: everything slows. At the extreme it reaches depressive stupor."}, "b": {"label": "Psychomotor agitation", "points": ["Cannot sit still; gets up and paces", "Wrings hands, picks at skin or clothes", "Restless, pleading, repetitive talk", "Tense, distressed face", "Seen in agitated depression, mixed states, delirium and akathisia"], "summary": "Agitation: purposeless, distressed overactivity. Always check for akathisia if on an antipsychotic."}, "caption": "Describe what you see, in plain words, before you name it. Both can occur in depression, and both raise risk."}
:::

### Rapport and attitude
Note the patient's **attitude to you** (cooperative, guarded, hostile, seductive, over-familiar, indifferent) and how **rapport** developed. Rapport is two-way: write what you observed, not whether you liked them.

:::widget decide
{
  "scene": "Sunita, 38, from a village near Nashik, keeps her eyes on the floor throughout the interview and answers softly. Her husband sits beside her. Your new colleague writes: “Poor eye contact, possibly depressed or psychotic.”",
  "ask": "How should you interpret and record this?",
  "choices": [
    { "label": "Keep the note; poor eye contact is a sign of illness", "verdict": "harm", "outcome": "Her MSE suggests pathology that may simply be cultural modesty, and the team over-reads it.", "why": "In many Indian communities, a woman lowering her gaze before a male stranger or in front of her husband is expected respect, not a symptom." },
    { "label": "Describe it neutrally, consider culture and setting, and if possible speak with her alone, with a female colleague, before deciding what it means", "verdict": "best", "outcome": "Alone with a female doctor she makes good eye contact and describes violence at home.", "why": "The context changes the behaviour. Seeing a patient alone is also essential for safety questions." },
    { "label": "Ask the husband why she won't look at you", "verdict": "ok", "outcome": "He answers for her, and you learn nothing about her state.", "why": "Informants help with history, but the MSE is about her, and his presence may be part of the picture." }
  ]
}
:::

:::sounds How it sounds when the patient describes behaviour
- "Mujhe baithne mein bechaini hoti hai, pair hilte rehte hain" (I feel restless sitting; my legs keep moving): ask about akathisia.
- "I feel like I'm moving through mud. Even lifting the cup is too much." (retardation)
- "I can't stop. If I sit, my heart races." (agitation, anxiety)
:::

:::clinician
Appearance and behaviour carry diagnostic weight beyond psychiatry: signs of alcohol withdrawal (tremor, sweating, tachycardia), Wilson's disease (Kayser-Fleischer rings under slit lamp, tremor), thyroid disease, extrapyramidal side effects (cogwheeling, tremor, bradykinesia), tardive dyskinesia (orofacial movements, best seen while the patient is distracted), and neglect from cognitive decline. Use the Barnes Akathisia Rating Scale and AIMS when antipsychotics are involved. Catatonia should be screened with the Bush-Francis items whenever there is mutism, stupor, posturing or unexplained immobility; it is common in Indian inpatient settings, often in mood disorders, and responds well to lorazepam and ECT.
:::

:::recall
1. Name five things to notice in the first minute. || Dress and grooming, build and health, scars and marks, eye contact, facial expression (also posture, who speaks first).
2. How does akathisia differ from agitation? || Akathisia is an inner urge to move, often drug-induced, felt "inside"; agitation is restlessness from anxiety or mood.
3. Why should poor eye contact be interpreted with caution in India? || It may be cultural respect or modesty, especially in women with male strangers or family present.
:::

:::mcq
Q: A man started on haloperidol injections three days ago now cannot stay seated, shifts his weight constantly, and says his legs feel "full of ants". The most likely finding is:
- Psychomotor retardation
- *Akathisia
- Catatonic excitement
- Tardive dyskinesia
> Inner restlessness after starting an antipsychotic.
:::

## 1.3 Mood versus affect, as you hear and see them [core][starting]
**Mood** is what the patient **tells** you about their sustained feeling. **Affect** is what you **see** of their feeling, moment to moment. Record mood in the patient's **own words**.

### How to ask about mood without leading
- Open: "How have you been feeling in yourself?" or "Aapka mann kaisa rehta hai?"
- Follow: "If you had to put a number on your mood, from 0 (worst ever) to 10 (best ever), what is it today?"
- Avoid: "You're feeling depressed, aren't you?"

:::widget flow
{"title": "Asking about mood without leading", "layout": "chain", "nodes": [{"id": "a", "label": "Open question", "detail": "'How have you been feeling in yourself?' or 'Aapka mann kaisa rehta hai?'"}, {"id": "b", "label": "Their words", "detail": "Write them down exactly: 'Andar se khaali lagta hai.'"}, {"id": "c", "label": "A number", "detail": "'From 0 (worst ever) to 10 (best ever), where are you today?'"}, {"id": "d", "label": "How it varies", "detail": "Through the day, with events, over recent days."}, {"id": "e", "label": "Link to thoughts", "detail": "'When you feel like that, what goes through your mind?' This often opens the door to hopelessness and risk."}], "caption": "The patient names their mood; you never name it for them."}
:::

### Describing affect: five dimensions
| Dimension | Ask yourself | Words to use |
|---|---|---|
| **Quality** | What feeling shows? | Sad, anxious, irritable, euphoric, perplexed |
| **Range** | How much does it vary? | Full, restricted, blunted, flat |
| **Reactivity** | Does it respond to the conversation? | Reactive, non-reactive |
| **Congruence** | Does it match what they say and think? | Congruent, incongruent |
| **Appropriateness** | Does it fit the situation? | Appropriate, inappropriate |

:::widget sort
{
  "prompt": "Mood or affect? Sort each note.",
  "buckets": ["Mood (what the patient reports)", "Affect (what you observe)"],
  "items": [
    { "text": "Says: “I feel empty, like nothing matters.”", "bucket": 0 },
    { "text": "Tearful when talking about her son; smiled briefly at a joke", "bucket": 1 },
    { "text": "Rates his mood as 2 out of 10", "bucket": 0 },
    { "text": "Restricted range, sad, reactive", "bucket": 1 },
    { "text": "Reports feeling “on top of the world”", "bucket": 0 },
    { "text": "Laughed loudly while describing her father's funeral", "bucket": 1, "why": "This is affect, and it is inappropriate to the content." }
  ]
}
:::

:::widget decide
{
  "scene": "Arjun, 31, a chartered accountant in Gurugram, tells you calmly and with a slight smile that he has “sorted everything out”, written letters to his family and given away his books. When asked about mood he says, “Fine, actually. Peaceful.”",
  "ask": "What is the most important reading of this mental state?",
  "choices": [
    { "label": "Mood euthymic, affect pleasant: no concerns", "verdict": "harm", "outcome": "He is discharged. The family later finds him after a serious attempt.", "why": "Sudden calm with final acts (letters, giving away possessions) can mean a decision to die has been made. Affect and stated mood are incongruent with his actions." },
    { "label": "Record his words and the incongruent calm, and urgently assess suicidal intent and plans", "verdict": "best", "outcome": "On direct questioning he discloses a plan for that night. He is kept safe and treated.", "why": "Incongruence between calm affect and preparatory acts is a red flag. Ask directly; asking does not increase risk." },
    { "label": "Write “mood: fine” and move on to cognition", "verdict": "harm", "outcome": "The key finding is missed.", "why": "Mood in his words is recorded correctly, but the context demands a risk assessment." }
  ]
}
:::

:::widget layers
{"title": "Five dimensions of affect", "shape": "stack", "layers": [{"label": "Quality", "detail": "Which feeling shows: sad, anxious, irritable, euphoric, perplexed."}, {"label": "Range", "detail": "How much it varies: full, restricted, blunted, flat."}, {"label": "Reactivity", "detail": "Does it move with the conversation, for example a brief smile at a joke?"}, {"label": "Congruence", "detail": "Does it match what they say and think? Laughing while saying 'I feel very low' is incongruent."}, {"label": "Appropriateness", "detail": "Does it fit the situation? Laughing while describing a funeral is inappropriate."}], "caption": "Go through all five for every patient and your affect line writes itself."}
:::

:::trap Blunted, flat, restricted, constricted
Different textbooks use these differently. Be consistent and **describe**: "Showed little facial expression or change in tone throughout, even when discussing his mother's death" tells the reader more than the word "blunted".
:::

:::clinician
Mood and affect are not always concordant in illness: in depression with psychotic features, affect may be perplexed or anxious rather than sad; in mixed states, affect may shift rapidly between irritability, tearfulness and elation; in frontal lobe syndromes and pseudobulbar affect, emotional expression is disinhibited or disconnected from experienced feeling. Emotional incontinence and pathological laughing and crying should prompt neurological review. Cultural display rules matter: some patients express distress through somatic complaints with relatively controlled affect, and smiling can be a social politeness rather than incongruence.
:::

:::recall
1. Define mood and affect in one line each. || Mood: the sustained feeling the patient reports. Affect: the feeling the examiner observes, moment to moment.
2. Name the five dimensions of affect. || Quality, range, reactivity, congruence, appropriateness.
3. Why is sudden calm in a depressed patient a concern? || It may follow a decision to die; it calls for a direct suicide risk assessment.
:::

:::mcq
Q: A woman says she feels "very low" but laughs and jokes throughout the interview. This is best described as:
- Inappropriate affect
- *Affect incongruent with stated mood
- Flat affect
- Euthymic mood
> Mismatch between what she reports and what you see is incongruence.
:::

## 1.4 Level check · Starting [core][starting]
Score 80% or more to open the Beginner level.

:::mcq
Q: The MSE begins:
- After the history is complete
- *From the first moment of contact, at the door
- Only when the patient agrees to questions
- With the MMSE
> Observation starts immediately.

Q: Which is an observation rather than an interpretation?
- Seems paranoid
- *Looked behind the door twice and asked whether the room was recorded
- Probably psychotic
- Uncooperative personality
> Observable behaviour, described.

Q: The MSE describes:
- The illness over the past year
- *The patient's mental state at the time of the examination
- The family history
- Only cognition
> It is a cross-sectional snapshot.

Q: A patient seen yesterday with pressured speech is calm and normal today. Today's MSE should say:
- Pressured speech
- *Speech normal in rate and volume today
- Not assessed
- Same as yesterday
> Record what is present now.

Q: Which is the best way to record mood?
- Depressed
- *In the patient's own words, for example "I feel empty all the time"
- As the examiner's impression only
- As a diagnosis
> Mood is subjective; quote it.

Q: An inner urge to move after starting an antipsychotic is:
- Agitation
- *Akathisia
- Catatonia
- Retardation
> Drug-induced restlessness.

Q: A patient keeps an arm raised in an odd position for minutes after the examiner positions it. This is:
- Echopraxia
- *Catalepsy or waxy flexibility
- Mannerism
- Akathisia
> A catatonic sign.

Q: Copying the examiner's movements is:
- Echolalia
- *Echopraxia
- Perseveration
- Stereotypy
> Echolalia copies words.

Q: Lowered gaze in a young Indian woman interviewed with her husband present should first be:
- Recorded as psychotic withdrawal
- *Described neutrally and interpreted in cultural context, ideally after seeing her alone
- Ignored
- Treated as hostility
> Culture and setting change behaviour.

Q: Affect that does not fit what the patient is saying is called:
- Restricted
- *Incongruent
- Reactive
- Euthymic
> Mismatch with content or stated mood.

Q: Laughing while describing a parent's death is best described as:
- Blunted affect
- *Inappropriate affect
- Reactive affect
- Euthymic mood
> Mismatched to the situation.

Q: A depressed man who has given away his belongings says he feels "peaceful". The priority is:
- Recording euthymia
- *Direct assessment of suicidal intent and plans
- Cognitive testing
- Discharge
> A red flag for suicide.

Q: Which is the best open question about mood?
- "You're depressed, aren't you?"
- *"How have you been feeling in yourself lately?"
- "Are you happy?"
- "Rate your depression"
> Open, non-leading.
:::

# Part II · Beginner: the confusable pairs, by ear

## 2.1 Speech and thought form: hearing the difference [core][beginner]
Thought form is judged from **speech**. You cannot see thoughts, only how words connect. The trick is to listen for **where the answer goes** and **how the links hold**.

### The decision path
1. **Did they reach the point?** Yes, eventually, after many details: **circumstantiality**. No, they drifted away and never came back: **tangentiality**.
2. **Are the links between ideas understandable?** Yes, but jumping fast, often by sound or puns: **flight of ideas**. No, the links cannot be followed: **loosening of association** (derailment).
3. **Did the flow stop suddenly?** Mid-sentence, then a new topic: **thought block**.
4. **Is there a lot of speech but little information?** **Poverty of content**. Very little speech at all? **Poverty of speech**.

:::widget sort
{
  "prompt": "Each line is a reply to the question “What brought you to hospital?” Sort them.",
  "buckets": ["Circumstantial", "Tangential", "Flight of ideas", "Loosening of association"],
  "items": [
    { "text": "“Well, on Monday I woke at six, as usual, made tea, my wife was at her sister's, the milk had gone off, so I went to the shop, the shopkeeper's son is studying medicine, anyway, then my chest hurt and my neighbour brought me here.”", "bucket": 0, "why": "Many details, but he got there." },
    { "text": "“Hospitals. Hospitals in Delhi are crowded. My cousin works in Dubai, the airport there is very modern, they have gold machines.”", "bucket": 1, "why": "Drifted off and never returned to the question." },
    { "text": "“I came by car, car, star, I'm a star, stars in the sky, sky-high prices, prices of onions, I'll fix the economy!”", "bucket": 2, "why": "Fast, with sound and word links you can follow." },
    { "text": "“The window went yellow because of my brother's electricity, and so the tables are for counting.”", "bucket": 3, "why": "No understandable link between the ideas." }
  ]
}
:::

:::widget decide
{
  "scene": "You ask Mr Pillai, 68, a retired teacher in Thrissur, why he stopped taking his tablets. He spends four minutes describing the pharmacy, the price rise, his late wife's routine with medicines, and a conversation with his son, then says, “So that is why I stopped: I couldn't remember which ones without her.”",
  "ask": "How should this be recorded?",
  "choices": [
    { "label": "Tangential thinking, suggestive of psychosis", "verdict": "harm", "outcome": "The team considers an antipsychotic for an older man who is simply detailed and grieving.", "why": "He reached the goal. That is circumstantiality, common in older people, obsessional personalities and some neurological conditions, and often normal." },
    { "label": "Circumstantial, goal reached; note the content (grief, memory difficulty) and screen cognition", "verdict": "best", "outcome": "The cognitive screen shows mild memory problems; a pill organiser and his son's help solve the adherence issue.", "why": "Accurate labelling plus attention to the content that matters." },
    { "label": "Formal thought disorder", "verdict": "harm", "outcome": "An inaccurate label follows him through the system.", "why": "Circumstantiality is not considered formal thought disorder in the psychotic sense." }
  ]
}
:::

:::widget flow
{"title": "The thought form decision path", "layout": "tree", "nodes": [{"id": "r", "label": "Listen to how the answer travels", "detail": "Thought form is judged from speech. Ask a simple, open question and listen."}, {"id": "g", "parent": "r", "label": "Did they reach the point?", "detail": "Ask this first."}, {"id": "g1", "parent": "g", "label": "Yes, after many details", "detail": "Circumstantiality. Often normal in older or very detailed people."}, {"id": "g2", "parent": "g", "label": "No, drifted off and never returned", "detail": "Tangentiality."}, {"id": "l", "parent": "r", "label": "Can you follow the links?", "detail": "Ask this when ideas jump."}, {"id": "l1", "parent": "l", "label": "Yes, fast, by sound or pun", "detail": "Flight of ideas: think mania."}, {"id": "l2", "parent": "l", "label": "No, links cannot be followed", "detail": "Loosening of association (derailment)."}, {"id": "b", "parent": "r", "label": "Did the flow stop suddenly?", "detail": "Thought block. Ask whether the thought felt taken away (thought withdrawal)."}, {"id": "p", "parent": "r", "label": "Lots of words, little information?", "detail": "Poverty of content. Very few words at all is poverty of speech."}], "caption": "Four questions sort most thought form findings. Always keep a quote that shows which branch you chose."}
:::

:::widget compare
{"title": "Flight of ideas or loosening of association?", "a": {"label": "Flight of ideas", "points": ["Fast, pressured speech", "Each link can be followed: by sound, puns or nearby ideas", "The goal is lost, but the steps make sense", "Typical of mania"], "summary": "Flight of ideas: rapid jumps you can trace. 'Car, star, I'm a star, stars in the sky.'"}, "b": {"label": "Loosening of association", "points": ["Speed may be normal", "The links between ideas cannot be followed", "Even the listener cannot reconstruct the path", "Typical of schizophrenia"], "summary": "Loosening: the bridges between ideas are missing. 'The window went yellow because of my brother's electricity.'"}, "caption": "The test is whether you can follow the bridge between one idea and the next, not how fast the person speaks."}
:::

### Rate and flow of speech, heard
| Finding | What you hear | Often seen in |
|---|---|---|
| **Pressure of speech** | Hard to interrupt, fast, loud, keeps going | Mania |
| **Poverty of speech** | Brief replies, little spontaneous speech | Depression, negative symptoms |
| **Latency** | Long delay before each answer | Depression, catatonia, sedation |
| **Thought block** | Stops mid-sentence; says the thought vanished | Schizophrenia (and sometimes anxiety) |
| **Neologisms** | New words with private meaning | Schizophrenia, some aphasias |
| **Dysarthria** | Slurred articulation | Intoxication, neurological disease |

:::widget brainmap
{"title": "Language areas: when it is aphasia, not thought disorder", "focus": ["broca", "wernicke", "prefrontal", "temporal"], "notes": {"broca": "Damage here gives halting, effortful speech with good understanding. Do not mistake it for poverty of speech or thought block.", "wernicke": "Damage here gives fluent speech full of wrong or invented words with poor understanding. It can sound like loosening of association; check comprehension, naming and repetition.", "prefrontal": "Planning and organising speech. Frontal problems can give poverty of speech, perseveration and disinhibited talk.", "temporal": "Language comprehension and memory. Temporal lobe problems can also cause olfactory and complex hallucinations."}, "caption": "If speech suddenly becomes jumbled in an older person, or after a head injury or stroke, think of the brain before thinking of psychosis."}
:::

:::sounds Thought block, in the patient's words
"I was telling you about... it's gone. Like someone took it. Just empty." If they explain it as someone removing the thought, ask about **thought withdrawal**, which is a passivity experience, not just a block.
:::

:::clinician
Andreasen's Thought, Language and Communication scale gives operational definitions for 18 items, including derailment, tangentiality, incoherence, illogicality, clanging, neologisms, pressure, poverty of content and circumstantiality; its tangentiality item refers specifically to oblique replies to a question, while derailment refers to drift in spontaneous speech. Differential: fluent (Wernicke's) aphasia can mimic loosening, with paraphasias and poor comprehension; delirium produces fluctuating incoherence with inattention; intoxication causes slurring and disinhibition. Bilingual patients may switch languages; assess thought form in the patient's strongest language where possible, and distinguish code-switching from disorganisation.
:::

:::recall
1. What single question separates circumstantiality from tangentiality? || Did they reach the goal?
2. How does flight of ideas differ from loosening of association? || In flight of ideas the links (sound, puns, associations) can be followed; in loosening they cannot.
3. What is thought block, and what should you ask next? || Sudden stopping mid-thought; ask whether they feel the thought was taken away (thought withdrawal).
:::

:::mcq
Q: "I came on the bus, the bus was red, red like blood, blood bank, bank loans, loans are a trap!" said rapidly with a cheerful face. This is:
- Circumstantiality
- Loosening of association
- *Flight of ideas
- Perseveration
> Followable links, fast, in an elevated mood.

Q: A patient answers every question with a long, colourless account full of irrelevant detail but always reaches the point. This is:
- Tangentiality
- *Circumstantiality
- Thought block
- Derailment
> The goal is reached.
:::

## 2.2 Thought content: delusions, overvalued ideas and obsessions [core][beginner]
### Three look-alikes
| | Delusion | Overvalued idea | Obsession |
|---|---|---|---|
| Held with | Unshakeable conviction | Strong, feeling-charged belief, less fixed | The person recognises it as their own and senseless |
| Against evidence? | Not changed by evidence | Partly open to reason | They already know it is excessive |
| Culture | Not shared by their group | Often understandable in their context | Not a belief, an unwanted intrusion |
| Resisted? | No | No | **Yes**, the person tries to push it away |
| Example | "My neighbours put a chip in my tooth to read my thoughts." | "My nose is ugly and ruins my life." (body dysmorphic concern) | "I keep thinking I'll shout something obscene in the temple. I hate these thoughts." |

:::widget flow
{"title": "Delusion, overvalued idea, obsession or shared belief?", "layout": "tree", "nodes": [{"id": "r", "label": "A strongly held or troubling idea", "detail": "Ask how they know, how sure they are, and what others in their community think."}, {"id": "o", "parent": "r", "label": "Recognised as their own, unwanted and resisted?", "detail": "Obsession. The person knows it is excessive and tries to push it away."}, {"id": "c", "parent": "r", "label": "Shared by their family and community, held in the usual way?", "detail": "A cultural belief, not a delusion. Ask whether the patient's version goes further than the shared one."}, {"id": "v", "parent": "r", "label": "Strong, emotionally charged, partly open to reason?", "detail": "Overvalued idea, as in weight and shape beliefs in anorexia."}, {"id": "d", "parent": "r", "label": "Fixed, not changed by evidence, not shared?", "detail": "Delusion. Then rate conviction, preoccupation, distress and action."}], "caption": "The questions are about how the belief is held, not only what it says."}
:::

:::widget layers
{"title": "The insight dial for intrusive beliefs", "shape": "stack", "layers": [{"label": "Good or fair insight", "detail": "'I know it's ridiculous, but I keep thinking my hands are dirty.' Typical obsession."}, {"label": "Poor insight", "detail": "'It's probably true that my hands are contaminated.'"}, {"label": "Absent insight or delusional belief", "detail": "'I am completely sure the germs are there.' In OCD and body dysmorphic disorder this is still recorded as OCD or BDD with absent insight, not as a psychotic disorder."}], "caption": "In OCD, body dysmorphic disorder and hoarding, insight is a dial rather than a switch."}
:::

### How to explore beliefs without arguing
1. Ask openly: "Has anything strange or puzzling been happening?"
2. Follow with curiosity: "How did you come to know this?" "What evidence do you have?"
3. Test conviction gently: "Is there any chance it could be something else?"
4. Ask about **action and distress**: "Have you done anything to protect yourself?"
5. Ask about **cultural fit**: would family members or others from their community see it the same way?

:::widget sort
{
  "prompt": "Delusion, overvalued idea, or obsession?",
  "buckets": ["Delusion", "Overvalued idea", "Obsession"],
  "items": [
    { "text": "“The TV newsreader sends me messages about my mission to save India.” Fully convinced.", "bucket": 0 },
    { "text": "“I must be thin; my worth depends on it.” Accepts others disagree but won't change.", "bucket": 1, "why": "Typical of the weight and shape beliefs in anorexia nervosa." },
    { "text": "“What if I didn't lock the door and my family gets robbed? I know I locked it. I check eight times.”", "bucket": 2 },
    { "text": "“My wife is having an affair; I know because the curtains were left half open.” Unshakeable.", "bucket": 0, "why": "A delusion of infidelity with a bizarre basis, and a risk to the wife." },
    { "text": "“I keep seeing images of stabbing my baby. I'm horrified; I'd never do it.”", "bucket": 2, "why": "Ego-dystonic, resisted, horrifying to the person: a classic postpartum obsession, not intent." },
    { "text": "“My hair loss is a disaster, everyone is staring.” Holds strongly; partly accepts it may be exaggerated.", "bucket": 1 }
  ]
}
:::

:::widget decide
{
  "scene": "Mrs Nair, 32, two months after the birth of her first baby in Kochi, says in a whisper: “I keep getting pictures of the baby falling from the balcony, of me dropping her. I've stopped going near the balcony. Am I going mad? Will they take her away?”",
  "ask": "What is the most likely nature of these thoughts, and the right response?",
  "choices": [
    { "label": "These are thoughts of harming the baby; inform child protection and separate them", "verdict": "harm", "outcome": "She is terrified, stops disclosing, and her OCD worsens.", "why": "Ego-dystonic, resisted, horrifying images with avoidance are obsessions. They are not linked to increased risk of harm. Separation causes harm." },
    { "label": "Recognise likely postpartum obsessions: reassure her that these thoughts are common in OCD and do not mean she wants to act, assess for psychosis and depression, and offer treatment", "verdict": "best", "outcome": "She cries with relief and begins CBT with exposure and response prevention; mother and baby stay together.", "why": "Accurate recognition protects the mother and baby. Always still check for psychosis, where risk is different." },
    { "label": "Tell her everyone has such thoughts, so no treatment is needed", "verdict": "ok", "outcome": "She feels better briefly, but the obsessions and avoidance grow.", "why": "Normalising helps, but distressing obsessions with avoidance merit treatment." }
  ]
}
:::

:::widget flow
{"title": "Exploring a belief without arguing", "layout": "chain", "nodes": [{"id": "a", "label": "Open door", "detail": "'Has anything strange or puzzling been happening?'"}, {"id": "b", "label": "Curiosity", "detail": "'How did you come to know this? What makes you sure?'"}, {"id": "c", "label": "Gentle test", "detail": "'Is there any chance it could be something else?' Note how firmly they hold on."}, {"id": "d", "label": "Action and distress", "detail": "'Have you done anything to protect yourself? How much does it worry you?'"}, {"id": "e", "label": "Cultural fit", "detail": "'Would your family see it the same way?'"}], "caption": "You are mapping the belief, not winning an argument. Arguing makes people hide what they believe."}
:::

:::trap Postpartum obsession versus postpartum psychosis
In postpartum OCD, harm thoughts are **unwanted, resisted and frightening**, and the mother avoids the baby to protect it. In postpartum psychosis there may be **delusions** (the baby is evil, or must be saved by death), confusion and rapidly changing mood. Postpartum psychosis is an **emergency**.
:::

:::clinician
Practical points: rate delusional conviction, preoccupation, distress and action (as in the PSYRATS delusion scale) rather than just presence. Delusions with jealousy or persecution focused on a specific person, with planning or prior violence, raise risk to others; ask about weapons and intentions. For culturally shaped beliefs (sorcery, possession, the evil eye), ask whether family members share the belief and whether the patient's version goes beyond the shared one in conviction, elaboration or idiosyncrasy. DSM-5-TR specifies insight in OCD, BDD and hoarding (good or fair, poor, absent insight or delusional beliefs), so the line between obsession and delusion is a continuum in those disorders.
:::

:::recall
1. Name the key feature that separates an obsession from a delusion. || Obsessions are recognised as one's own and resisted; delusions are held with conviction and not resisted.
2. Give five steps to explore a belief without arguing. || Ask openly; ask how they know; gently test conviction; ask about action and distress; ask about cultural fit.
3. How do postpartum harm obsessions differ from postpartum psychosis? || Obsessions are unwanted, resisted and lead to avoidance; psychosis involves delusions, confusion and changing mood, and is an emergency.
:::

:::mcq
Q: A man says, "I know it's ridiculous, but I keep thinking my hands are contaminated, and I wash them 50 times a day." This is:
- A delusion of contamination
- *An obsession with a compulsion
- An overvalued idea
- A hallucination
> He recognises it as senseless and is driven to neutralise it.
:::

## 2.3 Perception: true and pseudo-hallucinations, illusions and more [core][beginner]

:::widget figure
{"id": "muller-lyer"}
:::
### The questions that sort perceptions
1. **Is there a real stimulus?** If yes and it is misperceived: **illusion**. If no: **hallucination** (or imagery).
2. **Where is it experienced?** Out in the world, through the senses: **true hallucination**. Inside the head, "in my mind's ear", with insight that it comes from within: **pseudo-hallucination**.
3. **Does it come when falling asleep or waking?** **Hypnagogic** (falling asleep) or **hypnopompic** (waking): often normal.
4. **Is a real sound producing a separate voice at the same time?** **Functional hallucination** (the fan's hum and a voice heard together).

:::widget sort
{
  "prompt": "Sort each experience.",
  "buckets": ["True hallucination", "Pseudo-hallucination", "Illusion", "Normal or near-normal experience"],
  "items": [
    { "text": "Hears two men's voices outside the window discussing his every move; looks out to find them", "bucket": 0 },
    { "text": "In a dark corridor, a coat on a hook looks like a person for a second", "bucket": 2 },
    { "text": "Hears her dead father's voice “inside my head”, knows it is her own mind, finds it comforting", "bucket": 1, "why": "Experienced in inner space with insight. Brief experiences of a dead loved one are also common in normal grief." },
    { "text": "Hears her name called just as she is falling asleep", "bucket": 3, "why": "Hypnagogic experiences are common and usually normal." },
    { "text": "Smells burning rubber before a seizure", "bucket": 0, "why": "An olfactory hallucination as part of a focal seizure aura; ask about neurological symptoms." },
    { "text": "After 36 hours awake on exam duty, briefly sees the floor ‘ripple’", "bucket": 2, "why": "A perceptual distortion of a real stimulus under fatigue." }
  ]
}
:::

:::widget flow
{"title": "Sorting a perceptual experience", "layout": "tree", "nodes": [{"id": "r", "label": "The person describes an unusual perception", "detail": "Work through the questions in order."}, {"id": "s", "parent": "r", "label": "Is there a real stimulus?", "detail": "Yes and misperceived: illusion. Yes, with a separate voice heard alongside it: functional hallucination."}, {"id": "n", "parent": "r", "label": "No stimulus: where is it experienced?", "detail": "Out in the world through the senses: true hallucination. Inside the head, often with insight: pseudo-hallucination."}, {"id": "t", "parent": "r", "label": "Only when falling asleep or waking?", "detail": "Hypnagogic or hypnopompic: usually normal."}, {"id": "m", "parent": "r", "label": "Which sense?", "detail": "Visual, olfactory and gustatory hallucinations point towards organic causes; look for delirium, seizures, drugs."}], "caption": "Describe location, vividness, control and insight separately; the labels are used inconsistently."}
:::

:::widget brainmap
{"title": "Where perception goes wrong", "focus": ["temporal", "occipital", "thalamus", "wernicke"], "notes": {"temporal": "Auditory cortex is active when people hear voices. Temporal lobe seizures can cause smells, tastes, deja vu and complex scenes.", "occipital": "Visual cortex. Visual hallucinations suggest delirium, Lewy body disease, Parkinson's disease, drugs, or visual loss (Charles Bonnet syndrome).", "thalamus": "The sensory relay. Disturbed filtering of input is one theory of hallucinations.", "wernicke": "Language areas are active during verbal hallucinations, supporting the idea that voices can be inner speech experienced as coming from outside."}, "caption": "The sense involved is a clue to the cause. Voices are commonest in psychiatric illness; sight, smell and taste raise the chance of a brain or body cause."}
:::

:::widget compare
{"title": "True hallucination or pseudo-hallucination?", "a": {"label": "True hallucination", "points": ["Felt as coming from outside: 'from the corner of the room'", "As real and solid as a normal perception", "Not under the person's control", "Often seen in psychosis"], "summary": "True hallucination: in outer space, with the full quality of a real perception."}, "b": {"label": "Pseudo-hallucination", "points": ["Experienced in inner space: 'inside my head'", "Vivid, but lacks the solid quality of real perception", "May be recognised as not quite real", "Seen in grief, trauma, dissociation and some personality disorders, as well as psychosis"], "summary": "Pseudo-hallucination: vivid inner experience. It is not proof of psychosis, and not proof against it."}, "caption": "Ask: 'Where do you hear it: through your ears, or inside your head?' Then judge it in the context of the whole MSE."}
:::

### How to ask, in the room
- Normalise first: "Sometimes when people are under great stress, they hear things others can't hear. Has anything like that happened to you?"
- Then specify: "Is it one voice or more? Man or woman? Do you recognise it? Where does it seem to come from? What does it say? Does it talk to you or about you? Does it tell you to do things? Do you obey?"
- Observe: pausing, glancing, muttering, laughing to oneself, covering ears.

:::widget decide
{
  "scene": "Grace, 26, a nurse in Shillong, describes a voice that tells her she is useless and should cut herself. She says it is “like my own thoughts but in someone else's voice, inside my head”. She has a history of childhood abuse and self-harm, and no other psychotic features.",
  "ask": "What is the most useful way to record and respond?",
  "choices": [
    { "label": "Write “pseudo-hallucinations, not psychotic, low risk” and move on", "verdict": "harm", "outcome": "The command content is not assessed. She self-harms that night.", "why": "Whatever the location of the voice, commands to self-harm need a full risk assessment. 'Pseudo' does not mean harmless." },
    { "label": "Record the voice's location, character and commands in her words, assess risk and whether she acts on commands, and consider trauma-related causes alongside psychosis", "verdict": "best", "outcome": "A safety plan is made and she is referred for trauma-focused care.", "why": "Describe precisely, assess risk, and keep the differential open. Voices are common in trauma-related conditions." },
    { "label": "Diagnose schizophrenia because she hears voices", "verdict": "harm", "outcome": "She is started on antipsychotics without a full assessment and feels misunderstood.", "why": "Hearing voices alone does not make schizophrenia. The whole picture matters." }
  ]
}
:::

:::widget curve
{"kind": "sdt", "title": "Hearing a voice in the noise", "caption": "Signal detection helps explain voices. Imagine trying to hear a faint voice in background noise. People who hallucinate tend to have a more liberal criterion, especially when stressed, tired or primed to expect voices. It is a way of thinking about a mechanism, not a test."}
:::

:::trap "Pseudo" is not "fake"
A pseudo-hallucination is a real experience of a particular kind (inner space, often with insight). It is not malingering. The term is used inconsistently across books, so **describe the experience** rather than relying on the label.
:::

:::clinician
The term "pseudo-hallucination" has two traditions: Jaspers (lacking the concrete, external quality of a true perception, experienced in inner subjective space) and Hare/Sedman usage (experienced with insight into its unreality). Many authorities now recommend describing location, vividness, sense of control and insight separately. Voice-hearing in borderline personality disorder and trauma-related disorders is phenomenologically similar to voices in schizophrenia in several comparative studies, so location alone should not drive the diagnosis. Visual hallucinations should prompt a search for organic causes (delirium, Lewy body disease, Parkinson's disease, Charles Bonnet syndrome in visual loss, drugs). Olfactory and gustatory hallucinations suggest temporal lobe pathology.
:::

:::recall
1. Which question separates illusion from hallucination? || Is there a real stimulus?
2. How does a pseudo-hallucination differ from a true hallucination? || Experienced in inner space, often with insight, lacking the concrete external quality of a perception.
3. Name two normal or near-normal perceptual experiences. || Hypnagogic and hypnopompic experiences; brief experiences of a dead loved one in grief.
4. What should visual hallucinations prompt? || A search for organic causes (delirium, Lewy body disease, drugs, visual loss).
:::

:::mcq
Q: A man hears a voice commenting on his actions only when the ceiling fan is on, and hears both the fan and the voice together. This is a:
- Reflex hallucination
- *Functional hallucination
- Illusion
- Hypnopompic hallucination
> The real stimulus triggers a separate hallucination heard alongside it.
:::

## 2.4 Cognition at the bedside [core][beginner]
Cognition is the part of the MSE most often done **badly**: rushed, or skipped because the patient "seems fine". Problems with attention and memory change everything that follows.

:::widget figure
{"id": "copy-and-clock"}
:::

### A quick, reliable bedside sequence
1. **Level of consciousness**: alert, drowsy, fluctuating?
2. **Orientation**: time (day, date, month, year, time of day), place, person.
3. **Attention**: months of the year backwards; serial sevens from 100; digit span.
4. **Registration and recall**: three words now, recall after five minutes.
5. **Remote memory**: verifiable personal and public events.
6. **Language and praxis** if needed: naming, following a three-step command.
7. **Abstract thinking**: similarities ("How are an apple and a banana alike?"), proverbs (culturally appropriate).

:::widget guess
{
  "prompt": "Forward digit span: how many digits in a row can a typical healthy adult repeat back correctly?",
  "min": 1,
  "max": 15,
  "unit": "digits",
  "answer": [5, 9],
  "reveal": "Usually five to nine (the famous 'seven, plus or minus two'). Fewer than five in an alert person points to an attention problem, which is the core of delirium.",
  "clinician": "Forward span below five in an alert, cooperative adult suggests impaired attention; backward span is normally about one to two digits less. Education, anxiety, hearing and language of testing affect performance, so interpret against the patient's background."
}
:::

:::widget flow
{"title": "The bedside cognitive sequence", "layout": "chain", "nodes": [{"id": "a", "label": "Consciousness", "detail": "Alert, drowsy or fluctuating? If clouded, everything else is affected."}, {"id": "b", "label": "Orientation", "detail": "Time, place and person."}, {"id": "c", "label": "Attention", "detail": "Months backwards, digit span, serial sevens if numerate."}, {"id": "d", "label": "Registration and recall", "detail": "Three words now; recall after five minutes."}, {"id": "e", "label": "Remote memory", "detail": "Verifiable personal and public events."}, {"id": "f", "label": "Language and praxis", "detail": "Naming, a three-step command, copying a figure."}, {"id": "g", "label": "Abstraction", "detail": "Similarities, or local proverbs used with care."}], "caption": "Attention comes before memory: an inattentive patient will fail memory tests for the wrong reason."}
:::

:::widget curve
{"kind": "normal", "title": "Reading a score against the right norms", "caption": "A cognitive score means little until you know where it sits for people of the same age and education. Always record education and the language of testing."}
:::

:::widget memoryflow
{"title": "Where each bedside test sits in the memory system", "caption": "Months backwards and digit span test attention and working memory. Three words now and again after five minutes test encoding and retrieval. Remote events test long-term storage. If attention fails, the later tests cannot be read: a person who cannot attend cannot register the words. This is why the order matters."}
:::

### Delirium, dementia and depression: the bedside contrast
| | Delirium | Dementia | Depression with cognitive complaints |
|---|---|---|---|
| Onset | Sudden, hours to days | Gradual, over months to years | Over a period of mood change |
| Course | **Fluctuates**, worse at night | Slowly progressive | Mood-linked |
| Attention | **Markedly impaired** | Often preserved early | Poor effort, "I don't know" answers |
| Consciousness | Clouded or fluctuating | Clear (early) | Clear |
| Patient's view | Often unaware | Often minimises | Complains of poor memory |

:::widget decide
{
  "scene": "Mr Hughes, 79, a retired engineer in Manchester, recovering from hip surgery, was chatting normally this morning. Tonight he is pulling at his drip, insists the nurses are soldiers, and cannot say the months backwards. His daughter says, “He's never been like this.”",
  "ask": "What should you do first?",
  "choices": [
    { "label": "Start a regular antipsychotic for his new psychosis", "verdict": "harm", "outcome": "He becomes oversedated and falls. The cause, a urinary infection with opioid toxicity, is found two days later.", "why": "Sudden fluctuating confusion with inattention is delirium until proven otherwise. Treat the cause first." },
    { "label": "Recognise probable delirium: screen formally, look for causes (infection, drugs, pain, retention, dehydration, electrolytes), and use calm, non-drug management", "verdict": "best", "outcome": "A urinary infection and opioid excess are found and treated; he is back to himself in a few days.", "why": "Acute onset, fluctuation and inattention are the key features. Identifying and treating causes is the main treatment." },
    { "label": "Diagnose dementia and plan a care home", "verdict": "harm", "outcome": "A reversible condition is treated as permanent.", "why": "Dementia is gradual; this was sudden." }
  ]
}
:::

:::widget flow
{"title": "A confused patient: delirium, dementia or depression?", "layout": "tree", "nodes": [{"id": "r", "label": "The patient seems confused or forgetful", "detail": "Ask the family how it started and how it changes through the day."}, {"id": "d1", "parent": "r", "label": "Sudden onset, fluctuating, inattentive", "detail": "Delirium until proven otherwise. Look for infection, drugs, withdrawal, pain, retention, metabolic causes."}, {"id": "d2", "parent": "r", "label": "Slow decline over months, attention fairly kept early", "detail": "Dementia. Screen formally and look for treatable contributors."}, {"id": "d3", "parent": "r", "label": "Followed low mood; 'I don't know' answers; complains loudly", "detail": "Depression with cognitive complaints. Treat and re-test; follow up."}, {"id": "d4", "parent": "r", "label": "More than one?", "detail": "Common in older people: delirium on top of dementia is frequent and often missed."}], "caption": "Onset, course and attention decide most cases at the bedside."}
:::

:::widget compare
{"title": "Depression with memory complaints or early dementia?", "a": {"label": "Depression with cognitive complaints", "points": ["Complains a lot about poor memory", "'I don't know' answers, with little effort", "Onset with mood change, often fairly quick", "Low mood, guilt and poor sleep are obvious", "Improves when the depression is treated"], "summary": "Depression: the patient worries about memory more than the tests show."}, "b": {"label": "Early dementia", "points": ["Often unaware of the problem, or plays it down", "Tries hard, gives near misses or makes up answers", "Slow, gradual onset over months to years", "Mood may be normal or low", "Gets steadily worse over time"], "summary": "Dementia: the family worries more than the patient does."}, "caption": "The two often overlap in older adults, and late-life depression can be an early sign of dementia. Treat the depression and recheck cognition afterwards."}
:::

:::note Make tests fair
Serial sevens are unfair to someone who never learned arithmetic, and some proverbs are culture-bound. Use **months backwards** or **days of the week backwards** in the patient's language, and use local proverbs ("Naach na jaane aangan tedha") with care, or choose similarities instead. Record the patient's education.
:::

:::clinician
Delirium screening: the 4AT (alertness, AMT4, attention via months backwards, acute change or fluctuating course) is quick and validated; the CAM and CAM-ICU require inattention plus acute onset/fluctuation, and either disorganised thinking or altered consciousness. In India, the Hindi Mental State Examination (HMSE) and education-adjusted MMSE and MoCA cut-offs are used; low-literacy versions exist. Remember hypoactive delirium (quiet, withdrawn, often mistaken for depression), which carries a worse prognosis. Pseudodementia in depression is better called depression-related cognitive impairment; it may herald later dementia in older adults, so follow up.
:::

:::recall
1. Give the seven steps of the bedside cognitive sequence. || Consciousness, orientation, attention, registration and recall, remote memory, language and praxis, abstract thinking.
2. What is the core cognitive feature of delirium? || Impaired attention, with acute onset and fluctuation.
3. Why may serial sevens be unfair? || They depend on numeracy and education; use months or days backwards instead.
:::

:::mcq
Q: Which feature most clearly distinguishes delirium from early dementia?
- Memory complaints
- Age over 65
- *Acute onset with fluctuating attention and consciousness
- Word-finding difficulty
> Inattention and fluctuation define delirium.
:::

## 2.5 Insight, explanatory models and judgement [core][beginner]
The six insight grades are in Module 1 (section 2.7). In practice, insight is not one number. Ask about **four parts**:
1. **Awareness** of change or symptoms: "Have you noticed anything different in yourself?"
2. **Attribution** to illness: "What do you think is causing it?"
3. **Need for treatment**: "Do you think treatment could help?"
4. **Relabelling** of experiences: "Could the voices be part of an illness?"

:::widget layers
{"title": "Four parts of insight", "shape": "stack", "layers": [{"label": "Awareness of change", "detail": "'Have you noticed anything different in yourself?'"}, {"label": "Attribution to illness", "detail": "'What do you think is causing it?' A cultural explanation can sit beside a medical one."}, {"label": "Accepting treatment", "detail": "'Do you think treatment could help?'"}, {"label": "Relabelling experiences", "detail": "'Could the voices be part of an illness?'"}], "caption": "Record each part. A single grade hides the detail that guides treatment."}
:::

### Explanatory models: the patient's own story of the illness
Many Indian patients and families explain illness through **sorcery (jaadu-tona), the evil eye (nazar), spirits, karma, heat ('garmi'), weakness ('kamzori') or loss of semen ('dhat')**. These are **cultural explanations**, not delusions, when they are shared by the family and community and held in the usual way. Many patients hold **both** a cultural and a medical explanation at once, and take medicine while visiting a temple or dargah.

:::widget decide
{
  "scene": "Ramesh, 35, from a village near Gaya, has schizophrenia. He says his illness is from a neighbour's black magic and he visits a healer every Tuesday. He also takes his tablets every day and says, “Doctor's medicine stops the voices; the baba's work removes the magic.”",
  "ask": "How should his insight be recorded?",
  "choices": [
    { "label": "Insight absent: he believes it is black magic", "verdict": "harm", "outcome": "The team treats him as non-adherent and considers an injection he does not need.", "why": "He recognises illness, accepts treatment and adheres to it. A cultural explanation alongside medical treatment is common and not poor insight." },
    { "label": "Describe each part: aware of illness, attributes it to sorcery (shared in his community), accepts and adheres to medicine; work with both models", "verdict": "best", "outcome": "The team respects his views, and he continues both. His family becomes an ally in treatment.", "why": "Breaking insight into parts gives a truer, more useful picture. Collaboration with explanatory models improves engagement." },
    { "label": "Tell him black magic is nonsense and he must stop seeing the healer", "verdict": "harm", "outcome": "He feels insulted and stops coming to the clinic.", "why": "Attacking a culturally held belief damages trust. Ask only about practices that cause harm (for example chaining, fasting, stopping medicine)." }
  ]
}
:::

:::widget layers
{"title": "Explanatory models around the patient", "shape": "rings", "layers": [{"label": "The patient", "detail": "Their own words for the problem: 'tension', 'kamzori', 'jaadu-tona', 'my mind is ill'."}, {"label": "The family", "detail": "Shared explanations, fears about marriage and reputation, who decides about treatment."}, {"label": "The community and healers", "detail": "Temple, dargah or church, a local healer, neighbours' views."}, {"label": "The clinic", "detail": "The medical model you bring. It works best alongside the others, not against them."}], "caption": "Ask about each ring; challenge only practices that cause harm."}
:::

### Judgement, in real life
Rather than only the classic "letter in the street" test, look at **what the patient is actually doing**: spending, driving, sexual risk, leaving children alone, refusing food. Record examples.

:::widget sort
{
  "prompt": "Sort each finding by the part of insight it shows.",
  "buckets": ["Awareness of change", "Attribution to illness", "Accepts treatment", "Relabels experiences"],
  "items": [
    { "text": "“I've become very short-tempered and can't sleep. That's new.”", "bucket": 0 },
    { "text": "“I think my mind is ill, like my mother's was.”", "bucket": 1 },
    { "text": "“I'll take the tablets if they help me sleep.”", "bucket": 2 },
    { "text": "“Maybe the voices are my illness talking, not real people.”", "bucket": 3 }
  ]
}
:::

:::clinician
Multidimensional insight models, such as David's (awareness of illness, relabelling of psychotic phenomena, treatment adherence), and instruments such as the Schedule for Assessment of Insight (SAI-E) and the Scale to Assess Unawareness of Mental Disorder (SUMD) support this componential approach. Kleinman's explanatory model questions ("What do you call it? What caused it? Why now? What does it do to you? What do you fear most? What treatment do you want?") and the DSM-5-TR Cultural Formulation Interview operationalise the explanatory model. Under the MHCA 2017, capacity to make treatment decisions (understand, retain, use and weigh, communicate) is distinct from insight; a person with partial insight may still have capacity for a particular decision. Document both separately.
:::

:::recall
1. Name the four parts of insight to assess. || Awareness of change, attribution to illness, acceptance of treatment, relabelling of experiences.
2. When is a belief in sorcery a cultural explanation rather than a delusion? || When it is shared by family and community and held in the usual way, without idiosyncratic elaboration.
3. Why assess judgement from real life? || What the patient is actually doing (spending, driving, care of children) is more valid than hypothetical tests.
:::

:::mcq
Q: A woman attributes her depression to "nazar" (the evil eye), as does her family, and takes her antidepressant regularly. Her insight is best described as:
- Absent
- *Present in parts: aware of illness, cultural attribution, accepts treatment
- Delusional
- Grade 6
> Describe the components rather than calling it absent.
:::

## 2.6 Level check · Beginner [core][beginner]
Score 80% or more to open the Advanced level.

:::mcq
Q: A patient gives a long answer full of detail but finally reaches the point. This is:
- Tangentiality
- *Circumstantiality
- Flight of ideas
- Loosening
> Goal reached.

Q: A patient's answer drifts away from the question and never returns to it. This is:
- *Tangentiality
- Circumstantiality
- Perseveration
- Thought block
> Goal abandoned.

Q: Rapid speech with links by rhyme and pun that can be followed suggests:
- Loosening of association
- *Flight of ideas
- Poverty of speech
- Neologism
> Typical of mania.

Q: A patient stops mid-sentence and says the thought was "taken out" of his head. This is:
- Thought block only
- *Thought withdrawal, a passivity experience
- Circumstantiality
- An obsession
> Explanation as external removal makes it withdrawal.

Q: Which is most typical of an obsession?
- Held with total conviction
- *Recognised as one's own, unwanted and resisted
- Shared by the person's culture
- Experienced as coming from outside
> Ego-dystonic and resisted.

Q: A mother has horrifying intrusive images of dropping her baby, avoids the balcony and fears she is "going mad". The most likely explanation is:
- Postpartum psychosis
- *Postpartum obsessions (OCD)
- Delusion of infidelity
- Intent to harm the baby
> Ego-dystonic, resisted, with avoidance.

Q: An overvalued idea differs from a delusion in that it is:
- Always bizarre
- *Strongly held and feeling-charged but less fixed, often understandable in context
- Resisted like an obsession
- A perception without a stimulus
> Less fixed than a delusion.

Q: A coat on a hook seen as a person in dim light is:
- Hallucination
- *Illusion
- Pseudo-hallucination
- Delusional perception
> Misperception of a real stimulus.

Q: Hearing a voice "inside my head" while knowing it comes from one's own mind is best called:
- True hallucination
- *Pseudo-hallucination
- Illusion
- Delusion
> Inner space, with insight.

Q: Visual hallucinations in an older person should first prompt:
- A diagnosis of schizophrenia
- *A search for organic causes such as delirium, Lewy body disease, drugs or visual loss
- Reassurance only
- An IQ test
> Visual hallucinations suggest an organic cause.

Q: A forward digit span of 3 in an alert adult suggests:
- Normal attention
- *Impaired attention, as in delirium
- High intelligence
- Depression only
> Normal is about five to nine.

Q: Which feature best distinguishes delirium from dementia?
- Memory loss
- *Acute onset with fluctuating attention
- Older age
- Poor sleep
> Inattention and fluctuation.

Q: For a patient with little schooling, the fairest attention test is:
- Serial sevens
- *Months or days of the week backwards in their own language
- Abstract proverbs in English
- Spelling WORLD backwards in English
> Less dependent on education and language.

Q: A man attributes his illness to black magic, as his family does, but takes his medicines and says they help. His insight is:
- Absent
- *Partly present; describe awareness, attribution and treatment acceptance separately
- Delusional
- Not assessable
> Componential description.

Q: Which is a part of insight in the multidimensional model?
- Orientation
- Digit span
- *Relabelling unusual experiences as part of an illness
- Abstract thinking
> David's model: awareness, relabelling, treatment acceptance.
:::
`;
