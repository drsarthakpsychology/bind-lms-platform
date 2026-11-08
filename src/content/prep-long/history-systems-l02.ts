import type { LongQA } from "@/lib/prep/long-types";

const S = "history-systems" as const;

export const HISTORY_SYSTEMS_L02: LongQA[] = [
  {
    id: "hsys-l02-001",
    subject: S,
    topic: "structuralism",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "cuet-pg", "ugc-net"],
    question: "Describe Titchener's structuralism: its subject matter, method, elements of consciousness and the reasons for its decline.",
    plan: ["Introduce Titchener and his question", "Subject matter and the definition of psychology", "The three elements and their attributes", "Method: trained introspection and the stimulus error", "Contributions", "Criticisms and decline"],
    answer: `## Introduction
Edward Bradford Titchener, an Englishman trained in Wundt's laboratory at Leipzig, moved to Cornell University in 1892 and built the school he named structuralism. He asked a single question: what is consciousness made of? His model was chemistry, which had broken matter into elements; psychology, he thought, should do the same for the mind.

## Subject matter
- Psychology is the study of conscious experience as it depends on the experiencing person.
- Consciousness is the sum of experiences at a given moment; mind is the sum of experiences over a lifetime.
- The task has three parts: reduce experience to its simplest elements, discover how the elements combine, and relate them to their bodily conditions.
- Titchener excluded animals, children, abnormal people and practical applications, which he saw as technology rather than pure science.

## Elements and attributes
- Sensations: the elements of perception, such as a tone or a patch of colour.
- Images: the elements of ideas, such as a remembered tone.
- Affections: the elements of emotion, which he limited to pleasant and unpleasant.
- Each element has attributes: quality, intensity, duration, clearness and, for some, extent. Titchener catalogued more than 44,000 distinguishable qualities of sensation.

## Method
Titchener's introspection was a strict, trained self-observation. Observers had to report the raw experience, not the object. Saying "a book" was the stimulus error; the correct report was a description such as a red, rectangular, bright patch. Observers practised thousands of trials before their reports counted as data.

## Contributions
- It made psychology a laboratory discipline in America and trained many doctoral students.
- It produced detailed descriptions of sensation that fed psychophysics.
- It gave other schools a clear target; functionalism, behaviourism and Gestalt all defined themselves against it.

## Criticisms and decline
- Introspection could not settle disagreements: different laboratories reported different results and there was no public check.
- The method was retrospective; observing an experience may change it.
- The Würzburg school reported imageless thought, which contradicted the claim that all thought is made of images.
- It was narrow, excluding the topics that were growing fastest: learning, development, individual differences and application.
- Gestalt critics argued that breaking experience into elements destroys its organisation.
Structuralism effectively ended with Titchener's death in 1927.

## Conclusion
Structuralism failed as a system but succeeded as a step. It showed that experience could be studied in the laboratory, and its failure taught psychology that a science needs public, checkable data.`,
    keyPoints: ["Titchener at Cornell, chemistry as model", "Definition of consciousness and mind", "Sensations, images, affections and attributes", "Trained introspection and the stimulus error", "Exclusion of applied and comparative topics", "Reasons for decline including imageless thought", "Ended with Titchener in 1927"],
    pitfalls: ["Saying Wundt founded structuralism", "Listing elements without the method", "Missing the stimulus error"],
    module: "foundations/2-1",
    visuals: [
      {
        kind: "flow",
        caption: "Elements and attributes",
        data: {
          title: "Titchener's map of consciousness",
          layout: "tree",
          nodes: [
            { id: "c", label: "Conscious experience", detail: "Studied by trained introspection." },
            { id: "s", label: "Sensations", parent: "c", detail: "Elements of perception." },
            { id: "i", label: "Images", parent: "c", detail: "Elements of ideas." },
            { id: "a", label: "Affections", parent: "c", detail: "Only pleasant or unpleasant." },
            { id: "t", label: "Attributes", parent: "s", detail: "Quality, intensity, duration, clearness." },
          ],
        },
      },
    ],
    ref: "Foundations module 2.1; Schultz and Schultz ch 4; Titchener, A Textbook of Psychology",
  },
  {
    id: "hsys-l02-002",
    subject: S,
    topic: "structuralism",
    marks: 5,
    difficulty: 2,
    exams: ["ugc-net", "ma-semester"],
    question: "Was Wundt a structuralist? Distinguish Wundt's voluntarism from Titchener's structuralism.",
    plan: ["State the answer: no", "Wundt's voluntarism", "Titchener's structuralism", "Table of contrasts", "Why the confusion arose"],
    answer: `## Short answer
No. Wundt called his system voluntarism. Structuralism was Titchener's school at Cornell, and Titchener presented his own narrower system to English readers as if it were Wundt's.

## Wundt's voluntarism
- The mind is active: through apperception, will and attention organise elements into meaningful wholes.
- Elements matter, but the creative synthesis that combines them is the main interest.
- Laboratory methods suit simple processes; higher processes such as language, myth and morals need folk psychology, the study of cultural products.

## Titchener's structuralism
- The mind is described by its elements and their attributes, with little stress on will.
- Introspection is the chief method, even for complex processes.
- Applied and cultural questions are excluded.

## Contrast
| Point | Wundt | Titchener |
| Name of system | Voluntarism | Structuralism |
| Role of will | Central, through apperception | Minor |
| Focus | Synthesis of elements | Analysis into elements |
| Higher processes | Folk psychology, not experiment | Introspection |
| Scope | Laboratory plus culture | Laboratory only |

## Why the confusion arose
Wundt wrote in German and few Americans read his later work. Titchener translated parts of it and taught a generation of students, so his version became the textbook version. Historians since the 1970s have corrected this picture.`,
    keyPoints: ["Clear answer that Wundt was not a structuralist", "Voluntarism and apperception", "Folk psychology for higher processes", "Titchener's elementism", "Comparison table", "Reason for the textbook error"],
    pitfalls: ["Answering yes", "Not mentioning folk psychology"],
    module: "foundations/2-1",
    visuals: [
      {
        kind: "compare",
        caption: "Contrast",
        data: {
          title: "Wundt versus Titchener",
          a: { label: "Wundt: voluntarism", points: ["Active mind and apperception", "Synthesis of elements", "Folk psychology for culture"], summary: "Broad programme, laboratory plus culture." },
          b: { label: "Titchener: structuralism", points: ["Elements and attributes", "Introspection for all processes", "No applied work"], summary: "Narrow, analytic laboratory system." },
        },
      },
    ],
    ref: "Foundations module 2.1 trap box; Blumenthal 1975 on Wundt; Leahey 1981 on the mistaken mirror",
  },
  {
    id: "hsys-l02-003",
    subject: S,
    topic: "functionalism",
    marks: 15,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "cuet-pg"],
    question: "Compare and contrast structuralism and functionalism. Which has had the greater influence on modern psychology?",
    plan: ["Introduce both schools and their founding question", "Structuralism in brief", "Functionalism in brief", "Point-by-point comparison table", "Influence on modern psychology", "Reasoned conclusion"],
    answer: `## Introduction
Structuralism and functionalism were the first two schools of psychology, both active from the 1890s to the 1920s. The difference lies in their question. Structuralism asked what consciousness is made of. Functionalism asked what consciousness is for. The second question, shaped by Darwin, proved far more productive.

## Structuralism
Edward Titchener at Cornell broke conscious experience into sensations, images and affections, each with attributes such as quality and intensity. His method was rigorous trained introspection, avoiding the stimulus error. He limited psychology to the normal adult human mind and treated applications as outside pure science.

## Functionalism
Functionalism was less a single system than an attitude. William James described consciousness as a continuous, personal, changing and selective stream that helps the organism adapt. John Dewey's reflex arc paper of 1896 argued that stimulus and response form a coordinated whole serving adaptation. James Rowland Angell and Harvey Carr made Chicago the centre of the school; Angell defined functionalism as the study of mental operations, the fundamental utilities of consciousness and the relation of mind and body. At Columbia, Robert Woodworth and Edward Thorndike studied motivation and learning.

## Comparison
| Point | Structuralism | Functionalism |
| Central question | What is the mind made of? | What is the mind for? |
| Key figures | Titchener | James, Dewey, Angell, Carr, Woodworth |
| Centre | Cornell | Chicago and Columbia |
| Unit of study | Elements of consciousness | Mental acts and their adaptive use |
| View of consciousness | Static structure of parts | Continuous stream |
| Method | Strict trained introspection | Introspection plus observation, tests, experiments on animals |
| Subjects | Normal adult humans | Animals, children, abnormal people, individual differences |
| Influence of Darwin | Little | Central |
| Attitude to application | Rejected as not science | Welcomed: education, testing, industry |
| Fate | Ended with Titchener in 1927 | Absorbed into mainstream American psychology |

## Similarities
Both studied consciousness, both used introspection to some degree, and both wanted psychology to be an experimental science independent of philosophy. Both were also criticised for vagueness about mind and body, and both were overtaken by behaviourism.

## A worked contrast
Take a student feeling anxious before an exam. A structuralist would ask a trained observer to describe the experience: a pressure sensation in the chest, an image of the question paper, an unpleasant affection, each rated for intensity and clearness. A functionalist would ask what the anxiety does: whether it narrows attention, whether it helps preparation up to a point and harms it beyond, and how the student copes. Only the second set of questions leads to advice, which shows why functionalism suited a practical culture.

## Influence on modern psychology
- Structuralism's legacy is mainly methodological: careful laboratory description, psychophysics and a lesson about the limits of private reports. Modern versions of systematic self-report, such as think-aloud protocols, owe something to it but are used with checks.
- Functionalism's legacy is everywhere. It opened psychology to animals, which led to comparative psychology and behaviourism; to children, which led to developmental and educational psychology; and to individual differences, which led to mental testing. Applied psychology in schools, clinics and industry grew from its practical attitude. Thorndike's law of effect, built in this tradition, became the basis of operant conditioning.
- Modern evolutionary psychology and the study of cognition as adaptive problem solving keep the functionalist question alive. Even in clinical work, functional analysis asks what a behaviour does for a person, such as how avoidance reduces anxiety in the short term.

## Conclusion
Structuralism tried to make psychology like chemistry and found that private experience could not be weighed. Functionalism made psychology useful and broad, and its question about purpose and adaptation still guides research. Functionalism therefore has the greater influence, though structuralism gave the discipline its first experimental discipline and a clear lesson in method.`,
    keyPoints: ["Contrasting founding questions", "Titchener's elements and method", "James, Dewey and the Chicago school", "Detailed comparison table", "Similarities noted", "Specific modern legacies of each", "Reasoned judgement on influence"],
    pitfalls: ["Treating functionalism as one tidy system", "Leaving out Darwin", "Giving no judgement on influence"],
    module: "foundations/2-1",
    visuals: [
      {
        kind: "compare",
        caption: "Comparison",
        data: {
          title: "Structuralism or functionalism?",
          a: { label: "Structuralism", points: ["What is consciousness made of?", "Sensations, images, affections", "Trained introspection", "Adult human minds only"], summary: "Ended with Titchener in 1927." },
          b: { label: "Functionalism", points: ["What is consciousness for?", "A stream that helps adaptation", "Many methods", "Animals, children, tests, education"], summary: "Became mainstream American psychology." },
        },
      },
      {
        kind: "sort",
        caption: "Influence on modern psychology",
        data: {
          prompt: "Which school does each modern practice descend from most directly?",
          buckets: ["Structuralism", "Functionalism"],
          items: [
            { text: "School-based testing of individual differences", bucket: 1 },
            { text: "Careful psychophysical description of sensation", bucket: 0 },
            { text: "Functional analysis of what a behaviour does for a client", bucket: 1 },
            { text: "Studying learning in animals", bucket: 1 },
          ],
        },
      },
    ],
    ref: "Foundations module 2.1; Schultz and Schultz ch 5 to 7; Angell 1907 presidential address",
  },
  {
    id: "hsys-l02-004",
    subject: S,
    topic: "functionalism",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "cuet-pg"],
    question: "Discuss the contributions of William James to psychology.",
    plan: ["Who James was and his textbook of 1890", "Stream of consciousness", "Habit and the self", "Theory of emotion", "Pragmatism and religious experience", "Evaluation"],
    answer: `## Introduction
William James, who taught at Harvard, is often called the father of American psychology, although he did little laboratory work himself. His two-volume textbook of 1890, written over twelve years, became the most influential psychology book in English. It gave functionalism its spirit: the mind studied as a living, adaptive process.

## Stream of consciousness
James rejected the idea that consciousness is made of separate elements. It is a stream with five features:
- It is personal: every thought belongs to someone.
- It is always changing: no state returns exactly the same.
- It is continuous: even after sleep we feel our thoughts belong together.
- It deals with objects other than itself.
- It is selective: attention picks some things and ignores others.
He also distinguished the substantive parts of the stream, its resting places, from the transitive parts, its flights between them.

## Habit
Habits form because nervous tissue is plastic. They simplify movement, reduce fatigue and free attention for new tasks. Habit is the flywheel of society, keeping people in their roles. His advice on forming good habits, such as starting with a strong initiative and never allowing an exception until the habit is fixed, reads like modern behaviour change.

## The self
James divided the self into the material self, such as body, family and possessions; the social self, the recognition we get from others, so that we have as many social selves as people who know us; the spiritual self, our inner dispositions; and the pure ego, the sense of personal identity. He defined self-esteem as success divided by pretensions, so lowering aspirations can raise self-esteem as surely as succeeding.

## Emotion
In 1884, and independently Carl Lange in Denmark, James proposed that we feel emotion because of bodily changes: we feel afraid because we tremble, not the other way round. This James Lange theory was challenged by Cannon and Bard but revived in modern work on bodily feedback.

## Pragmatism and religion
- Pragmatism: the truth of an idea lies in its practical consequences.
- His lectures on religious experience in 1902 studied conversion, mysticism and saintliness with respect, and discussed Indian mysticism and Vivekananda.
- He also wrote on free will and supported research on psychical phenomena.

## Evaluation
James's ideas on attention, habit, self and emotion still frame textbook chapters, and his breadth kept psychology open to the whole person. Critics note that his work was descriptive rather than experimental, and that he left no systematic theory. His influence came through ideas and through students such as Hall and Mary Calkins.`,
    keyPoints: ["Textbook of 1890 and its influence", "Five features of the stream of consciousness", "Habit and plasticity", "Material, social, spiritual self and self-esteem formula", "James Lange theory of emotion", "Pragmatism and religious experience", "Balanced evaluation"],
    pitfalls: ["Calling James the founder of the first laboratory", "Stating the emotion theory backwards"],
    module: "foundations/2-1",
    visuals: [
      {
        kind: "flow",
        caption: "Emotion",
        data: {
          title: "James Lange order of events",
          layout: "chain",
          nodes: [
            { id: "s", label: "Stimulus", detail: "A snake on the path." },
            { id: "b", label: "Bodily change", detail: "Heart races, legs tremble, you run." },
            { id: "f", label: "Feeling", detail: "Awareness of the bodily change is the fear." },
          ],
        },
      },
    ],
    ref: "Foundations module 2.1; James 1890; Schultz and Schultz ch 7",
  },
  {
    id: "hsys-l02-005",
    subject: S,
    topic: "functionalism",
    marks: 5,
    difficulty: 2,
    exams: ["ugc-net", "ma-semester"],
    question: "Write a short note on John Dewey's reflex arc paper and its importance for functionalism.",
    plan: ["Context of the paper in 1896", "The criticism of the reflex arc as separate parts", "Dewey's alternative: a coordinated circuit", "The child and candle example", "Importance"],
    answer: `## Context
In 1896 John Dewey, then at the University of Chicago, published a paper on the reflex arc concept. It is often called the founding document of functionalism.

## The criticism
The standard reflex arc split behaviour into three separate parts: a stimulus, a central process and a response, joined like links in a chain. Dewey argued that this was artificial. Breaking behaviour into units repeats the mistake of structuralism, which broke consciousness into elements.

## Dewey's alternative
- Stimulus and response are not separate events but phases of one coordinated act.
- The response changes the stimulus, which in turn guides the next response, so the act forms a circuit, not an arc.
- Behaviour must be understood by its function in adapting the organism to its surroundings.

## Example
Dewey used the case of a child reaching for a candle flame. Seeing the flame and reaching are already coordinated; the burn changes what the flame means, so the next sight of a flame is a different stimulus, one that now leads to withdrawal.

## Importance
- It shifted the unit of study from parts to whole adaptive acts.
- It put the question of function at the centre of psychology.
- It anticipated feedback ideas in cybernetics and later systems theory.
- Dewey went on to apply the same ideas to education, stressing learning by doing.`,
    keyPoints: ["Dates the paper to 1896 at Chicago", "Critique of the arc as separate parts", "Coordinated circuit idea", "Child and candle example", "Function and adaptation", "Influence on education and feedback ideas"],
    pitfalls: ["Calling Dewey a behaviourist", "Not explaining why separate parts are a problem"],
    module: "foundations/2-1",
    visuals: [
      {
        kind: "flow",
        caption: "Dewey's alternative",
        data: {
          title: "A circuit, not an arc",
          layout: "cycle",
          nodes: [
            { id: "s", label: "Seeing the flame", detail: "Already part of a coordinated act." },
            { id: "r", label: "Reaching", detail: "The response changes the situation." },
            { id: "b", label: "Burn", detail: "The flame now means pain." },
            { id: "n", label: "New seeing", detail: "Leads to withdrawal next time." },
          ],
        },
      },
    ],
    ref: "Dewey 1896; Foundations module 2.1; Schultz and Schultz ch 7",
  },
  {
    id: "hsys-l02-006",
    subject: S,
    topic: "functionalism",
    marks: 10,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net"],
    question: "Explain the Chicago and Columbia schools of functionalism. How did functionalism give rise to applied psychology?",
    plan: ["Functionalism as an attitude", "Chicago: Dewey, Angell, Carr", "Columbia: Cattell, Woodworth, Thorndike", "Routes to applied psychology", "Evaluation"],
    answer: `## Functionalism as an attitude
Functionalism never had a single founder or a closed system. It was an American attitude, shaped by Darwin and by a practical culture, that asked how mental processes help people adapt. It developed in two main centres.

## The Chicago school
- John Dewey's reflex arc paper of 1896 set out the idea of coordinated, adaptive acts.
- James Rowland Angell, in his presidential address of 1906, defined functionalism by three themes: the study of mental operations rather than elements; the study of the basic usefulness of consciousness in adjusting to the environment; and the study of the whole organism, mind and body together.
- Harvey Carr defined mental activity as the acquisition, fixation, retention, organisation and evaluation of experience and its use in guiding action. He studied adaptive acts with a motive, a stimulus and a response that satisfies the motive.
- Watson took his doctorate at Chicago, so behaviourism grew partly out of this school.

## The Columbia school
- James McKeen Cattell built mental testing and the study of individual differences.
- Robert Woodworth introduced dynamic psychology, adding the organism to the stimulus response formula as S, O, R, and stressing motivation and drive.
- Edward Thorndike studied cats in puzzle boxes and stated the law of effect in 1898 and later: responses followed by satisfaction are strengthened. He then applied learning research to education, writing on teaching arithmetic and on transfer of training.

## Routes to applied psychology
| Field | Functionalist root |
| Educational psychology | Dewey's learning by doing, Thorndike's work on teaching |
| Mental testing | Cattell, then group tests in the First World War |
| Industrial psychology | Interest in efficiency and selection, such as Münsterberg's work on selecting workers |
| Clinical psychology | Lightner Witmer opened the first psychological clinic at Pennsylvania in 1896 for children with learning problems |
| Developmental psychology | Hall's child study |
Because functionalists judged ideas by their use, applying psychology to schools, factories and clinics was a natural step.

## Evaluation
Functionalism widened psychology and made it socially useful, but its looseness was also a weakness: critics such as Titchener said it had no clear subject matter. Its ideas were absorbed so completely that it ceased to exist as a separate school by the 1930s.`,
    keyPoints: ["Functionalism as attitude, not system", "Angell's three themes", "Carr's adaptive act", "Woodworth's S O R and dynamic psychology", "Thorndike's law of effect and education", "Table of applied fields with roots", "Evaluation of looseness"],
    pitfalls: ["Mixing up which figures were at Chicago and Columbia", "Forgetting Witmer's clinic"],
    module: "foundations/2-1",
    visuals: [
      {
        kind: "flow",
        caption: "Routes to applied psychology",
        data: {
          title: "From functionalism to applied fields",
          layout: "tree",
          nodes: [
            { id: "f", label: "Functionalism", detail: "What is the mind for?" },
            { id: "e", label: "Educational", parent: "f", detail: "Dewey and Thorndike." },
            { id: "t", label: "Testing", parent: "f", detail: "Cattell and group tests." },
            { id: "i", label: "Industrial", parent: "f", detail: "Selection and efficiency." },
            { id: "c", label: "Clinical", parent: "f", detail: "Witmer's clinic of 1896." },
          ],
        },
      },
    ],
    ref: "Schultz and Schultz ch 7 and 8; Foundations module 2.1; Angell 1907",
  },
  {
    id: "hsys-l02-007",
    subject: S,
    topic: "structuralism",
    marks: 20,
    difficulty: 4,
    exams: ["ugc-net", "ma-semester"],
    question: "Critically evaluate introspection as a method in psychology. Trace its use from Wundt to the Würzburg school and its modern forms.",
    plan: ["Define introspection and its types", "Wundt's controlled self-observation", "Titchener's systematic introspection", "Würzburg school and imageless thought", "Attacks by behaviourism and Gestalt", "Modern returns, evidence on accuracy, and a balanced verdict"],
    answer: `## Introduction
Introspection means looking inward: observing and reporting one's own conscious experience. It was psychology's first major method, was later rejected by behaviourism, and has quietly returned in disciplined forms. Its history shows how a science decides what counts as data.

## Kinds of introspection
- Everyday self-reflection, as in philosophy from Locke onwards.
- Wundt's internal perception: brief, immediate reports under controlled laboratory conditions.
- Titchener's systematic, trained introspection into elements.
- The Würzburg school's retrospective reports of thinking.
- Modern structured self-report, such as think-aloud protocols and experience sampling.

## Wundt's controlled self-observation
Wundt did not trust free, armchair introspection. In his laboratory, observers made simple, immediate judgements, such as whether a tone was louder or a light appeared, under repeatable conditions, often combined with reaction time. He held that higher processes like thinking could not be studied this way and belonged to folk psychology.

## Titchener's systematic introspection
Titchener extended introspection to all of experience. Trained observers described sensations, images and affections and their attributes, avoiding the stimulus error. The method required thousands of practice trials, which meant that results depended on training. When laboratories disagreed, for example on the number of sensory qualities, there was no public way to decide who was right.

## The Würzburg school and imageless thought
Oswald Külpe, a former student of Wundt, led a group at Würzburg that turned introspection on thinking itself. Observers solved problems and then described what had happened.
- They reported thoughts with no images or sensations behind them: imageless thought.
- They found that a task given in advance, a determining tendency or mental set, shaped thinking without being conscious during the task. Narziss Ach described this.
- Titchener insisted that trained observers would find images; the Würzburg group insisted they did not. This imageless thought controversy, which could not be resolved by introspection itself, exposed the method's central weakness.

## Attacks on introspection
- Watson, in his manifesto of 1913, argued that a science cannot rest on data that only one observer can see. Behaviourism replaced introspection with observable behaviour.
- Gestalt psychologists accepted experience as data but rejected analytic introspection, preferring naive phenomenal description of how things appear.
- Psychoanalysis held that the most important mental contents are unconscious and therefore not open to introspection at all.

## Evidence on accuracy
In 1977 Richard Nisbett and Timothy Wilson showed that people often cannot report the real causes of their choices. Shoppers who chose the rightmost of identical stockings explained their choice by quality, never by position. People confabulate plausible reasons. Later work on choice blindness, where participants defended choices they had not made, supports this.

## Modern forms
- Think-aloud protocols: Ericsson and Simon argued in the 1980s that reports of what is in attention, given during a task, are valid data, while reports of causes and processes after the event are not.
- Experience sampling: people are signalled at random moments and report their thoughts and mood, reducing memory bias.
- Descriptive experience sampling and micro-phenomenological interviews train careful first-person description.
- Neurophenomenology, proposed by Francisco Varela, combines trained first-person reports with brain measures.
- Clinical practice depends on self-report: rating scales, thought records in CBT and the mental state examination all use structured introspection.

## Indian connection
Indian traditions treat trained first-person insight as a valid route to knowledge, and meditation is a long-practised discipline of observing the mind. Contemplative research now tests whether such training improves the accuracy of self-report, for example on attention and mind-wandering tasks.

## Critical evaluation
| Strengths | Weaknesses |
| Only direct access to experience | Private and unverifiable |
| Essential for studying feelings, images, pain | Training shapes results |
| Rich, quick data for theory | Observation can change the experience |
| Cheap, used in every clinic | Poor access to causes; confabulation |

## Conclusion
Introspection failed as the sole method for a science of mind because it could not settle disputes. It survives as one source of data among others, valid when reports concern current experience, are collected under clear conditions and are checked against behaviour and physiology. The lesson is not that first-person data are worthless, but that they need method.`,
    keyPoints: ["Defines introspection and distinguishes types", "Wundt's limited, controlled use", "Titchener's systematic introspection and its dependence on training", "Würzburg school, imageless thought, determining tendency", "Behaviourist, Gestalt and psychoanalytic critiques", "Nisbett and Wilson evidence on confabulation", "Modern forms with the conditions for validity", "Balanced verdict"],
    pitfalls: ["Treating Wundt and Titchener as using the same method", "Ending with 'introspection is useless'", "Leaving out modern self-report"],
    module: "foundations/2-1",
    visuals: [
      {
        kind: "timeline",
        caption: "The Würzburg school and imageless thought",
        data: {
          prompt: "Order the history of introspection.",
          events: [
            { label: "Wundt's controlled self-observation at Leipzig", when: "1879" },
            { label: "Titchener's systematic introspection at Cornell", when: "1890s" },
            { label: "Würzburg reports of imageless thought", when: "1900s" },
            { label: "Watson rejects introspection", when: "1913" },
            { label: "Nisbett and Wilson on telling more than we know", when: "1977" },
            { label: "Think-aloud protocols defended as data", when: "1980s" },
          ],
          why: "Introspection fell when it could not settle disputes and returned in narrower, checked forms.",
        },
      },
      {
        kind: "compare",
        caption: "Critical evaluation",
        data: {
          title: "When is self-report trustworthy?",
          a: { label: "More valid", points: ["Reports of what is in attention now", "Given during the task", "Checked against behaviour"], summary: "Think-aloud and experience sampling." },
          b: { label: "Less valid", points: ["Reports of causes of behaviour", "Given long after the event", "No outside check"], summary: "Confabulation is likely." },
        },
      },
    ],
    ref: "Schultz and Schultz ch 4 and 5; Nisbett and Wilson 1977; Ericsson and Simon, Protocol Analysis; Foundations module 2.1 and 3.5",
  },
  {
    id: "hsys-l02-008",
    subject: S,
    topic: "functionalism",
    marks: 5,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net"],
    question: "How did Darwin's theory of evolution influence early psychology?",
    plan: ["Darwin's key ideas", "Continuity of species and animal psychology", "Variation and individual differences", "Adaptation and functionalism", "Later legacy"],
    answer: `## Darwin's ideas
Charles Darwin's theory of evolution by natural selection, published in 1859, held that individuals vary, that variations are inherited, and that those suited to their environment survive and reproduce more. His later book on emotional expression in 1872 extended these ideas to behaviour and emotion.

## Influence on psychology
- Continuity of species: if humans evolved from other animals, animal minds can teach us about human minds. George Romanes collected anecdotes of animal intelligence; Conwy Lloyd Morgan answered with his canon, that behaviour should not be explained by a higher mental faculty if a lower one will do. Comparative psychology, and later the animal laboratories of behaviourism, grew from this.
- Variation: Darwin's stress on differences between individuals inspired Galton's work on heredity, mental testing and correlation.
- Adaptation: if traits exist because they help survival, then consciousness too must have a function. This was the core question of functionalism, posed by James, Dewey and Angell.
- Development: interest in how traits unfold led to child study, including Darwin's own diary of his son's development.
- Emotion: his view that facial expressions are inherited and universal was later tested across cultures by Paul Ekman.

## Legacy
Darwin moved psychology from the analysis of adult consciousness towards behaviour, function, differences and development. Modern evolutionary psychology continues this line, though critics warn against untestable stories about why a trait evolved.`,
    keyPoints: ["Variation, inheritance, selection", "Continuity and comparative psychology", "Morgan's canon", "Variation and Galton", "Adaptation as the functionalist question", "Emotion and development"],
    pitfalls: ["Saying Darwin founded functionalism", "Ignoring Morgan's canon"],
    module: "foundations/2-1",
    visuals: [
      {
        kind: "flow",
        caption: "Influence on psychology",
        data: {
          title: "Darwin's ideas and what grew from them",
          layout: "tree",
          nodes: [
            { id: "d", label: "Evolution by natural selection", detail: "Published in 1859." },
            { id: "c", label: "Continuity", parent: "d", detail: "Comparative and animal psychology." },
            { id: "v", label: "Variation", parent: "d", detail: "Galton, testing, correlation." },
            { id: "a", label: "Adaptation", parent: "d", detail: "Functionalism." },
          ],
        },
      },
    ],
    ref: "Schultz and Schultz ch 6; Hergenhahn ch 10",
  },
  {
    id: "hsys-l02-009",
    subject: S,
    topic: "behaviourism",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "cuet-pg", "ugc-net"],
    question: "Describe John B. Watson's behaviourist manifesto and the main features of his behaviourism.",
    plan: ["Context and date of the manifesto", "Main claims", "Influences on Watson", "Key features of his system", "Little Albert and environmentalism", "Evaluation"],
    answer: `## Context
By 1913 introspection had failed to settle disputes between laboratories, and animal psychology was growing. In that year John Broadus Watson, at Johns Hopkins, gave a lecture and published the paper now called the behaviourist manifesto.

## Main claims
- Psychology is a purely objective, experimental branch of natural science.
- Its theoretical goal is the prediction and control of behaviour.
- Introspection has no place in its methods, and consciousness is not its subject matter.
- There is no dividing line between humans and animals; the same principles apply.

## Influences
- Ivan Pavlov's conditioned reflex gave a physiological unit of learning.
- Edward Thorndike's law of effect showed learning through consequences.
- Animal psychology and Morgan's canon encouraged simple explanations.
- The functionalist stress on adaptation and application.
- A broader positivist climate that valued only observable data.

## Features of Watson's system
- Methods: observation, conditioned reflex, verbal report treated as behaviour, and testing.
- Thinking is subvocal speech, small movements of the larynx; Watson called it implicit behaviour.
- Emotions are bodily reactions; he named three innate emotions in infants: fear, rage and love.
- Instincts were reduced to learned habits in his later work.
- Strong environmentalism: Watson claimed he could train any healthy infant to become any type of specialist, regardless of talents or ancestry.

## Little Albert
In 1920 Watson and Rosalie Rayner conditioned an eleven-month-old infant to fear a white rat by pairing it with a loud noise. The fear generalised to similar furry objects. The study showed that emotions can be learned, laid ground for behaviour therapy, and is now a standard example of unethical research: no informed consent, no deconditioning and harm to a child.

## Applications
Watson's student Mary Cover Jones in 1924 removed a fear of rabbits in a boy called Peter by bringing the rabbit closer while he ate, an early form of counterconditioning that later grew into systematic desensitisation. Watson also wrote popular advice on child rearing, urging parents to avoid affection, advice now rejected.

## Evaluation
Watson made psychology objective and practical, and behaviourism dominated American psychology until the 1950s. But his exclusion of mind made language, thought and memory hard to explain, his environmentalism was extreme, and his evidence was often thin. Watson left academic life in 1920 and applied psychology in advertising.`,
    keyPoints: ["Date and context of 1913", "Prediction and control as goal", "Rejection of introspection and consciousness", "Pavlov and Thorndike as influences", "Thought as subvocal speech, three infant emotions", "Environmentalism", "Little Albert with ethical critique"],
    pitfalls: ["Confusing Watson's methodological behaviourism with Skinner's radical behaviourism", "Missing the ethics of Little Albert"],
    module: "foundations/2-1",
    visuals: [{ kind: "figure", caption: "Little Albert", data: { id: "little-albert", title: "The Little Albert procedure" } }],
    ref: "Watson 1913; Watson and Rayner 1920; Foundations module 2.1; Harris 1979 on Little Albert",
  },
  {
    id: "hsys-l02-010",
    subject: S,
    topic: "behaviourism",
    marks: 5,
    difficulty: 1,
    exams: ["ma-semester", "cuet-pg"],
    question: "Write a short note on Ivan Pavlov's contribution to psychology.",
    plan: ["Who Pavlov was", "The discovery", "Key terms", "Main phenomena", "Importance"],
    answer: `## Who he was
Ivan Pavlov was a Russian physiologist who won the Nobel Prize in 1904 for work on digestion. While measuring salivation in dogs, he noticed that dogs began to salivate before food arrived, at the sight of the attendant or the sound of footsteps. He called these psychic secretions and spent the rest of his career studying them as conditioned reflexes.

## Key terms
- Unconditioned stimulus: food, which naturally produces salivation.
- Unconditioned response: salivation to food.
- Conditioned stimulus: a neutral stimulus such as a metronome, paired repeatedly with food.
- Conditioned response: salivation to the metronome alone.

## Main phenomena
- Acquisition: the conditioned response grows over pairings, best when the conditioned stimulus comes just before the food.
- Extinction: the response fades if the conditioned stimulus appears without food.
- Spontaneous recovery: after rest, an extinguished response returns.
- Generalisation and discrimination: responses spread to similar stimuli and can be narrowed by training.
- Experimental neurosis: when dogs had to discriminate a circle from an ellipse that became almost circular, they became agitated.

## Importance
Pavlov gave psychology an objective unit of learning that Watson used to build behaviourism. His ideas underlie behaviour therapies for phobias, explain conditioned responses in drug tolerance and craving, and remain basic to learning theory.`,
    keyPoints: ["Physiologist, Nobel Prize for digestion", "Discovery of psychic secretions", "US, UR, CS, CR", "Acquisition and extinction", "Generalisation, discrimination, spontaneous recovery", "Experimental neurosis", "Influence on behaviourism and therapy"],
    pitfalls: ["Saying Pavlov won the Nobel Prize for conditioning", "Mixing up conditioned and unconditioned terms"],
    module: "foundations/2-1",
    visuals: [{ kind: "figure", caption: "Key terms", data: { id: "pavlov-apparatus", title: "Pavlov's apparatus" } }],
    ref: "Foundations module 2.1; Learning and memory module 2.1; Pavlov 1927",
  },
];
