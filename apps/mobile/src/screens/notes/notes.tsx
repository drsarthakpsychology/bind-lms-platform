import { useQueryClient } from "@tanstack/react-query";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { ArrowLeft, ArrowRight, BookA, Check, Languages, NotebookText, Pin } from "lucide-react-native";
import * as React from "react";
import { Pressable, View } from "react-native";
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withSpring } from "react-native-reanimated";

import { bulletText } from "@/api/adapt-learn";
import type { RevisionNote, RevisionNoteList, RevisionNoteSummary } from "@/api/contract";
import { learnKeys, useNote, useNotes, useTerms } from "@/api/learn";
import { Chips, IconDot, Jyo, Label, Loaded, QuietEmpty, Row, RowList, RowsSkeleton, Screen, Stone, T } from "@/ds";
import { Block, Bullets, JumpChips, LinkCard, LookupScreen, PinButton, SearchField, useJump, type Jump } from "@/library/kit";
import { pinnedNotes, recentNotes } from "@/library/pins";
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
import { go } from "@/api/prefetch";

/**
 * Revision notes: the website's one-page summaries (/study/notes), built for
 * looking things up. Search first, one row of chips for the part of the course,
 * what you pinned and opened last, then every note under its part.
 */

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

/** Notes whose title or one-line summary has the words, title matches first. */
export function searchNotes(notes: RevisionNoteSummary[], words: string): RevisionNoteSummary[] {
  const q = norm(words);
  if (!q) return notes;
  const scored: { n: RevisionNoteSummary; s: number }[] = [];
  for (const n of notes) {
    const title = norm(n.title);
    const s = title.startsWith(q) ? 3 : title.includes(q) ? 2 : norm(`${n.tagline} ${n.blockTitle}`).includes(q) ? 1 : 0;
    if (s) scored.push({ n, s });
  }
  return scored.sort((a, b) => b.s - a.s).map((x) => x.n);
}

