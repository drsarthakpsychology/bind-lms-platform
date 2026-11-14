import Link from "next/link";
import { ArrowRight, TrendingUp } from "lucide-react";
import { EmptyState } from "@/components/design-system/empty-state";
import { getStrengthsWeaknesses, pct, type TopicScore } from "@/lib/progress/strengths";

/** Three strongest and three weakest topics, each with a way to work on it. */
export async function StrengthsPanel({ userId }: { userId: string }) {
  const sw = await getStrengthsWeaknesses(userId);
  return (
    <section aria-labelledby="sw" className="space-y-3">
      <h2 id="sw" className="text-h2">
        Strengths and weak spots
      </h2>
      {sw.hasData ? (
        <div className="grid grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-2">
          <TopicList title="Weak spots" items={sw.weakest} />
          <TopicList title="Strengths" items={sw.strongest} />
        </div>
      ) : (
        <EmptyState row icon={<TrendingUp className="size-5" />} title="Answer a few questions in Study or Exam Prep and they show here." />
      )}
      <Link href="/study/map" className="inline-flex min-h-11 items-center gap-1.5 text-sm font-bold text-link underline-offset-4 hover:underline">
        See your full map <ArrowRight className="size-4" aria-hidden />
      </Link>
    </section>
  );
}

function TopicList({ title, items }: { title: string; items: TopicScore[] }) {
  return (
    <div className="rounded-[10px] border-2 border-foreground bg-card p-4">
      <h3 className="font-bold">{title}</h3>
      {items.length ? (
        <ul className="mt-2 space-y-1">
          {items.map((t) => {
            return (
              <li key={t.id}>
                <Link href={t.practiceHref} className="flex min-h-11 items-center gap-2 rounded-md px-1 hover:bg-muted">
                  <span className="min-w-0 flex-1 text-sm font-semibold leading-snug break-words">{t.title}</span>
                  <span className="shrink-0 text-caption font-bold tabular-nums text-muted-foreground">{pct(t.p)}%</span>
                  <ArrowRight className="size-4 shrink-0" aria-hidden />
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-muted-foreground">None yet.</p>
      )}
    </div>
  );
}
