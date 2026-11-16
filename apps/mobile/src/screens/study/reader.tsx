import { useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { ALargeSmall, ArrowRight, Bookmark, Check, ChevronLeft, ListOrdered, NotebookPen } from "lucide-react-native";
import * as React from "react";
import { Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { Card as RecallCard, Mcq, SectionContent } from "@/api/contract";
import { useMarks } from "@/api/learn";
import { keys, useModule, useSection } from "@/api/queries";
import { Button, Chips, LoadError, OptionRow, ProgressLine, Row, RowList, Sheet, Skeleton, T, VerdictBand } from "@/ds";
import { toast } from "@/ds/toast";
import { haptic } from "@/lib/haptics";
import { Blocks, type BlockContext } from "@/study/blocks";
import { Rich, TermPress } from "@/study/rich";
import { useOnce } from "@/lib/once";
import { ReadingSize, TextSizeSheet } from "@/lib/reading";
import { settingsStore, updateSettings } from "@/lib/settings";
import { NoteSheet, saveMark } from "@/screens/learn/saved";
import { TermSheet } from "@/screens/reference/reference";
import { saveLearn, withLastRead, withSectionDone } from "@/study/state";
import { layout, space, useTheme } from "@/theme";

/**
 * The section reader. One short part at a time on a 65 character line,
 * one toolbar row (back, where you are, the section list, a bookmark),
 * a thin line for how far through the section you are, and one action
 * pinned low: Next part, then Finish, then the next section.
 */

function RecallCards({ cards }: { cards: RecallCard[] }) {
  const c = useTheme();
  const [open, setOpen] = React.useState<Set<number>>(new Set());
  return (
    <View style={{ gap: space[3] }}>
      {cards.map((card, i) => (
        <Pressable
          key={i}
          accessibilityRole="button"
          accessibilityState={{ expanded: open.has(i) }}
          onPress={() => {
            haptic.select();
            setOpen((s) => new Set(s).add(i));
          }}
          style={{ borderRadius: layout.radius, backgroundColor: c.tint, padding: space[4], gap: space[2], minHeight: layout.row }}
        >
          <Rich text={card.q} v="bodyStrong" />
          {open.has(i) ? <Rich text={card.a} v="reading" tone="muted" /> : <T v="small" tone="link">Say it aloud, then tap to check</T>}
        </Pressable>
      ))}
    </View>
  );
}

function Practice({ items }: { items: Mcq[] }) {
  const [picks, setPicks] = React.useState<Record<number, number>>({});
  return (
    <View style={{ gap: space[5] }}>
      {items.map((m, i) => {
        const p = picks[i];
        return (
          <View key={i} style={{ gap: space[2] }}>
            <Rich text={m.q} v="bodyStrong" />
            {m.options.map((o, j) => (
              <OptionRow key={j} index={j} text={o} disabled={p !== undefined} state={p === undefined ? "idle" : j === m.answer ? "right" : j === p ? "wrong" : "dim"} onPress={() => setPicks((s) => ({ ...s, [i]: j }))} />
            ))}
            {p !== undefined ? <VerdictBand right={p === m.answer} why={m.why} seed={i} /> : null}
          </View>
        );
      })}
    </View>
  );
}

export function ReaderBody({ s, view, part, finished }: { s: SectionContent; view: "student" | "clinician"; part: number; finished: boolean }) {
  const ctx: BlockContext = { moduleId: s.moduleId, sectionId: s.section.id, view };
  const chunk = s.chunks[part];
  if (finished || !chunk) {
    return (
      <View style={{ gap: layout.section }} testID="reader-end">
        <View style={{ gap: space[2] }}>
          <T v="small" tone="muted">
            {s.section.num} done
          </T>
          <T v="h1">{s.section.title}</T>
        </View>
        {s.recall.length ? (
          <View style={{ gap: space[3] }}>
            <T v="h3">Say it out loud</T>
            <RecallCards cards={s.recall} />
          </View>
        ) : null}
        {s.viva.length ? (
          <View style={{ gap: space[3] }}>
            <T v="h3">Viva questions</T>
            <RecallCards cards={s.viva} />
          </View>
        ) : null}
        {s.mcq.length ? (
          <View style={{ gap: space[3] }}>
            <T v="h3">{s.section.levelCheck ? s.section.title : "Check yourself"}</T>
            <Practice items={s.mcq} />
          </View>
        ) : null}
      </View>
    );
  }
  return (
    <View style={{ gap: space[5] }} testID={`reader-part-${part}`}>
      {part === 0 ? (
        <View style={{ gap: space[2] }}>
          <T v="small" tone="muted">
            {s.section.num} · Module {s.moduleNum}
          </T>
          <T v="h1">{s.section.title}</T>
        </View>
      ) : null}
      {s.chunks.length > 1 ? <T v="h2">{chunk.title}</T> : null}
      <Blocks blocks={chunk.blocks} ctx={ctx} />
    </View>
  );
}

/**
 * One icon button in the reader bar. The first time the reader opens on this
 * phone each icon carries its name underneath; after that, icons only.
 */
function BarButton({ name, label, onPress, testID, children, named, selected }: { name: string; label: string; onPress: () => void; testID?: string; children: React.ReactNode; named: boolean; selected?: boolean }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityState={selected === undefined ? undefined : { selected }} onPress={onPress} testID={testID} style={{ minWidth: layout.target, minHeight: layout.target, paddingHorizontal: named ? 2 : 0, alignItems: "center", justifyContent: "center" }}>
      {children}
      {named ? (
        <T v="caption" tone="muted" maxFontSizeMultiplier={1.2} importantForAccessibility="no" accessibilityElementsHidden>
          {name}
        </T>
      ) : null}
    </Pressable>
  );
}

/** "2.1 of 4": where you are in the module, never the (long) title, which lives on the page. */
export function readerPlace(num: string, sections: { isTest?: boolean }[] | undefined): string {
  const total = (sections ?? []).filter((x) => !x.isTest).length;
  return total ? `${num} of ${total}` : num;
}

export function ReaderScreen() {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const qc = useQueryClient();
  const params = useLocalSearchParams<{ moduleId: string; sectionId: string }>();
  const moduleId = String(params.moduleId ?? "");
  const sectionId = String(params.sectionId ?? "");
  const q = useSection(moduleId, sectionId);
  const mod = useModule(moduleId);
  const [part, setPart] = React.useState(0);
  const [finished, setFinished] = React.useState(false);
  const view = settingsStore.use((x) => x.readAs);
  const setView = (v: "student" | "clinician") => updateSettings({ readAs: v });
  const [toc, setToc] = React.useState(false);
  const [sizeOpen, setSizeOpen] = React.useState(false);
  const closeSize = React.useCallback(() => setSizeOpen(false), []);
  const named = useOnce("reader-bar-names");
  const marks = useMarks();
  const markKey = `${moduleId}/${sectionId}`;
  const marked = !!marks.data?.marks.bookmarks[markKey]?.on;
  const hasNote = !!marks.data?.marks.notes[markKey]?.text;
  const [noteOpen, setNoteOpen] = React.useState(false);
  const closeNote = React.useCallback(() => setNoteOpen(false), []);
  const [word, setWord] = React.useState<string | null>(null);
  const closeWord = React.useCallback(() => setWord(null), []);
  const [saving, setSaving] = React.useState(false);
  const started = React.useRef(0);
  React.useEffect(() => {
    started.current = Date.now();
  }, []);
  const scroll = React.useRef<React.ComponentRef<typeof ScrollView>>(null);
  const s = q.data;

  // Remember where they are reading (Home's Continue uses it).
  React.useEffect(() => {
    if (s && !s.section.isTest) void saveLearn(qc, (st) => withLastRead(st, moduleId, sectionId));
  }, [s, qc, moduleId, sectionId]);

  // A test section is a quiz screen, not reading.
  React.useEffect(() => {
    if (s?.section.isTest) router.replace(`/study/${encodeURIComponent(moduleId)}/test`);
  }, [s, moduleId]);

  const toTop = () => scroll.current?.scrollTo({ y: 0, animated: false });
  const back = () => (router.canGoBack() ? router.back() : router.replace(`/study/${encodeURIComponent(moduleId)}`));

  const finish = async () => {
    if (!s) return;
    setSaving(true);
    await saveLearn(qc, (st, today) => withSectionDone(st, moduleId, sectionId, today, (Date.now() - started.current) / 1000));
    setSaving(false);
    haptic.success();
    setFinished(true);
    toTop();
    void qc.invalidateQueries({ queryKey: keys.module(moduleId) });
    void qc.invalidateQueries({ queryKey: keys.study });
    void qc.invalidateQueries({ queryKey: keys.home });
  };

  const bookmark = async () => {
    const next = !marked;
    haptic.select();
    const ok = await saveMark(qc, { v: 1, bookmarks: { [markKey]: { on: next, at: Date.now() } }, notes: {} });
    toast.show(ok ? (next ? "Bookmarked" : "Bookmark removed") : "Saved on this phone");
  };

  const total = s?.chunks.length ?? 1;
  const pct = finished ? 100 : Math.round(((part + 1) / Math.max(1, total)) * 100);
  const isLast = part >= total - 1;
  const openCheckpoint = s?.checkpoints.find((cp) => cp.sectionIds.includes(sectionId) && cp.sectionIds[cp.sectionIds.length - 1] === sectionId);

  let action: React.ReactNode = null;
  if (s && !finished) {
    action = isLast ? (
      <Button label="Finish this section" busy={saving} icon={<Check size={20} color={c.onPrimary} />} onPress={() => void finish()} testID="reader-finish" />
    ) : (
      <Button
        label="Next part"
        icon={<ArrowRight size={20} color={c.onPrimary} />}
        onPress={() => {
          setPart((p) => p + 1);
          toTop();
        }}
        testID="reader-next"
      />
    );
  } else if (s && finished) {
    action = openCheckpoint ? (
      <Button label="Take the checkpoint" icon={<ArrowRight size={20} color={c.onPrimary} />} onPress={() => router.replace(`/study/${encodeURIComponent(moduleId)}/checkpoint/${openCheckpoint.n}`)} testID="reader-checkpoint" />
    ) : s.next ? (
      <Button label={`Next: ${s.next.title}`} icon={<ArrowRight size={20} color={c.onPrimary} />} onPress={() => router.replace(`/study/${encodeURIComponent(moduleId)}/${encodeURIComponent(s.next!.sectionId)}`)} testID="reader-next-section" />
    ) : (
      <Button label="Back to the module" onPress={() => router.replace(`/study/${encodeURIComponent(moduleId)}`)} />
    );
  }

  const closeToc = React.useCallback(() => setToc(false), []);

  return (
    <TermPress.Provider value={setWord}>
    <View testID="reader" style={{ flex: 1, backgroundColor: c.bg }}>
      <View style={{ paddingTop: insets.top, backgroundColor: c.bg, borderBottomWidth: 1, borderColor: c.hairline }}>
        <View style={{ minHeight: 56, flexDirection: "row", alignItems: "center", paddingHorizontal: space[1] }}>
          <Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={back} style={{ width: layout.target, height: layout.target, alignItems: "center", justifyContent: "center" }} testID="reader-back">
            <ChevronLeft size={26} color={c.ink} />
          </Pressable>
          <T v="small" tone="muted" num style={{ flex: 1 }} testID="reader-place" accessibilityLabel={s ? `Section ${readerPlace(s.section.num, mod.data?.sections)}` : undefined}>
            {s ? readerPlace(s.section.num, mod.data?.sections) : " "}
          </T>
          <BarButton name="Size" label="Text size" named={named} onPress={() => setSizeOpen(true)} testID="reader-size">
            <ALargeSmall size={24} color={c.ink} />
          </BarButton>
          <BarButton name="Sections" label="Sections of this module" named={named} onPress={() => setToc(true)} testID="reader-toc">
            <ListOrdered size={22} color={c.ink} />
          </BarButton>
          <BarButton name="Save" label={marked ? "Remove bookmark" : "Bookmark this section"} selected={marked} named={named} onPress={() => void bookmark()} testID="reader-bookmark">
            <Bookmark size={22} color={marked ? c.link : c.ink} fill={marked ? c.link : "none"} />
          </BarButton>
          {s && !s.section.isTest ? (
            <BarButton name="Note" label={hasNote ? "Change my note" : "Write a note"} named={named} onPress={() => setNoteOpen(true)} testID="reader-note">
              <NotebookPen size={22} color={hasNote ? c.link : c.ink} />
            </BarButton>
          ) : null}
        </View>
        <ProgressLine value={pct} height={3} label={`Part ${Math.min(part + 1, total)} of ${total}`} />
      </View>
      <ScrollView ref={scroll} contentContainerStyle={{ paddingHorizontal: layout.gutter, paddingTop: space[5], paddingBottom: space[7], width: "100%", maxWidth: layout.readingWidth + layout.gutter * 2, alignSelf: "center" }}>
        {s ? (
          <ReadingSize>
            <ReaderBody s={s} view={view} part={part} finished={finished} />
          </ReadingSize>
        ) : q.isError ? (
          <LoadError what="this section" error={q.error} onRetry={() => void q.refetch()} />
        ) : (
          <View style={{ gap: space[3] }} testID="reader-skeleton">
            <Skeleton w="30%" h={14} />
            <Skeleton w="80%" h={30} />
            {[92, 98, 86, 95, 70].map((w, i) => (
              <Skeleton key={i} w={`${w}%`} h={16} />
            ))}
          </View>
        )}
      </ScrollView>
      {action ? <View style={{ borderTopWidth: 1, borderColor: c.hairline, paddingHorizontal: layout.gutter, paddingTop: space[3], paddingBottom: insets.bottom + space[3] }}>{action}</View> : null}
      <Sheet open={toc} onClose={closeToc} title={mod.data?.title ?? "Sections"}>
        <View style={{ gap: space[4] }}>
          <View style={{ gap: space[2] }}>
            <T v="small" tone="muted">
              Read as a
            </T>
            <Chips
              label="Read as a"
              options={[
                { id: "student", name: "Student" },
                { id: "clinician", name: "Clinician" },
              ]}
              value={view}
              onChange={setView}
            />
          </View>
          <RowList bare>
            {(mod.data?.sections ?? []).map((x) => (
              <Row
                key={x.id}
                title={`${x.num} ${x.title}`}
                current={x.id === sectionId}
                trailing={x.doneOn ? <Check size={18} color={c.ink} /> : undefined}
                chevron={false}
                onPress={() => {
                  setToc(false);
                  if (x.id !== sectionId) router.replace(x.isTest ? `/study/${encodeURIComponent(moduleId)}/test` : `/study/${encodeURIComponent(moduleId)}/${encodeURIComponent(x.id)}`);
                }}
              />
            ))}
          </RowList>
        </View>
      </Sheet>
      <TextSizeSheet open={sizeOpen} onClose={closeSize} />
      <NoteSheet open={noteOpen} onClose={closeNote} markKey={markKey} label={s ? `${s.section.num} ${s.section.title}` : ""} />
      <TermSheet word={word} onClose={closeWord} />
    </View>
    </TermPress.Provider>
  );
}
