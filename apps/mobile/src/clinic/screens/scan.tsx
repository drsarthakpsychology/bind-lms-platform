import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { CircleAlert, LogIn, LogOut, WifiOff } from "lucide-react-native";
import * as React from "react";
import { Pressable, useWindowDimensions, View } from "react-native";

import { netStore } from "@/api/online";
import { Button, Field, Screen, T } from "@/ds";
import { haptic } from "@/lib/haptics";
import { Burst, Stamp, Swap, useCelebrate } from "@/motion";
import { AreaProvider, layout, space, useAccent, useTheme } from "@/theme";
import { clinicCalls, clinicKeys } from "../api";
import type { MarkResult, ScanStep } from "../contract";
import { cleanCode, clockOf, dateLabel, hoursLine, isCode, isUnsent, newAttemptId, rangeLabel, scanBody, scanError, scanStateLine } from "../logic";
import { CodeScanner } from "../scanner";

type Dir = "in" | "out";
type Step = { step: ScanStep; /** When the ticket runs out, on this phone's clock. */ deadline: number };
type Chosen = Step & { direction: Dir; /** One Confirm press: sent again unchanged on Try again, so it can never save twice. */ attemptId: string };
type Phase =
  | { k: "scan" }
  | { k: "checking" }
  | ({ k: "choose" } & Step)
  | ({ k: "confirm"; sending: boolean } & Chosen)
  | ({ k: "unsent" } & Chosen)
  | { k: "done"; r: MarkResult }
  | { k: "failed"; title: string; body: string };

const WORD: Record<Dir, string> = { in: "IN", out: "OUT" };
const TOO_LONG = { title: "That took too long", body: "Scan the code again." };

const sessionWhen = (s: ScanStep["session"]) => [dateLabel(s.date), rangeLabel(s.start, s.end), s.place].filter(Boolean).join(", ");

/**
 * One of the two big choices. IN and OUT differ by their words, their icon
 * and their place (IN above, OUT below, well apart), not by colour. One that
 * makes no sense now is greyed, cannot be pressed, and says why under it.
 */
function BigChoice({ dir, allowed, reason, onPress }: { dir: Dir; allowed: boolean; reason: string | null; onPress: () => void }) {
  const c = useTheme();
  const Icon = dir === "in" ? LogIn : LogOut;
  const label = `Mark ${WORD[dir]}`;
  return (
    <View style={{ gap: space[2] }}>
      <Pressable
        testID={`scan-choose-${dir}`}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityHint={allowed ? undefined : (reason ?? undefined)}
        accessibilityState={{ disabled: !allowed }}
        disabled={!allowed}
        onPress={onPress}
        style={({ pressed }) => ({
          minHeight: 72,
          flexDirection: "row",
          alignItems: "center",
          gap: space[4],
          paddingHorizontal: space[5],
          paddingVertical: space[4],
          borderRadius: layout.radius,
          borderWidth: 2,
          borderColor: allowed ? c.line : c.cardLine,
          backgroundColor: allowed ? (pressed ? c.tint : c.card) : "transparent",
          opacity: allowed ? 1 : 0.55,
        })}
      >
        <Icon size={30} color={allowed ? c.ink : c.muted} />
        <T v="h2" tone={allowed ? undefined : "muted"}>
          {label}
        </T>
      </Pressable>
      {reason ? (
        <T v="small" tone="muted" testID={`scan-why-${dir}`}>
          {reason}
        </T>
      ) : null}
    </View>
  );
}

/** What was recorded and when, stamped in, with sparks from behind it. */
function Done({ r, fire }: { r: MarkResult; fire: number }) {
  const a = useAccent();
  const c = useTheme();
  const Icon = r.direction === "in" ? LogIn : LogOut;
  const word = WORD[r.direction];
  const head = `${r.already ? "Already marked" : "Marked"} ${word} at ${clockOf(r.at)}`;
  return (
    <View testID="scan-done" accessibilityLiveRegion="polite" accessible accessibilityLabel={`${head}. ${r.session.title}.${r.already ? " Nothing was changed." : ""}${r.late && r.direction === "in" ? " Marked late." : ""}`} style={{ alignItems: "center", gap: space[4], paddingVertical: space[5] }}>
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
        <T v="h2" center testID="scan-done-title">
          {head}
        </T>
        <T center v="bodyStrong">
          {r.session.title}
        </T>
        {r.already ? (
          <T center v="small" tone="muted" testID="scan-already">
            Nothing was changed.
          </T>
        ) : null}
        {r.late && r.direction === "in" ? (
          <T center v="small" style={{ color: c.warnFg }} testID="scan-late">
            Marked late
          </T>
        ) : null}
        {r.direction === "out" && r.minutes !== null ? (
          <T center v="small" tone="muted" num>
            {hoursLine(r.minutes)} today
          </T>
        ) : null}
        {r.direction === "in" && !r.already ? (
          <T center v="small" tone="muted">
            Scan again when you leave to mark OUT.
          </T>
        ) : null}
      </View>
    </View>
  );
}

