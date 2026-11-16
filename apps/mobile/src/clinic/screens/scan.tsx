import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { CircleAlert, LogIn, LogOut } from "lucide-react-native";
import * as React from "react";
import { useWindowDimensions, View } from "react-native";

import { Button, Field, Screen, T } from "@/ds";
import { haptic } from "@/lib/haptics";
import { Burst, Stamp, Swap, useCelebrate } from "@/motion";
import { AreaProvider, space, useAccent, useTheme } from "@/theme";
import { clinicCalls, clinicKeys } from "../api";
import type { ScanResult } from "../contract";
import { cleanCode, clockOf, hoursLine, isCode, scanBody, scanError } from "../logic";
import { CodeScanner } from "../scanner";

type Phase = { k: "scan" } | { k: "busy" } | { k: "ok"; r: ScanResult } | { k: "err"; title: string; body: string };

/** The big IN or OUT, stamped in, with sparks from behind it. */
function Done({ r, fire }: { r: ScanResult; fire: number }) {
  const a = useAccent();
  const c = useTheme();
  const Icon = r.direction === "in" ? LogIn : LogOut;
  const word = r.direction === "in" ? "IN" : "OUT";
  return (
    <View testID="scan-done" accessibilityLiveRegion="polite" accessible accessibilityLabel={`Scanned ${r.direction} at ${clockOf(r.at)}. ${r.session.title}.${r.late ? " Marked late." : ""}`} style={{ alignItems: "center", gap: space[4], paddingVertical: space[5] }}>
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Stamp fire={fire} rotate={-4}>
          <View style={{ width: 132, height: 132, borderRadius: 66, backgroundColor: a.deep, alignItems: "center", justifyContent: "center", gap: 2 }}>
            <Icon size={28} color={a.onDeep} />
            <T v="display" style={{ color: a.onDeep }} testID="scan-direction">
              {word}
            </T>
          </View>
        </Stamp>
        <Burst fire={fire} reach={84} count={12} />
      </View>
      <View style={{ alignItems: "center", gap: space[1] }}>
        <T v="h2" num center testID="scan-time">
          {clockOf(r.at)}
        </T>
        <T center v="bodyStrong">
          {r.session.title}
        </T>
        {r.late ? (
          <T center v="small" style={{ color: c.warnFg }} testID="scan-late">
            Marked late
          </T>
        ) : null}
        {r.direction === "out" && r.minutes !== null ? (
          <T center v="small" tone="muted" num>
            {hoursLine(r.minutes)} today
          </T>
        ) : null}
        <T center v="small" tone="muted">
          {r.direction === "in" ? "Scan again when you leave." : "See you next time."}
        </T>
      </View>
    </View>
  );
}

/**
 * Scan attendance: the camera reads the code on the admin's screen (or the
 * student types the 6 letters under it). A clear IN or OUT with the time,
 * a success haptic and sparks; a refusal in plain words with what to do.
 */
export function ScanScreen() {
  const qc = useQueryClient();
  const { width } = useWindowDimensions();
  const size = Math.min(320, width - 40);
  const [phase, setPhase] = React.useState<Phase>({ k: "scan" });
  const [typed, setTyped] = React.useState("");
  const [fieldError, setFieldError] = React.useState<string | null>(null);
  const [fire, setFire] = React.useState(0);
  const celebrate = useCelebrate();
  const busy = phase.k === "busy";

  const send = React.useCallback(
    async (body: { token?: string; code?: string }) => {
      setPhase({ k: "busy" });
      try {
        const r = await clinicCalls.scan(body);
        celebrate({ win: true, result: () => setPhase({ k: "ok", r }), particles: () => setFire((n) => n + 1) });
        setTyped("");
        void qc.invalidateQueries({ queryKey: clinicKeys.all });
      } catch (e) {
        haptic.warn();
        setPhase({ k: "err", ...scanError(e) });
      }
    },
    [celebrate, qc],
  );

  const onRead = React.useCallback(
    (text: string) => {
      const b = scanBody(text);
      if (!b) {
        haptic.warn();
        setPhase({ k: "err", title: "That is not an attendance code", body: "Scan the code on the admin's screen, or type the 6 letters under it." });
        return;
      }
      void send(b);
    },
    [send],
  );

  const submitTyped = () => {
    const b = scanBody(typed, true);
    if (!b) return setFieldError("Type the 6 letters and numbers under the code.");
    setFieldError(null);
    void send(b);
  };

  const view = phase.k === "ok" ? "ok" : phase.k === "err" ? "err" : "scan";
  return (
    <AreaProvider area="home">
      <Screen
        testID="clinic-scan"
        footer={
          view === "ok" ? (
            <Button label="Done" onPress={() => (router.canGoBack() ? router.back() : router.replace("/home"))} testID="scan-close" />
          ) :view === "err" ? (
            <Button label="Scan again" onPress={() => setPhase({ k: "scan" })} testID="scan-retry" />
          ) : (
            <Button label={busy ? "Checking" : "Check in with the code"} busy={busy} disabled={!isCode(cleanCode(typed))} needsServer onPress={submitTyped} testID="scan-send" />
          )
        }
      >
        <Swap k={view}>
          {phase.k === "ok" ? (
            <Done r={phase.r} fire={fire} />
          ) : phase.k === "err" ? (
            <View testID="scan-error" accessibilityRole="alert" style={{ alignItems: "center", gap: space[3], paddingVertical: space[6] }}>
              <ErrorMark />
              <T v="h2" center testID="scan-error-title">
                {phase.title}
              </T>
              <T center tone="muted">
                {phase.body}
              </T>
            </View>
          ) : (
            <View style={{ gap: space[5] }}>
              <View style={{ gap: space[1] }}>
                <T v="h1">Scan attendance</T>
                <T tone="muted">Point the camera at the code on the admin's screen. Scan when you arrive and again when you leave.</T>
              </View>
              <CodeScanner onRead={onRead} paused={busy} size={size} />
              <Field
                label="Or type the code"
                hint="The 6 letters and numbers under the picture"
                value={typed}
                onChangeText={(t) => {
                  setTyped(cleanCode(t));
                  setFieldError(null);
                }}
                autoCapitalize="characters"
                autoCorrect={false}
                autoComplete="off"
                maxLength={7}
                returnKeyType="send"
                onSubmitEditing={submitTyped}
                error={fieldError}
                testID="scan-code"
              />
            </View>
          )}
        </Swap>
      </Screen>
    </AreaProvider>
  );
}

function ErrorMark() {
  const c = useTheme();
  return (
    <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: c.alertBg, alignItems: "center", justifyContent: "center" }}>
      <CircleAlert size={36} color={c.alertFg} />
    </View>
  );
}
