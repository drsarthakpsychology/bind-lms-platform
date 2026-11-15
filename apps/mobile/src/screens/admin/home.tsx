import { router } from "expo-router";
import { PenLine } from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";

import { useAdminHome } from "@/api/queries";
import { Button, EmptyState, Loaded, Row, RowList, RowsSkeleton, Screen, Section, Stat, T } from "@/ds";
import { TabTop } from "@/nav/top";
import { when } from "@/screens/notifications/list";
import { space, useTheme } from "@/theme";

/** Admin Home: who needs a look first, then today's numbers in one row. */
export function AdminHome() {
  const c = useTheme();
  const q = useAdminHome();
  return (
    <Screen tab top={<TabTop sub="Admin" />} testID="admin-home" onRefresh={() => void q.refetch()} refreshing={q.isRefetching} footer={<Button label="Send a message" icon={<PenLine size={20} color={c.onPrimary} />} onPress={() => router.push("/compose")} testID="admin-compose" />}>
      <Loaded q={q} soon what="today" skeleton={<RowsSkeleton rows={5} />}>
        {(d) => (
          <>
            <T v="small" tone="muted" num>
              {d.dateLine}
            </T>
            <Section title={d.needsLook.length ? `Needs a look (${d.needsLook.length})` : "Needs a look"}>
              {d.needsLook.length ? (
                <RowList>
                  {d.needsLook.map((a) => (
                    <Row key={a.id} testID={`attention-${a.id}`} title={a.name} meta={a.reason} trailing={when(a.since)} onPress={() => router.push(`/student/${encodeURIComponent(a.studentId)}`)} />
                  ))}
                </RowList>
              ) : (
                <EmptyState mood="sleepy" title="Nobody needs a look" body="Everyone is on track today." />
              )}
            </Section>
            <Section title="Today">
              <View style={{ flexDirection: "row", flexWrap: "wrap", columnGap: space[6], rowGap: space[4] }}>
                <Stat value={`${d.today.active}/${d.today.total}`} label="Studied today" />
                <Stat value={String(d.today.lecturesWatched)} label="Lectures watched" />
                <Stat value={String(d.today.doubtsOpen)} label="Open doubts" />
                <Stat value={String(d.today.submissionsToGrade)} label="To grade" />
              </View>
            </Section>
          </>
        )}
      </Loaded>
    </Screen>
  );
}
