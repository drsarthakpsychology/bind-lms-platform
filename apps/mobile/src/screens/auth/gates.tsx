import { setStatusBarStyle } from "expo-status-bar";
import { CloudDownload, CirclePause, Fingerprint, MessageCircle, ScanFace, Smartphone } from "lucide-react-native";
import * as React from "react";
import { ScrollView, View } from "react-native";
import Animated, { Easing, useReducedMotion, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useConfig } from "@/api/queries";
import { session, useSession } from "@/auth";
import { biometricEnabled, biometricKind, unlockWithBiometric } from "@/auth/biometric";
import { handoff } from "@/auth/handoff";
import { isWeakPin } from "@/auth/pin";
import { PinPad, type PinTone } from "@/auth/PinPad";
import { Button, LAYER_OVERLAP, layerShadow, T, Wordmark } from "@/ds";
import { BRAND } from "@/lib/brand";
import { haptic } from "@/lib/haptics";
import { openLink } from "@/lib/open";
import { dur, Enter, presets, Swap, useMotionTier } from "@/motion";
import { layout, space, useTheme } from "@/theme";

type IconType = React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;

/**
 * The frame of the full-screen moments (PIN, update, paused, first run), in
 * the Layers look: the blue field holds the wordmark and the headline, the
 * soft layer rises over it with what you do now, and the actions sit low.
 * It fades in over the app and, when it goes (the right PIN), it lifts away
 * and fades, so the app appears under it.
 */
export function Gate({ children, footer, testID, title, lead, titleKey, side, top }: { children?: React.ReactNode; footer?: React.ReactNode; testID: string; /** The headline, on the field. */ title: string; /** One quiet line under it. */ lead?: string; /** Changes when the headline changes meaning (it swaps instead of blinking). */ titleKey?: string; /** Sits at the right of the headline (Jyo, where allowed). */ side?: React.ReactNode; /** Sits at the right of the wordmark ("Skip"). */ top?: React.ReactNode }) {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const reduce = useReducedMotion();
  const { low } = useMotionTier();
  // The field is blue in both themes: white clock and battery while a gate is up.
  React.useEffect(() => {
    setStatusBarStyle("light");
    return () => setStatusBarStyle(c.dark ? "light" : "dark");
  }, [c.dark]);
  return (
    <Animated.View testID={testID} accessibilityViewIsModal entering={reduce || low ? presets.fadeState() : GateEnter} exiting={reduce || low ? presets.out() : GateExit} style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: c.field }}>
      <View style={{ paddingTop: insets.top + space[4], paddingHorizontal: layout.gutter, paddingBottom: space[5] + LAYER_OVERLAP, gap: space[5], width: "100%", maxWidth: 460, alignSelf: "center" }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", minHeight: 44 }}>
          <Wordmark onField sub={null} size={24} />
          {top}
        </View>
        <View style={{ flexDirection: "row", alignItems: "flex-end", gap: space[3] }}>
          <View style={{ flex: 1, gap: space[1] }}>
            <Swap k={titleKey ?? title}>
              <T v={title.length > 22 ? "h1" : "display"} tone="onField" accessibilityRole="header">
                {title}
              </T>
            </Swap>
            {lead ? (
              <T v="small" tone="onFieldMuted">
                {lead}
              </T>
            ) : null}
          </View>
          {side}
        </View>
      </View>
      <Animated.View testID={`${testID}-layer`} entering={reduce ? undefined : presets.layer(low)} style={[{ flex: 1, marginTop: -LAYER_OVERLAP, backgroundColor: c.bg, borderTopLeftRadius: layout.radiusLayer, borderTopRightRadius: layout.radiusLayer, ...layerShadow(c) }]}>
        <ScrollView bounces={false} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1, paddingTop: space[5], paddingHorizontal: layout.gutter, paddingBottom: insets.bottom + space[4], width: "100%", maxWidth: 460, alignSelf: "center" }}>
          <View style={{ flexGrow: 1, justifyContent: "center" }}>{children}</View>
          {footer ? <View style={{ gap: space[2], paddingTop: space[4] }}>{footer}</View> : null}
        </ScrollView>
      </Animated.View>
    </Animated.View>
  );
}

/** Arriving: the gate fades in; its layer rises by itself (presets.layer). */
function GateEnter() {
  "worklet";
  return { initialValues: { opacity: 0 }, animations: { opacity: withTiming(1, { duration: dur.state, easing: Easing.bezier(0.23, 1, 0.32, 1) }) } };
}

/** Leaving: the gate lifts a little, grows a touch and fades (the app shows through). */
function GateExit() {
  "worklet";
  const ease = Easing.bezier(0.23, 1, 0.32, 1);
  return {
    initialValues: { opacity: 1, transform: [{ translateY: 0 }, { scale: 1 }] },
    animations: { opacity: withTiming(0, { duration: 280, easing: ease }), transform: [{ translateY: withTiming(-24, { duration: 280, easing: ease }) }, { scale: withTiming(1.04, { duration: 280, easing: ease }) }] },
  };
}

