/* Module · Exam prep, Parts I and II (Starting and Beginner). Exam patterns checked November 2026; always confirm with the official notice. Original text written for VIBHA School of Psychology. */
export const part1 = String.raw`
# Part I · Starting: know your exam

## 1.1 The exams at a glance [core][starting]
This module prepares you for four kinds of psychology exam in India:
- **the national teaching eligibility exam in psychology** (for Assistant Professor, research fellowship and PhD admission eligibility),
- **clinical psychology entrances** run by RCI-recognised institutes for the professional clinical master's (the old MPhil route is being replaced) and PhD,
- **the national master's entrance in psychology** for MA and MSc admission at central and many other universities,
- **university semester exams**, which are mostly descriptive (written answers).

:::widget flow
{
  "title": "Which exam is for which goal?",
  "layout": "tree",
  "nodes": [
    { "id": "g", "label": "Your goal", "detail": "Start from what you want to do next, not from which exam friends are taking." },
    { "id": "ma", "label": "MA or MSc admission", "parent": "g", "detail": "Central and many state universities admit through one national master's entrance; some universities run their own tests." },
    { "id": "cuet", "label": "National master's entrance", "parent": "ma", "detail": "Objective, negative marking. Undergraduate-level breadth." },
    { "id": "teach", "label": "Teaching, research fellowship or PhD eligibility", "parent": "g", "detail": "Assistant Professor eligibility, a Junior Research Fellowship, or PhD admission eligibility." },
    { "id": "net", "label": "National teaching eligibility exam", "parent": "teach", "detail": "A general paper (teaching and research aptitude) plus a psychology paper, taken together." },
    { "id": "clin", "label": "Clinical psychology training", "parent": "g", "detail": "The RCI-recognised professional route to practise as a clinical psychologist." },
    { "id": "inst", "label": "Clinical institute entrances", "parent": "clin", "detail": "MCQ papers heavy on psychopathology, assessment and research methods, often followed by an interview." },
    { "id": "uni", "label": "Pass your current course", "parent": "g", "detail": "University semester exams: mostly written answers." },
    { "id": "sem", "label": "Semester exams", "parent": "uni", "detail": "Short notes, long answers and case vignettes; structure and evaluation earn the marks." }
  ],
  "caption": "One curriculum prepares you for all of them; the exam changes the format, not the core content."
}
:::

:::safety Always check the official notice
Exam patterns change, sometimes from one year to the next. The figures below are **as reported for the 2025 and 2026 cycles** and were checked in November 2026. Before you plan, read the **current official information bulletin** from the conducting body (the national testing body for the national exams, the institute itself for institute entrances).
:::

| Exam | Who runs it | Format (as reported for recent cycles) | Negative marking |
|---|---|---|---|
| **National teaching eligibility exam** (psychology) | The national testing body, twice a year (June and December sessions) | Computer-based. General paper (teaching and research aptitude): 50 questions, 100 marks. Psychology paper: 100 questions, 200 marks. Both in one 3-hour sitting | **None** reported; 2 marks per correct answer |
| **National master's entrance** (psychology) | The national testing body | Computer-based, 75 questions, 300 marks, 90 minutes | **Yes**: +4 correct, minus 1 wrong |
| **A large clinical institute's entrance** (professional master's and PhD) | The institute | 100 multiple-choice questions in 90 minutes (2026 cycle). PhD adds an interview | **Yes**: +1 correct, minus 0.25 wrong |
| **Another clinical institute's entrance** | The institute | Computer-based, 100 questions (2025 cycle), plus an interview or practical component | Reported as **none** in 2025 |
| **Other institutes and university departments** | Each institute | Varies: written MCQ test, sometimes descriptive questions, often an interview | Varies |
| **University semester exams** | Your university | Mostly descriptive: short notes, long answers, case vignettes; some MCQ papers | Usually none |

:::note The clinical training route is changing
The Rehabilitation Council of India (RCI) is phasing out the **MPhil in Clinical Psychology** and moving to new professional programmes (a two-year professional master's in clinical psychology, and a professional doctorate). Entry rules (four-year undergraduate degree, or a bridge course after a three-year degree) are also changing. Some institutes, for example, list a **Master in Clinical Psychology** in place of their old MPhil for 2026. Check RCI's latest notices and each institute's prospectus.
:::

:::widget guess
{
  "prompt": "In the national teaching eligibility exam, the psychology paper has how many questions?",
  "min": 25,
  "max": 200,
  "step": 5,
  "unit": "questions",
  "answer": [100, 100],
  "reveal": "One hundred questions, 200 marks, worth twice the general paper. The general paper has 50. Both are taken together in three hours, so pace matters: roughly a minute per question.",
  "clinician": "Qualifying for Assistant Professor or a research fellowship depends on category-wise cut-offs and the aggregate of both papers; cut-offs and the PhD-only category rules are published per session by the conducting body. Check the bulletin for the current year."
}
:::

:::widget sort
{
  "prompt": "From the table (as reported for recent cycles), which exams penalise wrong answers?",
  "buckets": ["Negative marking", "No negative marking reported"],
  "items": [
    { "text": "National master's entrance", "bucket": 0 },
    { "text": "National teaching eligibility exam", "bucket": 1 },
    { "text": "The large clinical institute's entrance", "bucket": 0 },
    { "text": "The other clinical institute's entrance (2025 cycle)", "bucket": 1 }
  ]
}
:::

:::clinician
The psychology paper syllabus of the teaching eligibility exam, as last revised: ten units covering the emergence of psychology (including Indian psychology); research methodology and statistics; psychological testing; biological basis of behaviour; attention, perception, learning, memory and forgetting; thinking, intelligence and creativity; personality, motivation, emotion, stress and coping; social psychology; human development and interventions; and emerging areas (for example positive psychology, health psychology, environmental psychology, psychology and technology). The general paper covers teaching aptitude, research aptitude, comprehension, communication, mathematical reasoning, logical reasoning, data interpretation, ICT, people, development and environment, and the higher education system. Unit titles are sometimes paraphrased by coaching sites; use the official syllabus PDF.
:::

:::recall
1. Where do you find the current pattern of any exam? || The current official information bulletin from the conducting body.
2. How many questions are there in the teaching eligibility exam's general paper and psychology paper? || 50 and 100.
3. What is the master's entrance marking scheme, as reported? || +4 for a correct answer, minus 1 for a wrong answer, 75 questions in 90 minutes.
4. What is changing in clinical psychology training in India? || RCI is replacing the MPhil with new professional master's and doctoral programmes, with changed entry rules.
:::

:::mcq
Q: Before finalising your preparation strategy for an entrance exam, the most reliable source of the exam pattern is:
- A coaching institute's poster
- A senior's memory of last year
- *The current official information bulletin from the conducting body
- A social media post
> Patterns change; only the official notice is authoritative.
:::

## 1.2 How to study: what the evidence says [core][starting]
Most students prepare by **rereading** and **highlighting**. These feel productive, but research shows they are among the **least effective** methods. The methods that work feel harder.

### Techniques ranked by evidence
| Strong evidence | Moderate evidence | Weak evidence |
|---|---|---|
| **Practice testing** (answering questions from memory) | Elaborative questioning ("why is this true?") | Rereading |
| **Spaced practice** (revisiting topics after gaps) | Self-explanation | Highlighting and underlining |
| | **Interleaving** (mixing topics in one session) | Summarising (for most students) |
| | | Making the notes "look nice" |

:::widget sort
{
  "prompt": "Sort each study habit by how well research supports it.",
  "buckets": ["Strongly supported", "Weakly supported"],
  "items": [
    { "text": "Doing 30 mixed MCQs from memory, then checking every explanation", "bucket": 0 },
    { "text": "Reading the same chapter three times in one evening", "bucket": 1 },
    { "text": "Revisiting attachment theory after a few days, then again after a longer gap", "bucket": 0 },
    { "text": "Highlighting every important line in four colours", "bucket": 1 },
    { "text": "Writing a 15-mark answer from memory, then comparing with the textbook", "bucket": 0 },
    { "text": "Watching a lecture video at double speed and feeling you understood", "bucket": 1, "why": "Fluency while watching is not the same as being able to recall it later." }
  ]
}
:::

:::widget curve
{
  "kind": "forgetting",
  "title": "Why spacing beats cramming",
  "caption": "Each spaced review lifts memory back up, and the curve falls more slowly after each one. Rereading the same night adds little; reviewing after a gap adds a lot."
}
:::

### Plan in phases, not by the calendar
Every student's time is different, so plan in **phases** and move on when you meet the goal of each phase. Press Play to walk the pathway.

:::widget flow
{
  "title": "The exam strategy pathway",
  "layout": "chain",
  "nodes": [
    { "id": "map", "label": "1 · Map", "detail": "Read the official syllabus. Tick what you know, circle what you don't. Collect past papers. Done when every unit has a tick or a circle." },
    { "id": "build", "label": "2 · Build", "detail": "Learn each unit, then test yourself on it the next day and again a few days later. Done when you can answer unit questions from memory." },
    { "id": "mix", "label": "3 · Mix", "detail": "Mixed-topic question sets. Keep an error log: the question, your answer, why it was wrong, the rule. Done when your mixed-set scores are steady." },
    { "id": "mock", "label": "4 · Mock", "detail": "Full-length timed papers in exam conditions, each reviewed fully. Done when scores and pacing are stable across several mocks." },
    { "id": "polish", "label": "5 · Polish", "detail": "Only your error log and weak units. Sleep well before the exam. Done when the error log has no repeat mistakes." }
  ],
  "edgeLabels": { "build>mix": "after every unit", "mix>mock": "when steady" },
  "caption": "Move on when you meet a phase's goal, not when a date arrives."
}
:::

:::widget flow
{
  "title": "The error-log loop",
  "layout": "cycle",
  "nodes": [
    { "id": "try", "label": "Attempt from memory", "detail": "Answer under time, without notes." },
    { "id": "check", "label": "Check every answer", "detail": "Including the ones you got right by luck." },
    { "id": "log", "label": "Log the error", "detail": "Question, your answer, the correct answer, why you went wrong (did not know, misread, confused a look-alike, ran out of time)." },
    { "id": "rule", "label": "Write the rule", "detail": "One line you could teach a friend: 'Fregoli is strangers in disguise; Capgras is a familiar person replaced.'" },
    { "id": "retest", "label": "Retest after a gap", "detail": "Redo logged questions a few days later. A question leaves the log only when you get it right twice." }
  ],
  "caption": "Your error log is the most valuable revision material you own: it is a list of exactly what you do not yet know."
}
:::

:::widget decide
{
  "scene": "Neha, a final-year BA student in Jaipur, has three months before her master's entrance. Her plan: read all her semester notes twice, then attempt one mock test the week before the exam.",
  "ask": "What would most improve her plan?",
  "choices": [
    { "label": "Add a third reading of the notes to be safe", "verdict": "harm", "outcome": "She feels familiar with everything but freezes on applied questions in the mock.", "why": "Rereading builds a feeling of knowing, not the ability to retrieve and apply under time pressure." },
    { "label": "Replace much of the rereading with self-testing from the start, spaced revisits, mixed question sets, an error log and several timed mocks", "verdict": "best", "outcome": "Her mock scores rise steadily; she knows which units to fix.", "why": "Practice testing and spacing are the two best-supported techniques. Mocks also train pacing and negative-marking decisions." },
    { "label": "Skip the syllabus and only do mocks", "verdict": "ok", "outcome": "She improves at test-taking but has gaps in whole units.", "why": "Mocks are vital, but without learning the content first, testing has little to retrieve." }
  ]
}
:::

:::student
Sleep is part of studying. Memory is consolidated during sleep, and all-night revision before an exam usually costs more than it gains.
:::

:::clinician
Key evidence: A 2013 review of ten common study techniques rated practice testing and distributed practice as high utility, and rereading, highlighting and summarisation as low utility. Roediger and Karpicke's 2006 experiments demonstrated the testing effect; a 2006 review of more than 300 experiments confirmed the benefit of spacing; Rohrer and Taylor showed interleaving benefits for discrimination between similar problem types, which is exactly what MCQ exams with look-alike options demand. The same principles underlie the platform's checkpoints and spaced re-tests.
:::

:::recall
1. Name the two techniques with the strongest evidence. || Practice testing and spaced practice.
2. Why does rereading feel effective but work poorly? || It builds familiarity, not the ability to retrieve information.
3. Name the five phases of preparation. || Map, build, mix, mock, polish.
4. What goes in an error log? || The question, your answer, why it was wrong, and the rule to remember.
:::

:::mcq
Q: Which study method has the strongest research support for long-term retention?
- Rereading notes
- Highlighting
- *Testing yourself from memory, with spacing
- Copying notes neatly
> Practice testing and spacing are high-utility techniques.
:::

## 1.3 Exam-day strategy and the maths of negative marking [core][starting]
### Pacing
- Work out your **time per question** in advance (the teaching eligibility exam about 1.2 minutes per question; the master's entrance about 1.2 minutes; a 100-question, 90-minute institute paper about 0.9 minutes).
- **First pass**: answer what you know quickly. **Mark** the rest for review.
- **Second pass**: work through marked questions.
- Never spend three minutes on one question in the first pass.

:::widget curve
{
  "kind": "inverted-u",
  "title": "Exam nerves: how much arousal helps?",
  "caption": "Some arousal sharpens attention; too much narrows it and blocks recall, and the peak comes earlier for hard, complex questions. Slow breathing before the paper moves you back towards the top of the curve."
}
:::

### Should you guess when there is negative marking?
Think in **expected marks**, the average result of a guess over many questions.

With **4 options, +4 correct, minus 1 wrong** (the master's entrance pattern):
- A pure blind guess is right 1 time in 4. Expected marks = (1/4 × 4) minus (3/4 × 1) = 1 minus 0.75 = **+0.25**.
- If you can **eliminate one option**, you choose from 3. Expected marks = (1/3 × 4) minus (2/3 × 1) = about **+0.67**.
- If you can eliminate two, expected marks = (1/2 × 4) minus (1/2 × 1) = **+1.5**.

With **4 options, +1 correct, minus 0.25 wrong** (a common clinical institute pattern):
- A blind guess: (1/4 × 1) minus (3/4 × 0.25) = 0.25 minus 0.19 = about **+0.06**: tiny.
- After eliminating two options: (1/2 × 1) minus (1/2 × 0.25) = **+0.375**.

:::widget guess
{
  "prompt": "The master's entrance pattern (+4 right, minus 1 wrong, 4 options). You can rule out two options and must pick between the last two. On average, how many marks does guessing earn you per question?",
  "min": -1,
  "max": 4,
  "step": 0.25,
  "unit": "marks",
  "answer": [1.5, 1.5],
  "reveal": "+1.5 marks on average: half the time you gain 4, half the time you lose 1. Eliminating even one or two options turns guessing into a strongly positive bet.",
  "clinician": "Expected value per item = p(correct) × reward minus p(wrong) × penalty. Guessing is favourable whenever this is above zero. With four options and a quarter-mark penalty on a one-mark item, blind guessing is only marginally positive, so a risk-averse student may skip truly blind items; partial-knowledge guesses remain clearly favourable."
}
:::

:::widget decide
{
  "scene": "In a clinical institute entrance (+1, minus 0.25), Sameer reaches a question on a test he has never heard of. All four options look equally possible. He has 15 such questions.",
  "ask": "What is the most sensible approach?",
  "choices": [
    { "label": "Guess all 15 blindly to maximise marks", "verdict": "ok", "outcome": "On average he gains about one mark in total, but with real variation either way.", "why": "Blind guessing is very slightly positive here, so it is not wrong, but the gain is tiny and uncertain." },
    { "label": "Skip truly blind questions, but guess wherever he can eliminate even one option", "verdict": "best", "outcome": "He answers 9 after eliminating options and skips 6; his net score is better than average.", "why": "Partial-knowledge guesses carry a clear positive expectation; pure blind guesses add little. This balances gain and risk." },
    { "label": "Leave every uncertain question blank", "verdict": "harm", "outcome": "He throws away the marks he could have earned from the questions where he knew enough to eliminate options.", "why": "Over-caution wastes partial knowledge, which is where most guessing gains come from." }
  ]
}
:::

:::widget flow
{
  "title": "Guess or skip? A decision tree for negative marking",
  "layout": "tree",
  "nodes": [
    { "id": "q", "label": "Unsure of an answer", "detail": "First, is there negative marking in this exam?" },
    { "id": "no", "label": "No negative marking", "parent": "q", "detail": "Always answer. A blank earns nothing; a guess can only help." },
    { "id": "yes", "label": "Negative marking", "parent": "q", "detail": "Work out how many options you can rule out with a real reason." },
    { "id": "e2", "label": "Ruled out two", "parent": "yes", "detail": "Answer. Expected marks are clearly positive in every common Indian pattern." },
    { "id": "e1", "label": "Ruled out one", "parent": "yes", "detail": "Answer. Still positive: about +0.67 with +4 and minus 1." },
    { "id": "e0", "label": "Truly blind", "parent": "yes", "detail": "Small expected gain (+0.25 with +4 and minus 1; about +0.06 with +1 and minus 0.25). Guess if you are comfortable with risk; skipping is reasonable when the penalty is relatively large." }
  ],
  "caption": "Partial knowledge is where guessing pays; pure blind guesses add little."
}
:::

### Reading MCQs carefully
- Watch for **NOT, EXCEPT, LEAST, MOST, FIRST**.
- In "choose the correct combination" questions, check each statement on its own first.
- Do not change an answer unless you have a **clear reason**; change it when you do. (Research suggests changed answers more often go from wrong to right than the reverse, so second thoughts with a reason are worth acting on.)

:::recall
1. How do you calculate the expected marks of a guess? || Probability correct times reward, minus probability wrong times penalty.
2. With +4 and minus 1 and four options, what is the expected value of a blind guess? || +0.25 marks.
3. Should you change an answer on review? || Yes, if you have a clear reason; changes more often go from wrong to right.
:::

:::mcq
Q: In an exam with +1 for correct and minus 0.25 for wrong, with four options, which guess has the highest expected value?
- A blind guess among four
- *A guess after eliminating two options
- Leaving it blank
- A guess after eliminating one option
> Fewer options left means a higher chance of being right.
:::

## 1.4 Level check · Starting [core][starting]
Score 80% or more to open the Beginner level.

:::mcq
Q: In the national teaching eligibility exam, the psychology paper has:
- 50 questions
- *100 questions
- 150 questions
- 200 questions
> 100 questions for 200 marks; the general paper has 50.

Q: In the national teaching eligibility exam, the general paper tests:
- Only psychology
- *General teaching and research aptitude, reasoning and related areas
- English grammar only
- Clinical skills
> It is the general paper, taken with the psychology paper.

Q: As reported for recent cycles, which exam awards +4 and deducts 1 per wrong answer?
- The national teaching eligibility exam
- *The national master's entrance
- The other clinical institute's entrance (2025 cycle)
- Semester exams
> The master's entrance: 75 questions, 300 marks.

Q: Which body regulates professional training in clinical psychology in India?
- The national testing body
- *Rehabilitation Council of India (RCI)
- National Medical Commission
- Each university alone
> RCI.

Q: The best source for the current exam pattern is:
- Coaching notes
- *The official information bulletin
- A friend
- Last year's question paper alone
> Always the official notice.

Q: Which technique has the strongest evidence for durable learning?
- Highlighting
- Rereading
- *Practice testing
- Summarising
> The testing effect.

Q: Spaced practice means:
- Studying in a quiet space
- *Returning to a topic after gaps of increasing length
- Cramming the night before
- Leaving space in notes
> Distributed practice.

Q: Interleaving means:
- Studying one topic until perfect
- *Mixing different topics or problem types in one session
- Writing between the lines
- Studying with friends
> Helps discriminate look-alike problems.

Q: An error log should include:
- Only the correct answer
- *The question, your answer, why it was wrong, and the rule
- Your score only
- Nothing; errors should be forgotten
> Turn mistakes into rules.

Q: With +4 for right, minus 1 for wrong and four options, a blind guess earns on average:
- Minus 1
- Zero
- *+0.25
- +1
> 1 minus 0.75.

Q: Eliminating options before guessing:
- Lowers your expected score
- *Raises your expected score
- Makes no difference
- Is not allowed
> Higher chance of being right.

Q: On a first pass through an MCQ paper you should:
- Spend as long as needed on each question
- *Answer known questions quickly and mark the rest for review
- Start from the last question
- Guess everything
> Secure the easy marks first.

Q: Words that most often trap readers in MCQs include:
- Psychology and behaviour
- *NOT, EXCEPT and LEAST
- Patient and doctor
- Theory and research
> Negative wording.

Q: All-night revision before an exam usually:
- Improves memory
- *Harms performance because sleep supports memory consolidation
- Has no effect
- Is recommended
> Sleep matters.
:::

# Part II · Beginner: high-yield content, in exam style

## 2.1 The high-yield map [core][beginner]
Not every topic is equally likely. These areas come up again and again (based on the syllabus and the pattern of past papers).

### General psychology papers (teaching eligibility and master's entrance): high-yield topics
| Area | Topics that come up most |
|---|---|
| Schools and history | Structuralism, functionalism, Gestalt, behaviourism, psychoanalysis, humanistic, cognitive; Indian psychology (yoga, Buddhist and Vedantic ideas of self and mind) |
| Research methods and statistics | Types of research design, sampling, variables, reliability and validity, scales of measurement, normal curve, correlation, t-test, ANOVA, chi-square, non-parametric tests, Type I and II errors |
| Testing | Test construction, item analysis, norms, standard scores, major intelligence and personality tests, Indian tests |
| Biological basis | Neurons and transmitters, brain regions, hemispheric specialisation, endocrine system, sleep, genetics of behaviour |
| Cognitive | Attention theories, perception (Gestalt laws, depth cues, signal detection), learning (classical, operant, observational), memory models, forgetting, problem solving |
| Intelligence and creativity | Spearman, Thurstone, Cattell, Guilford, Gardner, Sternberg, PASS (J. P. Das), emotional intelligence, creativity stages |
| Personality, motivation, emotion | Freud, neo-Freudians, trait theories (Allport, Cattell, Eysenck, Big Five), Rogers, Maslow, Bandura; theories of emotion; stress and coping (Lazarus) |
| Social | Attribution, attitudes and dissonance, conformity, obedience, prejudice, group processes, prosocial behaviour; Indian social psychologists |
| Development | Piaget, Vygotsky, Erikson, Kohlberg, attachment, ageing |
| Applied and emerging | Positive psychology, health psychology, counselling, organisational, environmental, community psychology |

:::widget layers
{
  "title": "Where to spend your hours first",
  "shape": "stack",
  "layers": [
    { "label": "Top priority: every exam, every year", "detail": "Research methods and statistics; psychological testing and psychometrics. Predictable questions, reliable marks." },
    { "label": "High priority", "detail": "Cognitive processes (attention, perception, learning, memory); personality and motivation; social psychology; developmental theories." },
    { "label": "High for clinical entrances", "detail": "Psychopathology and diagnosis (DSM-5-TR and ICD-11), assessment tools, therapies, mental health law and ethics." },
    { "label": "Steady marks", "detail": "Schools and history, biological basis, intelligence and creativity, Indian psychology and Indian contributors." },
    { "label": "Finish with", "detail": "Applied and emerging areas: positive, health, organisational, environmental and community psychology." }
  ],
  "caption": "Order your Build phase from the top down, then mix all levels in practice sets."
}
:::

### Clinical psychology entrances: high-yield topics
- **Psychopathology and diagnosis** (DSM-5-TR and ICD-11): schizophrenia spectrum, mood, anxiety, OCD, trauma, dissociative, somatic, eating, substance, personality, neurodevelopmental and neurocognitive disorders.
- **Assessment**: intelligence, personality, projective and neuropsychological tests; rating scales.
- **Therapies**: behaviour therapy, CBT, REBT, third-wave therapies, psychodynamic, family and group.
- **Research methods and statistics** (consistently heavy).
- **Mental health law and ethics**: the Mental Healthcare Act 2017, the RCI Act 1992, the Rights of Persons with Disabilities Act 2016.
- **General psychology** at postgraduate level.

:::widget sort
{
  "prompt": "Which exam is each topic most associated with?",
  "buckets": ["Both general and clinical exams", "Clinical entrances especially"],
  "items": [
    { "text": "Scales of measurement and the normal curve", "bucket": 0 },
    { "text": "Mental Healthcare Act 2017 provisions", "bucket": 1 },
    { "text": "Piaget's stages", "bucket": 0 },
    { "text": "Schneider's first-rank symptoms", "bucket": 1 },
    { "text": "MMPI-2 validity scales", "bucket": 1, "why": "Asked in general exams too, but at depth in clinical entrances." },
    { "text": "Theories of emotion", "bucket": 0 }
  ]
}
:::


:::widget timeline
{
 "prompt": "Arrange in sequence: put these milestones in the history of psychology in order.",
 "events": [
  {
   "label": "Wundt opens the first psychology laboratory in Leipzig",
   "when": "1879"
  },
  {
   "label": "Binet and Simon publish the first practical intelligence scale",
   "when": "1905"
  },
  {
   "label": "Watson calls for psychology as the science of behaviour",
   "when": "1913"
  },
  {
   "label": "Rorschach introduces the inkblot test",
   "when": "1921"
  },
  {
   "label": "Skinner describes operant conditioning",
   "when": "1938"
  },
  {
   "label": "Rogers sets out client-centred therapy",
   "when": "1951"
  },
  {
   "label": "The cognitive revolution: memory and mind return to centre stage",
   "when": "1956"
  },
  {
   "label": "Beck develops cognitive therapy for depression",
   "when": "1960s"
  }
 ],
 "why": "Anchor the ends first: Wundt is always earliest, and cognitive therapy comes after the cognitive revolution. Then place the middle by school: testing and behaviourism early in the century, humanistic and cognitive ideas after the Second World War."
}
:::

:::student
Use this module with the others. For psychopathology, the disorder modules; for interviewing, Module 1 and the MSE in depth; for therapies, the therapies module; for assessment, the assessment module. Here you practise **in exam style**.
:::

:::recall
1. Name five high-yield areas for a general psychology paper. || Research methods and statistics, testing, cognitive processes, personality and motivation, social psychology (also schools, biological basis, intelligence, development).
2. Name three laws often asked in clinical entrances. || Mental Healthcare Act 2017, RCI Act 1992, Rights of Persons with Disabilities Act 2016.
:::

:::mcq
Q: Which area is consistently heavy in both general psychology papers and clinical psychology entrances?
- Industrial safety regulations
- *Research methods and statistics
- Astrology
- Medical pharmacology dosing
> Every exam tests research methods.
:::

## 2.2 Practice set A: research methods and statistics [core][beginner]
Research methods and statistics carry marks in every exam, and the questions are predictable once you know the patterns.

:::note How this set works
Read the high-yield summary and do the activity here. The exam-style questions for this set are saved for your **checkpoint**, after you have moved on, because answering after a gap is what makes it stick.
:::

| Concept | The line to remember |
|---|---|
| Scales | Nominal (names), ordinal (order), interval (equal steps, no true zero), ratio (true zero) |
| Normal curve | About 68, 95 and 99.7% of scores within one, two and three standard deviations |
| Type I error | Rejecting a true null hypothesis (false positive); its probability is alpha |
| Type II error | Failing to reject a false null (false negative); power is one minus its probability |
| Reliability | Consistency: test-retest, parallel forms, split-half (Spearman-Brown), internal consistency (Cronbach's alpha), inter-rater (kappa) |
| Validity | Accuracy: content, criterion (concurrent, predictive), construct (convergent, discriminant), face |
| Designs | Between and within subjects; Solomon four-group controls for pre-test effects; quasi-experiments lack random assignment |

:::widget curve
{
  "kind": "normal",
  "title": "The normal curve: z, percentile and p",
  "caption": "68, 95 and 99.7% of scores fall within one, two and three standard deviations; a z of 1.96 cuts off 2.5% in each tail; IQ and T-scores map onto the same curve."
}
:::

:::widget flow
{
  "title": "Choosing a test: the decision tree",
  "layout": "tree",
  "nodes": [
    { "id": "r", "label": "What is the question?", "detail": "A difference between groups or conditions, or a relationship between variables?" },
    { "id": "cat", "label": "Counts in categories", "parent": "r", "detail": "Chi-square (goodness of fit for one variable; test of independence for two)." },
    { "id": "diff", "label": "Difference, numeric outcome", "parent": "r", "detail": "How many groups, and are they independent or related?" },
    { "id": "two", "label": "Two groups", "parent": "diff", "detail": "Independent: t-test (or Mann-Whitney U). Related: paired t-test (or Wilcoxon signed-rank)." },
    { "id": "three", "label": "Three or more groups", "parent": "diff", "detail": "Independent: one-way ANOVA (or Kruskal-Wallis). Related: repeated-measures ANOVA (or Friedman). Two or more factors: factorial ANOVA." },
    { "id": "rel", "label": "Relationship", "parent": "r", "detail": "Two interval variables: Pearson's r. Ranks: Spearman's rho. Predicting one from others: regression." }
  ],
  "caption": "The non-parametric option, in brackets, is for ranked data or when assumptions such as normality fail."
}
:::

:::widget worked
{
  "title": "Choosing the right statistical test",
  "steps": [
    { "q": "What type of data is the outcome: categories (nominal), ranks (ordinal), or numbers on an interval or ratio scale?", "a": "This decides parametric versus non-parametric, and chi-square for categories." },
    { "q": "How many groups or conditions are being compared?", "a": "Two groups: t-test (or Mann-Whitney U if non-parametric). Three or more: ANOVA (or Kruskal-Wallis)." },
    { "q": "Are the groups independent or the same people measured twice (related)?", "a": "Related two conditions: paired t-test (or Wilcoxon signed-rank). Related three or more: repeated-measures ANOVA (or Friedman)." },
    { "q": "Is the question about a relationship rather than a difference?", "a": "Two interval variables: Pearson's r. Ranks: Spearman's rho. Predicting one variable from others: regression." }
  ],
  "yourTurn": [
    { "q": "A researcher compares anxiety scores (interval) of the same 30 students before and after a mindfulness course. Data are normally distributed. Which test?", "a": "A paired (related samples) t-test." },
    { "q": "She compares the number of men and women (counts) who choose counselling, face-to-face therapy or no help. Which test?", "a": "Chi-square test of independence." }
  ]
}
:::


:::widget sort
{
 "prompt": "Name the design. Sort each study.",
 "buckets": [
  "True experiment",
  "Quasi-experiment",
  "Correlational",
  "Case study"
 ],
 "items": [
  {
   "text": "Students are randomly assigned to sleep 4 or 8 hours before a memory test",
   "bucket": 0,
   "why": "The researcher manipulates sleep and assigns people at random."
  },
  {
   "text": "Exam scores are compared between two existing colleges, one of which adopted a new teaching method",
   "bucket": 1,
   "why": "There is a manipulation, but no random assignment: the groups already existed."
  },
  {
   "text": "Hours of phone use and loneliness scores are measured in 500 adolescents in Pune",
   "bucket": 2,
   "why": "Nothing is manipulated; two variables are measured and related."
  },
  {
   "text": "A detailed study of one man who lost the ability to form new memories after surgery",
   "bucket": 3,
   "why": "One person studied in depth."
  },
  {
   "text": "Depression scores are compared before and after a flood in one district, with no control group",
   "bucket": 1,
   "why": "A naturally occurring event, no random assignment."
  },
  {
   "text": "Patients are randomly given CBT or a waiting list, and anxiety is rated blind",
   "bucket": 0
  }
 ]
}
:::

:::mcq
Q: Gender (male, female, other) is measured on which scale?
- Ordinal
- *Nominal
- Interval
- Ratio
> Categories with no order.

Q: In a normal distribution, roughly what percentage of scores lie within one standard deviation of the mean?
- 50%
- *68%
- 95%
- 99.7%
> 68, 95 and 99.7% within one, two and three SDs.

Q: A Type I error is:
- Accepting a false null hypothesis
- *Rejecting a true null hypothesis
- A measurement error
- A sampling error only
> A false positive.

Q: The power of a statistical test is:
- The probability of a Type I error
- *The probability of correctly rejecting a false null hypothesis
- The size of the sample
- The level of significance
> One minus the probability of a Type II error.

Q: Which test compares three or more independent groups on ranked data?
- Mann-Whitney U
- Wilcoxon signed-rank
- *Kruskal-Wallis H
- Paired t-test
> The non-parametric equivalent of one-way ANOVA.

Q: Cronbach's alpha estimates:
- Test-retest reliability
- *Internal consistency
- Predictive validity
- Inter-rater reliability
> How well items hang together.

Q: The Spearman-Brown formula is used to:
- Convert raw scores to percentiles
- *Estimate full-test reliability from split-half reliability
- Calculate validity
- Compute correlation from ranks
> Corrects split-half reliability for test length.

Q: In the Solomon four-group design, the extra groups control for:
- Experimenter bias
- *The effect of the pre-test itself
- Attrition
- Placebo effects
> Two groups receive no pre-test.

Q: Assertion (A): A test can be reliable without being valid. Reason (R): Reliability is about consistency; validity is about measuring what the test claims to measure. Choose the correct option.
- Both A and R are false
- A is true, R is false
- *Both A and R are true, and R correctly explains A
- Both A and R are true, but R does not explain A
> A bathroom scale that is always 2 kg off is consistent but wrong.

Q: Workers become more productive simply because they know they are being studied. This is the:
- Pygmalion effect
- *Hawthorne effect
- Placebo effect
- Halo effect
> Reactivity to being observed.

Q: A researcher studies the same children at ages 5, 10 and 15. The design is:
- Cross-sectional
- *Longitudinal
- Cross-sequential
- Case study
> The same people over time.

Q: Which sampling method gives every member of the population an equal chance of selection?
- Quota sampling
- Snowball sampling
- *Simple random sampling
- Purposive sampling
> The basis of probability sampling.
:::

## 2.3 Practice set B: cognitive, biological and developmental [core][beginner]
The names-and-concepts pairs below are the commonest "match the following" and assertion-reason material.

:::note How this set works
Read the high-yield summary and do the activity here. The exam-style questions for this set are saved for your **checkpoint**, after you have moved on, because answering after a gap is what makes it stick.
:::

| Theorist | Concept |
|---|---|
| Weber, Fechner | Just-noticeable difference; psychophysics |
| Broadbent, Treisman, Deutsch and Deutsch | Early filter, attenuation, late selection |
| Baddeley and Hitch | Working memory (loop, sketchpad, central executive; episodic buffer added later) |
| Tulving | Episodic versus semantic memory |
| Ebbinghaus | Forgetting curve, savings |
| Spearman, Thurstone, Cattell, Guilford, Gardner, Sternberg, J. P. Das | g; primary mental abilities; fluid and crystallised; structure of intellect; multiple intelligences; triarchic; PASS |
| Piaget, Vygotsky, Kohlberg, Erikson | Cognitive stages; ZPD and scaffolding; moral reasoning levels; psychosocial crises |
| James-Lange, Cannon-Bard, Schachter-Singer, Lazarus | Theories of emotion: body first; simultaneous; arousal plus label; appraisal |

:::widget brainmap
{
  "title": "High-yield brain areas for objective papers",
  "focus": ["broca", "wernicke", "hippocampus", "amygdala", "occipital", "cerebellum", "hypothalamus", "corpus-callosum"],
  "notes": {
    "broca": "Left frontal. Damage: non-fluent, effortful speech with fairly preserved comprehension (expressive aphasia).",
    "wernicke": "Left temporal. Damage: fluent but empty speech with poor comprehension (receptive aphasia).",
    "hippocampus": "Forming new explicit memories. H.M., after removal of both medial temporal lobes, could not form new long-term memories but learned new skills.",
    "amygdala": "Fear learning and emotional memory. Kluver-Bucy syndrome follows damage to both temporal lobes including the amygdala.",
    "occipital": "Primary visual cortex. Damage can cause cortical blindness; nearby damage causes face blindness (prosopagnosia).",
    "cerebellum": "Balance, coordination and timing; also some motor learning.",
    "hypothalamus": "Hunger, thirst, temperature, sleep timing (the suprachiasmatic nucleus) and the HPA stress axis.",
    "corpus-callosum": "Links the hemispheres. Split-brain studies showed left-hemisphere language dominance in most people."
  },
  "caption": "Match-the-following questions often pair a region, a function and a classic case."
}
:::

:::widget neuron
{
  "title": "The action potential, as exams ask it",
  "myelinated": true,
  "caption": "Raise the stimulus past threshold and fire: the spike is all or none. Turn myelin off to see slower, continuous conduction; with myelin, the signal jumps between nodes of Ranvier (saltatory conduction)."
}
:::

:::widget curve
{
  "kind": "sdt",
  "title": "Signal detection: sensitivity versus bias",
  "caption": "Move d prime and the criterion. Sensitivity (d prime) is how well signal is separated from noise; the criterion is the observer's willingness to say 'yes'. A liberal criterion raises hits and false alarms together."
}
:::

:::widget sort
{
  "prompt": "Match each concept to its area.",
  "buckets": ["Attention and perception", "Memory", "Intelligence"],
  "items": [
    { "text": "Attenuation model", "bucket": 0 },
    { "text": "Episodic buffer", "bucket": 1 },
    { "text": "PASS model", "bucket": 2 },
    { "text": "Signal detection theory", "bucket": 0 },
    { "text": "Retroactive interference", "bucket": 1 },
    { "text": "Fluid versus crystallised", "bucket": 2 },
    { "text": "Weber's law", "bucket": 0 },
    { "text": "Savings method", "bucket": 1, "why": "Ebbinghaus measured how much faster relearning was." }
  ]
}
:::

:::widget experiment
{
 "title": "Leading questions and memory",
 "question": "People watched a film of a car crash, then were asked how fast the cars were going when they '___' each other. Average estimate, by the verb used?",
 "unit": "mph",
 "max": 50,
 "conditions": [
  {
   "label": "smashed",
   "value": 41
  },
  {
   "label": "collided",
   "value": 39
  },
  {
   "label": "bumped",
   "value": 38
  },
  {
   "label": "hit",
   "value": 34
  },
  {
   "label": "contacted",
   "value": 32
  }
 ],
 "why": "One word shifted the estimate by about 9 mph. A week later, more of the 'smashed' group falsely remembered broken glass. Exams ask this as evidence that memory is reconstructive and that leading questions matter in eyewitness testimony."
}
:::


:::widget timeline
{
 "prompt": "Arrange Erikson's psychosocial stages in order, from infancy to old age.",
 "events": [
  {
   "label": "Trust or mistrust",
   "when": "infancy"
  },
  {
   "label": "Autonomy or shame and doubt",
   "when": "toddler"
  },
  {
   "label": "Initiative or guilt",
   "when": "preschool"
  },
  {
   "label": "Industry or inferiority",
   "when": "school age"
  },
  {
   "label": "Identity or role confusion",
   "when": "adolescence"
  },
  {
   "label": "Intimacy or isolation",
   "when": "young adulthood"
  },
  {
   "label": "Generativity or stagnation",
   "when": "middle adulthood"
  },
  {
   "label": "Integrity or despair",
   "when": "late adulthood"
  }
 ],
 "why": "A quick check: the first four match Freud's oral, anal, phallic and latency periods; identity sits at adolescence; the last three cover adult life, which Freud's scheme did not."
}
:::

:::mcq
Q: Weber's law states that the just-noticeable difference is:
- A fixed amount for all stimuli
- *A constant proportion of the original stimulus intensity
- Equal to the absolute threshold
- Unrelated to stimulus size
> The ratio stays roughly constant.

Q: Signal detection theory separates sensitivity from:
- Attention
- *Response bias (criterion)
- Memory
- Motivation only
> d-prime and the criterion.

Q: Treisman's model of attention proposes that unattended messages are:
- Completely blocked
- *Attenuated (weakened) rather than blocked
- Processed fully
- Stored in long-term memory
> Attenuation theory, a modification of Broadbent's filter.

Q: The component added to Baddeley and Hitch's working memory model in 2000 was the:
- Phonological loop
- Visuospatial sketchpad
- Central executive
- *Episodic buffer
> It links working memory to long-term memory.

Q: New learning interfering with recall of older information is:
- Proactive interference
- *Retroactive interference
- Decay
- Motivated forgetting
> "Retro" works backwards.

Q: Match List I (theorist) with List II (concept). A. Vygotsky B. Piaget C. Kohlberg D. Erikson. i. Zone of proximal development ii. Conservation iii. Post-conventional morality iv. Identity versus role confusion.
- A-ii, B-i, C-iv, D-iii
- *A-i, B-ii, C-iii, D-iv
- A-iii, B-iv, C-i, D-ii
- A-iv, B-iii, C-ii, D-i
> Each concept belongs to its theorist as listed.

Q: Arrange Wallas's stages of creativity in order.
- Illumination, preparation, verification, incubation
- *Preparation, incubation, illumination, verification
- Incubation, preparation, verification, illumination
- Verification, illumination, incubation, preparation
> Prepare, let it rest, the "aha", then check.

Q: The PASS theory of intelligence was proposed by:
- Howard Gardner
- *J. P. Das and colleagues
- Robert Sternberg
- Raymond Cattell
> Planning, Attention, Simultaneous and Successive processing, based on Luria's work.

Q: Crystallised intelligence refers to:
- Speed of solving novel problems
- *Knowledge and skills built up through experience
- Musical ability
- Emotional understanding
> Cattell and Horn's distinction from fluid intelligence.

Q: Damage to Broca's area typically produces:
- Fluent speech with poor comprehension
- *Non-fluent, effortful speech with relatively preserved comprehension
- Loss of vision
- Inability to recognise faces
> Expressive aphasia.

Q: The Schachter-Singer theory says emotion depends on:
- Bodily arousal alone
- Thalamic signals alone
- *Physiological arousal plus a cognitive label for it
- Facial expression alone
> The two-factor theory.

Q: According to the Yerkes-Dodson law, performance on a complex task is best at:
- Very low arousal
- *Moderate arousal
- Very high arousal
- Any level of arousal
> An inverted-U, with the peak lower for harder tasks.
:::

## 2.4 Practice set C: personality, social psychology and testing [core][beginner]
Social psychology classics and test facts are reliable marks if you know the study behind each name.

:::note How this set works
Read the high-yield summary and do the activity here. The exam-style questions for this set are saved for your **checkpoint**, after you have moved on, because answering after a gap is what makes it stick.
:::

| Study or idea | What it showed |
|---|---|
| Asch (lines) | Conformity to a unanimous wrong majority |
| Milgram (shocks) | Obedience to authority |
| Zimbardo (prison) | Role power; now heavily criticised for its methods |
| Sherif (Robbers Cave) | Superordinate goals reduce intergroup conflict |
| Festinger and Carlsmith | Cognitive dissonance: less pay, more attitude change |
| Latané and Darley | Bystander effect, diffusion of responsibility |
| Janis | Groupthink |
| Heider, Kelley, Weiner | Attribution: internal and external; covariation; locus, stability, controllability |
| Indian contributors | Durganand Sinha (indigenous psychology), Janak Pandey (social psychology), Udai Pareek (organisational), J. P. Das (PASS) |

:::widget layers
{
  "title": "Maslow's hierarchy, as examiners ask it",
  "shape": "pyramid",
  "layers": [
    { "label": "Self-actualisation", "detail": "Becoming what one can be. Maslow's self-actualisers showed acceptance, spontaneity, problem-centring and peak experiences. Self-transcendence was added in his later writing." },
    { "label": "Esteem", "detail": "Respect from others and self-respect: competence, recognition." },
    { "label": "Love and belonging", "detail": "Friendship, family, intimacy, being part of a group." },
    { "label": "Safety", "detail": "Security, stability, freedom from fear." },
    { "label": "Physiological", "detail": "Food, water, sleep, warmth. The lower four are deficiency needs; the top is a growth need." }
  ],
  "caption": "For evaluation marks: needs are broadly universal, but research does not support a strict order, and the ordering reflects individualistic values."
}
:::

:::widget sort
{
  "prompt": "Which standard score is it?",
  "buckets": ["Mean 100, SD 15", "Mean 50, SD 10", "Mean 0, SD 1"],
  "items": [
    { "text": "Wechsler IQ", "bucket": 0 },
    { "text": "T-score", "bucket": 1 },
    { "text": "z-score", "bucket": 2 },
    { "text": "MMPI-2 clinical scale scores", "bucket": 1, "why": "MMPI scales are reported as T-scores." }
  ]
}
:::

:::widget experiment
{
 "title": "Asch: how big must a majority be?",
 "question": "Participants judged which line matched a standard, after others (all actors) gave a clearly wrong answer. On what share of these trials did people go along with the wrong answer?",
 "unit": "%",
 "conditions": [
  {
   "label": "Alone, no group (control)",
   "value": 1,
   "note": "Errors under 1%: the task is easy."
  },
  {
   "label": "One actor giving the wrong answer",
   "value": 4
  },
  {
   "label": "Two actors",
   "value": 14
  },
  {
   "label": "Three actors",
   "value": 32
  },
  {
   "label": "A unanimous group of seven to nine",
   "value": 37,
   "note": "The famous figure: about a third of trials."
  },
  {
   "label": "Same group, but one partner gives the right answer",
   "value": 6,
   "note": "One ally breaks the pressure."
  }
 ],
 "why": "Conformity rises steeply up to three people, then levels off, and collapses when unanimity is broken. Most participants conformed at least once, but most answers overall were still correct."
}
:::


:::widget experiment
{
 "title": "Darley and Latane: the bystander effect",
 "question": "Students in separate booths heard another student apparently having a seizure over an intercom. What share went for help before the seizure ended?",
 "unit": "%",
 "conditions": [
  {
   "label": "Believed they were the only listener",
   "value": 85
  },
  {
   "label": "Believed one other person could hear",
   "value": 62
  },
  {
   "label": "Believed four others could hear",
   "value": 31
  }
 ],
 "why": "The more bystanders a person believes are present, the less likely and slower they are to help: diffusion of responsibility. Those who did not help were not callous; most were visibly anxious and conflicted."
}
:::

:::mcq
Q: The Big Five factor that describes organised, dependable and goal-directed behaviour is:
- Openness
- *Conscientiousness
- Agreeableness
- Neuroticism
> OCEAN.

Q: Eysenck's three-factor model includes:
- Openness, conscientiousness, agreeableness
- *Psychoticism, extraversion, neuroticism
- Id, ego, superego
- Warmth, reasoning, dominance
> PEN.

Q: Bandura's reciprocal determinism describes interaction between:
- Id, ego and superego
- *Person, behaviour and environment
- Genes and hormones
- Stimulus and response only
> Triadic reciprocal causation.

Q: In Kelley's covariation model, high consensus, high distinctiveness and high consistency lead to attributing behaviour to:
- The person
- *The situation or stimulus
- Chance
- Luck only
> External attribution.

Q: People's tendency to over-explain others' behaviour by personality and under-weight the situation is the:
- Actor-observer bias
- *Fundamental attribution error
- Self-serving bias
- False consensus effect
> Correspondence bias.

Q: Festinger and Carlsmith's study ($1 versus $20 for lying that a task was interesting) supports:
- Social learning theory
- *Cognitive dissonance theory
- Drive reduction theory
- Self-perception only
> Those paid less changed their attitude more.

Q: The bystander effect was first studied systematically by:
- Asch
- Milgram
- *Latané and Darley
- Sherif
> More bystanders, less individual help.

Q: Janis described the faulty decision-making of cohesive groups as:
- Social loafing
- Group polarisation
- *Groupthink
- Deindividuation
> Pressure for consensus overrides critical thinking.

Q: Sherif's Robbers Cave study showed that intergroup hostility can be reduced by:
- Mere contact
- *Superordinate goals requiring cooperation
- Competition
- Separation
> Shared goals both groups needed.

Q: T-scores have a mean and standard deviation of:
- 100 and 15
- *50 and 10
- 0 and 1
- 5 and 2
> Wechsler IQ uses 100 and 15; z-scores 0 and 1.

Q: In item analysis, the difficulty index (p) of an item is:
- The correlation with total score
- *The proportion of test-takers answering it correctly
- The number of options
- The time taken
> Higher p means an easier item.

Q: Which is an Indian adaptation of the Wechsler intelligence scale for children?
- Raven's Progressive Matrices
- *Malin's Intelligence Scale for Indian Children (MISIC)
- Thematic Apperception Test
- MMPI
> Malin adapted the WISC for Indian children.

Q: The Bhatia Battery is a:
- Projective personality test
- *Performance test of intelligence developed in India
- Depression rating scale
- Neuropsychological battery for dementia only
> C. M. Bhatia, including Koh's block design and pattern drawing.
:::

## 2.5 Level check · Beginner [core][beginner]
Score 80% or more to open the Advanced level.

:::mcq
Q: Which test compares means of two independent groups with normally distributed data?
- Paired t-test
- *Independent samples t-test
- Chi-square
- Wilcoxon signed-rank
> Two independent groups, interval data.

Q: The non-parametric equivalent of the paired t-test is:
- Mann-Whitney U
- *Wilcoxon signed-rank test
- Kruskal-Wallis
- Pearson's r
> For related samples.

Q: Test-retest reliability measures:
- Agreement between raters
- *Stability of scores over time
- Item homogeneity
- Construct validity
> Same test, two occasions.

Q: A Type II error is:
- Rejecting a true null
- *Failing to reject a false null
- A calculation mistake
- Using the wrong test
> A false negative.

Q: A test that predicts later job performance shows:
- Face validity
- Content validity
- *Predictive (criterion) validity
- Internal consistency
> Prediction of a future criterion.

Q: Broadbent's model of attention is a:
- Late selection model
- *Early selection filter model
- Capacity model
- Feature integration model
> Filters before meaning is processed.

Q: Old learning interfering with new learning is:
- *Proactive interference
- Retroactive interference
- Repression
- Decay
> "Pro" works forwards.

Q: The concept of the zone of proximal development belongs to:
- Piaget
- *Vygotsky
- Bruner
- Erikson
> What a child can do with help.

Q: Sternberg's triarchic theory includes analytical, creative and:
- Musical intelligence
- *Practical intelligence
- Emotional intelligence
- Fluid intelligence
> The three parts of the triarchic theory.

Q: Damage to Wernicke's area typically causes:
- Non-fluent speech
- *Fluent but meaningless speech with poor comprehension
- Blindness
- Paralysis
> Receptive aphasia.

Q: The James-Lange theory holds that:
- Emotion and arousal occur simultaneously
- *We feel emotion because we perceive our bodily changes
- Cognition alone produces emotion
- Emotion comes from the thalamus
> "We are afraid because we tremble."

Q: Cattell's personality test is the:
- MMPI
- *16PF
- EPQ
- TAT
> Sixteen personality factors.

Q: When people put in less effort in a group than alone, this is:
- Social facilitation
- *Social loafing
- Groupthink
- Conformity
> Diffusion of effort.

Q: Milgram's studies are mainly about:
- Conformity to group norms
- *Obedience to authority
- Bystander apathy
- Attitude change
> Obedience.

Q: Wechsler IQ scores have a mean of:
- 50
- *100
- 0
- 500
> Mean 100, SD 15.
:::
`;
