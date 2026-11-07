import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireFeature } from "@/lib/flags";
import { isSubject } from "@/lib/prep/catalog";
import { LONG_PAGE } from "@/lib/prep/long";
import { longHref, longTopic } from "@/lib/prep/long-server";
import { LongPractice } from "../../../../long-practice";
import { LongAnswerBody, LongMeta } from "../../../../long-ui";
import { BackToPrep, PrepFrame } from "../../../../ui";

type Params = { params: Promise<{ subject: string; topic: string; id: string }> };

async function find(params: Params["params"]) {
  const { subject, topic, id } = await params;
  if (!isSubject(subject)) return null;
  const t = longTopic(subject, topic);
  const i = t ? t.items.findIndex((x) => x.id === id) : -1;
  return t && i >= 0 ? { t, i, item: t.items[i] } : null;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const f = await find(params);
  return { title: f ? `Long answer: ${f.t.title}` : "Long answers" };
}

/**
 * /prep/<subject>/long/<topic>/<id>: one long answer. Plan it, show the
 * model answer, tick the key points. Previous and Next stay in the topic.
 */
export default async function LongAnswerPage({ params }: Params) {
  await requireFeature("learn");
  const f = await find(params);
  if (!f) notFound();
  const { t, i, item } = f;
  const page = Math.floor(i / LONG_PAGE) + 1;
  const back = `/prep/${item.subject}/long/${t.id}${page > 1 ? `?page=${page}` : ""}`;
  const prev = t.items[i - 1];
  const next = t.items[i + 1];
  const study = item.studyHref ? { href: item.studyHref, label: item.source === "study" && item.studyTitle ? `Open in Study: ${item.studyTitle}` : "Learn this in Study" } : null;

  return (
    <PrepFrame>
      <BackToPrep href={back} label={t.title} />
      <header className="space-y-3">
        <p className="text-sm font-semibold text-muted-foreground">
          {i + 1} of {t.items.length}
        </p>
        <h1 className="text-h2 leading-snug text-balance [overflow-wrap:anywhere]">{item.question}</h1>
        <LongMeta item={item} />
      </header>
      <LongPractice
        key={item.id}
        id={item.id}
        plan={item.plan}
        keyPoints={item.keyPoints}
        pitfalls={item.pitfalls}
        answer={<LongAnswerBody blocks={item.blocks} visuals={item.visuals} />}
        study={study}
        prev={prev ? longHref(prev) : null}
        next={next ? longHref(next) : null}
      />
    </PrepFrame>
  );
}
