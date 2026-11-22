import { useQueryClient } from "@tanstack/react-query";
import { router, Stack } from "expo-router";
import { Bell, CircleHelp, FileText, LogOut, Moon, ShieldCheck, Smartphone, Trash2, Type, Vibrate } from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";

import type { DeletionRequestResult, Me, Settings } from "@/api/contract";
import { messageOf } from "@/api/errors";
import { keys, useConfig, useMe, useSettings } from "@/api/queries";
import { api, session } from "@/auth";
import { Button, Chips, Field, FieldCard, HoldButton, Label, Row, RowsSkeleton, Screen, Sheet, Stone, SwitchRow, T } from "@/ds";
import { toast } from "@/ds/toast";
import { config } from "@/lib/config";
import { haptic } from "@/lib/haptics";
import { openLink } from "@/lib/open";
import { TextSizeRow } from "@/lib/reading";
import { settingsStore, updateSettings } from "@/lib/settings";
import { PermissionsSection } from "@/screens/me/permissions";
import { PhoneSecurity } from "@/screens/me/security";
import { space, useTheme } from "@/theme";
import { Group, IconPatch, Load } from "./parts";

/**
 * Settings, in the Layers look. On the field: who is signed in, with Edit.
 * On the layer, groups on stones:
 *   Look            light or dark, text size, colour-blind colours
 *   Feel            vibration strength, funny stickers
 *   This phone      the phone, PIN, fingerprint or face
 *   Notifications   opens "What you get"; the phone's permissions
 *   Your account    what the school holds (from the server)
 *   Privacy         policy, terms, ask to delete
 *   Help and about  help, the version
 *   Sign out        asks first
 * Everything kept on the phone draws at once; only "Your account" waits for
 * the server, and a failed load never hides Sign out.
 */

const STRENGTHS = [
  { id: "off" as const, name: "Off" },
  { id: "light" as const, name: "Light" },
  { id: "medium" as const, name: "Medium" },
  { id: "strong" as const, name: "Strong" },
];
const THEMES = [
  { id: "system" as const, name: "Match phone" },
  { id: "light" as const, name: "Light" },
  { id: "dark" as const, name: "Dark" },
];

/** A label with an icon, over chips on a stone. */
function ChoiceStone({ title, icon, children, testID }: { title: string; icon: React.ComponentProps<typeof IconPatch>["icon"]; children: React.ReactNode; testID?: string }) {
  return (
    <Stone testID={testID}>
      <View style={{ gap: space[3] }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: space[3] }}>
          <IconPatch icon={icon} area="me" size={36} />
          <T v="bodyStrong">{title}</T>
        </View>
        {children}
      </View>
    </Stone>
  );
}

/** What is wrong with a typed WhatsApp number, or null when it can be sent. */
export function numberProblem(value: string): string | null {
  const digits = value.replace(/\D/g, "");
  if (!digits.length) return "Enter your WhatsApp number.";
  if (digits.length < 10) return "Enter the full number, 10 digits.";
  if (digits.length > 13) return "That number is too long.";
  return null;
}

/** Change the WhatsApp number the school holds. The name is changed by the school. */
function EditProfile({ open, onClose, number }: { open: boolean; onClose: () => void; number: string | null }) {
  const qc = useQueryClient();
  const [value, setValue] = React.useState(number ?? "");
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);
  React.useEffect(() => {
    if (open) {
      setValue(number ?? "");
      setError(null);
    }
  }, [open, number]);
  const digits = value.replace(/\D/g, "");
  const save = async () => {
    const problem = numberProblem(value);
    if (problem) return setError(problem);
    setBusy(true);
    setError(null);
    try {
      const me = await api.patch<Me>("/me", { mobileNumber: value.trim() });
      qc.setQueryData<Settings>(keys.settings, (s) => (s ? { ...s, account: { ...s.account, mobileNumber: me.mobileNumber } } : s));
      void qc.invalidateQueries({ queryKey: keys.me });
      haptic.success();
      toast.show("Saved");
      onClose();
    } catch (e) {
      haptic.warn();
      setError(messageOf(e));
    } finally {
      setBusy(false);
    }
  };
  return (
    <Sheet open={open} onClose={onClose} title="Your WhatsApp number" testID="profile-sheet">
      <View style={{ gap: space[4] }}>
        <T tone="muted">We use it for class updates and to help you sign in. Only the school sees it.</T>
        <Field label="WhatsApp number" value={value} onChangeText={setValue} keyboardType="phone-pad" autoComplete="tel" maxLength={16} error={error ?? undefined} returnKeyType="done" onSubmitEditing={() => void save()} testID="profile-number" />
        <Button label="Save" busy={busy} needsServer disabled={!digits.length || value.trim() === (number ?? "")} onPress={() => void save()} testID="profile-save" />
        <T v="small" tone="muted">
          To change your name or email, message us from Help.
        </T>
      </View>
    </Sheet>
  );
}

