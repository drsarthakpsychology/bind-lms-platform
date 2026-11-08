import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { KEY } from "@/lib/prep/bank";
import { loadList } from "@/lib/prep/path";
import { toView } from "@/lib/prep/view";
import { cn } from "@/lib/utils";
import { QuestionRunner } from "./runner";
import { BackToPrep, PrepFrame, btnPlain } from "./ui";
import { prepViewer } from "./viewer";

const TABS = [
  { kind: "saved", href: "/prep/saved", label: "Saved" },
  { kind: "wrong", href: "/prep/wrong", label: "Wrong answers" },
] as const;

/**
 * Saved and Wrong answers: the questions to look at again, 10 at a time
 * (never the whole list at once). Answer them again, or show the answer.
 */
export async function RevisitPage({ kind, page }: { kind: "saved" | "wrong"; page: number }) {
  const me = await prepViewer();
  const list = await loadList(me.id, kind, page);
  const questions = list.ids.flatMap((id) => {
    const q = KEY.get(id);
    return q ? [toView(q)] : [];
  });
  const base = kind === "saved" ? "/prep/saved" : "/prep/wrong";
  const pageHref = (p: number) => (p > 1 ? `${base}?page=${p}` : base);
  const nextPage = list.page < list.pages ? { href: pageHref(list.page + 1), label: "More" } : null;

  return (
    <PrepFrame>
      <BackToPrep />
      <header className="space-y-3">
        <h1 className="text-h1">{kind === "saved" ? "Saved questions" : "Wrong answers"}</h1>
        <nav aria-label="Lists" className="grid grid-cols-2 gap-2">
          {TABS.map((t) => (
            <Link
              key={t.kind}
              href={t.href}
              aria-current={t.kind === kind ? "page" : undefined}
              className={cn(
                "inline-flex min-h-11 items-center justify-center rounded-md border-2 border-foreground px-3 text-center text-sm font-bold focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60",
                t.kind === kind ? "bg-foreground text-background" : "bg-card hover:hard-shadow-sm",
              )}
            >
              {t.label}
            </Link>
          ))}
        </nav>
        {list.total ? (
          <p className="text-sm text-muted-foreground">
            {list.total} {list.total === 1 ? "question" : "questions"}
          </p>
        ) : null}
      </header>

      <QuestionRunner
        key={`${kind}:${list.page}:${list.ids.join(",")}`}
        questions={questions}
        saved={list.saved}
        canSave={list.canSave && me.learner}
        preview={!me.learner}
        label={kind === "saved" ? "Saved questions" : "Wrong answers"}
        next={nextPage}
        again="reset"
        back={{ href: "/prep", label: "Exam Prep" }}
        empty={
          kind === "saved" ? (
            list.canSave ? (
              <>
                <p className="font-semibold">Nothing saved yet.</p>
                <p className="mt-1 text-muted-foreground">Save any question to keep it here.</p>
              </>
            ) : (
              <p className="font-semibold">Saving questions is coming soon.</p>
            )
          ) : (
            <>
              <p className="font-semibold">No wrong answers to look at.</p>
              <p className="mt-1 text-muted-foreground">Questions you get wrong show up here.</p>
            </>
          )
        }
      />

      {list.pages > 1 ? (
        <nav aria-label="Pages" className="flex flex-wrap items-center justify-between gap-2">
          {list.page > 1 ? (
            <Link href={pageHref(list.page - 1)} className={btnPlain}>
              <ArrowLeft className="size-4" aria-hidden /> Previous 10
            </Link>
          ) : (
            <span />
          )}
          <span className="text-sm font-semibold">
            Page {list.page} of {list.pages}
          </span>
          {nextPage ? (
            <Link href={nextPage.href} className={btnPlain}>
              More <ArrowRight className="size-4" aria-hidden />
            </Link>
          ) : (
            <span />
          )}
        </nav>
      ) : null}
    </PrepFrame>
  );
}

export function pageParam(raw: string | string[] | undefined): number {
  const n = Number(Array.isArray(raw) ? raw[0] : raw);
  return Number.isInteger(n) && n > 0 ? n : 1;
}
