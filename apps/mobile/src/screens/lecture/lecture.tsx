import { useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, ArrowRight, ChevronLeft, FileText } from "lucide-react-native";
import * as React from "react";
import { Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { CompleteLectureResult, LectureDetail, Material, Submission, SubmitResult, UnsubmitResult } from "@/api/contract";
import { messageOf } from "@/api/errors";
import { outbox } from "@/api/outbox";
import { keys, useLecture } from "@/api/queries";
import { api } from "@/auth";
import { Button, Field, LoadError, Row, RowList, Sheet, Skeleton, T, TabRow, Tint } from "@/ds";
import { toast } from "@/ds/toast";
import { FileHandIn, RecordingHandIn } from "@/lecture/handin-ui";
import { ProtectedPlayer, clock } from "@/lecture/player";
import { config } from "@/lib/config";
import { haptic } from "@/lib/haptics";
import { enablePush, pushStatus } from "@/push";
import { layout, space, useTheme } from "@/theme";

type Tab = "about" | "materials" | "assignment";

function sizeLabel(b: number | null): string {
  if (!b) return "";
  return b > 1_000_000 ? `${(b / 1_000_000).toFixed(1)} MB` : `${Math.round(b / 1000)} KB`;
}

function MaterialRows({ items }: { items: Material[] }) {
  const c = useTheme();
  if (!items.length) return <T tone="muted">No materials for this lecture.</T>;
  return (
    <RowList>
      {items.map((m) => (
        <Row
          key={m.id}
          title={m.title}
          meta={[m.format?.toUpperCase(), sizeLabel(m.sizeBytes)].filter(Boolean).join(" · ") || undefined}
          icon={<FileText size={20} color={c.muted} />}
          onPress={() => router.push(`/material/${encodeURIComponent(m.id)}`)}
        />
      ))}
    </RowList>
  );
}

function AssignmentPart({ lecture }: { lecture: LectureDetail }) {
  const qc = useQueryClient();
  const a = lecture.assignment;
  const [text, setText] = React.useState(a?.submission?.text ?? "");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [openedAt] = React.useState(() => Date.now());
  if (!a) return <T tone="muted">No assignment for this lecture.</T>;
  const sub = a.submission;
  const closed = !!a.dueAt && !a.allowLate && Date.parse(a.dueAt) < openedAt;
  const handedIn = (s: Submission) => {
    toast.show("Handed in");
    qc.setQueryData<LectureDetail>(keys.lecture(lecture.id), (old) => (old && old.assignment ? { ...old, assignment: { ...old.assignment, submission: s } } : old));
    void qc.invalidateQueries({ queryKey: keys.lecture(lecture.id) });
  };
  const takeBack = async () => {
    setBusy(true);
    try {
      await api.del<UnsubmitResult>(`/assignments/${encodeURIComponent(a.id)}/submission`);
      qc.setQueryData<LectureDetail>(keys.lecture(lecture.id), (old) => (old && old.assignment ? { ...old, assignment: { ...old.assignment, submission: null } } : old));
      void qc.invalidateQueries({ queryKey: keys.lecture(lecture.id) });
    } catch (e) {
      toast.show(messageOf(e));
    } finally {
      setBusy(false);
    }
  };
  const submit = async () => {
    if (text.trim().length < 20) return setError("Write at least a few sentences.");
    setBusy(true);
    setError(null);
    try {
      await api.post<SubmitResult>(`/assignments/${encodeURIComponent(a.id)}/text`, { text: text.trim() });
      haptic.success();
      toast.show("Handed in");
      void qc.invalidateQueries({ queryKey: keys.lecture(lecture.id) });
    } catch (e) {
      haptic.warn();
      setError(messageOf(e));
    } finally {
      setBusy(false);
    }
  };
  return (
    <View style={{ gap: space[4] }}>
      <T v="h3">{a.title}</T>
      {a.dueAt && !Number.isNaN(Date.parse(a.dueAt)) ? (
        <T v="small" tone="muted">
          Due {new Date(a.dueAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "Asia/Kolkata" })}
          {a.allowLate ? "" : ". Nothing can be handed in after that."}
        </T>
      ) : null}
      {a.instructions ? <T v="reading">{a.instructions}</T> : null}
      {sub ? (
        <Tint>
          <T v="bodyStrong">{sub.status === "approved" ? `Marked${sub.score !== null ? `: ${sub.score}` : ""}` : sub.status === "returned" ? "Returned with feedback" : "Handed in, waiting for review"}</T>
          {sub.feedback ? <T tone="muted">{sub.feedback}</T> : null}
          {sub.files.length ? <T v="small" tone="muted">{sub.files.map((f) => f.name).join(", ")}</T> : null}
          {sub.hasAudio && !sub.files.length ? <T v="small" tone="muted">A recording</T> : null}
          {sub.editable ? <Button kind="text" label="Take it back to change it" busy={busy} onPress={() => void takeBack()} testID="assignment-unsubmit" /> : null}
        </Tint>
      ) : null}
      {a.submissionType === "text" && (!sub || sub.editable) ? (
        <>
          <Field label="Your answer" value={text} onChangeText={setText} area error={error} maxLength={50000} testID="assignment-text" />
          <Button kind="quiet" label={sub ? "Hand in again" : "Hand in"} busy={busy} onPress={() => void submit()} testID="assignment-submit" />
        </>
      ) : closed && !sub ? (
        <T tone="muted">The due date has passed, and this assignment does not take late hand-ins.</T>
      ) : a.submissionType === "audio" && !sub ? (
        <RecordingHandIn a={a} onDone={handedIn} />
      ) : a.submissionType !== "text" && !sub ? (
        <FileHandIn a={a} onDone={handedIn} />
      ) : null}
    </View>
  );
}

