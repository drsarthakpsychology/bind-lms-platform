/* Case tools, Exam Prep and the hub, on the mock server (mock builds only). */
import dict from "../data/dictionaries.json";
import type * as P from "../types";
import { CONTENT, FAIL, held, keep, nextSeed, PlayError, rng, shuffled, swap } from "./kit";
import tools from "./tools.json";
import { escapeSaved, wardSaved } from "./games";

const DX = dict.DIAGNOSES as { id: string; name: string; chapter: string }[];
const CH = dict.CHAPTERS as Record<string, { name: string }>;
const dxName = (id: string) => DX.find((d) => d.id === id)?.name ?? id;
const TERMS = dict.MSE_TERMS as Record<string, { label: string; domain: string; def: string }>;

/** What this student has finished and started (the case-progress rows). */
const doneItems = new Set<string>(["wwyd:sc-mania-1", "ethics:mha-advance-directive"]);
const started = new Map<string, { title: string; step: string; token: string }>();

/* ------------------------------------------------------------------ daily */
type DailyCase = { id: string; difficulty: 1 | 2 | 3; chapter: string; answer: string; synonyms: string[]; setting: string; clues: string[]; investigations: { kind: P.DailyKind; label: string; result: string }[]; differentials: { dx: string; whyNot: string }[]; overview: string; pointer: string; module: string };
const DAILY = CONTENT.DAILY as DailyCase[];
type Prog = { clues: number; invs: number[]; guesses: P.DailyView["guesses"]; hints: number; status: P.DailyView["status"]; chapterHit: boolean; marks: string[]; log: P.DailyAction[] };
const dailyRows = new Map<string, Prog>();
const fresh = (): Prog => ({ clues: 1, invs: [], guesses: [], hints: 0, status: "playing", chapterHit: false, marks: [], log: [] });
const used = (p: Prog) => p.clues - 1 + p.invs.length;
const scoreOf = (p: Prog) => (p.status === "solved" ? Math.max(0, Math.max(10, 100 - 15 * used(p)) - 10 * p.hints) : p.status === "lost" ? (p.chapterHit ? 15 : 0) : 0);
const canClue = (p: Prog) => p.status === "playing" && p.clues < 6 && p.clues + 1 <= 3;
function applyDaily(c: DailyCase, p: Prog, a: P.DailyAction): Prog {
  if (p.status !== "playing") return p;
  const log = [...p.log, a];
  switch (a.t) {
    case "clue":
      return canClue(p) ? { ...p, clues: p.clues + 1, marks: [...p.marks, "clue"], log } : p;
    case "inv":
      return a.i >= 0 && a.i < c.investigations.length && !p.invs.includes(a.i) ? { ...p, invs: [...p.invs, a.i], marks: [...p.marks, "inv"], log } : p;
    case "hint":
      return p.hints < 2 ? { ...p, hints: p.hints + 1, marks: [...p.marks, "hint"], log } : p;
    case "giveup":
      return { ...p, status: "lost", log };
    case "guess": {
      if (!DX.some((d) => d.id === a.dx) || p.guesses.some((g) => g.dx === a.dx)) return p;
      if (a.dx === c.answer || c.synonyms.includes(a.dx)) return { ...p, status: "solved", guesses: [...p.guesses, { dx: a.dx, name: dxName(a.dx), ok: true, sameChapter: true, reason: "" }], marks: [...p.marks, "hit"], log };
      const g = DX.find((d) => d.id === a.dx)!;
      const sameChapter = g.chapter === c.chapter;
      const own = c.differentials.find((x) => x.dx === a.dx);
      const reason = own ? own.whyNot : `${sameChapter ? `Right chapter (${CH[c.chapter]?.name ?? c.chapter}), wrong disorder. ` : ""}The clues so far don't fit ${g.name}.`;
      const guesses = [...p.guesses, { dx: a.dx, name: g.name, ok: false, sameChapter, reason }];
      const chapterHit = p.chapterHit || (sameChapter && p.hints === 0);
      const marks = [...p.marks, sameChapter ? "near" : "miss"];
      if (p.clues >= 6) return { ...p, guesses, chapterHit, marks, status: "lost", log };
      return { ...p, guesses, chapterHit, marks, clues: p.clues + 1, log };
    }
  }
}
const SQ: Record<string, string> = { clue: "⬜", inv: "🔎", hint: "💡", near: "🟨", miss: "🟥", hit: "🟩" };
function dailyView(c: DailyCase, p: Prog, mode: "daily" | "practice"): P.DailyView {
  const over = p.status !== "playing";
  return {
    mode,
    caseId: c.id,
    ai: false,
    difficulty: c.difficulty,
    setting: c.setting,
    clues: c.clues.slice(0, p.clues),
    cluesOpen: p.clues,
    unopened: Math.max(0, c.clues.length - p.clues) + c.investigations.filter((_, i) => !p.invs.includes(i)).length,
    investigations: c.investigations.map((x, i) => ({ i, kind: x.kind, label: x.label, result: p.invs.includes(i) ? x.result : null, ordered: p.invs.includes(i) })),
    guesses: p.guesses,
    hints: { used: p.hints, chapter: p.hints >= 1 || over ? (CH[c.chapter]?.name ?? null) : null, pointer: p.hints >= 2 || over ? c.pointer : null },
    canClue: canClue(p),
    status: p.status,
    points: used(p),
    score: scoreOf(p),
    grid: p.marks.map((m) => SQ[m] ?? "").join(""),
    reveal: over ? { answer: dxName(c.answer), chapter: CH[c.chapter]?.name ?? c.chapter, topic: c.chapter, overview: c.overview, lookAlikes: c.differentials.map((x) => ({ name: dxName(x.dx), whyNot: x.whyNot })), module: c.module, refs: null } : null,
  };
}
const dailyCase = (mode: string, caseId?: string) => (mode === "practice" ? (DAILY.find((c) => c.id === caseId) ?? DAILY[1]!) : DAILY[0]!);
const daily = {
  move(input: { mode?: string; caseId?: string; action?: P.DailyAction }): P.DailyMove {
    const mode = input?.mode === "practice" ? "practice" : "daily";
    const c = dailyCase(mode, input?.caseId);
    const key = `${mode}:${c.id}`;
    const before = dailyRows.get(key) ?? fresh();
    const after = input.action ? applyDaily(c, before, input.action) : before;
    dailyRows.set(key, after);
    const justFinished = before.status === "playing" && after.status !== "playing";
    if (justFinished && mode === "daily") doneItems.add("daily:today");
    return { ok: true, view: dailyView(c, after, mode), meta: { day: "2026-11-15", number: 47, streak: 6, playedDays: [], hints: null, cohort: null, stored: true }, log: after.log, justFinished, xp: justFinished ? Math.round(scoreOf(after) / 10) + (mode === "daily" ? 5 : 0) : 0, xpSaved: true };
  },
  rest(input: { mode?: string; caseId?: string }): { ok: true; rest: { clues: { n: number; text: string }[]; tests: { kind: P.DailyKind; label: string; result: string }[] } } {
    const mode = input?.mode === "practice" ? "practice" : "daily";
    const c = dailyCase(mode, input?.caseId);
    const p = dailyRows.get(`${mode}:${c.id}`);
    if (!p || p.status === "playing") throw FAIL();
    return { ok: true, rest: { clues: c.clues.slice(p.clues).map((text, i) => ({ n: p.clues + i + 1, text })), tests: c.investigations.filter((_, i) => !p.invs.includes(i)) } };
  },
  next(_local: unknown, current?: unknown): { ok: true; caseId: string; target: string; recycled: boolean } {
    const others = DAILY.slice(1).filter((c) => c.id !== current);
    const c = others[nextSeed() % others.length] ?? DAILY[1]!;
    dailyRows.delete(`practice:${c.id}`);
    return { ok: true, caseId: c.id, target: `/practice/daily?case=${c.id}`, recycled: false };
  },
};

