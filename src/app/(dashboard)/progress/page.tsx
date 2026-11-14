import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Check, ChevronDown, Route, ShieldCheck } from "lucide-react";
import { requireSession } from "@/lib/auth/guards";
import { requireFeature } from "@/lib/flags";
import { MODULES } from "@/lib/study";
import { courseProgress } from "@/lib/study/progress";
import { CERTIFICATE_PASS_PCT, type CertModuleResult } from "@/lib/achievements/certificate";
import { certificateStatus } from "@/lib/achievements/certificate-server";
import { emptyStudy } from "@/lib/learn/engine";
import { loadLearnState } from "../study/actions";
import { StrengthsPanel } from "./strengths";
import { RefreshOnSave } from "@/components/save/refresh-on-save";

export const metadata: Metadata = { title: "Progress" };

/**
 * /progress: how far through the course, the certificate (which module
 * tests are passed and which remain), and strengths and weak spots.
 * One clear next step: the closest module test still to pass.
 */
export default async function ProgressPage() {
  await requireFeature("learn");
  const me = await requireSession();
  if (!me) redirect("/login");
  const [state, cert] = await Promise.all([loadLearnState(), certificateStatus(me.id)]);
  const study = state?.study ?? emptyStudy();
  const course = courseProgress(MODULES, study);
  const pctOf = new Map(course.modules.map((m) => [m.id, m.pct]));
  const results = new Map([...cert.passed, ...cert.remaining].map((r) => [r.id, r]));

  // Next step: the unpassed test with the most reading done (first in course order on a tie).
  const next = [...cert.remaining].sort((a, b) => (pctOf.get(b.id) ?? 0) - (pctOf.get(a.id) ?? 0))[0];

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <RefreshOnSave kinds={["learn"]} />
      <header className="space-y-4">
        <div className="space-y-1.5">
          <p className="text-eyebrow text-link">Progress</p>
          <h1 className="text-h1">Your progress</h1>
        </div>
        {/* Two numbers that matter, side by side: how much of the course is
            read and tested, and how many module tests are passed. */}
        <dl className="grid grid-cols-2 overflow-hidden rounded-2xl border-2 border-foreground bg-card hard-shadow-sm">
          <div className="min-w-0 p-4 sm:p-5">
            <dt className="text-eyebrow text-muted-foreground">Course done</dt>
            <dd className="mt-1 text-3xl font-black tabular-nums leading-none sm:text-4xl">{course.pct}%</dd>
            <dd className="mt-3 block h-2.5 overflow-hidden rounded-full border-2 border-foreground bg-background" aria-hidden>
              <span className="block h-full origin-left bg-brand" style={{ transform: `scaleX(${course.pct / 100})` }} />
            </dd>
          </div>
          <div className="min-w-0 border-l-2 border-foreground p-4 sm:p-5">
            <dt className="text-eyebrow text-muted-foreground">Tests passed</dt>
            <dd className="mt-1 text-3xl font-black tabular-nums leading-none sm:text-4xl">
              {cert.passed.length}
              <span className="text-base font-bold text-muted-foreground">/{cert.total}</span>
            </dd>
            <dd className="mt-3 text-caption text-muted-foreground">{CERTIFICATE_PASS_PCT}% to pass each</dd>
          </div>
        </dl>
      </header>

      {cert.eligible ? (
        <section className="flex items-start gap-3 rounded-[10px] border-2 border-foreground bg-primary p-5 text-primary-foreground hard-shadow-md" role="status">
          <ShieldCheck className="mt-0.5 size-7 shrink-0" aria-hidden />
          <div className="min-w-0">
            <h2 className="text-xl font-bold leading-tight">You have earned the course certificate</h2>
            <p className="mt-1 text-sm font-semibold">Every module test passed. The team will issue it; it appears in Achievements.</p>
          </div>
        </section>
      ) : next ? (
        <Link
          href={next.testHref}
          className="group/continue flex min-w-0 flex-col gap-4 rounded-2xl border-2 border-foreground bg-primary p-5 text-primary-foreground hard-shadow-md outline-none transition-[transform,box-shadow] duration-fast ease-snappy hover:-translate-y-0.5 hover:hard-shadow-lg focus-visible:ring-[3px] focus-visible:ring-ring/60 active:translate-y-px active:shadow-none motion-reduce:hover:translate-y-0 sm:flex-row sm:items-center"
        >
          <span className="min-w-0 flex-1">
            <span className="block text-eyebrow opacity-80">Next for your certificate</span>
            <span className="mt-1 block text-h2 [overflow-wrap:anywhere]">Module {next.num} test: {next.title}</span>
          </span>
          <span className="inline-flex min-h-12 w-full shrink-0 items-center justify-center gap-2 rounded-md border-2 border-foreground bg-foreground px-5 text-sm font-bold text-background transition-transform duration-fast ease-snappy group-hover/continue:translate-x-0.5 sm:min-h-11 sm:w-fit">
            Take the test <ArrowRight className="size-4" aria-hidden />
          </span>
        </Link>
      ) : null}

      <StrengthsPanel userId={me.id} />

      <details className="group rounded-2xl border-2 border-foreground bg-card">
        <summary className="flex min-h-12 cursor-pointer items-center gap-2 px-4 py-2">
          <span className="text-h3 flex-1">Every module test</span>
          <ChevronDown className="size-5 shrink-0 transition-transform duration-base ease-snappy group-open:rotate-180 motion-reduce:transition-none" aria-hidden />
        </summary>
        <div className="space-y-3 border-t-2 border-foreground p-3">
          <p className="text-sm text-muted-foreground">Pass each module test with {CERTIFICATE_PASS_PCT}% or more, in any order.</p>
          <ol className="space-y-2">
            {MODULES.map((m) => {
              const r = results.get(m.id);
              return <ModuleRow key={m.id} id={m.id} num={m.num} title={m.title} pct={pctOf.get(m.id) ?? 0} result={r} />;
            })}
          </ol>
        </div>
      </details>

      <Link href="/journey" className="group/row flex min-h-14 items-center gap-3 rounded-2xl border-2 border-foreground bg-card px-4 py-3 transition-[transform,box-shadow] duration-fast ease-snappy hover:-translate-y-0.5 hover:hard-shadow-sm active:translate-y-px active:shadow-none motion-reduce:hover:translate-y-0">
        <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-md border-2 border-foreground bg-secondary">
          <Route className="size-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-bold leading-tight">My journey</span>
          <span className="block text-sm text-muted-foreground">Hours, lectures and level</span>
        </span>
        <ArrowRight className="size-5 shrink-0 transition-transform duration-fast ease-snappy group-hover/row:translate-x-0.5" aria-hidden />
      </Link>
    </div>
  );
}

