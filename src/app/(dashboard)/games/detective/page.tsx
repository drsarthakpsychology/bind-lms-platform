import type { Metadata } from "next";
import { ActivityFrame } from "@/components/study/activity-frame";
import { requireFeature } from "@/lib/flags";
import { Detective } from "@/components/learn/detective";
import { loadLearnState, saveLearnState } from "../../study/actions";

export const metadata: Metadata = { title: "Clinic detective" };

export default async function DetectivePage() {
  await requireFeature("learn");
  const serverState = await loadLearnState();
  return (
    <ActivityFrame
      title="Clinic detective"
      tipLabel="How it works"
      how={["Clues appear one at a time. Guess, or open another clue.", "Fewer clues, more points. Wrong guesses cost points.", "The answer card explains every clue."]}
    >
      <Detective serverState={serverState} save={saveLearnState} />
    </ActivityFrame>
  );
}
