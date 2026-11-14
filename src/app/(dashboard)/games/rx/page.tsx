import type { Metadata } from "next";
import { ActivityFrame } from "@/components/study/activity-frame";
import { ActivityTip } from "@/components/help/activity-tip";
import { LearnStoreInit } from "@/components/learn/learn-store-init";
import { loadLearnState, saveLearnState } from "../../study/actions";
import { requireFeature } from "@/lib/flags";
import { currentUser, loadAccuracyBoard } from "@/lib/games-sims/server/results";
import { dealRxRun, finishRxRun, pickRxAnswer } from "./actions";
import { RxDetective } from "./rx-detective";

export const metadata: Metadata = { title: "Rx Detective" };

export default async function RxPage() {
  await requireFeature("learn");
  const learnState = await loadLearnState();
  const user = await currentUser();
  const board = await loadAccuracyBoard("rx", user?.id ?? null);
  return (
    <ActivityFrame
      title="Rx Detective"
    >
      <ActivityTip id="rx-detective" intro="Medicines from the receptor up." steps={["Pick a mode, or play mixed.", "A case under half right costs a life.", "Doses are for learning only."]} />
      <LearnStoreInit serverState={learnState} save={saveLearnState} />
      <RxDetective board={board} actions={{ deal: dealRxRun, pick: pickRxAnswer, finish: finishRxRun }} />
    </ActivityFrame>
  );
}
