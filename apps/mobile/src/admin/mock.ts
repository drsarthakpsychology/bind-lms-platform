/**
 * The admin part of the mock server (EXPO_PUBLIC_API_MODE=mock). Contract
 * shaped answers for every admin route, built and planned (src/admin/contract.ts,
 * src/admin/extra.ts), with a little state in memory so actions show their
 * result (lock, grade, move a stage, issue a certificate).
 *
 * The same rule as the server: an admin ("admin" role) may write; a view
 * admin ("view_admin") may only read, and every write answers 403.
 * Sign in as admin@... for a Super Admin, viewadmin@... for a view admin.
 */
import type { RawRequest, RawResponse } from "@/api/client";
import type * as C from "@/api/contract";
import type * as A from "./contract";
import type * as X from "./extra";

const MIN = 60_000;
const ago = (min: number) => new Date(Date.now() - min * MIN).toISOString();
const dayStr = (daysAgo: number) => new Date(Date.now() + 5.5 * 3600_000 - daysAgo * 86400_000).toISOString().slice(0, 10);

const C2 = { id: "c2", name: "Cohort Two" };
const C1 = { id: "c1", name: "Cohort One" };

function student(p: Partial<A.AdminStudentRow> & Pick<A.AdminStudentRow, "id" | "name">): A.AdminStudentRow {
  const first = p.name.split(" ")[0]!.toLowerCase();
  return {
    email: `${first}@example.com`,
    rollNumber: null,
    mobileNumber: "9876543210",
    scope: "full",
    blocked: false,
    expiresAt: "2027-06-30T18:29:59.000Z",
    account: "active",
    presence: "week",
    lastSeen: ago(60 * 30),
    cohorts: [C2],
    minutes7: 120,
    activeDays30: 12,
    lecturesDone: 4,
    lecturesAvailable: 8,
    xp: 640,
    flags: [],
    ...p,
  };
}

function seedStudents(): A.AdminStudentRow[] {
  return [
    student({ id: "u1", name: "Ananya Mehta", rollNumber: "VIBHA-000123", presence: "now", lastSeen: ago(2), minutes7: 312, activeDays30: 22, lecturesDone: 5, xp: 1480 }),
    student({ id: "u2", name: "Rohan Shah", rollNumber: "VIBHA-000207", scope: "lectures_only", presence: "today", lastSeen: ago(190), minutes7: 140, lecturesDone: 4 }),
    student({ id: "u3", name: "Meera Pillai", rollNumber: "VIBHA-000118", presence: "quiet", lastSeen: ago(60 * 24 * 6), minutes7: 0, activeDays30: 5, lecturesDone: 1, flags: ["quiet", "behind"] }),
    student({ id: "u4", name: "Karan Desai", rollNumber: "VIBHA-000131", blocked: true, account: "locked", presence: "quiet", lastSeen: ago(60 * 24 * 13), minutes7: 0, lecturesDone: 2, flags: ["behind"] }),
    student({ id: "u5", name: "Sana Khan", rollNumber: "VIBHA-000142", presence: "now", lastSeen: ago(1), minutes7: 405, activeDays30: 26, lecturesDone: 7, xp: 2210 }),
    student({ id: "u6", name: "Arjun Nair", rollNumber: "VIBHA-000150", account: "link-expired", presence: "never", lastSeen: null, minutes7: 0, activeDays30: 0, lecturesDone: 0, xp: 0, flags: ["login", "never-seen"] }),
    student({ id: "u7", name: "Priya Iyer", rollNumber: "VIBHA-000161", account: "set-up", presence: "never", lastSeen: null, minutes7: 0, activeDays30: 0, lecturesDone: 0, xp: 0, mobileNumber: null, flags: ["never-seen", "no-mobile"] }),
    student({ id: "u8", name: "Dev Malhotra", rollNumber: "VIBHA-000170", presence: "today", lastSeen: ago(45), minutes7: 210, lecturesDone: 6, xp: 980 }),
    student({ id: "u9", name: "Isha Kapoor", rollNumber: "VIBHA-000178", account: "email-failed", presence: "never", lastSeen: null, minutes7: 0, activeDays30: 0, lecturesDone: 0, xp: 0, flags: ["login", "email-failing"] }),
    student({ id: "u10", name: "Neha Joshi", rollNumber: "VIBHA-000092", cohorts: [C1], presence: "week", lastSeen: ago(60 * 24 * 3), minutes7: 40, lecturesDone: 8, lecturesAvailable: 8, xp: 3120, flags: ["no-details"] }),
    student({ id: "u11", name: "Vikram Rao", rollNumber: "VIBHA-000101", cohorts: [C1], account: "expired", expiresAt: "2026-10-31T18:29:59.000Z", presence: "quiet", lastSeen: ago(60 * 24 * 20), minutes7: 0, lecturesDone: 8, lecturesAvailable: 8 }),
    student({ id: "u12", name: "Aditi Verma", rollNumber: "VIBHA-000186", presence: "week", lastSeen: ago(60 * 24 * 2), minutes7: 95, lecturesDone: 3, xp: 410 }),
  ];
}

