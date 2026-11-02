import type { Metadata } from "next";
import { requireFeature } from "@/lib/flags";
import { UNITS } from "@/lib/learn/content";
import { LearnHome } from "@/components/learn/learn-home";
import { loadLearnState, saveLearnState } from "./actions";

export const metadata: Metadata = { title: "Learn" };

/** /practice/learn — the gamified learning path with Chai. */
export default async function LearnPage() {
  await requireFeature("learn");
  const serverState = await loadLearnState();
  return <LearnHome units={UNITS} serverState={serverState} save={saveLearnState} />;
}
