"use client";

import * as React from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, Check, ClipboardCheck, MessageCircle, Microscope, Pill, Shuffle, Users } from "lucide-react";
import type { Med } from "@/lib/meds/types";
import type { Mechanism } from "@/lib/meds/mechanisms";
import type { MedVisual } from "@/lib/meds/visuals";
import { MedicineVisual } from "./medicine-visuals";
import { Journey, Receptor } from "@/components/study/animations";
import { cn } from "@/lib/utils";

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
 * One medicine: pick a dose chip to see what happens at that dose; switch
 * between plain student words and clinician detail at any time.
 */
export function MedicineView({ med, related, mech, visuals = [] }: { med: Med; related: { id: string; name: string; cls: string }[]; mech?: Mechanism; visuals?: MedVisual[] }) {
  const view = React.useSyncExternalStore(subscribe, readView, () => "student" as View);
  const [i, setI] = React.useState(med.defaultDose);
  const dose = med.doses[i];
  const pick = saveView;

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:px-6 lg:py-8">
      <Link href="/practice/medicines" className="inline-flex items-center gap-1 rounded-full border-2 border-foreground bg-card px-3 py-1.5 text-sm font-semibold">
        <ArrowLeft className="size-4" aria-hidden /> Back to Medicines
      </Link>

      <header className="rounded-3xl border-2 border-foreground bg-brand p-5 text-brand-foreground sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-wide opacity-90">
          {med.group} · {med.cls}
        </p>
        <h1 className="mt-1 text-[2rem] font-black leading-[1.05] tracking-tight sm:text-5xl">{med.name}</h1>
        {med.brands.length ? <p className="mt-1 text-sm font-semibold opacity-90">Indian brands: {med.brands.join(", ")}</p> : null}
        <p className="mt-1 text-sm opacity-90">{med.forms}</p>
      </header>

      {/* View switch: sticks to the top while scrolling on phones */}
      <div className="sticky top-14 z-20 -mx-4 bg-background/95 px-4 py-2 backdrop-blur sm:static sm:mx-0 sm:bg-transparent sm:p-0">
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

      <section aria-label="What it is" className="space-y-3">
        <p className="text-[1.0625rem] leading-relaxed">{view === "student" ? med.student : med.clinician}</p>
        <ul className="grid gap-2 sm:grid-cols-3">
          {med.standout.map((s) => (
            <li key={s} className="flex gap-2 rounded-2xl border-2 border-foreground bg-card p-3 text-sm font-semibold">
              <Check className="mt-0.5 size-4 shrink-0 text-link" aria-hidden /> {s}
            </li>
          ))}
        </ul>
      </section>

      {mech ? (
        <section aria-labelledby="how" className="space-y-4 rounded-3xl border-2 border-foreground bg-card p-4 hard-shadow-sm sm:p-5">
          <h2 id="how" className="flex items-center gap-2 text-lg font-bold">
            <Microscope className="size-5 text-link" aria-hidden /> How it works
          </h2>
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
          <div className="grid gap-4 lg:grid-cols-2">
            <Receptor d={{ receptor: mech.receptor.name, title: `${med.name} at the ${mech.receptor.name} receptor`, caption: `Press ${mech.receptor.pick}. ${mech.receptor.note}` }} />
            <Journey d={{ drug: med.name.toLowerCase(), target: mech.site, routes: mech.routes, notes: mech.notes }} />
            {visuals.map((v, k) => (
              <MedicineVisual key={`${v.kind}-${k}`} v={v} />
            ))}
          </div>
        </section>
      ) : null}

      {/* Dose chips */}
      <section aria-labelledby="doses" className="rounded-3xl border-2 border-foreground bg-card p-4 hard-shadow-sm sm:p-5">
        <h2 id="doses" className="text-lg font-bold">
          Tap a dose
        </h2>
        <p className="text-sm text-muted-foreground">What it is used for and what to expect at each dose.</p>
        <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0" role="tablist" aria-label="Doses">
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

        <div key={i} role="tabpanel" className="mt-4 space-y-3">
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
              <p className="text-xs font-semibold uppercase tracking-wide">Watch for at this dose</p>
              <ul className="mt-1.5 flex flex-wrap gap-1.5">
                {dose.watch.map((w) => (
                  <li key={w} className="rounded-full border-2 border-foreground bg-card px-2.5 py-0.5 text-sm font-medium">
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <div className="flex justify-between gap-2 pt-1">
            <button type="button" disabled={i === 0} onClick={() => setI(i - 1)} className="h-10 rounded-full border-2 border-foreground px-4 text-sm font-semibold disabled:opacity-30">
              ← Lower dose
            </button>
            <button type="button" disabled={i === med.doses.length - 1} onClick={() => setI(i + 1)} className="h-10 rounded-full border-2 border-foreground px-4 text-sm font-semibold disabled:opacity-30">
              Higher dose →
            </button>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <Box icon={<Pill className="size-4" aria-hidden />} title="Used for">
          <ul className="space-y-1">{med.uses.map((u) => <li key={u}>{u}</li>)}</ul>
        </Box>
        <Box icon={<ClipboardCheck className="size-4" aria-hidden />} title="What to check">
          <ul className="list-disc space-y-1 pl-5">{med.checks.map((u) => <li key={u}>{u}</li>)}</ul>
        </Box>
        <Box icon={<Pill className="size-4" aria-hidden />} title="Common side effects">
          <ul className="list-disc space-y-1 pl-5">{med.common.map((u) => <li key={u}>{u}</li>)}</ul>
        </Box>
        <Box icon={<AlertTriangle className="size-4" aria-hidden />} title="Serious: act the same day" danger>
          <ul className="list-disc space-y-1 pl-5">{med.serious.map((u) => <li key={u}>{u}</li>)}</ul>
        </Box>
        {view === "clinician" || med.interactions.length ? (
          <Box icon={<Shuffle className="size-4" aria-hidden />} title="Interactions">
            <ul className="list-disc space-y-1 pl-5">{med.interactions.map((u) => <li key={u}>{u}</li>)}</ul>
          </Box>
        ) : null}
        <Box icon={<Users className="size-4" aria-hidden />} title="Special groups">
          <dl className="space-y-2">
            {med.groups.map((g) => (
              <div key={g.label}>
                <dt className="font-semibold">{g.label}</dt>
                <dd className="text-muted-foreground">{g.text}</dd>
              </div>
            ))}
          </dl>
        </Box>
      </div>

      <Box icon={<MessageCircle className="size-4" aria-hidden />} title="What to tell the patient">
        <ul className="list-disc space-y-1 pl-5">{med.tell.map((u) => <li key={u}>{u}</li>)}</ul>
      </Box>

      {related.length ? (
        <section aria-labelledby="related">
          <h2 id="related" className="text-lg font-bold">
            Compare with
          </h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {related.map((r) => (
              <Link key={r.id} href={`/practice/medicines/${r.id}`} className="rounded-full border-2 border-foreground bg-card px-3.5 py-1.5 text-sm font-semibold hover:bg-primary">
                {r.name} <span className="font-normal text-muted-foreground">· {r.cls}</span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <p className="text-caption text-muted-foreground">
        Typical adult doses, for learning. The prescriber chooses the dose for each patient; always check the current label and local guidance.
      </p>
    </div>
  );
}

function Box({ icon, title, children, danger }: { icon: React.ReactNode; title: string; children: React.ReactNode; danger?: boolean }) {
  return (
    <section className={cn("rounded-2xl border-2 p-4 text-[0.95rem] leading-relaxed", danger ? "border-status-alert-fg bg-status-alert-bg text-status-alert-fg" : "border-foreground bg-card")}>
      <h2 className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wide">
        {icon} {title}
      </h2>
      {children}
    </section>
  );
}
