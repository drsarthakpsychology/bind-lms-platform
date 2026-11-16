import { useLocalSearchParams } from "expo-router";
import { QrCode } from "lucide-react-native";
import * as React from "react";
import { Pressable, View } from "react-native";

import { useAdminAction, useRefreshAdmin } from "@/admin/api";
import { Figures, FilterChips, OptionRow, Quiet } from "@/admin/kit";
import { useAdminRole } from "@/admin/role";
import { Button, Field, RowsSkeleton, Screen, Sheet, T } from "@/ds";
import { StaggerList } from "@/motion";
import { layout, space, useTheme } from "@/theme";
import { adminClinicCalls, useSessionDetail } from "../api";
import { ClinicLoaded } from "../loaded";
import type { AdminSessionDetail, MarkState, RosterRow } from "../contract";
import { clockOf, dateLabel, KIND_NAME, sessionMeta, sessionTitle, timeLabel } from "../logic";
import { RosterWord } from "../parts";
import { openCode } from "./today";

type Filter = "all" | "in" | "out" | "missing" | "late" | "leave";

export function filterRoster(rows: RosterRow[], f: Filter): RosterRow[] {
  if (f === "all") return rows;
  if (f === "late") return rows.filter((r) => r.late);
  if (f === "out") return rows.filter((r) => r.state === "out" || r.state === "no_out");
  return rows.filter((r) => r.state === f);
}

/** Mark someone by hand (phone dead, no camera), always with a note. */
function MarkSheet({ row, sessionId, onClose }: { row: RosterRow | null; sessionId: string; onClose: () => void }) {
  const [state, setState] = React.useState<MarkState>("in");
  const [note, setNote] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const { run, busy } = useAdminAction();
  const save = async () => {
    if (!row) return;
    if (note.trim().length < 2) return setError("Write a short note, for example: phone dead.");
    setError(null);
    const r = await run("clinic", () => adminClinicCalls.mark(sessionId, row.studentId, state, note.trim()), { done: `${row.name} marked` });
    if (r !== undefined) {
      setNote("");
      onClose();
    }
  };
  return (
    <Sheet open={!!row} onClose={onClose} title={row ? `Mark ${row.name}` : ""} testID="mark-sheet">
      <View style={{ gap: space[4] }}>
        <View accessibilityRole="radiogroup">
          <OptionRow label="Present" meta="Arrived (the time is now)" on={state === "in"} onPress={() => setState("in")} testID="mark-in" />
          <OptionRow label="Left" meta="Scanned in, has gone" on={state === "out"} onPress={() => setState("out")} testID="mark-out" />
          <OptionRow label="Not here" meta="Clears the scans" on={state === "missing"} onPress={() => setState("missing")} testID="mark-missing" />
        </View>
        <Field label="Note" value={note} onChangeText={setNote} error={error} maxLength={140} placeholder="For example: phone dead" testID="mark-note" />
        <Button label="Save" busy={!!busy} onPress={() => void save()} testID="mark-save" />
      </View>
    </Sheet>
  );
}

function RosterLine({ r, onPress, canWrite }: { r: RosterRow; onPress: () => void; canWrite: boolean }) {
  const c = useTheme();
  const times = [r.inAt ? `In ${clockOf(r.inAt)}${r.late ? ", late" : ""}` : "", r.outAt ? `Out ${clockOf(r.outAt)}` : "", r.leaveAt ? `Leaving at ${timeLabel(r.leaveAt)}` : ""].filter(Boolean).join(" · ");
  const body = (
    <View style={{ minHeight: layout.row, paddingVertical: space[2], flexDirection: "row", alignItems: "center", gap: space[3] }}>
      <View style={{ flex: 1, minWidth: 0 }}>
        <T v="bodyStrong">{r.name}</T>
        {times ? (
          <T v="small" tone="muted" num>
            {times}
          </T>
        ) : null}
        {r.manual && r.note ? (
          <T v="small" tone="muted">
            Marked by hand: {r.note}
          </T>
        ) : null}
      </View>
      <RosterWord s={r.state} />
    </View>
  );
  return (
    <View style={{ borderTopWidth: 1, borderColor: c.hairline }}>
      {canWrite ? (
        <Pressable
          testID={`roster-${r.studentId}`}
          accessibilityRole="button"
          accessibilityLabel={`${r.name}. ${times || "No scan"}. Mark by hand`}
          onPress={() => {
            onPress();
          }}
          style={({ pressed }) => ({ backgroundColor: pressed ? c.tint : "transparent", marginHorizontal: -space[2], paddingHorizontal: space[2], borderRadius: 8 })}
        >
          {body}
        </Pressable>
      ) : (
        <View testID={`roster-${r.studentId}`}>{body}</View>
      )}
    </View>
  );
}

