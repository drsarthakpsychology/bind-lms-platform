/* Module · Learning and memory, Part I (Starting level). Original text written for VIBHA School of Psychology. */
export const part1 = String.raw`
# Part I · Starting: how experience changes us

## 1.1 What counts as learning [core][starting]
Psychologists define **learning** as a **relatively permanent change in behaviour, or in the capacity for behaviour, that comes from experience**. Each part of the definition does work:
- **Relatively permanent**: a change that lasts. Feeling sleepy after lunch is not learning.
- **Behaviour or the capacity for it**: you may learn the route to a friend's house in Jaipur and show it only months later, when you need it. Learning and **performance** are not the same thing.
- **From experience**: not from growing up (**maturation**: a baby walks because her body is ready), fatigue, illness, injury or drugs.

:::widget sort
{
  "prompt": "Learning, or a change with another cause?",
  "buckets": ["Learning", "Not learning (maturation, fatigue, drugs, injury)"],
  "items": [
    { "text": "A child starts to walk at about 12 months", "bucket": 1, "why": "Walking appears when the nervous system and muscles mature, across cultures, with little teaching." },
    { "text": "A trainee learns to ask about suicide without flinching", "bucket": 0 },
    { "text": "A batsman's reflexes slow at the end of a long, hot innings", "bucket": 1, "why": "Fatigue is temporary and lifts with rest." },
    { "text": "Your dog runs to the kitchen when it hears the fridge door", "bucket": 0 },
    { "text": "A man becomes talkative after two drinks", "bucket": 1 },
    { "text": "You stop flinching at the noise of the ceiling fan in a new hostel room", "bucket": 0, "why": "Habituation is the simplest form of learning." }
  ]
}
:::

### The simplest learning: habituation and sensitisation
These are **non-associative** forms: the animal learns about one stimulus, not a link between two.
- **Habituation**: a response weakens when a harmless stimulus repeats. The traffic noise outside a Mumbai flat stops waking you after a few nights.
- **Sensitisation**: after a strong or painful event, responses to many stimuli grow. After a near-accident on the highway, every horn makes you jump.
- **Dishabituation**: a new or changed stimulus restores a habituated response.

:::widget compare
{"title": "Slide between the two simplest kinds of learning", "a": {"label": "Habituation", "points": ["A harmless stimulus repeats again and again", "The response gets weaker each time", "Example: the ceiling fan's hum stops bothering you", "A new or changed sound brings the response back (dishabituation)"], "summary": "Habituation: you learn that a repeated thing does not matter, so you stop reacting to it."}, "b": {"label": "Sensitisation", "points": ["A strong or painful event happens once", "Responses to many other stimuli get bigger", "Example: after a near-accident, every horn makes you jump", "It usually fades over hours or days"], "summary": "Sensitisation: one shock puts you on alert, so you react more to everything."}, "caption": "Both are non-associative: you learn about one stimulus, not a link between two."}
:::

### Associative learning: three big families
| Family | What is linked | Classic name |
|---|---|---|
| **Classical conditioning** | Two stimuli: a signal and what it predicts | Pavlov |
| **Operant (instrumental) conditioning** | A behaviour and its consequence | Thorndike, Skinner |
| **Cognitive and observational learning** | Information, expectations and the behaviour of others | Tolman, Köhler, Bandura |

:::student
A quick test: in classical conditioning, something happens **to** you (the bell, then the food) whatever you do. In operant conditioning, what happens **depends on** what you do (press the lever, get the food).
:::

:::clinician
Habituation and sensitisation were the first forms of learning whose cellular mechanisms were worked out (Kandel's work on the sea slug Aplysia, discussed at the Advanced level). Clinically, habituation underlies part of exposure therapy's early session-by-session fall in fear, though modern accounts emphasise new inhibitory learning rather than simple habituation. Sensitisation is relevant to chronic pain, to the escalating sensitivity to drug cues in addiction (incentive sensitisation, Robinson and Berridge), and to the exaggerated startle of PTSD.
:::

:::recall
1. Define learning. || A relatively permanent change in behaviour, or capacity for behaviour, resulting from experience.
2. Why is walking at 12 months not learning? || It is mainly maturation.
3. Distinguish habituation from sensitisation. || Habituation: response to a repeated harmless stimulus weakens. Sensitisation: after a strong event, responses to many stimuli increase.
4. Name the three families of associative and cognitive learning. || Classical conditioning, operant conditioning, cognitive and observational learning.
:::

:::mcq
Q: Which of these is the best example of learning rather than maturation?
- An infant begins to babble at about six months
- *A child stops touching a hot tawa after a burn
- A teenager's voice deepens during puberty
- A toddler's first steps appear at about one year
> Avoiding the tawa follows a specific experience; the others mainly follow maturation.
:::

## 1.2 Classical conditioning: learning what predicts what [core][starting]
Ivan Pavlov, a Russian physiologist, won the Nobel Prize in 1904 for work on digestion. While measuring dogs' saliva, he noticed that they began to salivate **before** food arrived: at the sight of the assistant, or at footsteps. He turned this "psychic secretion" into a method.

:::widget figure
{"id": "pavlov-apparatus"}
:::

### The terms
| Term | Meaning | Pavlov's example |
|---|---|---|
| **Unconditioned stimulus (UCS)** | Triggers a response without any learning | Food in the mouth |
| **Unconditioned response (UCR)** | The natural, unlearned response | Salivation to food |
| **Neutral stimulus (NS)** | Produces no relevant response at first | A metronome or bell |
| **Conditioned stimulus (CS)** | The once-neutral stimulus, after pairing with the UCS | The bell, after training |
| **Conditioned response (CR)** | The learned response to the CS | Salivation to the bell |

The CR is usually similar to the UCR but not identical: it is often weaker, and sometimes it is a preparation for the UCS rather than a copy of the response to it.

:::widget conditioning
{"kind": "classical", "title": "Watch Pavlov's dog learn", "caption": "Press Play. Notice the moment the bell alone starts the drooling, and what happens when the bell keeps ringing with no food."}
:::

:::widget sort
{
  "prompt": "Every evening at 7, your pressure cooker whistles three times, and dinner follows. Now you feel hungry at the whistle even when someone else is cooking. Label each part.",
  "buckets": ["UCS", "UCR", "CS", "CR"],
  "items": [
    { "text": "The food", "bucket": 0 },
    { "text": "Hunger and salivation when you eat", "bucket": 1 },
    { "text": "The cooker whistle, after many evenings", "bucket": 2 },
    { "text": "Feeling hungry at the whistle", "bucket": 3 }
  ]
}
:::

:::widget flow
{
 "title": "Classical conditioning in three stages",
 "layout": "chain",
 "nodes": [
  {
   "id": "b1",
   "label": "Before: food → salivation",
   "detail": "The unconditioned stimulus (food) produces the unconditioned response (salivation) with no learning."
  },
  {
   "id": "b2",
   "label": "Before: bell → nothing",
   "detail": "The bell is a neutral stimulus. The dog may turn its head, but does not salivate."
  },
  {
   "id": "d",
   "label": "During: bell, then food",
   "detail": "The bell is sounded just before food arrives, many times. The bell comes to predict food."
  },
  {
   "id": "a",
   "label": "After: bell → salivation",
   "detail": "The bell is now a conditioned stimulus, and salivation to it is a conditioned response."
  }
 ],
 "caption": "Play it through, then try it with the pressure-cooker example below."
}
:::

### The basic phenomena
- **Acquisition**: the CR grows over repeated CS-UCS pairings. Learning is fastest when the CS comes **just before** the UCS and reliably predicts it.
- **Extinction**: if the CS is repeatedly presented **without** the UCS, the CR fades.
- **Spontaneous recovery**: after a rest, an extinguished CR comes back, usually weaker. Extinction suppresses the old learning; it does not erase it.
- **Stimulus generalisation**: stimuli similar to the CS also produce the CR, less strongly the less similar they are.
- **Stimulus discrimination**: with training, the animal responds to the CS and not to similar stimuli that are never followed by the UCS.

:::widget timeline
{"prompt": "Put the steps of a Pavlov-style experiment in the order they happen in the lab.", "events": [{"label": "Bell alone: the dog only pricks up its ears", "when": "Before"}, {"label": "Bell rings, then food arrives, many times", "when": "Pairing"}, {"label": "Bell alone now makes the dog salivate", "when": "Test"}, {"label": "Bell rings again and again with no food, and salivation fades", "when": "Extinction"}, {"label": "After a night's rest, the bell brings back some salivation", "when": "Next day"}], "why": "Neutral at first, then paired, then a conditioned response, then extinction, then spontaneous recovery. The last step is the clue that extinction hides the old learning rather than wiping it out."}
:::

:::widget guess
{
  "prompt": "A dog's salivation to a bell has been completely extinguished. The dog rests overnight. Next morning the bell rings again. What percentage of the original salivation do you predict will return?",
  "min": 0,
  "max": 100,
  "step": 5,
  "unit": "%",
  "answer": [20, 60],
  "reveal": "Some of it comes back, usually less than the original: this is spontaneous recovery. The exact amount varies, but it is rarely zero. The lesson for therapy is important: a fear that has 'gone' after exposure can return, so relapse prevention matters."
}
:::

### Little Albert: conditioned fear
John B. Watson and Rosalie Rayner (1920) showed an 11-month-old boy, "Albert B.", a white rat; he reached for it happily. Then, each time he touched the rat, they struck a steel bar loudly behind his head. After seven pairings, Albert cried and crawled away at the sight of the rat alone. His fear **generalised** to a rabbit, a dog, a fur coat and a Santa Claus mask.

:::trap Little Albert is famous, not a model study
One child, no proper measurement, no attempt to remove the fear before he left, and serious ethical problems. Today's ethics committees would never allow it. Use it to illustrate conditioned fear and generalisation, and always add the critique.
:::

:::example Conditioning in everyday Indian life
A student who failed a mathematics test after a teacher shouted at her may feel her stomach tighten at the smell of chalk or the sight of the classroom. A patient who had chemotherapy in a ward that smelt of a particular disinfectant may feel nauseous on smelling it in a shop. A child who gets sweets every time the temple bell rings starts to smile at the sound.
:::

:::recall
1. In Pavlov's study, what were the UCS, UCR, CS and CR? || Food; salivation to food; the bell after pairing; salivation to the bell.
2. What is extinction? || The fading of the CR when the CS is repeatedly given without the UCS.
3. What does spontaneous recovery show? || Extinction suppresses rather than erases the original learning.
4. What did Little Albert show, and what are its weaknesses? || Fear can be conditioned and generalises; one child, poor measurement, unethical, never deconditioned.
:::

:::mcq
Q: After a dog bite, a child fears all dogs, including small puppies. This is:
- *Stimulus generalisation
- Spontaneous recovery
- Stimulus discrimination
- Extinction
> The conditioned fear spreads to stimuli similar to the original CS.
:::

:::widget figure
{"id": "little-albert"}
:::

## 1.3 Operant conditioning: learning from consequences [core][starting]
Around 1898, **Edward Thorndike** put hungry cats in **puzzle boxes** that opened when the cat pulled a loop or pressed a lever. Over trials, the cats escaped faster, not by sudden understanding but gradually, as useless moves dropped out. His **law of effect**: responses followed by satisfying consequences become more likely; those followed by discomfort become less likely.

**B. F. Skinner** (1938) built the **operant chamber** (the "Skinner box"), in which a rat presses a lever or a pigeon pecks a key, and a **cumulative recorder** draws the rate of responding over time. He called the behaviour an **operant**, because it operates on the environment.

:::widget conditioning
{"kind": "operant", "title": "Watch a rat learn from consequences", "caption": "Press Play. Watch how the pressing rate climbs when presses pay off, and what happens to it when food stops."}
:::

:::widget figure
{"id": "skinner-box"}
:::

### Reinforcement and punishment
**Reinforcement** always **increases** a behaviour; **punishment** always **decreases** it. **Positive** means something is **added**; **negative** means something is **removed**.
| | Something added | Something removed |
|---|---|---|
| **Behaviour increases** | **Positive reinforcement**: praise after a correct answer | **Negative reinforcement**: the seat-belt alarm stops when you buckle up |
| **Behaviour decreases** | **Positive punishment**: a fine for jumping a red light | **Negative punishment**: phone taken away after rudeness |

:::widget sort
{
  "prompt": "Name the consequence. Remember: reinforcement increases behaviour; negative means something is taken away.",
  "buckets": ["Positive reinforcement", "Negative reinforcement", "Positive punishment", "Negative punishment"],
  "items": [
    { "text": "A worker gets a Diwali bonus for meeting targets, and keeps meeting them", "bucket": 0 },
    { "text": "You take a painkiller and the headache goes away, so you take one sooner next time", "bucket": 1, "why": "The headache (unpleasant) is removed, and the behaviour becomes more likely: negative reinforcement." },
    { "text": "A driver is fined for jumping a signal and stops doing it", "bucket": 2 },
    { "text": "A teenager loses her phone for a week after lying, and lies less", "bucket": 3 },
    { "text": "A child cleans his room so that his mother stops nagging", "bucket": 1 },
    { "text": "A footballer is shown a red card and sent off for a foul, and fouls less", "bucket": 3, "why": "Playing time (something wanted) is removed." },
    { "text": "A toddler touches a hot iron, gets burnt, and avoids it", "bucket": 2 }
  ]
}
:::

:::trap Negative reinforcement is not punishment
This is the most common exam trap. Negative reinforcement **increases** a behaviour by **removing** something unpleasant. If the behaviour goes up, it is reinforcement, whatever the sign.
:::

### Shaping
Skinner taught pigeons to turn circles, and even to play a kind of ping-pong, by **shaping**: reinforcing **successive approximations** to the target behaviour. A speech therapist shapes a child's speech by first praising any sound, then sounds close to the word, then the word.

:::widget flow
{"title": "Shaping a pigeon to turn a full circle", "layout": "chain", "nodes": [{"id": "a", "label": "Any slight turn of the head to the left", "detail": "At first, reward the smallest hint of the target. The pigeon gets grain for even a tiny head movement in the right direction."}, {"id": "b", "label": "A clear quarter turn", "detail": "Now small head turns earn nothing. Only bigger turns are rewarded, so the bird starts turning further."}, {"id": "c", "label": "A half turn", "detail": "The bar is raised again. Each step asks a little more than the last one."}, {"id": "d", "label": "A full circle", "detail": "Only the complete behaviour is rewarded now. A behaviour the bird never showed at the start has been built piece by piece."}], "edgeLabels": {"a>b": "raise the bar", "b>c": "raise the bar", "c>d": "raise the bar"}, "caption": "Shaping means rewarding closer and closer approximations. The same idea helps a child with autism learn to say a word, one sound at a time."}
:::

### The Premack principle
David Premack (1959): a **more-preferred activity can reinforce a less-preferred one**. "Finish your homework, then you can play cricket." Parents in every culture discovered this long before he named it.

:::widget decide
{
  "scene": "In a supermarket in Lucknow, four-year-old Ishaan screams for a chocolate at the checkout. His embarrassed mother gives it to him to quieten him. This has happened every week for a month.",
  "ask": "What is the learning-theory reading, and the best plan?",
  "choices": [
    { "label": "Ishaan's screaming is positively reinforced by the chocolate, and his mother's giving in is negatively reinforced by the screaming stopping; plan ahead, praise calm behaviour, and do not give in to screaming", "verdict": "best", "outcome": "The first trips are hard: the screaming briefly gets worse before it fades. Within weeks, checkout trips are calm.", "why": "Two-way reinforcement keeps the cycle going. Extinction (no reward for screaming) plus reinforcing the alternative works, but expect an 'extinction burst' first." },
    { "label": "Smack him so he learns not to scream", "verdict": "harm", "outcome": "He screams less in front of his mother but becomes more aggressive with his younger cousin.", "why": "Physical punishment suppresses behaviour without teaching an alternative, models aggression, and harms the relationship. It is also legally prohibited in many settings." },
    { "label": "Give in sometimes and refuse sometimes, to be fair", "verdict": "harm", "outcome": "The screaming becomes even more persistent.", "why": "Unpredictable reinforcement (a variable schedule) makes behaviour most resistant to extinction. You will meet this in the section on schedules." }
  ]
}
:::

:::recall
1. State Thorndike's law of effect. || Responses followed by satisfying consequences are strengthened; those followed by discomfort are weakened.
2. What do positive and negative mean in operant terms? || Positive: something is added. Negative: something is removed.
3. Give an example of negative reinforcement. || Buckling the seat belt to stop the alarm; taking a painkiller to remove a headache.
4. What is shaping? || Reinforcing successive approximations to a target behaviour.
5. State the Premack principle. || A preferred activity can reinforce a less-preferred one.
:::

:::mcq
Q: A woman with a fear of lifts always takes the stairs, and her anxiety drops each time she avoids the lift. Her avoidance is maintained by:
- Positive reinforcement
- Positive punishment
- *Negative reinforcement
- Negative punishment
> Avoidance removes anxiety (something unpleasant), so the avoiding behaviour increases.
:::

## 1.4 Memory: getting in, staying in, getting out [core][starting]
Memory is the capacity to **encode**, **store** and **retrieve** information.
- **Encoding**: getting information in, in a form the brain can use (as sounds, images or meanings).
- **Storage**: keeping it over time.
- **Retrieval**: getting it back out when needed.

A failure at any stage looks like "forgetting". You may never have encoded the name of a person introduced at a wedding (you were looking at the food), or you encoded it but cannot retrieve it now (it is on the tip of your tongue).

### Three stores in a row
The best-known model (Atkinson and Shiffrin, 1968) has three stores:
| Store | How long | How much | Kept going by |
|---|---|---|---|
| **Sensory memory** | Under a second (vision) to a few seconds (hearing) | Large | Nothing; it fades or is attended |
| **Short-term memory** | About 15 to 30 seconds without rehearsal | About seven items, or fewer chunks | Rehearsal (repeating it) |
| **Long-term memory** | Minutes to a lifetime | Effectively unlimited | Meaningful encoding |

:::widget memoryflow
{"title": "Follow one phone number through memory", "caption": "Press Play. Information you do not attend to is lost in the first box. What you rehearse stays in working memory; what you encode with meaning reaches long-term memory, and comes back out when retrieved."}
:::

### Three ways to measure what is remembered
- **Recall**: produce the information with few cues ("Name the founder of psychophysics"). The hardest.
- **Recognition**: pick it out from options (an MCQ). Easier.
- **Relearning (savings)**: how much faster you learn something the second time. Even "forgotten" material is relearnt faster, so some trace remained.

### The first experiment on memory
Hermann Ebbinghaus (1885) learned lists of **nonsense syllables** (like DAX, BUP, ZOL), so that meaning would not help, and tested himself after different delays using the savings method.

:::widget guess
{
  "prompt": "Ebbinghaus learned lists of nonsense syllables perfectly, then measured how much he still retained (by savings in relearning). How much was left after one day?",
  "min": 0,
  "max": 100,
  "step": 5,
  "unit": "%",
  "answer": [25, 40],
  "reveal": "About a third. He lost over 40 percent within the first 20 minutes and over half within an hour, then forgetting slowed sharply: about a quarter was still there after six days and about a fifth after a month. Forgetting is fast at first, then levels off. A careful replication in 2015 found almost the same curve."
}
:::

:::widget curve
{
 "kind": "forgetting",
 "title": "The forgetting curve, and what spaced reviews do",
 "caption": "Watch how fast memory falls after one study session. Then add reviews: each one lifts retention, and the curve after it falls more slowly. Spacing reviews further apart, as memory starts to fade, gives the flattest curve."
}
:::

### Study tips that come straight from memory research
- **Test yourself** rather than reread. Retrieving strengthens memory (the **testing effect**).
- **Space it out**. Three short sessions on different days beat one long session (the **spacing effect**).
- **Make it meaningful**. Link new ideas to what you know and to examples; ask "why?".
- **Mix related topics** (interleave): practise classical and operant questions together so you learn to tell them apart.

:::widget compare
{"title": "Two ways to prepare for the same exam", "a": {"label": "Cramming", "points": ["One long session the night before", "Rereading the notes again and again", "One topic at a time, in blocks", "Feels fluent and easy"], "summary": "Cramming feels good on the night but fades fast. Rereading creates a feeling of knowing, not durable memory."}, "b": {"label": "Spaced and tested", "points": ["Short sessions spread over several days", "Closing the book and recalling from memory", "Topics mixed together", "Feels harder and slower"], "summary": "Spacing, self-testing and mixing feel effortful, but that effort is exactly what makes memories last."}, "caption": "The study method that feels easier is usually the one that works less well."}
:::

:::widget guess
{
  "prompt": "Students read a short passage. One group then reread it three more times; another reread it once and took three recall tests. A week later, what percentage of ideas did the testing group recall? (The rereading group recalled about 40 percent.)",
  "min": 20,
  "max": 90,
  "step": 5,
  "unit": "%",
  "answer": [55, 65],
  "reveal": "About 61 percent, roughly half as much again as the rereading group (Roediger and Karpicke, 2006). Five minutes after studying, the rereaders did slightly better and felt more confident, which is why rereading feels effective but is not."
}
:::

:::recall
1. Name the three stages of memory processing. || Encoding, storage, retrieval.
2. Name the three stores in the Atkinson-Shiffrin model. || Sensory memory, short-term memory, long-term memory.
3. Why did Ebbinghaus use nonsense syllables? || To remove the help of meaning and prior knowledge.
4. Describe the shape of the forgetting curve. || Steep loss at first, then levelling off.
5. What is the testing effect? || Retrieving information strengthens memory more than restudying it.
:::

:::mcq
Q: A student cannot recall the name of a theorist, but immediately picks it from four options. This shows that:
- Relearning is the most sensitive measure
- The memory was never encoded
- Short-term memory has failed
- *Recognition is usually easier than recall
> Recognition provides the cue that recall lacks.
:::

## 1.5 Level check · Starting [core][starting]
Score 80 percent or more to open the Beginner level. If you already know this, take it now to skip ahead.

:::mcq
Q: Which change is NOT considered learning?
- Avoiding a food after it made you ill
- Learning a new route to work
- *Feeling drowsy after a heavy meal
- Getting used to traffic noise
> A temporary state change is not a relatively permanent change from experience.

Q: You stop noticing the ticking of a clock in your room. This is:
- *Habituation
- Sensitisation
- Extinction
- Shaping
> A response to a repeated harmless stimulus weakens.

Q: In Pavlov's experiment, salivation to food is the:
- Conditioned response
- Conditioned stimulus
- Unconditioned stimulus
- *Unconditioned response
> The natural, unlearned reaction is the UCR.

Q: After conditioning, the bell alone produces salivation. The bell is now the:
- Unconditioned stimulus
- *Conditioned stimulus
- Neutral stimulus
- Unconditioned response
> A neutral stimulus becomes a CS through pairing.

Q: A CR fades when the CS is repeatedly presented alone. This is:
- Generalisation
- *Extinction
- Spontaneous recovery
- Discrimination
> Extinction follows CS-alone trials.

Q: An extinguished fear returns briefly after a rest. This is:
- Generalisation
- Higher-order conditioning
- Acquisition
- *Spontaneous recovery
> Extinguished responses can recover after a delay.

Q: Little Albert's fear spread from the rat to a rabbit and a fur coat. This is:
- *Generalisation
- Extinction
- Habituation
- Discrimination
> The CR spread to similar stimuli.

Q: Who formulated the law of effect?
- Ivan Pavlov
- B. F. Skinner
- *Edward Thorndike
- John B. Watson
> Thorndike, from his puzzle-box studies with cats.

Q: Taking away a teenager's phone to reduce rudeness is:
- Positive punishment
- *Negative punishment
- Negative reinforcement
- Positive reinforcement
> Something wanted is removed to decrease a behaviour.

Q: A child does his homework faster to stop his mother's nagging. The nagging stopping is:
- Extinction
- Positive punishment
- Negative punishment
- *Negative reinforcement
> Removal of an unpleasant stimulus increases the behaviour.

Q: Reinforcing closer and closer approximations to a target behaviour is called:
- Chaining
- Generalisation
- *Shaping
- Discrimination
> Shaping builds behaviour step by step.

Q: The Premack principle states that:
- *A preferred activity can reinforce a less-preferred one
- Punishment always works better than reward
- Every response needs a primary, biological reinforcer
- Most behaviour is learned in one single trial
> High-probability behaviour reinforces low-probability behaviour.

Q: Which store holds information for about 15 to 30 seconds without rehearsal?
- Sensory memory
- Long-term memory
- *Short-term memory
- Procedural memory
> Short-term memory fades quickly unless rehearsed.

Q: Which method showed that "forgotten" material is relearnt faster?
- Recall
- *Savings
- Recognition
- Free association
> Ebbinghaus's savings method.
:::
`;