export function NotesBody({ d }: { d: RevisionNoteList }) {
  const c = useTheme();
  const [text, setText] = React.useState("");
  const [part, setPart] = React.useState("all");
  const pinned = pinnedNotes.use();
  const recent = recentNotes.use();
  const titleOf = (n: RevisionNoteSummary) => n.blockTitle || d.blocks[n.block] || "Notes";
  const parts = React.useMemo(() => {
    const out: string[] = [];
    for (const n of d.notes) {
      const t = n.blockTitle || d.blocks[n.block] || "Notes";
      if (!out.includes(t)) out.push(t);
    }
    return out;
  }, [d]);
  if (!d.notes.length) return <QuietEmpty title="Revision notes open soon" body="Short notes for each topic show up here as your course goes on." art={<Jyo pose="resting" size={56} />} testID="notes-empty" />;
  const next = d.notes.find((n) => !n.readOn);
  const filtering = !!text.trim() || part !== "all";
  const found = searchNotes(part === "all" ? d.notes : d.notes.filter((n) => titleOf(n) === part), text);
  const open = (n: RevisionNoteSummary) => go(`/notes/${encodeURIComponent(n.id)}`);
  const row = (n: RevisionNoteSummary, prefix = "note") => (
    <Row
      key={n.id}
      testID={`${prefix}-${n.id}`}
      icon={<IconDot icon={NotebookText} />}
      title={n.title}
      meta={n.tagline}
      accessibilityLabel={`${n.title}. ${n.tagline}${n.readOn ? ". Read" : ""}`}
      trailing={pinned.includes(n.id) ? <Pin size={16} color={c.muted} fill={c.muted} accessibilityLabel="Pinned" /> : n.readOn ? <Check size={18} color={c.muted} accessibilityLabel="Read" /> : undefined}
      chevron={false}
      onPress={() => open(n)}
    />
  );
  const byId = (ids: string[]) => ids.map((id) => d.notes.find((n) => n.id === id)).filter((n): n is RevisionNoteSummary => !!n);
  const pins = byId(pinned);
  const recents = byId(recent)
    .filter((n) => !pinned.includes(n.id))
    .slice(0, 3);
  const groups: { title: string; items: RevisionNoteSummary[] }[] = [];
  for (const n of found) {
    const title = titleOf(n);
    const last = groups[groups.length - 1];
    if (last && last.title === title) last.items.push(n);
    else groups.push({ title, items: [n] });
  }
  return (
    <>
      <View style={{ gap: space[3] }}>
        <SearchField testID="notes-search" value={text} onChange={setText} placeholder="Search the notes" label="Search revision notes by topic" />
        {parts.length > 1 ? <Chips scroll label="Part of the course" options={[{ id: "all", name: "All" }, ...parts.map((p) => ({ id: p, name: p }))]} value={part} onChange={setPart} /> : null}
      </View>
      {!filtering && next ? (
        <Enter i={0}>
          <Stone testID="notes-next" accessibilityLabel={`Next note to read: ${next.title}. ${next.tagline}`} onPress={() => open(next)} pad={space[5]}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: space[4] }}>
              <View style={{ flex: 1, minWidth: 0, gap: space[1] }}>
                <T v="label" tone="muted">
                  {d.notes.some((n) => n.readOn) ? "Next unread" : "Start here"}
                </T>
                <T v="h2">{next.title}</T>
                {next.tagline ? (
                  <T v="small" tone="muted">
                    {next.tagline}
                  </T>
                ) : null}
              </View>
              <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: c.lime, alignItems: "center", justifyContent: "center" }}>
                <ArrowRight size={22} color={c.onLime} />
              </View>
            </View>
          </Stone>
        </Enter>
      ) : null}
      {!filtering && pins.length ? (
        <Enter i={1} style={{ gap: space[2] }}>
          <Label>Pinned</Label>
          <RowList bare>{pins.map((n) => row(n, "pinned"))}</RowList>
        </Enter>
      ) : null}
      {!filtering && recents.length ? (
        <Enter i={2} style={{ gap: space[2] }}>
          <Label>Recently opened</Label>
          <RowList bare>{recents.map((n) => row(n, "recent"))}</RowList>
        </Enter>
      ) : null}
      {found.length ? (
        text.trim() ? (
          <View style={{ gap: space[2] }}>
            <Label>{`${found.length} ${found.length === 1 ? "note" : "notes"}`}</Label>
            <RowList bare still>
              {found.map((n) => row(n))}
            </RowList>
          </View>
        ) : (
          groups.map((g) => (
            <View key={g.title} style={{ gap: space[2] }}>
              <Label>{g.title}</Label>
              <RowList bare>{g.items.map((n) => row(n))}</RowList>
            </View>
          ))
        )
      ) : (
        <QuietEmpty testID="notes-none" title="No note by that name" body="Try a shorter word, or look in the Quick reference." action={{ label: "Search the Quick reference", onPress: () => go(`/reference?q=${encodeURIComponent(text.trim())}`) }} />
      )}
    </>
  );
}

