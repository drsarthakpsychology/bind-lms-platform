/* The games' server side, for mock builds. Each answers what the website's action answers. */
import dict from "../data/dictionaries.json";
import type * as P from "../types";
import { BLITZ_MS, COMBO_STEPS, ESC_PENALTY_S, multiplier, SORT_MAX_TRIES } from "../types";
import { CONTENT, FAIL, held, keep, nextSeed, perm, PlayError, rng, shuffled, swap } from "./kit";

type Terms = Record<string, { label: string; domain: string; def: string }>;
const TERMS = dict.MSE_TERMS as Terms;
const DOMAIN_LABEL = Object.fromEntries((dict.MSE_DOMAINS as { id: string; label: string }[]).map((d) => [d.id, d.label]));

/* ------------------------------------------------------------------ blitz */
type BQ = { kind: "tf" | "pick"; prompt: string; options: string[]; answer: number; why: string; learn: string };
function blitzBank(seed: number): BQ[] {
  const r = rng(seed);
  const ids = shuffled(Object.keys(TERMS), r);
  const out: BQ[] = [];
  ids.forEach((id, i) => {
    const t = TERMS[id]!;
    if (i % 2 === 0) {
      const wrong = TERMS[ids[(i + 7) % ids.length]!]!;
      const truthy = r() < 0.5;
      out.push({ kind: "tf", prompt: `${t.label}: ${truthy ? t.def : wrong.def}`, options: ["True", "False"], answer: truthy ? 0 : 1, why: `${t.label}: ${t.def}`, learn: DOMAIN_LABEL[t.domain] ?? "Mental state" });
    } else {
      const others = shuffled(ids.filter((x) => x !== id), r).slice(0, 3);
      const opts = shuffled([id, ...others], r);
      out.push({ kind: "pick", prompt: `Which word fits: ${t.def}`, options: opts.map((o) => TERMS[o]!.label), answer: opts.indexOf(id), why: `${t.label}: ${t.def}`, learn: DOMAIN_LABEL[t.domain] ?? "Mental state" });
    }
  });
  return out;
}
type BlitzRun = { bank: BQ[]; start: number; state: P.BlitzRun; done: boolean };
const prompt = (q: BQ, n: number): P.BlitzPrompt => ({ n, kind: q.kind, prompt: q.prompt, options: q.options });
let blitzBest = 240;

const blitz = {
  start(): P.BlitzStart {
    const run: BlitzRun = { bank: blitzBank(nextSeed()), start: Date.now(), state: { answered: 0, correct: 0, score: 0, combo: 0, best: 0 }, done: false };
    return { ok: true, token: keep(run), question: prompt(run.bank[0]!, 0), msLeft: BLITZ_MS };
  },
  answer(token: unknown, n: unknown, choice: unknown): P.BlitzAnswer {
    const run = held<BlitzRun>(token);
    const left = BLITZ_MS - (Date.now() - run.start);
    if (run.done || left < -1500) throw new PlayError(400, "bad_request", "Time is up.");
    const q = run.bank[run.state.answered];
    if (!q || n !== run.state.answered) throw FAIL();
    const right = choice === q.answer;
    const s = run.state;
    const combo = right ? s.combo + 1 : 0;
    const gained = right ? 10 * multiplier(combo) : 0;
    const next = { answered: s.answered + 1, correct: s.correct + (right ? 1 : 0), score: s.score + gained, combo, best: Math.max(s.best, combo) };
    const levelUp = right && (COMBO_STEPS as readonly number[]).includes(combo);
    const nq = run.bank[next.answered];
    const t = swap(token, { ...run, state: next });
    return { ok: true, token: t, right, answer: q.answer, why: q.why, learn: { label: q.learn, href: "/study" }, gained, levelUp, state: next, next: nq && left > 0 ? prompt(nq, next.answered) : null, msLeft: Math.max(0, left) };
  },
  finish(token: unknown): P.BlitzFinish {
    const run = held<BlitzRun>(token);
    run.done = true;
    const before = blitzBest;
    blitzBest = Math.max(blitzBest, run.state.score);
    return { ok: true, state: run.state, xp: Math.min(30, 5 + run.state.correct), xpSaved: true, newBest: run.state.score > before, bests: { mine: before, cohort: { score: 410, name: "Sana K.", you: false, scope: "batch" }, stored: true } };
  },
};

