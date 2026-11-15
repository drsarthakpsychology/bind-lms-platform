import { router, useLocalSearchParams } from "expo-router";
import { CheckCircle2, Circle, MessageSquare } from "lucide-react-native";
import * as React from "react";
import { Linking, ScrollView, Share, View } from "react-native";

import { Button, Loaded, Row, RowList, RowsSkeleton, Screen, Sheet, TabRow, T } from "@/ds";
import { layout, space, useTheme } from "@/theme";
import { adminCalls, useAdminAction, useStudentCredentials, useStudentDoubts, useStudentMessages, useStudentProfile } from "../api";
import type { AdminStudentRow, StudentDetail } from "../contract";
import type { LoginLinkResult } from "../extra";
import { ACCOUNT_NEXT, accountLabel, accountTone, ago, day, FLAG_LABEL, minutes, nextStep, pct, whatsapp } from "../format";
import { Block, ConfirmSheet, DayBars, Facts, Figures, Meter, Notice, Quiet, SmallButton, Status, Tag, Tags } from "../kit";
import { openCompose } from "../nav";
import { useAdminRole } from "../role";
import { CertLine } from "./certificates";

const TABS = [
  { id: "overview" as const, name: "Overview" },
  { id: "access" as const, name: "Access" },
  { id: "activity" as const, name: "Activity" },
  { id: "credentials" as const, name: "Credentials" },
  { id: "messages" as const, name: "Messages" },
];
type Tab = (typeof TABS)[number]["id"];

/** Underlined tabs that slide sideways when they do not fit a narrow phone. */
export function ScrollTabs<V extends string>({ tabs, value, onChange }: { tabs: { id: V; name: string }[]; value: V; onChange: (v: V) => void }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -layout.gutter, flexGrow: 0 }} contentContainerStyle={{ paddingHorizontal: layout.gutter, minWidth: "100%" }}>
      <View style={{ flex: 1 }}>
        <TabRow tabs={tabs} value={value} onChange={onChange} />
      </View>
    </ScrollView>
  );
}

/** The login link sheet: the link was emailed; it can also go by WhatsApp. */
export function LinkSheet({ link, name, mobile, onClose, title = "Login link sent" }: { link: LoginLinkResult | null; name: string; mobile: string | null; onClose: () => void; title?: string }) {
  return (
    <Sheet open={!!link} onClose={onClose} title={title} testID="link-sheet">
      <View style={{ gap: space[4] }}>
        <T tone="muted">{link?.emailed ? `${name} has it by email. It replaces older links${link.expiresAt ? ` and works until ${day(link.expiresAt, true)}` : ""}.` : "The link is ready. Send it to them yourself."}</T>
        {link?.url ? (
          <T v="small" selectable style={{ fontFamily: "Archivo-500" }}>
            {link.url}
          </T>
        ) : null}
        {link?.url && mobile ? <Button label="Send on WhatsApp" onPress={() => void Linking.openURL(`${whatsapp(mobile)}?text=${encodeURIComponent(`Your VIBHA login link: ${link.url}`)}`)} /> : null}
        {link?.url ? (
          <Button kind="quiet" label="Share the link" onPress={() => void Share.share({ message: link.url! }).catch(() => undefined)} />
        ) : null}
        <Button kind="text" full label="Done" onPress={onClose} />
      </View>
    </Sheet>
  );
}

