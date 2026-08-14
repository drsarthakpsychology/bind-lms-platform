"use client";

import * as React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  CLASS_OBSERVATIONS,
  TherapistQuestions,
  RED_FLAGS,
  CLINICAL_PEARLS,
  TIMELINE_STAGES,
  OBSERVER_NOTE,
} from "@/lib/psychopharm/observer-seed";
import { OBSERVATION_CHECKLIST, VIGNETTES } from "@/lib/psychopharm/p3-seed";

/**
 * Phase 2 observer layer (Parts 1, 2, 3, 4, 9, 11) rendered on a drug page.
 *
 * Everything here is educational observation: "may contribute" language,
 * never causation; questions a psychologist can appropriately ask; red flags
 * phrased as "encourage the client to discuss with their prescriber". Nothing
 * is a prescription, a dose instruction, or emergency advice.
 *
 * Mobile: an accordion so one subsection shows at a time (one-task-at-a-time).
 * Desktop: the full observer layer, all subsections visible.
 */
export function ObserverNotes({
  drugClass,
}: {
  drugClass?: string;
}) {
  const cls = drugClass?.toLowerCase() ?? "";
  const matchesClass = (c: { class: string }) => cls.includes(c.class.toLowerCase());
  const matchesFlag = (f: { class: string }) =>
    f.class === "All classes" || cls.includes(f.class.toLowerCase());
  const classObs = CLASS_OBSERVATIONS.filter(matchesClass);
  const classPearls = CLINICAL_PEARLS.filter(matchesClass);
  const allPearls = classPearls.length ? classPearls : CLINICAL_PEARLS;
  const classFlags = RED_FLAGS.filter(matchesFlag);
  const allFlags = classFlags.length ? classFlags : RED_FLAGS;
  const classVignettes = VIGNETTES.filter((v) => cls.includes(v.drug_class.toLowerCase()));
  const allVignettes = classVignettes.length ? classVignettes : VIGNETTES.slice(0, 1);

  const sections: Array<{ id: string; title: string; body: React.ReactNode }> = [
    {
      id: "session-observations",
      title: "Session observations",
      body: classObs.length ? (
        <ul className="list-disc space-y-1 pl-5 text-small">
          {classObs.flatMap((c) =>
            c.observations.map((o, i) => <li key={i}>{o.observation}</li>),
          )}
        </ul>
      ) : (
        <p className="text-small text-muted-foreground">
          Not yet written for this class in our sources.
        </p>
      ),
    },
    {
      id: "timeline",
      title: "Medication time-line",
      body: (
        <div className="space-y-2">
          {TIMELINE_STAGES.map((s) => (
            <div key={s.stage_type} className="flex gap-3">
              <span className="mt-0.5 size-2 shrink-0 rounded-full bg-primary" aria-hidden />
              <div>
                <p className="text-small font-semibold">{s.label}</p>
                <p className="text-small text-muted-foreground">{s.note}</p>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: "questions",
      title: "Useful follow-up questions",
      body: (
        <ul className="list-disc space-y-1 pl-5 text-small">
          {TherapistQuestions.slice(0, 6).map((q, i) => (
            <li key={i}>{q.question}</li>
          ))}
        </ul>
      ),
    },
    {
      id: "red-flags",
      title: "When to encourage the client to contact their prescriber",
      body: (
        <ul className="list-disc space-y-1 pl-5 text-small">
          {allFlags.flatMap((c) => c.flags).map((f, i) => (
            <li key={i}>
              <span className="font-medium">{f.signal}.</span> {f.guidance}
            </li>
          ))}
        </ul>
      ),
    },
    ...(allPearls.length
      ? [
          {
            id: "pearls",
            title: "Things experienced psychologists often remember",
            body: (
              <ul className="list-disc space-y-1 pl-5 text-small">
                {allPearls.flatMap((c) => c.pearls.map((p, i) => <li key={i}>{p}</li>))}
              </ul>
            ),
          },
        ]
      : []),
    {
      id: "checklist",
      title: "During today's session, observe",
      body: (
        <ul className="grid gap-1 pl-0 text-small sm:grid-cols-2">
          {OBSERVATION_CHECKLIST.slice(0, 10).map((c, i) => (
            <li key={i} className="flex gap-2 rounded border-2 border-border px-2 py-1">
              <span className="mt-0.5 size-3 shrink-0 rounded-sm border border-border" aria-hidden />
              <span title={c.explanation}>{c.item}</span>
            </li>
          ))}
        </ul>
      ),
    },
    ...(allVignettes.length
      ? [
          {
            id: "vignette",
            title: "An illustrative scenario",
            body: (
              <>
                <div className="space-y-2 text-small">
                  {allVignettes.map((v, i) => (
                    <div key={i} className="rounded border-2 border-dashed border-border p-3">
                      <p className="mb-1">{v.scenario}</p>
                      <p className="text-caption text-muted-foreground">
                        <span className="font-medium">What to look for:</span> {v.expected.join(" · ")}
                      </p>
                    </div>
                  ))}
                </div>
                <p className="mt-1 text-caption text-muted-foreground">
                  Illustrative scenario — not a sourced clinical claim.
                </p>
              </>
            ),
          },
        ]
      : []),
  ];

  return (
    <section className="space-y-4 pb-4">
      <h2 className="text-h2">Possible therapy session observations</h2>
      <p className="text-caption text-muted-foreground">{OBSERVER_NOTE}</p>

      {/* Mobile: one subsection at a time. */}
      <Accordion type="single" collapsible className="lg:hidden">
        {sections.map((s) => (
          <AccordionItem key={s.id} value={s.id} className="border-b border-border/50">
            <AccordionTrigger>{s.title}</AccordionTrigger>
            <AccordionContent>{s.body}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* Desktop: full observer layer. */}
      <div className="hidden space-y-4 lg:block">
        {sections.map((s, i) => (
          <div key={s.id}>
            {i !== 0 ? (
              <h3 className="text-caption font-semibold uppercase text-muted-foreground">{s.title}</h3>
            ) : null}
            {s.body}
          </div>
        ))}
      </div>
    </section>
  );
}