/* ------------------------------------------------------------------- sort */
type Board = { id: string; title: string; difficulty: number; thresholds: string[] | null; module: string; topic: string; groupNames: string[]; groups: { dx: string; items: { id: string; text: string; why: string }[]; threshold: string | null }[] };
type SortRun = { board: Board; perm: number[]; tries: number; tier: P.SortTier; mode: "daily" | "practice"; done: P.SortReveal | null };
const sortRuns = new Map<string, SortRun>();
const BOARDS = CONTENT.BOARDS as Board[];
function sortReveal(r: SortRun, solved: boolean, score: number): P.SortReveal {
  return { solved, score, tiles: r.perm.map((idx) => ({ text: r.board.groups[Math.floor(idx / 4)]!.items[idx % 4]!.text, group: Math.floor(idx / 4), why: r.board.groups[Math.floor(idx / 4)]!.items[idx % 4]!.why })), thresholds: r.board.groups.map((g) => g.threshold), module: r.board.module, topic: r.board.topic };
}
const sort = {
  load(input: { mode?: string; tier?: string; boardId?: string }): P.SortLoad {
    const mode = input?.mode === "practice" ? "practice" : "daily";
    const tier: P.SortTier = input?.tier === "advanced" ? "advanced" : "basic";
    const pool = tier === "advanced" ? BOARDS.filter((b) => b.thresholds) : BOARDS;
    const board = input?.boardId ? BOARDS.find((b) => b.id === input.boardId) : mode === "daily" ? pool[0] : pool[1 + (nextSeed() % Math.max(1, pool.length - 1))];
    if (!board) throw new PlayError(400, "bad_request", "That board isn't available.");
    const key = `${mode}:${tier}:${board.id}`;
    const run = sortRuns.get(key) ?? { board, perm: perm(16, rng(board.id.length * 31 + (mode === "daily" ? 1 : nextSeed()))), tries: 0, tier, mode, done: null };
    sortRuns.set(key, run);
    return { ok: true, view: { mode, tier, boardId: board.id, title: board.title, difficulty: board.difficulty, groups: board.groupNames, tiles: run.perm.map((idx) => board.groups[Math.floor(idx / 4)]!.items[idx % 4]!.text), thresholds: tier === "advanced" ? board.thresholds : null, triesUsed: run.tries, done: run.done, cohort: mode === "daily" ? { played: 14, solvedPct: 64, scope: "batch" } : null, stored: true } };
  },
  check(input: { mode?: string; tier?: string; boardId?: string; placement?: unknown; picks?: unknown }): P.SortCheck {
    const mode = input?.mode === "practice" ? "practice" : "daily";
    const tier: P.SortTier = input?.tier === "advanced" ? "advanced" : "basic";
    const run = sortRuns.get(`${mode}:${tier}:${input?.boardId}`);
    if (!run) throw FAIL();
    if (run.done) throw new PlayError(400, "bad_request", "You've already finished this board.");
    const placement = Array.isArray(input.placement) ? (input.placement as unknown[]) : [];
    if (placement.length !== 16 || placement.some((p) => typeof p !== "number" || p < 0 || p > 3)) throw new PlayError(400, "bad_request", "Place all 16 tiles first.");
    const picks = Array.isArray(input.picks) ? (input.picks as (string | null)[]) : [];
    run.tries += 1;
    const ok = run.perm.map((idx, i) => Math.floor(idx / 4) === placement[i]);
    const per = [0, 1, 2, 3].map((g) => run.perm.filter((idx, i) => Math.floor(idx / 4) === g && ok[i]).length);
    const thresholdWrong = tier === "advanced" ? [0, 1, 2, 3].filter((g) => picks[g] !== run.board.groups[g]!.threshold) : [];
    const groupsDone = per.map((x, g) => x === 4 && !thresholdWrong.includes(g));
    const solved = groupsDone.every(Boolean);
    const over = solved || run.tries >= SORT_MAX_TRIES;
    const score = over ? (solved ? Math.max(25, 100 - (run.tries - 1) * 25) : 0) : 0;
    if (over) run.done = sortReveal(run, solved, score);
    return { ok: true, groupsDone, oneAway: per.map((x, g) => (x === 3 ? g : -1)).filter((g) => g >= 0), thresholdWrong, triesUsed: run.tries, done: run.done, xp: over ? Math.round(score / 5) : 0, xpSaved: true, cohort: null };
  },
};

