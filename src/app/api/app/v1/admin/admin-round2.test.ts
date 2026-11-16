import { beforeEach, describe, expect, it, vi } from "vitest";
import { G, resetGuard } from "@/lib/app-api/test-guard";
import { ADMIN_ID, ADMIN_TOKEN, STUDENT_ID, appReq, noParams, params, profileRow, read } from "@/lib/app-api/test-kit";

const VIEW_ID = "99999999-9999-4999-8999-999999999999";
const VIEW_TOKEN = "dmlld3h4eHh4eHh4eHh4.eyJleHAiOjQxMDI0NDQ4MDB9.sig";
const COHORT = "c0c0c0c0-0000-4000-8000-000000000001";
const TYPE = "a0a0a0a0-0000-4000-8000-000000000001";
const ENTRY = "e0e0e0e0-0000-4000-8000-000000000001";
const COURSE = "d0d0d0d0-0000-4000-8000-000000000001";

const roster = (over: Record<string, unknown>) => ({
  id: STUDENT_ID, name: "Asha Rao", email: "asha@example.com", roll: "R1", mobile: null, scope: "full", blocked: false, expiresAt: null, createdAt: null,
  account: "active", presence: "week", lastSeen: "2026-11-15T06:00:00Z", cohorts: [{ id: COHORT, name: "Cohort 2" }], min7: 90, min30: 300, activeDays30: 5,
  lecturesDone: 1, lecturesStarted: 2, lecturesAvailable: 4, watchMin: 10, xp: 0, detailsDone: true, flags: [], ...over,
});

