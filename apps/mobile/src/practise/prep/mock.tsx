import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, ArrowRight, Check, Clock, Flag, Grid3x3, History, Send, TriangleAlert } from "lucide-react-native";
import * as React from "react";
import { AppState, Pressable, View } from "react-native";
import Animated, { FadeIn, FadeInLeft, FadeInRight, useReducedMotion } from "react-native-reanimated";

import { Button, Chips, EmptyState, LoadError, Row, RowList, RowsSkeleton, Screen, Section, Sheet, T } from "@/ds";
import { haptic } from "@/lib/haptics";
import { Burst, ProgressFill } from "@/motion";
import { pathFromLink } from "@/nav/targets";
import { Rich } from "@/study/rich";
import { fonts, layout, motion, space, useTheme } from "@/theme";
import { moveError, play, useRead } from "../api";
import type { PrepMockResult, PrepMocks } from "../contract";
import { EndPanel, FrameError, FrameLoading, GameFrame, MoveError } from "../frame";
import { Stagger } from "../fx";
import { AnswerRow } from "../parts";
import { reactions } from "../reactions";
import type { MockMeta, MockPaper, MockResult, MockReviewRow, MockSpec } from "../types";
import { QuestionBody } from "./set";

/**
 * Timed mock papers, as the website's /prep/mock: a fresh paper sampled on the
 * server (prep.mockStart), the clock from the server's deadline, every
 * question one tap away in the palette, Mark for review, and hand-in
 * (prep.mockSubmit) by the student or on its own at time-up. Answers stay on
 * the phone until hand-in; the server scores the stored paper.
 */

const enc = encodeURIComponent;
const WARN_MS = 5 * 60_000;

