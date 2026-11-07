import "server-only";
/**
 * Teams in the database (games2_teams / games2_team_members). Service-role
 * reads and writes; the caller checks who is asking. If the tables are
 * missing, everything returns null/empty and the games fall back to solo.
 */
import { displayName } from "@/lib/learn/leaderboard";
import { hashString, makeRng } from "../common";
import { TEAM_LIMITS, teamCode, teamName } from "../teams";
import { adminDb } from "./results";

export type TeamGame = keyof typeof TEAM_LIMITS;
export type TeamRow = {
  id: string;
  game: TeamGame;
  scenario: string;
  code: string;
  name: string;
  created_by: string;
  status: "lobby" | "playing" | "done";
  state: Record<string, unknown>;
  version: number;
  started_at: string | null;
  finished_at: string | null;
  created_at: string;
};
export type Member = { user_id: string; name: string; joined_at: string };

const COLS = "id, game, scenario, code, name, created_by, status, state, version, started_at, finished_at, created_at";

export async function teamsReady(): Promise<boolean> {
  const db = adminDb();
  if (!db) return false;
  try {
    const { error } = await db.from("games2_teams").select("id").limit(1);
    return !error;
  } catch {
    return false;
  }
}

export async function myName(userId: string): Promise<string> {
  const db = adminDb();
  if (!db) return "Player";
  try {
    const { data } = await db.from("profiles").select("name, email").eq("id", userId).maybeSingle();
    return data ? displayName(data.name as string | null, String(data.email ?? "")) : "Player";
  } catch {
    return "Player";
  }
}

export async function createTeam(game: TeamGame, scenario: string, userId: string, state: Record<string, unknown>): Promise<TeamRow | null> {
  const db = adminDb();
  if (!db) return null;
  const name = await myName(userId);
  for (let attempt = 0; attempt < 4; attempt++) {
    const rng = makeRng(hashString(`${userId}:${scenario}:${new Date().toISOString()}:${attempt}`));
    try {
      const { data, error } = await db
        .from("games2_teams")
        .insert({ game, scenario, code: teamCode(rng), name: teamName(rng), created_by: userId, state, status: game === "ward" ? "playing" : "lobby", started_at: game === "ward" ? new Date().toISOString() : null })
        .select(COLS)
        .single();
      if (error || !data) continue;
      await db.from("games2_team_members").insert({ team_id: data.id, user_id: userId, name });
      return data as TeamRow;
    } catch {
      /* code clash or table missing: retry */
    }
  }
  return null;
}

export async function loadTeam(teamId: string): Promise<{ team: TeamRow; members: Member[] } | null> {
  const db = adminDb();
  if (!db) return null;
  try {
    const [{ data: team, error }, { data: members }] = await Promise.all([
      db.from("games2_teams").select(COLS).eq("id", teamId).maybeSingle(),
      db.from("games2_team_members").select("user_id, name, joined_at").eq("team_id", teamId).order("joined_at"),
    ]);
    if (error || !team) return null;
    return { team: team as TeamRow, members: (members ?? []) as Member[] };
  } catch {
    return null;
  }
}

/** Load a team only if `userId` is in it. */
export async function loadMyTeam(teamId: string, userId: string) {
  const t = await loadTeam(teamId);
  return t && t.members.some((m) => m.user_id === userId) ? t : null;
}

export type JoinResult = { ok: true; teamId: string } | { ok: false; reason: string };

export async function joinTeam(game: TeamGame, code: string, userId: string): Promise<JoinResult> {
  const db = adminDb();
  if (!db) return { ok: false, reason: "Team play isn't switched on yet." };
  try {
    const { data: team } = await db.from("games2_teams").select(COLS).eq("code", code).eq("game", game).maybeSingle();
    if (!team) return { ok: false, reason: "No team with that code." };
    const t = team as TeamRow;
    const { data: members } = await db.from("games2_team_members").select("user_id").eq("team_id", t.id);
    const list = (members ?? []) as { user_id: string }[];
    if (list.some((m) => m.user_id === userId)) return { ok: true, teamId: t.id };
    if (t.status === "done") return { ok: false, reason: "That game has finished." };
    if (game === "escape" && t.status !== "lobby") return { ok: false, reason: "That team has already started the clock." };
    if (list.length >= TEAM_LIMITS[game].max) return { ok: false, reason: `That team is full (${TEAM_LIMITS[game].max} players).` };
    const { error } = await db.from("games2_team_members").insert({ team_id: t.id, user_id: userId, name: await myName(userId) });
    return error ? { ok: false, reason: "Couldn't join. Try again." } : { ok: true, teamId: t.id };
  } catch {
    return { ok: false, reason: "Couldn't join. Try again." };
  }
}

/** Compare-and-set: writes only if nobody else changed the team since `version`. */
export async function updateTeam(teamId: string, version: number, patch: Partial<Pick<TeamRow, "state" | "status" | "started_at" | "finished_at">>): Promise<TeamRow | null> {
  const db = adminDb();
  if (!db) return null;
  try {
    const { data, error } = await db
      .from("games2_teams")
      .update({ ...patch, version: version + 1, updated_at: new Date().toISOString() })
      .eq("id", teamId)
      .eq("version", version)
      .select(COLS)
      .maybeSingle();
    return error || !data ? null : (data as TeamRow);
  } catch {
    return null;
  }
}

/** Teams this person is in for a game (newest first). */
export async function myTeams(game: TeamGame, userId: string, limit = 10): Promise<TeamRow[]> {
  const db = adminDb();
  if (!db) return [];
  try {
    const { data: mem } = await db.from("games2_team_members").select("team_id").eq("user_id", userId).limit(200);
    const ids = (mem ?? []).map((m) => m.team_id as string);
    if (!ids.length) return [];
    const { data } = await db.from("games2_teams").select(COLS).in("id", ids).eq("game", game).order("created_at", { ascending: false }).limit(limit);
    return (data ?? []) as TeamRow[];
  } catch {
    return [];
  }
}

/** Other teams racing the same scenario recently (for the race board). */
export async function rivalTeams(game: TeamGame, scenario: string, sinceIso: string, limit = 20): Promise<TeamRow[]> {
  const db = adminDb();
  if (!db) return [];
  try {
    const { data } = await db.from("games2_teams").select(COLS).eq("game", game).eq("scenario", scenario).neq("status", "lobby").gte("created_at", sinceIso).order("created_at", { ascending: false }).limit(limit);
    return (data ?? []) as TeamRow[];
  } catch {
    return [];
  }
}
