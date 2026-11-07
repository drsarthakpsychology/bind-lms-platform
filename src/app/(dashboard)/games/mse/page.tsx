import type { Metadata } from "next";
import { ActivityFrame } from "@/components/study/activity-frame";
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
      purpose="Read a short interview and the observation note, then tag each finding with the right part of the mental state examination and the exact word."
      how={["Pick the part of the MSE for the highlighted phrase.", "Pick the exact word.", "Half marks for the right part, half for the word.", "Fully right tags in a row build your streak."]}
    >
      <MseLab serverState={serverState} save={saveLearnState} board={board} submit={submitMseExcerpt} />
    </ActivityFrame>
  );
}
