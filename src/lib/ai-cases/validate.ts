/**
 * The rule check every AI case must pass before a student sees it. Pure (no
 * network, no database) so it is fully unit-tested.
 *
 *   1. zod: the exact JSON shape (6 clues, 3–5 investigations, …).
 *   2. The criteria checklist: the clues and results really show what the
 *      diagnosis needs, and the duration fits.
 *   3. Each look-alike the checklist names is listed AND ruled out by a fact
 *      in the text.
 *   4. Fairness: the answer isn't given away, clues build up (evidence spread
 *      over at least 3 clues), the place matches the setting, no phone
 *      numbers or links.
 */
import { CRITERIA_BY_DX, DX_NAMES, RULES, type DxCriteria, type Rule } from "./criteria";
import { draftSchema, type Draft } from "./schema";
import type { AiCase, AiCaseInput, EvidenceRef } from "./types";

export const VALIDATOR_VERSION = "rules-v1";

export type Validation = { ok: true; case: Omit<AiCase, "id" | "createdAt"> } | { ok: false; problems: string[] };

type Source = { source: "clue" | "investigation"; index: number; text: string };

/* ------------------------------------------------------------ negation */

/** Rules where "no X" means the symptom IS there ("no energy", "no appetite"). */
const DEFICIT = new Set(["sleep", "appetite", "energy", "anhedonia", "concentration", "w-insomnia"]);

const STRONG_BEFORE = /\b(never|denies|denied|without|nor|no history of|no past)\b[^.;,]{0,30}$/i;
const NO_BEFORE = /\bno\s+(\w+\s+){0,2}$/i;
const NORMAL_BEFORE = /\b(normal|good|intact|unchanged)\s+$/i;
const NORMAL_AFTER = /^[^.;]{0,25}\b(is|are|was|were|has been|have been|remains?|stays?|stayed)\s+(normal|fine|unchanged|good|okay|ok|intact|unaffected)\b/i;
const PROBLEM_AFTER = /^\s*(problems?|issues?|difficult(y|ies)|changes?|complaints?|concerns?)\b/i;

/** Does the sentence say the opposite of what the rule matched? */
export function isNegated(before: string, after: string, ruleId: string): boolean {
  if (NORMAL_AFTER.test(after) || NORMAL_BEFORE.test(before) || STRONG_BEFORE.test(before)) return true;
  if (NO_BEFORE.test(before)) return DEFICIT.has(ruleId) ? PROBLEM_AFTER.test(after) : true;
  return false;
}

/** Split a text into sentences (keeps the regex windows inside one sentence). */
function sentences(text: string): string[] {
  return text.split(/(?<=[.!?;])\s+/).filter(Boolean);
}

/** First place in the case text that shows this rule, or null. */
export function findEvidence(rule: Rule, sources: Source[]): { source: Source["source"]; index: number } | null {
  for (const s of sources) {
    for (const sentence of sentences(s.text)) {
      for (const re of rule.any) {
        const g = new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g");
        for (const m of sentence.matchAll(g)) {
          const at = m.index ?? 0;
          if (rule.negatable !== false && isNegated(sentence.slice(0, at), sentence.slice(at + m[0].length), rule.id)) continue;
          return { source: s.source, index: s.index };
        }
      }
    }
  }
  return null;
}

/* ------------------------------------------------------------ duration */

const WORD_NUM: Record<string, number> = {
  a: 1, an: 1, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  eleven: 11, twelve: 12, fifteen: 15, twenty: 20, thirty: 30, few: 3, several: 4, couple: 2,
};
const UNIT_DAYS: Record<string, number> = { hour: 1 / 24, day: 1, week: 7, fortnight: 14, month: 30, year: 365 };

/** Every duration written in the text, in days ("six weeks" → 42). */
export function parseDurations(text: string): number[] {
  const out: number[] = [];
  const re = /\b(\d+(?:\.\d+)?|a|an|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|fifteen|twenty|thirty|few|several|couple)(?:\s+of)?\s*(?:or (?:so|more)\s+)?(hours?|days?|weeks?|fortnights?|months?|years?)\b/gi;
  for (const m of text.matchAll(re)) {
    const raw = m[1].toLowerCase();
    const n = /\d/.test(raw) ? Number(raw) : WORD_NUM[raw];
    const unit = m[2].toLowerCase().replace(/s$/, "");
    if (Number.isFinite(n) && UNIT_DAYS[unit] !== undefined) out.push(n * UNIT_DAYS[unit]);
  }
  return out;
}

