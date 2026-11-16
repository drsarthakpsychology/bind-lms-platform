import { router } from "expo-router";
import { ClipboardPen, Hospital, Megaphone, QrCode } from "lucide-react-native";
import * as React from "react";
import { Pressable, View } from "react-native";

import { Button, Section, T } from "@/ds";
import { haptic } from "@/lib/haptics";
import { Enter } from "@/motion";
import { space, useAccent, useTheme } from "@/theme";
import { useClinicToday } from "./api";
import type { ClinicToday } from "./contract";
import { opdLine } from "./logic";
import { Band, openLink, SessionLine, SessionList } from "./parts";

/** A small text link in a section heading ("Week"), 44px tall. */
export function HeadLink({ label, onPress, testID }: { label: string; onPress: () => void; testID?: string }) {
  return (
    <Pressable
      testID={testID}
      accessibilityRole="link"
      onPress={() => {
        haptic.select();
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

/** Today's schedule as Home shows it. Exported for tests and the web screenshots. */
export function TodayBlockView({ d }: { d: ClinicToday }) {
  const c = useTheme();
  const a = useAccent();
  const scannable = d.sessions.some((s) => s.mine && (s.mine.state === "open" || s.mine.state === "in"));
  const empty = !d.sessions.length && !d.opd;
  return (
    <Section title="Your day" action={<HeadLink label="Week" onPress={() => router.push("/clinic/schedule")} testID="today-week" />}>
      <View testID="clinic-today" style={{ gap: space[3] }}>
        {d.opd ? (
          <Band testID="today-opd">
            <View style={{ flexDirection: "row", gap: space[2], alignItems: "center" }}>
              <Hospital size={18} color={a.on ? a.deep : c.ink} />
              <T v="bodyStrong" style={{ flex: 1 }}>
                {opdLine(d.opd)}
              </T>
            </View>
            {d.opd.place ? (
              <T v="small" tone="muted">
                {d.opd.place}
              </T>
            ) : null}
          </Band>
        ) : null}
        {d.note ? (
          <Band tone="plain" testID="today-note">
            <View style={{ flexDirection: "row", gap: space[2], alignItems: "flex-start" }}>
              <Megaphone size={18} color={c.muted} style={{ marginTop: 3 }} />
              <View style={{ flex: 1 }}>
                <T v="caption" tone="muted">
                  From the admin
                </T>
                <T>{d.note}</T>
              </View>
            </View>
          </Band>
        ) : null}
        {d.sessions.length ? (
          <SessionList>
            {d.sessions.map((s) => (
              <SessionLine key={s.id} s={s} testID={`today-s-${s.id}`} onPress={s.link && s.status !== "cancelled" ? () => openLink(s.link!) : () => router.push("/clinic/schedule")} />
            ))}
          </SessionList>
        ) : empty ? (
          <T v="small" tone="muted" testID="today-empty">
            Nothing on your timetable today.
          </T>
        ) : null}
        {d.logsDue ? (
          <Pressable
            testID="today-to-log"
            accessibilityRole="button"
            onPress={() => {
              haptic.select();
              router.push("/clinic/opd");
            }}
          >
            {({ pressed }) => (
              <View style={{ opacity: pressed ? 0.7 : 1 }}>
                <Band tone="warn">
                  <View style={{ flexDirection: "row", gap: space[2], alignItems: "center", minHeight: 28 }}>
                    <ClipboardPen size={18} color={c.warnFg} />
                    <T v="bodyStrong" style={{ flex: 1, color: c.warnFg }}>
                      {d.logsDue === 1 ? "Log your cases for your last OPD visit" : `Log your cases for ${d.logsDue} OPD visits`}
                    </T>
                  </View>
                </Band>
              </View>
            )}
          </Pressable>
        ) : null}
        {scannable || d.opd ? <Button kind="quiet" label="Scan attendance" icon={<QrCode size={20} color={c.ink} />} onPress={() => router.push("/clinic/scan")} testID="today-scan" /> : null}
      </View>
    </Section>
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
