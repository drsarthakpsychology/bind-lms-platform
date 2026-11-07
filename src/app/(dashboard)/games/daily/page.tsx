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
      purpose="One new patient a day, the same for everyone in your batch. Name the diagnosis in as few clues as you can."
      how={[
        "Read the clue and guess from the list.",
        "A wrong guess tells you why, then opens the next clue.",
        "Next clue or a test costs 15 points.",
        "After the case, read why the look-alikes were wrong.",
        "Practice gives you more cases at your level.",
        "AI case gives you a new case made by AI and checked by rules.",
      ]}
      fallback="/games"
    >
      <DailyGame serverState={serverState} save={saveLearnState} initial={initial} />
    </ActivityFrame>
  );
}
