import { beforeEach, describe, expect, it, vi } from "vitest";
import { G, resetGuard } from "@/lib/app-api/test-guard";
import { STUDENT_ID, appReq, noParams, params, profileRow, read } from "@/lib/app-api/test-kit";

const h = vi.hoisted(() => ({
  start: vi.fn(),
  answer: vi.fn(),
  progress: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({ revalidatePath: () => undefined }));
vi.mock("@/lib/supabase/server", async () => (await import("@/lib/app-api/test-guard")).supabaseMock());
vi.mock("@/lib/app-api/supabase", async () => (await import("@/lib/app-api/test-guard")).statelessMock());
vi.mock("@/lib/flags", async () => (await import("@/lib/app-api/test-guard")).flagsMock());
vi.mock("@/lib/access/blocks", async () => (await import("@/lib/app-api/test-guard")).blocksMock());
vi.mock("@/lib/rate-limit", async () => (await import("@/lib/app-api/test-guard")).rateMock());
vi.mock("@/lib/rate-limit-fast", async () => (await import("@/lib/app-api/test-guard")).fastRateMock());
vi.mock("@/app/(dashboard)/games/blitz/actions", () => ({ startBlitz: h.start, answerBlitz: h.answer, finishBlitz: vi.fn() }));
vi.mock("@/app/(dashboard)/games/sort/actions", () => ({ loadSort: vi.fn(), checkSort: vi.fn() }));
vi.mock("@/app/(dashboard)/games/rx/actions", () => ({ dealRxRun: vi.fn(), pickRxAnswer: vi.fn(), finishRxRun: vi.fn() }));
vi.mock("@/app/(dashboard)/games/mse/actions", () => ({ dealMseRound: vi.fn(), tagMseFinding: vi.fn() }));
vi.mock("@/app/(dashboard)/games/ward/actions", () => ({ startWardSolo: vi.fn(), resumeWardSolo: vi.fn(), pickWardSolo: vi.fn() }));
vi.mock("@/app/(dashboard)/games/escape/actions", () => ({ startEscapePractice: vi.fn(), resumeEscapePractice: vi.fn(), answerEscapePractice: vi.fn() }));
vi.mock("@/app/(dashboard)/practice/detective/actions", () => ({ dealDetective: vi.fn(), detectiveClue: vi.fn(), detectiveAllClues: vi.fn(), detectiveGuess: vi.fn() }));
vi.mock("@/app/(dashboard)/practice/daily/actions", () => ({ dailyRest: vi.fn(), dailyMove: vi.fn(), nextPractice: vi.fn() }));
vi.mock("@/app/(dashboard)/prep/actions", () => ({ checkAnswer: vi.fn(), revealAnswer: vi.fn(), toggleSaved: vi.fn(), startMock: vi.fn(), submitMock: vi.fn() }));
vi.mock("@/lib/cases/progress-actions", () => ({ loadMyProgress: h.progress, saveMyProgress: vi.fn() }));

import { clearDeviceCache } from "@/lib/app-api/devices";
import { playFailure } from "@/lib/app-api/play";
import { POST as play } from "./play/[game]/[action]/route";
import { GET as meds } from "./library/medicines/route";
import { GET as med } from "./library/medicines/[medId]/route";
import { MEDS } from "@/lib/meds";

const call = (game: string, action: string, args: unknown[] = []) => play(appReq(`/play/${game}/${action}`, { body: { args } }), params({ game, action }));

beforeEach(() => {
  resetGuard();
  clearDeviceCache();
  for (const f of Object.values(h)) f.mockReset();
});

describe("POST /play/:game/:action", () => {
  it("runs the website's server-dealt action with the same arguments and tags the answer", async () => {
    h.answer.mockResolvedValue({ ok: true, token: "t2", right: true, answer: 1 });
    const r = await read(await call("blitz", "answer", ["t1", 3, 1]));
    expect(r.data).toEqual({ kind: "blitz.answer", v: 1, data: { ok: true, token: "t2", right: true, answer: 1 } });
    expect(h.answer).toHaveBeenCalledWith("t1", 3, 1);
  });

  it("unknown games and actions (and object keys) are not found", async () => {
    expect((await read(await call("nope", "start"))).status).toBe(404);
    expect((await read(await call("blitz", "constructor"))).status).toBe(404);
    expect((await read(await call("toString", "x"))).status).toBe(404);
  });

  it("refuses more arguments than the action takes", async () => {
    expect((await read(await call("blitz", "start", [1]))).status).toBe(400);
    expect(h.start).not.toHaveBeenCalled();
  });

  it("each game keeps its website gate: lectures-only, switched off, locked", async () => {
    G.db.tables.profiles[0] = profileRow({ scope: "lectures_only" });
    expect((await read(await call("blitz", "start"))).error?.code).toBe("scope");
    G.db.tables.profiles[0] = profileRow();
    G.blocks = ["games"];
    expect((await read(await call("blitz", "start"))).error?.code).toBe("access_block");
    G.blocks = [];
    G.flags = { learn: "off" };
    expect((await read(await call("blitz", "start"))).error?.code).toBe("feature_off");
    expect(h.start).not.toHaveBeenCalled();
  });

  it("turns the website's { ok: false, error } into an error answer", async () => {
    h.start.mockResolvedValue({ ok: false, error: "Please sign in again." });
    expect((await read(await call("blitz", "start"))).error?.code).toBe("unauthenticated");
    h.start.mockResolvedValue({ ok: false, error: "That run has ended." });
    expect((await read(await call("blitz", "start"))).error).toMatchObject({ code: "bad_request", message: "That run has ended." });
  });

  it("moves are rate limited per student", async () => {
    G.limited.add(`app:play:${STUDENT_ID}`);
    expect((await read(await call("blitz", "start"))).status).toBe(429);
  });

  it("case progress (Done and New) goes through the shared progress actions", async () => {
    h.progress.mockResolvedValue({ ok: true, items: { a: { done: true } } });
    const r = await read(await call("cases", "progress", ["detective"]));
    expect(r.data.kind).toBe("cases.progress");
    expect(h.progress).toHaveBeenCalledWith("detective");
  });

  it("playFailure", () => {
    expect(playFailure({ ok: true })).toBeNull();
    expect(playFailure({ error: "No." })).toBe("No.");
    expect(playFailure({ error: null, alias: "x" })).toBeNull();
    expect(playFailure({ ok: false, reason: "Full." })).toBe("Full.");
    expect(playFailure(null)).toBeNull();
  });
});

describe("medicines library", () => {
  it("lists every medicine with its usual dose, and one medicine page as data", async () => {
    const r = await read(await meds(appReq("/library/medicines"), noParams));
    expect(r.data.rows).toHaveLength(MEDS.length);
    expect(r.data.rows[0]).toMatchObject({ id: MEDS[0].id, name: MEDS[0].name, dose: expect.any(String) });
    const p = await read(await med(appReq(`/library/medicines/${MEDS[0].id}`), params({ medId: MEDS[0].id })));
    expect(p.data).toMatchObject({ v: 1, med: { id: MEDS[0].id } });
    expect(p.data.study === null || p.data.study.target.screen === "studyModule").toBe(true);
    expect((await read(await med(appReq("/library/medicines/nope"), params({ medId: "nope" })))).status).toBe(404);
  });

  it("is closed when Medicines is switched off", async () => {
    G.blocks = ["medicines"];
    expect((await read(await meds(appReq("/library/medicines"), noParams))).error?.code).toBe("access_block");
  });
});