export function SessionBody({ d }: { d: AdminSessionDetail }) {
  const { canWrite } = useAdminRole();
  const c = useTheme();
  const [f, setF] = React.useState<Filter>("all");
  const [mark, setMark] = React.useState<RosterRow | null>(null);
  const s = d.session;
  const rows = filterRoster(d.roster, f);
  const n = s.counts;
  return (
    <View style={{ gap: space[5] }}>
      <View style={{ gap: space[1] }}>
        <T v="small" tone="muted">
          {KIND_NAME[s.kind]} · {dateLabel(s.date)}
        </T>
        <T v="h1">{sessionTitle(s)}</T>
        <T tone="muted" num>
          {sessionMeta(s)}
        </T>
        {s.status === "cancelled" ? (
          <T tone="alert">Cancelled{s.note ? `: ${s.note}` : ""}</T>
        ) : null}
      </View>
      {!d.open && s.status !== "cancelled" ? (
        <T v="small" tone="muted" testID="session-closed">
          Scanning is open from 30 minutes before the start to an hour after the end.
        </T>
      ) : null}
      {s.status !== "cancelled" ? <Button label="Show code" icon={<QrCode size={20} color={c.onPrimary} />} onPress={() => openCode(s.id)} testID="session-code" /> : null}
      <Figures
        items={[
          { value: String(n.in + n.out), label: `of ${n.expected} came`, onPress: () => setF("all") },
          { value: String(n.in), label: "In now", onPress: () => setF("in") },
          { value: String(n.missing), label: "Not here", onPress: () => setF("missing") },
          { value: String(n.late), label: "Late", onPress: () => setF("late") },
        ]}
      />
      <FilterChips
        label="Show"
        value={f}
        onChange={setF}
        testID="roster-filter"
        options={[
          { id: "all", name: "Everyone", count: d.roster.length },
          { id: "in", name: "In", count: d.roster.filter((r) => r.state === "in").length },
          { id: "out", name: "Left", count: filterRoster(d.roster, "out").length },
          { id: "missing", name: "Not here", count: n.missing },
          { id: "late", name: "Late", count: n.late },
          { id: "leave", name: "On leave", count: n.leave },
        ]}
      />
      {rows.length ? (
        <StaggerList>
          {rows.map((r) => (
            <RosterLine key={r.studentId} r={r} canWrite={canWrite} onPress={() => setMark(r)} />
          ))}
        </StaggerList>
      ) : (
        <Quiet>No one here.</Quiet>
      )}
      {canWrite ? (
        <T v="small" tone="muted">
          Tap a name to mark it by hand.
        </T>
      ) : null}
      <MarkSheet row={mark} sessionId={s.id} onClose={() => setMark(null)} />
    </View>
  );
}

/** One session: Show code, the live list (in, left, not here, late), and marking by hand. */
export function AdminSessionScreen() {
  const { id = "" } = useLocalSearchParams<{ id: string }>();
  const q = useSessionDetail(String(id));
  const { refresh, refreshing } = useRefreshAdmin();
  return (
    <Screen testID="admin-session" onRefresh={refresh} refreshing={refreshing}>
      <ClinicLoaded admin q={q} what="this session" skeleton={<RowsSkeleton rows={6} />}>
        {(d) => <SessionBody d={d} />}
      </ClinicLoaded>
    </Screen>
  );
}
