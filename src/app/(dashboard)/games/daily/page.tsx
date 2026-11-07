import type { Metadata } from "next";
import { ActivityFrame } from "@/components/study/activity-frame";
import { requireFeature } from "@/lib/flags";
import { loadLearnState, saveLearnState } from "../../study/actions";
import { dailyMove } from "./actions";
import { DailyGame } from "./daily-game";

export const metadata: Metadata = { title: "Daily case" };

/** /games/daily: one case for everyone each day (India time), plus adaptive practice. */
export default async function DailyCasePage() {
  await requireFeature("learn");
  const [serverState, initial] = await Promise.all([loadLearnState(), dailyMove({ mode: "daily" })]);
  return (
    <ActivityFrame
      title="Daily case"
      how={["One new patient a day. Name the diagnosis.", "Open clues or order tests if you need them. Fewer clues, more points."]}
      fallback="/games"
    >
      <DailyGame serverState={serverState} save={saveLearnState} initial={initial} />
    </ActivityFrame>
  );
}
