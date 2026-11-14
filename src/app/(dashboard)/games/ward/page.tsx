import type { Metadata } from "next";
import { ActivityFrame } from "@/components/study/activity-frame";
import { ActivityTip } from "@/components/help/activity-tip";
import { LearnStoreInit } from "@/components/learn/learn-store-init";
import { loadLearnState, saveLearnState } from "../../study/actions";
import { requireFeature } from "@/lib/flags";
import { currentUser } from "@/lib/games-sims/server/results";
import { myTeams, teamsReady } from "@/lib/games-sims/server/teams";
import { castWardVote, createWardTeam, finishWardSolo, joinWardTeam, wardTeamView } from "./actions";
import { WardWeek } from "./ward-week";
import { CAMPAIGNS } from "@/lib/games-sims/ward/campaigns";
import { caseContext } from "@/lib/cases/server";

export const metadata: Metadata = { title: "Ward Week" };

export default async function WardPage({ searchParams }: { searchParams: Promise<{ team?: string }> }) {
  await requireFeature("learn");
  const learnState = await loadLearnState();
  const [{ team }, user] = await Promise.all([searchParams, currentUser()]);
  const [ready, teams, cases] = await Promise.all([teamsReady(), user ? myTeams("ward", user.id) : Promise.resolve([]), caseContext("ward", CAMPAIGNS.map((c) => c.id), "ward", user?.id ?? "")]);
  return (
    <ActivityFrame
      title="Ward Week"
    >
      <ActivityTip id="ward-week" intro="One patient. You are the trainee psychologist." steps={["Read each session, then make the call.", "See why it was strong or weak.", "Team mode: classmates vote, and matching votes move the story on."]} />
      <LearnStoreInit serverState={learnState} save={saveLearnState} />
      <WardWeek
        cases={cases}
        teamsOn={ready}
        openTeam={team ?? null}
        teams={teams.map((t) => ({ id: t.id, name: t.name, campaign: t.scenario, status: t.status, code: t.code }))}
        actions={{ finishWardSolo, createWardTeam, joinWardTeam, wardTeamView, castWardVote }}
      />
    </ActivityFrame>
  );
}
