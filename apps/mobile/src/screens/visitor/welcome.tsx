import { router } from "expo-router";
import { ArrowRight } from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";

import { useConfig } from "@/api/queries";
import { Button, Screen, T, Wordmark } from "@/ds";
import { BRAND } from "@/lib/brand";
import { space, useTheme } from "@/theme";

/** Welcome: what VIBHA is, who it is for now, and the one thing a visitor can do. */
export function WelcomeScreen() {
  const c = useTheme();
  const cfg = useConfig();
  // The server's line wins once it has answered (null hides it); the built-in line shows until then.
  const cohortLine = cfg.data ? (cfg.data.cohortLine === undefined ? BRAND.cohortLine : cfg.data.cohortLine) : BRAND.cohortLine;
  return (
    <Screen
      safeTop
      tab
      testID="welcome"
      footer={
        <>
          <Button label="Request an invitation" icon={<ArrowRight size={20} color={c.onPrimary} />} onPress={() => router.push("/request")} testID="welcome-request" />
          <Button kind="text" full label="I have an account. Sign in" onPress={() => router.push("/sign-in")} testID="welcome-sign-in" />
        </>
      }
    >
      <Wordmark size={26} />
      <View style={{ gap: space[4], paddingTop: space[5] }}>
        {cohortLine ? (
          <View style={{ flexDirection: "row", alignItems: "center", gap: space[2] }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: c.brand }} />
            <T v="small" tone="muted" style={{ flex: 1 }}>
              {cohortLine}
            </T>
          </View>
        ) : null}
        <T v="display" accessibilityLabel={BRAND.headline.join(" ")}>
          {BRAND.headline[0]}
          {"\n"}
          {BRAND.headline[1]}
          {"\n"}
          <T v="display" tone="link">
            {BRAND.headline[2]}
          </T>
        </T>
        <T v="reading" tone="muted">
          {BRAND.lede}
        </T>
      </View>
    </Screen>
  );
}
