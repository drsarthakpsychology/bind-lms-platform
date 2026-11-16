import type { RawResponse } from "../client";
import type * as C from "../contract";

/**
 * Mock answers for the learning map (/study/map...) and the class wall
 * (/wall...), in the server's shapes. Sample words only. The wall keeps
 * what you post, reply and react until the mock is reset.
 */

const ok = <T,>(data: T): RawResponse => ({ status: 200, json: { ok: true, data } });
const fail = (status: number, code: string, message: string): RawResponse => ({ status, json: { ok: false, error: { code, message } } });

const SKILLS = ["Spot it", "Criteria", "Tell apart", "Use it", "MSE", "Risk", "Medicines"];
const STATES: C.MapState[] = [
  { key: "new", label: "Not started" },
  { key: "learning", label: "Learning" },
  { key: "shaky", label: "Shaky" },
  { key: "mastered", label: "Mastered" },
  { key: "decaying", label: "Needs review" },
];

function topic(id: string, title: string, states: (C.MapStateKey | null)[], p: (number | null)[]): C.MapTopic {
  return {
    id,
    title,
    studyTarget: { screen: "studyModule", moduleId: id, web: `/study/${id}` },
    cells: SKILLS.map((label, i) => ({ skill: `${id}:${i}`, label, state: states[i] ?? "new", hasItems: states[i] !== null, p: p[i] ?? null })),
  };
}

export function studyMap(empty: boolean): C.StudyMap {
  const topics = [
    topic("m01", "Mood disorders", ["mastered", "learning", "shaky", "learning", "mastered", "learning", "decaying"], [0.88, 0.62, 0.41, 0.58, 0.91, 0.66, 0.52]),
    topic("m02", "Anxiety disorders", ["learning", "shaky", "learning", "new", "learning", null, "new"], [0.64, 0.38, 0.6, null, 0.7, null, null]),
    topic("m03", "Psychotic disorders", ["new", "new", "new", "new", "new", "new", null], []),
    topic("m04", "Personality", ["learning", "new", "decaying", "new", null, "new", null], [0.57, null, 0.49]),
  ];
  if (empty) return { learner: true, due: 0, calibrated: false, answersToCalibrate: 20, states: STATES, skills: SKILLS, weak: [], mixUps: [], topics: topics.map((t) => ({ ...t, cells: t.cells.map((c) => ({ ...c, state: "new" as const, p: null })) })) };
  return {
    learner: true,
    due: 4,
    calibrated: true,
    answersToCalibrate: 0,
    states: STATES,
    skills: SKILLS,
    weak: [
      { skill: "m02:1", topic: "m02", label: "Anxiety disorders · Criteria", state: "shaky", studyTarget: { screen: "studyModule", moduleId: "m02", web: "/study/m02" } },
      { skill: "m01:2", topic: "m01", label: "Mood disorders · Tell apart", state: "shaky", studyTarget: { screen: "studyModule", moduleId: "m01", web: "/study/m01" } },
      { skill: "m01:6", topic: "m01", label: "Mood disorders · Medicines", state: "decaying", studyTarget: { screen: "studyModule", moduleId: "m01", web: "/study/m01" } },
    ],
    mixUps: [
      { a: "Mania", b: "Hypomania", n: 3, topic: "m01", topicTitle: "Mood disorders" },
      { a: "Panic attack", b: "Agoraphobia", n: 2, topic: "m02", topicTitle: "Anxiety disorders" },
    ],
    topics,
  };
}

const QUESTIONS: C.MapQuestion[] = [
  { id: "q1", kind: "mcq", topic: "m01", label: "Mood disorders · Tell apart", text: "Four days of raised mood, less sleep and more talking, still working. Which fits best?", options: ["Hypomania", "Mania", "Cyclothymia", "Depression"], answer: 0, student: "Mania lasts a week or needs a hospital stay. Four days and still working points to hypomania.", clinician: "Hypomanic episode: at least 4 days, no marked impairment, no psychosis, no admission." },
  { id: "q2", kind: "tf", topic: "m02", label: "Anxiety disorders · Criteria", text: "Worry has to last at least six months for generalised anxiety.", answer: true, student: "Yes. Worry about many things, most days, for at least six months.", clinician: "DSM-5 GAD: excessive anxiety and worry more days than not for at least 6 months." },
  { id: "q3", kind: "mcq", topic: "m01", label: "Mood disorders · Medicines", text: "Which blood test matters most before starting lithium?", options: ["Kidney function", "Liver enzymes", "Blood sugar", "Vitamin B12"], answer: 0, student: "Lithium leaves the body through the kidneys, so check them first, and the thyroid too.", clinician: "Baseline renal function (eGFR, creatinine) and TFTs; also calcium and ECG when indicated." },
];

type WallState = { posts: C.WallPostItem[]; n: number };
let wall: WallState = fresh();

