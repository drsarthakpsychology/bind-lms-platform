"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, ListTree } from "lucide-react";
import type { Med } from "@/lib/meds/types";
import type { Mechanism } from "@/lib/meds/mechanisms";
import type { MedVisual } from "@/lib/meds/visuals";
import { HOW_IT_WORKS, splitTell, type SectionId } from "@/lib/meds/sections";
import { MedicineSketches } from "@/components/meds/medicine-visuals";
import { useMedView } from "@/components/meds/medicine-view";
import { MobileBottomSheet } from "@/components/mobile/mobile-bottom-sheet";
import { cn } from "@/lib/utils";

/**
 * One medicine (new design): an editorial page. The same words, the same
 * order and the same pictures as before: practical facts first, "How it
 * works" last (#how-it-works). What changed is the page around them:
 * plain type on the page with hairlines between sections, the key facts as a
 * two-column list, and a section index (a side list on wide screens, a
 * bottom sheet on phones).
 */

const NAMES: Record<SectionId, string> = {
  uses: "Used for",
  doses: "Doses",
  "side-effects": "Side effects",
  monitoring: "What to check",
  interactions: "Interactions",
  warnings: "Serious: act the same day",
  groups: "Special groups",
  stopping: "Switching and stopping",
  "how-it-works": "How it works",
};

const bullets = "list-disc space-y-1.5 pl-5 type-body marker:text-muted-foreground";

function Part({ id, children, className }: { id: SectionId; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} data-section={id} aria-labelledby={`${id}-h`} className={cn("flex min-w-0 scroll-mt-24 flex-col gap-4 border-t border-[var(--ds-hairline)] pt-6 [overflow-wrap:anywhere]", className)}>
      <h2 id={`${id}-h`} className="type-h2">
        {NAMES[id]}
      </h2>
      {children}
    </section>
  );
}

