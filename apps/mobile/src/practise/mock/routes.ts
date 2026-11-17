/*
 * The mock server's Practise reads (mock builds only), in the server's own
 * shapes (src/practise/contract.ts): the hub, each tool's first screen,
 * Exam Prep, long answers and the boards. Content is sampled from the
 * website (scratchpad extract.ts), so the screens draw real cases.
 */
import type { AppTarget } from "@/api/contract";
import type * as C from "../contract";
import { caseState, mockHistory, MOCK_SPECS, prepData } from "./cases";
import { escapeRooms, escapeSaved, teamsOf, wardCampaigns, wardSaved } from "./games";
import { PlayError } from "./kit";
import tools from "./tools.json";
import more from "./tools2.json";

const T = tools as any;
const M = more as any;
const practice = (tool: string | null, web: string): AppTarget => ({ screen: "practice", tool, web });
const game = (g: string, web: string): AppTarget => ({ screen: "game", game: g, web });
const row = (id: string, title: string, meta: string, kind: C.PractiseRow["kind"], target: AppTarget, extra: Partial<C.PractiseRow> = {}): C.PractiseRow => ({ id, title, meta, kind, target, trailing: null, locked: false, play: "native", ...extra });

export function hub(): C.PractiseHubData {
  const { doneItems } = caseState;
  return {
    v: 1,
    cases: [
      row("daily", "Case of the day", "One new patient a day. Name it in as few clues as you can.", "case", practice("daily", "/practice/daily"), { trailing: doneItems.has("daily:today") ? "Done today" : null }),
      row("detective", "Clinic detective", "Name the disorder or medicine from clues.", "case", practice("detective", "/practice/detective")),
      row("wwyd", "What would you do?", "Tricky patient moments, real consequences.", "case", practice("scenarios", "/practice/scenarios"), { trailing: "In progress" }),
      row("two-minute", "Two-minute clinic", "A patient, two minutes, your differential.", "case", practice("two-minute-clinic", "/practice/two-minute-clinic")),
      row("terms", "Say it clinically", "Everyday words into case-sheet words.", "case", practice("terms", "/practice/terms")),
      row("judgment", "Judgment calls", "New facts change the odds.", "case", practice("judgment", "/practice/judgment")),
      row("mse", "Mental state exam", "Describe what you see before you label it.", "case", practice("mse", "/practice/mse")),
      row("formulation", "Build the formulation", "Sort the 5Ps and see the story of the case.", "case", practice("formulation", "/practice/formulation")),
      row("osce", "OSCE stations", "One task, out loud, against the clock.", "case", practice("osce", "/practice/osce")),
      row("landmark", "Landmark cases", "Famous cases: what was believed, and what held up.", "case", practice("landmark", "/practice/landmark")),
      row("ethics", "Ethics, law & referral", "What to do, then the law behind it.", "case", practice("ethics", "/practice/ethics")),
      row("out-of-depth", "Know when to refer", "Know when a case needs someone else.", "case", practice("out-of-depth", "/practice/out-of-depth")),
      row("weak-spots", "Weak spots", "A short drill on what you miss most.", "case", practice("weak-spots", "/practice/weak-spots")),
      row("consulting-room", "Consulting Room", "Interview a patient out loud.", "case", { screen: "unknown", web: "/practice/consulting-room" }, { play: "web" }),
    ],
    games: [
      row("blitz", "Blitz", "Fast facts against the clock.", "game", game("blitz", "/games/blitz")),
      row("sort", "Criteria sort", "Sort criteria into look-alike disorders.", "game", game("sort", "/games/sort")),
      row("mse-lab", "MSE Lab", "Tag every finding in an interview.", "game", game("mse", "/games/mse")),
      row("ward", "Ward Week", "One patient. Your choices change the ending.", "game", game("ward", "/games/ward")),
      row("rx", "Rx Detective", "Medicines, receptors and risky mixes.", "game", game("rx", "/games/rx")),
      row("duel", "Differential duel", "1v1 on look-alike diagnoses. Live or against the bot.", "game", game("duel", "/games/duel")),
      row("escape", "Team Escape Room", "Race other teams through linked clues.", "game", game("escape", "/games/escape")),
      row("comorbid", "Comorbid", "A card duel. Build a diagnosis; block your rival with rule-outs.", "game", game("comorbid", "/games/comorbid")),
    ],
    prep: [row("prep", "Exam Prep", "Questions with answers and explanations", "prep", practice("prep", "/prep"))],
    boards: [row("league", "League", "Points from everything you practise, this week", "board", { screen: "unknown", web: "/leaderboard" }, { trailing: "This week" }), row("quiz", "Games board", "Your best game scores", "board", { screen: "unknown", web: "/games/leaderboard" }, { trailing: "This week" })],
    newCases: { practice: "120+ new cases", games: null },
    resume: null,
  };
}

