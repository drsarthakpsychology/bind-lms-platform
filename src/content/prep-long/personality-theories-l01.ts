import type { LongQA } from "@/lib/prep/long-types";
import { anchored, chain, compare, layers, timeline, tree, vis } from "./visual";

const S = "personality-theories" as const;

export const PERSONALITY_THEORIES_L01: LongQA[] = anchored([
  {
    id: "pers-l01-001",
    subject: S,
    topic: "psychoanalytic",
    marks: 20,
    difficulty: 3,
    exams: ["cuet-pg", "ugc-net", "mcp-entrance", "ma-semester"],
    question: "Describe Freud's psychoanalytic theory of personality, including the topographic and structural models, the dynamics of anxiety and defence, and psychosexual development. Critically evaluate the theory.",
    plan: ["Freud and his method", "Topographic model", "Structural model", "Anxiety and defence", "Psychosexual stages", "Evaluation"],
    answer: `## Freud and his method
Sigmund Freud, a Viennese neurologist, developed psychoanalysis from the 1890s through work with patients, often women with what was then called hysteria. With Josef Breuer he described the case of Anna O, whose symptoms eased when she talked about painful memories. Freud replaced hypnosis with free association, dream analysis and the study of slips and transference. His theory of personality grew from these clinical observations.

## The topographic model
Freud described three levels of the mind:
1. Conscious: what we are aware of now.
2. Preconscious: material that can be recalled with effort, such as a phone number.
3. Unconscious: wishes, memories and feelings kept out of awareness because they are unacceptable, which still influence behaviour through dreams, slips of the tongue, symptoms and jokes.
He compared the mind to an iceberg, with most of it below the surface.

## The structural model
In 1923 Freud added three agencies:
- Id: present from birth, the source of instinctual drives, operating on the pleasure principle and primary process thinking, which is illogical and wish fulfilling.
- Ego: develops from the id to deal with reality, operating on the reality principle and secondary process thinking. It mediates between id, superego and the outside world.
- Superego: internalised parental and social standards, made up of the conscience, which punishes with guilt, and the ego ideal, which rewards with pride. It forms with the resolution of the Oedipus complex.
Drives come from two instincts: eros, the life instinct whose energy is libido, and thanatos, the death instinct, expressed as aggression.

## Anxiety and defence
Freud described three kinds of anxiety: realistic, from real dangers; neurotic, fear that id impulses will break through; and moral, fear of the superego's punishment. To reduce anxiety, the ego uses unconscious defence mechanisms, such as repression, denial, projection, reaction formation, displacement, regression, rationalisation and sublimation. Anna Freud later systematised them. Defences are normal, but rigid or extreme use leads to symptoms.

## Psychosexual development
Libido is focused on different body zones in a fixed sequence:
| Stage | Age | Focus | Result of fixation |
| Oral | Birth to about 1 year | Mouth: sucking, biting | Dependence, smoking, overeating, sarcasm |
| Anal | About 1 to 3 years | Toilet training | Anal retentive: orderly, stingy; anal expulsive: messy |
| Phallic | About 3 to 6 years | Genitals; Oedipus complex | Vanity, problems with authority and sexuality |
| Latency | About 6 to puberty | Sexual drives dormant; skills and friendships | None typical |
| Genital | Puberty onwards | Mature sexuality and love | Healthy adult functioning |
In the phallic stage, the boy desires his mother and fears castration by his father, resolving the conflict by identifying with the father and forming the superego. Freud's account of girls, involving penis envy and the Electra complex, a term from Jung, is the most criticised part.

## Evaluation
Strengths:
- Introduced the idea that much mental life is unconscious, now supported by research on implicit memory, priming and automatic processing.
- Highlighted the importance of early childhood and relationships, later developed in attachment research.
- Defence mechanisms are widely used clinically, and research by George Vaillant links mature defences with better adult adjustment.
- Gave rise to psychotherapy as a talking cure.
Weaknesses:
- Many concepts are hard to test or falsify; Karl Popper used psychoanalysis as an example of a theory that explains everything and so predicts nothing.
- Based on a small number of mostly middle class Viennese patients, interpreted by Freud himself.
- Overemphasis on sexuality; neglect of social and cultural factors, as the neo Freudians argued.
- Views of women reflect the prejudices of his time.
- Little evidence for specific predictions, such as oral and anal personality types or the universal Oedipus complex. The anthropologist Bronislaw Malinowski found a different family conflict in the Trobriand Islands.
- Girindrasekhar Bose, the founder of the Indian Psychoanalytical Society in 1922, corresponded with Freud and argued that Indian men showed a wish to be female rather than castration anxiety, showing cultural variation.

## Conclusion
Freud's theory was the first comprehensive account of personality and shaped psychology, psychiatry and culture. Its specific claims are often unsupported, but its broad ideas, unconscious processes, conflict, defence and the lasting effects of childhood, remain influential.`,
    keyPoints: ["Clinical origins and free association", "Conscious, preconscious, unconscious", "Id, ego, superego with their principles", "Eros, thanatos and libido", "Three anxieties and defence mechanisms", "Five psychosexual stages and fixation", "Oedipus complex and superego formation", "Balanced evaluation including falsifiability and cultural critique"],
    pitfalls: ["Confusing topographic and structural models", "No evaluation", "Wrong order of stages"],
    module: "defences/1-2",
    visuals: [
      layers("The topographic model", "iceberg", [["Conscious", "Present awareness, above water"], ["Preconscious", "Recallable with effort, at the waterline"], ["Unconscious", "Hidden wishes and memories, below water"]]),
      tree("The structural model", [["Personality", "Three agencies", -1], ["Id", "Pleasure principle, drives", 0], ["Ego", "Reality principle, mediator", 0], ["Superego", "Conscience and ego ideal", 0]]),
      timeline("Put the psychosexual stages in order", [["Oral", "Birth to 1"], ["Anal", "1 to 3"], ["Phallic", "3 to 6"], ["Latency", "6 to puberty"], ["Genital", "Puberty onwards"]], "Libido moves through body zones in a fixed sequence."),
    ],
    ref: "Freud 1900, 1905, 1923; Breuer and Freud 1895; A Freud 1936; Vaillant 1977; Popper 1963; Malinowski 1927; Bose correspondence with Freud 1921 onwards; defences module 1.2",
  },
  {
    id: "pers-l01-002",
    subject: S,
    topic: "psychoanalytic",
    marks: 10,
    difficulty: 2,
    exams: ["cuet-pg", "ugc-net", "ma-semester"],
    question: "What are defence mechanisms? Describe any eight with examples and explain Vaillant's hierarchy of defences.",
    plan: ["Definition and purpose", "Eight defences with examples", "Vaillant's levels", "Clinical relevance"],
    answer: `## Definition
Defence mechanisms are unconscious mental processes by which the ego protects itself from anxiety arising from conflict between the id, the superego and reality. Freud described several, and his daughter Anna Freud listed and organised them in 1936. Everyone uses defences; they become a problem when they are rigid, immature or distort reality severely.

## Eight defences
1. Repression: pushing threatening thoughts out of awareness. A woman cannot recall details of a painful childhood event.
2. Denial: refusing to accept reality. A man with a heart attack insists it was only gas and goes back to work.
3. Projection: attributing one's own unacceptable feelings to others. A husband who is attracted to a colleague accuses his wife of flirting.
4. Reaction formation: expressing the opposite of one's true feeling. A man who has homosexual impulses loudly condemns gay people.
5. Displacement: shifting feelings to a safer target. An employee scolded by his boss shouts at his children.
6. Regression: returning to an earlier stage of behaviour. A five year old begins bedwetting after a sibling is born.
7. Rationalisation: giving a logical excuse for behaviour caused by other motives. A student who fails says the test was unfair anyway.
8. Sublimation: channelling unacceptable impulses into socially valued activities. A person with aggressive urges becomes a successful boxer or surgeon.
Others include intellectualisation, isolation of affect, undoing, splitting and identification with the aggressor.

## Vaillant's hierarchy
George Vaillant, following Harvard graduates for decades, grouped defences by maturity:
| Level | Examples | Effect |
| Psychotic | Delusional projection, psychotic denial, distortion | Reality grossly distorted |
| Immature | Projection, acting out, passive aggression, hypochondriasis, fantasy | Common in personality disorders and adolescents |
| Neurotic | Repression, displacement, reaction formation, intellectualisation | Common in everyone under stress |
| Mature | Sublimation, humour, altruism, anticipation, suppression | Linked to better health and adjustment |
Men in his study who used mature defences had better marriages, careers, health and life satisfaction.

## Clinical relevance
- Identifying a client's typical defences helps formulation and therapy planning.
- Defences can be measured, for example with the Defense Style Questionnaire.
- Therapy aims to replace immature defences with more mature ones.

## Conclusion
Defences protect against anxiety, but their maturity shapes adjustment, as Vaillant's hierarchy shows.`,
    keyPoints: ["Unconscious protection against anxiety", "Anna Freud's systematisation", "Eight defences each with a clear example", "Vaillant's four levels", "Mature defences predict better outcomes", "Measurement and clinical use"],
    pitfalls: ["Confusing suppression, which is conscious, with repression", "Examples that do not fit the defence"],
    module: "defences/2-1",
    visuals: [layers("Vaillant's hierarchy", "pyramid", [["Mature", "Sublimation, humour, altruism, anticipation, suppression"], ["Neurotic", "Repression, displacement, reaction formation"], ["Immature", "Projection, acting out, passive aggression"], ["Psychotic", "Delusional projection, psychotic denial"]])],
    ref: "A Freud 1936 The Ego and the Mechanisms of Defence; Vaillant 1977, 1992; Bond DSQ; defences module 1.3 and 2.1",
  },
  {
    id: "pers-l01-003",
    subject: S,
    topic: "psychoanalytic",
    marks: 15,
    difficulty: 4,
    exams: ["ugc-net", "ma-semester", "mcp-entrance"],
    question: "Is psychoanalysis a science? Critically examine the scientific status of Freud's theory and the modern evidence for unconscious processes and psychodynamic ideas.",
    plan: ["The question", "Popper's critique", "Grunbaum and the problem of clinical evidence", "Modern evidence for psychodynamic ideas", "Evidence for psychodynamic therapy", "Balanced conclusion"],
    answer: `## The question
Freud saw psychoanalysis as a natural science of the mind. Critics have argued it is closer to a hermeneutic, interpretive discipline, or even a pseudoscience. The debate turns on whether its claims can be tested.

## Popper's critique
The philosopher Karl Popper argued that a scientific theory must be falsifiable: it must forbid some outcomes. He claimed that psychoanalysis could explain any behaviour after the fact. A man who saves a drowning child and one who pushes a child into water can both be explained, one by sublimation and the other by repression. Because no observation could refute it, Popper said it was not scientific.

## Grunbaum's critique
Adolf Grunbaum disagreed that the theory is untestable; he argued it is testable but poorly supported. His main points:
- Clinical data are contaminated by suggestion: patients may produce memories and associations that fit the analyst's expectations.
- Freud's claim that only correct interpretations produce cure, the tally argument, fails because other therapies also help.
- Evidence must come from outside the consulting room.

## Other problems
- Small, selected samples and case reports written by Freud.
- Some cases, such as the Wolf Man, did not recover as reported.
- Concepts like libido and the death instinct are not measurable.

## Modern evidence for psychodynamic ideas
Drew Westen argued in 1998 that several core ideas have support when stated in modern terms:
1. Much mental life is unconscious: research on implicit memory, priming, implicit attitudes and blindsight shows processing outside awareness.
2. Mental processes, including emotions and motives, can conflict, and people may hold contradictory feelings.
3. Childhood experiences shape adult personality and relationships, as attachment research shows.
4. Mental representations of self and others guide relationships, similar to object relations and transference, as in Susan Andersen's studies where new people resembling a significant other trigger old patterns.
5. Development involves learning to regulate sexual and aggressive feelings and moving from dependence to interdependence.
Experimental support has also come for some defences: people high in repressive coping report low anxiety yet show high physiological arousal, and research on motivated forgetting shows people can suppress unwanted memories, though the classical repression of trauma remains disputed.
Specific claims, such as the universal Oedipus complex, oral and anal character types and dream symbolism, have little support.

## Evidence for psychodynamic therapy
Meta analyses, such as Jonathan Shedler's review in 2010, found that psychodynamic therapy has effect sizes comparable to other therapies for depression and some anxiety and personality disorders, and that gains may continue after treatment ends. Brief psychodynamic therapies have been tested in randomised trials. This supports the practical value of psychodynamic methods, though not every part of Freud's theory.

## Psychoanalysis as interpretation
Some defenders, such as the philosopher Paul Ricoeur and later relational analysts, accept that psychoanalysis is not a laboratory science. They see it as a discipline of meaning, like history or literary study, judged by how well an interpretation makes sense of a life and helps the person. Critics reply that if it claims to cure, its claims about causes must still be tested. Most modern psychodynamic researchers take a middle path, testing specific hypotheses with experiments, longitudinal studies and therapy trials.

## A balanced view
| Claim | Status |
| Unconscious processes matter | Strongly supported, though not in Freud's exact form |
| Early relationships shape later ones | Supported |
| Defences exist and vary in maturity | Partly supported |
| Psychosexual stages and Oedipus complex | Weak or unsupported |
| Dreams as disguised wish fulfilment | Weak |
| Psychodynamic therapy works | Supported by trials and meta analyses |

## Conclusion
Freud's original theory falls short of scientific standards, but many of its general ideas have been reformulated and tested. Psychoanalysis today is best seen as a set of hypotheses, some supported and some discarded, rather than a single closed system.`,
    keyPoints: ["Popper's falsifiability critique with example", "Grunbaum: testable but poorly supported; suggestion and tally argument", "Problems of samples and case reports", "Westen's five supported propositions", "Experimental evidence on unconscious processes and repressive coping", "Shedler 2010 and therapy evidence", "Table of supported and unsupported claims", "Balanced conclusion"],
    pitfalls: ["All for or all against", "No modern evidence"],
    module: "psychodynamics/3-4",
    visuals: [compare("Modern evidence for psychodynamic ideas", ["Supported", ["Unconscious processing", "Early relationships matter", "Transference like patterns", "Therapy effective"], "Reformulated ideas survive"], ["Not supported", ["Universal Oedipus complex", "Oral and anal types", "Dreams as disguised wishes", "Death instinct"], "Specific claims fail"])],
    ref: "Popper 1963 Conjectures and Refutations; Grunbaum 1984; Westen 1998; Andersen and Chen 2002; Weinberger repressive coping 1979; Anderson and Green 2001; Shedler 2010; psychodynamics module 3.4",
  },
  {
    id: "pers-l01-004",
    subject: S,
    topic: "jung",
    marks: 15,
    difficulty: 3,
    exams: ["cuet-pg", "ugc-net", "ma-semester"],
    question: "Describe Jung's analytical psychology. Explain the structure of the psyche, archetypes, psychological types and individuation, and evaluate the theory.",
    plan: ["Jung and the break with Freud", "Structure of the psyche", "Archetypes", "Psychological types", "Individuation and evaluation"],
    answer: `## Jung and Freud
Carl Gustav Jung, a Swiss psychiatrist, was once Freud's chosen successor, but they split in 1913. Jung rejected Freud's view of libido as mainly sexual, seeing it as general psychic energy, and he gave more weight to the future, purpose and spirituality. His approach is called analytical psychology.

## Structure of the psyche
1. The ego: the conscious mind, the centre of awareness and identity.
2. The personal unconscious: forgotten and repressed experiences of the individual. Within it are complexes, clusters of emotionally charged ideas around a theme, such as a mother complex. Jung's word association test, in which delayed or unusual responses revealed complexes, was an early experimental method.
3. The collective unconscious: a deeper layer shared by all humans, inherited, containing archetypes. Jung based this on similarities in myths, religions, dreams and the delusions of patients across cultures.

## Archetypes
Archetypes are universal predispositions to experience the world in certain ways, expressed in symbols and images.
- Persona: the social mask we show to others.
- Shadow: the dark, rejected side of the personality, often projected onto enemies.
- Anima and animus: the feminine side in men and masculine side in women.
- The self: the archetype of wholeness and the centre of the total psyche, symbolised by the mandala.
- Others: the great mother, the wise old man, the hero, the trickster.
Indian examples are often given: the mother goddess as the great mother, the guru as the wise old man, and mandalas in Hindu and Buddhist art as images of the self. Jung himself visited India in 1937 to 1938 and wrote about yoga.

## Psychological types
In 1921 Jung described two attitudes:
- Extraversion: energy directed outward to people and things.
- Introversion: energy directed inward to thoughts and feelings.
And four functions:
| Function | Kind | Concerned with |
| Thinking | Rational | Logic and analysis |
| Feeling | Rational | Values and judgement of worth |
| Sensation | Irrational | Facts perceived through the senses |
| Intuition | Irrational | Possibilities and hunches |
Combining them gives eight types, such as introverted thinking. The Myers Briggs Type Indicator was later built on these ideas, though it has poor test retest reliability and is criticised for forcing people into types.

## Individuation
Individuation is the lifelong process of becoming a whole, integrated self, by bringing unconscious contents, such as the shadow and anima, into awareness and balancing opposites. Jung saw midlife as a key turning point, when people turn from outer achievement to inner meaning.

## Jung's method in therapy
Jungian therapy uses dream analysis, in which dream images are read as messages from the unconscious about what is missing in conscious life, and active imagination, in which the person enters into a dialogue with images and figures from dreams. Unlike Freud's reductive reading of symbols as disguised wishes, Jung read them as prospective, pointing to future growth. Art, myth and religious symbols are used to amplify the meaning of a dream. Synchronicity, his term for meaningful coincidences without a causal link, shows his interest in the spiritual side of experience.

## Evaluation
Strengths:
- Extraversion and introversion became central dimensions in later trait theories, including the Big Five.
- Emphasis on spirituality, meaning and adult development enriched personality theory.
- Influenced art therapy, dream work and cultural studies.
Weaknesses:
- The collective unconscious and archetypes are difficult to test, and inheritance of images has no genetic basis.
- Concepts are vague and mystical.
- Evidence comes mainly from Jung's interpretations of myths and patients.

## Conclusion
Jung expanded psychoanalysis beyond sexuality to include the collective, spiritual and future oriented sides of personality. His typology lives on, while his deeper theory remains speculative.`,
    keyPoints: ["Split with Freud in 1913 and view of libido", "Ego, personal unconscious with complexes, collective unconscious", "Word association test", "Persona, shadow, anima and animus, self", "Two attitudes and four functions", "Individuation and midlife", "MBTI link and its limits", "Evaluation"],
    pitfalls: ["Confusing personal and collective unconscious", "No evaluation"],
    module: "psychodynamics",
    visuals: [
      layers("Structure of the psyche", "iceberg", [["Ego", "Conscious identity"], ["Personal unconscious", "Forgotten experiences and complexes"], ["Collective unconscious", "Shared archetypes, deepest layer"]]),
      tree("Psychological types", [["Jung's types", "Two attitudes and four functions", -1], ["Extraversion", "Energy outward", 0], ["Introversion", "Energy inward", 0], ["Rational functions", "Thinking and feeling", 0], ["Irrational functions", "Sensation and intuition", 0]]),
    ],
    ref: "Jung 1921 Psychological Types; Jung 1959 Archetypes and the Collective Unconscious; Jung's India visit 1937-38; Pittenger 2005 on MBTI reliability; personality module",
  },
  {
    id: "pers-l01-005",
    subject: S,
    topic: "adler",
    marks: 10,
    difficulty: 2,
    exams: ["cuet-pg", "ugc-net", "ma-semester"],
    question: "Explain Adler's individual psychology with reference to inferiority, striving for superiority, style of life, social interest and birth order.",
    plan: ["Adler and the break with Freud", "Inferiority and compensation", "Striving, fictional finalism and style of life", "Social interest", "Birth order and evaluation"],
    answer: `## Adler
Alfred Adler, a Viennese physician, broke with Freud in 1911. He rejected the central role of sexuality and saw people as unified, goal directed and social. He called his approach individual psychology, meaning the study of the person as an indivisible whole.

## Inferiority and compensation
All children begin small and dependent, so feelings of inferiority are universal and normal. Adler first wrote about organ inferiority, how people compensate for a physical weakness, for example the stammering Demosthenes becoming a great orator. Feelings of inferiority drive growth. When they are overwhelming, as with neglect, pampering or physical disability, an inferiority complex develops, with discouragement and withdrawal. Some people overcompensate with a superiority complex, boasting and dominating.

## Striving for superiority
The basic motive is striving for superiority or perfection: moving from a felt minus to a felt plus. Healthy people strive for perfection in ways that also help others; unhealthy people strive for personal power.

## Fictional finalism and style of life
People are guided by goals they create, often unconscious fictions, such as "I must be perfect to be loved". Adler called this fictional finalism, an idea taken from the philosopher Hans Vaihinger. Each person develops a unique style of life by about age 4 or 5, the characteristic way of pursuing goals and solving problems. Adler described ruling, getting, avoiding and socially useful types.

## Social interest
Gemeinschaftsgefuhl, or social interest, is the feeling of belonging to and caring for humanity. It is innate as a potential but must be developed by parents, especially the mother. Adler saw mental health as the degree of social interest, and neurosis, crime and suicide as failures of it. Life tasks are work, friendship and love.

## Birth order
| Position | Typical traits, as Adler suggested |
| First born | Dethroned by the next child; responsible, conservative, may fear losing position |
| Second born | Competitive, ambitious, trying to catch up |
| Youngest | Pampered, may be dependent or very ambitious |
| Only child | Used to adult attention, may struggle with sharing |
Large later studies, such as one by Julia Rohrer and colleagues with over 20,000 people in 2015, found no meaningful effect of birth order on personality traits, though first borns scored slightly higher on intelligence.

## Evaluation
Adler's ideas influenced later therapies: the focus on goals, encouragement, and social context fed into cognitive and humanistic approaches, and parent education programmes. His concepts are practical but loosely defined, and birth order claims have weak support.

## Conclusion
Adler shifted psychoanalysis from sex to social striving, giving us the inferiority complex, style of life and social interest.`,
    keyPoints: ["Individual psychology and the person as a whole", "Universal inferiority and compensation", "Inferiority and superiority complexes", "Striving for superiority and fictional finalism", "Style of life formed early", "Social interest as the measure of health", "Birth order and the weak modern evidence", "Influence on later therapies"],
    pitfalls: ["Calling inferiority feelings abnormal", "Presenting birth order effects as proven"],
    module: "psychodynamics",
    visuals: [chain("Striving for superiority", [["Felt inferiority", "Universal in childhood"], ["Compensation", "Striving to overcome"], ["Style of life", "Unique pattern by age 5"], ["Social interest", "Healthy striving that helps others"]])],
    ref: "Adler 1907 Organ Inferiority; Adler 1927 Understanding Human Nature; Vaihinger 1911; Rohrer, Egloff and Schmukle 2015 PNAS birth order; personality module",
  },
  {
    id: "pers-l01-006",
    subject: S,
    topic: "neo-freudian",
    marks: 15,
    difficulty: 3,
    exams: ["cuet-pg", "ugc-net", "ma-semester"],
    question: "Discuss the contributions of the neo-Freudians Karen Horney, Erich Fromm and Harry Stack Sullivan to personality theory. How did they differ from Freud?",
    plan: ["Who the neo Freudians were", "Horney", "Fromm", "Sullivan", "Common themes and differences from Freud", "Evaluation"],
    answer: `## The neo Freudians
The neo Freudians kept Freud's ideas of the unconscious and early experience but shifted the focus from instincts to social and cultural forces. They worked largely in America from the 1930s, influenced by anthropology and sociology.

## Karen Horney
- Basic anxiety: a child's feeling of being isolated and helpless in a potentially hostile world, caused by parental indifference, inconsistency or domination, which she called basic evil.
- Neurotic needs: to cope, people develop ten neurotic needs, such as for affection, power, prestige and perfection, grouped into three trends:
1. Moving towards people: compliance, needing approval and love.
2. Moving against people: aggression, needing power and control.
3. Moving away from people: detachment, needing independence and privacy.
Healthy people use all three flexibly; neurotic people rely rigidly on one.
- The idealised self: neurotic people create an unrealistic image of themselves and are driven by the tyranny of the shoulds.
- Feminine psychology: she rejected penis envy, arguing that women envy men's social power, not anatomy, and proposed womb envy in men. She was one of the first feminist voices in psychoanalysis.

## Erich Fromm
- Fromm, a psychoanalyst trained also in sociology, argued that modern people have gained freedom from traditional ties but feel isolated. In his 1941 work on the escape from freedom, he described ways people flee this burden: authoritarianism, destructiveness and automaton conformity. He used this to explain the appeal of Nazism.
- Human needs: relatedness, transcendence, rootedness, identity and a frame of orientation.
- Character orientations: unproductive, such as receptive, exploitative, hoarding and marketing, the last selling oneself as a commodity, and the productive orientation, in which people realise their potential through love and work.

## Harry Stack Sullivan
- Sullivan, an American psychiatrist, defined personality as the relatively enduring pattern of recurrent interpersonal situations. Personality exists only in relationships.
- Anxiety comes from the caregiver's anxiety, transmitted through empathy, and leads to the self system, which protects against anxiety through security operations.
- Personifications: good me, bad me and not me, images of the self shaped by caregivers' approval, disapproval and intense anxiety.
- Developmental epochs from infancy to late adolescence emphasise the importance of a close same sex friend, the chum, in preadolescence.
- He worked successfully with patients with schizophrenia using a relational approach.

## A case example
Ravi, 32, a software engineer in Hyderabad, cannot say no to his manager or family, works late every night and feels empty and resentful. Horney would see a rigid moving towards people, driven by basic anxiety from a critical, unpredictable father, with an idealised self as the perfect, always helpful son and employee. Fromm would note a marketing orientation, valuing himself only by what others pay for. Sullivan would look for the bad me formed when his needs met disapproval, and for security operations that keep anxiety away in every relationship. Each theory directs therapy towards relationships and social pressures rather than instinctual conflict.

## Differences from Freud
| Issue | Freud | Neo Freudians |
| Main motive | Sexual and aggressive instincts | Security, relatedness, belonging |
| Key forces | Biology | Culture and relationships |
| Women | Penis envy | Social inequality |
| Development | Ends by about age 5 | Continues through adolescence and life |
| Optimism | Pessimistic | More hopeful about change |

## Evaluation
Strengths: they brought culture and relationships into personality theory, influenced interpersonal psychotherapy and attachment research, and Horney's trends anticipate later work on interpersonal styles. Weaknesses: like Freud, their concepts are hard to test and based on clinical impressions.

## Conclusion
The neo Freudians turned psychoanalysis outward towards society and relationships, laying foundations for interpersonal and cultural approaches to personality.`,
    keyPoints: ["Social and cultural shift from instincts", "Horney: basic anxiety and three trends", "Horney: idealised self and feminine psychology", "Fromm: escape from freedom and character orientations", "Sullivan: interpersonal definition, self system, personifications", "Sullivan's chumship", "Comparison table with Freud", "Evaluation"],
    pitfalls: ["Covering only Horney", "No comparison with Freud"],
    module: "psychodynamics",
    visuals: [
      compare("Differences from Freud", ["Freud", ["Instincts drive behaviour", "Biology central", "Penis envy", "Personality fixed early"], "Biological and pessimistic"], ["Neo Freudians", ["Security and relatedness drive behaviour", "Culture and relationships central", "Social inequality explains women's position", "Development continues"], "Social and hopeful"]),
      tree("Karen Horney", [["Basic anxiety", "Coping strategies", -1], ["Moving towards", "Compliance and approval", 0], ["Moving against", "Aggression and power", 0], ["Moving away", "Detachment and independence", 0]]),
    ],
    ref: "Horney 1937, 1945, 1950; Fromm 1941 Escape from Freedom, 1947; Sullivan 1953 Interpersonal Theory of Psychiatry; personality module",
  },
  {
    id: "pers-l01-007",
    subject: S,
    topic: "neo-freudian",
    marks: 10,
    difficulty: 2,
    exams: ["cuet-pg", "ugc-net", "ma-semester"],
    question: "Explain Erikson's psychosocial theory of personality development and evaluate it.",
    plan: ["Erikson and ego psychology", "Epigenetic principle", "The eight stages", "Identity research", "Evaluation"],
    answer: `## Erikson
Erik Erikson, trained by Anna Freud in Vienna, extended psychoanalysis in two ways: he focused on the ego and its adaptation to society rather than on id drives, and he described development across the whole life span. His theory is psychosocial because each stage is shaped by social relationships and culture.

## The epigenetic principle
Development unfolds according to a ground plan, with each stage having its own time of special importance. At each stage a crisis, or turning point, arises between two opposing tendencies. Successful resolution produces a basic virtue or strength; unsuccessful resolution leaves vulnerability, but later stages can still repair earlier problems.

## The eight stages
| Stage | Age | Crisis | Virtue |
| 1 | Infancy | Trust versus mistrust | Hope |
| 2 | Early childhood | Autonomy versus shame and doubt | Will |
| 3 | Play age | Initiative versus guilt | Purpose |
| 4 | School age | Industry versus inferiority | Competence |
| 5 | Adolescence | Identity versus role confusion | Fidelity |
| 6 | Young adulthood | Intimacy versus isolation | Love |
| 7 | Adulthood | Generativity versus stagnation | Care |
| 8 | Old age | Integrity versus despair | Wisdom |
Examples: a baby fed and comforted reliably develops trust; a schoolchild who masters reading and cricket feels competent; a 60 year old who mentors young colleagues and grandchildren is generative; a person who looks back with acceptance achieves integrity.

## Identity research
James Marcia built on stage 5, describing four identity statuses based on exploration and commitment:
- Achievement: explored and committed.
- Moratorium: exploring, not yet committed.
- Foreclosure: committed without exploring, for example accepting a career chosen by parents, common in Indian families.
- Diffusion: neither exploring nor committed.
Indian research suggests that foreclosure is more acceptable in collectivist settings and may not carry the same costs.

## Evaluation
Strengths:
- Covers the whole life span and links individual and society.
- Identity and generativity have generated large research programmes.
- Useful for counselling across ages.
Weaknesses:
- Stages are broad and hard to measure.
- The order and timing reflect Western, male, middle class lives; for many women, intimacy and identity develop together.
- Little explanation of how crises are resolved.

## Conclusion
Erikson's theory gave psychology a life span map of personality growth, with identity as its most influential concept.`,
    keyPoints: ["Ego psychology and psychosocial focus", "Epigenetic principle and crises", "All eight stages with virtues", "Examples for stages", "Marcia's identity statuses", "Indian cultural note on foreclosure", "Evaluation"],
    pitfalls: ["Wrong order of stages", "Missing virtues"],
    module: "defences/2-4",
    visuals: [timeline("Put Erikson's stages in order", [["Trust versus mistrust", "Infancy"], ["Autonomy versus shame", "Early childhood"], ["Initiative versus guilt", "Play age"], ["Industry versus inferiority", "School age"], ["Identity versus role confusion", "Adolescence"], ["Intimacy versus isolation", "Young adult"], ["Generativity versus stagnation", "Adult"], ["Integrity versus despair", "Old age"]], "Each crisis builds on the ones before.")],
    ref: "Erikson 1950 Childhood and Society, 1968 Identity: Youth and Crisis; Marcia 1966; defences module 2.4",
  },
  {
    id: "pers-l01-008",
    subject: S,
    topic: "murray",
    marks: 5,
    difficulty: 3,
    exams: ["cuet-pg", "ugc-net", "ma-semester"],
    question: "Write a short note on Murray's personology, with reference to needs, press and the Thematic Apperception Test.",
    plan: ["Murray's approach", "Needs", "Press and thema", "TAT"],
    answer: `## Personology
Henry Murray at the Harvard Psychological Clinic called his approach personology: the intensive study of individual lives, combining psychoanalytic ideas with careful research by a team of observers. His 1938 work described a detailed study of about 50 college men.

## Needs
A need is a force that organises perception, thinking and action to change an unsatisfying situation. Murray listed about 20 psychogenic needs, including:
- Achievement: to accomplish something difficult.
- Affiliation: to form friendships.
- Dominance: to control others.
- Autonomy: to resist control.
- Nurturance: to help others.
- Exhibition, order, aggression, abasement and others.
Needs can be overt or latent, and some combine, such as when one need serves another.

## Press and thema
Press is the force from the environment that helps or hinders need satisfaction, such as a supportive teacher or a rejecting parent. Alpha press is the real environment; beta press is the person's perception of it. A thema is the combination of a need and a press in a unit of behaviour.

## The Thematic Apperception Test
Murray and Christiana Morgan created the TAT in 1935: a set of ambiguous pictures about which people tell stories. Themes in the stories reveal needs and press. David McClelland later used TAT like pictures to measure need for achievement, and Uma Chaudhury developed an Indian adaptation.

## Conclusion
Murray's needs and press shaped motivation research and projective testing.`,
    keyPoints: ["Personology and the Harvard clinic", "About 20 psychogenic needs with examples", "Press, alpha and beta", "Thema", "TAT by Murray and Morgan", "McClelland's need for achievement", "Indian adaptation"],
    pitfalls: ["Calling TAT a self report test"],
    module: "assessment/2-4",
    visuals: [chain("Needs", [["Need", "Inner force, such as achievement"], ["Press", "Outer force, real or perceived"], ["Thema", "Need meets press"], ["TAT stories", "Reveal needs and press"]])],
    ref: "Murray 1938 Explorations in Personality; Morgan and Murray 1935; McClelland et al 1953; Chaudhury Indian TAT 1960; assessment module 2.4",
  },
  {
    id: "pers-l01-009",
    subject: S,
    topic: "object-relations",
    marks: 15,
    difficulty: 4,
    exams: ["mcp-entrance", "ma-semester", "md-psychiatry"],
    question: "Discuss the object relations theories of Melanie Klein, Donald Winnicott and Otto Kernberg, and Kohut's self psychology. How do they explain personality and its disorders?",
    plan: ["What object relations means", "Klein", "Winnicott", "Kernberg", "Kohut", "Clinical relevance"],
    answer: `## What object relations means
In psychoanalysis, an object is the person or part of a person towards whom feelings are directed, usually the mother. Object relations theories hold that the basic human drive is for relationships, not instinctual discharge, and that early relationships are taken inside as internal representations of self and others, which shape later personality.

## Melanie Klein
Klein, working with young children through play, described:
- The paranoid schizoid position, in the first months: the infant experiences the mother as split into a good breast, which feeds, and a bad breast, which frustrates. The infant protects the good by splitting off and projecting bad feelings, leading to persecutory anxiety.
- The depressive position, from about six months: the infant realises that the good and bad mother are the same person, feels guilt for its aggression and wishes to make reparation.
- Projective identification: putting unwanted parts of the self into another and then relating to that person as if they contain them.
- Envy and gratitude as early emotions.
Positions are not stages; adults move between them.

## Donald Winnicott
Winnicott, a paediatrician and analyst, emphasised the environment:
- The good enough mother adapts closely to the infant at first, then gradually fails in tolerable ways, helping the child to cope with reality.
- The holding environment: physical and emotional containment that lets the infant feel safe.
- The transitional object, such as a blanket or soft toy, helps the child move from fusion with mother to independence.
- The true self, spontaneous and authentic, versus the false self, a compliant front built when the child must adapt to a mother who cannot meet its needs.

## Otto Kernberg
Kernberg integrated object relations with ego psychology to explain personality disorders. He described levels of personality organisation:
| Level | Identity | Defences | Reality testing |
| Neurotic | Integrated | Mature, based on repression | Intact |
| Borderline | Identity diffusion | Primitive: splitting, projective identification, idealisation and devaluation | Mostly intact |
| Psychotic | Identity diffusion | Primitive | Lost |
Borderline organisation includes borderline, narcissistic, antisocial and paranoid personalities. Transference focused psychotherapy, based on his ideas, has shown benefit in trials for borderline personality disorder.

## Heinz Kohut
Kohut's self psychology focused on narcissism and the development of a cohesive self. Children need selfobjects, people experienced as part of the self, who meet three needs:
1. Mirroring: admiration and recognition of the child's achievements.
2. Idealising: someone strong and calm to look up to and merge with.
3. Twinship: feeling alike with others.
When parents fail empathically in severe ways, the self remains fragile, leading to narcissistic personality, with grandiosity covering emptiness and rage at slights. Therapy provides empathic attunement and the working through of these selfobject transferences.

## Clinical relevance
- These theories explain splitting, unstable relationships and identity problems in borderline and narcissistic disorders.
- Mentalization based treatment, by Peter Fonagy and Anthony Bateman, draws on object relations and attachment.
- The ideas fit attachment research showing that early relationships shape internal working models.

## A clinical illustration
Neha, 24, idealises a new friend as the only person who understands her, then, after one cancelled meeting, sees her as cruel and cuts contact. Klein and Kernberg would call this splitting, keeping all good and all bad images apart, with identity diffusion. Kohut would add that Neha seeks an idealising selfobject and reacts with rage when the selfobject fails her. Winnicott would ask whether she developed a false self in a family where her real needs were not met. Therapy aims to help her hold good and bad in the same person and to tolerate ordinary disappointment.

## Evaluation
The theories are rich clinically but hard to test, especially claims about the infant's inner world in the first months. Infant research shows babies are more capable and less fused with mothers than Klein proposed.

## Conclusion
Object relations and self psychology moved psychoanalysis from drives to relationships and the self, and remain central to understanding personality disorders.`,
    keyPoints: ["Definition of object and relationship drive", "Klein: paranoid schizoid and depressive positions, splitting, projective identification", "Winnicott: good enough mother, holding, transitional object, true and false self", "Kernberg: levels of personality organisation", "Transference focused psychotherapy", "Kohut: mirroring, idealising, twinship selfobjects", "Link to borderline and narcissistic disorders", "Evaluation"],
    pitfalls: ["Calling Klein's positions fixed stages", "Ignoring clinical application"],
    module: "psychodynamics/2-2",
    visuals: [
      layers("Otto Kernberg", "stack", [["Neurotic organisation", "Integrated identity, mature defences, reality intact"], ["Borderline organisation", "Identity diffusion, splitting, reality mostly intact"], ["Psychotic organisation", "Identity diffusion, primitive defences, reality lost"]]),
      tree("Heinz Kohut", [["Selfobject needs", "For a cohesive self", -1], ["Mirroring", "Admiration of the child", 0], ["Idealising", "A calm, strong figure", 0], ["Twinship", "Feeling alike with others", 0]]),
    ],
    ref: "Klein 1946, 1957; Winnicott 1953, 1960, 1965; Kernberg 1975, 1984; Clarkin et al 2007 TFP; Kohut 1971, 1977; Bateman and Fonagy MBT; psychodynamics module 2.2 and 2.3",
  },
  {
    id: "pers-l01-010",
    subject: S,
    topic: "type-theories",
    marks: 10,
    difficulty: 1,
    exams: ["cuet-pg", "ugc-net", "ma-semester"],
    question: "Describe the type approach to personality, with reference to the humoral theory, Kretschmer and Sheldon. What are the limitations of type theories?",
    plan: ["Types and traits", "Humoral theory", "Kretschmer", "Sheldon", "Other typologies and limitations"],
    answer: `## Types and traits
A type theory sorts people into a few distinct categories, each with a set of characteristics. A trait theory instead describes people by their position on continuous dimensions. Type theories are among the oldest attempts to describe personality.

## The humoral theory
Hippocrates in ancient Greece proposed four bodily fluids, or humours, and Galen in the second century linked an excess of each to a temperament:
| Humour | Temperament | Traits |
| Blood | Sanguine | Cheerful, sociable, optimistic |
| Yellow bile | Choleric | Irritable, quick tempered |
| Black bile | Melancholic | Sad, anxious, thoughtful |
| Phlegm | Phlegmatic | Calm, slow, unemotional |
The physiology is wrong, but Hans Eysenck later showed that the four temperaments fit the four quadrants formed by his dimensions of extraversion and neuroticism. Ayurveda has a comparable idea of three doshas, vata, pitta and kapha, linked to body type and temperament.

## Kretschmer
Ernst Kretschmer, a German psychiatrist, related body build to mental illness and temperament in 1921:
- Pyknic: short, round, stocky; linked to cyclothymic temperament and manic depressive illness.
- Asthenic or leptosomic: tall and thin; linked to schizothymic temperament and schizophrenia.
- Athletic: muscular; linked to schizophrenia as well, in his data.
- Dysplastic: disproportionate builds.
His samples did not control for age: manic depressive patients were older and therefore heavier, which explains much of his finding.

## Sheldon
William Sheldon in the 1940s rated photographs of thousands of male students on three somatotypes, each on a 1 to 7 scale, and linked them to temperaments:
- Endomorph: soft and round; viscerotonia, relaxed, sociable, loving food and comfort.
- Mesomorph: muscular; somatotonia, assertive, energetic, adventurous.
- Ectomorph: thin and fragile; cerebrotonia, restrained, private, intellectual.
He reported high correlations, but he rated both body and temperament himself, so his expectations may have shaped the ratings. Later independent studies found much weaker links.

## Other typologies
- Jung's introvert and extravert types.
- Type A and Type B behaviour patterns, from Meyer Friedman and Ray Rosenman's work on heart disease.
- Psychiatric personality disorder categories, which are being replaced by dimensional models.

## Limitations
- People rarely fit pure types; most are mixtures.
- Types oversimplify and ignore variation within categories.
- Research methods were often biased.
- Labels can lead to stereotyping.
- Trait theories, which measure degrees, describe personality more accurately.

## Conclusion
Type theories gave early structure to personality description, but continuous traits have replaced them, though some types survive in popular and clinical use.`,
    keyPoints: ["Types versus traits", "Four humours and temperaments", "Eysenck's link of temperaments to his quadrants", "Ayurvedic doshas as comparison", "Kretschmer's body types and the age confound", "Sheldon's somatotypes and rater bias", "Other typologies", "Limitations"],
    pitfalls: ["Mixing up Kretschmer and Sheldon terms", "No limitations"],
    module: "personality-theories/1-2",
    visuals: [compare("Sheldon", ["Sheldon's somatotypes", ["Endomorph: round", "Mesomorph: muscular", "Ectomorph: thin"], "Body type"], ["Matching temperaments", ["Viscerotonia: relaxed, sociable", "Somatotonia: assertive, energetic", "Cerebrotonia: restrained, intellectual"], "Claimed temperament"])],
    ref: "Hippocrates; Galen; Kretschmer 1921 Physique and Character; Sheldon 1940, 1942; Eysenck 1967; Friedman and Rosenman 1959; personality-theories module 1.2",
  },
]);