/* --------------------------------------------------------------------- rx */
type RxKey = { pub: P.RxCase; correct: string[]; reveal: P.RxReveal; page: { id: string; name: string } };
const RX: RxKey[] = [
  {
    pub: { title: "Name the chain", kind: "chain", name: "Lithium", brands: ["Licab", "Lithosun"], steps: [["Mood stabiliser", "SSRI", "Antipsychotic", "Benzodiazepine"], ["Calms overactive signalling inside the cell", "Blocks serotonin reuptake", "Blocks D2 receptors", "Opens GABA-A channels"], ["Tremor and toxicity when levels rise", "Weight loss", "Tardive dyskinesia", "Dependence"], ["Blood level, kidneys and thyroid", "Liver only", "Blood count only", "Nothing routine"]] },
    correct: ["Mood stabiliser", "Calms overactive signalling inside the cell", "Tremor and toxicity when levels rise", "Blood level, kidneys and thyroid"],
    reveal: { kind: "chain", name: "Lithium", values: ["Mood stabiliser", "Calms overactive signalling inside the cell", "Tremor and toxicity when levels rise", "Blood level, kidneys and thyroid"], dose: "By blood level: 0.6 to 1.0 mmol/L", receptor: "Inside the cell (GSK-3, inositol)", line: "A narrow safe window: dehydration, ibuprofen and some blood pressure medicines push the level up." },
    page: { id: "lithium", name: "Lithium" },
  },
  {
    pub: { title: "Which medicine?", kind: "mystery", who: "Priya, 29", story: "Started a new medicine for schizophrenia two weeks ago. Now restless, can't sit still, paces the ward.", clues: ["A dopamine partial agonist", "Low risk of weight gain"], drug: "a second-generation antipsychotic", brand: "", options: [{ id: "aripiprazole", label: "Aripiprazole" }, { id: "olanzapine", label: "Olanzapine" }, { id: "clozapine", label: "Clozapine" }, { id: "haloperidol", label: "Haloperidol" }] },
    correct: ["aripiprazole"],
    reveal: { kind: "mystery", label: "Aripiprazole", why: "A partial agonist at D2 with akathisia as its common early side effect, and little weight gain.", not: "Olanzapine would sedate and raise appetite.", receptor: "D2 partial agonist", drug: "aripiprazole" },
    page: { id: "aripiprazole", name: "Aripiprazole" },
  },
  {
    pub: { title: "Risky mix", kind: "puzzle", a: "Sertraline", b: "Tramadol", aBrands: ["Serta"], bBrands: ["Ultracet"], story: "A woman on sertraline is given tramadol for back pain. A day later she is sweating, shaky, with jerking muscles and a fast heart.", options: [{ id: "ss", label: "Serotonin syndrome" }, { id: "nms", label: "Neuroleptic malignant syndrome" }, { id: "withdrawal", label: "Alcohol withdrawal" }, { id: "allergy", label: "An allergic reaction" }] },
    correct: ["ss"],
    reveal: { kind: "puzzle", label: "Serotonin syndrome", why: "Tramadol adds serotonin on top of an SSRI. Clonus, sweating and a fast heart within a day point to serotonin toxicity.", not: "NMS builds over days with rigidity, after dopamine blockers.", journey: null, receptor: null, qt: false },
    page: { id: "sertraline", name: "Sertraline" },
  },
  {
    pub: { title: "Check the prescription", kind: "review", who: "Mr Rao, 70", story: "Low mood after his wife's death. His new prescription is below. What is the main problem?", rx: ["Amitriptyline 75 mg at night", "Tamsulosin 0.4 mg", "Aspirin 75 mg"], options: [{ id: "tca", label: "Amitriptyline: falls, confusion and urine retention at his age" }, { id: "asp", label: "Aspirin should be stopped" }, { id: "dose", label: "The amitriptyline dose is too low" }, { id: "none", label: "Nothing, it is safe" }] },
    correct: ["tca"],
    reveal: { kind: "review", answer: "Amitriptyline is a poor choice at 70 with an enlarged prostate", why: "Its anticholinergic effects cause confusion, falls and urine retention; an SSRI such as sertraline is safer.", not: "Low-dose aspirin is fine here." },
    page: { id: "sertraline", name: "Sertraline" },
  },
];
type RxRun = { order: number[]; i: number; picks: string[]; scores: number[] };
const rx = {
  deal(_mode: unknown): P.RxDeal {
    const order = perm(RX.length, rng(nextSeed()));
    return { ok: true, token: keep<RxRun>({ order, i: 0, picks: [], scores: [] }), run: "mock", cases: order.map((k) => RX[k]!.pub) };
  },
  pick(input: { token?: string; value?: string }): P.RxPick {
    const run = held<RxRun>(input?.token);
    const key = RX[run.order[run.i]!];
    if (!key) throw FAIL();
    const picks = [...run.picks, String(input.value ?? "")];
    if (key.pub.kind === "chain" && picks.length < key.correct.length) {
      const k = picks.length - 1;
      return { ok: true, token: swap(input.token, { ...run, picks }), step: { right: picks[k] === key.correct[k], correct: key.correct[k]! } };
    }
    const parts = key.correct.map((c, k) => ({ ok: picks[k] === c, chosen: picks[k] ?? null, correct: c }));
    const score = parts.filter((p) => p.ok).length / parts.length;
    const answered: P.RxAnswered = { graded: { score, parts }, answer: key.correct[key.correct.length - 1]!, reveal: key.reveal, learn: [{ id: key.page.id, name: key.page.name }], pages: [key.page] };
    return { ok: true, token: swap(input.token, { ...run, i: run.i + 1, picks: [], scores: [...run.scores, score] }), answered };
  },
  finish(token: unknown): { ok: true; xp: number } {
    const run = held<RxRun>(token);
    return { ok: true, xp: Math.min(40, 5 + Math.round(run.scores.reduce((a, s) => a + s, 0) * 2)) };
  },
};

