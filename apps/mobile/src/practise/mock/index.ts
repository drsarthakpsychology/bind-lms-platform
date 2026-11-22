/**
 * The mock play server (mock builds only): POST /play/:game/:action and the
 * Library routes, answered with the website's shapes from sampled real
 * content. The answer keys live here, never in a screen. Loaded by the app's
 * mock server only when EXPO_PUBLIC_API_MODE is "mock", so a live build does
 * not carry this file or its content.
 */
import type { RawResponse } from "@/api/client";
import type { MedDiagram, MedicineList, MedicinePage, MedSection, ReferenceHome } from "../contract";
import { DOSE_NOTE, SECTION_NAMES, shownSections, splitTell, washoutLine, type HalfLife, type Med as LMed, type Mechanism, type MedVisual } from "@/library/meds";
import { CASES, resetCases } from "./cases";
import * as R from "./routes";
import { GAMES, resetGames } from "./games";
import { CONTENT, PlayError, resetSeeds } from "./kit";

const ok = <T,>(data: T): RawResponse => ({ status: 200, json: { ok: true, data } });
const fail = (status: number, code: string, message: string): RawResponse => ({ status, json: { ok: false, error: { code, message } } });

const HANDLERS: Record<string, Record<string, (...args: never[]) => unknown>> = {
  ...GAMES,
  ...CASES,
  league: R.league as unknown as Record<string, (...args: never[]) => unknown>,
  prep: { ...CASES.prep, save: (i: { id?: string; saved?: boolean }) => (i?.id ? (R.toggleSaved(i.id, !!i.saved), { ok: true }) : { ok: false }) },
};

type Med = LMed;
type MedSample = { med: Med; mechanism: Mechanism | null; visuals: MedVisual[]; halfLife: HalfLife | null };
const MEDS = CONTENT.MEDS_SAMPLE as MedSample[];
const GROUPS = ["Antidepressants", "Antipsychotics", "Mood stabilisers", "Anxiety and sleep", "ADHD, dementia and addiction", "Side-effect medicines"];