function seedDoubts(): C.DoubtThread[] {
  return [
    { id: "ad1", title: "Is flat affect the same as blunted affect?", topic: "Mental status examination", kind: "doubt", status: "open", cohortId: "c2", author: "Karan Desai", mine: false, createdAt: ago(60 * 26), body: "The lecture used both words. Are they two points on one scale or two different findings?", replies: [] },
    { id: "ad2", title: "When do we refer a patient for a psychiatric opinion?", topic: "Risk assessment", kind: "doubt", status: "open", cohortId: "c2", author: "Sana Khan", mine: false, createdAt: ago(60 * 5), body: "In the safety planning lecture it says refer when risk is high. What counts as high in a first interview?", replies: [{ id: "r1", author: "Dev Malhotra", mine: false, body: "I think active plans or past attempts?", votes: 2, youVoted: false, isSolution: false, createdAt: ago(60 * 4) }] },
    { id: "ad3", title: "The recording of Lecture 4 stops at 42 minutes", topic: null, kind: "complaint", status: "open", cohortId: "c2", author: "Aditi Verma", mine: false, createdAt: ago(60 * 9), body: "It freezes at 42:10 on my phone and laptop. I could not see the end of the second part.", replies: [] },
    { id: "ad4", title: "How do I tell low mood from clinical depression?", topic: "Depression", kind: "doubt", status: "solved", cohortId: "c2", author: "Ananya Mehta", mine: false, createdAt: ago(60 * 48), body: "My role play patient felt low since exams. Depression or a normal reaction?", replies: [{ id: "r2", author: "Dr. Sarthak Dave", mine: false, body: "Ask how long, how much of the day, and what has stopped. Two weeks or more with loss of interest points to an episode.", votes: 14, youVoted: false, isSolution: true, createdAt: ago(60 * 30) }] },
  ];
}

function seedInbox(): (X.InboxItem & { thread: X.InboxMessage[]; phone: string | null })[] {
  return [
    { id: "i1", kind: "email", from: "Meera Pillai", email: "meera@example.com", phone: "9876543210", studentId: "u3", subject: "Re: Checking in", preview: "Sorry, I had a family wedding this week. I will catch up on Lecture 5 and 6 by Sunday.", at: ago(80), unread: true, thread: [
      { id: "m1", from: "VIBHA team", mine: true, body: "We missed you this week. Is everything all right? Lecture 5 is waiting for you.", at: ago(60 * 26) },
      { id: "m2", from: "Meera Pillai", mine: false, body: "Sorry, I had a family wedding this week. I will catch up on Lecture 5 and 6 by Sunday. Is the recording of the live session up too?", at: ago(80) },
    ] },
    { id: "i2", kind: "enquiry", from: "Tanvi Gupta", email: "tanvi@example.com", phone: "9123456780", studentId: null, subject: "Cohort Three dates", preview: "Hi, I finished my MA this year. When does the next cohort start and is it online?", at: ago(60 * 3), unread: true, thread: [{ id: "m3", from: "Tanvi Gupta", mine: false, body: "Hi, I finished my MA in Psychology this year. When does the next cohort start, and is it fully online? I work weekdays.", at: ago(60 * 3) }] },
    { id: "i3", kind: "email", from: "Dev Malhotra", email: "dev@example.com", phone: null, studentId: "u8", subject: "Re: Your hand-in was graded", preview: "Thank you for the feedback on the first interview write-up.", at: ago(60 * 30), unread: false, thread: [
      { id: "m4", from: "VIBHA team", mine: true, body: "Your hand-in Write up a first interview was graded: 8 of 10.", at: ago(60 * 40) },
      { id: "m5", from: "Dev Malhotra", mine: false, body: "Thank you for the feedback on the first interview write-up. I will work on the summary at the end.", at: ago(60 * 30) },
    ] },
  ];
}

function seedPeople(): X.PersonDetail[] {
  const p = (r: Omit<X.PersonRow, "lastTouch" | "invitedAt" | "paid"> & { invitedAt?: string | null; paid?: boolean } & { timeline?: X.PersonEvent[]; facts?: X.PersonDetail["facts"]; studentId?: string | null }): X.PersonDetail => ({
    lastTouch: r.timeline?.[0]?.at ?? r.enquiredAt,
    facts: r.facts ?? [
      { label: "Source", value: r.source ?? "Not known" },
      { label: "Enquired", value: r.enquiredAt ? r.enquiredAt.slice(0, 10) : "No" },
    ],
    timeline: r.timeline ?? [{ title: "Filled the enquiry form", body: null, at: r.enquiredAt ?? ago(60), tone: "info" }],
    studentId: r.studentId ?? null,
    invitedAt: null,
    paid: false,
    ...r,
  });
  return [
    p({ key: "tanvi@example.com", name: "Tanvi Gupta", email: "tanvi@example.com", phone: "9123456780", stage: "new", followUpAt: null, enquiredAt: ago(60 * 3), source: "Instagram", isStudent: false, timeline: [{ title: "Filled the enquiry form", body: "When does the next cohort start, and is it fully online? I work weekdays.", at: ago(60 * 3), tone: "info" }] }),
    p({ key: "farhan@example.com", name: "Farhan Ali", email: "farhan@example.com", phone: "9988776655", stage: "contacted", followUpAt: ago(-60 * 20), enquiredAt: ago(60 * 24 * 4), source: "College talk", isStudent: false, timeline: [
      { title: "Sent the brochure on WhatsApp", body: null, at: ago(60 * 24 * 2), tone: "ok" },
      { title: "Filled the enquiry form", body: "Interested in the clinical track.", at: ago(60 * 24 * 4), tone: "info" },
    ] }),
    p({ key: "ritika@example.com", name: "Ritika Sen", email: "ritika@example.com", phone: "9876501234", stage: "fee_shared", followUpAt: ago(60 * 5), enquiredAt: ago(60 * 24 * 9), source: "Friend", isStudent: false, invitedAt: ago(60 * 20), timeline: [
      { title: "Fee details shared", body: "Asked about paying in two parts.", at: ago(60 * 24), tone: "ok" },
      { title: "Call done", body: "15 minutes. Wants to start in January.", at: ago(60 * 24 * 5), tone: "ok" },
      { title: "Filled the enquiry form", body: null, at: ago(60 * 24 * 9), tone: "info" },
    ] }),
    p({ key: "aditi@example.com", name: "Aditi Verma", email: "aditi@example.com", phone: "9876543210", stage: "joined", followUpAt: null, enquiredAt: ago(60 * 24 * 40), source: "Instagram", isStudent: true, studentId: "u12", invitedAt: ago(60 * 24 * 30), paid: true }),
    p({ key: "arjun@example.com", name: "Arjun Nair", email: "arjun@example.com", phone: "9876543210", stage: "joined", followUpAt: null, enquiredAt: ago(60 * 24 * 25), source: "College talk", isStudent: false, studentId: "u6", invitedAt: ago(60 * 24 * 12), paid: true }),
    p({ key: "kabir@example.com", name: "Kabir Bose", email: "kabir@example.com", phone: null, stage: "no_reply", followUpAt: null, enquiredAt: ago(60 * 24 * 21), source: "Website", isStudent: false }),
  ];
}

