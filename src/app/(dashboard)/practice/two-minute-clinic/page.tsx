import { ToolHeader } from "@/components/help/tool-header";
import { TwoMinuteClinic } from "./clinic";
import { requireFeature } from "@/lib/flags";

export const dynamic = "force-dynamic";

/**
 * /practice/two-minute-clinic: one clinical one-liner, 120 seconds,
 * type a differential + next question, instant expert comparison.
 * The retention feature: opening the app costs nothing.
 */
export default async function TwoMinuteClinicPage() {
  await requireFeature("two_minute_clinic");
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <ToolHeader title="Two-minute clinic" tip={{ id: "two-minute-clinic", steps: ["Read the one line.", "Type your differential and your next question in two minutes.", "Compare with the expert answer."] }} />

      <div className="mt-6">
        <TwoMinuteClinic />
      </div>
    </div>
  );
}