/** Done, New, This week and half-way, as caseLibrary does on the server. */
function library(tool: string, ids: string[]): C.CaseLibrary {
  const { doneItems, started } = caseState;
  const items = ids.map((id, i) => ({ id, mark: (doneItems.has(`${tool}:${id}`) ? "done" : i % 3 === 1 ? "week" : "new") as C.CaseMark }));
  items.sort((a, b) => Number(a.mark === "done") - Number(b.mark === "done"));
  const progress = [...started.entries()].filter(([k]) => k.startsWith(`${tool}:`)).map(([k, v]) => ({ item: k.slice(tool.length + 1), state: JSON.parse(v.token) as unknown, at: 0 }));
  if (tool === "ward") progress.push(...wardSaved().map((item) => ({ item, state: { token: "saved" } as unknown, at: 0 })));
  if (tool === "escape") progress.push(...escapeSaved().map(([item, token]) => ({ item, state: { token } as unknown, at: 0 })));
  const fresh = items.filter((x) => x.mark !== "done").length;
  return { items, recycled: fresh === 0, fresh, progress, recycleLine: fresh === 0 ? "You have done every case. They come round again, oldest first." : null };
}

const tool = (id: C.PractiseToolId, title: string, howTo: string[], data: Record<string, unknown>, cases: C.CaseLibrary | null = null, records: C.PractiseRecordKind[] = []): C.PractiseTool => ({ v: 1, tool: id, title, howTo, data, cases, moves: [], records });

export function practiseTool(id: string): C.PractiseTool {
  const ids = (xs: { id: string }[]) => xs.map((x) => x.id);
  switch (id) {
    case "wwyd":
      return tool("wwyd", "What would you do?", ["Read what the patient says, then pick your response."], { scenarios: [...T.wwyd, ...M.wwyd.scenarios.filter((s: { id: string }) => !T.wwyd.some((t: { id: string }) => t.id === s.id))], words: M.wwyd.words }, library("wwyd", ids([...T.wwyd, ...M.wwyd.scenarios])));
    case "terms":
      return tool("terms", "Say it clinically", ["Pick the clinical term for the everyday phrase."], M.terms);
    case "judgment":
      return tool("judgment", "Judgment calls", ["Say whether each new fact makes the diagnosis more or less likely."], M.judgment, null, ["judgment", "competency"]);
    case "ethics":
      return tool("ethics", "Ethics, law & referral", ["Read the dilemma and decide.", "Then see what happens and what the law says."], M.ethics, null, ["quiz"]);
    case "out-of-depth":
      return tool("out-of-depth", "Know when to refer", [], M.outOfDepth);
    case "landmark":
      return tool("landmark", "Landmark cases", ["Read what was believed, then what held up."], M.landmark, library("landmark", ids(M.landmark.cases)));
    case "osce":
      return tool("osce", "OSCE stations", ["One task against the clock, like the real exam.", "Voice works best."], M.osce, library("osce", ids(M.osce.stations)), ["osce", "competency", "quiz"]);
    case "two-minute":
      return tool("two-minute", "Two-minute clinic", ["Read the line, then start the clock.", "Type your top diagnoses and the one question you would ask next."], { start: 0, clinics: M.twoMinute.clinics }, library("two-minute", ids(M.twoMinute.clinics)), ["clinic"]);
    case "formulation":
      return tool("formulation", "Build the formulation", ["Sort the factors into the 5 Ps.", "Write the story in your own words.", "Compare with the answer."], { cases: T.formulation }, library("formulation", ids(T.formulation)), ["formulation"]);
    case "weak-spots":
      return tool("weak-spots", "Weak spots", ["The skills you miss most, with a drill made from them."], M.weak);
    case "mse":
      return tool("mse", "Mental state exam", ["Write what you can see and hear, not what you conclude."], M.mse, null, ["mse"]);
    case "ward":
      return tool("ward", "Ward Week", ["Read each session, then make the call.", "See why it was strong or weak."], { campaigns: wardCampaigns(), teamsOn: true, teams: teamsOf("ward") }, library("ward", wardCampaigns().map((c) => c.id)));
    case "escape":
      return tool("escape", "Team Escape Room", ["Anyone can answer any door. Wrong answers add 20 seconds.", "Two misses on a door open its hint."], { rooms: escapeRooms(), teamsOn: true, teams: teamsOf("escape").filter((t) => t.status !== "done") }, library("escape", escapeRooms().map((r) => r.id)));
    case "duel":
      return tool("duel", "Differential duel", ["Pick the diagnosis: +100.", "Then pick what tells it apart from its look-alike: +50.", "Same points? The faster player wins."], { profile: { available: false, rating: 1200, rd: 350, tier: "Unranked", games: 0, wins: 0, losses: 0, draws: 0, forfeits: 0, peak: 1200 }, offlineItems: M.duel });
    case "comorbid":
      return tool("comorbid", "Comorbid", ["Build your diagnosis: play symptom cards that belong to it, with at least one core card.", "Block your rival: play a rule-out that could explain their picture. A normal test clears it.", "A card that doesn't fit bounces and you lose the turn. First complete, unblocked diagnosis wins."], { rules: [], board: null });
    default:
      throw new PlayError(404, "not_found", "That could not be found.");
  }
}

