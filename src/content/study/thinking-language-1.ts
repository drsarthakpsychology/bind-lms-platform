/* Module · Thinking, language, intelligence and creativity, Part I (Starting level). Original text written for VIBHA School of Psychology. */
export const part1 = String.raw`
# Part I · Starting: the thinking mind

## 1.1 What thinking is, and the two speeds of thought [core][starting]
**Thinking** (cognition) is the mental manipulation of information: forming concepts, reasoning, solving problems, judging and deciding. It works on a few kinds of building block:
- **Mental images**: picture-like representations. Asked how many windows your home has, most people "walk through" an image of it.
- **Concepts**: mental categories that group things sharing properties ("fruit", "democracy", "depression").
- **Propositions**: statements that link concepts and can be true or false ("Mangoes are fruit").
- **Schemas and scripts**: organised knowledge about situations and sequences (what happens at a bank, at a doctor's visit, at a mehendi ceremony).

### Fast and slow thinking
Many psychologists (Keith Stanovich and Richard West; Daniel Kahneman, *Thinking, Fast and Slow*, 2011) describe two modes:
| | **System 1** (intuitive) | **System 2** (deliberate) |
|---|---|---|
| Speed | Fast, automatic | Slow, effortful |
| Awareness | Mostly outside awareness | Conscious, step by step |
| Capacity | Can run alongside other tasks | Limited, uses working memory |
| Good at | Recognising faces, reading emotions, familiar skills, quick gut judgments | Calculation, logic, checking, following rules |
| Weak spot | Systematic biases | Laziness: it often just endorses System 1 |

:::widget guess
{
  "prompt": "A cricket bat and a ball cost ₹110 together. The bat costs ₹100 more than the ball. How much does the ball cost?",
  "min": 0,
  "max": 20,
  "unit": "rupees",
  "answer": [5, 5],
  "reveal": "₹5. (Then the bat is ₹105, and together they make ₹110.) Most people's first answer is ₹10, and about half of students at leading universities in Shane Frederick's (2005) studies gave it. System 1 offers the quick answer; System 2 must notice it is wrong. Questions like this form the Cognitive Reflection Test."
}
:::

:::widget sort
{
  "prompt": "System 1 or System 2?",
  "buckets": ["System 1 (fast, intuitive)", "System 2 (slow, deliberate)"],
  "items": [
    { "text": "Knowing your mother is upset from one word on the phone", "bucket": 0 },
    { "text": "Working out 17 × 24 in your head", "bucket": 1 },
    { "text": "Reading the word on a large hoarding while driving", "bucket": 0 },
    { "text": "Checking whether a patient meets every criterion for a diagnosis", "bucket": 1 },
    { "text": "Feeling that a stranger in a dark lane looks dangerous", "bucket": 0 },
    { "text": "Filling in your income tax return", "bucket": 1 }
  ]
}
:::

:::trap Two systems is a useful sketch, not a brain map
There are no two separate "systems" in the brain. The distinction describes **types of processing** that differ in speed, effort and dependence on working memory. Intuition is not always wrong: an experienced nurse's "gut feeling" that a patient is deteriorating often rests on real, learned cues.
:::

:::recall
1. Name four building blocks of thought. || Mental images, concepts, propositions, schemas and scripts.
2. Give three features of System 1 and of System 2. || System 1: fast, automatic, intuitive. System 2: slow, effortful, rule-based, limited by working memory.
3. Why do most people get the bat-and-ball problem wrong? || System 1 gives a quick, plausible answer that System 2 fails to check.
:::

:::mcq
Q: A doctor glances at a child and immediately feels "something is seriously wrong", before any test. This is best described as:
- *System 1 (intuitive) processing
- An algorithm applied step by step
- Deductive reasoning from the history
- Metacognitive planning of the visit
> Fast pattern recognition from experience is System 1.
:::

## 1.2 Solving problems: the starting picture [core][starting]
A **problem** exists when you have a goal but no obvious way to reach it. Problems differ:
- **Well-defined**: clear start, clear goal, clear rules (a Sudoku, a chess puzzle, calculating a z-score).
- **Ill-defined**: vague goals or unclear steps (writing a good thesis, helping a family in conflict, choosing a career).

### Two broad ways to solve
- An **algorithm** is a step-by-step procedure that guarantees a solution if followed (long division; trying every combination of a 3-digit lock). Slow, but sure.
- A **heuristic** is a rule of thumb that usually works and saves effort (try the most common combinations first; "work backwards from the answer"). Fast, but not guaranteed.

### Insight: the "aha!" moment
Sometimes a solution arrives suddenly, after being stuck, as the problem is seen in a new way. Wolfgang Köhler's chimpanzees (you met them in the module on learning) and many human puzzles show this **insight**.

### What gets in the way
- **Mental set**: sticking with a method that worked before, even when a simpler one is now available.
- **Functional fixedness**: seeing an object only in its usual function.
- **Confirmation bias**: seeking information that supports your idea and ignoring what does not.

:::widget reveal
{
  "prompt": "Karl Duncker's candle problem (1945): you are given a candle, a box of drawing pins and a matchbox, and asked to fix the candle to the wall so that it burns without dripping wax on the table. Think for a minute. What is the solution, and what stops people finding it?",
  "answer": "Empty the box of pins, pin the box to the wall as a shelf, and stand the candle in it. People struggle because they see the box only as a container for the pins: functional fixedness. When the pins are given beside an empty box, far more people solve it quickly."
}
:::

:::widget decide
{
  "scene": "Meenal, a counselling student in Indore, has to choose a topic for her MA dissertation. She has spent three weeks reading everything on anxiety and still cannot decide. She feels stuck and is losing sleep.",
  "ask": "What problem-solving advice fits best?",
  "choices": [
    { "label": "Keep reading until the perfect topic becomes obvious", "verdict": "harm", "outcome": "Another month passes, and the deadline approaches.", "why": "An ill-defined problem rarely solves itself through more input. Without a clearer goal, reading becomes avoidance." },
    { "label": "Turn the ill-defined problem into well-defined steps: list her criteria (interest, data she can get, supervisor's area, time), generate several options, rate them, and pick one to test with a two-page proposal", "verdict": "best", "outcome": "She narrows to three options in a day and her supervisor approves one within a week.", "why": "Defining the goal and the criteria, generating options, then testing one quickly is how ill-defined problems are made workable." },
    { "label": "Ask a senior to choose for her", "verdict": "ok", "outcome": "She gets a topic quickly but loses interest halfway through.", "why": "Advice is useful, but a dissertation needs her own commitment. Use others for options and feedback, not for the decision itself." }
  ]
}
:::

:::recall
1. Distinguish well-defined from ill-defined problems. || Well-defined: clear start, goal and rules. Ill-defined: vague goals or steps.
2. Contrast an algorithm with a heuristic. || An algorithm guarantees a solution step by step; a heuristic is a quicker rule of thumb that may fail.
3. Name three obstacles to problem solving. || Mental set, functional fixedness, confirmation bias.
:::

:::mcq
Q: A student uses a long formula to solve every statistics question, even when the answer can be seen at a glance. This is:
- Functional fixedness
- Insight
- An availability heuristic
- *Mental set
> Persisting with a familiar method when a simpler one exists is mental set.
:::

## 1.3 Language: what it is and how children learn it [core][starting]
**Language** is a system of symbols and rules for combining them that lets us communicate an unlimited number of meanings. Charles Hockett (1960) listed **design features** that set human language apart from animal signals. Three matter most:
- **Arbitrariness**: words do not resemble what they mean ("dog", "kutta" and "naai" all work).
- **Productivity** (generativity): a finite set of words and rules can make endless new sentences, including ones never heard before.
- **Displacement**: we can talk about things not here and not now (last year's monsoon, an imaginary dragon).

### The levels of language
| Level | Unit | Example |
|---|---|---|
| **Phonology** | **Phonemes**: the smallest sound units that change meaning | /p/ and /b/ in "pin" and "bin"; Hindi separates aspirated /kh/ and unaspirated /k/, English does not |
| **Morphology** | **Morphemes**: the smallest units of meaning | "un-happi-ness" has three; "ladk-on" (boys) has two |
| **Syntax** | Rules for ordering words | Hindi is subject-object-verb ("Ram ne seb khaya"); English is subject-verb-object ("Ram ate an apple") |
| **Semantics** | Meaning of words and sentences | "Bank" of a river versus a bank for money |
| **Pragmatics** | Using language in social context | "Can you pass the salt?" is a request, not a question about ability |

:::widget sort
{
  "prompt": "Which level of language is involved?",
  "buckets": ["Phonology", "Morphology", "Syntax", "Pragmatics"],
  "items": [
    { "text": "A child says 'goed' instead of 'went'", "bucket": 1, "why": "Applying the past-tense morpheme '-ed' to an irregular verb." },
    { "text": "Japanese speakers struggle to hear the difference between 'r' and 'l'", "bucket": 0 },
    { "text": "'Dog bites man' and 'man bites dog' mean different things", "bucket": 2 },
    { "text": "Knowing to say 'aap' to an elder and 'tum' to a friend", "bucket": 3 },
    { "text": "Adding '-s' to make 'cat' into 'cats'", "bucket": 1 },
    { "text": "Understanding that 'It's cold in here' may mean 'please close the window'", "bucket": 3 }
  ]
}
:::

### Milestones of language development
| Approximate age | Milestone |
|---|---|
| Birth to 2 months | Crying; prefers human voices and the mother's language |
| 2 to 4 months | **Cooing** (vowel-like sounds) |
| 6 to 10 months | **Babbling** (repeated syllables: ba-ba, da-da); babbling starts to sound like the home language |
| Around 12 months | **First words** |
| 18 to 24 months | Vocabulary spurt; **two-word** (telegraphic) speech: "Papa go", "more milk" |
| 2 to 5 years | Grammar grows fast; **overregularisation** ("mouses", "goed") |

:::widget guess
{
  "prompt": "Roughly how many words does a typical six-year-old understand?",
  "min": 500,
  "max": 20000,
  "step": 500,
  "unit": "words",
  "answer": [8000, 14000],
  "reveal": "About 10,000, by most estimates. That means learning several new words every waking day from the age of one, mostly without being taught directly. Estimates vary widely with how 'knowing a word' is defined and with the child's home language environment."
}
:::

:::recall
1. Name three of Hockett's design features of language. || Arbitrariness, productivity, displacement (also duality, discreteness, cultural transmission).
2. Define phoneme and morpheme. || Phoneme: smallest sound unit that changes meaning. Morpheme: smallest unit of meaning.
3. What is pragmatics? || The use of language in social context.
4. What is overregularisation? || Applying a grammatical rule to irregular words ("goed", "mouses").
:::

:::mcq
Q: A two-year-old says "Mummy shoe" to mean "That is Mummy's shoe." This is an example of:
- Babbling
- *Telegraphic speech
- Pragmatics
- Overregularisation
> Two-word utterances leaving out function words are telegraphic.
:::

## 1.4 Intelligence and creativity: the starting picture [core][starting]
### What intelligence means
Definitions vary, but most experts agree that **intelligence** is the general mental ability to **reason, plan, solve problems, think abstractly, understand complex ideas, learn quickly and learn from experience** (from a statement signed by 52 researchers, 1994). Some add the ability to **adapt** to one's environment, which brings in culture.

### The first test and the IQ
- **Alfred Binet and Théodore Simon** (Paris, 1905) built the first practical intelligence test to find schoolchildren who needed extra help. They introduced **mental age**: the age level at which a child performs.
- **William Stern** (1912) proposed the **intelligence quotient**: mental age divided by chronological age, multiplied by 100. A 10-year-old performing like a typical 12-year-old has a ratio IQ of 120.
- **Lewis Terman** (Stanford, 1916) adapted Binet's test as the **Stanford-Binet** and popularised IQ.
- Ratio IQ breaks down in adults (mental age stops rising), so modern tests use the **deviation IQ** (David Wechsler): your score compared with others of your age, scaled so the **mean is 100** and the **standard deviation is 15**.

:::widget guess
{
  "prompt": "On a test with mean 100 and standard deviation 15, what percentage of people score between 85 and 115?",
  "min": 0,
  "max": 100,
  "unit": "%",
  "answer": [66, 70],
  "reveal": "About 68 percent: one standard deviation either side of the mean on the normal curve. About 95 percent score between 70 and 130, and about 2 percent score below 70 (one of the criteria, together with problems in daily adaptive functioning, for intellectual disability)."
}
:::

### One ability or many?
The big debate in intelligence is whether there is **one general ability** (Charles Spearman's **g**) that shows up in every mental task, or **several fairly separate abilities** (Louis Thurstone, J. P. Guilford, Howard Gardner). You will study each theory at the Beginner level, including the Indian-born psychologist **J. P. Das**'s PASS theory.

### Creativity
**Creativity** is the ability to produce work that is both **novel** (original) and **useful** or appropriate. J. P. Guilford distinguished:
- **Convergent thinking**: narrowing down to the single correct answer (most MCQs, most IQ items).
- **Divergent thinking**: generating many different answers ("How many uses can you think of for a brick?").

:::widget sort
{
  "prompt": "Convergent or divergent thinking?",
  "buckets": ["Convergent", "Divergent"],
  "items": [
    { "text": "Listing as many uses as you can for an empty plastic bottle", "bucket": 1 },
    { "text": "Choosing the one correct answer in a CUET MCQ", "bucket": 0 },
    { "text": "Thinking of ten possible titles for a short film", "bucket": 1 },
    { "text": "Solving for x in an equation", "bucket": 0 },
    { "text": "Imagining different endings for a folk tale", "bucket": 1 },
    { "text": "Finding the next number in 2, 4, 8, 16", "bucket": 0 }
  ]
}
:::

:::student
IQ tests measure some important abilities well, and IQ predicts school results and job performance better than almost any other single test. But a score is a sample of behaviour on one day, from one test, normed on particular people. It is not a measure of a person's worth, and it says little about kindness, wisdom or creativity.
:::

:::recall
1. Who built the first practical intelligence test, and why? || Binet and Simon, 1905, to identify children needing extra help at school.
2. How is ratio IQ calculated? || Mental age divided by chronological age, times 100.
3. Why do modern tests use a deviation IQ? || Ratio IQ fails in adults; deviation IQ compares a person with their own age group (mean 100, SD 15).
4. Define creativity. || Producing work that is both novel and useful or appropriate.
5. Contrast convergent and divergent thinking. || Convergent: one correct answer. Divergent: many possible answers.
:::

:::mcq
Q: A 10-year-old has a mental age of 8. Her ratio IQ is:
- 125
- 120
- *80
- 90
> 8 divided by 10, times 100, is 80.
:::

## 1.5 Level check · Starting [core][starting]
Score 80 percent or more to open the Beginner level. If you already know this, take it now to skip ahead.

:::mcq
Q: Which is a concept?
- The script for a wedding
- The image of your school building
- The sentence "Mangoes are sweet"
- *"Vegetable"
> A concept is a mental category.

Q: System 2 thinking is best described as:
- Fast and automatic
- *Slow, effortful and rule-based
- Unconscious and emotional
- Used only by experts
> Deliberate thinking is slow and uses working memory.

Q: A procedure that guarantees a solution if followed step by step is:
- *An algorithm
- A heuristic
- An insight
- A schema
> Algorithms are exhaustive and certain.

Q: Failing to see that a coin could be used as a screwdriver shows:
- Mental set
- Insight
- *Functional fixedness
- Confirmation bias
> Seeing an object only in its usual function.

Q: Planning a family function, with vague goals and many possible solutions, is a(n):
- Well-defined problem
- *Ill-defined problem
- Algorithmic problem
- Insight problem
> Unclear goals and steps make it ill-defined.

Q: The ability of language to refer to things not present is called:
- Arbitrariness
- Productivity
- Duality
- *Displacement
> Talking about the past, future or imaginary.

Q: The smallest unit of sound that changes meaning is the:
- *Phoneme
- Morpheme
- Syllable
- Syntax
> Phonemes distinguish words like "pin" and "bin".

Q: Knowing when to use polite forms of address is part of:
- Syntax
- Phonology
- *Pragmatics
- Morphology
> Social use of language is pragmatics.

Q: At about what age do most children say their first words?
- 4 months
- *12 months
- 6 months
- 24 months
> First words usually come around the first birthday.

Q: A child saying "foots" instead of "feet" shows:
- Telegraphic speech
- Babbling
- *Overregularisation
- A phonological error
> Applying the plural rule to an irregular noun.

Q: Who introduced the term "intelligence quotient"?
- *William Stern
- Lewis Terman
- David Wechsler
- Alfred Binet
> Stern (1912) proposed the ratio of mental to chronological age.

Q: On a modern IQ test, the mean and standard deviation are:
- 100 and 10
- 50 and 10
- 100 and 20
- *100 and 15
> Deviation IQ uses mean 100, SD 15.

Q: Who proposed a single general factor, g?
- J. P. Guilford
- Louis Thurstone
- Howard Gardner
- *Charles Spearman
> Spearman (1904).

Q: Thinking of many unusual uses for a brick is an example of:
- Convergent thinking
- *Divergent thinking
- Deductive reasoning
- An algorithm
> Generating many answers is divergent.
:::
`;