function LectureSkeleton() {
  return (
    <View style={{ padding: layout.gutter, gap: space[3] }}>
      <Skeleton w="40%" h={14} />
      <Skeleton w="90%" h={26} />
      <Skeleton w="70%" h={26} />
      <Skeleton h={48} r={8} style={{ marginTop: space[4] }} />
      <Skeleton h={14} />
      <Skeleton w="80%" h={14} />
    </View>
  );
}

/** Ask for notifications once, at a moment that makes sense: after the first finished lecture. */
function ReminderSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Sheet open={open} onClose={onClose} title="Want a nudge when the next lecture opens?">
      <View style={{ gap: space[4] }}>
        <T tone="muted">We send a notification for new lectures and answers to your doubts. Nothing else.</T>
        <Button
          label="Yes, notify me"
          onPress={() => {
            onClose();
            void enablePush().then((s) => toast.show(s === "granted" ? "Notifications are on" : "You can turn notifications on in Settings"));
          }}
        />
        <Button kind="text" full label="Not now" onPress={onClose} />
      </View>
    </Sheet>
  );
}

export function LectureScreen() {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const qc = useQueryClient();
  const params = useLocalSearchParams<{ lessonId: string; tab?: string }>();
  const lessonId = String(params.lessonId ?? "");
  const q = useLecture(lessonId);
  const [tab, setTab] = React.useState<Tab>(params.tab === "assignment" ? "assignment" : params.tab === "materials" ? "materials" : "about");
  const [busy, setBusy] = React.useState(false);
  const [ask, setAsk] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const lastSent = React.useRef(0);
  const last = React.useRef({ t: 0, d: 0 });

  const save = React.useCallback(
    (t: number, d: number) => {
      if (!d || t <= 0) return;
      lastSent.current = t;
      void outbox.add({ kind: "progress", payload: { lessonId, watched: Math.floor(t), duration: Math.floor(d) } });
    },
    [lessonId],
  );
  const onTime = React.useCallback(
    (t: number, d: number, playing: boolean) => {
      last.current = { t, d };
      if (playing && Math.abs(t - lastSent.current) >= config.progressPingMs / 1000) save(t, d);
      if (!playing && t !== lastSent.current) save(t, d);
    },
    [save],
  );
  // Save where they stopped when leaving the screen.
  React.useEffect(
    () => () => {
      save(last.current.t, last.current.d);
      void qc.invalidateQueries({ queryKey: keys.home });
      void qc.invalidateQueries({ queryKey: keys.courses });
    },
    [save, qc],
  );

  const back = () => (router.canGoBack() ? router.back() : router.replace("/"));
  const go = (id: string) => router.replace(`/lecture/${encodeURIComponent(id)}`);

  const complete = async (l: LectureDetail) => {
    setBusy(true);
    try {
      const r = await api.post<CompleteLectureResult>(`/lectures/${encodeURIComponent(l.id)}/complete`);
      haptic.success();
      setDone(true);
      toast.show("Marked as watched");
      void qc.invalidateQueries({ queryKey: keys.lecture(l.id) });
      void qc.invalidateQueries({ queryKey: keys.course(l.courseId) });
      if ((await pushStatus()) === "undetermined") setAsk(true);
      else if (r.next) go(r.next.id);
    } catch (e) {
      haptic.warn();
      toast.show(messageOf(e));
    } finally {
      setBusy(false);
    }
  };

  const l = q.data;
  const watched = l ? l.progress.completed || done : false;
  const blockedByAssignment = !!l?.requiresAssignment && !l.assignment?.submission;

  return (
    <View testID="lecture" style={{ flex: 1, backgroundColor: c.bg }}>
      {/* Black band under the status bar, the way back, and the video edge to edge. */}
      <View style={{ backgroundColor: "#000000", paddingTop: insets.top }}>
        <View style={{ flexDirection: "row", alignItems: "center", minHeight: layout.target, paddingRight: layout.gutter }}>
          <Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={back} hitSlop={4} style={{ width: layout.target, height: layout.target, alignItems: "center", justifyContent: "center" }} testID="lecture-back">
            <ChevronLeft size={26} color="#ffffff" />
          </Pressable>
          <T v="small" numberOfLines={1} style={{ color: "rgba(255,255,255,0.8)", flex: 1 }}>
            {l ? `${l.number ? `Lecture ${l.number} · ` : ""}Week ${l.week}` : " "}
          </T>
        </View>
        {l?.hasVideo ? (
          <ProtectedPlayer lessonId={lessonId} onTime={onTime} />
        ) : l ? (
          <View style={{ aspectRatio: 16 / 9, alignItems: "center", justifyContent: "center", padding: space[5] }}>
            <T center style={{ color: "#ffffff" }}>
              This lecture has no video. Read the notes below.
            </T>
          </View>
        ) : (
          <View style={{ aspectRatio: 16 / 9 }} />
        )}
      </View>

      {l ? (
        <>
          <ScrollView contentContainerStyle={{ padding: layout.gutter, paddingBottom: space[6], gap: space[5], width: "100%", maxWidth: layout.readingWidth + layout.gutter * 2, alignSelf: "center" }}>
            <View style={{ gap: space[2] }}>
              <T v="h2">{l.title}</T>
              <T v="small" tone="muted" num>
                {[l.courseTitle, l.durationSeconds ? `${Math.round(l.durationSeconds / 60)} min` : null, watched ? "Watched" : l.progress.watchedSeconds > 0 ? `Stopped at ${clock(l.progress.watchedSeconds)}` : null].filter(Boolean).join(" · ")}
              </T>
            </View>
            <TabRow
              tabs={[
                { id: "about" as Tab, name: "About" },
                ...(l.materials.length ? [{ id: "materials" as Tab, name: `Materials (${l.materials.length})` }] : []),
                ...(l.assignment ? [{ id: "assignment" as Tab, name: "Assignment" }] : []),
              ]}
              value={tab}
              onChange={setTab}
            />
            {tab === "about" ? l.description ? <T v="reading">{l.description}</T> : <T tone="muted">No notes for this lecture.</T> : null}
            {tab === "materials" ? <MaterialRows items={l.materials} /> : null}
            {tab === "assignment" ? <AssignmentPart lecture={l} /> : null}
          </ScrollView>
          <View style={{ borderTopWidth: 1, borderColor: c.hairline, paddingHorizontal: layout.gutter, paddingTop: space[3], paddingBottom: insets.bottom + space[3], gap: space[2], backgroundColor: c.bg }}>
            {!watched ? (
              <Button label={blockedByAssignment ? "Hand in the assignment first" : "Mark as watched"} disabled={blockedByAssignment} busy={busy} onPress={() => void complete(l)} testID="lecture-complete" />
            ) : l.next ? (
              <Button label={`Next: ${l.next.title}`} icon={<ArrowRight size={20} color={c.onPrimary} />} onPress={() => go(l.next!.id)} testID="lecture-next-primary" />
            ) : null}
            <View style={{ flexDirection: "row", justifyContent: "space-between", gap: space[3] }}>
              {l.prev ? <Button kind="text" label="Previous" icon={<ArrowLeft size={18} color={c.link} />} onPress={() => go(l.prev!.id)} testID="lecture-prev" /> : <View />}
              {l.next && !watched ? <Button kind="text" label="Next" icon={<ArrowRight size={18} color={c.link} />} onPress={() => go(l.next!.id)} testID="lecture-next" /> : null}
            </View>
          </View>
          <ReminderSheet
            open={ask}
            onClose={() => {
              setAsk(false);
            }}
          />
        </>
      ) : q.isError ? (
        <View style={{ padding: layout.gutter }}>
          <LoadError what="this lecture" error={q.error} onRetry={() => void q.refetch()} />
        </View>
      ) : (
        <LectureSkeleton />
      )}
    </View>
  );
}