/* ------------------------------------------------------------------- prep */

const stat = (qids: string[]): C.PrepStats => ({ total: qids.length, answered: qids.filter((q) => prepData.answered.has(q)).length, right: qids.filter((q) => prepData.answered.get(q)).length });
const SET = 5;
type PQ = { id: string; subject: string; topic: string; type: string; stem: string; passage?: string; statements?: string[]; lists?: unknown; options: string[] };
const view = (q: PQ): C.PrepQuestion => ({ id: q.id, subject: q.subject, topic: q.topic, type: q.type, stem: q.stem, ...(q.passage ? { passage: q.passage } : {}), ...(q.statements ? { statements: q.statements } : {}), ...(q.lists ? { lists: q.lists } : {}), options: q.options });
const saved = new Set<string>();

export function prepHome(): C.PrepHome {
  const wrong = [...prepData.answered.entries()].filter(([, v]) => !v).length;
  return {
    v: 1,
    preview: false,
    resume: null,
    subjects: prepData.SUBJECTS.map((s) => {
      const qids = prepData.PREP.filter((q) => q.subject === s.id).map((q) => q.id);
      const st = stat(qids);
      return { id: s.id, title: s.title, optional: false, questions: st.total, done: st.answered, best: st.answered ? Math.round((st.right / st.answered) * 100) : null, stats: st };
    }),
    saved: saved.size,
    wrong,
    canSave: true,
    more: [row("mock", "Mock tests", "Timed papers with marking", "prep", { screen: "practice", tool: "mock", web: "/prep/mock" })],
  };
}
export function prepMocks(): C.PrepMocks {
  return { v: 1, specs: MOCK_SPECS as unknown as C.PrepMocks["specs"], history: mockHistory.map(({ result: _r, ...h }) => h) as unknown as C.PrepMocks["history"] };
}
export function prepMockResult(id: string): C.PrepMockResult {
  const h = mockHistory.find((x) => x.id === id);
  if (!h) throw new PlayError(404, "not_found", "That could not be found.");
  return { v: 1, id, specId: h.specId, title: h.result.title, result: h.result as unknown as Record<string, unknown> };
}
export function prepSubject(id: string): C.PrepSubjectDetail {
  const s = prepData.SUBJECTS.find((x) => x.id === id);
  const t = prepData.TOPICS.find((x) => x.subject === id);
  if (!s || !t) throw new PlayError(404, "not_found", "That could not be found.");
  return { v: 1, id, title: s.title, stats: stat(t.topics.flatMap((x) => x.ids)), topics: t.topics.map((x) => ({ id: x.id, title: x.title, stats: stat(x.ids) })), long: prepData.LONG.filter((l) => l.subject === id).length };
}
function setOf(title: string, idsAll: string[], n: number, id: string): C.PrepSet {
  const sets = Array.from({ length: Math.max(1, Math.ceil(idsAll.length / SET)) }, (_, k) => ({ n: k + 1, stats: stat(idsAll.slice(k * SET, k * SET + SET)) }));
  const k = Math.min(Math.max(1, n), sets.length);
  const ids = idsAll.slice((k - 1) * SET, k * SET);
  const prior = Object.fromEntries(ids.filter((q) => prepData.answered.has(q)).map((q) => [q, prepData.answered.get(q)!]));
  const start = ids.findIndex((q) => !prepData.answered.has(q));
  return { v: 1, id, title: sets.length > 1 ? `${title} · Set ${k}` : title, sets, set: k, start: start < 0 ? 0 : start, questions: ids.map((q) => view(prepData.PREP.find((x) => x.id === q)!)), prior, saved: [...saved].filter((q) => ids.includes(q)), canSave: true, preview: false, next: null };
}
export function prepTopic(subject: string, topic: string, n: number): C.PrepSet {
  const tp = prepData.TOPICS.find((x) => x.subject === subject)?.topics.find((x) => x.id === topic);
  if (!tp) throw new PlayError(404, "not_found", "That could not be found.");
  const open = tp.ids.findIndex((q) => !prepData.answered.has(q));
  const first = n || (open < 0 ? 1 : 1 + Math.floor(open / SET));
  return setOf(tp.title, tp.ids, first, `${subject}/${topic}`);
}
export function prepSmart(): C.PrepSet {
  const ids = prepData.PREP.filter((q) => !prepData.answered.get(q.id)).slice(0, SET).map((q) => q.id);
  return { ...setOf("Smart practice", ids, 1, "smart"), sets: [] };
}
export function prepList(list: string): C.PrepSet {
  const ids = list === "saved" ? [...saved] : [...prepData.answered.entries()].filter(([, v]) => !v).map(([k]) => k);
  return { ...setOf(list === "saved" ? "Saved questions" : "Practise again", ids.slice(0, SET), 1, list), sets: [], page: { page: 1, pages: 1, total: ids.length } };
}
export const toggleSaved = (id: string, on: boolean) => (on ? saved.add(id) : saved.delete(id));

