import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { ChevronRight, KeyRound, ListFilter, Lock, MessageSquare, Share2, Unlock, X } from "lucide-react-native";
import * as React from "react";
import { Pressable, Share, View } from "react-native";
import Animated from "react-native-reanimated";

import { Button, Chips, EmptyState, RowsSkeleton, Screen, Sheet, SwitchRow, T } from "@/ds";
import { toast } from "@/ds/toast";
import { haptic } from "@/lib/haptics";
import { usePressScale } from "@/motion";
import { layout, space, useTheme } from "@/theme";
import { adminCalls, useStudents } from "../api";
import type { AdminStudentRow, AttentionFlag } from "../contract";
import { ACCOUNT_LABEL, accountLabel, accountTone, ago, filterCount, filterStudents, FLAG_LABEL, NO_FILTERS, PRESENCE_LABEL, studentsCsv, type Presence, type StudentFilters } from "../format";
import { ActionBar, Check, ConfirmSheet, Loaded, SearchBox, SelectRow, SmallButton, Status, SwipeRow, Tag, Tags } from "../kit";
import { AdminTop, openCompose, openStudent } from "../nav";
import { guarded, useAdminRole } from "../role";

/** One student in the list: name, account and when last seen, lectures, flags. The row opens the profile. */
export function StudentLine({ r, onPress, onLongPress, selecting }: { r: AdminStudentRow; onPress: () => void; onLongPress?: () => void; selecting?: boolean }) {
  const c = useTheme();
  const { style: pressStyle, handlers } = usePressScale(0.98);
  return (
    <Pressable
      testID={`student-${r.id}`}
      accessibilityRole="button"
      accessibilityLabel={`${r.name}. ${accountLabel(r.account)}. ${r.presence === "now" ? "On now" : `Seen ${ago(r.lastSeen)}`}`}
      accessibilityHint={selecting ? "Ticks or unticks this student" : onLongPress ? "Opens the profile. Press and hold to select" : undefined}
      onPress={onPress}
      onLongPress={
        onLongPress
          ? () => {
              haptic.tap();
              onLongPress();
            }
          : undefined
      }
      delayLongPress={350}
      {...handlers}
      style={({ pressed }) => ({ borderRadius: 8, backgroundColor: pressed ? c.tint : "transparent" })}
    >
      <Animated.View style={[{ minHeight: 72, paddingVertical: space[3], paddingHorizontal: space[2], flexDirection: "row", alignItems: "center", gap: space[2] }, pressStyle]}>
      <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
        <T v="bodyStrong">{r.name}</T>
        <View style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center", columnGap: space[3], rowGap: 2 }}>
          <Status tone={accountTone(r.account)}>{accountLabel(r.account)}</Status>
          <T v="small" tone="muted" num>
            {r.presence === "now" ? "On now" : ago(r.lastSeen)} · {r.lecturesDone}/{r.lecturesAvailable} lectures
          </T>
        </View>
        {r.flags.length ? (
          <View style={{ paddingTop: 2 }}>
            <Tags>
              {r.flags.map((f) => (
                <Tag key={f} tone="warn">
                  {FLAG_LABEL[f]}
                </Tag>
              ))}
            </Tags>
          </View>
        ) : null}
      </View>
      {selecting ? null : <ChevronRight size={20} color={c.muted} />}
      </Animated.View>
    </Pressable>
  );
}

/** The Filters sheet: cohort, account, last active, sort, needs attention. */
function FiltersSheet({ open, onClose, value, onChange, cohorts, shown }: { open: boolean; onClose: () => void; value: StudentFilters; onChange: (f: StudentFilters) => void; cohorts: { id: string; name: string }[]; shown: number }) {
  const set = (p: Partial<StudentFilters>) => onChange({ ...value, ...p });
  return (
    <Sheet open={open} onClose={onClose} title="Filters" testID="filters-sheet">
      <View style={{ gap: space[5] }}>
        <View style={{ gap: space[1] }}>
          <T v="small" tone="muted">
            Cohort
          </T>
          <Chips label="Cohort" value={value.cohort} onChange={(v) => set({ cohort: v })} options={[{ id: "", name: "All" }, ...cohorts.map((c) => ({ id: c.id, name: c.name })), { id: "none", name: "Not in a cohort" }]} />
        </View>
        <View style={{ gap: space[1] }}>
          <T v="small" tone="muted">
            Account
          </T>
          <Chips label="Account" value={value.account} onChange={(v) => set({ account: v })} options={[{ id: "", name: "Any" }, ...Object.entries(ACCOUNT_LABEL).map(([id, name]) => ({ id, name }))]} />
        </View>
        <View style={{ gap: space[1] }}>
          <T v="small" tone="muted">
            Last active
          </T>
          <Chips label="Last active" value={value.presence} onChange={(v) => set({ presence: v as "" | Presence })} options={[{ id: "", name: "Any" }, ...(Object.keys(PRESENCE_LABEL) as Presence[]).map((id) => ({ id, name: PRESENCE_LABEL[id] }))]} />
        </View>
        <View style={{ gap: space[1] }}>
          <T v="small" tone="muted">
            Sort by
          </T>
          <Chips
            label="Sort by"
            value={value.sort}
            onChange={(v) => set({ sort: v })}
            options={[
              { id: "name" as const, name: "Name" },
              { id: "roll" as const, name: "Roll number" },
              { id: "active" as const, name: "Last active" },
              { id: "lectures" as const, name: "Lectures finished" },
            ]}
          />
        </View>
        <SwitchRow title="Needs attention" meta="Only students with something to fix" value={value.attention} onChange={(v) => set({ attention: v })} testID="filter-attention" />
        <Button label={`Show ${shown} student${shown === 1 ? "" : "s"}`} onPress={onClose} testID="filters-done" />
        {filterCount(value) ? <Button kind="text" full label="Clear filters" onPress={() => onChange({ ...NO_FILTERS, search: value.search })} /> : null}
      </View>
    </Sheet>
  );
}

