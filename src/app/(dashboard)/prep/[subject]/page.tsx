import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen } from "lucide-react";
import { requireFeature } from "@/lib/flags";
import { learnHrefFor } from "@/lib/prep/bank";
import { OPTIONAL_SUBJECTS, SUBJECT_TITLE, isSubject } from "@/lib/prep/catalog";
import { loadSubject } from "@/lib/prep/path";
import { longTopicsFor } from "@/lib/prep/long-server";
import { SubjectTabs } from "../long-ui";
import { BackToPrep, ListRow, PrepFrame, btnPlain, card, pctText } from "../ui";
import { prepViewer } from "../viewer";

export async function generateMetadata({ params }: { params: Promise<{ subject: string }> }): Promise<Metadata> {
  const { subject } = await params;
  return { title: isSubject(subject) ? SUBJECT_TITLE[subject] : "Exam Prep" };
}

/**
 * /prep/<subject>: two tabs. Questions (default): its topics, each with how
 * many questions and your percent right; tap one to start a set of 10. Long
 * answers (?tab=long): written answers by topic, 10 to a page.
 */
export default async function SubjectPage({ params, searchParams }: { params: Promise<{ subject: string }>; searchParams: Promise<{ tab?: string | string[] }> }) {
  await requireFeature("learn");
  const { subject } = await params;
  if (!isSubject(subject)) notFound();
  const tab = (await searchParams).tab === "long" ? "long" : "bank";
  const me = await prepViewer();
  const { topics, stats } = await loadSubject(me.id, subject);
  const long = longTopicsFor(subject);
  const longTotal = long.reduce((a, t) => a + t.items.length, 0);
  const title = subject === "ugc-paper1" ? "UGC NET Paper 1: general paper" : SUBJECT_TITLE[subject];

  return (
    <PrepFrame>
      <BackToPrep />
      <header className="space-y-2">
        {OPTIONAL_SUBJECTS.has(subject) ? <p className="w-fit rounded-full border-2 border-dashed border-foreground/60 px-2 py-0.5 text-xs font-bold text-muted-foreground">Optional</p> : null}
        <h1 className="text-h1 text-balance [overflow-wrap:anywhere]">{title}</h1>
        {tab === "bank" ? (
          <p className="text-muted-foreground">
            {stats.total} questions{stats.answered ? ` · ${stats.answered} answered · ${pctText(stats)}` : ""}
          </p>
        ) : (
          <p className="text-muted-foreground">Write it out, then check it against a model answer.</p>
        )}
      </header>

      <SubjectTabs subject={subject} active={tab} counts={{ bank: stats.total, long: longTotal }} />

      {tab === "long" ? (
        long.length ? (
          <ul className="space-y-2" aria-label="Long answer topics">
            {long.map((t) => (
              <li key={t.id}>
                <ListRow href={`/prep/${subject}/long/${t.id}`} title={t.title} sub={`${t.items.length} ${t.items.length === 1 ? "answer" : "answers"}`} />
              </li>
            ))}
          </ul>
        ) : (
          <p className={card}>Long answers for this subject are being added.</p>
        )
      ) : topics.length ? (
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
