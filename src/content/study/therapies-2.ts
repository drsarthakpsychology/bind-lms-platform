/* Module · Psychotherapies and counselling, Parts III and IV (Advanced level and exam zone). Original text written for VIBHA School of Psychology. */
export const part2 = String.raw`
# Part III · Advanced: third-wave, group and expressive therapies, and the evidence

## 3.1 Dialectical behaviour therapy (DBT) [core][advanced]
Marsha Linehan developed DBT for women with **borderline personality disorder** and **chronic suicidal behaviour**, people for whom standard CBT often failed because change-focused work felt invalidating and led to drop-out.

### The biosocial theory
Severe emotion dysregulation arises from a **transaction** between:
- **Biological emotional vulnerability**: high sensitivity (reacts quickly), high reactivity (reacts strongly) and slow return to baseline.
- An **invalidating environment**: a family or setting that dismisses, punishes or oversimplifies the child's emotional experience ("Stop crying, it's nothing").

Over time the person never learns to trust, label or regulate their emotions, and swings between emotional inhibition and extreme displays, including self-harm, which brings rapid relief.


:::widget flow
{
 "title": "The biosocial transaction",
 "layout": "cycle",
 "nodes": [
  {
   "id": "v",
   "label": "Emotional vulnerability",
   "detail": "High sensitivity, high reactivity, slow return to baseline."
  },
  {
   "id": "i",
   "label": "Invalidating response",
   "detail": "\"Stop crying, it's nothing.\""
  },
  {
   "id": "e",
   "label": "Escalation or suppression",
   "detail": "Emotions are hidden, then explode."
  },
  {
   "id": "r",
   "label": "Intermittent reinforcement",
   "detail": "Only extreme displays get a response, so they become more likely."
  }
 ],
 "caption": "Linehan's theory is a loop between child and environment, not blame of either."
}
:::

### Dialectics: acceptance **and** change
The central dialectic is that the therapist **fully accepts** the person as they are **and** pushes for **change**. Both are true at once: "You are doing the best you can, **and** you need to do better, try harder and be more motivated to change."

### The four skills modules
| Module | Purpose | Examples |
|---|---|---|
| **Mindfulness** (core) | Observe and describe experience without judgement; access "wise mind" (balance of emotion mind and reasonable mind) | "What" skills: observe, describe, participate. "How" skills: non-judgementally, one-mindfully, effectively |
| **Distress tolerance** | Survive crises without making them worse | **TIPP** (temperature change with cold water, intense exercise, paced breathing, paired muscle relaxation); distraction (ACCEPTS); self-soothing; radical acceptance |
| **Emotion regulation** | Understand and change emotions | Naming emotions; checking the facts; **opposite action**; reducing vulnerability (**PLEASE**: treat physical illness, balanced eating, avoid mood-altering drugs, balanced sleep, exercise); building positive experiences |
| **Interpersonal effectiveness** | Ask for what you need and say no while keeping relationships and self-respect | **DEAR MAN** (describe, express, assert, reinforce; stay mindful, appear confident, negotiate), **GIVE** (gentle, interested, validate, easy manner), **FAST** (fair, no apologies, stick to values, truthful) |


:::widget layers
{
 "title": "DBT's target hierarchy",
 "shape": "pyramid",
 "layers": [
  {
   "label": "Life-threatening behaviour",
   "detail": "Suicidal and self-harm behaviour: always first."
  },
  {
   "label": "Therapy-interfering behaviour",
   "detail": "Missing sessions, not doing diary cards, and therapist behaviours too."
  },
  {
   "label": "Quality-of-life-interfering behaviour",
   "detail": "Substance use, unstable housing, lost jobs."
  },
  {
   "label": "Skills building",
   "detail": "Using the four modules in daily life."
  }
 ],
 "caption": "The diary card tells the therapist which level the session must start with."
}
:::

### The structure of standard DBT
1. **Individual therapy** (weekly): working on target behaviours with a **diary card** and **chain analysis**.
2. **Skills group** (weekly): teaching the four modules.
3. **Phone coaching** between sessions: brief help to use skills in the moment.
4. **Therapist consultation team**: therapists meet weekly to support each other and stay effective.

**Target hierarchy** in individual sessions: (1) life-threatening behaviours, (2) therapy-interfering behaviours, (3) quality-of-life-interfering behaviours, (4) skills building.

:::widget worked
{
  "title": "A chain analysis of self-harm",
  "steps": [
    { "q": "Priyanka, 22, in Bengaluru, cut her arm on Saturday night. Start with the vulnerability factors.", "a": "She had slept four hours, skipped meals, and had argued with her sister in the morning." },
    { "q": "What was the prompting event?", "a": "At 9 pm her boyfriend did not reply to her messages for two hours." },
    { "q": "Trace the links in the chain: thoughts, emotions, body sensations, actions.", "a": "Thought: 'He's leaving me; nobody stays.' Emotion: panic, then shame (90 out of 100). Body: tight chest, shaking. Action: checked his online status twenty times. Thought: 'I can't bear this.' Urge to cut (95). Went to the bathroom and cut." },
    { "q": "What were the consequences, short and long term?", "a": "Short term: relief within minutes, numbness (this reinforces cutting). Long term: shame, hiding her arm, the boyfriend upset when he found out, missing work." },
    { "q": "Find solutions at each link.", "a": "Vulnerability: PLEASE skills (sleep, eating). Prompting event: check the facts ('he is at his cousin's wedding'). Emotion: TIPP with cold water on her face to bring arousal down. Urge: distract (ACCEPTS), call her phone coach. Relationship: use DEAR MAN later to ask for reassurance in a way that works." }
  ],
  "yourTurn": [
    { "q": "Name the four modes of standard DBT and why the consultation team matters.", "a": "Individual therapy, skills group, phone coaching, consultation team. The team keeps therapists motivated, skilled and balanced (acceptance and change), and prevents burnout and therapist behaviours that interfere with therapy." }
  ]
}
:::

:::widget decide
{
  "scene": "At 11 pm, a DBT client in Hyderabad calls her phone coach: 'I want to cut. My mother screamed at me again.' She has not cut yet.",
  "ask": "What is the best coaching response?",
  "choices": [
    { "label": "Start a long exploration of her childhood relationship with her mother", "verdict": "harm", "outcome": "The call lasts an hour; she cuts afterwards anyway, and the coach is exhausted.", "why": "Phone coaching is brief and skills-focused, for the moment of crisis, not therapy by phone." },
    { "label": "Validate briefly, then coach a specific skill: 'That sounds really painful. Your urge is high. Can you get cold water on your face now and do paced breathing with me? Then which distraction from your list can you start?'", "verdict": "best", "outcome": "Her urge falls from 90 to 50 in ten minutes; she watches a show and texts her friend. She brings the event to her next individual session.", "why": "Validation plus a concrete distress tolerance skill in the moment is the purpose of coaching." },
    { "label": "Tell her she must go to the emergency department immediately", "verdict": "ok", "outcome": "She feels misunderstood and hangs up.", "why": "Emergency care is right if life is at immediate risk, but here she has called to use skills before acting." }
  ]
}
:::

:::clinician
Evidence: in Linehan's 2006 trial, DBT halved suicide attempts compared with treatment by community experts, with fewer emergency visits and hospital days. DBT for adolescents (DBT-A, with parents in the skills group) reduced self-harm in two randomised trials. Systematic reviews of psychotherapies for borderline personality disorder find DBT and mentalisation-based treatment have the most robust evidence for reducing self-harm, though effect sizes are moderate and certainty of evidence is low to moderate. Skills-only DBT groups have evidence for emotion dysregulation across diagnoses, including in college counselling settings. Key techniques beyond skills: validation at six levels (from staying awake and listening to radical genuineness), irreverent and reciprocal communication styles, and commitment strategies (devil's advocate, foot in the door). In India, DBT-informed skills groups are used in several centres; full adherent programmes with phone coaching and consultation teams are rare because of staff costs. Adaptations simplify language, involve families and use local examples.
:::

:::recall
1. What are the two parts of Linehan's biosocial theory? || Biological emotional vulnerability (sensitivity, reactivity, slow return to baseline) and an invalidating environment.
2. Name the four DBT skills modules. || Mindfulness, distress tolerance, emotion regulation, interpersonal effectiveness.
3. Name the four modes of standard DBT. || Individual therapy, skills group, phone coaching, therapist consultation team.
4. What is the DBT target hierarchy? || Life-threatening behaviours, therapy-interfering behaviours, quality-of-life-interfering behaviours, skills building.
5. What does DEAR MAN teach? || How to ask for something effectively: describe, express, assert, reinforce; stay mindful, appear confident, negotiate.
:::

:::mcq
Q: Splashing cold water on the face to bring down overwhelming emotion is part of which DBT skill?
- DEAR MAN
- *TIPP (distress tolerance)
- Opposite action
- Wise mind
> Temperature change reduces arousal fast.

Q: The central dialectic in DBT is between:
- Past and present
- *Acceptance and change
- Thought and feeling
- Therapist and team
> Validation balanced with change.

Q: A chain analysis is used to:
- Measure IQ
- *Understand in detail the links leading to a target behaviour and find points for change
- Draw a family tree
- Diagnose BPD
> A core DBT tool.
:::

## 3.2 Acceptance and commitment therapy (ACT) [core][advanced]
Steven Hayes developed ACT from **relational frame theory**, a behavioural account of how human language lets us link anything to anything, so that a thought about a past failure can bring the pain of that failure into the present. ACT does not try to remove difficult thoughts and feelings. It aims for **psychological flexibility**: being present, open to experience, and doing what matters.

### The six core processes (the "hexaflex")
| Process | The opposite (inflexibility) | In plain words |
|---|---|---|
| **Acceptance** | Experiential avoidance | Making room for painful feelings instead of fighting them |
| **Cognitive defusion** | Fusion with thoughts | Seeing thoughts as thoughts, not as facts or orders |
| **Contact with the present moment** | Living in the past or future | Paying attention to now |
| **Self-as-context** (the observing self) | Attachment to the conceptualised self ("I am a failure") | Noticing that you are the one who has thoughts, not the thoughts |
| **Values** | Unclear values, living by rules or others' expectations | Knowing what really matters to you |
| **Committed action** | Inaction, impulsivity, avoidance | Taking steps guided by values, even with discomfort |

:::mnemonic ACT in three words: "Open up, be present, do what matters"
**Open up** (acceptance, defusion), **be present** (present moment, self-as-context), **do what matters** (values, committed action).
:::


:::widget flow
{
 "title": "The ACT hexaflex",
 "layout": "cycle",
 "nodes": [
  {
   "id": "a",
   "label": "Acceptance"
  },
  {
   "id": "d",
   "label": "Defusion"
  },
  {
   "id": "p",
   "label": "Present moment"
  },
  {
   "id": "s",
   "label": "Self-as-context"
  },
  {
   "id": "v",
   "label": "Values"
  },
  {
   "id": "c",
   "label": "Committed action"
  }
 ],
 "caption": "The six processes all point to one centre: psychological flexibility. Tap each and name its opposite."
}
:::

### Classic ACT techniques
- **Defusion**: "I'm having the thought that I'm a failure"; saying a word aloud repeatedly until it loses its meaning ("milk, milk, milk"); "leaves on a stream".
- **Metaphors**: the **passengers on the bus** (thoughts shout from the back seats, but you can keep driving towards your values); **tug-of-war with a monster** (drop the rope); **quicksand** (struggling makes you sink).
- **Values clarification**: "What do you want your life to stand for?"; "What would you like people to say about you at your eightieth birthday?"
- **Creative hopelessness**: gently exploring how attempts to control feelings have worked, opening space for a new approach.

:::widget worked
{
  "title": "An ACT session for chronic pain and low mood",
  "steps": [
    { "q": "Mr Fernandes, 50, in Mangaluru, has had back pain for six years. He has stopped going to church, gardening and visiting friends, waiting for the pain to go first. Start with creative hopelessness.", "a": "'What have you tried to get rid of the pain? How has that worked in the long run? And what has it cost you?' He lists many treatments and admits his life has shrunk while the pain stayed." },
    { "q": "Introduce acceptance with a metaphor.", "a": "Tug-of-war: 'It's like you've been pulling on a rope against a monster called Pain. What if you dropped the rope? The monster is still there, but your hands are free.'" },
    { "q": "Clarify values.", "a": "He values being a good grandfather and being part of his church community." },
    { "q": "Set a committed action.", "a": "This Sunday he will attend the first half of Mass with a cushion, and sit with his grandson for ten minutes in the garden, noticing the pain and still doing what matters." },
    { "q": "Add defusion for the thought 'I can't do anything with this pain'.", "a": "He practises: 'I'm noticing the thought that I can't do anything.' He rates how much it bosses him: less than before." }
  ],
  "yourTurn": [
    { "q": "A student says: 'I can't go to the class presentation until I stop feeling anxious.' Write an ACT response using the passengers-on-the-bus metaphor.", "a": "'Imagine you're driving a bus towards something you care about: finishing your degree. Anxiety is a loud passenger at the back shouting \"turn around!\" You don't have to throw him off, and you don't have to obey him. Can you keep driving, with him on board, to the presentation?'" }
  ]
}
:::

:::widget sort
{
  "prompt": "Which ACT process does each statement or exercise target?",
  "buckets": ["Acceptance", "Defusion", "Present moment", "Self-as-context", "Values", "Committed action"],
  "items": [
    { "text": "“I'm having the thought that nobody likes me.”", "bucket": 1 },
    { "text": "“What do you want your relationships to be about?”", "bucket": 4 },
    { "text": "Noticing five things you can see and four you can hear right now", "bucket": 2 },
    { "text": "“Let the sadness be there, like a guest in the room, without pushing it out.”", "bucket": 0 },
    { "text": "“Notice who is noticing your thoughts. That part of you was there when you were seven and is here now.”", "bucket": 3 },
    { "text": "“This week, call your brother once, even if it feels awkward.”", "bucket": 5 }
  ]
}
:::

:::clinician
ACT has a broad evidence base: meta-analyses show it is more effective than waiting list and treatment as usual across anxiety, depression, chronic pain, substance use and somatic health problems, and broadly comparable to established CBT, with strongest support in chronic pain (where it is guideline-recommended in several countries). Mediation studies support psychological flexibility as a mechanism. Critics point to many small trials, researcher allegiance and debates about whether ACT is distinct from CBT. The WHO's guided self-help course Self-Help Plus, based on ACT, reduced psychological distress and prevented mental disorders in refugee settlements in randomised trials, and an accompanying illustrated WHO stress-management guide is freely available in many languages, including Indian languages. Relational frame theory proposes that derived relational responding (for example mutual and combinatorial entailment) underlies language and cognition; its experimental basis is strong in basic research, but its clinical necessity for ACT is debated.
:::

:::recall
1. What is the goal of ACT? || Psychological flexibility: being present, open, and acting on values.
2. Name the six ACT processes. || Acceptance, defusion, present moment, self-as-context, values, committed action.
3. What is experiential avoidance? || Attempts to avoid or control unwanted inner experiences, even when this costs valued living.
4. What is the basic theory behind ACT? || Relational frame theory, a behavioural theory of language and cognition.
:::

:::mcq
Q: Saying "I'm having the thought that I'm useless" is an example of:
- Cognitive restructuring
- *Cognitive defusion
- Exposure
- Interpretation
> Distance from the thought, not disputing its content.

Q: The passengers-on-the-bus metaphor teaches that:
- Thoughts must be removed before acting
- *You can keep moving towards values while difficult thoughts and feelings come along
- The therapist drives the bus
- Anxiety is dangerous
> Willingness with action.
:::

## 3.3 Mindfulness-based cognitive therapy (MBCT) and related approaches [core][advanced]
### Where it came from
**Mindfulness-based stress reduction (MBSR)** was developed by Jon Kabat-Zinn as an eight-session group programme for people with chronic pain and stress, drawing on Buddhist meditation in a secular form. Zindel Segal, Mark Williams and John Teasdale combined MBSR with CBT to create **MBCT**, designed specifically to **prevent relapse in recurrent depression**.

### Why depression returns
Each episode of depression strengthens links between **low mood** and **negative thinking**. In someone who has recovered, a small dip in mood can reactivate the whole pattern of rumination ("Here it comes again; I'll never be well"), and spiral into a new episode. This is called **cognitive reactivity**.


:::widget flow
{
 "title": "How a small dip becomes a relapse",
 "layout": "chain",
 "nodes": [
  {
   "id": "d",
   "label": "A small mood dip",
   "detail": "Tiredness, a minor disappointment."
  },
  {
   "id": "r",
   "label": "Old patterns reactivated",
   "detail": "\"Here it comes again; I'll never be well.\""
  },
  {
   "id": "u",
   "label": "Rumination",
   "detail": "Trying to solve the mood by thinking about it."
  },
  {
   "id": "w",
   "label": "Withdrawal",
   "detail": "Less activity, less contact."
  },
  {
   "id": "e",
   "label": "A new episode",
   "detail": "The spiral completes."
  }
 ],
 "edgeLabels": {
  "d>r": "cognitive reactivity"
 },
 "caption": "MBCT aims at the second and third boxes: noticing thoughts as thoughts and stepping out of rumination."
}
:::

### What MBCT teaches
- **Decentring**: seeing thoughts as passing mental events ("thoughts are not facts").
- Moving from **doing mode** (constantly trying to fix and compare) to **being mode** (allowing and noticing).
- Recognising **early warning signs** of relapse and having an action plan.

### The structure
Eight group sessions of about two hours each, plus daily home practice, often with a day of practice in the middle.
| Session theme | Key practice |
|---|---|
| Awareness and automatic pilot | Raisin exercise; body scan |
| Living in our heads | Body scan; noticing thoughts |
| Gathering the scattered mind | Mindful movement; **three-minute breathing space** |
| Recognising aversion | Sitting meditation |
| Allowing and letting be | Working with difficulty |
| Thoughts are not facts | Alternative viewpoints |
| How can I best take care of myself? | Activity and mood; relapse signature |
| Maintaining and extending new learning | Planning ongoing practice |

:::widget guess
{
  "prompt": "MBCT works best for people with a history of several past depressive episodes. In large analyses, by roughly how much did MBCT reduce the risk of relapse over the following year or so, compared with usual care?",
  "min": 0,
  "max": 80,
  "unit": "per cent relative reduction",
  "answer": [25, 40],
  "reveal": "About a third less risk of relapse. The benefit is clearest in people with three or more past episodes and in those with more residual symptoms. For a person with just one past episode, the benefit is less clear.",
  "clinician": "Individual patient data meta-analysis of nine trials found a hazard ratio of about 0.69 for relapse over 60 weeks compared with no MBCT, and MBCT was comparable to maintenance antidepressants in head-to-head comparisons; those with higher baseline severity benefited more. A large trial comparing MBCT with support to taper antidepressants versus maintenance antidepressants found no significant difference in relapse. MBCT is recommended in NICE guidance for people currently well with a history of recurrent depression."
}
:::

### Related approaches
- **Compassion-focused therapy** (Paul Gilbert): for shame and self-criticism; balances threat, drive and soothing systems.
- **Mindful self-compassion**, **mindfulness-based relapse prevention** for substance use.
- **Yoga and meditation in Indian practice**: yoga has trial evidence as an **add-on** treatment for depression and for negative symptoms of schizophrenia (including trials at NIMHANS). It is not a replacement for evidence-based treatment of severe illness.

:::widget decide
{
  "scene": "Mrs Nair, 45, in Thiruvananthapuram, is in an active, severe depressive episode with suicidal thoughts. A relative suggests she join an eight-session mindfulness course instead of other treatment.",
  "ask": "What is the best advice?",
  "choices": [
    { "label": "Agree; mindfulness treats all depression", "verdict": "harm", "outcome": "She struggles with long meditations, feels worse alone with her thoughts, and her risk rises.", "why": "MBCT was designed for relapse prevention in people who are currently well; in severe acute depression, intensive meditation can increase distress." },
    { "label": "Treat the acute episode first (assessment of risk, antidepressant and or CBT or behavioural activation), and consider MBCT later, when she is well, to reduce the risk of relapse", "verdict": "best", "outcome": "She recovers over some months, then completes MBCT and has a relapse prevention plan.", "why": "Matching the therapy to the phase of illness is key." },
    { "label": "Advise against any mindfulness ever", "verdict": "ok", "outcome": "She misses a useful relapse prevention option later.", "why": "Mindfulness-based approaches have good evidence in the right phase and for the right person." }
  ]
}
:::

:::clinician
Mechanism research supports reductions in rumination and worry and increases in mindfulness and self-compassion as mediators of MBCT's effect. Adverse effects of meditation programmes (increased anxiety, re-experiencing trauma, depersonalisation) are under-reported but real; trauma-sensitive adaptations and screening are advised, and people with active psychosis, severe current depression or acute suicidality usually need other treatment first. In India, mindfulness and yoga-based interventions are widely offered, including through AYUSH services; distinguish trial-supported protocols from general wellness claims, and be cautious with claims about specific ragas, mantras or breathing techniques that have not been tested. Mindfulness-based programmes in schools have shown small or null effects in large trials, a reminder that popularity is not evidence.
:::

:::recall
1. What was MBCT designed for? || Preventing relapse in recurrent depression.
2. What is cognitive reactivity? || The tendency for small dips in mood to reactivate negative thinking patterns in people with past depression.
3. What is decentring? || Seeing thoughts as passing mental events rather than facts.
4. For whom is MBCT most clearly beneficial? || People with three or more past episodes of depression, currently well, especially with residual symptoms.
:::

:::mcq
Q: The "three-minute breathing space" is a practice from:
- DBT
- *MBCT
- IPT
- Psychodrama
> A brief MBCT practice.

Q: MBCT is LEAST suitable for:
- A woman in remission after three depressive episodes
- *A man in a severe acute depressive episode with active suicidal thoughts
- Someone with residual symptoms after recovery
- A person wanting to prevent relapse
> Treat the acute episode first.
:::

## 3.4 Group therapy and expressive therapies [core][advanced]
### Group therapy
Groups are not just a cheaper way to see many people. They offer things individual therapy cannot. **Irvin Yalom** described therapeutic factors:
| Factor | Meaning |
|---|---|
| **Instillation of hope** | Seeing others improve |
| **Universality** | "I'm not the only one" |
| **Imparting information** | Learning about the illness and coping |
| **Altruism** | Helping others raises self-worth |
| **Corrective recapitulation of the primary family group** | Re-living and changing old family patterns in the group |
| **Development of socialising techniques** | Learning social skills |
| **Imitative behaviour** | Learning by watching others |
| **Interpersonal learning** | Feedback about how one comes across |
| **Group cohesiveness** | Belonging and acceptance |
| **Catharsis** | Expressing strong feelings |
| **Existential factors** | Facing responsibility, mortality, isolation |

:::mnemonic Yalom's first five: "HUIAC"
**H**ope, **U**niversality, **I**nformation, **A**ltruism, **C**orrective family recapitulation.
:::

### Expressive (creative arts) therapies
These use creative activity as the main medium of therapy, especially useful when words are hard: for children, people with trauma, intellectual disability, dementia or severe mental illness.

| Therapy | What happens | Typical uses |
|---|---|---|
| **Art therapy** | Making images (drawing, painting, clay) and reflecting on them with a trained art therapist | Trauma, children, psychosis, palliative care |
| **Music therapy** | Listening, improvising, songwriting with a trained music therapist | Dementia (agitation, mood), schizophrenia (negative symptoms, social function), depression, autism (communication) |
| **Drama therapy** and **psychodrama** | Acting out situations; in psychodrama (J. L. Moreno) a **protagonist** enacts a scene with a **director** and **auxiliary egos**, using techniques like **role reversal**, **doubling** and the **empty chair** | Interpersonal problems, grief, trauma (with care) |
| **Dance movement therapy** | Movement as expression and integration of body and mind | Body image, trauma, depression |
| **Play therapy** | For children: play as the language for feelings; non-directive (child-centred, Virginia Axline) or directive; **filial therapy** trains parents | Childhood anxiety, trauma, behaviour problems, grief |
| **Sandplay** | Building scenes with miniature figures in a sand tray | Children and adults, especially trauma |
| **Bibliotherapy** | Structured reading (including self-help books) | Mild depression and anxiety (guided self-help) |

:::widget decide
{
  "scene": "Aisha, 7, in Srinagar, has been withdrawn and has nightmares since her family's home was damaged in a flood. She will not talk about it, but she plays intensely with toy houses and water in the clinic.",
  "ask": "Which approach fits best at first?",
  "choices": [
    { "label": "Insist she describes the flood in words in each session", "verdict": "harm", "outcome": "She cries, refuses to come back, and her nightmares increase.", "why": "Forcing verbal recall in a young child can overwhelm her and break trust." },
    { "label": "Use play-based therapy (and later trauma-focused CBT adapted for her age, with parents involved): let her express the experience through play, help her and her parents with safety, sleep routines and coping, and gradually build a story of what happened", "verdict": "best", "outcome": "Over several sessions her play shows the flood and rescue; with her mother she makes a picture story. Nightmares lessen.", "why": "Play is a child's natural language; combined with an evidence-based trauma approach and family support it is effective and safe." },
    { "label": "Wait; children forget", "verdict": "ok", "outcome": "Some children recover naturally, but her symptoms persist for months.", "why": "Watchful waiting is reasonable briefly, but persistent symptoms need help." }
  ]
}
:::

:::example Psychodrama in a Kolkata training group
Sunil, 34, cannot forgive his late father. In a psychodrama, he chooses a group member to play his father. Through **role reversal**, Sunil stands in his father's place and speaks as him: "I worked three jobs; I didn't know how to show you love." Returning to his own role, Sunil weeps and, for the first time, speaks to his father with sadness rather than rage. Such work needs a trained director and careful closure ("sharing") afterwards.
:::

:::clinician
Group CBT is as effective as individual CBT for depression and several anxiety disorders, with economies of scale. Yalom's factors have been studied with Q-sort methods; interpersonal learning, catharsis, cohesiveness and self-understanding are most often rated helpful by group members, varying by setting (inpatients value hope and universality). Evidence for creative arts therapies is mixed and generally of low to moderate certainty: music therapy has moderate evidence for improving global state, negative symptoms and social functioning in schizophrenia when given for sufficient sessions, and for reducing depressive symptoms and agitation in dementia; art therapy evidence in psychosis is inconsistent (a large UK trial of group art therapy found no benefit over usual care on primary outcomes); play therapy meta-analyses show moderate effects with wide heterogeneity. Critical incident stress debriefing (single-session group debriefing soon after trauma) does not prevent PTSD and may worsen outcomes for some, so it is not recommended; psychological first aid is preferred. Indian traditions of devotional singing (bhajan, kirtan) and community dance offer culturally resonant group experiences, but claims that particular ragas "cure" specific disorders lack controlled evidence.
:::

:::recall
1. Name five of Yalom's therapeutic factors. || Instillation of hope, universality, imparting information, altruism, corrective recapitulation (also socialising techniques, imitation, interpersonal learning, cohesiveness, catharsis, existential factors).
2. Who founded psychodrama, and name two techniques. || J. L. Moreno; role reversal, doubling (also empty chair, mirroring).
3. What is filial therapy? || Training parents to conduct child-centred play sessions with their own child.
4. Is single-session critical incident debriefing recommended after trauma? || No; it does not prevent PTSD and may harm some people.
:::

:::mcq
Q: "I thought I was the only one who felt this way" reflects which group factor?
- Altruism
- *Universality
- Catharsis
- Imitative behaviour
> Discovering shared experience.

Q: In psychodrama, the person whose story is enacted is the:
- Director
- Auxiliary ego
- *Protagonist
- Double
> The central figure.

Q: Music therapy has its best evidence for:
- Curing schizophrenia
- *Improving negative symptoms and social functioning in schizophrenia, and agitation in dementia, as an add-on
- Replacing medicine in mania
- Treating head injury
> An adjunct with moderate evidence.
:::

## 3.5 What works for whom: evidence, adaptation and delivery [core][advanced]
### The evidence at a glance
| Problem | Therapies with strong evidence | Notes |
|---|---|---|
| **Depression (mild to moderate)** | CBT, behavioural activation, IPT, problem-solving, guided self-help; short-term psychodynamic therapy | Similar effects; patient preference matters |
| **Depression (relapse prevention)** | MBCT, continuation CBT, maintenance IPT | Best for recurrent depression |
| **Panic disorder, social anxiety, specific phobia** | CBT with exposure | Large effects |
| **Generalised anxiety disorder** | CBT, applied relaxation | |
| **OCD** | CBT with ERP | Often combined with SSRIs |
| **PTSD** | Trauma-focused CBT, cognitive processing therapy, prolonged exposure, EMDR | Avoid single-session debriefing |
| **Insomnia** | CBT for insomnia (CBT-I) | First-line, ahead of sleeping tablets |
| **Eating disorders** | Family-based treatment (adolescent anorexia); enhanced CBT (bulimia, binge eating) | |
| **Borderline personality disorder, recurrent self-harm** | DBT, mentalisation-based treatment, schema therapy | |
| **Schizophrenia** | Family psychoeducation, CBT for psychosis (modest), social skills training, supported employment, cognitive remediation | Alongside medicine |
| **Bipolar disorder** | Psychoeducation, family-focused therapy, interpersonal and social rhythm therapy, CBT | Alongside mood stabilisers |
| **Alcohol and drug use** | MI, CBT, contingency management (stimulants), community reinforcement, family approaches | |
| **Chronic pain** | ACT, CBT | |
| **Child behaviour problems** | Parent management training | |

### Task-sharing: therapy delivered by trained non-specialists
India and other low- and middle-income countries have far too few psychologists. Trials have shown that trained and supervised **lay counsellors** can deliver effective brief therapies:
- **Healthy Activity Program** (behavioural activation for depression) in Goa primary care.
- **Counselling for Alcohol Problems** (MI-based) in Goa.
- **Thinking Healthy Programme** (CBT-based, for perinatal depression), delivered by community health workers in South Asia.
- **Problem Management Plus** (WHO, problem-solving plus stress management).


:::widget layers
{
 "title": "Stepped care",
 "shape": "pyramid",
 "layers": [
  {
   "label": "Specialist and intensive care",
   "detail": "Complex, severe or high-risk problems: specialist teams, inpatient care, DBT programmes."
  },
  {
   "label": "High-intensity therapy",
   "detail": "Individual CBT, IPT, family therapy by trained therapists, with or without medicine."
  },
  {
   "label": "Low-intensity help",
   "detail": "Guided self-help, group programmes, task-shared behavioural activation or problem-solving."
  },
  {
   "label": "Recognition and watchful waiting",
   "detail": "Primary care identification, psychoeducation, monitoring."
  }
 ],
 "caption": "Most people start near the base and step up if they do not improve. Risk can move someone straight to the top."
}
:::

### Cultural adaptation
Good adaptation changes the **packaging**, not the **active ingredients**:
- Use the client's language and idioms ("tension", "dimaag kharab", "mann nahi lagta").
- Involve family where the client wishes; decisions are often shared.
- Use local examples, stories, proverbs and, where helpful, religious coping.
- Accept a more directive therapist style where expected, while keeping collaboration.
- Address practical barriers: cost, travel, stigma, gender of the therapist.
- Respect explanatory models (karma, nazar, possession) without colluding with harm.

:::widget decide
{
  "scene": "A CBT therapist in Varanasi sees Mrs Devi, 50, who believes her depression is due to bad karma from a past life. She wants to keep visiting the temple and also wants help.",
  "ask": "How should the therapist adapt CBT?",
  "choices": [
    { "label": "Tell her karma is not real and challenge the belief directly", "verdict": "harm", "outcome": "She feels her faith is attacked and stops therapy.", "why": "Directly attacking a core cultural or religious belief harms the alliance and is not the target of therapy." },
    { "label": "Respect her explanatory model, explore how she copes through faith, include helpful religious practices in activity scheduling, and work on the specific thoughts that maintain her depression (such as 'I deserve to suffer, nothing can help')", "verdict": "best", "outcome": "She values the temple visits as pleasant activity, and her hopelessness reduces as she tests helpless thoughts.", "why": "Cultural adaptation keeps the active ingredients (activation, cognitive work) while respecting meaning." },
    { "label": "Refer her to a priest instead of therapy", "verdict": "ok", "outcome": "She feels comforted but her depression persists.", "why": "Faith support can help, but she also asked for psychological treatment." }
  ]
}
:::

### Digital and remote therapy (as of Nov 2026)
- **Guided internet-delivered CBT** for depression and anxiety has effects similar to face-to-face therapy in many trials; unguided apps have smaller effects and high drop-out.
- **Video therapy** is broadly as effective as in-person for many conditions.
- **AI chatbots** for mental health are spreading fast. Early trials of some generative AI therapy tools show symptom reductions over short periods, but evidence is limited, risk handling (suicidal disclosures) is a serious concern, and regulation is still developing. They are not a substitute for professional care in moderate to severe illness.

### When therapy harms
Psychotherapy can harm: around 5 to 10 per cent of clients get worse during therapy. Known harmful or risky practices include single-session trauma debriefing, "recovered memory" techniques, coercive attachment therapies, conversion therapy, and boundary violations. Monitoring outcomes session by session helps catch deterioration early.

:::clinician
Routine outcome monitoring with feedback (for example session-by-session measures with alerts for clients "not on track") reduces deterioration and improves outcomes in several meta-analyses, especially for clients at risk of failure. On task-sharing, the evidence base from India is internationally influential: the Healthy Activity Program and Counselling for Alcohol Problems were effective and cost-effective in primary care in Goa; the Thinking Healthy Programme, adapted for peer delivery in India and Pakistan, reduced perinatal depression. The WHO mhGAP Intervention Guide recommends brief psychological interventions in primary care. Cultural adaptation frameworks (for example Bernal's ecological validity model: language, persons, metaphors, content, concepts, goals, methods, context) guide systematic adaptation; meta-analyses show adapted interventions are more effective than unadapted ones for minority and non-Western groups. For AI tools, apply the ethics covered in the Ethics and law module (consent, data protection, crisis protocols, clinician responsibility).
:::

:::recall
1. Name the first-line psychological treatment for insomnia. || CBT for insomnia (CBT-I).
2. Name three task-shared therapies tested in South Asia. || Healthy Activity Program, Counselling for Alcohol Problems, Thinking Healthy Programme (also Problem Management Plus).
3. What should cultural adaptation change and keep? || Change the packaging (language, examples, family involvement, style); keep the active ingredients.
4. Roughly what share of clients get worse in therapy? || About 5 to 10 per cent.
:::

:::mcq
Q: Which therapy has the strongest evidence for adolescent anorexia nervosa?
- ACT
- Psychodrama
- *Family-based treatment
- MBCT
> First-line.

Q: Session-by-session outcome monitoring helps mainly by:
- Replacing therapy
- *Detecting clients who are not improving so the plan can change
- Lengthening sessions
- Increasing fees
> Early warning of deterioration.
:::

## 3.6 Putting it together: choosing and sequencing therapy [core][advanced]
### A practical decision sequence
1. **Safety first**: assess risk; stabilise crises.
2. **Diagnose and formulate**: what is the problem, what maintains it (see the Case sheet module)?
3. **Match** the therapy to the problem, its severity and phase, and the evidence.
4. **Consider the person**: preference, goals, culture, literacy, family, practical barriers, past experience of therapy.
5. **Combine** with medicine where indicated (moderate to severe depression, bipolar disorder, psychosis, severe OCD).
6. **Agree goals and a plan** with the client; give a clear rationale.
7. **Measure** progress regularly; **review** and change if not improving.
8. **Plan endings** and relapse prevention.

:::widget worked
{
  "title": "Three clients, three plans",
  "steps": [
    { "q": "Client A: Rina, 26, in Pune, with panic disorder and agoraphobia for a year, no depression, keen to avoid medicines. What is the plan?", "a": "CBT for panic: psychoeducation about the panic cycle, interoceptive exposure, cognitive work on catastrophic interpretations, graded in vivo exposure, dropping safety behaviours. Measure with a panic severity scale; around 12 sessions; relapse prevention at the end." },
    { "q": "Client B: Mr Sharma, 48, in Delhi, drinks heavily, is ambivalent, and his wife is threatening to leave. What comes first?", "a": "Motivational interviewing to engage and build motivation; assess withdrawal risk and medical complications; involve his wife if he agrees; then CBT relapse prevention skills, possibly anti-craving medicine, mutual help groups, and couple work." },
    { "q": "Client C: Kavya, 19, in Chennai, with repeated self-cutting, intense unstable relationships and chronic emptiness, recently admitted after an overdose. What is the plan?", "a": "Safety planning and crisis plan first; a DBT-informed programme (individual work with chain analysis, skills group, phone coaching where available); involve family in validation skills; treat any co-occurring depression; avoid frequent medicine changes; regular risk review." }
  ],
  "yourTurn": [
    { "q": "Client D: Mr Rao, 70, recently widowed, has had depression for four months, lives alone in Hyderabad, and has mild hearing loss. Suggest a plan.", "a": "Assess risk (older widowed men are at higher suicide risk) and physical health. Consider IPT focused on grief, or behavioural activation; adapt for hearing (quiet room, face-to-face, written summaries); link with community or religious groups; consider an antidepressant if moderate to severe; involve family if he wishes; monitor with a depression scale." }
  ]
}
:::

:::widget decide
{
  "scene": "After eight sessions of CBT, Anil, 30, in Indore, still scores the same on his depression scale as at the start. He attends regularly and does some homework.",
  "ask": "What should the therapist do?",
  "choices": [
    { "label": "Continue the same approach for another six months", "verdict": "harm", "outcome": "His depression becomes chronic; he loses his job.", "why": "No change after an adequate trial calls for review, not more of the same." },
    { "label": "Review together: check the diagnosis and formulation (for example bipolarity, substance use, a hidden stressor or trauma), adherence and alliance; consider adding medicine, switching therapy (for example to IPT or behavioural activation focus), or increasing intensity; and get supervision", "verdict": "best", "outcome": "Anil reveals ongoing harassment at work he had felt ashamed to mention. The focus shifts; with a role-dispute plan and an antidepressant, he begins to improve.", "why": "Non-response is information. Systematic review often reveals a missing piece." },
    { "label": "End therapy and tell him he is resistant", "verdict": "harm", "outcome": "He feels blamed and hopeless.", "why": "Blaming the client is unhelpful and inaccurate." }
  ]
}
:::

:::clinician
Stepped care (low-intensity interventions first, stepping up when needed) and matched care (choosing intensity by severity and complexity) are the two delivery models; the UK's NHS Talking Therapies programme is the best-known stepped care system and reports recovery rates around half of treated clients, with ongoing debate about measurement. Predictors of response remain weak at the individual level; personalised "treatment selection" algorithms (for example the Personalised Advantage Index) show promise in research but are not ready for routine use. Combined treatment (psychotherapy plus medicine) outperforms either alone in moderate to severe depression and in many anxiety disorders. When therapy stalls, the common culprits are: wrong formulation, unaddressed comorbidity (substance use, personality disorder, bipolarity), ongoing adversity or abuse, a weak alliance or rupture, and insufficient dose or skill. Alliance ruptures, when repaired, predict better outcome than no rupture at all.
:::

:::recall
1. List the eight steps in choosing and sequencing therapy. || Safety; diagnose and formulate; match; consider the person; combine with medicine where indicated; agree goals and rationale; measure and review; plan endings and relapse prevention.
2. What should happen when a client does not improve after an adequate trial? || Review the diagnosis, formulation, comorbidity, adversity, alliance and dose; consider changing or adding treatment; get supervision.
3. What is stepped care? || Starting with lower-intensity treatment and stepping up if needed.
:::

:::mcq
Q: For a man ambivalent about his drinking, the best first therapeutic approach is usually:
- Exposure therapy
- *Motivational interviewing
- Psychoanalysis
- Art therapy
> Build motivation first.

Q: A repaired rupture in the therapeutic alliance is associated with:
- Worse outcome than no rupture
- *Good outcome, often better than no rupture
- Immediate termination
- No effect
> Repair can strengthen the work.
:::

# Part IV · Exam zone

## 4.1 Long answers and short notes [core]
### Long answer skeletons
**1. Describe cognitive behaviour therapy for depression (15 marks).**
Background (Beck) → cognitive model (automatic thoughts, intermediate and core beliefs, triad, distortions) → assessment and formulation → session structure → techniques (behavioural activation, thought records, Socratic questioning, behavioural experiments, schema work) → homework → relapse prevention → evidence and limitations → cultural adaptation in India.

**2. Dialectical behaviour therapy: theory, structure and evidence (15 marks).**
Background (Linehan, borderline personality disorder, suicidality) → biosocial theory → dialectics and validation → four modes → target hierarchy → four skills modules with examples → chain analysis → evidence → adaptations and use in India.

**3. Motivational interviewing (10 marks).**
Definition → ambivalence and the righting reflex → spirit → OARS → change and sustain talk (DARN-CAT) → four processes → applications and evidence.

**4. Family therapy approaches (10 to 15 marks).**
Systemic ideas → structural, strategic, Milan, Bowen, narrative, solution-focused → family psychoeducation and expressed emotion → family-based treatment for anorexia → Indian family context.

**5. Common factors in psychotherapy (10 marks).**
Dodo bird verdict → alliance (Bordin) → empathy, regard, genuineness (Rogers) → hope and rationale (Frank) → evidence → specific factors and where they matter.

**6. Career counselling: theories and process (10 marks).**
Parsons → Holland (RIASEC, congruence) → Super (life-span, life-space) → Krumboltz, Savickas → process and assessment tools → Indian context.

### Short notes (5 marks each)
- Counselling microskills
- Rogers's core conditions
- Systematic desensitisation
- Exposure and response prevention
- Behavioural activation
- Thought record
- REBT
- IPT problem areas
- Yalom's therapeutic factors
- ACT hexaflex
- MBCT
- Psychodrama
- Play therapy
- Supportive psychotherapy
- Task-shared psychological interventions in India

:::student
For any therapy question, use the same skeleton: **who developed it, the theory, the structure, the techniques with an example, what it is used for, the evidence, and limitations**. Seven headings, every time.
:::

:::clinician
Postgraduate and PsyD answers should compare therapies on mechanism and evidence, discuss common versus specific factors, cite at least one landmark trial by its finding (not its journal), and address cultural adaptation and task-sharing in India. Examiners also ask how you would handle non-response, ruptures and risk within a therapy.
:::

:::recall
1. What seven headings fit any therapy answer? || Founder, theory, structure, techniques with example, uses, evidence, limitations.
:::

## 4.2 Viva rapid-fire [core]
:::viva
Bordin's three parts of the alliance? :: Goals, tasks, bond.
Rogers's core conditions? :: Empathy, unconditional positive regard, congruence.
SOLER? :: Sit squarely, Open posture, Lean forward, Eye contact, Relaxed.
Egan's three stages? :: Current picture, preferred picture, way forward.
Who developed systematic desensitisation? :: Joseph Wolpe.
What is ERP used for? :: OCD.
What is SUDS? :: Subjective units of distress, 0 to 100.
Beck's cognitive triad? :: Negative views of self, world and future.
Ellis's ABCDE? :: Activating event, Belief, Consequence, Disputing, Effective new philosophy.
OARS? :: Open questions, Affirmations, Reflections, Summaries.
DARN-CAT? :: Desire, Ability, Reasons, Need; Commitment, Activation, Taking steps.
MI's four processes? :: Engaging, focusing, evoking, planning.
IPT problem areas? :: Grief, role disputes, role transitions, interpersonal deficits.
Who developed IPT? :: Klerman and Weissman.
Structural family therapy? :: Minuchin: boundaries, hierarchy, joining, enactment.
Narrative therapy key technique? :: Externalising the problem.
Miracle question? :: Solution-focused therapy.
Holland's types? :: Realistic, Investigative, Artistic, Social, Enterprising, Conventional.
Super's career stages? :: Growth, exploration, establishment, maintenance, disengagement.
DBT biosocial theory? :: Emotional vulnerability plus invalidating environment.
DBT four skills modules? :: Mindfulness, distress tolerance, emotion regulation, interpersonal effectiveness.
TIPP? :: Temperature, intense exercise, paced breathing, paired muscle relaxation.
ACT six processes? :: Acceptance, defusion, present moment, self-as-context, values, committed action.
ACT's underlying theory? :: Relational frame theory.
MBCT is designed for? :: Preventing relapse in recurrent depression.
Who founded MBSR? :: Jon Kabat-Zinn.
Who founded psychodrama? :: J. L. Moreno.
Yalom's universality? :: Realising others share one's problems.
First-line therapy for insomnia? :: CBT-I.
First-line therapy for adolescent anorexia? :: Family-based treatment.
:::

## 4.3 Module test [core]
Score 80% or more to complete the module.

:::mcq
Q: Which best predicts outcome across different therapies?
- The therapist's age
- *The therapeutic alliance
- The number of techniques used
- The length of each session
> A common factor.

Q: A counsellor says, "You felt invisible at that family function." This is:
- A closed question
- *A reflection of feeling
- A challenge
- Advice
> Names the emotion.

Q: Egan's model of helping is called:
- The ABC model
- *The Skilled Helper
- The hexaflex
- The triangle of conflict
> Three stages of helping.

Q: Supportive psychotherapy is especially indicated for:
- Highly insightful clients seeking deep exploration only
- *People in crisis, with severe mental illness or low ego strength
- Nobody
- Only children
> Strengthening coping.

Q: In graded exposure, the person should:
- Escape as soon as anxiety rises
- *Stay in the situation without safety behaviours until anxiety reduces or the planned time ends
- Take a sedative first
- Avoid the top of the hierarchy forever
> Approach and stay.

Q: Contingency management is best evidenced for:
- Schizophrenia
- *Stimulant use disorders
- Dementia
- Bipolar mania
> Rewards for verified abstinence.

Q: "I always ruin everything" is an example of:
- Mind-reading
- *Overgeneralisation
- Personalisation
- Catastrophising
> One event becomes "always".

Q: The core belief level in Beck's model refers to:
- Moment-to-moment thoughts
- Rules and assumptions
- *Deep beliefs about self, others and the world
- Behaviours
> Schemas.

Q: In MI, "I'm going to throw away my cigarettes tonight" is:
- Sustain talk
- Preparatory change talk
- *Mobilising change talk (commitment)
- Resistance
> Commitment language.

Q: The spirit of MI includes:
- Confrontation and persuasion
- *Partnership, acceptance, compassion and evocation (or empowerment)
- Interpretation and neutrality
- Homework and agenda-setting
> The MI spirit.

Q: An IPT therapist doing a communication analysis is most likely working on a:
- Grief problem
- *Role dispute
- Interpersonal deficit only
- Medication plan
> Analysing what was said in the conflict.

Q: Triangulation in family therapy refers to:
- Three sessions per week
- *Two people in conflict drawing in a third to reduce tension
- A three-generation genogram
- Three therapists in the room
> Bowen's and structural concept.

Q: Which school uses circular questioning?
- Structural
- *Milan systemic
- Narrative
- Behavioural
> Hypothesising, circularity, neutrality.

Q: Holland's congruence predicts:
- IQ
- *Job satisfaction from person-environment fit
- Personality disorder
- Exam marks only
> Fit between type and environment.

Q: Super's theory emphasises:
- A single career choice at 18
- *Career development across the life-span and multiple life roles
- Only aptitude tests
- Unconscious conflict
> Life-span, life-space.

Q: DBT's biosocial theory explains emotion dysregulation as arising from:
- Unconscious guilt
- *Emotional vulnerability interacting with an invalidating environment
- Faulty conditioning alone
- Brain damage
> Linehan's transactional model.

Q: Which is a DBT interpersonal effectiveness skill?
- TIPP
- PLEASE
- *DEAR MAN
- Three-minute breathing space
> Asking effectively.

Q: The first target in a DBT session is:
- Skills building
- Quality-of-life issues
- Therapy-interfering behaviour
- *Life-threatening behaviour
> Top of the hierarchy.

Q: In ACT, experiential avoidance is:
- Healthy coping
- *Trying to avoid or control unwanted inner experiences at the cost of valued living
- Avoiding the therapist
- A mindfulness skill
> The opposite of acceptance.

Q: Which ACT process is targeted by "What do you want your life to stand for?"
- Defusion
- Present moment
- *Values
- Self-as-context
> Values clarification.

Q: MBCT combines CBT with:
- Psychoanalysis
- *Mindfulness-based stress reduction
- Family therapy
- Hypnosis
> Segal, Williams and Teasdale.

Q: Cognitive reactivity refers to:
- Fast thinking speed
- *Small mood dips reactivating negative thinking in people with past depression
- Reaction to medicines
- A type of exposure
> The vulnerability MBCT targets.

Q: In psychodrama, role reversal means the protagonist:
- Leaves the stage
- *Takes the role of another person in their story
- Directs the scene
- Watches silently
> Seeing from the other side.

Q: Non-directive, child-centred play therapy is associated with:
- Moreno
- *Virginia Axline
- Minuchin
- Linehan
> Axline's approach.

Q: Single-session critical incident debriefing after trauma is:
- First-line
- *Not recommended, as it does not prevent PTSD and may harm some people
- Required by law
- The same as trauma-focused CBT
> Psychological first aid is preferred.

Q: The Healthy Activity Program delivered by lay counsellors in India is based on:
- Psychoanalysis
- *Behavioural activation
- Psychodrama
- Hypnosis
> Task-shared treatment of depression.

Q: Good cultural adaptation of a therapy changes:
- The active ingredients
- *Language, examples, family involvement and style, while keeping the active ingredients
- Nothing
- Only the fee
> Packaging, not core mechanisms.

Q: After eight sessions without improvement, the best step is to:
- Continue unchanged indefinitely
- *Review diagnosis, formulation, comorbidity, adversity and alliance, and adjust the plan
- Blame the client
- End therapy without explanation
> Non-response is information.
:::
`;
