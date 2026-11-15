import { beforeEach, describe, expect, it, vi } from "vitest";
import { G, resetGuard } from "@/lib/app-api/test-guard";
import { ADMIN_TOKEN, STUDENT_ID, appReq, noParams, params, profileRow, read } from "@/lib/app-api/test-kit";
import type { IssuedRow } from "@/lib/certificates/issued";

const VIEW_ID = "99999999-9999-4999-8999-999999999999";
const VIEW_TOKEN = "dmlld3h4eHh4eHh4eHh4.eyJleHAiOjQxMDI0NDQ4MDB9.sig";
const FORM = "f0f0f0f0-0000-4000-8000-000000000001";
const SUB1 = "a1a1a1a1-0000-4000-8000-000000000001";
const SUB2 = "a1a1a1a1-0000-4000-8000-000000000002";
const BADGE = "b0b0b0b0-0000-4000-8000-000000000001";

const row = (over: Partial<IssuedRow>): IssuedRow => ({
  credentialId: "VIBHA-1", userId: STUDENT_ID, type: "certificate", kind: "completion", name: "Asha Rao", title: "Foundations", status: "issued",
  revokedAt: null, revokeReason: null, expiresAt: null, issuedAt: "2026-11-10T06:00:00Z", createdAt: "2026-11-10T06:00:00Z", emailStatus: "sent",
  email: "asha@x.org", roll: "R1", cohortIds: ["c1"], studio: true, hasPdf: true, ...over,
});

const h = vi.hoisted(() => ({
  issued: vi.fn(),
  issueDraft: vi.fn(async () => ({ error: null as string | null })),
  download: vi.fn(async () => ({ url: "https://signed/pdf" as string | null, error: null as string | null })),
  listAch: vi.fn(),
  awardAll: vi.fn(async () => ({ error: null, awarded: 3, skipped: 1 })),
  award: vi.fn(),
  waitingCerts: vi.fn(async () => ({ error: null, sent: 2, left: 0 })),
  forms: vi.fn(),
  form: vi.fn(),
  subs: vi.fn(),
  emailed: vi.fn(),
  allowance: vi.fn(async () => ({ configured: true, limit: 100, left: 40 })),
  emailForm: vi.fn(),
  waitingForm: vi.fn(async () => ({ error: null, sent: 1, failed: 0, left: 3 })),
}));

vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({ revalidatePath: () => undefined, unstable_cache: (fn: unknown) => fn }));
vi.mock("@/lib/supabase/server", async () => (await import("@/lib/app-api/test-guard")).supabaseMock());
vi.mock("@/lib/app-api/supabase", async () => (await import("@/lib/app-api/test-guard")).statelessMock());
vi.mock("@/lib/flags", async () => (await import("@/lib/app-api/test-guard")).flagsMock());
vi.mock("@/lib/access/blocks", async () => (await import("@/lib/app-api/test-guard")).blocksMock());
vi.mock("@/lib/rate-limit", async () => (await import("@/lib/app-api/test-guard")).rateMock());
vi.mock("@/lib/rate-limit-fast", async () => (await import("@/lib/app-api/test-guard")).fastRateMock());
vi.mock("@/lib/certificates/issued-load", () => ({ loadIssued: h.issued }));
vi.mock("@/lib/certificates/server", () => ({ emailConfigured: () => true, siteBase: () => "https://vibhapsychology.com" }));
vi.mock("@/app/(dashboard)/admin/achievements/actions", () => ({ issueCertificate: h.issueDraft, getCredentialDownload: h.download, listAchievements: h.listAch, awardAllBadges: h.awardAll }));
vi.mock("@/app/(dashboard)/admin/credentials/actions", () => ({ awardBadge: h.award }));
vi.mock("@/app/(dashboard)/admin/credentials/studio/actions", () => ({ sendWaitingCertificateEmails: h.waitingCerts }));
vi.mock("@/lib/achievements/manual-award", () => ({ MAX_BADGE_RECIPIENTS: 300 }));
vi.mock("@/lib/forms/load", () => ({ loadForms: h.forms, loadForm: h.form, loadSubmissions: h.subs }));
vi.mock("@/lib/forms/emailed", () => ({ loadFormEmailed: h.emailed }));
vi.mock("@/lib/email/personal", async () => {
  const plan = await import("@/lib/email/personal-plan");
  return {
    emailAllowance: h.allowance,
    composeFor: (t: { email: string; name: string; vars?: Record<string, string> }, subject: string, body: string) => {
      const v = plan.mergeVars(t);
      return { subject: plan.renderMerge(subject, v), text: plan.renderMerge(body, v), html: "" };
    },
  };
});
vi.mock("@/app/(dashboard)/admin/forms/email-actions", () => ({ emailFormRespondents: h.emailForm, sendWaitingFormEmails: h.waitingForm }));

