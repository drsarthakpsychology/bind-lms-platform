/* Module · Anxiety disorders, Parts 0 to II (Starting level, understanding anxiety, the disorders). Original text written for VIBHA School of Psychology. */
export const part1 = String.raw`
# Part 0 · Starting: anxiety in plain words

## 0.1 What anxiety is, and why we need it [core][starting]
Imagine you are crossing a road and a bus swerves towards you. Before you can think, your heart pounds, you breathe fast, your muscles tense, and you jump back. That is **fear**. It saved your life, and it did so faster than thinking could.

**Anxiety** is the same alarm system, switched on by something that **might** happen rather than something happening now: an exam tomorrow, a phone call from the bank, a strange pain in your chest.

### The alarm in the body
When the alarm goes off, the body gets ready to fight or run:
- The heart beats faster and harder, sending blood to the muscles.
- Breathing speeds up to bring in more oxygen.
- Muscles tense; hands may shake.
- Sweating cools the body.
- Digestion slows, so the stomach churns or feels empty.
- Attention narrows onto the danger.

Every one of these changes is useful when there is a real bus. Each feels frightening when there is no bus, and people who do not know why their heart is racing often fear a heart attack.

:::analogy A smoke alarm
Anxiety works like a smoke alarm. A good alarm rings for real fires and stays quiet for toast. In an anxiety disorder, the alarm is too sensitive: it rings loudly for burnt toast, or for nothing at all, and keeps ringing after the toast has gone.
:::

:::widget nervoussystem
{"title":"Watch the alarm go off","start":"auto","caption":"Switch on fight or flight: every symptom in the list above comes from this one system. In an anxiety disorder the system is normal; it simply fires for a lift, a crowd or a worry, and the body cannot tell the difference."}
:::

### A little anxiety helps
Some anxiety improves performance: it sharpens attention before an exam or a match. Too little and you don't prepare; too much and your mind goes blank. Performance is best somewhere in the middle. This inverted-U pattern is often called the Yerkes-Dodson curve.

:::widget sort
{"prompt": "Where does each sign of anxiety show up? Place each card.", "buckets": ["Body", "Thoughts", "Behaviour"], "items": [{"text": "Heart pounding", "bucket": 0}, {"text": "\"What if I fail and everyone laughs?\"", "bucket": 1}, {"text": "Avoiding the lift and taking the stairs", "bucket": 2}, {"text": "Tight shoulders and a headache", "bucket": 0}, {"text": "Mind going blank in the viva", "bucket": 1}, {"text": "Asking a friend again and again, 'Are you sure it's fine?'", "bucket": 2, "why": "Seeking reassurance is a behaviour that gives brief relief but keeps the worry going."}, {"text": "Butterflies in the stomach", "bucket": 0}]}
:::

:::widget reveal
{"prompt": "Why does your heart race before an exam, when there is no physical danger to run from?", "answer": "The alarm system cannot tell the difference between a bus and a threat to your future. It treats any important threat as physical danger and prepares the body to fight or run. The body response is the same; only the situation is different."}
:::

:::widget curve
{"kind": "inverted-u", "title": "Arousal and performance", "caption": "Performance rises with arousal up to a point, then falls. The peak comes earlier for hard, complex tasks (a viva) than for simple ones (running). Slide arousal and task difficulty to see the Yerkes-Dodson pattern."}
:::

:::recall
1. What is the difference between fear and anxiety? || Fear is the alarm for danger happening now; anxiety is the same alarm for something that might happen.
2. Name four body changes during anxiety. || Fast heart, fast breathing, tense muscles, sweating, churning stomach, shaking.
3. Is all anxiety harmful? || No. Moderate anxiety improves performance; too little or too much makes it worse.
:::

:::mcq
Q: Kavita's heart races and her hands sweat before she presents in class. Afterwards she feels fine. This is best described as:
- An anxiety disorder
- *A normal anxiety response to a stressful situation
- A heart problem
- Depression
> A short, understandable rise in anxiety that passes is the alarm working normally.
:::

## 0.2 When anxiety becomes a disorder [core][starting]
Everyone feels anxious. An **anxiety disorder** is when the alarm becomes a problem in itself. Clinicians look for four things:
| Question | Normal anxiety | Anxiety disorder |
|---|---|---|
| Is it out of proportion? | Fits the situation | Far stronger than the real danger, or with no clear danger |
| How long does it last? | Passes when the situation is over | Persists for a long stretch |
| How often? | Now and then | Most days, or in attacks that keep returning |
| Does it stop life? | You carry on | You avoid places, people or tasks; work, study or family suffer |

### The avoidance trap
The most important idea in this whole module is **avoidance**.

When something makes us anxious, staying away from it brings instant relief. That relief feels like the right answer, so we avoid again next time. But by avoiding, we never find out that the feared thing was not as dangerous as we thought. The fear stays, and often grows, and the list of things we avoid gets longer.

:::example Avoidance in action
**Neha**, 23, from Kolkata, had a frightening spell of dizziness and a racing heart in a crowded metro. Next day she took a cab instead, and felt relieved. Then she avoided buses too. Then the market. Six months later she leaves home only with her mother. Every avoidance brought relief, and every relief made the fear stronger.
:::

:::widget decide
{"scene": "Your cousin Rahul, 17, has been anxious about giving his class presentation. He asks you to help him get a medical note so he can skip it. He says, 'If I don't go, I'll feel so much better.'", "ask": "What advice is most helpful?", "choices": [{"label": "Help him get the note; his anxiety is real", "verdict": "harm", "outcome": "He feels relieved that day. Next term he skips two more presentations and stops answering questions in class.", "why": "Avoidance relieves anxiety at once but strengthens it over time. The next situation feels even harder."}, {"label": "Tell him to stop being silly and just do it", "verdict": "ok", "outcome": "He goes, shaking, and feels ashamed rather than proud.", "why": "Facing it is right, but dismissing his feelings adds shame. Support makes facing fear possible."}, {"label": "Acknowledge the fear, help him practise in front of family first, and encourage him to go, expecting anxiety but staying until it settles", "verdict": "best", "outcome": "He is nervous at the start, but his anxiety drops halfway through. The next presentation is easier.", "why": "Gradual, supported facing of fear lets him learn that he can cope and that the feared outcome rarely happens."}]}
:::

:::widget flow
{"title": "The avoidance trap", "layout": "cycle", "nodes": [{"id": "fear", "label": "Feared situation", "detail": "The metro, a presentation, a dog."}, {"id": "anx", "label": "Anxiety rises", "detail": "Racing heart, dread."}, {"id": "avoid", "label": "Avoid or escape", "detail": "Take a cab; skip the class."}, {"id": "relief", "label": "Instant relief", "detail": "Anxiety drops."}, {"id": "learn", "label": "Nothing new is learned", "detail": "The fear is never tested, so it stays or grows, and more situations are avoided."}]}
:::

:::widget compare
{"title": "Everyday fear and an anxiety disorder", "a": {"label": "Everyday fear", "points": ["Fits the size of the danger", "Settles once the danger passes", "Life carries on: you still take the exam or the bus", "Feels unpleasant but makes sense to you"], "summary": "Healthy fear: in proportion, short-lived and it does not run your life."}, "b": {"label": "Anxiety disorder", "points": ["Far bigger than the real danger, or with no danger at all", "Lasts for months or keeps coming back", "You start avoiding places, people or tasks", "Causes real distress or gets in the way of study, work or family"], "summary": "A disorder: out of proportion, persistent and impairing. All three together point to a disorder."}, "caption": "Slide across. Clinicians ask the same three questions: is it out of proportion, does it persist, and does it get in the way?"}
:::

:::recall
1. Name the four signs that anxiety has become a disorder. || Out of proportion, lasting a long time, frequent, and stopping normal life.
2. What is the avoidance trap? || Avoiding brings quick relief, so it is repeated; the person never learns the feared thing is safe, so fear grows.
:::

:::mcq
Q: Which detail most suggests an anxiety disorder rather than normal anxiety?
- Feeling nervous before a job interview
- Worrying when a parent is unwell in hospital
- *Avoiding all lifts for years and turning down a job on the tenth floor because of it
- Feeling tense during exam week
> Avoidance that limits life over a long period marks a disorder.
:::

## 0.3 The main anxiety disorders, in plain words [core][starting]
There are several anxiety disorders. They differ mainly in **what** the person fears.
| Disorder | What the fear is about | Everyday picture |
|---|---|---|
| Panic disorder | Sudden attacks of intense fear, and fear of the next attack | Racing heart, breathlessness and fear of dying, out of the blue |
| Agoraphobia | Places where escape or help might be hard | Avoids buses, crowds, markets, or going out alone |
| Social anxiety disorder | Being judged or embarrassed by others | Dreads speaking up, eating in front of others, meeting new people |
| Specific phobia | One particular thing or situation | Dogs, heights, injections, flying, the sight of blood |
| Generalised anxiety disorder | Many everyday things, with constant worry | Worries about health, money, family and work, and cannot switch off |
| Separation anxiety disorder | Being apart from people one is attached to | A child cannot go to school without mother; an adult phones the spouse many times a day |
| Selective mutism | Speaking in certain places | A child talks freely at home but never speaks at school |

:::widget sort
{"prompt": "Which anxiety disorder does each picture suggest?", "buckets": ["Panic disorder", "Social anxiety", "Specific phobia", "Generalised anxiety"], "items": [{"text": "Faints at the sight of blood and has avoided blood tests for years", "bucket": 2}, {"text": "Sudden waves of terror with a pounding heart, then weeks of fearing another wave", "bucket": 0}, {"text": "Worries every day about her children, her job, money and her health, and feels tense all the time", "bucket": 3}, {"text": "Will not eat in the college canteen in case people watch him", "bucket": 1}, {"text": "Cannot board a plane, but is fine everywhere else", "bucket": 2}]}
:::

:::widget guess
{"prompt": "Specific phobias are the most common anxiety disorders. In US surveys, out of every 100 adults, how many have a specific phobia in a given year?", "min": 0, "max": 30, "unit": "in 100", "answer": [8, 12], "reveal": "About 8 to 12 in 100. Most never seek help, because they can simply avoid the feared thing. Rates are lower in many Asian countries, partly because of how surveys ask. Women are affected about twice as often as men.", "clinician": "DSM-5-TR gives a US 12-month prevalence of specific phobia of about 8 to 12%, lower in Asian, African and Latin American countries (about 2 to 4%), with a female-to-male ratio of about 2:1."}
:::

:::note Anxiety rarely comes alone
Many people have more than one anxiety disorder, and depression often joins in. Treating the anxiety early may help prevent later depression.
:::

:::recall
1. Name five anxiety disorders and what each one fears. || Panic (attacks and the next attack); agoraphobia (places hard to escape); social anxiety (being judged); specific phobia (one thing); GAD (many everyday things).
2. Which is the most common anxiety disorder? || Specific phobia.
:::

:::mcq
Q: Arjun, 9, talks non-stop at home but has never said a word at school in two years, though he understands everything. This most suggests:
- Autism
- *Selective mutism
- Social anxiety disorder in an adult
- Intellectual disability
> Speaking freely in some places but not others, with understanding intact, is selective mutism.
:::

## 0.4 How anxiety shows itself in clinics [core][starting]
Many people with anxiety never say "I am anxious". They come with their **body**.

:::sounds How people describe it
- "Ghabrahat hoti hai." (I feel a kind of panicky restlessness.)
- "Dil zor se dhadakta hai, lagta hai heart attack aa jayega." (My heart pounds; I feel I'll have a heart attack.)
- "Gas chadh jaati hai, saans nahi aati." (Gas rises up and I can't breathe.)
- "Haath-pair thande ho jaate hain, sunn ho jaate hain." (Hands and feet go cold and numb.)
- "Tension se sar phat raha hai." (My head is bursting with tension.)
- "I can't stop thinking about what could go wrong."
:::

So people with panic often see cardiologists first, have repeated ECGs and spend money on tests, while the real problem goes untreated. In India this is common, partly because body symptoms carry less stigma than "mental" ones.

:::widget decide
{"scene": "Salim, 34, a shopkeeper in Hyderabad, comes to the emergency department for the third time in two months with a pounding heart, tingling fingers and a fear that he is dying. Each time his ECG and blood tests are normal, and he is told, 'Nothing is wrong, go home.'", "ask": "What would help him most this time?", "choices": [{"label": "Another full set of heart tests, to be sure", "verdict": "ok", "outcome": "Tests are normal again. He leaves frightened, sure that the doctors are missing something.", "why": "Checking the heart is right the first time. Repeating normal tests without explanation strengthens the fear that something hidden is wrong."}, {"label": "Tell him firmly it is 'just stress' and to relax", "verdict": "harm", "outcome": "He feels dismissed and goes to a private hospital for an angiogram.", "why": "'Just stress' feels like 'you are imagining it'. It gives no explanation and no plan."}, {"label": "Explain that his tests show a healthy heart, that these attacks sound like panic attacks, how the body alarm produces each symptom, and refer him for assessment and treatment", "verdict": "best", "outcome": "For the first time his symptoms make sense. He starts CBT and the attacks become rarer.", "why": "A clear, respectful explanation of the body's alarm, plus a referral, turns a frightening mystery into a treatable problem."}]}
:::

:::recall
1. Why do many people with anxiety first see a heart doctor? || The alarm produces chest pain, palpitations and breathlessness, which feel like heart disease; body symptoms also carry less stigma.
2. Give two Hindi or Urdu idioms of anxiety. || "Ghabrahat hoti hai"; "dil ghabrata hai"; "gas chadh jaati hai"; "haath-pair sunn ho jaate hain".
:::

:::mcq
Q: Why is telling a person with panic attacks "it's just stress, relax" unhelpful?
- Because panic is a heart disease
- *Because it gives no explanation of the symptoms and no plan, and can feel dismissive
- Because stress never causes symptoms
- Because they should be admitted
> A clear explanation of how the alarm causes each symptom, plus a treatment plan, is what helps.
:::

## 0.5 What helps [core][starting]
Anxiety disorders are among the most treatable problems in mental health.

### The main kinds of help
- **Talking treatments**, especially **cognitive behavioural therapy (CBT)**. The person learns how anxiety works and, step by step, faces what they fear while dropping the habits that keep fear alive. Facing fears in a planned, gradual way is called **exposure**, and it is the engine of most successful treatment.
- **Medicines**, mainly some antidepressants (which also treat anxiety). They take time to work and are prescribed by a doctor.
- **Self-help** based on CBT, in books, apps or guided programmes, for milder problems.

### Things that seem to help but keep anxiety going
- **Avoiding** the feared thing.
- **Safety behaviours**: carrying a water bottle "in case I faint", always sitting near the door, holding a friend's arm.
- **Constant reassurance**: asking again and again, "Are you sure I'm fine?"
- **Alcohol or sleeping tablets** to calm down. They help for hours and worsen anxiety over weeks.

:::widget sort
{"prompt": "Does each response help anxiety get better, or keep it going?", "buckets": ["Helps it get better", "Keeps it going"], "items": [{"text": "Going to the market for ten minutes, then twenty, then thirty", "bucket": 0}, {"text": "Always carrying an inhaler 'just in case', though there is no asthma", "bucket": 1, "why": "A safety behaviour: the person credits the inhaler, not themselves, for surviving."}, {"text": "Learning what each body symptom of panic means", "bucket": 0}, {"text": "Having two pegs of whisky before every party", "bucket": 1}, {"text": "Asking your mother five times a day if your headache could be a tumour", "bucket": 1}, {"text": "Staying in a feared situation until the anxiety settles by itself", "bucket": 0}]}
:::

:::widget timeline
{"prompt": "Rohan is afraid of lifts. Order his exposure ladder from the easiest step to the hardest.", "events": [{"label": "Look at photos and videos of lifts"}, {"label": "Stand in front of a lift and watch the doors open and close"}, {"label": "Step inside a lift with the doors held open"}, {"label": "Ride one floor with a friend"}, {"label": "Ride one floor alone"}, {"label": "Ride ten floors alone in a busy lift"}], "why": "A ladder starts with a step that is hard but possible, and climbs only when the step before has become manageable. The friend is a helper early on and is then dropped, because a companion can become a safety behaviour."}
:::

:::widget thoughtrecord
{"situation": "The night before her viva, Sneha's mind goes blank while revising one topic.", "thought": "I will freeze in front of the examiners and fail the whole year.", "emotion": "anxious", "traps": [{"label": "Catastrophising", "right": true, "why": "One blank moment at night has become failing the whole year."}, {"label": "Fortune telling", "right": true, "why": "She is predicting the future as if it were certain."}, {"label": "Mind reading", "why": "Close, but the thought is mainly about what will happen, not what the examiners think."}, {"label": "Should statements", "why": "There is no 'I should' or 'I must' in this thought."}], "forEvidence": ["She could not recall that topic just now.", "She feels very nervous."], "againstEvidence": ["She has passed every viva so far.", "Tired minds go blank at night; the topic came back after a break.", "Examiners usually rephrase a question if a student is stuck."], "balanced": "I am tired and nervous, which is normal before a viva. I know most of this, and if I get stuck I can ask for the question again."}
:::

### Being a good support
- Listen; don't laugh or call it silly.
- Don't take over the person's tasks or help them avoid.
- Encourage small steps towards feared things, and praise effort.
- Encourage a proper assessment if anxiety is stopping their life.

:::recall
1. What is exposure? || Facing feared situations in a planned, gradual way until the fear falls.
2. Name three things that keep anxiety going. || Avoidance, safety behaviours, repeated reassurance (also alcohol or sedatives).
:::

:::mcq
Q: Which plan is most likely to help a person afraid of lifts?
- Always using the stairs
- Taking a sedative before every lift ride
- *Gradually practising riding lifts, starting with one floor, without safety behaviours
- Waiting until the fear goes away by itself
> Gradual exposure without safety behaviours retrains the alarm.
:::

## 0.6 Level check · Starting [starting]
Twelve or more right out of fifteen (80%) opens the Beginner level. If you already know this, take it now to skip ahead.

:::mcq
Q: Fear and anxiety differ mainly in that:
- Fear is mental, anxiety physical
- *Fear is about danger now; anxiety is about something that might happen
- Anxiety is always a disorder
- Fear never causes body symptoms
> Same alarm, different timing.

Q: Which is a body sign of anxiety?
- Slow, deep breathing
- *A pounding heart
- Feeling very sleepy
- Warm, dry hands
> The alarm speeds the heart and breathing and causes sweating.

Q: A moderate amount of anxiety before an exam:
- Always harms performance
- *Can sharpen attention and improve performance
- Means an anxiety disorder
- Should be treated with medicine
> Performance is best at a middle level of arousal.

Q: Which feature marks anxiety as a disorder?
- It happens before exams
- *It is out of proportion, long-lasting and stops normal life
- It causes a racing heart
- It has a clear trigger
> Proportion, duration, frequency and impact.

Q: Avoiding feared situations:
- Cures anxiety over time
- *Gives quick relief but keeps the fear going and often makes it grow
- Has no effect
- Is the main treatment
> The avoidance trap.

Q: Sudden attacks of intense fear with a pounding heart and fear of dying, out of the blue, suggest:
- Social anxiety disorder
- *Panic attacks
- Specific phobia
- Selective mutism
> Panic attacks peak within minutes.

Q: Fear of being judged or embarrassed in front of others is the core of:
- Agoraphobia
- *Social anxiety disorder
- Generalised anxiety disorder
- Separation anxiety disorder
> Scrutiny by others is the key fear.

Q: Constant worry about many everyday things, with tension, most suggests:
- Specific phobia
- *Generalised anxiety disorder
- Panic disorder
- Selective mutism
> Many topics, hard to control.

Q: The most common anxiety disorder is:
- Panic disorder
- *Specific phobia
- Agoraphobia
- Selective mutism
> Specific phobias are very common and often untreated.

Q: A man has had three emergency visits with chest pain and normal tests. The most helpful approach is:
- Repeat every test
- Tell him it's just stress
- *Explain that his heart is healthy, how panic causes the symptoms, and refer for treatment
- Prescribe a sleeping tablet
> Explanation plus a plan.

Q: "Ghabrahat hoti hai" most often describes:
- A stomach ulcer
- *Anxiety or panic-like restlessness
- A delusion
- Memory loss
> A common idiom of anxiety.

Q: The engine of most successful psychological treatment for anxiety is:
- Relaxation alone
- *Exposure: gradually facing what is feared
- Talking about childhood
- Avoiding stress
> Exposure lets the alarm relearn.

Q: Which is a safety behaviour?
- Going to a party and staying
- *Always sitting by the door "in case I need to escape"
- Learning about panic
- Joining a CBT group
> Safety behaviours prevent learning that one would have coped.

Q: A friend with a fear of dogs asks you to always walk with her on the other side of the road. Helping her this way:
- Is the best support
- *Brings short-term relief but may keep the fear going
- Is a form of exposure
- Will cure the fear
> Helping someone avoid keeps the fear alive.

Q: Medicines used for anxiety disorders are mainly:
- Painkillers
- *Certain antidepressants, which take some time to work
- Antibiotics
- Vitamins
> Several antidepressants treat anxiety disorders.
:::

# Part I · Understanding anxiety

## 1.1 Normal anxiety and anxiety disorders [core][beginner]
### Definitions
:::define Fear and anxiety (DSM-5-TR)
**Fear** is the emotional response to real or perceived **imminent** threat. **Anxiety** is anticipation of **future** threat. Fear is linked with surges of autonomic arousal for fight or flight, thoughts of immediate danger and escape behaviour; anxiety is linked with muscle tension, vigilance in preparation for future danger, and cautious or avoidant behaviour.
:::

Anxiety disorders share excessive fear and anxiety and related behavioural disturbances. They differ from developmentally normal fear by being **excessive or persisting beyond developmentally appropriate periods**. In DSM-5-TR most must typically last 6 months or more (separation anxiety in children and selective mutism are shorter), which separates them from short-lived, stress-induced anxiety.

### What belongs in the chapter, and what moved out
| Change | DSM-5-TR | ICD-11 |
|---|---|---|
| OCD | Its own chapter (obsessive-compulsive and related) | Its own grouping |
| PTSD and acute stress | Trauma- and stressor-related chapter | Disorders specifically associated with stress |
| Separation anxiety and selective mutism | Moved **into** anxiety disorders (no longer childhood-only) | In anxiety or fear-related disorders |
| Panic attack | A **specifier** that can be added to any disorder | Can be specified with other disorders |
| Agoraphobia | Separate from panic disorder; both can be diagnosed | Separate |
| Illness anxiety (hypochondriasis) | Somatic symptom and related disorders | Hypochondriasis is placed with obsessive-compulsive and related disorders |

### Developmental order
Anxiety disorders follow a rough age order of onset: separation anxiety and selective mutism in early childhood; specific phobias in childhood; social anxiety in early adolescence; panic disorder and agoraphobia in late adolescence and early adulthood; GAD across a wide age range. Onset after middle age is unusual and should prompt a search for a medical cause or depression.

:::widget sort
{"prompt": "Fear (imminent threat) or anxiety (future threat)?", "buckets": ["Fear", "Anxiety"], "items": [{"text": "A dog lunges at you, and you leap back", "bucket": 0}, {"text": "You lie awake worrying about tomorrow's results", "bucket": 1}, {"text": "Your car skids on a wet road", "bucket": 0}, {"text": "You feel tense all week before your sister's wedding speech", "bucket": 1}, {"text": "Muscle tension and vigilance before a job interview", "bucket": 1}]}
:::

:::widget guess
{"prompt": "Across the world, how much more often do women than men have most anxiety disorders?", "min": 1, "max": 4, "step": 0.5, "unit": "times", "answer": [1.5, 2], "reveal": "About one and a half to two times. The gap appears in adolescence. Hormones, temperament, socialisation (girls are more often encouraged to avoid, boys to confront) and higher exposure to violence and caregiving all contribute. Men may show anxiety through anger, drinking or physical complaints instead."}
:::

:::recall
1. Define fear and anxiety as DSM-5-TR does. || Fear: response to imminent threat; anxiety: anticipation of future threat.
2. Which disorders moved out of the anxiety chapter in DSM-5, and which moved in? || OCD and PTSD moved out; separation anxiety and selective mutism moved in.
3. Where does ICD-11 place hypochondriasis? || With obsessive-compulsive and related disorders.
4. Why does new-onset anxiety in later life need a careful work-up? || Late onset is unusual; it suggests a medical cause, substance or depression.
:::

:::mcq
Q: A 58-year-old with no past anxiety develops daily panic attacks and tremor over two months. The first step is:
- Start an SSRI
- Diagnose panic disorder
- *Look for a medical or substance cause (thyroid, cardiac, medicines, alcohol) and screen for depression
- Reassure and review in six months
> First-onset anxiety after middle age is unusual and needs a medical work-up.
:::

## 1.2 Why anxiety happens [core][beginner]
Like most mental disorders, anxiety disorders come from vulnerability meeting stress.

:::widget hpaloop
{"title":"Stress, coping and avoidance","caption":"Play the day twice: once avoiding every problem, once facing them. Avoidance brings quick relief but keeps the stress system running, which is exactly how avoidance keeps anxiety going."}
:::

### Biological vulnerability
- **Genes.** Anxiety disorders run in families. Twin studies suggest heritability of roughly 30 to 50%, with genes that are largely shared across anxiety disorders and depression rather than specific to one.
- **Temperament.** Some infants are shy, cautious and easily distressed by new things (**behavioural inhibition**, described by Jerome Kagan). These children have a higher risk of later social anxiety in particular.
- **Brain.** The amygdala detects threat; the prefrontal cortex calms it; the hippocampus judges context. In anxiety disorders the amygdala tends to over-respond and the calming circuits to under-act (detail in the Advanced level).
- **Body sensitivity.** People with panic disorder react more strongly to carbon dioxide and to body sensations.

:::widget figure
{"id": "stress-vulnerability"}
:::

### Psychological factors
- **Learning.** Fear can be learned by direct frightening experience (conditioning), by watching others (a parent afraid of dogs), or by being told (warnings).
- **Avoidance** keeps fear alive (Mowrer's two-factor idea: fear is learned by conditioning, and maintained by the relief of avoidance).
- **Thinking style.** Overestimating danger, underestimating one's ability to cope, catastrophising, and intolerance of uncertainty.
- **Anxiety sensitivity.** Fear of anxiety symptoms themselves ("my racing heart means I am dying").

### Social factors
Childhood adversity, overprotective or highly critical parenting, bullying, poverty, violence, migration, exam pressure and job insecurity all raise risk.

:::example A pathway
**Meenakshi**, 26, from Coimbatore, was a cautious child. Her mother, anxious herself, often warned her about germs and strangers. At 24 she had her first panic attack in a stuffy, crowded bus after a night without sleep. She concluded, "My heart is weak." She began checking her pulse and avoiding buses. Temperament, learned watchfulness, a trigger, a frightening interpretation and avoidance together built panic disorder.
:::

:::widget sort
{"prompt": "Place each factor for Meenakshi.", "buckets": ["Biological", "Psychological", "Social"], "items": [{"text": "Cautious, shy temperament since infancy", "bucket": 0}, {"text": "Interprets a fast heartbeat as a weak heart", "bucket": 1}, {"text": "A crowded bus after a sleepless night", "bucket": 2, "why": "An environmental trigger (with a biological element: sleep loss lowers the alarm threshold)."}, {"text": "Checks her pulse many times a day", "bucket": 1}, {"text": "Mother who also has anxiety", "bucket": 0, "why": "Shared genes, and also learned behaviour, so it touches more than one row."}]}
:::

:::widget guess
{"prompt": "From twin studies, roughly what share of the differences between people in risk of an anxiety disorder is explained by genes?", "min": 0, "max": 100, "unit": "%", "answer": [30, 50], "reveal": "About 30 to 50%. Genes raise vulnerability; they do not decide fate. The genes involved overlap heavily with those for depression, which is one reason the two so often occur together."}
:::

:::widget brainmap
{"title": "Where the alarm lives", "focus": ["amygdala", "prefrontal", "hippocampus", "hypothalamus"], "notes": {"amygdala": "Detects threat and fires the alarm.", "prefrontal": "Calms the amygdala when danger has passed or was never real.", "hippocampus": "Judges context: is this place safe or dangerous?", "hypothalamus": "Triggers the body's stress response and hormones."}, "caption": "In anxiety disorders the alarm tends to over-respond and the brakes to under-act."}
:::

:::widget conditioning
{"kind": "classical", "title": "How a fear is learned", "caption": "Swap the bell for a dog and the food for a painful bite. After one bad bite, the sight of any dog (the conditioned stimulus) can bring a racing heart (the conditioned response). This is how many specific phobias start. Exposure is extinction in action: meeting dogs again and again with nothing bad happening."}
:::

:::recall
1. Name three biological vulnerabilities to anxiety. || Genes, behavioural inhibition, an over-reactive threat circuit (and CO2 sensitivity in panic).
2. Name three ways fear is learned. || Direct conditioning, watching others, being told.
3. What is anxiety sensitivity? || Fear of anxiety symptoms themselves, believing they are harmful.
:::

:::mcq
Q: In Mowrer's two-factor theory, what maintains a phobia over time?
- Repeated frightening experiences
- *The relief that follows avoidance, which reinforces avoiding
- Genetic factors alone
- Low intelligence
> Fear is learned by conditioning and maintained by avoidance, because escape is rewarding.
:::

## 1.3 Assessing anxiety [core][beginner]
### The questions that matter
- **What exactly is feared?** The content separates the disorders: a panic attack itself, being judged, a specific thing, separation, or many everyday things.
- **How does it start and how fast does it peak?** Panic peaks within minutes; GAD is a background hum.
- **Expected or unexpected?** Attacks only with the feared object point to phobia; attacks out of the blue point to panic disorder.
- **What does the person do?** Avoidance, escape, safety behaviours, reassurance-seeking, checking.
- **How long, and how much does it stop life?**
- **What else?** Depression, alcohol and sedative use, other anxiety disorders, OCD, trauma, suicidal thoughts.
- **What could be causing it in the body?** Thyroid, heart, lungs, medicines, caffeine, withdrawal.

:::word Opening questions
- "When did you last feel completely free of this worry?"
- "Tell me about the last time it happened, from the very beginning."
- "What goes through your mind when your heart races?"
- "Are there places or things you avoid because of this?"
- "What do you do to make yourself feel safer?"
:::

:::widget worked
{"title": "Untangling 'ghabrahat'", "steps": [{"q": "Patient: 'Doctor, ghabrahat hoti hai.' First question?", "a": "'Can you tell me about the last time it happened, from the start?' Let her describe it fully."}, {"q": "She describes a sudden rush of heart pounding, breathlessness and fear of dying, peaking in a few minutes, at home while watching TV. What does that suggest?", "a": "A panic attack, and an unexpected one (no trigger). Next: how often, and does she fear the next one?"}, {"q": "She now avoids going out alone and keeps checking her pulse. What are you asking about next?", "a": "Agoraphobic avoidance and safety behaviours; then mood, alcohol, caffeine, thyroid symptoms, medicines, and suicidal thoughts."}], "yourTurn": [{"q": "Another patient's 'ghabrahat' is a constant restless worry about everything, all day, for a year, with poor sleep and tight muscles. Which disorder does this point to?", "a": "Generalised anxiety disorder: persistent, multi-topic worry with tension, rather than attacks."}]}
:::

:::clinician
### Measures and work-up
- **GAD-7**: cut-offs of 5, 10 and 15 mark mild, moderate and severe anxiety; 10 or more is the usual screening threshold for GAD, and it also picks up panic, social anxiety and PTSD reasonably well.
- **HAM-A** (clinician-rated, 14 items) is the standard outcome in GAD trials. **PDSS** for panic, **LSAS** for social anxiety, **SCARED** in children.
- **Work-up guided by history**: thyroid function, blood glucose, full blood count, ECG (palpitations, chest pain, before some medicines), calcium, and urine drug screen where relevant. Consider asthma or COPD, arrhythmia, pulmonary embolism, phaeochromocytoma (episodic hypertension, headache, sweating) and hypoglycaemia. Ask about caffeine (tea, coffee, energy drinks), salbutamol, steroids, thyroxine, decongestants and stopping alcohol, benzodiazepines or pregabalin.
- Screen for depression and suicidal ideation in every anxious patient; comorbidity raises risk.
:::

:::widget flow
{"title": "Which anxiety disorder? Ask what is feared", "layout": "tree", "nodes": [{"id": "root", "label": "Anxiety that is excessive and impairing", "detail": "First exclude medical and substance causes."}, {"id": "panic", "label": "The attacks themselves, out of the blue", "detail": "Panic disorder.", "parent": "root"}, {"id": "escape", "label": "Places where escape or help is hard", "detail": "Agoraphobia.", "parent": "root"}, {"id": "judged", "label": "Being judged by others", "detail": "Social anxiety disorder.", "parent": "root"}, {"id": "object", "label": "One object or situation", "detail": "Specific phobia.", "parent": "root"}, {"id": "many", "label": "Many everyday matters", "detail": "Generalised anxiety disorder.", "parent": "root"}, {"id": "sep", "label": "Separation from attachment figures", "detail": "Separation anxiety disorder.", "parent": "root"}, {"id": "speak", "label": "Speaking in certain places", "detail": "Selective mutism.", "parent": "root"}]}
:::

:::recall
1. Which question best separates the anxiety disorders? || What exactly is feared.
2. How does the speed of onset help? || Panic peaks within minutes; GAD is a background hum.
3. Give the GAD-7 severity cut-offs. || 5 mild, 10 moderate, 15 severe.
:::

:::mcq
Q: A woman has attacks of intense fear only when she sees a dog. These are best called:
- Unexpected panic attacks, suggesting panic disorder
- *Expected (cued) panic attacks within a specific phobia
- Generalised anxiety
- Agoraphobia
> Attacks tied to a phobic object are expected; panic disorder needs recurrent unexpected attacks.
:::

# Part II · The disorders

## 2.1 Generalised anxiety disorder [core][beginner]
The person with GAD worries about **many things**, most days, and cannot switch it off. The worries are usually about ordinary matters (health, money, family, work, safety) but far out of proportion.

:::widget guess
{"prompt": "For how long must excessive worry be present, more days than not, for a DSM-5-TR diagnosis of GAD?", "min": 0, "max": 24, "unit": "months", "answer": [6, 6], "reveal": "At least 6 months. Short spells of worry after a stressful event do not count, however intense.", "clinician": "DSM-5-TR criterion A: excessive anxiety and worry, more days than not for at least 6 months. ICD-11 requires marked symptoms for at least several months, more days than not."}
:::

:::define DSM-5-TR criteria for GAD (summary)
A. Excessive anxiety and worry about a number of events or activities, **more days than not for at least 6 months**.
B. The person finds the worry **difficult to control**.
C. Associated with **three or more** of six symptoms (only **one** in children): restlessness or feeling keyed up; easy fatigue; difficulty concentrating or mind going blank; irritability; muscle tension; sleep disturbance.
D. Clinically significant distress or impairment.
E. Not due to a substance or medical condition (for example hyperthyroidism).
F. Not better explained by another mental disorder.
:::

:::mnemonic Six GAD symptoms: RFC-IMS
**R**estless, **F**atigued, **C**oncentration poor, **I**rritable, **M**uscle tension, **S**leep poor. Three needed in adults, one in children.
:::

:::widget build
{"vignette": "Mr Kapoor, 52, an accountant in Delhi, says, 'I have always been a worrier, but for the last year it's every day.' He worries that his son will crash his bike, that he will be laid off, that his blood pressure readings mean a stroke, and that the house will be burgled. He knows he worries too much but 'cannot turn it off'. He feels on edge, his neck and shoulders ache, and he lies awake for an hour each night. He is often snappy at home. His concentration at work is fine, and he is not unusually tired. Thyroid tests are normal. He drinks two cups of tea a day.", "rule": "Tick the GAD symptoms present. GAD needs 3 or more of the 6 in adults, with worry that is hard to control, for 6 months.", "symptoms": [{"label": "Restlessness or feeling on edge", "present": true}, {"label": "Easily fatigued", "present": false, "why": "He denies tiredness."}, {"label": "Difficulty concentrating", "present": false, "why": "Work concentration is intact."}, {"label": "Irritability", "present": true, "why": "Snappy at home."}, {"label": "Muscle tension", "present": true, "why": "Neck and shoulder aches."}, {"label": "Sleep disturbance", "present": true, "why": "Lies awake an hour each night."}], "need": 3, "needCore": false, "verdict": "Four of six symptoms, multi-topic worry that is hard to control, for a year, with distress and a normal thyroid. GAD criteria are met. Next: screen for depression, alcohol and sedative use, and ask what he does to cope (reassurance-seeking, checking BP repeatedly)."}
:::

### What GAD worry is like
- **Chained "what ifs"**: "What if my son crashes? Then he'll be in hospital, then we'll lose money, then..."
- **Worry about worry**: "This worrying will make me ill" (Wells calls this type 2 worry).
- Worry often feels **useful** to the person ("If I worry, I'll be prepared"), which keeps it going.

### Course and comorbidity
Onset is gradual, often in early adulthood but at any age; the course is chronic with waxing and waning. Over two-thirds of people with GAD also have another disorder, most often depression or another anxiety disorder.

:::clinician
### ICD-11 and the differential
- **ICD-11** describes GAD as marked symptoms for at least several months, more days than not, with either general apprehension ("free-floating anxiety") or excessive worry about multiple everyday events, plus additional symptoms such as muscle tension, motor restlessness, sympathetic overactivity, nervousness, poor concentration, irritability or sleep disturbance. There is no fixed count.
- **Differentials**: depression (GAD worry is forward-looking; depressive rumination dwells on past failures and worthlessness); OCD (obsessions are intrusive, often odd and ego-dystonic, and neutralised by rituals; GAD worry is about real-life concerns); illness anxiety (one theme: health); hyperthyroidism; caffeine; alcohol or sedative withdrawal. **Check for mixed anxiety and depression**, which ICD-11 recognises as a separate category when neither meets full criteria.
:::

:::widget flow
{"title": "The GAD worry chain", "layout": "chain", "nodes": [{"id": "trigger", "label": "Trigger", "detail": "Son is late home."}, {"id": "whatif", "label": "What if...", "detail": "'What if he crashed?'"}, {"id": "chain", "label": "Chain of catastrophes", "detail": "Hospital, money, family ruin."}, {"id": "tension", "label": "Tension and arousal", "detail": "Restless, tense, cannot sleep."}, {"id": "belief", "label": "Beliefs about worry", "detail": "'Worrying keeps me prepared' (and later 'this worry will harm me')."}, {"id": "repeat", "label": "Worry repeats", "detail": "Uncertainty is never tolerated, so the next trigger starts it again."}]}
:::

:::recall
1. State the duration, control and symptom-count rules for GAD. || More days than not for at least 6 months; worry hard to control; 3 of 6 symptoms (1 in children).
2. List the six associated symptoms. || Restlessness, fatigue, poor concentration, irritability, muscle tension, sleep disturbance.
3. What is type 2 worry? || Worry about worry (for example, "worrying will make me ill").
4. How does GAD worry differ from depressive rumination? || GAD worry looks ahead to possible threats; rumination dwells on past failures and loss.
:::

:::mcq
Q: Which feature is required for GAD in DSM-5-TR?
- Panic attacks
- *Worry that the person finds difficult to control
- Avoidance of public places
- A traumatic event
> Excessive worry, hard to control, for at least 6 months, with 3 of 6 symptoms.
:::

## 2.2 Panic attacks and panic disorder [core][beginner]
A **panic attack** is an abrupt surge of intense fear or discomfort that **peaks within minutes**. It can arise from calm or from an anxious state. Panic attacks are common: many people have one at some point. **Panic disorder** is when attacks come **out of the blue** and the person then lives in fear of the next one.

### The 13 symptoms (four or more needed)
| Body | Mind |
|---|---|
| 1 Palpitations or pounding heart | 11 Derealisation or depersonalisation |
| 2 Sweating | 12 Fear of losing control or "going crazy" |
| 3 Trembling or shaking | 13 Fear of dying |
| 4 Shortness of breath or smothering | |
| 5 Feeling of choking | |
| 6 Chest pain or discomfort | |
| 7 Nausea or abdominal distress | |
| 8 Dizzy, unsteady, light-headed or faint | |
| 9 Chills or heat sensations | |
| 10 Numbness or tingling | |

Culture-specific symptoms (for example tinnitus, neck soreness, headache, uncontrollable screaming or crying) may occur but do not count towards the four. An attack with fewer than four symptoms is a **limited-symptom attack**.

:::widget guess
{"prompt": "After at least one attack, how long must persistent worry about more attacks (or a change in behaviour) last for panic disorder?", "min": 0, "max": 12, "unit": "months", "answer": [1, 1], "reveal": "At least 1 month. Attacks alone are not enough: the person must also worry about further attacks or their meaning, or change their behaviour to avoid them.", "clinician": "DSM-5-TR criterion B: at least one attack followed by 1 month or more of persistent concern about further attacks or their consequences, and/or a significant maladaptive change in behaviour related to the attacks."}
:::

:::define DSM-5-TR panic disorder (summary)
A. **Recurrent unexpected** panic attacks (four or more of 13 symptoms, peaking within minutes).
B. At least one attack followed by **1 month or more** of persistent worry about further attacks or their consequences (heart attack, losing control, going mad), and/or a significant maladaptive change in behaviour (avoiding exercise, unfamiliar places).
C. Not due to a substance or medical condition (for example hyperthyroidism, cardiopulmonary disease).
D. Not better explained by another disorder (attacks only in social situations, with a phobic object, with obsessions, with trauma reminders, or with separation).
:::

:::widget build
{"vignette": "Ritu, 29, a bank officer in Jaipur, was watching TV at home when, suddenly, her heart began to pound, she felt she could not breathe, her chest tightened, her hands tingled, she felt sweaty and shaky, and she was sure she was dying. It peaked within five minutes and settled in twenty. It has happened six times in two months, twice waking her from sleep. Since then she checks her pulse many times a day, avoids climbing stairs fast, and keeps her phone in hand 'to call the ambulance'. ECG, thyroid and blood sugar are normal. She drinks one cup of coffee a day.", "rule": "Tick the panic symptoms present in her attacks. A panic attack needs 4 or more of 13.", "symptoms": [{"label": "Palpitations", "present": true}, {"label": "Sweating", "present": true}, {"label": "Trembling", "present": true}, {"label": "Shortness of breath", "present": true}, {"label": "Choking", "present": false}, {"label": "Chest pain or tightness", "present": true}, {"label": "Nausea", "present": false}, {"label": "Dizziness", "present": false}, {"label": "Tingling", "present": true}, {"label": "Derealisation", "present": false}, {"label": "Fear of dying", "present": true}], "need": 4, "needCore": false, "verdict": "Seven symptoms, peaking within minutes, recurrent and unexpected (including nocturnal attacks), followed by over a month of worry and behaviour change (pulse checking, avoiding exertion). Medical tests are normal. Panic disorder criteria are met. Next: screen for agoraphobia, depression, alcohol and suicidal thoughts."}
:::

:::trap Panic attack is a specifier, not a diagnosis
A panic attack can be added as a specifier to any disorder: "PTSD with panic attacks", "depression with panic attacks". Only **recurrent unexpected** attacks plus a month of fear or behaviour change make **panic disorder**. Panic attacks also signal higher suicide risk across diagnoses, so always ask.
:::

:::widget decide
{"scene": "Ritu's family doctor suggests she 'take an alprazolam whenever an attack comes'. She asks you whether that is a good idea.", "ask": "What is the most accurate guidance to give, as part of an educational discussion she will take back to her doctor?", "choices": [{"label": "'Yes, take it every time; it stops the attack quickly.'", "verdict": "harm", "outcome": "Over months she carries the strip everywhere, takes it more often, and cannot leave home without it.", "why": "As-needed benzodiazepines become a safety behaviour and risk dependence. They prevent the learning that attacks pass on their own."}, {"label": "'Ask your doctor about first-line treatments: CBT for panic, and if needed an SSRI started at a low dose. Short-term benzodiazepine use, if any, should be planned and time-limited.'", "verdict": "best", "outcome": "She starts CBT and a low-dose SSRI. After some weeks the attacks become rare, and she stops checking her pulse.", "why": "CBT and SSRIs are first-line for panic disorder. Benzodiazepines are, at most, a short bridge."}, {"label": "'Medicines never help panic; just ignore it.'", "verdict": "harm", "outcome": "She feels dismissed and keeps going to emergency.", "why": "Wrong: several medicines are effective, and ignoring panic is not a treatment."}]}
:::

:::widget compare
{"title": "Panic attack or heart attack?", "a": {"label": "Panic attack", "points": ["Often younger, often a woman, often with past attacks", "Sharp or stabbing chest discomfort with racing heart, tingling and breathlessness", "Comes on suddenly and peaks within minutes", "Strong fear of dying, losing control or going mad", "ECG and heart blood tests come back normal"], "summary": "Panic: sudden, peaks in minutes, settles within the hour, with normal heart tests."}, "b": {"label": "Heart attack", "points": ["Older, or with diabetes, smoking, high blood pressure or high cholesterol", "Crushing or heavy central chest pain, which may spread to the left arm, jaw or back", "Often brought on by exertion, and does not settle within minutes", "Sweating, nausea and breathlessness; fear may or may not be present", "ECG changes and a rise in heart enzymes (troponin)"], "summary": "Heart attack: heavy pain that persists, with risk factors and abnormal tests. It is an emergency."}, "caption": "Features overlap. When in doubt, rule out the heart first: an ECG costs little, and a missed heart attack can kill. Panic is diagnosed once medical causes are excluded, not before."}
:::

:::recall
1. How quickly does a panic attack peak? || Within minutes.
2. How many of the 13 symptoms are needed? || Four.
3. What two things make panic disorder rather than panic attacks? || Recurrent unexpected attacks plus at least a month of worry about further attacks or behaviour change.
4. What is a limited-symptom attack? || An attack with fewer than four symptoms.
:::

:::mcq
Q: Which fact best supports panic disorder over a specific phobia?
- Attacks occur only on seeing snakes
- *Attacks occur unexpectedly, including from sleep
- Attacks last several hours
- Attacks are always triggered by social situations
> Panic disorder needs recurrent unexpected attacks.
:::

## 2.3 Agoraphobia [core][beginner]
In agoraphobia the person fears and avoids situations where **escape might be difficult or help unavailable** if panic-like or embarrassing symptoms occurred (for example fainting, losing bladder control, falling in the elderly).

:::define DSM-5-TR agoraphobia: the five situations (two or more needed)
1. Using public transport (buses, trains, autos, planes)
2. Being in open spaces (car parks, markets, bridges)
3. Being in enclosed places (shops, cinemas, malls)
4. Standing in a queue or being in a crowd
5. Being outside the home alone
:::

The situations almost always provoke fear; they are avoided, endured with intense fear, or need a companion. The fear is out of proportion to the real danger and the sociocultural context, lasts typically 6 months or more, and causes impairment. Agoraphobia is diagnosed **with or without panic disorder**; if both are present, give both diagnoses.

:::widget sort
{"prompt": "Agoraphobia, social anxiety or specific phobia? The deciding question is: what does the person fear will happen?", "buckets": ["Agoraphobia", "Social anxiety", "Specific phobia"], "items": [{"text": "Avoids the mall and buses because she might faint and nobody could help", "bucket": 0}, {"text": "Avoids the mall because people might watch her and think she is odd", "bucket": 1}, {"text": "Avoids only lifts, because of fear of being trapped in one", "bucket": 2, "why": "One situation only: specific phobia, situational type. Agoraphobia needs two or more of the five situations."}, {"text": "Will only go to the temple and market with her husband, fearing a panic attack", "bucket": 0}, {"text": "Avoids eating at weddings in case his hands shake and people notice", "bucket": 1}]}
:::

:::note Culture and companionship
In many Indian families women go out accompanied as a social norm, and elders are rarely alone. "Requires a companion" counts only when it is driven by fear of panic-like symptoms and is out of keeping with the person's usual habits and culture.
:::

:::widget timeline
{"prompt": "How does agoraphobia usually build up after panic? Put the steps in order.", "events": [{"label": "A first, unexpected panic attack in a crowded bus"}, {"label": "Worry about when the next attack will strike"}, {"label": "Avoiding buses and crowded markets"}, {"label": "Going out only with a trusted companion"}, {"label": "Rarely leaving home at all"}], "why": "Agoraphobia often grows out of fear of panic. Each avoided place makes the safe zone smaller, until in severe cases the person is housebound. Agoraphobia can also occur without any panic attacks."}
:::

:::recall
1. Name the five agoraphobic situations. || Public transport, open spaces, enclosed places, queues or crowds, being outside alone.
2. What is the central fear in agoraphobia? || That escape would be difficult or help unavailable if panic-like or embarrassing symptoms occurred.
3. Can agoraphobia be diagnosed without panic disorder? || Yes; and if both are present, both are diagnosed.
:::

:::mcq
Q: A woman avoids buses, markets and queues and goes out only with her son, fearing she will faint with no help nearby. She has no panic attacks. The diagnosis to consider is:
- Panic disorder
- *Agoraphobia
- Social anxiety disorder
- Specific phobia, situational
> Two or more of the five situations, feared because escape or help would be difficult.
:::

## 2.4 Social anxiety disorder [core][beginner]
The core fear is of **scrutiny**: being watched, judged, embarrassed or rejected. The person fears they will act in a way, or show anxiety symptoms (blushing, shaking, sweating), that will be negatively evaluated.

:::define DSM-5-TR social anxiety disorder (summary)
Marked fear about social situations with possible scrutiny (conversations, meeting strangers, being observed eating or drinking, performing); fear of negative evaluation; the situations almost always provoke fear and are avoided or endured with intense fear; out of proportion to the real threat and the sociocultural context; typically 6 months or more; impairment. In children the anxiety must occur with peers, not only with adults. **Specify "performance only"** if the fear is limited to speaking or performing in public.
:::

:::widget decide
{"scene": "Karthik, 22, an engineering graduate from Chennai, has turned down three job offers because each involved team meetings. He eats lunch alone in his car, rehearses every sentence before speaking, and avoids eye contact. His father says, 'He is just shy, he will grow out of it.'", "ask": "How do you view this?", "choices": [{"label": "Agree it is shyness and advise patience", "verdict": "harm", "outcome": "Two years later he is still unemployed, drinking each evening, and increasingly low.", "why": "Shyness does not cost three job offers. Untreated social anxiety often leads to depression and alcohol misuse."}, {"label": "Recognise probable social anxiety disorder: marked, persistent fear of scrutiny with avoidance and real impairment. Assess for depression and alcohol use, and recommend CBT for social anxiety", "verdict": "best", "outcome": "After CBT, including dropping his rehearsing and eye-avoidance, he accepts a job and starts joining colleagues for lunch.", "why": "Impairment separates the disorder from shyness. Cognitive therapy for social anxiety is the most effective treatment."}, {"label": "Tell him to have a drink before meetings to relax", "verdict": "harm", "outcome": "He drinks more and more to cope; the anxiety returns stronger.", "why": "Alcohol is a common, dangerous self-treatment in social anxiety."}]}
:::

:::note Cultural forms
**Taijin kyofusho** (Japan and Korea) is a fear of offending or making **others** uncomfortable (by one's gaze, blushing or body odour), rather than fear of embarrassing oneself. It shows how culture shapes the focus of social fear. In India, fear of bringing shame on the family, rather than on oneself, may be prominent.
:::

:::clinician
### Differentials and safety behaviours
- **Avoidant personality disorder** overlaps heavily; it is more pervasive, with a lifelong sense of inadequacy.
- **Autism**: limited social interest or skill, not fear of evaluation.
- **Body dysmorphic disorder**: fear is about a perceived flaw in appearance.
- **Agoraphobia**: fear is of being unable to escape, not of being judged.
- Typical safety behaviours: rehearsing sentences, avoiding eye contact, gripping a glass tightly, wearing high collars to hide blushing, monitoring oneself. They keep attention on the self, make the person look odd, and prevent disconfirmation. Removing them is central to cognitive therapy.
:::

:::recall
1. What is the core fear in social anxiety disorder? || Negative evaluation by others: embarrassment, humiliation, rejection.
2. What is the "performance only" specifier? || Fear restricted to speaking or performing in public.
3. In children, where must the anxiety occur? || With peers, not only with adults.
4. What is taijin kyofusho? || A culturally shaped fear of offending or discomforting others by one's appearance or behaviour.
:::

:::mcq
Q: A professional singer becomes terrified only when performing on stage; she is relaxed in all other social situations. This is:
- Generalised anxiety disorder
- *Social anxiety disorder, performance only
- Agoraphobia
- Specific phobia
> Fear restricted to performing or speaking in public.
:::

## 2.5 Specific phobia [core][beginner]
A marked, out-of-proportion fear of one object or situation, which almost always provokes immediate fear and is avoided or endured with intense fear, typically lasting 6 months or more. In children, fear may show as crying, tantrums, freezing or clinging.

### The five types
| Type | Examples |
|---|---|
| Animal | Dogs, snakes, spiders, insects, lizards |
| Natural environment | Heights, storms, water |
| Blood-injection-injury | Blood, injections, medical procedures, injury |
| Situational | Planes, lifts, enclosed spaces, driving, tunnels |
| Other | Choking, vomiting; in children, loud sounds or costumed characters |

Most people with a specific phobia fear more than one thing; the average is about three.

:::trap Blood-injection-injury is different
Most phobias raise heart rate and blood pressure. In blood-injection-injury phobia, a brief rise is followed by a sudden **drop** in heart rate and blood pressure (a vasovagal response), so people may **faint**. That is why relaxation is the wrong tool here. **Applied tension**, tensing the muscles of the arms, legs and trunk to keep blood pressure up, is used instead, combined with exposure.
:::

:::widget worked
{"title": "Building a fear ladder for a dog phobia", "steps": [{"q": "Rate fear from 0 (none) to 100 (worst). What goes at the bottom?", "a": "Looking at photos of puppies: 20."}, {"q": "Middle rungs?", "a": "Watching a video of a dog barking: 40. Standing across the road from a leashed dog: 55. Standing three metres from a calm, leashed dog: 70."}, {"q": "Top rungs?", "a": "Touching a calm dog's back while the owner holds it: 85. Walking past a street dog: 95."}, {"q": "How is each step done?", "a": "Stay in the situation, without safety behaviours, until the fear clearly drops or the feared outcome fails to happen. Repeat until the step is easy, then move up. Daily practice works better than weekly."}], "yourTurn": [{"q": "Write the first three rungs of a ladder for a fear of injections.", "a": "For example: look at a picture of a syringe (20); hold a capped syringe (40); watch a video of a blood test (55). Use applied tension if faintness occurs."}]}
:::

:::recall
1. Name the five types of specific phobia. || Animal, natural environment, blood-injection-injury, situational, other.
2. Why is applied tension used in blood-injection-injury phobia? || It prevents the vasovagal drop in blood pressure that causes fainting.
3. What is a fear ladder? || A graded list of feared situations, rated 0 to 100, climbed step by step during exposure.
:::

:::mcq
Q: A student faints during blood tests and has avoided medical care for years. The specific technique to add to exposure is:
- Slow breathing and relaxation
- *Applied tension
- A sedative before each test
- Distraction only
> Blood-injection-injury phobia causes a vasovagal drop; tensing muscles counters it.
:::

## 2.6 Separation anxiety and selective mutism [core][beginner]
### Separation anxiety disorder
Developmentally inappropriate, excessive fear about separation from attachment figures, shown by **three or more** of eight features:
1. Excessive distress when separation is anticipated or happens
2. Persistent worry about losing attachment figures or harm to them
3. Worry about an event (getting lost, kidnapped, an accident) that would cause separation
4. Reluctance or refusal to go out, to school or work, because of fear of separation
5. Fear of being alone without attachment figures
6. Reluctance to sleep away from home or without the attachment figure near
7. Nightmares about separation
8. Physical complaints (headache, stomach ache, vomiting) when separation happens or is expected

:::widget guess
{"prompt": "In children and adolescents, for how long must separation anxiety last to meet DSM-5-TR criteria?", "min": 0, "max": 26, "unit": "weeks", "answer": [4, 4], "reveal": "At least 4 weeks in children and adolescents, and typically 6 months or more in adults. Some clinginess when starting school is normal and passes.", "clinician": "DSM-5-TR criterion B: at least 4 weeks in children and adolescents and typically 6 months or more in adults."}
:::

It can begin in adulthood: an adult may phone their spouse or child many times a day, be unable to travel, or panic when family members are late. School refusal in children often has separation anxiety underneath, but can also reflect bullying, learning difficulty, depression or social anxiety.

### Selective mutism
Consistent failure to speak in specific social situations where speech is expected (such as school), despite speaking elsewhere, for at least **1 month** (not just the first month of school). It must interfere with education or social communication, and must not be explained by lack of familiarity with the language, a communication disorder, autism or psychosis. It is strongly linked to social anxiety.

:::widget decide
{"scene": "Ananya, 7, moved from a Marathi-medium school in Nashik to an English-medium school in Mumbai two months ago. She has not spoken in class. Her teacher thinks she has selective mutism. At home she chatters in Marathi.", "ask": "What is the most important next question?", "choices": [{"label": "Does she understand and speak English, the language expected at school?", "verdict": "best", "outcome": "She understands little English yet. With language support and a warm buddy, she starts speaking in short English phrases.", "why": "Selective mutism cannot be diagnosed if silence is due to lack of knowledge of, or comfort with, the language required."}, {"label": "None; diagnose selective mutism and start treatment", "verdict": "harm", "outcome": "She is labelled and pulled out for 'therapy'; her real need, language support, is missed.", "why": "Exclusion criteria matter. Newly bilingual children often go through a normal silent period."}, {"label": "Does she have autism?", "verdict": "ok", "outcome": "Reasonable to consider later, but she plays and talks normally at home, so it is not the first question.", "why": "Autism is a differential, but the language question comes first here."}]}
:::

:::recall
1. How many of the eight features are needed for separation anxiety disorder, and for how long in children? || Three; at least 4 weeks.
2. Can separation anxiety disorder start in adults? || Yes.
3. Give the duration and two exclusions for selective mutism. || At least 1 month (not the first month of school); not due to language unfamiliarity, a communication disorder, autism or psychosis.
:::

:::mcq
Q: Which is the best predictor that a child's school refusal is due to separation anxiety?
- She fears a particular bully
- *She is fine at school if her mother stays, and has stomach aches each morning before leaving her
- She cannot read
- She refuses only on test days
> Distress and body symptoms tied to separation from the attachment figure point to separation anxiety.
:::

## 2.7 Medical and substance causes [core][beginner]
Before diagnosing an anxiety disorder, ask: **could the body or a substance be doing this?** DSM-5-TR uses two diagnoses for this: anxiety disorder due to another medical condition, and substance- or medication-induced anxiety disorder.

| Group | Examples |
|---|---|
| Endocrine | Hyperthyroidism, hypoglycaemia (including insulinoma), phaeochromocytoma, Cushing's, hypoparathyroidism (low calcium) |
| Heart and lungs | Arrhythmias (supraventricular tachycardia), angina, heart failure, asthma, COPD, pulmonary embolism |
| Neurological | Temporal lobe epilepsy, vestibular disorders, early dementia, Parkinson's disease |
| Other | Anaemia, vitamin B12 deficiency, porphyria |
| Intoxication | Caffeine (tea, coffee, colas, energy drinks), nicotine, cannabis, amphetamines, cocaine |
| Withdrawal | Alcohol, benzodiazepines, pregabalin, opioids, nicotine |
| Medicines | Salbutamol, theophylline, steroids, thyroxine (excess), decongestants (pseudoephedrine), SSRIs early in treatment, akathisia from antipsychotics |

:::trap Red flags for a medical cause
Onset after about 45 with no previous history; no family history; no clear psychological trigger; physical signs (weight loss, tremor, fever, high blood pressure); episodes with confusion or loss of awareness; poor response to standard treatment.
:::

:::widget sort
{"prompt": "For each person, is a medical or substance cause likely enough that it should be checked first?", "buckets": ["Check body or substance first", "A primary anxiety disorder is more likely"], "items": [{"text": "A 60-year-old man with new attacks of sweating, headache and very high blood pressure", "bucket": 0, "why": "Episodic hypertension with headache and sweating suggests phaeochromocytoma."}, {"text": "A 25-year-old woman with weight loss, heat intolerance, tremor and a fast pulse at rest", "bucket": 0, "why": "Classic hyperthyroidism."}, {"text": "A 22-year-old student who has feared public speaking since school", "bucket": 1}, {"text": "A 40-year-old on a new asthma inhaler, now shaky and anxious", "bucket": 0}, {"text": "A 35-year-old who stopped his daily alcohol two days ago, now tremulous and panicky", "bucket": 0, "why": "Alcohol withdrawal can be dangerous: assess urgently."}, {"text": "A 19-year-old with dog phobia since a bite at age eight", "bucket": 1}]}
:::

:::widget flow
{"title": "New anxiety in a 50-year-old: what to rule out", "layout": "tree", "nodes": [{"id": "r", "label": "First anxiety in mid-life, no past history", "detail": "Late first onset is a red flag for a physical or substance cause."}, {"id": "m", "label": "Medical cause?", "detail": "Check the body first.", "parent": "r"}, {"id": "s", "label": "Substance cause?", "detail": "Ask about what is taken, and what was recently stopped.", "parent": "r"}, {"id": "p", "label": "Another mental disorder?", "detail": "Anxiety is often a feature of something else.", "parent": "r"}, {"id": "m1", "label": "Overactive thyroid", "detail": "Weight loss, tremor, heat intolerance, fast pulse.", "parent": "m"}, {"id": "m2", "label": "Heart rhythm problems, low blood sugar, asthma or COPD", "detail": "Palpitations with an irregular pulse; attacks related to missed meals or insulin; breathlessness.", "parent": "m"}, {"id": "s1", "label": "Caffeine, steroids, salbutamol, thyroxine", "detail": "Ask about tea, coffee and energy drinks too.", "parent": "s"}, {"id": "s2", "label": "Alcohol or benzodiazepine withdrawal", "detail": "Morning shakes and anxiety that improve after a drink.", "parent": "s"}, {"id": "p1", "label": "Depression", "detail": "The commonest cause of new anxiety in mid-life; ask about mood and sleep.", "parent": "p"}, {"id": "p2", "label": "Early dementia or psychosis", "detail": "Anxiety can be the first sign; check cognition and look for odd beliefs.", "parent": "p"}], "caption": "Only when all three branches are checked can a primary anxiety disorder be diagnosed."}
:::

:::recall
1. Name four endocrine causes of anxiety. || Hyperthyroidism, hypoglycaemia, phaeochromocytoma, hypoparathyroidism (and Cushing's).
2. Name four medicines that can cause anxiety. || Salbutamol, steroids, thyroxine excess, decongestants (also theophylline, SSRIs early on).
3. Give three red flags for a medical cause. || Late onset, no past or family history, physical signs, confusion, poor response to treatment.
:::

:::mcq
Q: Which history most strongly suggests a substance-induced anxiety state?
- Anxiety since childhood
- *Anxiety beginning after drinking four energy drinks a day during exam preparation
- A family history of panic
- Fear of dogs after a bite
> High caffeine intake is a common, missed cause.
:::

## 2.8 The models that guide treatment [core][beginner]
Treatment works best when it targets what **keeps** anxiety going. Each disorder has a model.

### Clark's cognitive model of panic
Panic happens when normal body sensations are **misinterpreted as catastrophic**. The cycle:
1. A trigger (exercise, coffee, a stuffy room, a worrying thought)
2. Perceived threat
3. Anxiety
4. Body sensations (racing heart, breathlessness, dizziness)
5. **Catastrophic misinterpretation** ("I'm having a heart attack")
6. More anxiety, more sensations, round and round, until panic
Avoidance and safety behaviours (sitting down, holding on, carrying water) stop the person discovering that the catastrophe would not happen.

:::widget worked
{"title": "Draw Ritu's vicious circle", "steps": [{"q": "Trigger?", "a": "Climbing stairs quickly at the office."}, {"q": "Sensation?", "a": "Heart pounding and slight breathlessness (normal after stairs)."}, {"q": "Catastrophic interpretation?", "a": "'My heart is failing. I'm going to collapse.'"}, {"q": "What happens next?", "a": "Anxiety rises, so the heart pounds more and breathing gets faster, which seems to confirm the belief. Panic follows."}, {"q": "What keeps it going between attacks?", "a": "She avoids stairs and exercise (so never learns her heart copes), checks her pulse (which keeps attention on her heart), and keeps her phone ready (crediting it for her survival)."}]}
:::

### Clark and Wells: social anxiety
In social situations, attention turns **inward** to a distorted image of how one looks ("I'm bright red and shaking"). The person uses safety behaviours, which make them look odd and prevent disconfirmation, and they replay the event afterwards (post-event processing).

:::widget conditioning
{"kind": "operant", "title": "Why avoidance is so hard to give up", "caption": "The rat gets food for pressing: something pleasant is added. Avoidance works by negative reinforcement: something unpleasant (anxiety) is taken away. Each time the person escapes the shop, the fear drops at once, and the escape is learned more strongly. This is the second factor in Mowrer's two-factor theory, and why exposure means staying."}
:::

:::widget flow
{"title": "Clark and Wells: what keeps social anxiety going", "layout": "cycle", "nodes": [{"id": "sit", "label": "Social situation", "detail": "Speaking up in a seminar."}, {"id": "thr", "label": "Perceived danger", "detail": "'They will see I am nervous and think I am stupid.'"}, {"id": "self", "label": "Self-focused attention", "detail": "Attention turns inward to a distorted image of how she looks, so she misses the friendly faces."}, {"id": "safe", "label": "Safety behaviours", "detail": "Rehearsing sentences, avoiding eye contact, holding the cup tightly. These make her seem distant and stop her learning the truth."}, {"id": "sym", "label": "Anxiety symptoms", "detail": "Blushing and a shaky voice, which she takes as proof that people can see her fear."}], "edgeLabels": {"self>safe": "she protects herself", "safe>sym": "symptoms grow"}, "caption": "Treatment targets the loop: drop safety behaviours, shift attention outward, and use video feedback to correct the self-image."}
:::

### GAD models
- **Avoidance model (Borkovec)**: worry is verbal and abstract; it damps down vivid images and body arousal, so it is rewarded, but it blocks emotional processing.
- **Intolerance of uncertainty (Dugas)**: people with GAD find uncertainty unbearable and worry to try to prepare for every possibility.
- **Metacognitive model (Wells)**: positive beliefs about worry ("worry keeps me prepared") start it; negative beliefs ("worry is dangerous and uncontrollable", type 2 worry) turn it into a disorder.

### What all the models share
| Maintaining factor | What it does | What treatment does |
|---|---|---|
| Threat overestimation | Danger feels likely and severe | Tests predictions against reality |
| Avoidance | Prevents learning | Graded exposure |
| Safety behaviours | Person credits the behaviour for survival | Drop them during exposure |
| Self-focused attention | Feeds the sense of being visibly anxious | Attention training, video feedback |
| Worry and reassurance-seeking | Short relief, long-term maintenance | Reduce, test beliefs about worry |

:::widget flow
{"title": "Clark's vicious circle of panic", "layout": "cycle", "nodes": [{"id": "trig", "label": "Trigger", "detail": "Stairs, coffee, a stuffy room, a worrying thought."}, {"id": "threat", "label": "Perceived threat", "detail": "Something feels wrong."}, {"id": "anx", "label": "Anxiety", "detail": "Apprehension rises."}, {"id": "sens", "label": "Body sensations", "detail": "Pounding heart, breathlessness, dizziness."}, {"id": "cat", "label": "Catastrophic misinterpretation", "detail": "'I'm having a heart attack.'"}], "caption": "Each turn of the circle raises the sensations that seem to confirm the catastrophe."}
:::

:::recall
1. What is the key step in Clark's model of panic? || Catastrophic misinterpretation of normal body sensations.
2. In Clark and Wells' model, where does attention go in social situations? || Inward, to a distorted self-image.
3. Name three models of GAD. || Avoidance (Borkovec), intolerance of uncertainty (Dugas), metacognitive (Wells).
4. Why do safety behaviours maintain anxiety? || The person credits the behaviour for preventing disaster and never learns it would not have happened.
:::

:::mcq
Q: In Clark's model, which belief would most likely maintain panic?
- "My heart races because I climbed stairs"
- *"My racing heart means I'm about to have a heart attack"
- "Anxiety is uncomfortable but harmless"
- "I can cope with this feeling"
> The catastrophic interpretation of sensations drives the spiral.
:::
`;
