import * as React from "react";
import { Linking, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useConfig } from "@/api/queries";
import { session, useSession } from "@/auth";
import { isWeakPin } from "@/auth/pin";
import { PinPad } from "@/auth/PinPad";
import { Button, EmptyState, T, Wordmark } from "@/ds";
import { BRAND } from "@/lib/brand";
import { haptic } from "@/lib/haptics";
import { layout, space, useTheme } from "@/theme";

/** The frame of the full-screen moments (PIN, update, paused): wordmark on top, content in the middle, action low. */
function Gate({ children, footer, testID }: { children: React.ReactNode; footer?: React.ReactNode; testID: string }) {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View testID={testID} accessibilityViewIsModal style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: c.bg, paddingTop: insets.top + space[5], paddingBottom: insets.bottom + space[5], paddingHorizontal: layout.gutter }}>
      <Wordmark />
      <View style={{ flex: 1, justifyContent: "center", width: "100%", maxWidth: 420, alignSelf: "center" }}>{children}</View>
      {footer ? <View style={{ width: "100%", maxWidth: 420, alignSelf: "center", gap: space[2] }}>{footer}</View> : null}
    </View>
  );
}

/** Choose a PIN right after signing in: enter it, then enter it again. */
export function SetPinScreen() {
  const [first, setFirst] = React.useState<string | null>(null);
  const [value, setValue] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [shake, setShake] = React.useState(0);
  const [busy, setBusy] = React.useState(false);

  const reject = (msg: string) => {
    haptic.warn();
    setError(msg);
    setShake((s) => s + 1);
    setValue("");
  };
  const complete = (pin: string) => {
    if (first === null) {
      if (isWeakPin(pin)) return reject("That one is easy to guess. Choose another.");
      setError(null);
      setFirst(pin);
      setValue("");
      return;
    }
    if (pin !== first) {
      setFirst(null);
      return reject("Those two did not match. Start again.");
    }
    setBusy(true);
    haptic.success();
    void session.choosePin(pin);
  };

  return (
    <Gate testID="set-pin" footer={first !== null ? <Button kind="text" full label="Start again" onPress={() => { setFirst(null); setValue(""); setError(null); }} /> : null}>
      <View style={{ alignItems: "center", gap: space[2], marginBottom: space[6] }}>
        <T v="h1" center>
          {first === null ? "Choose a PIN" : "Enter it once more"}
        </T>
        <T tone={error ? "danger" : "muted"} center accessibilityLiveRegion="polite">
          {error ?? (first === null ? "Four digits. You will use it each time you open the app." : "So we know it is the one you meant.")}
        </T>
      </View>
      <PinPad value={value} onChange={setValue} onComplete={complete} shake={shake} disabled={busy} />
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
  const first = me?.name?.split(" ")[0];

  const complete = async (pin: string) => {
    setBusy(true);
    const ok = await session.unlock(pin);
    setBusy(false);
    if (ok) {
      haptic.success();
      return;
    }
    haptic.warn();
    setWrong(true);
    setShake((s) => s + 1);
    setValue("");
  };

  return (
    <Gate testID="lock" footer={<Button kind="text" full label="Forgot PIN?" onPress={() => void session.forgotPin()} accessibilityHint="Signs you out. Sign in with your password to choose a new PIN." testID="forgot-pin" />}>
      <View style={{ alignItems: "center", gap: space[2], marginBottom: space[6] }}>
        <T v="h1" center>
          {first ? `Welcome back, ${first}` : "Welcome back"}
        </T>
        <T tone={wrong ? "danger" : "muted"} center accessibilityLiveRegion="polite" testID="lock-line">
          {wrong ? (triesLeft === 1 ? "Wrong PIN. One more try, then you will be signed out." : `Wrong PIN. ${triesLeft} tries left.`) : "Enter your PIN"}
        </T>
      </View>
      <PinPad value={value} onChange={setValue} onComplete={(p) => void complete(p)} shake={shake} disabled={busy} />
    </Gate>
  );
}

/** The app is too old for the server: nothing works until it is updated. */
export function UpdateScreen({ storeUrl }: { storeUrl: string | null }) {
  const cfg = useConfig();
  const url = storeUrl ?? cfg.data?.storeUrl.android ?? "https://play.google.com/store/apps/details?id=com.vibhapsychology.app";
  return (
    <Gate testID="update" footer={<Button label="Update the app" onPress={() => void Linking.openURL(url)} testID="update-button" />}>
      <EmptyState mood="calm" title="Time for an update" body="This version of the app is too old to carry on. The update takes a minute and your progress is safe." />
    </Gate>
  );
}

/** The account is paused. It lifts by itself; "Try again" asks the server. */
export function PausedScreen({ message }: { message: string }) {
  const [busy, setBusy] = React.useState(false);
  return (
    <Gate
      testID="paused"
      footer={
        <>
          <Button kind="quiet" label="Message us on WhatsApp" onPress={() => void Linking.openURL(BRAND.whatsapp)} />
          <Button kind="text" full busy={busy} label="Try again" onPress={() => { setBusy(true); void session.refreshMe().finally(() => setBusy(false)); }} />
          <Button kind="text" full label="Sign out" onPress={() => { session.clearGate(); void session.signOut(); }} />
        </>
      }
    >
      <EmptyState mood="sleepy" title="Your account is paused" body={message} />
    </Gate>
  );
}

/** Shown once after this phone was signed out because the account was opened on another one. */
export function OtherDeviceScreen({ onContinue }: { onContinue: () => void }) {
  return (
    <Gate testID="other-device" footer={<Button label="Sign in again" onPress={onContinue} testID="other-device-continue" />}>
      <EmptyState mood="puzzled" title="Opened on another device" body="Your account was opened on another phone, so this one was signed out. VIBHA works on one phone at a time. Sign in again to use this one." />
    </Gate>
  );
}
