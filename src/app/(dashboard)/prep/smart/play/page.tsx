import type { Metadata } from "next";
import type * as React from "react";
import { ActivityFrame } from "@/components/study/activity-frame";
import { ActivityTip } from "@/components/help/activity-tip";
import { redirect } from "next/navigation";
import { requireFeature } from "@/lib/flags";
import { findLesson } from "@/lib/learn/content";
import { Player } from "@/components/learn/player";
import { orderForViewer } from "@/lib/history/viewer";
import { loadLearnState, saveLearnState } from "@/app/(dashboard)/study/actions";

export const metadata: Metadata = { title: "Learn" };

/** /prep/smart/play?lesson=… | ?mode=review (?mode=blitz goes to /games/blitz) */
export default async function PlayPage({ searchParams }: { searchParams: Promise<{ lesson?: string; mode?: string }> }) {
  await requireFeature("learn");
  const { lesson, mode } = await searchParams;
  const serverState = await loadLearnState();
  const frame = (title: string, node: React.ReactNode, tip?: { id: string; steps: string[] }) => (
    <ActivityFrame title={title}>
      {tip ? <ActivityTip id={tip.id} label="How it works" steps={tip.steps} /> : null}
      {node}
    </ActivityFrame>
  );
  // Blitz moved to its own server-scored game (the only timed one).
  if (mode === "blitz") redirect("/games/blitz");
  if (mode === "review")
    return frame("Review", <Player key="review" mode={{ kind: "review" }} serverState={serverState} save={saveLearnState} />, { id: "review", steps: ["Right moves a question to a longer gap. Wrong brings it back sooner."] });
  const l = lesson ? findLesson(lesson) : undefined;
  if (!lesson || !l) redirect("/prep/smart");
  // Never-seen questions first, then wrong ones, right ones last (src/lib/history).
  const order = await orderForViewer("learn", l.lesson.items.map((it) => it.id));
  return frame(`Quiz: ${l.lesson.title}`, <Player key={lesson} mode={{ kind: "lesson", lessonId: lesson }} serverState={serverState} save={saveLearnState} order={order} />, { id: "topic-quiz", steps: ["Missed ones repeat at the end."] });
}
