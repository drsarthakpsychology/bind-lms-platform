import type { LongQA } from "@/lib/prep/long-types";

const S = "history-systems" as const;

export const HISTORY_SYSTEMS_L04: LongQA[] = [
  {
    id: "hsys-l04-001",
    subject: S,
    topic: "humanistic-movement",
    marks: 5,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net"],
    question: "Write short notes on existential psychology and on the 'fourth force' in psychology.",
    plan: ["Existential roots and themes", "Rollo May and Viktor Frankl", "Two meanings of the fourth force", "One line on Indian links"],
    answer: `## Existential psychology
Existential psychology grew from the philosophy of Kierkegaard, Heidegger and Sartre and shares humanism's concern with the whole person. Its themes are freedom and responsibility, the search for meaning, anxiety, isolation and death.
- Rollo May brought existential ideas to American psychology in the late 1950s. He saw normal anxiety as the price of freedom and growth, and neurotic anxiety as its avoidance.
- Viktor Frankl, a Viennese psychiatrist who survived Nazi concentration camps, argued that the will to meaning is the primary human motive. His logotherapy helps people find meaning through work, love and the attitude they take to unavoidable suffering.
- Irvin Yalom later named four ultimate concerns for therapy: death, freedom, isolation and meaninglessness.

## The fourth force
The phrase is used in two ways, and an answer should say which.
- Transpersonal psychology: Maslow, late in life, with Stanislav Grof and others, called for a psychology of experiences beyond the individual ego, such as peak, mystical and meditative states. Ken Wilber later described a spectrum of consciousness. It draws openly on Vedanta, Yoga and Buddhism.
- Multicultural psychology: Paul Pedersen and others used the term in the 1990s for the view that culture shapes all behaviour and that counselling must be culturally responsive.

## Indian link
Both meanings touch Indian psychology: transpersonal ideas borrow from Indian contemplative traditions, and multiculturalism supports building psychology from local culture.`,
    keyPoints: ["Existential themes: freedom, meaning, anxiety, death", "Rollo May on anxiety", "Frankl's will to meaning and logotherapy", "Transpersonal meaning of fourth force", "Multicultural meaning of fourth force", "Indian connection"],
    pitfalls: ["Giving only one meaning of the fourth force", "Confusing existential and psychoanalytic anxiety"],
    module: "foundations/2-2",
    visuals: [
      {
        kind: "flow",
        caption: "The fourth force",
        data: {
          title: "The forces of psychology",
          layout: "chain",
          nodes: [
            { id: "a", label: "First: psychoanalysis", detail: "Unconscious drives." },
            { id: "b", label: "Second: behaviourism", detail: "Environment and conditioning." },
            { id: "c", label: "Third: humanism", detail: "Choice and growth." },
            { id: "d", label: "Fourth: transpersonal or multicultural", detail: "Say which usage you mean." },
          ],
        },
      },
    ],
    ref: "Foundations module 2.2 mnemonic box; Frankl, Man's Search for Meaning; Pedersen 1991",
  },
  {
    id: "hsys-l04-002",
    subject: S,
    topic: "cognitive-revolution",
    marks: 15,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "cuet-pg"],
    question: "What was the cognitive revolution? Discuss its causes, landmark events and consequences for psychology.",
    plan: ["Define the revolution and its claim", "Causes inside psychology", "Causes outside psychology: information theory, computers, linguistics", "Landmarks with dates", "Consequences, including models of memory", "Was it a revolution? Evaluation"],
    answer: `## Introduction
The cognitive revolution was the shift, from the mid 1950s to the late 1960s, from behaviourism to a psychology that studies inner mental processes: attention, memory, language, thinking and problem solving. Its central claim was that the mind can be studied scientifically as a system that receives, transforms, stores and retrieves information.

## Causes inside psychology
- Anomalies for behaviourism: Tolman's latent learning and cognitive maps, Kohler's insight in apes and Lashley's argument in 1951 that serial behaviour such as speech is planned in advance, not built from chains of stimulus and response.
- Gestalt psychology had kept perception, organisation and thinking alive.
- Frederic Bartlett's work in Britain on memory as reconstruction through schemas, and Jean Piaget's work on children's thinking, offered models of active minds.
- Wartime research on pilots and radar operators raised practical questions of attention, vigilance and human error. Donald Broadbent's filter model of attention in 1958 came from this work.

## Causes outside psychology
- Information theory: Claude Shannon in 1948 showed how information can be measured in bits and how channels have limited capacity.
- Computers: Alan Turing's ideas about computation, and machines that stored and processed symbols, gave a respectable model of an inner process that was neither mysterious nor reflex.
- Cybernetics: Norbert Wiener's work on feedback and control showed that purposive behaviour could be described mechanically.
- Linguistics: Noam Chomsky's generative grammar treated language as a system of rules that a mind must contain.

## Landmarks
| Year | Event |
| 1956 | George Miller's paper on the magical number seven, plus or minus two |
| 1956 | MIT symposium on information theory, 11 September, with Miller, Chomsky, Newell and Simon; often dated as the birth of cognitive science |
| 1956 | Bruner, Goodnow and Austin's study of concept formation and thinking strategies |
| 1956 | Newell and Simon's Logic Theorist program, which proved theorems |
| 1958 | Broadbent's filter model of attention |
| 1959 | Chomsky's review of Skinner's account of verbal behaviour |
| 1960 | Miller and Bruner found the Center for Cognitive Studies at Harvard |
| 1960 | Miller, Galanter and Pribram propose the TOTE unit: test, operate, test, exit |
| 1967 | Ulric Neisser's textbook names cognitive psychology |
| 1968 | Atkinson and Shiffrin's multi-store model of memory |

## Consequences
- New topics became central: attention, short-term and long-term memory, mental imagery, language acquisition, reasoning and decision making.
- New methods: reaction time again, now with Sternberg's memory scanning and Posner's chronometry, plus computer simulation and later brain imaging.
- Box and arrow models such as the multi-store model and Baddeley and Hitch's working memory model of 1974.
- New fields: cognitive science, psycholinguistics, artificial intelligence, and from the 1980s cognitive neuroscience.
- Clinical change: Aaron Beck and Albert Ellis built cognitive therapies in the 1960s, and CBT joined cognitive and behavioural methods.
- Developmental psychology embraced Piaget and later information-processing accounts.

## Was it a revolution?
Some historians argue that it was less a sudden Kuhnian revolution than a gradual evolution. Tolman's cognitive behaviourism, verbal learning research and European traditions had never stopped studying mind, and the new cognitive psychology kept behaviourism's experimental rigour. Others stress a real rupture over language and over whether inner representations are legitimate. Both views agree that by 1970 the dominant question had changed from what the environment does to the organism to what the mind does with information.

## Evaluation
The computer metaphor was powerful but limited: it neglected emotion, motivation, the body and culture. Later movements responded with embodied cognition, connectionist models inspired by neural networks, and cultural psychology.

## Conclusion
The cognitive revolution restored the mind as psychology's subject while keeping experimental method. It remains the dominant framework in academic psychology today.`,
    keyPoints: ["Clear definition: mind as information processor", "Internal causes: Tolman, Gestalt, Bartlett, wartime research", "External causes: information theory, computers, cybernetics, Chomsky", "Dated landmarks including 1956 and 1967", "Consequences: topics, models, cognitive therapy, cognitive science", "Revolution or evolution debate", "Limits of the computer metaphor"],
    pitfalls: ["Listing dates without causes", "Saying behaviourism vanished overnight", "Forgetting Neisser named the field"],
    module: "foundations/2-2",
    visuals: [
      {
        kind: "timeline",
        caption: "Landmarks",
        data: {
          prompt: "Put the landmarks of the cognitive revolution in order.",
          events: [
            { label: "Shannon's information theory", when: "1948" },
            { label: "Miller's magical number seven and the MIT symposium", when: "1956" },
            { label: "Chomsky reviews Skinner on language", when: "1959" },
            { label: "Neisser names cognitive psychology", when: "1967" },
            { label: "Multi-store model of memory", when: "1968" },
          ],
          why: "Ideas from engineering and linguistics came first; psychology then built its own models of mind.",
        },
      },
      { kind: "figure", caption: "Consequences", data: { id: "multi-store-model", title: "The multi-store model, a product of the revolution" } },
    ],
    ref: "Foundations module 2.2; Miller 2003 on the cognitive revolution; Baars, The Cognitive Revolution in Psychology; Leahey 1992 on the mythical revolutions",
  },
  {
    id: "hsys-l04-003",
    subject: S,
    topic: "cognitive-revolution",
    marks: 10,
    difficulty: 3,
    exams: ["ugc-net", "ma-semester"],
    question: "Discuss Chomsky's critique of Skinner's account of language and its importance for the history of psychology.",
    plan: ["Skinner's account of verbal behaviour", "Chomsky's main arguments", "Chomsky's alternative", "Replies and later evidence", "Historical importance"],
    answer: `## Skinner's account
In 1957 B. F. Skinner published his analysis of verbal behaviour. Language, he argued, is operant behaviour shaped by reinforcement from a verbal community. He classified verbal operants: mands, which are requests reinforced by getting what is asked for; tacts, which name things; echoics, which repeat others; and intraverbals, which respond to other words. No inner grammar or meaning was needed.

## Chomsky's critique
In 1959 the linguist Noam Chomsky published a long review that became one of the most cited documents in psychology.
- Stretching of terms: words such as stimulus, response and reinforcement, precise in the laboratory, became vague when applied to language. If a person says "Dutch" on seeing a painting, the stimulus is said to be the Dutchness of the painting, which explains nothing.
- Creativity of language: speakers constantly produce and understand sentences they have never heard. No history of reinforcement of specific responses can explain this.
- Poverty of the stimulus: children hear incomplete and error-filled speech, yet acquire complex grammar quickly and at similar ages across cultures.
- Little correction: parents rarely correct grammar and often reinforce untrue but grammatical statements, so reinforcement cannot shape grammar.
- Structure: sentences have hierarchical structure, as in ambiguous sentences such as "visiting relatives can be boring", which a chain of words cannot capture.

## Chomsky's alternative
Language depends on an innate language faculty, a language acquisition device containing universal grammar, the principles common to all languages. Experience sets the parameters of the particular language. Linguistics should describe competence, the speaker's knowledge, not just performance.

## Replies and later evidence
Behaviourists replied that Chomsky misread Skinner and that the review attacked a caricature. Later research is mixed: children do show regular stages and over-regularisation such as "goed", supporting rule learning; but statistical learning studies show that infants can extract patterns from speech, and usage-based theories argue that general learning plus social interaction can explain much of grammar.

## Indian angle
Children in India commonly grow up hearing two or three languages and still acquire each grammar without formal teaching, which nativists cite as support, while the effect of the language spoken at home on vocabulary growth supports the role of input.

## Historical importance
- It turned language into the test case that behaviourism failed.
- It legitimised inner rules and representations as objects of science.
- It linked psychology with linguistics and computer science, helping to found cognitive science.
- It revived nativism in developmental psychology.`,
    keyPoints: ["Skinner's verbal operants", "Chomsky's 1959 review", "Creativity and poverty of the stimulus", "Lack of grammatical correction", "Universal grammar and competence", "Replies and later evidence", "Importance for the cognitive revolution"],
    pitfalls: ["Getting the dates of the book and the review wrong", "Presenting Chomsky's view as fully proven"],
    module: "foundations/2-2",
    visuals: [
      {
        kind: "compare",
        caption: "Chomsky's alternative",
        data: {
          title: "Two accounts of language",
          a: { label: "Skinner", points: ["Language is operant behaviour", "Shaped by reinforcement", "No inner grammar needed"], summary: "Environment explains speech." },
          b: { label: "Chomsky", points: ["Language is rule-governed", "Innate universal grammar", "Creativity and poverty of the stimulus"], summary: "The mind contains grammar." },
        },
      },
    ],
    ref: "Chomsky 1959 review; Skinner 1957; MacCorquodale 1970 reply; Thinking and language module",
  },
  {
    id: "hsys-l04-004",
    subject: S,
    topic: "cognitive-revolution",
    marks: 5,
    difficulty: 2,
    exams: ["ma-semester", "cuet-pg"],
    question: "Write a short note on the information-processing approach in cognitive psychology.",
    plan: ["Define the approach", "Its core assumptions", "Example model", "Strengths", "Limits"],
    answer: `## Meaning
The information-processing approach treats the mind as a system that takes in information, transforms it in stages and produces output, much as a computer receives input, processes it and gives results. It became the main framework of cognitive psychology after Ulric Neisser's textbook of 1967, which defined cognition as all the processes by which sensory input is transformed, reduced, elaborated, stored, recovered and used.

## Core assumptions
- Mental processes can be broken into stages, such as encoding, storage and retrieval.
- Each stage takes time and has limited capacity.
- Information is represented in symbols or codes.
- Processes can be studied by measuring accuracy and reaction time and by building models.

## Example
In the multi-store model of 1968, information passes from sensory memory, through attention, into short-term memory, and with rehearsal into long-term memory. Each store differs in capacity, duration and code.

## Strengths
- Precise, testable models.
- Links to computer simulation and later to brain research.
- Practical uses in human factors design, such as cockpit displays and road signs, and in understanding learning problems.

## Limits
- Early models were serial and linear, while the brain works in parallel; connectionist models answered this.
- Emotion, motivation, the body and culture were left out.
- The computer metaphor can mislead: people are not neutral calculators.`,
    keyPoints: ["Mind as information processor", "Neisser's definition of cognition", "Stages, capacity, time", "Multi-store model example", "Strengths in precision and application", "Limits: serial, cold, disembodied"],
    pitfalls: ["Saying the mind is literally a computer", "No example model"],
    module: "foundations/2-2",
    visuals: [{ kind: "figure", caption: "Example", data: { id: "multi-store-model", title: "Multi-store model of memory" } }],
    ref: "Foundations module 2.2; Neisser 1967; Atkinson and Shiffrin 1968",
  },
  {
    id: "hsys-l04-005",
    subject: S,
    topic: "chronology",
    marks: 20,
    difficulty: 4,
    exams: ["ugc-net", "ma-semester"],
    question: "Compare the major schools of psychology on their subject matter, method, key concepts, contributions and criticisms. Is there still a place for schools in modern psychology?",
    plan: ["Define a school and the dimensions of comparison", "Brief sketch of each school", "Grand comparison table", "Common threads and key contrasts", "From schools to perspectives", "Argue a conclusion"],
    answer: `## Introduction
A school is a group of psychologists who share a theoretical and methodological orientation, a leader, a problem and a programme. From the 1890s to the 1960s psychology was organised by schools. Comparing them on the same dimensions shows both what each contributed and why the school system ended.

## The schools in brief
- Structuralism, led by Titchener: the elements of conscious experience by trained introspection.
- Functionalism, led by James, Dewey and Angell: the adaptive functions of mind, with any useful method.
- Behaviourism, led by Watson and later Skinner: observable behaviour and its control by the environment.
- Gestalt psychology, led by Wertheimer, Kohler and Koffka: organised wholes in perception, learning and thinking.
- Psychoanalysis, led by Freud: the unconscious, conflict and development, from clinical cases.
- Humanistic psychology, led by Maslow and Rogers: the whole person, choice and growth.
- Cognitive psychology, with Miller, Chomsky and Neisser: mental processes as information processing.

## Comparison
| School | Subject matter | Method | Key concepts | Main contribution | Main criticism |
| Structuralism | Conscious experience | Trained introspection | Elements, attributes, stimulus error | Laboratory rigour | Unverifiable data, narrow |
| Functionalism | Mental acts and adaptation | Introspection, tests, animal study | Stream of consciousness, adaptation | Applied psychology, testing | Loose, no clear system |
| Behaviourism | Observable behaviour | Experiment, observation | Conditioning, reinforcement | Objectivity, behaviour therapy | Ignored mind and biology |
| Gestalt | Organised experience | Phenomenal description, experiment | Whole, Pragnanz, insight | Perception laws, social psychology | Descriptive, weak brain theory |
| Psychoanalysis | Unconscious conflict | Clinical case, free association | Id, ego, superego, defences | Psychotherapy, the unconscious | Hard to test, biased samples |
| Humanistic | Whole person, experience | Phenomenology, case study | Self-actualisation, congruence | Counselling, positive psychology | Vague, little evidence |
| Cognitive | Mental processes | Experiment, modelling, imaging | Representation, processing stages | Cognitive science, CBT | Neglects emotion, culture |

## Common threads
- Every school wanted to make psychology a science, but they disagreed on what counted as evidence: private reports, public behaviour, clinical meaning or computational models.
- The debates of philosophy returned in each: elements versus wholes, nature versus nurture, mind versus body, freedom versus determinism.
- Each school arose partly as a reaction. Functionalism and Gestalt reacted to structuralism; behaviourism to introspection; humanism to behaviourism and psychoanalysis; cognitive psychology to behaviourism's empty organism.

## Key contrasts
- Elementism against holism: structuralism and early behaviourism analysed parts; Gestalt and humanism insisted on wholes.
- Determinism against freedom: psychoanalysis and behaviourism were determinist; humanism stressed choice.
- Laboratory against clinic: most schools grew in universities, psychoanalysis and much of humanism in therapy rooms.
- Mentalism against behaviourism: structuralism and cognitive psychology study mind; behaviourism rejected it as a cause.

## From schools to perspectives
From the 1960s the school system broke down. Reasons included the cumulative growth of data in specialised areas, the success of eclectic and integrative approaches, professionalisation into clinical, educational and industrial fields, and the arrival of neuroscience and cultural psychology. Today textbooks speak of perspectives: biological, behavioural, cognitive, psychodynamic, humanistic, sociocultural and evolutionary. A perspective is a lens chosen to fit a question, not a loyalty.

## An Indian illustration
A student in Ahmedabad who avoids exams after one failure can be read through every school. A behaviourist sees avoidance reinforced by relief; a cognitive psychologist sees a belief that failure is unbearable; a psychoanalyst asks about fear of a parent's disappointment; a humanist sees conditions of worth that block growth; a Gestalt psychologist notes how the failure has become the figure against which everything else is ground. Each lens adds something, which is the strongest argument for perspectives over loyalties.

## Is there a place for schools today?
- Against: modern psychology is organised by problems, such as depression or memory, studied with many methods. Loyalty to a school can block evidence.
- For: some traditions still behave like schools, with founders, journals and training institutes, as in psychoanalysis, radical behaviourism and person-centred therapy. Their coherence helps train practitioners and generate theory.
- A middle position: schools survive as perspectives and as therapy traditions, while research is integrative. A clinical psychologist in India may use cognitive and behavioural methods, attend to the relationship as Rogers taught, understand defences, and consider family and culture.

## Conclusion
The schools gave psychology its methods, its main ideas and its professions. They ended not because they were all wrong, but because each captured part of the truth. Modern psychology keeps their insights as complementary perspectives and judges them by evidence rather than allegiance.`,
    keyPoints: ["Defines a school", "Covers all seven schools", "Grand comparison table on five dimensions", "Common threads and reactions", "Key contrasts: elements and wholes, freedom and determinism", "Reasons schools gave way to perspectives", "Reasoned answer to whether schools still matter"],
    pitfalls: ["Writing seven separate notes with no comparison", "Leaving out criticisms", "Not answering the second part of the question"],
    module: "foundations/2-2",
    visuals: [
      {
        kind: "sort",
        caption: "Comparison",
        data: {
          prompt: "Which school does each idea belong to?",
          buckets: ["Gestalt", "Psychoanalysis", "Humanistic", "Cognitive"],
          items: [
            { text: "The phi phenomenon", bucket: 0 },
            { text: "Free association and the unconscious", bucket: 1 },
            { text: "Unconditional positive regard", bucket: 2 },
            { text: "The mind as an information-processing system", bucket: 3 },
            { text: "Sultan joining two sticks", bucket: 0 },
          ],
        },
      },
      {
        kind: "compare",
        caption: "From schools to perspectives",
        data: {
          title: "School or perspective?",
          a: { label: "School", points: ["Founder and loyalty", "One method preferred", "Rival claims to the whole field"], summary: "How psychology was organised until the 1960s." },
          b: { label: "Perspective", points: ["A lens chosen for a question", "Many methods combined", "Complementary views"], summary: "How psychology is organised today." },
        },
      },
    ],
    ref: "Foundations module 2.1 and 2.2 clinician notes; Schultz and Schultz ch 1 and 15; Heidbreder, Seven Psychologies",
  },
  {
    id: "hsys-l04-006",
    subject: S,
    topic: "india-history",
    marks: 15,
    difficulty: 3,
    exams: ["ugc-net", "ma-semester"],
    question: "Trace the development of modern psychology in India from the colonial period to the present.",
    plan: ["Colonial start in philosophy departments", "Early milestones in Calcutta, Mysore, Patna", "After independence: expansion and borrowing", "Problem orientation and indigenisation", "Professional and policy landmarks", "Evaluation of the journey"],
    answer: `## Introduction
Modern academic psychology reached India through colonial universities that taught Western subjects in English. As in Europe it grew out of philosophy departments, and for decades it largely copied British and American psychology. Its later history is a search for relevance and identity.

## The colonial beginnings
- In 1905 the philosopher Brajendranath Seal drafted a syllabus for experimental psychology at Calcutta University and set up a demonstration laboratory.
- With the support of vice-chancellor Sir Ashutosh Mukherjee this became a Department of Experimental Psychology, usually dated to 1916 and described as the first psychology department in India. N. N. Sengupta, trained at Harvard under Hugo Munsterberg, was its first head.
- In 1922 Girindrasekhar Bose founded the Indian Psychoanalytical Society in Calcutta and corresponded with Freud, proposing his own theory of opposite wishes.
- In 1923 the Indian Science Congress gave psychology its own section. The Indian Psychological Association followed in 1924 and the Indian Journal of Psychology in 1925.
- In the 1920s M. V. Gopalaswamy, who trained with Spearman in London, built psychology at Mysore, including an early animal laboratory.
- Bose opened an applied psychology wing at Calcutta in 1938 and the Lumbini Park Mental Hospital in 1940.
- Psychology began at Patna in the mid 1940s with H. P. Maiti, and Uttar Pradesh set up a Bureau of Psychology at Allahabad for educational and vocational guidance.

## After independence
- In 1950, after Partition, the Government of India and UNESCO invited Gardner Murphy to study the roots of social tension; his report appeared in 1953.
- The All India Institute of Mental Health opened in Bangalore in 1954, offering clinical psychology training; it became NIMHANS in 1974.
- In the 1960s, with UGC funding, departments multiplied and Centres of Advanced Study in psychology were set up at Utkal and Allahabad.
- Research in this period largely replicated Western studies on Indian samples, using borrowed tests and theories.

## Problem orientation and indigenisation
- In the 1970s research turned to national problems: poverty and deprivation, rural development, population, education and social tension. Durganand Sinha's work on motivation and rural development is typical.
- The ICSSR surveys of research, the first edited by S. K. Mitra and published in 1972, mapped the field.
- In the 1980s criticism of borrowed psychology led to indigenisation: concepts such as J. B. P. Sinha's nurturant-task leader, socially oriented achievement and anasakti. Durganand Sinha's critique of psychology in India as a third world discipline appeared in 1986.
- In the 1990s debates about paradigms produced what writers called a disciplinary identity crisis.

## Professional and policy landmarks
- 1989: the National Academy of Psychology was formed.
- 1992: the Rehabilitation Council of India Act made RCI a statutory body that registers clinical psychologists.
- 2002: the Pondicherry conference issued the Manifesto of Indian Psychology.
- 2017: the Mental Healthcare Act recognised clinical psychologists as mental health professionals.
- 2020: the National Education Policy promoted Indian Knowledge Systems, now part of the UGC NET syllabus.
- RCI has moved clinical psychology training to a two-year MA in Clinical Psychology from 2025 to 2026 as the M.Phil ends under NEP 2020.

## Evaluation
- Strengths: India built early departments only decades after Wundt, original work such as Bose's psychoanalysis, strong clinical training and a lively indigenous psychology movement.
- Weaknesses: long dependence on Western theories and journals, little attention to Indian languages and traditions, and research often disconnected from the majority of Indians.
- Current debates include how to integrate Indian Knowledge Systems with critical, evidence-based science, and how to include Dalit, Adivasi, Islamic, Buddhist and folk perspectives so that Indian psychology does not mean only Sanskrit texts.

## Conclusion
Psychology in India moved from implantation to imitation, then to relevance, indigenisation and the revival of Indian thought. The task now is to keep scientific rigour while asking questions that matter to Indian lives.`,
    keyPoints: ["Calcutta milestones with Seal, Mukherjee and Sengupta", "Bose and the 1922 society", "Mysore and Patna centres", "Post-independence expansion and replication", "1970s problem orientation and 1980s indigenisation", "Professional landmarks: NAoP, RCI, Pondicherry, MHCA, NEP", "Balanced evaluation including inclusion debates"],
    pitfalls: ["Giving only dates with no phases", "Forgetting the critique of borrowed psychology", "Getting the Calcutta date badly wrong"],
    module: "foundations/3-1",
    visuals: [
      {
        kind: "timeline",
        caption: "The colonial beginnings",
        data: {
          prompt: "Put these milestones of psychology in India in order.",
          events: [
            { label: "Seal drafts an experimental psychology syllabus at Calcutta", when: "1905" },
            { label: "First psychology department opens at Calcutta", when: "1916" },
            { label: "Bose founds the Indian Psychoanalytical Society", when: "1922" },
            { label: "All India Institute of Mental Health opens in Bangalore", when: "1954" },
            { label: "RCI Act passed", when: "1992" },
            { label: "Manifesto of Indian Psychology", when: "2002" },
          ],
          why: "Calcutta came first in both experimental psychology and psychoanalysis; regulation and the indigenous movement came much later.",
        },
      },
      {
        kind: "flow",
        caption: "Problem orientation and indigenisation",
        data: {
          title: "Phases of Indian academic psychology",
          layout: "chain",
          nodes: [
            { id: "a", label: "Implantation", detail: "Colonial departments copy Western psychology." },
            { id: "b", label: "Expansion and replication", detail: "Borrowed tests on Indian samples." },
            { id: "c", label: "Problem orientation", detail: "Poverty, rural development, social tension." },
            { id: "d", label: "Indigenisation", detail: "Concepts from Indian life." },
            { id: "e", label: "Indian psychology", detail: "Classical thought and Indian Knowledge Systems." },
          ],
        },
      },
    ],
    ref: "Foundations module 3.1; Sinha 1986, Psychology in a Third World Country; Misra and Mohanty; Calcutta University department history",
  },
  {
    id: "hsys-l04-007",
    subject: S,
    topic: "india-history",
    marks: 10,
    difficulty: 3,
    exams: ["ugc-net", "ma-semester"],
    question: "Write a note on the contribution of N. N. Sengupta and the early centres of psychology in India.",
    plan: ["Sengupta's training and role at Calcutta", "His research and writing", "Move to Lucknow", "Other early centres: Mysore, Patna, Allahabad, Bombay", "Assessment"],
    answer: `## Sengupta at Calcutta
Narendra Nath Sengupta took his doctorate at Harvard under Hugo Munsterberg, himself a student of Wundt. Returning to India, he became the first head of the Department of Experimental Psychology at Calcutta University, which grew out of the laboratory planned by Brajendranath Seal in 1905 and became a department around 1916. Sengupta is often called the founder of experimental psychology in India.

## Research and writing
- He set up laboratory work on attention, perception and psychophysics on the German and American model.
- With the sociologist Radhakamal Mukerjee he wrote one of the first social psychology textbooks by Indian authors, published in 1928. It discussed crowds, leadership and social institutions with Indian examples.
- He also wrote on Indian thought, showing an early interest in linking psychology with Indian philosophy.
- He helped establish the psychology section of the Indian Science Congress and the Indian Journal of Psychology.

## Move to Lucknow
In 1929 Sengupta moved to Lucknow University, where he developed psychology within the philosophy department. At Calcutta, Girindrasekhar Bose succeeded him as head and steered the department towards psychoanalysis and applied psychology.

## Other early centres
| Centre | Founder or leader | Emphasis |
| Mysore | M. V. Gopalaswamy, trained with Spearman | Experimental and animal research, early test development |
| Mysore | B. Kuppuswamy | Social psychology, socioeconomic status scale |
| Patna | H. P. Maiti, trained with Bose | Department and an institute of psychological research and services |
| Allahabad | Bureau of Psychology of the Uttar Pradesh government | Educational and vocational guidance |
| Bombay | Departments in the university and the Tata Institute of Social Sciences | Applied and social work training |

## Bose's contrast
Where Sengupta looked to the American laboratory, Bose looked to the clinic and to Indian texts. The two founders at Calcutta thus set up, in one department, the tension between experimental and interpretive psychology that later Indian debates would return to.

## Assessment
- These centres gave India a scientific psychology only a few decades after Wundt.
- They depended heavily on Western training and theories, so research often tested foreign ideas.
- Each centre also had a local character: Calcutta's psychoanalysis, Mysore's testing and social psychology, Patna's applied work.
- Their graduates staffed the expansion after independence, so their influence shaped the whole discipline.

## Conclusion
Sengupta brought the laboratory to India and showed early interest in social and Indian questions. With the founders of Mysore, Patna and Allahabad he built the base on which later indigenisation was built.`,
    keyPoints: ["Harvard doctorate under Munsterberg", "First head of the Calcutta department", "Experimental work on attention and perception", "Social psychology text with Radhakamal Mukerjee", "Move to Lucknow in 1929", "Mysore, Patna, Allahabad centres", "Assessment of dependence and local character"],
    pitfalls: ["Crediting Bose with founding the department", "Ignoring other centres"],
    module: "foundations/3-2",
    visuals: [
      {
        kind: "sort",
        caption: "Other early centres",
        data: {
          prompt: "Match each contribution to its pioneer.",
          buckets: ["N. N. Sengupta", "Girindrasekhar Bose", "M. V. Gopalaswamy"],
          items: [
            { text: "Trained under Munsterberg at Harvard", bucket: 0 },
            { text: "Theory of the opposite wish", bucket: 1 },
            { text: "Trained with Spearman and built Mysore", bucket: 2 },
            { text: "Social psychology text with Radhakamal Mukerjee", bucket: 0 },
          ],
        },
      },
    ],
    ref: "Foundations module 3.1 and 3.2; Sinha 1986; Dalal and Misra on the history of psychology in India",
  },
  {
    id: "hsys-l04-008",
    subject: S,
    topic: "paradigms",
    marks: 15,
    difficulty: 4,
    exams: ["ugc-net", "ma-semester"],
    question: "Explain Kuhn's concept of a paradigm. Has psychology had paradigm shifts? Discuss the crisis in psychology due to strict adherence to the experimental-analytical paradigm.",
    plan: ["Kuhn's terms: paradigm, normal science, anomaly, crisis, revolution", "Apply to psychology: pre-paradigmatic or multi-paradigm?", "Logical positivism and operationism", "The critiques that make up the crisis", "Indian critiques", "Responses and conclusion"],
    answer: `## Kuhn's model
In 1962 the historian of science Thomas Kuhn argued that sciences do not grow by steady accumulation. A mature science works within a paradigm: a shared set of assumptions, methods, model problems and exemplary solutions. During normal science researchers solve puzzles within it. Anomalies, results that do not fit, build up until a crisis develops. A scientific revolution then replaces the old paradigm with a new one that is incommensurable with it, meaning the two cannot be judged by a single neutral standard.

## Has psychology had paradigm shifts?
- Some describe the move from structuralism to behaviourism and from behaviourism to cognitive psychology as paradigm shifts, each with new subject matter and methods.
- Kuhn himself thought the social sciences were still pre-paradigmatic: several schools compete and none wins general agreement.
- Many historians prefer to call psychology a multi-paradigm science, in which experimental, clinical and interpretive traditions coexist. Imre Lakatos's research programmes and Larry Laudan's research traditions fit this better.
- The cognitive revolution kept behaviourism's experimental methods, so it was not a full Kuhnian break.

## The experimental-analytical paradigm
The UGC NET syllabus refers to a crisis caused by strict adherence to the experimental-analytical paradigm, also called logical empiricism.
- The Vienna Circle's logical positivism held that only statements verifiable by observation or logic are meaningful.
- Operationism, from the physicist Percy Bridgman and taken into psychology by S. S. Stevens, defined every concept by its measurement operations, as in the remark that intelligence is what intelligence tests measure.
- The ideal study was a controlled laboratory experiment that isolated variables and tested hypotheses statistically, with the researcher as a neutral observer.

## The crisis
- Narrowness: meaning, purpose, values, culture and consciousness were pushed out because they were hard to measure.
- Artificiality: laboratory tasks with college students had poor ecological validity.
- Ahistorical laws: in 1973 Kenneth Gergen argued that social psychology is a form of history, because social behaviour changes with time and culture, so its laws are not timeless.
- Fragmentation: Sigmund Koch argued that psychology was a collection of separate studies, not a unified science.
- The crisis in social psychology of the 1970s questioned the relevance of laboratory experiments to real social life.
- Feminist critiques showed how male samples and assumptions shaped theory.
- The person was reduced to variables; humanistic and phenomenological critics wanted lived experience studied as a whole.

## Indian critiques
Indian psychologists argued that the paradigm fitted neither Indian social reality nor Indian traditions of knowing. Durganand Sinha described much research as Western psychology in Indian garb, irrelevant to poverty and rural life. Indian traditions treat trained first-person insight as valid knowledge and expect knowledge to transform the knower, which the positivist paradigm excludes.

## Responses
- Post-positivism, following Karl Popper, keeps experiment but accepts that knowledge is fallible and must survive attempts at falsification.
- Qualitative and interpretive methods: phenomenology, grounded theory, discourse and narrative analysis.
- Social constructionism and critical psychology.
- Mixed methods, often grounded in pragmatism.
- Indigenous and cultural psychologies.
- A newer crisis, the replication crisis of the 2010s, has led to open science reforms within the experimental paradigm itself.

## Evaluation
The crisis literature was sometimes overstated. Experiments continued to produce reliable knowledge in perception, memory and learning, and critics did not always offer workable alternatives. The more lasting lesson was methodological pluralism: the method must fit the question, and claims to a single scientific method for all of psychology were dropped.

## Conclusion
Kuhn's model fits psychology loosely: the field has had major shifts but never a single ruling paradigm. The crisis of logical empiricism did not end experimental psychology; it ended its monopoly, opening space for qualitative, cultural and indigenous approaches that now sit beside the experiment.`,
    keyPoints: ["Kuhn's paradigm, normal science, anomaly, crisis, revolution", "Pre-paradigmatic versus multi-paradigm debate", "Logical positivism and operationism", "Gergen, Koch and the crisis in social psychology", "Indian critique from Durganand Sinha", "Responses: post-positivism, qualitative, constructionist, mixed methods", "Balanced conclusion"],
    pitfalls: ["Defining paradigm as just a theory", "Not answering whether psychology has had shifts", "Leaving out operationism"],
    module: "foundations/3-4",
    visuals: [
      {
        kind: "flow",
        caption: "Kuhn's model",
        data: {
          title: "Kuhn's cycle of science",
          layout: "cycle",
          nodes: [
            { id: "p", label: "Paradigm", detail: "Shared assumptions and methods." },
            { id: "n", label: "Normal science", detail: "Puzzle solving within the paradigm." },
            { id: "a", label: "Anomalies", detail: "Results that do not fit." },
            { id: "c", label: "Crisis", detail: "Confidence breaks down." },
            { id: "r", label: "Revolution", detail: "A new paradigm replaces the old." },
          ],
        },
      },
    ],
    ref: "Foundations module 3.4; Kuhn 1962; Gergen 1973; Koch 1981; UGC NET Psychology syllabus Unit 1",
  },
  {
    id: "hsys-l04-009",
    subject: S,
    topic: "paradigms",
    marks: 10,
    difficulty: 3,
    exams: ["ugc-net", "ma-semester"],
    question: "Explain ontology, epistemology and methodology, and compare the major research paradigms used in psychology.",
    plan: ["Define the three terms", "Show how they link", "Compare the paradigms in a table", "An example on one topic", "Conclusion on fit between question and paradigm"],
    answer: `## Three linked questions
Every research paradigm answers three questions:
1. Ontology: what is the nature of reality? Is there one objective world, or are realities constructed?
2. Epistemology: what is the relation between the knower and what can be known? Can a researcher know reality objectively from outside, or is knowledge shaped by the knower?
3. Methodology: how should we find out? By experiment and measurement, or by interpretation, dialogue and participation?
Each answer constrains the next. A study that asks a constructionist question with positivist methods will fit badly.

## The paradigms
| Paradigm | Ontology | Epistemology | Typical methods |
| Positivism | One real world governed by laws | Objective knowledge possible; observer separate | Experiments, measurement, verification |
| Post-positivism | A real world known imperfectly | Knowledge probable and open to falsification | Experiments, critical tests, triangulation |
| Critical perspective | Reality shaped by power | Knowledge is value-laden; aim to expose and change oppression | Participatory and action research, critique |
| Social constructionism | Realities built in language and interaction | Knowledge co-created | Discourse and narrative analysis |
| Existential phenomenology | Reality as lived and experienced | Understanding through careful description of experience | Phenomenological interviews, interpretative phenomenological analysis |
| Co-operative inquiry | Participatory reality | People are co-researchers in their own lives | Cycles of action and reflection with participants |

Egon Guba and Yvonna Lincoln's essays on these paradigmatic controversies argued that the differences are deep, about assumptions rather than techniques, while noting points of confluence such as mixed methods. Pragmatism, from Dewey, is the usual basis for combining methods.

## One topic, several paradigms
Consider exam anxiety in Indian college students.
- Positivist: anxiety is a measurable state; give a standardised scale and test whether a relaxation programme lowers scores in a randomised trial.
- Phenomenological: anxiety is what students live through; interview them and describe the themes of their experience.
- Social constructionist: study how parents, coaching advertisements and media talk construct the meaning of failure.
- Critical: ask how competition for scarce seats and caste or class barriers produce distress, and work with students to change institutional practice.

## Conclusion
No paradigm is correct for all questions. The researcher must state the ontology and epistemology behind a study and choose methods that fit them. Indian traditions add their own answers, such as treating consciousness as fundamental and trained first-person insight as a valid way of knowing.`,
    keyPoints: ["Clear definitions of ontology, epistemology, methodology", "How the three constrain each other", "Table of at least five paradigms", "Guba and Lincoln and the role of pragmatism", "Worked example on one topic", "Indian paradigm note"],
    pitfalls: ["Confusing methodology with methods", "Treating post-positivism as the same as positivism"],
    module: "foundations/3-4",
    visuals: [
      {
        kind: "flow",
        caption: "Three linked questions",
        data: {
          title: "How a paradigm hangs together",
          layout: "chain",
          nodes: [
            { id: "o", label: "Ontology", detail: "What is real?" },
            { id: "e", label: "Epistemology", detail: "How can the knower know it?" },
            { id: "m", label: "Methodology", detail: "So how should we research it?" },
            { id: "t", label: "Methods", detail: "Specific tools such as a trial or an interview." },
          ],
        },
      },
    ],
    ref: "Foundations module 3.4; Guba and Lincoln 1994 and 2005; Heron and Reason 1997",
  },
  {
    id: "hsys-l04-010",
    subject: S,
    topic: "replication-crisis",
    marks: 5,
    difficulty: 3,
    exams: ["ugc-net", "ma-semester"],
    question: "Write a short note on the replication crisis in psychology.",
    plan: ["What the crisis is", "Key evidence", "Causes", "Reforms"],
    answer: `## Meaning
The replication crisis is the discovery, mainly in the 2010s, that many published findings in psychology could not be repeated when other researchers ran the same studies carefully. It is a crisis within the experimental paradigm rather than a rejection of it.

## Evidence
- In 2015 the Open Science Collaboration repeated 100 studies from three leading journals. Almost all the originals had reported significant results, but only about 36 percent of the replications did, and effects were on average about half as large.
- Large multi-laboratory replications found much smaller or no effects for famous findings such as ego depletion.
- A 2011 paper claiming evidence for precognition, which passed normal review, showed that standard practice could support almost anything.

## Causes
- Small samples with low statistical power.
- Flexible analysis, known as p-hacking: trying many analyses and reporting the one that reaches significance.
- Publication bias: journals prefer new, positive results, and null results stay in file drawers.
- Hypothesising after the results are known.
- Career incentives that reward many striking papers over careful ones.

## Reforms
Preregistration of hypotheses and analysis plans, registered reports accepted before results are known, larger samples and multi-site studies, open data and materials, and valuing replication. India's researchers can take part through multi-site collaborations such as the Psychological Science Accelerator.`,
    keyPoints: ["Defines the crisis", "Open Science Collaboration figures", "Ego depletion example", "Causes: power, p-hacking, publication bias", "Reforms: preregistration, registered reports, open data", "Within, not against, the experimental paradigm"],
    pitfalls: ["Saying psychology is not a science", "Not naming specific causes"],
    module: "foundations/3-4",
    visuals: [
      {
        kind: "flow",
        caption: "Causes",
        data: {
          title: "How the crisis happened, and the fix",
          layout: "cycle",
          nodes: [
            { id: "i", label: "Pressure to publish", detail: "Journals prefer striking results." },
            { id: "f", label: "Flexible analysis", detail: "Small samples and many choices." },
            { id: "p", label: "Positive results published", detail: "Null results filed away." },
            { id: "r", label: "Replications fail", detail: "Effects shrink or vanish." },
            { id: "x", label: "Reforms", detail: "Preregistration and open data reset incentives." },
          ],
        },
      },
    ],
    ref: "Open Science Collaboration 2015; Hagger et al 2016 on ego depletion; Bem 2011; Foundations module 3.4",
  },
];
