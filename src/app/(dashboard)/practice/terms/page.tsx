import type { Metadata } from "next";
import { PlayFrame } from "@/components/play/play-frame";
import { playV2 } from "@/components/play/v2";
import { requireFeature } from "@/lib/flags";
import { TermsGame } from "@/components/learn/clinic-games";
import { loadLearnState, saveLearnState } from "../../study/actions";

export const metadata: Metadata = { title: "Say it clinically" };

export default async function TermsPage() {
  await requireFeature("learn");
  const serverState = await loadLearnState();
  return (
    <PlayFrame v2={await playV2()} fallback="/practice" title="Say it clinically" titleAs="p" tip={{ id: "say-it-clinically", label: "How it works", steps: ["Pick the clinical term for the everyday phrase."] }}>
      <TermsGame serverState={serverState} save={saveLearnState} />
    </PlayFrame>
  );
}