function seedCerts(): X.CertRow[] {
  return [
    { credentialId: "VIBHA-C1-0092-FN", title: "Foundations of Clinical Psychology", kind: "completion", recipient: "Neha Joshi", recipientId: "u10", issuedAt: ago(60 * 24 * 12), expiresAt: null, status: "valid", emailStatus: "sent", revokedAt: null, revokeReason: null },
    { credentialId: "VIBHA-C1-0101-FN", title: "Foundations of Clinical Psychology", kind: "completion", recipient: "Vikram Rao", recipientId: "u11", issuedAt: ago(60 * 24 * 12), expiresAt: null, status: "valid", emailStatus: "failed", revokedAt: null, revokeReason: null },
    { credentialId: "VIBHA-C2-0142-SR", title: "Outstanding contribution to the cohort", kind: "recognition", recipient: "Sana Khan", recipientId: "u5", issuedAt: ago(60 * 24 * 3), expiresAt: null, status: "valid", emailStatus: "sent", revokedAt: null, revokeReason: null },
    { credentialId: "VIBHA-C2-0123-PV", title: "Mental Status Examination", kind: "provisional", recipient: "Ananya Mehta", recipientId: "u1", issuedAt: ago(60 * 24 * 6), expiresAt: "2026-12-31T18:29:59.000Z", status: "provisional", emailStatus: "sent", revokedAt: null, revokeReason: null },
    { credentialId: "VIBHA-C2-0123-BD", title: "First five lectures", kind: "badge", recipient: "Ananya Mehta", recipientId: "u1", issuedAt: ago(60 * 24 * 2), expiresAt: null, status: "valid", emailStatus: "not_sent", revokedAt: null, revokeReason: null },
    { credentialId: "VIBHA-C1-0088-FN", title: "Foundations of Clinical Psychology", kind: "completion", recipient: "Old test account", recipientId: "u0", issuedAt: ago(60 * 24 * 30), expiresAt: null, status: "revoked", emailStatus: "not_sent", revokedAt: ago(60 * 24 * 29), revokeReason: "Issued to the wrong account" },
  ];
}

type AdminState = {
  students: A.AdminStudentRow[];
  doubts: C.DoubtThread[];
  inbox: ReturnType<typeof seedInbox>;
  submissions: X.Submission[];
  signoffs: X.SignOff[];
  people: X.PersonDetail[];
  certs: X.CertRow[];
  batches: A.MessageBatches["batches"];
  prefs: X.AdminPushPrefs;
  allowed: Set<string>;
  forms: X.FormDetail[];
  studio: X.StudioSettings;
};

function fresh(): AdminState {
  return {
    students: seedStudents(),
    doubts: seedDoubts(),
    inbox: seedInbox(),
    submissions: [
      { id: "s1", studentId: "u5", studentName: "Sana Khan", assignment: "Write up a first interview", course: "Clinical Psychology in Practice", submittedAt: ago(60 * 2), status: "pending", grade: null, maxGrade: 10, feedback: null, answer: "The patient, a 24 year old woman, came with low mood for three weeks after a breakup. Sleep is reduced, appetite normal, she still meets friends on weekends. No thoughts of self harm. I would see this as an adjustment reaction for now and review in two weeks.", file: null },
      { id: "s2", studentId: "u1", studentName: "Ananya Mehta", assignment: "Mental status examination notes", course: "Clinical Psychology in Practice", submittedAt: ago(60 * 20), status: "pending", grade: null, maxGrade: 10, feedback: null, answer: "", file: "mse-notes-ananya.pdf" },
      { id: "s3", studentId: "u8", studentName: "Dev Malhotra", assignment: "Write up a first interview", course: "Clinical Psychology in Practice", submittedAt: ago(60 * 50), status: "graded", grade: 8, maxGrade: 10, feedback: "Clear history. Add a short summary and your next step at the end.", answer: "A 31 year old man with worry about his health for six months...", file: null },
    ],
    signoffs: [
      { id: "so1", studentId: "u5", studentName: "Sana Khan", activity: "Observed intake interviews at the clinic", hours: 6, date: dayStr(3), supervisor: "Dr. Sarthak Dave", competency: "Interviewing", status: "requested", note: null },
      { id: "so2", studentId: "u10", studentName: "Neha Joshi", activity: "Case presentation: generalised anxiety", hours: 2, date: dayStr(6), supervisor: "Dr. Sarthak Dave", competency: "Case formulation", status: "requested", note: null },
    ],
    people: seedPeople(),
    certs: seedCerts(),
    batches: [
      { batchId: "b1", title: "Lecture 6 opens on Monday", sentAt: ago(60 * 3), total: 24, opened: 17, type: "announcement" },
      { batchId: "b2", title: "Checking in", sentAt: ago(60 * 26), total: 1, opened: 1, type: "nudge" },
      { batchId: "b3", title: "Welcome to Cohort Two", sentAt: ago(60 * 24 * 13), total: 24, opened: 23, type: "announcement" },
    ],
    prefs: { newDoubt: true, newEnquiry: true, fallingBehind: false },
    allowed: new Set(),
    forms: [
      { id: "f1", title: "Cohort Two: your details", responses: 3, open: true, updatedAt: ago(60 * 6), questions: ["College", "Year of study", "Why VIBHA?"], respondents: [
        { id: "fr1", name: "Ananya Mehta", email: "ananya@example.com", at: ago(60 * 24 * 10), answers: [{ q: "College", a: "St. Xavier's, Ahmedabad" }, { q: "Year of study", a: "MA, second year" }, { q: "Why VIBHA?", a: "I want real clinical exposure before my MPhil." }], emailed: false, studentId: "u1" },
        { id: "fr2", name: "Sana Khan", email: "sana@example.com", at: ago(60 * 24 * 9), answers: [{ q: "College", a: "Gujarat University" }, { q: "Year of study", a: "BA, final year" }, { q: "Why VIBHA?", a: "To learn assessment properly." }], emailed: true, studentId: "u5" },
        { id: "fr3", name: "Dev Malhotra", email: "dev@example.com", at: ago(60 * 6), answers: [{ q: "College", a: "Nirma University" }, { q: "Year of study", a: "Working, 2 years" }, { q: "Why VIBHA?", a: "Moving into counselling." }], emailed: false, studentId: "u8" },
      ] },
      { id: "f2", title: "Live session feedback, week 2", responses: 2, open: false, updatedAt: ago(60 * 24 * 4), questions: ["How clear was it?", "What should we repeat?"], respondents: [
        { id: "fr4", name: "Rohan Shah", email: "rohan@example.com", at: ago(60 * 24 * 5), answers: [{ q: "How clear was it?", a: "Very clear" }, { q: "What should we repeat?", a: "The MSE role play." }], emailed: false, studentId: "u2" },
        { id: "fr5", name: "Aditi Verma", email: "aditi@example.com", at: ago(60 * 24 * 5), answers: [{ q: "How clear was it?", a: "Mostly clear" }, { q: "What should we repeat?", a: "Risk questions." }], emailed: false, studentId: "u12" },
      ] },
    ],
    studio: { signatories: [{ name: "Dr. Sarthak Dave", role: "Director, VIBHA School of Psychology", signatureFrom: "sig-sd" }], emailOnIssue: true, replyTo: "hello@vibhapsychology.com", emailReady: true },
  };
}