/* -------------------------------------------------------------- detective */
type DetCase = { answer: string; family: "drug" | "disorder"; clues: string[] };
const DET = CONTENT.DETECTIVE as DetCase[];
const detName = (c: DetCase | string) => {
  const a = typeof c === "string" ? c : c.answer;
  const s = a.replace(/-/g, " ");
  return DX.find((d) => d.id === a)?.name ?? s.charAt(0).toUpperCase() + s.slice(1);
};
type DetRun = { cases: DetCase[]; options: string[][] };
const detective = {
  deal(family: unknown): P.DetDeal {
    const r = rng(nextSeed());
    const pool = DET.filter((c) => family === "mixed" || !family || c.family === family);
    const cases = shuffled(pool, r).slice(0, 8);
    const options = cases.map((c) => shuffled([c, ...shuffled(pool.filter((x) => x.family === c.family && x.answer !== c.answer), r).slice(0, 3)].map(detName), r));
    const marks: P.CaseMark[] = cases.map((_, i) => (i === 0 ? "new" : i === 1 ? "week" : "new"));
    return { ok: true, token: keep<DetRun>({ cases, options }), run: "mock", rounds: cases.map((c, i) => ({ options: options[i]!, clue: c.clues[0]! })), marks, recycled: false };
  },
  clue(token: unknown, round: unknown, n: unknown): { ok: true; clue: string } {
    const c = held<DetRun>(token).cases[Number(round)];
    const clue = c?.clues[Number(n)];
    if (!clue) throw FAIL();
    return { ok: true, clue };
  },
  clues(token: unknown, round: unknown): { ok: true; clues: string[] } {
    const c = held<DetRun>(token).cases[Number(round)];
    if (!c) throw FAIL();
    return { ok: true, clues: c.clues };
  },
  guess(token: unknown, round: unknown, guess: unknown, final: unknown): { ok: true; right: boolean; answer: string | null } {
    const c = held<DetRun>(token).cases[Number(round)];
    if (!c) throw FAIL();
    const right = guess === detName(c);
    if (right || final) doneItems.add(`detective:${c.answer}`);
    return { ok: true, right, answer: right || final === true ? detName(c) : null };
  },
};

