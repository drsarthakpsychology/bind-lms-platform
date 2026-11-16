import { router } from "expo-router";
import { Check, Mail, Phone, User } from "lucide-react-native";
import * as React from "react";
import { Linking, Pressable, View } from "react-native";
import Animated, { FadeInDown, useReducedMotion } from "react-native-reanimated";

import type { RequestInvitationBody, RequestInvitationResult } from "@/api/contract";
import { ApiFailure, messageOf } from "@/api/errors";
import { api } from "@/auth";
import { Button, Chips, Meme, Screen, T } from "@/ds";
import { BRAND } from "@/lib/brand";
import { haptic } from "@/lib/haptics";
import { Burst, Stamp } from "@/motion";
import { layout, space, useTheme } from "@/theme";
import { Star } from "@/visitor/Art";
import { AuthField } from "@/visitor/form";

type Status = RequestInvitationBody["status"];
const STATUS: { id: Status; name: string }[] = [
  { id: "student", name: "Student" },
  { id: "early_career", name: "Early career" },
  { id: "practitioner", name: "Practitioner" },
  { id: "other", name: "Other" },
];

export function validateRequest(v: { name: string; email: string; phone: string; agreed: boolean }): Partial<Record<"name" | "email" | "phone" | "agreed", string>> {
  const e: Partial<Record<"name" | "email" | "phone" | "agreed", string>> = {};
  if (v.name.trim().length < 2) e.name = "Enter your name.";
  if (!/^\S+@\S+\.\S+$/.test(v.email.trim())) e.email = "Enter a valid email address.";
  if (v.phone.trim() && !/^[6-9]\d{9}$/.test(v.phone.replace(/[\s-]/g, "").replace(/^\+?91/, ""))) e.phone = "Enter a 10-digit mobile number, or leave it empty.";
  if (!v.agreed) e.agreed = "Tick the box to carry on.";
  return e;
}

/** Request an invitation: a short form, one action, a clear "received" state. */
export function RequestScreen() {
  const c = useTheme();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [status, setStatus] = React.useState<Status>("student");
  const [message, setMessage] = React.useState("");
  const [agreed, setAgreed] = React.useState(false);
  const [errors, setErrors] = React.useState<ReturnType<typeof validateRequest>>({});
  const [failure, setFailure] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [sent, setSent] = React.useState(false);

  const submit = async () => {
    const e = validateRequest({ name, email, phone, agreed });
    setErrors(e);
    setFailure(null);
    if (Object.keys(e).length) {
      haptic.warn();
      return;
    }
    setBusy(true);
    try {
      const body: RequestInvitationBody = { name: name.trim(), email: email.trim().toLowerCase(), phone: phone.trim() || undefined, status, message: message.trim() || undefined, policyAccepted: true };
      await api.post<RequestInvitationResult>("/public/request-invitation", body, { auth: false });
      haptic.success();
      setSent(true);
    } catch (err) {
      setFailure(err instanceof ApiFailure ? err.message : messageOf(err));
    } finally {
      setBusy(false);
    }
  };

  if (sent) {
    return (
      <Screen safeTop tab testID="request-sent" footer={<Button kind="quiet" label="Back to the start" onPress={() => router.replace("/welcome")} />}>
        <Sent name={name.trim().split(" ")[0] ?? ""} email={email.trim()} />
      </Screen>
    );
  }

  return (
    <Screen safeTop tab testID="request" title="Request an invitation" lead="Tell us a little about you. We read every request ourselves and reply within a few days." gap={space[5]} footer={<Button label="Send request" busy={busy} onPress={() => void submit()} testID="request-submit" />}>
      <AuthField label="Your name" icon={User} value={name} onChangeText={setName} error={errors.name} autoComplete="name" textContentType="name" autoCapitalize="words" returnKeyType="next" testID="request-name" />
      <AuthField label="Email" icon={Mail} value={email} onChangeText={setEmail} error={errors.email} autoComplete="email" textContentType="emailAddress" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} testID="request-email" />
      <AuthField label="WhatsApp number (optional)" icon={Phone} value={phone} onChangeText={setPhone} error={errors.phone} keyboardType="phone-pad" autoComplete="tel" textContentType="telephoneNumber" testID="request-phone" />
      <View style={{ gap: space[2] }}>
        <T v="small">You are a</T>
        <Chips label="You are a" options={STATUS} value={status} onChange={setStatus} />
      </View>
      <AuthField label="Anything you want us to know (optional)" value={message} onChangeText={setMessage} area maxLength={1000} testID="request-message" />
      <View style={{ gap: space[1] }}>
        <Pressable
          testID="request-agree"
          accessibilityRole="checkbox"
          accessibilityState={{ checked: agreed }}
          accessibilityLabel="I agree to the privacy policy"
          onPress={() => {
            haptic.select();
            setAgreed((a) => !a);
          }}
          style={{ minHeight: layout.target, flexDirection: "row", alignItems: "center", gap: space[3] }}
        >
          <View style={{ width: 24, height: 24, borderRadius: 6, borderWidth: 1.5, borderColor: errors.agreed ? c.danger : agreed ? c.ink : c.cardLine, backgroundColor: agreed ? c.ink : "transparent", alignItems: "center", justifyContent: "center" }}>{agreed ? <Check size={16} color={c.bg} strokeWidth={3} /> : null}</View>
          <T v="small" style={{ flex: 1 }}>
            I agree to the{" "}
            <T v="small" tone="link" accessibilityRole="link" onPress={() => void Linking.openURL(BRAND.privacyUrl)}>
              privacy policy
            </T>
          </T>
        </Pressable>
        {errors.agreed ? (
          <T v="small" tone="danger">
            {errors.agreed}
          </T>
        ) : null}
      </View>
      {failure ? (
        <T v="small" tone="danger" accessibilityLiveRegion="polite" testID="request-failure">
          {failure}
        </T>
      ) : null}
    </Screen>
  );
}

/** "Request received": the kit's stamp lands a lime star with a tick, sparks fly, a happy meme cat pops in, the words rise in. */
function Sent({ name, email }: { name: string; email: string }) {
  const reduce = useReducedMotion();
  return (
    <View style={{ gap: space[5], paddingTop: space[5] }}>
      <View style={{ flexDirection: "row", alignItems: "flex-end", gap: space[4] }}>
        <Stamp fire={1} rotate={-8}>
          <View style={{ width: 110, height: 110, alignItems: "center", justifyContent: "center" }}>
            <Star size={110} fill="#cdf24b" style={{ position: "absolute" }} />
            <Check size={44} color="#111111" strokeWidth={4} />
            <Burst fire={1} reach={70} count={12} />
          </View>
        </Stamp>
        <Meme mood="win" size={104} delay={180} always />
      </View>
      <Animated.View entering={reduce ? undefined : FadeInDown.delay(250).duration(360)} style={{ gap: space[2] }}>
        <T v="display">Request received</T>
        <T v="reading" tone="muted">{`Thank you${name ? `, ${name}` : ""}. We read every request ourselves and will write to ${email} within a few days.`}</T>
      </Animated.View>
    </View>
  );
}
