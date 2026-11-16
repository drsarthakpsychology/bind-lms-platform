import { useQueryClient } from "@tanstack/react-query";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { ArrowLeft, ArrowRight, Check, NotebookText } from "lucide-react-native";
import * as React from "react";
import { Pressable, View } from "react-native";
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withSpring } from "react-native-reanimated";

import { bulletText } from "@/api/adapt-learn";
import type { RevisionNote, RevisionNoteList, RevisionNoteSummary } from "@/api/contract";
import { learnKeys, useNote, useNotes, useTerms } from "@/api/learn";
import { Chips, EmptyState, Hero, Loaded, Row, RowList, RowsSkeleton, Screen, Section, T, Tint } from "@/ds";
import { haptic } from "@/lib/haptics";
import { OnceHint } from "@/lib/once";
import { ReadingSize } from "@/lib/reading";
import { settingsStore, updateSettings } from "@/lib/settings";
import { Enter, Press, springs } from "@/motion";
import { openTarget } from "@/nav/targets";
import { exactRef, TermSheet } from "@/screens/reference/reference";
import { saveLearn, withNoteRead } from "@/study/state";
import { Rich, TermPress } from "@/study/rich";
import { FigureWidget } from "@/study/widgets/diagrams";
import { layout, space, useTheme } from "@/theme";

/**
 * Notes: the website's one-page revision notes (/study/notes), grouped by
 * the weeks they belong to. One Carry on for the next unread note, then
 * every note as a row with a tick once read.
 */

export function NotesBody({ d }: { d: RevisionNoteList }) {
  const c = useTheme();
  const next = d.notes.find((n) => !n.readOn);
  const groups: { title: string; items: RevisionNoteSummary[] }[] = [];
  for (const n of d.notes) {
    const title = n.blockTitle || d.blocks[n.block] || "Notes";
    const last = groups[groups.length - 1];
    if (last && last.title === title) last.items.push(n);
    else groups.push({ title, items: [n] });
  }
  const read = d.notes.filter((n) => n.readOn).length;
  if (!d.notes.length) return <EmptyState mood="sleepy" title="Revision notes open soon" body="Short notes for each topic show up here as your course goes on." testID="notes-empty" />;
  return (
    <>
      {next ? (
        <Enter i={0}>
          <Hero context={read ? "Next note" : "Start here"} title={next.title} meta={next.tagline} progress={d.notes.length ? Math.round((read / d.notes.length) * 100) : undefined} progressLabel={`${read} of ${d.notes.length} notes read`} action={{ label: read ? "Carry on" : "Read it", onPress: () => router.push(`/notes/${encodeURIComponent(next.id)}`), icon: <ArrowRight size={20} color={c.onPrimary} />, testID: "notes-next" }} />
        </Enter>
      ) : null}
      {groups.map((g) => (
        <Section key={g.title} title={g.title}>
          <RowList>
            {g.items.map((n) => (
              <Row key={n.id} testID={`note-${n.id}`} icon={<NotebookText size={20} color={c.muted} />} title={n.title} meta={n.tagline} trailing={n.readOn ? <Check size={20} color={c.ink} accessibilityLabel="Read" /> : undefined} onPress={() => router.push(`/notes/${encodeURIComponent(n.id)}`)} />
            ))}
          </RowList>
        </Section>
      ))}
    </>
  );
}

export function NotesScreen() {
  const q = useNotes();
  return (
    <Screen testID="notes" onRefresh={() => void q.refetch()} refreshing={q.isRefetching}>
      <Stack.Screen options={{ title: "Notes" }} />
      <Loaded q={q} soon what="your notes" skeleton={<RowsSkeleton rows={6} />}>
        {(d) => <NotesBody d={d} />}
      </Loaded>
    </Screen>
  );
}

/* ---------------------------------------------------------------- note */

