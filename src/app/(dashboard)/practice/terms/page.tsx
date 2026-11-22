import type { Metadata } from "next";
import { PlayFrame } from "@/components/play/play-frame";
import { uiV2 } from "@/lib/ui/v2-server";
import { requireFeature } from "@/lib/flags";
import { TermsGame } from "@/components/learn/terms-game";
import { answerTerms, startTermsRound } from "./actions";
import { loadLearnState, saveLearnState } from "../../study/actions";

export const metadata: Metadata = { title: "Say it clinically" };

export default async function TermsPage() {
  await requireFeature("learn");
  const serverState = await loadLearnState();
  return (
    <PlayFrame v2={await uiV2()} fallback="/practice" title="Say it clinically" titleAs="p" tip={{ id: "say-it-clinically", label: "How it works", steps: ["Pick the clinical term for the everyday phrase."] }}>
      <TermsGame serverState={serverState} save={saveLearnState} start={startTermsRound} answer={answerTerms} />
    </PlayFrame>
  );
}
