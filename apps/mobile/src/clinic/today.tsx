import { ChevronRight, ClipboardPen, Hospital, Megaphone, QrCode } from "lucide-react-native";
import * as React from "react";
import { Pressable, View } from "react-native";

import { go } from "@/api/prefetch";
import { Button, IconDot, Label, Stone, T } from "@/ds";
import { Enter } from "@/motion";
import { space, useTheme } from "@/theme";
import { useClinicToday } from "./api";
import type { ClinicToday } from "./contract";
import { opdLine } from "./logic";
import { openLink } from "./parts";
import { SessionLine2, StoneList } from "./ui";

/** A small text link in a group heading ("Week"), 44px tall. */
export function HeadLink({ label, onPress, testID }: { label: string; onPress: () => void; testID?: string }) {
  return (
    <Pressable
      testID={testID}
      accessibilityRole="link"
      accessibilityLabel={label}
      onPress={() => {
        onPress();
      }}
      hitSlop={6}
      style={{ minHeight: 44, minWidth: 44, justifyContent: "center", alignItems: "flex-end" }}
    >
      <T v="small" tone="link">
        {label}
      </T>
    </Pressable>
  );
}

/**
 * Today's clinic day as the Today screen shows it, on the layer: my OPD day,
 * the admin's note, today's sessions in one stone (the start time leads),
 * case logs that are waiting, and a quiet way to the scanner. Every part
 * opens something. No companion here. Exported for tests and screenshots.
 */
export function TodayBlockView({ d }: { d: ClinicToday }) {
  const c = useTheme();
  const scannable = d.sessions.some((s) => s.mine && (s.mine.state === "open" || s.mine.state === "in"));
  const empty = !d.sessions.length && !d.opd;
  return (
    <View style={{ gap: space[1] }}>
      <Label action={<HeadLink label="Week" onPress={() => go("/clinic/schedule")} testID="today-week" />}>Your day</Label>
      <View testID="clinic-today" style={{ gap: space[3] }}>
        {d.opd ? (
          <Stone testID="today-opd" onPress={() => go("/clinic/opd")} accessibilityLabel={`${opdLine(d.opd)}${d.opd.place ? `, ${d.opd.place}` : ""}. Opens OPD cases`}>
            <View style={{ flexDirection: "row", gap: space[3], alignItems: "center" }}>
              <IconDot icon={Hospital} />
              <View style={{ flex: 1, minWidth: 0 }}>
                <T v="bodyStrong">{opdLine(d.opd)}</T>
                {d.opd.place ? (
                  <T v="small" tone="muted">
                    {d.opd.place}
                  </T>
                ) : null}
              </View>
              <ChevronRight size={18} color={c.muted} />
            </View>
          </Stone>
        ) : null}
        {d.note ? (
          <View testID="today-note" style={{ flexDirection: "row", gap: space[3], alignItems: "flex-start", backgroundColor: c.card, borderRadius: 18, borderTopLeftRadius: 6, paddingVertical: space[3], paddingHorizontal: space[4] }}>
            <Megaphone size={18} color={c.muted} style={{ marginTop: 3 }} />
            <View style={{ flex: 1, minWidth: 0 }}>
              <T v="caption" tone="muted">
                From the admin
              </T>
              <T>{d.note}</T>
            </View>
          </View>
        ) : null}
        {d.sessions.length ? (
          <StoneList>
            {d.sessions.map((s) => (
              <SessionLine2 key={s.id} s={s} testID={`today-s-${s.id}`} onPress={s.link && s.status !== "cancelled" ? () => openLink(s.link!) : () => go("/clinic/schedule")} />
            ))}
          </StoneList>
        ) : empty ? (
          <Stone quiet onPress={() => go("/clinic/schedule")} accessibilityLabel="Nothing on your timetable today. Opens the week">
            <T v="small" tone="muted" testID="today-empty">
              Nothing on your timetable today.
            </T>
          </Stone>
        ) : null}
        {d.logsDue ? (
          <Stone testID="today-to-log" onPress={() => go("/clinic/opd")} style={{ borderRadius: 26 }} accessibilityLabel={d.logsDue === 1 ? "Log your cases for your last OPD visit" : `Log your cases for ${d.logsDue} OPD visits`}>
            <View style={{ flexDirection: "row", gap: space[3], alignItems: "center" }}>
              <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: c.warnBg, alignItems: "center", justifyContent: "center" }}>
                <ClipboardPen size={18} color={c.warnFg} />
              </View>
              <T v="bodyStrong" style={{ flex: 1 }}>
                {d.logsDue === 1 ? "Log your cases for your last OPD visit" : `Log your cases for ${d.logsDue} OPD visits`}
              </T>
              <ChevronRight size={18} color={c.muted} />
            </View>
          </Stone>
        ) : null}
        {scannable || d.opd ? <Button kind="quiet" label="Scan attendance" icon={<QrCode size={20} color={c.ink} />} onPress={() => go("/clinic/scan")} testID="today-scan" /> : null}
      </View>
    </View>
  );
}

/**
 * Home's schedule block. Quiet when the server has no schedule yet (an
 * older server answers 404) or the call fails: Home never breaks for it.
 */
export function TodayBlock() {
  const q = useClinicToday();
  if (!q.data) return null;
  return (
    <Enter i={2}>
      <TodayBlockView d={q.data} />
    </Enter>
  );
}
