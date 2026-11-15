import { router, useFocusEffect } from "expo-router";
import { setStatusBarStyle } from "expo-status-bar";
import { Lock, Mail } from "lucide-react-native";
import * as React from "react";
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View, useWindowDimensions } from "react-native";
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ApiFailure, messageOf } from "@/api/errors";
import { session, useSession } from "@/auth";
import { T, Tint } from "@/ds";
import { haptic } from "@/lib/haptics";
import { Press } from "@/motion";
import { fonts, layout, space, useTheme } from "@/theme";
import { Person, Sparkle, Star } from "@/visitor/Art";
import { AuthField, SubmitButton, useShake } from "@/visitor/form";
import { BLUE, INK, LIME, bouncy, easeOut, useIntro, useIntroSpring } from "@/visitor/motion";
import { Dots, Pix } from "@/visitor/parts";

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
 * Sign in: the most important screen a visitor sees. Blue art band on top
 * (it folds away while the keyboard is up), then email and password, one big
 * button. Wrong details shake the form and say what to do in plain words.
 * When it works the button turns into a tick and the PIN screen slides in.
 */
export function SignInScreen({ defaultEmail = "" }: { defaultEmail?: string }) {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const reduce = useReducedMotion();
  const notice = useSession((s) => s.notice);
  const [email, setEmail] = React.useState(defaultEmail);
  const [password, setPassword] = React.useState("");
  const [errors, setErrors] = React.useState<{ email?: string; password?: string }>({});
  const [failure, setFailure] = React.useState<string | null>(null);
  const [state, setState] = React.useState<"idle" | "busy" | "done">("idle");
  const [shakes, setShakes] = React.useState(0);
  const passwordRef = React.useRef<React.ComponentRef<typeof TextInput>>(null);
  const shake = useShake(shakes);

  useFocusEffect(
    React.useCallback(() => {
      setStatusBarStyle("light");
      return () => setStatusBarStyle(c.dark ? "light" : "dark");
    }, [c.dark]),
  );

  // The art band folds away while the keyboard is up, so the fields and the button stay in view.
  const band = Math.round(Math.min(260, Math.max(170, height * 0.25)));
  const fold = useSharedValue(0);
  React.useEffect(() => {
    const show = Keyboard.addListener(Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow", () => fold.set(reduce ? 1 : withTiming(1, { duration: 260, easing: easeOut })));
    const hide = Keyboard.addListener(Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide", () => fold.set(reduce ? 0 : withTiming(0, { duration: 260, easing: easeOut })));
    return () => {
      show.remove();
      hide.remove();
    };
  }, [fold, reduce]);
  const bandStyle = useAnimatedStyle(() => ({ height: insets.top + band - fold.value * (band - 64) }));
  const artStyle = useAnimatedStyle(() => ({ opacity: 1 - fold.value, transform: [{ translateY: fold.value * -40 }, { scale: 1 - fold.value * 0.15 }] }));

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
    try {
      await session.signIn(email.trim(), password);
      haptic.success();
      setState("done");
    } catch (err) {
      haptic.warn();
      setFailure(signInProblem(err));
      setShakes((s) => s + 1);
      setState("idle");
    }
  };

  return (
    <View testID="sign-in" style={{ flex: 1, backgroundColor: c.bg }}>
      <Animated.View style={[{ backgroundColor: BLUE, overflow: "hidden", borderBottomWidth: 2.5, borderColor: INK }, bandStyle]}>
        <Dots />
        <Animated.View style={[{ flex: 1, paddingTop: insets.top }, artStyle]}>
          <BandArt h={band} />
        </Animated.View>
      </Animated.View>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView keyboardShouldPersistTaps="handled" keyboardDismissMode="interactive" showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingHorizontal: layout.gutter, paddingTop: space[5], paddingBottom: space[6], width: "100%", maxWidth: 480, alignSelf: "center", gap: space[5] }}>
          <Title />
          {notice && NOTICE[notice] ? (
            <Tint>
              <T v="small" accessibilityLiveRegion="polite" testID="sign-in-notice">
                {NOTICE[notice]}
              </T>
            </Tint>
          ) : null}
          <Animated.View style={[{ gap: space[4] }, shake]}>
            <AuthField label="Email" icon={Mail} value={email} onChangeText={(v) => { setEmail(v); if (errors.email) setErrors((x) => ({ ...x, email: undefined })); }} error={errors.email} autoComplete="email" textContentType="username" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} returnKeyType="next" onSubmitEditing={() => passwordRef.current?.focus()} placeholder="you@example.com" testID="sign-in-email" />
            <AuthField inputRef={passwordRef} label="Password" icon={Lock} value={password} onChangeText={(v) => { setPassword(v); if (errors.password) setErrors((x) => ({ ...x, password: undefined })); }} error={errors.password} secret autoComplete="current-password" textContentType="password" autoCapitalize="none" returnKeyType="go" onSubmitEditing={() => void submit()} testID="sign-in-password" />
            <Pressable onPress={() => router.push("/forgot-password")} testID="sign-in-forgot" accessibilityRole="link" hitSlop={6} style={{ alignSelf: "flex-end", minHeight: 32, justifyContent: "center" }}>
              <T v="small" tone="link" style={{ fontFamily: fonts.bold }}>
                Forgot your password?
              </T>
            </Pressable>
          </Animated.View>
          {failure ? (
            <Animated.View style={{ flexDirection: "row", gap: space[3], alignItems: "flex-start", borderLeftWidth: 3, borderColor: c.danger, paddingLeft: space[3] }}>
              <T v="small" tone="danger" accessibilityLiveRegion="polite" testID="sign-in-failure" style={{ flex: 1, fontFamily: fonts.semibold }}>
                {failure}
              </T>
            </Animated.View>
          ) : null}
          <SubmitButton label="Sign in" busyLabel="Signing in" doneLabel="Signed in" state={state} onPress={() => void submit()} testID="sign-in-submit" />
          <View style={{ flex: 1 }} />
          <Press onPress={() => router.push("/request")} accessibilityRole="button" accessibilityLabel="New here? Request an invitation" testID="sign-in-request" feel="tap" innerStyle={{ minHeight: layout.target, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: space[1] }}>
            <T v="small" tone="muted">
              New here?
            </T>
            <T v="button" tone="link">
              Request an invitation
            </T>
          </Press>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

