import type { Metadata } from "next";
import { ActivityFrame } from "@/components/study/activity-frame";
import { requireFeature } from "@/lib/flags";
import { DOMAINS, type Domain } from "@/lib/learn/concepts";
import { Coach } from "@/components/learn/coach";
import { loadLearnState, saveLearnState } from "@/app/(dashboard)/study/actions";

export const metadata: Metadata = { title: "Coach" };

/** /prep/smart/coach?domain=…: adaptive teaching with Chai. */
export default async function CoachPage({ searchParams }: { searchParams: Promise<{ domain?: string }> }) {
  await requireFeature("learn");
  const { domain } = await searchParams;
  const d: Domain | "all" = DOMAINS.some((x) => x.id === domain) ? (domain as Domain) : "all";
  const serverState = await loadLearnState();
  return (
    <ActivityFrame
      title="Coach"
      purpose="Chai teaches a concept, then asks. When you mix two things up, it remembers and brings them back until you get them right."
      how={["Read the teach card for a new concept.", "Answer: pick, true or false, or type it.", "Wrong answers come back later in the same session.", "The end report shows what you confuse most."]}
    >
      <Coach key={d} domain={d} serverState={serverState} save={saveLearnState} />
    </ActivityFrame>
  );
}
