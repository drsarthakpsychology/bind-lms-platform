import type { Metadata } from "next";
import { requireFeature } from "@/lib/flags";
import { longCount, longSubjects } from "@/lib/prep/long-server";
import { BackToPrep, ListRow, PrepFrame, card } from "../ui";
import { LongLists } from "./lists";

export const metadata: Metadata = { title: "Long answers" };

/** /prep/long: written answers for theory papers and interviews, by subject, plus Practise again and Saved (on this device). */
export default async function LongHomePage() {
  await requireFeature("learn");
  const subjects = longSubjects();
  return (
    <PrepFrame>
      <BackToPrep />
      <header className="space-y-1">
        <h1 className="text-h1">Long answers</h1>
        <p className="text-muted-foreground">{longCount()} answers. Plan, write, then check against a model answer.</p>
      </header>
      <LongLists />
      <section aria-labelledby="long-subjects" className="space-y-2">
        <h2 id="long-subjects" className="text-h3">
          Subjects
        </h2>
        {subjects.length ? (
          <ul className="space-y-2">
            {subjects.map((s) => (
              <li key={s.subject}>
                <ListRow href={`/prep/${s.subject}?tab=long`} title={s.title} sub={`${s.count} ${s.count === 1 ? "answer" : "answers"}`} />
              </li>
            ))}
          </ul>
        ) : (
          <p className={card}>Long answers are being added.</p>
        )}
      </section>
    </PrepFrame>
  );
}
