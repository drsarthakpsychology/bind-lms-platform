import { MessageCircle } from "lucide-react-native";
import * as React from "react";
import { Linking } from "react-native";

import { Button, Screen, Section, T } from "@/ds";
import { BRAND } from "@/lib/brand";
import { useTheme } from "@/theme";

/** Forgot password: the school sends a fresh setup link over WhatsApp, as on the website. */
export function ForgotPasswordScreen() {
  const c = useTheme();
  return (
    <Screen testID="forgot" title="Forgot your password?" footer={<Button label="Message us on WhatsApp" icon={<MessageCircle size={20} color={c.onPrimary} />} onPress={() => void Linking.openURL(`${BRAND.whatsapp}?text=${encodeURIComponent("Hi, I forgot my VIBHA password. Please send me a new setup link.")}`)} testID="forgot-whatsapp" />}>
      <T v="reading" tone="muted">
        Message us and we will send a new setup link to your email. Open the link on this phone and choose a new password here in the app.
      </T>
      <Section title="Forgot only your PIN?">
        <T tone="muted">Tap Forgot PIN on the lock screen. You will sign in with your password and choose a new PIN.</T>
      </Section>
    </Screen>
  );
}
