import { act } from "@/lib/study/activities";
import type { ModuleMeta } from "@/lib/study/types";
import { qaBank } from "./bipolar-qa";

export const meta: ModuleMeta = {
  id: "bipolar",
  num: 6,
  title: "Bipolar and related disorders",
  emoji: "🎢",
  tagline: "Highs, lows, the medicines that keep people well, and what research is finding",
  when: "Mood disorders",
  outcomes: [
    "Explain in plain words what mania is, how it differs from happiness, and why past highs matter in every depressed patient",
    "State the criteria for manic and hypomanic episodes, and tell bipolar I, bipolar II, cyclothymia, mixed features and rapid cycling apart",
    "Plan treatment for acute mania, bipolar depression and maintenance, including lithium dosing, monitoring and toxicity",
    "Work with families, use the Mental Healthcare Act 2017 safeguards, and build a relapse signature",
    "Explain how mood stabilisers work, and the honest evidence on new treatments, genetics, metabolism and new frameworks, with ICD-11 differences",
  ],
  writeTask:
    "On paper, from memory: the 7 manic symptoms (DIGFAST) with the duration and number rules for mania and hypomania, the definitions of bipolar I, II, cyclothymia, mixed features and rapid cycling, and a three-part treatment plan (acute mania, bipolar depression, maintenance) including lithium levels, monitoring, toxicity signs and the things that raise levels. Then check and correct in red.",
  activities: [
    act.lesson("mood-2", "Quiz: mania and bipolar", "Episode rules and specifiers."),
    act.scenarios("bipolar", "Patient case: the ₹2 lakh week", "A manic patient who feels better than ever."),
    act.lesson("ms-1", "Quiz: lithium", "Levels, toxicity and monitoring."),
    act.coach("pharmacology", "Coach: medicines", "Mood stabilisers and antipsychotics you confuse."),
  ],
  noteId: "bipolar",
};

