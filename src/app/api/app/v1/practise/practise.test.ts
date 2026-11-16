import { beforeEach, describe, expect, it, vi } from "vitest";
import { G, resetGuard } from "@/lib/app-api/test-guard";
import { STUDENT_ID, appReq, noParams, params, profileRow, read } from "@/lib/app-api/test-kit";

const h = vi.hoisted(() => ({
  states: vi.fn(async () => ({ "/practice/daily": { state: "done_today" } })),
  resume: vi.fn(async () => ({ href: "/practice/mse", title: "Mental state exam" })),
  newCases: vi.fn(async () => "120+ new cases"),
  bests: vi.fn(async () => ({ best: 9 })),
  duelProfile: vi.fn(async () => ({ available: true })),
  board: vi.fn(async () => ({ ranked: [{ userId: "other-id", name: "Ravi K.", accuracy: 90, tags: 20, bestStreak: 4, rounds: 3, me: false, rank: 1 }], mine: null, live: true })),
  sort: vi.fn(async () => ({ ok: true, view: { board: "x" } })),
  daily: vi.fn(async () => ({ ok: true })),
  sct: vi.fn(async () => new Response(JSON.stringify({ ok: true, scored: 0.8 }), { status: 200 })),
  osce: vi.fn(async () => new Response(JSON.stringify({ error: "This isn't live yet.", reason: "feature_locked" }), { status: 403 })),
  duelLive: vi.fn(async () => new Response(JSON.stringify({ kind: "match", view: { round: 0 } }), { status: 200 })),
  league: vi.fn(),
  quiz: vi.fn(async () => ({ rows: [{ rank: 1, name: "Asha R.", weekXp: 40, xp: 400, streak: 2, me: true }], myRank: 1, total: 6 })),
  overall: vi.fn(),
  cohorts: vi.fn(async () => [{ id: "c1", name: "Cohort Two" }]),
  saveAlias: vi.fn(async () => ({ error: null, alias: "Ash" })),
  home: vi.fn(),
  topicSet: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({ revalidatePath: () => undefined, unstable_cache: (fn: unknown) => fn }));
vi.mock("@/lib/supabase/server", async () => (await import("@/lib/app-api/test-guard")).supabaseMock());
vi.mock("@/lib/app-api/supabase", async () => (await import("@/lib/app-api/test-guard")).statelessMock());
vi.mock("@/lib/flags", async () => ({ ...(await import("@/lib/app-api/test-guard")).flagsMock(), isFeatureEnabled: async () => true }));
vi.mock("@/lib/access/blocks", async () => (await import("@/lib/app-api/test-guard")).blocksMock());
vi.mock("@/lib/rate-limit", async () => (await import("@/lib/app-api/test-guard")).rateMock());
vi.mock("@/lib/rate-limit-fast", async () => (await import("@/lib/app-api/test-guard")).fastRateMock());
vi.mock("@/lib/practice/practice-state", () => ({ computePracticeStates: h.states }));
vi.mock("@/lib/practice/resume", () => ({ lastPracticePlace: h.resume }));
vi.mock("@/lib/cases/hubs", () => ({ hubNewCases: h.newCases }));
vi.mock("@/lib/games/blitz/server", () => ({ loadBests: h.bests }));
vi.mock("@/lib/games/duel/server", () => ({ profile: h.duelProfile, offlineRounds: () => [] }));
vi.mock("@/lib/games-sims/server/results", () => ({ loadAccuracyBoard: h.board }));
vi.mock("@/lib/games-sims/server/teams", () => ({ teamsReady: async () => false, myTeams: async () => [] }));
vi.mock("@/app/(dashboard)/games/sort/actions", () => ({ loadSort: h.sort, checkSort: vi.fn() }));
vi.mock("@/app/(dashboard)/practice/daily/actions", () => ({ dailyMove: h.daily, dailyRest: vi.fn(), nextPractice: vi.fn() }));
vi.mock("@/lib/practice/mse-content", () => ({ loadMseLadderContent: async () => ({ observe: [] }) }));
vi.mock("@/lib/practice/formulation-load", () => ({ loadFormulationCases: vi.fn() }));
vi.mock("@/lib/practice/weak-spots-load", () => ({ loadWeakSpots: async () => null }));
vi.mock("@/app/api/practice/sct/attempt/route", () => ({ POST: h.sct }));
vi.mock("@/app/api/practice/osce/attempt/route", () => ({ POST: h.osce }));
vi.mock("@/app/api/practice/mse/attempt/route", () => ({ POST: vi.fn() }));
vi.mock("@/app/api/practice/formulation/attempt/route", () => ({ POST: vi.fn() }));
vi.mock("@/app/api/practice/clinic/complete/route", () => ({ POST: vi.fn() }));
vi.mock("@/app/api/practice/quiz/attempt/route", () => ({ POST: vi.fn() }));
vi.mock("@/app/api/practice/competency/route", () => ({ POST: vi.fn() }));
vi.mock("@/app/(dashboard)/games/duel/live/route", () => ({ POST: h.duelLive }));
vi.mock("@/lib/leagues/board", () => ({ loadMyLeague: h.league }));
vi.mock("@/lib/learn/leaderboard", () => ({ loadQuizBoard: h.quiz }));
vi.mock("@/lib/standing/board", () => ({ loadMyBoard: h.overall }));
vi.mock("@/lib/cohorts/access", () => ({ loadMyCohorts: h.cohorts }));
vi.mock("@/app/(dashboard)/leaderboard/actions", () => ({ saveAlias: h.saveAlias, buyItem: vi.fn(), wearLook: vi.fn() }));
vi.mock("@/app/(dashboard)/games/comorbid/actions", () => ({ finishComorbid: vi.fn() }));
vi.mock("@/lib/prep/path", () => ({ loadHome: h.home, loadTopicSet: h.topicSet, loadSubject: vi.fn(), loadSmart: vi.fn(), loadList: vi.fn() }));
vi.mock("@/lib/prep/server", () => ({ loadMockHistory: async () => [] }));

import { clearDeviceCache } from "@/lib/app-api/devices";
import { SCENARIOS } from "@/lib/learn/scenarios";
import { KEY } from "@/lib/prep/bank";
import { GET as hub } from "./route";
import { GET as tool } from "./tools/[tool]/route";
import { POST as record } from "./records/[kind]/route";
import { POST as duel } from "./duel/route";
import { POST as play } from "../play/[game]/[action]/route";
import { GET as board } from "../leaderboards/[board]/route";
import { GET as gameBoard } from "../leaderboards/games/[game]/route";
import { GET as prepHome } from "../prep/route";
import { GET as prepTopic } from "../prep/subjects/[subject]/topics/[topic]/route";
import { GET as prepMock } from "../prep/mock/route";
import { GET as longHome } from "../prep/long/route";

const getTool = (t: string) => tool(appReq(`/practise/tools/${t}`), params({ tool: t }));

beforeEach(() => {
  resetGuard();
  clearDeviceCache();
  G.flags = { learn: "unlocked", mse: "unlocked", formulation: "live", judgment: "off", ethics: "unlocked", osce: "unlocked", landmark: "unlocked", two_minute_clinic: "unlocked", consulting_room: "unlocked" };
  for (const f of Object.values(h)) f.mockClear();
});

describe("GET /practise", () => {
  it("the website's hubs: tools gated by flag (off hidden, live locked), games, prep, boards", async () => {
    const r = await read(await hub(appReq("/practise"), noParams));
    const ids = r.data.cases.map((x: { id: string }) => x.id);
    expect(ids).toContain("daily");
    expect(ids).not.toContain("judgment");
    expect(r.data.cases.find((x: { id: string }) => x.id === "formulation")).toMatchObject({ locked: true, play: "native" });
    expect(r.data.cases.find((x: { id: string }) => x.id === "daily")).toMatchObject({ trailing: "Done today", target: { screen: "practice", tool: "daily" } });
    expect(r.data.cases.find((x: { title: string }) => x.title === "AI patient interview")).toMatchObject({ play: "web" });
    expect(r.data.games.map((x: { id: string }) => x.id)).toEqual(expect.arrayContaining(["blitz", "sort", "duel", "comorbid"]));
    expect(r.data.prep[0]).toMatchObject({ id: "prep" });
    expect(r.data.resume).toMatchObject({ title: "Mental state exam" });
    expect(r.data.newCases.practice).toBe("120+ new cases");
  });

  it("switched-off sections drop out; lectures-only accounts cannot open Practise or any game", async () => {
    G.blocks = ["games"];
    expect((await read(await hub(appReq("/practise"), noParams))).data.games).toEqual([]);
    G.blocks = [];
    G.db.tables.profiles[0] = profileRow({ scope: "lectures_only" });
    expect((await read(await hub(appReq("/practise"), noParams))).error?.code).toBe("scope");
    expect((await read(await getTool("blitz"))).error?.code).toBe("scope");
    expect((await read(await play(appReq("/play/blitz/start", { body: { args: [] } }), params({ game: "blitz", action: "start" })))).error?.code).toBe("scope");
    expect((await read(await prepHome(appReq("/prep"), noParams))).error?.code).toBe("scope");
    expect((await read(await board(appReq("/leaderboards/quiz"), params({ board: "quiz" })))).error?.code).toBe("scope");
  });
});

describe("GET /practise/tools/:tool", () => {
  it("a game's first screen, with its moves", async () => {
    const r = await read(await getTool("blitz"));
    expect(r.data).toMatchObject({ tool: "blitz", title: "Blitz", data: { bests: { best: 9 } }, moves: ["blitz.start", "blitz.answer", "blitz.finish"] });
    expect(h.bests).toHaveBeenCalledWith(STUDENT_ID);
    expect((await read(await getTool("sort"))).data.data.initial).toEqual({ ok: true, view: { board: "x" } });
    expect((await read(await getTool("rx"))).data.data.modes).toContain("mixed");
  });

  it("the MSE trainer sends its levels and the small things walk", async () => {
    G.flags.mse = "unlocked";
    const r = await read(await getTool("mse"));
    expect(r.data.data.content).toEqual({ observe: [] });
    expect(r.data.data.smallThings.length).toBeGreaterThan(10);
    expect(r.data.data.smallThings[0]).toMatchObject({ id: "st-1", moment: expect.any(String), read: expect.any(String), move: expect.any(String) });
  });

  it("a case library comes with Done, New, This week and half-way", async () => {
    const r = await read(await getTool("wwyd"));
    expect(r.data.cases.items).toHaveLength(new Set(SCENARIOS.map((s) => s.id)).size);
    expect(r.data.cases.items.every((x: { mark: string }) => ["started", "week", "new", "done"].includes(x.mark))).toBe(true);
    expect(r.data.cases.fresh).toBeGreaterThan(0);
  });

  it("each tool keeps its own website gate; unknown tools are not found", async () => {
    expect((await read(await getTool("judgment"))).error?.code).toBe("feature_off");
    G.flags.formulation = "live";
    expect((await read(await getTool("formulation"))).error?.code).toBe("feature_locked");
    G.blocks = ["tool:ethics"];
    expect((await read(await getTool("ethics"))).error?.code).toBe("access_block");
    expect((await read(await getTool("nope"))).status).toBe(404);
    expect((await read(await getTool("constructor"))).status).toBe(404);
  });

  it("other students' account ids never leave the server on the game's board", async () => {
    const r = await read(await gameBoard(appReq("/leaderboards/games/rx"), params({ game: "rx" })));
    expect(r.data.rows[0]).toMatchObject({ rank: 1, name: "Ravi K.", points: 90 });
    expect(JSON.stringify(r.data)).not.toContain("other-id");
    expect((await read(await gameBoard(appReq("/leaderboards/games/blitz"), params({ game: "blitz" })))).status).toBe(404);
  });
});

describe("records, duel, moves", () => {
  it("records go through the website's own route; its answer and its errors come back", async () => {
    const r = await read(await record(appReq("/practise/records/judgment", { body: { item_id: "x", response: 1 } }), params({ kind: "judgment" })));
    expect(r.data).toEqual({ ok: true, scored: 0.8 });
    const req = (h.sct.mock.calls[0] as unknown as [Request])[0];
    expect(await req.json()).toEqual({ item_id: "x", response: 1 });
    expect((await read(await record(appReq("/practise/records/osce", { body: {} }), params({ kind: "osce" })))).error).toMatchObject({ code: "feature_locked", message: "This isn't live yet." });
    expect((await read(await record(appReq("/practise/records/nope", { body: {} }), params({ kind: "nope" })))).status).toBe(404);
  });

  it("the duel's live door, behind the duel's gate", async () => {
    expect((await read(await duel(appReq("/practise/duel", { body: { op: "bot" } }), noParams))).data).toEqual({ kind: "match", view: { round: 0 } });
    expect((await read(await duel(appReq("/practise/duel", { body: { op: "cheat" } }), noParams))).status).toBe(400);
    G.flags.learn = "off";
    expect((await read(await duel(appReq("/practise/duel", { body: { op: "bot" } }), noParams))).error?.code).toBe("feature_off");
  });

  it("comorbid's state is replayed on the server from the seed; the league's alias is the website action", async () => {
    const setup = { seed: "seed-1234", mode: "bot", level: 1, moves: [] };
    const r = await read(await play(appReq("/play/comorbid/state", { body: { args: [setup] } }), params({ game: "comorbid", action: "state" })));
    expect(r.data.kind).toBe("comorbid.state");
    expect(r.data.data.game.seed).toBe("seed-1234");
    expect((await read(await play(appReq("/play/comorbid/state", { body: { args: [{ seed: "x" }] } }), params({ game: "comorbid", action: "state" })))).status).toBe(400);
    expect((await read(await play(appReq("/play/league/alias", { body: { args: ["Ash"] } }), params({ game: "league", action: "alias" })))).data.data).toEqual({ error: null, alias: "Ash" });
  });
});

describe("leaderboards and Exam Prep", () => {
  it("quiz board with the cohort line", async () => {
    const r = await read(await board(appReq("/leaderboards/quiz"), params({ board: "quiz" })));
    expect(r.data).toMatchObject({ board: "quiz", scope: expect.stringContaining("Cohort Two"), me: { rank: 1, total: 6 } });
    expect(r.data.rows[0]).toMatchObject({ name: "Asha R.", points: 40, me: true });
    expect((await read(await board(appReq("/leaderboards/nope"), params({ board: "nope" })))).status).toBe(404);
  });

  it("a question set goes out without answers or explanations", async () => {
    const q = [...KEY.values()][0];
    h.topicSet.mockResolvedValue({ title: "T", sets: [{ n: 1, href: "/prep/x/y?set=1", stats: { total: 1, answered: 0, right: 0, pct: null } }], set: 0, ids: [q.id], start: 0, prior: {}, saved: [], canSave: true });
    const r = await read(await prepTopic(appReq(`/prep/subjects/${q.subject}/topics/${q.topic}`), params({ subject: q.subject, topic: q.topic })));
    expect(r.data.questions[0].id).toBe(q.id);
    const text = JSON.stringify(r.data.questions);
    expect(text).not.toMatch(/"answer"|"explanation"|"correct"/);
    expect((await read(await prepTopic(appReq("/prep/subjects/nope/topics/x"), params({ subject: "nope", topic: "x" })))).status).toBe(404);
  });

  it("home, mocks and long answers", async () => {
    h.home.mockResolvedValue({ resume: null, subjects: [{ subject: "general", title: "General", optional: false, stats: { total: 10, answered: 2, right: 1, pct: 50 } }], saved: 0, wrong: 1, canSave: true });
    const r = await read(await prepHome(appReq("/prep"), noParams));
    expect(r.data.subjects[0]).toMatchObject({ id: "general", questions: 10, done: 2, best: 50 });
    expect(r.data.more.map((x: { id: string }) => x.id)).toEqual(["smart", "mock", "interview", "saved", "long"]);
    const m = await read(await prepMock(appReq("/prep/mock"), noParams));
    expect(m.data.specs.length).toBeGreaterThan(0);
    expect(m.data.specs[0]).not.toHaveProperty("source");
    expect((await read(await longHome(appReq("/prep/long"), noParams))).data.level).toBe("home");
  });
});
