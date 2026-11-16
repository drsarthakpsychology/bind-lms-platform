import { useQueryClient } from "@tanstack/react-query";
import { Minus, Moon, Plus, Sun } from "lucide-react-native";
import * as React from "react";
import { Pressable, View } from "react-native";

import { ConfirmSheet } from "@/admin/kit";
import { messageOf } from "@/api/errors";
import { Button, Field, IconButton, RowsSkeleton, Screen, Section, Sheet, T, toast } from "@/ds";
import { haptic } from "@/lib/haptics";
import { Burst, ProgressRing, RollingNumber, useCelebrate } from "@/motion";
import { AreaProvider, layout, space, useAccent, useTheme } from "@/theme";
import { clinicCalls, clinicKeys, opdQuery, useOpd } from "../api";
import { ClinicLoaded } from "../loaded";
import type { Batch, OpdPage, OpdVisit } from "../contract";
import { BATCH_NAME, casesLine, pct, rangeLabel, relDay, todayIST, visitsNeeded } from "../logic";
import { VisitWord } from "../parts";

/** Morning or Evening, chosen once. */
function BatchChoice({ onPick }: { onPick: (b: Batch) => void }) {
  const c = useTheme();
  const a = useAccent();
  const card = (b: Batch, Icon: typeof Sun, when: string) => (
    <Pressable
      key={b}
      testID={`batch-${b}`}
      accessibilityRole="button"
      accessibilityLabel={`${BATCH_NAME[b]} batch, ${when}`}
      onPress={() => {
        haptic.select();
        onPick(b);
      }}
      style={({ pressed }) => ({ flex: 1, minHeight: 120, borderRadius: 16, padding: space[4], gap: space[2], backgroundColor: pressed ? a.deep : a.wash, borderWidth: 1, borderColor: c.hairline })}
    >
      {({ pressed }) => (
        <>
          <Icon size={24} color={pressed ? a.onDeep : a.deep} />
          <T v="h3" style={pressed ? { color: a.onDeep } : undefined}>
            {BATCH_NAME[b]}
          </T>
          <T v="small" tone={pressed ? undefined : "muted"} style={pressed ? { color: a.onDeep } : undefined}>
            {when}
          </T>
        </>
      )}
    </Pressable>
  );
  return (
    <Section title="Pick your OPD batch">
      <T v="small" tone="muted">
        You choose once. After that, only the admin can change it.
      </T>
      <View style={{ flexDirection: "row", gap: space[3] }}>
        {card("morning", Sun, "OPD visits in the morning")}
        {card("evening", Moon, "OPD visits in the evening")}
      </View>
    </Section>
  );
}

/** The log for one visit: how many cases (0 allowed) or "I was absent", and a one-line note. */
function LogSheet({ visit, onClose, onDone }: { visit: OpdVisit | null; onClose: () => void; onDone: () => void }) {
  const c = useTheme();
  const [n, setN] = React.useState(2);
  const [note, setNote] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const send = async (absent: boolean) => {
    if (!visit) return;
    setBusy(true);
    setError(null);
    try {
      await clinicCalls.logCases({ assignmentId: visit.id, cases: absent ? 0 : n, absent, note: note.trim() || undefined });
      setNote("");
      onDone();
    } catch (e) {
      haptic.warn();
      setError(messageOf(e));
    } finally {
      setBusy(false);
    }
  };
  const step = (d: number) => {
    haptic.select();
    setN((x) => Math.max(0, Math.min(20, x + d)));
  };
  return (
    <Sheet open={!!visit} onClose={onClose} title={visit ? `Cases on ${relDay(visit.date, todayIST())}` : ""} testID="log-sheet">
      <View style={{ gap: space[4] }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: space[5] }} accessible accessibilityRole="adjustable" accessibilityLabel={`Cases taken: ${n}`} accessibilityActions={[{ name: "increment" }, { name: "decrement" }]} onAccessibilityAction={(e) => step(e.nativeEvent.actionName === "increment" ? 1 : -1)}>
          <IconButton label="One less" onPress={() => step(-1)} testID="log-minus">
            <Minus size={24} color={c.ink} />
          </IconButton>
          <View style={{ minWidth: 72, alignItems: "center" }}>
            <RollingNumber v="display" value={n} />
            <T v="caption" tone="muted">
              {n === 1 ? "case" : "cases"}
            </T>
          </View>
          <IconButton label="One more" onPress={() => step(1)} testID="log-plus">
            <Plus size={24} color={c.ink} />
          </IconButton>
        </View>
        <Field label="Note (optional)" value={note} onChangeText={setNote} maxLength={140} placeholder="One line, for example: two follow ups" testID="log-note" />
        {error ? (
          <T v="small" tone="alert" accessibilityRole="alert">
            {error}
          </T>
        ) : null}
        <Button label={`Save ${n} ${n === 1 ? "case" : "cases"}`} busy={busy} needsServer onPress={() => void send(false)} testID="log-save" />
        <Button kind="quiet" label="I was absent" disabled={busy} onPress={() => void send(true)} testID="log-absent" />
      </View>
    </Sheet>
  );
}

