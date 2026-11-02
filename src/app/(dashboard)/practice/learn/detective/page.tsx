import type { Metadata } from "next";
import { requireFeature } from "@/lib/flags";
import { Detective } from "@/components/learn/detective";
import { loadLearnState, saveLearnState } from "../actions";

export const metadata: Metadata = { title: "Clinic detective" };

export default async function DetectivePage() {
  await requireFeature("learn");
  const serverState = await loadLearnState();
  return <Detective serverState={serverState} save={saveLearnState} />;
}
