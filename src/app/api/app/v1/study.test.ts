import { beforeEach, describe, expect, it, vi } from "vitest";
import { G, resetGuard } from "@/lib/app-api/test-guard";
import { STUDENT_ID, appReq, noParams, params, profileRow, read } from "@/lib/app-api/test-kit";

const h = vi.hoisted(() => ({
  state: null as unknown,
  load: vi.fn(),
  save: vi.fn(),
  submit: vi.fn(),
  history: new Map<string, { item: string; seen: number; ok: boolean | null; at: number; due: number | null }>(),
  recorded: [] as { tool: string; answers: { item: string; correct: boolean | null }[] }[],
  pull: vi.fn(),
  push: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({ revalidatePath: () => undefined }));
vi.mock("@/lib/supabase/server", async () => (await import("@/lib/app-api/test-guard")).supabaseMock());
vi.mock("@/lib/app-api/supabase", async () => (await import("@/lib/app-api/test-guard")).statelessMock());
vi.mock("@/lib/flags", async () => (await import("@/lib/app-api/test-guard")).flagsMock());
vi.mock("@/lib/access/blocks", async () => (await import("@/lib/app-api/test-guard")).blocksMock());
vi.mock("@/lib/rate-limit", async () => (await import("@/lib/app-api/test-guard")).rateMock());
vi.mock("@/lib/rate-limit-fast", async () => (await import("@/lib/app-api/test-guard")).fastRateMock());
vi.mock("@/app/(dashboard)/study/actions", () => ({ loadLearnState: h.load, saveLearnState: h.save, submitModuleTest: h.submit }));
vi.mock("@/lib/history/server", () => ({
  loadHistory: async () => ({ ready: true, map: h.history }),
  recordHistory: async (_u: string, tool: string, answers: { item: string; correct: boolean | null }[]) => {
    h.recorded.push({ tool, answers });
    for (const a of answers) h.history.set(a.item, { item: a.item, seen: 1, ok: a.correct, at: Date.now(), due: null });
    return true;
  },
}));
vi.mock("@/lib/study/marks-actions", () => ({ pullMarks: h.pull, pushMarks: h.push }));

import { clearDeviceCache } from "@/lib/app-api/devices";
import { normalise } from "@/lib/learn/engine";
import { MODULES } from "@/lib/study";
import { checkpointQuestions, checkpoints } from "@/lib/study/checkpoints";
import { testSection } from "@/lib/study/plan";
import { splitSection } from "@/lib/study/chunk";
import { mcqKey } from "@/lib/study/test-grade";
import { GET as modules } from "./study/modules/route";
import { GET as moduleRoute } from "./study/modules/[moduleId]/route";
import { GET as section } from "./study/modules/[moduleId]/sections/[sectionId]/route";
import { GET as getState, PUT as putState } from "./study/state/route";
import { GET as checkpoint } from "./study/modules/[moduleId]/checkpoints/[n]/route";
import { POST as answers } from "./study/modules/[moduleId]/checkpoints/[n]/answers/route";
import { POST as test } from "./study/modules/[moduleId]/test/route";
import { GET as getMarks, PUT as putMarks } from "./study/marks/route";
import { GET as notes } from "./study/notes/route";
import { GET as note } from "./study/notes/[noteId]/route";
import { GET as figure } from "./study/figures/[figureId]/route";

const m = MODULES.find((x) => testSection(x) && checkpoints(x).some((cp) => checkpointQuestions(x, cp).mcq.length > 1))!;
const cp = checkpoints(m).find((c) => checkpointQuestions(m, c).mcq.length > 1)!;

beforeEach(() => {
  resetGuard();
  clearDeviceCache();
  h.state = normalise(null);
  h.load.mockReset().mockImplementation(async () => ({ ...(h.state as object), owner: STUDENT_ID }));
  h.save.mockReset().mockImplementation(async (s: unknown) => ((h.state = s), { ok: true, clamped: false }));
  h.submit.mockReset();
  h.history.clear();
  h.recorded = [];
  h.pull.mockReset();
  h.push.mockReset();
});

function findWidget(o: unknown): { t: string; v?: number } | null {
  if (!o || typeof o !== "object") return null;
  if ((o as { t?: string }).t === "widget") return o as { t: string; v?: number };
  for (const v of Object.values(o)) {
    const f = findWidget(v);
    if (f) return f;
  }
  return null;
}

describe("study gates", () => {
  it("lectures-only accounts and a locked Study are refused", async () => {
    G.db.tables.profiles[0] = profileRow({ scope: "lectures_only" });
    expect((await read(await modules(appReq("/study/modules"), noParams))).error?.code).toBe("scope");
    G.db.tables.profiles[0] = profileRow();
    G.flags = { learn: "live" };
    expect((await read(await modules(appReq("/study/modules"), noParams))).error?.code).toBe("feature_locked");
  });
});

describe("modules and sections", () => {
  it("lists every module with its status and the next step as an app target", async () => {
    const r = await read(await modules(appReq("/study/modules"), noParams));
    expect(r.data.modules).toHaveLength(MODULES.length);
    expect(r.data.modules[0].status).toMatchObject({ readDone: 0, pct: 0 });
    expect(r.data.next.target.screen).toMatch(/^study/);
  });

  it("module detail answers sections, checkpoints and the next step", async () => {
    const r = await read(await moduleRoute(appReq(`/study/modules/${m.id}`), params({ moduleId: m.id })));
    expect(r.data.sections).toHaveLength(m.sections.length);
    expect(r.data.checkpoints[0]).toMatchObject({ n: 1, status: expect.any(String) });
    expect(r.data.next).toMatchObject({ kind: "read", moduleId: m.id });
    expect((await read(await moduleRoute(appReq("/study/modules/nope"), params({ moduleId: "nope" })))).status).toBe(404);
  });

  it("a section is structured JSON with versioned widgets, never HTML", async () => {
    // Find a section that holds a widget.
    let found: { mod: string; sec: string } | null = null;
    for (const mod of MODULES) {
      for (const s of mod.sections) if (!found && splitSection(s).chunks.some((c) => findWidget(c.blocks))) found = { mod: mod.id, sec: s.id };
    }
    expect(found).not.toBeNull();
    const r = await read(await section(appReq(`/study/modules/${found!.mod}/sections/${found!.sec}`), params({ moduleId: found!.mod, sectionId: found!.sec })));
    expect(r.data.contentSchemaVersion).toBe(1);
    expect(findWidget(r.data.chunks)).toMatchObject({ t: "widget", v: 1 });
    expect(JSON.stringify(r.data)).not.toMatch(/<\/?(p|div|span|strong|svg)[\s>]/);
  });

  it("the module test section sends questions without answers", async () => {
    const t = testSection(m)!;
    const r = await read(await section(appReq(`/study/modules/${m.id}/sections/${t.id}`), params({ moduleId: m.id, sectionId: t.id })));
    expect(r.data.mcq).toEqual([]);
    expect(r.data.test.questions.length).toBeGreaterThan(0);
    expect(r.data.test.questions[0]).toEqual({ key: expect.any(String), q: expect.any(String), options: expect.any(Array) });
    expect(JSON.stringify(r.data.test)).not.toContain('"answer"');
  });
});

describe("learn state", () => {
  it("GET answers the state and India's date; PUT runs saveLearnState and answers the stored copy", async () => {
    const g = await read(await getState(appReq("/study/state"), noParams));
    expect(g.data.state.v).toBe(1);
    expect(g.data.state.owner).toBeUndefined();
    expect(g.data.today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    h.save.mockImplementationOnce(async (s: unknown) => ((h.state = { ...(s as object), xp: 5 }), { ok: true, clamped: true }));
    const p = await read(await putState(appReq("/study/state", { method: "PUT", body: { state: { ...(h.state as object), xp: 99999 } } }), noParams));
    expect(p.data).toMatchObject({ clamped: true, state: { xp: 5 } });
  });
});

describe("checkpoints (graded on the server)", () => {
  it("a sitting sends questions without answers; grading uses only this checkpoint's questions", async () => {
    const r = await read(await checkpoint(appReq(`/study/modules/${m.id}/checkpoints/${cp.n}`), params({ moduleId: m.id, n: String(cp.n) })));
    expect(r.data.questions.length).toBe(checkpointQuestions(m, cp).mcq.length);
    expect(JSON.stringify(r.data.questions)).not.toContain('"answer"');
    expect(r.data.known).toEqual({ right: 0, total: r.data.questions.length });

    const qs = checkpointQuestions(m, cp).mcq;
    const picks: Record<string, number> = { [mcqKey(cp.key, qs[0])]: qs[0].answer, [mcqKey(cp.key, qs[1])]: (qs[1].answer + 1) % qs[1].options.length, "someone-else:key": 0 };
    const a = await read(await answers(appReq(`/study/modules/${m.id}/checkpoints/${cp.n}/answers`, { body: { picks } }), params({ moduleId: m.id, n: String(cp.n) })));
    expect(a.status).toBe(200);
    expect(a.data).toMatchObject({ right: 1, asked: 2, known: { right: 1, total: qs.length } });
    expect(a.data.review[0]).toMatchObject({ correct: true, answer: qs[0].answer });
    expect(h.recorded[0].tool).toBe("study-check");
    expect(a.data.state.study.tests[cp.key]).toMatchObject({ best: 1, total: qs.length });
  });

  it("refuses picks that are not numbers", async () => {
    const a = await read(await answers(appReq(`/study/modules/${m.id}/checkpoints/${cp.n}/answers`, { body: { picks: { x: "1" } } }), params({ moduleId: m.id, n: String(cp.n) })));
    expect(a.status).toBe(400);
  });
});

describe("module test", () => {
  it("is graded by the website's submitModuleTest; the app's word is never taken", async () => {
    const mcq = splitSection(testSection(m)!).mcq;
    h.submit.mockImplementation(async () => {
      h.state = { ...(h.state as { study: object }), study: { ...(h.state as { study: { tests: object } }).study, tests: { [m.id]: { best: 1, total: mcq.length, day: "2026-11-15", tries: 1 } } } };
      return { ok: true, right: 1, total: mcq.length };
    });
    const picks = { [mcqKey(m.id, mcq[0])]: mcq[0].answer };
    const r = await read(await test(appReq(`/study/modules/${m.id}/test`, { body: { picks } }), params({ moduleId: m.id })));
    expect(r.status).toBe(200);
    expect(h.submit).toHaveBeenCalledWith(m.id, picks);
    expect(r.data).toMatchObject({ right: 1, total: mcq.length, best: 1, tries: 1 });
    expect(r.data.review).toHaveLength(mcq.length);
    expect(h.recorded[0].tool).toBe("module-test");
  });

  it("answers server_error when grading fails, and 404 for a module without a test", async () => {
    h.submit.mockResolvedValue({ ok: false });
    expect((await read(await test(appReq(`/study/modules/${m.id}/test`, { body: { picks: {} } }), params({ moduleId: m.id })))).status).toBe(500);
    expect((await read(await test(appReq(`/study/modules/nope/test`, { body: { picks: {} } }), params({ moduleId: "nope" })))).status).toBe(404);
  });
});

describe("marks, notes, figures", () => {
  it("marks: synced when the table exists, phone-only before", async () => {
    const marks = { v: 1, bookmarks: { "a/b": { on: true, at: 1 } }, notes: {} };
    h.pull.mockResolvedValue({ ok: true, marks });
    h.push.mockResolvedValue({ ok: true });
    expect((await read(await getMarks(appReq("/study/marks"), noParams))).data).toEqual({ marks, synced: true });
    const r = await read(await putMarks(appReq("/study/marks", { method: "PUT", body: { changes: marks } }), noParams));
    expect(r.data.synced).toBe(true);
    expect(h.push.mock.calls[0][0]).toMatchObject({ bookmarks: { "a/b": { on: true, at: 1 } } });
    h.pull.mockResolvedValue({ ok: false, off: true });
    expect((await read(await getMarks(appReq("/study/marks"), noParams))).data.synced).toBe(false);
  });

  it("notes list and one note", async () => {
    const l = await read(await notes(appReq("/study/notes"), noParams));
    expect(l.data.notes.length).toBeGreaterThan(5);
    const id = l.data.notes[0].id;
    const n = await read(await note(appReq(`/study/notes/${id}`), params({ noteId: id })));
    expect(n.data).toMatchObject({ id, sections: expect.any(Array) });
  });

  it("a figure answers labels and standalone SVG with every colour filled in", async () => {
    const { FIGURES } = await import("@/components/study/figures/registry");
    const id = Object.keys(FIGURES)[0];
    const r = await read(await figure(appReq(`/study/figures/${id}`), params({ figureId: id })));
    expect(r.status).toBe(200);
    expect(r.data.labels.length).toBeGreaterThan(0);
    for (const svg of [r.data.svg.light, r.data.svg.dark]) {
      expect(svg.startsWith("<svg")).toBe(true);
      expect(svg).not.toContain("var(");
    }
    expect(r.data.svg.light).not.toBe(r.data.svg.dark);
    expect((await read(await figure(appReq("/study/figures/nope"), params({ figureId: "nope" })))).status).toBe(404);
  });
});