export function durationDays(d: { value: number; unit: "days" | "weeks" | "months" | "years" }): number {
  return d.value * { days: 1, weeks: 7, months: 30, years: 365 }[d.unit];
}

/* ------------------------------------------------------------ settings */

const INDIAN_PLACES =
  /\b(india|indian|ahmedabad|surat|vadodara|baroda|rajkot|gandhinagar|mumbai|pune|nagpur|nashik|thane|delhi|noida|gurugram|gurgaon|jaipur|jodhpur|udaipur|lucknow|kanpur|varanasi|agra|patna|ranchi|kolkata|bhubaneswar|guwahati|shillong|chennai|madurai|coimbatore|bengaluru|bangalore|mysuru|mysore|mangaluru|hyderabad|vijayawada|visakhapatnam|kochi|thiruvananthapuram|kozhikode|bhopal|indore|raipur|chandigarh|amritsar|ludhiana|dehradun|shimla|srinagar|jammu|goa|panaji|kutch|anand|bharuch|nadiad|tier-2|district hospital|taluka|aiims|nimhans|phc|chc)\b/i;

/* -------------------------------------------------------------- checks */

const SCALE_NAMES = /\b(phq|ham-?d|ham-?a|bdi|gad-?7|ymrs|panss|y-?bocs|pcl|ciwa|audit|mmse|moca|cam|eat-?26|bprs|madrs|cows)\b/i;
const CONTACT = /(\+91|\b\d{10}\b|\b\d{3}[- ]\d{3}[- ]\d{4}\b|https?:\/\/|www\.)/i;

