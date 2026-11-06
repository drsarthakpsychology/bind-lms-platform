import { act } from "@/lib/study/activities";
import type { ModuleMeta } from "@/lib/study/types";
import { qaBank } from "./depression-qa";

export const meta: ModuleMeta = {
  id: "depression",
  num: 5,
  title: "Depressive disorders",
  emoji: "🌧️",
  tagline: "From what mood is, to criteria and treatment, to receptors and research frontiers",
  when: "Mood disorders",
  outcomes: [
    "Explain in plain words how depression differs from sadness, and what a diagnosis is",
    "State the criteria for a major depressive episode and every other depressive diagnosis, with the main ICD-11 differences",
    "Run a first interview, record the MSE, ask about suicide safely, and write a 5 Ps formulation",
    "Plan stepped treatment, choose and monitor an antidepressant, and know when to use ECT",
    "Explain antidepressant action at the receptor level, and the honest evidence on ketamine, neurosteroids, psychedelics, inflammation, GLP-1 medicines, genetics and new frameworks",
  ],
  writeTask:
    "On paper, from memory: the 9 symptoms of a major depressive episode (SIG E CAPS plus mood) with the number and duration rules, melancholic versus atypical features, the criteria for persistent depressive disorder, a 5 Ps formulation for a patient you invent, and a stepped treatment plan with how long to continue. Then check and correct in red.",
  activities: [
    act.lesson("mood-1", "Quiz: depression", "Criteria, specifiers and red flags."),
    act.scenarios("depression", "Patient case: “Mann nahi lagta”", "A tricky first meeting where the wrong kind word does harm."),
    act.coach("disorders", "Coach: disorders", "Chai repeats the diagnoses you confuse."),
    act.lesson("ad-1", "Quiz: antidepressant classes and timing", "Links this module to the medicines module."),
  ],
  noteId: "depression",
};

