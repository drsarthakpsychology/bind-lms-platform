import type { Metadata } from "next";
import { ActivityFrame } from "@/components/study/activity-frame";
import { requireFeature } from "@/lib/flags";
import { ScenarioGame } from "@/components/learn/clinic-games";
import { loadLearnState, saveLearnState } from "../actions";

export const metadata: Metadata = { title: "What would you do?" };

export default async function ScenariosPage({ searchParams }: { searchParams: Promise<{ note?: string }> }) {
  await requireFeature("learn");
  const { note } = await searchParams;
  const serverState = await loadLearnState();
  return (
    <ActivityFrame
      title="What would you do?"
      purpose="Real clinic moments. A patient says something tricky; you choose a response and see what happens next."
      how={["Read what the patient says.", "Pick your response.", "See the consequence, then the best choice and why.", "Some wrong answers sound kind: that's the point."]}
    >
      <ScenarioGame key={note ?? "all"} serverState={serverState} save={saveLearnState} noteId={note} />
    </ActivityFrame>
  );
}
