#!/usr/bin/env tsx
/**
 * A1 Extractor 2 — typed counsellor–client EXCHANGE records.
 *
 * Inputs (all public domain / open access, cached under scripts/corpus/raw/):
 *   - scripts/corpus/raw/samhsa/*.pdf|txt     — SAMHSA TIP dialogue
 *   - scripts/corpus/raw/mhgap/*.pdf          — WHO mhGAP-IG 2.0
 *   - scripts/corpus/raw/gutenberg/*.txt      — public-domain fiction
 *   - scripts/corpus/raw/nmhs/*               — national MH survey (if any)
 *
 * Output: scripts/corpus/extracted/dialogue.jsonl
 *   { exchange: [{speaker, text, move, quality}], context, commentary,
 *     what_the_counsellor_noticed, id, layer, source }
 *
 * Moves are classified heuristically from utterance shape + explicit labels
 * ("Counsellor:" / "Client:" / "P:" / "T:" …). Explicitly-labelled turns are
 * quality:manual; anything inferred from quotes alone is quality:heuristic.
 *
 *   npm run corpus:extract-dialogue
 */
import { mkdirSync, readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, basename } from "node:path";
import { extractFromPdf, htmlToText } from "./lib/extract";
import type {
  ExchangeRecord,
  ExchangeTurn,
  CounsellorMove,
  ClientResponse,
} from "./lib/types";

const RAW = join(process.cwd(), "scripts/corpus/raw");
const OUT = join(process.cwd(), "scripts/corpus/extracted");
mkdirSync(OUT, { recursive: true });

// ---------------------------------------------------------------------------
// Heuristic classification
// ---------------------------------------------------------------------------

const QUESTION_WORDS = /\b(what|when|where|which|who|whom|whose|how|why)\b/i;
const AUX_LEADS = /^(are|is|do|does|did|can|could|would|will|should|have|has|had|was|were|may|might)\s/i;
const TAIL_AUX = /\?\s*$/;

