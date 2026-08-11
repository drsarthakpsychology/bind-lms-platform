import { MseLadder } from "./mse-ladder";

export const dynamic = "force-dynamic";

/**
 * /practice/mse — MSE Trainer rebuilt (v5 Part 2).
 * A ladder of five levels, unlocked in order:
 *   1 Observe → 2 Domain by domain → 3 Confusable pairs → 4 Full MSE
 *   under time → 5 MSE from live interview (your own Consulting Room).
 */
export default function MsePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <p className="text-eyebrow text-muted-foreground">MSE Trainer · the ladder</p>
      <h1 className="mt-1 text-h1">Mental Status Exam</h1>
      <p className="mt-1 text-small text-muted-foreground">
        Novices write &quot;patient was depressed.&quot; That is a conclusion, not an
        observation. The MSE is a description of what you can see and hear right
        now — and the whole skill is holding the line between the two. Five
        levels, taken in order.
      </p>
      <div className="mt-6">
        <MseLadder />
      </div>
    </div>
  );
}