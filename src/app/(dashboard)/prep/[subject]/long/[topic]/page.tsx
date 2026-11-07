import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import { requireFeature } from "@/lib/flags";
import { SUBJECT_TITLE, isSubject } from "@/lib/prep/catalog";
import { LONG_PAGE, pageSlice } from "@/lib/prep/long";
import { longHref, longTopic } from "@/lib/prep/long-server";
import { LongMeta } from "../../../long-ui";
import { BackToPrep, PrepFrame, btnInk, btnPlain } from "../../../ui";

type Params = { params: Promise<{ subject: string; topic: string }>; searchParams: Promise<{ page?: string | string[] }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { subject, topic } = await params;
  const t = isSubject(subject) ? longTopic(subject, topic) : null;
  return { title: t ? `Long answers: ${t.title}` : "Long answers" };
}

/** /prep/<subject>/long/<topic>[?page=N]: one topic's long answers, 10 to a page, with marks and difficulty. */
export default async function LongTopicPage({ params, searchParams }: Params) {
  await requireFeature("learn");
  const { subject, topic } = await params;
  if (!isSubject(subject)) notFound();
  const t = longTopic(subject, topic);
  if (!t) notFound();
  const raw = (await searchParams).page;
  const p = pageSlice(t.items, Number(Array.isArray(raw) ? raw[0] : raw));
  const base = `/prep/${subject}/long/${t.id}`;
  const pageHref = (n: number) => (n === 1 ? base : `${base}?page=${n}`);

  return (
    <PrepFrame>
      <BackToPrep href={`/prep/${subject}?tab=long`} label={SUBJECT_TITLE[subject]} />
      <header className="space-y-1">
        <p className="text-eyebrow text-link">Long answers</p>
        <h1 className="text-h1 text-balance [overflow-wrap:anywhere]">{t.title}</h1>
        <p className="text-muted-foreground">
          {t.items.length} {t.items.length === 1 ? "answer" : "answers"}
          {p.pages > 1 ? ` · Page ${p.page} of ${p.pages}` : ""}
        </p>
      </header>

      <ol className="space-y-2" aria-label="Questions">
        {p.items.map((x, i) => (
          <li key={x.id}>
            <Link
              href={longHref(x)}
              className="flex min-h-14 items-center gap-3 rounded-md border-2 border-foreground bg-card px-4 py-3 transition-transform duration-150 hover:-translate-y-0.5 hover:hard-shadow-sm active:translate-y-px motion-reduce:transition-none motion-reduce:hover:translate-y-0 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60"
            >
              <span className="w-7 shrink-0 self-start pt-0.5 font-mono text-sm font-bold text-link" aria-hidden>
                {(p.page - 1) * LONG_PAGE + i + 1}.
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold leading-snug [overflow-wrap:anywhere]">{x.question}</span>
                <LongMeta item={x} className="mt-2" />
              </span>
              <ChevronRight className="size-5 shrink-0" aria-hidden />
            </Link>
          </li>
        ))}
      </ol>

      {p.pages > 1 ? (
        <nav aria-label="Pages" className="grid grid-cols-2 gap-2.5">
          {p.page > 1 ? (
            <Link href={pageHref(p.page - 1)} className={btnPlain}>
              <ArrowLeft className="size-4" aria-hidden /> Previous 10
            </Link>
          ) : (
            <span />
          )}
          {p.page < p.pages ? (
            <Link href={pageHref(p.page + 1)} className={btnInk}>
              Next 10 <ArrowRight className="size-4" aria-hidden />
            </Link>
          ) : null}
        </nav>
      ) : null}
    </PrepFrame>
  );
}
