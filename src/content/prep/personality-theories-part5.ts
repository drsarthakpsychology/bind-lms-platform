import type { PrepExam, PrepQuestion } from "@/lib/prep/types";

/** Personality · part 5: social-cognitive and cognitive approaches (Bandura, Rotter, Mischel, Kelly, Dollard and Miller, self-discrepancy and mindsets). */

const C: PrepExam = "cuet-pg";
const N: PrepExam = "ugc-net";
const M: PrepExam = "mcp-entrance";
const S: PrepExam = "ma-semester";

const AR: [string, string, string, string] = [
  "Both A and R are true, and R is the correct explanation of A",
  "Both A and R are true, but R is not the correct explanation of A",
  "A is true, but R is false",
  "A is false, but R is true",
];

type Q = Omit<PrepQuestion, "subject" | "topic"> & { topic?: string };
const p = (q: Q): PrepQuestion => ({ subject: "personality-theories", topic: "social-cognitive", ...q });

export const QUESTIONS: PrepQuestion[] = [
  // ── Bandura ────────────────────────────────────────────────────────────────
  p({
    id: "per-soccog-0198",
    exams: [C, N, S],
    difficulty: 1,
    type: "mcq",
    stem: "Albert Bandura defined self-efficacy as:",
    options: [
      "A person's overall sense of self-worth",
      "A person's belief in their ability to carry out the actions needed to reach a particular goal",
      "The belief that outcomes are controlled by luck",
      "The ability to delay gratification",
    ],
    answer: 1,
    explanation:
      "Self-efficacy is task-specific: a student may have high efficacy for statistics and low efficacy for public speaking. It predicts which tasks people take on, how much effort they put in and how long they persist. Self-worth (self-esteem) is a broader evaluation of oneself. Belief in luck relates to an external locus of control in Rotter's theory. Delay of gratification was studied by Mischel.",
    ref: "Bandura 1977, 1997",
  }),
  p({
    id: "per-soccog-0199",
    exams: [C, N, M, S],
    difficulty: 2,
    type: "match",
    stem: "Match Bandura's source of self-efficacy in List I with its example in List II.",
    lists: {
      left: ["A. Mastery experiences", "B. Vicarious experiences", "C. Verbal persuasion", "D. Physiological and emotional states"],
      right: [
        "i. A coach tells a nervous player, 'You've trained hard; you can do this.'",
        "ii. A student interprets her racing heart before a viva as excitement rather than a sign of failure",
        "iii. A student passes a series of increasingly difficult practice tests",
        "iv. A student watches a classmate with a similar background succeed in an entrance exam",
      ],
    },
    options: [
      "A-iii, B-iv, C-i, D-ii",
      "A-iv, B-iii, C-i, D-ii",
      "A-iii, B-i, C-iv, D-ii",
      "A-iii, B-iv, C-ii, D-i",
    ],
    answer: 0,
    explanation:
      "Bandura listed four sources. Mastery experiences, actually succeeding, are the most powerful (iii). Vicarious experiences come from watching similar others succeed (iv). Verbal persuasion is encouragement from others, which is weaker on its own (i). Physiological and emotional states matter through how they are interpreted, so reading arousal as readiness raises efficacy (ii). The other codes swap these sources.",
    ref: "Bandura 1977, 1997",
  }),
  p({
    id: "per-soccog-0200",
    exams: [C, N, M, S],
    difficulty: 2,
    type: "mcq",
    stem: "Bandura's 'triadic reciprocal determinism' (or reciprocal causation) proposes that:",
    options: [
      "The environment alone determines behaviour",
      "Personal factors, behaviour and the environment all influence one another",
      "Behaviour is determined only by genes",
      "Personality is determined only by unconscious drives",
    ],
    answer: 1,
    explanation:
      "A shy student (personal factor) may avoid group work (behaviour), which leads classmates to stop inviting her (environment), which further lowers her confidence (personal factor). Each part affects the others, though not always equally. Bandura rejected Skinner's view that the environment alone controls behaviour, and he did not see behaviour as determined only by genes or unconscious drives.",
    ref: "Bandura 1978, 1986",
  }),
  p({
    id: "per-soccog-0201",
    exams: [N, M, S],
    difficulty: 3,
    type: "statement",
    stem: "According to Bandura, which processes are needed for observational learning to lead to performance?",
    statements: [
      "A. Attention to the model's behaviour",
      "B. Retention, by storing the behaviour in memory as images or words",
      "C. Reproduction, the physical and mental ability to perform it",
      "D. Motivation, an incentive to perform it",
    ],
    options: [
      "C and D only",
      "A and B only",
      "A, B, C and D",
      "A, B and C only",
    ],
    answer: 2,
    explanation:
      "All four are needed. A child must notice the model (attention), remember what was done (retention), be able to do it (reproduction) and have a reason to do it, such as expected reward or seeing the model rewarded (motivation). Learning can occur after the first two, but performance needs all four, which is why the Bobo doll children who saw the model punished still showed what they had learned when offered rewards.",
    ref: "Bandura 1977, 1986",
  }),
  p({
    id: "per-soccog-0202",
    exams: [N, M, S],
    difficulty: 3,
    type: "assertion-reason",
    stem: "Read the Assertion (A) and Reason (R) and choose the correct option.",
    statements: [
      "A: Bandura distinguished efficacy expectations from outcome expectations.",
      "R: A person may believe that a certain action would lead to success (outcome expectation) but doubt that they can carry out that action (efficacy expectation).",
    ],
    options: AR,
    answer: 0,
    explanation:
      "Both are true and R explains A. A smoker may believe that quitting would greatly improve health (high outcome expectation) yet doubt she could resist cravings (low efficacy). Bandura argued that efficacy expectations are the stronger predictor of whether people try and persist, which is why treatments aim to build mastery step by step.",
    ref: "Bandura 1977, Psychol Rev",
  }),
  p({
    id: "per-soccog-0203",
    exams: [N, M],
    difficulty: 3,
    type: "match",
    stem: "Match Bandura's mechanism of moral disengagement in List I with its example in List II.",
    lists: {
      left: ["A. Euphemistic labelling", "B. Displacement of responsibility", "C. Dehumanisation", "D. Advantageous comparison"],
      right: [
        "i. 'Compared with what other companies dump in the river, our waste is nothing.'",
        "ii. Calling the bombing of civilians 'collateral damage'",
        "iii. 'I was only following my supervisor's orders.'",
        "iv. Describing a rival group as 'vermin' or 'animals'",
      ],
    },
    options: [
      "A-ii, B-iii, C-i, D-iv",
      "A-iii, B-ii, C-iv, D-i",
      "A-ii, B-iv, C-iii, D-i",
      "A-ii, B-iii, C-iv, D-i",
    ],
    answer: 3,
    explanation:
      "Bandura described ways people switch off self-condemnation so they can act against their moral standards. Euphemistic labelling sanitises harmful acts with soft language (ii). Displacement of responsibility blames an authority (iii), as in Milgram's studies. Dehumanisation strips victims of human qualities (iv). Advantageous comparison makes an act look minor beside worse acts (i). Others include moral justification, diffusion of responsibility, distorting consequences and blaming the victim. The other codes swap these.",
    ref: "Bandura 1999, Pers Soc Psychol Rev",
  }),
  p({
    id: "per-soccog-0204",
    exams: [N, M],
    difficulty: 4,
    type: "passage",
    stem: "Which conclusion is best supported by this study?",
    passage:
      "Adults with severe snake phobia are assigned to one of four groups: watching a film of models handling snakes, symbolic desensitisation, live modelling with guided participation (the therapist handles a snake and then helps the client do so step by step), or no treatment. Live modelling with guided participation eliminates the phobia in about 90% of clients and produces the largest gains in self-efficacy. Across all groups, post-treatment self-efficacy predicts how closely clients will approach a snake on a later test better than the type of treatment does.",
    options: [
      "Treatments work largely by raising self-efficacy, and direct mastery experiences raise it most",
      "Watching a film is the most effective treatment",
      "Self-efficacy is unrelated to behaviour change",
      "No treatment works as well as therapy",
    ],
    answer: 0,
    explanation:
      "Bandura and colleagues found that participant modelling, which provides guided mastery experiences, was the most effective treatment, and that efficacy beliefs measured after treatment predicted approach behaviour across treatments. This fits his claim that different therapies succeed to the extent that they strengthen self-efficacy. Film modelling helped less than guided participation. The results show efficacy was strongly related to change. The untreated group did not improve as much.",
    ref: "Bandura, Blanchard & Ritter 1969; Bandura, Adams & Beyer 1977",
  }),
  p({
    id: "per-soccog-0205",
    exams: [N, M, S],
    difficulty: 2,
    type: "mcq",
    stem: "Bandura's concept of 'collective efficacy' refers to:",
    options: [
      "The total of each member's IQ",
      "A group's shared belief in its ability to organise and act together to achieve goals",
      "The tendency of groups to loaf",
      "A group's average personality score",
    ],
    answer: 1,
    explanation:
      "Collective efficacy is a group-level belief, for example a village's confidence that by working together it can improve its water supply, or a team's belief that it can win. It predicts effort, persistence and success in sports teams, schools and communities. It is not a sum of IQs or personality scores. Social loafing is a different group process.",
    ref: "Bandura 1997, 2000",
  }),
  p({
    id: "per-soccog-0206",
    exams: [N, M, S],
    difficulty: 3,
    type: "mcq",
    stem: "In Bandura's account of self-regulation, people regulate their own behaviour through:",
    options: [
      "Unconscious defence mechanisms",
      "Reinforcement from others only",
      "Self-observation, judgement against personal standards, and self-reaction such as self-praise or self-criticism",
      "Fixed genetic programmes",
    ],
    answer: 2,
    explanation:
      "Bandura argued that people are not only shaped by external rewards; they set their own standards, monitor what they do, compare it with those standards and reward or criticise themselves. This lets behaviour stay consistent even when external rewards are absent. Unconscious defences are a psychoanalytic idea, and fixed genetic programmes leave no room for self-regulation.",
    ref: "Bandura 1986, 1991",
  }),
  // ── Rotter ─────────────────────────────────────────────────────────────────
  p({
    id: "per-soccog-0207",
    topic: "rotter",
    exams: [C, N, S],
    difficulty: 1,
    type: "mcq",
    stem: "A student who believes 'My exam results depend mainly on how hard I study' has, in Rotter's terms:",
    options: [
      "Learned helplessness",
      "An external locus of control",
      "Low self-efficacy",
      "An internal locus of control",
    ],
    answer: 3,
    explanation:
      "Rotter's locus of control is a generalised expectancy about whether outcomes depend on one's own behaviour (internal) or on luck, fate or powerful others (external). This student sees results as depending on her effort, so she is internal. An external student might say 'It depends on which questions come'. Self-efficacy is about ability to perform specific actions. Learned helplessness is giving up after uncontrollable events.",
    ref: "Rotter 1966",
  }),
  p({
    id: "per-soccog-0208",
    topic: "rotter",
    exams: [N, M, S],
    difficulty: 3,
    type: "mcq",
    stem: "In Rotter's social learning theory, behaviour potential in a given situation depends on:",
    options: [
      "Expectancy that the behaviour will lead to reinforcement, and the value of that reinforcement to the person",
      "Only the strength of the reinforcement",
      "Only the person's traits",
      "The person's unconscious conflicts",
    ],
    answer: 0,
    explanation:
      "Rotter's basic formula is that behaviour potential is a function of expectancy and reinforcement value, both within the 'psychological situation' as the person interprets it. A student will study for a scholarship exam if she expects studying to pay off and values the scholarship. Reinforcement strength alone ignores expectancy. Traits alone ignore the situation. Unconscious conflict is a psychoanalytic idea.",
    ref: "Rotter 1954; Feist & Feist, ch. 18",
  }),
  p({
    id: "per-soccog-0209",
    topic: "rotter",
    exams: [N, M],
    difficulty: 3,
    type: "assertion-reason",
    stem: "Read the Assertion (A) and Reason (R) and choose the correct option.",
    statements: [
      "A: Rotter's Internal-External (I-E) Scale uses a forced-choice format, with pairs of statements from which the person picks one.",
      "R: Rotter regarded locus of control as a fixed, inherited trait that cannot change.",
    ],
    options: AR,
    answer: 2,
    explanation:
      "A is true: the I-E Scale presents pairs such as 'Many of the unhappy things in people's lives are partly due to bad luck' versus 'People's misfortunes result from the mistakes they make', and the person chooses one; filler items disguise the purpose. R is false: Rotter saw locus of control as a learned generalised expectancy that develops from experience and can change. Levenson later split externality into 'powerful others' and 'chance' in her IPC scales.",
    ref: "Rotter 1966; Levenson 1981",
  }),
  p({
    id: "per-soccog-0210",
    topic: "rotter",
    exams: [N, M, S],
    difficulty: 2,
    type: "mcq",
    stem: "Research on locus of control has generally found that people with an internal locus of control:",
    options: [
      "Are always happier in every situation",
      "Are more likely to seek information, take health precautions and achieve in school and work",
      "Never feel stress",
      "Are less likely to take responsibility for outcomes",
    ],
    answer: 1,
    explanation:
      "Internals tend to gather information, follow health advice, resist social pressure and do better academically and at work, because they believe their actions matter. However, very high internality can cause self-blame in situations that are truly uncontrollable, so it is not always beneficial. Internals do feel stress. They are more, not less, likely to take responsibility.",
    ref: "Rotter 1966, 1990; Ng, Sorensen & Eby 2006",
  }),
  // ── Mischel ────────────────────────────────────────────────────────────────
  p({
    id: "per-soccog-0211",
    topic: "mischel",
    exams: [N, M, S],
    difficulty: 3,
    type: "match",
    stem: "Match the component of Mischel and Shoda's cognitive-affective personality system (CAPS) in List I with its description in List II.",
    lists: {
      left: ["A. Encodings", "B. Expectancies and beliefs", "C. Goals and values", "D. Competencies and self-regulatory plans"],
      right: [
        "i. What the person wants and considers important",
        "ii. How the person categorises situations, people and the self",
        "iii. What the person can do and the strategies they use to guide their behaviour",
        "iv. What the person expects will happen if they act in a certain way",
      ],
    },
    options: [
      "A-ii, B-i, C-iv, D-iii",
      "A-iv, B-ii, C-i, D-iii",
      "A-ii, B-iv, C-i, D-iii",
      "A-ii, B-iv, C-iii, D-i",
    ],
    answer: 2,
    explanation:
      "CAPS describes five kinds of cognitive-affective units: encodings, the way situations are interpreted (ii); expectancies and beliefs about outcomes and one's ability (iv); affects, or feelings; goals and values (i); and competencies and self-regulatory plans (iii). Different situations activate different units, producing stable if-then patterns. The other codes swap these.",
    ref: "Mischel & Shoda 1995, Psychol Rev",
  }),
  p({
    id: "per-soccog-0212",
    topic: "mischel",
    exams: [N, M],
    difficulty: 4,
    type: "passage",
    stem: "What do these observations best illustrate?",
    passage:
      "In a summer camp, observers recorded children's verbal aggression in several situations over weeks. Child A was very aggressive when warned by an adult but rarely aggressive when teased by peers. Child B showed the opposite pattern: calm with adults but explosive when teased. Overall, the two children had similar average levels of aggression. Each child's pattern across situations was stable from one part of the summer to the next.",
    options: [
      "Situations alone determine aggression for all children",
      "Personality does not exist because behaviour changes across situations",
      "Both children have identical personalities because their averages are equal",
      "Stable if-then 'behavioural signatures' of personality, as described by Mischel and Shoda",
    ],
    answer: 3,
    explanation:
      "Shoda, Mischel and Wright found that children showed consistent but distinct patterns of 'if situation X, then behaviour Y'. These signatures reveal personality even when average trait levels are the same, which helped reconcile variability across situations with stable individuality. Variability does not mean personality is absent. Equal averages hide different patterns. If situations alone mattered, all children would react the same way to each situation.",
    ref: "Shoda, Mischel & Wright 1994",
  }),
  p({
    id: "per-soccog-0213",
    topic: "mischel",
    exams: [N, M, S],
    difficulty: 3,
    type: "mcq",
    stem: "In Mischel's delay-of-gratification studies, children waited longer for a larger reward when they:",
    options: [
      "Distracted themselves or thought about the treat in 'cool', abstract ways, for example imagining a marshmallow as a fluffy cloud",
      "Stared at the treat and thought about how tasty it was",
      "Were told the treat would never arrive",
      "Were given the treat immediately",
    ],
    answer: 0,
    explanation:
      "Children who focused on the 'hot', appealing features of the treat struggled, while those who turned away, sang, or represented the treat in cool, non-consummatory terms waited much longer. Metcalfe and Mischel described this as a hot-cool system model of self-control. Staring at the treat's tasty qualities made waiting harder. The other options do not fit the procedure.",
    ref: "Mischel, Shoda & Rodriguez 1989; Metcalfe & Mischel 1999",
  }),
  p({
    id: "per-soccog-0214",
    topic: "mischel",
    exams: [N, M],
    difficulty: 3,
    type: "assertion-reason",
    stem: "Read the Assertion (A) and Reason (R) and choose the correct option.",
    statements: [
      "A: Mischel's critique of trait psychology led him to deny that people have any stable personality.",
      "R: Mischel later proposed that personality shows itself in stable patterns of variation across situations.",
    ],
    options: AR,
    answer: 3,
    explanation:
      "A is false and R is true. Mischel argued that broad traits predict single behaviours poorly and that situations matter, but he never claimed that personality does not exist. His later CAPS model located stability in consistent if-then profiles: people differ in how they interpret and respond to particular situations, and these patterns are stable. R correctly describes this later view, which is why A is wrong.",
    ref: "Mischel 1968; Mischel & Shoda 1995",
  }),
  // ── Kelly ─────────────────────────────────────────────────────────────────
  p({
    id: "per-soccog-0215",
    topic: "kelly",
    exams: [C, N, S],
    difficulty: 1,
    type: "mcq",
    stem: "George Kelly's personal construct theory views people as:",
    options: [
      "Machines driven by reinforcement",
      "Scientists who build and test their own theories (constructs) to predict and make sense of events",
      "Puppets of unconscious instincts",
      "Fixed bundles of inherited traits",
    ],
    answer: 1,
    explanation:
      "Kelly's 'man the scientist' image says everyone forms personal constructs, bipolar dimensions such as 'friendly versus distant', to anticipate events, and revises them when predictions fail. His philosophy of 'constructive alternativism' holds that there are always other ways to interpret the world. The other options describe behaviourist, psychoanalytic and trait views that Kelly rejected.",
    ref: "Kelly 1955; Feist & Feist, ch. 19",
  }),
  p({
    id: "per-soccog-0216",
    topic: "kelly",
    exams: [C, N, M, S],
    difficulty: 2,
    type: "mcq",
    stem: "In Kelly's Role Construct Repertory Test (Rep test), a person:",
    options: [
      "Answers true or false to hundreds of statements",
      "Interprets inkblots",
      "Considers three important people at a time and says how two are alike and different from the third, revealing their personal constructs",
      "Arranges cards with statements about the self into piles",
    ],
    answer: 2,
    explanation:
      "The person lists significant figures (mother, a disliked teacher, a happy person, and so on) and, for triads of them, names a way two are similar and the third different, such as 'kind versus selfish'. The constructs that emerge, and their arrangement in a repertory grid, show how the person sees their world. Inkblots are the Rorschach. True-false statements are the MMPI. Card sorts describe the Q-sort.",
    module: "assessment",
    ref: "Kelly 1955; Fransella, Bell & Bannister 2004",
  }),
  p({
    id: "per-soccog-0217",
    topic: "kelly",
    exams: [N, M, S],
    difficulty: 3,
    type: "match",
    stem: "Match Kelly's corollary in List I with its meaning in List II.",
    lists: {
      left: ["A. Individuality corollary", "B. Dichotomy corollary", "C. Sociality corollary", "D. Experience corollary"],
      right: [
        "i. Constructs are bipolar, with two opposite ends",
        "ii. People differ in how they construe events",
        "iii. A person's construct system changes as they successively construe events",
        "iv. To relate well to another, we must understand how they construe things",
      ],
    },
    options: [
      "A-ii, B-i, C-iii, D-iv",
      "A-i, B-ii, C-iv, D-iii",
      "A-ii, B-iv, C-i, D-iii",
      "A-ii, B-i, C-iv, D-iii",
    ],
    answer: 3,
    explanation:
      "Kelly set out a fundamental postulate and 11 corollaries. The individuality corollary says people construe events differently (ii). The dichotomy corollary says constructs are bipolar, such as 'good versus bad' (i). The sociality corollary says playing a role in another's life requires construing their constructions (iv), which underlies empathy in therapy. The experience corollary says constructs are revised with experience (iii). The other codes swap these.",
    ref: "Kelly 1955",
  }),
  p({
    id: "per-soccog-0218",
    topic: "kelly",
    exams: [N, M],
    difficulty: 4,
    type: "statement",
    stem: "Which of Kelly's definitions of emotional states are correct?",
    statements: [
      "A. Anxiety is the recognition that events lie mostly outside the range of convenience of one's construct system.",
      "B. Threat is the awareness of an imminent, comprehensive change in one's core structures.",
      "C. Guilt is the perception of having been dislodged from one's core role.",
      "D. Hostility is the continued effort to extort validation for a prediction that has already failed.",
    ],
    options: [
      "A, B, C and D",
      "A and B only",
      "C and D only",
      "A, B and C only",
    ],
    answer: 0,
    explanation:
      "All four are Kelly's definitions. He redefined emotions in terms of the construct system: anxiety when we cannot construe what is happening, threat when our core constructs are about to change, guilt when we act out of character with our core role, and hostility when we try to force events to fit a construction that has been disproved. These cognitive definitions are an early example of thinking about emotion in terms of meaning-making.",
    ref: "Kelly 1955",
  }),
  p({
    id: "per-soccog-0219",
    topic: "kelly",
    exams: [N, M, S],
    difficulty: 3,
    type: "mcq",
    stem: "Kelly's 'fixed-role therapy' involves:",
    options: [
      "Interpreting the client's dreams",
      "Writing a sketch of a new character with different constructs, which the client then lives out for a few weeks as an experiment",
      "Repeatedly exposing the client to a feared object",
      "Prescribing medication",
    ],
    answer: 1,
    explanation:
      "The therapist and client develop a character sketch, often built around a new construct, and the client acts as that person in daily life for about two weeks, as an experiment. Experiencing how others respond can loosen rigid constructs and show that other ways of being are possible. Dream interpretation is psychoanalytic. Exposure is behavioural. Medication is outside the approach.",
    ref: "Kelly 1955; Fransella 1995",
  }),
  p({
    id: "per-soccog-0220",
    topic: "kelly",
    exams: [N, M],
    difficulty: 3,
    type: "assertion-reason",
    stem: "Read the Assertion (A) and Reason (R) and choose the correct option.",
    statements: [
      "A: Kelly's fundamental postulate states that a person's processes are psychologically channelled by the ways in which they anticipate events.",
      "R: For Kelly, the main motive in life is to reduce sexual and aggressive tension.",
    ],
    options: AR,
    answer: 2,
    explanation:
      "A is true: Kelly built his theory on the idea that people are oriented towards anticipating and predicting events. R is false: Kelly explicitly rejected motivational concepts such as drives, instincts or needs; he saw people as active by nature, so the question is not what motivates them but how they construe and anticipate the world. Tension reduction is closer to Freud and to drive theories.",
    ref: "Kelly 1955",
  }),
  // ── Dollard and Miller, and later cognitive approaches ────────────────────
  p({
    id: "per-soccog-0221",
    topic: "learning-approaches",
    exams: [N, M, S],
    difficulty: 3,
    type: "mcq",
    stem: "Dollard and Miller translated psychoanalytic ideas into learning theory. In their account, the four basic elements of learning are:",
    options: [
      "Attention, retention, reproduction and motivation",
      "Id, ego, superego and libido",
      "Drive, cue, response and reinforcement",
      "Expectancy, value, situation and choice",
    ],
    answer: 2,
    explanation:
      "Dollard and Miller argued that a drive (such as hunger or fear) pushes action, cues tell the person when and where to respond, a response is made, and reinforcement (drive reduction) strengthens it. They explained Freud's ideas, such as repression and conflict, in these terms. The second option is Freudian, the third is Bandura's observational learning, and the fourth resembles Rotter's terms.",
    ref: "Dollard & Miller 1950",
  }),
  p({
    id: "per-soccog-0222",
    topic: "learning-approaches",
    exams: [N, M, S],
    difficulty: 3,
    type: "match",
    stem: "Match the type of conflict described by Miller in List I with its example in List II.",
    lists: {
      left: ["A. Approach-approach", "B. Avoidance-avoidance", "C. Approach-avoidance", "D. Double approach-avoidance"],
      right: [
        "i. Choosing between two jobs, each with attractive and unattractive features",
        "ii. Choosing between two attractive colleges",
        "iii. Wanting to propose to someone but fearing rejection",
        "iv. Having to choose between a painful injection and a long illness",
      ],
    },
    options: [
      "A-ii, B-iv, C-i, D-iii",
      "A-iv, B-ii, C-iii, D-i",
      "A-ii, B-iii, C-iv, D-i",
      "A-ii, B-iv, C-iii, D-i",
    ],
    answer: 3,
    explanation:
      "Approach-approach conflicts, between two desirable options, are usually resolved easily (ii). Avoidance-avoidance conflicts, between two undesirable options, cause vacillation and attempts to escape (iv). Approach-avoidance conflicts involve one goal with both good and bad features (iii); Miller found the avoidance gradient is steeper than the approach gradient, so people approach from afar and hesitate up close. Double approach-avoidance conflicts involve two goals that each have good and bad features (i). The other codes swap these.",
    ref: "Miller 1944; Dollard & Miller 1950",
  }),
  p({
    id: "per-soccog-0223",
    topic: "learning-approaches",
    exams: [N, M],
    difficulty: 4,
    type: "assertion-reason",
    stem: "Read the Assertion (A) and Reason (R) and choose the correct option.",
    statements: [
      "A: In an approach-avoidance conflict, a person often moves towards the goal from a distance but hesitates or retreats as the goal comes close.",
      "R: Miller found that the strength of avoidance increases more steeply than the strength of approach as one gets nearer to the goal.",
    ],
    options: AR,
    answer: 0,
    explanation:
      "Both are true and R explains A. In Miller's experiments with rats in harnesses, the pull towards food and the pull away from shock were measured at different distances; the avoidance gradient was steeper. Far from the goal, approach is stronger, so the person moves forward; near the goal, avoidance overtakes approach, so the person stops at the point where the gradients cross. This explains hesitation, for example before a wedding or an exam.",
    ref: "Miller 1944, 1959",
  }),
  p({
    id: "per-soccog-0224",
    topic: "learning-approaches",
    exams: [N, M, S],
    difficulty: 3,
    type: "mcq",
    stem: "Higgins' self-discrepancy theory predicts that a gap between the actual self and the ideal self tends to produce:",
    options: [
      "Dejection-related emotions such as sadness and disappointment",
      "Agitation-related emotions such as anxiety and guilt",
      "Euphoria",
      "No emotion",
    ],
    answer: 0,
    explanation:
      "Higgins distinguished the ideal self (hopes and aspirations) from the ought self (duties and obligations). Actual-ideal discrepancies signal the absence of positive outcomes and lead to dejection, disappointment and depressed mood. Actual-ought discrepancies signal the presence of possible punishment and lead to agitation, anxiety and guilt. Euphoria and no emotion are not predicted.",
    ref: "Higgins 1987, Psychol Rev",
  }),
  p({
    id: "per-soccog-0225",
    topic: "learning-approaches",
    exams: [C, N, S],
    difficulty: 2,
    type: "mcq",
    stem: "Carol Dweck distinguished people with a 'fixed mindset' from those with a 'growth mindset'. A person with a growth mindset believes that:",
    options: [
      "Intelligence is fixed at birth",
      "Abilities such as intelligence can be developed through effort, strategy and learning",
      "Effort is a sign of low ability",
      "Failure proves one lacks talent",
    ],
    answer: 1,
    explanation:
      "Dweck called these implicit theories: entity (fixed) versus incremental (growth). People with a growth mindset see challenges and mistakes as chances to learn, and tend to persist after failure. The other three options describe fixed-mindset beliefs. Large replication studies suggest that mindset interventions have small average effects, largest for lower-achieving students, so the idea is useful but not a cure-all.",
    ref: "Dweck 1999, 2006; Sisk et al. 2018; Yeager et al. 2019",
  }),
  // ── Comparison and application ───────────────────────────────────────────
  p({
    id: "per-soccog-0226",
    exams: [N, M],
    difficulty: 3,
    type: "match",
    stem: "Match the social-cognitive theorist in List I with the key concept in List II.",
    lists: {
      left: ["A. Albert Bandura", "B. Julian Rotter", "C. Walter Mischel", "D. George Kelly"],
      right: [
        "i. Personal constructs and constructive alternativism",
        "ii. Generalised expectancies such as locus of control",
        "iii. If-then behavioural signatures",
        "iv. Self-efficacy and reciprocal determinism",
      ],
    },
    options: [
      "A-iv, B-iii, C-ii, D-i",
      "A-ii, B-iv, C-iii, D-i",
      "A-iv, B-ii, C-iii, D-i",
      "A-iv, B-ii, C-i, D-iii",
    ],
    answer: 2,
    explanation:
      "Bandura is known for self-efficacy and reciprocal determinism (iv), Rotter for generalised expectancies including locus of control (ii), Mischel for if-then signatures and the CAPS model (iii), and Kelly for personal constructs (i). The other codes swap these.",
    ref: "Feist & Feist, chs. 17 to 19",
  }),
  p({
    id: "per-soccog-0227",
    exams: [N, M, S],
    difficulty: 3,
    type: "statement",
    stem: "Which statements correctly contrast social-cognitive approaches with radical behaviourism?",
    statements: [
      "A. Social-cognitive theorists give a central role to thoughts, expectations and beliefs.",
      "B. They argue that much learning happens by observing others, without direct reinforcement.",
      "C. They see people as able to regulate their own behaviour.",
      "D. They hold that internal mental events are irrelevant to explaining behaviour.",
    ],
    options: [
      "A, B, C and D",
      "A and D only",
      "B and D only",
      "A, B and C only",
    ],
    answer: 3,
    explanation:
      "A, B and C reflect the views of Bandura, Rotter and Mischel, who kept behaviourism's commitment to research but added cognition, observational learning and self-regulation. D is the radical behaviourist view of Skinner, who treated thoughts as behaviour to be explained, not as causes. That is the position social-cognitive theorists rejected.",
    ref: "Bandura 1986; Skinner 1974",
  }),
  p({
    id: "per-soccog-0228",
    exams: [N, M],
    difficulty: 4,
    type: "passage",
    stem: "Which intervention is most consistent with Bandura's theory?",
    passage:
      "A rural school counsellor notices that many girls from a particular block drop science after Class 10, saying 'Science isn't for girls like us.' Their test scores are similar to those of the boys who continue. The counsellor wants to change this.",
    options: [
      "Arrange talks and lab sessions with young women scientists from similar backgrounds, set graded science tasks the girls can succeed at, and coach them to interpret nervousness as normal",
      "Tell the girls their beliefs come from unresolved childhood conflicts",
      "Assume their decision reflects fixed traits and accept it",
      "Give a single lecture on the importance of science",
    ],
    answer: 0,
    explanation:
      "The girls appear to have low self-efficacy for science rather than low ability. Bandura's four sources of efficacy suggest similar role models (vicarious experience), graded successes (mastery), encouragement (verbal persuasion) and reinterpreting anxiety (physiological states), which option 1 combines. Option 2 is psychoanalytic and unsupported. Option 3 ignores the role of beliefs. A single lecture is weak verbal persuasion on its own.",
    ref: "Bandura 1997; Hackett & Betz 1981",
  }),
  p({
    id: "per-soccog-0229",
    topic: "rotter",
    exams: [N, M, S],
    difficulty: 3,
    type: "assertion-reason",
    stem: "Read the Assertion (A) and Reason (R) and choose the correct option.",
    statements: [
      "A: Locus of control and self-efficacy are the same concept under different names.",
      "R: Locus of control concerns beliefs about whether outcomes depend on one's behaviour, while self-efficacy concerns beliefs about whether one can perform the behaviour.",
    ],
    options: AR,
    answer: 3,
    explanation:
      "A is false and R is true. A person can believe that outcomes depend on effort (internal locus) yet doubt they can put in that effort (low self-efficacy), for example believing that regular exercise controls weight but feeling unable to keep it up. Locus of control is also a broad generalised expectancy, while self-efficacy is usually specific to tasks. R states the distinction that makes A wrong.",
    ref: "Bandura 1997; Rotter 1966",
  }),
  p({
    id: "per-soccog-0230",
    topic: "kelly",
    exams: [N, M, S],
    difficulty: 2,
    type: "mcq",
    stem: "Kelly's philosophical position of 'constructive alternativism' holds that:",
    options: [
      "There is only one correct way to see the world",
      "Any event can be interpreted in more than one way, and people are free to revise or replace their constructions",
      "Behaviour is determined by the environment",
      "Personality is fixed by childhood experience",
    ],
    answer: 1,
    explanation:
      "Kelly argued that we are not victims of our past or of events but of how we construe them, and since alternative constructions are always possible, change is possible. This idea anticipates cognitive therapies that help clients find alternative interpretations. The other options assert a single truth or determinism, which Kelly rejected.",
    ref: "Kelly 1955",
  }),
  p({
    id: "per-soccog-0231",
    exams: [C, N, S],
    difficulty: 1,
    type: "mcq",
    stem: "Which theorist is known for the concept of self-efficacy?",
    options: [
      "Gordon Allport",
      "Carl Jung",
      "Albert Bandura",
      "Erich Fromm",
    ],
    answer: 2,
    explanation:
      "Bandura introduced self-efficacy in the 1970s and made it central to his social cognitive theory. Jung is known for archetypes and introversion-extraversion, Allport for trait theory and functional autonomy, and Fromm for character orientations and the escape from freedom.",
    ref: "Bandura 1977",
  }),
  p({
    id: "per-soccog-0232",
    topic: "mischel",
    exams: [N, M],
    difficulty: 3,
    type: "mcq",
    stem: "Follow-ups of Mischel's preschool participants found that children who delayed longer at age 4 were, as adolescents and adults, on average:",
    options: [
      "More impulsive",
      "Less successful in school",
      "Identical to children who did not delay",
      "Rated as more socially and academically competent, though a later large replication found the link much weaker after controlling for background",
    ],
    answer: 3,
    explanation:
      "Mischel and colleagues reported that longer delay predicted better coping, concentration and academic scores. Watts, Duncan and Quan's larger, more diverse replication found that much of the association disappeared once family background and early cognitive ability were controlled. So the original finding stands as a correlation but its size and meaning are debated. The other options contradict the reported findings.",
    ref: "Shoda, Mischel & Peake 1990; Watts, Duncan & Quan 2018",
  }),
  p({
    id: "per-soccog-0233",
    exams: [N, M, S],
    difficulty: 2,
    type: "mcq",
    stem: "Skinner explained 'personality' as:",
    options: [
      "A person's repertoire of behaviours shaped by their history of reinforcement",
      "A set of unconscious drives",
      "An inherited set of traits",
      "A system of personal constructs",
    ],
    answer: 0,
    explanation:
      "Skinner saw no need for inner personality structures; what we call personality is the set of behaviours a person has learned through reinforcement and punishment, so different histories produce different 'personalities'. He accepted genetic influences on what can be learned, but he did not explain personality through inherited traits. Unconscious drives are Freudian. Personal constructs are Kelly's.",
    ref: "Skinner 1953, 1974",
  }),
  p({
    id: "per-soccog-0234",
    topic: "learning-approaches",
    exams: [N, M],
    difficulty: 3,
    type: "match",
    stem: "Match the concept in List I with the theorist in List II.",
    lists: {
      left: ["A. Possible selves", "B. Self-discrepancy", "C. Implicit theories of intelligence", "D. Explanatory style"],
      right: ["i. Martin Seligman", "ii. Carol Dweck", "iii. E. Tory Higgins", "iv. Hazel Markus"],
    },
    options: [
      "A-iii, B-iv, C-ii, D-i",
      "A-iv, B-iii, C-ii, D-i",
      "A-iv, B-ii, C-iii, D-i",
      "A-iv, B-iii, C-i, D-ii",
    ],
    answer: 1,
    explanation:
      "Markus and Nurius described possible selves, the selves we hope to become or fear becoming, which guide motivation (iv). Higgins proposed self-discrepancy theory (iii). Dweck proposed implicit theories of intelligence, or mindsets (ii). Seligman described optimistic and pessimistic explanatory styles (i). The other codes swap these.",
    ref: "Markus & Nurius 1986; Higgins 1987; Dweck 1999; Peterson & Seligman 1984",
  }),
  p({
    id: "per-soccog-0235",
    exams: [N, M, S],
    difficulty: 3,
    type: "statement",
    stem: "Which of the following are strengths commonly credited to social-cognitive theories of personality?",
    statements: [
      "A. Their concepts are clearly defined and testable in experiments.",
      "B. They have led to effective interventions, such as efficacy-building and modelling-based treatments.",
      "C. They explain both consistency and variability in behaviour across situations.",
      "D. They give a detailed account of unconscious motives and dreams.",
    ],
    options: [
      "B and D only",
      "A and D only",
      "A, B and C only",
      "A, B, C and D",
    ],
    answer: 2,
    explanation:
      "A, B and C are common strengths: testable constructs, many practical applications in health, education and therapy, and models such as CAPS that explain why people are both consistent and variable. D is not a strength of these theories; they say little about unconscious motivation or dreams, which some critics see as a weakness. They are also criticised for giving less attention to emotion and biology.",
    ref: "Feist & Feist, ch. 17; Cervone 2004",
  }),
  p({
    id: "per-soccog-0236",
    topic: "kelly",
    exams: [N, M],
    difficulty: 4,
    type: "passage",
    stem: "Which personal construct concept best explains Arun's reaction?",
    passage:
      "Arun has always seen himself as 'the responsible eldest son' who looks after his family. After a period of heavy drinking, he forgets his younger sister's wedding arrangements, which he had promised to handle. He feels intense distress, saying 'That wasn't me; I don't know who I am any more.'",
    options: [
      "Positive regard in Rogers' sense",
      "Hostility in Kelly's sense",
      "Anxiety in Freud's sense of moral anxiety only",
      "Guilt in Kelly's sense: perceiving that one has been dislodged from one's core role",
    ],
    answer: 3,
    explanation:
      "Kelly defined guilt not as breaking a moral rule but as the awareness of acting out of keeping with one's core role, the constructs that define who one is in relation to important others. Arun's behaviour clashed with his core role as the responsible son, causing guilt and confusion about identity. Hostility in Kelly's sense is trying to force evidence to fit a failed prediction, which is not described. Freud's moral anxiety is a different framework. Positive regard is unrelated.",
    ref: "Kelly 1955",
  }),
  p({
    id: "per-soccog-0237",
    exams: [N, M, S],
    difficulty: 3,
    type: "assertion-reason",
    stem: "Read the Assertion (A) and Reason (R) and choose the correct option.",
    statements: [
      "A: Social-cognitive theories have strongly influenced cognitive behavioural therapy.",
      "R: Albert Bandura was born in Mundare, a small town in Alberta, Canada.",
    ],
    options: AR,
    answer: 1,
    explanation:
      "Both are true, but R does not explain A. Concepts such as self-efficacy, modelling, expectancies and self-regulation shaped CBT techniques, for example graded mastery tasks, behavioural experiments and modelling in social skills training, and Kelly's constructivism influenced cognitive therapy's focus on interpretations. R is a true biographical fact about Bandura, but where he was born has nothing to do with the influence of these theories on therapy.",
    ref: "Bandura 1977; Beck 1976",
  }),
];
