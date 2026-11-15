import { router, useLocalSearchParams } from "expo-router";
import { X } from "lucide-react-native";
import * as React from "react";
import { Pressable, View } from "react-native";

import { Button, Chips, EmptyState, Field, Row, RowList, Screen, Sheet, SwitchRow, T } from "@/ds";
import { space, useTheme } from "@/theme";
import { adminCalls, useAdminAction, useCohorts, useStudents } from "../api";
import { plural } from "../format";
import { SearchBox, SelectRow } from "../kit";
import { useAdminRole } from "../role";

type To = "students" | "cohort";

/** Check before sending. Pure, so it is tested. */
export function checkMessage(m: { userIds: string[]; title: string; text: string }): string | null {
  if (!m.userIds.length) return "Pick who it goes to.";
  if (!m.title.trim()) return "Write a title.";
  if (!m.text.trim()) return "Write the message.";
  if (m.title.trim().length > 120) return "Keep the title under 120 characters.";
  return null;
}

/** Pick students from the whole list, with search. */
function PickStudents({ open, onClose, picked, onChange }: { open: boolean; onClose: () => void; picked: string[]; onChange: (ids: string[]) => void }) {
  const [search, setSearch] = React.useState("");
  const q = useStudents({ search: search.trim() || undefined });
  const set = new Set(picked);
  return (
    <Sheet open={open} onClose={onClose} title="Pick students" testID="pick-students">
      <View style={{ gap: space[3] }}>
        <View style={{ flexDirection: "row" }}>
          <SearchBox value={search} onChange={setSearch} placeholder="Name or roll number" label="Search students" testID="pick-search" />
        </View>
        <View>
          {(q.data?.items ?? []).map((r) => (
            <SelectRow
              key={r.id}
              on={set.has(r.id)}
              label={`Pick ${r.name}`}
              testID={`pick-${r.id}`}
              onToggle={() => onChange(set.has(r.id) ? picked.filter((x) => x !== r.id) : [...picked, r.id])}
            >
              <Row title={r.name} meta={[r.rollNumber, r.cohorts.map((c) => c.name).join(", ")].filter(Boolean).join(" · ")} />
            </SelectRow>
          ))}
        </View>
        <Button label={picked.length ? `Done, ${plural(picked.length, "student")}` : "Done"} onPress={onClose} testID="pick-done" />
      </View>
    </Sheet>
  );
}

/** New message: to some students or a whole cohort. It lands in their bell and as a push, and by email if you want. */
export function AdminComposeScreen() {
  const c = useTheme();
  const params = useLocalSearchParams<{ to?: string; cohort?: string; title?: string }>();
  const { canWrite } = useAdminRole();
  const { run, busy } = useAdminAction();
  const [to, setTo] = React.useState<To>(params.cohort ? "cohort" : "students");
  const [ids, setIds] = React.useState<string[]>(params.to ? String(params.to).split(",").filter(Boolean) : []);
  const [cohort, setCohort] = React.useState(params.cohort ?? "");
  const [title, setTitle] = React.useState(params.title ?? "");
  const [text, setText] = React.useState("");
  const [email, setEmail] = React.useState(false);
  const [picking, setPicking] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const all = useStudents();
  const cohorts = useCohorts();
  const members = useStudents({ cohort: cohort || "__none__" });
  const names = new Map((all.data?.items ?? []).map((r) => [r.id, r.name]));
  const userIds = to === "cohort" ? (cohort ? (members.data?.items ?? []).map((r) => r.id) : []) : ids;
  const cohortOptions = (cohorts.data?.items ?? []).filter((x) => x.members > 0);

  if (!canWrite) {
    return (
      <Screen testID="compose">
        <EmptyState mood="puzzled" title="View-only access" body="Only a Super Admin can send messages." action={{ label: "Back", onPress: () => router.back() }} />
      </Screen>
    );
  }

  const send = async () => {
    const problem = checkMessage({ userIds, title, text });
    if (problem) return setError(problem);
    setError(null);
    const r = await run("message", () => adminCalls.send({ userIds, title: title.trim(), text: text.trim(), alsoEmail: email }), { done: (x) => `Sent to ${plural(x.created, "student")}${x.emailed ? `, ${x.emailed} by email` : ""}` });
    if (r) router.back();
  };

  return (
    <Screen testID="compose" gap={space[5]} footer={<Button label={userIds.length ? `Send to ${plural(userIds.length, "student")}` : "Send"} busy={busy === "message"} onPress={() => void send()} testID="compose-send" />}>
      <View style={{ gap: space[2] }}>
        <T v="small">To</T>
        <Chips
          label="To"
          options={[
            { id: "students" as const, name: "Students" },
            { id: "cohort" as const, name: "A cohort" },
          ]}
          value={to}
          onChange={setTo}
        />
      </View>
      {to === "students" ? (
        <View style={{ gap: space[2] }}>
          {ids.length ? (
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space[2] }}>
              {ids.map((id) => (
                <Pressable key={id} accessibilityRole="button" accessibilityLabel={`Remove ${names.get(id) ?? "student"}`} onPress={() => setIds(ids.filter((x) => x !== id))} style={{ minHeight: 36, flexDirection: "row", alignItems: "center", gap: space[1], borderRadius: 18, paddingLeft: space[3], paddingRight: space[2], backgroundColor: c.tint }}>
                  <T v="small">{names.get(id) ?? "Student"}</T>
                  <X size={16} color={c.muted} />
                </Pressable>
              ))}
            </View>
          ) : null}
          <Button kind="quiet" full={false} label={ids.length ? "Add more" : "Pick students"} onPress={() => setPicking(true)} testID="compose-pick" />
        </View>
      ) : (
        <View style={{ gap: space[1] }}>
          {cohortOptions.length ? (
            <RowList>
              {cohortOptions.map((x) => (
                <SelectRow key={x.id} on={cohort === x.id} label={`Send to ${x.name}`} onToggle={() => setCohort(cohort === x.id ? "" : x.id)} testID={`compose-cohort-${x.id}`}>
                  <Row title={x.name} meta={plural(x.members, "student")} />
                </SelectRow>
              ))}
            </RowList>
          ) : (
            <T v="small" tone="muted">
              No cohorts with students yet.
            </T>
          )}
        </View>
      )}
      <Field label="Title" value={title} onChangeText={setTitle} maxLength={120} testID="compose-title" />
      <Field label="Message" value={text} onChangeText={setText} area maxLength={4000} hint="A blank line starts a new paragraph." testID="compose-body" />
      <SwitchRow title="Also send as email" meta="It always goes to their bell and phone" value={email} onChange={setEmail} testID="compose-email" />
      {error ? (
        <T v="small" tone="danger" accessibilityLiveRegion="polite" testID="compose-error">
          {error}
        </T>
      ) : null}
      <PickStudents open={picking} onClose={() => setPicking(false)} picked={ids} onChange={setIds} />
    </Screen>
  );
}
