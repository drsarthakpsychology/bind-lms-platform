import { useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowRight, X } from "lucide-react-native";
import * as React from "react";
import { BackHandler, Pressable, ScrollView, View } from "react-native";
import Animated, { FadeIn, useReducedMotion } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { CheckpointResult, LearnStateResult, ModuleTestResult, QuestionReview, TestQuestion } from "@/api/contract";
import { messageOf } from "@/api/errors";
import { keys, useCheckpoint, useSection, useModule } from "@/api/queries";
import { api } from "@/auth";
import { Button, LoadError, OptionRow, ProgressLine, Sheet, Skeleton, T, VerdictBand } from "@/ds";
import { toast } from "@/ds/toast";
import { haptic } from "@/lib/haptics";
import { Rich } from "@/study/rich";
import { Burst, Confetti, RollingNumber } from "@/motion";
import { fonts, layout, motion, space, useTheme } from "@/theme";

/**
 * Checkpoints and module tests: one question per screen, options as large
 * rows, the action pinned low. The server grades (answers are never sent to
 * the phone); the result shows the score, a verdict band and a review of
 * every question with why.
 */

type Result = { right: number; total: number; review: QuestionReview[]; best?: number };

export function QuizRunner({ title, questions, submit, onDone, doneLabel }: { title: string; questions: TestQuestion[]; submit: (picks: Record<string, number>) => Promise<Result>; onDone: () => void; doneLabel: string }) {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const reduce = useReducedMotion();
  const [i, setI] = React.useState(0);
  const [picks, setPicks] = React.useState<Record<string, number>>({});
  const [result, setResult] = React.useState<Result | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [leave, setLeave] = React.useState(false);
  const [open, setOpen] = React.useState<string | null>(null);
  const scroll = React.useRef<React.ComponentRef<typeof ScrollView>>(null);
  const q = questions[i];
  const picked = q ? picks[q.key] : undefined;
  const dirty = Object.keys(picks).length > 0 && !result;

  const exit = React.useCallback(() => {
    if (dirty) setLeave(true);
    else if (router.canGoBack()) router.back();
    else onDone();
  }, [dirty, onDone]);

  React.useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      exit();
      return true;
    });
    return () => sub.remove();
  }, [exit]);

  const next = async () => {
    if (!q || picked === undefined) return;
    if (i < questions.length - 1) {
      setI(i + 1);
      scroll.current?.scrollTo({ y: 0, animated: false });
      return;
    }
    setBusy(true);
    try {
      const r = await submit(picks);
      if (r.right === r.total) haptic.success();
      setResult(r);
      scroll.current?.scrollTo({ y: 0, animated: false });
    } catch (e) {
      haptic.warn();
      toast.show(messageOf(e));
    } finally {
      setBusy(false);
    }
  };

  const closeLeave = React.useCallback(() => setLeave(false), []);

  return (
    <View testID="quiz" style={{ flex: 1, backgroundColor: c.bg, paddingTop: insets.top }}>
      <View style={{ minHeight: 56, flexDirection: "row", alignItems: "center", gap: space[2], paddingHorizontal: space[1] }}>
        <Pressable accessibilityRole="button" accessibilityLabel={result ? "Close" : "Leave the test"} onPress={result ? onDone : exit} style={{ width: layout.target, height: layout.target, alignItems: "center", justifyContent: "center" }} testID="quiz-close">
          <X size={24} color={c.ink} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <ProgressLine value={result ? 100 : ((i + (picked !== undefined ? 1 : 0)) / Math.max(1, questions.length)) * 100} height={6} label={`Question ${i + 1} of ${questions.length}`} />
        </View>
        <T v="small" tone="muted" num style={{ minWidth: 56, textAlign: "right", paddingRight: space[3] }}>
          {result ? "Done" : `${i + 1} of ${questions.length}`}
        </T>
      </View>
      <ScrollView ref={scroll} contentContainerStyle={{ padding: layout.gutter, gap: space[5], width: "100%", maxWidth: layout.readingWidth + layout.gutter * 2, alignSelf: "center" }}>
        {result ? (
          <Animated.View entering={reduce ? undefined : FadeIn.duration(motion.page)} style={{ gap: space[5] }} testID="quiz-result">
            <T v="small" tone="muted">
              {title}
            </T>
            <View style={{ flexDirection: "row", alignItems: "baseline", gap: space[3] }}>
              <View accessible accessibilityLabel={`${result.right} of ${result.total} right`} style={{ flexDirection: "row", alignItems: "baseline" }}>
                <RollingNumber value={result.right} style={{ fontFamily: fonts.pixelDigits, fontSize: 56, lineHeight: 64 }} />
                <T style={{ fontFamily: fonts.pixelDigits, fontSize: 56, lineHeight: 64 }} num maxFontSizeMultiplier={1.2}>
                  /{result.total}
                </T>
                <Burst fire={result.right === result.total ? 1 : 0} reach={56} />
              </View>
              {result.best !== undefined ? (
                <T v="small" tone="muted" num>
                  Best {result.best}
                </T>
              ) : null}
            </View>
            <VerdictBand right={result.right / Math.max(1, result.total) >= 0.7} title={result.right === result.total ? "Every one right." : result.right / Math.max(1, result.total) >= 0.7 ? "A good result." : "Worth another read."} why={result.right === result.total ? null : "Open each question below to see the right answer and why."} />
            <View>
              {questions.map((qq, n) => {
                const r = result.review.find((x) => x.key === qq.key);
                const isOpen = open === qq.key;
                return (
                  <View key={qq.key} style={{ borderTopWidth: 1, borderColor: c.hairline }}>
                    <Pressable accessibilityRole="button" accessibilityState={{ expanded: isOpen }} onPress={() => setOpen(isOpen ? null : qq.key)} style={{ minHeight: layout.row, flexDirection: "row", alignItems: "center", gap: space[3], paddingVertical: space[3] }}>
                      <T v="bodyStrong" tone={r?.correct ? "ink" : "danger"} style={{ width: 24 }}>
                        {r?.correct ? "✓" : "✗"}
                      </T>
                      <Rich text={`${n + 1}. ${qq.q}`} style={{ flex: 1 }} />
                    </Pressable>
                    {isOpen && r ? (
                      <View style={{ gap: space[2], paddingBottom: space[4] }}>
                        {qq.options.map((o, j) => (
                          <OptionRow key={j} index={j} text={o} disabled state={j === r.answer ? "right" : j === r.picked ? "wrong" : "dim"} />
                        ))}
                        {r.why ? <Rich text={r.why} v="small" tone="muted" /> : null}
                      </View>
                    ) : null}
                  </View>
                );
              })}
            </View>
          </Animated.View>
        ) : q ? (
          <Animated.View key={q.key} entering={reduce ? undefined : FadeIn.duration(motion.state)} style={{ gap: space[5] }} testID={`question-${i}`}>
            <Rich text={q.q} v="h2" />
            <View style={{ gap: space[3] }} accessibilityRole="radiogroup">
              {q.options.map((o, j) => (
                <OptionRow key={j} index={j} text={o} testID={`option-${j}`} state={picked === j ? "picked" : "idle"} onPress={() => setPicks((p) => ({ ...p, [q.key]: j }))} />
              ))}
            </View>
          </Animated.View>
        ) : (
          <T tone="muted">No questions right now. Every question here is already right.</T>
        )}
      </ScrollView>
      <View style={{ borderTopWidth: 1, borderColor: c.hairline, paddingHorizontal: layout.gutter, paddingTop: space[3], paddingBottom: insets.bottom + space[3], gap: space[2] }}>
        {result ? (
          <Button label={doneLabel} icon={<ArrowRight size={20} color={c.onPrimary} />} onPress={onDone} testID="quiz-done" />
        ) : (
          <>
            <Button label={i < questions.length - 1 ? "Next" : "Check my answers"} disabled={picked === undefined} busy={busy} onPress={() => void next()} testID="quiz-next" />
            {i > 0 ? <Button kind="text" full label="Previous question" onPress={() => setI(i - 1)} /> : null}
          </>
        )}
      </View>
      {result && result.total > 0 && result.right === result.total ? <Confetti fire={1} /> : null}
      <Sheet open={leave} onClose={closeLeave} title="Leave the test?">
        <View style={{ gap: space[3] }}>
          <T tone="muted">Your answers so far are not saved.</T>
          <Button
            kind="quiet"
            label="Leave"
            onPress={() => {
              setLeave(false);
              if (router.canGoBack()) router.back();
              else onDone();
            }}
            testID="quiz-leave"
          />
          <Button kind="text" full label="Keep going" onPress={closeLeave} />
        </View>
      </Sheet>
    </View>
  );
}