function Mark({ offline }: { offline?: boolean }) {
  const c = useTheme();
  const Icon = offline ? WifiOff : CircleAlert;
  return (
    <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: c.alertBg, alignItems: "center", justifyContent: "center" }}>
      <Icon size={36} color={c.alertFg} />
    </View>
  );
}

/**
 * Mark attendance, one step at a time:
 *   scan     the camera reads the code on the admin's screen, or the student types the 6 letters
 *   choose   the session, its time and where the student stands; Mark IN above, Mark OUT below
 *   confirm  "You are marking IN for <session>", Confirm or Cancel
 *   done     what was recorded and the time
 *   failed   the reason and what to do
 * Reading a code only looks the session up. Nothing is chosen for the
 * student and nothing is saved before Confirm, which sends once. A mark that
 * does not reach the server is never kept for later: the screen says so and
 * offers Try again. The phone buzzes only for the result.
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
  /** True from a press until its answer: a second press in between does nothing. */
  const lock = React.useRef(false);
  const checking = phase.k === "checking";

  const refuse = React.useCallback((f: { title: string; body: string }) => {
    haptic.warn();
    setPhase({ k: "failed", ...f });
  }, []);

  const lookUp = React.useCallback(
    async (body: { token?: string; code?: string }) => {
      if (lock.current) return;
      lock.current = true;
      setPhase({ k: "checking" });
      try {
        const step = await clinicCalls.identify(body);
        setTyped("");
        setPhase({ k: "choose", step, deadline: Date.now() + step.ticketMs });
      } catch (e) {
        refuse(scanError(e));
      } finally {
        lock.current = false;
      }
    },
    [refuse],
  );

  const onRead = React.useCallback(
    (text: string) => {
      const b = scanBody(text);
      if (!b) return refuse({ title: "That code did not work", body: "That is not an attendance code. Scan the code on the admin's screen, or type the 6 letters under it." });
      void lookUp(b);
    },
    [lookUp, refuse],
  );

  const submitTyped = () => {
    const b = scanBody(typed, true);
    if (!b) return setFieldError("Type the 6 letters and numbers under the code.");
    setFieldError(null);
    void lookUp(b);
  };

  const choose = (s: Step, direction: Dir) => {
    if (!s.step[direction].allowed) return;
    if (Date.now() > s.deadline) return refuse(TOO_LONG);
    setPhase({ k: "confirm", sending: false, step: s.step, deadline: s.deadline, direction, attemptId: newAttemptId() });
  };

  const send = async (c: Chosen) => {
    if (lock.current) return;
    if (Date.now() > c.deadline) return refuse(TOO_LONG);
    const { step, deadline, direction, attemptId } = c;
    const notSent = () => {
      haptic.warn();
      setPhase({ k: "unsent", step, deadline, direction, attemptId });
    };
    if (netStore.get().offline) return notSent();
    lock.current = true;
    setPhase({ k: "confirm", sending: true, step, deadline, direction, attemptId });
    try {
      const r = await clinicCalls.confirmMark({ ticket: step.ticket, direction, attemptId });
      celebrate({ win: true, result: () => setPhase({ k: "done", r }), particles: () => setFire((n) => n + 1) });
      void qc.invalidateQueries({ queryKey: clinicKeys.all });
    } catch (e) {
      if (isUnsent(e)) notSent();
      else refuse(scanError(e));
    } finally {
      lock.current = false;
    }
  };

  const again = () => setPhase({ k: "scan" });
  const close = () => (router.canGoBack() ? router.back() : router.replace("/home"));
  const view = checking ? "scan" : phase.k;

  let footer: React.ReactNode;
  if (phase.k === "done") footer = <Button tall label="Done" onPress={close} testID="scan-close" />;
  else if (phase.k === "failed") footer = <Button tall label="Scan again" onPress={again} testID="scan-retry" />;
  else if (phase.k === "choose") footer = <Button tall kind="quiet" label="Cancel" onPress={again} testID="scan-cancel" />;
  else if (phase.k === "confirm")
    footer = (
      <View style={{ gap: space[5] }}>
        <Button tall label={phase.sending ? "Sending" : `Confirm ${WORD[phase.direction]}`} busy={phase.sending} onPress={() => void send(phase)} testID="scan-confirm" />
        <Button tall kind="quiet" label="Cancel" disabled={phase.sending} onPress={() => setPhase({ k: "choose", step: phase.step, deadline: phase.deadline })} testID="scan-back" />
      </View>
    );
  else if (phase.k === "unsent")
    footer = (
      <View style={{ gap: space[5] }}>
        <Button tall label="Try again" busy={false} onPress={() => void send(phase)} testID="scan-send-again" />
        <Button tall kind="quiet" label="Scan again" onPress={again} testID="scan-retry" />
      </View>
    );
  else footer = <Button tall label={checking ? "Checking" : "Check the code"} busy={checking} disabled={!isCode(cleanCode(typed))} onPress={submitTyped} testID="scan-send" />;

  return (
    <AreaProvider area="home">
      <Screen area="home" testID="clinic-scan" footer={footer}>
        <Swap k={view}>
          {phase.k === "done" ? (
            <Done r={phase.r} fire={fire} />
          ) : phase.k === "failed" ? (
            <View testID="scan-error" accessibilityRole="alert" style={{ alignItems: "center", gap: space[3], paddingVertical: space[6] }}>
              <Mark />
              <T v="h2" center testID="scan-error-title">
                {phase.title}
              </T>
              <T center tone="muted" testID="scan-error-body">
                {phase.body}
              </T>
            </View>
          ) : phase.k === "unsent" ? (
            <View testID="scan-unsent" accessibilityRole="alert" style={{ alignItems: "center", gap: space[3], paddingVertical: space[6] }}>
              <Mark offline />
              <T v="h2" center>
                Not marked yet
              </T>
              <T center tone="muted" testID="scan-unsent-body">
                Your {WORD[phase.direction]} for {phase.step.session.title} did not go through. Check your internet, then try again. It will not be sent later on its own.
              </T>
            </View>
          ) : phase.k === "confirm" ? (
            <View testID="scan-confirm-view" accessibilityLiveRegion="polite" style={{ gap: space[2], paddingVertical: space[5] }}>
              <T v="h1" testID="scan-confirm-title">
                You are marking {WORD[phase.direction]} for {phase.step.session.title}
              </T>
              <T tone="muted">{sessionWhen(phase.step.session)}</T>
            </View>
          ) : phase.k === "choose" ? (
            <View testID="scan-choose" accessibilityLiveRegion="polite" style={{ gap: space[5] }}>
              <View style={{ gap: space[1] }}>
                <T v="h1" testID="scan-session">
                  {phase.step.session.title}
                </T>
                <T tone="muted" testID="scan-when">
                  {sessionWhen(phase.step.session)}
                </T>
              </View>
              <T v="bodyStrong" testID="scan-state">
                {scanStateLine(phase.step)}
              </T>
              {/* IN is always the upper one and OUT the lower one, a full gap apart. Neither is chosen for the student. */}
              <View style={{ gap: space[6] }}>
                <BigChoice dir="in" allowed={phase.step.in.allowed} reason={phase.step.in.reason} onPress={() => choose(phase, "in")} />
                <BigChoice dir="out" allowed={phase.step.out.allowed} reason={phase.step.out.reason} onPress={() => choose(phase, "out")} />
              </View>
            </View>
          ) : (
            <View style={{ gap: space[5] }}>
              <View style={{ gap: space[1] }}>
                <T v="h1">Scan attendance</T>
                <T tone="muted">Point the camera at the code on the admin's screen. Then choose Mark IN or Mark OUT.</T>
              </View>
              <CodeScanner onRead={onRead} paused={checking} size={size} />
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
