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

/** Score a drill: each correct answer is 1. */
export function scoreConfusable(items: Array<{ correct: "a" | "b" }>, answers: Record<string, "a" | "b">): number {
  return items.reduce((acc, item, i) => acc + (answers[i] === item.correct ? 1 : 0), 0);
}
