import { useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, Check, ChevronDown, X } from "lucide-react-native";
import * as React from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { CheckpointResult, LearnStateResult, ModuleTestResult, QuestionReview, TestQuestion } from "@/api/contract";
import { messageOf, reasonOf } from "@/api/errors";
import { keys, useCheckpoint, useModule, useSection } from "@/api/queries";
import { api } from "@/auth";
import { BlueField, Button, FieldProgress, HintText, Jyo, Label, Layer, OptionList, QuietEmpty, RoundButton, Sheet, Skeleton, StillTrying, T } from "@/ds";
import { toast } from "@/ds/toast";
import { haptic } from "@/lib/haptics";
import { streakMoment } from "@/moments/host";
import { Confetti, Enter, Press, ProgressRing, RollingNumber, StaggerList, Swap } from "@/motion";
import { useHardwareBack } from "@/nav/back";
import { Pill } from "@/screens/learn/parts";
import { plainText, Rich } from "@/study/rich";
import { fonts, layout, space, useLightStatusBar, useTheme } from "@/theme";

/**
 * Checkpoints and module tests (the question screen of docs/DESIGN.md). On
 * the field: close and how far through. On the layer: one question, its
 * answers as stone pills (the picked one turns ink), and the one lime button
 * pinned low. The server grades (answers are never sent to the phone), so
 * nothing is marked right or wrong until the end. The result is a score on
 * the field, with a ring, and every question with the right answer and why.
 */

type Result = { right: number; total: number; review: QuestionReview[]; best?: number };

/** One reviewed question: a tick or a cross with the word, the question, and on tap every answer and why. */
function ReviewItem({ n, q, r }: { n: number; q: TestQuestion; r: QuestionReview | undefined }) {
  const c = useTheme();
  const [open, setOpen] = React.useState(false);
  const ok = !!r?.correct;
  return (
    <Press testID={`review-${n}`} accessibilityRole="button" accessibilityState={{ expanded: open }} accessibilityLabel={`Question ${n + 1}, ${ok ? "right" : "not right"}. ${plainText(q.q)}`} onPress={() => setOpen((x) => !x)} scale={0.99} innerStyle={{ backgroundColor: c.card, borderRadius: 22, padding: space[3] + 2, gap: space[3] }}>
      <View style={{ flexDirection: "row", alignItems: "flex-start", gap: space[3] }}>
        <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: ok ? c.ink : c.missBg, alignItems: "center", justifyContent: "center" }}>{ok ? <Check size={15} color={c.bg} strokeWidth={3} /> : <X size={15} color={c.ink} strokeWidth={3} />}</View>
        <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
          <T v="caption" tone="muted" num>
            Question {n + 1} · {ok ? "Right" : "Not right"}
          </T>
          <Rich text={q.q} v="bodyStrong" />
        </View>
        <ChevronDown size={18} color={c.faint} style={{ marginTop: 4, transform: [{ rotate: open ? "180deg" : "0deg" }] }} />
      </View>
      {open && r ? (
        <Enter>
          <View style={{ gap: space[2] }} pointerEvents="none">
            <OptionList testID={`review-${n}-options`} options={q.options.map(plainText)} picked={r.picked} checked answer={r.answer} onPick={() => undefined} />
            {r.why ? <HintText testID={`review-${n}-why`}>{plainText(r.why)}</HintText> : null}
          </View>
        </Enter>
      ) : null}
    </Press>
  );
}