/* -------------------------------------------------------------------- mse */
type Finding = { q: string; a: string; o: string[]; close?: string[]; also?: string[]; why: string };
type Excerpt = { id: string; level: number; who: string; place: string; lines: ["D" | "P" | "R", string][]; note: string; findings: Finding[] };
type MseRun = { queue: Excerpt[]; e: number; f: number; options: string[][]; scores: number[] };
const EXCERPTS = CONTENT.EXCERPTS as Excerpt[];
function pubExcerpt(e: Excerpt, options: string[][]): P.MseExcerpt {
  return { level: e.level as P.MseLevel, again: false, who: e.who, place: e.place, lines: e.lines, note: e.note, quotes: e.findings.map((f) => f.q), options };
}
const optionsFor = (e: Excerpt, r: () => number) => e.findings.map((f) => shuffled([f.a, ...f.o], r));
const mse = {
  deal(level: unknown): P.MseDeal {
    const lv = level === 2 || level === 3 ? level : 1;
    const r = rng(nextSeed());
    const queue = [...EXCERPTS.filter((e) => e.level === lv), ...EXCERPTS.filter((e) => e.level !== lv)].slice(0, 3);
    const options = optionsFor(queue[0]!, r);
    return { ok: true, token: keep<MseRun>({ queue, e: 0, f: 0, options, scores: [] }), run: "mock", excerpt: pubExcerpt(queue[0]!, options) };
  },
  tag(input: { token?: string; domain?: string; term?: string }): P.MseTag {
    const run = held<MseRun>(input?.token);
    const ex = run.queue[run.e]!;
    const f = ex.findings[run.f];
    if (!f) throw FAIL();
    const answerDomain = TERMS[f.a]?.domain ?? "appearance";
    const domainOk = input.domain === answerDomain || (f.also ?? []).includes(String(input.domain));
    const termOk = input.term === f.a;
    const close = !termOk && (f.close ?? []).includes(String(input.term));
    const score = termOk ? (domainOk ? 1 : 0.75) : close ? 0.5 : domainOk ? 0.25 : 0;
    const picked = TERMS[String(input.term)];
    const reveal: P.MseReveal = { score, domainOk, termOk, close, answer: TERMS[f.a]?.label ?? f.a, answerDomain, why: f.why, whyNot: !termOk && picked ? `${picked.label}: ${picked.def}` : null };
    const scores = [...run.scores, score];
    if (run.f + 1 < ex.findings.length) return { ok: true, token: swap(input.token, { ...run, f: run.f + 1, scores }), reveal };
    const excerptScore = scores.slice(-ex.findings.length).reduce((a, s) => a + s, 0) / ex.findings.length;
    const nextEx = run.queue[run.e + 1];
    const options = nextEx ? optionsFor(nextEx, rng(nextSeed())) : [];
    return { ok: true, token: swap(input.token, { ...run, e: run.e + 1, f: 0, options, scores }), reveal, excerptScore, next: nextEx ? pubExcerpt(nextEx, options) : null };
  },
};

