import type { Metadata } from "next";
import { PlayFrame } from "@/components/play/play-frame";
import { uiV2 } from "@/lib/ui/v2-server";
import { HowToStart } from "@/components/help/how-to";
import { requireFeature } from "@/lib/flags";
import { loadLearnState, saveLearnState } from "../../study/actions";
import { dailyMove } from "./actions";
import { DailyGame } from "./daily-game";

export const metadata: Metadata = { title: "Daily case" };

/** /practice/daily: one case for everyone each day (India time), plus adaptive practice. */
export default async function DailyCasePage() {
  await requireFeature("learn");
  const [serverState, initial] = await Promise.all([loadLearnState(), dailyMove({ mode: "daily" })]);
  return (
    <PlayFrame v2={await uiV2()} title="Daily case" fallback="/practice" tip={{ id: "daily-case", steps: ["Name the diagnosis.", "Open clues or order tests if you need them. Fewer clues, more points."] }}>
      <HowToStart id="daily-case">
        <DailyGame serverState={serverState} save={saveLearnState} initial={initial} />
      </HowToStart>
    </PlayFrame>
  );
}
