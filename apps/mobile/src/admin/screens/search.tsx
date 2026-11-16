import { router } from "expo-router";
import { ChevronLeft, Search as SearchIcon, X } from "lucide-react-native";
import * as React from "react";
import { Pressable, ScrollView, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { EmptyState, Row, RowList, RowsSkeleton, Section, T } from "@/ds";
import { layout, space, type as scale, useTheme } from "@/theme";
import { useCohorts, usePeople, useStudents } from "../api";
import type { AdminStudentRow } from "../contract";
import { STAGE_LABEL, type CohortRow, type PersonRow } from "../extra";
import { accountLabel, accountTone, plural } from "../format";
import { Status } from "../kit";
import { openStudent } from "../nav";
import { stageTone } from "./people";

/** Every word typed appears somewhere in the text (any order, any case). */
export function adminMatch(text: string, q: string): boolean {
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  const t = text.toLowerCase();
  return words.length > 0 && words.every((w) => t.includes(w));
}

/** Students, people and cohorts that match, at most 8 each. People who are already students show once, as students. */
export function adminHits(q: string, students: AdminStudentRow[], people: PersonRow[], cohorts: CohortRow[]) {
  const term = q.trim();
  if (term.length < 2) return { students: [], people: [], cohorts: [] };
  const studentEmails = new Set(students.map((s) => s.email.toLowerCase()));
  return {
    students: students.filter((s) => adminMatch(`${s.name} ${s.email} ${s.rollNumber ?? ""} ${s.mobileNumber ?? ""}`, term)).slice(0, 8),
    people: people.filter((p) => !studentEmails.has(p.email.toLowerCase()) && adminMatch(`${p.name} ${p.email} ${p.phone ?? ""}`, term)).slice(0, 8),
    cohorts: cohorts.filter((c) => adminMatch(`${c.name} ${c.course ?? ""}`, term)).slice(0, 8),
  };
}

/** Admin search from the top bar: students, people (enquiries) and cohorts in one place. */
export function AdminSearchScreen() {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const [q, setQ] = React.useState("");
  const students = useStudents();
  const people = usePeople("all");
  const cohorts = useCohorts();
  const term = q.trim();
  const hits = React.useMemo(() => adminHits(term, students.data?.items ?? [], people.data?.items ?? [], cohorts.data?.items ?? []), [term, students.data, people.data, cohorts.data]);
  const loading = students.isLoading || people.isLoading || cohorts.isLoading;
  const any = hits.students.length + hits.people.length + hits.cohorts.length > 0;
  return (
    <View testID="admin-search" style={{ flex: 1, backgroundColor: c.bg, paddingTop: insets.top }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: space[1], paddingRight: layout.gutter, paddingLeft: space[1], minHeight: 64, borderBottomWidth: 1, borderColor: c.hairline }}>
        <Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={() => router.back()} style={({ pressed }) => ({ width: layout.target, height: layout.target, borderRadius: 22, alignItems: "center", justifyContent: "center", backgroundColor: pressed ? c.tint : "transparent" })}>
          <ChevronLeft size={26} color={c.ink} />
        </Pressable>
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: space[2], minHeight: layout.target, borderRadius: layout.radius, backgroundColor: c.tint, paddingLeft: space[3] }}>
          <SearchIcon size={18} color={c.muted} />
          <TextInput
            testID="admin-search-input"
            autoFocus
            value={q}
            onChangeText={setQ}
            placeholder="Students, people, cohorts"
            placeholderTextColor={c.muted}
            accessibilityLabel="Search students, people and cohorts"
            returnKeyType="search"
            autoCorrect={false}
            autoCapitalize="none"
            maxFontSizeMultiplier={1.4}
            style={[scale.body, { flex: 1, minWidth: 0, color: c.ink, minHeight: layout.target }, { outlineStyle: "none" } as object]}
          />
          {q ? (
            <Pressable accessibilityRole="button" accessibilityLabel="Clear search" onPress={() => setQ("")} style={{ width: layout.target, height: layout.target, alignItems: "center", justifyContent: "center" }}>
              <X size={18} color={c.muted} />
            </Pressable>
          ) : null}
        </View>
      </View>
      <ScrollView keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" contentContainerStyle={{ padding: layout.gutter, gap: layout.section, paddingBottom: insets.bottom + space[6] }}>
        {term.length < 2 ? (
          <T tone="muted">Name, email, mobile, roll number or cohort.</T>
        ) : any ? (
          <>
            {hits.students.length ? (
              <Section title="Students" quiet>
                <RowList still>
                  {hits.students.map((s) => (
                    <Row key={s.id} testID={`hit-student-${s.id}`} title={s.name} meta={[s.rollNumber, s.cohorts.map((x) => x.name).join(", ")].filter(Boolean).join(" · ") || s.email} trailing={<Status tone={accountTone(s.account)}>{accountLabel(s.account)}</Status>} onPress={() => openStudent(s.id)} />
                  ))}
                </RowList>
              </Section>
            ) : null}
            {hits.people.length ? (
              <Section title="People" quiet>
                <RowList still>
                  {hits.people.map((p) => (
                    <Row key={p.key} testID={`hit-person-${p.key}`} title={p.name} meta={p.email || p.phone || undefined} trailing={<Status tone={stageTone(p.stage)}>{STAGE_LABEL[p.stage]}</Status>} onPress={() => router.push(`/admin/person/${encodeURIComponent(p.key)}`)} />
                  ))}
                </RowList>
              </Section>
            ) : null}
            {hits.cohorts.length ? (
              <Section title="Cohorts" quiet>
                <RowList still>
                  {hits.cohorts.map((x) => (
                    <Row key={x.id} testID={`hit-cohort-${x.id}`} title={x.name} meta={[x.course, plural(x.members, "student")].filter(Boolean).join(" · ")} onPress={() => router.push(`/admin/cohort/${encodeURIComponent(x.id)}`)} />
                  ))}
                </RowList>
              </Section>
            ) : null}
          </>
        ) : loading ? (
          <RowsSkeleton rows={4} />
        ) : (
          <EmptyState mood="puzzled" title="Nothing found" body={`No student, person or cohort matches "${term}".`} testID="admin-search-empty" />
        )}
      </ScrollView>
    </View>
  );
}