import { clearDeviceCache } from "@/lib/app-api/devices";
import { GET as issuedList } from "./certificates/issued/route";
import { POST as issueDraft } from "./certificates/[id]/issue-draft/route";
import { GET as pdf } from "./certificates/[id]/pdf/route";
import { POST as sendWaitingCerts } from "./certificates/send-waiting/route";
import { GET as badges } from "./badges/route";
import { POST as award } from "./badges/[id]/award/route";
import { POST as awardAll } from "./badges/award-all/route";
import { GET as forms } from "./forms/route";
import { GET as answers } from "./forms/[id]/route";
import { POST as emailForm } from "./forms/[id]/email/route";
import { POST as preview } from "./forms/[id]/email/preview/route";
import { POST as waitingForm } from "./forms/[id]/email/send-waiting/route";

const asAdmin = { token: ADMIN_TOKEN };
const asView = { token: VIEW_TOKEN };

beforeEach(() => {
  resetGuard();
  G.db.tables.profiles.push(profileRow({ id: VIEW_ID, email: "view@x.org", role: "view_admin" }));
  G.db.tables.app_devices.push({ id: "d9", user_id: VIEW_ID, device_id: "phone-aaaaaaaaaaaaaaaa", name: "x", platform: "android", push_token: null, active: true, activated_at: null, last_seen_at: null });
  G.users[VIEW_TOKEN] = { id: VIEW_ID, email: "view@x.org" };
  clearDeviceCache();
  for (const f of Object.values(h)) f.mockClear();
  h.issued.mockResolvedValue({
    error: false,
    rows: [
      row({}),
      row({ credentialId: "VIBHA-2", type: "badge", kind: "badge", title: "First week", studio: false, hasPdf: false, emailStatus: null }),
      row({ credentialId: "VIBHA-3", status: "revoked", revokedAt: "2026-11-12T06:00:00Z", revokeReason: "Wrong name", userId: "other", name: "Meera", cohortIds: [] }),
      row({ credentialId: "VIBHA-4", status: "draft", issuedAt: null, studio: false, userId: null, email: null, roll: null, cohortIds: [] }),
    ],
    cohorts: [{ id: "c1", name: "Cohort 2" }],
    people: new Map([[STUDENT_ID, { id: STUDENT_ID, name: "Asha Rao" }]]),
    waiting: 4,
  });
  h.listAch.mockResolvedValue([
    { id: BADGE, slug: "b", type: "badge", title: "Helper", description: null, icon: "star", tone: "lime", requirements: {}, enabled: true, issued_count: 2 },
    { id: "c", slug: "c", type: "certificate", title: "Course", description: null, icon: null, tone: "blue", requirements: { kind: "module_tests_passed" }, enabled: true, issued_count: 0 },
  ]);
  h.award.mockResolvedValue({ error: null, awarded: [{ userId: STUDENT_ID, name: "Asha", credentialId: "VIBHA-9" }], skipped: [{ name: "Meera", reason: "Already has it" }] });
  h.forms.mockResolvedValue([
    { id: FORM, title: "Interest", slug: "interest", description: null, fields: [], isActive: true, createdAt: "2026-11-01T00:00:00Z", responses: 2, lastResponseAt: "2026-11-14T00:00:00Z" },
    { id: "f2", title: "Old", slug: "old", description: null, fields: [], isActive: false, createdAt: "2026-10-01T00:00:00Z", responses: 0, lastResponseAt: null },
  ]);
  h.form.mockImplementation(async (_a: unknown, id: string) =>
    id === FORM
      ? { id: FORM, title: "Interest", slug: "interest", description: null, isActive: true, createdAt: "x", fields: [{ key: "name", label: "Your name", type: "text" }, { key: "email", label: "Email", type: "email" }, { key: "why", label: "Why join?", type: "text" }] }
      : null,
  );
  h.subs.mockResolvedValue([
    { id: SUB1, created_at: "2026-11-14T10:00:00Z", name: "aanya rao", email: "Aanya@x.org", phone: "999", contact_id: null, responses: { name: "aanya rao", email: "Aanya@x.org", why: "Patients" } },
    { id: SUB2, created_at: "2026-11-13T10:00:00Z", name: null, email: null, phone: null, contact_id: null, responses: { why: ["a", "b"] } },
  ]);
  h.emailed.mockResolvedValue({ marks: { "aanya@x.org": { lastSentAt: "2026-11-14T11:00:00Z", sent: 1, waiting: 0, failed: 0 } }, waiting: 0 });
  h.emailForm.mockResolvedValue({ error: null, sent: ["Aanya"], queued: [], failed: [], noEmail: ["No name"], duplicates: 0, remainingToday: 39, queueFailed: false });
});

