import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Check, ShieldCheck } from "lucide-react";
import { requireSession } from "@/lib/auth/guards";
import { requireFeature } from "@/lib/flags";
import { MODULES } from "@/lib/study";
import { courseProgress } from "@/lib/study/progress";
import { CERTIFICATE_PASS_PCT, type CertModuleResult } from "@/lib/achievements/certificate";
import { certificateStatus } from "@/lib/achievements/certificate-server";
import { emptyStudy } from "@/lib/learn/engine";
import { loadLearnState } from "../study/actions";
import { StrengthsPanel } from "./strengths";

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
      <header className="space-y-3">
        <p className="text-eyebrow text-link">Progress</p>
        <h1 className="text-h1">{course.pct}% complete</h1>
        <span className="block h-3 max-w-md overflow-hidden rounded-full border-2 border-foreground bg-card" aria-hidden>
          <span className="block h-full bg-brand" style={{ width: `${course.pct}%` }} />
        </span>
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
          className="btn-sweep flex min-h-14 items-center gap-4 rounded-[10px] border-2 border-foreground bg-primary p-5 text-primary-foreground hard-shadow-md transition-transform hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
        >
          <span className="min-w-0 flex-1">
            <span className="block text-xs font-semibold uppercase tracking-wide opacity-80">Next for your certificate</span>
            <span className="block text-xl font-bold leading-tight break-words">Module {next.num} test: {next.title}</span>
          </span>
          <ArrowRight className="size-6 shrink-0" aria-hidden />
        </Link>
      ) : null}

      <StrengthsPanel userId={me.id} />

      <details className="group rounded-[10px] border-2 border-foreground bg-card">
        <summary className="flex min-h-12 cursor-pointer flex-wrap items-center gap-x-2 px-4 py-2">
          <span className="text-h3">Certificate</span>
          <span className="text-sm font-semibold text-muted-foreground">
            {cert.passed.length} of {cert.total} module tests passed
          </span>
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
          <span className="shrink-0 text-caption font-semibold tabular-nums text-muted-foreground">{pct}% complete</span>
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