function Title() {
  const t = useIntro(120, 600);
  const anim = useAnimatedStyle(() => ({ opacity: t.value, transform: [{ translateY: (1 - t.value) * 16 }] }));
  return (
    <Animated.View style={[{ gap: space[1] }, anim]}>
      <T v="display">Welcome back.</T>
      <T tone="muted">Sign in with the email and password of your VIBHA account.</T>
    </Animated.View>
  );
}

/** The band: the wordmark, the lime star with a student on it, a sparkle, and a hello. */
function BandArt({ h }: { h: number }) {
  const pop = useIntroSpring(150, bouncy);
  const star = useAnimatedStyle(() => ({ transform: [{ scale: 0.4 + pop.value * 0.6 }, { rotate: `${(1 - pop.value) * -140}deg` }] }));
  const rise = useIntroSpring(320, bouncy);
  const person = useAnimatedStyle(() => ({ transform: [{ translateY: (1 - rise.value) * 120 }] }));
  const hi = useIntroSpring(620, bouncy);
  const bubble = useAnimatedStyle(() => ({ opacity: Math.min(1, hi.value * 2), transform: [{ scale: 0.6 + hi.value * 0.4 }] }));
  const p = Math.round(h * 0.62);
  return (
    <View style={{ flex: 1, paddingHorizontal: layout.gutter }}>
      <View style={{ flexDirection: "row", alignItems: "flex-end", gap: space[2], paddingTop: space[4] }} accessible accessibilityRole="header" accessibilityLabel="VIBHA School of Psychology">
        <Text allowFontScaling={false} style={{ fontFamily: fonts.wordmark, fontSize: 24, color: "#ffffff", letterSpacing: -0.4 }}>
          VIBHA
        </Text>
        <Text allowFontScaling={false} style={{ fontFamily: fonts.semibold, fontSize: 12, color: "rgba(255,255,255,0.8)", paddingBottom: 4 }}>
          School of Psychology
        </Text>
      </View>
      <View style={{ position: "absolute", right: layout.gutter - 10, bottom: -6, width: p + 30, alignItems: "center" }}>
        <Animated.View style={[{ position: "absolute", bottom: p * 0.1 }, star]}>
          <Star size={p} fill={LIME} />
        </Animated.View>
        <Animated.View style={person}>
          <Person who="curly" width={p * 0.86} />
        </Animated.View>
      </View>
      <Animated.View style={[{ position: "absolute", left: layout.gutter, bottom: space[5], transformOrigin: "bottom left", backgroundColor: "#ffffff", borderWidth: 2.5, borderColor: INK, borderRadius: 14, borderBottomLeftRadius: 2, paddingHorizontal: space[3], paddingVertical: space[2] }, bubble]}>
        <Pix color={INK} size={11}>
          Good to see you
        </Pix>
      </Animated.View>
      <Sparkle size={22} fill="#ffffff" style={{ position: "absolute", left: "46%", top: "42%" }} />
    </View>
  );
}