describe("who may call the new admin routes", () => {
  it("students get forbidden everywhere", async () => {
    for (const r of [issuedList(appReq("/admin/certificates/issued"), noParams), badges(appReq("/admin/badges"), noParams), forms(appReq("/admin/forms"), noParams), answers(appReq(`/admin/forms/${FORM}`), params({ id: FORM }))]) {
      expect((await read(await r)).error?.code).toBe("forbidden");
    }
  });

  it("view-only admins read but every write is refused before the website runs", async () => {
    expect((await read(await issuedList(appReq("/admin/certificates/issued", asView), noParams))).data.canWrite).toBe(false);
    expect((await read(await forms(appReq("/admin/forms", asView), noParams))).data.canWrite).toBe(false);
    const writes = [
      issueDraft(appReq("/admin/certificates/VIBHA-4/issue-draft", { ...asView, method: "POST" }), params({ id: "VIBHA-4" })),
      sendWaitingCerts(appReq("/admin/certificates/send-waiting", { ...asView, method: "POST" }), noParams),
      award(appReq(`/admin/badges/${BADGE}/award`, { ...asView, body: { userIds: [STUDENT_ID] } }), params({ id: BADGE })),
      awardAll(appReq("/admin/badges/award-all", { ...asView, method: "POST" }), noParams),
      emailForm(appReq(`/admin/forms/${FORM}/email`, { ...asView, body: { submissionIds: "all", subject: "Hi", body: "Hello" } }), params({ id: FORM })),
      waitingForm(appReq(`/admin/forms/${FORM}/email/send-waiting`, { ...asView, method: "POST" }), params({ id: FORM })),
    ];
    for (const w of writes) expect((await read(await w)).error?.code).toBe("forbidden");
    for (const f of [h.issueDraft, h.waitingCerts, h.award, h.awardAll, h.emailForm, h.waitingForm]) expect(f).not.toHaveBeenCalled();
  });
});

