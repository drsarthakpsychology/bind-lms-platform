import { router } from "expo-router";
import * as React from "react";

import { usePrep } from "@/api/queries";
import { Loaded, Row, RowList, RowsSkeleton, Screen } from "@/ds";

/** Exam Prep: subjects as rows; a subject opens a question set. */
export function PrepScreen() {
  const q = usePrep();
  return (
    <Screen testID="prep" title="Exam Prep" lead="Practice questions by subject. Nothing here counts towards your marks.">
      <Loaded q={q} soon what="Exam Prep" skeleton={<RowsSkeleton rows={3} />}>
        {(d) => (
          <RowList>
            {d.subjects.map((s) => (
              <Row key={s.id} testID={`prep-${s.id}`} title={s.title} meta={`${s.done} of ${s.questions} answered`} trailing={s.best !== null ? `Best ${s.best}%` : undefined} onPress={() => router.push(`/prep/${encodeURIComponent(s.id)}`)} />
            ))}
          </RowList>
        )}
      </Loaded>
    </Screen>
  );
}
