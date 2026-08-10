import { TwoMinuteClinic } from "./clinic";

export const dynamic = "force-dynamic";

/**
 * /practice/two-minute-clinic — one clinical one-liner, 120 seconds,
 * type a differential + next question, instant expert comparison.
 * The retention feature — opening the app costs nothing.
 */
export default function TwoMinuteClinicPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <p className="text-eyebrow text-muted-foreground">Micro-drill</p>
      <h1 className="mt-1 text-h1">Two-Minute Clinic</h1>
      <p className="mt-1 text-small text-muted-foreground">
        One line, two minutes, your differential and your next question. Instant expert
        comparison.
      </p>

      <div className="mt-6">
        <TwoMinuteClinic />
      </div>
    </div>
  );
}
