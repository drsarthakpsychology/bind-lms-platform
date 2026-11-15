import type { Metadata } from "next";
import { PlayFrame } from "@/components/play/play-frame";
import { playV2 } from "@/components/play/v2";
import { LearnStoreInit } from "@/components/learn/learn-store-init";
import { loadLearnState, saveLearnState } from "../../study/actions";
import { requireFeature } from "@/lib/flags";
import { currentUser } from "@/lib/games-sims/server/results";
import { myTeams, teamsReady } from "@/lib/games-sims/server/teams";
import { roomById, ROOMS } from "@/lib/games-sims/escape/rooms";
import { roomCards } from "@/lib/games-sims/escape/deal";
import { answerEscape, answerEscapePractice, createEscapeTeam, escapeView, joinEscapeTeam, resumeEscapePractice, startEscapePractice, startEscapeTeam } from "./actions";
import { caseContext } from "@/lib/cases/server";
import { EscapeRoom } from "./escape-room";

export const metadata: Metadata = { title: "Team Escape Room" };

export default async function EscapePage({ searchParams }: { searchParams: Promise<{ team?: string }> }) {
  await requireFeature("learn");
  const learnState = await loadLearnState();
  const [{ team }, user] = await Promise.all([searchParams, currentUser()]);
  const [ready, teams, cases] = await Promise.all([teamsReady(), user ? myTeams("escape", user.id) : Promise.resolve([]), caseContext("escape", ROOMS.map((r) => r.id), "escape", user?.id ?? "")]);
  return (
    <PlayFrame v2={await playV2()} title="Team Escape Room" titleAs="p" tip={{ id: "team-escape-room", intro: "One patient, locked doors.", steps: ["Start a team and share the code, or practise alone.", "Anyone can answer any door. Wrong answers add 20 seconds.", "Two misses on a door open its hint.", "The fastest team this week tops the race."] }}>
      <LearnStoreInit serverState={learnState} save={saveLearnState} />
      <EscapeRoom
        rooms={roomCards()}
        cases={cases}
        teamsOn={ready}
        openTeam={team ?? null}
        teams={teams.filter((t) => t.status !== "done").map((t) => ({ id: t.id, name: t.name, room: t.scenario, title: roomById(t.scenario)?.title ?? t.scenario, status: t.status }))}
        actions={{ createEscapeTeam, joinEscapeTeam, escapeView, startEscapeTeam, answerEscape, startEscapePractice, answerEscapePractice, resumeEscapePractice }}
      />
    </PlayFrame>
  );
}
