import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireFeature } from "@/lib/flags";
import { findLesson } from "@/lib/learn/content";
import { Player } from "@/components/learn/player";
import { loadLearnState, saveLearnState } from "../actions";

export const metadata: Metadata = { title: "Learn" };

/** /practice/learn/play?lesson=… | ?mode=review | ?mode=blitz */
export default async function PlayPage({ searchParams }: { searchParams: Promise<{ lesson?: string; mode?: string }> }) {
  await requireFeature("learn");
  const { lesson, mode } = await searchParams;
  const serverState = await loadLearnState();
  if (mode === "blitz") return <Player key="blitz" mode={{ kind: "blitz" }} serverState={serverState} save={saveLearnState} />;
  if (mode === "review") return <Player key="review" mode={{ kind: "review" }} serverState={serverState} save={saveLearnState} />;
  if (!lesson || !findLesson(lesson)) redirect("/practice/learn");
  return <Player key={lesson} mode={{ kind: "lesson", lessonId: lesson }} serverState={serverState} save={saveLearnState} />;
}