export function MedicinePage({ med, related, mech, visuals = [], half = null, study = null }: { med: Med; related: { id: string; name: string; cls: string }[]; mech?: Mechanism; visuals?: MedVisual[]; half?: { hl: string; meaning: string } | null; study?: { href: string; title: string } | null }) {
  const [view, pick] = useMedView();
  const [i, setI] = React.useState(med.defaultDose);
  const [index, setIndex] = React.useState(false);
  const dose = med.doses[i];
  const tell = splitTell(med);
  const hasHow = Boolean(mech) || visuals.length > 0;
  const hasStopping = Boolean(tell.stopping.length || half);

  const shown: SectionId[] = ["uses", "doses", "side-effects", "monitoring", ...(med.interactions.length ? (["interactions"] as const) : []), "warnings", "groups", ...(hasStopping ? (["stopping"] as const) : []), ...(hasHow ? (["how-it-works"] as const) : [])];

  const viewSwitch = (
    <div className="inline-grid shrink-0 grid-cols-2 rounded-full bg-[var(--ds-tint)] p-1" role="radiogroup" aria-label="How much detail">
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
          className={cn(
            "h-9 rounded-full px-3 type-small font-semibold outline-none transition-colors duration-[var(--ds-state)] ease-[var(--ds-ease)] focus-visible:ring-2 focus-visible:ring-ring sm:px-4",
            view === v ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {l}
        </button>
      ))}
    </div>
  );

  return (
    <div data-ds="page" className="ds-page mx-auto w-full min-w-0 max-w-5xl">
      <Link href="/practice/medicines" className="-ml-2 inline-flex min-h-11 items-center gap-1.5 rounded-lg px-2 type-small font-semibold text-muted-foreground outline-none transition-colors duration-[var(--ds-state)] ease-[var(--ds-ease)] hover:bg-[var(--ds-tint)] hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring">
        <ArrowLeft className="size-4 shrink-0" aria-hidden /> Medicines
      </Link>

      <div className="mt-2 grid min-w-0 grid-cols-[minmax(0,1fr)] gap-x-12 lg:grid-cols-[minmax(0,1fr)_13rem]">
        <div className="flex min-w-0 flex-col gap-8">
          <header className="flex min-w-0 flex-col gap-2">
            <p className="type-small font-semibold text-muted-foreground [overflow-wrap:anywhere]">
              {med.group} · {med.cls}
            </p>
            <h1 className="type-display [overflow-wrap:anywhere]">{med.name}</h1>
          </header>

          {/* Stays in reach while reading: the section index (phones) and the words to read it in. */}
          <div className="sticky top-0 z-20 -my-2 flex min-w-0 items-center justify-between gap-2 bg-background/95 py-2 backdrop-blur lg:static lg:bg-transparent lg:backdrop-blur-none">
            <button
              type="button"
              onClick={() => setIndex(true)}
              aria-haspopup="dialog"
              aria-label="Sections"
              className="-ml-2 inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-lg px-2 type-small font-semibold outline-none transition-colors duration-[var(--ds-state)] ease-[var(--ds-ease)] hover:bg-[var(--ds-tint)] focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
            >
              <ListTree className="size-5 shrink-0" aria-hidden />
              <span aria-hidden className="max-[359px]:hidden">Sections</span>
            </button>
            {viewSwitch}
          </div>

          {/* 1. What it is used for */}
          <section id="uses" data-section="uses" aria-labelledby="uses-h" className="flex min-w-0 scroll-mt-24 flex-col gap-4 [overflow-wrap:anywhere]">
            <h2 id="uses-h" className="type-h2">
              {NAMES.uses}
            </h2>
            <ul className="flex flex-wrap gap-2">
              {med.uses.map((u) => (
                <li key={u} className="rounded-full bg-[var(--ds-tint)] px-3 py-1.5 type-small font-semibold">
                  {u}
                </li>
              ))}
            </ul>
            <p className="type-reading">{view === "student" ? med.student : med.clinician}</p>
            <ul className="grid grid-cols-[minmax(0,1fr)] gap-x-8 border-t border-[var(--ds-hairline)] sm:grid-cols-2">
              {med.standout.map((s) => (
                <li key={s} className="flex min-w-0 gap-3 border-b border-[var(--ds-hairline)] py-3 type-body font-semibold">
                  <Check className="mt-1 size-4 shrink-0 text-link" aria-hidden /> <span className="min-w-0">{s}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 2. Doses, how to take it, forms, Indian brands */}
          <Part id="doses">
            <div className="chip-scroller -mx-1 gap-2 px-1 py-1" role="tablist" aria-label="Doses">
              {med.doses.map((d, k) => (
                <button
                  key={d.amount}
                  type="button"
                  role="tab"
                  aria-selected={k === i}
                  onClick={() => setI(k)}
                  className={cn(
                    "flex min-h-14 flex-col items-start justify-center rounded-[var(--ds-radius)] border-[1.5px] px-4 py-2 text-left outline-none transition-colors duration-[var(--ds-state)] ease-[var(--ds-ease)] focus-visible:ring-2 focus-visible:ring-ring",
                    k === i ? "border-foreground bg-primary text-primary-foreground" : "border-[var(--ds-card-line)] hover:border-foreground",
                  )}
                >
                  <span className="type-body font-bold whitespace-nowrap type-num">{d.amount}</span>
                  <span className={cn("type-caption whitespace-nowrap", k === i ? "" : "text-muted-foreground")}>{d.label}</span>
                </button>
              ))}
            </div>

            <div key={i} role="tabpanel" className="flex min-w-0 flex-col gap-4">
              <p className="type-small font-semibold text-link">Used for: {dose.use}</p>
              <p className="type-reading">{view === "student" ? dose.student : dose.clinician}</p>
              {view === "student" ? (
                <details className="group/d border-y border-[var(--ds-hairline)]">
                  <summary className="flex min-h-12 cursor-pointer items-center type-small font-semibold outline-none focus-visible:ring-2 focus-visible:ring-ring">Clinician detail for this dose</summary>
                  <p className="max-w-[68ch] pb-4 type-body text-muted-foreground">{dose.clinician}</p>
                </details>
              ) : null}
              {dose.watch?.length ? (
                <div className="rounded-[var(--ds-radius)] bg-[var(--ds-tint)] p-4">
                  <p className="type-caption text-muted-foreground">Watch for at this dose</p>
                  <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                    {dose.watch.map((w) => (
                      <li key={w} className="type-small font-semibold">
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              <div className="flex justify-between gap-2">
                <button type="button" disabled={i === 0} onClick={() => setI(i - 1)} className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-3 type-small font-semibold outline-none transition-colors duration-[var(--ds-state)] hover:bg-[var(--ds-tint)] focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-30 disabled:hover:bg-transparent">
                  <ArrowLeft className="size-4" aria-hidden /> Lower dose
                </button>
                <button type="button" disabled={i === med.doses.length - 1} onClick={() => setI(i + 1)} className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-3 type-small font-semibold outline-none transition-colors duration-[var(--ds-state)] hover:bg-[var(--ds-tint)] focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-30 disabled:hover:bg-transparent">
                  Higher dose <ArrowRight className="size-4" aria-hidden />
                </button>
              </div>
            </div>

            {/* Key facts: name on the left, fact on the right. */}
            <dl className="border-t border-[var(--ds-hairline)]">
              {tell.take.length ? (
                <Fact name="How to take it">
                  <ul className={bullets}>{tell.take.map((u) => <li key={u}>{u}</li>)}</ul>
                </Fact>
              ) : null}
              <Fact name="Forms">{med.forms}</Fact>
              <Fact name="Indian brands">{med.brands.join(", ")}</Fact>
            </dl>
            <p className="max-w-[68ch] type-caption text-muted-foreground">
              Typical adult doses, for learning. The prescriber chooses the dose for each patient; always check the current label and local guidance.
            </p>
          </Part>

          {/* 3. Side effects */}
          <Part id="side-effects">
            <ul className={bullets}>{med.common.map((u) => <li key={u}>{u}</li>)}</ul>
          </Part>
          {/* 4. Monitoring */}
          <Part id="monitoring">
            <ul className={bullets}>{med.checks.map((u) => <li key={u}>{u}</li>)}</ul>
          </Part>
          {/* 5. Interactions */}
          {med.interactions.length ? (
            <Part id="interactions">
              <ul className={bullets}>{med.interactions.map((u) => <li key={u}>{u}</li>)}</ul>
            </Part>
          ) : null}
          {/* 6. Warnings: the one band of colour on the page */}
          <section id="warnings" data-section="warnings" aria-labelledby="warnings-h" className="flex min-w-0 scroll-mt-24 flex-col gap-4 rounded-[var(--ds-radius)] bg-status-alert-bg p-4 text-status-alert-fg [overflow-wrap:anywhere] sm:p-6">
            <h2 id="warnings-h" className="type-h2">
              {NAMES.warnings}
            </h2>
            <ul className="list-disc space-y-1.5 pl-5 type-body">{[...med.serious, ...tell.warn].map((u) => <li key={u}>{u}</li>)}</ul>
          </section>
          {/* 7. Special groups */}
          <Part id="groups" className="border-t-0 pt-0">
            <dl className="border-t border-[var(--ds-hairline)]">
              {med.groups.map((g) => (
                <Fact key={g.label} name={g.label}>
                  {g.text}
                </Fact>
              ))}
            </dl>
          </Part>
          {/* 8. Switching and stopping */}
          {hasStopping ? (
            <Part id="stopping">
              <ul className={bullets}>
                {tell.stopping.map((u) => <li key={u}>{u}</li>)}
                {half ? <li>Half-life {half.hl}. After the last dose, levels take about 4 to 5 half-lives to wash out.</li> : null}
              </ul>
            </Part>
          ) : null}

          {related.length || study ? (
            <nav aria-label="Related" className="flex min-w-0 flex-col gap-3 border-t border-[var(--ds-hairline)] pt-6">
              {related.length ? (
                <>
                  <h2 className="type-h3">Compare with</h2>
                  <ul className="flex min-w-0 flex-col divide-y divide-[var(--ds-hairline)] border-y border-[var(--ds-hairline)]">
                    {related.map((r) => (
                      <li key={r.id} className="min-w-0">
                        <Link href={`/practice/medicines/${r.id}`} className="group/rel -mx-2 flex min-h-14 min-w-0 items-center gap-4 rounded-lg px-2 py-2 outline-none transition-colors duration-[var(--ds-state)] ease-[var(--ds-ease)] hover:bg-[var(--ds-tint)] focus-visible:ring-2 focus-visible:ring-ring">
                          <span className="flex min-w-0 flex-1 flex-col">
                            <span className="type-body font-semibold [overflow-wrap:anywhere]">{r.name}</span>
                            <span className="type-small text-muted-foreground [overflow-wrap:anywhere]">{r.cls}</span>
                          </span>
                          <ArrowRight aria-hidden className="size-5 shrink-0 text-muted-foreground transition-transform duration-[var(--ds-state)] group-hover/rel:translate-x-0.5" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
              {study ? (
                <Link href={study.href} className="inline-flex min-h-11 items-center gap-1.5 self-start type-small font-semibold text-link underline-offset-4 hover:underline [overflow-wrap:anywhere]">
                  Learn it in Study: {study.title} <ArrowRight className="size-4 shrink-0" aria-hidden />
                </Link>
              ) : null}
            </nav>
          ) : null}

          {/* 9. How it works: last, linkable as #how-it-works */}
          {hasHow ? (
            <Part id={HOW_IT_WORKS}>
              {mech ? (
                <>
                  <p className="type-reading">{mech.plain}</p>
                  <div className="-mx-1 overflow-x-auto px-1">
                    <table className="w-full min-w-[32rem] border-collapse text-left type-small">
                      <thead>
                        <tr className="border-b border-foreground">
                          <th scope="col" className="py-2 pr-4 type-caption text-muted-foreground">Target</th>
                          {view === "clinician" ? <th scope="col" className="py-2 pr-4 type-caption text-muted-foreground">Action</th> : null}
                          <th scope="col" className="py-2 type-caption text-muted-foreground">What it means</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mech.targets.map((t) => (
                          <tr key={t.target} className="border-b border-[var(--ds-hairline)] align-top">
                            <td className="py-3 pr-4 font-semibold">{t.target}</td>
                            {view === "clinician" ? <td className="py-3 pr-4">{t.action}</td> : null}
                            <td className="py-3 text-muted-foreground">{t.effect}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : null}
              <MedicineSketches med={med} mech={mech} visuals={visuals} />
            </Part>
          ) : null}
        </div>

        {/* Wide screens: the section index beside the page. */}
        <nav aria-label="On this page" className="hidden lg:block">
          <div className="sticky top-24 flex flex-col gap-1">
            <p className="mb-1 type-caption text-muted-foreground">On this page</p>
            {shown.map((id) => (
              <a key={id} href={`#${id}`} className="-mx-2 rounded-lg px-2 py-1.5 type-small text-muted-foreground outline-none transition-colors duration-[var(--ds-state)] ease-[var(--ds-ease)] hover:bg-[var(--ds-tint)] hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring">
                {NAMES[id]}
              </a>
            ))}
          </div>
        </nav>
      </div>

      {/* Phones: the same index in a bottom sheet. */}
      <MobileBottomSheet open={index} onOpenChange={setIndex} title="Sections" className="mx-auto max-w-xl">
        <ul className="flex flex-col divide-y divide-[var(--ds-hairline)]">
          {shown.map((id) => (
            <li key={id}>
              <a href={`#${id}`} onClick={() => setIndex(false)} className="flex min-h-12 items-center rounded-lg type-body font-semibold outline-none focus-visible:ring-2 focus-visible:ring-ring">
                {NAMES[id]}
              </a>
            </li>
          ))}
        </ul>
      </MobileBottomSheet>
    </div>
  );
}

/** One key fact: its name on the left, the fact on the right (stacked on phones). */
function Fact({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-x-6 gap-y-1 border-b border-[var(--ds-hairline)] py-3 sm:grid-cols-[11rem_minmax(0,1fr)]">
      <dt className="type-small font-semibold text-muted-foreground">{name}</dt>
      <dd className="min-w-0 type-body">{children}</dd>
    </div>
  );
}
