import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { CircleAlert, Clock, WifiOff } from "lucide-react-native";
import * as React from "react";
import { ScrollView, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { netStore } from "@/api/online";
import { BackBar, OwnHeader, BlueField, Button, Field, Layer, OfflineLine, T } from "@/ds";
import { useKeyboardPad } from "@/ds/keyboard-pad";
import { haptic } from "@/lib/haptics";
import { Swap } from "@/motion";
import { AreaProvider, fonts, layout, space, useLightStatusBar, useTheme } from "@/theme";
import { clinicCalls, clinicKeys } from "../api";
import type { MarkResult, ScanStep } from "../contract";
import { cleanCode, clockOf, dateLabel, hoursLine, isCode, isUnsent, newAttemptId, rangeLabel, scanBody, scanError, scanStateLine } from "../logic";
import { CodeScanner } from "../scanner";
import { ChoicePair, dirColors, FloodAction, HoldToMark, MarkFlood, type Dir } from "../ui";

type Step = { step: ScanStep; /** When the ticket runs out, on this phone's clock. */ deadline: number; /** When the code was read ("9:54 am"). */ readAt: string };
type Chosen = Step & { direction: Dir; /** One confirm: sent again unchanged on Try again, so it can never save twice. */ attemptId: string };
type Phase =
  | { k: "scan" }
  | { k: "checking" }
  | ({ k: "choose"; direction: Dir | null; attemptId: string; sending: boolean } & Step)
  | ({ k: "unsent" } & Chosen)
  | { k: "done"; r: MarkResult; when: string }
  | { k: "failed"; title: string; body: string };

const WORD: Record<Dir, string> = { in: "IN", out: "OUT" };
const TOO_LONG = { title: "That took too long", body: "Scan the code again." };

const sessionWhen = (s: ScanStep["session"]) => [dateLabel(s.date), rangeLabel(s.start, s.end), s.place].filter(Boolean).join(", ");

/** The lines of a result, shared by the flood (a new mark) and the quiet result (already marked). */
function doneLabel(r: MarkResult): string {
  const word = WORD[r.direction];
  return `${r.already ? "Already marked" : "Marked"} ${word} at ${clockOf(r.at)}. ${r.session.title}.${r.already ? " Nothing was changed." : ""}${r.late && r.direction === "in" ? " Marked late." : ""}`;
}

function DoneLines({ r, color }: { r: MarkResult; color?: string }) {
  const c = useTheme();
  const tint = color ? { color } : null;
  const soft = color ? { color, opacity: 0.85 } : null;
  return (
    <>
      <T v="bodyStrong" center style={tint} testID="scan-done-title">
        {r.already ? "Already marked" : "Marked"} {WORD[r.direction]} at {clockOf(r.at)}
      </T>
      <T v="small" center tone={color ? undefined : "muted"} style={soft}>
        {r.session.title}
      </T>
      {r.already ? (
        <T center v="small" tone={color ? undefined : "muted"} style={soft} testID="scan-already">
          Nothing was changed.
        </T>
      ) : null}
      {r.late && r.direction === "in" ? (
        <T center v="small" style={color ? { color, fontFamily: fonts.bold } : { color: c.warnFg, fontFamily: fonts.bold }} testID="scan-late">
          Marked late
        </T>
      ) : null}
      {r.direction === "out" && r.minutes !== null ? (
        <T center v="small" num tone={color ? undefined : "muted"} style={soft}>
          {hoursLine(r.minutes)} today
        </T>
      ) : null}
      {r.direction === "in" && !r.already ? (
        <T center v="small" style={soft}>
          Scan again when you leave to mark OUT.
        </T>
      ) : null}
    </>
  );
}

/** A scan repeated: nothing changed, so no flood. The word, when it was marked, and one line. */
function Already({ r }: { r: MarkResult }) {
  const c = useTheme();
  return (
    <View testID="scan-done" accessible accessibilityLiveRegion="polite" accessibilityLabel={doneLabel(r)} style={{ alignItems: "center", gap: space[2], paddingVertical: space[6] }}>
      <View style={{ width: 132, height: 132, backgroundColor: c.card, alignItems: "center", justifyContent: "center", gap: 2, borderTopLeftRadius: 60, borderTopRightRadius: 68, borderBottomRightRadius: 62, borderBottomLeftRadius: 66, marginBottom: space[3] }}>
        <Clock size={22} color={c.muted} />
        <T maxFontSizeMultiplier={1.15} style={{ fontFamily: fonts.big, fontSize: 46, lineHeight: 48, letterSpacing: -1.2 }} testID="scan-direction">
          {WORD[r.direction]}
        </T>
      </View>
      <DoneLines r={r} />
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
 *   choose   the session on the field; on the layer the two big pebbles, IN and OUT.
 *            The one that makes no sense now is grey with its reason.
 *   hold     press and hold for one second; the colour floods from under the thumb
 *            (one tap with Reduce Motion or a screen reader)
 *   done     the colour covers the layer: the word and the time recorded.
 *            A repeated scan says "Already marked IN at 9:02" and floods nothing.
 *   failed   the reason and what to do
 * Reading a code only looks the session up. Nothing is chosen for the
 * student and nothing is saved before the hold, which sends once. A mark that
 * does not reach the server is never kept for later: the screen says so and
 * offers Try again. The phone buzzes only for the result. No companion here.
 */
export function ScanScreen() {
  const qc = useQueryClient();
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const size = Math.min(300, width - layout.gutter * 2);
  const [phase, setPhase] = React.useState<Phase>({ k: "scan" });
  const [typed, setTyped] = React.useState("");
  const [fieldError, setFieldError] = React.useState<string | null>(null);
  /** Where the thumb was when the hold finished: the result floods from there. */
  const [from, setFrom] = React.useState<{ x: number; y: number } | null>(null);
  /** True from a press until its answer: a second press in between does nothing. */
  const lock = React.useRef(false);
  const checking = phase.k === "checking";
  const { ref: root, pad: kb, onLayout: kbLayout } = useKeyboardPad();
  useLightStatusBar(true);

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
        setPhase({ k: "choose", step, deadline: Date.now() + step.ticketMs, readAt: clockOf(new Date().toISOString()), direction: null, attemptId: "", sending: false });
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

  /** Picking a pebble saves nothing. Each pick is a new attempt; tapping the picked one again lets go of it. */
  const choose = (s: Phase & { k: "choose" }, direction: Dir | null) => {
    if (s.sending) return;
    if (direction && !s.step[direction].allowed) return;
    if (Date.now() > s.deadline) return refuse(TOO_LONG);
    setPhase({ ...s, direction, attemptId: direction ? newAttemptId() : "" });
  };

  const send = async (ch: Chosen, at: { x: number; y: number } | null) => {
    if (lock.current) return;
    if (Date.now() > ch.deadline) return refuse(TOO_LONG);
    const { step, deadline, readAt, direction, attemptId } = ch;
    const notSent = () => {
      haptic.warn();
      setPhase({ k: "unsent", step, deadline, readAt, direction, attemptId });
    };
    if (netStore.get().offline) return notSent();
    lock.current = true;
    setFrom(at);
    setPhase({ k: "choose", step, deadline, readAt, direction, attemptId, sending: true });
    try {
      const r = await clinicCalls.confirmMark({ ticket: step.ticket, direction, attemptId });
      // The result and its buzz land together. A repeat changes nothing, so it gets no success buzz.
      if (r.already) haptic.select();
      else haptic.success();
      setPhase({ k: "done", r, when: sessionWhen(step.session) });
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
  const flooded = phase.k === "done" && !phase.r.already;

  // On the field: where you are. The session's name once a code has been read.
  const head =
    phase.k === "choose" || phase.k === "unsent" ? { title: phase.step.session.title, lead: `${sessionWhen(phase.step.session)} · code read ${phase.readAt}` } : phase.k === "done" ? { title: phase.r.session.title, lead: phase.when } : { title: "Scan attendance", lead: phase.k === "failed" ? "" : "Point the camera at the code on the admin's screen." };

  let footer: React.ReactNode = null;
  if (phase.k === "done") footer = flooded ? null : <Button kind="ink" tall label="Done" onPress={close} testID="scan-close" />;
  else if (phase.k === "failed") footer = <Button tall label="Scan again" onPress={again} testID="scan-retry" />;
  else if (phase.k === "choose") footer = <Button kind="text" label="Cancel" disabled={phase.sending} onPress={again} testID="scan-cancel" />;
  else if (phase.k === "unsent")
    footer = (
      <View style={{ gap: space[3] }}>
        <Button tall label="Try again" busy={false} onPress={() => void send(phase, from)} testID="scan-send-again" />
        <Button tall kind="quiet" label="Scan again" onPress={again} testID="scan-retry" />
      </View>
    );
  else footer = <Button tall label={checking ? "Checking" : "Check the code"} busy={checking} disabled={!isCode(cleanCode(typed))} onPress={submitTyped} testID="scan-send" />;

  return (
    <AreaProvider area="home">
      <OwnHeader />
      <View ref={root} onLayout={kbLayout} testID="clinic-scan" style={{ flex: 1, backgroundColor: c.field, paddingTop: insets.top, paddingBottom: kb }}>
        <BackBar home="/home" />
        <OfflineLine />
        <BlueField safeTop={false} style={{ paddingTop: space[2], gap: space[1] }}>
          <T v={head.title.length > 22 ? "h1" : "display"} tone="onField" accessibilityRole="header" testID={phase.k === "choose" ? "scan-session" : "scan-title"}>
            {head.title}
          </T>
          {head.lead ? (
            <T v="small" tone="onFieldMuted" num testID={phase.k === "choose" ? "scan-when" : undefined}>
              {head.lead}
            </T>
          ) : null}
        </BlueField>
        <Layer style={{ paddingTop: 0, paddingHorizontal: 0, gap: 0 }}>
          {/* The layer clips what floods inside it to its own round corners. */}
          <View style={{ flex: 1, overflow: "hidden", borderTopLeftRadius: layout.radiusLayer, borderTopRightRadius: layout.radiusLayer }}>
            <ScrollView keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingTop: space[5], paddingBottom: space[5], paddingLeft: Math.max(layout.gutter, insets.left), paddingRight: Math.max(layout.gutter, insets.right) }}>
              <View style={{ width: "100%", maxWidth: layout.readingWidth, alignSelf: "center" }}>
                <Swap k={view}>
                  {phase.k === "done" ? (
                    phase.r.already ? (
                      <Already r={phase.r} />
                    ) : null
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
                  ) : phase.k === "choose" ? (
                    <View testID="scan-choose" accessibilityLiveRegion="polite" style={{ gap: space[4] }}>
                      <View style={{ gap: space[1], paddingHorizontal: space[1] }}>
                        <T v="h2">Arriving or leaving?</T>
                        <T v="small" tone="muted" testID="scan-state">
                          {scanStateLine(phase.step)}
                        </T>
                      </View>
                      {/* IN is always on the left and OUT on the right. Neither is chosen for the student. */}
                      <ChoicePair value={phase.direction} onChange={(d) => choose(phase, d)} options={{ in: phase.step.in, out: phase.step.out }} locked={phase.sending} />
                      {phase.direction ? (
                        <T v="bodyStrong" center testID="scan-confirm-title">
                          You are marking {WORD[phase.direction]} for {phase.step.session.title}
                        </T>
                      ) : null}
                      {phase.step.in.allowed || phase.step.out.allowed ? (
                        <HoldToMark dir={phase.direction} busy={phase.sending} onConfirm={(at) => (phase.direction ? void send({ ...phase, direction: phase.direction }, at) : undefined)} />
                      ) : null}
                    </View>
                  ) : (
                    <View style={{ gap: space[5] }}>
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
              </View>
            </ScrollView>
            {footer ? (
              <View style={{ paddingTop: space[3], paddingBottom: (kb ? 0 : insets.bottom) + space[3], paddingLeft: Math.max(layout.gutter, insets.left), paddingRight: Math.max(layout.gutter, insets.right) }}>
                <View style={{ width: "100%", maxWidth: layout.readingWidth, alignSelf: "center" }}>{footer}</View>
              </View>
            ) : null}
            {phase.k === "done" && flooded ? (
              <MarkFlood dir={phase.r.direction} from={from} accessibilityLabel={doneLabel(phase.r)}>
                <T v="display" center style={{ color: dirColors(c, phase.r.direction).fg }}>
                  You are{" "}
                  <T v="display" style={{ color: dirColors(c, phase.r.direction).fg }} testID="scan-direction">
                    {WORD[phase.r.direction]}
                  </T>
                </T>
                <DoneLines r={phase.r} color={dirColors(c, phase.r.direction).fg} />
                <FloodAction label="Done" onPress={close} color={dirColors(c, phase.r.direction).fg} testID="scan-close" />
              </MarkFlood>
            ) : null}
          </View>
        </Layer>
      </View>
    </AreaProvider>
  );
}