/** What a gate says on its layer: a small icon patch, the words, an optional second line. */
export function GateNote({ icon: Icon, children, more, testID }: { icon: IconType; children: string; more?: string; testID?: string }) {
  const c = useTheme();
  const a = c.areas.learn;
  return (
    <View testID={testID} style={{ gap: space[4], alignItems: "flex-start" }}>
      <Enter i={0} kind="pop">
        <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: a.wash, alignItems: "center", justifyContent: "center" }}>
          <Icon size={28} color={a.deep} strokeWidth={2} />
        </View>
      </Enter>
      <Enter i={1} style={{ gap: space[3] }}>
        <T v="reading">{children}</T>
        {more ? <T tone="muted">{more}</T> : null}
      </Enter>
    </View>
  );
}

/** The line over the PIN dots: what to do, or what went wrong, in words. */
function PinLine({ children, bad, testID }: { children: string; bad?: boolean; testID?: string }) {
  return (
    <T tone={bad ? "danger" : "muted"} center accessibilityLiveRegion="polite" testID={testID} style={{ minHeight: 48, marginBottom: space[4] }}>
      {children}
    </T>
  );
}

/** Choose a PIN right after signing in: enter it, then enter it again. */
export function SetPinScreen() {
  const [first, setFirst] = React.useState<string | null>(null);
  const [value, setValue] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [shake, setShake] = React.useState(0);
  const [tone, setTone] = React.useState<PinTone>("normal");
  const [busy, setBusy] = React.useState(false);

  const reject = (msg: string) => {
    haptic.warn();
    setError(msg);
    setShake((s) => s + 1);
    setTone("error");
    // Let the red dots show for a moment, then clear them for the next try.
    setTimeout(() => {
      setTone("normal");
      setValue("");
    }, 420);
  };
  const complete = (pin: string) => {
    if (first === null) {
      if (isWeakPin(pin)) return reject("That one is easy to guess. Choose another.");
      setError(null);
      setFirst(pin);
      setTimeout(() => setValue(""), 160);
      return;
    }
    if (pin !== first) {
      setFirst(null);
      return reject("Those two did not match. Start again.");
    }
    setBusy(true);
    setTone("success");
    haptic.success();
    // A short beat for the lime wave, then into the app. This screen stays up
    // until Home has painted under it, then lifts away (app/_layout.tsx).
    setTimeout(() => {
      handoff.set({ opening: true });
      session.choosePin(pin).catch(() => {
        // The phone's keystore refused the PIN: say so and let them try again, never stop here.
        handoff.set({ opening: false });
        setBusy(false);
        setFirst(null);
        reject("The PIN could not be saved on this phone. Try again.");
      });
    }, 420);
  };

  const step = busy ? "done" : first === null ? "one" : "two";
  return (
    <Gate
      testID="set-pin"
      titleKey={step}
      title={busy ? "All set" : first === null ? "Choose a PIN" : "Enter it once more"}
      lead={busy ? "Opening your app." : first === null ? "Step 1 of 2" : "Step 2 of 2"}
      footer={<View style={{ minHeight: layout.target }}>{first !== null && !busy ? <Button kind="text" full label="Start again" testID="set-pin-restart" onPress={() => { setFirst(null); setValue(""); setError(null); }} /> : null}</View>}
    >
      <PinLine bad={!!error && !busy} testID="set-pin-line">
        {busy ? "Your PIN is saved on this phone." : (error ?? (first === null ? "Four digits. You will use it each time you open the app." : "So we know it is the one you meant."))}
      </PinLine>
      <PinPad value={value} onChange={setValue} onComplete={complete} shake={shake} disabled={busy || tone === "error"} tone={tone} />
    </Gate>
  );
}

