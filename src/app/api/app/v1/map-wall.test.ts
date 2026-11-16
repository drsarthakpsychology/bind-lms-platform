import { beforeEach, describe, expect, it, vi } from "vitest";
import { G, resetGuard } from "@/lib/app-api/test-guard";
import { STUDENT_ID, appReq, noParams, params, profileRow, read } from "@/lib/app-api/test-kit";

const h = vi.hoisted(() => ({ map: vi.fn(), session: vi.fn(), answer: vi.fn() }));

vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({ revalidatePath: () => undefined }));
vi.mock("@/lib/supabase/server", async () => (await import("@/lib/app-api/test-guard")).supabaseMock());
vi.mock("@/lib/app-api/supabase", async () => (await import("@/lib/app-api/test-guard")).statelessMock());
vi.mock("@/lib/flags", async () => (await import("@/lib/app-api/test-guard")).flagsMock());
vi.mock("@/lib/access/blocks", async () => (await import("@/lib/app-api/test-guard")).blocksMock());
vi.mock("@/lib/rate-limit", async () => (await import("@/lib/app-api/test-guard")).rateMock());
vi.mock("@/lib/rate-limit-fast", async () => (await import("@/lib/app-api/test-guard")).fastRateMock());
vi.mock("@/lib/learn/model/server", () => ({ loadStudentMap: h.map, loadPracticeSession: h.session }));
vi.mock("@/app/(dashboard)/study/map/actions", () => ({ answerPractice: h.answer }));

import { clearDeviceCache } from "@/lib/app-api/devices";
import { BANK } from "@/lib/learn/model/topics";
import { GET as getMap } from "./study/map/route";
import { GET as getRound } from "./study/map/practice/route";
import { POST as answer } from "./study/map/practice/answers/route";
import { GET as getWall } from "./wall/route";
import { POST as post } from "./wall/posts/route";
import { POST as reply } from "./wall/posts/[postId]/replies/route";
import { POST as react } from "./wall/reactions/route";
import { POST as report } from "./wall/reports/route";

const P1 = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const R1 = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";

beforeEach(() => {
  resetGuard({
    wall_posts_visible: [{ id: P1, content: "Case of the week", is_anonymous: true, is_faculty: false, is_pinned: true, created_at: "2026-11-10T10:00:00Z", author_id: null }],
    wall_replies_visible: [{ id: R1, post_id: P1, content: "Thanks", is_anonymous: false, is_faculty: true, created_at: "2026-11-10T11:00:00Z", author_id: "fac" }],
    wall_reactions: [
      { id: "x1", post_id: P1, reply_id: null, author_id: STUDENT_ID, reaction: "heart" },
      { id: "x2", post_id: P1, reply_id: null, author_id: "other", reaction: "heart" },
      { id: "x3", post_id: P1, reply_id: R1, author_id: "other", reaction: "insight" },
    ],
    wall_posts: [],
    wall_replies: [],
    wall_reports: [],
  });
  clearDeviceCache();
  h.map.mockReset();
  h.session.mockReset();
  h.answer.mockReset();
});

const emptyMap = { topics: [{ id: "mood", title: "Mood", href: "/study/mood", practised: 0, cells: [{ skill: "mood:recognise", competency: "recognise", label: "Spot it", hasItems: true, state: "shaky", n: 4, p: 0.4 }] }], graded: 4, calibrated: false, confusions: [{ a: "Mania", b: "Hypomania", n: 2, lastAt: "", skill: "mood:differentiate", score: 1 }], weak: [{ skill: "mood:recognise", topic: "mood", label: "Mood · Spot it", state: "shaky", p: 0.4, n: 4, lastAt: null, href: "/study/mood", practiceHref: "/study/map/practice?topic=mood" }], due: 3, placement: null };

describe("GET /study/map", () => {
  it("answers the website's map in the contract shape", async () => {
    h.map.mockResolvedValue(emptyMap);
    const r = await read(await getMap(appReq("/study/map"), noParams));
    expect(r.ok).toBe(true);
    expect(h.map).toHaveBeenCalledWith(STUDENT_ID, expect.any(Object));
    expect(r.data).toMatchObject({ learner: true, due: 3, calibrated: false, topics: [{ id: "mood", cells: [{ state: "shaky", p: 0.4 }] }] });
    expect(r.data.answersToCalibrate).toBeGreaterThan(0);
    expect(r.data.states.map((s: { key: string }) => s.key)).toEqual(["new", "learning", "shaky", "mastered", "decaying"]);
    expect(r.data.skills).toHaveLength(7);
    // No website paths leak to the app except inside targets.
    expect(JSON.stringify(r.data)).not.toMatch(/practiceHref/);
  });

  it("is closed while the learn flag is not unlocked, and for lectures-only accounts", async () => {
    G.flags = { learn: "live" };
    expect((await read(await getMap(appReq("/study/map"), noParams))).error?.code).toBe("feature_locked");
    G.flags = { learn: "unlocked" };
    G.db.tables.profiles[0] = profileRow({ scope: "lectures_only" });
    expect((await read(await getMap(appReq("/study/map"), noParams))).error?.code).toBe("scope");
  });
});

