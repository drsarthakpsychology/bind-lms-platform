import { router } from "expo-router";
import { Check, Mail, Phone, User } from "lucide-react-native";
import * as React from "react";
import { openLink } from "@/lib/open";
import { Pressable, TextInput, View } from "react-native";

import type { RequestInvitationBody, RequestInvitationResult } from "@/api/contract";
import { ApiFailure, messageOf } from "@/api/errors";
import { api } from "@/auth";
import { Button, Chips, Label, Screen, Stone, T } from "@/ds";
import { BRAND } from "@/lib/brand";
import { haptic } from "@/lib/haptics";
import { Burst, Enter, Stamp } from "@/motion";
import { fonts, layout, space, useTheme } from "@/theme";
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
  const emailRef = React.useRef<React.ComponentRef<typeof TextInput>>(null);
  const phoneRef = React.useRef<React.ComponentRef<typeof TextInput>>(null);

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
      <Screen testID="request-sent" title="Request received" lead={`Thank you${name.trim() ? `, ${name.trim().split(" ")[0]}` : ""}. We read every request ourselves.`} gap={space[5]} footer={<Button kind="quiet" label="Back to the start" testID="request-done" onPress={() => router.replace("/welcome")} />}>
        <Sent email={email.trim()} />
      </Screen>
    );
  }

  return (
    <Screen testID="request" title="Request an invitation" lead="Tell us a little about you. We read every request ourselves and reply within a few days." gap={space[5]} footer={<Button label="Send request" busy={busy} onPress={() => void submit()} testID="request-submit" />}>
      <AuthField label="Your name" icon={User} value={name} onChangeText={setName} error={errors.name} autoComplete="name" textContentType="name" autoCapitalize="words" returnKeyType="next" onSubmitEditing={() => emailRef.current?.focus()} submitBehavior="submit" testID="request-name" />
      <AuthField label="Email" icon={Mail} value={email} onChangeText={setEmail} error={errors.email} autoComplete="email" textContentType="emailAddress" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} inputRef={emailRef} returnKeyType="next" onSubmitEditing={() => phoneRef.current?.focus()} submitBehavior="submit" testID="request-email" />
      <AuthField label="WhatsApp number (optional)" icon={Phone} value={phone} onChangeText={setPhone} error={errors.phone} keyboardType="phone-pad" autoComplete="tel" textContentType="telephoneNumber" inputRef={phoneRef} testID="request-phone" />
      <View style={{ gap: space[2] }}>
        <T v="small" tone="muted" style={{ fontFamily: fonts.semibold, paddingHorizontal: space[1] }}>
          You are a
        </T>
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
          <View style={{ width: 28, height: 28, borderRadius: 9, borderWidth: 2, borderColor: errors.agreed ? c.danger : agreed ? c.ink : c.fieldLine, backgroundColor: agreed ? c.ink : c.card, alignItems: "center", justifyContent: "center" }}>{agreed ? <Check size={17} color={c.bg} strokeWidth={3} /> : null}</View>
          <T v="small" style={{ flex: 1 }}>
            I agree to the{" "}
            <T v="small" tone="link" accessibilityRole="link" onPress={() => void openLink(BRAND.privacyUrl)}>
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
        <View style={{ backgroundColor: c.alertBg, borderRadius: layout.radius, padding: space[4] }}>
          <T v="small" tone="alert" accessibilityLiveRegion="polite" testID="request-failure">
            {failure}
          </T>
        </View>
      ) : null}
    </Screen>
  );
}

const NEXT = ["We read your request, usually within a few days.", "We write or call to answer your questions and tell you your exact fee.", "Once you join, you get a link to set your password and sign in here."] as const;

/** "Request received": a lime tick lands with a few sparks, then what happens next, in order. */
function Sent({ email }: { email: string }) {
  const c = useTheme();
  return (
    <>
      <View style={{ flexDirection: "row", alignItems: "center", gap: space[4] }}>
        <Stamp fire={1} rotate={-6}>
          <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: c.lime, alignItems: "center", justifyContent: "center" }}>
            <Check size={34} color={c.onLime} strokeWidth={3} />
            <Burst fire={1} reach={56} count={12} />
          </View>
        </Stamp>
        <Enter i={1} style={{ flex: 1, gap: space[1] }}>
          <T v="h2">It is with us</T>
          <T v="small" tone="muted">{`We will write to ${email}.`}</T>
        </Enter>
      </View>
      <View style={{ gap: space[3] }}>
        <Label>What happens next</Label>
        <Stone>
          <View style={{ gap: space[4] }}>
            {NEXT.map((line, i) => (
              <Enter key={line} i={i + 2} style={{ flexDirection: "row", gap: space[3], alignItems: "flex-start" }}>
                <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: c.ink, alignItems: "center", justifyContent: "center" }}>
                  <T v="small" tone="onInk" num maxFontSizeMultiplier={1.2}>
                    {i + 1}
                  </T>
                </View>
                <T style={{ flex: 1, paddingTop: 3 }}>{line}</T>
              </Enter>
            ))}
          </View>
        </Stone>
      </View>
    </>
  );
}