function QuizSkeleton() {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, padding: layout.gutter, paddingTop: insets.top + 72, gap: space[4] }} testID="quiz-skeleton">
      <Skeleton w="90%" h={26} />
      <Skeleton w="60%" h={26} />
      {[0, 1, 2, 3].map((k) => (
        <Skeleton key={k} h={56} r={12} />
      ))}
    </View>
  );
}

export function CheckpointScreen() {
  const qc = useQueryClient();
  const p = useLocalSearchParams<{ moduleId: string; n: string }>();
  const moduleId = String(p.moduleId ?? "");
  const n = Number(p.n ?? 1);
  const q = useCheckpoint(moduleId, n);
  const done = () => router.replace(`/study/${encodeURIComponent(moduleId)}`);
  if (!q.data) return q.isError ? <LoadError what="this checkpoint" error={q.error} onRetry={() => void q.refetch()} /> : <QuizSkeleton />;
  return (
    <QuizRunner
      title={q.data.title}
      questions={q.data.questions}
      doneLabel="Back to the module"
      onDone={done}
      submit={async (picks) => {
        const r = await api.post<CheckpointResult>(`/study/modules/${encodeURIComponent(moduleId)}/checkpoints/${n}/answers`, { picks });
        qc.setQueryData<LearnStateResult>(keys.learn, (old) => (old ? { ...old, state: r.state } : old));
        void qc.invalidateQueries({ queryKey: keys.module(moduleId) });
        return { right: r.right, total: r.asked, review: r.review };
      }}
    />
  );
}

