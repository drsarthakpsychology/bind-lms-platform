import * as React from "react";
import { View } from "react-native";

import { Button, Chips, EmptyState, Field, Loaded, Row, RowList, RowsSkeleton, Screen, Sheet, T } from "@/ds";
import { space } from "@/theme";
import { adminCalls, useAdminAction, useRefreshAdmin, useSignOffs, useSubmissions } from "../api";
import type { SignOff, Submission } from "../extra";
import { ago, day } from "../format";
import { Facts, Notice, Status } from "../kit";
import { openStudent } from "../nav";
import { useAdminRole, VIEW_ONLY_LINE } from "../role";
import { ScrollTabs } from "./student";

/** A grade must be a whole or half number from 0 to the most marks. Pure, so it is tested. */
export function checkGrade(raw: string, max: number): { grade: number } | { error: string } {
  const g = Number(raw.replace(",", ".").trim());
  if (!raw.trim() || !Number.isFinite(g)) return { error: `Give a grade from 0 to ${max}.` };
  if (g < 0 || g > max) return { error: `Give a grade from 0 to ${max}.` };
  if (Math.round(g * 2) !== g * 2) return { error: "Use whole or half marks." };
  return { grade: g };
}

function GradeSheet({ s, onClose }: { s: Submission | null; onClose: () => void }) {
  const { canWrite } = useAdminRole();
  const { run, busy } = useAdminAction();
  const [grade, setGrade] = React.useState(s?.grade !== null && s?.grade !== undefined ? String(s.grade) : "");
  const [feedback, setFeedback] = React.useState(s?.feedback ?? "");
  const [error, setError] = React.useState<string | null>(null);
  if (!s) return null;
  const save = async () => {
    const g = checkGrade(grade, s.maxGrade);
    if ("error" in g) return setError(g.error);
    setError(null);
    const r = await run("grade", () => adminCalls.grade(s.id, { grade: g.grade, feedback: feedback.trim() }), { done: `Graded. ${s.studentName} gets a notice.` });
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
        {s.file ? <Row title={s.file} meta="A file. Open it on the website to read it." /> : null}
        {s.answer ? <T>{s.answer}</T> : null}
        {canWrite ? (
          <>
            <Field label={`Grade, out of ${s.maxGrade}`} value={grade} onChangeText={setGrade} keyboardType="decimal-pad" error={error} maxLength={5} testID="grade-value" />
            <Field label="Feedback for the student" value={feedback} onChangeText={setFeedback} area maxLength={2000} testID="grade-feedback" />
            <Button label={s.status === "graded" ? "Save new grade" : "Save grade"} busy={busy === "grade"} onPress={() => void save()} testID="grade-save" />
          </>
        ) : (
          <>
            {s.status === "graded" ? <Facts items={[{ label: "Grade", value: `${s.grade} of ${s.maxGrade}` }, { label: "Feedback", value: s.feedback ?? "None" }]} /> : null}
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
  const [note, setNote] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  if (!x) return null;
  const decide = async (decision: "signed" | "rejected") => {
    if (decision === "rejected" && !note.trim()) return setError("Say why, so the student can fix it.");
    setError(null);
    const r = await run("sign-off", () => adminCalls.signOff(x.id, { decision, note: note.trim() || undefined }), { done: decision === "signed" ? "Signed" : "Sent back to the student" });
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
            { label: "Supervisor", value: x.supervisor },
            ...(x.competency ? [{ label: "Skill", value: x.competency }] : []),
          ]}
        />
        {canWrite ? (
          <>
            <Field label="Note (needed to send it back)" value={note} onChangeText={setNote} error={error} maxLength={500} testID="signoff-note" />
            <Button label="Sign" busy={busy === "sign-off"} onPress={() => void decide("signed")} testID="signoff-sign" />
            <Button kind="danger" full label="Send back" onPress={() => void decide("rejected")} testID="signoff-reject" />
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
                <Row key={s.id} testID={`sub-${s.id}`} title={s.studentName} meta={`${s.assignment} · ${ago(s.submittedAt)}`} trailing={<Status tone={s.status === "graded" ? "ok" : "warn"}>{s.status === "graded" ? `${s.grade}/${s.maxGrade}` : "To grade"}</Status>} onPress={() => setOpen(s)} />
              ))}
            </RowList>
          ) : (
            <EmptyState mood="sleepy" title={status === "pending" ? "Nothing to grade" : "Nothing here"} body={status === "pending" ? "New hand-ins land here." : undefined} />
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
            <EmptyState mood="sleepy" title="No sign-off requests" body="When a student asks for one, it lands here." />
          )
        }
      </Loaded>
      <SignOffSheet key={open?.id ?? "none"} x={open} onClose={() => setOpen(null)} />
    </>
  );
}

/** Review: hand-ins to grade and supervision sign-offs. */
export function AdminReviewScreen() {
  const [tab, setTab] = React.useState<"subs" | "signoffs">("subs");
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
      {tab === "subs" ? <Submissions /> : <SignOffs />}
    </Screen>
  );
}

