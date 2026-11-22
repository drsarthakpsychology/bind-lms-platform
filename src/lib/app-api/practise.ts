import "server-only";
import type { Profile } from "@/lib/auth/session";
import type { ApiGate } from "@/lib/auth/api-guard";
import type { FeatureKey } from "@/lib/flags";
import { caseContext, type CaseContext } from "@/lib/cases/server";
import { arrangeCases, RECYCLE_LINE } from "@/lib/cases/fresh";
import { mergeProgress, startedIds, type ProgressTool } from "@/lib/cases/progress";
import { fromRows, seededRng, type HistoryTool } from "@/lib/history/order";
import { progressSnapshot } from "@/lib/cases/progress-server";
import { loadBests } from "@/lib/games/blitz/server";
import { profile as duelProfile, offlineRounds } from "@/lib/games/duel/server";
import { RULES as COMORBID_RULES } from "@/lib/games-sims/comorbid/game";
import { RX_MODES } from "@/lib/games-sims/rx/rules";
import { loadAccuracyBoard } from "@/lib/games-sims/server/results";
import { myTeams, teamsReady } from "@/lib/games-sims/server/teams";
import { CAMPAIGNS } from "@/lib/games-sims/ward/campaigns";
import { campaignCards } from "@/lib/games-sims/ward/deal";
import { ROOMS, roomById } from "@/lib/games-sims/escape/rooms";
import { roomCards } from "@/lib/games-sims/escape/deal";
import { CLINICS, randomClinicStart } from "@/lib/practice/clinic";
import { SMALL_THINGS } from "@/lib/mse/small-things";
import { SCENARIOS, WORDS } from "@/lib/learn/scenarios";
import { ALL_TERMS } from "@/lib/learn/notes";
import { SAY_IT } from "@/lib/decode/say-it";
import { ALL_SEED_SCT_ITEMS } from "@/lib/practice/sct";
import { todaysDilemmas } from "@/lib/practice/ethics";
import { ETHICS_QUIZ } from "@/lib/practice/ethics-quiz";
import { OUT_OF_DEPTH_SCENARIOS } from "@/lib/out-of-depth/scenarios";
import { LANDMARK_CASES } from "@/lib/landmark/cases";
import { SEED_OSCE_STATIONS } from "@/lib/practice/osce";
import { QUIZ_BANK } from "@/lib/quiz/quiz-bank";
import { loadMseLadderContent } from "@/lib/practice/mse-content";
import { loadFormulationCases } from "@/lib/practice/formulation-load";
import { loadWeakSpots } from "@/lib/practice/weak-spots-load";
import { loadSort } from "@/app/(dashboard)/games/sort/actions";
import { dailyMove } from "@/app/(dashboard)/practice/daily/actions";
import type { CaseLibrary, PractiseRecordKind, PractiseTool, PractiseToolId } from "./contract-practise-admin";

/**
 * Practise for the app: the Practise tab (the website's Practice and Games
 * hubs) and each tool's first screen, built from the same functions and the
 * same data the website's pages give their games. Moves are made through
 * POST /play/:game/:action (src/lib/app-api/play.ts), finished practice
 * records through POST /practise/records/:kind, study points through the
 * study state routes (clamped on the server).
 */

export { TOOL_OF_HREF, practiseHub } from "./practise-hub";

// ------------------------------------------------------------ case libraries

/** Done, New, This week and half-way for one library (the website's caseContext and arrangeCases). */
export function caseLibrary<T>(items: readonly T[], idOf: (t: T) => string, ctx: CaseContext, opts: { shuffle?: boolean } = {}): CaseLibrary {
  const arranged = arrangeCases(items, idOf, {
    history: fromRows(ctx.history),
    now: ctx.now,
    student: ctx.student,
    started: startedIds(mergeProgress(ctx.progress.rows, [])),
    ...(opts.shuffle ? { rng: seededRng(ctx.now) } : {}),
  });
  return {
    items: arranged.list.map((x) => ({ id: x.id, mark: x.mark })),
    recycled: arranged.recycled,
    fresh: arranged.fresh,
    progress: ctx.progress.rows.map((r) => ({ item: r.item, state: r.state, at: r.at })),
    recycleLine: arranged.recycled ? RECYCLE_LINE : null,
  };
}

