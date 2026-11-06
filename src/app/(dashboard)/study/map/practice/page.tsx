import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireFeature } from "@/lib/flags";
import { getSession } from "@/lib/auth/session";
import { loadPracticeSession } from "@/lib/learn/model/server";
import { bankItem, skillLabel, topicById } from "@/lib/learn/model/topics";
import { PracticeRunner, type PracticeQ } from "./runner";

export const metadata: Metadata = { title: "Practice" };

/**
 * /study/map/practice[?topic=<module>]: a 10-question round picked for this
 * student (the Goldilocks mix). With a topic it's a "Fix it" round: mostly that
 * topic, mixed with its look-alikes.
 */
export default async function PracticePage({ searchParams }: { searchParams: Promise<{ topic?: string | string[] }> }) {
  await requireFeature("learn");
  const sp = await searchParams;
  const raw = Array.isArray(sp.topic) ? sp.topic[0] : sp.topic;
  const topic = raw && topicById(raw) ? raw : null;
  const session = await getSession();
  const isLearner = session.status === "ok" && (session.profile.role === "student" || session.profile.role === "alumni");
  const userId = session.status === "ok" ? session.profile.id : "";
  const { picked, round } = await loadPracticeSession(isLearner ? userId : "", topic);
  const questions: PracticeQ[] = picked.flatMap((p): PracticeQ[] => {
    const b = bankItem(p.id);
    if (!b) return [];
    const it = b.item;
    const base = { id: it.id, topic: b.topic, student: it.student, clinician: it.clinician, label: skillLabel(b.skill) };
    return it.kind === "mcq"
      ? [{ ...base, kind: "mcq" as const, text: it.prompt, options: it.options, answer: it.answer, ...(it.vignette ? { vignette: it.vignette } : {}) }]
      : [{ ...base, kind: "tf" as const, text: it.statement, answer: it.answer }];
  });
  const title = topic ? `Fix it: ${topicById(topic)!.title}` : "Mixed practice";

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6 sm:px-6 lg:py-10">
      <Link href="/study/map" className="inline-flex min-h-11 items-center gap-1.5 text-sm font-bold text-link hover:underline">
        <ArrowLeft className="size-4" aria-hidden /> Your map
      </Link>
      <header className="space-y-1">
        <p className="text-eyebrow text-link">Practice</p>
        <h1 className="text-h1">{title}</h1>
        <p className="text-muted-foreground">10 questions picked for you: mostly ones you can just about get, a few reviews, one stretch, one easy win.</p>
      </header>
      <PracticeRunner key={round} questions={questions} title={title} saving={isLearner} />
    </div>
  );
}
