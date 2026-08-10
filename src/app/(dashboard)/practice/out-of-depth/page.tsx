import { OutOfDepthDrill } from "./out-of-depth-drill";

export const dynamic = "force-dynamic";

/**
 * /practice/out-of-depth — the safety competency (v5.1 A4).
 * Recognising when to refer, escalate, or stop — the most important skill
 * for a counselling trainee. Scored both directions.
 */
export default function OutOfDepthPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <p className="text-eyebrow text-muted-foreground">Out of depth</p>
      <h1 className="mt-1 text-h1">Know when to refer</h1>
      <p className="mt-1 text-small text-muted-foreground">
        Failing to refer is dangerous. Referring everything is also a harm. This drill
        teaches both directions — the consequence unfolds, then the reasoning.
      </p>

      <div className="mt-6">
        <OutOfDepthDrill />
      </div>
    </div>
  );
}