function DeleteAccount() {
  const c = useTheme();
  const [open, setOpen] = React.useState(false);
  const [reason, setReason] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const send = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await api.post<DeletionRequestResult>("/me/deletion-request", { reason: reason.trim() || undefined });
      haptic.success();
      setOpen(false);
      toast.show("Request sent. We will write to you within 7 days.");
    } catch (e) {
      toast.show(messageOf(e));
    } finally {
      setBusy(false);
    }
  };
  const close = React.useCallback(() => setOpen(false), []);
  return (
    <>
      <Row testID="delete-account" title="Ask to delete my account" icon={<Trash2 size={20} color={c.danger} />} danger onPress={() => setOpen(true)} chevron={false} />
      <Sheet open={open} onClose={close} title="Delete your account?">
        <View style={{ gap: space[4] }}>
          <T tone="muted">We delete your account, progress and certificates after checking it is you. Issued certificates can no longer be verified. This cannot be undone.</T>
          <Field label="Anything you want to tell us (optional)" value={reason} onChangeText={setReason} area maxLength={1000} />
          <HoldButton key={open ? "open" : "shut"} label={busy ? "Sending" : "Hold to send the request"} tapLabel="Send the request" disabled={busy} onConfirm={() => void send()} testID="delete-send" />
          <Button kind="text" full label="Keep my account" onPress={close} />
        </View>
      </Sheet>
    </>
  );
}

/** Sign out, after one clear question. */
function SignOut() {
  const c = useTheme();
  const [open, setOpen] = React.useState(false);
  const [leaving, setLeaving] = React.useState(false);
  const close = React.useCallback(() => setOpen(false), []);
  return (
    <>
      <Group note="Your progress stays saved.">
        <Row testID="sign-out" title="Sign out" icon={<LogOut size={20} color={c.danger} />} danger chevron={false} onPress={() => setOpen(true)} />
      </Group>
      <Sheet open={open} onClose={close} title="Sign out of VIBHA?" testID="sign-out-sheet">
        <View style={{ gap: space[4] }}>
          <T tone="muted">You will need your email and password to come back in. Your progress stays saved.</T>
          <Button
            kind="ink"
            label={leaving ? "Signing out" : "Sign out"}
            busy={leaving}
            testID="sign-out-confirm"
            onPress={() => {
              setLeaving(true);
              void session.signOut();
            }}
          />
          <Button kind="text" full label="Stay signed in" onPress={close} testID="sign-out-cancel" />
        </View>
      </Sheet>
    </>
  );
}

