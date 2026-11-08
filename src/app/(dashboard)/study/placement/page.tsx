import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireFeature } from "@/lib/flags";
import { PREP_ONBOARDING_ENABLED } from "@/lib/prep/catalog";
import { getSession } from "@/lib/auth/session";
import { loadPlacement } from "@/lib/learn/model/server";
import { placementItems } from "@/lib/learn/model/placement";
import { topicById } from "@/lib/learn/model/topics";
import type { QView } from "../map/question";
import { PlacementRunner } from "./runner";

export const metadata: Metadata = { title: "Placement quiz" };

/**
 * /study/placement: 18 questions across every topic; seeds the map. Answers
 * stay on the server. Switched off with PREP_ONBOARDING_ENABLED: the address
 * goes back to Study and nothing links here.
 */
export default async function PlacementPage() {
  await requireFeature("learn");
  if (!PREP_ONBOARDING_ENABLED) redirect("/study");
  const session = await getSession();
  const isLearner = session.status === "ok" && (session.profile.role === "student" || session.profile.role === "alumni");
  const previous = isLearner && session.status === "ok" ? await loadPlacement(session.profile.id) : null;
  // No answers are sent to the browser: the quiz is graded on the server.
  const questions: QView[] = placementItems().map((b) =>
    b.item.kind === "mcq"
      ? { id: b.item.id, kind: "mcq", text: b.item.prompt, options: b.item.options, topic: topicById(b.topic)?.title ?? b.topic, ...(b.item.vignette ? { vignette: b.item.vignette } : {}) }
      : { id: b.item.id, kind: "tf", text: b.item.statement, topic: topicById(b.topic)?.title ?? b.topic },
  );

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6 sm:px-6 lg:py-10">
      <Link href="/study" className="inline-flex min-h-11 items-center gap-1.5 text-sm font-bold text-link hover:underline">
        <ArrowLeft className="size-4" aria-hidden /> Back to Study
      </Link>
      <PlacementRunner questions={questions} previous={previous} saving={isLearner} />
    </div>
  );
}
