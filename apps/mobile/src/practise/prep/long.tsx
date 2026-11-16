import { router, useLocalSearchParams } from "expo-router";
import { Check } from "lucide-react-native";
import * as React from "react";
import { Pressable, View } from "react-native";
import Animated, { FadeInDown, useReducedMotion } from "react-native-reanimated";

import { Button, LoadError, Row, RowList, RowsSkeleton, Screen, Section, StillTrying, T } from "@/ds";
import type { Block } from "@/api/contract";
import { Blocks } from "@/study/blocks";
import { haptic } from "@/lib/haptics";
import { Rich } from "@/study/rich";
import { fonts, layout, motion, space, useTheme } from "@/theme";
import { useRead } from "../api";
import type { PrepLong } from "../contract";
import { Bump, Stagger } from "../fx";
import { GameFrame } from "../frame";
type LongItem = { id: string; subject: string; topic: string; marks: number; difficulty: number; question: string; plan: string[]; blocks: Block[]; keyPoints: string[]; pitfalls?: string[] };

const LEVEL = ["", "Easy", "Medium", "Hard", "Very hard"];

type LongHome = { subjects: { subject: string; title: string; count: number }[] };
type LongSubject = { subject: string; title: string; topics: { id: string; title: string; count: number }[] };
type LongTopic = { subject: string; topic: string; title: string; items: { id: string; question: string; marks: number; difficulty: number }[] };
type LongQ = { item: LongItem; next: { id: string; question: string } | null };
const enc = encodeURIComponent;

/** "Long answers: Statistics": the subject alone read like the subject's own page. */
export function longTitle(subject: string): string {
  return `Long answers: ${subject}`;
}

/** Long answers (GET /prep/long...): subjects, topics, questions, then one question with Show answer. */
export function LongScreen() {
  const p = useLocalSearchParams<{ subject?: string; topic?: string; id?: string }>();
  const path = `/prep/long${p.subject ? `/${enc(p.subject)}` : ""}${p.subject && p.topic ? `/${enc(p.topic)}` : ""}${p.subject && p.topic && p.id ? `/${enc(p.id)}` : ""}`;
  const q = useRead<PrepLong>(path);
  const d = q.data;
  if (d?.level === "question") return <LongQuestion key={p.id} q={d.data as unknown as LongQ} subject={p.subject!} topic={p.topic!} />;
  const go = (qs: string) => router.push(`/prep/long?${qs}`);
  const title = d?.level === "subject" ? longTitle((d.data as unknown as LongSubject).title) : d?.level === "topic" ? (d.data as unknown as LongTopic).title : "Long answers";
  return (
    <Screen testID="prep-long" title={title} lead={d?.level === "home" || !d ? "Write your answer first, on paper or in your head. Then see the model answer." : undefined}>
      {q.isError ? (
        <LoadError error={q.error} onRetry={() => void q.refetch()} />
      ) : !d ? (
        <View style={{ gap: space[3] }}>
          <RowsSkeleton rows={5} />
          <StillTrying failed={q.failureCount > 0} />
        </View>
      ) : (
        <Stagger>
          <RowList>
            {d.level === "home"
              ? (d.data as unknown as LongHome).subjects.map((s) => <Row key={s.subject} testID={`long-subject-${s.subject}`} title={s.title} onPress={() => go(`subject=${enc(s.subject)}`)} />)
              : d.level === "subject"
                ? (d.data as unknown as LongSubject).topics.map((t) => <Row key={t.id} testID={`long-topic-${t.id}`} title={t.title} onPress={() => go(`subject=${enc(p.subject!)}&topic=${enc(t.id)}`)} />)
                : (d.data as unknown as LongTopic).items.map((l) => <Row key={l.id} testID={`long-${l.id}`} title={l.question} meta={`${l.marks} marks · ${LEVEL[l.difficulty] ?? ""}`} onPress={() => go(`subject=${enc(p.subject!)}&topic=${enc(p.topic!)}&id=${enc(l.id)}`)} />)}
          </RowList>
        </Stagger>
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

function LongQuestion({ q, subject, topic }: { q: LongQ; subject: string; topic: string }) {
  const c = useTheme();
  const reduce = useReducedMotion();
  const item = q.item;
  const [open, setOpen] = React.useState(false);
  const [ticked, setTicked] = React.useState<number[]>([]);
  const next = q.next;
  const thumb = open ? (
    next ? <Button label="Next question" onPress={() => router.replace(`/prep/long?subject=${enc(subject)}&topic=${enc(topic)}&id=${enc(next.id)}`)} testID="long-next" /> : <Button kind="quiet" label="Back to the list" onPress={() => router.back()} />
  ) : (
    <Button label="Show answer" onPress={() => setOpen(true)} testID="long-show" />
  );
  return (
    <GameFrame testID="long-question" title={`${item.marks} marks`} thumb={thumb}>
      <T v="h2">{item.question}</T>
      {item.plan.length ? (
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
      ) : null}
      {open ? (
        <Animated.View entering={reduce ? undefined : FadeInDown.duration(motion.fill)} style={{ gap: space[6] }} testID="long-answer">
          <Section title="Model answer">
            <Blocks blocks={item.blocks} ctx={{ moduleId: "prep", sectionId: item.id, view: "student" }} />
          </Section>
          <Section title="What the examiner looks for">
            <T v="small" tone="muted">
              Tick what your answer had.
            </T>
            {item.keyPoints.map((p, k) => {
              const on = ticked.includes(k);
              return (
                <Pressable key={k} accessibilityRole="checkbox" accessibilityState={{ checked: on }} accessibilityLabel={p} onPress={() => { haptic.select(); setTicked((t) => (on ? t.filter((x) => x !== k) : [...t, k])); }} style={{ flexDirection: "row", gap: space[3], minHeight: layout.target, alignItems: "center" }}>
                  <View style={{ width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: c.ink, backgroundColor: on ? c.ink : "transparent", alignItems: "center", justifyContent: "center" }}>{on ? <Check size={14} color={c.bg} strokeWidth={3} /> : null}</View>
                  <Rich text={p} style={{ flex: 1 }} />
                </Pressable>
              );
            })}
            <Bump value={ticked.length}>
              <T style={{ fontFamily: fonts.pixelDigits, fontSize: 20, lineHeight: 26, color: c.link }} accessibilityLiveRegion="polite">
                {`${ticked.length} of ${item.keyPoints.length} covered`}
              </T>
            </Bump>
          </Section>
          {item.pitfalls?.length ? (
            <Section title="Where marks are lost">
              {item.pitfalls.map((p, k) => (
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