/* ------------------------------------------------------------------ tools */
type Key = { pub: P.ToolStep; right: number[]; verdicts?: ("best" | "ok" | "harm")[]; why: string; notes?: (string | null)[]; more?: string | null; weights?: number[] };
type Def = { id: string; title: string; line: string | null; setting: string | null; intro: string; steps: Key[]; takeaway: string };
const T = tools as any;
const pickKey = (n: number, ask: string, options: string[], right: number, why: string, notes?: (string | null)[], more?: string | null): Key => ({ pub: { n, kind: "pick", ask, options }, right: [right], why, notes, more: more ?? null });

function buildTools(): Record<P.ToolId, Def[]> {
  const r = rng(11);
  const wwyd: Def[] = T.wwyd.map((s: { id: string; who: string; topic: string; objective: string; beats: { says: string; context?: string; choices: { text: string; outcome: "best" | "ok" | "harm"; consequence: string }[] }[] }) => ({
    id: s.id,
    title: s.who,
    line: s.topic,
    setting: s.topic,
    intro: s.beats[0]?.context ?? `${s.who}. ${s.objective}.`,
    steps: s.beats.map((b, n) => ({ pub: { n, kind: "pick", ask: b.says, options: b.choices.map((c) => c.text) }, right: [b.choices.findIndex((c) => c.outcome === "best")], verdicts: b.choices.map((c) => c.outcome), why: b.choices.find((c) => c.outcome === "best")?.consequence ?? "", notes: b.choices.map((c) => c.consequence) })),
    takeaway: s.objective,
  }));
  const judgment: Def[] = [0, 1].map((k) => {
    const items = T.sct.slice(k * 3, k * 3 + 3) as { id: string; vignette: string; hypothesis: string; new_information: string }[];
    return {
      id: `sct-${k + 1}`,
      title: k === 0 ? "Mood and sleep" : "Psychosis and substances",
      line: "Three new facts",
      setting: "Outpatient clinic",
      intro: items[0]!.vignette,
      steps: items.map((it, n) => {
        const h = it.id.split("").reduce((a, ch) => a + ch.charCodeAt(0), 0);
        const modal = (h % 5) - 2;
        return { pub: { n, kind: "scale" as const, ask: n === 0 ? "How does this change the odds?" : it.vignette, hypothesis: it.hypothesis, fact: it.new_information, labels: ["Much less likely", "Less likely", "No change", "More likely", "Much more likely"] as [string, string, string, string, string] }, right: [modal + 2], why: `Most of the expert panel chose "${["Much less likely", "Less likely", "No change", "More likely", "Much more likely"][modal + 2]}". A choice next to it gets part marks.` };
      }),
      takeaway: "A new fact moves a diagnosis up or down; it rarely settles it alone.",
    };
  });
  const ethics: Def[] = T.ethics.map((d: { id: string; tag: string; setting: string; vignette: string; law: string; options: { label: string; consequence: string; correct: boolean }[] }) => ({
    id: d.id,
    title: d.tag,
    line: d.setting,
    setting: d.setting,
    intro: d.vignette,
    steps: [pickKey(0, "What do you do?", d.options.map((o) => o.label), d.options.findIndex((o) => o.correct), d.options.find((o) => o.correct)?.consequence ?? "", d.options.map((o) => o.consequence), d.law)],
    takeaway: d.law,
  }));
  const landmark: Def[] = T.landmark.map((c: { id: string; title: string; domain: string; story: string; believedThen: string; understandNow: string; quiz: { question: string; options: string[]; correct: number; rationale: string }[] }) => ({
    id: c.id,
    title: c.title,
    line: c.domain,
    setting: c.domain,
    intro: c.story,
    steps: [{ pub: { n: 0, kind: "read", title: "What was believed, and what held up", body: `Then: ${c.believedThen}\n\nNow: ${c.understandNow}` }, right: [], why: "" }, ...c.quiz.map((q, i) => pickKey(i + 1, q.question, q.options, q.correct, q.rationale))],
    takeaway: c.understandNow,
  }));
  const osce: Def[] = T.osce.map((s: { id: string; title: string; task: string; duration_seconds: number; checklist: { item: string; weight: number }[] }) => ({
    id: s.id,
    title: s.title,
    line: `${Math.round(s.duration_seconds / 60)} minutes`,
    setting: "OSCE station",
    intro: s.task,
    steps: [{ pub: { n: 0, kind: "checklist", ask: "Say it out loud as if the patient is in front of you. Then tick what you covered.", items: s.checklist.map((c) => c.item), seconds: s.duration_seconds }, right: s.checklist.map((_, i) => i), weights: s.checklist.map((c) => c.weight), why: "Examiners give the most marks for the items worth two." }],
    takeaway: "Ask the hard questions plainly, then make a plan you can act on today.",
  }));
  const BUCKETS = ["presenting", "predisposing", "precipitating", "perpetuating", "protective", "distractor"];
  const formulation: Def[] = T.formulation.map((f: { id: string; title: string; prompt: string; hint: string; modelNarrative: string; factors: { id: string; text: string; bucket: string }[] }) => ({
    id: f.id,
    title: f.title,
    line: f.hint,
    setting: null,
    intro: f.prompt,
    steps: [{ pub: { n: 0, kind: "buckets", ask: "Put each factor where it belongs.", buckets: ["Presenting", "Predisposing", "Precipitating", "Perpetuating", "Protective", "Leave out"], items: f.factors.map((x) => x.text) }, right: f.factors.map((x) => Math.max(0, BUCKETS.indexOf(x.bucket))), why: f.modelNarrative }],
    takeaway: f.modelNarrative,
  }));
  const twoMinute: Def[] = (CONTENT.DAILY as DailyCase[]).slice(0, 2).map((c) => {
    const opts = shuffled([c.answer, ...c.differentials.slice(0, 3).map((d) => d.dx)], r);
    return { id: `tm-${c.id}`, title: c.setting, line: "Two minutes", setting: c.setting, intro: c.clues.slice(0, 4).join(" "), steps: [pickKey(0, "What is the most likely diagnosis?", opts.map(dxName), opts.indexOf(c.answer), c.overview, opts.map((o) => c.differentials.find((d) => d.dx === o)?.whyNot ?? null))], takeaway: c.pointer };
  });
  const termIds = Object.keys(TERMS);
  const sayItems: [string, string][] = [
    ["\"He keeps going off on tangents and never comes back to my question.\"", "tangentiality"],
    ["\"She answers after a very long pause, every time.\"", "latency"],
    ["\"He says the TV is talking about him.\"", "reference"],
    ["\"She hears her dead mother calling her name.\"", "auditory"],
  ];
  const sayIt: Def[] = [0, 1].map((k) => ({
    id: `say-${k + 1}`,
    title: k === 0 ? "Thought and speech" : "Perception and beliefs",
    line: "Two phrases",
    setting: null,
    intro: "Turn what the family says into the word for the case sheet.",
    steps: sayItems.slice(k * 2, k * 2 + 2).map(([q, id], n) => {
      const real = termIds.includes(id) ? id : termIds[n]!;
      const opts = shuffled([real, ...shuffled(termIds.filter((x) => x !== real), r).slice(0, 3)], r);
      return pickKey(n, q, opts.map((o) => TERMS[o]!.label), opts.indexOf(real), `${TERMS[real]!.label}: ${TERMS[real]!.def}`);
    }),
    takeaway: "Write what you observe in the shared words, so the next clinician reads the same picture.",
  }));
  const outOfDepth: Def[] = [
    {
      id: "ood-1",
      title: "A new patient on a Friday",
      line: "Refer or keep?",
      setting: "Counselling centre",
      intro: "A 19-year-old student booked for exam stress. In the room she says she has not slept for three nights, feels she has special powers, and has spent her whole term's fees online.",
      steps: [pickKey(0, "What do you do first?", ["Refer her to a psychiatrist today and tell her family, with her consent", "Start weekly sessions on exam stress", "Teach sleep hygiene and see her in a week", "Ask her to come back after the exams"], 0, "Little sleep, grandiose ideas and spending point to mania: a medical emergency outside counselling scope.", [null, "This treats the wrong problem while risk rises.", "Sleep hygiene does not treat mania.", "Waiting puts her at risk."])],
      takeaway: "Know the signs that need a doctor today: mania, psychosis, high suicide risk, delirium.",
    },
    {
      id: "ood-2",
      title: "The quiet one",
      line: "Refer or keep?",
      setting: "School counsellor",
      intro: "A 15-year-old has lost 8 kg in two months, faints in PE and says she is 'still too big'.",
      steps: [pickKey(0, "What do you do?", ["Ask for a same-week medical check and involve her parents", "Plan body-image work in school", "Keep it confidential as she asks", "Wait to see if she gains weight"], 0, "Rapid weight loss and fainting can mean medical danger in an eating disorder; a doctor must see her.", [null, "Useful later, but the body comes first.", "Safety overrides confidentiality here.", "Waiting can be dangerous."])],
      takeaway: "When the body is at risk, medicine comes first.",
    },
  ];
  const weak: Def[] = [0, 1].map((k) => {
    const qs = (CONTENT.PREP as { stem: string; options: string[]; answer: number; explanation: string; topic: string }[]).filter((q) => q.stem.length < 180).slice(k * 4, k * 4 + 4);
    return { id: `weak-${k + 1}`, title: k === 0 ? "Statistics you miss" : "Cognition you miss", line: `${qs.length} questions`, setting: null, intro: "Questions picked from what you have got wrong most.", steps: qs.map((q, n) => pickKey(n, q.stem, q.options, q.answer, q.explanation)), takeaway: "Come back tomorrow: what you miss now comes up again first." };
  });
  const mseTrainer: Def[] = (CONTENT.EXCERPTS as { id: string; who: string; place: string; note: string; findings: { q: string; a: string; o: string[]; why: string }[] }[]).slice(0, 2).map((e) => ({
    id: `mt-${e.id}`,
    title: e.who,
    line: e.place,
    setting: e.place,
    intro: e.note,
    steps: e.findings.slice(0, 3).map((f, n) => {
      const opts = shuffled([f.a, ...f.o], r);
      return pickKey(n, `"${f.q}"`, opts.map((o) => TERMS[o]?.label ?? o), opts.indexOf(f.a), f.why);
    }),
    takeaway: "Describe first, label second.",
  }));
  return { wwyd, judgment, ethics, landmark, osce, formulation, "two-minute": twoMinute, "say-it": sayIt, "out-of-depth": outOfDepth, "weak-spots": weak, "mse-trainer": mseTrainer };
}
let TOOLS: Record<P.ToolId, Def[]> | null = null;
const toolDefs = () => (TOOLS ??= buildTools());

