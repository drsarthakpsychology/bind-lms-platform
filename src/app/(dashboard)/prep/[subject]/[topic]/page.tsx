import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen } from "lucide-react";
import { requireFeature } from "@/lib/flags";
import { KEY, bankTopics, learnHrefForTopic } from "@/lib/prep/bank";
import { SUBJECT_TITLE, isSubject } from "@/lib/prep/catalog";
import { loadTopicSet } from "@/lib/prep/path";
import { toView } from "@/lib/prep/view";
import { QuestionRunner } from "../../runner";
import { BackToPrep, PrepFrame } from "../../ui";
import { prepViewer } from "../../viewer";
import { SetPicker } from "../../set-picker";

type Params = { params: Promise<{ subject: string; topic: string }>; searchParams: Promise<{ set?: string | string[] }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { subject, topic } = await params;
  const t = isSubject(subject) ? bankTopics(subject).find((x) => x.id === topic) : undefined;
  return { title: t ? `${t.title}: ${SUBJECT_TITLE[subject as keyof typeof SUBJECT_TITLE]}` : "Exam Prep" };
}

/**
 * /prep/<subject>/<topic>[?set=N]: a set of 10. Without ?set it opens the
 * first set with questions left. Every set is open; the chips jump to any.
 */
export default async function TopicPage({ params, searchParams }: Params) {
  await requireFeature("learn");
  const { subject, topic } = await params;
  if (!isSubject(subject)) notFound();
  const raw = (await searchParams).set;
  const n = Number(Array.isArray(raw) ? raw[0] : raw);
  const me = await prepViewer();
  const view = await loadTopicSet(me.id, subject, topic, Number.isInteger(n) ? n : null);
  if (!view) notFound();
  const questions = view.ids.flatMap((id) => {
    const q = KEY.get(id);
    return q ? [toView(q)] : [];
  });
  const nextChip = view.sets[view.set + 1];
  // After the last set of a topic, the next step is the next topic of the subject.
  const topics = bankTopics(subject);
  const at = topics.findIndex((x) => x.id === topic);
  const nextTopic = nextChip || at < 0 ? undefined : topics[at + 1];

  return (
    <PrepFrame>
      <BackToPrep href={`/prep/${subject}`} label={SUBJECT_TITLE[subject]} />
      <header className="space-y-3">
        <h1 className="text-h1 text-balance [overflow-wrap:anywhere]">{view.title}</h1>
        {view.sets.length > 1 ? (
          <SetPicker sets={view.sets.map((x) => ({ n: x.n, href: x.href, done: x.stats.answered === x.stats.total }))} current={view.set} />
        ) : null}
      </header>

      <QuestionRunner
        key={`${topic}:${view.set}`}
        questions={questions}
        start={view.start}
        prior={view.prior}
        saved={view.saved}
        canSave={view.canSave && me.learner}
        preview={!me.learner}
        label={`${view.title}, set ${view.set + 1}`}
        next={nextChip ? { href: nextChip.href, label: "Next set" } : nextTopic ? { href: `/prep/${subject}/${nextTopic.id}`, label: `Next topic: ${nextTopic.title}` } : null}
        again="reset"
        back={{ href: `/prep/${subject}`, label: `Back to ${SUBJECT_TITLE[subject]}` }}
        empty={<p className="font-semibold">Questions for this topic are being added.</p>}
      />

      <Link href={learnHrefForTopic(subject, topic)} className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-link hover:underline">
        <BookOpen className="size-4" aria-hidden /> Learn this topic in Study
      </Link>
    </PrepFrame>
  );
}
