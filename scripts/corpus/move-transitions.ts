#!/usr/bin/env tsx
/**
 * Counsellor-move → client-response frequency table.
 *
 * Reads scripts/corpus/extracted/dialogue.jsonl (A1 Extractor 2 output),
 * pairs each counsellor move with the client response that follows it
 * (consecutive-turn pairs), and writes:
 *
 *   scripts/corpus/extracted/move-transitions.json
 *
 *   [ { counsellor_move, client_response, count, disclosed_new_pct } ]
 *
 * disclosed_new_pct = 100 * full_disclose / (full_disclose + partial_disclose)
 * over the pairs with that counsellor move (one_word / deflect / question /
 * emotional_release are disclosure-adjacent but not counted as disclosed-new).
 *
 *   npm run corpus:move-transitions
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import type {
  ExchangeRecord,
  CounsellorMove,
  ClientResponse,
  MoveTransitionRow,
} from "./lib/types";

const OUT = join(process.cwd(), "scripts/corpus/extracted");
mkdirSync(OUT, { recursive: true });
const IN = join(OUT, "dialogue.jsonl");

const COUNSELLOR_MOVES: CounsellorMove[] = [
  "open_question",
  "closed_question",
  "reflection",
  "validation",
  "summary",
  "interpretation",
  "psychoeducation",
  "premature_advice",
  "confrontation",
];
const CLIENT_RESPONSES: ClientResponse[] = [
  "full_disclose",
  "partial_disclose",
  "one_word",
  "deflect",
  "question",
  "emotional_release",
];

function isCounsellorMove(m: string): m is CounsellorMove {
  return (COUNSELLOR_MOVES as string[]).includes(m);
}
function isClientResponse(m: string): m is ClientResponse {
  return (CLIENT_RESPONSES as string[]).includes(m);
}

function main() {
  if (!existsSync(IN)) {
    console.error(`no ${IN} — run scripts/corpus/extract-dialogue.ts first`);
    process.exit(1);
  }
  const counts = new Map<string, number>();
  for (const line of readFileSync(IN, "utf8").split("\n")) {
    if (!line.trim()) continue;
    const rec = JSON.parse(line) as ExchangeRecord;
    for (let i = 0; i + 1 < rec.exchange.length; i++) {
      const a = rec.exchange[i];
      const b = rec.exchange[i + 1];
      if (a.speaker !== "counsellor" || b.speaker !== "client") continue;
      if (!isCounsellorMove(a.move) || !isClientResponse(b.move)) continue;
      const key = `${a.move}:${b.move}`;
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  const rows: MoveTransitionRow[] = [];
  for (const cm of COUNSELLOR_MOVES) {
    for (const cr of CLIENT_RESPONSES) {
      const key = `${cm}:${cr}`;
      const count = counts.get(key) ?? 0;
      if (count === 0) continue;
      const total = CLIENT_RESPONSES.reduce(
        (s, c) => s + (counts.get(`${cm}:${c}`) ?? 0),
        0,
      );
      // The empirical backbone: what fraction of this move's responses were
      // a genuine disclosure (full or partial) — a 0-1 fraction, not a count.
      const full = counts.get(`${cm}:full_disclose`) ?? 0;
      const partial = counts.get(`${cm}:partial_disclose`) ?? 0;
      const disclosed_new_pct =
        total > 0 ? Math.round((100 * (full + partial)) / total) : 0;
      rows.push({ counsellor_move: cm, client_response: cr, count, disclosed_new_pct });
    }
  }
  rows.sort((a, b) => b.count - a.count);
  writeFileSync(join(OUT, "move-transitions.json"), JSON.stringify(rows, null, 2) + "\n");
  console.log(`wrote ${rows.length} transition rows (${[...counts.values()].reduce((a, b) => a + b, 0)} total pairs) to scripts/corpus/extracted/move-transitions.json`);
  for (const r of rows.slice(0, 12)) {
    console.log(`  ${r.counsellor_move.padEnd(18)} → ${r.client_response.padEnd(16)} ${String(r.count).padStart(4)}  disclosed_new ${r.disclosed_new_pct}%`);
  }
}

main();
