import { router, useLocalSearchParams } from "expo-router";
import { Award, Medal, Plus } from "lucide-react-native";
import * as React from "react";
import { Linking, View } from "react-native";

import { Button, Chips, EmptyState, Field, Loaded, Row, RowList, RowsSkeleton, Screen, Sheet, SwitchRow, T } from "@/ds";
import { config } from "@/lib/config";
import { space, useTheme } from "@/theme";
import { adminCalls, useAdminAction, useCertificates, useCertTypes, useRefreshAdmin, useStudioSettings } from "../api";
import { KIND_DEFAULTS, type CertRow, type CertStatus, type StudioSettings } from "../extra";
import { day, plural, type Tone } from "../format";
import { ConfirmSheet, Facts, Notice, Quiet, SearchBox, Status, Tag } from "../kit";
import { openStudent } from "../nav";
import { useAdminRole, VIEW_ONLY_LINE } from "../role";
import { ScrollTabs } from "./student";

export const CERT_STATUS: Record<CertStatus, { label: string; tone: Tone }> = {
  valid: { label: "Valid", tone: "ok" },
  provisional: { label: "Provisional", tone: "info" },
  expired: { label: "Expired", tone: "quiet" },
  revoked: { label: "Revoked", tone: "alert" },
  not_issued: { label: "Not issued", tone: "quiet" },
};
const EMAIL: Record<CertRow["emailStatus"], string> = { sent: "Emailed", queued: "Email waiting to go", failed: "Email failed", not_sent: "Not emailed" };
export const kindLabel = (k: CertRow["kind"]) => (k === "badge" ? "Badge" : KIND_DEFAULTS[k].label);

export function CertLine({ x, onPress }: { x: CertRow; onPress: () => void }) {
  const c = useTheme();
  const st = CERT_STATUS[x.status];
  return <Row testID={`cert-${x.credentialId}`} icon={x.kind === "badge" ? <Medal size={20} color={c.muted} /> : <Award size={20} color={c.muted} />} title={x.recipient} meta={`${x.title} · ${day(x.issuedAt, true)}`} trailing={<Status tone={st.tone}>{st.label}</Status>} onPress={onPress} />;
}

/** A certificate's facts and what can be done with it: resend, issue again, revoke. */
function CertSheet({ x, onClose }: { x: CertRow | null; onClose: () => void }) {
  const { canWrite } = useAdminRole();
  const { run, busy } = useAdminAction();
  const [revoke, setRevoke] = React.useState(false);
  if (!x) return null;
  const live = x.status !== "revoked";
  return (
    <>
      <Sheet open={!revoke} onClose={onClose} title={x.title} testID="cert-sheet">
        <View style={{ gap: space[4] }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: space[3], flexWrap: "wrap" }}>
            <Status tone={CERT_STATUS[x.status].tone}>{CERT_STATUS[x.status].label}</Status>
            <Tag>{kindLabel(x.kind)}</Tag>
          </View>
          <Facts
            items={[
              { label: "Given to", value: x.recipient, onPress: () => { onClose(); openStudent(x.recipientId, "credentials"); } },
              { label: "Number", value: x.credentialId },
              { label: "Issued", value: day(x.issuedAt) },
              { label: x.status === "revoked" ? "Revoked" : "Runs out", value: x.status === "revoked" ? day(x.revokedAt) : x.expiresAt ? day(x.expiresAt) : "Never" },
              { label: "Email", value: EMAIL[x.emailStatus] },
              ...(x.revokeReason ? [{ label: "Why revoked", value: x.revokeReason }] : []),
              ...(x.replacedBy ? [{ label: "Replaced by", value: x.replacedBy }] : []),
            ]}
          />
          <Button kind="text" label="Open the check page" onPress={() => void Linking.openURL(`${config.site}/verify/${encodeURIComponent(x.credentialId)}`)} />
          {canWrite && live ? (
            <View style={{ gap: space[2] }}>
              {x.kind !== "badge" ? <Button kind="quiet" label="Email it again" busy={busy === "resend-certificate"} onPress={() => void run("resend-certificate", () => adminCalls.resend(x.credentialId), { done: `Sent again to ${x.recipient}` }).then((r) => r && onClose())} testID="cert-resend" /> : null}
              {x.kind !== "badge" ? <Button kind="quiet" label="Issue a corrected one" busy={busy === "reissue-certificate"} onPress={() => void run("reissue-certificate", () => adminCalls.reissue(x.credentialId), { done: (n) => `Issued again as ${n.credentialId}. The old one now says replaced.` }).then((r) => r && onClose())} testID="cert-reissue" /> : null}
              <Button kind="danger" full label="Revoke" onPress={() => setRevoke(true)} testID="cert-revoke" />
            </View>
          ) : !canWrite ? (
            <Notice>{VIEW_ONLY_LINE}</Notice>
          ) : null}
        </View>
      </Sheet>
      <ConfirmSheet
        open={revoke}
        onClose={() => setRevoke(false)}
        title={`Revoke ${x.recipient}'s ${x.kind === "badge" ? "badge" : "certificate"}?`}
        body="The check page will say it was revoked. This cannot be undone; you can issue a new one."
        confirm="Revoke"
        danger
        busy={busy === "revoke-certificate"}
        reason={{ label: "Why (shown on the check page)", required: true }}
        onConfirm={(reason) => void run("revoke-certificate", () => adminCalls.revoke(x.credentialId, reason), { done: "Revoked" }).then((r) => r && onClose())}
        testID="confirm-revoke"
      />
    </>
  );
}

