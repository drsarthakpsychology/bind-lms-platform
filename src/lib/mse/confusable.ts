/**
 * MSE confusable pairs (v5 Part 2.1, Level 3) — the distinctions students
 * actually fail. Each pair: a prompt where both terms seem to fit, the
 * correct one, and the rule that decides it.
 */

export interface ConfusablePair {
  id: string;
  /** The two terms being confused. */
  a: string;
  b: string;
  rule: string;
  items: Array<{ prompt: string; correct: "a" | "b" }>;
}

/**
 * Multi-term distinctions (3-4 labels): the answer key is the label itself
 * rather than a/b. Used for blunted/flat/restricted/labile and
 * psychomotor-retardation/sedation/low-motivation, which students fail as a
 * SET, not as pairwise comparisons.
 */
export interface MultiTermDrill {
  id: string;
  /** The distinct terms in the set. */
  terms: string[];
  rule: string;
  items: Array<{ prompt: string; correct: string }>;
}

export const CONFUSABLE_PAIRS: ConfusablePair[] = [
  {
    id: "mood-vs-affect",
    a: "Mood",
    b: "Affect",
    rule: "Mood is what the patient REPORTS feeling. Affect is what you OBSERVE in the moment. The single most-confused pair in the exam.",
    items: [
      { prompt: "'I feel low all day every day' — this is the patient's report.", correct: "a" },
      { prompt: "The patient's face is flat, voice monotonous, no range — this is what you see.", correct: "b" },
      { prompt: "'I'm fine' said in a flat, lifeless tone — the flatness you observe.", correct: "b" },
      { prompt: "'I've been hopeless for three weeks' — reported.", correct: "a" },
    ],
  },
  {
    id: "thought-form-vs-content",
    a: "Thought form",
    b: "Thought content",
    rule: "Form is HOW they think (tangential, circumstantial, flight of ideas). Content is WHAT they think about (delusions, obsessions, suicidality).",
    items: [
      { prompt: "The patient's answers never reach the point, wandering off — this is the how.", correct: "a" },
      { prompt: "The patient believes the neighbours are poisoning the water — this is the what.", correct: "b" },
      { prompt: "Flight of ideas — jumping between unrelated topics.", correct: "a" },
      { prompt: "A fixed belief that the TV talks about him personally.", correct: "b" },
    ],
  },
  {
    id: "illusion-vs-hallucination",
    a: "Illusion",
    b: "Hallucination",
    rule: "An illusion is a MISPERCEPTION of a real stimulus (a coat on a chair seen as a person in poor light). A hallucination is a perception with NO external stimulus.",
    items: [
      { prompt: "In dim light, the patient mistakes a wall shadow for a snake.", correct: "a" },
      { prompt: "The patient hears a voice when the room is silent.", correct: "b" },
      { prompt: "A fan's hum is heard as whispers.", correct: "a" },
      { prompt: "Sees a figure in the empty corner of the room.", correct: "b" },
    ],
  },
  {
    id: "obsession-vs-delusion",
    a: "Obsession",
    b: "Delusion",
    rule: "An obsession is resisted and ego-dystonic (the patient KNOWS it's irrational and fights it). A delusion is held and ego-syntonic (the patient believes it fully).",
    items: [
      { prompt: "'I know it's silly, but I can't stop checking the lock.'", correct: "a" },
      { prompt: "'The neighbours are definitely poisoning me — no one can convince me otherwise.'", correct: "b" },
      { prompt: "The intrusive thought is unwanted and fought against.", correct: "a" },
      { prompt: "The belief is held with full conviction despite contrary evidence.", correct: "b" },
    ],
  },
  {
    id: "flight-vs-tangential",
    a: "Flight of ideas",
    b: "Tangentiality",
    rule: "Flight of ideas jumps between TOPICS with some loose connection (and is fast, pressured). Tangentiality wanders away and never returns to the point.",
    items: [
      { prompt: "Rapid, pressured speech leaping from idea to loosely-connected idea.", correct: "a" },
      { prompt: "The patient answers the question but drifts so far the answer is lost.", correct: "b" },
      { prompt: "Often seen in mania — the pressure and the connections.", correct: "a" },
      { prompt: "Every answer ends up somewhere unrelated to the question.", correct: "b" },
    ],
  },
  {
    id: "akathisia-vs-anxiety",
    a: "Akathisia",
    b: "Anxiety",
    rule: "Akathisia is DRUG-INDUCED restlessness — an urge to move, pacing, worse than anxiety responds to. Raising an antipsychotic because you read it as anxiety makes it worse.",
    items: [
      { prompt: "The patient paces relentlessly and says 'I feel like I have to move' — on an antipsychotic.", correct: "a" },
      { prompt: "Worry, tension and palpitations with no urge to pace.", correct: "b" },
      { prompt: "The restlessness appeared two weeks after starting a neuroleptic.", correct: "a" },
      { prompt: "Generalised worry about many things.", correct: "b" },
    ],
  },
];