export function ModuleTestScreen() {
  const qc = useQueryClient();
  const p = useLocalSearchParams<{ moduleId: string }>();
  const moduleId = String(p.moduleId ?? "");
  const mod = useModule(moduleId);
  const testId = mod.data?.sections.find((s) => s.isTest)?.id ?? "test";
  const q = useSection(moduleId, testId);
  const done = () => router.replace(`/study/${encodeURIComponent(moduleId)}`);
  if (!q.data?.test) return q.isError || (q.data && !q.data.test) ? <LoadError what="the module test" error={q.error ?? new Error("not found")} onRetry={() => void q.refetch()} /> : <QuizSkeleton />;
  return (
    <QuizRunner
      title={`Module ${q.data.moduleNum} test`}
      questions={q.data.test.questions}
      doneLabel="Back to the module"
      onDone={done}
      submit={async (picks) => {
        const r = await api.post<ModuleTestResult>(`/study/modules/${encodeURIComponent(moduleId)}/test`, { picks });
        qc.setQueryData<LearnStateResult>(keys.learn, (old) => (old ? { ...old, state: r.state } : old));
        void qc.invalidateQueries({ queryKey: keys.module(moduleId) });
        void qc.invalidateQueries({ queryKey: keys.study });
        void qc.invalidateQueries({ queryKey: keys.achievements });
        return { right: r.right, total: r.total, review: r.review, best: r.best };
      }}
    />
  );
}
