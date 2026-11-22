/**
 * Contract-shaped sample data for the mock server. Invented students and
 * invented course content, close to the real thing in shape and length so
 * every screen can be built and checked without a server.
 */
import type {
  Access,
  Assignment,
  Achievements,
  AppConfig,
  Block,
  CheckpointContent,
  CourseDetail,
  CourseSummary,
  DeviceState,
  DoubtThread,
  Figure,
  Home,
  LearnState,
  LectureDetail,
  Me,
  ModuleDetail,
  ModuleSummary,
  NotificationDetail,
  NotificationPrefs,
  Progress,
  QuestionReview,
  SectionContent,
  SectionToc,
  Strengths,
  TestQuestion,
  Watermark,
} from "../contract";

const web = "/";
export const NOW = "2026-11-15T10:30:00.000Z";

export const config: AppConfig = {
  apiVersion: "v1",
  minSupportedVersion: "1.0.0",
  latestVersion: "1.0.0",
  storeUrl: { android: "https://play.google.com/store/apps/details?id=com.vibhapsychology.app", ios: null },
  notice: null,
  security: { pinLength: 4, pinMaxTries: 5, lockAfterBackgroundSeconds: 300, blockScreenCapture: true, refuseVideoOnRootedDevice: true },
  device: { onePhoneAtATime: true, changesPerMonth: 2 },
  support: { whatsapp: "https://wa.me/917877049920", email: "hello@vibhapsychology.com" },
  legal: { termsUrl: "https://vibhapsychology.com/policies/terms", privacyUrl: "https://vibhapsychology.com/policies/privacy", policyVersion: "2026-11" },
  contentSchemaVersion: 1,
  now: NOW,
  cohortLine: "Cohort Two · by invitation · starts December 2026",
};

const watermark: Watermark = { name: "Ananya Mehta", rollNumber: "VIBHA-000123", text: "Ananya Mehta · VIBHA-000123" };

const fullAccess: Access = {
  tabs: ["home", "learn", "practise", "library", "me"],
  lecturesOnly: false,
  singleLessonId: null,
  blocks: [],
  flags: { learn: "unlocked", ui_v2: "unlocked" },
  can: { lectures: true, study: true, doubts: true, practice: true, games: true, medicines: true, leaderboard: true, journey: true, achievements: true, notifications: true },
};

export const student: Me = {
  id: "u-student",
  email: "ananya@example.com",
  name: "Ananya Mehta",
  role: "student",
  scope: "full",
  status: "active",
  rollNumber: "VIBHA-000123",
  mobileNumber: "9876543210",
  askMobileNumber: false,
  expiresAt: "2027-04-30T18:29:59.000Z",
  cohorts: [{ id: "c2", name: "Cohort Two" }],
  access: fullAccess,
  watermark,
  unreadNotifications: 2,
};

export const lectureOnly: Me = {
  ...student,
  id: "u-lecture",
  email: "rohan@example.com",
  name: "Rohan Shah",
  scope: "lectures_only",
  rollNumber: "VIBHA-000207",
  watermark: { name: "Rohan Shah", rollNumber: "VIBHA-000207", text: "Rohan Shah · VIBHA-000207" },
  access: {
    ...fullAccess,
    tabs: ["home", "lectures", "doubts", "me"],
    lecturesOnly: true,
    can: { lectures: true, study: false, doubts: true, practice: false, games: false, medicines: false, leaderboard: false, journey: false, achievements: false, notifications: true },
  },
};

export const admin: Me = {
  ...student,
  id: "u-admin",
  email: "admin@example.com",
  name: "Kavya Bothra",
  role: "admin",
  rollNumber: null,
  expiresAt: null,
  watermark: { name: "Kavya Bothra", rollNumber: null, text: "Kavya Bothra" },
  access: { ...fullAccess, tabs: ["home", "students", "activity", "messages", "more"] },
  unreadNotifications: 0,
};

export const device: DeviceState = {
  enforced: true,
  current: { id: "mock-device-0000000000", name: "Pixel 8", platform: "android", lastSeenAt: NOW, pushEnabled: false },
  changesUsed: 0,
  limit: 2,
  nextChangeAt: null,
};

/* ---------------------------------------------------------------- courses */

