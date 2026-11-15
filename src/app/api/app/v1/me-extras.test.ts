import { beforeEach, describe, expect, it, vi } from "vitest";
import { G, resetGuard } from "@/lib/app-api/test-guard";
import { STUDENT_ID, appReq, noParams, params, profileRow, read } from "@/lib/app-api/test-kit";

const D = "dddddddd-0000-4000-8000-000000000001";
const R = "eeeeeeee-0000-4000-8000-000000000001";

const h = vi.hoisted(() => ({
  ask: vi.fn(),
  reply: vi.fn(),
  vote: vi.fn(),
  solved: vi.fn(),
  list: vi.fn(),
  thread: vi.fn(),
  ready: vi.fn(async () => true),
  ach: vi.fn(),
  pdf: vi.fn(),
  enquiry: vi.fn(),
  cred: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({ revalidatePath: () => undefined }));
vi.mock("@/lib/supabase/server", async () => (await import("@/lib/app-api/test-guard")).supabaseMock());
vi.mock("@/lib/app-api/supabase", async () => (await import("@/lib/app-api/test-guard")).statelessMock());
vi.mock("@/lib/flags", async () => (await import("@/lib/app-api/test-guard")).flagsMock());
vi.mock("@/lib/access/blocks", async () => (await import("@/lib/app-api/test-guard")).blocksMock());
vi.mock("@/lib/rate-limit", async () => (await import("@/lib/app-api/test-guard")).rateMock());
vi.mock("@/lib/rate-limit-fast", async () => (await import("@/lib/app-api/test-guard")).fastRateMock());
vi.mock("@/lib/cohorts/access", () => ({ loadMyCohorts: async () => [{ id: "c1", name: "Cohort 2" }] }));
vi.mock("@/app/(dashboard)/doubts/actions", () => ({ askDoubt: h.ask, replyToDoubt: h.reply, voteReply: h.vote, markSolved: h.solved }));
vi.mock("@/lib/doubts/data", () => ({ loadDoubts: h.list, loadDoubt: h.thread, doubtsReady: h.ready }));
vi.mock("@/app/(dashboard)/achievements/actions", () => ({ loadMyAchievements: h.ach, downloadMyCertificate: h.pdf }));
vi.mock("@/lib/enquiry", () => ({ saveEnquiry: h.enquiry }));
vi.mock("@/lib/certificates/server", () => ({
  loadCredential: h.cred,
  recordKind: (r: { kind?: string }) => r.kind ?? "completion",
  recordTitle: (r: { title?: string }) => r.title ?? "Certificate",
  verifyUrlFor: (id: string) => `https://vibhapsychology.com/verify/${id}`,
}));
vi.mock("@/components/course/course-overview", () => ({ loadCourseOverview: async () => ({ courseId: "k1", title: "Clinical", completedCount: 2, totalLessons: 5 }) }));
vi.mock("@/lib/course/mine", () => ({ loadMyCourses: async () => [{ id: "k1", title: "Clinical", is_published: true }] }));
vi.mock("@/lib/progress/strengths", () => ({ EMPTY_STRENGTHS: { strongest: [], weakest: [], all: [], hasData: false }, getStrengthsWeaknesses: async () => ({ strongest: [], weakest: [], all: [], hasData: false }) }));
vi.mock("@/app/(dashboard)/study/actions", async () => {
  const { normalise } = await import("@/lib/learn/engine");
  return { loadLearnState: async () => ({ ...normalise({ xp: 40, history: { [new Date().toISOString().slice(0, 10)]: 12 } }), owner: "x" }) };
});

import { clearDeviceCache } from "@/lib/app-api/devices";
import { GET as doubts, POST as ask } from "./doubts/route";
import { GET as thread } from "./doubts/[id]/route";
import { POST as reply } from "./doubts/[id]/replies/route";
import { POST as vote } from "./doubts/[id]/replies/[replyId]/vote/route";
import { POST as solved } from "./doubts/[id]/solved/route";
import { GET as achievements } from "./achievements/route";
import { GET as pdf } from "./achievements/[credentialId]/pdf/route";
import { GET as progress } from "./progress/route";
import { GET as settings } from "./settings/route";
import { POST as invite } from "./public/request-invitation/route";
import { GET as verify } from "./public/certificates/[certificateId]/route";

const row = (over: Record<string, unknown> = {}) => ({ id: D, title: "Why SSRIs take weeks?", topic: null, kind: "doubt", status: "open", cohortId: "c1", author: "Ravi", mine: false, replies: 1, createdAt: "2026-11-15T00:00:00Z", ...over });
const threadOf = () => ({ ...row(), body: "Asking", replies: [{ id: R, author: "Owner", mine: false, body: "Because", votes: 1, youVoted: false, isSolution: false, createdAt: "2026-11-15T01:00:00Z" }] });

beforeEach(() => {
  resetGuard();
  clearDeviceCache();
  for (const f of Object.values(h)) f.mockReset();
  h.ready.mockResolvedValue(true);
  h.list.mockResolvedValue([row(), row({ id: "mine-1", mine: true })]);
  h.thread.mockResolvedValue(threadOf());
});

describe("doubts", () => {
  it("lists the board with paging, mine only, and the student's cohorts", async () => {
    let r = await read(await doubts(appReq("/doubts?limit=1"), noParams));
    expect(r.data).toMatchObject({ items: [{ id: D }], nextCursor: "1", cohorts: [{ id: "c1", name: "Cohort 2" }], ready: true });
    expect(h.list.mock.calls[0][0]).toMatchObject({ userId: STUDENT_ID, isAdmin: false, cohortIds: ["c1"], cohortFilter: null });
    r = await read(await doubts(appReq("/doubts?mine=1"), noParams));
    expect(r.data.items.map((d: { id: string }) => d.id)).toEqual(["mine-1"]);
  });

  it("is open to lectures-only accounts and closed when Doubts is switched off", async () => {
    G.db.tables.profiles[0] = profileRow({ scope: "lectures_only" });
    expect((await read(await doubts(appReq("/doubts"), noParams))).status).toBe(200);
    G.blocks = ["doubts"];
    expect((await read(await doubts(appReq("/doubts"), noParams))).error?.code).toBe("access_block");
  });

  it("ask, reply, vote and solve run the website actions and answer the thread", async () => {
    h.ask.mockResolvedValue({ error: null, id: D });
    expect((await read(await ask(appReq("/doubts", { body: { title: "Why?", body: "x" } }), noParams))).data).toEqual({ id: D });
    h.reply.mockResolvedValue({ error: null });
    expect((await read(await reply(appReq(`/doubts/${D}/replies`, { body: { body: "Because" } }), params({ id: D })))).data.thread.replies).toHaveLength(1);
    expect(h.reply).toHaveBeenCalledWith(D, "Because");
    h.vote.mockResolvedValue({ error: null });
    await vote(appReq(`/doubts/${D}/replies/${R}/vote`, { body: { on: true } }), params({ id: D, replyId: R }));
    expect(h.vote).toHaveBeenCalledWith(D, R, true);
    h.solved.mockResolvedValue({ error: "Only the person who asked can mark it solved." });
    expect((await read(await solved(appReq(`/doubts/${D}/solved`, { body: { replyId: R } }), params({ id: D })))).error?.code).toBe("forbidden");
  });

  it("a thread the student cannot see is not found", async () => {
    h.thread.mockResolvedValue(null);
    expect((await read(await thread(appReq(`/doubts/${D}`), params({ id: D })))).status).toBe(404);
    h.reply.mockResolvedValue({ error: "That doubt isn't open to you." });
    expect((await read(await reply(appReq(`/doubts/${D}/replies`, { body: { body: "x" } }), params({ id: D })))).status).toBe(404);
  });
});

describe("achievements", () => {
  it("answers earned credentials with the verify address, and badge progress", async () => {
    h.ach.mockResolvedValue({
      earned: [{ credential_id: "VIBHA-C-1", type: "certificate", status: "issued", title: "Module 1", description: null, icon: null, tone: "lime", issued_at: "2026-11-01", revoked_at: null, revoke_reason: null, kind: "completion", expires_at: null }],
      progress: [{ id: "b1", type: "badge", title: "First steps", description: null, icon: null, tone: "lime", earned: false, status: "locked", progress: "2 of 5" }],
    });
    const r = await read(await achievements(appReq("/achievements"), noParams));
    expect(r.data.earned[0]).toMatchObject({ credentialId: "VIBHA-C-1", issuedAt: "2026-11-01", verifyUrl: "https://vibhapsychology.com/verify/VIBHA-C-1" });
    expect(r.data.progress[0].progress).toBe("2 of 5");
  });

  it("the PDF link is the student's own, issued certificate only", async () => {
    h.pdf.mockResolvedValueOnce({ url: "https://r2/x.pdf", error: null });
    expect((await read(await pdf(appReq("/achievements/VIBHA-C-1/pdf"), params({ credentialId: "VIBHA-C-1" })))).data).toEqual({ url: "https://r2/x.pdf", expiresIn: 900 });
    h.pdf.mockResolvedValueOnce({ url: null, error: "Not found." });
    expect((await read(await pdf(appReq("/achievements/VIBHA-C-2/pdf"), params({ credentialId: "VIBHA-C-2" })))).status).toBe(404);
  });
});

describe("progress and settings", () => {
  it("progress answers lectures, Study totals and 14 days", async () => {
    const r = await read(await progress(appReq("/progress"), noParams));
    expect(r.data.lectures).toEqual([{ courseId: "k1", title: "Clinical", completed: 2, total: 5 }]);
    expect(r.data.study).toMatchObject({ xp: 40, modulesTotal: expect.any(Number) });
    expect(r.data.days).toHaveLength(14);
  });

  it("progress has no Study part for a lectures-only account", async () => {
    G.db.tables.profiles[0] = profileRow({ scope: "lectures_only" });
    const r = await read(await progress(appReq("/progress"), noParams));
    expect(r.data.study).toBeNull();
    expect(r.data.strengths).toBeNull();
  });

  it("settings answers the account, the phone and the preferences", async () => {
    const r = await read(await settings(appReq("/settings"), noParams));
    expect(r.data.account).toMatchObject({ name: "Asha Rao", roleLabel: "Student", rollNumber: "VIBHA-000042" });
    expect(r.data.device).toMatchObject({ enforced: true });
    expect(r.data.notifications).toMatchObject({ push: true });
    expect(r.data.legal.termsUrl).toBeTruthy();
  });
});

describe("public", () => {
  it("request an invitation: needs the policy box, then stores it as from the app", async () => {
    const body = { name: "Meera", email: "meera@example.org", status: "student", policyAccepted: true };
    h.enquiry.mockResolvedValue({ ok: true });
    expect((await read(await invite(appReq("/public/request-invitation", { token: null, device: null, body }), noParams))).data).toEqual({ received: true });
    expect(h.enquiry).toHaveBeenCalledWith(expect.objectContaining({ name: "Meera", status: "student" }), "app");
    expect((await read(await invite(appReq("/public/request-invitation", { token: null, device: null, body: { ...body, policyAccepted: false } }), noParams))).status).toBe(400);
  });

  it("request an invitation is rate limited per network", async () => {
    G.limited.add("waitlist:unknown");
    const body = { name: "Meera", email: "meera@example.org", status: "student", policyAccepted: true };
    expect((await read(await invite(appReq("/public/request-invitation", { token: null, device: null, body }), noParams))).status).toBe(429);
  });

  it("verify answers the public facts", async () => {
    h.cred.mockResolvedValueOnce({ credential_id: "VIBHA-C-1", type: "certificate", status: "issued", revoked_at: null, expires_at: null, student_name: "Asha Rao", title: "Module 1", reason: "For finishing Module 1.", issued_at: "2026-11-01T00:00:00Z", replaced_by: null });
    let r = await read(await verify(appReq("/public/certificates/VIBHA-C-1", { token: null, device: null }), params({ certificateId: "VIBHA-C-1" })));
    expect(r.data).toMatchObject({ found: true, status: "valid", what: "Certificate", recipientName: "Asha Rao", paragraph: "For finishing Module 1." });
    h.cred.mockResolvedValueOnce(null);
    r = await read(await verify(appReq("/public/certificates/NOPE", { token: null, device: null }), params({ certificateId: "NOPE" })));
    expect(r.data).toMatchObject({ found: false, status: "unknown" });
  });
});
