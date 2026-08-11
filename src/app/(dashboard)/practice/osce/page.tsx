import { OsceStationView } from "./osce-station";
import { requireFeature } from "@/lib/flags";

export const dynamic = "force-dynamic";

/**
 * /practice/osce — OSCE Station Mode (Part 6.12).
 * Timed single-station assessment, 7 minutes, one task. Voice strongly
 * preferred (the delivery matters as much as the content).
 */
export default async function OscePage() {
  await requireFeature("osce");
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <p className="text-eyebrow text-muted-foreground">OSCE stations</p>
      <h1 className="mt-1 text-h1">Timed stations</h1>
      <p className="mt-1 text-small text-muted-foreground">
        Seven minutes, one task. You face this format in RCI-track exams — practise it
        before the real thing. Voice mode strongly preferred.
      </p>

      <div className="mt-6">
        <OsceStationView />
      </div>
    </div>
  );
}
