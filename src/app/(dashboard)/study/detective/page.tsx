import type { Metadata } from "next";
import { ActivityFrame } from "@/components/study/activity-frame";
import { requireFeature } from "@/lib/flags";
import { Detective } from "@/components/learn/detective";
import { loadLearnState, saveLearnState } from "../actions";

export const metadata: Metadata = { title: "Clinic detective" };

export default async function DetectivePage() {
  await requireFeature("learn");
  const serverState = await loadLearnState();
  return (
    <ActivityFrame
      title="Clinic detective"
      purpose="Guess the medicine or disorder from clues that appear one at a time. The fewer clues you need, the more points."
      how={["Read the first clue.", "Guess, or reveal another clue.", "Wrong guesses cost points.", "The answer card explains every clue."]}
    >
      <Detective serverState={serverState} save={saveLearnState} />
    </ActivityFrame>
  );
}
