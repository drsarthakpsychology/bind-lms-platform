/**
 * Audit the quiz item bank for the item-writing problems surfaced in the
 * mobile rebuild brief (Task 0.1):
 *   - correct-answer positional bias (authored order)
 *   - length tell (correct option longer than its distractors)
 *   - fewer than 3 options
 *   - near-duplicate options (high token overlap)
 *
 * Outputs a markdown table to docs/item-bank-audit.md. Does NOT fix content —
 * that is Dr. Dave's call; this just makes the pattern visible.
 *
 * Run: npm run tsx scripts/audit-item-bank.ts  (or npx tsx scripts/audit-item-bank.ts)
 */
import { writeFileSync } from "node:fs";
import { QUIZ_BANK } from "../src/lib/quiz/quiz-bank";

const items = QUIZ_BANK;

// 1. Correct-answer index distribution (authored order).
const indexCounts = new Map<number, number>();
for (const q of items) indexCounts.set(q.correct, (indexCounts.get(q.correct) ?? 0) + 1);

// 2. Length tell + 3. option count + 4. near-duplicates.
type Flag = {
  id: string;
  type: string;
  correctIdx: number;
  correctLen: number;
  meanDistractorLen: number;
  longest: boolean;
  optionCount: number;
  nearDup: boolean;
};
const flags: Flag[] = [];

function tokenize(s: string): Set<string> {
  return new Set(s.toLowerCase().replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter((w) => w.length > 2));
}

function overlap(a: string, b: string): number {
  const ta = tokenize(a);
  const tb = tokenize(b);
  if (ta.size === 0 || tb.size === 0) return 0;
  let shared = 0;
  for (const w of ta) if (tb.has(w)) shared++;
  return shared / Math.min(ta.size, tb.size);
}

for (const q of items) {
  const correctLen = q.options[q.correct]?.length ?? 0;
  const distractors = q.options.filter((_, i) => i !== q.correct);
  const meanDistractorLen =
    distractors.reduce((s, o) => s + o.length, 0) / Math.max(1, distractors.length);
  const longest = correctLen > Math.max(0, ...distractors.map((o) => o.length));

  // Near-duplicate: any two options with >0.8 token overlap.
  let nearDup = false;
  outer: for (let i = 0; i < q.options.length; i++) {
    for (let j = i + 1; j < q.options.length; j++) {
      if (overlap(q.options[i], q.options[j]) > 0.8) {
        nearDup = true;
        break outer;
      }
    }
  }

  flags.push({
    id: q.id,
    type: q.type,
    correctIdx: q.correct,
    correctLen,
    meanDistractorLen: Math.round(meanDistractorLen * 10) / 10,
    longest,
    optionCount: q.options.length,
    nearDup,
  });
}

// Distribution summary.
const total = items.length;
const distLines = [...indexCounts.entries()]
  .sort((a, b) => a[0] - b[0])
  .map(([idx, n]) => `| ${idx} | ${n} | ${((n / total) * 100).toFixed(0)}% |`)
  .join("\n");

const longestFlags = flags.filter((f) => f.longest);
const fewFlags = flags.filter((f) => f.optionCount < 3);
const dupFlags = flags.filter((f) => f.nearDup);

const md = `# Quiz Item Bank Audit

Generated \`${new Date().toISOString()}\` from \`src/lib/quiz/quiz-bank.ts\`
(${total} items). **Content audit only — no fixes applied** (that is a clinical
content decision, not a code decision).

## Correct-answer positional distribution (authored order)

| Authored index | Count | Share |
|---|---|---|
${distLines}

${indexCounts.get(0) === total ? "**⚠ Every item has the correct answer at index 0.** The positional tell is total.\n" : ""}

## Length tell — correct option longer than its distractors

${longestFlags.length} item(s) where the correct option is the longest.

| id | type | correct len | mean distractor len |
|---|---|---|---|
${longestFlags.map((f) => `| \`${f.id}\` | ${f.type} | ${f.correctLen} | ${f.meanDistractorLen} |`).join("\n")}

## Fewer than 3 options

${fewFlags.length ? fewFlags.map((f) => `- \`${f.id}\` (${f.optionCount} options)`).join("\n") : "None — all items have ≥3 options."}

## Near-duplicate options (>80% token overlap)

${dupFlags.length ? dupFlags.map((f) => `- \`${f.id}\` (${f.type})`).join("\n") : "None detected by token-overlap heuristic."}

---

**Note for Dr. Dave:** the \`order_steps\` items are authored as *complete
pre-ordered sequences* (multiple choice), not as loose steps to re-order. The
interaction delivered is recognition, not ordering. If the curriculum intended
the harder ordering task, those items need re-authoring as discrete steps.
`;

writeFileSync("docs/item-bank-audit.md", md, "utf8");
console.log(`Wrote docs/item-bank-audit.md — ${total} items, ${longestFlags.length} length-tells, ${fewFlags.length} <3 options, ${dupFlags.length} near-dupes.`);
