/**
 * The practice tools whose whole case comes to the browser on the website
 * (What would you do, Say it clinically, Judgment calls, Ethics, Landmark,
 * OSCE, Two-minute clinic, Formulation, Out of depth, Weak spots, the MSE
 * trainer). GET /practise/tools/:tool sends the same data the website page
 * gives its game; this file turns that data into a case in steps and checks
 * each answer on the phone, exactly as the website checks it in the browser.
 * Points never come from here: answers go to the answer history, and the
 * records that score (Judgment calls) are scored again on the server.
 */
import appData from "../data/app-data.json";
import { diagnosisName } from "../data";
import type { CaseLibrary, CaseMark, PractiseRecordKind, PractiseTool, PractiseToolId } from "../contract";
import type { ProgressTool, ToolId, ToolReveal, ToolStep } from "../types";

/** App tool id to the server's tool id (GET /practise/tools/:tool). */
export const API_TOOL: Record<ToolId, PractiseToolId> = {
  wwyd: "wwyd",
  "say-it": "terms",
  judgment: "judgment",
  ethics: "ethics",
  landmark: "landmark",
  osce: "osce",
  "two-minute": "two-minute",
  formulation: "formulation",
  "out-of-depth": "out-of-depth",
  "weak-spots": "weak-spots",
  "mse-trainer": "mse",
};

/** The answer-history tool name the website uses for each (src/lib/history). */
export const HISTORY_TOOL: Record<ToolId, string> = {
  wwyd: "wwyd",
  "say-it": "say-it",
  judgment: "judgment",
  ethics: "ethics",
  landmark: "landmark",
  osce: "osce",
  "two-minute": "two-minute",
  formulation: "formulation",
  "out-of-depth": "out-of-depth",
  "weak-spots": "weak-spots",
  "mse-trainer": "mse",
};

/** Tools that keep a half-finished case on the website (src/lib/cases/progress.ts). */
export const PROGRESS_TOOL: Partial<Record<ToolId, ProgressTool>> = { wwyd: "wwyd", "two-minute": "two-minute", landmark: "landmark", osce: "osce", formulation: "formulation" };

export type Key = {
  pub: ToolStep;
  right: number[];
  /** Per option: best, ok or harm (What would you do). */
  verdicts?: ("best" | "ok" | "harm")[];
  /** Per option credit (0 to 1), when an answer can be part right. */
  credit?: number[];
  /** Checklist weights. */
  weights?: number[];
  why: string;
  notes?: (string | null)[];
  more?: string | null;
  /** The item id this step is about, for the answer history and records. */
  item?: string;
  /** Free text: not checked, compared with the model answer. */
  selfCheck?: boolean;
  /** Raw data a record needs (Judgment calls). */
  raw?: Record<string, unknown>;
};
export type Def = { id: string; title: string; line: string | null; setting: string | null; intro: string; steps: Key[]; takeaway: string };

/* ---------------------------------------------------------------- helpers */

/** A small seeded shuffle: the same case shows the same order while it is open. */
function rng(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}
export function shuffled<T>(xs: readonly T[], seed: string): T[] {
  const r = rng(seed);
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}
const pick = (n: number, ask: string, options: string[], right: number, why: string, extra: Partial<Key> = {}): Key => ({ pub: { n, kind: "pick", ask, options }, right: [right], why, ...extra });
const arr = <T>(x: unknown): T[] => (Array.isArray(x) ? (x as T[]) : []);
const chunks = <T>(xs: T[], n: number): T[][] => Array.from({ length: Math.ceil(xs.length / n) }, (_, i) => xs.slice(i * n, i * n + n));
const SCALE: [string, string, string, string, string] = ["Much less likely", "Less likely", "No change", "More likely", "Much more likely"];

/* -------------------------------------------- Judgment calls: the panel */

