import { router, useLocalSearchParams } from "expo-router";
import { Award, FileDown, Medal, PenLine, Plus, UserRoundPlus } from "lucide-react-native";
import * as React from "react";
import { Image, Linking, View } from "react-native";

import { messageOf } from "@/api/errors";
import { Button, Chips, EmptyState, Field, Row, RowList, RowsSkeleton, Screen, Sheet, SwitchRow, T } from "@/ds";
import { Enter } from "@/motion";
import { toast } from "@/ds/toast";
import { config } from "@/lib/config";
import { space, useTheme } from "@/theme";
import { adminCalls, useAdminAction, useBadges, useCertTypes, useCertificates, useEligible, useRefreshAdmin, useStudents, useStudioSettings } from "../api";
import { KIND_DEFAULTS, type BadgeRow, type CertRow, type CertStatus, type CertType, type CertTypeList, type RuleKind, type StudioSignatory, type TypeRule } from "../extra";
import { day, plural, type Tone } from "../format";
import { Block, ConfirmSheet, Facts, FilterChips, Loaded, Meter, Notice, OptionRow, Quiet, ScrollTabs, SearchBox, SelectRow, SmallButton, Status, SwipeRow, TabSwap, Tag } from "../kit";
import { openStudent } from "../nav";
import { useAdminRole, VIEW_ONLY_LINE } from "../role";

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
                <EmptyState mood={search || show ? "missing" : "empty"} title={search || show ? "None match" : "Nothing issued yet"} body={search || show ? undefined : "Certificates and badges you give show here."} />
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
  const c = useTheme();
  const { canWrite } = useAdminRole();
  const [search, setSearch] = React.useState("");
  const q = useStudents({ search: search.trim() || undefined });
  const [who, setWho] = React.useState<{ id: string; name: string } | null>(null);
  const [badgeFor, setBadgeFor] = React.useState<string[] | null>(null);
  return (
    <>
      <View style={{ flexDirection: "row" }}>
        <SearchBox value={search} onChange={setSearch} placeholder="Name, email or roll number" label="Find a student" testID="find-search" />
      </View>
      {canWrite ? <Row icon={<UserRoundPlus size={20} color={c.ink} />} title="Someone without an account" meta="A guest speaker or a volunteer" onPress={() => router.push("/admin/certificates/anyone" as never)} testID="find-anyone" /> : null}
      <Loaded q={q} soon what="students" skeleton={<RowsSkeleton rows={5} />}>
        {(d) =>
          d.items.length ? (
            <RowList>
              {d.items.slice(0, 60).map((r) => (
                <Row key={r.id} testID={`find-${r.id}`} title={r.name} meta={[r.rollNumber, r.cohorts.map((c) => c.name).join(", ")].filter(Boolean).join(" · ")} onPress={() => setWho({ id: r.id, name: r.name })} />
              ))}
            </RowList>
          ) : (
            <EmptyState mood="missing" title="Nobody found" body="Try part of the name or the roll number." />
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

const emptyRule = (kind: RuleKind, t: CertTypeList): TypeRule => {
  switch (kind) {
    case "module_complete":
      return { kind, module: t.modules[0]?.id ?? "" };
    case "sections_read":
      return { kind, module: t.modules[0]?.id ?? "", count: 3 };
    case "xp":
      return { kind, min: 100 };
    case "watch_seconds":
      return { kind, min: 3600 };
    case "course_complete":
      return { kind, course_id: t.courses[0]?.id ?? "" };
    default:
      return { kind: "module_tests_passed" };
  }
};

/** New or change a badge or certificate type: its words and the rule that earns it. */
function TypeSheet({ list, editing, onClose }: { list: CertTypeList; editing: CertType | "new" | null; onClose: () => void }) {
  const { run, busy } = useAdminAction();
  const start = editing && editing !== "new" ? editing : null;
  const [type, setType] = React.useState<"badge" | "certificate">(start?.type ?? "badge");
  const [title, setTitle] = React.useState(start?.title ?? "");
  const [about, setAbout] = React.useState(start?.description ?? "");
  const [tone, setTone] = React.useState(start?.tone ?? "lime");
  const [rule, setRule] = React.useState<TypeRule>(start?.rule ?? emptyRule("module_complete", list));
  const [error, setError] = React.useState<string | null>(null);
  const num = (v: string) => Math.max(0, Math.round(Number(v.replace(/\D/g, "")) || 0));
  const save = () => {
    if (!title.trim()) return setError("Give it a title.");
    if ((rule.kind === "module_complete" || rule.kind === "sections_read") && !rule.module) return setError("Pick a module.");
    if (rule.kind === "course_complete" && !rule.course_id) return setError("Pick a course.");
    setError(null);
    void run("studio-settings", () => adminCalls.saveType(start?.id ?? null, { type, title: title.trim(), description: about.trim(), tone, rule }), { done: start ? "Saved" : "Made" }).then((r) => r && onClose());
  };
  return (
    <Sheet open={!!editing} onClose={onClose} title={start ? `Change ${start.title}` : "New type"} testID="type-sheet">
      <View style={{ gap: space[4] }}>
        {start ? null : <Chips label="Kind" value={type} onChange={setType} options={[{ id: "badge" as const, name: "Badge" }, { id: "certificate" as const, name: "Course certificate" }]} />}
        <Field label="Title" value={title} onChangeText={setTitle} maxLength={120} error={error} testID="type-title" />
        <Field label="What it is for" value={about} onChangeText={setAbout} maxLength={600} multiline />
        <Chips label="Colour" value={tone} onChange={setTone} options={list.tones.map((t) => ({ id: t, name: t[0]!.toUpperCase() + t.slice(1) }))} />
        <View accessibilityRole="radiogroup" accessibilityLabel="What earns it">
          <T v="bodyStrong">What earns it</T>
          {list.rules.map((r) => (
            <OptionRow key={r.id} label={r.label} on={rule.kind === r.id} onPress={() => setRule(rule.kind === r.id ? rule : emptyRule(r.id, list))} testID={`rule-${r.id}`} />
          ))}
        </View>
        {rule.kind === "module_complete" || rule.kind === "sections_read" ? <Chips label="Module" value={rule.module} onChange={(module) => setRule({ ...rule, module })} options={list.modules.map((m) => ({ id: m.id, name: m.title }))} /> : null}
        {rule.kind === "sections_read" ? <Field label="Sections to read" value={String(rule.count)} keyboardType="number-pad" onChangeText={(v) => setRule({ ...rule, count: Math.max(1, num(v)) })} /> : null}
        {rule.kind === "xp" ? <Field label="XP to earn" value={String(rule.min)} keyboardType="number-pad" onChangeText={(v) => setRule({ ...rule, min: Math.max(1, num(v)) })} testID="rule-xp-min" /> : null}
        {rule.kind === "watch_seconds" ? <Field label="Minutes to watch" value={String(Math.round(rule.min / 60))} keyboardType="number-pad" onChangeText={(v) => setRule({ ...rule, min: Math.max(1, num(v)) * 60 })} /> : null}
        {rule.kind === "course_complete" ? <Chips label="Course" value={rule.course_id} onChange={(course_id) => setRule({ ...rule, course_id })} options={list.courses.map((x) => ({ id: x.id, name: x.title }))} /> : null}
        <Button label={start ? "Save" : "Make it"} busy={busy === "studio-settings"} onPress={save} testID="type-save" />
      </View>
    </Sheet>
  );
}

/** A course certificate: who meets its rule now, and drafts for them (issued from Issued). */
function EligibleSheet({ t, onClose }: { t: CertType | null; onClose: () => void }) {
  const q = useEligible(t?.id ?? null);
  const { run, busy } = useAdminAction();
  const [pick, setPick] = React.useState<Set<string>>(new Set());
  if (!t) return null;
  return (
    <Sheet open onClose={onClose} title={t.title} testID="eligible-sheet">
      <View style={{ gap: space[3] }}>
        <Loaded q={q} what="who qualifies" skeleton={<RowsSkeleton rows={3} />}>
          {(items) =>
            items.length ? (
              <View>
                {items.map((p) => (
                  <SelectRow key={p.id} on={pick.has(p.id)} label={`Pick ${p.name}`} onToggle={() => setPick((x) => { const n = new Set(x); if (n.has(p.id)) n.delete(p.id); else n.add(p.id); return n; })} testID={`eligible-${p.id}`}>
                    <Row title={p.name} meta={p.reason} />
                  </SelectRow>
                ))}
              </View>
            ) : (
              <EmptyState mood="clear" title="Nobody new qualifies" body="Everyone who meets the rule already has one." />
            )
          }
        </Loaded>
        {pick.size ? <Button label={`Make ${plural(pick.size, "draft")}`} busy={busy === "issue-certificate"} onPress={() => void run("issue-certificate", () => adminCalls.makeDrafts(t.id, [...pick]), { done: (r) => `${plural(r.made.length, "draft")} ready in Issued${r.failed.length ? `, ${r.failed.length} could not be made` : ""}` }).then((r) => r && onClose())} testID="eligible-make" /> : null}
      </View>
    </Sheet>
  );
}

/** Badge and certificate types with their rules: give, change, switch on or off, make course certificate drafts. */
function Types() {
  const c = useTheme();
  const q = useCertTypes();
  const badges = useBadges();
  const { canWrite } = useAdminRole();
  const { run, busy } = useAdminAction();
  const [giving, setGiving] = React.useState<BadgeRow | null>(null);
  const [editing, setEditing] = React.useState<CertType | "new" | null>(null);
  const [eligible, setEligible] = React.useState<CertType | null>(null);
  const [open, setOpen] = React.useState<CertType | null>(null);
  return (
    <>
      <Loaded q={q} soon what="types" skeleton={<RowsSkeleton rows={4} />}>
        {(d) => {
          const mine = d.items.filter((t) => !t.madeForYou);
          const group = (kind: "badge" | "certificate") => mine.filter((t) => t.type === kind);
          const line = (t: CertType) => (
            <Row
              key={t.id}
              testID={`type-row-${t.id}`}
              icon={t.type === "badge" ? <Medal size={20} color={t.enabled ? c.ink : c.muted} /> : <Award size={20} color={t.enabled ? c.ink : c.muted} />}
              title={t.title}
              meta={[t.ruleText, t.enabled ? "" : "Switched off"].filter(Boolean).join(" · ")}
              trailing={`${t.issued} given`}
              onPress={() => setOpen(t)}
            />
          );
          return (
            <View style={{ gap: space[4] }}>
              <Block title="Badges" count={group("badge").length || undefined} action={canWrite ? { label: "New type", onPress: () => setEditing("new"), testID: "type-new" } : undefined}>
                {group("badge").length ? <RowList>{group("badge").map(line)}</RowList> : <Quiet>No badges yet.</Quiet>}
              </Block>
              <Block title="Course certificates" count={group("certificate").length || undefined}>
                {group("certificate").length ? <RowList>{group("certificate").map(line)}</RowList> : <Quiet>None yet.</Quiet>}
              </Block>
              {canWrite ? <Button kind="quiet" label="Give every earned badge now" busy={busy === "award-all"} onPress={() => void run("award-all", () => adminCalls.awardAllBadges(), { done: (r) => (r.awarded ? `Gave ${plural(r.awarded, "badge")}` : "Everyone already has what they earned") })} testID="badges-award-all" /> : <Notice>{VIEW_ONLY_LINE}</Notice>}
              <TypeSheet key={editing === "new" ? "new" : (editing?.id ?? "none")} list={d} editing={editing} onClose={() => setEditing(null)} />
            </View>
          );
        }}
      </Loaded>
      <Sheet open={!!open} onClose={() => setOpen(null)} title={open?.title} testID="type-open">
        {open ? (
          <View style={{ gap: space[3] }}>
            <Facts items={[{ label: "Earned by", value: open.ruleText }, { label: "Given", value: String(open.issued) }, ...(open.description ? [{ label: "For", value: open.description }] : []), ...(open.type === "certificate" ? [{ label: "Signature", value: open.hasSignature ? (open.signatureLabel ?? "Saved") : "None yet" }] : [])]} />
            {canWrite ? (
              <>
                <SwitchRow title="Switched on" meta={open.type === "badge" ? "Students can earn it" : "Drafts can be made"} value={open.enabled} onChange={(v) => { const t = open; setOpen({ ...t, enabled: v }); void run("studio-settings", () => adminCalls.enableType(t.id, v), { done: v ? "Switched on" : "Switched off" }); }} testID="type-enabled" />
                {open.type === "badge" && open.enabled ? <Button label="Give it by hand" onPress={() => { const b = (badges.data?.items ?? []).find((x) => x.id === open.id) ?? { id: open.id, title: open.title, about: open.description ?? "", enabled: true, issued: open.issued, automatic: !!open.rule }; setOpen(null); setGiving(b); }} testID="type-give" /> : null}
                {open.type === "certificate" && open.enabled ? <Button label="Who qualifies now" onPress={() => { const t = open; setOpen(null); setEligible(t); }} testID="type-eligible" /> : null}
                {open.rule ? <Button kind="quiet" label="Change it" onPress={() => { const t = open; setOpen(null); setEditing(t); }} testID="type-edit" /> : null}
              </>
            ) : (
              <Notice>{VIEW_ONLY_LINE}</Notice>
            )}
          </View>
        ) : null}
      </Sheet>
      <GiveBadgeSheet key={giving?.id ?? "none"} userIds={null} badge={giving} onClose={() => setGiving(null)} />
      <EligibleSheet key={eligible?.id ?? "none"} t={eligible} onClose={() => setEligible(null)} />
    </>
  );
}

/** Who signs every new certificate (up to three, each with a saved signature image), and today's email. */
function Settings() {
  const c = useTheme();
  const q = useStudioSettings();
  const { canWrite } = useAdminRole();
  const { run, busy } = useAdminAction();
  const [draft, setDraft] = React.useState<StudioSignatory[] | null>(null);
  return (
    <Loaded q={q} soon what="settings" skeleton={<RowsSkeleton rows={3} />}>
      {(saved) => {
        const sigs = draft ?? (saved.signatories.length ? saved.signatories : [{ name: "", role: "", signatureFrom: null }]);
        const setSig = (i: number, p: Partial<StudioSignatory>) => setDraft(sigs.map((x, j) => (j === i ? { ...x, ...p } : x)));
        const e = saved.email;
        return (
          <View style={{ gap: space[5] }}>
            <Block title="Who signs">
              <T v="small" tone="muted">
                Every new certificate starts with these. You can still change them while issuing.
              </T>
              {sigs.map((sig, i) => (
                <Enter key={i} i={i} style={{ gap: space[2] }}>
                  <Field label={`Signed by${sigs.length > 1 ? ` (${i + 1})` : ""}`} value={sig.name} editable={canWrite} onChangeText={(name) => setSig(i, { name })} maxLength={60} testID={`settings-sig-name-${i}`} />
                  <Field label="Their role" value={sig.role} editable={canWrite} onChangeText={(role) => setSig(i, { role })} maxLength={60} />
                  {saved.signatures.length ? <Chips label="Signature" value={sig.signatureFrom ?? ""} onChange={(v) => canWrite && setSig(i, { signatureFrom: v || null })} options={[{ id: "", name: "None" }, ...saved.signatures.map((g) => ({ id: g.id, name: g.label }))]} /> : null}
                </Enter>
              ))}
              {canWrite ? (
                <View style={{ flexDirection: "row", gap: space[4] }}>
                  {sigs.length < 3 ? <Button kind="text" label="Add someone who signs" onPress={() => setDraft([...sigs, { name: "", role: "", signatureFrom: null }])} /> : null}
                  {sigs.length > 1 ? <Button kind="danger" label="Remove the last" onPress={() => setDraft(sigs.slice(0, -1))} /> : null}
                </View>
              ) : null}
              {canWrite ? (
                <Button kind="quiet" label="Save who signs" busy={busy === "studio-settings"} onPress={() => { const list = sigs.filter((x) => x.name.trim()); if (!list.length) return toast.show("Add at least one person who signs."); void run("studio-settings", () => adminCalls.saveSignatories(list), { done: "Saved" }).then((r) => r && setDraft(null)); }} testID="settings-save" />
              ) : (
                <Notice>{VIEW_ONLY_LINE}</Notice>
              )}
            </Block>
            <Block title="Signature images" count={saved.signatures.length || undefined}>
              {saved.signatures.length ? (
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space[3] }}>
                  {saved.signatures.map((g) => (
                    <View key={g.id} style={{ width: 148, gap: space[1] }} testID={`signature-${g.id}`}>
                      <View style={{ height: 64, borderRadius: 10, borderWidth: 1, borderColor: c.hairline, backgroundColor: c.paper, alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                        {g.url ? <Image source={{ uri: g.url }} style={{ width: 136, height: 56 }} resizeMode="contain" accessibilityLabel={`Signature of ${g.label}`} /> : <PenLine size={20} color={c.muted} />}
                      </View>
                      <T v="caption" tone="muted" numberOfLines={1}>
                        {g.label}
                      </T>
                    </View>
                  ))}
                </View>
              ) : (
                <Quiet>None saved yet. Add them on the website.</Quiet>
              )}
            </Block>
            <Block title="Email">
              {e.configured ? (
                <View style={{ gap: space[2] }}>
                  <Row title="Sent today" trailing={`${e.sentToday} of ${e.limit}`} />
                  <Meter pct={e.limit ? Math.round((e.sentToday / e.limit) * 100) : 0} tone={e.sentToday >= e.limit ? "warn" : "info"} />
                  {e.waiting ? (
                    <Notice testID="settings-waiting" action={canWrite ? <SmallButton label="Send now" busy={busy === "send-waiting"} onPress={() => void run("send-waiting", () => adminCalls.sendWaitingCertificates(), { done: (r) => `Sent ${r.sent}${r.left ? `, ${r.left} still waiting` : ""}` })} /> : undefined}>
                      {`${plural(e.waiting, "certificate email")} waiting for today's allowance.`}
                    </Notice>
                  ) : null}
                </View>
              ) : (
                <Quiet>Email is not set up on the website, so certificates show only in the app.</Quiet>
              )}
            </Block>
          </View>
        );
      }}
    </Loaded>
  );
}

const TABS = [
  { id: "issued" as const, name: "Issued" },
  { id: "find" as const, name: "Find and issue" },
  { id: "types" as const, name: "Types" },
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
      <TabSwap tabs={TABS} value={tab} gap={space[4]}>
        {tab === "issued" ? <Issued openId={params.open} /> : tab === "find" ? <Find /> : tab === "types" ? <Types /> : <Settings />}
      </TabSwap>
    </Screen>
  );
}
