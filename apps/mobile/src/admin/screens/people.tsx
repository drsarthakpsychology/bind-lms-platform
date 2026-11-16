import { router, useLocalSearchParams } from "expo-router";
import { Mail, MessageCircle, Phone } from "lucide-react-native";
import * as React from "react";
import { Linking, View } from "react-native";

import { Button, Chips, EmptyState, Field, Row, RowList, RowsSkeleton, Screen, Sheet, T } from "@/ds";
import { messageOf } from "@/api/errors";
import { toast } from "@/ds/toast";
import { haptic } from "@/lib/haptics";
import { space, useTheme } from "@/theme";
import { adminCalls, useAdminAction, useEnquiries, usePeople, usePerson, useRefreshAdmin } from "../api";
import { PEOPLE_VIEWS, STAGE_LABEL, STAGES, type EmailPreview, type LoginLinkResult, type PeopleView, type PersonRow, type StageId } from "../extra";
import { ago, day, followUpLine, inPeopleView, plural, whatsapp, type Tone } from "../format";
import { ActionBar, Check, Dot, Facts, FilterChips, Loaded, Notice, OptionRow, Quiet, SearchBox, SelectRow, SmallButton, Status, SwipeRow, Tag } from "../kit";
import { openStudent } from "../nav";
import { useAdminRole, VIEW_ONLY_LINE } from "../role";
import { LinkSheet, ScrollTabs } from "./student";

export function stageTone(s: StageId): Tone {
  return s === "joined" ? "ok" : s === "new" ? "warn" : s === "no_reply" || s === "not_interested" ? "quiet" : "info";
}

/** Email several people, one email each (never one email with everyone in it). */
/**
 * Email people one by one: each gets their own email. Merge fields
 * ({first_name}, {name} ...) are filled for each person by the server; a
 * preview shows what one of them will get before anything is sent.
 */
export function ContactSheet({
  open,
  onClose,
  count,
  onSend,
  busy,
  mergeFields = [],
  allowance,
  preview,
}: {
  open: boolean;
  onClose: () => void;
  count: number;
  onSend: (subject: string, text: string) => void;
  busy?: boolean;
  mergeFields?: { key: string; label: string }[];
  allowance?: { configured: boolean; left: number; limit: number } | null;
  preview?: (subject: string, text: string) => Promise<EmailPreview>;
}) {
  const [subject, setSubject] = React.useState("");
  const [text, setText] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [shown, setShown] = React.useState<EmailPreview | null>(null);
  const [looking, setLooking] = React.useState(false);
  const later = allowance && allowance.configured ? Math.max(0, count - allowance.left) : 0;
  const check = () => {
    if (!subject.trim() || !text.trim()) {
      setError("Write a subject and a message.");
      return false;
    }
    setError(null);
    return true;
  };
  const look = async () => {
    if (!preview || !check()) return;
    setLooking(true);
    try {
      setShown(await preview(subject.trim(), text.trim()));
    } catch (e) {
      toast.show(messageOf(e));
    } finally {
      setLooking(false);
    }
  };
  return (
    <Sheet open={open} onClose={onClose} title={`Email ${plural(count, "person", "people")}`} testID="contact-sheet">
      <View style={{ gap: space[4] }}>
        <T v="small" tone="muted">
          {later ? `Each one gets their own email. ${plural(count - later, "goes", "go")} now; ${later} wait for tomorrow's allowance.` : "Each one gets their own email."}
        </T>
        {allowance && !allowance.configured ? <Notice tone="warn">Email is not set up on the server, so nothing can be sent yet.</Notice> : null}
        <Field label="Subject" value={subject} onChangeText={setSubject} maxLength={200} testID="contact-subject" />
        <Field label="Message" value={text} onChangeText={(t) => { setText(t); setShown(null); }} area error={error} maxLength={10000} testID="contact-text" />
        {mergeFields.length ? (
          <View style={{ gap: space[2] }}>
            <T v="caption" tone="muted">
              Tap to add a blank that is filled in for each person
            </T>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space[2] }}>
              {mergeFields.map((m) => (
                <SmallButton key={m.key} label={m.label} onPress={() => { haptic.select(); setText((t) => `${t}{${m.key}}`); setShown(null); }} testID={`merge-${m.key}`} />
              ))}
            </View>
          </View>
        ) : null}
        {shown ? (
          <View style={{ gap: space[1], padding: space[3], borderRadius: 10, borderWidth: 1, borderColor: "rgba(127,127,127,0.35)" }} testID="contact-preview">
            <T v="caption" tone="muted">
              {`To ${shown.to}`}
            </T>
            <T v="bodyStrong">{shown.subject}</T>
            <T v="small">{shown.text}</T>
            {shown.unknownFields.length ? (
              <T v="small" tone="danger">
                {`Not known: ${shown.unknownFields.map((f) => `{${f}}`).join(", ")}. Fix these before sending.`}
              </T>
            ) : null}
          </View>
        ) : null}
        {preview ? <Button kind="quiet" label="See what one person gets" busy={looking} onPress={() => void look()} testID="contact-preview-btn" /> : null}
        <Button
          label={count > 1 ? `Send ${count} emails` : "Send"}
          busy={busy}
          testID="contact-send"
          onPress={() => {
            if (!check()) return;
            if (shown?.unknownFields.length) return setError("Some blanks are not known. Fix them first.");
            onSend(subject.trim(), text.trim());
          }}
        />
      </View>
    </Sheet>
  );
}

