import "server-only";
/**
 * The case libraries behind the Practice and Games hubs, for the hubs'
 * "new cases" line (shown only when the number is large, see hubNewLabel).
 */
import { CASES as DETECTIVE } from "@/lib/learn/detective";
import { SCENARIOS } from "@/lib/learn/scenarios";
import { CLINICS } from "@/lib/practice/clinic";
import { SEED_OSCE_STATIONS } from "@/lib/practice/osce";
import { FORMULATION_CASES } from "@/lib/practice/formulation-cases";
import { LANDMARK_CASES } from "@/lib/landmark/cases";
import { OBSERVE_STIMULI } from "@/lib/practice/mse-observe-stimuli";
import { FULL_MSE_STIMULI } from "@/lib/mse/mse4-stimuli";
import { CAMPAIGNS } from "@/lib/games-sims/ward/campaigns";
import { ROOMS } from "@/lib/games-sims/escape/rooms";
import { EXCERPTS } from "@/lib/games-sims/mse/excerpts";
import type { HistoryTool } from "@/lib/history/order";
import { hubNewLabel } from "./fresh";
import { newCasesIn, newCasesInGroups } from "./server";

type Library = { tool: HistoryTool; ids: readonly string[] };

const PRACTICE: Library[] = [
  { tool: "detective", ids: DETECTIVE.map((c) => c.answer) },
  { tool: "wwyd", ids: SCENARIOS.map((x) => x.id) },
  { tool: "two-minute", ids: CLINICS.map((x) => x.id) },
  { tool: "osce", ids: SEED_OSCE_STATIONS.map((x) => x.id) },
  { tool: "formulation", ids: FORMULATION_CASES.map((x) => x.id) },
  { tool: "landmark", ids: LANDMARK_CASES.map((x) => x.id) },
  { tool: "mse-trainer", ids: [...OBSERVE_STIMULI, ...FULL_MSE_STIMULI].map((x) => x.id) },
];

const GAMES: Library[] = [
  { tool: "ward", ids: CAMPAIGNS.map((x) => x.id) },
  { tool: "escape", ids: ROOMS.map((x) => x.id) },
  { tool: "mse-lab", ids: EXCERPTS.map((x) => x.id) },
];

/** The hub line ("120+ new cases"), or null when it would be a small number or nobody is signed in. */
export async function hubNewCases(userId: string | null | undefined, hub: "practice" | "games"): Promise<string | null> {
  if (!userId) return null;
  try {
    return hubNewLabel(await newCasesIn(userId, hub === "practice" ? PRACTICE : GAMES));
  } catch {
    return null;
  }
}

/** Both hub lines from one read (the app's Practise tab shows both). `games: false` skips the games line. */
export async function hubNewCasesBoth(userId: string | null | undefined, opts: { games: boolean }): Promise<{ practice: string | null; games: string | null }> {
  if (!userId) return { practice: null, games: null };
  try {
    const [practice, games] = await newCasesInGroups(userId, opts.games ? [PRACTICE, GAMES] : [PRACTICE]);
    return { practice: hubNewLabel(practice), games: opts.games ? hubNewLabel(games) : null };
  } catch {
    return { practice: null, games: null };
  }
}
