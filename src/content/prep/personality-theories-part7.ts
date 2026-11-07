import type { PrepExam, PrepQuestion } from "@/lib/prep/types";

/** Personality · part 7: easy foundation items (id, persona, traits, self-actualisation, locus of control, Rorschach) that open each topic. */

const C: PrepExam = "cuet-pg";
const N: PrepExam = "ugc-net";
const S: PrepExam = "ma-semester";

const p = (q: Omit<PrepQuestion, "subject">): PrepQuestion => ({ subject: "personality-theories", ...q });

export const QUESTIONS: PrepQuestion[] = [
  p({
    id: "per-freud-0263",
    topic: "psychoanalytic",
    module: "defences",
    exams: [C, N, S],
    difficulty: 1,
    type: "mcq",
    stem: "In Freud's structural model, the part of personality that is present from birth, works on the pleasure principle and seeks immediate gratification is the:",
    options: ["Id", "Ego", "Superego", "Ego ideal"],
    answer: 0,
    explanation:
      "The id is the original, fully unconscious part of the personality. It holds the instinctual drives and demands that tension be released at once, whatever the consequences, which Freud called the pleasure principle. The ego develops out of the id and works on the reality principle, finding realistic ways to meet the id's demands. The superego develops later, through identification with parents, and holds moral rules and ideals. The ego ideal is the part of the superego that represents the standards a person aims for, so it is not a source of raw drives.",
    ref: "Freud 1923",
  }),
  p({
    id: "per-jung-0264",
    topic: "jung",
    exams: [C, S],
    difficulty: 1,
    type: "mcq",
    stem: "In Jung's theory, the 'persona' is:",
    options: [
      "The dark, rejected side of the personality",
      "The public face or social mask a person shows to the world",
      "The feminine side of a man's psyche",
      "The archetype of wholeness and the centre of the psyche",
    ],
    answer: 1,
    explanation:
      "Jung took the word persona from the masks worn by actors in ancient theatre. It is the role we present to meet social expectations, such as the professional manner of a doctor. Problems arise when a person identifies so completely with the persona that the rest of the self is neglected. The dark, rejected side of the personality is the shadow. The feminine side of a man's psyche is the anima (the masculine side of a woman's psyche is the animus). The archetype of wholeness is the Self, which individuation moves towards.",
    ref: "Jung 1953",
  }),
  p({
    id: "per-trait-0265",
    topic: "trait-theories",
    exams: [C, S],
    difficulty: 1,
    type: "mcq",
    stem: "In personality psychology, a 'trait' is best described as:",
    options: [
      "A passing emotional state, such as feeling angry this morning",
      "An unconscious conflict from early childhood",
      "A relatively stable tendency to think, feel and behave in a consistent way across situations and over time",
      "A role a person plays only at work",
    ],
    answer: 2,
    explanation:
      "Traits are enduring dispositions, such as sociability or anxiousness, that differ between people and show up across many situations and over long periods. Trait theorists such as Allport, Cattell, Eysenck and the Big Five researchers describe and measure these dimensions. A passing feeling is a state, not a trait; trait anxiety and state anxiety are measured separately for this reason. Unconscious childhood conflicts are the subject matter of psychoanalytic theory. A role played only at work is tied to one setting, so it lacks the cross-situational consistency that defines a trait.",
    ref: "Allport 1961; Larsen & Buss, ch. 3",
  }),
  p({
    id: "per-hum-0266",
    topic: "maslow",
    module: "therapies",
    exams: [C, N, S],
    difficulty: 1,
    type: "mcq",
    stem: "In Maslow's theory, 'self-actualisation' means:",
    options: [
      "Realising one's full potential and becoming everything one is capable of becoming",
      "Satisfying hunger, thirst and other bodily needs",
      "Gaining the approval and respect of other people",
      "Feeling safe and protected from danger",
    ],
    answer: 0,
    explanation:
      "Self-actualisation is the highest level in Maslow's original hierarchy. It means developing one's talents and capacities to the full: 'what a man can be, he must be'. Maslow thought it becomes the main motive only after the lower needs are reasonably satisfied. Satisfying hunger and thirst describes physiological needs, the base of the hierarchy. Gaining approval and respect describes esteem needs. Feeling safe describes safety needs. These three are deficiency needs, while self-actualisation is a growth need.",
    ref: "Maslow 1954",
  }),
  p({
    id: "per-soccog-0267",
    topic: "rotter",
    exams: [C, N, S],
    difficulty: 1,
    type: "mcq",
    stem: "According to Julian Rotter, a person with an external locus of control tends to believe that:",
    options: [
      "What happens to them depends mainly on luck, fate or powerful other people",
      "What happens to them depends mainly on their own effort and ability",
      "Other people are generally trustworthy",
      "Rewards have no effect on their behaviour",
    ],
    answer: 0,
    explanation:
      "Locus of control is a generalised expectancy about where control of reinforcement lies. People with an external locus see outcomes as determined by chance, fate or the power of others, while people with an internal locus see outcomes as following from their own actions, effort and skill. So the second option describes an internal locus. Trust in other people is a separate expectancy that Rotter also measured, with his interpersonal trust scale, but it is not locus of control. Rotter's social learning theory assumes rewards matter a great deal; locus of control concerns beliefs about how rewards are obtained.",
    ref: "Rotter 1966",
  }),
  p({
    id: "per-assess-0268",
    topic: "personality-assessment",
    module: "assessment",
    exams: [C, S],
    difficulty: 1,
    type: "mcq",
    stem: "In the Rorschach test, people are asked to:",
    options: [
      "Answer true or false to several hundred statements about themselves",
      "Tell stories about pictures of people in ambiguous situations",
      "Say what they see in a series of symmetrical inkblots",
      "Complete unfinished sentences such as 'My father...'",
    ],
    answer: 2,
    explanation:
      "Hermann Rorschach's test uses ten inkblot cards, some black and some coloured. The person says what each blot looks like, and the examiner scores where the response comes from, which features of the blot were used (form, colour, shading, movement) and what was seen. It is a classic projective technique, because the stimulus is ambiguous and responses are thought to reveal personality. True-or-false statements describe self-report inventories such as the MMPI. Telling stories about pictures is the Thematic Apperception Test. Completing sentences is a sentence-completion test, such as Rotter's Incomplete Sentences Blank.",
    ref: "Rorschach 1921; Exner 2003",
  }),
];