function PersonLine({ p, onPress }: { p: PersonRow; onPress: () => void }) {
  const follow = followUpLine(p.followUpAt);
  return <Row testID={`person-${p.key}`} title={p.name} meta={[follow, p.source, p.paid ? "Paid" : null].filter(Boolean).join(" · ") || p.email} trailing={<Status tone={stageTone(p.stage)}>{STAGE_LABEL[p.stage]}</Status>} onPress={onPress} />;
}

function Pipeline({ initialView }: { initialView: PeopleView }) {
  const c = useTheme();
  const { canWrite } = useAdminRole();
  const { run, busy } = useAdminAction();
  const [view, setView] = React.useState<PeopleView>(initialView);
  const [search, setSearch] = React.useState("");
  const q = usePeople(view, search.trim());
  const [wa, setWa] = React.useState<{ key: string; name: string; url: string | null }[] | null>(null);
  const [waText, setWaText] = React.useState(false);
  const [picked, setPicked] = React.useState<Set<string>>(new Set());
  const [contact, setContact] = React.useState(false);
  return (
    <Loaded q={q} soon what="the pipeline" skeleton={<RowsSkeleton rows={6} />}>
      {(d) => {
        // The server filters by view and search; an older answer without counts is filtered here.
        const needle = search.trim().toLowerCase();
        const serverSide = d.counts && Object.keys(d.counts).length > 0;
        const shown = serverSide ? d.items : d.items.filter((p) => inPeopleView(p, view) && (!needle || `${p.name} ${p.email} ${p.phone ?? ""}`.toLowerCase().includes(needle)));
        const count = (v: PeopleView) => (serverSide ? (d.counts?.[v] ?? 0) : d.items.filter((p) => inPeopleView(p, v)).length);
        const all = shown.length > 0 && shown.every((p) => picked.has(p.key));
        return (
          <>
            <View style={{ flexDirection: "row" }}>
              <SearchBox value={search} onChange={setSearch} placeholder="Name, email or phone" label="Search people" testID="people-search" />
            </View>
            {d.waiting && canWrite ? (
              <Notice action={<SmallButton label="Send now" busy={busy === "send-waiting"} onPress={() => void run("send-waiting", () => adminCalls.sendWaitingPeople(), { done: (r) => `Sent ${r.sent}${r.left ? `, ${r.left} still waiting` : ""}` })} />}>
                {`${plural(d.waiting, "email")} waiting for today's allowance.`}
              </Notice>
            ) : null}
            {d.paymentReady === false ? <Quiet>Mark paid needs a database step first. Ask the owner to paste it.</Quiet> : null}
            <FilterChips label="View" value={view} onChange={(v) => { setView(v); setPicked(new Set()); }} options={PEOPLE_VIEWS.map((v) => ({ id: v.id, name: v.label, count: count(v.id) }))} testID="people-view" />
            {shown.length ? (
              <View style={{ gap: space[1] }}>
                {canWrite ? (
                  <View style={{ flexDirection: "row", alignItems: "center", marginLeft: -space[2] }}>
                    <Check on={all} onPress={() => setPicked(all ? new Set() : new Set(shown.map((p) => p.key)))} label="Select everyone shown" testID="people-all" />
                    <T v="small" tone="muted" num>
                      {plural(shown.length, "person", "people")}
                    </T>
                  </View>
                ) : null}
                <View style={{ borderTopWidth: 1, borderColor: c.hairline }}>
                  {shown.map((p) => (
                    <View key={p.key} style={{ borderBottomWidth: 1, borderColor: c.hairline }}>
                      {canWrite ? (
                        <SelectRow
                          on={picked.has(p.key)}
                          label={`Select ${p.name}`}
                          onToggle={() =>
                            setPicked((s) => {
                              const n = new Set(s);
                              if (n.has(p.key)) n.delete(p.key);
                              else n.add(p.key);
                              return n;
                            })
                          }
                        >
                          <SwipeRow enabled={!p.paid} action={{ label: "Mark paid", onPress: () => void run("mark-paid", () => adminCalls.markPaid(p.key, true), { done: `${p.name} marked as paid` }) }} testID={`swipe-${p.key}`}>
                            <PersonLine p={p} onPress={() => router.push(`/admin/person/${encodeURIComponent(p.key)}`)} />
                          </SwipeRow>
                        </SelectRow>
                      ) : (
                        <PersonLine p={p} onPress={() => router.push(`/admin/person/${encodeURIComponent(p.key)}`)} />
                      )}
                    </View>
                  ))}
                </View>
              </View>
            ) : (
              <EmptyState mood="empty" title="Nobody here" body={view === "all" ? "People who enquire show here." : "No one is in this view right now."} />
            )}
            {picked.size ? (
              <View style={{ paddingTop: space[2] }}>
                <ActionBar count={picked.size} onClear={() => setPicked(new Set())} testID="people-bar">
                  <SmallButton label="Email them" icon={<Mail size={18} color={c.ink} />} onPress={() => setContact(true)} testID="people-email" />
                  <SmallButton label="WhatsApp" icon={<MessageCircle size={18} color={c.ink} />} onPress={() => setWaText(true)} testID="people-whatsapp" />
                </ActionBar>
              </View>
            ) : null}
            <ContactSheet
              open={contact}
              onClose={() => setContact(false)}
              count={picked.size}
              busy={busy === "contact"}
              mergeFields={d.mergeFields}
              allowance={d.allowance}
              onSend={(subject, text) =>
                void run("contact", () => adminCalls.contactPeople({ keys: [...picked], subject, text }), { done: (r) => [`Sent ${r.sent}`, r.queued ? `${r.queued} wait for tomorrow` : "", r.failed ? `${r.failed} failed` : ""].filter(Boolean).join(", ") }).then((r) => {
                  if (r) {
                    setContact(false);
                    setPicked(new Set());
                  }
                })
              }
            />
            <WhatsAppSheet
              open={waText}
              count={picked.size}
              busy={busy === "contact"}
              onClose={() => setWaText(false)}
              onMake={(text) =>
                void run("contact", () => adminCalls.whatsappPeople([...picked], text), { tag: "contact" }).then((links) => {
                  if (links) {
                    setWaText(false);
                    setWa(links);
                  }
                })
              }
            />
            <Sheet open={!!wa} onClose={() => setWa(null)} title="Open each chat" testID="wa-links">
              <View style={{ gap: space[2] }}>
                <T v="small" tone="muted">
                  Each opens WhatsApp with the message ready. Press send there.
                </T>
                <RowList>
                  {(wa ?? []).map((l) => (
                    <Row key={l.key} title={l.name} meta={l.url ? "Open in WhatsApp" : "No usable number"} onPress={l.url ? () => void Linking.openURL(l.url!) : undefined} testID={`wa-${l.key}`} />
                  ))}
                </RowList>
              </View>
            </Sheet>
          </>
        );
      }}
    </Loaded>
  );
}

