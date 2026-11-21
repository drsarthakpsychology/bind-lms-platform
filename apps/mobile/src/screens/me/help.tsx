import { Stack } from "expo-router";
import { ChevronDown, FileText, Globe, Mail, ShieldCheck } from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withSpring } from "react-native-reanimated";

import { useConfig } from "@/api/queries";
import { FieldCard, HintText, Label, Row, Screen, Stone, T } from "@/ds";
import { BRAND } from "@/lib/brand";
import { config } from "@/lib/config";
import { openLink } from "@/lib/open";
import { Press, springs } from "@/motion";
import { space, useTheme } from "@/theme";
import { Group, IconPatch } from "./parts";

/**
 * Help and about. On the field: the fastest way to a person (WhatsApp).
 * On the layer: email, the questions people ask most (tap one to open its
 * answer), and what this app is: version, policy, terms, the website.
 */

function questions(changes: number): { id: string; q: string; a: string }[] {
  return [
    { id: "phone", q: "I got a new phone", a: `Sign in on the new phone. The old one signs out by itself. You can change phones ${changes === 2 ? "twice" : `${changes} times`} a month; after that, message us.` },
    { id: "pin", q: "I forgot my PIN", a: "Tap Forgot PIN on the lock screen, sign in with your password, and choose a new PIN." },
    { id: "password", q: "I forgot my password", a: "On the sign in screen tap Forgot your password. It opens WhatsApp with a message to us; we send you a link to choose a new one." },
    { id: "offline", q: "Does it work without internet?", a: "What you have opened before is saved on this phone, so you can read it again. Lecture video, posting and handing in work need the internet." },
    { id: "cert", q: "Where is my certificate?", a: "Me, then Certificates. Open one to download the PDF or share its public check page." },
  ];
}

/** One question on a stone. Tapping it opens the answer under it; the arrow turns. */
function Question({ q, a, id }: { q: string; a: string; id: string }) {
  const c = useTheme();
  const reduce = useReducedMotion();
  const [open, setOpen] = React.useState(false);
  const turn = useSharedValue(0);
  const arrow = useAnimatedStyle(() => ({ transform: [{ rotate: `${turn.value * 180}deg` }] }));
  const toggle = () => {
    const next = !open;
    setOpen(next);
    turn.set(reduce ? (next ? 1 : 0) : withSpring(next ? 1 : 0, springs.snappy));
  };
  return (
    <View style={{ gap: space[2] }}>
      <Press testID={`help-q-${id}`} accessibilityRole="button" accessibilityState={{ expanded: open }} accessibilityLabel={q} onPress={toggle} scale={0.98} innerStyle={{ minHeight: 56, borderRadius: 22, backgroundColor: c.card, paddingVertical: space[3], paddingHorizontal: space[4], flexDirection: "row", alignItems: "center", gap: space[3] }}>
        <T v="bodyStrong" style={{ flex: 1 }}>
          {q}
        </T>
        <Animated.View style={arrow}>
          <ChevronDown size={20} color={c.muted} />
        </Animated.View>
      </Press>
      {open ? <HintText testID={`help-a-${id}`}>{a}</HintText> : null}
    </View>
  );
}

export function HelpScreen() {
  const c = useTheme();
  const cfg = useConfig();
  const whatsapp = cfg.data?.support.whatsapp ?? BRAND.whatsapp;
  const email = cfg.data?.support.email ?? "hello@vibhapsychology.com";
  const privacy = cfg.data?.legal.privacyUrl ?? BRAND.privacyUrl;
  const terms = cfg.data?.legal.termsUrl ?? `${config.site}/policies/terms`;
  return (
    <Screen testID="help" title="We are here to help" lead="A person from the school answers, usually the same day." gap={space[5]} field={<FieldCard title="Message us on WhatsApp" meta="Sign in, video or payment trouble" action={{ label: "Open", onPress: () => void openLink(whatsapp), testID: "help-whatsapp" }} />}>
      <Stack.Screen options={{ title: "" }} />
      <Group>
        <Row testID="help-email" title="Email us" meta={email} icon={<IconPatch icon={Mail} area="learn" size={36} />} onPress={() => void openLink(`mailto:${email}`)} />
      </Group>
      <View style={{ gap: space[2] }}>
        <Label>Common questions</Label>
        {questions(cfg.data?.device.changesPerMonth ?? 2).map((x) => (
          <Question key={x.id} {...x} />
        ))}
      </View>
      <Group title="About" note={`${config.appName} ${config.appVersion} (${config.appBuild})`}>
        <Row testID="help-privacy" title="Privacy policy" icon={<ShieldCheck size={20} color={c.ink} />} onPress={() => void openLink(privacy)} />
        <Row testID="help-terms" title="Terms" icon={<FileText size={20} color={c.ink} />} onPress={() => void openLink(terms)} />
        <Row testID="help-site" title="The VIBHA website" meta={config.site.replace(/^https?:\/\//, "")} icon={<Globe size={20} color={c.ink} />} onPress={() => void openLink(config.site)} />
      </Group>
      <Stone quiet>
        <T v="small" tone="muted">
          VIBHA School of Psychology. Made for enrolled students. Your progress and numbers are private to you and your faculty.
        </T>
      </Stone>
    </Screen>
  );
}
