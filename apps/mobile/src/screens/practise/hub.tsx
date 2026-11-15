import { Gamepad2, GraduationCap, Stethoscope } from "lucide-react-native";
import * as React from "react";

import type { PractiseRow } from "@/api/extra";
import { usePractise } from "@/api/queries";
import { Loaded, Row, RowList, RowsSkeleton, Screen, Section } from "@/ds";
import { openTarget } from "@/nav/targets";
import { TabTop } from "@/nav/top";
import { useTheme } from "@/theme";

/** Practise: three groups (the website's PRACTISE_GROUPS): Cases, Games, Exam Prep. */
export function PractiseHub() {
  const c = useTheme();
  const q = usePractise();
  const group = (title: string, rows: PractiseRow[], Icon: typeof Stethoscope) =>
    rows.length ? (
      <Section title={title}>
        <RowList>
          {rows.map((r) => (
            <Row key={r.id} testID={`practise-${r.id}`} title={r.title} meta={r.meta ?? undefined} trailing={r.trailing ?? undefined} icon={<Icon size={20} color={c.muted} />} onPress={() => openTarget(r.target)} />
          ))}
        </RowList>
      </Section>
    ) : null;
  return (
    <Screen tab top={<TabTop />} title="Practise" testID="practise" onRefresh={() => void q.refetch()} refreshing={q.isRefetching}>
      <Loaded q={q} soon what="practice" skeleton={<RowsSkeleton rows={5} />}>
        {(d) => (
          <>
            {group("Cases", d.cases, Stethoscope)}
            {group("Games", d.games, Gamepad2)}
            {group("Exam Prep", d.prep, GraduationCap)}
          </>
        )}
      </Loaded>
    </Screen>
  );
}
