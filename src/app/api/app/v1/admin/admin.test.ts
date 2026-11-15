import { beforeEach, describe, expect, it, vi } from "vitest";
import { G, resetGuard } from "@/lib/app-api/test-guard";
import { ADMIN_ID, ADMIN_TOKEN, STUDENT_ID, appReq, noParams, params, profileRow, read } from "@/lib/app-api/test-kit";

const VIEW_ID = "99999999-9999-4999-8999-999999999999";
const VIEW_TOKEN = "dmlld3h4eHh4eHh4eHh4.eyJleHAiOjQxMDI0NDQ4MDB9.sig";
const D = "dddddddd-0000-4000-8000-000000000001";
const S = "eeeeeeee-0000-4000-8000-000000000001";
const F = "ffffffff-0000-4000-8000-000000000001";

const h = vi.hoisted(() => ({
  roster: vi.fn(),
  hidden: vi.fn(async () => new Set<string>(["robot"])),
  live: vi.fn(async () => [] as unknown[]),
  overview: vi.fn(),
  detail: vi.fn(),
  activity: vi.fn(),
  status: vi.fn(async () => ({ error: null })),
  loginLink: vi.fn(async () => ({ error: null as string | null })),
  notify: vi.fn(),
  batches: vi.fn(async () => ({ batches: [{ batchId: "b1", title: "Class moved", sentAt: "2026-11-15T10:00:00Z", total: 2, opened: 1, type: "message" }], ready: true })),
  recipients: vi.fn(async () => ({ courses: [{ id: "c0", title: "Course" }], cohorts: [{ id: "c1", name: "Cohort 2", status: "active" }], students: [{ id: "s1", email: "a" }, { id: "s2", email: "b" }], enrolledByCourse: {} as Record<string, string[]>, membersByCohort: { c1: ["s1"] } as Record<string, string[]> })),
  doubts: vi.fn(async () => []),
  hide: vi.fn(async () => ({ error: null })),
  inbox: vi.fn(async () => ({ ready: true, threads: [{ id: D, title: "Q", need: { reason: "unanswered" } }], emails: [] })),
  replyDoubt: vi.fn(async () => ({ error: null as string | null })),
  replyEmail: vi.fn(async () => ({ error: null })),
  draft: vi.fn(async () => ({ error: null, text: "A draft" })),
  markRead: vi.fn(async () => undefined),
  review: vi.fn(),
  approve: vi.fn(async () => ({ error: null })),
  grade: vi.fn(async () => ({ error: null })),
  fileUrl: vi.fn(async () => ({ url: "https://signed/file", error: null })),
  audioUrl: vi.fn(async () => ({ url: "https://signed/audio", error: null })),
  studio: vi.fn(),
  issue: vi.fn(),
  revoke: vi.fn(async () => ({ error: null })),
  resend: vi.fn(async () => ({ error: null, notified: true, delivery: null })),
}));

vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({ revalidatePath: () => undefined, unstable_cache: (fn: unknown) => fn }));
vi.mock("@/lib/supabase/server", async () => (await import("@/lib/app-api/test-guard")).supabaseMock());
vi.mock("@/lib/app-api/supabase", async () => (await import("@/lib/app-api/test-guard")).statelessMock());
vi.mock("@/lib/flags", async () => (await import("@/lib/app-api/test-guard")).flagsMock());
vi.mock("@/lib/access/blocks", async () => (await import("@/lib/app-api/test-guard")).blocksMock());
vi.mock("@/lib/rate-limit", async () => (await import("@/lib/app-api/test-guard")).rateMock());
vi.mock("@/lib/rate-limit-fast", async () => (await import("@/lib/app-api/test-guard")).fastRateMock());
vi.mock("@/lib/people/roster-data", () => ({ loadRoster: h.roster }));
vi.mock("@/lib/people/hidden-ids", () => ({ loadHiddenIds: h.hidden }));
vi.mock("@/lib/analytics/live", () => ({ loadLive: h.live }));
vi.mock("@/lib/analytics/activity", () => ({ loadStudentDetail: h.detail, loadActivity: h.activity }));
vi.mock("@/lib/admin/overview", () => ({ loadAdminOverview: h.overview }));
vi.mock("@/lib/doubts/data", () => ({ openComplaintCount: async () => 2, loadDoubts: h.doubts, doubtsReady: async () => true }));
vi.mock("@/app/(dashboard)/admin/students/actions", () => ({ setAccountStatus: h.status }));
vi.mock("@/app/(dashboard)/admin/cohorts/actions", () => ({ sendLoginLink: h.loginLink }));
vi.mock("@/lib/notify/send", () => ({ loadNotifyBatches: h.batches }));
vi.mock("@/app/(dashboard)/admin/emails/actions", () => ({ loadRecipientData: h.recipients }));
vi.mock("@/app/(dashboard)/admin/emails/notify-actions", () => ({ sendNotificationAction: h.notify }));
vi.mock("@/app/(dashboard)/admin/emails/mail-actions", () => ({ markRead: h.markRead }));
vi.mock("@/app/(dashboard)/doubts/actions", () => ({ adminHideDoubt: h.hide }));
vi.mock("@/app/(dashboard)/admin/inbox/data", () => ({ loadInbox: h.inbox }));
vi.mock("@/app/(dashboard)/admin/inbox/actions", () => ({ replyFromInbox: h.replyDoubt, replyEmailFromInbox: h.replyEmail, draftDoubtAnswer: h.draft }));
vi.mock("@/lib/admin/submissions-review", () => ({ loadSubmissionReview: h.review }));
vi.mock("@/app/(dashboard)/admin/submissions/actions", () => ({ approveSubmission: h.approve, returnFeedback: h.grade, getSubmissionFileUrl: h.fileUrl, getSubmissionAudioUrl: h.audioUrl }));
vi.mock("@/lib/certificates/studio-data", () => ({ loadStudioSetup: h.studio }));
vi.mock("@/lib/certificates/server", () => ({ signatureOptions: async () => [{ id: "a1", label: "Dr S", url: "https://sig" }], siteBase: () => "https://vibhapsychology.com", studioReady: async () => true }));
vi.mock("@/app/(dashboard)/admin/credentials/studio/actions", () => ({ issueStudioCertificates: h.issue, revokeStudioCertificate: h.revoke, resendStudioCertificate: h.resend }));

import { clearDeviceCache } from "@/lib/app-api/devices";
import { istDateLine } from "@/lib/app-api/admin";
import { GET as home } from "./home/route";
import { GET as students } from "./students/route";
import { GET as student } from "./students/[id]/route";
import { POST as lock } from "./students/[id]/lock/route";
import { POST as unlock } from "./students/[id]/unlock/route";
import { POST as loginLink } from "./students/[id]/login-link/route";
import { GET as activity } from "./activity/route";
import { GET as messages, POST as send } from "./messages/route";
import { GET as doubts } from "./doubts/route";
import { POST as hide } from "./doubts/[id]/hide/route";
import { POST as replyDoubt } from "./doubts/[id]/reply/route";
import { POST as draft } from "./doubts/[id]/draft/route";
import { GET as inbox } from "./inbox/route";
import { POST as replyEmail } from "./inbox/emails/[id]/reply/route";
import { POST as markRead } from "./inbox/emails/[id]/read/route";
import { GET as submissions } from "./submissions/route";
import { POST as approve } from "./submissions/[id]/approve/route";
import { POST as grade } from "./submissions/[id]/grade/route";
import { GET as subFile } from "./submissions/[id]/files/[fileId]/route";
import { GET as subAudio } from "./submissions/[id]/audio/route";
import { GET as studio } from "./certificates/studio/route";
import { POST as preview } from "./certificates/preview/route";
import { POST as issue } from "./certificates/issue/route";
import { POST as revoke } from "./certificates/[id]/revoke/route";
import { POST as resend } from "./certificates/[id]/resend/route";

