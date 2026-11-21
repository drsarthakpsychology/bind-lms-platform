import { useLocalSearchParams } from "expo-router";
import * as React from "react";
import { openLink } from "@/lib/open";
import { FileText, Mic } from "lucide-react-native";
import { View } from "react-native";

import { Button, Chips, Field, Row, RowList, RowsSkeleton, Sheet, T } from "@/ds";
import { EmptyState, Screen } from "../ui";
import { messageOf } from "@/api/errors";
import { toast } from "@/ds/toast";
import { space, useTheme } from "@/theme";
import { adminCalls, useAdminAction, useRefreshAdmin, useSignOffs, useSubmissions } from "../api";
import type { SignOff, Submission } from "../extra";
import { ago, day } from "../format";
import { ConfirmSheet, Facts, Loaded, Notice, ScrollTabs, Status, TabSwap } from "../kit";
import { openStudent } from "../nav";
import { useAdminRole, VIEW_ONLY_LINE } from "../role";

/**
 * A score is optional (the website's Return feedback), and when given it is a
 * whole or half number from 0 to the most marks. Pure, so it is tested.
 */
export function checkGrade(raw: string, max: number, optional = false): { grade: number | null } | { error: string } {
  if (optional && !raw.trim()) return { grade: null };
  const g = Number(raw.replace(",", ".").trim());
  if (!raw.trim() || !Number.isFinite(g)) return { error: `Give a grade from 0 to ${max}.` };
  if (g < 0 || g > max) return { error: `Give a grade from 0 to ${max}.` };
  if (Math.round(g * 2) !== g * 2) return { error: "Use whole or half marks." };
  return { grade: g };
}

/** Open a hand-in's file or recording: a short-lived address from the server. */
async function openFile(get: () => Promise<{ url: string }>) {
  try {
    const r = await get();
    if (r?.url) await openLink(r.url);
  } catch (e) {
    toast.show(messageOf(e));
  }
}

function GradeSheet({ s, onClose }: { s: Submission | null; onClose: () => void }) {
  const c = useTheme();
  const { canWrite } = useAdminRole();
  const { run, busy } = useAdminAction();
  const [grade, setGrade] = React.useState(s?.grade !== null && s?.grade !== undefined ? String(s.grade) : "");
  const [feedback, setFeedback] = React.useState(s?.feedback ?? "");
  const [error, setError] = React.useState<string | null>(null);
  if (!s) return null;
  const save = async () => {
    const g = checkGrade(grade, s.maxGrade, true);
    if ("error" in g) return setError(g.error);
    if (g.grade === null && !feedback.trim()) return setError("Write feedback, or approve it as it is.");
    setError(null);
    const r = await run("grade", () => adminCalls.grade(s.id, { score: g.grade, feedback: feedback.trim() }), { done: `Feedback sent. ${s.studentName} sees it as graded.` });
    if (r) onClose();
  };
  const approve = async () => {
    const r = await run("grade", () => adminCalls.approve(s.id), { done: `Approved. ${s.studentName} gets a notice.` });
    if (r) onClose();
  };
  return (
    <Sheet open onClose={onClose} title={s.assignment} testID="grade-sheet">
      <View style={{ gap: space[4] }}>
        <T v="small" tone="muted">
          {s.studentName} · sent {ago(s.submittedAt)}
        </T>
        <Button
          kind="text"
          label="Open their page"
          onPress={() => {
            onClose();
            openStudent(s.studentId);
          }}
        />
        {s.files?.length ? (
          <RowList>
            {s.files.map((f) => (
              <Row key={f.id} icon={<FileText size={20} color={c.muted} />} title={f.name} meta={f.format ? f.format.toUpperCase() : "File"} onPress={() => void openFile(() => adminCalls.submissionFile(s.id, f.id))} testID={`sub-file-${f.id}`} />
            ))}
          </RowList>
        ) : s.file ? (
          <Row title={s.file} meta="A file. Open it on the website to read it." />
        ) : null}
        {s.hasAudio ? <Row icon={<Mic size={20} color={c.muted} />} title="Voice answer" meta="Opens in your player" onPress={() => void openFile(() => adminCalls.submissionAudio(s.id))} /> : null}
        {s.late ? <Status tone="warn">Sent late</Status> : null}
        {s.answer ? <T>{s.answer}</T> : null}
        {canWrite ? (
          <>
            <Field label="Feedback for the student" value={feedback} onChangeText={setFeedback} area maxLength={4000} testID="grade-feedback" />
            <Field label={`Score out of ${s.maxGrade} (if you give one)`} value={grade} onChangeText={setGrade} keyboardType="decimal-pad" error={error} maxLength={5} testID="grade-value" />
            <Button label={s.status === "graded" ? "Send new feedback" : "Send feedback"} busy={busy === "grade"} onPress={() => void save()} testID="grade-save" />
            {s.status === "pending" ? <Button kind="quiet" label="Approve as it is" busy={busy === "grade"} onPress={() => void approve()} testID="grade-approve" /> : null}
          </>
        ) : (
          <>
            {s.status === "graded" ? <Facts items={[{ label: "Score", value: s.grade === null ? (s.reviewed === "approved" ? "Approved" : "None") : `${s.grade} of ${s.maxGrade}` }, { label: "Feedback", value: s.feedback ?? "None" }]} /> : null}
            <Notice>{VIEW_ONLY_LINE}</Notice>
          </>
        )}
      </View>
    </Sheet>
  );
}