describe("certificates, issued", () => {
  it("lists certificates and badges together with status words and no nulls where values are promised", async () => {
    const r = await read(await issuedList(appReq("/admin/certificates/issued", asAdmin), noParams));
    expect(r.status).toBe(200);
    expect(r.data).toMatchObject({ v: 1, total: 4, waiting: 4, emailOn: true, canWrite: true, person: null, nextCursor: null, counts: { certificate: 3, badge: 1, completion: 3 } });
    const [a, b, c, d] = r.data.items;
    expect(a).toMatchObject({ credentialId: "VIBHA-1", status: "valid", statusLine: "Valid", typeLabel: expect.any(String), canCorrect: true, isDraft: false, verifyUrl: "https://vibhapsychology.com/verify/VIBHA-1", issuedDay: "10 Nov 2026" });
    expect(b).toMatchObject({ type: "badge", typeLabel: "Badge", hasPdf: false });
    expect(c).toMatchObject({ status: "revoked", revokeReason: "Wrong name" });
    expect(d).toMatchObject({ status: "draft", isDraft: true, issuedDay: "Not issued", cohortIds: [] });
    for (const it of r.data.items) for (const k of ["name", "title", "statusLine", "typeLabel", "issuedDay", "verifyUrl", "recordStatus"]) expect(typeof it[k]).toBe("string");
    expect(r.data.types.map((t: { id: string }) => t.id)).toContain("badge");
  });

  it("filters by type, status, cohort, person and search; counts stay before the type filter; pages", async () => {
    const badgesOnly = await read(await issuedList(appReq("/admin/certificates/issued?type=badge", asAdmin), noParams));
    expect(badgesOnly.data.items.map((i: { credentialId: string }) => i.credentialId)).toEqual(["VIBHA-2"]);
    expect(badgesOnly.data.counts.certificate).toBe(3);
    expect((await read(await issuedList(appReq("/admin/certificates/issued?status=revoked", asAdmin), noParams))).data.total).toBe(1);
    expect((await read(await issuedList(appReq("/admin/certificates/issued?cohort=c1", asAdmin), noParams))).data.total).toBe(2);
    expect((await read(await issuedList(appReq("/admin/certificates/issued?q=meera", asAdmin), noParams))).data.total).toBe(1);
    const mine = await read(await issuedList(appReq(`/admin/certificates/issued?student=${STUDENT_ID}`, asAdmin), noParams));
    expect(mine.data).toMatchObject({ total: 2, person: { id: STUDENT_ID, name: "Asha Rao" } });
    const p1 = await read(await issuedList(appReq("/admin/certificates/issued?limit=3", asAdmin), noParams));
    expect(p1.data).toMatchObject({ nextCursor: "3" });
    expect((await read(await issuedList(appReq("/admin/certificates/issued?limit=3&cursor=3", asAdmin), noParams))).data.items).toHaveLength(1);
  });

  it("answers unavailable when the list cannot be read", async () => {
    h.issued.mockResolvedValueOnce({ error: true, rows: [], cohorts: [], people: new Map(), waiting: 0 });
    expect((await read(await issuedList(appReq("/admin/certificates/issued", asAdmin), noParams))).error?.code).toBe("unavailable");
  });

  it("issues a draft, gives the PDF address and sends waiting emails through the website's actions", async () => {
    expect((await read(await issueDraft(appReq("/admin/certificates/VIBHA-4/issue-draft", { ...asAdmin, method: "POST" }), params({ id: "VIBHA-4" })))).data).toEqual({ issued: true });
    expect(h.issueDraft).toHaveBeenCalledWith("VIBHA-4");
    h.issueDraft.mockResolvedValueOnce({ error: "Credential not found." });
    expect((await read(await issueDraft(appReq("/admin/certificates/VIBHA-8/issue-draft", { ...asAdmin, method: "POST" }), params({ id: "VIBHA-8" })))).error?.code).toBe("not_found");
    h.issueDraft.mockResolvedValueOnce({ error: "Set an authorised signature asset on this certificate first." });
    expect((await read(await issueDraft(appReq("/admin/certificates/VIBHA-8/issue-draft", { ...asAdmin, method: "POST" }), params({ id: "VIBHA-8" })))).error).toMatchObject({ code: "bad_request", message: expect.stringContaining("signature") });
    expect((await read(await pdf(appReq("/admin/certificates/VIBHA-1/pdf", asView), params({ id: "VIBHA-1" })))).data).toEqual({ url: "https://signed/pdf", expiresInSeconds: 900 });
    h.download.mockResolvedValueOnce({ url: null, error: "No certificate file." });
    expect((await read(await pdf(appReq("/admin/certificates/VIBHA-2/pdf", asAdmin), params({ id: "VIBHA-2" })))).error?.code).toBe("not_found");
    expect((await read(await sendWaitingCerts(appReq("/admin/certificates/send-waiting", { ...asAdmin, method: "POST" }), noParams))).data).toEqual({ sent: 2, failed: 0, left: 0 });
  });
});