export const marksText = (n: number) => `${Number.isInteger(n) ? n : n.toFixed(2).replace(/0$/, "")} ${Math.abs(n) === 1 ? "mark" : "marks"}`;
const clock = (ms: number) => {
  const s = Math.max(0, Math.ceil(ms / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = String(s % 60).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${ss}` : `${m}:${ss}`;
};
const asSpecs = (d: PrepMocks | undefined) => ((d?.specs ?? []) as unknown as MockSpec[]).map((s) => ({ ...s, sections: Array.isArray(s.sections) ? s.sections : [] }));

/** The facts of one pattern, in the website's words. */
function Facts({ spec }: { spec: MockSpec }) {
  const lines = [
    `${spec.minutes} minutes`,
    `${marksText(spec.marksPerRight)} for a right answer`,
    spec.marksPerWrong ? `${marksText(-spec.marksPerWrong)} off for a wrong answer; a blank gets 0` : "No negative marking: never leave one blank",
  ];
  return (
    <View style={{ gap: space[2] }}>
      {lines.map((l) => (
        <View key={l} style={{ flexDirection: "row", gap: space[3] }}>
          <T v="small" tone="muted">
            •
          </T>
          <T v="small" style={{ flex: 1 }}>
            {l}
          </T>
        </View>
      ))}
      {spec.sections.length > 1 ? (
        <T v="small" tone="muted">
          {spec.sections.map((s) => s.title).join(" · ")}
        </T>
      ) : null}
    </View>
  );
}

/* ------------------------------------------------------------------ list */

/** /prep/mock: the full paper first, the shorter sectional tests, then your past mocks. */
export function MocksScreen() {
  const c = useTheme();
  const q = useRead<PrepMocks>("/prep/mock");
  const specs = asSpecs(q.data);
  const [full, ...parts] = specs;
  const done = ((q.data?.history ?? []) as unknown as MockMeta[]).filter((h) => h.submittedAt);
  const name = (id: string) => specs.find((s) => s.id === id)?.title ?? "Mock test";
  return (
    <Screen testID="mocks" title="Mock tests" lead="Timed papers, mostly questions you have not seen." onRefresh={() => void q.refetch()} refreshing={q.isRefetching}>
      {q.isError ? (
        <LoadError error={q.error} what="the mock tests" onRetry={() => void q.refetch()} />
      ) : !q.data ? (
        <RowsSkeleton rows={5} />
      ) : !full ? (
        <EmptyState mood="sleepy" title="No mock tests yet" body="New papers are on their way." />
      ) : (
        <Stagger gap={space[6]}>
          <View style={{ gap: space[4], borderWidth: 2, borderColor: c.ink, borderRadius: layout.radius, padding: space[4], backgroundColor: c.card }}>
            <T v="caption" tone="muted">
              FULL PAPER
            </T>
            <T v="h2">{full.title}</T>
            <Facts spec={full} />
            <Button label="Open" icon={<ArrowRight size={18} color={c.onPrimary} />} onPress={() => router.push(`/prep/mock/${enc(full.id)}`)} testID={`mock-open-${full.id}`} />
          </View>
          {parts.length ? (
            <Section title="Shorter sectional tests">
              <T v="small" tone="muted">
                {`${parts[0]!.minutes} minutes each, one subject group.`}
              </T>
              <RowList>
                {parts.map((s) => (
                  <Row key={s.id} testID={`mock-open-${s.id}`} title={s.title} meta={`${s.minutes} minutes`} icon={<Clock size={20} color={c.muted} />} onPress={() => router.push(`/prep/mock/${enc(s.id)}`)} />
                ))}
              </RowList>
            </Section>
          ) : null}
          {done.length ? (
            <Section title="Your past mocks">
              <RowList>
                {done.map((h) => (
                  <Row
                    key={h.id}
                    testID={`mock-past-${h.id}`}
                    title={name(h.specId)}
                    meta={h.submittedAt ? new Date(h.submittedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : undefined}
                    icon={<History size={20} color={c.muted} />}
                    trailing={
                      <T style={{ fontFamily: fonts.pixelDigits, fontSize: 16, lineHeight: 20, color: c.ink }} num>
                        {`${h.score ?? 0}/${h.max ?? 0}`}
                      </T>
                    }
                    onPress={() => router.push(`/prep/mock/result/${enc(h.id)}`)}
                  />
                ))}
              </RowList>
            </Section>
          ) : null}
        </Stagger>
      )}
    </Screen>
  );
}

/* ------------------------------------------------------------------ exam */

type CellState = "answered" | "answered-marked" | "marked" | "not-answered" | "not-visited";
const CELL_LABEL: Record<CellState, string> = { answered: "Answered", "answered-marked": "Answered and marked", marked: "Marked for review", "not-answered": "Not answered", "not-visited": "Not visited" };
const cellState = (answered: boolean, marked: boolean, visited: boolean): CellState => (answered ? (marked ? "answered-marked" : "answered") : marked ? "marked" : visited ? "not-answered" : "not-visited");

/** One numbered square in the palette: filled when answered, a flag when marked, dashed when not yet seen. */
function Cell({ n, st, current, onPress }: { n: number; st: CellState; current: boolean; onPress: () => void }) {
  const c = useTheme();
  const filled = st === "answered" || st === "answered-marked";
  const marked = st === "marked" || st === "answered-marked";
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Question ${n}: ${CELL_LABEL[st]}${current ? ", open now" : ""}`}
      onPress={onPress}
      testID={`palette-${n}`}
      style={({ pressed }) => ({
        width: 48,
        height: 48,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: current ? 2.5 : 1.5,
        borderStyle: st === "not-visited" ? "dashed" : "solid",
        borderColor: current ? c.brand : st === "not-visited" ? c.cardLine : c.ink,
        backgroundColor: filled ? c.ink : pressed ? c.tint : "transparent",
        transform: [{ scale: pressed ? 0.94 : 1 }],
      })}
    >
      <T v="small" num style={{ fontFamily: fonts.semibold, color: filled ? c.bg : c.ink }}>
        {n}
      </T>
      {marked ? (
        <View style={{ position: "absolute", top: -6, right: -6, width: 18, height: 18, borderRadius: 9, backgroundColor: c.primary, borderWidth: 1.5, borderColor: c.ink, alignItems: "center", justifyContent: "center" }}>
          <Flag size={10} color={c.onPrimary} strokeWidth={3} />
        </View>
      ) : null}
    </Pressable>
  );
}