/**
 * Students: search, filters behind one button, and calm rows that open the
 * profile. Select (or a long press on a row) turns on tick boxes; one action
 * bar (the pinned footer) shows while something is ticked.
 */
export function AdminStudentsScreen() {
  const c = useTheme();
  const qc = useQueryClient();
  const params = useLocalSearchParams<{ flag?: string; account?: string; cohort?: string }>();
  const q = useStudents({ flag: params.flag });
  const { role, canWrite } = useAdminRole();
  const [f, setF] = React.useState<StudentFilters>({ ...NO_FILTERS, account: params.account ?? "", cohort: params.cohort ?? "" });
  const [flag, setFlag] = React.useState<AttentionFlag | undefined>(params.flag as AttentionFlag | undefined);
  // A new address (Home's "Login needs a hand") resets the filters.
  const [seen, setSeen] = React.useState(`${params.flag}|${params.account}|${params.cohort}`);
  const key = `${params.flag}|${params.account}|${params.cohort}`;
  if (key !== seen) {
    setSeen(key);
    setF({ ...NO_FILTERS, account: params.account ?? "", cohort: params.cohort ?? "" });
    setFlag(params.flag as AttentionFlag | undefined);
  }
  const [sheet, setSheet] = React.useState(false);
  const [picked, setPicked] = React.useState<Set<string>>(new Set());
  const [selecting, setSelecting] = React.useState(false);
  const stopSelecting = () => {
    setSelecting(false);
    setPicked(new Set());
  };
  const startWith = (id: string) => {
    setSelecting(true);
    setPicked(new Set([id]));
  };
  const [busy, setBusy] = React.useState<string | null>(null);
  const [confirmLock, setConfirmLock] = React.useState(false);

  const rows = React.useMemo(() => q.data?.items ?? [], [q.data]);
  const shown = React.useMemo(() => filterStudents(rows, f).filter((r) => !flag || r.flags.includes(flag)), [rows, f, flag]);
  const pickedRows = rows.filter((r) => picked.has(r.id));
  const allPicked = shown.length > 0 && shown.every((r) => picked.has(r.id));
  const nFilters = filterCount(f) + (flag ? 1 : 0);
  const toggle = (id: string) =>
    setPicked((p) => {
      const n = new Set(p);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  async function bulk(kind: "lock" | "unlock" | "links") {
    if (busy || !pickedRows.length) return;
    await guarded(role, kind === "links" ? "login-link" : kind, async () => {
      setBusy(kind);
      let good = 0;
      let bad = 0;
      for (const r of pickedRows) {
        try {
          if (kind === "links") await adminCalls.loginLink(r.id);
          else if (kind === "lock") await adminCalls.lock(r.id, "Locked from the app (several at once)");
          else await adminCalls.unlock(r.id);
          good++;
        } catch {
          bad++;
        }
      }
      setBusy(null);
      setConfirmLock(false);
      const what = kind === "links" ? "Login links sent" : kind === "lock" ? "Locked" : "Unlocked";
      if (bad) haptic.warn();
      else haptic.success();
      toast.show(bad ? `${what}: ${good}. ${bad} did not work.` : `${what}: ${good}.`);
      stopSelecting();
      void qc.invalidateQueries({ queryKey: ["admin"] });
    });
  }

  const share = () => {
    const list = pickedRows.length ? pickedRows : shown;
    void Share.share({ title: "VIBHA students", message: studentsCsv(list) }).catch(() => undefined);
  };

  const icon = { size: 18, color: c.ink };
  const bar = picked.size ? (
    <ActionBar count={picked.size} onClear={stopSelecting} testID="action-bar">
      {canWrite ? (
        <>
          <SmallButton label="Send login link" icon={<KeyRound {...icon} />} busy={busy === "links"} onPress={() => void bulk("links")} testID="bulk-links" />
          <SmallButton label="Lock" icon={<Lock {...icon} />} onPress={() => setConfirmLock(true)} testID="bulk-lock" />
          <SmallButton label="Unlock" icon={<Unlock {...icon} />} busy={busy === "unlock"} onPress={() => void bulk("unlock")} testID="bulk-unlock" />
          <SmallButton label="Message" icon={<MessageSquare {...icon} />} onPress={() => openCompose({ to: pickedRows.map((r) => r.id) })} testID="bulk-message" />
        </>
      ) : null}
      <SmallButton label="Share list" icon={<Share2 {...icon} />} onPress={share} testID="bulk-share" />
    </ActionBar>
  ) : undefined;

  return (
    <Screen tab top={<AdminTop />} title="Students" testID="admin-students" gap={space[4]} onRefresh={() => void q.refetch()} refreshing={q.isRefetching} footer={bar}>
      <View style={{ flexDirection: "row", gap: space[2], alignItems: "center" }}>
        <SearchBox value={f.search} onChange={(search) => setF((x) => ({ ...x, search }))} placeholder="Name, email, roll, mobile" label="Search students" testID="students-search" />
        <Pressable
          testID="students-filters"
          accessibilityRole="button"
          accessibilityLabel={nFilters ? `Filters, ${nFilters} on` : "Filters"}
          onPress={() => {
            setSheet(true);
          }}
          style={({ pressed }) => ({ minHeight: layout.target, paddingHorizontal: space[3], borderRadius: layout.radius, borderWidth: 1.5, borderColor: nFilters ? c.ink : c.cardLine, flexDirection: "row", alignItems: "center", gap: space[2], backgroundColor: pressed ? c.tint : c.card })}
        >
          <ListFilter size={18} color={c.ink} />
          <T v="small" style={{ fontFamily: "Archivo-600" }}>
            {nFilters ? `Filters ${nFilters}` : "Filters"}
          </T>
        </Pressable>
      </View>
      <Loaded q={q} soon what="students" skeleton={<RowsSkeleton rows={8} />}>
        {() => (
          <View style={{ gap: space[2] }}>
            {flag ? (
              <Pressable testID="flag-chip" accessibilityRole="button" accessibilityLabel={`Showing ${FLAG_LABEL[flag]}. Remove`} onPress={() => setFlag(undefined)} style={{ alignSelf: "flex-start", minHeight: layout.target, flexDirection: "row", alignItems: "center", gap: space[1], borderRadius: 22, paddingHorizontal: space[3], backgroundColor: c.tint }}>
                <T v="small">{FLAG_LABEL[flag]}</T>
                <X size={16} color={c.muted} />
              </Pressable>
            ) : null}
            <View style={{ flexDirection: "row", alignItems: "center", marginLeft: selecting ? -space[2] : 0, gap: space[1], minHeight: layout.target }}>
              {selecting ? <Check on={allPicked} onPress={() => setPicked(allPicked ? new Set() : new Set(shown.map((r) => r.id)))} label="Select everyone shown" testID="students-all" /> : null}
              <T v="small" tone="muted" num style={{ flex: 1 }} accessibilityLiveRegion="polite" testID="students-count">
                {shown.length === rows.length ? `${rows.length} students` : `${shown.length} of ${rows.length}`}
              </T>
              {nFilters || f.search ? (
                <Button
                  kind="text"
                  label="Clear filters"
                  onPress={() => {
                    setF(NO_FILTERS);
                    setFlag(undefined);
                  }}
                />
              ) : null}
              {shown.length ? <Button kind="text" label={selecting ? "Done" : "Select"} onPress={() => (selecting ? stopSelecting() : setSelecting(true))} testID="students-select" /> : null}
            </View>
            {shown.length === 0 ? (
              <EmptyState mood={rows.length ? "missing" : "empty"} title={rows.length ? "No one matches" : "No students yet"} body={rows.length ? "Try fewer filters." : "Students appear here once they are added on the website."} />
            ) : (
              <View style={{ borderTopWidth: 1, borderColor: c.hairline }}>
                {shown.map((r) => (
                  <View key={r.id} style={{ borderBottomWidth: 1, borderColor: c.hairline }}>
                    {selecting ? (
                      <SelectRow on={picked.has(r.id)} onToggle={() => toggle(r.id)} label={`Select ${r.name}`} testID={`student-${r.id}`}>
                        <StudentLine r={r} selecting onPress={() => toggle(r.id)} />
                      </SelectRow>
                    ) : (
                      <View style={{ marginHorizontal: -space[2] }}>
                        <SwipeRow enabled={canWrite} action={{ label: "Message", onPress: () => openCompose({ to: [r.id] }) }} testID={`swipe-${r.id}`}>
                          <StudentLine r={r} onPress={() => openStudent(r.id)} onLongPress={() => startWith(r.id)} />
                        </SwipeRow>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </Loaded>
      <FiltersSheet open={sheet} onClose={() => setSheet(false)} value={f} onChange={setF} cohorts={q.data?.cohorts ?? []} shown={shown.length} />
      <ConfirmSheet open={confirmLock} onClose={() => setConfirmLock(false)} title={`Lock ${pickedRows.length} account${pickedRows.length === 1 ? "" : "s"}?`} body="They cannot sign in until you unlock them." confirm="Lock" danger busy={busy === "lock"} onConfirm={() => void bulk("lock")} testID="confirm-lock" />
    </Screen>
  );
}