/** The website's simulated expert panel for the seed items (src/lib/practice/sct.ts simulatedPanel). */
export function simulatedPanel(id: string): number[] {
  const h = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const base = (h % 5) - 2;
  const cl = (x: number) => Math.max(-2, Math.min(2, x));
  return [base, base, cl(base + 1), cl(base - 1), cl(base + (h % 2 === 0 ? 1 : -1))];
}
/** count(option) / count(modal), as the website scores it. */
export function scoreSct(response: number, panel: number[]): number {
  const counts = new Map<number, number>();
  for (const r of panel) counts.set(r, (counts.get(r) ?? 0) + 1);
  const modal = Math.max(...counts.values());
  return (counts.get(response) ?? 0) / modal;
}
function modalOf(panel: number[]): number {
  const counts = new Map<number, number>();
  for (const r of panel) counts.set(r, (counts.get(r) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]![0];
}

/* ----------------------------------------------------------- per tool */

type Scenario = { id: string; who: string; topic: string; objective: string; beats: { says: string; context?: string; choices: { text: string; outcome: "best" | "ok" | "harm"; consequence: string }[] }[] };
type SayIt = { id: string; phrase: string; language: string; meaning: string; term: string; note?: string; wrong: string[]; why: string; topic: string; difficulty: number };
type NoteTerm = { noteId: string; term: string; lay: string; topic: string };
type Sct = { id: string; vignette: string; hypothesis: string; new_information: string; topic?: string };
type Dilemma = { id: string; tag: string; setting: string; vignette: string; options: { label: string; consequence: string; correct: boolean }[]; law: string };
type QuizItem = { id: string; prompt: string; options: string[]; correct: number; rationale: string };
type Ood = { id: string; vignette: string; options: { option: string; label: string }[]; correct: string; reasoning: string };
type Landmark = { id: string; title: string; domain: string; story: string; believedThen: string; understandNow: string; quiz: { question: string; options: string[]; correct: number; rationale: string }[] };
type Osce = { id: string; title: string; task: string; duration_seconds: number; checklist: { item: string; weight: number }[] };
type Clinic = { id: string; topic: string; line: string; diagnosis: string; expertDifferential: string[]; expertNext: string; lesson: string; objective: string };
type Form = { id: string; title: string; prompt: string; hint?: string; modelNarrative: string; factors: { id: string; text: string; bucket: string }[] };
type Drill = { id: string; skill: string; scenario: string; weakLine: string; strongLine: string; why: string };
type Spot = { key: string; label: string };
type MseStim = { id: string; content: string; domain: string; expertTags: string[]; amberTags: string[]; why?: string };

const BUCKET_IDS = ["presenting", "predisposing", "precipitating", "perpetuating", "protective", "distractor"] as const;
const BUCKET_NAMES = ["Presenting", "Predisposing", "Precipitating", "Perpetuating", "Protective", "Leave out"];
const VOCAB = appData.MSE_VOCAB as Record<string, string[]>;
const DOMAIN_NAME: Record<string, string> = { appearance: "Appearance", behavior: "Behaviour", speech: "Speech", mood: "Mood", affect: "Affect", thought_content: "Thought content", thought_process: "Thought process", perception: "Perception", cognition: "Cognition", insight: "Insight", judgment: "Judgment" };

function wwyd(d: Record<string, unknown>): Def[] {
  return arr<Scenario>(d.scenarios).map((s) => ({
    id: s.id,
    title: s.who,
    line: s.topic,
    setting: s.topic,
    intro: s.beats[0]?.context ?? `${s.who}. ${s.objective}.`,
    steps: s.beats.map((b, n) => ({
      pub: { n, kind: "pick" as const, ask: b.says, options: b.choices.map((c) => c.text) },
      right: [b.choices.findIndex((c) => c.outcome === "best")],
      verdicts: b.choices.map((c) => c.outcome),
      why: b.choices.find((c) => c.outcome === "best")?.consequence ?? "",
      notes: b.choices.map((c) => c.consequence),
      item: s.id,
    })),
    takeaway: s.objective,
  }));
}

/** Say it clinically: phrase cards, lowest level first, eight to a round (the website's TermsGame). */
function sayIt(d: Record<string, unknown>, seed: string): Def[] {
  const say = arr<SayIt>(d.sayIt).map((x) => ({ id: x.id, phrase: x.phrase, language: x.language as string | undefined, term: x.term, wrong: x.wrong, why: x.why, note: x.note, level: x.difficulty, topic: x.topic, meaning: x.meaning as string | undefined }));
  const notes = arr<NoteTerm>(d.terms).map((t) => ({ id: `note-${t.noteId}-${t.term}`, phrase: t.lay, language: undefined, term: t.term, wrong: [] as string[], why: `${t.topic}: “${t.lay}” is written as ${t.term}.`, note: undefined, level: 2, topic: t.topic, meaning: undefined }));
  const cards = [...say, ...notes];
  const names = [...new Set(cards.map((c) => c.term))];
  const card = (c: (typeof cards)[number], n: number): Key => {
    const wrong = c.wrong.length >= 3 ? c.wrong.slice(0, 3) : shuffled(names.filter((x) => x !== c.term), `${seed}:${c.id}`).slice(0, 3);
    const options = shuffled([c.term, ...wrong], `${seed}:o:${c.id}`);
    const why = [c.meaning, c.why, c.note].filter(Boolean).join("\n\n");
    return pick(n, `They say: “${c.phrase}”. You write:`, options, options.indexOf(c.term), why, { item: c.id, more: null });
  };
  const topics = [...new Set(say.map((c) => c.topic))];
  const mixed = shuffled(cards, `${seed}:mixed`).slice(0, 8).sort((a, b) => a.level - b.level);
  const out: Def[] = [{ id: "mixed", title: "A mixed round", line: "Phrases from every topic", setting: null, intro: "Turn what the patient or family says into the words a case sheet uses.", steps: mixed.map(card), takeaway: "Write what you observe in the shared words, so the next clinician reads the same picture." }];
  for (const t of topics) {
    const mine = shuffled(cards.filter((c) => c.topic === t), `${seed}:${t}`).slice(0, 8).sort((a, b) => a.level - b.level);
    if (mine.length < 2) continue;
    out.push({ id: `topic-${t}`, title: t, line: null, setting: null, intro: "Turn what the patient or family says into the words a case sheet uses.", steps: mine.map(card), takeaway: "Write what you observe in the shared words, so the next clinician reads the same picture." });
  }
  return out;
}

function judgment(d: Record<string, unknown>): Def[] {
  const items = arr<Sct>(d.items);
  if (!items.length) return [];
  return [
    {
      id: "judgment",
      title: "Judgment calls",
      line: "New facts change the odds",
      setting: null,
      intro: "You have a working diagnosis. Then a new fact arrives. Say how it changes the odds.",
      steps: items.map((it, n) => {
        const panel = simulatedPanel(it.id);
        const modal = modalOf(panel);
        return {
          pub: { n, kind: "scale" as const, ask: it.vignette, hypothesis: it.hypothesis, fact: it.new_information, labels: SCALE },
          right: [modal + 2],
          credit: [-2, -1, 0, 1, 2].map((r) => scoreSct(r, panel)),
          why: `Most of the panel chose “${SCALE[modal + 2]}”. Answers near it get part marks.`,
          item: it.id,
          raw: { item_id: it.id, vignette: it.vignette, hypothesis: it.hypothesis, new_information: it.new_information },
        };
      }),
      takeaway: "A new fact moves a diagnosis up or down; it rarely settles it alone.",
    },
  ];
}

function ethics(d: Record<string, unknown>): Def[] {
  const out: Def[] = arr<Dilemma>(d.dilemmas).map((x) => ({
    id: x.id,
    title: x.tag,
    line: x.setting,
    setting: x.setting,
    intro: x.vignette,
    steps: [
      pick(
        0,
        "What do you do?",
        x.options.map((o) => o.label),
        x.options.findIndex((o) => o.correct),
        x.options.find((o) => o.correct)?.consequence ?? "",
        { notes: x.options.map((o) => o.consequence), more: x.law, item: x.id },
      ),
    ],
    takeaway: x.law,
  }));
  const quiz = arr<QuizItem>(d.quiz);
  if (quiz.length) out.push({ id: "ethics-quiz", title: "Quick check", line: "Law and referral", setting: null, intro: "A few quick questions on what the law asks of you.", steps: quiz.map((q, n) => pick(n, q.prompt, q.options, q.correct, q.rationale, { item: q.id })), takeaway: "When the law sets a duty, it comes before what anyone in the room wants." });
  return out;
}

function outOfDepth(d: Record<string, unknown>): Def[] {
  return arr<Ood>(d.scenarios).map((s, i) => ({
    id: s.id,
    title: `Case ${i + 1}`,
    line: s.vignette.length > 70 ? `${s.vignette.slice(0, 68).trimEnd()}...` : s.vignette,
    setting: null,
    intro: s.vignette,
    steps: [pick(0, "What is the right call?", s.options.map((o) => o.label), s.options.findIndex((o) => o.option === s.correct), s.reasoning, { item: s.id })],
    takeaway: "Know the signs that need someone else today, and the ones you can safely keep.",
  }));
}

function landmark(d: Record<string, unknown>): Def[] {
  return arr<Landmark>(d.cases).map((c) => ({
    id: c.id,
    title: c.title,
    line: c.domain,
    setting: c.domain,
    intro: c.story,
    steps: [{ pub: { n: 0, kind: "read" as const, title: "What was believed, and what held up", body: `Then: ${c.believedThen}\n\nNow: ${c.understandNow}` }, right: [], why: "" }, ...c.quiz.map((q, i) => pick(i + 1, q.question, q.options, q.correct, q.rationale, { item: c.id }))],
    takeaway: c.understandNow,
  }));
}

function osce(d: Record<string, unknown>): Def[] {
  return arr<Osce>(d.stations).map((s) => ({
    id: s.id,
    title: s.title,
    line: `${Math.round(s.duration_seconds / 60)} minutes`,
    setting: "OSCE station",
    intro: s.task,
    steps: [{ pub: { n: 0, kind: "checklist" as const, ask: "Say it out loud as if the patient is in front of you. Then tick what you covered.", items: s.checklist.map((c) => c.item), seconds: s.duration_seconds }, right: s.checklist.map((_, i) => i), weights: s.checklist.map((c) => c.weight), why: "Examiners give the most marks for the items worth two.", item: s.id }],
    takeaway: "Ask the hard questions plainly, then make a plan you can act on today.",
  }));
}

function twoMinute(d: Record<string, unknown>): Def[] {
  return arr<Clinic>(d.clinics).map((c) => ({
    id: c.id,
    title: c.topic,
    line: c.objective,
    setting: "Two minutes",
    intro: c.line,
    steps: [
      {
        pub: { n: 0, kind: "write" as const, ask: "Your top diagnoses, and the one question you would ask next.", fields: ["Your top diagnoses", "The question you would ask next"], seconds: 120 },
        right: [],
        why: `The expert's list: ${c.expertDifferential.join("; ")}.`,
        more: `Ask next: ${c.expertNext}\n\n${c.lesson}`,
        selfCheck: true,
        item: c.id,
        raw: { diagnosis: c.diagnosis, expert: c.expertDifferential },
      },
    ],
    takeaway: c.lesson,
  }));
}

function formulation(d: Record<string, unknown>): Def[] {
  return arr<Form>(d.cases).map((f) => ({
    id: f.id,
    title: f.title,
    line: f.hint ?? null,
    setting: null,
    intro: f.prompt,
    steps: [{ pub: { n: 0, kind: "buckets" as const, ask: "Put each factor where it belongs.", buckets: BUCKET_NAMES, items: f.factors.map((x) => x.text) }, right: f.factors.map((x) => Math.max(0, BUCKET_IDS.indexOf(x.bucket as (typeof BUCKET_IDS)[number]))), why: f.modelNarrative, item: f.id }],
    takeaway: f.modelNarrative,
  }));
}

function weakSpots(d: Record<string, unknown>, seed: string): Def[] {
  const drill = arr<Drill>(d.drill);
  const spots = arr<Spot>(d.spots);
  if (!drill.length) return [];
  return [
    {
      id: "drill",
      title: "Your drill",
      line: spots.length ? spots.slice(0, 3).map((s) => s.label).join(", ") : null,
      setting: null,
      intro: "Moments from your practice interviews. Pick the stronger thing to say.",
      steps: drill.map((x, n) => {
        const options = shuffled([x.strongLine, x.weakLine], `${seed}:${x.id}`);
        return pick(n, x.scenario, options, options.indexOf(x.strongLine), x.why, { item: x.id });
      }),
      takeaway: "Come back after your next interview: the drill follows what you miss.",
    },
  ];
}

/** The MSE trainer: describe first (Observe), then tag the domain words (Domains). */
function mseTrainer(d: Record<string, unknown>, seed: string): Def[] {
  const content = (d.content ?? {}) as { observe?: { id: string; content: string; why?: string }[]; domain?: MseStim[] };
  const out: Def[] = [];
  chunks(content.observe ?? [], 3).forEach((group, k) =>
    out.push({
      id: `observe-${k + 1}`,
      title: `Describe what you see ${k + 1}`,
      line: "Level 1: observe, not conclude",
      setting: "Level 1",
      intro: "Write what you can see and hear, not what you conclude.",
      steps: group.map((o, n) => ({ pub: { n, kind: "write" as const, ask: o.content, fields: ["What you see and hear"] }, right: [], why: o.why ?? "Describe the behaviour itself: what someone else in the room would also see.", selfCheck: true, item: o.id })),
      takeaway: "Describe first, label second.",
    }),
  );
  chunks(content.domain ?? [], 4).forEach((group, k) =>
    out.push({
      id: `domain-${k + 1}`,
      title: `Tag the domain ${k + 1}`,
      line: "Level 2: the right words",
      setting: "Level 2",
      intro: "Pick every word that describes what you read.",
      steps: group.map((s, n) => {
        const vocab = VOCAB[s.domain] ?? [];
        const others = shuffled(vocab.filter((v) => !s.expertTags.includes(v) && !s.amberTags.includes(v)), `${seed}:${s.id}`).slice(0, Math.max(2, 6 - s.expertTags.length - s.amberTags.length));
        const options = shuffled([...s.expertTags, ...s.amberTags, ...others], `${seed}:o:${s.id}`);
        return {
          pub: { n, kind: "multi" as const, ask: `${DOMAIN_NAME[s.domain] ?? s.domain}: ${s.content}`, options },
          right: options.map((o, i) => (s.expertTags.includes(o) ? i : -1)).filter((i) => i >= 0),
          credit: options.map((o) => (s.expertTags.includes(o) ? 1 : s.amberTags.includes(o) ? 0.5 : 0)),
          notes: options.map((o) => (s.amberTags.includes(o) ? "Also fair" : null)),
          why: s.why ?? `The expert words: ${s.expertTags.join(", ")}.`,
          item: s.id,
        };
      }),
      takeaway: "Use the shared words, so the next clinician reads the same picture.",
    }),
  );
  return out;
}

/** Every tool's cases from the server's data. `seed` keeps shuffles stable for a session. */
export function buildDefs(tool: ToolId, data: Record<string, unknown>, seed = "s"): Def[] {
  switch (tool) {
    case "wwyd":
      return wwyd(data);
    case "say-it":
      return sayIt(data, seed);
    case "judgment":
      return judgment(data);
    case "ethics":
      return ethics(data);
    case "out-of-depth":
      return outOfDepth(data);
    case "landmark":
      return landmark(data);
    case "osce":
      return osce(data);
    case "two-minute":
      return twoMinute(data);
    case "formulation":
      return formulation(data);
    case "weak-spots":
      return weakSpots(data, seed);
    case "mse-trainer":
      return mseTrainer(data, seed);
  }
}

/** Cases in the server's order (best next first) with its marks; the rest after, unmarked. */
export function arrange(defs: Def[], cases: CaseLibrary | null): { def: Def; mark: CaseMark | null }[] {
  if (!cases) return defs.map((def) => ({ def, mark: null }));
  const by = new Map(defs.map((d) => [d.id, d]));
  const started = new Set(cases.progress.filter((p) => p.state != null).map((p) => p.item));
  const out: { def: Def; mark: CaseMark | null }[] = [];
  for (const it of cases.items) {
    const def = by.get(it.id);
    if (!def) continue;
    by.delete(it.id);
    out.push({ def, mark: started.has(it.id) && it.mark !== "done" ? "started" : it.mark });
  }
  for (const def of by.values()) out.push({ def, mark: null });
  return out;
}

/* ---------------------------------------------------------------- grading */

/** Check one answer, the same rules as each website tool. */
export function grade(k: Key, answer: unknown): ToolReveal {
  const s = k.pub;
  const base = { right: k.right, why: k.why, notes: k.notes ?? null, more: k.more ?? null };
  if (s.kind === "read") return { ...base, score: 1, verdict: null };
  if (s.kind === "write") return { ...base, score: 1, verdict: null, selfCheck: true };
  if (s.kind === "pick") {
    const a = Number(answer);
    const v = k.verdicts?.[a] ?? (a === k.right[0] ? "best" : "harm");
    return { ...base, score: v === "best" ? 1 : v === "ok" ? 0.5 : 0, verdict: k.verdicts ? v : null };
  }
  if (s.kind === "scale") {
    const a = Number(answer);
    return { ...base, score: k.credit?.[a] ?? (a === k.right[0] ? 1 : 0), verdict: null };
  }
  const ticked = Array.isArray(answer) ? (answer as number[]) : [];
  if (s.kind === "checklist") {
    const w = k.weights ?? k.right.map(() => 1);
    const total = w.reduce((a, x) => a + x, 0);
    const got = ticked.reduce((a, i) => a + (w[i] ?? 0), 0);
    return { ...base, score: total ? got / total : 0, verdict: null };
  }
  if (s.kind === "multi") {
    const credit = k.credit ?? s.options.map((_, i) => (k.right.includes(i) ? 1 : 0));
    const want = credit.filter((c) => c >= 1).length || 1;
    const got = ticked.reduce((a, i) => a + ((credit[i] ?? 0) > 0 ? credit[i]! : -0.5), 0);
    return { ...base, score: Math.max(0, Math.min(1, got / want)), verdict: null };
  }
  const placed = Array.isArray(answer) ? (answer as number[]) : [];
  const ok = k.right.filter((b, i) => placed[i] === b).length;
  return { ...base, score: k.right.length ? ok / k.right.length : 0, verdict: null };
}

/** A pick, scale or multi answer counts as right for the answer history at 75% and above. */
export const countsRight = (r: ToolReveal) => (r.selfCheck ? null : r.score >= 0.75);

/** The records a finished case sends (POST /practise/records/:kind), in the website routes' own JSON. */
export function recordsFor(tool: ToolId, def: Def, answers: { step: number; answer: unknown; ms: number }[], served: PractiseRecordKind[]): { kind: PractiseRecordKind; body: Record<string, unknown> }[] {
  const out: { kind: PractiseRecordKind; body: Record<string, unknown> }[] = [];
  if (tool === "judgment" && served.includes("judgment")) {
    for (const a of answers) {
      const k = def.steps[a.step];
      if (!k?.raw) continue;
      out.push({ kind: "judgment", body: { ...k.raw, response: Number(a.answer) - 2, seconds_spent: Math.max(0, Math.round(a.ms / 1000)) } });
    }
  }
  if (tool === "two-minute" && served.includes("clinic")) out.push({ kind: "clinic", body: {} });
  return out;
}

export const dxLabel = diagnosisName;
export type { PractiseTool };