type Long = { id: string; subject: string; topic: string; marks: number; difficulty: number; question: string; plan: string[]; answer: string; keyPoints: string[]; pitfalls?: string[] };
/** The website's answer text ("## " headings, "- " bullets) as Study blocks. */
function blocks(text: string) {
  const out: ({ t: "h3"; text: string } | { t: "p"; text: string } | { t: "ul"; items: { text: string }[] })[] = [];
  for (const l of text.split("\n").map((x) => x.trim()).filter(Boolean)) {
    if (l.startsWith("## ")) out.push({ t: "h3", text: l.slice(3) });
    else if (l.startsWith("- ")) {
      const last = out[out.length - 1];
      if (last?.t === "ul") last.items.push({ text: l.slice(2) });
      else out.push({ t: "ul", items: [{ text: l.slice(2) }] });
    } else if (!l.startsWith("|")) out.push({ t: "p", text: l });
  }
  return out;
}
export function prepLong(subject?: string, topic?: string, id?: string): C.PrepLong {
  const L = prepData.LONG as Long[];
  const title = (s: string) => prepData.SUBJECTS.find((x) => x.id === s)?.title ?? s;
  if (!subject) return { v: 1, level: "home", data: { subjects: [...new Set(L.map((l) => l.subject))].map((s) => ({ subject: s, title: title(s), count: L.filter((l) => l.subject === s).length })) } };
  const mine = L.filter((l) => l.subject === subject);
  if (!mine.length) throw new PlayError(404, "not_found", "That could not be found.");
  if (!topic) return { v: 1, level: "subject", data: { subject, title: title(subject), topics: [...new Set(mine.map((l) => l.topic))].map((t) => ({ id: t, title: t.replace(/-/g, " ").replace(/^./, (c) => c.toUpperCase()), count: mine.filter((l) => l.topic === t).length })) } };
  const items = mine.filter((l) => l.topic === topic);
  if (!id) return { v: 1, level: "topic", data: { subject, topic, title: topic.replace(/-/g, " ").replace(/^./, (c) => c.toUpperCase()), items: items.map((x) => ({ id: x.id, question: x.question, marks: x.marks, difficulty: x.difficulty })) } };
  const i = items.findIndex((x) => x.id === id);
  if (i < 0) throw new PlayError(404, "not_found", "That could not be found.");
  const it = items[i]!;
  const next = items[i + 1];
  return { v: 1, level: "question", data: { item: { id: it.id, subject: it.subject, topic: it.topic, marks: it.marks, difficulty: it.difficulty, question: it.question, plan: it.plan, blocks: blocks(it.answer), keyPoints: it.keyPoints, pitfalls: it.pitfalls ?? [] }, next: next ? { id: next.id, question: next.question } : null } };
}

