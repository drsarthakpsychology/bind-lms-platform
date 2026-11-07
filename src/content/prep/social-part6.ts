import type { PrepExam, PrepQuestion } from "@/lib/prep/types";

/** Social · part 6: easy foundation items (self-serving bias, mere exposure, conformity, foot-in-the-door, catharsis, proximity) that open each topic. */

const C: PrepExam = "cuet-pg";
const N: PrepExam = "ugc-net";
const S: PrepExam = "ma-semester";

const s = (q: Omit<PrepQuestion, "subject">): PrepQuestion => ({ subject: "social", ...q });

export const QUESTIONS: PrepQuestion[] = [
  s({
    id: "soc-attr-0256",
    topic: "attribution",
    exams: [C, N, S],
    difficulty: 1,
    type: "mcq",
    stem: "A student says her high marks show how hard she worked, but blames her low marks on an unfair paper. This pattern is called the:",
    options: [
      "Self-serving bias",
      "Fundamental attribution error",
      "Halo effect",
      "False consensus effect",
    ],
    answer: 0,
    explanation:
      "The self-serving bias is the tendency to take credit for success by pointing to internal causes such as effort and ability, and to explain failure by external causes such as bad luck or a hard test. It helps protect self-esteem. The fundamental attribution error concerns how we explain other people's behaviour: we overestimate their dispositions and underestimate the situation. The halo effect is letting one good trait colour the overall impression of a person. The false consensus effect is overestimating how many people share our own opinions and habits.",
    ref: "Miller & Ross 1975; Myers, ch. 2",
  }),
  s({
    id: "soc-att-0257",
    topic: "attitudes",
    exams: [C, S],
    difficulty: 1,
    type: "mcq",
    stem: "Robert Zajonc found that people came to like unfamiliar words, faces and symbols more simply because they had seen them more often. This is known as the:",
    options: [
      "Mere exposure effect",
      "Sleeper effect",
      "Bystander effect",
      "Overjustification effect",
    ],
    answer: 0,
    explanation:
      "The mere exposure effect is the finding that repeated exposure to a neutral stimulus increases liking for it, even without any reward and sometimes without conscious recognition. It helps explain why familiar songs, brands and faces grow on us. The sleeper effect is the delayed increase in persuasion from a message given by a low-credibility source. The bystander effect is the drop in helping when other people are present. The overjustification effect is the loss of intrinsic interest in an activity after people are rewarded for doing it.",
    ref: "Zajonc 1968",
  }),
  s({
    id: "soc-conf-0258",
    topic: "conformity-obedience",
    exams: [C, S],
    difficulty: 1,
    type: "mcq",
    stem: "In social psychology, conformity is best defined as:",
    options: [
      "Following a direct order from a person in authority",
      "Agreeing to a direct request from a peer",
      "Changing one's behaviour or beliefs to match those of others because of real or imagined group pressure",
      "Persuading a majority to accept a minority's view",
    ],
    answer: 2,
    explanation:
      "Conformity is going along with the group without being directly asked, as in Asch's line studies, where people gave obviously wrong answers to match the majority. Following an order from an authority figure is obedience, studied by Milgram. Agreeing to a direct request is compliance, studied in techniques such as the foot-in-the-door. Persuading a majority to change its view is minority influence, which Moscovici studied, and it works in the opposite direction to conformity.",
    ref: "Asch 1956; Myers, ch. 6",
  }),
  s({
    id: "soc-pers-0259",
    topic: "persuasion",
    exams: [C, N, S],
    difficulty: 1,
    type: "mcq",
    stem: "A volunteer first asks you to sign a short petition and, a week later, asks you to give a whole day to the cause. The technique being used is the:",
    options: [
      "Foot-in-the-door technique",
      "Door-in-the-face technique",
      "Low-ball technique",
      "That's-not-all technique",
    ],
    answer: 0,
    explanation:
      "The foot-in-the-door technique starts with a small request that is easy to accept and then follows with a larger one. Having agreed once, people tend to see themselves as supporters of the cause and want to stay consistent. The door-in-the-face technique works the other way round: a very large request that is refused is followed by a smaller one, which feels like a concession. The low-ball technique gets agreement to a deal and then raises the cost. The that's-not-all technique sweetens an offer with extras before the person has replied.",
    ref: "Freedman & Fraser 1966; Cialdini 2001",
  }),
  s({
    id: "soc-agg-0260",
    topic: "aggression",
    exams: [C, S],
    difficulty: 1,
    type: "mcq",
    stem: "The 'catharsis' idea holds that venting anger, for example by hitting a pillow, reduces later aggression. What has research generally found?",
    options: [
      "Venting anger in this way usually maintains or increases aggression rather than reducing it",
      "Venting anger always removes aggressive feelings completely",
      "Venting works for adults but has no effect on children",
      "Venting reduces aggression only when it is done in front of the person who caused the anger",
    ],
    answer: 0,
    explanation:
      "Studies such as Bushman's, in which angry participants hit a punching bag while thinking about the person who annoyed them, found that venting kept anger high and led to more aggression afterwards, not less. Rehearsing aggressive thoughts and actions seems to prime further aggression. Better strategies include calming down, distraction and reappraising the situation. So the claim that venting always works is wrong. There is no good evidence for an age difference of the kind described, and venting at the person who caused the anger is itself aggression and tends to escalate conflict.",
    ref: "Bushman 2002",
  }),
  s({
    id: "soc-attr2-0261",
    topic: "interpersonal-attraction",
    exams: [C, S],
    difficulty: 1,
    type: "mcq",
    stem: "In Festinger, Schachter and Back's study of a student housing complex, friendships formed most often between people who:",
    options: [
      "Came from different home towns",
      "Had very different personalities",
      "Lived closest to each other",
      "Had the highest grades",
    ],
    answer: 2,
    explanation:
      "The study of the Westgate housing project found that residents were most likely to name as friends the people living next door or on the same floor, and that people living near stairways and mailboxes made more friends. This is the proximity or propinquity effect: being close increases chance meetings and familiarity, which build liking. Different home towns and different personalities do not predict friendship; if anything, similarity does. Grades played no part in the study's findings.",
    ref: "Festinger, Schachter & Back 1950",
  }),
];
