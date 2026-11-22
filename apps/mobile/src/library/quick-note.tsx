import { router, Stack, useLocalSearchParams } from "expo-router";
import { BookOpen, Dumbbell } from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";

import { Label, QuietEmpty, RowsSkeleton, T } from "@/ds";
import { ReadingSize } from "@/lib/reading";
import { openTarget } from "@/nav/targets";
import { layout, space, useTheme } from "@/theme";
import { Block, Bullets, FactStrip, JumpChips, LinkCard, Loads, LookupScreen, PairTable, PinButton, useJump } from "./kit";
import { pinnedQuick, recentQuick, useQuickNote } from "./quick-notes";
import type { QuickNoteView, QuickSection, QuickTable } from "./quick-notes-types";

/**
 * A table on a phone: each row is a small stacked block (its first cell as
 * the heading, then each column's name above its value), so nothing ever
 * scrolls sideways. Never animated: these are facts people copy down.
 */
export function StackedTable({ t, testID }: { t: QuickTable; testID?: string }) {
  const c = useTheme();
  return (
    <View testID={testID} accessibilityRole="list" style={{ backgroundColor: c.card, borderRadius: layout.radiusLg, paddingHorizontal: space[4] }}>
      {t.rows.map((r, i) => (
        <View key={i} accessible accessibilityLabel={r.map((cell, j) => (j === 0 ? cell : `${t.head[j] ?? ""}: ${cell}`)).join(". ")} style={{ paddingVertical: space[3], gap: space[2], borderTopWidth: i ? 1 : 0, borderColor: c.hairline }}>
          <T v="bodyStrong">{r[0]}</T>
          {r.slice(1).map((cell, j) => (
            <View key={j} style={{ gap: 1 }}>
              <T v="caption" tone="muted">
                {t.head[j + 1] ?? ""}
              </T>
              <T v="small">{cell}</T>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

function SectionBody({ s, i }: { s: QuickSection; i: number }) {
  return (
    <>
      {s.bullets?.length ? <Bullets items={s.bullets} /> : null}
      {s.steps?.length ? <Bullets items={s.steps} steps /> : null}
      {s.table ? <StackedTable t={s.table} testID={`qn-table-${i}`} /> : null}
      {s.pairs?.length ? <PairTable rows={s.pairs.map((p, k) => ({ label: p.label, value: p.value, testID: `qn-pair-${i}-${k}`, onPress: p.noteId ? () => router.push(`/notes/${encodeURIComponent(p.noteId!)}`) : undefined }))} /> : null}
    </>
  );
}

export function QuickNoteBody({ v, jump }: { v: QuickNoteView; jump: ReturnType<typeof useJump> }) {
  const c = useTheme();
  return (
    <>
      <T v="reading" tone="muted">
        {v.oneLine}
      </T>
      <FactStrip facts={v.facts} testID="qn-facts" />
      <JumpChips items={v.sections.length > 4 ? v.sections.map((s) => ({ id: s.id, name: s.title })) : []} onJump={jump.go} />
      {v.sections.map((s, i) => (
        <Block key={s.id} title={s.title} onLayout={jump.at(s.id)} testID={`qn-section-${s.id}`}>
          <SectionBody s={s} i={i} />
        </Block>
      ))}
      {v.alert ? (
        <Block title={v.alert.title} alert testID="qn-alert">
          <Bullets items={v.alert.points} tone="alert" />
        </Block>
      ) : null}
      {v.deeper.length ? (
        <View style={{ gap: space[2] }}>
          <Label>Go deeper</Label>
          <LinkCard testID="qn-deeper" items={v.deeper.map((l, k) => ({ testID: `qn-deeper-${k}`, title: l.label, meta: l.meta, icon: <BookOpen size={20} color={c.ink} />, onPress: () => openTarget(l.target) }))} />
        </View>
      ) : null}
      {v.practise.length ? (
        <View style={{ gap: space[2] }}>
          <Label>Practise this</Label>
          <LinkCard testID="qn-practise" items={v.practise.map((l, k) => ({ testID: `qn-practise-${k}`, title: l.label, meta: l.meta, icon: <Dumbbell size={20} color={c.ink} />, onPress: () => openTarget(l.target) }))} />
        </View>
      ) : null}
      {v.careLine || v.sourceLine ? (
        <View style={{ gap: space[2], borderTopWidth: 1, borderColor: c.hairline, paddingTop: space[4] }}>
          {v.careLine ? (
            <T v="caption" tone="muted">
              {v.careLine}
            </T>
          ) : null}
          {v.sourceLine ? (
            <T v="caption" tone="muted" testID="qn-source">
              {v.sourceLine}
            </T>
          ) : null}
        </View>
      ) : null}
    </>
  );
}

/** One Quick Note, any type: what it is and its name on the field, the facts and sections on the layer, then where to go next. */
export function QuickNoteScreen({ id: given }: { id?: string } = {}) {
  const { id: param = "" } = useLocalSearchParams<{ id: string }>();
  const id = String(given ?? param);
  const q = useQuickNote(id);
  const jump = useJump();
  const v = q.data;
  React.useEffect(() => {
    if (v?.id) recentQuick.add(v.id);
  }, [v?.id]);
  return (
    <LookupScreen
      testID="quick-note"
      jump={jump}
      tag={v ? `${v.typeLabel} · ${v.topicLabel}` : undefined}
      title={v?.title}
      onRefresh={() => void q.refetch()}
      refreshing={q.isRefetching}
      pin={v ? <PinButton list={pinnedQuick} id={v.id} name={v.title} /> : undefined}
    >
      <Stack.Screen options={{ title: "" }} />
      <Loads q={q} what="this note" skeleton={<RowsSkeleton rows={6} />} missing={<QuietEmpty testID="quick-note-missing" title="This note is not here" body="It may have moved. Search Quick Notes for it." action={{ label: "Open Quick Notes", onPress: () => router.replace("/notes") }} />}>
        {(note) => (
          <ReadingSize>
            <View style={{ gap: space[6] }}>
              <QuickNoteBody v={note} jump={jump} />
            </View>
          </ReadingSize>
        )}
      </Loads>
    </LookupScreen>
  );
}
