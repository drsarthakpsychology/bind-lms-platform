import { MessageCircle } from "lucide-react-native";
import * as React from "react";
import { Linking, Text, View } from "react-native";
import Animated, { FadeInDown, useReducedMotion } from "react-native-reanimated";

import { Button, Screen, Section, T } from "@/ds";
import { BRAND } from "@/lib/brand";
import { fonts, space, useTheme } from "@/theme";
import { Icon, Star } from "@/visitor/Art";

const STEPS = ["Message us on WhatsApp.", "We send a new setup link to your email.", "Open the link on this phone and choose a new password here in the app."] as const;

/** Forgot password: the school sends a fresh setup link over WhatsApp, as on the website. */
export function ForgotPasswordScreen() {
  const c = useTheme();
  const reduce = useReducedMotion();
  const enter = (i: number) => (reduce ? undefined : FadeInDown.delay(80 + i * 70).duration(320));
  return (
    <Screen
      testID="forgot"
      footer={<Button label="Message us on WhatsApp" icon={<MessageCircle size={20} color={c.onPrimary} />} onPress={() => void Linking.openURL(`${BRAND.whatsapp}?text=${encodeURIComponent("Hi, I forgot my VIBHA password. Please send me a new setup link.")}`)} testID="forgot-whatsapp" />}
    >
      <Animated.View entering={enter(0)} style={{ gap: space[4] }}>
        <View style={{ width: 72, height: 72, alignItems: "center", justifyContent: "center" }}>
          <Star size={72} fill="#cdf24b" style={{ position: "absolute" }} />
          <Icon name="chat" size={34} fill="#ffffff" />
        </View>
        <T v="h1">Forgot your password?</T>
      </Animated.View>
      <View style={{ gap: space[4] }}>
        {STEPS.map((s, i) => (
          <Animated.View key={s} entering={enter(i + 1)} style={{ flexDirection: "row", gap: space[4], alignItems: "flex-start" }}>
            <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: c.dark ? "#cdf24b" : "#111111", alignItems: "center", justifyContent: "center" }}>
              <Text allowFontScaling={false} style={{ fontFamily: fonts.pixelDigits, fontSize: 15, color: c.dark ? "#111111" : "#cdf24b" }}>
                {i + 1}
              </Text>
            </View>
            <T v="reading" style={{ flex: 1, paddingTop: 2 }}>
              {s}
            </T>
          </Animated.View>
        ))}
      </View>
      <Animated.View entering={enter(4)}>
        <Section title="Forgot only your PIN?">
          <T tone="muted">Tap Forgot PIN on the lock screen. You will sign in with your password and choose a new PIN.</T>
        </Section>
      </Animated.View>
    </Screen>
  );
}
