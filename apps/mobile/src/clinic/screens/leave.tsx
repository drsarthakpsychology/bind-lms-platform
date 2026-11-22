import { useQueryClient } from "@tanstack/react-query";
import { Check as CheckIcon } from "lucide-react-native";
import * as React from "react";
import { Pressable, View } from "react-native";

import { messageOf } from "@/api/errors";
import { BackBar, OwnHeader, Button, Field, FieldCard, Label, QuietEmpty, Screen, Sheet, Skeleton, Stone, T, toast } from "@/ds";
import { haptic } from "@/lib/haptics";
import { ProgressRing, RollingNumber } from "@/motion";
import { AreaProvider, layout, space, useTheme } from "@/theme";
import { clinicCalls, clinicKeys, useLeave } from "../api";
import { ClinicLoaded } from "../loaded";
import type { ClinicSession, LeavePage, LeaveRequest } from "../contract";
import { canLeaveEarly, dateLabel, minutesOf, parseClock, rangeLabel, relDay, requestTitle, sessionTitle, timeLabel, todayIST } from "../logic";
import { LeavePill, StoneList } from "../ui";

/** A whole-row tick: the row is the target (56px), the box shows the state. */
export function PickRow({ on, onPress, title, meta, radio, testID }: { on: boolean; onPress: () => void; title: string; meta?: string; radio?: boolean; testID?: string }) {
  const c = useTheme();
  return (
    <Pressable
      testID={testID}
      accessibilityRole={radio ? "radio" : "checkbox"}
      accessibilityState={radio ? { selected: on } : { checked: on }}
      accessibilityLabel={meta ? `${title}, ${meta}` : title}
      onPress={() => {
        haptic.select();
        onPress();
      }}
      style={({ pressed }) => ({ minHeight: layout.row, flexDirection: "row", alignItems: "center", gap: space[3], paddingVertical: space[2], paddingHorizontal: space[4], marginBottom: space[2], borderRadius: layout.radius, backgroundColor: on ? c.ink : pressed ? c.tint : c.card })}
    >
      {radio ? (
        <View style={{ width: 22, height: 22, borderRadius: 11, borderWidth: on ? 7 : 1.5, borderColor: on ? c.lime : c.fieldLine }} />
      ) : (
        <View style={{ width: 22, height: 22, borderRadius: 5, borderWidth: 1.5, borderColor: on ? c.lime : c.fieldLine, backgroundColor: on ? c.lime : "transparent", alignItems: "center", justifyContent: "center" }}>{on ? <CheckIcon size={15} strokeWidth={3} color={c.onLime} /> : null}</View>
      )}
      <View style={{ flex: 1, minWidth: 0 }}>
        <T v="bodyStrong" style={on ? { color: c.bg } : undefined}>
          {title}
        </T>
        {meta ? (
          <T v="small" tone={on ? undefined : "muted"} num style={on ? { color: c.bg, opacity: 0.8 } : undefined}>
            {meta}
          </T>
        ) : null}
      </View>
    </Pressable>
  );
}

const sessLine = (s: Pick<ClinicSession, "date" | "start" | "end">, today: string) => `${relDay(s.date, today)}, ${rangeLabel(s.start, s.end)}`;

/** Ask for leave: tick one or more upcoming sessions, write why. */
function AskSheet({ open, onClose, page, onDone }: { open: boolean; onClose: () => void; page: LeavePage; onDone: () => void }) {
  const today = todayIST();
  const [picked, setPicked] = React.useState<string[]>([]);
  const [reason, setReason] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);
  const over = picked.length > 0 && picked.length > page.left;
  const send = async () => {
    if (!picked.length) return setError("Tick at least one session.");
    if (reason.trim().length < 3) return setError("Write a short reason.");
    setError(null);
    setBusy(true);
    try {
      await clinicCalls.askLeave({ sessionIds: picked, reason: reason.trim() });
      haptic.success();
      toast.show("Sent. You will get a notification when it is decided.");
      setPicked([]);
      setReason("");
      onDone();
    } catch (e) {
      haptic.warn();
      setError(messageOf(e));
    } finally {
      setBusy(false);
    }
  };
  return (
    <Sheet open={open} onClose={onClose} title="Ask for leave" testID="leave-sheet">
      <View style={{ gap: space[4] }}>
        <T v="small" tone="muted">
          Each session you miss uses one leave.
        </T>
        <View>
          {page.upcoming.map((s) => (
            <PickRow key={s.id} on={picked.includes(s.id)} onPress={() => setPicked((p) => (p.includes(s.id) ? p.filter((x) => x !== s.id) : [...p, s.id]))} title={sessionTitle(s)} meta={sessLine(s, today)} testID={`leave-pick-${s.id}`} />
          ))}
          {!page.upcoming.length ? (
            <T v="small" tone="muted">
              No upcoming sessions to ask for.
            </T>
          ) : null}
        </View>
        {over ? (
          <T v="small" tone="alert" testID="leave-over">
            {page.left <= 0 ? "You have no leaves left." : `That is more than the ${page.left} ${page.left === 1 ? "leave" : "leaves"} you have left.`} You can still ask; the admin decides.
          </T>
        ) : null}
        <Field label="Reason" value={reason} onChangeText={setReason} maxLength={200} placeholder="For example: family function" testID="leave-reason" />
        {error ? (
          <T v="small" tone="alert" accessibilityRole="alert" testID="leave-error">
            {error}
          </T>
        ) : null}
        <Button label={picked.length > 1 ? `Ask for ${picked.length} sessions` : "Ask for leave"} busy={busy} needsServer onPress={() => void send()} testID="leave-send" />
      </View>
    </Sheet>
  );
}

