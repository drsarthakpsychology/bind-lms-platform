import type { Metadata } from "next";
import { ActivityFrame } from "@/components/study/activity-frame";
import { requireFeature } from "@/lib/flags";
import { currentUser, loadAccuracyBoard } from "@/lib/games-sims/server/results";
import { finishRxRun, gradeRxAnswer } from "./actions";
import { RxDetective } from "./rx-detective";

export const metadata: Metadata = { title: "Rx Detective" };

export default async function RxPage() {
  await requireFeature("learn");
  const user = await currentUser();
  const board = await loadAccuracyBoard("rx", user?.id ?? null);
  return (
    <ActivityFrame
      title="Rx Detective"
      purpose="Medicines from the receptor up: what each one is, how it works, the side effect to remember and what to check. Then side-effect mysteries and dangerous mixes."
      how={["Pick a mode, or play mixed.", "Twelve cases a run. Three lives.", "A case scored under half costs a life.", "Every answer opens the why, with an animation."]}
    >
      <RxDetective board={board} grade={gradeRxAnswer} finish={finishRxRun} />
    </ActivityFrame>
  );
}
