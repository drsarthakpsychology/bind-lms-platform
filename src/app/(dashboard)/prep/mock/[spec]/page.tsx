import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireFeature } from "@/lib/flags";
import { specById } from "@/content/prep/specs";
import { specVisible } from "@/lib/prep/catalog";
import { cn } from "@/lib/utils";
import { BackToPrep, PrepFrame, card } from "../../ui";
import { prepViewer } from "../../viewer";
import { MockExam } from "../exam";
import { PatternFacts } from "../facts";

export async function generateMetadata({ params }: { params: Promise<{ spec: string }> }): Promise<Metadata> {
  const { spec } = await params;
  return { title: specById(spec)?.short ? `Mock: ${specById(spec)!.short}` : "Mock" };
}

/** /prep/mock/<pattern>: the pattern, then the timed paper (sampled fresh on Start, scored on the server). */
export default async function MockPage({ params }: { params: Promise<{ spec: string }> }) {
  await requireFeature("learn");
  const { spec: id } = await params;
  const spec = specById(id);
  // Exam-pattern mocks stay hidden while exam tracks are off.
  if (!spec || !specVisible(spec)) notFound();
  const me = await prepViewer();

  return (
    <PrepFrame wide>
      <div className="mx-auto max-w-2xl lg:mx-0">
        <BackToPrep href="/prep/mock" label="Mock tests" />
      </div>
      <MockExam
        specId={spec.id}
        title={spec.title}
        intro={
          <div className="mx-auto max-w-2xl space-y-5 lg:mx-0">
            <h1 className="text-h1">{spec.title}</h1>
            <div className={cn(card, "hard-shadow-md")}>
              <PatternFacts spec={spec} />
            </div>
            {!me.learner ? <p className="text-sm text-muted-foreground">Staff preview: the attempt is scored but not saved.</p> : null}
          </div>
        }
      />
    </PrepFrame>
  );
}
