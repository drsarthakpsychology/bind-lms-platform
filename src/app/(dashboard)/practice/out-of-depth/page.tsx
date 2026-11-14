import { OutOfDepthDrill } from "./out-of-depth-drill";
import { requireFeature } from "@/lib/flags";
import { BackPill } from "@/components/study/back";

export const dynamic = "force-dynamic";

/**
 * /practice/out-of-depth: the safety competency (v5.1 A4).
 * Recognising when to refer, escalate, or stop: the most important skill
 * for a counselling trainee. Scored both directions.
 */
export default async function OutOfDepthPage() {
  await requireFeature("ethics");
  return (
    <div className="mx-auto max-w-3xl">
      <BackPill className="mb-4" />
      <p className="text-eyebrow text-muted-foreground">Out of depth</p>
      <h1 className="mt-1 text-h1">Know when to refer</h1>
      <p className="mt-1 text-small text-muted-foreground">Failing to refer is dangerous. Referring everything is also a harm.</p>

      <div className="mt-6">
        <OutOfDepthDrill />
      </div>
    </div>
  );
}