type ToolRun = { tool: P.ToolId; def: Def; step: number; scores: number[] };
function grade(k: Key, answer: unknown): P.ToolReveal {
  const s = k.pub;
  if (s.kind === "read") return { score: 1, verdict: null, right: [], why: "", notes: null, more: null };
  if (s.kind === "pick") {
    const a = Number(answer);
    const v = k.verdicts?.[a] ?? (a === k.right[0] ? "best" : "harm");
    const score = v === "best" ? 1 : v === "ok" ? 0.5 : 0;
    return { score, verdict: k.verdicts ? v : null, right: k.right, why: k.why, notes: k.notes ?? null, more: k.more ?? null };
  }
  if (s.kind === "scale") {
    const a = Number(answer);
    const d = Math.abs(a - k.right[0]!);
    return { score: d === 0 ? 1 : d === 1 ? 0.5 : 0, verdict: null, right: k.right, why: k.why, notes: null, more: null };
  }
  if (s.kind === "checklist" || s.kind === "multi") {
    const ticked = Array.isArray(answer) ? (answer as number[]) : [];
    const w = k.weights ?? k.right.map(() => 1);
    const total = w.reduce((a, x) => a + x, 0);
    const got = ticked.reduce((a, i) => a + (k.right.includes(i) ? (w[i] ?? 1) : 0), 0);
    return { score: total ? got / total : 0, verdict: null, right: k.right, why: k.why, notes: null, more: null };
  }
  const placed = Array.isArray(answer) ? (answer as number[]) : [];
  const ok = k.right.filter((b, i) => placed[i] === b).length;
  return { score: k.right.length ? ok / k.right.length : 0, verdict: null, right: k.right, why: k.why, notes: null, more: null };
}
const isTool = (x: unknown): x is P.ToolId => typeof x === "string" && x in toolDefs();
const markOf = (tool: string, id: string, i: number): P.CaseMark => (doneItems.has(`${tool}:${id}`) ? "done" : started.has(`${tool}:${id}`) ? "started" : i % 3 === 1 ? "week" : "new");
const tool = {
  list(t: unknown): P.ToolList {
    if (!isTool(t)) throw new PlayError(404, "not_found", "That could not be found.");
    return { ok: true, items: toolDefs()[t].map((d, i) => ({ id: d.id, title: d.title, line: d.line, mark: markOf(t, d.id, i) })) };
  },
  deal(input: { tool?: string; item?: string }): P.ToolDeal {
    if (!isTool(input?.tool)) throw new PlayError(404, "not_found", "That could not be found.");
    const defs = toolDefs()[input.tool];
    const saved = input.item ? started.get(`${input.tool}:${input.item}`) : undefined;
    if (saved) {
      const run = held<ToolRun>(saved.token);
      return { ok: true, token: saved.token, case: { id: run.def.id, title: run.def.title, setting: run.def.setting, intro: run.def.intro, steps: run.def.steps.length, step: run.def.steps[run.step]!.pub } };
    }
    const def = defs.find((d) => d.id === input.item) ?? defs.find((d, i) => markOf(input.tool!, d.id, i) !== "done") ?? defs[0]!;
    const token = keep<ToolRun>({ tool: input.tool, def, step: 0, scores: [] });
    return { ok: true, token, case: { id: def.id, title: def.title, setting: def.setting, intro: def.intro, steps: def.steps.length, step: def.steps[0]!.pub } };
  },
  answer(input: { token?: string; step?: number; answer?: unknown }): P.ToolAnswer {
    const run = held<ToolRun>(input?.token);
    if (input.step !== run.step) throw FAIL();
    const k = run.def.steps[run.step]!;
    const reveal = grade(k, input.answer);
    const scores = k.pub.kind === "read" ? run.scores : [...run.scores, reveal.score];
    const nextStep = run.def.steps[run.step + 1];
    const key = `${run.tool}:${run.def.id}`;
    const token = swap(input.token, { ...run, step: run.step + 1, scores });
    if (nextStep) started.set(key, { title: run.def.title, step: `Step ${run.step + 2} of ${run.def.steps.length}`, token });
    else {
      started.delete(key);
      doneItems.add(key);
    }
    const score = scores.length ? scores.reduce((a, s) => a + s, 0) / scores.length : 1;
    return { ok: true, token, reveal, next: nextStep?.pub ?? null, end: nextStep ? null : { score: Math.round(score * 100), takeaway: run.def.takeaway, xp: Math.round(score * 15) + 5 } };
  },
};

