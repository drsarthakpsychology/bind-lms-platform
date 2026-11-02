import type { Metadata } from "next";
import { requireFeature } from "@/lib/flags";
import { UNITS } from "@/lib/learn/content";
import { LearnHome } from "@/components/learn/learn-home";
import { loadLearnState, saveLearnState } from "../study/actions";

export const metadata: Metadata = { title: "Games" };

/** /games: one game to play now, then all the games. */
export default async function GamesPage() {
  await requireFeature("learn");
  const serverState = await loadLearnState();
  return <LearnHome units={UNITS} serverState={serverState} save={saveLearnState} />;
}
