import type { Metadata } from "next";
import { ActivityFrame } from "@/components/study/activity-frame";
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
      purpose="Four look-alike disorders, sixteen criteria."
      how={["Tap a tile, then tap the disorder it belongs to.", "Fill all four groups, then check. You have four tries.", "Right groups lock. One away means three of four are right.", "Advanced: also pick each disorder's time rule."]}
      fallback="/games"
    >
      <SortGame serverState={serverState} save={saveLearnState} initial={initial} />
    </ActivityFrame>
  );
}
