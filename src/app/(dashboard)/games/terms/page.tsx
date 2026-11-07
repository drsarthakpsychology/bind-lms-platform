import type { Metadata } from "next";
import { ActivityFrame } from "@/components/study/activity-frame";
import { requireFeature } from "@/lib/flags";
import { TermsGame } from "@/components/learn/clinic-games";
import { loadLearnState, saveLearnState } from "../../study/actions";

export const metadata: Metadata = { title: "Say it clinically" };

export default async function TermsPage() {
  await requireFeature("learn");
  const serverState = await loadLearnState();
  return (
    <ActivityFrame
      title="Say it clinically"
      tipLabel="How it works"
      how={["Read the everyday phrase.", "Pick the clinical term, then read why.", "12 questions a round."]}
    >
      <TermsGame serverState={serverState} save={saveLearnState} />
    </ActivityFrame>
  );
}
