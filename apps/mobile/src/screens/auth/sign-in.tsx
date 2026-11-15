import { router } from "expo-router";
import * as React from "react";
import { TextInput, View } from "react-native";

import { ApiFailure, messageOf } from "@/api/errors";
import { session, useSession } from "@/auth";
import { Button, Field, Screen, T, Tint } from "@/ds";
import { haptic } from "@/lib/haptics";
import { space } from "@/theme";

const NOTICE: Record<string, string> = {
  pin_tries: "Too many wrong PIN tries, so you were signed out. Sign in with your password to choose a new PIN.",
  forgot_pin: "Sign in with your password to choose a new PIN.",
  account_expired: "Your access to VIBHA has ended. Message us on WhatsApp if you think this is a mistake.",
  device_replaced: "You were signed out here because your account was opened on another device.",
};

/** Sign in: email and password, once. After this the PIN opens the app. */
export function SignInScreen({ defaultEmail = "" }: { defaultEmail?: string }) {
  const notice = useSession((s) => s.notice);
  const [email, setEmail] = React.useState(defaultEmail);
  const [password, setPassword] = React.useState("");
  const [errors, setErrors] = React.useState<{ email?: string; password?: string }>({});
  const [failure, setFailure] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);
  const passwordRef = React.useRef<React.ComponentRef<typeof TextInput>>(null);

  const submit = async () => {
    const e: typeof errors = {};
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) e.email = "Enter your email address.";
    if (!password) e.password = "Enter your password.";
    setErrors(e);
    setFailure(null);
    if (e.email || e.password) {
      haptic.warn();
      return;
    }
    setBusy(true);
    try {
      await session.signIn(email, password);
      haptic.success();
    } catch (err) {
      haptic.warn();
      setFailure(err instanceof ApiFailure ? err.message : messageOf(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen safeTop tab testID="sign-in" title="Sign in" lead="Use the email and password of your VIBHA account." gap={space[5]} footer={<Button label="Sign in" busy={busy} onPress={() => void submit()} testID="sign-in-submit" />}>
      {notice && NOTICE[notice] ? (
        <Tint>
          <T v="small" accessibilityLiveRegion="polite" testID="sign-in-notice">
            {NOTICE[notice]}
          </T>
        </Tint>
      ) : null}
      <Field label="Email" value={email} onChangeText={setEmail} error={errors.email} autoComplete="email" textContentType="username" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} returnKeyType="next" onSubmitEditing={() => passwordRef.current?.focus()} testID="sign-in-email" />
      <Field inputRef={passwordRef} label="Password" value={password} onChangeText={setPassword} error={errors.password} secret autoComplete="current-password" textContentType="password" autoCapitalize="none" returnKeyType="go" onSubmitEditing={() => void submit()} testID="sign-in-password" />
      {failure ? (
        <T v="small" tone="danger" accessibilityLiveRegion="polite" testID="sign-in-failure">
          {failure}
        </T>
      ) : null}
      <View>
        <Button kind="text" label="Forgot your password?" onPress={() => router.push("/forgot-password")} testID="sign-in-forgot" />
      </View>
    </Screen>
  );
}
