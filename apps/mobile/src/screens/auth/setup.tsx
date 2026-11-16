import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { Lock } from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withSpring } from "react-native-reanimated";

import type { SetupCheckResult, SetupCompleteResult } from "@/api/contract";
import { ApiFailure, messageOf, reasonOf } from "@/api/errors";
import { api, session } from "@/auth";
import { EmptyState, Screen, Skeleton, T } from "@/ds";
import { haptic } from "@/lib/haptics";
import { space, useTheme } from "@/theme";
import { AuthField, SubmitButton } from "@/visitor/form";

const REASON: Record<string, string> = {
  used: "This setup link was already used. Sign in with the password you chose, or ask us for a new link.",
  expired: "This setup link has run out. Ask us for a new one on WhatsApp.",
  unknown: "This setup link is not valid. Open the newest link from your email.",
};

/** Opened from the setup link in the welcome email: choose a password, then straight in. */
export function SetupScreen({ token }: { token: string }) {
  const check = useQuery({ queryKey: ["setup", token], queryFn: () => api.post<SetupCheckResult>("/auth/setup/check", { token }, { auth: false }), enabled: token.length > 0, gcTime: 0, staleTime: 0 });
  const [password, setPassword] = React.useState("");
  const [again, setAgain] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [done, setDone] = React.useState(false);

  const submit = async () => {
    if (password.length < 12) return setError("Use at least 12 characters.");
    if (password !== again) return setError("The two passwords do not match.");
    setError(null);
    setBusy(true);
    try {
      const done = await api.post<SetupCompleteResult>("/auth/setup/complete", { token, password }, { auth: false });
      await session.signIn(done.email, password);
      haptic.success();
      setDone(true);
      router.replace("/");
    } catch (e) {
      haptic.warn();
      setError(e instanceof ApiFailure ? e.message : messageOf(e));
    } finally {
      setBusy(false);
    }
  };

  if (!token || check.isError || (check.data && !check.data.valid)) {
    const reason = !token ? "unknown" : (check.data?.reason ?? "unknown");
    return (
      <Screen safeTop testID="setup-invalid">
        <EmptyState mood="puzzled" title="This link cannot be used" body={check.isError ? `Could not check the link. ${reasonOf(check.error)}` : REASON[reason]} action={{ label: "Go to sign in", onPress: () => router.replace("/sign-in") }} />
      </Screen>
    );
  }
  if (!check.data) {
    return (
      <Screen safeTop testID="setup-loading">
        <Skeleton w="70%" h={34} />
        <Skeleton h={52} r={12} />
        <Skeleton h={52} r={12} />
      </Screen>
    );
  }
  return (
    <Screen safeTop testID="setup" title="Choose your password" lead={check.data.email ? `For ${check.data.email}` : undefined} gap={space[5]}>
      <AuthField label="New password" icon={Lock} value={password} onChangeText={setPassword} secret autoComplete="new-password" textContentType="newPassword" autoCapitalize="none" testID="setup-password" />
      <Strength length={password.length} />
      <AuthField label="Type it again" icon={Lock} value={again} onChangeText={setAgain} secret autoComplete="new-password" textContentType="newPassword" autoCapitalize="none" returnKeyType="go" onSubmitEditing={() => void submit()} error={again.length >= password.length && again.length > 0 && again !== password ? "The two passwords do not match." : null} testID="setup-again" />
      {error ? (
        <T v="small" tone="danger" accessibilityLiveRegion="polite" testID="setup-error">
          {error}
        </T>
      ) : null}
      <SubmitButton label="Save and sign in" busyLabel="Saving" doneLabel="Saved" state={busy ? "busy" : done ? "done" : "idle"} onPress={() => void submit()} testID="setup-submit" />
    </Screen>
  );
}

/** Four bars that fill as the password grows towards 12 characters (the minimum), and a plain line. */
function Strength({ length }: { length: number }) {
  const c = useTheme();
  const steps = [3, 6, 9, 12];
  return (
    <View accessible accessibilityLabel={length >= 12 ? "Long enough" : `${12 - length} more characters needed`} style={{ gap: space[2], marginTop: -space[2] }}>
      <View style={{ flexDirection: "row", gap: 6 }}>
        {steps.map((n) => (
          <Bar key={n} on={length >= n} full={length >= 12} track={c.tint} />
        ))}
      </View>
      <T v="small" tone="muted">
        {length >= 12 ? "Long enough." : length === 0 ? "At least 12 characters." : `${12 - length} more to go.`}
      </T>
    </View>
  );
}

function Bar({ on, full, track }: { on: boolean; full: boolean; track: string }) {
  const reduce = useReducedMotion();
  const v = useSharedValue(on ? 1 : 0);
  React.useEffect(() => {
    v.set(reduce ? (on ? 1 : 0) : withSpring(on ? 1 : 0, { damping: 18, stiffness: 260 }));
  }, [on, reduce, v]);
  const anim = useAnimatedStyle(() => ({ transform: [{ scaleX: v.value }] }));
  return (
    <View style={{ flex: 1, height: 6, borderRadius: 3, backgroundColor: track, overflow: "hidden" }}>
      <Animated.View style={[{ flex: 1, borderRadius: 3, backgroundColor: full ? "#cdf24b" : "#1d44d8", transformOrigin: "left" }, anim]} />
    </View>
  );
}