const rosterRow = (id: string, over: Record<string, unknown> = {}) => ({
  id, name: `Name ${id}`, email: `${id}@x.org`, roll: null, mobile: null, scope: "full", blocked: false, expiresAt: null, createdAt: null, account: "active", presence: "week", lastSeen: null,
  cohorts: [{ id: "c1", name: "Cohort 2" }], min7: 30, min30: 90, activeDays30: 4, lecturesDone: 1, lecturesStarted: 2, lecturesAvailable: 6, watchMin: 40, xp: 10, detailsDone: true, flags: [], ...over,
});
const ROSTER = () => ({ rows: [rosterRow("s1", { flags: ["behind", "quiet"], presence: "now" }), rosterRow("s2", { blocked: true, name: "Meera" }), rosterRow("robot")], cohorts: [{ id: "c1", name: "Cohort 2", status: "active" }], publishedLectures: 6 });

const certBody = { kind: "completion", title: "Foundations", issuedOn: "2026-11-15", signatories: [{ name: "Dr S", role: "Director", signatureFrom: "a1" }], recipients: [{ userId: STUDENT_ID, name: "Asha Rao" }], email: false };

beforeEach(() => {
  resetGuard();
  G.db.tables.profiles.push(profileRow({ id: VIEW_ID, email: "view@x.org", role: "view_admin" }));
  G.db.tables.app_devices.push({ id: "d9", user_id: VIEW_ID, device_id: "phone-aaaaaaaaaaaaaaaa", name: "x", platform: "android", push_token: null, active: true, activated_at: null, last_seen_at: null });
  G.db.tables.submissions = [{ id: S, audio_storage_path: "u/a.m4a" }];
  G.db.tables.submission_files = [{ id: F, submission_id: S, storage_path: "u/f.pdf" }];
  G.users[VIEW_TOKEN] = { id: VIEW_ID, email: "view@x.org" };
  clearDeviceCache();
  for (const f of Object.values(h)) f.mockClear();
  h.roster.mockResolvedValue(ROSTER());
  h.overview.mockResolvedValue({
    students: 2, activeThisWeek: 2, quietCount: 0, notStarted: 0, neverIn: 0, onNow: 1, dbPct: 12, complaints: 2, pendingSubmissions: 3,
    actions: [{ label: "Student concerns", count: 2, detail: "d", href: "/admin/inbox", urgent: true, icon: "shieldAlert" }],
    todo: [{ label: "Student concerns", count: 2, detail: "d", href: "/admin/inbox", urgent: true, icon: "shieldAlert" }],
    totalToDo: 2,
    cohortCards: [{ id: "c1", name: "Cohort 2", members: 2, week: 2, behind: 1, pct: 17 }],
    live: [{ id: "s1", name: "Name s1", meta: "Cohort 2" }, { id: "robot", name: "Robot", meta: "" }],
    roster: ROSTER(),
  });
  h.detail.mockResolvedValue({ profile: { id: STUDENT_ID }, daily: [], recent: [{ at: "2026-11-15T09:00:00Z", what: "Lecture 1", min: 5 }] });
  h.notify.mockResolvedValue({ error: null, created: 1, emailed: 0, emailFailed: 0, batchId: "b2" });
  h.review.mockResolvedValue({
    enriched: [{ id: S, user_id: STUDENT_ID, studentEmail: "a@x", assignmentId: "a1", assignmentTitle: "Essay", lessonTitle: "L1", courseId: "c0", courseTitle: "Course", status: "pending_review", submitted_at: "2026-11-15T08:00:00Z", is_late: false, text_content: "hi", audio_storage_path: null, files: [{ id: F, original_name: "f.pdf", format: "pdf", storage_path: "u/f.pdf" }], score: null, feedback: null, note: null }],
    pendingCount: 1, courses: [{ id: "c0", title: "Course" }], assignments: [{ id: "a1", title: "Essay", lesson_id: "l1" }], lessons: [{ id: "l1", course_id: "c0" }],
  });
  h.studio.mockResolvedValue({ setup: { ready: true, today: "2026-11-15", siteUrl: "x", students: [], cohorts: [], courses: [], signatures: [], email: { configured: false, remaining: 0, limit: 0 } } });
  h.issue.mockResolvedValue({ error: null, issued: [{ credentialId: "VIBHA-1", userId: STUDENT_ID, name: "Asha Rao" }], skipped: [], delivery: null, batchId: "bb" });
});

