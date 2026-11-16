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
import { PEOPLE_VIEWS, STAGES } from "./extra";
import { inPeopleView } from "./format";

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
    status: p.blocked ? "paused" : "active",
    progressPct: Math.round(((p.lecturesDone ?? 4) / (p.lecturesAvailable ?? 8)) * 100),
    lecturesOnly: p.scope === "lectures_only",
    cohort: (p.cohorts ?? [C2])[0]?.name ?? null,
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
  types: X.CertType[];
  keys: X.SupportKeyView[];
  legacyKey: boolean;
};

function fresh(): AdminState {
  return {
    students: seedStudents(),
    doubts: seedDoubts(),
    inbox: seedInbox(),
    submissions: [
      { id: "s1", studentId: "u5", studentName: "Sana Khan", assignment: "Write up a first interview", course: "Clinical Psychology in Practice", submittedAt: ago(60 * 2), status: "pending", grade: null, maxGrade: 100, feedback: null, answer: "The patient, a 24 year old woman, came with low mood for three weeks after a breakup. Sleep is reduced, appetite normal, she still meets friends on weekends. No thoughts of self harm. I would see this as an adjustment reaction for now and review in two weeks.", file: null },
      { id: "s2", studentId: "u1", studentName: "Ananya Mehta", assignment: "Mental status examination notes", course: "Clinical Psychology in Practice", submittedAt: ago(60 * 20), status: "pending", grade: null, maxGrade: 100, feedback: null, answer: "", file: "mse-notes-ananya.pdf" },
      { id: "s3", studentId: "u8", studentName: "Dev Malhotra", assignment: "Write up a first interview", course: "Clinical Psychology in Practice", submittedAt: ago(60 * 50), status: "graded", reviewed: "returned", grade: 80, maxGrade: 100, feedback: "Clear history. Add a short summary and your next step at the end.", answer: "A 31 year old man with worry about his health for six months...", file: null },
    ],
    signoffs: [
      { id: "so1", studentId: "u5", studentName: "Sana Khan", activity: "Observed intake interviews at the clinic", hours: 6, date: dayStr(3), supervisor: "Dr. Sarthak Dave", competency: "Interviewing", status: "requested", studentEmail: "sana@example.com" },
      { id: "so2", studentId: "u10", studentName: "Neha Joshi", activity: "Case presentation: generalised anxiety", hours: 2, date: dayStr(6), supervisor: "Dr. Sarthak Dave", competency: "Case formulation", status: "requested", studentEmail: "neha@example.com" },
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
    keys: [
      { id: "k1", label: "Kavya's laptop", last4: "Q2mX", createdAt: ago(60 * 24 * 9), createdByEmail: "admin@example.com", revokedAt: null, revokedByEmail: null, lastUsedAt: ago(60 * 5) },
      { id: "k0", label: "Front desk", last4: "a91B", createdAt: ago(60 * 24 * 40), createdByEmail: "admin@example.com", revokedAt: ago(60 * 24 * 12), revokedByEmail: "admin@example.com", lastUsedAt: ago(60 * 24 * 13) },
    ],
    legacyKey: true,
    studio: { signatories: [{ name: "Dr. Sarthak Dave", role: "Director, VIBHA School of Psychology", signatureFrom: "sig-sd" }], signatures: [{ id: "sig-sd", label: "Dr. Sarthak Dave", url: null }], email: { configured: true, limit: 100, sentToday: 8, waiting: 0 }, canWrite: true },
    types: [
      { id: "t1", type: "badge", title: "First module done", description: "Finished a whole module.", tone: "lime", enabled: true, issued: 18, ruleText: "Finish Foundations", rule: { kind: "module_complete", module: "foundations" }, madeForYou: false, hasSignature: false, signatureLabel: null },
      { id: "t2", type: "badge", title: "Helping hand", description: "Helped a classmate.", tone: "blue", enabled: true, issued: 4, ruleText: "Given by hand", rule: null, madeForYou: false, hasSignature: false, signatureLabel: null },
      { id: "t3", type: "certificate", title: "Clinical Psychology in Practice", description: null, tone: "ink", enabled: true, issued: 0, ruleText: "Finish Clinical Psychology in Practice", rule: { kind: "course_complete", course_id: "k1" }, madeForYou: false, hasSignature: true, signatureLabel: "Dr. Sarthak Dave" },
      { id: "t4", type: "certificate", title: "Signature: Dr. Sarthak Dave", description: null, tone: "ink", enabled: false, issued: 0, ruleText: "Given by hand", rule: null, madeForYou: true, hasSignature: true, signatureLabel: "Dr. Sarthak Dave" },
    ],
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
    { userId: "u5", name: "Sana Khan", meta: "VIBHA-000142", where: "Lecture: Anxiety disorders: telling them apart", lessonId: "l7", since: ago(14), watching: true },
    { userId: "u1", name: "Ananya Mehta", meta: "VIBHA-000123", where: "Study", lessonId: null, since: ago(6), watching: false },
  ];
}

/** A small certificate drawing in the server's operations (the real one is the website's layout). */
function mockDrawing(b: Record<string, unknown>): A.StudioPreview {
  const recipients = (Array.isArray(b.recipients) ? b.recipients : []) as { name: string }[];
  const name = recipients[Math.min(Number(b.showing ?? 0), Math.max(0, recipients.length - 1))]?.name ?? "";
  const problems = [...(!String(b.title ?? "").trim() ? ["Give the certificate a title."] : []), ...(!recipients.length ? ["Pick at least one student."] : [])];
  const bar = (x: number, y: number, w: number, h: number) => `M${x} ${y}H${x + w}V${y + h}H${x}Z`;
  return {
    v: 1,
    width: 842,
    height: 595,
    ops: [
      { k: "rect", x: 0, y: 0, w: 842, h: 595, fill: "#fbfaf6" },
      { k: "rect", x: 0, y: 0, w: 214, h: 595, fill: "#2f49d1" },
      { k: "stroke", d: "M60 90 L107 140 L154 90", stroke: "#d8f36a", sw: 10 },
      { k: "path", d: bar(272, 120, 300, 18), fill: "#1b1b1f" },
      { k: "path", d: bar(272, 200, Math.min(480, 40 + name.length * 18), 34), fill: "#1b1b1f" },
      { k: "path", d: bar(272, 270, 360, 16), fill: "#55555f" },
      { k: "line", x1: 272, y1: 470, x2: 440, y2: 470, stroke: "#1b1b1f", sw: 1 },
    ],
    images: {},
    problems,
  };
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
  const mine = path.startsWith("/admin") || /^\/doubts\/[^/]+$/.test(path);
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
    const complaints = empty ? 0 : s.doubts.filter((d) => d.kind === "complaint" && d.status === "open").length;
    const pendingSubs = empty ? 0 : s.submissions.filter((x) => x.status === "pending").length;
    const logins = rows.filter((r) => r.flags.includes("login")).length;
    const todo: A.AdminTodo[] = [
      ...(complaints ? [{ id: "0:/admin/inbox", label: "Student concerns", count: complaints, detail: "Private concerns waiting on a reply", target: { screen: "unknown" as const, web: "/admin/inbox" }, urgent: true }] : []),
      ...(empty ? [] : [{ id: "1:/admin/emails?folder=inbox", label: "Reply to emails", count: s.inbox.filter((i) => i.kind === "email" && i.unread).length, detail: "Replies from students", target: { screen: "unknown" as const, web: "/admin/emails?folder=inbox" }, urgent: false }]),
      ...(pendingSubs ? [{ id: "2:/admin/submissions", label: "Grade submissions", count: pendingSubs, detail: "Hand-ins waiting for feedback", target: { screen: "unknown" as const, web: "/admin/submissions" }, urgent: false }] : []),
      ...(logins ? [{ id: "3:/admin/students/logins", label: "Fix logins", count: logins, detail: "Their login link ran out or the email failed", target: { screen: "unknown" as const, web: "/admin/students/logins" }, urgent: false }] : []),
      ...(empty ? [] : [{ id: "4:/admin/activity?view=behind", label: "Check on quiet students", count: rows.filter((r) => r.flags.includes("quiet")).length, detail: "No visit in a week", target: { screen: "unknown" as const, web: "/admin/activity?view=behind" }, urgent: false }]),
    ].filter((t) => t.count > 0);
    const cards = empty ? [] : cohorts().filter((c) => c.status !== "upcoming").map((c) => ({ id: c.id, name: c.name, members: c.members, week: c.activeWeek, behind: c.behind, pct: c.pct }));
    return ok<A.AdminHome>({
      v: 1,
      dateLine: "Sun, 15 Nov",
      todo,
      totalToDo: todo.reduce((n, t) => n + t.count, 0),
      counts: { students: rows.length, activeThisWeek: rows.filter((r) => ["now", "today", "week"].includes(r.presence)).length, onNow: empty ? 0 : live().length, neverIn: rows.filter((r) => r.presence === "never").length, needsLook: needs.length, locked: rows.filter((r) => r.blocked).length, openComplaints: complaints, dbPct: 31 },
      needsLook: needs.slice(0, 20),
      attention: needs.slice(0, 20).map((r) => ({ id: `att-${r.id}`, studentId: r.id, name: r.name, reason: r.flags.join(", "), since: r.lastSeen, flags: r.flags })),
      live: empty ? [] : live(),
      cohorts: cards,
      today: { active: 0, total: rows.length, lecturesWatched: null, doubtsOpen: 0, submissionsToGrade: pendingSubs },
      canWrite: role === "admin",
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
    return r ? ok<A.AdminStudentProfile>({ ...r, row: r, phone: r.presence === "never" ? null : { name: "Pixel 7", platform: "android", changesUsed: s.allowed.has(r.id) ? 0 : 1, limit: 2, nextChangeAt: null }, lectures: { done: r.lecturesDone, total: r.lecturesAvailable }, detail: detailFor(r) as unknown as Record<string, unknown>, recent: [], canWrite: role === "admin" }) : notFound();
  }
  if ((m = is("GET", "/admin/students/:id/credentials"))) return ok({ items: s.certs.filter((c) => c.recipientId === m![0]) });
  if ((m = is("GET", "/admin/students/:id/messages"))) {
    const r = s.students.find((x) => x.id === m![0]);
    if (!r) return notFound();
    const seen = r.presence !== "never";
    return ok<A.StudentMessages>({ v: 1, items: [
      { id: "bell:sm1", from: "bell", title: "Lecture 6 opens on Monday", at: ago(60 * 3), opened: seen, state: seen ? "Opened" : "Not opened", failed: false },
      { id: "email:sm3", from: "email", title: "Your login link", at: ago(60 * 24 * 2), opened: seen, state: seen ? "Opened" : "Sent", failed: false },
      { id: "reply:sm4", from: "reply", title: "Re: Your login link", at: ago(60 * 24 * 2 - 30), opened: true, state: "Reply", failed: false },
      { id: "bell:sm2", from: "bell", title: "Welcome to Cohort Two", at: ago(60 * 24 * 13), opened: seen, state: seen ? "Opened" : "Not opened", failed: false },
    ] });
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
    return ok<A.LoginLinkResult>({ sent: true });
  }
  if (is("POST", "/admin/devices/allow-change")) {
    s.allowed.add(String(body.userId ?? ""));
    return ok<C.AllowDeviceChangeResult>({ allowed: true });
  }

  /* ------------------------------------------------------ activity */
  if (is("GET", "/admin/activity")) {
    const rows = empty ? [] : s.students;
    const heat = Array.from({ length: 7 }, (_, d) => Array.from({ length: 24 }, (_, h) => (h >= 7 && h <= 23 ? Math.round(((Math.sin(h / 3 + d) + 1) * (h >= 19 ? 30 : 12))) : 0)));
    const behind = rows.filter((r) => r.flags.includes("behind") || (r.lecturesAvailable && r.lecturesDone / r.lecturesAvailable < 0.4 && r.presence !== "never"));
    const view = (["live", "behind", "cohorts", "all"] as const).find((v) => v === query.view) ?? "all";
    const data = view === "all" ? { rows: rowsToActivity(rows), heat, pages: [{ label: "Lectures (watching)", min: 1840 }, { label: "Study", min: 960 }, { label: "Practice", min: 410 }, { label: "Doubts", min: 120 }], totals: { students: rows.length, active7: rows.filter((r) => r.minutes7 > 0).length, activeNow: empty ? 0 : 2, hours30: Math.round(rows.reduce((a, r) => a + r.minutes7 * 4, 0) / 60), lecturesDone: rows.reduce((a, r) => a + r.lecturesDone, 0) }, live: empty ? [] : live() } : null;
    return ok<A.AdminActivity>({ v: 1, kind: "admin.activity", data, view, live: empty ? [] : live(), behind, cohorts: empty ? [] : cohorts().filter((c) => c.status !== "upcoming").map((c) => ({ id: c.id, name: c.name, members: c.members, week: c.activeWeek, behind: c.behind, pct: c.pct })), rows: [], items: [] });
  }

  /* ------------------------------------------------------ messages */
  if (is("GET", "/admin/messages")) return ok<A.MessageBatches>({ v: 1, batches: empty ? [] : s.batches, ready: true, items: [], cohorts: empty ? [] : cohorts().filter((c) => c.members > 0).map((c) => ({ id: c.id, name: c.name, status: c.status, members: c.members })), courses: [{ id: "k1", title: "Clinical Psychology in Practice", members: s.students.length }], students: s.students.length });
  if (is("POST", "/admin/messages")) {
    const to = String(body.to ?? "students");
    const toId = String(body.toId ?? "");
    const ids = to === "everyone" || to === "course" ? s.students.map((r) => r.id) : to === "cohort" ? s.students.filter((r) => r.cohorts.some((c) => c.id === toId)).map((r) => r.id) : to === "student" ? [toId].filter(Boolean) : Array.isArray(body.userIds) ? (body.userIds as string[]) : [];
    const title = String(body.title ?? "").trim();
    if (!ids.length) return fail(400, "bad_request", "Pick who it goes to.", { fields: ["userIds"] });
    if (!title || !String(body.body ?? body.text ?? "").trim()) return fail(400, "bad_request", "Write a title and a message.", { fields: ["title", "body"] });
    s.batches.unshift({ batchId: `b${s.batches.length + 1}`, title, sentAt: new Date().toISOString(), total: ids.length, opened: 0, type: "announcement" });
    return ok<A.SendMessageResult>({ sent: ids.length, created: ids.length, emailed: body.alsoEmail ? ids.length : 0, emailFailed: 0, batchId: `b${s.batches.length}` });
  }
  if (is("GET", "/admin/inbox")) {
    const waiting = empty ? [] : s.doubts.filter((d) => d.status === "open" && !d.replies.some((r) => r.mine));
    const threads = waiting.map((d) => {
      const r = s.students.find((x) => x.name === d.author);
      return { id: d.id, title: d.title, body: d.body, kind: d.kind, cohortId: d.cohortId, cohortName: "Cohort Two", authorId: r?.id ?? "", author: d.author, authorEmail: r?.email ?? "", createdAt: d.createdAt, reason: (d.kind === "complaint" ? "concern" : d.replies.length ? "student-replied" : "unanswered") as "concern" | "unanswered" | "student-replied" };
    });
    const emails = empty ? [] : s.inbox.filter((i) => i.unread && i.kind === "email").map((i) => ({ id: i.id, fromEmail: i.email, fromName: i.from, subject: i.subject, body: i.thread[i.thread.length - 1]?.body ?? "", receivedAt: i.at }));
    return ok<A.AdminInbox>({ v: 1, ready: true, threads, emails, canWrite: role === "admin" });
  }
  if ((m = is("POST", "/admin/inbox/emails/:id/reply"))) {
    const i = s.inbox.find((x) => x.id === m![0]);
    if (!i) return notFound();
    const text = String(body.text ?? "").trim();
    if (!text) return fail(400, "bad_request", "Write a reply first.", { fields: ["text"] });
    i.thread.push({ id: `m${Date.now()}`, from: "VIBHA team", mine: true, body: text, at: new Date().toISOString() });
    i.unread = false;
    return ok<A.AdminReplyResult>({ sent: true });
  }
  if ((m = is("POST", "/admin/inbox/emails/:id/read"))) {
    const i = s.inbox.find((x) => x.id === m![0]);
    if (!i) return notFound();
    i.unread = false;
    return ok({ read: true });
  }

  /* -------------------------------------------------------- doubts */
  if (is("GET", "/admin/doubts")) {
    const items = (empty ? [] : s.doubts)
      .filter((d) => d.status !== "hidden" || query.kind === "hidden")
      .filter((d) => !query.kind || query.kind === "hidden" || d.kind === query.kind)
      .filter((d) => !query.student || s.students.find((r) => r.id === query.student)?.name === d.author)
      .map(({ body: _b, replies, ...d }) => {
        const last = replies[replies.length - 1];
        // The team: this admin's own answers, Dr. Sarthak's, or "VIBHA team".
        const lastReplyBy = last ? (last.mine || /^Dr\.|VIBHA/.test(last.author) ? ("faculty" as const) : ("student" as const)) : null;
        return { ...d, replies: replies.length, lastReplyBy };
      });
    return ok<C.DoubtList>({ items, nextCursor: null, cohorts: [C2, C1], ready: true });
  }
  if ((m = is("GET", "/doubts/:id"))) {
    const d = s.doubts.find((x) => x.id === m![0]);
    return d ? ok(d) : notFound();
  }
  if ((m = is("POST", "/admin/doubts/:id/reply"))) {
    const d = s.doubts.find((x) => x.id === m![0]);
    if (!d) return notFound();
    const text = String(body.text ?? "").trim();
    if (!text) return fail(400, "bad_request", "Write an answer first.", { fields: ["text"] });
    d.replies.push({ id: `r${Date.now()}`, author: "VIBHA team", mine: true, body: text, votes: 0, youVoted: false, isSolution: false, createdAt: new Date().toISOString() });
    return ok<A.AdminReplyResult>({ sent: true });
  }
  if ((m = is("POST", "/admin/doubts/:id/draft"))) {
    const d = s.doubts.find((x) => x.id === m![0]);
    if (!d) return notFound();
    return ok<A.AdminDraftResult>({ text: `Good question. ${d.title.replace(/\?$/, "")}: start from what the lecture showed, then look at how long it lasts and what it stops the person doing. Bring it up in the next live session if it is still unclear.` });
  }
  if ((m = is("POST", "/admin/doubts/:id/hide"))) {
    const d = s.doubts.find((x) => x.id === m![0]);
    if (!d) return notFound();
    d.status = body.hidden ? "hidden" : d.replies.some((r) => r.isSolution) ? "solved" : "open";
    return ok({ hidden: d.status === "hidden" });
  }

  /* -------------------------------------------------------- review */
  if (is("GET", "/admin/submissions")) {
    const all = empty ? [] : s.submissions;
    const items: A.AdminSubmission[] = all
      .filter((x) => !query.status || x.status === query.status)
      .map((x) => ({ id: x.id, studentId: x.studentId, studentEmail: s.students.find((r) => r.id === x.studentId)?.email ?? null, studentName: x.studentName, assignmentId: `as-${x.assignment.length}`, assignmentTitle: x.assignment, lessonTitle: "Lecture 2", courseId: "k1", courseTitle: x.course, status: x.status === "graded" ? (x.reviewed ?? "returned") : "submitted", submittedAt: x.submittedAt, late: false, text: x.answer || null, hasAudio: false, files: x.file ? [{ id: `file-${x.id}`, name: x.file, format: "pdf" }] : [], score: x.grade, feedback: x.feedback, note: null }));
    return ok<A.AdminSubmissions>({ v: 1, items, nextCursor: null, pending: all.filter((x) => x.status === "pending").length, courses: [{ id: "k1", title: "Clinical Psychology in Practice" }], assignments: [], canWrite: role === "admin" });
  }
  if ((m = is("POST", "/admin/submissions/:id/grade")) || (m = is("POST", "/admin/submissions/:id/approve"))) {
    const x = s.submissions.find((y) => y.id === m![0]);
    if (!x) return notFound();
    if (path.endsWith("/approve")) {
      Object.assign(x, { status: "graded", reviewed: "approved" });
      return ok<A.ReviewResult>({ status: "approved" });
    }
    const g = body.score === null || body.score === undefined ? null : Number(body.score);
    if (g !== null && (!Number.isFinite(g) || g < 0 || g > 1000)) return fail(400, "bad_request", "Give a score from 0 to 100.", { fields: ["score"] });
    Object.assign(x, { grade: g, feedback: String(body.feedback ?? "") || null, status: "graded", reviewed: "returned" });
    return ok<A.ReviewResult>({ status: "returned" });
  }
  if ((m = is("GET", "/admin/submissions/:id/files/:fileId"))) return ok<A.AdminFileLink>({ url: `https://vibhapsychology.com/mock/files/${m[1]}`, expiresInSeconds: 900 });
  if (is("GET", "/admin/review/signoffs")) return ok<A.SignOffList>({ v: 1, canWrite: role === "admin", items: empty ? [] : s.signoffs.filter((x) => x.status === "requested") });
  if ((m = is("POST", "/admin/review/signoffs/:id"))) {
    const x = s.signoffs.find((y) => y.id === m![0]);
    if (!x) return notFound();
    if (x.status !== "requested") return fail(409, "conflict", "This entry is not waiting for a sign-off any more.");
    if (body.decision !== "signed" && body.decision !== "rejected") return fail(400, "bad_request", "Sign or reject.", { fields: ["decision"] });
    x.status = body.decision;
    return ok<A.SignOffResult>({ id: x.id, status: x.status });
  }

  /* ------------------------------------------------------- cohorts */
  if (is("GET", "/admin/cohorts")) return ok({ v: 1, items: empty ? [] : cohorts(), unassigned: empty ? 0 : 2, ready: true, canWrite: role === "admin" });
  if ((m = is("GET", "/admin/cohorts/:id"))) {
    const row = cohorts().find((c) => c.id === m![0]);
    if (!row) return notFound();
    const members = s.students.filter((r) => r.cohorts.some((c) => c.id === row.id)).map((r) => ({ id: r.id, name: r.name, rollNumber: r.rollNumber, account: r.account, presence: r.presence, lastSeen: r.lastSeen, done: r.lecturesDone, available: r.lecturesAvailable }));
    return ok<X.CohortDetail>({ ...row, people: members, messages: row.id === "c2" ? s.batches.filter((b) => b.total > 1) : [], hoursWeek: Math.round(members.length * 2.4), sessions: row.status === "ended" ? [] : [{ title: "Live case discussion", at: ago(-60 * 30) }, { title: "Doubt clearing", at: ago(-60 * 24 * 4) }] });
  }

  /* -------------------------------------------------------- people */
  if (is("GET", "/admin/people")) {
    const all = (empty ? [] : s.people).filter((p) => query.enquiries !== "1" || !!p.enquiredAt);
    const needle = (query.q ?? "").toLowerCase();
    const matching = all.filter((p) => !needle || `${p.name} ${p.email} ${p.phone ?? ""}`.toLowerCase().includes(needle));
    const view = (PEOPLE_VIEWS.find((v) => v.id === query.view)?.id ?? "all") as X.PeopleView;
    const items = matching.filter((p) => inPeopleView(p, view));
    const counts = Object.fromEntries(PEOPLE_VIEWS.map((v) => [v.id, matching.filter((p) => inPeopleView(p, v.id)).length])) as Record<A.PeopleView, number>;
    return ok<A.AdminPeople>({
      v: 1,
      items: items.map((p) => ({ key: p.key, name: p.name, email: p.email, phone: p.phone, college: null, stage: p.stage, stageLabel: p.stage, source: p.source ?? "website", isStudent: p.isStudent || !!p.studentId, isEnquiry: !!p.enquiredAt, joined: p.isStudent, studentId: p.studentId, cohorts: [], firstSeenAt: p.enquiredAt, lastContactAt: p.lastTouch, lastContact: "week", lastSeenAt: null, followUpAt: p.followUpAt, inviteSentAt: p.invitedAt, paidAt: p.paid ? ago(60 * 24 * 3) : null, paidAmount: null, message: p.timeline.find((t) => t.title.startsWith("Filled"))?.body ?? null, whatsapp: p.phone ? `https://wa.me/91${p.phone}` : null })),
      nextCursor: null,
      total: items.length,
      view,
      counts,
      views: PEOPLE_VIEWS.map((v) => ({ id: v.id as A.PeopleView, label: v.label })),
      quietDays: 14,
      quietChoices: [7, 14, 30],
      stages: [],
      lastContactChoices: [],
      cohorts: [C2, C1],
      sources: [],
      paymentReady: true,
      followUpsDue: 1,
      waiting: 0,
      allowance: { configured: true, limit: 100, left: 92 },
      mergeFields: [{ key: "first_name", label: "First name" }, { key: "name", label: "Full name" }],
      canWrite: role === "admin",
    });
  }
  const person = (key: string) => s.people.find((x) => x.key === key);
  if ((m = is("GET", "/admin/people/:key")) && !["email", "whatsapp"].includes(m[0]!)) {
    const p = person(m[0]!);
    if (!p) return notFound();
    return ok({ v: 1, key: p.key, name: p.name, email: p.email, phone: p.phone, college: p.college ?? null, stage: p.stage, stageLabel: p.stage, source: p.source ?? "website", isStudent: p.isStudent, isEnquiry: !!p.enquiredAt, joined: p.isStudent, studentId: p.studentId, cohorts: p.cohorts ?? [], firstSeenAt: p.enquiredAt, lastContactAt: p.lastTouch, lastContact: "week", lastSeenAt: null, followUpAt: p.followUpAt, inviteSentAt: p.invitedAt, paidAt: p.paid ? ago(60 * 24 * 3) : null, paidAmount: null, message: null, whatsapp: p.phone ? `https://wa.me/91${p.phone}` : null, facts: p.facts, timeline: p.timeline.map((t) => ({ ...t, kind: "note" })), paymentReady: true, canWrite: role === "admin" });
  }
  const touch = (p: X.PersonDetail, title: string, bodyText: string | null, tone: X.PersonEvent["tone"]) => {
    p.timeline.unshift({ title, body: bodyText, at: new Date().toISOString(), tone });
    p.lastTouch = p.timeline[0]!.at;
  };
  if ((m = is("POST", "/admin/people/:key/stage"))) {
    const p = person(m[0]!);
    if (!p) return notFound();
    const stage = String(body.stage ?? "") as X.StageId;
    if (!STAGES.some((x) => x.id === stage)) return fail(400, "bad_request", "Pick a stage.");
    p.stage = stage;
    touch(p, `Moved to ${stage.replace("_", " ")}`, null, "ok");
    return ok<A.PersonSaved>({ saved: true });
  }
  if ((m = is("POST", "/admin/people/:key/follow-up"))) {
    const p = person(m[0]!);
    if (!p) return notFound();
    p.followUpAt = body.date ? `${String(body.date)}T04:30:00.000Z` : null;
    return ok<A.PersonSaved>({ saved: true });
  }
  if ((m = is("POST", "/admin/people/:key/activity"))) {
    const p = person(m[0]!);
    if (!p) return notFound();
    const text = String(body.text ?? "").trim();
    if (!text) return fail(400, "bad_request", "Write the note first.", { fields: ["text"] });
    touch(p, body.kind === "note" ? "Note" : String(body.kind), text, "quiet");
    return ok<A.PersonSaved>({ saved: true });
  }
  if ((m = is("POST", "/admin/people/:key/invite"))) {
    const p = person(m[0]!);
    if (!p) return notFound();
    p.invitedAt = new Date().toISOString();
    touch(p, "Invitation sent", null, "ok");
    return ok<A.InviteResult>({ sent: true, reason: null });
  }
  if ((m = is("POST", "/admin/people/:key/paid"))) {
    const p = person(m[0]!);
    if (!p) return notFound();
    p.paid = body.paid !== false;
    touch(p, p.paid ? "Marked as paid" : "Marked as not paid", null, p.paid ? "ok" : "warn");
    return ok<A.MarkPaidResult>({ paid: p.paid });
  }
  if (is("POST", "/admin/people/email")) {
    const keys = Array.isArray(body.keys) ? (body.keys as string[]) : [];
    if (!keys.length) return fail(400, "bad_request", "Pick who it goes to.");
    if (!String(body.subject ?? "").trim() || !String(body.body ?? "").trim()) return fail(400, "bad_request", "Write a subject and a message.", { fields: ["subject", "body"] });
    const names = keys.map((k) => person(k)?.name ?? k);
    return ok<A.PersonalEmailReport>({ sent: names, queued: [], failed: [], noEmail: [], duplicates: 0, remainingToday: 92 - names.length, queueFailed: false });
  }
  if (is("POST", "/admin/people/whatsapp")) {
    const keys = Array.isArray(body.keys) ? (body.keys as string[]) : [];
    return ok<A.PeopleWhatsAppResult>({ links: keys.map((k) => { const p = person(k); return { key: k, name: p?.name ?? k, url: p?.phone ? `https://wa.me/91${p.phone}?text=${encodeURIComponent(String(body.text ?? "").replace("{first_name}", p.name.split(" ")[0]!))}` : null }; }) });
  }
  if (is("POST", "/admin/people/email/send-waiting")) return ok<A.SendWaitingResult>({ sent: 0, failed: 0, left: 0 });

  /* -------------------------------------------------- certificates */
  if (is("GET", "/admin/certificates/issued")) {
    const q = (query.q ?? "").toLowerCase();
    const items = (empty ? [] : s.certs).filter((x) => (!query.student || x.recipientId === query.student) && (!q || `${x.recipient} ${x.title} ${x.credentialId}`.toLowerCase().includes(q)) && (!query.type || (query.type === "badge" ? x.kind === "badge" : query.type === "certificate" ? x.kind !== "badge" : x.kind === query.type)) && (!query.status || x.status === query.status));
    const all = empty ? [] : s.certs;
    return ok({ v: 1, items: items.map((x) => ({ ...x, userId: x.recipientId, name: x.recipient, type: x.kind === "badge" ? "badge" : "certificate", typeLabel: x.kind === "badge" ? "Badge" : x.kind, statusLine: x.status, recordStatus: x.status, issuedDay: x.issuedAt.slice(0, 10), email: null, roll: null, cohortIds: ["c2"], canCorrect: x.kind !== "badge", isDraft: x.status === "draft", hasPdf: x.kind !== "badge", verifyUrl: `https://vibhapsychology.com/verify/${x.credentialId}` })), nextCursor: null, total: items.length, counts: { certificate: all.filter((x) => x.kind !== "badge").length, badge: all.filter((x) => x.kind === "badge").length, completion: 0, provisional: 0, recognition: 0, custom: 0 }, types: [], statuses: [], cohorts: [C2, C1], waiting: all.filter((x) => x.emailStatus === "queued").length, emailOn: true, canWrite: role === "admin", person: null });
  }
  if (is("GET", "/admin/certificates/studio")) return ok({ v: 1, canWrite: role === "admin", ready: true, today: dayStr(0), kinds: [], students: s.students.map((r) => ({ id: r.id, name: r.name, email: r.email, roll: r.rollNumber, cohortIds: r.cohorts.map((c) => c.id) })), cohorts: [{ ...C2, count: 10 }, { ...C1, count: 2 }], courses: [{ id: "k1", title: "Clinical Psychology in Practice" }], signatures: [{ id: "sig-sd", label: "Dr. Sarthak Dave", url: null }], email: { configured: true, remaining: 92, limit: 100 }, signatories: s.studio.signatories });
  if (is("POST", "/admin/certificates/issue")) {
    const input = body as unknown as X.StudioIssueInput;
    const recipients = input.recipients ?? [];
    if (!recipients.length) return fail(400, "bad_request", "Pick at least one student.");
    if (!String(input.title ?? "").trim()) return fail(400, "bad_request", "Give the certificate a title.");
    const code = { completion: "FN", provisional: "PV", recognition: "SR", custom: "CU" }[input.kind] ?? "CU";
    const ids = recipients.map((r, i) => `VIBHA-C2-${String(200 + s.certs.length + i).padStart(4, "0")}-${code}`);
    if (input.replaces) {
      const old = s.certs.find((c) => c.credentialId === input.replaces);
      if (old) Object.assign(old, { status: "revoked", revokedAt: new Date().toISOString(), revokeReason: "Replaced by a corrected certificate", replacedBy: ids[0] });
    }
    recipients.forEach((r, i) => s.certs.unshift({ credentialId: ids[i]!, title: input.title, kind: input.kind, recipient: r.name, recipientId: r.userId, issuedAt: new Date().toISOString(), expiresAt: input.expiresOn ? `${input.expiresOn}T18:29:59.000Z` : null, status: input.kind === "provisional" ? "provisional" : "valid", emailStatus: input.email ? "queued" : "not_sent", revokedAt: null, revokeReason: null }));
    return ok<A.StudioIssueResult>({ issued: recipients.map((r, i) => ({ credentialId: ids[i]!, userId: r.userId, name: r.name })), skipped: [], batchId: "cb1", delivery: { sent: 0, queued: input.email ? ids.length : 0 } });
  }
  if (is("POST", "/admin/certificates/send-waiting")) {
    const waiting = s.certs.filter((c) => c.emailStatus === "queued");
    waiting.forEach((c) => (c.emailStatus = "sent"));
    return ok<A.SendWaitingResult>({ sent: waiting.length, failed: 0, left: 0 });
  }
  if ((m = is("POST", "/admin/certificates/:id/issue-draft"))) {
    const x = s.certs.find((c) => c.credentialId === m![0]);
    if (!x) return notFound();
    x.status = "valid";
    return ok<A.IssueDraftResult>({ issued: true });
  }
  if ((m = is("GET", "/admin/certificates/:id/pdf"))) return ok<A.AdminFileLink>({ url: `https://vibhapsychology.com/mock/certificates/${m[0]}.pdf`, expiresInSeconds: 300 });
  if (is("GET", "/admin/badges")) {
    const n = s.certs.filter((c) => c.kind === "badge").length;
    return ok<A.AdminBadges>({ v: 1, canWrite: role === "admin", maxRecipients: 200, badges: [
      { id: "b-five", title: "First five lectures", description: "Given by itself when a student finishes five lectures.", icon: null, tone: "lime", enabled: true, issuedCount: n, automatic: true },
      { id: "b-helper", title: "Helpful peer", description: "For answering other students' doubts well.", icon: null, tone: "blue", enabled: true, issuedCount: 0, automatic: false },
    ] });
  }
  if ((m = is("POST", "/admin/badges/:id/award"))) {
    const ids = Array.isArray(body.userIds) ? (body.userIds as string[]) : [];
    if (!ids.length) return fail(400, "bad_request", "Pick at least one student.");
    const awarded = ids.map((id, i) => {
      const r = s.students.find((x) => x.id === id);
      const credentialId = `VIBHA-BD-${String(300 + s.certs.length + i)}`;
      s.certs.unshift({ credentialId, title: m![0] === "b-helper" ? "Helpful peer" : "First five lectures", kind: "badge", recipient: r?.name ?? "Student", recipientId: id, issuedAt: new Date().toISOString(), expiresAt: null, status: "valid", emailStatus: "not_sent", revokedAt: null, revokeReason: null });
      return { userId: id, name: r?.name ?? "Student", credentialId };
    });
    return ok<A.AwardBadgeResult>({ awarded, skipped: [] });
  }
  if (is("POST", "/admin/badges/award-all")) return ok<A.AwardAllResult>({ awarded: 2, skipped: 5 });
  if ((m = is("POST", "/admin/certificates/:id/revoke"))) {
    const x = s.certs.find((c) => c.credentialId === m![0]);
    if (!x) return notFound();
    if (!String(body.reason ?? "").trim()) return fail(400, "bad_request", "Say why it is revoked.", { fields: ["reason"] });
    Object.assign(x, { status: "revoked", revokedAt: new Date().toISOString(), revokeReason: String(body.reason) });
    return ok({ revoked: true });
  }
  if ((m = is("POST", "/admin/certificates/:id/resend"))) {
    const x = s.certs.find((c) => c.credentialId === m![0]);
    if (!x) return notFound();
    if (x.status === "revoked") return fail(409, "conflict", "A revoked certificate cannot be sent.");
    x.emailStatus = "queued";
    return ok<A.ResendResult>({ notified: true, delivery: null });
  }

  /* ------------------------------------------------- certificate area */
  if (is("GET", "/admin/certificates/settings")) return ok({ v: 1, ...s.studio, canWrite: role === "admin" });
  if (is("PUT", "/admin/certificates/settings")) {
    const list = (Array.isArray(body.signatories) ? body.signatories : []) as X.StudioSignatory[];
    const clean = list.filter((x) => String(x?.name ?? "").trim()).slice(0, 3).map((x) => ({ name: String(x.name).trim(), role: String(x.role ?? "").trim(), signatureFrom: x.signatureFrom ?? null }));
    if (!clean.length) return fail(400, "bad_request", "Add at least one signatory with a name.");
    s.studio = { ...s.studio, signatories: clean };
    return ok({ v: 1, ...s.studio, canWrite: true });
  }
  if (is("POST", "/admin/certificates/signatures")) {
    if (role !== "admin") return fail(403, "forbidden", "Only a super admin can do this.");
    const label = String(body.label ?? "").trim().replace(/\s+/g, " ").slice(0, 60);
    if (!label) return fail(400, "bad_request", "Say whose signature it is.");
    if (!/^data:image\/(png|jpeg|jpg);base64,.+$/.test(String(body.dataUrl ?? ""))) return fail(400, "bad_request", "Upload a PNG or JPEG image.");
    const id = `sig-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "image"}`;
    s.studio = { ...s.studio, signatures: [...s.studio.signatures.filter((g) => g.id !== id), { id, label, url: null }] };
    return ok({ v: 1, ...s.studio, canWrite: true });
  }
  if (is("POST", "/admin/certificates/preview")) return ok(mockDrawing(body));
  if (is("POST", "/admin/certificates/anyone/preview")) {
    if (!String(body.name ?? "").trim()) return fail(400, "bad_request", "Type their name.");
    return ok({ pdfBase64: "JVBERi0xLjQK", fileName: "certificate-preview.pdf" });
  }
  if (is("POST", "/admin/certificates/anyone")) {
    if (!/@/.test(String(body.email ?? ""))) return fail(400, "bad_request", "Type a real email address.");
    if (!String(body.paragraph ?? "").trim()) return fail(400, "bad_request", "Write a few lines about what they did.");
    return ok<A.AnyoneIssueResult>({ credentialId: "VIBHA-ANY-0001", verifyUrl: "https://vibhapsychology.com/verify/VIBHA-ANY-0001", linkedStudent: null, emailNote: null });
  }
  if (is("GET", "/admin/certificates/types")) return ok({ v: 1, items: s.types, rules: [{ id: "module_complete", label: "Finish a module" }, { id: "sections_read", label: "Read a number of sections" }, { id: "xp", label: "Earn a number of XP" }, { id: "watch_seconds", label: "Watch a number of minutes" }, { id: "course_complete", label: "Finish a course" }, { id: "module_tests_passed", label: "Pass every module test at 80%" }], tones: ["lime", "blue", "ink", "gold", "rose"], modules: [{ id: "foundations", title: "Foundations" }, { id: "assessment", title: "Assessment" }], courses: [{ id: "k1", title: "Clinical Psychology in Practice" }], canWrite: role === "admin" });
  if (is("POST", "/admin/certificates/types") || (m = is("PUT", "/admin/certificates/types/:id"))) {
    const title = String(body.title ?? "").trim();
    if (!title) return fail(400, "bad_request", "Title is required.");
    const rule = body.rule as X.TypeRule;
    const id = m?.[0] ?? `t${s.types.length + 1}`;
    const prev = s.types.find((t) => t.id === id);
    const row: X.CertType = { id, type: body.type === "certificate" ? "certificate" : "badge", title, description: String(body.description ?? "") || null, tone: String(body.tone ?? "lime"), enabled: prev?.enabled ?? true, issued: prev?.issued ?? 0, ruleText: rule?.kind === "xp" ? `Earn ${rule.min} XP` : title, rule, madeForYou: false, hasSignature: prev?.hasSignature ?? false, signatureLabel: prev?.signatureLabel ?? null };
    s.types = prev ? s.types.map((t) => (t.id === id ? row : t)) : [...s.types, row];
    return ok({ id });
  }
  if ((m = is("POST", "/admin/certificates/types/:id/enabled"))) {
    const t = s.types.find((x) => x.id === m![0]);
    if (!t) return notFound();
    t.enabled = body.enabled === true;
    return ok({ enabled: t.enabled });
  }
  if ((m = is("GET", "/admin/certificates/types/:id/eligible"))) return ok<A.CertEligible>({ items: s.students.slice(0, 2).map((r) => ({ id: r.id, name: r.name, reason: "Finished every lecture" })) });
  if ((m = is("POST", "/admin/certificates/types/:id/drafts"))) return ok<A.CertDraftsResult>({ made: ((body.userIds as string[]) ?? []).map((u, i) => ({ userId: u, credentialId: `VIBHA-D${i}` })), failed: [] });

  /* --------------------------------------------------------- forms */
  if (is("GET", "/admin/forms")) return ok<A.AdminForms>({ v: 1, forms: empty ? [] : s.forms.map((f) => ({ id: f.id, title: f.title, open: f.open, answers: f.respondents.length, lastAnswerAt: f.updatedAt, url: `https://vibhapsychology.com/f/${f.id}` })), total: s.forms.length, open: s.forms.filter((f) => f.open).length, canWrite: role === "admin" });
  if ((m = is("GET", "/admin/forms/:id"))) {
    const f = s.forms.find((x) => x.id === m![0]);
    if (!f) return notFound();
    const items: A.AdminFormAnswer[] = f.respondents
      .filter((r) => !query.emailed || (query.emailed === "yes") === r.emailed)
      .map((r) => ({ id: r.id, at: r.at, when: r.at.slice(0, 10), name: r.name, email: r.email, phone: "", answers: r.answers.map((a, i) => ({ key: `q${i}`, label: a.q, text: a.a })), emailed: r.emailed ? { lastSentAt: ago(60), sent: 1, waiting: 0, failed: 0 } : null }));
    return ok<A.AdminFormAnswers>({ v: 1, items, nextCursor: null, form: { id: f.id, title: f.title, open: f.open, url: `https://vibhapsychology.com/f/${f.id}` }, total: f.respondents.length, waiting: 0, allowance: { configured: true, limit: 100, left: 92 }, mergeFields: [{ key: "first_name", label: "First name" }, { key: "name", label: "Full name" }, { key: "email", label: "Email" }, { key: "form", label: "Form title" }], limits: { subject: 200, body: 10000, recipients: 500 }, canWrite: role === "admin" });
  }
  if ((m = is("POST", "/admin/forms/:id/email"))) {
    const f = s.forms.find((x) => x.id === m![0]);
    if (!f) return notFound();
    if (!String(body.subject ?? "").trim() || !String(body.body ?? "").trim()) return fail(400, "bad_request", "Write a subject and a message.", { fields: ["subject", "body"] });
    const to = body.submissionIds === "all" ? f.respondents : f.respondents.filter((r) => (body.submissionIds as string[]).includes(r.id));
    to.forEach((r) => (r.emailed = true));
    return ok<A.PersonalEmailReport>({ sent: to.map((r) => r.name), queued: [], failed: [], noEmail: [], duplicates: 0, remainingToday: 92 - to.length, queueFailed: false });
  }
  if ((m = is("POST", "/admin/forms/:id/email/preview"))) {
    const f = s.forms.find((x) => x.id === m![0]);
    const r = f?.respondents.find((x) => x.id === body.submissionId);
    if (!f || !r) return notFound();
    const fill = (t: string) => t.replace(/\{first_name\}/g, r.name.split(" ")[0]!).replace(/\{name\}/g, r.name).replace(/\{email\}/g, r.email).replace(/\{form\}/g, f.title);
    const unknown = [...String(body.body ?? "").matchAll(/\{(\w+)\}/g)].map((x) => x[1]!).filter((k) => !["first_name", "name", "email", "form"].includes(k));
    return ok<A.EmailPreview>({ to: r.email, subject: fill(String(body.subject ?? "")), text: fill(String(body.body ?? "")), unknownFields: unknown });
  }
  if ((m = is("POST", "/admin/forms/:id/email/send-waiting"))) return ok<A.SendWaitingResult>({ sent: 0, failed: 0, left: 0 });

  /* -------------------------------------------------------- system */
  if (is("GET", "/admin/system")) return ok<A.AdminSystem>({ v: 1, ready: true, canWrite: role === "admin", legacyKeyOn: s.legacyKey, maxLive: 10, keys: s.keys, uses: [{ email: "meera@example.com", at: ago(60 * 5) }], usage: [{ label: "Database", value: "155.2 MB of 500.0 MB", pct: 31 }, { label: "AI calls, last 7 days", value: "412", pct: null }] });
  if (is("POST", "/admin/system/support-keys")) {
    const label = String(body.label ?? "").trim();
    if (!label) return fail(400, "bad_request", "Give the key a name, for example who uses it.", { fields: ["label"] });
    if (s.keys.filter((k) => !k.revokedAt).length >= 10) return fail(400, "bad_request", "There are already 10 live keys. Revoke one first.");
    const plain = `vibha_sk_mock${s.keys.length}x7Qe2`;
    s.keys.unshift({ id: `k${s.keys.length + 1}`, label, last4: plain.slice(-4), createdAt: new Date().toISOString(), createdByEmail: "admin@example.com", revokedAt: null, revokedByEmail: null, lastUsedAt: null });
    return ok<X.NewSupportKey>({ plain, last4: plain.slice(-4) });
  }
  if ((m = is("POST", "/admin/system/support-keys/:id/rotate")) || (m = is("POST", "/admin/system/support-keys/:id/revoke"))) {
    const k = s.keys.find((x) => x.id === m![0]);
    if (!k) return notFound();
    if (k.revokedAt) return fail(400, "bad_request", "Only a live key can be changed.");
    k.revokedAt = new Date().toISOString();
    k.revokedByEmail = "admin@example.com";
    if (path.endsWith("/revoke")) return ok({ revoked: true });
    const plain = `vibha_sk_mock${s.keys.length}r9Lp4`;
    s.keys.unshift({ ...k, id: `k${s.keys.length + 1}`, last4: plain.slice(-4), createdAt: new Date().toISOString(), revokedAt: null, revokedByEmail: null, lastUsedAt: null });
    return ok<X.NewSupportKey>({ plain, last4: plain.slice(-4) });
  }
  if (is("POST", "/admin/system/legacy-key/revoke")) {
    s.legacyKey = false;
    return ok({ revoked: true });
  }

  /* ---------------------------------------------------------- push */
  if (is("GET", "/admin/push-preferences")) return ok(s.prefs);
  if (is("PUT", "/admin/push-preferences")) {
    s.prefs = { ...s.prefs, ...(body as Partial<X.AdminPushPrefs>) };
    return ok(s.prefs);
  }
  return path.startsWith("/admin") ? notFound() : null;
}
