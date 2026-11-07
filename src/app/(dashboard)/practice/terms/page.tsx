import type { Metadata } from "next";
import { ActivityFrame } from "@/components/study/activity-frame";
import { ActivityTip } from "@/components/help/activity-tip";
import { requireFeature } from "@/lib/flags";
import { TermsGame } from "@/components/learn/clinic-games";
import { loadLearnState, saveLearnState } from "../../study/actions";

export const metadata: Metadata = { title: "Say it clinically" };

export default async function TermsPage() {
  await requireFeature("learn");
  const serverState = await loadLearnState();
  return (
    <ActivityFrame
      fallback="/practice"
      title="Say it clinically"
      purpose="Turn what patients and families say into the words you write in a case sheet, and choose respectful language."
      how={["Read the everyday phrase.", "Pick the clinical term.", "Check the explanation.", "12 questions a round."]}
    >
      <ActivityTip id="say-it-clinically" label="How it works" steps={["Read the everyday phrase.", "Pick the clinical term, then read why.", "12 questions a round."]} />
      <TermsGame serverState={serverState} save={saveLearnState} />
    </ActivityFrame>
  );
}