const LESSONS: { id: string; title: string; week: number; minutes: number }[] = [
  { id: "l1", title: "What clinical psychology is, and is not", week: 1, minutes: 48 },
  { id: "l2", title: "The first interview: building rapport", week: 1, minutes: 52 },
  { id: "l3", title: "Mental status examination, part one", week: 2, minutes: 61 },
  { id: "l4", title: "Mental status examination, part two", week: 2, minutes: 57 },
  { id: "l5", title: "Depression: how it presents in the clinic", week: 3, minutes: 64 },
  { id: "l6", title: "Risk assessment and safety planning", week: 3, minutes: 55 },
  { id: "l7", title: "Anxiety disorders: telling them apart", week: 4, minutes: 58 },
  { id: "l8", title: "Case formulation with the 5 Ps", week: 4, minutes: 66 },
];
const DONE = new Set(["l1", "l2", "l3", "l4"]);
const CURRENT = "l5";

function lectureTarget(lessonId: string) {
  return { screen: "lecture" as const, courseId: "course-1", lessonId, web: `/courses/course-1/lessons/${lessonId}` };
}

export function courseSummary(fresh = false): CourseSummary {
  return {
    id: "course-1",
    title: "Clinical Psychology in Practice",
    completedCount: fresh ? 0 : DONE.size,
    totalLessons: LESSONS.length,
    started: !fresh,
    next: fresh
      ? { title: LESSONS[0]!.title, week: 1, kind: "lesson", number: 1, midway: false, target: lectureTarget("l1") }
      : { title: "Depression: how it presents in the clinic", week: 3, kind: "lesson", number: 5, midway: true, target: lectureTarget(CURRENT) },
  };
}

export function courseDetail(fresh = false): CourseDetail {
  const weeks = [1, 2, 3, 4].map((num) => {
    const lessons = LESSONS.filter((l) => l.week === num).map((l) => {
      const number = LESSONS.indexOf(l) + 1;
      const state = fresh ? (l.id === "l1" ? "next" : num > 1 ? "later" : "open") : DONE.has(l.id) ? "done" : l.id === CURRENT ? "started" : num === 3 ? "next" : "later";
      return { id: l.id, title: l.title, number, state, openable: state !== "later", hasVideo: true } as CourseDetail["weeks"][number]["lessons"][number];
    });
    const done = lessons.filter((l) => l.state === "done").length;
    return {
      num,
      status: (done === lessons.length ? "complete" : done > 0 || lessons.some((l) => l.state === "started") ? "in-progress" : num === 4 ? "upcoming" : "not-started") as CourseDetail["weeks"][number]["status"],
      isCurrent: fresh ? num === 1 : num === 3,
      isFuture: fresh ? num > 1 : num > 3,
      done,
      total: lessons.length,
      lessons,
      materials: num === 3 ? [{ id: "m1", title: "PHQ-9 scoring sheet", meta: "PDF · 2 pages", openable: true }] : [],
      assignments: num === 3 ? [{ id: "a1", lessonId: "l5", title: "Write up a first interview", lessonTitle: LESSONS[4]!.title, status: "not_started" as const, isNext: true, openable: true }] : [],
    };
  });
  return { ...courseSummary(fresh), weeks, empty: false, myCohorts: [{ id: "c2", name: "Cohort Two" }] };
}

export function lectureDetail(id: string): LectureDetail | null {
  const i = LESSONS.findIndex((l) => l.id === id);
  const l = LESSONS[i];
  if (!l) return null;
  const prev = LESSONS[i - 1];
  const next = LESSONS[i + 1];
  return {
    id: l.id,
    courseId: "course-1",
    courseTitle: "Clinical Psychology in Practice",
    title: l.title,
    description:
      "Dr. Sarthak Dave walks through three real presentations of low mood and shows what to ask, in what order, and what the answers tell you.\n\nWatch with a notebook. Pause at each case and write what you would ask next before he does.",
    week: l.week,
    number: i + 1,
    hasVideo: true,
    durationSeconds: l.minutes * 60,
    progress: { watchedSeconds: DONE.has(l.id) ? l.minutes * 60 : l.id === CURRENT ? 1104 : 0, completed: DONE.has(l.id) },
    requiresAssignment: false,
    assignment: assignmentFor(l.id),
    materials: l.id === CURRENT ? [{ id: "m1", title: "PHQ-9 scoring sheet", kind: "pdf", format: "pdf", sizeBytes: 184_000, lessonId: l.id, courseId: "course-1", week: 3, url: null, filePath: "/api/app/v1/materials/m1/file" }] : [],
    prev: prev ? { id: prev.id, title: prev.title } : null,
    next: next ? { id: next.id, title: next.title } : null,
  };
}

