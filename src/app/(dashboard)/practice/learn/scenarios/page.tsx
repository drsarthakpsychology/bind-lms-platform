import type { Metadata } from "next";
import { requireFeature } from "@/lib/flags";
import { ScenarioGame } from "@/components/learn/clinic-games";
import { loadLearnState, saveLearnState } from "../actions";

export const metadata: Metadata = { title: "What would you do?" };

export default async function ScenariosPage({ searchParams }: { searchParams: Promise<{ note?: string }> }) {
  await requireFeature("learn");
  const { note } = await searchParams;
  const serverState = await loadLearnState();
  return <ScenarioGame key={note ?? "all"} serverState={serverState} save={saveLearnState} noteId={note} />;
}