function fresh(): WallState {
  return {
    n: 0,
    posts: [
      {
        id: "p1",
        content: "Case of the week: a 24 year old with three days of no sleep and big plans. What would you ask first?",
        isAnonymous: false,
        isFaculty: true,
        isPinned: true,
        createdAt: "2026-11-15T09:30:00.000Z",
        reactions: { insight: 6, question: 2 },
        mine: ["insight"],
        replies: [
          { id: "r1", content: "Drugs and alcohol, and whether this has happened before.", isAnonymous: false, isFaculty: false, createdAt: "2026-11-15T10:05:00.000Z", reactions: { heart: 2 }, mine: [] },
          { id: "r2", content: "Family history of bipolar disorder.", isAnonymous: true, isFaculty: false, createdAt: "2026-11-15T10:40:00.000Z", reactions: {}, mine: [] },
        ],
      },
      { id: "p2", content: "Anyone want to practise MSE write-ups together this weekend?", isAnonymous: false, isFaculty: false, isPinned: false, createdAt: "2026-11-14T17:12:00.000Z", reactions: { heart: 3, applause: 1 }, mine: [], replies: [] },
      { id: "p3", content: "I still mix up delusions and overvalued ideas. Does anyone have a simple way to tell them apart?", isAnonymous: true, isFaculty: false, isPinned: false, createdAt: "2026-11-13T08:00:00.000Z", reactions: { question: 4, worry: 1 }, mine: [], replies: [{ id: "r3", content: "Ask how they would react if shown proof. A delusion does not move.", isAnonymous: false, isFaculty: true, createdAt: "2026-11-13T12:00:00.000Z", reactions: { insight: 5 }, mine: [] }] },
    ],
  };
}

export function resetMapWallMock() {
  wall = fresh();
}

const KEYS = ["heart", "insight", "question", "applause", "worry"] as const;

function toggle(item: C.WallReplyItem, key: C.WallReactionKey): boolean {
  const had = item.mine.includes(key);
  item.mine = had ? item.mine.filter((k) => k !== key) : [...item.mine, key];
  item.reactions = { ...item.reactions, [key]: Math.max(0, (item.reactions[key] ?? 0) + (had ? -1 : 1)) };
  return !had;
}

/** Answers the map and wall routes, or null for any other route. `kind` is the account kind; lectures-only accounts are refused as on the server. */
export function mapWallRoute(method: string, path: string, body: Record<string, unknown>, query: Record<string, string>, kind: string, opts: { empty: boolean }): RawResponse | null {
  const isMap = path === "/study/map" || path.startsWith("/study/map/");
  const isWall = path === "/wall" || path.startsWith("/wall/");
  if (!isMap && !isWall) return null;
  if (kind === "lecture") return fail(403, "scope", "This isn't part of your access.");

  if (method === "GET" && path === "/study/map") return ok(studyMap(opts.empty));
  if (method === "GET" && path === "/study/map/practice") {
    const t = query.topic && ["m01", "m02", "m03", "m04"].includes(query.topic) ? query.topic : null;
    const qs = t ? [...QUESTIONS.filter((q) => q.topic === t), ...QUESTIONS.filter((q) => q.topic !== t)] : QUESTIONS;
    return ok<C.MapPractice>({ title: t ? `Fix it: ${studyMap(false).topics.find((x) => x.id === t)!.title}` : "Mixed practice", topic: t, round: `r${Date.now()}`, saving: true, questions: qs });
  }
  if (method === "POST" && path === "/study/map/practice/answers") {
    const q = QUESTIONS.find((x) => x.id === body.item);
    if (!q) return fail(404, "not_found", "That question is not in the bank.");
    return ok<C.MapAnswerResult>({ ok: body.choice === q.answer, saved: true });
  }

  if (method === "GET" && path === "/wall") return ok<C.WallFeed>({ posts: opts.empty ? [] : wall.posts });
  const text = String(body.content ?? "").trim();
  if (method === "POST" && path === "/wall/posts") {
    if (!text) return fail(400, "bad_request", "Write something first.");
    const id = `new-p${++wall.n}`;
    wall.posts.splice(wall.posts.filter((p) => p.isPinned).length, 0, { id, content: text, isAnonymous: body.isAnonymous === true, isFaculty: false, isPinned: false, createdAt: new Date().toISOString(), reactions: {}, mine: [], replies: [] });
    return ok<C.WallWriteResult>({ id });
  }
  const m = /^\/wall\/posts\/([^/]+)\/replies$/.exec(path);
  if (method === "POST" && m) {
    const p = wall.posts.find((x) => x.id === decodeURIComponent(m[1]!));
    if (!p) return fail(404, "not_found", "We could not find that post.");
    if (!text) return fail(400, "bad_request", "Write a reply first.");
    const id = `new-r${++wall.n}`;
    p.replies.push({ id, content: text, isAnonymous: body.isAnonymous === true, isFaculty: false, createdAt: new Date().toISOString(), reactions: {}, mine: [] });
    return ok<C.WallWriteResult>({ id });
  }
  if (method === "POST" && path === "/wall/reactions") {
    const key = KEYS.find((k) => k === body.reaction);
    if (!key) return fail(400, "bad_request", "Pick a reaction.");
    const p = body.postId ? wall.posts.find((x) => x.id === body.postId) : undefined;
    const r = body.replyId ? wall.posts.flatMap((x) => x.replies).find((x) => x.id === body.replyId) : undefined;
    const item = p ?? r;
    if (!item) return fail(404, "not_found", "We could not find that.");
    return ok<C.WallReactResult>({ added: toggle(item, key) });
  }
  if (method === "POST" && path === "/wall/reports") return ok({ reported: true });
  return fail(404, "not_found", "We could not find that.");
}
