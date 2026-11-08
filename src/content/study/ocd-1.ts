/* Module · OCD and related disorders, Parts 0 and I (Starting level, OCD). Original text written for VIBHA School of Psychology. */
export const part1 = String.raw`
# Part 0 · Starting: OCD in plain words

## 0.1 Everyone has strange thoughts [core][starting]
Have you ever stood on a high balcony and had a sudden thought: "What if I jumped?" Or held a baby and thought, "What if I dropped her?" Or sat in a temple and had a rude word pop into your mind?

These are **intrusive thoughts**: unwanted thoughts, images or urges that arrive uninvited. They are not wishes. They are not plans. They are the brain's random noise, often about the very things we care about most.

:::widget guess
{"prompt": "In a study of university students across 13 countries, out of every 100 people, how many reported having had at least one unwanted intrusive thought in the previous three months?", "min": 0, "max": 100, "unit": "in 100", "answer": [90, 97], "reveal": "About 94 in 100. Intrusive thoughts about harm, sex, religion, contamination or accidents are almost universal. What makes OCD different is not having the thoughts, but how a person reacts to them.", "clinician": "An international study across six continents (2014) found about 94% of participants reported at least one unwanted intrusive thought in the past three months, with content similar to clinical obsessions; Rachman and de Silva's earlier work in the 1970s found similar results."}
:::

### Why some thoughts get stuck
Most people notice a strange thought, think "that was odd", and move on. The thought fades.

A person who goes on to develop OCD reacts differently:
- "Having this thought means I am a bad person."
- "If I think it, it might happen."
- "I must get rid of it, or something terrible will happen, and it will be my fault."

That reaction makes the thought feel dangerous. The more we try to push a thought away, the more it comes back. (Try not to think of a white elephant for the next ten seconds.)

:::analogy A spam email
An intrusive thought is like a spam email. Most people see it, recognise it as junk and delete it without opening it. In OCD, the person opens every spam email, reads it carefully, worries it might be real, replies to it, and forwards it to friends for advice. The inbox fills with more spam.
:::

:::widget sort
{"prompt": "Is each reaction to an intrusive thought more likely to let it fade, or make it stick?", "buckets": ["Lets it fade", "Makes it stick"], "items": [{"text": "\"That's a weird thought. Anyway...\"", "bucket": 0}, {"text": "\"Only a terrible person would think that. I must be evil.\"", "bucket": 1}, {"text": "Praying ten times to cancel the thought", "bucket": 1, "why": "A ritual to 'undo' the thought teaches the brain the thought was dangerous."}, {"text": "Noticing the thought and carrying on with what you were doing", "bucket": 0}, {"text": "Asking your mother again and again, 'Am I a good person?'", "bucket": 1}, {"text": "Trying hard never to think it again", "bucket": 1, "why": "Suppressing a thought tends to bring it back more often."}]}
:::

:::widget flow
{"title": "Two paths for the same thought", "layout": "tree", "nodes": [{"id": "thought", "label": "Intrusive thought", "detail": "\"What if I pushed someone off the platform?\""}, {"id": "ignore", "label": "\"That's a weird thought\"", "detail": "Noticed and let go.", "parent": "thought"}, {"id": "fade", "label": "Thought fades", "detail": "It has no special meaning, so it passes.", "parent": "ignore"}, {"id": "meaning", "label": "\"Having this thought means I'm dangerous\"", "detail": "The thought is given meaning and importance.", "parent": "thought"}, {"id": "fight", "label": "Fighting the thought", "detail": "Pushing it away, checking, praying to cancel it.", "parent": "meaning"}, {"id": "stick", "label": "Thought returns more often", "detail": "Suppression and rituals make it stick.", "parent": "fight"}]}
:::

:::recall
1. What is an intrusive thought? || An unwanted thought, image or urge that arrives uninvited; not a wish or plan.
2. Roughly how common are intrusive thoughts? || Almost universal: over 9 in 10 people report them.
3. What turns an ordinary intrusive thought into a problem? || The meaning given to it (bad, dangerous, my fault) and the efforts to get rid of it.
:::

:::mcq
Q: Sunil, a loving new father, has a sudden image of hurting his baby. He is horrified. What is the most accurate statement?
- He secretly wants to hurt the baby
- He is dangerous and should be kept away
- *Unwanted harm thoughts are common and do not show intent; his horror shows the thought goes against his values
- He has schizophrenia
> Intrusive harm thoughts are common, especially in new parents, and are ego-dystonic.
:::

## 0.2 What OCD is [core][starting]
**Obsessive-compulsive disorder (OCD)** has two parts:
- **Obsessions**: intrusive thoughts, images or urges that keep coming back, feel unwanted and cause strong anxiety, disgust or a sense that something is "not right".
- **Compulsions**: things the person feels driven to do, in their actions or in their head, to reduce the distress or prevent something bad. Washing, checking, counting, repeating, praying in a fixed way, seeking reassurance.

### The OCD cycle
1. **Obsession**: "My hands are contaminated. I might make my family ill."
2. **Anxiety**: strong fear and disgust.
3. **Compulsion**: wash hands for 20 minutes in a fixed way.
4. **Relief**: anxiety falls for a while.
5. The relief teaches the brain that washing was necessary, so the next obsession comes back stronger, and the cycle repeats.

:::example Two people, two meanings
**Divya**, 24, from Pune, likes a neat desk and gets slightly annoyed if a pen is crooked. She calls herself "so OCD". She is not: she enjoys her neatness and it costs her nothing.

**Imtiaz**, 31, from Srinagar, spends four hours a day washing after touching anything "unclean". His hands crack and bleed. He has lost his job and knows the washing makes no sense, but cannot stop. That is OCD.
:::

:::trap "I'm so OCD"
People use "OCD" casually for liking order. Real OCD is distressing and disabling: the thoughts are unwanted, the rituals are hard to resist, and they eat into life. Using the word lightly can make people with real OCD feel unseen.
:::

:::widget decide
{"scene": "Your hostel roommate Shalini, 20, checks that the door is locked twenty times before sleeping and is late for every class because she goes back to check the gas. She asks you, 'Can you just tell me it's locked? Then I can sleep.'", "ask": "What is the most helpful way to respond over time?", "choices": [{"label": "Always reassure her: 'Yes, it's locked, I checked.'", "verdict": "ok", "outcome": "She sleeps that night. Within a month she asks you five times a night, and you both lose sleep.", "why": "Reassurance is kind but works like a compulsion. It brings brief relief and makes the need grow."}, {"label": "Mock her: 'Stop being so mental.'", "verdict": "harm", "outcome": "She feels ashamed and hides her checking. The problem gets worse in secret.", "why": "Shame makes people hide OCD and delays help."}, {"label": "Tell her you care, that the checking seems to be taking over, and encourage her to see the college counsellor; later, with her agreement, gently reduce how much reassurance you give", "verdict": "best", "outcome": "She sees a psychologist and starts treatment. Together you agree a plan to stop answering 'is it locked?' questions.", "why": "Caring support plus professional help, and slowly reducing reassurance, helps break the cycle."}]}
:::

:::widget flow
{"title": "The OCD cycle", "layout": "cycle", "nodes": [{"id": "obs", "label": "Obsession", "detail": "\"My hands are contaminated; my family could get ill.\""}, {"id": "anx", "label": "Anxiety or disgust", "detail": "Distress rises sharply."}, {"id": "comp", "label": "Compulsion", "detail": "Washing in a fixed way for 20 minutes."}, {"id": "relief", "label": "Short relief", "detail": "Distress falls for a while."}, {"id": "learn", "label": "The brain learns", "detail": "\"Washing was needed.\" The next obsession comes back stronger."}], "caption": "Exposure and response prevention breaks the loop between anxiety and compulsion."}
:::

:::widget conditioning
{"kind": "operant", "title": "Why the compulsion gets stronger", "caption": "In the box, pressing is rewarded by adding food. In OCD, washing is rewarded by taking anxiety away (negative reinforcement). Each wash that brings relief makes the next wash more likely. Exposure and response prevention removes that reward: the person faces the trigger and does not wash, and learns that the anxiety falls on its own."}
:::

:::recall
1. Define obsessions and compulsions in plain words. || Obsessions: unwanted, repeated, distressing thoughts or images. Compulsions: actions or mental acts done to reduce the distress or prevent harm.
2. Describe the OCD cycle. || Obsession, anxiety, compulsion, relief; relief reinforces the compulsion and the obsession returns.
3. Why does reassurance often make OCD worse? || It works like a compulsion: brief relief, then a stronger need.
:::

:::mcq
Q: Which most suggests OCD rather than a neat personality?
- Enjoying a tidy room
- Making a to-do list every day
- *Spending three hours a day redoing tasks until they feel "just right", while wishing she could stop
- Liking books arranged by colour
> Distress, time lost and unwanted rituals separate OCD from preference.
:::

## 0.3 What OCD is about [core][starting]
OCD can attach to almost anything, but some themes are very common.
| Theme | Typical obsession | Typical compulsion |
|---|---|---|
| Contamination | Germs, dirt, body fluids, chemicals, "impurity" | Washing, cleaning, avoiding touching |
| Harm and checking | "Did I leave the gas on? Did I hit someone with my car?" | Checking, retracing routes, asking for reassurance |
| Symmetry and "just right" | Things must be even, ordered or feel complete | Arranging, repeating until it feels right, counting |
| Forbidden thoughts | Unwanted sexual, violent or blasphemous thoughts | Mental rituals: praying, cancelling thoughts, confessing |
| Doubt and responsibility | "If something goes wrong it will be my fault" | Checking, confessing, seeking certainty |

### Rituals in the head
Not all compulsions can be seen. Many people perform **mental rituals**: repeating a phrase, counting, praying in a fixed way, replacing a "bad" thought with a "good" one, going over events again and again. Some people seem to have "only obsessions" because their rituals are silent.

### OCD in Indian settings
- **Purity and pollution**: fears of being "impure" after touching certain people, things or places, or during menstruation, with long bathing or washing of clothes.
- **Religious scrupulosity**: fear of having made a mistake in prayer or puja, fear of sinning or offending God, repeating rituals until they feel perfect.
- **Family involvement**: in joint families, many people may be drawn into the rituals.

:::widget sort
{"prompt": "Which OCD theme is each example?", "buckets": ["Contamination", "Harm and checking", "Symmetry", "Forbidden thoughts"], "items": [{"text": "Re-bathes three times if she touches a shoe", "bucket": 0}, {"text": "Drives back along the road to make sure he didn't hit anyone", "bucket": 1}, {"text": "Must place her slippers exactly parallel, or she cannot sleep", "bucket": 2}, {"text": "Horrified by an image of shouting abuse at a deity, so prays silently to cancel it", "bucket": 3}, {"text": "Checks the stove knobs ten times before leaving", "bucket": 1}, {"text": "Washes vegetables with soap for an hour", "bucket": 0}]}
:::

:::note Religion is not the problem
Religious practice is not OCD. In scrupulosity, the person is tormented by fear of doing it wrong, repeats rituals far beyond what their faith asks, and gets no peace from them. Religious leaders often recognise this and can be helpful partners in treatment.
:::

:::widget layers
{"title": "What you can see, and what you can't", "shape": "iceberg", "layers": [{"label": "Visible rituals", "detail": "Washing, checking, arranging, repeating actions."}, {"label": "Reassurance-seeking", "detail": "Asking others again and again; often noticed only by family."}, {"label": "Mental rituals", "detail": "Counting, praying, cancelling 'bad' thoughts, reviewing events."}, {"label": "Avoidance", "detail": "Quietly steering clear of people, places and objects."}, {"label": "The obsessions", "detail": "The unwanted thoughts and doubts that drive everything above."}], "caption": "Much of OCD sits below the surface, which is why direct, kind questions matter."}
:::

:::recall
1. Name four common OCD themes. || Contamination, harm and checking, symmetry, forbidden thoughts (also doubt and responsibility).
2. What is a mental ritual? || A compulsion done in the mind: counting, praying, cancelling thoughts, reviewing.
3. What is religious scrupulosity? || OCD about religious or moral matters: fear of sin or mistakes in ritual, with excessive repetition.
:::

:::mcq
Q: Meena repeats a short prayer silently every time she has an unwanted blasphemous thought. Her prayer is best called:
- A delusion
- *A mental compulsion
- Normal faith
- A hallucination
> Silent rituals performed to neutralise an obsession are compulsions.
:::

## 0.4 How OCD pulls in the family [core][starting]
OCD rarely stays inside one person. Families get drawn in, out of love and to keep the peace. This is called **family accommodation**:
- Answering the same reassurance questions again and again.
- Washing their own hands or changing clothes when asked.
- Waiting while rituals are done; doing tasks for the person.
- Avoiding certain words, places or objects.
- Buying extra soap, sanitiser or cleaning products.

Accommodation reduces fights and distress in the short term. In the long run it keeps OCD going, just like reassurance. Families also feel exhausted, angry and guilty.

:::widget decide
{"scene": "Rajeev, 16, from Lucknow, insists that his parents change clothes and wash for 15 minutes when they come home, or he screams and cries. His mother, Sunita, now does this every evening 'to keep the peace'. His father has started staying late at work.", "ask": "What advice is most helpful for the parents?", "choices": [{"label": "Keep doing whatever stops the screaming", "verdict": "harm", "outcome": "Within months Rajeev demands that relatives wash too, and stops visitors coming at all.", "why": "Accommodation brings short-term peace but feeds OCD, which keeps expanding."}, {"label": "Refuse all of his demands from tomorrow, without telling him", "verdict": "harm", "outcome": "Rajeev panics, breaks things and refuses to eat. The family is in crisis.", "why": "Abrupt withdrawal of accommodation without a plan or support is frightening and can backfire."}, {"label": "Get Rajeev assessed for OCD; with the therapist, plan gradual, agreed reductions in accommodation alongside his treatment, explained kindly to him", "verdict": "best", "outcome": "With ERP and a step-by-step family plan, the washing demands fade over weeks, and the father comes home on time.", "why": "Treatment plus planned, supportive reduction of accommodation is what works."}]}
:::

:::widget flow
{"title": "How accommodation feeds OCD", "layout": "cycle", "nodes": [{"id": "demand", "label": "Request or distress", "detail": "\"Change your clothes before you come in!\""}, {"id": "accom", "label": "Family accommodates", "detail": "To keep the peace, the family complies."}, {"id": "calm", "label": "Short-term calm", "detail": "The person feels relief; the family avoids a scene."}, {"id": "grow", "label": "OCD grows", "detail": "The rule becomes fixed and new rules are added."}, {"id": "burden", "label": "Family burden", "detail": "Exhaustion, anger, guilt, and more distress at the next refusal."}]}
:::

:::widget compare
{"title": "Two ways a family can respond", "a": {"label": "Accommodating", "points": ["Answers 'Are you sure it is clean?' every time", "Washes the clothes again when asked", "Keeps 'dirty' visitors away from the house", "Waits an hour while the rituals finish"], "summary": "Done out of love, but each act gives relief and keeps the OCD cycle turning."}, "b": {"label": "Supportive", "points": ["Says 'I can see this is hard, and I know you can handle the doubt'", "Agrees a plan with the therapist to cut reassurance step by step", "Keeps family routines going", "Praises each step of facing a fear"], "summary": "Warm and firm: the family stays close but stops doing the compulsions for the person."}, "caption": "Families should not stop accommodating suddenly. The change is planned with the patient and therapist."}
:::

:::recall
1. What is family accommodation? || Family members taking part in or allowing rituals and avoidance (reassuring, washing, waiting, avoiding).
2. Why does accommodation matter? || It brings short-term peace but keeps OCD going and exhausts the family.
:::

:::mcq
Q: Which is an example of family accommodation?
- Encouraging the person to see a therapist
- *Answering "Are you sure the door is locked?" twenty times a night
- Learning about OCD
- Praising the person for resisting a ritual
> Taking part in reassurance rituals is accommodation.
:::

## 0.5 What helps, and the related problems [core][starting]
### Treatment
- **Exposure and response prevention (ERP)**: the person faces the things that trigger obsessions (exposure) while **not** doing the ritual (response prevention). They learn that anxiety falls on its own and the feared disaster doesn't happen. It is hard work and very effective.
- **Medicines**: certain antidepressants (SSRIs and clomipramine) reduce obsessions and compulsions. They take longer to work than in depression, and often higher doses are needed.
- **Family work** to reduce accommodation.

:::widget timeline
{"prompt": "Meera fears contamination. Order her exposure steps from easiest to hardest.", "events": [{"label": "Touch a door handle at home, then wait without washing"}, {"label": "Touch the bathroom door handle and wait"}, {"label": "Touch shoes worn outside, then touch her face"}, {"label": "Sit on a bench at the bus stand and eat a snack without washing"}, {"label": "Touch a public toilet door and hold her niece's hand without washing"}], "why": "Each step is followed by response prevention: no washing, no wiping, no mental undoing. She moves up only when a step has become manageable. The last step tackles her core fear: harming someone she loves."}
:::

### Related problems
Some conditions share the "repeat, can't stop" pattern of OCD:
| Condition | In plain words |
|---|---|
| Body dysmorphic disorder | Constant worry that some part of your appearance is ugly or deformed, when others see little or nothing wrong; checking mirrors, hiding, seeking cosmetic procedures |
| Hoarding disorder | Great difficulty throwing things away, so the home fills up until rooms cannot be used |
| Trichotillomania | Repeatedly pulling out one's own hair, with hair loss and attempts to stop |
| Excoriation (skin-picking) disorder | Repeatedly picking at skin, causing wounds, with attempts to stop |

:::widget sort
{"prompt": "Which condition does each description suggest?", "buckets": ["OCD", "Body dysmorphic disorder", "Hoarding disorder", "Trichotillomania"], "items": [{"text": "Is sure her nose is hideous, checks it in every mirror and avoids photos", "bucket": 1}, {"text": "Cannot throw away old newspapers; his flat is full to the ceiling", "bucket": 2}, {"text": "Pulls hairs from his eyebrows when stressed, leaving bare patches", "bucket": 3}, {"text": "Washes for hours after touching door handles", "bucket": 0}, {"text": "Keeps every plastic bag 'in case it is useful', and the kitchen is unusable", "bucket": 2}]}
:::

:::recall
1. What are the two parts of ERP? || Exposure to triggers, and response prevention (not doing the ritual).
2. Name the four related conditions. || Body dysmorphic disorder, hoarding disorder, trichotillomania, excoriation disorder.
:::

:::mcq
Q: In ERP for contamination OCD, a person would most likely:
- Wash hands more carefully
- *Touch a "dirty" door handle and not wash for a planned time
- Avoid door handles
- Talk only about childhood
> Facing the trigger while preventing the ritual is the core of ERP.
:::

## 0.6 Level check · Starting [starting]
Twelve or more right out of fifteen (80%) opens the Beginner level. If you already know this, take it now to skip ahead.

:::mcq
Q: Intrusive unwanted thoughts are:
- Rare and a sign of illness
- *Very common in the general population
- Always signs of hidden wishes
- Only found in OCD
> Over 9 in 10 people report them.

Q: What makes an intrusive thought turn into an obsession?
- Its exact content
- *The meaning given to it and attempts to get rid of it
- How intelligent the person is
- Watching too much TV
> Appraisal and neutralising make it stick.

Q: A compulsion is best defined as:
- A pleasurable habit
- *An action or mental act the person feels driven to do to reduce distress or prevent harm
- A delusion
- A personality trait
> Compulsions neutralise obsessions.

Q: In the OCD cycle, what keeps the compulsions going?
- Punishment
- *The relief that follows each ritual
- Boredom
- Sleep loss
> Relief reinforces the ritual.

Q: A person who says "I'm so OCD" about liking neat shelves, with no distress, most likely:
- Has severe OCD
- *Does not have OCD; this is a preference
- Has hoarding disorder
- Has schizophrenia
> OCD is distressing and disabling.

Q: Which is a mental ritual?
- Washing hands
- Checking the stove
- *Silently counting to seven to cancel a "bad" thought
- Arranging books
> Compulsions can be invisible.

Q: Fear of being "impure" after touching certain objects, with hours of bathing, is an example of:
- Symmetry OCD
- *Contamination OCD
- Hoarding
- Trichotillomania
> A common contamination theme in Indian settings.

Q: Religious scrupulosity is:
- Being very religious
- *OCD focused on fear of sin or ritual mistakes, with excessive repetition
- A delusion
- A personality disorder
> Faith is not the problem; the torment and repetition are.

Q: A mother answers her son's question "Are my hands clean?" thirty times a day. This is:
- Good parenting
- *Family accommodation, which can keep OCD going
- Exposure therapy
- A cure
> Reassurance works like a compulsion.

Q: Why can suddenly refusing all accommodation backfire?
- It is illegal
- *It can be frightening and cause crisis without a plan and treatment
- It cures OCD too fast
- It has no effect
> Reductions are planned and supported.

Q: ERP stands for:
- Early Response Planning
- *Exposure and response prevention
- Emotional Release Practice
- Extended Relaxation Programme
> Face the trigger, don't do the ritual.

Q: Medicines that help OCD are mainly:
- Sleeping tablets
- *SSRIs and clomipramine, often at higher doses and taking longer to work
- Painkillers
- Antibiotics
> Response is slower than in depression.

Q: Constant worry that one's nose is ugly, though others see nothing wrong, with mirror checking, suggests:
- OCD only
- *Body dysmorphic disorder
- Hoarding disorder
- Vanity
> A perceived defect, slight or invisible to others.

Q: Great difficulty discarding things, so living areas become unusable, suggests:
- Collecting as a hobby
- *Hoarding disorder
- Trichotillomania
- Depression only
> Clutter that stops rooms being used.

Q: Repeatedly pulling out one's own hair, causing hair loss, with failed attempts to stop, is:
- Alopecia
- *Trichotillomania
- Excoriation disorder
- Body dysmorphic disorder
> A body-focused repetitive behaviour.
:::

# Part I · OCD

## 1.1 Obsessions and compulsions [core][beginner]
:::define Obsessions (DSM-5-TR)
1. Recurrent and persistent thoughts, urges or images that are experienced, at some time during the disturbance, as **intrusive and unwanted**, and that in most individuals cause marked anxiety or distress.
2. The person attempts to ignore or suppress them, or to **neutralise** them with another thought or action (a compulsion).
:::

:::define Compulsions (DSM-5-TR)
1. Repetitive behaviours (washing, ordering, checking) or mental acts (praying, counting, repeating words silently) that the person feels **driven** to perform in response to an obsession or according to rules that must be applied rigidly.
2. Aimed at preventing or reducing distress or a dreaded event, but **not connected realistically** with what they are meant to prevent, or **clearly excessive**.
:::

### Classic features
- **Ego-dystonic**: the content goes against the person's values and is unwanted. (In poor insight this weakens.)
- **Recognised as one's own**: unlike thought insertion, the person knows the thoughts come from their own mind.
- **Resistance**: attempts to resist or suppress. Long-standing patients may stop resisting.
- **Incompleteness and "not just right" experiences**: some people are driven less by fear of harm and more by a nagging sense that something is unfinished.

:::trap Compulsions are not always linked to an obsession
Sometimes a compulsion follows a rigid rule ("I must step on every third tile") with no clear obsession. And not every repetitive act is a compulsion: tics, stereotypies, habits and addictive behaviours differ in what drives them.
:::

:::widget sort
{"prompt": "Obsession, compulsion, or neither?", "buckets": ["Obsession", "Compulsion", "Neither"], "items": [{"text": "An unwanted image of stabbing her husband that horrifies her", "bucket": 0}, {"text": "Repeating a mantra until the image goes away", "bucket": 1}, {"text": "Enjoys arranging his stamp collection on Sundays", "bucket": 2, "why": "Pleasurable and wanted: a hobby, not a compulsion."}, {"text": "The doubt 'Did I lock the car?' that keeps coming back", "bucket": 0}, {"text": "Checking the car door lock eight times", "bucket": 1}, {"text": "Sniffing, blinking and throat clearing that she feels 'has to come out', with no thought before it", "bucket": 2, "why": "These sound like tics: preceded by a physical urge rather than an obsession."}]}
:::

:::widget compare
{"title": "Obsession or delusion?", "a": {"label": "Obsession", "points": ["Felt as intrusive and unwanted", "Usually recognised as coming from one's own mind", "Insight is usually present: 'I know this is probably silly'", "Resisted, or neutralised by a compulsion", "Causes anxiety or disgust"], "summary": "Obsession: an unwanted thought the person fights, usually knowing it is excessive."}, "b": {"label": "Delusion", "points": ["Felt as simply true, not intrusive", "Not resisted; the person acts on it or argues for it", "Held with full conviction despite clear evidence against it", "Often comes with other psychotic features such as hallucinations", "Out of keeping with the person's culture"], "summary": "Delusion: a fixed false belief that the person does not see as a symptom."}, "caption": "The hard middle: OCD with absent insight. DSM-5-TR keeps such people under OCD, with the specifier 'with absent insight or delusional beliefs', when the belief is the content of the obsession and there are no other psychotic features."}
:::

:::recall
1. Give the two parts of the DSM-5-TR definition of obsessions. || Recurrent intrusive, unwanted, distressing thoughts, urges or images; attempts to ignore, suppress or neutralise them.
2. Give the two parts of the definition of compulsions. || Repetitive behaviours or mental acts the person feels driven to do; aimed at reducing distress or preventing harm but unrealistic or excessive.
3. How does an obsession differ from thought insertion? || The person recognises an obsession as their own thought.
:::

:::mcq
Q: Which feature best distinguishes an obsession from a delusion of thought insertion?
- The content is violent
- *The person knows the thought comes from their own mind
- It causes distress
- It recurs
> Ownership is preserved in obsessions.
:::

## 1.2 OCD: criteria and presentation [core][beginner]
:::define DSM-5-TR OCD (summary)
A. Obsessions, compulsions or both.
B. They are **time-consuming** (for example, more than 1 hour a day) or cause clinically significant distress or impairment.
C. Not due to a substance or medical condition.
D. Not better explained by another mental disorder (worries in GAD, appearance in BDD, discarding in hoarding, guilty ruminations in depression, delusions in psychosis, and others).
:::

:::widget guess
{"prompt": "DSM-5-TR gives an example of how much time OCD symptoms take to count as 'time-consuming'. How many hours a day?", "min": 0, "max": 8, "step": 0.5, "unit": "hours", "answer": [1, 1], "reveal": "More than 1 hour a day is the example given. Distress or impairment can also meet the rule even with less time.", "clinician": "Criterion B: obsessions or compulsions are time-consuming (for example, take more than 1 hour per day) or cause clinically significant distress or impairment."}
:::

:::widget guess
{"prompt": "In large studies, what is the average age at which OCD begins?", "min": 5, "max": 50, "unit": "years", "answer": [17, 22], "reveal": "About 19 to 20 years. A quarter of cases start by about 14, and boys tend to start earlier than girls. Onset after 35 is unusual and should prompt a search for a physical or other cause.", "clinician": "Mean onset in US data is about 19.5 years; nearly a quarter of males start before age 10. New OCD in later life warrants neurological review."}
:::

### Specifiers
**Insight**
| Specifier | The person thinks their OCD beliefs are |
|---|---|
| Good or fair insight | Definitely or probably not true, or may or may not be true |
| Poor insight | Probably true |
| Absent insight or delusional beliefs | Completely true |

Even with absent insight the diagnosis remains OCD, not a psychotic disorder, if the beliefs are OCD content.

**Tic-related**: a current or past tic disorder. This group is more often male, with earlier onset, more symmetry and "just right" symptoms, and a stronger family loading.

### Who gets it and how it runs
- **Prevalence**: about 1.2% in the US in a year, and similar internationally (about 1.1 to 1.8%).
- **Sex**: slightly more women in adulthood; more boys in childhood.
- **Onset**: mean age about 19.5 years; a quarter start by 14; onset after 35 is unusual. Nearly 25% of males start before age 10.
- **Course**: untreated, usually chronic, waxing and waning; a minority episodic or deteriorating. Many wait years before seeking help, often from shame.

:::widget build
{"vignette": "Farah, 28, an IT analyst in Hyderabad, has been tormented for two years by doubts that she has left the gas or iron on and caused a fire. She checks every knob and switch twelve times before leaving, takes photos of them, and calls her mother from the bus to ask if she 'really' saw her switch them off. Leaving home takes ninety minutes; she has received two warnings at work for lateness. She knows the checking is excessive and calls it 'stupid', but feels unbearable anxiety if she does not do it. There is no substance use; she is not depressed. She has never had tics.", "rule": "Tick each feature present. OCD needs obsessions and/or compulsions that take time (for example over an hour a day) or cause distress or impairment, not better explained by another disorder.", "symptoms": [{"label": "Recurrent intrusive, unwanted doubts", "present": true, "core": true}, {"label": "Attempts to neutralise them", "present": true, "core": true, "why": "Checking, photos and calls all neutralise the doubts."}, {"label": "Repetitive checking driven by the doubts", "present": true}, {"label": "Reassurance-seeking", "present": true, "why": "Calling her mother is a reassurance compulsion."}, {"label": "Over an hour a day, or impairment", "present": true, "why": "Ninety minutes and warnings at work."}, {"label": "Insight good or fair", "present": true}, {"label": "Tic history", "present": false}], "need": 4, "needCore": true, "verdict": "OCD, with good or fair insight, not tic-related. Checking and reassurance-seeking dominate. Next: rate severity (Y-BOCS), screen for depression and suicidal thoughts, and ask about family accommodation."}
:::

:::clinician
### Rating severity: the Y-BOCS
The Yale-Brown Obsessive Compulsive Scale has a symptom checklist followed by 10 severity items (five for obsessions, five for compulsions: time, interference, distress, resistance, control), each scored 0 to 4, for a total of 0 to 40. Rough bands: 0 to 7 subclinical, 8 to 15 mild, 16 to 23 moderate, 24 to 31 severe, 32 to 40 extreme. Response in trials is often defined as a 25 to 35% fall; the CY-BOCS is used in children. The DOCS measures four symptom dimensions (contamination, responsibility for harm, unacceptable thoughts, symmetry).
:::

:::widget layers
{"title": "The insight specifier", "shape": "stack", "layers": [{"label": "Good or fair insight", "detail": "\"My fear is probably not true.\""}, {"label": "Poor insight", "detail": "\"My fear is probably true.\""}, {"label": "Absent insight or delusional beliefs", "detail": "\"I am completely sure my fear is true.\" Still OCD if the content is OCD content."}], "caption": "Insight can shift with stress and over time; rate it at each visit."}
:::

:::recall
1. State criterion B for OCD. || Time-consuming (for example over an hour a day) or causing clinically significant distress or impairment.
2. Name the three insight specifiers. || Good or fair; poor; absent or delusional beliefs.
3. What is the tic-related specifier, and what is typical of that group? || Current or past tic disorder; more often male, earlier onset, symmetry symptoms.
4. Give the mean age of onset and the share starting by 14. || About 19.5 years; a quarter by 14.
:::

:::mcq
Q: A man is completely convinced that if he does not wash 50 times his family will die. He has no other psychotic symptoms. The best diagnosis is:
- Delusional disorder
- Schizophrenia
- *OCD with absent insight (delusional beliefs)
- GAD
> OCD content held with full conviction remains OCD, with the insight specifier.
:::

## 1.3 Causes and differential diagnosis [core][beginner]

:::widget figure
{"id": "prefrontal", "focus": ["mofc", "acc"]}
:::

### Causes
- **Genes**: OCD is familial; twin heritability is roughly 40 to 50%, higher for childhood onset. First-degree relatives also have more tics and related disorders.
- **Brain circuits**: overactivity in loops linking the **orbitofrontal cortex** and **anterior cingulate** to the **striatum** (caudate) and **thalamus** (detail in the Advanced level). These normalise partly after successful SSRI or CBT treatment.
- **Serotonin**: the selective benefit of serotonergic drugs (SSRIs and clomipramine, but not noradrenergic antidepressants) points to a role, but not a simple deficit.
- **Infection and immunity**: a subgroup of children has sudden-onset OCD after infection (PANS/PANDAS); this is debated.
- **Learning**: obsessions trigger anxiety; compulsions reduce it; the relief reinforces the compulsion (as in Mowrer's model).
- **Beliefs** that make intrusions feel dangerous (Salkovskis and others): inflated responsibility, overestimating threat, overvaluing thoughts ("thinking it makes it more likely": **thought-action fusion**), need to control thoughts, perfectionism and intolerance of uncertainty.

:::widget thoughtrecord
{"situation": "While bathing her baby, Farah has a sudden image of letting him slip under the water.", "thought": "Having this thought means I am a terrible mother who might really do it.", "emotion": "horrified", "traps": [{"label": "Thought-action fusion", "right": true, "why": "Treating a thought as if it were the same as the act, or makes the act more likely."}, {"label": "Over-importance of thoughts", "right": true, "why": "She treats the mere presence of the thought as meaningful about who she is."}, {"label": "Fortune telling", "why": "Close, but the core error is the meaning given to having the thought."}, {"label": "Overgeneralising", "why": "She is not drawing a rule from one event."}], "forEvidence": ["The image felt very vivid.", "It keeps coming back."], "againstEvidence": ["Most new parents have intrusive thoughts of harm to their baby.", "She feels horror at the image, which shows it goes against her values.", "She has never harmed anyone, and takes great care of her son."], "balanced": "This is an intrusive thought, of the kind most new parents have. It upsets me because I love him. Thoughts are not actions, and I do not need to fight or neutralise it."}
:::

### Differential diagnosis
| Condition | How it differs from OCD |
|---|---|
| GAD | Worries are about real-life concerns, felt as reasonable; no rituals |
| Depressive rumination | Mood-congruent brooding on loss and failure; not felt as intrusive or senseless |
| Psychosis | Beliefs and voices are not recognised as one's own products; other psychotic features |
| OCPD | Lifelong, ego-syntonic perfectionism and control; no true obsessions or compulsions (see below) |
| Tics | Sudden, brief movements or sounds preceded by a physical urge, not by an obsession |
| Autism | Repetitive behaviours and interests are usually comforting or enjoyable, not anxiety-driven |
| Illness anxiety | Single theme: having a serious illness |
| Eating disorders | Rituals around food and weight only |
| Body dysmorphic disorder | Preoccupation with appearance only |

### OCD and OCPD: the classic confusion
| Feature | OCD | Obsessive-compulsive personality disorder |
|---|---|---|
| Nature | True obsessions and compulsions | A pervasive personality pattern of perfectionism, orderliness and control |
| Ego | **Ego-dystonic**: unwanted | **Ego-syntonic**: seen as right and proper |
| Distress | The person suffers | Others often suffer more; the person sees others as careless |
| Onset | Usually adolescence or early adulthood, often episodic course | Early adulthood, stable over life |
| Treatment | ERP and SSRIs | Psychotherapy; less responsive to medicine |
They can co-occur.

:::widget sort
{"prompt": "OCD or OCPD?", "buckets": ["OCD", "OCPD"], "items": [{"text": "\"My way is the correct way. Others are sloppy.\"", "bucket": 1}, {"text": "\"I hate these thoughts. I know they make no sense.\"", "bucket": 0}, {"text": "Cannot delegate at work because nobody does it properly; has been like this all adult life", "bucket": 1}, {"text": "Checks the gas twenty times because of a terrifying doubt", "bucket": 0}, {"text": "Rigid about rules, money and lists, and proud of it", "bucket": 1}]}
:::

:::widget flow
{"title": "The cognitive model of OCD", "layout": "chain", "nodes": [{"id": "intr", "label": "Normal intrusion", "detail": "An unwanted thought, image or urge."}, {"id": "appr", "label": "Appraisal", "detail": "Inflated responsibility, thought-action fusion, need for certainty."}, {"id": "dist", "label": "Distress", "detail": "Anxiety, guilt or disgust follow the appraisal."}, {"id": "neut", "label": "Neutralising", "detail": "Rituals, reassurance, avoidance, suppression."}, {"id": "maint", "label": "Maintenance", "detail": "No disconfirmation; the intrusion becomes more frequent and more important."}]}
:::

:::widget compare
{"title": "OCD and OCPD side by side", "a": {"label": "OCD", "points": ["Specific obsessions and compulsions", "Ego-dystonic: unwanted and distressing", "The person wishes the symptoms would go", "Often fluctuates and worsens with stress", "Responds to ERP and SSRIs"], "summary": "OCD: unwanted thoughts and rituals that the person wants rid of."}, "b": {"label": "OCPD", "points": ["No true obsessions or compulsions", "Ego-syntonic: perfectionism feels right", "Others suffer more than the person does", "A lifelong, stable personality style", "Rigid about rules, lists, money and work"], "summary": "OCPD: a stable personality style of control and perfectionism that feels correct to the person."}, "caption": "The two can occur together, and roughly a quarter to a third of people with OCD also have OCPD."}
:::

:::recall
1. Name three cognitive beliefs that make intrusions feel dangerous. || Inflated responsibility; overestimation of threat; overimportance of thoughts (thought-action fusion); need to control thoughts; perfectionism; intolerance of uncertainty.
2. What is thought-action fusion? || Believing that thinking something makes it more likely, or is morally as bad as doing it.
3. Give three differences between OCD and OCPD. || Ego-dystonic vs ego-syntonic; true obsessions and compulsions vs a personality pattern; the person suffers vs others suffer more.
:::

:::mcq
Q: A 40-year-old manager insists on perfect order, cannot delegate, and believes this is simply the right way to work. He has no intrusive thoughts. This most suggests:
- OCD
- *Obsessive-compulsive personality disorder
- GAD
- Hoarding disorder
> Ego-syntonic perfectionism without obsessions or compulsions.
:::

## 1.4 Treatment [core][beginner]
### First line
- **ERP** (exposure and response prevention), delivered as CBT. Most effective single treatment; about half to two-thirds respond in trials.
- **SSRIs** (fluoxetine, fluvoxamine, sertraline, paroxetine, escitalopram, citalopram) or **clomipramine** (a tricyclic with strong serotonin reuptake blockade).
- For moderate to severe OCD, **ERP plus an SSRI** is common.

:::widget compare
{"title": "A year of treatment: before and after", "a": {"label": "Before", "points": ["Y-BOCS score of 28: severe", "Four hours a day lost to washing", "Hands cracked and bleeding", "Avoids the kitchen and public places"], "summary": "Severe OCD: rituals fill the day and life has shrunk."}, "b": {"label": "After ERP and an SSRI", "points": ["Y-BOCS score of 12: mild", "Under an hour a day of rituals, and easier to resist", "Hands have healed", "Back at work and cooking for the family"], "summary": "A good response: the score has fallen by more than a third. Some symptoms remain, and relapse prevention continues."}, "caption": "In OCD, a fall of 35 percent or more on the Y-BOCS counts as a response. Full freedom from symptoms is less common than good control."}
:::

### How medicines differ in OCD
:::widget guess
{"prompt": "When an SSRI is started for OCD, how many weeks can it take before a response clearly emerges?", "min": 0, "max": 20, "unit": "weeks", "answer": [10, 12], "reveal": "Often 10 to 12 weeks, longer than in depression, and doses usually need to be at the upper end. Patience before declaring a medicine a failure is essential.", "clinician": "Initial response is slower than in depression (often 10 to 12 weeks). Doses are increased to gain maximal benefit; continue for at least 1 year. In one analysis, relapse over 2 years was 25 to 40% in those who continued versus about 80% in those who stopped after initial response."}
:::

:::student
### Typical adult daily doses in OCD (educational only)
These ranges are for learning. They are not advice for anyone to take or change a medicine.

| Medicine | Typical adult daily range in OCD |
|---|---|
| Fluoxetine | 40 to 60 mg |
| Fluvoxamine | 100 to 300 mg |
| Sertraline | 100 to 200 mg |
| Escitalopram | 10 to 20 mg |
| Clomipramine | 100 to 250 mg |
:::

:::clinician
### OCD dosing (for learning; check current guidelines)
| Medicine | Start | Target in OCD | Indian brands | Notes |
|---|---|---|---|---|
| Fluoxetine | 20 mg | 40 to 60 mg (up to 80 mg in some countries) | Fludac, Prodep | Long half-life helps with missed doses |
| Fluvoxamine | 50 mg at night | 100 to 300 mg (split if above 150 mg) | Fluvoxin | Strong CYP1A2 inhibitor (clozapine, caffeine, theophylline) |
| Sertraline | 50 mg | 150 to 200 mg | Serta, Daxid | Above 200 mg used by specialists |
| Paroxetine | 20 mg | 40 to 60 mg | Pexep | Anticholinergic; withdrawal |
| Escitalopram | 10 mg | 20 mg | Nexito, Stalopam | Higher doses only with ECG monitoring |
| Clomipramine | 25 mg at night | 100 to 250 mg | Clonil, Anafranil | ECG, anticholinergic burden, lowers seizure threshold, lethal in overdose; plasma levels guide high doses |

**Titration.** Raise every 2 to 4 weeks towards the target; judge an adequate trial as at least 8 to 12 weeks with at least 6 weeks at the top tolerated dose. Continue at least a year after response; taper slowly.
:::

:::widget decide
{"scene": "Imtiaz, 31, with contamination OCD (Y-BOCS 28), has taken sertraline 50 mg for three weeks with no change. His family asks to switch to 'a stronger medicine'.", "ask": "What is the best next step?", "choices": [{"label": "Switch to another SSRI now", "verdict": "harm", "outcome": "He goes through three medicines in three months without an adequate trial of any, and loses hope.", "why": "Three weeks at a low dose is not an adequate trial in OCD."}, {"label": "Explain that OCD needs higher doses and more time; increase sertraline step by step towards 150 to 200 mg, and start ERP", "verdict": "best", "outcome": "By three months his Y-BOCS falls to 15; ERP lets him touch door handles without washing.", "why": "Adequate dose and duration, combined with ERP, is the evidence-based approach."}, {"label": "Add alprazolam to calm him", "verdict": "harm", "outcome": "He feels calmer but washes just as much, and becomes reliant on the tablets.", "why": "Benzodiazepines do not treat OCD and can interfere with ERP."}]}
:::

:::widget curve
{"kind": "dose-response", "title": "Dose and response in OCD", "caption": "OCD often needs the upper part of the SSRI dose range: response keeps rising with dose, unlike depression where it flattens earlier. Explore how efficacy and side effects change as you move along the curve."}
:::

:::widget curve
{"kind": "half-life", "title": "Why fluoxetine forgives missed doses", "caption": "Fluoxetine and its active metabolite have very long half-lives, so levels stay near steady state if a dose is missed; short half-life drugs such as paroxetine fall quickly and can cause discontinuation symptoms."}
:::

:::widget synapse
{"drug": "ssri", "caption": "SSRIs block serotonin reuptake. In OCD the benefit comes later and at higher doses than in depression, perhaps because orbitofrontal serotonin autoreceptors adapt more slowly."}
:::

:::widget journey
{"drug": "fluvoxamine", "target": "serotonin transporters in orbitofrontal and striatal circuits", "routes": ["oral"], "notes": {"liver": "Fluvoxamine strongly inhibits the liver enzyme CYP1A2, raising levels of clozapine, caffeine and theophylline taken alongside it."}}
:::

:::recall
1. What are the first-line treatments for OCD? || ERP (CBT) and SSRIs or clomipramine; often combined.
2. How do SSRI doses and response times in OCD differ from depression? || Higher doses; slower response (often 10 to 12 weeks).
3. Why are noradrenergic antidepressants not used for OCD? || Only strongly serotonergic drugs are effective.
:::

:::mcq
Q: Which antidepressant has the strongest evidence among tricyclics for OCD?
- Amitriptyline
- Nortriptyline
- *Clomipramine
- Imipramine
> Strong serotonin reuptake blockade.
:::

## 1.5 ERP in practice: a worked case [core][beginner]
:::example The case
**Lakshmi**, 34, a homemaker in Chennai, fears that germs from outside will make her children ill. She washes her hands about 60 times a day, bathes for an hour after going to the market, makes her husband change clothes at the door, and wipes vegetables with soap. Her hands are cracked. She cooks less and less, and the family has stopped inviting guests.
:::

:::widget worked
{"title": "Building Lakshmi's ERP plan", "steps": [{"q": "Step 1: what does she fear, exactly?", "a": "That germs will make her children seriously ill, and it will be her fault. Rate belief and distress."}, {"q": "Step 2: list her triggers and rituals.", "a": "Triggers: shoes, door handles, market bags, money, outside clothes. Rituals: handwashing (60 times), bathing, making family change, soaping vegetables, reassurance ('Are the children safe?')."}, {"q": "Step 3: build the hierarchy (0 to 100).", "a": "Touch own shoe and wait 10 minutes before washing (30); touch the main door handle and cook without washing (50); handle money and touch her children's toys (70); let her husband come in without changing (80); go to the market and hug the children on return without bathing (95)."}, {"q": "Step 4: how is each exposure done?", "a": "Touch the trigger, then response prevention: no washing, cleaning or reassurance for an agreed time, or ideally until the next normal wash (before meals, after the toilet). Notice the prediction ('my children will fall ill') and what actually happens."}, {"q": "Step 5: what about the family?", "a": "Agree with her husband and mother-in-law, with her consent, to stop accommodating step by step: he stops changing at the door when she reaches that step; nobody answers reassurance questions, but they respond kindly: 'I know it's hard. What would your therapist say?'"}, {"q": "Step 6: how do we know it's working?", "a": "Y-BOCS each month; diary of washing; she rates distress during exposures. Expect anxiety to rise first and fall with practice."}], "yourTurn": [{"q": "Farah checks the gas twelve times. Write three steps of her ERP hierarchy.", "a": "For example: check the gas once and leave (40); leave without checking and without taking a photo (65); leave the house without checking anything, and do not call her mother for reassurance (85)."}]}
:::

### Key principles
- **Response prevention is the active ingredient.** Exposure without dropping rituals rarely helps.
- **Rituals include the hidden ones**: mental reviewing, counting, praying, reassurance-seeking, and subtle avoidance (using an elbow to open doors).
- **"Normal" washing is agreed**: before eating, after the toilet, when visibly dirty. The goal is ordinary life, not filth.
- **Expect discomfort.** ERP is challenging; the therapist explains the rationale, collaborates, and never surprises or forces.
- **Imaginal exposure** for feared thoughts (writing and reading a script of the feared story) helps where real exposure is impossible (for example "What if I harm my baby?").

:::widget flow
{"title": "One ERP practice session", "layout": "chain", "nodes": [{"id": "plan", "label": "Choose the step", "detail": "From the agreed hierarchy, for example touching the main door handle (50)."}, {"id": "predict", "label": "Name the prediction", "detail": "\"My children will fall ill.\" Rate belief."}, {"id": "expose", "label": "Exposure", "detail": "Touch the handle, then carry on cooking."}, {"id": "prevent", "label": "Response prevention", "detail": "No washing, wiping or asking for reassurance."}, {"id": "ride", "label": "Stay with the feeling", "detail": "Notice anxiety rise and fall; no escape."}, {"id": "review", "label": "Review", "detail": "What happened versus what you predicted? What did you learn?"}]}
:::

:::widget conditioning
{"kind": "classical", "title": "Fear of germs, learned and unlearned", "caption": "For Meera, touching 'dirty' things became paired with intense fear and disgust, so the door handle itself now triggers alarm. ERP works like the extinction step: touch the handle again and again with no washing and no harm following, and a new learning grows: 'this is safe enough'. Like all extinction, it can return under stress, so practice continues after therapy."}
:::

:::recall
1. What is the active ingredient of ERP? || Response prevention: not doing the ritual.
2. Give two examples of hidden rituals. || Mental reviewing, counting, praying, reassurance-seeking, subtle avoidance.
3. What is imaginal exposure used for? || Feared thoughts or outcomes that cannot be faced in real life.
:::

:::mcq
Q: During ERP, Lakshmi uses her elbow instead of her hand to open doors. This is best understood as:
- Progress
- *Subtle avoidance that should be addressed
- A cure
- Appropriate hygiene
> Subtle avoidance keeps the fear alive.
:::

## 1.6 OCD in special groups [core][beginner]
### Children and adolescents
- Common, often hidden; children may involve parents heavily in rituals.
- First-line is family-based CBT with ERP; sertraline, fluoxetine or fluvoxamine if moderate to severe or CBT is not enough. Monitor for suicidal thoughts on SSRIs in young people.
- **PANS/PANDAS**: a sudden, dramatic onset of OCD or eating restriction in a child, with other symptoms (anxiety, emotional lability, regression, sleep and urinary problems), possibly after infection such as streptococcal throat infection. The concept is contested; assess carefully, treat any infection, and still treat the OCD with standard methods.

### Perinatal OCD
- Onset or worsening in pregnancy and after birth is common.
- Intrusive thoughts of harming the baby (dropping, stabbing, drowning) are frequent; the mother is horrified and avoids being alone with the baby.
- These thoughts are **ego-dystonic** and are **not** linked to increased risk of harming the child. They differ from the rare **postpartum psychosis**, where beliefs are delusional and risk is real.

:::widget decide
{"scene": "Shreya, 27, from Pune, six weeks after giving birth, confides tearfully that she keeps getting images of drowning her baby while bathing him. She is horrified, has stopped bathing him herself and hides all knives. She sleeps poorly but has no strange beliefs, voices or confusion.", "ask": "What is the most accurate response?", "choices": [{"label": "Arrange for the baby to be removed from her care", "verdict": "harm", "outcome": "She is devastated, stops breastfeeding and becomes severely depressed.", "why": "Ego-dystonic harm obsessions do not indicate intent or increased risk. Removing the baby harms both."}, {"label": "Recognise probable perinatal OCD; explain that such thoughts are common, unwanted and not linked to acting on them; assess mood and rule out psychosis; offer CBT with ERP and consider an SSRI compatible with breastfeeding", "verdict": "best", "outcome": "Relieved, she starts CBT. Gradually she bathes her son again with her husband nearby, then alone.", "why": "Accurate explanation reduces shame; careful assessment separates OCD from psychosis; ERP addresses the avoidance."}, {"label": "Tell her it's just baby blues and will pass", "verdict": "ok", "outcome": "She feels briefly better, then the thoughts and avoidance grow.", "why": "Baby blues resolve within days; this is OCD and needs treatment."}]}
:::

### Older adults
New-onset OCD after middle age is unusual: look for neurological causes (stroke, frontotemporal dementia, basal ganglia lesions).

### Comorbidity
Depression (most common), anxiety disorders, tics, eating disorders, BDD, and alcohol use. OCD carries a raised risk of suicidal thoughts and attempts, especially with comorbid depression; ask every patient.

:::recall
1. What is PANS/PANDAS? || Sudden-onset paediatric OCD (or food restriction) with other neuropsychiatric symptoms, possibly post-infectious; contested.
2. How do perinatal harm obsessions differ from postpartum psychosis? || Obsessions are ego-dystonic and not linked to harm; psychosis involves delusions and real risk.
3. Why is late-onset OCD worrying? || It may reflect a neurological cause.
:::

:::mcq
Q: A mother has horrifying, unwanted images of harming her infant and avoids being alone with him. The most important point is:
- She is likely to harm him
- *These ego-dystonic obsessions are common and are not linked to increased risk of acting on them
- She has postpartum psychosis
- She should stop all contact with the baby
> Distinguish OCD from psychosis; reassure accurately; treat.
:::

## 1.7 When OCD does not get better [core][beginner]
About 40 to 60% of people do not respond fully to a first SSRI. Before calling OCD "treatment-resistant", check:
- Was the **diagnosis** right? (tics, autism, psychosis, OCPD, depression)
- Was the **dose** high enough and the **duration** long enough?
- Was the medicine actually **taken**?
- Did they receive **real ERP**, with response prevention, from a trained therapist?
- Is **family accommodation** or comorbid depression or alcohol use getting in the way?

:::widget guess
{"prompt": "Out of 100 people with OCD who take a first SSRI at a good dose for long enough, about how many respond well?", "min": 0, "max": 100, "unit": "people", "answer": [40, 60], "reveal": "About half. Many of the rest respond to a second SSRI, to clomipramine, to adding ERP or to augmentation. A first failure is common and is not the end of the road.", "clinician": "Response to a first adequate SSRI trial (high dose, at least 8 to 12 weeks) is around 40 to 60 percent; response usually means a Y-BOCS reduction of 25 to 35 percent or more."}
:::

### Next steps (in order of evidence)
1. Raise the SSRI to the maximum tolerated dose, or switch to another SSRI or clomipramine.
2. Add or intensify ERP (more frequent sessions, home-based, intensive programmes).
3. **Augment** an SSRI with a low dose of an antipsychotic: **risperidone** or **aripiprazole** have the best evidence; about a third of people respond. Especially helpful with tics.
4. Other augmentation options with weaker evidence: memantine, N-acetylcysteine, topiramate, ondansetron.
5. Specialist options for severe, chronic OCD: intensive residential treatment, deep TMS, and in rare cases deep brain stimulation or neurosurgery.

:::widget decide
{"scene": "Mr Nair, 45, from Kochi, has had severe checking OCD for 20 years. He has taken fluoxetine 60 mg for a year and attended 'counselling' that involved talking about his childhood. His Y-BOCS is 30.", "ask": "What is the most important next step?", "choices": [{"label": "Refer for deep brain stimulation", "verdict": "harm", "outcome": "The surgical team declines: he has never had adequate psychological treatment.", "why": "Surgery is reserved for severe OCD that has failed adequate medication and adequate ERP."}, {"label": "Offer proper ERP with a trained therapist, consider augmentation with a low-dose antipsychotic or a switch to clomipramine, and check adherence and family accommodation", "verdict": "best", "outcome": "After structured ERP and aripiprazole augmentation, his Y-BOCS falls to 18 and he returns to work part-time.", "why": "He has never had evidence-based therapy; this is not true treatment resistance yet."}, {"label": "Accept that nothing more can be done", "verdict": "harm", "outcome": "He continues to suffer for years.", "why": "Many options remain."}]}
:::

:::clinician
### Augmentation in practice
- **Risperidone** 0.5 to 2 mg/day or **aripiprazole** 5 to 15 mg/day, given for 6 to 8 weeks; stop if no benefit. Monitor weight, glucose, lipids and prolactin (risperidone).
- **Clomipramine plus an SSRI**: may help, but fluvoxamine, fluoxetine and paroxetine raise clomipramine levels; check ECG and levels.
- **Memantine** (10 to 20 mg) and **N-acetylcysteine** (up to about 2400 to 3000 mg/day) have mixed trial evidence.
- Benzodiazepines are not effective for core OCD symptoms.
:::

:::widget layers
{"title": "The treatment ladder for OCD", "shape": "stack", "layers": [{"label": "Neurosurgery", "detail": "DBS or ablation for severe, refractory OCD, with consent and Board approval."}, {"label": "Neuromodulation", "detail": "Deep TMS."}, {"label": "Augmentation", "detail": "Low-dose risperidone or aripiprazole; weaker options such as memantine or NAC."}, {"label": "Switch or clomipramine", "detail": "Another SSRI or clomipramine."}, {"label": "Optimise", "detail": "Maximum tolerated SSRI dose for long enough; intensive ERP."}, {"label": "First line", "detail": "ERP and an SSRI, with family work."}], "caption": "Climb only after checking diagnosis, dose, duration, adherence and therapy quality at each rung."}
:::

:::widget journey
{"drug": "clomipramine", "target": "serotonin transporters (parent drug) and noradrenaline transporters (metabolite)", "routes": ["oral", "iv"], "notes": {"liver": "Converted to desmethylclomipramine, which mainly blocks noradrenaline reuptake; fluvoxamine slows this conversion.", "vein": "Intravenous clomipramine bypasses first-pass metabolism; used in a few specialist centres for oral non-responders."}, "caption": "Why the route and the liver change how serotonergic clomipramine is."}
:::

:::recall
1. List five things to check before calling OCD treatment-resistant. || Diagnosis, dose, duration, adherence, quality of ERP (also accommodation and comorbidity).
2. Which augmenting drugs have the best evidence? || Low-dose risperidone or aripiprazole.
3. Roughly what share respond to antipsychotic augmentation? || About a third.
:::

:::mcq
Q: Antipsychotic augmentation in OCD is particularly helpful when:
- The patient has panic attacks
- *There is a comorbid tic disorder
- The patient has GAD
- The SSRI has been given for one week
> Tic-related OCD responds better to augmentation.
:::
`;