export function QuizRunner({ title, questions, submit, onDone, doneLabel }: { title: string; questions: TestQuestion[]; submit: (picks: Record<string, number>) => Promise<Result>; onDone: () => void; doneLabel: string }) {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  useLightStatusBar();
  const [i, setI] = React.useState(0);
  // Forward questions come in from the right, Previous from the left.
  const [dir, setDir] = React.useState<1 | -1>(1);
  const [picks, setPicks] = React.useState<Record<string, number>>({});
  const [result, setResult] = React.useState<Result | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [leave, setLeave] = React.useState(false);
  const scroll = React.useRef<React.ComponentRef<typeof ScrollView>>(null);
  const q = questions[i];
  const picked = q ? picks[q.key] : undefined;
  const dirty = Object.keys(picks).length > 0 && !result;

  const exit = React.useCallback(() => {
    if (dirty) setLeave(true);
    else if (router.canGoBack()) router.back();
    else onDone();
  }, [dirty, onDone]);

  useHardwareBack(() => {
    exit();
    return true;
  });

  const next = async () => {
    if (!q || picked === undefined) return;
    if (i < questions.length - 1) {
      setDir(1);
      setI(i + 1);
      scroll.current?.scrollTo({ y: 0, animated: false });
      return;
    }
    setBusy(true);
    try {
      const r = await submit(picks);
      if (r.right === r.total) haptic.success();
      setResult(r);
      streakMoment.done();
      scroll.current?.scrollTo({ y: 0, animated: false });
    } catch (e) {
      haptic.warn();
      toast.show(messageOf(e));
    } finally {
      setBusy(false);
    }
  };

  const closeLeave = React.useCallback(() => setLeave(false), []);
  const pct = result ? Math.round((result.right / Math.max(1, result.total)) * 100) : 0;
  const good = pct >= 70;
  const perfect = !!result && result.total > 0 && result.right === result.total;
  const answered = Object.keys(picks).length;

  return (
    <View testID="quiz" style={{ flex: 1, backgroundColor: c.field }}>
      <BlueField style={{ gap: space[4] }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: space[3] }}>
          <RoundButton onField label={result ? "Close" : "Leave the test"} onPress={result ? onDone : exit} testID="quiz-close">
            <X size={20} color={c.onField} />
          </RoundButton>
          <View style={{ flex: 1 }}>{result ? <T v="small" tone="onFieldMuted" numberOfLines={1}>{title}</T> : <FieldProgress done={answered} total={Math.max(1, questions.length)} label={`${Math.min(i + 1, questions.length)} of ${questions.length}`} />}</View>
        </View>
        {result ? (
          <Enter testID="quiz-result">
            <View style={{ flexDirection: "row", alignItems: "center", gap: space[4], paddingBottom: space[2] }}>
              <ProgressRing pct={pct} size={84} stroke={8} delay={250} color={c.lime} track={c.fieldTint} label={`${pct}%`}>
                <T v="bodyStrong" tone="onField" num>
                  {pct}%
                </T>
              </ProgressRing>
              <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
                <View accessible accessibilityLabel={`${result.right} of ${result.total} right`} style={{ flexDirection: "row", alignItems: "baseline" }}>
                  <RollingNumber value={result.right} tone="onField" style={{ fontFamily: fonts.big, fontSize: 46, lineHeight: 48, letterSpacing: -1 }} />
                  <T tone="onFieldMuted" num maxFontSizeMultiplier={1.2} style={{ fontFamily: fonts.big, fontSize: 24, lineHeight: 30 }}>
                    {` of ${result.total}`}
                  </T>
                </View>
                <T v="h3" tone="onField">
                  {perfect ? "Every one right" : good ? "A good result" : "Worth another read"}
                </T>
                {result.best !== undefined ? <Pill tone="field">{`Your best: ${result.best} of ${result.total}`}</Pill> : null}
              </View>
            </View>
          </Enter>
        ) : (
          <T v="small" tone="onFieldMuted" numberOfLines={1}>
            {title}
          </T>
        )}
      </BlueField>
      <Layer style={{ paddingHorizontal: 0, paddingTop: 0, gap: 0 }}>
        <ScrollView ref={scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: layout.gutter, paddingTop: space[5], gap: space[4], width: "100%", maxWidth: layout.readingWidth + layout.gutter * 2, alignSelf: "center" }}>
          {result ? (
            <>
              {perfect ? (
                <View style={{ flexDirection: "row", alignItems: "center", gap: space[3] }}>
                  <Jyo pose="wellDone" size={56} />
                  <T style={{ flex: 1 }}>Nothing to fix here. Come back for the re-test when it is due.</T>
                </View>
              ) : null}
              <Label>{perfect ? "Your answers" : "Tap a question to see the right answer and why"}</Label>
              <StaggerList style={{ gap: space[2] }}>
                {questions.map((qq, n) => (
                  <ReviewItem key={qq.key} n={n} q={qq} r={result.review.find((x) => x.key === qq.key)} />
                ))}
              </StaggerList>
            </>
          ) : q ? (
            <Swap k={q.key} dir={dir} style={{ gap: space[4] }} testID={`question-${i}`}>
              <Rich text={q.q} v="h2" accessibilityRole="header" />
              <OptionList testID="option" options={q.options.map(plainText)} picked={picked ?? null} onPick={(j) => setPicks((p) => ({ ...p, [q.key]: j }))} />
            </Swap>
          ) : (
            <QuietEmpty title="No questions right now" body="Every question here is already right." />
          )}
        </ScrollView>
        <View style={{ paddingHorizontal: layout.gutter, paddingTop: space[2], paddingBottom: insets.bottom + space[3], gap: space[1], backgroundColor: c.bg }}>
          {result ? (
            <Button label={doneLabel} onPress={onDone} testID="quiz-done" />
          ) : (
            <>
              <Button label={i < questions.length - 1 ? "Next" : "Check my answers"} disabled={picked === undefined} busy={busy} needsServer={i >= questions.length - 1} onPress={() => void next()} testID="quiz-next" />
              {/* The row is always there (hidden on the first question) so Next never moves under the thumb. */}
              <View style={{ opacity: i > 0 ? 1 : 0 }} pointerEvents={i > 0 ? "auto" : "none"} accessibilityElementsHidden={i === 0} importantForAccessibility={i > 0 ? "auto" : "no-hide-descendants"}>
                <Button kind="text" full label="Previous question" icon={<ArrowLeft size={18} color={c.link} />} disabled={i === 0} onPress={() => { setDir(-1); setI(i - 1); }} testID="quiz-prev" />
              </View>
            </>
          )}
        </View>
      </Layer>
      {perfect ? <Confetti fire={1} /> : null}
      <Sheet open={leave} onClose={closeLeave} title="Leave the test?">
        <View style={{ gap: space[3] }}>
          <T tone="muted">Your answers so far are not saved.</T>
          <Button kind="ink" label="Keep going" onPress={closeLeave} />
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
        </View>
      </Sheet>
    </View>
  );
}

