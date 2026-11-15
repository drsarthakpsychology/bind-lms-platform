/**
 * A mock of the VIBHA app API that lives inside the app. Switched on with
 * EXPO_PUBLIC_API_MODE=mock. It answers every route the app calls with
 * contract-shaped data (fixtures.ts), keeps a little state in memory (read
 * notifications, new doubts, lecture progress), and can be put into a
 * "scenario" to show a particular state of a screen:
 *
 *   default   a student part way through the course
 *   new       a brand new student (empty lists, "start your first lecture")
 *   done      everything finished for today
 *   empty     no notifications, no doubts, no certificates
 *   error     signed-in data routes fail with 500
 *   slow      data routes never answer (skeletons stay)
 *   update    every route answers 426 upgrade_required
 *   paused    signed-in routes answer 403 account_blocked
 *
 * Sign in with any email. "lectures@..." is a lectures-only account,
 * "admin@..." an admin; the password "wrong" is refused.
 */
import type { RawRequest, RawResponse, Transport } from "../client";
import type * as C from "../contract";
import type * as X from "../extra";
import * as xf from "./extra-fixtures";
import * as fx from "./fixtures";
import { learnRoute, noteMarkedRead, resetLearnMock } from "./learn-fixtures";

export type Scenario = "default" | "new" | "done" | "empty" | "error" | "slow" | "update" | "paused";

type State = {
  scenario: Scenario;
  delayMs: number;
  read: Set<string>;
  doubts: C.DoubtThread[];
  watched: Record<string, number>;
  completed: Set<string>;
  prefs: C.NotificationPrefs;
  learn: C.LearnState;
  pushToken: string | null;
  /** Set to make the next signed-in call answer device_replaced (tests). */
  replaced: boolean;
  log: { method: string; path: string; body?: unknown }[];
};

function fresh(): State {
  return { scenario: "default", delayMs: 0, read: new Set(), doubts: structuredCloneSafe(fx.doubts), watched: {}, completed: new Set(), prefs: { ...fx.prefs }, learn: structuredCloneSafe(fx.learnState), pushToken: null, replaced: false, log: [] };
}
function structuredCloneSafe<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)) as T;
}

let state = fresh();

export const mock = {
  reset() {
    state = fresh();
    resetLearnMock();
  },
  setScenario(s: Scenario) {
    state.scenario = s;
  },
  scenario: () => state.scenario,
  setDelay(ms: number) {
    state.delayMs = ms;
  },
  replaceDevice() {
    state.replaced = true;
  },
  log: () => state.log,
};

const ok = <T,>(data: T, status = 200): RawResponse => ({ status, json: { ok: true, data } });
const fail = (status: number, code: C.ApiErrorCode, message: string, details?: Record<string, unknown>): RawResponse => ({ status, json: { ok: false, error: { code, message, details } } });
const notFound = () => fail(404, "not_found", "That could not be found.");

function tokensFor(kind: string): C.AuthTokens {
  return { accessToken: `mock.${kind}.access`, refreshToken: `mock.${kind}.refresh`, expiresIn: 3600, expiresAt: new Date(Date.now() + 3600_000).toISOString() };
}
function meFor(kind: string): C.Me {
  const me = kind === "lecture" ? fx.lectureOnly : kind === "admin" ? fx.admin : fx.student;
  const unread = state.scenario === "empty" || state.scenario === "new" ? 0 : fx.notifications.filter((n) => !n.readAt && !state.read.has(n.id)).length;
  return { ...me, unreadNotifications: kind === "admin" ? 0 : unread };
}
function kindOf(req: RawRequest): string | null {
  const m = /^Bearer mock\.(\w+)\.access$/.exec(req.headers.Authorization ?? "");
  return m ? (m[1] ?? null) : null;
}

function notificationRows(): C.NotificationDetail[] {
  if (state.scenario === "empty" || state.scenario === "new") return [];
  return fx.notifications.map((n) => (state.read.has(n.id) && !n.readAt ? { ...n, readAt: fx.NOW } : n));
}

function lecture(id: string): C.LectureDetail | null {
  const l = fx.lectureDetail(id);
  if (!l) return null;
  const isNew = state.scenario === "new";
  const watched = state.watched[id] ?? (isNew ? 0 : l.progress.watchedSeconds);
  return { ...l, progress: { watchedSeconds: watched, completed: state.completed.has(id) || (!isNew && l.progress.completed) } };
}