const SHOW = [
  { id: "all" as const, name: "All" },
  { id: "valid" as const, name: "Valid" },
  { id: "provisional" as const, name: "Provisional" },
  { id: "badge" as const, name: "Badges" },
  { id: "revoked" as const, name: "Revoked" },
];

function Issued({ openId }: { openId?: string }) {
  const q = useCertificates();
  const [show, setShow] = React.useState<(typeof SHOW)[number]["id"]>("all");
  const [search, setSearch] = React.useState("");
  const [open, setOpen] = React.useState<string | null>(openId ?? null);
  return (
    <Loaded q={q} soon what="certificates" skeleton={<RowsSkeleton rows={5} />}>
      {(d) => {
        const n = search.trim().toLowerCase();
        const items = d.items.filter((x) => (show === "all" ? true : show === "badge" ? x.kind === "badge" : x.status === show && x.kind !== "badge") && (!n || `${x.recipient} ${x.title} ${x.credentialId}`.toLowerCase().includes(n)));
        const opened = d.items.find((x) => x.credentialId === open) ?? null;
        return (
          <>
            <View style={{ flexDirection: "row" }}>
              <SearchBox value={search} onChange={setSearch} placeholder="Name, title or number" label="Search certificates" testID="certs-search" />
            </View>
            <Chips scroll label="Show" value={show} onChange={setShow} options={SHOW} />
            {items.length ? (
              <RowList>
                {items.map((x) => (
                  <CertLine key={x.credentialId} x={x} onPress={() => setOpen(x.credentialId)} />
                ))}
              </RowList>
            ) : (
              <EmptyState mood="sleepy" title={d.items.length ? "None match" : "Nothing issued yet"} body={d.items.length ? undefined : "Certificates you issue show here."} />
            )}
            <CertSheet key={opened?.credentialId ?? "none"} x={opened} onClose={() => setOpen(null)} />
          </>
        );
      }}
    </Loaded>
  );
}

function Types() {
  const c = useTheme();
  const q = useCertTypes();
  return (
    <Loaded q={q} soon what="certificate types" skeleton={<RowsSkeleton rows={5} />}>
      {(d) => (
        <>
          <RowList>
            {d.items
              .filter((t) => t.kind !== "badge")
              .map((t) => (
                <Row key={t.id} icon={<Award size={20} color={c.muted} />} title={t.name} meta={t.about} trailing={`${t.issued} issued`} onPress={() => router.push(`/admin/certificates/new?kind=${t.kind}`)} />
              ))}
          </RowList>
          <T v="h3">Badges</T>
          <RowList>
            {d.items
              .filter((t) => t.kind === "badge")
              .map((t) => (
                <Row key={t.id} icon={<Medal size={20} color={c.muted} />} title={t.name} meta={t.auto ? `${t.about}` : t.about} trailing={`${t.issued} given`} />
              ))}
          </RowList>
        </>
      )}
    </Loaded>
  );
}

