import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen } from "lucide-react";
import { requireFeature } from "@/lib/flags";
import { learnHrefFor } from "@/lib/prep/bank";
import { OPTIONAL_SUBJECTS, SUBJECT_TITLE, isSubject } from "@/lib/prep/catalog";
import { loadSubject } from "@/lib/prep/path";
import { BackToPrep, ListRow, PrepFrame, btnPlain, card, pctText } from "../ui";
import { prepViewer } from "../viewer";

export async function generateMetadata({ params }: { params: Promise<{ subject: string }> }): Promise<Metadata> {
  const { subject } = await params;
  return { title: isSubject(subject) ? SUBJECT_TITLE[subject] : "Exam Prep" };
}

/** /prep/<subject>: its topics, each with how many questions and your percent right. Tap one to start a set of 10. */
export default async function SubjectPage({ params }: { params: Promise<{ subject: string }> }) {
  await requireFeature("learn");
  const { subject } = await params;
  if (!isSubject(subject)) notFound();
  const me = await prepViewer();
  const { topics, stats } = await loadSubject(me.id, subject);
  const title = subject === "ugc-paper1" ? "UGC NET Paper 1: general paper" : SUBJECT_TITLE[subject];

  return (
    <PrepFrame>
      <BackToPrep />
      <header className="space-y-2">
        <p className="flex flex-wrap items-center gap-2 text-eyebrow text-link">
          Subject
          {OPTIONAL_SUBJECTS.has(subject) ? <span className="rounded-full border-2 border-dashed border-foreground/60 px-2 py-0.5 text-xs font-bold normal-case text-muted-foreground">Optional</span> : null}
        </p>
        <h1 className="text-h1 text-balance [overflow-wrap:anywhere]">{title}</h1>
        <p className="text-muted-foreground">
          {stats.total} questions{stats.answered ? ` · ${stats.answered} answered · ${pctText(stats)}` : ""}
        </p>
      </header>

      {topics.length ? (
        <ul className="space-y-2" aria-label="Topics">
          {topics.map((t) => (
            <li key={t.id}>
              <ListRow href={t.href} title={t.title} sub={`${t.stats.total} questions${t.stats.answered ? ` · ${t.stats.answered} answered` : ""}`} side={pctText(t.stats)} stats={t.stats} />
            </li>
          ))}
        </ul>
      ) : (
        <p className={card}>Questions for this subject are being added.</p>
      )}

      <Link href={learnHrefFor(subject)} className={btnPlain}>
        <BookOpen className="size-4" aria-hidden /> Read the notes in Study
      </Link>
    </PrepFrame>
  );
}