/* ----------------------------------------------------------------- boards */

const NAMES = ["Sana K.", "Ananya M.", "Rohan S.", "Meera P.", "Karan D.", "Ishita R.", "Dev P.", "Fatima A.", "Arjun N.", "Neha G."];
export function board(id: string): C.Leaderboard {
  const label: Record<string, string> = { league: "League", quiz: "Games board", overall: "All time", rx: "Rx Detective", mse: "MSE Lab", comorbid: "Comorbid" };
  if (!label[id]) throw new PlayError(404, "not_found", "That could not be found.");
  const pts = NAMES.map((_, i) => 1900 - i * 137 - ((id.length * 31 + i * 17) % 90));
  const rows = NAMES.map((name, i) => ({ rank: i + 1, name, points: pts[i]!, me: name === "Ananya M.", title: null, extra: null }));
  return { v: 1, board: id, label: label[id]!, period: id === "overall" ? "All time" : "This week", explainer: id === "league" ? "Points from everything you practise. Monday to Sunday." : "Your best scores this week.", scope: "Your cohort only. First name and initial.", rows, me: { rank: 2, total: rows.length }, raw: {} };
}

const ADMIN_COHORTS = [
  { id: "c1", name: "Cohort One" },
  { id: "c2", name: "Cohort Two" },
];
const FIRST = ["Aarav", "Ananya", "Diya", "Ishaan", "Kabir", "Meera", "Neha", "Rohan", "Saanvi", "Vihaan", "Zara", "Arjun"];
const LAST = ["Mehta", "Shah", "Patel", "Iyer", "Rao", "Desai"];

/** The admin answer for league, quiz and overall: 72 students in two cohorts, a third of them on 0. Same query as the server. */
export function adminBoard(id: string, q: URLSearchParams): C.Leaderboard {
  const base = board(id);
  const all = Array.from({ length: 72 }, (_, i) => ({ name: `${FIRST[i % FIRST.length]} ${LAST[Math.floor(i / FIRST.length) % LAST.length]}`, cohort: ADMIN_COHORTS[i % 2]!, points: i % 3 === 2 ? 0 : 2000 - i * 23 }));
  const cohort = ADMIN_COHORTS.some((c) => c.id === q.get("cohort")) ? q.get("cohort") : null;
  const ranked = all.filter((s) => !cohort || s.cohort.id === cohort).sort((a, b) => b.points - a.points || a.name.localeCompare(b.name));
  let rank = 0;
  const withRank = ranked.map((s, i) => ({ ...s, rank: i > 0 && ranked[i - 1]!.points === s.points ? rank : (rank = i + 1) }));
  const needle = (q.get("q") ?? "").trim().toLowerCase();
  const sort = q.get("sort") === "name" ? "name" : q.get("sort") === "cohort" ? "cohort" : "rank";
  const found = withRank.filter((s) => !needle || s.name.toLowerCase().includes(needle)).sort((a, b) => (sort === "name" ? a.name.localeCompare(b.name) : sort === "cohort" ? a.cohort.name.localeCompare(b.cohort.name) || a.rank - b.rank : a.rank - b.rank));
  const size = 50;
  const pages = Math.max(1, Math.ceil(found.length / size));
  const page = Math.min(pages, Math.max(1, Number(q.get("page")) || 1));
  const rows = found.slice((page - 1) * size, page * size).map((s) => ({ rank: s.rank, name: s.name, points: s.points, me: false, title: s.cohort.name, extra: { level: 1, hours: 0, tier: "Neuron", xp: s.points } }));
  return { ...base, scope: `${cohort ? ADMIN_COHORTS.find((c) => c.id === cohort)!.name : "All cohorts"}. Every student, full names.`, rows, me: { rank: null, total: ranked.length }, admin: { page, pages, size, total: ranked.length, matched: found.length, q: needle, cohort, sort, dir: "asc", cohorts: ADMIN_COHORTS } };
}


