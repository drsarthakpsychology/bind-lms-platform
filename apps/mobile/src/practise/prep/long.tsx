import { router, useLocalSearchParams } from "expo-router";
import { Check } from "lucide-react-native";
import * as React from "react";
import { Pressable, View } from "react-native";
import Animated, { FadeInDown, useReducedMotion } from "react-native-reanimated";

import { Button, EmptyState, LoadError, Row, RowList, RowsSkeleton, Screen, Section, T } from "@/ds";
import { haptic } from "@/lib/haptics";
import { Rich } from "@/study/rich";
import { fonts, layout, motion, space, useTheme } from "@/theme";
import { isSoon, play, useMove, usePlayQuery } from "../api";
import { GameFrame, MoveError } from "../frame";
import type { LongAnswer, LongItem, LongList } from "../types";

const LEVEL = ["", "Easy", "Medium", "Hard", "Very hard"];

/** Long answers: the list, or one question with Show answer. */
export function LongScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const q = usePlayQuery<LongList>([], "prep", "long");
  if (id) {
    const item = q.data?.items.find((x) => x.id === id);
    if (item) return <LongQuestion item={item} />;
  }
  return (
    <Screen testID="prep-long" title="Long answers" lead="Write your answer first, on paper or in your head. Then see the model answer.">
      {q.isError ? (
        isSoon(q.error) ? <EmptyState mood="sleepy" title="Coming in the next update" body="Long answers are ready on the website and arrive in the app soon." /> : <LoadError onRetry={() => void q.refetch()} />
      ) : !q.data ? (
        <RowsSkeleton rows={5} />
      ) : (
        <RowList>
          {q.data.items.map((l) => (
            <Row key={l.id} testID={`long-${l.id}`} title={l.question} meta={`${l.marks} marks · ${LEVEL[l.difficulty] ?? ""}`} onPress={() => router.push(`/prep/long?id=${encodeURIComponent(l.id)}`)} />
          ))}
        </RowList>
      )}
    </Screen>
  );
}

/** A model answer in the website's light format: "## " headings, "- " bullets, "| a | b |" table rows. */
export function LongText({ text }: { text: string }) {
  const c = useTheme();
  const blocks = text.split("\n").filter((l) => l.trim());
  return (
    <View style={{ gap: space[2] }}>
      {blocks.map((l, k) => {
        if (l.startsWith("## ")) return <T key={k} v="h3" style={{ marginTop: k ? space[3] : 0 }}>{l.slice(3)}</T>;
        if (l.startsWith("- ")) return <View key={k} style={{ flexDirection: "row", gap: space[2] }}><T v="reading" tone="muted">•</T><Rich text={l.slice(2)} v="reading" style={{ flex: 1 }} /></View>;
        if (l.startsWith("|")) {
          const cells = l.split("|").slice(1, -1).map((x) => x.trim());
          if (cells.every((x) => /^-+$/.test(x))) return null;
          return (
            <View key={k} style={{ flexDirection: "row", gap: space[2], borderBottomWidth: 1, borderColor: c.hairline, paddingVertical: space[1] }}>
              {cells.map((x, j) => (
                <Rich key={j} text={x} v="small" style={{ flex: 1 }} />
              ))}
            </View>
          );
        }
        return <Rich key={k} text={l} v="reading" />;
      })}
    </View>
  );
}

function LongQuestion({ item }: { item: LongItem }) {
  const c = useTheme();
  const reduce = useReducedMotion();
  const mv = useMove();
  const [ans, setAns] = React.useState<LongAnswer | null>(null);
  const [ticked, setTicked] = React.useState<number[]>([]);
  const show = async () => {
    const r = await mv.run(() => play<LongAnswer>("prep", "longAnswer", item.id));
    if (r) setAns(r);
  };
  return (
    <GameFrame testID="long-question" title={`${item.marks} marks`} thumb={ans ? <Button kind="quiet" label="Back to the list" onPress={() => router.back()} /> : <Button label="Show answer" onPress={() => void show()} busy={mv.pending} testID="long-show" />}>
      <T v="h2">{item.question}</T>
      <Section title="How to plan it" quiet>
        {item.plan.map((s, k) => (
          <View key={k} style={{ flexDirection: "row", gap: space[3] }}>
            <T v="score" style={{ width: 20 }} num>
              {k + 1}
            </T>
            <T style={{ flex: 1 }}>{s}</T>
          </View>
        ))}
      </Section>
      <MoveError text={mv.error} />
      {ans ? (
        <Animated.View entering={reduce ? undefined : FadeInDown.duration(motion.fill)} style={{ gap: space[6] }} testID="long-answer">
          <Section title="Model answer">
            <LongText text={ans.answer} />
          </Section>
          <Section title="What the examiner looks for">
            <T v="small" tone="muted">
              Tick what your answer had.
            </T>
            {ans.keyPoints.map((p, k) => {
              const on = ticked.includes(k);
              return (
                <Pressable key={k} accessibilityRole="checkbox" accessibilityState={{ checked: on }} accessibilityLabel={p} onPress={() => { haptic.select(); setTicked((t) => (on ? t.filter((x) => x !== k) : [...t, k])); }} style={{ flexDirection: "row", gap: space[3], minHeight: layout.target, alignItems: "center" }}>
                  <View style={{ width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: c.ink, backgroundColor: on ? c.ink : "transparent", alignItems: "center", justifyContent: "center" }}>{on ? <Check size={14} color={c.bg} strokeWidth={3} /> : null}</View>
                  <Rich text={p} style={{ flex: 1 }} />
                </Pressable>
              );
            })}
            <T style={{ fontFamily: fonts.pixelDigits, fontSize: 20, lineHeight: 26, color: c.link }} accessibilityLiveRegion="polite">
              {`${ticked.length} of ${ans.keyPoints.length} covered`}
            </T>
          </Section>
          {ans.pitfalls.length ? (
            <Section title="Where marks are lost">
              {ans.pitfalls.map((p, k) => (
                <T key={k} v="small">
                  · {p}
                </T>
              ))}
            </Section>
          ) : null}
        </Animated.View>
      ) : null}
    </GameFrame>
  );
}
