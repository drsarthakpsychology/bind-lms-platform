import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PlayFrame } from "@/components/play/play-frame";
import { playV2 } from "@/components/play/v2";
import { requireFeature } from "@/lib/flags";
import { currentPlayer } from "@/lib/games/server";
import { loadBests } from "@/lib/games/blitz/server";
import { BlitzGame } from "./blitz-game";
import { loadLearnState, saveLearnState } from "../../study/actions";

export const metadata: Metadata = { title: "Blitz" };
export const dynamic = "force-dynamic";

/** /games/blitz: 60 seconds of fast facts. The only timed game. */
export default async function BlitzPage() {
  await requireFeature("learn");
  const me = await currentPlayer();
  if (!me) redirect("/login");
  const [bests, serverState] = await Promise.all([loadBests(me.id), loadLearnState()]);
  return (
    <PlayFrame v2={await playV2()} title="Blitz" fallback="/games" tip={{ id: "blitz", intro: "Fast facts against the clock.", steps: ["Answer as many as you can before the clock runs out.", "Right answers in a row multiply your points. A wrong answer resets the combo.", "Keys: 1 to 4, or T and F."] }}>
      <BlitzGame bests={bests} serverState={serverState} save={saveLearnState} />
    </PlayFrame>
  );
}