/* ------------------------------------------------------------------- shop */
const LOOKS = [
  { id: "frame-blue", label: "Blue frame", kind: "frame" as const, cost: 150 },
  { id: "frame-lime", label: "Lime frame", kind: "frame" as const, cost: 150 },
  { id: "frame-ink", label: "Double ink frame", kind: "frame" as const, cost: 300 },
  { id: "title-blue", label: "Blue title", kind: "title" as const, cost: 200 },
  { id: "title-fill", label: "Title on a lime tag", kind: "title" as const, cost: 400 },
];
const ITEMS = [
  { id: "streak_repair", label: "Streak repair", cost: 60, text: "Brings back a streak you lost in the last 2 days. One a week.", ready: true },
  { id: "hints_3", label: "3 extra hints", cost: 30, text: "3 more hints for today. One buy a day.", ready: true },
  { id: "bonus_case", label: "Bonus challenge", cost: 80, text: "One extra hard case this week.", ready: false },
];
export const shopState = { balance: 420, owned: new Set<string>(["frame-blue"]), look: { frame: "frame-blue" as string | null, title: null as string | null }, hints: false };
export function resetShop() {
  shopState.balance = 420;
  shopState.owned = new Set(["frame-blue"]);
  shopState.look = { frame: "frame-blue", title: null };
  shopState.hints = false;
}
export function shop(): C.XpShop {
  return { v: 1, ready: true, balance: shopState.balance, streak: { count: 6, alive: true }, repair: { ok: false, text: "Your streak is still going." }, items: ITEMS, looks: LOOKS.map((l) => ({ ...l, owned: shopState.owned.has(l.id), worn: shopState.look[l.kind] === l.id })), note: "Spending XP never lowers your level or this week's league points." };
}
const lookStr = () => [shopState.look.frame, shopState.look.title].filter(Boolean).join("|") || null;
export const league = {
  buy(item: unknown): C.BuyResult {
    const id = String(item ?? "");
    if (id.startsWith("look:")) {
      const l = LOOKS.find((x) => x.id === id.slice(5));
      if (!l) return { error: "Unknown item." };
      if (shopState.owned.has(l.id)) return { error: "You already own this." };
      if (shopState.balance < l.cost) return { error: `You need ${l.cost - shopState.balance} more XP.` };
      shopState.balance -= l.cost;
      shopState.owned.add(l.id);
      shopState.look[l.kind] = l.id;
      return { error: null, balance: shopState.balance, look: lookStr() };
    }
    const it = ITEMS.find((x) => x.id === id);
    if (!it) return { error: "Unknown item." };
    if (!it.ready) return { error: "Coming soon." };
    if (id === "streak_repair") return { error: "Your streak is still going." };
    if (shopState.hints) return { error: "You've already bought today's hints." };
    if (shopState.balance < it.cost) return { error: `You need ${it.cost - shopState.balance} more XP.` };
    shopState.hints = true;
    shopState.balance -= it.cost;
    return { error: null, balance: shopState.balance };
  },
  wear(kind: unknown, id: unknown): { error: string | null; look?: string | null } {
    if (kind !== "frame" && kind !== "title") return { error: "Unknown item." };
    if (id && !shopState.owned.has(String(id))) return { error: "Buy it first." };
    shopState.look[kind] = id ? String(id) : null;
    return { error: null, look: lookStr() };
  },
  alias: (name: unknown) => ({ error: null, alias: name ? String(name) : null }),
};