/** Leave early: one session from today on, the time, why. Does not use a leave. */
function EarlySheet({ open, onClose, page, onDone }: { open: boolean; onClose: () => void; page: LeavePage; onDone: () => void }) {
  const today = todayIST();
  const options = page.upcoming.filter((s) => canLeaveEarly(s, today)).slice(0, 8);
  const [pick, setPick] = React.useState<string | null>(null);
  const [time, setTime] = React.useState("");
  const [reason, setReason] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);
  const s = options.find((o) => o.id === pick) ?? null;
  const send = async () => {
    if (!s) return setError("Pick the session.");
    const at = parseClock(time);
    if (!at) return setError("Write the time, for example 5 pm or 17:30.");
    if (minutesOf(at) <= minutesOf(s.start) || minutesOf(at) >= minutesOf(s.end)) return setError(`Pick a time between ${timeLabel(s.start)} and ${timeLabel(s.end)}.`);
    if (reason.trim().length < 3) return setError("Write a short reason.");
    setError(null);
    setBusy(true);
    try {
      await clinicCalls.askEarly({ sessionId: s.id, leaveAt: at, reason: reason.trim() });
      haptic.success();
      toast.show("Sent. You will get a notification when it is decided.");
      setPick(null);
      setTime("");
      setReason("");
      onDone();
    } catch (e) {
      haptic.warn();
      setError(messageOf(e));
    } finally {
      setBusy(false);
    }
  };
  return (
    <Sheet open={open} onClose={onClose} title="Leave early" testID="early-sheet">
      <View style={{ gap: space[4] }}>
        <T v="small" tone="muted">
          This does not use a leave.
        </T>
        <View accessibilityRole="radiogroup">
          {options.map((o) => (
            <PickRow key={o.id} radio on={pick === o.id} onPress={() => setPick(o.id)} title={sessionTitle(o)} meta={sessLine(o, today)} testID={`early-pick-${o.id}`} />
          ))}
        </View>
        <Field label="Leave at" value={time} onChangeText={setTime} placeholder={s ? `Before ${timeLabel(s.end)}` : "For example 5 pm"} maxLength={8} testID="early-time" />
        <Field label="Reason" value={reason} onChangeText={setReason} maxLength={200} testID="early-reason" />
        {error ? (
          <T v="small" tone="alert" accessibilityRole="alert" testID="early-error">
            {error}
          </T>
        ) : null}
        <Button label="Ask to leave early" busy={busy} needsServer onPress={() => void send()} testID="early-send" />
      </View>
    </Sheet>
  );
}

function RequestRow({ r, onCancel, today }: { r: LeaveRequest; onCancel: () => void; today: string }) {
  const c = useTheme();
  const what = requestTitle(r);
  return (
    <View testID={`req-${r.id}`} style={{ paddingVertical: space[3], paddingHorizontal: space[4], gap: space[1] }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: space[3] }}>
        <T v="bodyStrong" style={{ flex: 1 }}>
          {what}
        </T>
        <LeavePill s={r.status} testID={`req-${r.id}-status`} />
      </View>
      {r.sessions.map((s) => (
        <T key={s.id} v="small" tone="muted" num>
          {s.title} · {s.date === today ? "Today" : dateLabel(s.date)}
          {s.start ? `, ${timeLabel(s.start)}` : ""}
        </T>
      ))}
      {r.reason ? <T v="small">{r.reason}</T> : null}
      {r.overLimit ? (
        <T v="small" style={{ color: c.warnFg }}>
          Asked with no leaves left
        </T>
      ) : null}
      {r.adminNote ? (
        <View style={{ marginTop: space[1], backgroundColor: c.bg, borderRadius: 14, borderTopLeftRadius: 4, paddingVertical: space[2], paddingHorizontal: space[3] }}>
          <T v="caption" tone="muted">
            From the admin
          </T>
          <T v="small">{r.adminNote}</T>
        </View>
      ) : null}
      {r.status === "pending" ? (
        <View style={{ alignItems: "flex-start" }}>
          <Button kind="text" label="Cancel request" onPress={onCancel} testID={`req-${r.id}-cancel`} />
        </View>
      ) : null}
    </View>
  );
}

