import { beforeEach, describe, expect, it, vi } from "vitest";
import { G, resetGuard } from "@/lib/app-api/test-guard";
import { STUDENT_ID, appReq, noParams, params, read } from "@/lib/app-api/test-kit";

const h = vi.hoisted(() => ({ state: null as unknown, load: vi.fn(), save: vi.fn() }));

vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({ revalidatePath: () => undefined, unstable_cache: (fn: unknown) => fn }));
vi.mock("@/lib/supabase/server", async () => (await import("@/lib/app-api/test-guard")).supabaseMock());
vi.mock("@/lib/app-api/supabase", async () => (await import("@/lib/app-api/test-guard")).statelessMock());
vi.mock("@/lib/flags", async () => (await import("@/lib/app-api/test-guard")).flagsMock());
vi.mock("@/lib/access/blocks", async () => (await import("@/lib/app-api/test-guard")).blocksMock());
vi.mock("@/lib/rate-limit", async () => (await import("@/lib/app-api/test-guard")).rateMock());
vi.mock("@/lib/rate-limit-fast", async () => (await import("@/lib/app-api/test-guard")).fastRateMock());
vi.mock("@/app/(dashboard)/study/actions", () => ({ loadLearnState: h.load, saveLearnState: h.save }));

import { clearDeviceCache } from "@/lib/app-api/devices";
import { normalise, type LearnState } from "@/lib/learn/engine";
import { EXPERIMENTS } from "@/lib/lab/experiments";
import { CASEBOOK, caseKey } from "@/content/casebook";
import { caseSize } from "@/lib/app-api/lab";
import { GET as home } from "./route";
import { POST as run } from "./[id]/run/route";
import { POST as check } from "./[id]/check/route";
import { POST as reflect } from "./[id]/reflect/route";
import { GET as casebook } from "../casebook/route";
import { POST as caseDone } from "../casebook/[id]/done/route";

const e = EXPERIMENTS[0];
const state = () => h.state as LearnState;

beforeEach(() => {
  resetGuard();
  clearDeviceCache();
  G.flags = { learn: "unlocked", lab: "unlocked" };
  h.state = normalise(null);
  h.load.mockReset().mockImplementation(async () => ({ ...(h.state as object), owner: STUDENT_ID }));
  h.save.mockReset().mockImplementation(async (s: unknown) => ((h.state = s), { ok: true, clamped: false }));
});

describe("Lab", () => {
  it("is closed while the Lab switch is off", async () => {
    G.flags = { learn: "unlocked", lab: "off" };
    const r = await read(await home(appReq("/lab"), noParams));
    expect(r.ok).toBe(false);
  });

  it("sends every experiment without the educator's book notes, and only this student's records", async () => {
    const r = await read(await home(appReq("/lab"), noParams));
    expect(r.data.experiments).toHaveLength(EXPERIMENTS.length);
    expect(JSON.stringify(r.data.experiments)).not.toContain("bookRefs");
    expect(r.data.data.BIAS_CASES.length).toBeGreaterThan(0);
    expect(r.data.records).toEqual({});
  });

  it("records a run on the server and refuses unknown experiments and bad numbers", async () => {
    const w = await read(await run(appReq(`/lab/${e.id}/run`, { body: { numbers: { span: 7 } } }), params({ id: e.id })));
    expect(w.data.record).toMatchObject({ runs: 1, result: { span: 7 }, check: null });
    expect(state().lab[e.id].runs).toBe(1);
    expect(state().xp).toBeGreaterThan(0);
    expect((await read(await run(appReq("/lab/nope/run", { body: { numbers: {} } }), params({ id: "nope" })))).error?.code).toBe("not_found");
    expect((await read(await run(appReq(`/lab/${e.id}/run`, { body: { numbers: { x: "7" } } }), params({ id: e.id })))).error?.code).toBe("bad_request");
    const many = Object.fromEntries(Array.from({ length: 13 }, (_, i) => [`k${i}`, i]));
    expect((await read(await run(appReq(`/lab/${e.id}/run`, { body: { numbers: many } }), params({ id: e.id })))).error?.code).toBe("bad_request");
  });

  it("grades the check on the server, needs a run first and every answer", async () => {
    const right = e.checks.map((k) => k.answer);
    expect((await read(await check(appReq(`/lab/${e.id}/check`, { body: { answers: right } }), params({ id: e.id })))).error?.code).toBe("conflict");
    await run(appReq(`/lab/${e.id}/run`, { body: { numbers: {} } }), params({ id: e.id }));
    expect((await read(await check(appReq(`/lab/${e.id}/check`, { body: { answers: right.slice(1) } }), params({ id: e.id })))).error?.code).toBe("bad_request");
    const wrongFirst = [(right[0] + 1) % e.checks[0].options.length, ...right.slice(1)];
    const r = await read(await check(appReq(`/lab/${e.id}/check`, { body: { answers: wrongFirst } }), params({ id: e.id })));
    expect(r.data.record.check).toEqual({ right: e.checks.length - 1, total: e.checks.length });
    expect(r.data.record.recheckDue).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("marks a reflection once, only after a run", async () => {
    expect((await read(await reflect(appReq(`/lab/${e.id}/reflect`, { body: {} }), params({ id: e.id })))).error?.code).toBe("conflict");
    await run(appReq(`/lab/${e.id}/run`, { body: { numbers: {} } }), params({ id: e.id }));
    const r = await read(await reflect(appReq(`/lab/${e.id}/reflect`, { body: {} }), params({ id: e.id })));
    expect(r.data.record.reflected).toBe(true);
  });

  it("answers a failed save as an error, never as saved", async () => {
    h.save.mockImplementationOnce(async () => ({ ok: false, retry: true }));
    const r = await read(await run(appReq(`/lab/${e.id}/run`, { body: { numbers: {} } }), params({ id: e.id })));
    expect(r.ok).toBe(false);
  });
});

describe("Casebook", () => {
  const c = CASEBOOK[0];
  it("sends every case without source or review notes", async () => {
    const r = await read(await casebook(appReq("/casebook"), noParams));
    expect(r.data.cases).toHaveLength(CASEBOOK.length);
    const s = JSON.stringify(r.data.cases);
    expect(s).not.toContain("bookRef");
    expect(s).not.toContain("reviewFlags");
    expect(r.data.modules[c.module]).toEqual(expect.any(String));
  });

  it("records a play with the server's round level and refuses a score larger than the case", async () => {
    const w = await read(await caseDone(appReq(`/casebook/${c.id}/done`, { body: { right: 1, total: 2 } }), params({ id: c.id })));
    expect(w.data.record).toMatchObject({ runs: 1, check: { right: 1, total: 2 } });
    expect(state().lab[caseKey(c.id)].result).toMatchObject({ right: 1, total: 2, tier: expect.any(Number) });
    const h2 = await read(await casebook(appReq("/casebook"), noParams));
    expect(h2.data.records[c.id]).toMatchObject({ runs: 1, tier: expect.any(Number) });
    expect((await read(await caseDone(appReq(`/casebook/${c.id}/done`, { body: { right: 3, total: 2 } }), params({ id: c.id })))).error?.code).toBe("bad_request");
    const big = caseSize(c) + 1;
    expect((await read(await caseDone(appReq(`/casebook/${c.id}/done`, { body: { right: 0, total: big } }), params({ id: c.id })))).error?.code).toBe("bad_request");
    expect((await read(await caseDone(appReq("/casebook/nope/done", { body: { right: 0, total: 1 } }), params({ id: "nope" })))).error?.code).toBe("not_found");
  });
});
