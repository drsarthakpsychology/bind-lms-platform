import type { LongQA } from "@/lib/prep/long-types";

const S = "indian-psychology" as const;

export const INDIAN_PSYCHOLOGY_L02: LongQA[] = [
  {
    id: "indp-l02-001",
    subject: S,
    topic: "samkhya",
    marks: 10,
    difficulty: 2,
    exams: ["ugc-net", "ma-semester"],
    question: "Explain the Samkhya view of purusha and prakriti and its psychological significance.",
    plan: ["Introduce Samkhya and its texts", "Purusha and prakriti", "The evolutes and the 25 tattvas", "Three kinds of suffering and liberation through viveka", "Psychological significance", "Critique"],
    answer: `## Samkhya
Samkhya, traditionally founded by the sage Kapila, is one of the oldest systematic philosophies of India. Its oldest surviving text is Ishvarakrishna's Samkhya Karika. It gives Yoga its theory, and the two are counted as a pair among the six darshanas.

## Two realities
- Purusha is pure consciousness: the witness that does not act and does not change. There are many purushas, one for each being.
- Prakriti is nature or matter. It includes the body and, strikingly, the mind. It is made of the three gunas: sattva, rajas and tamas. While the gunas are in balance, prakriti is unmanifest; when the balance is disturbed in the presence of purusha, the world evolves.

## The evolutes
From prakriti evolve, in order:
- Mahat or buddhi, the intellect, the first product.
- Ahamkara, the sense of I and mine.
- From ahamkara, manas, the mind; the five senses of knowledge; the five organs of action; and the five subtle elements.
- From the subtle elements, the five gross elements: space, air, fire, water and earth.
With prakriti and purusha this gives 25 tattvas, or principles.

## Suffering and liberation
Samkhya names three kinds of suffering: adhyatmika, from within, such as illness and grief; adhibhautika, from other beings; and adhidaivika, from nature or fate. Suffering arises because purusha is confused with the activities of prakriti: "I am angry" instead of "anger is happening and I am aware of it". Liberation, kaivalya or aloneness, comes through viveka, discriminating knowledge of the difference between the seer and the seen.

## Psychological significance
- Mind as process: thoughts, feelings and ego are natural processes, open to study, much like modern cognitive science.
- Consciousness as distinct: the gap between mental functions and awareness echoes the modern hard problem.
- Disidentification: the move from "I am my thoughts" to observing them is the same move that cognitive defusion and mindfulness use in therapy.
- Personality: the three gunas provide a model of temperament later used in the Gita and in modern guna inventories.
- Classification of suffering anticipates a biopsychosocial view of distress.

## Critique
Purusha cannot be observed, so its existence is a metaphysical claim. The dualism also faces the old problem of how two different realities interact. Its psychological value lies in its analysis of mind and in the practices of Yoga built on it.`,
    keyPoints: ["Kapila and the Samkhya Karika", "Purusha as witness, prakriti including mind", "Gunas and the disturbance of balance", "Order of evolutes and 25 tattvas", "Three kinds of suffering", "Liberation through viveka", "Links to defusion and the hard problem"],
    pitfalls: ["Putting the mind in purusha", "Getting the number of tattvas wrong"],
    module: "foundations/2-4",
    visuals: [
      {
        kind: "flow",
        caption: "The evolutes",
        data: {
          title: "How the world unfolds from prakriti",
          layout: "tree",
          nodes: [
            { id: "pr", label: "Prakriti", detail: "Nature made of the three gunas." },
            { id: "ma", label: "Mahat or buddhi", parent: "pr", detail: "Intellect, the first product." },
            { id: "ah", label: "Ahamkara", parent: "ma", detail: "I-sense." },
            { id: "mn", label: "Manas and ten senses", parent: "ah", detail: "Mind, five senses of knowledge, five organs of action." },
            { id: "tm", label: "Five subtle elements", parent: "ah", detail: "Subtle sound, touch, form, taste, smell." },
            { id: "gr", label: "Five gross elements", parent: "tm", detail: "Space, air, fire, water, earth." },
          ],
        },
      },
    ],
    ref: "Foundations module 2.4; Samkhya Karika; Larson, Classical Samkhya",
  },
  {
    id: "indp-l02-002",
    subject: S,
    topic: "triguna",
    marks: 10,
    difficulty: 2,
    exams: ["ugc-net", "ma-semester", "cuet-pg"],
    question: "Describe the triguna theory of personality and discuss attempts to measure the gunas.",
    plan: ["Source of the theory", "Sattva, rajas, tamas with behavioural markers", "Dynamics: all three always present", "Measurement and findings", "Relation to Western traits", "Evaluation"],
    answer: `## Source
The theory of the three gunas comes from Samkhya, which holds that all of prakriti, including the mind, is made of three qualities. The Bhagavad Gita applies them to food, faith, knowledge, action, happiness and character, especially in Chapters 14, 17 and 18. Ayurveda uses a related idea of mental temperament.

## The three gunas
| Guna | Core quality | Typical behaviour |
| Sattva | Clarity, balance, light | Calm, truthful, content, wishes to understand, self-controlled |
| Rajas | Activity, passion, movement | Ambitious, restless, driven, attached to results, quick to anger |
| Tamas | Inertia, heaviness, darkness | Dull, lazy, confused, prone to oversleeping and denial |

## Dynamics
- All three are always present; what differs between people and over time is their balance.
- The balance changes with food, habits, company and practice. The Gita describes sattvic, rajasic and tamasic food, faith and work.
- Rajas is not simply bad: it drives all action. Some tamas is needed for rest and sleep.
- The aim is to cultivate sattva and finally go beyond all three, a state the Gita calls gunatita.

## Measurement
- The Vedic Personality Inventory, introduced by David Wolf in 1998, has 56 items with three subscales and acceptable internal consistency.
- Several Indian guna inventories have been developed, including scales used in yoga research centres, and they report acceptable reliability.
- Findings: sattva tends to correlate with wellbeing, conscientiousness and agreeableness; rajas with extraversion and some facets of neuroticism; tamas with neuroticism, low conscientiousness and poorer mental health.
- Some yoga studies report that practice raises sattva scores and lowers tamas scores, though designs are often weak.

## Relation to Western traits
| Guna | Closest Big Five pattern |
| Sattva | High conscientiousness and agreeableness, low neuroticism |
| Rajas | High extraversion, some neuroticism |
| Tamas | High neuroticism, low conscientiousness and openness |
The overlap is moderate, so the gunas are not simply the Big Five in other words; they include moral and spiritual qualities that trait models leave out.

## Evaluation
The triguna model is one of the most testable Indian concepts and gives a culturally familiar language for counselling. Its problems are uneven factor structures across samples, the moral loading of the categories, which invites socially desirable answers, and the need to show incremental validity beyond the Big Five. The gunas must not be confused with the Ayurvedic doshas, vata, pitta and kapha.`,
    keyPoints: ["Samkhya and Gita sources", "Accurate description of the three gunas", "All three always present; balance shifts", "Rajas and tamas not simply bad", "Vedic Personality Inventory and Indian scales", "Correlations with Big Five", "Evaluation and the guna versus dosha trap"],
    pitfalls: ["Calling gunas good, average and bad", "Confusing gunas with doshas", "No mention of measurement"],
    module: "foundations/1-4",
    visuals: [
      {
        kind: "sort",
        caption: "The three gunas",
        data: {
          prompt: "Sattva, rajas or tamas?",
          buckets: ["Sattva", "Rajas", "Tamas"],
          items: [
            { text: "A calm, clear mind that sees a problem as it is", bucket: 0 },
            { text: "Restless ambition that cannot sit still", bucket: 1 },
            { text: "Sleeping till noon, unwilling to start anything", bucket: 2 },
            { text: "Anger and craving that push you to act at once", bucket: 1 },
            { text: "Contentment and kindness", bucket: 0 },
          ],
        },
      },
    ],
    ref: "Foundations module 1.4 and 2.4 clinician note; Wolf 1998 Vedic Personality Inventory; Bhagavad Gita ch 14, 17, 18",
  },
  {
    id: "indp-l02-003",
    subject: S,
    topic: "yoga",
    marks: 15,
    difficulty: 3,
    exams: ["ugc-net", "ma-semester"],
    question: "Discuss the psychology of Patanjali's Yoga Sutras with reference to chitta, the vrittis, the kleshas and the means to control the mind.",
    plan: ["Text and definition of yoga", "Chitta and the five vrittis", "Five kleshas as roots of distress", "Abhyasa, vairagya and the eight limbs", "States of mind and samskaras", "Modern parallels and critique"],
    answer: `## The text
The Yoga Sutras attributed to Patanjali are 196 short aphorisms in four chapters: samadhi, sadhana, vibhuti and kaivalya. Their date is uncertain, often placed between the second century BCE and the fourth century CE. They rest on Samkhya's distinction between purusha, consciousness, and prakriti, nature including the mind. Sutra 1.2 defines yoga as "yogas chitta vritti nirodhah": yoga is the stilling of the fluctuations of the mind. When this happens, the seer rests in its own nature.

## Chitta and the vrittis
Chitta is the mind-field, the whole of mental activity. Its fluctuations, vrittis, are of five kinds, each either painful or not painful:
1. Pramana: correct knowledge through perception, inference or testimony.
2. Viparyaya: error, as when a rope is seen as a snake.
3. Vikalpa: verbal construction with no real object behind it.
4. Nidra: sleep, itself counted as a fluctuation.
5. Smriti: memory, the return of past impressions.

## The kleshas
Sutra 2.3 names five afflictions as the roots of suffering:
| Klesha | Meaning | Modern echo |
| Avidya | Ignorance: mistaking the impermanent and non-self for the permanent self | Core cognitive error |
| Asmita | I-am-ness: identifying with mind and body | Over-identification with self-concept |
| Raga | Attachment to pleasure | Craving, approach |
| Dvesha | Aversion to pain | Avoidance |
| Abhinivesha | Clinging to life, fear of death | Existential anxiety |
Avidya is the field in which the others grow. Kleshas may be dormant, weak, interrupted or fully active.

## Samskaras and states of mind
Every action and experience leaves a samskara, an impression, in chitta. Repeated impressions become vasanas, tendencies that drive future action, a cycle close to habit formation. The classical commentary by Vyasa describes five states, bhumis, of mind: kshipta, restless and scattered; mudha, dull; vikshipta, distracted with moments of focus; ekagra, one-pointed; and niruddha, fully restrained. Yoga moves the mind from the first three towards the last two.

## The means
- Abhyasa and vairagya: sutra 1.12 says the fluctuations are stilled by steady practice and non-attachment. Practice must be long, uninterrupted and done with devotion.
- Kriya yoga: tapas, discipline; svadhyaya, self-study; and ishvara pranidhana, surrender to the divine, which weaken the kleshas.
- Pratipaksha bhavana: when disturbing thoughts arise, cultivate their opposite, an early form of cognitive restructuring.
- The eight limbs: yama, niyama, asana, pranayama, pratyahara, dharana, dhyana and samadhi, the last three together called samyama.

## Modern parallels
- Viparyaya resembles cognitive distortion; raga and dvesha resemble the approach and avoidance motives in behavioural theory; avoidance maintaining fear is a central idea in anxiety treatment.
- The bhumis map onto attention research on mind-wandering versus sustained focus.
- Samskaras resemble learning and habit, and the idea that repetition strengthens tendencies fits modern work on neural plasticity.
- Observing vrittis without identifying with them parallels mindfulness and cognitive defusion.

## A clinical illustration
A young man in Surat with social anxiety avoids speaking in meetings. In yoga terms, dvesha towards the pain of embarrassment drives avoidance, asmita fuses his worth with others' approval, and viparyaya supplies the error that everyone is judging him. Practice of pratyahara and dharana trains him to keep attention on the task rather than on imagined judges, while pratipaksha bhavana replaces "they think I am stupid" with a kinder, more accurate thought. The parallel with CBT for social anxiety is close.

## Critique
The Sutras aim at liberation, not therapy, and their goal of total stilling is not a clinical aim. Some sections describe supernatural powers, siddhis, that cannot be tested. Modern yoga as exercise often uses little of the psychological content. Research on yoga's mental effects is growing but many trials are small and at risk of bias.

## Conclusion
The Yoga Sutras offer a detailed psychology of attention, error, craving, aversion and habit, with a graded method for training the mind. Their concepts translate well into modern cognitive and behavioural terms, which is why yoga and meditation now appear in clinical research worldwide.`,
    keyPoints: ["Text structure and sutra 1.2 definition", "Five vrittis with examples", "Five kleshas with modern echoes", "Samskaras and vasanas", "Five bhumis", "Abhyasa, vairagya, kriya yoga and pratipaksha bhavana", "Modern parallels and critique"],
    pitfalls: ["Listing the eight limbs only", "Confusing vrittis and kleshas"],
    module: "foundations/2-4",
    visuals: [
      {
        kind: "sort",
        caption: "Chitta and the vrittis",
        data: {
          prompt: "Which of the five vrittis is each?",
          buckets: ["Pramana", "Viparyaya", "Vikalpa", "Nidra", "Smriti"],
          items: [
            { text: "Seeing smoke and correctly inferring fire", bucket: 0 },
            { text: "Seeing a rope at dusk as a snake", bucket: 1 },
            { text: "Thinking of the horns of a hare", bucket: 2 },
            { text: "Deep dreamless sleep", bucket: 3 },
            { text: "Recalling your grandmother's kitchen", bucket: 4 },
          ],
        },
      },
      {
        kind: "flow",
        caption: "Samskaras and states of mind",
        data: {
          title: "How habits of mind form",
          layout: "cycle",
          nodes: [
            { id: "a", label: "Action or experience", detail: "Acting on a craving." },
            { id: "s", label: "Samskara", detail: "An impression left in chitta." },
            { id: "v", label: "Vasana", detail: "Repeated impressions become a tendency." },
            { id: "u", label: "Urge", detail: "The tendency prompts the next action." },
          ],
        },
      },
    ],
    ref: "Foundations module 2.4; Yoga Sutras 1.2, 1.5 to 1.12, 2.1 to 2.11, 2.33; Vyasa's commentary; Taimni, The Science of Yoga",
  },
  {
    id: "indp-l02-004",
    subject: S,
    topic: "ashtanga",
    marks: 5,
    difficulty: 2,
    exams: ["ugc-net", "ma-semester", "cuet-pg"],
    question: "Write a short note on the eight limbs of yoga.",
    plan: ["Source", "The eight limbs in order", "Outer and inner limbs, samyama", "Psychological sense"],
    answer: `## Source
Patanjali's Yoga Sutras describe ashtanga, the eight limbs, in the second and third chapters as a graded path from conduct to absorption.

## The eight limbs
| Limb | Meaning |
| Yama | Restraints: non-violence, truthfulness, non-stealing, moderation, non-possessiveness |
| Niyama | Observances: purity, contentment, discipline, self-study, surrender to the divine |
| Asana | A steady, comfortable posture |
| Pranayama | Regulation of breath |
| Pratyahara | Withdrawal of the senses from their objects |
| Dharana | Concentration on one point |
| Dhyana | Meditation: an unbroken flow of attention |
| Samadhi | Absorption, where the sense of separate meditator fades |

## Outer and inner
The first five are the outer limbs, preparing body, breath and senses. Pratyahara is the bridge between outer and inner. The last three, dharana, dhyana and samadhi, together form samyama, the inner practice.

## Psychological sense
- Ethics comes first: a mind full of conflict and guilt cannot be still.
- Posture and breath calm arousal; slow breathing is now known to shift autonomic balance towards the parasympathetic system.
- Pratyahara resembles controlling attention away from distracting cues.
- Dharana and dhyana train sustained attention, the skill measured in attention tasks.
A memory aid: Your New Aunt Prefers Peaceful Days Doing Sudoku.`,
    keyPoints: ["Source in the Yoga Sutras", "All eight in the correct order", "Contents of yama and niyama", "Pratyahara as bridge", "Samyama as the last three", "Psychological interpretation"],
    pitfalls: ["Reducing yoga to asana", "Mixing the order of dharana and dhyana"],
    module: "foundations/2-4",
    visuals: [
      {
        kind: "layers",
        caption: "The eight limbs",
        data: {
          title: "From outer to inner",
          shape: "stack",
          layers: [
            { label: "Samadhi", detail: "Absorption." },
            { label: "Dhyana", detail: "Unbroken flow of attention." },
            { label: "Dharana", detail: "Concentration on one point." },
            { label: "Pratyahara", detail: "Withdrawing the senses." },
            { label: "Pranayama", detail: "Regulating the breath." },
            { label: "Asana", detail: "Steady posture." },
            { label: "Niyama", detail: "Observances." },
            { label: "Yama", detail: "Ethical restraints." },
          ],
        },
      },
    ],
    ref: "Foundations module 2.4; Yoga Sutras 2.29 to 3.4",
  },
  {
    id: "indp-l02-005",
    subject: S,
    topic: "kleshas",
    marks: 5,
    difficulty: 2,
    exams: ["ugc-net", "ma-semester"],
    question: "Explain the five kleshas of the Yoga Sutras and relate them to modern clinical ideas.",
    plan: ["Define klesha", "The five with meanings", "Clinical parallels", "States of the kleshas and how they are reduced"],
    answer: `## Meaning
A klesha is an affliction or poison of the mind. Sutra 2.3 names five as the roots of all suffering, and sutra 2.4 says that avidya, ignorance, is the field from which the other four grow.

## The five kleshas
1. Avidya: mistaking the impermanent for the permanent, the impure for the pure, pain for pleasure and the non-self for the self.
2. Asmita: I-am-ness, identifying the seer with the instruments of seeing, the mind and body.
3. Raga: attachment that follows pleasure.
4. Dvesha: aversion that follows pain.
5. Abhinivesha: clinging to life and fear of death, present even in the wise.

## Clinical parallels
| Klesha | Clinical idea | Example |
| Avidya | Core distorted beliefs | "Things must never change" |
| Asmita | Fusion with self-concept | "If I fail this exam, I am nothing" |
| Raga | Craving and reward seeking | Checking social media for likes, substance use |
| Dvesha | Avoidance maintaining fear | Avoiding the dentist for years |
| Abhinivesha | Death anxiety, health anxiety | Fear of death blocking enjoyment of life |

## States and remedies
Kleshas may be dormant, weak, interrupted or fully active. Gross kleshas are reduced through meditation; subtle ones through returning the mind to its source. The modern parallel is that avoidance and craving are weakened by exposure, by mindful observation and by changing beliefs, which is why yoga psychology and CBT can sit side by side.`,
    keyPoints: ["Definition and sutra 2.3", "Avidya as the field of the others", "All five with meanings", "Clinical parallels table", "Four states of the kleshas", "Remedies through meditation"],
    pitfalls: ["Leaving out abhinivesha", "Confusing raga and dvesha"],
    module: "foundations/2-4",
    visuals: [
      {
        kind: "sort",
        caption: "Clinical parallels",
        data: {
          prompt: "Which klesha is at work?",
          buckets: ["Raga", "Dvesha", "Asmita", "Abhinivesha"],
          items: [
            { text: "Checking Instagram again and again for likes", bucket: 0 },
            { text: "Avoiding the dentist because of past pain", bucket: 1 },
            { text: "If I fail this exam, I am nothing", bucket: 2 },
            { text: "Intense fear of death that blocks enjoyment", bucket: 3 },
          ],
        },
      },
    ],
    ref: "Foundations module 2.4; Yoga Sutras 2.3 to 2.11",
  },
  {
    id: "indp-l02-006",
    subject: S,
    topic: "yoga-therapy",
    marks: 20,
    difficulty: 4,
    exams: ["ugc-net", "ma-semester"],
    question: "Critically evaluate yoga as a psychological intervention. Discuss its theoretical basis, proposed mechanisms, Indian programmes and the evidence for its use in mental health.",
    plan: ["Define yoga as intervention and its components", "Theoretical basis in Yoga psychology and the koshas", "Proposed mechanisms: physiological and psychological", "Indian programmes and policy", "Evidence by condition, with quality", "Risks, critique and conclusion"],
    answer: `## Introduction
Yoga began as a discipline for liberation, but in the last century it has become a widely used health practice. As a psychological intervention it usually combines postures, breathing, relaxation and meditation, sometimes with ethical teaching and chanting. Evaluating it requires separating the tradition's goals from the clinical question: does it reduce distress or disorder, for whom, and how?

## Theoretical basis
- Patanjali's psychology locates suffering in the kleshas and the restless fluctuations of mind, and offers a graded method from conduct to concentration.
- The Taittiriya Upanishad's five koshas give a layered model of the person, which Indian programmes use to plan practice at the bodily, vital, mental, intellectual and blissful levels.
- The Gita's karma yoga adds non-attachment to outcomes as a stance towards stress.

## Proposed mechanisms
- Autonomic regulation: slow breathing and relaxation shift balance towards the parasympathetic system and raise heart rate variability.
- Stress physiology: some studies report lower cortisol after practice.
- Attention and interoception: meditation trains attention and awareness of bodily signals, which may help emotion regulation.
- Cognitive and behavioural change: observing thoughts without reacting, reduced rumination, and behavioural activation through regular practice.
- Social and meaning factors: group classes, a teacher and a cultural frame of meaning, which act as common factors of change.
- Physical activity: exercise itself lifts mood, so yoga's effects must be separated from those of general exercise.

## Indian programmes and policy
- S-VYASA near Bengaluru developed the Integrated Approach to Yoga Therapy, based on the five koshas, and has run many trials.
- NIMHANS in Bengaluru has an integrated centre for yoga and has tested yoga as an add-on treatment. Its trials in schizophrenia reported improvement in negative symptoms and social functioning when yoga was added to medication.
- The Ministry of AYUSH promotes yoga, and since the United Nations declared it in 2014, 21 June is observed as the International Day of Yoga.
- Yoga is taught in schools, workplaces and prisons, and is part of wellness centres under the Ayushman Bharat programme.

## Evidence by condition
| Condition | What reviews broadly show | Quality |
| Depression | Small to moderate reductions in symptoms, mainly short term and as an add-on | Many trials small, high risk of bias |
| Anxiety | Modest benefit, similar to other active relaxation methods | Mixed, few long follow-ups |
| Stress in healthy people | Consistent improvements in self-reported stress and wellbeing | Moderate, blinding impossible |
| Schizophrenia as add-on | Improvement in negative symptoms and quality of life in Indian trials | Promising, needs replication |
| PTSD | Some benefit as add-on | Small samples |
| Sleep problems | Improved sleep quality in several trials | Moderate |
Comparison matters: yoga often beats no treatment but performs about as well as exercise or other relaxation methods.

## Critical evaluation
- Methodological problems: small samples, no blinding, waiting-list controls, short follow-up, and allegiance bias when trials are run by yoga institutions.
- Publication bias in favour of positive findings, a common problem in this field.
- Heterogeneity: yoga in one trial may be vigorous postures and in another chanting and meditation, so results do not add up neatly.
- Mechanisms are often measured in the laboratory but rarely shown to explain clinical change.
- Safety: yoga is generally safe, but injuries occur with vigorous postures, some breathing practices can trigger panic or dizziness, and intensive meditation can occasionally worsen psychosis or trauma symptoms.
- Ethical and cultural concerns: claims that yoga cures depression or can replace medicine are false and can harm. Promotion can carry religious or nationalist meanings that some clients reject, so yoga should be offered as an option, not imposed.
- Fit with evidence-based care: guidelines generally see yoga as a complementary option for mild to moderate symptoms or as an add-on, not a replacement for established treatment of moderate to severe disorders.

## A clinical example
A 28-year-old software engineer in Pune with moderate generalised anxiety joins a twelve-week yoga programme alongside CBT. A sound plan sets measurable goals, uses a validated anxiety scale before and after, keeps medication decisions with the psychiatrist, and adjusts breathing practices if they raise panic.

## Conclusion
Yoga has a coherent psychological theory and plausible mechanisms, and evidence supports modest benefits for stress, anxiety and depression, especially as an add-on. The quality of evidence is the main weakness. The way forward is larger, independent, actively controlled trials with long follow-up, which India, with its expertise and institutions, is well placed to run.`,
    keyPoints: ["Defines yoga as an intervention and its components", "Theory from Patanjali, koshas and the Gita", "Physiological and psychological mechanisms with exercise as confound", "Indian programmes: S-VYASA, NIMHANS, AYUSH, Day of Yoga", "Evidence table by condition with quality", "Methodological critique and allegiance bias", "Safety and ethical concerns", "Balanced conclusion: add-on, not replacement"],
    pitfalls: ["Claiming yoga cures disorders", "Dismissing all evidence", "Not separating yoga from exercise effects"],
    module: "foundations/3-5",
    visuals: [
      {
        kind: "decide",
        caption: "Critical evaluation",
        data: {
          scene: "A yoga teacher tells a client with panic disorder that the eight limbs will cure him and that he should stop his medicine. The client asks you, a trainee, what you think.",
          ask: "What is the most responsible response?",
          choices: [
            { label: "Agree: yoga is ancient and safer than medicine", verdict: "harm", outcome: "He stops medicine abruptly and has a severe episode.", why: "Tradition is not evidence, and stopping medicine suddenly can harm." },
            { label: "Say yoga breathing and relaxation can help and can be added, but medicine changes belong with his psychiatrist", verdict: "best", outcome: "He adds daily practice and later tapers with his doctor.", why: "Evidence supports yoga as an add-on; medical decisions stay with the prescriber." },
            { label: "Tell him yoga is unscientific and useless", verdict: "ok", outcome: "He feels dismissed and stops trusting you.", why: "Inaccurate; there is reasonable add-on evidence." },
          ],
        },
      },
      {
        kind: "layers",
        caption: "Theoretical basis",
        data: {
          title: "Planning yoga therapy across the koshas",
          shape: "rings",
          layers: [
            { label: "Anandamaya", detail: "Service, joy, devotional practice." },
            { label: "Vijnanamaya", detail: "Counselling and self-study." },
            { label: "Manomaya", detail: "Relaxation and chanting." },
            { label: "Pranamaya", detail: "Breathing practices." },
            { label: "Annamaya", detail: "Postures and diet." },
          ],
        },
      },
    ],
    ref: "Foundations module 2.4, 3.5 clinician notes; Varambally et al 2012 on yoga in schizophrenia; Cramer et al meta-analyses on yoga for depression and anxiety; UN General Assembly resolution 69/131",
  },
  {
    id: "indp-l02-007",
    subject: S,
    topic: "integral-yoga",
    marks: 10,
    difficulty: 3,
    exams: ["ugc-net", "ma-semester"],
    question: "Explain Sri Aurobindo's integral psychology and its relevance today.",
    plan: ["Life and context", "Evolution of consciousness", "Planes of the person and the psychic being", "Triple transformation", "Integral education", "Relevance and critique"],
    answer: `## Life and context
Sri Aurobindo, born in 1872, studied in England, worked in the Baroda state service and taught at Baroda College, in present-day Vadodara, before joining the freedom struggle. In 1910 he withdrew to Pondicherry, where, with the Mother, Mirra Alfassa, he developed Integral Yoga. He died in 1950.

## Evolution of consciousness
Aurobindo held that consciousness is involved in matter and evolves out of it: matter, then life, then mind, and beyond mind towards higher levels he called higher mind, illumined mind, intuition, overmind and supermind. Human beings are a transitional stage. Unlike traditions that seek escape from the world, Integral Yoga aims to transform the whole of human nature.

## Planes of the person
- The outer being has three parts: the physical, the vital, which holds life energy, desires and emotions, and the mental.
- Behind it lies an inner being, wider than surface awareness.
- Below waking awareness are the subconscient and the inconscient, holding habits and buried tendencies, an idea that parallels the unconscious.
- The psychic being is the evolving soul, a spark of the divine that grows across lives and can guide the person from within.

## The triple transformation
1. Psychic transformation: the psychic being comes forward and guides thought, feeling and action.
2. Spiritual transformation: opening to higher planes of consciousness.
3. Supramental transformation: the supermind transforms the whole nature, including the body.

## Integral education
Education should develop five aspects of the child: physical, vital, mental, psychic and spiritual. The Sri Aurobindo International Centre of Education in Pondicherry practises free progress learning, where children choose what and how to study with teacher guidance. Auroville, founded in 1968, was set up as an experiment in human unity.

## Relevance today
- A developmental model that extends beyond adulthood, similar to transpersonal theories of growth.
- A holistic framework for counselling that attends to body, emotion, mind and meaning.
- The Indian Psychology Institute in Pondicherry has developed his ideas into courses on consciousness and self-development.
- His view that inner work should change outer life fits modern ideas of growth through practice.

## Critique
His higher planes and the supermind are not empirically testable in standard ways; the system depends on the authority of his own experience; and evidence on integral education outcomes is limited. A good answer explains its value as a developmental and educational model while noting these limits.`,
    keyPoints: ["Baroda and Pondicherry context", "Evolution from matter to supermind", "Outer being, inner being, subconscient", "Psychic being", "Triple transformation in order", "Integral education and five aspects", "Relevance and testability critique"],
    pitfalls: ["Confusing the psychic being with psychic powers", "No critique"],
    module: "foundations/2-5",
    visuals: [
      {
        kind: "layers",
        caption: "Evolution of consciousness",
        data: {
          title: "Aurobindo's levels of consciousness",
          shape: "stack",
          layers: [
            { label: "Supermind", detail: "The goal of the supramental transformation." },
            { label: "Overmind, intuition, illumined and higher mind", detail: "Levels above ordinary thinking." },
            { label: "Mind", detail: "Ordinary thinking." },
            { label: "Vital", detail: "Life energy, desire, emotion." },
            { label: "Physical", detail: "Body and its habits." },
            { label: "Subconscient and inconscient", detail: "Below waking awareness." },
          ],
        },
      },
    ],
    ref: "Foundations module 2.5; Aurobindo, The Synthesis of Yoga and The Life Divine; Cornelissen, Indian Psychology Institute",
  },
  {
    id: "indp-l02-008",
    subject: S,
    topic: "buddhist",
    marks: 15,
    difficulty: 3,
    exams: ["ugc-net", "ma-semester"],
    question: "Discuss the psychology of Buddhism. How has it influenced modern clinical psychology?",
    plan: ["Buddhism as a psychology of suffering", "Four Noble Truths and the Eightfold Path", "Three marks, skandhas and no-self", "Dependent origination, mental factors and meditation", "Influence on modern therapy", "Critique and conclusion"],
    answer: `## Introduction
Siddhartha Gautama, the Buddha, taught in what is now Bihar and Uttar Pradesh around the fifth century BCE. His teaching is built on close observation of the mind and a practical method for ending suffering. Its analysis of thoughts, feelings and habits is so detailed that some scholars call it the first cognitive-behavioural system.

## The Four Noble Truths
The truths follow the logic of medicine:
| Truth | Medical parallel | Content |
| Dukkha | Diagnosis | Life involves suffering and dissatisfaction |
| Samudaya | Cause | Suffering arises from craving, tanha |
| Nirodha | Prognosis | Suffering can end; this is nirvana |
| Magga | Treatment | The Noble Eightfold Path |

The Eightfold Path falls into three groups: wisdom, panna, through right view and right intention; ethical conduct, sila, through right speech, action and livelihood; and mental discipline, samadhi, through right effort, right mindfulness and right concentration.

## The three marks and the self
- Anicca: everything is impermanent.
- Dukkha: what is impermanent cannot give lasting satisfaction.
- Anatta: there is no fixed, unchanging self.
The person is five changing aggregates, the skandhas: form, feeling, perception, mental formations and consciousness. Suffering is increased by clinging to a fixed idea of self.

## Dependent origination and mental factors
- Dependent origination describes twelve links by which ignorance leads through formations, consciousness, the senses, contact and feeling to craving, clinging, becoming and rebirth, and so to more suffering. The key step for practice is between feeling and craving: a pleasant or unpleasant feeling need not become wanting or rejecting.
- The Abhidhamma texts list 52 mental factors, cetasikas, such as attention, greed, hatred, mindfulness and compassion, an early taxonomy of mental states.
- The three poisons, greed, hatred and delusion, are countered by the four immeasurables: loving-kindness, compassion, sympathetic joy and equanimity.
- The Yogacara school described a storehouse consciousness, alaya-vijnana, holding the seeds of habits, an early concept of unconscious tendencies.

## Meditation
Samatha meditation develops calm and concentration; vipassana develops insight into impermanence, unsatisfactoriness and no-self. Mindfulness, sati, means remembering to attend to present experience.

## Influence on modern clinical psychology
- Mindfulness-based stress reduction, developed by Jon Kabat-Zinn in 1979, and mindfulness-based cognitive therapy, which reduces relapse in people with recurrent depression.
- Dialectical behaviour therapy, which uses mindfulness and radical acceptance drawn partly from Zen practice.
- Acceptance and commitment therapy, with defusion from thoughts and the observing self.
- Compassion-focused therapy and loving-kindness programmes.
- Contemplative neuroscience, encouraged by the Mind and Life dialogues with the Dalai Lama from 1987, studies how meditation changes attention and emotion.
- In India, ten-day Vipassana courses in S. N. Goenka's tradition were held in Tihar Jail in 1993 and 1994 under Kiran Bedi; early uncontrolled studies reported reduced hostility.

## Buddhism and CBT compared
| Buddhist idea | CBT parallel |
| Craving and aversion drive suffering | Avoidance and safety behaviours maintain distress |
| Thoughts are passing events, not self | Thoughts are hypotheses, not facts |
| Right effort: abandon unwholesome states, cultivate wholesome ones | Reduce unhelpful behaviours, build helpful ones |
| Daily practice and ethical conduct | Homework and behavioural experiments |
The main difference is the goal: CBT aims at symptom relief and functioning, Buddhism at the end of suffering through insight.

## Critique
- Secular mindfulness removes sati from its ethical frame, sila, which critics call McMindfulness: a stress tool for productivity rather than a path of transformation.
- Meditation is not always benign; some practitioners report anxiety, depersonalisation or re-experiencing trauma.
- Early prison and wellness studies were uncontrolled.
- Doctrines such as rebirth are not testable and are not needed for clinical use.

## Conclusion
Buddhist psychology offers a precise account of how craving, clinging and a fixed sense of self produce suffering, and a trained method of attention to undo it. More than any other Indian tradition, it has entered modern clinical practice, mainly through mindfulness.`,
    keyPoints: ["Four Noble Truths as a medical model", "Eightfold Path in three groups", "Three marks and five skandhas", "Dependent origination and the feeling to craving link", "Abhidhamma mental factors and storehouse consciousness", "Samatha and vipassana", "Influence: MBSR, MBCT, DBT, ACT, compassion therapies", "Critique including McMindfulness and adverse effects"],
    pitfalls: ["Calling Buddhism a theory of the atman", "Only describing doctrine without the clinical link"],
    module: "foundations/2-5",
    visuals: [
      {
        kind: "flow",
        caption: "The Four Noble Truths",
        data: {
          title: "The Four Noble Truths as a medical model",
          layout: "chain",
          nodes: [
            { id: "a", label: "Dukkha", detail: "The diagnosis: suffering." },
            { id: "b", label: "Samudaya", detail: "The cause: craving." },
            { id: "c", label: "Nirodha", detail: "The prognosis: it can end." },
            { id: "d", label: "Magga", detail: "The treatment: the Eightfold Path." },
          ],
        },
      },
      {
        kind: "flow",
        caption: "Dependent origination and mental factors",
        data: {
          title: "How suffering keeps itself going",
          layout: "cycle",
          nodes: [
            { id: "i", label: "Ignorance", detail: "Not seeing impermanence and no-self." },
            { id: "c", label: "Contact and feeling", detail: "Each contact felt as pleasant or unpleasant." },
            { id: "r", label: "Craving", detail: "Wanting more or less of it." },
            { id: "l", label: "Clinging and becoming", detail: "Identity built around craving." },
            { id: "s", label: "Suffering", detail: "Which feeds ignorance again." },
          ],
        },
      },
    ],
    ref: "Foundations module 2.5; Kabat-Zinn 1990; Segal, Williams and Teasdale, MBCT; Purser, McMindfulness; Kuyken et al 2016 meta-analysis",
  },
  {
    id: "indp-l02-009",
    subject: S,
    topic: "mindfulness",
    marks: 10,
    difficulty: 3,
    exams: ["ugc-net", "ma-semester", "mcp-entrance"],
    question: "Trace mindfulness from its Buddhist roots to modern therapies. What does the evidence show?",
    plan: ["Sati in Buddhism", "Secular definition", "Main programmes", "Proposed mechanisms", "Evidence and limits", "Indian note"],
    answer: `## Buddhist roots
In Pali the word sati means remembering: keeping attention on present experience. In the Buddha's teaching it is right mindfulness, the seventh step of the Eightfold Path, practised within an ethical life and aimed at insight into impermanence and no-self. The classical instructions describe four foundations of mindfulness: of the body, of feelings, of mind states and of mental objects.

## Secular definition
Jon Kabat-Zinn defined mindfulness as paying attention in a particular way: on purpose, in the present moment and non-judgementally. Psychologists describe two components: regulating attention to present experience, and an attitude of curiosity, openness and acceptance.

## Main programmes
| Programme | Developers | Use |
| Mindfulness-based stress reduction | Kabat-Zinn in 1979 at the University of Massachusetts | Stress, chronic pain, illness |
| Mindfulness-based cognitive therapy | Segal, Williams and Teasdale | Preventing relapse in recurrent depression |
| Dialectical behaviour therapy | Marsha Linehan | Borderline personality disorder, self-harm |
| Acceptance and commitment therapy | Steven Hayes | Wide range; defusion and values |
| Mindful self-compassion | Neff and Germer | Self-criticism |

## Proposed mechanisms
- Better attention control and less mind-wandering.
- Decentering: seeing thoughts as passing events, not facts.
- Reduced rumination and worry, central in depression and anxiety.
- Exposure to unpleasant sensations without avoidance.
- Changes in emotion regulation networks, including the prefrontal cortex and amygdala.

## Evidence
- Meta-analyses show moderate effects on anxiety, depression and stress compared with inactive controls, and effects similar to other active treatments such as CBT.
- MBCT reduces the risk of depressive relapse, especially in people with three or more previous episodes, and is recommended in national guidelines in the United Kingdom.
- Limits: many trials compare with waiting lists, teacher quality varies, and effects shrink with active controls.
- Adverse effects such as panic, dissociation or re-experiencing trauma occur in a minority, so screening and trained teachers matter.

## A worked example
A final-year student who lies awake replaying a poor mock test is taught to notice the thought "I will fail", label it as a thought, return attention to the breath, and then choose a useful action, such as planning tomorrow's revision. Nothing argues with the thought; its grip loosens because she no longer treats it as a fact.

## Indian note
Vipassana courses are widely available across India, and Indian researchers have tested mindfulness programmes for students and health workers. Critics warn that secular mindfulness can lose its ethical roots and become a productivity tool.

## Conclusion
Mindfulness is the clearest case of an Indian contemplative practice turned into a tested clinical method. It works, but not as a cure-all.`,
    keyPoints: ["Sati as remembering, seventh step of the path", "Four foundations of mindfulness", "Kabat-Zinn's definition", "Table of MBSR, MBCT, DBT, ACT", "Mechanisms such as decentering and reduced rumination", "Evidence: moderate effects, MBCT relapse prevention", "Limits, adverse effects and ethical critique"],
    pitfalls: ["Calling mindfulness relaxation", "Overstating evidence"],
    module: "foundations/2-5",
    visuals: [
      {
        kind: "experiment",
        caption: "Evidence",
        data: {
          title: "How large is the effect of mindfulness?",
          question: "Typical pattern across meta-analyses, by comparison group",
          unit: "effect size",
          max: 1,
          conditions: [
            { label: "Against waiting list", value: 0.55, note: "Moderate effects." },
            { label: "Against other active treatments", value: 0.1, note: "Roughly comparable." },
          ],
          why: "Illustrative values showing the pattern: mindfulness clearly beats doing nothing but is about as good as other active treatments.",
        },
      },
    ],
    ref: "Foundations module 2.5 clinician note; Khoury et al 2013; Goldberg et al 2018; Kuyken et al 2016; NICE depression guideline",
  },
  {
    id: "indp-l02-010",
    subject: S,
    topic: "buddhist-meditation",
    marks: 5,
    difficulty: 2,
    exams: ["ugc-net", "ma-semester"],
    question: "Write a short note on samatha and vipassana meditation and the four brahmaviharas.",
    plan: ["Two kinds of meditation", "The four brahmaviharas", "Modern research", "Indian example"],
    answer: `## Samatha and vipassana
Buddhist practice uses two complementary kinds of meditation.
- Samatha, calm abiding: steady concentration on one object, such as the breath, until the mind settles. It develops tranquillity and deep absorption states, the jhanas.
- Vipassana, insight: open observation of changing body sensations, feelings and thoughts, to see directly their impermanence, unsatisfactoriness and lack of a fixed self.
Calm makes insight possible; insight gives calm a purpose.

## The four brahmaviharas
The four immeasurables, or divine abodes, are attitudes cultivated towards all beings:
1. Metta, loving-kindness: wishing others well.
2. Karuna, compassion: wishing others free from suffering.
3. Mudita, sympathetic joy: rejoicing in others' good fortune, the antidote to envy.
4. Upekkha, equanimity: balance in the face of gain and loss.
They counter the three poisons of greed, hatred and delusion.

## Research
Loving-kindness and compassion training shows small to moderate effects on positive emotion, wellbeing and helping behaviour in laboratory tasks. Brain studies show changes in networks for emotion and empathy, though samples are often small.

## Indian example
S. N. Goenka's ten-day silent Vipassana courses, taught from the centre at Igatpuri in Maharashtra, have spread across India and abroad, including courses in Tihar Jail in the 1990s.`,
    keyPoints: ["Samatha as concentration and calm", "Vipassana as insight into three marks", "Their relationship", "Four brahmaviharas named and explained", "Research on compassion training", "Goenka and Igatpuri"],
    pitfalls: ["Treating vipassana as only relaxation", "Mixing up mudita and metta"],
    module: "foundations/2-5",
    visuals: [
      {
        kind: "compare",
        caption: "Samatha and vipassana",
        data: {
          title: "Two kinds of meditation",
          a: { label: "Samatha", points: ["One object, such as the breath", "Calm and concentration", "Absorption states"], summary: "Steadies the mind." },
          b: { label: "Vipassana", points: ["Open observation", "Insight into impermanence", "Sees no fixed self"], summary: "Frees the mind." },
        },
      },
    ],
    ref: "Foundations module 2.5; Hofmann, Grossman and Hinton 2011 on loving-kindness; Goenka Vipassana Research Institute",
  },
];