function LeaveSkeleton() {
  return (
    <View style={{ gap: space[4] }}>
      <Skeleton h={128} r={26} />
      <Skeleton h={52} r={26} />
      <Skeleton h={160} r={26} />
    </View>
  );
}

/**
 * Leave: how many are left drawn as a ring, ask for leave (sessions) or to
 * leave one session early, and my requests with where each one stands.
 * Asking opens a sheet; sending says so and the list updates. No companion:
 * leave decisions are never decorated.
 */
export function LeaveScreen() {
  const q = useLeave();
  const qc = useQueryClient();
  const c = useTheme();
  const [sheet, setSheet] = React.useState<"ask" | "early" | null>(null);
  const today = todayIST();
  const refresh = () => void qc.invalidateQueries({ queryKey: clinicKeys.all });
  const done = () => {
    setSheet(null);
    refresh();
  };
  const cancel = async (id: string) => {
    try {
      await clinicCalls.cancelLeave(id);
      haptic.success();
      toast.show("Request cancelled");
      refresh();
    } catch (e) {
      haptic.warn();
      toast.show(messageOf(e));
    }
  };
  const p0 = q.data;
  const field = p0 ? <FieldCard title={p0.pending ? `${p0.pending} ${p0.pending === 1 ? "request is" : "requests are"} waiting` : "Nothing waiting"} meta={p0.pending ? "You get a notification when the admin decides." : "Ask below when you need a day off."} live={p0.pending > 0} /> : null;
  return (
    <AreaProvider area="home">
      <OwnHeader />
      <Screen area="home" safeTop top={<BackBar home="/home" />} title="Leave" field={field} testID="clinic-leave" onRefresh={() => void q.refetch()} refreshing={q.isRefetching}>
        <ClinicLoaded q={q} what="your leave" skeleton={<LeaveSkeleton />}>
          {(p) => (
            <View style={{ gap: space[5] }}>
              <Stone pad={space[5]}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: space[5] }}>
                  <ProgressRing pct={p.allowance ? Math.max(0, Math.min(100, Math.round((p.left / p.allowance) * 100))) : 0} size={96} stroke={9} color={p.left > 0 ? (c.dark ? c.lime : c.brand) : c.danger} track={c.dark ? c.fieldTint : c.hairline} label={`${p.left} of ${p.allowance} leaves left`}>
                    <RollingNumber v="h1" value={Math.max(0, p.left)} />
                  </ProgressRing>
                  <View style={{ flex: 1, minWidth: 0, gap: space[1] }}>
                    <T v="h3">Leaves left</T>
                    <T v="small" tone="muted" num>
                      {p.used} used of {p.allowance}
                      {p.pending ? `, ${p.pending} waiting` : ""}
                    </T>
                    {p.left <= 0 ? (
                      <T v="small" tone="alert" testID="leave-left-line">
                        No leaves left. You can still ask; the admin decides.
                      </T>
                    ) : (
                      <T v="small" tone="muted">
                        Each session you miss uses one. Leaving early uses none.
                      </T>
                    )}
                  </View>
                </View>
              </Stone>
              <View style={{ gap: space[3] }}>
                <Button label="Ask for leave" onPress={() => setSheet("ask")} testID="leave-ask" />
                <Button kind="quiet" label="Leave early" onPress={() => setSheet("early")} testID="leave-early" />
              </View>
              <View style={{ gap: space[2] }}>
                <Label>My requests</Label>
                {p.requests.length ? (
                  <StoneList>
                    {p.requests.map((r) => (
                      <RequestRow key={r.id} r={r} today={today} onCancel={() => void cancel(r.id)} />
                    ))}
                  </StoneList>
                ) : (
                  <QuietEmpty title="No requests yet" body="What you ask for shows here, with the admin's answer." />
                )}
              </View>
              <AskSheet open={sheet === "ask"} onClose={() => setSheet(null)} page={p} onDone={done} />
              <EarlySheet open={sheet === "early"} onClose={() => setSheet(null)} page={p} onDone={done} />
            </View>
          )}
        </ClinicLoaded>
      </Screen>
    </AreaProvider>
  );
}
