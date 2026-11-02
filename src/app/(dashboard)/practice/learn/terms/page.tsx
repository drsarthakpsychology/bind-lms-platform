import type { Metadata } from "next";
import { requireFeature } from "@/lib/flags";
import { TermsGame } from "@/components/learn/clinic-games";
import { loadLearnState, saveLearnState } from "../actions";

export const metadata: Metadata = { title: "Say it clinically" };

export default async function TermsPage() {
  await requireFeature("learn");
  const serverState = await loadLearnState();
  return <TermsGame serverState={serverState} save={saveLearnState} />;
}
