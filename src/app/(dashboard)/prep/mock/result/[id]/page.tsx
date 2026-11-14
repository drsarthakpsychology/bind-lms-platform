import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireFeature } from "@/lib/flags";
import { specById } from "@/content/prep/specs";
import { resultView } from "@/lib/prep/results";
import { loadAttempt, standingFor } from "@/lib/prep/server";
import { BackToPrep, PrepFrame, card } from "../../../ui";
import { prepViewer } from "../../../viewer";
import { MockResult } from "../../result";

export const metadata: Metadata = { title: "Mock results" };

/** /prep/mock/result/<attempt>: a saved mock's results and full review. Own attempts only. */
export default async function MockResultPage({ params }: { params: Promise<{ id: string }> }) {
  await requireFeature("learn");
  const { id } = await params;
  const me = await prepViewer();
  const attempt = await loadAttempt(me.id, id);
  const spec = attempt ? specById(attempt.specId) : undefined;
  if (!attempt || !spec) notFound();
  // Rank is worked out again on each visit, so it moves as more students sit the mock.
  const standing = attempt.result ? await standingFor(me.id, spec.id, attempt.result.score) : null;

  return (
    <PrepFrame>
      <BackToPrep href="/prep/mock" label="Mock tests" />
      {attempt.result ? (
        <MockResult view={resultView(spec, attempt.result, standing ?? attempt.standing, { saved: true, late: attempt.late, marked: attempt.marked })} />
      ) : (
        <div className={card}>
          <p className="font-semibold">This mock wasn&apos;t submitted.</p>
          <p className="mt-1 text-muted-foreground">Start a fresh one from the mocks page.</p>
        </div>
      )}
    </PrepFrame>
  );
}
