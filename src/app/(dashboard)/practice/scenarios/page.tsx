import type { Metadata } from "next";
import { ActivityFrame } from "@/components/study/activity-frame";
import { ActivityTip } from "@/components/help/activity-tip";
import { requireFeature } from "@/lib/flags";
import { ScenarioGame } from "@/components/learn/clinic-games";
import { loadLearnState, saveLearnState } from "../../study/actions";

export const metadata: Metadata = { title: "What would you do?" };

export default async function ScenariosPage({ searchParams }: { searchParams: Promise<{ note?: string }> }) {
  await requireFeature("learn");
  const { note } = await searchParams;
  const serverState = await loadLearnState();
  return (
    <ActivityFrame
      fallback="/practice"
      title="What would you do?"
    >
      <ActivityTip id="what-would-you-do" label="How it works" steps={["Read what the patient says, then pick your response."]} />
      <ScenarioGame key={note ?? "all"} serverState={serverState} save={saveLearnState} noteId={note} />
    </ActivityFrame>
  );
}