/** WhatsApp a picked group: one message, with {first_name} filled for each. */
function WhatsAppSheet({ open, count, busy, onClose, onMake }: { open: boolean; count: number; busy?: boolean; onClose: () => void; onMake: (text: string) => void }) {
  const [text, setText] = React.useState("Hi {first_name}, ");
  const [error, setError] = React.useState<string | null>(null);
  return (
    <Sheet open={open} onClose={onClose} title={`WhatsApp ${plural(count, "person", "people")}`} testID="wa-sheet">
      <View style={{ gap: space[4] }}>
        <Field label="Message" value={text} onChangeText={setText} area error={error} maxLength={2000} hint="{first_name} becomes each person's first name." testID="wa-text" />
        <Button
          label="Make the links"
          busy={busy}
          testID="wa-make"
          onPress={() => {
            if (!text.trim()) return setError("Write the message first.");
            setError(null);
            onMake(text.trim());
          }}
        />
      </View>
    </Sheet>
  );
}

function Enquiries() {
  const q = useEnquiries();
  return (
    <Loaded q={q} soon what="enquiries" skeleton={<RowsSkeleton rows={4} />}>
      {(d) =>
        d.items.length ? (
          <RowList>
            {d.items.map((e) => (
              <Row key={e.id} testID={`enquiry-${e.id}`} unread={!e.answered} title={e.name} meta={`${ago(e.at)}${e.source ? ` · ${e.source}` : ""} · ${e.message}`} trailing={<Status tone={e.answered ? "quiet" : "warn"}>{e.answered ? "Answered" : "New"}</Status>} onPress={() => router.push(`/admin/person/${encodeURIComponent(e.personKey)}`)} />
            ))}
          </RowList>
        ) : (
          <EmptyState mood="empty" title="No enquiries" body="People who fill the enquiry form show here, newest first." />
        )
      }
    </Loaded>
  );
}