/** /prep/mock/:spec: intro, then the paper under the clock, then the result. */
export function MockExamScreen() {
  const { spec: specId = "" } = useLocalSearchParams<{ spec: string }>();
  const c = useTheme();
  const reduce = useReducedMotion();
  const list = useRead<PrepMocks>("/prep/mock");
  const spec = asSpecs(list.data).find((s) => s.id === specId) ?? null;

  const [paper, setPaper] = React.useState<MockPaper | null>(null);
  const [starting, setStarting] = React.useState(false);
  const [startError, setStartError] = React.useState<string | null>(null);
  const [answers, setAnswers] = React.useState<Record<string, number | null>>({});
  const [marked, setMarked] = React.useState<Record<string, boolean>>({});
  const [visited, setVisited] = React.useState<Record<string, boolean>>({});
  const [at, setAt] = React.useState(0);
  const [dir, setDir] = React.useState<1 | -1>(1);
  const [now, setNow] = React.useState(0);
  const [skew, setSkew] = React.useState(0);
  const [palette, setPalette] = React.useState(false);
  const [confirm, setConfirm] = React.useState(false);
  const [submitting, setSubmitting] = React.useState<false | "you" | "auto">(false);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<MockResult | null>(null);
  const times = React.useRef<Record<string, number>>({});
  const since = React.useRef<{ id: string; at: number } | null>(null);
  const autoFired = React.useRef(false);
  const submitRef = React.useRef<(auto: boolean) => void>(() => undefined);

  const flat = React.useMemo(() => (paper ? paper.sections.flatMap((s, si) => s.questions.map((q) => ({ q, si, title: s.title }))) : []), [paper]);

  /** Adds the time on the open question to its total (called on every move and at hand-in). */
  const stopClock = () => {
    const a = since.current;
    if (!a) return;
    const t = Date.now();
    times.current[a.id] = (times.current[a.id] ?? 0) + (t - a.at);
    since.current = { id: a.id, at: t };
  };
  const go = (i: number) => {
    if (!flat[i]) return;
    stopClock();
    haptic.select();
    setDir(i >= at ? 1 : -1);
    setAt(i);
    setVisited((v) => ({ ...v, [flat[i]!.q.id]: true }));
    since.current = { id: flat[i]!.q.id, at: Date.now() };
  };

  const start = async () => {
    if (!spec || starting) return;
    setStarting(true);
    setStartError(null);
    haptic.tap();
    try {
      const r = await play<MockPaper | { error: string }>("prep", "mockStart", spec.id);
      if ("error" in r) {
        setStartError(r.error);
        return;
      }
      const t = Date.now();
      setSkew(r.serverNow - t);
      setNow(t);
      setPaper(r);
      const first = r.sections.flatMap((s) => s.questions)[0];
      if (first) {
        setVisited({ [first.id]: true });
        since.current = { id: first.id, at: t };
      }
      reactions.dismiss();
    } catch (e) {
      setStartError(moveError(e) || "Couldn't start the mock. Check your connection and try again.");
    } finally {
      setStarting(false);
    }
  };

  const submit = async (isAuto: boolean) => {
    if (!paper || submitting) return;
    stopClock();
    setConfirm(true);
    setSubmitting(isAuto ? "auto" : "you");
    setError(null);
    try {
      const r = await play<MockResult | { error: string }>("prep", "mockSubmit", {
        specId: paper.specId,
        attemptId: paper.attemptId,
        sections: paper.sections.map((s) => ({ title: s.title, ids: s.questions.map((q) => q.id) })),
        answers,
        marked: Object.keys(marked).filter((k) => marked[k]),
        times: Object.fromEntries(Object.entries(times.current).map(([k, v]) => [k, Math.round(v)])),
      });
      if ("error" in r) {
        setError(r.error);
        return;
      }
      setConfirm(false);
      setResult(r);
    } catch {
      setError("Couldn't submit. Your answers are still here.");
    } finally {
      setSubmitting(false);
    }
  };
  React.useEffect(() => {
    submitRef.current = (isAuto: boolean) => void submit(isAuto);
  });

  // The clock: one tick a second, from the server's deadline. Coming back
  // from the background reads the time again, so it never drifts.
  const live = !!paper && !result;
  React.useEffect(() => {
    if (!live || !paper) return;
    const tick = () => {
      const t = Date.now();
      setNow(t);
      if (paper.deadline - (t + skew) <= 0 && !autoFired.current) {
        autoFired.current = true;
        haptic.warn();
        submitRef.current(true);
      }
    };
    const id = setInterval(tick, 1000);
    const sub = AppState.addEventListener("change", (s) => s === "active" && tick());
    return () => {
      clearInterval(id);
      sub.remove();
    };
  }, [live, paper, skew]);

  if (list.isError) return <FrameError title="Mock test" web="/prep/mock" error={list.error} onRetry={() => void list.refetch()} />;
  if (!list.data) return <FrameLoading title="Mock test" />;
  if (!spec) {
    return (
      <GameFrame title="Mock test">
        <EmptyState mood="puzzled" title="That mock doesn't exist" body="Go back and pick one from the list." />
      </GameFrame>
    );
  }

  if (result) {
    return (
      <GameFrame testID="mock-result" title={spec.title} thumb={<Button label="Back to the mock tests" onPress={() => router.back()} testID="mock-done" />}>
        <MockResultBody r={result} fresh />
      </GameFrame>
    );
  }

  if (!paper) {
    return (
      <GameFrame testID="mock-intro" title="" thumb={<Button label="Start the mock" busy={starting} onPress={() => void start()} testID="mock-start" />}>
        <Animated.View entering={reduce ? undefined : FadeIn.duration(motion.page)} style={{ gap: space[4], paddingTop: space[4] }}>
          <T v="display">{spec.title}</T>
          <Facts spec={spec} />
          <T v="small" tone="muted">
            The timer starts when you press Start. It submits on its own when time is up.
          </T>
          <MoveError text={startError} />
        </Animated.View>
      </GameFrame>
    );
  }

  const left = paper.deadline - (now + skew);
  const warn = left <= WARN_MS;
  const cur = flat[at];
  const counts = { answered: 0, marked: 0, notAnswered: 0, notVisited: 0 };
  for (const x of flat) {
    const st = cellState(answers[x.q.id] != null, !!marked[x.q.id], !!visited[x.q.id]);
    if (st === "answered" || st === "answered-marked") counts.answered++;
    if (st === "marked" || st === "answered-marked") counts.marked++;
    if (st === "not-answered") counts.notAnswered++;
    if (st === "not-visited") counts.notVisited++;
  }
  const q = cur?.q;
  const isMarked = q ? !!marked[q.id] : false;
  const pick = (j: number) => {
    if (!q) return;
    setAnswers((a) => ({ ...a, [q.id]: j }));
  };
  const toggleMark = () => {
    if (!q) return;
    haptic.select();
    setMarked((m) => ({ ...m, [q.id]: !m[q.id] }));
  };
  const minute = Math.ceil(left / 60000);
  const hud = (
    <View style={{ gap: space[2] }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: space[2] }}>
        <View accessible accessibilityRole="timer" accessibilityLabel={`Time left ${clock(left)}`} style={{ flexDirection: "row", alignItems: "center", gap: space[2], minHeight: 40, paddingHorizontal: space[3], borderRadius: 10, borderWidth: 2, borderColor: c.ink, backgroundColor: warn ? c.alertBg : c.card }} testID="mock-clock">
          {warn ? <TriangleAlert size={16} color={c.alertFg} /> : <Clock size={16} color={c.ink} />}
          <T style={{ fontFamily: fonts.pixelDigits, fontSize: 18, lineHeight: 22, color: warn ? c.alertFg : c.ink }} num>
            {clock(left)}
          </T>
        </View>
        <View style={{ flex: 1 }} />
        <Pressable accessibilityRole="button" accessibilityLabel="All questions" onPress={() => setPalette(true)} testID="mock-palette" style={({ pressed }) => ({ minHeight: 40, flexDirection: "row", alignItems: "center", gap: space[1], paddingHorizontal: space[3], borderRadius: 10, borderWidth: 1.5, borderColor: c.cardLine, backgroundColor: pressed ? c.tint : "transparent" })}>
          <Grid3x3 size={16} color={c.ink} />
          <T v="small" num style={{ fontFamily: fonts.semibold }}>{`${counts.answered}/${flat.length}`}</T>
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel="Submit" onPress={() => { haptic.tap(); setConfirm(true); }} testID="mock-submit-open" style={({ pressed }) => ({ minHeight: 40, flexDirection: "row", alignItems: "center", gap: space[1], paddingHorizontal: space[3], borderRadius: 10, backgroundColor: c.ink, opacity: pressed ? 0.85 : 1 })}>
          <Send size={15} color={c.bg} />
          <T v="small" style={{ fontFamily: fonts.semibold, color: c.bg }}>
            Submit
          </T>
        </Pressable>
      </View>
      <ProgressFill pct={(counts.answered / Math.max(1, flat.length)) * 100} height={3} />
      {warn && (minute === 5 || minute === 1) ? (
        <T v="small" tone="alert" accessibilityLiveRegion="polite">
          {minute === 5 ? "5 minutes left" : "1 minute left"}
        </T>
      ) : null}
    </View>
  );

  return (
    <GameFrame
      testID="mock-exam"
      title={spec.title}
      hud={hud}
      confirmLeave
      thumb={
        <View style={{ flexDirection: "row", gap: space[2] }}>
          <Button kind="quiet" full={false} label="Back" icon={<ArrowLeft size={18} color={c.ink} />} disabled={at === 0} onPress={() => go(at - 1)} testID="mock-back" />
          <Button kind="quiet" full={false} label={isMarked ? "Marked" : "Mark"} icon={<Flag size={16} color={c.ink} fill={isMarked ? c.primary : "transparent"} />} onPress={toggleMark} testID="mock-mark" />
          <View style={{ flex: 1 }}>
            <Button label={at + 1 >= flat.length ? "Review" : "Next"} onPress={() => (at + 1 >= flat.length ? setPalette(true) : go(at + 1))} testID="mock-next" />
          </View>
        </View>
      }
    >
      {q && cur ? (
        <Animated.View key={q.id} entering={reduce ? undefined : (dir > 0 ? FadeInRight : FadeInLeft).duration(motion.state)} style={{ gap: space[4] }}>
          <T v="caption" tone="muted" num>
            {`${paper.sections.length > 1 ? `${cur.title.toUpperCase()} · ` : ""}QUESTION ${at + 1} OF ${flat.length}`}
          </T>
          <QuestionBody q={q} />
          <View style={{ gap: space[3] }} accessibilityRole="radiogroup">
            {q.options.map((o, j) => (
              <AnswerRow key={j} index={j} text={o} testID={`mock-option-${j}`} state={answers[q.id] === j ? "picked" : "idle"} onPress={() => pick(j)} />
            ))}
          </View>
          {answers[q.id] != null ? (
            <Button kind="text" label="Clear my answer" onPress={() => { haptic.select(); setAnswers((a) => ({ ...a, [q.id]: null })); }} testID="mock-clear" />
          ) : null}
        </Animated.View>
      ) : null}

      <Sheet open={palette} onClose={() => setPalette(false)} title="All questions" testID="mock-palette-sheet">
        <View style={{ gap: space[4] }}>
          {paper.sections.map((s, si) => {
            const offset = paper.sections.slice(0, si).reduce((a, x) => a + x.questions.length, 0);
            return (
              <View key={`${s.title}-${si}`} style={{ gap: space[2] }}>
                {paper.sections.length > 1 ? (
                  <T v="caption" tone="muted">
                    {s.title.toUpperCase()}
                  </T>
                ) : null}
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space[2] }}>
                  {s.questions.map((x, k) => (
                    <Cell
                      key={x.id}
                      n={offset + k + 1}
                      current={offset + k === at}
                      st={cellState(answers[x.id] != null, !!marked[x.id], !!visited[x.id])}
                      onPress={() => {
                        setPalette(false);
                        go(offset + k);
                      }}
                    />
                  ))}
                </View>
              </View>
            );
          })}
          <View style={{ flexDirection: "row", flexWrap: "wrap", columnGap: space[4], rowGap: space[1] }}>
            {[
              ["Answered", counts.answered],
              ["Marked", counts.marked],
              ["Not answered", counts.notAnswered],
              ["Not visited", counts.notVisited],
            ].map(([l, n]) => (
              <T key={String(l)} v="small" tone="muted" num>{`${l}: ${n}`}</T>
            ))}
          </View>
          <Button label="Submit the paper" kind="quiet" onPress={() => { setPalette(false); setConfirm(true); }} testID="mock-palette-submit" />
        </View>
      </Sheet>

      <Sheet open={confirm} onClose={() => !submitting && setConfirm(false)} title={submitting ? (submitting === "auto" ? "Time's up. Submitting..." : "Submitting...") : "Submit your paper?"} testID="mock-confirm">
        <View style={{ gap: space[3] }}>
          <View style={{ flexDirection: "row", gap: space[5] }}>
            {[
              ["Answered", counts.answered],
              ["Not answered", counts.notAnswered + counts.notVisited],
              ["Marked", counts.marked],
            ].map(([l, n]) => (
              <View key={String(l)} accessible accessibilityLabel={`${l}: ${n}`}>
                <T v="score" num>
                  {String(n)}
                </T>
                <T v="caption" tone="muted">
                  {l}
                </T>
              </View>
            ))}
          </View>
          {!submitting && left > 0 ? (
            <T v="small" tone="muted">
              The clock keeps running.
            </T>
          ) : null}
          <MoveError text={error} />
          <Button label={error ? "Try again" : "Submit now"} icon={<Send size={18} color={c.onPrimary} />} busy={!!submitting} onPress={() => void submit(left <= 0)} testID="mock-submit" />
          {!submitting && left > 0 ? <Button kind="text" label="Keep going" onPress={() => setConfirm(false)} testID="mock-keep" /> : null}
        </View>
      </Sheet>
    </GameFrame>
  );
}

