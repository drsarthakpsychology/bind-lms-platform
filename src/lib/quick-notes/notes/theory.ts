import type { Source, Theory } from "../types";

/** Theories (notes 38 to 40). */
const SRC: Source = { basis: ["Kaplan", "Textbook"], checkedBy: "Quick Notes builder, against named sources", checkedOn: "2026-11-22", clinician: "pending" };

export const THEORIES: Theory[] = [
  {
    id: "theory-defences",
    type: "theory",
    title: "Defence mechanisms by level",
    aka: ["Defense mechanisms", "Ego defences", "Vaillant", "Denial", "Projection", "Splitting", "Sublimation", "Repression"],
    topic: "theory",
    oneLine: "Automatic, mostly unconscious ways the mind guards against distress, ranked from the most primitive to the most mature.",
    who: "Sigmund Freud and Anna Freud; ranked into levels by George Vaillant",
    coreIdea: "Everyone uses defences. What matters is which level a person leans on, and how rigidly.",
    tables: [
      {
        title: "The four levels",
        table: {
          head: ["Level", "Defences", "Example"],
          rows: [
            ["Most primitive (psychotic)", "Denial of outside reality, distortion, delusional projection", "'There is no lump', while the lump is visible"],
            ["Immature", "Projection, splitting, acting out, passive aggression, fantasy", "'Everyone hates me' when the person is angry"],
            ["Neurotic", "Repression, displacement, reaction formation, intellectualisation, rationalisation", "Shouting at a sibling after a scolding at work"],
            ["Mature", "Sublimation, humour, suppression, altruism, anticipation", "Turning anger into sport"],
          ],
        },
      },
    ],
    keyTerms: [
      { term: "Repression", means: "Unwanted thought kept out of awareness, without knowing" },
      { term: "Suppression", means: "Choosing to put a thought aside for now: conscious, mature" },
      { term: "Reaction formation", means: "Acting the opposite of the real feeling" },
      { term: "Splitting", means: "Seeing people as all good or all bad" },
      { term: "Projection", means: "Seeing one's own feeling in someone else" },
      { term: "Sublimation", means: "Channelling an urge into something useful" },
    ],
    inTheClinic: ["Name a defence gently and at the right time; do not attack it", "Splitting often shows as idealising, then putting down, the therapist", "Denial of illness is common early after a diagnosis: give time"],
    limits: ["Textbooks differ: some call the lowest level 'narcissistic' and place projection and splitting there", "Defences are inferred, not measured directly"],
    links: { moduleId: "defences", summaryId: "defences", related: ["theory-development", "criteria-bpd"] },
    source: SRC,
    keywords: ["unconscious", "ego", "Anna Freud", "levels", "mature", "immature", "neurotic"],
  },
  {
    id: "theory-development",
    type: "theory",
    title: "Development in tables: Freud, Erikson, Piaget, Kohlberg",
    aka: ["Psychosexual stages", "Psychosocial stages", "Erikson's stages", "Piaget's stages", "Cognitive development", "Moral development", "Kohlberg"],
    topic: "theory",
    oneLine: "Freud stages pleasure, Erikson stages social crises, Piaget stages thinking, Kohlberg stages moral reasoning.",
    who: "Sigmund Freud, Erik Erikson, Jean Piaget, Lawrence Kohlberg",
    coreIdea: "Each theory splits growth into stages in a fixed order; ages are approximate.",
    tables: [
      {
        title: "Erikson: a crisis at each stage",
        table: {
          head: ["Age", "Crisis", "Strength gained"],
          rows: [
            ["0 to 1", "Trust or mistrust", "Hope"],
            ["1 to 3", "Autonomy or shame and doubt", "Will"],
            ["3 to 6", "Initiative or guilt", "Purpose"],
            ["6 to 12", "Industry or inferiority", "Competence"],
            ["12 to 18", "Identity or role confusion", "Fidelity"],
            ["Young adult", "Intimacy or isolation", "Love"],
            ["Middle adult", "Generativity or stagnation", "Care"],
            ["Older adult", "Integrity or despair", "Wisdom"],
          ],
        },
      },
      {
        title: "Piaget and Freud by age",
        table: {
          head: ["Age", "Piaget (thinking)", "Freud (psychosexual)"],
          rows: [
            ["0 to 2", "Sensorimotor: object permanence", "Oral (to about 1.5), then anal"],
            ["2 to 7", "Preoperational: symbols, egocentric, no conservation", "Anal (to 3), phallic (3 to 6), Oedipal phase"],
            ["7 to 11", "Concrete operational: conservation, logic about real things", "Latency"],
            ["11 on", "Formal operational: abstract and hypothetical thinking", "Genital (from puberty)"],
          ],
        },
      },
      {
        title: "Kohlberg: moral reasoning",
        table: {
          head: ["Level", "Stages", "Right is"],
          rows: [
            ["Preconventional", "1 Avoiding punishment; 2 Self-interest", "What avoids punishment or gets a reward"],
            ["Conventional", "3 Good boy or good girl; 4 Law and order", "What others approve; following rules"],
            ["Postconventional", "5 Social contract; 6 Universal principles", "Rights and own ethical principles"],
          ],
        },
      },
    ],
    keyTerms: [
      { term: "Object permanence", means: "Knowing a thing exists when hidden: from about 8 to 12 months" },
      { term: "Conservation", means: "Amount stays the same when the shape changes" },
      { term: "Fixation", means: "Freud: stuck at a stage, shaping adult traits" },
      { term: "Identity crisis", means: "Erikson's term for the teenage search for self" },
    ],
    inTheClinic: ["Ask what a child can do, not only the age", "Teenage identity questions are normal; distress and impairment are not"],
    limits: ["Piaget underrated young children's abilities", "Kohlberg was based mostly on boys; Gilligan added an ethics of care", "Freud's stages are hard to test"],
    links: { moduleId: "lifespan", summaryId: "child", related: ["theory-defences", "theory-learning"] },
    source: SRC,
    keywords: ["stages", "Erikson", "Piaget", "Freud", "Kohlberg", "child development", "adolescence"],
  },
  {
    id: "theory-learning",
    type: "theory",
    title: "Learning theories and attachment",
    aka: ["Classical conditioning", "Operant conditioning", "Schedules of reinforcement", "Social learning theory", "Bandura", "Pavlov", "Skinner", "Attachment styles", "Strange situation", "Bowlby", "Ainsworth"],
    topic: "theory",
    oneLine: "We learn by pairing (classical), by consequences (operant) and by watching (social learning); early bonds shape attachment.",
    who: "Ivan Pavlov, B. F. Skinner, Albert Bandura, John Bowlby, Mary Ainsworth",
    coreIdea: "Behaviour, including fear and habits, is learned and can be unlearned.",
    tables: [
      {
        title: "Classical and operant",
        table: {
          head: ["", "Classical (Pavlov)", "Operant (Skinner)"],
          rows: [
            ["Learns", "A link between two stimuli", "A link between an act and its result"],
            ["Example", "Bell, then food: the bell alone brings saliva", "Pressing a lever brings food: pressing increases"],
            ["Key words", "Unconditioned and conditioned stimulus and response", "Reinforcement, punishment, shaping"],
            ["Undoing", "Extinction: bell without food; may return later (spontaneous recovery)", "Extinction: no more reward"],
          ],
        },
      },
      {
        title: "Reinforcement and punishment",
        table: {
          head: ["", "Add something", "Take something away"],
          rows: [
            ["Behaviour goes up", "Positive reinforcement (praise)", "Negative reinforcement (headache stops after a tablet)"],
            ["Behaviour goes down", "Positive punishment (a scolding)", "Negative punishment (phone taken away)"],
          ],
        },
      },
      {
        title: "Schedules of reinforcement",
        table: {
          head: ["Schedule", "Reward comes", "Pattern"],
          rows: [
            ["Fixed ratio", "After a set number of acts", "Fast, with a pause after each reward"],
            ["Variable ratio", "After an unpredictable number", "Fastest, hardest to extinguish (gambling)"],
            ["Fixed interval", "After a set time", "Speeds up near the time (scallop)"],
            ["Variable interval", "After unpredictable times", "Slow and steady"],
          ],
        },
      },
      {
        title: "Attachment (Ainsworth's strange situation)",
        table: {
          head: ["Style", "When the carer leaves and returns"],
          rows: [
            ["Secure", "Upset when left, comforted on return"],
            ["Anxious-avoidant", "Little upset, ignores the carer on return"],
            ["Anxious-resistant (ambivalent)", "Very upset, clings and resists on return"],
            ["Disorganised (Main and Solomon)", "Confused, frozen or contradictory; linked to frightening care"],
          ],
        },
      },
    ],
    keyTerms: [
      { term: "Generalisation", means: "Responding to stimuli like the learned one" },
      { term: "Shaping", means: "Rewarding steps closer to the target behaviour" },
      { term: "Modelling", means: "Learning by watching (Bandura's Bobo doll study)" },
      { term: "Self-efficacy", means: "Belief one can do it; drives effort (Bandura)" },
    ],
    inTheClinic: ["Phobias can be learned by pairing; exposure is the unlearning", "Avoidance is negative reinforcement: relief keeps it going", "Token economies and behaviour charts use operant ideas"],
    limits: ["Ignores thinking and biology on its own; CBT adds thoughts", "Attachment styles describe infants; adult styles are measured differently"],
    links: { moduleId: "learning-memory", related: ["therapy-exposure", "theory-development"] },
    source: SRC,
    keywords: ["conditioning", "reinforcement", "punishment", "extinction", "Bobo doll", "secure", "avoidant", "attachment"],
  },
];