/** The lock: shown on every cold start and after five minutes away. */
export function LockScreen() {
  const c = useTheme();
  const me = useSession((s) => s.me);
  const triesLeft = useSession((s) => s.triesLeft);
  const [value, setValue] = React.useState("");
  const [shake, setShake] = React.useState(0);
  const [busy, setBusy] = React.useState(false);
  const [wrong, setWrong] = React.useState(false);
  const [tone, setTone] = React.useState<PinTone>("normal");
  const first = typeof me?.name === "string" ? me.name.split(" ")[0] : undefined;
  // Fingerprint or face, when switched on in Settings: asked once as the lock appears, and on the button.
  const [bio, setBio] = React.useState<{ label: string; face: boolean } | null>(null);
  // One phone prompt at a time: a second tap while it is up would stack another one.
  const asking = React.useRef(false);
  const tryBio = React.useCallback(async () => {
    if (asking.current) return;
    asking.current = true;
    let ok = false;
    try {
      ok = await unlockWithBiometric();
    } finally {
      asking.current = false;
    }
    // "Use PIN", a failed match or any error: the PIN pad stays, nothing else changes.
    if (!ok) return;
    setTone("success");
    haptic.success();
    session.openWithBiometric();
  }, []);
  React.useEffect(() => {
    let live = true;
    void (async () => {
      if (!(await biometricEnabled())) return;
      const kind = await biometricKind();
      if (!live) return;
      setBio({ label: kind === "face" ? "Use face unlock" : kind === "fingerprint" ? "Use fingerprint" : "Use fingerprint or face", face: kind === "face" });
      void tryBio();
    })();
    return () => {
      live = false;
    };
  }, [tryBio]);

  const complete = async (pin: string) => {
    setBusy(true);
    let ok = false;
    try {
      ok = await session.unlock(pin);
    } catch {
      ok = false;
    }
    if (ok) {
      setTone("success");
      haptic.success();
      return;
    }
    setBusy(false);
    haptic.warn();
    setWrong(true);
    setShake((s) => s + 1);
    setTone("error");
    setTimeout(() => {
      setTone("normal");
      setValue("");
    }, 420);
  };

  const BioIcon = bio?.face ? ScanFace : Fingerprint;
  return (
    <Gate
      testID="lock"
      title={first ? `Welcome back, ${first}` : "Welcome back"}
      footer={
        <>
          {bio ? <Button kind="quiet" label={bio.label} icon={<BioIcon size={20} color={c.ink} strokeWidth={2} />} onPress={() => void tryBio()} testID="lock-biometric" /> : null}
          <Button kind="text" full label="Forgot PIN?" onPress={() => void session.forgotPin()} accessibilityHint="Signs you out. Sign in with your password to choose a new PIN." testID="forgot-pin" />
        </>
      }
    >
      <PinLine bad={wrong && tone !== "success"} testID="lock-line">
        {tone === "success" ? "Opening your app." : wrong ? (triesLeft === 1 ? "Wrong PIN. One more try, then you will be signed out." : `Wrong PIN. ${triesLeft} tries left.`) : "Enter your PIN"}
      </PinLine>
      <PinPad value={value} onChange={setValue} onComplete={(p) => void complete(p)} shake={shake} disabled={busy || tone === "error"} tone={tone} />
    </Gate>
  );
}

/** The app is too old for the server: nothing works until it is updated. */
export function UpdateScreen({ storeUrl }: { storeUrl: string | null }) {
  const cfg = useConfig();
  const url = storeUrl ?? cfg.data?.storeUrl?.android ?? "https://play.google.com/store/apps/details?id=com.vibhapsychology.app";
  return (
    <Gate testID="update" title="Time for an update" lead="It takes about a minute" footer={<Button label="Update the app" onPress={() => void openLink(url)} testID="update-button" />}>
      <GateNote icon={CloudDownload} more="Your progress, notes and attendance are safe. Nothing is lost.">
        This version of the app is too old to carry on. Update it, then open VIBHA again.
      </GateNote>
    </Gate>
  );
}

const PAUSED_ASK = "Message us on WhatsApp and we will sort it out.";

/** The server's words only when they add something to the title (it often repeats "your account is paused"). */
export function pausedBody(message: string | null | undefined): string {
  const m = (message ?? "").trim();
  if (!m || /paused/i.test(m)) return PAUSED_ASK;
  return `${m.replace(/[.\s]*$/, ".")} ${PAUSED_ASK}`;
}

/** The account is paused. It lifts by itself; "Try again" asks the server. */
export function PausedScreen({ message }: { message: string }) {
  const c = useTheme();
  const [busy, setBusy] = React.useState(false);
  return (
    <Gate
      testID="paused"
      title="Your account is paused"
      footer={
        <>
          <Button label="Message us on WhatsApp" icon={<MessageCircle size={20} color={c.onPrimary} strokeWidth={2} />} onPress={() => void openLink(BRAND.whatsapp)} testID="paused-whatsapp" />
          <Button kind="quiet" busy={busy} label="Try again" testID="paused-retry" onPress={() => { setBusy(true); void session.refreshMe().finally(() => setBusy(false)); }} />
          <Button kind="text" full label="Sign out" testID="paused-sign-out" onPress={() => { session.clearGate(); void session.signOut(); }} />
        </>
      }
    >
      <GateNote icon={CirclePause} more="Your work is kept. When the pause is lifted, everything is where you left it." testID="paused-note">
        {pausedBody(message)}
      </GateNote>
    </Gate>
  );
}

/** Shown once after this phone was signed out because the account was opened on another one. */
export function OtherDeviceScreen({ onContinue }: { onContinue: () => void }) {
  return (
    <Gate testID="other-device" title="Opened on another phone" lead="One phone at a time" footer={<Button label="Sign in again" onPress={onContinue} testID="other-device-continue" />}>
      <GateNote icon={Smartphone} more="If that was not you, sign in here and message us on WhatsApp so we can keep your account safe.">
        Your account was opened on another phone, so this one was signed out. VIBHA works on one phone at a time. Sign in again to use this one.
      </GateNote>
    </Gate>
  );
}
