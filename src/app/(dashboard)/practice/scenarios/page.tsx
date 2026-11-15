import type { Metadata } from "next";
import { PlayFrame } from "@/components/play/play-frame";
import { uiV2 } from "@/lib/ui/v2-server";
import { requireFeature } from "@/lib/flags";
import { ScenarioGame } from "@/components/learn/clinic-games";
import { loadLearnState, saveLearnState } from "../../study/actions";
import { SCENARIOS } from "@/lib/learn/scenarios";
import { caseContext } from "@/lib/cases/server";

export const metadata: Metadata = { title: "What would you do?" };

export default async function ScenariosPage({ searchParams }: { searchParams: Promise<{ note?: string }> }) {
  await requireFeature("learn");
  const { note } = await searchParams;
  const [serverState, ctx] = await Promise.all([loadLearnState(), caseContext("wwyd", SCENARIOS.map((x) => x.id), "wwyd")]);
  return (
    <PlayFrame v2={await uiV2()} fallback="/practice" title="What would you do?" titleAs="p" tip={{ id: "what-would-you-do", label: "How it works", steps: ["Read what the patient says, then pick your response."] }}>
      <ScenarioGame key={note ?? "all"} serverState={serverState} save={saveLearnState} noteId={note} ctx={ctx} />
    </PlayFrame>
  );
}
