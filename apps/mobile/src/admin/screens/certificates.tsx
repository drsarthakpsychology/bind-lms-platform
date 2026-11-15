import { router, useLocalSearchParams } from "expo-router";
import { Award, FileDown, Medal, Plus } from "lucide-react-native";
import * as React from "react";
import { Linking, View } from "react-native";

import { messageOf } from "@/api/errors";
import { Button, EmptyState, Field, Row, RowList, RowsSkeleton, Screen, Sheet, SwitchRow, T } from "@/ds";
import { toast } from "@/ds/toast";
import { config } from "@/lib/config";
import { space, useTheme } from "@/theme";
import { adminCalls, useAdminAction, useBadges, useCertificates, useRefreshAdmin, useStudents, useStudioSettings } from "../api";
import { CERT_KINDS, KIND_DEFAULTS, type BadgeRow, type CertRow, type CertStatus, type StudioSettings } from "../extra";
import { day, plural, type Tone } from "../format";
import { ConfirmSheet, Facts, FilterChips, Loaded, Notice, Quiet, SearchBox, SelectRow, SmallButton, Status, SwipeRow, Tag } from "../kit";
import { openStudent } from "../nav";
import { useAdminRole, VIEW_ONLY_LINE } from "../role";
import { ScrollTabs } from "./student";

export const CERT_STATUS: Record<CertStatus, { label: string; tone: Tone }> = {
  valid: { label: "Valid", tone: "ok" },
  provisional: { label: "Provisional", tone: "info" },
  expired: { label: "Expired", tone: "quiet" },
  revoked: { label: "Revoked", tone: "alert" },
  not_issued: { label: "Not issued", tone: "quiet" },
  draft: { label: "Draft", tone: "warn" },
};
const EMAIL: Record<CertRow["emailStatus"], string> = { sent: "Emailed", queued: "Email waiting to go", failed: "Email failed", not_sent: "Not emailed" };
export const kindLabel = (k: CertRow["kind"]) => (k === "badge" ? "Badge" : (KIND_DEFAULTS[k]?.label ?? "Certificate"));

async function openLink(get: () => Promise<{ url: string }>) {
  try {
    const r = await get();
    if (r?.url) await Linking.openURL(r.url);
  } catch (e) {
    toast.show(messageOf(e));
  }
}

/** Correct and reissue: the studio, filled in, with the old certificate to replace. */
export function correctHref(x: CertRow): string {
  const q = new URLSearchParams({ replaces: x.credentialId, to: x.recipientId, title: x.title });
  if (x.kind !== "badge") q.set("kind", x.kind);
  return `/admin/certificates/new?${q.toString()}`;
}

export function CertLine({ x, onPress }: { x: CertRow; onPress: () => void }) {
  const c = useTheme();
  const st = CERT_STATUS[x.status] ?? CERT_STATUS.valid;
  return <Row testID={`cert-${x.credentialId}`} icon={x.kind === "badge" ? <Medal size={20} color={c.muted} /> : <Award size={20} color={c.muted} />} title={x.recipient} meta={[x.title, x.issuedAt ? day(x.issuedAt, true) : "Not issued"].join(" · ")} trailing={<Status tone={st.tone}>{st.label}</Status>} onPress={onPress} />;
}