/* ---------------------------------------------------------- case progress */
const cases = {
  progress(t: unknown): P.ProgressSnapshot {
    if (t === "ward") return { owner: "mock", rows: wardSaved().map((item) => ({ item, state: { step: "saved" }, at: Date.now() })) };
    if (t === "escape") return { owner: "mock", rows: escapeSaved().map(([item, token]) => ({ item, state: { token }, at: Date.now() })) };
    const rows = [...started.entries()].filter(([k]) => k.startsWith(`${t}:`)).map(([k, v]) => ({ item: k.split(":")[1]!, state: { step: v.step }, at: Date.now() }));
    return { owner: "mock", rows };
  },
  mark(): { ok: true } {
    return { ok: true };
  },
};

/* -------------------------------------------------------------------- hub */
const hub = {
  state(): P.HubState {
    const carry = [...started.entries()].pop();
    const ward = wardSaved()[0];
    const esc = escapeSaved()[0];
    return {
      ok: true,
      tags: { wwyd: { tag: "new", count: 2 }, detective: { tag: "week" }, landmark: { tag: "new" }, ethics: { tag: "done" }, ward: ward ? { tag: "started" } : { tag: "new" }, escape: esc ? { tag: "started" } : undefined, blitz: undefined },
      carryOn: carry ? { entry: carry[0].split(":")[0]!, item: carry[0].split(":")[1]!, title: carry[1].title, step: carry[1].step } : null,
      daily: { number: 47, done: doneItems.has("daily:today"), streak: 6 },
    };
  },
};

