import type { Metadata } from "next";
import type * as React from "react";
import { ActivityFrame } from "@/components/study/activity-frame";
import { redirect } from "next/navigation";
import { requireFeature } from "@/lib/flags";
import { findLesson } from "@/lib/learn/content";
import { Player } from "@/components/learn/player";
import { loadLearnState, saveLearnState } from "../../study/actions";

export const metadata: Metadata = { title: "Learn" };

/** /games/play?lesson=… | ?mode=review (?mode=blitz goes to /games/blitz) */
export default async function PlayPage({ searchParams }: { searchParams: Promise<{ lesson?: string; mode?: string }> }) {
  await requireFeature("learn");
  const { lesson, mode } = await searchParams;
  const serverState = await loadLearnState();
  const frame = (title: string, purpose: string, how: string[], node: React.ReactNode, tipId: string) => (
    <ActivityFrame title={title} purpose={purpose} how={how} tipId={tipId} tipLabel="How it works">
      {node}
    </ActivityFrame>
  );
  // Blitz moved to its own server-scored game (the only timed one).
  if (mode === "blitz") redirect("/games/blitz");
  if (mode === "review")
    return frame("Review", "The questions you are about to forget, brought back in time.", ["Answer each question.", "Right moves it to a longer gap. Wrong brings it back sooner."], <Player key="review" mode={{ kind: "review" }} serverState={serverState} save={saveLearnState} />, "review");
  const l = lesson ? findLesson(lesson) : undefined;
  if (!lesson || !l) redirect("/games");
  return frame(`Quiz: ${l.lesson.title}`, "A short quiz on this topic.", ["Answer each question, then read the explanation.", "Missed ones repeat at the end."], <Player key={lesson} mode={{ kind: "lesson", lessonId: lesson }} serverState={serverState} save={saveLearnState} />, "topic-quiz");
}