/** A certificate's facts and what can be done with it: send again, correct, PDF, revoke. */
function CertSheet({ x, onClose, onRevoke }: { x: CertRow | null; onClose: () => void; onRevoke: (x: CertRow) => void }) {
  const { canWrite } = useAdminRole();
  const { run, busy } = useAdminAction();
  if (!x) return null;
  const live = x.status !== "revoked";
  const st = CERT_STATUS[x.status] ?? CERT_STATUS.valid;
  return (
    <Sheet open onClose={onClose} title={x.title} testID="cert-sheet">
      <View style={{ gap: space[4] }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: space[3], flexWrap: "wrap" }}>
          <Status tone={st.tone}>{x.statusLine || st.label}</Status>
          <Tag>{x.typeLabel || kindLabel(x.kind)}</Tag>
        </View>
        <Facts
          items={[
            {
              label: "Given to",
              value: x.recipient,
              onPress: x.recipientId
                ? () => {
                    onClose();
                    openStudent(x.recipientId, "credentials");
                  }
                : undefined,
            },
            { label: "Number", value: x.credentialId },
            { label: "Issued", value: x.issuedAt ? day(x.issuedAt) : "Not issued" },
            { label: x.status === "revoked" ? "Revoked" : "Runs out", value: x.status === "revoked" ? day(x.revokedAt) : x.expiresAt ? day(x.expiresAt) : "Never" },
            ...(x.kind !== "badge" ? [{ label: "Email", value: EMAIL[x.emailStatus] ?? "Not emailed" }] : []),
            ...(x.revokeReason ? [{ label: "Why revoked", value: x.revokeReason }] : []),
            ...(x.replacedBy ? [{ label: "Replaced by", value: x.replacedBy }] : []),
          ]}
        />
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space[2] }}>
          <SmallButton label="Check page" onPress={() => void Linking.openURL(x.verifyUrl || `${config.site}/verify/${encodeURIComponent(x.credentialId)}`)} />
          {x.hasPdf ? <SmallButton label="PDF" icon={<FileDown size={16} />} onPress={() => void openLink(() => adminCalls.certificatePdf(x.credentialId))} testID="cert-pdf" /> : null}
        </View>
        {canWrite && live ? (
          <View style={{ gap: space[2] }}>
            {x.isDraft ? <Button label="Issue this draft" busy={busy === "issue-certificate"} onPress={() => void run("issue-certificate", () => adminCalls.issueDraft(x.credentialId), { done: "Issued" }).then((r) => r && onClose())} testID="cert-issue-draft" /> : null}
            {x.kind !== "badge" && !x.isDraft ? <Button kind="quiet" label="Send it again" busy={busy === "resend-certificate"} onPress={() => void run("resend-certificate", () => adminCalls.resend(x.credentialId, true), { done: `Sent again to ${x.recipient}` }).then((r) => r && onClose())} testID="cert-resend" /> : null}
            {x.canCorrect && !x.isDraft ? (
              <Button
                kind="quiet"
                label="Correct and reissue"
                onPress={() => {
                  onClose();
                  router.push(correctHref(x) as never);
                }}
                testID="cert-reissue"
              />
            ) : null}
            <Button kind="danger" full label="Revoke" onPress={() => onRevoke(x)} testID="cert-revoke" />
          </View>
        ) : !canWrite ? (
          <Notice>{VIEW_ONLY_LINE}</Notice>
        ) : null}
      </View>
    </Sheet>
  );
}

function RevokeSheet({ x, onClose }: { x: CertRow | null; onClose: () => void }) {
  const { run, busy } = useAdminAction();
  return (
    <ConfirmSheet
      open={!!x}
      onClose={onClose}
      title={x ? `Revoke ${x.recipient}'s ${x.kind === "badge" ? "badge" : "certificate"}?` : ""}
      body="The check page will say it was revoked. This cannot be undone; you can issue a new one."
      confirm="Revoke"
      danger
      busy={busy === "revoke-certificate"}
      reason={{ label: "Why (shown on the check page)", required: true }}
      onConfirm={(reason) => x && void run("revoke-certificate", () => adminCalls.revoke(x.credentialId, reason), { done: "Revoked" }).then((r) => r && onClose())}
      testID="confirm-revoke"
    />
  );
}

const SHOW = [
  { id: "" as const, name: "All" },
  { id: "certificate" as const, name: "Certificates" },
  { id: "badge" as const, name: "Badges" },
  { id: "valid" as const, name: "Valid" },
  { id: "provisional" as const, name: "Provisional" },
  { id: "draft" as const, name: "Drafts" },
  { id: "revoked" as const, name: "Revoked" },
];
type Show = (typeof SHOW)[number]["id"];

