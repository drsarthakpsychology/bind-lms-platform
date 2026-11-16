import { KeyRound, Plus } from "lucide-react-native";
import { openLink } from "@/lib/open";
import * as React from "react";
import { Share, View } from "react-native";

import { Button, EmptyState, Field, Row, RowList, RowsSkeleton, Screen, Sheet, T } from "@/ds";
import { toast } from "@/ds/toast";
import { config } from "@/lib/config";
import { haptic } from "@/lib/haptics";
import { space, useTheme } from "@/theme";
import { adminCalls, useAdminAction, useRefreshAdmin, useSystem } from "../api";
import type { NewSupportKey, SupportKeyView } from "../extra";
import { ago, day } from "../format";
import { announce, Block, ConfirmSheet, Loaded, Meter, Notice, Quiet, SmallButton, Status, SwipeRow } from "../kit";
import { useAdminRole, VIEW_ONLY_LINE } from "../role";

export const KEY_LABEL_MAX = 60;
/** The website's labelProblem (src/lib/auth/support-keys.ts). Pure, so it is tested. */
export function keyLabelProblem(label: string): string | null {
  const l = label.trim();
  if (!l) return "Give the key a name, for example who uses it.";
  if (l.length > KEY_LABEL_MAX) return `Keep the name under ${KEY_LABEL_MAX} characters.`;
  return null;
}

/** The full key, shown once with Copy. Closing it means it is gone for good. */
function ShowOnce({ k, onClose }: { k: NewSupportKey | null; onClose: () => void }) {
  const c = useTheme();
  // The phone's share sheet has Copy; the key is also selectable on screen.
  const copy = async () => {
    if (!k) return;
    try {
      await Share.share({ message: k.plain });
      haptic.select();
    } catch {
      toast.show("Could not open sharing. Press and hold the key to copy it.");
    }
  };
  return (
    <Sheet open={!!k} onClose={onClose} title="Your new key" testID="key-once">
      {k ? (
        <View style={{ gap: space[4] }}>
          <Notice tone="warn">This is the only time it is shown. Copy it now and keep it somewhere safe.</Notice>
          <View style={{ padding: space[4], borderRadius: 10, backgroundColor: c.tint }}>
            <T v="bodyStrong" selectable num testID="key-plain">
              {k.plain}
            </T>
          </View>
          <Button label="Copy or share the key" onPress={() => void copy()} testID="key-copy" />
          <Button kind="text" full label="I have saved it" onPress={onClose} testID="key-done" />
        </View>
      ) : null}
    </Sheet>
  );
}

function KeyLine({ k }: { k: SupportKeyView }) {
  const c = useTheme();
  const live = !k.revokedAt;
  return (
    <Row
      testID={`key-${k.id}`}
      icon={<KeyRound size={20} color={live ? c.ink : c.muted} />}
      title={`${k.label} · ending ${k.last4}`}
      meta={live ? [`Made ${day(k.createdAt, true)}${k.createdByEmail ? ` by ${k.createdByEmail}` : ""}`, k.lastUsedAt ? `used ${ago(k.lastUsedAt).toLowerCase()}` : "never used"].join(" · ") : `Revoked ${day(k.revokedAt, true)}${k.revokedByEmail ? ` by ${k.revokedByEmail}` : ""}`}
      trailing={<Status tone={live ? "ok" : "quiet"}>{live ? "Live" : "Revoked"}</Status>}
    />
  );
}

/**
 * System: support keys (sign in to a student's account to help them), and how
 * full things are. Keys can be made, rotated and revoked by a Super Admin.
 */