export const MULTI_TERM_DRILLS: MultiTermDrill[] = [
  {
    id: "thought-form-set",
    terms: ["Flight of ideas", "Tangentiality", "Circumstantiality", "Loosening"],
    rule: "Flight of ideas = rapid, pressured jumps between loosely connected topics (mania). Tangentiality = wanders away and NEVER returns to the point. Circumstantiality = goes the long way round but EVENTUALLY reaches the point. Loosening of associations = connections between sentences are lost entirely — the listener cannot follow (schizophrenia).",
    items: [
      { prompt: "Rapid, pressured speech leaping from idea to loosely-connected idea at full speed — often seen in mania.", correct: "Flight of ideas" },
      { prompt: "The patient answers the question but drifts so far the answer is lost — and never comes back to it.", correct: "Tangentiality" },
      { prompt: "The patient gives enormous background detail — the full family history, the weather, the bus route — then finally, after several minutes, answers the original question.", correct: "Circumstantiality" },
      { prompt: "'The birds outside are the railway station's memory. Blue tickets mean the doctor is in the tree. We are all the same colour of Tuesday.' — connections are broken entirely.", correct: "Loosening" },
      { prompt: "Every answer ends up somewhere unrelated to the question, and the original question is abandoned.", correct: "Tangentiality" },
      { prompt: "The speech is fast and pressured, and topics change at high speed with puns and clang associations.", correct: "Flight of ideas" },
    ],
  },
  {
    id: "affect-qualities",
    terms: ["Blunted", "Flat", "Restricted", "Labile"],
    rule: "Blunted = clearly reduced range (the baseline is there but muted). Flat = essentially absent — no range at all. Restricted = narrowed but appropriate to context. Labile = rapid, often inappropriate shifts. The exam asks for the QUALITY, not 'the patient is sad'.",
    items: [
      { prompt: "The patient's face rarely changes — a mild smile, a faint frown — but never anything fuller. Range is present but muted.", correct: "Blunted" },
      { prompt: "No emotional expression at all across the entire interview — no smile, no frown, no change in a 40-minute session.", correct: "Flat" },
      { prompt: "The patient shows appropriate emotions but in a narrow band — some pleasure at good news, some sadness at loss, nothing beyond that.", correct: "Restricted" },
      { prompt: "The patient laughs loudly at a sad story, then cries for thirty seconds, then laughs again — rapid swings unrelated to the content.", correct: "Labile" },
    ],
  },
  {
    id: "poverty-speech-vs-content",
    terms: ["Poverty of speech", "Poverty of content"],
    rule: "Poverty of SPEECH = the amount of speech is reduced (one-word answers, little volume). Poverty of CONTENT = normal amount of speech, but the content is vague, repetitive and carries no information.",
    items: [
      { prompt: "Every answer is two or three words: 'Fine.' 'No.' 'Don't know.' The interview ends after ten minutes with almost nothing said.", correct: "Poverty of speech" },
      { prompt: "The patient talks for thirty minutes — fluently, continuously — but says nothing specific: 'You know, things, situations, the usual, whatever happens, people say things…'", correct: "Poverty of content" },
      { prompt: "Answers are brief but the words used are accurate and meaningful — no poverty of either kind.", correct: "Poverty of speech" },
      { prompt: "An older patient answers briefly because of Parkinson's bradykinesia — the amount of speech is reduced by motor slowing, not by poverty of speech as a formal sign.", correct: "Poverty of speech" },
      { prompt: "The patient gives long answers that repeat the same vague phrases without ever adding a new fact.", correct: "Poverty of content" },
    ],
  },
  {
    id: "psychomotor-retardation-sedation-motivation",
    terms: ["Psychomotor retardation", "Sedation", "Low motivation"],
    rule: "Psychomotor retardation = the patient's movements and speech are objectively SLOWED (depression, also Parkinson's, neuroleptic effects). Sedation = drowsiness from a medication — the patient is sleepy, hard to rouse, nodding off. Low motivation = the patient CAN move normally but doesn't start/continue tasks ('I know I should, I just can't get myself to'). The distinction changes management completely: slowing on a new antipsychotic = EPS; sedation on a sedating drug = dose issue; low motivation in depression = the core symptom.",
    items: [
      { prompt: "The patient walks slowly, gestures are reduced, answers come after long pauses. He looks awake but everything is effortful and slow.", correct: "Psychomotor retardation" },
      { prompt: "The patient keeps nodding off mid-sentence. Since starting the new medication two days ago, she is hard to keep awake.", correct: "Sedation" },
      { prompt: "The patient is physically normal — brisk when moving — but describes days where she lies in bed unable to START anything, though she can do tasks once begun.", correct: "Low motivation" },
      { prompt: "A patient on a first-generation antipsychotic is increasingly slow, shuffling, with reduced facial movement. This is likely EPS-related slowing, not laziness.", correct: "Psychomotor retardation" },
    ],
  },
  {
    id: "insight-graded",
    terms: ["Full", "Partial", "Poor", "Absent"],
    rule: "Insight is GRADED and domain-specific, not binary. Full = recognises illness, need for treatment, and the role of factors. Partial = some recognition (e.g. 'my nerves are bad') but not that it's an illness. Poor = attributes everything to outside causes. Absent = denies any problem at all. Score it per domain: someone can have full insight into mood but poor insight into psychosis.",
    items: [
      { prompt: "'I've been unwell — the low mood is an illness, and the medication helps. I also see that stress at work triggers it.'", correct: "Full" },
      { prompt: "'I suppose my nerves are bad. People like me get tense. But I'm not ill — it's just how I am.'", correct: "Partial" },
      { prompt: "'There is nothing wrong with me. The neighbours are causing my problems, and no tablet will fix what they do.'", correct: "Absent" },
      { prompt: "The patient accepts that she has depression and takes treatment for it, but insists the voices she hears are real and unrelated to the illness.", correct: "Partial" },
    ],
  },
];

/** Score a multi-term drill: each exact label match is 1. */
export function scoreMultiTerm(
  items: Array<{ prompt: string; correct: string }>,
  answers: Record<string, string>,
): number {
  let correct = 0;
  for (const i of items) if (answers[i.prompt] === i.correct) correct++;
  return correct;
}

/** Score a drill: each correct answer is 1. */
export function scoreConfusable(items: Array<{ correct: "a" | "b" }>, answers: Record<string, "a" | "b">): number {
  return items.reduce((acc, item, i) => acc + (answers[i] === item.correct ? 1 : 0), 0);
}
