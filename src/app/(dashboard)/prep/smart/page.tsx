import type { Metadata } from "next";
import { requireFeature } from "@/lib/flags";
import { KEY } from "@/lib/prep/bank";
import { loadSmart } from "@/lib/prep/path";
import { toView } from "@/lib/prep/view";
import { QuestionRunner } from "../runner";
import { BackToPrep, PrepFrame } from "../ui";
import { prepViewer } from "../viewer";

export const metadata: Metadata = { title: "Smart practice" };

/**
 * /prep/smart: one mixed set of 10 from your weak topics and the questions
 * due for review. Replaces Coach, the Quiz path and Today's practice (their
 * old addresses come here).
 */
export default async function SmartPage() {
  await requireFeature("learn");
  const me = await prepViewer();
  const smart = await loadSmart(me.id);
  const questions = smart.ids.flatMap((id) => {
    const q = KEY.get(id);
    return q ? [toView(q)] : [];
  });
  return (
    <PrepFrame>
      <BackToPrep />
      <header className="space-y-1">
        <h1 className="text-h1">Smart practice</h1>
        <p className="text-muted-foreground">{smart.reviews ? `10 questions from your weak topics, including ${smart.reviews} you missed before.` : "10 questions from your weak topics."}</p>
      </header>
      <QuestionRunner
        key={smart.ids.join(",")}
        questions={questions}
        saved={smart.saved}
        canSave={smart.canSave && me.learner}
        preview={!me.learner}
        label="Smart practice"
        again="refresh"
        againLabel="Another 10"
        back={{ href: "/prep", label: "Exam Prep" }}
        empty={<p className="font-semibold">Questions are being added.</p>}
      />
    </PrepFrame>
  );
}
