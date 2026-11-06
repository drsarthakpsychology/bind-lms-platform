import Link from "next/link";
import { Download, TriangleAlert } from "lucide-react";
import { SectionEyebrow } from "@/components/landing/landing-primitives";
import type { LabInsight, LearningInsights, ModuleInsight, ResultStat, StudentSummary } from "@/lib/insights/learning";
import { cn } from "@/lib/utils";

/**
 * Presentational half of /admin/learning. Takes already-aggregated numbers
 * (no student JSON, no I/O), so it renders the same from the page and from a
 * fixture harness.
 */

const card = "rounded-2xl border-2 border-foreground bg-card p-4";

function Bar({ value, max, label }: { value: number; max: number; label: string }) {
  const w = max > 0 ? Math.max(0, Math.min(100, (value / max) * 100)) : 0;
  return (
    <div className="h-2.5 rounded-full border border-foreground/20 bg-muted" role="img" aria-label={label}>
      <div className="h-full rounded-full bg-primary" style={{ width: `${w}%` }} />
    </div>
  );
}

const fmt = (n: number, unit: string) => (unit === "%" ? `${n}%` : unit ? `${n} ${unit}` : String(n));
const days = (n: number | null) => (n === null ? "—" : n === 0 ? "Today" : n === 1 ? "Yesterday" : `${n} days ago`);

function names(list: StudentSummary[], n = 8) {
  const shown = list.slice(0, n).map((s) => s.name).join(", ");
  return list.length > n ? `${shown} and ${list.length - n} more` : shown;
}

function ModuleRow({ m, students }: { m: ModuleInsight; students: number }) {
  return (
    <li className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-3 gap-y-1">
      <span className="min-w-0 text-sm font-semibold">
        <span className="text-numeric text-link">{String(m.num).padStart(2, "0")}</span> {m.title}
      </span>
      <span className="pt-0.5 text-right text-numeric text-xs">
        {m.completed}/{students} done
        <span className="text-muted-foreground"> · {m.avgTestPct === null ? "no tests" : `test ${m.avgTestPct}%`}</span>
      </span>
      <div className="col-span-2">
        <Bar value={m.completed} max={students} label={`${m.completed} of ${students} students finished ${m.title}`} />
      </div>
      {m.started > m.completed ? <span className="col-span-2 text-caption text-muted-foreground">{m.started - m.completed} in progress</span> : null}
    </li>
  );
}