const asAdmin = { token: ADMIN_TOKEN };
const asView = { token: VIEW_TOKEN };

describe("who may call admin routes", () => {
  const writes: Array<[string, () => Promise<Response>]> = [
    ["lock", () => lock(appReq(`/admin/students/${STUDENT_ID}/lock`, { ...asView, body: {} }), params({ id: STUDENT_ID }))],
    ["login link", () => loginLink(appReq(`/admin/students/${STUDENT_ID}/login-link`, { ...asView, method: "POST" }), params({ id: STUDENT_ID }))],
    ["message", () => send(appReq("/admin/messages", { ...asView, body: { to: "everyone", title: "t", body: "b" } }), noParams)],
    ["doubt reply", () => replyDoubt(appReq(`/admin/doubts/${D}/reply`, { ...asView, body: { text: "x" } }), params({ id: D }))],
    ["doubt draft", () => draft(appReq(`/admin/doubts/${D}/draft`, { ...asView, method: "POST" }), params({ id: D }))],
    ["email reply", () => replyEmail(appReq(`/admin/inbox/emails/${D}/reply`, { ...asView, body: { text: "x" } }), params({ id: D }))],
    ["approve", () => approve(appReq(`/admin/submissions/${S}/approve`, { ...asView, method: "POST" }), params({ id: S }))],
    ["grade", () => grade(appReq(`/admin/submissions/${S}/grade`, { ...asView, body: { feedback: "ok", score: 8 } }), params({ id: S }))],
    ["issue", () => issue(appReq("/admin/certificates/issue", { ...asView, body: certBody }), noParams)],
    ["revoke", () => revoke(appReq("/admin/certificates/VIBHA-1/revoke", { ...asView, body: { reason: "x" } }), params({ id: "VIBHA-1" }))],
    ["resend", () => resend(appReq("/admin/certificates/VIBHA-1/resend", { ...asView, body: { email: false } }), params({ id: "VIBHA-1" }))],
  ];

  it("students cannot open any admin route", async () => {
    for (const r of [home(appReq("/admin/home"), noParams), students(appReq("/admin/students"), noParams), inbox(appReq("/admin/inbox"), noParams), submissions(appReq("/admin/submissions"), noParams), studio(appReq("/admin/certificates/studio"), noParams), activity(appReq("/admin/activity"), noParams)]) {
      expect((await read(await r)).error?.code).toBe("forbidden");
    }
    expect((await read(await lock(appReq(`/admin/students/${STUDENT_ID}/lock`, { body: {} }), params({ id: STUDENT_ID })))).error?.code).toBe("forbidden");
  });

  it("view-only admins read everything and write nothing", async () => {
    expect((await read(await home(appReq("/admin/home", asView), noParams))).data.canWrite).toBe(false);
    expect((await read(await inbox(appReq("/admin/inbox", asView), noParams))).status).toBe(200);
    for (const [name, call] of writes) expect([name, (await read(await call())).error?.code]).toEqual([name, "forbidden"]);
    for (const f of [h.status, h.loginLink, h.notify, h.replyDoubt, h.draft, h.replyEmail, h.approve, h.grade, h.issue, h.revoke, h.resend]) expect(f).not.toHaveBeenCalled();
  });
});

