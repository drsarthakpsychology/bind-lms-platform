import type { Metadata } from "next";
import { PlayFrame } from "@/components/play/play-frame";
import { playV2 } from "@/components/play/v2";
import { LearnStoreInit } from "@/components/learn/learn-store-init";
import { loadLearnState, saveLearnState } from "../../study/actions";
import { requireFeature } from "@/lib/flags";
import { RULES } from "@/lib/games-sims/comorbid/game";
import { currentUser, loadAccuracyBoard } from "@/lib/games-sims/server/results";
import { finishComorbid } from "./actions";
import { ComorbidGame } from "./comorbid-game";

export const metadata: Metadata = { title: "Comorbid" };

export default async function ComorbidPage() {
  await requireFeature("learn");
  const learnState = await loadLearnState();
  const user = await currentUser();
  const board = await loadAccuracyBoard("comorbid", user?.id ?? null);
  return (
    <PlayFrame v2={await playV2()} title="Comorbid" titleAs="p" tip={{ id: "comorbid", intro: "A card duel about criteria and look-alikes.", steps: RULES }}>
      <LearnStoreInit serverState={learnState} save={saveLearnState} />
      <ComorbidGame board={board} finish={finishComorbid} />
    </PlayFrame>
  );
}
