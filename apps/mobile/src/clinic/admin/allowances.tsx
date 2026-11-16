import * as React from "react";
import { Pressable, View } from "react-native";

import { useAdminAction, useRefreshAdmin } from "@/admin/api";
import { ActionBar, Check, Loaded, Quiet, SearchBox, SmallButton } from "@/admin/kit";
import { useAdminRole } from "@/admin/role";
import { Button, Field, RowsSkeleton, Screen, Section, Sheet, T } from "@/ds";
import { haptic } from "@/lib/haptics";
import { layout, space, useTheme } from "@/theme";
import { adminClinicCalls, useClinicStudents } from "../api";
import type { Batch, ClinicStudent, ClinicStudents, Ref } from "../contract";
import { BATCH_NAME } from "../logic";
import { LineRow, Pills, Stepper } from "./kit";

/** The same leaves and cases for a whole cohort or the students ticked. */
function BulkSheet({ open, onClose, cohorts, picked }: { open: boolean; onClose: () => void; cohorts: Ref[]; picked: string[] }) {
  const [cohort, setCohort] = React.useState<string>(cohorts[0]?.id ?? "");
  const [what, setWhat] = React.useState<"leaves" | "cases">("leaves");
  const [n, setN] = React.useState(4);
  const [note, setNote] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const { run, busy } = useAdminAction();
  const go = async () => {
    if (!note.trim()) return setError("Write a short note for the change.");
    setError(null);
    const body = { ...(picked.length ? { studentIds: picked } : { cohortId: cohort }), ...(what === "leaves" ? { leaves: n } : { opdTotal: n }), note: note.trim() };
    const r = await run("clinic", () => adminClinicCalls.bulkAllowance(body), { done: (x) => `Saved for ${x.updated} ${x.updated === 1 ? "student" : "students"}` });
    if (r !== undefined) {
      setNote("");
      onClose();
    }
  };
  return (
    <Sheet open={open} onClose={onClose} title={picked.length ? `Set for ${picked.length} selected` : "Set for a cohort"} testID="bulk-sheet">
      <View style={{ gap: space[4] }}>
        {!picked.length ? <Pills label="Cohort" options={cohorts} value={cohort} onChange={setCohort} testID="bulk-cohort" /> : null}
        <Pills
          label="What"
          value={what}
          onChange={(v) => {
            setWhat(v);
            setN(v === "leaves" ? 4 : 8);
          }}
          options={[
            { id: "leaves", name: "Leaves" },
            { id: "cases", name: "OPD cases" },
          ]}
          testID="bulk-what"
        />
        <LineRow label={what === "leaves" ? "Leaves each" : "Cases each"} meta={what === "cases" ? "Paid extras are added on top" : undefined}>
          <Stepper value={n} onChange={setN} max={what === "leaves" ? 30 : 60} label={what === "leaves" ? "Leaves each" : "Cases each"} testID="bulk-n" />
        </LineRow>
        <Field label="Note" value={note} onChangeText={setNote} error={error} maxLength={140} placeholder="For example: term two" testID="bulk-note" />
        <Button label="Save" busy={!!busy} onPress={() => void go()} testID="bulk-save" />
      </View>
    </Sheet>
  );
}

/** One student: leaves, total cases, batch, and paid extra cases; every change keeps a note. */
function EditSheet({ s, onClose }: { s: ClinicStudent | null; onClose: () => void }) {
  const [leaves, setLeaves] = React.useState(s?.leaveAllowance ?? 0);
  const [cases, setCases] = React.useState(s ? s.opdTotal - s.extras : 0);
  const [batch, setBatch] = React.useState<Batch | null>(s?.batch ?? null);
  const [extra, setExtra] = React.useState(0);
  const [note, setNote] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const { run, busy } = useAdminAction();
  if (!s) return null;
  const changed = leaves !== s.leaveAllowance || cases !== s.opdTotal - s.extras || batch !== s.batch;
  const go = async () => {
    if (!changed && !extra) return onClose();
    if (!note.trim()) return setError(extra ? "Write a note, for example: paid 12 Nov." : "Write a short note for the change.");
    setError(null);
    const r = await run(
      "clinic",
      async () => {
        if (changed) await adminClinicCalls.editStudent(s.studentId, { leaveAllowance: leaves, opdTotal: cases + s.extras, ...(batch && batch !== s.batch ? { batch } : {}), note: note.trim() });
        if (extra) await adminClinicCalls.extraCases(s.studentId, { cases: extra, note: note.trim() });
        return true;
      },
      { done: `Saved for ${s.name}` },
    );
    if (r) onClose();
  };
  return (
    <Sheet open onClose={onClose} title={s.name} testID="edit-sheet">
      <View style={{ gap: space[4] }}>
        <View>
          <LineRow label="Leaves" meta={`${s.leavesUsed} used`}>
            <Stepper value={leaves} onChange={setLeaves} max={30} label="Leaves" testID="edit-leaves" />
          </LineRow>
          <LineRow label="OPD cases" meta={`${s.casesDone} done${s.extras ? `, plus ${s.extras} paid extra` : ""}`}>
            <Stepper value={cases} onChange={setCases} max={60} label="OPD cases" testID="edit-cases" />
          </LineRow>
          <LineRow label="Add paid extra cases" meta="After the payment">
            <Stepper value={extra} onChange={setExtra} max={50} label="Paid extra cases" testID="edit-extra" />
          </LineRow>
        </View>
        <Pills label="Batch" value={batch} onChange={setBatch} options={(["morning", "evening"] as const).map((b) => ({ id: b, name: BATCH_NAME[b] }))} testID="edit-batch" />
        <Field label="Note" value={note} onChangeText={setNote} error={error} maxLength={140} placeholder={extra ? "For example: paid 12 Nov" : "Why this changed"} testID="edit-note" />
        <Button label="Save" busy={!!busy} onPress={() => void go()} testID="edit-save" />
      </View>
    </Sheet>
  );
}

