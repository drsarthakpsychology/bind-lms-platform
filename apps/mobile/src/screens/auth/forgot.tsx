import { MessageCircle } from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";

import { Button, Label, Screen, Stone, T } from "@/ds";
import { BRAND } from "@/lib/brand";
import { openLink } from "@/lib/open";
import { Enter } from "@/motion";
import { space, useTheme } from "@/theme";

const STEPS = ["Message us on WhatsApp.", "We send a new setup link to your email.", "Open the link and choose a new password. Then sign in here."] as const;

/** Forgot password: the school sends a fresh setup link over WhatsApp, as on the website. */
export function ForgotPasswordScreen() {
  const c = useTheme();
  return (
    <Screen
      testID="forgot"
      title="Forgot your password?"
      lead="We will send you a fresh link. It takes three steps."
      gap={space[5]}
      footer={<Button label="Message us on WhatsApp" icon={<MessageCircle size={20} color={c.onPrimary} strokeWidth={2} />} onPress={() => void openLink(`${BRAND.whatsapp}?text=${encodeURIComponent("Hi, I forgot my VIBHA password. Please send me a new setup link.")}`)} testID="forgot-whatsapp" />}
    >
      <View style={{ gap: space[3] }}>
        <Label>How it works</Label>
        <Stone>
          <View style={{ gap: space[4] }}>
            {STEPS.map((s, i) => (
              <Enter key={s} i={i} style={{ flexDirection: "row", gap: space[3], alignItems: "flex-start" }}>
                <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: c.ink, alignItems: "center", justifyContent: "center" }}>
                  <T v="small" tone="onInk" num maxFontSizeMultiplier={1.2}>
                    {i + 1}
                  </T>
                </View>
                <T style={{ flex: 1, paddingTop: 3 }}>{s}</T>
              </Enter>
            ))}
          </View>
        </Stone>
      </View>
      <Enter i={4}>
        <Stone quiet>
          <T v="bodyStrong">Forgot only your PIN?</T>
          <T v="small" tone="muted" style={{ marginTop: space[1] }}>
            Tap Forgot PIN on the lock screen. You will sign in with your password and choose a new PIN.
          </T>
        </Stone>
      </Enter>
    </Screen>
  );
}
