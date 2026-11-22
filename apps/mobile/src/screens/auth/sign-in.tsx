import { router } from "expo-router";
import { ChevronLeft, Info, Lock, Mail, MessageCircle, TriangleAlert } from "lucide-react-native";
import * as React from "react";
import { Keyboard, Pressable, ScrollView, TextInput, View, useWindowDimensions } from "react-native";
import Animated, { useAnimatedStyle, useDerivedValue, useReducedMotion, useSharedValue, withDelay, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ApiFailure, messageOf } from "@/api/errors";
import { session, useSession } from "@/auth";
import { holdPin, releasePin } from "@/auth/handoff";
import { Button, LAYER_OVERLAP, layerShadow, RoundButton, T, Wordmark } from "@/ds";
import { useKeyboardPad } from "@/ds/keyboard-pad";
import { BRAND } from "@/lib/brand";
import { haptic } from "@/lib/haptics";
import { KeyboardState, useKeyboard } from "@/lib/keyboard";
import { openLink } from "@/lib/open";
import { curves, dur, Enter, presets, Press, useMotionTier } from "@/motion";
import { fonts, layout, space, useLightStatusBar, useTheme } from "@/theme";
import { JyoOnField } from "@/visitor/jyo-field";
import { AuthField, SubmitButton, useShake } from "@/visitor/form";

/** Height of the field while the keyboard is up (under the status bar). */
const FOLDED = 64;
/** The field is fully folded once the keyboard is this high. */
const FOLD_AT = 220;

const NOTICE: Record<string, string> = {
  pin_tries: "Too many wrong PIN tries, so you were signed out. Sign in with your password to choose a new PIN.",
  forgot_pin: "Sign in with your password to choose a new PIN.",
  account_expired: "Your access to VIBHA has ended. Message us on WhatsApp if you think this is a mistake.",
  device_replaced: "You were signed out here because your account was opened on another device.",
};

/** Plain words for what went wrong, whatever the server or the network said. */
export function signInProblem(err: unknown): string {
  if (err instanceof ApiFailure) {
    if (err.code === "invalid_credentials") return "That email and password do not match. Check both and try again.";
    if (err.code === "network") return "No internet connection. Check it and try again.";
    if (err.code === "rate_limited") return "Too many tries. Wait a minute, then try again.";
  }
  return messageOf(err);
}

/**
 * Sign in: the most important screen a visitor sees, in the Layers look.
 * The blue field on top holds the name, the hello and Jyo (it folds away
 * while the keyboard is up); the soft layer rises over it with email and
 * password and the one lime button. Wrong details shake the form and say what
 * to do in plain words. When it works the button turns into a tick, the layer
 * drops away, the field slides up out of view, and only then does the PIN
 * screen rise in (it waits through `holdPin`, src/auth/handoff.ts).
 * An account whose access has ended gets its own calm page here, with a way
 * to reach the school and a way to sign in with another account.
 */
