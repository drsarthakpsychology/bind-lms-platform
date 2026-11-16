import "server-only";
import type { Profile } from "@/lib/auth/session";
import { readFlags, type FlagStatus } from "@/lib/flags";
import { loadMyBlocks } from "@/lib/access/blocks";
import { blockedBy } from "@/lib/access/features";
import { createClient } from "@/lib/supabase/server";
import { MAIN_TOOLS, MORE_TOOLS, THINK_TOOLS, shownTools, type ShownTool } from "@/components/practice/practice-hub";
import { SOLO, WITH_OTHERS } from "@/components/learn/games-list";
import { BOARDS } from "@/lib/standing/boards";
import { computePracticeStates, type SurfaceState } from "@/lib/practice/practice-state";
import { recentPracticeVisits } from "@/lib/practice/resume";
import { pickResume } from "@/lib/practice/resume-pick";
import { hubNewCasesBoth } from "@/lib/cases/hubs";
import { toAppTarget } from "./target";
import type { PractiseHubData, PractiseRow, PractiseToolId } from "./contract-practise-admin";

/**
 * The app's Practise tab (GET /practise). Kept apart from the tools
 * (./practise.ts) so this route does not load every tool's content on a cold
 * start. Every read starts at once: the flags and the switched-off sections
 * (already read by the guard), the per-tool states, the last practice page
 * and the new-case counts.
 */

/** Web page to app tool id, for the tools the app draws natively. */
export const TOOL_OF_HREF: Record<string, PractiseToolId> = {
  "/practice/daily": "daily",
  "/practice/mse": "mse",
  "/practice/formulation": "formulation",
  "/practice/detective": "detective",
  "/practice/two-minute-clinic": "two-minute",
  "/practice/scenarios": "wwyd",
  "/practice/terms": "terms",
  "/practice/judgment": "judgment",
  "/practice/ethics": "ethics",
  "/practice/out-of-depth": "out-of-depth",
  "/practice/osce": "osce",
  "/practice/landmark": "landmark",
  "/practice/weak-spots": "weak-spots",
  "/games/blitz": "blitz",
  "/games/sort": "sort",
  "/games/mse": "mse-lab",
  "/games/ward": "ward",
  "/games/rx": "rx",
  "/games/duel": "duel",
  "/games/escape": "escape",
  "/games/comorbid": "comorbid",
};

const CHIP: Record<string, string> = { in_progress: "In progress", done_today: "Done today", due: "Due" };

function toolRow(t: ShownTool): PractiseRow {
  const id = TOOL_OF_HREF[t.href] ?? t.href.split("/").filter(Boolean).pop() ?? t.href;
  return { id, title: t.title, meta: t.text, kind: "case", target: toAppTarget(t.href), trailing: t.state?.state ? (CHIP[t.state.state] ?? null) : null, locked: t.locked, play: TOOL_OF_HREF[t.href] ? "native" : "web" };
}

/** GET /practise: the website's two hubs and Exam Prep, gated the same way. */
export async function practiseHub(profile: Profile): Promise<PractiseHubData> {
  const supabase = await createClient();
  const statesP = computePracticeStates(supabase, profile.id).catch(() => ({}) as Record<string, SurfaceState>);
  const visitsP = recentPracticeVisits(profile.id);
  const [flags, blocked] = await Promise.all([readFlags(), profile.role === "student" ? loadMyBlocks(profile.id) : Promise.resolve([] as string[])]);
  const isBlocked = (href: string) => Boolean(blockedBy(href, blocked));
  const learn: FlagStatus | undefined = flags.learn;
  const gamesOpen = (learn === "unlocked" || learn === "live") && !isBlocked("/games");
  const [states, visits, newCases] = await Promise.all([statesP, visitsP, hubNewCasesBoth(profile.id, { games: gamesOpen })]);
  const tools = [...shownTools(MAIN_TOOLS, flags, states, isBlocked), ...shownTools(THINK_TOOLS, flags, states, isBlocked), ...shownTools(MORE_TOOLS, flags, states, isBlocked)];
  const open = tools.filter((t) => !t.locked);
  const game = (g: (typeof SOLO)[number]): PractiseRow => ({ id: TOOL_OF_HREF[g.href] ?? g.href, title: g.title, meta: g.text, kind: "game", target: toAppTarget(g.href), trailing: null, locked: learn !== "unlocked", play: "native" });
  const prepOpen = (learn === "unlocked" || learn === "live") && !isBlocked("/prep");
  const resume = open.length ? pickResume(visits, open.map((t) => ({ href: t.href, title: t.title }))) : null;
  const board = (key: keyof typeof BOARDS, open: boolean): PractiseRow[] => (open ? [{ id: key, title: BOARDS[key].label, meta: BOARDS[key].explainer, kind: "board", target: toAppTarget(BOARDS[key].href), trailing: BOARDS[key].period, locked: false, play: "native" }] : []);
  return {
    v: 1,
    cases: tools.map(toolRow),
    games: gamesOpen ? [...SOLO, ...WITH_OTHERS].map(game) : [],
    prep: prepOpen ? [{ id: "prep", title: "Exam Prep", meta: "Questions with answers and explanations", kind: "prep", target: toAppTarget("/prep"), trailing: null, locked: learn !== "unlocked", play: "native" }] : [],
    boards: [...board("league", !isBlocked("/leaderboard")), ...board("quiz", gamesOpen), ...board("overall", !isBlocked("/leaderboard"))],
    newCases: { practice: newCases.practice, games: gamesOpen ? newCases.games : null },
    resume: resume ? { title: resume.title, target: toAppTarget(resume.href) } : null,
  };
}