export function AdminSystemScreen() {
  const q = useSystem();
  const { canWrite } = useAdminRole();
  const { run, busy } = useAdminAction();
  const { refresh, refreshing } = useRefreshAdmin();
  const [naming, setNaming] = React.useState(false);
  const [label, setLabel] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [once, setOnce] = React.useState<NewSupportKey | null>(null);
  const [ask, setAsk] = React.useState<{ k: SupportKeyView; what: "rotate" | "revoke" } | null>(null);
  const [legacy, setLegacy] = React.useState(false);

  const make = async () => {
    const p = keyLabelProblem(label);
    if (p) return setError(p);
    setError(null);
    const r = await run("support-key", () => adminCalls.makeKey(label.trim()));
    if (r?.plain) {
      setNaming(false);
      setLabel("");
      setOnce(r);
      announce("New key made. It is shown once.");
    }
  };
  return (
    <Screen title="System" testID="admin-system" gap={space[5]} onRefresh={refresh} refreshing={refreshing}>
      <Loaded q={q} soon what="system" skeleton={<RowsSkeleton rows={4} />}>
        {(d) => {
          const liveKeys = d.keys.filter((k) => !k.revokedAt);
          return (
            <>
              {!d.ready ? <Notice tone="warn">Support keys need a database step first. Ask the owner to paste it.</Notice> : null}
              <Block title="Support keys" count={liveKeys.length || undefined} action={canWrite && liveKeys.length < d.maxLive ? { label: "Make a key", onPress: () => setNaming(true), testID: "key-make" } : undefined}>
                <T v="small" tone="muted">
                  A key lets a helper sign in to a student's account to sort out a problem. Give each helper their own.
                </T>
                {d.keys.length ? (
                  <RowList>
                    {d.keys.map((k) => (
                      <SwipeRow key={k.id} enabled={canWrite && !k.revokedAt} action={{ label: "Revoke", danger: true, onPress: () => setAsk({ k, what: "revoke" }) }} testID={`swipe-key-${k.id}`}>
                        <View>
                          <KeyLine k={k} />
                          {canWrite && !k.revokedAt ? (
                            <View style={{ flexDirection: "row", gap: space[2], paddingBottom: space[3] }}>
                              <SmallButton label="Rotate" onPress={() => setAsk({ k, what: "rotate" })} testID={`key-rotate-${k.id}`} />
                              <SmallButton label="Revoke" danger onPress={() => setAsk({ k, what: "revoke" })} testID={`key-revoke-${k.id}`} />
                            </View>
                          ) : null}
                        </View>
                      </SwipeRow>
                    ))}
                  </RowList>
                ) : (
                  <EmptyState mood="empty" title="No keys yet" body={canWrite ? "Make one for each person who helps students sign in." : undefined} />
                )}
                {d.legacyKeyOn ? (
                  <Notice tone="warn" action={canWrite ? <SmallButton label="Turn it off" danger onPress={() => setLegacy(true)} testID="key-legacy" /> : undefined}>
                    The older shared key still works. Turn it off once everyone has their own.
                  </Notice>
                ) : null}
                {!canWrite ? <Quiet>{VIEW_ONLY_LINE}</Quiet> : null}
              </Block>
              {d.uses.length ? (
                <Block title="Recent sign-ins with a key">
                  <RowList>
                    {d.uses.slice(0, 5).map((u, i) => (
                      <Row key={`${u.at}-${i}`} title={u.email} meta={ago(u.at)} />
                    ))}
                  </RowList>
                </Block>
              ) : null}
              {d.usage.length ? (
                <Block title="How full things are">
                  <View style={{ gap: space[3] }}>
                    {d.usage.map((u) => (
                      <View key={u.label} style={{ gap: space[1] }}>
                        <Row title={u.label} trailing={u.value} />
                        {u.pct !== null ? <Meter pct={u.pct} tone={u.pct > 80 ? "warn" : "info"} /> : null}
                      </View>
                    ))}
                  </View>
                </Block>
              ) : null}
              <Button kind="text" full label="Admins and switches on the website" onPress={() => void openLink(`${config.site}/admin/management`)} />
            </>
          );
        }}
      </Loaded>
      <Sheet open={naming} onClose={() => setNaming(false)} title="Make a support key" testID="key-name-sheet">
        <View style={{ gap: space[4] }}>
          <Field label="Who uses it" value={label} onChangeText={setLabel} error={error} maxLength={KEY_LABEL_MAX} hint="For example: Kavya's laptop" testID="key-label" />
          <Button label="Make the key" icon={<Plus size={20} />} busy={busy === "support-key"} onPress={() => void make()} testID="key-create" />
        </View>
      </Sheet>
      <ConfirmSheet
        open={!!ask}
        onClose={() => setAsk(null)}
        title={ask?.what === "rotate" ? `Rotate ${ask.k.label}?` : `Revoke ${ask?.k.label ?? "this key"}?`}
        body={ask?.what === "rotate" ? "The old key stops working now and a new one with the same name is shown once." : "It stops working at once. It stays in the list, greyed out, for the record."}
        confirm={ask?.what === "rotate" ? "Rotate" : "Revoke"}
        danger
        busy={busy === "support-key"}
        onConfirm={() => {
          const a = ask;
          if (!a) return;
          void run("support-key", () => (a.what === "rotate" ? adminCalls.rotateKey(a.k.id) : adminCalls.revokeKey(a.k.id).then(() => null)), { done: a.what === "revoke" ? "Revoked" : undefined }).then((r) => {
            setAsk(null);
            if (r && "plain" in r && r.plain) setOnce(r);
          });
        }}
        testID="confirm-key"
      />
      <ConfirmSheet open={legacy} onClose={() => setLegacy(false)} title="Turn off the older key?" body="Anyone still using it will need their own named key." confirm="Turn it off" danger busy={busy === "support-key"} onConfirm={() => void run("support-key", () => adminCalls.revokeLegacyKey(), { done: "The older key is off" }).then(() => setLegacy(false))} testID="confirm-legacy" />
      <ShowOnce k={once} onClose={() => setOnce(null)} />
    </Screen>
  );
}
