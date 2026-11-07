import type { Metadata } from "next";
import { ActivityFrame } from "@/components/study/activity-frame";
import { LearnStoreInit } from "@/components/learn/learn-store-init";
import { loadLearnState, saveLearnState } from "../../study/actions";
import { requireFeature } from "@/lib/flags";
import { RULES } from "@/lib/games-sims/comorbid/game";
import { currentUser, loadAccuracyBoard } from "@/lib/games-sims/server/results";
import { finishComorbid } from "./actions";
import { ComorbidGame } from "./comorbid-game";

export const metadata: Metadata = { title: "Comorbid" };

export default async function ComorbidPage() {
  await requireFeature("learn");
  const learnState = await loadLearnState();
  const user = await currentUser();
  const board = await loadAccuracyBoard("comorbid", user?.id ?? null);
  return (
    <ActivityFrame title="Comorbid" purpose="A card duel about criteria and differentials. Build your diagnosis from symptom cards while your rival tries to rule it out." how={RULES}>
      <LearnStoreInit serverState={learnState} save={saveLearnState} />
      <ComorbidGame board={board} finish={finishComorbid} />
    </ActivityFrame>
  );
}