/* ---------------------------------------------------------------- result */

type Filter = "all" | "wrong" | "blank" | "marked";

/** The result and the full review, the same for a fresh hand-in and a saved mock. */
export function MockResultBody({ r, fresh }: { r: MockResult; fresh?: boolean }) {
  const [filter, setFilter] = React.useState<Filter>("all");
  const [open, setOpen] = React.useState<number | null>(null);
  const [burst, setBurst] = React.useState(0);
  const pct = r.max ? Math.max(0, r.score) / r.max : 0;
  React.useEffect(() => {
    if (!fresh || pct < 0.6) return;
    const id = setTimeout(() => setBurst(1), 400);
    return () => clearTimeout(id);
  }, [fresh, pct]);
  const rows = r.rows.map((row, i) => ({ row, i })).filter(({ row }) => (filter === "wrong" ? row.chosen !== null && !row.correct : filter === "blank" ? row.chosen === null : filter === "marked" ? row.marked : true));
  const standing = !r.saved ? "This attempt wasn't saved, so it has no rank." : r.standing && r.standing.of > 1 ? `#${r.standing.rank} of ${r.standing.of}${r.standing.percentile !== null ? `, ahead of ${r.standing.percentile}%` : ""}` : "You're the first VIBHA student to finish this mock. Your rank appears as others take it.";
  const perQ = r.rows.length ? Math.round(r.totalMs / 1000 / r.rows.length) : 0;
  const shown = open !== null ? r.rows[open] : null;
  return (
    <View style={{ gap: space[6] }}>
      <View>
        <EndPanel kicker="Your score" score={String(r.score)} scoreOf={`/ ${r.max}`} right={r.right} total={Math.max(1, r.right + r.wrong + r.blank)} outcome={fresh ? (pct >= 0.6 ? "won" : pct >= 0.35 ? "mixed" : "lost") : undefined} line={r.late ? "Handed in after the time was up." : undefined} stats={[{ label: "Right", value: String(r.right) }, { label: "Wrong", value: String(r.wrong) }, { label: "Blank", value: String(r.blank) }, ...(r.accuracy !== null ? [{ label: "Accuracy", value: `${Math.round(r.accuracy * 100)}%` }] : [])]}>
          <View style={{ gap: space[1] }}>
            <T v="caption" tone="muted">
              AMONG VIBHA STUDENTS
            </T>
            <T v="bodyStrong" testID="mock-standing">
              {standing}
            </T>
            {r.totalMs ? (
              <T v="small" tone="muted" num>
                {`Time used ${clock(r.totalMs)}${perQ ? `, about ${perQ} s a question` : ""}`}
              </T>
            ) : null}
          </View>
        </EndPanel>
        <View pointerEvents="none" style={{ position: "absolute", left: 40, top: 70 }}>
          <Burst fire={burst} reach={48} />
        </View>
      </View>

      {r.sections.length > 1 ? (
        <Section title="By section">
          <View style={{ gap: space[3] }}>
            {r.sections.map((s) => (
              <View key={s.title} style={{ gap: space[1] }} accessible accessibilityLabel={`${s.title}: ${s.score} of ${s.max}`}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", gap: space[3] }}>
                  <T v="bodyStrong" style={{ flex: 1 }}>
                    {s.title}
                  </T>
                  <T v="small" num>{`${s.score}/${s.max}`}</T>
                </View>
                <ProgressFill pct={s.max ? (Math.max(0, s.score) / s.max) * 100 : 0} height={4} />
                <T v="caption" tone="muted" num>{`${s.right} right · ${s.wrong} wrong · ${s.blank} blank`}</T>
              </View>
            ))}
          </View>
        </Section>
      ) : null}

      {r.subjects.length ? (
        <Section title="By subject">
          <RowList>
            {r.subjects.map((s) => (
              <Row key={s.subject} title={s.title} meta={`${s.right} right · ${s.wrong} wrong · ${s.blank} blank`} trailing={<T v="small" num>{`${s.score}/${s.max}`}</T>} onPress={s.learnHref ? () => router.push(pathFromLink(s.learnHref) as never) : undefined} testID={`mock-subject-${s.subject}`} />
            ))}
          </RowList>
        </Section>
      ) : null}

      <Section title="Every question">
        <Chips
          scroll
          label="Show"
          value={filter}
          onChange={setFilter}
          options={[
            { id: "all", name: `All ${r.rows.length}` },
            { id: "wrong", name: `Wrong ${r.wrong}` },
            { id: "blank", name: `Blank ${r.blank}` },
            { id: "marked", name: `Marked ${r.rows.filter((x) => x.marked).length}` },
          ]}
        />
        {rows.length ? (
          <RowList still>
            {rows.map(({ row, i }) => (
              <ReviewLine key={row.q.id} n={i + 1} row={row} onPress={() => setOpen(i)} />
            ))}
          </RowList>
        ) : (
          <T tone="muted">Nothing here.</T>
        )}
      </Section>

      <Sheet open={shown !== null} onClose={() => setOpen(null)} title={open !== null ? `Question ${open + 1}` : undefined} testID="mock-review-sheet">
        {shown ? <ReviewQuestion row={shown} /> : null}
        {open !== null ? (
          <View style={{ flexDirection: "row", gap: space[2], marginTop: space[4] }}>
            <Button kind="quiet" full={false} label="Previous" disabled={open === 0} onPress={() => setOpen(open - 1)} />
            <View style={{ flex: 1 }}>
              <Button kind="quiet" label="Next" disabled={open + 1 >= r.rows.length} onPress={() => setOpen(open + 1)} testID="mock-review-next" />
            </View>
          </View>
        ) : null}
      </Sheet>
    </View>
  );
}