/** Lecture 5 takes files, Lecture 6 a recording (the two kinds the app hands in natively). */
export function assignmentFor(lessonId: string): Assignment | null {
  if (lessonId === CURRENT) return { id: "a1", lessonId, courseId: "course-1", title: "Write up a first interview", instructions: "Interview a friend or family member about their week, using the questions from the lecture. Write up what you asked, what you heard, and what you would ask next. Hand in a PDF or a Word file.", submissionType: "file", dueAt: "2026-11-22T18:29:00.000Z", allowLate: true, maxFiles: 3, maxFileMb: 20, acceptedFormats: ["pdf", "docx"], submission: null };
  if (lessonId === "l6") return { id: "a2", lessonId, courseId: "course-1", title: "Say it aloud: a safety question", instructions: "Record yourself asking a patient about thoughts of self-harm, in your own words, as you would in a first interview. Two minutes at most.", submissionType: "audio", dueAt: null, allowLate: true, maxFiles: 1, maxFileMb: 20, acceptedFormats: ["audio"], submission: null };
  return null;
}

/* ------------------------------------------------------------------ home */

const topic = (id: string, title: string, p: number, n: number) => ({ id, title, kind: "topic" as const, p, n, studyTarget: { screen: "studyModule" as const, moduleId: "m02", web }, practiceTarget: { screen: "practice" as const, tool: "prep", web } });
export const strengths: Strengths = {
  strongest: [topic("mse", "Mental status examination", 0.86, 42), topic("rapport", "Building rapport", 0.81, 30)],
  weakest: [topic("anx-ddx", "Telling anxiety disorders apart", 0.41, 18), topic("risk", "Risk assessment", 0.52, 22)],
  all: [],
  hasData: true,
};

export function home(kind: "default" | "new" | "done"): Home {
  const base = { dateLine: "Sun, 15 Nov", unreadNotifications: 2, supportWhatsapp: config.support.whatsapp, courses: [courseSummary(kind === "new")] };
  if (kind === "new") {
    return {
      ...base,
      welcomeBack: false,
      step: { kind: "lecture", eyebrow: "Lecture 1", title: LESSONS[0]!.title, meta: "Week 1 · 48 min", cta: "Start watching", target: lectureTarget("l1") },
      progress: null,
      allDone: false,
      goal: { points: 0, goal: 30, streak: 0 },
      upNext: [{ kind: "study", title: "Start Module 1: Foundations", meta: "About 20 min of reading", target: { screen: "studyModule", moduleId: "m01", web } }],
      strengths: null,
      unreadNotifications: 0,
    };
  }
  if (kind === "done") {
    return {
      ...base,
      welcomeBack: true,
      step: { kind: "lectures", eyebrow: "All caught up", title: "Nothing left to do today.", meta: "Revise a weak topic or try a case while you wait for the next lecture.", cta: "Practise", target: { screen: "practice", tool: null, web } },
      progress: null,
      allDone: true,
      goal: { points: 30, goal: 30, streak: 12 },
      upNext: [{ kind: "weak", title: "Telling anxiety disorders apart", meta: "Your weakest topic this week", target: { screen: "practice", tool: "prep", web } }],
      strengths,
    };
  }
  return {
    ...base,
    welcomeBack: true,
    step: { kind: "lecture", eyebrow: "Lecture 5 · Week 3", title: "Depression: how it presents in the clinic", meta: "You stopped at 18:24 of 64 min", cta: "Continue watching", target: lectureTarget(CURRENT) },
    progress: { pct: 29, label: "Lecture 5 watched" },
    allDone: false,
    goal: { points: 18, goal: 30, streak: 6 },
    upNext: [
      { kind: "lecture", title: "Risk assessment and safety planning", meta: "Lecture 6 · 55 min", target: lectureTarget("l6") },
      { kind: "weak", title: "Telling anxiety disorders apart", meta: "A weak topic to practise", target: { screen: "practice", tool: "prep", web } },
      { kind: "study", title: "Module 2: Mood disorders", meta: "Next: How depression is diagnosed", target: { screen: "studySection", moduleId: "m02", sectionId: "s2", web } },
    ],
    strengths,
  };
}