const row = (m: Med) => ({ id: m.id, name: m.name, cls: m.cls, className: m.cls, group: m.group, brands: m.brands, uses: m.uses, line: m.standout[0] ?? "", dose: m.doses[m.defaultDose]?.amount ?? "", keyDose: m.doses[m.defaultDose]?.amount ?? "" });
export function medicineList(): MedicineList {
  return { v: 1, groups: GROUPS, classes: GROUPS, rows: MEDS.map(({ med }) => row(med)) };
}
const str = (x: unknown) => (typeof x === "string" ? x : null);
/** The website's medicineDiagrams plan (src/lib/meds/diagrams.ts), for the mock's sample medicines. */
function diagramsOf(s: MedSample): MedDiagram[] {
  const m = s.med;
  const out: MedDiagram[] = [];
  if (s.mechanism) {
    const r = s.mechanism.receptor;
    const main = s.mechanism.targets[0];
    if (main) out.push({ kind: "target", medName: m.name, target: main.target, action: main.action, effect: main.effect });
    if (r.name === "a receptor") out.push({ kind: "note", text: r.note });
    else if (r.messenger) out.push({ kind: "messenger", messenger: r.messenger, receptor: r.name, note: r.note });
    else out.push({ kind: "receptor", medName: m.name, receptor: r.name, pick: r.pick, note: r.note });
    out.push({ kind: "journey", medName: m.name, target: s.mechanism.site, routes: (s.mechanism.routes.length ? s.mechanism.routes : ["oral"]) as ("oral" | "iv" | "nasal" | "depot")[], notes: null });
  }
  for (const v of s.visuals) {
    const d = v.data as Record<string, unknown>;
    if (v.kind === "release" || v.kind === "synapse3d") out.push({ kind: "synapse", medName: m.name, action: v.kind === "release" ? "reuptake" : /gaba/i.test(String(d.transmitter ?? "")) ? "gaba" : "glutamate", transmitter: String(d.transmitter ?? "messenger"), title: str(d.title) ?? `What ${m.name} changes at the synapse`, caption: str(d.caption) });
    else if (v.kind === "curve") out.push(v.half ? { kind: "halfLife", title: str(d.title) ?? `How long ${m.name} stays in the body`, hl: v.half.hl, meaning: v.half.meaning } : { kind: "dose", title: str(d.title) ?? m.name, shape: m.id === "trazodone" ? "targets" : m.id === "buprenorphine" ? "ceiling" : "window", caption: str(d.caption) });
    else if (v.kind === "pathways") out.push({ kind: "pathways", medName: m.name, caption: str(d.caption), atypical: false, partial: m.id === "aripiprazole", focus: m.id === "trihexyphenidyl" ? "nigrostriatal" : null });
    else if (v.kind === "compare") out.push({ kind: "compare", title: str(d.title) ?? "Compared", a: d.a as never, b: d.b as never });
    else if (v.kind === "neuron") out.push({ kind: "neuron", medName: m.name, title: str(d.title) ?? `What ${m.name} calms`, caption: str(d.caption) });
    else if (v.kind === "nervoussystem") out.push({ kind: "nervous", medName: m.name, title: str(d.title) ?? `What ${m.name} quietens`, caption: str(d.caption) });
    else if (v.kind === "hypnogram") out.push({ kind: "hypnogram", title: str(d.title) ?? "A night of sleep", caption: str(d.caption) });
  }
  return out;
}
/** The website's medicinePage (src/lib/app-api/library.ts), built from the sample with the same section rules. */
export function medicinePage(id: string): MedicinePage | null {
  const s = MEDS.find((x) => x.med.id === id);
  if (!s) return null;
  const m = s.med;
  const tell = splitTell(m);
  const shown = shownSections(m, { hasMechanism: !!s.mechanism, visuals: s.visuals.length, halfLife: !!s.halfLife });
  const sections = shown.map((sid): MedSection => {
    const title = SECTION_NAMES[sid];
    switch (sid) {
      case "uses":
        return { id: sid, title, points: m.uses, uses: m.uses, standout: m.standout };
      case "doses":
        return { id: sid, title, points: m.doses.map((d) => `${d.label}: ${d.amount}`), doses: m.doses, defaultDose: m.defaultDose, take: tell.take, forms: m.forms, brands: m.brands, note: DOSE_NOTE };
      case "side-effects":
        return { id: sid, title, points: m.common };
      case "monitoring":
        return { id: sid, title, points: m.checks };
      case "interactions":
        return { id: sid, title, points: m.interactions };
      case "warnings":
        return { id: sid, title, points: [...m.serious, ...tell.warn], tone: "alert" };
      case "groups":
        return { id: sid, title, points: m.groups.map((g) => `${g.label}: ${g.text}`), facts: m.groups };
      case "stopping":
        return { id: sid, title, points: [...tell.stopping, ...(s.halfLife ? [washoutLine(s.halfLife.hl)] : [])] };
      default:
        return { id: "how-it-works", title, points: s.mechanism ? [s.mechanism.plain] : [], plain: s.mechanism?.plain ?? null, targets: s.mechanism?.targets ?? [], diagrams: diagramsOf(s) };
    }
  });
  const related = m.related.map((r) => MEDS.find((x) => x.med.id === r)?.med).filter((x): x is Med => !!x);
  return {
    v: 1,
    ...row(m),
    summary: { student: m.student, clinician: m.clinician },
    sections,
    related: related.map((x) => ({ id: x.id, name: x.name, cls: x.cls })),
    study: { moduleId: "pharmacology", title: "Medicines in the clinic", target: { screen: "studyModule", moduleId: "pharmacology", web: "/study/pharmacology" } },
    med: m as unknown as MedicinePage["med"],
    mechanism: s.mechanism as unknown as Record<string, unknown> | null,
    visuals: s.visuals as unknown as Record<string, unknown>[],
    halfLife: s.halfLife,
  };
}

/*
 * GET /library/reference for the mock build: the website's mechanismIndex
 * groups for the sample medicines (targets copied from src/lib/meds/mechanisms.ts).
 */
const MECHANISMS: [string, [string, string?][]][] = [
  ["Acetylcholinesterase", [["donepezil"]]],
  ["Alpha-2 adrenergic", [["mirtazapine"]]],
  ["Beta-1 and beta-2 adrenergic", [["propranolol"]]],
  ["Dopamine D2", [["clozapine", "Weak, fast-off"], ["olanzapine"], ["risperidone"]]],
  ["Dopamine D2 and D3", [["aripiprazole", "Partial agonist"]]],
  ["Dopamine pump (DAT)", [["methylphenidate"], ["sertraline", "Weak, at higher doses"]]],
  ["GABA-A receptor (benzodiazepine site)", [["clonazepam"], ["zolpidem", "Alpha1-preferring"]]],
  ["Histamine H1", [["clozapine"], ["mirtazapine"], ["olanzapine"]]],
  ["Inositol monophosphatase and GSK-3 beta", [["lithium"]]],
  ["Muscarinic M1 to M3", [["clozapine"], ["olanzapine"], ["trihexyphenidyl"]]],
  ["Noradrenaline pump (NET)", [["methylphenidate"], ["venlafaxine", "Rising with dose"]]],
  ["Serotonin 5-HT2A", [["aripiprazole"], ["clozapine"], ["mirtazapine"], ["olanzapine"], ["risperidone"]]],
  ["Serotonin pump (SERT)", [["escitalopram"], ["fluoxetine"], ["sertraline"], ["venlafaxine"]]],
  ["Voltage-gated sodium channels", [["lamotrigine"], ["valproate"]]],
];
export function referenceHome(): ReferenceHome {
  const name = (id: string) => MEDS.find((x) => x.med.id === id)?.med.name ?? id;
  return {
    v: 1,
    drugs: MEDS.map(({ med }) => ({ slug: med.id, name: med.name })),
    byMechanism: MECHANISMS.map(([tag, ds]) => ({ tag, drugs: ds.map(([id, q]) => ({ slug: id, name: name(id), qualifier: q ?? null })) })),
    notice: "",
  };
}

