/**
 * Psychology Lab, batch 2 (experiments 8 to 12) and the content their
 * runners use. Same integrity rules as ./experiments: original wording, real
 * references only (for educator verification), honest evidence notes, and
 * `bookRefs` left empty until review.
 */

import type { LabExperiment } from "./experiments";

export const EXPERIMENTS_2: LabExperiment[] = [
  {
    id: "pavlov",
    num: 8,
    title: "Pavlov's bell",
    area: "Learning",
    level: "Foundation",
    minutes: 7,
    hook: "Ring a bell before food. Watch a new response being learned, then fade, then come back.",
    question: "How does a neutral sound come to trigger a response, and does that learning ever really go away?",
    steps: ["Pair the bell with food and watch the response grow.", "Ring the bell alone until the response fades.", "Let a day pass, then ring it again."],
    finding:
      "The response grows quickly at first, then levels off (acquisition). With the bell alone it fades (extinction). After a rest it partly returns (spontaneous recovery), which shows extinction did not erase the first learning.",
    theory: [
      "Food (the unconditioned stimulus) causes salivation without any learning. The bell (the conditioned stimulus) starts out neutral. After pairings, the bell alone causes salivation: the conditioned response.",
      "The Rescorla–Wagner model says learning is driven by surprise. Each trial changes the bell's strength by a fraction of the gap between what happened and what was expected. Big gap early, big change; small gap later, small change. That is why the curve bends and levels off.",
      "Extinction is new learning (\"the bell no longer means food\") laid over the old learning, not the old learning being deleted. The new learning is weaker and more tied to time and place, so it partly fades after a rest. Relearning is also faster the second time.",
      "A similar but different tone gets part of the response (generalisation). The more different the tone, the smaller the response.",
      "This simulation is a teaching model with fixed settings. It is not data from a real animal.",
    ],
    clinic: [
      "Phobias can be learned this way: something neutral is paired with fear. In 1920 Watson and Rayner conditioned fear of a white rat in an infant, \"Little Albert\". The study is now a lesson in ethics: there was no proper consent, the fear was never removed, and it would not be allowed today.",
      "Exposure therapy is planned extinction: meeting the feared cue, safely and repeatedly, without the bad outcome. Because extinction is new learning, fear can return after a gap or in a new place. Varying the settings and planning for relapse helps.",
      "Some people on chemotherapy develop a dislike of foods eaten before treatment, or feel sick on arriving at the hospital. This is learned taste aversion and conditioned nausea. Giving an unusual \"scapegoat\" food before treatment has been used to protect usual foods.",
    ],
    evidence: {
      status: "Well established",
      note: "Acquisition, extinction, spontaneous recovery and generalisation are among the most replicated findings in psychology. The Rescorla–Wagner model explains many results but not all (for example, some effects of pre-exposure to the tone).",
    },
    refs: [
      "Pavlov, I. P. (1927). Conditioned reflexes (G. V. Anrep, Trans.). Oxford University Press.",
      "Rescorla, R. A., & Wagner, A. R. (1972). A theory of Pavlovian conditioning: Variations in the effectiveness of reinforcement and nonreinforcement. In A. H. Black & W. F. Prokasy (Eds.), Classical conditioning II: Current research and theory (pp. 64 to 99). Appleton-Century-Crofts.",
      "Bouton, M. E. (2004). Context and behavioral processes in extinction. Learning & Memory, 11(5), 485 to 494.",
      "Watson, J. B., & Rayner, R. (1920). Conditioned emotional reactions. Journal of Experimental Psychology, 3(1), 1 to 14.",
      "Garcia, J., & Koelling, R. A. (1966). Relation of cue to consequence in avoidance learning. Psychonomic Science, 4(3), 123 to 124.",
      "Bernstein, I. L. (1978). Learned taste aversions in children receiving chemotherapy. Science, 200(4347), 1302 to 1303.",
    ],
    bookRefs: [],
    checks: [
      {
        q: "After extinction, the bell is rung again the next day and the dog salivates a little. What is this?",
        options: ["Generalisation", "Spontaneous recovery", "A new unconditioned response", "Proof extinction failed completely"],
        answer: 1,
        why: "The response partly returns after a rest because extinction was new learning on top of the old, not erasure.",
      },
      {
        q: "In the Rescorla–Wagner model, why do early pairings change the response the most?",
        options: ["The animal is more awake", "The food is bigger", "The surprise (prediction error) is biggest", "Later trials are not counted"],
        answer: 2,
        why: "Learning is proportional to the gap between what happens and what was expected. Early on, the gap is largest.",
      },
      {
        q: "A client finished exposure therapy for a dog phobia. Six months later, in a new city, the fear returns. What is the most useful reading?",
        options: ["Therapy did not work", "Expected relapse: extinction is tied to time and place; plan a booster", "She has a new disorder", "Exposure therapy is unsafe"],
        answer: 1,
        why: "Fear can return after time or in a new setting. Varied practice and booster sessions are part of good exposure work.",
      },
    ],
    reflect: "Think of one cue (a smell, a song, a place) that triggers a feeling in you. Can you trace the pairing that taught it? Has it ever faded and come back?",
    related: ["therapies", "anxiety", "trauma"],
    review: [
      "Teaching model only: fixed learning rates (0.30 pairing, 0.25 extinction, 50% of extinction fades after a rest). Check wording does not imply real data.",
      "Little Albert is described as an ethics lesson. Who Albert was is still disputed; the text avoids naming him.",
      "Check the chemotherapy example matches what oncology and liaison psychiatry teaching uses locally.",
    ],
  },
  {
    id: "design-study",
    num: 9,
    title: "Design the study",
    area: "Methods",
    level: "Intermediate",
    minutes: 8,
    hook: "A claim lands on your desk. Build a study that could really test it.",
    question: "What does a study need before we can believe that a treatment caused the change?",
    steps: ["Read the claim.", "Make six design choices. The meter shows how many threats you have closed.", "Lock your design, then improve it if you can."],
    finding:
      "Most weak claims come from studies without a fair comparison group. Random assignment, a believable control, a good measure taken before and after, and enough people close the biggest gaps. Even then, no single study is final.",
    theory: [
      "To say an app reduced anxiety, you need to rule out other reasons anxiety might drop. Each of those other reasons is a threat to validity.",
      "Internal validity asks: did the treatment cause the change in this study? Comparison groups, random assignment and blinding protect it. External validity asks: does the result apply to other people and places? Who you sample protects it.",
      "Random assignment is powerful because it balances the groups on average, even on things you never thought to measure.",
      "Real trials add more: registering the plan in advance, ethics approval, informed consent, and reporting every outcome measured, not just the ones that worked.",
    ],
    clinic: [
      "Every new therapy, app or supplement you hear about makes a causal claim. Ask: compared with what, and who chose who got it?",
      "Patients often come to treatment when they feel worst. They tend to improve somewhat anyway (regression to the mean, and natural recovery). This is why uncontrolled before-and-after results in clinics look better than trials.",
      "In psychotherapy research, participants cannot be fully blind to what they receive. Good trials use an active comparison and keep the outcome rater blind instead.",
    ],
    evidence: {
      status: "Well established",
      note: "These principles of research design are standard. The scores in this activity are a simplified teaching scheme; real judgement weighs threats differently in different studies.",
    },
    refs: [
      "Shadish, W. R., Cook, T. D., & Campbell, D. T. (2002). Experimental and quasi-experimental designs for generalized causal inference. Houghton Mifflin.",
      "Orne, M. T. (1962). On the social psychology of the psychological experiment: With particular reference to demand characteristics and their implications. American Psychologist, 17(11), 776 to 783.",
      "Barnett, A. G., van der Pols, J. C., & Dobson, A. J. (2005). Regression to the mean: What it is and how to deal with it. International Journal of Epidemiology, 34(1), 215 to 220.",
    ],
    bookRefs: [],
    checks: [
      {
        q: "Students with the highest anxiety this week join a programme. Next month they score lower. What else could explain the drop?",
        options: ["Demand characteristics only", "Regression to the mean", "Restricted range", "Nothing else, the programme worked"],
        answer: 1,
        why: "Extreme scores tend to move back towards average on re-testing, with or without treatment.",
      },
      {
        q: "Why is random assignment better than letting people choose their group?",
        options: ["It needs fewer people", "It balances the groups on average, even on things not measured", "It makes people blind", "It removes placebo effects"],
        answer: 1,
        why: "Choosers differ in motivation and more. Randomising spreads those differences evenly between groups.",
      },
      {
        q: "A trial compares a therapy with a waiting list. What does it NOT rule out?",
        options: ["Change over time", "Effects of attention and expectation", "Chance", "Seasonal change"],
        answer: 1,
        why: "A waiting list controls for time passing, but not for the boost of getting attention and hope. An active comparison does.",
      },
    ],
    reflect: "Think of a health claim you saw recently (a reel, an advert, a forward). Which of the eight threats would you ask about first?",
    related: ["therapies", "assessment", "ethics-law"],
    review: [
      "The eight threats and the rule for closing each are a simplified scheme for teaching. Check they match the research methods syllabus.",
      "The claim is fictional and is not a comment on any real app.",
    ],
  },
  {
    id: "correlation-cause",
    num: 10,
    title: "Correlation or cause?",
    area: "Methods",
    level: "Intermediate",
    minutes: 8,
    hook: "Six headlines, six scatter plots. Guess the link, then judge the claim.",
    question: "When two things go together, when can we say one causes the other?",
    steps: ["Look at the scatter plot. Guess how strong the link is.", "See the real r.", "Judge the headline, then look behind the data."],
    finding:
      "A correlation can come from a hidden third variable, from cause running the other way, or from chance in a small sample. A real link can also be hidden when only part of the range is studied. Causal claims need a design that rules these out, usually random assignment.",
    theory: [
      "Pearson's r runs from -1 to +1. Near 0 means no straight-line link; near ±1 means the points lie close to a line. r says nothing on its own about why.",
      "Third variable: something else (age, temperature, illness severity) drives both. Reverse causation: Y causes X, not the other way. Chance: small samples swing wildly, so a striking r in a few people is easy to get by luck, and easier still if only the striking studies are reported.",
      "Restricted range: if you only look at people who are all high on X (for example, only students already admitted), the link can shrink towards zero even when it is real across everyone.",
      "When people are randomly assigned to different levels of X, third variables and reverse causation are ruled out, so a link can be read as cause.",
      "The data here are generated by the computer with a known structure. They are not real studies.",
    ],
    clinic: [
      "Many findings in mental health are correlations: screen time and low mood, cannabis and psychosis, poverty and depression. Each needs the question: what else could explain this, and which way does it run?",
      "Patients who attend more sessions are often more unwell, not made worse by sessions. Reading clinic data without thinking about severity leads to wrong conclusions.",
      "Small pilot studies with impressive correlations often shrink when repeated with more people. Treat them as ideas to test, not facts.",
    ],
    evidence: {
      status: "Well established",
      note: "These are basic statistical facts. How large a sample is needed for a stable r depends on the true size of the link; a few hundred is a common rough guide.",
    },
    refs: [
      "Shadish, W. R., Cook, T. D., & Campbell, D. T. (2002). Experimental and quasi-experimental designs for generalized causal inference. Houghton Mifflin.",
      "Schönbrodt, F. D., & Perugini, M. (2013). At what sample size do correlations stabilize? Journal of Research in Personality, 47(5), 609 to 612.",
      "Simmons, J. P., Nelson, L. D., & Simonsohn, U. (2011). False-positive psychology. Psychological Science, 22(11), 1359 to 1366.",
    ],
    bookRefs: [],
    checks: [
      {
        q: "Across towns, more hospitals go with more deaths. What is the best reading?",
        options: ["Hospitals cause deaths", "A third variable: bigger towns have more of both", "Chance", "Restricted range"],
        answer: 1,
        why: "Population size drives both. Compare death rates per person instead.",
      },
      {
        q: "A study of 8 people finds r = 0.7 between chai and memory. What is the main worry?",
        options: ["Reverse causation", "With 8 people, a large r can easily appear by chance", "Restricted range", "None, r = 0.7 is strong"],
        answer: 1,
        why: "Small samples give unstable r values. Repeat with many more people before believing it.",
      },
      {
        q: "Which design best supports \"X causes Y\"?",
        options: ["A large survey with a strong r", "Randomly assigning people to get X or not, then measuring Y", "Asking people whether X helped them", "Following one person for a year"],
        answer: 1,
        why: "Random assignment rules out third variables and reverse causation.",
      },
    ],
    reflect: "Which trap fooled you most? Think of a mental health headline you have seen. Which trap could explain it?",
    related: ["assessment", "therapies", "depression"],
    review: [
      "All data are simulated with a known structure, and each run differs. Headlines are fictional.",
      "The small-sample example is deliberately chosen from many draws to look striking; the text explains this.",
    ],
  },
  {
    id: "conservation",
    num: 11,
    title: "Conservation tasks",
    area: "Development",
    level: "Foundation",
    minutes: 7,
    hook: "Same juice, taller glass. Read what children say, and work out how they are thinking.",
    question: "How does children's reasoning about \"the same amount\" change as they grow?",
    steps: ["Watch each classic task: see the before and after.", "Read what each child says.", "Name their stage and the kind of reasoning."],
    finding:
      "In Piaget's tasks, younger children often say the amount changed when only its shape or spread changed. Older children say it stayed the same, and explain why: it can be poured back, nothing was added, or one change balances another.",
    theory: [
      "Piaget called the stage from about 2 to 7 years pre-operational. Children's thinking is tied to how things look. They tend to focus on one feature at a time, such as the height of the juice. This is centration.",
      "From about 7 to 11 years, in the concrete operational stage, children can hold two features in mind and reason about changes. Three classic reasons: reversibility (it can be undone), identity (nothing was added or taken away) and compensation (taller but thinner).",
      "A child who gives the right answer but switches from one feature to another (\"this one is taller... no, that one is wider\") is still focusing on one feature at a time.",
      "Later research found that children succeed earlier when the task makes more sense to them. For example, when a \"naughty teddy\" messes up the row by accident, more young children say the number is still the same. Asking the same question twice can also make a child think the answer should change. So the ages are rough, and depend on the task and on schooling and culture.",
    ],
    clinic: [
      "When explaining an illness or a medicine to a young child, use one idea at a time, concrete examples and things they can see or handle.",
      "Children may change their answer when an adult asks the same question again, because they think the first answer was wrong. This matters in child interviews, including safeguarding interviews: avoid repeated and leading questions.",
      "Stage ages are averages. A child who is \"late\" on a conservation task is not necessarily delayed; check language, schooling, anxiety with a stranger, and how the task was asked.",
    ],
    evidence: {
      status: "Established, details debated",
      note: "The basic pattern (younger children judge by appearance) is robust. Piaget's age norms and his strict stage boundaries are debated: simpler, more natural tasks show earlier competence, and timing varies across cultures and schooling.",
    },
    refs: [
      "Piaget, J. (1952). The child's conception of number. Routledge & Kegan Paul.",
      "McGarrigle, J., & Donaldson, M. (1974). Conservation accidents. Cognition, 3(4), 341 to 350.",
      "Donaldson, M. (1978). Children's minds. Fontana.",
    ],
    bookRefs: [],
    checks: [
      {
        q: "A 5-year-old says the flattened clay has more \"because it's bigger now\". Which idea fits?",
        options: ["Reversibility", "Centration", "Compensation", "Identity"],
        answer: 1,
        why: "She is focusing on one feature (how wide it looks) and ignoring the others.",
      },
      {
        q: "\"If you pour it back, it will be the same.\" Which kind of reasoning is this?",
        options: ["Identity", "Compensation", "Reversibility", "Centration"],
        answer: 2,
        why: "The child mentally undoes the change.",
      },
      {
        q: "In the \"naughty teddy\" version, more young children conserve number. What does that suggest?",
        options: ["Piaget's tasks were perfect", "Children's ability depends partly on how the task is set up", "Teddies teach maths", "Young children always conserve"],
        answer: 1,
        why: "When the adult does not deliberately change the row, the question makes more sense, and children show more of what they know.",
      },
    ],
    reflect: "Think of a child you know. How would you explain a hospital visit or a blood test to them, using what you learned about how they reason?",
    related: ["child", "assessment"],
    review: [
      "Transcripts and names are fictional and written for teaching. Check they read naturally for Indian children and families.",
      "Age bands are Piaget's and are given as rough guides with the debate noted. Consider adding cross-cultural Piagetian work (for example Dasen) after checking the citation.",
    ],
  },
  {
    id: "attribution",
    num: 12,
    title: "Why did they do it?",
    area: "Social",
    level: "Intermediate",
    minutes: 7,
    hook: "Was it the person or the situation? Decide, then learn what was really going on.",
    question: "When we explain other people's behaviour, how much do we blame their character and miss their situation?",
    steps: ["Read what someone did.", "Slide: how much was the person, how much the situation?", "See the rest of the story, then rate again."],
    finding:
      "Observers tend to explain others' behaviour by their character and underweight the situation, even when the situation is clearly strong. This is called the fundamental attribution error, or correspondence bias. How strong it is varies with culture.",
    theory: [
      "An attribution is the reason we give for a behaviour. A dispositional attribution points to the person (lazy, rude, careless). A situational attribution points to circumstances (no bus, bad news, a threat).",
      "In a classic study, people read an essay that the writer had been told which side to argue. Readers still judged the writer's true opinion from the essay. The situation was known, and still underweighted.",
      "The situation is often invisible to the observer, while the person is right in front of them. Judging character is also fast; correcting for the situation takes effort and is skipped when we are busy or tired.",
      "The bias is not universal. A study comparing adults in India and the United States found that Indian adults used more situational and context explanations, and American adults more dispositional ones. The differences grew with age, suggesting they are learned.",
    ],
    clinic: [
      "Labels like \"non-compliant\", \"attention-seeking\" or \"unmotivated\" in case notes are attributions. They can hide a situation: cost, travel, side effects, fear, or not understanding the plan.",
      "A good formulation asks about situations as well as traits: what led up to it, what keeps it going, and what protects the person. That is where change is often possible.",
      "Stigma often works through attribution: seeing mental illness or addiction as weakness of character makes blame and rejection more likely. Explaining the situation and the illness can reduce blame.",
    ],
    evidence: {
      status: "Established, details debated",
      note: "Correspondence bias is well replicated in Western samples. Its size depends on culture, task and motivation, and a related idea (that people explain their own behaviour by situation but others' by character) is weaker than once thought.",
    },
    refs: [
      "Jones, E. E., & Harris, V. A. (1967). The attribution of attitudes. Journal of Experimental Social Psychology, 3(1), 1 to 24.",
      "Ross, L. (1977). The intuitive psychologist and his shortcomings: Distortions in the attribution process. In L. Berkowitz (Ed.), Advances in experimental social psychology (Vol. 10, pp. 173 to 220). Academic Press.",
      "Miller, J. G. (1984). Culture and the development of everyday social explanation. Journal of Personality and Social Psychology, 46(5), 961 to 978.",
      "Gilbert, D. T., & Malone, P. S. (1995). The correspondence bias. Psychological Bulletin, 117(1), 21 to 38.",
      "Malle, B. F. (2006). The actor-observer asymmetry in attribution: A (surprising) meta-analysis. Psychological Bulletin, 132(6), 895 to 919.",
    ],
    bookRefs: [],
    checks: [
      {
        q: "The case notes say a patient is \"non-compliant\" after missing three appointments. What is the first useful step?",
        options: ["Discharge for non-attendance", "Ask what got in the way (cost, travel, side effects, understanding)", "Note a personality problem", "Increase the dose"],
        answer: 1,
        why: "\"Non-compliant\" is an attribution to the person. Finding the situational barrier is often what fixes it.",
      },
      {
        q: "In the essay study, readers knew the writer was told which side to argue. What did they still do?",
        options: ["Ignored the essay", "Judged the writer's real opinion from the essay", "Blamed the teacher", "Refused to judge"],
        answer: 1,
        why: "Even a known, strong situation was underweighted. That is correspondence bias.",
      },
      {
        q: "What did cross-cultural work comparing India and the United States suggest?",
        options: ["The bias is the same everywhere", "Explanation styles differ by culture and are partly learned", "Indian adults never use dispositions", "Children show the biggest differences"],
        answer: 1,
        why: "Indian adults gave more context-based explanations, and the gap grew with age.",
      },
    ],
    reflect: "Think of the last time someone annoyed you. What situation might they have been in that you could not see?",
    related: ["case-sheet", "interview-mse", "ethics-law"],
    review: [
      "Vignettes are fictional. Check they are culturally appropriate and that the language case does not read as a comment on any group.",
      "The slider is a teaching device, not a validated measure of attribution style.",
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Conservation transcripts                                            */
/* ------------------------------------------------------------------ */

export const CONS_TASKS = ["liquid", "number", "length", "mass"] as const;
export type ConsTask = (typeof CONS_TASKS)[number];
export const CONS_STAGES = ["Pre-operational", "Concrete operational"] as const;
export const CONS_REASONS = ["Centration", "Reversibility", "Identity", "Compensation"] as const;
export type ConsReason = (typeof CONS_REASONS)[number];

export const CONS_TASK_TEXT: Record<ConsTask, { title: string; before: string; after: string; ask: string }> = {
  liquid: {
    title: "Liquid",
    before: "Two identical glasses with the same amount of juice. The child agrees they are the same.",
    after: "One glass is poured into a tall, thin glass while the child watches.",
    ask: "Is there more juice in one glass, or the same?",
  },
  number: {
    title: "Number",
    before: "Two rows of six coins, lined up one to one. The child agrees they are the same.",
    after: "One row is spread out so it is longer.",
    ask: "Are there more coins in one row, or the same?",
  },
  length: {
    title: "Length",
    before: "Two sticks of the same length, lined up. The child agrees they are the same.",
    after: "One stick is pushed along so it sticks out past the other.",
    ask: "Is one stick longer, or are they the same?",
  },
  mass: {
    title: "Clay",
    before: "Two equal balls of clay. The child agrees they are the same.",
    after: "One ball is rolled into a long sausage.",
    ask: "Is there more clay in one, or the same?",
  },
};

export type ConsItem = {
  id: string;
  task: ConsTask;
  child: string;
  age: number;
  says: string;
  stage: (typeof CONS_STAGES)[number];
  reason: ConsReason;
  why: string;
};

export const CONS_ITEMS: ConsItem[] = [
  { id: "c1", task: "liquid", child: "Asha", age: 4, says: "That one has more juice. It goes up higher.", stage: "Pre-operational", reason: "Centration", why: "She looks only at the height of the juice." },
  { id: "c2", task: "liquid", child: "Rohan", age: 7, says: "It's the same. If you pour it back into the first glass, it will come up to the same place.", stage: "Concrete operational", reason: "Reversibility", why: "He mentally undoes the pouring." },
  { id: "c3", task: "number", child: "Meera", age: 5, says: "This row has more. It goes all the way over here.", stage: "Pre-operational", reason: "Centration", why: "She judges by how long the row is, not how many coins." },
  { id: "c4", task: "number", child: "Kabir", age: 6, says: "Still six and six. You only moved them, you didn't put any more.", stage: "Concrete operational", reason: "Identity", why: "Nothing was added or taken away, so the number is the same. He is only 6, younger than Piaget's usual age: judge the reasoning, not the age." },
  { id: "c5", task: "length", child: "Zoya", age: 4, says: "This one is longer. See, it comes out here.", stage: "Pre-operational", reason: "Centration", why: "She looks at one end only." },
  { id: "c6", task: "length", child: "Arjun", age: 7, says: "Same. This one sticks out here, but the other one sticks out at the back.", stage: "Concrete operational", reason: "Compensation", why: "He sees that the gain at one end is balanced at the other." },
  { id: "c7", task: "mass", child: "Diya", age: 6, says: "The sausage has more, it's long... no wait, the ball has more, it's fatter.", stage: "Pre-operational", reason: "Centration", why: "She switches features but still looks at one at a time, never both together." },
  { id: "c8", task: "mass", child: "Tara", age: 8, says: "The same. It got longer but it also got thinner.", stage: "Concrete operational", reason: "Compensation", why: "She holds two features together: longer, but thinner." },
];

/* ------------------------------------------------------------------ */
/* Attribution vignettes                                               */
/* ------------------------------------------------------------------ */

export type AttributionCase = { id: string; act: string; reveal: string };

export const ATTRIBUTION_CASES: AttributionCase[] = [
  {
    id: "a1",
    act: "A man at the hospital pharmacy counter starts shouting at the staff.",
    reveal: "His young son is in the emergency ward. He has been sent between three counters for two hours to collect one injection.",
  },
  {
    id: "a2",
    act: "A patient has missed two follow-up appointments. The notes say \"non-compliant\".",
    reveal: "The clinic moved last month. The new one is two bus changes away, and each visit costs her a day's wages.",
  },
  {
    id: "a3",
    act: "A student wrote a strong, one-sided essay in favour of a new exam rule.",
    reveal: "The teacher told each student which side to argue. She was given the side \"in favour\".",
  },
  {
    id: "a4",
    act: "A college student has not handed in three assignments and keeps missing class.",
    reveal: "Her mother had a stroke last month. She is the main carer and also works evening shifts.",
  },
  {
    id: "a5",
    act: "A young man on the ward refuses to leave his room, even for meals.",
    reveal: "Another patient threatened him in the corridor last night. Staff did not see it.",
  },
  {
    id: "a6",
    act: "At the child clinic, a mother gives one-word answers and seems uninterested.",
    reveal: "She speaks Telugu. The forms and the doctor's questions were in Hindi and English, and she felt embarrassed to say she did not follow.",
  },
];

/* ------------------------------------------------------------------ */
/* Correlation scenarios (text; data are generated by the runner)      */
/* ------------------------------------------------------------------ */

export const CORR_READINGS = ["Fair causal claim", "Third variable", "Reverse causation", "Could be chance", "Restricted range"] as const;
export type CorrReading = (typeof CORR_READINGS)[number];
export type CorrKind = "third" | "reverse" | "fluke" | "restricted" | "rct";

export type CorrScenario = {
  id: string;
  kind: CorrKind;
  headline: string;
  x: string;
  y: string;
  n: number;
  answer: CorrReading;
  why: string;
  /** What the "look behind the data" button shows. */
  behind: string;
  /** Name of the hidden variable, for third-variable scenarios. */
  z?: string;
};

export const CORR_SCENARIOS: CorrScenario[] = [
  {
    id: "k1",
    kind: "third",
    headline: "Children with bigger feet read better, survey finds",
    x: "Shoe size",
    y: "Reading score",
    n: 60,
    answer: "Third variable",
    why: "Older children have bigger feet and read better. Age drives both.",
    behind: "Filled dots are older children, hollow dots younger. Look within one age group at a time: the link is gone.",
    z: "age",
  },
  {
    id: "k2",
    kind: "reverse",
    headline: "More therapy sessions linked to worse depression",
    x: "Sessions attended",
    y: "Depression score",
    n: 60,
    answer: "Reverse causation",
    why: "People who are more unwell are offered, and attend, more sessions. Severity drives attendance, not the other way.",
    behind: "In this simulation, depression score was set first, and the number of sessions was made to follow it.",
  },
  {
    id: "k3",
    kind: "fluke",
    headline: "Chai drinkers have sharper memory: study of 6 students",
    x: "Cups of chai a day",
    y: "Memory score",
    n: 6,
    answer: "Could be chance",
    why: "In the simulation there is no link at all. With 6 people, a striking r turns up by luck, especially if only the striking result is reported.",
    behind: "This sample was picked as the most striking of many small samples drawn from a population with r = 0. Draw new samples to see how much r jumps.",
  },
  {
    id: "k4",
    kind: "restricted",
    headline: "Entrance exam scores don't predict grades at top college",
    x: "Entrance exam score",
    y: "First-year grades",
    n: 200,
    answer: "Restricted range",
    why: "The college only admits the highest scorers, so everyone studied is bunched at the top. Across all applicants the link is clear.",
    behind: "Grey dots are the applicants who were not admitted. Across everyone, the link is much stronger.",
  },
  {
    id: "k5",
    kind: "rct",
    headline: "Randomly assigned extra sleep improved next-day recall",
    x: "Extra sleep given (hours)",
    y: "Words recalled",
    n: 80,
    answer: "Fair causal claim",
    why: "Sleep was assigned at random, so third variables and reverse causation are ruled out. Still worth repeating, but the causal reading is fair.",
    behind: "Because the amount of sleep was set by a coin toss, nothing about the students could have decided it.",
  },
  {
    id: "k6",
    kind: "third",
    headline: "Days with more ice cream sold have more drownings",
    x: "Ice creams sold",
    y: "Drownings",
    n: 60,
    answer: "Third variable",
    why: "Hot days bring both more ice cream and more swimming.",
    behind: "Filled dots are hot days, hollow dots cooler days. Look within one kind of day at a time: the link is gone.",
    z: "temperature",
  },
];
