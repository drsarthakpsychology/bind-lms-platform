import { LANDMARK_CASES } from "@/lib/landmark/cases";
import { LandmarkReader } from "./landmark-reader";

export const dynamic = "force-dynamic";

/**
 * /practice/landmark — landmark cases (v5 Part 5.2). Original narratives with
 * the 'what held up' framing and quizzes. Ethics failures framed as the
 * primary lesson where they exist.
 */
export default function LandmarkPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <p className="text-eyebrow text-muted-foreground">Landmark cases</p>
      <h1 className="mt-1 text-h1">What was believed, what held up</h1>
      <p className="mt-1 text-small text-muted-foreground">
        Original teaching narratives. For the ethically compromised cases, the primary
        lesson is the ethics failure — these are why consent procedures exist.
      </p>

      <div className="mt-6">
        <LandmarkReader cases={LANDMARK_CASES} />
      </div>
    </div>
  );
}