export function SignInScreen({ defaultEmail = "" }: { defaultEmail?: string }) {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const reduce = useReducedMotion();
  const { low } = useMotionTier();
  const notice = useSession((s) => s.notice);
  const phase = useSession((s) => s.phase);
  const [email, setEmail] = React.useState(defaultEmail);
  const [password, setPassword] = React.useState("");
  const [errors, setErrors] = React.useState<{ email?: string; password?: string }>({});
  const [failure, setFailure] = React.useState<string | null>(null);
  const [state, setState] = React.useState<"idle" | "busy" | "done">("idle");
  const [shakes, setShakes] = React.useState(0);
  const passwordRef = React.useRef<React.ComponentRef<typeof TextInput>>(null);
  const shake = useShake(shakes);
  const ended = notice === "account_expired";

  // The field is blue in both themes: white clock and battery here.
  useLightStatusBar();

  // The field folds away while the keyboard is up, so the fields and the button stay in view.
  // It follows the keyboard frame by frame (UI thread) and only moves: the field slides up and the
  // layer slides up with it inside a clipped frame; nothing changes height.
  const band = Math.round(Math.min(270, Math.max(196, height * 0.27)));
  const lift = band - FOLDED;
  const kb = useKeyboard();
  // The fields and the button stay above the keyboard: the layer's frame pads itself by what the
  // keyboard covers (0 when the window already shrank), so the scroll can bring the field into view.
  const { ref: frame, pad: kbPad, onLayout: frameLayout } = useKeyboardPad();
  const fold = useDerivedValue(() => {
    if (reduce) return kb.state.value === KeyboardState.OPENING || kb.state.value === KeyboardState.OPEN ? 1 : 0;
    return Math.min(1, Math.max(0, kb.height.value / FOLD_AT));
  });
  const artStyle = useAnimatedStyle(() => ({ opacity: 1 - fold.value, transform: [{ translateY: fold.value * -24 }, { scale: 1 - fold.value * 0.06 }] }));
  // The name stays in the folded strip: it moves down as much as the field moves up.
  const nameStyle = useAnimatedStyle(() => ({ transform: [{ translateY: fold.value * lift }] }));

  // The exit after a good sign in: 0 in place, 1 gone (layer dropped 8px and faded, field up out of view).
  const out = useSharedValue(0);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  React.useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
      releasePin();
    },
    [],
  );
  // Signed out again while this screen was still here (the account ended mid-way): show the form again.
  if (state === "done" && phase === "visitor") setState("idle");
  React.useEffect(() => {
    if (state === "idle") out.set(0);
  }, [state, out]);
  const formStyle = useAnimatedStyle(() => ({ opacity: 1 - Math.min(1, out.value * 1.6), transform: [{ translateY: (1 - fold.value) * lift + (reduce ? 0 : out.value * 8) }] }));
  const bandStyle = useAnimatedStyle(() => ({ opacity: reduce ? 1 - out.value : 1, transform: [{ translateY: -fold.value * lift - (reduce ? 0 : out.value * (insets.top + band + 4)) }] }));

  const leave = () => {
    // Tick first (the button's done face), then the layer and field go, then the PIN screen rises in.
    const wait = reduce ? 120 : 240;
    out.set(withDelay(wait, withTiming(1, { duration: reduce ? 150 : dur.enter, easing: curves.out })));
    timer.current = setTimeout(releasePin, wait + 150);
  };

  const submit = async () => {
    if (state !== "idle") return;
    const e: typeof errors = {};
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) e.email = email.trim() ? "That does not look like an email address." : "Enter your email address.";
    if (!password) e.password = "Enter your password.";
    setErrors(e);
    setFailure(null);
    if (e.email || e.password) {
      haptic.warn();
      return;
    }
    Keyboard.dismiss();
    setState("busy");
    holdPin();
    try {
      await session.signIn(email.trim(), password);
      haptic.success();
      setState("done");
      leave();
    } catch (err) {
      releasePin();
      haptic.warn();
      setFailure(signInProblem(err));
      setShakes((s) => s + 1);
      setState("idle");
    }
  };

  const back = router.canGoBack();
  return (
    <View testID="sign-in" style={{ flex: 1, backgroundColor: c.bg }}>
      {/* The blue field: the name, the hello, Jyo. */}
      <Animated.View style={[{ position: "absolute", top: 0, left: 0, right: 0, height: insets.top + band, backgroundColor: c.field, overflow: "hidden" }, bandStyle]}>
        <Animated.View style={[{ position: "absolute", left: 0, right: 0, top: insets.top + FOLDED, paddingHorizontal: layout.gutter, flexDirection: "row", alignItems: "flex-end", gap: space[3] }, artStyle]}>
          <Enter i={0} style={{ flex: 1, gap: space[1], paddingTop: space[2] }}>
            <T v="display" tone="onField" accessibilityRole="header">
              {ended ? "Your access has ended" : "Welcome back"}
            </T>
            <T v="small" tone="onFieldMuted">
              {ended ? "This account can no longer open VIBHA." : "Sign in with your VIBHA email and password."}
            </T>
          </Enter>
          {ended ? null : (
            <Enter i={2} kind="pop">
              <JyoOnField size={band > 220 ? 76 : 62} label="Jyo, a small clay lamp, says hello" />
            </Enter>
          )}
        </Animated.View>
        <Animated.View style={[{ position: "absolute", top: insets.top, left: 0, right: 0, height: FOLDED, flexDirection: "row", alignItems: "center", gap: space[3], paddingHorizontal: layout.gutter }, nameStyle]}>
          {back ? (
            <RoundButton onField label="Back" onPress={() => router.back()} testID="sign-in-back">
              <ChevronLeft size={22} color={c.onField} strokeWidth={2.2} />
            </RoundButton>
          ) : null}
          <Wordmark onField sub={null} size={24} />
        </Animated.View>
      </Animated.View>
      {/* The layer's frame starts where the folded field ends (less the overlap) and clips what is below the screen. */}
      <View ref={frame} onLayout={frameLayout} pointerEvents="box-none" style={{ position: "absolute", top: insets.top + FOLDED - LAYER_OVERLAP, left: 0, right: 0, bottom: 0, overflow: "hidden", paddingBottom: kbPad }}>
        <Animated.View style={[{ flex: 1 }, formStyle]}>
          <Animated.View testID="layer" entering={reduce ? undefined : presets.layer(low)} style={[{ flex: 1, backgroundColor: c.bg, borderTopLeftRadius: layout.radiusLayer, borderTopRightRadius: layout.radiusLayer }, layerShadow(c)]}>
            <ScrollView keyboardShouldPersistTaps="handled" keyboardDismissMode="interactive" showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingHorizontal: layout.gutter, paddingTop: space[5] + space[1], paddingBottom: insets.bottom + space[4] + lift, width: "100%", maxWidth: 480, alignSelf: "center", gap: space[5] }}>
              {ended ? (
                <Ended />
              ) : (
                <>
                  {notice && NOTICE[notice] ? (
                    <View style={{ flexDirection: "row", gap: space[3], alignItems: "flex-start", backgroundColor: c.card, borderRadius: layout.radius, padding: space[4] }}>
                      <Info size={20} color={c.ink} strokeWidth={2} style={{ marginTop: 1 }} />
                      <T v="small" accessibilityLiveRegion="polite" testID="sign-in-notice" style={{ flex: 1 }}>
                        {NOTICE[notice]}
                      </T>
                    </View>
                  ) : null}
                  <Animated.View style={[{ gap: space[4] }, shake]}>
                    <AuthField label="Email" icon={Mail} value={email} onChangeText={(v) => { setEmail(v); if (errors.email) setErrors((x) => ({ ...x, email: undefined })); }} error={errors.email} autoComplete="email" textContentType="username" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} returnKeyType="next" onSubmitEditing={() => passwordRef.current?.focus()} placeholder="you@example.com" testID="sign-in-email" />
                    <AuthField inputRef={passwordRef} label="Password" icon={Lock} value={password} onChangeText={(v) => { setPassword(v); if (errors.password) setErrors((x) => ({ ...x, password: undefined })); }} error={errors.password} secret autoComplete="current-password" textContentType="password" autoCapitalize="none" returnKeyType="go" onSubmitEditing={() => void submit()} testID="sign-in-password" />
                    <Pressable onPress={() => router.push("/forgot-password")} testID="sign-in-forgot" accessibilityRole="link" hitSlop={6} style={{ alignSelf: "flex-end", minHeight: layout.target, paddingHorizontal: space[1], justifyContent: "center", marginTop: -space[2] }}>
                      <T v="small" tone="link" style={{ fontFamily: fonts.bold }}>
                        Forgot your password?
                      </T>
                    </Pressable>
                  </Animated.View>
                  {failure ? (
                    <Animated.View entering={reduce ? undefined : presets.rise()} style={{ flexDirection: "row", gap: space[3], alignItems: "flex-start", backgroundColor: c.alertBg, borderRadius: layout.radius, padding: space[4] }}>
                      <TriangleAlert size={20} color={c.alertFg} strokeWidth={2} style={{ marginTop: 1 }} />
                      <T v="small" tone="alert" accessibilityLiveRegion="polite" testID="sign-in-failure" style={{ flex: 1, fontFamily: fonts.semibold }}>
                        {failure}
                      </T>
                    </Animated.View>
                  ) : null}
                  <SubmitButton label="Sign in" busyLabel="Signing in" doneLabel="Signed in" state={state} onPress={() => void submit()} testID="sign-in-submit" />
                  <View style={{ flex: 1 }} />
                  <Press onPress={() => router.push("/request")} accessibilityRole="button" accessibilityLabel="New here? Request an invitation" testID="sign-in-request" innerStyle={{ minHeight: layout.target, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: space[1] }}>
                    <T v="small" tone="muted">
                      New here?
                    </T>
                    <T v="button" tone="link">
                      Request an invitation
                    </T>
                  </Press>
                </>
              )}
            </ScrollView>
          </Animated.View>
        </Animated.View>
      </View>
    </View>
  );
}

/** The account's access has ended: say so, offer the school, and a way to use another account. */
function Ended() {
  const c = useTheme();
  const a = c.areas.learn;
  const ask = `${BRAND.whatsapp}?text=${encodeURIComponent("Hi, my VIBHA account says my access has ended. Can you help?")}`;
  return (
    <View testID="sign-in-ended" style={{ flexGrow: 1, gap: space[5] }}>
      <Enter i={0} kind="pop">
        <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: a.wash, alignItems: "center", justifyContent: "center" }}>
          <Lock size={28} color={a.deep} strokeWidth={2} />
        </View>
      </Enter>
      <Enter i={1} style={{ gap: space[3] }}>
        <T v="reading" accessibilityLiveRegion="polite" testID="sign-in-notice">
          {NOTICE.account_expired}
        </T>
      </Enter>
      <View style={{ flex: 1 }} />
      <View style={{ gap: space[2] }}>
        <Button label="Message us on WhatsApp" icon={<MessageCircle size={20} color={c.onPrimary} strokeWidth={2} />} onPress={() => void openLink(ask)} testID="ended-whatsapp" />
        <Button kind="quiet" label="Sign in with another account" onPress={() => session.clearNotice()} testID="ended-other" />
      </View>
    </View>
  );
}
