import type { Metadata } from "next";
import Link from "next/link";
import { requireFeature } from "@/lib/flags";
import { KEY } from "@/lib/prep/bank";
import { loadSmart } from "@/lib/prep/path";
import { toView } from "@/lib/prep/view";
import { QuestionRunner } from "../runner";
import { BackToPrep, PrepFrame } from "../ui";
import { prepViewer } from "../viewer";

export const metadata: Metadata = { title: "Smart practice" };

/**
 * /prep/smart: one mixed set of 10 from your weak topics and the questions
 * due for review. Replaces Coach, the Quiz path and Today's practice (their
 * old addresses come here).
 */
export default async function SmartPage() {
  await requireFeature("learn");
  const me = await prepViewer();
  const smart = await loadSmart(me.id);
  const questions = smart.ids.flatMap((id) => {
    const q = KEY.get(id);
    return q ? [toView(q)] : [];
  });
  return (
    <PrepFrame>
      <BackToPrep />
      <header className="space-y-1">
        <h1 className="text-h1">Smart practice</h1>
        <p className="text-muted-foreground">{smart.reviews ? `10 questions from your weak topics, including ${smart.reviews} you missed before.` : "10 questions from your weak topics."}</p>
      </header>
      <QuestionRunner
        key={smart.ids.join(",")}
        questions={questions}
        saved={smart.saved}
        canSave={smart.canSave && me.learner}
        preview={!me.learner}
        label="Smart practice"
        again="refresh"
        againLabel="Another 10"
        back={{ href: "/prep", label: "Exam Prep" }}
        empty={<p className="font-semibold">Questions are being added.</p>}
      />
      <details className="border-t-2 border-dashed border-foreground/30 pt-2">
        <summary className="flex min-h-11 cursor-pointer items-center text-sm font-semibold text-muted-foreground">More ways to practise</summary>
        <ul className="mt-2 flex flex-wrap gap-2" aria-label="More ways to practise">
          {[
            { href: "/games/coach", label: "Words you mix up" },
            { href: "/games/quizzes", label: "Quiz path" },
            { href: "/games/revise", label: "Revise today" },
          ].map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="inline-flex min-h-11 items-center rounded-md border-2 border-foreground bg-card px-3 text-sm font-semibold hover:bg-secondary">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </details>
    </PrepFrame>
  );
}
