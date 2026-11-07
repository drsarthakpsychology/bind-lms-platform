/* Module · Learning and memory, Part II (Beginner level: conditioning and learning). Original text written for VIBHA School of Psychology. */
export const part2 = String.raw`
# Part II · Beginner: conditioning and learning in depth

## 2.1 Classical conditioning: timing, extinction and its limits [core][beginner]
### Timing matters
How the CS and UCS are arranged in time decides how well conditioning works.
| Arrangement | What happens | How well it works |
|---|---|---|
| **Delay** (forward) | CS starts first and is still on when the UCS arrives | Best |
| **Trace** | CS starts and stops; a gap; then the UCS | Good with short gaps; needs the hippocampus to bridge the gap |
| **Simultaneous** | CS and UCS start together | Weak |
| **Backward** | UCS comes first, then the CS | Weakest; the CS may even signal that the UCS is over |

:::widget timeline
{"prompt": "Rank the four timing arrangements from the strongest conditioning to the weakest.", "events": [{"label": "Delay: the CS starts first and is still on when the UCS arrives", "when": "Strongest"}, {"label": "Trace: the CS starts and stops, a short gap, then the UCS", "when": "2nd"}, {"label": "Simultaneous: CS and UCS start together", "when": "3rd"}, {"label": "Backward: the UCS comes first, then the CS", "when": "Weakest"}], "why": "Conditioning is about prediction. A signal that comes before the event and overlaps it predicts best. A signal that arrives after the event predicts nothing, and may even come to mean 'it is over'."}
:::

:::widget guess
{
  "prompt": "In eyeblink conditioning (a tone followed by a puff of air to the eye), what gap between the start of the tone and the air puff gives the fastest learning?",
  "min": 0,
  "max": 5,
  "step": 0.1,
  "unit": "seconds",
  "answer": [0.2, 0.8],
  "reveal": "About half a second. For quick reflexes, the best interval is short. For taste aversion, as you will see, learning happens even when illness comes hours after the taste. The 'best' interval depends on what is being learned.",
  "clinician": "Optimal interstimulus intervals differ by preparation: roughly 250 to 500 ms for human and rabbit eyelid conditioning, seconds for conditioned fear (freezing, suppression), and up to hours for conditioned taste aversion. Trace conditioning, unlike delay conditioning, depends on the hippocampus and, in humans, on awareness of the contingency."
}
:::

### Building on conditioning
- **Higher-order (second-order) conditioning**: once a bell is a CS, pairing a light with the bell (no food) can make the light a CS too. Money, grades and brand logos acquire their pull partly this way.
- **Sensory preconditioning**: a light and a tone are paired first, with no UCS. Then only the tone is paired with food. Now the light also produces salivation: the two neutral stimuli had already become linked.

### Extinction is new learning, not erasing
Several findings show that the original learning survives extinction:
- **Spontaneous recovery**: the CR returns after time passes.
- **Renewal** (Mark Bouton): extinguish fear in context B (the clinic) and it can return in context A (home) or a new context C. Extinction is tied to where it was learned.
- **Reinstatement**: an unsignalled UCS (for example, a single fresh scare) brings back the extinguished CR.
- **Rapid reacquisition**: re-pairing the CS and UCS brings the CR back faster than first learning.

:::widget flow
{"title": "Four ways an extinguished fear comes back", "layout": "tree", "nodes": [{"id": "root", "label": "Fear extinguished in the clinic", "detail": "The fear response has faded during treatment. The old learning is still stored, held back by a new 'it is safe now' memory."}, {"id": "sr", "label": "Spontaneous recovery", "parent": "root", "detail": "Time passes. The newer safety learning weakens faster than the old fear, so some fear returns on its own."}, {"id": "rn", "label": "Renewal", "parent": "root", "detail": "A change of setting. The safety learning was tied to the clinic, so the fear returns at home or in a new place."}, {"id": "ri", "label": "Reinstatement", "parent": "root", "detail": "One fresh, unsignalled scare brings the old fear back, even without the original cue being paired again."}, {"id": "ra", "label": "Rapid reacquisition", "parent": "root", "detail": "Pairing the cue with the bad event once more brings the fear back much faster than the first time it was learned."}], "caption": "All four show the same thing: extinction is new learning laid on top of the old, not erasing it."}
:::

:::widget decide
{
  "scene": "Sneha, 29, a software tester in Pune, had a fear of dogs. Over eight sessions of gradual exposure in the clinic's garden with a calm therapy dog, her fear dropped almost to zero. Two weeks later, a stray barks at her near her home, and the fear is back.",
  "ask": "What does learning theory say, and what should the plan be?",
  "choices": [
    { "label": "The therapy failed; the fear was never really reduced", "verdict": "harm", "outcome": "Sneha loses hope and stops treatment.", "why": "The fear did fall. What she shows is renewal: extinction learned in one context does not fully transfer to another. That calls for more exposure, not giving up." },
    { "label": "This is renewal of an extinguished fear; continue exposure in several real contexts (her street, a park, a friend's house), with different dogs, and prepare her for occasional returns of fear", "verdict": "best", "outcome": "Fear falls again and stays lower across settings.", "why": "Varying contexts and stimuli during exposure makes the new 'safe' learning more general, and expecting relapses reduces their impact. This is the inhibitory-learning approach to exposure." },
    { "label": "Switch to medicine only, since behaviour therapy does not last", "verdict": "ok", "outcome": "Medicine may help anxiety in general, but specific phobias respond best to exposure.", "why": "For specific phobias, exposure is the treatment of choice. A setback is a reason to strengthen it, not abandon it." }
  ]
}
:::

### Counterconditioning: Peter and the rabbit
Mary Cover Jones (1924), sometimes called "the mother of behaviour therapy", worked with Peter, a three-year-old afraid of rabbits. While Peter ate food he liked, a caged rabbit was brought a little closer each day. Pleasure from eating gradually replaced fear: **counterconditioning**. This was the forerunner of Joseph Wolpe's systematic desensitisation.

### The generalisation gradient
The more a stimulus resembles the CS, the stronger the CR. Plotting response strength against similarity gives a **generalisation gradient**. Discrimination training makes the gradient steeper. In anxiety disorders, gradients are often abnormally flat: fear spreads to things only loosely similar to the original threat.

:::recall
1. Which temporal arrangement gives the strongest conditioning? || Delay (forward) conditioning, with the CS overlapping the start of the UCS.
2. What is sensory preconditioning? || Two neutral stimuli are paired; one is then conditioned; the other also produces the CR.
3. Name four findings that show extinction does not erase learning. || Spontaneous recovery, renewal, reinstatement, rapid reacquisition.
4. What did Mary Cover Jones do? || Counterconditioned a child's fear of rabbits by pairing the rabbit with eating.
:::

:::mcq
Q: A patient's fear of injections is extinguished in the clinic, but it returns when she visits a different hospital. This is called:
- Reinstatement
- Sensory preconditioning
- Spontaneous recovery
- *Renewal
> Return of an extinguished response when the context changes is renewal.

Q: In which arrangement is conditioning usually weakest?
- *Backward conditioning
- Trace conditioning
- Simultaneous conditioning
- Delay conditioning
> When the UCS comes first, the CS predicts nothing useful.
:::

## 2.2 Operant conditioning in depth [core][beginner]
### Thorndike's three laws
1. **Law of effect**: satisfying consequences strengthen a response; discomfort weakens it. (Later he gave up the "discomfort weakens" half.)
2. **Law of exercise**: connections strengthen with use and weaken with disuse. (Later abandoned as largely false without effect.)
3. **Law of readiness**: when an organism is prepared to act, acting is satisfying and being blocked is annoying.

Thorndike called his approach **connectionism**: learning as stamping in **stimulus-response bonds**. His cats showed **trial-and-error** learning: a gradual decline in escape time, not sudden insight.

### Types of reinforcer
- **Primary reinforcers** satisfy biological needs: food, water, warmth, relief from pain.
- **Secondary (conditioned) reinforcers** gain power by being paired with primary ones: praise, marks, a gold star.
- **Generalised reinforcers** are linked to many primary reinforcers: money, tokens, social approval.

### Shaping, chaining and stimulus control
- **Chaining**: linking simple behaviours into a sequence, each step reinforced by the chance to do the next. Teaching a child with intellectual disability to brush her teeth is often done by **backward chaining**: she first learns the last step (rinsing) and gets praised, then the last two steps, and so on.
- **Discriminative stimulus (S^D)**: a signal that a response will now be reinforced. The "open" sign on a shop, a teacher's raised hand.
- **Stimulus control**: behaviour occurs in the presence of the S^D and not in its absence.

### Escape and avoidance
- **Escape**: a response ends an aversive stimulus already present (leaving a hot room).
- **Avoidance**: a response prevents an aversive stimulus from arriving (leaving before the meeting where you will be criticised).

**Mowrer's two-factor theory** (1947) explains why avoidance is so stubborn: first, fear of a cue is learned through **classical conditioning**; then avoiding the cue is **negatively reinforced** by fear reduction (**operant**). Because the person always avoids, they never discover that the feared outcome would not have happened, so the fear never extinguishes. This is the backbone of the learning model of phobias and OCD.

:::widget flow
{
 "title": "Why avoidance keeps fear alive",
 "layout": "cycle",
 "nodes": [
  {
   "id": "cue",
   "label": "Feared cue",
   "detail": "A lift, a dog, a crowded bus: a stimulus that was once paired with fear (classical conditioning)."
  },
  {
   "id": "fear",
   "label": "Anxiety rises",
   "detail": "The conditioned fear response appears."
  },
  {
   "id": "av",
   "label": "Avoid or escape",
   "detail": "Taking the stairs, crossing the road, getting off the bus."
  },
  {
   "id": "rel",
   "label": "Relief",
   "detail": "Anxiety falls at once. This relief negatively reinforces the avoidance (operant conditioning)."
  },
  {
   "id": "no",
   "label": "No new learning",
   "detail": "Because the person never stays, they never learn that the feared outcome would not have happened. The cue stays frightening."
  }
 ],
 "caption": "Mowrer's two-factor theory as a loop. Exposure therapy breaks it at the 'avoid' step."
}
:::

:::widget sort
{
  "prompt": "Escape or avoidance?",
  "buckets": ["Escape", "Avoidance"],
  "items": [
    { "text": "Leaving a crowded Delhi metro coach once panic starts", "bucket": 0 },
    { "text": "Never taking the metro at all, in case panic starts", "bucket": 1 },
    { "text": "Turning off a loud alarm", "bucket": 0 },
    { "text": "Washing hands for 20 minutes to prevent a feared illness", "bucket": 1, "why": "The ritual is meant to prevent a feared future harm, so it works like avoidance, and anxiety relief reinforces it." },
    { "text": "Taking an umbrella so as not to get soaked", "bucket": 1 },
    { "text": "Taking off a shoe that is pinching", "bucket": 0 }
  ]
}
:::

### Punishment: when and why it works poorly
Punishment can suppress behaviour, but research (Azrin and Holz, 1966) showed that to work at all it must be **immediate**, **consistent** and **strong enough from the start**, and an **alternative behaviour** must be available and reinforced. Its problems:
- It shows what not to do, not what to do.
- It suppresses behaviour mainly while the punisher is present.
- It produces fear, avoidance of the punisher, anger and aggression.
- It **models** aggression: children who are hit hit others more.

### Learned helplessness
Martin Seligman and Steven Maier (1967) used a **triadic design** with dogs: one group could end shocks by pressing a panel (escapable); a second, **yoked** group got exactly the same shocks but could do nothing; a third got no shocks. Later, in a shuttle box where jumping a low barrier escaped shock, the escapable and no-shock dogs learned quickly. Most of the yoked dogs lay down and whimpered. They had learned that **outcomes did not depend on their behaviour**. This became an influential model of depression.

:::widget flow
{"title": "The triadic design of learned helplessness", "layout": "tree", "nodes": [{"id": "p", "label": "Phase 1: three groups of dogs", "detail": "The groups differ only in whether they have control over the shocks, not in how many shocks they get."}, {"id": "e", "label": "Escapable shock", "parent": "p", "detail": "These dogs can end each shock by pressing a panel. Later, in the shuttle box, they quickly learn to jump the barrier to escape."}, {"id": "y", "label": "Yoked, inescapable shock", "parent": "p", "detail": "Each dog gets exactly the same shocks as a partner in the escapable group, but nothing it does ends them. Later, most lie down and whine, and do not try to escape even when escape is easy."}, {"id": "n", "label": "No shock", "parent": "p", "detail": "The comparison group. Later, they learn to escape normally."}], "caption": "Because the yoked group received the same shocks, the helplessness came from lack of control, not from the shocks themselves."}
:::

:::widget guess
{
  "prompt": "In Seligman and Maier's studies, what percentage of dogs that had received inescapable shock later failed to learn to escape in the shuttle box?",
  "min": 0,
  "max": 100,
  "step": 5,
  "unit": "%",
  "answer": [60, 80],
  "reveal": "About two-thirds. A third did learn to escape, a clue that individual differences matter. In humans, the reformulated theory (Abramson, Seligman and Teasdale, 1978) said that helplessness leads to depression mainly when people explain bad events as internal ('it's me'), stable ('it'll always be this way') and global ('it ruins everything').",
  "clinician": "In 2016, Maier and Seligman themselves reappraised the work and reversed the original logic at the neural level: passivity is the default mammalian response to prolonged aversive stimulation (driven by dorsal raphe serotonergic activity), and what is learned in the escapable condition is control, detected by the ventromedial prefrontal cortex, which then inhibits the raphe. Helplessness is the failure to learn control, not the learning of helplessness."
}
:::

### Superstition and the limits of reinforcement
- **Superstitious behaviour**: Skinner (1948) gave pigeons food every 15 seconds no matter what they did. Many developed odd rituals (turning, head-bobbing) that happened to precede food. A cricketer's "lucky" pad strap may arise the same way.
- **Instinctive drift**: Keller and Marian Breland, Skinner's students who trained animals commercially, found that raccoons trained to drop coins in a box began "washing" and rubbing the coins instead, and pigs rooted them. Learned behaviour drifts towards **species-typical behaviour** (Breland and Breland, 1961). Not every response can be reinforced equally easily.

:::recall
1. State Thorndike's three laws. || Effect, exercise, readiness.
2. Contrast primary, secondary and generalised reinforcers. || Primary: biological (food). Secondary: learned through pairing (praise). Generalised: linked to many reinforcers (money, tokens).
3. Explain Mowrer's two-factor theory. || Fear is classically conditioned; avoidance is negatively reinforced by fear reduction, which prevents extinction.
4. Describe the triadic design of the learned helplessness study. || Escapable shock, yoked inescapable shock, no shock; then all tested on a new escape task.
5. What is instinctive drift? || Trained behaviour drifting back towards species-typical behaviour.
:::

:::mcq
Q: A rat learns to press a lever only when a light is on, because presses with the light off are never reinforced. The light is a:
- *Discriminative stimulus
- Conditioned stimulus
- Generalised reinforcer
- Primary reinforcer
> The light signals that responding will be reinforced.

Q: Why does avoidance behaviour resist extinction, according to two-factor theory?
- It is positively reinforced by praise and attention from others
- *It stops the person learning the feared outcome won't occur
- Fear is never classically conditioned in the first place
- It is always punished, and punishment strengthens behaviour
> Fear reduction reinforces avoidance and blocks exposure to disconfirming experience.
:::

## 2.3 Schedules of reinforcement [core][beginner]
Charles Ferster and B. F. Skinner (1957) spent years recording how the **pattern** of reinforcement shapes the **pattern** of responding. This is one of the most-asked topics in Indian entrance papers.

### Continuous and partial reinforcement
- **Continuous reinforcement** (every response rewarded) is best for **learning** a new behaviour quickly.
- **Partial (intermittent) reinforcement** (only some responses rewarded) is slower to learn but **much more resistant to extinction**: the **partial reinforcement extinction effect**. If rewards have always been patchy, a run of no rewards does not signal much change.

:::widget compare
{"title": "Continuous or partial reinforcement?", "a": {"label": "Continuous", "points": ["Every correct response is rewarded", "The behaviour is learned quickly", "When rewards stop, the change is obvious", "Responding stops fast in extinction"], "summary": "Use continuous reinforcement to teach a new behaviour quickly."}, "b": {"label": "Partial", "points": ["Only some responses are rewarded", "Learning is slower at first", "A run of no rewards looks like normal", "Responding goes on for a long time in extinction"], "summary": "Switch to partial reinforcement to make the behaviour last. This is the partial reinforcement extinction effect."}, "caption": "The same logic explains why a child whose tantrums are 'sometimes' rewarded keeps trying so hard."}
:::

### The four basic schedules
| Schedule | Rule | Response pattern | Everyday example |
|---|---|---|---|
| **Fixed ratio (FR)** | Reward after a fixed number of responses | High rate, with a **pause after each reward** | Piece-rate pay: a garment worker in Tiruppur paid per 50 shirts stitched |
| **Variable ratio (VR)** | Reward after an unpredictable number of responses, averaging some value | **Highest, steadiest rate**, no pauses; most resistant to extinction | Lottery tickets, slot machines, a fisherman casting a line, pulling down to refresh a social media feed |
| **Fixed interval (FI)** | First response after a fixed time is rewarded | **Scalloped**: little responding after a reward, speeding up as the time nears | Studying hard only in the days before a fixed exam; checking the oven as baking time ends |
| **Variable interval (VI)** | First response after an unpredictable time is rewarded | Moderate, **steady** rate | Checking for a WhatsApp reply; a fisherman waiting for a bite; surprise quizzes |

:::widget flow
{
 "title": "The family tree of reinforcement schedules",
 "layout": "tree",
 "nodes": [
  {
   "id": "r",
   "label": "Reinforcement"
  },
  {
   "id": "c",
   "label": "Continuous",
   "parent": "r",
   "detail": "Every response is reinforced. Fastest learning, fastest extinction."
  },
  {
   "id": "p",
   "label": "Partial (intermittent)",
   "parent": "r",
   "detail": "Only some responses are reinforced. Slower learning, much more resistant to extinction."
  },
  {
   "id": "ra",
   "label": "Ratio (count responses)",
   "parent": "p"
  },
  {
   "id": "in",
   "label": "Interval (watch the clock)",
   "parent": "p"
  },
  {
   "id": "fr",
   "label": "Fixed ratio",
   "parent": "ra",
   "detail": "High rate with a pause after each reward."
  },
  {
   "id": "vr",
   "label": "Variable ratio",
   "parent": "ra",
   "detail": "Highest, steadiest rate; most resistant to extinction."
  },
  {
   "id": "fi",
   "label": "Fixed interval",
   "parent": "in",
   "detail": "Scalloped: slow after a reward, faster as the time nears."
  },
  {
   "id": "vi",
   "label": "Variable interval",
   "parent": "in",
   "detail": "Moderate, steady rate."
  }
 ],
 "caption": "Tap each leaf for its response pattern."
}
:::

:::mnemonic Ratio is about responses, interval is about time
**Ratio** = count the responses (faster responding = more rewards, so rates are high). **Interval** = watch the clock (responding faster does not bring the reward sooner). **Variable** = no pause (you never know when the next one is coming).
:::

:::widget sort
{
  "prompt": "Name the schedule.",
  "buckets": ["Fixed ratio", "Variable ratio", "Fixed interval", "Variable interval"],
  "items": [
    { "text": "A tea seller gets a free packet from the supplier for every 20 packets sold", "bucket": 0 },
    { "text": "Buying lottery tickets every week at the corner stall", "bucket": 1 },
    { "text": "A salaried clerk paid on the last day of every month", "bucket": 2, "why": "Strictly a salary is not contingent on a single response, but the time-based pattern (a scallop of effort before appraisals and deadlines) makes FI the usual exam answer." },
    { "text": "A teacher gives surprise tests at unpredictable times", "bucket": 3 },
    { "text": "A salesperson earns commission on some calls but never knows which", "bucket": 1 },
    { "text": "Checking the letterbox when the postman's arrival time varies from day to day", "bucket": 3 }
  ]
}
:::

:::widget decide
{
  "scene": "Arif, 31, a delivery rider in Kolkata, spends most of his evenings on an online betting app. He says, “I'm due for a big win; I've lost twenty times in a row.” His wife wants to know why he cannot just stop.",
  "ask": "What is the best explanation from learning theory?",
  "choices": [
    { "label": "Gambling pays out on a variable-ratio schedule, which produces the highest, most persistent responding and the strongest resistance to extinction; his 'due for a win' belief is the gambler's fallacy", "verdict": "best", "outcome": "His wife understands that his persistence is not simply a lack of willpower, and they seek help at a de-addiction clinic.", "why": "Unpredictable wins after an unknown number of bets build exactly the pattern seen in gambling disorder. Near-misses and app design (lights, sounds, 'almost' wins) strengthen it further. Cognitive and contingency-based treatments target both parts." },
    { "label": "He is on a fixed-ratio schedule and will stop after he wins", "verdict": "harm", "outcome": "The family waits for the win; when it comes, he bets more.", "why": "Wins are unpredictable, so it is variable ratio, and a win reinforces betting. Waiting for a win is the worst plan." },
    { "label": "It is purely about money; give him enough and he will stop", "verdict": "ok", "outcome": "Debts matter, but clearing them alone often leads to more betting.", "why": "Money problems are real, but the behaviour is maintained by its reinforcement pattern. Practical steps (blocking apps, handing over cards) work best alongside treatment." }
  ]
}
:::

:::widget guess
{
  "prompt": "Pigeons trained on lean intermittent schedules were switched to extinction (no more food). Roughly how many more pecks did some birds make before giving up, in Skinner's reports?",
  "min": 100,
  "max": 20000,
  "step": 100,
  "unit": "pecks",
  "answer": [5000, 15000],
  "reveal": "Thousands. Skinner described pigeons on lean intermittent schedules pecking in the region of 10,000 times in extinction. On continuous reinforcement, responding stops after relatively few unrewarded pecks. This is the partial reinforcement extinction effect at its most dramatic."
}
:::

### Beyond the basic four
- **Concurrent schedules**: two options, each on its own schedule. Richard Herrnstein's **matching law** (1961): the proportion of responses given to an option matches the proportion of reinforcement it provides. People split their time between activities, and between drugs and other rewards, in roughly this way.
- **Differential reinforcement**: reinforce an **alternative** behaviour (DRA), an **incompatible** behaviour (DRI), **other** behaviour or its absence over a period (DRO), or **low rates** of a behaviour (DRL). These are core tools in applied behaviour analysis.

:::clinician
The matching law underlies behavioural economic models of addiction: drug use rises when alternative reinforcers (work, relationships, leisure) are scarce or delayed, and falls when they are enriched, which is the logic of the community reinforcement approach and contingency management. Delay discounting (steeper devaluation of delayed rewards) is consistently elevated in substance use disorders, gambling and ADHD. In ABA for autism, DRA and functional communication training (teaching a request that replaces a problem behaviour serving the same function) are first-line, after a functional analysis of what maintains the behaviour.
:::

:::recall
1. What is the partial reinforcement extinction effect? || Behaviour learned under partial reinforcement extinguishes more slowly than under continuous reinforcement.
2. Which schedule gives the highest, steadiest rate? || Variable ratio.
3. Which schedule produces a scalloped cumulative record? || Fixed interval.
4. Which schedule produces a pause after each reward? || Fixed ratio.
5. State Herrnstein's matching law. || The proportion of responses to an option matches the proportion of reinforcement it provides.
:::

:::mcq
Q: Students study little at the start of term and furiously just before fixed exam dates. Their study pattern resembles which schedule?
- Variable ratio
- Fixed ratio
- *Fixed interval
- Variable interval
> Responding that rises as a predictable time approaches gives the FI scallop.

Q: Which arrangement would make a behaviour most resistant to extinction?
- Continuous reinforcement
- Fixed interval reinforcement
- Fixed ratio with a small ratio
- *Variable ratio reinforcement
> Unpredictable reward after a variable number of responses is the most persistent.
:::

## 2.4 Cognitive and observational learning [core][beginner]
Strict behaviourists said learning was the strengthening of stimulus-response links. Three lines of work showed that **knowledge and expectation** are learned too.

### Tolman: cognitive maps and latent learning
Edward Tolman called himself a **purposive behaviourist**: behaviour is goal-directed, and animals learn **what leads to what**, not just which movements to make.
- **Latent learning** (Tolman and Honzik, 1930): three groups of rats ran a complex maze daily. Group 1 always found food at the end; group 2 never did; group 3 found no food for ten days, then food from day 11.
- **Place learning**: rats trained to find food by a route will take a novel shortcut when the usual path is blocked, as if using a **cognitive map**.

:::widget reveal
{
  "prompt": "Predict: in Tolman and Honzik's study, what happened to the errors of group 3 (no food for ten days) on the day after food was first introduced?",
  "answer": "Their errors dropped at once, to the level of (and soon slightly below) the group that had always been fed. They must have learned the maze during the unrewarded days, without showing it. Reinforcement affects performance; learning can happen without it. This is latent learning."
}
:::

### Köhler: insight
Wolfgang Köhler, a Gestalt psychologist stranded on Tenerife during the First World War, studied chimpanzees. Sultan, his cleverest, faced bananas out of reach. After failing, he sat, apparently thinking, then suddenly **joined two sticks** to reach the fruit; others stacked **boxes**. Köhler's **insight learning** (described in his 1925 book on the minds of apes) has four marks: a **sudden** solution after a pause, smooth and complete performance once found, **retention** on later trials, and **transfer** to similar problems. This contrasts with Thorndike's gradual trial and error.

Harry Harlow (1949) found that monkeys given hundreds of different two-choice discrimination problems got faster and faster at new ones, until they solved them in a single trial: they had formed a **learning set**, "learning to learn". Some of what looks like insight may build on earlier learning.

### Bandura: observational learning
Albert Bandura argued that most human learning happens by **watching others** (**modelling**), without direct reinforcement.

**The Bobo doll studies.** Bandura, Ross and Ross (1961) had 72 nursery children (aged about 3 to 6) watch an adult either attack a large inflatable Bobo doll in specific, novel ways (hitting it with a mallet, saying "Pow!") or play quietly. Later, after a mild frustration, children who saw the aggressive model imitated many of the exact acts; those who saw the quiet model, or none, rarely did. Boys were more physically aggressive than girls, and children copied same-sex models more. In 1963, filmed and cartoon models produced similar effects.

:::widget reveal
{
  "prompt": "Bandura (1965) showed children a film in which the aggressive model was either rewarded, punished or faced no consequence. First, children were left alone with Bobo; then they were offered stickers and juice for every act they could copy. Predict both results.",
  "answer": "Alone, children who had seen the model punished copied less aggression than the other two groups. But when offered rewards for imitating, all three groups copied almost equally. Every group had learned the behaviour; seeing punishment affected only whether they performed it. This is the learning-performance distinction, and it shows vicarious reinforcement and punishment at work."
}
:::

**Four processes** are needed for observational learning:
1. **Attention**: noticing the model (models who are similar, attractive, high-status or rewarded get more attention).
2. **Retention**: storing what was seen, in images or words.
3. **Reproduction**: having the physical and mental ability to perform it.
4. **Motivation**: a reason to perform it, from direct, vicarious or self-reinforcement.

:::widget flow
{
 "title": "Bandura's four steps of observational learning",
 "layout": "chain",
 "nodes": [
  {
   "id": "at",
   "label": "Attention",
   "detail": "The learner must notice the model. Similar, admired or rewarded models are watched more."
  },
  {
   "id": "re",
   "label": "Retention",
   "detail": "What was seen is stored as images or words, and rehearsed."
  },
  {
   "id": "rp",
   "label": "Reproduction",
   "detail": "The learner must be physically and mentally able to do it."
  },
  {
   "id": "mo",
   "label": "Motivation",
   "detail": "Direct, vicarious or self-reinforcement decides whether the learned act is performed."
  }
 ],
 "edgeLabels": {
  "rp>mo": "learning becomes performance only here"
 },
 "caption": "A break at any step stops the behaviour from appearing."
}
:::

Bandura later built **social cognitive theory**: **reciprocal determinism** (person, behaviour and environment influence each other) and **self-efficacy**, a person's belief that they can carry out a task. Self-efficacy grows from four sources: mastery experiences (the strongest), vicarious experience, verbal persuasion, and the person's physiological and emotional state.

:::widget sort
{
  "prompt": "Which of Bandura's four processes is missing in each case?",
  "buckets": ["Attention", "Retention", "Reproduction", "Motivation"],
  "items": [
    { "text": "A child watches a cooking show but cannot lift the heavy kadai", "bucket": 2 },
    { "text": "A trainee was scrolling on her phone while her supervisor demonstrated the MSE", "bucket": 0 },
    { "text": "A boy knows how his cousin bowls a googly but sees no point in trying it", "bucket": 3 },
    { "text": "A student watched a yoga demonstration a month ago and can no longer recall the sequence", "bucket": 1 }
  ]
}
:::

:::clinician
Modelling is an active ingredient in several treatments: participant modelling (the therapist demonstrates, then guides the client through, approach to a feared object) outperformed symbolic modelling and desensitisation for snake phobia in Bandura, Blanchard and Ritter (1969). Self-efficacy predicts outcomes in smoking cessation, alcohol relapse prevention (Marlatt) and chronic disease self-management. The media-violence debate is still live: meta-analyses show small, reliable short-term associations between violent media and aggressive thoughts and behaviour, with disputed real-world significance. In India, public-health "entertainment-education" serials (from *Hum Log* in the 1980s onwards) were explicitly built on Bandura's modelling principles.
:::

:::recall
1. What is latent learning? || Learning that occurs without reinforcement and is not shown until there is a reason to perform it.
2. List the four marks of Köhler's insight learning. || Sudden solution after a pause, smooth performance, retention, transfer.
3. What is a learning set? || Learning to learn: faster solving of new problems of the same type (Harlow).
4. Name Bandura's four processes of observational learning. || Attention, retention, reproduction, motivation.
5. Name the four sources of self-efficacy. || Mastery experiences, vicarious experience, verbal persuasion, physiological and emotional states.
:::

:::mcq
Q: Rats explore a maze without food for ten days, then rapidly find the food once it is introduced. This shows:
- Insight learning
- Spontaneous recovery
- Shaping
- *Latent learning
> Learning occurred without reinforcement and appeared once there was a reason.

Q: In Bandura's 1965 study, offering incentives made children in all three groups imitate equally. This shows:
- *Learning and performance are not the same thing
- Seeing a model punished prevents any learning
- Filmed and cartoon models have no effect on children
- Aggression in children is mostly an innate drive
> All groups had learned; consequences affected only performance.
:::

## 2.5 Behaviour modification: from principles to practice [core][beginner]
**Behaviour modification** applies learning principles to change behaviour. It always starts with a **functional analysis**, often written as **A-B-C**:
- **Antecedents**: what comes before (place, people, time, triggers).
- **Behaviour**: what exactly the person does, defined so it can be counted.
- **Consequences**: what follows and may be maintaining it (attention, escape from a task, sensory pleasure, access to something).

### Techniques built on classical conditioning
- **Systematic desensitisation** (Joseph Wolpe, 1958): based on **reciprocal inhibition**, the idea that relaxation and anxiety cannot occur together. Steps: train deep muscle relaxation (Jacobson's progressive relaxation); build a **hierarchy** of feared situations rated in **SUDS** (subjective units of distress, 0 to 100); then pair each step, from the lowest, with relaxation, in imagination or in real life, moving up only when a step causes little anxiety.
- **Exposure and flooding**: prolonged contact with the feared stimulus, without escape, until fear falls. Flooding starts near the top of the hierarchy. **Exposure and response prevention** is the core of OCD treatment.
- **Aversion therapy**: pairing an unwanted behaviour with an unpleasant stimulus (historically, emetics with alcohol). It has weak long-term effects and serious ethical problems, and its past use to "treat" homosexuality is now recognised as harmful and unethical. **Covert sensitisation** (Cautela) uses imagined aversive consequences instead.

:::widget flow
{
 "title": "Systematic desensitisation, step by step",
 "layout": "chain",
 "nodes": [
  {
   "id": "as",
   "label": "Assessment",
   "detail": "Define the fear and what maintains it; agree goals."
  },
  {
   "id": "rx",
   "label": "Relaxation training",
   "detail": "Progressive muscle relaxation is practised until the client can relax quickly."
  },
  {
   "id": "hi",
   "label": "Build a hierarchy",
   "detail": "Ten to fifteen situations rated in SUDS from 0 to 100, from mild to most feared."
  },
  {
   "id": "pa",
   "label": "Pair, step by step",
   "detail": "While relaxed, the client imagines or meets the lowest step until it causes little anxiety, then moves up."
  },
  {
   "id": "ge",
   "label": "Generalise",
   "detail": "Practise in real life and in varied settings, so the new calm response transfers."
  }
 ],
 "caption": "Reciprocal inhibition: relaxation and anxiety cannot occur together."
}
:::

### Techniques built on operant conditioning
- **Token economy** (Ayllon and Azrin, 1968, on a ward for long-stay psychiatric patients): tokens earned for target behaviours (self-care, ward tasks) are exchanged for privileges. Widely used in special schools in India and elsewhere for children with intellectual disability and autism, and in residential settings.
- **Contingency management**: vouchers or prizes for verified drug-free urine samples. It has some of the strongest evidence of any treatment for stimulant use.
- **Time out** from positive reinforcement; **response cost** (losing tokens or privileges).
- **Shaping and chaining** for new skills; **differential reinforcement** for problem behaviour.
- **Biofeedback**: making a body signal (muscle tension, heart rate, skin temperature) visible, so it can be shaped.
- **Habit reversal** for tics and hair-pulling: awareness training plus a **competing response**.

### Techniques built on observational learning
- **Modelling** and **participant modelling**, **behavioural rehearsal**, **social skills training** (role play with feedback).

:::widget sort
{
  "prompt": "Which learning principle does each technique mainly use?",
  "buckets": ["Classical conditioning", "Operant conditioning", "Observational learning"],
  "items": [
    { "text": "Systematic desensitisation for fear of heights", "bucket": 0 },
    { "text": "A token chart for a child with ADHD to complete homework", "bucket": 1 },
    { "text": "A therapist demonstrates saying 'no' to a pushy relative, then the client practises", "bucket": 2 },
    { "text": "Vouchers for drug-free urine samples", "bucket": 1 },
    { "text": "Pairing the taste of alcohol with a nausea-inducing drug", "bucket": 0 },
    { "text": "Group social skills training for adolescents with autism using video models", "bucket": 2 }
  ]
}
:::

:::widget decide
{
  "scene": "In a residential special school in Chennai, Kavin, 11, with moderate intellectual disability, hits his head on the table several times a day. Staff have been rushing to comfort him each time.",
  "ask": "What should the team do first?",
  "choices": [
    { "label": "Start a token economy to reward non-hitting periods", "verdict": "ok", "outcome": "There is some improvement, but the hitting continues in certain lessons.", "why": "Reinforcing the absence of the behaviour (DRO) can help, but without knowing what the hitting achieves for Kavin, the plan may miss its function." },
    { "label": "Do a functional analysis: record antecedents and consequences to find what the head-hitting achieves (attention, escape from hard tasks, sensory input, or pain), and check for medical causes", "verdict": "best", "outcome": "Records show it happens mostly when writing tasks begin and stops when he is removed from the task: escape. A dental abscess is also found and treated. The plan teaches him to ask for a break with a card, and tasks are made easier at first.", "why": "Self-injury serves a function, and a medical cause (pain) must be excluded first. Treatment matched to function, with a replacement behaviour, works best." },
    { "label": "Use mild punishment each time he hits his head", "verdict": "harm", "outcome": "The hitting reduces when a certain staff member is present but continues at other times, and he becomes fearful.", "why": "Punishment without understanding the function, in a child who may be in pain or overwhelmed, is ineffective and ethically unacceptable as a first step." }
  ]
}
:::

:::recall
1. What is a functional analysis? || Identifying the antecedents and consequences that trigger and maintain a behaviour (A-B-C).
2. On what principle is systematic desensitisation based? || Reciprocal inhibition: relaxation and anxiety are incompatible.
3. Who introduced the token economy on a psychiatric ward? || Ayllon and Azrin (1968).
4. What is contingency management? || Giving vouchers or prizes for verified abstinence (or other target behaviour).
5. What are the two parts of habit reversal? || Awareness training and a competing response.
:::

:::mcq
Q: A therapist teaches a client to relax deeply, builds a ten-step fear hierarchy, and moves up one step at a time. This is:
- Flooding with prolonged exposure
- *Systematic desensitisation
- Aversion therapy with an emetic
- Covert sensitisation in imagination
> Relaxation paired with a graded hierarchy is Wolpe's method.
:::
`;
