import * as React from "react";
import { Linking, View } from "react-native";
import Animated, { Easing, FadeIn, FadeOut, useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withSpring, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useConfig } from "@/api/queries";
import { session, useSession } from "@/auth";
import { biometricEnabled, biometricKind, unlockWithBiometric } from "@/auth/biometric";
import { handoff } from "@/auth/handoff";
import { isWeakPin } from "@/auth/pin";
import { PinPad, type PinTone } from "@/auth/PinPad";
import { Button, EmptyState, T, Wordmark } from "@/ds";
import { BRAND } from "@/lib/brand";
import { haptic } from "@/lib/haptics";
import { Burst, dur, springs, Swap } from "@/motion";
import { layout, space, useTheme } from "@/theme";
import { Icon, Star } from "@/visitor/Art";

/**
 * The frame of the full-screen moments (PIN, update, paused): wordmark on top,
 * content in the middle, action low. It rises in over the app and, when it
 * goes (the right PIN), it lifts away and fades, so the app appears under it.
 */
function Gate({ children, footer, testID, art }: { children: React.ReactNode; footer?: React.ReactNode; testID: string; art?: React.ReactNode }) {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const reduce = useReducedMotion();
  return (
    <Animated.View
      testID={testID}
      accessibilityViewIsModal
      entering={reduce ? FadeIn.duration(150) : GateEnter}
      exiting={reduce ? FadeOut.duration(150) : GateExit}
      style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: c.bg, paddingTop: insets.top + space[5], paddingBottom: insets.bottom + space[5], paddingHorizontal: layout.gutter }}
    >
      <Wordmark />
      <View style={{ flex: 1, justifyContent: "center", width: "100%", maxWidth: 420, alignSelf: "center" }}>
        {art}
        {children}
      </View>
      {footer ? <View style={{ width: "100%", maxWidth: 420, alignSelf: "center", gap: space[2] }}>{footer}</View> : null}
    </Animated.View>
  );
}