const REFLECTION_MARKERS = [
  /^\s*(so|in other words|what i(?:'m| am) hearing|it sounds like|it sounds as if|sounds like|you(?:'re| are) saying|let me(?: make sure| see if) i understand)\b/i,
  /^i(?:'m| am) (?:hearing|understanding|noticing) (?:that )?/i,
  /^it seems (?:like|that)/i,
  /^you feel/i,
  /^you(?:'re| are) (?:feeling|worried|afraid|angry|sad|frustrated|hurt)/i,
  /^(sounds|seems) (?:like|as if)/i,
];
const SUMMARY_MARKERS = [
  /^\s*(so|okay|ok|all right|right)\b.*\b(let me (?:summarize|summarise|review)|to (?:summarize|summarise)|what i(?:'m| am) (?:hearing|hearing so far)|so far|overall|in (?:summary|total))\.?/i,
  /^\s*(so|okay|ok)\b.{0,120}\b(?:today|so far|what we(?:'ve| have) (?:talked|covered|discussed))\.?/i,
  /^(so|okay)[\s,].{0,60}\b(today|this session|over the past)\b/i,
];
const VALIDATION_MARKERS = [
  /^i(?:'m| am) (?:really )?(?:glad|sorry|proud|impressed)\b/i,
  /^that (?:took )?(?:a lot of )?(?:courage|strength|bravery|guts|trust)/i,
  /^it(?:'s| is) (?:okay|normal|understandable|natural) to (?:feel|be|want)/i,
  /^it(?:'s| is) (?:not|okay to not be) .{0,40}(?:okay|fine|alone)/i,
  /^you(?:'re| are) (?:doing|handling) (?:great|really well|the best you can)/i,
  /^thank you for (?:sharing|telling|coming|trusting)/i,
  /^i (?:appreciate|can see) (?:that|how)/i,
  /^that(?:'s| is) (?:a )?(?:good|great|fair|valid|important) (?:question|point|observation)/i,
];
const PSYCHOED_MARKERS = [
  /\b(it(?:'s| is) common|many people|most people|some people|often|usually|typically|studies show|research (?:shows|suggests)|a (?:symptom|sign) of|common (?:symptom|sign)|one of the (?:symptoms|signs)|symptoms (?:include|can include|of)|part of the (?:illness|disorder|condition))\b/i,
  /\b(cravings|withdrawal|relapse|trigger|detox|medication|antidepressant|receptor|dopamine|serotonin|tolerance)\b/i,
];
const CONFRONT_MARKERS = [
  /^(?:i disagree|i(?:'m| am) (?:concerned|worried) (?:about|that)|that(?:'s| is) (?:not|inconsistent)|you said .{0,60}(?:but|yet) (?:also|then)|i(?:'m| am) (?:not|un)comfortable)/i,
  /\b(?:you(?:'re| are) (?:minimizing|minimising|avoiding|rationalizing|rationalising|making excuses)|let(?:'s| us) be (?:honest|straight)|the (?:truth|reality) is|you know (?:that|this)|this (?:doesn'?t|does not) (?:add up|fit|match))\b/i,
];
const PREMATURE_ADVICE_MARKERS = [
  /^(?:you should|you ought to|why don'?t you|i (?:think|suggest|recommend) you (?:should|try)|have you (?:tried|thought about)|maybe you should|it(?:'s| is) time to|let me (?:suggest|recommend|tell you) what i would|if i were you|you(?:'?d| would) (?:be|feel) better)/i,
];
const INTERPRETATION_MARKERS = [
  /^(?:could it be|maybe|perhaps|i wonder if|is it possible that|might you be|do you think (?:that )?you(?:'re| are)|sounds to me like|what i(?:'m| am) (?:thinking|wondering|starting to wonder) is)\b/i,
  /\b(?:unconsciously|underneath (?:it all|that)|deep down|on some level|perhaps you|maybe you(?:'re| are))\b/i,
];

function classifyCounsellorMove(text: string): CounsellorMove {
  const t = text.trim();
  const q = TAIL_AUX.test(t) || /^\s*[A-Za-z-]+\??\s*$/.test(t);
  if (q || QUESTION_WORDS.test(t) || AUX_LEADS.test(t)) {
    return QUESTION_WORDS.test(t) && !/^(do|does|did|is|are|was|were|have|has|had|can|could|would|will|should|may|might)\b/i.test(t)
      ? "open_question"
      : /^(are|is|do|does|did|was|were|have|has|had|can|could|would|will|should|may|might)\b/i.test(t)
        ? "closed_question"
        : "open_question";
  }
  if (PREMATURE_ADVICE_MARKERS.some((re) => re.test(t))) return "premature_advice";
  if (CONFRONT_MARKERS.some((re) => re.test(t))) return "confrontation";
  if (SUMMARY_MARKERS.some((re) => re.test(t))) return "summary";
  if (REFLECTION_MARKERS.some((re) => re.test(t))) return "reflection";
  if (VALIDATION_MARKERS.some((re) => re.test(t))) return "validation";
  if (INTERPRETATION_MARKERS.some((re) => re.test(t))) return "interpretation";
  if (PSYCHOED_MARKERS.some((re) => re.test(t))) return "psychoeducation";
  return "open_question"; // default: questions/directives are open
}

function classifyClientResponse(text: string): ClientResponse {
  const t = text.trim();
  const words = t.split(/\s+/).filter(Boolean);
  if (words.length <= 2) return "one_word";
  if (TAIL_AUX.test(t) || /^(what|how|why|when|where|who)\b/i.test(t) || /^\s*(but|well|i mean)\b/i.test(t)) {
    return "deflect";
  }
  if (/\b(i(?:'m| am) (?:not|don'?t want to)|i(?:'d| would) rather not|never mind|forget it|i don'?t (?:know|remember)|i(?:'m| am) not sure)\b/i.test(t)) {
    return "deflect";
  }
  if (/\b(i(?:'m| am) (?:so|really|just) (?:scared|afraid|angry|sad|upset|furious|terrified|anxious|worried|ashamed|guilty|hurt|heartbroken)|i (?:started )?(?:crying|shaking)|i (?:felt|feel) (?:like )?(?:crying|screaming))\b/i.test(t)) {
    return "emotional_release";
  }
  if (/\b(i(?:'m| am| was) (?:feeling|going through|dealing with)|i(?:'ve| have) (?:been|never)|the (?:first|last|whole) (?:time|night|week|month|year)|my (?:husband|wife|mother|father|brother|sister|son|daughter|boss|partner|friend)|it (?:started|began) when|i (?:started|began) (?:drinking|using|taking|feeling))\b/i.test(t)) {
    return "full_disclose";
  }
  if (/\b(some|maybe|sometimes|a little|a bit|i guess|sort of|kind of|not really|i don'?t know|i suppose|it(?:'s| is) complicated|i(?:'m| am) not sure)\b/i.test(t)) {
    return "partial_disclose";
  }
  return "partial_disclose";
}

function classify(text: string, role: "counsellor" | "client"): ExchangeTurn["move"] {
  if (role === "counsellor") return classifyCounsellorMove(text);
  return classifyClientResponse(text);
}

// ---------------------------------------------------------------------------
// Turn detection
// ---------------------------------------------------------------------------

function roleOfLabel(label: string): "counsellor" | "client" | "unknown" {
  const l = label.trim().toLowerCase();
  if (/(counsellor|counselor|therapist|clinician|interviewer|facilitator|provider|worker|nurse|physician|doctor|leader|moderator|staff|t\b|th\b|d\b|i\b)/.test(l)) return "counsellor";
  if (/(client|patient|consumer|student|member|woman|man|mother|father|daughter|son|wife|husband|young|p\b|c\b|pt\b)/.test(l)) return "client";
  return "unknown";
}

/** "Speaker: text" / "(Speaker) text" / "Speaker. text" — return [speaker, text]. */
function labelledTurn(line: string): [string, string] | null {
  const m = /^\(\s*([^)]{1,40})\s*\)\s*(.+)$/.exec(line);
  if (m) return [m[1], m[2]];
  const m2 = /^([A-Za-z][A-Za-z' .-]{1,40})\s*:\s+(.+)$/.exec(line);
  if (m2) return [m2[1], m2[2]];
  const m3 = /^([A-Za-z][A-Za-z' .-]{1,40})\.\s+(.+)$/.exec(line);
  if (m3 && !/^(the|a|an|in|on|at|it|this|that|these|those|one|two|some)\b/i.test(m3[1]) && m3[1].length >= 3) return [m3[1], m3[2]];
  return null;
}

function stripTurnNo(line: string): string {
  return line.replace(/^\s*\d+\s*[.):]\s*/, "").replace(/^\s*-\s*/, "");
}

/** Detect a counsellor–client dialogue segment within a text chunk. */
function detectTurns(chunk: string): ExchangeTurn[] | null {
  const turns: ExchangeTurn[] = [];
  let sawCounsellor = false;
  let sawClient = false;
  for (const raw of chunk.split(/\r?\n/)) {
    let line = raw.trim();
    if (!line) continue;
    line = stripTurnNo(line);
    if (!line) continue;
    const lab = labelledTurn(line);
    if (lab) {
      const [label, text] = lab;
      if (text.trim().length < 2) continue;
      const role = roleOfLabel(label);
      if (role === "unknown") continue;
      if (role === "counsellor") sawCounsellor = true;
      if (role === "client") sawClient = true;
      const move = classify(text.trim(), role);
      turns.push({ speaker: role, text: text.trim(), move, quality: "manual" });
      continue;
    }
    // labelled "C:" / "P:" single letters
    const code = /^([CPTDI])\s*[:.]\s*(.+)$/.exec(line);
    if (code) {
      const role = code[1].toUpperCase() === "P" || code[1].toUpperCase() === "C" ? "client" : "counsellor";
      // (existing extract.ts uses C=clinician, P=client; SAMHSA TIP uses C=client)
      if (code[1].toUpperCase() === "C" && /\b(client)\b/i.test(chunk.slice(0, 600))) {
        // ambiguous — keep the heuristic below; only treat as client if the
        // doc explicitly says "C: Client"
      }
      const text = code[2].trim();
      if (text.length < 2) continue;
      if (role === "counsellor") sawCounsellor = true;
      if (role === "client") sawClient = true;
      const move = classify(text, role);
      turns.push({ speaker: role, text, move, quality: "manual" });
      continue;
    }
    // Quote-only lines (fiction / verbatim transcripts without labels).
    if (/^[“"]/.test(line)) {
      const inner = line.replace(/^[“"]|["”]\s*$/g, "").trim();
      if (inner.length < 2) continue;
      turns.push({ speaker: "unknown", text: inner, move: "unknown", quality: "heuristic" });
    }
  }
  if (!sawCounsellor || !sawClient || turns.length < 2) return null;
  return turns;
}

// ---------------------------------------------------------------------------
// Context / commentary
// ---------------------------------------------------------------------------

function contextFor(chunk: string): string {
  const c = chunk.replace(/\s+/g, " ").trim();
  return c.length > 400 ? c.slice(0, 400) + "…" : c;
}

/** Light notes derived from the exchange shape (never clinical claims). */
function commentaryFor(turns: ExchangeTurn[]): string | null {
  const cMoves = turns.filter((t) => t.speaker === "counsellor").map((t) => t.move);
  if (cMoves.includes("premature_advice")) {
    return "Contains premature-advice moves (the counsellor suggests a course of action before fully exploring the client's experience).";
  }
  if (cMoves.includes("confrontation")) {
    return "Contains confrontation moves (the counsellor directly challenges an inconsistency in the client's account).";
  }
  if (cMoves.includes("reflection")) {
    return "Contains reflection moves (the counsellor mirrors back what the client said).";
  }
  return null;
}

function noticedFor(turns: ExchangeTurn[]): string | null {
  const cMoves = turns.filter((t) => t.speaker === "counsellor").map((t) => t.move);
  if (cMoves.includes("premature_advice")) return "the counsellor noticed the client's hesitation and moved to advice before exploring it";
  if (cMoves.includes("confrontation")) return "the counsellor noticed an inconsistency between the client's words and behaviour";
  if (cMoves.includes("reflection")) return "the counsellor noticed the client's feeling state and reflected it back";
  if (cMoves.includes("validation")) return "the counsellor noticed the client's effort or distress and validated it";
  if (cMoves.includes("summary")) return "the counsellor noticed the emerging themes and summarised them";
  if (cMoves.includes("open_question")) return "the counsellor noticed the client's opening and asked an open question to explore it";
  return null;
}

// ---------------------------------------------------------------------------
// Sources
// ---------------------------------------------------------------------------

function samhsaTexts(): Array<{ source: string; text: string }> {
  const dir = join(RAW, "samhsa");
  const out: Array<{ source: string; text: string }> = [];
  if (!existsSync(dir)) return out;
  for (const f of readdirSync(dir)) {
    if (f.endsWith(".pdf")) {
      try {
        const r = extractFromPdf(readFileSync(join(dir, f)));
        if (r.text.length > 1000) out.push({ source: `samhsa/${f.replace(/\.pdf$/, "")}`, text: r.text });
      } catch {
        // skip
      }
    } else if (f.endsWith(".txt") || f.endsWith(".html")) {
      const raw = readFileSync(join(dir, f), "utf8");
      const text = f.endsWith(".html") ? htmlToText(raw) : raw;
      if (text.length > 1000) out.push({ source: `samhsa/${f.replace(/\.(txt|html)$/, "")}`, text });
    }
  }
  return out;
}

function mhgapTexts(): Array<{ source: string; text: string }> {
  const dir = join(RAW, "mhgap");
  const out: Array<{ source: string; text: string }> = [];
  if (!existsSync(dir)) return out;
  for (const f of readdirSync(dir)) {
    if (!f.endsWith(".pdf")) continue;
    try {
      const r = extractFromPdf(readFileSync(join(dir, f)));
      if (r.text.length > 1000) out.push({ source: `mhgap/${f.replace(/\.pdf$/, "")}`, text: r.text });
    } catch {
      // skip
    }
  }
  return out;
}

function gutenbergTexts(): Array<{ source: string; text: string }> {
  const dir = join(RAW, "gutenberg");
  const out: Array<{ source: string; text: string }> = [];
  if (!existsSync(dir)) return out;
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".txt"))) {
    const text = readFileSync(join(dir, f), "utf8");
    if (text.length > 2000) out.push({ source: `gutenberg/${basename(f, ".txt")}`, text });
  }
  return out;
}

function nmhsTexts(): Array<{ source: string; text: string }> {
  const dir = join(RAW, "nmhs");
  const out: Array<{ source: string; text: string }> = [];
  if (!existsSync(dir)) return out;
  for (const f of readdirSync(dir)) {
    if (/\.(pdf|txt|html)$/i.test(f)) {
      try {
        const raw = readFileSync(join(dir, f));
        const text = /\.pdf$/i.test(f) ? extractFromPdf(raw).text : /\.html$/i.test(f) ? htmlToText(raw.toString("utf8")) : raw.toString("utf8");
        if (text.length > 1000) out.push({ source: `nmhs/${basename(f, /\.(pdf|txt|html)$/i.exec(f)?.[0] ?? "")}`, text });
      } catch {
        // skip
      }
    }
  }
  return out;
}

/** Walk the doc for chunks that look like dialogue; extract labelled turns. */
function extractExchanges(
  text: string,
  source: string,
  startId: number,
): ExchangeRecord[] {
  const records: ExchangeRecord[] = [];
  // Working units: paragraphs; labelled dialogue lines act as boundaries so
  // consecutive turns stay in one unit.
  const lines = text.split(/\r?\n/);
  const units: string[] = [];
  let cur: string[] = [];
  const flush = () => {
    if (cur.length) {
      const u = cur.join("\n").replace(/\s+/g, " ").trim();
      if (u) units.push(u);
      cur = [];
    }
  };
  for (const line of lines) {
    const t = line.trim();
    if (!t) { flush(); continue; }
    const labelled = labelledTurn(t) !== null || /^[CPTDI]\s*[:.]\s*/.test(t) || /^[“"]/.test(t);
    if (labelled && cur.length && (labelledTurn(t) !== null || /^[CPTDI]\s*[:.]\s*/.test(t))) {
      flush();
    }
    cur.push(t);
  }
  flush();

  // Slide a window over units so a dialogue split across paragraph breaks is
  // still caught; each unit yields at most one record.
  for (let i = 0; i < units.length; i++) {
    const window = units.slice(i, i + 5).join("\n");
    const turns = detectTurns(window);
    if (!turns) continue;
    const id = `${source}-${startId + records.length}`;
    records.push({
      id,
      layer: "clinical",
      source,
      context: contextFor(window),
      exchange: turns,
      what_the_counsellor_noticed: noticedFor(turns),
      commentary: commentaryFor(turns),
    });
    i += 1; // skip past the consumed unit (coarse but keeps records distinct)
  }
  return records;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  const sources = [
    ...samhsaTexts(),
    ...mhgapTexts(),
    ...nmhsTexts(),
    ...gutenbergTexts(),
  ];
  console.log(`sources: ${sources.length} documents`);
  let total = 0;
  const out: ExchangeRecord[] = [];
  const perSource = new Map<string, number>();
  for (const s of sources) {
    const n = perSource.get(s.source) ?? 0;
    const recs = extractExchanges(s.text, s.source, n);
    perSource.set(s.source, n + recs.length);
    out.push(...recs);
    total += recs.length;
    console.log(`  ${s.source}: ${recs.length} exchanges`);
  }
  writeFileSync(join(OUT, "dialogue.jsonl"), out.map((r) => JSON.stringify(r)).join("\n") + "\n");
  console.log(`\nwrote ${total} exchange records to scripts/corpus/extracted/dialogue.jsonl`);
}

main();
