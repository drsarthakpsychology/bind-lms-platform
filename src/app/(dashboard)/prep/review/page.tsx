import type { Metadata } from "next";
import { requireFeature } from "@/lib/flags";
import { KEY } from "@/lib/prep/bank";
import { loadReviewRound } from "@/lib/prep/path";
import { toView } from "@/lib/prep/view";
import { BackToPrep, PrepFrame } from "../ui";
import { prepViewer } from "../viewer";
import { PracticeRunner } from "../practice/runner";

export const metadata: Metadata = { title: "Review" };

/** /prep/review: questions you missed, brought back on a spaced schedule (FSRS) until they stick. */
export default async function ReviewPage() {
  await requireFeature("learn");
  const me = await prepViewer();
  const ids = await loadReviewRound(me.id);
  return (
    <PrepFrame>
      <BackToPrep />
      <header className="space-y-1">
        <p className="text-eyebrow text-link">Review</p>
        <h1 className="text-h1">Questions you missed</h1>
        <p className="text-muted-foreground">Each comes back after a gap. Get it right and the gap grows.</p>
      </header>
      <PracticeRunner
        key={ids.join(",")}
        questions={ids.map((id) => toView(KEY.get(id)!))}
        title="Review"
        saving={me.learner}
        againLabel="Check for more"
        empty={
          <>
            <p className="font-semibold">Nothing to review right now.</p>
            <p className="mt-1 text-muted-foreground">Questions you miss in practice and mocks come back here when they are due.</p>
          </>
        }
      />
    </PrepFrame>
  );
}