function VisitRow({ v, onLog }: { v: OpdVisit; onLog: () => void }) {
  const c = useTheme();
  const today = todayIST();
  const canLog = v.status === "to_log" || v.status === "today";
  return (
    <View testID={`visit-${v.id}`} style={{ minHeight: layout.row, paddingVertical: space[3], flexDirection: "row", alignItems: "center", gap: space[3], borderTopWidth: 1, borderColor: c.hairline }}>
      <View style={{ flex: 1, minWidth: 0 }}>
        <T v="bodyStrong">{relDay(v.date, today)}</T>
        <T v="small" tone="muted" num>
          {BATCH_NAME[v.batch]}, {rangeLabel(v.start, v.end)}
          {v.status === "logged" && v.cases !== null ? ` · ${v.cases} ${v.cases === 1 ? "case" : "cases"}` : ""}
        </T>
        {v.note ? (
          <T v="small" tone="muted">
            {v.note}
          </T>
        ) : null}
      </View>
      {canLog ? <Button kind={v.status === "to_log" ? "primary" : "quiet"} full={false} label="Log cases" onPress={onLog} testID={`visit-${v.id}-log`} /> : <VisitWord s={v.status} />}
    </View>
  );
}

/** OPD: my batch (picked once), cases done of total, my visit days and the case log after each one. */
export function OpdScreen() {
  const q = useOpd();
  const qc = useQueryClient();
  const a = useAccent();
  const [logging, setLogging] = React.useState<OpdVisit | null>(null);
  const [batch, setBatch] = React.useState<Batch | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [fire, setFire] = React.useState(0);
  const celebrate = useCelebrate();
  const refresh = () => void qc.invalidateQueries({ queryKey: clinicKeys.all });
  const saveBatch = async (b: Batch) => {
    setBusy(true);
    try {
      await clinicCalls.setBatch(b);
      haptic.success();
      toast.show(`${BATCH_NAME[b]} batch saved`);
      setBatch(null);
      refresh();
    } catch (e) {
      haptic.warn();
      toast.show(messageOf(e));
    } finally {
      setBusy(false);
    }
  };
  return (
    <AreaProvider area="home">
      <Screen testID="clinic-opd" onRefresh={() => void q.refetch()} refreshing={q.isRefetching}>
        <ClinicLoaded q={q} what="your OPD cases" skeleton={<RowsSkeleton rows={4} />}>
          {(p: OpdPage) => {
            const needed = visitsNeeded(p.total, p.done, p.casesPerVisit);
            const toLog = p.visits.filter((v) => v.status === "to_log");
            const coming = p.visits.filter((v) => v.status === "upcoming" || v.status === "today");
            const past = p.visits.filter((v) => !["upcoming", "today", "to_log"].includes(v.status)).reverse();
            return (
              <View style={{ gap: layout.section }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: space[4] }} testID="opd-cases">
                  <View style={{ alignItems: "center", justifyContent: "center" }}>
                    <ProgressRing pct={pct(p.done, p.total) ?? 0} size={88} stroke={8} color={a.deep} track={a.wash} label={casesLine(p.done, p.total)}>
                      <T v="h2" num>
                        {p.done}
                      </T>
                    </ProgressRing>
                    <Burst fire={fire} reach={56} />
                  </View>
                  <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
                    <T v="h3" num testID="opd-cases-line">
                      {casesLine(p.done, p.total)}
                    </T>
                    {p.extras ? (
                      <T v="small" tone="muted" num>
                        Includes {p.extras} extra {p.extras === 1 ? "case" : "cases"}
                      </T>
                    ) : null}
                    <T v="small" tone="muted" num>
                      {p.done >= p.total ? "All your cases are done." : `About ${needed} more ${needed === 1 ? "visit" : "visits"} at ${p.casesPerVisit} a visit`}
                    </T>
                    {p.batch ? (
                      <T v="small" tone="muted" testID="opd-batch">
                        {BATCH_NAME[p.batch]} batch{p.batchLocked ? ". Ask the admin to change it." : ""}
                      </T>
                    ) : null}
                  </View>
                </View>
                {!p.batch ? <BatchChoice onPick={setBatch} /> : null}
                {toLog.length ? (
                  <Section title="Log your cases">
                    <View>
                      {toLog.map((v) => (
                        <VisitRow key={v.id} v={v} onLog={() => setLogging(v)} />
                      ))}
                    </View>
                  </Section>
                ) : null}
                <Section title="My OPD days">
                  {!p.visits.length ? (
                    <T v="small" tone="muted">
                      Your OPD days show here once the admin publishes the timetable.
                    </T>
                  ) : coming.length ? (
                    <View>
                      {coming.map((v) => (
                        <VisitRow key={v.id} v={v} onLog={() => setLogging(v)} />
                      ))}
                    </View>
                  ) : (
                    <T v="small" tone="muted">
                      No more OPD days for now.
                    </T>
                  )}
                </Section>
                {past.length ? (
                  <Section title="Done">
                    <View>
                      {past.map((v) => (
                        <VisitRow key={v.id} v={v} onLog={() => setLogging(v)} />
                      ))}
                    </View>
                  </Section>
                ) : null}
                <LogSheet
                  visit={logging}
                  onClose={() => setLogging(null)}
                  onDone={() => {
                    setLogging(null);
                    // The new count comes from the server's own tally, then the ring fills and sparks.
                    void qc
                      .fetchQuery({ ...opdQuery, staleTime: 0 })
                      .then((next) => celebrate({ win: true, result: () => toast.show(`Saved. ${casesLine(next.done, next.total)}`), particles: () => setFire((x) => x + 1) }))
                      .catch(() => toast.show("Saved"))
                      .finally(refresh);
                  }}
                />
              </View>
            );
          }}
        </ClinicLoaded>
        <ConfirmSheet
          open={!!batch}
          onClose={() => setBatch(null)}
          title={batch ? `${BATCH_NAME[batch]} batch?` : ""}
          body="You can pick only once. After this, only the admin can change it."
          confirm={batch ? `Yes, ${BATCH_NAME[batch].toLowerCase()}` : "Yes"}
          busy={busy}
          onConfirm={() => batch && void saveBatch(batch)}
          testID="batch-confirm"
        />
      </Screen>
    </AreaProvider>
  );
}
