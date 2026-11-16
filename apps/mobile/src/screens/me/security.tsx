import * as React from "react";
import { View } from "react-native";

import { session } from "@/auth";
import { biometricAvailable, biometricEnabled, biometricKind, setBiometricEnabled, unlockWithBiometric, type BiometricKind } from "@/auth/biometric";
import { isWeakPin } from "@/auth/pin";
import { PinPad, type PinTone } from "@/auth/PinPad";
import { Row, Sheet, SwitchRow, T } from "@/ds";
import { toast } from "@/ds/toast";
import { haptic } from "@/lib/haptics";
import { space } from "@/theme";

const WORDS: Record<BiometricKind, string> = { fingerprint: "fingerprint", face: "face", other: "fingerprint or face" };

/**
 * The security rows of Settings > This phone: Change PIN, and (when the phone
 * has a fingerprint or face set up) unlocking with it instead of the PIN.
 */
export function PhoneSecurity() {
  const [open, setOpen] = React.useState(false);
  const [bio, setBio] = React.useState<{ kind: BiometricKind; on: boolean } | null>(null);
  React.useEffect(() => {
    let live = true;
    void (async () => {
      if (!(await biometricAvailable())) return;
      const [kind, on] = await Promise.all([biometricKind(), biometricEnabled()]);
      if (live) setBio({ kind, on });
    })();
    return () => {
      live = false;
    };
  }, []);
  const close = React.useCallback(() => setOpen(false), []);

  const toggle = async (on: boolean) => {
    if (!bio) return;
    if (on) {
      // Turning it on asks the phone once, so it is really this person's finger or face.
      if (!(await unlockWithBiometric("Confirm it is you"))) return;
      haptic.success();
    }
    await setBiometricEnabled(on);
    setBio({ ...bio, on });
  };

  return (
    <>
      <Row testID="change-pin" title="Change PIN" onPress={() => setOpen(true)} />
      {bio ? <SwitchRow testID="pref-biometric" title={`Unlock with ${WORDS[bio.kind]}`} meta="Your PIN still works too." value={bio.on} onChange={(v) => void toggle(v)} /> : null}
      <Sheet open={open} onClose={close} title="Change PIN" testID="change-pin-sheet">
        {open ? <ChangePin onDone={close} /> : null}
      </Sheet>
    </>
  );
}

type Step = "old" | "new" | "again";
const ASK: Record<Step, string> = { old: "Enter your current PIN", new: "Choose a new PIN", again: "Enter the new one once more" };

/** Current PIN, then the new one twice. Wrong current PINs count like the lock screen's. */
export function ChangePin({ onDone }: { onDone: () => void }) {
  const [step, setStep] = React.useState<Step>("old");
  const [value, setValue] = React.useState("");
  const [fresh, setFresh] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [shake, setShake] = React.useState(0);
  const [tone, setTone] = React.useState<PinTone>("normal");
  const [busy, setBusy] = React.useState(false);

  const next = (s: Step) => {
    setError(null);
    setStep(s);
    setTimeout(() => setValue(""), 160);
  };
  const reject = (msg: string) => {
    haptic.warn();
    setError(msg);
    setShake((n) => n + 1);
    setTone("error");
    setTimeout(() => {
      setTone("normal");
      setValue("");
    }, 420);
  };

  const complete = async (pin: string) => {
    if (step === "old") {
      setBusy(true);
      const r = await session.checkPin(pin).catch(() => ({ ok: false, triesLeft: 0 }));
      setBusy(false);
      if (r.ok) return next("new");
      return reject(r.triesLeft === 1 ? "Wrong PIN. One more try, then you will be signed out." : `Wrong PIN. ${r.triesLeft} tries left.`);
    }
    if (step === "new") {
      if (isWeakPin(pin)) return reject("That one is easy to guess. Choose another.");
      setFresh(pin);
      return next("again");
    }
    if (pin !== fresh) {
      setFresh(null);
      setStep("new");
      return reject("Those two did not match. Choose the new PIN again.");
    }
    setBusy(true);
    try {
      await session.changePin(pin);
      setTone("success");
      haptic.success();
      toast.show("PIN changed.");
      setTimeout(onDone, 420);
    } catch {
      setBusy(false);
      setFresh(null);
      setStep("new");
      reject("The PIN could not be saved on this phone. Try again.");
    }
  };

  return (
    <View style={{ gap: space[5], alignItems: "center", paddingBottom: space[2] }}>
      <View style={{ gap: space[1], alignItems: "center" }}>
        <T v="h3" center testID="change-pin-step">
          {ASK[step]}
        </T>
        <T v="small" tone={error ? "danger" : "muted"} center accessibilityLiveRegion="polite">
          {error ?? (step === "old" ? "So we know it is you." : step === "new" ? "Four digits." : "So we know it is the one you meant.")}
        </T>
      </View>
      <PinPad value={value} onChange={setValue} onComplete={(p) => void complete(p)} shake={shake} disabled={busy || tone !== "normal"} tone={tone} />
    </View>
  );
}