/* ------------------------------------------------------------------- ward */
type Vars = P.WardVars;
type Cond = { flag?: string; notFlag?: string; v?: keyof Vars; gte?: number; lte?: number };
type WOpt = { id: string; text: string; q: P.WardQuality; fx?: Partial<Vars>; set?: string[]; why: string };
type Decision = { id: string; kind: P.WardKind; prompt: string; when?: Cond; skill: string; options: WOpt[] };
type Campaign = { id: string; title: string; patient: string; place: string; blurb: string; note?: string; start: Vars; tags?: { level?: number }; chapters: { id: string; title: string; beats: { text: string; when?: Cond }[]; decisions: Decision[] }[]; endings: { min: number; title: string; text: string }[] };
type WState = { chapter: number; queue: string[]; vars: Vars; flags: string[]; log: { chapter: number; decision: string; option: string; q: P.WardQuality }[]; done: boolean };
const CAMPAIGNS = CONTENT.CAMPAIGNS as Campaign[];
const clamp = (x: number) => Math.max(0, Math.min(100, Math.round(x)));
const holds = (c: Cond | undefined, st: Pick<WState, "vars" | "flags">) => !c || ((!c.flag || st.flags.includes(c.flag)) && (!c.notFlag || !st.flags.includes(c.notFlag)) && (!c.v || ((c.gte === undefined || st.vars[c.v] >= c.gte) && (c.lte === undefined || st.vars[c.v] <= c.lte))));
function dropBlocked(c: Campaign, ch: number, ids: string[], st: Pick<WState, "vars" | "flags">) {
  let i = 0;
  while (i < ids.length && !holds(c.chapters[ch]?.decisions.find((d) => d.id === ids[i])?.when, st)) i++;
  return ids.slice(i);
}
const queueFor = (c: Campaign, ch: number, st: Pick<WState, "vars" | "flags">) => (c.chapters[ch] ? dropBlocked(c, ch, c.chapters[ch]!.decisions.map((d) => d.id), st) : []);
const decisionOf = (c: Campaign, st: WState) => (st.done ? null : (c.chapters[st.chapter]?.decisions.find((d) => d.id === st.queue[0]) ?? null));
const beatsOf = (c: Campaign, st: WState, ch = st.chapter) => (c.chapters[ch]?.beats ?? []).filter((b) => holds(b.when, st)).map((b) => b.text);
function choose(c: Campaign, st: WState, optionId: string): WState {
  const d = decisionOf(c, st);
  const o = d?.options.find((x) => x.id === optionId);
  if (!d || !o) return st;
  const vars = { ...st.vars };
  for (const [k, v] of Object.entries(o.fx ?? {}) as [keyof Vars, number][]) vars[k] = clamp(vars[k] + v);
  const flags = [...new Set([...st.flags, ...(o.set ?? [])])];
  const log = [...st.log, { chapter: st.chapter, decision: d.id, option: o.id, q: o.q }];
  let chapter = st.chapter;
  let queue = dropBlocked(c, chapter, st.queue.slice(1), { vars, flags });
  let done = false;
  while (!queue.length && !done) {
    chapter += 1;
    if (chapter >= c.chapters.length) {
      done = true;
      chapter = c.chapters.length - 1;
      break;
    }
    queue = queueFor(c, chapter, { vars, flags });
  }
  return { chapter, queue, vars, flags, log, done };
}
const Q_OUT: Record<P.WardQuality, number> = { best: 1, ok: 0.6, poor: 0.25, harm: 0 };
function outcome(st: WState) {
  const v = st.vars;
  const dials = (100 - v.risk) * 0.3 + v.trust * 0.2 + v.insight * 0.15 + v.family * 0.15 + v.adherence * 0.2;
  const q = st.log.length ? st.log.reduce((a, l) => a + Q_OUT[l.q], 0) / st.log.length : 0;
  return Math.round(dials * 0.6 + q * 100 * 0.4);
}
function scene(c: Campaign, st: WState): P.WardScene {
  const d = decisionOf(c, st);
  return { title: c.title, patient: c.patient, note: c.note ?? null, sessions: c.chapters.length, chapter: st.chapter, chapterTitle: c.chapters[st.chapter]?.title ?? "", beats: beatsOf(c, st), decision: d ? { kind: d.kind, prompt: d.prompt, options: d.options.map((o) => ({ id: o.id, text: o.text })) } : null, vars: { ...st.vars }, step: st.log.length, done: st.done };
}
function endOf(c: Campaign, st: WState): P.WardEnd {
  const s = outcome(st);
  const e = [...c.endings].sort((a, b) => b.min - a.min).find((x) => s >= x.min) ?? c.endings[c.endings.length - 1]!;
  const best = (d: Decision) => (d.options.find((o) => o.q === "best") ?? d.options[0]!).text;
  return {
    title: e.title,
    text: e.text,
    score: s,
    vars: { ...st.vars },
    log: st.log.flatMap((l) => {
      const d = c.chapters[l.chapter]?.decisions.find((x) => x.id === l.decision);
      const o = d?.options.find((x) => x.id === l.option);
      return d && o ? [{ chapter: l.chapter, kind: d.kind, prompt: d.prompt, text: o.text, q: l.q, best: l.q === "best" ? null : best(d) }] : [];
    }),
  };
}
type WardRun = { c: string; st: WState };
const saved = new Map<string, string>();
export const wardCampaigns = (): P.WardCampaign[] => CAMPAIGNS.map((c) => ({ id: c.id, title: c.title, patient: c.patient, place: c.place, blurb: c.blurb, sessions: c.chapters.length, level: c.tags?.level ?? 0 }));
const ward = {
  start(campaign: unknown): P.WardSolo {
    const c = CAMPAIGNS.find((x) => x.id === campaign);
    if (!c) throw FAIL();
    const base = { vars: { ...c.start }, flags: [] as string[] };
    const st: WState = { chapter: 0, queue: queueFor(c, 0, base), ...base, log: [], done: false };
    const token = keep<WardRun>({ c: c.id, st });
    saved.set(c.id, token);
    return { ok: true, token, scene: scene(c, st) };
  },
  resume(input: { token?: string; campaign?: string }): P.WardSolo {
    const token = input?.token ?? (input?.campaign ? saved.get(input.campaign) : undefined);
    const run = held<WardRun>(token);
    const c = CAMPAIGNS.find((x) => x.id === run.c)!;
    return { ok: true, token: token!, scene: scene(c, run.st), end: run.st.done ? endOf(c, run.st) : null };
  },
  pick(input: { token?: string; option?: string }): P.WardSolo {
    const run = held<WardRun>(input?.token);
    const c = CAMPAIGNS.find((x) => x.id === run.c)!;
    const before = run.st;
    const d = decisionOf(c, before);
    const o = d?.options.find((x) => x.id === input.option);
    if (!d || !o) throw FAIL();
    const after = choose(c, before, o.id);
    const best = d.options.find((x) => x.q === "best") ?? d.options[0]!;
    const reveal: P.WardReveal = { chapter: before.chapter, chapterTitle: c.chapters[before.chapter]?.title ?? "", beats: beatsOf(c, before), kind: d.kind, skill: d.skill, letter: "ABCDEF"[d.options.indexOf(o)] ?? "A", text: o.text, q: o.q, why: o.why, best: o.q === "best" ? null : { text: best.text, why: best.why }, before: { ...before.vars }, after: { ...after.vars }, voters: null };
    const token = swap(input.token, { c: c.id, st: after });
    if (after.done) saved.delete(c.id);
    else saved.set(c.id, token);
    const end = after.done ? endOf(c, after) : null;
    return { ok: true, token, scene: scene(c, after), reveal, end, ...(end ? { xp: 10 + Math.round(end.score / 5), saved: true } : {}) };
  },
};
export const wardSaved = () => [...saved.keys()];

