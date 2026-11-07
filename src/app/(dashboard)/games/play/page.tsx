import type { Metadata } from "next";
import type * as React from "react";
import { ActivityFrame } from "@/components/study/activity-frame";
import { ActivityTip } from "@/components/help/activity-tip";
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
  const frame = (title: string, purpose: string, how: string[], node: React.ReactNode, tip?: { id: string; steps: string[] }) => (
    <ActivityFrame title={title} purpose={purpose} how={how}>
      {tip ? <ActivityTip id={tip.id} label="How it works" steps={tip.steps} /> : null}
      {node}
    </ActivityFrame>
  );
  // Blitz moved to its own server-scored game (the only timed one).
  if (mode === "blitz") redirect("/games/blitz");
  if (mode === "review")
    return frame("Review", "The questions you're about to forget, brought back at the right time (1, 3, 7, 14, then 30 days).", ["Answer each question.", "Right moves it to a longer gap; wrong brings it back sooner.", "Do this daily: it's the fastest way to keep what you learned."], <Player key="review" mode={{ kind: "review" }} serverState={serverState} save={saveLearnState} />, { id: "review", steps: ["Answer each question.", "Right moves it to a longer gap. Wrong brings it back sooner."] });
  const l = lesson ? findLesson(lesson) : undefined;
  if (!lesson || !l) redirect("/games");
  return frame(`Quiz: ${l.lesson.title}`, "A short quiz on this topic. Explanations appear after each answer.", ["Answer each question.", "Read the explanation, even when you're right.", "Missed ones repeat at the end."], <Player key={lesson} mode={{ kind: "lesson", lessonId: lesson }} serverState={serverState} save={saveLearnState} />, { id: "topic-quiz", steps: ["Answer each question, then read the explanation.", "Missed ones repeat at the end."] });
}