export function SettingsScreen() {
  const c = useTheme();
  const q = useSettings();
  const me = useMe().data;
  const cfg = useConfig().data;
  const theme = settingsStore.use((s) => s.theme);
  const haptics = settingsStore.use((s) => s.haptics);
  const reactions = settingsStore.use((s) => s.reactions);
  const colourBlind = settingsStore.use((s) => s.colourBlind ?? false);
  const [editing, setEditing] = React.useState(false);
  const s = q.data;
  const name = s?.account.name ?? me?.name ?? null;
  const email = s?.account.email ?? me?.email ?? null;
  const number = s?.account.mobileNumber ?? me?.mobileNumber ?? null;
  const legal = s?.legal ?? cfg?.legal;
  const prefs = s?.notifications;
  const noteLine = prefs ? (prefs.push ? [prefs.messages ? "messages" : null, prefs.doubtReplies ? "doubt answers" : null, prefs.achievements ? "badges" : null].filter(Boolean).join(", ").replace(/^./, (x) => x.toUpperCase()) || "On" : "Off on this phone") : "Messages, doubt answers, badges, a reminder";
  return (
    <Screen
      testID="settings"
      title="Settings"
      gap={space[5]}
      onRefresh={() => void q.refetch()}
      refreshing={q.isRefetching}
      field={<FieldCard testID="settings-profile" title={name ?? email ?? "Your account"} meta={[me?.rollNumber ?? s?.account.rollNumber, name ? email : null].filter(Boolean).join(" · ") || undefined} action={{ label: "Edit", onPress: () => setEditing(true), testID: "profile-edit" }} />}
    >
      <Stack.Screen options={{ title: "" }} />

      <View style={{ gap: space[3] }}>
        <Label>Look</Label>
        <ChoiceStone title="Appearance" icon={Moon} testID="pref-theme">
          <Chips label="Appearance" options={THEMES} value={theme} onChange={(t) => updateSettings({ theme: t })} />
        </ChoiceStone>
        <Group>
          <TextSizeRow icon={<IconPatch icon={Type} area="me" size={36} />} />
          <SwitchRow testID="pref-colour-blind" title="Colour-blind friendly colours" meta="Right shows blue, wrong shows orange. Your choice is saved on this phone; the colours follow in the next update." value={colourBlind} onChange={(v) => updateSettings({ colourBlind: v })} />
        </Group>
      </View>

      <View style={{ gap: space[3] }}>
        <Label>Feel</Label>
        <ChoiceStone title="Vibration" icon={Vibrate} testID="pref-haptics">
          <Chips
            label="Vibration"
            options={STRENGTHS}
            value={haptics}
            onChange={(v) => {
              updateSettings({ haptics: v });
              haptic.tap();
            }}
          />
        </ChoiceStone>
        <Group>
          <SwitchRow testID="pref-reactions" title="Funny stickers" meta="A meme picture and a cheeky line after some answers and on some empty screens. Off unless you turn it on. This phone only." value={reactions} onChange={(v) => updateSettings({ reactions: v })} />
        </Group>
      </View>

      <Group title="This phone">
        <Row title={s?.device.current?.name ?? "This phone"} icon={<IconPatch icon={Smartphone} area="me" size={36} />} meta={[s?.device.enforced ? "VIBHA works on one phone at a time. Signing in on another phone signs this one out." : null, s && s.device.limit !== null ? `Phone changes this month: ${s.device.changesUsed} of ${s.device.limit}.` : null].filter(Boolean).join(" ") || undefined} />
        <PhoneSecurity />
      </Group>

      <Group title="Notifications">
        <Row testID="settings-notifications" title="What you get" meta={noteLine} icon={<IconPatch icon={Bell} area="me" size={36} />} onPress={() => router.push("/notification-settings")} />
      </Group>
      <PermissionsSection />

      <View style={{ gap: space[2] }}>
        <Label>Your account</Label>
        <Load q={q} what="your account" skeleton={<RowsSkeleton rows={4} />}>
          {(d) => (
            <Group>
              <Row title="Name" trailing={d.account.name ?? "Not set"} />
              <Row title="Email" meta={d.account.email ?? "Not set"} />
              {d.account.rollNumber ? <Row title="Roll number" trailing={d.account.rollNumber} /> : null}
              <Row testID="settings-number" title="WhatsApp number" trailing={d.account.mobileNumber ?? "Not given"} onPress={() => setEditing(true)} accessibilityLabel={`WhatsApp number, ${d.account.mobileNumber ?? "not given"}. Change it`} />
              <Row title="Account" trailing={d.account.roleLabel} />
            </Group>
          )}
        </Load>
      </View>

      <Group title="Privacy">
        {legal ? <Row testID="settings-privacy" title="Privacy policy" icon={<ShieldCheck size={20} color={c.ink} />} onPress={() => void openLink(legal.privacyUrl)} /> : null}
        {legal ? <Row testID="settings-terms" title="Terms" icon={<FileText size={20} color={c.ink} />} onPress={() => void openLink(legal.termsUrl)} /> : null}
        <DeleteAccount />
      </Group>

      <Group title="Help and about" note={`${config.appName} ${config.appVersion}`}>
        <Row testID="settings-help" title="Help" meta="Message us on WhatsApp" icon={<CircleHelp size={20} color={c.ink} />} onPress={() => router.push("/help")} />
      </Group>

      <SignOut />
      <EditProfile open={editing} onClose={() => setEditing(false)} number={number} />
    </Screen>
  );
}
