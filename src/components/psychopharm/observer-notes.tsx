import {
  CLASS_OBSERVATIONS,
  TherapistQuestions,
  RED_FLAGS,
  CLINICAL_PEARLS,
  TIMELINE_STAGES,
  OBSERVER_NOTE,
} from "@/lib/psychopharm/observer-seed";

/**
 * Phase 2 observer layer (Parts 1, 2, 3, 4, 9, 11) rendered on a drug page.
 *
 * Everything here is educational observation: "may contribute" language,
 * never causation; questions a psychologist can appropriately ask; red flags
 * phrased as "encourage the client to discuss with their prescriber". Nothing
 * is a prescription, a dose instruction, or emergency advice.
 */
export function ObserverNotes({ drugClass }: { drugClass?: string }) {
  const cls = drugClass?.toLowerCase() ?? "";
  const matchesClass = (c: { class: string }) => cls.includes(c.class.toLowerCase());
  const classObs = CLASS_OBSERVATIONS.filter(matchesClass);
  const classPearls = CLINICAL_PEARLS.filter(matchesClass);
  const allPearls = classPearls.length ? classPearls : CLINICAL_PEARLS;

  return (
    <section className="space-y-4 pb-4">
      <h2 className="text-h2">Possible therapy session observations</h2>
      <p className="text-caption text-muted-foreground">{OBSERVER_NOTE}</p>

      {/* Part 1 — session observations */}
      {classObs.length ? (
        <ul className="list-disc space-y-1 pl-5 text-small">
          {classObs.flatMap((c) =>
            c.observations.map((o, i) => <li key={i}>{o.observation}</li>),
          )}
        </ul>
      ) : (
        <p className="text-small text-muted-foreground">
          Not yet written for this class in our sources.
        </p>
      )}

      {/* Part 3 — timeline */}
      <div className="mt-4 space-y-2">
        <h3 className="text-caption font-semibold uppercase text-muted-foreground">Medication time-line</h3>
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

      {/* Part 2 — therapist questions */}
      <div className="mt-4">
        <h3 className="text-caption font-semibold uppercase text-muted-foreground">Useful follow-up questions</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-small">
          {TherapistQuestions.slice(0, 6).map((q, i) => (
            <li key={i}>{q.question}</li>
          ))}
        </ul>
      </div>

      {/* Part 9 — red flags */}
      <div className="mt-4">
        <h3 className="text-caption font-semibold uppercase text-muted-foreground">
          When to encourage the client to contact their prescriber
        </h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-small">
          {(RED_FLAGS[0]?.flags ?? []).map((f, i) => (
            <li key={i}>
              <span className="font-medium">{f.signal}.</span> {f.guidance}
            </li>
          ))}
        </ul>
      </div>

      {/* Part 11 — pearls */}
      {allPearls.length ? (
        <div className="mt-4">
          <h3 className="text-caption font-semibold uppercase text-muted-foreground">
            Things experienced psychologists often remember
          </h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-small">
            {allPearls.flatMap((c) => c.pearls.map((p, i) => <li key={i}>{p}</li>))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}