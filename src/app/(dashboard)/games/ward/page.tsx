import type { Metadata } from "next";
import { ActivityFrame } from "@/components/study/activity-frame";
import { LearnStoreInit } from "@/components/learn/learn-store-init";
import { loadLearnState, saveLearnState } from "../../study/actions";
import { requireFeature } from "@/lib/flags";
import { currentUser } from "@/lib/games-sims/server/results";
import { myTeams, teamsReady } from "@/lib/games-sims/server/teams";
import { castWardVote, createWardTeam, finishWardSolo, joinWardTeam, wardTeamView } from "./actions";
import { WardWeek } from "./ward-week";

export const metadata: Metadata = { title: "Ward Week" };

export default async function WardPage({ searchParams }: { searchParams: Promise<{ team?: string }> }) {
  await requireFeature("learn");
  const learnState = await loadLearnState();
  const [{ team }, user] = await Promise.all([searchParams, currentUser()]);
  const [ready, teams] = await Promise.all([teamsReady(), user ? myTeams("ward", user.id) : Promise.resolve([])]);
  return (
    <ActivityFrame
      title="Ward Week"
      purpose="Follow one patient across five sessions. Every decision moves risk, trust, insight, family support and sticking with care, and changes what happens next."
      how={["Pick a patient.", "Read the session, then make the call.", "See why it was strong or weak.", "Play solo, or with two classmates: majority vote wins."]}
    >
      <LearnStoreInit serverState={learnState} save={saveLearnState} />
      <WardWeek
        teamsOn={ready}
        openTeam={team ?? null}
        teams={teams.map((t) => ({ id: t.id, name: t.name, campaign: t.scenario, status: t.status, code: t.code }))}
        actions={{ finishWardSolo, createWardTeam, joinWardTeam, wardTeamView, castWardVote }}
      />
    </ActivityFrame>
  );
}