/* ----------------------------------------------------------------- escape */
type Puzzle = { id: string; stage: P.EscStage; kind: "pick" | "multi" | "order" | "number"; prompt: string; options?: string[]; items?: string[]; min?: number; max?: number; unit?: string; answer?: number | number[]; hint: string; why: string; unlock: string; skill: string };
type Room = { id: string; title: string; place: string; patient: string; intro: string; outro: string; puzzles: Puzzle[] };
type EscRun = { room: Room; st: P.EscState; start: number; orders: number[][] };
const ROOMS = CONTENT.ROOMS as Room[];
export const escapeRooms = (): P.EscRoomCard[] => ROOMS.map((r) => ({ id: r.id, title: r.title, place: r.place, patient: r.patient, intro: r.intro, doors: r.puzzles.length }));
function escView(run: EscRun): P.EscView {
  const r = run.room;
  const p = run.st.done ? null : r.puzzles[run.st.stage];
  let door: P.EscDoor | null = null;
  if (p) {
    if (p.kind === "order") door = { id: p.id, stage: p.stage, kind: "order", prompt: p.prompt, items: run.orders[run.st.stage]!.map((i) => p.items![i]!) };
    else if (p.kind === "number") door = { id: p.id, stage: p.stage, kind: "number", prompt: p.prompt, min: p.min ?? 0, max: p.max ?? 100, unit: p.unit };
    else door = { id: p.id, stage: p.stage, kind: p.kind, prompt: p.prompt, options: p.options! };
  }
  return { id: r.id, title: r.title, place: r.place, patient: r.patient, intro: r.intro, doors: r.puzzles.length, stages: r.puzzles.map((x) => x.stage), door, hint: p && (run.st.tries[run.st.stage] ?? 0) >= 2 ? p.hint : null, opened: r.puzzles.slice(0, run.st.stage).map((x) => ({ stage: x.stage, why: x.why, unlock: x.unlock, skill: x.skill })), outro: run.st.done ? r.outro : null };
}
function escRight(p: Puzzle, raw: string, order: number[] | undefined): boolean {
  const nums = raw.split(",").map((x) => Number(x.trim()));
  if (p.kind === "pick") return nums[0] === p.answer;
  if (p.kind === "multi") return [...nums].sort((a, b) => a - b).join(",") === [...(p.answer as number[])].sort((a, b) => a - b).join(",");
  if (p.kind === "order") return nums.length === p.items!.length && nums.every((pos, k) => order![pos] === k);
  const a = p.answer as number[];
  return nums[0]! >= a[0]! && nums[0]! <= (a[1] ?? a[0]!);
}
const escSaved = new Map<string, string>();
const escape = {
  start(room: unknown): P.EscResult {
    const r = ROOMS.find((x) => x.id === room);
    if (!r) throw FAIL();
    const rr = rng(nextSeed());
    const run: EscRun = { room: r, st: { room: r.id, stage: 0, wrong: 0, tries: r.puzzles.map(() => 0), log: [], done: false }, start: Date.now(), orders: r.puzzles.map((p) => (p.kind === "order" ? perm(p.items!.length, rr) : [])) };
    const token = keep(run);
    escSaved.set(r.id, token);
    return { ok: true, token, view: escView(run), state: run.st, now: Date.now() };
  },
  resume(token: unknown): P.EscResult {
    const run = held<EscRun>(token);
    return { ok: true, token: String(token), view: escView(run), state: run.st, now: Date.now() };
  },
  answer(input: { token?: string; stage?: number; answer?: string }): P.EscResult {
    const run = held<EscRun>(input?.token);
    if (run.st.done || input.stage !== run.st.stage) throw FAIL();
    const p = run.room.puzzles[run.st.stage]!;
    const right = escRight(p, String(input.answer ?? ""), run.orders[run.st.stage]);
    const tries = [...run.st.tries];
    tries[run.st.stage] = (tries[run.st.stage] ?? 0) + 1;
    const stage = right ? run.st.stage + 1 : run.st.stage;
    const done = stage >= run.room.puzzles.length;
    const st: P.EscState = { ...run.st, stage: done ? run.room.puzzles.length : stage, wrong: run.st.wrong + (right ? 0 : 1), tries, log: [...run.st.log, { stage: run.st.stage, name: "You", ok: right, at: new Date().toISOString() }], done };
    const next = { ...run, st };
    const token = swap(input.token, next);
    if (done) escSaved.delete(run.room.id);
    else escSaved.set(run.room.id, token);
    const ms = Date.now() - run.start + st.wrong * ESC_PENALTY_S * 1000;
    return { ok: true, token, view: escView(next), state: st, now: Date.now(), right, ...(done ? { ms, xp: Math.max(10, 40 - st.wrong * 3), elapsed: ms } : {}) };
  },
};
export const escapeSaved = () => [...escSaved.entries()];

