import { router, useLocalSearchParams } from "expo-router";
import { Mail, MessageCircle, Phone } from "lucide-react-native";
import * as React from "react";
import { Linking, View } from "react-native";

import { Button, Chips, EmptyState, Field, Loaded, Row, RowList, RowsSkeleton, Screen, Sheet, T } from "@/ds";
import { space, useTheme } from "@/theme";
import { adminCalls, useAdminAction, useEnquiries, usePeople, usePerson, useRefreshAdmin } from "../api";
import { PEOPLE_VIEWS, STAGE_LABEL, STAGES, type LoginLinkResult, type PeopleView, type PersonRow, type StageId } from "../extra";
import { ago, day, followUpLine, inPeopleView, plural, whatsapp, type Tone } from "../format";
import { ActionBar, Check, Dot, Facts, Notice, OptionRow, Quiet, SearchBox, SelectRow, SmallButton, Status, Tag } from "../kit";
import { openStudent } from "../nav";
import { useAdminRole, VIEW_ONLY_LINE } from "../role";
import { LinkSheet, ScrollTabs } from "./student";

export function stageTone(s: StageId): Tone {
  return s === "joined" ? "ok" : s === "new" ? "warn" : s === "no_reply" || s === "not_interested" ? "quiet" : "info";
}

/** Email several people, one email each (never one email with everyone in it). */
export function ContactSheet({ open, onClose, count, onSend, busy }: { open: boolean; onClose: () => void; count: number; onSend: (subject: string, text: string) => void; busy?: boolean }) {
  const [subject, setSubject] = React.useState("");
  const [text, setText] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  return (
    <Sheet open={open} onClose={onClose} title={`Email ${plural(count, "person", "people")}`} testID="contact-sheet">
      <View style={{ gap: space[4] }}>
        <T v="small" tone="muted">
          Each one gets their own email, with their name at the top.
        </T>
        <Field label="Subject" value={subject} onChangeText={setSubject} maxLength={150} testID="contact-subject" />
        <Field label="Message" value={text} onChangeText={setText} area error={error} maxLength={4000} testID="contact-text" />
        <Button
          label="Send"
          busy={busy}
          testID="contact-send"
          onPress={() => {
            if (!subject.trim() || !text.trim()) return setError("Write a subject and a message.");
            setError(null);
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
  const q = usePeople();
  const { canWrite } = useAdminRole();
  const { run, busy } = useAdminAction();
  const [view, setView] = React.useState<PeopleView>(initialView);
  const [search, setSearch] = React.useState("");
  const [picked, setPicked] = React.useState<Set<string>>(new Set());
  const [contact, setContact] = React.useState(false);
  return (
    <Loaded q={q} soon what="the pipeline" skeleton={<RowsSkeleton rows={6} />}>
      {(d) => {
        const needle = search.trim().toLowerCase();
        const shown = d.items.filter((p) => inPeopleView(p, view) && (!needle || `${p.name} ${p.email} ${p.phone ?? ""}`.toLowerCase().includes(needle)));
        const count = (v: PeopleView) => d.items.filter((p) => inPeopleView(p, v)).length;
        const all = shown.length > 0 && shown.every((p) => picked.has(p.key));
        return (
          <>
            <View style={{ flexDirection: "row" }}>
              <SearchBox value={search} onChange={setSearch} placeholder="Name, email or phone" label="Search people" testID="people-search" />
            </View>
            <Chips scroll label="View" value={view} onChange={setView} options={PEOPLE_VIEWS.map((v) => ({ id: v.id, name: `${v.label} ${count(v.id)}` }))} />
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
                          <PersonLine p={p} onPress={() => router.push(`/admin/person/${encodeURIComponent(p.key)}`)} />
                        </SelectRow>
                      ) : (
                        <PersonLine p={p} onPress={() => router.push(`/admin/person/${encodeURIComponent(p.key)}`)} />
                      )}
                    </View>
                  ))}
                </View>
              </View>
            ) : (
              <EmptyState mood="sleepy" title="Nobody here" body={view === "all" ? "People who enquire show here." : "No one is in this view right now."} />
            )}
            {picked.size ? (
              <View style={{ paddingTop: space[2] }}>
                <ActionBar count={picked.size} onClear={() => setPicked(new Set())} testID="people-bar">
                  <SmallButton label="Email them" icon={<Mail size={18} color={c.ink} />} onPress={() => setContact(true)} testID="people-email" />
                </ActionBar>
              </View>
            ) : null}
            <ContactSheet
              open={contact}
              onClose={() => setContact(false)}
              count={picked.size}
              busy={busy === "contact"}
              onSend={(subject, text) =>
                void run("contact", () => adminCalls.contactPeople({ keys: [...picked], subject, text }), { done: (r) => `Sent ${r.sent}${r.failed ? `, ${r.failed} failed` : ""}` }).then((r) => {
                  if (r) {
                    setContact(false);
                    setPicked(new Set());
                  }
                })
              }
            />
          </>
        );
      }}
    </Loaded>
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
          <EmptyState mood="sleepy" title="No enquiries" body="People who fill the enquiry form show here, newest first." />
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
              {p.phone ? <SmallButton label="WhatsApp" icon={<MessageCircle {...icon} />} onPress={() => void Linking.openURL(whatsapp(p.phone!))} testID="person-whatsapp" /> : null}
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
                  {!p.isStudent ? <SmallButton label={p.invitedAt ? "Send invite again" : "Send invite"} testID="person-invite" busy={busy === "invite"} onPress={() => void run("invite", () => adminCalls.invite(p.key), { done: `Invitation sent to ${p.name}` }).then((x) => x && setLink(x))} /> : null}
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
              <Facts items={[{ label: "Email", value: p.email }, { label: "Phone", value: p.phone ? `+91 ${p.phone}` : "Not given" }, ...p.facts, ...(p.invitedAt ? [{ label: "Invited", value: day(p.invitedAt) }] : [])]} />
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
