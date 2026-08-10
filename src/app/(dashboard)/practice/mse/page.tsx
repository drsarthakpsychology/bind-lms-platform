import { MseTrainer } from "./mse-trainer";
import { ConfusableDrill } from "./confusable-drill";

export const dynamic = "force-dynamic";

/**
 * /practice/mse — MSE Trainer (v5 Part 2).
 * Tag stimuli across 11 domains + the confusable-pairs drill (mood vs affect,
 * thought form vs content, illusion vs hallucination, etc.).
 */
export default function MsePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <p className="text-eyebrow text-muted-foreground">MSE Trainer</p>
      <h1 className="mt-1 text-h1">Mental Status Exam</h1>
      <p className="mt-1 text-small text-muted-foreground">
        Tag the 11 domains. Mood is what they report; affect is what you see. Green means
        you matched the expert — amber means a defensible alternative.
      </p>

      <div className="mt-6">
        <MseTrainer />
      </div>

      <div className="mt-10">
        <h2 className="text-base font-semibold">The confusable pairs</h2>
        <p className="mt-1 text-small text-muted-foreground">
          The distinctions students actually fail — mood vs affect, thought form vs content,
          illusion vs hallucination, obsession vs delusion, flight vs tangential, akathisia vs anxiety.
        </p>
        <div className="mt-3">
          <ConfusableDrill />
        </div>
      </div>
    </div>
  );
}
