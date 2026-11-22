import { ALL_TERMS } from "@/lib/learn/notes";
import { WORDS } from "@/lib/learn/scenarios";
import { SAY_IT, type SayIt } from "@/lib/decode/say-it";
import { pickRound, type History } from "@/lib/history/order";

/**
 * "Say it clinically", worked out on the server: the bank, the round and the
 * check. The browser gets one question at a time (prompt and options) and
 * only learns the right answer after it has picked.
 */

type Card = { id: string; phrase: string; language?: string; meaning?: string; term: string; wrong: string[]; why: string; note?: string; level: number };

const NOTE_CARDS: Card[] = ALL_TERMS.map((t) => ({
  id: `note-${t.noteId}-${t.term}`,
  phrase: t.lay,
  term: t.term,
  wrong: [],
  why: `${t.topic}: “${t.lay}” is written as ${t.term}.`,
  level: 2,
}));
const SAY_CARDS: Card[] = SAY_IT.map((x: SayIt) => ({ id: x.id, phrase: x.phrase, language: x.language, meaning: x.meaning, term: x.term, wrong: x.wrong, why: x.why, note: x.note, level: x.difficulty }));
const CARDS: Card[] = [...SAY_CARDS, ...NOTE_CARDS];
const TERM_NAMES = [...new Set(CARDS.map((c) => c.term))];

/** A question as the browser sees it before answering. */
export type TermsQuestion = { id: string; prompt: string; language?: string; options: string[]; kind: "term" | "words" };
/** What the browser sees after answering. */
export type TermsReveal = { correct: boolean; answer: string; why: string; meaning?: string; note?: string };

type Full = TermsQuestion & { answer: string; why: string; meaning?: string; note?: string; level: number };

function shuffle<T>(a: readonly T[], rng: () => number): T[] {
  const out = [...a];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function fullFor(id: string): Omit<Full, "options"> | null {
  if (id.startsWith("words-")) {
    const w = WORDS.find((x) => `words-${x.better}` === id);
    return w ? { id, prompt: "Which is the better way to say it?", answer: w.better, why: w.why, kind: "words", level: 1 } : null;
  }
  const c = CARDS.find((x) => x.id === id);
  return c ? { id, prompt: `They say: “${c.phrase}”. You write:`, language: c.language, answer: c.term, why: c.why, meaning: c.meaning, note: c.note, kind: "term", level: c.level } : null;
}

/** A small seeded random source, so a question's options can be worked out again from the round's seed. */
export function seeded(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** The options shown for one question, the same every time for the same seed. */
export function optionsFor(id: string, seed: number): string[] {
  const rng = seeded(seed);
  if (id.startsWith("words-")) {
    const w = WORDS.find((x) => `words-${x.better}` === id);
    return w ? shuffle([w.better, w.worse], rng) : [];
  }
  const c = CARDS.find((x) => x.id === id);
  if (!c) return [];
  const wrong = c.wrong.length >= 3 ? c.wrong.slice(0, 3) : shuffle(TERM_NAMES.filter((x) => x !== c.term), rng).slice(0, 3);
  return shuffle([c.term, ...wrong], rng);
}

/** A round's question ids: 8 phrase cards climbing in difficulty with 4 wording cards between them, fresh ones first. */
export function buildTermsRound(history: History, now: number, rng: () => number): string[] {
  const terms = pickRound(CARDS, (c) => c.id, history, now, rng, 8).sort((a, b) => a.level - b.level).map((c) => c.id);
  const words = pickRound(WORDS, (w) => `words-${w.better}`, history, now, rng, 4).map((w) => `words-${w.better}`);
  const out = [...terms];
  for (const [k, w] of words.entries()) out.splice(Math.min(out.length, 2 + k * 3), 0, w);
  return out;
}

/** The public view of one question in a round (null for an unknown id). */
export function questionOf(q: { id: string; options: string[] }): TermsQuestion | null {
  const f = fullFor(q.id);
  return f ? { id: f.id, prompt: f.prompt, language: f.language, options: q.options, kind: f.kind } : null;
}

/** Check a pick (it must be one of the options shown). */
export function checkPick(q: { id: string; options: string[] }, pick: string): TermsReveal | null {
  const f = fullFor(q.id);
  if (!f || !q.options.includes(pick)) return null;
  return { correct: pick === f.answer, answer: f.answer, why: f.why, meaning: f.meaning, note: f.note };
}