/* ------------------------------------------------------------------- duel */
type DuelItem = { id: string; topic: string; vignette: string; options: string[]; optionNames: string[]; features: string[]; why: string };
type DuelRun = { items: DuelItem[]; i: number; o: number[][]; f: number[][]; you: number; bot: number; r: () => number; startedAt: number };
const DUEL = CONTENT.DUEL as DuelItem[];
const duelRound = (run: DuelRun): P.DuelRound => {
  const it = run.items[run.i]!;
  return { n: run.i, topic: it.topic, vignette: it.vignette, options: run.o[run.i]!.map((k) => it.optionNames[k]!), features: run.f[run.i]!.map((k) => it.features[k]!) };
};
const duel = {
  start(_level: unknown): P.DuelStart {
    const r = rng(nextSeed());
    const items = shuffled(DUEL, r).slice(0, 5);
    const run: DuelRun = { items, i: 0, o: items.map(() => perm(4, r)), f: items.map(() => perm(4, r)), you: 0, bot: 0, r, startedAt: Date.now() };
    return { ok: true, token: keep(run), rounds: 5, round: duelRound(run), bot: { name: "Dr Bot" } };
  },
  answer(input: { token?: string; round?: number; dx?: number; feature?: number }): P.DuelAnswer {
    const run = held<DuelRun>(input?.token);
    if (input.round !== run.i) throw FAIL();
    const o = run.o[run.i]!;
    const f = run.f[run.i]!;
    const dxOk = o[Number(input.dx)] === 0;
    const featureOk = dxOk && f[Number(input.feature)] === 0;
    const points = (dxOk ? 100 : 0) + (featureOk ? 50 : 0);
    const bDx = run.r() < 0.6;
    const bF = bDx && run.r() < 0.6;
    const bot = { dxOk: bDx, featureOk: bF, points: (bDx ? 100 : 0) + (bF ? 50 : 0), ms: 4000 + Math.floor(run.r() * 9000) };
    const you = run.you + points;
    const botScore = run.bot + bot.points;
    const it = run.items[run.i]!;
    const next = { ...run, i: run.i + 1, you, bot: botScore };
    const token = swap(input.token, next);
    const last = next.i >= run.items.length;
    return { ok: true, token, dxOk, featureOk, points, answer: { dx: o.indexOf(0), feature: f.indexOf(0) }, why: it.why, bot, score: { you, bot: botScore }, next: last ? null : duelRound(next), end: last ? { won: you === botScore ? "draw" : you > botScore, xp: you > botScore ? 20 : 5 } : null };
  },
};

/* --------------------------------------------------------------- comorbid */
type CoDx = { id: string; name: string; short: string; core: string[]; must?: string[]; symptoms: string[]; need: number; rule: string };
type CoSym = { id: string; label: string; line: string };
type CoRule = CoSym & { against: string[] };
const CO = CONTENT.COMORBID as { symptoms: CoSym[]; ruleOuts: CoRule[]; clear: CoSym; diagnoses: CoDx[] };
type Seat = { dx: CoDx; hand: P.CoCard[]; built: string[]; blocked: string | null };
type CoRun = { seats: [Seat, Seat]; deck: P.CoCard[]; log: P.CoView["log"]; winner: P.CoView["winner"]; moves: number; level: number };
let uid = 0;
const card = (kind: P.CoCard["kind"], id: string): P.CoCard => {
  const src = kind === "sym" ? CO.symptoms.find((s) => s.id === id) : kind === "rule" ? CO.ruleOuts.find((s) => s.id === id) : CO.clear;
  return { uid: `c${++uid}`, kind, id, label: src?.label ?? id, line: src?.line ?? "" };
};
const symLabel = (id: string) => CO.symptoms.find((s) => s.id === id)?.label ?? id;
const ruleLabel = (id: string) => CO.ruleOuts.find((s) => s.id === id)?.label ?? id;
const wins = (s: Seat) => s.built.length >= s.dx.need && s.dx.core.some((x) => s.built.includes(x)) && (s.dx.must ?? []).every((x) => s.built.includes(x));
function coView(run: CoRun, token: string): P.CoView {
  const [me, rv] = run.seats;
  return {
    ok: true,
    token,
    you: { dx: { id: me.dx.id, name: me.dx.name, rule: me.dx.rule, need: me.dx.need }, hand: me.hand, built: me.built.map((id) => ({ id, label: symLabel(id) })), blocked: me.blocked ? { id: me.blocked, label: ruleLabel(me.blocked) } : null },
    rival: { name: "Dr Bot", built: rv.built.map((id) => ({ id, label: symLabel(id) })), blocked: rv.blocked ? { id: rv.blocked, label: ruleLabel(rv.blocked) } : null, hand: rv.hand.length },
    turn: "you",
    deck: run.deck.length,
    log: run.log.slice(-6),
    winner: run.winner,
    rivalDx: run.winner ? { id: rv.dx.id, name: rv.dx.name } : null,
    ...(run.winner ? { xp: run.winner === "you" ? 15 : 5 } : {}),
  };
}
function apply(run: CoRun, who: 0 | 1, c: P.CoCard, action: "play" | "swap"): { ok: boolean; text: string } {
  const me = run.seats[who];
  const rv = run.seats[who === 0 ? 1 : 0];
  me.hand = me.hand.filter((x) => x.uid !== c.uid);
  const draw = () => {
    const d = run.deck.shift();
    if (d) me.hand.push(d);
  };
  if (action === "swap") {
    run.deck.push(c);
    draw();
    return { ok: true, text: `swapped ${who === 0 ? c.label : "a card"}` };
  }
  let res: { ok: boolean; text: string };
  if (c.kind === "sym") {
    if (me.blocked) res = { ok: false, text: `can't build: blocked by ${ruleLabel(me.blocked)}` };
    else if (!me.dx.symptoms.includes(c.id)) res = { ok: false, text: `${c.label} is not part of ${who === 0 ? me.dx.short : "their diagnosis"}` };
    else if (me.built.includes(c.id)) res = { ok: false, text: `${c.label} is already built` };
    else {
      me.built.push(c.id);
      res = { ok: true, text: `built ${c.label}` };
    }
  } else if (c.kind === "rule") {
    const r = CO.ruleOuts.find((x) => x.id === c.id)!;
    if (rv.blocked) res = { ok: false, text: "the rival is already blocked" };
    else if (!r.against.includes(rv.dx.id)) res = { ok: false, text: `${c.label} does not rule out the rival's diagnosis` };
    else {
      rv.blocked = c.id;
      res = { ok: true, text: `blocked the rival with ${c.label}` };
    }
  } else if (me.blocked) {
    me.blocked = null;
    res = { ok: true, text: "cleared the rule-out" };
  } else res = { ok: false, text: "nothing to clear" };
  draw();
  return res;
}
function botMove(run: CoRun) {
  const b = run.seats[1];
  const good = b.hand.find((c) => (c.kind === "sym" && !b.blocked && b.dx.symptoms.includes(c.id) && !b.built.includes(c.id)) || (c.kind === "clear" && b.blocked) || (c.kind === "rule" && !run.seats[0].blocked && CO.ruleOuts.find((r) => r.id === c.id)?.against.includes(run.seats[0].dx.id)));
  const c = good ?? b.hand[0];
  if (!c) return;
  const r = apply(run, 1, c, good ? "play" : "swap");
  run.log.push({ who: "rival", text: r.text, ok: r.ok });
}
const comorbid = {
  deal(level: unknown): P.CoView {
    const r = rng(nextSeed());
    const dx = shuffled(CO.diagnoses, r);
    const a = dx[0]!;
    const b = dx.find((x) => x.id !== a.id && Math.abs(x.need - a.need) <= 1) ?? dx[1]!;
    const syms = [...a.symptoms, ...b.symptoms, ...shuffled(CO.symptoms.map((s) => s.id), r).slice(0, 6)];
    const rules = CO.ruleOuts.filter((x) => x.against.includes(a.id) || x.against.includes(b.id)).map((x) => x.id);
    const deck = shuffled([...syms.map((s) => card("sym", s)), ...rules.map((x) => card("rule", x)), card("clear", "normaltest"), card("clear", "normaltest")], r);
    const run: CoRun = { seats: [{ dx: a, hand: deck.splice(0, 5), built: [], blocked: null }, { dx: b, hand: deck.splice(0, 5), built: [], blocked: null }], deck, log: [], winner: null, moves: 0, level: Number(level) || 1 };
    return coView(run, keep(run));
  },
  move(input: { token?: string; uid?: string; action?: string }): P.CoView {
    const run = held<CoRun>(input?.token);
    if (run.winner) throw FAIL();
    const c = run.seats[0].hand.find((x) => x.uid === input.uid);
    if (!c) throw FAIL();
    const res = apply(run, 0, c, input.action === "swap" ? "swap" : "play");
    run.log.push({ who: "you", text: res.text, ok: res.ok });
    run.moves += 1;
    if (wins(run.seats[0])) run.winner = "you";
    else {
      botMove(run);
      if (wins(run.seats[1])) run.winner = "rival";
      else if (run.moves >= 30 || (!run.deck.length && !run.seats[0].hand.length)) run.winner = "draw";
    }
    return coView(run, swap(input.token, run));
  },
};