function ReviewLine({ n, row, onPress }: { n: number; row: MockReviewRow; onPress: () => void }) {
  const c = useTheme();
  const word = row.chosen === null ? "Blank" : row.correct ? "Right" : "Wrong";
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`Question ${n}, ${word}${row.marked ? ", marked" : ""}`} onPress={onPress} testID={`mock-review-${n}`} style={({ pressed }) => ({ minHeight: layout.row, flexDirection: "row", alignItems: "center", gap: space[3], paddingVertical: space[3], backgroundColor: pressed ? c.tint : "transparent" })}>
      <View style={{ width: 32, height: 32, borderRadius: 8, alignItems: "center", justifyContent: "center", backgroundColor: row.chosen === null ? c.tint : row.correct ? c.successBg : c.alertBg }}>
        {row.chosen === null ? (
          <T v="caption" num>
            {n}
          </T>
        ) : row.correct ? (
          <Check size={16} color={c.successFg} strokeWidth={3} />
        ) : (
          <T v="caption" style={{ color: c.alertFg }} num>
            {n}
          </T>
        )}
      </View>
      <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
        <Rich text={row.q.stem.split("\n")[0] ?? ""} v="small" numberOfLines={2} />
        <T v="caption" tone="muted">
          {`${word}${row.marked ? " · Marked" : ""}${row.ms ? ` · ${Math.round(row.ms / 1000)} s` : ""}`}
        </T>
      </View>
      {row.marked ? <Flag size={14} color={c.muted} /> : null}
    </Pressable>
  );
}