/** Today's quests. Not in the contract yet (see docs/app/CONTRACT_REQUESTS.md); the app shows them only when sent. */
export const quests = {
  done: false,
  xpEach: 5,
  xpBonus: 10,
  spareBonus: 2,
  quests: [
    { id: "q1", label: "Watch 15 minutes of a lecture", done: true, progress: null as string | null, target: lectureTarget(CURRENT) },
    { id: "q2", label: "Finish one section of Module 2", done: false, progress: null as string | null, target: { screen: "studyModule" as const, moduleId: "m02", web } },
    { id: "q3", label: "Answer 10 practice questions", done: false, progress: "4 of 10", target: { screen: "practice" as const, tool: "prep", web } },
  ],
};

/* --------------------------------------------------------- notifications */

export const notifications: NotificationDetail[] = [
  {
    id: "n1",
    from: "From the VIBHA team",
    type: "message",
    title: "Lecture 6 opens on Monday",
    body: "Risk assessment and safety planning opens on Monday at 9 am. Finish Lecture 5 before then so the cases make sense.",
    createdAt: "2026-11-15T07:10:00.000Z",
    readAt: null,
    target: { screen: "notification", notificationId: "n1", web },
    content: [
      { t: "p", spans: [{ text: "Risk assessment and safety planning opens on " }, { text: "Monday at 9 am", bold: true }, { text: "." }] },
      { t: "p", spans: [{ text: "Finish Lecture 5 before then so the cases make sense." }] },
      { t: "ul", items: [[{ text: "Bring the PHQ-9 sheet" }], [{ text: "Keep a notebook open" }]] },
    ],
    links: [{ label: "Open Lecture 5", target: lectureTarget(CURRENT), url: null }],
  },
  {
    id: "n2",
    from: "Dr. Sarthak Dave",
    type: "nudge",
    title: "Dr. Sarthak answered your doubt",
    body: "How do I tell low mood from clinical depression in a first interview?",
    createdAt: "2026-11-14T15:42:00.000Z",
    readAt: null,
    target: { screen: "doubt", doubtId: "d1", web },
    content: [{ t: "p", spans: [{ text: "How do I tell low mood from clinical depression in a first interview?" }] }],
    links: [],
  },
  {
    id: "n3",
    from: "From the VIBHA team",
    type: "achievement",
    title: "Badge earned: Seven days in a row",
    body: "You studied every day this week.",
    createdAt: "2026-11-12T18:00:00.000Z",
    readAt: "2026-11-12T18:05:00.000Z",
    target: { screen: "achievements", web },
    content: [{ t: "p", spans: [{ text: "You studied every day this week." }] }],
    links: [],
  },
  {
    id: "n4",
    from: "From the VIBHA team",
    type: "message",
    title: "Welcome to Cohort Two",
    body: "Your account is ready. Start with Lecture 1 and the first study module.",
    createdAt: "2026-11-02T09:00:00.000Z",
    readAt: "2026-11-02T09:30:00.000Z",
    target: { screen: "notification", notificationId: "n4", web },
    content: [{ t: "p", spans: [{ text: "Your account is ready. Start with Lecture 1 and the first study module." }] }],
    links: [],
  },
];

export const prefs: NotificationPrefs = { push: true, messages: true, doubtReplies: true, achievements: true, studyReminder: false, studyReminderTime: "19:00", synced: true, reminders: { opdDay: true, sessionSoon: true, scanOut: true, caseLog: true, leaveLow: true } };

/* ---------------------------------------------------------------- doubts */

export const doubts: DoubtThread[] = [
  {
    id: "d1",
    title: "How do I tell low mood from clinical depression in a first interview?",
    topic: "Depression",
    kind: "doubt",
    status: "solved",
    cohortId: "c2",
    author: "You",
    mine: true,
    createdAt: "2026-11-13T12:20:00.000Z",
    body: "In the role play my patient said she has felt low since her exams. I was not sure whether to explore it as depression or as a normal reaction. What do I ask to tell them apart?",
    replies: [
      { id: "r1", author: "Dr. Sarthak Dave", mine: false, body: "Ask about three things: how long, how much of the day, and what has stopped. Two weeks or more, most of the day, with loss of interest or function, points to a depressive episode. A reaction to exams lifts when the exams end and she can still enjoy other things.", votes: 14, youVoted: true, isSolution: true, createdAt: "2026-11-14T15:40:00.000Z" },
      { id: "r2", author: "Meera P.", mine: false, body: "The sleep and appetite questions helped me here too. In my role play the patient was sleeping fine, which fit a stress reaction.", votes: 3, youVoted: false, isSolution: false, createdAt: "2026-11-14T17:05:00.000Z" },
    ],
  },
  {
    id: "d2",
    title: "Is flat affect the same as blunted affect?",
    topic: "Mental status examination",
    kind: "doubt",
    status: "open",
    cohortId: "c2",
    author: "Karan D.",
    mine: false,
    createdAt: "2026-11-14T09:12:00.000Z",
    body: "The lecture used both words. Are they two points on one scale or two different findings?",
    replies: [],
  },
  {
    id: "d3",
    title: "When do we ask about self-harm in the interview?",
    topic: "Risk assessment",
    kind: "doubt",
    status: "open",
    cohortId: "c2",
    author: "Sana K.",
    mine: false,
    createdAt: "2026-11-12T20:31:00.000Z",
    body: "Do we ask early, or only once rapport is built? I worry that asking early will shut the patient down.",
    replies: [{ id: "r3", author: "Dr. Sarthak Dave", mine: false, body: "Ask in every first interview, once you have heard the main complaint. Asking does not plant the idea. Lecture 6 shows the exact wording.", votes: 9, youVoted: false, isSolution: false, createdAt: "2026-11-13T08:00:00.000Z" }],
  },
];

