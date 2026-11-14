"use client";

import * as React from "react";
import Link from "next/link";
import { AlertTriangle, ArrowDown, ArrowLeft, ArrowRight, BookOpen, Check, CircleStop, ClipboardCheck, Microscope, Pill, Shuffle, Syringe, Users } from "lucide-react";
import type { Med } from "@/lib/meds/types";
import type { Mechanism } from "@/lib/meds/mechanisms";
import type { MedVisual } from "@/lib/meds/visuals";
import { HOW_IT_WORKS, splitTell, type SectionId } from "@/lib/meds/sections";
import { MedicineSketches } from "./medicine-visuals";
import { cn } from "@/lib/utils";
import { backLinkClass } from "@/components/design-system/back-link";

type View = "student" | "clinician";
const KEY = "vibha-med-view";
let memo: View | null = null;
const listeners = new Set<() => void>();
function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}
function readView(): View {
  if (memo) return memo;
  try {
    const v = localStorage.getItem(KEY);
    if (v === "student" || v === "clinician") return v;
  } catch {
    /* storage unavailable */
  }
  return "student";
}
function saveView(v: View) {
  try {
    localStorage.setItem(KEY, v);
  } catch {
    /* ignore */
  }
  memo = v;
  listeners.forEach((l) => l());
}

/**
 * One medicine, practical facts first: what it is used for, doses and how to
 * take it, side effects, monitoring, interactions, warnings, special groups,
 * switching and stopping, and last "How it works" (anchor #how-it-works) with
 * the mechanism and every picture. Student or clinician words at any time.
 * `study`: the Study module that teaches this medicine (only when Study is open for this student).
 */
