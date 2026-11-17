import { router } from "expo-router";
import { FlaskConical, RotateCcw, UserRound } from "lucide-react-native";
import * as React from "react";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { TestModeResetResult, TestModeState } from "@/api/contract";
import { messageOf } from "@/api/errors";
import { api, session, useSession } from "@/auth";
import { Row, RowList, Section, SwitchRow, T } from "@/ds";
import { toast } from "@/ds/toast";
import { haptic } from "@/lib/haptics";
import { layout, space, useTheme } from "@/theme";
import { ConfirmSheet } from "./kit";

/**
 * Test mode: the admin uses the student side as their own hidden test
 * student (lessons, practise, clinic, doubts...). Nothing they do there, and
 * nothing they send while test mode is on, reaches real students: the server
 * keeps it to the test student. The phone keeps the admin's own sign-in to
 * come back with one tap.
 */

export type TestModeSide = "admin" | "student" | null;

/** Which side of test mode this phone is on right now. */
export function useTestMode(): TestModeSide {
  const as = useSession((s) => s.me?.testMode?.as ?? null);
  return as === "admin" || as === "student" ? as : null;
}

export const testModeCalls = {
  set: (on: boolean) => api.put<TestModeState>("/test-mode", { on }),
  reset: () => api.post<TestModeResetResult>("/test-mode/reset"),
};

let busy = false;

/** Switch test mode on or off from the admin side. */
export async function setTestMode(on: boolean): Promise<void> {
  if (busy) return;
  busy = true;
  try {
    await testModeCalls.set(on);
    await session.refreshMe();
    toast.show(on ? "Test mode is on" : "Test mode is off");
  } catch (e) {
    toast.show(messageOf(e));
  } finally {
    busy = false;
  }
}

/** Use the student side as the test student. */
export async function openAsTestStudent(): Promise<void> {
  if (busy) return;
  busy = true;
  try {
    await session.openTestStudent();
    router.replace("/home");
  } catch (e) {
    toast.show(messageOf(e));
  } finally {
    busy = false;
  }
}

/** Back to the admin side (test mode stays on). */
export async function backToAdmin(): Promise<void> {
  if (busy) return;
  busy = true;
  try {
    if (await session.backToAdmin()) router.replace("/admin/home");
  } finally {
    busy = false;
  }
}

/** The bar shown on every screen while test mode is on. One tap goes to the other side. */
export function TestModeBar({ side, lift = 0 }: { side: TestModeSide; lift?: number }) {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  if (!side) return null;
  const student = side === "student";
  const label = student ? "Test mode. Back to admin" : "Test mode. Open as test student";
  return (
    <View pointerEvents="box-none" style={{ position: "absolute", left: 0, right: 0, bottom: insets.bottom + 72 + lift, alignItems: "center", paddingHorizontal: layout.gutter }}>
      <Pressable
        testID="test-mode-bar"
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={() => void (student ? backToAdmin() : openAsTestStudent())}
        style={({ pressed }) => ({ minHeight: layout.target, flexDirection: "row", alignItems: "center", gap: space[2], borderRadius: 24, paddingHorizontal: space[4], backgroundColor: c.warnBg, borderWidth: 2, borderColor: c.warn, opacity: pressed ? 0.85 : 1 })}
      >
        <FlaskConical size={18} color={c.warnFg} />
        <T v="small" style={{ color: c.warnFg, fontWeight: "700" }}>
          Test mode
        </T>
        <T v="small" style={{ color: c.warnFg, textDecorationLine: "underline" }}>
          {student ? "Back to admin" : "Open as test student"}
        </T>
      </Pressable>
    </View>
  );
}

/** The Test mode part of the admin's More screen: the switch, open, and reset. */
export function TestModeSection() {
  const c = useTheme();
  const side = useTestMode();
  const [confirm, setConfirm] = React.useState(false);
  const on = side === "admin";
  const icon = { size: 20, color: c.muted };
  const reset = async () => {
    try {
      await testModeCalls.reset();
      haptic.success();
      toast.show("Test data reset");
    } catch (e) {
      toast.show(messageOf(e));
    }
  };
  return (
    <Section title="Test mode">
      <RowList>
        <SwitchRow title="Test mode" meta="Use the student side as a hidden test student" value={on} onChange={(v) => void setTestMode(v)} testID="test-mode-switch" />
        {on ? (
          <>
            <Row title="Open as test student" icon={<UserRound {...icon} />} onPress={() => void openAsTestStudent()} testID="test-mode-open" />
            <Row title="Reset test data" meta="Wipe the test student's progress and test posts" icon={<RotateCcw {...icon} />} onPress={() => setConfirm(true)} testID="test-mode-reset" />
          </>
        ) : null}
      </RowList>
      <ConfirmSheet open={confirm} onClose={() => setConfirm(false)} title="Reset test data?" body="The test student starts again from nothing. Real students are not touched." confirm="Reset" danger onConfirm={() => void reset()} testID="confirm-test-reset" />
    </Section>
  );
}
