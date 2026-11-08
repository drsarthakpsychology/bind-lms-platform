import type { Metadata } from "next";
import { ActivityFrame } from "@/components/study/activity-frame";
import { ActivityTip } from "@/components/help/activity-tip";
import { requireFeature } from "@/lib/flags";
import { currentUser, loadAccuracyBoard } from "@/lib/games-sims/server/results";
import { loadLearnState, saveLearnState } from "../../study/actions";
import { submitMseExcerpt } from "./actions";
import { MseLab } from "./mse-lab";

export const metadata: Metadata = { title: "MSE Lab" };

export default async function MseLabPage() {
  await requireFeature("learn");
  const user = await currentUser();
  const [serverState, board] = await Promise.all([loadLearnState(), loadAccuracyBoard("mse", user?.id ?? null)]);
  return (
    <ActivityFrame
      title="MSE Lab"
    >
      <ActivityTip id="mse-lab" intro="Tag what you see in an interview." steps={["For each highlighted phrase, pick the part of the MSE, then the exact word.", "Half marks for the part, half for the word.", "Fully right tags in a row build your streak."]} />
      <MseLab serverState={serverState} save={saveLearnState} board={board} submit={submitMseExcerpt} />
    </ActivityFrame>
  );
}
