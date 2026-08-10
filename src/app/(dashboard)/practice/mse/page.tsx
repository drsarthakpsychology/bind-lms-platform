import { MseTrainer } from "./mse-trainer";

export const dynamic = "force-dynamic";

/**
 * /practice/mse — MSE Trainer (Part 6.4).
 * Tag stimuli across 11 domains, mood-vs-affect drill, describe-don't-diagnose.
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
    </div>
  );
}
