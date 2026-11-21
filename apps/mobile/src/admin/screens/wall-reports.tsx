import { Flag } from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";

import { EmptyState, RowsSkeleton, Screen, T } from "@/ds";
import { space, useTheme } from "@/theme";
import { adminCalls, useAdminAction, useRefreshAdmin, useWallReports } from "../api";
import { ago } from "../format";
import { Block, Loaded, SmallButton } from "../kit";
import { useAdminRole } from "../role";

/**
 * Class wall reports, as the website's /admin/wall-reports: what students
 * flagged, oldest first, with the text and the reason. Resolve closes the
 * report; the post stays on the wall.
 */
export function AdminWallReportsScreen() {
  const c = useTheme();
  const q = useWallReports();
  const { canWrite } = useAdminRole();
  const { run, busy } = useAdminAction();
  const { refresh, refreshing } = useRefreshAdmin();
  const [gone, setGone] = React.useState<string[]>([]);
  return (
    <Screen title="Wall reports" lead="Resolving closes the report. The post stays on the wall." testID="admin-wall-reports" gap={space[5]} onRefresh={refresh} refreshing={refreshing}>
      <Loaded q={q} soon what="wall reports" skeleton={<RowsSkeleton rows={3} />}>
        {(d) => {
          const items = d.items.filter((r) => !gone.includes(r.id));
          return items.length ? (
            <View style={{ gap: space[5] }}>
              {items.map((r) => (
                <Block key={r.id} title={r.kind === "reply" ? "A reply" : "A post"} testID={`report-${r.id}`}>
                  <T>{r.content}</T>
                  <View style={{ flexDirection: "row", gap: space[2], alignItems: "center" }}>
                    <Flag size={16} color={c.muted} />
                    <T v="small" tone="muted" style={{ flex: 1 }}>
                      {`${r.reason} · ${ago(r.createdAt)}`}
                    </T>
                  </View>
                  {canWrite ? (
                    <SmallButton
                      label="Resolve"
                      busy={busy === `wall-${r.id}`}
                      testID={`resolve-${r.id}`}
                      onPress={() => void run("wall-report", () => adminCalls.resolveWallReport(r.id), { done: "Report closed", tag: `wall-${r.id}` }).then((x) => x && setGone((g) => [...g, r.id]))}
                    />
                  ) : null}
                </Block>
              ))}
            </View>
          ) : (
            <EmptyState mood="clear" title="No open reports" body="When a student reports a post or reply on the class wall, it shows here." />
          );
        }}
      </Loaded>
    </Screen>
  );
}