let s = fresh();
export const adminMock = {
  reset() {
    s = fresh();
  },
  state: () => s,
};

const ok = <T,>(data: T, status = 200): RawResponse => ({ status, json: { ok: true, data } });
const fail = (status: number, code: C.ApiErrorCode, message: string, details?: Record<string, unknown>): RawResponse => ({ status, json: { ok: false, error: { code, message, details } } });
const notFound = () => fail(404, "not_found", "That could not be found.");

function detailFor(r: A.AdminStudentRow): A.StudentDetail {
  const seed = Number(r.id.replace(/\D/g, "")) || 1;
  const daily = Array.from({ length: 30 }, (_, k) => {
    const v = r.minutes7 === 0 && k > 22 ? 0 : Math.max(0, Math.round(((Math.sin(k * 0.9 + seed) + 1) / 2) * (r.minutes7 / 4) - (k % 5 === 0 ? 20 : 0)));
    return { day: dayStr(29 - k), min: r.presence === "never" ? 0 : v };
  });
  const titles = ["What clinical psychology is, and is not", "The first interview: building rapport", "Mental status examination, part one", "Mental status examination, part two", "Depression: how it presents in the clinic", "Risk assessment and safety planning", "Anxiety disorders: telling them apart", "Case formulation with the 5 Ps"];
  return {
    profile: { id: r.id, name: r.name, email: r.email, status: r.blocked ? "blocked" : "active", created_at: ago(60 * 24 * 40), mobile_number: r.mobileNumber, display: r.name },
    daily,
    lectures: titles.map((title, i) => ({ id: `l${i + 1}`, title, week: Math.floor(i / 2) + 1, watchedMin: i < r.lecturesDone ? 50 + i : i === r.lecturesDone ? 18 : 0, done: i < r.lecturesDone, at: i <= r.lecturesDone ? ago(60 * 24 * (8 - i)) : null })),
    recent: r.presence === "never" ? [] : [
      { at: r.lastSeen ?? ago(60), what: `Lecture: ${titles[Math.min(r.lecturesDone, 7)]}`, min: 24 },
      { at: ago(60 * 26), what: "Study", min: 18 },
      { at: ago(60 * 50), what: "Doubts", min: 4 },
      { at: ago(60 * 74), what: "Home", min: 2 },
    ],
    learn: r.scope === "full" && r.xp ? { xp: r.xp, level: { title: r.xp > 2000 ? "Clinician" : "Trainee" }, streak: r.presence === "now" ? 6 : 0, best: 9, accuracy: 72, answered: 140, badges: 4, mastery: 58, confusions: ["Flat affect ↔ Blunted affect (3×)"], lessons: 12 } : null,
    sims: [],
    totals: { min30: daily.reduce((a, d) => a + d.min, 0), activeDays: daily.filter((d) => d.min > 0).length },
  };
}

function rowsToActivity(rows: A.AdminStudentRow[]): A.StudentActivity[] {
  return rows.map((r) => ({ id: r.id, name: r.name, email: r.email, status: r.blocked ? "blocked" : "active", min7: r.minutes7, min30: r.minutes7 * 4, activeDays30: r.activeDays30, lastSeen: r.lastSeen, lecturesDone: r.lecturesDone, lecturesStarted: r.lecturesDone + 1, watchMin: r.lecturesDone * 55, xp: r.xp, level: "Trainee", streak: 0, accuracy: null, mastery: 0, practice: 0, score: r.minutes7 + r.lecturesDone * 20 }));
}

function live(): A.AdminHome["live"] {
  return [
    { userId: "u5", name: "Sana Khan", where: "Lecture: Anxiety disorders: telling them apart", lessonId: "l7", since: ago(14), watching: true },
    { userId: "u1", name: "Ananya Mehta", where: "Study", lessonId: null, since: ago(6), watching: false },
  ];
}

