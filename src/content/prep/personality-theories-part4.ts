import type { PrepExam, PrepQuestion } from "@/lib/prep/types";

/** Personality · part 4: humanistic and existential approaches (Rogers, Maslow, May, Frankl, Yalom, self-determination theory). */

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
const p = (q: Q): PrepQuestion => ({ subject: "personality-theories", module: "therapies", topic: "humanistic", ...q });

export const QUESTIONS: PrepQuestion[] = [
  // ── Rogers ─────────────────────────────────────────────────────────────────
  p({
    id: "per-hum-0158",
    exams: [C, N, S],
    difficulty: 1,
    type: "mcq",
    stem: "Carl Rogers believed that the basic motive in all living things is:",
    options: [
      "The death instinct",
      "The actualising tendency: a drive to grow, develop and fulfil one's potential",
      "The need to reduce hunger and thirst only",
      "The striving for superiority over others",
    ],
    answer: 1,
    explanation:
      "Rogers saw the actualising tendency as a single, positive force moving every organism towards growth, like a plant turning to light. In humans, part of it becomes the self-actualising tendency, which works to fulfil the self-concept. The death instinct is Freud's. Reducing hunger and thirst is a narrow drive-reduction view. Striving for superiority is Adler's idea.",
    ref: "Rogers 1959, 1961; Feist & Feist, ch. 11",
  }),
  p({
    id: "per-hum-0159",
    exams: [C, N, M, S],
    difficulty: 2,
    type: "mcq",
    stem: "According to Rogers, 'conditions of worth' develop when:",
    options: [
      "A child is rewarded for every behaviour",
      "A child receives unconditional love",
      "A child receives love and approval only when behaving in ways that others value, and so learns to value only those parts of the self",
      "A child is punished by teachers but not parents",
    ],
    answer: 2,
    explanation:
      "When positive regard is conditional ('I love you when you are good at studies'), children take in others' standards as their own and deny or distort experiences that do not fit. This creates incongruence between self and experience, which Rogers saw as the root of anxiety and psychological problems. Unconditional love prevents conditions of worth. Rewarding every behaviour is not the concept, and the source need not be teachers.",
    ref: "Rogers 1959",
  }),
  p({
    id: "per-hum-0160",
    exams: [C, N, M, S],
    difficulty: 2,
    type: "statement",
    stem: "Which of the following are the three therapist 'core conditions' that Rogers saw as central to change?",
    statements: [
      "A. Congruence (genuineness)",
      "B. Unconditional positive regard",
      "C. Accurate empathic understanding",
      "D. Interpretation of the unconscious",
    ],
    options: [
      "A, B, C and D",
      "A and D only",
      "B and D only",
      "A, B and C only",
    ],
    answer: 3,
    explanation:
      "Rogers proposed that a therapist who is genuine, accepts the client without conditions and understands the client's world from the inside creates a climate in which the client's actualising tendency can work. Interpretation of the unconscious (D) is a psychoanalytic technique that Rogers rejected as making the therapist the expert. His fuller list of six conditions also includes psychological contact, client incongruence, and the client perceiving the therapist's empathy and acceptance.",
    ref: "Rogers 1957",
  }),
  p({
    id: "per-hum-0161",
    exams: [N, M, S],
    difficulty: 3,
    type: "assertion-reason",
    stem: "Read the Assertion (A) and Reason (R) and choose the correct option.",
    statements: [
      "A: Rogers proposed that psychological distress arises from incongruence between the self-concept and actual experience.",
      "R: When experiences threaten the self-concept, the person may deny or distort them, which leaves part of their experience unacknowledged and creates anxiety and vulnerability.",
    ],
    options: AR,
    answer: 0,
    explanation:
      "Both are true and R explains A. A student who believes 'I am always calm' may deny feeling angry at a friend; the anger still exists but cannot be owned. The greater the gap between self and experience, the more threatened and defensive the person becomes, and in extreme cases the self can become disorganised. Therapy aims to let the person accept such experiences into the self.",
    ref: "Rogers 1959",
  }),
  p({
    id: "per-hum-0162",
    exams: [N, M, S],
    difficulty: 3,
    type: "mcq",
    stem: "Rogers and his colleagues used the Q-sort technique in research. In this method, clients:",
    options: [
      "Interpret inkblots",
      "Sort statements about themselves into piles from 'most like me' to 'least like me', once for the actual self and once for the ideal self, so the correlation between the two can be measured",
      "Tell stories about ambiguous pictures",
      "Answer true or false to 567 statements",
    ],
    answer: 1,
    explanation:
      "The Q-sort, devised by William Stephenson, forces a roughly normal distribution of cards. Comparing self and ideal sorts gives an index of self-ideal congruence. In Butler and Haigh's study, this correlation was near zero before client-centred therapy and rose substantially afterwards, while it stayed the same in a waiting group. Inkblots are the Rorschach, stories are the TAT, and 567 true-false items are the MMPI-2.",
    ref: "Stephenson 1953; Butler & Haigh 1954",
  }),
  p({
    id: "per-hum-0163",
    exams: [N, M],
    difficulty: 3,
    type: "match",
    stem: "Match Rogers' characteristic of the 'fully functioning person' in List I with its description in List II.",
    lists: {
      left: ["A. Openness to experience", "B. Existential living", "C. Organismic trust", "D. Experiential freedom"],
      right: [
        "i. Relying on one's own inner sense of what feels right when making decisions",
        "ii. Feeling free to choose and taking responsibility for one's choices",
        "iii. Living fully in each moment rather than fitting experience into fixed expectations",
        "iv. Being aware of all feelings and experiences without defensiveness",
      ],
    },
    options: [
      "A-iv, B-i, C-iii, D-ii",
      "A-iii, B-iv, C-i, D-ii",
      "A-iv, B-iii, C-i, D-ii",
      "A-iv, B-iii, C-ii, D-i",
    ],
    answer: 2,
    explanation:
      "Rogers described the fully functioning person as open to all experience (iv), living existentially in the present (iii), trusting their organism's evaluation of situations (i), feeling free to choose (ii), and being creative. He saw this as a direction of movement rather than a fixed end state. The other codes swap these descriptions.",
    ref: "Rogers 1961",
  }),
  p({
    id: "per-hum-0164",
    exams: [C, N, S],
    difficulty: 2,
    type: "mcq",
    stem: "In Rogers' theory, the 'ideal self' refers to:",
    options: [
      "The part of personality that follows the reality principle",
      "The person a person actually is, as seen by others",
      "The unconscious part of the mind",
      "The person a person would like to be",
    ],
    answer: 3,
    explanation:
      "The self-concept is how a person sees themselves, and the ideal self is who they would like to be. A large gap between the two is linked to low self-esteem and distress, and therapy often narrows it. Others' views of us are a different matter. The unconscious and the reality principle are Freudian ideas.",
    ref: "Rogers 1959",
  }),
  p({
    id: "per-hum-0165",
    exams: [N, M],
    difficulty: 4,
    type: "passage",
    stem: "Which response by the counsellor best shows accurate empathy in Rogers' sense?",
    passage:
      "A 20-year-old student says: 'My parents keep saying I should become a doctor like my uncle. I've tried, but I feel numb in biology class. I love music, but when I mention it they look disappointed. Sometimes I don't even know what I want any more.'",
    options: [
      "'You should tell your parents firmly that you want to do music.'",
      "'It sounds like you're caught between wanting to please your parents and a pull towards music, and that the pressure has left you unsure of what you yourself want.'",
      "'Many students feel this way; it will pass once you start your course.'",
      "'Your numbness in biology may reflect an unresolved Oedipal rivalry with your uncle.'",
    ],
    answer: 1,
    explanation:
      "Accurate empathy means understanding the client's inner world as if it were one's own and communicating that understanding back, including the feelings beneath the words (conflict, pressure, confusion). The second option gives advice, which places the counsellor as an expert. The third reassures and minimises, which can feel dismissive. The fourth offers a psychoanalytic interpretation, which Rogers avoided because it imposes the therapist's framework.",
    ref: "Rogers 1957, 1975",
  }),
  p({
    id: "per-hum-0166",
    exams: [N, M, S],
    difficulty: 3,
    type: "mcq",
    stem: "Large reviews of psychotherapy research have found that the therapeutic relationship, including empathy, positive regard and genuineness, is:",
    options: [
      "Important only in psychoanalysis",
      "Unrelated to therapy outcome",
      "Consistently related to outcome across many types of therapy, supporting part of Rogers' claim, though the core conditions are not always sufficient on their own",
      "Harmful to clients",
    ],
    answer: 2,
    explanation:
      "Meta-analyses by Norcross, Wampold, Elliott and others show that the alliance, empathy and positive regard predict outcome moderately across therapies, including CBT. This supports the importance of Rogers' conditions, though most researchers think specific techniques also matter for some problems, so the conditions may be necessary or helpful rather than sufficient. The other options contradict the evidence.",
    ref: "Elliott et al. 2018; Norcross & Lambert 2019",
  }),
  p({
    id: "per-hum-0167",
    exams: [N, M],
    difficulty: 3,
    type: "assertion-reason",
    stem: "Read the Assertion (A) and Reason (R) and choose the correct option.",
    statements: [
      "A: Rogers renamed his approach from 'client-centred' to 'person-centred' in his later career.",
      "R: Rogers wanted to show that his ideas applied beyond therapy, to education, groups, families and conflict resolution.",
    ],
    options: AR,
    answer: 0,
    explanation:
      "Both are true and R explains A. In his later years Rogers applied his approach to encounter groups, student-centred teaching and international peace work, including meetings in Northern Ireland and South Africa. 'Person-centred' signalled that the same conditions of empathy, acceptance and genuineness support growth in any human relationship, not only between therapist and client.",
    ref: "Rogers 1980",
  }),
  // ── Maslow ─────────────────────────────────────────────────────────────────
  p({
    id: "per-hum-0168",
    topic: "maslow",
    exams: [C, N, S],
    difficulty: 1,
    type: "mcq",
    stem: "In Maslow's hierarchy of needs, the correct order from lowest to highest is:",
    options: [
      "Esteem, safety, physiological, love and belonging, self-actualisation",
      "Safety, physiological, esteem, love and belonging, self-actualisation",
      "Physiological, love and belonging, safety, self-actualisation, esteem",
      "Physiological, safety, love and belonging, esteem, self-actualisation",
    ],
    answer: 3,
    explanation:
      "Maslow held that lower needs must be reasonably met before higher ones become strong motives: first food, water and sleep, then safety and security, then love and belonging, then esteem (self-respect and respect from others), and finally self-actualisation, the fulfilment of one's potential. In later writings he added self-transcendence above self-actualisation. The other sequences put the needs out of order.",
    ref: "Maslow 1943, 1970",
  }),
  p({
    id: "per-hum-0169",
    topic: "maslow",
    exams: [C, N, M, S],
    difficulty: 2,
    type: "mcq",
    stem: "Maslow distinguished 'deficiency needs' (D-needs) from 'being needs' (B-needs). Being needs are:",
    options: [
      "Growth motives such as truth, beauty, goodness and justice that energise self-actualising people",
      "Needs that arise from a lack of food or safety",
      "Needs that disappear once they are satisfied",
      "Unconscious sexual drives",
    ],
    answer: 0,
    explanation:
      "D-needs (physiological, safety, belonging, esteem) arise from a lack and stop driving behaviour once met. B-needs, or metaneeds, are values such as truth, beauty, wholeness, justice and meaningfulness that motivate growth and are not 'filled up'. Maslow said that frustrating metaneeds can cause 'metapathologies' such as cynicism and apathy. Lack of food or safety describes D-needs. Unconscious sexual drives are Freudian.",
    ref: "Maslow 1968, 1971",
  }),
  p({
    id: "per-hum-0170",
    topic: "maslow",
    exams: [N, M, S],
    difficulty: 3,
    type: "statement",
    stem: "Which of the following did Maslow list as characteristics of self-actualising people?",
    statements: [
      "A. More efficient perception of reality and comfort with uncertainty",
      "B. Acceptance of self, others and nature",
      "C. Frequent peak experiences",
      "D. A need to be liked by everyone they meet",
    ],
    options: [
      "A and D only",
      "A, B and C only",
      "B and D only",
      "A, B, C and D",
    ],
    answer: 1,
    explanation:
      "From his study of people such as Abraham Lincoln, Eleanor Roosevelt and Albert Einstein, Maslow described self-actualisers as realistic (A), accepting (B), spontaneous, problem-centred, independent, appreciative and prone to peak experiences (C), with deep but few friendships and a philosophical sense of humour. D is wrong: they were independent of others' approval and comfortable with privacy, so a need to be liked by everyone is the opposite.",
    ref: "Maslow 1970, ch. 11",
  }),
  p({
    id: "per-hum-0171",
    topic: "maslow",
    exams: [N, M],
    difficulty: 3,
    type: "assertion-reason",
    stem: "Read the Assertion (A) and Reason (R) and choose the correct option.",
    statements: [
      "A: Research has found strong support for Maslow's claim that needs must be satisfied in a strict fixed order.",
      "R: Maslow based his description of self-actualising people on a small, hand-picked sample of people he admired.",
    ],
    options: AR,
    answer: 3,
    explanation:
      "A is false and R is true. Reviews such as Wahba and Bridwell's found little evidence for a rigid order, and Tay and Diener's large international study found that people can enjoy the benefits of higher needs, such as respect and belonging, even when basic needs are not fully met, though needs are broadly universal. R is a true and often criticised feature of Maslow's method: his sample was small, selected by his own judgement and lacked controls.",
    ref: "Wahba & Bridwell 1976; Tay & Diener 2011",
  }),
  p({
    id: "per-hum-0172",
    topic: "maslow",
    exams: [N, M, S],
    difficulty: 3,
    type: "mcq",
    stem: "Maslow's term 'Jonah complex' refers to:",
    options: [
      "Fear of the sea",
      "A complex about one's father",
      "Fear of one's own greatness and potential, which leads people to avoid growth",
      "A desire to be swallowed by the group",
    ],
    answer: 2,
    explanation:
      "Named after the biblical Jonah, who tried to run from his calling, the Jonah complex is the fear of success and of fulfilling one's potential, partly because growth brings responsibility and uncertainty. Maslow saw it as one reason so few people self-actualise. It is not about the father, the sea or merging with a group.",
    ref: "Maslow 1971",
  }),
  p({
    id: "per-hum-0173",
    topic: "maslow",
    exams: [C, N, S],
    difficulty: 2,
    type: "mcq",
    stem: "Humanistic psychology was called the 'third force' in psychology because it:",
    options: [
      "Was based on three core needs",
      "Was the third school founded by Wundt",
      "Came after cognitive and biological psychology",
      "Offered an alternative to the two dominant forces, psychoanalysis and behaviourism",
    ],
    answer: 3,
    explanation:
      "In the 1950s and 1960s, Maslow, Rogers, May and others argued that psychoanalysis was too focused on pathology and behaviourism too mechanical. They emphasised free will, growth, meaning and subjective experience, and formed the Association for Humanistic Psychology in the early 1960s. It was not a school founded by Wundt. It came before the cognitive revolution was fully established. The 'three needs' idea is unrelated.",
    ref: "Maslow 1968; Schultz & Schultz, History of Modern Psychology",
  }),
  p({
    id: "per-hum-0174",
    topic: "maslow",
    exams: [N, M],
    difficulty: 4,
    type: "passage",
    stem: "How would Maslow most likely interpret these two cases?",
    passage:
      "Case 1: A labourer in a flood-hit village has lost his home. He spends his days searching for food and safe shelter for his family and shows little interest in a free painting workshop offered by volunteers. Case 2: A successful software engineer with a secure job, a loving family and recognition at work says he feels restless and empty, and wonders whether he is 'doing anything that truly matters'.",
    options: [
      "Case 1 is dominated by physiological and safety needs; Case 2 has met deficiency needs and is now motivated by growth (being) needs towards self-actualisation",
      "Both are dominated by esteem needs",
      "Case 1 is self-actualising; Case 2 is dominated by safety needs",
      "Neither case can be understood using Maslow's theory",
    ],
    answer: 0,
    explanation:
      "When basic needs are threatened, as for the flood survivor, they dominate attention and higher interests such as art fade. When deficiency needs are met, as for the engineer, growth needs for meaning and self-fulfilment become important, and their frustration can feel like emptiness (a 'metapathology'). Neither is mainly about esteem. Option 3 reverses the cases. The theory clearly applies to both.",
    ref: "Maslow 1943, 1971",
  }),
  p({
    id: "per-hum-0175",
    topic: "maslow",
    exams: [N, M, S],
    difficulty: 2,
    type: "mcq",
    stem: "A 'peak experience', in Maslow's sense, is:",
    options: [
      "The highest score on an achievement test",
      "A moment of intense joy, wonder or unity in which a person feels fully alive and at one with the world",
      "A period of severe stress",
      "The point at which a need is satisfied",
    ],
    answer: 1,
    explanation:
      "Maslow described peak experiences as brief, profound experiences, during music, nature, love, creative work or religious moments, marked by loss of self-consciousness and a sense of meaning. He found them more frequent in self-actualisers but available to anyone. They are not test scores, stress periods or need satisfaction points.",
    ref: "Maslow 1964, 1968",
  }),
  // ── Existential approaches ────────────────────────────────────────────────
  p({
    id: "per-ex-0176",
    topic: "existential",
    exams: [C, N, S],
    difficulty: 2,
    type: "mcq",
    stem: "Viktor Frankl, who survived Nazi concentration camps, founded 'logotherapy'. Its central idea is that the primary human motive is:",
    options: [
      "The will to power",
      "The will to pleasure",
      "The will to meaning",
      "The need for safety",
    ],
    answer: 2,
    explanation:
      "Frankl argued that people are driven above all to find meaning, and that even in extreme suffering meaning can be found through what we create, what we experience and love, and the attitude we take towards unavoidable suffering. He contrasted this with Freud's will to pleasure and Adler's will to power. Safety is one of Maslow's lower needs.",
    ref: "Frankl 1946, 1969",
  }),
  p({
    id: "per-ex-0177",
    topic: "existential",
    exams: [N, M, S],
    difficulty: 3,
    type: "match",
    stem: "Match the logotherapy concept in List I with its description in List II.",
    lists: {
      left: ["A. Existential vacuum", "B. Paradoxical intention", "C. Dereflection", "D. Attitudinal values"],
      right: [
        "i. Shifting attention away from oneself and one's symptom towards other people or tasks",
        "ii. Asking the client to deliberately wish for or try to produce the feared symptom",
        "iii. A sense of emptiness and boredom from lacking meaning in life",
        "iv. Meaning found in the stance one takes towards unavoidable suffering",
      ],
    },
    options: [
      "A-iii, B-ii, C-iv, D-i",
      "A-ii, B-iii, C-i, D-iv",
      "A-iii, B-i, C-ii, D-iv",
      "A-iii, B-ii, C-i, D-iv",
    ],
    answer: 3,
    explanation:
      "The existential vacuum is the boredom and emptiness Frankl saw as common in modern life (iii). Paradoxical intention asks a person who fears, say, sweating in public to try to sweat as much as possible, which often breaks the cycle of anticipatory anxiety (ii). Dereflection counters excessive self-observation, as in some sexual problems, by turning attention outward (i). Attitudinal values are the meaning found in how one faces suffering (iv), alongside creative and experiential values. The other codes swap these.",
    ref: "Frankl 1967, 1969",
  }),
  p({
    id: "per-ex-0178",
    topic: "existential",
    exams: [N, M],
    difficulty: 3,
    type: "match",
    stem: "Match the 'mode of being in the world' described by Rollo May (from existential philosophy) in List I with its meaning in List II.",
    lists: {
      left: ["A. Umwelt", "B. Mitwelt", "C. Eigenwelt"],
      right: [
        "i. The world of relationships with other people",
        "ii. The person's relationship with themselves, their self-awareness",
        "iii. The biological and physical environment, including bodily needs",
      ],
    },
    options: [
      "A-iii, B-i, C-ii",
      "A-i, B-iii, C-ii",
      "A-iii, B-ii, C-i",
      "A-ii, B-i, C-iii",
    ],
    answer: 0,
    explanation:
      "May, drawing on Binswanger and Heidegger, said a full human life involves all three modes at once: Umwelt, the 'world around', meaning the physical and biological world (iii); Mitwelt, the 'with-world' of other people (i); and Eigenwelt, the 'own-world' of self-awareness (ii). He argued that modern Western psychology focuses too much on Umwelt and neglects Eigenwelt. The other codes swap these.",
    ref: "May 1958",
  }),
  p({
    id: "per-ex-0179",
    topic: "existential",
    exams: [N, M, S],
    difficulty: 3,
    type: "assertion-reason",
    stem: "Read the Assertion (A) and Reason (R) and choose the correct option.",
    statements: [
      "A: Rollo May distinguished normal anxiety from neurotic anxiety.",
      "R: For May, normal anxiety is proportionate to the real threat and can be faced constructively, while neurotic anxiety is out of proportion and involves repression and avoidance.",
    ],
    options: AR,
    answer: 0,
    explanation:
      "Both are true and R explains A. May saw anxiety as part of being human, especially when facing freedom, choice and death; it can motivate growth when faced. Neurotic anxiety arises when people avoid these challenges, which narrows their lives. The distinction explains why existential therapists do not aim to remove all anxiety.",
    ref: "May 1950, 1977",
  }),
  p({
    id: "per-ex-0180",
    topic: "existential",
    exams: [N, M, S],
    difficulty: 3,
    type: "statement",
    stem: "Irvin Yalom describes four 'ultimate concerns' or givens of existence. Which of the following are among them?",
    statements: ["A. Death", "B. Freedom", "C. Existential isolation", "D. Meaninglessness", "E. Inferiority"],
    options: [
      "A, B and E only",
      "A, B, C and D only",
      "C, D and E only",
      "A, B, C, D and E",
    ],
    answer: 1,
    explanation:
      "Yalom's existential psychotherapy is built around death, freedom (with its responsibility), isolation (the unbridgeable gap between oneself and others) and meaninglessness. Anxiety about these concerns, and defences against them, are seen as the source of much distress. Inferiority (E) is Adler's concept and is not one of the four givens.",
    ref: "Yalom 1980",
  }),
  p({
    id: "per-ex-0181",
    topic: "existential",
    exams: [N, M],
    difficulty: 4,
    type: "passage",
    stem: "Which approach best fits the therapist's response?",
    passage:
      "A 34-year-old woman with a panic disorder is terrified of fainting in shops. Her therapist asks her, next time she is in a shop, to try as hard as she can to faint, and even to say to herself, 'Let me show everyone how spectacularly I can faint today!' The therapist explains that her fear of fainting is fuelling the very anxiety she dreads.",
    options: [
      "Maslow's peak experience",
      "Rogers' unconditional positive regard",
      "Frankl's paradoxical intention",
      "Kelly's fixed-role therapy",
    ],
    answer: 2,
    explanation:
      "Paradoxical intention reverses anticipatory anxiety: instead of fighting the symptom, the client tries to produce it, often with humour, which reduces the fear and so the symptom itself. It resembles exposure and symptom-prescription methods in later therapies. Unconditional positive regard is acceptance of the client. A peak experience is a moment of joy, not a technique. Fixed-role therapy asks clients to act as a different character.",
    ref: "Frankl 1960, 1967",
  }),
  p({
    id: "per-ex-0182",
    topic: "existential",
    exams: [C, N, S],
    difficulty: 2,
    type: "mcq",
    stem: "Existential approaches to personality share the belief that:",
    options: [
      "The unconscious is the only important part of the mind",
      "Behaviour is fully determined by reinforcement",
      "Personality is fixed by genes",
      "People are free to choose and are responsible for creating meaning in their lives, even in the face of death and uncertainty",
    ],
    answer: 3,
    explanation:
      "Influenced by philosophers such as Kierkegaard, Heidegger and Sartre, existential psychologists stress freedom, choice, responsibility and authenticity, and see anxiety about death and meaninglessness as part of being human. Determination by reinforcement, genes or the unconscious contradicts their emphasis on freedom.",
    ref: "May 1958; Yalom 1980",
  }),
  // ── Self-determination theory and comparisons ─────────────────────────────
  p({
    id: "per-hum-0183",
    exams: [N, M, S],
    difficulty: 2,
    type: "mcq",
    stem: "Deci and Ryan's self-determination theory proposes three basic psychological needs. These are:",
    options: [
      "Autonomy, competence and relatedness",
      "Hunger, thirst and sex",
      "Achievement, affiliation and power",
      "Safety, esteem and self-actualisation",
    ],
    answer: 0,
    explanation:
      "Self-determination theory holds that wellbeing and intrinsic motivation flourish when people feel they choose their actions (autonomy), feel effective (competence) and feel connected to others (relatedness). It builds on humanistic ideas but is tested with experiments, for example on how rewards and controlling feedback reduce intrinsic motivation. Hunger, thirst and sex are biological drives. Achievement, affiliation and power are McClelland's motives. Safety, esteem and self-actualisation come from Maslow's hierarchy.",
    ref: "Deci & Ryan 1985, 2000",
  }),
  p({
    id: "per-hum-0184",
    exams: [N, M],
    difficulty: 3,
    type: "assertion-reason",
    stem: "Read the Assertion (A) and Reason (R) and choose the correct option.",
    statements: [
      "A: Self-determination theory has been described as a humanistic theory that is tested with mainstream experimental and correlational methods.",
      "R: Unlike Maslow, Deci and Ryan propose that the three basic needs must be satisfied strictly one after another in a fixed order.",
    ],
    options: AR,
    answer: 2,
    explanation:
      "A is true: SDT shares humanistic assumptions about growth and autonomy but has a large body of experiments, field studies and cross-cultural research behind it. R is false: SDT treats autonomy, competence and relatedness as needs that operate together and must all be supported at the same time, not as a hierarchy. In this way it differs from Maslow's hierarchy.",
    ref: "Ryan & Deci 2017",
  }),
  p({
    id: "per-hum-0185",
    exams: [N, M, S],
    difficulty: 3,
    type: "match",
    stem: "Match the theorist in List I with the key concept in List II.",
    lists: {
      left: ["A. Carl Rogers", "B. Abraham Maslow", "C. Viktor Frankl", "D. Rollo May"],
      right: [
        "i. The will to meaning",
        "ii. Conditions of worth",
        "iii. The daimonic: a natural force that can be creative or destructive",
        "iv. Hierarchy of needs and metaneeds",
      ],
    },
    options: [
      "A-iv, B-ii, C-i, D-iii",
      "A-ii, B-iv, C-i, D-iii",
      "A-ii, B-i, C-iv, D-iii",
      "A-ii, B-iv, C-iii, D-i",
    ],
    answer: 1,
    explanation:
      "Rogers described conditions of worth (ii). Maslow described the hierarchy of needs and metaneeds (iv). Frankl described the will to meaning (i). May described the daimonic, any natural function such as sex, anger or the craving for power that can take over the whole person if not integrated, but can also fuel creativity (iii). The other codes swap these.",
    ref: "Feist & Feist, chs. 10, 11, 15",
  }),
  p({
    id: "per-hum-0186",
    exams: [N, M],
    difficulty: 4,
    type: "statement",
    stem: "Which statements are fair criticisms of humanistic personality theories?",
    statements: [
      "A. Key concepts such as self-actualisation are difficult to define and measure precisely.",
      "B. Maslow's sample of self-actualisers reflected his own values.",
      "C. The theories may reflect individualistic Western values, which fit less well with cultures that emphasise duty and interdependence.",
      "D. Humanistic theories have had no influence on therapy, education or organisations.",
    ],
    options: [
      "B and D only",
      "A and D only",
      "A, B and C only",
      "A, B, C and D",
    ],
    answer: 2,
    explanation:
      "A, B and C are common criticisms: vague concepts, selection bias in Maslow's sample, and a possible Western individualist bias (Indian scholars have noted that self-realisation in Indian traditions is often framed in terms of duty and transcending the ego). D is false: humanistic ideas shaped counselling, student-centred education, management theory such as McGregor's Theory Y, and positive psychology.",
    ref: "Feist & Feist, chs. 10 and 11; Paranjpe 1998",
  }),
  p({
    id: "per-hum-0187",
    exams: [C, N, S],
    difficulty: 1,
    type: "mcq",
    stem: "Unconditional positive regard means:",
    options: [
      "Ignoring a person's feelings",
      "Agreeing with everything a person says",
      "Praising a person only when they succeed",
      "Accepting and valuing a person without requiring them to meet certain conditions",
    ],
    answer: 3,
    explanation:
      "Rogers used the term for warm acceptance of the person as they are, including feelings and experiences the therapist may not share or approve of. It does not mean agreeing with or approving every action. Praise only for success is conditional regard. Ignoring feelings is the opposite of the warm attention Rogers described.",
    ref: "Rogers 1957",
  }),
  p({
    id: "per-hum-0188",
    exams: [N, M, S],
    difficulty: 3,
    type: "mcq",
    stem: "Rogers proposed that a person's 'need for positive regard' is:",
    options: [
      "Universal and so strong that people may give up their own organismic valuing in order to receive approval from others",
      "Found only in people with mental disorders",
      "Easily satisfied and of little importance",
      "The same as the death instinct",
    ],
    answer: 0,
    explanation:
      "Rogers saw the need for warmth, respect and acceptance from others as present in everyone. Because it is so powerful, children may take on others' conditions of worth and stop trusting their own experience, which leads to incongruence. Later, people develop a need for positive self-regard. The need is not limited to disorders, is not unimportant, and has nothing to do with the death instinct.",
    ref: "Rogers 1959",
  }),
  p({
    id: "per-ex-0189",
    topic: "existential",
    exams: [N, M],
    difficulty: 3,
    type: "assertion-reason",
    stem: "Read the Assertion (A) and Reason (R) and choose the correct option.",
    statements: [
      "A: Frankl believed that meaning can be found even in unavoidable suffering.",
      "R: Frankl was born in Vienna in 1905.",
    ],
    options: AR,
    answer: 1,
    explanation:
      "Both statements are true, but R does not explain A. Frankl's belief that people can find meaning by choosing their attitude towards suffering grew out of his clinical work and his experience in Nazi concentration camps, where he observed that prisoners who held on to a sense of purpose seemed better able to endure. R is a true biographical fact, but his birthplace and date do not explain the idea.",
    ref: "Frankl 1946",
  }),
  p({
    id: "per-hum-0190",
    topic: "maslow",
    exams: [N, M, S],
    difficulty: 2,
    type: "mcq",
    stem: "Late in his life Maslow added a level above self-actualisation. This level is:",
    options: [
      "Self-esteem",
      "Self-transcendence",
      "Safety",
      "Belongingness",
    ],
    answer: 1,
    explanation:
      "Maslow came to think that the highest motivation is to go beyond the self, through service, spirituality, or devotion to a cause larger than oneself. This links his theory to transpersonal psychology and to Indian ideas of transcending the ego. Self-esteem, safety and belonging are lower levels of the original hierarchy.",
    ref: "Maslow 1969, 1971; Koltko-Rivera 2006",
  }),
  p({
    id: "per-hum-0191",
    exams: [N, M],
    difficulty: 4,
    type: "passage",
    stem: "Which theoretical explanation best fits Neha's difficulties?",
    passage:
      "Neha, 25, was praised throughout childhood only when she came first in class. She now works in a bank, a job her parents chose. She describes herself as 'a calm, logical person who doesn't need anyone', yet she cries unexpectedly when watching films about families and feels a vague sense of emptiness. She dismisses these episodes as 'tiredness'.",
    options: [
      "Skinner: her crying is reinforced by her parents",
      "Eysenck: high extraversion and low neuroticism",
      "Rogers: conditional positive regard produced conditions of worth, and experiences that do not fit her self-concept are distorted, creating incongruence",
      "Freud: fixation at the anal stage",
    ],
    answer: 2,
    explanation:
      "Neha's love was conditional on achievement, so she adopted a self-concept that excludes needs for closeness. Feelings that contradict it (sadness, longing) break through but are explained away as tiredness, which is distortion. The gap between self and experience, and the vague emptiness, fit Rogers' incongruence. Her pattern is not high extraversion with low neuroticism. Nothing suggests her parents reinforce her crying. Anal fixation does not explain the conflict between self-concept and feeling.",
    ref: "Rogers 1959",
  }),
  p({
    id: "per-hum-0192",
    topic: "maslow",
    exams: [C, N, S],
    difficulty: 2,
    type: "assertion-reason",
    stem: "Read the Assertion (A) and Reason (R) and choose the correct option.",
    statements: [
      "A: Maslow studied psychologically healthy, highly functioning people rather than only patients.",
      "R: Maslow believed that a psychology built only on studying sick people would give a crippled picture of human nature.",
    ],
    options: AR,
    answer: 0,
    explanation:
      "Both are true and R explains A. Maslow argued that studying 'crippled, stunted, immature and unhealthy specimens' can yield only a 'cripple psychology', so he deliberately studied people who seemed to be living fully. This focus on health and potential was a forerunner of positive psychology.",
    ref: "Maslow 1970",
  }),
  p({
    id: "per-hum-0193",
    exams: [N, M, S],
    difficulty: 3,
    type: "mcq",
    stem: "Which statement best contrasts Rogers' and Freud's views of human nature?",
    options: [
      "Both rejected the importance of subjective experience",
      "Both saw human nature as basically evil",
      "Rogers saw behaviour as fully determined, while Freud stressed free will",
      "Rogers saw human nature as basically positive and growth-oriented, while Freud saw it as driven by powerful, often antisocial instincts that must be controlled",
    ],
    answer: 3,
    explanation:
      "Rogers trusted the 'organism' and believed that, given the right conditions, people move towards growth and constructive relationships. Freud saw sexual and aggressive drives in conflict with society and the superego. Freud was the more deterministic of the two, so option 3 is reversed. Rogers placed subjective experience at the centre, and Freud also dealt with inner experience, though through unconscious processes.",
    ref: "Feist & Feist, chs. 2 and 11",
  }),
  p({
    id: "per-ex-0194",
    topic: "existential",
    exams: [N, M],
    difficulty: 3,
    type: "mcq",
    stem: "Rollo May described four kinds of love in Western tradition. Which set is correct?",
    options: [
      "Sex, eros, philia and agape",
      "Passion, intimacy, commitment and consummate",
      "Eros, ludus, storge and mania",
      "Secure, avoidant, anxious and disorganised",
    ],
    answer: 0,
    explanation:
      "May distinguished sex (physical release), eros (the creative longing for union and growth), philia (friendship) and agape (selfless care for another), and argued that modern society separates sex from eros. Passion, intimacy and commitment come from Sternberg. Eros, ludus, storge and mania are some of Lee's love styles. The last option lists attachment styles.",
    ref: "May 1969",
  }),
  p({
    id: "per-hum-0195",
    exams: [N, M, S],
    difficulty: 3,
    type: "statement",
    stem: "Which statements about Rogers' research contributions are correct?",
    statements: [
      "A. He was among the first to audio-record therapy sessions for research.",
      "B. He used Q-sorts to measure changes in self-ideal congruence.",
      "C. His work helped make psychotherapy a subject of empirical research.",
      "D. He refused to allow any research on his therapy.",
    ],
    options: [
      "A and D only",
      "A, B and C only",
      "B and D only",
      "A, B, C and D",
    ],
    answer: 1,
    explanation:
      "Rogers recorded sessions in the 1940s, studied changes in clients' self-concepts with Q-sorts and other measures, and his group at the University of Chicago ran controlled outcome studies. He received an APA award for distinguished scientific contributions. D is false: he actively encouraged research, which makes him unusual among founders of therapy schools.",
    ref: "Rogers & Dymond 1954; Kirschenbaum 2007",
  }),
  p({
    id: "per-ex-0196",
    topic: "existential",
    exams: [C, N, S],
    difficulty: 1,
    type: "mcq",
    stem: "Which psychologist is linked to the idea of logotherapy and meaning-centred treatment?",
    options: [
      "Hans Eysenck",
      "Albert Bandura",
      "Viktor Frankl",
      "Melanie Klein",
    ],
    answer: 2,
    explanation:
      "Frankl developed logotherapy, from the Greek 'logos', meaning. Bandura developed social cognitive theory, Eysenck the PEN model of personality, and Klein object relations theory.",
    ref: "Frankl 1969",
  }),
  p({
    id: "per-hum-0197",
    exams: [N, M],
    difficulty: 4,
    type: "mcq",
    stem: "A counselling student argues that Rogers' core conditions are 'necessary and sufficient' for change in all clients. Which response best reflects the current evidence?",
    options: [
      "Only medication can produce change",
      "The core conditions have no effect on outcome",
      "The core conditions are harmful",
      "Relationship factors such as empathy and positive regard are robust predictors of outcome, but for some problems, such as specific phobias or OCD, specific techniques like exposure add substantial benefit, so the conditions are usually helpful rather than sufficient alone",
    ],
    answer: 3,
    explanation:
      "Meta-analyses support empathy, positive regard and congruence as moderate predictors of outcome. At the same time, trials show that exposure-based treatments outperform supportive counselling for disorders such as OCD and specific phobia, which suggests that technique matters too. Saying the conditions have no effect or are harmful contradicts the evidence, and psychological therapies clearly produce change without medication.",
    ref: "Elliott et al. 2018; Wampold & Imel 2015",
  }),
];