/* ----------------------------------------------------------------- study */

const status = (readDone: number, readTotal: number, extra: Partial<ModuleSummary["status"]> = {}): ModuleSummary["status"] => ({
  readDone,
  readTotal,
  written: false,
  actsDone: 0,
  actsTotal: 3,
  tested: false,
  best: null,
  total: null,
  pct: Math.round((readDone / readTotal) * 70),
  complete: false,
  seconds: readDone * 540,
  ...extra,
});

export const modules: ModuleSummary[] = [
  { id: "m01", num: 1, title: "Foundations of clinical work", emoji: "🧭", tagline: "What a psychologist does, and the rules of the room", when: "Week 1", minutes: 95, status: status(5, 5, { written: true, actsDone: 3, tested: true, best: 9, total: 10, pct: 100, complete: true }) },
  { id: "m02", num: 2, title: "Mood disorders", emoji: "🌧️", tagline: "Depression and bipolar disorder, from first signs to a plan", when: "Weeks 2 to 3", minutes: 140, status: status(1, 4) },
  { id: "m03", num: 3, title: "Anxiety and related disorders", emoji: "🌀", tagline: "Panic, worry, phobias and how to tell them apart", when: "Week 4", minutes: 120, status: status(0, 6) },
  { id: "m04", num: 4, title: "Psychosis", emoji: "🪞", tagline: "Hallucinations, delusions and the first episode", when: "Weeks 5 to 6", minutes: 150, status: status(0, 7) },
];

const toc = (id: string, num: string, title: string, doneOn: string | null, extra: Partial<SectionToc> = {}): SectionToc => ({ id, num, title, part: null, tag: "core", level: null, levelCheck: null, isTest: false, words: 900, doneOn, ...extra });

const m02Sections: SectionToc[] = [
  toc("s1", "2.1", "What depression looks like", "2026-11-13", { part: "Depression" }),
  toc("s2", "2.2", "How depression is diagnosed", null, { part: "Depression", words: 1200 }),
  toc("s3", "2.3", "Treating depression", null, { part: "Depression", words: 1500 }),
  toc("s4", "2.4", "Bipolar disorder", null, { part: "Bipolar disorder", words: 1300 }),
  toc("test", "2.5", "Module test", null, { part: "Test", isTest: true, words: 0 }),
];

export function moduleDetail(id: string): ModuleDetail | null {
  const m = modules.find((x) => x.id === id);
  if (!m) return null;
  const sections = id === "m02" ? m02Sections : [toc("s1", `${m.num}.1`, "Overview", m.status.complete ? "2026-11-05" : null), toc("s2", `${m.num}.2`, "Key ideas", m.status.complete ? "2026-11-06" : null), toc("test", `${m.num}.3`, "Module test", null, { isTest: true, words: 0 })];
  const i = modules.indexOf(m);
  const nextModule = modules[i + 1];
  return {
    ...m,
    outcomes: ["Recognise a depressive episode from a first interview", "Tell normal sadness from clinical depression", "Explain the first steps of a treatment plan"],
    writeTask: "In your own words, explain to a first-year student how you would tell sadness from depression.",
    noteId: null,
    activities: [],
    sections,
    checkpoints: [{ n: 1, key: `${id}-cp1`, title: "Checkpoint 1", sectionIds: ["s1", "s2"], status: id === "m02" ? "waiting" : "done", best: null, total: null }],
    next: id === "m02" ? { kind: "read", moduleId: "m02", sectionId: "s2", label: "Read 2.2 How depression is diagnosed", target: { screen: "studySection", moduleId: "m02", sectionId: "s2", web } } : { kind: "done", label: "Module complete", target: { screen: "study", web } },
    nextModule: nextModule ? { id: nextModule.id, num: nextModule.num, title: nextModule.title } : null,
    retestDue: null,
  };
}

