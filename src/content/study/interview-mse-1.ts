/* Module 1 · Parts 0 and I: Starting level, then the psychiatric interview. Original text written for VIBHA School of Psychology. */
export const part1 = String.raw`
# Part 0 · Starting: the interview and the MSE in plain words

## 0.1 What a psychiatric interview is [core][starting]
When you see a doctor for a fever, they ask a few questions, examine you, and often order a blood test. The test usually settles the question. In mental health there is rarely a test like that. There is no blood test for depression and no scan that shows a delusion. So the main tool is a **conversation**.

That conversation is called the **psychiatric interview**. It is not a chat. It is a conversation with a purpose, done in a set way, by someone trained to listen and to notice.

### Two jobs at once
Every interview does two jobs at the same time:
- **Finding out.** What is wrong, since when, how bad, what caused it, what keeps it going, and whether anyone is in danger.
- **Building trust.** The person has to feel safe enough to tell you the truth. Shame, fear and stigma stop people talking. If they do not trust you, the facts you collect will be wrong.

You cannot drop either job. A warm talk that collects nothing does not help the person. A cold checklist that collects facts but scares the person away does not help either.

:::analogy A guide and a map-maker
Picture a guide walking with a traveller through rough country. The guide keeps the traveller safe and willing to keep walking (trust). At the same time the guide is drawing a map of the land (finding out). Stop drawing and you get lost. Stop caring for the traveller and they turn back.
:::

### How it differs from talking to a friend
| A chat with a friend | A clinical interview |
|---|---|
| You share your own stories too | The focus stays on the person; you share little about yourself |
| You give advice quickly | You listen fully first; advice, if any, comes later |
| Nothing is written down | Notes are made, in a set order, in the person's own words |
| Anything goes | There is a plan: what to ask, in what order, and what must never be skipped |
| Privacy is loose | Privacy is protected, with clear limits that are explained at the start |

### Who does it in India
Psychiatrists (doctors with specialist training), clinical psychologists (registered with the Rehabilitation Council of India), psychiatric social workers and psychiatric nurses all interview patients, each with a slightly different focus. As a student you will first watch, then interview under supervision. You will not diagnose or treat on your own.

:::widget sort
{"prompt": "Friendly chat or clinical interview? Place each card.", "buckets": ["Friendly chat", "Clinical interview"], "items": [{"text": "\"Same thing happened to me last year, let me tell you\"", "bucket": 0, "why": "Sharing your own story moves the focus away from the person."}, {"text": "Writing down exactly what the person said, in quotation marks", "bucket": 1, "why": "Their own words are the most accurate record."}, {"text": "\"Just stop thinking about it, you'll be fine\"", "bucket": 0, "why": "Quick advice before understanding shuts people down."}, {"text": "Explaining at the start who will see what they say", "bucket": 1, "why": "Privacy and its limits are made clear before personal questions."}, {"text": "Asking about thoughts of ending life, even if the person did not mention it", "bucket": 1, "why": "A clinical interview never skips safety."}, {"text": "Changing topic to cricket because the talk got heavy", "bucket": 0}]}
:::

:::widget decide
{"scene": "On your first day in the outpatient department, a 40-year-old man looks at your student badge and says, 'I don't want to talk to a student. I want the real doctor.'", "ask": "What do you do?", "choices": [{"label": "Insist politely: 'I need to take your history first, it's the rule.'", "verdict": "harm", "outcome": "He answers in single words and leaves out the part about drinking. The doctor later has to start again.", "why": "Pushing past his refusal costs trust and gives poor information. Consent matters even for a history."}, {"label": "Say: 'That's completely fine. I'm a student working with Dr Mehta. Would you mind if I sit in while you talk to her?'", "verdict": "best", "outcome": "He agrees. You watch a skilled interview, and at the end he lets you check his blood pressure.", "why": "You respected his choice, explained your role honestly and still found a way to learn."}, {"label": "Pretend you are a doctor so he will talk", "verdict": "harm", "outcome": "He finds out from the nurse and complains. He refuses to come back.", "why": "Lying about your role breaks trust and is unethical. Always say who you are."}]}
:::

:::safety Scope
This module teaches what a clinician asks, observes and records. It is educational. It does not train you to assess or treat a real person without qualification and supervision.
:::

:::recall
1. Why is the interview the main tool in mental health? || There is usually no blood test or scan that makes the diagnosis, so careful conversation and observation do the job.
2. What are the two jobs of every interview? || Finding out (the facts needed to understand and help) and building trust (so the person can tell the truth).
3. Give three ways a clinical interview differs from a chat with a friend. || Focus stays on the person; listening comes before advice; notes are kept in a set order; privacy and its limits are explained; safety is never skipped.
:::

:::mcq
Q: A trainee spends 45 friendly minutes with a patient but cannot say how long the problem has lasted or whether the patient feels unsafe. What went wrong?
- Nothing; rapport is all that matters at first
- *The interview built trust but forgot its other job, finding out
- The trainee should have used a questionnaire instead
- The patient was hiding things
> An interview must both build trust and collect the facts needed to help. Losing either one fails the patient.
:::

## 0.2 Start here: your first interview, on one page [core][starting]
If you have a patient tomorrow and have not read anything else yet, read this page. Everything below is expanded later in the module; this is the order you will actually follow in the room.

### Before you sit down
- **Room**: private, quiet, two chairs of equal height at an angle, 4 to 6 feet apart, nothing between you, the door reachable for both of you.
- **Safety**: know who is nearby, keep sharp or heavy objects out of reach, leave the door unlocked. If the patient is agitated, interview with a colleague.
- **Read first**: the referral note and any old records, so you do not make the patient repeat what is already known.
- **Time**: decide how long you have and say it.

### The opening
:::word Words you can use
“Hello, I am ___, a trainee psychologist working with Dr ___. I would like to understand what has been troubling you, so we can work out how to help. It will take about 45 minutes. What you tell me stays within the treating team, except if someone's safety is at risk. Is that all right? You can stop me at any point.”
:::
Then one open question, and **silence**: “What brings you here today?” Let them talk without interrupting. Write the answer in their own words: that is the chief complaint.

:::widget guess
{"prompt": "In studies of real clinic visits, how many seconds does a doctor usually let a patient talk before cutting in?", "min": 0, "max": 120, "step": 1, "unit": "seconds", "answer": [11, 23], "reveal": "Only about 11 to 23 seconds in several studies. Yet when patients were left alone, most finished their opening story within about two minutes. The fear that a patient will talk forever is mostly wrong. The richest information is in that first uninterrupted stretch.", "clinician": "Classic primary-care recordings found interruption after about 18 seconds (1984) and 23 seconds (1999); a 2018 study found a median of 11 seconds. In a Swiss clinic study, patients left uninterrupted spoke for a mean of about 92 seconds, and nearly 8 in 10 finished within 2 minutes."}
:::

### The order of the history
| Step | What you ask about | One line to start it |
|---|---|---|
| 1 | Identification and informants | “Who has come with you today, and how long have they known you?” |
| 2 | Chief complaints, with duration | “What is troubling you most?” |
| 3 | Present illness: onset, course, triggers, sleep, appetite, functioning | “Take me back to when you were last completely well.” |
| 4 | **Risk**: self-harm, suicide, harm to others | “Sometimes when people feel this low they think life is not worth living. Has that happened to you?” |
| 5 | Past psychiatric and medical history | “Has anything like this happened before?” |
| 6 | Treatment so far, with doses and adherence | “What has been tried, and did you take it as advised?” |
| 7 | Family history | “Has anyone in the family had similar problems, or any mental illness?” |
| 8 | Personal history: birth to now, education, work, marriage | “Tell me a bit about growing up.” |
| 9 | Substances | “How much do you drink or smoke, and anything else?” |
| 10 | Premorbid personality | “Before all this began, what kind of person were you?” |

:::trap The one step you must never skip
Ask about suicide directly, in every interview. Asking does not put the idea in someone's head; not asking can miss the most important fact of the day.
:::

:::widget timeline
{"prompt": "Put the main steps of the history in the order used here.", "events": [{"label": "Identification and informants"}, {"label": "Chief complaints, with duration"}, {"label": "Present illness"}, {"label": "Risk: self-harm, suicide, harm to others"}, {"label": "Past psychiatric and medical history"}, {"label": "Family history"}, {"label": "Personal history"}, {"label": "Premorbid personality"}], "why": "The story starts with who is telling it and why they came, then follows the present illness, checks risk early, and widens out to the past, the family and the person's life. Different schools vary the order a little; what matters is that nothing is missed and risk is never skipped."}
:::

### Moving between topics
Signal every change so it never feels like an interrogation: “Thank you, that helps. Now I would like to ask about your family.” If they drift, steer kindly: “That is important, and we will come back to it. First, tell me more about the sleep.”

### The MSE runs the whole time
You are examining the mind from the first second, not only at the end. Keep this checklist on your pad and tick as you go:
1. **Appearance and behaviour**: grooming, eye contact, rapport, movements.
2. **Speech**: rate, volume, tone, amount, flow.
3. **Mood and affect**: their words for their mood; what you see on their face.
4. **Thought**: stream, form, content (delusions, obsessions, suicidal ideas), possession.
5. **Perception**: voices, visions, illusions; ask directly.
6. **Cognition**: consciousness, orientation, attention, memory, abstraction (test formally at the end).
7. **Insight**: do they think they are ill, and that treatment could help?
8. **Judgement**: personal, social and test judgement.

### Closing
:::word Words you can use
“Is there anything important I have not asked you? … Thank you for telling me all of this. Here is what happens next: …”
:::
Summarise what you heard in two or three sentences, check you got it right, and say clearly what happens next.

### Straight after
Write it up the same day, in the standard order, using the patient's own words in quotation marks for complaints, delusions and hallucinations. Finish with a one-line summary: age, sex, main problem, duration, key MSE finding, risk.

:::widget decide
{"scene": "Twenty minutes in, Lakshmi, 30, a schoolteacher from Madurai, says quietly, 'Sometimes I wish I would not wake up.' You were about to ask about her family.", "ask": "What do you do next?", "choices": [{"label": "Note it and come back to it at the end if there is time", "verdict": "harm", "outcome": "The interview runs over and the topic is never reopened. Nobody learns that she has been saving her mother's sleeping tablets.", "why": "A death wish must be explored when it appears. 'Later' often means never."}, {"label": "Reassure her: 'Everyone feels like that sometimes, don't worry.'", "verdict": "harm", "outcome": "She nods and changes the subject. She feels her worst thought was brushed aside.", "why": "Early reassurance closes the door on the most important disclosure of the day."}, {"label": "Stay with it: 'Thank you for telling me. Can you tell me more about those thoughts? Have you thought about ending your life?'", "verdict": "best", "outcome": "She tells you about the saved tablets. Your supervisor joins, and a safety plan is made with her and her husband the same day.", "why": "Asking calmly and directly is safe, shows you can hear it, and finds out how urgent things are."}]}
:::

:::recall
1. Give the distance and arrangement of chairs. || 4 to 6 feet, equal height, at an angle, nothing between you, door reachable.
2. What four things go in the opening statement? || Who you are, why you are meeting, how long it will take, and the limits of confidentiality, then ask permission.
3. Name the history steps in order. || Identification and informants, chief complaints, present illness, risk, past history, treatment, family, personal, substances, premorbid personality.
4. When does the MSE happen? || Throughout the interview; formal cognitive tests come at the end.
5. What must never be skipped? || A direct question about suicide and self-harm.
:::

:::mcq
Q: A first-year trainee asks a quiet, tearful 30-year-old woman a long list of yes/no questions in a row and learns very little. What would most likely have helped?
- Asking the closed questions faster to save time
- *Opening with one open question and then staying silent while she talks
- Starting with the cognitive tests to build confidence
- Asking the informant to answer instead of the patient
> An open question followed by silence lets the patient tell the story in her own words; closed questions come later to fill gaps.
:::

## 0.3 The MSE: a check-up of the mind, in plain words [core][starting]
A doctor examining your body checks your pulse, listens to your chest and looks at your throat. They are not asking about last month. They are checking how your body is **right now**.

The **mental status examination (MSE)** does the same for the mind. It is a careful description of how the person's mind is working **at this moment, in this room**. It sits alongside the history, which is the story of what happened over time.

:::analogy A photograph and a film
The history is a film: it shows the story from the start of the problem until today. The MSE is a photograph taken today. You need both. A film without today's photograph misses how the person is now. A photograph without the film cannot tell you what has changed.
:::

### What you watch and what you ask
Most of the MSE is **watching and listening**, not asking. While the person tells their story, you are already noticing how they look, how they talk and how they feel. A few direct questions fill the gaps at the end.

### The eight areas, in everyday words
| Area | The everyday question behind it | Something you might notice |
|---|---|---|
| 1. Appearance and behaviour | How do they look and act? | Unwashed clothes; restless; avoids eye contact |
| 2. Speech | How do they talk? | Very fast and loud; or slow, quiet, long pauses |
| 3. Mood and affect | How do they feel, and how does it show? | Says “I'm fine” while tears roll down |
| 4. Thought | How do ideas link, and what are they about? | Jumps between topics; sure that neighbours are poisoning them |
| 5. Perception | Do they see or hear things others don't? | Hears voices when nobody is there |
| 6. Cognition | Are they alert, oriented, able to focus and remember? | Does not know the day or where they are |
| 7. Insight | Do they think they are unwell? | “Nothing is wrong with me, they brought me by force” |
| 8. Judgement | Can they make sensible decisions? | Gave away savings to strangers |

:::example Two people, two snapshots
**Imran**, 26, a delivery rider in Hyderabad, sits slumped, answers after long pauses in a soft voice, and says, “Andar se bilkul khaali lagta hai.” (I feel totally empty inside.) His face hardly changes. That snapshot points towards low mood.

**Claire**, 34, a tourist in Goa brought by friends, cannot sit still, talks over everyone, laughs loudly and says she has “a plan to save the whole world by Friday”. That snapshot points towards very high mood.

Neither snapshot is a diagnosis by itself. Each is a careful record of **what was seen and heard today**.
:::

:::widget sort
{"prompt": "History (the story over time) or MSE (what you see and hear today)? Place each card.", "buckets": ["History", "MSE"], "items": [{"text": "He stopped going to work two months ago", "bucket": 0, "why": "Something that happened in the past, as reported."}, {"text": "He avoids eye contact and speaks very softly", "bucket": 1, "why": "You observed it in the room."}, {"text": "His mother says he talks to himself at night", "bucket": 0, "why": "Reported by someone else about another time: history."}, {"text": "He turned towards an empty corner as if listening, twice", "bucket": 1, "why": "Seen in the interview. That is MSE."}, {"text": "He says today, 'I feel completely empty'", "bucket": 1, "why": "His mood right now, in his own words."}, {"text": "He had a similar low spell after his father died", "bucket": 0}, {"text": "He could not say what day it is", "bucket": 1}]}
:::

:::trap MSE is not MMSE
The MMSE (Mini-Mental State Examination) is a short memory and thinking test that can be used inside one part of the MSE (cognition). The MSE is the whole examination. Mixing them up is the most common error in this topic.
:::

:::widget timeline
{"prompt": "Order the eight areas of the MSE, from what you see first to what you judge last.", "events": [{"label": "Appearance and behaviour"}, {"label": "Speech"}, {"label": "Mood and affect"}, {"label": "Thought"}, {"label": "Perception"}, {"label": "Cognition"}, {"label": "Insight"}, {"label": "Judgement"}], "why": "The MSE moves from the outside in: what you can see and hear, then what the person feels and thinks, then how well their mind is working, and finally how they understand their illness and make decisions."}
:::

:::recall
1. What does the MSE describe? || How the person's mind is working right now, in the interview.
2. How is the MSE different from the history? || The history is the story over time (often reported); the MSE is today's snapshot (observed and elicited).
3. Name the eight areas of the MSE in order. || Appearance and behaviour, speech, mood and affect, thought, perception, cognition, insight, judgement.
4. Is most of the MSE done by asking questions? || No. Most of it is observation during the interview; direct questions fill the gaps.
:::

:::mcq
Q: A woman told you she was very anxious last month. Today she is calm and smiling. What goes in today's MSE?
- That she was anxious last month
- *That she appears calm and smiling today, with her own words for how she feels now
- A diagnosis of anxiety disorder
- Nothing, because she has recovered
> The MSE records the present. Last month's anxiety belongs in the history.
:::

## 0.4 Helping someone talk [core][starting]
People rarely tell their most painful facts in the first five minutes. They test you first. Do you rush? Do you judge? Do you look shocked? What you do with small disclosures decides whether the big ones follow.

### Open and closed questions
- An **open question** invites a story: “Tell me about your sleep.” “What has this been like for you?”
- A **closed question** gets a short fact: “Do you wake up early?” “Is it every day?”

Both are useful. Start each topic open, then close down to the details. Closed questions **too early** produce a list of yes and no, and the person's real story never comes out.

### Five small skills that do most of the work
1. **Silence.** Wait a few seconds after an answer. People often add the important part after a pause.
2. **Encouraging sounds.** A nod, “Hmm”, “Go on”. They keep the story going without steering it.
3. **Reflecting the feeling.** “It sounds like you have been very alone with this.” This shows you heard the emotion, not just the facts.
4. **Checking the meaning.** “When you say ‘tension’, do you mean worry in your mind, or something in your body?”
5. **Summarising.** “Let me check I have this right…” It shows you listened and lets them correct you.

:::widget compare
{"title": "Closed and open questions", "a": {"label": "Closed questions", "points": ["'Do you sleep well?'", "'Is your mood low?'", "Get a yes or no", "Useful to check a fact or rate a symptom", "Too many too early, and the patient stops telling the story"], "summary": "Closed: quick and precise, but they narrow the answer to what you thought to ask."}, "b": {"label": "Open questions", "points": ["'Tell me about your sleep.'", "'How have you been feeling in yourself?'", "Invite the person's own words", "Bring out things you did not know to ask", "Best at the start of each new topic"], "summary": "Open: slower, but they let the patient lead you to what matters."}, "caption": "A good interview is a funnel: open first, then narrowing, then closed questions to pin down details."}
:::

### Words people use for distress
In Indian clinics many people describe distress in everyday words or through the body. These need a gentle follow-up, not a quick label.
:::sounds How it is often said
- “Bas tension rehti hai.” (There is just tension.) Ask what tension feels like and when it comes.
- “Ghabrahat hoti hai, dil baith jaata hai.” (I feel panicky, my heart sinks.) This may be anxiety or panic.
- “Kamzori lagti hai.” (I feel weak.) Weak in the body, or no energy and no interest?
- “Mann nahi lagta.” (My heart is not in anything.) Often a loss of interest or pleasure.
- “I just feel stressed all the time.” Stressed about what, and what happens in the body?
:::

:::widget decide
{"scene": "Farhan, 19, a first-year engineering student from Bhopal, says, 'Everyone thinks I'm lazy. Maybe I am.' Then he goes quiet and looks at the floor.", "ask": "What is your best next response?", "choices": [{"label": "'You're not lazy, don't say that!'", "verdict": "ok", "outcome": "He smiles politely and says, 'Okay.' The conversation stays on the surface.", "why": "Kind, but it argues with his feeling instead of exploring it. He learns that this topic makes you uncomfortable."}, {"label": "Wait a few seconds, then: 'It sounds like that word has been hurting. What makes people think that?'", "verdict": "best", "outcome": "He tells you he has not been able to get out of bed for weeks and has stopped attending classes. The real problem comes into view.", "why": "Silence plus reflecting the feeling opened the door to what lies under 'lazy'."}, {"label": "'Okay. Next question: how many hours do you study a day?'", "verdict": "harm", "outcome": "He answers 'two' and says nothing else for the rest of the session.", "why": "Moving straight on tells him his pain is not worth your time."}]}
:::

:::widget sort
{"prompt": "Helpful or unhelpful? Place each reply.", "buckets": ["Helps them talk", "Shuts them down"], "items": [{"text": "\"Tell me more about that.\"", "bucket": 0}, {"text": "\"You're feeling sad, aren't you?\"", "bucket": 1, "why": "A leading question puts your word in their mouth."}, {"text": "\"How are your sleep, food and mood?\"", "bucket": 1, "why": "Three questions in one. You won't know which they answered."}, {"text": "A pause, then a nod", "bucket": 0}, {"text": "\"Don't worry, everything will be fine.\"", "bucket": 1, "why": "Reassurance before you understand closes the topic."}, {"text": "\"When you say 'gas', what do you feel?\"", "bucket": 0, "why": "Checking the meaning of everyday words avoids mistakes."}, {"text": "\"Let me check I've understood the last few months...\"", "bucket": 0}]}
:::

:::recall
1. What is the difference between an open and a closed question? || Open invites a story; closed gets a short fact. Open first, then close down.
2. Name the five small listening skills. || Silence, encouraging sounds, reflecting the feeling, checking the meaning, summarising.
3. Why ask what a person means by "tension" or "kamzori"? || Everyday words can mean many different things: worry, body symptoms, low energy or loss of interest.
:::

:::mcq
Q: Which question is most likely to give you an honest, detailed answer about mood?
- "You're depressed, right?"
- "Are you feeling sad or anxious or angry?"
- *"How have you been feeling in yourself lately?"
- "Is your mood bad?"
> Open, neutral questions invite the person's own words. Leading and compound questions distort answers.
:::

## 0.5 Different, distressed or ill? [core][starting]
Not everything unusual is an illness. One of the most important skills in this field is knowing when an experience is **within the normal range** for that person and their community.

### Normal experiences that can look like symptoms
- **Falling asleep or waking up.** Hearing your name called, or seeing a shape, just as you drift off or wake. This is common and harmless.
- **Grief.** Many bereaved people briefly hear or sense the person who died. A widow may feel her husband sitting in his chair. On its own this is part of grief.
- **Faith and culture.** Beliefs in nazar (the evil eye), spirits, karma or prayer being answered are shared by millions. A belief shared by the person's community is not a delusion.
- **Strong emotion.** Under great fear or exhaustion, people may briefly mishear or misread things around them.

:::widget guess
{"prompt": "In a World Health Organization survey across 18 countries, out of every 100 adults, how many said they had ever had a psychotic-type experience, such as hearing a voice others could not hear?", "min": 0, "max": 40, "unit": "in 100", "answer": [5, 7], "reveal": "About 6 in 100. Most of these people never develop a psychotic illness. Usually the experience was brief and happened only once or a few times. So hearing a voice once does not, by itself, mean someone is ill.", "clinician": "World Mental Health Surveys (about 31,000 respondents, 18 countries) found a lifetime prevalence of psychotic experiences of about 5.8%, mostly hallucinatory, and typically rare and transient."}
:::

### Four questions that help
Textbooks of abnormal psychology often use four checks. None is enough alone.
| Question | What it asks |
|---|---|
| Is it unusual for this person's own community? | Judge against their culture, faith, education and age, not yours |
| Is it causing real distress? | Is the person suffering because of it? |
| Is it getting in the way of life? | Work, study, self-care, relationships |
| Is anyone in danger? | Risk to the person or to others |

:::example Same words, different meaning
**Gurpreet**, 52, from Ludhiana, says, “My late mother visits me in dreams and blesses me.” She sleeps well, works, and finds it comforting. Her community shares the belief. This is not an illness.

**Tom**, 22, a student in Leeds, says the television newsreader has been sending him secret messages about a plot to kill him. He has stopped eating home food in case it is poisoned and has not left his room for weeks. Nobody in his community shares this belief. This needs urgent assessment.
:::

:::widget sort
{"prompt": "Likely within normal experience, or needs a closer look? Place each card.", "buckets": ["Within normal experience", "Needs a closer look"], "items": [{"text": "Hears her name called once while falling asleep", "bucket": 0, "why": "Common as sleep begins or ends."}, {"text": "Feels her late husband's presence in his chair, two months after his death", "bucket": 0, "why": "A common part of grief, on its own."}, {"text": "Believes, like his whole village, that a dargah visit can bring blessings", "bucket": 0, "why": "A shared belief in his community."}, {"text": "Is sure his thoughts are being broadcast to strangers on the bus", "bucket": 1, "why": "Unshared, odd and distressing. This needs assessment."}, {"text": "Hears two voices discussing him all day, and has stopped going out", "bucket": 1, "why": "Persistent, distressing and disabling."}, {"text": "Gets a sinking feeling and racing heart before a viva", "bucket": 0, "why": "Normal anxiety before an exam."}, {"text": "Has washed her hands until they bleed because she cannot stop", "bucket": 1}]}
:::

:::trap Do not judge a belief by your own background
The textbook definition of a delusion includes the words “not in keeping with the patient's socio-cultural and educational background”. The reference group is the person's community, not the clinician's. A clinician from a city may wrongly call a village belief a delusion; a clinician from abroad may do the same with a common Indian belief.
:::

:::recall
1. Give two normal experiences that can look like hallucinations. || Hearing or seeing things while falling asleep or waking; sensing a dead loved one during grief.
2. What makes a belief a possible delusion rather than a cultural belief? || It is not shared by the person's own community, is held with total certainty against clear evidence, and often causes distress or trouble.
3. Name the four checks for "is this abnormal?" || Unusual for their community; distress; interference with life; danger.
:::

:::mcq
Q: A college student says she once heard her name called as she was falling asleep. She is otherwise well. The best view is:
- She has a psychotic illness
- She needs medicine
- *This is a common experience at the edge of sleep and, on its own, is not a sign of illness
- She is making it up
> Experiences at the edge of sleep are common in healthy people.
:::

## 0.6 Level check · Starting [starting]
Twelve or more right out of fifteen (80%) opens the Beginner level. If you already know this, take it now to skip ahead.

:::mcq
Q: Why is the interview the main tool for assessing mental health?
- Because blood tests are too expensive
- *Because there is usually no test or scan that makes the diagnosis
- Because patients prefer talking
- Because it is quicker than a physical examination
> Diagnosis rests mainly on careful conversation and observation.

Q: The two jobs of every interview are:
- Diagnosing and prescribing
- *Finding out what is wrong and building trust
- Testing memory and intelligence
- Filling a form and closing the case
> Neither job can be dropped.

Q: Which is something you should do in a clinical interview but not usually in a chat with a friend?
- Tell your own similar story
- Give quick advice
- *Explain privacy and its limits at the start
- Change the subject when it gets heavy
> Privacy, notes in the person's words and a plan are part of a clinical interview.

Q: The best way to open an interview after introducing yourself is:
- A list of yes/no questions
- *One open question, then silence while the person talks
- The memory tests
- Asking the relative to explain the problem
> Open first, then let the person speak.

Q: A patient hints that life feels pointless. You should:
- Move on and return later
- Reassure them it will pass
- *Ask calmly and directly about thoughts of ending life
- Avoid the topic so you don't plant the idea
> Asking directly is safe and necessary.

Q: The MSE describes:
- The person's whole life story
- *How the person's mind is working right now, in the interview
- Only memory
- The family's view of the patient
> It is the snapshot of now.

Q: Which belongs in the history rather than the MSE?
- Avoids eye contact today
- Speaks very fast in the room
- *Stopped going to work three months ago
- Cannot say what day it is
> Past events, as reported, are history.

Q: MSE and MMSE are:
- Two names for the same thing
- *Different: the MSE is the whole examination; the MMSE is a short thinking test used within it
- Both blood tests
- Both used only in children
> A classic mix-up.

Q: Which is an open question?
- "Do you sleep well?"
- "Is it every day?"
- *"Tell me about your sleep."
- "Did you sleep at 10 or 11?"
> Open questions invite a story.

Q: "How are your sleep, appetite and mood?" is a poor question because:
- It is too short
- *It asks three things at once, so you cannot tell which was answered
- It is too open
- It is rude
> One idea per question.

Q: A patient says "bas tension rehti hai". The best next step is:
- Write "anxiety disorder"
- *Ask what tension feels like for them and when it comes
- Ignore it as a figure of speech
- Prescribe rest
> Everyday idioms need gentle clarification.

Q: Reflecting a feeling means:
- Repeating the patient's words back exactly
- *Naming the emotion you heard, such as "It sounds like you've been very alone"
- Telling them how you would feel
- Writing it down
> It shows you heard the emotion.

Q: A widow sometimes senses her late husband in his chair, two months after his death. She is otherwise coping. This is best seen as:
- A psychotic illness
- *A common grief experience
- A personality disorder
- Something to report to the police
> Sensing the dead is common in grief and not, on its own, an illness.

Q: Whose background do you use to judge whether a belief is unusual?
- The clinician's
- The textbook author's
- *The person's own community, culture and education
- The majority religion of the country
> The reference group is the patient's community.

Q: A trainee does not want to say they are a student, in case the patient refuses. The right approach is:
- Say "doctor" to gain trust
- *Always say honestly who you are and whom you work with
- Avoid introducing yourself
- Ask the nurse to introduce you as a doctor
> Honesty about your role is a basic ethical rule.
:::

# Part I · The psychiatric interview

## 1.1 Why the interview is the examination [core][beginner]
In most of medicine, the history points you towards a diagnosis and an investigation confirms it. In psychiatry there is usually no scan and no blood test that does that job. The interview has to do all of it, and something else at the same time.

:::define The dual task
A psychiatric interview must simultaneously (i) gather the information needed for a criteria-based diagnosis, formulation and treatment plan, and (ii) build the patient-clinician relationship on which all treatment will depend. Neither task can be sacrificed for the other.
:::

The interview is not merely an evaluation that precedes treatment. **The interview itself is often an essential part of treatment.** From the first moments it shapes the relationship, which can have a profound influence on outcome. A skilful interview gives better information, a more accurate diagnosis, better rapport and better adherence to the management plan.

### How a psychiatric interview differs from a medical interview
This table is the single most commonly asked short note in this topic. Learn all seven points.

| # | Difference | Why it matters in practice |
|---|---|---|
| 1 | Disturbances in thinking, behaviour and emotion can interfere with communication | The patient may be thought-disordered, mute, elated or terrified. You may get the history in fragments across several sittings |
| 2 | Collateral information from significant others is often essential | A patient with mania or psychosis may be the least reliable narrator of their own illness. The family may be the only source of a timeline |
| 3 | Detailed personal history and premorbid personality must be obtained | You cannot judge how far someone has changed without knowing who they were before |
| 4 | More astute observation of behaviour is required | How the patient speaks is a sign, not merely a manner. Observation is data collection |
| 5 | Difficulty establishing rapport is more common | Suspiciousness, hostility, apathy, shame and stigma all obstruct the alliance |
| 6 | Patients may lack insight and have poor judgement | “I have no problem, they brought me here” is itself a finding, not a failed interview |
| 7 | Stressors and the social situation matter more | Housing, marriage, income, caste, migration and family attitude often shape both onset and outcome |

:::define Structure without rigidity
A consistent scheme should be used each time for **recording** the interview, but the **interview itself** should not follow a fixed and rigid method. The record is standardised; the conversation is flexible. Students who confuse the two produce interrogations that yield nothing.
:::

### Four rules that separate a trained interviewer from a beginner
1. **See the patient first**, wherever possible. When the patient's and the informant's accounts differ, record them separately. The discrepancy is often diagnostic.
2. **Record verbatim, not as a label.** Write the sign and the patient's own words, in their own spoken language where possible.
3. **Open before you close.** Ask “How are you feeling today?” rather than “Are you feeling sad?” The second puts your word in the patient's mouth.
4. **Listening is an active process.** Listening, and visibly showing you are listening, is arguably the most important interviewing skill there is.

:::word Verbatim recording
- Weak: *Patient has delusion of persecution.*
- Trained: *Delusion of persecution present. Patient states, “Mere padosi mujhe zeher de rahe hain” (“My neighbours are poisoning me”), held with full conviction and not amenable to reasoning.*
:::

:::widget worked
{"title": "From label to record", "steps": [{"q": "The trainee wrote: 'Pt has delusion of persecution.' What is missing?", "a": "The patient's own words, how firmly the belief is held, whether it yields to gentle questioning, and how it affects behaviour. A label cannot be checked by the next clinician."}, {"q": "What did the patient actually say?", "a": "'Mere padosi mujhe zeher de rahe hain.' (My neighbours are poisoning me.) He has stopped eating food cooked at home for ten days."}, {"q": "Write the trained version.", "a": "Delusion of persecution: states, 'Mere padosi mujhe zeher de rahe hain' (My neighbours are poisoning me), held with full conviction, not shaken by gentle questioning about evidence; has stopped eating home-cooked food for ten days."}], "yourTurn": [{"q": "Rewrite: 'Pt grandiose.' The patient said, 'Main is desh ka agla pradhan mantri hoon, bhagwan ne chuna hai,' and has resigned from her job to prepare.", "a": "Grandiose delusion: states, 'Main is desh ka agla pradhan mantri hoon, bhagwan ne chuna hai' (I am the country's next prime minister, God has chosen me), held with full conviction; has resigned from her job to prepare."}]}
:::

:::recall
1. State the dual task of the psychiatric interview in one sentence. || Gather information for diagnosis, formulation and treatment, while building the relationship all treatment depends on; neither can be sacrificed.
2. List all seven ways a psychiatric interview differs from a medical interview. || Communication disturbed; collateral essential; personal history and premorbid personality; sharper observation; rapport harder; insight and judgement may be poor; stressors and social situation matter more.
3. What should be standardised: the interview, or the record? Why does it matter? || The record. The conversation stays flexible; a rigid interview becomes an interrogation.
4. Rewrite properly: “Pt has grandiose delusion.” || Name the sign plus the patient's verbatim words, conviction, and whether it yields to reasoning.
:::

:::mcq
Q: A 30-year-old man answers every question in one word and keeps looking at the door. The most useful thing to write down first is:
- A diagnosis of depression
- *What you observe: his brief answers and his watchfulness
- That he is uncooperative
- Nothing until he talks more
> The interview itself is data. Record behaviour before interpreting it.
:::

## 1.2 Setting up: consent, privacy, safety, time [core][beginner]
Most of what goes wrong in a student interview goes wrong before a single clinical question is asked. This section is short, dull and disproportionately important.

### Agreement as to process
Before the history starts:
- Introduce yourself and, unless it is obvious, say why you are the one speaking to them.
- Obtain consent to proceed where it is not implicit.
- State the nature and approximate length of the interaction.
- Invite the patient to change or add to the process. A small act with a large effect on the alliance.
- Establish whether the patient came **voluntarily or was brought involuntarily**. A guarded patient who was brought against their will is behaving understandably, not pathologically.

### Privacy and confidentiality, and its limits
:::define The rule
Confidentiality must always be observed. The interviewer should make every attempt to ensure that others cannot overhear the interview.
:::
Where privacy is not achievable (a shared ward bay, a crowded OPD) you have two honest options: move the interview, or explicitly defer the sensitive topics and tell the patient you will return to them in private. Do not pretend the setting is private when it is not.

### The exceptions: know these precisely
Confidentiality is the default, not an absolute. It may be breached for:
- **Risk of harm to others.** Where the patient intends to harm an identifiable person, the clinician may carry a legal duty to warn. Part of this duty may be met by clinical measures: adjusting treatment or admitting the patient. The law varies by jurisdiction.
- **Risk of harm to self.** Suicidal risk may require involving others to keep the patient safe.
- **Child abuse.** Disclosure duties apply (in India, POCSO).
- **Non-confidential evaluations.** Forensic and disability assessments. Say so at the outset, name who will receive the report, and document that you did.

:::trap How to frame it
“Confidentiality in psychiatry is a strong default with defined, disclosed exceptions.” Not “confidentiality is absolute”, and not “confidentiality doesn't apply in psychiatry”.
:::

### Involving the family [extra]
- Meet the family together with the patient, **after** the individual session, and after the patient has consented.
- Do not bring up what the patient shared with you. Listen to the family; discuss only what the patient introduces in the joint session.
- If a relative telephones, get the patient's consent before speaking (except in an emergency), and tell the patient the relative made contact, even if consent was given.

### Safety, comfort and the room
| Element | Standard |
|---|---|
| Distance | Seated roughly 4 to 6 feet apart |
| Chair height | About equal, so neither party towers over the other |
| Barriers | Do not sit behind a desk. Offer a choice of chair; how the patient chooses can itself be informative |
| Escape route | In emergency settings the interviewer has a clear exit path; door may be left ajar; staff present if needed |
| Interruptions | No phone interruptions. The time is set aside for the patient alone |
| Comfort | Ask directly: “Are you warm enough?” Offer water and tissues |
| Reassurance | Psychotic or confused patients may feel threatened. Reassure them they are safe; sometimes say there is enough staff to keep things under control |

:::trap Correcting a common myth
Patients with psychiatric disorders are usually **no more violent than the general population**. Safety precautions are taken because of the specific risk in front of you, not because of a diagnosis. Never write or say the opposite in an exam.
:::

### Time and number of sessions
- **45 to 90 minutes** is usually allotted for an initial interview.
- **20 to 30 minutes or less** may be all an inpatient on a medical ward, or a confused, distressed or psychotic patient, can tolerate. Use several brief sessions.
- A comprehensive interview often needs more than one session. The history is never complete or entirely accurate.
- The interview is dynamic: assessment continues as new material emerges.

:::widget decide
{"scene": "Near the end of an interview, Vikram, 35, a garage owner in Nagpur, says calmly, 'Once I'm out of here, I'll deal with my brother-in-law properly. He cheated me. I know where he lives.' Earlier you promised that 'everything stays between us'.", "ask": "What do you do?", "choices": [{"label": "Keep it to yourself, since you promised confidentiality", "verdict": "harm", "outcome": "Nobody on the team knows about the threat. Two days later the family reports that Vikram turned up at the brother-in-law's shop with a rod.", "why": "Confidentiality is a strong default, not an absolute. A credible threat to an identifiable person is a recognised exception. The real error was the earlier promise of total secrecy."}, {"label": "Explore the threat calmly (intent, plan, means, past violence), tell Vikram honestly that you must share this with the team, and inform your supervisor at once", "verdict": "best", "outcome": "The team assesses the risk the same day, adjusts his care and plans how to protect the brother-in-law in line with the law.", "why": "You gathered what the team needs, stayed honest with the patient, and passed a safety concern on through the right route."}, {"label": "Call the brother-in-law yourself, right away", "verdict": "ok", "outcome": "The brother-in-law panics and calls the police; the family is in uproar, and Vikram stops trusting the clinic.", "why": "Protecting a named person may be needed, but a student acting alone skips assessment and supervision. Decisions to disclose are made by the responsible clinician."}]}
:::

:::clinician
### Confidentiality and its limits in Indian law
- The Mental Healthcare Act 2017 gives every person with mental illness the right to confidentiality of information about their care, with listed exceptions: release to the nominated representative to help the person exercise their rights, to other health professionals for care, to protect another person from harm or violence, to deal with an immediate threat to life, on the order of a Mental Health Review Board or a court, and in the interests of public safety. Only the information needed to prevent the harm may be released.
- Child sexual abuse disclosed by a minor creates a mandatory reporting duty under POCSO 2012; failing to report is itself an offence.
- Forensic, fitness and disability assessments are not confidential in the usual sense: state who will read the report before you start, and document that you did.
- Good practice: never promise absolute secrecy. Use a standard opening that names the exceptions, so a later disclosure never feels like a betrayal.
:::

:::recall
1. Name five things to establish before the history begins. || Who you are and why; consent; nature and length; invite them to shape the process; voluntary or brought.
2. List four circumstances in which confidentiality may be breached. || Harm to others; harm to self; child abuse; non-confidential (forensic or disability) evaluations.
3. Give the recommended seating distance and two rules about chairs. || 4 to 6 feet; equal height; no desk between you (offer a choice).
4. How long is an initial interview, and what shortens it? || 45 to 90 minutes; confusion, distress, psychosis or a medical ward shorten it to 20 to 30 minutes, in several sessions.
5. True or false: psychiatric patients are more violent than the general population. Justify. || False. They are usually no more violent; precautions follow the specific risk, not the diagnosis.
:::

:::mcq
Q: A young woman's mother insists on staying for the whole interview. The patient keeps glancing at her before answering. Best next step:
- Continue; the mother is helpful
- *Thank the mother, then see the patient alone for part of the interview
- Ask the mother to answer instead
- End the interview
> Collateral is valuable, but sensitive topics (abuse, sex, self-harm, substances) need private time.

Q: On a ward you are about to interview an agitated man. Which seating is safest?
- He sits between you and the door
- *Both of you have a clear route to the door, with you nearer it
- Door closed and locked for privacy
- Sit very close to calm him
> Safety first: an unobstructed exit for both, and an alarm or colleague nearby.
:::

## 1.3 Rapport, empathy and the therapeutic alliance [core][beginner]
:::define Rapport and empathy
**Rapport** is the harmonious responsiveness of the clinician to the patient and of the patient to the clinician. **Empathy** is understanding what the patient is thinking and feeling, putting yourself in their place while at the same time **maintaining objectivity**.
:::

### Empathy versus identification
A classic viva question and a real clinical hazard.
| Feature | Empathy | Identification |
|---|---|---|
| Understanding the emotion | Yes | Yes |
| Experiencing the emotion | Not to the point of losing perspective | Yes, fully |
| Objectivity | Retained: the essential ingredient | Lost |
| Effect on the patient | Strengthens the alliance | Blurred boundaries; confusing and distressing, especially for patients with boundary difficulties (for example borderline personality disorder) |
| Effect on the clinician | Sustainable | Draining, then disengagement, then burnout |

:::note Most empathy is non-verbal
Raised eyebrows, leaning towards the patient, putting your pen down, a nod, a brief “I see.” Verbal empathy is short and specific: “That must have been very difficult for you.” If you are not sure what the patient experienced, do not guess. Encourage them to continue; a wrong guess costs more than silence.
:::

:::widget compare
{"title": "Sympathy and empathy", "a": {"label": "Sympathy", "points": ["'Oh, poor you, how terrible.'", "Feeling sorry for the person, from outside", "Can sound like pity", "Focus moves to the helper's feelings"], "summary": "Sympathy: kind, but it keeps a distance and can feel like pity."}, "b": {"label": "Empathy", "points": ["'It sounds as though you have felt completely alone with this.'", "Understanding the experience as the person feels it", "Checked with them: 'Have I got that right?'", "Focus stays on the patient"], "summary": "Empathy: understanding from the inside, put into words and checked. It is the base of rapport."}, "caption": "Empathy is a skill you can practise: notice the feeling, name it, and check you have understood."}
:::

### What actually builds the alliance
- **Respect and consideration.** The patient is often in pain, vulnerable and, because of stigma, frightened of seeing you. Much of a first interview's success depends on reducing excessive anxiety.
- **A non-judgemental attitude.** Many patients have met criticism, belittlement or anger in response to their symptoms. Being heard without judgement is itself therapeutic.
- **Demonstrated understanding.** It is not enough to understand; the understanding must be conveyed.
- **Evident caring.** When the patient sees you understand and care, trust grows.
- **Genuineness.** Laughing at something funny, admitting a mistake, apologising for being late: these strengthen the alliance.
- **Flexibility.** If a patient brings a photograph, look at it and ask about it. There are no irrelevant moments in the interview room.

### Personal questions from the patient [extra]
- About your qualifications and position: answer directly.
- Sarcastic (“Did you really go to medical school?”): address the feeling behind it, not the content.
- Personal (“Are you married?”): no single right answer. In insight-oriented work, explore why it is asked; in supportive work or medication review, answering a mild question is fine.
- **The principle:** any self-disclosure must serve the patient and the alliance, never the clinician's needs.

### Unconscious processes in the room [extra]
| Term | Meaning | What it looks like |
|---|---|---|
| Transference | The patient unconsciously displaces onto the clinician patterns of feeling and behaviour that began with significant figures earlier in life | Anger, hostility, demandingness or obsequiousness out of proportion to the actual relationship |
| Countertransference | The clinician unconsciously displaces onto the patient reactions belonging to figures from the clinician's own past | Clinician missing appointments, boredom, sleepiness in session. Address through supervision or personal therapy |
| Resistance | Conscious or unconscious processes that interfere with therapeutic goals | Exaggerated emotion, intellectualisation, generalisation, missed appointments, acting out |
| Repression | An unconscious process keeping feelings out of awareness; may fuel resistance | The patient is genuinely unaware of conflicts central to the illness |

In the first session, note slips of the tongue and revealing mannerisms but **do not interpret them**. Interpretations are avoided at first contact; record areas for later.

### Person-centred, not just symptom-centred
The patient's goals (for example, safe housing) are often not the clinician's (for example, fewer hallucinations). That gap usually traces back to a symptom-based interview. Two questions change an interview:
- “Tell me about some of the things you do best.”
- “What do you consider your greatest asset?”

Record strengths alongside deficits, and ask the patient to state their own goals in their own words.

:::widget sort
{"prompt": "A patient says, 'My father died last month and I can't stop crying.' Sort each reply.", "buckets": ["Empathy", "Sympathy or identification", "Dismissal"], "items": [{"text": "\"It sounds like his death has left a huge gap. What has it been like at home?\"", "bucket": 0, "why": "Names the feeling and invites more, while you keep your own balance."}, {"text": "\"I lost my father too. I cried for a year. I still can't talk about it.\"", "bucket": 1, "why": "Your own grief takes over. The focus shifts to you, and objectivity goes."}, {"text": "\"You poor thing, that is so terrible.\"", "bucket": 1, "why": "Pity from above, not understanding from beside."}, {"text": "\"Crying is normal. Let's move on to your sleep.\"", "bucket": 2, "why": "Correct fact, but it closes the door."}, {"text": "(Puts pen down, leans forward, a pause) \"Take your time.\"", "bucket": 0, "why": "Most empathy is non-verbal."}]}
:::

:::recall
1. Define rapport and empathy. What single ingredient distinguishes empathy from identification? || Objectivity: retained in empathy, lost in identification.
2. Give three non-verbal empathic responses. || Leaning forward, putting the pen down, nodding (also raised eyebrows, “I see”).
3. Define transference and countertransference, with one sign of each. || Patient displaces past patterns onto clinician (disproportionate anger); clinician displaces own past onto patient (boredom, missed appointments).
4. Why avoid interpretations in the first session? || They are premature, can feel intrusive and damage the alliance; note and explore later.
5. Name two questions that make an assessment person-centred. || “Tell me about the things you do best.” “What is your greatest asset?”
:::

:::mcq
Q: A patient says, "Nobody understands what I am going through." The most empathic reply is:
- "I understand exactly how you feel."
- "Everyone feels that sometimes."
- *"It sounds like you've been carrying this on your own. Tell me what it has been like."
- "Let's stick to the questions."
> Empathy reflects the feeling and invites more, without claiming to know it all.
:::

## 1.4 Technique: how to actually ask [core][beginner]
### Open and closed questions
| Type | Definition | Example |
|---|---|---|
| Open-ended | Identifies an area but gives minimal structure for the answer. Elicits narrative | “Tell me about your pain.” “What has led to your being here?” |
| Closed-ended | Gives much structure and narrows the possible answers. The most closed form yields only yes or no | “Is your pain sharp?” “Do you drink alcohol every day?” |

:::analogy A series of funnels
A beginner's interview is one funnel: open questions at the start, closed at the end. A trained interview is a **series of funnels**. For each topic: open wide, narrow to specifics, close, transition, open the next topic wide again.
- Open: “Tell me what brought you here.” Then narrow on the presenting problem. Transition.
- Open: “How has your sleep been?” Then narrow on biological functions. Transition.
- Open: “Tell me about your family growing up.” Then narrow on personal history.
:::

:::trap The error to avoid
One long funnel: all the open questions first, then a yes/no checklist. It feels efficient and yields almost nothing. Closed questions are not the enemy; closed questions **too early** are.
:::

### The core techniques
| Technique | Example | What it does |
|---|---|---|
| Facilitation | Nodding; “Go on.” “I see.” | Keeps the story flowing without steering its content |
| Reflection | “So it sounds like you felt completely alone in it.” | Mirrors the feeling back; shows the emotion was received, not just the facts |
| Clarification | “When you say ‘tension’, do you mean worry in your mind, or a feeling in your body?” | Essential in India, where idioms like tension, gas and ghabrahat carry several meanings |
| Confrontation | “You're telling me things are fine, but you've been in tears since you sat down.” | Gently names a mismatch between report and observation. Use sparingly, without accusation |
| Silence | (Pause. Wait.) | Gives space for difficult material. Beginners fill silence; experienced interviewers use it |
| Summarising | “Let me check I've understood the last six months…” | Confirms accuracy, shows listening, lets the patient correct you |
| Transition | “I'd now like to ask about your childhood.” | Signposts a change of topic so it doesn't feel abrupt |
| Reassurance | “What you're describing is something we see and can treat.” | Legitimate after assessment. Premature reassurance shuts down disclosure |

:::trap “Open-ended” is not the same as “vague”
“Tell me about your sleep” is open and focused. “So… anything else?” is vague and unfocused. Open-endedness is about how much structure the answer may take, not how much direction the question gives.
:::

:::sounds How it sounds in an Indian OPD
- “Bas tension rehti hai.” Clarify: worry, low mood, irritability, or body symptoms?
- “Gas chadh jaati hai, dil ghabrata hai.” Often anxiety or panic described through the body.
- “Mann nahi lagta.” Ask what they no longer enjoy: this may be anhedonia.
- “Dimaag kharab ho gaya hai.” Ask what they mean; it may be distress, not psychosis.
:::

:::widget worked
{"title": "One funnel for sleep", "steps": [{"q": "Open wide.", "a": "'How has your sleep been lately?' Then wait."}, {"q": "Narrow to specifics.", "a": "'What time do you go to bed? How long before you fall asleep? Do you wake in the night? What time do you wake for the day?'"}, {"q": "Close on the key facts.", "a": "'So you wake at 4 a.m. most days and cannot get back to sleep. Is that nearly every day?'"}, {"q": "Transition to the next topic.", "a": "'Thank you. I'd like to ask now about your appetite.' Then open wide again."}], "yourTurn": [{"q": "Build a funnel for alcohol use.", "a": "Open: 'Tell me about alcohol in your life.' Narrow: 'What do you drink, how much, how often, since when? Ever a morning drink?' Close: 'So about half a bottle of whisky on most evenings for two years?' Transition: 'Thank you. Now, any other substances?'"}]}
:::

:::widget decide
{"scene": "Sunita, 41, a nurse from Kochi, tells you smoothly that 'everything at home is perfectly fine'. She has been twisting her dupatta and blinking back tears since she sat down.", "ask": "How do you respond?", "choices": [{"label": "'You're lying to me. Something is obviously wrong.'", "verdict": "harm", "outcome": "She stiffens, apologises for wasting your time and asks to leave.", "why": "Confrontation used as accusation feels like an attack and closes the interview."}, {"label": "Gently: 'You say things are fine, and I also notice you look close to tears. I wonder what's going on for you right now.'", "verdict": "best", "outcome": "After a pause she tells you her husband has been hitting her for a year.", "why": "Gentle confrontation names the mismatch between what is said and what is seen, without blame, and invites the truth."}, {"label": "Accept it and move to the next section", "verdict": "ok", "outcome": "The interview finishes on time. The most important fact stays hidden.", "why": "Not harmful in itself, but you ignored a clear non-verbal cue."}]}
:::

:::widget flow
{"title": "A series of funnels", "layout": "chain", "nodes": [{"id": "open1", "label": "Open wide", "detail": "'Tell me what brought you here.'"}, {"id": "narrow1", "label": "Narrow", "detail": "Onset, course, severity."}, {"id": "close1", "label": "Close", "detail": "Specific yes or no checks."}, {"id": "trans", "label": "Transition", "detail": "'Now I'd like to ask about your sleep.'"}, {"id": "open2", "label": "Open the next topic", "detail": "'How has your sleep been?'"}]}
:::

:::recall
1. Define open and closed questions with one example each. || Open: minimal structure for the answer (“Tell me about your pain”). Closed: narrow, often yes or no (“Is it sharp?”).
2. Explain the series-of-funnels model. What beginner's error does it correct? || Open, narrow, close per topic; corrects one long funnel with a closed checklist at the end.
3. Name six interviewing techniques with an example phrase for each. || Facilitation, reflection, clarification, confrontation, silence, summarising (also transition, reassurance).
4. When is reassurance appropriate, and when is it a mistake? || After assessment; before it, it closes disclosure.
:::

:::mcq
Q: You want to know whether a patient hears voices without putting the idea in their head. Which question fits best early in the interview?
- "Do you hear voices telling you to kill yourself?"
- *"Sometimes when people are under stress, they hear or see things others don't. Has anything like that happened to you?"
- "You hear voices, don't you?"
- "Are you schizophrenic?"
> Normalise, ask open first, then narrow down. Leading questions distort answers.

Q: A talkative patient keeps drifting to old stories. The best technique to keep the history on track is:
- Interrupting harshly
- *A brief summary, then a focused question that brings them back
- Letting them talk for the full hour
- Switching to a questionnaire
> Summarising shows you heard them and gives you control of the direction.
:::

## 1.5 The history, part 1: identification to present illness [core][beginner]
### Two traditions, one structure
The Western scheme sets out fifteen parts of the initial interview; the Indian teaching proforma uses slightly different headings in a slightly different order. Learn the Indian order for your exam and recognise the Western one when you read.

| # | Western scheme | Indian teaching proforma |
|---|---|---|
| I | Identifying data | Identification data |
| II | Source and reliability | Informants and reliability |
| III | Chief complaint | Presenting (chief) complaints |
| IV | Present illness | History of present illness |
| V | Past psychiatric history | Past psychiatric and medical history |
| VI | Substance use | Treatment history |
| VII | Past medical history | Family history |
| VIII | Family history | Personal and social history |
| IX | Developmental and social history | Premorbid personality |
| X | Review of systems | Alcohol and substance history |
| XI | Mental status examination | Physical examination |
| XII | Physical examination | Mental status examination |
| XIII | Formulation | Investigations |
| XIV | Diagnosis | Diagnostic formulation |
| XV | Treatment plan | Management plan |

:::define The two pillars
Strip everything else away and assessment has two pillars: (1) **the history**: subjective, the patient's report plus collateral accounts; (2) **the mental status examination**: objective, the interviewer's own tool, equivalent to the physical examination in the rest of medicine.
:::

### 1 · Identification data
Name (including aliases and pet names), age and sex, residential and office address, religion, marital status, socioeconomic background, education, occupation and income, source of referral. In medicolegal cases, two identification marks.

### 2 · Informants and reliability
The patient's own history may be incomplete because insight is absent or cooperation poor, so **collateral history is routine, not exceptional**.

:::trap Consent first
Take the patient's consent before taking collateral history, unless the patient lacks capacity. A frequently forgotten and frequently examined step.
:::

Record for each informant: identification data, relationship to the patient, whether they live together and for how long. Then comment explicitly on reliability.

:::mnemonic Reliability of an informant: four parameters
1. Relationship with the patient
2. Intellectual and observational ability
3. Familiarity with the patient and length of stay together
4. Degree of concern about the patient
:::

### 3 · Presenting (chief) complaints
:::define Rule
Record the chief complaints in the patient's own words, with the duration of each, in chronological order. Record both patient's and informant's versions where they differ. If the patient has no complaints because insight is absent, record that: it is a positive finding, not a blank.
:::

| Point | What you are asking |
|---|---|
| Onset | Acute, subacute or insidious? When was the patient last completely well? |
| Duration | How long has this episode lasted? |
| Course | Continuous, episodic, fluctuating, deteriorating, improving? |
| Predisposing factors | What made this person vulnerable in the first place? |
| Precipitating factors | What set this episode off? Include life stressors |
| Perpetuating and relieving factors | What keeps it going, and what makes it better? |

:::word Chief complaints
1. “Neend nahi aati” (sleeplessness), 3 months
2. “Mann nahi lagta kisi kaam mein” (loss of interest in all activities), 3 months
3. “Lagta hai jeene ka koi fayda nahi” (feels there is no point in living), 3 weeks

Informant (wife) additionally reports reduced self-care and refusal to eat for the last 10 days.
:::

### 4 · History of present illness
:::define History of present illness
A chronological description of how the symptoms of the current episode evolved, narrated coherently from the point a change was first noticed until now.
:::
What must be established:
- **When the patient was last well.** This anchors onset and duration; state it explicitly.
- **Each chief complaint expanded**: what, how severe, how long, associated features.
- **Biological functions**: sleep, appetite and sexual functioning, always.
- **Suicidal ideation, self-harm, and harm to others**, always, with details of any intent and plan.
- **Changes in other areas** over the same period: interests, relationships, behaviour, habits, physical health.
- **Stressors**: home, work, school, legal, medical, interpersonal.
- **Aggravating and relieving factors**: medication, support, coping, time of day.
- **Why now?** What made them come at this moment? (“I'm here because my wife said she'd leave if I didn't get help.”)
- **Treatment already received** in this episode: who, how often, what, is it continuing, and if not, why not.

:::trap Important negatives are part of the history
Record important negative findings, for example the absence of alcohol or drug use in a new-onset psychosis. A blank is ambiguous; a recorded negative is data. Examiners reward this.
:::

### The life chart
:::define Life chart
A graphical display of the course of illness over time. In one picture it shows the sequence of episodes, polarity, severity, frequency, relation to stressors and response to treatment.
:::
For recurrent and bipolar disorders it conveys in one glance what three paragraphs cannot. Draw time along the bottom, mania above the line and depression below; bar height shows severity, bar width shows duration, and a triangle marks each stressor (for example bereavement, job loss, stopping medicines). Add a treatment row underneath (for example “lithium, adherent” then “stopped”). Draw one for every patient with a recurrent disorder.

:::widget timeline
{"prompt": "Ramesh's family tell his story in a jumble. Put the events of his present illness in order.", "events": [{"label": "Last completely well: working and cheerful at his cousin's wedding"}, {"label": "Lost his job when the factory closed"}, {"label": "Began sleeping badly and stopped meeting friends"}, {"label": "Stopped eating properly and lost weight"}, {"label": "Said he was a burden and that the family would be better off without him"}, {"label": "Brought to the clinic by his wife"}], "why": "A present illness is written as a story in time: when the person was last well, what set things off, how symptoms developed, and what led to the visit today. Getting the order right shows how the illness grew, and here it shows rising risk."}
:::

### The psychiatric review of systems
Run it alongside the present illness, to rule diagnoses in or out with pertinent positives and negatives.
| Category | Screen for |
|---|---|
| Mood | Depression: sadness, tearfulness, sleep, appetite, energy, concentration, sexual function, guilt, psychomotor change, interest. Mania: impulsivity, grandiosity, recklessness, excess energy, less need for sleep, overspending, talkativeness, racing thoughts, hypersexuality. Mixed: irritability, lability |
| Anxiety | Generalised worry; panic (time to peak, body symptoms, fear of recurrence, agoraphobia); obsessive-compulsive symptoms (checking, cleaning, ordering, counting); PTSD (nightmares, flashbacks, startle, avoidance); social anxiety; phobias |
| Psychosis | Hallucinations by modality; paranoia; delusions (TV or radio messages, broadcasting, control, reference); the patient's own spiritual or cultural framing; reality testing |
| Other | ADHD symptoms; eating disorder symptoms (bingeing, purging, excessive exercise) |

:::mnemonic SIG E CAPS: the symptoms of major depression
- **S**leep: insomnia or hypersomnia
- **I**nterest: loss of interest (anhedonia)
- **G**uilt: worthlessness, excessive guilt
- **E**nergy: fatigue
- **C**oncentration: impaired thinking
- **A**ppetite: change in appetite or weight
- **P**sychomotor: agitation or retardation
- **S**uicidality: recurrent thoughts of death or suicide
:::

:::widget sort
{"prompt": "Ramesh, 48, a farmer in Vidarbha, became depressed after two failed harvests. Sort each factor.", "buckets": ["Predisposing", "Precipitating", "Perpetuating"], "items": [{"text": "His father had depression and died by suicide", "bucket": 0, "why": "A long-standing vulnerability present before this episode."}, {"text": "The second crop failed in October", "bucket": 1, "why": "The trigger for this episode."}, {"text": "A large loan from a moneylender, still unpaid", "bucket": 2, "why": "An ongoing stress that keeps the illness going."}, {"text": "He has stopped meeting friends at the chai stall", "bucket": 2, "why": "Withdrawal removes support and pleasure."}, {"text": "Lost his mother at age seven", "bucket": 0}, {"text": "Drinks more each evening to sleep", "bucket": 2, "why": "Alcohol worsens mood and sleep."}]}
:::

:::widget reveal
{"prompt": "A man says his 'tension' began after his business loss. His wife says he stopped sleeping two months before the loss. Why does this matter for the history?", "answer": "Onset is a key fact. If the sleeplessness came first, the business loss may be a result of an illness already under way, not its cause. Record both accounts, name the source of each, and mark the onset as uncertain until clarified."}
:::

:::recall
1. Name the two pillars of psychiatric assessment. || The history (subjective, longitudinal) and the MSE (objective, cross-sectional).
2. What are the four parameters of informant reliability? || Relationship; intellectual and observational ability; familiarity and time together; degree of concern.
3. Give the six points to record about a presenting complaint. || Onset, duration, course, predisposing, precipitating, perpetuating and relieving factors.
4. What does a life chart display? Name five things. || Sequence, polarity, severity, frequency, stressors, treatment response.
5. Expand SIG E CAPS. || Sleep, Interest, Guilt, Energy, Concentration, Appetite, Psychomotor, Suicidality.
6. Why record important negatives? || A blank is ambiguous; a recorded negative (for example no substance use in new psychosis) is data.
:::

:::mcq
Q: A man says his "tension" started "after the business loss", but his wife says he stopped sleeping two months before the loss. In the history you should:
- Record only the patient's version
- Record only the wife's version
- *Record both, with their sources, and note the onset as uncertain
- Ignore the dates
> Note who said what. Conflicting accounts are themselves useful information.
:::

## 1.5b The history, part 2: past, substances, medical, family, personal [core][beginner]
### 5 · Past psychiatric history
Comorbidity is the rule, so screen for other disorders too, not just earlier episodes of the same illness.
- All past psychiatric illness across the lifetime: when, how long, how often, how severe.
- Past treatment in detail: outpatient therapy (individual, group, couple, family), day care, inpatient care (voluntary or involuntary, and what led to it), support groups, vocational training.
- Medicines and physical treatments: what, dose, how long (to judge if the trial was adequate), response, side effects, why stopped. Include ECT and light therapy.
- **Adherence**: was it actually taken as advised?
- **Previous diagnosis**: what, and who made it. Never accept it automatically, but it is essential information.

:::safety The lethality history: assessed and documented in every patient
Past behaviour informs present risk. Taught at the level of what is assessed and recorded:
- **Suicidality**: past ideation, intent, plans and attempts; the nature and perceived lethality of each attempt; the chance of being found; notes; giving away possessions or other preparations.
- **Violence and homicidality**: violent acts or intent; specific enquiry about domestic violence; legal consequences; outcome for the other person.
- **Non-suicidal self-injury**: history, the feelings before and after (including relief), and how far they went to hide it.
:::

### 6 · Substance use history
Recorded separately because substances both cause psychiatric symptoms and co-occur with most diagnoses. For each substance: age at first use, pattern and route (oral, snorting, injecting), frequency and amount, dependence features, tolerance, withdrawal, last use.
- **Be non-judgemental**: a judgemental style gets inaccurate answers.
- **Be specific** with reluctant patients: “Have you ever used cannabis?” rather than a vague enquiry.
- **Beware definitional confusion**: “No, I don't use alcohol”… later… “I drink a fair amount of beer.” Volume is also confused with amount of alcohol.
- **Consequences**: relationships, work, school, legal, driving.
- **Periods of sobriety**: length and setting (was it in jail, or court-mandated?).
- **Treatment**: detox, rehab, outpatient, self-help groups (AA, NA).
- **Readiness for change**: precontemplation, contemplation or action.
- **Do not omit** tobacco, caffeine, gambling, eating and internet use. Tobacco above all: people who misuse substances are more likely to die from tobacco than from the main substance.

:::mnemonic CAGE and RAPS4: two four-item screens
**CAGE**
- **C**ut down: ever felt you should cut down on drinking?
- **A**nnoyed: have people annoyed you by criticising your drinking?
- **G**uilty: ever felt bad or guilty about drinking?
- **E**ye-opener: ever had a morning drink to steady your nerves or a hangover?

**RAPS4**
- **R**emorse: felt guilty after drinking?
- **A**mnesia: couldn't remember things said or done after drinking?
- **P**erform: failed to do what was expected because of drinking?
- **S**tarter: had a morning drink?
:::

### 7 · Past medical history and treatment history
Medical history matters for four distinct reasons. A favourite short note.
| Relationship | Example |
|---|---|
| Medical illness mimics psychiatric disorder | Hyperthyroidism resembling an anxiety disorder |
| Medical illness precipitates psychiatric disorder | Anxiety disorder in a person newly diagnosed with cancer |
| Medical illness constrains psychiatric treatment | Renal impairment limiting lithium |
| Psychiatric disorder or its treatment causes medical illness | Metabolic syndrome on a second-generation antipsychotic |

Explore these specifically: head injury, fits, unconsciousness, diabetes, hypertension, coronary artery disease, acute intermittent porphyria, syphilis and HIV. Also surgeries, admissions, accidents and allergies.

**Medicines**: all current psychiatric medicines (duration, adherence, effect, side effects) and all other, over-the-counter, sleep, herbal and alternative preparations. Ideally the patient brings the actual strips. Ask adherence specifically (“How many days a week are you actually able to take this?”) and ask about side effects patients rarely volunteer, such as sexual dysfunction.

In the Indian proforma, **treatment history** is its own heading: treatment in present and past episodes, adherence, response, adverse effects and **drug allergies, which should be prominently flagged**.

### 8 · Family history
:::define Convention
“Family history” covers the **family of origin**: parents, siblings, grandparents, uncles. The **family of procreation** (spouse, children) is recorded under personal history.
:::
1. **Family structure.** Draw a family tree (pedigree): squares for males, circles for females, filled for affected, a line through for deceased, a double line for consanguinity, and an arrow for the index patient. Note beside each: age, diagnosis, and for the deceased, age and cause of death. Note nuclear, extended or joint family.
2. **Family history of illness.** Psychiatric illness, major medical illness, alcohol or drug dependence, suicide or attempts.
3. **Current social situation.** Home circumstances, per capita income, socioeconomic status, the leader of the family (nominal and functional are often different people), and the family's attitude to the illness. Also communication patterns, cultural and religious values, and social support.

:::widget figure
{"id": "genogram-symbols"}
:::

### 9 · Personal and social history
The longest section of the proforma and the one students most often under-prepare. It reviews life stage by stage and often reveals current stressors as a by-product.
- **Individualise**: not every question for every patient. Younger patients give far more early-life detail; parents or older siblings fill gaps.
- **Go chronologically**: the most reliable way to miss nothing.

| Sub-heading | What to elicit |
|---|---|
| Perinatal history | Problems in pregnancy, especially the first trimester (fever, medicines, alcohol, trauma, illness); wanted or unwanted child; normal or instrumental delivery; home or hospital; birth cry; complications (cyanosis, fits, jaundice); prematurity; birth defects |
| Childhood history | Who brought them up; feeding and weaning; any maternal deprivation; age at each milestone; toilet training; neurotic traits (below) |
| Educational history | Age at starting and finishing; achievement; relations with peers and teachers; school refusal or truancy; learning difficulties; why studies stopped |
| Play history | Games, with whom, where; peer relationships. More important in younger patients |
| Puberty | Age at menarche and reaction to it; secondary sexual characteristics; anxieties about puberty |
| Menstrual and obstetric | Cycle regularity and length; last menstrual period; children; terminations |
| Occupational history | Jobs in order; reasons for change; satisfaction; relations with authority, peers and juniors; income; whether the job fits education and background |
| Sexual and marital history | Source of sexual knowledge; relationships; sexual practice and satisfaction; gender identity concerns. Marriage: duration; how long known before; arranged or self-chosen, with or without consent; separations; roles; relationship quality; sexual dysfunction. Family of procreation recorded here |

:::mnemonic Neurotic traits of childhood
Stuttering, stammering, tics, enuresis, encopresis, night terrors, thumb sucking, nail biting, head banging, body rocking, morbid fears, sleepwalking, temper tantrums, food fads.
:::

Also cover (the Western scheme names these explicitly): childhood physical and sexual abuse, asked carefully; legal history, especially pending cases; finances; hobbies and how they have changed; cultural and religious beliefs and practice; a structured sexual history.

:::widget decide
{"scene": "Anjali, 27, a software tester in Pune, is asked about alcohol and says, 'Only socially.' Her mother is in the room.", "ask": "What is your best approach?", "choices": [{"label": "Accept 'socially' and move on", "verdict": "harm", "outcome": "Later, liver tests come back abnormal. It turns out she drinks most nights alone.", "why": "'Socially' means different things to different people. Vague answers need specific follow-up, ideally in private."}, {"label": "Ask her mother how much she drinks", "verdict": "harm", "outcome": "Anjali feels exposed and closes down for the rest of the interview.", "why": "Sensitive questions need private time first, and her consent before collateral."}, {"label": "See her alone briefly: 'Many people drink to cope with stress. On a usual week, what do you drink, how much and on which days?'", "verdict": "best", "outcome": "She says she drinks four to five large pegs of vodka on most nights to fall asleep. The picture changes.", "why": "Privacy, a normalising statement and specific questions about type, amount and pattern get honest answers."}]}
:::

:::widget sort
{"prompt": "Family history or personal history? Place each item.", "buckets": ["Family history", "Personal history"], "items": [{"text": "His father had alcohol dependence", "bucket": 0, "why": "Family of origin."}, {"text": "He married at 24; the marriage was arranged", "bucket": 1, "why": "Marital history is personal history."}, {"text": "His two children are aged 5 and 8", "bucket": 1, "why": "Family of procreation is recorded under personal history."}, {"text": "A maternal aunt was treated for 'mental illness' for years", "bucket": 0}, {"text": "He wet the bed until age 10", "bucket": 1, "why": "A childhood neurotic trait, under personal history."}, {"text": "The joint family's functional head is his elder brother, not his father", "bucket": 0, "why": "Family structure and current social situation."}]}
:::

:::clinician
### Screening tools worth knowing
- **AUDIT** (10 items, WHO): scores of 8 or more suggest hazardous or harmful use; 20 or more suggests possible dependence. The 3-item AUDIT-C is a quick first screen.
- **CAGE**: two or more "yes" answers warrant a full assessment. It misses binge drinking and is less sensitive in women.
- **ASSIST** (WHO) covers all substances including tobacco and cannabis, with risk bands that guide brief intervention.
- Fagerström test for nicotine dependence; ask about smokeless tobacco (gutka, khaini) in India, which is often left out.
- Collateral, breath alcohol, urine screens and liver tests (GGT, MCV) support but never replace the history.
:::

:::recall
1. List the fifteen parts of the Indian proforma in order. || Identification; informants; chief complaints; present illness; past history; treatment; family; personal; premorbid personality; substance; physical exam; MSE; investigations; formulation; management.
2. Expand CAGE and RAPS4. || Cut down, Annoyed, Guilty, Eye-opener. Remorse, Amnesia, Perform, Starter.
3. Give the four ways medical illness relates to a psychiatric presentation, with an example each. || Mimics (hyperthyroid anxiety); precipitates (anxiety after cancer diagnosis); constrains treatment (renal impairment and lithium); caused by psychiatric treatment (metabolic syndrome on antipsychotics).
4. Which family goes under family history, and which under personal history? || Family of origin under family history; family of procreation under personal history.
5. Why must tobacco never be left out of a substance history? || People who misuse substances are more likely to die from tobacco than from their main substance.
6. Name eight neurotic traits of childhood. || Stammering, tics, enuresis, encopresis, night terrors, thumb sucking, nail biting, temper tantrums (and others).
:::

:::mcq
Q: In the family history, a patient mentions an uncle who "was mad and was taken to a temple for years". This most matters because:
- It proves the patient has the same illness
- *It may point to a familial psychiatric illness, which you should clarify (symptoms, treatment, course)
- It is irrelevant to the present illness
- It is a cultural belief and should be left out
> Clarify what "mad" meant. A family history of psychosis or bipolar disorder changes risk and treatment.

Q: A woman describes drinking "only on weekends". Which follow-up gives the most useful information?
- "Is that a problem?"
- *"On a usual weekend, what do you drink, how much, and over how long?"
- "Do you drink socially?"
- "Why do you drink?"
> Quantity, type, pattern and time give you units and a picture of risk.
:::

## 1.6 Premorbid personality [core][beginner]
:::define Premorbid personality
A description of the kind of person the patient was **before the illness began**. In patients under 16 the equivalent term is temperament.
:::

:::trap The mistake almost everyone makes
Do not write a label (“schizoid”, “histrionic”, “anxious type”). Describe the personality in detail. A label tells the reader nothing and cannot be checked; a description can be checked against the informant and against how the patient behaves now. **Write anecdotes, not adjectives.**
:::

| # | Sub-heading | Ask about |
|---|---|---|
| 1 | Interpersonal relationships | Family, friends, colleagues; introverted or extroverted; how easily relationships are made and kept |
| 2 | Use of leisure time | Hobbies, interests, intellectual activities; energetic or sedentary |
| 3 | Predominant mood | Optimistic or pessimistic; stable or anxious; cheerful or despondent; usual reaction to stress |
| 4 | Attitude to self and others | Self-confidence, self-criticism, self-centred or thoughtful of others; self-appraisal |
| 5 | Attitude to work and responsibility | Decision making, responsibility, flexibility, perseverance, foresight |
| 6 | Religious beliefs and moral attitudes | Beliefs; tolerance of others' standards; conscience; altruism |
| 7 | Fantasy life | Daydreams (frequency, content, favourites); dreams |
| 8 | Habits | Food fads, alcohol, tobacco, drugs, sleep |

:::note The most reliable method
Interview an informant who knew the patient before the illness. A depressed patient describes a premorbid self coloured by present mood; a manic patient, one coloured by grandiosity.
:::

:::word Premorbid personality
Described by his elder brother as sociable and easy-going before the illness: had a settled circle of six or seven college friends whom he met weekly, organised the family's festival arrangements each year, and was the person relatives approached for practical help. Generally even-tempered; brother recalls no long periods of low mood or excessive worry. Conscientious at work: same job for nine years with no disciplinary issues. Occasional social alcohol, no tobacco. Regular temple attendance, tolerant of others' beliefs.
:::

:::widget sort
{"prompt": "Description (useful) or label (weak)? Place each line from a premorbid personality write-up.", "buckets": ["Description", "Label"], "items": [{"text": "\"Anxious personality\"", "bucket": 1, "why": "Cannot be checked and says nothing specific."}, {"text": "\"Organised the family's Durga Puja every year and kept the accounts to the rupee\"", "bucket": 0}, {"text": "\"Schizoid traits\"", "bucket": 1}, {"text": "\"Had two close school friends; rarely went to parties; spent evenings reading\"", "bucket": 0}, {"text": "\"Worried for days before exams and checked answers three times\"", "bucket": 0}, {"text": "\"Histrionic\"", "bucket": 1}]}
:::

:::recall
1. Give the eight sub-headings of premorbid personality. || Relationships; leisure; predominant mood; attitude to self and others; work and responsibility; religion and morals; fantasy life; habits.
2. Why describe rather than label? || A label can't be verified and says nothing; a description can be checked against informants and current behaviour.
3. Who is the most reliable source, and why? || An informant who knew the patient before onset; the patient's own account is coloured by the current mood state.
:::

:::mcq
Q: A 22-year-old is described by his parents as always shy, with few friends and an interest in reading alone. Now he is suspicious and hears voices. In the history, this description of him belongs under:
- Present illness
- *Premorbid personality
- Mental state examination
- Family history
> Premorbid personality is how the person was before the illness; it helps judge change and prognosis.
:::

## 1.7 Special situations [core][beginner]
The standard interview assumes a cooperative adult who gives a coherent account. Much of clinical practice does not. These are the situations you will meet, and how to adapt.

### The agitated or potentially violent patient
- **Safety before completeness.** Clear exit path; door ajar; staff present or available.
- **Short and focused.** Shorten or stop if agitation rises.
- **Reassure explicitly.** Psychotic or frightened patients may be calmed by being told there is enough staff to stop things spiralling.
- **Non-provocative stance.** Don't stand over them, corner them or argue.
- **Clinical measures are part of risk management**: adjusting medicines or admission may itself discharge a duty of care.

### The mute or uncooperative patient
- **Observation becomes the examination.** Give more weight to appearance and behaviour: consciousness, posture, motor activity, eye contact, response to surroundings, catatonic signs.
- **Collateral history becomes primary**, not supplementary.
- **Record what could not be assessed and why.** Never leave a section silently blank.
- Consider organic causes and catatonia. A drug-assisted interview is one recognised investigation in catatonia, unexplained mutism and dissociative stupor.

:::word What could not be assessed
“Thought content could not be assessed as the patient remained mute throughout.”
:::

### The patient with psychosis
- **Non-confrontational**: “Do you ever feel someone is following you or out to get you?” rather than “Are you paranoid?”
- **Neither collude nor argue.** Explore content, conviction, onset and effect on behaviour.
- **Suggest the content** to patients who have learned not to volunteer it: “Do you feel the TV or radio has a special message for you?” A yes indicates an idea of reference.
- **Ask about their own framing**: spiritual or cultural understanding is part of judging whether a belief is delusional at all.

### The patient at risk of suicide
:::safety Taught at the level of what a clinician assesses
Suicidality is asked about in **every** initial interview, not only when volunteered. Asking “Are you suicidal?” is not enough. Establish:
- **Ideation**: passive thoughts of death versus active thoughts of ending life
- **Intent**: how strongly they mean to act
- **Plan**: whether one exists and how specific it is
- **Preparation**: steps already taken

Set this against past lethality and known risk and protective factors. Suicide is very hard to predict; risk assessment informs the **level of care** (outpatient versus admission), not a prediction. A stated plan is a particularly dangerous sign.
:::

:::sounds How suicidal thinking is often voiced
- “Bas sab khatam karna hai.” (I just want to end it all.)
- “Mere bina sab theek rahenge.” (Everyone will be fine without me.)
- “Neend mein hi chala jaun toh accha.” (Better if I just don't wake up.) Passive death wish: still ask about active thoughts and plans.
:::

### Children and adolescents [extra]
- Developmentally appropriate language; play and observation add to questioning.
- Several informants: parents (sometimes separately), school.
- Adolescents may refuse to answer, but ask anyway. **Falling school performance** is a sensitive sign of emotional disorder.
- Memories reported from before about age three are usually reconstructed.

### The older adult [extra]
- Allow more time; check hearing aids and glasses before concluding comprehension is impaired.
- Screen cognition routinely and interpret against education.
- Actively consider **delirium** (acute, fluctuating) and **depression**, which can look like cognitive impairment (depressive pseudodementia).
- Rely more on collateral sources for early history.

### The culturally different patient: cultural formulation
| Tool | What it is |
|---|---|
| Outline for Cultural Formulation | A framework for the cultural features of a person's problem and how it relates to their social context |
| Cultural Formulation Interview (CFI) | A brief semi-structured interview that puts the Outline into practice: the core CFI (16 questions), an informant version, and supplementary modules (children, older adults, carers, migrants and refugees) |

:::mnemonic The four domains of the core CFI
1. Cultural definition of the problem (questions 1 to 3)
2. Cultural perceptions of cause, context and support (4 to 10)
3. Cultural factors in self-coping and past help-seeking (11 to 13)
4. Cultural factors in current help-seeking (14 to 16)
:::
The Outline has five parts: cultural identity; cultural concepts of distress; stressors and cultural features of vulnerability and resilience; cultural features of the clinician-patient relationship; overall cultural assessment.

:::note Two points examiners like
- The CFI is person-centred: it asks this person's views rather than assuming what a group believes. That is how it avoids stereotyping. There are no right or wrong answers.
- It can be used with anyone, including when clinician and patient seem to share a background, because they may still differ in ways that matter.
:::

### Telepsychiatry [extra]
- Confirm the patient's physical location at the start of every session, in case of emergency.
- Confirm privacy at the patient's end, not just yours.
- Adapt the MSE: gait, psychomotor activity, tremor and much of appearance may be unobservable. Record what could not be assessed.
- Recording for teaching: fully inform the patient how it will be used, kept and accessed; their care must not depend on agreeing.

:::widget decide
{"scene": "Deepak, 29, brought by police to emergency in Kolkata, is pacing, shouting that 'the agency' has sent everyone in the room. He stops near the door and glares at you.", "ask": "What do you do first?", "choices": [{"label": "Close the door so he can't run, then begin the history", "verdict": "harm", "outcome": "Feeling trapped, he lunges towards the door and a staff member is hurt.", "why": "Blocking exits raises fear and risk for everyone. Both of you need a clear way out."}, {"label": "Keep a safe distance with a clear exit for both, a colleague nearby; speak calmly and briefly: 'You're safe here. I'm not from any agency. Would you like to sit down?'", "verdict": "best", "outcome": "He sits after a minute. The interview is short and focused, and the team arranges calm, voluntary medication.", "why": "Safety comes before completeness. A calm, non-provocative stance and explicit reassurance often settle a frightened, psychotic person."}, {"label": "Tell him firmly there is no agency and he is imagining it", "verdict": "harm", "outcome": "He shouts that you are part of it and refuses to speak.", "why": "Arguing with a delusion increases distress and destroys rapport."}]}
:::

:::widget decide
{"scene": "Mrs Fernandes, 63, from Goa, calmly tells you that a neighbour enters her flat at night through the fan to steal her jewellery. She has changed the locks three times.", "ask": "Which response explores this best?", "choices": [{"label": "'Yes, some neighbours are like that. You should call the police.'", "verdict": "harm", "outcome": "She files a police complaint against the neighbour, and the conflict escalates.", "why": "Colluding with a probable delusion strengthens it and can cause real harm."}, {"label": "'That's impossible. Nobody can come through a fan.'", "verdict": "ok", "outcome": "She becomes guarded and says you sound like her son.", "why": "Arguing rarely shifts a delusion and damages trust."}, {"label": "'That sounds frightening. How did you first notice it? How sure are you, out of ten? What have you done to protect yourself?'", "verdict": "best", "outcome": "She describes how it began after her husband died, rates her certainty at ten, and mentions she has stopped sleeping. Useful findings emerge, and she feels heard.", "why": "Neither collude nor argue. Explore onset, conviction and effect on behaviour while acknowledging her fear."}]}
:::

:::recall
1. How does the MSE change in a mute patient? || Observation becomes the examination; collateral becomes primary; record what could not be assessed and why.
2. What four things must be established about suicidality? || Ideation, intent, plan, preparation.
3. How do you ask about delusions without confrontation? || Neutral, suggestive questions (“Do you feel the TV has a special message for you?”); neither collude nor argue.
4. Name the three components of the CFI and its four core domains. || Core, informant, supplementary modules. Definition; cause, context and support; self-coping and past help; current help-seeking.
5. What two conditions must you consider in an older adult with poor memory? || Delirium and depression (pseudodementia).
:::

:::mcq
Q: An elderly woman is brought confused, with poor attention that varies through the day. Before a long psychiatric history, the priority is:
- A detailed childhood history
- *A medical assessment for delirium and its causes
- Projective testing
- Insight grading
> Fluctuating attention suggests delirium: a medical emergency that needs finding the cause.

Q: Interviewing a 14-year-old about self-harm, the best approach is:
- Only talk to the parents
- *See the young person alone, explain the limits of confidentiality, then involve parents as needed
- Promise to keep everything secret
- Use only a questionnaire
> Adolescents need privacy and honesty about what must be shared to keep them safe.
:::

## 1.8 Common interviewing errors [core][beginner]
| Error | What it sounds like | Correction |
|---|---|---|
| Interrupting the opening statement | Cutting in at 20 seconds to ask about sleep | Let the patient finish. The richest material comes in the first uninterrupted minutes |
| Compound questions | “How are your sleep, appetite and mood?” | One idea per question; otherwise you can't tell which part was answered |
| Leading questions | “You've been feeling sad, haven't you?” | “How has your mood been?” Otherwise you supply the symptom |
| Closed questions too early | A yes/no checklist in the first five minutes | Open each topic wide first: the series of funnels |
| Premature reassurance | “Don't worry, everything will be fine.” | It shuts down disclosure. Reassure after assessing |
| Premature interpretation | Explaining unconscious motives in session one | Note it; explore later |
| Jargon | “Any perceptual abnormalities?” | “Do you ever hear voices when there's nobody there?” |
| Ignoring affect and non-verbal cues | Writing while the patient starts crying | Put the pen down. Name what you see, gently |
| Recording labels instead of words | “Delusion of reference +” | Record the sign and the patient's verbatim account |
| Omitting risk assessment | Finishing a depression history without asking about suicide | Suicidal and homicidal ideas are asked in every initial interview |
| No collateral history | Accepting “everything is fine” from a patient without insight | Seek an informant, with consent, and judge their reliability |
| Blending accounts | One merged narrative | Record patient and informant separately when they differ |
| Treating a mute patient as unexaminable | “MSE could not be done.” | Observation is the MSE here. Document what was observed and what couldn't be assessed |
| Judging a belief without knowing the culture | Recording a widely held religious belief as a delusion | Judge against the patient's own social, cultural and educational background |

:::widget worked
{"title": "Spot the errors in this transcript", "steps": [{"q": "Trainee: 'So you've been feeling sad, haven't you?'", "a": "Leading question. Better: 'How has your mood been lately?'"}, {"q": "Trainee: 'And how are your sleep, appetite, energy and concentration?'", "a": "Compound question. Ask one at a time, each as its own small funnel."}, {"q": "Patient begins to cry. Trainee keeps writing and asks, 'Any perceptual abnormalities?'", "a": "Two errors: ignoring the emotion, and jargon. Put the pen down, acknowledge the tears, and later ask, 'Do you ever hear or see things others don't?'"}, {"q": "Trainee ends: 'Don't worry, you're not suicidal, are you? Good.'", "a": "Premature reassurance plus a leading question that invites 'no'. Ask directly and neutrally: 'Have you had thoughts of ending your life?'"}]}
:::

:::recall
1. List six common interviewing errors and their corrections. || Any six from the table, each with its fix.
2. Why is a compound question a problem? || You can't tell which part was answered.
3. What is wrong with “MSE could not be done” in a mute patient? || Observation is the MSE; document what was seen and what couldn't be assessed.
:::

:::mcq
Q: A trainee asks, "You're not suicidal, are you?" The main error is:
- It is too open
- *It is a leading question that invites "no"
- It is too long
- It should be asked first
> Ask directly and neutrally: "Have you had thoughts of ending your life?"
:::

## 1.9 Investigations and formulation [core][beginner]
### Physical examination
:::define The rule
A detailed general physical and systemic examination is a must in every patient. Physical disease may cause the condition, coexist by chance, or result from it or its treatment.
:::
In practice the extent varies with setting. Vital signs, weight, waist, BMI and height matter especially because of the metabolic effects of psychiatric medicines. A focused neurological examination is part of assessment. The **AIMS** (Abnormal Involuntary Movement Scale) monitors for tardive dyskinesia on antipsychotics. If you don't examine, ask when the last examination was done and what it showed.

### Investigations: an orientation, not a memory list [extra]
Chosen from the possibilities raised by history and examination, never ordered by reflex.
| Group | Examples and typical indications |
|---|---|
| Medical screen | Blood counts (routine; clozapine, lithium, carbamazepine monitoring); MCV (raised in alcohol dependence); urine; kidney function (lithium); liver function (carbamazepine, valproate, alcohol); electrolytes (SIADH, carbamazepine); glucose (over 35, antipsychotics); thyroid (refractory depression, rapid cycling, lithium); ECG (over 35, lithium, antidepressants, ECT, antipsychotics); HIV and VDRL where indicated; CK, markedly raised in neuroleptic malignant syndrome |
| Toxicology and drug levels | Urine drug screen when substance use is suspected (some medicines give false positives). Levels: lithium 0.6 to 1.0 mEq/L; carbamazepine 4 to 12 µg/mL; valproate 50 to 100 µg/mL |
| Electrophysiology | EEG (fits, dementia, episodic odd behaviour); video EEG (epileptic versus non-epileptic seizures); polysomnography (sleep disorders) |
| Neuroimaging | CT (dementia, delirium, fits, first-episode psychosis); MRI (higher resolution). PET, SPECT and MRS remain mostly research tools |
| Psychological tests | Objective: MMPI, 16-PF (personality); WAIS, Stanford-Binet, Bhatia's battery (intelligence). Projective: Rorschach, TAT, Draw-a-Person, Sentence Completion. Neuropsychological: Wisconsin Card Sorting, Wechsler Memory Scale, PGI Memory Scale, Bender Gestalt, Benton Visual Retention, PGI Battery of Brain Dysfunction |

### The formulation
:::define Diagnostic formulation
A summary of the significant positive and important negative findings, followed by the differential diagnosis, prognostic factors and management plan, built on the **biopsychosocial model**. Although it appears near the end of the record, it is developed throughout the interview as hypotheses are formed and tested.
:::

### The biopsychosocial grid
| | Predisposing | Precipitating | Perpetuating, and protective |
|---|---|---|---|
| Biological (body, brain, genes, drugs) | Family history; head injury; birth complications; chronic medical disease | Substance use; stopping medicines; post-partum state | Ongoing substance use; side effects; untreated physical illness. Protective: good physical health |
| Psychological (personality, cognition, coping) | Premorbid personality; early loss; maternal deprivation; childhood abuse | Bereavement; humiliation; exam failure; break-up | Hopelessness; avoidance; poor insight. Protective: intelligence, motivation, past recovery |
| Social (family, work, money, culture) | Poverty; migration; low education; discrimination; unstable housing | Job loss; marital conflict; legal trouble; moving to a new city | High expressed emotion; stigma; isolation. Protective: supportive family, stable income |

Fill every cell you can, then state the differential, prognostic factors and a management plan organised on the same three rows. The safety assessment belongs in the formulation, because it decides the level of care.

:::mnemonic A formulation in five sentences
1. **Who**: a one-line sketch of the person and how they function, including premorbid personality.
2. **What**: the presenting picture, duration, course, and the key positives and negatives from history and MSE.
3. **Why now**: precipitants, set against predisposing and perpetuating factors.
4. **Differential and provisional diagnosis**, with evidence for and against each.
5. **Risk and level of care**, then a biopsychosocial management plan and prognostic factors.
:::

:::note Treatment planning is part of the interview
The formulation is written for the record; the plan must be discussed with the patient in words they can use, and built on **their** goals. Patients' goals (safe housing, getting back to work) and clinicians' goals (fewer symptoms) often differ.
:::

:::widget sort
{"prompt": "Place each factor on the right row of the biopsychosocial grid for Asha, 22, with a first episode of psychosis.", "buckets": ["Biological", "Psychological", "Social"], "items": [{"text": "Daily cannabis since age 16", "bucket": 0}, {"text": "Uncle with schizophrenia", "bucket": 0}, {"text": "Has always coped by withdrawing to her room", "bucket": 1}, {"text": "Moved alone to Bengaluru for a job three months ago", "bucket": 2}, {"text": "Family members criticise her often and loudly", "bucket": 2, "why": "High expressed emotion is a social perpetuating factor linked to relapse."}, {"text": "Believes she is 'weak' for needing help", "bucket": 1}]}
:::

:::clinician
### A first-episode work-up in practice
For a first episode of psychosis, a reasonable baseline is: full blood count, kidney, liver and thyroid function, fasting glucose or HbA1c and lipids, calcium, vitamin B12, urine drug screen, HIV and syphilis serology where risk exists, pregnancy test where relevant, weight, BMI, waist and blood pressure, and an ECG before antipsychotics with QT risk. Neuroimaging (MRI preferred) when there are neurological signs, atypical features (late onset, rapid cognitive decline, seizures, delirium) or as local policy dictates. EEG for suspected seizures or encephalopathy. Consider autoimmune encephalitis (anti-NMDA receptor antibodies) when psychosis comes with seizures, dyskinesias, autonomic instability or reduced consciousness, especially in young women.
:::

:::widget layers
{"title": "The biopsychosocial formulation", "shape": "rings", "layers": [{"label": "Biological", "detail": "Genes, brain, body, medicines, substances."}, {"label": "Psychological", "detail": "Personality, coping, beliefs, early experiences."}, {"label": "Social", "detail": "Family, work, money, culture, discrimination."}], "caption": "Each ring holds predisposing, precipitating, perpetuating and protective factors."}
:::

:::recall
1. Why is a physical examination a must in every psychiatric patient? || Physical disease may cause, coexist with, or result from the psychiatric condition or its treatment.
2. Give therapeutic ranges for lithium, carbamazepine and valproate. || Lithium 0.6 to 1.0 mEq/L; carbamazepine 4 to 12 µg/mL; valproate 50 to 100 µg/mL.
3. Draw the biopsychosocial grid and fill one cell in each of the nine boxes. || Rows biological, psychological, social; columns predisposing, precipitating, perpetuating/protective.
4. Give the five sentences of a formulation. || Who; what; why now; differential; risk, plan and prognosis.
:::

:::mcq
Q: Which statement belongs in a formulation rather than the history?
- "Onset 3 months ago after job loss"
- "Father has depression"
- *"A vulnerable perfectionist whose low mood was triggered by job loss and is kept going by withdrawal and rumination"
- "Sleeps 4 hours a night"
> A formulation explains why this person, why now, and what keeps it going.
:::
`;
