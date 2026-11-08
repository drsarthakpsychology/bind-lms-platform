import type { LongQA } from "@/lib/prep/long-types";

const S = "cognitive" as const;

export const COGNITIVE_L03: LongQA[] = [
  {
    id: "cog-l03-021",
    subject: S,
    topic: "concept-formation",
    marks: 15,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "What are concepts? Compare and contrast the classical, prototype, exemplar and theory-based views of concept representation.",
    plan: ["Define concepts and their functions", "Classical view and its problems", "Prototype view with Rosch's evidence", "Exemplar view", "Theory-based view", "Comparison, basic level categories, culture and conclusion"],
    answer: `## Meaning and functions
A concept is a mental representation of a category, a class of objects, events or ideas that share something in common, such as "bird", "furniture", "justice" or "mental disorder". Categorisation, deciding which category an instance belongs to, lets us treat new things in the light of what we already know: if something is a dog, we expect it to bark and may bite. Concepts reduce the complexity of the world, allow inference and prediction, and support communication.

## The classical (definitional) view
From Aristotle onwards, concepts were thought to be defined by a set of necessary and jointly sufficient features. A "bachelor" is an unmarried adult male; a "triangle" is a closed figure with three straight sides. Every member equally belongs to the category, boundaries are sharp, and membership is all or none. Early concept formation experiments, such as Jerome Bruner, Jacqueline Goodnow and George Austin's work with geometric cards, studied how people discover such rules.
Problems:
- Most natural categories lack defining features. Ludwig Wittgenstein showed that "game" has no single feature common to all games; members share a family resemblance of overlapping features.
- Typicality effects: some members are judged better examples than others.
- Fuzzy boundaries: people disagree about whether a tomato is a vegetable or whether a rug is furniture, and even change their own judgements over time, as Michael McCloskey and Sam Glucksberg showed.

## The prototype view
Eleanor Rosch proposed that concepts are represented by a prototype, a summary representation of the most typical or average member, built from the features most often found in the category. Category membership is graded: an item is categorised by its similarity to the prototype.
Evidence:
- Typicality ratings: people agree that a robin is a more typical bird than an ostrich or a penguin.
- Typical members are verified faster ("A robin is a bird"), named first when listing members, learned earlier by children, and serve as better reference points.
- Family resemblance: typical members share many features with other members.
- Rosch's studies with the Dani of New Guinea, who had only two colour terms, found that focal colours were learned more easily, suggesting natural prototypes.
- Prototype abstraction: Michael Posner and Steven Keele showed that after learning distorted dot patterns, people recognised the never-seen prototype as readily as the studied patterns.
Criticisms:
- A single summary loses information about variability and about correlations between features (small birds sing, large birds do not).
- People know atypical members, such as penguins, well.
- Context changes typicality: in the context of a farm, a chicken becomes a typical bird.

## The exemplar view
Douglas Medin and Marguerite Schaffer and Robert Nosofsky proposed that a concept is represented by the stored memories of many specific members (exemplars) encountered. A new item is categorised by comparing it with all stored exemplars and choosing the category with the most similar ones.
Strengths:
- Retains information about variability and atypical members.
- Explains typicality, since typical items resemble many exemplars.
- Explains context effects and the influence of specific familiar cases, such as a clinician diagnosing a patient by resemblance to a memorable past case.
Criticisms:
- Storing every exemplar seems uneconomical, and it is unclear how abstract concepts (justice) are handled.
- Many researchers now combine prototype and exemplar processes: early in learning people may abstract prototypes, later they rely on exemplars, or the reverse.

## The theory-based (explanation-based) view
Gregory Murphy and Douglas Medin argued that similarity alone cannot explain categories. Concepts are embedded in our naive theories about the world: what causes features and why they go together.
- Frank Keil's transformation studies: children who saw a raccoon surgically altered to look like a skunk judged that it was still a raccoon, by about age 10, because they believed its inner essence was unchanged (psychological essentialism). For artefacts, changing the form changed the category.
- Ad hoc categories, such as "things to take out of a burning house", have no perceptual similarity but are coherent because of a goal.
- Theories explain why some features are central (a bird's ability to fly is linked to wings and lightness).
Criticism: the notion of a "theory" is vague and hard to test precisely.

## Comparison
| Feature | Classical | Prototype | Exemplar | Theory-based |
| Representation | Defining features | Average or ideal member | Stored instances | Features plus causal knowledge |
| Membership | All or none | Graded by similarity to prototype | Graded by similarity to exemplars | Explanation and essence |
| Explains typicality | No | Yes | Yes | Partly |
| Explains variability | No | Poorly | Yes | Yes |
| Explains abstract and ad hoc concepts | Partly | Poorly | Poorly | Yes |

## Basic level categories
Rosch also showed that categories form hierarchies: superordinate (furniture), basic (chair) and subordinate (office chair). The basic level is the most informative and efficient; it is named first, learned first by children and the level at which objects share overall shape. Experts, such as birdwatchers, use subordinate categories as their basic level.

## Relevance
Diagnostic categories in psychiatry show prototype effects: clinicians often match patients to a prototype or a past case rather than counting criteria, and DSM categories have fuzzy boundaries and high comorbidity, part of the argument for dimensional models. Cultural differences in categorisation (for example, East Asian participants grouping by relationships rather than taxonomy, as Richard Nisbett found) show that concepts are shaped by experience.

## Conclusion
No single view explains all concepts. The classical view fits some well-defined categories; prototype and exemplar views explain graded membership and typicality; theory-based views explain coherence, essentialism and goal-based categories. Contemporary models combine similarity with knowledge.`,
    keyPoints: ["Definition and functions of concepts", "Classical view and family resemblance critique", "Prototype view with typicality evidence", "Posner and Keele prototype abstraction", "Exemplar view and its advantages", "Theory-based view with Keil's study", "Comparison table", "Basic level categories and application"],
    pitfalls: ["Treating prototype and exemplar views as identical", "Ignoring the theory-based view"],
    module: "thinking-language/2-1",
    visuals: [
      { kind: "compare", caption: "The prototype view", data: { title: "Prototype versus exemplar", a: { label: "Prototype", points: ["One average summary of the category", "Classify by distance to the summary", "Loses variability"], summary: "An abstract ideal bird." }, b: { label: "Exemplar", points: ["Many stored individual members", "Classify by similarity to stored cases", "Keeps variability and odd members"], summary: "All the birds you have met." } } },
      { kind: "flow", caption: "Basic level categories", data: { title: "Levels of categories", layout: "tree", nodes: [{ id: "s", label: "Furniture", detail: "Superordinate: few shared features." }, { id: "b", label: "Chair", parent: "s", detail: "Basic level: named first, shared shape." }, { id: "t", label: "Table", parent: "s" }, { id: "o", label: "Office chair", parent: "b", detail: "Subordinate: more detail, little extra information." }, { id: "r", label: "Rocking chair", parent: "b" }] } },
    ],
    ref: "Rosch 1975 and 1978; Rosch and Mervis 1975; Posner and Keele 1968; Medin and Schaffer 1978; Nosofsky 1986; Murphy and Medin 1985; Keil 1989; McCloskey and Glucksberg 1978",
  },
  {
    id: "cog-l03-022",
    subject: S,
    topic: "imagery",
    marks: 10,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net"],
    question: "What is mental imagery? Describe the experimental evidence on mental rotation and image scanning, and discuss the imagery debate.",
    plan: ["Define mental imagery", "Shepard and Metzler mental rotation", "Kosslyn's scanning and size studies", "Neuroscience evidence", "Pylyshyn's propositional critique and the debate", "Conclusion"],
    answer: `## Meaning
Mental imagery is the experience of perceiving something in the absence of the stimulus: "seeing" a friend's face, "hearing" a song in one's head. Visual imagery is the most studied. The key question is whether images are depictive, picture-like representations that preserve spatial properties, or whether they are descriptions in an abstract, language-like code.

## Mental rotation
Roger Shepard and Jacqueline Metzler in 1971 showed participants pairs of drawings of three-dimensional block figures and asked whether they were the same object rotated, or mirror images. The time to decide increased in a straight line with the angle of rotation between the figures, about one second for every 50 to 60 degrees. Participants reported rotating one figure in their mind to match the other. Lynn Cooper and Shepard found the same with letters, rotated normal or mirror-reversed. This suggests images are manipulated in a continuous, analogue way, as if physically rotating an object.

## Image scanning and size
Stephen Kosslyn asked participants to memorise a map of a fictional island with landmarks (a hut, a tree, a well). Later, imagining the map, they focused on one landmark and "scanned" to another. Scanning time increased with the actual distance between landmarks on the map, implying that images preserve metric spatial information.
In other studies, participants imagined an animal next to an elephant or next to a fly. When the target animal (a rabbit) was imagined small next to an elephant, it took longer to verify its small parts, as if they had to "zoom in". Imagined objects also have a visual angle: people "walking towards" an imagined object report it overflowing the mind's eye at a predictable distance.

## Neuroscience evidence
- Imagery activates many of the same areas as perception, including early visual cortex (V1), in a way that reflects the size of the imagined object.
- Disrupting occipital cortex with TMS impairs both perception and imagery.
- Some patients with neglect of the left side of space also neglect the left side of imagined scenes, as Edoardo Bisiach showed when patients described Milan's cathedral square from memory.
- Double dissociations exist: some patients lose imagery but not perception, and vice versa, so the overlap is partial.
- Aphantasia, the reported inability to form visual images, affects a small percentage of people who nonetheless perform many spatial tasks.

## The imagery debate
Zenon Pylyshyn argued that images are not pictures in the head but are underpinned by propositional, language-like descriptions. The picture-like experience is an epiphenomenon.
- Tacit knowledge: participants know how long it would take to scan or rotate a real object and may unconsciously simulate this, producing the timing results.
- Demand characteristics: experiments may cue the expected results.
- Images are interpreted: we cannot reinterpret an ambiguous image as easily as a picture. Deborah Chambers and Daniel Reisberg found that people who imagined the duck-rabbit figure could not reverse it in their mind, though they could on paper.
Kosslyn replied that scanning effects appeared even when participants did not know the purpose, and that neuroimaging showing topographic activation in visual cortex supports depictive representations.

## Conclusion
Behavioural and brain evidence suggests that imagery shares mechanisms with perception and preserves spatial properties, supporting the depictive view, but images are also shaped by knowledge and interpretation. Many researchers now accept that both depictive and propositional representations exist.`,
    keyPoints: ["Definition and the representational question", "Shepard and Metzler linear rotation result", "Kosslyn's island scanning and size effects", "Neuroimaging overlap with perception and neglect evidence", "Pylyshyn's propositional critique and tacit knowledge", "Chambers and Reisberg reinterpretation finding", "Balanced conclusion"],
    module: "thinking-language/2-1",
    visuals: [
      { kind: "compare", data: { title: "The imagery debate", a: { label: "Depictive (Kosslyn)", points: ["Images preserve distance, size and shape", "Rotation and scanning times grow with angle and distance", "Visual cortex active during imagery"], summary: "Pictures in the mind." }, b: { label: "Propositional (Pylyshyn)", points: ["Knowledge stored as abstract descriptions", "Timing effects reflect tacit knowledge", "Images hard to reinterpret"], summary: "Descriptions in the mind." } } },
    ],
    ref: "Shepard and Metzler 1971 Science; Kosslyn, Ball and Reiser 1978; Pylyshyn 1973 and 2002; Chambers and Reisberg 1985; Bisiach and Luzzatti 1978; Kosslyn et al 1999 TMS",
  },
  {
    id: "cog-l03-023",
    subject: S,
    topic: "imagery",
    marks: 5,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net"],
    question: "Write a short note on Paivio's dual coding theory.",
    plan: ["State the theory", "Concreteness effect and evidence", "Applications", "Criticisms"],
    answer: `## The theory
Allan Paivio proposed in 1971 that information is represented in two separate but interconnected systems:
- a verbal system that codes words and language-like information (logogens), and
- a non-verbal imagery system that codes pictures, sounds and sensory information (imagens).
Concrete words, such as "elephant" or "guitar", can be coded in both systems, while abstract words, such as "justice" or "truth", are coded mainly in the verbal system. Having two codes gives two routes for retrieval, so memory is better.

## Evidence
- Concreteness effect: concrete words are recalled better than abstract words matched for frequency.
- Picture superiority effect: pictures are remembered better than words, because pictures are readily named and so coded twice.
- Instructions to form images improve recall of word pairs, especially concrete pairs.
- Interference studies show that imagery tasks interfere with visual tasks and verbal tasks with verbal ones, consistent with separate systems.

## Applications
Combining words with pictures and diagrams in teaching, the keyword method for vocabulary, and mnemonics such as the method of loci all draw on dual coding. Multimedia learning principles, developed by Richard Mayer, recommend pairing narration with relevant images.

## Criticisms
- Concreteness effects may reflect the richer context available for concrete words (context availability theory) rather than imagery.
- The theory does not specify how the two codes interact in detail.
- Propositional theorists argue for a single abstract code underlying both.`,
    keyPoints: ["Two coding systems", "Concrete versus abstract words", "Picture superiority and concreteness evidence", "Educational applications", "Criticisms including context availability"],
    module: "thinking-language/2-1",
    visuals: [
      { kind: "sort", caption: "The theory", data: { prompt: "Which words can be coded twice (in words and images)?", buckets: ["Dual coded (concrete)", "Mainly verbal (abstract)"], items: [{ text: "Elephant", bucket: 0 }, { text: "Justice", bucket: 1 }, { text: "Mango", bucket: 0 }, { text: "Idea", bucket: 1 }] } },
    ],
    ref: "Paivio 1971 and 1986; Schwanenflugel 1991 context availability; Mayer 2009",
  },
  {
    id: "cog-l03-024",
    subject: S,
    topic: "problem-solving",
    marks: 20,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "cuet-pg", "mcp-entrance"],
    question: "Discuss the cognitive approach to problem solving. Describe types of problems, strategies such as algorithms and heuristics, the role of insight, and the main obstacles to solving problems.",
    plan: ["Define problem and problem solving", "Well-defined and ill-defined problems; problem space", "Algorithms and heuristics: means-end analysis, working backwards, hill climbing, analogy", "Gestalt view and insight with evidence", "Obstacles: functional fixedness, mental set, confirmation bias, representation", "Stages, expertise, applications and conclusion"],
    answer: `## Meaning
A problem exists when a person has a goal but no immediately obvious way to reach it. Problem solving is the cognitive process of moving from the initial state to the goal state, by finding and applying operations that change the situation. It draws on perception, memory, reasoning and language.

## Types of problems
- Well-defined problems have a clear initial state, goal and permitted operations, such as the Tower of Hanoi, chess positions or arithmetic.
- Ill-defined problems lack clear goals or methods, such as writing a good essay, designing a house or improving one's relationships. Most real-life problems are ill-defined and require the person to define the problem first.
- Knowledge-lean problems need little prior knowledge; knowledge-rich problems need expertise.
- Insight problems require a sudden restructuring; non-insight problems are solved incrementally.

## The information-processing view
Allen Newell and Herbert Simon described problem solving as a search through a problem space: all the possible states of the problem and the operators that move between them. The solver begins at the initial state and searches for a path to the goal. Because the space is usually too large to search fully, people rely on strategies. Newell and Simon's General Problem Solver, a computer program, modelled human problem solving using think-aloud protocols.

## Algorithms and heuristics
- An algorithm is a step-by-step procedure that guarantees a solution if followed correctly, such as trying every possible combination of a four-digit lock. It may be very slow.
- A heuristic is a rule of thumb that often works and saves time, but does not guarantee success.
Common heuristics:
- Means-end analysis: identify the difference between the current state and the goal, then choose an action that reduces it, setting sub-goals when needed. Tower of Hanoi solutions use this.
- Working backwards: start from the goal and reason back to the start, useful in mathematical proofs and planning.
- Hill climbing: choose the move that brings one closest to the goal at each step. Can fail when a temporary move away from the goal is needed, as in the Hobbits and Orcs (missionaries and cannibals) problem, where people get stuck at the step requiring a move back.
- Analogy: using the solution of a similar, familiar problem.
- Breaking a problem into sub-goals.

## The Gestalt view and insight
Gestalt psychologists emphasised productive thinking and the restructuring of the problem.
- Wolfgang Kohler's chimpanzee Sultan, unable to reach a banana, after a pause joined two sticks or stacked boxes, apparently with sudden understanding, which Kohler called insight.
- Insight is the sudden realisation of a solution, often after an impasse, experienced as an "aha" moment.
- Janet Metcalfe and David Wiebe showed that for insight problems, people's feeling of "getting warmer" did not increase gradually before the solution, unlike for algebra problems, suggesting a sudden change.
- Brain imaging and EEG studies by Mark Beeman and John Kounios found a burst of activity in the right anterior superior temporal gyrus just before insight solutions.
- Graham Wallas's four stages of creative problem solving: preparation, incubation, illumination and verification. Incubation, setting the problem aside, sometimes helps, possibly by letting misleading approaches fade.

## Obstacles
- Functional fixedness: difficulty seeing an object as having a use other than its usual one. In Karl Duncker's candle problem, people must fix a candle to a wall using a box of drawing pins and matches. Few think of emptying the box and pinning it as a shelf; when the pins are presented outside the box, many more solve it. Norman Maier's two-string problem, solved by using pliers as a pendulum weight, shows the same.
- Mental set (Einstellung): persisting with a method that worked before. Abraham Luchins's water jar problems: after solving several problems with the formula B minus A minus 2C, most participants continued to use it even when a simpler solution (A minus C) existed, and many failed a problem that could only be solved simply. About three quarters of those given the set problems failed to see the simple method, compared with almost none in the control group.
- Unnecessary constraints: in the nine-dot problem, people assume lines must stay within the square.
- Problem representation: the same problem can be easy or hard depending on how it is represented, as in the mutilated chessboard problem.
- Confirmation bias: seeking information that supports one's first idea.
- Emotional states: anxiety narrows attention and reduces flexible thinking.
- Lack of relevant knowledge, and failure to transfer knowledge from one context to another.

## Stages of problem solving
A practical sequence often taught: identify and define the problem, generate alternatives, evaluate and choose, implement, and evaluate the outcome. D'Zurilla and Goldfried's problem-solving therapy uses these steps to help clients with depression and stress.

## Expertise
Experts differ from novices in organising knowledge around deep principles. Michelene Chi found that physics experts sorted problems by underlying principles (conservation of energy), whereas novices sorted them by surface features (inclined planes). Experts recognise patterns and use forward strategies; novices rely more on general heuristics such as means-end analysis.

## Applications
- Education: teaching problem representation, sub-goals and analogies across contexts.
- Clinical psychology: problem-solving therapy and teaching clients to generate alternatives in crises; deficits in social problem solving are linked to suicidal behaviour.
- Organisations: brainstorming, design thinking and overcoming fixedness.

## Conclusion
Problem solving can be understood as a search through a problem space guided by heuristics, but it also involves restructuring and insight. Functional fixedness, mental set and poor representation often block solutions, and expertise and flexible thinking help overcome them.`,
    keyPoints: ["Definition and problem space", "Well-defined versus ill-defined problems", "Algorithms versus heuristics with means-end analysis, working backwards, hill climbing", "Kohler's insight and Gestalt restructuring", "Metcalfe's warmth ratings or neural evidence for insight", "Duncker's candle problem", "Luchins's water jar mental set", "Expertise and applications"],
    pitfalls: ["Describing heuristics without examples", "Confusing functional fixedness with mental set"],
    module: "thinking-language/2-2",
    visuals: [
      { kind: "compare", data: { title: "Two obstacles to problem solving", a: { label: "Functional fixedness", points: ["Seeing an object only in its usual use", "Duncker's candle: the box is just a container", "Removing pins from the box helps"], summary: "Fixed on what objects are for." }, b: { label: "Mental set", points: ["Repeating a method that worked before", "Luchins's water jars: B minus A minus 2C", "Misses the simpler A minus C"], summary: "Fixed on how problems are solved." } } },
      { kind: "flow", caption: "The Gestalt view and insight", data: { title: "Wallas's stages of creative problem solving", layout: "chain", nodes: [{ id: "p", label: "Preparation", detail: "Study the problem and gather information." }, { id: "i", label: "Incubation", detail: "Set it aside; misleading paths fade." }, { id: "il", label: "Illumination", detail: "The solution comes suddenly: insight." }, { id: "v", label: "Verification", detail: "Check and refine the solution." }] } },
    ],
    ref: "Newell and Simon 1972; Kohler 1925; Duncker 1945; Luchins 1942; Metcalfe and Wiebe 1987; Kounios and Beeman 2009; Chi, Feltovich and Glaser 1981; Atkinson and Hilgard ch 9",
  },
  {
    id: "cog-l03-025",
    subject: S,
    topic: "problem-solving",
    marks: 10,
    difficulty: 3,
    exams: ["ugc-net", "ma-semester"],
    question: "Explain analogical problem solving with reference to the work of Gick and Holyoak. Why do people often fail to transfer solutions, and how can transfer be improved?",
    plan: ["Define analogy and its stages", "Duncker's radiation problem", "Gick and Holyoak's studies and findings", "Surface versus structural similarity", "Improving transfer", "Conclusion"],
    answer: `## Analogy
Analogical problem solving uses the solution to a familiar source problem to solve a new target problem with a similar underlying structure. It involves noticing that a source is relevant, mapping the correspondences between source and target, and applying the source solution. Dedre Gentner's structure-mapping theory holds that good analogies depend on shared relations among elements, not on shared surface features.

## The radiation problem
Karl Duncker's problem: a patient has an inoperable stomach tumour. A ray of high intensity will destroy the tumour but also the healthy tissue it passes through; a low intensity ray is harmless but does not destroy the tumour. How can the tumour be destroyed? The solution is to send several weak rays from different directions so that they converge on the tumour. Without help, only about 10 percent of people solve it.

## Gick and Holyoak's studies
Mary Gick and Keith Holyoak in 1980 first gave participants a story about a general who needed to capture a fortress. The roads to the fortress were mined so that a large army would set off the mines, so the general divided his army into small groups that converged on the fortress from different roads at the same time.
- When participants read the fortress story and then attempted the radiation problem, about 30 percent solved it, compared with about 10 percent of controls.
- When they were given a hint that the story might help, about 75 to 90 percent solved it.
- The major barrier was noticing the analogy, not applying it once noticed.
- In later work, Gick and Holyoak gave participants two different source stories with the same convergence structure and asked them to compare them. This helped them form an abstract schema ("divide and converge") and greatly increased spontaneous transfer.

## Why transfer often fails
- People are drawn by surface similarity (the same topic, objects or setting) rather than structural similarity (the same relations). A military story does not look like a medical problem.
- Memory retrieval is cued by surface features, so structurally useful sources are not recalled.
- Learning is context-bound: knowledge learned in a classroom is tied to that context.
- Novices encode problems in terms of surface features.
Kevin Dunbar's studies of scientists, however, show that in real laboratories researchers frequently use analogies, especially from closely related problems, suggesting that people use analogies more when they generate them themselves.

## Improving transfer
- Give multiple, varied examples and ask learners to compare them, which promotes schema abstraction.
- Explicitly label the underlying principle.
- Encourage learners to explain why a solution works (self-explanation).
- Present problems in different contexts and surface forms.
- Hint that earlier material is relevant.
- Develop expertise, since experts encode problems by deep structure.

## Applications
Teaching science through analogies (electricity as water flow), therapy metaphors in CBT and acceptance and commitment therapy, and creative design all rely on analogical transfer.

## Conclusion
Analogy is a powerful problem-solving tool, but people often fail to notice relevant analogies because they focus on surface features. Comparing multiple examples and highlighting structure help learners build abstract schemas that transfer.`,
    keyPoints: ["Definition and stages of analogical reasoning", "Duncker's radiation problem and solution", "Gick and Holyoak's results with and without hint", "Noticing as the main barrier", "Surface versus structural similarity", "Multiple examples and schema abstraction", "Practical methods to improve transfer"],
    module: "thinking-language/2-2",
    visuals: [
      { kind: "experiment", caption: "Gick and Holyoak's studies", data: { title: "Gick and Holyoak: does the fortress story help?", question: "What share solved Duncker's radiation problem in each condition?", unit: "%", conditions: [{ label: "No story", value: 10 }, { label: "Fortress story, no hint", value: 30 }, { label: "Fortress story with a hint to use it", value: 75 }], why: "People could apply the analogy but rarely noticed it on their own. Values approximate." } },
    ],
    ref: "Duncker 1945; Gick and Holyoak 1980 and 1983; Gentner 1983; Dunbar 1995; Atkinson and Hilgard ch 9",
  },
  {
    id: "cog-l03-026",
    subject: S,
    topic: "expertise",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net"],
    question: "What distinguishes experts from novices? Discuss research on chess expertise and the role of deliberate practice.",
    plan: ["Define expertise", "De Groot and Chase and Simon on chess", "Chunking theory and template theory", "Other differences between experts and novices", "Deliberate practice and its critics", "Conclusion"],
    answer: `## Expertise
Expertise is consistently superior performance in a specific domain, such as chess, medicine, music or sport, acquired through extensive experience. It is domain-specific: a chess grandmaster is not generally more intelligent or better at memory outside chess.

## Chess research
- Adriaan de Groot in the 1940s asked grandmasters and good club players to think aloud while choosing a move. Surprisingly, grandmasters did not search more moves or look further ahead. The difference was that they quickly saw the best moves. When briefly shown a board position for about five seconds, masters reproduced it almost perfectly, while weaker players placed far fewer pieces.
- William Chase and Herbert Simon in 1973 replicated this and added a crucial control: when pieces were placed randomly, the master's advantage largely disappeared. Experts' memory advantage depends on meaningful patterns, not on a better general memory.
- Chunking theory: experts have stored tens of thousands of familiar configurations of pieces (chunks) in long-term memory, estimated at about 50,000 to 100,000. Recognising chunks lets them hold more of the board in working memory and suggests good moves directly.
- Fernand Gobet's template theory extends this: experienced players develop larger templates, chunks with slots, which explain their ability to recall positions even with brief exposure.

## Other expert-novice differences
- Experts represent problems by deep principles; novices by surface features (Michelene Chi's physics studies).
- Experts work forwards from the given information; novices work backwards from the goal.
- Experts' knowledge is better organised and more easily retrieved.
- Experts have better self-monitoring and know when they are wrong.
- Many expert skills become automatic, freeing attention.
- K. Anders Ericsson and Walter Kintsch proposed long-term working memory: experts use retrieval structures that let them store and retrieve domain information rapidly.
- In medicine, expert clinicians use pattern recognition (illness scripts) for typical cases and switch to analytic reasoning for unusual ones.

## Deliberate practice
Ericsson and colleagues studied violinists at a Berlin music academy and found that the best had accumulated about 10,000 hours of solitary practice by age 20, far more than less accomplished students. They argued that expertise results mainly from deliberate practice: effortful activities designed to improve specific aspects of performance, with immediate feedback, often guided by a teacher, rather than simply playing or working for many years.

## Critics
- A meta-analysis by Brooke Macnamara and colleagues found that deliberate practice explained about 26 percent of variance in games, 21 percent in music and 18 percent in sports, and much less in professions, leaving most variance unexplained.
- Twin studies show genetic influences on musical ability and on the tendency to practise.
- Working memory capacity, starting age, personality and opportunity also matter.
- The "10,000 hour rule" popularised in the media was a simplification Ericsson himself rejected.

## Conclusion
Expertise rests on large stores of organised domain knowledge, especially recognisable patterns, built through years of focused practice. Practice is necessary but not sufficient; individual differences and opportunity also shape who becomes an expert.`,
    keyPoints: ["Domain-specific definition", "De Groot's think-aloud findings", "Chase and Simon random board control", "Chunking and template theories", "Other expert differences such as deep representation", "Deliberate practice with Ericsson's violinists", "Macnamara meta-analysis and genetic critiques"],
    module: "thinking-language/2-3",
    visuals: [
      { kind: "experiment", caption: "Chess research", data: { title: "Chase and Simon: memory for chess positions", question: "How many pieces were correctly placed after a 5-second look?", unit: " pieces", max: 25, conditions: [{ label: "Master, real game position", value: 16 }, { label: "Beginner, real game position", value: 4 }, { label: "Master, random position", value: 3 }, { label: "Beginner, random position", value: 3 }], why: "Masters recognise meaningful chunks; with random boards their advantage vanishes. Values approximate from the first trial." } },
    ],
    ref: "de Groot 1965; Chase and Simon 1973; Gobet and Simon 1996; Ericsson, Krampe and Tesch-Romer 1993; Macnamara, Hambrick and Oswald 2014 Psychological Science; Chi et al 1981",
  },
  {
    id: "cog-l03-027",
    subject: S,
    topic: "reasoning",
    marks: 15,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "Discuss deductive reasoning. Describe research on syllogisms and the Wason selection task, and evaluate the main theories that explain reasoning errors.",
    plan: ["Define deductive reasoning, validity and truth", "Syllogisms: atmosphere effect, belief bias", "Conditional reasoning and the Wason selection task", "Effects of content: thematic facilitation, social contracts", "Theories: mental logic, mental models, dual process, pragmatic schemas", "Conclusion"],
    answer: `## Meaning
Deductive reasoning draws conclusions that follow necessarily from given premises. If the premises are true and the argument is valid, the conclusion must be true. Validity depends only on the form of the argument, not on whether the premises or conclusion are true in the real world. Inductive reasoning, in contrast, draws probable conclusions from specific observations.

## Syllogistic reasoning
A categorical syllogism has two premises and a conclusion, using quantifiers such as all, some and no.
Example: All doctors are graduates. Some graduates are unemployed. Therefore some doctors are unemployed. This is invalid, though it may sound reasonable: the unemployed graduates need not be doctors.
Common errors:
- Atmosphere effect: people accept conclusions that share the "mood" of the premises (two "some" premises suggest a "some" conclusion).
- Conversion error: treating "All A are B" as meaning "All B are A".
- Belief bias: people accept invalid arguments with believable conclusions and reject valid arguments with unbelievable ones. Jonathan Evans and colleagues found that about 71 percent accepted an invalid argument with a believable conclusion, compared with about 10 percent with an unbelievable conclusion, while valid arguments were accepted about 89 percent of the time with believable and 56 percent with unbelievable conclusions.

## Conditional reasoning
Conditional statements take the form "If p, then q".
| Form | Structure | Valid? |
| Modus ponens | If p then q; p; therefore q | Valid |
| Modus tollens | If p then q; not q; therefore not p | Valid |
| Affirming the consequent | If p then q; q; therefore p | Invalid |
| Denying the antecedent | If p then q; not p; therefore not q | Invalid |
People almost always accept modus ponens, but often fail modus tollens and commit the two fallacies.

## The Wason selection task
Peter Wason in 1966 showed four cards: E, K, 4 and 7. Each card has a letter on one side and a number on the other. Rule: "If a card has a vowel on one side, it has an even number on the other." Which cards must be turned over to test the rule?
- Correct answer: E (modus ponens: it must have an even number) and 7 (modus tollens: it must not have a vowel).
- Typically only about 10 percent choose correctly. Most choose E alone or E and 4. Turning the 4 cannot falsify the rule, so choosing it reflects confirmation bias or matching bias (choosing cards that match the terms in the rule).

## Content effects
- Richard Griggs and James Cox's drinking age version: "If a person is drinking beer, they must be over 19." Cards: drinking beer, drinking coke, 22 years, 16 years. About 75 percent correctly chose "drinking beer" and "16 years".
- Patricia Cheng and Keith Holyoak's pragmatic reasoning schemas: people have learned schemas for permissions and obligations that guide reasoning.
- Leda Cosmides's social contract theory: evolution produced a cheater-detection module, so people reason well when the rule is a social contract (if you take a benefit, you must pay the cost), even with unfamiliar content.
- Familiarity alone does not explain the effect; the deontic (obligation) structure matters.

## Theories
- Mental logic theories (Lance Rips, Martin Braine): people have inference rules like formal logic; errors arise when rules are lacking or misapplied. They explain the ease of modus ponens but not content effects.
- Mental models theory (Philip Johnson-Laird): people build mental models of situations consistent with the premises and draw conclusions true in those models. Errors occur when people fail to construct all possible models, especially because of working memory limits. It predicts that problems needing more models are harder, which is supported.
- Dual process theories (Evans, Keith Stanovich): Type 1 processing is fast, intuitive and influenced by belief and matching; Type 2 is slow, analytic and logical, requiring working memory. Belief bias reflects Type 1 overriding Type 2. People higher in cognitive ability and thinking dispositions show less bias. Brain imaging by Vinod Goel showed different regions active when people reasoned logically against their beliefs, with the right prefrontal cortex involved in overcoming belief bias.
- Probabilistic approaches (Mike Oaksford and Nick Chater): people treat everyday reasoning as probabilistic, not deductive; choices in the selection task are rational if people seek information that is most informative in a world where the categories are rare.

## Evaluation
Laboratory tasks may underestimate reasoning because they strip away context. Reasoning improves with training in statistics and logic, and with motivation. Individual differences and culture matter: Alexander Luria found that unschooled Uzbek peasants refused to draw conclusions about things outside their experience, reasoning from experience rather than from premises.

## Conclusion
Human deductive reasoning is far from perfectly logical: people are swayed by belief, confirmation and content. Mental models and dual process theories best explain the pattern of successes and failures, while social contract and probabilistic views show that "errors" may reflect reasoning adapted to everyday life.`,
    keyPoints: ["Validity versus truth", "Syllogism example and belief bias figures", "Four conditional forms and their validity", "Wason task correct answer and typical error", "Drinking age version and social contract theory", "Mental models theory", "Dual process account with neural evidence", "Probabilistic and cultural perspectives"],
    pitfalls: ["Choosing the 4 card as correct", "Confusing validity with truth of conclusion"],
    module: "thinking-language/2-2",
    visuals: [
      { kind: "decide", caption: "The Wason selection task", data: { scene: "Cards show E, K, 4 and 7. Rule: if a card has a vowel on one side, it has an even number on the other.", ask: "Which cards must you turn to test the rule?", choices: [{ label: "E and 4", verdict: "harm", outcome: "The 4 cannot break the rule whatever is on its back.", why: "This is confirmation or matching bias." }, { label: "E only", verdict: "ok", outcome: "You check one way the rule could fail, but miss the other.", why: "A vowel behind the 7 would also break the rule." }, { label: "E and 7", verdict: "best", outcome: "These are the only cards that could falsify the rule.", why: "Modus ponens (E) and modus tollens (7)." }] } },
      { kind: "experiment", caption: "Syllogistic reasoning", data: { title: "Belief bias in syllogisms", question: "What share accepted each type of conclusion?", unit: "%", conditions: [{ label: "Valid, believable", value: 89 }, { label: "Valid, unbelievable", value: 56 }, { label: "Invalid, believable", value: 71 }, { label: "Invalid, unbelievable", value: 10 }], why: "Belief in the conclusion strongly sways judgements of logical validity." } },
    ],
    ref: "Wason 1966; Griggs and Cox 1982; Evans, Barston and Pollard 1983; Johnson-Laird 1983; Cosmides 1989; Cheng and Holyoak 1985; Goel and Dolan 2003; Oaksford and Chater 1994; Luria 1976",
  },
  {
    id: "cog-l03-028",
    subject: S,
    topic: "reasoning",
    marks: 5,
    difficulty: 2,
    exams: ["ma-semester", "cuet-pg"],
    question: "Write a short note on inductive reasoning.",
    plan: ["Define induction and contrast with deduction", "Types: generalisation, category-based, causal, analogy", "Errors and heuristics", "Importance in science and clinical work"],
    answer: `## Meaning
Inductive reasoning draws general conclusions from specific observations, or predicts new cases from past ones. Unlike deduction, its conclusions are probable, not certain: however many white swans we see, a black swan may still exist. David Hume pointed out that induction cannot be justified by logic alone, yet it is the basis of everyday learning and science.

## Types
- Generalisation from examples: after several friendly street dogs, concluding that most street dogs are friendly.
- Category-based induction: if robins have a certain enzyme, do sparrows? Daniel Osherson and colleagues found that people are more confident when premises are similar to the conclusion category (similarity) and when premises are diverse and cover the category (diversity).
- Causal induction: inferring causes from patterns of co-occurrence, as in Harold Kelley's covariation model of attribution.
- Hypothesis testing and rule discovery: Wason's 2-4-6 task, in which people tried to discover a rule by proposing number triples, showed that most tested only triples that fitted their hypothesis (positive test strategy), rarely ones that could disprove it.
- Analogical reasoning.

## Errors
- Hasty generalisation from small samples.
- Confirmation bias, as in the 2-4-6 task.
- Representativeness and availability heuristics.
- Illusory correlation: perceiving relationships that do not exist, as in clinicians linking drawing features to diagnoses, shown by Loren and Jean Chapman.

## Importance
Science forms hypotheses by induction and tests them by deduction. Clinicians use induction in forming case formulations from a patient's history, and should guard against premature conclusions.`,
    keyPoints: ["Definition and probabilistic nature", "Contrast with deduction", "At least three types", "Wason 2-4-6 task", "Common errors such as illusory correlation", "Role in science and clinical work"],
    module: "thinking-language/2-2",
    visuals: [
      { kind: "reveal", caption: "Types", data: { prompt: "In Wason's 2-4-6 task, the rule was simply 'any three increasing numbers'. Why did most people fail to find it?", answer: "They guessed a narrower rule such as 'add 2' and only tried triples like 8-10-12 that fitted it. Every test said yes, so they never discovered their rule was wrong. Trying 1-5-20 would have helped." } },
    ],
    ref: "Hume 1748; Wason 1960; Osherson et al 1990; Chapman and Chapman 1969",
  },
  {
    id: "cog-l03-029",
    subject: S,
    topic: "decision-making",
    marks: 15,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "mcp-entrance", "md-psychiatry"],
    question: "Discuss Kahneman and Tversky's heuristics and biases approach to judgement. Explain representativeness, availability and anchoring with experimental evidence, and evaluate the approach.",
    plan: ["Normative versus descriptive models of judgement", "Representativeness with base rate neglect and conjunction fallacy", "Availability with evidence", "Anchoring and adjustment", "Dual process view and other biases", "Critique, applications and conclusion"],
    answer: `## Background
Normative models of judgement, such as probability theory and Bayes' theorem, describe how people should reason. Daniel Kahneman and Amos Tversky, from the 1970s, showed that people instead rely on heuristics, mental shortcuts that are fast and usually adequate but lead to systematic errors called biases. Kahneman received the Nobel Prize in economics in 2002 for this work.

## Representativeness heuristic
People judge the probability that something belongs to a category by how much it resembles the typical member, ignoring other relevant information.
- Base rate neglect: in the "engineer and lawyer" study, participants read personality sketches said to be drawn from a group of 70 lawyers and 30 engineers (or the reverse). A sketch that sounded like an engineer was judged likely to be an engineer regardless of the base rates. In clinical settings, a symptom that resembles a rare disorder may lead to overdiagnosis.
- Conjunction fallacy: in the Linda problem, Linda is described as bright, outspoken and concerned with social justice. About 85 percent of participants judged "Linda is a bank teller and active in the feminist movement" more probable than "Linda is a bank teller", which is logically impossible because a conjunction cannot be more probable than either of its parts.
- Insensitivity to sample size: people expect a small hospital and a large hospital to have the same number of days with over 60 percent boys born, although small samples vary more.
- Gambler's fallacy: after five heads, people expect tails because a random sequence "should" look balanced.
- Misconceptions of regression to the mean: praising good performance seems to make it worse and punishing bad performance seems to help, simply because extreme performances are followed by more average ones.

## Availability heuristic
People judge frequency or probability by how easily examples come to mind.
- When asked whether more English words begin with "k" or have "k" as the third letter, most say begin with, although words with k third are more common, because it is easier to retrieve words by their first letter.
- People overestimate the frequency of dramatic, widely reported causes of death (plane crashes, murders, terrorism) and underestimate common, undramatic ones (diabetes, stroke), as Sarah Lichtenstein and Paul Slovic showed.
- After a well-publicised case of a rare side effect, people overestimate its risk. Clinicians may overestimate a diagnosis they saw recently.

## Anchoring and adjustment
People make estimates by starting from an initial value (anchor) and adjusting, but adjustments are usually insufficient.
- Tversky and Kahneman spun a wheel of fortune that stopped at 10 or 65, then asked participants what percentage of African countries were in the United Nations. The median estimate was 25 after the anchor of 10 and 45 after 65, though the anchor was obviously random.
- Students estimated the product 8 x 7 x 6 x 5 x 4 x 3 x 2 x 1 as about 2,250, but 1 x 2 x 3 x ... x 8 as about 512; the true answer is 40,320.
- Anchoring affects salary negotiations, prices, legal sentencing and clinical judgements of risk.

## Dual process framework
Kahneman later described two systems: System 1, fast, automatic and intuitive, which produces heuristic judgements; and System 2, slow, effortful and analytical, which can check and correct System 1 but is lazy and limited by attention. Biases arise when System 1 answers an easier question (substitution) and System 2 fails to intervene.

## Other biases
Framing effects, overconfidence, hindsight bias ("I knew it all along", shown by Baruch Fischhoff), confirmation bias, illusory correlation, the affect heuristic and loss aversion.

## Critique
- Gerd Gigerenzer argued that many biases disappear when problems are presented as natural frequencies ("10 out of 1,000") rather than single-event probabilities, and that heuristics are often ecologically rational, performing well in real environments (the recognition heuristic, take-the-best).
- Some "errors" reflect reasonable interpretations of ambiguous wording, such as reading "Linda is a bank teller" as implying she is not a feminist.
- Laboratory problems may not represent real decisions with feedback and expertise.
- The approach describes biases more than it explains the underlying processes, though the dual process model addresses this.
- Some effects, such as certain priming and anchoring variants, have replicated less well, though core heuristics replicate robustly.

## Applications
- Clinical decision making: awareness of availability, anchoring on the first diagnosis and premature closure; using checklists and base rates.
- Public policy and nudges, such as default options for organ donation or pension saving.
- Finance, law and medicine use debiasing techniques: considering the opposite, using statistical decision aids, and presenting risks as natural frequencies.

## Conclusion
Kahneman and Tversky transformed the study of judgement by showing that people use heuristics that produce predictable biases. Critics show that heuristics are often adaptive and that presentation format matters, but the core insight, that human judgement departs systematically from normative rules, remains one of psychology's most influential contributions.`,
    keyPoints: ["Normative versus descriptive models", "Representativeness with base rate neglect and Linda problem", "Sample size, gambler's fallacy and regression", "Availability with letter k and causes of death", "Anchoring with UN study figures", "System 1 and System 2", "Gigerenzer's critique and natural frequencies", "Applications to clinical decision making and policy"],
    pitfalls: ["Calling heuristics always irrational", "Mixing up availability and representativeness"],
    module: "thinking-language/2-4",
    visuals: [
      { kind: "experiment", caption: "Anchoring and adjustment", data: { title: "Anchoring with a wheel of fortune", question: "What percentage of African countries did people estimate were in the UN?", unit: "%", conditions: [{ label: "Wheel stopped at 10", value: 25 }, { label: "Wheel stopped at 65", value: 45 }], why: "An obviously random number pulled estimates towards it." } },
      { kind: "sort", caption: "Availability heuristic", data: { prompt: "Which heuristic is at work?", buckets: ["Representativeness", "Availability", "Anchoring"], items: [{ text: "After news of a plane crash, flying feels very dangerous", bucket: 1 }, { text: "A quiet, tidy student must be a librarian, not a salesperson", bucket: 0 }, { text: "A seller's opening price shapes what you think is fair", bucket: 2 }, { text: "After five heads in a row, tails feels due", bucket: 0 }] } },
    ],
    ref: "Tversky and Kahneman 1974 Science; Kahneman and Tversky 1973; Tversky and Kahneman 1983 conjunction fallacy; Lichtenstein et al 1978; Kahneman 2011 Thinking, Fast and Slow; Gigerenzer and Hoffrage 1995",
  },
  {
    id: "cog-l03-030",
    subject: S,
    topic: "decision-making",
    marks: 10,
    difficulty: 3,
    exams: ["ugc-net", "ma-semester"],
    question: "Explain prospect theory and framing effects. How do they challenge expected utility theory?",
    plan: ["Expected utility theory", "Prospect theory: reference point, value function, loss aversion, probability weighting", "Asian disease framing study", "Other evidence: endowment effect", "Implications and conclusion"],
    answer: `## Expected utility theory
Classical economics assumes rational decision makers choose the option with the highest expected utility: the sum of the utility of each outcome multiplied by its probability. The theory, formalised by John von Neumann and Oskar Morgenstern, assumes stable preferences, invariance (the same choice regardless of how options are described) and consistent attitudes to risk.

## Prospect theory
Daniel Kahneman and Amos Tversky in 1979 proposed prospect theory as a descriptive account of how people actually choose under risk.
- Reference dependence: outcomes are evaluated as gains or losses relative to a reference point, usually the current situation, not as final states of wealth.
- The value function is S-shaped: concave for gains (diminishing sensitivity, so people are risk-averse for gains) and convex for losses (risk-seeking for losses).
- Loss aversion: the curve is steeper for losses than for gains. Losing 1,000 rupees feels about twice as bad as gaining 1,000 rupees feels good; a loss aversion ratio of about 2 is commonly estimated.
- Probability weighting: people overweight small probabilities (which explains buying lottery tickets and insurance) and underweight moderate to high probabilities. Certainty is given extra weight (the certainty effect).

## Framing effects
Framing is presenting logically equivalent information in different ways. Expected utility theory says framing should not matter; prospect theory predicts it will.
- The Asian disease problem: 600 people are expected to die from a disease. In the gain frame, Programme A saves 200 people for certain, while Programme B has a one third chance of saving all 600 and a two thirds chance of saving none. About 72 percent chose A (risk averse). In the loss frame, Programme C means 400 people will die for certain, while Programme D has a one third chance that nobody dies and two thirds that all 600 die. About 78 percent chose D (risk seeking). A and C are identical, as are B and D.
- Medical framing: patients and doctors are more likely to choose surgery when told of a 90 percent survival rate than a 10 percent mortality rate.
- Attribute framing: meat described as "75 percent lean" is rated better than "25 percent fat".

## Other evidence
- Endowment effect: people demand more to sell an object they own than they would pay to buy it. In Kahneman, Jack Knetsch and Richard Thaler's mug studies, owners asked for about twice the price that buyers offered.
- Status quo bias and the sunk cost effect.
- Disposition effect in investors: selling winning shares too early and holding losing ones too long.

## How they challenge expected utility theory
- Preferences depend on the description, violating invariance.
- Attitudes to risk reverse between gains and losses.
- Losses loom larger than equivalent gains.
- Decision weights are not linear probabilities.
Prospect theory remains descriptive and does not claim to be normative. Cumulative prospect theory refined it in 1992.

## Implications
- Health communication: framing messages about prevention as gains ("you will stay healthy") and screening as losses ("you may miss early cancer") can increase uptake, though effects are modest.
- Clinical consent: present both survival and mortality frames to reduce bias.
- Public policy: nudges and default options, as developed by Thaler and Cass Sunstein.

## Conclusion
Prospect theory shows that people evaluate outcomes relative to a reference point, dislike losses more than they like gains, and are swayed by framing. These findings undermine the assumption of fully rational choice and have transformed economics, medicine and public policy.`,
    keyPoints: ["Expected utility and invariance", "Reference point and S-shaped value function", "Loss aversion about twice", "Probability weighting and certainty effect", "Asian disease figures 72 and 78 percent", "Endowment effect", "Specific challenges to expected utility", "Applications"],
    module: "thinking-language/2-4",
    visuals: [
      { kind: "experiment", caption: "Framing effects", data: { title: "The Asian disease problem", question: "What share chose the safe option in each frame?", unit: "%", conditions: [{ label: "Gain frame: 200 saved for sure", value: 72 }, { label: "Loss frame: 400 die for sure", value: 22 }], why: "Identical outcomes, opposite choices: people avoid risk for gains and seek risk to avoid losses." } },
      { kind: "compare", caption: "Prospect theory", data: { title: "Gains versus losses", a: { label: "Gains", points: ["Concave value curve", "Prefer a sure gain", "Each extra rupee matters less"], summary: "Risk averse." }, b: { label: "Losses", points: ["Steeper, convex curve", "Gamble to avoid a sure loss", "Losses hurt about twice as much"], summary: "Risk seeking." } } },
    ],
    ref: "Kahneman and Tversky 1979 Econometrica; Tversky and Kahneman 1981 Science framing; Kahneman, Knetsch and Thaler 1990; McNeil et al 1982 medical framing; Thaler and Sunstein 2008",
  },
];