function Issued({ openId }: { openId?: string }) {
  const { canWrite } = useAdminRole();
  const { run, busy } = useAdminAction();
  const [show, setShow] = React.useState<Show>("");
  const [search, setSearch] = React.useState("");
  const isType = show === "certificate" || show === "badge";
  const q = useCertificates({ q: search.trim(), type: isType ? show : undefined, status: !isType ? show : undefined });
  const [open, setOpen] = React.useState<string | null>(openId ?? null);
  const [revoking, setRevoking] = React.useState<CertRow | null>(null);
  return (
    <>
      <View style={{ flexDirection: "row" }}>
        <SearchBox value={search} onChange={setSearch} placeholder="Name, title or number" label="Search certificates" testID="certs-search" />
      </View>
      <FilterChips label="Show" value={show} onChange={setShow} options={SHOW} testID="certs-show" />
      <Loaded q={q} soon what="certificates" skeleton={<RowsSkeleton rows={5} />}>
        {(d) => {
          const opened = d.items.find((x) => x.credentialId === open) ?? null;
          return (
            <>
              {d.waiting && canWrite ? (
                <Notice testID="certs-waiting" action={<SmallButton label="Send now" busy={busy === "send-waiting"} onPress={() => void run("send-waiting", () => adminCalls.sendWaitingCertificates(), { done: (r) => `Sent ${r.sent}${r.left ? `, ${r.left} still waiting` : ""}` })} testID="certs-send-waiting" />}>
                  {`${plural(d.waiting, "certificate email")} waiting for today's allowance.`}
                </Notice>
              ) : null}
              {!d.ready ? <Quiet>Certificates are not set up in the database yet.</Quiet> : null}
              {d.items.length ? (
                <RowList>
                  {d.items.map((x) => (
                    <SwipeRow key={x.credentialId} enabled={canWrite && x.status !== "revoked"} action={{ label: "Revoke", danger: true, onPress: () => setRevoking(x) }} testID={`swipe-${x.credentialId}`}>
                      <CertLine x={x} onPress={() => setOpen(x.credentialId)} />
                    </SwipeRow>
                  ))}
                </RowList>
              ) : (
                <EmptyState mood="sleepy" title={search || show ? "None match" : "Nothing issued yet"} body={search || show ? undefined : "Certificates and badges you give show here."} />
              )}
              <CertSheet key={opened?.credentialId ?? "none"} x={opened} onClose={() => setOpen(null)} onRevoke={(x) => { setOpen(null); setRevoking(x); }} />
            </>
          );
        }}
      </Loaded>
      <RevokeSheet x={revoking} onClose={() => setRevoking(null)} />
    </>
  );
}

/** Find a student, then issue them a certificate or give a badge. */
function Find() {
  const [search, setSearch] = React.useState("");
  const q = useStudents({ search: search.trim() || undefined });
  const [who, setWho] = React.useState<{ id: string; name: string } | null>(null);
  const [badgeFor, setBadgeFor] = React.useState<string[] | null>(null);
  return (
    <>
      <View style={{ flexDirection: "row" }}>
        <SearchBox value={search} onChange={setSearch} placeholder="Name, email or roll number" label="Find a student" testID="find-search" />
      </View>
      <Loaded q={q} soon what="students" skeleton={<RowsSkeleton rows={5} />}>
        {(d) =>
          d.items.length ? (
            <RowList>
              {d.items.slice(0, 60).map((r) => (
                <Row key={r.id} testID={`find-${r.id}`} title={r.name} meta={[r.rollNumber, r.cohorts.map((c) => c.name).join(", ")].filter(Boolean).join(" · ")} onPress={() => setWho({ id: r.id, name: r.name })} />
              ))}
            </RowList>
          ) : (
            <EmptyState mood="puzzled" title="Nobody found" body="Try part of the name or the roll number." />
          )
        }
      </Loaded>
      <Sheet open={!!who} onClose={() => setWho(null)} title={who?.name} testID="find-sheet">
        {who ? (
          <View style={{ gap: space[2] }}>
            <Button label="Issue a certificate" onPress={() => { const id = who.id; setWho(null); router.push(`/admin/certificates/new?to=${encodeURIComponent(id)}` as never); }} testID="find-issue" />
            <Button kind="quiet" label="Give a badge" onPress={() => { const id = who.id; setWho(null); setBadgeFor([id]); }} testID="find-badge" />
            <Button kind="text" full label="See what they have" onPress={() => { const id = who.id; setWho(null); openStudent(id, "credentials"); }} />
          </View>
        ) : null}
      </Sheet>
      <GiveBadgeSheet userIds={badgeFor} onClose={() => setBadgeFor(null)} />
    </>
  );
}

