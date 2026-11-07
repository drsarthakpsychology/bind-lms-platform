import type { Metadata } from "next";
import { ActivityFrame } from "@/components/study/activity-frame";
import { ActivityTip } from "@/components/help/activity-tip";
import { LearnStoreInit } from "@/components/learn/learn-store-init";
import { loadLearnState, saveLearnState } from "../../study/actions";
import { requireFeature } from "@/lib/flags";
import { currentUser } from "@/lib/games-sims/server/results";
import { myTeams, teamsReady } from "@/lib/games-sims/server/teams";
import { answerEscape, createEscapeTeam, escapeView, finishEscapePractice, gradeEscapePractice, joinEscapeTeam, startEscapeTeam } from "./actions";
import { EscapeRoom } from "./escape-room";

export const metadata: Metadata = { title: "Team Escape Room" };

export default async function EscapePage({ searchParams }: { searchParams: Promise<{ team?: string }> }) {
  await requireFeature("learn");
  const learnState = await loadLearnState();
  const [{ team }, user] = await Promise.all([searchParams, currentUser()]);
  const [ready, teams] = await Promise.all([teamsReady(), user ? myTeams("escape", user.id) : Promise.resolve([])]);
  return (
    <ActivityFrame
      title="Team Escape Room"
      purpose="A locked ward and one patient. Your team opens each door by solving the next step: mental state, diagnosis, differential, risk, plan and medicine."
      how={["Start a team and share the code (2 to 5 players).", "Anyone can answer any door. Wrong answers add 20 seconds.", "Two misses on a door open its hint.", "Fastest team this week tops the race."]}
    >
      <ActivityTip id="team-escape-room" intro="One patient, seven locked doors." steps={["Start a team and share the code (2 to 5 players), or practise alone.", "Anyone can answer any door. Wrong answers add 20 seconds.", "Two misses on a door open its hint.", "The fastest team this week tops the race."]} />
      <LearnStoreInit serverState={learnState} save={saveLearnState} />
      <EscapeRoom
        teamsOn={ready}
        openTeam={team ?? null}
        teams={teams.filter((t) => t.status !== "done").map((t) => ({ id: t.id, name: t.name, room: t.scenario, status: t.status }))}
        actions={{ createEscapeTeam, joinEscapeTeam, escapeView, startEscapeTeam, answerEscape, gradeEscapePractice, finishEscapePractice }}
      />
    </ActivityFrame>
  );
}