function cohorts(): X.CohortRow[] {
  const of = (id: string) => s.students.filter((r) => r.cohorts.some((c) => c.id === id));
  const row = (id: string, name: string, status: X.CohortStatus, starts: string, ends: string | null): X.CohortRow => {
    const m = of(id);
    const done = m.reduce((a, r) => a + r.lecturesDone, 0);
    const avail = m.reduce((a, r) => a + r.lecturesAvailable, 0);
    return { id, name, status, course: "Clinical Psychology in Practice", members: m.length, lectures: 8, pct: avail ? Math.round((done / avail) * 100) : 0, activeWeek: m.filter((r) => r.presence === "now" || r.presence === "today" || r.presence === "week").length, behind: m.filter((r) => r.flags.includes("behind")).length, never: m.filter((r) => r.presence === "never").length, starts, ends };
  };
  return [row("c2", "Cohort Two", "active", "2026-11-02", "2027-04-30"), row("c1", "Cohort One", "ended", "2026-05-04", "2026-10-31"), { id: "c3", name: "Cohort Three", status: "upcoming", course: "Clinical Psychology in Practice", members: 0, lectures: 8, pct: 0, activeWeek: 0, behind: 0, never: 0, starts: "2027-01-11", ends: null }];
}

const publicPerson = ({ timeline: _t, facts: _f, studentId: _s, ...row }: X.PersonDetail): X.PersonRow => row;

/**
 * Answers an admin call, or null when this is not an admin route (the main
 * mock server then answers it). `role` is the signed-in admin's role.
 */