function StudentLine({ s, on, onToggle, onOpen, canWrite }: { s: ClinicStudent; on: boolean; onToggle: () => void; onOpen: () => void; canWrite: boolean }) {
  const c = useTheme();
  return (
    <View style={{ flexDirection: "row", alignItems: "center", borderTopWidth: 1, borderColor: c.hairline, backgroundColor: on ? c.selected : "transparent", marginHorizontal: -space[2], paddingRight: space[2], borderRadius: 8 }}>
      {canWrite ? <Check on={on} onPress={onToggle} label={`Select ${s.name}`} testID={`allow-${s.studentId}-check`} /> : <View style={{ width: space[2] }} />}
      <Pressable
        testID={`allow-${s.studentId}`}
        accessibilityRole="button"
        accessibilityLabel={`${s.name}. ${s.leavesLeft} of ${s.leaveAllowance} leaves left. ${s.casesDone} of ${s.opdTotal} cases.`}
        disabled={!canWrite}
        onPress={() => {
          haptic.select();
          onOpen();
        }}
        style={({ pressed }) => ({ flex: 1, minHeight: layout.row, paddingVertical: space[2], justifyContent: "center", opacity: pressed ? 0.7 : 1 })}
      >
        <T v="bodyStrong">{s.name}</T>
        <T v="small" tone="muted" num>
          {s.leavesLeft} of {s.leaveAllowance} leaves left · {s.casesDone}/{s.opdTotal} cases{s.extras ? ` (${s.extras} paid)` : ""} · {s.batch ? BATCH_NAME[s.batch] : "No batch"}
        </T>
      </Pressable>
    </View>
  );
}

function Body({ d }: { d: ClinicStudents }) {
  const { canWrite } = useAdminRole();
  const [cohort, setCohort] = React.useState<string>("");
  const [search, setSearch] = React.useState("");
  const [picked, setPicked] = React.useState<string[]>([]);
  const [bulk, setBulk] = React.useState(false);
  const [edit, setEdit] = React.useState<ClinicStudent | null>(null);
  const rows = d.items.filter((s) => (!cohort || s.cohortId === cohort) && (!search.trim() || s.name.toLowerCase().includes(search.trim().toLowerCase())));
  return (
    <View style={{ gap: space[4] }}>
      <SearchBox value={search} onChange={setSearch} placeholder="Find a student" label="Find a student" testID="allow-search" />
      <Pills label="Cohort" value={cohort} onChange={setCohort} options={[{ id: "", name: "All" }, ...d.cohorts]} testID="allow-cohort" />
      {canWrite && !picked.length ? (
        <View style={{ alignItems: "flex-start" }}>
          <SmallButton label="Set for a whole cohort" onPress={() => setBulk(true)} testID="allow-bulk" />
        </View>
      ) : null}
      <Section>
        {rows.length ? (
          <View>
            {rows.map((s) => (
              <StudentLine key={s.studentId} s={s} canWrite={canWrite} on={picked.includes(s.studentId)} onToggle={() => setPicked((p) => (p.includes(s.studentId) ? p.filter((x) => x !== s.studentId) : [...p, s.studentId]))} onOpen={() => setEdit(s)} />
            ))}
          </View>
        ) : (
          <Quiet>No students match.</Quiet>
        )}
      </Section>
      {picked.length ? (
        <ActionBar count={picked.length} onClear={() => setPicked([])} testID="allow-bar">
          <SmallButton label="Set leaves or cases" onPress={() => setBulk(true)} testID="allow-bulk-picked" />
        </ActionBar>
      ) : null}
      {bulk ? (
        <BulkSheet
          open
          cohorts={d.cohorts}
          picked={picked}
          onClose={() => {
            setBulk(false);
            setPicked([]);
          }}
        />
      ) : null}
      {edit ? <EditSheet key={edit.studentId} s={edit} onClose={() => setEdit(null)} /> : null}
    </View>
  );
}

/** Allowances: each student's leaves and OPD cases, set in bulk or one by one (with a note). */
export function AdminAllowancesScreen() {
  const q = useClinicStudents();
  const { refresh, refreshing } = useRefreshAdmin();
  return (
    <Screen testID="admin-allowances" title="Allowances" onRefresh={refresh} refreshing={refreshing}>
      <Loaded q={q} what="the students" soon skeleton={<RowsSkeleton rows={6} />}>
        {(d) => <Body d={d} />}
      </Loaded>
    </Screen>
  );
}
