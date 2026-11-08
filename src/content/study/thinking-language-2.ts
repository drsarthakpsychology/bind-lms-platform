/* Module · Thinking, language, intelligence and creativity, Part II (Beginner level: thinking and language). Original text written for VIBHA School of Psychology. */
export const part2 = String.raw`
# Part II · Beginner: thinking, deciding and language

## 2.1 Concepts and categories [core][beginner]
Concepts let us treat new things as instances of the familiar: once you know "fruit", you know a new fruit can be eaten. How concepts are represented is a classic exam question with four answers.

| View | A concept is | Strength | Problem |
|---|---|---|---|
| **Classical (defining features)** | A list of necessary and sufficient features ("a bachelor is an unmarried adult male") | Fits formal concepts (triangle, prime number) | Most natural concepts have no defining list: what feature do all "games" share? (Wittgenstein's **family resemblance**) |
| **Prototype** (Eleanor Rosch, 1970s) | An abstract "best example" or average; members are judged by similarity to it | Explains **typicality effects**: a sparrow is judged a bird faster than a penguin; typical members are named first and learned earlier | Ignores variability and knowledge of particular members |
| **Exemplar** | Stored memories of many actual members; a new item is compared with all of them | Captures variability and unusual members (you know some dogs are tiny) | Heavy on memory; how are exemplars chosen? |
| **Theory (knowledge)-based** | Concepts are embedded in our explanations of the world | Explains why we classify a raccoon surgically altered to look like a skunk as still a raccoon (Keil): its "inside" matters | Harder to test precisely |

:::widget flow
{
 "title": "Four views of how concepts are stored",
 "layout": "tree",
 "nodes": [
  {
   "id": "c",
   "label": "A concept is"
  },
  {
   "id": "cl",
   "label": "A definition",
   "parent": "c",
   "detail": "Classical view: necessary and sufficient features. Fits triangles, not birds."
  },
  {
   "id": "pr",
   "label": "A best example",
   "parent": "c",
   "detail": "Prototype view: an average; explains why a sparrow feels more 'bird' than a penguin."
  },
  {
   "id": "ex",
   "label": "Many remembered cases",
   "parent": "c",
   "detail": "Exemplar view: every member you have met; captures variety."
  },
  {
   "id": "th",
   "label": "Part of a theory",
   "parent": "c",
   "detail": "Knowledge view: what makes something what it is 'inside'."
  }
 ]
}
:::

### Levels of categories
Rosch found that categories form a hierarchy, and one level is privileged:
- **Superordinate**: furniture, vehicle, fruit.
- **Basic level**: chair, car, mango. Named first by children, used most in everyday speech, and the most informative level at which members still look alike.
- **Subordinate**: kitchen chair, Maruti Swift, Alphonso mango. Experts often shift their "basic level" downwards (a mango farmer thinks first in varieties).

:::widget sort
{
  "prompt": "Superordinate, basic or subordinate level?",
  "buckets": ["Superordinate", "Basic level", "Subordinate"],
  "items": [
    { "text": "Musical instrument", "bucket": 0 },
    { "text": "Tabla", "bucket": 1 },
    { "text": "Banarasi tabla with a brass bayan", "bucket": 2 },
    { "text": "Clothing", "bucket": 0 },
    { "text": "Saree", "bucket": 1 },
    { "text": "Kanjeevaram silk saree", "bucket": 2 }
  ]
}
:::

### How people form concepts in the laboratory
- **Clark Hull (1920)** taught people to give nonsense names to Chinese characters that shared a common radical. They learned to name new characters correctly without being able to say what the common feature was: concept learning can be **implicit**.
- **Jerome Bruner, Jacqueline Goodnow and George Austin** (1956) gave people cards varying in shape, colour, number of figures and borders, and asked them to discover a concept (for example "two red figures") by choosing cards and getting feedback. They identified strategies:
  - **Simultaneous scanning**: holding every possible hypothesis in mind and eliminating them; logically ideal but overloads memory.
  - **Successive scanning**: testing one hypothesis at a time.
  - **Conservative focusing**: taking a positive card as a focus and changing **one** feature at a time; efficient and safe.
  - **Focus gambling**: changing **several** features at once; risky, sometimes fast.

:::widget decide
{
  "scene": "A trainee in a Mysuru clinic is learning to recognise catatonia. Her supervisor wants her to be able to spot it in unusual presentations, such as an older woman with medical illness, not only the textbook young man with schizophrenia.",
  "ask": "Which teaching approach best builds a flexible concept?",
  "choices": [
    { "label": "Memorise a definition with a fixed list of features", "verdict": "ok", "outcome": "She can recite the criteria but misses a mild case on the medical ward.", "why": "A classical definition helps, but clinical concepts are fuzzy, and unusual members are missed if the concept is only a list." },
    { "label": "Show one perfect textbook case many times", "verdict": "harm", "outcome": "She builds a narrow prototype and dismisses atypical cases.", "why": "A single typical case leaves out the variability that real exemplars show." },
    { "label": "Combine the criteria with many varied examples, including atypical and borderline cases, and contrast them with look-alikes such as hypoactive delirium", "verdict": "best", "outcome": "She recognises catatonia in a medical inpatient and arranges a lorazepam challenge.", "why": "Varied exemplars plus contrasting non-examples build a concept that generalises: the exemplar and prototype views both predict this." }
  ]
}
:::

:::recall
1. What is a prototype, and what effect supports prototype theory? || A best example or average of a category; typicality effects.
2. How does exemplar theory differ from prototype theory? || Exemplar theory stores many individual members rather than one abstract average.
3. Which category level is "basic", and why does it matter? || The middle level (chair, mango): named first, used most, most informative.
4. Name Bruner, Goodnow and Austin's four strategies. || Simultaneous scanning, successive scanning, conservative focusing, focus gambling.
:::

:::mcq
Q: People verify "A robin is a bird" faster than "An ostrich is a bird." This is best explained by:
- *Prototype theory
- The classical view of concepts
- Conservative focusing
- Functional fixedness
> Typical members, closer to the prototype, are categorised faster.
:::

## 2.2 Reasoning: deduction and induction [core][beginner]
- **Deductive reasoning** goes from general premises to a conclusion that **must** follow if the premises are true. It is judged by **validity**: does the conclusion follow logically?
- **Inductive reasoning** goes from particular observations to a general conclusion that is **probably** true. It is judged by **strength**: how well do the observations support it?

### Validity is not truth
"All psychologists are doctors. Kavya is a psychologist. So Kavya is a doctor." The argument is **valid** (the conclusion follows), but the first premise is false, so the conclusion need not be **true**. An argument can be invalid with a true conclusion, too.

:::widget sort
{"prompt": "Ignore whether each conclusion is true in real life. Is the argument valid?", "buckets": ["Valid", "Invalid"], "items": [{"text": "All mammals can fly. Cows are mammals. So cows can fly.", "bucket": 0, "why": "Valid: the conclusion follows. It is false only because the first premise is false."}, {"text": "All flowers need water. Roses need water. So roses are flowers.", "bucket": 1, "why": "Invalid: many things need water. The believable conclusion tempts people to accept it. This is belief bias."}, {"text": "No reptiles have fur. All snakes are reptiles. So no snakes have fur.", "bucket": 0, "why": "Valid, and true as well."}, {"text": "Some students are tired. Some tired people are hungry. So some students are hungry.", "bucket": 1, "why": "Invalid: the tired students and the hungry tired people may be different people."}, {"text": "All doctors are graduates. Rekha is not a graduate. So Rekha is not a doctor.", "bucket": 0, "why": "Valid: this is denying the consequent (modus tollens)."}, {"text": "All doctors are graduates. Rekha is a graduate. So Rekha is a doctor.", "bucket": 1, "why": "Invalid: affirming the consequent. Plenty of graduates are not doctors."}]}
:::

### Syllogisms and their traps
- **Belief bias**: people accept invalid arguments with believable conclusions and reject valid ones with unbelievable conclusions. ("All flowers need water. Roses need water. So roses are flowers." Invalid, but it feels right.)
- **Atmosphere effect** (Woodworth and Sells, 1935): premises with "some" or "not" create an "atmosphere" that pulls people towards conclusions with "some" or "not".

### Conditional reasoning: if P then Q
| Form | Pattern | Valid? |
|---|---|---|
| **Modus ponens** | If P then Q; P; so Q | Valid |
| **Modus tollens** | If P then Q; not Q; so not P | Valid, but people find it hard |
| **Affirming the consequent** | If P then Q; Q; so P | **Invalid** (a common error) |
| **Denying the antecedent** | If P then Q; not P; so not Q | **Invalid** |

:::widget flow
{
 "title": "If P, then Q: four ways to argue",
 "layout": "tree",
 "nodes": [
  {
   "id": "r",
   "label": "Rule: if P then Q"
  },
  {
   "id": "v",
   "label": "Valid",
   "parent": "r"
  },
  {
   "id": "i",
   "label": "Invalid",
   "parent": "r"
  },
  {
   "id": "mp",
   "label": "Modus ponens",
   "parent": "v",
   "detail": "P is true, so Q is true."
  },
  {
   "id": "mt",
   "label": "Modus tollens",
   "parent": "v",
   "detail": "Q is false, so P is false. Valid, but people often miss it (think of the 7 card)."
  },
  {
   "id": "ac",
   "label": "Affirming the consequent",
   "parent": "i",
   "detail": "Q is true, so P is true. Wrong: Q may have other causes."
  },
  {
   "id": "da",
   "label": "Denying the antecedent",
   "parent": "i",
   "detail": "P is false, so Q is false. Wrong: Q may happen anyway."
  }
 ]
}
:::

:::widget worked
{
  "title": "Checking conditional arguments",
  "steps": [
    { "q": "'If a patient has lithium toxicity, she will have a coarse tremor. Mrs Rao has a coarse tremor. So she has lithium toxicity.' Valid?", "a": "Invalid: affirming the consequent. Tremor can have other causes (anxiety, thyrotoxicosis, valproate, caffeine). Clinically, this is how premature diagnoses happen." },
    { "q": "'If it rained last night, the ground is wet. The ground is not wet. So it did not rain.' Valid?", "a": "Valid: modus tollens. If P had been true, Q would have to be true; Q is false, so P is false." },
    { "q": "'If a student studies, she will pass. Neha did not study. So she will fail.' Valid?", "a": "Invalid: denying the antecedent. She might pass for other reasons." }
  ],
  "yourTurn": [
    { "q": "'If a person has major depression, they have low mood or loss of interest. Ravi has neither low mood nor loss of interest. So Ravi does not have major depression.' Name the form and say whether it is valid.", "a": "Modus tollens: valid. Because one of these two core symptoms is required, their absence rules out a major depressive episode." }
  ]
}
:::

### The Wason selection task
Peter Wason (1966) showed people four cards, each with a letter on one side and a number on the other: **E, K, 4, 7**. Rule: "If a card has a vowel on one side, it has an even number on the other." Which cards must you turn over to test the rule?

:::widget guess
{
  "prompt": "The right answer is E and 7. What percentage of university students choose exactly these two cards?",
  "min": 0,
  "max": 100,
  "unit": "%",
  "answer": [4, 15],
  "reveal": "Usually fewer than 10 percent. Most choose E alone, or E and 4. Turning 4 cannot disprove the rule (the rule says nothing about what is behind an even number); only 7 can, if it has a vowel. People look to confirm, not to falsify. But when the same logic is framed as a social rule ('If a person is drinking beer, they must be over 18', cards: beer, cola, 25 years, 16 years), about three-quarters solve it."
}
:::

Why the social version is easier is debated: **pragmatic reasoning schemas** for permission and obligation (Cheng and Holyoak, 1985), an evolved **cheater-detection** module (Leda Cosmides, 1989), or simple familiarity.

### Two theories of how we reason
- **Mental logic**: we carry formal inference rules in our heads (Lance Rips, Martin Braine).
- **Mental models** (Philip Johnson-Laird): we build small models of the situations the premises describe and check whether any model contradicts the conclusion. Errors come when we fail to build all the possible models. Problems needing more models are harder, which fits the data well.

### Inductive reasoning and confirmation bias
In Wason's **2-4-6 task** (1960), people were told that "2, 4, 6" fits a rule and asked to discover it by proposing other triples. Most tested triples like 8-10-12, got "yes", and confidently announced "even numbers rising by two". The rule was simply "**any ascending numbers**". Few tried triples that could prove them wrong (1-7-50). This is **confirmation bias** in hypothesis testing.

:::example Indian logic: the five-step inference
The Nyaya school of Indian philosophy described **anumana** (inference) in five members, a structure taught for over two thousand years: (1) **pratijna**, the claim ("the hill has fire"); (2) **hetu**, the reason ("because it has smoke"); (3) **udaharana**, the example with the general rule ("wherever there is smoke there is fire, as in a kitchen"); (4) **upanaya**, application ("this hill has smoke of that kind"); (5) **nigamana**, the conclusion ("so the hill has fire"). It combines deduction with an inductive example, and it appears in NET Paper 1 logical reasoning.
:::

:::recall
1. Distinguish validity from truth. || Validity: the conclusion follows from the premises. Truth: the premises and conclusion match reality.
2. Name the two valid and two invalid conditional forms. || Valid: modus ponens, modus tollens. Invalid: affirming the consequent, denying the antecedent.
3. Which cards must be turned in the abstract Wason task (E, K, 4, 7)? || E and 7.
4. What is belief bias? || Judging arguments by the believability of their conclusion rather than their logic.
5. What did the 2-4-6 task show? || People test hypotheses by seeking confirmation rather than disconfirmation.
:::

:::mcq
Q: "If the patient has a UTI, she will have a fever. She has a fever. So she has a UTI." This argument:
- Is valid by modus ponens
- Is valid by modus tollens
- *Commits the error of affirming the consequent
- Commits the error of denying the antecedent
> Fever has many causes; Q does not establish P.

Q: The mental models theory explains reasoning errors mainly by:
- A lack of formal logic rules in the mind
- *Failing to build every possible model
- Emotional interference with working memory
- Poor vocabulary for logical terms
> Harder problems need more models, and people stop too soon.
:::

## 2.3 Problem solving: from insight to search [core][beginner]
### The Gestalt view: restructuring
Gestalt psychologists saw problem solving as **restructuring** the problem until the solution "falls into place".
- **Max Wertheimer** (1945) contrasted **productive thinking** (understanding the structure of a problem, so you can solve new versions) with **reproductive thinking** (reusing past solutions).
- **Karl Duncker** (1945) studied functional fixedness (the candle problem) and the **radiation problem**: how can a doctor destroy a tumour with rays without destroying healthy tissue the rays pass through?
- **Norman Maier** (1931): the **two-string problem**. Two strings hang from the ceiling, too far apart to hold both. Solution: tie a pair of pliers to one string and swing it like a pendulum. When the experimenter casually brushed a string to set it swinging, many people then solved it, often without noticing the hint.

### Mental set: Luchins' water jars
Abraham Luchins (1942) gave people problems such as: "Jar A holds 21, B holds 127, C holds 3. Measure out exactly 100." The answer is B minus A minus 2C. After five such problems, he gave one that could be solved by the same long method **or** by a simple one (A minus C).

:::widget reveal
{
  "prompt": "Predict what most people did on the critical problem, and what happened on a later problem that could be solved only by the simple method.",
  "answer": "Most kept using the long B − A − 2C method when A − C would do, and many failed the problem that the long method could not solve, even though it was easy. People who had not done the training problems found the simple solution at once. This rigidity is called mental set, or Einstellung. When Luchins simply wrote 'Don't be blind!' on the paper, about half of the trained group broke the set."
}
:::

### The information-processing view: search through a problem space
Allen Newell and Herbert Simon (1972) modelled problem solving as **search** through a **problem space**: an **initial state**, a **goal state**, **operators** (allowed moves) and the **intermediate states** they create. Their computer program, the **General Problem Solver**, used heuristics that people also use:
- **Means-ends analysis**: find the biggest difference between where you are and the goal, and pick an operator that reduces it, setting up **sub-goals** when an operator cannot yet be used.
- **Hill climbing**: always take the step that seems to move closest to the goal. Simple, but it can trap you on a "foothill" where any move looks worse.
- **Working backwards**: start from the goal (useful in mazes and proofs).
- **Analogy**: use the solution of a similar problem.

:::widget flow
{
 "title": "Means-ends analysis",
 "layout": "cycle",
 "nodes": [
  {
   "id": "c",
   "label": "Compare",
   "detail": "Find the biggest difference between where you are now and the goal."
  },
  {
   "id": "o",
   "label": "Choose an operator",
   "detail": "Pick a move that reduces that difference."
  },
  {
   "id": "s",
   "label": "Set a sub-goal",
   "detail": "If the move cannot be made yet, the new goal is to make it possible."
  },
  {
   "id": "a",
   "label": "Apply and check",
   "detail": "Make the move and compare again, until no difference remains."
  }
 ],
 "caption": "Newell and Simon's General Problem Solver ran this loop."
}
:::

:::widget guess
{
  "prompt": "The Tower of Hanoi: move a stack of three discs, one at a time, from the left peg to the right peg, never putting a bigger disc on a smaller one. What is the minimum number of moves?",
  "min": 3,
  "max": 15,
  "unit": "moves",
  "answer": [7, 7],
  "reveal": "Seven. In general, the minimum is 2 raised to the number of discs, minus 1 (15 moves for four discs, 31 for five). Solving it needs a sub-goal (get the two smaller discs out of the way first) that moves you temporarily away from the goal, which is why hill climbing fails. Tower tests (Tower of London) are used to assess planning in frontal lobe damage."
}
:::

### Analogy: the radiation problem
Mary Gick and Keith Holyoak (1980) told people a story about a general who captured a fortress by splitting his army into small groups that converged from many roads at once. Then they gave Duncker's radiation problem.

:::widget guess
{
  "prompt": "Without the story, about 10 percent solve the radiation problem (use several weak rays converging on the tumour). With the fortress story read first AND a hint that it might help, what percentage solve it?",
  "min": 0,
  "max": 100,
  "step": 5,
  "unit": "%",
  "answer": [65, 85],
  "reveal": "About three-quarters. But without the hint, only about 30 percent spontaneously used the story. People tend to notice surface similarity (both about medicine), not deep structural similarity (both about converging forces). Teaching with several varied analogies, and asking students to compare them, improves transfer."
}
:::

### Experts and novices
- **Adriaan de Groot** and later **William Chase and Herbert Simon** (1973) showed that chess masters, after a five-second look, recalled real game positions far better than novices, but no better for **randomly** placed pieces. Expertise is a huge store of meaningful **chunks**, not a better memory in general.
- Experts classify problems by **deep structure** (physics problems by principle, such as conservation of energy); novices by **surface features** (problems "about inclined planes") (Chi, Feltovich and Glaser, 1981).
- K. Anders Ericsson's **deliberate practice**: focused, effortful practice with feedback, aimed at weaknesses. A large 2014 meta-analysis found it explained only about 12 percent of the differences in performance overall: practice matters, but so do starting abilities, age of starting and other factors.

:::widget compare
{"title": "How a novice and an expert see the same problem", "a": {"label": "Novice", "points": ["Sorts problems by surface features ('it has a pulley')", "Recalls few pieces from a real chess position", "Works backwards from the goal, step by step", "Holds every detail in working memory", "Slow, effortful, easily overloaded"], "summary": "The novice sees many separate details and has to reason through each one."}, "b": {"label": "Expert", "points": ["Sorts problems by deep principle ('conservation of energy')", "Recalls whole meaningful chunks, but no better for random positions", "Works forwards from a recognised pattern", "Uses large, well-organised knowledge in long-term memory", "Fast, and spots what matters first"], "summary": "Expertise is mostly organised, domain-specific knowledge, built by years of practice. It does not transfer well to other fields."}}
:::

### Incubation
Taking a break from an unsolved problem sometimes helps. Explanations include rest, forgetting a misleading approach (breaking mental set), and continued unconscious processing. A 2009 meta-analysis found a reliable, modest incubation effect, strongest for creative problems with many possible answers.

:::recall
1. Contrast productive and reproductive thinking. || Productive: grasping the problem's structure. Reproductive: reusing old solutions.
2. What is means-ends analysis? || Reducing the largest difference between current and goal states, using sub-goals.
3. What is the minimum number of moves for an n-disc Tower of Hanoi? || 2 raised to n, minus 1.
4. What did Gick and Holyoak find about analogy? || People rarely use an analogy spontaneously unless given a hint, because they notice surface rather than structural similarity.
5. What did Chase and Simon's chess studies show? || Masters recall real positions far better than novices, but not random positions: expertise is stored chunks.
:::

:::mcq
Q: In Luchins' water-jar experiment, participants who kept using a long formula when a short one would work showed:
- Functional fixedness
- Means-ends analysis
- Incubation
- *Einstellung (mental set)
> Persisting with a learned method is Einstellung.

Q: A heuristic that always chooses the move bringing you closest to the goal, and can get stuck, is:
- Means-ends analysis
- Working backwards
- *Hill climbing
- An algorithm
> Hill climbing can trap you at a local peak.
:::

## 2.4 Decisions: heuristics and biases [core][beginner]
**Normative** theories say how a perfectly rational person **should** decide (expected utility theory: choose the option with the highest probability-weighted value). **Descriptive** theories say how people **actually** decide.

### Bounded rationality
Herbert Simon (Nobel Prize in economics, 1978) argued that people have limited time, information and processing capacity, so they show **bounded rationality**: they **satisfice**, choosing the first option that is "good enough", rather than **optimise**. Buying a phone, you stop at the first that meets your budget and needs, not after comparing all 300 models.

### Tversky and Kahneman's three heuristics (1974)
Amos Tversky and Daniel Kahneman (Nobel Prize 2002, after Tversky's death) showed that people judge probabilities using shortcuts that cause predictable errors.

**1. Representativeness**: judging probability by how much something resembles a typical case.
- **The Linda problem** (1983): Linda is 31, single, outspoken and very bright; she majored in philosophy and was deeply concerned with discrimination and social justice. Which is more probable: (a) Linda is a bank teller, or (b) Linda is a bank teller and active in the feminist movement?
- **Base-rate neglect**: ignoring how common something is in the population.
- **The gambler's fallacy**: believing that after a run of reds, black is "due".

:::widget guess
{
  "prompt": "What percentage of participants judged 'bank teller AND feminist' as more probable than 'bank teller'?",
  "min": 0,
  "max": 100,
  "step": 5,
  "unit": "%",
  "answer": [80, 90],
  "reveal": "About 85 percent. But a conjunction of two things can never be more probable than either one alone: every feminist bank teller is a bank teller. This is the conjunction fallacy. Linda resembles our picture of a feminist, so representativeness overrides probability."
}
:::

**2. Availability**: judging frequency by how easily examples come to mind. People overestimate deaths from dramatic, well-reported causes (plane crashes, shark attacks) and underestimate quiet ones (diabetes, road accidents in one's own district). After a vivid news story about a suicide, clinicians may overestimate risk in the next few patients.

**3. Anchoring and adjustment**: starting from an initial value (the anchor) and adjusting too little.

:::widget guess
{
  "prompt": "People watched a 'wheel of fortune' land on 10 or 65, then estimated the percentage of African countries in the United Nations. Those who saw 10 gave a median of 25 percent. What did those who saw 65 give?",
  "min": 0,
  "max": 100,
  "step": 5,
  "unit": "%",
  "answer": [40, 50],
  "reveal": "About 45 percent. A number they knew was random still dragged their estimates. Anchors work in salary negotiations, in sale prices ('MRP ₹4,999, now ₹1,999') and in clinical judgment, where the first diagnosis offered at handover anchors everyone who follows."
}
:::

:::widget flow
{
 "title": "From heuristic to bias",
 "layout": "tree",
 "nodes": [
  {
   "id": "h",
   "label": "Judgment heuristics"
  },
  {
   "id": "re",
   "label": "Representativeness",
   "parent": "h",
   "detail": "Judge by resemblance to a typical case."
  },
  {
   "id": "av",
   "label": "Availability",
   "parent": "h",
   "detail": "Judge by how easily examples come to mind."
  },
  {
   "id": "an",
   "label": "Anchoring",
   "parent": "h",
   "detail": "Start from a number and adjust too little."
  },
  {
   "id": "b1",
   "label": "Conjunction fallacy, base-rate neglect, gambler's fallacy",
   "parent": "re"
  },
  {
   "id": "b2",
   "label": "Overestimating vivid risks",
   "parent": "av"
  },
  {
   "id": "b3",
   "label": "Price and salary anchors; first diagnosis sticks",
   "parent": "an"
  }
 ],
 "caption": "Each shortcut saves effort and produces its own predictable errors."
}
:::

### Framing and prospect theory
The same choice described differently can flip decisions. In Tversky and Kahneman's **Asian disease problem** (1981), 600 people are threatened by a disease:
- **Gain frame**: Programme A saves 200 people; Programme B has a one-third chance of saving all 600 and a two-thirds chance of saving none. **72 percent chose A** (the sure thing).
- **Loss frame**: With C, 400 people die; with D, a one-third chance that nobody dies and a two-thirds chance that all 600 die. **78 percent chose D** (the gamble).
A and C are identical; so are B and D.

:::widget compare
{"title": "The same choice in two frames", "a": {"label": "Gain frame", "points": ["A: 200 people will be saved", "B: one-third chance all 600 saved, two-thirds chance none saved", "72 percent choose A"], "summary": "Described as lives saved, most people take the sure thing. People are risk-averse for gains."}, "b": {"label": "Loss frame", "points": ["C: 400 people will die", "D: one-third chance nobody dies, two-thirds chance all 600 die", "78 percent choose D"], "summary": "Described as deaths, most people gamble. People are risk-seeking for losses. A equals C and B equals D: only the words changed."}, "caption": "Clinicians frame too: 'a 90 percent survival rate' and 'a 10 percent death rate' lead patients to different choices."}
:::

**Prospect theory** (Kahneman and Tversky, 1979) explains this:
- Outcomes are judged as **gains or losses from a reference point**, not as final states.
- **Loss aversion**: losses hurt about **twice** as much as equal gains please.
- **Diminishing sensitivity**: people are **risk-averse for gains** and **risk-seeking for losses**.
- **Probability weighting**: small probabilities are overweighted (why lotteries and insurance both sell).

### More biases worth knowing
| Bias | What it is | Example |
|---|---|---|
| **Sunk cost** | Continuing because of what has already been spent | Sitting through a bad film because the ticket was ₹500; continuing a failing course "because I've done two years" |
| **Endowment effect** | Valuing something more once you own it | Asking more to sell a mug than you would pay to buy it |
| **Overconfidence** | Being surer than accuracy justifies | Students predicting marks well above what they get |
| **Hindsight bias** | "I knew it all along" after the outcome (Fischhoff, 1975) | After a patient's suicide, the warning signs seem obvious in a way they were not before |
| **Confirmation bias** | Seeking and favouring supporting evidence | Asking only questions that fit the first diagnosis |

:::widget sort
{"prompt": "Name the bias in each situation.", "buckets": ["Sunk cost", "Endowment effect", "Overconfidence", "Hindsight bias"], "items": [{"text": "Staying in an engineering course you hate because you have already paid two years' fees", "bucket": 0, "why": "Past costs cannot be recovered, so they should not decide the future."}, {"text": "Refusing ₹15,000 for your old phone when you would only pay ₹10,000 for the same model", "bucket": 1, "why": "Owning something makes it feel more valuable."}, {"text": "Being 'sure' you scored 80 in the exam and getting 58", "bucket": 2, "why": "Confidence ran ahead of accuracy."}, {"text": "After the result, saying you always knew that team would win the final", "bucket": 3, "why": "Knowing the outcome makes it feel predictable."}, {"text": "Holding on to shares that keep falling because 'I have already lost so much on them'", "bucket": 0, "why": "Throwing good money after bad."}, {"text": "A trainee who rates her own diagnoses as 95 percent correct when supervisors agree with 70 percent", "bucket": 2, "why": "Overconfidence is common, and feedback is the cure."}]}
:::

### Are heuristics bad?
Gerd Gigerenzer argues that **fast and frugal heuristics** are often **ecologically rational**: they work well in the real world because they fit its structure. In the **recognition heuristic**, if you recognise one of two cities, guess that it is bigger. German students did better than American students at judging which of two American cities was larger, because they recognised only the big ones. Simple rules can beat complex models when information is noisy and limited.

:::widget decide
{
  "scene": "A 35-year-old woman in a Mumbai emergency room has palpitations, sweating and tremor. Her file says 'known case of panic disorder'. The resident says, “Classic panic attack; give her a benzodiazepine and send her home.”",
  "ask": "What is the best response?",
  "choices": [
    { "label": "Agree: her history makes panic disorder by far the most likely explanation", "verdict": "harm", "outcome": "She returns a week later in atrial fibrillation from untreated thyrotoxicosis.", "why": "This is anchoring plus diagnostic momentum: a label in the file shapes judgment before the evidence is weighed. Physical causes of anxiety symptoms must still be checked." },
    { "label": "Pause and consider what else could cause these symptoms (thyroid, arrhythmia, hypoglycaemia, drugs or withdrawal); do an ECG, pulse check and basic bloods before concluding it is panic", "verdict": "best", "outcome": "Her pulse is irregular and fast; thyroid tests confirm thyrotoxicosis, which is treated.", "why": "A deliberate 'diagnostic time-out' that asks 'what else could this be?' counters anchoring and premature closure, which are leading causes of diagnostic error." },
    { "label": "Admit her for a full set of every test available", "verdict": "ok", "outcome": "The cause is found, but at high cost and with incidental findings that worry her.", "why": "Ruling out key alternatives is right, but it should be targeted, not exhaustive." }
  ]
}
:::

:::recall
1. What is satisficing? || Choosing the first option that is good enough, rather than the best possible (Simon).
2. Name Tversky and Kahneman's three heuristics. || Representativeness, availability, anchoring and adjustment.
3. What is the conjunction fallacy? || Judging a conjunction of events as more probable than one of its parts.
4. State three principles of prospect theory. || Reference dependence, loss aversion, diminishing sensitivity (also probability weighting).
5. What is the sunk cost fallacy? || Continuing an action because of past investment that cannot be recovered.
:::

:::mcq
Q: After seeing news of two plane crashes, a man decides to drive 1,500 km instead of flying, believing it safer. This illustrates:
- *The availability heuristic
- Anchoring on the first number heard
- The endowment effect for his own car
- Satisficing between travel options
> Vivid, easily recalled examples inflate judged risk.

Q: People prefer a sure gain of ₹5,000 to a 50 percent chance of ₹10,000, but prefer a 50 percent chance of losing ₹10,000 to a sure loss of ₹5,000. Prospect theory calls this:
- Loss aversion, with no effect of framing
- The gambler's fallacy after a run of losses
- *Risk aversion for gains, risk seeking for losses
- The recognition heuristic for familiar sums
> Diminishing sensitivity produces opposite risk attitudes in gains and losses.
:::

## 2.5 Metacognition: thinking about thinking [core][beginner]
John Flavell (1979) coined **metacognition**: knowledge about, and control of, one's own thinking. It has two sides.
- **Metacognitive knowledge**: what you know about cognition. Flavell divided it into knowledge of **persons** ("I learn better in the morning"), **tasks** ("recall is harder than recognition") and **strategies** ("self-testing works better than rereading").
- **Metacognitive regulation**: **planning** (how will I tackle this?), **monitoring** (am I understanding? am I on track?) and **evaluating** (did it work?).

:::widget flow
{
 "title": "Regulating your own learning",
 "layout": "cycle",
 "nodes": [
  {
   "id": "p",
   "label": "Plan",
   "detail": "Set a goal and choose a strategy: 'I will test myself on attention models after reading'."
  },
  {
   "id": "m",
   "label": "Monitor",
   "detail": "Check understanding as you go: can I explain this without the book?"
  },
  {
   "id": "e",
   "label": "Evaluate",
   "detail": "Compare your results with your confidence. Where was I wrong?"
  },
  {
   "id": "a",
   "label": "Adjust",
   "detail": "Change the strategy or the time given to weak topics, then plan again."
  }
 ],
 "caption": "The cycle of metacognitive regulation."
}
:::

Thomas Nelson and Louis Narens (1990) described a **meta level** that **monitors** an object level (thinking itself) and **controls** it, for example deciding to restudy an item judged poorly learned.

### Judgments we make about our memory
- **Judgments of learning (JOLs)**: "How likely am I to remember this tomorrow?" JOLs made immediately after study are inflated by fluency; **delayed JOLs** are much more accurate.
- **Feeling of knowing**: sensing you know an answer you cannot recall now, as in the tip-of-the-tongue state.
- **Calibration**: how well confidence matches accuracy.

### Illusions of competence
Rereading notes and highlighting make material feel **fluent** and familiar, so students feel they know it. Self-testing feels harder but works better. Many students' study habits are guided by metacognitive illusions.

:::widget decide
{
  "scene": "Pooja is preparing for UGC NET. She reads each chapter twice, highlights it, and rates herself 9 out of 10 on every topic. In her first mock she scores 41 percent and is shocked.",
  "ask": "What is the best metacognitive advice?",
  "choices": [
    { "label": "Read each chapter a third time with a different colour highlighter", "verdict": "harm", "outcome": "She feels even more confident and her next mock score barely moves.", "why": "Rereading builds fluency, which is mistaken for knowledge. Her confidence and accuracy are badly calibrated." },
    { "label": "After each topic, close the book and write or say what she remembers, test herself with questions a day later, and rate her confidence before checking answers so she learns where her judgments are off", "verdict": "best", "outcome": "Her self-ratings drop at first, then rise along with her mock scores.", "why": "Delayed self-testing gives accurate monitoring, and the retrieval itself strengthens memory. Comparing confidence with results improves calibration." },
    { "label": "Stop worrying: confidence is what matters in exams", "verdict": "ok", "outcome": "Staying calm helps, but her gaps remain.", "why": "Anxiety management is useful, but overconfidence without accurate monitoring leaves real gaps unfixed." }
  ]
}
:::

### The Dunning-Kruger effect, and a caution
David Dunning and Justin Kruger (1999) found that people scoring in the **bottom quarter** on tests of logic, grammar and humour estimated themselves to be **above average** (around the 60th percentile), while top scorers slightly underestimated themselves. The explanation offered: the skills needed to do well are the skills needed to judge how well you did. Critics have since shown that part of the pattern is a **statistical artefact** (regression to the mean plus a general "better than average" tendency), so the effect is real but smaller than popular accounts suggest.

:::clinician
Metacognition has clinical uses. Adrian Wells' **metacognitive therapy** targets beliefs about thinking (for example "worrying keeps me safe" and "my worry is uncontrollable") in generalised anxiety and depression, rather than the content of worries. **Metacognitive training** for psychosis (Moritz and Woodward) is a group programme that makes cognitive biases, such as jumping to conclusions and overconfidence in errors, visible and discussable; meta-analyses show small to moderate effects on delusions. **Insight** in psychosis can be seen partly as a metacognitive capacity (clinical insight versus cognitive insight, measured by the Beck Cognitive Insight Scale).
:::

:::recall
1. Name Flavell's three kinds of metacognitive knowledge. || Person, task, strategy.
2. Name the three parts of metacognitive regulation. || Planning, monitoring, evaluating.
3. Why are delayed judgments of learning more accurate? || They rely on actual retrieval rather than the fluency of just-studied material.
4. What does the Dunning-Kruger effect claim, and what is the main critique? || Low performers overestimate their skill; part of the pattern is statistical artefact.
:::

:::mcq
Q: A student stops studying a topic because it "feels familiar" after rereading, but cannot answer questions on it a week later. This shows:
- *An illusion of competence from fluency
- Accurate calibration of her learning
- The testing effect working as intended
- Functional fixedness about her notes
> Fluency is mistaken for durable learning.
:::

## 2.6 Language and thought [core][beginner]
Does the language you speak shape how you think? Or does thought come first?

### The linguistic relativity hypothesis
Edward Sapir and his student Benjamin Lee Whorf (1940s) proposed:
- **Strong version (linguistic determinism)**: language **determines** thought; you cannot think what your language has no words for.
- **Weak version (linguistic relativity)**: language **influences** perception, memory and habits of thought.

:::widget compare
{"title": "Two versions of the Sapir-Whorf hypothesis", "a": {"label": "Strong: determinism", "points": ["Language determines thought", "No word means no concept", "Hopi speakers could not think of time as a quantity", "Little support: the Dani remember focal colours well with only two colour terms"], "summary": "The strong version has largely been rejected."}, "b": {"label": "Weak: relativity", "points": ["Language influences thought", "Words make some distinctions easier and faster", "Berinmo speakers discriminate colours best across their own colour boundary", "Language shapes habits of attention and memory"], "summary": "The weak version has good support: language nudges perception and memory, but does not imprison thought."}}
:::

Whorf claimed the Hopi language had no words for time as a quantity, so Hopi speakers thought about time differently. Later fieldwork (Malotki, 1983) found the Hopi language does have rich ways of expressing time. The popular claim that "Eskimos have hundreds of words for snow" is also exaggerated.

### Colour: the test case
- **Brent Berlin and Paul Kay** (1969) found that languages have between two and eleven **basic colour terms**, added in a fairly fixed order (black and white; then red; then green or yellow; then blue; then brown; then purple, pink, orange, grey). Colour naming seems constrained by the visual system.
- **Eleanor Rosch Heider** (1972) studied the **Dani** of New Guinea, who have only two colour terms (roughly dark-cool and light-warm). They still remembered **focal** colours (the "best" red) better than non-focal ones, as English speakers do. Evidence **against** the strong version.
- But later studies support the weak version. The **Berinmo**, also of New Guinea, have a boundary between two colour terms ("nol" and "wor") in the green-yellow region. They discriminated colours better across their boundary than within it, and not at the English blue-green boundary (Roberson and colleagues, 2000). Russian speakers, who have separate basic words for light blue ("goluboy") and dark blue ("siniy"), were faster at telling apart blues across that boundary, an advantage that disappeared when they did a verbal task at the same time (Winawer and colleagues, 2007).

:::widget sort
{
  "prompt": "Does each finding support the strong version, support the weak version, or count against the strong version?",
  "buckets": ["Against the strong version", "Supports the weak version"],
  "items": [
    { "text": "Dani speakers, with two colour words, still remember focal colours best", "bucket": 0 },
    { "text": "Russian speakers discriminate light and dark blues faster across their naming boundary", "bucket": 1 },
    { "text": "Languages add basic colour terms in a fairly fixed order", "bucket": 0 },
    { "text": "Speakers of Kuuk Thaayorre, an Australian language that uses north, south, east and west instead of left and right, stay oriented to compass directions remarkably well", "bucket": 1 },
    { "text": "Hindi 'kal' means both 'yesterday' and 'tomorrow', yet Hindi speakers do not confuse past and future", "bucket": 0, "why": "Context does the work; one word does not stop people thinking a distinction." },
    { "text": "Berinmo speakers show better colour discrimination across their own 'nol-wor' boundary", "bucket": 1 }
  ]
}
:::

:::example Kinship words in Indian languages
English has one word, "uncle". Hindi distinguishes **chacha** (father's younger brother), **tau** (father's elder brother), **mama** (mother's brother), **phupha** (father's sister's husband) and **mausa** (mother's sister's husband); Tamil and other languages make similar distinctions. Children in such language communities learn the structure of the family partly through these words, and speakers find it natural to think about who belongs to which side. English speakers can still understand the relationships; the words make them quicker and habitual. This is the weak version in everyday life.
:::

### Three developmental views
| Theorist | Relation of language and thought | Key ideas |
|---|---|---|
| **Jean Piaget** | **Thought comes first**; language reflects the level of cognitive development | **Egocentric speech** in young children (talking aloud without regard to a listener) reflects egocentric thought and fades as thinking becomes social, around 7 |
| **Lev Vygotsky** (1934) | Thought and language have **separate roots** and **merge** around age 2: thought becomes verbal and speech becomes rational | **Private speech** (talking to oneself) is a tool for self-guidance that goes "underground" as **inner speech**; children use more private speech on harder tasks |
| **Noam Chomsky** | Language is a **separate, specialised module**, largely independent of general thought | Universal grammar; language acquisition device |

:::widget flow
{
 "title": "Vygotsky: from talking with others to thinking in words",
 "layout": "chain",
 "nodes": [
  {
   "id": "so",
   "label": "Social speech",
   "detail": "Adults talk the child through tasks: 'Put the big block at the bottom.'"
  },
  {
   "id": "pr",
   "label": "Private speech",
   "detail": "The child talks aloud to guide herself, especially on hard tasks, at about 3 to 7 years."
  },
  {
   "id": "in",
   "label": "Inner speech",
   "detail": "The talk goes silent and abbreviated: verbal thought used to plan and regulate."
  }
 ],
 "caption": "Self-talk is a step towards self-control, not a sign of immaturity."
}
:::

:::widget decide
{
  "scene": "In a Pune nursery, four-year-old Ira talks to herself while building a block tower: “Big one at the bottom… no, that's wobbly… slowly, slowly.” Her teacher worries she has a problem and tells her to work quietly.",
  "ask": "What would Vygotsky advise?",
  "choices": [
    { "label": "Let her talk: private speech is how young children guide their own actions, and it increases on harder tasks", "verdict": "best", "outcome": "Ira completes more complex towers, and her self-talk gradually becomes quieter over the next year or two.", "why": "Vygotsky saw private speech as a step towards inner speech and self-regulation. Research (Laura Berk and others) links more task-relevant private speech to better performance." },
    { "label": "Agree with the teacher: talking aloud shows immature, egocentric thinking that should be discouraged", "verdict": "harm", "outcome": "Ira becomes quieter, more frustrated and gives up sooner.", "why": "This is closer to Piaget's view of egocentric speech. Suppressing self-guiding speech removes a tool she is using." },
    { "label": "Refer her for a speech and language assessment", "verdict": "ok", "outcome": "The assessment finds nothing wrong, but it causes the family worry.", "why": "Self-talk at four is typical, not a sign of disorder. Referral is for delays or regression, not for this." }
  ]
}
:::

:::recall
1. Distinguish the strong and weak versions of the Sapir-Whorf hypothesis. || Strong: language determines thought. Weak: language influences thought.
2. What did Rosch Heider's study of the Dani show? || Despite only two colour terms, they remembered focal colours best: against the strong version.
3. What did Winawer's study of Russian blues show? || Faster discrimination across a naming boundary, removed by verbal interference: support for the weak version.
4. How did Piaget and Vygotsky differ on children's self-talk? || Piaget: egocentric speech reflecting immature thought. Vygotsky: private speech as a tool for self-regulation that becomes inner speech.
:::

:::mcq
Q: Which finding gives the clearest support for the weak version of linguistic relativity?
- Dani speakers remember focal colours as well as English speakers do
- Languages add basic colour terms in a fairly fixed order
- The Hopi language turns out to have many ways of expressing time
- *Russian speakers tell apart blues faster across their naming boundary
> A naming boundary producing a discrimination advantage shows language influencing perception.
:::

## 2.7 How children acquire language [core][beginner]
### The learning view: Skinner
In 1957, B. F. Skinner argued that language is learned like other behaviour, by **imitation, reinforcement and shaping**. He described verbal operants: **mands** (requests, reinforced by getting what is asked for), **tacts** (naming things), **echoics** (repeating) and others.

### The nativist view: Chomsky
Noam Chomsky's 1959 review of Skinner's account became one of the most influential papers in psychology. His arguments:
- **Productivity**: children produce sentences they have never heard, which imitation cannot explain.
- **Poverty of the stimulus**: the speech children hear is incomplete and full of errors, yet all normal children master complex grammar, quickly, at similar ages.
- **Errors that are never modelled**: "goed" and "mouses" show a child applying rules, not copying.
- **Parents rarely correct grammar**; they correct truth ("That's not a dog, that's a cat").
Chomsky proposed an innate **language acquisition device (LAD)** containing **universal grammar**: principles common to all languages, with **parameters** set by experience (for example, verb-object order). He also distinguished **deep structure** (the underlying meaning) from **surface structure** (the actual word order), linked by transformational rules.

:::widget compare
{"title": "Skinner and Chomsky on how children learn language", "a": {"label": "Skinner: learning", "points": ["Language is verbal behaviour like any other", "Learned by imitation, reinforcement and shaping", "Mands and tacts are reinforced by results", "The environment does the teaching"], "summary": "Skinner's view explains accent, vocabulary and why children speak the language around them."}, "b": {"label": "Chomsky: nativist", "points": ["Children produce sentences they have never heard", "Input is too poor to teach grammar alone", "Errors like 'goed' show rules, not copying", "An innate universal grammar, with parameters set by experience"], "summary": "Chomsky's view explains how fast and uniformly grammar appears. Most researchers now combine both, with social interaction in the middle."}}
:::

### Interactionist and social views
- **Jerome Bruner**: a **language acquisition support system (LASS)**: routines, games and **child-directed speech** (slower, higher-pitched, simpler, repetitive, "motherese") scaffold the child.
- **Michael Tomasello**: language grows from **joint attention** and reading others' intentions.

### Statistical learning
Jenny Saffran, Richard Aslin and Elissa Newport (1996) played infants a continuous stream of nonsense syllables (bidakupadotigolabubidaku…) with no pauses. Within the stream, some syllables always followed each other ("bi-da-ku"), forming "words"; others did so only by chance.

:::widget guess
{
  "prompt": "How many minutes of listening did 8-month-old infants need before they could tell the 'words' from part-words, as shown by their listening times?",
  "min": 1,
  "max": 60,
  "unit": "minutes",
  "answer": [1, 3],
  "reveal": "Just 2 minutes. Infants tracked which syllables reliably followed each other (transitional probabilities) and used them to find word boundaries. Learning mechanisms are far more powerful than behaviourists or early nativists assumed, though statistical learning alone does not explain grammar."
}
:::

### Is there a critical period?
Eric Lenneberg (1967) proposed a **critical period** for language, ending around puberty.

:::widget guess
{"prompt": "Immigrants who arrived in the United States as children were later tested on English grammar. Up to about what age of arrival did they still reach native-like grammar?", "min": 0, "max": 20, "step": 1, "unit": "years", "answer": [6, 8], "reveal": "About 7. After that, scores fell steadily the later they arrived, and adults who arrived after their mid-teens varied a lot. Grammar and accent seem to have a sensitive period; vocabulary can grow at any age.", "clinician": "Age of arrival predicted grammar scores far better than years of exposure. This is one reason sensitive-period language is preferred over a sharp critical period, and why delayed language input in deaf children who are not offered sign language early is a real developmental risk."}
:::

- **Genie**, found in Los Angeles in 1970 at the age of 13 after extreme isolation and abuse, learned many words but never mastered grammar. (One case, with severe deprivation of every kind, so causes cannot be separated.)
- **Jacqueline Johnson and Elissa Newport** (1989) tested Chinese and Korean immigrants to the United States. Those who arrived before about age 7 reached native-like grammar; scores fell steadily with later arrival.
- **Nicaraguan Sign Language**: deaf children brought together in schools in the 1980s created a new sign language, and younger children made its grammar more systematic than older ones did.
Most researchers now speak of a **sensitive period**, strongest for phonology and grammar, rather than a sharp cut-off.

:::widget brainmap
{
 "title": "Language areas of the brain",
 "focus": [
  "broca",
  "wernicke",
  "temporal",
  "motor"
 ],
 "notes": {
  "broca": "Speech production and grammar. Damage gives slow, effortful, telegraphic speech.",
  "wernicke": "Understanding speech. Damage gives fluent but meaningless speech with poor comprehension.",
  "temporal": "Word meanings and the auditory processing of speech sounds.",
  "motor": "Moves the lips, tongue and larynx to articulate words."
 },
 "caption": "In most people these areas are in the left hemisphere."
}
:::

### Bilingualism
Most Indian children grow up with two or more languages. Bilingual children may mix languages and may have a slightly smaller vocabulary **in each** language, but their **total** vocabulary is similar to monolinguals', and milestones are on time. Claims of a broad "bilingual advantage" in executive control have not held up well in large studies. An intriguing Indian finding: in a study of 648 patients with dementia in Hyderabad, published in 2013, bilinguals developed dementia about four and a half years later than monolinguals, even among people who could not read, though such observational findings are debated.

:::widget sort
{
  "prompt": "Which theory does each piece of evidence support most?",
  "buckets": ["Learning (Skinner)", "Nativist (Chomsky)", "Interactionist or statistical"],
  "items": [
    { "text": "Children say 'goed' though no adult says it", "bucket": 1 },
    { "text": "Children learn the words and accent of the family they grow up in", "bucket": 0 },
    { "text": "Infants find word boundaries from syllable patterns after 2 minutes", "bucket": 2 },
    { "text": "Deaf children in Nicaragua created a full grammar no one taught them", "bucket": 1 },
    { "text": "Parents' simplified, repetitive 'motherese' helps word learning", "bucket": 2 },
    { "text": "A toddler says 'pani' more often after being given water each time she says it", "bucket": 0, "why": "A mand reinforced by its consequence." }
  ]
}
:::

:::recall
1. Name three of Chomsky's arguments against Skinner. || Productivity, poverty of the stimulus, rule-based errors, rare correction of grammar.
2. What is the LAD? || Chomsky's proposed innate language acquisition device containing universal grammar.
3. What did Saffran, Aslin and Newport show? || Infants use statistical regularities to segment words after brief exposure.
4. What did Johnson and Newport find? || Grammar proficiency declines with later age of arrival, supporting a sensitive period.
5. What is Bruner's LASS? || The language acquisition support system: social routines and child-directed speech that scaffold learning.
:::

:::mcq
Q: Chomsky's "poverty of the stimulus" argument states that:
- Poorer children learn language more slowly
- *The input is too limited to explain the grammar learned
- Children need rich reinforcement to learn grammar
- Language is acquired only by imitating adults
> Children master grammar beyond what the input alone could teach.
:::
`;