const sectionBlocks: Block[][] = [
  [
    { t: "p", text: "A diagnosis of depression is not a feeling. It is a **pattern**: a set of symptoms, present together, for long enough, that change how a person lives." },
    { t: "h3", text: "The two core symptoms [core]" },
    { t: "p", text: "Every depressive episode has at least one of these, most of the day, nearly every day:" },
    { t: "ul", items: [{ text: "**Low mood**: sad, empty or hopeless" }, { text: "**Loss of interest or pleasure**, called `anhedonia`", children: [{ text: "Ask: what did you enjoy before that you have stopped doing?" }] }] },
    { t: "box", kind: "define", title: "Depressive episode", blocks: [{ t: "p", text: "Five or more symptoms in the same two weeks, at least one of them a core symptom, causing distress or a drop in functioning." }] },
    { t: "widget", kind: "guess", v: 1, data: { prompt: "For how long must symptoms last before you can call it a depressive episode?", min: 1, max: 12, step: 1, unit: "weeks", answer: [2, 2], reveal: "**Two weeks.** Shorter than that and it may be a normal reaction to a bad stretch." } },
  ],
  [
    { t: "h3", text: "The other seven symptoms" },
    { t: "table", head: ["Area", "What to ask", "What counts"], rows: [["Sleep", "How are your nights?", "Too little or too much, nearly every day"], ["Appetite", "Any change in eating or weight?", "A clear change without dieting"], ["Energy", "How tired do you feel?", "Fatigue most days"], ["Thinking", "Can you concentrate?", "Poor focus or indecision"]] },
    { t: "box", kind: "trap", blocks: [{ t: "p", text: "Do not count a symptom that is fully explained by a medical illness or a substance." }] },
    { t: "box", kind: "mnemonic", title: "SIG E CAPS", blocks: [{ t: "p", text: "Sleep, Interest, Guilt, Energy, Concentration, Appetite, Psychomotor, Suicidal thoughts." }] },
    { t: "widget", kind: "build", v: 1, data: { vignette: "Riya, 24, has felt low for three weeks. She has stopped painting, sleeps four hours a night, and cannot focus at work. Her appetite is unchanged.", rule: "Five or more symptoms, at least one core.", symptoms: [{ label: "Low mood", present: true, core: true }, { label: "Loss of interest", present: true, core: true, why: "She stopped painting." }, { label: "Sleep change", present: true }, { label: "Poor concentration", present: true }, { label: "Appetite change", present: false, why: "Her appetite is unchanged." }, { label: "Thoughts of death", present: false, why: "Not reported. You would still ask." }], need: 5, needCore: true, verdict: "Four symptoms, two of them core. This is **not yet** a full depressive episode by count, but it needs follow up." } },
    { t: "qa", q: "Why two weeks and not one?", blocks: [{ t: "p", text: "Short dips in mood are part of ordinary life. Two weeks filters most of them out while still catching an episode early." }] },
  ],
  [
    { t: "h3", text: "Severity" },
    { t: "p", text: "Count symptoms and look at function. Mild: just over the line, still working. Severe: most symptoms, cannot function." },
    { t: "widget", kind: "layers", v: 1, data: { title: "Severity at a glance", shape: "stack", layers: [{ label: "Mild", detail: "Five or six symptoms. Still manages work or study with effort." }, { label: "Moderate", detail: "More symptoms. Clear difficulty at work, home or with friends." }, { label: "Severe", detail: "Most symptoms, marked distress, cannot function. Check for psychosis and risk." }] } },
    { t: "widget", kind: "decide", v: 1, data: { scene: "A patient with a moderate episode tells you he has been thinking that his family would be better off without him.", ask: "What do you do next?", choices: [{ label: "Note it and move on to sleep", verdict: "harm", outcome: "The risk goes unassessed.", why: "Thoughts like this always need to be explored at once." }, { label: "Ask directly about thoughts of ending his life", verdict: "best", outcome: "He tells you about a plan. You can now keep him safe.", why: "Asking directly is safe and is the standard of care." }, { label: "Reassure him that his family loves him", verdict: "ok", outcome: "He feels heard but you still do not know the risk.", why: "Kind, but it skips the assessment." }] } },
    { t: "box", kind: "safety", blocks: [{ t: "p", text: "Any mention of death or being a burden means you assess risk in that session." }] },
    { t: "widget", kind: "reveal", v: 1, data: { prompt: "Say it aloud: the two core symptoms of depression.", answer: "Low mood, and loss of interest or pleasure." } },
  ],
];