describe("home, students, profile", () => {
  it("home: the website's to-do list, needs a look first, on now without test accounts", async () => {
    const r = await read(await home(appReq("/admin/home", asAdmin), noParams));
    expect(r.data).toMatchObject({ dateLine: istDateLine(), totalToDo: 2, canWrite: true, today: { doubtsOpen: 2, submissionsToGrade: 3, total: 2 } });
    expect(r.data.todo[0]).toMatchObject({ label: "Student concerns", count: 2, target: { web: "/admin/inbox" } });
    expect(r.data.needsLook[0]).toMatchObject({ id: "s1", flags: ["behind", "quiet"] });
    expect(r.data.attention[0]).toMatchObject({ studentId: "s1", flags: ["behind", "quiet"] });
    expect(r.data.attention[0].reason).toContain(" · ");
    expect(r.data.live.map((l: { userId: string }) => l.userId)).toEqual(["s1"]);
    expect(r.data.counts).toMatchObject({ locked: 1, needsLook: 1, dbPct: 12 });
  });

  it("students: search (q or search), filter, paging, app fields", async () => {
    let r = await read(await students(appReq("/admin/students?q=meera", asAdmin), noParams));
    expect(r.data.items.map((x: { id: string }) => x.id)).toEqual(["s2"]);
    expect(r.data.items[0]).toMatchObject({ status: "paused", cohort: "Cohort 2", lecturesOnly: false, progressPct: 17 });
    r = await read(await students(appReq("/admin/students?flag=behind&limit=1", asAdmin), noParams));
    expect(r.data).toMatchObject({ total: 1, nextCursor: null });
  });

  it("a student's page: row, phone, recent; unknown or test accounts are not found", async () => {
    h.roster.mockResolvedValue({ rows: [rosterRow(STUDENT_ID)], cohorts: [], publishedLectures: 0 });
    const r = await read(await student(appReq(`/admin/students/${STUDENT_ID}`, asAdmin), params({ id: STUDENT_ID })));
    expect(r.data.row.id).toBe(STUDENT_ID);
    expect(r.data).toMatchObject({ id: STUDENT_ID, lectures: { done: 1, total: 6 }, phone: { name: "Pixel 8", platform: "android", changesUsed: 0 }, recent: [{ what: "Lecture 1" }] });
    expect((await read(await student(appReq("/admin/students/robot", asAdmin), params({ id: "robot" })))).status).toBe(404);
  });

  it("lock, unlock and login link run the website's actions", async () => {
    expect((await read(await lock(appReq(`/admin/students/${STUDENT_ID}/lock`, { ...asAdmin, body: { reason: "fee" } }), params({ id: STUDENT_ID })))).data).toEqual({ blocked: true });
    expect(h.status).toHaveBeenCalledWith(STUDENT_ID, "blocked", "fee");
    expect((await read(await unlock(appReq(`/admin/students/${STUDENT_ID}/unlock`, { ...asAdmin, method: "POST" }), params({ id: STUDENT_ID })))).data).toEqual({ blocked: false });
    h.roster.mockResolvedValue({ rows: [rosterRow(STUDENT_ID, { email: "asha@x.org" })], cohorts: [], publishedLectures: 0 });
    expect((await read(await loginLink(appReq(`/admin/students/${STUDENT_ID}/login-link`, { ...asAdmin, method: "POST" }), params({ id: STUDENT_ID })))).data).toEqual({ sent: true });
    expect(h.loginLink).toHaveBeenCalledWith("asha@x.org");
    h.loginLink.mockResolvedValueOnce({ error: "The email didn't send." });
    expect((await read(await loginLink(appReq(`/admin/students/${STUDENT_ID}/login-link`, { ...asAdmin, method: "POST" }), params({ id: STUDENT_ID })))).error?.message).toBe("The email didn't send.");
  });
});

