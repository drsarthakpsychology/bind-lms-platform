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
    >
      <ActivityTip id="say-it-clinically" label="How it works" steps={["Pick the clinical term for the everyday phrase."]} />
      <TermsGame serverState={serverState} save={saveLearnState} />
    </ActivityFrame>
  );
}