function leaks(text: string, c: DxCriteria): string | null {
  const t = text.toLowerCase();
  for (const w of [c.name.toLowerCase(), ...c.leak]) {
    const re = new RegExp(`(^|[^a-z])${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "i");
    if (re.test(t)) return w;
  }
  return null;
}

/** Light 32-bit FNV-1a, for a stable id from the case text. */
function hash(s: string): string {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return (h >>> 0).toString(36);
}

export function caseKey(d: Pick<Draft, "clues">): string {
  return hash(d.clues.join("|"));
}

/**
 * Check a raw generator output against the input and the criteria. Returns
 * the accepted case, or plain-English problems (fed back on the retry).
 */
export function validateDraft(raw: unknown, input: AiCaseInput): Validation {
  const c = CRITERIA_BY_DX[input.dx];
  if (!c) return { ok: false, problems: [`No checklist for "${input.dx}".`] };

  const parsed = draftSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      problems: parsed.error.issues.slice(0, 8).map((i) => `JSON shape: ${i.path.join(".") || "(root)"} ${i.message}`),
    };
  }
  const d = parsed.data;
  const problems: string[] = [];

  const sources: Source[] = [
    ...d.clues.map((t, i) => ({ source: "clue" as const, index: i, text: t })),
    ...d.investigations.map((x, i) => ({ source: "investigation" as const, index: i, text: x.result })),
  ];
  const evidence: EvidenceRef[] = [];
  const seen = (id: string) => {
    const rule = RULES[id];
    if (!rule) return false;
    const hit = findEvidence(rule, sources);
    if (hit && !evidence.some((e) => e.criterion === id)) evidence.push({ criterion: id, ...hit });
    return !!hit;
  };

  // 2. The diagnosis is really supported.
  if (c.core?.length && !c.core.map(seen).some(Boolean)) {
    problems.push(`Must show at least one of: ${c.core.map((id) => RULES[id].label).join("; ")}.`);
  }
  for (const id of c.all) {
    if (!seen(id)) problems.push(`Must show ${RULES[id].label} (e.g. ${RULES[id].hint}).`);
  }
  if (c.minOf) {
    const shown = c.minOf.ids.filter(seen);
    if (shown.length < c.minOf.n) {
      const missing = c.minOf.ids.filter((id) => !shown.includes(id)).map((id) => RULES[id].label);
      problems.push(`Must show at least ${c.minOf.n} of the listed features, found ${shown.length}. Add some of: ${missing.join("; ")}.`);
    }
  }
  if (c.duration) {
    if (!d.duration) {
      problems.push(`Give "duration" (how long it has lasted): ${c.duration.label}.`);
    } else {
      const days = durationDays(d.duration);
      if (days < c.duration.minDays || days > c.duration.maxDays) {
        problems.push(`Duration ${d.duration.value} ${d.duration.unit} doesn't fit: needs ${c.duration.label}.`);
      }
      const written = d.clues.flatMap(parseDurations);
      const close = (x: number) => Math.abs(x - days) <= Math.max(1, days * 0.15);
      if (!written.some(close)) problems.push(`Say the duration (${d.duration.value} ${d.duration.unit}) in words in one of the clues.`);
    }
  }
  const clueIdx = new Set(evidence.filter((e) => e.source === "clue").map((e) => e.index));
  if (clueIdx.size < 3) problems.push("Spread the evidence over at least 3 different clues, so the case builds up.");

  // 3. Each look-alike is listed and really ruled out.
  const listed = new Set<string>();
  for (const x of d.differentials) {
    if (x.dx === input.dx) problems.push("The answer can't also be a differential.");
    else if (!DX_NAMES[x.dx]) problems.push(`Unknown differential id "${x.dx}". Use only: ${Object.keys(DX_NAMES).join(", ")}.`);
    else if (listed.has(x.dx)) problems.push(`Differential "${x.dx}" is listed twice.`);
    listed.add(x.dx);
  }
  for (const la of c.lookAlikes) {
    if (!listed.has(la.dx)) problems.push(`List "${la.dx}" (${DX_NAMES[la.dx]}) as a differential with why it is ruled out.`);
    if (la.rule === "@duration") continue; // checked with the duration above
    const rule = RULES[la.rule];
    if (rule && !findEvidence(rule, sources)) {
      problems.push(`To rule out ${DX_NAMES[la.dx]}, a clue or result must show ${rule.label} (e.g. ${rule.hint}).`);
    } else if (rule) {
      seen(la.rule);
    }
  }

  // 4. Fairness and safety.
  const visible: [string, string][] = [
    ["place", d.place],
    ["pointer", d.pointer],
    ...d.clues.map((t, i): [string, string] => [`clue ${i + 1}`, t]),
    ...d.investigations.flatMap((x, i): [string, string][] => [[`investigation ${i + 1} label`, x.label], [`investigation ${i + 1} result`, x.result]]),
  ];
  for (const [where, t] of visible) {
    const w = leaks(t, c);
    if (w) problems.push(`The ${where} gives the answer away ("${w}"). Describe, don't name.`);
  }
  d.investigations.forEach((x, i) => {
    if (SCALE_NAMES.test(x.label)) problems.push(`Investigation ${i + 1} label names a rating scale; say "A rating scale" instead.`);
  });
  for (const [where, t] of [...visible, ["overview", d.overview] as [string, string]]) {
    if (CONTACT.test(t)) problems.push(`The ${where} has a phone number or link; remove it.`);
  }
  const indian = INDIAN_PLACES.test(d.place);
  if (input.setting === "indian" && !indian) problems.push(`"place" must be an Indian town or city (e.g. "Indore · district hospital OPD").`);
  if (input.setting === "global" && indian) problems.push(`"place" must be outside India for a global case (e.g. "Leeds · GP surgery").`);

  if (problems.length) return { ok: false, problems: [...new Set(problems)] };

  return {
    ok: true,
    case: {
      ai: true,
      difficulty: input.difficulty,
      setting: input.setting,
      chapter: c.chapter,
      answer: c.dx,
      place: d.place,
      clues: d.clues as AiCase["clues"],
      investigations: d.investigations,
      differentials: d.differentials,
      pointer: d.pointer,
      overview: d.overview,
      module: c.module,
      topic: c.topic,
      evidence,
      checkedBy: VALIDATOR_VERSION,
    },
  };
}
