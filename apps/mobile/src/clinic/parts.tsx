import { CalendarClock, Hospital, MonitorPlay, Sunrise, Users } from "lucide-react-native";
import * as React from "react";
import { Pressable, View } from "react-native";

import { Status } from "@/admin/kit";
import type { Tone } from "@/admin/format";
import { T } from "@/ds";
import { openLink as open } from "@/lib/open";
import { layout, space, useAccent, useTheme } from "@/theme";
import type { AttendState, ClinicSession, LeaveStatus, OpdVisitStatus, RosterState, SessionKind } from "./contract";
import { clockOf, isOpd, LEAVE_WORD, rangeLabel, ROSTER_WORD, sessionTitle, stateWord, timeLabel, VISIT_WORD } from "./logic";

export const KIND_ICON: Record<SessionKind, typeof Users> = { opd_morning: Hospital, opd_evening: Hospital, class: Users, online_class: MonitorPlay, early_class: Sunrise, other: CalendarClock };

export const STATE_TONE: Record<AttendState, Tone> = { upcoming: "quiet", open: "info", in: "ok", done: "ok", left_early: "ok", no_out: "warn", missed: "alert", leave: "quiet", cancelled: "quiet" };
export const ROSTER_TONE: Record<RosterState, Tone> = { in: "ok", out: "quiet", missing: "alert", leave: "quiet", no_out: "warn", left_early: "quiet" };
export const LEAVE_TONE: Record<LeaveStatus, Tone> = { pending: "info", approved: "ok", rejected: "alert", cancelled: "quiet" };
export const VISIT_TONE: Record<OpdVisitStatus, Tone> = { upcoming: "quiet", today: "info", to_log: "warn", logged: "ok", absent: "alert", leave: "quiet" };

export const StateWord = ({ s, late }: { s: AttendState; late?: boolean }) => <Status tone={STATE_TONE[s]}>{stateWord(s, late)}</Status>;
export const RosterWord = ({ s }: { s: RosterState }) => <Status tone={ROSTER_TONE[s]}>{ROSTER_WORD[s]}</Status>;
export const LeaveWord = ({ s, testID }: { s: LeaveStatus; testID?: string }) => <Status tone={LEAVE_TONE[s]} testID={testID}>{LEAVE_WORD[s]}</Status>;
export const VisitWord = ({ s }: { s: OpdVisitStatus }) => <Status tone={VISIT_TONE[s]}>{VISIT_WORD[s]}</Status>;

/** Opens an online class link; a bad link says so instead of failing quietly. */
export function openLink(url: string) {
  void open(url);
}

/**
 * One session on a timetable: the start time in a narrow column, the title,
 * time and place under it, and on the right the student's state (or any
 * trailing part). A cancelled session is struck through with the reason.
 * The whole row is one target (44px or more) when it can be pressed.
 */
export function SessionLine({ s, trailing, onPress, testID, hideState }: { s: ClinicSession; trailing?: React.ReactNode; onPress?: () => void; testID?: string; hideState?: boolean }) {
  const c = useTheme();
  const a = useAccent();
  const Icon = KIND_ICON[s.kind] ?? CalendarClock;
  const cancelled = s.status === "cancelled";
  const where = s.place || (s.link || s.kind === "online_class" ? "Online" : "");
  const meta = `${rangeLabel(s.start, s.end)}${where ? ` · ${where}` : ""}`;
  const right = trailing ?? (!hideState && s.mine ? <StateWord s={s.mine.state} late={s.mine.late} /> : null);
  const label = `${sessionTitle(s)}, ${meta}${cancelled ? ", cancelled" : ""}${s.mine ? `, ${stateWord(s.mine.state, s.mine.late)}` : ""}`;
  const body = (
    <View style={{ flexDirection: "row", gap: space[3], alignItems: "flex-start", paddingVertical: space[3], minHeight: layout.row }}>
      <View style={{ width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center", backgroundColor: a.on ? a.wash : c.tint }}>
        <Icon size={18} color={a.on ? a.deep : c.muted} />
      </View>
      <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
        <T v="bodyStrong" style={cancelled ? { textDecorationLine: "line-through", color: c.muted } : undefined}>
          {sessionTitle(s)}
        </T>
        <T v="small" tone="muted" num>
          {meta}
        </T>
        {s.mine?.inAt ? (
          <T v="small" tone="muted" num>
            In {clockOf(s.mine.inAt)}
            {s.mine.outAt ? ` · Out ${clockOf(s.mine.outAt)}` : ""}
          </T>
        ) : null}
        {s.mine?.leaveAt ? (
          <T v="small" tone="muted" num>
            Leaving early at {timeLabel(s.mine.leaveAt)}
          </T>
        ) : null}
        {s.note ? (
          <T v="small" tone={cancelled || s.status === "moved" ? "alert" : "muted"}>
            {cancelled ? "Cancelled. " : s.status === "moved" ? "Moved. " : ""}
            {s.note}
          </T>
        ) : cancelled ? (
          <T v="small" tone="alert">
            Cancelled
          </T>
        ) : null}
      </View>
      {right ? <View style={{ paddingTop: 2, maxWidth: "38%" }}>{right}</View> : null}
    </View>
  );
  if (!onPress)
    return (
      <View testID={testID} accessible accessibilityLabel={label}>
        {body}
      </View>
    );
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={() => {
        onPress();
      }}
      style={({ pressed }) => ({ backgroundColor: pressed ? c.tint : "transparent", marginHorizontal: -space[2], paddingHorizontal: space[2], borderRadius: 10 })}
    >
      {body}
    </Pressable>
  );
}

/** A list of sessions split by hairlines. */
export function SessionList({ children }: { children: React.ReactNode }) {
  const c = useTheme();
  const items = React.Children.toArray(children).filter(Boolean);
  return (
    <View style={{ borderTopWidth: 1, borderBottomWidth: 1, borderColor: c.hairline }}>
      {items.map((ch, i) => (
        <View key={i} style={i ? { borderTopWidth: 1, borderColor: c.hairline } : undefined}>
          {ch}
        </View>
      ))}
    </View>
  );
}

/** A soft panel in the area's wash: today's OPD line, the admin's note. */
export function Band({ children, tone = "area", testID }: { children: React.ReactNode; tone?: "area" | "warn" | "plain"; testID?: string }) {
  const c = useTheme();
  const a = useAccent();
  const bg = tone === "warn" ? c.warnBg : tone === "plain" ? c.tint : a.on ? a.wash : c.tint;
  return (
    <View testID={testID} style={{ backgroundColor: bg, borderRadius: 14, paddingVertical: space[3], paddingHorizontal: space[4], gap: space[1] }}>
      {children}
    </View>
  );
}

/** "OPD" for OPD kinds, else the title: the short word a calendar cell shows. */
export const shortTitle = (s: Pick<ClinicSession, "kind" | "title">) => (isOpd(s.kind) ? "OPD" : sessionTitle(s));
