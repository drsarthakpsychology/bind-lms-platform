#!/usr/bin/env tsx
/**
 * Build the STYLE BANK from public-domain fiction (Part 4.3).
 *
 * Reads raw Gutenberg text and extracts ~200 conversational patterns:
 * deflections, hesitations, topic-shifts, hedges, self-interruptions,
 * indirect answers. These carry ZERO clinical content — they are the human
 * RHYTHM of speech, not its substance.
 *
 * Output: scripts/corpus/style-bank.json — array of
 *   { kind, pattern, source_book, style_pattern: 'style' }
 *
 * ENFORCEMENT: style_pattern = 'style' and the retrieval layer + a test assert
 * style chunks are never returned for a clinical query.
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const RAW = join(process.cwd(), "scripts/corpus/raw/gutenberg");
const OUT = join(process.cwd(), "scripts/corpus/style-bank.json");
mkdirSync(join(process.cwd(), "scripts/corpus"), { recursive: true });

/** Quote chars in Gutenberg text: straight " and curly “ ”. */
const Q = `["“]`;
const q = `["”]`;

/** Regex banks per pattern kind. Match fragments, not full quotes. */
const PATTERNS: Array<{ kind: string; re: RegExp }> = [
  { kind: "deflection", re: new RegExp(`${Q}[^"”\\n]{0,80}(?:never mind|don't bother|it's nothing|forget it|not important|I don't want to talk|let's not|you wouldn't understand|no reason at all|that's enough of that|I'd rather not|what's the use|what does it matter|why do you ask|that's another matter|it doesn't signify|don't ask me|not that it matters|leave it alone|drop it|we won't speak of it|never speak of it|it's not worth discussing|what makes you say that|who told you that|that's beside the point|we're going in circles|I've said all I have to say|you're imagining things|that's your interpretation|I wouldn't say that|you always bring this up|here we go again)[^"”\\n]{0,80}${q}`, "gi") },
  { kind: "hesitation", re: new RegExp(`${Q}[^"”\\n]{0,60}(?:well,|I don't know|I mean|you see|as it were|I suppose|perhaps|I'm not sure|I can't say|I hardly know|I rather think|I dare say|I believe|I fancy|I'm afraid|I've often thought|it seems to me|one might say|I shouldn't wonder|I've sometimes|I don't rightly know|upon my word|I really can't|as far as I can tell|if I'm honest|to be frank|if you must know|I couldn't rightly say)[^"”\\n]{0,60}${q}`, "gi") },
  { kind: "topic_shift", re: new RegExp(`${Q}[^"”\\n]{0,80}(?:anyway,|speaking of|that reminds me|by the way|oh, before I forget|and another thing|but tell me,|now, about|talking of|but, come,|well, and|but enough of that|that's enough about|enough of me|but what about|and what of|now then,|well now,|but hark,|meanwhile,|incidentally,|come, tell me|and how is|how goes it with)[^"”\\n]{0,80}${q}`, "gi") },
  { kind: "hedge", re: new RegExp(`${Q}[^"”\\n]{0,80}(?:kind of|sort of|a little|more or less|if you will|as you might say|so to speak|rather|quite|somehow|in a way|after a fashion|as it were|one might|I daresay|I shouldn't wonder|perhaps|maybe|possibly|probably|in some sort|up to a point|to a degree|I don't know, but)[^"”\\n]{0,80}${q}`, "gi") },
  { kind: "self_interruption", re: new RegExp(`${Q}[^"”\\n]{0,60}(?:no, wait|that's not|I mean to say|hold on|let me think|that came out wrong|what am I saying|I forgot|never thought of it|wait, |I beg your pardon|no, no,|that is to say|I mean,|what was I saying|I've lost the thread|but no,|unless —|only —|still,|after all,)[^"”\\n]{0,60}${q}`, "gi") },
  { kind: "indirect", re: new RegExp(`${Q}[^"”\\n]{0,90}(?:I'm fine|never better|couldn't complain|mustn't grumble|oh, you know|nothing much|the same as usual|as well as can be expected|you know how it is|oh, I don't know|it's nothing to speak of|one day at a time|we manage|things are as they are|it might be worse|one mustn't complain|they keep me busy|I can't complain|oh, don't ask|you wouldn't understand|ask my mother|ask my husband|they'd know better|I'm not the one to ask|it's a long story|another time|some other day|don't you worry about me|I'll manage|we'll see|that remains to be seen|time will tell)[^"”\\n]{0,90}${q}`, "gi") },
  { kind: "contradict", re: new RegExp(`${Q}[^"”\\n]{0,90}(?:that's not what I meant|I said no such thing|you misunderstood me|that was then|things have changed|I spoke too soon|I take it back|the opposite is true|quite the contrary|on the contrary|not at all|I never said that|you've got me wrong|I didn't mean it like that|that's not how it happened|it wasn't me who|well, I changed my mind|I was wrong to say)[^"”\\n]{0,90}${q}`, "gi") },
];

function extractFrom(text: string, source: string): Array<{ kind: string; pattern: string; source_book: string }> {
  const out: Array<{ kind: string; pattern: string; source_book: string }> = [];
  for (const { kind, re } of PATTERNS) {
    for (const m of text.matchAll(re)) {
      const pattern = m[0].replace(/^["“]|["”]$/g, "").replace(/\s+/g, " ").trim();
      if (pattern.length < 8 || pattern.length > 110) continue;
      // Skip anything that looks clinical (defensive; should be none).
      if (/(symptom|diagnos|depress|anxiety|therap|psychiatr|hallucinat|suicid|prescri|medication)/i.test(pattern)) continue;
      out.push({ kind, pattern, source_book: source });
    }
  }
  return out;
}

function main() {
  const files = readdirSync(RAW).filter((f) => f.endsWith(".txt"));
  const bank: Array<{ kind: string; pattern: string; source_book: string; style_pattern: "style" }> = [];
  const seen = new Set<string>();

  for (const f of files) {
    const text = readFileSync(join(RAW, f), "utf8");
    const source = f.replace(/\.txt$/, "");
    for (const item of extractFrom(text, source)) {
      const key = item.kind + "|" + item.pattern.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      bank.push({ ...item, style_pattern: "style" });
    }
  }

  // Target 400+ (v5 brief: 400+ patterns across the moves).
  const trimmed = bank.slice(0, 450);
  writeFileSync(OUT, JSON.stringify(trimmed, null, 2), "utf8");
  const byKind = trimmed.reduce<Record<string, number>>((a, b) => {
    a[b.kind] = (a[b.kind] ?? 0) + 1;
    return a;
  }, {});
  console.log(`style bank: ${trimmed.length} patterns`);
  console.log("by kind:", byKind);
  console.log(`→ ${OUT}`);
}

main();