export const text = String.raw`

# Part 0 · Starting: highs, lows and what "bipolar" means

## 0.1 Mood can go up as well as down [core][starting]
Most people know that mood can drop too low. Fewer know that it can also rise **too high**. In bipolar disorder, a person has periods of illness at both ends: lows (depression) and highs (mania, or a milder form called hypomania). "Bi-polar" means two poles, like the two ends of a magnet.

A high is not simply being happy. When you are happy after good news, you still sleep, you still listen to others, and you can calm down. In a manic high, the brain's accelerator is stuck. The person needs little sleep but does not feel tired, talks fast, has endless ideas, feels unusually important, and does risky things they would never normally do.

:::widget layers
{"title": "The mood scale, from top to bottom", "shape": "stack", "layers": [{"label": "Mania", "detail": "Very high or irritable for days, little sleep without tiredness, racing ideas, risky actions, sometimes false beliefs. Life is seriously disrupted."}, {"label": "Hypomania", "detail": "A milder, shorter high. Others notice the change, but life carries on and there are no false beliefs."}, {"label": "Usual mood", "detail": "The person's own normal: up with good news, down with bad, and back again."}, {"label": "Low patch", "detail": "Ordinary sadness or stress that passes."}, {"label": "Depression", "detail": "A long, wide, deep low that changes sleep, energy and thinking and stops the person living their life."}], "caption": "Bipolar disorder means episodes at the top as well as the bottom of this scale, with usual mood in between for many people."}
:::

### "Mood swings" in daily talk
People say "she's so bipolar" about someone who changes mood quickly. That is not what the illness is. In bipolar disorder:
- An **episode** lasts days to months, not minutes or hours.
- It is a clear **change from the person's usual self**, noticed by others.
- It comes with changes in **sleep, energy and activity**, not just feelings.
- Between episodes, many people return to their usual self.

:::analogy The car with a stuck accelerator
Depression is a car with the handbrake on: everything is heavy and slow. Mania is a car with the accelerator jammed and the brakes failing: fast, exciting at first, then dangerous. Treatment is about fixing both pedals and keeping the car on the road.
:::

:::widget moodline
{"prompt": "Here is Kiran's mood over three years. Which description fits?", "series": [0, 0, 2.8, 3, 1, 0, 0, -2.4, -2.8, -2.5, -1, 0], "labels": ["Year 1", "Year 2", "Year 3"], "options": ["Ordinary ups and downs", "Depression only", "A very high period and, later, a very low period, with usual mood in between", "Changes every few hours"], "answer": 2, "why": "The line climbs into the mania zone, returns to the middle, and later drops into depression. Episodes at both poles, separated by periods of usual mood, is the classic bipolar picture."}
:::

:::recall
1. What does "bipolar" mean? || Illness at two poles: highs (mania or hypomania) and lows (depression).
2. How is a manic high different from ordinary happiness? || Little need for sleep without tiredness, fast talk, many ideas, grandiosity, risky actions, unable to calm down.
3. Give three ways bipolar episodes differ from everyday "mood swings". || Last days to months; a clear change noticed by others; come with sleep, energy and activity changes.
:::

:::mcq
Q: Anjali's mood changes several times a day depending on texts from her friends. This is best described as:
- Bipolar disorder
- *Ordinary reactions to events, not bipolar episodes
- Mania
- Hypomania
> Bipolar episodes last days to months and change sleep, energy and activity.
:::

## 0.2 What mania looks like from the outside [core][starting]
:::example Ravi's week
Ravi, 32, a shop owner in Indore, is usually quiet. One week his wife notices he sleeps only two or three hours but is up early, cheerful and full of plans. He talks so fast that customers cannot keep up. He announces that he will open ten new shops and "become the richest man in Madhya Pradesh". He buys a car on loan, gives expensive gifts to relatives, and calls friends at 2 a.m. When his brother questions him, he shouts. By the end of the week he says God has chosen him for a special mission. He insists he has never felt better.
:::

:::widget flow
{"title": "How Ravi's high unfolded", "layout": "chain", "nodes": [{"id": "a", "label": "Less sleep", "detail": "Two or three hours a night, but up early and not tired. Often the very first sign."}, {"id": "b", "label": "More energy and ideas", "detail": "Fast talk, endless plans, calls at 2 a.m."}, {"id": "c", "label": "Big self-image", "detail": "'Ten new shops', 'the richest man in Madhya Pradesh'."}, {"id": "d", "label": "Risky actions", "detail": "A car on loan, expensive gifts, quarrels when questioned."}, {"id": "e", "label": "Loss of touch with reality", "detail": "A fixed false belief: chosen by God for a mission."}, {"id": "f", "label": "The crash", "detail": "Often a slide into depression afterwards, with shame about what happened."}], "caption": "Acting at the first box, when sleep drops, prevents the most harm."}
:::

Notice what makes this an illness:
- **Sleep**: he sleeps very little but does not feel tired. This is often the **first** warning sign.
- **Speed**: fast speech, racing ideas, constant activity.
- **Self-image**: grandiose plans, a belief that he is special.
- **Risk**: spending, loans, quarrels, and later a fixed false belief (a delusion).
- **Insight**: he does not think anything is wrong. This is very common in mania, and is why families usually bring the person for help.

### Why mania is dangerous
Mania can damage savings, jobs, marriages and reputation in days. It can lead to accidents, fights, unsafe sex and arrest. Severe mania can cause exhaustion and dehydration. And after the high there is often a crash into depression, with shame about what happened.

:::widget sort
{"prompt": "Ordinary excitement or a warning sign of mania? Place each card.", "buckets": ["Ordinary excitement", "Warning sign of mania"], "items": [{"text": "Stays up late once before a wedding, tired the next day", "bucket": 0}, {"text": "Sleeps 3 hours a night for a week and feels full of energy", "bucket": 1, "why": "Less need for sleep without tiredness is a key sign."}, {"text": "Excited and talkative after getting a job offer", "bucket": 0}, {"text": "Takes a big loan to start five businesses overnight", "bucket": 1}, {"text": "Talks so fast that no one can get a word in, for days", "bucket": 1}, {"text": "Celebrates exam results with friends and calms down the next day", "bucket": 0}, {"text": "Believes he has special powers to heal people", "bucket": 1, "why": "A grandiose delusion: a sign of severe mania."}, {"text": "Dances at a sangeet, then sleeps well", "bucket": 0}]}
:::

:::sounds How mania sounds
- "Doctor, I haven't felt this good in years! Main bahut bada business shuru karne wala hoon."
- "Neend ki zaroorat hi nahi, teen ghante kaafi hain." (I don't need sleep; three hours is enough.)
- Family: "Usne ek hafte mein do lakh kharch kar diye, sabko gifts de raha hai." (He spent two lakh in a week giving everyone gifts.)
- When contradicted: "Aap log meri baat samajhte hi nahi!" (You people don't understand me!)
:::

:::recall
1. What is often the first warning sign of mania? || Sleeping much less without feeling tired.
2. Name the five features in Ravi's story. || Sleep, speed, self-image, risk, loss of insight.
3. Why do families, not patients, usually bring a manic person for help? || The person often has no insight and feels better than ever.
:::

:::mcq
Q: Which feature most suggests mania rather than ordinary happiness?
- Laughing at a joke
- *Needing only 2 to 3 hours of sleep for days without feeling tired
- Being excited about a holiday
- Talking a lot at a party
> Decreased need for sleep is a core, early sign.
:::

## 0.3 How it differs from depression, and why it matters [core][starting]
People with bipolar disorder spend **more time depressed than high**. They usually seek help when they are low, because highs feel good or are not noticed. So a person with bipolar disorder often first sits in a clinic looking exactly like someone with ordinary depression.

This matters because the treatments differ.
- In **depression without highs**, antidepressants are a mainstay.
- In **bipolar depression**, an antidepressant on its own can tip the person into a high, or into rapid swings. Different medicines (mood stabilisers and some antipsychotics) are used.

So every clinician who sees a depressed person asks: **"Have you ever had the opposite: a time of unusual energy, little sleep and big plans?"** And they ask the family, who often remember more.

:::widget reveal
{"prompt": "Why might a person with bipolar II disorder be treated for 'recurrent depression' for years before anyone notices?", "answer": "Their highs are milder (hypomania). Hypomania can feel like being productive, confident and sociable, so they never mention it, and it rarely causes enough trouble to be brought to a doctor. Unless someone asks specifically, and asks the family, only the depressions are seen."}
:::

:::widget flow
{"title": "Why every depressed person is asked about highs", "layout": "tree", "nodes": [{"id": "r", "label": "A person comes in depressed", "detail": "They usually come when low, because highs feel good or go unnoticed."}, {"id": "q", "parent": "r", "label": "Ever a time of unusual energy, little sleep and big plans?", "detail": "Ask the person and the family. Families often remember more."}, {"id": "y", "parent": "q", "label": "Yes", "detail": "Think bipolar depression. Different medicines are used; an antidepressant alone can tip the person into a high."}, {"id": "n", "parent": "q", "label": "No, and the family agrees", "detail": "Treat as depression, and keep asking at later visits, because a first high can come later."}], "caption": "One question changes the whole plan."}
:::

### Two kinds of high
- **Mania**: severe. It lasts longer, or needs hospital care, and it seriously disrupts life. It may include delusions.
- **Hypomania**: milder and shorter. Others notice the change, but life is not seriously disrupted, and there are no delusions.

The kind of high decides the type of bipolar disorder, which you will learn exactly in the Beginner level.

:::widget compare
{"title": "A very good mood or a manic episode?", "a": {"label": "A very good mood", "points": ["Happy after good news, and it makes sense", "Sleeps as usual and feels rested", "Plans are exciting but realistic", "Friends enjoy their company", "Settles back in a day or two"], "summary": "A good mood: in proportion, and the person is still themselves."}, "b": {"label": "Mania", "points": ["High or irritable for no clear reason, lasting days", "Sleeps 2 or 3 hours and feels full of energy", "Grand plans: quits a job, spends savings, big loans", "Talks fast, jumps between ideas, will not be interrupted", "Family say 'this is not him'"], "summary": "Mania: a change from the usual self, with less need for sleep, risky actions and harm to life."}, "caption": "Families often notice first. The key clues are the drop in need for sleep and the change from the person's usual self."}
:::

:::recall
1. Do people with bipolar disorder spend more time high or low? || Low (depressed).
2. Why must you ask about past highs before treating depression? || An antidepressant alone can tip someone with bipolar disorder into a high or rapid swings.
3. How does hypomania differ from mania, in plain words? || Milder and shorter, noticed by others but not seriously disrupting life, no delusions.
:::

:::mcq
Q: A depressed student asks for an antidepressant. Which question is most important before prescribing?
- "Do you exercise?"
- *"Have you ever had days of unusual energy, little sleep and big plans?"
- "Do you drink tea?"
- "What are your marks?"
> Past highs change the diagnosis and the treatment.
:::

## 0.4 Myths, stigma and living well [core][starting]
Bipolar disorder affects about 1 in 100 people, men and women equally (bipolar I). It usually starts in the late teens or twenties. It is a long-term condition, like diabetes: it can come back, but with treatment most people live full lives, work, marry and raise families.

### A little history
In 1949 the Australian psychiatrist John Cade reported that **lithium**, a simple salt, calmed mania. It became one of the most important discoveries in psychiatry and is still a first-choice treatment today.

:::widget flow
{"title": "The sleep loop in mania", "layout": "cycle", "nodes": [{"id": "a", "label": "Less sleep", "detail": "A night shift, exam season, a wedding, a newborn baby."}, {"id": "b", "label": "Mood and energy rise", "detail": "In someone with bipolar disorder, lost sleep can push mood upwards."}, {"id": "c", "label": "Feels no need to sleep", "detail": "Ideas race and rest seems a waste of time."}, {"id": "d", "label": "Even less sleep", "detail": "So the high climbs further."}], "caption": "Protecting sleep is one of the simplest ways to break this loop early."}
:::

### What keeps people well
- Taking medicines regularly, even when well.
- **Regular sleep** and daily routine: sleep loss is a major trigger.
- Knowing one's own **early warning signs** and acting early.
- Avoiding alcohol, cannabis and other drugs.
- A family that understands the illness.

:::widget sort
{"prompt": "Myth or fact? Place each statement.", "buckets": ["Myth", "Fact"], "items": [{"text": "Bipolar disorder means changing mood every few minutes", "bucket": 0, "why": "Episodes last days to months."}, {"text": "People with bipolar disorder cannot hold a job", "bucket": 0, "why": "Many work successfully, especially with good treatment."}, {"text": "Sleep loss can trigger a high", "bucket": 1}, {"text": "Bad parenting causes bipolar disorder", "bucket": 0, "why": "Genes play a strong role; stress and sleep loss trigger episodes."}, {"text": "It often runs in families", "bucket": 1}, {"text": "Stopping medicine once you feel well is safe", "bucket": 0, "why": "Stopping, especially suddenly, often brings relapse."}, {"text": "Lithium has been used for over 70 years", "bucket": 1}, {"text": "All creative geniuses have bipolar disorder", "bucket": 0, "why": "A romantic idea. Mania usually disrupts work rather than improving it."}]}
:::

:::widget decide
{"scene": "Your hostel-mate Meghna has hardly slept for four nights. She is cleaning the room at 3 a.m., talking very fast about a startup that will 'change India', and has ordered things worth ₹40,000 online. She laughs off your worry: 'I've never felt better!'", "ask": "What do you do?", "choices": [{"label": "Join in the excitement; she seems happy, so it must be fine", "verdict": "harm", "outcome": "By the weekend she has maxed out her card, quarrelled with the warden and been brought to emergency by police.", "why": "No sleep for days, racing speech, grandiose plans and heavy spending are warning signs of mania, not happiness."}, {"label": "Stay calm and kind, avoid arguing about her plans, and tell the hostel warden or her family today so she can see a doctor quickly", "verdict": "best", "outcome": "Her parents come the next day and take her to a psychiatrist, who starts treatment early.", "why": "People in mania often lack insight. Calmly involving responsible adults early prevents harm."}, {"label": "Lecture her loudly that she is behaving like a mad person", "verdict": "harm", "outcome": "She becomes angry and locks herself in the room.", "why": "Arguing and labelling provoke irritability and close communication."}]}
:::

:::widget layers
{"title": "What keeps people well", "shape": "pyramid", "layers": [{"label": "Acting on early warning signs", "detail": "Knowing one's own first signs and having an agreed plan with family and clinic."}, {"label": "Regular medicines", "detail": "Taken even when well; stopping suddenly often brings relapse."}, {"label": "Avoiding alcohol and drugs", "detail": "Cannabis, alcohol and stimulants make episodes more likely."}, {"label": "Sleep and routine", "detail": "The base: regular bedtime, meals and daily rhythm. Sleep loss is a major trigger."}], "caption": "Build from the base up. Medicines work best on top of a steady routine."}
:::

:::recall
1. About how many people have bipolar disorder? || About 1 in 100.
2. Who discovered lithium for mania, and when? || John Cade, 1949.
3. Name four things that keep people with bipolar disorder well. || Regular medicines, regular sleep and routine, knowing early warning signs, avoiding alcohol and drugs, family understanding.
:::

:::mcq
Q: Which statement about bipolar disorder is TRUE?
- It always causes violence
- *With treatment most people live full working lives
- It is caused by poor parenting
- Mood changes every few minutes
> A long-term but treatable condition.
:::

## 0.5 Level check · Starting [starting]
Twelve or more right out of fifteen (80%) opens the Beginner level.

:::mcq
Q: "Bipolar" refers to:
- Two personalities
- *Illness at two poles of mood: highs and lows
- Being moody
- Two diagnoses at once
> Mania or hypomania, and depression.

Q: Bipolar episodes usually last:
- Seconds
- A few minutes
- *Days to months
- Exactly one hour
> Short swings are not bipolar episodes.

Q: The commonest early warning sign of mania is:
- Sleeping more
- *Needing much less sleep without feeling tired
- Loss of appetite only
- Headache
> Sleep change comes first for many people.

Q: Which is typical of mania?
- Slowed speech
- *Grandiose plans and fast speech
- Loss of interest
- Excess guilt
> Grandiosity and pressure of speech.

Q: Why do families often bring a manic person to hospital?
- The person asks to go
- *The person often feels better than ever and sees nothing wrong
- Mania is never dangerous
- Mania only happens at night
> Loss of insight is common.

Q: People with bipolar disorder spend more time:
- High
- *Low
- In hospital
- Asleep
> Depression dominates the course over time.

Q: Why ask a depressed person about past highs?
- To make conversation
- *Because an antidepressant alone can trigger a high in bipolar disorder
- To check their memory
- Because highs are always dangerous
> It changes diagnosis and treatment.

Q: Hypomania differs from mania because it is:
- More severe
- *Milder, shorter, without delusions or serious disruption
- Always followed by psychosis
- The same thing
> Others notice it, but life carries on.

Q: Who reported lithium's effect on mania in 1949?
- Sigmund Freud
- *John Cade
- Aaron Beck
- Emil Kraepelin
> An Australian psychiatrist.

Q: Which is a common trigger of a high?
- Regular sleep
- *Sleep loss
- Taking medicines regularly
- A calm routine
> Night shifts, travel, exams and a new baby all disturb sleep.

Q: About how common is bipolar disorder?
- 1 in 5 people
- *About 1 in 100 people
- 1 in a million
- Only seen in artists
> Bipolar I affects men and women about equally.

Q: Which is a myth?
- It runs in families
- Sleep matters
- *People with bipolar disorder can never work
- Lithium is a long-standing treatment
> Many people work and live full lives.

Q: Your friend hasn't slept for four nights and is spending heavily on a grand plan. The best action is to:
- Encourage the plan
- *Stay calm and get responsible adults involved so she sees a doctor soon
- Argue loudly
- Ignore it
> Early help prevents harm.

Q: Bipolar disorder usually begins:
- In early childhood
- *In the late teens or twenties
- After 70
- Only in middle age
> First onset after 50 should prompt a search for a medical cause.

Q: Stopping mood-stabilising medicine as soon as you feel well is:
- Safe
- *Risky, as relapse often follows
- Recommended
- Required by law
> Long-term treatment keeps people well.
:::

# Part I · The episodes

## 1.1 Mania [core][beginner]
:::widget guess
{"prompt": "How many days must a manic episode last, at minimum, if the person is not admitted to hospital?", "min": 1, "max": 21, "unit": "days", "answer": [7, 7], "reveal": "At least 7 days, present most of the day, nearly every day. If the person needs hospital admission, any duration counts.", "clinician": "DSM-5-TR criterion A: a distinct period of abnormally and persistently elevated, expansive or irritable mood and abnormally and persistently increased activity or energy, lasting at least 1 week and present most of the day, nearly every day (or any duration if hospitalisation is necessary). ICD-11 also requires at least one week unless shortened by treatment."}
:::

:::define Manic episode (criterion A)
A distinct period of **abnormally and persistently elevated, expansive or irritable mood** and **abnormally and persistently increased activity or energy**, lasting at least 7 days, most of the day, nearly every day, **or any duration if hospital admission is needed**.
:::

During this period, **3 or more** of the following (**4** if the mood is only irritable), as a clear change from usual:

| # | Symptom | What it looks like |
|---|---|---|
| 1 | Inflated self-esteem or grandiosity | "I'll be the next prime minister." Grandiose delusions in severe mania |
| 2 | Decreased need for sleep | Feels rested after 3 hours; unlike insomnia, the person does not want more sleep |
| 3 | More talkative, or pressure to keep talking | Hard to interrupt |
| 4 | Flight of ideas, or racing thoughts | Jumps topic to topic by sound or chance links |
| 5 | Distractibility | Attention pulled by trivial things in the room |
| 6 | More goal-directed activity, or psychomotor agitation | Many projects, cleaning at 3 a.m., socialising, sexual activity |
| 7 | Risky activities with painful consequences | Spending sprees, foolish investments, sexual indiscretion, reckless driving |

- **C**: severe enough to cause marked impairment, or to need admission, or there are psychotic features.
- **D**: not caused by a substance or medical condition. A full manic episode that begins during antidepressant treatment and **persists beyond** the drug's effect counts as mania, and so as bipolar I.

:::mnemonic DIGFAST
**D**istractibility · **I**nsomnia (less need for sleep) · **G**randiosity · **F**light of ideas · **A**ctivity increased · **S**peech pressured · **T**houghtlessness (risky behaviour).
:::

:::widget build
{"vignette": "Imran, 27, a sales executive in Kochi, is brought by his parents. For the past 9 days he has been 'on top of the world'. He sleeps two hours a night and says he doesn't need more. He talks non-stop and switches topics mid-sentence. He has booked flights to Dubai to 'close a billion-dollar deal' and spent his savings. He keeps getting distracted by the ceiling fan during the interview. His appetite is normal. He has not used any drugs (urine test negative). His boss has suspended him.", "rule": "Tick each B symptom present. Mania needs 3 or more (4 if mood is only irritable), with marked impairment.", "symptoms": [{"label": "Grandiosity", "present": true, "why": "A 'billion-dollar deal'."}, {"label": "Decreased need for sleep", "present": true}, {"label": "Pressured speech", "present": true}, {"label": "Flight of ideas or racing thoughts", "present": true, "why": "Switching topics mid-sentence."}, {"label": "Distractibility", "present": true, "why": "The ceiling fan."}, {"label": "More goal-directed activity", "present": true, "why": "The Dubai trip planning."}, {"label": "Risky spending or behaviour", "present": true}, {"label": "Increased appetite", "present": false, "why": "Not a mania criterion, and his appetite is normal."}], "need": 3, "needCore": false, "verdict": "Seven of seven B symptoms, over 7 days, with marked impairment (suspended at work), no substance cause. A manic episode: this is bipolar I disorder. Assess risk (money, driving, safety) and the need for admission."}
:::

:::widget flow
{"title": "The manic episode, criterion by criterion", "layout": "chain", "nodes": [{"id": "a", "label": "A: mood plus energy", "detail": "Abnormally elevated, expansive or irritable mood AND increased activity or energy, most of the day, nearly every day."}, {"id": "b", "label": "Duration", "detail": "At least 7 days, or any duration if hospital admission is needed."}, {"id": "c", "label": "B: three of seven", "detail": "DIGFAST symptoms; four if the mood is only irritable."}, {"id": "d", "label": "C: severity", "detail": "Marked impairment, or admission, or psychotic features."}, {"id": "e", "label": "D: not a substance or illness", "detail": "Not caused by a drug or medical condition. A full episode that outlasts an antidepressant's effect still counts."}], "edgeLabels": {"a>b": "for", "b>c": "with", "c>d": "and", "d>e": "and"}, "caption": "One manic episode that meets all five is enough for bipolar I."}
:::

### Stages of mania [extra]
| Stage | Picture |
|---|---|
| I | Euphoria, expansiveness, more activity, grandiosity, but organised |
| II | More intense, irritable, hostile, faster speech, flight of ideas, preoccupations becoming delusional |
| III | Desperate, panic-stricken, bizarre behaviour, incoherence, delusions, disorientation ("delirious mania") |

:::recall
1. State criterion A for a manic episode. || Elevated, expansive or irritable mood plus increased activity or energy, at least 7 days, most of the day, nearly every day (any duration if admitted).
2. How many B symptoms are needed, and when do you need one more? || Three; four if mood is only irritable.
3. Expand DIGFAST. || Distractibility, insomnia (less need for sleep), grandiosity, flight of ideas, activity, speech pressure, thoughtlessness.
4. How does decreased need for sleep differ from insomnia? || The person doesn't feel tired and doesn't want more sleep.
5. When does antidepressant-emergent mania count towards bipolar I? || When a full manic episode persists beyond the drug's effect.
:::

:::mcq
Q: A man has slept 2 hours a night for 5 days, talks fast and has spent his savings. He was admitted after fighting police. The episode counts as mania because:
- It lasted at least 4 days
- *It led to admission, which makes any duration count, with marked impairment
- He has insomnia
- He is irritable
> Any duration counts if hospitalisation is needed.

Q: A woman's mood has been only irritable for 8 days. How many other manic symptoms are needed?
- Two
- Three
- *Four
- Five
> Four instead of three when the mood is only irritable.
:::

## 1.2 Hypomania, mixed features and rapid cycling [core][beginner]
:::widget guess
{"prompt": "How many consecutive days must hypomania last, at minimum?", "min": 1, "max": 14, "unit": "days", "answer": [4, 4], "reveal": "At least 4 consecutive days, most of the day, nearly every day. Shorter highs are recorded but do not meet the rule.", "clinician": "DSM-5-TR: at least 4 consecutive days. ICD-11 describes hypomania as lasting 'at least several days'."}
:::

:::define Hypomanic episode
The same mood and energy change and the same B symptoms as mania, lasting **at least 4 consecutive days**, an unequivocal change that **others can observe**, but **not** severe enough to cause marked impairment or need admission, and **no psychotic features**.
:::

| Feature | Mania | Hypomania |
|---|---|---|
| Minimum duration | 7 days (any if admitted) | 4 days |
| Impairment | Marked, or needs admission | Not marked; may even seem productive |
| Psychosis | May be present | Never (psychosis makes it mania) |
| Diagnosis it gives | Bipolar I | Bipolar II (with a major depressive episode) |

:::trap Psychosis upgrades hypomania to mania
If psychotic features are present, it is mania, whatever the duration or impairment. If the patient needed admission, it is mania, even if it lasted less than 7 days.
:::

:::widget sort
{"prompt": "Mania or hypomania? Place each case.", "buckets": ["Mania", "Hypomania"], "items": [{"text": "5 days of high energy and little sleep; colleagues notice; she finishes a project early", "bucket": 1}, {"text": "3 days of elation, then admitted after climbing a temple tower to 'talk to God'", "bucket": 0, "why": "Admission makes any duration count; the belief is also psychotic."}, {"text": "10 days of grandiosity; sacked for abusing his manager", "bucket": 0, "why": "Marked impairment."}, {"text": "6 days of talkativeness and new ideas; family say 'not himself' but life carries on", "bucket": 1}, {"text": "4 days of high mood with a belief that he is a secret prince", "bucket": 0, "why": "Psychotic features always mean mania."}, {"text": "A week of feeling sharp and sociable, sleeping 5 hours, no harm done", "bucket": 1}]}
:::

:::widget flow
{"title": "Mania or hypomania? A decision tree", "layout": "tree", "nodes": [{"id": "r", "label": "A distinct high period with three or more symptoms", "detail": "Work down the branches in order."}, {"id": "p", "parent": "r", "label": "Psychotic features?", "detail": "Yes: mania, whatever the length or impairment."}, {"id": "h", "parent": "r", "label": "Needed admission?", "detail": "Yes: mania, even if it lasted less than 7 days."}, {"id": "i", "parent": "r", "label": "Marked impairment, at least 7 days?", "detail": "Yes: mania."}, {"id": "o", "parent": "r", "label": "At least 4 days, observable change, no marked impairment?", "detail": "Hypomania."}, {"id": "s", "parent": "r", "label": "Shorter than 4 days?", "detail": "Sub-threshold. Record it: such spells can still matter for the future."}], "caption": "Psychosis and admission each upgrade a high to mania."}
:::

### Mixed features
- A manic or hypomanic episode **with mixed features** has at least 3 depressive symptoms on most days (for example marked sadness, loss of interest, slowing, fatigue, guilt, thoughts of death).
- A depressive episode with mixed features has at least 3 manic or hypomanic symptoms.
- Mixed states carry **high suicide risk** (despair plus energy and impulsivity), respond less well to antidepressants, and often to lithium too.

:::widget moodline
{"prompt": "Sunita rated her mood every day for twelve days during one episode. She describes 'racing thoughts and no sleep, but I feel hopeless and want to die'. What is this?", "series": [-2, 2, -2.5, 2.2, -2.2, 1.8, -2.6, 2, -2.4, 2.3, -2, 1.9], "labels": ["Day 1", "Day 4", "Day 8", "Day 12"], "options": ["Rapid cycling", "An episode with mixed features", "Cyclothymia", "Normal mood"], "answer": 1, "why": "High energy and despair tangled together within the same days of one episode is mixed features. Rapid cycling means separate episodes, at least 4 in a year. Mixed states carry high suicide risk: ask directly about safety."}
:::

### Rapid cycling
- **At least 4 mood episodes in 12 months** (mania, hypomania or depression), each meeting full criteria and separated by remission or a switch to the opposite pole.
- Commoner in women, in bipolar II, with hypothyroidism and with antidepressant use. Check thyroid function; avoid antidepressants.

:::widget moodline
{"prompt": "Arvind's mood across one year. What specifier applies?", "series": [0, 2.6, 0, -2.6, -0.2, 1.6, 0, -2.7, 0, 2.4, -0.3, -2.5], "labels": ["Jan", "Apr", "Jul", "Oct", "Dec"], "options": ["Mixed features", "Seasonal pattern", "Rapid cycling", "No specifier"], "answer": 2, "why": "Count the separate episodes: a mania, a depression, a hypomania, a depression, a mania, a depression. Well over 4 in 12 months, each separated by recovery or a switch. Check his thyroid and review any antidepressant."}
:::

:::recall
1. Give the duration and impairment rules for hypomania. || At least 4 consecutive days; observable change; no marked impairment, no admission, no psychosis.
2. What happens to the diagnosis if a hypomanic patient becomes psychotic? || It becomes mania.
3. Define mixed features in a manic episode. || At least 3 depressive symptoms on most days of the episode.
4. Define rapid cycling and name three associations. || 4 or more episodes in 12 months; women, bipolar II, hypothyroidism, antidepressants.
:::

:::mcq
Q: A woman has four days of elevated mood, less need for sleep and more ideas. Colleagues notice; she works well and has no psychosis. Most likely:
- Mania
- *Hypomania
- Normal happiness
- Cyclothymia
> At least 4 days, observable change, no marked impairment, no psychosis.

Q: During a depressive episode, a man also has racing thoughts, less sleep and irritability on most days. This should be recorded as:
- Pure unipolar depression
- *Depression with mixed features
- Agitated depression only
- Generalised anxiety disorder
> Mixed features raise suicide risk and argue against an antidepressant alone.
:::

## 1.3 Finding hypomania: the history that is often missed [core][beginner]
People with bipolar disorder seek help when depressed. **Hypomania feels good** and is rarely reported. So bipolar II is often missed for **years**, and treated as recurrent depression, sometimes with antidepressants that worsen the course.

### Questions to ask every depressed patient
- "Has there been a time, lasting a few days, when you felt the opposite of depressed: unusually happy, energetic or irritable?"
- "Did you need much less sleep but not feel tired?"
- "Did others say you were talking more, faster, or were different from your usual self?"
- "Did you start many projects, spend more, or do things out of character?"
- "Has an antidepressant ever made you feel 'wired', high or agitated?"
- Ask a **family member**: they notice hypomania more than the patient does.

### Clues in a depressed patient that point to bipolar disorder
| Clue | Why it matters |
|---|---|
| Onset before 25 | Earlier onset is commoner in bipolar depression |
| Many episodes, abrupt onset and offset | A bipolar pattern |
| **Atypical features** (oversleeping, overeating, heavy limbs) | Commoner in bipolar depression |
| **Psychotic features** in a young person | |
| Onset **after childbirth** | |
| **Family history of bipolar disorder** | The strongest clue |
| Antidepressant-induced high, agitation, or loss of effect | Possible bipolarity |
| Mixed features during depression | |

:::widget flow
{"title": "Hunting for hypomania, step by step", "layout": "chain", "nodes": [{"id": "a", "label": "Ask the patient openly", "detail": "'Has there been a time of a few days when you felt the opposite of depressed?'"}, {"id": "b", "label": "Ask specific questions", "detail": "Less need for sleep without tiredness, more talk, more projects, more spending, out-of-character actions."}, {"id": "c", "label": "Ask about antidepressants", "detail": "Did one ever make you feel 'wired', brilliant or agitated within days?"}, {"id": "d", "label": "Ask the family", "detail": "They notice hypomania more often than the patient."}, {"id": "e", "label": "Use a screen", "detail": "HCL-32 or MDQ to catch what questions missed."}, {"id": "f", "label": "Draw a life chart", "detail": "Put every episode on a timeline to see the pattern."}], "caption": "Hypomania feels good, so it is rarely offered. You have to look for it."}
:::

### Screening scales
| Scale | Use |
|---|---|
| Mood Disorder Questionnaire (MDQ) | Screens for lifetime manic or hypomanic symptoms |
| Hypomania Checklist (HCL-32) | Screens for hypomania; picks up bipolar II better |
| Young Mania Rating Scale (YMRS) | Severity of current mania (11 items, clinician-rated) |

:::widget decide
{"scene": "Pooja, 26, a nurse in Nagpur, has her third depressive episode. She asks for 'the same tablet as last time'. Her notes say escitalopram 'worked brilliantly within days, she felt amazing and was working double shifts', and that she then 'crashed'. Her mother is in the waiting room.", "ask": "What do you do next?", "choices": [{"label": "Restart escitalopram at the same dose, since it worked", "verdict": "harm", "outcome": "She becomes agitated, sleepless and irritable, then crashes again with suicidal thoughts.", "why": "A very fast 'brilliant' response with double shifts and a crash suggests antidepressant-induced hypomania. Restarting it alone risks the same switch."}, {"label": "Ask specifically about past highs, including that period on escitalopram, and invite her mother in to add what she noticed; screen with the HCL-32", "verdict": "best", "outcome": "Her mother describes two earlier spells of 5 to 6 days of little sleep, big plans and spending. You diagnose bipolar II and plan treatment for bipolar depression.", "why": "Targeted questions plus collateral history find hypomania that patients rarely report. This changes treatment."}, {"label": "Diagnose borderline personality disorder because her mood keeps changing", "verdict": "harm", "outcome": "She feels labelled and the bipolar disorder stays untreated.", "why": "Distinct episodes lasting days with sleep and energy change point to bipolar disorder, not personality."}]}
:::

:::recall
1. Why is bipolar II often missed? || Hypomania feels good, is rarely reported, and patients present when depressed.
2. Name six clues in a depressed patient that suggest bipolar disorder. || Early onset, many abrupt episodes, atypical features, psychotic features in youth, postpartum onset, family history, antidepressant-induced high, mixed features.
3. Which scales screen for hypomania, and which rates current mania? || MDQ and HCL-32; YMRS.
:::

:::mcq
Q: The most reliable way to find past hypomania in a depressed patient is to:
- Ask only "Have you ever been manic?"
- *Ask about specific periods of less sleep and more energy, and ask a family member
- Rely on a rating scale alone
- Wait for a manic episode
> Collateral history finds what the patient does not report.
:::

# Part II · The disorders

## 2.1 Bipolar I, bipolar II and cyclothymia [core][beginner]
| Disorder | Requires | Never |
|---|---|---|
| Bipolar I | At least **one manic episode** (depression is common but not required) | |
| Bipolar II | At least **one hypomanic** episode **and** at least **one major depressive** episode | A manic episode |
| Cyclothymic disorder | **At least 2 years** (1 year in children and teenagers) of many periods of hypomanic symptoms and depressive symptoms that never meet full episode criteria; symptoms at least half the time; never symptom-free for more than 2 months | Full criteria for mania, hypomania or major depression |

:::trap Bipolar II is not "milder bipolar"
Bipolar II has less severe highs, but the depressions are often long and frequent, and suicide risk is high. Many people with bipolar II spend years treated for "recurrent depression".
:::

:::widget moodline
{"prompt": "Deepa's mood over four years. Which diagnosis fits?", "series": [0, -2.5, -2.8, -1, 0, 1.5, 1.6, 0, -2.6, -2.9, -1, 0], "labels": ["Year 1", "Year 2", "Year 3", "Year 4"], "options": ["Bipolar I disorder", "Bipolar II disorder", "Cyclothymic disorder", "Major depressive disorder"], "answer": 1, "why": "Two major depressive episodes and one high that stays in the hypomania band, never reaching mania. Hypomania plus major depression, never mania, is bipolar II."}
:::

:::widget moodline
{"prompt": "Farhan's mood over two years, rated monthly. Which diagnosis fits?", "series": [0.8, -1.2, 1, -1.4, 0.9, -1.1, 1.2, -1.3, 0.7, -1.2, 1, -1], "labels": ["Year 1", "Year 2"], "options": ["Bipolar I disorder", "Bipolar II disorder", "Cyclothymic disorder", "Normal mood"], "answer": 2, "why": "Many ups and downs, but none reaches the hypomania line or the major depression line, and he is rarely at his usual level. Two years of sub-threshold highs and lows is cyclothymia. Watch for progression to bipolar I or II."}
:::

:::widget flow
{"title": "Which bipolar diagnosis?", "layout": "tree", "nodes": [{"id": "r", "label": "A history of highs (and usually lows)", "detail": "Ask the questions in order."}, {"id": "s", "parent": "r", "label": "Caused by a drug or medical condition?", "detail": "Substance or medication-induced, or due to another medical condition. Think of these especially with first mania after 50."}, {"id": "m", "parent": "r", "label": "Ever a full manic episode?", "detail": "Bipolar I. Depression is common but not required."}, {"id": "h", "parent": "r", "label": "Hypomania plus a major depressive episode, never mania?", "detail": "Bipolar II."}, {"id": "c", "parent": "r", "label": "Two years of milder ups and downs, never full episodes?", "detail": "Cyclothymic disorder (one year in young people)."}], "caption": "The highest high ever reached decides the type."}
:::

### Other bipolar diagnoses
- **Substance or medication-induced bipolar disorder**: steroids, stimulants, levodopa, and antidepressant-induced switches that do not persist beyond the drug.
- **Due to another medical condition**: hyperthyroidism, Cushing's, multiple sclerosis, frontal or right-hemisphere lesions, HIV, neurosyphilis. Think of these especially in **first-onset mania after 50**.

### Specifiers
Anxious distress; mixed features; rapid cycling; melancholic or atypical features (for depressive episodes); mood-congruent or incongruent psychotic features; catatonia; peripartum onset; seasonal pattern.

:::note ICD-11 says
ICD-11 has bipolar type I, bipolar type II and cyclothymic disorder, much as DSM-5-TR does. Two differences: ICD-11 keeps a **mixed episode** as its own episode type (DSM-5-TR uses a "mixed features" specifier instead), and it allows the core of a manic episode to be increased activity **or the subjective experience of increased energy**, alongside the mood change.
:::

:::recall
1. What is the minimum needed for bipolar I? || One manic episode.
2. What two episodes define bipolar II? || At least one hypomanic and one major depressive episode, never mania.
3. State the cyclothymia rules. || 2 years (1 in youth) of sub-threshold highs and lows, symptomatic at least half the time, never symptom-free over 2 months, never full episodes.
4. In whom must you hunt hard for a medical cause of mania? || First-onset mania after about 50.
5. How does ICD-11 treat mixed states differently from DSM-5-TR? || As a separate mixed episode, not a specifier.
:::

:::mcq
Q: A woman has had recurrent depressions and one clear episode of hypomania, never mania. Diagnosis:
- Bipolar I disorder
- *Bipolar II disorder
- Cyclothymia
- Recurrent depressive disorder
> Hypomania plus major depression, never mania.
:::

## 2.2 Why it happens [core][beginner]

:::widget figure
{"id": "sleep-centres", "focus": ["scn"]}
:::

### Genetics: the strongest of the common psychiatric disorders
- Twin studies give heritability of about 60 to 85%, and up to about 90% in some.
- Against the general lifetime risk of about 1 in 100 that you met in the Starting level, a first-degree relative carries about 5 to 10%.
- Identical twins share it only 40 to 70% of the time, so genes are not destiny.
- Many genes of small effect, overlapping with schizophrenia and depression. The Advanced level covers the latest findings.

### Biology in brief
- **Dopamine**: too much dopamine activity is linked to mania. Drugs that raise dopamine (stimulants, levodopa) can trigger it; drugs that block it (antipsychotics) treat it.
- **Body clock**: disrupted circadian rhythms. Sleep loss can trigger mania; regular sleep protects.
- **Cell signalling**: lithium and valproate act on signalling pathways inside neurons and protect them.
- **Kindling**: early episodes often follow stress; later episodes can start on their own, as if the brain has been sensitised.

:::widget flow
{"title": "Kindling in bipolar disorder", "layout": "cycle", "nodes": [{"id": "a", "label": "Stress or sleep loss", "detail": "Early episodes usually follow a clear trigger."}, {"id": "b", "label": "An episode", "detail": "Mania or depression, with broken sleep and stress hormones high."}, {"id": "c", "label": "The brain is sensitised", "detail": "Each episode seems to leave mood systems more reactive."}, {"id": "d", "label": "Easier next time", "detail": "Smaller triggers are enough, and later episodes can begin with no trigger at all."}], "caption": "A reason to treat early and keep people well: fewer episodes may mean a gentler course. The evidence is mixed, and not everyone follows this pattern."}
:::

:::widget brainmap
{"title": "Brain areas in bipolar disorder", "focus": ["prefrontal", "amygdala", "basal-ganglia", "hypothalamus", "hippocampus"], "notes": {"prefrontal": "The brakes and planning areas. During mood episodes they control emotional responses less well.", "amygdala": "Over-reactive to emotional faces and words, in highs and lows.", "basal-ganglia": "The striatum, a reward centre rich in dopamine. Too much dopamine drive fits the energy and goal-chasing of mania.", "hypothalamus": "Holds the body's master clock. Disturbed daily rhythms and sleep loss can trigger episodes.", "hippocampus": "Memory and stress regulation. Some studies find it larger in people taking lithium."}, "caption": "The Advanced level adds clock genes, cell signalling and reward sensitivity."}
:::

### Triggers
- Sleep deprivation: night shifts, long-distance travel, exams, a newborn baby, festivals and weddings.
- Stressful life events, both negative and positive (a promotion, a wedding).
- Stopping medication, especially lithium abruptly (rebound mania).
- Antidepressants, steroids, stimulants, cannabis, alcohol.
- Childbirth (high risk of postpartum episodes, including postpartum psychosis).

:::widget reveal
{"prompt": "Why might a wedding season in India be a risky time for someone with bipolar disorder?", "answer": "Late nights and broken sleep, travel, heavy social stimulation, alcohol, irregular meals and missed doses all come together. Even happy stress counts. Planning ahead (protecting sleep, keeping doses, limiting alcohol, a family member watching for early signs) prevents relapse."}
:::

:::widget layers
{"title": "Triggers sit on top of vulnerability", "shape": "iceberg", "layers": [{"label": "Triggers you can see", "detail": "Lost sleep, travel, exams, weddings, a newborn, stopping lithium, antidepressants, steroids, cannabis."}, {"label": "The body clock", "detail": "A daily rhythm that is easily knocked off course."}, {"label": "Reward drive", "detail": "Goals and successes can fire up drive very strongly."}, {"label": "Genes", "detail": "The most heritable of the common mood disorders, through many genes of small effect."}], "caption": "The trigger is the tip. Treatment protects the layers below as well: medicines, sleep, routine."}
:::

:::widget hypnogram
{"title": "Sleep in the mood swings", "caption": "Mania is the reverse problem: the night shrinks to a few hours without tiredness. Sleep loss can itself trigger mania, so protecting sleep is one of the most useful things a person with bipolar disorder can do."}
:::

:::recall
1. Which common mood disorder is most heritable? || Bipolar disorder.
2. What is the risk for a first-degree relative? || About 5 to 10%.
3. Name five triggers of a manic episode. || Sleep loss, stress (good or bad), stopping lithium, antidepressants, steroids, stimulants, cannabis, childbirth.
4. What is the kindling idea? || Early episodes are triggered by stress; later ones arise spontaneously.
:::

:::mcq
Q: Which statement about the genetics of bipolar disorder is TRUE?
- It is caused by one gene
- *It is among the most heritable psychiatric disorders, with many genes involved
- Identical twins always share it
- Family history is irrelevant to treatment
> Heritability is high, but identical twin concordance is well below 100%.
:::

## 2.3 Recognising it: the MSE and the differential [core][beginner]
### MSE in mania
| MSE heading | Typical findings |
|---|---|
| Appearance | Colourful or inappropriate dress, heavy make-up, poor self-care in severe mania |
| Behaviour | Overactive, restless, overfamiliar, disinhibited; may be hostile if contradicted |
| Speech | Pressured, loud, fast, hard to interrupt |
| Mood and affect | Elated, expansive or irritable; labile (quick swings to tears or anger) |
| Thought form | Flight of ideas, clang associations (linked by sound), puns |
| Thought content | Grandiose ideas or delusions (wealth, special powers, a mission from God); persecutory ideas if thwarted |
| Perception | Hallucinations in severe mania, usually mood-congruent |
| Cognition | Distractible; orientation usually intact except in delirious mania |
| Insight | Often poor: "Nothing is wrong with me" |
| Judgement | Impaired (spending, sexual risk, quitting jobs) |

:::word Writing it up
"Brightly dressed, overfamiliar, unable to sit for long. Speech pressured with flight of ideas and clang associations. Mood 'fantastic'; affect elated, labile, irritable when contradicted. Grandiose delusion of having a message from God. No hallucinations. Distractible; oriented. Insight grade 1; judgement impaired (spent ₹2 lakh this week)."
:::

### Differential diagnosis of mania
| Condition | Distinguishing points |
|---|---|
| Substance intoxication (stimulants, cannabis) | Timing with use, urine drug screen, settles as the drug clears |
| Medicines (steroids, levodopa, antidepressants) | Timing with the medicine |
| Hyperthyroidism | Weight loss, tremor, heat intolerance; thyroid tests |
| Schizophrenia or schizoaffective disorder | Psychosis persists without mood episodes |
| ADHD | Lifelong, not episodic; no decreased need for sleep |
| Borderline personality disorder | Mood shifts last hours and react to relationships; chronic emptiness |
| Delirium or brain lesion | Fluctuating consciousness, neurological signs, late onset |

:::widget sort
{"prompt": "Bipolar disorder, borderline personality disorder or ADHD? Place each pattern.", "buckets": ["Bipolar disorder", "Borderline personality disorder", "ADHD"], "items": [{"text": "Distinct episodes of days to weeks, with less need for sleep", "bucket": 0}, {"text": "Mood shifts within hours after a fight with a partner", "bucket": 1}, {"text": "Restless and distractible every day since primary school", "bucket": 2}, {"text": "Chronic emptiness and intense fear of abandonment", "bucket": 1}, {"text": "Grandiose plans that are clearly different from his usual self", "bucket": 0}, {"text": "Impulsive and forgetful in every setting, with no clear 'episodes'", "bucket": 2}]}
:::

:::widget flow
{"title": "Differential diagnosis of a high", "layout": "tree", "nodes": [{"id": "r", "label": "Elevated or irritable mood with overactivity", "detail": "Rule out the look-alikes before calling it bipolar disorder."}, {"id": "s", "parent": "r", "label": "Substance?", "detail": "Stimulants, cannabis, alcohol withdrawal. Timing with use and a urine drug screen; it settles as the drug clears."}, {"id": "m", "parent": "r", "label": "Medicine?", "detail": "Steroids, levodopa, antidepressants. Timing with the medicine."}, {"id": "o", "parent": "r", "label": "Organic?", "detail": "Hyperthyroidism, brain lesions (especially right-sided or frontal), HIV, neurosyphilis, delirium. Think hard when onset is after 50 or there are neurological signs."}, {"id": "p", "parent": "r", "label": "Psychosis without mood episodes?", "detail": "Schizophrenia or schizoaffective disorder: psychosis persists between mood changes."}, {"id": "b", "parent": "r", "label": "Shifts over hours, tied to relationships?", "detail": "Borderline personality disorder: chronic emptiness, fear of abandonment, no decreased need for sleep."}, {"id": "a", "parent": "r", "label": "Lifelong, continuous restlessness?", "detail": "ADHD: present since childhood, not episodic, no decreased need for sleep."}, {"id": "bp", "parent": "r", "label": "None of these: a bipolar episode", "detail": "Distinct episodes of days or longer with sleep and energy change."}], "caption": "Episodes, sleep and energy separate bipolar disorder from most look-alikes."}
:::

### Investigations
Thyroid function, urine drug screen, blood count, kidney and liver tests, calcium and glucose; pregnancy test where relevant; ECG; brain imaging if onset is late, there are neurological signs, or the picture is atypical. Before lithium: kidney function (eGFR), thyroid, calcium, weight.

:::recall
1. Give the MSE speech, thought form and insight findings in mania. || Pressured; flight of ideas, clang associations; poor insight.
2. How do you tell borderline mood instability from bipolar disorder? || Borderline shifts last hours and react to relationships; bipolar episodes last days or more with sleep and energy change.
3. How do you tell ADHD from mania? || ADHD is lifelong and continuous, without decreased need for sleep.
:::

:::mcq
Q: A 55-year-old with no psychiatric history becomes grandiose and disinhibited over a month, with new headaches. The priority is:
- Start lithium
- *Look for a secondary cause with neurological examination and brain imaging
- Diagnose bipolar I
- Start an antidepressant
> New mania late in life suggests an organic cause.
:::

## 2.4 Bipolar disorder in special groups [core][beginner]
### Women: pregnancy and after birth
- Stopping mood stabilisers in pregnancy carries a **high relapse risk**.
- The **weeks after delivery** are the highest-risk time in a woman's life for a bipolar episode, including **postpartum psychosis**.
- Plan before conception: choose safer medicines, avoid **valproate**, give folic acid, discuss risks honestly, and plan for delivery and protected sleep afterwards.

:::safety Postpartum psychosis is an emergency
Sudden confusion, sleeplessness, rapidly changing mood and strange beliefs about the baby, usually in the first days to weeks after birth, need same-day psychiatric care. Women with bipolar I, especially with a past postpartum episode, carry the highest risk.
:::

:::widget guess
{"prompt": "A woman has had one episode of postpartum psychosis. Out of 100 such women, about how many have another episode after a later delivery?", "min": 0, "max": 100, "step": 5, "unit": "in 100", "answer": [30, 50], "reveal": "About 30 to 50 in 100, with each later delivery. That is why pregnancy planning, a written birth plan, protected sleep after delivery and early review are essential. Postpartum psychotic episodes occur in about 1 in 500 to 1 in 1,000 deliveries overall, more often in first pregnancies.", "clinician": "DSM-5-TR: postpartum mood episodes with psychotic features occur in about 1 in 500 to 1 in 1,000 deliveries; recurrence risk with each subsequent delivery is 30 to 50% after one such episode. Risk is also raised with bipolar I and a family history of bipolar disorder. Plan prophylaxis (often lithium or an antipsychotic) with the woman and her obstetrician."}
:::

:::widget flow
{"title": "Planning a pregnancy with bipolar disorder", "layout": "chain", "nodes": [{"id": "a", "label": "Before conception", "detail": "Review medicines, avoid valproate, start folic acid, discuss risks of medicines and of relapse honestly."}, {"id": "b", "label": "Pregnancy", "detail": "Monitor closely; lithium levels change as blood volume rises, so check them more often."}, {"id": "c", "label": "Birth plan", "detail": "A written plan shared with the obstetric team: who to call, which medicines, how sleep will be protected."}, {"id": "d", "label": "First days after delivery", "detail": "The highest-risk time. Protected sleep, early review, family alert to warning signs of postpartum psychosis."}, {"id": "e", "label": "First months", "detail": "Continued review, support with feeding decisions and medicines, and a relapse plan."}], "caption": "Planning before conception gives the safest choices for mother and baby."}
:::

### Children and teenagers
- Mania in young people can look like **irritability, explosive anger and sleep loss**. Overdiagnosis is a risk.

| | Bipolar disorder | ADHD |
|---|---|---|
| Course | **Episodic**: a clear change from usual self | **Continuous** since early childhood |
| Grandiosity, decreased need for sleep | Present in episodes | Absent |
| Euphoria | Present | Absent |
| Distractibility, hyperactivity | During episodes | All the time |

- Chronic, non-episodic irritability with frequent temper outbursts suggests **disruptive mood dysregulation disorder**, not bipolar disorder.

### Older adults
- **New mania after 50** suggests a **secondary cause**: stroke (especially right-sided), tumour, dementia, thyroid disease, steroids and other medicines. Investigate with imaging.
- Lower lithium levels may be enough, and toxicity occurs at lower levels.

### Substances and other conditions
- Alcohol and cannabis use are very common and worsen the course (more episodes, mixed states, suicide).
- **Anxiety disorders, ADHD, migraine and metabolic syndrome** often co-exist. Heart disease is a leading cause of early death, so physical health matters as much as mood.

:::recall
1. What is the highest-risk time for a bipolar episode in women? || The period after childbirth.
2. Which mood stabiliser should be avoided in women who could become pregnant? || Valproate.
3. How do you tell bipolar disorder from ADHD in a child? || Bipolar is episodic with euphoria and less need for sleep; ADHD is continuous since early childhood.
4. What should new mania after 50 prompt? || A search for a secondary cause, with imaging.
:::

:::mcq
Q: Three days after delivery, a woman with a family history of bipolar disorder is confused, cannot sleep and believes her baby is evil. The best action is:
- Reassure her it's baby blues
- *Urgent psychiatric care the same day: possible postpartum psychosis
- An SSRI and outpatient review
- Ask her to stop breastfeeding and review later
> Postpartum psychosis is an emergency linked to bipolar disorder.
:::

# Part III · Treatment

## 3.1 Acute mania [core][beginner]
1. **Safety first**: assess risk to self, others, money and reputation; admission is often needed.
2. **Stop antidepressants** and stimulants.
3. **Start an antimanic medicine**:
   - An **antipsychotic** (olanzapine, risperidone, quetiapine, aripiprazole, haloperidol) for fast control, especially with psychosis or agitation.
   - **Lithium** (classic euphoric mania; also the long-term plan) or **valproate** (mixed states and rapid cycling; avoid in women who could become pregnant).
   - Severe mania: an antipsychotic **plus** lithium or valproate.
4. **Short-term benzodiazepine** (lorazepam) for agitation and sleep.
5. **ECT** for severe or treatment-resistant mania, or mania in pregnancy.
6. Reduce stimulation, restore sleep, involve the family.

:::widget flow
{"title": "The acute mania pathway", "layout": "chain", "nodes": [{"id": "a", "label": "Safety", "detail": "Risk to self, others, money and reputation. Admission is often needed."}, {"id": "b", "label": "Remove triggers", "detail": "Stop antidepressants and stimulants; reduce caffeine and alcohol."}, {"id": "c", "label": "Antimanic medicine", "detail": "An antipsychotic for fast control, lithium or valproate, or both in severe mania."}, {"id": "d", "label": "Short-term calm and sleep", "detail": "Lorazepam for agitation and sleep, tapered once settled."}, {"id": "e", "label": "ECT if needed", "detail": "Severe or treatment-resistant mania, or mania in pregnancy."}, {"id": "f", "label": "Low stimulation and family", "detail": "A quiet room, consistent limits, protected money and phone, and the family brought in."}], "caption": "The order matters: safety and removing the trigger come before choosing the medicine."}
:::


:::widget decide
{"scene": "Gaurav, 31, was started on sertraline by a GP for depression. He is now brought to emergency after five nights without sleep, shouting that he is 'the chosen one' and trying to withdraw all his family's savings. He is pacing and refuses tablets at first.", "ask": "What is the best first plan?", "choices": [{"label": "Increase the sertraline, since his depression has clearly lifted", "verdict": "harm", "outcome": "He becomes more agitated and runs out of the department.", "why": "This is mania. Antidepressants can drive it; raising the dose makes it worse."}, {"label": "Stop the sertraline, use calm de-escalation, offer an oral antipsychotic (with short-term lorazepam if needed), assess risk and admit", "verdict": "best", "outcome": "He accepts oral olanzapine after a calm conversation, sleeps that night, and is admitted. Lithium is planned for the longer term.", "why": "Remove the trigger, treat the mania quickly, try oral medicine first, and protect him and his family's money."}, {"label": "Give an injection straight away without trying to talk to him", "verdict": "ok", "outcome": "He is sedated, but feels assaulted and distrusts the team for months.", "why": "Rapid tranquillisation is sometimes needed for danger, but de-escalation and oral medicine come first when it is safe to try."}]}
:::

:::student
### Typical adult daily doses (educational only)
For learning, not advice to take or change any medicine.

| Medicine | Typical adult daily range in mania |
|---|---|
| Olanzapine | 10 to 20 mg |
| Risperidone | 2 to 6 mg |
| Quetiapine | 400 to 800 mg |
| Haloperidol | 5 to 15 mg |
| Lithium | Dosed by blood level, not by a fixed number of milligrams |
| Sodium valproate | About 1000 to 2000 mg, adjusted by weight and level |
:::

:::clinician
### Antimanic dosing (for learning; check current guidelines)
Common Indian brand names are examples only; brands change.

| Medicine | Start | Usual range in mania | Indian brands | Key notes |
|---|---|---|---|---|
| Olanzapine | 10 to 15 mg | 10 to 20 mg | Oleanz | Fast; sedation; weight and metabolic effects |
| Risperidone | 2 mg | 2 to 6 mg | Sizodon, Risdone | Prolactin rise, EPS at higher doses |
| Quetiapine | 100 mg on day 1, rising by 100 mg a day | 400 to 800 mg | Qutipin | Sedation, postural hypotension, metabolic effects |
| Aripiprazole | 15 mg | 15 to 30 mg | Arip MT | Akathisia; little weight gain; doses below 15 mg may not work in mania |
| Haloperidol | 5 mg | 5 to 15 mg | Serenace | Fast, but EPS; avoid long-term use |
| Lithium | 400 mg at night (200 mg in the elderly); Indian tablets are often 300 mg, slow-release 400 or 450 mg | Adjust to a level of about 0.8 to 1.0 mmol/L in acute mania | Licab, Lithosun SR, Intalith CR | Level 12 hours after the last dose; adjust every few days by level |
| Valproate (semisodium) | 250 mg three times daily; or sodium valproate slow release 500 mg a day | Titrate by response and level; loading 20 to 30 mg/kg/day can be used | Encorate Chrono, Valparin Chrono, Dicorate ER | Aim for a trough level of at least about 50 mg/L, often 50 to 100; avoid in women of childbearing potential |
| Lorazepam | 1 to 2 mg | Up to about 4 mg a day, short term | Ativan, Larpose | Agitation and sleep; taper |

**Rapid tranquillisation**: oral first. If needed, intramuscular lorazepam, or an intramuscular antipsychotic (for example olanzapine or haloperidol with an anticholinergic available). Do not give intramuscular olanzapine and intramuscular lorazepam together. Monitor pulse, blood pressure, breathing and consciousness afterwards.
:::

:::widget reveal
{"prompt": "An untreated manic episode often settles on its own in time. So why treat at all?", "answer": "Because a lot of harm can happen during the episode: lost savings, jobs, relationships, reputation, legal trouble, injury, exhaustion and dehydration, and suicide during mixed or post-manic depressive states. Untreated mania often lasts months. Treatment shortens it and protects the person's life outside the illness."}
:::

:::widget pathways
{"system": "dopamine", "caption": "Antipsychotics calm mania by blocking D2 receptors in the mesolimbic pathway, easing drive, grandiosity and psychosis."}
:::

:::widget receptor
{"receptor": "D2", "caption": "Aripiprazole and cariprazine are partial agonists at D2 receptors. Compare full agonist, partial agonist and antagonist. A partial agonist holds the signal at a middle level, so it calms excess dopamine in mania without shutting it off completely. This is also why low doses of aripiprazole may be too weak for mania."}
:::

:::recall
1. Outline the treatment of acute mania in six steps. || Safety, stop antidepressants, antimanic medicine, short-term benzodiazepine, ECT if severe, low stimulation and sleep.
2. When is valproate preferred over lithium? || Mixed states and rapid cycling (and not in women who could become pregnant).
3. What is the first step for a patient who becomes manic on an antidepressant? || Stop the antidepressant.
:::

:::mcq
Q: A manic patient on an SSRI for depression is brought in. The first medicine change is to:
- Increase the SSRI
- *Stop the antidepressant and start an antimanic medicine
- Add a stimulant
- Add a second antidepressant
> Antidepressants can drive mania.
:::

## 3.2 Bipolar depression [core][beginner]
:::trap Antidepressants alone are risky
An antidepressant **without** a mood stabiliser can trigger mania, mixed states or rapid cycling, and often works less well in bipolar depression. Avoid antidepressant monotherapy in bipolar I. If one is used (sometimes in bipolar II, or with a mood stabiliser), choose an SSRI or bupropion rather than a tricyclic or venlafaxine, avoid it in mixed features or rapid cycling, and stop it once the depression resolves.
:::

:::widget compare
{"title": "Clues that a depression may be bipolar", "a": {"label": "More typical of unipolar depression", "points": ["First episode later in adult life", "No close relative with bipolar disorder", "Gradual onset", "Insomnia and poor appetite", "Responds steadily to an antidepressant"], "summary": "These features fit unipolar depression, though none rules bipolar out."}, "b": {"label": "Raise the suspicion of bipolar disorder", "points": ["First episode in the teens or early twenties", "A parent or sibling with bipolar disorder", "Sudden onset, oversleeping and overeating, heavy limbs", "Psychotic features, or onset after childbirth", "Became high, agitated or 'wired' on an antidepressant"], "summary": "These clues call for a careful search for past hypomania before an antidepressant is given alone."}, "caption": "Always ask the family about past highs. Many people with bipolar disorder spend years being treated for depression only."}
:::

### Options with good evidence
- **Quetiapine**: effective for bipolar I and II depression.
- **Lurasidone**: effective for bipolar I depression, with fewer metabolic effects.
- **Olanzapine with fluoxetine** in combination.
- **Cariprazine** and **lumateperone**: newer options approved in the US for bipolar depression.
- **Lamotrigine**: better for preventing depressive episodes than for treating an acute one (slow titration).
- **Lithium**: modest acute benefit; strongly anti-suicidal; the long-term base.
- **ECT**: severe, psychotic or treatment-resistant bipolar depression.
- Psychological: psychoeducation, CBT, interpersonal and social rhythm therapy, family-focused therapy.

:::widget decide
{"scene": "Ritika, 34, has bipolar II disorder and is on lamotrigine 200 mg. She has a moderate depressive episode. She is a bank officer in Pune and says her friend got better on sertraline. She has never had rapid cycling or mixed features.", "ask": "What do you do?", "choices": [{"label": "Stop lamotrigine and start sertraline alone", "verdict": "harm", "outcome": "A few weeks later she is sleepless, irritable and spending, then crashes again.", "why": "Removing the mood stabiliser and starting an antidepressant alone risks a switch and destabilises her course."}, {"label": "Check adherence and triggers, keep lamotrigine, and add an evidence-based option for bipolar depression such as quetiapine; consider an SSRI only as an add-on with close watch for switching; add psychoeducation and a sleep routine", "verdict": "best", "outcome": "She improves with quetiapine added at night and a sleep routine. No switch occurs.", "why": "Keep the stabiliser, add a treatment with evidence in bipolar depression, and use antidepressants, if at all, only as cautious add-ons."}, {"label": "Do nothing; bipolar depression always passes on its own", "verdict": "ok", "outcome": "She stays depressed for months and misses work.", "why": "Bipolar depressions are often long and carry high suicide risk. They need active treatment."}]}
:::

:::clinician
### Bipolar depression dosing (for learning; check current guidelines)
| Medicine | Dose | Indian brands | Notes |
|---|---|---|---|
| Quetiapine | 50 mg on day 1, 100 mg day 2, 200 mg day 3, 300 mg day 4, at night; 300 mg is the usual target (some use up to 600 mg) | Qutipin | Sedation, weight, metabolic monitoring |
| Lurasidone | 20 mg a day with food (at least about 350 kcal), up to 60 to 120 mg | | Akathisia, nausea; must be taken with food |
| Olanzapine with fluoxetine | Olanzapine 6 to 12 mg with fluoxetine 25 to 50 mg (the US fixed combination), given at night | | Weight gain, sedation |
| Cariprazine | 1.5 mg, up to 3 mg | | Long half-life; akathisia |
| Lumateperone | 42 mg once daily | | Sedation |
| Lamotrigine | See the titration guess in 3.4 | Lamitor, Lametec | Rash risk; slow titration |
:::

:::widget flow
{"title": "Choosing treatment for bipolar depression", "layout": "tree", "nodes": [{"id": "r", "label": "A person with bipolar disorder is depressed", "detail": "First check adherence, sleep, alcohol, thyroid and recent stressors."}, {"id": "s", "parent": "r", "label": "Severe, psychotic, or not eating?", "detail": "Consider ECT and admission."}, {"id": "q", "parent": "r", "label": "Acute treatment with evidence", "detail": "Quetiapine (bipolar I and II), lurasidone, olanzapine with fluoxetine, cariprazine, lumateperone."}, {"id": "l", "parent": "r", "label": "Prevention of further depressions", "detail": "Lamotrigine (slow start) and lithium, which also lowers suicide risk."}, {"id": "a", "parent": "r", "label": "Antidepressant?", "detail": "Never alone in bipolar I. If used, add to a mood stabiliser, choose an SSRI or bupropion, avoid in mixed features or rapid cycling, stop after recovery."}, {"id": "p", "parent": "r", "label": "Alongside every option", "detail": "Psychoeducation, a sleep routine, social rhythm therapy, family work, CBT."}], "caption": "Bipolar depression is treated with its own set of medicines, not simply with antidepressants."}
:::

:::recall
1. Why avoid antidepressant monotherapy in bipolar I? || It can trigger mania, mixed states or rapid cycling, and works less well.
2. Name five evidence-based treatments for bipolar depression. || Quetiapine, lurasidone, olanzapine-fluoxetine, cariprazine, lumateperone (plus lamotrigine for prevention, lithium, ECT).
3. If an antidepressant is used in bipolar disorder, which kinds and with what safeguards? || An SSRI or bupropion, added to a mood stabiliser, not in mixed features or rapid cycling, stopped after recovery.
:::

:::mcq
Q: For acute bipolar depression, which option has the BEST evidence?
- Fluoxetine alone
- *Quetiapine
- Haloperidol
- Alprazolam
> Quetiapine, lurasidone and olanzapine-fluoxetine have evidence; antidepressants alone are risky.
:::

## 3.3 Lithium in depth [core][beginner]
Lithium is the **gold standard** for long-term bipolar treatment. It prevents both mania and depression, and it **reduces suicide**. Its therapeutic range is narrow, so it is dosed by **blood level**.

:::widget guess
{"prompt": "How many hours after the last dose should a lithium blood sample be taken?", "min": 1, "max": 24, "unit": "hours", "answer": [12, 12], "reveal": "12 hours after the last dose. With night-time dosing, that means a morning sample before the next dose. A sample taken soon after a dose reads falsely high.", "clinician": "Take the level 12 hours post-dose, and about 5 to 7 days after starting or after any dose change, when steady state is reached. Repeat after each change until the target level is stable."}
:::

:::widget journey
{"drug": "lithium", "target": "enzymes inside neurons (inositol monophosphatase and GSK-3) and the signalling pathways they control", "routes": ["oral"], "notes": {"gut": "Lithium is a simple salt, absorbed almost completely from the gut. Slow-release tablets smooth the peaks.", "liver": "Unusually, the liver does not break lithium down at all. There is no first pass and no CYP interactions. Everything depends on the kidneys.", "blood": "Lithium is not bound to proteins and spreads through body water. Its half-life is about a day in young adults and longer in older people, so steady state comes about 5 to 7 days after a change.", "bbb": "Lithium crosses into the brain slowly, so brain levels lag behind blood levels.", "out": "Removed almost entirely by the kidneys, which handle it like sodium. Dehydration, low salt, NSAIDs, ACE inhibitors and thiazides make the kidneys hold on to it, so levels rise."}, "caption": "Because only the kidneys clear lithium, anything that changes kidney handling of salt and water changes the level."}
:::

:::widget figure
{"id": "lithium-neuron"}
:::

### Target levels
- Most adults: about **0.6 to 0.8 mmol/L** for maintenance.
- If relapse occurs at that level and lithium is tolerated: up to **0.8 to 1.0 mmol/L**.
- Acute mania: about **0.8 to 1.0 mmol/L**, with close monitoring.
- Older adults: often **0.4 to 0.6 mmol/L**, with a lower ceiling in the very old.

:::widget curve
{"kind": "half-life", "title": "Lithium: half-life and steady state", "caption": "Set the half-life to about 24 hours, close to lithium's in a young adult. Levels settle after about 4 to 5 half-lives, which is why the blood level is checked about 5 to 7 days after starting or changing the dose."}
:::

:::widget layers
{"title": "Lithium levels, from danger to too little", "shape": "stack", "layers": [{"label": "Above about 2.0 mmol/L", "detail": "Severe toxicity: confusion, seizures, coma, kidney failure. Emergency; dialysis may be needed."}, {"label": "About 1.5 to 2.0 mmol/L", "detail": "Toxicity is reliable here: coarse tremor, vomiting, diarrhoea, unsteadiness, slurred speech."}, {"label": "About 1.0 to 1.5 mmol/L", "detail": "Above the usual range. Side effects rise; older people can be toxic here."}, {"label": "About 0.8 to 1.0 mmol/L", "detail": "Acute mania, or maintenance after relapse at lower levels."}, {"label": "About 0.6 to 0.8 mmol/L", "detail": "The usual maintenance range for most adults."}, {"label": "About 0.4 to 0.6 mmol/L", "detail": "Often enough for older adults."}, {"label": "Below about 0.4 mmol/L", "detail": "Usually too low to protect against relapse."}], "caption": "The gap between helpful and harmful is narrow, which is why lithium is dosed by blood level."}
:::

### Before starting
Kidney function (eGFR) and urea and electrolytes, thyroid function, calcium, weight or BMI, ECG if there is heart disease or risk, and a pregnancy test where relevant.

:::widget guess
{"prompt": "Once a patient is stable on lithium, how often should the lithium level, kidney function and thyroid function be checked?", "min": 1, "max": 24, "unit": "months", "answer": [3, 6], "reveal": "Every 3 to 6 months. Many guidelines check levels every 3 months in the first year, then every 6 months when stable, with kidney and thyroid tests every 6 months. Check more often in older people, those on interacting drugs, and those with kidney problems.", "clinician": "Typical schedule: level every 3 months for the first year, then every 6 months if stable (every 3 months if older, on interacting drugs, poor adherence, renal impairment, or last level 0.8 or above). eGFR, thyroid function and calcium every 6 months; weight regularly."}
:::

:::widget flow
{"title": "Lithium monitoring, from first test to long-term", "layout": "chain", "nodes": [{"id": "a", "label": "Baseline", "detail": "Kidney function (eGFR), urea and electrolytes, thyroid, calcium, weight, ECG if heart risk, pregnancy test where relevant."}, {"id": "b", "label": "Start", "detail": "Usually at night, at a low dose in older people."}, {"id": "c", "label": "First level", "detail": "About 5 to 7 days after starting, 12 hours after the last dose."}, {"id": "d", "label": "Adjust", "detail": "Change the dose and recheck the level after each change until stable."}, {"id": "e", "label": "First year", "detail": "Levels about every 3 months; kidney, thyroid and calcium about every 6 months."}, {"id": "f", "label": "When stable", "detail": "Levels about every 6 months (3 if older, on interacting drugs or with kidney problems)."}], "caption": "A steady routine of tests is what makes lithium safe."}
:::

### Side effects
| Common | Long term |
|---|---|
| Thirst and passing a lot of urine | **Hypothyroidism** (especially women) |
| Fine tremor of the hands | Reduced kidney function; **nephrogenic diabetes insipidus** |
| Nausea, loose stools early | **Hyperparathyroidism** and raised calcium |
| Weight gain, oedema | Acne, worsening psoriasis |
| Metallic taste | ECG changes (T-wave flattening), rarely sinus node problems |

### Toxicity
Toxic effects reliably appear above about **1.5 mmol/L**, but can occur at lower levels, especially in older people.

| Level of toxicity | Signs |
|---|---|
| Early | Loss of appetite, nausea, vomiting, **diarrhoea**, **coarse tremor**, muscle weakness, drowsiness |
| Moderate | Unsteadiness (**ataxia**), slurred speech, confusion, muscle twitching |
| Severe (often above about 2 mmol/L) | Disorientation, seizures, coma, kidney failure, death |

:::widget flow
{"title": "How lithium toxicity builds", "layout": "chain", "nodes": [{"id": "a", "label": "Something changes", "detail": "A hot summer, diarrhoea, fever, a new painkiller such as diclofenac, a blood pressure tablet, a crash diet."}, {"id": "b", "label": "Kidneys hold lithium", "detail": "When salt and water run low, the kidneys reabsorb sodium, and lithium with it."}, {"id": "c", "label": "Level climbs", "detail": "Without any change in dose."}, {"id": "d", "label": "Early signs", "detail": "Nausea, diarrhoea, coarse tremor, weakness, drowsiness."}, {"id": "e", "label": "Moderate", "detail": "Unsteadiness, slurred speech, confusion, twitching."}, {"id": "f", "label": "Severe", "detail": "Seizures, coma, kidney failure. Stop lithium, check the level, give fluids, consider dialysis."}], "caption": "Diarrhoea from toxicity causes more dehydration, which raises the level further: a dangerous spiral. Early action breaks it."}
:::

**Things that raise lithium levels**: dehydration (heat, fever, vomiting, diarrhoea), low-salt diets, **NSAIDs** (ibuprofen, diclofenac), **ACE inhibitors** and angiotensin receptor blockers, **thiazide diuretics**, and kidney impairment.

:::widget decide
{"scene": "Sheela, 52, has taken lithium for six years. During a hot May in Nagpur she had three days of diarrhoea and took diclofenac for knee pain. Her daughter calls: 'Mummy's hands are shaking a lot, she's vomiting, and she's walking like she's drunk.'", "ask": "What do you advise?", "choices": [{"label": "Reassure her that tremor is a normal lithium side effect and to continue as usual", "verdict": "harm", "outcome": "By night she is confused and has a seizure.", "why": "Coarse tremor with vomiting and unsteadiness is toxicity, not the usual fine tremor."}, {"label": "Stop lithium and diclofenac now and come to emergency today for an urgent lithium level, kidney function and electrolytes, with fluids", "verdict": "best", "outcome": "Her level is 2.1 mmol/L with raised creatinine. She is treated with intravenous fluids and recovers. Lithium is restarted later at a lower dose with clear sick-day rules.", "why": "Dehydration plus an NSAID raised her level. Toxicity is an emergency: stop lithium, measure the level, rehydrate, and consider dialysis if severe."}, {"label": "Ask her to take half her usual dose tonight and see how she is in the morning", "verdict": "harm", "outcome": "She keeps vomiting overnight and deteriorates.", "why": "Toxicity needs same-day assessment, not home adjustment."}]}
:::

:::clinician
### Managing lithium toxicity
- Stop lithium. Check the level, urea and electrolytes, creatinine, calcium, ECG; repeat levels (slow-release tablets can keep levels rising for hours).
- Restore fluid and sodium with intravenous saline; avoid diuretics and NSAIDs.
- Whole-bowel irrigation may be used for large slow-release overdoses; activated charcoal does not bind lithium.
- **Haemodialysis** for severe toxicity: very high levels (often cited above about 4 mmol/L, or lower with kidney impairment), reduced consciousness, seizures or dangerous arrhythmias.
- On restarting, review the cause and the target level.

### Lithium in pregnancy and stopping
- First-trimester exposure carries a small increased risk of cardiac malformations (including Ebstein's anomaly); the absolute risk is lower than once thought. Levels change through pregnancy and fall rapidly after delivery, so monitor closely and plan delivery with obstetrics.
- Stop gradually, over at least a month and preferably about three. Abrupt stopping can cause **rebound mania**.

### Sick-day rules to teach
Drink extra fluids in heat; if vomiting, diarrhoea or fever lasts more than a day, stop lithium and get a level checked; avoid over-the-counter painkillers like ibuprofen; tell every doctor you take lithium.
:::

:::recall
1. When is a lithium level taken? || 12 hours after the last dose, about 5 to 7 days after a change.
2. What is the usual maintenance range? || About 0.6 to 0.8 mmol/L (up to 1.0 if needed).
3. List five signs of lithium toxicity. || Coarse tremor, vomiting, diarrhoea, ataxia, slurred speech, confusion, seizures.
4. Give five things that raise lithium levels. || Dehydration, fever, NSAIDs, ACE inhibitors or ARBs, thiazides, low salt, kidney impairment.
5. Name three long-term effects of lithium. || Hypothyroidism, reduced kidney function or diabetes insipidus, hyperparathyroidism.
:::

:::mcq
Q: A woman stable on lithium develops fever and diarrhoea for 3 days and now has coarse tremor and unsteadiness. The most likely cause is:
- Relapse of mania
- *Lithium toxicity from dehydration
- A normal side effect
- Tardive dyskinesia
> Dehydration raises levels; check a level urgently and stop lithium.

Q: Which medicine is safest for pain in a patient on lithium?
- Ibuprofen
- Diclofenac
- *Paracetamol
- Naproxen
> NSAIDs raise lithium levels.
:::

## 3.4 Other mood stabilisers and antipsychotics [core][beginner]
| Medicine | Best for | Key cautions |
|---|---|---|
| **Valproate** | Acute mania, mixed states, rapid cycling, maintenance against mania | **Avoid in women and girls who could become pregnant** (high risk of birth defects and developmental problems); weight gain, tremor, hair loss, liver injury, low platelets, pancreatitis, raised ammonia, polycystic ovaries |
| **Lamotrigine** | Preventing **depressive** relapse; bipolar II | Must be titrated slowly because of **rash**, including rare Stevens-Johnson syndrome; little effect against mania |
| **Carbamazepine** | Mania and maintenance when others fail | Strong enzyme inducer (makes the pill and many drugs fail); low sodium; low white cells; rash (HLA-B*15:02); teratogenic |
| **Atypical antipsychotics** (quetiapine, olanzapine, aripiprazole, risperidone) | Acute mania; quetiapine also bipolar depression; maintenance if they controlled the episode | Weight, diabetes, lipids (olanzapine, quetiapine), akathisia (aripiprazole), prolactin (risperidone) |
| **Long-acting injections** (aripiprazole, risperidone) | Maintenance when adherence is a problem | As for oral forms |

:::widget guess
{"prompt": "Lamotrigine must be started slowly to reduce the risk of a serious rash. About how many weeks does it take to reach the usual 200 mg dose in a person not on interacting drugs?", "min": 1, "max": 16, "unit": "weeks", "answer": [5, 7], "reveal": "About 6 weeks. Rushing the dose raises the risk of a serious rash. Any new rash means stopping and seeing a doctor at once.", "clinician": "Standard monotherapy titration: 25 mg daily for 2 weeks, 50 mg daily for 2 weeks, 100 mg daily for 1 week, then 200 mg daily. With valproate (which roughly doubles lamotrigine levels) halve this: 25 mg on alternate days for 2 weeks, 25 mg daily for 2 weeks, then 50 mg, then 100 mg. With carbamazepine (an inducer) the schedule is roughly doubled. If more than about 5 days of doses are missed, restart the titration. Combined oral contraceptives lower lamotrigine levels. Indian brands: Lamitor, Lametec."}
:::

:::widget sort
{"prompt": "Which medicine fits each job best?", "buckets": ["Lithium", "Valproate", "Lamotrigine"], "items": [{"text": "Prevents depressive relapses more than manic ones", "bucket": 2}, {"text": "The best evidence for preventing suicide", "bucket": 0}, {"text": "Avoid in women who could become pregnant", "bucket": 1}, {"text": "Dosed by a level taken 12 hours after the last dose", "bucket": 0}, {"text": "Needs a slow start because of serious rash risk", "bucket": 2}, {"text": "Often chosen for mixed states and rapid cycling", "bucket": 1}, {"text": "Can cause hypothyroidism and kidney changes", "bucket": 0}, {"text": "Can raise ammonia and lower platelets", "bucket": 1}]}
:::

:::clinician
### Monitoring (for learning; check current guidelines)
| Medicine | Baseline | Ongoing |
|---|---|---|
| Valproate | Weight, liver tests, blood count with platelets, pregnancy status | Liver tests and blood count early and then periodically; weight; levels if poor response, toxicity or adherence doubts |
| Carbamazepine | Blood count, liver tests, sodium, HLA-B*15:02 in people of South or East Asian ancestry where available | Blood count, sodium, liver tests; levels (about 4 to 12 mg/L); watch for interactions (autoinduction lowers its own level early) |
| Lamotrigine | Skin, contraceptive use | Rash; levels change with valproate, carbamazepine and oral contraceptives |
| Antipsychotics | Weight, waist, blood pressure, glucose or HbA1c, lipids, ECG if indicated, prolactin (risperidone) | Weight frequently at first, then regularly; glucose and lipids at about 3 months and yearly |

### Valproate and pregnancy
Exposure in pregnancy carries a high risk of major malformations (including neural tube defects) and of neurodevelopmental problems in the child. Avoid in women and girls of childbearing potential unless no alternative works and effective contraception is in place; regulators in several countries require a formal pregnancy prevention programme. Indian brands: Encorate Chrono, Valparin Chrono, Dicorate ER. Carbamazepine: Mazetol, Tegretol.
:::

:::widget flow
{"title": "Which mood stabiliser?", "layout": "tree", "nodes": [{"id": "r", "label": "Long-term treatment is needed", "detail": "Consider the pattern of episodes, the person's body and their plans."}, {"id": "li", "parent": "r", "label": "Classic mania, family lithium response, suicide risk", "detail": "Lithium: best evidence for preventing relapse and suicide."}, {"id": "va", "parent": "r", "label": "Mixed states or rapid cycling, not able to become pregnant", "detail": "Valproate, with liver, blood count and weight checks."}, {"id": "la", "parent": "r", "label": "Mostly depressive relapses, bipolar II", "detail": "Lamotrigine, started slowly because of rash."}, {"id": "ap", "parent": "r", "label": "An antipsychotic controlled the episode", "detail": "Continue it (quetiapine, aripiprazole, olanzapine) with metabolic checks; long-acting injection if adherence is hard."}, {"id": "cb", "parent": "r", "label": "Others have failed", "detail": "Carbamazepine, after HLA-B*15:02 testing where available; many interactions."}], "caption": "Most people do best on the medicine that matches their pattern, with a plan they agreed to."}
:::

:::recall
1. Which mood stabiliser mainly prevents bipolar depression? || Lamotrigine.
2. Give four cautions with valproate. || Teratogenic, weight gain, liver injury, low platelets (also pancreatitis, ammonia, PCOS).
3. Why does carbamazepine cause many interactions? || It is a strong enzyme inducer, including of itself.
4. How does valproate change lamotrigine dosing? || It roughly doubles lamotrigine levels, so the dose is halved.
:::

:::mcq
Q: A woman of 24 with bipolar I is planning a family. Which mood stabiliser should usually be avoided?
- Lithium
- *Valproate
- Quetiapine
- Lamotrigine
> High risk of birth defects and developmental problems.

Q: A man on carbamazepine says his partner's contraceptive pill failed while she was also on carbamazepine for epilepsy. The mechanism is:
- Carbamazepine blocks absorption
- *Enzyme induction speeds breakdown of the hormones
- It causes vomiting
- It inhibits liver enzymes
> Carbamazepine is a strong CYP3A4 inducer.
:::

## 3.5 Ward care, family and the relapse signature [core][beginner]
### The ward environment
- **Low stimulation**: a quiet room, few visitors, limited phone use; restore sleep.
- **Clear, calm limits** given consistently by all staff, without arguing or rising to provocation.
- **Protect** money (cards, phones), reputation (social media), relationships and sexual safety.
- Avoid confrontation over grandiose ideas; redirect to practical goals ("Let's get your sleep back first").

### De-escalation before medication
1. Keep a safe distance, open posture, calm low voice.
2. Listen and name the feeling ("You're frustrated that you can't leave").
3. Offer choices ("Would you like to sit here or walk in the corridor?").
4. Offer **oral medicine** before an injection.
5. Rapid tranquillisation only if de-escalation fails and there is danger, then monitor.

:::widget flow
{"title": "De-escalation, before any medicine", "layout": "chain", "nodes": [{"id": "a", "label": "Safe space", "detail": "Keep a safe distance, open posture, calm low voice, an exit for both of you."}, {"id": "b", "label": "Listen and name it", "detail": "'You're frustrated that you can't leave.'"}, {"id": "c", "label": "Offer choices", "detail": "'Would you like to sit here or walk in the corridor?'"}, {"id": "d", "label": "Offer oral medicine", "detail": "Before any injection."}, {"id": "e", "label": "Rapid tranquillisation only if needed", "detail": "When there is danger and talking has failed; then monitor pulse, blood pressure, breathing and consciousness."}], "caption": "Each step gives the person more control, which lowers the chance of the next one being needed."}
:::

### The legal frame in India
Many manic patients lack insight and the capacity to decide about admission. Use the **least restrictive** option. Under the Mental Healthcare Act 2017, a person may choose a **nominated representative** and write an **advance directive** while well, and supported admission is possible when a person with severe illness cannot decide and is at risk, with review safeguards.

:::widget decide
{"scene": "Arjun, 24, has had two manic episodes. He is now well on lithium. His parents in Lucknow want him to stop it: 'Tablets will spoil his kidneys and no one will marry him if they find out. We'll do a puja instead.' Arjun is unsure.", "ask": "How do you respond?", "choices": [{"label": "Tell the parents they are ignorant and that Arjun must obey medical advice", "verdict": "harm", "outcome": "The family leaves angry. Arjun stops lithium suddenly and relapses into mania within weeks.", "why": "Contempt drives families away. Abrupt lithium stopping also risks rebound mania."}, {"label": "Meet the family together: hear their fears, explain relapse risk and rebound mania, show how kidney and thyroid monitoring keeps lithium safe, say that prayer and medicine can go together, and agree a written relapse plan; respect Arjun's own decision as an adult with capacity", "verdict": "best", "outcome": "The parents agree to six-monthly blood tests and a trial of continued lithium. Arjun names his sister as his nominated representative and writes an advance directive.", "why": "Psychoeducation for the family, honest discussion of real risks and monitoring, and respecting the patient's autonomy keep him in care."}, {"label": "Agree to stop lithium immediately to keep the peace", "verdict": "harm", "outcome": "He becomes manic and loses his job.", "why": "Stopping abruptly after two manic episodes is very likely to cause relapse."}]}
:::

### A relapse signature
A **relapse signature** is a person's own early warning signs, in order, with agreed actions. It is written by the patient and family when the patient is well.

:::widget worked
{"title": "Building Ravi's relapse signature", "steps": [{"q": "Ravi, 32, has bipolar I. When well, he and his wife Neeta look back at his last two manic episodes. What were the earliest signs?", "a": "Sleeping 5 hours and feeling fine; making many plans; calling friends late at night."}, {"q": "What came next, in the middle stage?", "a": "Online shopping, irritability when questioned, talking fast."}, {"q": "What were the late signs?", "a": "Not sleeping at all; believing he would become a minister."}, {"q": "Now agree an action for each stage.", "a": "Early: keep routine, cut caffeine, tell Neeta, contact the clinic within days. Middle: Neeta holds the cards, same-week appointment, extra night-time medicine as agreed with the psychiatrist. Late: Neeta calls the team the same day; consider admission."}, {"q": "How is it kept useful?", "a": "A copy on the fridge and on both phones; reviewed after any episode and at regular check-ups; updated when triggers change (for example a new night-shift job)."}], "yourTurn": [{"q": "Meena's first sign before depression is sleeping 10 hours and stopping her morning walk. Write an action for that early stage.", "a": "For example: tell her sister, restart a daily walk with a friend, keep a fixed wake time, use her mood chart daily, and book a clinic review within days. If thoughts of death appear, contact the team the same day."}]}
:::

:::widget flow
{"title": "A relapse signature, stage by stage", "layout": "chain", "nodes": [{"id": "a", "label": "Early signs", "detail": "Ravi: 5 hours of sleep and feeling fine, many plans, late-night calls. Action: routine, no caffeine, tell Neeta, clinic within days."}, {"id": "b", "label": "Middle signs", "detail": "Online shopping, irritability, fast talk. Action: Neeta holds the cards, same-week appointment, agreed extra night-time medicine."}, {"id": "c", "label": "Late signs", "detail": "No sleep at all, believes he will become a minister. Action: the team is called the same day; admission considered."}, {"id": "d", "label": "After the episode", "detail": "Review what happened, update the signature, change triggers such as a night-shift job."}], "caption": "The earlier the stage at which the plan is used, the smaller the damage."}
:::

:::sounds Talking to a manic patient
"I can see you've got lots of ideas and energy right now. I also notice you haven't slept for three nights. When people with your illness lose sleep like this, things can get out of control. What I want is to help you sleep tonight, and then we'll talk through your plans tomorrow."
:::

:::widget layers
{"title": "A biopsychosocial formulation for bipolar disorder", "shape": "rings", "layers": [{"label": "Biological", "detail": "Strong family history, sleep loss on night shifts, cannabis use, stopping lithium suddenly."}, {"label": "Psychological", "detail": "Little insight during highs, shame after them, beliefs that medicine is 'for mad people', high reward drive."}, {"label": "Social", "detail": "Family conflict and fear of stigma at marriage time, money lost in a high, a supportive sister who can act as nominated representative."}], "caption": "Each ring holds both risks and strengths, and each needs its own part of the plan."}
:::

:::widget timeline
{"prompt": "Ravi has learned his relapse signature. Order his early warning signs of mania, from first to last.", "events": [{"label": "Goes to bed later, wakes early, but feels fine"}, {"label": "Many new ideas; starts several projects at once"}, {"label": "Talks faster; friends say he is 'on fire'"}, {"label": "Irritable when interrupted; spends on things he does not need"}, {"label": "Barely sleeps, takes out a loan for a business plan"}], "why": "For most people the first sign is a change in sleep. Catching the signature early lets the person and family act at once: protect sleep, cut stimulation, contact the team and adjust medicine, before a full episode."}
:::

### Psychological and social care
- **Psychoeducation** (individual or group): one of the most effective relapse-prevention tools.
- Mood charting; the relapse signature.
- **Interpersonal and social rhythm therapy (IPSRT)**: regular sleep, meals and routines.
- **Family-focused therapy**: communication and problem-solving.
- CBT for depression; reducing alcohol and cannabis.

:::recall
1. Name four parts of ward management of mania. || Low stimulation, consistent limits, protecting money and reputation, restoring sleep.
2. List the five steps of de-escalation. || Safe distance and calm voice, listen and name the feeling, offer choices, offer oral medicine, rapid tranquillisation only if needed.
3. What is a relapse signature and who writes it? || Personal early warning signs with agreed actions, written by patient and family when well.
4. What two MHCA 2017 tools can a person set up while well? || A nominated representative and an advance directive.
:::

:::mcq
Q: Ravi's agreed early warning sign is sleeping 5 hours and feeling fine. When it happens, the plan should first be:
- Wait until he believes he is a minister
- *Keep his routine, cut caffeine, tell his wife, and contact the clinic within days
- Stop all medicines
- Start an antidepressant
> Acting on early signs prevents a full relapse.
:::

## 3.6 Course and prognosis [core][beginner]
:::widget guess
{"prompt": "Out of 100 people who have one manic episode, about how many go on to have another mood episode?", "min": 0, "max": 100, "step": 5, "unit": "in 100", "answer": [85, 95], "reveal": "About 90 in 100. A first manic episode is almost never the last, which is why long-term treatment and a relapse plan are discussed from the start."}
:::

- Onset usually in the late teens to the twenties; men and women equally for bipolar I.
- About **90%** of people with one manic episode have more.
- Untreated mania often lasts about **3 months**; depressions last longer and dominate the illness over time.
- Many have residual symptoms and problems at work and in relationships between episodes.
- The lifetime risk of suicide is estimated at **20 to 30 times** that of the general population.
- Physical health: higher rates of heart disease, diabetes and obesity, partly from the illness and partly from medicines. Life expectancy is reduced, so physical checks matter.

| Better outcome | Worse outcome |
|---|---|
| Good adherence and insight | Poor adherence, stopping lithium suddenly |
| Short episodes, later onset | Rapid cycling, mixed states |
| Few psychotic features | Substance use, especially alcohol and cannabis |
| Good support | Psychotic features, comorbid anxiety, poor work history |

:::widget timeline
{"prompt": "Put the common path of bipolar disorder in order.", "events": [{"label": "A first depressive episode in the teens or early twenties"}, {"label": "Treated as ordinary depression"}, {"label": "A first manic or hypomanic episode, sometimes after an antidepressant"}, {"label": "Diagnosis corrected to bipolar disorder"}, {"label": "Long-term mood stabiliser, psychoeducation and a relapse plan"}, {"label": "Episodes become fewer and further apart"}], "why": "Depression usually comes first, so the correct diagnosis is often delayed by years. Each untreated episode may make the next more likely, which is why early recognition and long-term treatment matter."}
:::

:::recall
1. What proportion of people with one manic episode have more? || About 90%.
2. How much higher is the lifetime suicide risk in bipolar disorder? || About 20 to 30 times.
3. Name four poor prognostic factors. || Poor adherence, rapid cycling, mixed states, substance use, psychotic features.
:::

:::mcq
Q: Which patient has the BEST outlook in bipolar disorder?
- Early onset with rapid cycling and cannabis use
- *Classic mania with full recovery between episodes and good adherence
- Mixed episodes with poor support
- Many episodes before treatment
> Full recovery between episodes and adherence predict a good course.
:::

## 3.7 Level check · Beginner [beginner]
Twelve or more right out of fifteen (80%) opens the Advanced level.

:::mcq
Q: A manic episode requires a minimum duration of:
- 4 days
- *7 days, or any duration if admitted
- 14 days
- 1 month
> Admission overrides the duration rule.

Q: If mood is only irritable, how many B symptoms are needed for mania?
- Two
- Three
- *Four
- Five
> One more than with elated mood.

Q: Which feature makes an episode mania rather than hypomania, whatever its length?
- Decreased need for sleep
- Overspending
- *Psychotic features
- Flight of ideas
> Psychosis always means mania.

Q: Bipolar II requires:
- One manic episode
- *At least one hypomanic and one major depressive episode, never mania
- Two years of mild highs and lows
- Four episodes in a year
> Never a full manic episode.

Q: Four or more mood episodes in 12 months is:
- Cyclothymia
- Mixed features
- *Rapid cycling
- Seasonal pattern
> Check thyroid; avoid antidepressants.

Q: The strongest clue to bipolarity in a depressed patient is:
- Poor appetite
- *A family history of bipolar disorder
- Insomnia
- A recent stressor
> Genetic loading is the strongest single clue.

Q: In the MSE, "clang associations" are recorded under:
- Thought content
- *Thought form
- Perception
- Insight
> Words linked by sound: a form disturbance.

Q: Mood shifts lasting hours, triggered by arguments, with chronic emptiness suggest:
- Bipolar I disorder
- Rapid cycling
- *Borderline personality disorder
- Cyclothymia
> Short, reactive shifts point to personality.

Q: New mania in a 62-year-old should first prompt:
- Lithium at once
- *A search for a medical or neurological cause
- An antidepressant
- Discharge
> Late onset suggests a secondary cause.

Q: The first step for a patient who becomes manic on sertraline is:
- Increase the sertraline
- *Stop the sertraline and start an antimanic medicine
- Add a second antidepressant
- Wait and watch
> Remove the trigger.

Q: Which has good evidence for acute bipolar depression?
- Fluoxetine alone
- *Quetiapine
- Haloperidol
- Lorazepam
> Also lurasidone and olanzapine-fluoxetine.

Q: Lithium levels are taken:
- *12 hours after the last dose
- 1 hour after the dose
- Only once a year
- At any time
> A post-dose sample reads falsely high.

Q: A woman on lithium starts ibuprofen and develops vomiting, coarse tremor and unsteadiness. Most likely:
- Hypothyroidism
- *Lithium toxicity
- Neuroleptic malignant syndrome
- Serotonin syndrome
> NSAIDs raise lithium levels.

Q: Which mood stabiliser needs slow titration because of rash risk?
- Lithium
- Valproate
- *Lamotrigine
- Quetiapine
> Stevens-Johnson syndrome is rare but serious.

Q: A relapse signature is:
- A blood test
- *The person's early warning signs with agreed actions, written when well
- A legal document for admission
- A list of side effects
> Patient and family write it together.
:::

# Part IV · Advanced: mechanisms

## 4.1 The biology in depth [core][advanced]

:::widget figure
{"id": "endocrine", "focus": ["thyroid", "parathyroid"]}
:::

### Dopamine: up in mania, down in depression
- In 2.2 you met the link between dopamine and mania. The fuller **dopamine dysregulation** idea proposes raised signalling in mania and reduced signalling in bipolar depression, with a failure of the receptor adjustments that would normally restore balance between the two states.
- PET studies suggest raised D2/D3 receptor availability and striatal dopamine function in mania, with the reverse pattern in depression. One idea is that the brain over-corrects, swinging between the two states.

### The body clock
- The sleep loop from the Starting level has a molecular basis. Core **clock genes** (CLOCK, BMAL1, PER, CRY) run a feedback loop of roughly 24 hours in the suprachiasmatic nucleus of the hypothalamus and in cells throughout the body.
- Mice with a mutation in the clock gene **CLOCK** show mania-like behaviour that lithium reverses.
- **Lithium lengthens the circadian period** and stabilises daily rhythms, partly through GSK-3, an enzyme that also regulates clock proteins.
- The **social zeitgeber** idea: daily social cues (meals, work, bedtime) set the clock; when routines break (travel, shift work, a newborn), vulnerable people relapse. This is the basis of IPSRT.
- Mania peaks in spring and summer in many countries; depressions in autumn and winter.

:::widget flow
{"title": "The social zeitgeber model", "layout": "chain", "nodes": [{"id": "a", "label": "Life event", "detail": "A new baby, a night-shift job, long-distance travel, a wedding season."}, {"id": "b", "label": "Social rhythms break", "detail": "Bedtime, mealtimes, work and social contact lose their regular timing."}, {"id": "c", "label": "Body clock destabilises", "detail": "The time cues (zeitgebers) that set the circadian clock are lost; sleep and hormone rhythms drift."}, {"id": "d", "label": "Body symptoms", "detail": "Sleep loss and disturbed energy and appetite."}, {"id": "e", "label": "Episode", "detail": "In a vulnerable person, mania or depression follows."}], "caption": "This is the basis of interpersonal and social rhythm therapy (IPSRT): keep the rhythms, protect the clock."}
:::

:::widget figure
{"id": "two-process-sleep"}
:::

### Kindling and progression
- 2.2 introduced kindling. The term comes from epilepsy research, where repeated sub-threshold stimulation of the brain eventually produces seizures on its own. It was applied to mood disorders alongside **behavioural sensitisation**, in which repeated stimulant doses produce ever larger responses.
- Some long-term studies show more frequent episodes and more cognitive problems after many episodes, which is one argument for **early, sustained treatment**. The evidence is mixed; not everyone progresses.

### Cells, energy and structure
- **Intracellular signalling**: altered protein kinase C, GSK-3 and inositol signalling, the targets of lithium and valproate.
- **Mitochondria and energy**: raised brain lactate and reduced high-energy phosphates in some studies suggest an energy-supply problem in neurons.
- **Inflammation and oxidative stress**: raised inflammatory markers in mania and depression, partly returning towards normal between episodes.
- **Brain imaging**: overactive amygdala and reduced prefrontal control during emotional tasks; more white matter hyperintensities; some loss of cortical grey matter over repeated episodes. People on lithium tend to have **larger** grey matter and hippocampal volumes than those not on it, consistent with a protective effect.

:::widget brainmap
{"title": "Circuits and clocks in bipolar disorder", "focus": ["prefrontal", "amygdala", "basal-ganglia", "hypothalamus", "hippocampus"], "notes": {"prefrontal": "Ventrolateral and dorsolateral prefrontal cortex show reduced top-down control during emotional tasks, in both highs and lows.", "amygdala": "Hyper-reactive to emotional stimuli; partly normalises with treatment.", "basal-ganglia": "Ventral striatum: heightened response when anticipating reward in people with, and at risk of, bipolar disorder. Raised D2/D3 function in mania on PET.", "hypothalamus": "Suprachiasmatic nucleus, the master clock. Lithium lengthens the circadian period, partly through GSK-3, which also regulates clock proteins.", "hippocampus": "Larger grey matter and hippocampal volumes in people taking lithium, consistent with a protective effect."}, "caption": "Imaging findings are averages across groups; they cannot yet diagnose or predict for one person."}
:::

### Reward sensitivity
- People with bipolar disorder, and those at risk, often show **heightened reward sensitivity**: goals and possible rewards trigger strong drive. Goal-attainment events (a promotion, a new relationship) can precede mania, while failures can precede depression.

:::widget reveal
{"prompt": "Put the circadian and reward ideas together. Why might an exam topper who stays up for three nights before a big result be at special risk, if she has bipolar disorder?", "answer": "Sleep loss directly destabilises the body clock and can trigger mania. A big goal-attainment event (a top result, a job offer) strongly activates the reward system, which in reward-sensitive people can push towards a high. Two triggers arrive together. Protecting sleep and planning around big events is real relapse prevention."}
:::

:::widget flow
{"title": "The goal-attainment spiral", "layout": "cycle", "nodes": [{"id": "a", "label": "A success", "detail": "A promotion, a top result, a new relationship."}, {"id": "b", "label": "Strong reward drive", "detail": "In reward-sensitive people, success fires up wanting and goal-setting."}, {"id": "c", "label": "Bigger goals, more confidence", "detail": "New projects pile up; risks feel small."}, {"id": "d", "label": "Less sleep", "detail": "Late nights chasing the goals."}, {"id": "e", "label": "Rising mood", "detail": "Sleep loss and drive feed a climb towards hypomania or mania."}], "caption": "The mirror image happens with failure, which can precede depression. Planning around big events is real relapse prevention."}
:::

:::recall
1. State the dopamine hypothesis of bipolar disorder. || Raised dopamine signalling in mania, reduced in depression.
2. What did CLOCK mutant mice show? || Mania-like behaviour that lithium reversed.
3. What is the social zeitgeber idea? || Daily social routines set the body clock; when they break, vulnerable people relapse.
4. Describe kindling. || Early episodes need stressors; later ones start more easily or spontaneously.
5. What imaging finding is linked to lithium use? || Larger grey matter and hippocampal volumes.
:::

:::mcq
Q: Which finding supports a circadian model of bipolar disorder?
- Mania only occurs in winter
- *Sleep deprivation can trigger mania, and lithium lengthens the circadian period
- Lithium shortens sleep
- Circadian genes play no role
> Sleep and clock genes sit at the centre of the model.
:::

## 4.2 How the mood stabilisers work [core][advanced]
### Lithium: a simple ion with many targets
- **Inositol depletion**: lithium inhibits **inositol monophosphatase** (IMPase). Overactive neurons that recycle inositol for signalling run short of it, damping overactive signalling where it is greatest.
- **GSK-3 inhibition**: lithium inhibits glycogen synthase kinase-3 (directly, by competing with magnesium, and indirectly through Akt). GSK-3 inhibition promotes neuron survival, plasticity and stable clock rhythms.
- **Neuroprotection**: raises BDNF and the anti-cell-death protein Bcl-2.
- **Neurotransmitters**: reduces excitatory glutamate signalling and dampens dopamine signalling downstream of D2 receptors.
- **Kidney**: lithium enters collecting duct cells through sodium channels and blocks the response to antidiuretic hormone (via GSK-3 and aquaporin-2), causing thirst and dilute urine (nephrogenic diabetes insipidus).
- **Thyroid**: lithium is concentrated in the thyroid and reduces hormone release.

:::widget flow
{"title": "Lithium and inositol depletion", "layout": "chain", "nodes": [{"id": "a", "label": "Receptor fires", "detail": "Many receptors signal through phospholipase C, splitting PIP2 into IP3 and DAG."}, {"id": "b", "label": "IP3 is recycled", "detail": "IP3 is broken down step by step to inositol, which is needed to rebuild PIP2."}, {"id": "c", "label": "Lithium blocks IMPase", "detail": "Lithium inhibits inositol monophosphatase (and inositol polyphosphate phosphatase)."}, {"id": "d", "label": "Inositol runs short", "detail": "Especially in the busiest neurons, which recycle the most."}, {"id": "e", "label": "Overactive signalling damped", "detail": "Activity is reduced most where it is highest, sparing quieter cells."}], "caption": "This 'use-dependent' damping is one elegant explanation of how a simple ion can steady mood without sedating."}
:::

:::widget flow
{"title": "Why lithium makes people thirsty", "layout": "chain", "nodes": [{"id": "a", "label": "Lithium enters the collecting duct", "detail": "It passes into kidney collecting duct cells through epithelial sodium channels (ENaC)."}, {"id": "b", "label": "GSK-3 and signalling change", "detail": "Inside the cell, lithium disturbs the signalling that responds to antidiuretic hormone (ADH)."}, {"id": "c", "label": "Fewer water channels", "detail": "Less aquaporin-2 reaches the cell surface."}, {"id": "d", "label": "ADH ignored", "detail": "The kidney cannot concentrate urine: nephrogenic diabetes insipidus."}, {"id": "e", "label": "Dilute urine, thirst", "detail": "Large volumes of dilute urine and drinking to keep up. Amiloride, which blocks ENaC, can help by keeping lithium out."}], "caption": "Knowing the mechanism explains the treatment: block the entry channel."}
:::

:::widget figure
{"id": "lithium-neuron", "quiz": true}
:::

### Valproate, lamotrigine and carbamazepine
| Drug | Main actions | Why it matters |
|---|---|---|
| Valproate | Blocks voltage-gated sodium channels; raises GABA (inhibits its breakdown); inhibits **histone deacetylase** (HDAC), changing gene expression; reduces PKC | HDAC inhibition is one route to its teratogenicity |
| Lamotrigine | Blocks voltage-sensitive sodium channels, reducing **glutamate** release | Fits its antidepressant-prevention profile; little antimanic action |
| Carbamazepine | Blocks voltage-gated sodium channels | Strong CYP3A4 induction drives its interactions |

### Antipsychotics in mania and bipolar depression
- **Mania**: D2 antagonism or partial agonism in the mesolimbic pathway reduces the dopamine-driven drive, grandiosity and psychosis.
- **Quetiapine in depression**: its active metabolite **norquetiapine** inhibits the noradrenaline transporter (NET); it is also a 5HT1A partial agonist and a 5HT2A, 5HT2C and alpha-2 antagonist, and its H1 blockade helps sleep.
- **Lurasidone**: 5HT7 antagonism and 5HT1A partial agonism, alongside D2 and 5HT2A antagonism.
- **Cariprazine**: a D3-preferring D2/D3 partial agonist; D3 action is linked to mood and motivation.
- **Lumateperone**: strong 5HT2A antagonism, low D2 occupancy (partial agonism before the synapse, antagonism after it), modest SERT inhibition and indirect glutamate effects.

:::widget sort
{"prompt": "Match each mechanism to its medicine.", "buckets": ["Lithium", "Valproate", "Lamotrigine"], "items": [{"text": "Inhibits inositol monophosphatase", "bucket": 0}, {"text": "Inhibits GSK-3 by competing with magnesium", "bucket": 0}, {"text": "Inhibits histone deacetylase", "bucket": 1}, {"text": "Reduces glutamate release via sodium channels; little antimanic effect", "bucket": 2}, {"text": "Blocks the kidney's response to antidiuretic hormone", "bucket": 0}, {"text": "Inhibits the enzyme that breaks down GABA", "bucket": 1}]}
:::

:::clinician

:::widget release
{"transmitter": "dopamine", "title": "How antipsychotics calm mania", "caption": "Mania involves too much dopamine signalling in the reward pathway. Pick amphetamine to see the opposite: stimulants can trigger mania in people at risk."}
:::

### Receptor clues for side effects
- Olanzapine and quetiapine: H1 and 5HT2C blockade, so appetite and weight rise; M1 blockade (olanzapine, quetiapine at high doses) adds constipation and dry mouth.
- Aripiprazole and cariprazine: partial agonism gives akathisia rather than sedation; little prolactin rise.
- Risperidone: strong D2 binding outside the blood-brain barrier at the pituitary raises prolactin (menstrual changes, galactorrhoea, sexual dysfunction).
- Lithium tremor: fine postural tremor; treat with dose reduction or propranolol. Coarse tremor suggests toxicity.
:::

:::widget receptor
{"receptor": "D2", "title": "Partial agonism in bipolar disorder", "caption": "Cariprazine prefers D3 over D2, and both it and aripiprazole are partial agonists. Use the switch to compare a full antagonist (haloperidol-like) with a partial agonist. The partial agonist leaves some signal on, which fits fewer movement and prolactin effects, more akathisia, and possible benefits for mood and motivation through D3."}
:::

:::recall
1. Name two enzymes lithium inhibits. || Inositol monophosphatase and GSK-3.
2. How does lithium cause polyuria? || It blocks the collecting duct's response to ADH (nephrogenic diabetes insipidus).
3. Which mood stabiliser inhibits histone deacetylase? || Valproate.
4. How does norquetiapine contribute to quetiapine's antidepressant effect? || It inhibits the noradrenaline transporter.
5. What receptor does cariprazine prefer? || D3 (as a partial agonist).
:::

:::mcq
Q: Lamotrigine prevents bipolar depression more than mania. Its main mechanism is:
- D2 antagonism
- *Sodium channel block reducing glutamate release
- GSK-3 inhibition
- SERT inhibition
> A sodium channel blocker with glutamate effects.

Q: A woman on lithium for 10 years drinks 5 litres a day and passes large volumes of dilute urine. The mechanism is:
- Diabetes mellitus
- *Lithium blocking the kidney's response to antidiuretic hormone
- Psychogenic polydipsia only
- Hypercalcaemia only
> Nephrogenic diabetes insipidus; check kidney function, calcium and glucose.
:::

# Part V · Advanced: research frontiers

## 5.1 New and emerging treatments [core][advanced]
### Newer medicines for bipolar depression
- **Cariprazine** (US approval for bipolar I depression, 2019) and **lumateperone** (US approval for bipolar I and II depression, 2021) joined quetiapine, lurasidone and olanzapine-fluoxetine.
- They widen choice, especially for people who cannot tolerate weight gain or sedation.

### Ketamine and bipolar depression
- Small randomised trials show rapid improvement with intravenous ketamine in bipolar depression, usually added to a mood stabiliser, with a low reported switch rate.
- Esketamine trials excluded people with bipolar disorder, and it is not approved for bipolar depression.
- Status: promising, but small studies, short follow-up, and the same concerns about misuse and durability.

### Light and the body clock
- **Bright light therapy** for bipolar depression: a randomised trial found that **midday** light, rather than morning light, improved depression without triggering mania.
- **Chronotherapy**: one night of total sleep deprivation, followed by phase-advanced sleep and morning light, while on lithium, can produce rapid improvement in bipolar depression in specialist centres.
- **Blue-light-blocking glasses** at night reduced manic symptoms in a small randomised trial, as an add-on. Larger trials are needed.

### Psychedelics: a specific warning
- Trials of psilocybin and MDMA exclude people with bipolar I disorder because of the risk of triggering mania or psychosis.
- Reports suggest that combining **lithium with classic psychedelics** may provoke seizures. This combination should be avoided.

### Lithium: an old drug that is underused
- Prescribing of lithium has fallen in many countries despite the strongest evidence for relapse and suicide prevention. Reasons include monitoring burden, side effect fears and marketing of newer drugs.
- Some ecological studies link higher natural lithium in drinking water to lower suicide rates; these are observational and inconsistent, and do not justify adding lithium to water.

:::widget decide
{"scene": "Dr Sen, a junior resident, suggests starting a 22-year-old with first-episode mania on 'something modern instead of lithium, because lithium is old and needs too many blood tests'. The patient has classic euphoric mania, no kidney disease, and a grandmother who did well on lithium.", "ask": "As the senior, what do you say?", "choices": [{"label": "Agree; newer drugs are better and simpler", "verdict": "ok", "outcome": "The patient is treated with an atypical antipsychotic, gains 12 kg in a year and stops taking it.", "why": "Antipsychotics are reasonable options, but 'newer' does not mean better, and metabolic effects matter for a young person."}, {"label": "Explain that lithium has the strongest evidence for preventing relapse and suicide, that classic euphoric mania and a family history of lithium response predict good response, and that monitoring is manageable; discuss lithium with the patient and family", "verdict": "best", "outcome": "The patient chooses lithium after informed discussion. Monitoring is arranged, and he stays well.", "why": "Evidence, response predictors and shared decision-making, rather than habit or novelty, should drive the choice."}, {"label": "Insist on lithium without discussing side effects with the patient", "verdict": "harm", "outcome": "The patient stops it after feeling thirsty and shaky, without telling anyone.", "why": "Good evidence still needs informed consent and preparation for side effects."}]}
:::

:::widget layers
{"title": "How strong is the evidence? A ladder for new treatments", "shape": "stack", "layers": [{"label": "Approved and widely used", "detail": "Cariprazine and lumateperone for bipolar depression (US). Lithium, the oldest, still has the strongest evidence."}, {"label": "Large randomised trials", "detail": "Quetiapine, lurasidone and others for bipolar depression."}, {"label": "Small randomised trials", "detail": "Ketamine for bipolar depression; midday bright light; blue-light-blocking glasses for mania."}, {"label": "Open or observational studies", "detail": "Lithium in drinking water and suicide rates; chronotherapy series."}, {"label": "Exclusion and warning", "detail": "Psychedelic trials exclude bipolar I; lithium with classic psychedelics may provoke seizures."}], "caption": "A new treatment should be judged by its rung, not by how new it is."}
:::

:::recall
1. Name two newer US-approved treatments for bipolar depression. || Cariprazine and lumateperone.
2. What timing of bright light therapy helped bipolar depression without switching? || Midday light.
3. Why are people with bipolar I excluded from psychedelic trials? || Risk of triggering mania or psychosis.
4. Which combination with psychedelics may provoke seizures? || Lithium.
5. Give two reasons lithium is underused. || Monitoring burden, side effect fears, marketing of newer drugs.
:::

:::mcq
Q: A man with bipolar I, stable on lithium, plans to try psilocybin at a retreat. The most important specific risk to discuss is:
- Weight gain
- *Mania or psychosis, and possible seizures with lithium
- Constipation
- Hair loss
> Both the illness and lithium raise specific risks.
:::

## 5.2 Genes, lithium response and pharmacogenomics [core][advanced]
### What the latest genetics shows
- The largest genome-wide study so far (published 2025, over 150,000 people with bipolar disorder across ancestries) found **298 genome regions** linked to risk.
- Genetic risk overlaps strongly with schizophrenia and depression. **Bipolar I** is genetically closer to schizophrenia; **bipolar II** is closer to major depression.
- Risk genes point to synapses, ion channels and calcium signalling (for example **CACNA1C**, a calcium channel gene).
- Polygenic scores are useful in research but far too weak to diagnose or predict for an individual.

:::widget layers
{"title": "What the genetics of bipolar disorder can and cannot tell you", "shape": "stack", "layers": [{"label": "Twin heritability", "detail": "About 60 to 85 percent: the highest of the common mood disorders."}, {"label": "GWAS loci", "detail": "298 risk regions in the largest study, including calcium channel genes such as CACNA1C."}, {"label": "Genetic overlap", "detail": "Bipolar I sits closer to schizophrenia; bipolar II closer to major depression."}, {"label": "Polygenic scores", "detail": "Useful in research; a higher schizophrenia or depression score predicts poorer lithium response in groups."}, {"label": "One patient", "detail": "No gene test can diagnose bipolar disorder or pick the right medicine yet."}], "caption": "From the population down to the person, predictive power falls at every step."}
:::

### Predicting lithium response
- Clinical predictors of a good lithium response: **classic euphoric mania**, full recovery between episodes, an episode pattern of mania then depression then a well interval, **family history of bipolar disorder (especially of lithium response)**, later onset, no rapid cycling, no substance misuse.
- Genetic studies (international lithium consortia) have found a few loci, and show that a **higher polygenic score for schizophrenia or depression predicts poorer lithium response**. Not yet useful clinically.

### Pharmacogenomics in bipolar disorder
| Gene | Drug | Point |
|---|---|---|
| **HLA-B*15:02** | Carbamazepine (and oxcarbazepine, phenytoin) | Strong link to Stevens-Johnson syndrome and toxic epidermal necrolysis; carried by about 2 to 4% of Indians on average, higher in some groups. Test before starting where available, or choose another drug |
| HLA-A*31:01 | Carbamazepine | Linked to a range of drug reactions, mainly studied in European and Japanese people |
| **POLG** | Valproate | Mitochondrial disease mutations: valproate can cause fatal liver failure; avoid |
| CYP2D6 | Aripiprazole, risperidone | Poor metabolisers need lower doses |

:::widget decide
{"scene": "A 30-year-old man from Kolkata with bipolar I has not responded to lithium or valproate. The team considers carbamazepine. HLA testing is available at a city lab for a moderate cost, with results in a few days.", "ask": "What do you do?", "choices": [{"label": "Start carbamazepine straight away; the rash is rare", "verdict": "ok", "outcome": "He is fine, but if he had carried HLA-B*15:02 he would have faced a high risk of a life-threatening skin reaction.", "why": "The reaction is rare overall but strongly linked to a gene that is present in a meaningful share of South Asians. Where testing is available, it is recommended before starting."}, {"label": "Test for HLA-B*15:02 first, explain why, and use a different option if positive", "verdict": "best", "outcome": "He is negative. Carbamazepine is started with monitoring of blood count, sodium and liver tests, and a warning about rash.", "why": "Targeted genetic testing prevents a rare but devastating reaction."}, {"label": "Never use carbamazepine in Indian patients", "verdict": "harm", "outcome": "A useful option is removed for the large majority who do not carry the allele.", "why": "Testing, not blanket avoidance, is the evidence-based approach."}]}
:::

:::widget flow
{"title": "Before carbamazepine: the HLA decision", "layout": "tree", "nodes": [{"id": "r", "label": "Carbamazepine is being considered", "detail": "Usually after lithium and valproate have not worked or are unsuitable."}, {"id": "a", "parent": "r", "label": "South or East Asian ancestry, including Indian?", "detail": "Test for HLA-B*15:02 where available."}, {"id": "p", "parent": "a", "label": "Positive", "detail": "High risk of Stevens-Johnson syndrome or toxic epidermal necrolysis. Choose another drug, and avoid oxcarbazepine and phenytoin too."}, {"id": "n", "parent": "a", "label": "Negative", "detail": "Start with monitoring: blood count, sodium, liver tests; warn about rash; check interactions (it induces CYP3A4)."}, {"id": "m", "parent": "r", "label": "Suspected mitochondrial disease?", "detail": "Not for carbamazepine, but before valproate: test POLG, because valproate can cause fatal liver failure."}], "caption": "Targeted testing, not blanket avoidance, is the evidence-based approach."}
:::

:::recall
1. How many risk regions did the 2025 bipolar GWAS find? || 298.
2. Which bipolar type is genetically closer to schizophrenia? || Bipolar I.
3. Give four clinical predictors of a good lithium response. || Classic euphoric mania, full inter-episode recovery, mania-depression-interval pattern, family history of lithium response, no rapid cycling or substance misuse.
4. Why test POLG before valproate in suspected mitochondrial disease? || Valproate can cause fatal liver failure.
:::

:::mcq
Q: Before starting carbamazepine in a patient of Indian ancestry, which test is recommended where available?
- CYP2D6 genotype
- *HLA-B*15:02
- APOE4
- POLG
> Linked to Stevens-Johnson syndrome.
:::

## 5.3 Metabolism, inflammation and GLP-1 medicines [core][advanced]
### The metabolic burden
- People with bipolar disorder have higher rates of obesity, type 2 diabetes and heart disease, and die years earlier on average. Causes include the illness itself, lifestyle, poor access to physical care, and medicines (especially olanzapine, quetiapine and valproate).
- **Metformin** has good evidence for reducing antipsychotic-related weight gain.

:::widget flow
{"title": "The metabolic spiral", "layout": "cycle", "nodes": [{"id": "a", "label": "Medicines that raise appetite", "detail": "Olanzapine, quetiapine and valproate, through H1 and 5HT2C block and other routes."}, {"id": "b", "label": "Weight gain", "detail": "Often rapid in the first months."}, {"id": "c", "label": "Insulin resistance and inflammation", "detail": "Raised glucose, lipids and inflammatory markers."}, {"id": "d", "label": "Low energy and mood", "detail": "Tiredness and low self-esteem; less activity; risk of stopping medicines."}, {"id": "e", "label": "Less movement, more weight", "detail": "The loop tightens, and heart risk climbs."}], "caption": "Break it early: choose medicines with care, monitor weight from the start, encourage activity, and consider metformin when weight rises."}
:::

### GLP-1 receptor agonists
- Trials of liraglutide, exenatide and semaglutide in people on antipsychotics (mostly with schizophrenia, some with bipolar disorder) show meaningful weight loss.
- **Effects on mood are uncertain.** Regulators in the US and EU (2024 reviews) found no evidence that these drugs cause suicidal thoughts. Observational data in people with mood disorders are mixed. There are no adequate trials of GLP-1 agonists as mood treatments.
- Practical stance: they can be considered for weight and diabetes under medical care; monitor mood, appetite, hydration (vomiting and dehydration can raise lithium levels) and nutrition.

### Inflammation
- Inflammatory markers (CRP, IL-6, TNF-alpha) are raised in mania and in bipolar depression, and partly normalise between episodes.
- Add-on anti-inflammatory trials (celecoxib, N-acetylcysteine, minocycline, aspirin, omega-3) are **mixed**.
- A trial of the anti-TNF drug infliximab in bipolar depression showed no benefit overall, but a possible benefit in those with childhood trauma, pointing again to subgroups.

:::widget sort
{"prompt": "Evidence status in bipolar disorder, late 2026: place each treatment.", "buckets": ["Established", "Promising but limited", "Uncertain or avoid"], "items": [{"text": "Lithium for relapse and suicide prevention", "bucket": 0}, {"text": "Quetiapine for bipolar depression", "bucket": 0}, {"text": "Intravenous ketamine for bipolar depression", "bucket": 1, "why": "Small trials, short follow-up."}, {"text": "Midday bright light therapy for bipolar depression", "bucket": 1}, {"text": "Semaglutide as a mood treatment", "bucket": 2}, {"text": "Psilocybin in bipolar I", "bucket": 2, "why": "Excluded from trials; risk of mania and, with lithium, seizures."}, {"text": "Metformin for antipsychotic weight gain", "bucket": 0}, {"text": "Infliximab for all bipolar depression", "bucket": 2}]}
:::

:::recall
1. Which medicine has good evidence for antipsychotic-related weight gain? || Metformin.
2. What did 2024 US and EU reviews conclude about GLP-1 drugs and suicidality? || No evidence of a causal link.
3. Why watch lithium levels on a GLP-1 agonist? || Vomiting and dehydration can raise lithium levels.
4. What did the infliximab trial in bipolar depression find? || No overall benefit; possible benefit with childhood trauma.
:::

:::mcq
Q: A woman with bipolar disorder on lithium starts semaglutide and has repeated vomiting. The specific risk to check is:
- Hypothyroidism
- *Lithium toxicity from dehydration
- Serotonin syndrome
- Tardive dyskinesia
> Fluid loss raises lithium levels.
:::

## 5.4 Beyond DSM: frameworks, computation and ICD-11 [core][advanced]
### RDoC and HiTOP
- **RDoC** looks at bipolar disorder through functions: **positive valence** (reward hypersensitivity, goal drive), **arousal and regulatory systems** (sleep and circadian rhythm), and **cognitive control** (impulsivity, attention).
- **HiTOP** struggles to place mania neatly. In statistical models, manic symptoms load partly with the **thought disorder** spectrum (closer to psychosis), while bipolar depressions load with **internalising**. This fits the genetics: bipolar I near schizophrenia, bipolar II near depression.

### Computational and digital psychiatry
- **Computational models**: people with bipolar disorder may update expectations too strongly after reward (high learning rates), so a few good events can snowball into a high.
- **Digital phenotyping**: smartphone data (activity, sleep, call and text patterns, typing speed, voice features) can detect early signs of mania or depression in research studies. Accuracy varies between people, and privacy and consent are real concerns.
- **Mood forecasting**: models trained on daily mood ratings try to predict the next episode. Promising in research, not yet reliable for individual decisions.

:::widget curve
{"kind": "sdt", "title": "Digital alerts for early mania: hits versus false alarms", "caption": "Imagine a phone app that warns of a coming high from sleep, activity and typing speed. A sensitive setting catches most early relapses but sends many false alarms, which people learn to ignore. A strict setting is quieter but misses relapses. Every digital phenotyping tool has to choose a point on this trade-off, ideally with the patient."}
:::

### ICD-11 says
| Topic | DSM-5-TR | ICD-11 |
|---|---|---|
| Mixed states | A "with mixed features" specifier | A separate **mixed episode** type |
| Core of mania | Elevated or irritable mood **and** increased activity or energy | Mood change **with** increased activity or a subjective sense of increased energy |
| Hypomania duration | At least 4 consecutive days | "At least several days" |
| Number of episodes for bipolar I | One manic episode | One manic or mixed episode (ICD-10 needed two episodes) |
| Cyclothymia | At least 2 years | At least 2 years |
| Qualifiers | Anxious distress specifier | "With prominent anxiety symptoms" and "with panic attacks" qualifiers |

:::widget reveal
{"prompt": "A patient's notes from ten years ago, written under ICD-10, say 'single manic episode' rather than 'bipolar affective disorder'. Under ICD-11 or DSM-5-TR today, what would you call it, and why?", "answer": "Bipolar I disorder (bipolar type I in ICD-11). ICD-10 required at least two episodes before using the bipolar label, so a single manic episode was coded separately. Both current systems accept one manic episode as enough, because nearly everyone who has one goes on to have more."}
:::

:::recall
1. Which RDoC domains matter most in bipolar disorder? || Positive valence, arousal and regulatory (circadian), cognitive control.
2. Where does mania load in HiTOP models? || Partly with the thought disorder spectrum.
3. Give three ICD-11 differences from DSM-5-TR for bipolar disorders. || Mixed episode as a type; "several days" for hypomania; subjective energy allowed; anxiety qualifiers.
4. What is digital phenotyping? || Using smartphone and sensor data to detect mood changes.
:::

:::mcq
Q: Which statement about ICD-11 is TRUE?
- It removes bipolar II disorder
- *It keeps a separate mixed episode type
- It requires two manic episodes for bipolar I
- It has no cyclothymia
> DSM-5-TR uses a specifier instead.
:::

# Part VI · Exam zone

## 6.1 Long answer and short notes [core]
:::example Q. Describe the clinical features and management of a manic episode. (15 marks)
1. Definition and criteria (A, B with DIGFAST, C, D), including the irritable-mood rule and antidepressant-emergent mania.
2. Clinical features under MSE headings: appearance, behaviour, speech, mood and affect, thought form and content, perception, cognition, insight, judgement.
3. Stages of mania.
4. Mania versus hypomania table; bipolar I vs II vs cyclothymia; mixed features and rapid cycling.
5. Aetiology: genetics, dopamine, circadian rhythm, kindling, triggers.
6. Differential diagnosis with distinguishing points.
7. Investigations: thyroid, drug screen, kidney function and calcium before lithium, ECG, imaging in late onset.
8. Management: acute (safety, stop antidepressants, antipsychotic, lithium or valproate, benzodiazepine, ECT); maintenance (lithium and monitoring); psychoeducation, sleep, family, relapse signature; MHCA 2017 provisions.
9. Course, prognosis, suicide risk, physical health. Add one ICD-11 difference for extra credit.
:::

:::word Short note: hypomania
A distinct period of at least four consecutive days of abnormally elevated, expansive or irritable mood with increased activity or energy and at least three manic symptoms (four if only irritable), an observable change that is not severe enough to cause marked impairment or admission and has no psychotic features. With at least one major depressive episode and no mania, it defines bipolar II. It is often experienced as productivity and goes unreported, so ask families directly and use the HCL-32.
:::

:::word Short note: lithium monitoring
Baseline eGFR, urea and electrolytes, thyroid function, calcium, weight, ECG where indicated and a pregnancy test. Levels 12 hours after the last dose, about five to seven days after each change; maintenance usually 0.6 to 0.8 mmol/L (up to 1.0), acute mania 0.8 to 1.0, lower in older adults. Levels every three months in the first year, then about every six months when stable; kidney, thyroid and calcium every six months. Toxicity (reliably above 1.5 mmol/L) causes coarse tremor, vomiting, diarrhoea, ataxia and confusion; levels rise with dehydration, NSAIDs, ACE inhibitors and thiazides. Stop gradually to avoid rebound mania.
:::

:::word Short note: mixed features
A specifier for a manic or hypomanic episode with at least three depressive symptoms on most days, or a depressive episode with at least three manic or hypomanic symptoms. Mixed states carry high suicide risk, respond poorly to antidepressants (which should be avoided or stopped) and often to lithium; valproate and some antipsychotics are preferred. ICD-11 instead codes a separate mixed episode.
:::

## 6.2 Viva rapid-fire [core]
:::viva
Minimum duration of a manic episode? :: Seven days, or any duration if admitted.
Minimum duration of hypomania? :: Four consecutive days.
How many manic symptoms are needed? :: Three, or four if mood is only irritable.
Expand DIGFAST. :: Distractibility, insomnia (less need for sleep), grandiosity, flight of ideas, activity, speech pressure, thoughtlessness.
What turns hypomania into mania? :: Marked impairment, admission or psychotic features.
Define bipolar II. :: At least one hypomanic and one major depressive episode, never mania.
Define cyclothymia. :: Two years of sub-threshold highs and lows, never full episodes.
Define rapid cycling. :: Four or more episodes in 12 months.
Why are mixed states dangerous? :: High suicide risk.
How long does untreated mania last? :: About three months.
First step in managing mania on an antidepressant? :: Stop the antidepressant.
Gold standard maintenance treatment? :: Lithium.
Mood stabiliser to avoid in women who may become pregnant? :: Valproate.
Drug that mainly prevents bipolar depression? :: Lamotrigine.
Usual lamotrigine target, and how is it reached? :: 200 mg a day, by the slow climb you guessed in 3.4.
How does valproate change lamotrigine dosing? :: Halve the lamotrigine schedule.
Lithium maintenance level? :: About 0.6 to 0.8 mmol/L, 12 hours after the last dose.
Three drugs that raise lithium levels? :: NSAIDs, ACE inhibitors, thiazides.
Sign that separates lithium toxicity from the usual tremor? :: Coarse tremor with vomiting, diarrhoea, ataxia or confusion.
What happens if lithium is stopped abruptly? :: Rebound mania.
Two enzymes lithium inhibits? :: Inositol monophosphatase and GSK-3.
Why does lithium cause polyuria? :: Nephrogenic diabetes insipidus.
Which mood disorder is most heritable? :: Bipolar disorder.
Risk for a first-degree relative? :: About 5 to 10%.
First-onset mania at 60: what must you exclude? :: A medical or neurological cause.
Why is bipolar II often missed? :: Hypomania feels good and is rarely reported.
Strongest clue to bipolarity in a depressed patient? :: Family history of bipolar disorder.
Screening questionnaire for hypomania? :: HCL-32 (or MDQ).
Scale for severity of current mania? :: YMRS.
Highest-risk time for relapse in women? :: After childbirth.
Best-evidence treatment for acute bipolar depression? :: Quetiapine (also lurasidone, olanzapine-fluoxetine).
Quetiapine's antidepressant metabolite? :: Norquetiapine, a NET inhibitor.
Gene to test before carbamazepine in Indians? :: HLA-B*15:02.
Medicine for antipsychotic weight gain with good evidence? :: Metformin.
Which psychedelic combination may cause seizures? :: Lithium with classic psychedelics.
How many risk regions in the 2025 bipolar GWAS? :: 298.
ICD-11 handling of mixed states? :: A separate mixed episode.
Two MHCA tools set up when well? :: Nominated representative and advance directive.
Personal early warning signs with actions? :: A relapse signature.
:::

## 6.3 Module test [core]
Answer every question before checking. Your best score is saved.

:::mcq
Q: A man has had elevated mood, little need for sleep, pressured speech and reckless spending for 5 days, and was admitted because of aggression. The episode is:
- Hypomanic, because it lasted less than the mania minimum
- *Manic, because admission was needed
- Cyclothymic
- Mixed
> Any duration counts if admission is required.

Q: A woman reports two depressive episodes and a 5-day period of high energy noticed by colleagues, without impairment. Diagnosis:
- Bipolar I
- *Bipolar II
- Cyclothymic disorder
- Major depressive disorder, recurrent
> Hypomania plus major depression, never mania.

Q: If a patient's mood is only irritable, how many additional manic symptoms are required?
- Two
- Three
- *Four
- Five
> Four instead of three.

Q: Which feature makes an episode mania rather than hypomania regardless of duration?
- Decreased need for sleep
- Overspending
- *Psychotic features
- Flight of ideas
> Psychosis always means mania.

Q: Racing thoughts and no sleep, alongside hopelessness and wanting to die, within the same days of one episode, is:
- Rapid cycling
- *Mixed features
- Cyclothymia
- Hypomania
> High suicide risk; avoid antidepressants.

Q: Four or more mood episodes in a year is called:
- Cyclothymia
- Mixed features
- *Rapid cycling
- Ultradian cycling
> Associated with hypothyroidism, women, bipolar II and antidepressants.

Q: The best way to find past hypomania in a depressed patient is to:
- Wait for a manic episode
- *Ask about specific periods of less sleep and more energy, and ask family
- Use a brain scan
- Ask only "Have you been manic?"
> Collateral history matters.

Q: The first step for a patient who becomes manic on sertraline is:
- Increase the sertraline
- Add a second antidepressant
- *Stop the sertraline and start an antimanic medicine
- Wait and watch
> Remove the trigger and treat the mania.

Q: Which maintenance treatment has the best evidence for reducing suicide in bipolar disorder?
- Valproate
- Lamotrigine
- *Lithium
- Clonazepam
> Lithium's anti-suicidal effect is well established.

Q: A woman of 24 with bipolar I is planning a family. Which mood stabiliser should usually be avoided?
- Lithium
- *Valproate
- Quetiapine
- Lamotrigine
> High risk of birth defects and developmental problems.

Q: A patient on lithium develops diarrhoea, vomiting, coarse tremor and unsteadiness after starting ibuprofen. Most likely:
- Lithium-induced hypothyroidism
- *Lithium toxicity
- Neuroleptic malignant syndrome
- Serotonin syndrome
> NSAIDs raise lithium levels.

Q: Lithium levels should be measured:
- *12 hours after the last dose
- 1 hour after the dose
- Only once a year
- At any time of day
> About 5 to 7 days after starting or changing the dose.

Q: The usual maintenance lithium level for most adults is about:
- 0.1 to 0.3 mmol/L
- *0.6 to 0.8 mmol/L
- 1.5 to 2.0 mmol/L
- 2.5 to 3.0 mmol/L
> Up to 1.0 if relapse occurs at lower levels.

Q: Which drug is used mainly to prevent depressive relapses in bipolar disorder?
- Haloperidol
- *Lamotrigine
- Lorazepam
- Fluoxetine alone
> Lamotrigine prevents depression more than mania.

Q: When valproate is added to lamotrigine, the lamotrigine dose should be:
- Doubled
- *Roughly halved
- Unchanged
- Stopped
> Valproate inhibits lamotrigine breakdown, roughly doubling levels.

Q: Mood swings lasting hours, triggered by arguments, with chronic emptiness and fear of abandonment suggest:
- Bipolar I disorder
- Rapid cycling
- *Borderline personality disorder
- Cyclothymia
> Short, reactive shifts point to personality rather than episodes.

Q: A 62-year-old with no psychiatric history develops mania. What is most important?
- Start lithium at once
- *Look for a medical or neurological cause
- Diagnose bipolar I and discharge
- Prescribe an antidepressant
> Late-onset mania needs a medical work-up.

Q: Three days after delivery, a woman is confused, sleepless and believes her baby is evil. Best action:
- Reassure: baby blues
- *Same-day psychiatric care for possible postpartum psychosis
- Outpatient SSRI
- Review next month
> A psychiatric emergency.

Q: For acute bipolar depression, which option has the best evidence?
- Fluoxetine alone
- *Quetiapine
- Haloperidol
- Alprazolam
> Antidepressants alone are risky.

Q: Lithium's polyuria is caused by:
- High blood glucose
- *Blocking the kidney's response to antidiuretic hormone
- Low calcium
- Excess thyroid hormone
> Nephrogenic diabetes insipidus.

Q: Which enzyme is inhibited by lithium?
- MAO-A
- *GSK-3
- CYP3A4
- Acetylcholinesterase
> Also inositol monophosphatase.

Q: Before carbamazepine in a patient of Indian ancestry, test for:
- CYP2D6
- *HLA-B*15:02
- APOE4
- MTHFR
> Linked to Stevens-Johnson syndrome.

Q: Which is TRUE about the genetics of bipolar disorder?
- One gene causes it
- *Hundreds of risk regions; bipolar I is genetically closer to schizophrenia
- Identical twins always share it
- Genes play no role
> The 2025 GWAS found 298 regions.

Q: A man with bipolar I on lithium wants to try psilocybin. A specific risk is:
- Weight gain
- *Mania or psychosis, and possible seizures with lithium
- Low sodium
- Hair loss
> People with bipolar I are excluded from trials.

Q: Which statement about GLP-1 agonists in bipolar disorder is best supported?
- They are mood stabilisers
- They clearly cause mania
- *They help weight; mood effects are uncertain; vomiting can raise lithium levels
- They replace lithium
> Monitor mood and hydration.

Q: In ICD-11, mixed states are coded as:
- A specifier only
- *A separate mixed episode
- Rapid cycling
- Not recognised
> DSM-5-TR uses "with mixed features".

Q: A 9-year-old has been restless, distractible and impulsive since age 3, without euphoria or episodes. Most likely:
- Bipolar I disorder
- *ADHD
- Cyclothymia
- Schizoaffective disorder
> ADHD is continuous, not episodic.

Q: A family wants a stable patient to stop lithium suddenly. The main risk is:
- Weight gain
- *Rebound mania
- Hypothyroidism
- Kidney failure
> Taper slowly if stopping, over months.
:::
` + qaBank;
