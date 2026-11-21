import { useQueryClient } from "@tanstack/react-query";
import { Check, Clock, FileText, Mic, RotateCcw } from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";

import type { Assignment, LectureDetail, Submission, SubmitResult, UnsubmitResult } from "@/api/contract";
import { messageOf } from "@/api/errors";
import { keys } from "@/api/queries";
import { api } from "@/auth";
import { Button, Field, Stone, T } from "@/ds";
import { toast } from "@/ds/toast";
import { haptic } from "@/lib/haptics";
import { Enter, RollingNumber } from "@/motion";
import { fonts, space, useTheme } from "@/theme";
import { FileHandIn, RecordingHandIn, useFooterAction } from "./handin-ui";

/**
 * One assignment: what to do, when it is due, where your hand-in stands, and
 * the way to hand it in (typed text, files, or a recording). Used on the
 * assignment's own page and on the lecture's Assignment tab. The "Hand in"
 * button goes to the screen's footer when the screen offers a `HandInSlot`.
 */

export function dueLine(a: Pick<Assignment, "dueAt" | "allowLate">): string | null {
  if (!a.dueAt || Number.isNaN(Date.parse(a.dueAt))) return null;
  return `Due ${new Date(a.dueAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "Asia/Kolkata" })}${a.allowLate ? "" : ". Nothing can be handed in after that."}`;
}

/** Where a hand-in stands, on one stone: waiting, returned, or marked with the score rolling in. */
export function SubmissionCard({ sub, busy, onTakeBack }: { sub: Submission; busy?: boolean; onTakeBack?: () => void }) {
  const c = useTheme();
  const marked = sub.status === "approved";
  const returned = sub.status === "returned";
  const title = marked ? "Marked" : returned ? "Returned with feedback" : "Handed in, waiting for review";
  return (
    <Stone testID="assignment-status">
      <View style={{ gap: space[3] }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: space[3] }}>
          <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: marked ? c.ink : c.bg, alignItems: "center", justifyContent: "center" }}>{marked ? <Check size={20} color={c.bg} strokeWidth={3} /> : returned ? <RotateCcw size={18} color={c.ink} /> : <Clock size={18} color={c.ink} />}</View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <T v="h3">{title}</T>
            {sub.isLate ? (
              <T v="small" tone="muted">
                Handed in after the due date
              </T>
            ) : null}
          </View>
          {marked && sub.score !== null ? (
            <View accessible accessibilityLabel={`Score ${sub.score}`} style={{ alignItems: "flex-end" }}>
              <RollingNumber value={sub.score} style={{ fontFamily: fonts.big, fontSize: 34, lineHeight: 36 }} />
              <T v="caption" tone="muted">
                of 100
              </T>
            </View>
          ) : null}
        </View>
        {sub.feedback ? (
          <View style={{ gap: 2 }}>
            <T v="label" tone="muted">
              Feedback
            </T>
            <T v="reading">{sub.feedback}</T>
          </View>
        ) : null}
        {sub.files.map((f) => (
          <View key={f.id} style={{ flexDirection: "row", alignItems: "center", gap: space[2] }}>
            <FileText size={16} color={c.muted} />
            <T v="small" tone="muted" style={{ flex: 1 }}>
              {f.name}
            </T>
          </View>
        ))}
        {sub.hasAudio && !sub.files.length ? (
          <View style={{ flexDirection: "row", alignItems: "center", gap: space[2] }}>
            <Mic size={16} color={c.muted} />
            <T v="small" tone="muted">
              A recording
            </T>
          </View>
        ) : null}
        {sub.editable && onTakeBack ? <Button kind="quiet" small full={false} label="Take it back to change it" busy={busy} onPress={onTakeBack} testID="assignment-unsubmit" /> : null}
      </View>
    </Stone>
  );
}

export function AssignmentPart({ lecture, bare }: { lecture: LectureDetail; /** The screen already shows the title and due date. */ bare?: boolean }) {
  const qc = useQueryClient();
  const a = lecture.assignment;
  const [text, setText] = React.useState(a?.submission?.text ?? "");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [openedAt] = React.useState(() => Date.now());
  const sub = a?.submission ?? null;
  const writing = a?.submissionType === "text" && (!sub || sub.editable);
  const inFooter = useFooterAction(writing ? { label: sub ? "Hand in again" : "Hand in", busy, onPress: () => void submit(), testID: "assignment-submit" } : null);
  if (!a) return <T tone="muted">No assignment for this lecture.</T>;
  const closed = !!a.dueAt && !a.allowLate && Date.parse(a.dueAt) < openedAt;
  const refresh = () => {
    void qc.invalidateQueries({ queryKey: keys.lecture(lecture.id) });
    void qc.invalidateQueries({ queryKey: ["assignments"] });
  };
  const handedIn = (s: Submission) => {
    toast.show("Handed in");
    qc.setQueryData<LectureDetail>(keys.lecture(lecture.id), (old) => (old && old.assignment ? { ...old, assignment: { ...old.assignment, submission: s } } : old));
    refresh();
  };
  const takeBack = async () => {
    setBusy(true);
    try {
      await api.del<UnsubmitResult>(`/assignments/${encodeURIComponent(a.id)}/submission`);
      qc.setQueryData<LectureDetail>(keys.lecture(lecture.id), (old) => (old && old.assignment ? { ...old, assignment: { ...old.assignment, submission: null } } : old));
      refresh();
    } catch (e) {
      toast.show(messageOf(e));
    } finally {
      setBusy(false);
    }
  };
  async function submit() {
    if (!a) return;
    if (text.trim().length < 20) return setError("Write at least a few sentences.");
    setBusy(true);
    setError(null);
    try {
      await api.post<SubmitResult>(`/assignments/${encodeURIComponent(a.id)}/text`, { text: text.trim() });
      haptic.success();
      toast.show("Handed in");
      refresh();
    } catch (e) {
      haptic.warn();
      setError(messageOf(e));
    } finally {
      setBusy(false);
    }
  }
  const due = dueLine(a);
  return (
    <View style={{ gap: space[4] }}>
      {bare ? null : (
        <View style={{ gap: space[1] }}>
          <T v="h2">{a.title}</T>
          {due ? (
            <T v="small" tone="muted">
              {due}
            </T>
          ) : null}
        </View>
      )}
      {sub ? (
        <Enter>
          <SubmissionCard sub={sub} busy={busy} onTakeBack={() => void takeBack()} />
        </Enter>
      ) : null}
      {a.instructions ? (
        <View style={{ gap: space[1] }}>
          <T v="label" tone="muted">
            What to do
          </T>
          <T v="reading">{a.instructions}</T>
        </View>
      ) : null}
      {a.submissionType === "text" && (!sub || sub.editable) ? (
        <>
          <Field label="Your answer" value={text} onChangeText={setText} area error={error} maxLength={50000} testID="assignment-text" />
          {inFooter ? null : <Button label={sub ? "Hand in again" : "Hand in"} busy={busy} needsServer onPress={() => void submit()} testID="assignment-submit" />}
        </>
      ) : closed && !sub ? (
        <Stone quiet>
          <T tone="muted">The due date has passed, and this assignment does not take late hand-ins.</T>
        </Stone>
      ) : a.submissionType === "audio" && !sub ? (
        <RecordingHandIn a={a} onDone={handedIn} />
      ) : a.submissionType !== "text" && !sub ? (
        <FileHandIn a={a} onDone={handedIn} />
      ) : null}
    </View>
  );
}
