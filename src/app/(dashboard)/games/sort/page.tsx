import type { Metadata } from "next";
import { ActivityFrame } from "@/components/study/activity-frame";
import { ActivityTip } from "@/components/help/activity-tip";
import { requireFeature } from "@/lib/flags";
import { loadLearnState, saveLearnState } from "../../study/actions";
import { loadSort } from "./actions";
import { SortGame } from "./sort-game";

export const metadata: Metadata = { title: "Criteria sort" };

/** /games/sort: put 16 criteria under 4 look-alike disorders. */
export default async function CriteriaSortPage() {
  await requireFeature("learn");
  const [serverState, initial] = await Promise.all([loadLearnState(), loadSort({ mode: "daily", tier: "basic" })]);
  return (
    <ActivityFrame
      title="Criteria sort"
      purpose="Four disorders that look alike, sixteen criteria. Knowing which criterion belongs where is what tells them apart."
      how={["Tap a tile, then tap the disorder it belongs to.", "Fill all four groups, then check.", "Right groups lock. 'One away' means three of four are right.", "You have four tries.", "Advanced: also pick each disorder's time rule."]}
      fallback="/games"
    >
      <ActivityTip id="criteria-sort" intro="Four look-alike disorders, sixteen criteria." steps={["Tap a tile, then tap the disorder it belongs to.", "Fill all four groups, then check. You have four tries.", "Right groups lock. One away means three of four are right.", "Advanced: also pick each disorder's time rule."]} />
      <SortGame serverState={serverState} save={saveLearnState} initial={initial} />
    </ActivityFrame>
  );
}
