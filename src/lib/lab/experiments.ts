/**
 * Psychology Lab catalogue. Each experiment is something the student DOES
 * first and reads about second: run it, see your own data, compare with the
 * classic finding, connect it to the clinic, check, reflect.
 *
 * Academic integrity:
 * - Explanations are original. References are to the original studies and
 *   are listed for educator verification; nothing is quoted.
 * - `evidence` separates well-replicated findings from debated ones.
 * - `review` lists what a qualified educator should check before the Lab
 *   flag is switched on for students (see docs/transformation/CURRICULUM_MAP.md).
 * - Textbook page references are left empty on purpose: the source books were
 *   not available when this was written. Fill `bookRefs` during review.
 */

import { EXPERIMENTS_2 } from "./experiments2";

export type LabLevel = "Foundation" | "Intermediate" | "Advanced";

export type LabCheck = { q: string; options: string[]; answer: number; why: string };

export type LabExperiment = {
  id: string;
  num: number;
  title: string;
  /** Area of psychology, used for grouping. */
  area: "Memory" | "Attention" | "Perception" | "Learning" | "Thinking" | "Methods" | "Development" | "Social";
  level: LabLevel;
  minutes: number;
  /** One line on the card. */
  hook: string;
  /** The question the experiment asks. */
  question: string;
  /** What to do, in three short steps at most. */
  steps: string[];
  /** The classic finding, in plain words. */
  finding: string;
  /** Why it happens (the theory), short paragraphs. */
  theory: string[];
  /** Why a psychologist cares, in the clinic or in practice. */
  clinic: string[];
  /** How strong the evidence is, honestly. */
  evidence: { status: "Well established" | "Established, details debated" | "Debated"; note: string };
  /** Original studies, for educator verification. */
  refs: string[];
  /** Textbook references, filled in during educator review. */
  bookRefs: string[];
  checks: LabCheck[];
  reflect: string;
  /** Notes modules this connects to (ids in src/content/study). */
  related: string[];
  /** For the educator before publishing. */
  review: string[];
};

