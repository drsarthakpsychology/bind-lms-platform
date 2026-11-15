import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import * as React from "react";

import type { SetupCheckResult, SetupCompleteResult } from "@/api/contract";
import { ApiFailure, messageOf } from "@/api/errors";
import { api, session } from "@/auth";
import { Button, EmptyState, Field, Screen, Skeleton, T } from "@/ds";
import { haptic } from "@/lib/haptics";
import { space } from "@/theme";

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

  const submit = async () => {
    if (password.length < 12) return setError("Use at least 12 characters.");
    if (password !== again) return setError("The two passwords do not match.");
    setError(null);
    setBusy(true);
    try {
      const done = await api.post<SetupCompleteResult>("/auth/setup/complete", { token, password }, { auth: false });
      await session.signIn(done.email, password);
      haptic.success();
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
        <EmptyState mood="puzzled" title="This link cannot be used" body={check.isError ? "Could not check the link. Check your internet and open it again." : REASON[reason]} action={{ label: "Go to sign in", onPress: () => router.replace("/sign-in") }} />
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
    <Screen safeTop testID="setup" title="Choose your password" lead={check.data.email ? `For ${check.data.email}` : undefined} gap={space[5]} footer={<Button label="Save and sign in" busy={busy} onPress={() => void submit()} testID="setup-submit" />}>
      <Field label="New password" value={password} onChangeText={setPassword} secret autoComplete="new-password" textContentType="newPassword" autoCapitalize="none" hint="At least 12 characters." testID="setup-password" />
      <Field label="Type it again" value={again} onChangeText={setAgain} secret autoComplete="new-password" textContentType="newPassword" autoCapitalize="none" testID="setup-again" />
      {error ? (
        <T v="small" tone="danger" accessibilityLiveRegion="polite" testID="setup-error">
          {error}
        </T>
      ) : null}
    </Screen>
  );
}
