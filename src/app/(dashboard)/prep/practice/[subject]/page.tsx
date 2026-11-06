import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen } from "lucide-react";
import { requireFeature } from "@/lib/flags";
import { KEY, learnHrefFor } from "@/lib/prep/bank";
import { SUBJECT_TITLE, isSubject } from "@/lib/prep/catalog";
import { loadPracticeRound } from "@/lib/prep/path";
import { toView } from "@/lib/prep/view";
import { BackToPrep, PrepFrame, btnPlain } from "../../ui";
import { currentGoal, prepViewer } from "../../viewer";
import { PracticeRunner } from "../runner";

export async function generateMetadata({ params }: { params: Promise<{ subject: string }> }): Promise<Metadata> {
  const { subject } = await params;
  return { title: isSubject(subject) ? `Practise: ${SUBJECT_TITLE[subject]}` : "Practise" };
}

/**
 * /prep/practice/<subject>: a 10-question adaptive round. The Elo model
 * predicts each question's chance; the Goldilocks picker aims near 70 %
 * success with a few reviews, one stretch and one easy win, and every round
 * holds one question at the next level up, so it climbs from easy and medium
 * to hard and very hard as ability grows.
 */
export default async function PracticePage({ params }: { params: Promise<{ subject: string }> }) {
  await requireFeature("learn");
  const { subject } = await params;
  if (!isSubject(subject)) notFound();
  const me = await prepViewer();
  const ids = await loadPracticeRound(me.id, subject, await currentGoal(me.id));
  const questions = ids.map((id) => toView(KEY.get(id)!));
  const title = SUBJECT_TITLE[subject];

  return (
    <PrepFrame>
      <BackToPrep />
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <p className="text-eyebrow text-link">Practise</p>
          <h1 className="text-h1">{title}</h1>
        </div>
        <Link href={learnHrefFor(subject)} className={btnPlain}>
          <BookOpen className="size-4" aria-hidden /> Learn this topic
        </Link>
      </header>
      <PracticeRunner
        key={ids.join(",")}
        questions={questions}
        title={title}
        saving={me.learner}
        empty={
          <>
            <p className="font-semibold">Questions for this topic are still being added.</p>
            <p className="mt-1 text-muted-foreground">Read the notes for it in the meantime.</p>
          </>
        }
      />
    </PrepFrame>
  );
}