describe("activity, messages, inbox, doubts", () => {
  it("activity views: on now, falling behind, cohorts; test accounts left out", async () => {
    h.activity.mockResolvedValue({ rows: [{ id: "s1" }, { id: "robot" }] });
    h.live.mockResolvedValue([{ userId: "s1", where: "Lecture 2", lessonId: "l2", since: "2026-11-15T10:00:00Z", watching: true }, { userId: "robot", where: "x", lessonId: null, since: "x", watching: false }]);
    const r = await read(await activity(appReq("/admin/activity?view=all", asAdmin), noParams));
    expect(r.data.rows).toEqual([{ id: "s1" }]);
    expect(r.data.kind).toBe("admin.activity");
    expect(r.data.data.rows).toEqual([{ id: "s1" }]);
    expect(r.data.live[0]).toMatchObject({ userId: "s1", where: "Lecture 2", watching: true });
    expect(r.data.items).toEqual([{ id: "s1:2026-11-15T10:00:00Z", at: "2026-11-15T10:00:00Z", who: "Name s1", what: "Lecture 2", kind: "lecture" }]);
    expect(r.data.behind.map((x: { id: string }) => x.id)).toEqual(["s1", "s2"]);
    expect(r.data.cohorts[0]).toMatchObject({ id: "c1", members: 2 });
    expect((await read(await activity(appReq("/admin/activity?view=behind", asAdmin), noParams))).data.rows).toEqual([]);
  });

  it("messages: a cohort, everyone or one student, through the website's send action", async () => {
    const g = await read(await messages(appReq("/admin/messages", asAdmin), noParams));
    expect(g.data.cohorts).toEqual([{ id: "c1", name: "Cohort 2", status: "active", members: 1 }]);
    expect(g.data.items[0]).toMatchObject({ id: "b1", title: "Class moved" });
    const C1 = "c1c1c1c1-0000-4000-8000-000000000001";
    h.recipients.mockResolvedValueOnce({ courses: [], cohorts: [], students: [], enrolledByCourse: {}, membersByCohort: { [C1]: ["s1"] } });
    const r = await read(await send(appReq("/admin/messages", { ...asAdmin, body: { to: "cohort", toId: C1, title: "Class moved", body: "Tomorrow at 6" } }), noParams));
    expect(r.data).toMatchObject({ sent: 1, batchId: "b2" });
    expect(h.notify.mock.calls[0][0]).toMatchObject({ userIds: ["s1"], title: "Class moved", alsoEmail: false });
    await send(appReq("/admin/messages", { ...asAdmin, body: { to: "everyone", title: "t", body: "b" } }), noParams);
    expect(h.notify.mock.calls[1][0].userIds).toEqual(["s1", "s2"]);
    expect((await read(await send(appReq("/admin/messages", { ...asAdmin, body: { to: "cohort", title: "t", body: "b" } }), noParams))).status).toBe(400);
    // The first version's body still works.
    await send(appReq("/admin/messages", { ...asAdmin, body: { userIds: [STUDENT_ID], title: "Old", text: "Body" } }), noParams);
    expect(h.notify.mock.calls[2][0]).toMatchObject({ userIds: [STUDENT_ID], title: "Old" });
    G.limited.add(`app:message:${ADMIN_ID}`);
    expect((await read(await send(appReq("/admin/messages", { ...asAdmin, body: { to: "student", toId: STUDENT_ID, title: "t", body: "b" } }), noParams))).status).toBe(429);
  });

  it("inbox and replies", async () => {
    const r = await read(await inbox(appReq("/admin/inbox", asAdmin), noParams));
    expect(r.data.threads[0]).toMatchObject({ id: D, reason: "unanswered" });
    expect((await read(await replyDoubt(appReq(`/admin/doubts/${D}/reply`, { ...asAdmin, body: { text: "Here" } }), params({ id: D })))).data).toEqual({ sent: true });
    expect(h.replyDoubt).toHaveBeenCalledWith(D, "Here");
    h.replyDoubt.mockResolvedValueOnce({ error: "That doubt is gone." });
    expect((await read(await replyDoubt(appReq(`/admin/doubts/${D}/reply`, { ...asAdmin, body: { text: "Here" } }), params({ id: D })))).status).toBe(404);
    expect((await read(await draft(appReq(`/admin/doubts/${D}/draft`, { ...asAdmin, method: "POST" }), params({ id: D })))).data).toEqual({ text: "A draft" });
    expect((await read(await replyEmail(appReq(`/admin/inbox/emails/${D}/reply`, { ...asAdmin, body: { text: "Thanks" } }), params({ id: D })))).data).toEqual({ sent: true });
    expect((await read(await markRead(appReq(`/admin/inbox/emails/${D}/read`, { ...asAdmin, method: "POST" }), params({ id: D })))).data).toEqual({ read: true });
  });

  it("doubts review sees everything and hides as the super admin", async () => {
    await doubts(appReq("/admin/doubts?cohort=c1", asAdmin), noParams);
    expect(h.doubts).toHaveBeenCalledWith(expect.objectContaining({ isAdmin: true, cohortFilter: "c1" }));
    expect((await read(await hide(appReq(`/admin/doubts/${D}/hide`, { ...asAdmin, body: { hidden: true } }), params({ id: D })))).data).toEqual({ hidden: true });
  });
});