function Headline({ id, stats }: { id: string; stats: ResultStat[] }) {
  if (!stats.length) return null;
  // The serial position curve reads best as columns; everything else as tiles
  // (illusion settings can pass 100%, so a 0–100 bar would mislead).
  if (id === "serial-position") {
    return (
      <ul className="mt-3 flex items-end gap-3">
        {stats.map((s) => (
          <li key={s.key} className="flex flex-1 flex-col items-center gap-1">
            <span className="text-numeric text-xs font-bold">{s.mean}%</span>
            <div className="flex h-24 w-full items-end rounded-md border border-foreground/20 bg-muted" role="img" aria-label={`${s.label}: ${s.mean}% recalled on average`}>
              <div className="w-full rounded-md bg-primary" style={{ height: `${Math.max(2, Math.min(100, s.mean))}%` }} />
            </div>
            <span className="text-center text-caption text-muted-foreground">{s.label}</span>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <dl className="mt-3 grid grid-cols-2 gap-2">
      {stats.map((s) => (
        <div key={s.key} className="rounded-xl border-2 border-foreground/15 bg-background px-3 py-2">
          <dt className="text-caption text-muted-foreground">{s.label}</dt>
          <dd className="text-numeric text-lg font-bold">{fmt(s.mean, s.unit)}</dd>
        </div>
      ))}
    </dl>
  );
}

function LabCard({ l }: { l: LabInsight }) {
  const n = Math.max(0, ...l.headline.map((h) => h.n));
  return (
    <li className={cn(card, "flex flex-col")}>
      <h3 className="text-h3">{l.title}</h3>
      {l.students === 0 ? (
        <p className="mt-1 text-sm text-muted-foreground">Nobody has done this yet.</p>
      ) : (
        <>
          <p className="mt-1 text-numeric text-xs text-muted-foreground">
            {l.students} {l.students === 1 ? "student" : "students"} · {l.runs} runs · check {l.avgCheckPct === null ? "—" : `${l.avgCheckPct}%`} · reflected {l.reflectPct ?? 0}%
          </p>
          {l.headline.length ? (
            <>
              <p className="mt-3 text-eyebrow text-link">Our class{n ? ` · ${n}` : ""}</p>
              <Headline id={l.id} stats={l.headline} />
            </>
          ) : null}
        </>
      )}
    </li>
  );
}

export function LearningInsightsView({ data, csvHref }: { data: LearningInsights; csvHref: string }) {
  const { students, started } = data;
  const finished = data.modules.reduce((a, m) => a + m.completed, 0);
  const labRuns = data.lab.reduce((a, l) => a + l.runs, 0);
  const notStarted = data.perStudent.filter((s) => !s.started);
  const maxConf = Math.max(1, ...data.confusions.map((c) => c.times));
  const labUsed = data.lab.filter((l) => l.students > 0);
  const labUnused = data.lab.filter((l) => l.students === 0);

  return (
    <div className="min-w-0 space-y-8">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
        {[
          [`${started}/${students}`, "started self-study"],
          [finished, "modules finished"],
          [labRuns, "Lab runs"],
          [data.inactive.length, "quiet for 7+ days"],
        ].map(([v, l]) => (
          <div key={String(l)} className="rounded-2xl border-2 border-foreground bg-card p-3">
            <p className="text-numeric text-2xl font-black">{v}</p>
            <p className="text-caption text-muted-foreground">{l}</p>
          </div>
        ))}
      </div>

      {data.inactive.length || data.manyDue.length || notStarted.length ? (
        <div className="space-y-2">
          {data.inactive.length ? (
            <div className="flex items-start gap-3 rounded-2xl border-2 border-foreground bg-foreground p-4 text-background">
              <TriangleAlert className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
              <p className="text-sm">
                <b className="text-primary">Quiet for over a week:</b> {names(data.inactive)}.{" "}
                <Link href="/admin/people?view=students" className="font-bold underline underline-offset-4">
                  Message them
                </Link>
              </p>
            </div>
          ) : null}
          {data.manyDue.length ? (
            <p className={cn(card, "text-sm")}>
              <b>Many reviews waiting:</b> {data.manyDue.slice(0, 8).map((s) => `${s.name} (${s.dueReviews})`).join(", ")}
              {data.manyDue.length > 8 ? ` and ${data.manyDue.length - 8} more` : ""}.
            </p>
          ) : null}
          {notStarted.length ? (
            <p className="text-sm text-muted-foreground">
              Not started yet: {names(notStarted)}.
            </p>
          ) : null}
        </div>
      ) : null}

      <section aria-labelledby="li-modules" className="space-y-3">
        <SectionEyebrow index="01">Course</SectionEyebrow>
        <h2 id="li-modules" className="text-h2">
          Modules
        </h2>
        <ul className={cn(card, "space-y-4")}>
          {data.modules.map((m) => (
            <ModuleRow key={m.id} m={m} students={students} />
          ))}
        </ul>
      </section>

      <section aria-labelledby="li-hard" className="space-y-3">
        <SectionEyebrow index="02">Hard spots</SectionEyebrow>
        <h2 id="li-hard" className="text-h2">
          Where the class <em className="font-serif font-normal italic">struggles</em>
        </h2>
        <div className="grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-2">
          <div className={card}>
            <h3 className="text-h3">Lowest test scores</h3>
            {data.struggles.length ? (
              <ul className="mt-3 space-y-3">
                {data.struggles.map((m) => (
                  <li key={m.id}>
                    <div className="flex justify-between gap-3 text-sm">
                      <span className="min-w-0 font-semibold">{m.title}</span>
                      <span className="shrink-0 text-numeric text-xs">
                        {m.avgTestPct}% <span className="text-muted-foreground">· {m.testTakers} took it</span>
                      </span>
                    </div>
                    <Bar value={m.avgTestPct ?? 0} max={100} label={`${m.title}: average best test ${m.avgTestPct}%`} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-1 text-sm text-muted-foreground">Not enough tests taken yet.</p>
            )}
          </div>
          <div className={card}>
            <h3 className="text-h3">Mixed up most often</h3>
            {data.confusions.length ? (
              <ul className="mt-3 space-y-3">
                {data.confusions.map((c) => (
                  <li key={`${c.a}|${c.b}`}>
                    <div className="flex justify-between gap-3 text-sm">
                      <span className="min-w-0 font-semibold">
                        {c.aLabel} <span className="text-muted-foreground">vs</span> {c.bLabel}
                      </span>
                      <span className="shrink-0 text-numeric text-xs">
                        {c.times}× <span className="text-muted-foreground">· {c.students} {c.students === 1 ? "student" : "students"}</span>
                      </span>
                    </div>
                    <Bar value={c.times} max={maxConf} label={`${c.aLabel} confused with ${c.bLabel} ${c.times} times`} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-1 text-sm text-muted-foreground">No mix-ups recorded yet.</p>
            )}
          </div>
        </div>
      </section>

      <section aria-labelledby="li-lab" className="space-y-3">
        <SectionEyebrow index="03">Psychology Lab</SectionEyebrow>
        <h2 id="li-lab" className="text-h2">
          Class results
        </h2>
        <p className="text-sm text-muted-foreground">Averages of each student&apos;s latest run. Use them in class.</p>
        {labUsed.length ? (
          <ul className="grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {labUsed.map((l) => (
              <LabCard key={l.id} l={l} />
            ))}
          </ul>
        ) : (
          <p className={cn(card, "text-sm text-muted-foreground")}>No experiments done yet.</p>
        )}
        {labUnused.length && labUsed.length ? (
          <p className="text-caption text-muted-foreground">Not done by anyone yet: {labUnused.map((l) => l.title).join(", ")}.</p>
        ) : null}
      </section>

      <section aria-labelledby="li-students" className="space-y-3">
        <SectionEyebrow index="04">Students</SectionEyebrow>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="li-students" className="text-h2">
            Every student
          </h2>
          <a
            href={csvHref}
            download
            className="inline-flex h-11 items-center gap-2 rounded-md border-2 border-foreground bg-primary px-4 text-sm font-bold text-primary-foreground hard-shadow-sm transition-transform duration-150 hover:-translate-y-0.5 active:translate-x-px active:translate-y-px"
          >
            <Download className="size-4" aria-hidden /> Download CSV
          </a>
        </div>
        <div className="overflow-x-auto rounded-2xl border-2 border-foreground bg-card">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="border-b-2 border-foreground bg-muted text-left text-caption">
              <tr>
                <th className="px-3 py-2">Student</th>
                <th className="px-3 py-2">Last active</th>
                <th className="px-3 py-2">Sections</th>
                <th className="px-3 py-2">Modules done</th>
                <th className="px-3 py-2">Test avg</th>
                <th className="px-3 py-2">Lab</th>
                <th className="px-3 py-2">Reviews due</th>
              </tr>
            </thead>
            <tbody className="text-numeric">
              {data.perStudent.map((s) => (
                <tr key={s.userId} className={cn("border-b border-foreground/10 last:border-0", s.daysInactive !== null && s.daysInactive > 7 && "bg-status-alert-bg")}>
                  <td className="px-3 py-2 font-sans">
                    <Link href={`/admin/students/${s.userId}?tab=activity`} className="font-bold text-link underline-offset-4 hover:underline">
                      {s.name}
                    </Link>
                  </td>
                  <td className="px-3 py-2">{s.started ? days(s.daysInactive) : "Not started"}</td>
                  <td className="px-3 py-2">{s.sectionsDone}</td>
                  <td className="px-3 py-2">{s.modulesCompleted}</td>
                  <td className="px-3 py-2">{s.avgTestPct === null ? "—" : `${s.avgTestPct}%`}</td>
                  <td className="px-3 py-2">{s.labsDone}</td>
                  <td className="px-3 py-2">{s.dueReviews}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
