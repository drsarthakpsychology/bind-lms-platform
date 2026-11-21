import { router } from "expo-router";
import { ArrowLeft, ArrowRight, Check, RotateCcw, Sparkles } from "lucide-react-native";
import * as React from "react";
import { Pressable, View } from "react-native";
import Animated, { FadeInDown, useReducedMotion } from "react-native-reanimated";

import { Button, Field, LoadError, ProgressLine, RowsSkeleton, Section, StillTrying, T, Tint } from "@/ds";
import { haptic } from "@/lib/haptics";
import { layout, motion, space, useTheme } from "@/theme";
import { play, useMove, useRead } from "../api";
import type { PrepInterview } from "../contract";
import { GameFrame } from "../frame";

type Q = PrepInterview["questions"][number];
type Rubric = { modelAnswer: string; mustCover: string[]; redFlags: string[] };
export type SelfScore = { pct: number; band: "strong" | "okay" | "weak" };
type Done = { id: string; answer: string; covered: string[]; flags: string[]; feedback: string | null; score: SelfScore };

/** The website's selfScore (src/lib/prep/interview.ts): share of points covered, minus 15 per red flag. The server works it out again on save. */
export function selfScore(mustCover: number, covered: number, redFlags: number): SelfScore {
  const base = mustCover > 0 ? (Math.min(covered, mustCover) / mustCover) * 100 : 0;
  const pct = Math.max(0, Math.min(100, Math.round(base - 15 * Math.max(0, redFlags))));
  return { pct, band: pct >= 75 ? "strong" : pct >= 45 ? "okay" : "weak" };
}

const BAND: Record<SelfScore["band"], string> = { strong: "Strong", okay: "Getting there", weak: "Needs work" };
const words = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;
const isErr = (x: unknown): x is { error: string } => !!x && typeof x === "object" && typeof (x as { error?: unknown }).error === "string";

function Tick({ label, on, warn, onPress, testID }: { label: string; on: boolean; warn?: boolean; onPress: () => void; testID?: string }) {
  const c = useTheme();
  const fill = on ? (warn ? c.danger : c.ink) : "transparent";
  return (
    <Pressable testID={testID} accessibilityRole="checkbox" accessibilityState={{ checked: on }} accessibilityLabel={label} onPress={onPress} style={{ flexDirection: "row", gap: space[3], minHeight: layout.target, alignItems: "center" }}>
      <View style={{ width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: warn ? c.danger : c.ink, backgroundColor: fill, alignItems: "center", justifyContent: "center" }}>{on ? <Check size={14} color={c.bg} strokeWidth={3} /> : null}</View>
      <T style={{ flex: 1 }}>{label}</T>
    </Pressable>
  );
}

/**
 * Mock interview (GET /prep/interview), as the website's /prep/interview:
 * question, answer, one follow-up, then tick what you covered against the
 * rubric, read a strong answer, ask for AI feedback if you like, next. The
 * session is saved at the end (the server scores it again). The phone's
 * keyboard has its own microphone, so speaking an answer needs nothing here.
 */
export function InterviewScreen() {
  const q = useRead<PrepInterview>("/prep/interview");
  const [round, setRound] = React.useState(0);
  const [panel, setPanel] = React.useState<{ round: number; data: PrepInterview } | null>(null);
  if (q.data && (!panel || panel.round !== round) && !q.isFetching) setPanel({ round, data: q.data });
  const again = () => {
    void q.refetch().then(() => setRound((r) => r + 1));
  };
  if (!panel) {
    return (
      <GameFrame title="Mock interview" testID="interview">
        {q.isError ? (
          <LoadError error={q.error} what="the interview" onRetry={() => void q.refetch()} />
        ) : (
          <View style={{ gap: space[3] }}>
            <RowsSkeleton rows={3} />
            <StillTrying failed={q.failureCount > 0} />
          </View>
        )}
      </GameFrame>
    );
  }
  return <Panel key={panel.round} questions={panel.data.questions} saving={panel.data.saving} onAgain={again} again={q.isFetching} />;
}