describe("map practice", () => {
  it("gives a round with answers and explanations, and a known topic only", async () => {
    const mcq = BANK.find((b) => b.item.kind === "mcq")!;
    h.session.mockResolvedValue({ picked: [{ id: mcq.item.id }, { id: "nope" }], round: "r1" });
    const r = await read(await getRound(appReq("/study/map/practice?topic=not-a-topic"), noParams));
    expect(r.ok).toBe(true);
    expect(h.session).toHaveBeenCalledWith(STUDENT_ID, null);
    expect(r.data).toMatchObject({ title: "Mixed practice", topic: null, round: "r1", saving: true });
    expect(r.data.questions).toHaveLength(1);
    expect(r.data.questions[0]).toMatchObject({ id: mcq.item.id, kind: "mcq" });
    expect(typeof r.data.questions[0].answer).toBe("number");
  });

  it("grades and saves an answer through the website's answerPractice", async () => {
    const item = BANK[0]!.item.id;
    h.answer.mockResolvedValue({ ok: true, saved: true });
    const r = await read(await answer(appReq("/study/map/practice/answers", { method: "POST", body: { item, choice: 1, ms: 900 } }), noParams));
    expect(r.data).toEqual({ ok: true, saved: true });
    expect(h.answer).toHaveBeenCalledWith({ item, choice: 1, ms: 900 });
    expect(G.limits).toContain(`app:mapanswer:${STUDENT_ID}`);
    const bad = await read(await answer(appReq("/study/map/practice/answers", { method: "POST", body: { item: "zzz", choice: 1 } }), noParams));
    expect(bad.error?.code).toBe("not_found");
  });
});

describe("class wall", () => {
  it("lists posts with replies, counts and your own reactions, never the author", async () => {
    const r = await read(await getWall(appReq("/wall"), noParams));
    expect(r.ok).toBe(true);
    const p = r.data.posts[0];
    expect(p).toMatchObject({ id: P1, isAnonymous: true, isPinned: true, reactions: { heart: 2 }, mine: ["heart"] });
    expect(p.replies[0]).toMatchObject({ id: R1, isFaculty: true, reactions: { insight: 1 }, mine: [] });
    expect(JSON.stringify(r.data)).not.toMatch(/author/);
  });

  it("posts, replies, reacts and reports with the website's limits", async () => {
    expect((await read(await post(appReq("/wall/posts", { method: "POST", body: { content: "  Hello  ", isAnonymous: true } }), noParams))).ok).toBe(true);
    expect(G.db.tables.wall_posts[0]).toMatchObject({ author_id: STUDENT_ID, content: "Hello", is_anonymous: true, is_faculty: false });
    expect((await read(await reply(appReq(`/wall/posts/${P1}/replies`, { method: "POST", body: { content: "Me too" } }), params({ postId: P1 })))).ok).toBe(true);
    expect(G.db.tables.wall_replies[0]).toMatchObject({ post_id: P1, is_anonymous: false });
    const rr = await read(await react(appReq("/wall/reactions", { method: "POST", body: { replyId: R1, reaction: "applause" } }), noParams));
    expect(rr.data).toEqual({ added: true });
    expect((await read(await report(appReq("/wall/reports", { method: "POST", body: { postId: P1 } }), noParams))).data).toEqual({ reported: true });
    expect(G.db.tables.wall_reports[0]).toMatchObject({ post_id: P1, reported_by: STUDENT_ID, reason: "flagged by a cohort member" });
    expect(G.limits).toEqual(expect.arrayContaining([`wall:${STUDENT_ID}`, `wall:reply:${STUDENT_ID}`, `wall:react:${STUDENT_ID}`, `wall:report:${STUDENT_ID}`]));
  });

  it("refuses empty posts, two targets, a bad post id and too many posts", async () => {
    expect((await read(await post(appReq("/wall/posts", { method: "POST", body: { content: "   " } }), noParams))).error?.code).toBe("bad_request");
    expect((await read(await react(appReq("/wall/reactions", { method: "POST", body: { postId: P1, replyId: R1, reaction: "heart" } }), noParams))).error?.code).toBe("bad_request");
    expect((await read(await reply(appReq("/wall/posts/x/replies", { method: "POST", body: { content: "a" } }), params({ postId: "x" })))).error?.code).toBe("not_found");
    G.limited.add(`wall:${STUDENT_ID}`);
    expect((await read(await post(appReq("/wall/posts", { method: "POST", body: { content: "a" } }), noParams))).error?.code).toBe("rate_limited");
  });

  it("is closed for lectures-only accounts and when switched off for the student", async () => {
    G.blocks = ["wall"];
    expect((await read(await getWall(appReq("/wall"), noParams))).error?.code).toBe("access_block");
    G.blocks = [];
    G.db.tables.profiles[0] = profileRow({ scope: "lectures_only" });
    expect((await read(await getWall(appReq("/wall"), noParams))).error?.code).toBe("scope");
  });
});
