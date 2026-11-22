import { useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { ArrowLeft, ArrowRight, ChevronLeft, FileText, NotebookPen, Play } from "lucide-react-native";
import * as React from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg from "react-native-svg";

import type { CompleteLectureResult, LectureDetail, Material } from "@/api/contract";
import { messageOf } from "@/api/errors";
import { outbox } from "@/api/outbox";
import { keys, useLecture } from "@/api/queries";
import { api } from "@/auth";
import { Button, Field, Label, QuietEmpty, Sheet, Skeleton, StillTrying, Stone, T, TabRow } from "@/ds";
import { layerShadow } from "@/ds/layers";
import { toast } from "@/ds/toast";
import { streakMoment } from "@/moments/host";
import { AssignmentPart } from "@/lecture/assignment";
import { HandInSlot, type FooterAction } from "@/lecture/handin-ui";
import { useFullScreen } from "@/lecture/fullscreen";
import { ProtectedPlayer, clock, type PlayerControl } from "@/lecture/player";
import { countWatched } from "@/lecture/watched";
import { config } from "@/lib/config";
import { createStore } from "@/lib/store";
import { haptic } from "@/lib/haptics";
import { beats, DrawInk, Enter, Press, Reveal, StaggerList, Swap, useLoadGate } from "@/motion";
import { enablePush, pushStatus } from "@/push";
import { Group, Pill, Tile } from "@/screens/learn/parts";
import { fixed, layout, space, useLightStatusBar, useTheme } from "@/theme";
import { MOCK_NOTES, mockChapters, type LectureChapter, type LectureNote } from "./mock";

type Tab = "about" | "chapters" | "notes" | "materials" | "assignment";

const TICK = { t: "path", d: "M5,12.5 L10,17.5 L19,7" } as const;

/** "Mark as watched" after it worked: the same lime pill with a tick that draws itself on. */
function WatchedFace() {
  const c = useTheme();
  const ink = React.useMemo(() => ({ stroke: c.lime, sw: 3.5, single: true, rough: 0.5 }), [c.lime]);
  return (
    <View accessible accessibilityRole="text" accessibilityLabel="Watched" accessibilityLiveRegion="polite" testID="lecture-watched" style={{ minHeight: layout.primary, borderRadius: 999, backgroundColor: c.lime, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: space[2], paddingHorizontal: space[5] }}>
      <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: c.onLime, alignItems: "center", justifyContent: "center" }}>
        <Svg width={15} height={15} viewBox="0 0 24 24">
          <DrawInk k="lecture-watched-tick" shape={TICK} o={ink} delay={80} duration={240} />
        </Svg>
      </View>
      <T v="button" tone="onPrimary">
        Watched
      </T>
    </View>
  );
}

function sizeLabel(b: number | null): string {
  if (!b) return "";
  return b > 1_000_000 ? `${(b / 1_000_000).toFixed(1)} MB` : `${Math.round(b / 1000)} KB`;
}

function MaterialRows({ items, courseId }: { items: Material[]; courseId: string }) {
  if (!items.length) return <QuietEmpty title="No materials" body="This lecture has no files to read." />;
  return (
    <StaggerList style={{ gap: space[2] }}>
      {items.map((m) => (
        <Tile key={m.id} testID={`lecture-material-${m.id}`} icon={FileText} title={m.title} meta={[m.format?.toUpperCase(), sizeLabel(m.sizeBytes)].filter(Boolean).join(" · ") || undefined} onPress={() => router.push(`/material/${encodeURIComponent(m.id)}${courseId ? `?course=${encodeURIComponent(courseId)}` : ""}`)} />
      ))}
    </StaggerList>
  );
}

/** A time you can tap to jump the video there. */
function TimeChip({ at, on }: { at: number; on?: boolean }) {
  const c = useTheme();
  return (
    <View style={{ minWidth: 52, height: 30, borderRadius: 15, paddingHorizontal: space[2], backgroundColor: on ? c.ink : c.bg, alignItems: "center", justifyContent: "center" }}>
      <T v="caption" num maxFontSizeMultiplier={1.2} style={{ color: on ? c.bg : c.ink }}>
        {clock(at)}
      </T>
    </View>
  );
}