const h = vi.hoisted(() => ({
  summaries: vi.fn(),
  cohort: vi.fn(),
  roster: vi.fn(),
  messages: vi.fn(),
  settings: vi.fn(),
  saveSigs: vi.fn(async () => ({ error: null as string | null })),
  uploadSig: vi.fn(async () => ({ error: null as string | null })),
  anyone: vi.fn(),
  anyonePreview: vi.fn(),
  listAch: vi.fn(),
  saveAch: vi.fn(async () => ({ error: null as string | null, id: "a0a0a0a0-0000-4000-8000-000000000009" as string | undefined })),
  enable: vi.fn(async () => ({ error: null as string | null })),
  eligible: vi.fn(async () => [{ id: STUDENT_ID, name: "Asha R.", reason: "Finished the course" }]),
  draft: vi.fn(async () => ({ error: null as string | null, credentialId: "VIBHA-D1" as string | undefined })),
  sigAsset: vi.fn(async () => ({ error: null as string | null })),
  support: vi.fn(),
  createKey: vi.fn(async () => ({ error: null as string | null, plain: "vibha_sk_secret1234" as string | undefined, last4: "1234" as string | undefined })),
  rotateKey: vi.fn(async () => ({ error: null as string | null, plain: "vibha_sk_new5678" as string | undefined, last4: "5678" as string | undefined })),
  revokeKey: vi.fn(async () => ({ error: null as string | null })),
  revokeLegacy: vi.fn(async () => ({ error: null as string | null })),
  doubts: vi.fn(async () => [] as unknown[]),
  pipeline: vi.fn(),
  timeline: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({ revalidatePath: () => undefined, unstable_cache: (fn: unknown) => fn }));
vi.mock("next/server", async (orig) => ({ ...(await orig<typeof import("next/server")>()), after: (fn: () => unknown) => void fn() }));
vi.mock("@/lib/supabase/server", async () => (await import("@/lib/app-api/test-guard")).supabaseMock());
vi.mock("@/lib/app-api/supabase", async () => (await import("@/lib/app-api/test-guard")).statelessMock());
vi.mock("@/lib/flags", async () => (await import("@/lib/app-api/test-guard")).flagsMock());
vi.mock("@/lib/access/blocks", async () => (await import("@/lib/app-api/test-guard")).blocksMock());
vi.mock("@/lib/rate-limit", async () => (await import("@/lib/app-api/test-guard")).rateMock());
vi.mock("@/lib/rate-limit-fast", async () => (await import("@/lib/app-api/test-guard")).fastRateMock());
vi.mock("@/lib/people/hidden-ids", () => ({ loadHiddenIds: async () => new Set<string>() }));
vi.mock("@/lib/cohorts/admin-data", () => ({ loadCohortSummaries: h.summaries, loadCohort: h.cohort }));
vi.mock("@/lib/people/roster-data", () => ({ loadRoster: h.roster }));
vi.mock("@/lib/people/student-messages", () => ({ loadStudentMessages: h.messages }));
vi.mock("@/lib/certificates/settings-load", () => ({ loadCertificateSettings: h.settings, loadDefaultSignatories: async () => [] }));
vi.mock("@/lib/certificates/server", () => ({ siteBase: () => "https://vibhapsychology.com", emailConfigured: () => true }));
vi.mock("@/app/(dashboard)/admin/credentials/settings/actions", () => ({ saveDefaultSignatories: h.saveSigs, uploadSignatureImage: h.uploadSig }));
vi.mock("@/app/(dashboard)/admin/credentials/actions", () => ({ issueCertificateToAnyone: h.anyone, previewCertificateToAnyone: h.anyonePreview }));
vi.mock("@/app/(dashboard)/admin/achievements/actions", () => ({ listAchievements: h.listAch, saveAchievement: h.saveAch, setAchievementEnabled: h.enable, listCertificateEligible: h.eligible, createCertificateDraft: h.draft, saveSignatureAsset: h.sigAsset }));
vi.mock("@/lib/achievements/rules", () => ({ REQUIREMENT_KINDS: ["module_complete", "sections_read", "xp", "watch_seconds", "course_complete", "module_tests_passed"], moduleFacets: () => [{ id: "m1", title: "Module one" }] }));
vi.mock("@/lib/auth/support-state", () => ({ loadSupportState: h.support, MAX_LIVE_KEYS: 10 }));
vi.mock("@/app/(dashboard)/admin/tools/master-actions", () => ({ createSupportKey: h.createKey, rotateSupportKey: h.rotateKey, revokeSupportKey: h.revokeKey, revokeLegacyKey: h.revokeLegacy }));
vi.mock("@/lib/doubts/data", () => ({ doubtsReady: async () => true, loadDoubts: h.doubts }));
vi.mock("@/lib/crm/people", async (orig) => ({ ...(await orig<typeof import("@/lib/crm/people")>()), loadPipeline: h.pipeline, loadTimeline: h.timeline }));

import { clearDeviceCache } from "@/lib/app-api/devices";
import { personKey } from "@/lib/crm/people";
import { GET as cohorts } from "./cohorts/route";
import { GET as cohort } from "./cohorts/[id]/route";
import { GET as settings, PUT as saveSettings } from "./certificates/settings/route";
import { POST as uploadSig } from "./certificates/signatures/route";
import { POST as anyone } from "./certificates/anyone/route";
import { POST as anyonePreview } from "./certificates/anyone/preview/route";
import { GET as types, POST as newType } from "./certificates/types/route";
import { PUT as editType } from "./certificates/types/[id]/route";
import { POST as enableType } from "./certificates/types/[id]/enabled/route";
import { GET as eligible } from "./certificates/types/[id]/eligible/route";
import { POST as drafts } from "./certificates/types/[id]/drafts/route";
import { POST as typeSig } from "./certificates/types/[id]/signature/route";
import { GET as system } from "./system/route";
import { POST as makeKey } from "./system/support-keys/route";
import { POST as rotate } from "./system/support-keys/[id]/rotate/route";
import { POST as revoke } from "./system/support-keys/[id]/revoke/route";
import { POST as legacy } from "./system/legacy-key/revoke/route";
import { GET as studentMsgs } from "./students/[id]/messages/route";
import { GET as doubts } from "./doubts/route";
import { GET as signoffs } from "./review/signoffs/route";
import { POST as signoff } from "./review/signoffs/[id]/route";
import { GET as pushGet, PUT as pushPut } from "./push-preferences/route";
import { GET as person } from "./people/[key]/route";

const asAdmin = { token: ADMIN_TOKEN };
const asView = { token: VIEW_TOKEN };
const post = (path: string, body: unknown, who = asAdmin) => appReq(path, { ...who, body });
const put = (path: string, body: unknown, who = asAdmin) => appReq(path, { ...who, method: "PUT", body });

beforeEach(() => {
  resetGuard({ supervision_entries: [{ id: ENTRY, user_id: STUDENT_ID, activity: "Intake", hours: 2, date: "2026-11-14", supervisor_name: "Dr S", competency_id: null, signoff_status: "requested" }], admin_settings: [], courses: [{ id: COURSE, title: "Clinical Psychology" }] });
  G.db.tables.profiles.push(profileRow({ id: VIEW_ID, email: "view@x.org", role: "view_admin" }));
  G.db.tables.app_devices.push({ id: "d9", user_id: VIEW_ID, device_id: "phone-aaaaaaaaaaaaaaaa", name: "x", platform: "android", push_token: null, active: true, activated_at: null, last_seen_at: null });
  G.users[VIEW_TOKEN] = { id: VIEW_ID, email: "view@x.org" };
  clearDeviceCache();
  for (const f of Object.values(h)) f.mockClear();
  h.summaries.mockResolvedValue({ tablesMissing: false, unassigned: 3, cohorts: [{ id: COHORT, name: "Cohort 2", course_id: COURSE, starts_on: "2026-11-01", ends_on: null, status: "active", created_at: "x", members: 2, lectures: 4, detailsDone: 1 }] });
  h.roster.mockResolvedValue({ rows: [roster({}), roster({ id: "s2", name: "Meera", account: "invited", presence: "never", lecturesDone: 0 })], cohorts: [], publishedLectures: 4 });
  h.cohort.mockResolvedValue({
    cohort: { id: COHORT, name: "Cohort 2", course_id: COURSE, starts_on: "2026-11-01", ends_on: null, status: "active", created_at: "x" },
    members: [
      { userId: STUDENT_ID, email: "asha@example.com", name: "Asha Rao", scope: "full", status: "active", signedIn: true, setUp: true, detailsDone: true, addedAt: "x" },
      { userId: "s2", email: "meera@x.org", name: null, scope: "lectures_only", status: "active", signedIn: false, setUp: false, detailsDone: false, addedAt: "x" },
    ],
    lessonIds: new Set(["l1", "l2", "l3", "l4"]),
  });
  h.settings.mockResolvedValue({ signatories: [{ name: "Kavya Bothra", role: "COO", signatureFrom: null }], signatures: [{ id: "sig1", label: "Dr S", url: "https://img" }], email: { configured: true, limit: 100, sentToday: 8, waiting: 2 } });
  h.anyone.mockResolvedValue({ error: null, credentialId: "VIBHA-A1", linkedStudent: null, emailNote: null });
  h.anyonePreview.mockResolvedValue({ error: null, dataUrl: "data:application/pdf;base64,JVBERi0=" });
  h.listAch.mockResolvedValue([
    { id: TYPE, slug: "first-module", type: "badge", title: "First module", description: null, module_id: "m1", course_id: null, icon: null, tone: "lime", requirements: { kind: "module_complete", module: "m1" }, enabled: true, signature_asset_path: null, signature_label: null, issued_count: 4 },
    { id: "t2", slug: "custom-guest", type: "certificate", title: "Guest", description: null, module_id: null, course_id: null, icon: null, tone: "lime", requirements: {}, enabled: false, signature_asset_path: "sig.png", signature_label: "Dr S", issued_count: 1 },
  ]);
  h.support.mockResolvedValue({ ready: true, legacy: { updatedAt: null }, keys: [{ id: "k1", label: "Laptop", last4: "9999", createdAt: "2026-11-01T00:00:00Z", createdByEmail: "o@x", revokedAt: null, lastUsedAt: null }], uses: [{ email: "asha@example.com", at: "2026-11-14T00:00:00Z" }] });
  h.messages.mockResolvedValue({
    mails: [{ id: "m1", subject: "Welcome", status: "sent", createdAt: "2026-11-10T00:00:00Z", openedAt: "2026-11-10T01:00:00Z" }, { id: "m2", subject: "Bounce", status: "failed", createdAt: "2026-11-12T00:00:00Z", openedAt: null }],
    replies: [{ id: "r1", subject: "Re: Welcome", receivedAt: "2026-11-11T00:00:00Z" }],
    notes: [{ id: "n1", title: "Class today", type: "message", createdAt: "2026-11-13T00:00:00Z", readAt: null }],
  });
  h.pipeline.mockResolvedValue({
    paymentReady: true,
    cohorts: [],
    people: [{ key: personKey("asha@example.com"), email: "asha@example.com", name: "Asha Rao", phone: "9876543210", isStudent: true, isEnquiry: true, stage: "joined", followUpAt: null, enquiredAt: "2026-11-01T00:00:00Z", source: "website", studentId: STUDENT_ID, signedIn: true, locked: false, setupDone: true, inviteSentAt: null, emailsSent: 2, opened: true, replied: false, lastContactAt: null, contacted: true, lastSeen: null, paidAt: null, paidAmount: null, cohorts: [], college: null, message: "Hi" }],
  });
  h.timeline.mockResolvedValue([{ at: "2026-11-02T00:00:00Z", kind: "email", title: "Email sent: Hello", body: null, tone: "blue" }]);
});

describe("who may call", () => {
  it("students are refused every read; view admins read but every write is refused before the website runs", async () => {
    expect((await read(await cohorts(appReq("/admin/cohorts"), noParams))).error?.code).toBe("forbidden");
    expect((await read(await system(appReq("/admin/system"), noParams))).error?.code).toBe("forbidden");
    expect((await read(await settings(appReq("/admin/certificates/settings", asView), noParams))).data.canWrite).toBe(false);
    expect((await read(await system(appReq("/admin/system", asView), noParams))).data.canWrite).toBe(false);
    const writes = [
      saveSettings(put("/admin/certificates/settings", { signatories: [{ name: "A", role: "B" }] }, asView), noParams),
      uploadSig(post("/admin/certificates/signatures", { label: "A", dataUrl: "data:image/png;base64,AA" }, asView), noParams),
      anyone(post("/admin/certificates/anyone", { name: "A", email: "a@x.org", title: "T", paragraph: "P" }, asView), noParams),
      anyonePreview(post("/admin/certificates/anyone/preview", { name: "A", email: "a@x.org", title: "T", paragraph: "P" }, asView), noParams),
      newType(post("/admin/certificates/types", { type: "badge", title: "X", rule: { kind: "xp", min: 10 } }, asView), noParams),
      editType(put(`/admin/certificates/types/${TYPE}`, { type: "badge", title: "X", rule: { kind: "xp", min: 10 } }, asView), params({ id: TYPE })),
      enableType(post(`/admin/certificates/types/${TYPE}/enabled`, { enabled: false }, asView), params({ id: TYPE })),
      eligible(appReq(`/admin/certificates/types/${TYPE}/eligible`, asView), params({ id: TYPE })),
      drafts(post(`/admin/certificates/types/${TYPE}/drafts`, { userIds: [STUDENT_ID] }, asView), params({ id: TYPE })),
      typeSig(post(`/admin/certificates/types/${TYPE}/signature`, { label: "A", dataUrl: "x" }, asView), params({ id: TYPE })),
      makeKey(post("/admin/system/support-keys", { label: "x" }, asView), noParams),
      rotate(appReq("/admin/system/support-keys/k1/rotate", { ...asView, method: "POST" }), params({ id: "k1" })),
      revoke(appReq("/admin/system/support-keys/k1/revoke", { ...asView, method: "POST" }), params({ id: "k1" })),
      legacy(appReq("/admin/system/legacy-key/revoke", { ...asView, method: "POST" }), noParams),
      signoff(post(`/admin/review/signoffs/${ENTRY}`, { decision: "signed" }, asView), params({ id: ENTRY })),
    ];
    for (const w of writes) expect((await read(await w)).error?.code).toBe("forbidden");
    for (const f of [h.saveSigs, h.uploadSig, h.anyone, h.anyonePreview, h.saveAch, h.enable, h.eligible, h.draft, h.sigAsset, h.createKey, h.rotateKey, h.revokeKey, h.revokeLegacy]) expect(f).not.toHaveBeenCalled();
    expect(G.db.tables.supervision_entries[0].signoff_status).toBe("requested");
  });
});

describe("cohorts", () => {
  it("lists cohorts with the cohort page's numbers", async () => {
    const r = await read(await cohorts(appReq("/admin/cohorts", asView), noParams));
    expect(r.data).toMatchObject({ v: 1, ready: true, unassigned: 3, canWrite: false });
    expect(r.data.items[0]).toEqual({ id: COHORT, name: "Cohort 2", status: "active", course: "Clinical Psychology", members: 2, lectures: 4, pct: 13, activeWeek: 1, behind: 1, never: 1, detailsPct: 50, starts: "2026-11-01", ends: null });
  });

  it("gives one cohort with its members and messages, and 404 for a bad id", async () => {
    G.db.tables.notifications.push({ id: "n1", batch_id: "b1", title: "Class today", created_at: "2026-11-14T00:00:00Z", read_at: "x", opened_at: null, user_id: STUDENT_ID }, { id: "n2", batch_id: "b1", title: "Class today", created_at: "2026-11-14T00:00:00Z", read_at: null, opened_at: null, user_id: "s2" });
    const r = await read(await cohort(appReq(`/admin/cohorts/${COHORT}`, asAdmin), params({ id: COHORT })));
    expect(r.data).toMatchObject({ v: 1, id: COHORT, members: 2, lectures: 4, canWrite: true, hoursWeek: 3, sessions: [] });
    expect(r.data.people[1]).toMatchObject({ id: "s2", name: "Meera", account: "invited", accountLabel: "Invited", scope: "lectures_only", presence: "never", detailsDone: false });
    expect(r.data.messages).toEqual([{ batchId: "b1", title: "Class today", sentAt: "2026-11-14T00:00:00Z", total: 2, opened: 1 }]);
    expect((await read(await cohort(appReq("/admin/cohorts/x", asAdmin), params({ id: "x" })))).error?.code).toBe("not_found");
    h.cohort.mockResolvedValueOnce(null);
    expect((await read(await cohort(appReq(`/admin/cohorts/${COHORT}`, asAdmin), params({ id: COHORT })))).error?.code).toBe("not_found");
  });
});

describe("certificate settings and no-account certificates", () => {
  it("reads and saves default signatories, uploads a signature image", async () => {
    const r = await read(await settings(appReq("/admin/certificates/settings", asAdmin), noParams));
    expect(r.data).toEqual({ v: 1, canWrite: true, signatories: [{ name: "Kavya Bothra", role: "COO", signatureFrom: null }], signatures: [{ id: "sig1", label: "Dr S", url: "https://img" }], email: { configured: true, limit: 100, sentToday: 8, waiting: 2 } });
    expect((await read(await saveSettings(put("/admin/certificates/settings", { signatories: [{ name: "Kavya", role: "COO", signatureFrom: "sig1" }] }), noParams))).status).toBe(200);
    expect(h.saveSigs).toHaveBeenCalledWith([{ name: "Kavya", role: "COO", signatureFrom: "sig1" }]);
    expect((await read(await saveSettings(put("/admin/certificates/settings", { signatories: [] }), noParams))).error?.code).toBe("bad_request");
    h.saveSigs.mockResolvedValueOnce({ error: "Add at least one signatory with a name." });
    expect((await read(await saveSettings(put("/admin/certificates/settings", { signatories: [{ name: " ", role: "" }] }), noParams))).error).toMatchObject({ code: "bad_request", message: "Add at least one signatory with a name." });
    expect((await read(await uploadSig(post("/admin/certificates/signatures", { label: "Dr S", dataUrl: "data:image/png;base64,AA" }), noParams))).status).toBe(200);
    expect(h.uploadSig).toHaveBeenCalledWith("Dr S", "data:image/png;base64,AA");
  });

  it("issues and previews a no-account certificate through the website's actions", async () => {
    const body = { name: "Guest", email: "g@x.org", title: "Talk", paragraph: "Gave a talk", emailIt: false };
    const r = await read(await anyone(post("/admin/certificates/anyone", body), noParams));
    expect(r.data).toEqual({ credentialId: "VIBHA-A1", verifyUrl: "https://vibhapsychology.com/verify/VIBHA-A1", linkedStudent: null, emailNote: null });
    expect(h.anyone).toHaveBeenCalledWith(expect.objectContaining({ name: "Guest", email: "g@x.org", email_it: false, phone: "" }));
    h.anyone.mockResolvedValueOnce({ error: "Type a real email address." });
    expect((await read(await anyone(post("/admin/certificates/anyone", { ...body, email: "nope" }), noParams))).error).toMatchObject({ code: "bad_request", message: "Type a real email address." });
    expect((await read(await anyonePreview(post("/admin/certificates/anyone/preview", body), noParams))).data).toEqual({ pdfBase64: "JVBERi0=", fileName: "certificate-preview.pdf" });
    expect(G.limits).toContain(`app:certanyone:${ADMIN_ID}`);
  });
});

describe("badge and certificate types", () => {
  it("lists types with rules in words, editable rules only where the form can edit them", async () => {
    const r = await read(await types(appReq("/admin/certificates/types", asView), noParams));
    expect(r.data).toMatchObject({ v: 1, canWrite: false, modules: [{ id: "m1", title: "Module one" }], courses: [{ id: COURSE, title: "Clinical Psychology" }] });
    expect(r.data.items[0]).toMatchObject({ id: TYPE, ruleText: "Finish Module one", rule: { kind: "module_complete", module: "m1" }, madeForYou: false, issued: 4, hasSignature: false });
    expect(r.data.items[1]).toMatchObject({ ruleText: "Given by hand", rule: null, madeForYou: true, hasSignature: true, signatureLabel: "Dr S" });
    expect(r.data.rules).toHaveLength(6);
  });

  it("saves, switches, finds eligible students, makes drafts and saves a signature", async () => {
    expect((await read(await newType(post("/admin/certificates/types", { type: "certificate", title: "Course", rule: { kind: "course_complete", course_id: COURSE } }), noParams))).data).toEqual({ id: "a0a0a0a0-0000-4000-8000-000000000009" });
    expect(h.saveAch).toHaveBeenCalledWith(expect.objectContaining({ id: null, type: "certificate", course_id: COURSE, requirements: { kind: "course_complete", course_id: COURSE }, tone: "lime" }));
    expect((await read(await newType(post("/admin/certificates/types", { type: "badge", title: "X", rule: { kind: "magic" } }), noParams))).error?.code).toBe("bad_request");
    expect((await read(await editType(put(`/admin/certificates/types/${TYPE}`, { type: "badge", title: "First", rule: { kind: "sections_read", module: "m1", count: 3 } }), params({ id: TYPE })))).data).toEqual({ id: TYPE });
    expect(h.saveAch).toHaveBeenLastCalledWith(expect.objectContaining({ id: TYPE, module_id: "m1" }));
    expect((await read(await enableType(post(`/admin/certificates/types/${TYPE}/enabled`, { enabled: false }), params({ id: TYPE })))).data).toEqual({ enabled: false });
    expect((await read(await eligible(appReq(`/admin/certificates/types/${TYPE}/eligible`, asAdmin), params({ id: TYPE })))).data.items).toHaveLength(1);
    h.draft.mockResolvedValueOnce({ error: null, credentialId: "VIBHA-D1" }).mockResolvedValueOnce({ error: "This student is not currently eligible.", credentialId: undefined });
    expect((await read(await drafts(post(`/admin/certificates/types/${TYPE}/drafts`, { userIds: [STUDENT_ID, VIEW_ID] }), params({ id: TYPE })))).data).toEqual({ made: [{ userId: STUDENT_ID, credentialId: "VIBHA-D1" }], failed: [{ userId: VIEW_ID, reason: "This student is not currently eligible." }] });
    h.sigAsset.mockResolvedValueOnce({ error: "Upload a PNG or JPEG image." });
    expect((await read(await typeSig(post(`/admin/certificates/types/${TYPE}/signature`, { label: "A", dataUrl: "x" }), params({ id: TYPE })))).error?.code).toBe("bad_request");
    expect((await read(await enableType(post("/admin/certificates/types/zz/enabled", { enabled: true }), params({ id: "zz" })))).error?.code).toBe("not_found");
  });
});

describe("system and support keys", () => {
  it("lists key views only and the usage lines it can read", async () => {
    const r = await read(await system(appReq("/admin/system", asAdmin), noParams));
    expect(r.data).toMatchObject({ v: 1, ready: true, canWrite: true, legacyKeyOn: true, maxLive: 10, usage: [], uses: [{ email: "asha@example.com" }] });
    expect(r.data.keys[0]).toEqual({ id: "k1", label: "Laptop", last4: "9999", createdAt: "2026-11-01T00:00:00Z", createdByEmail: "o@x", revokedAt: null, revokedByEmail: null, lastUsedAt: null });
    expect(JSON.stringify(r.data)).not.toMatch(/hash|salt/);
  });

  it("makes a key shown once, rotates, revokes, turns off the old key", async () => {
    expect((await read(await makeKey(post("/admin/system/support-keys", { label: "Phone" }), noParams))).data).toEqual({ plain: "vibha_sk_secret1234", last4: "1234" });
    expect(h.createKey).toHaveBeenCalledWith("Phone");
    h.createKey.mockResolvedValueOnce({ error: "There are already 10 live keys. Revoke one first.", plain: undefined, last4: undefined });
    expect((await read(await makeKey(post("/admin/system/support-keys", { label: "Phone" }), noParams))).error?.message).toMatch(/10 live keys/);
    expect((await read(await rotate(appReq("/admin/system/support-keys/k1/rotate", { ...asAdmin, method: "POST" }), params({ id: "k1" })))).data).toEqual({ plain: "vibha_sk_new5678", last4: "5678" });
    expect((await read(await revoke(appReq("/admin/system/support-keys/k1/revoke", { ...asAdmin, method: "POST" }), params({ id: "k1" })))).data).toEqual({ revoked: true });
    expect((await read(await legacy(appReq("/admin/system/legacy-key/revoke", { ...asAdmin, method: "POST" }), noParams))).data).toEqual({ revoked: true });
    expect(G.limits.filter((k) => k === `app:supportkey:${ADMIN_ID}`)).toHaveLength(5);
  });
});

describe("a student's messages and doubts", () => {
  it("merges emails, replies and bells, newest first", async () => {
    const r = await read(await studentMsgs(appReq(`/admin/students/${STUDENT_ID}/messages`, asView), params({ id: STUDENT_ID })));
    expect(r.data.items.map((i: { id: string }) => i.id)).toEqual(["bell:n1", "email:m2", "reply:r1", "email:m1"]);
    expect(r.data.items[1]).toMatchObject({ from: "email", state: "Failed", failed: true, opened: false });
    expect(h.messages).toHaveBeenCalledWith(expect.anything(), STUDENT_ID, "asha@example.com");
    expect((await read(await studentMsgs(appReq("/admin/students/aaaaaaaa-0000-4000-8000-000000000000/messages", asAdmin), params({ id: "aaaaaaaa-0000-4000-8000-000000000000" })))).error?.code).toBe("not_found");
  });

  it("filters doubts to one student", async () => {
    await doubts(appReq(`/admin/doubts?student=${STUDENT_ID}`, asAdmin), noParams);
    expect(h.doubts).toHaveBeenLastCalledWith(expect.objectContaining({ authorFilter: STUDENT_ID }));
    await doubts(appReq("/admin/doubts?student=bad", asAdmin), noParams);
    expect(h.doubts).toHaveBeenLastCalledWith(expect.objectContaining({ authorFilter: null }));
  });
});

describe("sign-offs", () => {
  it("lists requested entries with names, signs one once, refuses a second time", async () => {
    const r = await read(await signoffs(appReq("/admin/review/signoffs", asView), noParams));
    expect(r.data).toEqual({ v: 1, canWrite: false, items: [{ id: ENTRY, studentId: STUDENT_ID, studentName: "Asha Rao", studentEmail: "asha@example.com", activity: "Intake", hours: 2, date: "2026-11-14", supervisor: "Dr S", competency: null, status: "requested" }] });
    expect((await read(await signoff(post(`/admin/review/signoffs/${ENTRY}`, { decision: "signed" }), params({ id: ENTRY })))).data).toEqual({ id: ENTRY, status: "signed" });
    expect(G.db.tables.supervision_entries[0].signoff_status).toBe("signed");
    expect((await read(await signoff(post(`/admin/review/signoffs/${ENTRY}`, { decision: "rejected" }), params({ id: ENTRY })))).error?.code).toBe("conflict");
    expect((await read(await signoff(post(`/admin/review/signoffs/${ENTRY}`, { decision: "maybe" }), params({ id: ENTRY })))).error?.code).toBe("bad_request");
  });
});

describe("admin push preferences", () => {
  it("each admin reads and saves their own, view admins included", async () => {
    expect((await read(await pushGet(appReq("/admin/push-preferences", asView), noParams))).data).toEqual({ newDoubt: true, newEnquiry: true, fallingBehind: false });
    expect((await read(await pushPut(put("/admin/push-preferences", { newEnquiry: false }, asView), noParams))).data).toEqual({ newDoubt: true, newEnquiry: false, fallingBehind: false });
    expect(G.db.tables.admin_settings).toEqual([expect.objectContaining({ key: `admin_push_prefs:${VIEW_ID}`, value: { newDoubt: true, newEnquiry: false, fallingBehind: false } })]);
    expect((await read(await pushGet(appReq("/admin/push-preferences", asAdmin), noParams))).data.newEnquiry).toBe(true);
    expect((await read(await pushPut(put("/admin/push-preferences", { other: true }), noParams))).error?.code).toBe("bad_request");
    expect((await read(await pushGet(appReq("/admin/push-preferences"), noParams))).error?.code).toBe("forbidden");
  });
});

describe("a person's record", () => {
  it("gives the row, facts and timeline by key", async () => {
    const key = personKey("asha@example.com");
    const r = await read(await person(appReq(`/admin/people/${key}`, asAdmin), params({ key })));
    expect(r.data).toMatchObject({ v: 1, key, name: "Asha Rao", stage: "joined", paymentReady: true, canWrite: true });
    expect(r.data.facts.find((f: { label: string }) => f.label === "Emails sent").value).toBe("2 · opened");
    expect(r.data.timeline).toEqual([{ at: "2026-11-02T00:00:00Z", kind: "email", title: "Email sent: Hello", body: null, tone: "info" }]);
    const other = personKey("nobody@x.org");
    expect((await read(await person(appReq(`/admin/people/${other}`, asAdmin), params({ key: other })))).error?.code).toBe("not_found");
    expect((await read(await person(appReq("/admin/people/%%%", asAdmin), params({ key: "%%%" })))).error?.code).toBe("not_found");
  });
});