/** People: who to contact next. Quick views, search, and email several at once. */
export function AdminPeopleScreen() {
  const params = useLocalSearchParams<{ tab?: string; view?: string }>();
  const [tab, setTab] = React.useState<"pipeline" | "enquiries">(params.tab === "enquiries" ? "enquiries" : "pipeline");
  const { refresh, refreshing } = useRefreshAdmin();
  const initialView = (PEOPLE_VIEWS.some((v) => v.id === params.view) ? params.view : "all") as PeopleView;
  return (
    <Screen title="People" testID="admin-people" gap={space[4]} onRefresh={refresh} refreshing={refreshing}>
      <ScrollTabs
        tabs={[
          { id: "pipeline" as const, name: "Pipeline" },
          { id: "enquiries" as const, name: "Enquiries" },
        ]}
        value={tab}
        onChange={setTab}
      />
      {tab === "pipeline" ? <Pipeline initialView={initialView} /> : <Enquiries />}
    </Screen>
  );
}

const FOLLOW = [
  { id: "none", name: "No follow-up", days: null },
  { id: "1", name: "Tomorrow", days: 1 },
  { id: "3", name: "In 3 days", days: 3 },
  { id: "7", name: "Next week", days: 7 },
] as const;

/** One person: contact them, move them along, write a note. The timeline is the page. */
export function AdminPersonScreen() {
  const c = useTheme();
  const { key = "" } = useLocalSearchParams<{ key: string }>();
  const q = usePerson(String(key));
  const { canWrite } = useAdminRole();
  const { run, busy } = useAdminAction();
  const [stageOpen, setStageOpen] = React.useState(false);
  const [stage, setStage] = React.useState<StageId | null>(null);
  const [follow, setFollow] = React.useState<(typeof FOLLOW)[number]["id"]>("none");
  const [noteOpen, setNoteOpen] = React.useState(false);
  const [note, setNote] = React.useState("");
  const [noteError, setNoteError] = React.useState<string | null>(null);
  const [link, setLink] = React.useState<LoginLinkResult | null>(null);
  const icon = { size: 18, color: c.ink };
  return (
    <Screen testID="admin-person" gap={space[5]} onRefresh={() => void q.refetch()} refreshing={q.isRefetching}>
      <Loaded q={q} soon what="this person" skeleton={<RowsSkeleton rows={6} />}>
        {(p) => (
          <>
            <View style={{ gap: space[2] }}>
              <T v="h1">{p.name}</T>
              <View style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center", columnGap: space[3], rowGap: space[1] }}>
                <Status tone={stageTone(p.stage)}>{STAGE_LABEL[p.stage]}</Status>
                {p.paid ? <Tag>Paid</Tag> : null}
                {p.isStudent ? <Tag>Student</Tag> : null}
                {followUpLine(p.followUpAt) ? (
                  <T v="small" tone="muted">
                    {followUpLine(p.followUpAt)}
                  </T>
                ) : null}
              </View>
            </View>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space[2] }}>
              {p.whatsappUrl || p.phone ? <SmallButton label="WhatsApp" icon={<MessageCircle {...icon} />} onPress={() => void Linking.openURL(p.whatsappUrl ?? whatsapp(p.phone!))} testID="person-whatsapp" /> : null}
              {p.phone ? <SmallButton label="Call" icon={<Phone {...icon} />} onPress={() => void Linking.openURL(`tel:+91${p.phone!.replace(/\D/g, "").slice(-10)}`)} /> : null}
              <SmallButton label="Email" icon={<Mail {...icon} />} onPress={() => void Linking.openURL(`mailto:${p.email}`)} />
              {p.studentId ? <SmallButton label="Open student" onPress={() => openStudent(p.studentId!)} /> : null}
            </View>
            {canWrite ? (
              <View style={{ gap: space[2] }}>
                <T v="h3">Next step</T>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space[2] }}>
                  <SmallButton
                    label="Move stage"
                    testID="person-stage"
                    onPress={() => {
                      setStage(p.stage);
                      setStageOpen(true);
                    }}
                  />
                  <SmallButton label="Add a note" testID="person-note" onPress={() => setNoteOpen(true)} />
                  {!p.isStudent ? <SmallButton label={p.invitedAt ? "Send invite again" : "Send invite"} testID="person-invite" busy={busy === "invite"} onPress={() => void run("invite", () => adminCalls.invite(p.key, p.name), { done: `Invitation sent to ${p.name}` }).then((x) => x && setLink(x))} /> : null}
                  <SmallButton label={p.paid ? "Mark not paid" : "Mark paid"} testID="person-paid" busy={busy === "mark-paid"} onPress={() => void run("mark-paid", () => adminCalls.markPaid(p.key, !p.paid), { done: p.paid ? "Marked as not paid" : "Marked as paid" })} />
                </View>
              </View>
            ) : (
              <Notice testID="view-only-note">{VIEW_ONLY_LINE}</Notice>
            )}
            <View style={{ gap: space[3] }}>
              <T v="h3">Timeline</T>
              {p.timeline.length ? (
                <RowList>
                  {p.timeline.map((t, i) => (
                    <Row key={i} icon={<Dot tone={t.tone} />} title={t.title} meta={[t.body, ago(t.at)].filter(Boolean).join(" · ")} />
                  ))}
                </RowList>
              ) : (
                <Quiet>Nothing yet.</Quiet>
              )}
            </View>
            <View style={{ gap: space[3] }}>
              <T v="h3">Details</T>
              <Facts items={[{ label: "Email", value: p.email }, { label: "Phone", value: p.phone ? (p.phone.startsWith("+") ? p.phone : `+91 ${p.phone}`) : "Not given" }, ...p.facts, ...(p.invitedAt ? [{ label: "Invited", value: day(p.invitedAt) }] : []), ...(p.paidAt ? [{ label: "Paid", value: `${day(p.paidAt)}${p.paidAmount ? `, ${p.paidAmount}` : ""}` }] : [])]} />
            </View>

            <Sheet open={stageOpen} onClose={() => setStageOpen(false)} title="Move stage" testID="stage-sheet">
              <View style={{ gap: space[4] }}>
                <View accessibilityRole="radiogroup">
                  {STAGES.map((s) => (
                    <OptionRow key={s.id} label={s.label} on={stage === s.id} onPress={() => setStage(s.id)} testID={`stage-${s.id}`} />
                  ))}
                </View>
                <View style={{ gap: space[1] }}>
                  <T v="small" tone="muted">
                    Follow up
                  </T>
                  <Chips label="Follow up" value={follow} onChange={setFollow} options={FOLLOW.map((f) => ({ id: f.id, name: f.name }))} />
                </View>
                <Button
                  label="Save"
                  busy={busy === "move-stage"}
                  testID="stage-save"
                  onPress={() => {
                    const days = FOLLOW.find((f) => f.id === follow)?.days ?? null;
                    const followUpAt = days ? new Date(Date.now() + days * 86400_000).toISOString() : null;
                    void run("move-stage", () => adminCalls.moveStage(p.key, { stage: stage ?? p.stage, followUpAt }), { done: `Moved to ${STAGE_LABEL[stage ?? p.stage]}` }).then((r) => r && setStageOpen(false));
                  }}
                />
              </View>
            </Sheet>
            <Sheet open={noteOpen} onClose={() => setNoteOpen(false)} title="Add a note" testID="note-sheet">
              <View style={{ gap: space[4] }}>
                <Field label="Note" value={note} onChangeText={setNote} area error={noteError} maxLength={2000} testID="note-text" />
                <Button
                  label="Save note"
                  busy={busy === "note"}
                  testID="note-save"
                  onPress={() => {
                    if (!note.trim()) return setNoteError("Write the note first.");
                    setNoteError(null);
                    void run("note", () => adminCalls.note(p.key, note.trim()), { done: "Note saved" }).then((r) => {
                      if (r) {
                        setNote("");
                        setNoteOpen(false);
                      }
                    });
                  }}
                />
              </View>
            </Sheet>
            <LinkSheet title="Invitation sent" link={link} name={p.name} mobile={p.phone} onClose={() => setLink(null)} />
          </>
        )}
      </Loaded>
    </Screen>
  );
}