/** Answers a Practise or Library route, or null when the path is not one of them. */
export function practiseRoute(method: string, path: string, body: unknown, kind: string): RawResponse | null {
  const seg = path.split("?")[0]!.split("/").filter(Boolean);
  if (seg[0] === "library") {
    if (kind === "lecture") return fail(403, "scope", "Your account is for lectures only.");
    if (method === "GET" && seg[1] === "medicines" && seg.length === 2) return ok(medicineList());
    if (method === "GET" && seg[1] === "reference" && seg.length === 2) return ok(referenceHome());
    if (method === "GET" && seg[1] === "medicines" && seg.length === 3) {
      const p = medicinePage(decodeURIComponent(seg[2]!));
      return p ? ok(p) : fail(404, "not_found", "That could not be found.");
    }
    return null;
  }
  if (seg[0] === "practise" || seg[0] === "prep" || seg[0] === "leaderboards") {
    if (kind === "lecture") return fail(403, "scope", "Your account is for lectures only.");
    const q = new URLSearchParams(path.split("?")[1] ?? "");
    const d = (i: number) => decodeURIComponent(seg[i] ?? "");
    try {
      if (method === "GET" && seg[0] === "practise" && seg.length === 1) return ok(R.hub());
      if (method === "GET" && seg[0] === "practise" && seg[1] === "tools" && seg.length === 3) return ok(R.practiseTool(d(2)));
      if (method === "POST" && seg[0] === "practise" && seg[1] === "records") return ok({ ok: true });
      if (method === "POST" && seg[0] === "practise" && seg[1] === "duel") return fail(503, "unavailable", "Duels are not set up yet.");
      if (method === "GET" && seg[0] === "prep") {
        if (seg.length === 1) return ok(R.prepHome());
        if (seg[1] === "subjects" && seg.length === 3) return ok(R.prepSubject(d(2)));
        if (seg[1] === "subjects" && seg[3] === "topics" && seg.length === 5) return ok(R.prepTopic(d(2), d(4), Number(q.get("set")) || 0));
        if (seg[1] === "smart") return ok(R.prepSmart());
        if (seg[1] === "lists" && seg.length === 3) return ok(R.prepList(d(2)));
        if (seg[1] === "long") return ok(R.prepLong(seg[2] && d(2), seg[3] && d(3), seg[4] && d(4)));
        if (seg[1] === "mock" && seg.length === 2) return ok(R.prepMocks());
        if (seg[1] === "mock" && seg[2] === "result" && seg.length === 4) return ok(R.prepMockResult(d(3)));
      }
      if (method === "GET" && seg[0] === "leaderboards" && seg[1] === "shop") return ok(R.shop());
      if (method === "GET" && seg[0] === "leaderboards" && (kind === "admin" || kind === "viewadmin") && ["league", "quiz", "overall"].includes(d(1))) return ok(R.adminBoard(d(1), q));
      if (method === "GET" && seg[0] === "leaderboards") return ok(R.board(seg[1] === "games" ? d(2) : d(1)));
    } catch (e) {
      if (e instanceof PlayError) return fail(e.status, e.code, e.message);
      throw e;
    }
    return fail(404, "not_found", "That could not be found.");
  }
  if (seg[0] !== "play" || seg.length !== 3 || method !== "POST") return null;
  if (kind === "lecture") return fail(403, "scope", "Your account is for lectures only.");
  const game = decodeURIComponent(seg[1]!);
  const action = decodeURIComponent(seg[2]!);
  const fn = HANDLERS[game]?.[action];
  if (!fn) return fail(404, "not_found", "That could not be found.");
  const args = (body as { args?: unknown[] } | null)?.args ?? [];
  try {
    return ok({ kind: `${game}.${action}`, v: 1, data: (fn as (...a: unknown[]) => unknown)(...args) });
  } catch (e) {
    if (e instanceof PlayError) return fail(e.status, e.code, e.message);
    return fail(400, "bad_request", "That didn't work. Try again.");
  }
}

export function resetPractiseMock() {
  R.resetShop();
  resetSeeds();
  resetCases();
  resetGames();
}