/** Waiting for the questions, or the calm line when they could not load: the same field and layer, with a way out. */
function QuizWait({ what, failed, error, onRetry, onClose }: { what: string; failed: boolean; error: unknown; onRetry: () => void; onClose: () => void }) {
  const c = useTheme();
  useLightStatusBar();
  return (
    <View testID={error ? "quiz-error" : "quiz-skeleton"} style={{ flex: 1, backgroundColor: c.field }}>
      <BlueField>
        <RoundButton onField label="Close" onPress={onClose} testID="quiz-close">
          <X size={20} color={c.onField} />
        </RoundButton>
      </BlueField>
      <Layer>
        {error ? (
          <QuietEmpty testID="load-error" title={`Could not load ${what}`} body={reasonOf(error)} action={{ label: "Try again", onPress: onRetry }} />
        ) : (
          <View style={{ gap: space[3] }}>
            <Skeleton w="90%" h={26} />
            <Skeleton w="60%" h={26} />
            {[0, 1, 2, 3].map((k) => (
              <Skeleton key={k} h={52} r={layout.radius} />
            ))}
            <StillTrying failed={failed} />
          </View>
        )}
      </Layer>
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
  const close = () => (router.canGoBack() ? router.back() : done());
  if (!q.data) return <QuizWait what="this checkpoint" failed={q.failureCount > 0} error={q.isError ? q.error : null} onRetry={() => void q.refetch()} onClose={close} />;
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
  const close = () => (router.canGoBack() ? router.back() : done());
  if (!q.data?.test) return <QuizWait what="the module test" failed={q.failureCount > 0} error={q.isError ? q.error : q.data && !q.data.test ? new Error("not found") : null} onRetry={() => void q.refetch()} onClose={close} />;
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
