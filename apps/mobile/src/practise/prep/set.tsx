import { router, useLocalSearchParams } from "expo-router";
import * as React from "react";
import { Bookmark } from "lucide-react-native";
import { Pressable, View } from "react-native";

import { Button, EmptyState, RowList, Section, T } from "@/ds";
import { Swap } from "@/motion";
import { Rich } from "@/study/rich";
import { space, useTheme } from "@/theme";
import { api } from "@/auth";
import { haptic } from "@/lib/haptics";
import { play, useLoad, useMove } from "../api";
import type { PrepSet } from "../contract";
import { EndPanel, EndThumb, FrameError, FrameLoading, GameFrame, HudLine, MoveError, StepStrip, Verdict } from "../frame";
import { Story, AnswerRow } from "../parts";
import { useReactions } from "../reactions";
import type { PrepChecked, PrepQView } from "../types";

const HOW = ["One question at a time. Tap your answer to check it.", "The why comes after each answer. Questions you miss come back first next time."];
const ROMAN = ["I", "II", "III", "IV", "V", "VI"];

/** The question body: passage, statements, two lists, then the stem. */
export function QuestionBody({ q }: { q: PrepQView }) {
  const c = useTheme();
  return (
    <View style={{ gap: space[4] }}>
      {q.passage ? (
        <Story kicker="Read this">
          <Rich text={q.passage} v="reading" />
        </Story>
      ) : null}
      <Rich text={q.stem} v="h3" />
      {q.statements?.length ? (
        <View style={{ gap: space[2] }}>
          {q.statements.map((s, k) => (
            <View key={k} style={{ flexDirection: "row", gap: space[3] }}>
              <T v="bodyStrong" style={{ width: 28 }}>
                {ROMAN[k] ?? k + 1}.
              </T>
              <Rich text={s} style={{ flex: 1 }} />
            </View>
          ))}
        </View>
      ) : null}
      {q.lists ? (
        <View style={{ flexDirection: "row", gap: space[3], borderTopWidth: 1, borderBottomWidth: 1, borderColor: c.hairline, paddingVertical: space[3] }}>
          {(["left", "right"] as const).map((side) => (
            <View key={side} style={{ flex: 1, gap: space[2] }}>
              <T v="caption" tone="muted">
                {side === "left" ? "LIST I" : "LIST II"}
              </T>
              {q.lists![side].map((x, k) => (
                <T key={k} v="small">
                  {side === "left" ? String.fromCharCode(65 + k) : ROMAN[k]}. {x}
                </T>
              ))}
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

/** One Exam Prep set: a question per screen, checked on the server (prep.check). */
export function PrepSetScreen() {
  const p = useLocalSearchParams<{ subject?: string; topic?: string; set?: string; list?: string }>();
  const c = useTheme();
  const mv = useMove();
  const react = useReactions();
  const [i, setI] = React.useState(0);
  const [pick, setPick] = React.useState<number | null>(null);
  const [res, setRes] = React.useState<PrepChecked | null>(null);
  const [marks, setMarks] = React.useState<("ok" | "miss" | null)[]>([]);
  const [missed, setMissed] = React.useState<{ q: PrepQView; r: PrepChecked }[]>([]);
  const started = React.useRef(0);
  const enc = encodeURIComponent;
  const path = p.list === "smart" ? "/prep/smart" : p.list === "saved" || p.list === "wrong" ? `/prep/lists/${p.list}` : `/prep/subjects/${enc(p.subject ?? "")}/topics/${enc(p.topic ?? "")}${p.set ? `?set=${enc(p.set)}` : ""}`;
  const q0 = useLoad(() => api.get<PrepSet>(path), path);
  const set = q0.data;
  const [saved, setSaved] = React.useState<string[] | null>(null);
  const savedIds = saved ?? set?.saved ?? [];
  const [begun, setBegun] = React.useState(false);
  if (set && !begun) {
    setBegun(true);
    if (set.start > 0 && set.start < set.questions.length) {
      setI(set.start);
      setMarks(set.questions.slice(0, set.start).map((x) => (set.prior[x.id] === true ? "ok" : set.prior[x.id] === false ? "miss" : null)));
    }
  }
  React.useEffect(() => {
    started.current = Date.now();
  }, [set, i]);
  if (q0.error) return <FrameError title="Exam Prep" error={q0.error} onRetry={q0.retry} />;
  if (!set) return <FrameLoading title="Exam Prep" />;

  const q = set.questions[i] as PrepQView | undefined;
  const nextSet = set.sets.find((x) => x.n === set.set + 1);
  const again = () => {
    if (p.list) router.replace(`/prep/set?list=${p.list}`);
    else if (nextSet) router.replace(`/prep/set?subject=${enc(p.subject ?? "")}&topic=${enc(p.topic ?? "")}&set=${nextSet.n}`);
    else router.back();
  };
  if (!set.questions.length) {
    return (
      <GameFrame testID="prep-set" title={set.title}>
        <EmptyState mood="sleepy" title={p.list === "wrong" ? "Nothing to practise again" : p.list === "saved" ? "No saved questions" : "No questions here yet"} body={p.list ? "Questions show up here as you answer and save them." : "Try another topic."} />
      </GameFrame>
    );
  }
  if (!q) {
    const right = marks.filter((m) => m === "ok").length;
    return (
      <GameFrame testID="prep-set" title={set.title} thumb={<EndThumb again={again} againLabel={p.list ? "Another set" : nextSet ? "Next set" : "Back to the topics"} extra={p.list || !nextSet ? undefined : { label: "Topics", onPress: () => router.back() }} />}>
        <EndPanel kicker="Set done" score={`${right}`} scoreOf={`of ${set.questions.length}`} right={right} total={set.questions.length} line={right === set.questions.length ? "Every one right." : "The ones you missed come back first next time."}>
          {missed.length ? (
            <Section title="Look again">
              <RowList>
                {missed.map(({ q: m, r }) => (
                  <View key={m.id} style={{ paddingVertical: space[3], gap: space[1] }}>
                    <Rich text={m.stem} v="small" tone="muted" />
                    <T v="bodyStrong">{m.options[r.answer]}</T>
                    <Rich text={r.explanation} v="small" />
                  </View>
                ))}
              </RowList>
            </Section>
          ) : null}
        </EndPanel>
      </GameFrame>
    );
  }

  const isSaved = savedIds.includes(q.id);
  const toggleSave = async () => {
    const want = !isSaved;
    setSaved(want ? [...savedIds, q.id] : savedIds.filter((x) => x !== q.id));
    haptic.select();
    const r = await play<{ ok: boolean }>("prep", "save", { id: q.id, saved: want }).catch(() => ({ ok: false }));
    if (!r.ok) setSaved(savedIds);
  };
  const choose = async (j: number) => {
    if (res || mv.pending) return;
    setPick(j);
    const r = await mv.run(() => play<PrepChecked>("prep", "check", { id: q.id, choice: j, ms: Date.now() - started.current }));
    if (!r) {
      setPick(null);
      return;
    }
    setRes(r);
    setMarks((m) => [...m, r.correct ? "ok" : "miss"]);
    if (!r.correct) setMissed((x) => [...x, { q, r }]);
    react.answer(r.correct);
  };
  const next = () => {
    setI(i + 1);
    setPick(null);
    setRes(null);
  };
  const hud = (
    <View style={{ gap: space[2] }}>
      <StepStrip at={i} total={set.questions.length} marks={marks} />
      <HudLine
        left={`Question ${i + 1} of ${set.questions.length}`}
        right={
          set.canSave ? (
            <Pressable accessibilityRole="button" accessibilityLabel={isSaved ? "Saved. Tap to unsave" : "Save this question"} accessibilityState={{ selected: isSaved }} onPress={() => void toggleSave()} hitSlop={10} testID="prep-save">
              <Bookmark size={20} color={c.ink} fill={isSaved ? c.ink : "transparent"} />
            </Pressable>
          ) : undefined
        }
      />
    </View>
  );
  return (
    <GameFrame testID="prep-set" title={set.title} howTo={HOW} score={`${marks.filter((m) => m === "ok").length}`} hud={hud} confirmLeave={i > 0} thumb={res ? <Button label={i + 1 >= set.questions.length ? "Finish the set" : "Next question"} onPress={next} testID="prep-next" /> : undefined}>
      <Swap k={q.id} style={{ gap: space[4] }}>
        <QuestionBody q={q} />
        <View style={{ gap: space[3] }}>
          {q.options.map((o, j) => (
            <AnswerRow key={j} index={j} text={o} testID={`prep-option-${j}`} disabled={!!res || mv.pending} state={!res ? (pick === j ? "picked" : "idle") : j === res.answer ? "right" : j === pick ? "wrong" : "dim"} onPress={() => void choose(j)} />
          ))}
        </View>
        <MoveError text={mv.error} />
        {res ? <Verdict right={res.correct} why={res.explanation} seed={i} /> : null}
      </Swap>
    </GameFrame>
  );
}