const EXPERIMENTS_1: LabExperiment[] = [
  {
    id: "digit-span",
    num: 1,
    title: "Digit span",
    area: "Memory",
    level: "Foundation",
    minutes: 6,
    hook: "How many digits can you hold? Forwards, then backwards.",
    question: "How much can short-term memory hold, and what changes when you have to work with it?",
    steps: ["Watch the digits appear one at a time.", "Type them back. Two tries at each length.", "Then do it again, but backwards."],
    finding:
      "Most adults repeat about 6 or 7 digits forwards. Backwards is usually one or two fewer, because you have to hold the digits and rearrange them at the same time.",
    theory: [
      "Forward span mostly measures how much you can hold for a few seconds. Backward span adds work: you hold the list and reorder it. That extra work is what people mean by working memory.",
      "The famous \"seven, plus or minus two\" was an early estimate. Later work suggests the true limit is nearer four chunks, and that we reach seven by grouping digits (like a phone number) and by rehearsing them under our breath.",
    ],
    clinic: [
      "Digit span is part of the attention and concentration check in the mental status examination, and a subtest of standard intelligence batteries.",
      "A low span says attention is poor right now. It does not say why: delirium, anxiety, low mood, poor sleep, low effort or a language barrier can all lower it. Always read it alongside the rest of the MSE.",
      "In delirium, attention is the core problem, so span often falls sharply and changes across the day.",
    ],
    evidence: {
      status: "Well established",
      note: "Typical adult ranges are well replicated. The exact capacity limit (about 4 chunks vs 7 items) is still discussed.",
    },
    refs: [
      "Miller, G. A. (1956). The magical number seven, plus or minus two. Psychological Review, 63(2), 81 to 97.",
      "Cowan, N. (2001). The magical number 4 in short-term memory. Behavioral and Brain Sciences, 24(1), 87 to 114.",
    ],
    bookRefs: [],
    checks: [
      {
        q: "A patient repeats 7 digits forwards but only 3 backwards. What is the most useful first thought?",
        options: ["Memory storage is damaged", "Holding is fine; working with the information is harder", "The test is invalid", "This is normal for everyone"],
        answer: 1,
        why: "Forward span looks fine. Backward span adds manipulation, so the gap points at working memory and attention control. Check the rest of the MSE before concluding anything.",
      },
      {
        q: "Why can people often beat \"seven\" with practice?",
        options: ["The brain grows", "They group digits into chunks", "They guess better", "Practice has no effect"],
        answer: 1,
        why: "Chunking packs several digits into one unit, so the same small store holds more.",
      },
      {
        q: "A drowsy patient on day 2 after surgery has a span of 3 in the morning and 6 in the afternoon. What does this suggest?",
        options: ["Dementia", "Fluctuating attention, think delirium", "Low intelligence", "Malingering"],
        answer: 1,
        why: "Attention that swings across the day is a hallmark of delirium, which is a medical emergency until proven otherwise.",
      },
    ],
    reflect: "Did you use a strategy (grouping, saying them aloud, picturing them)? How would anxiety in a real assessment change your score?",
    related: ["interview-mse", "neurocognitive", "assessment"],
    review: ["Confirm the stop rule wording matches the intelligence battery your students are trained on."],
  },
  {
    id: "serial-position",
    num: 2,
    title: "Serial position",
    area: "Memory",
    level: "Foundation",
    minutes: 7,
    hook: "Learn a list, recall it. Which words survive?",
    question: "Does a word's place in a list change how likely you are to remember it?",
    steps: ["Read 12 words, shown one at a time.", "Type every word you remember, in any order.", "Do three lists. Your curve builds as you go."],
    finding:
      "Words at the start (primacy) and the end (recency) are remembered best, giving a U-shaped curve. If you wait and do something else before recalling, the end advantage shrinks, but the start advantage stays.",
    theory: [
      "Early words get more rehearsal, so they are more likely to make it into long-term memory. That is the primacy effect.",
      "The last few words are still in short-term memory when recall starts, so they come out first and easily. That is the recency effect.",
      "Because a delay wipes out recency but not primacy, the curve was early evidence that short-term and long-term memory behave differently. This two-store reading is useful but simplified: recency also appears in some long-term tasks.",
    ],
    clinic: [
      "Word-list recall tests are used in memory assessment. Looking at which words are recalled, not just how many, tells you more.",
      "In practice: patients remember the start and end of a consultation best. Say the most important instruction first, and repeat it at the end.",
    ],
    evidence: {
      status: "Established, details debated",
      note: "The U-shaped curve is very robust. Whether it proves two separate memory stores is debated.",
    },
    refs: [
      "Murdock, B. B. (1962). The serial position effect of free recall. Journal of Experimental Psychology, 64(5), 482 to 488.",
      "Glanzer, M., & Cunitz, A. R. (1966). Two storage mechanisms in free recall. Journal of Verbal Learning and Verbal Behavior, 5(4), 351 to 360.",
    ],
    bookRefs: [],
    checks: [
      {
        q: "A 30-second distraction task is added before recall. Which part of the curve drops?",
        options: ["The start", "The middle", "The end", "None"],
        answer: 2,
        why: "The end advantage relies on words still being in short-term memory. A distraction displaces them.",
      },
      {
        q: "Why are early words remembered well?",
        options: ["They are still in short-term memory", "They get more rehearsal", "They are easier words", "Chance"],
        answer: 1,
        why: "Early words get rehearsed more often, which helps them enter long-term memory.",
      },
      {
        q: "You have 10 minutes to explain a new medicine to a family. Where do you put the one thing they must remember?",
        options: ["In the middle", "At the start, and again at the end", "Only in the leaflet", "It does not matter"],
        answer: 1,
        why: "Use both primacy and recency: open with it and close with it.",
      },
    ],
    reflect: "Look at your own curve. Did it look like the classic U? If not, what did you do differently (grouping, a story, recalling the last words first)?",
    related: ["neurocognitive", "assessment"],
    review: ["Word pool is everyday English nouns; check suitability for students whose first language is not English."],
  },
  {
    id: "stroop",
    num: 3,
    title: "Stroop",
    area: "Attention",
    level: "Foundation",
    minutes: 5,
    hook: "Name the ink colour, not the word. Harder than it sounds.",
    question: "What happens when a habit (reading) fights the task (naming the colour)?",
    steps: ["A colour word appears in coloured ink.", "Press the button for the INK colour, as fast as you can.", "About 40 rounds. Your speed is measured."],
    finding:
      "People are slower, and make more mistakes, when the word and the ink disagree (the word RED in blue ink). The gap is usually around a tenth of a second or more.",
    theory: [
      "Reading is so practised that it happens automatically. To name the ink you have to hold back the word that pops into mind.",
      "That holding back is called inhibition, one of the brain's control (executive) functions. The extra time you need on mismatched trials is the cost of that control.",
    ],
    clinic: [
      "Stroop-type tasks are used in neuropsychological assessment of executive function and attention.",
      "An \"emotional Stroop\" uses emotional words (for example threat words) instead of colour words. Slower naming for those words has been used to study attention bias in anxiety. Treat individual results with caution: the task is good for group research but unreliable for judging one person.",
    ],
    evidence: {
      status: "Well established",
      note: "The colour-word Stroop effect is one of the most replicated findings in psychology. The emotional Stroop is less reliable at the individual level.",
    },
    refs: [
      "Stroop, J. R. (1935). Studies of interference in serial verbal reactions. Journal of Experimental Psychology, 18(6), 643 to 662.",
      "MacLeod, C. M. (1991). Half a century of research on the Stroop effect: An integrative review. Psychological Bulletin, 109(2), 163 to 203.",
    ],
    bookRefs: [],
    checks: [
      {
        q: "Why are mismatched trials slower?",
        options: ["The colours are harder to see", "Reading happens automatically and must be held back", "The words are longer", "People are tired"],
        answer: 1,
        why: "The automatic reading response competes with the colour-naming response; inhibiting it takes time.",
      },
      {
        q: "A child who is just learning to read shows a very small Stroop effect. Why?",
        options: ["Better attention", "Reading is not yet automatic", "Colour blindness", "Faster reactions"],
        answer: 1,
        why: "The effect depends on reading being automatic. Without that habit there is little to inhibit.",
      },
      {
        q: "Which function does the Stroop mainly tap?",
        options: ["Long-term memory", "Inhibition (executive control)", "Language comprehension", "Motor speed only"],
        answer: 1,
        why: "It is a classic test of inhibitory control.",
      },
    ],
    reflect: "Where in daily life do you have to override an automatic habit? What makes it easier or harder?",
    related: ["assessment", "brain", "anxiety"],
    review: ["Colour set avoids red/green-only contrasts but students with colour-vision differences should be offered the text-label option (built in)."],
  },
  {
    id: "change-detection",
    num: 4,
    title: "Spot the change",
    area: "Memory",
    level: "Intermediate",
    minutes: 7,
    hook: "A flash of coloured squares. Did one change? Measure your visual memory.",
    question: "How many objects can you hold in visual memory at once?",
    steps: ["Coloured squares flash for half a second.", "After a short blank they come back. Same, or did one change colour?", "Displays have 2 to 8 squares, in mixed order."],
    finding:
      "Accuracy is near perfect for small displays and falls once there are more than about three or four squares. A simple formula (K) turns your answers into an estimate of how many squares you held, usually about 3 to 4.",
    theory: [
      "Visual working memory seems to hold a small number of objects. Past that, you are partly guessing.",
      "K corrects for guessing: it uses both hits (saying \"changed\" when it did) and false alarms (saying \"changed\" when it did not). That is why saying \"changed\" every time does not give a high score.",
    ],
    clinic: [
      "The idea of hits and false alarms is the same one behind sensitivity and specificity in screening tests. A clinician who calls every patient \"depressed\" catches every case but is useless.",
      "Working-memory limits matter in teaching and in therapy: give one or two new ideas at a time, then check they landed.",
    ],
    evidence: {
      status: "Established, details debated",
      note: "The 3 to 4 item estimate is well replicated. Whether memory holds a fixed number of slots or a flexible pool of resource is actively debated.",
    },
    refs: [
      "Luck, S. J., & Vogel, E. K. (1997). The capacity of visual working memory for features and conjunctions. Nature, 390, 279 to 281.",
      "Cowan, N. (2001). The magical number 4 in short-term memory. Behavioral and Brain Sciences, 24(1), 87 to 114.",
    ],
    bookRefs: [],
    checks: [
      {
        q: "Someone says \"changed\" on every trial. Their hit rate is 100%. What is their K?",
        options: ["The set size", "Zero", "Four", "It cannot be calculated"],
        answer: 1,
        why: "Their false-alarm rate is also 100%, so hit minus false alarm is zero. K catches pure guessing.",
      },
      {
        q: "Which clinical idea is closest to hits and false alarms?",
        options: ["Reliability", "Sensitivity and specificity", "Effect size", "Validity"],
        answer: 1,
        why: "Hits map to sensitivity; avoiding false alarms maps to specificity.",
      },
      {
        q: "Accuracy is 98% with 2 squares and 65% with 8. What explains the drop?",
        options: ["Eyes get tired", "Capacity is exceeded, so later items are guessed", "Colours are harder", "The blank is longer"],
        answer: 1,
        why: "Beyond about 3 to 4 objects, not everything can be held, so performance falls toward guessing.",
      },
    ],
    reflect: "Did you try to name the colours in your head? Would saying them aloud help or hurt, and why?",
    related: ["assessment"],
    review: ["Colour palette chosen to be distinguishable; check with students who have colour-vision differences."],
  },
  {
    id: "muller-lyer",
    num: 5,
    title: "Müller-Lyer illusion",
    area: "Perception",
    level: "Intermediate",
    minutes: 5,
    hook: "Two equal lines. Make them look equal. Measure how far your eyes are fooled.",
    question: "Does what we see match what is there, and does experience shape it?",
    steps: ["One line has fins. The other is plain.", "Drag the slider until the plain line looks the same length.", "Six rounds, fins in and fins out."],
    finding:
      "With fins pointing out, the line looks longer, so people stretch the plain line too far. With fins pointing in, it looks shorter. The error is often 10 to 20 percent, and knowing about the illusion does not make it go away.",
    theory: [
      "Perception is not a camera. The brain uses cues (like corners and depth) to guess what is out there, and those guesses can mislead.",
      "One explanation: the fins look like the corners of a room or building, so the brain reads one line as further away and scales it up. This explanation is popular but not settled.",
      "Cross-cultural studies found smaller illusions in people from less \"carpentered\" (fewer straight-walled buildings) environments. These findings are debated; later work points to other factors too.",
    ],
    clinic: [
      "The illusion persists even when you know it is an illusion. That is a useful picture for explaining to a patient why knowing a fear is irrational does not switch it off.",
      "It also shows why observation needs checking: what we perceive in a session is shaped by expectation.",
    ],
    evidence: {
      status: "Debated",
      note: "The illusion itself is robust. Its cause, and the cultural differences, are debated.",
    },
    refs: [
      "Müller-Lyer, F. C. (1889). Optische Urteilstäuschungen. Archiv für Physiologie, Supplement, 263 to 270.",
      "Segall, M. H., Campbell, D. T., & Herskovits, M. J. (1966). The influence of culture on visual perception. Bobbs-Merrill.",
    ],
    bookRefs: [],
    checks: [
      {
        q: "After learning the lines are equal, the illusion…",
        options: ["Disappears", "Still appears", "Reverses", "Only appears in children"],
        answer: 1,
        why: "Knowledge does not override early perceptual processing. That is what makes it a good teaching example.",
      },
      {
        q: "How strong is the evidence for the \"carpentered world\" explanation?",
        options: ["Proven", "Debated", "Disproven and abandoned", "Never tested"],
        answer: 1,
        why: "It was influential and has some support, but other explanations compete. Present it as debated.",
      },
      {
        q: "What is the main lesson for clinical observation?",
        options: ["Trust first impressions", "Perception is shaped by expectation, so check it", "Illusions are rare", "Only measure with tools"],
        answer: 1,
        why: "We see partly what we expect. Write down what was observed, not what was inferred.",
      },
    ],
    reflect: "Think of a time you were sure you saw or heard something that turned out to be different. What filled the gap?",
    related: ["defences", "case-sheet"],
    review: ["Cross-cultural claims are marked as debated; educator may want to add a local (Indian) research note."],
  },
  {
    id: "schedules",
    num: 6,
    title: "Reward schedules",
    area: "Learning",
    level: "Intermediate",
    minutes: 8,
    hook: "Pick a reward rule, watch the behaviour it builds. Then stop rewarding.",
    question: "How does the timing of rewards shape how often, and how stubbornly, a behaviour happens?",
    steps: ["Choose a reward rule and run the simulation.", "Watch the response line and the reward ticks.", "Then switch rewards off and see which habit lasts."],
    finding:
      "Variable schedules (rewards after an unpredictable number of responses) produce fast, steady responding that is slow to stop when rewards end. Fixed-interval schedules produce a pause after each reward and a speed-up before the next.",
    theory: [
      "In operant conditioning, behaviour that is followed by a reward becomes more likely. The rule that decides when rewards come is the schedule.",
      "Ratio schedules reward the number of responses; interval schedules reward the first response after some time. Fixed means predictable; variable means unpredictable.",
      "Behaviour that was rewarded only some of the time takes longer to fade when rewards stop. This is the partial reinforcement extinction effect.",
      "This simulation is a teaching model drawn to show the classic shapes. It is not data from a real learner.",
    ],
    clinic: [
      "Gambling machines pay out on variable schedules, which helps explain why gambling is so hard to stop.",
      "Contingency management (giving rewards for verified abstinence) is an evidence-based treatment in substance use. It works best with immediate, reliable rewards at first.",
      "Parent training: if a child's tantrums are sometimes rewarded by giving in, they are on a variable schedule, and will be stubborn when the parent stops. Expect a short burst before they fade (the extinction burst).",
    ],
    evidence: {
      status: "Well established",
      note: "Schedule effects are among the most replicated findings in learning. Clinical applications vary in strength; contingency management has strong evidence in substance use.",
    },
    refs: [
      "Ferster, C. B., & Skinner, B. F. (1957). Schedules of reinforcement. Appleton-Century-Crofts.",
      "Skinner, B. F. (1938). The behavior of organisms. Appleton-Century.",
    ],
    bookRefs: [],
    checks: [
      {
        q: "Which schedule makes behaviour most resistant to stopping?",
        options: ["Reward every response", "Variable ratio", "No rewards", "Fixed interval"],
        answer: 1,
        why: "Unpredictable rewards make it hard to tell that rewards have stopped, so responding continues.",
      },
      {
        q: "A parent stops giving in to tantrums. The tantrums get worse for two days. What is this?",
        options: ["Treatment failure", "An extinction burst", "Punishment", "Spontaneous recovery"],
        answer: 1,
        why: "A short increase is expected when a reward stops. Warn parents in advance so they hold steady.",
      },
      {
        q: "A monthly salary is closest to which schedule?",
        options: ["Fixed ratio", "Variable ratio", "Fixed interval", "Variable interval"],
        answer: 2,
        why: "Payment comes after a fixed time, though the real-world fit is loose (you still have to work).",
      },
    ],
    reflect: "Pick one habit of your own (checking your phone, snacking). What schedule keeps it going?",
    related: ["therapies", "substance", "child"],
    review: ["Simulation is labelled as a teaching model. Check the extinction-burst wording matches the therapies module."],
  },
  {
    id: "bias-spotter",
    num: 7,
    title: "Bias spotter",
    area: "Thinking",
    level: "Advanced",
    minutes: 8,
    hook: "Short clinical moments. Name the thinking trap, then the fix.",
    question: "Which mental shortcuts lead clinicians astray, and what protects against them?",
    steps: ["Read a short clinical moment.", "Name the thinking trap.", "Choose the habit that would have prevented it."],
    finding:
      "Fast, intuitive judgement is usually good enough, but it fails in predictable ways. Naming the trap, and having a habit that forces a second look, reduces some of these errors.",
    theory: [
      "Heuristics are mental shortcuts. They save effort and are often right, but they produce systematic errors called biases.",
      "Anchoring: sticking to the first piece of information. Availability: judging likelihood by how easily examples come to mind. Representativeness: judging by how much something looks like a typical case. Confirmation bias: looking for evidence that fits what you already think.",
      "In clinical work two more matter: premature closure (stopping thinking once a diagnosis is reached) and diagnostic overshadowing (putting new symptoms down to a known mental illness or disability).",
    ],
    clinic: [
      "These errors can be serious: a physical illness missed in someone with a psychiatric label, or a risk missed because the first impression was reassuring.",
      "Useful habits: ask \"what else could this be?\", keep a short differential, re-check vital physical causes, and review the case with someone who has not met the patient.",
      "Evidence that de-biasing training reliably reduces errors is mixed. Checklists and structured reviews have more support than simply knowing about biases.",
    ],
    evidence: {
      status: "Established, details debated",
      note: "The heuristics are well described. How much training reduces clinical error is still being studied.",
    },
    refs: [
      "Tversky, A., & Kahneman, D. (1974). Judgment under uncertainty: Heuristics and biases. Science, 185(4157), 1124 to 1131.",
      "Croskerry, P. (2003). The importance of cognitive errors in diagnosis and strategies to minimize them. Academic Medicine, 78(8), 775 to 780.",
      "Reiss, S., Levitan, G. W., & Szyszko, J. (1982). Emotional disturbance and mental retardation: Diagnostic overshadowing. American Journal of Mental Deficiency, 86(6), 567 to 574.",
    ],
    bookRefs: [],
    checks: [
      {
        q: "Which habit has the best support for reducing diagnostic error?",
        options: ["Just knowing about biases", "Structured checklists and second opinions", "Working faster", "Trusting gut feeling more"],
        answer: 1,
        why: "Awareness alone has weak evidence; structures that force a second look do better.",
      },
      {
        q: "A man with schizophrenia complains of new headaches. Staff say it is \"part of his illness\". What is the risk?",
        options: ["Anchoring", "Diagnostic overshadowing", "Availability", "None"],
        answer: 1,
        why: "New physical symptoms are being put down to the known mental illness without being checked.",
      },
      {
        q: "Heuristics are…",
        options: ["Always wrong", "Shortcuts that are often right but fail predictably", "Only used by beginners", "The same as intuition"],
        answer: 1,
        why: "They are efficient and usually work, which is why their failures are easy to miss.",
      },
    ],
    reflect: "Which trap do you think you are most prone to? What one habit will you use in your next case?",
    related: ["case-sheet", "interview-mse", "ethics-law"],
    review: ["Vignettes are fictional. Check they are culturally appropriate and do not stigmatise."],
  },
];