/** Arriving: the gate rises 12px from below and fades in (after the sign-in form has dropped away). */
function GateEnter() {
  "worklet";
  const ease = Easing.bezier(0.23, 1, 0.32, 1);
  return {
    initialValues: { opacity: 0, transform: [{ translateY: 12 }] },
    animations: { opacity: withTiming(1, { duration: dur.enter, easing: ease }), transform: [{ translateY: withTiming(0, { duration: dur.enter, easing: ease }) }] },
  };
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

/** A lime star with a shield on it: the PIN keeps the account safe. */
function PinArt({ win = 0 }: { /** Each new value fires sparks: the PIN is right. */ win?: number }) {
  const pop = useSharedValue(0);
  const reduce = useReducedMotion();
  React.useEffect(() => {
    pop.set(reduce ? 1 : withDelay(120, withSpring(1, springs.art)));
  }, [pop, reduce]);
  const anim = useAnimatedStyle(() => ({ opacity: Math.min(1, pop.value * 2), transform: [{ scale: 0.5 + pop.value * 0.5 }, { rotate: `${(1 - pop.value) * -90}deg` }] }));
  return (
    <Animated.View style={[{ alignSelf: "center", width: 84, height: 84, marginBottom: space[4], alignItems: "center", justifyContent: "center" }, anim]}>
      <Star size={84} fill="#cdf24b" style={{ position: "absolute" }} />
      <Icon name="shield" size={38} fill="#ffffff" />
      {win ? <Burst fire={win} reach={64} count={12} /> : null}
    </Animated.View>
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

  return (
    <Gate testID="set-pin" art={<PinArt win={tone === "success" ? 1 : 0} />} footer={first !== null && !busy ? <Button kind="text" full label="Start again" onPress={() => { setFirst(null); setValue(""); setError(null); }} /> : null}>
      <View style={{ alignItems: "center", gap: space[2], marginBottom: space[6] }}>
        <Swap k={busy ? "done" : first === null ? "one" : "two"}>
          <T v="h1" center>
            {busy ? "All set" : first === null ? "Choose a PIN" : "Enter it once more"}
          </T>
        </Swap>
        <T tone={error ? "danger" : "muted"} center accessibilityLiveRegion="polite">
          {busy ? "Opening your app." : (error ?? (first === null ? "Four digits. You will use it each time you open the app." : "So we know it is the one you meant."))}
        </T>
      </View>
      <PinPad value={value} onChange={setValue} onComplete={complete} shake={shake} disabled={busy || tone === "error"} tone={tone} />
    </Gate>
  );
}

/** The lock: shown on every cold start and after five minutes away. */
export function LockScreen() {
  const me = useSession((s) => s.me);
  const triesLeft = useSession((s) => s.triesLeft);
  const [value, setValue] = React.useState("");
  const [shake, setShake] = React.useState(0);
  const [busy, setBusy] = React.useState(false);
  const [wrong, setWrong] = React.useState(false);
  const [tone, setTone] = React.useState<PinTone>("normal");
  const first = typeof me?.name === "string" ? me.name.split(" ")[0] : undefined;
  // Fingerprint or face, when switched on in Settings: asked once as the lock appears, and on the button.
  const [bio, setBio] = React.useState<string | null>(null);
  const tryBio = React.useCallback(async () => {
    if (!(await unlockWithBiometric())) return;
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
      setBio(kind === "face" ? "Use face unlock" : kind === "fingerprint" ? "Use fingerprint" : "Use fingerprint or face");
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

  return (
    <Gate
      testID="lock"
      art={<PinArt win={tone === "success" ? 1 : 0} />}
      footer={
        <>
          {bio ? <Button kind="quiet" label={bio} onPress={() => void tryBio()} testID="lock-biometric" /> : null}
          <Button kind="text" full label="Forgot PIN?" onPress={() => void session.forgotPin()} accessibilityHint="Signs you out. Sign in with your password to choose a new PIN." testID="forgot-pin" />
        </>
      }
    >
      <View style={{ alignItems: "center", gap: space[2], marginBottom: space[6] }}>
        <T v="h1" center>
          {first ? `Welcome back, ${first}` : "Welcome back"}
        </T>
        <T tone={wrong ? "danger" : "muted"} center accessibilityLiveRegion="polite" testID="lock-line">
          {wrong ? (triesLeft === 1 ? "Wrong PIN. One more try, then you will be signed out." : `Wrong PIN. ${triesLeft} tries left.`) : "Enter your PIN"}
        </T>
      </View>
      <PinPad value={value} onChange={setValue} onComplete={(p) => void complete(p)} shake={shake} disabled={busy || tone === "error"} tone={tone} />
    </Gate>
  );
}

/** The app is too old for the server: nothing works until it is updated. */
export function UpdateScreen({ storeUrl }: { storeUrl: string | null }) {
  const cfg = useConfig();
  const url = storeUrl ?? cfg.data?.storeUrl?.android ?? "https://play.google.com/store/apps/details?id=com.vibhapsychology.app";
  return (
    <Gate testID="update" footer={<Button label="Update the app" onPress={() => void Linking.openURL(url)} testID="update-button" />}>
      <EmptyState mood="wait" title="Time for an update" body="This version of the app is too old to carry on. The update takes a minute and your progress is safe." />
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
  const [busy, setBusy] = React.useState(false);
  return (
    <Gate
      testID="paused"
      footer={
        <>
          <Button label="Message us on WhatsApp" onPress={() => void Linking.openURL(BRAND.whatsapp)} testID="paused-whatsapp" />
          <Button kind="text" full busy={busy} label="Try again" onPress={() => { setBusy(true); void session.refreshMe().finally(() => setBusy(false)); }} />
          <Button kind="text" full label="Sign out" onPress={() => { session.clearGate(); void session.signOut(); }} />
        </>
      }
    >
      <EmptyState mood="wait" title="Your account is paused" body={pausedBody(message)} />
    </Gate>
  );
}

/** Shown once after this phone was signed out because the account was opened on another one. */
export function OtherDeviceScreen({ onContinue }: { onContinue: () => void }) {
  return (
    <Gate testID="other-device" footer={<Button label="Sign in again" onPress={onContinue} testID="other-device-continue" />}>
      <EmptyState mood="error" title="Opened on another device" body="Your account was opened on another phone, so this one was signed out. VIBHA works on one phone at a time. Sign in again to use this one." />
    </Gate>
  );
}
