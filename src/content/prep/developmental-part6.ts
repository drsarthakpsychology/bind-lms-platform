import type { PrepExam, PrepQuestion } from "@/lib/prep/types";

/** Developmental · part 6: easy foundation items (assimilation, conservation, trust, imprinting, telegraphic speech, puberty) that open each topic. */

const C: PrepExam = "cuet-pg";
const N: PrepExam = "ugc-net";
const S: PrepExam = "ma-semester";

const d = (q: Omit<PrepQuestion, "subject">): PrepQuestion => ({ subject: "developmental", module: "child", ...q });

export const QUESTIONS: PrepQuestion[] = [
  d({
    id: "dev-piaget-0257",
    topic: "piaget",
    exams: [C, N, S],
    difficulty: 1,
    type: "mcq",
    stem: "A toddler who knows the word 'dog' calls a cow a 'dog'. In Piaget's terms, she is fitting a new experience into an existing schema. This process is called:",
    options: ["Assimilation", "Accommodation", "Equilibration", "Object permanence"],
    answer: 0,
    explanation:
      "Assimilation means interpreting something new with a schema the child already has, so the four-legged animal is treated as one more 'dog'. Accommodation is the complementary process: changing the schema, or forming a new one, when the old one does not fit, as when she learns that cows are a different kind of animal. Equilibration is the overall drive to balance assimilation and accommodation and to resolve the conflict between them. Object permanence is the understanding that objects go on existing when out of sight, which has nothing to do with this naming error.",
    ref: "Piaget 1952; Berk, ch. 6",
  }),
  d({
    id: "dev-piaget-0258",
    topic: "piaget",
    exams: [C, S],
    difficulty: 1,
    type: "mcq",
    stem: "A child who understands that the amount of juice stays the same when it is poured from a short, wide glass into a tall, thin one has acquired:",
    options: ["Animism", "Object permanence", "Conservation", "Symbolic play"],
    answer: 2,
    explanation:
      "Conservation is the understanding that a quantity stays the same despite changes in its appearance, as long as nothing is added or taken away. Piaget found that children usually master conservation of liquid in the concrete operational stage, from about 7 years, once they can reverse operations mentally and attend to height and width together. Animism is the preoperational belief that objects such as the sun have feelings or intentions. Object permanence develops in infancy and concerns whether objects exist when hidden, not whether amounts change. Symbolic play is pretending, such as using a banana as a phone.",
    ref: "Piaget & Inhelder 1969",
  }),
  d({
    id: "dev-erik-0259",
    topic: "erikson",
    exams: [C, N, S],
    difficulty: 1,
    type: "mcq",
    stem: "In Erikson's theory, the first psychosocial crisis, in infancy, is:",
    options: [
      "Trust versus mistrust",
      "Autonomy versus shame and doubt",
      "Identity versus role confusion",
      "Industry versus inferiority",
    ],
    answer: 0,
    explanation:
      "In the first year, infants depend completely on caregivers. If care is warm and reliable, they come to feel that the world is safe and that people can be trusted, and the virtue of hope develops. Autonomy versus shame and doubt is the second crisis, in the toddler years, when children start to do things for themselves. Industry versus inferiority belongs to the school years, roughly 6 to 12. Identity versus role confusion is the crisis of adolescence.",
    ref: "Erikson 1950",
  }),
  d({
    id: "dev-att-0260",
    topic: "attachment",
    exams: [C, S],
    difficulty: 1,
    type: "mcq",
    stem: "Konrad Lorenz found that newly hatched goslings followed the first moving object they saw, even if it was Lorenz himself. This is called:",
    options: ["Imprinting", "Classical conditioning", "Habituation", "Separation anxiety"],
    answer: 0,
    explanation:
      "Imprinting is a rapid form of attachment learning in some birds that occurs during a short sensitive period soon after hatching. Lorenz's goslings attached to him because he was the first moving object they met, and the bond was hard to reverse. Bowlby later drew on this work when he argued that human attachment has an evolutionary basis. Classical conditioning involves pairing a neutral stimulus with one that already produces a response, which does not describe this one-off following. Habituation is a decline in response to a repeated stimulus, the opposite of forming a bond. Separation anxiety is the distress shown when an attachment figure leaves, a later consequence of attachment, not the process Lorenz described.",
    ref: "Lorenz 1935",
  }),
  d({
    id: "dev-lang-0261",
    topic: "language-development",
    exams: [C, S],
    difficulty: 1,
    type: "mcq",
    stem: "Two-word utterances such as 'want milk' or 'daddy go', which leave out small function words, are called:",
    options: ["Babbling", "Overregularisation", "Holophrases", "Telegraphic speech"],
    answer: 3,
    explanation:
      "Telegraphic speech appears around 18 to 24 months. Like an old telegram, it keeps the key content words (nouns, verbs) and drops articles, prepositions and word endings, yet it usually follows the word order of the child's language. Babbling is the repetition of syllables such as 'bababa' that starts at about 6 months, before real words. Overregularisation is applying a grammatical rule too widely, as in 'goed' or 'mouses'. Holophrases are single words used to express a whole idea, such as 'up!' meaning 'pick me up', which come before two-word speech.",
    ref: "Brown 1973; Berk, ch. 9",
  }),
  d({
    id: "dev-life-0262",
    topic: "adolescence-adulthood-ageing",
    exams: [C, S],
    difficulty: 1,
    type: "mcq",
    stem: "Puberty is best defined as:",
    options: [
      "The whole period between childhood and adulthood, including its social and emotional changes",
      "The biological changes, driven by hormones, that bring physical and sexual maturity and the ability to reproduce",
      "The end of brain development, usually reached at around age 13",
      "A crisis of identity that every adolescent must pass through",
    ],
    answer: 1,
    explanation:
      "Puberty refers to the biological process: rising sex hormones trigger the growth spurt, development of primary and secondary sex characteristics, menarche in girls and spermarche in boys. Adolescence is the broader period of transition, including social, emotional and cognitive change, so the first option describes adolescence rather than puberty. Brain development does not end at 13; the prefrontal cortex keeps maturing into the mid-twenties. An identity crisis is Erikson's psychosocial idea about adolescence, not a definition of puberty, and not every adolescent experiences a dramatic crisis.",
    ref: "Steinberg, Adolescence, ch. 1",
  }),
];
