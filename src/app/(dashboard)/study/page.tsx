import type { Metadata } from "next";
import { requireFeature } from "@/lib/flags";
import { MODULES, liteModule } from "@/lib/study";
import { StudyHome } from "@/components/study/course";
import { loadLearnState, saveLearnState } from "./actions";

export const metadata: Metadata = { title: "Notes" };

/** /study: the course. One "Continue" button and the modules in order. */
export default async function StudyPage() {
  await requireFeature("learn");
  const serverState = await loadLearnState();
  return <StudyHome modules={MODULES.map(liteModule)} serverState={serverState} save={saveLearnState} />;
}
