import { router } from "expo-router";
import { Search } from "lucide-react-native";
import * as React from "react";
import { TextInput, View } from "react-native";

import type { AdminStudentRow } from "@/api/extra";
import { useAdminStudents } from "@/api/queries";
import { Loaded, Row, RowList, RowsSkeleton, Screen, T } from "@/ds";
import { TabTop } from "@/nav/top";
import { when } from "@/screens/notifications/list";
import { layout, space, type as scale, useTheme } from "@/theme";

export function studentMeta(s: AdminStudentRow): string {
  return [s.rollNumber, s.cohort, s.lecturesOnly ? "Lectures" : null, s.lastSeen ? `Seen ${when(s.lastSeen)}` : "Never seen"].filter(Boolean).join(" · ");
}

/** Students: search, then everyone as rows; a row opens the student. */
export function AdminStudents() {
  const c = useTheme();
  const [q, setQ] = React.useState("");
  const query = useAdminStudents(q.trim());
  return (
    <Screen tab top={<TabTop sub="Admin" />} title="Students" testID="admin-students" gap={space[5]}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: space[2], minHeight: layout.primary, borderRadius: layout.radius, borderWidth: 1.5, borderColor: c.cardLine, backgroundColor: c.card, paddingHorizontal: space[4] }}>
        <Search size={18} color={c.muted} />
        <TextInput value={q} onChangeText={setQ} placeholder="Name or roll number" placeholderTextColor={c.muted} accessibilityLabel="Search students" autoCorrect={false} maxFontSizeMultiplier={1.4} style={[scale.body, { flex: 1, color: c.ink, minHeight: layout.target }, { outlineStyle: "none" } as object]} testID="students-search" />
      </View>
      <Loaded q={query} soon what="students" skeleton={<RowsSkeleton rows={6} />}>
        {(d) => (
          <RowList>
            {d.items.map((s) => (
              <Row key={s.id} testID={`student-${s.id}`} title={s.name} meta={studentMeta(s)} trailing={s.status !== "active" ? <T v="small" tone="danger">{s.status === "paused" ? "Paused" : "Ended"}</T> : `${s.progressPct}%`} onPress={() => router.push(`/student/${encodeURIComponent(s.id)}`)} />
            ))}
          </RowList>
        )}
      </Loaded>
    </Screen>
  );
}