async function library<T>(tool: HistoryTool, items: readonly T[], idOf: (t: T) => string, progress: ProgressTool | undefined, userId: string, opts: { shuffle?: boolean } = {}): Promise<CaseLibrary> {
  return caseLibrary(items, idOf, await caseContext(tool, items.map(idOf), progress, userId), opts);
}

// ------------------------------------------------------------------ tools

type Loaded = { data: Record<string, unknown>; cases?: CaseLibrary | null };
type ToolDef = {
  gate: ApiGate;
  title: string;
  howTo: string[];
  moves: string[];
  records?: PractiseRecordKind[];
  load: (profile: Profile) => Promise<Loaded>;
};

const learnGate = (path: string): ApiGate => ({ path, flag: "learn" });
const flagGate = (path: string, flag: FeatureKey): ApiGate => ({ path, flag });
/** Study points for the practice tools that pay them on the client: PUT /study/state (clamped on the server). Answers: POST /save kind "answers". */
const LEARN_SAVE = ["study.state", "save.answers"];

export const TOOLS: Record<PractiseToolId, ToolDef> = {
  blitz: {
    gate: learnGate("/games/blitz"),
    title: "Blitz",
    howTo: ["Answer as many as you can before the clock runs out.", "Right answers in a row multiply your points. A wrong answer resets the combo."],
    moves: ["blitz.start", "blitz.answer", "blitz.finish"],
    load: async (p) => ({ data: { bests: await loadBests(p.id) } }),
  },
  sort: {
    gate: learnGate("/games/sort"),
    title: "Criteria sort",
    howTo: ["Tap a tile, then the disorder it belongs to.", "Fill every group, then check. Right groups lock.", "One away means all but one tile in that group is right.", "Advanced: also pick each disorder's time rule."],
    moves: ["sort.load", "sort.check"],
    load: async () => ({ data: { initial: await loadSort({ mode: "daily", tier: "basic" }) } }),
  },
  rx: {
    gate: learnGate("/games/rx"),
    title: "Rx Detective",
    howTo: ["Pick a mode, or play mixed.", "A case under half right costs a life.", "Doses are for learning only."],
    moves: ["rx.deal", "rx.pick", "rx.finish"],
    load: async (p) => ({ data: { modes: RX_MODES, board: await loadAccuracyBoard("rx", p.id) } }),
  },
  "mse-lab": {
    gate: learnGate("/games/mse"),
    title: "MSE Lab",
    howTo: ["For each highlighted phrase, pick the part of the MSE, then the exact word.", "Half marks for the part, half for the word.", "Fully right tags in a row build your streak."],
    moves: ["mse.deal", "mse.tag"],
    load: async (p) => ({ data: { levels: [1, 2, 3], board: await loadAccuracyBoard("mse", p.id) } }),
  },
  ward: {
    gate: learnGate("/games/ward"),
    title: "Ward Week",
    howTo: ["Read each session, then make the call.", "See why it was strong or weak.", "Team mode: classmates vote, and matching votes move the story on."],
    moves: ["ward.start", "ward.resume", "ward.pick", "ward.createTeam", "ward.joinTeam", "ward.teamView", "ward.vote", "cases.mark"],
    load: async (p) => {
      const [ready, teams, cases] = await Promise.all([teamsReady(), myTeams("ward", p.id), library("ward", CAMPAIGNS, (c) => c.id, "ward", p.id)]);
      return { data: { campaigns: campaignCards(), teamsOn: ready, teams: teams.map((t) => ({ id: t.id, name: t.name, campaign: t.scenario, status: t.status, code: t.code })) }, cases };
    },
  },
  escape: {
    gate: learnGate("/games/escape"),
    title: "Team Escape Room",
    howTo: ["Start a team and share the code, or practise alone.", "Anyone can answer any door. Wrong answers add 20 seconds.", "Two misses on a door open its hint.", "The fastest team this week tops the race."],
    moves: ["escape.start", "escape.resume", "escape.answer", "escape.createTeam", "escape.joinTeam", "escape.view", "escape.startTeam", "escape.answerTeam", "cases.mark"],
    load: async (p) => {
      const [ready, teams, cases] = await Promise.all([teamsReady(), myTeams("escape", p.id), library("escape", ROOMS, (r) => r.id, "escape", p.id)]);
      return { data: { rooms: roomCards(), teamsOn: ready, teams: teams.filter((t) => t.status !== "done").map((t) => ({ id: t.id, name: t.name, room: t.scenario, title: roomById(t.scenario)?.title ?? t.scenario, status: t.status })) }, cases };
    },
  },
  duel: {
    gate: learnGate("/games/duel"),
    title: "Differential duel",
    howTo: ["Pick the diagnosis: +100.", "Then pick what tells it apart from its look-alike: +50.", "Same points? The faster player wins.", "The bot is practice. Matches with classmates move your rating."],
    moves: ["duel.live"],
    load: async (p) => {
      const prof = await duelProfile(p.id);
      return { data: { profile: prof, offlineItems: prof.available ? null : offlineRounds() } };
    },
  },
  comorbid: {
    gate: learnGate("/games/comorbid"),
    title: "Comorbid",
    howTo: COMORBID_RULES,
    moves: ["comorbid.state", "comorbid.finish"],
    load: async (p) => ({ data: { rules: COMORBID_RULES, board: await loadAccuracyBoard("comorbid", p.id) } }),
  },
  daily: {
    gate: learnGate("/practice/daily"),
    title: "Daily case",
    howTo: ["Name the diagnosis.", "Open clues or order tests if you need them. Fewer clues, more points."],
    moves: ["daily.rest", "daily.move", "daily.next"],
    load: async () => ({ data: { initial: await dailyMove({ mode: "daily" }) } }),
  },
  detective: {
    gate: learnGate("/practice/detective"),
    title: "Clinic detective",
    howTo: ["Guess, or open another clue.", "Fewer clues, more points. Wrong guesses cost points."],
    moves: ["detective.deal", "detective.clue", "detective.clues", "detective.guess", "detective.hint", "cases.mark"],
    load: async (p) => ({ data: { families: ["mixed", "disorder", "drug"], progress: await progressSnapshot(p.id, "detective") } }),
  },
  "two-minute": {
    gate: flagGate("/practice/two-minute-clinic", "two_minute_clinic"),
    title: "Two-minute clinic",
    howTo: ["Read the line, then start the clock.", "Type your top diagnoses and the one question you would ask next."],
    moves: ["cases.mark", ...LEARN_SAVE],
    records: ["clinic"],
    load: async (p) => ({ data: { start: randomClinicStart(), clinics: CLINICS }, cases: await library("two-minute", CLINICS, (c) => c.id, "two-minute", p.id, { shuffle: true }) }),
  },
  wwyd: {
    gate: learnGate("/practice/scenarios"),
    title: "What would you do?",
    howTo: ["Read what the patient says, then pick your response."],
    moves: ["cases.mark", ...LEARN_SAVE],
    load: async (p) => ({ data: { scenarios: SCENARIOS, words: WORDS }, cases: await library("wwyd", SCENARIOS, (x) => x.id, "wwyd", p.id) }),
  },
  terms: {
    gate: learnGate("/practice/terms"),
    title: "Say it clinically",
    howTo: ["Pick the clinical term for the everyday phrase."],
    moves: LEARN_SAVE,
    load: async () => ({ data: { terms: ALL_TERMS, sayIt: SAY_IT } }),
  },
  judgment: {
    gate: flagGate("/practice/judgment", "judgment"),
    title: "Judgment calls",
    howTo: ["Say whether each new fact makes the diagnosis more or less likely."],
    moves: [],
    records: ["judgment", "competency"],
    load: async () => ({ data: { items: ALL_SEED_SCT_ITEMS.slice(0, 5) } }),
  },
  ethics: {
    gate: flagGate("/practice/ethics", "ethics"),
    title: "Ethics, law & referral",
    howTo: ["Read the dilemma and decide.", "Then see what happens and what the law says."],
    moves: [],
    records: ["quiz"],
    load: async () => ({ data: { dilemmas: todaysDilemmas(Date.now(), 3), quiz: ETHICS_QUIZ } }),
  },
  "out-of-depth": {
    gate: flagGate("/practice/out-of-depth", "ethics"),
    title: "Know when to refer",
    howTo: [],
    moves: [],
    load: async () => ({ data: { scenarios: OUT_OF_DEPTH_SCENARIOS } }),
  },
  landmark: {
    gate: flagGate("/practice/landmark", "landmark"),
    title: "Landmark cases",
    howTo: ["Read what was believed, then what held up."],
    moves: ["cases.mark", "save.answers"],
    load: async (p) => ({ data: { cases: LANDMARK_CASES }, cases: await library("landmark", LANDMARK_CASES, (c) => c.id, "landmark", p.id) }),
  },
  osce: {
    gate: flagGate("/practice/osce", "osce"),
    title: "OSCE stations",
    howTo: ["One task against the clock, like the real exam.", "Voice works best."],
    moves: ["cases.mark", "save.answers"],
    records: ["osce", "competency", "quiz"],
    load: async (p) => ({ data: { stations: SEED_OSCE_STATIONS, quiz: QUIZ_BANK.slice(6, 12) }, cases: await library("osce", SEED_OSCE_STATIONS, (s) => s.id, "osce", p.id) }),
  },
  mse: {
    gate: flagGate("/practice/mse", "mse"),
    title: "Mental state exam",
    howTo: ["Write what you can see and hear, not what you conclude."],
    moves: ["cases.mark", "save.answers"],
    records: ["mse"],
    // The small things walk: the moments themselves (static, no answers to hide; the read shows after a tap, as on the website).
    load: async () => ({ data: { content: await loadMseLadderContent(), smallThings: SMALL_THINGS } }),
  },
  formulation: {
    gate: flagGate("/practice/formulation", "formulation"),
    title: "Build the formulation",
    howTo: ["Sort the factors into the 5 Ps.", "Write the story in your own words.", "Compare with the answer."],
    moves: ["cases.mark", "save.answers"],
    records: ["formulation"],
    load: async () => {
      const { all, ctx, arranged } = await loadFormulationCases();
      return { data: { cases: all }, cases: { ...caseLibrary(all, (c) => c.id, ctx), items: arranged.list.map((x) => ({ id: x.id, mark: x.mark })) } };
    },
  },
  "weak-spots": {
    gate: flagGate("/practice/weak-spots", "weak_spots"),
    title: "Weak spots",
    howTo: ["The skills you miss most, with a drill made from them."],
    moves: ["save.answers"],
    load: async () => ({ data: (await loadWeakSpots()) ?? { spots: [], drill: [], sessions: 0 } }),
  },
};

export const isToolId = (x: string): x is PractiseToolId => Object.hasOwn(TOOLS, x);

export async function practiseTool(id: PractiseToolId, profile: Profile): Promise<PractiseTool> {
  const t = TOOLS[id];
  const { data, cases } = await t.load(profile);
  return { v: 1, tool: id, title: t.title, howTo: t.howTo, data, cases: cases ?? null, moves: t.moves, records: t.records ?? [] };
}