function Overview({ r, d }: { r: AdminStudentRow; d: StudentDetail | null }) {
  const doubts = useStudentDoubts(r.id);
  return (
    <>
      <Block title="Progress">
        {r.lecturesAvailable ? <Meter pct={pct(r.lecturesDone, r.lecturesAvailable)} label={`${r.lecturesDone} of ${r.lecturesAvailable} lectures`} /> : <T v="small" tone="muted">No lectures open yet.</T>}
        <Figures
          items={[
            { value: minutes(r.minutes7), label: "this week" },
            { value: minutes(d?.totals.min30 ?? 0), label: "in 30 days" },
            { value: String(r.activeDays30), label: "days active in 30" },
            { value: String(r.xp), label: "XP in Notes and Games" },
          ]}
        />
      </Block>
      <Block title="Their doubts" count={doubts.data?.items.length || undefined}>
        {doubts.data?.items.length ? (
          <RowList>
            {doubts.data.items.map((x) => (
              <Row key={x.id} title={x.title} meta={`${x.kind === "complaint" ? "Private concern · " : ""}${ago(x.createdAt)}`} trailing={<Status tone={x.status === "solved" ? "ok" : x.replies ? "quiet" : "warn"}>{x.status === "solved" ? "Solved" : x.replies ? "Open" : "No answer yet"}</Status>} onPress={() => router.push(`/admin/doubt/${x.id}`)} />
            ))}
          </RowList>
        ) : (
          <Quiet>No doubts asked yet.</Quiet>
        )}
      </Block>
      <Block title="Their details">
        <Facts
          items={[
            { label: "Access", value: r.scope === "full" ? "Full platform" : "Lectures only" },
            { label: "Access ends", value: r.expiresAt ? day(r.expiresAt) : "No end date" },
            { label: "Mobile", value: r.mobileNumber ? `+91 ${r.mobileNumber}` : "Not given", onPress: r.mobileNumber ? () => void Linking.openURL(whatsapp(r.mobileNumber!)) : undefined },
            { label: "Email", value: r.email, onPress: () => void Linking.openURL(`mailto:${r.email}`) },
            ...(d?.profile.created_at ? [{ label: "Joined", value: day(d.profile.created_at) }] : []),
          ]}
        />
      </Block>
    </>
  );
}

function Access({ r }: { r: AdminStudentRow }) {
  const { canWrite } = useAdminRole();
  const { run, busy } = useAdminAction();
  const [lockOpen, setLockOpen] = React.useState(false);
  const [link, setLink] = React.useState<LoginLinkResult | null>(null);
  const locked = r.blocked || r.account === "locked";
  return (
    <>
      <Block title="Login">
        <Status tone={accountTone(r.account)} strong>
          {accountLabel(r.account)}
        </Status>
        {ACCOUNT_NEXT[r.account] ? (
          <T v="small" tone="muted">
            {ACCOUNT_NEXT[r.account]}
          </T>
        ) : null}
        {canWrite ? (
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space[2] }}>
            <SmallButton label="Send login link" testID="access-link" busy={busy === "login-link"} onPress={() => void run("login-link", () => adminCalls.loginLink(r.id)).then((x) => x && setLink(x))} />
            {locked ? <SmallButton label="Unlock" testID="access-unlock" busy={busy === "unlock"} onPress={() => void run("unlock", () => adminCalls.unlock(r.id), { done: `${r.name} can sign in again` })} /> : <SmallButton label="Lock" danger testID="access-lock" onPress={() => setLockOpen(true)} />}
          </View>
        ) : null}
        <T v="small" tone="muted">
          Lock means they cannot sign in until unlocked. A new login link replaces older ones.
        </T>
      </Block>
      <Block title="Phone">
        <T v="small" tone="muted">
          Students can change phone twice a month. After that the app asks them to message you.
        </T>
        {canWrite ? <SmallButton label="Allow one more phone change" testID="access-phone" busy={busy === "allow-phone-change"} onPress={() => void run("allow-phone-change", () => adminCalls.allowPhoneChange(r.id), { done: "They can change phone again now" })} /> : null}
      </Block>
      <Block title="Switch sections off">
        <Row title="Section switches" meta="On the website: hide Notes, Games or a practice tool for this student" onPress={() => void Linking.openURL(`https://vibhapsychology.com/admin/students/${r.id}?tab=access`)} />
      </Block>
      <ConfirmSheet open={lockOpen} onClose={() => setLockOpen(false)} title={`Lock ${r.name}?`} body="They are signed out and cannot sign in until you unlock them." confirm="Lock account" danger busy={busy === "lock"} reason={{ label: "Reason (only admins see it)" }} onConfirm={(reason) => void run("lock", () => adminCalls.lock(r.id, reason || undefined), { done: `${r.name} is locked` }).then(() => setLockOpen(false))} testID="confirm-lock" />
      <LinkSheet link={link} name={r.name} mobile={r.mobileNumber} onClose={() => setLink(null)} />
    </>
  );
}