export function MedicineView({ med, related, mech, visuals = [], half = null, study = null }: { med: Med; related: { id: string; name: string; cls: string }[]; mech?: Mechanism; visuals?: MedVisual[]; half?: { hl: string; meaning: string } | null; study?: { href: string; title: string } | null }) {
  const view = React.useSyncExternalStore(subscribe, readView, () => "student" as View);
  const [i, setI] = React.useState(med.defaultDose);
  const dose = med.doses[i];
  const pick = saveView;
  const tell = splitTell(med);
  const hasHow = Boolean(mech) || visuals.length > 0;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link href="/practice/medicines" className={backLinkClass}>
        <ArrowLeft className="size-4" aria-hidden /> Back to Medicines
      </Link>

      <header className="rounded-3xl border-2 border-foreground bg-brand p-5 text-brand-foreground sm:p-6">
        <p className="text-eyebrow opacity-90">
          {med.group} · {med.cls}
        </p>
        <h1 className="mt-1 break-words text-display">{med.name}</h1>
        {hasHow ? (
          <a href={`#${HOW_IT_WORKS}`} className="mt-2 inline-flex min-h-11 items-center gap-1.5 text-sm font-bold underline underline-offset-4">
            How it works <ArrowDown className="size-4" aria-hidden />
          </a>
        ) : null}
      </header>

      {/* View switch: sticks to the top while scrolling on phones */}
      <div className="sticky top-0 z-20 -mx-4 bg-background/95 px-4 py-2 backdrop-blur sm:static sm:mx-0 sm:bg-transparent sm:p-0">
        <div className="grid grid-cols-2 gap-1 rounded-full border-2 border-foreground bg-card p-1 sm:inline-grid" role="radiogroup" aria-label="How much detail">
          {(
            [
              ["student", "Student"],
              ["clinician", "Clinician"],
            ] as const
          ).map(([v, l]) => (
            <button
              key={v}
              type="button"
              role="radio"
              aria-checked={view === v}
              onClick={() => pick(v)}
              className={cn("h-10 rounded-full px-5 text-sm font-bold transition-colors", view === v ? "bg-foreground text-background" : "")}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* 1. What it is used for */}
      <section id="uses" data-section="uses" aria-labelledby="uses-h" className="space-y-3 scroll-mt-20">
        <h2 id="uses-h" className="flex items-center gap-2 text-lg font-bold">
          <Pill className="size-5 text-link" aria-hidden /> Used for
        </h2>
        <ul className="flex flex-wrap gap-1.5">
          {med.uses.map((u) => (
            <li key={u} className="rounded-full border-2 border-foreground bg-card px-3 py-1 text-sm font-semibold">
              {u}
            </li>
          ))}
        </ul>
        <p className="text-[1.0625rem] leading-relaxed">{view === "student" ? med.student : med.clinician}</p>
        <ul className="grid gap-2 sm:grid-cols-3">
          {med.standout.map((s) => (
            <li key={s} className="flex gap-2 rounded-2xl border-2 border-foreground bg-card p-3 text-sm font-semibold">
              <Check className="mt-0.5 size-4 shrink-0 text-link" aria-hidden /> {s}
            </li>
          ))}
        </ul>
      </section>

      {/* 2. Doses, how to take it, forms, Indian brands */}
      <section id="doses" data-section="doses" aria-labelledby="doses-h" className="space-y-4 rounded-3xl border-2 border-foreground bg-card p-4 hard-shadow-sm scroll-mt-20 sm:p-5">
        <h2 id="doses-h" className="flex items-center gap-2 text-lg font-bold">
          <Syringe className="size-5 text-link" aria-hidden /> Doses
        </h2>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0" role="tablist" aria-label="Doses">
          {med.doses.map((d, k) => (
            <button
              key={d.amount}
              type="button"
              role="tab"
              aria-selected={k === i}
              onClick={() => setI(k)}
              className={cn(
                "flex shrink-0 flex-col items-start rounded-2xl border-2 border-foreground px-3.5 py-2 text-left transition-colors",
                k === i ? "bg-primary text-primary-foreground" : "bg-background hover:bg-muted",
              )}
            >
              <span className="text-base font-bold tabular-nums">{d.amount}</span>
              <span className="text-xs font-semibold opacity-80">{d.label}</span>
            </button>
          ))}
        </div>

        <div key={i} role="tabpanel" className="space-y-3">
          <p className="text-sm font-semibold text-link">Used for: {dose.use}</p>
          <p className="text-[1.0625rem] leading-relaxed">{view === "student" ? dose.student : dose.clinician}</p>
          {view === "student" ? (
            <details className="rounded-xl border-2 border-foreground/20 p-3 text-sm">
              <summary className="cursor-pointer font-semibold">Clinician detail for this dose</summary>
              <p className="mt-2 leading-relaxed text-muted-foreground">{dose.clinician}</p>
            </details>
          ) : null}
          {dose.watch?.length ? (
            <div className="rounded-2xl border-2 border-foreground bg-muted p-3">
              <p className="text-eyebrow">Watch for at this dose</p>
              <ul className="mt-1.5 flex flex-wrap gap-1.5">
                {dose.watch.map((w) => (
                  <li key={w} className="rounded-full border-2 border-foreground bg-card px-2.5 py-0.5 text-sm font-medium">
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <div className="flex justify-between gap-2">
            <button type="button" disabled={i === 0} onClick={() => setI(i - 1)} className="h-10 rounded-full border-2 border-foreground px-4 text-sm font-semibold disabled:opacity-30">
              ← Lower dose
            </button>
            <button type="button" disabled={i === med.doses.length - 1} onClick={() => setI(i + 1)} className="h-10 rounded-full border-2 border-foreground px-4 text-sm font-semibold disabled:opacity-30">
              Higher dose →
            </button>
          </div>
        </div>

        <dl className="grid gap-3 border-t-2 border-foreground/15 pt-4 text-[0.95rem] leading-relaxed sm:grid-cols-2">
          {tell.take.length ? (
            <div className="sm:col-span-2">
              <dt className="text-sm font-bold uppercase tracking-wide">How to take it</dt>
              <dd>
                <ul className="mt-1 list-disc space-y-1 pl-5">{tell.take.map((u) => <li key={u}>{u}</li>)}</ul>
              </dd>
            </div>
          ) : null}
          <div>
            <dt className="text-sm font-bold uppercase tracking-wide">Forms</dt>
            <dd className="mt-1">{med.forms}</dd>
          </div>
          <div>
            <dt className="text-sm font-bold uppercase tracking-wide">Indian brands</dt>
            <dd className="mt-1">{med.brands.join(", ")}</dd>
          </div>
        </dl>
        <p className="text-caption text-muted-foreground">
          Typical adult doses, for learning. The prescriber chooses the dose for each patient; always check the current label and local guidance.
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        {/* 3. Side effects */}
        <Box id="side-effects" icon={<Pill className="size-4" aria-hidden />} title="Side effects">
          <ul className="list-disc space-y-1 pl-5">{med.common.map((u) => <li key={u}>{u}</li>)}</ul>
        </Box>
        {/* 4. Monitoring */}
        <Box id="monitoring" icon={<ClipboardCheck className="size-4" aria-hidden />} title="What to check">
          <ul className="list-disc space-y-1 pl-5">{med.checks.map((u) => <li key={u}>{u}</li>)}</ul>
        </Box>
        {/* 5. Interactions */}
        {med.interactions.length ? (
          <Box id="interactions" icon={<Shuffle className="size-4" aria-hidden />} title="Interactions">
            <ul className="list-disc space-y-1 pl-5">{med.interactions.map((u) => <li key={u}>{u}</li>)}</ul>
          </Box>
        ) : null}
        {/* 6. Warnings */}
        <Box id="warnings" icon={<AlertTriangle className="size-4" aria-hidden />} title="Serious: act the same day" danger>
          <ul className="list-disc space-y-1 pl-5">{[...med.serious, ...tell.warn].map((u) => <li key={u}>{u}</li>)}</ul>
        </Box>
        {/* 7. Special groups */}
        <Box id="groups" icon={<Users className="size-4" aria-hidden />} title="Special groups">
          <dl className="space-y-2">
            {med.groups.map((g) => (
              <div key={g.label}>
                <dt className="font-semibold">{g.label}</dt>
                <dd className="text-muted-foreground">{g.text}</dd>
              </div>
            ))}
          </dl>
        </Box>
        {/* 8. Switching and stopping */}
        {tell.stopping.length || half ? (
          <Box id="stopping" icon={<CircleStop className="size-4" aria-hidden />} title="Switching and stopping">
            <ul className="list-disc space-y-1 pl-5">
              {tell.stopping.map((u) => <li key={u}>{u}</li>)}
              {half ? <li>Half-life {half.hl}. After the last dose, levels take about 4 to 5 half-lives to wash out.</li> : null}
            </ul>
          </Box>
        ) : null}
      </div>

      {related.length || study ? (
        <nav aria-label="Related" className="space-y-2">
          {related.length ? (
            <>
              <h2 className="text-lg font-bold">Compare with</h2>
              <div className="flex flex-wrap gap-2">
                {related.map((r) => (
                  <Link key={r.id} href={`/practice/medicines/${r.id}`} className="rounded-full border-2 border-foreground bg-card px-3.5 py-1.5 text-sm font-semibold hover:bg-primary">
                    {r.name} <span className="font-normal text-muted-foreground">· {r.cls}</span>
                  </Link>
                ))}
              </div>
            </>
          ) : null}
          {study ? (
            <Link href={study.href} className="inline-flex min-h-11 items-center gap-1.5 text-sm font-bold text-link underline-offset-4 hover:underline [overflow-wrap:anywhere]">
              <BookOpen className="size-4 shrink-0" aria-hidden /> Learn it in Study: {study.title} <ArrowRight className="size-4 shrink-0" aria-hidden />
            </Link>
          ) : null}
        </nav>
      ) : null}

      {/* 9. How it works: last, linkable as #how-it-works */}
      {hasHow ? (
        <section id={HOW_IT_WORKS} data-section={HOW_IT_WORKS} aria-labelledby="how-h" className="space-y-4 scroll-mt-20 sm:rounded-3xl sm:border-2 sm:border-foreground sm:bg-card sm:p-5 sm:hard-shadow-sm">
          <h2 id="how-h" className="flex items-center gap-2 text-lg font-bold">
            <Microscope className="size-5 text-link" aria-hidden /> How it works
          </h2>
          {mech ? (
            <>
              <p className="text-[1.0625rem] leading-relaxed">{mech.plain}</p>
              <div className="-mx-1 overflow-x-auto">
                <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b-2 border-foreground">
                      <th scope="col" className="py-2 pr-3 font-bold">Target</th>
                      {view === "clinician" ? <th scope="col" className="py-2 pr-3 font-bold">Action</th> : null}
                      <th scope="col" className="py-2 font-bold">What it means</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mech.targets.map((t) => (
                      <tr key={t.target} className="border-b border-foreground/15 align-top">
                        <td className="py-2 pr-3 font-semibold">{t.target}</td>
                        {view === "clinician" ? <td className="py-2 pr-3">{t.action}</td> : null}
                        <td className="py-2 text-muted-foreground">{t.effect}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : null}
          <MedicineSketches med={med} mech={mech} visuals={visuals} />
        </section>
      ) : null}
    </div>
  );
}

function Box({ id, icon, title, children, danger }: { id: SectionId; icon: React.ReactNode; title: string; children: React.ReactNode; danger?: boolean }) {
  return (
    <section id={id} data-section={id} aria-labelledby={`${id}-h`} className={cn("scroll-mt-20 rounded-2xl border-2 p-4 text-[0.95rem] leading-relaxed", danger ? "border-status-alert-fg bg-status-alert-bg text-status-alert-fg" : "border-foreground bg-card")}>
      <h2 id={`${id}-h`} className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wide">
        {icon} {title}
      </h2>
      {children}
    </section>
  );
}