/** The website's scene widgets, so the native versions can be checked in the reader. */
const sceneBlocks: Block[] = [
  { t: "p", text: "Long stress and depression travel together. Step through what happens in the body." },
  { t: "widget", kind: "stress", v: 1, data: {} },
  { t: "widget", kind: "journey", v: 1, data: { drug: "Sertraline", target: "the serotonin transporter", routes: ["oral", "iv"] } },
  { t: "widget", kind: "hypnogram", v: 1, data: { caption: "In depression, REM sleep comes earlier in the night." } },
];

export function sectionContent(moduleId: string, sectionId: string): SectionContent | null {
  const mod = moduleDetail(moduleId);
  const section = mod?.sections.find((s) => s.id === sectionId);
  if (!mod || !section) return null;
  const i = mod.sections.indexOf(section);
  const prev = mod.sections[i - 1];
  const next = mod.sections[i + 1];
  const isTest = section.isTest;
  return {
    contentSchemaVersion: 1,
    moduleId,
    moduleNum: mod.num,
    moduleTitle: mod.title,
    section,
    chunks: isTest ? [] : [
      { title: "A pattern, not a feeling", words: 320, blocks: sectionBlocks[0]! },
      { title: "Counting symptoms", words: 430, blocks: sectionBlocks[1]! },
      { title: "How severe is it?", words: 380, blocks: sectionBlocks[2]! },
      { title: "The body under stress", words: 260, blocks: sceneBlocks },
    ],
    recall: isTest ? [] : [{ q: "Name the two core symptoms.", a: "Low mood, and loss of interest or pleasure." }, { q: "How long must symptoms last?", a: "At least two weeks." }],
    viva: [],
    mcq: isTest ? [] : [{ q: "Which of these is a **core** symptom of depression?", options: ["Poor sleep", "Loss of interest", "Weight loss", "Fatigue"], answer: 1, why: "Loss of interest (anhedonia) and low mood are the two core symptoms." }],
    test: isTest ? { questions: testQuestions } : null,
    prev: prev ? { sectionId: prev.id, title: prev.title } : null,
    next: next ? { sectionId: next.id, title: next.title } : null,
    checkpoints: mod.checkpoints.map((c) => ({ n: c.n, key: c.key, sectionIds: c.sectionIds, later: [] })),
  };
}

export const testQuestions: TestQuestion[] = [
  { key: "q1", q: "A depressive episode needs symptoms for at least:", options: ["One week", "Two weeks", "One month", "Six months"] },
  { key: "q2", q: "Which is a **core** symptom?", options: ["Fatigue", "Guilt", "Loss of interest", "Poor sleep"] },
  { key: "q3", q: "A patient mentions being a burden to his family. You should:", options: ["Reassure and move on", "Assess risk in this session", "Refer and end the interview", "Wait for the next visit"] },
];
export const testAnswers: Record<string, { answer: number; why: string }> = {
  q1: { answer: 1, why: "Two weeks, most of the day, nearly every day." },
  q2: { answer: 2, why: "Low mood and loss of interest are the two core symptoms." },
  q3: { answer: 1, why: "Any hint of risk is assessed straight away." },
};
export function review(picks: Record<string, number>): QuestionReview[] {
  return testQuestions.map((q) => {
    const a = testAnswers[q.key]!;
    const picked = picks[q.key] ?? null;
    return { key: q.key, picked, answer: a.answer, correct: picked === a.answer, why: a.why };
  });
}

export function checkpoint(n: number): CheckpointContent {
  return { n, key: `m02-cp${n}`, title: `Checkpoint ${n}`, status: "ready", questions: testQuestions, recall: [], known: { right: 0, total: testQuestions.length } };
}