function Settings() {
  const q = useStudioSettings();
  const { canWrite } = useAdminRole();
  const { run, busy } = useAdminAction();
  const [draft, setDraft] = React.useState<StudioSettings | null>(null);
  return (
    <Loaded q={q} soon what="settings" skeleton={<RowsSkeleton rows={3} />}>
      {(saved) => {
        const s = draft ?? saved;
        const edit = (p: Partial<StudioSettings>) => setDraft({ ...s, ...p });
        const sig = s.signatories[0] ?? { name: "", role: "" };
        return (
          <View style={{ gap: space[4] }}>
            <T v="small" tone="muted">
              These fill in every new certificate. You can still change them while issuing.
            </T>
            <Field label="Signed by" value={sig.name} editable={canWrite} onChangeText={(name) => edit({ signatories: [{ ...sig, name }, ...s.signatories.slice(1)] })} testID="settings-sig-name" />
            <Field label="Their role" value={sig.role} editable={canWrite} onChangeText={(role) => edit({ signatories: [{ ...sig, role }, ...s.signatories.slice(1)] })} />
            <Field label="Replies go to" value={s.replyTo ?? ""} editable={canWrite} keyboardType="email-address" autoCapitalize="none" onChangeText={(replyTo) => edit({ replyTo: replyTo || null })} />
            <SwitchRow title="Email students when issued" meta="They always see it in the app" value={s.emailOnIssue} disabled={!canWrite} onChange={(emailOnIssue) => edit({ emailOnIssue })} />
            {canWrite ? <Button kind="quiet" label="Save settings" busy={busy === "studio-settings"} onPress={() => void run("studio-settings", () => adminCalls.studioSettings(s), { done: "Saved" }).then((r) => r && setDraft(null))} testID="settings-save" /> : <Notice>{VIEW_ONLY_LINE}</Notice>}
          </View>
        );
      }}
    </Loaded>
  );
}

const TABS = [
  { id: "issued" as const, name: "Issued" },
  { id: "types" as const, name: "Types" },
  { id: "settings" as const, name: "Settings" },
];

/** Certificates and badges, in one place: what was issued, the kinds, the studio settings. Issue is the one primary action. */
export function AdminCertificatesScreen() {
  const c = useTheme();
  const params = useLocalSearchParams<{ tab?: string; open?: string }>();
  const [tab, setTab] = React.useState<(typeof TABS)[number]["id"]>(TABS.some((t) => t.id === params.tab) ? (params.tab as "issued") : "issued");
  const { canWrite } = useAdminRole();
  const { refresh, refreshing } = useRefreshAdmin();
  const certs = useCertificates();
  const n = certs.data?.items.filter((x) => x.status !== "revoked").length ?? 0;
  return (
    <Screen title="Certificates" lead={n ? `${plural(n, "certificate or badge", "certificates and badges")} in use` : undefined} testID="admin-certificates" gap={space[4]} onRefresh={refresh} refreshing={refreshing} footer={canWrite ? <Button label="Issue certificates" icon={<Plus size={20} color={c.onPrimary} />} onPress={() => router.push("/admin/certificates/new")} testID="certs-issue" /> : undefined}>
      <ScrollTabs tabs={TABS} value={tab} onChange={setTab} />
      {tab === "issued" ? <Issued openId={params.open} /> : tab === "types" ? <Types /> : <Settings />}
      {tab === "issued" && certs.data && !certs.data.ready ? <Quiet>Certificates are not set up in the database yet.</Quiet> : null}
    </Screen>
  );
}
