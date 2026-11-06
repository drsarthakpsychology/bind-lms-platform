import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, History } from "lucide-react";
import { requireFeature } from "@/lib/flags";
import { EXAM_SPECS, specById } from "@/content/prep/specs";
import { goalLabel } from "@/lib/prep/catalog";
import { loadMockHistory } from "@/lib/prep/server";
import { cn } from "@/lib/utils";
import { BackToPrep, PrepFrame, btnPlain, btnPrimary, card } from "../ui";
import { currentGoal, prepViewer } from "../viewer";
import { PatternFacts } from "./facts";

export const metadata: Metadata = { title: "Timed mocks" };

/** /prep/mock: the mocks for your exam first; every other pattern is one tap away. */
export default async function MocksPage() {
  await requireFeature("learn");
  const me = await prepViewer();
  const [goal, history] = await Promise.all([currentGoal(me.id), loadMockHistory(me.id, 5)]);
  const mine = goal ? EXAM_SPECS.filter((s) => s.exam === goal) : EXAM_SPECS;
  const others = goal ? EXAM_SPECS.filter((s) => s.exam !== goal) : [];
  const done = history.filter((h) => h.submittedAt);

  return (
    <PrepFrame>
      <BackToPrep />
      <header className="space-y-1">
        <p className="text-eyebrow text-link">Timed mocks{goal ? ` · ${goalLabel(goal)}` : ""}</p>
        <h1 className="text-h1">Sit a full paper</h1>
        <p className="text-muted-foreground">Real pattern, timer and marking. Questions you&apos;ve seen come last, so each mock is mostly new.</p>
      </header>

      <ul className="space-y-3">
        {mine.map((s, i) => (
          <li key={s.id} className={cn(card, i === 0 && "hard-shadow-md")}>
            <h2 className="text-h3">{s.title}</h2>
            <div className="mt-3">
              <PatternFacts spec={s} compact />
            </div>
            <Link href={`/prep/mock/${s.id}`} className={cn(i === 0 ? btnPrimary : btnPlain, "mt-4 w-full")}>
              Open <ArrowRight className="size-4" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>

      {others.length ? (
        <details className="rounded-md border-2 border-foreground bg-card">
          <summary className="flex min-h-12 cursor-pointer items-center px-4 font-semibold focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60">Other exams</summary>
          <ul className="space-y-2 border-t-2 border-foreground p-4">
            {others.map((s) => (
              <li key={s.id}>
                <Link href={`/prep/mock/${s.id}`} className={cn(btnPlain, "w-full justify-between")}>
                  <span className="min-w-0 truncate">{s.title}</span> <ArrowRight className="size-4 shrink-0" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </details>
      ) : null}

      {done.length ? (
        <section aria-labelledby="past" className="space-y-2">
          <h2 id="past" className="flex items-center gap-2 text-h3">
            <History className="size-5" aria-hidden /> Your past mocks
          </h2>
          <ul className="space-y-2">
            {done.map((h) => (
              <li key={h.id}>
                <Link href={`/prep/mock/result/${h.id}`} className={cn(btnPlain, "w-full justify-between")}>
                  <span className="min-w-0 truncate">{specById(h.specId)?.short ?? h.specId}</span>
                  <span className="shrink-0 font-mono">
                    {h.score ?? 0} / {h.max ?? 0}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </PrepFrame>
  );
}
