import * as React from "react";

import type { AdminActivityRow } from "@/api/extra";
import { useAdminActivity } from "@/api/queries";
import { Chips, Loaded, Row, RowList, RowsSkeleton, Screen } from "@/ds";
import { TabTop } from "@/nav/top";
import { when } from "@/screens/notifications/list";

const KINDS: { id: "all" | AdminActivityRow["kind"]; name: string }[] = [
  { id: "all", name: "All" },
  { id: "lecture", name: "Lectures" },
  { id: "study", name: "Study" },
  { id: "doubt", name: "Doubts" },
  { id: "submission", name: "Hand-ins" },
  { id: "sign_in", name: "Sign-ins" },
];

/** Activity: what students did, newest first, one filter row. */
export function AdminActivity() {
  const q = useAdminActivity();
  const [kind, setKind] = React.useState<(typeof KINDS)[number]["id"]>("all");
  return (
    <Screen tab top={<TabTop sub="Admin" />} title="Activity" testID="admin-activity" onRefresh={() => void q.refetch()} refreshing={q.isRefetching}>
      <Chips scroll label="Show" options={KINDS} value={kind} onChange={setKind} />
      <Loaded q={q} soon what="activity" skeleton={<RowsSkeleton rows={6} />}>
        {(d) => (
          <RowList>
            {d.items
              .filter((x) => kind === "all" || x.kind === kind)
              .map((x) => (
                <Row key={x.id} title={x.who} meta={x.what} trailing={when(x.at)} />
              ))}
          </RowList>
        )}
      </Loaded>
    </Screen>
  );
}