export async function adminRoute(req: RawRequest, role: "admin" | "view_admin", scenario: string): Promise<RawResponse | null> {
  const [path = "", qs = ""] = req.path.split("?");
  const query = Object.fromEntries(new URLSearchParams(qs));
  const seg = path.split("/").filter(Boolean);
  const body = (req.body ?? {}) as Record<string, unknown>;
  const is = (method: string, pattern: string): string[] | null => {
    if (req.method !== method) return null;
    const p = pattern.split("/").filter(Boolean);
    if (p.length !== seg.length) return null;
    const out: string[] = [];
    for (let i = 0; i < p.length; i++) {
      if (p[i]![0] === ":") out.push(decodeURIComponent(seg[i]!));
      else if (p[i] !== seg[i]) return null;
    }
    return out;
  };
  const mine = path.startsWith("/admin") || /^\/doubts\/[^/]+(\/replies)?$/.test(path);
  if (!mine) return null;
  // Personal alert settings are each admin's own; everything else that writes needs the Super Admin.
  const write = req.method !== "GET" && !path.startsWith("/admin/push-preferences");
  if (write && role !== "admin") return fail(403, "forbidden", "Only a Super Admin can do this.");
  const empty = scenario === "empty";
  let m: string[] | null;

  /* ---------------------------------------------------------- home */
  if (is("GET", "/admin/home")) {
    const rows = empty ? [] : s.students;
    const needs = rows.filter((r) => r.flags.length).sort((a, b) => b.flags.length - a.flags.length);
    return ok<A.AdminHome>({
      v: 1,
      counts: { students: rows.length, activeThisWeek: rows.filter((r) => ["now", "today", "week"].includes(r.presence)).length, onNow: empty ? 0 : live().length, needsLook: needs.length, locked: rows.filter((r) => r.blocked).length, openComplaints: empty ? 0 : s.doubts.filter((d) => d.kind === "complaint" && d.status === "open").length },
      needsLook: needs.slice(0, 20),
      live: empty ? [] : live(),
    });
  }

  /* ------------------------------------------------------ students */
  if (is("GET", "/admin/students")) {
    const q = (query.search ?? "").trim().toLowerCase();
    const items = (empty ? [] : s.students).filter((r) => (!q || `${r.name} ${r.email} ${r.rollNumber ?? ""} ${r.mobileNumber ?? ""}`.toLowerCase().includes(q)) && (!query.cohort || r.cohorts.some((c) => c.id === query.cohort)) && (!query.flag || (r.flags as string[]).includes(query.flag)));
    return ok<A.AdminStudentList>({ items, nextCursor: null, total: items.length, cohorts: [C2, C1] });
  }
  if ((m = is("GET", "/admin/students/:id"))) {
    const r = s.students.find((x) => x.id === m![0]);
    return r ? ok<A.AdminStudentProfile>({ row: r, detail: detailFor(r) as unknown as Record<string, unknown> }) : notFound();
  }
  if ((m = is("GET", "/admin/students/:id/credentials"))) return ok({ items: s.certs.filter((c) => c.recipientId === m![0]) });
  if ((m = is("GET", "/admin/students/:id/messages"))) {
    const r = s.students.find((x) => x.id === m![0]);
    return ok<{ items: X.StudentMessage[] }>({ items: r ? [{ id: "sm1", title: "Lecture 6 opens on Monday", at: ago(60 * 3), opened: r.presence !== "never", from: "Kavya Bothra" }, { id: "sm2", title: "Welcome to Cohort Two", at: ago(60 * 24 * 13), opened: r.presence !== "never", from: "Kavya Bothra" }] : [] });
  }
  if ((m = is("POST", "/admin/students/:id/lock")) || (m = is("POST", "/admin/students/:id/unlock"))) {
    const r = s.students.find((x) => x.id === m![0]);
    if (!r) return notFound();
    const lock = path.endsWith("/lock");
    r.blocked = lock;
    r.account = lock ? "locked" : r.lastSeen ? "active" : "invited";
    return ok<A.LockResult>({ blocked: lock });
  }
  if ((m = is("POST", "/admin/students/:id/login-link"))) {
    const r = s.students.find((x) => x.id === m![0]);
    if (!r) return notFound();
    if (r.account === "link-expired" || r.account === "email-failed" || r.account === "not-invited") r.account = "invited";
    r.flags = r.flags.filter((f) => f !== "login" && f !== "email-failing");
    return ok<X.LoginLinkResult>({ sent: true, emailed: true, url: `https://vibhapsychology.com/setup?token=mock-${r.id}`, expiresAt: new Date(Date.now() + 7 * 86400_000).toISOString() });
  }
  if (is("POST", "/admin/devices/allow-change")) {
    s.allowed.add(String(body.userId ?? ""));
    return ok<C.AllowDeviceChangeResult>({ allowed: true });
  }

  /* ------------------------------------------------------ activity */
  if (is("GET", "/admin/activity")) {
    const rows = empty ? [] : s.students;
    const heat = Array.from({ length: 7 }, (_, d) => Array.from({ length: 24 }, (_, h) => (h >= 7 && h <= 23 ? Math.round(((Math.sin(h / 3 + d) + 1) * (h >= 19 ? 30 : 12))) : 0)));
    return ok<A.PlayResult<A.ActivityData>>({ kind: "admin.activity", v: 1, data: { rows: rowsToActivity(rows), heat, pages: [{ label: "Lectures (watching)", min: 1840 }, { label: "Study", min: 960 }, { label: "Practice", min: 410 }, { label: "Doubts", min: 120 }], totals: { students: rows.length, active7: rows.filter((r) => r.minutes7 > 0).length, activeNow: empty ? 0 : 2, hours30: Math.round(rows.reduce((a, r) => a + r.minutes7 * 4, 0) / 60), lecturesDone: rows.reduce((a, r) => a + r.lecturesDone, 0) }, live: empty ? [] : live() } });
  }
  if (is("GET", "/admin/activity/behind")) {
    const items = (empty ? [] : s.students)
      .filter((r) => r.flags.includes("behind") || (r.lecturesAvailable && r.lecturesDone / r.lecturesAvailable < 0.4 && r.presence !== "never"))
      .filter((r) => !query.cohort || r.cohorts.some((c) => c.id === query.cohort))
      .map((r) => ({ id: r.id, name: r.name, cohortId: r.cohorts[0]?.id ?? null, cohortName: r.cohorts[0]?.name ?? null, done: r.lecturesDone, available: r.lecturesAvailable, lastSeen: r.lastSeen, account: r.account }));
    return ok<X.BehindList>({ items, cohorts: [C2, C1] });
  }

  /* ------------------------------------------------------ messages */
  if (is("GET", "/admin/messages")) return ok<A.MessageBatches>({ batches: empty ? [] : s.batches, ready: true });
  if (is("POST", "/admin/messages")) {
    const ids = Array.isArray(body.userIds) ? (body.userIds as string[]) : [];
    const title = String(body.title ?? "").trim();
    if (!ids.length) return fail(400, "bad_request", "Pick who it goes to.", { fields: ["userIds"] });
    if (!title || !String(body.text ?? "").trim()) return fail(400, "bad_request", "Write a title and a message.", { fields: ["title", "text"] });
    s.batches.unshift({ batchId: `b${s.batches.length + 1}`, title, sentAt: new Date().toISOString(), total: ids.length, opened: 0, type: "announcement" });
    return ok<A.SendMessageResult>({ created: ids.length, emailed: body.alsoEmail ? ids.length : 0, emailFailed: 0, batchId: `b${s.batches.length}` });
  }
  if (is("GET", "/admin/inbox")) {
    const items = empty ? [] : s.inbox.map(({ thread: _t, phone: _p, ...i }) => i);
    return ok<X.InboxList>({ items, unread: items.filter((i) => i.unread).length });
  }
  if ((m = is("GET", "/admin/inbox/:id"))) {
    const i = s.inbox.find((x) => x.id === m![0]);
    if (!i) return notFound();
    i.unread = false;
    return ok<X.InboxThread>({ id: i.id, kind: i.kind, subject: i.subject, from: i.from, email: i.email, phone: i.phone, studentId: i.studentId, messages: i.thread });
  }
  if ((m = is("POST", "/admin/inbox/:id/reply"))) {
    const i = s.inbox.find((x) => x.id === m![0]);
    if (!i) return notFound();
    const text = String(body.text ?? "").trim();
    if (!text) return fail(400, "bad_request", "Write a reply first.", { fields: ["text"] });
    i.thread.push({ id: `m${Date.now()}`, from: "VIBHA team", mine: true, body: text, at: new Date().toISOString() });
    return ok<X.InboxThread>({ id: i.id, kind: i.kind, subject: i.subject, from: i.from, email: i.email, phone: i.phone, studentId: i.studentId, messages: i.thread });
  }

  /* -------------------------------------------------------- doubts */
  if (is("GET", "/admin/doubts")) {
    const items = (empty ? [] : s.doubts)
      .filter((d) => d.status !== "hidden" || query.kind === "hidden")
      .filter((d) => !query.kind || query.kind === "hidden" || d.kind === query.kind)
      .filter((d) => !query.student || s.students.find((r) => r.id === query.student)?.name === d.author)
      .map(({ body: _b, replies, ...d }) => ({ ...d, replies: replies.length }));
    return ok<C.DoubtList>({ items, nextCursor: null, cohorts: [C2, C1], ready: true });
  }
  if ((m = is("GET", "/doubts/:id"))) {
    const d = s.doubts.find((x) => x.id === m![0]);
    return d ? ok(d) : notFound();
  }
  if ((m = is("POST", "/doubts/:id/replies"))) {
    const d = s.doubts.find((x) => x.id === m![0]);
    if (!d) return notFound();
    const text = String(body.body ?? "").trim();
    if (!text) return fail(400, "bad_request", "Write an answer first.", { fields: ["body"] });
    d.replies.push({ id: `r${Date.now()}`, author: "VIBHA team", mine: true, body: text, votes: 0, youVoted: false, isSolution: false, createdAt: new Date().toISOString() });
    return ok<C.DoubtActionResult>({ thread: d });
  }
  if ((m = is("POST", "/admin/doubts/:id/hide"))) {
    const d = s.doubts.find((x) => x.id === m![0]);
    if (!d) return notFound();
    d.status = body.hidden ? "hidden" : d.replies.some((r) => r.isSolution) ? "solved" : "open";
    return ok({ hidden: d.status === "hidden" });
  }

  /* -------------------------------------------------------- review */
  if (is("GET", "/admin/review/submissions")) {
    const all = empty ? [] : s.submissions;
    return ok<X.SubmissionList>({ items: all.filter((x) => !query.status || x.status === query.status), pending: all.filter((x) => x.status === "pending").length });
  }
  if ((m = is("POST", "/admin/review/submissions/:id/grade"))) {
    const x = s.submissions.find((y) => y.id === m![0]);
    if (!x) return notFound();
    const g = Number(body.grade);
    if (!Number.isFinite(g) || g < 0 || g > x.maxGrade) return fail(400, "bad_request", `Give a grade from 0 to ${x.maxGrade}.`, { fields: ["grade"] });
    Object.assign(x, { grade: g, feedback: String(body.feedback ?? "") || null, status: "graded" });
    return ok(x);
  }
  if (is("GET", "/admin/review/signoffs")) return ok<X.SignOffList>({ items: empty ? [] : s.signoffs.filter((x) => x.status === "requested") });
  if ((m = is("POST", "/admin/review/signoffs/:id"))) {
    const x = s.signoffs.find((y) => y.id === m![0]);
    if (!x) return notFound();
    if (body.decision === "rejected" && !String(body.note ?? "").trim()) return fail(400, "bad_request", "Say why, so the student can fix it.", { fields: ["note"] });
    Object.assign(x, { status: body.decision === "rejected" ? "rejected" : "signed", note: (body.note as string) ?? null });
    return ok(x);
  }

  /* ------------------------------------------------------- cohorts */
  if (is("GET", "/admin/cohorts")) return ok<X.CohortList>({ items: empty ? [] : cohorts() });
  if ((m = is("GET", "/admin/cohorts/:id"))) {
    const row = cohorts().find((c) => c.id === m![0]);
    if (!row) return notFound();
    const members = s.students.filter((r) => r.cohorts.some((c) => c.id === row.id)).map((r) => ({ id: r.id, name: r.name, rollNumber: r.rollNumber, account: r.account, presence: r.presence, lastSeen: r.lastSeen, done: r.lecturesDone, available: r.lecturesAvailable }));
    return ok<X.CohortDetail>({ ...row, people: members, messages: row.id === "c2" ? s.batches.filter((b) => b.total > 1) : [], hoursWeek: Math.round(members.length * 2.4), sessions: row.status === "ended" ? [] : [{ title: "Live case discussion", at: ago(-60 * 30) }, { title: "Doubt clearing", at: ago(-60 * 24 * 4) }] });
  }

  /* -------------------------------------------------------- people */
  if (is("GET", "/admin/people")) return ok<X.PeopleList>({ items: empty ? [] : s.people.map(publicPerson) });
  if ((m = is("GET", "/admin/people/:key"))) {
    const p = s.people.find((x) => x.key === m![0]);
    return p ? ok(p) : notFound();
  }
  if ((m = is("POST", "/admin/people/:key/stage"))) {
    const p = s.people.find((x) => x.key === m![0]);
    if (!p) return notFound();
    const stage = String(body.stage ?? "") as X.StageId;
    if (!(stage in { new: 1, contacted: 1, call_done: 1, fee_shared: 1, joined: 1, no_reply: 1, not_interested: 1 })) return fail(400, "bad_request", "Pick a stage.");
    p.stage = stage;
    if ("followUpAt" in body) p.followUpAt = (body.followUpAt as string | null) ?? null;
    p.timeline.unshift({ title: `Moved to ${stage.replace("_", " ")}`, body: (body.note as string) || null, at: new Date().toISOString(), tone: "ok" });
    p.lastTouch = p.timeline[0]!.at;
    return ok(p);
  }
  if ((m = is("POST", "/admin/people/:key/note"))) {
    const p = s.people.find((x) => x.key === m![0]);
    if (!p) return notFound();
    const text = String(body.text ?? "").trim();
    if (!text) return fail(400, "bad_request", "Write the note first.", { fields: ["text"] });
    p.timeline.unshift({ title: "Note", body: text, at: new Date().toISOString(), tone: "quiet" });
    p.lastTouch = p.timeline[0]!.at;
    return ok(p);
  }
  if ((m = is("POST", "/admin/people/:key/invite"))) {
    const p = s.people.find((x) => x.key === m![0]);
    if (!p) return notFound();
    p.invitedAt = new Date().toISOString();
    p.timeline.unshift({ title: "Invitation sent", body: null, at: p.invitedAt, tone: "ok" });
    return ok<X.LoginLinkResult>({ sent: true, emailed: true, url: `https://vibhapsychology.com/setup?token=mock-${encodeURIComponent(p.key)}`, expiresAt: new Date(Date.now() + 7 * 86400_000).toISOString() });
  }
  if ((m = is("POST", "/admin/people/:key/paid"))) {
    const p = s.people.find((x) => x.key === m![0]);
    if (!p) return notFound();
    p.paid = body.paid !== false;
    p.timeline.unshift({ title: p.paid ? "Marked as paid" : "Marked as not paid", body: null, at: new Date().toISOString(), tone: p.paid ? "ok" : "warn" });
    return ok(p);
  }
  if (is("POST", "/admin/people/contact")) {
    const keys = Array.isArray(body.keys) ? (body.keys as string[]) : [];
    if (!keys.length) return fail(400, "bad_request", "Pick who it goes to.");
    if (!String(body.subject ?? "").trim() || !String(body.text ?? "").trim()) return fail(400, "bad_request", "Write a subject and a message.", { fields: ["subject", "text"] });
    return ok<X.BulkContactResult>({ sent: keys.length, failed: 0 });
  }
  if (is("GET", "/admin/enquiries")) {
    return ok<X.EnquiryList>({ items: empty ? [] : s.people.filter((p) => p.enquiredAt && !p.isStudent).map((p) => ({ id: `e-${p.key}`, personKey: p.key, name: p.name, email: p.email, phone: p.phone, message: p.timeline.find((t) => t.title.startsWith("Filled"))?.body ?? "No message.", at: p.enquiredAt!, answered: p.stage !== "new", source: p.source })) });
  }

  /* -------------------------------------------------- certificates */
  if (is("GET", "/admin/certificates")) return ok<X.CertificateList>({ items: empty ? [] : s.certs, ready: true });
  if (is("GET", "/admin/certificates/options")) return ok<X.StudioOptions>({ signatories: [{ name: "Dr. Sarthak Dave", role: "Director, VIBHA School of Psychology", signatureFrom: "sig-sd" }], signatures: [{ id: "sig-sd", label: "Dr. Sarthak Dave" }], emailReady: true });
  if (is("POST", "/admin/certificates")) {
    const input = body as unknown as X.StudioIssueInput;
    const recipients = input.recipients ?? [];
    if (!recipients.length) return fail(400, "bad_request", "Pick at least one student.");
    if (!String(input.title ?? "").trim()) return fail(400, "bad_request", "Give the certificate a title.");
    const code = { completion: "FN", provisional: "PV", recognition: "SR", custom: "CU" }[input.kind] ?? "CU";
    const ids = recipients.map((r, i) => `VIBHA-C2-${String(200 + s.certs.length + i).padStart(4, "0")}-${code}`);
    recipients.forEach((r, i) => s.certs.unshift({ credentialId: ids[i]!, title: input.title, kind: input.kind, recipient: r.name, recipientId: r.userId, issuedAt: new Date().toISOString(), expiresAt: input.expiresOn ? `${input.expiresOn}T18:29:59.000Z` : null, status: input.kind === "provisional" ? "provisional" : "valid", emailStatus: input.email ? "queued" : "not_sent", revokedAt: null, revokeReason: null }));
    return ok<X.IssueResult>({ issued: ids.length, emailed: 0, queued: input.email ? ids.length : 0, ids });
  }
  if ((m = is("POST", "/admin/certificates/:id/revoke"))) {
    const x = s.certs.find((c) => c.credentialId === m![0]);
    if (!x) return notFound();
    if (!String(body.reason ?? "").trim()) return fail(400, "bad_request", "Say why it is revoked.", { fields: ["reason"] });
    Object.assign(x, { status: "revoked", revokedAt: new Date().toISOString(), revokeReason: String(body.reason) });
    return ok(x);
  }
  if ((m = is("POST", "/admin/certificates/:id/resend"))) {
    const x = s.certs.find((c) => c.credentialId === m![0]);
    if (!x) return notFound();
    if (x.status === "revoked") return fail(409, "conflict", "A revoked certificate cannot be sent.");
    x.emailStatus = "queued";
    return ok<X.ResendResult>({ sent: true });
  }

  /* ------------------------------------------------- certificate area */
  if (is("GET", "/admin/certificates/types")) {
    const n = (k: string) => s.certs.filter((c) => c.kind === k).length;
    return ok<X.CertTypeList>({ items: [
      { id: "t-completion", name: "Completion", kind: "completion", about: "For finishing a course or module.", issued: n("completion"), auto: false },
      { id: "t-provisional", name: "Provisional", kind: "provisional", about: "Until the final one is ready. Runs out on a date.", issued: n("provisional"), auto: false },
      { id: "t-recognition", name: "Special recognition", kind: "recognition", about: "For something a student did well.", issued: n("recognition"), auto: false },
      { id: "t-custom", name: "Custom", kind: "custom", about: "Your own wording.", issued: n("custom"), auto: false },
      { id: "b-five", name: "First five lectures", kind: "badge", about: "Given by itself when a student finishes five lectures.", issued: n("badge"), auto: true },
      { id: "b-streak", name: "Seven day streak", kind: "badge", about: "Given by itself after seven days of study in a row.", issued: 0, auto: true },
    ] });
  }
  if (is("GET", "/admin/certificates/settings")) return ok(s.studio);
  if (is("PUT", "/admin/certificates/settings")) {
    s.studio = { ...s.studio, ...(body as Partial<X.StudioSettings>), emailReady: true };
    return ok(s.studio);
  }
  if ((m = is("POST", "/admin/certificates/:id/reissue"))) {
    const x = s.certs.find((c) => c.credentialId === m![0]);
    if (!x) return notFound();
    const id = `${x.credentialId}-R`;
    Object.assign(x, { status: "revoked", revokedAt: new Date().toISOString(), revokeReason: "Replaced by a new certificate", replacedBy: id });
    const next: X.CertRow = { ...x, credentialId: id, issuedAt: new Date().toISOString(), status: x.kind === "provisional" ? "provisional" : "valid", revokedAt: null, revokeReason: null, replacedBy: null, emailStatus: "queued" };
    s.certs.unshift(next);
    return ok(next);
  }

  /* --------------------------------------------------------- forms */
  if (is("GET", "/admin/forms")) return ok<X.FormList>({ items: empty ? [] : s.forms.map(({ questions: _q, respondents: _r, ...f }) => f) });
  if ((m = is("GET", "/admin/forms/:id"))) {
    const f = s.forms.find((x) => x.id === m![0]);
    return f ? ok(f) : notFound();
  }
  if ((m = is("POST", "/admin/forms/:id/email"))) {
    const f = s.forms.find((x) => x.id === m![0]);
    if (!f) return notFound();
    if (!String(body.subject ?? "").trim() || !String(body.text ?? "").trim()) return fail(400, "bad_request", "Write a subject and a message.", { fields: ["subject", "text"] });
    const to = body.ids === "all" ? f.respondents : f.respondents.filter((r) => (body.ids as string[]).includes(r.id));
    to.forEach((r) => (r.emailed = true));
    return ok<X.BulkContactResult>({ sent: to.length, failed: 0 });
  }

  /* ---------------------------------------------------------- push */
  if (is("GET", "/admin/push-preferences")) return ok(s.prefs);
  if (is("PUT", "/admin/push-preferences")) {
    s.prefs = { ...s.prefs, ...(body as Partial<X.AdminPushPrefs>) };
    return ok(s.prefs);
  }
  return path.startsWith("/admin") ? notFound() : null;
}