/** A "say it clinically" card: everyday words on the front, the clinical term on the back. */
function FlipCard({ lay, term, i }: { lay: string; term: string; i: number }) {
  const c = useTheme();
  const reduce = useReducedMotion();
  const [on, setOn] = React.useState(false);
  const turn = useSharedValue(0);
  const front = useAnimatedStyle(() => ({ opacity: turn.value < 0.5 ? 1 : 0, transform: [{ perspective: 800 }, { rotateY: `${turn.value * 180}deg` }] }));
  const back = useAnimatedStyle(() => ({ opacity: turn.value >= 0.5 ? 1 : 0, transform: [{ perspective: 800 }, { rotateY: `${turn.value * 180 - 180}deg` }] }));
  const flip = () => {
    haptic.select();
    const next = !on;
    setOn(next);
    turn.value = reduce ? (next ? 1 : 0) : withSpring(next ? 1 : 0, springs.snappy);
  };
  const face = { position: "absolute" as const, top: 0, left: 0, right: 0, bottom: 0, borderRadius: layout.radius, padding: space[3], justifyContent: "space-between" as const, backfaceVisibility: "hidden" as const };
  return (
    <Pressable testID={`flip-${i}`} accessibilityRole="button" accessibilityState={{ selected: on }} accessibilityLabel={on ? `${term}. Tap to see the everyday words.` : `They say: ${lay}. Tap to see the clinical term.`} onPress={flip} style={{ flexBasis: "47%", flexGrow: 1, minHeight: 104 }}>
      <Animated.View style={[face, { borderWidth: 1.5, borderColor: c.cardLine, backgroundColor: c.card }, front]}>
        <T v="caption" tone="muted">
          They say
        </T>
        <T v="bodyStrong">“{lay}”</T>
      </Animated.View>
      <Animated.View style={[face, { borderWidth: 1.5, borderColor: c.ink, backgroundColor: c.primary }, back]}>
        <T v="caption" tone="onPrimary">
          You write
        </T>
        <T v="bodyStrong" tone="onPrimary">
          {term}
        </T>
      </Animated.View>
    </Pressable>
  );
}

/** The short version, split into a few lines the way the website shows it. */
function points(text: string, max: number): string[] {
  // No lookbehind: older Hermes builds do not have it.
  const parts = String(text ?? "")
    .replace(/([.!?])\s+(?=[A-Z0-9])/g, "$1\n")
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);
  return parts.length > max ? [...parts.slice(0, max - 1), parts.slice(max - 1).join(" ")] : parts;
}

/**
 * "Ask about" and other short lists: plain words with dots between them. A word
 * the Quick reference has is a link that opens it; the rest are plain text.
 */
function WordList({ words }: { words: string[] }) {
  const onTerm = React.useContext(TermPress);
  const index = useTerms(words.length > 0 && !!onTerm);
  const items = index.data?.items;
  return (
    <T v="reading" testID="note-words">
      {words.map((w, k) => {
        const hit = items && onTerm ? exactRef(items, w) : null;
        return (
          <React.Fragment key={k}>
            {k ? <T v="reading" tone="muted">{"  ·  "}</T> : null}
            {hit && onTerm ? (
              <T v="reading" tone="link" accessibilityRole="link" accessibilityHint="Opens it in the Quick reference" onPress={() => onTerm(w)} style={{ textDecorationLine: "underline", textDecorationStyle: "dotted" }} testID={`note-word-${k}`}>
                {w}
              </T>
            ) : (
              w
            )}
          </React.Fragment>
        );
      })}
    </T>
  );
}