async function route(req: RawRequest): Promise<RawResponse> {
  const [path = "", queryString = ""] = req.path.split("?");
  const query = Object.fromEntries(new URLSearchParams(queryString));
  const seg = path.split("/").filter(Boolean);
  const body = (req.body ?? {}) as Record<string, unknown>;
  const is = (method: string, pattern: string): string[] | null => {
    if (req.method !== method) return null;
    const p = pattern.split("/").filter(Boolean);
    if (p.length !== seg.length) return null;
    const params: string[] = [];
    for (let i = 0; i < p.length; i++) {
      if (p[i]![0] === ":") params.push(decodeURIComponent(seg[i]!));
      else if (p[i] !== seg[i]) return null;
    }
    return params;
  };
  let m: string[] | null;

  if (state.scenario === "update") return fail(426, "upgrade_required", "This version of the app is too old. Update to carry on.", { minVersion: "2.0.0", storeUrl: fx.config.storeUrl.android });

  /* ------------------------------------------------------------ public */
  if (is("GET", "/config")) return ok(fx.config);
  if (is("POST", "/public/request-invitation")) {
    if (!body.name || !/^\S+@\S+\.\S+$/.test(String(body.email ?? ""))) return fail(400, "bad_request", "Check your name and email.", { fields: ["name", "email"] });
    if (body.policyAccepted !== true) return fail(400, "bad_request", "Tick the box to agree to the privacy policy.", { fields: ["policyAccepted"] });
    return ok<C.RequestInvitationResult>({ received: true });
  }
  if ((m = is("GET", "/public/certificates/:id"))) {
    const found = fx.achievements.earned.find((c) => c.credentialId === m![0] && c.type === "certificate");
    return ok<C.CertificateVerification>({ found: !!found, certificateId: m[0]!, status: found ? "valid" : "unknown", what: found ? "Certificate" : null, recipientName: found ? "Ananya Mehta" : null, title: found?.title ?? null, paragraph: found ? "For completing Module 1 of the VIBHA clinical training programme and passing its test." : null, issuedAt: found?.issuedAt ?? null, expiresAt: null, revokedAt: null, replacedBy: null, issuer: "VIBHA School of Psychology", verifyUrl: `https://vibhapsychology.com/verify/${m[0]}` });
  }
  if (is("POST", "/auth/sign-in")) {
    const email = String(body.email ?? "");
    if (!email || body.password === "wrong" || !body.password) return fail(401, "invalid_credentials", "That email or password is not right.");
    if (email.startsWith("limit")) return fail(403, "device_limit", "You have changed phones twice this month. Message us on WhatsApp and we will sort it out.", { nextChangeAt: "2026-12-01T00:00:00.000Z" });
    const kind = email.startsWith("lecture") ? "lecture" : email.startsWith("admin") ? "admin" : "student";
    return ok<C.SignInResult>({ tokens: tokensFor(kind), me: meFor(kind), device: fx.device });
  }
  if (is("POST", "/auth/refresh")) {
    const k = /^mock\.(\w+)\.refresh$/.exec(String(body.refreshToken ?? ""));
    return k ? ok<C.RefreshResult>({ tokens: tokensFor(k[1]!) }) : fail(401, "unauthenticated", "Sign in again.");
  }
  if (is("POST", "/auth/setup/check")) {
    const t = String(body.token ?? "");
    return ok<C.SetupCheckResult>(t === "used" ? { valid: false, email: null, reason: "used" } : t.length < 4 ? { valid: false, email: null, reason: "unknown" } : { valid: true, email: "ananya@example.com", reason: null });
  }
  if (is("POST", "/auth/setup/complete")) {
    if (String(body.password ?? "").length < 12) return fail(400, "bad_request", "Use at least 12 characters.", { fields: ["password"] });
    return ok<C.SetupCompleteResult>({ email: "ananya@example.com" });
  }

  /* --------------------------------------------------------- signed in */
  const kind = kindOf(req);
  if (!kind) return fail(401, "unauthenticated", "Sign in again.");
  if (state.replaced) {
    state.replaced = false;
    return fail(401, "device_replaced", "Signed out: your account was opened on another device.");
  }
  if (is("POST", "/auth/sign-out")) return ok<C.SignOutResult>({ signedOut: true });
  if (state.scenario === "paused") return fail(403, "account_blocked", "Your account is paused. Message us on WhatsApp to sort it out.");
  if (is("GET", "/me")) return ok(meFor(kind));
  if (is("PATCH", "/me")) return ok(meFor(kind));
  if (is("GET", "/devices")) return ok(fx.device);
  if (is("PUT", "/devices/current")) {
    if ("pushToken" in body) state.pushToken = (body.pushToken as string | null) ?? null;
    return ok<C.DeviceState>({ ...fx.device, current: { ...fx.device.current!, pushEnabled: !!state.pushToken } });
  }

  if (state.scenario === "slow") return new Promise<RawResponse>(() => undefined);
  if (state.scenario === "error") return fail(500, "server_error", "Something went wrong on our side. Try again in a minute.");

  const isNew = state.scenario === "new";
  if (is("GET", "/home")) {
    const h = fx.home(isNew ? "new" : state.scenario === "done" ? "done" : "default");
    return ok({ ...h, unreadNotifications: meFor(kind).unreadNotifications, quests: isNew || kind === "lecture" ? null : fx.quests, goal: kind === "lecture" ? null : h.goal, upNext: kind === "lecture" ? h.upNext.filter((r) => r.kind === "lecture") : h.upNext });
  }
  if (is("GET", "/courses")) return ok<C.CourseList>({ courses: [fx.courseSummary(isNew)] });
  if ((m = is("GET", "/courses/:id"))) return m[0] === "course-1" ? ok(fx.courseDetail(isNew)) : notFound();
  if ((m = is("GET", "/lectures/:id"))) {
    const l = lecture(m[0]!);
    return l ? ok(l) : notFound();
  }
  if ((m = is("POST", "/lectures/:id/progress"))) {
    const watched = Number(body.watchedSeconds) || 0;
    const duration = Number(body.durationSeconds) || 1;
    state.watched[m[0]!] = Math.max(state.watched[m[0]!] ?? 0, watched);
    const crossed = watched / duration >= 0.9 && !state.completed.has(m[0]!);
    if (crossed) state.completed.add(m[0]!);
    return ok<C.ProgressPingResult>({ saved: true, completed: crossed });
  }
  if ((m = is("POST", "/lectures/:id/complete"))) {
    state.completed.add(m[0]!);
    return ok<C.CompleteLectureResult>({ completed: true, next: fx.lectureDetail(m[0]!)?.next ?? null });
  }
  if ((m = is("POST", "/lectures/:id/stream"))) {
    const l = lecture(m[0]!);
    if (!l) return notFound();
    if (body.deviceCompromised === true) return fail(403, "video_refused", "Lectures cannot be played on a rooted phone.");
    return ok<C.StreamAccess>({ url: `mock://stream/${l.id}/master.m3u8?st=mock`, mediaType: "hls", headers: { "X-App-Device-Id": "mock-device-0000000000" }, expiresIn: 7200, expiresAt: new Date(Date.now() + 7200_000).toISOString(), resumeSeconds: l.progress.completed ? 0 : l.progress.watchedSeconds, durationSeconds: l.durationSeconds, watermark: meFor(kind).watermark, progressEverySeconds: 15 });
  }
  if ((m = is("POST", "/assignments/:id/uploads"))) {
    const name = String(body.fileName ?? "");
    if (!name) return fail(400, "bad_request", "Name the file.", { fields: ["fileName"] });
    return ok<C.PrepareUploadResult>({ path: `submissions/${m[0]}/${Date.now()}-${name}`, uploadUrl: `mock://upload/${encodeURIComponent(name)}`, headers: { "Content-Type": "application/octet-stream" } });
  }
  if ((m = is("POST", "/assignments/:id/files")) || (m = is("POST", "/assignments/:id/audio")) || (m = is("POST", "/assignments/:id/text"))) {
    const files = (body.files as { path: string; name: string }[] | undefined) ?? (body.path ? [{ path: String(body.path), name: "recording.m4a" }] : []);
    return ok<C.SubmitResult>({
      submission: { id: `s-${m[0]}`, status: "pending_review", submittedAt: new Date().toISOString(), isLate: false, text: (body.text as string) ?? null, note: (body.note as string) ?? null, hasAudio: !!body.path, files: files.map((f, i) => ({ id: `f${i}`, name: f.name, format: f.name.split(".").pop() ?? null, sizeBytes: null, status: "ready", filePath: `/submissions/files/f${i}` })), score: null, feedback: null, editable: true },
    });
  }
  if ((m = is("DELETE", "/assignments/:id/submission"))) return ok<C.UnsubmitResult>({ removed: true });
  if ((m = is("GET", "/materials/:id"))) {
    const mat = fx.lectureDetail("l5")!.materials.find((x) => x.id === m![0]);
    return mat ? ok<C.Material>(mat) : notFound();
  }
  if (is("POST", "/save")) {
    const items = (body.items as C.SaveItem[] | undefined) ?? [];
    return ok<C.SaveResult>({ results: items.map((i) => ({ id: i.id, status: "ok" as const })) });
  }

  /* ----------------------------------------------------- notifications */
  if (is("GET", "/notifications")) {
    const rows = notificationRows();
    return ok<C.NotificationList>({ items: rows.map(({ content: _c, links: _l, ...row }) => row), nextCursor: null, unread: rows.filter((n) => !n.readAt).length });
  }
  if (is("POST", "/notifications/read-all")) {
    fx.notifications.forEach((n) => state.read.add(n.id));
    return ok<C.ReadAllResult>({ unread: 0 });
  }
  if (is("GET", "/notifications/preferences")) return ok(state.prefs);
  if (is("PUT", "/notifications/preferences")) {
    state.prefs = { ...state.prefs, ...(body as Partial<C.NotificationPrefs>) };
    return ok(state.prefs);
  }
  if ((m = is("GET", "/notifications/:id"))) {
    const n = notificationRows().find((x) => x.id === m![0]);
    if (!n) return notFound();
    state.read.add(n.id);
    return ok<C.NotificationDetail>({ ...n, readAt: n.readAt ?? fx.NOW });
  }

  /* ------------------------------------------------------------ doubts */
  const doubtRows = () => (state.scenario === "empty" || isNew ? state.doubts.filter((d) => d.id.startsWith("new")) : state.doubts);
  if (is("GET", "/doubts")) {
    const items = doubtRows()
      .filter((d) => (query.mine ? d.mine : true))
      .map(({ body: _b, replies, ...d }) => ({ ...d, replies: replies.length }));
    return ok<C.DoubtList>({ items, nextCursor: null, cohorts: [{ id: "c2", name: "Cohort Two" }], ready: true });
  }
  if (is("POST", "/doubts")) {
    const title = String(body.title ?? "").trim();
    if (title.length < 8) return fail(400, "bad_request", "Write your question in a full sentence.", { fields: ["title"] });
    const id = `new${state.doubts.length + 1}`;
    state.doubts.unshift({ id, title, topic: (body.topic as string) ?? null, kind: "doubt", status: "open", cohortId: "c2", author: "You", mine: true, createdAt: new Date().toISOString(), body: String(body.body ?? ""), replies: [] });
    return ok<C.AskDoubtResult>({ id });
  }
  if ((m = is("GET", "/doubts/:id"))) {
    const d = state.doubts.find((x) => x.id === m![0]);
    return d ? ok(d) : notFound();
  }
  if ((m = is("POST", "/doubts/:id/replies"))) {
    const d = state.doubts.find((x) => x.id === m![0]);
    if (!d) return notFound();
    const text = String(body.body ?? "").trim();
    if (!text) return fail(400, "bad_request", "Write a reply first.", { fields: ["body"] });
    d.replies.push({ id: `r${Date.now()}`, author: "You", mine: true, body: text, votes: 0, youVoted: false, isSolution: false, createdAt: new Date().toISOString() });
    return ok<C.DoubtActionResult>({ thread: d });
  }
  if ((m = is("POST", "/doubts/:id/replies/:rid/vote"))) {
    const d = state.doubts.find((x) => x.id === m![0]);
    const r = d?.replies.find((x) => x.id === m![1]);
    if (!d || !r) return notFound();
    const on = body.on === true;
    if (on !== r.youVoted) r.votes += on ? 1 : -1;
    r.youVoted = on;
    return ok<C.DoubtActionResult>({ thread: d });
  }
  if ((m = is("POST", "/doubts/:id/solved"))) {
    const d = state.doubts.find((x) => x.id === m![0]);
    if (!d) return notFound();
    d.replies.forEach((r) => (r.isSolution = r.id === body.replyId));
    d.status = body.replyId ? "solved" : "open";
    return ok<C.DoubtActionResult>({ thread: d });
  }

  /* ------------------------------------------------------------- study */
  const learn = learnRoute(req.method, path, body, kind, { empty: isNew || state.scenario === "empty" });
  if (learn) return learn;
  if (path.startsWith("/study") && kind === "lecture") return fail(403, "scope", "Your account is for lectures only.");
  if (is("GET", "/study/modules")) return ok<C.StudyHome>({ modules: fx.modules, next: fx.moduleDetail("m02")!.next, goal: { points: 18, goal: 30, streak: 6 }, courseMinutes: 505 });
  if ((m = is("GET", "/study/modules/:id"))) {
    const d = fx.moduleDetail(m[0]!);
    if (!d) return notFound();
    const sections = d.sections.map((s) => ({ ...s, doneOn: state.learn.study.done[`${d.id}/${s.id}`] ?? s.doneOn }));
    return ok<C.ModuleDetail>({ ...d, sections });
  }
  if ((m = is("GET", "/study/modules/:id/sections/:sid"))) {
    const s = fx.sectionContent(m[0]!, m[1]!);
    return s ? ok(s) : notFound();
  }
  if (is("GET", "/study/state")) return ok<C.LearnStateResult>({ state: state.learn, today: "2026-11-15" });
  if (is("PUT", "/study/state")) {
    noteMarkedRead((body as { state?: { notesRead?: Record<string, string> } }).state);
    const next = body.state as C.LearnState | undefined;
    if (next?.study) state.learn = { ...state.learn, ...next, study: { ...state.learn.study, ...next.study, done: { ...state.learn.study.done, ...next.study.done } } };
    return ok<C.SaveLearnStateResult>({ state: state.learn, clamped: false });
  }
  if ((m = is("GET", "/study/modules/:id/checkpoints/:n"))) return ok(fx.checkpoint(Number(m[1])));
  if ((m = is("POST", "/study/modules/:id/checkpoints/:n/answers"))) {
    const rev = fx.review((body.picks as Record<string, number>) ?? {});
    const right = rev.filter((r) => r.correct).length;
    return ok<C.CheckpointResult>({ right, asked: rev.length, known: { right, total: rev.length }, review: rev, state: state.learn });
  }
  if ((m = is("POST", "/study/modules/:id/test"))) {
    const rev = fx.review((body.picks as Record<string, number>) ?? {});
    const right = rev.filter((r) => r.correct).length;
    const prev = state.learn.study.tests[m[0]!];
    state.learn.study.tests[m[0]!] = { best: Math.max(prev?.best ?? 0, right), total: rev.length, day: "2026-11-15", tries: (prev?.tries ?? 0) + 1 };
    return ok<C.ModuleTestResult>({ right, total: rev.length, best: state.learn.study.tests[m[0]!]!.best, tries: state.learn.study.tests[m[0]!]!.tries, review: rev, state: state.learn });
  }
  if (is("GET", "/study/marks")) return ok<C.MarksResult>({ marks: { v: 1, bookmarks: {}, notes: {} }, synced: true });
  if (is("PUT", "/study/marks")) return ok<C.SaveMarksResult>({ marks: (body.changes as C.Marks) ?? { v: 1, bookmarks: {}, notes: {} }, synced: true });
  if ((m = is("GET", "/study/figures/:id"))) return ok({ ...fx.figure, id: m[0]! });

  /* ------------------------------------------- progress and the rest */
  if (is("GET", "/progress")) return ok<C.Progress>(isNew ? { lectures: [{ courseId: "course-1", title: "Clinical Psychology in Practice", completed: 0, total: 8 }], study: null, days: [], strengths: null } : kind === "lecture" ? { ...fx.progress, study: null, strengths: null, days: [] } : fx.progress);
  if (is("GET", "/achievements")) return ok<C.Achievements>(state.scenario === "empty" || isNew ? { earned: [], progress: fx.achievements.progress } : fx.achievements);
  if ((m = is("GET", "/achievements/:id/pdf"))) return ok<C.CertificatePdfLink>({ url: `https://vibhapsychology.com/mock/certificates/${m[0]}.pdf`, expiresIn: 300 });
  if (is("GET", "/settings")) {
    const me = meFor(kind);
    return ok<C.Settings>({ account: { email: me.email, name: me.name, roleLabel: me.role === "admin" ? "Admin" : me.scope === "lectures_only" ? "Student (lectures)" : "Student", rollNumber: me.rollNumber, mobileNumber: me.mobileNumber }, device: fx.device, notifications: state.prefs, support: fx.config.support, legal: fx.config.legal, app: { minSupportedVersion: "1.0.0", latestVersion: "1.0.0" } });
  }

  if (is("GET", "/library/medicines")) {
    if (kind === "lecture") return fail(403, "scope", "Your account is for lectures only.");
    return ok<C.MedicineList>({ v: 1, groups: xf.medicines.classes, rows: xf.medicines.items.map((r) => ({ id: r.id, name: r.name, cls: r.className, group: r.className, brands: r.brands, uses: [], line: r.className, dose: r.keyDose })) });
  }

  /* ------------------------- not in the contract yet (src/api/extra.ts) */
  if (is("POST", "/me/deletion-request")) return ok<X.DeletionRequestResult>({ received: true, at: new Date().toISOString() });
  const studentOnly = kind === "lecture" ? fail(403, "scope", "Your account is for lectures only.") : null;
  if (is("GET", "/practise")) return studentOnly ?? ok(xf.practise);
  if ((m = is("GET", "/games/:id"))) return studentOnly ?? (xf.rounds[m[0]!] ? ok(xf.rounds[m[0]!]) : notFound());
  if ((m = is("POST", "/games/:id/result"))) return ok<X.GameResult>({ best: Math.max(8, Number(body.score) || 0), xp: (Number(body.score) || 0) * 2 });
  if ((m = is("GET", "/cases/:id"))) return studentOnly ?? (xf.cases[m[0]!] ? ok(xf.cases[m[0]!]) : notFound());
  if (is("GET", "/prep")) return studentOnly ?? ok<{ subjects: X.PrepSubject[] }>({ subjects: xf.prepSubjects });
  if ((m = is("GET", "/prep/:id"))) return studentOnly ?? ok(xf.prepSet(m[0]!));
  if (is("GET", "/medicines")) {
    if (studentOnly) return studentOnly;
    const q = (query.q ?? "").toLowerCase();
    const cls = query.class ?? "";
    return ok<X.MedicineList>({ classes: xf.medicines.classes, items: xf.medicines.items.filter((r) => (!cls || r.className === cls) && (!q || r.name.toLowerCase().includes(q) || r.brands.some((b) => b.toLowerCase().includes(q)))) });
  }
  if ((m = is("GET", "/medicines/:id"))) {
    const page = xf.medicinePage(m[0]!);
    return studentOnly ?? (page ? ok(page) : notFound());
  }
  if (path.startsWith("/admin")) {
    if (kind !== "admin") return fail(403, "forbidden", "Only admins can open this.");
    if (is("GET", "/admin/home")) return ok(xf.adminHome);
    if (is("GET", "/admin/students")) {
      const q = (query.q ?? "").toLowerCase();
      return ok<X.AdminStudentList>({ items: xf.adminStudents.filter((r) => !q || r.name.toLowerCase().includes(q) || (r.rollNumber ?? "").toLowerCase().includes(q)) });
    }
    if ((m = is("GET", "/admin/students/:id"))) {
      const st = xf.adminStudent(m[0]!);
      return st ? ok(st) : notFound();
    }
    if (is("GET", "/admin/activity")) return ok(xf.adminActivity);
    if (is("GET", "/admin/messages")) return ok(xf.adminMessages);
    if (is("POST", "/admin/messages")) {
      if (!String(body.title ?? "").trim() || !String(body.body ?? "").trim()) return fail(400, "bad_request", "Write a title and a message.", { fields: ["title", "body"] });
      return ok<X.AdminSendResult>({ sent: body.to === "student" ? 1 : 24 });
    }
  }
  return notFound();
}

/** The transport the API client uses in mock mode. */
export const mockTransport: Transport = async (req) => {
  state.log.push({ method: req.method, path: req.path, body: req.body });
  if (state.delayMs) await new Promise((r) => setTimeout(r, state.delayMs));
  return route(req);
};
