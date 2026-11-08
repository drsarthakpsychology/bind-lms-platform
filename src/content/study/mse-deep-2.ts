/* Module · The MSE in depth, Parts III and IV (Advanced and exam zone). Original text written for VIBHA School of Psychology. */
export const part2 = String.raw`
# Part III · Advanced: hard situations and writing it up

## 3.1 When the patient can't or won't talk [core][advanced]
A silent patient still has a full mental state. Your observation becomes the whole examination.

### Mutism and stupor
- **Mutism**: no speech, though the person may be alert. Causes include catatonia, severe depression, conversion (dissociative) disorder, neurological disease (stroke, akinetic mutism), selective mutism in children, and deliberate refusal.
- **Stupor**: mute and largely motionless, with little response to the surroundings, yet often **with eyes open and following you**. Ask: are the eyes open? Do they track? Is there resistance when you lift an arm?
- Catatonic stupor, depressive stupor, dissociative stupor and organic stupor look similar. The **physical examination and investigations** are part of the MSE work here.

:::widget flow
{"title": "A mute, still patient: which kind of stupor?", "layout": "tree", "nodes": [{"id": "r", "label": "Mute and largely motionless", "detail": "Check vital signs, hydration and consciousness first. Then look for the pattern."}, {"id": "c", "parent": "r", "label": "Posturing, waxy flexibility, negativism, echo signs", "detail": "Catatonic stupor. Screen with the Bush-Francis items; consider a lorazepam challenge."}, {"id": "d", "parent": "r", "label": "Profound slowing, sad face, history of low mood, not eating", "detail": "Depressive stupor. Often responds to ECT."}, {"id": "x", "parent": "r", "label": "Resists eye opening, avoids painful stimuli, inconsistent signs", "detail": "Possible dissociative stupor, but only after organic causes are excluded."}, {"id": "o", "parent": "r", "label": "Fever, rigidity, fluctuating consciousness, neurological signs, seizures", "detail": "Organic stupor: encephalitis (including anti-NMDAR), NMS, non-convulsive status, metabolic causes. Medical emergency."}], "caption": "These look alike from the bedside. The physical examination and tests are part of the MSE here."}
:::

### What you can still record
| Domain | What you can observe in a silent patient |
|---|---|
| Appearance and behaviour | Posture, grooming, eye opening and tracking, response to voice and touch, catatonic signs |
| Speech | Mute, whispering, gestures, writing if offered paper |
| Affect | Facial expression, tears, response to family |
| Perception | Hallucinatory behaviour (turning, listening, muttering) |
| Cognition | Level of consciousness, response to commands, following with eyes |
| Insight and judgement | Usually "could not be assessed", with the reason |

:::widget decide
{
  "scene": "Pooja, 19, from Bhopal, has not spoken or eaten for three days. She lies in bed, eyes open, staring. When you lift her arm it stays raised. Her family thinks she is “possessed” and has taken her to two healers.",
  "ask": "What is the most important next step?",
  "choices": [
    { "label": "Record “uncooperative, refuses to talk” and wait for her to engage", "verdict": "harm", "outcome": "She becomes dehydrated and develops a fever; she is moved to intensive care.", "why": "Mutism, staring and posturing suggest catatonia, which can become life-threatening (dehydration, clots, malignant catatonia). Waiting is dangerous." },
    { "label": "Recognise probable catatonia: examine physically, check vital signs and hydration, look for medical causes, and consider a lorazepam challenge under medical supervision", "verdict": "best", "outcome": "After lorazepam she begins to speak within hours; a depressive illness is found and treated.", "why": "Catatonia is treatable and often responds quickly to benzodiazepines; ECT if not. Physical causes must be ruled out." },
    { "label": "Tell the family to continue with the healer", "verdict": "harm", "outcome": "Treatment is delayed further.", "why": "Respect beliefs, but catatonia is a medical emergency." }
  ]
}
:::

:::widget flow
{"title": "The lorazepam challenge, step by step", "layout": "chain", "nodes": [{"id": "a", "label": "Baseline", "detail": "Rate catatonic signs; record vital signs, oxygen and airway."}, {"id": "b", "label": "Give lorazepam", "detail": "A small dose by mouth, vein or muscle, under medical supervision."}, {"id": "c", "label": "Observe", "detail": "Watch for speech, movement and eating over the next hour or so; repeat if needed."}, {"id": "d", "label": "Re-rate", "detail": "Repeat the catatonia rating. A clear fall supports the diagnosis."}, {"id": "e", "label": "Plan", "detail": "Continue regular lorazepam; ECT if there is no response or catatonia is malignant; treat the underlying illness."}], "caption": "The test both supports the diagnosis and starts the treatment. Monitor breathing throughout."}
:::

### The guarded, hostile or aggressive patient
- Keep yourself safe: an open door, a colleague nearby, no objects that could be thrown.
- Lower your voice, sit at an angle, avoid prolonged staring.
- Name the feeling: "You seem very angry about being brought here."
- Do the MSE from observation; postpone sensitive questions.
- Record exact words of threats.

:::widget timeline
{"prompt": "A patient in the ward is getting angry and loud. Order the steps you take.", "events": [{"label": "Notice early signs: raised voice, clenched fists, pacing"}, {"label": "Keep yourself safe: stay near the open door, with a colleague nearby"}, {"label": "Lower your voice, sit or stand at an angle, and name the feeling"}, {"label": "Listen and offer real choices: 'Would you like to talk here or outside?'"}, {"label": "If danger continues, call for help and follow the ward protocol"}, {"label": "Afterwards, record exact words and behaviour, and review with the team"}], "why": "De-escalation starts early and with words. Medicine or restraint is a last resort, used only under the hospital's protocol when talking has failed and someone is in danger."}
:::

### Through an interpreter
- Use a **trained interpreter**, not a family member, when possible: relatives may soften or edit symptoms, especially about abuse, sex or suicide.
- Ask the interpreter to translate **exactly**, including odd words, and to tell you when speech does not make sense in the original language. Thought disorder can vanish in translation.
- Speak to the patient, not the interpreter.

:::widget sort
{
  "prompt": "In an interview through an interpreter, which practices help and which harm?",
  "buckets": ["Helps", "Harms"],
  "items": [
    { "text": "Using the patient's 12-year-old son as interpreter for questions about suicide", "bucket": 1, "why": "Burdens the child and censors the answers." },
    { "text": "Asking the interpreter to tell you if the patient's sentences don't make sense in the original language", "bucket": 0 },
    { "text": "Looking at and speaking to the patient, not the interpreter", "bucket": 0 },
    { "text": "Accepting the interpreter's summary: “She says she is fine”", "bucket": 1 },
    { "text": "Briefing the interpreter beforehand on confidentiality and exact translation", "bucket": 0 }
  ]
}
:::

:::clinician
Catatonia: use the Bush-Francis Catatonia Rating Scale (14-item screen; two or more positive items suggests catatonia). A lorazepam challenge (for example 1 to 2 mg IV or IM, repeated if needed, with monitoring of airway and blood pressure) both supports diagnosis and treats; ECT is highly effective in benzodiazepine-resistant and malignant catatonia. Exclude neuroleptic malignant syndrome (fever, rigidity, autonomic instability, raised CK), non-convulsive status epilepticus (EEG), encephalitis (including anti-NMDAR), and metabolic causes. Malignant catatonia is an emergency. For dissociative stupor, look for resistance to eye opening, avoidance of noxious stimuli and inconsistent signs, but do not conclude 'dissociative' until organic causes are excluded.
:::

:::recall
1. List five domains you can still assess in a mute patient. || Appearance and behaviour (including catatonic signs), speech (mute, gestures), affect, hallucinatory behaviour, level of consciousness and response to commands.
2. Why can catatonia be dangerous? || Dehydration, malnutrition, clots, pressure sores and malignant catatonia.
3. Why avoid using family members as interpreters? || They may edit or soften symptoms and the patient may not disclose sensitive information.
:::

:::mcq
Q: A mute, staring patient keeps her arm raised after you lift it. The first-line treatment to consider after medical causes are reviewed is:
- An antipsychotic injection
- *A benzodiazepine such as lorazepam
- Waiting for her to speak
- Psychotherapy
> Lorazepam often relieves catatonia quickly.
:::

## 3.2 Risk inside the MSE [core][advanced]
Risk is not a separate exam. It runs through every heading. Good notes show **where** the risk evidence came from.

| MSE heading | Risk clues |
|---|---|
| Appearance and behaviour | Fresh injuries, ligature marks, agitation, intoxication, carrying a weapon |
| Speech | Threats, mention of plans, saying goodbye |
| Mood and affect | Hopelessness, sudden calm, intense anger, mixed states |
| Thought content | Suicidal ideation, intent, plan; homicidal ideation; delusions about a specific person; nihilism, guilt |
| Perception | **Command hallucinations** to harm, especially if obeyed before |
| Cognition | Delirium (falls, wandering), impaired capacity |
| Insight and judgement | Refusal of help, reckless behaviour, inability to keep safe |

:::widget layers
{"title": "Risk as a formulation, not a score", "shape": "stack", "layers": [{"label": "The specific plan", "detail": "What, when, where, how prepared, access to means. This is what you act on today."}, {"label": "Dynamic factors", "detail": "Things that change: hopelessness, intoxication, command hallucinations, recent loss, agitation, insomnia."}, {"label": "Static factors", "detail": "Things that do not change: previous attempts, male sex, older age, chronic illness, family history."}, {"label": "Protective factors", "detail": "Reasons for living, children, faith, support, engagement with care, restricted means."}], "caption": "Write all four. Categories such as 'low, medium, high' predict poorly for individuals; the formulation tells the next clinician what to do."}
:::

:::widget flow
{"title": "Command hallucinations: weighing the risk", "layout": "chain", "nodes": [{"id": "a", "label": "What does it say?", "detail": "Exact words. Harm to self, harm to others, or something minor?"}, {"id": "b", "label": "Who is it?", "detail": "A powerful, known or feared voice is harder to resist."}, {"id": "c", "label": "Have you obeyed before?", "detail": "Past compliance is the strongest clue to future compliance."}, {"id": "d", "label": "Can you resist?", "detail": "How do they cope? Are they fighting it, and for how long?"}, {"id": "e", "label": "Do the beliefs fit?", "detail": "Delusions that support the command (for example 'God wants this') raise risk."}, {"id": "f", "label": "Plan and means", "detail": "Then ask as you would about any suicidal or violent plan."}], "caption": "A command voice is a finding to explore, not a risk level in itself."}
:::

:::widget compare
{"title": "The same patient, two MSEs", "a": {"label": "Monday", "points": ["Tearful but engaged", "'I feel low, but my daughter's wedding keeps me going'", "No plan; would tell staff if thoughts grew", "Accepts the treatment plan"], "summary": "Ongoing risk, with clear protective factors and engagement."}, "b": {"label": "Thursday", "points": ["Calm, distant, smiles little", "'It doesn't matter any more; it's all sorted'", "Has been asking how many tablets are in the ward stock", "Refuses the family meeting"], "summary": "A sudden calm, hopelessness, interest in means and withdrawal from help: risk has risen sharply. Act today."}, "caption": "Risk is a state that can change in days. Each MSE is a new snapshot, and the change between snapshots is itself a clue."}
:::

### Asking about suicide clearly
Ask in steps, from general to specific:
1. "Have you felt that life is not worth living?"
2. "Have you had thoughts of ending your life?"
3. "Have you thought about how you might do it?"
4. "Have you made any preparations? Do you have access to the means?"
5. "What has stopped you so far?" (protective factors)

**Asking about suicide does not put the idea in someone's head.** It often brings relief.

:::widget decide
{
  "scene": "Mr Chen, 55, a restaurant owner in Kolkata's Tangra area, came in with insomnia. He mentions business debts. When you ask about suicidal thoughts, he says, “Sometimes I think the family would get the insurance money.” Then he laughs and changes the subject.",
  "ask": "What is the best next step?",
  "choices": [
    { "label": "Accept the laugh as a sign he is joking and move on", "verdict": "harm", "outcome": "You miss a man with a clear rationale for suicide.", "why": "A rationale such as insurance, debts, and an attempt to deflect are warning signs. Laughter can be a defence." },
    { "label": "Come back to it gently and directly: ask about thoughts, plans, means, preparations and what holds him back", "verdict": "best", "outcome": "He admits he has looked up his policy terms and has pesticide at the restaurant. A safety plan, means removal and family involvement follow.", "why": "Stepwise direct questioning, means assessment and a safety plan are the core of suicide risk work." },
    { "label": "Tell him suicide would hurt his family and change the topic", "verdict": "ok", "outcome": "He agrees politely and says nothing more.", "why": "Moralising closes down disclosure. Ask first; reasons for living come from him." }
  ]
}
:::

:::safety Helpline
In India, Tele-MANAS (14416 or 1-800-891-4416) offers free, round-the-clock mental health support. Always pair risk assessment with a plan, not only a number.
:::

:::sounds How risk sounds when it is hidden
- "Bas, ab aur nahi hota." (That's it, I can't do this any more.)
- "Everyone would be better off without me."
- "I've sorted out the papers."
- "I hear him telling me to finish it. I've been fighting him for days."
:::

:::clinician
Document risk as a formulation, not a score: static factors (previous attempts, male sex, older age, chronic illness), dynamic factors (current hopelessness, intoxication, command hallucinations, recent loss), protective factors, and the specific plan. Risk scales and categorical risk prediction (low, medium, high) have poor predictive value for individuals; national self-harm guidance in England advises against using them to decide treatment. Pesticide ingestion remains a major method in rural India; means restriction (safe storage) is evidence-based. Under the MHCA 2017 section 115, a person who attempts suicide is presumed to have severe stress and shall not be tried and punished, and the government has a duty to provide care and rehabilitation.
:::

:::recall
1. Give one risk clue for each of four MSE headings. || Appearance: fresh injuries; mood: hopelessness or sudden calm; thought: plans or intent; perception: command hallucinations (others acceptable).
2. Give the five steps of asking about suicide. || Life not worth living; thoughts of ending life; method; preparations and access; what has stopped them.
3. Does asking about suicide increase risk? || No; it often brings relief and allows help.
:::

:::mcq
Q: Which MSE finding most raises immediate risk to others?
- Circumstantial speech
- *A persecutory delusion about a named neighbour, with a stated plan to "deal with him"
- Restricted affect
- Poor abstract thinking
> Specific target plus plan.
:::

## 3.3 Writing the MSE report [core][advanced]
The MSE you write is often read by someone who will never meet the patient: a night duty doctor, a court, a future therapist. Write so they can see what you saw.

:::widget flow
{"title": "Building one good MSE line", "layout": "chain", "nodes": [{"id": "a", "label": "Describe", "detail": "'Spoke rapidly, hard to interrupt.'"}, {"id": "b", "label": "Quote", "detail": "'I'm going to fix the whole railway system.'"}, {"id": "c", "label": "Name", "detail": "'Pressure of speech, grandiose content.'"}, {"id": "d", "label": "Add the key negative", "detail": "'No suicidal or homicidal ideation on direct questioning.'"}, {"id": "e", "label": "Qualify uncertainty", "detail": "'Possibly responding to unseen stimuli.'"}, {"id": "f", "label": "Say what was not assessed", "detail": "'Cognition not formally tested: too distractible; to repeat.'"}], "caption": "Every line should survive the question 'how do you know?'"}
:::

:::widget layers
{"title": "Who reads your MSE", "shape": "rings", "layers": [{"label": "You, tomorrow", "detail": "You will forget the details by the next shift."}, {"label": "The team", "detail": "The night doctor, the nurse, the therapist who meets the patient next week."}, {"label": "Reviewers", "detail": "Mental Health Review Boards checking admissions and capacity decisions."}, {"label": "Courts and the future", "detail": "A lawyer or a clinician years later, who can only see the patient through your words."}], "caption": "Write for the outermost ring and everyone inside it is served."}
:::

### Seven rules for writing
1. **Use the standard order** of headings, every time.
2. **Describe, quote, then name**: "Spoke rapidly, hard to interrupt ('I'm going to fix the whole railway system, Indian Railways needs me'): pressure of speech, grandiose content."
3. **Quote the patient in their language**, with a translation.
4. **Write negatives that matter**: "No suicidal ideation, plans or intent on direct questioning." "No perceptual abnormalities elicited."
5. **Qualify uncertainty**: "Possibly responding to unseen stimuli" is better than a confident guess.
6. **Avoid labels, slang and judgement**: not "manipulative", "attention-seeking", "difficult".
7. **Say what could not be assessed and why**: "Cognition not formally tested: patient too drowsy."

:::widget sort
{
  "prompt": "Good report line or poor report line?",
  "buckets": ["Good line", "Poor line"],
  "items": [
    { "text": "Mood: “Bahut udaas rehta hoon, kuch accha nahi lagta” (I stay very sad, nothing feels good)", "bucket": 0 },
    { "text": "Patient was manipulative and attention-seeking", "bucket": 1, "why": "Judgemental labels with no observable detail." },
    { "text": "Thought content: no suicidal ideation, plans or intent on direct questioning", "bucket": 0 },
    { "text": "Perception: hallucinations present", "bucket": 1, "why": "Which modality? Content? Second or third person? Commands? Insight?" },
    { "text": "Cognition: not formally tested as patient was drowsy after sedation at 3 pm; to repeat tomorrow", "bucket": 0 },
    { "text": "Normal MSE", "bucket": 1, "why": "Write each heading; a reader cannot tell what was actually examined." },
    { "text": "Affect: anxious, restricted in range, reactive; became tearful when discussing her daughter", "bucket": 0 }
  ]
}
:::

:::widget worked
{
  "title": "Rewrite a weak MSE line, step by step",
  "steps": [
    { "q": "Weak line: “Patient psychotic, hearing voices.” What is missing?", "a": "Description of the voices (number, gender, recognised or not), location, content, person (second or third), commands, whether he acts on them, insight, and observed behaviour." },
    { "q": "What did you actually observe and hear?", "a": "He paused mid-sentence, glanced to his left, muttered. He said: “Do aadmi meri baat karte hain, kehte hain yeh pagal hai” (Two men talk about me, they say he is mad)." },
    { "q": "Now write the perception entry.", "a": "Perception: auditory hallucinations: two male voices, unrecognised, heard through his ears from the left side of the room, talking about him in the third person (“Do aadmi meri baat karte hain, kehte hain yeh pagal hai”). Denies command hallucinations. Observed pausing, glancing left and muttering during the interview. Believes the voices are real people." }
  ],
  "yourTurn": [
    { "q": "Rewrite: “Mood depressed, affect sad. Suicidal.”", "a": "Mood: “I feel heavy all day, like there is a stone on my chest” (subjective); rates 2 out of 10. Affect: sad, restricted in range, minimally reactive; tearful when speaking of her husband; congruent with mood. Thought content: thoughts that life is not worth living, and more recently of taking her mother's tablets; no preparations; says her children keep her going. (Full risk assessment in risk section.)" }
  ]
}
:::

:::clinician
Medico-legal standards: notes should be contemporaneous, dated, timed and signed, with the examiner's name and designation; corrections should be struck through once and initialled, not erased. Under the MHCA 2017, capacity assessments, admission and nominated representative decisions require documentation that will be scrutinised by Mental Health Review Boards. Avoid copy-forward in electronic records. Distinguish in writing between reported history ("Mother reports he has not slept for four nights") and observed findings ("Yawning repeatedly, eyes red"). Where translation is involved, record the language used and whether an interpreter was present.
:::

:::recall
1. List the seven rules for writing an MSE. || Standard order; describe, quote, name; quote in the patient's language; write important negatives; qualify uncertainty; avoid labels; say what could not be assessed and why.
2. Why is "Normal MSE" a poor entry? || The reader cannot tell what was examined; each heading should be recorded.
3. What should a perception entry about voices include? || Number, gender, recognition, location, content, person, commands and whether obeyed, insight, observed behaviour.
:::

:::mcq
Q: Which is the best MSE entry for thought content in a man with no suicidal thoughts?
- Not suicidal
- *No suicidal ideation, plans or intent on direct questioning
- Normal
- Probably fine
> States what was asked and found.
:::

## 3.4 Three full MSE reports, worked [core][advanced]
Read the short vignette, think about each heading, then reveal the model entry.

:::widget worked
{
  "title": "Report 1 · Mr Iqbal, 27, Mumbai: brought by family after many nights without sleep",
  "steps": [
    { "q": "General appearance and behaviour?", "a": "Young man, wearing a bright shiny shirt with three gold chains and sunglasses indoors; well groomed. Restless, got up four times, tried to use the examiner's phone. Over-familiar, called the examiner “boss”; rapport easily established but hard to keep on task." },
    { "q": "Speech?", "a": "Rapid, loud, hard to interrupt, increased in quantity; pressure of speech." },
    { "q": "Mood and affect?", "a": "Mood: “Ekdum mast! Never been better” (Totally great!). Affect: euphoric, labile (irritable when interrupted, then laughing), wide range; congruent with mood." },
    { "q": "Thought?", "a": "Form: flight of ideas, with clang associations (“Mumbai, Mumbai, my bhai, high, fly high”). Content: grandiose delusion that he has been chosen to become Prime Minister and has designed a new airline; no suicidal or homicidal ideation on direct questioning." },
    { "q": "Perception?", "a": "Denies hallucinations; none observed." },
    { "q": "Cognition?", "a": "Alert; oriented to time, place and person; easily distracted (could not complete months backwards because he kept talking about his airline); formal memory testing incomplete due to distractibility." },
    { "q": "Insight and judgement?", "a": "Insight grade 1: “I am not ill, my family is jealous.” Judgement impaired: has spent ₹2 lakh of family savings in four days on a car booking." }
  ],
  "yourTurn": [
    { "q": "Write the one-line summary of this MSE that you would say on a ward round.", "a": "A 27-year-old man with overactivity, pressured speech, euphoric labile affect, flight of ideas and grandiose delusions, no insight and impaired judgement with reckless spending: a picture consistent with a manic episode with psychotic features." }
  ]
}
:::

:::widget worked
{
  "title": "Report 2 · Mrs Thomas, 61, Kottayam: “I have committed a great sin”",
  "steps": [
    { "q": "General appearance and behaviour?", "a": "Older woman, thin, clothes clean but loose; hair uncombed. Sits very still, head bowed, minimal gestures. Long latency before answers. Cooperative but withdrawn; rapport established with difficulty." },
    { "q": "Speech?", "a": "Soft, slow, monotonous, reduced in quantity; long pauses." },
    { "q": "Mood and affect?", "a": "Mood: “My heart is dead. I am finished.” Affect: depressed, flat to restricted, non-reactive, congruent." },
    { "q": "Thought?", "a": "Form: slowed, no formal thought disorder. Content: delusion of guilt (“I committed a great sin by not visiting the church on one Sunday, so God has punished my family”); nihilistic ideas (“My stomach has rotted, food goes nowhere”); passive death wishes, and thoughts of drinking pesticide, with no plan made yet." },
    { "q": "Perception?", "a": "Hears a voice in the second person at night saying “You are a sinner, you deserve to die”, heard through her ears, which she believes is God's voice; mood-congruent." },
    { "q": "Cognition?", "a": "Alert, oriented. Attention slow but intact on months backwards. Recall 1 of 3 at five minutes, with many “I don't know” answers; effort reduced." },
    { "q": "Insight and judgement?", "a": "Insight grade 1 to 2: believes her suffering is deserved punishment, not illness. Judgement impaired: eating very little." }
  ],
  "yourTurn": [
    { "q": "Which findings make this a high-risk presentation, and what should happen urgently?", "a": "Mood-congruent psychotic features, a second-person voice saying she deserves to die, nihilism with poor intake, and suicidal thoughts with a lethal method in a woman over 60. She needs urgent assessment for admission, physical review (hydration, nutrition), close observation and consideration of ECT, which is highly effective in psychotic depression." }
  ]
}
:::

:::widget worked
{
  "title": "Report 3 · Mr Okafor, 74, London: confused after a fall",
  "steps": [
    { "q": "General appearance and behaviour?", "a": "Older man in a hospital gown, bruise on the left forehead. Drowsy at first, then picking at the bedsheets; tried to climb out of bed. Attention drifts mid-conversation." },
    { "q": "Speech?", "a": "Variable: slurred at times, rambling, occasionally incoherent." },
    { "q": "Mood and affect?", "a": "Mood: “I don't know, where's my wife?” Affect: perplexed and fearful, labile." },
    { "q": "Thought?", "a": "Form: disorganised, drifting. Content: fleeting persecutory ideas (“They've locked me in a prison”), not sustained." },
    { "q": "Perception?", "a": "Reports seeing insects on the wall; observed brushing at the sheets." },
    { "q": "Cognition?", "a": "Fluctuating consciousness; disoriented to time and place; could not do months backwards beyond December, November; digit span forward 3. Recall not testable." },
    { "q": "Insight and judgement?", "a": "Could not be meaningfully assessed due to impaired consciousness." }
  ],
  "yourTurn": [
    { "q": "What is the most likely syndrome and the two most urgent steps?", "a": "Delirium (acute, fluctuating consciousness, inattention, visual hallucinations). Urgent steps: identify causes (head injury imaging given the fall and bruise, infection, drugs including alcohol withdrawal, metabolic), and keep him safe with calm, non-drug measures and family presence." }
  ]
}
:::

:::clinician
In examinations, a one-line synthesis after the MSE (the 'MSE summary') earns marks and shows clinical thinking, as long as it remains descriptive or syndromal ("consistent with a manic episode with psychotic features") rather than a premature final diagnosis. For Mrs Thomas, ICD-11 codes a severe depressive episode with psychotic symptoms; mood-congruent delusions of guilt and nihilism with somatic delusions recall Cotard's syndrome in extreme forms. For Mr Okafor, consider subdural haematoma after a fall in an older man, especially if on anticoagulants.
:::

:::recall
1. What features in Report 1 suggest mania? || Overactivity, pressured speech, euphoric labile affect, flight of ideas, grandiose delusions, no insight, reckless spending.
2. Why is Report 2 high-risk? || Psychotic depression with a voice saying she deserves to die, nihilism, poor intake, suicidal thoughts with a lethal method, older age.
3. What does Report 3 most likely show, and what must be excluded? || Delirium; head injury (subdural haematoma), infection, drugs, metabolic causes.
:::

:::mcq
Q: In Report 2, the voice saying "You are a sinner, you deserve to die" is best described as:
- A third-person running commentary
- *A second-person, mood-congruent auditory hallucination
- An illusion
- A pseudo-hallucination with insight
> Addresses her directly and fits her depressive guilt.
:::

:::widget flow
{"title": "From MSE findings to a one-line synthesis", "layout": "chain", "nodes": [{"id": "a", "label": "List the abnormal findings", "detail": "Mr Iqbal: overactivity, pressured speech, elated labile affect, flight of ideas, grandiose delusions, distractibility."}, {"id": "b", "label": "Cluster them", "detail": "Speed and expansion across behaviour, speech, affect and thought."}, {"id": "c", "label": "Name the syndrome", "detail": "'Consistent with a manic episode with psychotic features.' Syndromal, not a final diagnosis."}, {"id": "d", "label": "State risk and capacity", "detail": "Financial risk, no insight, impaired judgement."}, {"id": "e", "label": "Point to the plan", "detail": "Physical checks, drug screen, safety, treatment of mania."}], "caption": "The synthesis earns marks because it shows thinking, as long as it stays descriptive."}
:::

## 3.5 Common errors, and how examiners mark [core][advanced]
| Error | Why it costs marks | Fix |
|---|---|---|
| Writing the history in the MSE | Mixes subjective past with observed present | Keep "reports that last week..." in the history |
| Labels without evidence | Reader cannot check | Describe and quote |
| Skipping cognition | Misses delirium and dementia | Always do at least orientation and attention |
| Missing negatives | Reader cannot tell if you asked | Write important negatives explicitly |
| Mood and affect confused | Basic error examiners look for | Mood: their words. Affect: your observation |
| Overusing "bizarre" | Vague and judgmental | Describe the belief |
| Not grading insight | Insight is always asked | Give grade and components |
| Ignoring culture | Mislabels shared beliefs and behaviours | Ask about shared beliefs and norms |

:::widget curve
{"kind": "forgetting", "title": "Keeping the confusable pairs in memory", "caption": "Circumstantial and tangential, flight of ideas and loosening, true and pseudo-hallucination: these pairs fade fast after one reading. Add spaced reviews and watch the curve flatten. A few short reviews spread over days beat one long session the night before a viva."}
:::

### OSCE and viva tips
- In an OSCE, **say what you are observing** aloud: "I notice you're sitting very still. How have you been feeling?"
- In a viva, present the MSE in the standard order, **briefly**, then give a one-line synthesis.
- Expect the examiner to pick on **one confusable pair** (for example, circumstantiality versus tangentiality) and ask you to justify your term from what the patient said.

:::widget decide
{
  "scene": "In your MPhil viva in Bengaluru, you present: “Thought: loosening of association.” The examiner asks, “Give me an example of what the patient said.” You realise he was actually quite coherent, just slow and detailed.",
  "ask": "What is the best response?",
  "choices": [
    { "label": "Insist on your original term", "verdict": "harm", "outcome": "The examiner presses with more questions and marks you down for rigidity.", "why": "Defending an unsupported term loses more marks than correcting it." },
    { "label": "Give the actual quote, and correct yourself: the goal was reached, so it was circumstantiality rather than loosening", "verdict": "best", "outcome": "The examiner nods: “Good, that's the distinction I wanted.”", "why": "Examiners reward accurate observation and honest correction from evidence." },
    { "label": "Say you don't remember what he said", "verdict": "ok", "outcome": "The examiner moves on, but you lose the chance to show your skill.", "why": "Always have a quote ready for each abnormal finding." }
  ]
}
:::

:::recall
1. Name four common MSE errors. || History in the MSE; labels without evidence; skipping cognition; missing negatives (also mood/affect confusion, overusing 'bizarre', ungraded insight, ignoring culture).
2. What should you have ready for every abnormal finding in a viva? || A verbatim example of what the patient said or did.
:::

:::mcq
Q: Which is a common error that examiners penalise in an MSE?
- Writing the mood in the patient's words
- *Including events from last week in the MSE section
- Grading insight
- Recording important negatives
> The MSE records the present; past events belong to the history.
:::

# Part IV · Exam zone

## 4.1 Viva rapid-fire [core]
:::viva
Mood versus affect? :: Mood is the sustained feeling the patient reports; affect is what you observe, moment to moment.
Circumstantiality versus tangentiality? :: Goal reached versus goal never reached.
Flight of ideas versus loosening? :: Links followable versus not followable.
True hallucination versus pseudo-hallucination? :: Outer space, perceptual quality, believed real versus inner space, often with insight.
Illusion versus hallucination? :: Real stimulus misperceived versus no stimulus.
Obsession versus delusion? :: Recognised as own and resisted versus held with conviction and not resisted.
Name four catatonic signs. :: Mutism, posturing, waxy flexibility, negativism (also stupor, echophenomena, staring).
Core cognitive feature of delirium? :: Inattention, with acute onset and fluctuation.
Four parts of insight? :: Awareness, attribution, treatment acceptance, relabelling.
What is a functional hallucination? :: A hallucination triggered by, and heard alongside, a real stimulus in the same modality.
How do you record a mute patient's MSE? :: From observation: behaviour, catatonic signs, affect, hallucinatory behaviour, consciousness and responses; state what could not be assessed.
What is the first step in asking about suicide? :: "Have you felt that life is not worth living?"
:::

## 4.2 Module test [core]
:::mcq
Q: Which statement about the MSE is correct?
- It records the illness since onset
- *It is a cross-sectional record of the present mental state
- It is the same as the MMSE
- It is done only after the history
> Snapshot of now.

Q: Which is the best appearance entry?
- Unkempt
- Looks depressed
- *Hair uncombed, same stained kurta as yesterday, sandals on the wrong feet
- Poor hygiene, probably schizophrenic
> Detailed and observable.

Q: Which entry best records mood?
- Depressed
- *"Mann bilkul nahi lagta, sab bekaar lagta hai" (Nothing interests me, everything feels useless)
- Affect sad
- Low
> Mood in the patient's words.

Q: A woman reports feeling "very happy" while sobbing. This is:
- Euthymic
- *Affect incongruent with stated mood
- Flat affect
- Reactive affect
> Mismatch between report and observation.

Q: An inner urge to keep moving after an increase in antipsychotic dose is:
- Agitation
- *Akathisia
- Catatonia
- Tardive dyskinesia
> Drug-induced restlessness.

Q: Keeping an imposed awkward posture for a long time is:
- Mannerism
- Stereotypy
- *Catalepsy (waxy flexibility)
- Echopraxia
> A catatonic sign.

Q: A long, detailed reply that eventually answers the question is:
- *Circumstantial
- Tangential
- Loosening
- Flight of ideas
> Goal reached.

Q: "I like tea, tea for two, two of you, you are blue, blue sky, I can fly!" with cheerful, rapid speech suggests:
- Loosening
- *Flight of ideas with clang associations
- Thought block
- Perseveration
> Followable sound links in mania.

Q: Speech whose ideas have no understandable connection is:
- Circumstantiality
- *Loosening of association (derailment)
- Pressure of speech
- Poverty of speech
> Links cannot be followed.

Q: A man fears he left the gas on, knows it is unlikely, and checks ten times. This is:
- A delusion
- *An obsession with a compulsion
- An overvalued idea
- A hallucination
> Ego-dystonic, resisted, neutralised.

Q: A postpartum mother horrified by intrusive images of harming her baby, who avoids being alone with the baby, most likely has:
- Intent to harm
- *Obsessional thoughts
- Postpartum psychosis
- Delusion of infidelity
> Typical postpartum OCD.

Q: "My nose ruins my life; maybe I exaggerate, but I can't stop thinking about it" is best called:
- Delusion
- *Overvalued idea
- Obsession
- Hallucination
> Strongly held, feeling-charged, partly open to reason.

Q: A person sees a rope in dim light and mistakes it for a snake. This is:
- Hallucination
- *Illusion
- Delusional perception
- Pseudo-hallucination
> Real stimulus misperceived.

Q: Hearing one's name called while falling asleep is:
- A sign of psychosis
- *A hypnagogic experience, often normal
- A functional hallucination
- A command hallucination
> Common and usually normal.

Q: Olfactory hallucinations should prompt a search for:
- Personality disorder
- *Temporal lobe pathology such as seizures
- Mania
- OCD
> Smell and taste hallucinations suggest temporal lobe causes.

Q: Which is the core bedside sign of delirium?
- Poor remote memory
- *Inattention with fluctuation
- Word-finding difficulty
- Low mood
> Attention is the key.

Q: Which attention test is fairest for someone with little schooling?
- Serial sevens
- *Days of the week backwards in their own language
- Spelling WORLD backwards in English
- Interpreting English proverbs
> Less education-dependent.

Q: A patient believes her illness is caused by the evil eye, as her family does, and takes her medicine regularly. Insight should be recorded as:
- Absent
- *Partial, with components described: aware of illness, cultural attribution, accepts treatment
- Delusional
- Grade 6
> Componential.

Q: A silent, staring patient who resists when you try to move her arm, and does not eat, should first be assessed for:
- Malingering
- *Catatonia, with a physical examination and medical work-up
- Personality disorder
- Normal shyness
> Negativism and mutism suggest catatonia.

Q: Which interpreter practice is best?
- Using a child from the family
- Accepting a summary
- *Briefing a trained interpreter to translate exactly and flag speech that doesn't make sense
- Speaking only to the interpreter
> Exact translation preserves the MSE.

Q: Which MSE finding most raises suicide risk?
- Circumstantial speech
- *A second-person voice telling the patient to die, which he has obeyed before
- Restricted affect alone
- Poor abstract thinking
> Command hallucinations previously acted on.

Q: Which is the best written entry about suicide when none is present?
- Not suicidal
- *No suicidal ideation, plans or intent on direct questioning
- Fine
- Normal
> States what was asked.

Q: "Patient was manipulative" is a poor MSE line because it:
- Is too long
- *Is a judgemental label without observable description
- Uses the patient's words
- Records a negative
> Describe behaviour instead.

Q: In a viva, an examiner asks for evidence of a thought disorder you described. The best response is:
- Insist on the label
- *Give the patient's exact words, and correct the label if they don't support it
- Change the subject
- Say it was obvious
> Evidence-based, honest correction.
:::
`;