/** Which chapter the video is in. */
export function chapterAt(chapters: LectureChapter[], time: number): number {
  let i = 0;
  for (let k = 0; k < chapters.length; k++) if (time >= chapters[k]!.at) i = k;
  return i;
}

/** The lecture in parts: tap one and the video jumps there. Sample data for now (./mock). */
function Chapters({ chapters, current, onSeek }: { chapters: LectureChapter[]; current: number; onSeek: (at: number) => void }) {
  return (
    <Group>
      <Label action={<Pill>Sample</Pill>}>Jump to a part</Label>
      <StaggerList style={{ gap: space[2] }}>
        {chapters.map((ch, i) => (
          <Tile key={ch.at} testID={`chapter-${i}`} title={ch.title} lead={<TimeChip at={ch.at} on={i === current} />} trailing={i === current ? <Pill tone="ink">Playing</Pill> : undefined} plain accessibilityLabel={`${ch.title}, at ${clock(ch.at)}. Jump there`} onPress={() => onSeek(ch.at)} />
        ))}
      </StaggerList>
    </Group>
  );
}

/** Your own notes on this lecture, each pinned to the moment it was written. Sample data for now (./mock). */
function Notes({ notes, onSeek, onWrite }: { notes: LectureNote[]; onSeek: (at: number) => void; onWrite: () => void }) {
  const c = useTheme();
  return (
    <Group>
      <Label action={<Pill>Sample</Pill>}>My notes on this lecture</Label>
      <StaggerList style={{ gap: space[2] }}>
        {notes.map((n) => (
          <Stone key={n.id} testID={`lecture-note-${n.id}`} pad={space[3] + 2}>
            <View style={{ gap: space[2] }}>
              <T v="reading">{n.text}</T>
              <Press accessibilityRole="button" accessibilityLabel={`Jump to ${clock(n.at)}`} onPress={() => onSeek(n.at)} hitSlop={10} innerStyle={{ flexDirection: "row", alignItems: "center", gap: space[2], alignSelf: "flex-start" }}>
                <TimeChip at={n.at} />
                <T v="small" tone="link">
                  Watch this part
                </T>
              </Press>
            </View>
          </Stone>
        ))}
      </StaggerList>
      <Button kind="quiet" label="Write a note here" icon={<NotebookPen size={18} color={c.ink} />} onPress={onWrite} testID="lecture-note-add" />
    </Group>
  );
}

/** What comes after this lecture: a stone that grows into it. */
function UpNext({ next, onOpen }: { next: { id: string; title: string }; onOpen: () => void }) {
  const c = useTheme();
  return (
    <Group>
      <Label>Up next</Label>
      <Stone quiet testID="lecture-upnext" accessibilityLabel={`Up next: ${next.title}`} onPress={onOpen}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: space[3] }}>
          <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: c.card, alignItems: "center", justifyContent: "center" }}>
            <Play size={16} color={c.ink} fill={c.ink} />
          </View>
          <T v="bodyStrong" style={{ flex: 1 }}>
            {next.title}
          </T>
          <ArrowRight size={18} color={c.muted} />
        </View>
      </Stone>
    </Group>
  );
}