function ReviewQuestion({ row }: { row: MockReviewRow }) {
  return (
    <View style={{ gap: space[4] }}>
      <QuestionBody q={row.q} />
      <View style={{ gap: space[2] }}>
        {row.q.options.map((o, j) => (
          <AnswerRow key={j} index={j} text={o} disabled state={j === row.answer ? "right" : j === row.chosen ? "wrong" : "dim"} />
        ))}
      </View>
      {row.chosen === null ? <T v="small" tone="muted">You left this one blank.</T> : null}
      <View style={{ gap: space[1] }}>
        <T v="caption" tone="muted">
          WHY
        </T>
        <Rich text={row.explanation} v="reading" />
      </View>
      {row.learnHref ? <Button kind="text" label="Learn this" onPress={() => router.push(pathFromLink(row.learnHref) as never)} /> : null}
    </View>
  );
}

/** /prep/mock/result/:id: a saved mock's result and review. Your own attempts only. */
export function MockResultScreen() {
  const { id = "" } = useLocalSearchParams<{ id: string }>();
  const q = useRead<PrepMockResult>(`/prep/mock/result/${enc(id)}`);
  const d = q.data;
  return (
    <Screen testID="mock-saved" title={d?.title ?? "Mock results"} onRefresh={() => void q.refetch()} refreshing={q.isRefetching}>
      {q.isError ? (
        <LoadError error={q.error} what="this mock" onRetry={() => void q.refetch()} />
      ) : !d ? (
        <RowsSkeleton rows={6} />
      ) : d.result ? (
        <MockResultBody r={d.result as unknown as MockResult} />
      ) : (
        <EmptyState mood="sleepy" title="This mock wasn't submitted" body="Start a fresh one from the mocks page." action={{ label: "Mock tests", onPress: () => router.replace("/prep/mock") }} />
      )}
    </Screen>
  );
}

