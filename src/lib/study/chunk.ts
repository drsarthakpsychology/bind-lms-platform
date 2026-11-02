import { countWords } from "./parse";
import type { Block, Card, Mcq, Section } from "./types";

/**
 * Splits a section into short parts so students meet a little at a time.
 * A new part starts at every sub-heading, and long runs are cut at a block
 * boundary once they pass about 200 words. Self-tests (recall, viva, MCQ) are
 * taken out of the reading and handed back separately, to be started on purpose.
 */
export type Chunk = { title: string; blocks: Block[]; words: number };

const MAX_WORDS = 200;

export function splitSection(s: Section): { chunks: Chunk[]; recall: Card[]; viva: Card[]; mcq: Mcq[] } {
  const recall: Card[] = [];
  const viva: Card[] = [];
  const mcq: Mcq[] = [];
  const reading: Block[] = [];
  for (const b of s.blocks) {
    if (b.t === "recall") recall.push(...b.items);
    else if (b.t === "viva") viva.push(...b.items);
    else if (b.t === "mcq") mcq.push(...b.items);
    else reading.push(b);
  }

  const chunks: Chunk[] = [];
  let cur: Block[] = [];
  let title = s.title;
  const push = () => {
    if (!cur.length) return;
    chunks.push({ title, blocks: cur, words: countWords(cur) });
    cur = [];
  };
  for (const b of reading) {
    if (b.t === "h3") {
      // A short lead-in (a sentence or two) stays with the first sub-heading,
      // so a phone screen is never just one line.
      if (cur.length && countWords(cur) < 60) {
        cur.push(b);
        continue;
      }
      push();
      title = b.text.replace(/\s*\[(core|extra)\]\s*$/, "");
      cur.push(b);
      continue;
    }
    const w = countWords([b]);
    if (cur.length && countWords(cur) + w > MAX_WORDS && countWords(cur) > 60) {
      push();
    }
    cur.push(b);
  }
  push();
  return { chunks, recall, viva, mcq };
}