function LectureSkeleton({ failed }: { failed: boolean }) {
  return (
    <View style={{ padding: layout.gutter, gap: space[3] }}>
      <Skeleton w="90%" h={28} />
      <Skeleton w="50%" h={14} />
      <Skeleton h={40} r={20} style={{ marginTop: space[3] }} />
      <Skeleton h={16} />
      <Skeleton w="80%" h={16} />
      <Skeleton h={72} r={22} style={{ marginTop: space[3] }} />
      <StillTrying failed={failed} />
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
  // The top is always black (video), so the clock and battery stay white in light mode too.
  useLightStatusBar();
  const insets = useSafeAreaInsets();
  const qc = useQueryClient();
  const params = useLocalSearchParams<{ lessonId: string; tab?: string }>();
  const lessonId = String(params.lessonId ?? "");
  const q = useLecture(lessonId);
  const [tab, setTab] = React.useState<Tab>(params.tab === "assignment" ? "assignment" : "about");
  const [busy, setBusy] = React.useState(false);
  const [ask, setAsk] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const nextTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  React.useEffect(
    () => () => {
      if (nextTimer.current) clearTimeout(nextTimer.current);
    },
    [],
  );
  const lastSent = React.useRef(0);
  const last = React.useRef({ t: 0, d: 0 });
  // Chapters and notes (sample data, ./mock): jump the video, and know which part is playing.
  const control = React.useRef<PlayerControl | null>(null);
  const [chapter, setChapter] = React.useState(0);
  const [notes, setNotes] = React.useState<LectureNote[]>(MOCK_NOTES);
  // The time a new note is pinned to, taken when the note sheet opens (null: closed).
  const [writing, setWriting] = React.useState<number | null>(null);
  const [draft, setDraft] = React.useState("");
  const chapters = React.useMemo(() => mockChapters(q.data?.durationSeconds ?? null), [q.data?.durationSeconds]);
  const scroller = React.useRef<React.ComponentRef<typeof ScrollView>>(null);
  // The Assignment tab's hand-in button lives in the pinned footer.
  const [footer] = React.useState(() => createStore<{ action: FooterAction | null; owner: object | null }>({ action: null, owner: null }));
  const handIn = footer.use((x) => x.action);
  // A part leaving (during the tab swap) only clears the button if it is still its own.
  const setHandIn = React.useCallback((action: FooterAction | null, owner: object) => footer.set((s) => (action ? { action, owner } : s.owner === owner ? { action: null, owner: null } : {})), [footer]);
  const [dir, setDir] = React.useState<1 | -1>(1);
  // Full screen: the player stays where it is (no remount); everything around it is hidden.
  const fs = useFullScreen(!!q.data?.hasVideo);
  const navigation = useNavigation();
  React.useEffect(() => {
    // No swipe-back out of the lecture while the video fills the screen (Back leaves full screen first).
    navigation.setOptions({ gestureEnabled: !fs.full });
  }, [navigation, fs.full]);

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
      const now = chapterAt(chapters, t);
      setChapter((was) => (was === now ? was : now));
      if (playing && Math.abs(t - lastSent.current) >= config.progressPingMs / 1000) save(t, d);
      if (!playing && t !== lastSent.current) save(t, d);
    },
    [save, chapters],
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

  const seek = (at: number) => {
    haptic.select();
    if (control.current) {
      control.current.seek(at);
      control.current.play();
      setChapter(chapterAt(chapters, at));
    } else toast.show("Press play first, then pick a part.");
  };
  const saveNote = () => {
    const text = draft.trim();
    if (!text) return;
    const at = writing ?? 0;
    setNotes((n) => [...n, { id: `mine-${n.length}`, at, text }]);
    setDraft("");
    setWriting(null);
    haptic.success();
    toast.show("Note added");
  };
  const back = () => (router.canGoBack() ? router.back() : router.replace("/"));
  const go = (id: string) => router.replace(`/lecture/${encodeURIComponent(id)}`);

  const complete = async (l: LectureDetail) => {
    setBusy(true);
    try {
      const r = await api.post<CompleteLectureResult>(`/lectures/${encodeURIComponent(l.id)}/complete`);
      haptic.success();
      setDone(true);
      streakMoment.done();
      // The course page and Lectures list count it now, so their lines fill on the way back.
      countWatched(qc, l.courseId, l.id);
      void qc.invalidateQueries({ queryKey: keys.lecture(l.id) });
      void qc.invalidateQueries({ queryKey: keys.course(l.courseId) });
      void qc.invalidateQueries({ queryKey: keys.courses });
      if ((await pushStatus()) === "undetermined") setAsk(true);
      // The next lecture opens once the tick has drawn and been seen.
      else if (r.next) {
        const id = r.next.id;
        nextTimer.current = setTimeout(() => go(id), beats.stats);
      }
    } catch (e) {
      haptic.warn();
      toast.show(messageOf(e));
    } finally {
      setBusy(false);
    }
  };

  const l = q.data;
  // The skeleton only after 120ms, then at least 380ms (no grey flash).
  const gate = useLoadGate(!!l || q.isError);
  const tabs: { id: Tab; name: string }[] = l
    ? [{ id: "about", name: "About" }, ...(l.hasVideo ? [{ id: "chapters" as Tab, name: "Chapters" }, { id: "notes" as Tab, name: "Notes" }] : []), ...(l.materials.length && !l.hasVideo ? [{ id: "materials" as Tab, name: "Materials" }] : []), ...(l.assignment ? [{ id: "assignment" as Tab, name: "Assignment" }] : [])]
    : [];
  const watched = l ? l.progress.completed || done : false;
  const blockedByAssignment = !!l?.requiresAssignment && !l.assignment?.submission;

  return (
    <View testID="lecture" style={{ flex: 1, backgroundColor: fixed.black }}>
      {/* Black band under the status bar, the way back, and the video edge to edge. */}
      <View style={fs.full ? { backgroundColor: fixed.black, flex: 1 } : { backgroundColor: fixed.black, paddingTop: insets.top }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: space[2], minHeight: 52, paddingLeft: space[3], paddingRight: layout.gutter, display: fs.full ? "none" : "flex" }}>
          <Press accessibilityRole="button" accessibilityLabel="Back" onPress={back} hitSlop={6} squish scale={0.9} innerStyle={{ width: 40, height: 40, borderRadius: 20, backgroundColor: fixed.videoButtonPressed, alignItems: "center", justifyContent: "center" }} testID="lecture-back">
            <ChevronLeft size={22} color={fixed.onVideo} />
          </Press>
          <T v="small" numberOfLines={1} style={{ color: fixed.onVideoMuted, flex: 1 }}>
            {l ? `${l.number ? `Lecture ${l.number} · ` : ""}Week ${l.week}` : " "}
          </T>
        </View>
        {l?.hasVideo ? (
          <ProtectedPlayer lessonId={lessonId} onTime={onTime} intro={{ number: l.number, week: l.week }} full={fs.full} onFull={fs.toggle} control={control} />
        ) : l ? (
          <View style={{ aspectRatio: 16 / 9, alignItems: "center", justifyContent: "center", padding: space[5] }}>
            <T center style={{ color: fixed.onVideo }}>
              This lecture has no video. Read the notes below.
            </T>
          </View>
        ) : (
          <View style={{ aspectRatio: 16 / 9 }} />
        )}
      </View>

      {/* The layer rises under the video. Kept mounted (a half-written answer survives), just out of the way in full screen. */}
      <View style={[{ flex: 1, display: fs.full ? "none" : "flex", marginTop: space[2], backgroundColor: c.bg, borderTopLeftRadius: layout.radiusLayer, borderTopRightRadius: layout.radiusLayer, overflow: "hidden" }, layerShadow(c)]}>
      {l && gate.phase === "content" ? (
        <Reveal style={{ flex: 1 }}>
          <ScrollView ref={scroller} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: layout.gutter, paddingTop: space[5], paddingBottom: space[7], gap: space[4], width: "100%", maxWidth: layout.readingWidth + layout.gutter * 2, alignSelf: "center" }}>
            <View style={{ gap: space[1] }}>
              <T v={l.title.length > 34 ? "h2" : "h1"} accessibilityRole="header">
                {l.title}
              </T>
              <T v="small" tone="muted" num>
                {[l.courseTitle, l.durationSeconds ? `${Math.round(l.durationSeconds / 60)} min` : null, watched ? "Watched" : l.progress.watchedSeconds > 0 ? `Stopped at ${clock(l.progress.watchedSeconds)}` : null].filter(Boolean).join(" · ")}
              </T>
            </View>
            <TabRow
              tabs={tabs}
              value={tab}
              onChange={(t) => {
                setDir(tabs.findIndex((x) => x.id === t) >= tabs.findIndex((x) => x.id === tab) ? 1 : -1);
                setTab(t);
              }}
            />
            <Swap k={tab} dir={dir} style={{ gap: space[5] }} testID="lecture-tab-body">
              {tab === "about" ? (
                <>
                  {l.description ? <T v="reading">{l.description}</T> : <T tone="muted">No notes for this lecture.</T>}
                  {l.assignment && !l.assignment.submission ? (
                    <Enter i={1}>
                      <Tile testID="lecture-assignment-card" icon={NotebookPen} title={l.assignment.title} meta={l.requiresAssignment ? "Hand this in to finish the lecture" : "Assignment for this lecture"} trailing={<Pill tone="warm">To do</Pill>} onPress={() => { setDir(1); setTab("assignment"); scroller.current?.scrollTo({ y: 0, animated: true }); }} />
                    </Enter>
                  ) : null}
                  {l.materials.length && l.hasVideo ? (
                    <Enter i={2}>
                      <Group>
                        <Label>{`Materials · ${l.materials.length}`}</Label>
                        <MaterialRows items={l.materials} courseId={l.courseId} />
                      </Group>
                    </Enter>
                  ) : null}
                  {l.next ? (
                    <Enter i={3}>
                      <UpNext next={l.next} onOpen={() => go(l.next!.id)} />
                    </Enter>
                  ) : null}
                </>
              ) : null}
              {tab === "chapters" ? <Chapters chapters={chapters} current={chapter} onSeek={seek} /> : null}
              {tab === "notes" ? <Notes notes={notes} onSeek={seek} onWrite={() => setWriting(Math.floor(last.current.t))} /> : null}
              {tab === "materials" ? <MaterialRows items={l.materials} courseId={l.courseId} /> : null}
              {tab === "assignment" ? (
                <HandInSlot.Provider value={setHandIn}>
                  <AssignmentPart lecture={l} />
                </HandInSlot.Provider>
              ) : null}
            </Swap>
          </ScrollView>
          <View style={{ paddingHorizontal: layout.gutter, paddingTop: space[2], paddingBottom: insets.bottom + space[2], gap: space[1], backgroundColor: c.bg }}>
            {tab === "assignment" ? (
              handIn ? <Button label={handIn.label} busy={handIn.busy} disabled={handIn.disabled} onPress={handIn.onPress} testID={handIn.testID} /> : null
            ) : !watched || done ? (
              // The button's face turns into a drawn tick and "Watched" in place (same size, no jump).
              <Swap k={done ? "watched" : "mark"}>
                {done ? <WatchedFace /> : <Button label={blockedByAssignment ? "Hand in the assignment first" : "Mark as watched"} disabled={blockedByAssignment} busy={busy} onPress={() => void complete(l)} testID="lecture-complete" />}
              </Swap>
            ) : l.next ? (
              <Button label={`Next: ${l.next.title}`} icon={<ArrowRight size={20} color={c.onPrimary} />} onPress={() => go(l.next!.id)} testID="lecture-next-primary" />
            ) : null}
            <View style={{ flexDirection: "row", justifyContent: "space-between", gap: space[3] }}>
              {l.prev ? <Button kind="text" label="Previous" icon={<ArrowLeft size={18} color={c.link} />} onPress={() => go(l.prev!.id)} testID="lecture-prev" /> : <View />}
              {l.next && (done || !(watched && tab !== "assignment")) ? <Button kind="text" label="Next" icon={<ArrowRight size={18} color={c.link} />} onPress={() => go(l.next!.id)} testID="lecture-next" /> : null}
            </View>
          </View>
          <ReminderSheet
            open={ask}
            onClose={() => {
              setAsk(false);
            }}
          />
          <Sheet open={writing !== null} onClose={() => setWriting(null)} title="A note on this lecture" testID="lecture-note-sheet">
            <View style={{ gap: space[4] }}>
              <T v="small" tone="muted" num>
                Pinned at {clock(writing ?? 0)}. Sample for now: it stays until you leave this lecture.
              </T>
              <Field label="Your note" area value={draft} onChangeText={setDraft} placeholder="What to remember from this part" maxLength={2000} testID="lecture-note-text" />
              <Button label="Add note" disabled={!draft.trim()} onPress={saveNote} testID="lecture-note-save" />
            </View>
          </Sheet>
        </Reveal>
      ) : q.isError ? (
        <View style={{ padding: layout.gutter }}>
          <QuietEmpty testID="load-error" title="Could not load this lecture" body={messageOf(q.error)} action={{ label: "Try again", onPress: () => void q.refetch() }} />
        </View>
      ) : gate.phase === "skeleton" ? (
        <LectureSkeleton failed={q.failureCount > 0} />
      ) : null}
      </View>
    </View>
  );
}
