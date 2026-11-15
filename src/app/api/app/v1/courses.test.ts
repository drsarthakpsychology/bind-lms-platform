import { beforeEach, describe, expect, it, vi } from "vitest";
import { G, resetGuard } from "@/lib/app-api/test-guard";
import { STUDENT_ID, appReq, noParams, params, profileRow, read } from "@/lib/app-api/test-kit";

const L = "33333333-3333-4333-8333-333333333333";
const C = "44444444-4444-4444-8444-444444444444";
const A = "55555555-5555-4555-8555-555555555555";
const M = "66666666-6666-4666-8666-666666666666";

const h = vi.hoisted(() => ({
  home: vi.fn(),
  overview: vi.fn(),
  mine: vi.fn(),
  lecture: vi.fn(),
  block: vi.fn(),
  ping: vi.fn(),
  complete: vi.fn(),
  saves: vi.fn(),
  check: vi.fn(),
  serve: vi.fn(),
  sign: vi.fn(),
  assignment: vi.fn(),
  submitText: vi.fn(),
  prepare: vi.fn(),
  withFiles: vi.fn(),
  audio: vi.fn(),
  unsubmit: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({ revalidatePath: () => undefined }));
vi.mock("@/lib/supabase/server", async () => (await import("@/lib/app-api/test-guard")).supabaseMock());
vi.mock("@/lib/app-api/supabase", async () => (await import("@/lib/app-api/test-guard")).statelessMock());
vi.mock("@/lib/flags", async () => (await import("@/lib/app-api/test-guard")).flagsMock());
vi.mock("@/lib/access/blocks", async () => (await import("@/lib/app-api/test-guard")).blocksMock());
vi.mock("@/lib/rate-limit", async () => (await import("@/lib/app-api/test-guard")).rateMock());
vi.mock("@/lib/rate-limit-fast", async () => (await import("@/lib/app-api/test-guard")).fastRateMock());
vi.mock("@/lib/home/model", () => ({ loadHomeModel: h.home }));
vi.mock("@/components/course/course-overview", () => ({ loadCourseOverview: h.overview }));
vi.mock("@/lib/course/mine", () => ({ loadMyCourses: h.mine }));
vi.mock("@/lib/course/lecture", () => ({ loadLecture: h.lecture }));
vi.mock("@/lib/course/complete", () => ({ completionBlock: h.block }));
vi.mock("@/lib/course/assignment", () => ({ loadAssignment: h.assignment }));
vi.mock("@/lib/save/apply", async () => {
  const { z } = await import("zod");
  return { MAX_SAVE_BYTES: 256 * 1024, applySaves: h.saves, saveItemsSchema: z.array(z.object({ id: z.string(), kind: z.string(), payload: z.unknown() })).max(25) };
});
vi.mock("@/lib/media/material-serve", () => ({ checkMaterial: h.check, serveMaterial: h.serve }));
vi.mock("@/lib/media/submission-file", () => ({ signSubmissionFile: h.sign }));
vi.mock("@/app/(dashboard)/courses/[courseId]/lessons/[lessonId]/actions", () => ({
  pingProgress: h.ping,
  markLessonComplete: h.complete,
  submitTextAssignment: h.submitText,
  prepareSubmissionUpload: h.prepare,
  submitWithFiles: h.withFiles,
  submitAudioAssignment: h.audio,
  unsubmitAssignment: h.unsubmit,
}));

import { clearDeviceCache } from "@/lib/app-api/devices";
import { GET as home } from "./home/route";
import { GET as courses } from "./courses/route";
import { GET as course } from "./courses/[courseId]/route";
import { GET as lecture } from "./lectures/[lessonId]/route";
import { POST as progress } from "./lectures/[lessonId]/progress/route";
import { POST as complete } from "./lectures/[lessonId]/complete/route";
import { POST as save } from "./save/route";
import { GET as material } from "./materials/[materialId]/route";
import { GET as materialFile } from "./materials/[materialId]/file/route";
import { GET as subFile } from "./submissions/files/[fileId]/route";
import { GET as assignments } from "./assignments/route";
import { GET as assignment } from "./assignments/[assignmentId]/route";
import { POST as submitText } from "./assignments/[assignmentId]/text/route";
import { POST as uploads } from "./assignments/[assignmentId]/uploads/route";
import { POST as files } from "./assignments/[assignmentId]/files/route";
import { DELETE as unsubmit } from "./assignments/[assignmentId]/submission/route";

const overview = {
  courseId: C,
  title: "Clinical Psychology",
  published: true,
  completedCount: 1,
  totalLessons: 3,
  started: true,
  backHref: null,
  next: { title: "Lecture 2", href: `/courses/${C}/lessons/${L}`, week: 1, kind: "lesson" as const, number: 2, midway: true },
  empty: false,
  myCohorts: [],
  weeks: [
    {
      num: 1,
      status: "in-progress" as const,
      isCurrent: true,
      isFuture: false,
      done: 1,
      total: 3,
      lessons: [{ id: L, title: "Lecture 2", number: 2, href: `/courses/${C}/lessons/${L}`, state: "next" as const, hasVideo: true }],
      materials: [{ id: M, title: "Slides", meta: "PDF · pdf", href: `/courses/${C}/materials/${M}` }],
      assignments: [{ id: A, title: "Case write-up", lessonTitle: "Lecture 2", status: "not_started" as const, isNext: false, href: `/courses/${C}/lessons/${L}?tab=assignment` }],
    },
    { num: 2, status: "upcoming" as const, isCurrent: false, isFuture: true, done: 0, total: 1, lessons: [{ id: "x", title: "Later", number: 3, href: null, state: "later" as const, hasVideo: true }], materials: [], assignments: [] },
  ],
};

const lectureView = {
  id: L,
  courseId: C,
  courseTitle: "Clinical Psychology",
  title: "Lecture 2",
  description: "About it",
  week: 1,
  number: 2,
  hasVideo: true,
  durationSeconds: 3600,
  watchedSeconds: 120,
  completed: false,
  requiresAssignment: true,
  assignment: {
    id: A, title: "Case write-up", instructions: "Write it", submissionType: "file", dueAt: null, allowLate: true, maxFiles: 3, maxFileMb: 25, maxScore: null, published: true,
    submission: { id: "s1", status: "pending_review", submittedAt: null, isLate: false, text: null, note: null, hasAudio: false, files: [{ id: "f1", name: "a.pdf", format: "pdf", sizeBytes: 10, status: "ready" }], score: null, feedback: null, editable: true },
  },
  materials: [{ id: M, title: "Slides", kind: "pdf", format: "pdf", size_bytes: 100, url: null, storage_path: "m/x.pdf", lesson_id: L, week: 1 }],
  prev: null,
  next: { id: "n1", title: "Lecture 3" },
};

const assignmentView = { id: A, lessonId: L, courseId: C, title: "Case write-up", instructions: "Write it", submissionType: "text", dueAt: null, allowLate: true, maxFiles: 3, maxFileMb: 25, acceptedFormats: ["pdf"], submission: null };

beforeEach(() => {
  resetGuard();
  clearDeviceCache();
  for (const f of Object.values(h)) f.mockReset();
  h.mine.mockResolvedValue([{ id: C, title: "Clinical Psychology", is_published: true }]);
  h.overview.mockResolvedValue(overview);
  h.lecture.mockResolvedValue({ ok: true, lecture: lectureView });
  h.assignment.mockResolvedValue(assignmentView);
});

describe("GET /home", () => {
  it("answers the website's Home model with app targets in place of web paths", async () => {
    h.home.mockResolvedValue({
      dateLine: "Sun, 15 Nov",
      welcomeBack: true,
      step: { kind: "lecture", eyebrow: "Continue", title: "Lecture 2", meta: "Week 1", href: `/courses/${C}/lessons/${L}`, cta: "Resume" },
      progress: { pct: 33, label: "Lectures watched" },
      allDone: false,
      goal: { points: 10, goal: 30, streak: 2 },
      upNext: [{ kind: "study", title: "Read 1.2", meta: "Module 1", href: "/study/m1/s2" }],
      strengths: { strongest: [], weakest: [{ id: "m1", title: "Mood", kind: "topic", p: 0.4, n: 6, studyHref: "/study/m1", practiceHref: "/practice/prep/mood" }], all: [], hasData: true },
      studyOpen: true,
      models: [overview],
    });
    const r = await read(await home(appReq("/home"), noParams));
    expect(r.status).toBe(200);
    expect(r.data.step).toEqual({ kind: "lecture", eyebrow: "Continue", title: "Lecture 2", meta: "Week 1", cta: "Resume", target: { screen: "lecture", courseId: C, lessonId: L, web: `/courses/${C}/lessons/${L}` } });
    expect(r.data.upNext[0].target).toMatchObject({ screen: "studySection", moduleId: "m1", sectionId: "s2" });
    expect(r.data.strengths.weakest[0]).toMatchObject({ studyTarget: { screen: "studyModule", moduleId: "m1" }, practiceTarget: { screen: "practice", tool: "prep" } });
    expect(r.data.courses[0]).toMatchObject({ id: C, completedCount: 1, next: { midway: true, target: { screen: "lecture" } } });
    expect(h.home).toHaveBeenCalledWith(expect.objectContaining({ id: STUDENT_ID }), { preview: false });
  });

  it("sends no strengths when Study is closed for the account", async () => {
    h.home.mockResolvedValue({ dateLine: "x", welcomeBack: false, step: { kind: "lectures", eyebrow: "", title: "", meta: null, href: "/courses", cta: "" }, progress: null, allDone: false, goal: null, upNext: [], strengths: { strongest: [], weakest: [], all: [], hasData: false }, studyOpen: false, models: [] });
    const r = await read(await home(appReq("/home"), noParams));
    expect(r.data.strengths).toBeNull();
    expect(r.data.goal).toBeNull();
  });
});

describe("courses", () => {
  it("lists the student's courses", async () => {
    const r = await read(await courses(appReq("/courses"), noParams));
    expect(r.data.courses).toHaveLength(1);
    expect(r.data.courses[0]).toMatchObject({ id: C, title: "Clinical Psychology", totalLessons: 3 });
  });

  it("answers the weeks, with locked rows marked not openable", async () => {
    const r = await read(await course(appReq(`/courses/${C}`), params({ courseId: C })));
    expect(r.status).toBe(200);
    expect(r.data.weeks[0].lessons[0]).toEqual({ id: L, title: "Lecture 2", number: 2, state: "next", openable: true, hasVideo: true });
    expect(r.data.weeks[0].assignments[0]).toMatchObject({ id: A, lessonId: L, openable: true });
    expect(r.data.weeks[1].lessons[0]).toMatchObject({ state: "later", openable: false });
  });

  it("404 for a course the student cannot open (same rule as the course layout)", async () => {
    const other = "77777777-7777-4777-8777-777777777777";
    const r = await read(await course(appReq(`/courses/${other}`), params({ courseId: other })));
    expect(r).toMatchObject({ status: 404, error: { code: "not_found" } });
    expect(h.overview).not.toHaveBeenCalled();
  });
});

describe("GET /lectures/:id", () => {
  it("answers the lecture, its assignment and materials with app file paths", async () => {
    const r = await read(await lecture(appReq(`/lectures/${L}`), params({ lessonId: L })));
    expect(r.status).toBe(200);
    expect(r.data).toMatchObject({ id: L, number: 2, progress: { watchedSeconds: 120, completed: false }, requiresAssignment: true, next: { id: "n1" } });
    expect(r.data.materials[0]).toMatchObject({ id: M, filePath: `/api/app/v1/materials/${M}/file`, url: null });
    expect(r.data.assignment.submission.files[0].filePath).toBe("/api/app/v1/submissions/files/f1");
  });

  it("locked (not live yet) and not found answer their own codes", async () => {
    h.lecture.mockResolvedValueOnce({ ok: false, reason: "locked" });
    expect((await read(await lecture(appReq(`/lectures/${L}`), params({ lessonId: L })))).error?.code).toBe("feature_locked");
    h.lecture.mockResolvedValueOnce({ ok: false, reason: "not_found" });
    expect((await read(await lecture(appReq(`/lectures/${L}`), params({ lessonId: L })))).status).toBe(404);
  });
});

describe("lecture progress and completion", () => {
  it("progress runs pingProgress with the app's numbers (clamped there) and reports completion", async () => {
    h.ping.mockResolvedValue({ ok: true, completed: true });
    const r = await read(await progress(appReq(`/lectures/${L}/progress`, { body: { watchedSeconds: 3500, durationSeconds: 3600 } }), params({ lessonId: L })));
    expect(r.data).toEqual({ saved: true, completed: true });
    expect(h.ping).toHaveBeenCalledWith(L, 3500, 3600);
  });

  it("progress refuses nonsense numbers before they reach the store", async () => {
    const r = await read(await progress(appReq(`/lectures/${L}/progress`, { body: { watchedSeconds: -5, durationSeconds: "x" } }), params({ lessonId: L })));
    expect(r).toMatchObject({ status: 400, error: { code: "bad_request" } });
    expect(h.ping).not.toHaveBeenCalled();
  });

  it("complete needs the assignment handed in first, then marks it and names the next lecture", async () => {
    h.block.mockResolvedValueOnce("needs_submission");
    let r = await read(await complete(appReq(`/lectures/${L}/complete`, { method: "POST" }), params({ lessonId: L })));
    expect(r).toMatchObject({ status: 409, error: { code: "conflict", details: { reason: "needs_submission" } } });
    expect(h.complete).not.toHaveBeenCalled();
    h.block.mockResolvedValueOnce("ok");
    h.complete.mockResolvedValue({ ok: true, completed: true });
    r = await read(await complete(appReq(`/lectures/${L}/complete`, { method: "POST" }), params({ lessonId: L })));
    expect(r.data).toEqual({ completed: true, next: { id: "n1", title: "Lecture 3" } });
  });

  it("POST /save runs the website's applySaves for the token's account", async () => {
    h.saves.mockResolvedValue([{ id: "a", status: "ok" }]);
    const r = await read(await save(appReq("/save", { body: { items: [{ id: "a", kind: "progress", payload: { lessonId: L, watched: 1, duration: 2 } }] } }), noParams));
    expect(r.data).toEqual({ results: [{ id: "a", status: "ok" }] });
    expect(h.saves.mock.calls[0][0]).toMatchObject({ id: STUDENT_ID });
  });

  it("POST /save is rate limited per student", async () => {
    G.limited.add(`save:${STUDENT_ID}`);
    const r = await read(await save(appReq("/save", { body: { items: [] } }), noParams));
    expect(r).toMatchObject({ status: 429, error: { code: "rate_limited" } });
  });
});

describe("materials and submission files", () => {
  it("material: a file answers its app file path, a link its address", async () => {
    h.check.mockResolvedValueOnce({ ok: true, material: { id: M, title: "Slides", kind: "pdf", format: "pdf", size_bytes: 9, url: null, storage_path: "a", lesson_id: null, week: 1 } });
    let r = await read(await material(appReq(`/materials/${M}`), params({ materialId: M })));
    expect(r.data).toMatchObject({ kind: "pdf", filePath: `/api/app/v1/materials/${M}/file`, url: null });
    h.check.mockResolvedValueOnce({ ok: true, material: { id: M, title: "Site", kind: "link", format: null, size_bytes: null, url: "https://example.org", storage_path: null, lesson_id: null, week: 1 } });
    r = await read(await material(appReq(`/materials/${M}`), params({ materialId: M })));
    expect(r.data).toMatchObject({ kind: "link", filePath: null, url: "https://example.org" });
  });

  it("material refused by the website rule is refused here", async () => {
    h.check.mockResolvedValue({ ok: false, reason: "You aren't enrolled in this course." });
    const r = await read(await material(appReq(`/materials/${M}`), params({ materialId: M })));
    expect(r).toMatchObject({ status: 403, error: { code: "forbidden", message: "You aren't enrolled in this course." } });
  });

  it("file bytes stream with the Range answer of the shared proxy", async () => {
    h.serve.mockResolvedValue({ ok: true, file: { status: 206, headers: { "Content-Range": "bytes 0-1/10", "Content-Type": "application/pdf" }, stream: new Blob(["hi"]).stream() } });
    const res = await materialFile(appReq(`/materials/${M}/file`, { headers: { range: "bytes=0-1" } }), params({ materialId: M }));
    expect(res.status).toBe(206);
    expect(res.headers.get("content-range")).toBe("bytes 0-1/10");
    expect(await res.text()).toBe("hi");
    expect(h.serve.mock.calls[0][2]).toBe("bytes=0-1");
  });

  it("a submission file answers a short-lived address, owner only", async () => {
    const F = "88888888-8888-4888-8888-888888888888";
    h.sign.mockResolvedValueOnce({ ok: true, url: "https://s/x", expiresIn: 900 });
    expect((await read(await subFile(appReq(`/submissions/files/${F}`), params({ fileId: F })))).data).toEqual({ url: "https://s/x", expiresIn: 900 });
    h.sign.mockResolvedValueOnce({ ok: false, status: 403, error: "Not authorized." });
    expect((await read(await subFile(appReq(`/submissions/files/${F}`), params({ fileId: F })))).status).toBe(403);
  });
});

describe("assignments", () => {
  it("lists assignments with due dates and scores", async () => {
    G.db.tables.assignments = [{ id: A, lesson_id: L, due_at: "2026-12-01T00:00:00Z" }];
    G.db.tables.submissions = [{ assignment_id: A, user_id: STUDENT_ID, score: "8.5" }];
    const r = await read(await assignments(appReq("/assignments"), noParams));
    expect(r.data.items).toEqual([{ id: A, lessonId: L, courseId: C, title: "Case write-up", lessonTitle: "Lecture 2", week: 1, dueAt: "2026-12-01T00:00:00Z", status: "not_started", score: 8.5 }]);
    expect(r.data.nextCursor).toBeNull();
  });

  it("an assignment the student cannot open is not found, and nothing is written", async () => {
    h.assignment.mockResolvedValue(null);
    expect((await read(await assignment(appReq(`/assignments/${A}`), params({ assignmentId: A })))).status).toBe(404);
    const r = await read(await submitText(appReq(`/assignments/${A}/text`, { body: { text: "hello" } }), params({ assignmentId: A })));
    expect(r.status).toBe(404);
    expect(h.submitText).not.toHaveBeenCalled();
  });

  it("text submission runs the website action and answers the stored submission", async () => {
    h.submitText.mockResolvedValue({ error: null });
    h.assignment.mockResolvedValueOnce(assignmentView).mockResolvedValueOnce({ ...assignmentView, submission: { id: "s9", status: "pending_review", submittedAt: null, isLate: false, text: "hello", note: null, hasAudio: false, files: [], score: null, feedback: null, editable: true } });
    const r = await read(await submitText(appReq(`/assignments/${A}/text`, { body: { text: "hello" } }), params({ assignmentId: A })));
    expect(r.data.submission).toMatchObject({ id: "s9", text: "hello", editable: true });
    const form = h.submitText.mock.calls[0][2] as FormData;
    expect(form.get("textContent")).toBe("hello");
  });

  it("a graded submission cannot be changed (409)", async () => {
    h.withFiles.mockResolvedValue({ error: "This assignment has already been graded and can't be edited." });
    const r = await read(await files(appReq(`/assignments/${A}/files`, { body: { files: [] } }), params({ assignmentId: A })));
    expect(r).toMatchObject({ status: 409, error: { code: "conflict" } });
  });

  it("upload answers the signed Supabase address for the path the website made", async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://db.example.co";
    h.prepare.mockResolvedValue({ ok: true, path: `${A}/${STUDENT_ID}/1-a.pdf`, token: "tok" });
    const r = await read(await uploads(appReq(`/assignments/${A}/uploads`, { body: { fileName: "a.pdf" } }), params({ assignmentId: A })));
    expect(r.data).toEqual({
      path: `${A}/${STUDENT_ID}/1-a.pdf`,
      uploadUrl: `https://db.example.co/storage/v1/object/upload/sign/submissions/${A}/${STUDENT_ID}/1-a.pdf?token=tok`,
      headers: { "Content-Type": "application/pdf", "x-upsert": "false" },
    });
    h.prepare.mockResolvedValue({ ok: false, error: `"a.exe" isn't an accepted file type for this submission.` });
    expect((await read(await uploads(appReq(`/assignments/${A}/uploads`, { body: { fileName: "a.exe" } }), params({ assignmentId: A })))).error?.code).toBe("bad_request");
  });

  it("unsubmit maps the website's answers", async () => {
    h.unsubmit.mockResolvedValueOnce({ error: null });
    expect((await read(await unsubmit(appReq(`/assignments/${A}/submission`, { method: "DELETE" }), params({ assignmentId: A })))).data).toEqual({ removed: true });
    h.unsubmit.mockResolvedValueOnce({ error: "This submission has been graded and can't be unsubmitted." });
    expect((await read(await unsubmit(appReq(`/assignments/${A}/submission`, { method: "DELETE" }), params({ assignmentId: A })))).status).toBe(409);
  });

  it("lectures-only accounts keep lectures and assignments", async () => {
    G.db.tables.profiles[0] = profileRow({ scope: "lectures_only" });
    const r = await read(await assignment(appReq(`/assignments/${A}`), params({ assignmentId: A })));
    expect(r.status).toBe(200);
  });
});