/** Give a badge by hand: pick the badge (or the students, from the Badges tab). */
function GiveBadgeSheet({ userIds, badge, onClose }: { userIds: string[] | null; badge?: BadgeRow | null; onClose: () => void }) {
  const badges = useBadges();
  const students = useStudents();
  const { run, busy } = useAdminAction();
  const [pick, setPick] = React.useState<string | null>(badge?.id ?? null);
  const [people, setPeople] = React.useState<Set<string>>(new Set(userIds ?? []));
  const open = userIds !== null || !!badge;
  const choosePeople = !!badge;
  const give = () => {
    const id = pick ?? badge?.id;
    if (!id) return toast.show("Pick a badge.");
    const ids = [...people];
    if (!ids.length) return toast.show("Pick at least one student.");
    void run("award-badge", () => adminCalls.awardBadge(id, ids), { done: (r) => `Given to ${plural(r.awarded?.length ?? 0, "student")}${r.skipped?.length ? `, ${r.skipped.length} had it already` : ""}` }).then((r) => r && onClose());
  };
  return (
    <Sheet open={open} onClose={onClose} title={badge ? `Give ${badge.title}` : "Give a badge"} testID="badge-sheet">
      <View style={{ gap: space[3] }}>
        {choosePeople ? (
          <View>
            {(students.data?.items ?? []).map((r) => (
              <SelectRow key={r.id} on={people.has(r.id)} label={`Pick ${r.name}`} onToggle={() => setPeople((s) => { const n = new Set(s); if (n.has(r.id)) n.delete(r.id); else n.add(r.id); return n; })} testID={`badge-pick-${r.id}`}>
                <Row title={r.name} meta={r.rollNumber ?? undefined} />
              </SelectRow>
            ))}
          </View>
        ) : (
          <Loaded q={badges} soon what="badges" skeleton={<RowsSkeleton rows={3} />}>
            {(d) => (
              <View>
                {d.items.filter((b) => b.enabled).map((b) => (
                  <SelectRow key={b.id} on={pick === b.id} label={`Pick ${b.title}`} onToggle={() => setPick(pick === b.id ? null : b.id)} testID={`badge-${b.id}`}>
                    <Row title={b.title} meta={b.about || undefined} />
                  </SelectRow>
                ))}
              </View>
            )}
          </Loaded>
        )}
        <Button label={people.size ? `Give to ${plural(people.size, "student")}` : "Give"} busy={busy === "award-badge"} onPress={give} testID="badge-give" />
      </View>
    </Sheet>
  );
}

