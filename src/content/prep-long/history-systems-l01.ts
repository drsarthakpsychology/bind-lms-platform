import type { LongQA } from "@/lib/prep/long-types";

const S = "history-systems" as const;

export const HISTORY_SYSTEMS_L01: LongQA[] = [
  {
    id: "hsys-l01-001",
    subject: S,
    topic: "roots",
    marks: 5,
    difficulty: 1,
    exams: ["ma-semester", "cuet-pg", "ugc-net"],
    question: "Write a short note on Wilhelm Wundt and the founding of the Leipzig laboratory.",
    plan: ["Who Wundt was and why 1879 matters", "What the laboratory studied and how", "His main ideas: voluntarism, apperception, feeling", "Folk psychology", "One line on his legacy"],
    answer: `## Wundt and 1879
Wilhelm Wundt, a German physician turned philosopher, set up the first formal laboratory of psychology at the University of Leipzig in 1879. This date is taken as the birth of psychology as an independent experimental science, separate from philosophy and physiology. He had earlier written the first textbook of physiological psychology, in 1873 and 1874, and he later founded the first journal of experimental psychology.

## What the laboratory did
- Studied immediate conscious experience: sensation, perception, attention, reaction time and feeling.
- Used controlled methods: reaction-time experiments, psychophysical judgements and brief, trained self-observation under fixed conditions.
- Trained the first generation of psychologists from many countries, including Titchener, James McKeen Cattell, Oswald Kulpe and G. Stanley Hall, who carried the laboratory model abroad.

## Key ideas
- Voluntarism: the mind is active and organises experience through apperception, the focusing of attention that combines elements into a meaningful whole.
- Tridimensional theory of feeling: every feeling varies on pleasant and unpleasant, tension and relaxation, and excitement and calm.
- Folk psychology: in a ten-volume work he argued that higher processes such as language, myth and custom cannot be studied in the laboratory and must be studied through cultural products.

## Legacy
Wundt gave psychology its own institution, method and students. He is often wrongly called the founder of structuralism; that label belongs to Titchener, who narrowed Wundt's broader programme.`,
    keyPoints: ["Leipzig laboratory of 1879 as the birth of experimental psychology", "Methods: reaction time, psychophysics, controlled self-observation", "Voluntarism and apperception", "Tridimensional theory of feeling", "Folk psychology for higher processes", "Not the founder of structuralism"],
    pitfalls: ["Calling Wundt a structuralist", "Ignoring his cultural psychology", "Saying he used only introspection"],
    module: "foundations/1-3",
    visuals: [
      {
        kind: "timeline",
        caption: "Wundt and 1879",
        data: {
          prompt: "Put Wundt's milestones in order.",
          events: [
            { label: "First textbook of physiological psychology", when: "1873 to 1874" },
            { label: "Leipzig laboratory founded", when: "1879" },
            { label: "First journal of experimental psychology", when: "1881" },
            { label: "Ten volumes of folk psychology completed", when: "1920" },
          ],
          why: "The laboratory came first; the cultural work came at the end of his life and shows his programme was wider than laboratory study.",
        },
      },
    ],
    ref: "Foundations module 1.3; Schultz and Schultz, A History of Modern Psychology, ch 4; Leahey, A History of Psychology",
  },
  {
    id: "hsys-l01-002",
    subject: S,
    topic: "roots",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net", "cuet-pg"],
    question: "Discuss the philosophical roots of modern psychology, with special reference to rationalism, empiricism and associationism.",
    plan: ["Frame the core question: where does knowledge come from", "Greek beginnings: Plato and Aristotle", "Descartes and rationalism, mind-body dualism", "British empiricism and associationism", "Kant and the doubt about measurement", "Link each root to modern psychology"],
    answer: `## Introduction
Psychology became a laboratory science only in 1879, but its questions are ancient. Philosophy asked what the mind is, how it relates to the body, and where knowledge comes from. Two answers, rationalism and empiricism, set up the nature and nurture debate that still runs through psychology.

## Greek beginnings
- Plato held that knowledge is innate and is recalled through reason. He divided the soul into reason, spirit and appetite.
- Aristotle wrote the first systematic account of the mind. He held that knowledge comes through the senses, and that memory works by association through similarity, contrast and contiguity, an idea that runs straight into learning theory.

## Rationalism and dualism
- Rene Descartes argued that mind and body are different substances that interact, with the pineal gland as the meeting point. The body works like a machine through reflexes, an idea that prepared the ground for reflex physiology.
- He believed some ideas, such as the idea of self and of God, are innate. Rationalists after him, such as Leibniz, stressed that the mind is active, not a passive receiver.

## Empiricism and associationism
- John Locke said the mind at birth is a blank slate, written on by experience. Simple ideas from sensation and reflection combine into complex ones.
- Berkeley, Hume and David Hartley developed associationism: complex mental life is built from simple ideas linked by contiguity and repetition. Hartley tied association to vibrations in the nerves.
- James Mill described the mind as a mechanical sum of associations. His son John Stuart Mill added mental chemistry: combined ideas can produce a new quality, as water differs from hydrogen and oxygen. This anticipates the Gestalt claim that the whole differs from its parts.

## Kant
Immanuel Kant argued that the mind brings built-in categories such as space, time and cause to experience. He also doubted that the mind could be measured, a challenge Fechner later answered with psychophysics.

## Comparison
| Point | Rationalism and nativism | Empiricism and associationism |
| Source of knowledge | Reason and innate ideas | Sensory experience |
| Mind at birth | Pre-structured | Blank slate |
| Key figures | Plato, Descartes, Kant | Aristotle, Locke, Hume, the Mills |
| Modern echo | Chomsky, infant core knowledge | Conditioning, behaviourism |

## Conclusion
Empiricism gave psychology its emphasis on experience, learning and observation, while rationalism kept alive the idea of an active, structured mind. Modern psychology answers that both nature and nurture matter and interact, as gene and environment research shows.`,
    keyPoints: ["Frames the source-of-knowledge question", "Aristotle's laws of association", "Descartes' dualism and reflex", "Locke's blank slate", "Associationism and J. S. Mill's mental chemistry", "Kant's categories and his doubt about measurement", "Links to modern schools"],
    pitfalls: ["Listing philosophers without linking them to psychology", "Placing Aristotle with the rationalists"],
    module: "foundations/1-3",
    visuals: [
      {
        kind: "compare",
        caption: "Comparison",
        data: {
          title: "Where does knowledge come from?",
          a: { label: "Rationalism and nativism", points: ["Plato, Descartes, Kant", "Some knowledge is inborn", "Reason is the main route to truth"], summary: "The sheet comes pre-printed." },
          b: { label: "Empiricism and associationism", points: ["Aristotle, Locke, Hume, the Mills", "Mind starts as a blank slate", "Ideas join by association"], summary: "Experience writes on the sheet." },
        },
      },
    ],
    ref: "Foundations module 1.3; Hergenhahn, An Introduction to the History of Psychology, ch 4 to 6",
  },
  {
    id: "hsys-l01-003",
    subject: S,
    topic: "roots",
    marks: 15,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net"],
    question: "Explain the physiological and psychophysical roots of experimental psychology. How did they make a laboratory science of mind possible?",
    plan: ["Argue the thesis: physiology showed mind could be timed, located and measured", "Nerve physiology: Bell and Magendie, Muller, Helmholtz", "Localisation: phrenology, Flourens, Broca, Wernicke, Fritsch and Hitzig", "Psychophysics: Weber and Fechner with a worked example", "How these led to Wundt", "Evaluation"],
    answer: `## Introduction
Philosophy supplied psychology's questions, but nineteenth century physiology supplied its methods. Three discoveries made a laboratory science possible: mental processes take measurable time, functions can be located in the brain, and sensation can be related to stimuli by mathematical laws.

## Nerve physiology
- Bell and Magendie law: early in the nineteenth century Charles Bell and Francois Magendie showed that sensory nerves enter the spinal cord at the back and motor nerves leave at the front. The reflex now had an anatomy.
- Johannes Muller's doctrine of specific nerve energies: each sensory nerve gives its own kind of sensation however it is stimulated, so pressure on the eye produces light. We experience the state of our nerves, not the world directly, which raised the question of how perception is built.
- Hermann von Helmholtz measured the speed of nerve conduction in 1850 at about 30 metres a second in frog nerve, far slower than people expected. If nerve signals take time, mental acts take time, and reaction time became a tool. He also developed the trichromatic theory of colour vision and the idea of unconscious inference in perception.

## Localisation of function
- Phrenology, from Franz Gall, claimed that bumps on the skull reveal mental faculties. It was false, but it popularised the idea that the brain has specialised parts.
- Pierre Flourens used removal of brain tissue in animals and found the cerebrum acts largely as a whole, with the cerebellum coordinating movement.
- Paul Broca in 1861 described a patient who understood speech but could produce almost none; the damage lay in the left frontal lobe. Carl Wernicke in 1874 described fluent but meaningless speech with poor comprehension after left temporal damage.
- Gustav Fritsch and Eduard Hitzig in 1870 electrically stimulated the motor cortex of dogs and produced movement.

## Psychophysics
- Ernst Weber found that the just noticeable difference is a constant fraction of the original stimulus. If you can just tell 100 g from 102 g, the Weber fraction is 2 percent, so with a 500 g packet the smallest noticeable difference is 10 g.
- Gustav Fechner, in his 1860 book on psychophysics, argued that sensation grows with the logarithm of stimulus intensity. He developed the methods of limits, constant stimuli and adjustment, which are still used.
- Fechner answered Kant's claim that the mind cannot be measured: the relation between physical and mental magnitudes can be stated as a law.

## Mental chronometry
Franciscus Donders, a Dutch physiologist, carried the timing idea into the mind itself in 1868. He compared a simple reaction, pressing a key whenever a light appears, with a choice reaction, pressing one key for a red light and another for a green one. Subtracting the simple time from the choice time gave the time taken by the extra mental steps of discrimination and choice. This subtractive method treated thinking as a chain of stages, each with its own duration, and it returns in modern cognitive psychology and in brain imaging, where one task condition is subtracted from another.

## From physiology to Wundt
Wundt trained in medicine and worked as Helmholtz's assistant at Heidelberg. He combined reaction-time methods, psychophysical judgement and controlled self-observation into a single programme, physiological psychology, and opened his Leipzig laboratory in 1879. Ebbinghaus extended experiment to memory in 1885.

| Root | Discovery | What it gave psychology |
| Muller | Specific nerve energies | Perception is constructed |
| Helmholtz | Speed of nerve impulse | Reaction time as a measure |
| Broca and Wernicke | Language areas | Localisation of mental function |
| Weber and Fechner | JND and logarithmic law | Quantitative laws of mind |

## Evaluation
These roots made psychology experimental and quantitative, but they also tied it to sensation and reaction time, which later schools found too narrow. Fechner's law has since been revised by Stevens' power law, and modern neuroscience sees functions as networks rather than single spots. Phrenology also shows the risk of measurement without method: it collected many skull readings but never tested its claims against cases that could prove it wrong. Still, the core lesson stands: mind can be studied by measurement, provided the measures are controlled and the claims can fail.`,
    keyPoints: ["Clear thesis linking physiology to method", "Muller's specific nerve energies", "Helmholtz's nerve conduction speed", "Broca and Wernicke on localisation", "Weber's law with a worked example", "Fechner's law and methods, answer to Kant", "Bridge to Wundt"],
    pitfalls: ["Writing only names and dates", "Confusing Weber's law with Fechner's law", "Forgetting that phrenology was wrong in its details"],
    module: "foundations/1-3",
    visuals: [
      { kind: "figure", caption: "Localisation of function", data: { id: "language-areas", title: "Broca's and Wernicke's areas" } },
      {
        kind: "worked",
        caption: "Psychophysics",
        data: {
          title: "Weber's law in numbers",
          steps: [
            { q: "You can just tell 100 g from 102 g. What is the Weber fraction?", a: "2 divided by 100, so 0.02 or 2 percent." },
            { q: "What is the smallest difference you would notice with 500 g?", a: "2 percent of 500 g, which is 10 g." },
          ],
          yourTurn: [{ q: "With a Weber fraction of 0.1 for loudness, how much louder must a 60 unit sound become to be noticed?", a: "10 percent of 60, which is 6 units, so about 66 units." }],
        },
      },
    ],
    ref: "Foundations module 1.3; Schultz and Schultz ch 2 and 3; Boring, A History of Experimental Psychology",
  },
  {
    id: "hsys-l01-004",
    subject: S,
    topic: "early-figures",
    marks: 5,
    difficulty: 2,
    exams: ["ma-semester", "cuet-pg"],
    question: "Write a short note on Hermann Ebbinghaus and his contribution to the study of memory.",
    plan: ["Why his work was a breakthrough", "Method: nonsense syllables and savings", "Main findings", "Strengths and limits"],
    answer: `## Why it mattered
Wundt held that higher mental processes such as memory could not be studied by experiment. Hermann Ebbinghaus proved him wrong. In 1885 he published the first experimental study of memory, carried out entirely on himself.

## Method
- He invented nonsense syllables, consonant vowel consonant strings such as ZOF or KEB, to remove the effect of prior meaning and association.
- He learned lists to a criterion of two perfect recitations, then relearned them after delays from 20 minutes to 31 days.
- He measured savings: how much less time relearning took than original learning. Savings shows that something is retained even when nothing can be recalled.
- He kept conditions constant: same time of day, same rate of reading, controlled by a metronome.

## Findings
- The forgetting curve: forgetting is fastest soon after learning and then slows. Much is lost within the first hour or day, and the rest declines gradually.
- Longer lists need disproportionately more trials.
- Spaced practice is more efficient than massed practice.
- Overlearning slows forgetting.
- Meaningful material such as poetry is learned far faster than nonsense.

## Evaluation
Ebbinghaus brought experiment, measurement and control to a higher process, and his findings still guide study planning. His limits were a single participant and artificial material; Bartlett later showed that memory for meaningful stories is reconstructive and shaped by culture.`,
    keyPoints: ["1885, first experiments on memory", "Nonsense syllables and why", "Savings method", "Forgetting curve shape", "Spacing and overlearning effects", "Limits: one subject, artificial material"],
    pitfalls: ["Saying forgetting is steady over time", "Not explaining the savings method"],
    module: "foundations/1-3",
    visuals: [{ kind: "curve", caption: "Findings", data: { kind: "forgetting", title: "Ebbinghaus's forgetting curve" } }],
    ref: "Foundations module 1.3; Ebbinghaus 1885 (trans. 1913); Schultz and Schultz ch 4",
  },
  {
    id: "hsys-l01-005",
    subject: S,
    topic: "early-figures",
    marks: 10,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net"],
    question: "Discuss the contribution of Francis Galton, James McKeen Cattell and Alfred Binet to the psychology of individual differences and mental testing.",
    plan: ["Contrast with Wundt's search for general laws", "Galton: heredity, measurement, correlation", "Cattell: mental tests in America and their failure", "Binet and Simon: a practical test of higher processes", "Spread of testing and an Indian note", "Evaluation"],
    answer: `## Introduction
Wundt looked for general laws of the adult mind and treated differences between people as error. A second tradition, inspired by Darwin's stress on variation, made individual differences the subject itself. It gave psychology mental tests, correlation and applied work in schools and industry.

## Francis Galton
- Darwin's cousin, Galton argued that mental ability, like physical traits, is inherited. He studied eminent families and later used twins to separate nature from nurture, a phrase he popularised.
- At his anthropometric laboratory in London, opened in 1884, thousands of people paid to have their reaction time, grip strength, hearing and visual acuity measured.
- He developed the idea of correlation and regression towards the mean, which Karl Pearson put into the formula used today.
- He also invented the questionnaire and word association methods. His work was tied to eugenics, which later justified serious harm.

## James McKeen Cattell
- An American who took his doctorate with Wundt but was drawn to Galton, Cattell coined the term mental test in 1890.
- At Columbia he tested students on sensory and motor tasks. In 1901 Clark Wissler, his student, showed that these scores barely correlated with college grades. Simple sensory tests did not measure intelligence.

## Alfred Binet
- In Paris, Binet argued that intelligence lies in higher processes such as judgement, comprehension and reasoning.
- In 1905, with Theodore Simon, he produced the first practical intelligence test to identify children who needed special help at school. The 1908 revision introduced mental age.
- Binet insisted that the score was a practical tool, that intelligence can be improved and that it is not a single fixed quantity.
- Lewis Terman's Stanford revision of 1916 introduced the ratio IQ, and army tests in the First World War made group testing common.

## Indian note
In India, V. V. Kamat adapted Binet's scale for Indian children, and the Binet Kamat test is still used for assessing intellectual disability.

## Comparison
| Figure | Focus | Lasting gift |
| Galton | Heredity, sensory measures | Correlation, twin method |
| Cattell | Sensory motor tests | The term mental test, applied testing |
| Binet | Higher mental processes | First workable intelligence test |

## Evaluation
This tradition made psychology useful to schools, armies and employers, and it built statistics into the discipline. Its dangers were also real: hereditarian and eugenic claims, and culturally biased tests misused against immigrants and minorities. Modern testing keeps the methods while demanding fairness and local norms.`,
    keyPoints: ["Contrast with Wundt's general laws", "Galton: heredity, anthropometric laboratory, correlation", "Cattell coined mental test; Wissler's failure", "Binet and Simon in 1905 targeted higher processes", "Mental age and later IQ", "Eugenics and test misuse critique", "Indian adaptation mentioned"],
    pitfalls: ["Crediting Binet with the IQ formula", "Ignoring the eugenics problem"],
    module: "foundations/1-3",
    visuals: [
      {
        kind: "timeline",
        caption: "Alfred Binet",
        data: {
          prompt: "Order the steps in early mental testing.",
          events: [
            { label: "Galton's anthropometric laboratory opens", when: "1884" },
            { label: "Cattell coins the term mental test", when: "1890" },
            { label: "Wissler finds sensory tests do not predict grades", when: "1901" },
            { label: "Binet and Simon publish their scale", when: "1905" },
            { label: "Terman's Stanford revision and the IQ", when: "1916" },
          ],
          why: "Testing moved from simple sensory measures to higher mental processes once the sensory approach failed.",
        },
      },
    ],
    ref: "Schultz and Schultz ch 6 and 8; Foundations module 1.3; Assessment module 2.2 on Binet Kamat",
  },
  {
    id: "hsys-l01-006",
    subject: S,
    topic: "roots",
    marks: 20,
    difficulty: 4,
    exams: ["ugc-net", "ma-semester"],
    question: "Critically examine the four founding paths of academic psychology: Wundt, Freud, James and Dilthey. What does each path contribute to psychology today?",
    plan: ["Explain why four paths, not one founder", "Wundt: experimental and physiological path", "Freud: clinical and depth path", "James: pragmatic and functional path", "Dilthey: interpretive human-science path", "Compare, then argue for an integrated view with Indian relevance"],
    answer: `## Introduction
Textbooks often date psychology to Wundt's laboratory in 1879, as if the discipline had one founder. Postgraduate syllabi instead speak of four founding paths, each beginning from a different question and method. Seeing all four explains why psychology today contains laboratories, clinics, applied settings and qualitative research under one name.

## Wundt: the experimental path
- Question: what are the processes of immediate conscious experience, and how do they relate to the body?
- Method: controlled laboratory experiment, reaction time, psychophysics and brief trained self-observation.
- Legacy: the laboratory, the experiment and quantitative measurement. Cognitive psychology and neuroscience are its heirs.
- Often missed: Wundt's folk psychology held that higher processes such as language and custom must be studied through culture, not experiment, so even the founder of the laboratory saw its limits.

## Freud: the clinical and depth path
- Question: why do people suffer from symptoms that make no conscious sense?
- Method: the clinical case, free association, dream interpretation and the analysis of transference, developed in Vienna from the 1890s. His book on dreams appeared in 1900.
- Legacy: the unconscious, defence, conflict and early development; psychotherapy as a profession; the idea that meaning lies beneath behaviour.
- Weakness: theories that were hard to test, small and biased samples, and claims later contradicted by research.

## James: the pragmatic and functional path
- Question: what is consciousness for, and how does it help us adapt?
- Method: broad and eclectic, including introspection, observation, comparison and later tests. His two-volume textbook appeared in 1890.
- Ideas: the stream of consciousness, habit, the self, his theory of emotion and pragmatism, which judges ideas by their practical consequences.
- Legacy: functionalism, applied psychology, educational and individual-differences work, and an openness to religious and unusual experience.

## Dilthey: the interpretive path
- Question: how do we understand human life, which is historical, meaningful and cultural?
- Wilhelm Dilthey, a German philosopher, distinguished the natural sciences, which explain by causes, from the human sciences, which understand meaning. In 1894 he proposed a descriptive and analytic psychology that describes the structure of lived experience as a whole rather than breaking it into elements.
- Method: Verstehen, understanding from within, through interpretation of expressions such as texts, actions and life histories.
- Legacy: hermeneutic and phenomenological psychology, narrative research, qualitative methods and cultural psychology.

## Comparison
| Path | Starting question | Method | Present form |
| Wundt | Processes of experience | Experiment, measurement | Cognitive science, neuroscience |
| Freud | Hidden meaning of symptoms | Clinical case, interpretation | Psychodynamic therapy, clinical psychology |
| James | Function and use of mind | Eclectic, pragmatic | Applied, educational, health psychology |
| Dilthey | Meaning of lived experience | Understanding, interpretation | Qualitative, narrative, cultural psychology |

## Critical evaluation
- The four paths show that psychology was plural from the start. The later dominance of the experimental path, especially in America, was a historical choice, not a logical necessity.
- Tension between explaining and understanding returns in every period: behaviourism against humanism, quantitative against qualitative methods, the experiment against the case. The four paths let a student see these debates as old and legitimate.
- Each path has a blind spot. The experiment can lose meaning and context; the clinic can lose testability; pragmatism can drift into eclecticism without theory; interpretation can lose rigour and generality.
- Modern practice uses them together. A clinical psychologist at NIMHANS may give a standardised test, a lineage from Wundt and the testing movement, use psychodynamic understanding of a defence, plan a practical, functional intervention, and write a narrative formulation of how the illness fits the person's life.

## Indian relevance
Indian critics of borrowed psychology argued that strict adherence to the experimental path left out meaning, culture and self-knowledge. The interpretive path, with its focus on understanding experience from within, sits closer to Indian traditions that treat first-person insight as valid knowledge, and it supports indigenous research that starts from local concepts.

## Conclusion
Psychology has four roots, not one. Wundt gave it method, Freud gave it depth, James gave it function and use, and Dilthey gave it meaning. A mature psychology keeps all four, choosing the method that fits the question.`,
    keyPoints: ["Rejects the single-founder story", "Each path's question, method and legacy", "Dilthey's explaining versus understanding distinction", "Comparison table", "Balanced critique of each path's blind spot", "Modern integrated example", "Indian relevance of the interpretive path"],
    pitfalls: ["Leaving out Dilthey or saying little about him", "Describing each figure without comparing them", "Treating Freud as part of academic laboratory psychology"],
    module: "foundations/2-2",
    visuals: [
      {
        kind: "flow",
        caption: "Comparison",
        data: {
          title: "Four founding paths",
          layout: "tree",
          nodes: [
            { id: "p", label: "Academic psychology", detail: "Four starting points in the late nineteenth century." },
            { id: "w", label: "Wundt", parent: "p", detail: "Experimental and physiological: the laboratory." },
            { id: "f", label: "Freud", parent: "p", detail: "Clinical and depth: the unconscious, from the clinic." },
            { id: "j", label: "James", parent: "p", detail: "Pragmatic and functional: what the mind is for." },
            { id: "d", label: "Dilthey", parent: "p", detail: "Interpretive human science: understanding lived meaning." },
          ],
        },
      },
      {
        kind: "compare",
        caption: "Dilthey: the interpretive path",
        data: {
          title: "Explaining versus understanding",
          a: { label: "Natural sciences: explain", points: ["Causes and laws", "Observer stands outside", "Experiment and measurement"], summary: "The Wundtian laboratory model." },
          b: { label: "Human sciences: understand", points: ["Meaning and context", "Understanding from within", "Interpretation of expressions"], summary: "Dilthey's path to qualitative psychology." },
        },
      },
    ],
    ref: "UGC NET Psychology syllabus Unit 1; Foundations module 2.2 clinician note; Dilthey 1894 Ideas for a descriptive and analytic psychology; Misra and Mohanty on the four paths",
  },
  {
    id: "hsys-l01-007",
    subject: S,
    topic: "historiography",
    marks: 5,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net"],
    question: "Write short notes on the great person and Zeitgeist views of history, and on presentism versus historicism.",
    plan: ["What historiography is", "Great person versus Zeitgeist with examples", "Presentism versus historicism", "A balanced position"],
    answer: `## Historiography
Historiography is the study of how history is written: which sources are used, whose story is told and what explanations are offered. In psychology it warns students that the neat textbook story is itself a construction.

## Great person versus Zeitgeist
- The great person view, also called personalistic, explains progress through the genius of individuals: Wundt founded psychology, Freud discovered the unconscious.
- The Zeitgeist view, from a German word for the spirit of the times, says ideas appear when the intellectual and social climate is ready. Evidence includes simultaneous discovery: Darwin and Wallace both arrived at natural selection, and several thinkers described the unconscious before Freud.
- Edwin Boring argued that the Zeitgeist decides which ideas are accepted, while individuals still matter in shaping them.

## Presentism versus historicism
- Presentism judges the past by today's knowledge and values, picking out the ideas that look like modern ones and treating the rest as error. It produces a story of steady progress towards us.
- Historicism tries to understand the past in its own terms: what problems people faced, what evidence they had and what was reasonable then.
- Example: calling phrenology simply silly is presentist; asking why it attracted serious nineteenth century scientists is historicist.

## A balanced view
Good history combines both: people and their times, and the past understood on its own terms while still asking what it means now.`,
    keyPoints: ["Defines historiography", "Great person explanation with example", "Zeitgeist with simultaneous discovery", "Presentism defined and its danger", "Historicism defined", "Balanced conclusion"],
    pitfalls: ["Defining presentism as simply studying the present", "Choosing one view without nuance"],
    module: "foundations/1-3",
    visuals: [
      {
        kind: "compare",
        caption: "Presentism versus historicism",
        data: {
          title: "Two ways to read the past",
          a: { label: "Presentism", points: ["Judges the past by today", "Looks for forerunners of modern ideas", "Story of steady progress"], summary: "Easy to read, often distorted." },
          b: { label: "Historicism", points: ["Past in its own terms", "Asks what was reasonable then", "Includes dead ends"], summary: "Slower, more accurate." },
        },
      },
    ],
    ref: "Schultz and Schultz ch 1; Boring 1950 on Zeitgeist; Foundations module 1.3 clinician note",
  },
  {
    id: "hsys-l01-008",
    subject: S,
    topic: "historiography",
    marks: 10,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net"],
    question: "Why should a psychology student study the history of psychology? Discuss the main approaches to writing that history and the problems of sources.",
    plan: ["Reasons for studying history", "Approaches: personalistic, naturalistic, internal, external", "Problems: sources, translation, myths", "Examples of corrected myths", "Indian angle and conclusion"],
    answer: `## Why study history
- It explains why the discipline looks as it does: why laboratories, clinics and qualitative research sit side by side.
- It prevents rediscovery of old ideas under new names, and shows which debates, such as nature and nurture or mind and body, keep returning.
- It trains critical thinking: theories are products of people, places and politics, not timeless truths.
- It protects against repeating harms, such as eugenic testing or unethical experiments.

## Approaches to writing history
| Approach | Main question | Example |
| Personalistic | What did great individuals do? | Freud's genius explains psychoanalysis |
| Naturalistic or Zeitgeist | What did the times make possible? | Darwinism made functionalism likely |
| Internal | How did ideas and evidence develop inside the field? | Failure of introspection led to behaviourism |
| External | How did society, economy and politics shape the field? | War and industry funded testing |
| Presentist | How did the past lead to us? | Tracing modern cognitive science back to Aristotle |
| Historicist | What made sense at the time? | Why phrenology was taken seriously |

Most historians now combine internal and external accounts and favour historicism.

## Problems of sources
- Data are lost or selective: letters destroyed, records kept only by the powerful.
- Translation distorts: Freud's German was turned into technical Latin, and Wundt's work reached English readers largely through Titchener, who presented a narrowed version.
- Self-serving accounts: autobiographies and textbooks written by participants tell the story in their own favour.
- Myths repeat from textbook to textbook. Examples include the claim that Wundt founded structuralism, the simplified Hawthorne story, and the exaggerated account of the Kitty Genovese case that launched bystander research.
- Original and secondary sources must be checked: external criticism asks whether a source is genuine, internal criticism whether its content is credible.

## Indian angle
Histories written in the West rarely mention Calcutta's department of 1916, Girindrasekhar Bose's correspondence with Freud, or Indian traditions of thought about mind. Writing Indian history of psychology requires archives in Indian languages and attention to the colonial setting in which the discipline arrived.

## Conclusion
History is not a list of names. It is a way of seeing psychology as a human, social enterprise, which makes students better scientists and better judges of what they read.`,
    keyPoints: ["At least three reasons to study history", "Personalistic versus naturalistic", "Internal versus external history", "Presentism versus historicism", "Source problems including translation", "Examples of textbook myths", "Indian and colonial angle"],
    pitfalls: ["Giving only reasons and no approaches", "No concrete examples of distortion"],
    module: "foundations/1-3",
    visuals: [
      {
        kind: "sort",
        caption: "Approaches to writing history",
        data: {
          prompt: "Which approach does each statement show?",
          buckets: ["Personalistic", "Naturalistic", "External"],
          items: [
            { text: "Freud's originality alone created psychoanalysis", bucket: 0 },
            { text: "Several people described apparent motion around the same time", bucket: 1 },
            { text: "Army funding in the First World War spread group testing", bucket: 2 },
            { text: "Darwin's ideas made a psychology of adaptation likely", bucket: 1 },
          ],
        },
      },
    ],
    ref: "Schultz and Schultz ch 1; Leahey ch 1; Danziger, Constructing the Subject; Manning et al 2007 on Kitty Genovese",
  },
  {
    id: "hsys-l01-009",
    subject: S,
    topic: "chronology",
    marks: 15,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "cuet-pg"],
    question: "Trace the development of the schools of psychology from 1879 to the cognitive revolution. Show how each school arose as a reaction to the one before it.",
    plan: ["State the thesis of reaction and replacement", "Structuralism and functionalism", "Behaviourism, Gestalt and psychoanalysis as three reactions", "Neo-behaviourism and humanism", "The cognitive revolution", "Evaluate the 'schools' story and conclude"],
    answer: `## Introduction
In its first eighty years psychology was a set of competing schools, each with its own subject matter, method and aim. Each grew partly from dissatisfaction with the one before. Following this chain is the clearest way to understand the field.

## Structuralism
After Wundt opened his laboratory in 1879, his English student Edward Titchener built structuralism at Cornell. He asked what consciousness is made of, answered sensations, images and affections, and studied them by trained introspection. Its weakness was that trained observers in different laboratories disagreed, and there was no way to settle the dispute.

## Functionalism
American psychologists influenced by Darwin asked what consciousness is for. William James, in his textbook of 1890, described a stream of consciousness, not a set of elements. John Dewey's reflex arc paper of 1896, James Angell and Harvey Carr at Chicago, and Woodworth and Thorndike at Columbia widened psychology to animals, children, individual differences and education.

## Three reactions
- Behaviourism: in 1913 John Watson declared that psychology should study only observable behaviour, with prediction and control as its goal. He rejected introspection and consciousness altogether, building on Pavlov's conditioning and Thorndike's law of effect.
- Gestalt psychology: in 1912 Max Wertheimer's phi phenomenon showed that perceived motion arises from the pattern, not from the parts. With Kohler and Koffka he opposed the elementism of structuralism and later the stimulus response chains of behaviourism.
- Psychoanalysis: Freud's work from the Vienna clinic, with his book on dreams in 1900, placed the unconscious at the centre. It developed largely outside the universities.

## Neo-behaviourism and the third force
From the 1930s to the 1950s Hull, Tolman and Skinner refined behaviourism. Tolman's latent learning and cognitive maps already pointed to inner processes. In the 1950s and 1960s Maslow and Rogers launched humanistic psychology as a third force against both behaviourism's machine and psychoanalysis's dark forces, stressing choice, growth and the whole person.

## The cognitive revolution
Behaviourism could not explain language, memory or problem solving. George Miller's paper on the magical number seven in 1956, the MIT symposium of that year, Chomsky's review of Skinner in 1959, and Newell and Simon's problem-solving programs presented the mind as an information processor. Ulric Neisser's textbook of 1967 named the field cognitive psychology.

| School | Years | Founder | Reacted against |
| Structuralism | 1890s to 1920s | Titchener | Philosophy without experiment |
| Functionalism | 1890s to 1920s | James, Dewey, Angell | Structuralism's elements |
| Behaviourism | 1913 to 1950s | Watson | Introspection and consciousness |
| Gestalt | 1912 onwards | Wertheimer | Elementism of all kinds |
| Humanism | 1950s and 1960s | Maslow, Rogers | Behaviourism and psychoanalysis |
| Cognitive | 1956 onwards | Miller, Chomsky, Neisser | Behaviourism's empty box |

## Why behaviourism dominated
Behaviourism ruled American psychology from the 1920s to the 1950s for reasons beyond its evidence. It promised a natural science of behaviour like physics, it fitted the logical positivism of the time, it produced practical results in advertising, education and later therapy, and its rat and pigeon laboratories gave clean, repeatable data. Europe followed a different path: Gestalt psychology flourished in Germany until the Nazi period drove Wertheimer, Kohler, Koffka and Lewin to America, and psychoanalysis grew in clinics across Europe.

## After the revolution
From the 1980s cross-cultural and multicultural psychology argued that most theories were built on narrow Western samples, and indigenous psychologies, including Indian psychology, began to build concepts from their own cultures. Neuroscience then linked the information-processing mind to the brain.

## Evaluation
The reaction story is useful but simplified. Schools overlapped in time; behaviourism and Gestalt grew side by side, and many ideas carried forward, such as Tolman's cognitive maps into cognitive science. After the 1960s psychology moved from schools to perspectives and problem areas, and today an approach is chosen to fit a question.

## Conclusion
Each school added something lasting: experiment, function, objectivity, wholes, the unconscious, the person and the information-processing mind. The history is less a series of replacements than a growing set of tools.`,
    keyPoints: ["Thesis of reaction and replacement", "Structuralism and its failure to settle disputes", "Functionalism's adaptive question", "Behaviourism, Gestalt and psychoanalysis as reactions", "Humanism as third force", "Landmarks of the cognitive revolution", "Critique of the schools story"],
    pitfalls: ["Getting the order of 1912 and 1913 wrong", "Writing separate notes with no links between schools"],
    module: "foundations/2-1",
    visuals: [
      {
        kind: "timeline",
        caption: "The cognitive revolution",
        data: {
          prompt: "Put the founding moments of the schools in order.",
          events: [
            { label: "Wundt's laboratory", when: "1879" },
            { label: "James's textbook and the stream of consciousness", when: "1890" },
            { label: "Freud's book on dreams", when: "1900" },
            { label: "Wertheimer's phi phenomenon", when: "1912" },
            { label: "Watson's behaviourist manifesto", when: "1913" },
            { label: "Neisser names cognitive psychology", when: "1967" },
          ],
          why: "Psychoanalysis, Gestalt and behaviourism appeared within about fifteen years; the cognitive turn came half a century later.",
        },
      },
      {
        kind: "flow",
        caption: "Three reactions",
        data: {
          title: "Each school reacts to the one before",
          layout: "chain",
          nodes: [
            { id: "s", label: "Structuralism", detail: "Elements of consciousness by introspection." },
            { id: "f", label: "Functionalism", detail: "What consciousness is for." },
            { id: "b", label: "Behaviourism", detail: "Drop consciousness; study behaviour." },
            { id: "h", label: "Humanism", detail: "Restore the person and choice." },
            { id: "c", label: "Cognitive", detail: "Restore the mind as information processor." },
          ],
        },
      },
    ],
    ref: "Foundations module 2.1 and 2.2; Schultz and Schultz; Hergenhahn",
  },
  {
    id: "hsys-l01-010",
    subject: S,
    topic: "early-figures",
    marks: 5,
    difficulty: 2,
    exams: ["ma-semester", "cuet-pg"],
    question: "Write a short note on G. Stanley Hall and the growth of psychology in America.",
    plan: ["Who Hall was", "His institutional firsts", "His ideas on adolescence", "The 1909 Clark conference", "Evaluation"],
    answer: `## Who he was
G. Stanley Hall earned the first American doctorate in psychology at Harvard under William James in 1878, then studied in Germany, including a period in Wundt's laboratory. He became one of the great organisers of American psychology.

## Institutional firsts
- In 1883 he set up one of the first American psychology laboratories, at Johns Hopkins University.
- In 1887 he started the first American journal devoted to psychology.
- In 1889 he became the first president of Clark University in Massachusetts.
- In 1892 he founded the American Psychological Association and served as its first president.
These steps turned psychology into an organised profession with laboratories, journals and meetings.

## Ideas
- Hall's two-volume work on adolescence in 1904 made adolescence a recognised stage of life, which he described as a time of storm and stress.
- He held a recapitulation theory: each child's development repeats the stages of human evolution. This idea has been rejected.
- He promoted child study through questionnaires to parents and teachers, an early form of developmental psychology.

## The Clark conference
In 1909 Hall invited Sigmund Freud and Carl Jung to lecture at Clark University. It was Freud's only visit to America and brought psychoanalysis to American attention.

## Evaluation
Hall's theories have not lasted, but his institutions have. He shows how a discipline grows through organisation as much as through discovery.`,
    keyPoints: ["First American PhD in psychology", "Johns Hopkins laboratory and first journal", "Founded APA in 1892", "Adolescence as storm and stress", "Recapitulation theory and its rejection", "Invited Freud and Jung in 1909"],
    pitfalls: ["Crediting Hall with the first laboratory in the world", "Presenting recapitulation as current science"],
    module: "foundations/1-3",
    visuals: [
      {
        kind: "timeline",
        caption: "Institutional firsts",
        data: {
          prompt: "Order Hall's milestones.",
          events: [
            { label: "First American PhD in psychology", when: "1878" },
            { label: "Laboratory at Johns Hopkins", when: "1883" },
            { label: "American Psychological Association founded", when: "1892" },
            { label: "Book on adolescence", when: "1904" },
            { label: "Freud and Jung lecture at Clark", when: "1909" },
          ],
        },
      },
    ],
    ref: "Schultz and Schultz ch 7; Foundations module 1.3; Arnett 1999 on storm and stress",
  },
];