function SignOffSheet({ x, onClose }: { x: SignOff | null; onClose: () => void }) {
  const { canWrite } = useAdminRole();
  const { run, busy } = useAdminAction();
  const [rejecting, setRejecting] = React.useState(false);
  if (!x) return null;
  const decide = async (decision: "signed" | "rejected") => {
    const r = await run("sign-off", () => adminCalls.signOff(x.id, { decision }), { done: decision === "signed" ? `Signed for ${x.studentName}` : "Rejected" });
    if (r) onClose();
  };
  return (
    <Sheet open onClose={onClose} title={x.activity} testID="signoff-sheet">
      <View style={{ gap: space[4] }}>
        <Facts
          items={[
            { label: "Student", value: x.studentName },
            { label: "Hours", value: String(x.hours) },
            { label: "Date", value: day(x.date) },
            { label: "Supervisor", value: x.supervisor ?? "Not named" },
            ...(x.competency ? [{ label: "Skill", value: x.competency }] : []),
          ]}
        />
        {canWrite ? (
          <>
            <T v="small" tone="muted">Check the contact hours, then sign or reject.</T>
            <Button label="Sign" busy={busy === "sign-off"} onPress={() => void decide("signed")} testID="signoff-sign" />
            <Button kind="danger" full label="Reject" onPress={() => setRejecting(true)} testID="signoff-reject" />
            <ConfirmSheet open={rejecting} onClose={() => setRejecting(false)} title="Reject this entry?" body={`${x.studentName} will see it was not signed.`} confirm="Reject" danger busy={busy === "sign-off"} onConfirm={() => void decide("rejected")} testID="confirm-signoff-reject" />
          </>
        ) : (
          <Notice>{VIEW_ONLY_LINE}</Notice>
        )}
      </View>
    </Sheet>
  );
}

function Submissions() {
  const [status, setStatus] = React.useState<"pending" | "graded" | "">("pending");
  const q = useSubmissions(status);
  const [open, setOpen] = React.useState<Submission | null>(null);
  return (
    <>
      <Chips
        label="Show"
        value={status}
        onChange={setStatus}
        options={[
          { id: "pending" as const, name: "Waiting" },
          { id: "graded" as const, name: "Graded" },
          { id: "" as const, name: "All" },
        ]}
      />
      <Loaded q={q} soon what="hand-ins" skeleton={<RowsSkeleton rows={4} />}>
        {(d) =>
          d.items.length ? (
            <RowList>
              {d.items.map((s) => (
                <Row key={s.id} testID={`sub-${s.id}`} title={s.studentName} meta={`${s.assignment} · ${ago(s.submittedAt)}`} trailing={<Status tone={s.status === "graded" ? "ok" : "warn"}>{s.status === "graded" ? (s.grade !== null ? `${s.grade}/${s.maxGrade}` : s.reviewed === "approved" ? "Approved" : "Returned") : "To grade"}</Status>} onPress={() => setOpen(s)} />
              ))}
            </RowList>
          ) : (
            <EmptyState mood={status === "pending" ? "clear" : "empty"} title={status === "pending" ? "Nothing to grade" : "Nothing here"} body={status === "pending" ? "New hand-ins land here." : undefined} />
          )
        }
      </Loaded>
      <GradeSheet key={open?.id ?? "none"} s={open} onClose={() => setOpen(null)} />
    </>
  );
}

function SignOffs() {
  const q = useSignOffs();
  const [open, setOpen] = React.useState<SignOff | null>(null);
  return (
    <>
      <T v="small" tone="muted">
        Supervision entries students asked you to sign. Check the hours, then sign or send back.
      </T>
      <Loaded q={q} soon what="sign-offs" skeleton={<RowsSkeleton rows={3} />}>
        {(d) =>
          d.items.length ? (
            <RowList>
              {d.items.map((x) => (
                <Row key={x.id} testID={`signoff-${x.id}`} title={x.activity} meta={`${x.studentName} · ${x.hours} h · ${day(x.date, true)}`} onPress={() => setOpen(x)} />
              ))}
            </RowList>
          ) : (
            <EmptyState mood="clear" title="No sign-off requests" body="When a student asks for one, it lands here." />
          )
        }
      </Loaded>
      <SignOffSheet key={open?.id ?? "none"} x={open} onClose={() => setOpen(null)} />
    </>
  );
}

/** Review: hand-ins to grade and supervision sign-offs. */
export function AdminReviewScreen() {
  const params = useLocalSearchParams<{ tab?: string }>();
  const [tab, setTab] = React.useState<"subs" | "signoffs">(params.tab === "signoffs" ? "signoffs" : "subs");
  const subs = useSubmissions("pending");
  const so = useSignOffs();
  const { refresh, refreshing } = useRefreshAdmin();
  const n = (x: number | undefined) => (x ? ` ${x}` : "");
  return (
    <Screen title="Review" testID="admin-review" gap={space[5]} onRefresh={refresh} refreshing={refreshing}>
      <ScrollTabs
        tabs={[
          { id: "subs" as const, name: `Hand-ins${n(subs.data?.pending)}` },
          { id: "signoffs" as const, name: `Sign-offs${n(so.data?.items.length)}` },
        ]}
        value={tab}
        onChange={setTab}
      />
      <TabSwap tabs={[{ id: "subs" as const }, { id: "signoffs" as const }]} value={tab} gap={space[5]}>
        {tab === "subs" ? <Submissions /> : <SignOffs />}
      </TabSwap>
    </Screen>
  );
}