/** The kinds of certificate, and the badges with how many were given. */
function Types() {
  const c = useTheme();
  const q = useBadges();
  const { canWrite } = useAdminRole();
  const { run, busy } = useAdminAction();
  const [giving, setGiving] = React.useState<BadgeRow | null>(null);
  return (
    <>
      <RowList>
        {CERT_KINDS.map((k) => (
          <Row key={k} icon={<Award size={20} color={c.muted} />} title={KIND_DEFAULTS[k].label} meta={KIND_DEFAULTS[k].about} onPress={canWrite ? () => router.push(`/admin/certificates/new?kind=${k}` as never) : undefined} testID={`type-${k}`} />
        ))}
      </RowList>
      <T v="h3">Badges</T>
      <Loaded q={q} soon what="badges" skeleton={<RowsSkeleton rows={3} />}>
        {(d) => (
          <>
            {d.items.length ? (
              <RowList>
                {d.items.map((b) => (
                  <Row key={b.id} testID={`badge-row-${b.id}`} icon={<Medal size={20} color={c.muted} />} title={b.title} meta={[b.about, b.automatic ? "Given by itself" : "Given by hand", b.enabled ? "" : "Switched off"].filter(Boolean).join(" · ")} trailing={`${b.issued} given`} onPress={canWrite && b.enabled ? () => setGiving(b) : undefined} />
                ))}
              </RowList>
            ) : (
              <Quiet>No badges yet. Make them on the website.</Quiet>
            )}
            {canWrite ? <Button kind="quiet" label="Give every earned badge now" busy={busy === "award-all"} onPress={() => void run("award-all", () => adminCalls.awardAllBadges(), { done: (r) => (r.awarded ? `Gave ${plural(r.awarded, "badge")}` : "Everyone already has what they earned") })} testID="badges-award-all" /> : null}
          </>
        )}
      </Loaded>
      <GiveBadgeSheet key={giving?.id ?? "none"} userIds={null} badge={giving} onClose={() => setGiving(null)} />
    </>
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
        const sigs = s.signatories.length ? s.signatories : [{ name: "", role: "" }];
        const setSig = (i: number, p: Partial<StudioSettings["signatories"][number]>) => edit({ signatories: sigs.map((x, j) => (j === i ? { ...x, ...p } : x)) });
        return (
          <View style={{ gap: space[4] }}>
            <T v="small" tone="muted">
              Who signs every new certificate. You can still change it while issuing.
            </T>
            {sigs.map((sig, i) => (
              <View key={i} style={{ gap: space[2] }}>
                <Field label={`Signed by${sigs.length > 1 ? ` (${i + 1})` : ""}`} value={sig.name} editable={canWrite} onChangeText={(name) => setSig(i, { name })} testID={`settings-sig-name-${i}`} />
                <Field label="Their role" value={sig.role} editable={canWrite} onChangeText={(role) => setSig(i, { role })} />
              </View>
            ))}
            {canWrite ? (
              <View style={{ flexDirection: "row", gap: space[4] }}>
                {sigs.length < 3 ? <Button kind="text" label="Add someone who signs" onPress={() => edit({ signatories: [...sigs, { name: "", role: "" }] })} /> : null}
                {sigs.length > 1 ? <Button kind="danger" label="Remove the last" onPress={() => edit({ signatories: sigs.slice(0, -1) })} /> : null}
              </View>
            ) : null}
            <SwitchRow title="Email students when issued" meta="They always see it in the app" value={s.emailOnIssue} disabled={!canWrite} onChange={(emailOnIssue) => edit({ emailOnIssue })} />
            {canWrite ? <Button kind="quiet" label="Save settings" busy={busy === "studio-settings"} onPress={() => void run("studio-settings", () => adminCalls.studioSettings({ ...s, signatories: sigs.filter((x) => x.name.trim()) }), { done: "Saved" }).then((r) => r && setDraft(null))} testID="settings-save" /> : <Notice>{VIEW_ONLY_LINE}</Notice>}
          </View>
        );
      }}
    </Loaded>
  );
}

const TABS = [
  { id: "issued" as const, name: "Issued" },
  { id: "find" as const, name: "Find and issue" },
  { id: "types" as const, name: "Badges and types" },
  { id: "settings" as const, name: "Settings" },
];

/** Certificates and badges in one place: what was issued, find someone and issue, badges, settings. */
export function AdminCertificatesScreen() {
  const c = useTheme();
  const params = useLocalSearchParams<{ tab?: string; open?: string }>();
  const [tab, setTab] = React.useState<(typeof TABS)[number]["id"]>(TABS.some((t) => t.id === params.tab) ? (params.tab as "issued") : "issued");
  const { canWrite } = useAdminRole();
  const { refresh, refreshing } = useRefreshAdmin();
  return (
    <Screen title="Certificates" testID="admin-certificates" gap={space[4]} onRefresh={refresh} refreshing={refreshing} footer={canWrite ? <Button label="Issue certificates" icon={<Plus size={20} color={c.onPrimary} />} onPress={() => router.push("/admin/certificates/new")} testID="certs-issue" /> : undefined}>
      <ScrollTabs tabs={TABS} value={tab} onChange={setTab} />
      {tab === "issued" ? <Issued openId={params.open} /> : tab === "find" ? <Find /> : tab === "types" ? <Types /> : <Settings />}
    </Screen>
  );
}