function Panel({ questions, saving, onAgain, again }: { questions: Q[]; saving: boolean; onAgain: () => void; again: boolean }) {
  const c = useTheme();
  const reduce = useReducedMotion();
  const mv = useMove();
  const [idx, setIdx] = React.useState(-1);
  const [stage, setStage] = React.useState<"answer" | "follow" | "check">("answer");
  const [main, setMain] = React.useState("");
  const [follow, setFollow] = React.useState("");
  const [rubric, setRubric] = React.useState<Rubric | null>(null);
  const [covered, setCovered] = React.useState<string[]>([]);
  const [flags, setFlags] = React.useState<string[]>([]);
  const [feedback, setFeedback] = React.useState<{ text?: string; error?: string } | null>(null);
  const [asking, setAsking] = React.useState(false);
  const [done, setDone] = React.useState<Done[]>([]);
  const [saved, setSaved] = React.useState<{ saved: boolean; score: number } | null>(null);

  if (!questions.length) {
    return (
      <GameFrame title="Mock interview" testID="interview">
        <T v="h3">Interview questions are still being added.</T>
        <T tone="muted">Check back soon.</T>
      </GameFrame>
    );
  }

  const cur = questions[idx];
  const answer = [main.trim(), follow.trim() ? `Follow-up: ${follow.trim()}` : ""].filter(Boolean).join("\n\n");
  const score = rubric ? selfScore(rubric.mustCover.length, covered.length, flags.length) : null;
  const toggle = (list: string[], set: (v: string[]) => void, x: string) => {
    haptic.select();
    set(list.includes(x) ? list.filter((y) => y !== x) : [...list, x]);
  };

  const toRubric = () =>
    void mv.run(async () => {
      if (!cur) return;
      const r = await play<Rubric | { error: string }>("prep", "interviewReveal", cur.id);
      if (isErr(r)) throw new Error(r.error);
      setRubric(r);
      setStage("check");
    });

  const askAi = async () => {
    if (!cur) return;
    setAsking(true);
    try {
      const r = await play<{ text: string } | { error: string }>("prep", "interviewFeedback", { id: cur.id, answer });
      setFeedback(isErr(r) ? { error: r.error } : { text: r.text });
    } catch {
      setFeedback({ error: "Couldn't get feedback. Try again in a moment." });
    } finally {
      setAsking(false);
    }
  };

  const next = () => {
    if (!cur || !score) return;
    const list = [...done, { id: cur.id, answer, covered, flags, feedback: feedback?.text ?? null, score }];
    setDone(list);
    setMain("");
    setFollow("");
    setRubric(null);
    setCovered([]);
    setFlags([]);
    setFeedback(null);
    setStage("answer");
    setIdx(idx + 1);
    if (idx + 1 >= questions.length) {
      haptic.success();
      const avg = Math.round(list.reduce((a, d) => a + d.score.pct, 0) / list.length);
      void play<{ saved: boolean; score: number }>("prep", "interviewSave", { items: list.map((d) => ({ id: d.id, answer: d.answer, covered: d.covered, flags: d.flags, feedback: d.feedback })) })
        .then((r) => setSaved(r && typeof r.score === "number" ? r : { saved: false, score: avg }))
        .catch(() => setSaved({ saved: false, score: avg }));
    }
  };

  if (idx < 0) {
    return (
      <GameFrame title="Mock interview" testID="interview" howTo={["Answer the question and its follow-up.", "Then tick what you covered and read a strong answer."]} thumb={<Button label="Start" icon={<ArrowRight size={20} color={c.onPrimary} />} onPress={() => setIdx(0)} testID="interview-start" />}>
        <T v="h2">A panel asks. You answer.</T>
        <T tone="muted">Each question has a follow-up.</T>
      </GameFrame>
    );
  }

  if (idx >= questions.length) {
    const avg = saved?.score ?? Math.round(done.reduce((a, d) => a + d.score.pct, 0) / Math.max(1, done.length));
    return (
      <GameFrame
        title="Mock interview"
        testID="interview-done"
        score={`${avg}%`}
        scoreLabel="Covered"
        thumb={
          <View style={{ gap: space[2] }}>
            <Button label="Back to Exam Prep" onPress={() => (router.canGoBack() ? router.back() : router.replace("/prep"))} testID="interview-back" />
            <Button kind="quiet" label={again ? "Finding questions" : "Another panel"} icon={<RotateCcw size={18} color={c.ink} />} busy={again} onPress={onAgain} testID="interview-again" />
          </View>
        }
      >
        <T v="h2">{`You covered ${avg}% of the key points`}</T>
        <T tone="muted" testID="interview-saved">
          {saved === null ? "Saving" : saved.saved ? "Saved. Each new panel mixes in questions you haven't had." : saving ? "Couldn't save this session, but your scores are here." : "Staff preview: nothing was saved."}
        </T>
        <View style={{ gap: space[3] }}>
          {done.map((d, i) => (
            <View key={d.id} style={{ flexDirection: "row", gap: space[3], alignItems: "center" }}>
              <T v="score" num style={{ width: 20 }}>
                {i + 1}
              </T>
              <T v="small" style={{ flex: 1 }}>
                {questions[i]?.question}
              </T>
              <T v="caption" tone={d.score.band === "weak" ? "danger" : d.score.band === "strong" ? "link" : "muted"}>
                {BAND[d.score.band]}
              </T>
            </View>
          ))}
        </View>
      </GameFrame>
    );
  }

  if (!cur) return null;

  const thumb =
    stage === "answer" ? (
      <Button label="I've answered" icon={<ArrowRight size={20} color={c.onPrimary} />} disabled={words(main) < 3 || mv.pending} busy={mv.pending} onPress={() => (cur.followUp ? setStage("follow") : toRubric())} testID="interview-answered" />
    ) : stage === "follow" ? (
      <View style={{ gap: space[2] }}>
        <Button label="Check my answer" icon={<ArrowRight size={20} color={c.onPrimary} />} disabled={words(follow) < 3 || mv.pending} busy={mv.pending} onPress={toRubric} testID="interview-check" />
        <Button kind="quiet" label="Skip the follow-up" disabled={mv.pending} onPress={toRubric} testID="interview-skip" />
      </View>
    ) : (
      <View style={{ flexDirection: "row", gap: space[2] }}>
        <Button kind="quiet" label="Change it" icon={<ArrowLeft size={18} color={c.ink} />} onPress={() => setStage("answer")} style={{ flex: 1 }} testID="interview-change" />
        <Button label={idx + 1 >= questions.length ? "Finish" : "Next question"} onPress={next} style={{ flex: 1 }} testID="interview-next" />
      </View>
    );

  return (
    <GameFrame title="Mock interview" testID="interview-play" confirmLeave={idx >= 0} hud={<ProgressLine value={(idx / questions.length) * 100} height={4} />} thumb={thumb}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", gap: space[3] }}>
        <T v="small">{`Question ${idx + 1}`}</T>
        <T v="small" tone="muted">
          {cur.category}
        </T>
      </View>
      <T v="h2" testID="interview-question">
        {cur.question}
      </T>

      {stage === "answer" ? <Field label="Your answer" area value={main} onChangeText={setMain} placeholder="Answer as you would to the panel." testID="interview-main" /> : null}

      {stage === "follow" && cur.followUp ? (
        <Animated.View entering={reduce ? undefined : FadeInDown.duration(motion.fill)} style={{ gap: space[3] }}>
          <Tint>
            <T v="caption" tone="muted">
              Follow-up
            </T>
            <T v="h3">{cur.followUp}</T>
          </Tint>
          <Field label="Your answer to the follow-up" area value={follow} onChangeText={setFollow} testID="interview-follow" />
        </Animated.View>
      ) : null}

      {mv.error ? (
        <T tone="danger" testID="interview-error">
          {mv.error}
        </T>
      ) : null}

      {stage === "check" && rubric && score ? (
        <Animated.View entering={reduce ? undefined : FadeInDown.duration(motion.fill)} style={{ gap: space[6] }} testID="interview-rubric">
          <Section title="Did you cover these?">
            {rubric.mustCover.map((m, k) => (
              <Tick key={m} label={m} on={covered.includes(m)} onPress={() => toggle(covered, setCovered, m)} testID={`interview-cover-${k}`} />
            ))}
          </Section>
          <Section title="Did you do any of these?">
            <T v="small" tone="muted">
              These lose marks with a panel.
            </T>
            {rubric.redFlags.map((m, k) => (
              <Tick key={m} label={m} warn on={flags.includes(m)} onPress={() => toggle(flags, setFlags, m)} testID={`interview-flag-${k}`} />
            ))}
          </Section>
          <T v="h3" accessibilityLiveRegion="polite" testID="interview-score">
            {`This one: ${score.pct}%, ${BAND[score.band].toLowerCase()}`}
          </T>
          <Section title="A strong answer">
            <T>{rubric.modelAnswer}</T>
          </Section>
          <Section title="What you said" quiet>
            <T v="small" tone="muted">
              {answer}
            </T>
          </Section>
          {feedback?.text ? (
            <Section title="AI feedback">
              <T testID="interview-feedback">{feedback.text}</T>
              <T v="caption" tone="muted">
                Written by AI. Use it as a second opinion, not a verdict.
              </T>
            </Section>
          ) : (
            <Button kind="text" label={asking ? "Reading your answer" : "Get AI feedback"} icon={<Sparkles size={18} color={c.link} />} busy={asking} onPress={() => void askAi()} testID="interview-ai" />
          )}
          {feedback?.error ? (
            <T v="small" tone="muted">
              {feedback.error}
            </T>
          ) : null}
        </Animated.View>
      ) : null}
    </GameFrame>
  );
}
