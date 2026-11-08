import type { Metadata } from "next";
import { ActivityFrame } from "@/components/study/activity-frame";
import { ActivityTip } from "@/components/help/activity-tip";
import { HowToStart } from "@/components/help/how-to";
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
      fallback="/games"
    >
      <ActivityTip id="criteria-sort" intro="Look-alike disorders and their criteria." steps={["Tap a tile, then the disorder it belongs to.", "Fill every group, then check. Right groups lock.", "One away means all but one tile in that group is right.", "Advanced: also pick each disorder's time rule."]} />
      <HowToStart id="criteria-sort">
        <SortGame serverState={serverState} save={saveLearnState} initial={initial} />
      </HowToStart>
    </ActivityFrame>
  );
}