/* ------------------------------------------------------------------ match */
type MatchRun = { ids: string[]; rights: number[]; done: number[]; tries: number };
const match = {
  deal(): P.MatchDeal {
    const r = rng(nextSeed());
    const ids = shuffled(Object.keys(TERMS), r).slice(0, 5);
    const rights = perm(ids.length, r);
    return { ok: true, token: keep<MatchRun>({ ids, rights, done: [], tries: 0 }), title: "Mental state words", lefts: ids.map((i) => TERMS[i]!.label), rights: rights.map((k) => TERMS[ids[k]!]!.def) };
  },
  pick(input: { token?: string; left?: number; right?: number }): P.MatchPick {
    const run = held<MatchRun>(input?.token);
    const l = Number(input.left);
    const ok = run.rights[Number(input.right)] === l && !run.done.includes(l);
    const done = ok ? [...run.done, l] : run.done;
    const tries = run.tries + 1;
    const cleared = done.length === run.ids.length;
    return { ok: true, token: swap(input.token, { ...run, done, tries }), right: ok, done, cleared, tries, ...(cleared ? { xp: Math.max(5, 20 - (tries - run.ids.length) * 2) } : {}) };
  },
};

export function resetGames() {
  sortRuns.clear();
  saved.clear();
  escSaved.clear();
  blitzBest = 240;
}

/** game -> action -> handler(args) */
export const GAMES: Record<string, Record<string, (...args: never[]) => unknown>> = {
  blitz: { start: blitz.start, answer: blitz.answer, finish: blitz.finish },
  sort: { load: sort.load, check: sort.check },
  rx: { deal: rx.deal, pick: rx.pick, finish: rx.finish },
  mse: { deal: mse.deal, tag: mse.tag },
  ward: { start: ward.start, resume: ward.resume, pick: ward.pick, campaigns: () => ({ ok: true, campaigns: wardCampaigns() }) },
  escape: { start: escape.start, resume: escape.resume, answer: escape.answer, rooms: () => ({ ok: true, rooms: escapeRooms() }) },
  duel: { start: duel.start, answer: duel.answer },
  comorbid: { deal: comorbid.deal, move: comorbid.move },
  match: { deal: match.deal, pick: match.pick },
};
