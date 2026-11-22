import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import * as React from "react";
import { Bookmark } from "lucide-react-native";
import { View } from "react-native";

import { Label, QuietEmpty, Stone, T } from "@/ds";
import { Press, Swap } from "@/motion";
import { Rich } from "@/study/rich";
import { layout, space, useTheme } from "@/theme";
import { haptic } from "@/lib/haptics";
import { dropPrepSet, play, prefetchPrepSet, prepSetPath, prepSetQuery, useMove, type PrepSetParams } from "../api";
import type { PrepSet } from "../contract";
import { EndPanel, EndThumb, FrameError, FrameLoading, GameFrame, HudLine, MoveError, StepStrip } from "../frame";
import { Story } from "../parts";
import { stepFromPick } from "../player/adapt";
import { useStepPlay } from "../player/step";
import type { StepKey } from "../player/types";
import { useReactions } from "../reactions";
import type { PrepChecked, PrepQView } from "../types";

const HOW = ["One question at a time. Choose your answer, then press **Check**.", "The why comes after each answer. Questions you miss come back first next time."];
const ROMAN = ["I", "II", "III", "IV", "V", "VI"];

/** The question body: passage, statements, two lists, then the stem. */
export function QuestionBody({ q, bare }: { q: PrepQView; /** Leave the stem out (the player draws it as the question). */ bare?: boolean }) {
  const c = useTheme();
  return (
    <View style={{ gap: space[4] }}>
      {q.passage ? (
        <Story kicker="Read this">
          <Rich text={q.passage} v="reading" />
        </Story>
      ) : null}
      {bare ? null : <Rich text={q.stem} v="h3" />}
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
        <View style={{ flexDirection: "row", gap: space[3], backgroundColor: c.card, borderRadius: layout.radius, padding: space[4] }}>
          {(["left", "right"] as const).map((side) => (
            <View key={side} style={{ flex: 1, gap: space[2] }}>
              <T v="label" tone="muted">
                {side === "left" ? "List I" : "List II"}
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
  const p = useLocalSearchParams<PrepSetParams>();
  const path = prepSetPath(p);
  // A new address is a new round: every count starts again.
  return <PrepSetRun key={path} p={p} path={path} />;
}

function PrepSetRun({ p, path }: { p: PrepSetParams; path: string }) {
  const mv = useMove();
  const react = useReactions();
  const [i, setI] = React.useState(0);
  const [marks, setMarks] = React.useState<("ok" | "miss" | null)[]>([]);
  const [missed, setMissed] = React.useState<{ q: PrepQView; r: PrepChecked }[]>([]);
  const started = React.useRef(0);
  const enc = encodeURIComponent;
  // The set may already be here: loaded ahead on the tap, on the Practise tab, or during the set before.
  const q0 = useQuery(prepSetQuery(path));
  const set = q0.data ?? null;
  const answered = React.useRef(false);
  // A set that was played is forgotten on leaving, so coming back asks the server for where you are now.
  React.useEffect(() => () => void (answered.current && dropPrepSet(path)), [path]);
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
  const nextSet = set?.sets.find((x) => x.n === set.set + 1);
  const nearEnd = !!set && set.questions.length > 0 && i >= set.questions.length - 2;
  const nextPath = !p.list && nextSet ? prepSetPath({ subject: p.subject, topic: p.topic, set: String(nextSet.n) }) : null;
  // Two questions from the end, the next set starts loading, so "Next set" opens at once.
  React.useEffect(() => {
    if (nearEnd && nextPath) prefetchPrepSet(nextPath);
  }, [nearEnd, nextPath]);
  if (q0.error && !set) return <FrameError title="Exam Prep" web="/prep" error={q0.error} onRetry={() => void q0.refetch()} />;
  if (!set) return <FrameLoading title="Exam Prep" />;

  const q = set.questions[i] as PrepQView | undefined;
  const again = () => {
    // A list (Smart, Saved, Wrong) is picked again from what you have just answered.
    if (p.list) {
      // Dropped here, before the new screen asks: closing this one must not drop the new one's set.
      dropPrepSet(path);
      answered.current = false;
      router.replace(`/prep/set?list=${p.list}`);
    }
    else if (nextSet) router.replace(`/prep/set?subject=${enc(p.subject ?? "")}&topic=${enc(p.topic ?? "")}&set=${nextSet.n}`);
    else router.back();
  };
  if (!set.questions.length) {
    return (
      <GameFrame testID="prep-set" title={set.title}>
        <QuietEmpty title={p.list === "wrong" ? "Nothing to practise again" : p.list === "saved" ? "No saved questions" : "No questions here yet"} body={p.list ? "Questions show up here as you answer and save them." : "Try another topic."} />
      </GameFrame>
    );
  }
  if (!q) {
    const right = marks.filter((m) => m === "ok").length;
    return (
      <GameFrame testID="prep-set" title={set.title} thumb={<EndThumb again={again} againLabel={p.list ? "Another set" : nextSet ? "Next set" : "Back to the topics"} extra={p.list || !nextSet ? undefined : { label: "Topics", onPress: () => router.back() }} />}>
        <EndPanel kicker="Set done" score={`${right}`} scoreOf={`of ${set.questions.length}`} right={right} total={set.questions.length} line={right === set.questions.length ? "Every one right." : "The ones you missed come back first next time."}>
          {missed.length ? (
            <View style={{ gap: space[2] }}>
              <Label>Look again</Label>
              {missed.map(({ q: m, r }) => (
                <Stone key={m.id} style={{ gap: space[1] }}>
                  <Rich text={m.stem} v="small" tone="muted" />
                  <T v="bodyStrong">{m.options[r.answer]}</T>
                  <Rich text={r.explanation} v="small" />
                </Stone>
              ))}
            </View>
          ) : null}
        </EndPanel>
      </GameFrame>
    );
  }

  return (
    <PrepQuestion
      key={set.id}
      set={set}
      q={q}
      i={i}
      marks={marks}
      saved={savedIds.includes(q.id)}
      onSave={(want) => setSaved(want ? [...savedIds, q.id] : savedIds.filter((x) => x !== q.id))}
      onChecked={(r) => {
        answered.current = true;
        setMarks((m) => [...m, r.correct ? "ok" : "miss"]);
        if (!r.correct) setMissed((x) => [...x, { q, r }]);
        react.answer(r.correct);
      }}
      onNext={() => setI(i + 1)}
      error={mv.error}
      run={mv.run}
      started={started}
    />
  );
}

/** One question of a set, in the shared player: choose, Check (the server grades it), the verdict, then the why. */
function PrepQuestion({ set, q, i, marks, saved, onSave, onChecked, onNext, error, run, started }: { set: PrepSet; q: PrepQView; i: number; marks: ("ok" | "miss" | null)[]; saved: boolean; onSave: (want: boolean) => void; onChecked: (r: PrepChecked) => void; onNext: () => void; error: string | null; run: <T>(fn: () => Promise<T>) => Promise<T | null>; started: React.RefObject<number> }) {
  const c = useTheme();
  const last = i + 1 >= set.questions.length;
  const toggleSave = async () => {
    const want = !saved;
    onSave(want);
    haptic.select();
    const r = await play<{ ok: boolean }>("prep", "save", { id: q.id, saved: want }).catch(() => ({ ok: false }));
    if (!r.ok) onSave(!want);
  };
  const player = useStepPlay({
    step: stepFromPick(q.id, q.stem, q.options),
    resetKey: q.id,
    ids: { option: "prep-option", next: "prep-next" },
    seed: i,
    retry: false,
    nextLabel: last ? "Finish the set" : "Next question",
    onNext,
    check: async (chosen) => {
      const j = Number(chosen[0]);
      const r = await run(() => play<PrepChecked>("prep", "check", { id: q.id, choice: j, ms: Date.now() - started.current }));
      if (!r) return null;
      onChecked(r);
      const options: StepKey["options"] = {};
      q.options.forEach((_, k) => (options[String(k)] = { grade: k === r.answer ? "best" : "poor" }));
      return { options, explanation: { whyCorrect: r.explanation } };
    },
  });
  const hud = (
    <View style={{ gap: space[2] }}>
      <StepStrip at={i} total={set.questions.length} marks={marks} />
      <HudLine
        left={`Question ${i + 1} of ${set.questions.length}`}
        right={
          set.canSave ? (
            <Press accessibilityRole="button" accessibilityLabel={saved ? "Saved. Tap to unsave" : "Save this question"} accessibilityState={{ selected: saved }} onPress={() => void toggleSave()} hitSlop={12} scale={0.85} squish testID="prep-save">
              <Bookmark size={20} color={c.onField} fill={saved ? c.onField : "transparent"} />
            </Press>
          ) : undefined
        }
      />
    </View>
  );
  return (
    <GameFrame testID="prep-set" title={set.title} howTo={HOW} score={`${marks.filter((m) => m === "ok").length}`} hud={hud} confirmLeave={i > 0} thumb={player.thumb} over={player.over}>
      <Swap k={q.id} style={{ gap: space[4] }}>
        <QuestionBody q={q} bare />
        {player.body}
        <MoveError text={error} />
      </Swap>
    </GameFrame>
  );
}