export const learnState: LearnState = {
  v: 1,
  xp: 640,
  streak: { count: 6, best: 9, lastDay: "2026-11-15", freezes: 1 },
  daily: { day: "2026-11-15", xp: 18, goalHit: false },
  dailyGoal: 30,
  lessons: {},
  srs: {},
  badges: [],
  bestCombo: 7,
  answered: 212,
  correct: 158,
  chests: 0,
  blitzBest: 0,
  coach: { concepts: {}, confusions: {} },
  history: {},
  detectiveBest: 0,
  notesRead: {},
  study: { done: { "m02/s1": "2026-11-13" }, secs: { "m02/s1": 540 }, tests: { m01: { best: 9, total: 10, day: "2026-11-06", tries: 1 } }, written: {}, acts: {}, last: { module: "m02", section: "s2" } },
  lab: {},
};

/* ------------------------------------------------ progress, certificates */

export const progress: Progress = {
  lectures: [{ courseId: "course-1", title: "Clinical Psychology in Practice", completed: 4, total: 8 }],
  study: { modulesDone: 1, modulesTotal: 4, sectionsDone: 6, sectionsTotal: 22, seconds: 14_400, xp: 640, streak: 6, bestStreak: 9 },
  days: Array.from({ length: 14 }, (_, i) => ({ day: `2026-11-${String(i + 2).padStart(2, "0")}`, xp: [0, 12, 30, 34, 8, 0, 30, 41, 30, 22, 30, 36, 30, 18][i] ?? 0 })),
  strengths,
};

export const achievements: Achievements = {
  earned: [
    { credentialId: "VIBHA-C2-0123-M1", type: "certificate", status: "issued", title: "Module 1: Foundations of clinical work", description: "Completed with 9 of 10 in the module test.", icon: null, tone: "blue", issuedAt: "2026-11-06T12:00:00.000Z", revokedAt: null, revokeReason: null, kind: "module", expiresAt: null, verifyUrl: "https://vibhapsychology.com/verify/VIBHA-C2-0123-M1" },
    { credentialId: "b-streak-7", type: "badge", status: "issued", title: "Seven days in a row", description: "Studied every day for a week.", icon: "flame", tone: "lime", issuedAt: "2026-11-12T18:00:00.000Z", revokedAt: null, revokeReason: null, kind: null, expiresAt: null, verifyUrl: null },
  ],
  progress: [
    { id: "p-m2", type: "certificate", title: "Module 2: Mood disorders", description: "Finish the module and pass its test.", icon: null, tone: "blue", earned: false, status: "in progress", progress: "1 of 4 sections read" },
    { id: "p-streak-30", type: "badge", title: "Thirty days in a row", description: "Study every day for a month.", icon: "flame", tone: "lime", earned: false, status: "in progress", progress: "6 of 30 days" },
  ],
};

/** A small labelled drawing, shaped like GET /study/figures/:id. */
export const figure: Figure = {
  v: 1,
  id: "neuron",
  title: "A neuron",
  summary: "The parts of a nerve cell, in the order a signal travels.",
  viewBox: "0 0 320 180",
  labels: [
    { id: "dendrite", name: "Dendrites", x: 52, y: 60, about: "Branches that receive signals from other cells." },
    { id: "soma", name: "Cell body", x: 92, y: 92, about: "Adds the signals up and keeps the cell alive." },
    { id: "axon", name: "Axon", x: 190, y: 92, about: "Carries the signal away from the cell body." },
    { id: "terminal", name: "Axon terminal", x: 282, y: 92, about: "Releases the chemical messenger to the next cell." },
  ],
  svg: {
    light: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 180"><g fill="none" stroke="#1a1a1a" stroke-width="2" stroke-linecap="round"><path data-part="dendrite" d="M70 80 L40 50 M70 84 L34 78 M72 100 L40 122 M60 66 L52 40"/><circle data-part="soma" cx="92" cy="92" r="24" fill="#e8edff"/><circle cx="92" cy="92" r="7" fill="#1d44d8" stroke="none"/><path data-part="axon" d="M116 92 L262 92"/><path data-part="terminal" d="M262 92 L290 74 M262 92 L294 92 M262 92 L290 112"/></g></svg>`,
    dark: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 180"><g fill="none" stroke="#f2f2f2" stroke-width="2" stroke-linecap="round"><path data-part="dendrite" d="M70 80 L40 50 M70 84 L34 78 M72 100 L40 122 M60 66 L52 40"/><circle data-part="soma" cx="92" cy="92" r="24" fill="#1d2547"/><circle cx="92" cy="92" r="7" fill="#8fa6ff" stroke="none"/><path data-part="axon" d="M116 92 L262 92"/><path data-part="terminal" d="M262 92 L290 74 M262 92 L294 92 M262 92 L290 112"/></g></svg>`,
  },
};