export function NotesScreen() {
  const q = useNotes();
  const n = q.data?.notes.length;
  return (
    <Screen area="library" testID="notes" title="Revision notes" lead={n ? `${n} one-page summaries` : "One page per topic"} gap={space[5]} onRefresh={() => void q.refetch()} refreshing={q.isRefetching}>
      <Loaded q={q} soon="/study/notes" what="your notes" skeleton={<RowsSkeleton rows={6} />}>
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
    const next = !on;
    setOn(next);
    turn.value = reduce ? (next ? 1 : 0) : withSpring(next ? 1 : 0, springs.snappy);
  };
  const face = { position: "absolute" as const, top: 0, left: 0, right: 0, bottom: 0, borderRadius: layout.radius, padding: space[3], justifyContent: "space-between" as const, backfaceVisibility: "hidden" as const };
  return (
    <Pressable testID={`flip-${i}`} accessibilityRole="button" accessibilityState={{ selected: on }} accessibilityLabel={on ? `${term}. Tap to see the everyday words.` : `They say: ${lay}. Tap to see the clinical term.`} onPress={flip} style={{ flexBasis: "47%", flexGrow: 1, minHeight: 104 }}>
      <Animated.View style={[face, { backgroundColor: c.card }, front]}>
        <T v="caption" tone="muted">
          They say
        </T>
        <T v="bodyStrong">“{lay}”</T>
      </Animated.View>
      <Animated.View style={[face, { backgroundColor: c.ink }, back]}>
        <T v="caption" tone="onInk">
          You write
        </T>
        <T v="bodyStrong" tone="onInk">
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

/** Lines people say ("How it sounds"): one under the other, never run together. */
function Quotes({ lines }: { lines: string[] }) {
  const c = useTheme();
  return (
    <View testID="note-quotes" style={{ gap: space[2] }}>
      {lines.map((l, k) => (
        <View key={k} style={{ backgroundColor: c.card, borderRadius: layout.radius, paddingVertical: space[3], paddingHorizontal: space[4] }}>
          <T v="reading">{l}</T>
        </View>
      ))}
    </View>
  );
}
const looksSpoken = (words: string[]) => words.some((w) => w.length > 32 || /^["\u201c\u2018']/.test(w));

export function NoteBody({ n, view, neighbours, jump }: { n: RevisionNote; view: "student" | "clinician"; neighbours: { prev: RevisionNoteSummary | null; next: RevisionNoteSummary | null }; jump?: Jump }) {
  const c = useTheme();
  const ids = n.sections.map((_, i) => `s${i}`);
  return (
    <>
      <Enter i={0}>
        <Stone pad={space[5]} testID="note-short">
          <View style={{ gap: space[2] }}>
            <T v="label" tone="muted">
              {view === "clinician" ? "Clinical summary" : "In short"}
            </T>
            {points(bulletText(n.tldr, view), 4).map((p, i) => (
              <Rich key={i} text={p} v="h3" />
            ))}
          </View>
        </Stone>
      </Enter>
      {jump && n.sections.length > 3 ? <JumpChips items={n.sections.map((s, i) => ({ id: ids[i]!, name: s.title }))} onJump={jump.go} /> : null}
      {n.sections.map((s, si) => {
        const alert = s.style === "alert";
        const words = s.style === "chips" ? s.points.map((p) => bulletText(p, view).replace(/\*\*|`|\*/g, "")) : [];
        const body =
          s.style === "chips" ? (
            looksSpoken(words) ? (
              <Quotes lines={words} />
            ) : (
              <WordList words={words} />
            )
          ) : (
            <Bullets items={s.points.map((p) => bulletText(p, view))} steps={s.style === "steps"} tone={alert ? "alert" : undefined} render={(t) => <Rich text={t} v="reading" tone={alert ? "alert" : "ink"} />} />
          );
        return (
          <Block key={`${s.title}-${si}`} title={s.title} alert={alert} onLayout={jump?.at(ids[si]!)} testID={`note-section-${si}`}>
            {body}
          </Block>
        );
      })}
      {n.figures.length ? (
        <Block title="See it">
          <View style={{ gap: space[5] }}>
            {n.figures.map((f, k) => (
              <FigureWidget key={`${f.id}-${k}`} d={f} />
            ))}
          </View>
        </Block>
      ) : null}
      {n.terms.length ? (
        <Block title="Say it clinically">
          <OnceHint id="notes-flip">Tap a card to flip from everyday words to the clinical term.</OnceHint>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space[3] }}>
            {n.terms.map(([lay, term], k) => (
              <FlipCard key={`${lay}-${k}`} lay={lay} term={term} i={k} />
            ))}
          </View>
        </Block>
      ) : null}
      <View style={{ gap: space[2] }}>
        <Label>Practise this</Label>
        <LinkCard
          items={[
            { testID: "note-practise", title: "Practise clinical words", meta: "Match everyday words to the clinical term", icon: <Languages size={20} color={c.ink} />, onPress: () => openTarget({ screen: "practice", tool: "terms", web: "/practice/terms" }) },
            { testID: "note-reference", title: "Look it up in the Quick reference", meta: "Disorder cards, medicines and words", icon: <BookA size={20} color={c.ink} />, onPress: () => go(`/reference?q=${encodeURIComponent(n.title)}`) },
          ]}
        />
      </View>
      {neighbours.prev || neighbours.next ? (
        <View style={{ flexDirection: "row", gap: space[3] }}>
          {neighbours.prev ? (
            <Press testID="note-prev" accessibilityRole="link" accessibilityLabel={`Previous: ${neighbours.prev.title}`} onPress={() => router.replace(`/notes/${encodeURIComponent(neighbours.prev!.id)}`)} innerStyle={{ minHeight: layout.primary, flexDirection: "row", alignItems: "center", gap: space[2], paddingHorizontal: space[4], borderRadius: layout.primary / 2, backgroundColor: c.card }}>
              <ArrowLeft size={18} color={c.ink} />
              <T v="small">Previous</T>
            </Press>
          ) : null}
          {neighbours.next ? (
            <Press testID="note-next" accessibilityRole="link" accessibilityLabel={`Next: ${neighbours.next.title}`} onPress={() => router.replace(`/notes/${encodeURIComponent(neighbours.next!.id)}`)} style={{ flex: 1 }} innerStyle={{ minHeight: layout.primary, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: space[2], paddingHorizontal: space[4], borderRadius: layout.primary / 2, backgroundColor: c.card }}>
              <T v="small" numberOfLines={1} style={{ flex: 1 }}>
                Next: {neighbours.next.title}
              </T>
              <ArrowRight size={18} color={c.ink} />
            </Press>
          ) : null}
        </View>
      ) : null}
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
  const jump = useJump();

  // Opening a note counts as reading it, as on the website, and puts it in Recently opened.
  const loaded = !!q.data;
  React.useEffect(() => {
    if (!loaded) return;
    recentNotes.add(noteId);
    void saveLearn(qc, (st, today) => withNoteRead(st, noteId, today)).then(() => qc.invalidateQueries({ queryKey: learnKeys.notes }));
  }, [loaded, noteId, qc]);

  const all = list.data?.notes ?? [];
  const at = all.findIndex((n) => n.id === noteId);
  const neighbours = { prev: at > 0 ? all[at - 1]! : null, next: at >= 0 && at < all.length - 1 ? all[at + 1]! : null };
  const n = q.data;
  return (
    <TermPress.Provider value={setWord}>
      <LookupScreen testID="note" jump={jump} tag={n ? n.blockTitle || "Revision note" : undefined} title={n?.title} sub={n?.tagline || undefined} onRefresh={() => void q.refetch()} refreshing={q.isRefetching} pin={n ? <PinButton list={pinnedNotes} id={noteId} name={n.title} /> : undefined}>
        <Stack.Screen options={{ title: "" }} />
        {n ? (
          <Chips
            label="Explain as a"
            options={[
              { id: "student", name: "Student" },
              { id: "clinician", name: "Clinician" },
            ]}
            value={view}
            onChange={(v) => updateSettings({ readAs: v })}
          />
        ) : null}
        <Loaded q={q} what="this note" skeleton={<RowsSkeleton rows={6} />}>
          {(note) => (
            <ReadingSize>
              <NoteBody n={note} view={view} neighbours={neighbours} jump={jump} />
            </ReadingSize>
          )}
        </Loaded>
      </LookupScreen>
      <TermSheet word={word} onClose={closeWord} />
    </TermPress.Provider>
  );
}