describe("submissions review", () => {
  it("lists with files, approves, grades, and signs files by id (never a path from the app)", async () => {
    const r = await read(await submissions(appReq("/admin/submissions?status=pending", asAdmin), noParams));
    expect(h.review).toHaveBeenCalledWith({ courseFilter: null, assignmentFilter: null, statusFilter: "pending" });
    expect(r.data.items[0]).toMatchObject({ id: S, text: "hi", hasAudio: false, files: [{ id: F, name: "f.pdf", format: "pdf" }] });
    expect(r.data.items[0].files[0]).not.toHaveProperty("storage_path");
    expect(r.data.assignments).toEqual([{ id: "a1", title: "Essay", courseId: "c0" }]);
    expect((await read(await approve(appReq(`/admin/submissions/${S}/approve`, { ...asAdmin, method: "POST" }), params({ id: S })))).data).toEqual({ status: "approved" });
    expect((await read(await grade(appReq(`/admin/submissions/${S}/grade`, { ...asAdmin, body: { feedback: "Good", score: 8 } }), params({ id: S })))).data).toEqual({ status: "returned" });
    expect(h.grade).toHaveBeenCalledWith(S, "Good", 8);
    expect((await read(await subFile(appReq(`/admin/submissions/${S}/files/${F}`, asAdmin), params({ id: S, fileId: F })))).data.url).toBe("https://signed/file");
    expect(h.fileUrl).toHaveBeenCalledWith("u/f.pdf");
    expect((await read(await subAudio(appReq(`/admin/submissions/${S}/audio`, asAdmin), params({ id: S })))).data.url).toBe("https://signed/audio");
    const other = "aaaaaaaa-0000-4000-8000-000000000009";
    expect((await read(await subFile(appReq(`/admin/submissions/${other}/files/${F}`, asAdmin), params({ id: other, fileId: F })))).status).toBe(404);
  });
});

describe("certificate studio", () => {
  it("setup, preview as drawing operations, issue, revoke, resend through the studio's actions", async () => {
    expect((await read(await studio(appReq("/admin/certificates/studio", asView), noParams))).data).toMatchObject({ canWrite: false, kinds: expect.arrayContaining([expect.objectContaining({ id: "completion" })]) });
    const p = await read(await preview(appReq("/admin/certificates/preview", { ...asView, body: certBody }), noParams));
    expect(p.data.width).toBeGreaterThan(0);
    expect(p.data.ops.length).toBeGreaterThan(5);
    expect(p.data.images).toEqual({ sig0: "https://sig" });
    expect(p.data.problems).toEqual([]);
    const bad = await read(await preview(appReq("/admin/certificates/preview", { ...asAdmin, body: { ...certBody, title: "", recipients: [] } }), noParams));
    expect(bad.data.problems).toEqual(expect.arrayContaining(["Pick at least one student.", "Give the certificate a title."]));
    const r = await read(await issue(appReq("/admin/certificates/issue", { ...asAdmin, body: { ...certBody, replaces: "VIBHA-0" } }), noParams));
    expect(r.data.issued[0].credentialId).toBe("VIBHA-1");
    expect(h.issue.mock.calls[0][1]).toBe("VIBHA-0");
    h.issue.mockResolvedValueOnce({ error: "Give the certificate a title.", issued: [], skipped: [], delivery: null, batchId: null });
    expect((await read(await issue(appReq("/admin/certificates/issue", { ...asAdmin, body: certBody }), noParams))).error).toMatchObject({ code: "bad_request", message: "Give the certificate a title." });
    expect((await read(await revoke(appReq("/admin/certificates/VIBHA-1/revoke", { ...asAdmin, body: { reason: "Wrong name" } }), params({ id: "VIBHA-1" })))).data).toEqual({ revoked: true });
    expect((await read(await resend(appReq("/admin/certificates/VIBHA-1/resend", { ...asAdmin, body: { email: true } }), params({ id: "VIBHA-1" })))).data).toEqual({ notified: true, delivery: null });
    expect(h.resend).toHaveBeenCalledWith("VIBHA-1", true);
  });
});