export const text = String.raw`

# Part 0 · Starting: mood and depression in plain words

## 0.1 What mood is [core][starting]
Start with yourself. Think of yesterday. You probably felt a few different things: a flash of irritation in traffic, a laugh with a friend, a dip of worry before an exam. Those are **emotions**. They are short waves. They rise, peak and fade, often within minutes.

Underneath the waves there is a slower layer. It is the background colour of your inner life over days. That slower layer is **mood**. When your mood is good, small problems feel small. When your mood is low, the same problems feel heavy.

:::analogy Weather and climate
Emotions are the weather: a shower, a gust, a sunny hour. Mood is the climate of the season. A rainy afternoon in a dry month does not change the season. Depression is when the season itself has changed, and stays changed.
:::

### Healthy mood moves
A healthy mood is not a flat line. It goes up with good news and down with bad news. Then it comes back towards your usual level. Two things mark it as healthy:
- It **reacts** to life. Good things still lift you, at least a little.
- It **recovers**. After a setback, you drift back to your usual self over days.

### Mood is more than a feeling
Mood shows up in four places at once. This matters, because doctors look for changes in all four.
- **Feeling**: sad, empty, flat, irritable, or calm and content.
- **Thinking**: how you see yourself, the world and the future.
- **Body**: sleep, appetite, energy, how fast you move.
- **Doing**: work, study, meeting people, looking after yourself.

:::widget layers
{"title": "Four places mood lives", "shape": "stack", "layers": [{"label": "Feeling", "detail": "What it is like inside: sad, empty, flat, irritable, or calm and content. This is the layer people usually mean by 'mood'."}, {"label": "Thinking", "detail": "How you see yourself, the world and the future. Low mood bends thoughts towards 'I'm useless', 'nothing works', 'it will never change'."}, {"label": "Body", "detail": "Sleep, appetite, energy and speed. In depression the body slows or becomes restless, and sleep and hunger change."}, {"label": "Doing", "detail": "Work, study, meeting people, looking after yourself. When mood stays low, this layer shrinks, and that shrinking keeps the low going."}], "caption": "Tap each layer. A passing bad mood touches one or two layers. Depression changes all four together, for a long time."}
:::

When someone's mood drops for a long time, all four change together. They feel sad, they think "I'm useless", they sleep badly and lose appetite, and they stop going out. That cluster is what we will learn to recognise.

:::widget moodline
{"prompt": "Here is one person's mood over a year, rated once a month (0 is their usual self). Which pattern is it?", "series": [0, 0.5, -0.5, 0, -1, -2.2, -2.6, -2.8, -2.4, -1.2, 0, 0.3], "labels": ["Jan", "Mar", "May", "Jul", "Sep", "Nov"], "options": ["Ordinary ups and downs", "A long low period that later lifts", "A very high period", "Highs and lows swapping every month"], "answer": 1, "why": "The line drops below the depression line and stays there for months, then recovers. Ordinary ups and downs stay near the middle and bounce back quickly. Nothing here goes high, so it is not mania."}
:::

:::recall
1. What is the difference between an emotion and a mood? || An emotion is a short wave (minutes); mood is the slower background state over days.
2. Name the two signs of a healthy mood. || It reacts to life, and it recovers after setbacks.
3. Name the four places mood shows up. || Feeling, thinking, body, doing.
:::

:::mcq
Q: Priya gets angry when her brother teases her, then laughs at a film an hour later. This is best described as:
- A mood disorder
- *Normal emotions changing with events
- Low mood
- Mood swings that need treatment
> Emotions are short and react to events. Nothing here suggests a lasting change in mood.
:::

## 0.2 Sadness or depression? [core][starting]
Sadness is a normal, useful emotion. It tells us something we care about is lost or hurt. It slows us down so we can take stock, and it brings people closer to comfort us. Nobody should be "treated" for being sad after a loss.

Depression is different. The word is used loosely in daily talk ("I'm so depressed, my phone broke"). In clinics it means something specific: a low state that is **longer, wider and deeper** than ordinary sadness, and that **stops a person living their life**.

### Four questions that separate them
| Question | Ordinary sadness | Depression |
|---|---|---|
| How long? | Hours to days; it passes | Most of the day, nearly every day, for a long stretch |
| How wide? | Linked to one thing; other parts of life still feel normal | Everything feels grey; even things the person loved feel empty |
| How deep? | Feelings only | The body changes too: sleep, appetite, energy, slowness |
| How much does it stop you? | You still study, work and meet people | Work, study, self-care and relationships fall apart |

Two more clues help. In depression, thinking turns against the self ("I am a burden", "I deserve this"). And the future looks closed ("nothing will ever change").

:::example Two students
**Riya**, 20, from Pune, fails a test. She cries that evening, tells her friend, sleeps badly for two nights, then starts planning a re-test. She still enjoys her cousin's wedding. That is sadness.

**Arjun**, 21, from Lucknow, has felt flat for over a month. He has stopped playing cricket, wakes at 4 a.m., barely eats, and cannot read a page. He tells his roommate, "Sab bekaar hai, main bhi." (Everything is useless, me too.) That pattern needs a professional assessment.
:::

:::sounds How people describe it
- "Mann nahi lagta." (My heart isn't in anything.) Loss of interest.
- "Thakaan rehti hai, kuch karne ki himmat nahi." (I'm always tired, no strength to do anything.)
- "I don't feel sad exactly. I feel nothing." Emptiness is common.
- "Body mein dard hai, neend nahi aati." Many people describe the body first.
:::

:::widget sort
{"prompt": "Ordinary sadness or possible depression? Place each card.", "buckets": ["Ordinary sadness", "Possible depression"], "items": [{"text": "Cried after a breakup, still went to college the next day", "bucket": 0}, {"text": "Nothing has felt enjoyable for over a month, even favourite food", "bucket": 1, "why": "Loss of pleasure across life, lasting weeks, is a core sign."}, {"text": "Felt low on a rainy Sunday, better by Monday", "bucket": 0}, {"text": "Wakes at 4 a.m. daily and cannot get back to sleep", "bucket": 1, "why": "Body changes, nearly every day, point beyond sadness."}, {"text": "Missed her grandmother at Diwali and felt teary", "bucket": 0, "why": "Grief tied to reminders, coming in waves, is normal."}, {"text": "Says 'my family would be better off without me'", "bucket": 1, "why": "Self-blame plus a closed future. This also needs a gentle, direct question about safety."}, {"text": "Stopped bathing and eating, stays in bed most days", "bucket": 1}, {"text": "Disappointed about a lost match for an evening", "bucket": 0}]}
:::

:::trap Sadness with a reason can still be depression
A trigger does not rule depression out. A job loss can start a real depressive illness. What matters is the pattern: how long, how wide, how deep, and how much it stops the person. Equally, having no reason does not make it "fake".
:::

:::widget flow
{"title": "Four questions, in order", "layout": "chain", "nodes": [{"id": "a", "label": "How long?", "detail": "Ordinary sadness passes in hours or days. Depression is there most of the day, nearly every day, for a long stretch."}, {"id": "b", "label": "How wide?", "detail": "Sadness is about one thing. In depression, everything turns grey, even things the person used to love."}, {"id": "c", "label": "How deep?", "detail": "Sadness stays in the feelings. Depression reaches the body: sleep, appetite, energy and speed of movement."}, {"id": "d", "label": "Does it stop life?", "detail": "Sad people still study, work and meet friends. In depression these start to fall apart."}, {"id": "e", "label": "Talk to a professional", "detail": "If the answers point to 'long, wide, deep and stopping life', the kind next step is a proper assessment, not a label from a friend."}], "edgeLabels": {"a>b": "then", "b>c": "then", "c>d": "then", "d>e": "if yes to most"}, "caption": "Press Play. Ask the questions in this order and you will rarely confuse a bad week with an illness."}
:::

:::recall
1. What three words describe how depression differs from sadness? || Longer, wider, deeper (and it stops the person functioning).
2. Give two thinking changes common in depression. || Turning against the self (guilt, worthlessness) and a closed future (hopelessness).
3. Does a clear trigger rule out depression? || No. Judge the pattern, not whether there was a reason.
:::

:::mcq
Q: Which detail most suggests depression rather than ordinary sadness?
- She cried at a sad film
- She felt low after an argument with her mother
- *Nothing has felt enjoyable for many weeks, and she has stopped meeting friends
- She was upset that her exam was postponed
> Loss of pleasure across life, lasting a long time and stopping her normal life, is the core of depression.

Q: Kabir, 45, lost his job a month ago. He now sleeps poorly, has lost weight, and feels worthless every day. His wife says, "It's natural, he has a reason." The best view is:
- She is right; a reason means it is not depression
- *A trigger does not rule out depression; he needs an assessment
- He should just find a new job
- It can only be depression if there is no reason
> Depression often follows stress. The pattern (daily, body changes, worthlessness) is what counts.
:::

## 0.3 What a diagnosis is, and what it is not [core][starting]
A diagnosis is an **agreed name for a pattern**. Clinicians across the world have agreed that a certain cluster of experiences, lasting a certain time and causing a certain amount of trouble, will be called "major depressive disorder". The name lets them talk to each other clearly.

### Why we bother with names
- **Communication.** A doctor in Chennai and one in Toronto mean the same thing.
- **Prediction.** A name carries knowledge about the usual course: how long it lasts and whether it returns.
- **Treatment.** Research tells us what helps each pattern.
- **Access.** Insurance, sick leave and services often need a diagnosis.
- **Research.** Studies need everyone to measure the same thing.

### The two rulebooks
There are two main systems.
- **DSM-5-TR**, from the American Psychiatric Association (the current text revision appeared in 2022). It is widely used in teaching, research and exams.
- **ICD-11**, from the World Health Organization, used for official health records around the world, including India.

They mostly agree. Where they differ, this module adds a short "ICD-11 says" note.

### How the rules work
Each diagnosis has **criteria**: a list of symptoms, a minimum number of them, a minimum length of time, and a rule that the problem must cause real distress or trouble in life. There are also **exclusions**: other causes that must be ruled out first, such as a medicine or a thyroid problem.

Think of criteria like a cut-off mark. Real life is a slope, not a staircase. People just below the line can still suffer and need help. The line exists so that different clinicians make the same call.

:::widget reveal
{"prompt": "Why does a diagnosis of depression need a minimum length of time, and not just a list of symptoms?", "answer": "Because nearly everyone has a few bad days with poor sleep, low energy and sadness. A time rule separates a passing rough patch from an illness that has taken hold. Without it, half the population would be diagnosed after one hard week."}
:::

### What a diagnosis is not
- **Not a blood test.** In psychiatry the diagnosis is made by careful interview and observation. Tests are used to rule out body causes.
- **Not a cause.** "Depression" describes the pattern. It does not say why it happened. That is a separate question (the formulation, later in this module).
- **Not a judgement of character.** Depression is not laziness or weakness.
- **Not an identity.** Say "a person with depression", not "a depressive". Most people recover.

### Who makes the diagnosis
In India, psychiatrists and licensed clinical psychologists (registered with the Rehabilitation Council of India) assess and diagnose. As a student you will learn the criteria in depth, but you should never diagnose friends or family. You can listen, notice, and encourage them to see a professional.

:::widget decide
{"scene": "Your classmate Sana shows you her phone. She took an online quiz that says 'severe depression'. She looks scared and asks, 'So I have depression, right? You study psychology.'", "ask": "What do you say?", "choices": [{"label": "'Yes, that score means severe depression. You should start medicine.'", "verdict": "harm", "outcome": "Sana panics and searches for tablets online.", "why": "A screening quiz is not a diagnosis, and a student should never diagnose or suggest medicines."}, {"label": "'Those quizzes are rubbish. You're fine.'", "verdict": "harm", "outcome": "Sana feels dismissed and stops talking about it.", "why": "The quiz may be picking up real distress. Brushing it off closes the door."}, {"label": "'I can't diagnose you, but I'm glad you told me. How have you been feeling? A proper check with a professional would really help.'", "verdict": "best", "outcome": "Sana talks for twenty minutes, then agrees to book an appointment at the college counselling centre.", "why": "You took her seriously, stayed in your role, listened, and pointed her to someone who can assess her properly."}]}
:::

:::widget flow
{"title": "How a diagnosis gets made", "layout": "chain", "nodes": [{"id": "a", "label": "Listen to the story", "detail": "The clinician hears what has changed, in the person's own words, and from the family where helpful."}, {"id": "b", "label": "Count the symptoms", "detail": "Which experiences from the agreed list are present, and are they new or clearly worse?"}, {"id": "c", "label": "Check the time rule", "detail": "Have they lasted long enough, most days? A rough few days does not count."}, {"id": "d", "label": "Check the impact", "detail": "Do they cause real distress or stop the person living their life?"}, {"id": "e", "label": "Rule out other causes", "detail": "A medicine, alcohol, a thyroid problem or another illness can look like depression. These are checked first."}, {"id": "f", "label": "Give the name", "detail": "Only now is the label used. It names the pattern. Explaining why it happened is a separate step."}], "caption": "No blood test or scan appears in this chain. Tests are used only to rule out body causes."}
:::

:::recall
1. What is a diagnosis, in one line? || An agreed name for a pattern of experiences, with rules for when to use it.
2. Name the two main diagnostic systems. || DSM-5-TR (American Psychiatric Association) and ICD-11 (World Health Organization).
3. Give four parts of a typical set of criteria. || A symptom list, a minimum number, a minimum duration, real distress or impairment (plus exclusions).
4. Name three things a diagnosis is not. || Not a blood test, not a cause, not a judgement of character (and not an identity).
:::

:::mcq
Q: Which statement about a psychiatric diagnosis is TRUE?
- It is confirmed by a brain scan
- *It names a pattern; finding the cause is a separate step
- It means the person has a weak personality
- It is permanent
> A diagnosis describes; the formulation explains. Most people with depression recover.
:::

## 0.4 How common it is, and who it touches [core][starting]
Depression is one of the most common health problems in the world. The World Health Organization estimates that around 280 million people live with it, and it is a leading cause of disability. It affects students, farmers, homemakers, executives, children and grandparents.

:::widget guess
{"prompt": "In a large US survey, out of every 100 adults, how many have major depression in a single year?", "min": 0, "max": 30, "unit": "in 100", "answer": [6, 8], "reveal": "About 7 in 100 adults in one year. Rates among people aged 18 to 29 are about three times those in people over 60. Rates differ a lot between countries, partly because of how people describe distress and how surveys ask.", "clinician": "DSM-5-TR gives a 12-month prevalence of about 7% in the US, roughly threefold higher at 18 to 29 than at 60 and over, with eight- to ninefold variation across world regions."}
:::

:::widget guess
{"prompt": "From the teenage years onwards, how many times more common is depression in women than in men?", "min": 1, "max": 5, "step": 0.5, "unit": "times", "answer": [1.5, 2.5], "reveal": "About twice as common. The gap opens in adolescence and is widest between puberty and menopause. Hormones, social pressures, violence and caring burdens all play a part. Men are less likely to report it and more likely to drink or become irritable instead."}
:::

### In India
India's National Mental Health Survey found depression among the most common mental disorders, and found that **most people with it never received any treatment**. This "treatment gap" is driven by stigma, shortage of professionals, cost, and the fact that many people do not see their suffering as a health problem.

Distress in India is often described through the body: aches, burning, weakness ("kamzori"), "gas", heaviness in the head. People may call it "tension". Families may blame stress, nazar (the evil eye), or the person's attitude. A good clinician listens to these words and then gently asks about mood, interest, sleep and hope.

:::widget layers
{"title": "Risk sits in rings around a person", "shape": "rings", "layers": [{"label": "The person", "detail": "Genes from a parent with depression, a long-term illness such as diabetes or pain, the months after childbirth."}, {"label": "Family and home", "detail": "Loss of a loved one, conflict, violence at home, long caring duties, no one to confide in."}, {"label": "Community", "detail": "Stigma ('pagal'), debt, exam pressure, unemployment, being new to a city."}, {"label": "Society", "detail": "Poverty, discrimination, and too few trained professionals, which keeps the treatment gap wide."}], "caption": "Tap from the centre outwards. Most people who become depressed have strain in more than one ring."}
:::

### Who is at higher risk
- People with a close relative who has had depression.
- People facing loss, humiliation, debt, violence at home, or long caring duties.
- People with long-term physical illness (diabetes, heart disease, pain).
- Women after childbirth.
- People who are isolated, or without a person they can confide in.

:::widget sort
{"prompt": "Myth or fact? Place each statement.", "buckets": ["Myth", "Fact"], "items": [{"text": "Depression is a sign of a weak character", "bucket": 0, "why": "It affects strong, successful people. It is an illness, not a flaw."}, {"text": "Talking about suicide puts the idea in someone's head", "bucket": 0, "why": "Asking directly and kindly does not increase risk. It often brings relief."}, {"text": "Many people with depression first complain of body pain", "bucket": 1}, {"text": "Antidepressants are addictive like sleeping pills", "bucket": 0, "why": "They do not cause craving or a need for higher doses, though stopping suddenly can cause unpleasant symptoms."}, {"text": "Most people with depression recover", "bucket": 1}, {"text": "Children cannot get depressed", "bucket": 0, "why": "They can. In children it often shows as irritability, school problems or stomach aches."}, {"text": "Depression can return after recovery", "bucket": 1, "why": "That is why treatment continues for some time after a person feels well."}, {"text": "If you have a good life, you can't be depressed", "bucket": 0}]}
:::

:::recall
1. Roughly how many people worldwide live with depression? || About 280 million (WHO estimate).
2. What is the treatment gap? || The large share of people with a disorder who get no treatment.
3. How is distress often described in Indian clinics? || Through the body: aches, weakness, gas, heaviness, "tension".
4. Name four groups at higher risk. || Family history, major loss or stress, chronic physical illness, after childbirth, isolation.
:::

:::mcq
Q: Ramesh, a 52-year-old farmer from Vidarbha, visits a clinic three times for "body pain and weakness". All tests are normal. What is the most useful next step for the doctor?
- Prescribe a stronger painkiller
- Tell him nothing is wrong
- *Ask gently about his mood, interest, sleep, worries and hope
- Refer him for a brain scan
> Body complaints are a common way of expressing depression in India. Asking about mood opens the door.
:::

## 0.5 What helps, and how to be a good first listener [core][starting]
The most important fact about depression is hopeful: **it is treatable, and most people recover**. Treatment works on the same four places mood lives: feeling, thinking, body and doing.

### The main kinds of help
- **Talking therapies.** A trained therapist helps the person spot and test harsh thoughts, rebuild daily activity, solve problems or mend relationships. These work well, especially for mild to moderate depression.
- **Medicines (antidepressants).** These help especially in moderate and severe depression. They are not "happy pills": they do not make a well person euphoric. They do not change personality. They are not addictive in the way sleeping pills are, but they should be stopped slowly with a doctor's advice.
- **Daily life.** Regular sleep, movement, sunlight, meals and small pleasant tasks all support recovery.
- **People.** A trusted person to talk to is one of the strongest protections there is.
- **Hospital care and other treatments** for the most severe cases, which you will meet in the Beginner level.

:::widget flow
{"title": "Why doing less keeps low mood going", "layout": "cycle", "nodes": [{"id": "a", "label": "Low mood", "detail": "Everything feels heavy and pointless."}, {"id": "b", "label": "Do less", "detail": "Skip college, stop calling friends, stay in bed. It feels like rest."}, {"id": "c", "label": "Fewer good moments", "detail": "No laughter with friends, no small wins, no sunlight. Life gives back less."}, {"id": "d", "label": "Feel worse", "detail": "With fewer good moments the mood sinks further, and doing anything feels even harder."}], "caption": "The circle can be broken anywhere. Small, planned steps (a short walk, one phone call) are one of the simplest ways out. You will learn the full version of this loop in the Beginner level."}
:::

### Being a good first listener
You do not need to fix anyone. You need to be safe, kind and clear.
1. **Make time.** Put the phone away. Sit at the same level.
2. **Listen more than you talk.** "Tell me more." "That sounds really hard."
3. **Don't rush to cheer them up.** "Sab theek ho jayega" (everything will be fine) can feel like a closed door.
4. **Ask about safety, directly.** If someone seems hopeless, ask, "Sometimes when people feel this low, they think about ending their life. Has that happened to you?" Asking does not plant the idea.
5. **Point to proper help.** Offer to help them book an appointment or go with them.
6. **Look after yourself.** You are not their therapist. Tell a trusted adult or teacher if you are worried about their safety.

:::widget decide
{"scene": "Late at night your cousin Dev, 19, texts: 'I'm so tired of everything. Nothing is ever going to get better. What's even the point.'", "ask": "What is your best first reply?", "choices": [{"label": "'Don't think like that! You have so much to live for. Go to sleep, you'll feel better tomorrow.'", "verdict": "harm", "outcome": "Dev replies 'ok' and goes quiet. You have no idea if he is safe.", "why": "Cheering up and closing the chat shuts down the conversation at the moment he reached out."}, {"label": "'I'm really glad you told me. That sounds heavy. When you say what's the point, are you having thoughts of ending your life?'", "verdict": "best", "outcome": "Dev says he has had passing thoughts but no plan. You keep talking, and he agrees you will both tell his mother in the morning and see a doctor.", "why": "You thanked him, stayed with the feeling and asked directly about suicide. That opened a safe, honest conversation and a plan for help. If he had a plan or means at hand, you would get urgent help that night."}, {"label": "'Bro, everyone feels like that in exam season. Chill.'", "verdict": "ok", "outcome": "Dev sends a laughing emoji. The topic changes.", "why": "It is friendly, but it treats hopelessness as normal and misses the chance to ask about safety."}]}
:::

:::note This is a place to learn
This platform teaches you about mental health. It is not a help service. If you or someone you know is struggling, please talk to a doctor, a counsellor or a trusted adult.
:::

:::widget layers
{"title": "What helps, from the ground up", "shape": "pyramid", "layers": [{"label": "Hospital care and specialist treatments", "detail": "For the most severe or unsafe situations. Few people need this level."}, {"label": "Medicines", "detail": "Most useful in moderate and severe depression, alongside talking help."}, {"label": "Talking therapies", "detail": "A trained therapist helps with harsh thoughts, daily activity, problems and relationships."}, {"label": "Daily life and people", "detail": "Sleep, meals, movement, sunlight and a person to talk to. Everyone needs this base, whatever else they receive."}], "caption": "Tap each level. The wide base is for everyone; each level above is added when it is needed."}
:::

:::recall
1. What is the most hopeful fact about depression? || It is treatable and most people recover.
2. Name three myths about antidepressants. || They are happy pills, they change personality, they are addictive like sleeping pills.
3. Give the six steps of being a good first listener. || Make time, listen, don't rush to cheer up, ask directly about safety, point to help, look after yourself.
:::

:::mcq
Q: A friend says she feels hopeless. Which question is most helpful to ask?
- "Why are you being so negative?"
- *"Are you having thoughts of ending your life?"
- "Have you tried yoga?"
- "Isn't everyone stressed?"
> Asking directly and kindly about suicide is safe and helps you know how urgent things are.
:::

## 0.6 Level check · Starting [starting]
Twelve or more right out of fifteen (80%) opens the Beginner level. If you already know this, take it now to skip ahead.

:::mcq
Q: Which best describes mood?
- A short burst of feeling lasting minutes
- *A slower background state lasting days or longer
- A personality trait that never changes
- A thought about the future
> Emotions are short waves; mood is the background colour over days.

Q: Which is a sign of a healthy mood?
- It never changes
- *It reacts to good and bad events and then recovers
- It stays high all the time
- It stays low after every setback
> Healthy mood moves and comes back.

Q: Mood shows up in feeling, thinking, doing and:
- Hair colour
- *The body (sleep, appetite, energy)
- Height
- Handwriting only
> Body changes are a key part of depression.

Q: Which feature most separates depression from ordinary sadness?
- Crying
- Having a reason
- *A long, wide change that stops normal life
- Feeling upset after bad news
> Longer, wider, deeper, and it stops the person functioning.

Q: "Mann nahi lagta" most often describes:
- Anger
- *Loss of interest or pleasure
- Fear
- Excess energy
> Loss of interest is one of the two core signs of a depressive episode.

Q: A clear trigger, such as losing a job:
- Rules out depression
- *Can start a real depression; the pattern decides
- Means it is always grief
- Means no treatment is needed
> Stress often comes before depression.

Q: A diagnosis is best described as:
- A blood test result
- *An agreed name for a pattern, with rules for its use
- The cause of an illness
- A judgement about character
> It names; the formulation explains.

Q: Which is the World Health Organization's diagnostic system?
- DSM-5-TR
- *ICD-11
- PHQ-9
- MSE
> DSM-5-TR is from the American Psychiatric Association.

Q: Why do diagnostic criteria include a minimum time?
- To delay treatment
- *To separate a passing rough patch from an illness that has taken hold
- Because doctors are busy
- So that only adults are diagnosed
> Everyone has bad days; the time rule keeps the diagnosis meaningful.

Q: In Indian clinics, depression is often first described as:
- Hearing voices
- *Body pain, weakness or "gas"
- Excess happiness
- Memory loss only
> Body complaints are a common doorway; ask about mood.

Q: Which statement about antidepressants is TRUE?
- They make anyone euphoric
- They change personality
- *They are not addictive like sleeping pills, but should be stopped slowly
- They work the same day
> Stopping suddenly can cause unpleasant symptoms, so a doctor guides the taper.

Q: Asking someone directly about suicidal thoughts:
- Plants the idea
- Should be avoided
- *Is safe and helps judge how urgent things are
- Is only for police
> This is one of the most important myths to unlearn.

Q: Your friend's online quiz says "severe depression". The best response is to:
- Confirm the diagnosis
- Suggest a medicine
- *Listen, and encourage a proper assessment by a professional
- Tell her quizzes are meaningless
> Stay in your role: listen and point to help.

Q: Depression is about how many times more common in women than men, from adolescence?
- The same
- *About twice
- Ten times
- It is only seen in men
> The gap opens in the teenage years.

Q: The most hopeful fact about depression is that:
- It always goes away on its own
- *It is treatable and most people recover
- It only affects the rich
- It never returns
> Recovery is the rule, though it can return, so follow-up matters.
:::

# Part I · Diagnosis

## 1.1 The depressive disorders at a glance [core][beginner]
All depressive disorders share one thing: **sad, empty or irritable mood, with changes in the body and in thinking, that clearly affect the person's life**. They differ in how long they last, when they happen and what causes them.

| Disorder | The core idea | Key rule |
|---|---|---|
| Major depressive disorder (MDD) | One or more major depressive episodes, and never a manic or hypomanic episode | 5 of 9 symptoms, most of the day, nearly every day, for the minimum episode length (you will guess it in 1.2) |
| Persistent depressive disorder | Long-lasting depression, often milder | Depressed mood most days for at least 2 years (1 year in children and teenagers) |
| Premenstrual dysphoric disorder (PMDD) | Severe mood symptoms tied to the menstrual cycle | At least 5 symptoms in the days before menses, easing soon after it starts |
| Disruptive mood dysregulation disorder (DMDD) | Children with constant irritability and frequent severe temper outbursts | Outbursts 3 or more times a week for 12 months or more; onset before 10 |
| Substance or medication-induced depressive disorder | Depression caused by a drug, alcohol or a medicine | Begins during or soon after use or withdrawal |
| Depressive disorder due to another medical condition | Depression caused directly by a body illness | Evidence the illness causes it (for example hypothyroidism, stroke) |

:::trap The bipolar question comes first
A single past manic or hypomanic episode changes the diagnosis to a **bipolar disorder**. Always ask about past highs before you call it depression. It changes treatment: an antidepressant alone can tip a person with bipolar disorder into mania.
:::

:::note ICD-11 says
ICD-11 splits the same ground into single episode depressive disorder, recurrent depressive disorder and dysthymic disorder. It also keeps **mixed depressive and anxiety disorder** for people with both sets of symptoms below full threshold, a category DSM-5-TR does not have. ICD-11 has no DMDD (it uses a "chronic irritability-anger" specifier on oppositional defiant disorder instead) and places PMDD in the gynaecology chapter, with a cross-reference.
:::

:::widget sort
{"prompt": "Which diagnosis fits best? Place each short story.", "buckets": ["Major depressive disorder", "Persistent depressive disorder", "Not a depressive disorder: think bipolar"], "items": [{"text": "Two clear episodes of severe low mood with good years in between, never any highs", "bucket": 0}, {"text": "'I've felt low and tired most days for as long as I can remember, at least three years'", "bucket": 1}, {"text": "Low mood now, and last year a week of no sleep, big plans and heavy spending", "bucket": 2, "why": "Any past mania or hypomania makes it bipolar."}, {"text": "First-ever episode: low mood, no interest, poor sleep, guilt for over a month", "bucket": 0}, {"text": "Mild, constant gloom and low self-esteem for 2 years, never fully well for long", "bucket": 1}, {"text": "Recurrent depressions plus a few days of feeling 'supercharged' that his wife noticed", "bucket": 2, "why": "Short highs that others notice may be hypomania. Ask carefully."}]}
:::

:::widget flow
{"title": "Which depressive disorder? A first sort", "layout": "tree", "nodes": [{"id": "root", "label": "Low, empty or irritable mood that affects life", "detail": "Start here, then ask the questions below in order. The first 'yes' usually decides."}, {"id": "bp", "parent": "root", "label": "Ever a manic or hypomanic episode?", "detail": "Yes: this is a bipolar disorder, not a depressive disorder. Ask the patient and the family."}, {"id": "sec", "parent": "root", "label": "Caused by a substance, medicine or body illness?", "detail": "Yes: substance or medication-induced depressive disorder, or depressive disorder due to another medical condition."}, {"id": "pdd", "parent": "root", "label": "Low most days for years?", "detail": "Persistent depressive disorder, with or without full episodes on top."}, {"id": "pmdd", "parent": "root", "label": "Tied to the menstrual cycle?", "detail": "Premenstrual dysphoric disorder, confirmed with daily ratings over two cycles."}, {"id": "dmdd", "parent": "root", "label": "A child with constant irritability and frequent outbursts?", "detail": "Disruptive mood dysregulation disorder, onset before 10."}, {"id": "mdd", "parent": "root", "label": "None of these, and a full episode is present", "detail": "Major depressive disorder, single or recurrent."}], "caption": "The bipolar question always comes first, because it changes treatment the most."}
:::

:::recall
1. What do all depressive disorders share? || Sad, empty or irritable mood with body and thinking changes that impair life.
2. What single history finding changes the diagnosis to bipolar disorder? || Any past manic or hypomanic episode.
3. Name two categories ICD-11 handles differently from DSM-5-TR. || Mixed depressive and anxiety disorder (ICD-11 only); DMDD (absent in ICD-11); PMDD (gynaecology chapter).
:::

:::mcq
Q: A woman has had low mood most days for 3 years, with poor sleep and low self-esteem. She has never been high. Most likely:
- Major depressive disorder, single episode
- *Persistent depressive disorder
- Adjustment disorder
- Cyclothymia
> Two years or more of depressed mood, more days than not.
:::

## 1.2 The major depressive episode [core][beginner]
The **major depressive episode** is the building block of most depressive diagnoses. Learn it exactly.

:::widget guess
{"prompt": "How long must the symptoms last, at minimum, to count as a major depressive episode?", "min": 0, "max": 8, "unit": "weeks", "answer": [2, 2], "reveal": "At least 2 weeks, most of the day, nearly every day. Shorter bad patches, however painful, do not meet the rule.", "clinician": "DSM-5-TR criterion A: five or more symptoms present during the same 2-week period, representing a change from previous functioning. ICD-11 uses the same minimum."}
:::

:::define Criterion A
**Five or more** of the nine symptoms below, present during the same period (at least the minimum you just guessed), most of the day, nearly every day, and a **change** from the person's usual self. **At least one** must be (1) depressed mood or (2) loss of interest or pleasure.
:::

| # | Symptom | What it looks like |
|---|---|---|
| 1 | Depressed mood | Sad, empty, hopeless, tearful. In children and teenagers it can be **irritable** mood |
| 2 | Markedly less interest or pleasure | "Mann nahi lagta". Stops hobbies, prayer, time with family |
| 3 | Weight or appetite change | Loss or gain; more than 5% of body weight in a month, or appetite change nearly every day |
| 4 | Insomnia or sleeping too much | Classically waking early and lying awake |
| 5 | Slowed down or agitated | **Seen by others**, not just felt inside |
| 6 | Fatigue or loss of energy | "Kamzori", "no strength" |
| 7 | Worthlessness or excessive guilt | Can reach delusional guilt |
| 8 | Poor concentration or indecision | Marks fall; cannot finish a page |
| 9 | Recurrent thoughts of death, suicidal thoughts, a plan or an attempt | More than fear of dying |

The other criteria:
- **B**: clinically significant distress or impairment.
- **C**: not caused by a substance or another medical condition.
- **D**: not better explained by a psychotic disorder such as schizoaffective disorder or schizophrenia.
- **E**: there has **never** been a manic or hypomanic episode.

:::mnemonic SIG E CAPS, plus mood
Depressed mood, then **S**leep, **I**nterest, **G**uilt, **E**nergy, **C**oncentration, **A**ppetite, **P**sychomotor, **S**uicide. Nine in all. Five needed. Mood or interest must be one of them.
:::

:::widget build
{"vignette": "Meera, 34, a bank clerk in Ahmedabad, comes with her husband. For over a month she has felt 'heavy and sad' most of the day. She has stopped watching her favourite serials and no longer enjoys cooking for festivals. She wakes at 3 a.m. and cannot sleep again. She has lost 4 kg without trying. She says she is 'a useless mother'. She makes mistakes at work because she cannot focus. Her husband says she moves and speaks slowly. She denies any thoughts of death. Her thyroid test was normal last week. She has never had a period of unusual high mood.", "rule": "Tick every symptom present in the story. A major depressive episode needs 5 or more, including depressed mood or loss of interest.", "symptoms": [{"label": "Depressed mood", "present": true, "core": true}, {"label": "Loss of interest or pleasure", "present": true, "core": true, "why": "Serials and cooking no longer enjoyed."}, {"label": "Weight or appetite change", "present": true, "why": "4 kg lost without trying."}, {"label": "Sleep change", "present": true, "why": "Early waking at 3 a.m."}, {"label": "Psychomotor slowing or agitation", "present": true, "why": "Her husband observes it, which is what the rule needs."}, {"label": "Fatigue or loss of energy", "present": false, "why": "Not described. Don't assume it; ask."}, {"label": "Worthlessness or guilt", "present": true, "why": "'A useless mother.'"}, {"label": "Poor concentration", "present": true, "why": "Mistakes at work."}, {"label": "Thoughts of death or suicide", "present": false, "why": "She denies them. Keep asking at every visit."}], "need": 5, "needCore": true, "verdict": "Seven symptoms, both core ones present, lasting over a month, causing impairment, thyroid normal, and no past highs. Criteria for a major depressive episode are met. Next: specify severity and features (early waking and weight loss hint at melancholic features), and ask about risk again."}
:::

### Severity and course
- **Severity**: mild, moderate or severe, judged by the number of symptoms, how intense they are and how much they impair life.
- **Course**: single episode, or **recurrent** (episodes separated by at least 2 months in a row without meeting criteria).
- **Remission**: partial (some symptoms remain, or well for less than 2 months) or full (no significant symptoms for 2 months).

:::clinician
### Counting rules that catch people out
- Count a symptom only if it is **new or clearly worse** than the person's usual state. Lifelong poor sleep does not count unless it has worsened.
- Do not count symptoms **clearly due to a medical condition** (for example weight loss from uncontrolled diabetes), but do not discount everything in the physically ill: lean on mood, interest, guilt and hopelessness.
- "Nearly every day" matters. A symptom on two days out of fourteen does not count.
- Psychotic symptoms do not count towards the nine, but give the "with psychotic features" specifier.
- Suicidal thinking counts whether passive ("I wish I wouldn't wake up") or active.
- Code the diagnosis as MDD, single or recurrent, with current severity, then specifiers. Example: "MDD, recurrent episode, moderate, with anxious distress".
:::

:::note ICD-11 says
ICD-11 lists **ten** symptoms in three clusters (affective, cognitive-behavioural, neurovegetative). It adds **hopelessness about the future** as a separate symptom. At least five are needed, including depressed mood or loss of interest, over the same minimum period as DSM-5-TR.
:::

:::widget flow
{"title": "Criteria A to E, as a checklist", "layout": "chain", "nodes": [{"id": "a", "label": "A: five of nine", "detail": "At least five symptoms in the same period, nearly every day, including depressed mood or loss of interest."}, {"id": "b", "label": "B: it matters", "detail": "Clinically significant distress or trouble at work, study, home or with people."}, {"id": "c", "label": "C: not a substance or illness", "detail": "Not explained by alcohol, drugs, a medicine or a medical condition such as hypothyroidism."}, {"id": "d", "label": "D: not a psychotic disorder", "detail": "Not better explained by schizophrenia, schizoaffective disorder or a related condition."}, {"id": "e", "label": "E: never high", "detail": "No past manic or hypomanic episode. If there was one, think bipolar."}], "edgeLabels": {"a>b": "and", "b>c": "and", "c>d": "and", "d>e": "and"}, "caption": "All five links must hold. Most exam errors come from forgetting C and E."}
:::

:::recall
1. State criterion A for a major depressive episode exactly. || Five or more of nine symptoms in the same window, nearly every day, a change from before, at least one being depressed mood or loss of interest.
2. What does criterion E exclude? || Any past manic or hypomanic episode.
3. In children, what can replace depressed mood? || Irritable mood.
4. What separates a recurrent episode from a continuation of the last one? || At least 2 months in a row not meeting criteria between them.
5. Must psychomotor change be felt or observed? || Observed by others.
:::

:::mcq
Q: A man has had low mood, poor sleep, guilt and tiredness for 10 days after losing his job. His concentration is poor. Does he meet criteria for a major depressive episode?
- Yes, he has five symptoms
- *Not yet: it has not lasted long enough
- Yes, any stressor counts
- No, because there is a trigger
> The minimum duration is not yet met. A trigger does not rule out depression.

Q: Which symptom does NOT count towards the nine?
- Early morning waking
- Indecision
- *Hearing a voice saying "you are a sinner"
- Passive death wishes
> Psychotic symptoms add the "with psychotic features" specifier; they are not one of the nine.
:::

## 1.3 Specifiers: the shape of this episode [core][beginner]
Two people can both have major depression and look very different. **Specifiers** describe the shape of the episode. They matter because they change the risk, the treatment and what to watch for.

### Melancholic and atypical features
These two are near-opposites, and exam questions love the contrast.

| Feature | Melancholic | Atypical |
|---|---|---|
| Core | Loss of pleasure in all or almost all activities, **or** no mood reactivity (does not brighten even briefly when good things happen) | **Mood reactivity** kept (brightens with good news) |
| Plus | 3 or more of: a distinct quality of despair or empty mood; worse in the **morning**; **early waking** (at least 2 hours early); marked psychomotor change; marked loss of appetite or weight; excessive guilt | 2 or more of: more appetite or weight gain; **sleeping too much**; **leaden paralysis** (heavy arms and legs); long-standing **sensitivity to rejection** |
| Sleep | Early waking | Too much sleep |
| Appetite | Loss | Gain |
| Notes | Commoner in inpatients and with psychosis; responds well to physical treatments such as ECT | "Atypical" is a historical name, not rare. Commoner in women and in bipolar depression |

:::sounds How it sounds
- Melancholic: "Subah 3-4 baje neend khul jaati hai, phir bas padha rehta hoon. Subah sabse bura lagta hai." (I wake at 3 or 4 and just lie there. Mornings are the worst.)
- Atypical: "Bas sota rehta hoon, haath-pair bhaari lagte hain. Koi kuch keh de toh bahut bura lag jaata hai." (I sleep all day, my limbs feel heavy, and I'm crushed if anyone says anything.)
:::

:::widget sort
{"prompt": "Melancholic or atypical? Place each feature.", "buckets": ["Melancholic features", "Atypical features"], "items": [{"text": "Wakes at 4 a.m., two hours before the alarm", "bucket": 0}, {"text": "Sleeps 11 hours and still naps", "bucket": 1}, {"text": "Brightens when her sister visits, then sinks again", "bucket": 1, "why": "Mood reactivity is the core of atypical features."}, {"text": "Nothing at all lifts his mood, not even his son's wedding", "bucket": 0, "why": "No reactivity is a melancholic core feature."}, {"text": "Arms and legs feel like lead for hours", "bucket": 1}, {"text": "Worst in the morning, slightly better by evening", "bucket": 0}, {"text": "Lost 6 kg; food tastes of nothing", "bucket": 0}, {"text": "Eating far more, gained 5 kg", "bucket": 1}, {"text": "Has always been crushed by any hint of rejection", "bucket": 1, "why": "A long-standing trait, present even when not depressed."}, {"text": "Feels guilty about things long past, out of proportion", "bucket": 0}]}
:::

:::widget moodline
{"prompt": "Tanvi, 27, a teacher in Shimla, rated her mood monthly for three years. What pattern do you see?", "series": [0, 0, -0.2, -2.4, -2.7, -2.5, -0.3, 0, 0, -2.5, -2.8, -2.4], "labels": ["Year 1", "Year 2", "Year 3"], "options": ["Random ups and downs", "Episodes that return at the same time each year", "Persistent depressive disorder", "Bipolar disorder"], "answer": 1, "why": "Each dip begins in the same months and lifts at the same time of year, with full recovery in between. If this repeats over at least two years, with no other explanation such as a yearly job loss, it fits a seasonal pattern. Light therapy is one option."}
:::

### The other specifiers
| Specifier | What it means | Why it matters |
|---|---|---|
| With anxious distress | 2 or more of: keyed up; unusually restless; can't concentrate because of worry; fear something awful will happen; fear of losing control | Higher suicide risk, longer illness, poorer response. Rate it |
| With mixed features | 3 or more manic or hypomanic symptoms during most days of the depression | A strong warning sign of future bipolar disorder; be careful with antidepressants alone |
| With psychotic features | Delusions or hallucinations; mood-congruent (guilt, disease, death, nihilism, deserved punishment) or mood-incongruent | Needs an antipsychotic with the antidepressant, or ECT |
| With catatonia | Catatonic signs during most of the episode | Medical emergency risk; benzodiazepines and ECT |
| With peripartum onset | Onset in pregnancy or soon after delivery (guess the window below) | About half of "postnatal" depressions begin before birth |
| With seasonal pattern | Regular onset and remission at particular times of year, over at least 2 years | Light therapy can help |

:::widget guess
{"prompt": "DSM-5-TR's 'peripartum onset' covers pregnancy plus how many weeks after delivery?", "min": 0, "max": 52, "unit": "weeks", "answer": [4, 4], "reveal": "Pregnancy plus the first 4 weeks after delivery. Many clinicians and studies use a wider window, up to a year, because risk stays raised.", "clinician": "DSM-5-TR: onset during pregnancy or in the 4 weeks following delivery. ICD-11 codes mental disorders associated with pregnancy, childbirth or the puerperium if onset is within about 6 weeks after delivery."}
:::

:::trap Baby blues are not depression
"Baby blues" are very common: sudden tearfulness and mood swings in the first days after birth, without loss of function, settling on their own within days. Postpartum depression lasts longer and stops the mother functioning. Postpartum psychosis (confusion, sleeplessness, strange beliefs about the baby) is an emergency.
:::

:::recall
1. What is the core feature of melancholic depression? || Loss of pleasure in almost everything, or no mood reactivity.
2. Give the four associated features of atypical depression. || Weight or appetite gain, hypersomnia, leaden paralysis, rejection sensitivity.
3. How many manic symptoms make "with mixed features"? || Three or more, on most days of the episode.
4. Give five mood-congruent delusional themes. || Inadequacy, guilt, disease, death, nihilism, deserved punishment.
5. Why rate anxious distress? || It raises suicide risk and predicts slower response.
:::

:::mcq
Q: A depressed patient wakes at 4 a.m., feels worst in the morning, has lost weight, and nothing cheers him even briefly. This pattern is:
- Atypical features
- *Melancholic features
- Seasonal pattern
- Mixed features
> Early waking, morning worsening, weight loss, no reactivity.

Q: A 24-year-old with depression sleeps 12 hours, eats more, feels her limbs are heavy, and brightens when friends visit. Which is TRUE?
- These are melancholic features
- *These are atypical features, and past highs should be asked about
- She cannot be depressed if her mood lifts
- Tricyclics are the first choice
> Atypical features are commoner in bipolar depression. Ask about hypomania.
:::

## 1.4 Persistent, premenstrual, childhood and secondary depression; grief [core][beginner]
### Persistent depressive disorder
:::define Criteria
Depressed mood for most of the day, more days than not, for **at least 2 years** (in children and teenagers, mood can be irritable and the minimum is **1 year**), with **2 or more** of: poor appetite or overeating; insomnia or hypersomnia; low energy; low self-esteem; poor concentration or indecision; hopelessness. Never free of symptoms for more than 2 months at a time. Never a manic or hypomanic episode.
:::
- It often starts quietly before 25. The person may think "this is just how I am".
- Full major depressive episodes can occur on top of it (once called "double depression"). Specify, for example, "with intermittent major depressive episodes".
- Untreated, many never fully recover. Treatment (an antidepressant plus therapy) improves the outlook.

:::widget moodline
{"prompt": "Mohan, 42, says, 'I've never really been happy.' Here is his mood over six years. Which description fits?", "series": [-1.1, -1.2, -1.0, -2.7, -2.8, -1.2, -1.1, -1.3, -1.0, -2.6, -1.2, -1.1], "labels": ["Year 1", "Year 3", "Year 5"], "options": ["Recurrent major depression with full recovery", "Persistent low mood with full episodes on top", "Normal mood", "Cyclothymia"], "answer": 1, "why": "His baseline never returns to zero: a long, milder low (persistent depressive disorder). Twice it drops into a full major depressive episode, then comes back to the same grey baseline, not to wellness. This is the old 'double depression'. Treating only the full episodes leaves him at his grey baseline, which is still illness."}
:::

### Premenstrual dysphoric disorder
- In most cycles of the past year: **at least 5 symptoms** in the final days before menses, starting to improve within a few days after onset, and minimal or absent after menses.
- At least one of: marked mood swings, irritability or anger, depressed mood or hopelessness, anxiety or tension.
- Plus others: less interest, poor concentration, low energy, appetite change or cravings, sleep change, feeling overwhelmed, body symptoms (breast tenderness, bloating, joint pain).
- Must be confirmed by **daily ratings over at least 2 cycles**.

### Disruptive mood dysregulation disorder
- Severe temper outbursts, out of proportion, **3 or more times a week**, in at least 2 settings.
- Between outbursts, mood is irritable or angry most of the day, nearly every day.
- Present for at least 12 months; first diagnosed between ages 6 and 18; onset before 10.
- Created partly to stop over-diagnosis of bipolar disorder in irritable children. These children more often develop depression and anxiety than bipolar disorder later.

### Caused by a substance, a medicine or a body illness
| Cause | Examples |
|---|---|
| Substances | Alcohol (heavy use and withdrawal), withdrawal from stimulants, cannabis, sedatives |
| Medicines | Corticosteroids, interferon, isotretinoin, some anti-epileptics, hormonal treatments, efavirenz |
| Medical conditions | Hypothyroidism, Cushing's syndrome, stroke, Parkinson's disease, multiple sclerosis, pancreatic cancer, HIV, anaemia, vitamin B12 deficiency, chronic pain |

### Grief and depression
Grief is love continuing after a loss. It can include sadness, poor sleep and poor appetite. DSM-5 removed the old rule that blocked a depression diagnosis soon after a death, because a real depressive episode can start during grief.

| | Grief | Depression |
|---|---|---|
| Pain | Comes in **waves** with reminders of the person | Pervasive, not tied to reminders |
| Humour and pleasure | Still possible between waves | Lost across life |
| Self-esteem | Kept | Collapses ("I'm worthless") |
| Guilt | About the dead person ("I should have visited more") | General, about the self |
| Thoughts of death | Wishing to join the loved one | Feeling one doesn't deserve to live |

**Prolonged grief disorder** (new in DSM-5-TR) is grief that stays intense and disabling: daily yearning or preoccupation with the dead person, plus other symptoms such as identity disruption, disbelief, avoidance, intense pain, numbness or loneliness, for at least 12 months after the death in adults (6 months in children).

:::note ICD-11 says
ICD-11 also has prolonged grief disorder but sets the minimum at **6 months** after the loss in adults, and asks the clinician to judge against the person's cultural and religious norms.
:::

:::widget sort
{"prompt": "Grief or depression? Place each sign.", "buckets": ["Typical of grief", "Points to depression"], "items": [{"text": "Tears come when she sees her late husband's chair", "bucket": 0}, {"text": "Says 'I am worthless, I deserve nothing'", "bucket": 1}, {"text": "Laughs at old stories about her mother", "bucket": 0}, {"text": "Nothing at all is enjoyable, morning to night", "bucket": 1}, {"text": "Feels guilty she didn't take him to hospital sooner", "bucket": 0, "why": "Guilt focused on the loss is common in grief."}, {"text": "Slowed down, barely speaks, lost 7 kg", "bucket": 1, "why": "Marked slowing and weight loss suggest a depressive episode, even during grief."}]}
:::

:::recall
1. Give the full criteria for persistent depressive disorder. || Depressed mood most days for at least 2 years (1 in youth) plus 2 of 6 symptoms, never symptom-free over 2 months, never manic.
2. How is PMDD confirmed? || Daily ratings over at least 2 cycles.
3. State the age rules for DMDD. || First diagnosed 6 to 18; onset before 10.
4. Name six medical causes of depression. || Hypothyroidism, Cushing's, stroke, Parkinson's, MS, pancreatic cancer, HIV, anaemia, B12 deficiency.
5. Give three differences between grief and depression. || Waves vs pervasive; self-esteem kept vs lost; guilt about the deceased vs general worthlessness.
6. Minimum time for prolonged grief disorder in adults, in DSM-5-TR and ICD-11? || 12 months; 6 months.
:::

:::mcq
Q: A 9-year-old has severe temper outbursts four times a week and is irritable and angry between them, for over a year. Most likely:
- Bipolar disorder
- *Disruptive mood dysregulation disorder
- Persistent depressive disorder
- Normal childhood
> Chronic irritability with frequent severe outbursts, onset before 10.

Q: Three months after her son's death, Mrs Iyer has waves of crying with reminders, laughs at family stories, and keeps her self-esteem. Best description:
- Major depressive episode
- Prolonged grief disorder
- *Normal grief
- Persistent depressive disorder
> Waves, preserved humour and self-esteem, and too early for prolonged grief.
:::

# Part II · Why it happens

## 2.1 The biology at a glance [core][beginner]
No single cause explains depression. Think **vulnerability plus stress**: genes and early experience set the risk; life events and the body pull the trigger. The Advanced level goes deeper into each piece.

### Genes
- First-degree relatives of a person with depression have about 2 to 3 times the risk.
- Twin studies put heritability at roughly a third to a half. Environment matters at least as much.
- Hundreds of genetic variants each add a tiny amount. There is no "depression gene", and no gene test can diagnose it.

### The monoamine idea and its limits
- **The idea**: depression reflects too little signalling by serotonin, noradrenaline and dopamine. Antidepressants raise these; reserpine, which depletes them, could cause low mood.
- **The problem**: the chemistry changes within hours, but mood improves much more slowly. Most depressed people do not have a simple "chemical imbalance" that can be measured. The delay points to slower changes downstream.

:::widget reveal
{"prompt": "If an SSRI raises serotonin in the synapse within hours, why doesn't mood lift the same day?", "answer": "Because mood depends on slower adaptations: receptors adjust, gene activity changes, growth factors such as BDNF rise, and brain connections are rebuilt. The chemistry is the first domino, not the whole effect. This is why patients are asked to keep going through the early days, when side effects may come before benefit."}
:::

:::widget layers
{"title": "Vulnerability plus stress", "shape": "iceberg", "layers": [{"label": "What everyone sees", "detail": "The episode: low mood, poor sleep, withdrawal. It usually begins after a stressor, such as a loss or a humiliation."}, {"label": "Current pressures", "detail": "Debt, conflict, caring duties, illness, no confidant. These lower the threshold."}, {"label": "Early experience", "detail": "Loss of a parent, neglect, abuse or a critical upbringing shape beliefs and tune the stress system."}, {"label": "Genes and biology", "detail": "Many small genetic effects, the stress-hormone system and brain plasticity set how much load a person can carry before an episode starts."}], "caption": "Tap each layer, from the surface down. The trigger is only the visible tip; treatment works on the layers beneath as well."}
:::

:::widget neuron
{"title": "How a neuron fires", "myelinated": true, "caption": "Every idea in this module, from serotonin release to ketamine's glutamate burst, rests on this event. Slide the threshold: a neuron fires fully or not at all. Antidepressants do not make neurons fire 'more strongly'; they change how often they fire and how strongly the message is received."}
:::

### Plasticity, stress hormones and sleep
- **Neuroplasticity.** Chronic stress and depression lower **BDNF**, a growth factor that helps neurons keep and grow connections. The hippocampus (a memory area) is smaller in people with long or repeated depression. Antidepressants, ECT and exercise raise BDNF.
- **The stress system (HPA axis).** The hypothalamus releases CRH, the pituitary releases ACTH, the adrenal glands release **cortisol**. In many depressed people this system is overactive and does not switch off normally.
- **Sleep.** Depression shortens the time before dreaming (REM) sleep starts, increases REM, and reduces deep sleep.
- **Inflammation.** A subgroup has raised inflammatory markers. Depression is common in inflammatory illness.
- **Circuits.** Brain imaging shows overactive alarm areas (amygdala), underactive "brake" areas in the front of the brain, and weaker reward responses (linked to loss of pleasure).

:::widget flow
{"title": "The stress hormone axis (HPA axis)", "layout": "chain", "nodes": [{"id": "a", "label": "Stress", "detail": "A threat, loss or long strain is noticed by the brain."}, {"id": "b", "label": "Hypothalamus: CRH", "detail": "The hypothalamus releases corticotropin-releasing hormone (CRH)."}, {"id": "c", "label": "Pituitary: ACTH", "detail": "CRH tells the pituitary gland to release ACTH into the blood."}, {"id": "d", "label": "Adrenal glands: cortisol", "detail": "ACTH makes the adrenal glands release cortisol, the main stress hormone. In the short term this helps: energy, alertness."}, {"id": "e", "label": "Feedback switch", "detail": "Normally cortisol acts on receptors in the hippocampus and hypothalamus to switch the system off again."}, {"id": "f", "label": "In depression", "detail": "In many depressed people the switch-off is weak. Cortisol stays high, sleep and appetite change, and over time high cortisol harms the hippocampus."}], "edgeLabels": {"a>b": "signals", "b>c": "CRH", "c>d": "ACTH", "d>e": "cortisol", "e>f": "weak brake"}, "caption": "Press Play. The Advanced level adds what this means for memory, plasticity and the dexamethasone test."}
:::

:::widget brainmap
{"title": "Brain areas involved in mood", "focus": ["prefrontal", "amygdala", "hippocampus", "hypothalamus"], "notes": {"prefrontal": "The front of the brain acts like a brake and a planner. It is often underactive in depression, which fits poor concentration and difficulty stopping negative thoughts.", "amygdala": "The alarm centre. It reacts more strongly to sad or threatening faces and words in depression, feeding the negative bias.", "hippocampus": "A memory area that also helps switch off cortisol. It is smaller in people with long or repeated depression, possibly from stress hormones and lower BDNF.", "hypothalamus": "Controls sleep, appetite and the stress hormone axis. Changes here fit the body symptoms of depression."}, "caption": "Tap each highlighted area. No single area 'causes' depression; the trouble is in how they talk to each other."}
:::

:::analogy The signals and the road
Monoamines are the traffic signals; neural connections are the road. Antidepressants fix the signals in hours, but it takes much longer for the repair crew (BDNF and plasticity) to rebuild the damaged road.
:::

:::recall
1. What is the main problem with the simple monoamine idea? || Chemistry changes in hours, but mood improves much more slowly; no measurable "imbalance" in most people.
2. What is BDNF and what happens to it in depression? || A growth factor for neurons; it falls with stress and depression and rises with treatment.
3. Describe the HPA axis finding. || Overactive CRH, ACTH and cortisol, with poor switch-off.
4. Name two sleep changes in depression. || Shorter REM latency, more REM, less deep sleep.
:::

:::mcq
Q: Which finding argues AGAINST the idea that depression is just "low serotonin"?
- SSRIs help many people
- *Reuptake is blocked at once, but mood takes much longer to improve
- Tryptophan depletion can trigger relapse in some recovered patients
- Serotonin is involved in mood
> The delay points to downstream changes, not just transmitter levels.
:::

## 2.2 Psychological and social causes [core][beginner]
### The cognitive model (Beck)
:::define The cognitive triad
Negative views of the **self** ("I am a failure"), the **world** ("nothing works out") and the **future** ("it will always be like this").
:::
- Early experiences build **core beliefs** (schemas), such as "I am unlovable" or "I must be perfect to be accepted".
- A stressful event switches the belief on, producing **negative automatic thoughts**.
- These thoughts follow predictable thinking errors, which keep the low mood going.

| Thinking error | Example |
|---|---|
| All-or-nothing | "If I don't top, I've failed completely." |
| Overgeneralising | "I failed one test, so I fail at everything." |
| Mental filter | Remembering only the one criticism in a day of praise |
| Catastrophising | "My boss frowned; I'll be fired." |
| Personalising | "My parents fight because of me." |
| Should statements | "I should never feel this way." |
| Mind reading | "Everyone thinks I'm useless." |

:::widget sort
{"prompt": "Name the thinking error in each thought.", "buckets": ["All-or-nothing", "Mind reading", "Catastrophising"], "items": [{"text": "'Unless I get 100% I'm a total failure.'", "bucket": 0}, {"text": "'My friends didn't reply fast. They must hate me now.'", "bucket": 1}, {"text": "'This headache is surely a brain tumour.'", "bucket": 2}, {"text": "'If the marriage proposal falls through, my life is over.'", "bucket": 2}, {"text": "'The teacher looked at me. She thinks I'm stupid.'", "bucket": 1}, {"text": "'Either I'm the perfect daughter or I'm worthless.'", "bucket": 0}]}
:::

:::widget flow
{"title": "Beck's cognitive model, step by step", "layout": "chain", "nodes": [{"id": "a", "label": "Early experience", "detail": "For example, a parent who praised only top marks."}, {"id": "b", "label": "Core belief", "detail": "A deep, quiet belief forms: 'I am only acceptable if I succeed.'"}, {"id": "c", "label": "Rules for living", "detail": "'If I fail, people will reject me.' These rules keep the person safe while things go well."}, {"id": "d", "label": "Critical incident", "detail": "A failure that fits the belief: a lost job, a failed interview."}, {"id": "e", "label": "Negative automatic thoughts", "detail": "Quick, believable thoughts pop up: 'I'm useless', 'everyone is laughing at me'. They follow the triad: self, world, future."}, {"id": "f", "label": "Symptoms", "detail": "Low mood, withdrawal, poor sleep and poor concentration follow, and these seem to prove the thoughts true."}], "caption": "The early stages can lie quiet for years. CBT works mostly on the last three boxes first, then on the rules and beliefs."}
:::

### The behavioural model
- Low mood leads to **withdrawal**. Withdrawal removes rewarding experiences. Fewer rewards deepen low mood (Lewinsohn). This loop is broken by **behavioural activation**: act first, mood follows.
- **Learned helplessness** (Seligman): repeated uncontrollable bad events teach that action is pointless. Later reworked as a hopeless way of explaining events: internal ("it's me"), stable ("always"), global ("everything").

:::widget flow
{"title": "The depressive maintenance cycle", "layout": "cycle", "nodes": [{"id": "a", "label": "Negative thoughts (the triad)", "detail": "'I'm a failure, nothing works, it will always be like this.'"}, {"id": "b", "label": "Low mood", "detail": "The thoughts feel like facts, so mood drops further."}, {"id": "c", "label": "Rumination", "detail": "Going over 'why me, why did I fail' again and again. It feels like problem-solving but solves nothing and deepens the low."}, {"id": "d", "label": "Withdrawal and avoidance", "detail": "Staying in the room, not answering calls, skipping classes. This feels protective."}, {"id": "e", "label": "Fewer rewards, less evidence against", "detail": "No good moments, no chance to see that friends care. The beliefs go unchallenged and seem confirmed."}], "caption": "Press Play and watch each step feed the next. CBT challenges the thoughts, rumination-focused work interrupts the brooding, and behavioural activation breaks the withdrawal. Any break slows the whole wheel."}
:::

### Psychodynamic and attachment views [extra]
- Freud's "Mourning and Melancholia": in melancholia, anger at a lost loved one is turned inward, as self-reproach.
- Attachment theory: early loss or insecure attachment raises later vulnerability.

### Social factors
- Life events, especially **loss and humiliation**, often come before an episode.
- Childhood adversity: loss of a parent, abuse, neglect.
- Poverty, debt, unemployment, domestic violence, isolation, discrimination.
- **No confiding relationship.** Brown and Harris, studying women in London, found that three or more young children at home, no confidant, no work outside the home and early loss of the mother raised vulnerability.
- In India: academic pressure, unemployment, farm debt, dowry harassment, migration and caring for ill relatives are common contexts. Notice them, but do not assume them.

:::recall
1. State Beck's cognitive triad. || Negative views of self, world and future.
2. Name four thinking errors with an example each. || All-or-nothing, overgeneralising, catastrophising, personalising, mind reading.
3. Describe learned helplessness and its reformulation. || Uncontrollable events teach that action is useless; internal, stable, global explanations.
4. List four social risk factors. || Loss or humiliation events, childhood adversity, poverty or debt, no confidant, violence at home.
:::

:::mcq
Q: A student fails one test and says, "I'm useless, I'll fail everything, my future is ruined." In Beck's triad these thoughts are about:
- The self only
- *The self, the world and the future
- Others only
- The past
> The triad: self, world and future, held up by errors such as overgeneralising.
:::

# Part III · Recognising it

## 3.1 How depression presents [core][beginner]
| Domain | Features |
|---|---|
| Emotional | Sadness, emptiness, irritability, anxiety, crying easily or being unable to cry, loss of feeling |
| Cognitive | Poor concentration, indecision, worthlessness, guilt, hopelessness, rumination, suicidal thoughts |
| Biological | Sleep change (early waking), appetite and weight change, low energy, low libido, constipation, morning worsening |
| Behavioural | Withdrawal, poor self-care, slowed movement and speech, falling work output |
| Psychotic (severe) | Delusions of guilt, poverty, nihilism ("my insides have rotted") or disease; voices accusing the patient |

### Depression in Indian clinics
- Many people first describe **body symptoms**: aches, headache, burning feet, "gas", weakness, heaviness in the head. Ask about mood and interest directly.
- Distress may be called "tension", or blamed on family conflict, money or nazar.
- Stigma is real: people fear being called "pagal"; families may ask for "a tonic" rather than an antidepressant.
- Some people describe "dhat" (worry about semen loss) or "sinking of the heart" with low mood underneath. Ask about the whole picture.

:::sounds What patients say
- "Mann nahi lagta, kisi cheez mein." (Nothing interests me.) Loss of interest.
- "Bas tension hai, neend nahi aati." Ask what the tension is, and how they sleep.
- "Poore body mein dard rehta hai, kamzori lagti hai." Body presentation: still screen for mood.
- "Main sab pe bojh hoon." (I'm a burden on everyone.) Worthlessness, and a suicide-risk clue.
- "Kya fayda jeene ka?" (What's the point of living?) Ask directly about suicidal thoughts.
:::

### Special groups
- **Children**: irritability, school refusal, falling marks, stomach aches, boredom.
- **Teenagers**: irritability, anger, substance use, self-harm, withdrawal into the phone.
- **Older adults**: body complaints, memory complaints, agitation, anxiety; may look like dementia (**depressive pseudodementia**).
- **After childbirth**: low mood, anxiety about the baby, guilt about being a "bad mother"; always ask about thoughts of harming herself or the baby.
- **Men**: may show irritability, anger, overwork or drinking more than sadness.

:::trap Pseudodementia versus dementia
| Feature | Depressive pseudodementia | Dementia |
|---|---|---|
| Onset | Fairly quick, can be dated | Slow and gradual |
| Effort | Poor effort; "I don't know" | Tries hard; near-miss answers |
| Complaints | Complains loudly of memory loss | Often unaware, or hides it |
| Mood | Depressive symptoms come first | Mood changes later |
| Treatment | Improves with antidepressants | Progresses |
Note: depression in late life can also be an early sign of a later dementia, so follow up.
:::

:::widget reveal
{"prompt": "A 66-year-old retired teacher in Kolkata is brought for 'forgetfulness' that began a few months after her husband died. She answers most memory questions with 'I don't know, I'm useless now.' What two things would you check first?", "answer": "Her mood (sadness, loss of interest, sleep, appetite, guilt, hopelessness, suicidal thoughts), because this sounds like depression with poor effort; and her physical health (thyroid, B12, blood count, sodium, medicines), because body causes are common at this age. Treating the depression and then re-testing memory is the fairest test of what is going on."}
:::

:::recall
1. List the five domains of depressive features with an example each. || Emotional, cognitive, biological, behavioural, psychotic.
2. How does depression often first present in Indian primary care? || With body symptoms: aches, weakness, gas, headache.
3. Give four differences between pseudodementia and dementia. || Onset, effort, complaints, mood first, response to treatment.
4. How may depression show in men? || Irritability, anger, overwork, drinking.
:::

:::mcq
Q: A 60-year-old man in an Indian clinic complains only of "gas", body aches and weakness. Tests are normal. He has stopped going to the temple and no longer plays with his grandson. The likely missed diagnosis is:
- Somatic symptom disorder only
- *Depression presenting with physical complaints
- Hypochondriasis
- Malingering
> Body presentation is common. Ask about interest, mood, sleep and hope.
:::

## 3.2 The first interview and the MSE [core][beginner]
The first meeting decides whether the person comes back. Aim for **safety, trust and enough information to act**, in that order.

### A structure for the first interview
1. **Welcome and frame.** Introduce yourself, say how long you have, explain confidentiality and its limit (safety).
2. **Open question.** "What brings you here today?" Then let the person talk for a few minutes without interrupting.
3. **Focus.** The nine symptoms, how long, how it affects work, study, family and self-care.
4. **Risk.** Suicidal thoughts, plans, past attempts; risk to children or others; self-neglect.
5. **Highs.** "Has there ever been a time you felt the opposite: unusually energetic, needing little sleep, full of plans?" Ask the family too.
6. **Other causes.** Alcohol and drugs, medicines, physical illness, thyroid symptoms.
7. **The person's world.** Stressors, supports, beliefs about the illness, what they hope for.
8. **Close.** Summarise, give a first explanation, agree a next step and a date.

:::widget decide
{"scene": "Fatima, 28, sits with her mother-in-law in the outpatient clinic in Hyderabad. The mother-in-law says, 'She just lies in bed. She needs a tonic.' Fatima looks down and says nothing. You have twenty minutes.", "ask": "How do you begin?", "choices": [{"label": "Ask the mother-in-law to describe everything, then write a prescription for a tonic", "verdict": "harm", "outcome": "Fatima never speaks. You miss her story, and any risk.", "why": "The patient's own account is essential, and a tonic treats nothing."}, {"label": "Thank them both, then ask the mother-in-law to wait outside for a while so you can speak to Fatima alone first, and invite her back later", "verdict": "best", "outcome": "Alone, Fatima says she has felt hopeless for months, cannot sleep, and has been hit by her husband. With her consent, you plan safety and treatment, then involve the family in what she agrees to share.", "why": "A private conversation lets the person speak freely about mood, risk and things like violence at home. Bringing the family back respects their role."}, {"label": "Ask Fatima a rapid list of yes-or-no symptom questions in front of her mother-in-law", "verdict": "ok", "outcome": "She says 'yes' to sadness and 'no' to everything else. You are not sure what is true.", "why": "Checklists in front of family miss sensitive answers. Open questions and privacy come first."}]}
:::

### Mental state examination in depression
| MSE heading | Typical findings |
|---|---|
| Appearance | Poor grooming, weight loss, sad face, little eye contact; in severe cases, unwashed and dehydrated |
| Behaviour | Slowed movements (retardation) or restless hand-wringing (agitation); in severe cases stupor |
| Speech | Slow, quiet, monotonous, long pauses before answering, little spontaneous speech |
| Mood (subjective) | In the person's words: "sad", "empty", "nothing feels good" |
| Affect (objective) | Depressed, restricted range, may not brighten (melancholic) or brighten briefly (atypical) |
| Thought | Hopeless, guilty, worthless themes; ruminations; suicidal ideas; in severe cases delusions of guilt, poverty, disease or nihilism |
| Perception | Usually normal; in psychotic depression, voices accusing or condemning |
| Cognition | Poor concentration and attention; memory complaints; orientation usually normal |
| Insight | Often partial: may see it as "weakness" or a body illness |
| Judgement | Often intact; may be impaired in severe or psychotic depression |

:::word Writing it up
"Fair grooming, psychomotor retardation, speech low in volume with increased reaction time. Mood 'very low' (rated 2 out of 10); affect depressed, restricted, non-reactive. Thought: hopelessness and guilt; passive death wishes without plan or intent. No perceptual abnormalities. Attention reduced. Insight grade 4."
:::

### Rating scales
| Scale | Who rates | Use |
|---|---|---|
| PHQ-9 | Patient | Screening and tracking; 0 to 27; 5, 10, 15 and 20 mark mild, moderate, moderately severe and severe. Item 9 asks about self-harm thoughts |
| HAM-D | Clinician | Severity in research and clinics |
| BDI-II | Patient | Severity |
| Geriatric Depression Scale | Patient | Older adults; fewer body items |
| EPDS (Edinburgh) | Patient | Around childbirth |
| HADS | Patient | Medically ill; avoids body symptoms |

:::widget curve
{"kind": "sdt", "title": "Screening with a cut-off: the trade-off", "caption": "A screening tool such as the PHQ-9 uses a cut-off score (10 is common). Move the criterion: a lower cut-off catches more true cases (hits) but flags more people who are not depressed (false alarms). A higher cut-off misses more cases. A screen only says 'look closer'; the interview makes the diagnosis."}
:::

### Investigations
Blood count, thyroid function, glucose, kidney and liver tests, sodium; B12 and folate where indicated; ECG before some medicines; HIV and syphilis tests by risk; brain imaging if there are neurological signs, late first onset or atypical features.

:::widget flow
{"title": "The first interview, in eight moves", "layout": "chain", "nodes": [{"id": "a", "label": "Welcome and frame", "detail": "Who you are, how long you have, confidentiality and its one limit: safety."}, {"id": "b", "label": "Open question", "detail": "'What brings you here today?' Then listen without interrupting for a few minutes."}, {"id": "c", "label": "Focus", "detail": "The nine symptoms, how long, and what they have done to work, study, family and self-care."}, {"id": "d", "label": "Risk", "detail": "Suicidal thoughts, plans, past attempts; risk to children; self-neglect."}, {"id": "e", "label": "Highs", "detail": "Any time of unusual energy, little sleep and big plans? Ask the family too."}, {"id": "f", "label": "Other causes", "detail": "Alcohol, drugs, medicines, thyroid and other body illness."}, {"id": "g", "label": "Their world", "detail": "Stressors, supports, beliefs about the cause, hopes for treatment."}, {"id": "h", "label": "Close", "detail": "Summarise, explain, agree the next step and a date to meet again."}], "caption": "Safety, trust and enough information to act, in that order."}
:::

:::recall
1. List the eight steps of a first interview. || Frame, open question, focus, risk, highs, other causes, the person's world, close.
2. Why see the patient alone? || To hear their own account, including risk and sensitive issues like violence.
3. Give MSE findings in depression for speech, affect and thought. || Slow, quiet, increased reaction time; depressed, restricted; hopeless, guilty, suicidal themes.
4. What is the PHQ-9 range and its cut-offs? || 0 to 27; 5, 10, 15, 20.
:::

:::mcq
Q: In the MSE, "the patient took several seconds before answering each question" is recorded under:
- Thought content
- *Speech (increased reaction time)
- Perception
- Insight
> A classic finding of psychomotor retardation, recorded under speech.

Q: Which scale is designed to avoid body symptoms in medically ill patients?
- PHQ-9
- HAM-D
- *HADS
- YMRS
> The Hospital Anxiety and Depression Scale leaves out symptoms the illness itself could cause.
:::

## 3.3 Differential diagnosis and the body [core][beginner]
| Condition | How to tell |
|---|---|
| Bipolar depression | Past mania or hypomania; family history of bipolar disorder; early onset, many episodes, atypical or psychotic features, onset after childbirth |
| Adjustment disorder | Clear stressor; symptoms short of a full episode |
| Normal grief | Waves, kept self-esteem |
| Persistent depressive disorder | Long, milder course |
| Schizophrenia (negative symptoms) | Blunted affect rather than sad mood; psychotic history |
| Dementia | See the pseudodementia table |
| Anxiety disorders | Worry and fear lead; low mood follows; often co-exist |
| Substance use | Timing with alcohol or drugs; often improves with abstinence |
| Body causes | Thyroid, anaemia, B12, medicines, stroke, Parkinson's, cancer |

### Depression with physical illness
Depression is two to three times more common in people with chronic physical illness, and it **worsens the physical outcome**: more pain, poorer self-care, worse adherence, higher death rates.

| Physical condition | What to know |
|---|---|
| Heart disease, after a heart attack | Depression raises the risk of further cardiac events; **sertraline** is well studied and safe; avoid tricyclics |
| Diabetes | Depression worsens glucose control; mirtazapine and some antipsychotics add weight; SSRIs and CBT help |
| Stroke | Common in the first year; slows rehabilitation; SSRIs help |
| Parkinson's disease | Depression and anxiety are common and can come before the movement symptoms |
| Hypothyroidism | Mimics depression (slowness, weight gain, tiredness); always check thyroid function |
| Cancer | Separate depression from normal sadness and from treatment effects |
| HIV, tuberculosis | Depression lowers adherence; **efavirenz** and some TB medicines can affect mood |
| Chronic pain | Two-way link; duloxetine or low-dose amitriptyline help both |

:::trap Don't count only body symptoms
In physical illness, tiredness, poor appetite and poor sleep may come from the illness. Lean on **psychological symptoms**: hopelessness, worthlessness, guilt, loss of interest, suicidal thoughts.
:::

:::widget decide
{"scene": "Mrs Kaur, 47, from Amritsar, has felt low and tired for months. She has gained weight, feels cold, her skin is dry and she is constipated. She asks you to 'just start the depression tablet'.", "ask": "What do you do first?", "choices": [{"label": "Start an SSRI today and review later", "verdict": "ok", "outcome": "Three months on she is no better. A thyroid test then shows severe hypothyroidism.", "why": "An antidepressant is not wrong for depression, but here the body clues point to a treatable cause that should be checked first or at the same time."}, {"label": "Explain that her symptoms might have a body cause, check thyroid function and blood count today, and arrange early review", "verdict": "best", "outcome": "Her TSH is very high. Thyroxine is started, and her mood improves as her thyroid recovers. You keep monitoring her mood.", "why": "Cold intolerance, dry skin, weight gain and constipation suggest hypothyroidism, which mimics and worsens depression."}, {"label": "Tell her it's just stress and to rest", "verdict": "harm", "outcome": "She stops seeking help. Her thyroid illness and her low mood both worsen.", "why": "It dismisses real symptoms and misses a medical cause."}]}
:::

:::widget flow
{"title": "Differential diagnosis tree", "layout": "tree", "nodes": [{"id": "root", "label": "A person presents with a depressive syndrome", "detail": "Work down the branches. More than one can be true at once."}, {"id": "bp", "parent": "root", "label": "Bipolar?", "detail": "Any past mania or hypomania, a bipolar family history, very early onset, atypical or psychotic features, onset after childbirth, or a 'too good' response to an antidepressant."}, {"id": "bp1", "parent": "bp", "label": "Yes: bipolar depression", "detail": "Avoid an antidepressant alone; use treatments for bipolar depression."}, {"id": "org", "parent": "root", "label": "Organic (a body cause)?", "detail": "Thyroid, anaemia, B12, stroke, Parkinson's disease, cancer, HIV, steroids, interferon, efavirenz. Look for body signs and order the basic tests."}, {"id": "org1", "parent": "org", "label": "Yes: depressive disorder due to another medical condition", "detail": "Treat the cause, and treat the mood too if it persists."}, {"id": "sub", "parent": "root", "label": "Substance?", "detail": "Did it start during heavy drinking, drug use or withdrawal? Does it improve after some weeks of abstinence?"}, {"id": "sub1", "parent": "sub", "label": "Yes: substance-induced depressive disorder", "detail": "Treat the substance use; reassess mood after abstinence."}, {"id": "oth", "parent": "root", "label": "Another psychiatric picture?", "detail": "Grief, adjustment disorder, persistent depressive disorder, negative symptoms of schizophrenia, dementia, anxiety disorders."}, {"id": "uni", "parent": "root", "label": "None of these: unipolar depression", "detail": "Major depressive disorder. Still recheck at every review, because highs and medical causes can appear later."}], "caption": "Tap any box. Bipolar, organic and substance causes are checked in every patient because each changes treatment."}
:::

:::recall
1. Name six differential diagnoses of depression. || Bipolar depression, adjustment disorder, grief, persistent depressive disorder, negative symptoms of schizophrenia, dementia, anxiety, substance use, medical causes.
2. Which antidepressant is well studied after a heart attack? || Sertraline.
3. Why are body symptoms less useful in the medically ill? || The illness itself causes them.
4. Which HIV medicine can affect mood? || Efavirenz.
:::

:::mcq
Q: A man has been low since his heart attack 2 months ago. The usual best antidepressant choice is:
- Amitriptyline
- *Sertraline
- Lithium
- Dosulepin (dothiepin)
> Well studied after heart attack; tricyclics are avoided in heart disease.
:::

## 3.4 Suicide risk in depression [core][beginner]
Depression is the illness most often present in people who die by suicide. Asking about suicide is a core skill. It must be done in every assessment, and again at follow-up.

### How to ask, step by step
Move from general to specific. Use plain, calm words.
1. "How do you see the future?"
2. "Do you sometimes feel life is not worth living?"
3. "Have you had thoughts of ending your life?"
4. "Have you thought about how you would do it?"
5. "Have you made any preparations, or done anything to act on it?"
6. "What has stopped you so far?"
7. "Have you ever tried before?"

:::widget decide
{"scene": "Vikram, 38, a software engineer in Bengaluru, has a moderate depressive episode. He has just said, 'Honestly, sometimes I wonder what the point is.' You feel uneasy. There are ten minutes left.", "ask": "What do you do?", "choices": [{"label": "Move on quickly to medicines, so as not to upset him", "verdict": "harm", "outcome": "You never learn that he has been storing his father's sleeping tablets.", "why": "Avoiding the topic leaves risk unknown. Asking does not increase risk."}, {"label": "Say, 'Thank you for telling me. When you say what's the point, have you had thoughts of ending your life?' and then ask about plans, means, past attempts and what keeps him going", "verdict": "best", "outcome": "He admits to thoughts and a store of tablets, but says his daughter keeps him going. Together you agree a safety plan; with his consent his wife removes the tablets, and you arrange review within days.", "why": "A direct, calm question, followed by plan, means and protective factors, lets you judge urgency and act on it."}, {"label": "Tell him firmly that suicide is a sin and he must not think like that", "verdict": "harm", "outcome": "He feels judged and says he was 'only joking'.", "why": "Moral judgement shuts the conversation and hides risk."}]}
:::

:::widget flow
{"title": "Asking about suicide: from general to specific", "layout": "chain", "nodes": [{"id": "a", "label": "The future", "detail": "'How do you see the future?'"}, {"id": "b", "label": "Life worth living?", "detail": "'Do you sometimes feel life is not worth living?'"}, {"id": "c", "label": "Thoughts of ending life", "detail": "'Have you had thoughts of ending your life?'"}, {"id": "d", "label": "Method", "detail": "'Have you thought about how you would do it?'"}, {"id": "e", "label": "Preparations", "detail": "'Have you made any preparations, or done anything towards it?' Ask about access to pesticides, medicines and heights."}, {"id": "f", "label": "What stops you", "detail": "'What has kept you going so far?' These are the protective factors you will build on."}, {"id": "g", "label": "Past attempts", "detail": "'Have you ever tried before?' The strongest single risk factor."}], "caption": "Each step opens the next. Stop and act the moment you hear a plan with intent or means."}
:::

### Risk factors and protective factors
| Raise risk | Lower risk |
|---|---|
| Past suicide attempt (the strongest single factor) | Reasons for living, for example children |
| Hopelessness | Good social and family support |
| Male sex for death by suicide; female for attempts | Religious or moral objections |
| Alcohol or drug use | Engagement with treatment |
| Psychotic features, agitation, severe anxiety, insomnia | Problem-solving skills |
| Recent loss, humiliation, debt, legal trouble | Restricted access to means |
| Chronic pain or illness; living alone | A hopeful plan for the future |
| Access to means (pesticides, medicines, heights) | |
| Recent discharge from hospital; early recovery, when energy returns before mood | |

### What to do with what you find
- **Low risk** (passive thoughts, no plan, strong protective factors): treat the depression, agree a safety plan, review regularly.
- **Moderate risk** (active thoughts, vague plan): closer follow-up, involve family with consent, remove means, consider specialist input.
- **High risk** (clear plan, intent, means, recent attempt, psychosis): urgent specialist assessment, consider admission, do not leave alone.

**Means restriction saves lives.** In India, pesticide poisoning has been a leading method, especially in rural areas; banning the most toxic pesticides and storing others safely reduces deaths. In cities, limit stocks of medicines at home.

### A safety plan, in the person's own words
1. My warning signs.
2. Things I can do on my own to cope.
3. People and places that distract me.
4. People I can ask for help.
5. Professionals and services I can contact.
6. Making my surroundings safe.

:::safety A brief note on help in India
This platform is for learning, not a help service. In India, Tele-MANAS, the national tele-mental health service, can be reached free on **14416**. In any emergency, contact local emergency services or go to the nearest hospital.
:::

:::recall
1. List the seven questions that move from general to specific. || Future, life worth living, thoughts of ending life, how, preparations, what stops you, past attempts.
2. What is the strongest single risk factor for suicide? || A past suicide attempt.
3. Why is early recovery a risky time? || Energy returns before mood, so the person can act on suicidal plans.
4. Name the six parts of a safety plan. || Warning signs, coping alone, distracting people and places, people to ask, professionals, making surroundings safe.
:::

:::mcq
Q: Which statement about asking about suicide is TRUE?
- It plants the idea in the patient's mind
- It should wait until the second visit
- *Asking directly and calmly is safe and may bring relief
- Only psychiatrists may ask
> Every clinician should ask, at every assessment.

Q: A depressed man has a plan to take pesticide, has bought it, and says he cannot see any future. The best action is:
- Start an SSRI and review in a month
- Give him a safety plan and send him home alone
- *Urgent specialist assessment, keep him safe and not alone, remove means, consider admission
- Tell his employer
> Plan, intent and means mean high risk: act the same day.
:::

## 3.5 Putting it together: the formulation [core][beginner]
A diagnosis says **what**. A formulation says **why this person, why now, and what will help**. The commonest frame is the **5 Ps**.

| P | Question | Example |
|---|---|---|
| Presenting problem | What is happening now? | Moderate depressive episode with early waking and guilt |
| Predisposing | What made this person vulnerable? | Mother had depression; strict, critical upbringing |
| Precipitating | What triggered it now? | Failed promotion; father's stroke |
| Perpetuating | What keeps it going? | Withdrawal, rumination, poor sleep, no confidant, alcohol |
| Protective | What strengths can we use? | Close sister, faith, stable job, good past response to treatment |

Arrange the factors under **biological, psychological and social** headings, and the formulation becomes a grid. The perpetuating column is the most useful: it is your treatment plan in disguise.

:::widget worked
{"title": "Formulating Ananya's depression", "steps": [{"q": "Ananya, 22, a final-year engineering student in Chennai, has had low mood, no interest, poor sleep, guilt and poor focus for over a month after failing a placement interview. Her father, a strict man, says she has 'shamed the family'. Her grandmother had 'nervous breakdowns'. She stays in her hostel room scrolling at night, skips meals, and has stopped calling her best friend. She sings in a choir and has a supportive aunt. What is the presenting problem?", "a": "A major depressive episode, probably moderate, without psychotic features. Risk must be asked about and recorded."}, {"q": "List the predisposing factors (biological, psychological, social).", "a": "Biological: family history (grandmother). Psychological: likely perfectionistic, approval-seeking beliefs ('I must succeed to be accepted') from a critical upbringing. Social: high-pressure academic setting."}, {"q": "What precipitated it?", "a": "Failing the placement interview, plus her father's shaming response."}, {"q": "What keeps it going?", "a": "Social withdrawal, rumination at night, phone use and late sleep, skipped meals, loss of choir and friendship (fewer rewards), and the belief 'I am a failure'."}, {"q": "What protects her?", "a": "Her aunt, her best friend, singing, her intelligence and her past achievements."}, {"q": "Turn the perpetuating factors into a plan.", "a": "Behavioural activation (choir, calls to her friend, meals), a sleep routine with the phone out of the room, CBT for 'I am a failure', a family session to help her father respond differently, a safety plan, and an antidepressant if moderate symptoms persist or worsen."}], "yourTurn": [{"q": "Raju, 55, a farmer from Karnataka, is depressed after crop failure and a loan he cannot repay. He drinks every night and has stopped going to the panchayat. Name one perpetuating factor and the matching intervention.", "a": "For example: nightly drinking (worsens mood and sleep, raises suicide risk) matched with brief alcohol intervention; or withdrawal from the panchayat matched with activity scheduling; or debt matched with problem-solving and linking to debt relief or a social worker. Also ask about pesticides at home."}]}
:::

:::word The diagnosis line
"Major depressive disorder, single episode, moderate, with anxious distress. Passive death wishes, no plan or intent; low current risk; safety plan agreed. Insight grade 4."
:::

:::widget layers
{"title": "The biopsychosocial formulation, as rings", "shape": "rings", "layers": [{"label": "Biological", "detail": "Ananya: a grandmother with 'nervous breakdowns', broken sleep, skipped meals. These set the body's vulnerability and keep the episode going."}, {"label": "Psychological", "detail": "A belief that she must succeed to be accepted, rumination at night, the thought 'I am a failure'."}, {"label": "Social", "detail": "A failed placement interview, a father who says she has shamed the family, a supportive aunt and a choir that she has stopped attending."}], "caption": "Tap each ring. Run the 5 Ps through every ring and you get the full grid; the perpetuating factors in each ring become the treatment plan."}
:::

:::recall
1. What are the 5 Ps? || Presenting, predisposing, precipitating, perpetuating, protective.
2. Which column of the formulation becomes the treatment plan? || Perpetuating factors.
3. What three headings cross the 5 Ps? || Biological, psychological, social.
:::

:::mcq
Q: In a formulation, "spends all day in bed avoiding friends" is best placed as a:
- Predisposing factor
- Precipitating factor
- *Perpetuating factor
- Protective factor
> Withdrawal keeps depression going, and points straight to behavioural activation.
:::

# Part IV · Treating it

## 4.1 Stepped care [core][beginner]
Treatment matches severity and risk. Everyone starts at step 1; people move up if they are more severe or do not improve.

| Step | Who | What |
|---|---|---|
| 1 | Everyone | Assessment, explanation of the illness, safety plan, sleep and activity advice, follow-up |
| 2 | Mild | Guided self-help, behavioural activation, problem-solving, group exercise, brief CBT. Antidepressants are not routinely first choice for mild depression, unless the person prefers them, has had moderate or severe episodes before, or mild symptoms persist |
| 3 | Moderate to severe | An antidepressant (usually an SSRI) **plus** a psychological therapy (CBT, behavioural activation, interpersonal therapy) |
| 4 | Severe, psychotic, high risk, refusing food and fluids, catatonic | Specialist care; antidepressant plus antipsychotic, or **ECT**; admission if unsafe |

:::widget worked
{"title": "A stepped treatment plan", "steps": [{"q": "Neha, 29, a teacher in Jaipur, has a first episode: low mood, poor sleep, guilt and poor focus for over a month. PHQ-9 is 16. She has passive death wishes, no plan, strong family support and no past highs. Thyroid tests are normal. Where does she sit in stepped care?", "a": "Step 3: moderately severe depression. Offer an antidepressant plus a psychological therapy, with a safety plan."}, {"q": "Which antidepressant would you suggest first, and why?", "a": "An SSRI such as sertraline or escitalopram: effective, well tolerated, safer in overdose than tricyclics. Choose with her, considering side effects she wants to avoid, other medicines, and any plans for pregnancy."}, {"q": "What do you tell her about the first days and when to come back?", "a": "Side effects such as nausea or restlessness can come before benefit and usually ease. Some improvement is often visible early; full effect builds over a longer stretch. Review soon, earlier if young or at risk, and return at once if suicidal thoughts worsen."}, {"q": "What psychological help do you add?", "a": "Behavioural activation or CBT, weekly if possible; in a busy public clinic, a trained lay counsellor programme or group work. Involve her husband with her consent."}, {"q": "At review there is no improvement at all despite taking it daily at a good dose. What now?", "a": "Recheck the diagnosis (including past highs), adherence, alcohol and stressors. Then raise the dose, or switch. Keep the therapy going."}, {"q": "She recovers fully. How long does treatment continue?", "a": "Continue the same dose for several months after full remission (you will guess how long in 4.3), then taper slowly with a plan for early warning signs."}], "yourTurn": [{"q": "Suresh, 63, has severe depression with delusions that he has ruined his family and has stopped eating and drinking for three days. Where is he in stepped care, and what are the options?", "a": "Step 4: severe psychotic depression with food and fluid refusal. Urgent specialist care and admission; ECT is the fastest and most effective option; alternatively an antidepressant plus an antipsychotic. Monitor hydration, kidney function and physical health."}]}
:::

:::widget flow
{"title": "The stepped-care pathway", "layout": "chain", "nodes": [{"id": "a", "label": "Step 1: everyone", "detail": "Assessment, a plain explanation, a safety plan, sleep and activity advice, and a date to review."}, {"id": "b", "label": "Step 2: mild", "detail": "Guided self-help, behavioural activation, problem-solving, group exercise or brief CBT."}, {"id": "c", "label": "Step 3: moderate to severe", "detail": "An antidepressant (usually an SSRI) plus a psychological therapy."}, {"id": "d", "label": "Step 4: severe, psychotic or high risk", "detail": "Specialist care; antidepressant plus antipsychotic, or ECT; admission if unsafe."}], "edgeLabels": {"a>b": "if mild", "b>c": "if not improving or more severe", "c>d": "if severe, psychotic or unsafe"}, "caption": "People enter at the step their severity and risk call for, and move up if they do not improve."}
:::

### When the family has other plans
In India the family is usually part of treatment. Beliefs about cause (karma, nazar, spirit possession) and preferred healers (temples, dargahs, babas) are common. Working **with** them, not against them, keeps the patient in care.

:::widget decide
{"scene": "Lakshmi, 41, from a village near Madurai, has severe depression. She has barely eaten in a week, is slowed and says she should be punished. Her husband and brother say they will take her to a temple healer and refuse medicines and ECT. 'Doctors only give sleeping pills,' says her brother.", "ask": "What is your best approach?", "choices": [{"label": "Tell them they are superstitious and that you will call the police if they leave", "verdict": "harm", "outcome": "The family takes her away angrily. She is admitted elsewhere a week later, severely dehydrated.", "why": "Threats and contempt destroy trust and push the family away from care."}, {"label": "Accept the refusal, discharge her and ask them to come back if things get worse", "verdict": "harm", "outcome": "Lakshmi's food and fluid refusal continues at home.", "why": "She is at serious physical risk. Simply discharging her ignores your duty of care."}, {"label": "Listen to their beliefs, explain in plain words that her illness is treatable and that refusing food is dangerous, suggest that prayers and treatment can go together, and if she lacks capacity and is at risk, use supported admission under the Mental Healthcare Act 2017 with the family involved", "verdict": "best", "outcome": "The family agrees to admission if they can visit the temple on Sunday. She improves with treatment, and they become allies.", "why": "Respecting beliefs while being clear about risk usually wins cooperation. The Act allows supported admission when a person with severe illness cannot make the decision and is at risk, with safeguards."}]}
:::

:::recall
1. Outline the four steps of stepped care. || Assess and explain; mild: self-help, BA, CBT; moderate-severe: antidepressant plus therapy; severe or psychotic: specialist, antipsychotic or ECT, admission.
2. When might an antidepressant be used in mild depression? || Patient preference, past moderate or severe episodes, or persisting symptoms.
3. How do you handle a family that refuses treatment? || Listen, respect beliefs, explain risk plainly, combine approaches, and use legal safeguards if risk is high and capacity lacking.
:::

:::mcq
Q: A woman with mild depression for a month, no risk, asks for "the strongest tablet". In stepped care the best first step is:
- High-dose antidepressant plus a benzodiazepine
- *Guided self-help or behavioural activation, with review
- ECT
- Admission
> Medicines show the clearest benefit in moderate to severe depression.
:::

## 4.2 Antidepressants: the medicines [core][beginner]
### The main classes
| Class | Examples | How they work, in short |
|---|---|---|
| SSRIs | Sertraline, escitalopram, fluoxetine, paroxetine, citalopram, fluvoxamine | Block the serotonin recycling pump (SERT) |
| SNRIs | Venlafaxine, desvenlafaxine, duloxetine | Block serotonin and noradrenaline pumps |
| NaSSA | Mirtazapine | Blocks alpha-2 brakes and some serotonin receptors; strongly blocks histamine (sleepy, hungry) |
| NDRI | Bupropion | Blocks noradrenaline and dopamine pumps |
| Multimodal | Vortioxetine | Blocks SERT and acts on several serotonin receptors |
| Melatonin agonist | Agomelatine | Acts on melatonin receptors and blocks 5HT2C |
| Tricyclics (TCAs) | Amitriptyline, imipramine, clomipramine, nortriptyline | Block serotonin and noradrenaline pumps, plus many unwanted receptors; dangerous in overdose |
| MAOIs | Phenelzine, tranylcypromine, moclobemide | Stop the enzyme that breaks monoamines down; diet and drug interactions |

:::widget synapse
{"drug": "ssri", "caption": "Press 'Add SSRI', then let time pass. Watch what changes first (serotonin in the gap, early side effects) and what changes later (receptors, then rewiring)."}
:::

:::widget guess
{"prompt": "In people who will respond to an antidepressant, by when does some improvement usually start to show?", "min": 0, "max": 8, "unit": "weeks", "answer": [1, 2], "reveal": "Usually within the first 1 to 2 weeks; full benefit builds over several more. The old idea that 'nothing happens for a month' is a myth. If there is no improvement at all after 3 to 4 weeks at a good dose, that medicine is unlikely to work at that dose, so the plan should change.", "clinician": "Pooled trial data show the fastest rate of improvement in weeks 1 to 2; in individual practice an effect is usually seen by week 2. No discernible improvement by week 3 to 4 at a therapeutic dose predicts non-response: increase the dose or switch. Partial improvement at week 4 may still become full response, so continue."}
:::

:::widget journey
{"drug": "sertraline", "target": "serotonin transporters (SERT) on serotonin neurons from the raphe nuclei, which project to the cortex and limbic system", "routes": ["oral"], "notes": {"gut": "Sertraline is absorbed slowly; taking it with food raises absorption a little and eases early nausea.", "liver": "Several CYP enzymes (including CYP2C19 and CYP2B6) share its breakdown, so single-gene differences and interactions matter less than with fluoxetine or paroxetine.", "blood": "Most of it is bound to blood proteins. Its half-life is about a day, so once-daily dosing works and steady state comes within about a week.", "out": "Broken down in the liver to a weaker metabolite, then removed in urine and faeces."}, "caption": "Press Play and follow one tablet. Blocking SERT happens within hours of reaching the brain; the slow adaptations that lift mood come later."}
:::

### Choosing a first antidepressant
- **SSRIs first** for most people: effective, tolerable, safer in overdose.
- **Sertraline** is a common first choice: well studied in heart disease and widely used around pregnancy and breastfeeding.
- **Mirtazapine** if poor sleep and poor appetite are major problems, or sexual side effects must be avoided (but weight gain).
- **Bupropion** if sexual side effects or sleepiness must be avoided (but avoid in epilepsy and eating disorders).
- **Duloxetine** if pain is prominent.
- **Avoid tricyclics** as a first choice in anyone at risk of overdose.
- Consider what helped before, what helped a close relative, other medicines, cost and availability.

:::student
### Typical adult daily doses (educational only)
These ranges are for learning. They are not advice for anyone to take or change a medicine.

| Medicine | Typical adult daily range |
|---|---|
| Sertraline | 50 to 200 mg |
| Escitalopram | 10 to 20 mg |
| Fluoxetine | 20 to 60 mg |
| Mirtazapine | 15 to 45 mg (at night) |
| Venlafaxine (slow release) | 75 to 225 mg |
| Duloxetine | 60 mg (up to 120 mg) |
| Amitriptyline | 75 to 150 mg (at night) |
:::

:::clinician
### Dosing (for learning; check current guidelines)
Common Indian brand names are examples only; brands change.

| Medicine | Start | Usual range | Maximum | Indian brands | Key notes |
|---|---|---|---|---|---|
| Sertraline | 50 mg (25 mg if anxious or frail) | 50 to 200 mg | 200 mg | Serta, Daxid, Zosert | Raise in 25 to 50 mg steps; well studied after heart attack |
| Escitalopram | 10 mg (5 mg if anxious or older) | 10 to 20 mg | 20 mg (10 mg over 65) | Nexito, Stalopam | Dose-related QT prolongation |
| Citalopram | 20 mg | 20 to 40 mg | 40 mg (20 mg over 65) | | QT prolongation; avoid with other QT drugs |
| Fluoxetine | 20 mg | 20 to 60 mg | 60 mg (80 mg in some countries) | Fludac, Flunil, Prodep | Very long-lived metabolite; strong CYP2D6 inhibitor; can be activating |
| Paroxetine | 20 mg | 20 to 50 mg | 50 mg | Pexep | Worst discontinuation; anticholinergic; avoided in pregnancy |
| Fluvoxamine | 50 mg at night | 100 to 300 mg | 300 mg | Fluvoxin | Inhibits CYP1A2 (raises clozapine, theophylline, caffeine) |
| Venlafaxine XR | 37.5 to 75 mg | 75 to 225 mg | 375 mg (specialist) | Venlor, Veniz XR | Check blood pressure; marked discontinuation |
| Duloxetine | 30 to 60 mg | 60 mg | 120 mg | Duvanta, Dulane | Pain; avoid in liver disease and heavy alcohol use |
| Mirtazapine | 15 mg at night | 15 to 45 mg | 45 mg | Mirtaz, Mirnite | Sedation and weight gain; little sexual dysfunction |
| Bupropion SR | 150 mg in the morning | 150 to 300 mg | 450 mg (XL) | Bupron SR | Seizure risk rises with dose; no sexual dysfunction |
| Vortioxetine | 10 mg (5 mg over 65) | 5 to 20 mg | 20 mg | | Nausea common early |
| Agomelatine | 25 mg at bedtime | 25 to 50 mg | 50 mg | | Liver tests at baseline and repeatedly early in treatment |
| Amitriptyline | 25 to 50 mg at night | 75 to 150 mg | 200 mg (higher only as inpatient) | Tryptomer | ECG if cardiac risk; lethal in overdose |
| Imipramine | 25 to 75 mg | 100 to 200 mg | 300 mg | Depsonil | As above |

**Titration.** Start low in the anxious, the old and the medically ill. Raise when the dose is tolerated and response is partial or absent, judging timing by the early-response guess above. In the elderly, "start low, go slow", but still reach a therapeutic dose.

**Baseline checks.** Weight, blood pressure, sodium (older adults), liver tests (duloxetine, agomelatine), ECG if cardiac disease or before citalopram, escitalopram at high dose, or tricyclics.
:::

:::widget decide
{"scene": "Rohan, 23, a call-centre worker in Gurugram, has had low mood, oversleeping and heavy limbs for over a month. He asks for fluoxetine 'like my friend got'. On careful questioning, he recalls a few days two years ago when he slept three hours a night, felt brilliant, talked non-stop and spent his savings on a bike. His mother says that 'it happened once more after that'. His uncle takes lithium.", "ask": "What is your plan?", "choices": [{"label": "Start fluoxetine 20 mg alone, as he requests", "verdict": "harm", "outcome": "Soon after, Rohan stops sleeping, becomes irritable and runs up debt. He is admitted with a manic episode.", "why": "Past hypomanic episodes plus a family history of bipolar disorder mean this is probably bipolar depression. An antidepressant alone can trigger mania, mixed states or rapid cycling."}, {"label": "Explain that his past highs change the picture, treat as bipolar depression (for example quetiapine, lurasidone, lamotrigine or lithium), start a mood chart and involve his mother", "verdict": "best", "outcome": "Rohan's mood steadies over the following weeks without a switch. He learns his early warning signs.", "why": "Antidepressant monotherapy is avoided in bipolar disorder. Evidence-based treatments for bipolar depression are used instead, with psychoeducation."}, {"label": "Refuse any treatment until a manic episode is seen", "verdict": "harm", "outcome": "Rohan stays depressed and stops attending.", "why": "The history already gives the answer. Waiting leaves a depressed young man untreated."}]}
:::

:::recall
1. Name eight classes of antidepressant with an example each. || SSRI, SNRI, NaSSA, NDRI, multimodal, melatonin agonist, TCA, MAOI.
2. Which antidepressant would you pick for poor sleep and appetite? || Mirtazapine.
3. Which antidepressant avoids sexual side effects but lowers the seizure threshold? || Bupropion.
4. What does no improvement at all after a fair trial at a good dose mean? || That drug at that dose is unlikely to work: raise the dose or switch.
5. Why ask about past highs before an antidepressant? || Bipolar depression treated with an antidepressant alone can switch into mania.
:::

:::mcq
Q: A young man with depression has a past episode of a week of no sleep, grandiosity and overspending. Which plan is safest?
- Fluoxetine alone at a high dose
- *Treat as bipolar depression and avoid antidepressant monotherapy
- Amitriptyline alone
- No treatment until he is seen manic
> Past mania or hypomania means bipolar disorder.

Q: Which antidepressant is most dangerous in overdose?
- Sertraline
- Mirtazapine
- *Amitriptyline
- Escitalopram
> Tricyclics block cardiac sodium channels: arrhythmia, seizures and death.
:::

## 4.3 Using antidepressants well [core][beginner]
### SNRIs: a second pump
:::widget synapse
{"drug": "snri", "caption": "An SNRI blocks the serotonin pump and, especially at higher doses, the noradrenaline pump. Noradrenaline adds energy and pain relief, but also sweating, raised blood pressure and a fast pulse."}
:::

### What to tell every patient at the start
- How the medicine helps, and that it is **not addictive** and does not change personality.
- Side effects often come first and usually fade: nausea, loose stools, headache, restlessness, sleep change.
- **Sexual side effects** (low desire, delayed orgasm) are common and under-reported. Ask directly; there are options.
- Take it every day. Do not stop suddenly.
- Under 25: in the early phase, a small rise in suicidal thinking can occur. Report it at once.
- Alcohol worsens depression and sleep.
- When to come back, and who to call.

### How long to continue
:::widget guess
{"prompt": "After a first depressive episode has fully remitted, for how many months should the antidepressant usually continue at the same dose?", "min": 0, "max": 24, "unit": "months", "answer": [6, 12], "reveal": "At least 6 months, and often up to a year, after full remission. People with recurrent episodes (two or more, or residual symptoms, or high risk) often continue for 2 years or longer, sometimes for many years.", "clinician": "Continue the dose that achieved remission. Guidelines give at least 6 to 9 months after remission of a single episode; at least 2 years for those at high risk of recurrence. Stopping before about 3 months of treatment almost always brings symptoms back."}
:::

### Stopping: discontinuation symptoms
Stopping suddenly can cause discontinuation symptoms within days. Remember **FINISH**: **F**lu-like feelings, **I**nsomnia, **N**ausea, **I**mbalance (dizziness), **S**ensory disturbances ("electric shocks", "brain zaps"), **H**yperarousal (anxiety, irritability). They are worst with paroxetine and venlafaxine, and least with fluoxetine. Taper slowly.

:::clinician
### Tapering
Reduce gradually, in steps the patient can tolerate. Newer evidence suggests that the relationship between dose and receptor occupancy is curved, so the final steps should be the smallest (for example moving through low doses, or using liquid preparations). Restart the previous dose and taper more slowly if symptoms are troublesome. Distinguish discontinuation (within days, physical symptoms, settles on reinstatement) from relapse (later, gradual, mood symptoms).
:::

:::widget curve
{"kind": "dose-response", "title": "Potency, efficacy and why 'more' is not always better", "caption": "Shift the curve to see potency: the dose needed for an effect. Tick 'partial agonist' to see efficacy: the ceiling of effect. For many SSRIs the dose-response curve flattens early, so going above the usual dose often adds side effects more than benefit. Aripiprazole, used as an add-on in depression, is a partial agonist at dopamine receptors."}
:::

### Important risks
| Risk | Who and what | Action |
|---|---|---|
| **Serotonin syndrome** | Confusion, agitation, sweating, fever, fast heart, **clonus**, overactive reflexes; from combining serotonergic drugs (MAOIs, tramadol, linezolid, pethidine, St John's wort, high-dose combinations) | Stop the drugs; emergency care; cyproheptadine in specialist hands |
| **Low sodium** (hyponatraemia) | Older adults, diuretics; SSRIs and SNRIs | Check sodium at baseline and early; ask about confusion, falls |
| **Bleeding** | SSRIs with NSAIDs, aspirin, anticoagulants | Avoid the combination or add a stomach-protecting medicine |
| **QT prolongation** | Citalopram, escitalopram (dose-related), tricyclics | ECG if cardiac risk; respect maximum doses |
| **Switch to mania** | People with bipolar disorder | Screen for past highs; avoid monotherapy |
| **Falls** | Older adults on TCAs, mirtazapine | Lowest effective dose |

:::clinician
:::widget synapse
{"drug": "maoi", "caption": "An MAOI stops the enzyme that breaks down serotonin, noradrenaline and dopamine inside the nerve ending. Watch the levels rise. The same enzyme in the gut normally breaks down tyramine from foods, which is why aged cheese can cause a dangerous rise in blood pressure."}
:::

### Interactions worth memorising
- **Fluoxetine and paroxetine** strongly inhibit CYP2D6: raise levels of tricyclics, some antipsychotics, metoprolol; reduce activation of **tamoxifen** (avoid) and codeine.
- **Fluvoxamine** inhibits CYP1A2 and 2C19: raises clozapine, olanzapine, theophylline and caffeine.
- **Sertraline, citalopram, escitalopram** have fewer interactions; omeprazole can raise citalopram and escitalopram (CYP2C19).
- **MAOIs**: avoid serotonergic drugs and tyramine-rich foods; a washout gap is needed when switching to or from them, longest after fluoxetine.
- **Tramadol** with SSRIs: serotonin syndrome and seizures.
- **Lithium** with SSRIs: rare serotonin toxicity; monitor.

### Pregnancy and breastfeeding (outline)
Untreated depression also carries risks. Sertraline is often preferred; paroxetine is avoided in the first trimester because of cardiac malformation concerns. Late-pregnancy SSRI exposure carries a small risk of neonatal adaptation symptoms and persistent pulmonary hypertension of the newborn. Sertraline and paroxetine pass into breast milk least. Decide with the woman, an obstetrician and, ideally, a perinatal psychiatrist.
:::

:::widget curve
{"kind": "half-life", "title": "Half-life and steady state", "caption": "Slide the half-life. Fluoxetine and its active metabolite last for days, so levels build slowly, take long to settle, and fade gently when it is stopped: few discontinuation symptoms. Paroxetine and venlafaxine have short half-lives: levels fall fast after a missed dose, which is why stopping them suddenly causes the worst discontinuation symptoms."}
:::

:::recall
1. Expand FINISH. || Flu-like, insomnia, nausea, imbalance, sensory disturbances, hyperarousal.
2. Which antidepressants cause the worst discontinuation symptoms, and the least? || Paroxetine and venlafaxine; fluoxetine.
3. Give the three groups of serotonin syndrome signs. || Mental (confusion, agitation), autonomic (sweating, fever, fast heart), neuromuscular (clonus, overactive reflexes).
4. Which SSRIs carry a dose-related QT risk? || Citalopram and escitalopram.
5. Why avoid fluoxetine or paroxetine with tamoxifen? || CYP2D6 inhibition reduces tamoxifen's activation.
:::

:::mcq
Q: A 72-year-old woman started on sertraline becomes confused and falls. The first test to check is:
- Serum lithium
- *Serum sodium
- EEG
- Serum calcium
> SSRI-associated hyponatraemia is commonest in older adults.

Q: A man on escitalopram is prescribed tramadol for back pain. Two days later he is agitated, sweating, with clonus and a fever. Most likely:
- Neuroleptic malignant syndrome
- *Serotonin syndrome
- Discontinuation syndrome
- Anxiety attack
> Two serotonergic drugs; clonus is the key sign.
:::

## 4.4 Psychological therapies [core][beginner]
Talking therapies are as effective as medicines for mild to moderate depression, and the combination is best for moderate to severe depression. Their effects can last after treatment ends.

| Therapy | Main idea | Typical length |
|---|---|---|
| **Cognitive behavioural therapy (CBT)** | Spot negative automatic thoughts, test them against evidence, try behavioural experiments, change core beliefs | About 12 to 20 sessions |
| **Behavioural activation (BA)** | Schedule rewarding and meaningful activity; act first, mood follows; tackle avoidance | Fewer sessions; can be delivered by trained non-specialists |
| **Interpersonal therapy (IPT)** | Link mood to one of four areas: grief, role disputes, role transitions, interpersonal deficits | About 12 to 16 sessions |
| **Problem-solving therapy** | Define a problem, list options, choose, try, review | Brief |
| **Mindfulness-based cognitive therapy (MBCT)** | Notice thoughts without being carried by them | Group; prevents relapse after 3 or more episodes |
| **Psychodynamic therapy** | Understand repeating patterns from early relationships | Brief or long-term |

### Therapy at scale: lessons from India and beyond
- **Healthy Activity Program (HAP)**, developed by Sangath in Goa, trains lay counsellors to deliver behavioural activation in primary care. In a large trial it improved remission from moderate to severe depression and was cost-effective.
- **Thinking Healthy Programme**, from Pakistan, uses community health workers to deliver CBT-based help to depressed mothers, and has been adapted in India.
- **Friendship Bench**, from Zimbabwe, uses trained grandmothers on park benches to deliver problem-solving therapy.
These show that good therapy does not always need a specialist, which matters where specialists are few.

:::widget sort
{"prompt": "Which therapy is this session most like?", "buckets": ["CBT", "Behavioural activation", "Interpersonal therapy"], "items": [{"text": "'What's the evidence for and against the thought that you're a failure?'", "bucket": 0}, {"text": "'Let's plan two small things you used to enjoy for tomorrow, and rate your mood after.'", "bucket": 1}, {"text": "'Your low mood started when you moved cities for marriage. Let's look at this role change.'", "bucket": 2}, {"text": "'Let's test the prediction that your friends will ignore you if you message them.'", "bucket": 0, "why": "A behavioural experiment tests a belief: classic CBT."}, {"text": "'You've been avoiding the gym. What's the smallest first step?'", "bucket": 1}, {"text": "'You and your mother-in-law keep clashing over the same issue. Let's map that dispute.'", "bucket": 2}]}
:::

:::recall
1. Name the four problem areas of IPT. || Grief, role disputes, role transitions, interpersonal deficits.
2. What is the core idea of behavioural activation? || Act first, mood follows; schedule rewarding activity and reduce avoidance.
3. Who benefits most from MBCT? || People with three or more past episodes, to prevent relapse.
4. What is the Healthy Activity Program? || A behavioural activation programme delivered by lay counsellors in primary care, developed by Sangath in Goa.
:::

:::mcq
Q: A new mother in a village is depressed after childbirth. There is no psychologist nearby. Which approach has the best evidence?
- Wait until a psychiatrist visits
- *A CBT-based programme delivered by trained community health workers
- High-dose tricyclic
- Advice to rest only
> The Thinking Healthy Programme shows community health workers can deliver effective help.
:::

## 4.5 When the first treatment fails, and ECT [core][beginner]
:::widget guess
{"prompt": "Out of every 100 people starting their first antidepressant, about how many do not respond to it?", "min": 0, "max": 100, "step": 5, "unit": "in 100", "answer": [25, 40], "reveal": "About a third. That is why a clear plan for 'what next' matters from day one. The large STAR*D study showed that each further step helps some more people, but with smaller gains, and no single next step clearly beat the others.", "clinician": "Roughly a third do not respond to the first antidepressant. In STAR*D, remission rates fell with each successive step; later re-analyses suggest the cumulative remission figure originally reported was optimistic. No switching or augmentation strategy was clearly superior."}
:::

### Step by step
1. **Optimise**: a therapeutic dose, taken every day, for a fair trial.
2. **Recheck**: diagnosis (bipolar? psychosis? substance? thyroid?), adherence, stressors, personality factors.
3. **Switch**: to another SSRI or a different class (SNRI, mirtazapine, bupropion, vortioxetine).
4. **Augment**: lithium, an atypical antipsychotic (aripiprazole, quetiapine), or thyroid hormone (T3).
5. **Combine**: two antidepressants with different actions, for example an SSRI plus mirtazapine.
6. **Treatment-resistant depression**: failure of **at least 2 adequate trials**. Options include ECT, esketamine nasal spray (where available), rTMS, and specialist combinations.

:::clinician
:::widget receptor
{"receptor": "D2", "caption": "Aripiprazole, a common add-on in depression that has not responded, is a partial agonist at D2 receptors. Switch between full agonist, partial agonist and antagonist and watch the signal bar: a partial agonist steadies dopamine signalling, raising it where it is low and lowering it where it is high. That is why it causes restlessness (akathisia) more than sedation."}
:::

### Augmentation doses (for learning; check current guidelines)
| Option | Typical dose | Notes |
|---|---|---|
| Lithium | Titrate to a plasma level around 0.4 to 0.8 mmol/L (lower levels may work in unipolar depression) | Best evidence among augmenters; anti-suicidal; monitor as in bipolar disorder |
| Aripiprazole | 2 to 10 mg (up to 15 mg) | Akathisia; little weight gain |
| Quetiapine XR | 150 to 300 mg | Sedation, weight, metabolic effects |
| Liothyronine (T3) | 20 to 50 micrograms | Monitor thyroid function and heart |
| Mirtazapine added to an SSRI or SNRI | 15 to 45 mg at night | Common combination; weight gain |
:::

:::widget flow
{"title": "When the first treatment fails", "layout": "chain", "nodes": [{"id": "a", "label": "Optimise", "detail": "A therapeutic dose, taken every day, for a fair trial. Many 'failures' are really low doses or missed tablets."}, {"id": "b", "label": "Recheck", "detail": "Is it bipolar? Psychotic? Alcohol? Thyroid? Ongoing abuse or debt? A personality factor?"}, {"id": "c", "label": "Switch", "detail": "To another SSRI, or another class: an SNRI, mirtazapine, bupropion or vortioxetine."}, {"id": "d", "label": "Augment", "detail": "Add lithium, an atypical antipsychotic such as aripiprazole or quetiapine, or thyroid hormone."}, {"id": "e", "label": "Combine", "detail": "Two antidepressants with different actions, such as an SSRI with mirtazapine."}, {"id": "f", "label": "Treatment-resistant care", "detail": "After at least two adequate trials: ECT, esketamine where available, rTMS, specialist combinations."}], "caption": "Keep the psychological therapy going at every step. No single next step has been shown to beat the others."}
:::

:::widget pathways
{"system": "dopamine", "caption": "Psychotic depression is treated with an antidepressant plus an antipsychotic (or with ECT). Turn on D2 block, then add serotonin 2A block, and see each pathway: easing of delusions in the mesolimbic pathway, and the side effects that come from the other three."}
:::

### Electroconvulsive therapy (ECT)
- **Indications**: severe depression with psychosis, high suicide risk, refusal of food and fluids, catatonia or stupor, previous good response, treatment resistance, and severe depression in pregnancy when medicines are risky.
- **How it is given**: under brief general anaesthesia with a muscle relaxant (succinylcholine), with oxygen and monitoring. A brief electrical stimulus produces a controlled seizure, aiming for about 25 seconds or more on EEG.
- **Course**: usually 2 to 3 sessions a week, 6 to 12 in all; response can begin after a few sessions.
- **Electrode placement**: bilateral is fastest and strongest but affects memory more; right unilateral at higher dose has fewer memory effects.
- **Side effects**: headache, muscle aches, short-term confusion, memory loss around the treatment period (mostly recovers; some gaps can remain).
- **No absolute contraindications.** Main relative ones: raised intracranial pressure, recent heart attack or stroke, high anaesthetic risk.
- **After the course**: continuation ECT or medicines, because relapse is high without them.
- **In India**: the Mental Healthcare Act 2017 bans ECT without anaesthesia and muscle relaxant. ECT for a minor needs the guardian's informed consent and prior permission from the Mental Health Review Board.

:::sounds Explaining ECT to a family
"ECT today is not like the old films. Your mother will be fully asleep under anaesthesia, and a medicine relaxes her muscles so her body hardly moves. A small current causes a brief, controlled seizure in the brain for less than a minute. Most people wake within minutes, a little confused for a while. It is one of the most effective treatments we have for severe depression like hers."
:::

:::widget flow
{"title": "One ECT session, step by step", "layout": "chain", "nodes": [{"id": "a", "label": "Consent and checks", "detail": "Informed consent (or the legal process if capacity is lacking), fasting, a physical check, and any medicines that raise seizure threshold reviewed."}, {"id": "b", "label": "Anaesthesia", "detail": "A short general anaesthetic: the person is fully asleep."}, {"id": "c", "label": "Muscle relaxant", "detail": "Succinylcholine relaxes the muscles so the body hardly moves. Oxygen is given."}, {"id": "d", "label": "Brief stimulus", "detail": "A short electrical pulse through electrodes, placed on both sides or on the right side only."}, {"id": "e", "label": "Controlled seizure", "detail": "A seizure of about 25 seconds or more on the EEG. Heart and oxygen are monitored throughout."}, {"id": "f", "label": "Recovery", "detail": "Waking within minutes; some confusion and headache for a while. The next session is usually two or three days later."}], "caption": "The Mental Healthcare Act 2017 forbids ECT without anaesthesia and a muscle relaxant."}
:::

### Other brain stimulation
| Method | What it is | Use |
|---|---|---|
| rTMS | A magnetic coil over the **left dorsolateral prefrontal cortex**; awake, no anaesthesia; daily sessions | Depression not helped by medicines; scalp discomfort, headache; seizures rare |
| tDCS | Weak current through scalp electrodes | Research and some clinical use |
| Vagus nerve stimulation | Implanted device | Chronic resistant depression (specialist) |
| Deep brain stimulation | Implanted electrodes | Research for very resistant depression |

:::recall
1. List the six steps when the first treatment fails. || Optimise, recheck, switch, augment, combine, treat as TRD.
2. Define treatment-resistant depression. || Failure of at least 2 adequate antidepressant trials.
3. Give five indications for ECT. || Psychotic depression, high suicide risk, refusing food and fluids, catatonia, treatment resistance (also pregnancy, past response).
4. Which muscle relaxant is used in ECT, and what seizure length is aimed for? || Succinylcholine; about 25 seconds or more.
5. Where is the rTMS coil placed for depression? || Left dorsolateral prefrontal cortex.
:::

:::mcq
Q: A 70-year-old has stopped eating and drinking, believes her intestines have rotted, and is losing weight fast. The most appropriate treatment is:
- Wait for an SSRI to work
- *ECT, given life-threatening refusal and psychotic features
- A benzodiazepine only
- Psychotherapy only
> Psychotic depression with food and fluid refusal is a classic ECT indication.

Q: Compared with bilateral ECT, right unilateral ECT:
- Works faster
- *Has fewer memory side effects
- Needs no anaesthesia
- Is banned in older adults
> Bilateral is faster and stronger but affects memory more.
:::

## 4.6 Course and prognosis [core][beginner]
- An untreated episode lasts about **6 to 13 months**; most treated episodes last about **3 months**.
- Depression tends to **come back**. About half of people have another episode after a first; the risk rises with each episode.
- Episodes may become more frequent and longer over time.
- Persistent depressive disorder often lasts years; about a quarter never fully recover.
- **Residual symptoms** after an episode are one of the strongest predictors of relapse: treat to full remission.

| Better outlook | Worse outlook |
|---|---|
| Mild episode, no psychosis | Severe or psychotic episode |
| Full recovery between episodes | Residual symptoms |
| Good support, stable family | Poor support, ongoing stressors |
| Good functioning before | Early onset, chronic course |
| Few previous episodes | Many episodes; comorbid anxiety, substance use or personality disorder |

:::widget moodline
{"prompt": "Read Sushma's mood over five years. What does the line tell you about planning her treatment?", "series": [0, -2.6, -2.8, -1.2, -1, -1.1, -2.7, -2.9, -1.3, -1.1, -2.8, -1.2], "labels": ["Year 1", "Year 2", "Year 3", "Year 4", "Year 5"], "options": ["She recovers fully each time; stop treatment after each episode", "Recurrent episodes with incomplete recovery in between; treat to full remission and continue long term", "This is bipolar disorder", "This is normal mood variation"], "answer": 1, "why": "Each episode is followed by a partial lift that never reaches her usual self, then another drop. Residual symptoms drive relapse. Aim for full remission, consider longer-term medicine and relapse-prevention therapy such as MBCT. No highs, so not bipolar."}
:::

:::widget flow
{"title": "Kindling: why each episode makes the next easier", "layout": "cycle", "nodes": [{"id": "a", "label": "Major stress", "detail": "The first episode usually follows a big loss or humiliation."}, {"id": "b", "label": "Episode", "detail": "Stress hormones, poor sleep and inflammation run high for months."}, {"id": "c", "label": "Brain is sensitised", "detail": "Stress systems and mood circuits are left more reactive, a little like a path worn into grass."}, {"id": "d", "label": "Lower threshold", "detail": "Next time a smaller stress is enough, and later episodes can start with no clear trigger at all."}], "caption": "This 'kindling' idea comes from epilepsy research. It fits the finding that recurrence risk rises with each episode, and it is one reason to treat to full remission and to continue treatment. The evidence is mixed: not everyone follows this path."}
:::

:::recall
1. How long does an untreated episode last, and a treated one? || About 6 to 13 months; about 3 months.
2. What is the single strongest predictor of relapse after an episode? || Residual symptoms (incomplete remission).
3. Name four good and four poor prognostic factors. || See the table.
:::

:::mcq
Q: Which feature predicts a WORSE course of depression?
- Acute onset with a clear stressor
- Good social support
- *Residual symptoms after the episode improves
- A first episode with full recovery
> Incomplete recovery strongly predicts relapse.
:::

## 4.7 Level check · Beginner [beginner]
Twelve or more right out of fifteen (80%) opens the Advanced level.

:::mcq
Q: Criterion A of a major depressive episode requires:
- Three of nine symptoms
- *Five of nine, including depressed mood or loss of interest
- Depressed mood alone
- Five of nine, any combination
> One of the two core symptoms must be present.

Q: Which finding in the history converts a depressive diagnosis to bipolar disorder?
- A family history of depression
- *A past hypomanic episode
- Atypical features alone
- Anxiety
> Criterion E: never a manic or hypomanic episode.

Q: Mood reactivity, hypersomnia, weight gain and leaden paralysis describe:
- Melancholic features
- *Atypical features
- Catatonia
- Seasonal pattern
> Mood reactivity is the core of atypical features.

Q: "With mixed features" in a depressive episode means:
- Anxiety and depression together
- *Three or more manic or hypomanic symptoms on most days
- Psychotic and non-psychotic symptoms
- Mood swings within a day
> A warning sign of bipolarity.

Q: Persistent depressive disorder in an adult requires depressed mood more days than not for at least:
- 6 months
- 1 year
- *2 years
- 5 years
> One year in children and teenagers.

Q: Grief differs from depression mainly because in grief:
- *Pain comes in waves and self-esteem is kept
- Self-esteem collapses
- Anhedonia is pervasive
- Psychosis is common
> Classic distinction.

Q: In the MSE of a depressed man, "long pauses before answering" belongs under:
- Thought
- *Speech
- Perception
- Cognition
> Increased reaction time reflects psychomotor retardation.

Q: Before diagnosing depression in a woman with weight gain, cold intolerance and dry skin, check:
- Lithium level
- *Thyroid function
- EEG
- Urine drug screen only
> Hypothyroidism mimics depression.

Q: The strongest single risk factor for suicide is:
- Female sex
- *A previous suicide attempt
- Living in a city
- Being a student
> Ask about past attempts in every assessment.

Q: In a 5 Ps formulation, nightly drinking that worsens mood is a:
- Predisposing factor
- Precipitating factor
- *Perpetuating factor
- Protective factor
> It keeps the depression going and is a treatment target.

Q: A moderate first episode with no risk is best treated with:
- ECT
- *An SSRI plus a psychological therapy
- A benzodiazepine
- Lithium alone
> Step 3 of stepped care.

Q: If there is no improvement at all after a fair trial of an antidepressant at a good dose, you should:
- Continue unchanged for a year
- *Recheck diagnosis and adherence, then raise the dose or switch
- Stop all treatment
- Add a benzodiazepine long term
> No early improvement predicts non-response on that drug.

Q: Clonus, fever, sweating and agitation after adding tramadol to an SSRI suggest:
- Neuroleptic malignant syndrome
- *Serotonin syndrome
- Discontinuation symptoms
- Lithium toxicity
> Clonus is the key sign.

Q: Treatment-resistant depression usually means failure of:
- One week of treatment
- *At least two adequate antidepressant trials
- Psychotherapy alone
- Any single medicine
> Two adequate trials of adequate dose and duration.

Q: The main relative contraindication to ECT is:
- Pregnancy
- Old age
- *Raised intracranial pressure
- Psychotic depression
> Pregnancy and age are not contraindications.
:::

# Part V · Advanced: mechanisms

## 5.1 Inside the synapse: receptor-level pharmacology [core][advanced]
This level assumes you know the Beginner material. Here we look at what each medicine does at the receptor, because that predicts both benefit and side effects.

### SSRIs: why the delay, and why early side effects
1. The SSRI blocks **SERT**, the serotonin transporter, on the sending neuron. Serotonin rises first not at the nerve terminal but around the cell body in the **raphe nuclei**, where **5HT1A somatodendritic autoreceptors** sense it.
2. Those autoreceptors act as a brake: more serotonin there **reduces** firing. So at first, the net change at the terminals in the cortex is modest.
3. With continued exposure, the 5HT1A autoreceptors **desensitise and downregulate**. The brake comes off, the neuron fires more, and serotonin release at the terminals rises.
4. Postsynaptic receptors also adapt (some 5HT2A downregulation), and downstream signalling changes gene expression, including **BDNF**.

:::widget flow
{"title": "Why SSRIs take time: the autoreceptor story", "layout": "chain", "nodes": [{"id": "a", "label": "SERT blocked", "detail": "Within hours the SSRI blocks the serotonin transporter."}, {"id": "b", "label": "Serotonin rises at the cell body", "detail": "Around the raphe neurons first, not yet much at the far terminals."}, {"id": "c", "label": "5HT1A brake on", "detail": "Somatodendritic 5HT1A autoreceptors sense the serotonin and slow firing. Net effect in the cortex is small."}, {"id": "d", "label": "Brake wears off", "detail": "With continued exposure the autoreceptors desensitise and downregulate."}, {"id": "e", "label": "Firing and release climb", "detail": "Raphe neurons fire more, so serotonin release at cortical terminals rises."}, {"id": "f", "label": "Downstream rebuilding", "detail": "Postsynaptic receptors adapt, gene expression shifts, BDNF rises and connections are rebuilt. Mood follows."}], "caption": "Side effects use the fast steps; benefit needs the slow ones. That mismatch is what you explain to patients in the first days."}
:::

Early side effects come from serotonin reaching **other receptors** before the slow adaptations:
- **5HT3** in the brainstem and gut: nausea, vomiting, loose stools.
- **5HT2A** and **5HT2C**: restlessness, insomnia, early anxiety (2C), sexual dysfunction (2A in spinal and cortical pathways; also serotonin's brake on dopamine).
- Many fade as receptors desensitise; sexual dysfunction often persists.

:::widget reveal
{"prompt": "Why might adding pindolol (a beta-blocker that also blocks 5HT1A autoreceptors) to an SSRI speed up response, at least in theory?", "answer": "Blocking the 5HT1A autoreceptor removes the brake on raphe firing straight away, instead of waiting for it to desensitise. Studies were mixed, partly because standard pindolol doses may not occupy enough autoreceptors, but the idea shows how the delay is thought to work. Vilazodone and vortioxetine were designed with 5HT1A activity partly for this reason."}
:::

:::widget brainmap
{"title": "Where the monoamine pathways run", "focus": ["brainstem", "prefrontal", "hippocampus", "basal-ganglia", "hypothalamus"], "notes": {"brainstem": "The raphe nuclei (serotonin) and locus coeruleus (noradrenaline) sit here and send fibres across the whole brain. The SSRI story begins with raphe autoreceptors.", "prefrontal": "Receives serotonin, noradrenaline and dopamine. Few dopamine transporters here, so NET also clears dopamine; blocking NET raises prefrontal dopamine.", "hippocampus": "Serotonin and noradrenaline support neurogenesis and plasticity here; chronic stress and cortisol work against them.", "basal-ganglia": "The ventral striatum (nucleus accumbens) receives dopamine from the ventral tegmental area. Blunted reward responses here fit anhedonia.", "hypothalamus": "Serotonin and noradrenaline tune sleep, appetite and the HPA axis, the body symptoms of depression."}, "caption": "Tap each region. Antidepressant side effects and benefits both depend on which pathway a drug touches."}
:::

### The others, receptor by receptor
| Drug | Key actions | What follows clinically |
|---|---|---|
| **SNRIs** (venlafaxine, duloxetine) | SERT plus NET inhibition (venlafaxine: NET only at higher doses). In the prefrontal cortex there are few dopamine transporters, so NET also clears dopamine; blocking NET raises prefrontal dopamine | More energy, pain relief (descending noradrenergic pain pathways), but sweating, raised blood pressure, tachycardia |
| **Mirtazapine** | Alpha-2 antagonist (removes the noradrenergic brake on both noradrenaline and serotonin release); 5HT2A, 5HT2C and 5HT3 antagonist; strong **H1** antagonist | Sleep and appetite improve (H1, 5HT2C), little nausea (5HT3 block), little sexual dysfunction (5HT2A block); weight gain |
| **Bupropion** | Weak NET and DAT inhibitor (an NDRI); active metabolites | Activating; no sexual dysfunction; dose-related seizure risk |
| **Trazodone** | Strong 5HT2A antagonist, weaker SERT inhibition, H1 and alpha-1 antagonist | At low doses a sleep medicine; at high doses an antidepressant; priapism (rare), postural hypotension |
| **Vortioxetine** | SERT inhibitor; 5HT1A agonist; 5HT1B partial agonist; 5HT1D, 5HT3 and 5HT7 antagonist | Possible cognitive benefit; nausea common |
| **Agomelatine** | MT1 and MT2 melatonin agonist; 5HT2C antagonist (raises dopamine and noradrenaline in the prefrontal cortex) | Resets body clock; few sexual effects; liver monitoring |
| **Tricyclics** | SERT and NET inhibition, plus H1, M1 (muscarinic) and alpha-1 antagonism, and **sodium channel** blockade | Sleepy and hungry (H1), dry mouth, constipation, blurred vision, urinary retention, confusion (M1), dizziness on standing (alpha-1); heart block and seizures in overdose (sodium channels) |
| **MAOIs** | Block monoamine oxidase A (and B), raising serotonin, noradrenaline and dopamine | Tyramine in aged cheese, cured meats, fermented foods can trigger a hypertensive crisis; serotonin syndrome with serotonergic drugs. Moclobemide is reversible and needs fewer diet limits |

:::widget sort
{"prompt": "A tricyclic blocks several unwanted receptors. Which block causes each side effect?", "buckets": ["Histamine H1 block", "Muscarinic M1 block", "Alpha-1 block"], "items": [{"text": "Daytime sleepiness", "bucket": 0}, {"text": "Weight gain", "bucket": 0}, {"text": "Dry mouth", "bucket": 1}, {"text": "Constipation", "bucket": 1}, {"text": "Blurred vision and urinary retention", "bucket": 1}, {"text": "Dizziness on standing up", "bucket": 2}, {"text": "Confusion in an older adult", "bucket": 1, "why": "Anticholinergic load is a common cause of delirium in the elderly."}, {"text": "Falls from low blood pressure", "bucket": 2}]}
:::

:::clinician
### Translating receptors into prescribing
- Insomnia and poor appetite prominent: a drug with H1 and 5HT2A or 2C block (mirtazapine), or low-dose trazodone added at night.
- Fatigue, sleepiness, sexual concerns: bupropion, or add bupropion to an SSRI.
- Pain: an SNRI (duloxetine) or a low-dose tricyclic.
- Older adult, falls, cognitive concerns: avoid strong M1, H1 and alpha-1 blockers; prefer sertraline, escitalopram (within QT limits), vortioxetine or mirtazapine at low dose with care.
- SSRI-induced sexual dysfunction: lower dose, switch (to mirtazapine, bupropion, vortioxetine, agomelatine), or add bupropion; sildenafil helps erectile problems.
:::

:::recall
1. Why does SSRI benefit lag behind SERT blockade? || 5HT1A autoreceptors first brake raphe firing, then desensitise over time; downstream adaptations follow.
2. Which receptor causes early SSRI nausea? || 5HT3.
3. Why does NET inhibition raise dopamine in the prefrontal cortex? || There are few dopamine transporters there, so NET clears dopamine too.
4. Give mirtazapine's four key receptor actions. || Alpha-2 antagonism; 5HT2A, 5HT2C, 5HT3 antagonism; H1 antagonism.
5. Why are tricyclics cardiotoxic in overdose? || Sodium channel blockade.
:::

:::mcq
Q: Why does mirtazapine cause little nausea compared with an SSRI?
- It does not raise serotonin
- *It blocks 5HT3 receptors
- It is given at night
- It blocks H1 receptors
> 5HT3 antagonism protects against serotonin-driven nausea.

Q: A man on phenelzine eats aged cheese at a wedding and develops a severe headache and very high blood pressure. The mechanism is:
- Serotonin syndrome
- *Tyramine is not broken down in the gut, releasing noradrenaline
- Anticholinergic toxicity
- Lithium toxicity
> MAO-A in the gut normally breaks down dietary tyramine.
:::

## 5.2 Circuits, stress and plasticity [core][advanced]
### The stress system in detail
- You met the CRH, ACTH and cortisol chain in 2.1. The switch-off depends on two receptor types: high-affinity **mineralocorticoid receptors**, which set the resting tone, and lower-affinity **glucocorticoid receptors** in the hippocampus, hypothalamus and pituitary, which are occupied when cortisol is high and do most of the braking (negative feedback).
- In many people with severe, melancholic or psychotic depression, feedback is weak: cortisol stays high and fails to fall after **dexamethasone** (the dexamethasone suppression test, now a research tool, not a diagnostic test).
- High cortisol over time reduces hippocampal neurogenesis and dendrite branching, linking stress, memory problems and depression.
- Early adversity can programme the stress system, partly through **epigenetic** changes (chemical tags that alter how genes are read, for example on the glucocorticoid receptor gene).

### Neurotrophic and glutamate story
- **BDNF**, acting on **TrkB** receptors, supports synapse growth. Stress lowers BDNF; antidepressants, ECT and exercise raise it.
- Chronic stress causes loss of dendritic **spines** (the points where synapses form) in the prefrontal cortex.
- Fast-acting treatments such as ketamine trigger a glutamate burst, AMPA receptor activation, BDNF release and **mTOR** signalling, which rebuilds spines within hours to days (see 5.3).

:::widget flow
{"title": "The neurotrophic story, from stress to repair", "layout": "chain", "nodes": [{"id": "a", "label": "Chronic stress", "detail": "Long-running cortisol and excess glutamate signalling."}, {"id": "b", "label": "BDNF falls", "detail": "Less brain-derived neurotrophic factor acting on TrkB receptors."}, {"id": "c", "label": "Spines and dendrites shrink", "detail": "Fewer synaptic spines in the prefrontal cortex and hippocampus; less neurogenesis in the hippocampus."}, {"id": "d", "label": "Circuits weaken", "detail": "Prefrontal control over the amygdala and reward circuits loosens. Rumination and negative bias grow."}, {"id": "e", "label": "Treatments raise BDNF", "detail": "Antidepressants slowly, ECT and exercise over a course, ketamine within hours via mTOR."}, {"id": "f", "label": "Spines regrow", "detail": "Connections are rebuilt, and new learning (for example in therapy) can take hold."}], "caption": "This model links stress, slow antidepressant action and fast-acting treatments in one line. It is supported mainly by animal and post-mortem work, with indirect human evidence."}
:::

### Circuits
| Circuit | Finding in depression | Link to symptoms |
|---|---|---|
| Reward (ventral striatum, nucleus accumbens, dopamine from the ventral tegmental area) | Blunted response to reward and to its anticipation | Loss of pleasure and motivation |
| Threat (amygdala) | Overactive to negative faces and words | Anxiety, negative bias |
| Control (dorsolateral prefrontal cortex) | Underactive | Poor concentration, rumination not stopped |
| Subgenual anterior cingulate (Brodmann area 25) | Overactive; target of deep brain stimulation trials | Sadness, self-focus |
| Default mode network | Overconnected | Rumination, self-referential thinking |

:::widget brainmap
{"title": "Circuits of depression", "focus": ["prefrontal", "amygdala", "basal-ganglia", "hippocampus", "thalamus"], "notes": {"prefrontal": "Dorsolateral prefrontal cortex: underactive control, the target of rTMS. Subgenual anterior cingulate (area 25), just beneath the front: overactive, the target of deep brain stimulation trials.", "amygdala": "Hyper-responsive to negative faces and words; this bias can shift within hours of a first antidepressant dose, before mood changes.", "basal-ganglia": "Ventral striatum: blunted response to reward and to its anticipation, the circuit of anhedonia.", "hippocampus": "Reduced volume with long or repeated episodes; links to memory complaints and to cortisol feedback.", "thalamus": "A relay in the limbic-cortical loops; some imaging studies show altered thalamic activity, though findings vary."}, "caption": "Imaging findings are group averages with small effects. None of them can yet diagnose depression in an individual."}
:::

### Sleep and the body clock
- The REM changes from 2.1 (earlier, denser REM, less slow-wave sleep) are thought to reflect a weaker monoamine brake on REM-generating cholinergic neurons. Most SSRIs, SNRIs, tricyclics and MAOIs suppress REM, but mirtazapine and bupropion barely do and still work, so REM suppression is not needed for benefit.
- **Sleep deprivation** for one night can lift mood within a day in many depressed people, but the effect usually reverses after recovery sleep. "Triple chronotherapy" (sleep deprivation, sleep phase advance and bright light) tries to hold the gain.
- Bright light therapy helps seasonal depression and has some evidence in non-seasonal depression.

:::widget reveal
{"prompt": "Deep brain stimulation trials targeted area 25 because it was overactive in depression and normalised with recovery. Why did later large trials disappoint, and what is being tried now?", "answer": "Early open studies looked dramatic, but larger controlled trials did not separate clearly from sham stimulation in the planned time. Possible reasons: wrong patients, imprecise targeting, and too short a blinded phase. Newer work uses each person's own brain-wiring scans (tractography) to place electrodes, and 'closed-loop' devices that stimulate only when a mood-related brain signal appears. It is still experimental."}
:::

:::recall
1. What does the dexamethasone suppression test show in many severely depressed people? || Cortisol fails to fall: weak HPA negative feedback.
2. What is TrkB? || The receptor for BDNF.
3. Which circuit is linked to anhedonia? || The reward circuit: ventral striatum and dopamine from the VTA.
4. What happens to mood after one night of sleep deprivation, and then after recovery sleep? || Often lifts within a day, then usually relapses.
:::

:::mcq
Q: Rumination in depression is most linked to overconnectivity of which network?
- The motor network
- *The default mode network
- The visual network
- The cerebellar network
> The default mode network supports self-referential thought.
:::

## 5.3 Fast-acting treatments: ketamine, esketamine and neurosteroids [core][advanced]
### Ketamine and esketamine
- **Mechanism**: ketamine blocks **NMDA** glutamate receptors. A leading model: it blocks NMDA receptors on inhibitory interneurons more than on main neurons, so the interneurons quieten and main neurons release a **burst of glutamate**. Glutamate acts on **AMPA** receptors, releasing BDNF and switching on **mTOR**, which rapidly grows new synaptic spines. Other proposals include direct effects of metabolites and blocking NMDA receptors that are active at rest.
- **Evidence**: a single low-dose intravenous infusion can reduce depression within hours, including suicidal thinking, but the effect usually fades within days unless repeated.
- **Esketamine** (the S-form) is a nasal spray given in a certified clinic with monitoring.

:::widget guess
{"prompt": "After a single intravenous ketamine infusion for depression, when does improvement typically begin?", "min": 0, "max": 72, "unit": "hours", "answer": [2, 24], "reveal": "Within hours, often by the next day. That speed is why ketamine changed thinking about depression. The catch: the effect usually fades within days, so repeated doses are needed, raising questions about safety, dependence and cost.", "clinician": "Typical research dose is 0.5 mg/kg intravenously over 40 minutes. Effects appear within hours and peak around 24 hours. Esketamine nasal spray is dosed in the clinic (commonly 56 or 84 mg), with at least 2 hours of observation for dissociation, sedation and raised blood pressure."}
:::

| Esketamine, regulatory status (US) | |
|---|---|
| 2019 | Approved for treatment-resistant depression, with an oral antidepressant |
| 2020 | Approved for depressive symptoms in adults with MDD and acute suicidal thoughts or behaviour, with an oral antidepressant |
| 2025 | Approved as a monotherapy for treatment-resistant depression |

**Risks**: dissociation, sedation, raised blood pressure, nausea, possible misuse and dependence, bladder damage with heavy recreational ketamine use. It is given under a restricted programme in the US. Availability and approval elsewhere, including India, vary; check current status.

:::widget decide
{"scene": "Ishaan, 35, has treatment-resistant depression after three adequate trials. He has read about 'ketamine therapy' at a private wellness centre in Mumbai that offers home-use lozenges and a package of six sessions.", "ask": "What do you advise?", "choices": [{"label": "Tell him ketamine is a party drug and dangerous, end of discussion", "verdict": "ok", "outcome": "He goes to the centre anyway without telling you.", "why": "His concern is real and the evidence for ketamine in TRD is real. Dismissing it loses the chance to guide him safely."}, {"label": "Discuss the evidence honestly: rapid but often short-lived benefit; risks of dissociation, blood pressure rise and misuse; that it should be given under medical monitoring, not at home; and compare it with other TRD options such as ECT, lithium augmentation, rTMS or esketamine where legally available", "verdict": "best", "outcome": "Ishaan chooses lithium augmentation first and agrees to talk again before trying any ketamine-based treatment.", "why": "Informed choice, safety and the full menu of options. Unsupervised home use removes the monitoring that makes it safer."}, {"label": "Encourage the home lozenges because they are convenient", "verdict": "harm", "outcome": "He takes extra doses on bad days and becomes dependent.", "why": "Unmonitored, unregulated ketamine raises the risk of misuse and harm."}]}
:::

:::widget flow
{"title": "Ketamine: the glutamate burst model", "layout": "chain", "nodes": [{"id": "a", "label": "NMDA block on interneurons", "detail": "Ketamine blocks NMDA receptors, especially on fast-firing inhibitory interneurons."}, {"id": "b", "label": "Disinhibition", "detail": "With the interneurons quietened, the main pyramidal neurons are released from their brake."}, {"id": "c", "label": "Glutamate burst", "detail": "Pyramidal neurons release a surge of glutamate."}, {"id": "d", "label": "AMPA activation", "detail": "The glutamate acts on AMPA receptors, which is needed for the antidepressant effect in animal studies."}, {"id": "e", "label": "BDNF and mTOR", "detail": "BDNF is released and the mTOR pathway switches on protein synthesis."}, {"id": "f", "label": "New spines in hours", "detail": "Synaptic spines regrow quickly in the prefrontal cortex. The effect often fades within days unless repeated."}], "caption": "A leading model, not the only one. Other ideas involve ketamine's metabolites and NMDA receptors active at rest."}
:::

### Neurosteroids: a new target for postpartum depression
- **Allopregnanolone**, a natural brain steroid, rises in pregnancy and falls sharply after birth. It is a **positive allosteric modulator of GABA-A receptors**, acting on both synaptic receptors (like benzodiazepines) and extrasynaptic receptors (unlike benzodiazepines).
- **Brexanolone**, an intravenous form of allopregnanolone, was approved in the US in 2019 for postpartum depression. It needs a 60-hour infusion in hospital, with monitoring for oversedation.
- **Zuranolone**, an oral neurosteroid, was approved by the US FDA in August 2023 for postpartum depression. The same agency did **not** approve it for general major depression at that time.

:::widget guess
{"prompt": "Zuranolone for postpartum depression is taken once daily for a short fixed course. How many days?", "min": 1, "max": 60, "unit": "days", "answer": [14, 14], "reveal": "Fourteen days, taken in the evening with food. Improvement was seen within days in trials. It carries a boxed warning about impaired driving.", "clinician": "US label: 50 mg once daily in the evening with fat-containing food for 14 days. Boxed warning: do not drive or use machinery for at least 12 hours after each dose. Side effects include sleepiness, dizziness and confusion. Use in breastfeeding needs individual discussion. Check current approvals in your country."}
:::

:::widget journey
{"drug": "esketamine", "target": "NMDA glutamate receptors, especially on inhibitory interneurons in the prefrontal cortex", "routes": ["nasal", "iv"], "notes": {"nose": "Esketamine is sprayed into each nostril in a certified clinic. It skips the gut and much of the liver's first pass, which is why a nasal dose works at all: swallowed ketamine is heavily broken down by the liver.", "vein": "Research and off-label ketamine is given as a slow intravenous infusion over about 40 minutes.", "blood": "Levels peak within minutes to an hour. Dissociation and a rise in blood pressure track the peak, so the person is observed for at least two hours.", "out": "Cleared by liver enzymes to norketamine and other metabolites, some of which may add to the antidepressant effect."}, "caption": "Switch between the nasal and intravenous routes. Fast entry explains the fast effect, and also why monitoring after each dose is essential."}
:::

### Other newer antidepressants (US approvals)
- **Dextromethorphan with bupropion** (approved 2022): dextromethorphan is an NMDA antagonist and sigma-1 agonist; bupropion blocks CYP2D6 so dextromethorphan levels stay up. Faster onset than standard SSRIs in trials.
- **Gepirone** (approved 2023): a 5HT1A agonist with fewer sexual side effects.

:::recall
1. Describe the glutamate burst model of ketamine. || NMDA block on inhibitory interneurons, glutamate burst, AMPA activation, BDNF, mTOR, rapid spine growth.
2. Give the three US approvals of esketamine in order. || TRD with an oral antidepressant (2019); MDD with acute suicidality (2020); monotherapy for TRD (2025).
3. How do neurosteroids differ from benzodiazepines at GABA-A receptors? || They also act on extrasynaptic, benzodiazepine-insensitive receptors.
4. What is zuranolone approved for, and what is its main warning? || Postpartum depression; impaired driving.
:::

:::mcq
Q: Ketamine's rapid antidepressant effect is thought to begin with blockade of:
- SERT
- Dopamine D2 receptors
- *NMDA glutamate receptors
- MAO-A
> The downstream glutamate burst, AMPA activation and synaptogenesis follow.

Q: Which statement about zuranolone is TRUE as of late 2026?
- *It is FDA-approved for postpartum depression as a short oral course
- It is approved worldwide for all depression
- It is an SSRI
- It is given by 60-hour infusion
> The 60-hour infusion is brexanolone.
:::

# Part VI · Advanced: research frontiers

## 6.1 Psychedelics: claims and evidence [core][advanced]
Psychedelics are among the most talked-about ideas in psychiatry. This section separates what is shown from what is hoped.

### How they act
- **Classic psychedelics** (psilocybin, LSD, DMT) are **5HT2A agonists**. In the cortex this disrupts usual network patterns, loosens fixed beliefs (one model calls it "relaxing priors"), and in animal studies promotes rapid growth of dendritic spines.
- **MDMA** is not a classic psychedelic. It releases serotonin, noradrenaline and oxytocin through transporter reversal, and has been studied mainly for PTSD, not depression.

### Where the evidence stands (late 2026)
- **No classic psychedelic is FDA-approved** for any psychiatric use.
- **Psilocybin for treatment-resistant depression**: a large company-run phase 2b trial (published 2022) found a single 25 mg dose, given with psychological support, beat a 1 mg dose at the primary time point but not clearly later, and suicidal thoughts, behaviour and self-harm were reported in every dose group, a safety signal to watch. Two phase 3 trials, reported by the company in 2025 and 2026, met their main goals. In April 2026 the FDA granted a rolling review and a national priority voucher for the application. A decision is pending.
- **MDMA-assisted therapy for PTSD**: in August 2024 the FDA issued a complete response letter, declining approval and asking for a further phase 3 trial, citing significant limitations in the data.
- **Australia** has allowed specially authorised psychiatrists to prescribe psilocybin for treatment-resistant depression and MDMA for PTSD since July 2023.
- **India**: psilocybin and MDMA are controlled under the NDPS Act, with no approved medical use.

:::widget layers
{"title": "The evidence ladder for a new treatment", "shape": "stack", "layers": [{"label": "Regulatory approval and real-world use", "detail": "Approved by an agency for a specific use, then watched for rare harms. No classic psychedelic has reached this step."}, {"label": "Phase 3 trials", "detail": "Large, controlled, often several sites. Psilocybin for TRD reported phase 3 results; a decision is pending."}, {"label": "Phase 2 randomised trials", "detail": "Dose-finding against placebo or a low dose. Blinding often fails with psychedelics."}, {"label": "Open-label studies", "detail": "Everyone knows they got the drug; expectancy is high."}, {"label": "Case reports and enthusiasm", "detail": "Stories and media coverage. Useful for ideas, useless as proof."}], "caption": "Tap from the bottom up. Each rung controls for more bias. Hype usually lives on the bottom two."}
:::

### Why the evidence is hard to judge
- **Blinding fails**: people usually know whether they had the active drug, which inflates expectations.
- **Expectancy and hype**: enthusiastic media and selected participants.
- **Therapy confound**: the drug is given with hours of psychological support, so which part works?
- **Safety**: acute anxiety, raised blood pressure, rare prolonged psychosis in vulnerable people (exclude personal or family history of psychosis or bipolar I), and the risk of exploitation during altered states.

:::widget decide
{"scene": "Tara, 30, a designer in Goa with recurrent depression, tells you she has booked a 'mushroom ceremony' retreat next month. 'Studies say it cures depression,' she says. Her aunt has bipolar disorder.", "ask": "What is your best response?", "choices": [{"label": "Agree; the research is very positive, so she should go", "verdict": "harm", "outcome": "At the retreat she has a frightening experience, does not sleep for days, and becomes manic.", "why": "Trials exclude people with a family history of bipolar disorder for this reason. Retreat settings are unregulated, doses vary, and the substance is illegal in India."}, {"label": "Explain honestly: promising trials in tightly controlled settings, not approved, illegal in India; her family history raises the risk of mania or psychosis; and offer to review her current treatment and evidence-based options", "verdict": "best", "outcome": "Tara cancels and asks about a therapy she has not tried, and about joining a regulated clinical trial in future if one becomes available to her.", "why": "Respect her hope, give accurate evidence and specific risks, and keep her in care."}, {"label": "Refuse to discuss it and say you'll stop seeing her if she goes", "verdict": "ok", "outcome": "She goes anyway and stops attending.", "why": "Ultimatums push people away from care when they most need accurate advice."}]}
:::

:::recall
1. What receptor do classic psychedelics act on? || 5HT2A, as agonists.
2. What did the FDA decide on MDMA-assisted therapy in August 2024? || A complete response letter declining approval and requesting another phase 3 trial.
3. Is any classic psychedelic FDA-approved as of late 2026? || No; a psilocybin application is under review.
4. Give three reasons psychedelic trial results are hard to judge. || Failed blinding, expectancy and hype, therapy confound (and selected participants).
:::

:::mcq
Q: Which statement about psychedelic medicine is accurate as of late 2026?
- Psilocybin is FDA-approved for depression
- MDMA is FDA-approved for PTSD
- *No classic psychedelic is FDA-approved; psilocybin for TRD is under review
- Psychedelics are legal medicines in India
> Australia allows authorised prescribing; the US has not approved any.
:::

## 6.2 Inflammation, metabolism and GLP-1 medicines [core][advanced]
### Inflammation
- About a quarter of people with depression show **low-grade inflammation** (for example CRP above 3 mg/L). Rates are higher with obesity, childhood adversity and treatment resistance.
- **Cytokines** (IL-6, TNF-alpha) reach the brain and shift tryptophan away from serotonin towards the **kynurenine pathway** (via the enzyme IDO), producing quinolinic acid, which stimulates NMDA receptors. They also dampen dopamine in reward circuits, which fits with anhedonia and fatigue.
- **Interferon-alpha** treatment (for hepatitis C, in the past) caused depression in a large share of patients: a natural experiment.
- **Trials**: the anti-TNF drug infliximab did not help depression overall, but helped the subgroup with high CRP. Celecoxib, minocycline and omega-3 trials are mixed. Anti-inflammatory treatment for depression is **not** standard care; it is a research question about targeting a subgroup.

:::widget flow
{"title": "Inflammation and the kynurenine pathway", "layout": "chain", "nodes": [{"id": "a", "label": "Inflammation", "detail": "Obesity, chronic illness, childhood adversity or infection raise cytokines such as IL-6 and TNF-alpha."}, {"id": "b", "label": "IDO switched on", "detail": "Cytokines activate the enzyme indoleamine 2,3-dioxygenase."}, {"id": "c", "label": "Tryptophan diverted", "detail": "Tryptophan, the building block of serotonin, is pushed down the kynurenine pathway instead."}, {"id": "d", "label": "Quinolinic acid", "detail": "Microglia turn kynurenine into quinolinic acid, which stimulates NMDA receptors."}, {"id": "e", "label": "Mood and reward change", "detail": "Less serotonin, more glutamate excitotoxicity and dampened dopamine in reward circuits: fatigue, anhedonia, low mood."}], "caption": "This pathway explains why interferon caused depression and why only the high-CRP subgroup seemed to benefit from infliximab."}
:::

### Metabolism and the gut
- Depression with atypical features clusters with obesity, insulin resistance and inflammation.
- The gut microbiome differs on average in depression, but cause and effect are unclear; probiotic trials are small and mixed.

### GLP-1 receptor agonists (semaglutide, liraglutide, tirzepatide)
- These diabetes and weight-loss medicines act on GLP-1 receptors, including in the brain's reward and appetite areas.
- **Safety question**: after reports of suicidal thoughts, the US FDA (preliminary review, January 2024) and the European Medicines Agency's safety committee (April 2024) found **no evidence of a causal link** with suicidal thoughts or actions.
- **Benefit question**: large observational studies are mostly neutral or suggest lower rates of depression and self-harm in users, but at least one large cohort found higher rates. All are observational, open to bias (who gets prescribed, weight loss itself, closer monitoring).
- **Bottom line**: GLP-1 medicines are not antidepressants. The evidence is mixed and uncertain. Ask about mood when they are started, as with any major treatment, and watch randomised trials now under way.

:::widget sort
{"prompt": "Evidence status as of late 2026: place each treatment for depression.", "buckets": ["Approved for a depression use (US)", "Promising, not approved", "Uncertain or mixed"], "items": [{"text": "Esketamine nasal spray for treatment-resistant depression", "bucket": 0}, {"text": "Zuranolone for postpartum depression", "bucket": 0}, {"text": "Psilocybin with psychological support for TRD", "bucket": 1, "why": "Positive phase 3 results reported; application under review."}, {"text": "Semaglutide as a treatment for depression", "bucket": 2, "why": "Observational data only, pointing in different directions."}, {"text": "Anti-inflammatory drugs for everyone with depression", "bucket": 2, "why": "Benefit seems limited to a high-inflammation subgroup, if any."}, {"text": "Accelerated, scan-guided rTMS for TRD", "bucket": 0, "why": "An accelerated, connectivity-targeted protocol received US clearance in 2022 as a device."}, {"text": "Probiotics for depression", "bucket": 2}, {"text": "Dextromethorphan with bupropion", "bucket": 0}]}
:::

:::recall
1. Roughly what share of depressed people have low-grade inflammation? || About a quarter (CRP above 3 mg/L).
2. Describe the kynurenine pathway link. || Cytokines push tryptophan via IDO to kynurenine and quinolinic acid instead of serotonin.
3. Who benefited from infliximab in depression trials? || Only the subgroup with high CRP.
4. What did US and EU regulators conclude about GLP-1 drugs and suicidality in 2024? || No evidence of a causal link.
:::

:::mcq
Q: Which statement about GLP-1 agonists and mood is best supported in late 2026?
- They are approved antidepressants
- They clearly cause suicide
- *Evidence is observational and mixed; regulators found no causal link with suicidality
- They have no brain effects
> Not antidepressants; watch for randomised evidence.
:::

## 6.3 Genes and pharmacogenomics [core][advanced]
### What the genetics actually shows
- Twin heritability of major depression is about **35 to 40%**, lower than bipolar disorder or schizophrenia.
- Common genetic variants measured together (SNP heritability) explain less, under 10%.
- The largest genome-wide studies, with hundreds of thousands of cases across ancestries, have found **hundreds of risk variants**, each with a tiny effect, many in genes for synapses and neuron development.
- Most early "candidate gene" findings (for example the serotonin transporter variant interacting with stress) **did not replicate** in large samples. Treat single-gene stories with suspicion.
- **Polygenic risk scores** summarise many variants. They are useful in research but too weak to diagnose or predict in an individual.

:::widget layers
{"title": "How much do genes tell us? From strongest to weakest", "shape": "stack", "layers": [{"label": "Twin heritability", "detail": "About 35 to 40 percent of variation in risk, across a population, not in any one person."}, {"label": "SNP heritability", "detail": "Common variants measured on chips explain less, under 10 percent: the 'missing heritability'."}, {"label": "GWAS loci", "detail": "Hundreds of risk variants, each with a tiny effect, many in synapse and neurodevelopment genes."}, {"label": "Polygenic risk score", "detail": "Adds the variants up. Useful for research groups, too weak for an individual."}, {"label": "Predicting one patient", "detail": "Not possible today. No gene test can diagnose depression or tell you who will get it."}], "caption": "Read top to bottom: each step moves from populations towards the person, and the predictive power drops at every step."}
:::

### Pharmacogenomics: genes and how drugs are handled
| Gene | What it does | Drugs affected | Practical point |
|---|---|---|---|
| **CYP2D6** | Liver enzyme; poor, normal, rapid and ultrarapid metabolisers | Paroxetine, fluvoxamine, vortioxetine, tricyclics, many antipsychotics | Ultrarapid metabolisers may get no effect; poor metabolisers more side effects |
| **CYP2C19** | Liver enzyme; poor to ultrarapid | Citalopram, escitalopram, sertraline, amitriptyline | Poor metabolisers: lower doses or a different drug; ultrarapid: may need a different drug. Poor metaboliser variants are more common in South and East Asian people than in Europeans |
| **HLA-B*15:02** | Immune gene | Carbamazepine (and oxcarbazepine, phenytoin) | Strongly linked to Stevens-Johnson syndrome; carried by about 2 to 4% of Indians on average, higher in some groups; test before carbamazepine where available |

- Expert groups (for example CPIC) publish dosing advice by genotype for many antidepressants.
- In randomised trials, test-guided prescribing produced **small** improvements in remission at best. It can help after repeated failures or intolerance, but is not routine for everyone.

:::widget decide
{"scene": "Mr Desai, 50, a businessman, asks for a 'DNA test' that his friend paid ₹25,000 for, which 'tells you the perfect antidepressant'. This is his first episode, moderate in severity, and he has never taken an antidepressant.", "ask": "How do you respond?", "choices": [{"label": "Order the test and wait for the result before any treatment", "verdict": "ok", "outcome": "Treatment is delayed. The report says most SSRIs are 'use as directed'.", "why": "The test does not pick a 'perfect' drug, and waiting delays care. It is more useful after repeated failures or side effects."}, {"label": "Explain that the test can show how his body processes some medicines but cannot predict the right drug, that benefit in trials is small, and start an evidence-based first treatment now; keep testing as an option if two medicines fail or cause marked side effects", "verdict": "best", "outcome": "He starts sertraline and therapy, and improves. He keeps the money.", "why": "Honest about limits, no delay, and a clear place for testing if it becomes useful."}, {"label": "Tell him gene tests are fraud", "verdict": "harm", "outcome": "He loses trust and goes to the friend's private lab and clinic.", "why": "The science of drug metabolism is real; overstatement in either direction misleads."}]}
:::

:::recall
1. What is the twin heritability of major depression? || About 35 to 40%.
2. Why should candidate gene stories be treated with caution? || Most did not replicate in large studies.
3. Which enzyme handles citalopram, escitalopram and sertraline? || CYP2C19.
4. What is HLA-B*15:02 linked to, and in whom should you think of it? || Carbamazepine-induced Stevens-Johnson syndrome; people of South and East Asian ancestry, including Indians.
:::

:::mcq
Q: Which statement about pharmacogenomic testing in depression is most accurate?
- It identifies the single best antidepressant
- *It shows how some drugs are metabolised; trial benefit is small, so it is used selectively
- It diagnoses depression
- It is useless in all cases
> Most useful after repeated failures or marked side effects.
:::

## 6.4 Beyond DSM: RDoC, HiTOP and computational psychiatry [core][advanced]
DSM categories are reliable enough to share, but they are not natural kinds. Two people with MDD can share only one of nine symptoms. Comorbidity is the rule. These problems have produced new frameworks.

### RDoC (Research Domain Criteria)
- Launched by the US National Institute of Mental Health around 2010 as a **research** framework, not a clinical manual.
- Studies functions that cut across diagnoses, in six domains: **negative valence** (fear, loss), **positive valence** (reward), **cognitive systems**, **social processes**, **arousal and regulatory systems** (including sleep), and **sensorimotor systems**.
- Each is studied across units of analysis: genes, molecules, cells, circuits, physiology, behaviour, self-report.
- Depression in RDoC terms: blunted **reward anticipation and learning** (positive valence), heightened **loss** processing (negative valence), disturbed sleep and arousal.

### HiTOP (Hierarchical Taxonomy of Psychopathology)
- A **dimensional** model built from how symptoms actually cluster in large samples.
- At the top, a general factor (often called p). Below it, spectra: **internalising**, thought disorder, disinhibited externalising, antagonistic externalising, detachment, and somatoform.
- Depression sits in the internalising spectrum, in a **distress** subfactor with generalised anxiety and PTSD, next to a **fear** subfactor (panic, phobias).
- This explains why depression and anxiety co-occur so often: they share much of their underlying risk.

:::widget layers
{"title": "HiTOP: where depression sits", "shape": "pyramid", "layers": [{"label": "General factor (p)", "detail": "A broad liability to psychopathology shared by almost all disorders."}, {"label": "Spectra", "detail": "Internalising, thought disorder, disinhibited and antagonistic externalising, detachment, somatoform."}, {"label": "Subfactors", "detail": "Within internalising: distress (depression, GAD, PTSD) and fear (panic, phobias)."}, {"label": "Syndromes", "detail": "Clusters like major depression, built from symptoms that co-occur."}, {"label": "Symptoms and traits", "detail": "The base layer: low mood, anhedonia, worry, insomnia and so on, each a dimension."}], "caption": "Tap from the top down. Depression and GAD share the distress subfactor, which is why they co-occur so often."}
:::

### Computational psychiatry
- Uses mathematical models of learning and decision-making to measure hidden processes. Example: **reinforcement learning** models estimate how strongly a person updates expectations after reward. In anhedonia, reward learning is blunted.
- **Predictive processing** models frame depression as overly confident negative predictions that resist updating.
- **Machine learning** has been used to predict who will respond to a treatment. Results are modest, and models often **fail when tested on new samples** (they overfit to the trial they were built on).
- Digital phenotyping (phone data on movement, sleep, typing and speech) and large language models are being studied for monitoring. Privacy, consent and bias are major concerns.

:::widget sort
{"prompt": "Which framework does each statement describe?", "buckets": ["DSM-5-TR", "RDoC", "HiTOP"], "items": [{"text": "Five of nine symptoms for a minimum period makes the diagnosis", "bucket": 0}, {"text": "A research grid of functional domains studied from genes to behaviour", "bucket": 1}, {"text": "Depression and GAD sit together in a 'distress' subfactor", "bucket": 2}, {"text": "Positive valence systems, such as reward learning", "bucket": 1}, {"text": "Built from statistical clustering of symptoms into dimensions", "bucket": 2}, {"text": "Categories with clear thresholds, used for clinical records and exams", "bucket": 0}]}
:::

:::widget curve
{"kind": "normal", "title": "Dimensions and cut-offs", "caption": "Depressive symptoms are spread continuously across people. A diagnosis draws a line on this curve. Move the line and watch how many people fall beyond it: a small shift in threshold changes prevalence a lot, which is one argument for dimensional models."}
:::

:::recall
1. What are the six RDoC domains? || Negative valence, positive valence, cognitive, social processes, arousal and regulatory, sensorimotor.
2. Where does depression sit in HiTOP? || Internalising spectrum, distress subfactor (with GAD and PTSD).
3. What is a common weakness of machine-learning response predictors? || They often fail to generalise to new samples.
4. Which RDoC process is blunted in anhedonia? || Reward anticipation and learning (positive valence).
:::

:::mcq
Q: Why does HiTOP help explain the high comorbidity of depression and anxiety?
- It treats them as the same disease
- *It shows they share a common internalising, distress dimension
- It removes anxiety as a diagnosis
- It relies on brain scans
> Shared underlying dimensions predict co-occurrence.
:::

## 6.5 ICD-11 says: where the rulebooks differ [core][advanced]
| Topic | DSM-5-TR | ICD-11 |
|---|---|---|
| Symptom list for a depressive episode | 9 symptoms | 10 symptoms in three clusters; adds hopelessness |
| Mixed anxiety and depression | Not a diagnosis (use "with anxious distress") | Mixed depressive and anxiety disorder exists |
| Chronic low mood | Persistent depressive disorder | Dysthymic disorder |
| Childhood chronic irritability | DMDD in the depressive chapter | No DMDD; oppositional defiant disorder "with chronic irritability-anger" |
| PMDD | In the depressive chapter | In the gynaecology chapter, cross-listed |
| Prolonged grief | At least 12 months after the death (6 in children) | At least 6 months, judged against cultural norms |
| Postpartum window | Pregnancy plus a short window after delivery (you guessed it in 1.3) | A slightly longer window after delivery |
| Severity | Mild, moderate, severe | Mild, moderate, severe, with or without psychotic symptoms; psychosis allowed in moderate episodes |

:::widget reveal
{"prompt": "A woman in a district hospital in India is diagnosed with a depressive episode using ICD-11. Her MA dissertation supervisor asks her to use DSM-5-TR. Which part of her symptom count might change?", "answer": "Hopelessness. ICD-11 counts it as a separate symptom among ten, so a person with four DSM symptoms plus hopelessness could meet the ICD-11 threshold of five but fall one short in DSM-5-TR. Always state which system you used."}
:::

:::recall
1. Name four differences between ICD-11 and DSM-5-TR for depressive disorders. || Ten symptoms with hopelessness; mixed depressive and anxiety disorder; no DMDD; PMDD placement; prolonged grief 6 months.
:::

:::mcq
Q: Which diagnosis exists in ICD-11 but not in DSM-5-TR?
- Persistent depressive disorder
- *Mixed depressive and anxiety disorder
- Disruptive mood dysregulation disorder
- Premenstrual dysphoric disorder
> DSM-5-TR uses the "with anxious distress" specifier instead.
:::

# Part VII · Exam zone

## 7.1 Long answer and short notes [core]
:::example Q. Describe the clinical features, diagnosis and management of major depressive disorder. (15 marks)
1. Definition and the place of MDD among the depressive disorders.
2. Epidemiology: common, about twice as common in women from adolescence, a large treatment gap in India.
3. Aetiology: genetic, monoamine and its limits, neuroplasticity and BDNF, HPA axis, inflammation; Beck's triad, behavioural model, learned helplessness; life events and social factors.
4. Clinical features by domain, with Indian presentations and special groups.
5. Criteria A to E (draw the nine symptoms) and specifiers (melancholic vs atypical table).
6. MSE findings under each heading.
7. Differential diagnosis, including bipolar depression and medical causes; investigations and rating scales.
8. Management: risk assessment, stepped care, antidepressant choice and duration, therapies, ECT indications, treatment resistance.
9. Course, prognosis and suicide risk. Add one ICD-11 difference for extra credit.
:::

:::word Short note: melancholic depression
Melancholic features are a specifier of a major depressive episode: loss of pleasure in all or almost all activities, or lack of mood reactivity, with at least three of a distinct quality of depressed mood, morning worsening, early morning waking at least two hours early, marked psychomotor retardation or agitation, significant anorexia or weight loss, and excessive guilt. Commoner in inpatients and with psychotic features. It predicts good response to biological treatments, including ECT. Example: a 55-year-old who wakes at 3 a.m., is worst in the morning, has lost 6 kg and feels he has ruined his family.
:::

:::word Short note: persistent depressive disorder
Depressed mood for most of the day, more days than not, for at least two years (one year in children, where mood may be irritable), with at least two of poor appetite or overeating, sleep change, low energy, low self-esteem, poor concentration and hopelessness; never symptom-free for more than two months; never manic or hypomanic. Onset is often insidious before 25; major depressive episodes may occur on top. Treated with antidepressants and CBT; prognosis improves with treatment.
:::

:::word Short note: ketamine and esketamine
Ketamine is an NMDA receptor antagonist. Sub-anaesthetic intravenous doses reduce depressive symptoms and suicidal thinking within hours, through a glutamate burst, AMPA activation, BDNF release and mTOR-driven synaptogenesis, but effects fade within days. Esketamine nasal spray is approved in the US for treatment-resistant depression (with an oral antidepressant, and since 2025 alone) and for depression with acute suicidal thoughts. It is given in certified clinics with at least two hours of monitoring for dissociation, sedation and raised blood pressure. Risks include misuse and dependence.
:::

## 7.2 Viva rapid-fire [core]
:::viva
How many symptoms are needed for a major depressive episode? :: Five of nine, one being depressed mood or loss of interest.
Minimum duration of a major depressive episode? :: Fourteen days, most of the day, nearly every day.
What finding rules out MDD? :: Any past manic or hypomanic episode.
What replaces depressed mood in children? :: Irritable mood.
What is anhedonia? :: Loss of interest or pleasure in previously enjoyable activities.
Duration for persistent depressive disorder? :: At least 2 years in adults, 1 year in children and adolescents.
What is double depression? :: Major depressive episodes on top of persistent depressive disorder.
Core of melancholic features? :: Loss of pleasure in nearly everything or lack of mood reactivity.
Associated features of atypical depression? :: Weight or appetite gain, hypersomnia, leaden paralysis, rejection sensitivity.
How many symptoms define anxious distress? :: Two of five.
How many manic symptoms define mixed features? :: Three.
Peripartum onset window in DSM-5-TR? :: Pregnancy or the first month after delivery (the window you guessed in 1.3).
How do baby blues differ from postpartum depression? :: Common, mild, no loss of function, settle within days.
Age rules for DMDD? :: Diagnosed between 6 and 18; onset before 10.
How is PMDD confirmed? :: Daily prospective ratings over at least 2 cycles.
Prolonged grief disorder duration in DSM-5-TR and ICD-11? :: 12 months; 6 months.
Why do antidepressants take time to work? :: Autoreceptor desensitisation and downstream plasticity.
When does early improvement usually appear? :: Early, in the first fortnight or so in people who will respond; full benefit builds later.
What is Beck's cognitive triad? :: Negative views of self, world and future.
What is learned helplessness? :: Learning from uncontrollable events that action is pointless.
Name the 5 Ps. :: Presenting, predisposing, precipitating, perpetuating, protective.
Strongest single suicide risk factor? :: A previous attempt.
How long to continue after a first episode remits? :: At least 6 months, often up to a year.
Define treatment-resistant depression. :: Failure of at least two adequate antidepressant trials.
Three augmentation options? :: Lithium, an atypical antipsychotic, thyroid hormone.
Fastest, most effective treatment for psychotic depression? :: ECT.
Muscle relaxant in ECT? :: Succinylcholine.
Placement with fewest memory effects? :: Right unilateral.
Main relative contraindication to ECT? :: Raised intracranial pressure.
rTMS target for depression? :: Left dorsolateral prefrontal cortex.
Receptor behind early SSRI nausea? :: 5HT3.
Mirtazapine's sedating action? :: H1 antagonism.
Why are TCAs lethal in overdose? :: Cardiac sodium channel blockade.
MAOI plus aged cheese? :: Tyramine hypertensive crisis.
Ketamine's primary target? :: NMDA receptor.
Zuranolone indication? :: Postpartum depression (US).
Is any classic psychedelic FDA-approved? :: No, as of late 2026.
Which enzyme handles escitalopram? :: CYP2C19.
Gene to test before carbamazepine in Indians? :: HLA-B*15:02.
ICD-11 symptom added to the depressive episode list? :: Hopelessness.
Where does depression sit in HiTOP? :: Internalising spectrum, distress subfactor.
:::

## 7.3 Module test [core]
Answer every question before checking. Your best score is saved.

:::mcq
Q: A 30-year-old woman has had low mood, loss of interest, poor sleep, low energy and poor concentration for 10 days. What is missing for a major depressive episode?
- Five symptoms
- *Enough duration
- Psychomotor change
- A trigger
> She has five symptoms including both core ones. The episode has not lasted long enough yet.

Q: Which history finding most changes the treatment of a depressed patient?
- Family history of depression
- *A past week of elation, little sleep and overspending
- Poor appetite
- A recent breakup
> Past hypomania or mania means bipolar disorder.

Q: Early waking, morning worsening, weight loss and excessive guilt suggest:
- Atypical features
- *Melancholic features
- Anxious distress
- Seasonal pattern
> Classic melancholia.

Q: Hypersomnia, weight gain, heavy limbs and mood that brightens with good news suggest:
- Melancholic features
- *Atypical features
- Mixed features
- Catatonia
> Mood reactivity plus atypical features.

Q: A depressed woman also has racing thoughts, pressured speech and more energy on most days. Specify:
- With anxious distress
- *With mixed features
- With catatonia
- With seasonal pattern
> Three or more manic symptoms; raises bipolar risk.

Q: A 9-year-old has severe temper outbursts four times a week and is irritable between them for over a year. The most likely diagnosis is:
- Bipolar I disorder
- *Disruptive mood dysregulation disorder
- Persistent depressive disorder
- ADHD
> Frequent outbursts plus persistent irritability; onset before 10.

Q: Which is NOT part of Beck's cognitive triad?
- The self
- The world
- The future
- *The past
> Self, world and future.

Q: A 70-year-old with low mood answers memory questions with "I don't know" and complains loudly of forgetfulness that began after a bereavement. Most likely:
- Alzheimer's disease
- *Depressive pseudodementia
- Delirium
- Vascular dementia
> Datable onset, poor effort, loud complaint, mood first.

Q: In the MSE, a "depressed, restricted and non-reactive" description belongs to:
- Mood
- *Affect
- Thought content
- Insight
> Affect is the observed emotional expression.

Q: The best first step when a depressed patient says "What's the point?" is to:
- Change the subject
- *Ask directly about suicidal thoughts, plans and means
- Prescribe a sedative
- Call the police
> Asking directly is safe and essential.

Q: Which is a protective factor against suicide?
- Living alone
- Alcohol use
- *Strong reasons for living, such as children
- Recent discharge
> Protective factors go in every risk assessment.

Q: A man on escitalopram starts tramadol and develops clonus, fever and agitation. The likely cause is:
- Neuroleptic malignant syndrome
- *Serotonin syndrome
- Lithium toxicity
- Discontinuation
> Two serotonergic drugs.

Q: A 75-year-old on sertraline becomes confused and unsteady. Check first:
- Calcium
- *Sodium
- Lithium
- Ammonia
> SSRI-related hyponatraemia.

Q: Which antidepressant is a good choice when insomnia and poor appetite dominate?
- Bupropion
- Fluoxetine
- *Mirtazapine
- Venlafaxine
> H1 and 5HT2C block help sleep and appetite.

Q: Fluoxetine should be avoided with tamoxifen because it:
- Causes bleeding
- *Inhibits CYP2D6, reducing tamoxifen's activation
- Causes low sodium
- Prolongs QT
> Strong CYP2D6 inhibition.

Q: After a first episode fully remits, the antidepressant should usually continue for:
- 1 month
- 2 months
- *At least 6 months, often up to a year
- Lifelong
> Stopping early brings relapse.

Q: Which is the fastest, most effective treatment for severe depression with delusions of guilt and refusal to eat?
- Higher-dose SSRI
- CBT
- *ECT
- Benzodiazepines
> ECT for psychotic depression, food refusal and high risk.

Q: The Healthy Activity Program in India is an example of:
- ECT in rural areas
- *Behavioural activation delivered by trained lay counsellors
- A new antidepressant
- A screening scale
> Task-sharing works where specialists are few.

Q: Which therapy focuses on grief, role disputes, role transitions and interpersonal deficits?
- CBT
- *Interpersonal therapy
- Behavioural activation
- MBCT
> The four IPT problem areas.

Q: SSRI benefit lags behind SERT blockade mainly because:
- The drug is absorbed slowly
- *5HT1A autoreceptors must desensitise and downstream plasticity must develop
- Serotonin rises slowly
- The dose is too low
> SERT block is immediate; the brake comes off later.

Q: Dry mouth, constipation and urinary retention from a tricyclic come from blocking:
- H1 receptors
- *Muscarinic M1 receptors
- Alpha-1 receptors
- 5HT3 receptors
> Anticholinergic effects.

Q: Ketamine's antidepressant action begins at:
- SERT
- MAO-A
- *The NMDA receptor
- The D2 receptor
> Glutamate burst, AMPA, BDNF, mTOR.

Q: Zuranolone is approved in the US for:
- All major depression
- *Postpartum depression
- Bipolar depression
- Insomnia
> A short oral neurosteroid course with a driving warning.

Q: Which statement about psychedelics is accurate as of late 2026?
- Psilocybin is FDA-approved for depression
- *No classic psychedelic is FDA-approved; MDMA therapy received a complete response letter in 2024
- MDMA is approved for depression
- Psychedelics are legal medicines in India
> A psilocybin application for TRD is under review.

Q: In depression trials, the anti-inflammatory infliximab helped:
- Everyone
- No one at all
- *Only those with raised CRP
- Only those with psychosis
> Inflammation may define a subgroup.

Q: Which is TRUE about pharmacogenomic testing for antidepressants?
- It diagnoses depression
- It picks the perfect drug
- *It informs dosing for some drugs; benefit in trials is small
- It replaces clinical judgement
> Use selectively.

Q: In HiTOP, depression is grouped most closely with:
- Schizophrenia
- *Generalised anxiety disorder and PTSD in a distress subfactor
- ADHD
- Antisocial personality disorder
> The internalising spectrum.

Q: Which symptom does ICD-11 list separately that DSM-5-TR does not?
- Insomnia
- Guilt
- *Hopelessness
- Fatigue
> Ten symptoms in three clusters.

Q: Which is a relative contraindication to ECT?
- Pregnancy
- Old age
- *Raised intracranial pressure
- Psychotic depression
> Pregnancy and age are not contraindications.
:::
` + qaBank;