export function NoteBody({ n, view, neighbours }: { n: RevisionNote; view: "student" | "clinician"; neighbours: { prev: RevisionNoteSummary | null; next: RevisionNoteSummary | null } }) {
  const c = useTheme();
  return (
    <>
      <View style={{ gap: space[3] }}>
        <Tint>
          <View style={{ gap: space[2] }}>
            <T v="caption" tone="muted">
              {view === "clinician" ? "Clinical summary" : "In short"}
            </T>
            {points(bulletText(n.tldr, view), 4).map((p, i) => (
              <Rich key={i} text={p} v="h3" />
            ))}
          </View>
        </Tint>
      </View>
      {n.sections.map((s, si) => {
        const alert = s.style === "alert";
        const body =
          s.style === "chips" ? (
            <WordList words={s.points.map((p) => bulletText(p, view).replace(/\*\*|`|\*/g, ""))} />
          ) : (
            <View style={{ gap: space[3] }}>
              {s.points.map((p, k) => (
                <View key={k} style={{ flexDirection: "row", gap: space[3] }}>
                  {s.style === "steps" ? (
                    <T v="bodyStrong" tone={alert ? "alert" : "muted"} num style={{ minWidth: 18 }}>
                      {k + 1}.
                    </T>
                  ) : (
                    <View style={{ width: 6, height: 6, marginTop: 11, borderRadius: 3, backgroundColor: alert ? c.alertFg : c.muted }} />
                  )}
                  <Rich text={bulletText(p, view)} v="reading" tone={alert ? "alert" : "ink"} style={{ flex: 1 }} />
                </View>
              ))}
            </View>
          );
        return (
          <Enter key={`${s.title}-${si}`} i={Math.min(si + 1, 6)}>
            {alert ? (
              <View style={{ borderRadius: layout.radius, backgroundColor: c.alertBg, padding: space[4], gap: space[3] }}>
                <T v="h2" tone="alert">
                  {s.title}
                </T>
                {body}
              </View>
            ) : (
              <Section title={s.title}>{body}</Section>
            )}
          </Enter>
        );
      })}
      {n.figures.length ? (
        <Section title="See it">
          <View style={{ gap: space[5] }}>
            {n.figures.map((f, k) => (
              <FigureWidget key={`${f.id}-${k}`} d={f} />
            ))}
          </View>
        </Section>
      ) : null}
      {n.terms.length ? (
        <Section title="Say it clinically">
          <View style={{ gap: space[3] }}>
            <OnceHint id="notes-flip">Tap a card to flip from everyday words to the clinical term.</OnceHint>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space[3] }}>
              {n.terms.map(([lay, term], k) => (
                <FlipCard key={`${lay}-${k}`} lay={lay} term={term} i={k} />
              ))}
            </View>
          </View>
        </Section>
      ) : null}
      <Section title="What to do now">
        <RowList>
          <Row testID="note-practise" title="Practise clinical words" onPress={() => openTarget({ screen: "practice", tool: "terms", web: "/practice/terms" })} />
        </RowList>
      </Section>
      <View style={{ flexDirection: "row", gap: space[3], borderTopWidth: 1, borderColor: c.hairline, paddingTop: space[5] }}>
        {neighbours.prev ? (
          <Press testID="note-prev" accessibilityRole="link" accessibilityLabel={`Previous: ${neighbours.prev.title}`} onPress={() => router.replace(`/notes/${encodeURIComponent(neighbours.prev!.id)}`)} innerStyle={{ minHeight: layout.target, flexDirection: "row", alignItems: "center", gap: space[2], paddingHorizontal: space[4], borderRadius: layout.radius, borderWidth: 1.5, borderColor: c.cardLine }}>
            <ArrowLeft size={18} color={c.ink} />
            <T v="small">Previous</T>
          </Press>
        ) : null}
        {neighbours.next ? (
          <Press testID="note-next" accessibilityRole="link" onPress={() => router.replace(`/notes/${encodeURIComponent(neighbours.next!.id)}`)} style={{ flex: 1 }} innerStyle={{ minHeight: layout.target, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: space[2], paddingHorizontal: space[4], borderRadius: layout.radius, borderWidth: 1.5, borderColor: c.cardLine }}>
            <T v="small" numberOfLines={1} style={{ flex: 1 }}>
              Next: {neighbours.next.title}
            </T>
            <ArrowRight size={18} color={c.ink} />
          </Press>
        ) : null}
      </View>
    </>
  );
}

export function NoteScreen() {
  const { id = "" } = useLocalSearchParams<{ id: string }>();
  const noteId = String(id);
  const qc = useQueryClient();
  const q = useNote(noteId);
  const list = useNotes();
  const view = settingsStore.use((s) => s.readAs);
  const [word, setWord] = React.useState<string | null>(null);
  const closeWord = React.useCallback(() => setWord(null), []);

  // Opening a note counts as reading it, as on the website.
  const loaded = !!q.data;
  React.useEffect(() => {
    if (!loaded) return;
    void saveLearn(qc, (st, today) => withNoteRead(st, noteId, today)).then(() => qc.invalidateQueries({ queryKey: learnKeys.notes }));
  }, [loaded, noteId, qc]);

  const all = list.data?.notes ?? [];
  const at = all.findIndex((n) => n.id === noteId);
  const neighbours = { prev: at > 0 ? all[at - 1]! : null, next: at >= 0 && at < all.length - 1 ? all[at + 1]! : null };
  const n = q.data;
  return (
    <TermPress.Provider value={setWord}>
      <Screen testID="note" onRefresh={() => void q.refetch()} refreshing={q.isRefetching}>
        <Stack.Screen options={{ title: "" }} />
        {n ? (
          <Enter i={0} style={{ gap: space[2] }}>
            <T v="small" tone="muted" num>
              {[n.blockTitle, at >= 0 ? `Note ${at + 1}` : null].filter(Boolean).join(" · ")}
            </T>
            <T v="h1">{n.title}</T>
            {n.tagline ? <T tone="muted">{n.tagline}</T> : null}
            <View style={{ paddingTop: space[2] }}>
              <Chips
                label="Explain as a"
                options={[
                  { id: "student", name: "Student" },
                  { id: "clinician", name: "Clinician" },
                ]}
                value={view}
                onChange={(v) => updateSettings({ readAs: v })}
              />
            </View>
          </Enter>
        ) : null}
        <Loaded q={q} what="this note" skeleton={<RowsSkeleton rows={6} />}>
          {(note) => (
            <ReadingSize>
              <NoteBody n={note} view={view} neighbours={neighbours} />
            </ReadingSize>
          )}
        </Loaded>
      </Screen>
      <TermSheet word={word} onClose={closeWord} />
    </TermPress.Provider>
  );
}