/** Experiments 8 to 12 live in ./experiments2. */
export const EXPERIMENTS: LabExperiment[] = [...EXPERIMENTS_1, ...EXPERIMENTS_2];

export function experimentById(id: string): LabExperiment | undefined {
  return EXPERIMENTS.find((e) => e.id === id);
}

/* ------------------------------------------------------------------ */
/* Bias spotter vignettes                                              */
/* ------------------------------------------------------------------ */

export const BIASES = ["Anchoring", "Availability", "Confirmation bias", "Premature closure", "Diagnostic overshadowing", "Representativeness"] as const;
export type Bias = (typeof BIASES)[number];

export type BiasCase = { id: string; text: string; bias: Bias; why: string; fixes: string[]; fix: number };

export const BIAS_CASES: BiasCase[] = [
  {
    id: "b1",
    text: "The referral letter says \"known case of anxiety\". The 45-year-old describes chest tightness and breathlessness on climbing stairs. The trainee writes \"panic symptoms\" and moves on.",
    bias: "Anchoring",
    why: "The first label in the letter set the frame. Exertional chest symptoms in a 45-year-old need a medical check first.",
    fixes: ["Ask what else could explain it and check physical causes first", "Increase the anxiety medicine", "Reassure and discharge"],
    fix: 0,
  },
  {
    id: "b2",
    text: "Last week the team saw a rare case of autoimmune encephalitis. This week, every young person with new psychosis is being sent for a lumbar puncture.",
    bias: "Availability",
    why: "A vivid recent case makes the rare diagnosis feel common. Base rates have not changed.",
    fixes: ["Order the test for everyone to be safe", "Use base rates and specific red flags to decide who needs it", "Ignore the rare diagnosis"],
    fix: 1,
  },
  {
    id: "b3",
    text: "A trainee is sure a student has ADHD. In the interview they ask only about distraction and restlessness, and do not ask about sleep, mood or substance use.",
    bias: "Confirmation bias",
    why: "Only questions that could confirm the idea were asked. Poor sleep, low mood and substances all cause poor focus.",
    fixes: ["Ask questions that could prove the idea wrong", "Give a rating scale to confirm", "Ask the same questions twice"],
    fix: 0,
  },
  {
    id: "b4",
    text: "Within ten minutes a patient is diagnosed with depression. Later, routine blood tests show a very underactive thyroid, but nobody looks at them because the diagnosis is already made.",
    bias: "Premature closure",
    why: "Thinking stopped once a diagnosis felt complete. New information was not allowed to change it.",
    fixes: ["Keep a working differential and review results before finalising", "Make diagnoses faster", "Avoid ordering blood tests"],
    fix: 0,
  },
  {
    id: "b5",
    text: "A young woman with an intellectual disability becomes withdrawn and stops eating. Staff say \"that is her behaviour\". She has an untreated dental abscess.",
    bias: "Diagnostic overshadowing",
    why: "A change in behaviour was put down to the known disability. Pain is a common cause of behaviour change in people who cannot easily describe it.",
    fixes: ["Treat any change in behaviour as possibly physical and examine", "Increase supervision", "Wait and see"],
    fix: 0,
  },
  {
    id: "b6",
    text: "A quiet, tidy, articulate man with a good job is felt to be \"low risk\" after a suicide attempt, because he \"does not look like\" the patients who usually make attempts.",
    bias: "Representativeness",
    why: "Judging by how typical someone looks ignores actual risk factors such as the attempt itself.",
    fixes: ["Base the risk assessment on factors and history, not appearance", "Trust the first impression", "Ask him if he is at risk and accept the answer"],
    fix: 0,
  },
  {
    id: "b7",
    text: "An older man is assumed to have dementia because he is confused. Nobody notices the confusion started two days ago and comes and goes. He has a urine infection.",
    bias: "Anchoring",
    why: "Age plus confusion triggered \"dementia\". A sudden, fluctuating onset points to delirium, which is urgent.",
    fixes: ["Ask when it started and whether it fluctuates", "Start a dementia medicine", "Book a memory clinic in three months"],
    fix: 0,
  },
  {
    id: "b8",
    text: "After a news story about a celebrity with bipolar disorder, a trainee begins to see \"hypomania\" in every cheerful, talkative client.",
    bias: "Availability",
    why: "A memorable story inflates how often the condition seems to occur.",
    fixes: ["Check duration, change from usual self, and impairment before calling it", "Refer every cheerful client", "Avoid the diagnosis altogether"],
    fix: 0,
  },
];