function ActivityTab({ r, d }: { r: AdminStudentRow; d: StudentDetail | null }) {
  const c = useTheme();
  if (!d) return <Quiet>No activity loaded.</Quiet>;
  return (
    <>
      <Figures
        items={[
          { value: minutes(d.totals.min30), label: "in 30 days" },
          { value: String(d.totals.activeDays), label: "days active" },
          { value: `${r.lecturesDone}/${r.lecturesAvailable}`, label: "lectures finished" },
          { value: d.learn ? `${d.learn.streak}` : "0", label: "day streak" },
        ]}
      />
      <Block title="Minutes per day">
        <DayBars days={d.daily} />
      </Block>
      <Block title="Timeline">
        {d.recent.length ? (
          <RowList>
            {d.recent.slice(0, 12).map((e, i) => (
              <Row key={i} title={e.what} meta={`${ago(e.at)}${e.min ? ` · ${e.min} min` : ""}`} />
            ))}
          </RowList>
        ) : (
          <Quiet>Nothing in the last 30 days.</Quiet>
        )}
      </Block>
      <Block title="Lectures">
        <RowList>
          {d.lectures.map((l) => (
            <Row key={l.id} icon={l.done ? <CheckCircle2 size={18} color={c.link} accessibilityLabel="Finished" /> : <Circle size={18} color={c.muted} accessibilityLabel="Not finished" />} title={l.title} meta={l.week ? `Week ${l.week}` : undefined} trailing={l.watchedMin ? `${l.watchedMin} min` : "Not opened"} />
          ))}
        </RowList>
      </Block>
      {d.learn ? (
        <Block title="Notes and Games">
          <T v="small">
            Level {d.learn.level.title} · {d.learn.xp} XP{d.learn.accuracy !== null ? ` · ${d.learn.accuracy}% right` : ""} · {d.learn.badges} badges
          </T>
          {d.learn.confusions.length ? (
            <T v="small" tone="muted">
              Mixes up: {d.learn.confusions.join(", ")}
            </T>
          ) : null}
        </Block>
      ) : null}
    </>
  );
}

function Credentials({ r }: { r: AdminStudentRow }) {
  const q = useStudentCredentials(r.id);
  const { canWrite } = useAdminRole();
  return (
    <Block title="Credentials" count={q.data?.items.length || undefined} action={canWrite ? { label: "Issue one", onPress: () => router.push(`/admin/certificates/new?to=${r.id}`), testID: "issue-for-student" } : undefined}>
      <Loaded q={q} soon what="credentials">
        {(d) =>
          d.items.length ? (
            <RowList>
              {d.items.map((x) => (
                <CertLine key={x.credentialId} x={x} onPress={() => router.push(`/admin/certificates?open=${x.credentialId}`)} />
              ))}
            </RowList>
          ) : (
            <Quiet>No certificates or badges yet.</Quiet>
          )
        }
      </Loaded>
    </Block>
  );
}

function Messages({ r }: { r: AdminStudentRow }) {
  const q = useStudentMessages(r.id);
  return (
    <Block title="Messages sent to them">
      <Loaded q={q} soon what="messages">
        {(d) =>
          d.items.length ? (
            <RowList>
              {d.items.map((m) => (
                <Row key={m.id} title={m.title} meta={`${ago(m.at)} · from ${m.from}`} trailing={<Status tone={m.opened ? "ok" : "quiet"}>{m.opened ? "Opened" : "Not opened"}</Status>} />
              ))}
            </RowList>
          ) : (
            <Quiet>Nothing sent yet.</Quiet>
          )
        }
      </Loaded>
    </Block>
  );
}

