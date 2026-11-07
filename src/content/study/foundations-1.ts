/* Module · Foundations: history, schools, methods and Indian psychology, Parts I and II (Starting and Beginner levels). Original text written for VIBHA School of Psychology. */
export const part1 = String.raw`
# Part I · Starting: what psychology is and where it came from

## 1.1 What psychology is: definitions, goals and fields [core][starting]
The word comes from Greek: **psyche** (breath, soul, mind) and **logos** (study, account). The definition has changed with the field, and exams like to ask which definition belongs to which era:
| Era | Definition | Associated with |
|---|---|---|
| Ancient and medieval | Study of the soul | Plato, Aristotle |
| Late 1800s | Science of conscious experience; "the science of mental life" | Wundt; William James (1890) |
| 1913 to 1950s | Science of observable behaviour | John B. Watson, B. F. Skinner |
| From the 1960s | **Scientific study of behaviour and mental processes** | The modern consensus |

Each part of the modern definition matters. **Scientific** means claims are tested against evidence collected systematically. **Behaviour** means anything we can observe: speech, actions, facial expressions, reaction times. **Mental processes** means inner experience we infer: thoughts, memories, feelings, motives, dreams.

### Four goals
Psychology tries to:
1. **Describe**: what happens? (How common is exam anxiety among Class 12 students?)
2. **Explain**: why does it happen? (Is it linked to parental pressure, perfectionism, poor sleep?)
3. **Predict**: when will it happen? (Which students are most likely to develop severe anxiety?)
4. **Control or change**: can we influence it for the better? (Does a school-based relaxation programme reduce it?)

:::widget flow
{"title": "The four goals of psychology, one problem", "layout": "chain", "nodes": [{"id": "d", "label": "Describe", "detail": "What happens, and how often? A survey finds that many Class 12 students report severe exam anxiety."}, {"id": "e", "label": "Explain", "detail": "Why? Studies link it to perfectionism, parental pressure and poor sleep."}, {"id": "p", "label": "Predict", "detail": "Who is most at risk? Students high in perfectionism who sleep under six hours can be flagged early."}, {"id": "c", "label": "Control or change", "detail": "Can we help? A school relaxation and sleep programme is tested to see whether it lowers anxiety."}], "edgeLabels": {"d>e": "then ask why", "e>p": "use the cause", "p>c": "step in"}, "caption": "Each goal builds on the one before. You cannot change what you cannot explain, and you cannot explain what you have not described."}
:::

### Basic and applied
**Basic research** seeks knowledge for its own sake (how memory is organised). **Applied research** solves practical problems (how to help older adults remember to take their medicines). The line is blurry: basic memory research led to better ways of studying.

:::widget compare
{"title": "Basic or applied research?", "a": {"label": "Basic", "points": ["Asks how something works", "Knowledge for its own sake", "How is memory organised?", "May find uses only years later"], "summary": "Basic research builds the theory that applied work stands on."}, "b": {"label": "Applied", "points": ["Asks how to solve a practical problem", "Knowledge for use now", "How can older adults remember their tablets?", "Often leads to new basic questions"], "summary": "Applied research turns theory into help. The line is blurry: memory theory led straight to better study methods."}}
:::

### Levels and perspectives
A single behaviour can be studied at several **levels of analysis**: **biological** (genes, brain, hormones), **psychological** (thoughts, emotions, learning) and **social-cultural** (family, community, culture). Together these make the **biopsychosocial** approach.

The main **perspectives** you will meet in this module and across the course:
| Perspective | Main question | Example: a child who bullies others |
|---|---|---|
| **Biological** | What brain and body processes are involved? | Temperament, testosterone, frontal lobe maturity |
| **Evolutionary** | How did this help our ancestors survive and reproduce? | Status-seeking in groups |
| **Psychodynamic** | What unconscious conflicts drive it? | Displaced anger from a harsh home |
| **Behavioural** | How was it learned and reinforced? | Bullying gets attention and goods |
| **Cognitive** | How does the child think about others? | Hostile attribution bias: reads accidents as attacks |
| **Humanistic** | What blocks growth and self-worth? | Low self-regard, lack of unconditional acceptance |
| **Sociocultural** | How do culture and setting shape it? | School norms, caste or class hierarchies, peer groups |

:::widget sort
{
  "prompt": "Which perspective is each explanation coming from?",
  "buckets": ["Biological", "Behavioural", "Cognitive", "Sociocultural"],
  "items": [
    { "text": "Her panic attacks run in the family and involve an overactive amygdala", "bucket": 0 },
    { "text": "He keeps skipping class because each time he skips, his anxiety drops", "bucket": 1 },
    { "text": "She believes one mistake means she is a total failure", "bucket": 2 },
    { "text": "In his village, a man who cries in public is mocked, so he never shows distress", "bucket": 3 },
    { "text": "Low serotonin activity is linked to his impulsive aggression", "bucket": 0 },
    { "text": "She expects every new teacher to dislike her and reads neutral faces as angry", "bucket": 2 }
  ]
}
:::


:::widget layers
{
  "title": "Three levels of analysis",
  "shape": "rings",
  "layers": [
    { "label": "Biological", "detail": "Genes, brain circuits, hormones, sleep, illness. The innermost level, inside the body." },
    { "label": "Psychological", "detail": "Thoughts, emotions, learning, memory, motives, personality." },
    { "label": "Social and cultural", "detail": "Family, peers, school, caste and class, religion, language, media, the economy." }
  ],
  "caption": "One behaviour, such as exam anxiety, can be studied at every ring. The biopsychosocial approach asks how the rings act on each other."
}
:::

### The fields of psychology
Psychology has grown into dozens of fields. A few you will meet in Indian MA programmes and entrance exams:
- **Clinical**: assessment and treatment of mental disorders. In India, practising as a clinical psychologist requires registration with the **Rehabilitation Council of India (RCI)**.
- **Counselling**: helping people with everyday adjustment, career and relationship issues.
- **Developmental**: change across the lifespan.
- **Social**: how people think about, influence and relate to each other.
- **Cognitive**: attention, perception, memory, language, thinking.
- **Biological (biopsychology, neuropsychology)**: brain and behaviour.
- **Industrial-organisational**: people at work.
- **Health, educational and school, forensic, sports, environmental, community, positive and cyberpsychology**: the applied fields, taught in the applied module.

:::trap Psychologist or psychiatrist?
A **psychiatrist** is a medical doctor (MBBS plus MD or DNB in psychiatry) who can prescribe medicines. A **clinical psychologist** in India holds an RCI-recognised professional qualification (M.Phil in Clinical Psychology, now being replaced by the two-year M.A. or M.Sc. in Clinical Psychology, or a PsyD) and provides assessment and psychotherapy but does not prescribe. A **counsellor** may have a master's in psychology or counselling without RCI registration. Entrance interviews often ask you to explain these differences clearly.
:::

:::clinician
Definitional debates are not trivial. The behaviourist definition (1913) excluded consciousness as unscientific; the cognitive revolution readmitted mental processes as theoretical constructs inferred from behaviour (reaction times, error patterns), which is the methodological sense of "mental processes" in the modern definition. A frequent PG question asks whether psychology is a natural science (Naturwissenschaft) or a human science (Geisteswissenschaft); Wilhelm Dilthey's distinction between **explaining** (Erklären, causal laws) and **understanding** (Verstehen, grasping meaning from within) underlies this, and is why Dilthey appears among the "four founding paths" of academic psychology in the UGC NET syllabus (Wundt, Freud, James, Dilthey). Indian scholars (Paranjpe; Misra) argue that Indian traditions add a third aim, **self-knowledge and transformation**, which neither explanation nor understanding fully captures. You will return to this in the section on paradigms.
:::

:::recall
1. Give the modern definition of psychology. || The scientific study of behaviour and mental processes.
2. Who defined psychology as "the science of mental life"? || William James, in his great 1890 textbook.
3. What are the four goals of psychology? || Describe, explain, predict, control or change.
4. Name the three levels of analysis in the biopsychosocial approach. || Biological, psychological and social-cultural.
5. Which body registers clinical psychologists in India? || The Rehabilitation Council of India (RCI).
:::

:::mcq
Q: Watson's 1913 definition of psychology emphasised:
- *Observable behaviour only
- Conscious experience studied by introspection
- The unconscious mind
- The soul
> Watson excluded consciousness and focused on observable behaviour.

Q: A researcher wants to know whether a school yoga programme lowers exam anxiety. Which goal of psychology does this mainly serve?
- Describe
- Explain
- Predict
- *Control or change
> Testing an intervention aims to change behaviour for the better.
:::

## 1.2 How psychologists find things out: the methods [core][starting]
A method is a set of rules for collecting evidence so that other people can check it. Each method answers a different kind of question, and each has strengths and blind spots.


:::widget flow
{
  "title": "Which method fits the question?",
  "layout": "tree",
  "nodes": [
    { "id": "q", "label": "What do you want to know?", "detail": "Start from the question, not from a favourite method." },
    { "id": "cause", "label": "Does X cause Y?", "parent": "q", "detail": "Only an experiment with random assignment can answer this directly." },
    { "id": "exp", "label": "Experiment (lab or field)", "parent": "cause", "detail": "Manipulate the IV, measure the DV, randomise, control confounds. If groups already exist, use a quasi-experiment and say so." },
    { "id": "rel", "label": "Do X and Y go together?", "parent": "q", "detail": "Correlational study: measure both and compute r. No causal claim." },
    { "id": "what", "label": "What happens, how often, in whom?", "parent": "q", "detail": "Observation, surveys and tests describe behaviour and its frequency." },
    { "id": "deep", "label": "What is it like, and what does it mean?", "parent": "q", "detail": "Case studies and qualitative interviews give depth and meaning, not generalisation." },
    { "id": "time", "label": "How does it change over time?", "parent": "q", "detail": "Longitudinal designs follow the same people; cross-sectional designs compare age groups at one time." }
  ],
  "caption": "Tap each branch. Exam answers score higher when the method is justified by the question."
}
:::

### Introspection
**Introspection** means looking inward and reporting your own conscious experience. Wundt used **trained** observers reporting immediate experience under controlled conditions (the colour, intensity and duration of a light). Titchener pushed it further, asking observers to break experience into its elements. Introspection fell out of favour because trained observers in different labs **disagreed** and there was no way to settle disputes (the "imageless thought" controversy with the Würzburg school). Today, careful self-report remains essential in questionnaires, interviews and **think-aloud** protocols, and contemplative traditions (including Indian ones) are being studied as forms of trained first-person observation.

### Observation
- **Naturalistic observation**: watching behaviour in its natural setting without interfering (children's play at an anganwadi, chimpanzees in Gombe as Jane Goodall did).
- **Participant observation**: the researcher joins the group (living in a slum community to study its support networks).
- **Controlled (laboratory) observation**: observing in a structured setting, such as the Strange Situation.

The main risks are **observer bias** (seeing what you expect) and **reactivity** (people behave differently when watched, the Hawthorne effect). Clear coding schemes and **inter-rater reliability** help.

### Case study
An in-depth study of one person, group or event. **Phineas Gage** (frontal lobe injury), **H.M.** (amnesia after hippocampal surgery) and Freud's patients are famous cases. Case studies give rich detail and can challenge theories, but they cannot establish cause or be generalised safely.

### Surveys, interviews and tests
**Surveys** ask many people the same questions. The key is a **representative sample**: one that reflects the population. The **wording** and **order** of questions can change answers, and people may give **socially desirable** responses. **Psychological tests** measure abilities, traits or symptoms with standardised items, scoring and norms.

### Correlational research
A **correlation** measures how strongly two variables move together, from −1 through 0 to +1. A correlation of +0.6 between hours of sleep and exam marks means more sleep tends to go with higher marks.

:::widget compare
{"title": "A correlational study or an experiment?", "a": {"label": "Correlational", "points": ["Measures two variables as they are", "Sleep hours and exam marks in 300 students", "Shows whether and how strongly they move together", "Cannot show which causes which, or rule out a third factor"], "summary": "Use it when you cannot or should not manipulate the variable, such as smoking or poverty."}, "b": {"label": "Experiment", "points": ["Manipulates one variable, measures another", "Students randomly assigned to 8 or 5 hours of sleep before a test", "Holds everything else constant", "Can show cause and effect"], "summary": "Only an experiment with random assignment can show that one thing causes another."}}
:::

:::trap Correlation is not causation
If sleep and marks are correlated, sleep might improve marks, good marks might reduce worry and improve sleep (**reverse causation**), or a third factor such as a calm home environment might improve both (**third-variable problem**). Only an experiment can test cause directly.
:::

### Experiments
An **experiment** is the only method that can establish **cause and effect**. The researcher:
1. Manipulates an **independent variable (IV)**: the presumed cause.
2. Measures a **dependent variable (DV)**: the presumed effect.
3. Uses **random assignment** so that groups are equal on average before the manipulation.
4. Keeps everything else constant to avoid **confounding variables**.
5. Compares an **experimental group** with a **control group**.

:::widget sort
{"prompt": "A study in Pune: students are randomly assigned to learn a word list with music playing or in silence, then their recall is counted. Everyone studies for 10 minutes, in the same room, at the same time of day. Label each part.", "buckets": ["Independent variable", "Dependent variable", "Controlled variable", "Balanced by random assignment"], "items": [{"text": "Music or silence while studying", "bucket": 0, "why": "This is what the researcher changes on purpose."}, {"text": "Number of words recalled", "bucket": 1, "why": "This is what is measured to see the effect."}, {"text": "Ten minutes of study for everyone", "bucket": 2, "why": "Kept the same so it cannot explain a difference."}, {"text": "The same room and the same time of day", "bucket": 2, "why": "Held constant by design."}, {"text": "How well each student slept the night before", "bucket": 3, "why": "It cannot be held constant, but random assignment spreads good and poor sleepers evenly across both groups."}, {"text": "Each student's natural memory ability", "bucket": 3, "why": "Random assignment makes the groups equal on average."}]}
:::

:::widget decide
{
  "scene": "A researcher in Jaipur finds that students who drink more tea score higher on attention tests. She wants to tell parents that tea improves attention.",
  "ask": "What should she do before making that claim?",
  "choices": [
    { "label": "Publish the claim: the correlation is strong", "verdict": "harm", "outcome": "Parents push tea on children, and a later study finds no effect.", "why": "Correlation cannot show causation; a third factor (sleep, age, wealth) may explain both." },
    { "label": "Run an experiment: randomly assign students to drink tea or a matched caffeine-free drink, then measure attention blind", "verdict": "best", "outcome": "She finds a small, short-lived effect of caffeine, not of tea itself.", "why": "Random assignment and a control group let her test cause and separate caffeine from tea." },
    { "label": "Survey more students to make the correlation stronger", "verdict": "ok", "outcome": "The correlation is more precise but still says nothing about cause.", "why": "More data improves the estimate but not the design." }
  ]
}
:::


:::widget flow
{
  "title": "The logic of an experiment",
  "layout": "chain",
  "nodes": [
    { "id": "h", "label": "Hypothesis", "detail": "Caffeine improves attention in students." },
    { "id": "ra", "label": "Random assignment", "detail": "Each student has an equal chance of being in either group, so groups are equal on average in sleep, age, wealth." },
    { "id": "iv", "label": "Manipulate the IV", "detail": "One group gets caffeinated tea, the other an identical caffeine-free drink." },
    { "id": "ctl", "label": "Hold everything else constant", "detail": "Same time of day, same room, same instructions; testers do not know who got what." },
    { "id": "dv", "label": "Measure the DV", "detail": "Scores on the same attention test." },
    { "id": "cmp", "label": "Compare groups", "detail": "A reliable difference can be put down to the IV, because alternatives were controlled." }
  ],
  "caption": "Remove any link in this chain and the causal conclusion weakens."
}
:::

### Other designs you must know
- **Field experiment**: an experiment in a real setting (testing a new teaching method in actual classrooms).
- **Quasi-experiment**: like an experiment but without random assignment, because groups already exist (comparing schools that chose to adopt a programme with those that did not).
- **Cross-sectional** design: compares different age groups at one time (quick, but confounds age with generation).
- **Longitudinal** design: follows the same people over time (shows change, but costly and people drop out).
- **Qualitative methods**: in-depth interviews, focus groups and ethnography, analysed for themes and meaning rather than numbers.
- **Meta-analysis**: a statistical summary of many studies on the same question.

### Ethics
Modern research follows ethical codes (APA; in India, the ICMR's national ethical guidelines for biomedical and health research). Core principles: **informed consent**, **right to withdraw**, **confidentiality**, **minimising harm**, and **debriefing** after any deception. Studies such as Milgram's obedience experiments and the Stanford prison study pushed these rules into place.

:::widget decide
{"scene": "Ritika, an MA student in Jaipur, plans a study of exam anxiety in Class 9. Her plan: hand out a questionnaire in class, ask for names so she can match scores to marks, and not tell parents because 'it is only a questionnaire'. Some items ask about thoughts of self-harm.", "ask": "What should her supervisor tell her?", "choices": [{"label": "Go ahead: questionnaires carry no risk", "verdict": "harm", "outcome": "Minors take part without parental consent, names link sensitive answers, and a student who reports self-harm thoughts gets no help.", "why": "Children cannot give full consent alone, and self-harm items create a duty to act. This breaks consent, confidentiality and minimising harm."}, {"label": "Get the principal's written permission, then proceed as planned", "verdict": "ok", "outcome": "The school is informed, but parents and students are not asked, and the safety gap remains.", "why": "Institutional permission is needed but does not replace parental consent and the child's own assent."}, {"label": "Get ethics approval, school permission, parental consent and each student's assent; use codes instead of names; explain the right to withdraw; and set up a referral path to the school counsellor for any student who reports self-harm thoughts", "verdict": "best", "outcome": "The study runs safely, and a few at-risk students are connected to help.", "why": "This covers informed consent and assent, confidentiality, the right to withdraw and minimising harm, which are the core principles of research ethics with children."}]}
:::

:::clinician
Two methodological issues dominate PG discussions. First, **WEIRD samples**: Henrich, Heine and Norenzayan (2010) showed that most published participants are Western, Educated, Industrialised, Rich and Democratic, yet are often the least typical humans on visual illusions, fairness, self-concept and moral reasoning. Indian samples are under-represented and often urban, English-speaking and student-based, which limits generalisation even within India. Second, the **replication crisis**: a large collaborative project in 2015 repeated 100 studies from leading psychology journals; about 97% of originals had significant results versus about 36% of replications, with effect sizes roughly halved. Responses include pre-registration, registered reports, larger samples and open data. Detailed design, sampling and statistics are taught in the research methods and statistics modules; here the aim is to place the methods in the history of the discipline.
:::

:::recall
1. Why did introspection decline as a method? || Trained observers in different labs disagreed and there was no way to settle disputes.
2. What is the Hawthorne effect? || People change their behaviour because they know they are being observed.
3. Give two reasons a correlation does not show causation. || Reverse causation and the third-variable problem.
4. What two features make a study a true experiment? || Manipulation of an independent variable and random assignment to conditions.
5. What is the difference between a cross-sectional and a longitudinal design? || Cross-sectional compares different age groups at one time; longitudinal follows the same people over time.
:::

:::mcq
Q: A psychologist compares memory in 20-, 40- and 60-year-olds tested in the same month. Differences between the groups could reflect age or:
- Random assignment
- The Hawthorne effect
- *Generation (cohort) effects
- Reverse causation
> Cross-sectional designs confound age with cohort.

Q: Which method can establish cause and effect?
- A case study
- *An experiment with random assignment
- A survey
- Naturalistic observation
> Only experiments manipulate the cause and control alternatives.
:::

## 1.3 From philosophy to the laboratory [core][starting]
Psychology became a separate science in the late 1800s, but its questions are ancient. Two streams fed it: **philosophy** (what is the mind, how do we know?) and **physiology** (how do nerves and senses work?).

### Philosophical roots
- **Plato** (around 400 BCE): knowledge is innate and recalled through reason (**rationalism**, **nativism**); the soul has reason, spirit and appetite.
- **Aristotle**: wrote the first systematic account of the mind (the soul); knowledge comes through the senses; memory works by **association** (similarity, contrast, contiguity).
- **René Descartes** (1600s): **mind-body dualism**: mind and body are different substances that interact (he suggested the pineal gland as the meeting point); the body works like a machine through **reflexes**. "I think, therefore I am."
- **British empiricists**: **John Locke** said the mind at birth is a **tabula rasa** (blank slate) written on by experience; **Berkeley**, **Hume**, **Hartley** and **James Mill** developed **associationism**, the idea that complex ideas are built from simple ones by association. **John Stuart Mill** added **mental chemistry**: combined ideas can produce something new, as water differs from hydrogen and oxygen.
- **Immanuel Kant**: the mind brings built-in categories (space, time, causality) to experience; he also doubted that the mind could ever be measured.

:::widget compare
{"title": "Where does knowledge come from?", "a": {"label": "Rationalism and nativism", "points": ["Plato, Descartes, Kant", "Some knowledge is inborn or built into the mind", "Reason is the main route to truth", "The mind brings categories such as space, time and cause"], "summary": "The sheet comes pre-printed. Modern echoes: Chomsky's universal grammar and infant core knowledge."}, "b": {"label": "Empiricism and associationism", "points": ["Aristotle, Locke, Hume, the Mills", "The mind starts as a blank slate", "Knowledge comes through the senses", "Complex ideas are built by association"], "summary": "Experience writes on the sheet. Modern echoes: learning theory and behaviourism."}, "caption": "This is the start of the nature-nurture debate. Today's answer is that both matter, and they interact."}
:::

:::analogy The great debate in one image
Locke: the mind is a blank sheet that experience writes on. Plato and Kant: the sheet comes pre-printed with lines and margins. The **nature-nurture** debate starts here, and modern psychology's answer is that both matter and interact.
:::

### Physiological roots
- **Bell-Magendie law** (early 1800s): sensory nerves enter the spinal cord at the back, motor nerves leave at the front.
- **Johannes Müller**: **specific nerve energies**: each sensory nerve produces its own kind of sensation, however it is stimulated (pressing on the eye produces light).
- **Hermann von Helmholtz**: measured the **speed of nerve conduction** (about 30 metres a second in frogs, far slower than people expected), showing that mental processes take measurable time; also developed the trichromatic theory of colour vision.
- **Paul Broca** (1861) and later **Carl Wernicke**: language areas of the brain; **Fritsch and Hitzig** (1870): electrical stimulation of the motor cortex.


:::widget actionpotential
{"title":"Helmholtz's discovery: nerve signals take time","myelinated":true,"caption":"Helmholtz measured nerve conduction at about 30 metres a second in frogs. Push the neuron past threshold (it fires all or none), then switch myelin off and watch conduction slow. Mental processes take measurable time."}
:::

:::widget brainexplorer
{"title":"What Broca and Wernicke found","focus":["broca","wernicke","motor","temporal","frontal"],"caption":"Tap Broca, then Wernicke, and switch on damage for each. Two small patches of cortex, two very different language problems: the first strong evidence that mental functions live in particular places."}
:::

### Psychophysics: measuring the mind
**Ernst Weber** found that the **just noticeable difference (JND)** between two stimuli is a **constant proportion** of the original stimulus (**Weber's law**). If you can just tell 100 g from 102 g, you will just tell 200 g from 204 g.

**Gustav Fechner**, in **Elements of Psychophysics (1860)**, extended this: sensation grows with the **logarithm** of stimulus intensity (**Fechner's law**). He developed three classic methods: **limits**, **constant stimuli** and **adjustment**. Fechner showed that the relation between mind and the physical world could be **measured**, answering Kant.

:::widget guess
{
  "prompt": "Weber's law: if you can just tell a 100 g packet from a 102 g packet, what is the smallest difference you could notice with a 500 g packet?",
  "min": 1,
  "max": 50,
  "unit": "grams",
  "answer": [9, 11],
  "reveal": "About 10 g. The Weber fraction here is 2%, and 2% of 500 g is 10 g. The noticeable difference grows in proportion to the stimulus.",
  "clinician": "Weber fractions differ by modality (roughly 2% for lifted weights, around 8% for brightness and 10% for loudness, far larger for taste), and the law breaks down at very low and very high intensities. Stevens later proposed a power law (sensation as intensity raised to an exponent that differs by modality), which fits magnitude-estimation data better than Fechner's logarithmic law."
}
:::


:::widget flow
{
  "title": "From psychophysics to a new science",
  "layout": "chain",
  "nodes": [
    { "id": "f", "label": "1860: Fechner", "detail": "Psychophysics: the relation between stimulus and sensation can be measured." },
    { "id": "w", "label": "1879: Wundt's laboratory", "detail": "Leipzig. The conventional birth date of experimental psychology." },
    { "id": "e", "label": "1885: Ebbinghaus", "detail": "Memory studied experimentally with nonsense syllables." },
    { "id": "j", "label": "1890: James", "detail": "His two-volume textbook: stream of consciousness, habit, self, emotion." },
    { "id": "a", "label": "1892: APA founded", "detail": "G. Stanley Hall founds the American Psychological Association." }
  ],
  "caption": "Five dates that examiners love. Press Play to walk them in order."
}
:::

### The birth of a science
**Wilhelm Wundt** set up the first formal psychology laboratory at the **University of Leipzig in 1879**, which is taken as the birth of experimental psychology. He wrote the first textbook of physiological psychology (1873 to 1874), trained many of the first generation of psychologists (including Titchener, James McKeen Cattell and Oswald Külpe) and founded the first psychology journal. Key ideas:
- **Voluntarism**: the mind actively organises experience (apperception).
- The **tridimensional theory of feeling**: pleasant-unpleasant, tension-relaxation, excitement-calm.
- **Völkerpsychologie** (folk or cultural psychology, in ten volumes): higher mental processes such as language, myth and custom must be studied through cultural products, not laboratory introspection.

:::widget timeline
{"prompt": "Order the steps that turned psychology from philosophy into a laboratory science.", "events": [{"label": "Weber shows the just noticeable difference is a fixed fraction", "when": "1834"}, {"label": "Helmholtz measures the speed of the nerve impulse", "when": "1850"}, {"label": "Fechner founds psychophysics", "when": "1860"}, {"label": "Wundt opens the first psychology laboratory at Leipzig", "when": "1879"}, {"label": "Ebbinghaus publishes the first experiments on memory", "when": "1885"}, {"label": "William James publishes his great textbook of psychology", "when": "1890"}], "why": "Physiology and psychophysics showed that mental events could be timed and measured. Wundt then gave psychology its own laboratory, and the new science spread quickly."}
:::

Around him:
- **Hermann Ebbinghaus** (1885) studied memory on himself with **nonsense syllables** and drew the **forgetting curve**: rapid loss soon after learning, then a slower decline.
- **William James** published his two-volume textbook of psychology (1890), introducing the stream of consciousness, habit, the self and his theory of emotion.
- **Francis Galton** studied individual differences, heredity and early mental tests, and introduced correlation (refined by Pearson).
- **G. Stanley Hall** founded the American Psychological Association in 1892 and studied adolescence.

:::widget sort
{
  "prompt": "Put each contribution with its pioneer.",
  "buckets": ["Fechner", "Wundt", "Ebbinghaus", "Helmholtz"],
  "items": [
    { "text": "First formal psychology laboratory, Leipzig, 1879", "bucket": 1 },
    { "text": "Elements of Psychophysics, 1860", "bucket": 0 },
    { "text": "Nonsense syllables and the forgetting curve", "bucket": 2 },
    { "text": "Measured the speed of nerve conduction", "bucket": 3 },
    { "text": "Völkerpsychologie: studying culture through language and myth", "bucket": 1 },
    { "text": "Sensation grows with the logarithm of intensity", "bucket": 0 }
  ]
}
:::

:::clinician
Historiographers warn against "great man" and presentist accounts. Wundt is often misrepresented through Titchener's lens: he did not reduce psychology to introspective elements, his laboratory used mainly reaction-time and psychophysical methods with brief, controlled self-reports, and his Völkerpsychologie anticipated cultural psychology (1990, is the standard revisionist account). James had a demonstration laboratory at Harvard from 1875 but did not use it for systematic research. For dates, exams commonly expect: Fechner 1860, Wundt's laboratory 1879, Ebbinghaus 1885, James 1890, APA 1892. Kuhn would call the late nineteenth century "pre-paradigmatic" for psychology: several schools competed without a shared paradigm, which is the frame for the next part.
:::

:::recall
1. What did Locke mean by tabula rasa? || The mind at birth is a blank slate written on by experience.
2. State Weber's law. || The just noticeable difference is a constant proportion of the original stimulus.
3. What is Fechner's main book and its year? || His founding work on psychophysics, 1860.
4. Where and when did Wundt open the first psychology laboratory? || Leipzig, 1879.
5. What was Wundt's Völkerpsychologie? || A ten-volume cultural or folk psychology studying higher mental processes through language, myth and custom.
6. What did Ebbinghaus's forgetting curve show? || Rapid forgetting soon after learning, then a slower decline.
:::

:::mcq
Q: Pressing on your closed eye produces a sensation of light. This illustrates:
- Weber's law
- The Bell-Magendie law
- *Müller's doctrine of specific nerve energies
- Associationism
> Each sensory nerve produces its own kind of sensation however it is stimulated.

Q: Which pair is correctly matched?
- Descartes: tabula rasa
- Locke: mind-body dualism
- Kant: forgetting curve
- *J. S. Mill: mental chemistry
> Mill argued combined ideas can create something new.
:::


:::widget curve
{
  "kind": "forgetting",
  "title": "Ebbinghaus's forgetting curve, and what spaced review does",
  "caption": "Ebbinghaus found that forgetting is fastest soon after learning. Add reviews and watch the curve flatten: the same principle is behind the spaced checkpoints in this course."
}
:::

## 1.4 Indian psychological thought: the starting picture [core][starting]
India did not have "psychology departments" until the twentieth century, but it had thousands of years of careful thinking about the **mind, the self, consciousness, suffering and how to change**. Scholars such as **K. Ramakrishna Rao, Anand Paranjpe and Ajit Dalal** define **Indian psychology** as psychology **rooted in the Indian traditions of thought and practice**, not simply psychology done in India by Indians.

### Where the ideas come from
- **The Vedas and Upanishads**: early texts on the self (atman), consciousness and ultimate reality (Brahman).
- **The six classical systems (darshanas)**: "darshana" means a way of seeing. They come in three pairs:
| Pair | System and its founding text or figure | Main psychological interest |
|---|---|---|
| 1 | **Nyaya** (Gautama) and **Vaisheshika** (Kanada) | Logic, valid knowledge, categories of reality |
| 2 | **Samkhya** (Kapila) and **Yoga** (Patanjali) | Consciousness versus nature, the three gunas, mental states and their control |
| 3 | **Mimamsa** (Jaimini) and **Vedanta** (Badarayana) | Ritual and duty; the self and reality |
- **Heterodox (nastika) systems** that do not accept Vedic authority: **Buddhism**, **Jainism** and the materialist **Charvaka (Lokayata)**.
- **Later traditions**: the **Bhagavad Gita**, Bhakti movements, **Sufism**, and modern thinkers such as **Sri Aurobindo** and Swami Vivekananda.

### What Indian thought emphasises
| Emphasis | Typical Western academic psychology | Indian traditions |
|---|---|---|
| Goal | Explain and predict behaviour | Understand and **transform** the self; freedom from suffering (moksha) |
| Consciousness | Product of the brain; one topic among many | Fundamental; the central topic |
| Self | A construct: self-concept, identity | Layers of self; a deeper self (atman) behind the changing ego |
| Method | Third-person observation and experiment | Also **first-person**, trained contemplation (meditation, self-inquiry) |
| Good life | Wellbeing, adjustment | Equanimity, non-attachment, wisdom, service |

:::widget compare
{"title": "Two traditions, two emphases", "a": {"label": "Western academic psychology", "points": ["Goal: explain and predict behaviour", "Consciousness: a product of the brain", "Self: a construct such as self-concept", "Method: third-person observation and experiment", "Good life: wellbeing and adjustment"], "summary": "Strong on measurement, testing and replication."}, "b": {"label": "Indian traditions", "points": ["Goal: understand and transform the self", "Consciousness: fundamental, the central topic", "Self: layers, with a deeper atman behind the ego", "Method: also trained first-person contemplation", "Good life: equanimity, non-attachment, wisdom"], "summary": "Strong on inner experience and on practices for changing it."}, "caption": "The two are not rivals. Mindfulness research is one place where they have already met."}
:::

### Two ideas you will meet everywhere
**The three gunas (triguna)**, from Samkhya: everything in nature, including the mind, is a mix of three qualities:
- **Sattva**: clarity, calm, balance, knowledge, goodness.
- **Rajas**: activity, passion, restlessness, desire.
- **Tamas**: inertia, dullness, confusion, heaviness.

All three are always present; their balance shifts with food, habits, company and practice.

**The five sheaths (panchakosha)**, from the **Taittiriya Upanishad**: the person is pictured as five nested layers, from the outermost to the innermost:
1. **Annamaya kosha**: the physical body, "made of food".
2. **Pranamaya kosha**: the vital layer of breath and energy.
3. **Manomaya kosha**: the mind of thoughts, feelings and senses.
4. **Vijnanamaya kosha**: the discerning intellect and wisdom.
5. **Anandamaya kosha**: the layer of bliss, closest to the self.


:::widget layers
{
  "title": "The five koshas (sheaths) of the person",
  "shape": "rings",
  "layers": [
    { "label": "Anandamaya kosha", "detail": "The sheath of bliss, closest to the self." },
    { "label": "Vijnanamaya kosha", "detail": "The discerning intellect, wisdom and judgement." },
    { "label": "Manomaya kosha", "detail": "The mind of thoughts, feelings and the senses." },
    { "label": "Pranamaya kosha", "detail": "The vital layer: breath and energy." },
    { "label": "Annamaya kosha", "detail": "The physical body, 'made of food'. The outermost sheath." }
  ],
  "caption": "From the Taittiriya Upanishad. Tap from the centre outwards. Yoga therapy plans care at every ring."
}
:::

:::widget layers
{
  "title": "The three gunas",
  "shape": "stack",
  "layers": [
    { "label": "Sattva", "detail": "Clarity, calm, balance, knowledge, contentment." },
    { "label": "Rajas", "detail": "Activity, passion, restlessness, desire. Drives all action." },
    { "label": "Tamas", "detail": "Inertia, dullness, confusion, heaviness. Needed in small measure for rest and sleep." }
  ],
  "caption": "All three are always present in the mind and in nature; what changes is their balance. They are qualities from Samkhya, not Ayurvedic doshas."
}
:::

:::example Panchakosha in a Bengaluru yoga university
At **S-VYASA** (Swami Vivekananda Yoga Anusandhana Samsthana), near Bengaluru, an **Integrated Approach to Yoga Therapy** plans treatment across all five koshas: postures and diet for the body, breathing practices for the vital layer, relaxation and devotional chanting for the mind, counselling and self-study for the intellect, and service and joy for the innermost layer. Trials from this group report benefits in anxiety, depression and chronic illness, though many are small. The model gives a biopsychosocial-spiritual map in Indian terms.
:::

:::widget sort
{
  "prompt": "Sattva, rajas or tamas? Sort each description.",
  "buckets": ["Sattva", "Rajas", "Tamas"],
  "items": [
    { "text": "A calm, clear mind that sees a problem as it is", "bucket": 0 },
    { "text": "Restless ambition that cannot sit still", "bucket": 1 },
    { "text": "Sleeping till noon, dull and unwilling to start anything", "bucket": 2 },
    { "text": "Anger and craving that push you to act at once", "bucket": 1 },
    { "text": "Confusion and denial about something obvious", "bucket": 2 },
    { "text": "Contentment, kindness and the wish to understand", "bucket": 0 }
  ]
}
:::

:::trap Gunas are not doshas
The **three gunas** (sattva, rajas, tamas) are qualities of mind and nature from **Samkhya**. The **three doshas** (vata, pitta, kapha) are bodily humours from **Ayurveda**. Exams mix them up deliberately. Also, gunas are not simply "good, average, bad": rajas drives all action, and some tamas is needed for rest and sleep.
:::

:::clinician
Distinguish three terms that the literature often blurs: (1) **psychology in India** (the discipline as practised in Indian institutions, largely Western in origin); (2) **indigenous Indian psychology** (concepts and methods drawn from Indian culture and life, studied empirically); and (3) **Indian psychology** in the narrower sense developed by Rao, Paranjpe and Dalal, a psychology derived from classical Indian thought, which treats consciousness as primary and gives first-person, transformative methods a legitimate place. The Pondicherry **Manifesto of Indian Psychology** (2002) argued for this third sense. Critics (discussed in Part III) warn that the label can privilege Sanskritic, Brahminical and Hindu texts over Buddhist, Jain, Islamic, Dalit, tribal and folk traditions, and that some claims are framed in ways that resist testing. A balanced PG answer presents Indian psychology as a source of theory, method and practice that should be tested and debated like any other.
:::

:::recall
1. How do Rao, Paranjpe and Dalal define Indian psychology? || Psychology rooted in Indian traditions of thought and practice, not just psychology done in India.
2. Name the six darshanas in their pairs. || Nyaya-Vaisheshika, Samkhya-Yoga, Mimamsa-Vedanta.
3. Name the three nastika systems. || Buddhism, Jainism and Charvaka (Lokayata).
4. Name the three gunas and one feature of each. || Sattva (clarity, calm), rajas (activity, restlessness), tamas (inertia, dullness).
5. List the five koshas from outer to inner. || Annamaya, pranamaya, manomaya, vijnanamaya, anandamaya.
6. Which text describes the panchakosha? || The Taittiriya Upanishad.
:::

:::mcq
Q: Which of these is NOT one of the three gunas?
- Sattva
- *Pitta
- Rajas
- Tamas
> Pitta is an Ayurvedic dosha, not a guna.

Q: In the panchakosha model, the layer of thoughts, emotions and the senses is:
- *Manomaya kosha
- Annamaya kosha
- Pranamaya kosha
- Vijnanamaya kosha
> Manomaya is the mental-emotional layer; vijnanamaya is the discerning intellect.
:::

## 1.5 Level check · Starting [core][starting]
Score 80% or more to open the Beginner level.

:::mcq
Q: The modern definition of psychology is the scientific study of:
- The soul
- Conscious experience only
- *Behaviour and mental processes
- Observable behaviour only
> Both behaviour and inferred mental processes.

Q: "The science of mental life" is the definition given by:
- Watson
- Skinner
- Wundt
- *William James
> James, Principles of Psychology (1890).

Q: Predicting which students are most likely to develop severe exam anxiety serves which goal?
- Describe
- *Predict
- Explain
- Control
> Forecasting who or when is prediction.

Q: Explaining a child's aggression through hostile attribution bias is which perspective?
- *Cognitive
- Behavioural
- Biological
- Humanistic
> Interpretations and beliefs are the cognitive perspective.

Q: Students who sleep more tend to get better marks. The best conclusion is:
- *The two are related, but the cause is unknown without an experiment
- Sleep causes better marks
- Good marks cause better sleep
- There is no relationship
> Correlation does not establish causation.

Q: In an experiment, the variable the researcher manipulates is the:
- Dependent variable
- *Independent variable
- Confounding variable
- Control variable
> The IV is the presumed cause.

Q: Workers who improve their output simply because they know they are being studied show:
- Observer bias
- Social desirability
- *The Hawthorne effect
- A cohort effect
> Reactivity to being observed.

Q: The idea that the mind is a blank slate at birth comes from:
- Plato
- Descartes
- Kant
- *John Locke
> Tabula rasa.

Q: Who proposed that mind and body are separate substances that interact?
- Aristotle
- Hume
- Fechner
- *Descartes
> Cartesian dualism.

Q: The first formal psychology laboratory was founded in:
- 1860, by Fechner
- *1879, by Wundt in Leipzig
- 1890, by James at Harvard
- 1913, by Watson
> 1879 is the conventional birth date of experimental psychology.

Q: If the Weber fraction for weight is 2%, the just noticeable difference for a 1,000 g weight is about:
- 2 g
- *20 g
- 200 g
- 2,000 g
> 2% of 1,000 g is 20 g.

Q: Nonsense syllables were used to study memory by:
- *Ebbinghaus
- Galton
- Wundt
- Helmholtz
> Ebbinghaus, 1885.

Q: Which pair of darshanas is correctly matched?
- Nyaya with Vedanta
- Mimamsa with Vaisheshika
- *Samkhya with Yoga
- Yoga with Charvaka
> The pairs are Nyaya-Vaisheshika, Samkhya-Yoga, Mimamsa-Vedanta.

Q: Restlessness, passion and drive to act are qualities of:
- Sattva
- *Rajas
- Tamas
- Kapha
> Rajas is the active, restless guna.

Q: The innermost of the five koshas is:
- Annamaya
- Manomaya
- *Anandamaya
- Vijnanamaya
> The sheath of bliss.
:::

# Part II · Beginner: the schools and the Indian systems

## 2.1 The first schools: structuralism, functionalism and behaviourism [core][beginner]
In its first decades psychology was a set of competing **schools**, each with its own subject matter, method and aims.

### Structuralism: the elements of the mind
**Edward Bradford Titchener**, an Englishman trained by Wundt, set up structuralism at **Cornell University**. He asked: **what is consciousness made of?** His answer: three elements:
- **Sensations** (the elements of perception),
- **Images** (the elements of ideas),
- **Affections** (the elements of emotion; only pleasant or unpleasant).

Each element has attributes such as quality, intensity, duration and clearness. His method was strict **introspection** by trained observers, who had to avoid the **stimulus error**: describing the object ("a book") instead of the raw experience ("a patch of red, rectangular, bright").

:::widget compare
{"title": "Structuralism or functionalism?", "a": {"label": "Structuralism", "points": ["Titchener, at Cornell", "What is consciousness made of?", "Sensations, images and affections", "Trained introspection, avoiding the stimulus error", "Adult human minds only"], "summary": "Structuralism broke the mind into elements, and died with Titchener largely because introspection could not settle disputes."}, "b": {"label": "Functionalism", "points": ["James, Dewey, Angell and Carr", "What is consciousness for?", "A continuous stream that helps us adapt", "Many methods, including tests and observation", "Animals, children, individual differences, education"], "summary": "Functionalism, shaped by Darwin, widened psychology and gave rise to applied psychology."}}
:::

Structuralism faded after Titchener's death in 1927. Its legacy: it made psychology an experimental science and gave the other schools something to rebel against.

:::trap Wundt is not a structuralist
Titchener labelled himself a structuralist and presented his work as Wundt's. Wundt called his own approach **voluntarism** and stressed the mind's active, organising role (apperception) and cultural psychology. Exams set "Wundt founded structuralism" as a trap; the safer answer is **Titchener**.
:::


:::widget flow
{
  "title": "Structuralism: breaking experience into elements",
  "layout": "tree",
  "nodes": [
    { "id": "c", "label": "Conscious experience", "detail": "Titchener's subject matter, studied by trained introspection." },
    { "id": "s", "label": "Sensations", "parent": "c", "detail": "Elements of perception: a patch of red, a tone." },
    { "id": "i", "label": "Images", "parent": "c", "detail": "Elements of ideas: the remembered red." },
    { "id": "a", "label": "Affections", "parent": "c", "detail": "Elements of feeling: only pleasant or unpleasant." },
    { "id": "attr", "label": "Attributes of each element", "parent": "s", "detail": "Quality, intensity, duration, clearness." }
  ],
  "caption": "Titchener's map of the mind. The method could not settle disagreements between laboratories, which helped bring the school down."
}
:::

### Functionalism: what the mind is for
American psychologists, influenced by **Darwin**, asked a different question: **what is consciousness for?** How does it help us adapt?
- **William James**: consciousness is a continuous **stream**, not a set of elements; it is personal, changing and selective; **habit** frees attention.
- **John Dewey**'s paper on the **reflex arc** (1896) argued that stimulus and response form a coordinated whole, not separate parts.
- **James Rowland Angell** and **Harvey Carr** at the **University of Chicago** made functionalism a school.
- Functionalism widened psychology to include **animals, children, abnormal people, individual differences, mental testing and education**, and gave rise to applied psychology.

:::widget sort
{
  "prompt": "Structuralism or functionalism?",
  "buckets": ["Structuralism", "Functionalism"],
  "items": [
    { "text": "Break conscious experience into sensations, images and affections", "bucket": 0 },
    { "text": "Ask how a mental process helps a person adapt", "bucket": 1 },
    { "text": "Avoid the stimulus error", "bucket": 0 },
    { "text": "Consciousness is a stream, not a set of blocks", "bucket": 1 },
    { "text": "Study children, animals and mental tests", "bucket": 1 },
    { "text": "Associated with Titchener at Cornell", "bucket": 0 }
  ]
}
:::

### Behaviourism: only what can be observed
**John B. Watson**'s **behaviourist manifesto** (1913) declared that psychology should be the objective, experimental study of **observable behaviour**; its goal is the **prediction and control** of behaviour; consciousness and introspection have no place. Watson drew on:
- **Ivan Pavlov**'s **classical conditioning** in dogs (a neutral stimulus paired with food comes to trigger salivation).
- **Edward Thorndike**'s **law of effect** (1898, cats in puzzle boxes): responses followed by satisfaction are stamped in.

Watson and Rosalie Rayner's **"Little Albert"** study (1920) conditioned an infant to fear a white rat; it is now an example of unethical research.

Later **neo-behaviourists** refined the approach:
- **B. F. Skinner**: **operant conditioning**, reinforcement schedules, radical behaviourism (private events exist but obey the same laws).
- **Clark Hull**: a formal hypothetico-deductive theory of learning and drive.
- **Edward Tolman**: **purposive behaviourism**, **cognitive maps** and **latent learning** in rats, a bridge to cognitive psychology.

Behaviourism dominated American psychology from the 1920s to the 1950s and gave us behaviour therapy, applied behaviour analysis and many teaching methods.

:::widget decide
{
  "scene": "In an exam viva in Pune, the examiner asks: “Was behaviourism good or bad for psychology?”",
  "ask": "Which answer would score best?",
  "choices": [
    { "label": "“Bad: it ignored the mind completely and set psychology back.”", "verdict": "ok", "outcome": "The examiner asks, “Then why is behaviour therapy still used?” and you have no answer.", "why": "One-sided. The critique is valid, but behaviourism's methods and therapies were major gains." },
    { "label": "“It made psychology objective and experimental and produced effective therapies, but by excluding mental processes it could not explain language, thinking or latent learning, which led to the cognitive revolution.”", "verdict": "best", "outcome": "The examiner nods and asks a follow-up about Chomsky.", "why": "Balanced, specific, and it links forward to the next school." },
    { "label": "“Behaviourism is the same as psychoanalysis.”", "verdict": "harm", "outcome": "The viva goes badly from here.", "why": "They are opposite in method and subject matter." }
  ]
}
:::

:::clinician
The schools can be compared on four classic dimensions: subject matter, method, unit of analysis and aim. Structuralism: consciousness, analytic introspection, elements, pure science. Functionalism: mental acts and their adaptive use, introspection plus objective methods, functions, practical application. Behaviourism: behaviour, objective observation and experiment, stimulus-response units, prediction and control. Watson's methodological behaviourism (consciousness unscientific to study) differs from Skinner's radical behaviourism (private events are behaviour accessible to one person, governed by the same contingencies). Tolman's latent learning (1930) and cognitive maps (1948) are the standard evidence that behaviourism needed intervening variables, a term Tolman himself introduced.
:::

:::recall
1. What were Titchener's three elements of consciousness? || Sensations, images and affections.
2. What is the stimulus error? || Describing the object (a book) instead of the raw experience.
3. What question did functionalism ask? || What is consciousness for: how does it help us adapt?
4. What did Watson's 1913 manifesto demand? || That psychology study only observable behaviour, objectively, with the goal of prediction and control.
5. What did Tolman's latent learning show? || Rats learn a maze without reward and show it once reward is introduced, implying cognitive maps.
:::

:::mcq
Q: Structuralism was founded and named by:
- *Titchener
- Wundt
- James
- Dewey
> Titchener at Cornell; Wundt called his approach voluntarism.

Q: Dewey's 1896 paper on the reflex arc is a founding document of:
- Structuralism
- *Functionalism
- Behaviourism
- Gestalt psychology
> It argued stimulus and response form a coordinated, adaptive whole.

Q: A rat explores a maze without food for several days. When food is placed at the end, it immediately runs the fastest route. This finding is associated with:
- Watson
- Thorndike
- Skinner
- *Tolman
> Latent learning and cognitive maps.
:::


:::widget flow
{
  "title": "The schools in order",
  "layout": "chain",
  "nodes": [
    { "id": "st", "label": "Structuralism", "detail": "Titchener: elements of consciousness by introspection." },
    { "id": "fn", "label": "Functionalism", "detail": "James, Dewey, Angell: what the mind does to help us adapt." },
    { "id": "ge", "label": "Gestalt", "detail": "Wertheimer, Köhler, Koffka: wholes and organisation." },
    { "id": "pa", "label": "Psychoanalysis", "detail": "Freud: the unconscious and conflict, from the clinic." },
    { "id": "be", "label": "Behaviourism", "detail": "Watson, Skinner: observable behaviour only." },
    { "id": "hu", "label": "Humanistic", "detail": "Maslow, Rogers: growth, choice, the whole person." },
    { "id": "co", "label": "Cognitive", "detail": "Miller, Chomsky, Neisser: the mind as information processor." },
    { "id": "mc", "label": "Multicultural and indigenous", "detail": "Culture shapes mind; psychology from many places." }
  ],
  "caption": "Roughly chronological, though several overlapped. Each school reacted against the one before it."
}
:::

## 2.2 Gestalt, psychoanalysis, humanism and the cognitive revolution [core][beginner]
### Gestalt psychology: the whole is different from its parts
In 1912 **Max Wertheimer** published his study of the **phi phenomenon**: two lights flashed one after the other, at the right interval, look like one light moving. The movement is **not in either light**; it is in the pattern. With **Wolfgang Köhler** and **Kurt Koffka**, he founded **Gestalt psychology** ("Gestalt" is German for form or whole) in opposition to structuralism's elements and later to behaviourism's stimulus-response chains.

Key ideas:
- **The whole is different from the sum of its parts.**
- **Laws of perceptual organisation**: proximity, similarity, closure, continuity, common fate, figure-ground, and the overarching **law of Prägnanz** (we see the simplest, most stable form possible).
- **Insight learning**: Köhler, stranded on Tenerife during World War I, watched chimpanzees such as **Sultan** suddenly solve problems (joining two sticks to reach a banana) after a pause, not by gradual trial and error.
- **Kurt Lewin** applied Gestalt ideas to motivation and social behaviour (**field theory**: behaviour is a function of the person and the environment, B = f(P, E)).

:::example Gestalt on a Diwali night
A string of small lights flashing one after another along a balcony in Ahmedabad looks like a single light racing around the building. That is the phi phenomenon. Rangoli patterns rely on closure and symmetry: your eye completes the shape even where the powder line breaks.
:::

### Psychoanalysis
**Sigmund Freud**, a Viennese neurologist, developed psychoanalysis from his work with patients with "hysteria" (conversion symptoms). His great book on dreams appeared in 1900. Psychoanalysis differed from the academic schools: it came from the **clinic**, not the laboratory; it centred on the **unconscious**, conflict, sexuality and early childhood; and its method was **free association** and interpretation. The detailed theory is in the defences and psychodynamics modules. For this module, know its place: one of the **four founding paths** in the NET syllabus, a "first force", and the source of much of clinical psychology.


:::widget layers
{
  "title": "Freud's topographic model",
  "shape": "iceberg",
  "layers": [
    { "label": "Conscious", "detail": "What you are aware of right now. The tip above the water." },
    { "label": "Preconscious", "detail": "Not in awareness now but easily recalled: your phone number, yesterday's lunch." },
    { "label": "Unconscious", "detail": "Wishes, fears and memories kept out of awareness, which still shape feelings and behaviour." }
  ],
  "caption": "Most of the mind, Freud argued, lies below the surface. The details are in the psychodynamics module."
}
:::

### Humanistic psychology: the third force
In the 1950s and 1960s **Abraham Maslow** and **Carl Rogers** described a **"third force"** against behaviourism (which saw people as machines) and psychoanalysis (which saw them as driven by dark forces). Humanistic psychology emphasises:
- **Free will**, choice and responsibility,
- **Self-actualisation** and growth (Maslow),
- The **self-concept**, **unconditional positive regard**, **empathy** and **congruence** (Rogers' person-centred therapy),
- The **whole person** and subjective experience, studied through phenomenological methods.

:::widget flow
{"title": "The three forces in psychology", "layout": "tree", "nodes": [{"id": "q", "label": "What drives human behaviour?", "detail": "By the middle of the twentieth century, three big answers competed."}, {"id": "p", "label": "First force: psychoanalysis", "parent": "q", "detail": "Freud: unconscious drives and early conflicts. People are pushed by forces they do not see."}, {"id": "b", "label": "Second force: behaviourism", "parent": "q", "detail": "Watson and Skinner: behaviour is shaped by the environment through conditioning. Study only what can be observed."}, {"id": "h", "label": "Third force: humanism", "parent": "q", "detail": "Maslow and Rogers: free will, the self and growth towards self-actualisation. Study the whole person and their experience."}], "caption": "Humanism called itself the third force because it rejected both the 'dark forces' of psychoanalysis and the 'machine' of behaviourism."}
:::

**Existential psychology** (Rollo May, Viktor Frankl's logotherapy) shares this concern with meaning, freedom, anxiety and death. **Transpersonal psychology** (Maslow later, Stanislav Grof, Ken Wilber) studies experiences beyond the individual ego: peak, mystical and meditative states, and was called the **fourth force**. It draws openly on Indian and Buddhist traditions.

### The cognitive revolution
By the 1950s behaviourism could not explain language, problem solving or memory well. Several events turned the field:
- **George Miller**, "The Magical Number Seven, Plus or Minus Two" (1956): limits of short-term memory.
- A symposium at **MIT on 11 September 1956**, where Miller, Chomsky, Newell and Simon presented work often taken as the start of cognitive science.
- **Noam Chomsky**'s **review of Skinner's book on language** (1959): children produce sentences they have never heard, so language cannot be learned by reinforcement alone.
- **Newell and Simon**'s computer programs that solved problems, and the **computer metaphor** of the mind as an information processor.
- **Ulric Neisser**'s 1967 textbook gave the new field its name: **cognitive psychology**.

:::widget timeline
{"prompt": "Put the founding moments of the big schools of psychology in order.", "events": [{"label": "Wundt's Leipzig laboratory; Titchener later builds structuralism on it", "when": "1879"}, {"label": "James describes the stream of consciousness, the root of functionalism", "when": "1890"}, {"label": "Freud publishes his first major book, on dreams and the unconscious", "when": "1900"}, {"label": "Wertheimer's phi phenomenon starts Gestalt psychology", "when": "1912"}, {"label": "Watson's behaviourist manifesto", "when": "1913"}, {"label": "Maslow and Rogers launch humanistic psychology, the third force", "when": "1950s"}, {"label": "Neisser names cognitive psychology", "when": "1967"}], "why": "Psychoanalysis, Gestalt and behaviourism all appeared within about 15 years of each other. Humanism and the cognitive revolution were reactions, mostly against behaviourism."}
:::

### Multiculturalism and beyond
From the 1980s, **multicultural and cross-cultural psychology** argued that most theories were built on narrow samples and that culture shapes the mind (sometimes called a "fourth force" too). Indian indigenous psychology belongs partly to this movement.

:::widget sort
{
  "prompt": "Which school or movement does each idea belong to?",
  "buckets": ["Gestalt", "Psychoanalysis", "Humanistic", "Cognitive"],
  "items": [
    { "text": "The phi phenomenon", "bucket": 0 },
    { "text": "Free association and the unconscious", "bucket": 1 },
    { "text": "Unconditional positive regard", "bucket": 2 },
    { "text": "The mind as an information-processing system", "bucket": 3 },
    { "text": "Sultan the chimpanzee joining two sticks", "bucket": 0 },
    { "text": "Chomsky's attack on Skinner's account of language", "bucket": 3 }
  ]
}
:::

:::mnemonic The "forces" of psychology
**First** force: psychoanalysis. **Second**: behaviourism. **Third**: humanistic. **Fourth**: transpersonal (in Maslow's usage), or multicultural (in Pedersen's usage). Say which usage you mean in an answer.
:::

:::clinician
The NET syllabus's "four founding paths of academic psychology" are **Wundt, Freud, James and Dilthey**, framed in Indian syllabus writing as four distinct entry points: experimental-physiological psychology (Wundt), clinical-depth psychology (Freud), pragmatic-functional psychology (James) and interpretive human-science psychology (Dilthey's descriptive and analytic psychology, 1894, and his Verstehen tradition, later developed in phenomenological and hermeneutic psychology). The "cognitive revolution" narrative is itself debated: some historians argue there was no Kuhnian revolution but continuity with Tolman's neo-behaviourism, information theory and cybernetics; others stress the rupture over language (Chomsky). Gestalt's influence runs into perception research, Lewin's social psychology and group dynamics, Gestalt therapy (Perls, a separate tradition with the same name) and modern predictive-coding accounts of perceptual organisation. For long answers, a comparison table of schools on founder, subject matter, method, key concepts, contribution and criticism earns marks quickly.
:::

:::recall
1. What did Wertheimer's phi phenomenon show? || Apparent motion arises from the pattern of two flashing lights, not from either light: the whole differs from its parts.
2. Name four Gestalt laws of organisation. || Any four: proximity, similarity, closure, continuity, common fate, figure-ground, Prägnanz.
3. What did Köhler's chimpanzee studies show? || Insight learning: sudden solutions after restructuring the problem, not gradual trial and error.
4. Why was humanistic psychology called the third force? || It opposed both psychoanalysis and behaviourism.
5. Name three events of the cognitive revolution. || Any three: Miller's magical number seven, the 1956 MIT symposium, Chomsky's review of Skinner, Newell and Simon's programs, Neisser's 1967 book that named the field.
:::

:::mcq
Q: The Gestalt law that we tend to perceive the simplest, most stable form is the law of:
- Proximity
- *Prägnanz
- Common fate
- Similarity
> Prägnanz (good form) is the overarching law.

Q: Chomsky's 1959 review argued that language cannot be explained by reinforcement because:
- *Children produce and understand sentences they have never heard
- Children never imitate adults
- Language is learned only after age ten
- Animals can learn grammar
> Generativity was the key argument against Skinner.
:::

## 2.3 Vedanta, the Upanishads and the Bhagavad Gita [core][beginner]
### The self in the Upanishads
The **Upanishads** (the oldest roughly 800 to 500 BCE) ask: **who am I?** Their central answer is that behind the changing body, senses and mind there is an unchanging, conscious **self (atman)**, and that this self is ultimately one with **Brahman**, the ground of all reality ("tat tvam asi": you are that).

**Vedanta** ("end of the Vedas") systematised these teachings. Its three main schools disagree on how the self relates to Brahman:
| School | Teacher | Relationship |
|---|---|---|
| **Advaita** (non-dual) | Shankara (around 8th century) | Atman and Brahman are identical; the sense of separateness is **avidya** (ignorance) and **maya** |
| **Vishishtadvaita** (qualified non-dual) | Ramanuja (11th to 12th century) | Selves are real parts of Brahman, as qualities belong to a substance |
| **Dvaita** (dual) | Madhva (13th century) | Selves and Brahman are eternally distinct |

### Four states of consciousness
The **Mandukya Upanishad** describes four states:
1. **Jagrat**: waking, aware of the outer world.
2. **Svapna**: dreaming, aware of an inner world.
3. **Sushupti**: deep dreamless sleep, with no objects but (it is argued) a residual awareness, since we later say "I slept well".
4. **Turiya**: "the fourth", pure consciousness that underlies and witnesses the other three.

The idea of a **witness (sakshi)** that observes thoughts without being them has parallels in mindfulness-based and acceptance-based therapies ("you are not your thoughts").


:::widget layers
{
  "title": "Four states of consciousness (Mandukya Upanishad)",
  "shape": "stack",
  "layers": [
    { "label": "Turiya", "detail": "'The fourth': pure consciousness that underlies and witnesses the other three." },
    { "label": "Sushupti", "detail": "Deep dreamless sleep: no objects, yet we later say “I slept well”." },
    { "label": "Svapna", "detail": "Dreaming: awareness of an inner world." },
    { "label": "Jagrat", "detail": "Waking: awareness of the outer world through the senses." }
  ],
  "caption": "Read from the bottom up. The idea of a witnessing awareness behind changing states has echoes in mindfulness and acceptance therapies."
}
:::

:::widget hypnogram
{"caption": "Modern sleep science maps a night in stages. Drag through it: dreaming (svapna) is most vivid in REM, and deep dreamless sleep (sushupti) is closest to N3. Then switch on depression to see how the night changes."}
:::

### The inner instrument (antahkarana)
Vedanta describes the mind as a fourfold **inner instrument**:
| Part | Function | Modern parallel |
|---|---|---|
| **Manas** | Receives sense data, deliberates, doubts | Sensory processing, working memory |
| **Buddhi** | Decides, discerns, judges | Executive function, judgement |
| **Ahamkara** | The "I-maker": owns experience as "mine" | Ego, self-concept |
| **Chitta** | Storehouse of impressions and memories | Long-term memory, implicit memory |

:::widget layers
{"title": "The fourfold inner instrument (antahkarana)", "shape": "stack", "layers": [{"label": "Manas", "detail": "Receives sense data, deliberates and doubts. Modern parallel: sensory processing and working memory."}, {"label": "Buddhi", "detail": "Decides, discerns and judges. Modern parallel: executive function and judgement."}, {"label": "Ahamkara", "detail": "The 'I-maker' that owns experience as 'mine'. Modern parallel: ego and self-concept."}, {"label": "Chitta", "detail": "The storehouse of impressions (samskaras) and memories. Modern parallel: long-term and implicit memory."}], "caption": "Tap each part. Vedanta sees all four as instruments of a deeper self, not the self itself."}
:::

### The Bhagavad Gita
The **Gita** (700 verses in 18 chapters, within the Mahabharata) opens with **Arjuna's despair** (vishada) on the battlefield: trembling, a dry mouth, confusion and a wish to give up. Krishna's teaching that follows is often read as one of the oldest recorded counselling dialogues. Its key psychological ideas:
- **Sthitaprajna**: the person of steady wisdom, unshaken by pleasure and pain, praise and blame (Chapter 2).
- **Nishkama karma**: act fully and well, but **without attachment to the fruits** of action (2.47). Indian researchers have studied this as **anasakti** (non-attachment).
- **Svadharma**: one's own duty, suited to one's nature and role.
- **Three (or four) paths**: **karma yoga** (action), **jnana yoga** (knowledge), **bhakti yoga** (devotion), and **dhyana yoga** (meditation, Chapter 6).
- **The gunas** shape food, faith, knowledge, action and character (Chapters 14, 17 and 18).

:::widget worked
{
  "title": "The Gita's chain from attention to ruin, read as a modern psychologist",
  "steps": [
    { "q": "Gita 2.62 to 2.63 describes a chain. It begins: by dwelling on sense objects, a person develops attachment. What modern idea fits “dwelling”?", "a": "Selective attention and rumination: repeatedly focusing on something makes it more salient and more wanted." },
    { "q": "Attachment gives rise to desire, and blocked desire gives rise to anger. What modern theory links blocked goals to anger?", "a": "The frustration-aggression hypothesis (1939), and appraisal theory: anger follows appraising a goal as blocked unfairly." },
    { "q": "Anger leads to delusion (sammoha) and confusion of memory. What does modern research say about strong emotion and thinking?", "a": "High arousal narrows attention and impairs working memory and recall, as the Yerkes-Dodson law and stress research predict." },
    { "q": "Confused memory destroys discernment (buddhi-nasha), and with it the person is lost. What is the modern parallel?", "a": "Loss of executive control and judgement: impulsive decisions with lasting harm. The remedy in both systems is to intervene early, at attention and appraisal." }
  ],
  "yourTurn": [
    { "q": "Where in Gross's process model of emotion regulation would the Gita's advice to restrain the senses and steady the mind fit?", "a": "Mainly at the early, antecedent-focused stages: situation selection and attentional deployment (withdrawing attention from provoking objects), and cognitive change (seeing events with equanimity). This is why the Gita and modern regulation research both favour early intervention over suppressing anger once it has erupted." }
  ]
}
:::

:::example Anasakti research
**Pande and Naidu** (1992) developed a measure of **anasakti**, operationalised as effort orientation without concern for outcome, equanimity in success and failure, and selflessness. People higher in anasakti reported less strain under stress, a finding later research has explored in work and health settings. It is a good example of a classical concept turned into a testable construct.
:::

:::clinician
Jeste and Vahia (2008) compared the conception of wisdom in the Gita with modern empirical models (Baltes's Berlin wisdom paradigm; Ardelt's three-dimensional model) and found substantial overlap: emotional regulation, control over desires, decisiveness, love of god, duty and work, self-contentedness, compassion and sacrifice, insight and humility, and knowledge of life. Psychiatrists from Indian traditions (Neki; Balodhi) have discussed the Gita as a model of supportive and directive psychotherapy, with Krishna using normalisation, reframing, values clarification and behavioural activation, though such readings are interpretive. The Mandukya states have been compared with sleep architecture and with research on "minimal phenomenal experience" and pure awareness in long-term meditators (Metzinger; Josipovic), an active but early research area. The antahkarana is a functional model and should not be mapped one-to-one onto brain regions.
:::

:::recall
1. What is the central teaching of the Upanishads about the self? || Behind body and mind is an unchanging conscious self (atman), ultimately one with Brahman.
2. Name the three schools of Vedanta and their teachers. || Advaita (Shankara), Vishishtadvaita (Ramanuja), Dvaita (Madhva).
3. List the four states of consciousness in the Mandukya Upanishad. || Jagrat (waking), svapna (dreaming), sushupti (deep sleep), turiya (the fourth).
4. Name the four parts of the antahkarana. || Manas, buddhi, ahamkara, chitta.
5. What is nishkama karma? || Acting fully without attachment to the fruits of action.
6. What is a sthitaprajna? || A person of steady wisdom, unshaken by pleasure and pain.
:::

:::mcq
Q: In Vedanta, the part of the inner instrument that decides and discerns is:
- Manas
- Chitta
- Ahamkara
- *Buddhi
> Buddhi is the discerning intellect.

Q: Turiya refers to:
- Deep dreamless sleep
- The dream state
- *Pure consciousness that underlies waking, dreaming and deep sleep
- The physical body
> The "fourth" state in the Mandukya Upanishad.

Q: The concept of anasakti, studied by Pande and Naidu, is drawn from:
- *The Bhagavad Gita
- The Yoga Sutras
- The Natyashastra
- The Nyaya Sutras
> Non-attachment to the fruits of action is the Gita's teaching.
:::

## 2.4 Samkhya and Yoga: nature, consciousness and the disciplined mind [core][beginner]
### Samkhya: two realities
**Samkhya** (traditionally founded by **Kapila**; the oldest surviving text is Ishvarakrishna's **Samkhya Karika**) is one of India's oldest systematic philosophies and gives **Yoga** its theory. It is **dualist**:
- **Purusha**: pure consciousness, the witness. It does nothing and changes not; there are many purushas.
- **Prakriti**: nature or matter, which includes the body **and the mind**. Prakriti is made of the **three gunas**. When they are in balance, nothing happens; when the balance is disturbed (in the presence of purusha), the world evolves.

From prakriti evolve, in order: **mahat or buddhi** (intellect), **ahamkara** (I-sense), **manas** (mind), the five senses of knowledge, five organs of action, five subtle elements and five gross elements. With purusha, there are **25 tattvas** (principles).

The striking psychological point: in Samkhya, **the mind is part of matter**. Thoughts, feelings and the ego are activities of prakriti. Consciousness (purusha) only **witnesses** them. Suffering comes from **confusing** the witness with what it witnesses ("I am angry" instead of "anger is happening and I am aware of it"). Liberation (**kaivalya**, aloneness) comes through **viveka**, discriminating knowledge of the difference.

Samkhya names three kinds of suffering: **adhyatmika** (from within: illness, desire, grief), **adhibhautika** (from other beings: injury, conflict) and **adhidaivika** (from nature or fate: floods, earthquakes).


:::widget flow
{
  "title": "How Samkhya says the world unfolds from prakriti",
  "layout": "tree",
  "nodes": [
    { "id": "pr", "label": "Prakriti (nature, made of the three gunas)", "detail": "Unmanifest while the gunas are balanced; in the presence of purusha the balance is disturbed and evolution begins." },
    { "id": "ma", "label": "Mahat or buddhi (intellect)", "parent": "pr", "detail": "The first product: discernment." },
    { "id": "ah", "label": "Ahamkara (I-sense)", "parent": "ma", "detail": "The sense of 'I' and 'mine'." },
    { "id": "mn", "label": "Manas and the ten senses", "parent": "ah", "detail": "Mind, five senses of knowledge and five organs of action." },
    { "id": "tm", "label": "Five subtle elements", "parent": "ah", "detail": "Sound, touch, form, taste and smell in subtle form." },
    { "id": "gr", "label": "Five gross elements", "parent": "tm", "detail": "Space, air, fire, water, earth." }
  ],
  "caption": "With purusha, the witnessing consciousness, there are 25 principles (tattvas). Note that the mind sits inside nature."
}
:::

### Patanjali's Yoga Sutras
The **Yoga Sutras** of **Patanjali** (dates are uncertain, often placed between the 2nd century BCE and the 4th century CE) are 196 short aphorisms in four chapters (**samadhi, sadhana, vibhuti, kaivalya**). Sutra 1.2 defines yoga: **"yogas chitta vritti nirodhah"**: yoga is the **stilling of the fluctuations of the mind**.

**The five vrittis (fluctuations)** (1.6):
1. **Pramana**: correct knowledge (through perception, inference, testimony).
2. **Viparyaya**: error, false knowledge (seeing a rope as a snake).
3. **Vikalpa**: verbal construction or imagination with no real object.
4. **Nidra**: sleep.
5. **Smriti**: memory.

:::widget sort
{"prompt": "Which of Patanjali's five vrittis (fluctuations of the mind) is each?", "buckets": ["Pramana", "Viparyaya", "Vikalpa", "Nidra", "Smriti"], "items": [{"text": "Seeing smoke on the hill and correctly inferring a fire", "bucket": 0, "why": "Correct knowledge, here by inference."}, {"text": "Seeing a coiled rope at dusk as a snake", "bucket": 1, "why": "Error: false knowledge of a real object."}, {"text": "Thinking about 'the horns of a hare'", "bucket": 2, "why": "A verbal idea with no real object behind it."}, {"text": "Deep dreamless sleep", "bucket": 3, "why": "Nidra is itself counted as a fluctuation."}, {"text": "Recalling your grandmother's kitchen", "bucket": 4, "why": "Bringing back a past impression."}]}
:::

**Two means** (1.12): **abhyasa** (steady practice) and **vairagya** (non-attachment).

**The five kleshas (afflictions)** (2.3), the roots of suffering:
| Klesha | Meaning | Modern echo |
|---|---|---|
| **Avidya** | Ignorance: mistaking the impermanent and non-self for the permanent self | Core cognitive error |
| **Asmita** | I-am-ness: identifying with mind and body | Over-identification with self-concept |
| **Raga** | Attachment to pleasure | Craving |
| **Dvesha** | Aversion to pain | Avoidance |
| **Abhinivesha** | Clinging to life, fear of death | Existential anxiety |

**Five states of mind (bhumis)** (from Vyasa's classical commentary): **kshipta** (restless, scattered), **mudha** (dull, stupefied), **vikshipta** (distracted, occasionally focused), **ekagra** (one-pointed) and **niruddha** (fully restrained).

### The eight limbs (ashtanga)
| Limb | Meaning |
|---|---|
| 1. **Yama** | Ethical restraints: non-violence (ahimsa), truthfulness, non-stealing, moderation, non-possessiveness |
| 2. **Niyama** | Observances: purity, contentment (santosha), discipline (tapas), self-study, surrender to the divine |
| 3. **Asana** | Steady, comfortable posture |
| 4. **Pranayama** | Regulation of breath |
| 5. **Pratyahara** | Withdrawal of the senses from their objects |
| 6. **Dharana** | Concentration on one point |
| 7. **Dhyana** | Meditation: unbroken flow of attention |
| 8. **Samadhi** | Absorption |

The first five are the **outer** limbs; the last three together are called **samyama**.


:::widget layers
{
  "title": "The eight limbs, from outer to inner",
  "shape": "stack",
  "layers": [
    { "label": "Samadhi", "detail": "Absorption: the innermost limb." },
    { "label": "Dhyana", "detail": "Meditation: an unbroken flow of attention." },
    { "label": "Dharana", "detail": "Concentration on one point. With dhyana and samadhi it forms samyama." },
    { "label": "Pratyahara", "detail": "Withdrawing the senses from their objects: the bridge between outer and inner." },
    { "label": "Pranayama", "detail": "Regulation of breath." },
    { "label": "Asana", "detail": "A steady, comfortable posture." },
    { "label": "Niyama", "detail": "Observances: purity, contentment, discipline, self-study, surrender." },
    { "label": "Yama", "detail": "Ethical restraints: non-violence, truth, non-stealing, moderation, non-possessiveness." }
  ],
  "caption": "Read from the bottom up: practice moves from conduct and body to breath, attention and absorption."
}
:::

:::mnemonic Eight limbs: "Your New Aunt Prefers Peaceful Days Doing Sudoku"
**Y**ama, **N**iyama, **A**sana, **P**ranayama, **P**ratyahara, **D**harana, **D**hyana, **S**amadhi.
:::

:::widget sort
{
  "prompt": "Which klesha is at work?",
  "buckets": ["Raga", "Dvesha", "Asmita", "Abhinivesha"],
  "items": [
    { "text": "Checking Instagram again and again for the pleasure of likes", "bucket": 0 },
    { "text": "Avoiding the dentist for years because of the memory of pain", "bucket": 1 },
    { "text": "“If I fail this exam, I am nothing.”", "bucket": 2, "why": "Identifying the whole self with a role or result is asmita." },
    { "text": "Intense fear of death that blocks enjoyment of life", "bucket": 3 },
    { "text": "Clinging to a relationship because it feels good, though it harms you", "bucket": 0 },
    { "text": "Refusing to read any message from a critical relative", "bucket": 1 }
  ]
}
:::

:::widget decide
{
  "scene": "A yoga teacher in Rishikesh tells a client with panic disorder that eight limbs of yoga will “cure” him and that he should stop his prescribed medicine. The client asks you, a psychology trainee, what you think.",
  "ask": "What is the most responsible response?",
  "choices": [
    { "label": "Agree: yoga is ancient and therefore safer than medicine", "verdict": "harm", "outcome": "He stops medicine abruptly, relapses and has a severe panic episode.", "why": "Tradition is not evidence, and stopping medication suddenly can be harmful. This advice is outside the teacher's role." },
    { "label": "Say yoga breathing and relaxation can help anxiety and can be added, but medicine changes should be discussed with his psychiatrist", "verdict": "best", "outcome": "He continues treatment, adds daily practice and later tapers medicine with his doctor.", "why": "Evidence supports yoga as an adjunct for anxiety; medical decisions stay with the prescriber." },
    { "label": "Tell him yoga is unscientific and useless", "verdict": "ok", "outcome": "He feels his culture is being dismissed and stops trusting you.", "why": "Inaccurate and alienating; there is reasonable evidence for yoga as an add-on." }
  ]
}
:::

:::clinician
Samkhya's metaphysics is unusual among world philosophies in placing mind (buddhi, ahamkara, manas) within matter while keeping consciousness separate, a position that some philosophers of mind compare with modern debates on the "hard problem" (Chalmers): cognitive functions are explainable mechanistically, but subjective awareness is not obviously so. The guna model has been operationalised in several inventories, notably the **Vedic Personality Inventory** (introduced by Wolf in 1998; 56 items, three subscales with adequate internal consistency) and Indian scales developed at NIMHANS and elsewhere; correlations with the Big Five are moderate (sattva with conscientiousness and agreeableness, rajas with extraversion and neuroticism facets, tamas with neuroticism and low conscientiousness), but factor structures vary across samples. Patanjali's vrittis and kleshas map loosely onto CBT concepts (viparyaya as cognitive distortion; raga and dvesha as approach and avoidance), and the bhumis onto attention research (mind-wandering versus sustained attention). Yoga as an adjunct for anxiety and depression has meta-analytic support with high risk of bias; it should not replace evidence-based treatment for moderate to severe disorders.
:::

:::recall
1. What are purusha and prakriti in Samkhya? || Purusha: pure, unchanging, witnessing consciousness. Prakriti: nature or matter, including the mind, made of the three gunas.
2. How many tattvas does Samkhya list, including purusha? || Twenty-five.
3. Give Patanjali's definition of yoga (1.2). || Yogas chitta vritti nirodhah: the stilling of the fluctuations of the mind.
4. Name the five vrittis. || Pramana, viparyaya, vikalpa, nidra, smriti.
5. List the five kleshas. || Avidya, asmita, raga, dvesha, abhinivesha.
6. Which three limbs together form samyama? || Dharana, dhyana and samadhi.
:::

:::mcq
Q: Seeing a coiled rope in dim light and mistaking it for a snake is which vritti?
- Pramana
- Smriti
- *Viparyaya
- Nidra
> Viparyaya is false knowledge or error.

Q: In Samkhya, thoughts and emotions belong to:
- Purusha
- *Prakriti
- Neither
- Both equally
> Mind is part of prakriti; purusha only witnesses.

Q: The fifth limb of yoga, withdrawing the senses from their objects, is:
- Dharana
- *Pratyahara
- Pranayama
- Dhyana
> Pratyahara links the outer and inner limbs.
:::

## 2.5 Buddhism, Sufism and Integral Yoga [core][beginner]
The UGC NET syllabus lists these three by name, along with the Gita.

### Buddhism: suffering and its end
**Siddhartha Gautama** (the Buddha, around the 5th century BCE, in what is now Bihar and Uttar Pradesh) taught a path to end suffering based on careful observation of the mind. Its psychology is so detailed that some scholars call it the first cognitive-behavioural system.

**The Four Noble Truths** work like a medical model:
| Truth | Medical parallel | Content |
|---|---|---|
| 1. **Dukkha** | Diagnosis | Life involves suffering and dissatisfaction |
| 2. **Samudaya** | Cause | Suffering arises from **craving (tanha)** |
| 3. **Nirodha** | Prognosis | Suffering can end (nirvana) |
| 4. **Magga** | Treatment | The **Noble Eightfold Path** |

:::widget flow
{"title": "The Four Noble Truths as a medical model", "layout": "chain", "nodes": [{"id": "a", "label": "Dukkha: the diagnosis", "detail": "Life involves suffering and dissatisfaction, including the subtle unease of change and loss."}, {"id": "b", "label": "Samudaya: the cause", "detail": "Suffering arises from craving (tanha): clinging to what is pleasant and pushing away what is not."}, {"id": "c", "label": "Nirodha: the prognosis", "detail": "Suffering can end. The end of craving is nirvana."}, {"id": "d", "label": "Magga: the treatment", "detail": "The Noble Eightfold Path: right view, intention, speech, action, livelihood, effort, mindfulness and concentration."}], "edgeLabels": {"a>b": "why?", "b>c": "can it end?", "c>d": "how?"}, "caption": "Diagnosis, cause, prognosis, treatment: the same order a clinician follows. Mindfulness-based therapies borrow from the last step."}
:::

**The Eightfold Path** in three groups:
- **Wisdom (panna)**: right view, right intention.
- **Ethical conduct (sila)**: right speech, right action, right livelihood.
- **Mental discipline (samadhi)**: right effort, right **mindfulness (sati)**, right concentration.

**The three marks of existence**: **anicca** (impermanence), **dukkha** (unsatisfactoriness) and **anatta** (no fixed self). The person is not a single unchanging self but five changing **aggregates (skandhas)**: **form** (body), **feeling** (pleasant, unpleasant, neutral), **perception**, **mental formations** (intentions, habits) and **consciousness**.

**The three poisons**: greed (lobha), hatred (dosa) and delusion (moha). Their antidotes include the **four immeasurables (brahmaviharas)**: loving-kindness (metta), compassion (karuna), sympathetic joy (mudita) and equanimity (upekkha).

The **Abhidhamma** texts analyse the mind into moments of consciousness and **52 mental factors** (cetasikas), and the **Yogacara** school (Asanga and Vasubandhu) described a "storehouse consciousness" (alaya-vijnana) holding the seeds of habits, an early idea of an unconscious.

Two kinds of meditation: **samatha** (calm, concentration) and **vipassana** (insight into impermanence and no-self).


:::widget flow
{
  "title": "Dependent origination: how suffering keeps itself going",
  "layout": "cycle",
  "nodes": [
    { "id": "av", "label": "Ignorance", "detail": "Not seeing impermanence and no-self." },
    { "id": "fo", "label": "Mental formations", "detail": "Habits and intentions built from past actions." },
    { "id": "co", "label": "Consciousness", "detail": "Awareness shaped by those formations." },
    { "id": "nm", "label": "Mind and body", "detail": "The person as a changing bundle." },
    { "id": "se", "label": "Six senses and contact", "detail": "Eyes, ears, nose, tongue, body, mind meet their objects." },
    { "id": "fe", "label": "Feeling", "detail": "Each contact is felt as pleasant, unpleasant or neutral." },
    { "id": "cr", "label": "Craving", "detail": "Wanting more of the pleasant, less of the unpleasant." },
    { "id": "cl", "label": "Clinging and becoming", "detail": "Holding on, forming identity around what we crave." },
    { "id": "bi", "label": "Birth, ageing and death", "detail": "New rounds of existence and suffering, which feed ignorance again." }
  ],
  "caption": "A shortened version of the twelve links. Meditation aims to break the loop at the step from feeling to craving, the same point that mindfulness-based therapies target."
}
:::

:::example Vipassana in Tihar Jail
In 1993 to 1994, under Inspector General **Kiran Bedi**, **Tihar Jail** in Delhi held ten-day Vipassana courses in the tradition taught by **S. N. Goenka** (whose main centre is at Igatpuri, Maharashtra), including one for about a thousand prisoners. Early studies reported less hostility and better wellbeing among participants, and the documentary "Doing Time, Doing Vipassana" brought it to the world. Later prison programmes, such as one in Alabama in the United States, reported similar early findings. The studies were mostly uncontrolled, so they suggest benefit rather than prove it.
:::

### Sufism: the transformation of the self
**Sufism** is the mystical tradition of Islam. It came to India from about the 11th to 12th centuries; the **Chishti** order (**Khwaja Moinuddin Chishti** at Ajmer, **Nizamuddin Auliya** in Delhi) became the most influential. In Ahmedabad, the **Sarkhej Roza** complex grew around the shrine of the Sufi saint Shaikh Ahmed Khattu.

Sufi psychology describes the human being as **nafs** (the lower, ego-self), **qalb** (the heart, centre of spiritual perception), **ruh** (spirit) and **aql** (intellect). The nafs develops through stages; the Qur'an names three:
1. **Nafs al-ammara**: the commanding self that pushes towards impulses.
2. **Nafs al-lawwama**: the self-reproaching self, aware of its faults (something like conscience).
3. **Nafs al-mutma'inna**: the self at peace.

Sufis distinguish **maqamat** (stations), earned through effort (repentance, patience, gratitude, trust, love), from **ahwal** (states), which come as grace. The goal is **fana** (passing away of the ego in the divine) followed by **baqa** (subsistence, returning to life transformed). Practices include **dhikr** (repeated remembrance of God), **muraqaba** (meditation), **sama** (listening to devotional music such as qawwali) and **khidmat** (service).

:::example Dava and Dua in Gujarat
At the **Mira Datar dargah** in Unava, Mehsana district, families have long brought relatives with mental illness for healing. A Gujarat-based partnership known as **"Dava and Dua"** (medicine and prayer) set up a mental health clinic beside the shrine, so people could receive psychiatric care while continuing their faith practices. After the **Erwadi tragedy** in Tamil Nadu (2001), when chained patients at a dargah died in a fire, such respectful partnerships became a model: work with faith healing rather than against it, and remove restraint and neglect.
:::


:::widget layers
{
  "title": "Stages of the nafs in Sufi psychology",
  "shape": "stack",
  "layers": [
    { "label": "Nafs al-mutma'inna", "detail": "The self at peace: settled in trust and remembrance." },
    { "label": "Nafs al-lawwama", "detail": "The self-reproaching self: aware of its faults, struggling to change." },
    { "label": "Nafs al-ammara", "detail": "The commanding self: driven by impulses and appetites." }
  ],
  "caption": "Read from the bottom up. Sufi practice (dhikr, muraqaba, service) is meant to move the self upward, towards fana and baqa."
}
:::

### Integral Yoga: evolving consciousness
**Sri Aurobindo** (1872 to 1950) worked in the Baroda state service and taught at Baroda College (now Vadodara, Gujarat) before joining the freedom struggle and settling in Pondicherry, where, with **the Mother** (Mirra Alfassa), he developed **Integral Yoga**. Its aim is not to escape the world but to **transform the whole of human nature**: body, life (vital), mind and spirit.

Key ideas:
- **Consciousness evolves**: matter → life → mind → and beyond, towards higher levels Aurobindo called higher mind, illumined mind, intuition, overmind and **supermind**.
- **Planes of the person**: the outer being (physical, vital, mental), an **inner being** behind it, and the **psychic being**, the evolving soul that grows across lives and guides the person from within. Below waking awareness lie the **subconscient** and **inconscient**.
- **Triple transformation**: **psychic** (the inner soul comes forward and guides life), **spiritual** (opening to higher consciousness) and **supramental** (transformation of the whole nature).
- **Integral education**: education of the physical, vital, mental, psychic and spiritual aspects of the child, practised at the Sri Aurobindo International Centre of Education.

:::widget sort
{
  "prompt": "Which tradition does each concept come from?",
  "buckets": ["Buddhism", "Sufism", "Integral Yoga"],
  "items": [
    { "text": "Anatta: no fixed, unchanging self", "bucket": 0 },
    { "text": "Nafs al-lawwama: the self-reproaching self", "bucket": 1 },
    { "text": "The psychic being as the evolving soul", "bucket": 2 },
    { "text": "Fana and baqa", "bucket": 1 },
    { "text": "The five skandhas", "bucket": 0 },
    { "text": "Supermind and the triple transformation", "bucket": 2 }
  ]
}
:::


:::widget layers
{
  "title": "Sri Aurobindo's levels of consciousness",
  "shape": "stack",
  "layers": [
    { "label": "Supermind", "detail": "The highest level in his scheme, the goal of the supramental transformation." },
    { "label": "Overmind, intuition, illumined mind, higher mind", "detail": "Levels of spiritual mind above ordinary thinking." },
    { "label": "Mind", "detail": "Ordinary thinking and reasoning." },
    { "label": "Vital", "detail": "Life energy, desires, emotions, drive." },
    { "label": "Physical", "detail": "The body and its habits." },
    { "label": "Subconscient and inconscient", "detail": "What lies below waking awareness." }
  ],
  "caption": "Integral Yoga aims to transform every level, not escape from the lower ones. The psychic being, the evolving soul, stands behind them all."
}
:::

:::clinician
Buddhist psychology has had the deepest influence on modern clinical practice: MBSR and MBCT (mindfulness), DBT (mindfulness and radical acceptance, drawn partly from Zen), ACT (self-as-context, defusion), compassion-focused therapy and loving-kindness interventions. The Mind and Life dialogues between the Dalai Lama and scientists (from 1987) helped launch contemplative neuroscience (Davidson, Lutz). Caution: secular mindfulness extracts sati from its ethical framework (sila), which critics call "McMindfulness" (Purser). Sufi concepts have been discussed in Islamic psychology (al-Ghazali's Ihya, with nafs, qalb, ruh and aql as a model of the person) and studied in qawwali and dhikr research on altered states. Aurobindo's psychology has been developed by the **Indian Psychology Institute** in Pondicherry (Matthijs Cornelissen) and by other Indian scholars. Its claims about higher planes are not empirically testable in standard ways, which exam answers should note while explaining its value as a developmental and educational model.
:::

:::recall
1. State the Four Noble Truths using the medical analogy. || Diagnosis: suffering. Cause: craving. Prognosis: suffering can end. Treatment: the Eightfold Path.
2. Name the three marks of existence. || Anicca (impermanence), dukkha (unsatisfactoriness), anatta (no fixed self).
3. List the five skandhas. || Form, feeling, perception, mental formations, consciousness.
4. Name the three Qur'anic stages of the nafs. || Ammara (commanding), lawwama (self-reproaching), mutma'inna (at peace).
5. What are fana and baqa? || Fana: passing away of the ego in the divine. Baqa: subsistence, returning to life transformed.
6. Name Aurobindo's triple transformation. || Psychic, spiritual and supramental.
:::

:::mcq
Q: In Buddhism, the cause of suffering (the second noble truth) is:
- Ignorance of the Vedas
- Bad karma from past lives only
- The gunas
- *Craving (tanha)
> Samudaya: suffering arises from craving.

Q: The Sufi distinction between stations earned by effort and states given as grace is between:
- Fana and baqa
- Nafs and ruh
- *Maqamat and ahwal
- Dhikr and sama
> Maqamat are stations; ahwal are states.

Q: In Sri Aurobindo's psychology, the evolving soul that guides the person from within is the:
- *Psychic being
- Supermind
- Inconscient
- Vital being
> The psychic being comes forward in the psychic transformation.
:::

## 2.6 Nyaya and the ways of knowing [core][beginner]
How do we know anything? **Nyaya**, the Indian school of logic and epistemology (founded on **Gautama's Nyaya Sutras**), answered with a theory of **pramanas**: valid **means of knowledge**. This topic appears in **both** NET Paper 2 (Indian psychology) and NET Paper 1 (logical reasoning), so learn it carefully.

### Four terms
- **Pramata**: the knower.
- **Prameya**: the object known.
- **Pramana**: the means of valid knowledge.
- **Prama**: valid knowledge itself.

### Nyaya's four pramanas
1. **Pratyaksha (perception)**: knowledge from contact of the senses with objects. Nyaya distinguished **nirvikalpaka** (indeterminate, bare awareness before naming) from **savikalpaka** (determinate, recognised and named) perception, close to the modern difference between **sensation** and **perception**.
2. **Anumana (inference)**: knowledge from a sign that is invariably connected with something else. The invariable connection is **vyapti** ("wherever there is smoke, there is fire").
3. **Upamana (comparison or analogy)**: learning what a new word refers to through a described similarity. Told that a **gavaya** (wild ox) is "like a cow", a villager recognises one in the forest.
4. **Shabda (verbal testimony)**: knowledge from the words of a **reliable person (apta)**, such as an expert or, for the orthodox schools, the Vedas.

### Two more pramanas
**Mimamsa** and **Advaita Vedanta** accept six:
5. **Arthapatti (postulation)**: assuming something to explain an apparent contradiction. "Devadatta is fat but does not eat during the day; therefore he eats at night."
6. **Anupalabdhi (non-perception)**: knowing that something is absent because it is not perceived where it would be seen ("there is no pot on the floor").

### Which school accepts how many
| School | Pramanas accepted | Number |
|---|---|---|
| **Charvaka** | Perception only | 1 |
| **Buddhism, Vaisheshika** | Perception, inference | 2 |
| **Samkhya, Yoga** | Perception, inference, testimony | 3 |
| **Nyaya** | Perception, inference, comparison, testimony | 4 |
| **Prabhakara Mimamsa** | The four plus postulation | 5 |
| **Bhatta Mimamsa, Advaita Vedanta** | The five plus non-perception | 6 |

:::mnemonic Counting up the schools
**C**harvaka 1, **B**uddhists 2, **S**amkhya 3, **N**yaya 4, **M**imamsa and **V**edanta up to 6: "**C**areful **B**rains **S**eek **N**ew **M**eans of **V**alid knowledge."
:::

### The five-membered syllogism
For inference **for others** (parartha anumana), Nyaya used five steps:
| Step | Name | The classic example |
|---|---|---|
| 1 | **Pratijna** (proposition) | The hill has fire. |
| 2 | **Hetu** (reason) | Because it has smoke. |
| 3 | **Udaharana** (example with the rule) | Wherever there is smoke there is fire, as in a kitchen. |
| 4 | **Upanaya** (application) | This hill has smoke, which is always accompanied by fire. |
| 5 | **Nigamana** (conclusion) | Therefore the hill has fire. |

Unlike Aristotle's three-part syllogism, it includes a concrete **example** and is meant to persuade a listener. Inference for oneself (**svartha anumana**) needs no such formal steps.


:::widget flow
{
  "title": "The five-membered syllogism, step by step",
  "layout": "chain",
  "nodes": [
    { "id": "p", "label": "Pratijna: proposition", "detail": "The hill has fire." },
    { "id": "h", "label": "Hetu: reason", "detail": "Because it has smoke." },
    { "id": "u", "label": "Udaharana: example with the rule", "detail": "Wherever there is smoke there is fire, as in a kitchen." },
    { "id": "up", "label": "Upanaya: application", "detail": "This hill has smoke, which always goes with fire." },
    { "id": "n", "label": "Nigamana: conclusion", "detail": "Therefore the hill has fire." }
  ],
  "caption": "The example step makes the invariable connection (vyapti) visible to a listener. This is inference for others."
}
:::

### Fallacies (hetvabhasa)
A reason that only looks like a reason is a **hetvabhasa**. Nyaya lists five kinds, including the **inconclusive** reason (savyabhichara: "the hill has fire because it is knowable", but many knowable things lack fire), the **contradictory** reason (viruddha), the **counterbalanced** reason (satpratipaksha), the **unproved** reason (asiddha) and the **contradicted** reason (badhita, refuted by stronger evidence such as perception).

:::widget sort
{
  "prompt": "Which pramana is being used?",
  "buckets": ["Pratyaksha", "Anumana", "Upamana", "Shabda"],
  "items": [
    { "text": "You see dark clouds and wet roads and conclude it rained", "bucket": 1 },
    { "text": "You touch a stove and feel it is hot", "bucket": 0 },
    { "text": "You learn the boiling point of water from a reliable chemistry teacher", "bucket": 3 },
    { "text": "Told a jackfruit looks like a giant, spiky green melon, you recognise one at the market", "bucket": 2 },
    { "text": "A trusted psychiatrist tells you lithium needs blood-level monitoring", "bucket": 3 },
    { "text": "You hear a baby crying in the next room and know a baby is there", "bucket": 1, "why": "You infer the baby from the sound; you hear the cry directly, but the baby is inferred." }
  ]
}
:::

:::widget reveal
{
  "prompt": "A friend argues: “Psychology is a science because it is studied at universities.” Which kind of faulty reason (hetvabhasa) is this, and why?",
  "answer": "It is an inconclusive reason (savyabhichara): being studied at universities does not invariably go with being a science; astrology and theology have been taught at universities too. The reason lacks vyapti, the invariable connection with what it claims to prove."
}
:::

:::clinician
Nyaya epistemology is a realist, externalist theory: a cognition is valid (prama) if it corresponds to its object and arises from a reliable process (paratah pramanya, extrinsic validity, as against Mimamsa's svatah pramanya, intrinsic validity, where cognitions are presumed valid until defeated). This parallels the debate between reliabilism and evidentialism in contemporary epistemology. The nirvikalpaka and savikalpaka distinction anticipates modern work on pre-conceptual sensory registration versus categorical perception. In psychological research the pramanas map onto sources of evidence: perception (observation), inference (theory-guided reasoning from data), comparison (analogical reasoning and model-based learning) and testimony (literature and expert consensus), which makes a useful frame for NET answers linking Indian logic to research methods. NET Paper 1 questions commonly ask the number of pramanas per school, examples of each, the members of the syllogism and the hetvabhasa types.
:::

:::recall
1. What do pramata, prameya, pramana and prama mean? || Knower, object known, means of valid knowledge, valid knowledge.
2. Name Nyaya's four pramanas. || Pratyaksha (perception), anumana (inference), upamana (comparison), shabda (testimony).
3. Which two pramanas do Mimamsa and Advaita add? || Arthapatti (postulation) and anupalabdhi (non-perception).
4. What is vyapti? || The invariable concomitance between the sign and what it proves (smoke and fire).
5. Give the five members of the Nyaya syllogism. || Pratijna, hetu, udaharana, upanaya, nigamana.
6. How many pramanas does Charvaka accept? || One: perception.
:::

:::mcq
Q: Which school accepts exactly three pramanas: perception, inference and testimony?
- Nyaya
- *Samkhya
- Charvaka
- Advaita Vedanta
> Samkhya and Yoga accept three.

Q: "Ram is alive but not at home; therefore he is somewhere else." This is an example of:
- Upamana
- Anupalabdhi
- Pratyaksha
- *Arthapatti
> Postulating something to resolve an apparent conflict is arthapatti.
:::

## 2.7 Level check · Beginner [core][beginner]
Score 80% or more to open the Advanced level.

:::mcq
Q: Titchener's three elements of consciousness were:
- *Sensations, images and affections
- Id, ego and superego
- Stimulus, response and reinforcement
- Figure, ground and closure
> The structuralist elements.

Q: Functionalism was strongly influenced by:
- Descartes
- Freud
- *Darwin
- Wertheimer
> The adaptive value of consciousness came from evolutionary thinking.

Q: The law of effect was formulated by:
- Pavlov
- Watson
- Skinner
- *Thorndike
> Thorndike, cats in puzzle boxes (1898).

Q: Gestalt psychology began with Wertheimer's study of:
- Insight learning
- *The phi phenomenon
- Cognitive maps
- Nonsense syllables
> Apparent motion (1912).

Q: The NET syllabus names the four founding paths of academic psychology as:
- Wundt, Titchener, Watson, Skinner
- Plato, Aristotle, Descartes, Locke
- Maslow, Rogers, May, Frankl
- *Wundt, Freud, James, Dilthey
> As listed in UGC NET Unit 1.

Q: The book that named cognitive psychology in 1967 was written by:
- George Miller
- Noam Chomsky
- *Ulric Neisser
- Herbert Simon
> Neisser, Cognitive Psychology.

Q: In Advaita Vedanta, the sense that the self is separate from Brahman is due to:
- Karma yoga
- *Avidya (ignorance)
- Sattva
- Pratyahara
> Avidya and maya create apparent separateness.

Q: The part of the antahkarana that stores impressions and memories is:
- *Chitta
- Buddhi
- Manas
- Ahamkara
> Chitta is the storehouse.

Q: In Samkhya, the witnessing consciousness that does not change is:
- Prakriti
- *Purusha
- Mahat
- Ahamkara
> Purusha is pure consciousness.

Q: "Yogas chitta vritti nirodhah" is:
- The first noble truth
- A Sufi dhikr
- The Gita's definition of nishkama karma
- *Patanjali's definition of yoga
> Yoga Sutra 1.2.

Q: Clinging to life and fear of death is the klesha called:
- Raga
- Asmita
- *Abhinivesha
- Avidya
> The fifth klesha.

Q: In Buddhism, loving-kindness, compassion, sympathetic joy and equanimity together are the:
- *Four brahmaviharas
- Five skandhas
- Three poisons
- Eight limbs
> The four immeasurables.

Q: The Sufi stage of the self at peace is:
- Nafs al-ammara
- Nafs al-lawwama
- Qalb
- *Nafs al-mutma'inna
> The self at peace.

Q: Learning to recognise a wild ox because you were told it is like a cow is:
- Anumana
- Shabda
- *Upamana
- Arthapatti
> Comparison or analogy.

Q: In the Nyaya syllogism, "wherever there is smoke there is fire, as in a kitchen" is the:
- Pratijna
- *Udaharana
- Hetu
- Nigamana
> The example stating the general rule.
:::
`;