describe("badges", () => {
  it("lists only badges and gives one by hand", async () => {
    const r = await read(await badges(appReq("/admin/badges", asView), noParams));
    expect(r.data).toEqual({ v: 1, canWrite: false, maxRecipients: 300, badges: [{ id: BADGE, title: "Helper", description: null, icon: "star", tone: "lime", enabled: true, issuedCount: 2, automatic: false }] });
    const a = await read(await award(appReq(`/admin/badges/${BADGE}/award`, { ...asAdmin, body: { userIds: [STUDENT_ID] } }), params({ id: BADGE })));
    expect(a.data).toEqual({ awarded: [{ userId: STUDENT_ID, name: "Asha", credentialId: "VIBHA-9" }], skipped: [{ name: "Meera", reason: "Already has it" }] });
    expect(h.award).toHaveBeenCalledWith(BADGE, [STUDENT_ID]);
    expect((await read(await award(appReq(`/admin/badges/${BADGE}/award`, { ...asAdmin, body: { userIds: [] } }), params({ id: BADGE })))).error?.code).toBe("bad_request");
    expect((await read(await award(appReq("/admin/badges/nope/award", { ...asAdmin, body: { userIds: [STUDENT_ID] } }), params({ id: "nope" })))).error?.code).toBe("not_found");
    expect((await read(await awardAll(appReq("/admin/badges/award-all", { ...asAdmin, method: "POST" }), noParams))).data).toEqual({ awarded: 3, skipped: 1 });
  });
});