/* ------------------------------------------------------------------- prep */
type PQ = P.PrepQView & { answer: number; explanation: string; difficulty: number };
const PREP = CONTENT.PREP as PQ[];
const TOPICS = CONTENT.PREP_TOPICS as { subject: string; topics: { id: string; title: string; ids: string[] }[] }[];
const SUBJECTS = CONTENT.PREP_SUBJECTS as { id: string; title: string }[];
const answered = new Map<string, boolean>();
type Long = { id: string; subject: string; topic: string; marks: number; difficulty: number; question: string; plan: string[]; answer: string; keyPoints: string[]; pitfalls?: string[] };
const LONG = CONTENT.LONG as Long[];
const view = (q: PQ): P.PrepQView => ({ id: q.id, subject: q.subject, topic: q.topic, type: q.type, stem: q.stem, ...(q.passage ? { passage: q.passage } : {}), ...(q.statements ? { statements: q.statements } : {}), ...(q.lists ? { lists: q.lists } : {}), options: q.options });
const SET = 5;
const prep = {
  subjects(): P.PrepSubjects {
    return { ok: true, long: LONG.length, subjects: SUBJECTS.map((s) => { const qs = PREP.filter((q) => q.subject === s.id); return { id: s.id, title: s.title, questions: qs.length, answered: qs.filter((q) => answered.has(q.id)).length, right: qs.filter((q) => answered.get(q.id)).length }; }) };
  },
  topics(subject: unknown): P.PrepTopics {
    const s = SUBJECTS.find((x) => x.id === subject);
    const t = TOPICS.find((x) => x.subject === subject);
    if (!s || !t) throw new PlayError(404, "not_found", "That could not be found.");
    return {
      ok: true,
      subject: s,
      topics: t.topics.map((tp) => {
        const sets = Array.from({ length: Math.ceil(tp.ids.length / SET) }, (_, n) => tp.ids.slice(n * SET, n * SET + SET));
        return { id: tp.id, title: tp.title, questions: tp.ids.length, answered: tp.ids.filter((id) => answered.has(id)).length, sets: sets.map((ids, n) => ({ n, questions: ids.length, done: ids.every((id) => answered.has(id)), right: ids.every((id) => answered.has(id)) ? ids.filter((id) => answered.get(id)).length : null })) };
      }),
    };
  },
  set(input: { subject?: string; topic?: string; set?: number }): P.PrepSet {
    const tp = TOPICS.find((x) => x.subject === input?.subject)?.topics.find((x) => x.id === input?.topic);
    if (!tp) throw new PlayError(404, "not_found", "That could not be found.");
    const n = Number(input.set) || 0;
    const ids = tp.ids.slice(n * SET, n * SET + SET);
    return { ok: true, title: `${tp.title} · Set ${n + 1}`, questions: ids.map((id) => view(PREP.find((q) => q.id === id)!)) };
  },
  check(input: { id?: string; choice?: number }): P.PrepChecked {
    const q = PREP.find((x) => x.id === input?.id);
    if (!q) throw new PlayError(400, "bad_request", "Unknown question");
    const correct = input.choice === q.answer;
    answered.set(q.id, correct);
    return { id: q.id, answer: q.answer, explanation: q.explanation, learnHref: "/study", correct };
  },
  reveal(qid: unknown): P.PrepReveal {
    const q = PREP.find((x) => x.id === qid);
    if (!q) throw new PlayError(400, "bad_request", "Unknown question");
    return { id: q.id, answer: q.answer, explanation: q.explanation, learnHref: "/study" };
  },
  save(): { ok: true } {
    return { ok: true };
  },
  long(): P.LongList {
    return { ok: true, items: LONG.map(({ id, subject, topic, marks, difficulty, question, plan }) => ({ id, subject, topic, marks, difficulty, question, plan })) };
  },
  longAnswer(id: unknown): P.LongAnswer {
    const l = LONG.find((x) => x.id === id);
    if (!l) throw FAIL();
    return { ok: true, id: l.id, answer: l.answer, keyPoints: l.keyPoints, pitfalls: l.pitfalls ?? [] };
  },
};