/** One student: who, the one next step, then tabs for the detail. */
export function AdminStudentView({ r, d, tab, onTab }: { r: AdminStudentRow; d: StudentDetail | null; tab: Tab; onTab: (t: Tab) => void }) {
  const { canWrite } = useAdminRole();
  const { run, busy } = useAdminAction();
  const [link, setLink] = React.useState<LoginLinkResult | null>(null);
  const next = nextStep(r);
  const doNext = () => {
    if (next.action === "unlock") void run("unlock", () => adminCalls.unlock(r.id), { done: `${r.name} can sign in again` });
    else if (next.action === "login-link") void run("login-link", () => adminCalls.loginLink(r.id)).then((x) => x && setLink(x));
    else if (next.action === "message") openCompose({ to: [r.id], title: "Checking in" });
  };
  return (
    <>
      <View style={{ gap: space[2] }}>
        <T v="h1">{r.name}</T>
        <T v="small" tone="muted" num>
          {r.rollNumber ?? "No roll number"} · {r.email}
        </T>
        <View style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center", columnGap: space[4], rowGap: space[2], paddingTop: space[1] }}>
          <Status tone={accountTone(r.account)}>{accountLabel(r.account)}</Status>
          <Status tone={r.presence === "now" ? "ok" : "quiet"}>{r.presence === "now" ? "On VIBHA now" : `Last seen ${ago(r.lastSeen).toLowerCase()}`}</Status>
          <T v="small" tone="muted">
            {r.scope === "full" ? "Full platform" : "Lectures only"}
          </T>
        </View>
        <Tags>
          {r.cohorts.length ? r.cohorts.map((c) => <Tag key={c.id}>{c.name}</Tag>) : <Tag>No cohort</Tag>}
          {r.flags.map((f) => (
            <Tag key={f} tone="warn">
              {FLAG_LABEL[f]}
            </Tag>
          ))}
        </Tags>
      </View>
      <Notice testID="next-step" action={canWrite && next.action ? <SmallButton label={next.label} busy={!!busy} onPress={doNext} testID="next-step-do" /> : undefined}>
        <T v="small">
          <T v="small" style={{ fontFamily: "Archivo-700" }}>
            Next: {next.label}.
          </T>{" "}
          <T v="small" tone="muted">
            {next.why}
          </T>
        </T>
      </Notice>
      <ScrollTabs tabs={TABS} value={tab} onChange={onTab} />
      {tab === "overview" ? <Overview r={r} d={d} /> : tab === "access" ? <Access r={r} /> : tab === "activity" ? <ActivityTab r={r} d={d} /> : tab === "credentials" ? <Credentials r={r} /> : <Messages r={r} />}
      <LinkSheet link={link} name={r.name} mobile={r.mobileNumber} onClose={() => setLink(null)} />
    </>
  );
}

export function AdminStudentScreen() {
  const c = useTheme();
  const params = useLocalSearchParams<{ id: string; tab?: string }>();
  const id = String(params.id ?? "");
  const q = useStudentProfile(id);
  const [tab, setTab] = React.useState<Tab>(TABS.some((t) => t.id === params.tab) ? (params.tab as Tab) : "overview");
  const { canWrite } = useAdminRole();
  return (
    <Screen testID="admin-student" gap={space[5]} onRefresh={() => void q.refetch()} refreshing={q.isRefetching} footer={canWrite && q.data?.row ? <Button label="Message" icon={<MessageSquare size={20} color={c.onPrimary} />} onPress={() => openCompose({ to: [id] })} testID="student-message" /> : undefined}>
      <Loaded q={q} soon what="this student" skeleton={<RowsSkeleton rows={6} />}>
        {(p) => (p.row ? <AdminStudentView r={p.row} d={(p.detail as unknown as StudentDetail) ?? null} tab={tab} onTab={setTab} /> : <Quiet>This student could not be found.</Quiet>)}
      </Loaded>
    </Screen>
  );
}