function ModuleRow({ id, num, title, pct, result }: { id: string; num: number; title: string; pct: number; result?: CertModuleResult }) {
  const passed = Boolean(result?.passed);
  const tried = result?.pct != null;
  return (
    <li className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-[10px] border-2 border-foreground bg-card p-3">
      <Link href={`/study/${id}`} className="flex min-h-11 min-w-0 flex-[1_1_12rem] flex-col justify-center rounded-md hover:underline">
        <span className="block text-sm font-bold leading-snug break-words">
          <span className="text-link tabular-nums">{num}</span> {title}
        </span>
        <span className="mt-1.5 flex items-center gap-2">
          <span className="block h-2 w-full max-w-40 overflow-hidden rounded-full border-2 border-foreground bg-background" aria-hidden>
            <span className="block h-full bg-brand" style={{ width: `${pct}%` }} />
          </span>
          <span className="shrink-0 text-caption font-semibold tabular-nums text-muted-foreground">{pct}% done</span>
        </span>
      </Link>
      {result ? (
        passed ? (
          <span className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full border-2 border-foreground bg-primary px-3 text-sm font-bold text-primary-foreground">
            <Check className="size-4" aria-hidden /> Passed {result.pct}%
          </span>
        ) : (
          <Link
            href={result.testHref}
            className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-[10px] border-2 border-foreground bg-background px-3 text-sm font-bold transition-transform hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            {tried ? `Best ${result.pct}%, retake` : "Take the test"} <ArrowRight className="size-4" aria-hidden />
          </Link>
        )
      ) : null}
    </li>
  );
}