/* ------------------------------------------------------------------ board */
const NAMES = ["Sana Khan", "Ananya Mehta", "Rohan Shah", "Meera Pillai", "Karan Desai", "Ishita Rao", "Dev Patel", "Fatima Ali", "Arjun Nair", "Neha Gupta"];
const board = {
  week(game: unknown): P.Board {
    const r = rng(String(game ?? "all").length * 97);
    const pts = NAMES.map(() => Math.round(200 + r() * 1800)).sort((a, b) => b - a);
    const rows = NAMES.map((name, i) => ({ rank: i + 1, name, points: pts[i]!, you: name === "Ananya Mehta" }));
    return { ok: true, title: game && game !== "all" ? String(game) : "All of Practise", week: "9 to 15 Nov", rows, you: rows.find((x) => x.you) ?? null };
  },
};

export const CASES: Record<string, Record<string, (...args: never[]) => unknown>> = {
  daily: { move: daily.move, rest: daily.rest, next: daily.next },
  detective: { deal: detective.deal, clue: detective.clue, clues: detective.clues, guess: detective.guess },
  tool: { list: tool.list, deal: tool.deal, answer: tool.answer },
  cases: { progress: cases.progress, mark: cases.mark },
  hub: { state: hub.state },
  prep: { subjects: prep.subjects, topics: prep.topics, set: prep.set, check: prep.check, reveal: prep.reveal, save: prep.save, long: prep.long, longAnswer: prep.longAnswer },
  board: { week: board.week },
};
export function resetCases() {
  dailyRows.clear();
  started.clear();
  answered.clear();
  doneItems.clear();
  doneItems.add("wwyd:sc-mania-1");
  doneItems.add("ethics:mha-advance-directive");
}
