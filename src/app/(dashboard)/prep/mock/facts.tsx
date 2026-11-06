import { BadgeCheck, Clock, FileQuestion, MinusCircle, PlusCircle, SearchCheck } from "lucide-react";
import type { PrepSpec } from "@/content/prep/specs";
import { cn } from "@/lib/utils";

export const totalQuestions = (s: PrepSpec) => s.sections.reduce((a, x) => a + x.count, 0);
const marks = (n: number) => `${Number.isInteger(n) ? n : n.toFixed(2).replace(/0$/, "")} ${Math.abs(n) === 1 ? "mark" : "marks"}`;

/** The pattern in plain words, with whether it is verified (icon + words). */
export function PatternFacts({ spec, compact = false }: { spec: PrepSpec; compact?: boolean }) {
  const n = totalQuestions(spec);
  const rows = [
    { Icon: FileQuestion, text: `${n} questions${spec.sections.length > 1 ? ` in ${spec.sections.length} parts` : ""}` },
    { Icon: Clock, text: `${spec.minutes} minutes` },
    { Icon: PlusCircle, text: `${marks(spec.marksPerRight)} for a right answer (out of ${n * spec.marksPerRight})` },
    { Icon: MinusCircle, text: spec.marksPerWrong < 0 ? `${marks(-spec.marksPerWrong)} off for a wrong answer; blank = 0` : "No negative marking: never leave one blank" },
  ];
  return (
    <div className="space-y-3">
      <ul className={cn("grid gap-1.5", !compact && "sm:grid-cols-2")}>
        {rows.map(({ Icon, text }) => (
          <li key={text} className="flex items-start gap-2 text-sm">
            <Icon className="mt-0.5 size-4 shrink-0" aria-hidden /> {text}
          </li>
        ))}
      </ul>
      {!compact && spec.sections.length > 1 ? (
        <p className="text-sm text-muted-foreground">Parts: {spec.sections.map((s) => `${s.title} (${s.count})`).join(", ")}</p>
      ) : null}
      <Verified spec={spec} />
      {!compact && spec.notes?.length ? (
        <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          {spec.notes.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export function Verified({ spec }: { spec: PrepSpec }) {
  return spec.verified ? (
    <p className="flex items-start gap-2 rounded-md border-2 border-foreground bg-status-success-bg px-3 py-2 text-sm text-status-success-fg">
      <BadgeCheck className="mt-0.5 size-4 shrink-0" aria-hidden />
      <span>
        <strong className="font-semibold">Official pattern</strong> as reported for the {spec.cycle} cycle. Check the official notice before your exam.
      </span>
    </p>
  ) : (
    <p className="flex items-start gap-2 rounded-md border-2 border-foreground bg-status-pending-bg px-3 py-2 text-sm text-status-pending-fg">
      <SearchCheck className="mt-0.5 size-4 shrink-0" aria-hidden />
      <span>
        <strong className="font-semibold">Pattern being verified.</strong> {spec.source}. Reported for the {spec.cycle} cycle.
      </span>
    </p>
  );
}