describe("forms: email the people who answered", () => {
  it("lists forms with counts and links", async () => {
    const r = await read(await forms(appReq("/admin/forms", asAdmin), noParams));
    expect(r.data).toMatchObject({ v: 1, total: 2, open: 1, canWrite: true });
    expect(r.data.forms[0]).toMatchObject({ id: FORM, title: "Interest", open: true, answers: 2, url: expect.stringMatching(/\/f\/interest$/) });
    expect(r.data.forms[1].lastAnswerAt).toBeNull();
  });

  it("gives the answers with who was emailed, strings never null, identity questions out of the answers", async () => {
    const r = await read(await answers(appReq(`/admin/forms/${FORM}`, asAdmin), params({ id: FORM })));
    expect(r.data).toMatchObject({ v: 1, total: 2, waiting: 0, allowance: { left: 40 }, canWrite: true, form: { id: FORM, open: true } });
    expect(r.data.mergeFields.map((m: { key: string }) => m.key)).toEqual(["first_name", "name", "email", "form"]);
    const [a, b] = r.data.items;
    expect(a).toMatchObject({ id: SUB1, name: "aanya rao", email: "Aanya@x.org", emailed: { sent: 1 } });
    expect(a.answers).toEqual([{ key: "why", label: "Why join?", text: "Patients" }]);
    expect(b).toMatchObject({ name: "", email: "", phone: "", emailed: null });
    expect(b.answers[0].text).toBe("a, b");
    expect((await read(await answers(appReq(`/admin/forms/${FORM}?emailed=no`, asAdmin), params({ id: FORM })))).data.total).toBe(1);
    expect((await read(await answers(appReq(`/admin/forms/${FORM}?q=patients`, asAdmin), params({ id: FORM })))).data.total).toBe(1);
    expect((await read(await answers(appReq("/admin/forms/x", asAdmin), params({ id: "x" })))).error?.code).toBe("not_found");
    expect((await read(await answers(appReq("/admin/forms/f9f9f9f9-0000-4000-8000-000000000009", asAdmin), params({ id: "f9f9f9f9-0000-4000-8000-000000000009" })))).error?.code).toBe("not_found");
  });

  it("emails respondents through the website's action and never takes addresses from the app", async () => {
    const r = await read(await emailForm(appReq(`/admin/forms/${FORM}/email`, { ...asAdmin, body: { submissionIds: [SUB1], subject: "Hi {first_name}", body: "Hello", emails: ["evil@x.org"] } }), params({ id: FORM })));
    expect(r.data).toEqual({ sent: ["Aanya"], queued: [], failed: [], noEmail: ["No name"], duplicates: 0, remainingToday: 39, queueFailed: false });
    expect(h.emailForm).toHaveBeenCalledWith({ formId: FORM, submissionIds: [SUB1], subject: "Hi {first_name}", body: "Hello" });
    h.emailForm.mockResolvedValueOnce({ error: "Write a subject.", sent: [], queued: [], failed: [], noEmail: [], duplicates: 0, remainingToday: 0, queueFailed: false });
    expect((await read(await emailForm(appReq(`/admin/forms/${FORM}/email`, { ...asAdmin, body: { submissionIds: "all", subject: "", body: "x" } }), params({ id: FORM })))).error).toMatchObject({ code: "bad_request", message: "Write a subject." });
    h.emailForm.mockResolvedValueOnce({ error: "Email isn't set up on this site.", sent: [], queued: [], failed: [], noEmail: [], duplicates: 0, remainingToday: 0, queueFailed: false });
    expect((await read(await emailForm(appReq(`/admin/forms/${FORM}/email`, { ...asAdmin, body: { submissionIds: "all", subject: "a", body: "x" } }), params({ id: FORM })))).error?.code).toBe("unavailable");
    expect((await read(await emailForm(appReq(`/admin/forms/${FORM}/email`, { ...asAdmin, body: { submissionIds: ["not-a-uuid"], subject: "a", body: "x" } }), params({ id: FORM })))).error?.code).toBe("bad_request");
    expect(G.limits).toContain(`app:formemail:22222222-2222-4222-8222-222222222222`);
  });

  it("previews one person's email, merged, and flags unknown fields", async () => {
    const r = await read(await preview(appReq(`/admin/forms/${FORM}/email/preview`, { ...asView, body: { submissionId: SUB1, subject: "Hi {first_name}", body: "About {form} {oops}" } }), params({ id: FORM })));
    expect(r.data).toEqual({ to: "Aanya@x.org", subject: "Hi Aanya", text: "About Interest {oops}", unknownFields: ["oops"] });
    expect((await read(await preview(appReq(`/admin/forms/${FORM}/email/preview`, { ...asAdmin, body: { submissionId: "a1a1a1a1-0000-4000-8000-000000000009", subject: "a", body: "b" } }), params({ id: FORM })))).error?.code).toBe("not_found");
  });

  it("sends a form's waiting emails", async () => {
    expect((await read(await waitingForm(appReq(`/admin/forms/${FORM}/email/send-waiting`, { ...asAdmin, method: "POST" }), params({ id: FORM })))).data).toEqual({ sent: 1, failed: 0, left: 3 });
    expect(h.waitingForm).toHaveBeenCalledWith(FORM);
  });
});
