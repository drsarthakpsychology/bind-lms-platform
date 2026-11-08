import type { LongQA } from "@/lib/prep/long-types";

const S = "indian-psychology" as const;

export const INDIAN_PSYCHOLOGY_L01: LongQA[] = [
  {
    id: "indp-l01-001",
    subject: S,
    topic: "upanishads",
    marks: 10,
    difficulty: 2,
    exams: ["ugc-net", "ma-semester"],
    question: "Discuss the concept of self (atman) in the Upanishads and the three main schools of Vedanta.",
    plan: ["Introduce the Upanishads and their central question", "Atman, Brahman and the mahavakyas", "Layers of the person and the witness", "Advaita, Vishishtadvaita and Dvaita compared", "Psychological relevance", "Critical note"],
    answer: `## The Upanishads
The Upanishads are philosophical texts at the end of the Vedas; the oldest are usually dated to roughly 800 to 500 BCE. They ask a psychological question in its deepest form: who am I? Their answer is that behind the changing body, senses and mind there is an unchanging conscious self, the atman, and that this self is ultimately one with Brahman, the ground of all reality.

## Atman and Brahman
- The atman is pure awareness, the subject that can never become an object. It sees but cannot be seen.
- The great sayings, the mahavakyas, express the identity of self and reality: "tat tvam asi", you are that, from the Chandogya Upanishad, and "aham brahmasmi", I am Brahman, from the Brihadaranyaka Upanishad.
- The method of "neti neti", not this, not this, strips away what the self is not: not the body, not the senses, not the changing thoughts.
- The Taittiriya Upanishad pictures the person as five sheaths, the koshas, from the physical body to the sheath of bliss, with the self beyond all of them.
- The Mandukya Upanishad describes waking, dreaming, deep sleep and turiya, the fourth state of pure consciousness that witnesses the other three.

## The three schools of Vedanta
| School | Teacher | Relation of self and Brahman | Key idea |
| Advaita, non-dual | Shankara, around the 8th century | Identical | Separateness is avidya, ignorance, and maya |
| Vishishtadvaita, qualified non-dual | Ramanuja, 11th to 12th century | Selves are real parts or modes of Brahman | Devotion; selves and world are real |
| Dvaita, dual | Madhva, 13th century | Eternally distinct | Dependence on a personal God |

## Psychological relevance
- The distinction between a witnessing self and the changing contents of mind parallels the observing self in mindfulness and acceptance and commitment therapy: you are not your thoughts.
- The layered model of the person anticipates a biopsychosocial and spiritual view of health.
- It treats self-knowledge as the highest aim, which raises research questions about how far people can know their own minds and whether training improves it.
- It contrasts with Western views of the self as a construct, such as self-concept or identity, and with Buddhism's denial of a permanent self.

## Critical note
These are metaphysical claims about the nature of consciousness that cannot be tested directly. Psychology can study their correlates, such as the effects of self-inquiry or meditation on wellbeing and attention, without settling whether the atman exists. They also come from Sanskrit Brahminical sources, and a full Indian psychology must include other traditions as well.`,
    keyPoints: ["Upanishads and the question 'who am I'", "Atman as witnessing consciousness", "Mahavakyas such as tat tvam asi", "Neti neti, koshas and the four states", "Table of Advaita, Vishishtadvaita, Dvaita", "Links to observing self in therapy", "Testability and inclusion critique"],
    pitfalls: ["Mixing up Shankara and Ramanuja", "Presenting metaphysics as proven psychology"],
    module: "foundations/2-3",
    visuals: [
      {
        kind: "compare",
        caption: "The three schools of Vedanta",
        data: {
          title: "Advaita and Dvaita",
          a: { label: "Advaita: Shankara", points: ["Self and Brahman identical", "Separateness is ignorance", "Liberation by knowledge"], summary: "Non-dual." },
          b: { label: "Dvaita: Madhva", points: ["Self and God eternally distinct", "World is real", "Liberation by devotion and grace"], summary: "Dual." },
        },
      },
    ],
    ref: "Foundations module 2.3; Rao and Paranjpe, Psychology in the Indian Tradition; Radhakrishnan, The Principal Upanishads",
  },
  {
    id: "indp-l01-002",
    subject: S,
    topic: "states-of-consciousness",
    marks: 5,
    difficulty: 2,
    exams: ["ugc-net", "ma-semester"],
    question: "Write a short note on the four states of consciousness in the Mandukya Upanishad.",
    plan: ["Source and context", "The four states", "Comparison with sleep science", "Psychological relevance and limits"],
    answer: `## Source
The Mandukya Upanishad, one of the shortest Upanishads, analyses consciousness through the sacred syllable Om. Its three sounds and the silence after them stand for four states, later explained in Gaudapada's commentary.

## The four states
1. Jagrat, waking: consciousness turned outward, aware of the external world through the senses.
2. Svapna, dreaming: consciousness turned inward, experiencing a world built from impressions of the waking state.
3. Sushupti, deep dreamless sleep: no objects and no desire, yet, it is argued, a residual awareness, since on waking we say "I slept well".
4. Turiya, the fourth: not a fourth state alongside the others but pure consciousness that underlies and witnesses all three. It is described as peaceful, non-dual and beyond words.

## Comparison with sleep science
| Upanishad | Modern sleep research |
| Jagrat | Waking EEG with beta and alpha rhythms |
| Svapna | REM sleep, when vivid dreaming is most common |
| Sushupti | Deep slow-wave sleep, stage N3 |
| Turiya | No direct equivalent; compared with reports of pure awareness in long-term meditators |

## Relevance and limits
The idea of a witness that observes states without being them parallels mindfulness training and the observing self in acceptance therapy. Researchers have begun to study minimal phenomenal experience and awareness during sleep in meditators. But turiya is a metaphysical claim: science can study reports and brain correlates of such states, not prove what consciousness ultimately is.`,
    keyPoints: ["Mandukya and the syllable Om", "Jagrat, svapna, sushupti", "Turiya as witness of all three", "Mapping to REM and N3", "Witness and mindfulness link", "Limits of testability"],
    pitfalls: ["Calling turiya deep sleep", "Mapping turiya onto a sleep stage"],
    module: "foundations/2-3",
    visuals: [
      {
        kind: "layers",
        caption: "The four states",
        data: {
          title: "Four states of consciousness",
          shape: "stack",
          layers: [
            { label: "Turiya", detail: "Pure consciousness that underlies and witnesses the other three." },
            { label: "Sushupti", detail: "Deep dreamless sleep, without objects." },
            { label: "Svapna", detail: "Dreaming: an inner world." },
            { label: "Jagrat", detail: "Waking: the outer world through the senses." },
          ],
        },
      },
      { kind: "figure", caption: "Comparison with sleep science", data: { id: "hypnogram", title: "A night's sleep stages" } },
    ],
    ref: "Foundations module 2.3; Mandukya Upanishad with Gaudapada's karika; Josipovic on non-dual awareness",
  },
  {
    id: "indp-l01-003",
    subject: S,
    topic: "antahkarana",
    marks: 5,
    difficulty: 2,
    exams: ["ugc-net", "ma-semester"],
    question: "Explain the concept of antahkarana, the inner instrument, in Indian psychology.",
    plan: ["Meaning of the term", "The four parts with functions", "Modern parallels", "One caution"],
    answer: `## Meaning
Antahkarana means the inner instrument or inner organ. In Vedanta and related schools, the mind is not the self but a set of instruments that the self, the witnessing consciousness, uses to know and act in the world. The outer instruments are the senses and organs of action; the inner instrument processes what they bring in.

## Its four parts
| Part | Function | Modern parallel |
| Manas | Receives sense data, attends, deliberates, doubts | Sensory processing, attention, working memory |
| Buddhi | Decides, discerns, judges, understands | Executive function, judgement, reasoning |
| Ahamkara | The I-maker that claims experience as mine | Ego, self-concept, sense of agency |
| Chitta | Storehouse of impressions, samskaras, and memories | Long-term and implicit memory, habits |

Samkhya counts three of these, buddhi, ahamkara and manas, as the evolutes of prakriti, while Vedanta adds chitta.

## An example
A student hears a car horn. Manas registers it and wonders whether it is the school bus; buddhi decides that it is; ahamkara feels "I am late"; chitta supplies the memory of being scolded last time, colouring the emotion.

## Relevance and caution
The model shows a clear functional analysis of the mind long before cognitive psychology, and it places the sense of self inside the mind rather than equating it with the deeper self. It is a functional model and should not be mapped one-to-one onto brain regions.`,
    keyPoints: ["Antahkarana as inner instrument of the self", "Manas and its functions", "Buddhi as discernment", "Ahamkara as I-maker", "Chitta as storehouse of impressions", "Worked example", "Caution against brain mapping"],
    pitfalls: ["Confusing manas with buddhi", "Treating ahamkara as the true self"],
    module: "foundations/2-3",
    visuals: [
      {
        kind: "layers",
        caption: "Its four parts",
        data: {
          title: "The fourfold inner instrument",
          shape: "stack",
          layers: [
            { label: "Manas", detail: "Receives sense data, deliberates and doubts." },
            { label: "Buddhi", detail: "Decides, discerns and judges." },
            { label: "Ahamkara", detail: "The I-maker that owns experience as mine." },
            { label: "Chitta", detail: "Storehouse of impressions and memories." },
          ],
        },
      },
    ],
    ref: "Foundations module 2.3; Paranjpe, Self and Identity in Modern Psychology and Indian Thought",
  },
  {
    id: "indp-l01-004",
    subject: S,
    topic: "gita",
    marks: 15,
    difficulty: 3,
    exams: ["ugc-net", "ma-semester"],
    question: "Discuss the psychological ideas in the Bhagavad Gita. Can the Gita be read as a model of counselling?",
    plan: ["Setting: Arjuna's crisis as a clinical picture", "Sthitaprajna and emotional regulation", "Nishkama karma and anasakti", "Svadharma, the paths and the gunas", "The chain from attention to ruin", "Gita as counselling, with evidence and critique"],
    answer: `## Setting
The Bhagavad Gita is a dialogue of 700 verses in 18 chapters within the Mahabharata. It opens on the battlefield of Kurukshetra with Arjuna's despair, his vishada. Seeing teachers and relatives in the opposing army, he describes his limbs giving way, his mouth drying, his body trembling, his skin burning, his bow slipping from his hand and his mind reeling. He refuses to fight. To a modern reader this is a picture of acute anxiety with moral conflict and helplessness. Krishna's teaching over the following chapters responds to it.

## Sthitaprajna: the person of steady wisdom
In Chapter 2 Arjuna asks how a person of steady wisdom speaks, sits and walks. The answer describes someone who is not shaken by sorrow, does not crave pleasure, is free from attachment, fear and anger, and withdraws the senses from their objects as a tortoise draws in its limbs. Psychologically this is a portrait of emotional regulation and equanimity, close to modern ideas of psychological flexibility and wisdom.

## Nishkama karma and anasakti
Verse 2.47 says that one has a right to action but not to its fruits; one should not act for the sake of results, nor be attached to inaction. This is nishkama karma, desireless action. Indian psychologists have studied it as anasakti, non-attachment. Pande and Naidu developed a measure of anasakti, including effort orientation without concern for outcome and equanimity in success and failure, and found that people higher in it reported less strain under stress.

## Svadharma, paths and gunas
- Svadharma: one's own duty, suited to one's nature and role; it is better to do one's own duty imperfectly than another's well.
- The paths: karma yoga, action; jnana yoga, knowledge; bhakti yoga, devotion; and dhyana yoga, meditation, described in Chapter 6. Different paths suit different temperaments, an early idea of matching treatment to the person.
- The three gunas, sattva, rajas and tamas, shape food, faith, knowledge, action and character, discussed especially in Chapters 14, 17 and 18. This is a typology of personality.

## The chain from attention to ruin
Verses 2.62 and 2.63 describe a sequence: dwelling on objects gives rise to attachment; from attachment comes desire; from blocked desire, anger; from anger, delusion; from delusion, confusion of memory; from that, loss of discernment; and with that, the person is lost. In modern terms this links rumination and selective attention to craving, frustration, high arousal that narrows thinking, and loss of executive control. The remedy in both systems is to intervene early, at attention and appraisal.

## The Gita as counselling
- Krishna first lets Arjuna express his distress fully, then normalises it, reframes the situation, clarifies values through svadharma, and encourages action despite fear, which resembles behavioural activation and acceptance-based approaches.
- J. S. Neki and other Indian psychiatrists have discussed the Gita as a model of directive, supportive therapy within the guru and disciple relationship, suited to clients who expect guidance.
- Dilip Jeste and Ipsit Vahia compared the Gita's idea of wisdom with modern empirical models and found substantial overlap, including emotional regulation, control over desires, decisiveness, compassion and insight.
- Gita-based counselling and stress management programmes are used in some Indian settings.

## Critical evaluation
- The Gita's goal is spiritual liberation and right action, not symptom relief, so reading it as therapy is an interpretation.
- Krishna's highly directive stance and the divine authority behind it differ from modern ideas of client autonomy and informed consent.
- Its teaching on duty sits within the social order of its time, including varna, which modern counsellors must handle critically.
- Anasakti research is promising but small; constructs need further validation, and non-attachment must be distinguished from avoidance or apathy.

## Conclusion
The Gita offers a sophisticated psychology of emotion, motivation, duty and self-regulation, and its central idea of acting fully without attachment to results has been turned into a testable construct. It can inform counselling, especially in India, provided it is used with cultural sensitivity and evidence rather than as scripture.`,
    keyPoints: ["Arjuna's vishada described as a clinical picture", "Sthitaprajna as equanimity and regulation", "Nishkama karma, verse 2.47, and anasakti research", "Svadharma, the four paths and the gunas", "Chain of verses 2.62 to 2.63 with modern parallels", "Gita as counselling: Neki, Jeste and Vahia", "Critical evaluation of directiveness and social context"],
    pitfalls: ["Preaching rather than analysing", "Treating the Gita as a therapy manual without critique", "Getting the 2.47 teaching backwards as not acting"],
    module: "foundations/2-3",
    visuals: [
      {
        kind: "worked",
        caption: "The chain from attention to ruin",
        data: {
          title: "Gita 2.62 and 2.63 read by a psychologist",
          steps: [
            { q: "Dwelling on objects leads to attachment. What modern idea fits dwelling?", a: "Selective attention and rumination make something more salient and wanted." },
            { q: "Blocked desire leads to anger. Which theory links blocked goals to anger?", a: "The frustration aggression hypothesis and appraisal theory of anger." },
            { q: "Anger leads to delusion and confused memory. What does research say?", a: "High arousal narrows attention and impairs working memory." },
            { q: "Loss of discernment ruins the person. Modern parallel?", a: "Loss of executive control and impulsive choices; intervene early, at attention." },
          ],
        },
      },
    ],
    ref: "Foundations module 2.3; Jeste and Vahia 2008; Pande and Naidu 1992; Neki 1975 on psychotherapy in India",
  },
  {
    id: "indp-l01-005",
    subject: S,
    topic: "anasakti",
    marks: 10,
    difficulty: 3,
    exams: ["ugc-net", "ma-semester"],
    question: "What is anasakti? Discuss its conceptual basis, measurement and research findings.",
    plan: ["Define anasakti from the Gita", "Components", "Measurement and research by Pande and Naidu", "How it differs from related concepts", "Applications and criticisms"],
    answer: `## Meaning
Anasakti means non-attachment. It comes from the Bhagavad Gita's teaching of nishkama karma: act fully and well, but without attachment to the fruits of action. It is not indifference or withdrawal; the person works with full effort while staying steady whether the outcome is success or failure.

## Components
Indian psychologists have described anasakti as including:
- Effort orientation rather than outcome orientation: attention on doing the task well.
- Equanimity in success and failure, praise and blame.
- Reduced concern with personal gain, approaching selflessness.
- Acceptance of what cannot be controlled.

## Measurement and research
The psychologists Pande and Naidu developed a measure of anasakti in the early 1990s and studied it in relation to stress. People higher in anasakti reported less strain when facing similar stressors, suggesting that non-attachment acts as a buffer. Later Indian studies have examined it in relation to wellbeing, coping, work stress and health, and it has become a standard example of a classical concept turned into a measurable construct.

## Distinctions
| Concept | How it differs from anasakti |
| Apathy | No effort; anasakti keeps full effort |
| Avoidance coping | Escapes the task; anasakti engages fully |
| Western intrinsic motivation | Enjoyment of the task; anasakti also includes equanimity about outcomes and selflessness |
| Mindful acceptance | Close cousin; acceptance of inner experience, while anasakti centres on outcomes of action |
| Learned helplessness | Belief that effort is useless; anasakti values effort for its own sake |

## Applications
- Stress management for students facing high-stakes entrance exams, where attachment to rank can raise anxiety.
- Work settings, where an effort orientation may reduce burnout and support performance.
- Counselling that draws on clients' own cultural frame, for example a Gujarati businessman familiar with the Gita.

## Criticisms
- Most studies are cross-sectional, so cause and effect are unclear.
- Self-report measures may reflect social desirability, especially for a value held in high esteem.
- The construct overlaps with acceptance, equanimity and low neuroticism, so its incremental validity needs testing.
- In a competitive economy, critics ask whether non-attachment could be used to make people accept unfair outcomes.

## Conclusion
Anasakti is one of indigenous Indian psychology's most promising constructs: rooted in a classical text, measurable, and related to stress in expected ways. It needs longitudinal and experimental work to show that it causes better coping.`,
    keyPoints: ["Rooted in nishkama karma", "Not apathy or withdrawal", "Components: effort orientation, equanimity, selflessness", "Pande and Naidu measure and stress-buffer finding", "Distinctions table", "Applications in exam stress and work", "Methodological criticisms"],
    pitfalls: ["Defining anasakti as not caring", "No research evidence"],
    module: "foundations/2-3",
    visuals: [
      {
        kind: "compare",
        caption: "Distinctions",
        data: {
          title: "Anasakti or avoidance?",
          a: { label: "Anasakti", points: ["Full effort on the task", "Steady in success and failure", "Focus on doing well"], summary: "Engaged non-attachment." },
          b: { label: "Avoidance", points: ["Escapes the task", "Fear of failure drives behaviour", "Short-term relief"], summary: "Disengagement." },
        },
      },
    ],
    ref: "Pande and Naidu 1992, Psychology and Developing Societies; Foundations module 2.3 example box; Banth and Talwar on anasakti",
  },
  {
    id: "indp-l01-006",
    subject: S,
    topic: "panchakosha",
    marks: 5,
    difficulty: 1,
    exams: ["ugc-net", "ma-semester", "cuet-pg"],
    question: "Write a short note on the panchakosha model of the person.",
    plan: ["Source", "The five sheaths outer to inner", "Use in yoga therapy", "Significance"],
    answer: `## Source
The panchakosha, or five sheaths, model comes from the Taittiriya Upanishad. It pictures the person as five nested layers around the self, like the layers of an onion, each subtler than the one before.

## The five koshas
1. Annamaya kosha: the physical body, literally made of food.
2. Pranamaya kosha: the vital sheath of breath and life energy.
3. Manomaya kosha: the mental sheath of thoughts, feelings and the senses.
4. Vijnanamaya kosha: the sheath of discernment, intellect and wisdom.
5. Anandamaya kosha: the sheath of bliss, closest to the self.
The self, atman, lies beyond all five and is not identical with any of them.

## Use in yoga therapy
At S-VYASA near Bengaluru, an integrated approach to yoga therapy plans treatment at each level: postures and diet for the body, breathing practices for the vital layer, relaxation and chanting for the mind, counselling and self-study for the intellect, and service and joy for the innermost layer. Trials from this group report benefits for anxiety, depression and chronic illness, though many are small.

## Significance
The model is a layered, holistic view of health in Indian terms, comparable to the biopsychosocial model with a spiritual layer added. It reminds clinicians that distress shows at several levels at once, from sleep and breathing to meaning.`,
    keyPoints: ["Taittiriya Upanishad as source", "Five koshas in correct order", "Self beyond the sheaths", "Integrated yoga therapy at S-VYASA", "Comparison with biopsychosocial model", "Evidence caution"],
    pitfalls: ["Getting the order wrong", "Confusing koshas with chakras"],
    module: "foundations/1-4",
    visuals: [
      {
        kind: "layers",
        caption: "The five koshas",
        data: {
          title: "The five sheaths",
          shape: "rings",
          layers: [
            { label: "Anandamaya", detail: "Bliss, closest to the self." },
            { label: "Vijnanamaya", detail: "Discernment and wisdom." },
            { label: "Manomaya", detail: "Thoughts, feelings and senses." },
            { label: "Pranamaya", detail: "Breath and vital energy." },
            { label: "Annamaya", detail: "The physical body, the outermost sheath." },
          ],
        },
      },
    ],
    ref: "Foundations module 1.4; Taittiriya Upanishad 2.1 to 2.5; Nagendra and Nagarathna on integrated yoga therapy",
  },
  {
    id: "indp-l01-007",
    subject: S,
    topic: "pramana",
    marks: 15,
    difficulty: 3,
    exams: ["ugc-net", "ma-semester"],
    question: "Explain the Nyaya theory of pramanas. How many pramanas do the different Indian schools accept, and what is their relevance to psychological research?",
    plan: ["Basic terms: pramata, prameya, pramana, prama", "Nyaya's four pramanas with examples", "Arthapatti and anupalabdhi", "Schools and the number they accept", "The five-membered syllogism and fallacies", "Relevance to psychology"],
    answer: `## Introduction
Indian philosophy asked carefully how we come to know anything. Nyaya, the school of logic founded on the Nyaya Sutras attributed to Gautama, answered with a theory of pramanas, the valid means of knowledge. This topic appears in both UGC NET Paper 1 and the psychology paper, so it rewards careful study.

## Basic terms
- Pramata: the knower.
- Prameya: the object known.
- Pramana: the means of valid knowledge.
- Prama: valid knowledge itself, a cognition that matches its object.

## Nyaya's four pramanas
1. Pratyaksha, perception: knowledge from contact of the senses with objects. Nyaya distinguished nirvikalpaka, indeterminate perception, a bare awareness before naming, from savikalpaka, determinate perception, in which the object is recognised and named. This is close to the modern distinction between sensation and perception.
2. Anumana, inference: knowledge from a sign that is invariably connected with something else. The invariable connection is vyapti, as in wherever there is smoke there is fire. Inference may be for oneself, svartha, or for others, parartha.
3. Upamana, comparison: learning what a new word refers to through a described similarity. A villager told that a wild ox looks like a cow recognises one in the forest.
4. Shabda, verbal testimony: knowledge from the words of a reliable person, an apta, such as an expert, and for the orthodox schools, the Vedas.

## Two more pramanas
- Arthapatti, postulation: assuming something to explain an apparent contradiction. Devadatta is fat but does not eat by day, so he must eat at night.
- Anupalabdhi, non-perception: knowing that something is absent because it is not perceived where it would be seen, as in there is no pot on the floor.

## How many each school accepts
| School | Pramanas accepted | Number |
| Charvaka | Perception | 1 |
| Buddhism and Vaisheshika | Perception, inference | 2 |
| Samkhya and Yoga | Perception, inference, testimony | 3 |
| Nyaya | Perception, inference, comparison, testimony | 4 |
| Prabhakara Mimamsa | The four plus postulation | 5 |
| Bhatta Mimamsa and Advaita Vedanta | The five plus non-perception | 6 |

## The five-membered syllogism
For inference for others Nyaya used five steps: pratijna, the hill has fire; hetu, because it has smoke; udaharana, wherever there is smoke there is fire, as in a kitchen; upanaya, this hill has such smoke; and nigamana, therefore the hill has fire. Unlike Aristotle's three-part syllogism it includes a concrete example, and its purpose is to persuade a listener.

A faulty reason that only looks like a reason is a hetvabhasa. Nyaya lists five, including the inconclusive reason, which lacks invariable connection, and the contradicted reason, refuted by stronger evidence such as perception.

## Relevance to psychology
- Sources of evidence: perception maps onto observation; inference onto reasoning from data to unseen processes, as when we infer memory from recall; comparison onto analogy and model-based learning; and testimony onto the research literature and expert consensus.
- Validity: Nyaya held that a cognition is valid if it matches its object and arises from a reliable process, which parallels concerns with validity and reliability in measurement.
- Vyapti and causal inference: the demand that a sign be invariably linked to what it proves, with no counter-examples, is close to the logic of hypothesis testing and falsification.
- Hetvabhasa and research error: the inconclusive reason resembles a confound, where an association does not hold invariably.
- Perception research: the indeterminate and determinate distinction anticipates work on pre-conceptual registration and categorical perception.
- Testimony and its limits: modern science treats testimony as fallible and checkable, which raises the question of how far scripture can count as evidence in a scientific psychology.

## Conclusion
The pramana theory is a sophisticated epistemology that asks the same question research methods ask: when is a claim to know justified? It gives Indian students a native framework for thinking about evidence, while modern psychology adds controlled observation and statistical inference.`,
    keyPoints: ["Defines pramata, prameya, pramana, prama", "Four Nyaya pramanas with examples", "Nirvikalpaka and savikalpaka perception", "Arthapatti and anupalabdhi", "Correct table of schools and numbers", "Five-membered syllogism and hetvabhasa", "Specific links to research evidence and validity"],
    pitfalls: ["Getting the number for Samkhya or Charvaka wrong", "Listing pramanas with no psychological relevance"],
    module: "foundations/2-6",
    visuals: [
      {
        kind: "sort",
        caption: "Nyaya's four pramanas",
        data: {
          prompt: "Which pramana is being used?",
          buckets: ["Pratyaksha", "Anumana", "Upamana", "Shabda"],
          items: [
            { text: "You touch a stove and feel it is hot", bucket: 0 },
            { text: "Dark clouds and wet roads tell you it rained", bucket: 1 },
            { text: "Told a jackfruit looks like a giant spiky melon, you recognise one", bucket: 2 },
            { text: "A trusted psychiatrist tells you lithium needs blood tests", bucket: 3 },
          ],
        },
      },
      {
        kind: "flow",
        caption: "The five-membered syllogism",
        data: {
          title: "Inference for others",
          layout: "chain",
          nodes: [
            { id: "p", label: "Pratijna", detail: "The hill has fire." },
            { id: "h", label: "Hetu", detail: "Because it has smoke." },
            { id: "u", label: "Udaharana", detail: "Wherever smoke, there fire, as in a kitchen." },
            { id: "a", label: "Upanaya", detail: "This hill has such smoke." },
            { id: "n", label: "Nigamana", detail: "Therefore the hill has fire." },
          ],
        },
      },
    ],
    ref: "Foundations module 2.6; Matilal, Perception; Rao and Paranjpe ch on epistemology",
  },
  {
    id: "indp-l01-008",
    subject: S,
    topic: "indian-thought",
    marks: 10,
    difficulty: 4,
    exams: ["ugc-net", "ma-semester"],
    question: "Compare Indian and Western paradigms of knowledge. Explain avidya and vidya, para and apara vidya, and the primacy of self-knowledge.",
    plan: ["Indian answers to ontology, epistemology and methodology", "Contrast with Western academic psychology", "Avidya and vidya in the Isha Upanishad", "Para and apara vidya in the Mundaka Upanishad", "Primacy of self-knowledge and what research says", "Balanced conclusion"],
    answer: `## Indian answers to the paradigm questions
- Ontology: in Vedanta and Samkhya consciousness is fundamental, not a product of matter. Buddhism stresses impermanence and interdependence rather than a fixed substance.
- Epistemology: valid knowledge comes through pramanas such as perception and inference, but also through trained first-person insight, which is held to be reliable when the mind is disciplined and calm.
- Methodology: practices such as meditation, self-inquiry and ethical discipline are means of knowing. Knowledge is expected to transform the knower, not only inform.

## Contrast
| Point | Western academic psychology | Indian traditions |
| Reality | Physical world; mind arises from brain | Consciousness primary |
| Knower | Neutral observer, separate from object | Knower's state affects what can be known |
| Main method | Third-person observation, experiment | Also disciplined first-person practice |
| Aim | Explain, predict, control | Understand and transform the self |
| Validity | Public replication | Reliability of a trained mind, plus pramanas |

## Avidya and vidya
The Isha Upanishad speaks of both avidya and vidya and says one should know both. Here avidya is often read as worldly or lower knowledge and action in the world, and vidya as knowledge of the self. It warns that those who pursue only one fall into darkness. Elsewhere, especially in Advaita, avidya means the basic ignorance of mistaking the changing for the permanent self, the same term Patanjali uses for the first klesha.

## Para and apara vidya
The Mundaka Upanishad distinguishes apara vidya, lower knowledge, which includes the sciences, grammar, astronomy and even the Vedas as texts, from para vidya, higher knowledge, by which the imperishable is known. In this frame science is valuable apara vidya and spiritual self-knowledge is para vidya; they are different, not enemies.

## The primacy of self-knowledge
Classical thought treats self-knowledge, atmanam viddhi, and Ramana Maharshi's question "Who am I?", as the highest aim. This raises research questions:
- How accurately can people know their minds? Western studies of confabulation suggest less well than they think.
- Can training improve self-knowledge? Contemplative research is testing whether meditators report mind-wandering and bodily states more accurately.
- Neurophenomenology, proposed by Francisco Varela, combines trained first-person reports with brain measures.

## Conclusion
The Indian paradigm adds consciousness as a central topic and first-person discipline as a method. Its claims need careful testing, but the distinction between apara and para vidya offers a way for science and spirituality to coexist: each is knowledge of a different kind.`,
    keyPoints: ["Indian ontology, epistemology, methodology", "Comparison table with Western psychology", "Isha Upanishad on avidya and vidya", "Two senses of avidya", "Mundaka Upanishad on para and apara vidya", "Primacy of self-knowledge with research questions", "Balanced conclusion"],
    pitfalls: ["Mixing up the Isha and Mundaka sources", "Claiming Indian knowledge is superior because it is older"],
    module: "foundations/3-4",
    visuals: [
      {
        kind: "compare",
        caption: "Para and apara vidya",
        data: {
          title: "Two kinds of knowledge",
          a: { label: "Apara vidya", points: ["Lower knowledge", "Sciences, grammar, texts", "Public and cumulative"], summary: "Where science belongs." },
          b: { label: "Para vidya", points: ["Higher knowledge", "Knowledge of the imperishable self", "Transforms the knower"], summary: "The goal of self-inquiry." },
        },
      },
    ],
    ref: "Foundations module 3.4 and 3.5; Isha Upanishad 9 to 11; Mundaka Upanishad 1.1.4 to 5; Varela 1996",
  },
  {
    id: "indp-l01-009",
    subject: S,
    topic: "consciousness",
    marks: 20,
    difficulty: 4,
    exams: ["ugc-net", "ma-semester"],
    question: "Critically discuss the nature of consciousness in Indian psychology, comparing it with modern scientific approaches.",
    plan: ["Why consciousness is central in Indian thought", "Vedanta: atman, witness, four states", "Samkhya and Yoga: purusha and the mind as matter", "Buddhism: consciousness as process, no fixed self", "Modern science: neural correlates, theories, the hard problem", "Points of meeting, critique and conclusion"],
    answer: `## Introduction
In Western academic psychology consciousness was banished by behaviourism, revived by cognitive science and is now studied mainly as a product of brain activity. In Indian thought consciousness is the central topic. The traditions differ among themselves, but all treat the careful study of awareness, including first-person training, as the core of a science of mind.

## Vedanta
- Consciousness, the atman, is the self: pure, unchanging awareness that is never an object.
- It is the witness, sakshi, of all mental states. Thoughts and feelings come and go; awareness of them does not.
- The Mandukya Upanishad describes waking, dreaming and deep sleep as states that consciousness passes through, and turiya as pure consciousness underlying them.
- Advaita holds that individual consciousness and Brahman are one; the sense of being a separate, limited self is due to avidya.
- The mind, the antahkarana, is an instrument: manas, buddhi, ahamkara and chitta process experience, but the light by which they are known is consciousness.

## Samkhya and Yoga
- Samkhya is dualist. Purusha is pure consciousness, the witness that does nothing and does not change. Prakriti is nature, including the body and also the mind: intellect, ego and the senses evolve from it.
- So in Samkhya the mind is part of matter. Thinking, feeling and ego are activities of prakriti; consciousness only illuminates them. Suffering comes from confusing the witness with what it witnesses.
- Patanjali's Yoga Sutras define yoga as the stilling of the fluctuations of the mind, so that the seer rests in its own nature. Practice moves through concentration, meditation and absorption, samadhi.
- This position resembles modern debates on the hard problem: cognitive functions can be explained mechanically, but why there is subjective experience at all remains puzzling.

## Buddhism
- Buddhism denies a permanent self. A person is five changing aggregates: form, feeling, perception, mental formations and consciousness.
- Consciousness, vijnana, is a stream of momentary events arising in dependence on conditions, not a substance. The Abhidhamma analyses it into moments and mental factors.
- The Yogacara school described a storehouse consciousness holding the seeds of habits, an early idea of unconscious processes.
- Meditation trains attention and insight into impermanence and no-self.

## Modern scientific approaches
- Neural correlates of consciousness: researchers compare conscious and unconscious processing, for example in masking or binocular rivalry, and study disorders such as blindsight and the vegetative state.
- Theories include the global workspace theory, where information becomes conscious when it is broadcast widely across the brain, and integrated information theory, which links consciousness to how much a system integrates information. Predictive processing sees experience as the brain's best guess about the causes of its input.
- Sleep research maps waking, REM and non-REM stages with EEG.
- The hard problem, as David Chalmers put it, asks why any physical process is accompanied by experience; many scientists think it will dissolve as mechanisms are explained, others doubt it.

## Comparison
| Point | Indian traditions | Modern science |
| Status of consciousness | Fundamental, or a stream in Buddhism | Product of brain activity, on most views |
| Mind and consciousness | Distinct: mind is instrument or matter | Usually not distinguished |
| States | Waking, dreaming, sleep, turiya, samadhi | Waking, REM, non-REM, altered states |
| Method | Trained first-person practice | Third-person measures, reports, imaging |
| Aim | Liberation, transformation | Explanation |

## Points of meeting
- Meditation research shows changes in attention, emotion regulation and brain networks such as reduced default mode activity during practice, and long-term practitioners describe states of awareness with little content, now studied as minimal phenomenal experience.
- The witness idea resembles metacognitive awareness and the observing self in mindfulness-based therapies, which help people relate to thoughts as events.
- Neurophenomenology combines trained first-person description with neural measures, giving the Indian emphasis on disciplined introspection a research role.
- The Samkhya distinction between mind and consciousness echoes the modern separation of cognitive functions from phenomenal experience.

## Critique
- Indian claims about pure consciousness, turiya and liberation are metaphysical and cannot be confirmed by experiment; science can study reports and correlates, not the nature of consciousness itself.
- First-person reports, even from trained meditators, can be shaped by doctrine and expectation.
- The traditions disagree with each other, so there is no single Indian theory of consciousness.
- Modern science, for its part, has no agreed theory, and its reliance on third-person data may leave out the very thing it studies.
- An inclusive Indian psychology should add Jain, Sufi and other perspectives, and avoid presenting Sanskrit sources as the whole.

## Conclusion
Indian psychology treats consciousness as primary and offers detailed maps of its states and disciplined methods for observing it. Modern science offers measurement and mechanism. Neither alone answers the question of consciousness. The most productive path combines third-person rigour with trained first-person inquiry, which is where contemplative neuroscience now stands.`,
    keyPoints: ["Consciousness as central in Indian thought", "Vedanta: witness, four states, mind as instrument", "Samkhya: purusha and prakriti, mind as matter", "Buddhism: no fixed self, stream of consciousness, storehouse consciousness", "Modern theories: neural correlates, global workspace, integrated information, hard problem", "Comparison table", "Meeting points: meditation research, neurophenomenology", "Critique on both sides"],
    pitfalls: ["Presenting only one Indian school as the Indian view", "Ignoring modern theories", "Ending without a balanced judgement"],
    module: "foundations/2-4",
    visuals: [
      {
        kind: "compare",
        caption: "Samkhya and Yoga",
        data: {
          title: "Purusha and prakriti",
          a: { label: "Purusha", points: ["Pure consciousness", "Witness, does not act", "Unchanging"], summary: "What knows." },
          b: { label: "Prakriti", points: ["Nature made of three gunas", "Includes body and mind", "Ever changing"], summary: "What is known, including thoughts." },
        },
      },
      {
        kind: "layers",
        caption: "Comparison",
        data: {
          title: "States of consciousness in Vedanta",
          shape: "stack",
          layers: [
            { label: "Turiya", detail: "Pure witness consciousness." },
            { label: "Sushupti", detail: "Deep sleep, closest to N3." },
            { label: "Svapna", detail: "Dreaming, closest to REM." },
            { label: "Jagrat", detail: "Waking awareness." },
          ],
        },
      },
    ],
    ref: "Foundations module 2.3 to 2.5 and 3.5; Rao, Consciousness Studies: Cross-cultural Perspectives; Chalmers 1995; Dehaene on global workspace; Tononi on integrated information",
  },
  {
    id: "indp-l01-010",
    subject: S,
    topic: "purushartha",
    marks: 5,
    difficulty: 3,
    exams: ["ugc-net", "ma-semester"],
    question: "Write a short note on the purusharthas and the ashramas as an Indian model of life goals and development.",
    plan: ["The four purusharthas", "The four ashramas", "Comparison with Erikson", "Critical note"],
    answer: `## The purusharthas
The purusharthas are the four aims of human life in classical Hindu thought:
1. Dharma: right conduct, duty and moral order.
2. Artha: wealth, livelihood and material security.
3. Kama: pleasure, love and aesthetic enjoyment.
4. Moksha: liberation from the cycle of suffering.
Artha and kama are legitimate when pursued within dharma; moksha is the final aim. The model treats a good life as a balance of goals rather than a single one.

## The ashramas
The ashramas are four idealised stages of life, traditionally pictured as about 25 years each:
| Ashrama | Stage | Main task |
| Brahmacharya | Student | Learning and self-discipline |
| Grihastha | Householder | Family, work, supporting society |
| Vanaprastha | Forest dweller | Gradual withdrawal, guiding the young |
| Sannyasa | Renunciate | Detachment and spiritual pursuit |

## Comparison with Erikson
Erikson's eight stages also treat life as a sequence of tasks. Grihastha resembles generativity, caring for the next generation; vanaprastha and sannyasa resemble integrity, making peace with one's life. The difference is that the ashramas end in detachment and spiritual aims, while Erikson's stages centre on identity and the ego.

## Critical note
The scheme described an ideal for upper-caste men and did not reflect the lives of women or most castes. Modern Indian life rarely follows it, though many older adults still speak of handing over responsibilities to children in a spirit like vanaprastha.`,
    keyPoints: ["Four purusharthas with meanings", "Dharma as frame for artha and kama", "Four ashramas and their tasks", "Comparison with Erikson's generativity and integrity", "Spiritual end point", "Caste and gender critique"],
    pitfalls: ["Confusing purusharthas with ashramas", "Presenting the scheme as how all Indians lived"],
    module: "lifespan/3-2",
    visuals: [
      {
        kind: "timeline",
        caption: "The ashramas",
        data: {
          prompt: "Put the ashramas in their traditional order.",
          events: [
            { label: "Brahmacharya: the student" },
            { label: "Grihastha: the householder" },
            { label: "Vanaprastha: the forest dweller" },
            { label: "Sannyasa: the renunciate" },
          ],
          why: "Life moves from learning, to responsibility, to gradual withdrawal and finally detachment.",
        },
      },
    ],
    ref: "Lifespan module 3.2; Kakar, The Inner World; Manusmriti on ashramas via secondary sources",
  },
];
