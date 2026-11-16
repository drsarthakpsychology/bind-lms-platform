import { beforeEach, describe, expect, it, vi } from "vitest";
import { resetGuard } from "@/lib/app-api/test-guard";
import { STUDENT_ID, appReq, params, read } from "@/lib/app-api/test-kit";

const h = vi.hoisted(() => ({ load: vi.fn(), standing: vi.fn() }));

vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({ revalidatePath: () => undefined, unstable_cache: (fn: unknown) => fn }));
vi.mock("@/lib/supabase/server", async () => (await import("@/lib/app-api/test-guard")).supabaseMock());
vi.mock("@/lib/app-api/supabase", async () => (await import("@/lib/app-api/test-guard")).statelessMock());
vi.mock("@/lib/flags", async () => (await import("@/lib/app-api/test-guard")).flagsMock());
vi.mock("@/lib/access/blocks", async () => (await import("@/lib/app-api/test-guard")).blocksMock());
vi.mock("@/lib/rate-limit", async () => (await import("@/lib/app-api/test-guard")).rateMock());
vi.mock("@/lib/rate-limit-fast", async () => (await import("@/lib/app-api/test-guard")).fastRateMock());
vi.mock("@/lib/prep/server", () => ({ loadAttempt: h.load, standingFor: h.standing }));

import { clearDeviceCache } from "@/lib/app-api/devices";
import { PRACTICE_SPECS } from "@/content/prep/specs";
import { KEY } from "@/lib/prep/bank";
import { GET as result } from "./mock/result/[id]/route";

const ID = "0f6c1c8e-5b2a-4c9e-9d7e-2a1b3c4d5e6f";
const spec = PRACTICE_SPECS[0]!;
const q = [...KEY.values()].find((x) => spec.sections[0]!.subjects.includes(x.subject as never))!;

beforeEach(() => {
  resetGuard();
  clearDeviceCache();
  h.load.mockReset();
  h.standing.mockReset();
  h.standing.mockResolvedValue({ rank: 2, of: 5, percentile: 75 });
});

describe("GET /prep/mock/result/:id", () => {
  it("answers the student's own saved mock with the full review, answers included after hand-in", async () => {
    h.load.mockResolvedValue({ id: ID, specId: spec.id, paper: { specId: spec.id, sections: [] }, deadline: "", submittedAt: "2026-11-15T10:00:00Z", result: { score: 2, max: 2, right: 1, wrong: 0, blank: 0, items: [{ id: q.id, section: spec.sections[0]!.title, chosen: q.answer, correct: true, ms: 4000 }], sections: [], subjects: [], totalMs: 4000 }, standing: null, answers: {}, marked: [q.id], late: false });
    const r = await read(await result(appReq(`/prep/mock/result/${ID}`), params({ id: ID })));
    expect(r.status).toBe(200);
    expect(h.load).toHaveBeenCalledWith(STUDENT_ID, ID);
    expect(r.data).toMatchObject({ v: 1, id: ID, specId: spec.id, title: spec.short });
    expect(r.data.result.standing).toEqual({ rank: 2, of: 5, percentile: 75 });
    expect(r.data.result.rows[0]).toMatchObject({ chosen: q.answer, answer: q.answer, correct: true, marked: true });
  });

  it("a paper never handed in has no result; someone else's or a missing one is 404", async () => {
    h.load.mockResolvedValueOnce({ id: ID, specId: spec.id, paper: { specId: spec.id, sections: [] }, deadline: "", submittedAt: null, result: null, standing: null, answers: {}, marked: [], late: false });
    expect((await read(await result(appReq(`/prep/mock/result/${ID}`), params({ id: ID })))).data.result).toBeNull();
    h.load.mockResolvedValueOnce(null);
    expect((await read(await result(appReq(`/prep/mock/result/${ID}`), params({ id: ID })))).status).toBe(404);
  });

  it("needs a sign-in", async () => {
    expect((await read(await result(appReq(`/prep/mock/result/${ID}`, { token: null }), params({ id: ID })))).error?.code).toBe("unauthenticated");
  });
});
